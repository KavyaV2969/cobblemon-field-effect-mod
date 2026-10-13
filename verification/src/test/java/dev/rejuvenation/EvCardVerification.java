package dev.rejuvenation;

import com.cobblemon.mod.common.api.pokemon.stats.Stat;
import com.cobblemon.mod.common.api.pokemon.stats.Stats;
import com.cobblemon.mod.common.pokemon.EVs;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Supplier;

/**
 * EV Training Card and Exp. Share battle-EV rules, offline. Cobblemon's {@code Pokemon} cannot be constructed outside a running game, so
 * this drives the decision functions the live hooks call ({@link EvCards#reward}, {@link EvCards#guard}, {@link EvCards#award}) together
 * with Cobblemon's real {@link EVs} class, whose {@code add} performs the 252/510 clamp. Section 3 replays the EV part of Cobblemon 1.7.3's
 * {@code PokemonBattle.end()} loop (decoded from the installed jar: fainted Pokémon x surviving opponents, participation by
 * {@code facedOpponents}, Exp. Share by tag, one calculator call per pair, one {@code EVs.add} per returned stat) over those real
 * objects. It is a model of that loop; the real one is exercised by the live fixture's EV mode ({@code research/live_check.py --evcards}).
 */
public final class EvCardVerification {
    private static int checks;

