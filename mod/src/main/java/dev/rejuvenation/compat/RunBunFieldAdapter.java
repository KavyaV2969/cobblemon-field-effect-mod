package dev.rejuvenation.compat;

import com.cobblemon.mod.common.api.battles.model.PokemonBattle;
import com.cobblemon.mod.common.api.moves.Move;
import com.cobblemon.mod.common.battles.ActiveBattlePokemon;
import com.cobblemon.mod.common.battles.ShowdownMoveset;
import com.cobblemon.mod.common.battles.pokemon.BattlePokemon;
import dev.rejuvenation.FieldEvaluator;
import dev.rejuvenation.RejuvenationFields;
import java.util.*;

/**
 * Makes the installed Run &amp; Bun trainer AI (rbrctai) evaluate field-modified outcomes.
 *
 * The AI keeps its own decision logic and damage formula (including its hypothetical stat stages and Tera/Dynamax
 * what-ifs). Its estimates are corrected with the field engine's measurements of the same attacker, move and
 * defender in the current battle state:
 * <ul>
 * <li>damage: multiplied by fieldDamage/nativeDamage from the simulator's own damage pipeline, which carries field
 *     power, type, effectiveness, category, stat-substitution, ability, item and overlay changes; a field that blocks
 *     the move (rejection, immunity, failed status) gives 0; a field that removes a native immunity gives the
 *     simulator's field damage;</li>
 * <li>immunity checks: the field's verdict (TryMove/TryHit/type immunity and status application);</li>
 * <li>speed: multiplied by the field's measured Speed factor for that Pokémon.</li>
 * </ul>
 * All measurements are read-only queries; battles without a field are not touched. Each AI decision prefetches its
 * active matchups in one engine call and may add at most {@link #LAZY_BUDGET} further queries (switch candidates);
 * beyond that the native estimate is used and the shortfall is logged.
 */
public final class RunBunFieldAdapter {
    private RunBunFieldAdapter() {}
    static final int LAZY_BUDGET = Integer.getInteger("rejuvenation.aiLazyQueries", 16);
    private static final class Decision { PokemonBattle battle; int lazy; int skipped; long start; }
    private static final ThreadLocal<Decision> decision = new ThreadLocal<>();

    /** RunBunAI.choose HEAD: prefetch the matchups of the deciding Pokémon. */
    public static void begin(ActiveBattlePokemon active, PokemonBattle battle, ShowdownMoveset moveset) {
        if (battle == null || active == null) { decision.remove(); RunBunStrategy.begin(); return; }
        // A decision that threw before end() leaves no stale scope behind: every choose() starts a new one.
        var d = new Decision(); d.battle = battle; d.start = System.nanoTime(); decision.set(d);
        FieldEvaluator.forget(battle.getBattleId());
        RunBunStrategy.begin();
        try {
            var self = active.getBattlePokemon();
            if (self == null) return;
            var queries = new ArrayList<FieldEvaluator.Query>();
            List<String> own = new ArrayList<>();
            if (moveset != null) for (var move : moveset.getMoves()) own.add(move.getId());
            if (own.isEmpty()) for (var move : self.getMoveSet().getMoves()) own.add(move.getName());
            for (var foeActive : active.getActor().getSide().getOppositeSide().getActivePokemon()) {
                var foe = foeActive.getBattlePokemon();
                if (foe == null || foe.getHealth() <= 0) continue;
                for (String move : own) queries.add(new FieldEvaluator.Query(self.getUuid(), move, foe.getUuid()));
                for (var move : foe.getMoveSet().getMoves()) queries.add(new FieldEvaluator.Query(foe.getUuid(), move.getName(), self.getUuid()));
            }
            FieldEvaluator.evaluate(battle, queries, "Run & Bun AI");
        } catch (Exception error) {
            RejuvenationFields.LOG.error("Run & Bun field prefetch failed; native estimates are used", error);
        }
    }

    /** RunBunAI.choose RETURN. */
    public static void end() {
        var d = decision.get();
        if (d == null) return;
        decision.remove();
        if (d.skipped > 0) RejuvenationFields.LOG.debug("Run & Bun decision used native estimates for {} matchups beyond the evaluation budget", d.skipped);
        RejuvenationFields.LOG.debug("Run & Bun decision with field evaluation took {} ms ({} lazy queries)", (System.nanoTime() - d.start) / 1_000_000, d.lazy);
    }

