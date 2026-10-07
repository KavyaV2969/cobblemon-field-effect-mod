package dev.rejuvenation;
import com.cobblemon.mod.relocations.graalvm.polyglot.Context;
import java.nio.file.*;
/** Runs the shipped JavaScript with Cobblemon's actual shaded Graal runtime. */
public final class GraalVerification {
 public static void main(String[] args) throws Exception {
  Path root=Layout.profile(),repo=Layout.repo();
  try(var c=Context.newBuilder("js").allowExperimentalOptions(true).allowIO(true)
      .option("js.commonjs-require","true").option("js.commonjs-require-cwd",root.resolve("showdown").toString())
      .option("js.commonjs-core-modules-replacements","buffer:buffer/,crypto:crypto-browserify,path:path-browserify")
      .option("engine.WarnInterpreterOnly","false").build()){
   c.eval("js","globalThis.process={cwd:()=>''};");
   c.eval("js",Files.readString(root.resolve("showdown/index.js")));
   c.eval("js",Files.readString(repo.resolve("core/src/main/resources/rejuvenation-engine.js")));
   // Battle-start regression guard: publishing the catalog must not force-load the simulator's unrelated dex mods
   // (that took ~18 s in this interpreter-only runtime and blocked the first battle start).
   String dexCount="Object.values(require('./sim/dex').Dex.dexes).filter(d=>d.dataCache).length";
   int dexesBefore=c.eval("js",dexCount).asInt();
   String catalogJson=Files.readString(repo.resolve("research/catalog.json"));
   long started=System.nanoTime();
   c.getBindings("js").getMember("RejuvenationEngine").getMember("load").execute(catalogJson);
   long firstPublish=(System.nanoTime()-started)/1_000_000;
   int dexesAfter=c.eval("js",dexCount).asInt();
   if(dexesAfter>dexesBefore+3)throw new AssertionError("Catalog publication loaded "+(dexesAfter-dexesBefore)+" simulator dex mods");
   var result=c.eval("js","(function(){const Battle=require('./sim/battle').Battle;let count=0;for(const id of Object.keys(JSON.parse('"+Files.readString(repo.resolve("research/catalog.json")).replace("\\","\\\\").replace("'","\\'").replace("\r", "\\r").replace("\n","\\n")+"').fields)){const b=new Battle({formatid:'cobblemonsingles'});RejuvenationEngine.attach(b,id);if(b.rejuvenation.id!==id)throw Error(id);b.destroy();count++;}return count;})()");
   if(result.asInt()!=61)throw new AssertionError("Missing fields");
   int regressions=c.eval("js",Files.readString(repo.resolve("verification/src/test/js/graal-regression.js"))).asInt();
   if(regressions!=110)throw new AssertionError("Missing Graal regressions: "+regressions);
   // Cobblemon's Abilities.reload clears the simulator registry; the next catalog publication must restore declared abilities.
   String exists="require('./sim/dex').Dex.mod('cobblemon').abilities.get('defragment').exists===true && require('./sim/dex').Dex.mod('cobblemon').abilities.all().some(a=>a.id==='junglebeat')";
   if(!c.eval("js",exists).asBoolean())throw new AssertionError("Declared abilities missing from Cobblemon's registry data");
   c.eval("js","resetData('ability')");
   if(c.eval("js","require('./sim/dex').Dex.mod('cobblemon').abilities.get('defragment').exists===true").asBoolean())throw new AssertionError("Registry reset precondition");
   c.getBindings("js").getMember("RejuvenationEngine").getMember("load").execute(Files.readString(repo.resolve("research/catalog.json")));
   if(!c.eval("js",exists).asBoolean())throw new AssertionError("Declared abilities not restored after Cobblemon registry reset");
   // Warm republication (datapack reload) and read-only move evaluation in the shaded runtime.
   started=System.nanoTime();c.getBindings("js").getMember("RejuvenationEngine").getMember("load").execute(catalogJson);long warmPublish=(System.nanoTime()-started)/1_000_000;
   // Publication warm-up (SimulatorCatalog): a throwaway, unregistered decision and preview.
   long warmupMillis=com.google.gson.JsonParser.parseString(c.getBindings("js").getMember("RejuvenationEngine").getMember("warmup").execute().asString()).getAsJsonObject().get("millis").getAsLong();
   if(warmupMillis<0)throw new AssertionError("Warm-up did not run");
   c.eval("js","globalThis.__evalBattle=function(id){const {Battle}=require('./sim/battle');const b=new Battle({formatid:'cobblemonsingles',seed:[1,2,3,4]});RejuvenationEngine.attach(b,'rejuvenation:forest',{battleId:id});let n=0;"
    +"const set=v=>({species:'Mew',ability:'Synchronize',...v,uuid:'00000000-0000-0000-0000-0000000000'+String(++n).padStart(2,'0'),movesInfo:v.moves.map(()=>({pp:20,maxPp:20}))});"
    +"b.setPlayer('p1',{name:'A',team:[set({moves:['leafblade','surf','bugbuzz','recover'],item:'Wacan Berry'})]});b.setPlayer('p2',{name:'B',team:[set({species:'Snorlax',moves:['bodyslam','earthquake','rest','curse']})]});"
    +"b.choose('p1','team 1');b.choose('p2','team 1');return b;}");
   c.eval("js","globalThis.__x=__evalBattle('graal-x');globalThis.__y=__evalBattle('graal-y');");
   String queries="JSON.stringify(['leafblade','surf','bugbuzz','recover'].map(move=>({user:'00000000-0000-0000-0000-000000000001',move,target:'00000000-0000-0000-0000-000000000002'})))";
   started=System.nanoTime();
   String evaluated=c.eval("js","RejuvenationEngine.evaluate('graal-x',"+queries+")").asString();
   long evaluateMillis=(System.nanoTime()-started)/1_000_000;
   c.getBindings("js").putMember("__evaluated",evaluated);
   if(!c.eval("js","(function(){const r=JSON.parse(__evaluated);const s=r.results.find(x=>x.query.move==='surf'),l=r.results.find(x=>x.query.move==='leafblade');"
     +"return r.field==='rejuvenation:forest' && s.withField.maxDamage<s.native.maxDamage && l.withField.maxDamage>l.native.maxDamage;})()").asBoolean())throw new AssertionError("Forest evaluation in shaded Graal: "+evaluated);
   if(!c.eval("js","(function(){__x.makeChoices('move 1','move 1');__y.makeChoices('move 1','move 1');const log=b=>b.log.filter(l=>!l.startsWith('|t:|')).join('|');return log(__x)===log(__y) && __x.sides[0].active[0].item===__y.sides[0].active[0].item;})()").asBoolean())
    throw new AssertionError("Move evaluation changed the battle in shaded Graal");
   c.eval("js","__x.destroy();__y.destroy();");
   if(!c.eval("js","RejuvenationEngine.battle('graal-x')===null").asBoolean())throw new AssertionError("Destroyed battles leave the evaluation registry");
   int adapterChecks=AdapterVerification.run(c);
   var strategyPerformance=com.google.gson.JsonParser.parseString(c.eval("js",Files.readString(repo.resolve("verification/src/test/js/strategy-performance.js"))).asString());
   System.out.println("PASS shaded Graal strategy benchmarks: "+strategyPerformance);
   System.out.println("PASS shaded Graal integrations: "+adapterChecks+" Run & Bun / Battle Extras adapter checks on real field evaluations");
   var perf=new com.google.gson.JsonObject();
   perf.addProperty("runtime","Cobblemon 1.7.3 shaded Graal, interpreter only");
   perf.addProperty("engineSha256",java.util.HexFormat.of().formatHex(java.security.MessageDigest.getInstance("SHA-256").digest(Files.readAllBytes(repo.resolve("core/src/main/resources/rejuvenation-engine.js")))));
   perf.addProperty("fieldsAttached",61);perf.addProperty("runtimeAssertions",regressions);perf.addProperty("adapterChecks",adapterChecks);
   perf.addProperty("firstCatalogPublishMillis",firstPublish);perf.addProperty("warmCatalogPublishMillis",warmPublish);
   perf.addProperty("publicationWarmupMillis",warmupMillis);
   perf.addProperty("simulatorDexesLoadedBeforePublish",dexesBefore);perf.addProperty("simulatorDexesLoadedAfterPublish",dexesAfter);
   perf.addProperty("evaluate4QueriesMillis",evaluateMillis);
   perf.add("strategy",strategyPerformance);
   perf.addProperty("note","Catalog publication happens at server start and datapack reload, not at battle start (SimulatorCatalog).");
   Files.createDirectories(repo.resolve("research/test-results"));
   Files.writeString(repo.resolve("research/test-results/graal-performance.json"),new com.google.gson.GsonBuilder().setPrettyPrinting().create().toJson(perf));
   System.out.println("PASS shaded Graal performance: first publish "+firstPublish+" ms, warm publish "+warmPublish+" ms, dex mods loaded "+dexesBefore+" -> "+dexesAfter+", 4-query evaluation "+evaluateMillis+" ms, twin battles identical");
   System.out.println("PASS shaded Graal: boot index, engine binding, closed catalog, all 61 fields (57 original, 4 custom), cleanup, "+regressions+" battle-runtime assertions and declared-ability registry restoration");
  }
 }
}
