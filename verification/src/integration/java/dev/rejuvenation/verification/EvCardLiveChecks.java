package dev.rejuvenation.verification;

import com.cobblemon.mod.common.Cobblemon;
import com.cobblemon.mod.common.api.Priority;
import com.cobblemon.mod.common.api.battles.model.PokemonBattle;
import com.cobblemon.mod.common.api.battles.model.actor.BattleActor;
import com.cobblemon.mod.common.api.events.CobblemonEvents;
import com.cobblemon.mod.common.api.events.pokemon.EvGainedEvent;
import com.cobblemon.mod.common.api.pokemon.PokemonProperties;
import com.cobblemon.mod.common.api.pokemon.stats.BattleEvSource;
import com.cobblemon.mod.common.api.pokemon.stats.Generation8EvCalculator;
import com.cobblemon.mod.common.api.pokemon.stats.Stat;
import com.cobblemon.mod.common.api.pokemon.stats.Stats;
import com.cobblemon.mod.common.battles.*;
import com.cobblemon.mod.common.entity.pokemon.PokemonEntity;
import com.cobblemon.mod.common.pokemon.Pokemon;
import com.google.gson.*;
import dev.rejuvenation.*;
import java.nio.file.*;
import java.util.*;
import java.util.function.Consumer;

/**
 * Live EV Training Card and Exp. Share checks (-Drejuvenation.verifyEvCards=true), run in the isolated game only. Every scenario is a real
 * Cobblemon battle won through real Showdown turns, so the EVs come from Cobblemon's own PokemonBattle.end(), the installed EV calculator
 * chain and EVs.add with its events, never from a call made here. Before/after snapshots of every party member's EVs, experience and held
 * item are compared with the expected rewards.
 */
final class EvCardLiveChecks {
    private static final String CARD_MOVE = "moonblast"; // Fairy: no type is immune, so it also hits Brock's Dark/Ghost Sableye.

    /** A party member: species, level, held item (or null), moves and preset EVs. */
    private record Member(String label, String species, int level, String held, List<String> moves, Map<Stats, Integer> evs) {
        static Member of(String label, String species, int level, String held, String... moves) { return new Member(label, species, level, held, List.of(moves), Map.of()); }
        Member evs(Map<Stats, Integer> values) { return new Member(label, species, level, held, moves, values); }
    }

    /** The party, the opponent (a wild species or an RCT trainer), the player's turn script and the expected outcome. */
    private record Scenario(String name, List<Member> party, String wild, int wildLevel, String wildMove, String trainer, List<String> script, boolean doubling,
                            Consumer<Outcome> verify) {}

    /** What one battle changed, per party member. */
    private final class Outcome {
        final Scenario scenario; final List<Pokemon> members; final List<Map<Stats, Integer>> evsBefore = new ArrayList<>(); final List<Integer> expBefore = new ArrayList<>();
        final Map<Integer, Map<Stat, Integer>> oracle = new HashMap<>(); int opponentsFainted; int doublingSeen;
        Outcome(Scenario scenario, List<Pokemon> members) {
            this.scenario = scenario; this.members = members;
            for (var p : members) { evsBefore.add(evs(p)); expBefore.add(p.getExperience()); }
        }
        Map<Stats, Integer> gain(int i) {
            var now = evs(members.get(i)); var gain = new EnumMap<Stats, Integer>(Stats.class);
            for (var stat : now.keySet()) { int d = now.get(stat) - evsBefore.get(i).get(stat); if (d != 0) gain.put(stat, d); }
            return gain;
        }
        int expGain(int i) { return members.get(i).getExperience() - expBefore.get(i); }
        String label(int i) { return scenario.party().get(i).label(); }
        void expectGain(int i, Map<Stats, Integer> expected) {
            var gain = gain(i);
            check(gain.equals(expected.isEmpty() ? Map.of() : new EnumMap<>(expected)), scenario.name() + ": " + label(i) + " gains " + expected + ", got " + gain);
        }
        void expectCardKept(int i) {
            var held = members.get(i).heldItem();
            check(held.method_7909() instanceof EvCardItem && held.method_7947() == 1, scenario.name() + ": " + label(i) + " still holds its card afterwards, got " + held);
        }
    }

