package dev.rejuvenation.client;

import com.cobblemon.mod.common.client.CobblemonClient;
import com.google.gson.*;
import java.util.*;

/**
 * Client copy of the server's field state and of the field-aware move evaluations for the current decision.
 * Both arrive as payloads derived from the simulator; nothing here derives field state itself.
 */
public final class ClientFieldState {
    private ClientFieldState() {}
    public record State(UUID battle, String field, String name, int duration, String overlay, String overlayName, int overlayDuration, long changedAt) {}
    public record Evaluation(UUID user, String move, UUID target, String gimmick, OptionalDouble factor, boolean fieldBlocks, boolean nativeBlocks,
                             OptionalDouble accuracy, OptionalInt priority, String type, String nativeType, String category, String nativeCategory,
                             OptionalInt basePower, OptionalInt critRatio, Optional<Boolean> statusApplies, String changesFieldTo,
                             OptionalInt minDamage, OptionalInt maxDamage, int targetHp, int targetMaxHp, int minHits, int maxHits,
                             OptionalInt typeMod, boolean immune) {}
    private record Key(UUID user, String move, UUID target, String gimmick) {}

    private static volatile State state;
    private static volatile String previousField;
    private static volatile long previousChangedAt;
    private static volatile UUID evaluationBattle;
    private static volatile int evaluationTurn;
    private static volatile long evaluationDecision;
    private static volatile Map<Key, Evaluation> evaluations = Map.of();
    /** Incremented whenever new evaluations arrive, so tooltip caches can be invalidated. */
    private static volatile int evaluationRevision;
    private static final Set<UUID> endedBattles=new LinkedHashSet<>();

    static void acceptState(String text) {
        var json = JsonParser.parseString(text).getAsJsonObject();
        var battle = UUID.fromString(json.get("battle").getAsString());
        if (!json.has("field") || json.get("field").isJsonNull()) {
            endedBattles.add(battle);if(endedBattles.size()>128)endedBattles.remove(endedBattles.iterator().next());
            if (state != null && state.battle().equals(battle)) { state = null; previousField = null; }
            if (battle.equals(evaluationBattle)) clearEvaluations();
            return;
        }
        if(endedBattles.contains(battle))return;
        var old = state;
        String field = json.get("field").getAsString();
        // A state transition invalidates all old mechanics, including same-field counter/duration changes.
        clearEvaluations();
        boolean changed = old == null || !old.battle().equals(battle) || !old.field().equals(field);
        if (changed && old != null && old.battle().equals(battle)) { previousField = old.field(); previousChangedAt = System.currentTimeMillis(); }
        if (old == null || !old.battle().equals(battle)) previousField = null;
        state = new State(battle, field, json.get("name").getAsString(), json.has("duration") ? json.get("duration").getAsInt() : 0,
            json.has("overlay") ? json.get("overlay").getAsString() : null, json.has("overlayName") ? json.get("overlayName").getAsString() : null,
            json.has("overlayDuration") ? json.get("overlayDuration").getAsInt() : 0, changed ? System.currentTimeMillis() : old.changedAt());
    }

    static void acceptEvaluations(String text) {
        var json = JsonParser.parseString(text).getAsJsonObject();
        UUID incoming = UUID.fromString(json.get("battle").getAsString());
        if(endedBattles.contains(incoming) || state==null || !incoming.equals(state.battle()))return;
        int turn = json.has("turn") ? json.get("turn").getAsInt() : 0;
        long decision = json.has("decision") ? json.get("decision").getAsLong() : 0;
        if (incoming.equals(evaluationBattle) && turn < evaluationTurn) return;
        if (incoming.equals(evaluationBattle) && turn == evaluationTurn && decision < evaluationDecision) return;
        if (state != null && incoming.equals(state.battle()) && json.has("field") && !json.get("field").getAsString().equals(state.field())) return;
        // On-demand answers (gimmick variants, benched Pokemon) extend the current decision's evaluations.
        boolean merge = decisionOpen && json.has("merge") && json.get("merge").getAsBoolean() && incoming.equals(evaluationBattle) && turn == evaluationTurn && decision == evaluationDecision;
        if (json.has("merge") && json.get("merge").getAsBoolean() && !merge) return;
        var map = new HashMap<Key, Evaluation>(merge ? evaluations : Map.of());
        for (var element : json.getAsJsonArray("entries")) {
            var e = parseEvaluation(element.getAsJsonObject());
            map.put(new Key(e.user(), e.move(), e.target(), e.gimmick()), e);
        }
        if (!merge) { requested.clear(); outbox.clear(); decisionOpen = true; }
        evaluationBattle = UUID.fromString(json.get("battle").getAsString());
        evaluationTurn = json.has("turn") ? json.get("turn").getAsInt() : 0;
        evaluationDecision = decision;
        evaluations = Map.copyOf(map);
        evaluationRevision++;
        BattleExtrasFieldAdapter.invalidateTooltipCache();
    }

