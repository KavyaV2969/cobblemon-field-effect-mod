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
 private int phase,ticks,step,delay,ready,completed,chatBeforeCure;
 private String override;
 private boolean creating,finished;
 private final boolean abilityMode=Boolean.getBoolean("rejuvenation.verifyAbilities");
 private final Path output=Path.of("rejuvenation/research/live-battle.json");
 @Override public void onInitialize(){
  var location=Path.of("").toAbsolutePath().normalize();
  if(!location.endsWith(Path.of("rejuvenation/integration/game")))throw new IllegalStateException("Live fixture requires isolated gameDir");
  if(Boolean.getBoolean("rejuvenation.verifyStatuses"))phase=5;
  if(abilityMode)phase=7;
  report.addProperty("isolatedGameDir",location.toString());report.add("checks",checks);
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
     if(phase==(abilityMode?10:7)){finish(null);return;}
     var player=server.method_3760().method_14571().getFirst();var world=player.method_51469();
     var properties=new PokemonProperties();properties.setSpecies("mew");properties.setLevel(60);properties.setMoves(List.of("growth","electricterrain","psychic"));
     if(phase==5)properties.setMoves(List.of("bitterblade","purify","splash"));
     if(phase==6)properties.setMoves(List.of("magicpowder","splash"));
     if(phase==1)properties.setHeldItem("cobblemon:everstone");
     if(phase==2)properties.setHeldItem("rejuvenation:elemental_seed");
     if(phase==7){
      for(String id:RejuvenationFields.catalog.data().getAsJsonObject("abilities").keySet()){
       var probe=new PokemonProperties();probe.setSpecies("mew");probe.setAbility(id);
       if(!probe.create(player).getAbility().getName().equals(id))throw new IllegalStateException("Java ability template missing: "+id);
      }
      if(com.cobblemon.mod.common.api.types.ElementalTypes.get("shadow")==null)throw new IllegalStateException("Java Shadow type missing");
      checks.add("All declared source abilities and Shadow type resolve in the live Java registries");
      properties.setAbility("tempest");properties.setMoves(List.of("weatherball","splash"));
     }
     if(phase==8){properties.setAbility("defragment");properties.setMoves(List.of("zapcannon","splash"));}
     if(phase==9)properties.setMoves(List.of("shadowball","splash"));
     var pokemon=properties.create(player);var party=new PlayerPartyStore(player.method_5667());party.add(pokemon);
     var enemy=new PokemonProperties();enemy.setSpecies("magikarp");enemy.setLevel(60);enemy.setMoves(List.of("splash"));wild=enemy.createEntity(world);
     if(phase>=5){wild.method_31472();enemy.setSpecies("blissey");enemy.setLevel(100);wild=enemy.createEntity(world);}
     if(phase==9){wild.method_31472();enemy.setSpecies("mew");enemy.setAbility("souleater");wild=enemy.createEntity(world);}
     wild.method_5814(player.method_23317()+3,player.method_23318(),player.method_23321());wild.method_5875(true);wild.method_5977(true);world.method_8649(wild);
     override=switch(phase){case 0->null;case 1->"rejuvenation:forest";case 2->"rejuvenation:electric_terrain";case 3->"rejuvenation:water_surface";case 5->"rejuvenation:deux_finalis";case 6->"rejuvenation:haunted";case 7,8,9->"rejuvenation:indoor";default->"rejuvenation:dark_crystal_cavern";};
     creating=true;
     BattleStartResult result;
     try{result=BattleBuilder.INSTANCE.pve(player,wild,pokemon.getUuid(),BattleFormat.Companion.getGEN_9_SINGLES(),false,false,32f,party);}finally{creating=false;}
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
     checks.add((phase==0?"Natural environment":"Explicit")+" initialized "+field+" with ordered entry chat");
     if(phase==0){end();return;}
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
     if(!choose("electricterrain"))return;
     checks.add("Live Forest Growth boosts Attack by two stages");step=2;delay=60;return;
    }
    if(step==2 && battle.getTurn()>=3){
     if(!snapshot.get().get("overlay").isJsonNull())throw new IllegalStateException("Everstone failed to prevent terrain");
     checks.add("Existing Minecraft Everstone bridges to simulator and blocks terrain creation");end();
    }
   }catch(Throwable error){finish(error);}
  });
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
 private void end(){last=battle.getBattleId();battle.stop();battle=null;if(wild!=null)wild.method_31472();wild=null;phase++;completed++;delay=30;}
 private void finish(Throwable error){
  finished=true;report.addProperty("success",error==null);report.addProperty("battles",completed);
  if(error!=null){report.addProperty("error",error.toString());if(battle!=null){report.addProperty("turn",battle.getTurn());report.add("battleLog",new Gson().toJsonTree(battle.getBattleLog()));}RejuvenationFields.LOG.error("Live verification failed",error);}
  try{Files.createDirectories(output.getParent());Files.writeString(output,new GsonBuilder().setPrettyPrinting().create().toJson(report));}catch(Exception e){throw new RuntimeException(e);}
 }
}
