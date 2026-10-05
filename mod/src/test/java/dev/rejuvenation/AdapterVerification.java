package dev.rejuvenation;

import com.cobblemon.mod.relocations.graalvm.polyglot.Context;
import com.google.gson.*;
import dev.rejuvenation.client.BattleExtrasFieldAdapter;
import dev.rejuvenation.client.ClientFieldState;
import dev.rejuvenation.compat.RunBunFieldAdapter;
import java.util.*;

/**
 * Deterministic checks of the Run &amp; Bun AI and Battle Extras preview corrections, fed with real field-engine
 * evaluations from Cobblemon's shaded Graal runtime. Both consumers receive the same measurement, so the AI's
 * damage correction and the preview's effectiveness correction must agree.
 */
final class AdapterVerification {
    private AdapterVerification() {}
    private static int checks;
    private static void check(boolean b, String text) { if (!b) throw new AssertionError(text); checks++; }
    private static final String A = "00000000-0000-0000-0000-000000000001", B = "00000000-0000-0000-0000-000000000002";

    private static FieldEvaluator.Result evaluate(Context c, String field, String attacker, String defender, String move) { return evaluate(c, field, attacker, defender, move, false); }
    private static FieldEvaluator.Result evaluate(Context c, String field, String attacker, String defender, String move, boolean range) {
        String id = "adapter-" + field + "-" + move + "-" + UUID.randomUUID();
        c.eval("js", "(function(){const {Battle}=require('./sim/battle');const b=new Battle({formatid:'cobblemonsingles',seed:[1,2,3,4]});"
            + "RejuvenationEngine.attach(b,'rejuvenation:" + field + "',{battleId:'" + id + "'});"
            + "const set=(v,uuid)=>({species:'Mew',ability:'Synchronize',moves:['splash'],...v,uuid,movesInfo:(v.moves||['splash']).map(()=>({pp:20,maxPp:20}))});"
            + "b.setPlayer('p1',{name:'A',team:[set(" + attacker + ",'" + A + "')]});b.setPlayer('p2',{name:'B',team:[set(" + defender + ",'" + B + "')]});"
            + "b.choose('p1','team 1');b.choose('p2','team 1');})()");
        var query = new FieldEvaluator.Query(UUID.fromString(A), move, UUID.fromString(B), null, range);
        var request = new JsonArray(); var q = new JsonObject(); q.addProperty("user", A); q.addProperty("move", move); q.addProperty("target", B); q.addProperty("range", range); request.add(q);
        var text = c.getBindings("js").getMember("RejuvenationEngine").getMember("evaluate").execute(id, request.toString()).asString();
        c.eval("js", "RejuvenationEngine.battle('" + id + "').destroy()");
        var row = JsonParser.parseString(text).getAsJsonObject().getAsJsonArray("results").get(0).getAsJsonObject();
        return new FieldEvaluator.Result(query, new FieldEvaluator.Measurement(row.getAsJsonObject("withField")), new FieldEvaluator.Measurement(row.getAsJsonObject("native")));
    }
    /** What the client receives for the same result. */
    private static ClientFieldState.Evaluation client(FieldEvaluator.Result r) { return ClientFieldState.parseEvaluation(InspectorSync.entry(r)); }

