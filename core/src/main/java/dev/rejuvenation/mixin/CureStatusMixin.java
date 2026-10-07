package dev.rejuvenation.mixin;
import com.cobblemon.mod.common.api.battles.model.PokemonBattle;
import com.cobblemon.mod.common.api.battles.interpreter.Effect;
import com.cobblemon.mod.common.api.pokemon.status.Status;
import com.cobblemon.mod.common.battles.interpreter.instructions.CureStatusInstruction;
import com.cobblemon.mod.common.battles.pokemon.BattlePokemon;
import net.minecraft.class_2561;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Redirect;

/** Preserve canonical cure persistence/packets/context with an optional replacement message. */
@Mixin(value=CureStatusInstruction.class,remap=false)
public abstract class CureStatusMixin {
    @Redirect(method="invoke$lambda$0",at=@At(value="INVOKE",target="Lcom/cobblemon/mod/common/api/battles/model/PokemonBattle;broadcastChatMessage(Lnet/minecraft/class_2561;)V"))
    private static void rejuvenation$message(PokemonBattle battle,class_2561 text,
            BattlePokemon pokemon,BattlePokemon active,CureStatusInstruction instruction,
            Effect effect,Status status,PokemonBattle originalBattle) {
        if(!instruction.getMessage().hasOptionalArgument("rejuvenationsilent"))battle.broadcastChatMessage(text);
    }
}
