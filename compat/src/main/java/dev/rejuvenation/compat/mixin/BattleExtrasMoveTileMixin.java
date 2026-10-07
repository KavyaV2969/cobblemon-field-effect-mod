package dev.rejuvenation.compat.mixin;

import com.cobblemon.mod.common.api.moves.MoveTemplate;
import com.cobblemon.mod.common.battles.InBattleMove;
import com.cobblemon.mod.common.client.gui.battle.subscreen.BattleMoveSelection;
import dev.rejuvenation.compat.client.BattleExtrasFieldAdapter;
import net.minecraft.class_332;
import org.spongepowered.asm.mixin.Final;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

/**
 * Records which Pokémon's move tile is being drawn. Battle Extras computes its move tooltip and damage preview
 * inside this render call, so the preview hooks know whose move they are looking at. Applied only with Battle Extras.
 */
@Mixin(value=BattleMoveSelection.MoveTile.class, remap=false, priority=500)
public abstract class BattleExtrasMoveTileMixin {
    @Shadow @Final private BattleMoveSelection moveSelection;
    @Shadow @Final private InBattleMove move;
    @Shadow private MoveTemplate moveTemplate;
    @Inject(method="render", at=@At("HEAD"))
    private void rejuvenation$tile(class_332 context, int mouseX, int mouseY, float delta, CallbackInfo ci) {
        var request = moveSelection.getRequest();
        var active = request == null ? null : request.getActivePokemon();
        var pokemon = active == null ? null : active.getBattlePokemon();
        var response = ((BattleMoveSelection.MoveTile)(Object)this).getResponse();
        BattleExtrasFieldAdapter.tile(pokemon == null ? null : pokemon.getUuid(), response == null ? null : response.getMoveName(), moveTemplate,
            response == null ? null : response.getGimmickID());
    }
}