    private final JsonObject report = new JsonObject();
    private final JsonArray checks = new JsonArray(), notes = new JsonArray(), rows = new JsonArray();
    private final Path output = Path.of("rejuvenation/research/live-battle.json");
    private final List<Scenario> scenarios = new ArrayList<>();
    private int index, ready, ticks, delay, turns;
    private boolean finished, running, doubling;
    private int doublingCalls;
    private PokemonBattle battle;
    private PokemonEntity wild;
    private net.minecraft.class_1297 trainerMob;
    private Outcome outcome;

    EvCardLiveChecks() {
        report.add("checks", checks); report.add("notes", notes); report.add("battles", rows);
        // A stand-in for Pokérus or any other EV multiplier: doubles every battle EV event before the card guard (LOWEST) runs.
        CobblemonEvents.EV_GAINED_EVENT_PRE.subscribe(Priority.NORMAL, (Consumer<EvGainedEvent.Pre>) event -> {
            if (doubling && event.getSource() instanceof BattleEvSource && !event.isCanceled()) { event.setAmount(event.getAmount() * 2); doublingCalls++; }
        });
        var none = Map.<Stats, Integer>of();
        scenarios.add(new Scenario("E1 wild knockout, mixed bench",
            List.of(Member.of("Attack Card lead", "mew", 100, "rejuvenation:attack_ev_card", CARD_MOVE),
                Member.of("Exp. Share bench", "pichu", 5, "cobblemon:exp_share", "splash"),
                Member.of("Speed Card bench (no Exp. Share)", "pichu", 5, "rejuvenation:speed_ev_card", "splash"),
                Member.of("no-item bench", "pichu", 5, null, "splash")),
            "rattata", 2, "splash", null, List.of("move"), false, o -> {
                o.expectGain(0, Map.of(Stats.ATTACK, 32)); o.expectCardKept(0);
                o.expectGain(1, none); check(o.expGain(1) > 0, o.scenario.name() + ": the Exp. Share bench still gains experience (" + o.expGain(1) + ")");
                o.expectGain(2, none); check(o.expGain(2) == 0, o.scenario.name() + ": the card bench without Exp. Share gains no experience");
                o.expectGain(3, none);
            }));
        scenarios.add(new Scenario("E2 clamp at 250 Attack with a doubling multiplier",
            List.of(Member.of("Attack Card at 250 Attack", "mew", 100, "rejuvenation:attack_ev_card", CARD_MOVE).evs(Map.of(Stats.ATTACK, 250))),
            "rattata", 2, "splash", null, List.of("move"), true, o -> {
                o.expectGain(0, Map.of(Stats.ATTACK, 2)); o.expectCardKept(0);
                check(o.doublingSeen == 1, o.scenario.name() + ": the multiplier saw exactly one battle EV event (the card reward), saw " + o.doublingSeen);
            }));
        scenarios.add(new Scenario("E3 508 total EVs above the level cap",
            List.of(Member.of("HP Card at 508 total, level 50", "mew", 50, "rejuvenation:hp_ev_card", CARD_MOVE)
                .evs(Map.of(Stats.ATTACK, 252, Stats.DEFENCE, 252, Stats.SPEED, 4))),
            "rattata", 2, "splash", null, List.of("move"), false, o -> {
                o.expectGain(0, Map.of(Stats.HP, 2)); o.expectCardKept(0);
                int exp = o.expGain(0);
                if (exp == 0) check(true, o.scenario.name() + ": experience was suppressed (level cap) and the card reward still arrived");
                else note(o.scenario.name() + ": the level cap did not suppress experience in this run (gained " + exp + "); the card reward arrived regardless");
            }));
        scenarios.add(new Scenario("E4 ordinary Pokémon and a Power Bracer are unchanged",
            List.of(Member.of("no item", "mew", 100, null, CARD_MOVE)),
            "rattata", 2, "splash", null, List.of("move"), false, o -> o.expectGain(0, castStats(o.oracle.get(0)))));
        scenarios.add(new Scenario("E4b Power Bracer keeps Cobblemon's behaviour",
            List.of(Member.of("Power Bracer", "mew", 100, "cobblemon:power_bracer", CARD_MOVE)),
            "rattata", 2, "splash", null, List.of("move"), false, o -> {
                o.expectGain(0, castStats(o.oracle.get(0)));
                check(o.gain(0).getOrDefault(Stats.ATTACK, 0) >= 8, o.scenario.name() + ": the Power Bracer still adds its Attack EVs");
            }));
        scenarios.add(new Scenario("E5 full stat takes nothing, not even the natural yield",
            List.of(Member.of("Attack Card at 252 Attack", "mew", 100, "rejuvenation:attack_ev_card", CARD_MOVE).evs(Map.of(Stats.ATTACK, 252))),
            "rattata", 2, "splash", null, List.of("move"), false, o -> { o.expectGain(0, none); o.expectCardKept(0); }));
        scenarios.add(new Scenario("E6 switching: two card holders take part",
            List.of(Member.of("Defence Card lead, switched out", "mew", 100, "rejuvenation:defence_ev_card", CARD_MOVE),
                Member.of("Attack Card, switched in, knocks out", "mew", 100, "rejuvenation:attack_ev_card", CARD_MOVE),
                Member.of("no-item bench, never sent out", "pichu", 5, null, "splash")),
            "rattata", 2, "splash", null, List.of("switch:1", "move"), false, o -> {
                o.expectGain(0, Map.of(Stats.DEFENCE, 32)); o.expectGain(1, Map.of(Stats.ATTACK, 32)); o.expectGain(2, none);
                o.expectCardKept(0); o.expectCardKept(1);
            }));
        scenarios.add(new Scenario("E7 a participant that faints gets nothing",
            List.of(Member.of("Speed Card lead, knocked out", "magikarp", 1, "rejuvenation:speed_ev_card", "splash"),
                Member.of("Attack Card, sent in, knocks out", "mew", 100, "rejuvenation:attack_ev_card", CARD_MOVE)),
            "machop", 30, "karatechop", null, List.of("move"), false, o -> {
                check(o.members.get(0).getCurrentHealth() == 0, o.scenario.name() + ": the lead really fainted");
                o.expectGain(0, none); o.expectGain(1, Map.of(Stats.ATTACK, 32)); o.expectCardKept(1);
            }));
        scenarios.add(new Scenario("E8 RCT trainer battle, several knockouts",
            List.of(Member.of("Attack Card lead", "mew", 100, "rejuvenation:attack_ev_card", CARD_MOVE),
                Member.of("Exp. Share bench", "pichu", 5, "cobblemon:exp_share", "splash")),
            null, 0, null, "kanto_brock", List.of("move"), false, o -> {
                check(o.opponentsFainted >= 2, o.scenario.name() + ": several trainer Pokémon were knocked out (" + o.opponentsFainted + ")");
                o.expectGain(0, Map.of(Stats.ATTACK, Math.min(252, 32 * o.opponentsFainted))); o.expectCardKept(0);
                o.expectGain(1, none); check(o.expGain(1) > 0, o.scenario.name() + ": the Exp. Share bench still gains experience (" + o.expGain(1) + ")");
            }));
    }

