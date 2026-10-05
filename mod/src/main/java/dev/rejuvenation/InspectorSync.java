package dev.rejuvenation;

import com.cobblemon.mod.common.api.battles.model.PokemonBattle;
import com.cobblemon.mod.common.api.battles.model.actor.BattleActor;
import com.cobblemon.mod.common.battles.BattleRegistry;
import com.cobblemon.mod.common.battles.actor.PlayerBattleActor;
import com.cobblemon.mod.common.battles.actor.PokemonBattleActor;
import com.cobblemon.mod.common.battles.pokemon.BattlePokemon;
import com.cobblemon.mod.common.battles.ShowdownActionRequest;
import com.cobblemon.mod.common.battles.ShowdownMoveset;
import com.cobblemon.mod.common.battles.InBattleGimmickMove;
import com.google.gson.*;
import dev.rejuvenation.net.FieldPayloads;
import net.fabricmc.fabric.api.networking.v1.ServerPlayNetworking;
import net.minecraft.class_3222;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * When a player is asked to choose, evaluates that player's active moves against every opposing active Pokémon
 * with the field engine and sends the results to the player's client, where the move-tooltip damage preview uses
 * them. Gimmick variants and benched Pokémon (Battle Extras' switch screen) are evaluated on demand, when the
 * client shows them: each request is validated against the player's own team, the current request's legal
 * gimmicks and the opposing actives, and bounded per request and per turn, so the server thread only measures
 * what is displayed. Battles without a field send nothing. Disable with {@code -Drejuvenation.moveEvaluations=false}.
 */
public final class InspectorSync {
    private InspectorSync() {}
    private static final boolean ENABLED = !"false".equals(System.getProperty("rejuvenation.moveEvaluations"));
    static final int MAX_PER_REQUEST = 24, MAX_PER_TURN = 160;
    private record Budget(UUID battle, int turn, int used) {}
    private static final Map<UUID, Budget> budgets = new ConcurrentHashMap<>();
    private record Decision(UUID battle, int turn, long serial) {}
    private static final Map<UUID, Decision> decisions = new ConcurrentHashMap<>();
    private static final java.util.concurrent.atomic.AtomicLong sequence = new java.util.concurrent.atomic.AtomicLong();
    public static void forget(UUID battle) { decisions.entrySet().removeIf(e -> e.getValue().battle().equals(battle)); budgets.entrySet().removeIf(e -> e.getValue().battle().equals(battle)); }
    public static void clear() { decisions.clear(); budgets.clear(); }
    public static final Set<String> GIMMICKS = Set.of("mega", "ultra", "terastallize", "zmove", "dynamax");

    public static void choiceRequested(PlayerBattleActor actor) {
        try {
            var battle = actor.getBattle();
            // The field panel resynchronises at every choice, whether or not move previews are enabled.
            FieldStateSync.resync(battle);
            if (!ENABLED) return;
            // Requests can change within a simulator turn (pivot/forced switch, forms, HP, items).
            FieldEvaluator.forget(battle.getBattleId());
            if (FieldApi.current(battle.getBattleId()).isEmpty()) return;
            var request = actor.getRequest();
            if (request == null || request.getWait()) return;
            var player = actor.getEntity();
            if (player == null || !ServerPlayNetworking.canSend(player, FieldPayloads.MoveEvaluations.ID)) return;
            decisions.put(player.method_5667(), new Decision(battle.getBattleId(), battle.getTurn(), sequence.incrementAndGet()));
            var queries = new ArrayList<FieldEvaluator.Query>();
            var actives = actor.getActivePokemon();
            for (int i = 0; i < actives.size(); i++) {
                var user = actives.get(i).getBattlePokemon();
                if (user == null || user.getHealth() <= 0) continue;
                List<String> moves = new ArrayList<>();
                if (request.getActive() != null && i < request.getActive().size() && request.getActive().get(i) != null)
                    for (var move : request.getActive().get(i).getMoves()) moves.add(move.getId());
                if (moves.isEmpty()) for (var move : user.getMoveSet().getMoves()) moves.add(move.getName());
                for (var target : opposingActives(actor)) for (String move : moves)
                    queries.add(new FieldEvaluator.Query(user.getUuid(), move, target.getUuid(), null, true));
            }
            send(player, battle, FieldEvaluator.evaluate(battle, queries, "move preview"), false);
        } catch (Exception error) {
            RejuvenationFields.LOG.error("Could not prepare field-aware move previews", error);
        }
    }

    /** An on-demand request from the player's client; invalid or excess queries are dropped, never trusted. */
    public static void requested(class_3222 player, String text) {
        if (!ENABLED || player == null) return;
        try {
            var json = JsonParser.parseString(text).getAsJsonObject();
            PokemonBattle battle = BattleRegistry.getBattleByParticipatingPlayer(player);
            if (battle == null || !json.has("battle") || !battle.getBattleId().toString().equals(json.get("battle").getAsString())) return;
            if (FieldApi.current(battle.getBattleId()).isEmpty() || !(battle.getActor(player) instanceof PlayerBattleActor actor)) return;
            var request = actor.getRequest();
            if (request == null || request.getWait()) return;
            var decision = decisions.get(player.method_5667());
            if (decision == null || !decision.battle().equals(battle.getBattleId()) || decision.turn() != battle.getTurn()
                || !matchesDecision(json, battle.getTurn(), decision.serial())) return;
            var queries = validate(actor, request, json.getAsJsonArray("queries"));
            var budget = budgets.merge(player.method_5667(), new Budget(battle.getBattleId(), battle.getTurn(), 0),
                (old, fresh) -> old.battle().equals(fresh.battle()) && old.turn() == fresh.turn() ? old : fresh);
            int allowed = Math.max(0, MAX_PER_TURN - budget.used());
            if (queries.size() > allowed) queries = queries.subList(0, allowed);
            if (queries.isEmpty()) return;
            budgets.put(player.method_5667(), new Budget(budget.battle(), budget.turn(), budget.used() + queries.size()));
            boolean bench = queries.stream().anyMatch(FieldEvaluator.Query::bench);
            send(player, battle, FieldEvaluator.evaluate(battle, queries, bench ? "switch preview" : "gimmick preview"), true);
        } catch (RuntimeException error) {
            RejuvenationFields.LOG.debug("Ignored malformed field evaluation request", error);
        }
    }

    /** Turn alone is insufficient: forced switches and pivots can open a second decision in the same turn. */
    static boolean matchesDecision(JsonObject request, int turn, long serial) {
        try { return request.has("turn") && request.get("turn").getAsInt() == turn && request.has("decision") && request.get("decision").getAsLong() == serial; }
        catch (RuntimeException malformed) { return false; }
    }

    /** The queries a client may ask for: its own living Pokémon, known moves, opposing actives and legal gimmicks. */
    static List<FieldEvaluator.Query> validate(PlayerBattleActor actor, ShowdownActionRequest request, JsonArray rows) {
        var out = new ArrayList<FieldEvaluator.Query>();
        if (rows == null) return out;
        var own = new HashMap<UUID, BattlePokemon>();
        for (var pokemon : actor.getPokemonList()) own.put(pokemon.getUuid(), pokemon);
        var activeIndex = new HashMap<UUID, Integer>();
        var actives = actor.getActivePokemon();
        for (int i = 0; i < actives.size(); i++) { var p = actives.get(i).getBattlePokemon(); if (p != null) activeIndex.put(p.getUuid(), i); }
        var foes = new HashSet<UUID>();
        for (var foe : opposingActives(actor)) foes.add(foe.getUuid());
        for (var element : rows) {
            if (out.size() >= MAX_PER_REQUEST) break;
            if (!element.isJsonObject()) continue;
            var q = element.getAsJsonObject();
            UUID user, target;
            try { user = UUID.fromString(q.get("user").getAsString()); target = UUID.fromString(q.get("target").getAsString()); }
            catch (RuntimeException invalid) { continue; }
            String move = q.has("move") ? q.get("move").getAsString().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", "") : "";
            String gimmick = q.has("gimmick") && !q.get("gimmick").isJsonNull() ? q.get("gimmick").getAsString() : null;
            boolean bench = q.has("bench") && q.get("bench").getAsBoolean();
            var pokemon = own.get(user);
            if (pokemon == null || pokemon.getHealth() <= 0 || !foes.contains(target) || move.isEmpty() || !knows(pokemon, move)) continue;
            if (gimmick != null && !GIMMICKS.contains(gimmick)) continue;
            Integer index = activeIndex.get(user);
            if (bench) { if (index != null || gimmick != null) continue; }
            else if (index == null || gimmick == null || !legal(request, index, move, gimmick)) continue;
            out.add(new FieldEvaluator.Query(user, move, target, gimmick, true, bench));
        }
        return out;
    }

    private static boolean knows(BattlePokemon pokemon, String move) {
        for (var known : pokemon.getMoveSet().getMoves()) if (known.getName().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", "").equals(move)) return true;
        return false;
    }

    /** Legal exactly as the request's sanitized gimmick flags offer it for that active Pokémon and move. */
    static boolean legal(ShowdownActionRequest request, int index, String move, String gimmick) {
        if (request.getActive() == null || index >= request.getActive().size()) return false;
        ShowdownMoveset moveset = request.getActive().get(index);
        if (moveset == null) return false;
        int m = -1;
        for (int i = 0; i < moveset.getMoves().size(); i++) if (moveset.getMoves().get(i).getId().equals(move)) m = i;
        if (m < 0) return false;
        return switch (gimmick) {
            case "mega" -> moveset.getCanMegaEvo();
            case "ultra" -> moveset.getCanUltraBurst();
            case "terastallize" -> moveset.getCanTerastallize() != null;
            case "zmove" -> available(moveset.getCanZMove(), m);
            case "dynamax" -> moveset.getCanDynamax() && available(moveset.getMaxMoves(), m);
            default -> false;
        };
    }

    private static List<BattlePokemon> opposingActives(PlayerBattleActor actor) {
        var targets = new ArrayList<BattlePokemon>();
        for (BattleActor other : actor.getBattle().getActors()) {
            if (other.getSide() == actor.getSide()) continue;
            // Cobblemon's already-out wild actor owns its single Pokemon directly;
            // the initial switch does not populate its ActiveBattlePokemon pointer.
            if (other instanceof PokemonBattleActor wild) targets.add(wild.getPokemon());
            else for (var foe : other.getActivePokemon()) targets.add(foe.getBattlePokemon());
        }
        targets.removeIf(t -> t == null || t.getHealth() <= 0);
        return targets;
    }

    private static void send(class_3222 player, PokemonBattle battle, Map<FieldEvaluator.Query, FieldEvaluator.Result> results, boolean merge) {
        // The eager packet is sent even when empty: it opens the decision for on-demand requests on the client.
        if ((merge && results.isEmpty()) || !ServerPlayNetworking.canSend(player, FieldPayloads.MoveEvaluations.ID)) return;
        var json = new JsonObject();
        json.addProperty("battle", battle.getBattleId().toString());
        json.addProperty("turn", battle.getTurn());
        var decision = decisions.get(player.method_5667());
        if (decision != null) json.addProperty("decision", decision.serial());
        if (merge) json.addProperty("merge", true);
        FieldApi.current(battle.getBattleId()).ifPresent(state -> json.addProperty("field", state.get("field").getAsString()));
        var entries = new JsonArray();
        for (var result : results.values()) entries.add(entry(result));
        json.add("entries", entries);
        ServerPlayNetworking.send(player, new FieldPayloads.MoveEvaluations(json.toString()));
    }

    private static boolean available(List<InBattleGimmickMove> moves,int i) { return moves!=null && i<moves.size() && moves.get(i)!=null && !moves.get(i).getDisabled(); }

    private static boolean flag(FieldEvaluator.Measurement m, String key) { return m.data().has(key) && m.data().get(key).getAsBoolean(); }
    public static JsonObject entry(FieldEvaluator.Result result) {
        var o = new JsonObject();
        var q = result.query(); var f = result.field(); var n = result.nativeRules();
        o.addProperty("user", q.user().toString()); o.addProperty("move", q.move()); o.addProperty("target", q.target().toString());
        if (q.gimmick()!=null) o.addProperty("gimmick",q.gimmick());
        if (q.bench()) o.addProperty("bench", true);
        // A random additional type leaves effectiveness, immunity and damage uncertain; random power, damage, called
        // moves or targets leave only the damage uncertain. Uncertain facts are omitted, never sent as a seeded sample.
        boolean uncertainType = flag(f, "randomSecondaryType"), uncertainRange = uncertainType || flag(f, "uncertainDamageRange");
        if (!uncertainRange) result.damageFactor().ifPresent(v -> o.addProperty("factor", v));
        o.addProperty("fieldBlocks", !uncertainType && result.fieldBlocks()); o.addProperty("nativeBlocks", result.nativeBlocks());
        for (String key : List.of("totalMinDamage", "totalMaxDamage", "targetHp", "targetMaxHp", "minHits", "maxHits", "survivesLethal"))
            if (f.data().has(key)) o.add(key, f.data().get(key));
        if (f.alwaysHits()) o.addProperty("accuracy", -1); else f.accuracy().ifPresent(v -> o.addProperty("accuracy", v));
        f.priority().ifPresent(v -> o.addProperty("priority", v));
        f.type().ifPresent(v -> o.addProperty("type", v)); n.type().ifPresent(v -> o.addProperty("nativeType", v));
        f.category().ifPresent(v -> o.addProperty("category", v)); n.category().ifPresent(v -> o.addProperty("nativeCategory", v));
        f.basePower().ifPresent(v -> o.addProperty("basePower", v));
        // Effectiveness facts: a random additional type has no single certified effectiveness or immunity.
        if (!uncertainType) { f.typeMod().ifPresent(v -> o.addProperty("typeMod", v)); o.addProperty("immune", f.immune()); }
        f.critRatio().ifPresent(v -> o.addProperty("critRatio", v));
        f.statusApplies().ifPresent(v -> o.addProperty("statusApplies", v));
        if (f.data().has("critBlocked")) o.addProperty("critBlocked", f.data().get("critBlocked").getAsBoolean());
        if (f.data().has("changesFieldTo") && !f.data().get("changesFieldTo").isJsonNull()) {
            String target = f.data().get("changesFieldTo").getAsString();
            o.addProperty("changesFieldTo", FieldStateSync.displayName(target));
        }
        return o;
    }
}
