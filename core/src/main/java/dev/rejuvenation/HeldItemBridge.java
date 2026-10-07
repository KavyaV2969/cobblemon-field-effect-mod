package dev.rejuvenation;

import com.cobblemon.mod.common.api.battles.model.PokemonBattle;
import com.google.gson.*;
import java.util.*;
import net.minecraft.class_7923;

/** Opted-in battles only: preserve existing Minecraft items absent from the dex. */
public final class HeldItemBridge {
 private HeldItemBridge() {}
 public static void bridge(PokemonBattle battle,String[] messages,JsonObject catalog){
  var minecraftIds=new HashMap<String,String>();
  for(var item:catalog.getAsJsonObject("items").entrySet()){
   var data=item.getValue().getAsJsonObject();if(data.has("minecraftItem"))minecraftIds.put(data.get("minecraftItem").getAsString(),item.getKey());
  }
  var overrides=new HashMap<UUID,String>();
  for(var actor:battle.getActors())for(var pokemon:actor.getPokemonList()){
   var held=pokemon.getEffectedPokemon().heldItemNoCopy$common();
   var mapped=minecraftIds.get(class_7923.field_41178.method_10221(held.method_7909()).toString());
   if(mapped!=null)overrides.put(pokemon.getUuid(),mapped);
  }
  if(overrides.isEmpty())return;
  for(int i=0;i<messages.length;i++)if(messages[i].startsWith(">player ")){
   int offset=messages[i].indexOf('{');if(offset<0)continue;
   var options=JsonParser.parseString(messages[i].substring(offset)).getAsJsonObject();var team=options.get("team");
   if(team!=null && team.isJsonPrimitive()){options.addProperty("team",rewrite(team.getAsString(),overrides));messages[i]=messages[i].substring(0,offset)+options;}
  }
 }
 public static String rewrite(String packed,Map<UUID,String> overrides){
  var rows=packed.split("\\]",-1);
  for(int i=0;i<rows.length;i++){
   // Cobblemon's shipped teams.js adds UUID, health, status and duration before
   // the held item: UUID is slot 2 and item is slot 6, unlike upstream Showdown.
   var parts=rows[i].split("\\|",-1);if(parts.length<7)continue;
   try{var item=overrides.get(UUID.fromString(parts[2]));if(item!=null){parts[6]=item;rows[i]=String.join("|",parts);}}catch(IllegalArgumentException ignored){}
  }
  return String.join("]",rows);
 }
}
