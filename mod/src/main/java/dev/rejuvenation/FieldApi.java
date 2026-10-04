package dev.rejuvenation;

import com.cobblemon.mod.common.api.battles.model.PokemonBattle;
import com.cobblemon.mod.common.api.battles.model.actor.EntityBackedBattleActor;
import com.google.gson.*;
import net.minecraft.class_1297;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/** Set selections before BattleRegistry starts the Showdown battle. No trainer edits. */
public final class FieldApi {
    private FieldApi() {}
    public enum Priority { ARENA, TRAINER, EXPLICIT }
    public record Resolution(String field, boolean enabled) {}
    public record RuleOptions(int difficultyMode,boolean fieldFrenzy) {
        public RuleOptions { if(difficultyMode<0 || difficultyMode>2)throw new IllegalArgumentException("Difficulty mode must be 0, 1 or 2"); }
        public JsonObject json(){var result=new JsonObject();result.addProperty("difficultyMode",difficultyMode);result.addProperty("fieldFrenzy",fieldFrenzy);return result;}
    }
    private static final Map<UUID, EnumMap<Priority,String>> pending = new ConcurrentHashMap<>();
    private static final Map<UUID,String> natural = new ConcurrentHashMap<>();
    private static final Map<UUID,JsonObject> active = new ConcurrentHashMap<>();
    private static final Map<UUID,Map<String,Map<String,Double>>> captureSnapshots = new ConcurrentHashMap<>();
    private static final Map<UUID,RuleOptions> ruleOptions = new ConcurrentHashMap<>();
    private static final Map<UUID,Boolean> submerged = new ConcurrentHashMap<>();
    private static final Map<UUID,Map<String,List<JsonObject>>> captureEnvironmentSnapshots = new ConcurrentHashMap<>();
    public static void configure(UUID battle,RuleOptions options){ruleOptions.put(battle,Objects.requireNonNull(options));}
    public static Optional<RuleOptions> consumeOptions(UUID battle){return Optional.ofNullable(ruleOptions.remove(battle));}
    public static Optional<JsonObject> current(UUID battle) { return Optional.ofNullable(active.get(battle)).map(JsonObject::deepCopy); }
    // Dispatch can deliver the last simulator instruction after endBattle has
    // cleared this entry. Never recreate closed battle state from a late packet.
    public static void update(UUID battle,String json) { active.computeIfPresent(battle,(key,previous)->JsonParser.parseString(json).getAsJsonObject()); }
    public static void select(UUID battle, Priority priority, String field) {
        var definitions=RejuvenationFields.catalog.data().getAsJsonObject("fields");
        if (definitions==null || !definitions.has(field)) throw new IllegalArgumentException("Unknown or not yet loaded field " + field);
        pending.compute(battle, (key, values) -> {
            var next = values == null ? new EnumMap<Priority,String>(Priority.class) : new EnumMap<>(values);
            next.put(priority, field); return next;
        });
    }
    public static void clear(UUID battle) { pending.remove(battle); natural.remove(battle); active.remove(battle); captureSnapshots.remove(battle); ruleOptions.remove(battle); submerged.remove(battle);captureEnvironmentSnapshots.remove(battle); }
    public static void clearAll() { pending.clear(); natural.clear(); active.clear(); captureSnapshots.clear(); ruleOptions.clear();submerged.clear();captureEnvironmentSnapshots.clear(); }
    static void captureEnvironment(UUID battle,boolean underwater){submerged.put(battle,underwater);}
    static void begin(UUID battle,String field,JsonObject catalog){
        var snapshot=new HashMap<String,Map<String,Double>>();
        var environments=new HashMap<String,List<JsonObject>>();
        for(var entry:catalog.getAsJsonObject("fields").entrySet()){
            var modifiers=new HashMap<String,Double>();var definition=entry.getValue().getAsJsonObject();
            if(definition.has("captureModifiers"))for(var item:definition.getAsJsonObject("captureModifiers").entrySet())modifiers.put(item.getKey(),item.getValue().getAsDouble());
            snapshot.put(entry.getKey(),Map.copyOf(modifiers));
            var rows=new ArrayList<JsonObject>();if(definition.has("captureEnvironmentModifiers"))for(var row:definition.getAsJsonArray("captureEnvironmentModifiers"))rows.add(row.getAsJsonObject().deepCopy());environments.put(entry.getKey(),List.copyOf(rows));
        }
        captureSnapshots.put(battle,Map.copyOf(snapshot));var initial=new JsonObject();initial.addProperty("field",field);active.put(battle,initial);
        captureEnvironmentSnapshots.put(battle,Map.copyOf(environments));
    }
    public static OptionalDouble captureMultiplier(UUID battle,String ball){
        return captureMultiplier(battle,ball,java.time.LocalTime.now().getHour());
    }
    static OptionalDouble captureMultiplier(UUID battle,String ball,int hour){
        if(battle==null)return OptionalDouble.empty();var context=active.get(battle);var snapshot=captureSnapshots.get(battle);
        if(context==null || snapshot==null)return OptionalDouble.empty();
        var values=snapshot.get(context.get("field").getAsString());var multiplier=values==null?null:values.get(ball);
        // Source OR predicates replace the canonical ball bonus once; they do
        // not multiply the field bonus by an additional environmental bonus.
        for(var row:captureEnvironmentSnapshots.getOrDefault(battle,Map.of()).getOrDefault(context.get("field").getAsString(),List.of()))
            if(row.get("ball").getAsString().equals(ball) && switch(row.get("predicate").getAsString()){
                case "underwater" -> submerged.getOrDefault(battle,false);
                case "night" -> hour>=20 || hour<4;
                default -> false;
            })multiplier=row.get("multiplier").getAsDouble();
        return multiplier==null?OptionalDouble.empty():OptionalDouble.of(multiplier);
    }
    public static Resolution choose(Map<Priority,String> selections,String derived,boolean wild) {
        if (selections!=null) for(Priority p:new Priority[]{Priority.EXPLICIT,Priority.TRAINER,Priority.ARENA})
            if(selections.containsKey(p))return new Resolution(selections.get(p),true);
        return new Resolution(wild && derived!=null?derived:"rejuvenation:indoor",wild);
    }
    public static Resolution resolve(PokemonBattle battle, JsonObject catalog) {
        var derived=natural.remove(battle.getBattleId());
        var values = pending.remove(battle.getBattleId());
        var result=choose(values,derived,battle.isPvW());
        if(result.enabled())begin(battle.getBattleId(),result.field(),catalog);
        return result;
    }
    /** Called by the server-thread pre-start event, before simulator work is queued. */
    public static void capture(PokemonBattle battle) {
        if (battle.isPvW()) natural.put(battle.getBattleId(),environment(battle,RejuvenationFields.catalog.data()));
    }
    private static String environment(PokemonBattle battle, JsonObject catalog) {
        if (!catalog.has("mappings")) return "rejuvenation:indoor";
        class_1297 location = null;
        for (var actor : battle.getActors()) if (actor instanceof EntityBackedBattleActor<?> entity && !(entity.getEntity() instanceof net.minecraft.class_1657)) { location=entity.getEntity(); break; }
        if (location == null && !battle.getPlayers().isEmpty()) location = battle.getPlayers().getFirst();
        if (location == null) return "rejuvenation:indoor";
        captureEnvironment(battle.getBattleId(),location.method_5869());
        var world=location.method_37908(); var pos=location.method_24515(); var biome=world.method_23753(pos);
        String biomeId=biome.method_40230().map(k -> k.method_29177().toString()).orElse("");
        String dimension=world.method_27983().method_29177().toString();
        int depth=world.method_8624(net.minecraft.class_2902.class_2903.field_13203,pos.method_10263(),pos.method_10260())-pos.method_10264();
        var tags=biome.method_40228().map(t -> t.comp_327().toString()).toList();
        for (JsonElement element : catalog.getAsJsonArray("mappings")) {
            JsonObject rule=element.getAsJsonObject();
            if (rule.has("biome") && !rule.get("biome").getAsString().equals(biomeId)) continue;
            if (rule.has("tag") && !tags.contains(rule.get("tag").getAsString())) continue;
            if (rule.has("dimension") && !rule.get("dimension").getAsString().equals(dimension)) continue;
            if (rule.has("submerged") && rule.get("submerged").getAsBoolean()!=location.method_5869()) continue;
            if (rule.has("maxY") && pos.method_10264()>rule.get("maxY").getAsInt()) continue;
            if (rule.has("minDepth") && depth<rule.get("minDepth").getAsInt()) continue;
            if (rule.has("skyVisible") && rule.get("skyVisible").getAsBoolean()!=world.method_8311(pos)) continue;
            return rule.get("field").getAsString();
        }
        return catalog.get("default").getAsString();
    }
}
