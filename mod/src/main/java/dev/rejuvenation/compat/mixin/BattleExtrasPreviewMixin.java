package dev.rejuvenation.compat.mixin;

import com.cobblemon.mod.common.api.moves.MoveTemplate;
import dev.rejuvenation.client.BattleExtrasFieldAdapter;
import name.modid.client.MoveDamagePreviewCalculator;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

/**
 * Replaces displayed damage, hit counts and KO labels with complete-hit server measurements. Pending or
 * ambiguous field previews are omitted until authoritative data exists.
 */
@Mixin(targets="name.modid.client.MoveDamagePreviewCalculator", remap=false)
public abstract class BattleExtrasPreviewMixin {
    @Inject(method="calculatePreview", at=@At("HEAD"), cancellable=true)
    private static void rejuvenation$field(MoveDamagePreviewCalculator.AttackContext attack, MoveDamagePreviewCalculator.DefenceContext defence, MoveTemplate move,
                                           float effectiveness, float stab, CallbackInfoReturnable<MoveDamagePreviewCalculator.DamagePreview> cir) {
        if (BattleExtrasFieldAdapter.reentering() || defence == null) return;
        var exact = BattleExtrasFieldAdapter.preview(move, defence.level(), defence.baseHp());
        if (exact.isPresent()) {
            var p = BattleExtrasFieldAdapter.exact(exact.get());
            cir.setReturnValue(new MoveDamagePreviewCalculator.DamagePreview(p.minPercent(), p.maxPercent(), p.koKey(), p.koColor(), p.minHits(), p.maxHits()));
            return;
        }
        // Do not display an estimated native range while authoritative field data is pending,
        // unavailable or cannot identify a doubles target uniquely.
        if (BattleExtrasFieldAdapter.fieldPreviewContext()) cir.setReturnValue(null);
    }
}
