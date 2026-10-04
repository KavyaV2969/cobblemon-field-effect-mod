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
   if(regressions!=31)throw new AssertionError("Missing Graal regressions: "+regressions);
   System.out.println("PASS shaded Graal: boot index, engine binding, closed catalog, all 57 fields, cleanup and 31 battle-runtime assertions");
  }
 }
}
