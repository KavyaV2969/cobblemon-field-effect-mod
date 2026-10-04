package dev.rejuvenation;
import com.google.gson.*;
import net.fabricmc.loader.api.FabricLoader;
import net.minecraft.server.MinecraftServer;
import net.minecraft.class_7924;
import java.nio.file.*;
/** Registry discovery without mutating biomes, worlds, packs or trainer data. */
public final class RuntimeInventory {
 private RuntimeInventory() {}
 public static void write(MinecraftServer server) {
  try {
   var registry=server.method_30611().method_30530(class_7924.field_41236);
   var report=new JsonObject();var rows=new JsonArray();var explicit=new java.util.HashMap<String,String>();
   var catalog=RejuvenationFields.catalog.data();
   if(catalog.has("mappings"))for(var value:catalog.getAsJsonArray("mappings")){var r=value.getAsJsonObject();if(r.has("biome"))explicit.put(r.get("biome").getAsString(),r.get("field").getAsString());}
   for(var e:registry.method_29722()){
    var row=new JsonObject();String id=e.getKey().method_29177().toString();row.addProperty("biome",id);
    row.addProperty("explicit",explicit.containsKey(id));if(explicit.containsKey(id))row.addProperty("field",explicit.get(id));rows.add(row);
   }
   report.add("biomes",rows);report.addProperty("revision",RejuvenationFields.catalog.revision());
   Path path=FabricLoader.getInstance().getGameDir().resolve("rejuvenation/research/runtime-biomes.json");Files.createDirectories(path.getParent());
   Files.writeString(path,new GsonBuilder().setPrettyPrinting().create().toJson(report));
   long unknown=rows.asList().stream().filter(v->!v.getAsJsonObject().get("explicit").getAsBoolean()).count();
   RejuvenationFields.LOG.info("Discovered {} live biome entries; {} use tag/environment/default rules. Audit: {}",rows.size(),unknown,path);
  } catch(Exception e){RejuvenationFields.LOG.error("Could not write live biome audit",e);}
 }
}
