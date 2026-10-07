package dev.rejuvenation.compat.mixin;

import com.cobblemon.mod.common.api.moves.Move;
import com.cobblemon.mod.common.battles.ActiveBattlePokemon;
import dev.rejuvenation.compat.RunBunStrategy;
import org.spongepowered.asm.mixin.*;
import org.spongepowered.asm.mixin.injection.*;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

/** Retains native move-family preferences as an input to consequence lookahead. */
@Pseudo
@Mixin(targets="com.gitlab.surilexa.rbrctai.api.ai.RunBunAI$MoveEvaluation",remap=false)
public abstract class RunBunScoreMixin {
    @Shadow private Move move;
    @Shadow private ActiveBattlePokemon opponent;
    @Inject(method="setScore",at=@At("RETURN"))
    private void rejuvenation$score(int score,CallbackInfo ci) {
        if(opponent!=null && opponent.getBattlePokemon()!=null) RunBunStrategy.score(move.getName(),opponent.getBattlePokemon().getUuid(),score,this);
    }
}
