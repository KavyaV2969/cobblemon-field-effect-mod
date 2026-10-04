package dev.rejuvenation.mixin;
import com.cobblemon.mod.common.api.battles.model.PokemonBattle;
import com.cobblemon.mod.common.api.pokemon.status.Status;
import com.cobblemon.mod.common.battles.interpreter.instructions.StatusInstruction;
import com.cobblemon.mod.common.battles.pokemon.BattlePokemon;
import net.minecraft.class_2561;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Redirect;

/** A source-specific message replaces chat only; status packets/persistence remain native. */
@Mixin(value=StatusInstruction.class,remap=false)
public abstract class StatusMessageMixin {
    @Redirect(method="invoke$lambda$0",at=@At(value="INVOKE",target="Lcom/cobblemon/mod/common/api/battles/model/PokemonBattle;broadcastChatMessage(Lnet/minecraft/class_2561;)V"))
    private static void rejuvenation$message(PokemonBattle battle,class_2561 text,
            Status status,BattlePokemon pokemon,PokemonBattle originalBattle,
            String slot,StatusInstruction instruction) {
        if(!instruction.getMessage().hasOptionalArgument("rejuvenationsilent"))battle.broadcastChatMessage(text);
    }
}
