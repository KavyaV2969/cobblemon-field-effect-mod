package dev.rejuvenation.mixin;

import com.cobblemon.mod.common.api.battles.model.PokemonBattle;
import com.cobblemon.mod.common.battles.interpreter.instructions.WeatherInstruction;
import net.minecraft.class_2561;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Redirect;

/** Keep Cobblemon's weather context update while replacing its generic chat. */
@Mixin(value=WeatherInstruction.class,remap=false)
public abstract class WeatherMessageMixin {
    @Redirect(method="invoke$lambda$1",at=@At(value="INVOKE",target="Lcom/cobblemon/mod/common/api/battles/model/PokemonBattle;broadcastChatMessage(Lnet/minecraft/class_2561;)V"))
    private static void rejuvenation$message(PokemonBattle battle,class_2561 text,
            WeatherInstruction instruction,String weather,PokemonBattle originalBattle) {
        if(!instruction.getMessage().hasOptionalArgument("rejuvenationsilent"))battle.broadcastChatMessage(text);
    }
}
