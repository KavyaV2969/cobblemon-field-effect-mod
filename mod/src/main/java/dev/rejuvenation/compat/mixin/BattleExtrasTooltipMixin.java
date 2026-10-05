package dev.rejuvenation.compat.mixin;

import com.cobblemon.mod.common.api.moves.categories.DamageCategory;
import com.cobblemon.mod.common.api.types.ElementalType;
import dev.rejuvenation.client.BattleExtrasFieldAdapter;
import net.minecraft.class_2561;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.ModifyVariable;
import java.util.List;

/** Battle Extras' move tooltip: effective type and category icons, plus one line describing the field's effect. */
@Mixin(targets="name.modid.client.MoveTooltipOverlayState", remap=false)
public abstract class BattleExtrasTooltipMixin {
    @ModifyVariable(method="queue", at=@At("HEAD"), argsOnly=true, ordinal=0)
    private static List<class_2561> rejuvenation$lines(List<class_2561> lines) { return BattleExtrasFieldAdapter.lines(lines); }
    @ModifyVariable(method="queue", at=@At("HEAD"), argsOnly=true)
    private static ElementalType rejuvenation$type(ElementalType type) { return BattleExtrasFieldAdapter.type(type); }
    @ModifyVariable(method="queue", at=@At("HEAD"), argsOnly=true)
    private static DamageCategory rejuvenation$category(DamageCategory category) { return BattleExtrasFieldAdapter.category(category); }
}
