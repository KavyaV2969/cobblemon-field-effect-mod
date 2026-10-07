package dev.rejuvenation.compat;

import com.cobblemon.mod.common.api.battles.model.PokemonBattle;
import com.cobblemon.mod.common.api.battles.model.ai.BattleAI;
import com.cobblemon.mod.common.battles.*;
import com.cobblemon.mod.common.battles.actor.PlayerBattleActor;
import com.cobblemon.mod.common.exception.IllegalActionChoiceException;
import com.cobblemon.mod.common.pokemon.OriginalTrainerType;
import dev.rejuvenation.RejuvenationFields;
import net.fabricmc.loader.api.FabricLoader;
import java.util.*;

/** Shared permissions, activation and final validation for every NPC AI, independent of fields or AI implementation. */
public final class TrainerBattlePolicy {
    private TrainerBattlePolicy() {}
    // Request identity scopes reservations to a prompt. Weak keys avoid retaining completed battles.
    private static final Map<ShowdownActionRequest, Map<String,String>> reservations = new WeakHashMap<>();

    public static boolean isNpc(ActiveBattlePokemon active) {
        return active != null && !(active.getActor() instanceof PlayerBattleActor) && active.getBattlePokemon() != null
            && active.getBattlePokemon().getOriginalPokemon().getOriginalTrainerType() == OriginalTrainerType.NPC;
    }

    public static ShowdownActionResponse choose(BattleAI ai, ActiveBattlePokemon active, PokemonBattle battle,
        BattleSide side, ShowdownMoveset request, boolean forceSwitch) {
        if (!isNpc(active)) return ai.choose(active,battle,side,request,forceSwitch);
        if (request != null) {
            if (FabricLoader.getInstance().isModLoaded("rctapi")) RctGimmickDeclarations.restrict(active,request);
            else RunBunGimmickPolicy.restrictDeclarations(request,null,false);
            if (ai instanceof TrainerGimmickSelector selector)
                selector.rejuvenation$restrictTargets(request,active.getBattlePokemon().getEffectedPokemon().showdownId());
            var own = reservations.get(active.getActor().getRequest());
            if (own != null) own.remove(active.getPNX()); // Rechoosing this slot releases its previous provisional choice.
            var reserved = new HashSet<String>();
            for (var actor : side.getActors()) {
                var choices = reservations.get(actor.getRequest());
                if (choices != null) reserved.addAll(choices.values());
            }
            restrictReserved(request,reserved);
        }
        var offered = request == null ? null : new Availability(request);
        ShowdownActionResponse chosen;
        try { chosen = ai.choose(active,battle,side,request,forceSwitch); }
        catch(RuntimeException error) {
            RejuvenationFields.LOG.error("Native trainer AI failed; selecting a validated fallback",error);
            chosen=null;
            if(ai instanceof TrainerGimmickSelector) RunBunFieldAdapter.end();
            RunBunStrategy.abort();
        }
        finally {
            // Some native AIs grant permissions or consume flags speculatively. The filtered simulator offer wins.
            if (offered != null) offered.restore(request);
        }
        if (!(ai instanceof TrainerGimmickSelector)) {
            // RCT/default AIs receive the same field consequence comparisons; Run & Bun already ran this inside choose.
            RunBunStrategy.begin();
            chosen=RunBunStrategy.finish(active,battle,request,forceSwitch,chosen);
            RunBunStrategy.takeSelectedEvaluation();
        }
        chosen = finalChoice(active,request,forceSwitch,chosen);
        if (active.getActor().getRequest() != null && chosen instanceof MoveActionResponse move && move.getGimmickID()!=null) {
            reservations.computeIfAbsent(active.getActor().getRequest(),ignored -> new HashMap<>()).put(active.getPNX(),move.getGimmickID());
            RejuvenationFields.LOG.info("Trainer AI {}: {} selected {} with {}",active.getBattlePokemon().getOriginalPokemon().getOriginalTrainer(),
                active.getBattlePokemon().getEffectedPokemon().showdownId(),move.getGimmickID(),move.getMoveName());
        }
        return chosen;
    }

    /** Preserve only availability captured from the simulator and narrowed by declarations/targets/reservations. */
    public record Availability(boolean mega, boolean ultra, String tera, boolean dynamax,
        List<InBattleGimmickMove> zMoves, List<InBattleGimmickMove> maxMoves) {
        public Availability(ShowdownMoveset request) {
            this(request.getCanMegaEvo(),request.getCanUltraBurst(),request.getCanTerastallize(),request.getCanDynamax(),request.getCanZMove(),request.getMaxMoves());
        }
        public void restore(ShowdownMoveset request) {
            request.setCanMegaEvo(mega);request.setCanUltraBurst(ultra);request.setCanTerastallize(tera);
            request.setCanDynamax(dynamax);request.setCanZMove(zMoves);request.setMaxMoves(maxMoves);remap(request);
        }
    }