    @SuppressWarnings("unchecked")
    private static Map<Stats, Integer> castStats(Map<Stat, Integer> map) {
        var out = new EnumMap<Stats, Integer>(Stats.class);
        for (var e : map.entrySet()) if (e.getValue() != 0) out.merge((Stats) e.getKey(), e.getValue(), Integer::sum);
        return out;
    }

    private static Map<Stats, Integer> evs(Pokemon pokemon) {
        var map = new EnumMap<Stats, Integer>(Stats.class);
        for (var stat : Stats.Companion.getPERMANENT()) map.put((Stats) stat, pokemon.getEvs().getOrDefault(stat));
        return map;
    }

    private void check(boolean condition, String message) {
        if (!condition) throw new IllegalStateException(message);
        checks.add(message);
    }

    private void note(String message) { notes.add(message); RejuvenationFields.LOG.info("EV live check note: {}", message); }

    void tick(net.minecraft.server.MinecraftServer server) {
        if (finished) return;
        try {
            if (server.method_3760().method_14571().isEmpty() || RejuvenationFields.catalog.revision() == 0) return;
            if (ready++ < 200) return;
            if (delay-- > 0) return;
            var player = server.method_3760().method_14571().getFirst();
            if (!running) {
                if (index == scenarios.size()) { finish(null); return; }
                start(player, scenarios.get(index));
                running = true; ticks = 0; turns = 0; delay = 20; return;
            }
            if (++ticks > 2400) throw new IllegalStateException("Timeout in " + scenarios.get(index).name() + " after " + turns + " turns");
            if (!battle.getEnded()) { drive(scenarios.get(index)); return; }
            // Cobblemon awards experience and EVs inside end(); give the follow-up dispatches a moment.
            if (ticks < 40) return;
            finishScenario(scenarios.get(index));
        } catch (Throwable error) {
            finish(error);
        }
    }

