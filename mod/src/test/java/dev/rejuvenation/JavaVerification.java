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
  check(catalog.getAsJsonObject("abilities").has("defragment") && catalog.getAsJsonObject("abilities").has("junglebeat"),"Declared abilities are part of the validated catalog");
  for(java.util.function.Consumer<JsonObject> change:List.<java.util.function.Consumer<JsonObject>>of(
    a->a.getAsJsonObject("defragment").addProperty("num",0),a->a.getAsJsonObject("defragment").addProperty("script","x"),a->a.getAsJsonObject("defragment").getAsJsonObject("flags").addProperty("breakable",2),
    a->a.getAsJsonObject("defragment").getAsJsonObject("callbacks").add("onFoeTryMove",a.getAsJsonObject("defragment").getAsJsonObject("callbacks").get("onStart")),
    a->a.getAsJsonObject("junglebeat").addProperty("inherit","junglebeat"),a->a.getAsJsonObject("junglebeat").add("soundMoveTypes",new JsonArray()),a->a.add("Bad-ID",a.get("defragment")),
    a->a.getAsJsonObject("defragment").getAsJsonObject("callbacks").getAsJsonObject("onStart").getAsJsonArray("actions").get(0).getAsJsonObject().addProperty("op","eval"))){
   final var malformed=catalog.deepCopy();change.accept(malformed.getAsJsonObject("abilities"));rejected(()->CatalogValidator.validate(malformed));}
  for(java.util.function.Consumer<JsonObject> change:List.<java.util.function.Consumer<JsonObject>>of(
    c->c.getAsJsonObject("abilities").getAsJsonObject("eelevate").addProperty("airborne","yes"),
    c->c.getAsJsonObject("abilities").getAsJsonObject("gravitycontrol").addProperty("airborneBeforeGravity",1),
    c->c.getAsJsonObject("abilities").getAsJsonObject("tempest").getAsJsonObject("callbacks").getAsJsonObject("onStart").getAsJsonArray("actions").get(0).getAsJsonObject().addProperty("duration",0),
    c->c.getAsJsonObject("fields").getAsJsonObject("rejuvenation:indoor").getAsJsonObject("weatherDefinitions").getAsJsonObject("shadowsky").addProperty("damageFraction",2),
    c->c.getAsJsonObject("fields").getAsJsonObject("rejuvenation:indoor").getAsJsonObject("typeDefinitions").getAsJsonObject("Shadow").addProperty("hue",361))){
   final var malformed=catalog.deepCopy();change.accept(malformed);rejected(()->CatalogValidator.validate(malformed));}
  // Operators added for the Battle_MoveEffects audit reject malformed parameters.
  for(String text:List.of(
    "{\"event\":\"modifyMove\",\"condition\":{\"always\":true},\"actions\":[{\"op\":\"moveBehavior\",\"recipe\":\"fixedDamage\",\"basis\":\"constant\",\"factor\":1}],\"source\":\"test\"}",
    "{\"event\":\"modifyMove\",\"condition\":{\"always\":true},\"actions\":[{\"op\":\"moveBehavior\",\"recipe\":\"fixedDamage\",\"basis\":\"level\",\"factor\":1,\"amount\":140}],\"source\":\"test\"}",
    "{\"event\":\"modifyMove\",\"condition\":{\"always\":true},\"actions\":[{\"op\":\"moveProperty\",\"path\":\"maxHPRecoil\",\"value\":2}],\"source\":\"test\"}",
    "{\"event\":\"modifyMove\",\"condition\":{\"always\":true},\"actions\":[{\"op\":\"moveProperty\",\"path\":\"magnitude\",\"value\":11}],\"source\":\"test\"}",
    "{\"event\":\"modifyMove\",\"condition\":{\"always\":true},\"actions\":[{\"op\":\"moveProperty\",\"path\":\"drain\",\"value\":[3,2]}],\"source\":\"test\"}",
    "{\"event\":\"modifyMove\",\"condition\":{\"always\":true},\"actions\":[{\"op\":\"moveBehavior\",\"recipe\":\"payHP\",\"fraction\":0.25,\"requireHit\":true}],\"source\":\"test\"}",
    "{\"event\":\"afterMove\",\"condition\":{\"drainHealed\":\"yes\"},\"actions\":[],\"source\":\"test\"}")){
   final var malformed=catalog.deepCopy();malformed.getAsJsonObject("fields").getAsJsonObject("rejuvenation:forest").getAsJsonArray("rules").add(com.google.gson.JsonParser.parseString(text));rejected(()->CatalogValidator.validate(malformed));}
  // Operators and field policies added for the Battle.rb audit reject malformed parameters.
  for(String text:List.of(
    "{\"event\":\"residual\",\"condition\":{\"always\":true},\"actions\":[{\"op\":\"setWeather\",\"id\":\"deltastream\",\"duration\":0}],\"source\":\"test\"}",
    "{\"event\":\"residual\",\"condition\":{\"always\":true},\"actions\":[{\"op\":\"hazardBurst\",\"id\":\"spikes\",\"messages\":[\"x\"]}],\"source\":\"test\"}",
    "{\"event\":\"residual\",\"condition\":{\"always\":true},\"actions\":[{\"op\":\"hazardBurst\",\"id\":\"wish\",\"messages\":[\"x\"],\"fraction\":0.25}],\"source\":\"test\"}",
    "{\"event\":\"residual\",\"condition\":{\"always\":true},\"actions\":[{\"op\":\"setHPFraction\",\"fraction\":2}],\"source\":\"test\"}",
    "{\"event\":\"residual\",\"condition\":{\"always\":true},\"actions\":[{\"op\":\"volatileDuration\",\"id\":\"slowstart\",\"amount\":0,\"minimum\":1}],\"source\":\"test\"}",
    "{\"event\":\"residual\",\"condition\":{\"always\":true},\"actions\":[{\"op\":\"clearHazards\"}],\"source\":\"test\"}",
    "{\"event\":\"residual\",\"condition\":{\"always\":true},\"actions\":[{\"op\":\"trap\",\"force\":\"yes\"}],\"source\":\"test\"}",
    "{\"event\":\"residual\",\"condition\":{\"startedCondition\":[\"wish\"]},\"actions\":[],\"source\":\"test\"}",
    "{\"event\":\"residual\",\"condition\":{\"damageSource\":[]},\"actions\":[],\"source\":\"test\"}",
    "{\"event\":\"modifyMove\",\"condition\":{\"always\":true},\"actions\":[{\"op\":\"moveProperty\",\"path\":\"secondaries.0.self\",\"value\":{\"boosts\":{\"atk\":6}}}],\"source\":\"test\"}")){
   final var malformed=catalog.deepCopy();malformed.getAsJsonObject("fields").getAsJsonObject("rejuvenation:forest").getAsJsonArray("rules").add(com.google.gson.JsonParser.parseString(text));rejected(()->CatalogValidator.validate(malformed));}
  for(java.util.function.Consumer<JsonObject> change:List.<java.util.function.Consumer<JsonObject>>of(
    c->c.getAsJsonObject("fields").getAsJsonObject("rejuvenation:forest").add("hazardPolicy",com.google.gson.JsonParser.parseString("{\"source\":\"t\",\"stickyweb\":{\"stages\":1}}")),
    c->c.getAsJsonObject("fields").getAsJsonObject("rejuvenation:forest").add("weatherRainbow",com.google.gson.JsonParser.parseString("{\"field\":\"rejuvenation:rainbow\"}")),
    c->c.getAsJsonObject("fields").getAsJsonObject("rejuvenation:forest").add("timedWeatherText",com.google.gson.JsonParser.parseString("{\"fog\":{\"startMessage\":\"a\",\"endMessage\":\"b\",\"source\":\"t\"}}")),
    c->c.getAsJsonObject("fields").getAsJsonObject("rejuvenation:forest").add("entryWishes",com.google.gson.JsonParser.parseString("{\"wish\":{\"boosts\":{\"atk\":1},\"message\":\"m\",\"source\":\"t\"}}")),
    c->c.getAsJsonObject("fields").getAsJsonObject("rejuvenation:forest").add("effectivenessOverrides",com.google.gson.JsonParser.parseString("[{\"condition\":{\"always\":true},\"value\":9,\"source\":\"t\"}]")),
    c->c.getAsJsonObject("fields").getAsJsonObject("rejuvenation:forest").add("revivalBlessing",com.google.gson.JsonParser.parseString("{\"fraction\":2,\"source\":\"t\"}")),
    c->c.getAsJsonObject("fields").getAsJsonObject("rejuvenation:forest").add("volatileMoveLocks",com.google.gson.JsonParser.parseString("{\"rage\":{\"move\":\"Rage!\",\"source\":\"t\"}}")),
    c->c.getAsJsonObject("fields").getAsJsonObject("rejuvenation:forest").add("silentVolatileEnds",com.google.gson.JsonParser.parseString("[\"rage\"]")),
    c->c.getAsJsonObject("fields").getAsJsonObject("rejuvenation:forest").add("priorityBlockingAbilities",com.google.gson.JsonParser.parseString("[\"Mirror Armor\"]")),
    // League trainer field maps: Indoor, unknown fields, bad IDs, scores and extra keys are rejected.
    c->c.add("trainers",com.google.gson.JsonParser.parseString("{\"kanto_brock\":{\"field\":\"rejuvenation:indoor\"}}")),
    c->c.add("trainers",com.google.gson.JsonParser.parseString("{\"kanto_brock\":{\"field\":\"rejuvenation:nowhere\"}}")),
    c->c.add("trainers",com.google.gson.JsonParser.parseString("{\"Kanto Brock\":{\"field\":\"rejuvenation:cave\"}}")),
    c->c.add("trainers",com.google.gson.JsonParser.parseString("{\"kanto_brock\":{\"field\":\"rejuvenation:cave\",\"winShare\":2}}")),
    c->c.add("trainers",com.google.gson.JsonParser.parseString("{\"kanto_brock\":{\"field\":\"rejuvenation:cave\",\"team\":[]}}")))){
   final var malformed=catalog.deepCopy();change.accept(malformed);rejected(()->CatalogValidator.validate(malformed));}
  // RCT original-trainer tags are "<registry>#<trainer id>"; anything else selects nothing.
  check("kanto_brock".equals(TrainerFieldBridge.trainerId("rctmod#kanto_brock")),"RCT trainer tag parse");
  check("kanto_brock".equals(TrainerFieldBridge.trainerId("#kanto_brock")),"Empty-registry RCT tag parse");
  check(TrainerFieldBridge.trainerId("00000000-0000-0000-0000-000000000001")==null && TrainerFieldBridge.trainerId("rctmod#")==null && TrainerFieldBridge.trainerId(null)==null,"Non-RCT tags select no trainer");
  check(catalog.getAsJsonObject("trainers").size()==13,"Thirteen Kanto league trainer fields shipped");
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
  int environment=EnvironmentVerification.run(catalog);
  int client=dev.rejuvenation.client.ClientVerification.run();
  // On-demand gimmick previews are honoured only as the sanitized request offers them.
  var moveset=new com.cobblemon.mod.common.battles.ShowdownMoveset();
  var psychic=new com.cobblemon.mod.common.battles.InBattleMove();psychic.setId("psychic");psychic.setMove("Psychic");
  var surf=new com.cobblemon.mod.common.battles.InBattleMove();surf.setId("surf");surf.setMove("Surf");
  moveset.setMoves(java.util.List.of(psychic,surf));moveset.setCanTerastallize("Psychic");
  var z=new com.cobblemon.mod.common.battles.InBattleGimmickMove();z.setMove("shatteredpsyche");
  var disabled=new com.cobblemon.mod.common.battles.InBattleGimmickMove();disabled.setMove("hydrovortex");disabled.setDisabled(true);
  moveset.setCanZMove(java.util.Arrays.asList(z,disabled));
  var request=new com.cobblemon.mod.common.battles.ShowdownActionRequest();request.setActive(java.util.List.of(moveset));
  int legality=0;
  for(var row:new Object[][]{{"psychic","terastallize",true},{"psychic","zmove",true},{"surf","zmove",false},{"psychic","mega",false},{"psychic","ultra",false},
      {"psychic","dynamax",false},{"thunderbolt","terastallize",false},{"psychic","bogus",false}}){
   if(InspectorSync.legal(request,0,(String)row[0],(String)row[1])!=(boolean)row[2])throw new AssertionError("Gimmick legality "+java.util.Arrays.toString(row));legality++;
  }
  if(InspectorSync.legal(request,1,"psychic","terastallize"))throw new AssertionError("Gimmick legality beyond the request's actives");legality++;
  moveset.setCanMegaEvo(true);moveset.setCanDynamax(true);moveset.setMaxMoves(java.util.Arrays.asList(null,z));
  if(!InspectorSync.legal(request,0,"psychic","mega") || InspectorSync.legal(request,0,"psychic","dynamax") || !InspectorSync.legal(request,0,"surf","dynamax"))throw new AssertionError("Mega/Dynamax legality");legality+=3;
  System.out.println("PASS on-demand preview gimmick legality follows the sanitized request: "+legality+" checks");
  for(String json:List.of("{}","{\"turn\":5}","{\"turn\":4,\"decision\":12}","{\"turn\":5,\"decision\":11}","{\"turn\":5,\"decision\":null}"))
   check(!InspectorSync.matchesDecision(JsonParser.parseString(json).getAsJsonObject(),5,12),"Stale/malformed preview decision rejected");
  check(InspectorSync.matchesDecision(JsonParser.parseString("{\"turn\":5,\"decision\":12}").getAsJsonObject(),5,12),"Exact preview decision accepted");
  System.out.println("PASS preview decision identity: 6 checks (same-turn replacement, old turn, missing/malformed token)");
  for(boolean runBun:new boolean[]{false,true})for(boolean extras:new boolean[]{false,true}){
   var installed=java.util.Set.copyOf(java.util.stream.Stream.of(runBun?"rbrctai":"",extras?"cobblemon-battle-extras":"").filter(s->!s.isEmpty()).toList());
   check(dev.rejuvenation.compat.CompatMixinPlugin.enabled("dev.rejuvenation.compat.mixin.RunBunDecisionMixin",installed::contains)==runBun,"RunBun optional presence gate");
   check(dev.rejuvenation.compat.CompatMixinPlugin.enabled("dev.rejuvenation.compat.mixin.BattleExtrasPreviewMixin",installed::contains)==extras,"BattleExtras optional presence gate");
   check(dev.rejuvenation.compat.CompatMixinPlugin.enabled("dev.rejuvenation.mixin.ShowdownMixin",installed::contains),"Core panel/field remains enabled independently of optional mods");
  }
  System.out.println("PASS optional integrations: 12 checks across both mod presence combinations");
  int packets=PacketVerification.run();System.out.println("PASS actual field/preview/request packet codecs: "+packets+" checks");
  var abi=MixinAbiVerification.run();
  Files.writeString(path.getParent().resolve("test-results/mixin-abi.json"),new GsonBuilder().setPrettyPrinting().create().toJson(abi));
  System.out.println("PASS mixin ABI against the installed Cobblemon, Run & Bun and Battle Extras bytecode: "+abi.checked()+" injector/shadow checks"
    +(abi.optionalAbsent().isEmpty()?"":"; optional targets absent: "+abi.optionalAbsent())+"; certified merged targets: "+abi.mergedTargets());
  System.out.println("PASS Java: strict parser, all definitions, bad rules/values, duplicate keys, resolution priority, trainer opt-in boundary and capture snapshot/rounding/cleanup");
  System.out.println("PASS Java environment precedence: "+environment+" checks (trainer > underwater > structure > biome > fallback; indexed biome rules equal ordered rules)");
  System.out.println("PASS isolated client state, exact preview presentation and panel layout: "+client+" checks");
  var receipt=new JsonObject();receipt.addProperty("clientChecks",client);receipt.addProperty("environmentChecks",environment);
  receipt.addProperty("requestLegalityChecks",legality);receipt.addProperty("decisionIdentityChecks",6);
  receipt.addProperty("optionalModChecks",12);receipt.addProperty("packetCodecChecks",packets);receipt.addProperty("mixinAbiChecks",abi.checked());
  receipt.addProperty("engineSha256",java.util.HexFormat.of().formatHex(java.security.MessageDigest.getInstance("SHA-256").digest(RejuvenationFields.engine.getBytes(java.nio.charset.StandardCharsets.UTF_8))));
  Files.writeString(path.getParent().resolve("test-results/java-verification.json"),new GsonBuilder().setPrettyPrinting().create().toJson(receipt));
 }
}