    /** One entry of the server's move-evaluation payload (InspectorSync.entry). */
    public static Evaluation parseEvaluation(JsonObject o) {
        {
            var e = new Evaluation(UUID.fromString(o.get("user").getAsString()), normalize(o.get("move").getAsString()), UUID.fromString(o.get("target").getAsString()), string(o,"gimmick"),
                o.has("factor") ? OptionalDouble.of(o.get("factor").getAsDouble()) : OptionalDouble.empty(),
                o.has("fieldBlocks") && o.get("fieldBlocks").getAsBoolean(), o.has("nativeBlocks") && o.get("nativeBlocks").getAsBoolean(),
                o.has("accuracy") ? OptionalDouble.of(o.get("accuracy").getAsDouble()) : OptionalDouble.empty(),
                o.has("priority") ? OptionalInt.of(o.get("priority").getAsInt()) : OptionalInt.empty(),
                string(o, "type"), string(o, "nativeType"), string(o, "category"), string(o, "nativeCategory"),
                o.has("basePower") ? OptionalInt.of(o.get("basePower").getAsInt()) : OptionalInt.empty(),
                o.has("critRatio") ? OptionalInt.of(o.get("critRatio").getAsInt()) : OptionalInt.empty(),
                o.has("statusApplies") ? Optional.of(o.get("statusApplies").getAsBoolean()) : Optional.empty(), string(o, "changesFieldTo"),
                integer(o,"totalMinDamage"), integer(o,"totalMaxDamage"), integer(o,"targetHp").orElse(0), integer(o,"targetMaxHp").orElse(0),
                integer(o,"minHits").orElse(1), integer(o,"maxHits").orElse(1), integer(o,"typeMod"), o.has("immune") && o.get("immune").getAsBoolean());
            return e;
        }
    }
    private static String string(JsonObject o, String key) { return o.has(key) && !o.get(key).isJsonNull() ? o.get(key).getAsString() : null; }
    private static OptionalInt integer(JsonObject o, String key) { return o.has(key) && !o.get(key).isJsonNull() ? OptionalInt.of(o.get(key).getAsInt()) : OptionalInt.empty(); }
    private static void clearEvaluations() { evaluations = Map.of(); requested.clear(); outbox.clear(); decisionOpen = false; evaluationRevision++; BattleExtrasFieldAdapter.invalidateTooltipCache(); }
    /** True between a decision's eager evaluations and the next state change: only then are requests meaningful. */
    private static volatile boolean decisionOpen;

    /** Evaluations asked of the server for the current decision, and those not yet sent. */
    private static final Set<Key> requested = new HashSet<>();
    private static final List<JsonObject> outbox = new ArrayList<>();
    /** Requests per packet; the server accepts at most this many queries per request. */
    public static final int REQUEST_CHUNK = 24;

