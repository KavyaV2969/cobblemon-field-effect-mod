package dev.rejuvenation.compat.mixin;

import dev.rejuvenation.client.BattleExtrasFieldAdapter;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

/**
 * Battle Extras' client type chart, while it builds the hovered move's tooltip, returns the simulator's measured
 * effectiveness under the field. Its effectiveness label and its decision to show a damage range follow that value;
 * every other use of the chart is unchanged.
 */
@Mixin(targets="name.modid.client.TypeChart", remap=false)
public abstract class BattleExtrasTypeChartMixin {
    @Inject(method={"getEffectiveness","getEffectivenessAgainstTypes"}, at=@At("RETURN"), cancellable=true)
    private static void rejuvenation$measured(CallbackInfoReturnable<Float> cir) {
        float measured = BattleExtrasFieldAdapter.effectivenessLabel(cir.getReturnValueF());
        if (!Float.isNaN(measured)) cir.setReturnValue(measured);
    }
}