    private static Optional<FieldEvaluator.Result> result(BattlePokemon attacker, BattlePokemon defender, String move) {
        var d = decision.get();
        if (d == null || attacker == null || defender == null || move == null) return Optional.empty();
        var query = new FieldEvaluator.Query(attacker.getUuid(), move, defender.getUuid());
        var hit = FieldEvaluator.cached(d.battle.getBattleId(), query);
        if (hit.isPresent()) return hit;
        if (d.lazy >= LAZY_BUDGET) { d.skipped++; return Optional.empty(); }
        d.lazy++;
        return Optional.ofNullable(FieldEvaluator.evaluate(d.battle, List.of(query), "Run & Bun AI").get(query));
    }

    /** PokeMathMax.damage(...) RETURN: the AI's estimate under the active field. */
    public static int damage(BattlePokemon attacker, BattlePokemon defender, Move move, int estimate) {
        if (move == null) return estimate;
        var result = result(attacker, defender, move.getName());
        return result.isEmpty() ? estimate : adjustDamage(estimate, result.get());
    }

    /** The pure correction: the AI's own estimate scaled by the measured field effect. */
    public static int adjustDamage(int estimate, FieldEvaluator.Result r) {
        if (r.fieldBlocks()) return 0;
        if (estimate > 0) {
            var factor = r.damageFactor();
            return factor.isPresent() ? (int) Math.max(0, Math.round(estimate * factor.getAsDouble())) : estimate;
        }
        // The AI's own model gives nothing (a native immunity, or a status move the field turns into an attack):
        // use the simulator's field damage, at the mean of its highest and lowest rolls.
        var field = r.field().maxDamage();
        return field.isPresent() && field.getAsInt() > 0 ? (int) Math.round(field.getAsInt() * 0.925) : estimate;
    }

    /** PokeMathMax.isImmuneCheck(...) RETURN. */
    public static boolean immune(BattlePokemon attacker, BattlePokemon defender, Move move, boolean estimate) {
        if (move == null) return estimate;
        var result = result(attacker, defender, move.getName());
        return result.isEmpty() ? estimate : adjustImmune(estimate, result.get());
    }
    /** The field's verdict replaces the AI's: a field can both create and remove immunities. */
    public static boolean adjustImmune(boolean estimate, FieldEvaluator.Result r) { return r.fieldBlocks(); }
    /** The AI's speed estimate with the field's measured Speed factor. */
    public static double adjustSpeed(double estimate, OptionalDouble factor) { return factor.isPresent() ? estimate * factor.getAsDouble() : estimate; }

    /** PokeMathMax.getEffectiveSpeed(...) RETURN: the AI's speed estimate with the field's Speed modifiers. */
    public static double speed(BattlePokemon pokemon, double estimate) {
        var d = decision.get();
        if (d == null || pokemon == null) return estimate;
        // Any cached query involving the Pokémon carries its field and native Speed.
        for (var actor : d.battle.getActors()) for (var active : actor.getActivePokemon()) {
            var other = active.getBattlePokemon();
            if (other == null || other == pokemon) continue;
            for (var move : pokemon.getMoveSet().getMoves()) {
                var hit = FieldEvaluator.cached(d.battle.getBattleId(), new FieldEvaluator.Query(pokemon.getUuid(), move.getName(), other.getUuid()));
                if (hit.isPresent() && hit.get().userSpeedFactor().isPresent()) return adjustSpeed(estimate, hit.get().userSpeedFactor());
            }
            for (var move : other.getMoveSet().getMoves()) {
                var hit = FieldEvaluator.cached(d.battle.getBattleId(), new FieldEvaluator.Query(other.getUuid(), move.getName(), pokemon.getUuid()));
                if (hit.isPresent() && hit.get().targetSpeedFactor().isPresent()) return adjustSpeed(estimate, hit.get().targetSpeedFactor());
            }
        }
        return estimate;
    }
}
