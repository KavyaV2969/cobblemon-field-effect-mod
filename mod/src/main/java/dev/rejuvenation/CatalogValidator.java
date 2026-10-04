package dev.rejuvenation;

import com.google.gson.*;
import com.google.gson.stream.*;
import java.io.*;
import java.util.*;

/** Shared reload boundary. No scripts, expressions, reflection or arbitrary paths. */
public final class CatalogValidator {
 private CatalogValidator() {}
 private static final Set<String> CONDITIONS=words("always all any not move sourceMove moveType category flag field backup grounded ability item type species form formName status weather weatherFor incomingWeather counter hp priority foe missed volatile value semiInvulnerable globalAbility effectiveness turnsActive stateFlag overlay weatherActive pokemonStatus targetStatus chance samePokemon statsLowered selfInflicted contact hasAlly level transformed wild itemStealable usableMove pokemonActive pokemonFlag statSumComparison sideAbility sideCondition role moveTarget fullHealing faster lastMove attackType foeFainted effectiveAbility pseudoWeather");
 private static final Set<String> ACTIONS=words("multiply add set cap reject message boost heal damage status ability type moveType volatile consume form forcedType itemForm randomType randomForm forEach abilityMessage addSecondary stealItem preventStatLoss secondaryChance pseudoWeather progress changeField destroyField oldCategory inverse ice_spikes accuracy_cloud arm_eruption cave_collapse mist_explosion water_pollution bothHazards sideCondition typedDamage spikeDamage wish trickRoom perishSong removeVolatile cureStatus randomBoost randomStat randomStatus conditional transferStat castling counter setFlag setPokemonFlag bindFieldClock weatherTemporary hpPower cyclePower randomPower extraType residualDamage flashFire concertNoise moveMessage groupMessage clearWeather setWeather clearOverlay moveProperty adjustWish mimicry survive moveBehavior criticalStage weightDelta removeCallbacks pairField createField");
 private static final Set<String> EVENTS=words("activate fieldResidual residual switchIn pokemonEntry basePower modifyMove afterMove accuracy priority damage attack specialAttack defense specialDefense speed tryHeal setStatus tryHit weatherChange effectiveness receivedDamage tryVolatile criticalRatio weight chargeMove tryMove overlayIn formChange setWeather afterHit pseudoWeatherStart");
 private static final Set<String> PATHS=words("boosts self.boosts secondaries.0.self.boosts secondaries.0.boosts heal recoil basePower damage priority accuracy target spreadModifier sideCondition category status zMove.boost secondaries secondaries.0.status pseudoWeather flags.gravity flags.protect flags.sound selfBoost self pranksterBoosted forceSwitch");
 private static Set<String> words(String s) { return Set.of(s.split(" ")); }
 private static void require(boolean test,String where,String detail){if(!test)throw new IllegalArgumentException(where+": "+detail);}
 private static boolean numeric(JsonElement e){return e!=null && e.isJsonPrimitive() && e.getAsJsonPrimitive().isNumber() && Double.isFinite(e.getAsDouble());}
 private static boolean integer(JsonElement e,int min,int max){return numeric(e) && e.getAsDouble()==e.getAsInt() && e.getAsInt()>=min && e.getAsInt()<=max;}
 private static void probability(JsonObject a,String where){require(integer(a.get("numerator"),0,10000) && integer(a.get("denominator"),1,10000) && a.get("numerator").getAsInt()<=a.get("denominator").getAsInt(),where,"Invalid probability");}
 private static void stats(JsonObject a,String where){require(a!=null && !a.isEmpty(),where,"Missing stat map");for(var r:a.entrySet())require(words("atk def spa spd spe accuracy evasion").contains(r.getKey()) && integer(r.getValue(),-12,12) && r.getValue().getAsInt()!=0,where,"Invalid stat map");}
 private static void statusPool(JsonObject a,JsonObject fields,String where){var values=a.getAsJsonArray("values");require(values!=null && !values.isEmpty(),where,"Missing status pool");for(var v:values)require(words("brn frz par psn tox slp ptr").contains(v.getAsString()),where,"Invalid pooled status");if(a.has("force")){var force=a.getAsJsonObject("force");condition(force.get("condition"),fields,where);require(values.contains(force.get("status")),where,"Invalid forced status");}}
 public static JsonObject read(InputStream stream) throws IOException {
  try(var reader=new JsonReader(new InputStreamReader(stream,java.nio.charset.StandardCharsets.UTF_8))){
   reader.setLenient(false);var result=tree(reader);require(reader.peek()==JsonToken.END_DOCUMENT,"JSON","Trailing content");return result.getAsJsonObject();
  }
 }
 private static JsonElement tree(JsonReader r) throws IOException {
  return switch(r.peek()){
   case BEGIN_OBJECT -> {var o=new JsonObject();r.beginObject();while(r.hasNext()){String key=r.nextName();require(!o.has(key),r.getPath(),"Duplicate property "+key);o.add(key,tree(r));}r.endObject();yield o;}
   case BEGIN_ARRAY -> {var a=new JsonArray();r.beginArray();while(r.hasNext())a.add(tree(r));r.endArray();yield a;}
   case STRING -> new JsonPrimitive(r.nextString());
   case NUMBER -> {String v=r.nextString();yield new JsonPrimitive(new java.math.BigDecimal(v));}
   case BOOLEAN -> new JsonPrimitive(r.nextBoolean());
   case NULL -> {r.nextNull();yield JsonNull.INSTANCE;}
   default -> throw new IllegalArgumentException(r.getPath()+": Invalid JSON token");
  };
 }
 public static void validate(JsonObject catalog){
  JsonObject fields=catalog.getAsJsonObject("fields");require(fields!=null && fields.has("rejuvenation:indoor"),"catalog","Missing fallback field");
  for(var entry:fields.entrySet()){
   var fieldExtra=entry.getValue().getAsJsonObject();
   if(fieldExtra.has("nativeFormTyping")){var values=fieldExtra.getAsJsonArray("nativeFormTyping");require(!values.isEmpty(),entry.getKey(),"Empty native form typing");for(var v:values)require(words("arceus silvally").contains(v.getAsString()),entry.getKey(),"Invalid native form typing");}
   if(fieldExtra.has("inactiveAbilities")){var values=fieldExtra.getAsJsonArray("inactiveAbilities");for(var a:values)require(a.getAsString().matches("[a-z0-9]+"),entry.getKey(),"Invalid inactive ability");}
   if(fieldExtra.has("statusTypeBypass"))for(var row:fieldExtra.getAsJsonArray("statusTypeBypass")){var r=row.getAsJsonObject();require(r.keySet().equals(words("condition source status")) && r.get("status").getAsString().equals("psn"),entry.getKey(),"Invalid status type bypass");condition(r.get("condition"),fields,entry.getKey());}
   if(fieldExtra.has("clockPolicy")){var c=fieldExtra.getAsJsonObject("clockPolicy");require(c.keySet().equals(words("pauseOverlay source")) && c.get("pauseOverlay").getAsJsonPrimitive().isBoolean(),entry.getKey(),"Invalid clock policy");}
   if(fieldExtra.has("abilityHandlers"))for(var aid:fieldExtra.getAsJsonObject("abilityHandlers").entrySet()){require(aid.getKey().matches("[a-z0-9]+"),entry.getKey(),"Invalid ability handler ID");for(var handler:aid.getValue().getAsJsonObject().entrySet()){var r=handler.getValue().getAsJsonObject();require(words("onStart onResidual onUpdate onAllySwitchIn onSetStatus onAllySetStatus onAnyFaint onDamagingHit onSourceDamagingHit onSourceTryPrimaryHit onBasePower onSourceModifyAccuracy onModifyMove onAfterEachBoost onAllyTryBoost onAllyTryAddVolatile").contains(handler.getKey()) && r.keySet().equals(words("actions condition mode source")) && words("replace append prepend").contains(r.get("mode").getAsString()),entry.getKey(),"Invalid ability handler");condition(r.get("condition"),fields,entry.getKey());actions(r.getAsJsonArray("actions"),fields,entry.getKey());}}
   if(fieldExtra.has("customVolatiles"))for(var row:fieldExtra.getAsJsonObject("customVolatiles").entrySet()){var v=row.getValue().getAsJsonObject();require(row.getKey().matches("rejuvenation[a-z0-9]+") && v.keySet().equals(words("actions source")),entry.getKey(),"Invalid custom volatile");actions(v.getAsJsonArray("actions"),fields,entry.getKey());}
   if(fieldExtra.has("rampagePolicy")){var r=fieldExtra.getAsJsonObject("rampagePolicy");require(words("duration noConfusionMoves source").containsAll(r.keySet()) && (!r.has("duration") || integer(r.get("duration"),1,3)) && r.has("noConfusionMoves") && r.get("noConfusionMoves").isJsonArray(),entry.getKey(),"Invalid rampage policy");for(var mid:r.getAsJsonArray("noConfusionMoves"))require(words("outrage thrash petaldance ragingfury").contains(mid.getAsString()),entry.getKey(),"Invalid rampage move");}
   String where=entry.getKey();var f=entry.getValue().getAsJsonObject();
   require(f.get("schemaVersion").getAsInt()==1 && where.equals(f.get("id").getAsString()),where,"Invalid ID/schema");
   for(String k:List.of("name","entryMessage","naturePower","secretPower"))require(f.has(k) && f.get(k).isJsonPrimitive() && f.get(k).getAsJsonPrimitive().isString(),where,"Missing text "+k);
   content(f,fields,where);if(f.has("overlay"))content(f.getAsJsonObject("overlay"),fields,where+"/overlay");
   for(JsonElement element:f.getAsJsonArray("rules")){
    var rule=element.getAsJsonObject();require(EVENTS.contains(rule.get("event").getAsString()),where,"Unknown event");condition(rule.get("condition"),fields,where);actions(rule.getAsJsonArray("actions"),fields,where);
   }
   if(f.has("seedActions"))actions(f.getAsJsonArray("seedActions"),fields,where);
   if(f.has("persistentStatusPolicies"))for(var status:f.getAsJsonObject("persistentStatusPolicies").entrySet()){
    var row=status.getValue().getAsJsonObject();require(status.getKey().equals("ptr") && row.keySet().equals(words("name immuneTypes immuneAbilities sideProtectionAbility drainAbility invertAbility fraction blocksHealing blockedHealingAbilities drainMessage healingFailureMessage source")),where,"Invalid persistent status policy");
    require(numeric(row.get("fraction")) && row.get("fraction").getAsDouble()>0 && row.get("fraction").getAsDouble()<=1 && row.getAsJsonPrimitive("blocksHealing").isBoolean(),where,"Invalid status damage/healing");
    for(String key:List.of("immuneTypes","immuneAbilities","blockedHealingAbilities"))require(row.get(key).isJsonArray() && !row.getAsJsonArray(key).isEmpty(),where,"Missing status IDs");
    for(String key:List.of("name","sideProtectionAbility","drainAbility","invertAbility","drainMessage","healingFailureMessage","source"))require(row.get(key).isJsonPrimitive() && row.getAsJsonPrimitive(key).isString() && !row.get(key).getAsString().isEmpty(),where,"Invalid status text/ability");
   }
   if(f.has("abilityContactPolicies"))for(var policy:f.getAsJsonObject("abilityContactPolicies").entrySet()){
    var row=policy.getValue().getAsJsonObject();require(policy.getKey().equals("perishbody") && row.keySet().equals(words("disabled duration trapDefender forceAttackerStatus message source")) && row.getAsJsonPrimitive("disabled").isBoolean() && row.getAsJsonPrimitive("trapDefender").isBoolean() && numeric(row.get("duration")) && row.get("duration").getAsDouble()==row.get("duration").getAsInt() && row.get("duration").getAsInt()>0 && row.get("duration").getAsInt()<=10 && Set.of("","ptr").contains(row.get("forceAttackerStatus").getAsString()),where,"Invalid contact policy");
   }
   if(f.has("expirationReturnMessage"))require(f.getAsJsonPrimitive("expirationReturnMessage").isString(),where,"Invalid restoration message");
   if(f.has("multiplierPolicy")){
    var row=f.getAsJsonObject("multiplierPolicy");require(row.keySet().equals(words("defaultDifficultyMode defaultFieldFrenzy casualMode casualFactor frenzyBoostFactor frenzyReductionFactor combinedMinimum source")),where,"Invalid multiplier policy");
    for(String key:List.of("defaultDifficultyMode","casualMode"))require(numeric(row.get(key)) && row.get(key).getAsDouble()==row.get(key).getAsInt() && row.get(key).getAsInt()>=0 && row.get(key).getAsInt()<=2,where,"Invalid difficulty defaults");
    require(row.getAsJsonPrimitive("defaultFieldFrenzy").isBoolean(),where,"Invalid Frenzy default");
    for(String key:List.of("casualFactor","frenzyBoostFactor","frenzyReductionFactor","combinedMinimum"))require(numeric(row.get(key)) && row.get(key).getAsDouble()>0 && row.get(key).getAsDouble()<=4,where,"Invalid difficulty factor");
   }
   if(f.has("volatilePolicies"))for(var entryPolicy:f.getAsJsonObject("volatilePolicies").entrySet()){
    var row=entryPolicy.getValue().getAsJsonObject();require(entryPolicy.getKey().equals("nightmare") && row.keySet().equals(words("allowAwake suppressResidual fraction message source")),where,"Unknown volatile policy");
    for(String key:List.of("allowAwake","suppressResidual"))require(row.get(key).isJsonPrimitive() && row.getAsJsonPrimitive(key).isBoolean(),where,"Invalid volatile guard");
    require(numeric(row.get("fraction")) && row.get("fraction").getAsDouble()>0 && row.get("fraction").getAsDouble()<=1 && row.getAsJsonPrimitive("message").isString(),where,"Invalid volatile damage");
   }
   if(f.has("conditionDurations"))for(var entryClock:f.getAsJsonObject("conditionDurations").entrySet()){
    var row=entryClock.getValue().getAsJsonObject();require(words("duration add sourceMoves source choices sourceAbilities").containsAll(row.keySet()) && row.has("duration")!=row.has("add"),where,"Malformed condition clock");
    var value=row.get(row.has("duration")?"duration":"add");require(numeric(value) && value.getAsDouble()>0 && value.getAsDouble()<=20 && value.getAsDouble()==value.getAsInt(),where,"Invalid clock duration");
    require(row.has("sourceMoves") && row.get("sourceMoves").isJsonArray() && !row.getAsJsonArray("sourceMoves").isEmpty(),where,"Missing duration move filter");
    if(row.has("sourceAbilities"))require(row.get("sourceAbilities").isJsonArray(),where,"Invalid duration ability filter");
    if(row.has("choices"))for(var choiceElement:row.getAsJsonArray("choices")){
     var choice=choiceElement.getAsJsonObject();require(words("condition duration randomRange").containsAll(choice.keySet()) && choice.has("duration")!=choice.has("randomRange"),where,"Malformed clock choice");condition(choice.get("condition"),fields,where);
     if(choice.has("duration"))require(numeric(choice.get("duration")) && choice.get("duration").getAsDouble()==choice.get("duration").getAsInt() && choice.get("duration").getAsInt()>0 && choice.get("duration").getAsInt()<=20,where,"Invalid clock choice duration");
     if(choice.has("randomRange")){var range=choice.getAsJsonObject("randomRange");require(range.keySet().equals(words("minimum maximum")),where,"Malformed random clock");for(String key:List.of("minimum","maximum"))require(numeric(range.get(key)) && range.get(key).getAsDouble()==range.get(key).getAsInt(),where,"Invalid random clock bound");require(range.get("minimum").getAsInt()>0 && range.get("maximum").getAsInt()>=range.get("minimum").getAsInt() && range.get("maximum").getAsInt()<=20,where,"Invalid random clock range");}
    }
   }
   if(f.has("captureModifiers"))for(var capture:f.getAsJsonObject("captureModifiers").entrySet())require(capture.getKey().matches("[a-z0-9_.-]+:[a-z0-9_/.-]+") && numeric(capture.getValue()) && capture.getValue().getAsDouble()>0 && capture.getValue().getAsDouble()<=10,where,"Invalid capture modifier");
   if(f.has("captureEnvironmentModifiers"))for(var element:f.getAsJsonArray("captureEnvironmentModifiers")){
    var row=element.getAsJsonObject();require(row.keySet().equals(words("ball predicate multiplier source")) && row.get("ball").getAsString().matches("[a-z0-9_.-]+:[a-z0-9_/.-]+") && words("underwater night").contains(row.get("predicate").getAsString()) && numeric(row.get("multiplier")) && row.get("multiplier").getAsDouble()>0 && row.get("multiplier").getAsDouble()<=10,where,"Invalid capture environment rule");
   }
   if(f.has("weatherConversions"))for(var conversion:f.getAsJsonObject("weatherConversions").entrySet())require(words("sunnyday raindance sandstorm hail snow desolateland primordialsea deltastream").contains(conversion.getKey()) && words("sunnyday raindance sandstorm hail snow desolateland primordialsea deltastream").contains(conversion.getValue().getAsString()) && !conversion.getKey().equals(conversion.getValue().getAsString()),where,"Invalid weather conversion");
   if(f.has("abilityAbsorptions"))for(var entryPolicy:f.getAsJsonObject("abilityAbsorptions").entrySet()){
    var row=entryPolicy.getValue().getAsJsonObject();require(words("type stat boosts healFractions cycle maximizeOverlay source").containsAll(row.keySet()) && row.has("boosts")!=row.has("healFractions"),where,"Malformed absorption policy");
    require(words("Normal Fire Water Electric Grass Ice Fighting Poison Ground Flying Psychic Bug Rock Ghost Dragon Dark Steel Fairy ???").contains(row.get("type").getAsString()),where,"Invalid absorption type");
    var values=row.getAsJsonArray(row.has("boosts")?"boosts":"healFractions");require(!values.isEmpty(),where,"Missing absorption values");
    for(var value:values)require(numeric(value) && value.getAsDouble()>=0 && value.getAsDouble()<=(row.has("boosts")?6:1),where,"Invalid absorption value");
    if(row.has("boosts"))require(words("atk def spa spd spe").contains(row.get("stat").getAsString()),where,"Invalid absorption stat");
    if(row.has("maximizeOverlay"))require(fields.has(row.get("maximizeOverlay").getAsString()),where,"Invalid absorption overlay");
   }
   if(f.has("statPools")){
    var pools=f.getAsJsonObject("statPools");require(pools.keySet().equals(words("offensiveSpecial defensiveSpecial source")),where,"Malformed shared stat keys");
    for(String key:List.of("offensiveSpecial","defensiveSpecial")){var values=pools.getAsJsonArray(key);require(values.size()==2 && new HashSet<>(values.asList()).equals(Set.of(new JsonPrimitive("spa"),new JsonPrimitive("spd"))),where,"Invalid shared Special stats");}
   }
   if(f.has("trapping")){
    var t=f.getAsJsonObject("trapping");require(words("divisors moveIncrements statLoss immuneAbilities octolockAmount source").containsAll(t.keySet()),where,"Malformed trapping keys");
    require(t.get("divisors").equals(JsonParser.parseString("[8,6,4,3,2]")),where,"Invalid binding divisor table");
    for(var v:t.getAsJsonObject("moveIncrements").entrySet())require(numeric(v.getValue()) && v.getValue().getAsInt()>=0 && v.getValue().getAsInt()<=3,where,"Invalid binding increment");
    for(var v:t.getAsJsonObject("statLoss").entrySet()){require(v.getValue().isJsonArray() && !v.getValue().getAsJsonArray().isEmpty(),where,"Missing binding stats");for(var s:v.getValue().getAsJsonArray())require(words("atk def spa spd spe accuracy evasion").contains(s.getAsString()),where,"Invalid binding stat");}
    if(t.has("octolockAmount"))require(numeric(t.get("octolockAmount")) && Set.of(-1,-2).contains(t.get("octolockAmount").getAsInt()),where,"Invalid Octolock amount");
   }
   if(f.has("grounding")){
    var g=f.getAsJsonObject("grounding");require(g.keySet().equals(words("airborneAbilities forceGroundingItems source")),where,"Malformed grounding policy");
    for(String key:List.of("airborneAbilities","forceGroundingItems"))for(var id:g.getAsJsonArray(key))require(id.isJsonPrimitive() && id.getAsString().matches("[a-z0-9]+"),where,"Invalid grounding ID");
   }
   if(f.has("gravityUsableMoves"))for(var id:f.getAsJsonArray("gravityUsableMoves"))require(id.isJsonPrimitive() && id.getAsString().matches("[a-z0-9]+"),where,"Invalid gravity move");
   if(f.has("terrainPolicy")){
    var p=f.getAsJsonObject("terrainPolicy");require(words("blockedMessage blockedFields moveDurations source clearOverlayOnEntry").containsAll(p.keySet()),where,"Malformed terrain policy");
    if(p.has("clearOverlayOnEntry"))require(p.getAsJsonPrimitive("clearOverlayOnEntry").isBoolean(),where,"Invalid overlay clearing policy");
    if(p.has("blockedFields"))for(var id:p.getAsJsonArray("blockedFields"))require(fields.has(id.getAsString()),where,"Invalid blocked terrain");
    if(p.has("moveDurations"))for(var d:p.getAsJsonObject("moveDurations").entrySet())require(fields.has(d.getKey()) && numeric(d.getValue()) && d.getValue().getAsInt()>0 && d.getValue().getAsInt()<=20,where,"Invalid terrain duration");
   }
   if(f.has("healing")){
    var h=f.getAsJsonObject("healing");require(h.keySet().equals(words("rootFactor agentMultipliers overlayAgents moveMultipliers harmfulAgents liquidOozeFactor drainStatLoss")),where,"Malformed healing configuration");
    for(String key:List.of("rootFactor","liquidOozeFactor"))require(numeric(h.get(key)) && h.get(key).getAsDouble()>0,where,"Invalid healing factor");
    for(String key:List.of("agentMultipliers","moveMultipliers"))for(var m:h.getAsJsonObject(key).entrySet())require(numeric(m.getValue()) && m.getValue().getAsDouble()>0,where,"Invalid healing multiplier");
    require(h.get("drainStatLoss").isJsonPrimitive() && h.get("drainStatLoss").getAsJsonPrimitive().isBoolean(),where,"Invalid drain stat loss");
    for(var m:h.getAsJsonObject("harmfulAgents").entrySet()){var v=m.getValue().getAsJsonObject();require(v.keySet().equals(words("respectMagicGuard message")) && v.get("respectMagicGuard").getAsJsonPrimitive().isBoolean() && v.get("message").getAsJsonPrimitive().isString(),where,"Malformed harmful healing");}
    for(var agent:h.getAsJsonArray("overlayAgents"))require(words("drain leechseed ingrain aquaring strengthsap").contains(agent.getAsString()),where,"Unknown absorbed healing agent");
   }
   if(f.has("suppressedAbilityCallbacks"))for(var entryCallback:f.getAsJsonObject("suppressedAbilityCallbacks").entrySet())require((entryCallback.getValue().equals(JsonParser.parseString("[\"onTryHit\"]")) || entryCallback.getValue().equals(JsonParser.parseString("[\"onImmunity\"]"))),where,"Unsupported ability callback");
   if(f.has("partyRoles")){
    var roles=f.getAsJsonObject("partyRoles");require(roles.keySet().equals(words("tailRole frontRole frontCount leaderRole preferAbilities preferItems remaining")),where,"Malformed party roles");
    for(var remaining:roles.getAsJsonArray("remaining")){var r=remaining.getAsJsonObject();require(r.has("role") && r.get("role").isJsonPrimitive(),where,"Missing party role");for(var stat:r.getAsJsonArray("maxStats"))require(words("atk def spa spd spe").contains(stat.getAsString()),where,"Invalid role stat");}
    for(String mode:List.of("singles","doubles"))require(roles.getAsJsonObject("frontCount").get(mode).getAsInt()>0,where,"Invalid front role count");
   }
   if(f.has("typeChart"))for(var element:f.getAsJsonArray("typeChart")){
    var row=element.getAsJsonObject();require(row.keySet().equals(words("attackType defenseType value condition source")),where,"Invalid type chart keys");
    var value=row.get("value");require(value.isJsonPrimitive() && ((numeric(value) && Set.of(-1.0,0.0,1.0).contains(value.getAsDouble())) || value.getAsString().equals("immune")),where,"Invalid type chart result");
    for(String key:List.of("attackType","defenseType"))require(words("* Normal Fire Water Electric Grass Ice Fighting Poison Ground Flying Psychic Bug Rock Ghost Dragon Dark Steel Fairy Shadow ???").contains(row.get(key).getAsString()),where,"Invalid type chart type");
    condition(row.get("condition"),fields,where);
   }
  }
  for(JsonElement element:catalog.getAsJsonArray("mappings")){
   var rule=element.getAsJsonObject();require(fields.has(rule.get("field").getAsString()),"mapping","Missing field");
   require(words("biome tag dimension submerged maxY skyVisible minDepth field reason").containsAll(rule.keySet()),"mapping","Unknown predicate");
  }
 }
 private static void content(JsonObject data,JsonObject fields,String where){
  for(var entry:data.getAsJsonObject("moves").entrySet()){
   var move=entry.getValue().getAsJsonObject();String at=where+"/"+entry.getKey();
   for(String key:List.of("multiplier","accuracy"))if(move.has(key)){var n=move.get(key);require(numeric(n) && n.getAsDouble()>=0 && (!key.equals("accuracy") || n.getAsDouble()<=100),at,"Invalid "+key);}
   if(move.has("after"))actions(move.getAsJsonArray("after"),fields,at);
   if(move.has("transition")){var t=move.getAsJsonObject("transition");require(fields.has(t.get("field").getAsString()),at,"Missing transition target");condition(t.get("condition"),fields,at);if(t.has("after"))actions(t.getAsJsonArray("after"),fields,at);}
  }
  for(var element:data.getAsJsonArray("types")){var t=element.getAsJsonObject();condition(t.get("match"),fields,where);condition(t.get("condition"),fields,where);if(t.has("after"))actions(t.getAsJsonArray("after"),fields,where);}
 }
 private static void condition(JsonElement e,JsonObject fields,String where){
  require(e!=null && e.isJsonObject() && e.getAsJsonObject().size()==1,where,"Malformed condition");
  var c=e.getAsJsonObject();String k=c.keySet().iterator().next();var v=c.get(k);require(CONDITIONS.contains(k),where,"Unknown condition "+k);
  if(k.equals("all") || k.equals("any")){require(v.isJsonArray() && !v.getAsJsonArray().isEmpty(),where,"Empty Boolean group");for(var a:v.getAsJsonArray())condition(a,fields,where);}
  else if(k.equals("not"))condition(v,fields,where);
  else if(Set.of("field","backup","overlay").contains(k))require(fields.has(v.getAsString()),where,"Unknown condition field");
  else if(words("always foe missed weatherActive fullHealing foeFainted samePokemon hasAlly transformed itemStealable statsLowered selfInflicted").contains(k))require(v.isJsonPrimitive() && v.getAsJsonPrimitive().isBoolean(),where,"Expected Boolean condition");
  else if(k.equals("pokemonFlag")){var r=v.getAsJsonObject();require(r.keySet().equals(words("who id value")) && words("user target").contains(r.get("who").getAsString()) && r.get("id").getAsString().matches("[a-z][a-z0-9_]*") && r.get("value").getAsJsonPrimitive().isBoolean(),where,"Invalid Pokemon flag predicate");}
  else if(k.equals("statSumComparison")){var r=v.getAsJsonObject();require(r.keySet().equals(words("left right group op")) && words("foes allies").contains(r.get("group").getAsString()) && words("> >= < <= ==").contains(r.get("op").getAsString()) && words("atk def spa spd spe").contains(r.get("left").getAsString()) && words("atk def spa spd spe").contains(r.get("right").getAsString()),where,"Invalid stat sum comparison");}
  else if(k.equals("pseudoWeather")){var a=v.getAsJsonObject();require(a.keySet().equals(words("id value")) && words("gravity mudsport trickroom magicroom wonderroom").contains(a.get("id").getAsString()) && a.get("value").getAsJsonPrimitive().isBoolean(),where,"Invalid field condition");}
  else if(k.equals("chance"))probability(v.getAsJsonObject(),where);
  else if(words("contact wild usableMove pokemonActive").contains(k)){var a=v.getAsJsonObject();require(a.has("who") && words("user target").contains(a.get("who").getAsString()) && (!k.equals("wild") || a.has("value") && a.get("value").getAsJsonPrimitive().isBoolean()),where,"Invalid actor/contact predicate");}
  else if(k.equals("faster"))require(v.isJsonObject() && v.getAsJsonObject().has("stored") && v.getAsJsonObject().get("stored").getAsJsonPrimitive().isBoolean(),where,"Malformed speed comparison");
  else if(k.equals("incomingWeather")){require(v.isJsonArray() && !v.getAsJsonArray().isEmpty(),where,"Missing incoming weather");for(var weather:v.getAsJsonArray())require(words("sunnyday raindance sandstorm hail snow desolateland primordialsea deltastream").contains(weather.getAsString()),where,"Unknown incoming weather");}
  else if(k.equals("weatherFor")){require(v.isJsonObject(),where,"Malformed subject weather");var a=v.getAsJsonObject();require(a.has("who") && words("user target").contains(a.get("who").getAsString()),where,"Invalid weather subject");require(a.has("values") && a.get("values").isJsonArray() && !a.getAsJsonArray("values").isEmpty(),where,"Missing subject weather");for(var weather:a.getAsJsonArray("values"))require(words("sunnyday raindance sandstorm hail snow desolateland primordialsea deltastream").contains(weather.getAsString()),where,"Unknown subject weather");}
  else if(words("role type species form formName grounded volatile ability effectiveAbility sideAbility item semiInvulnerable lastMove").contains(k)){
   var a=v.getAsJsonObject();require(words("user target").contains(a.get("who").getAsString()),where,"Invalid condition subject");
   if(words("ability effectiveAbility sideAbility item lastMove").contains(k))require(a.has("values") && a.get("values").isJsonArray() && !a.getAsJsonArray("values").isEmpty(),where,"Empty ID list");
   if(k.equals("role"))require(a.has("value") && a.get("value").getAsString().matches("[a-z][a-z0-9_]*"),where,"Invalid role identifier");
   if(k.equals("formName"))require(a.has("value") && a.get("value").isJsonPrimitive() && a.getAsJsonPrimitive("value").isString(),where,"Invalid form name");
  }
  else if(Set.of("counter","priority","hp","effectiveness","turnsActive","level","value").contains(k)){
   var a=v.getAsJsonObject();require(words("> >= < <= ==").contains(a.get("op").getAsString()),where,"Invalid comparator");require(numeric(a.get(k.equals("hp")?"fraction":"value")),where,"Invalid number");
   if(k.equals("counter"))require(a.get("index").getAsInt()>=1 && a.get("index").getAsInt()<=5,where,"Invalid counter");
  }
 }
 private static void actions(JsonArray list,JsonObject fields,String where){
  require(list!=null,where,"Missing actions");
  for(var element:list){var a=element.getAsJsonObject();String op=a.get("op").getAsString();require(ACTIONS.contains(op),where,"Unknown action "+op);
   if(a.has("who"))require(words("user target").contains(a.get("who").getAsString()),where,"Invalid action subject");
   if(op.equals("conditional")){condition(a.get("condition"),fields,where);actions(a.getAsJsonArray("actions"),fields,where);}
   if(a.has("messagePlacement"))require(words("before after").contains(a.get("messagePlacement").getAsString()),where,"Invalid message placement");
   if(op.equals("boost") && a.has("source"))require(a.get("source").getAsString().equals("environment"),where,"Invalid boost source");
   if(op.equals("typedDamage") && a.has("direct"))require(a.get("direct").getAsJsonPrimitive().isBoolean(),where,"Invalid direct damage policy");
   if(op.equals("setPokemonFlag"))require(a.get("id").getAsString().matches("[a-z][a-z0-9_]*") && a.get("value").getAsJsonPrimitive().isBoolean(),where,"Invalid Pokemon flag action");
   if(op.equals("setWeather") && a.has("onSuccess"))actions(a.getAsJsonArray("onSuccess"),fields,where);
   if(op.equals("forEach")){require(words("foes allies others").contains(a.get("group").getAsString()),where,"Invalid action group");actions(a.getAsJsonArray("actions"),fields,where);}
   if(op.equals("forcedType"))require(words("Normal Fire Water Electric Grass Ice Fighting Poison Ground Flying Psychic Bug Rock Ghost Dragon Dark Steel Fairy ???").contains(a.get("type").getAsString()),where,"Invalid forced type");
   if(op.equals("itemForm")){require(a.get("defaultSpecies").getAsString().matches("[a-z0-9]+") && words("Normal Fire Water Electric Grass Ice Fighting Poison Ground Flying Psychic Bug Rock Ghost Dragon Dark Steel Fairy ???").contains(a.get("defaultType").getAsString()) && !a.getAsJsonArray("variants").isEmpty(),where,"Invalid item form");for(var v:a.getAsJsonArray("variants")){var r=v.getAsJsonObject();require(r.keySet().equals(words("items species type")) && r.get("species").getAsString().matches("[a-z0-9]+") && words("Normal Fire Water Electric Grass Ice Fighting Poison Ground Flying Psychic Bug Rock Ghost Dragon Dark Steel Fairy ???").contains(r.get("type").getAsString()) && !r.getAsJsonArray("items").isEmpty(),where,"Invalid item form variant");for(var i:r.getAsJsonArray("items"))require(i.getAsString().matches("[a-z0-9]+"),where,"Invalid item form item");}}
   if(op.equals("randomType")){var values=a.getAsJsonArray("values");require(values!=null && !values.isEmpty() && (!a.has("force") || a.get("force").getAsJsonPrimitive().isBoolean()),where,"Invalid random type");for(var v:values)require(words("Normal Fire Water Electric Grass Ice Fighting Poison Ground Flying Psychic Bug Rock Ghost Dragon Dark Steel Fairy ???").contains(v.getAsString()),where,"Invalid type ID");}
   if(op.equals("randomForm")){var values=a.getAsJsonArray("variants");require(values!=null && values.size()>1,where,"Missing random forms");for(var v:values){var r=v.getAsJsonObject();require(r.keySet().equals(words("species type")) && r.get("species").getAsString().matches("[a-z0-9]+") && words("Normal Fire Water Electric Grass Ice Fighting Poison Ground Flying Psychic Bug Rock Ghost Dragon Dark Steel Fairy").contains(r.get("type").getAsString()),where,"Invalid random form");}}
   if(op.equals("addSecondary")){var r=a.getAsJsonObject("effect");require(a.get("duplicateKey").getAsString().equals("volatileStatus") && r.keySet().equals(words("chance volatileStatus")) && integer(r.get("chance"),1,100) && words("flinch confusion").contains(r.get("volatileStatus").getAsString()),where,"Invalid additional secondary");}
   if(op.equals("boost"))stats(a.getAsJsonObject("stats"),where);
   if(op.equals("randomStatus"))statusPool(a,fields,where);
   if(words("randomBoost randomStat").contains(op)){var s=a.getAsJsonArray("stats");require(s!=null && !s.isEmpty() && integer(a.get("amount"),-12,12) && a.get("amount").getAsInt()!=0,where,"Invalid random stat");for(var v:s)require(words("atk def spa spd spe accuracy evasion").contains(v.getAsString()),where,"Invalid random stat ID");}
   if(op.equals("transferStat")){var s=new JsonObject();s.add(a.get("stat").getAsString(),a.get("amount"));stats(s,where);}
   if(op.equals("bindFieldClock")){condition(a.get("durationCondition"),fields,where);condition(a.get("permanentCondition"),fields,where);}
   if(op.equals("changeField") && a.has("durationFromCondition"))require(words("gravity mudsport trickroom magicroom wonderroom").contains(a.get("durationFromCondition").getAsString()),where,"Invalid duration source");
   if(op.equals("castling")){stats(a.getAsJsonObject("userStats"),where);stats(a.getAsJsonObject("partnerStats"),where);require(a.has("message") && a.get("message").isJsonPrimitive() && a.getAsJsonPrimitive("message").isString(),where,"Missing castling message");}
   if(op.equals("changeField")){require(!a.has("duration") || integer(a.get("duration"),0,20),where,"Invalid temporary duration");require(!a.has("force") || a.get("force").getAsJsonPrimitive().isBoolean(),where,"Invalid force flag");require(!a.has("boundCondition") || a.get("boundCondition").getAsString().matches("[a-z0-9]+"),where,"Invalid clock condition");}
   if(words("multiply add cap").contains(op))require(numeric(a.get("value")),where,"Invalid numeric action");
   if(words("heal damage typedDamage residualDamage wish adjustWish").contains(op))require(numeric(a.get("fraction")) && a.get("fraction").getAsDouble()>0 && a.get("fraction").getAsDouble()<=1,where,"Invalid HP fraction");
   if(words("changeField weatherTemporary").contains(op))require(fields.has(a.get("field").getAsString()),where,"Missing action field");
   if(op.equals("moveProperty"))require(PATHS.contains(a.get("path").getAsString()),where,"Invalid move property path");
   if(op.equals("sideCondition")){
    require(words("mist safeguard luckychant reflect lightscreen auroraveil tailwind spikes toxicspikes stealthrock stickyweb").contains(a.get("id").getAsString()),where,"Invalid side condition");
    if(a.has("duration"))require(numeric(a.get("duration")) && a.get("duration").getAsDouble()==a.get("duration").getAsInt() && a.get("duration").getAsInt()>0 && a.get("duration").getAsInt()<=20,where,"Invalid side duration");
   }
   if(op.equals("createField")){
    if(a.has("blockEverstone"))require(a.get("blockEverstone").getAsJsonPrimitive().isBoolean(),where,"Invalid Everstone policy");
    require(fields.has(a.get("field").getAsString()),where,"Invalid field creation target");
    for(String key:List.of("duration","extendedBy"))require(numeric(a.get(key)) && a.get(key).getAsDouble()==a.get(key).getAsInt() && a.get(key).getAsInt()>=(key.equals("duration")?1:0) && a.get(key).getAsInt()<=20,where,"Invalid field creation clock");
   }
   if(op.equals("criticalStage"))require(words("focusenergy dragoncheer").contains(a.get("id").getAsString()) && numeric(a.get("stage")) && a.get("stage").getAsInt()>=1 && a.get("stage").getAsInt()<=3,where,"Invalid critical stage");
   if(op.equals("weightDelta"))require(numeric(a.get("baseMultiplier")) && a.get("baseMultiplier").getAsDouble()>0,where,"Invalid weight increment");
   if(op.equals("removeCallbacks"))for(var c:a.getAsJsonArray("callbacks"))require(words("onPrepareHit onTry onTryHit onModifyMove onHit basePowerCallback").contains(c.getAsString()),where,"Invalid callback removal");
   if(op.equals("pairField")){
    require(words("pledge conversion").contains(a.get("memory").getAsString()),where,"Invalid pair memory");
    require(numeric(a.get("duration")) && a.get("duration").getAsInt()>0 && a.get("duration").getAsInt()<=20 && numeric(a.get("extendedBy")) && a.get("extendedBy").getAsInt()>=0,where,"Invalid pair duration");
    if(a.has("disallowPermanentField"))require(fields.has(a.get("disallowPermanentField").getAsString()),where,"Unknown permanent restriction");
    for(var row:a.getAsJsonArray("pairs"))require(fields.has(row.getAsJsonObject().get("field").getAsString()),where,"Unknown paired field");
   }
   if(a.has("removeCallback"))require(words("onHit onTry onBasePower basePowerCallback").contains(a.get("removeCallback").getAsString()),where,"Invalid callback removal");
   if(a.has("silentCommands")){require(!a.getAsJsonArray("silentCommands").isEmpty(),where,"Empty silent command policy");for(var v:a.getAsJsonArray("silentCommands"))require(words("swap -start -status").contains(v.getAsString()),where,"Invalid silent command policy");}
   if(op.equals("moveBehavior")){
    String recipe=a.get("recipe").getAsString();require(words("cureAndBoost setTypes appendHitActions payHP fixedDamage targetWeightPower boostOnly shareHP deductPP arenaRoar firstTypeBonus refreshVolatileBeforeHit reapplyStatusHeal replaceHitActions otherActiveHitActions randomStatusSecondary boostStagePower allActiveHitActions weightRatioPower purify swallow randomPowerCallback forceBasePower appendSecondaryActions alliesHitActions beforeCalledMoveActions randomMovePool strengthSap targetHealing concertRoar dualBoost gatedStatChanges").contains(recipe),where,"Unknown move recipe");
    if(recipe.equals("refreshVolatileBeforeHit"))require(a.has("id") && a.get("id").getAsString().matches("[a-z0-9]+"),where,"Invalid refreshed volatile");
    if(recipe.equals("reapplyStatusHeal"))require(a.has("status") && words("slp brn par psn tox frz").contains(a.get("status").getAsString()) && numeric(a.get("duration")) && a.get("duration").getAsDouble()==a.get("duration").getAsInt() && a.get("duration").getAsInt()>0 && a.get("duration").getAsInt()<=20 && numeric(a.get("fraction")) && a.get("fraction").getAsDouble()>0 && a.get("fraction").getAsDouble()<=1,where,"Invalid status refresh/heal");
    if(words("appendHitActions appendSecondaryActions replaceHitActions otherActiveHitActions allActiveHitActions alliesHitActions beforeCalledMoveActions targetHealing").contains(recipe))actions(a.getAsJsonArray("actions"),fields,where+"/hit");
    if(words("allActiveHitActions alliesHitActions").contains(recipe))condition(a.get("condition"),fields,where);
    if(recipe.equals("randomStatusSecondary"))statusPool(a,fields,where);
    if(words("boostStagePower forceBasePower").contains(recipe))require(integer(a.get("base"),1,1000),where,"Invalid fixed base power");
    if(recipe.equals("weightRatioPower"))require(numeric(a.get("multiplier")) && a.get("multiplier").getAsDouble()>0 && a.get("multiplier").getAsDouble()<=10,where,"Invalid weight ratio");
    if(recipe.equals("randomPowerCallback")){probability(a,where);require(integer(a.get("base"),1,1000) && integer(a.get("boosted"),1,1000),where,"Invalid chance power");}
    if(words("purify strengthSap concertRoar").contains(recipe))stats(a.getAsJsonObject("stats"),where);
    if(words("purify targetHealing").contains(recipe))for(String key:List.of("fraction","userFraction")){if(key.equals("userFraction") && !a.has(key))continue;require(numeric(a.get(key)) && a.get(key).getAsDouble()>0 && a.get(key).getAsDouble()<=1,where,"Invalid healing fraction");}
    if(recipe.equals("swallow")){var fs=a.getAsJsonArray("fractions");require(fs!=null && fs.size()==3 && integer(a.get("cureAt"),1,3),where,"Invalid stockpile healing");for(var v:fs)require(numeric(v) && v.getAsDouble()>0 && v.getAsDouble()<=1,where,"Invalid stockpile fraction");}
    if(recipe.equals("gatedStatChanges")){stats(a.getAsJsonObject("stats"),where);stats(a.getAsJsonObject("gateStats"),where);require(words("user target").contains(a.get("gateWho").getAsString()) && a.get("selfSwitch").getAsJsonPrimitive().isBoolean() && a.get("failureMessage").getAsJsonPrimitive().isString(),where,"Invalid gated stat change");}
    if(recipe.equals("dualBoost")){stats(a.getAsJsonObject("targetStats"),where);stats(a.getAsJsonObject("userStats"),where);}
    if(recipe.equals("randomMovePool")){require(integer(a.get("minimumPower"),1,1000) && a.has("choices") && a.get("choices").isJsonArray() && !a.getAsJsonArray("choices").isEmpty(),where,"Invalid random move pool");var seen=new HashSet<String>();for(var mid:a.getAsJsonArray("choices"))require(mid.isJsonPrimitive() && mid.getAsString().matches("[a-z0-9]+") && seen.add(mid.getAsString()),where,"Invalid or duplicate calling move");}
    if(recipe.equals("beforeCalledMoveActions"))require(a.has("callback") && a.get("callback").getAsString().equals("onTryHit"),where,"Invalid caller callback");
    if(recipe.equals("appendHitActions"))require(!a.has("callback") || words("onHit onHitSide onAfterHit onHitField").contains(a.get("callback").getAsString()),where,"Invalid hit action callback");
    if(recipe.equals("deductPP"))require(numeric(a.get("amount")) && a.get("amount").getAsDouble()==a.get("amount").getAsInt() && a.get("amount").getAsInt()>0 && a.get("amount").getAsInt()<=64,where,"Invalid PP deduction");
    if(recipe.equals("firstTypeBonus"))require(words("Normal Fire Water Electric Grass Ice Fighting Poison Ground Flying Psychic Bug Rock Ghost Dragon Dark Steel Fairy ???").contains(a.get("type").getAsString()) && numeric(a.get("repeat")) && a.get("repeat").getAsDouble()==a.get("repeat").getAsInt() && a.get("repeat").getAsInt()>=1 && a.get("repeat").getAsInt()<=3 && a.get("positiveOnly").isJsonPrimitive() && a.get("positiveOnly").getAsJsonPrimitive().isBoolean(),where,"Invalid first-type bonus");
    if(recipe.equals("payHP")){require(numeric(a.get("fraction")) && a.get("fraction").getAsDouble()>0 && a.get("fraction").getAsDouble()<=1,where,"Invalid HP cost");require(!a.has("callback") || words("onHit onAfterMove").contains(a.get("callback").getAsString()),where,"Invalid cost callback");}
    if(recipe.equals("fixedDamage")){
     require(words("level targetHP targetMaxHP").contains(a.get("basis").getAsString()) && numeric(a.get("factor")) && a.get("factor").getAsDouble()>0 && a.get("factor").getAsDouble()<=2,where,"Invalid fixed damage");
     if(a.has("randomRange")){var r=a.getAsJsonObject("randomRange");require(numeric(r.get("minimum")) && numeric(r.get("maximum")) && r.get("minimum").getAsInt()>0 && r.get("maximum").getAsInt()>=r.get("minimum").getAsInt(),where,"Invalid random damage range");}
    }
   }
   if(a.has("maximize"))condition(a.get("maximize"),fields,where);
   if(a.has("modifiers"))for(var m:a.getAsJsonArray("modifiers"))condition(m.getAsJsonObject().get("condition"),fields,where);
  }
 }
}
