package dev.rejuvenation.mixin;
import com.cobblemon.mod.common.api.battles.model.PokemonBattle;
import com.cobblemon.mod.common.battles.interpreter.instructions.BoostInstruction;
import net.minecraft.class_2561;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Redirect;

/**
 * A field-ability stat change announces its cause in one source line (Battle_Effects.rb:836-838) instead of the
 * ordinary "stat rose" chat line. Only the chat text is withheld; the boost packet, animation and contexts stay native.
 * The redirect is optional: if a Cobblemon update renames the lambda, both lines are shown rather than failing to load.
 */
@Mixin(value=BoostInstruction.class,remap=false)
public abstract class BoostMessageMixin {
    @Redirect(method="postActionEffect$lambda$0",require=0,at=@At(value="INVOKE",target="Lcom/cobblemon/mod/common/api/battles/model/PokemonBattle;broadcastChatMessage(Lnet/minecraft/class_2561;)V"))
    private static void rejuvenation$message(PokemonBattle battle,class_2561 text,
            BoostInstruction instruction,String severity,String rootKey,PokemonBattle originalBattle) {
        if(!instruction.getMessage().hasOptionalArgument("rejuvenationsilent"))battle.broadcastChatMessage(text);
    }
}