    private static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
        checks++;
    }

    /** A natural yield that must never be consulted. */
    private static Supplier<Map<Stat, Integer>> forbidden(String why) {
        return () -> { throw new AssertionError("natural EV yield consulted: " + why); };
    }

    private static EVs evs(Map<Stats, Integer> values) {
        var evs = new EVs();
        values.forEach(evs::set);
        return evs;
    }

    private static Map<Stat, Integer> snapshot(EVs evs) {
        var map = new LinkedHashMap<Stat, Integer>();
        for (var stat : Stats.Companion.getPERMANENT()) map.put(stat, evs.getOrDefault(stat));
        return map;
    }

    /** What a held item means for the EV rules. */
    private record Held(EvCards.Card card, boolean expShare) {
        static final Held NONE = new Held(null, false), EXP_SHARE = new Held(null, true);
        static Held card(EvCards.Card card) { return new Held(card, false); }
    }

    /** One battler in the replay: its real EVs, its held item, whether it is still standing, and whom it faced. */
    private static final class Battler {
        final String name; final EVs evs; final Held held; boolean alive = true; final Set<Battler> faced = new LinkedHashSet<>(); final Map<Stat, Integer> yield;
        Battler(String name, EVs evs, Held held, Map<Stat, Integer> yield) { this.name = name; this.evs = evs; this.held = held; this.yield = yield; }
    }

    /** The calculator decision for one (recipient, defeated) pair, exactly as {@link EvCards.Calculator#calculate} assembles it. */
    private static Map<Stat, Integer> calculate(Battler recipient, Battler defeated, int[] naturalCalls) {
        var card = recipient.held.card;
        return EvCards.reward(recipient.held.expShare, card == null ? null : (Stat) card.stat, card == null ? 0 : recipient.evs.getOrDefault(card.stat),
            recipient.evs.total(), () -> { naturalCalls[0]++; return defeated.yield; });
    }

    /**
     * The EV part of PokemonBattle.end() for one side's fainted Pokémon against the other side's party: for every fainted Pokémon, every
     * surviving recipient that faced it or holds an Exp. Share gets one calculator call, then one EVs.add per stat. Returns the number of
     * EVs.add calls.
     */
    private static int endOfBattle(List<Battler> recipients, List<Battler> opponents, int[] naturalCalls) {
        int adds = 0;
        for (var fainted : opponents) {
            if (fainted.alive) continue;
            for (var recipient : recipients) {
                if (!recipient.alive) continue;
                boolean participated = recipient.faced.contains(fainted);
                if (!participated && !recipient.held.expShare) continue;
                for (var entry : calculate(recipient, fainted, naturalCalls).entrySet()) {
                    // The LOWEST-priority guard runs inside EVs.add's Pre event; with no other listener it leaves the amount as is.
                    var card = recipient.held.card;
                    int amount = EvCards.guard(recipient.held.expShare, card == null ? null : (Stat) card.stat, entry.getKey(), entry.getValue(),
                        recipient.evs.getOrDefault(entry.getKey()), recipient.evs.total());
                    check(amount == entry.getValue(), "the guard never changes a calculator result it produced itself");
                    recipient.evs.add(entry.getKey(), amount);
                    adds++;
                }
            }
        }
        return adds;
    }

    public static void main(String[] args) throws Exception {
        net.minecraft.class_155.method_36208();
        net.minecraft.class_2966.method_12851();
        var receipt = new JsonObject();

        // 1. The award formula max(0, min(32, 252 - stat, 510 - total)) and Cobblemon's own limits.
        check(EVs.MAX_STAT_VALUE == 252 && EVs.MAX_TOTAL_VALUE == 510, "Cobblemon's EV limits are 252 per stat and 510 in total");
        int[][] table = {{0, 0, 32}, {250, 250, 2}, {0, 508, 2}, {252, 252, 0}, {0, 510, 0}, {100, 510, 0}, {220, 300, 32}, {221, 300, 31},
            {240, 500, 10}, {200, 490, 20}, {251, 509, 1}, {253, 253, 0}, {0, 511, 0}};
        for (int[] row : table) check(EvCards.award(row[0], row[1]) == row[2], "award(" + row[0] + ", " + row[1] + ") = " + row[2] + ", got " + EvCards.award(row[0], row[1]));
        // The same numbers out of Cobblemon's real EVs.add clamp.
        for (int[] row : new int[][]{{250, 0, 2}, {0, 508, 2}, {252, 0, 0}, {0, 510, 0}, {100, 400, 32}, {100, 500, 10}}) {
            var evs = new EVs();
            evs.set(Stats.ATTACK, row[0]);
            // Spread the rest of the total over other stats without exceeding 252 each.
            int rest = row[1] - row[0];
            for (var other : List.of(Stats.HP, Stats.DEFENCE, Stats.SPEED)) { int put = Math.min(252, Math.max(0, rest)); if (put > 0) evs.set(other, put); rest -= put; }
            int before = evs.total();
            int allowed = EvCards.award(evs.getOrDefault(Stats.ATTACK), before);
            int added = evs.add(Stats.ATTACK, allowed);
            check(added == row[2] && allowed == row[2], "real EVs at Attack " + row[0] + "/total " + before + " take " + row[2] + ", got award " + allowed + " added " + added);
            check(evs.total() <= 510 && evs.getOrDefault(Stats.ATTACK) <= 252, "real EVs stay within 252/510");
        }

        // 2. The per-knockout decision for every card, against natural yields that must be ignored.
        var mixed = new LinkedHashMap<Stat, Integer>(); mixed.put(Stats.HP, 1); mixed.put(Stats.ATTACK, 2); mixed.put(Stats.SPEED, 3);
        for (var card : EvCards.Card.values()) {
            var reward = EvCards.reward(false, (Stat) card.stat, 0, 0, forbidden(card.id + " holder"));
            check(reward.equals(Map.of(card.stat, 32)), card.id + " gives exactly {" + card.stat + ": 32}, got " + reward);
            check(EvCards.reward(false, (Stat) card.stat, 250, 250, forbidden(card.id)).equals(Map.of(card.stat, 2)), card.id + " gives 2 at 250");
            check(EvCards.reward(false, (Stat) card.stat, 0, 508, forbidden(card.id)).equals(Map.of(card.stat, 2)), card.id + " gives 2 at 508 total");
            check(EvCards.reward(false, (Stat) card.stat, 252, 252, forbidden(card.id)).isEmpty(), card.id + " gives nothing at a full stat");
            check(EvCards.reward(false, (Stat) card.stat, 0, 510, forbidden(card.id)).isEmpty(), card.id + " gives nothing at a full total");
            check(EvCards.reward(true, (Stat) card.stat, 0, 0, forbidden("Exp. Share")).isEmpty(), "Exp. Share wins over " + card.id);
        }
        check(EvCards.reward(true, null, 0, 0, forbidden("Exp. Share holder")).isEmpty(), "an Exp. Share holder gets no battle EVs");
        int[] natural = {0};
        var plain = EvCards.reward(false, null, 0, 0, () -> { natural[0]++; return mixed; });
        check(plain == mixed && natural[0] == 1, "a Pokémon without card or Exp. Share gets the wrapped calculator's own result, asked once");
        check(EvCards.reward(false, null, 0, 0, () -> Map.<Stat, Integer>of()).isEmpty(), "an empty natural yield stays empty");
        // Each card's stat and Power Item, by name.
        var expected = Map.of("hp_ev_card", Stats.HP, "attack_ev_card", Stats.ATTACK, "defence_ev_card", Stats.DEFENCE,
            "special_attack_ev_card", Stats.SPECIAL_ATTACK, "special_defence_ev_card", Stats.SPECIAL_DEFENCE, "speed_ev_card", Stats.SPEED);
        var powerItems = Map.of("hp_ev_card", "power_weight", "attack_ev_card", "power_bracer", "defence_ev_card", "power_belt",
            "special_attack_ev_card", "power_lens", "special_defence_ev_card", "power_band", "speed_ev_card", "power_anklet");
        check(EvCards.Card.values().length == 6, "six cards");
        for (var card : EvCards.Card.values()) {
            check(expected.get(card.id) == card.stat, card.id + " trains " + expected.get(card.id));
            check(powerItems.get(card.id).equals(card.powerItem), card.id + " is smithed from " + powerItems.get(card.id));
        }

        // 2b. The event guard: Pokérus-style multipliers and foreign stats cannot raise a card reward; Exp. Share holders keep nothing.
        check(EvCards.guard(false, Stats.ATTACK, Stats.ATTACK, 64, 0, 0) == 32, "a doubled card reward is held to 32");
        check(EvCards.guard(false, Stats.ATTACK, Stats.ATTACK, 96, 250, 250) == 2, "a tripled reward at 250 is held to 2");
        check(EvCards.guard(false, Stats.ATTACK, Stats.ATTACK, 10, 0, 0) == 10, "a listener's reduction is kept");
        check(EvCards.guard(false, Stats.ATTACK, Stats.DEFENCE, 2, 0, 0) == 0, "a card holder's battle EVs in another stat are cancelled");
        check(EvCards.guard(true, null, Stats.SPEED, 3, 0, 0) == 0, "an Exp. Share holder's battle EVs are cancelled");
        check(EvCards.guard(false, null, Stats.SPEED, 6, 0, 0) == 6, "an ordinary Pokémon's battle EVs (and their multipliers) are untouched");
        int once = EvCards.guard(false, Stats.ATTACK, Stats.ATTACK, 64, 100, 300);
        check(EvCards.guard(false, Stats.ATTACK, Stats.ATTACK, once, 100, 300) == once, "the guard is idempotent: a repeated callback cannot add");

        // 3. Replay of the end-of-battle EV loop over real EVs objects: a double battle, two knockouts, a mixed party.
        var dualYield = new LinkedHashMap<Stat, Integer>(); dualYield.put(Stats.DEFENCE, 2); dualYield.put(Stats.SPECIAL_DEFENCE, 1);
        var foeA = new Battler("foe A (2 Def, 1 SpDef)", new EVs(), Held.NONE, dualYield);
        var foeB = new Battler("foe B (3 Speed)", new EVs(), Held.NONE, Map.of(Stats.SPEED, 3));
        var foeC = new Battler("foe C (still standing)", new EVs(), Held.NONE, Map.of(Stats.HP, 3));
        var attacker = new Battler("Attack card, faced both", new EVs(), Held.card(EvCards.Card.ATTACK), Map.of());
        var nearlyFull = new Battler("Speed card at 250 Speed, faced A", evs(Map.of(Stats.SPEED, 250)), Held.card(EvCards.Card.SPEED), Map.of());
        var nearTotal = new Battler("HP card at 508 total, faced A", evs(Map.of(Stats.ATTACK, 252, Stats.DEFENCE, 252, Stats.SPEED, 4)), Held.card(EvCards.Card.HP), Map.of());
        var full = new Battler("Defence card at 252 Defence, faced A", evs(Map.of(Stats.DEFENCE, 252)), Held.card(EvCards.Card.DEFENCE), Map.of());
        var sharer = new Battler("Exp. Share, faced both", new EVs(), Held.EXP_SHARE, Map.of());
        var benchSharer = new Battler("Exp. Share, on the bench", new EVs(), Held.EXP_SHARE, Map.of());
        var plainFaced = new Battler("no item, faced both", new EVs(), Held.NONE, Map.of());
        var benchCard = new Battler("Sp. Atk card, on the bench, no Exp. Share", new EVs(), Held.card(EvCards.Card.SPECIAL_ATTACK), Map.of());
        var faintedCard = new Battler("Sp. Def card, faced both, fainted", new EVs(), Held.card(EvCards.Card.SPECIAL_DEFENCE), Map.of());
        faintedCard.alive = false;
        for (var b : List.of(attacker, sharer, plainFaced, faintedCard)) { b.faced.add(foeA); b.faced.add(foeB); }
        for (var b : List.of(nearlyFull, nearTotal, full)) b.faced.add(foeA);
        foeA.alive = false; foeB.alive = false;
        var party = List.of(attacker, nearlyFull, nearTotal, full, sharer, benchSharer, plainFaced, benchCard, faintedCard);
        var before = new LinkedHashMap<Battler, Map<Stat, Integer>>();
        for (var b : party) before.put(b, snapshot(b.evs));
        int[] naturalCalls = {0};
        int adds = endOfBattle(party, List.of(foeA, foeB, foeC), naturalCalls);
        var expectedGain = new LinkedHashMap<Battler, Map<Stat, Integer>>();
        expectedGain.put(attacker, Map.of(Stats.ATTACK, 64));                                   // two knockouts, 32 each, nothing in Def/SpDef/Speed
        expectedGain.put(nearlyFull, Map.of(Stats.SPEED, 2));                                   // 250 -> 252
        expectedGain.put(nearTotal, Map.of(Stats.HP, 2));                                       // 508 -> 510
        expectedGain.put(full, Map.of());                                                       // full stat: nothing, not even natural Defence
        expectedGain.put(sharer, Map.of());                                                     // Exp. Share: nothing despite taking part
        expectedGain.put(benchSharer, Map.of());
        expectedGain.put(plainFaced, Map.of(Stats.DEFENCE, 2, Stats.SPECIAL_DEFENCE, 1, Stats.SPEED, 3)); // unchanged natural yields
        expectedGain.put(benchCard, Map.of());                                                  // not a participant, no Exp. Share: not eligible
        expectedGain.put(faintedCard, Map.of());                                                // fainted at the end: not eligible
        var rows = new com.google.gson.JsonArray();
        for (var b : party) {
            var gain = new LinkedHashMap<Stat, Integer>();
            for (var e : snapshot(b.evs).entrySet()) { int d = e.getValue() - before.get(b).get(e.getKey()); if (d != 0) gain.put(e.getKey(), d); }
            check(gain.equals(expectedGain.get(b)), b.name + " gains " + expectedGain.get(b) + ", got " + gain);
            check(b.evs.total() <= 510 && snapshot(b.evs).values().stream().allMatch(v -> v <= 252), b.name + " stays within 252/510");
            var row = new JsonObject(); row.addProperty("battler", b.name); row.addProperty("gain", gain.toString()); rows.add(row);
        }
        // The natural yield is asked only for the ordinary participant (twice, once per knockout); one EVs.add per stat it yields plus the cards.
        check(naturalCalls[0] == 2, "natural yield consulted only for the Pokémon without card or Exp. Share, once per knockout, got " + naturalCalls[0]);
        check(adds == 2 + 1 + 1 + 3, "EVs.add calls: 2 Attack card rewards, 1 Speed, 1 HP, 3 natural stats; got " + adds);
        // Running the end-of-battle pass again for a new battle with the same knockouts adds the same rewards again, never a duplicate within one pass.
        var again = new Battler("Attack card, second battle", new EVs(), Held.card(EvCards.Card.ATTACK), Map.of());
        again.faced.add(foeA);
        endOfBattle(List.of(again), List.of(foeA), new int[1]);
        check(again.evs.getOrDefault(Stats.ATTACK) == 32 && again.evs.total() == 32, "one knockout with a two-stat yield gives exactly one 32-EV reward");

        // 4. Not a Showdown item: in battle the card is no item, so it has no Power Item Speed halving and nothing consumes it.
        var showdownItems = Files.readString(Path.of(System.getProperty("rejuvenation.repo", ".")).resolve("../showdown/data/items.js").normalize(), StandardCharsets.UTF_8);
        check(showdownItems.contains("\n  powerweight: {"), "the installed Showdown item table is readable (Power Weight present)");
        for (var card : EvCards.Card.values()) {
            String showdownId = card.id.replace("_", "");
            check(!showdownItems.contains("\n  " + showdownId + ": {"), card.id + " has no Showdown item " + showdownId + ", so Cobblemon passes no item to the battle");
        }
        // The card classes never decrement a stack (ItemStack.decrement / decrementUnlessCreative) and never touch experience.
        for (String cls : List.of("EvCards", "EvCardItem", "EvCards$Calculator")) {
            String constants;
            try (var in = EvCards.class.getResourceAsStream(cls + ".class")) { constants = new String(in.readAllBytes(), StandardCharsets.ISO_8859_1); }
            check(!constants.contains("method_7934") && !constants.contains("method_57008"), cls + " never consumes an item");
            check(!constants.contains("Experience") && !constants.contains("HELD_ITEM_EFFECT"), cls + " neither touches experience nor gives the card a Showdown held-item effect");
        }

        receipt.addProperty("checks", checks);
        receipt.addProperty("awardRows", table.length);
        receipt.add("replay", rows);
        receipt.addProperty("scope", "Decision functions of the live hooks with Cobblemon's real EVs clamp, and a replay of the EV part of PokemonBattle.end() decoded from the installed Cobblemon 1.7.3 jar. Not a live battle; see live_check.py --evcards.");
        if (args.length > 0) Files.writeString(Path.of(args[0]), new GsonBuilder().setPrettyPrinting().create().toJson(receipt) + "\n");
        System.out.println("PASS EV Training Cards and Exp. Share battle-EV rules: " + table.length + " award rows, 6 cards, " + party.size() + "-Pokémon end-of-battle replay, " + checks + " checks");
    }
}
