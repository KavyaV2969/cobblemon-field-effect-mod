package dev.rejuvenation.compat.mixin;

import com.cobblemon.mod.common.api.battles.model.PokemonBattle;
import com.cobblemon.mod.common.battles.ActiveBattlePokemon;
import com.cobblemon.mod.common.battles.BattleSide;
import com.cobblemon.mod.common.battles.ShowdownActionResponse;
import com.cobblemon.mod.common.battles.ShowdownMoveset;
import dev.rejuvenation.compat.RunBunFieldAdapter;
import dev.rejuvenation.compat.RunBunStrategy;
import com.cobblemon.mod.common.battles.MoveActionResponse;
import com.cobblemon.mod.common.battles.SwitchActionResponse;
import com.gitlab.surilexa.rbrctai.api.ai.RunBunAI;
import com.gitlab.surilexa.rbrctai.api.ai.utils.RBSlotInformation;
import org.spongepowered.asm.mixin.Shadow;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Pseudo;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfoReturnable;

/** Opens a field-evaluation scope around one Run &amp; Bun decision (rbrctai, applied only when installed). */
@Pseudo
@Mixin(targets="com.gitlab.surilexa.rbrctai.api.ai.RunBunAI", remap=false)
public abstract class RunBunDecisionMixin {
    @Shadow private boolean hasUsedMega;
    @Shadow private boolean hasUsedTera;
    @Shadow private RBSlotInformation selfInfo;
    @Inject(method="choose", at=@At("HEAD"))
    private void rejuvenation$begin(ActiveBattlePokemon active, PokemonBattle battle, BattleSide side, ShowdownMoveset moveset, boolean forceSwitch, CallbackInfoReturnable<ShowdownActionResponse> cir) {
        RunBunFieldAdapter.begin(active, battle, moveset);
    }
    @Inject(method="choose", at=@At("RETURN"), cancellable=true)
    private void rejuvenation$end(ActiveBattlePokemon active, PokemonBattle battle, BattleSide side, ShowdownMoveset moveset, boolean forceSwitch, CallbackInfoReturnable<ShowdownActionResponse> cir) {
        try {
            var chosen = RunBunStrategy.finish(active,battle,moveset,forceSwitch,cir.getReturnValue());
            var selected=RunBunStrategy.takeSelectedEvaluation();
            if (selfInfo != null) {
                String gimmick = chosen instanceof MoveActionResponse m ? m.getGimmickID() : null;
                // Native choose eagerly marks resources as used. Reconcile them when lookahead delays activation.
                if (moveset != null && moveset.getCanMegaEvo()) { hasUsedMega="mega".equals(gimmick); selfInfo.setHasUsedMega(hasUsedMega); }
                if (moveset != null && moveset.getCanTerastallize()!=null) { hasUsedTera="terastallize".equals(gimmick); selfInfo.setHasUsedTera(hasUsedTera); }
                if (moveset != null && moveset.getCanDynamax()) selfInfo.setHasUsedDynamax("dynamax".equals(gimmick));
                if (!chosen.equals(cir.getReturnValue())) {
                    selfInfo.setChosenMove(selected instanceof RunBunAI.MoveEvaluation m ? m : null);
                    for(var pokemon:active.getActor().getPokemonList())pokemon.setWillBeSwitchedIn(chosen instanceof SwitchActionResponse s && s.getNewPokemonId().equals(pokemon.getUuid()));
                }
            }
            cir.setReturnValue(chosen);
        }
        finally { RunBunFieldAdapter.end(); }
    }
}
