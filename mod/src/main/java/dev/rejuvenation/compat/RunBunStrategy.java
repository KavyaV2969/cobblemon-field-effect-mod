package dev.rejuvenation.compat;

import com.cobblemon.mod.common.api.battles.model.PokemonBattle;
import com.cobblemon.mod.common.battles.*;
import com.cobblemon.mod.common.battles.runner.ShowdownService;
import com.cobblemon.mod.common.battles.runner.graal.GraalShowdownService;
import com.google.gson.*;
import dev.rejuvenation.FieldApi;
import dev.rejuvenation.RejuvenationFields;
import java.util.*;

/** Consequence lookahead supplements Run & Bun's move-family scoring; all mechanics stay in the shared evaluator. */
public final class RunBunStrategy {
    private RunBunStrategy() {}
    private static final ThreadLocal<Map<String,Integer>> scores = ThreadLocal.withInitial(HashMap::new);
    private static final ThreadLocal<Map<String,Object>> evaluations=ThreadLocal.withInitial(HashMap::new);
    private static final ThreadLocal<Object> selectedEvaluation=new ThreadLocal<>();
    public static void begin() { scores.get().clear();evaluations.get().clear();selectedEvaluation.remove(); }
    public static void score(String move, UUID target, int score,Object evaluation) { if (target != null) { scores.get().put(move + "/" + target, score);evaluations.get().put(move+"/"+target,evaluation); } }
    public static Object takeSelectedEvaluation() { var result=selectedEvaluation.get();selectedEvaluation.remove();return result; }
    private record Candidate(JsonObject query, ShowdownActionResponse response, int nativeScore) {}

