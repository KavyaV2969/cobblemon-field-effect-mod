package dev.rejuvenation;

import com.cobblemon.mod.common.battles.ShowdownInterpreter;
import com.google.gson.*;
import kotlin.Unit;
import net.fabricmc.api.ModInitializer;
import net.fabricmc.fabric.api.resource.*;
import net.minecraft.class_2561;
import net.minecraft.class_2960;
import net.minecraft.class_3264;
import net.minecraft.class_3300;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.*;

/** Resource reload publishes immutable snapshots. Active battles retain their snapshot. */
public final class RejuvenationFields implements ModInitializer {
    public static final Logger LOG = LoggerFactory.getLogger("rejuvenation_fields");
    /** One validated datapack revision: the catalog, its simulator JSON and the compiled environment index. */
    public record Catalog(JsonObject data, long revision, String json, EnvironmentResolver.Index environment, Map<String, JsonObject> notes) {
        Catalog(JsonObject data, long revision, Map<String, JsonObject> notes) { this(data, revision, data.toString(), EnvironmentResolver.compile(data), notes); }
        Catalog(JsonObject data, long revision) { this(data, revision, Map.of()); }
    }
    public static volatile Catalog catalog = new Catalog(new JsonObject(), 0, "{}", EnvironmentResolver.Index.EMPTY, Map.of());
    // Cobblemon boots its worker during its initializer, potentially before ours.
    // The mixin must not depend on Fabric entrypoint ordering.
    public static final String engine = readEngine();
    private static String readEngine() {
        try (var in = Objects.requireNonNull(RejuvenationFields.class.getResourceAsStream("/rejuvenation-engine.js"))) {
            return new String(in.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) { throw new IllegalStateException("Missing field simulator", e); }
    }

    @Override public void onInitialize() {
        try(var in=Objects.requireNonNull(RejuvenationFields.class.getResourceAsStream("/rejuvenation-types.json"))) {
            registerTypes(read(in));
        } catch(IOException error) { throw new IllegalStateException("Missing source type metadata",error); }
        com.cobblemon.mod.common.api.pokemon.status.Statuses.registerStatus(
            new FieldPersistentStatus("petrified","ptr"));
        // Held-item components are Cobblemon's supported bridge to Showdown IDs.
        for (String seed : List.of("elemental_seed", "magical_seed", "telluric_seed", "synthetic_seed", "amulet_coin", "amplifield_rock")) {
            var settings = new net.minecraft.class_1792.class_1793().method_57349(
                com.cobblemon.mod.common.CobblemonItemComponents.HELD_ITEM_EFFECT,
                new com.cobblemon.mod.common.item.components.HeldItemEffectComponent(seed.replace("_", ""), true));
            net.minecraft.class_2378.method_10230(net.minecraft.class_7923.field_41178,
                class_2960.method_60655("rejuvenation", seed), new net.minecraft.class_1792(settings));
        }
        ShowdownInterpreter.registerUpdateInstructionParser("rejuvenationmessage", (battle, set, message, remaining) ->
            b -> b.dispatchGo(() -> {
                b.broadcastChatMessage(class_2561.method_43470(message.argumentAt(0)));
                return Unit.INSTANCE;
            }));
        ShowdownInterpreter.registerUpdateInstructionParser("rejuvenationstate", (battle,set,message,remaining) ->
            b -> b.dispatchGo(() -> { FieldStateSync.update(b,message.argumentAt(0));return Unit.INSTANCE; }));
        dev.rejuvenation.net.FieldPayloads.register();
        // On-demand preview evaluations run on the server thread, which owns the simulator.
        net.fabricmc.fabric.api.networking.v1.ServerPlayNetworking.registerGlobalReceiver(dev.rejuvenation.net.FieldPayloads.EvaluationRequest.ID,
            (payload, context) -> context.server().execute(() -> InspectorSync.requested(context.player(), payload.json())));
        // League trainers select their field before the LOWEST environment capture below.
        com.cobblemon.mod.common.api.events.CobblemonEvents.BATTLE_STARTED_PRE.subscribe(
            com.cobblemon.mod.common.api.Priority.NORMAL,
            (java.util.function.Consumer<com.cobblemon.mod.common.api.events.battles.BattleStartedEvent.Pre>) event -> {
                if (!event.isCanceled()) TrainerFieldBridge.select(event.getBattle());
            });
        com.cobblemon.mod.common.api.events.CobblemonEvents.BATTLE_STARTED_PRE.subscribe(
            com.cobblemon.mod.common.api.Priority.LOWEST,
            (java.util.function.Consumer<com.cobblemon.mod.common.api.events.battles.BattleStartedEvent.Pre>) event -> {
                if (!event.isCanceled()) FieldApi.capture(event.getBattle()); else FieldApi.clear(event.getBattle().getBattleId());
            });
        // Publish the catalog to the simulator before any battle can start, on the server thread that drives Graal.
        net.fabricmc.fabric.api.event.lifecycle.v1.ServerLifecycleEvents.SERVER_STARTED.register(server -> {
            FieldEvaluator.serverStarted(Thread.currentThread());
            SimulatorCatalog.publishNow("server start", false);
        });
        net.fabricmc.fabric.api.event.lifecycle.v1.ServerLifecycleEvents.END_DATA_PACK_RELOAD.register((server, resources, success) -> {
            // Cobblemon's own reload resets the simulator's ability registry, so republish even an unchanged revision.
            if (success) SimulatorCatalog.publishNow("datapack reload", true);
        });
        net.fabricmc.fabric.api.event.lifecycle.v1.ServerLifecycleEvents.SERVER_STARTED.register(RuntimeInventory::write);
        com.cobblemon.mod.common.api.events.CobblemonEvents.POKEMON_CATCH_RATE.subscribe(
            com.cobblemon.mod.common.api.Priority.LOWEST,
            (java.util.function.Consumer<com.cobblemon.mod.common.api.events.pokeball.PokemonCatchRateEvent>) CaptureBridge::apply);
        net.fabricmc.fabric.api.event.lifecycle.v1.ServerLifecycleEvents.SERVER_STOPPED.register(server -> FieldApi.clearAll());
        ResourceManagerHelper.get(class_3264.field_14190).registerReloadListener(new SimpleSynchronousResourceReloadListener() {
            @Override public class_2960 getFabricId() { return class_2960.method_60655("rejuvenation", "fields"); }
            @Override public void method_14491(class_3300 manager) { reload(manager); }
        });
        LOG.info("Rejuvenation field engine registered for Cobblemon 1.7.3; trainer definitions untouched");
    }

    private static void reload(class_3300 manager) {
        JsonObject next = new JsonObject(), fields = new JsonObject(), items = new JsonObject(), abilities;
        JsonArray mappings = new JsonArray();
        try {
            for (var entry : manager.method_14488("rejuvenation/fields", id -> id.method_12832().endsWith(".json")).entrySet()) {
                JsonObject value = read(entry.getValue().method_14482());
                String id = entry.getKey().method_12836() + ":" + entry.getKey().method_12832().substring("rejuvenation/fields/".length()).replaceFirst("\\.json$", "");
                if (!id.equals(value.get("id").getAsString())) throw new IllegalArgumentException(id + ": mismatched field ID");
                if (fields.has(id)) throw new IllegalArgumentException("Duplicate field " + id);
                if (value.get("schemaVersion").getAsInt() != 1) throw new IllegalArgumentException(id + ": unsupported schema");
                fields.add(id, value);
            }
            // Row order is precedence: documents merge by (order, resource ID), never by pack or listing order (RuleDocuments).
            var mappingDocs = new ArrayList<RuleDocuments.Doc>();
            for (var entry : manager.method_14488("rejuvenation/mappings", id -> id.method_12832().endsWith(".json")).entrySet())
                mappingDocs.add(new RuleDocuments.Doc(entry.getKey().toString(), read(entry.getValue().method_14482())));
            mappings = RuleDocuments.merge(mappingDocs);
            var structureDocs = new ArrayList<RuleDocuments.Doc>();
            for (var entry : manager.method_14488("rejuvenation/structures", id -> id.method_12832().endsWith(".json")).entrySet()) {
                JsonObject value = read(entry.getValue().method_14482());
                if (value.get("schemaVersion").getAsInt() != 1) throw new IllegalArgumentException(entry.getKey() + ": unsupported structure mapping schema");
                structureDocs.add(new RuleDocuments.Doc(entry.getKey().toString(), value));
            }
            JsonArray structures = RuleDocuments.merge(structureDocs);
            // Field Notes: player-facing text per field, replaceable by any datapack at the same path (validated below with the catalog).
            var notes = new TreeMap<String, JsonObject>();
            for (var entry : manager.method_14488("rejuvenation/notes", id -> id.method_12832().endsWith(".json")).entrySet()) {
                String id = entry.getKey().method_12836() + ":" + entry.getKey().method_12832().substring("rejuvenation/notes/".length()).replaceFirst("\\.json$", "");
                if (notes.put(id, read(entry.getValue().method_14482())) != null) throw new IllegalArgumentException("Duplicate notes for " + id);
            }
            for (var entry : manager.method_14488("rejuvenation/items", id -> id.method_12832().endsWith(".json")).entrySet()) {
                var value=read(entry.getValue().method_14482()).getAsJsonObject("items");
                for (var item:value.entrySet()) { if(items.has(item.getKey())) throw new IllegalArgumentException("Duplicate simulator item "+item.getKey()); items.add(item.getKey(),item.getValue()); }
            }
            abilities = readAbilities(manager);
            JsonObject trainers = new JsonObject();
            for (var entry : manager.method_14488("rejuvenation/trainers", id -> id.method_12832().endsWith(".json")).entrySet()) {
                var value=read(entry.getValue().method_14482()).getAsJsonObject("trainers");
                for (var trainer:value.entrySet()) { if(trainers.has(trainer.getKey())) throw new IllegalArgumentException("Duplicate trainer field "+trainer.getKey()); trainers.add(trainer.getKey(),trainer.getValue()); }
            }
            for (var entry : fields.entrySet()) {
                for (var move : entry.getValue().getAsJsonObject().getAsJsonObject("moves").entrySet()) {
                    JsonObject rule = move.getValue().getAsJsonObject();
                    if (rule.has("transition") && !fields.has(rule.getAsJsonObject("transition").get("field").getAsString()))
                        throw new IllegalArgumentException(entry.getKey()+": invalid transition in "+move.getKey());
                }
            }
            for (JsonElement element : mappings) if (!fields.has(element.getAsJsonObject().get("field").getAsString()))
                throw new IllegalArgumentException("Mapping references missing field: " + element);
            for (JsonElement element : structures) if (!fields.has(element.getAsJsonObject().get("field").getAsString()))
                throw new IllegalArgumentException("Structure mapping references missing field: " + element);
            next.add("fields", fields); next.add("mappings", mappings); next.add("structures", structures); next.add("items", items); next.add("abilities", abilities); next.add("trainers", trainers);
            next.addProperty("default", "rejuvenation:indoor");
            CatalogValidator.validate(next);
            catalog = new Catalog(next, catalog.revision()+1, FieldNotes.validateAll(notes, fields));
            registerAbilityTemplates(abilities);
            for(var field:fields.entrySet())if(field.getValue().getAsJsonObject().has("typeDefinitions"))registerTypes(field.getValue().getAsJsonObject().getAsJsonObject("typeDefinitions"));
            LOG.info("Loaded {} fields, {} environment rules, {} structure rules and {} field notes (revision {})", fields.size(), mappings.size(), structures.size(), catalog.notes().size(), catalog.revision());
        } catch (Exception error) {
            LOG.error("Rejected field reload; previous revision retained", error);
            throw new IllegalArgumentException("Invalid Rejuvenation datapack: " + error.getMessage(), error);
        }
    }
    private static void registerTypes(JsonObject definitions) {
        for(var entry:definitions.entrySet()) {
            String id=entry.getKey().toLowerCase(Locale.ROOT);
            if(com.cobblemon.mod.common.api.types.ElementalTypes.get(id)!=null)continue;
            var row=entry.getValue().getAsJsonObject();
            var basis=com.cobblemon.mod.common.api.types.ElementalTypes.getOrException(row.get("textureBasis").getAsString().toLowerCase(Locale.ROOT));
            com.cobblemon.mod.common.api.types.ElementalTypes.register(new com.cobblemon.mod.common.api.types.ElementalType(
                id,class_2561.method_43470(row.get("displayName").getAsString()),row.get("hue").getAsInt(),
                basis.getTextureXMultiplier(),basis.getResourceLocation(),id));
        }
    }
    /** Declared source abilities. Shared with the Cobblemon ability-registry hook, whose reload can precede ours. */
    public static JsonObject readAbilities(class_3300 manager) throws IOException {
        JsonObject abilities = new JsonObject();
        for (var entry : manager.method_14488("rejuvenation/abilities", id -> id.method_12832().endsWith(".json")).entrySet()) {
            JsonObject document = read(entry.getValue().method_14482());
            if (!document.has("schemaVersion") || document.get("schemaVersion").getAsInt() != 1) throw new IllegalArgumentException(entry.getKey() + ": unsupported ability schema");
            for (var ability : document.getAsJsonObject("abilities").entrySet()) {
                if (abilities.has(ability.getKey())) throw new IllegalArgumentException("Duplicate declared ability " + ability.getKey());
                abilities.add(ability.getKey(), ability.getValue());
            }
        }
        return abilities;
    }
    /**
     * Cobblemon rebuilds its Java ability registry from the simulator on every data reload and
     * synchronizes it to clients. The simulator definitions are installed with the field catalog,
     * so the matching templates are added here; species data and commands can then refer to them.
     */
    public static void registerAbilityTemplates(JsonObject abilities) {
        for (String id : abilities.keySet()) {
            if (!id.matches("[a-z0-9]+")) throw new IllegalArgumentException("Invalid declared ability ID " + id);
            // Same defaults Cobblemon gives simulator-provided abilities: stock builder and its translation-key convention.
            com.cobblemon.mod.common.api.abilities.Abilities.register(new com.cobblemon.mod.common.api.abilities.AbilityTemplate(
                id, com.cobblemon.mod.common.api.abilities.Abilities.INSTANCE.getDUMMY().getBuilder(), "cobblemon.ability." + id, "cobblemon.ability." + id + ".desc"));
        }
    }
    private static JsonObject read(InputStream in) throws IOException {
        return CatalogValidator.read(in);
    }
}
