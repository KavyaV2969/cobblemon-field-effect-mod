package dev.rejuvenation.compat.mixin;

import com.cobblemon.mod.common.client.gui.battle.subscreen.BattleMoveSelection;
import dev.rejuvenation.client.BattleExtrasFieldAdapter;
import net.minecraft.class_332;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

/**
 * Marks the span in which Battle Extras builds a move tile's tooltip (a method its MoveTileMixin adds to Cobblemon's
 * move tile), so only that tooltip's type-chart lookups receive the measured effectiveness. The priority is above
 * Battle Extras' default so its merged method exists when these injections apply; the tile render resets the span.
 */
@Mixin(value=BattleMoveSelection.MoveTile.class, remap=false, priority=1100)
public abstract class BattleExtrasTooltipScopeMixin {
    @Inject(method="renderTooltipAtPosition", at=@At("HEAD"))
    private void rejuvenation$open(class_332 context, int x, int y, int width, int[] bounds, CallbackInfo ci) { BattleExtrasFieldAdapter.tooltip(true); }
    @Inject(method="renderTooltipAtPosition", at=@At("RETURN"))
    private void rejuvenation$close(class_332 context, int x, int y, int width, int[] bounds, CallbackInfo ci) { BattleExtrasFieldAdapter.tooltip(false); }
}
