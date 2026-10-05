package dev.rejuvenation.compat.mixin;

import com.cobblemon.mod.common.api.moves.MoveTemplate;
import com.cobblemon.mod.common.client.battle.ClientBattlePokemon;
import com.cobblemon.mod.common.pokemon.Pokemon;
import dev.rejuvenation.client.BattleExtrasFieldAdapter;
import name.modid.client.MoveDamagePreviewCalculator;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Coerce;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;
import java.lang.reflect.Field;

/**
 * Battle Extras' switch screen previews each benched Pokémon's moves against the opposing actives. Under a field
 * these become the server's measurement of that Pokémon after its real switch-in (entry effects included); while
 * the measurement is pending the move shows nothing rather than a field-unaware estimate. Battles without a field
 * keep Battle Extras' own preview.
 */
@Mixin(targets="name.modid.client.CustomBattleController", remap=false)
public abstract class BattleExtrasSwitchPreviewMixin {
    private static Field rejuvenation$battlePokemon;

    @Inject(method="calculateSwitchDamagePreview", at=@At("HEAD"), cancellable=true)
    private static void rejuvenation$enter(Pokemon attacker, String attackerName, MoveTemplate move, @Coerce Object opponent,
                                           CallbackInfoReturnable<MoveDamagePreviewCalculator.DamagePreview> cir) {
        var target = rejuvenation$target(opponent);
        var preview = BattleExtrasFieldAdapter.benchPreview(attacker == null ? null : attacker.getUuid(), move == null ? null : move.getName(), target);
        if (preview instanceof BattleExtrasFieldAdapter.BenchPreview.Exact(var p)) {
            cir.setReturnValue(new MoveDamagePreviewCalculator.DamagePreview(p.minPercent(), p.maxPercent(), p.koKey(), p.koColor(), p.minHits(), p.maxHits()));
            return;
        }
        if (preview instanceof BattleExtrasFieldAdapter.BenchPreview.Pending) { cir.setReturnValue(null); return; }
        // Native path: Battle Extras computes its own estimate, and the move-tile hooks must not apply to it.
        BattleExtrasFieldAdapter.switchPreview(true);
    }

    @Inject(method="calculateSwitchDamagePreview", at=@At("RETURN"))
    private static void rejuvenation$leave(Pokemon attacker, String attackerName, MoveTemplate move, @Coerce Object opponent,
                                           CallbackInfoReturnable<MoveDamagePreviewCalculator.DamagePreview> cir) {
        BattleExtrasFieldAdapter.switchPreview(false);
    }

    /** OpponentMatchupEntry.battlePokemon (a private nested class of Battle Extras); null when its layout changes. */
    private static java.util.UUID rejuvenation$target(Object opponent) {
        if (opponent == null) return null;
        try {
            if (rejuvenation$battlePokemon == null || rejuvenation$battlePokemon.getDeclaringClass() != opponent.getClass()) {
                var field = opponent.getClass().getDeclaredField("battlePokemon");
                field.setAccessible(true);
                rejuvenation$battlePokemon = field;
            }
            return rejuvenation$battlePokemon.get(opponent) instanceof ClientBattlePokemon p ? p.getUuid() : null;
        } catch (ReflectiveOperationException | RuntimeException changed) {
            return null;
        }
    }
}