    /** Sanitized request availability is authoritative, including the installed mod's resource restrictions. */
    public static ShowdownActionResponse finish(ActiveBattlePokemon active, PokemonBattle battle, ShowdownMoveset request,
                                               boolean forceSwitch, ShowdownActionResponse nativeChoice) {
        try {
            if (battle == null || active.getBattlePokemon() == null || (request == null && !forceSwitch) || FieldApi.current(battle.getBattleId()).isEmpty()) return nativeChoice;
            if (!(ShowdownService.Companion.getService() instanceof GraalShowdownService service) || service.context == null) return nativeChoice;
            var candidates = new ArrayList<Candidate>();
            int allies = (int)active.getActor().getPokemonList().stream().filter(p -> p.getHealth() > 0).count();
            var foeActives = active.getActor().getSide().getOppositeSide().getActivePokemon();
            if (foeActives.stream().noneMatch(p -> p.getBattlePokemon() != null && p.getBattlePokemon().getHealth() > 0)) return nativeChoice;
            if (!forceSwitch) for (int i = 0; i < request.getMoves().size(); i++) {
                var move = request.getMoves().get(i);
                var gimmicks = new ArrayList<String>();
                if (move.canBeUsed()) gimmicks.add("");
                if (request.getCanMegaEvo() && move.canBeUsed()) gimmicks.add("mega");
                if (request.getCanUltraBurst() && move.canBeUsed()) gimmicks.add("ultra");
                if (request.getCanTerastallize() != null && move.canBeUsed()) gimmicks.add("terastallize");
                if (available(request.getCanZMove(),i)) gimmicks.add("zmove");
                if (request.getCanDynamax() && available(request.getMaxMoves(),i)) gimmicks.add("dynamax");
                for (String gimmick : gimmicks) {
                    var targetType = gimmick.equals("zmove") ? request.getCanZMove().get(i).getTarget()
                        : gimmick.equals("dynamax") ? request.getMaxMoves().get(i).getTarget() : move.getTarget();
                    var targets = targetType.getTargetList().invoke(active);
                    var choices = new ArrayList<ActiveBattlePokemon>();
                    if (targets == null || targets.isEmpty()) choices.add(foeActives.stream().filter(p -> p.getBattlePokemon()!=null).findFirst().orElseThrow());
                    else for (var target : targets) if (target instanceof ActiveBattlePokemon pokemon && pokemon.getBattlePokemon()!=null) choices.add(pokemon);
                    for (var target : choices) {
                        var response = new MoveActionResponse(move.getId(), targets == null || targets.isEmpty() ? null : target.getPNX(), gimmick.isEmpty() ? null : gimmick);
                        if (!response.isValid(active,request,false)) continue;
                        var q = new JsonObject();q.addProperty("move",move.getId());q.addProperty("target",target.getBattlePokemon().getUuid().toString());
                        if (!gimmick.isEmpty()) q.addProperty("gimmick",gimmick);
                        int nativeScore = scores.get().getOrDefault(move.getId()+"/"+target.getBattlePokemon().getUuid(),0);
                        candidates.add(new Candidate(q,response,nativeScore));
                    }
                }
            }
            if (forceSwitch || !request.getTrapped()) for (var pokemon : active.getActor().getPokemonList()) {
                var response = new SwitchActionResponse(pokemon.getUuid());
                if (!response.isValid(active,request,forceSwitch)) continue;
                var q = new JsonObject();q.addProperty("switch",pokemon.getUuid().toString());
                candidates.add(new Candidate(q,response,nativeChoice instanceof SwitchActionResponse s && s.getNewPokemonId().equals(pokemon.getUuid()) ? 4 : 0));
            }
            if (candidates.isEmpty()) return nativeChoice;
            // The native choice is always rolled out completely; other gimmick variants and switches may be screened.
            for (var candidate : candidates) if (candidate.response().equals(nativeChoice)) candidate.query().addProperty("native", true);
            var json = new JsonObject();json.addProperty("user",active.getBattlePokemon().getUuid().toString());
            var queries = new JsonArray();for (var candidate:candidates) queries.add(candidate.query());json.add("candidates",queries);
            long started = System.nanoTime();
            var text = service.getContext().getBindings("js").getMember("RejuvenationEngine").getMember("strategy").execute(battle.getBattleId().toString(),json.toString()).asString();
            var result = JsonParser.parseString(text).getAsJsonObject();
            var rows = result.getAsJsonArray("candidates");
            double best = -Double.MAX_VALUE;ShowdownActionResponse choice = nativeChoice;Candidate chosen=null;
            // Shared resources are expensive when reserves remain. Gimmicks compete on the same score scale.
            // Require a material gain; safe KOs without a gimmick preserve the resource.
            for (int i=0;i<rows.size() && i<candidates.size();i++) {
                var row = rows.get(i).getAsJsonObject();if (row.has("error") || row.has("pruned")) continue;
                var candidate = candidates.get(i);
                String gimmick = candidate.response() instanceof MoveActionResponse move ? move.getGimmickID() : null;
                double score = candidateScore(row.get("score").getAsDouble(), candidate.nativeScore(), gimmick, allies, candidate.response().equals(nativeChoice));
                if (score>best) {best=score;choice=candidate.response();chosen=candidate;}
            }
            RejuvenationFields.LOG.debug("Run & Bun consequence scoring: {} candidates in {} ms; {}", candidates.size(),(System.nanoTime()-started)/1_000_000,result.get("metrics"));
            if(chosen!=null && chosen.query().has("move") && chosen.query().has("target"))selectedEvaluation.set(evaluations.get().get(chosen.query().get("move").getAsString()+"/"+chosen.query().get("target").getAsString()));
            return choice;
        } catch (Exception error) {
            RejuvenationFields.LOG.error("Run & Bun consequence scoring failed; existing decision retained",error);
            return nativeChoice;
        } finally { scores.remove();evaluations.remove(); }
    }
    private static boolean available(List<InBattleGimmickMove> moves,int i) { return moves!=null && i<moves.size() && moves.get(i)!=null && !moves.get(i).getDisabled(); }
    public static double resourceCost(String gimmick,int survivingAllies) {
        return (gimmick.equals("mega") || gimmick.equals("ultra") ? 2 : 8)+Math.max(0,survivingAllies-1)*4;
    }
    /** The production decision scale, also used by isolated Graal decision-quality fixtures. */
    public static double candidateScore(double consequence,int nativeScore,String gimmick,int survivingAllies,boolean nativeChoice) {
        return consequence+3*nativeScore-(gimmick==null?0:resourceCost(gimmick,survivingAllies))+(nativeChoice?1:0);
    }
}
