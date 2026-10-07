package dev.rejuvenation.compat.mixin;

import com.cobblemon.mod.common.api.battles.model.PokemonBattle;
import com.cobblemon.mod.common.battles.ActiveBattlePokemon;
import com.cobblemon.mod.common.battles.BattleSide;
import com.cobblemon.mod.common.battles.ShowdownActionResponse;
import com.cobblemon.mod.common.battles.ShowdownMoveset;
import dev.rejuvenation.compat.RunBunFieldAdapter;
import dev.rejuvenation.compat.RunBunStrategy;
import dev.rejuvenation.compat.RunBunGimmickPolicy;
import dev.rejuvenation.compat.TrainerGimmickSelector;
import dev.rejuvenation.compat.TrainerBattlePolicy;
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
public abstract class RunBunDecisionMixin implements TrainerGimmickSelector {
    @Shadow private boolean canTera;
    @Shadow private String teraTarget;
    @Shadow private boolean canDynamax;
    @Shadow private String dynamaxTarget;
    @Shadow private boolean hasUsedMega;
    @Shadow private boolean hasUsedTera;
    @Shadow private RBSlotInformation selfInfo;
    @Override public void rejuvenation$restrictTargets(ShowdownMoveset request, String species) {
        RunBunGimmickPolicy.restrictSelectors(request,species,teraTarget,dynamaxTarget);
    }
    @Inject(method="choose", at=@At("HEAD"), require=1)
    private void rejuvenation$begin(ActiveBattlePokemon active, PokemonBattle battle, BattleSide side, ShowdownMoveset moveset, boolean forceSwitch, CallbackInfoReturnable<ShowdownActionResponse> cir) {
        // Declarations at the actor boundary are authoritative even when the RB config uses its default false flags.
        if (TrainerBattlePolicy.isNpc(active)) {
            canTera = moveset != null && moveset.getCanTerastallize() != null;
            canDynamax = moveset != null && moveset.getCanDynamax();
            if (moveset != null && moveset.getCanMegaEvo()) hasUsedMega=false;
            if (canTera) hasUsedTera=false;
        } else if (moveset != null && active != null && active.getBattlePokemon()!=null) {
            // Preserve the previous Run & Bun config filtering outside the NPC policy's scope.
            rejuvenation$restrictTargets(moveset,active.getBattlePokemon().getEffectedPokemon().showdownId());
            RunBunGimmickPolicy.restrictDeclarations(moveset,
                canTera || teraTarget!=null && !teraTarget.isBlank() ? moveset.getCanTerastallize() : null,
                canDynamax || dynamaxTarget!=null && !dynamaxTarget.isBlank());
        }
        RunBunFieldAdapter.begin(active, battle, moveset);
    }
    @Inject(method="choose", at=@At("RETURN"), cancellable=true, require=1)
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
