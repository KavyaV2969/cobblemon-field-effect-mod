package dev.rejuvenation;

import com.cobblemon.mod.common.api.battles.model.PokemonBattle;
import com.google.gson.*;
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
    private static final Map<UUID,EnvironmentResolver.Result> natural = new ConcurrentHashMap<>();
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
    public static void clear(UUID battle) { InspectorSync.forget(battle); BattleStartTimings.discard(battle); pending.remove(battle); natural.remove(battle); origins.remove(battle); active.remove(battle); captureSnapshots.remove(battle); ruleOptions.remove(battle); submerged.remove(battle);captureEnvironmentSnapshots.remove(battle); }
    public static void clearAll() { InspectorSync.clear(); pending.clear(); natural.clear(); origins.clear(); active.clear(); captureSnapshots.clear(); ruleOptions.clear();submerged.clear();captureEnvironmentSnapshots.clear(); }
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
    /** Selection precedence: EXPLICIT > TRAINER > ARENA > environment-derived (wild battles only) > Indoor. */
    public static Resolution choose(Map<Priority,String> selections,String derived,boolean wild) {
        if (selections!=null) for(Priority p:new Priority[]{Priority.EXPLICIT,Priority.TRAINER,Priority.ARENA})
            if(selections.containsKey(p))return new Resolution(selections.get(p),true);
        return new Resolution(wild && derived!=null?derived:"rejuvenation:indoor",wild);
    }
    /** Why a battle's initial field was chosen: explicit, trainer, arena, underwater, structure, biome or fallback. */
    public record Origin(String field,String source,String reason) {}
    private static final Map<UUID,Origin> origins = new ConcurrentHashMap<>();
    public static Optional<Origin> origin(UUID battle) { return Optional.ofNullable(origins.get(battle)); }
    public static Resolution resolve(PokemonBattle battle, JsonObject catalog) {
        var derived=natural.remove(battle.getBattleId());
        var values = pending.remove(battle.getBattleId());
        var result=choose(values,derived==null?null:derived.field(),battle.isPvW());
        if(result.enabled()){
            String source=null;
            if(values!=null)for(Priority p:new Priority[]{Priority.EXPLICIT,Priority.TRAINER,Priority.ARENA})if(source==null && values.containsKey(p))source=p.name().toLowerCase(Locale.ROOT);
            origins.put(battle.getBattleId(),source!=null?new Origin(result.field(),source,"Selected before battle start")
                :derived!=null?new Origin(result.field(),derived.source().name().toLowerCase(Locale.ROOT),derived.reason()):new Origin(result.field(),"fallback","No environment captured"));
            begin(battle.getBattleId(),result.field(),catalog);
        }
        return result;
    }
    /** Called by the server-thread pre-start event, before simulator work is queued. */
    public static void capture(PokemonBattle battle) {
        if (!battle.isPvW()) return;
        long start=System.nanoTime();
        var catalog=RejuvenationFields.catalog;
        EnvironmentResolver.Result result;
        if (!catalog.data().has("mappings")) result=new EnvironmentResolver.Result("rejuvenation:indoor",EnvironmentResolver.Source.FALLBACK,"No catalog loaded");
        else {
            var captured=EnvironmentProbe.capture(battle,catalog);
            if(captured==null)result=new EnvironmentResolver.Result("rejuvenation:indoor",EnvironmentResolver.Source.FALLBACK,"No located participant");
            else{captureEnvironment(battle.getBattleId(),captured.anchorSubmerged());result=EnvironmentResolver.resolve(captured.snapshot(),catalog.environment());}
        }
        natural.put(battle.getBattleId(),result);
        BattleStartTimings.environment(battle.getBattleId(),System.nanoTime()-start,result);
    }
}