    private void start(net.minecraft.class_3222 player, Scenario scenario) throws Exception {
        var world = player.method_51469();
        var party = Cobblemon.INSTANCE.getStorage().getParty(player);
        party.clearParty();
        var members = new ArrayList<Pokemon>();
        for (var member : scenario.party()) {
            var properties = new PokemonProperties();
            properties.setSpecies(member.species()); properties.setLevel(member.level()); properties.setMoves(member.moves());
            if (member.held() != null) properties.setHeldItem(member.held());
            var pokemon = properties.create(player);
            for (var stat : Stats.Companion.getPERMANENT()) pokemon.getEvs().set(stat, member.evs().getOrDefault((Stats) stat, 0));
            if (member.held() != null && pokemon.heldItem().method_7960()) throw new IllegalStateException("Held item did not apply: " + member.held());
            party.add(pokemon);
            members.add(pokemon);
        }
        doubling = scenario.doubling(); doublingCalls = 0;
        outcome = new Outcome(scenario, members);
        var lead = members.getFirst();
        if (scenario.trainer() != null) { startTrainer(player, scenario.trainer()); return; }
        if (lead.sendOut(world, new net.minecraft.class_243(player.method_23317() - 3, player.method_23318(), player.method_23321()), null, entity -> kotlin.Unit.INSTANCE) == null)
            throw new IllegalStateException("Lead was not sent out");
        var enemy = new PokemonProperties();
        enemy.setSpecies(scenario.wild()); enemy.setLevel(scenario.wildLevel()); enemy.setMoves(List.of(scenario.wildMove()));
        wild = enemy.createEntity(world);
        wild.method_5814(player.method_23317() + 3, player.method_23318(), player.method_23321()); wild.method_5875(true); wild.method_5977(true); world.method_8649(wild);
        wild.getPokemon().setState(new com.cobblemon.mod.common.pokemon.activestate.SentOutState(wild));
        var result = BattleBuilder.INSTANCE.pve(player, wild, lead.getUuid(), BattleFormat.Companion.getGEN_9_SINGLES(), false, false, -1f, party);
        if (!(result instanceof SuccessfulBattleStart success)) throw new IllegalStateException("Battle start rejected: " + result);
        battle = success.getBattle();
        RejuvenationFields.LOG.info("EV live check started {} ({})", scenario.name(), battle.getBattleId());
    }