    /**
     * The evaluation for an exact key; when it is missing and the current decision's evaluations are known, asks the
     * server for it once ({@code bench}: a benched Pokemon after switching in). Returns empty while pending.
     */
    public static Optional<Evaluation> evaluationOrRequest(UUID user, String move, UUID target, String gimmick, boolean bench) {
        var battle = CobblemonClient.INSTANCE.getBattle();
        if (battle == null || user == null || target == null || move == null) return Optional.empty();
        return evaluationOrRequest(battle.getBattleId(), user, move, target, gimmick, bench);
    }
    static Optional<Evaluation> evaluationOrRequest(UUID battle, UUID user, String move, UUID target, String gimmick, boolean bench) {
        if (!decisionOpen || !battle.equals(evaluationBattle) || state == null || !state.battle().equals(battle)) return Optional.empty();
        var key = new Key(user, normalize(move), target, gimmick);
        var hit = evaluations.get(key);
        if (hit != null) return Optional.of(hit);
        if (requested.add(key)) {
            var q = new JsonObject();
            q.addProperty("user", user.toString()); q.addProperty("move", key.move()); q.addProperty("target", target.toString());
            if (gimmick != null) q.addProperty("gimmick", gimmick);
            if (bench) q.addProperty("bench", true);
            outbox.add(q);
        }
        return Optional.empty();
    }
    /** Whether an exact evaluation was asked for and has not arrived (the preview hides native estimates meanwhile). */
    static boolean pending(UUID user, String move, UUID target, String gimmick) {
        var key = new Key(user, normalize(move), target, gimmick);
        return requested.contains(key) && !evaluations.containsKey(key);
    }
    /** The next request packet's JSON (at most {@link #REQUEST_CHUNK} queries), or null when nothing waits. */
    public static String drainRequest() {
        if (outbox.isEmpty() || evaluationBattle == null) return null;
        var json = new JsonObject();
        json.addProperty("battle", evaluationBattle.toString());
        json.addProperty("turn", evaluationTurn);
        json.addProperty("decision", evaluationDecision);
        var queries = new JsonArray();
        while (!outbox.isEmpty() && queries.size() < REQUEST_CHUNK) queries.add(outbox.removeFirst());
        json.add("queries", queries);
        return json.toString();
    }

    /** The active battle's field, if the server reported one for it. */
    public static Optional<State> current() {
        var battle = CobblemonClient.INSTANCE.getBattle();
        var s = state;
        return battle != null && s != null && s.battle().equals(battle.getBattleId()) ? Optional.of(s) : Optional.empty();
    }
    /** The field shown before the latest change in this battle, for a short crossfade. */
    public static Optional<String> previous(long withinMillis) {
        var p = previousField;
        return p != null && System.currentTimeMillis() - previousChangedAt < withinMillis ? Optional.of(p) : Optional.empty();
    }
    public static Optional<Evaluation> evaluation(UUID user, String move, UUID target) {
        var battle = CobblemonClient.INSTANCE.getBattle();
        if (battle == null || !battle.getBattleId().equals(evaluationBattle) || user == null || target == null || move == null) return Optional.empty();
        return Optional.ofNullable(evaluations.get(new Key(user, normalize(move), target, null)));
    }
    public static List<Evaluation> evaluations(UUID user, String move) {
        return evaluations(user,move,null);
    }
    public static List<Evaluation> evaluations(UUID user, String move, String gimmick) {
        var battle = CobblemonClient.INSTANCE.getBattle();
        if (battle == null || !battle.getBattleId().equals(evaluationBattle) || user == null || move == null) return List.of();
        String id = normalize(move);
        return evaluations.values().stream().filter(e -> e.user().equals(user) && e.move().equals(id) && Objects.equals(e.gimmick(),gimmick)).toList();
    }
    public static int evaluationRevision() { return evaluationRevision; }
    public static String normalize(String move) { return move.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]", ""); }
    static void reset() { state = null; previousField = null; clearEvaluations(); evaluationBattle = null; evaluationTurn = 0; evaluationDecision = 0; endedBattles.clear(); }
    /** Exact-key lookup for the current decision, without requesting. */
    public static Optional<Evaluation> evaluation(UUID user, String move, UUID target, String gimmick) {
        var battle = CobblemonClient.INSTANCE.getBattle();
        if (battle == null || !battle.getBattleId().equals(evaluationBattle) || user == null || target == null || move == null) return Optional.empty();
        return Optional.ofNullable(evaluations.get(new Key(user, normalize(move), target, gimmick)));
    }
}
