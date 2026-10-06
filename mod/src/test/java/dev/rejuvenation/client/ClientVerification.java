package dev.rejuvenation.client;

import com.google.gson.*;
import java.util.*;

/** Pure packet/model and layout fixtures: no window, renderer, server or Minecraft launch. */
public final class ClientVerification {
    private static int checks;
    private static void check(boolean value,String text) { if(!value)throw new AssertionError(text);checks++; }
    private static Object read(String name) throws Exception { var f=ClientFieldState.class.getDeclaredField(name);f.setAccessible(true);return f.get(null); }
    private static final String B="00000000-0000-0000-0000-000000000010";
    private static String state(String field,int duration,String overlay) {
        var o=new JsonObject();o.addProperty("battle",B);o.addProperty("field",field);o.addProperty("name",field);o.addProperty("duration",duration);
        if(overlay!=null){o.addProperty("overlay",overlay);o.addProperty("overlayName",overlay);o.addProperty("overlayDuration",2);}
        return o.toString();
    }
    private static String evaluations(int turn,String field) {
        return "{\"battle\":\""+B+"\",\"turn\":"+turn+",\"field\":\""+field+"\",\"entries\":[{\"user\":\"00000000-0000-0000-0000-000000000001\",\"target\":\"00000000-0000-0000-0000-000000000002\",\"move\":\"psychic\",\"gimmick\":\"zmove\",\"totalMinDamage\":90,\"totalMaxDamage\":110,\"targetHp\":100,\"targetMaxHp\":200}]}";
    }
    public static int run() throws Exception {
        checks=0;ClientFieldState.reset();
        for(String field:List.of("rejuvenation:city","rejuvenation:back_alley","rejuvenation:flower_garden_1","rejuvenation:flower_garden_5","rejuvenation:indoor")) {
            ClientFieldState.acceptState(state(field,0,null));
            check(((ClientFieldState.State)read("state")).field().equals(field),"Replacement/progression/destruction");
            ClientFieldState.acceptEvaluations(evaluations(3,field));
            check(((Map<?,?>)read("evaluations")).size()==1,"Choice data");
            ClientFieldState.acceptEvaluations(evaluations(2,field));
            check((int)read("evaluationTurn")==3,"Old-turn data ignored");
            ClientFieldState.acceptState(state(field,2,"rejuvenation:electric_terrain"));
            check(((Map<?,?>)read("evaluations")).isEmpty(),"Overlay invalidates preview");
            check(((ClientFieldState.State)read("state")).overlayDuration()==2,"Overlay clock");
            ClientFieldState.acceptState(state(field,1,null));
            check(((ClientFieldState.State)read("state")).overlay()==null,"Overlay expiry/restoration");
        }
        ClientFieldState.acceptEvaluations(evaluations(3,"rejuvenation:city"));
        check(((Map<?,?>)read("evaluations")).isEmpty(),"Late replaced-field data ignored");
        var e=ClientFieldState.parseEvaluation(JsonParser.parseString(evaluations(3,"rejuvenation:indoor")).getAsJsonObject().getAsJsonArray("entries").get(0).getAsJsonObject());
        check("zmove".equals(e.gimmick()),"Selected gimmick survives payload parsing");
        var p=BattleExtrasFieldAdapter.exact(e);
        check(p.minPercent()==45 && p.maxPercent()==50 && p.koKey().endsWith("possible"),"Exact HP clipping and KO classification");
        ClientFieldState.acceptState("{\"battle\":\""+B+"\",\"field\":null}");
        check(read("state")==null && ((Map<?,?>)read("evaluations")).isEmpty(),"Battle end clears state");
        ClientFieldState.acceptEvaluations(evaluations(4,"rejuvenation:indoor"));
        ClientFieldState.acceptState(state("rejuvenation:city",0,null));
        check(read("state")==null && ((Map<?,?>)read("evaluations")).isEmpty(),"Late ended-battle packets ignored");
        ClientFieldState.reset();check(read("evaluationBattle")==null && (int)read("evaluationTurn")==0,"Disconnect reset");
        // On-demand previews: one request per missing key, server-sized chunks, merges only into the same decision.
        ClientFieldState.reset();
        ClientFieldState.acceptState(state("rejuvenation:city",0,null));
        ClientFieldState.acceptEvaluations(evaluations(5,"rejuvenation:city"));
        UUID battle=UUID.fromString(B),user=UUID.fromString("00000000-0000-0000-0000-000000000001"),foe=UUID.fromString("00000000-0000-0000-0000-000000000002");
        check(ClientFieldState.evaluationOrRequest(battle,user,"psychic",foe,"zmove",false).isPresent(),"Eager entry used without a request");
        check(ClientFieldState.drainRequest()==null,"Nothing requested for known data");
        check(ClientFieldState.evaluationOrRequest(battle,user,"Psychic",foe,"terastallize",false).isEmpty(),"Missing gimmick variant pending");
        ClientFieldState.evaluationOrRequest(battle,user,"psychic",foe,"terastallize",false);
        check(ClientFieldState.pending(user,"psychic",foe,"terastallize"),"Pending recorded");
        var bench=new ArrayList<UUID>();
        for(int i=0;i<30;i++){var b=UUID.fromString(String.format("00000000-0000-0000-0001-%012d",i));bench.add(b);ClientFieldState.evaluationOrRequest(battle,b,"surf",foe,null,true);}
        var first=JsonParser.parseString(ClientFieldState.drainRequest()).getAsJsonObject();
        check(first.get("battle").getAsString().equals(B) && first.get("turn").getAsInt()==5,"Request names the decision");
        check(first.getAsJsonArray("queries").size()==ClientFieldState.REQUEST_CHUNK,"Server-sized chunk");
        int tera=0,benchFlags=0;for(var q:first.getAsJsonArray("queries")){var o=q.getAsJsonObject();if(o.has("gimmick") && o.get("gimmick").getAsString().equals("terastallize"))tera++;if(o.has("bench"))benchFlags++;}
        check(tera==1 && benchFlags==23,"Duplicate suppressed and bench queries flagged");
        check(JsonParser.parseString(ClientFieldState.drainRequest()).getAsJsonObject().getAsJsonArray("queries").size()==7 && ClientFieldState.drainRequest()==null,"Remaining chunk, then empty");
        String answer="{\"battle\":\""+B+"\",\"turn\":5,\"merge\":true,\"field\":\"rejuvenation:city\",\"entries\":[{\"user\":\"00000000-0000-0000-0000-000000000001\",\"target\":\"00000000-0000-0000-0000-000000000002\",\"move\":\"psychic\",\"gimmick\":\"terastallize\",\"totalMinDamage\":120,\"totalMaxDamage\":141,\"targetHp\":200,\"targetMaxHp\":200},"
            +"{\"user\":\""+bench.getFirst()+"\",\"target\":\"00000000-0000-0000-0000-000000000002\",\"move\":\"surf\",\"bench\":true,\"totalMinDamage\":40,\"totalMaxDamage\":48,\"targetHp\":200,\"targetMaxHp\":200}]}";
        ClientFieldState.acceptEvaluations(answer);
        check(((Map<?,?>)read("evaluations")).size()==3 && !ClientFieldState.pending(user,"psychic",foe,"terastallize"),"Answer merged into the decision");
        check(ClientFieldState.evaluationOrRequest(battle,bench.getFirst(),"surf",foe,null,true).map(found->found.maxDamage().getAsInt()==48).orElse(false),"Bench measurement available");
        ClientFieldState.acceptEvaluations(answer.replace("\"turn\":5","\"turn\":4"));
        ClientFieldState.acceptEvaluations(answer.replace("\"turn\":5","\"turn\":6"));
        check(((Map<?,?>)read("evaluations")).size()==3 && (int)read("evaluationTurn")==5,"Merges for another decision ignored");
        ClientFieldState.acceptEvaluations(evaluations(6,"rejuvenation:city"));
        check(((Map<?,?>)read("evaluations")).size()==1 && ClientFieldState.drainRequest()==null && !ClientFieldState.pending(user,"psychic",foe,"terastallize"),"A new decision clears merged data and requests");
        ClientFieldState.acceptEvaluations(evaluations(6,"rejuvenation:city").replace("\"entries\":","\"decision\":12,\"entries\":"));
        ClientFieldState.acceptEvaluations(answer.replace("\"turn\":5","\"turn\":6").replace("\"merge\":true","\"merge\":true,\"decision\":11"));
        check(((Map<?,?>)read("evaluations")).size()==1,"Same-turn stale merge rejected");
        ClientFieldState.acceptEvaluations(evaluations(6,"rejuvenation:city").replace("\"entries\":","\"decision\":11,\"entries\":"));
        check((long)read("evaluationDecision")==12,"Same-turn stale eager payload rejected");
        ClientFieldState.evaluationOrRequest(battle,user,"surf",foe,"dynamax",false);
        check(JsonParser.parseString(ClientFieldState.drainRequest()).getAsJsonObject().get("decision").getAsLong()==12,"Outbox carries decision identity");
        ClientFieldState.acceptState(state("rejuvenation:city",0,null));
        ClientFieldState.acceptEvaluations(answer.replace("\"turn\":5","\"turn\":6").replace("\"merge\":true","\"merge\":true,\"decision\":12"));
        check(((Map<?,?>)read("evaluations")).isEmpty(),"Merge cannot reopen a decision invalidated by field resync");
        ClientFieldState.acceptState(state("rejuvenation:back_alley",0,null));
        check(ClientFieldState.evaluationOrRequest(battle,user,"psychic",foe,"terastallize",false).isEmpty() && ClientFieldState.drainRequest()==null,"No requests without the decision's evaluations");
        ClientFieldState.reset();
        // Effectiveness label: measured immunity or 2^typeMod; uncertain or disagreeing targets certify nothing.
        java.util.function.BiFunction<String,String,ClientFieldState.Evaluation> entry=(category,extra)->ClientFieldState.parseEvaluation(JsonParser.parseString(
            "{\"user\":\"00000000-0000-0000-0000-000000000001\",\"target\":\"00000000-0000-0000-0000-000000000002\",\"move\":\"earthquake\",\"category\":\""+category+"\""+extra+"}").getAsJsonObject());
        var neutral=entry.apply("Physical",",\"typeMod\":0,\"immune\":false");var doubled=entry.apply("Physical",",\"typeMod\":1,\"immune\":false");
        var immune=entry.apply("Physical",",\"typeMod\":1,\"immune\":true");var uncertain=entry.apply("Physical","");var status=entry.apply("Status",",\"immune\":false");
        check(BattleExtrasFieldAdapter.certifiedEffectiveness(List.of(neutral)).orElse(-1f)==1f,"Measured neutral effectiveness (e.g. Cave Ground vs Flying)");
        check(BattleExtrasFieldAdapter.certifiedEffectiveness(List.of(doubled,doubled)).orElse(-1f)==2f,"Agreeing doubles targets");
        check(BattleExtrasFieldAdapter.certifiedEffectiveness(List.of(immune)).orElse(-1f)==0f,"Measured immunity outranks the chart");
        check(BattleExtrasFieldAdapter.certifiedEffectiveness(List.of(neutral,doubled)).isEmpty(),"Disagreeing targets certify nothing");
        check(BattleExtrasFieldAdapter.certifiedEffectiveness(List.of(uncertain)).isEmpty() && BattleExtrasFieldAdapter.certifiedEffectiveness(List.of()).isEmpty(),"Random type or pending certifies nothing");
        for(var row:new Object[][]{{0f,"immune"},{0.25f,"mostly_ineffective"},{0.5f,"not_effective"},{1f,"normal_effective"},{2f,"super_effective"},{4f,"extremely_effective"}})
            check(BattleExtrasFieldAdapter.effectivenessKey((Float)row[0]).equals("move.battleinfo."+row[1]),"Battle Extras label threshold "+row[0]);
        var range=net.minecraft.class_2561.method_43470(" 40-48%");
        java.util.function.Function<String,List<net.minecraft.class_2561>> tooltip=key->List.of(net.minecraft.class_2561.method_43470("Earthquake"),
            net.minecraft.class_2561.method_43469("move.battleinfo."+key,"x").method_10852(range),net.minecraft.class_2561.method_43469("move.battleinfo.pp",20));
        java.util.function.Function<List<net.minecraft.class_2561>,List<String>> keys=lines->lines.stream().map(l->l.method_10851() instanceof net.minecraft.class_2588 t?t.method_11022():l.getString()).toList();
        check(keys.apply(BattleExtrasFieldAdapter.stripUncertifiedEffectiveness(tooltip.apply("normal_effective"),List.of(neutral))).contains("move.battleinfo.normal_effective"),"Certified label kept");
        var stale=BattleExtrasFieldAdapter.stripUncertifiedEffectiveness(tooltip.apply("immune"),List.of(neutral));
        check(!keys.apply(stale).contains("move.battleinfo.immune") && stale.size()==3 && stale.get(1).getString().equals(" 40-48%"),"Contradicting label removed, authoritative range kept");
        check(keys.apply(BattleExtrasFieldAdapter.stripUncertifiedEffectiveness(tooltip.apply("super_effective"),List.of(uncertain))).stream().noneMatch(k->k.contains("effective")),"Random-type label removed");
        check(BattleExtrasFieldAdapter.stripUncertifiedEffectiveness(tooltip.apply("super_effective"),List.of(status)).equals(tooltip.apply("super_effective")),"Status moves without immunity keep Battle Extras' line");
        check(Float.isNaN(BattleExtrasFieldAdapter.effectivenessLabel(2f)),"Type chart untouched outside a tooltip build");
        // Test scaled GUI dimensions, moved enhanced/classic logs, singles/doubles, and resize extremes.
        for(int w:List.of(64,120,320,640,1280,1920))for(int h:List.of(80,180,240,360,720,1080))for(int tiles:List.of(1,2,3))for(int y:List.of(30,h-131,h-85,h+100)) {
            var log=new LogBounds.Bounds(w-181,y,169,101);
            var l=FieldPanelRenderer.layout(log,w,h,tiles);
            check(l==null || l.x()>=0 && l.y()>=10+40*tiles && l.x()+l.width()<=w && l.y()+l.height()<=h,"Panel fits resized GUI");
            check(l==null || l.y()+l.height()<=log.y()-3,"Panel clears log");
        }
        return checks+NotesVerification.run();
    }
}