    /** Brock through RCT's own entry points, as LiveBattleFixture phase 16 does. */
    private void startTrainer(net.minecraft.class_3222 player, String trainerId) throws Exception {
        var world = player.method_51469();
        Object api = null, npc = null;
        for (Object entry : ((java.util.stream.Stream<?>) Class.forName("com.gitlab.srcmc.rctapi.api.RCTApi").getMethod("getInstances").invoke(null)).toList()) {
            Object instance = ((Map.Entry<?, ?>) entry).getValue(), registry = instance.getClass().getMethod("getTrainerRegistry").invoke(instance);
            Object trainer = registry.getClass().getMethod("getById", String.class).invoke(registry, trainerId);
            if (trainer != null) { api = instance; npc = trainer; break; }
        }
        if (npc == null) throw new IllegalStateException("RCT did not register " + trainerId);
        Class<?> mobClass = Class.forName("com.gitlab.srcmc.rctmod.world.entities.TrainerMob");
        trainerMob = (net.minecraft.class_1297) ((net.minecraft.class_1299<?>) mobClass.getMethod("getEntityType").invoke(null)).method_5883(world);
        mobClass.getMethod("setTrainerId", String.class).invoke(trainerMob, trainerId);
        trainerMob.method_5814(player.method_23317() + 2, player.method_23318(), player.method_23321()); world.method_8649(trainerMob);
        Object rct = Class.forName("com.gitlab.srcmc.rctmod.api.RCTMod").getMethod("getInstance").invoke(null);
        boolean started = (boolean) rct.getClass().getMethod("makeBattle", mobClass, net.minecraft.class_1657.class).invoke(rct, trainerMob, player);
        if (!started) {
            note("RCTMod.makeBattle refused the test player; started the same registered team through RCT's BattleManager");
            npc.getClass().getMethod("setEntity", net.minecraft.class_1309.class).invoke(npc, trainerMob);
            Object registry = api.getClass().getMethod("getTrainerRegistry").invoke(api);
            Object me = registry.getClass().getMethod("registerPlayer", String.class, net.minecraft.class_3222.class).invoke(registry, "rejuvenation_ev_fixture", player);
            Object manager = api.getClass().getMethod("getBattleManager").invoke(api);
            Class<?> trainerType = Class.forName("com.gitlab.srcmc.rctapi.api.trainer.Trainer");
            if (!(boolean) manager.getClass().getMethod("startSingle", trainerType, trainerType).invoke(manager, me, npc)) throw new IllegalStateException("RCT refused the trainer battle");
        }
        battle = BattleRegistry.getBattleByParticipatingPlayer(player);
        if (battle == null) throw new IllegalStateException("RCT battle did not start");
    }

    private BattleActor playerActor() { for (var a : battle.getActors()) if (a.getPlayerUUIDs().iterator().hasNext()) return a; throw new IllegalStateException("no player actor"); }

    private BattleActor opponentActor() { for (var a : battle.getActors()) if (!a.getPlayerUUIDs().iterator().hasNext()) return a; throw new IllegalStateException("no opponent actor"); }

    /** One turn of input: the player's scripted action (or a forced switch), and the wild Pokémon's fixed move. RCT's AI chooses for trainers. */
    private void drive(Scenario scenario) {
        if (!battle.getStarted()) return;
        var player = playerActor();
        var request = player.getRequest();
        if (request == null || !player.getMustChoose()) return;
        if (request.getForceSwitch() != null && request.getForceSwitch().contains(true)) {
            var next = player.getPokemonList().stream().filter(p -> p.getHealth() > 0 && player.getActivePokemon().stream().noneMatch(a -> a.getBattlePokemon() == p)).findFirst()
                .orElseThrow(() -> new IllegalStateException("no Pokémon left to switch in"));
            player.setResponses(new ArrayList<>(List.of(new SwitchActionResponse(next.getUuid())))); player.setMustChoose(false);
            battle.checkForInputDispatch();
            return;
        }
        if (request.getActive() == null || request.getActive().isEmpty()) return;
        var opponent = opponentActor();
        boolean wildBattle = scenario.trainer() == null;
        if (wildBattle && opponent.getRequest() == null) return;
        String step = scenario.script().get(Math.min(turns, scenario.script().size() - 1));
        var active = player.getActivePokemon().getFirst();
        ShowdownActionResponse response;
        if (step.startsWith("switch:")) {
            var target = outcome.members.get(Integer.parseInt(step.substring(7)));
            response = new SwitchActionResponse(target.getUuid());
        } else {
            // The member's scripted move by name (Cobblemon may order the moveset differently).
            var mine = active.getBattlePokemon().getEffectedPokemon();
            int at = -1;
            for (int i = 0; i < outcome.members.size(); i++) if (outcome.members.get(i).getUuid().equals(mine.getUuid())) at = i;
            if (at < 0) throw new IllegalStateException("active Pokémon is not a fixture party member");
            String wanted = scenario.party().get(at).moves().getFirst();
            response = move(player, wanted);
        }
        if (!response.isValid(active, request.getActive().getFirst(), false)) throw new IllegalStateException("Invalid fixture choice " + response + " in " + scenario.name());
        player.setResponses(new ArrayList<>(List.of(response))); player.setMustChoose(false);
        if (wildBattle) {
            var wildResponse = move(opponent, scenario.wildMove());
            opponent.setResponses(new ArrayList<>(List.of(wildResponse))); opponent.setMustChoose(false);
        }
        battle.checkForInputDispatch();
        turns++;
        // Cobblemon's own calculator is the oracle for ordinary Pokémon: what it yields for each participant against the wild opponent.
        if (wildBattle && outcome.oracle.isEmpty()) {
            var foe = opponent.getPokemonList().getFirst();
            for (int i = 0; i < outcome.members.size(); i++) {
                var mine = battlePokemon(player, outcome.members.get(i));
                if (mine != null) outcome.oracle.put(i, Generation8EvCalculator.INSTANCE.calculate(mine, foe));
            }
        }
    }