    static int run(Context c) {
        checks = 0;
        // Forest boosts Grass moves: AI estimate and preview effectiveness scale by the same measured factor.
        var leaf = evaluate(c, "forest", "{moves:['leafblade']}", "{species:'Snorlax'}", "leafblade");
        double factor = leaf.damageFactor().orElseThrow();
        check(factor > 1.2, "Forest Leaf Blade factor " + factor);
        check(RunBunFieldAdapter.adjustDamage(100, leaf) == Math.round(100 * factor), "AI Forest Leaf Blade estimate");
        check(Math.abs(BattleExtrasFieldAdapter.adjustEffectiveness(1f, client(leaf)) - factor) < 1e-4, "Preview Forest Leaf Blade effectiveness");
        check(Math.abs(BattleExtrasFieldAdapter.adjustEffectiveness(2f, client(leaf)) - 2 * factor) < 1e-4, "Preview keeps the native super-effective multiplier");
        // Forest halves Surf.
        var surf = evaluate(c, "forest", "{moves:['surf']}", "{species:'Snorlax'}", "surf");
        check(RunBunFieldAdapter.adjustDamage(100, surf) < 60, "AI Forest Surf estimate " + RunBunFieldAdapter.adjustDamage(100, surf));
        // Underwater rejects Fire: AI sees no damage and an immunity; the preview shows no damage.
        var fire = evaluate(c, "underwater", "{moves:['flamethrower']}", "{}", "flamethrower");
        check(fire.fieldBlocks() && RunBunFieldAdapter.adjustDamage(80, fire) == 0 && RunBunFieldAdapter.adjustImmune(false, fire), "Underwater Fire rejected for the AI");
        check(BattleExtrasFieldAdapter.adjustEffectiveness(1f, client(fire)) == 0f, "Underwater Fire preview");
        // Cave lets Ground hit Flying: the AI's native 0 becomes the simulator's field damage; immunity is lifted.
        var quake = evaluate(c, "cave", "{moves:['earthquake']}", "{species:'Pidgeot'}", "earthquake");
        check(quake.nativeBlocks() && !quake.fieldBlocks(), "Cave Ground vs Flying precondition");
        check(RunBunFieldAdapter.adjustDamage(0, quake) > 0 && !RunBunFieldAdapter.adjustImmune(true, quake), "AI sees Earthquake hit Flying on Cave");
        check(BattleExtrasFieldAdapter.adjustEffectiveness(0f, client(quake)) > 0f, "Preview shows Earthquake hitting Flying on Cave");
        // Electric Terrain: sleep fails on a grounded target, Steadfast users are faster.
        var spore = evaluate(c, "electric_terrain", "{moves:['spore'],ability:'Steadfast'}", "{species:'Snorlax'}", "spore");
        check(RunBunFieldAdapter.adjustImmune(false, spore), "AI: Spore fails on Electric Terrain");
        check(!spore.nativeBlocks(), "Spore works without the field");
        check(Math.abs(RunBunFieldAdapter.adjustSpeed(100, spore.userSpeedFactor()) - 150) < 1, "AI speed with Electric Terrain Steadfast");
        // Deep Earth turns Topsy-Turvy into a physical attack.
        var topsy = evaluate(c, "deep_earth", "{moves:['topsyturvy']}", "{}", "topsyturvy");
        check(RunBunFieldAdapter.adjustDamage(0, topsy) > 0, "AI: Deep Earth Topsy-Turvy deals damage");
        check("Physical".equals(client(topsy).category()) && "Status".equals(client(topsy).nativeCategory()), "Preview category change");
        // Grassy Terrain priority and Bewitched accuracy reach the preview.
        check(client(evaluate(c, "grassy_terrain", "{moves:['grassyglide']}", "{}", "grassyglide")).priority().orElse(0) == 1, "Grassy Glide priority on the preview");
        check(client(evaluate(c, "bewitched", "{moves:['sleeppowder']}", "{species:'Snorlax'}", "sleeppowder")).accuracy().orElse(0) == 85, "Sleep Powder accuracy on the preview");
        // Battle Extras' effectiveness label and its range gate follow the measurement: Cave Ground hits Flying, Underwater
        // Fire is blocked, a random Rainbow type certifies nothing (label removed, no seeded immunity or ratio sent).
        check(BattleExtrasFieldAdapter.certifiedEffectiveness(List.of(client(quake))).orElse(0f) > 0f, "Cave Earthquake vs Flying is not shown as immune");
        check(BattleExtrasFieldAdapter.certifiedEffectiveness(List.of(client(fire))).orElse(-1f) == 0f, "Underwater Fire shown as no effect");
        var judgment = evaluate(c, "rainbow", "{moves:['judgment']}", "{species:'Blissey',ability:'Battle Armor'}", "judgment", true);
        var sent = InspectorSync.entry(judgment);
        check(!sent.has("factor") && !sent.get("fieldBlocks").getAsBoolean() && !sent.has("typeMod") && !sent.has("immune") && !sent.has("totalMinDamage") && !sent.has("totalMaxDamage"),
            "Random field type sends no seeded ratio, immunity, effectiveness or range: " + sent);
        check(BattleExtrasFieldAdapter.certifiedEffectiveness(List.of(client(judgment))).isEmpty() && client(judgment).minDamage().isEmpty() && client(judgment).maxDamage().isEmpty(), "Random field type displays no effectiveness or range");
        // No field effect: nothing changes for either consumer.
        var plain = evaluate(c, "indoor", "{moves:['psychic']}", "{}", "psychic");
        check(RunBunFieldAdapter.adjustDamage(77, plain) == 77 && Float.isNaN(BattleExtrasFieldAdapter.adjustEffectiveness(1f, client(plain))), "Indoor leaves both consumers unchanged");
        // Production score selection, using actual field-aware Graal candidates: each resource is preserved for
        // a guaranteed ordinary KO and used when it changes this turn into a KO. This tests timing, not a button.
        for(var row:new String[][]{
            {"mega","{species:'Charizard',ability:'Blaze',item:'Charizardite X',moves:['dragonclaw']}","dragonclaw"},
            {"ultra","{species:'Necrozma-Dusk-Mane',ability:'Prism Armor',item:'Ultranecrozium Z',moves:['photongeyser']}","photongeyser"},
            {"zmove","{species:'Mew',item:'Psychium Z',moves:['psychic']}","psychic"},
            {"dynamax","{species:'Pikachu',ability:'Static',moves:['thunderbolt']}","thunderbolt"},
            {"terastallize","{species:'Mew',teraType:'Fire',moves:['flamethrower']}","flamethrower"}}){
            String code="(function(){const {Battle}=require('./sim/battle');const out=[];for(const safe of [true,false]){"
                +"const b=new Battle({formatid:'gen9customgame',seed:[1,2,3,4]});RejuvenationEngine.attach(b,'rejuvenation:volcanic');"
                +"const set=(v,uuid)=>({ability:'Synchronize',...v,uuid,movesInfo:v.moves.map(()=>({pp:20,maxPp:20}))});"
                +"b.setPlayer('p1',{name:'A',team:[set("+row[1]+",'"+A+"')]});b.setPlayer('p2',{name:'B',team:[set({species:'"+(row[0].equals("ultra")?"Regirock":"Snorlax")+"',ability:'Thick Fat',moves:[safe?'splash':'bodyslam']},'"+B+"')]});"
                +"b.choose('p1','team 1');b.choose('p2','team 1');const t=b.sides[1].active[0];"
                +"const query={user:'"+A+"',target:'"+B+"',move:'"+row[2]+"',range:true};"
                +"const measured=JSON.parse(RejuvenationEngine.evaluate(b,[query])).results[0];t.hp=safe?1:measured.withField.totalMaxDamage+1;"
                +"out.push(JSON.parse(RejuvenationEngine.strategy(b,{user:'"+A+"',candidates:[query,{...query,gimmick:'"+row[0]+"'}]})).candidates);b.destroy();}return JSON.stringify(out);})()";
            var cases=JsonParser.parseString(c.eval("js",code).asString()).getAsJsonArray();
            for(int i=0;i<2;i++){
                var normal=cases.get(i).getAsJsonArray().get(0).getAsJsonObject();var variant=cases.get(i).getAsJsonArray().get(1).getAsJsonObject();
                check(!normal.has("error") && !variant.has("error"),"Gimmick strategy candidates "+row[0]);
                double n=dev.rejuvenation.compat.RunBunStrategy.candidateScore(normal.get("score").getAsDouble(),0,null,1,false);
                double g=dev.rejuvenation.compat.RunBunStrategy.candidateScore(variant.get("score").getAsDouble(),0,row[0],1,false);
                check(i==0?n>g:g>n,(i==0?"Preserve ":"Use ")+row[0]+" under Volcanic field: "+n+" vs "+g);
            }
        }
        return checks;
    }
}
