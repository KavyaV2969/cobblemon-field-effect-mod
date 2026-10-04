package dev.rejuvenation;
import com.cobblemon.mod.relocations.graalvm.polyglot.Context;
import java.nio.file.*;
/** Runs the shipped JavaScript with Cobblemon's actual shaded Graal runtime. */
public final class GraalVerification {
 public static void main(String[] args) throws Exception {
  Path root=Path.of(args[0]).toAbsolutePath();
  try(var c=Context.newBuilder("js").allowExperimentalOptions(true).allowIO(true)
      .option("js.commonjs-require","true").option("js.commonjs-require-cwd",root.resolve("showdown").toString())
      .option("js.commonjs-core-modules-replacements","buffer:buffer/,crypto:crypto-browserify,path:path-browserify")
      .option("engine.WarnInterpreterOnly","false").build()){
   c.eval("js","globalThis.process={cwd:()=>''};");
   c.eval("js",Files.readString(root.resolve("showdown/index.js")));
   c.eval("js",Files.readString(root.resolve("rejuvenation/mod/src/main/resources/rejuvenation-engine.js")));
   c.getBindings("js").getMember("RejuvenationEngine").getMember("load").execute(Files.readString(root.resolve("rejuvenation/research/catalog.json")));
   var result=c.eval("js","(function(){const Battle=require('./sim/battle').Battle;let count=0;for(const id of Object.keys(JSON.parse('"+Files.readString(root.resolve("rejuvenation/research/catalog.json")).replace("\\","\\\\").replace("'","\\'").replace("\r", "\\r").replace("\n","\\n")+"').fields)){const b=new Battle({formatid:'cobblemonsingles'});RejuvenationEngine.attach(b,id);if(b.rejuvenation.id!==id)throw Error(id);b.destroy();count++;}return count;})()");
   if(result.asInt()!=57)throw new AssertionError("Missing fields");
   int regressions=c.eval("js",Files.readString(root.resolve("rejuvenation/mod/src/test/js/graal-regression.js"))).asInt();
   if(regressions!=42)throw new AssertionError("Missing Graal regressions: "+regressions);
   // Cobblemon's Abilities.reload clears the simulator registry; the next catalog publication must restore declared abilities.
   String exists="require('./sim/dex').Dex.mod('cobblemon').abilities.get('defragment').exists===true && require('./sim/dex').Dex.mod('cobblemon').abilities.all().some(a=>a.id==='junglebeat')";
   if(!c.eval("js",exists).asBoolean())throw new AssertionError("Declared abilities missing from Cobblemon's registry data");
   c.eval("js","resetData('ability')");
   if(c.eval("js","require('./sim/dex').Dex.mod('cobblemon').abilities.get('defragment').exists===true").asBoolean())throw new AssertionError("Registry reset precondition");
   c.getBindings("js").getMember("RejuvenationEngine").getMember("load").execute(Files.readString(root.resolve("rejuvenation/research/catalog.json")));
   if(!c.eval("js",exists).asBoolean())throw new AssertionError("Declared abilities not restored after Cobblemon registry reset");
   System.out.println("PASS shaded Graal: boot index, engine binding, closed catalog, all 57 fields, cleanup, 42 battle-runtime assertions and declared-ability registry restoration");
  }
 }
}