    /** A move choice with a target only when the move needs one (Cobblemon's validator rejects a missing or a superfluous target). */
    private static MoveActionResponse move(BattleActor actor, String moveId) {
        var active = actor.getActivePokemon().getFirst();
        var moveset = actor.getRequest().getActive().getFirst();
        var move = moveset.getMoves().stream().filter(m -> m.getId().equals(moveId)).findFirst()
            .orElseThrow(() -> new IllegalStateException(moveId + " is not in the request's moveset " + moveset.getMoves().stream().map(InBattleMove::getId).toList()));
        var targets = move.getTargets(active);
        String pnx = targets == null || targets.isEmpty() ? null
            : targets.stream().map(Targetable::getPNX).filter(t -> !t.equals(active.getPNX())).findFirst().orElse(targets.getFirst().getPNX());
        return new MoveActionResponse(moveId, pnx, null);
    }

    private static com.cobblemon.mod.common.battles.pokemon.BattlePokemon battlePokemon(BattleActor actor, Pokemon pokemon) {
        for (var p : actor.getPokemonList()) if (p.getEffectedPokemon().getUuid().equals(pokemon.getUuid())) return p;
        return null;
    }

    private void finishScenario(Scenario scenario) {
        outcome.opponentsFainted = (int) opponentActor().getPokemonList().stream().filter(p -> p.getHealth() <= 0).count();
        outcome.doublingSeen = doublingCalls;
        doubling = false;
        scenario.verify().accept(outcome);
        var row = new JsonObject();
        row.addProperty("scenario", scenario.name()); row.addProperty("turns", turns); row.addProperty("opponentsFainted", outcome.opponentsFainted);
        var members = new JsonArray();
        for (int i = 0; i < outcome.members.size(); i++) {
            var m = new JsonObject(); m.addProperty("member", outcome.label(i)); m.addProperty("evGain", outcome.gain(i).toString()); m.addProperty("expGain", outcome.expGain(i));
            m.addProperty("heldAfter", net.minecraft.class_7923.field_41178.method_10221(outcome.members.get(i).heldItem().method_7909()).toString());
            members.add(m);
        }
        row.add("members", members); rows.add(row);
        checks.add(scenario.name() + ": passed");
        cleanup();
        index++; running = false; delay = 40;
    }

    private void cleanup() {
        if (battle != null && !battle.getEnded()) battle.stop();
        battle = null;
        if (wild != null) wild.method_31472();
        wild = null;
        if (trainerMob != null) trainerMob.method_31472();
        trainerMob = null;
        if (outcome != null) for (var p : outcome.members) if (p.getEntity() != null) p.recall();
    }

    private void finish(Throwable error) {
        finished = true;
        report.addProperty("mode", "evcards");
        report.addProperty("success", error == null);
        report.addProperty("scenariosPassed", index);
        report.addProperty("scenarios", scenarios.size());
        if (error != null) {
            report.addProperty("error", error.toString());
            if (battle != null) report.add("battleLog", new Gson().toJsonTree(battle.getBattleLog()));
            RejuvenationFields.LOG.error("EV live checks failed", error);
        }
        try { Files.createDirectories(output.getParent()); Files.writeString(output, new GsonBuilder().setPrettyPrinting().create().toJson(report)); }
        catch (Exception e) { throw new RuntimeException(e); }
    }
}
