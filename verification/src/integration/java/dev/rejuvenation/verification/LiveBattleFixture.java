package dev.rejuvenation.verification;

import dev.rejuvenation.*;
import com.cobblemon.mod.common.api.Priority;
import com.cobblemon.mod.common.api.events.*;
import com.cobblemon.mod.common.api.events.battles.BattleStartedEvent;
import com.cobblemon.mod.common.api.pokemon.PokemonProperties;
import com.cobblemon.mod.common.api.storage.party.PlayerPartyStore;
import com.cobblemon.mod.common.api.battles.model.PokemonBattle;
import com.cobblemon.mod.common.battles.*;
import com.cobblemon.mod.common.entity.pokemon.PokemonEntity;
import com.google.gson.*;
import net.fabricmc.api.ModInitializer;
import net.fabricmc.fabric.api.event.lifecycle.v1.ServerTickEvents;
import java.nio.file.*;
import java.util.*;

/** Test-only mod, excluded from the distribution. All work is guarded by gameDir. */
public final class LiveBattleFixture implements ModInitializer {
 private final JsonObject report=new JsonObject();
 private final JsonArray checks=new JsonArray();
 private PokemonBattle battle;
 private PokemonEntity wild;
 private UUID last;
 private int phase,ticks,step,delay,ready,completed,chatBeforeCure,acted;
 private long revisionBefore;
 private java.util.concurrent.CompletableFuture<Void> reload;
 private com.cobblemon.mod.common.pokemon.Pokemon second;
 private net.minecraft.class_1297 trainerMob;
 private String rctPath;
 private String override;
 private boolean creating,finished;
 private final boolean abilityMode=Boolean.getBoolean("rejuvenation.verifyAbilities");
 private final boolean extendedMode=Boolean.getBoolean("rejuvenation.verifyExtended");
 private final Path output=Path.of("rejuvenation/research/live-battle.json");
 @Override public void onInitialize(){
  var location=Path.of("").toAbsolutePath().normalize();
  if(!location.endsWith(Path.of("rejuvenation/integration/game")))throw new IllegalStateException("Live fixture requires isolated gameDir");
  if(Boolean.getBoolean("rejuvenation.verifyStatuses"))phase=5;
  if(abilityMode)phase=7;
  if(extendedMode)phase=10;
  report.addProperty("isolatedGameDir",location.toString());report.add("checks",checks);
  if(Boolean.getBoolean("rejuvenation.verifyIntegration")){
   // 0.2.0 integration checks replace the phase sequence below.
   finished=true;var integration=new IntegrationChecks();ServerTickEvents.END_SERVER_TICK.register(integration::tick);return;
  }
  CobblemonEvents.BATTLE_STARTED_PRE.subscribe(Priority.NORMAL,(java.util.function.Consumer<BattleStartedEvent.Pre>) event->{
   if(creating && override!=null)FieldApi.select(event.getBattle().getBattleId(),FieldApi.Priority.EXPLICIT,override);
  });
  ServerTickEvents.END_SERVER_TICK.register(server->{
   if(finished)return;
   try{
    if(server.method_3760().method_14571().isEmpty() || RejuvenationFields.catalog.revision()==0)return;
    if(ready++<200)return;
    if(++ticks>1600)throw new IllegalStateException("Live battle fixture timeout in phase "+phase+", step "+step);
    if(delay-->0)return;
    if(battle==null){
     if(last!=null){if(FieldApi.current(last).isPresent())return;checks.add("Ended battle state removed");last=null;}
     if(phase==(extendedMode?17:abilityMode?10:7)){finish(null);return;}
     var player=server.method_3760().method_14571().getFirst();var world=player.method_51469();
     if(phase==11){
      // Cobblemon rebuilds its ability registry on every data reload; declared abilities must survive it.
      if(reload==null){revisionBefore=RejuvenationFields.catalog.revision();reload=server.method_29439(server.method_3836().method_29210());return;}
      if(!reload.isDone())return;
      reload.join();reload=null;
      if(RejuvenationFields.catalog.revision()<=revisionBefore)throw new IllegalStateException("Data reload did not reload the field catalog");
      probeAbilities(player);
      checks.add("Declared source abilities and Shadow type survive a live data reload of Cobblemon's ability registry");
      phase++;ticks=0;delay=30;return;
     }
     if(phase==16){
      // Real RCT path: Brock's registered NPC battles the player through RCT's own BattleManager.
      // No fixture selection is made; only the trainer bridge may choose the field.
      Object api=null,npc=null;
      for(Object entry:((java.util.stream.Stream<?>)Class.forName("com.gitlab.srcmc.rctapi.api.RCTApi").getMethod("getInstances").invoke(null)).toList()){
       Object instance=((Map.Entry<?,?>)entry).getValue(),registry=instance.getClass().getMethod("getTrainerRegistry").invoke(instance);
       Object trainer=registry.getClass().getMethod("getById",String.class).invoke(registry,"kanto_brock");
       if(trainer!=null){api=instance;npc=trainer;break;}
      }
      if(npc==null)throw new IllegalStateException("RCT did not register kanto_brock");
      var party=com.cobblemon.mod.common.Cobblemon.INSTANCE.getStorage().getParty(player);
      if(party.occupied()==0){var lead=new PokemonProperties();lead.setSpecies("mew");lead.setLevel(60);lead.setMoves(List.of("splash"));party.add(lead.create(player));}
      // A real Brock trainer mob next to the player, as RCT spawns it.
      Class<?> mobClass=Class.forName("com.gitlab.srcmc.rctmod.world.entities.TrainerMob");
      trainerMob=(net.minecraft.class_1297)((net.minecraft.class_1299<?>)mobClass.getMethod("getEntityType").invoke(null)).method_5883(world);
      mobClass.getMethod("setTrainerId",String.class).invoke(trainerMob,"kanto_brock");
      trainerMob.method_5814(player.method_23317()+2,player.method_23318(),player.method_23321());world.method_8649(trainerMob);
      Object rct=Class.forName("com.gitlab.srcmc.rctmod.api.RCTMod").getMethod("getInstance").invoke(null);
      rctPath="RCTMod.makeBattle";
      boolean started=(boolean)rct.getClass().getMethod("makeBattle",mobClass,net.minecraft.class_1657.class).invoke(rct,trainerMob,player);
      if(!started){
       // RCT progression rules can refuse a fresh test player; start the same registered team through the RCT API instead.
       rctPath="RCT BattleManager";
       npc.getClass().getMethod("setEntity",net.minecraft.class_1309.class).invoke(npc,trainerMob);
       Object registry=api.getClass().getMethod("getTrainerRegistry").invoke(api);
       Object me=registry.getClass().getMethod("registerPlayer",String.class,net.minecraft.class_3222.class).invoke(registry,"rejuvenation_fixture",player);
       Object manager=api.getClass().getMethod("getBattleManager").invoke(api);
       Class<?> trainerType=Class.forName("com.gitlab.srcmc.rctapi.api.trainer.Trainer");
       if(!(boolean)manager.getClass().getMethod("startSingle",trainerType,trainerType).invoke(manager,me,npc))throw new IllegalStateException("RCT refused the Brock battle through both paths");
      }
      battle=com.cobblemon.mod.common.battles.BattleRegistry.getBattleByParticipatingPlayer(player);
      if(battle==null)throw new IllegalStateException("RCT battle did not start");
      override=RejuvenationFields.catalog.data().getAsJsonObject("trainers").getAsJsonObject("kanto_brock").get("field").getAsString();
      step=0;delay=20;return;
     }
     var properties=new PokemonProperties();properties.setSpecies("mew");properties.setLevel(60);properties.setMoves(List.of("growth","iondeluge","psychic"));
     if(phase==5)properties.setMoves(List.of("bitterblade","purify","splash"));
     if(phase==6)properties.setMoves(List.of("magicpowder","splash"));
     if(phase==1)properties.setHeldItem("cobblemon:everstone");
     if(phase==2)properties.setHeldItem("rejuvenation:elemental_seed");
     if(phase==7){
      probeAbilities(player);
      checks.add("All declared source abilities and Shadow type resolve in the live Java registries");
      properties.setAbility("tempest");properties.setMoves(List.of("weatherball","splash"));
     }
     if(phase==8){properties.setAbility("defragment");properties.setMoves(List.of("zapcannon","splash"));}
     if(phase==9)properties.setMoves(List.of("shadowball","splash"));
     if(phase==10){properties.setAbility("magicguard");properties.setMoves(List.of("splash"));}
     if(phase==12)properties.setMoves(List.of("tailwind","splash"));
     if(phase==13)properties.setMoves(List.of("splash"));
     if(phase==14)properties.setMoves(List.of("revivalblessing","splash"));
     if(phase==15){
      properties.setHeldItem("mega_showdown:mewnium_z");properties.setMoves(List.of("psychic","splash"));
      // Mega Showdown grants Cobblemon's Z key item only while a Z-Ring is held or worn.
      var ring=new net.minecraft.class_1799(net.minecraft.class_7923.field_41178.method_10223(net.minecraft.class_2960.method_60655("mega_showdown","z_ring")));
      if(ring.method_7960())throw new IllegalStateException("Mega Showdown Z-Ring item missing");
      player.method_6122(net.minecraft.class_1268.field_5808,ring);
      Class.forName("com.github.yajatkaul.mega_showdown.gimmick.GimmickTurnCheck").getMethod("check",net.minecraft.class_3222.class).invoke(null,player);
     }
     var pokemon=properties.create(player);var party=com.cobblemon.mod.common.Cobblemon.INSTANCE.getStorage().getParty(player);party.clearParty();party.add(pokemon);
     // Avoid waiting on a send-out animation in an unattended client. -1 below
     // disables native distance fleeing for this isolated mechanics fixture.
     if(pokemon.sendOut(world,new net.minecraft.class_243(player.method_23317()-3,player.method_23318(),player.method_23321()),null,entity->kotlin.Unit.INSTANCE)==null)throw new IllegalStateException("Fixture lead was not sent out");
     second=null;acted=0;
     if(phase==13 || phase==14){
      var reserve=new PokemonProperties();reserve.setSpecies("snorlax");reserve.setLevel(60);reserve.setAbility("thickfat");reserve.setMoves(List.of("splash"));
      second=reserve.create(player);if(phase==14)second.setCurrentHealth(0);party.add(second);
     }
     var enemy=new PokemonProperties();enemy.setSpecies("magikarp");enemy.setLevel(60);enemy.setMoves(List.of("splash"));wild=enemy.createEntity(world);
     if(phase==13)enemy.setMoves(List.of("spikes","splash"));
     if(phase>=5){wild.method_31472();enemy.setSpecies("blissey");enemy.setLevel(100);wild=enemy.createEntity(world);}
     if(phase==9){wild.method_31472();enemy.setSpecies("mew");enemy.setAbility("souleater");wild=enemy.createEntity(world);}
     wild.method_5814(player.method_23317()+3,player.method_23318(),player.method_23321());wild.method_5875(true);wild.method_5977(true);world.method_8649(wild);
     wild.getPokemon().setState(new com.cobblemon.mod.common.pokemon.activestate.SentOutState(wild));
     override=switch(phase){case 0->null;case 1->"rejuvenation:forest";case 2->"rejuvenation:electric_terrain";case 3->"rejuvenation:water_surface";case 5->"rejuvenation:deux_finalis";case 6->"rejuvenation:haunted";case 7,8,9->"rejuvenation:indoor";case 10->"rejuvenation:colosseum";case 12->"rejuvenation:mountain";case 13->"rejuvenation:electric_terrain";case 14->"rejuvenation:holy";case 15->"rejuvenation:cave";default->"rejuvenation:dark_crystal_cavern";};
     creating=true;
     BattleStartResult result;
     try{result=BattleBuilder.INSTANCE.pve(player,wild,pokemon.getUuid(),BattleFormat.Companion.getGEN_9_SINGLES(),false,false,-1f,party);}finally{creating=false;}
     if(!(result instanceof SuccessfulBattleStart success))throw new IllegalStateException("Battle start rejected: "+result);
     battle=success.getBattle();RejuvenationFields.LOG.info("Live fixture started phase {} battle {}",phase,battle.getBattleId());step=0;delay=20;return;
    }
    if(battle.getEnded())throw new IllegalStateException("Fixture battle ended early: "+battle.getChatLog());
    var snapshot=FieldApi.current(battle.getBattleId());
    if(snapshot.isEmpty() || !snapshot.get().has("counters") || !battle.getStarted() || battle.getTurn()<1)return;
    if(step==0){
     String field=snapshot.get().get("field").getAsString();if(override!=null && !override.equals(field))throw new IllegalStateException("Explicit field failed: "+field);
     String text=RejuvenationFields.catalog.data().getAsJsonObject("fields").getAsJsonObject(field).get("entryMessage").getAsString().replace("|","");
     if(!text.isEmpty() && battle.getChatLog().stream().noneMatch(c->c.getString().contains(text)))return;
     checks.add((phase==0?"Natural environment":phase==16?"Trainer-mapped":"Explicit")+" initialized "+field+" with ordered entry chat");
     if(phase==0){end();return;}
     if(phase==16){
      if(!battle.isPvN())throw new IllegalStateException("RCT battle is not a trainer battle");
      checks.add("Live RCT Kanto Brock battle ("+rctPath+") starts on its assigned "+override+" through the trainer bridge alone");end();return;
     }
     if(phase==10){
      // Battle_Effects.rb:836-838: a field-ability stat change names its cause in one line.
      if(said("magical power raised its Sp. Def")!=1)throw new IllegalStateException("Colosseum Magic Guard flavor missing or repeated: "+chat());
      if(battle.getChatLog().stream().anyMatch(c->c.getString().contains(" rose")))throw new IllegalStateException("Generic stat-rise chat was not withheld: "+chat());
      if(battle.getBattleLog().stream().flatMap(String::lines).noneMatch(s->s.startsWith("|-boost|") && s.contains("|spd|1") && s.contains("[rejuvenationsilent]")))throw new IllegalStateException("Native boost packet absent or unmarked");
      noRawKeys();
      checks.add("Live BoostMessageMixin keeps the native Colosseum Magic Guard boost and shows only the original flavor line");end();return;
     }
     if(phase==12){if(!act("tailwind",null,false,"splash"))return;step=30;delay=40;return;}
     if(phase==13){if(!act("splash",null,false,"spikes"))return;step=40;delay=40;return;}
     if(phase==14){if(!act("revivalblessing",null,false,"splash"))return;step=50;delay=20;return;}
     if(phase==15){
      var player=playerActor();if(player.getRequest()==null)return;
      var zmoves=player.getRequest().getActive().getFirst().getCanZMove();
      if(zmoves==null || zmoves.stream().noneMatch(Objects::nonNull))throw new IllegalStateException("Genesis Supernova was not offered as a Z-Move");
      if(!act("psychic","zmove",true,"splash"))return;step=60;delay=40;return;
     }
     if(phase>=7){if(!choose(phase==7?"weatherball":phase==8?"zapcannon":"shadowball"))return;step=20;delay=60;return;}
     if(phase>=5){if(!choose(phase==5?"bitterblade":"magicpowder"))return;step=10;delay=60;return;}
     if(phase>=3){
      var player=server.method_3760().method_14571().getFirst();var world=player.method_51469();
      var ball=phase==3?com.cobblemon.mod.common.api.pokeball.PokeBalls.getDiveBall():com.cobblemon.mod.common.api.pokeball.PokeBalls.getDuskBall();
      var projectile=new com.cobblemon.mod.common.entity.pokeball.EmptyPokeBallEntity(world);projectile.setPokeBall(ball);
      var event=new com.cobblemon.mod.common.api.events.pokeball.PokemonCatchRateEvent(player,projectile,wild,47);
      CobblemonEvents.POKEMON_CATCH_RATE.emit(event);
      var modifier=ball.getCatchRateModifier();float nativeMultiplier=modifier.isValid(player,wild.getPokemon())?modifier.value(player,wild.getPokemon()):1;
      if(Math.abs(event.getCatchRate()*nativeMultiplier-164)>.001)throw new IllegalStateException("Capture event did not replace native multiplier: "+event.getCatchRate()+", native="+nativeMultiplier);
      checks.add("Live "+ball.getName()+" capture event applies source 3.5 multiplier once with integer rounding");end();return;
     }
     if(phase==2){
      if(battle.getBattleLog().stream().noneMatch(s->s.contains("|-enditem|") && s.contains("Elemental Seed")))return;
      if(battle.getBattleLog().stream().noneMatch(s->s.contains("|-boost|") && s.contains("|spe|1")))throw new IllegalStateException("Seed speed boost absent");
      checks.add("Minecraft held Seed activates, consumes and boosts in live simulator");end();return;
     }
     if(!choose("growth"))return;step=1;delay=60;return;
    }
    if(step==20 && battle.getTurn()>=2){
     String logs=String.join("\n",battle.getBattleLog());
     if(phase==7){
      long messages=battle.getChatLog().stream().filter(c->c.getString().contains("Storm-9")).count();
      if(messages<2)throw new IllegalStateException("Storm weather messages missing: "+battle.getChatLog());
      if(!logs.contains("|-weather|") || !logs.contains("[rejuvenationsilent]"))throw new IllegalStateException("Native weather context marker absent");
      if(battle.getChatLog().stream().anyMatch(c->List.of("It started to rain!","It started to hail!","A sandstorm kicked up!","A shadowy aura filled the sky!").contains(c.getString())))throw new IllegalStateException("Generic weather activation duplicated original Storm text");
      checks.add("Live Storm 9 sets and rotates weather with original messages and silent native context updates");
     }else if(phase==8){
      if(logs.contains("|-miss|"))throw new IllegalStateException("Defragment perfect accuracy failed");
      if(!logs.contains("|-boost|") || !logs.contains("|spd|1"))throw new IllegalStateException("Defragment entry boost absent");
      checks.add("Live Defragment entry and accuracy callbacks run through the registered ability");
     }else{
      if(!battle.getChatLog().stream().anyMatch(c->c.getString().contains("It doesn't affect")))throw new IllegalStateException("Soul Eater absorption text missing: "+battle.getChatLog());
      checks.add("Live Soul Eater absorbs Ghost attacks and dispatches its original full-HP message");
     }
     end();return;
    }
    if(step==30 && battle.getTurn()>=2){
     // pbSetTailwind (Battle.rb:746-749): timed strong winds with original start and end text.
     if(said("Strong winds kicked up around the field!")!=1)throw new IllegalStateException("Timed strong-winds start text missing or repeated: "+chat());
     noRawKeys();
     if(said("The strong wind petered out.")>0){
      if(battle.getTurn()<6)throw new IllegalStateException("Timed strong winds ended early on turn "+battle.getTurn());
      checks.add("Live Mountain Tailwind starts timed strong winds and ends them with the original text and no generic weather chat");end();return;
     }
     if(battle.getTurn()>12)throw new IllegalStateException("Timed strong winds never ended");
     if(battle.getTurn()>acted && act("splash",null,false,"splash"))acted=battle.getTurn();
     return;
    }
    if(step==40 && battle.getTurn()>=2){
     if(!act(new SwitchActionResponse(second.getUuid()),"splash"))return;
     step=41;delay=40;return;
    }
    if(step==41 && battle.getTurn()>=3){
     // Battle.rb:3176-3191: Electric Terrain electrifies Spikes for every incoming Pokemon.
     if(said("was hurt by the electrified spikes!")!=1)throw new IllegalStateException("Electrified spikes text missing or repeated: "+chat());
     if(said("was hurt by the spikes!")>0)throw new IllegalStateException("Generic spikes chat duplicated the field text");
     var reserve=battlePokemon(second.getUuid());int expected=reserve.getMaxHealth()-reserve.getMaxHealth()/8;
     if(reserve.getHealth()!=expected)throw new IllegalStateException("Electrified spikes dealt "+(reserve.getMaxHealth()-reserve.getHealth())+" instead of 1/8");
     noRawKeys();
     checks.add("Live Electric Terrain entry hazard electrifies Spikes with source damage and text on a real switch");end();return;
    }
    if(step==50){
     // Revival Blessing asks the player to pick the fainted ally mid-turn.
     var player=playerActor();var request=player.getRequest();
     if(request==null || request.getForceSwitch()==null || !request.getForceSwitch().contains(true) || !player.getMustChoose())return;
     player.setResponses(new ArrayList<>(List.of(new SwitchActionResponse(second.getUuid()))));player.setMustChoose(false);battle.checkForInputDispatch();
     step=51;delay=20;return;
    }
    if(step==51){
     if(said("was revived")==0)return;
     // pbReviveDefeated (Battle.rb:2054): Holy Field revives at three quarters.
     var revived=battlePokemon(second.getUuid());int expected=revived.getMaxHealth()*3/4;
     if(revived.getHealth()!=expected)throw new IllegalStateException("Holy Revival Blessing restored "+revived.getHealth()+"/"+revived.getMaxHealth()+" instead of "+expected);
     noRawKeys();
     checks.add("Live Holy Field Revival Blessing revives the fainted ally at three-quarter HP");end();return;
    }
    if(step==60 && battle.getTurn()>=2){
     // Battle_ZMove.rb:322-332: Genesis Supernova sets a flat five-turn Psychic Terrain.
     if(battle.getBattleLog().stream().noneMatch(s->s.contains("|Genesis Supernova|")))throw new IllegalStateException("Genesis Supernova was not used");
     var state=snapshot.get();
     if(!"rejuvenation:psychic_terrain".equals(state.get("overlay").isJsonNull()?null:state.get("overlay").getAsString()))throw new IllegalStateException("Genesis Supernova terrain overlay missing: "+state);
     if(state.get("overlayDuration").getAsInt()!=4)throw new IllegalStateException("Genesis Supernova terrain duration "+state.get("overlayDuration")+" after one round, expected 4");
     if(said("Psychic energy spread across the battlefield!")!=1)throw new IllegalStateException("Psychic Terrain creation text missing: "+chat());
     noRawKeys();
     checks.add("Live Mewnium Z Genesis Supernova creates the source five-turn Psychic Terrain on Cave");end();return;
    }
    if(step==10 && battle.getTurn()>=2){
     var affected=enemyPokemon();
     var container=affected.getStatus();if(container==null)throw new IllegalStateException("Live field status not applied to battle Pokemon");
     if(phase==5){
      if(!(container.getStatus() instanceof FieldPersistentStatus) || !container.getStatus().getShowdownName().equals("ptr"))throw new IllegalStateException("Petrification did not use registered persistent status");
      if(container.getSecondsLeft()<1000000)throw new IllegalStateException("Petrification has a passive expiry clock");
      if(battle.getBattleLog().stream().noneMatch(s->s.contains("|-unboost|") && s.contains("|spe|1")))throw new IllegalStateException("Petrification residual Speed loss absent");
      checks.add("Live Deux Finalis Bitter Blade applies registered persistent Petrification and residual Speed loss");
      if(!choose("purify"))return;step=11;delay=60;return;
     }
     if(!container.getStatus().getShowdownName().equals("slp"))throw new IllegalStateException("Magic Powder did not apply sleep");
     if(battle.getChatLog().stream().filter(c->c.getString().contains("was put to sleep!")).count()!=1)throw new IllegalStateException("Source-specific sleep text missing or duplicated: "+battle.getChatLog());
     if(battle.getChatLog().stream().anyMatch(c->c.getString().contains("fell asleep")))throw new IllegalStateException("Canonical sleep chat was not suppressed");
     checks.add("Live Haunted Magic Powder keeps native sleep state/packets and emits source-specific text once");
     String statusLine=battle.getBattleLog().stream().flatMap(String::lines).filter(s->s.startsWith("|-status|") && s.contains("|slp")).reduce((a,c)->c).orElseThrow();
     chatBeforeCure=battle.getChatLog().size();
     // Focused instruction test: preserve its native state/packet updates while
     // suppressing chat only. The owned battle ends immediately afterwards.
     new com.cobblemon.mod.common.battles.interpreter.instructions.CureStatusInstruction(new com.cobblemon.mod.common.api.battles.interpreter.BattleMessage("|-curestatus|"+statusLine.split("\\|")[2]+"|slp|[rejuvenationsilent]")).invoke(battle);
     step=12;delay=30;return;
    }
    if(step==11 && battle.getTurn()>=3){
     var affected=enemyPokemon();
     if(affected.getStatus()!=null)throw new IllegalStateException("Native Purify failed to cure persistent Petrification");
     checks.add("Live Purify cures Petrification through canonical Java status removal");end();return;
    }
    if(step==12){
     var affected=enemyPokemon();
     if(affected.getStatus()!=null)throw new IllegalStateException("Silent cure instruction did not remove persistent sleep");
     if(battle.getChatLog().size()!=chatBeforeCure)throw new IllegalStateException("Silent cure instruction emitted duplicate chat");
     checks.add("Live silent cure marker preserves native removal and suppresses only canonical chat");end();return;
    }
    if(step==1 && battle.getTurn()>=2){
     if(battle.getBattleLog().stream().noneMatch(s->s.contains("|-boost|") && s.contains("|atk|2")))throw new IllegalStateException("Forest Growth +2 absent");
     if(!choose("iondeluge"))return;
     checks.add("Live Forest Growth boosts Attack by two stages");step=2;delay=60;return;
    }
    if(step==2 && battle.getTurn()>=3){
     if(!snapshot.get().get("overlay").isJsonNull())throw new IllegalStateException("Everstone failed to prevent terrain");
     checks.add("Existing Minecraft Everstone bridges to simulator and blocks Ion Deluge terrain creation");end();
    }
   }catch(Throwable error){finish(error);}
  });
 }
 private void probeAbilities(net.minecraft.class_3222 player){
  for(String id:RejuvenationFields.catalog.data().getAsJsonObject("abilities").keySet()){
   var probe=new PokemonProperties();probe.setSpecies("mew");probe.setAbility(id);
   if(!probe.create(player).getAbility().getName().equals(id))throw new IllegalStateException("Java ability template missing: "+id);
  }
  if(com.cobblemon.mod.common.api.types.ElementalTypes.get("shadow")==null)throw new IllegalStateException("Java Shadow type missing");
 }
 private long said(String text){return battle.getChatLog().stream().filter(c->c.getString().contains(text)).count();}
 private String chat(){return battle.getChatLog().stream().map(c->c.getString()).toList().toString();}
 /** An untranslated Cobblemon key in chat means a native message escaped the field text replacement. */
 private void noRawKeys(){for(var c:battle.getChatLog())if(c.getString().contains("cobblemon.battle."))throw new IllegalStateException("Untranslated battle chat: "+c.getString());}
 private com.cobblemon.mod.common.api.battles.model.actor.BattleActor playerActor(){for(var actor:battle.getActors())if(actor.getPlayerUUIDs().iterator().hasNext())return actor;throw new IllegalStateException("Missing player actor");}
 private com.cobblemon.mod.common.battles.pokemon.BattlePokemon battlePokemon(UUID id){for(var actor:battle.getActors())for(var pokemon:actor.getPokemonList())if(pokemon.getUuid().equals(id))return pokemon;throw new IllegalStateException("Missing battle Pokemon "+id);}
 private boolean act(String move,String gimmick,boolean targeted,String wildMove){
  String target=null;
  if(targeted)for(var enemy:battle.getActors())if(!enemy.getPlayerUUIDs().iterator().hasNext())target=enemy.getActivePokemon().getFirst().getPNX();
  return act(new MoveActionResponse(move,target,gimmick),wildMove);
 }
 /** Like choose(), with any player response and a chosen wild move. */
 private boolean act(ShowdownActionResponse playerResponse,String wildMove){
  for(var actor:battle.getActors())if(actor.getRequest()==null || (actor.getPlayerUUIDs().iterator().hasNext() && !actor.getMustChoose()))return false;
  for(var actor:battle.getActors()){
   var response=actor.getPlayerUUIDs().iterator().hasNext()?playerResponse:new MoveActionResponse(wildMove,null,null);
   if(!response.isValid(actor.getActivePokemon().getFirst(),actor.getRequest().getActive().getFirst(),false))throw new IllegalStateException("Invalid fixture choice "+response);
   actor.setResponses(new ArrayList<>(List.of(response)));actor.setMustChoose(false);
  }
  battle.checkForInputDispatch();
  return true;
 }
 private com.cobblemon.mod.common.pokemon.Pokemon enemyPokemon(){for(var actor:battle.getActors())for(var pokemon:actor.getPokemonList())if(pokemon.getEffectedPokemon().getUuid().equals(wild.getPokemon().getUuid()))return pokemon.getEffectedPokemon();throw new IllegalStateException("Missing owned wild Pokemon");}
 private boolean choose(String move){
  // Supply both fixture-owned actors; wild AI can wait on entity animation
  // and this test-only entity deliberately has overworld AI disabled.
  for(var actor:battle.getActors())if(actor.getRequest()==null || (actor.getPlayerUUIDs().iterator().hasNext() && !actor.getMustChoose()))return false;
  for(var actor:battle.getActors()){
   boolean playerActor=actor.getPlayerUUIDs().iterator().hasNext();
   String target=null;
   if(phase>=5 && playerActor)for(var enemy:battle.getActors())if(!enemy.getPlayerUUIDs().iterator().hasNext())target=enemy.getActivePokemon().getFirst().getPNX();
   var response=new MoveActionResponse(playerActor?move:"splash",target,null);
   if(!response.isValid(actor.getActivePokemon().getFirst(),actor.getRequest().getActive().getFirst(),false))throw new IllegalStateException("Invalid fixture move choice "+response);
   // setActionResponses dispatches immediately. Populate both actors before
   // dispatch to avoid flushing the player and clearing the wild request first.
   actor.setResponses(new ArrayList<>(List.of(response)));actor.setMustChoose(false);
  }
  battle.checkForInputDispatch();
  return true;
 }
 private void end(){last=battle.getBattleId();battle.stop();battle=null;if(wild!=null)wild.method_31472();wild=null;if(trainerMob!=null)trainerMob.method_31472();trainerMob=null;phase++;completed++;delay=30;ticks=0;}
 private void finish(Throwable error){
  finished=true;report.addProperty("success",error==null);report.addProperty("battles",completed);
  if(error!=null){report.addProperty("error",error.toString());if(battle!=null){report.addProperty("turn",battle.getTurn());report.add("battleLog",new Gson().toJsonTree(battle.getBattleLog()));}RejuvenationFields.LOG.error("Live verification failed",error);}
  try{Files.createDirectories(output.getParent());Files.writeString(output,new GsonBuilder().setPrettyPrinting().create().toJson(report));}catch(Exception e){throw new RuntimeException(e);}
 }
}