    public static void restrictReserved(ShowdownMoveset request, Set<String> reserved) {
        if (reserved.contains("mega")) request.setCanMegaEvo(false);
        if (reserved.contains("ultra")) request.setCanUltraBurst(false);
        if (reserved.contains("terastallize")) request.setCanTerastallize(null);
        if (reserved.contains("zmove")) {request.setCanZMove(null);remap(request);}
        if (reserved.contains("dynamax")) RunBunGimmickPolicy.restrictDeclarations(request,request.getCanTerastallize(),false);
    }

    private static void remap(ShowdownMoveset request) {
        for (var move : request.getMoves()) move.setGimmickMove(null);
        request.setGimmickMapping();
    }

    /** Cobblemon isValid does not check gimmick availability; enforce it before trusting a native response. */
    public static boolean available(ShowdownActionResponse response, ShowdownMoveset request) {
        if (!(response instanceof MoveActionResponse move)) return true;
        if (request == null) return false;
        String gimmick=move.getGimmickID();
        if (gimmick==null || gimmick.isEmpty()) return true;
        int i=-1;
        for (int index=0;index<request.getMoves().size();index++) if(request.getMoves().get(index).getId().equals(move.getMoveName())) {i=index;break;}
        if(i<0)return false;
        if (Set.of("mega","ultra","terastallize").contains(gimmick) && !request.getMoves().get(i).canBeUsed()) return false;
        return switch(gimmick) {
            case "mega" -> request.getCanMegaEvo();
            case "ultra" -> request.getCanUltraBurst();
            case "terastallize" -> request.getCanTerastallize()!=null;
            case "dynamax" -> request.getCanDynamax() && offered(request.getMaxMoves(),i);
            case "zmove" -> offered(request.getCanZMove(),i);
            default -> false;
        };
    }

    private static boolean offered(List<InBattleGimmickMove> moves,int i) {
        return moves!=null && i<moves.size() && moves.get(i)!=null && !moves.get(i).getDisabled();
    }

    public static ShowdownActionResponse finalChoice(ActiveBattlePokemon active,ShowdownMoveset request,boolean forceSwitch,ShowdownActionResponse preferred) {
        if (!scorable(preferred) && legal(active,request,forceSwitch,preferred)) return preferred;
        if (RunBunGimmickPolicy.requiresMega(active,request,forceSwitch)) {
            var mega=RunBunGimmickPolicy.megaFallback(active,request,preferred);
            if (mega instanceof MoveActionResponse move && "mega".equals(move.getGimmickID()) && legal(active,request,false,mega)) return mega;
        }
        if (legal(active,request,forceSwitch,preferred)) return preferred;
        // Repair a forbidden gimmick without changing an otherwise legal move and target.
        if (preferred instanceof MoveActionResponse move) {
            var normal=new MoveActionResponse(move.getMoveName(),move.getTargetPnx(),null);
            if(legal(active,request,forceSwitch,normal))return normal;
        }
        if (!forceSwitch && request!=null) for(var move:request.getMoves()) {
            var targets=move.getTarget().getTargetList().invoke(active);
            if(targets==null || targets.isEmpty()) {
                var response=new MoveActionResponse(move.getId(),null,null);
                if(legal(active,request,false,response))return response;
            } else for(var target:targets) if(target instanceof ActiveBattlePokemon pokemon) {
                var response=new MoveActionResponse(move.getId(),pokemon.getPNX(),null);
                if(legal(active,request,false,response))return response;
            }
        }
        for(var pokemon:active.getActor().getPokemonList()) {
            var response=new SwitchActionResponse(pokemon.getUuid());
            if(legal(active,request,forceSwitch,response))return response;
        }
        if(legal(active,request,forceSwitch,PassActionResponse.INSTANCE))return PassActionResponse.INSTANCE;
        throw new IllegalActionChoiceException(active.getActor(),"Trainer AI has no legal response after gimmick validation");
    }

    /** Bag items, passes, forfeits and shifts retain the native policy; the consequence evaluator models moves/switches. */
    public static boolean scorable(ShowdownActionResponse response) {
        return response==null || response instanceof MoveActionResponse || response instanceof SwitchActionResponse;
    }

    private static boolean legal(ActiveBattlePokemon active,ShowdownMoveset request,boolean forceSwitch,ShowdownActionResponse response) {
        return response!=null && available(response,request) && response.isValid(active,request,forceSwitch);
    }
}
