package dev.rejuvenation.compat.mixin;

import com.cobblemon.mod.common.api.moves.MoveTemplate;
import com.cobblemon.mod.common.client.battle.ClientBattlePokemon;
import com.cobblemon.mod.common.client.gui.battle.subscreen.BattleMoveSelection;
import dev.rejuvenation.client.BattleExtrasFieldAdapter;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

/**
 * The accuracy Battle Extras shows for a move tile becomes the field engine's measured accuracy (field accuracy
 * overrides, field accuracy rules and stat stages). Battle Extras adds this method to Cobblemon's move tile; the
 * injection is optional and leaves the tooltip's field line to report accuracy if the method is ever renamed.
 */
@Mixin(value=BattleMoveSelection.MoveTile.class, remap=false, priority=1100)
public abstract class BattleExtrasAccuracyMixin {
    @Inject(method="calculateAdjustedAccuracy", at=@At("RETURN"), cancellable=true, require=0)
    private void rejuvenation$accuracy(double base, String ability, ClientBattlePokemon pokemon, MoveTemplate move, CallbackInfoReturnable<Double> cir) {
        double adjusted = BattleExtrasFieldAdapter.accuracy(cir.getReturnValueD());
        if (adjusted != cir.getReturnValueD()) cir.setReturnValue(adjusted);
    }
}
