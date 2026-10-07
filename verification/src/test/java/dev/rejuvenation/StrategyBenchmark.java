package dev.rejuvenation;
import com.cobblemon.mod.relocations.graalvm.polyglot.Context;
import java.nio.file.*;
import java.util.*;
/**
 * Decision-latency benchmark in Cobblemon's actual shaded, interpreter-only Graal runtime. The first strategy call
 * of a fresh context is reported separately (cold), followed by the median and maximum of repeated warm calls.
 * Optional second argument: an alternative engine file, used to compare a baseline under the same machine load
 * (the receipt is only written for the shipped engine).
 */
public final class StrategyBenchmark {
 public static void main(String[] args) throws Exception {
  Path root=Layout.profile(),repo=Layout.repo();
  Path shipped=repo.resolve("core/src/main/resources/rejuvenation-engine.js");
  Path engine=args.length>1 && !args[1].isBlank()?Path.of(args[1]).toAbsolutePath():shipped;
  int repetitions=args.length>2?Integer.parseInt(args[2]):5;
  try(var c=Context.newBuilder("js").allowExperimentalOptions(true).allowIO(true)
      .option("js.commonjs-require","true").option("js.commonjs-require-cwd",root.resolve("showdown").toString())
      .option("js.commonjs-core-modules-replacements","buffer:buffer/,crypto:crypto-browserify,path:path-browserify")
      .option("engine.WarnInterpreterOnly","false").build()){
   c.eval("js","globalThis.process={cwd:()=>''};");
   c.eval("js",Files.readString(root.resolve("showdown/index.js")));
   c.eval("js",Files.readString(engine));
   c.getBindings("js").getMember("RejuvenationEngine").getMember("load").execute(Files.readString(repo.resolve("research/catalog.json")));
   // Production warms the interpreter at catalog publication (SimulatorCatalog); engines without it are measured cold.
   var warmup=c.getBindings("js").getMember("RejuvenationEngine").getMember("warmup");
   long warmupMillis=warmup==null || warmup.isNull()?-1:com.google.gson.JsonParser.parseString(warmup.execute().asString()).getAsJsonObject().get("millis").getAsLong();
   String fixture=Files.readString(repo.resolve("verification/src/test/js/strategy-performance.js"));
   var runs=new ArrayList<com.google.gson.JsonArray>();
   for(int i=0;i<=repetitions;i++)runs.add(com.google.gson.JsonParser.parseString(c.eval("js",fixture).asString()).getAsJsonArray());
   var out=new com.google.gson.JsonObject();
   out.addProperty("runtime","Cobblemon 1.7.3 shaded Graal, interpreter only");
   out.addProperty("engine",engine.equals(shipped)?"shipped":engine.getFileName().toString());
   out.addProperty("engineSha256",java.util.HexFormat.of().formatHex(java.security.MessageDigest.getInstance("SHA-256").digest(Files.readAllBytes(engine))));
   out.addProperty("warmRepetitions",repetitions);
   out.addProperty("publicationWarmupMillis",warmupMillis);
   // build.ps1 -AffinityMask pins the build (and this forked JVM) to chosen cores and records the mask here.
   if(System.getenv("REJUVENATION_AFFINITY")!=null)out.addProperty("processorAffinity",System.getenv("REJUVENATION_AFFINITY"));
   out.addProperty("coldMeaning",warmupMillis<0?"first decision in a fresh context":"first decision after the publication warm-up, as in production");
   var rows=new com.google.gson.JsonArray();
   for(int k=0;k<runs.get(0).size();k++){
    var cold=runs.get(0).get(k).getAsJsonObject();
    long[] warm=new long[repetitions];
    for(int i=1;i<=repetitions;i++)warm[i-1]=runs.get(i).get(k).getAsJsonObject().get("millis").getAsLong();
    Arrays.sort(warm);
    var row=cold.deepCopy();row.addProperty("coldMillis",cold.get("millis").getAsLong());row.remove("millis");
    row.addProperty("warmMedianMillis",warm[warm.length/2]);row.addProperty("warmMaxMillis",warm[warm.length-1]);
    rows.add(row);
   }
   out.add("strategy",rows);
   String json=new com.google.gson.GsonBuilder().setPrettyPrinting().create().toJson(out);
   System.out.println(json);
   if(engine.equals(shipped))Files.writeString(repo.resolve("research/test-results/strategy-benchmark.json"),json);
  }
 }
}
