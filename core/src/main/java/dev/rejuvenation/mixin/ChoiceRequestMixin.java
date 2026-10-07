package dev.rejuvenation.mixin;

import com.cobblemon.mod.common.api.net.NetworkPacket;
import com.cobblemon.mod.common.battles.actor.PlayerBattleActor;
import com.cobblemon.mod.common.net.messages.client.battle.BattleMakeChoicePacket;
import dev.rejuvenation.InspectorSync;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

/** After a player's choice prompt is queued, prepare field-aware previews of that player's moves. */
@Mixin(value=PlayerBattleActor.class, remap=false)
public abstract class ChoiceRequestMixin {
    @Inject(method="sendUpdate", at=@At("TAIL"), require=0)
    private void rejuvenation$previews(NetworkPacket<?> packet, CallbackInfo ci) {
        if (packet instanceof BattleMakeChoicePacket) InspectorSync.choiceRequested((PlayerBattleActor)(Object)this);
    }
}
