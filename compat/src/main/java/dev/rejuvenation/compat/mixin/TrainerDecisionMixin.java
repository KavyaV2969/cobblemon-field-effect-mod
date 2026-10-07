package dev.rejuvenation.compat.mixin;

import com.cobblemon.mod.common.api.battles.model.PokemonBattle;
import com.cobblemon.mod.common.api.battles.model.actor.AIBattleActor;
import com.cobblemon.mod.common.api.battles.model.ai.BattleAI;
import com.cobblemon.mod.common.battles.*;
import dev.rejuvenation.compat.TrainerBattlePolicy;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Redirect;

/** All AI implementations pass through this actor boundary, including RCT, Run & Bun and Cobblemon defaults. */
@Mixin(value=AIBattleActor.class, remap=false)
public abstract class TrainerDecisionMixin {
    @Redirect(method="onChoiceRequested$lambda$0$0", at=@At(value="INVOKE",
        target="Lcom/cobblemon/mod/common/api/battles/model/ai/BattleAI;choose(Lcom/cobblemon/mod/common/battles/ActiveBattlePokemon;Lcom/cobblemon/mod/common/api/battles/model/PokemonBattle;Lcom/cobblemon/mod/common/battles/BattleSide;Lcom/cobblemon/mod/common/battles/ShowdownMoveset;Z)Lcom/cobblemon/mod/common/battles/ShowdownActionResponse;"), require=1)
    private static ShowdownActionResponse rejuvenation$choose(BattleAI ai, ActiveBattlePokemon active,
        PokemonBattle battle, BattleSide side, ShowdownMoveset request, boolean forceSwitch) {
        return TrainerBattlePolicy.choose(ai, active, battle, side, request, forceSwitch);
    }
}
