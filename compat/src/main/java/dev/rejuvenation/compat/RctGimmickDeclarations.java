package dev.rejuvenation.compat;

import com.cobblemon.mod.common.battles.ActiveBattlePokemon;
import com.cobblemon.mod.common.battles.ShowdownMoveset;
import com.gitlab.srcmc.rctapi.api.RCTApi;
import com.gitlab.srcmc.rctapi.api.trainer.TrainerNPC;

/** Loaded only when RCT API is installed; uses its live registry, including datapack reloads and team UUIDs. */
public final class RctGimmickDeclarations {
    private RctGimmickDeclarations() {}
    public static void restrict(ActiveBattlePokemon active, ShowdownMoveset request) {
        var original = active.getBattlePokemon().getOriginalPokemon();
        var trainer = RCTApi.getInstances().map(entry -> entry.getValue().getTrainerRegistry().getByOT(original))
            .filter(TrainerNPC.class::isInstance).map(TrainerNPC.class::cast).findFirst().orElse(null);
        var declaration = trainer == null ? null : trainer.getGimmicks().of(original);
        RunBunGimmickPolicy.restrictDeclarations(request, declaration == null ? null : declaration.tera(),
            declaration != null && declaration.dynamax());
    }
}
