package dev.rejuvenation;
import com.google.gson.*;
import java.io.*;
import java.nio.file.*;
import java.util.*;
public final class JavaVerification {
 private static void check(boolean b,String text){if(!b)throw new AssertionError(text);}
 private static void rejected(Runnable r){try{r.run();}catch(IllegalArgumentException e){return;}throw new AssertionError("Malformed catalog accepted");}
 public static void main(String[] args)throws Exception {
  check(RejuvenationFields.engine!=null && RejuvenationFields.engine.contains("global.RejuvenationEngine"),"Engine must load before the Fabric initializer");
  var path=Path.of(args[0]);var catalog=CatalogValidator.read(Files.newInputStream(path));CatalogValidator.validate(catalog);
  final var bad=catalog.deepCopy();bad.getAsJsonObject("fields").getAsJsonObject("rejuvenation:forest").getAsJsonArray("rules").get(0).getAsJsonObject().addProperty("event","typo");rejected(()->CatalogValidator.validate(bad));
  final var invalid=catalog.deepCopy();invalid.getAsJsonObject("fields").getAsJsonObject("rejuvenation:forest").getAsJsonObject("moves").getAsJsonObject("surf").addProperty("multiplier",-1);rejected(()->CatalogValidator.validate(invalid));
  rejected(()->{try{CatalogValidator.read(new ByteArrayInputStream("{\"id\":1,\"id\":2}".getBytes()));}catch(IOException e){throw new IllegalArgumentException(e);}});
  var selections=new EnumMap<FieldApi.Priority,String>(FieldApi.Priority.class);selections.put(FieldApi.Priority.ARENA,"arena");selections.put(FieldApi.Priority.TRAINER,"trainer");selections.put(FieldApi.Priority.EXPLICIT,"explicit");
  check(FieldApi.choose(selections,"biome",true).field().equals("explicit"),"Explicit priority");selections.remove(FieldApi.Priority.EXPLICIT);
  check(FieldApi.choose(selections,"biome",true).field().equals("trainer"),"Trainer priority");selections.remove(FieldApi.Priority.TRAINER);
  check(FieldApi.choose(selections,"biome",true).field().equals("arena"),"Arena priority");
  check(!FieldApi.choose(null,"biome",false).enabled(),"Trainer battles must remain unmodified by default");
  check(FieldApi.choose(null,"biome",true).field().equals("biome"),"Wild resolution");
  var ended=UUID.randomUUID();FieldApi.clear(ended);FieldApi.update(ended,"{\"field\":\"rejuvenation:forest\"}");check(FieldApi.current(ended).isEmpty(),"Late simulator dispatch must not recreate closed state");
  rejected(()->new FieldApi.RuleOptions(99,false));var configured=UUID.randomUUID();FieldApi.configure(configured,new FieldApi.RuleOptions(1,true));check(FieldApi.consumeOptions(configured).orElseThrow().difficultyMode()==1,"Per-battle options");check(FieldApi.consumeOptions(configured).isEmpty(),"Options consumed once");FieldApi.configure(configured,new FieldApi.RuleOptions(2,true));FieldApi.clear(configured);check(FieldApi.consumeOptions(configured).isEmpty(),"Options cleanup");
  var heldId=UUID.randomUUID();var packed="mew||"+heldId+"|341||-1||synchronize|psychic|20/20|Hardy|||||100|custom-payload]other|mew|"+UUID.randomUUID()+"|341||-1|leftovers|";
  check(HeldItemBridge.rewrite(packed,Map.of(heldId,"everstone")).equals(packed.replace("|-1||synchronize","|-1|everstone|synchronize")),"Packed team bridge preserves unrelated data and trailing slots");
  var captureBattle=UUID.randomUUID();var otherBattle=UUID.randomUUID();var snapshot=catalog.deepCopy();FieldApi.begin(captureBattle,"rejuvenation:water_surface",snapshot);FieldApi.begin(otherBattle,"rejuvenation:forest",snapshot);
  check(FieldApi.captureMultiplier(captureBattle,"cobblemon:dive_ball").orElseThrow()==3.5,"Dive Ball field modifier");check(FieldApi.captureMultiplier(otherBattle,"cobblemon:dive_ball").isEmpty(),"Independent capture contexts");
  snapshot.getAsJsonObject("fields").getAsJsonObject("rejuvenation:water_surface").getAsJsonObject("captureModifiers").addProperty("cobblemon:dive_ball",9);check(FieldApi.captureMultiplier(captureBattle,"cobblemon:dive_ball").orElseThrow()==3.5,"Capture rules keep battle snapshot");
  FieldApi.update(captureBattle,"{\"field\":\"rejuvenation:dark_crystal_cavern\"}");check(FieldApi.captureMultiplier(captureBattle,"cobblemon:dusk_ball",12).orElseThrow()==3.5,"Capture follows transitions");check(FieldApi.captureMultiplier(captureBattle,"cobblemon:dive_ball").isEmpty(),"Old field bonus removed");
  for(float nativeMultiplier:new float[]{1,3,3.5f})check(Math.abs(CaptureBridge.adjustedRate(47,3.5,nativeMultiplier)*nativeMultiplier-164)<.0001,"Capture bonus replaces native bonus with source rounding");
  for(int hour:new int[]{0,3,20,23})check(FieldApi.captureMultiplier(otherBattle,"cobblemon:dusk_ball",hour).orElseThrow()==3.5,"Real-time night independent of field");
  for(int hour:new int[]{4,12,19})check(FieldApi.captureMultiplier(otherBattle,"cobblemon:dusk_ball",hour).isEmpty(),"Real-time day boundaries");
  FieldApi.captureEnvironment(otherBattle,true);check(FieldApi.captureMultiplier(otherBattle,"cobblemon:dive_ball",12).orElseThrow()==3.5,"Underwater environment independent of field");
  FieldApi.captureEnvironment(captureBattle,true);check(FieldApi.captureMultiplier(captureBattle,"cobblemon:dusk_ball",23).orElseThrow()==3.5,"Field and night bonuses are OR, not stacked");
  FieldApi.clear(captureBattle);check(FieldApi.captureMultiplier(captureBattle,"cobblemon:dusk_ball",12).isEmpty(),"Capture cleanup");FieldApi.clearAll();check(FieldApi.current(otherBattle).isEmpty(),"Global cleanup");
  System.out.println("PASS Java: strict parser, all definitions, bad rules/values, duplicate keys, resolution priority, trainer opt-in boundary and capture snapshot/rounding/cleanup");
 }
}
