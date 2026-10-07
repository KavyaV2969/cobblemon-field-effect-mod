package dev.rejuvenation.compat;

import com.cobblemon.mod.common.battles.*;
import com.cobblemon.mod.common.battles.actor.PlayerBattleActor;
import com.cobblemon.mod.common.pokemon.OriginalTrainerType;
import java.util.function.Predicate;

/** Shared request filters and Mega activation constraint, used by every trainer AI and Run & Bun lookahead. */
public final class RunBunGimmickPolicy {
    private RunBunGimmickPolicy() {}

    /** Every NPC's available Mega activates on its first legal move, independent of trainer, species or field. */
    public static boolean requiresMega(boolean npc, boolean playerActor, ShowdownMoveset request, boolean forceSwitch) {
        return npc && !playerActor && !forceSwitch && request != null && request.getCanMegaEvo();
    }

    public static boolean requiresMega(ActiveBattlePokemon active, ShowdownMoveset request, boolean forceSwitch) {
        if (active == null || active.getBattlePokemon() == null) return false;
        var original = active.getBattlePokemon().getOriginalPokemon();
        return requiresMega(original.getOriginalTrainerType() == OriginalTrainerType.NPC,
            active.getActor() instanceof PlayerBattleActor, request, forceSwitch);
    }

    /** Upgrade a chosen move only when its Mega variant is legal; never invent an unavailable resource. */
    public static MoveActionResponse megaVariant(ShowdownActionResponse response, ShowdownMoveset request,
                                                 Predicate<MoveActionResponse> legal) {
        if (request == null || !request.getCanMegaEvo() || !(response instanceof MoveActionResponse move)) return null;
        var mega = new MoveActionResponse(move.getMoveName(), move.getTargetPnx(), "mega");
        return legal.test(mega) ? mega : null;
    }

    /** Legal fallback also covers missing field state, unavailable evaluator, errors and native voluntary switches. */
    public static ShowdownActionResponse megaFallback(ActiveBattlePokemon active, ShowdownMoveset request,
                                                       ShowdownActionResponse preferred) {
        var mega = megaVariant(preferred, request, response -> TrainerBattlePolicy.available(response,request) && response.isValid(active, request, false));
        if (mega != null) return mega;
        if (request != null && request.getCanMegaEvo()) for (var move : request.getMoves()) {
            if (!move.canBeUsed()) continue;
            var targets = move.getTarget().getTargetList().invoke(active);
            if (targets == null || targets.isEmpty()) {
                var response = new MoveActionResponse(move.getId(), null, "mega");
                if (response.isValid(active, request, false)) return response;
            } else for (var target : targets) if (target instanceof ActiveBattlePokemon pokemon) {
                var response = new MoveActionResponse(move.getId(), pokemon.getPNX(), "mega");
                if (response.isValid(active, request, false)) return response;
            }
        }
        return preferred;
    }

    /** Per-Pokemon declarations authorize; optional AI targets narrow them, never enable undeclared resources. */
    public static void restrictSelectors(ShowdownMoveset request, String species, String teraTarget, String dynamaxTarget) {
        if (request == null) return;
        if (teraTarget != null && !teraTarget.isBlank() && !teraTarget.equalsIgnoreCase(species)) request.setCanTerastallize(null);
        restrictDynamax(request, dynamaxTarget == null || dynamaxTarget.isBlank() || dynamaxTarget.equalsIgnoreCase(species));
    }

    public static void restrictDeclarations(ShowdownMoveset request, String tera, boolean dynamax) {
        if (request == null) return;
        // Keep the simulator's resolved type (including random Tera); declarations cannot invent availability.
        if (tera == null || tera.isBlank()) request.setCanTerastallize(null);
        restrictDynamax(request, dynamax);
    }

    private static void restrictDynamax(ShowdownMoveset request, boolean allowed) {
        // maxMoves also appears during an already active Dynamax. Keep those mandatory moves; block initiation only.
        if (request.getCanDynamax() && !allowed) {
            request.setCanDynamax(false);
            request.setMaxMoves(null);
            // Parsing has already mapped each ordinary move to its Max Move. Remove that stale mapping as well.
            for (var move : request.getMoves()) move.setGimmickMove(null);
            request.setGimmickMapping();
        }
    }
}
