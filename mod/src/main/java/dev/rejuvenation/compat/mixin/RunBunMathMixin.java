package dev.rejuvenation.compat.mixin;

import com.cobblemon.mod.common.api.moves.Move;
import com.cobblemon.mod.common.api.types.ElementalType;
import com.cobblemon.mod.common.battles.ActiveBattlePokemon;
import com.cobblemon.mod.common.battles.pokemon.BattlePokemon;
import com.cobblemon.mod.common.api.pokemon.stats.Stats;
import com.gitlab.surilexa.rbrctai.api.ai.utils.RBStatStages;
import dev.rejuvenation.compat.RunBunFieldAdapter;
import java.util.Map;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Pseudo;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

/**
 * Run &amp; Bun's damage, immunity and speed estimates corrected by the field engine's measurements.
 * The seven-argument damage overload delegates to this eight-argument one, so every estimate passes here once.
 */
@Pseudo
@Mixin(targets="com.gitlab.surilexa.rbrctai.api.ai.utils.PokeMathMax", remap=false)
public abstract class RunBunMathMixin {
    @Inject(method="damage(Lcom/cobblemon/mod/common/battles/pokemon/BattlePokemon;Lcom/cobblemon/mod/common/battles/pokemon/BattlePokemon;Lcom/cobblemon/mod/common/api/moves/Move;Lcom/cobblemon/mod/common/battles/ActiveBattlePokemon;ZZLcom/gitlab/surilexa/rbrctai/api/ai/utils/RBStatStages;Z)I", at=@At("RETURN"), cancellable=true)
    private static void rejuvenation$damage(BattlePokemon attacker, BattlePokemon defender, Move move, ActiveBattlePokemon active, boolean a, boolean b, RBStatStages stages, boolean dynamaxed, CallbackInfoReturnable<Integer> cir) {
        int adjusted = RunBunFieldAdapter.damage(attacker, defender, move, cir.getReturnValueI());
        if (adjusted != cir.getReturnValueI()) cir.setReturnValue(adjusted);
    }
    @Inject(method="isImmuneCheck", at=@At("RETURN"), cancellable=true)
    private static void rejuvenation$immune(Move move, BattlePokemon attacker, BattlePokemon defender, ActiveBattlePokemon active, ElementalType type, boolean flag, CallbackInfoReturnable<Boolean> cir) {
        boolean adjusted = RunBunFieldAdapter.immune(attacker, defender, move, cir.getReturnValueZ());
        if (adjusted != cir.getReturnValueZ()) cir.setReturnValue(adjusted);
    }
    @Inject(method="getEffectiveSpeed", at=@At("RETURN"), cancellable=true)
    private static void rejuvenation$speed(BattlePokemon pokemon, Map<Stats, Integer> stages, CallbackInfoReturnable<Double> cir) {
        double adjusted = RunBunFieldAdapter.speed(pokemon, cir.getReturnValueD());
        if (adjusted != cir.getReturnValueD()) cir.setReturnValue(adjusted);
    }
}
