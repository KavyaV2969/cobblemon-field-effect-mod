package dev.rejuvenation.compat.mixin;

import com.cobblemon.mod.common.pokemon.Pokemon;
import dev.rejuvenation.compat.BlueNpcEvPolicy;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Shadow;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

/** Restore the explicit champion spread after RCT conversion and after battle-team copying. */
@Mixin(targets = "com.gitlab.srcmc.rctapi.api.trainer.TrainerNPC", remap = false)
public abstract class BlueNpcTeamMixin {
    @Shadow private Pokemon[] team;

    @Inject(method = "initTeam", at = @At("TAIL"), require = 1)
    private void rejuvenation$championEVs(String tag, CallbackInfo ci) {
        if (!BlueNpcEvPolicy.matches(true, tag)) return;
        for (Pokemon pokemon : team) if (BlueNpcEvPolicy.matches(pokemon)) BlueNpcEvPolicy.apply(pokemon);
    }

    @Inject(method = "copyTeam", at = @At("RETURN"), require = 1)
    private static void rejuvenation$copyChampionEVs(Pokemon[] source, CallbackInfoReturnable<Pokemon[]> ci) {
        Pokemon[] copy = ci.getReturnValue();
        for (int i = 0; i < source.length; i++)
            if (BlueNpcEvPolicy.matches(source[i])) BlueNpcEvPolicy.apply(copy[i]);
    }
}
