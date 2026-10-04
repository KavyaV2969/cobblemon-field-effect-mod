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
    public record Catalog(JsonObject data, long revision) {}
    public static volatile Catalog catalog = new Catalog(new JsonObject(), 0);
    // Cobblemon boots its worker during its initializer, potentially before ours.
    // The mixin must not depend on Fabric entrypoint ordering.
    public static final String engine = readEngine();
    private static String readEngine() {
        try (var in = Objects.requireNonNull(RejuvenationFields.class.getResourceAsStream("/rejuvenation-engine.js"))) {
            return new String(in.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) { throw new IllegalStateException("Missing field simulator", e); }
    }

    @Override public void onInitialize() {
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
            b -> b.dispatchGo(() -> { FieldApi.update(b.getBattleId(),message.argumentAt(0));return Unit.INSTANCE; }));
        com.cobblemon.mod.common.api.events.CobblemonEvents.BATTLE_STARTED_PRE.subscribe(
            com.cobblemon.mod.common.api.Priority.LOWEST,
            (java.util.function.Consumer<com.cobblemon.mod.common.api.events.battles.BattleStartedEvent.Pre>) event -> {
                if (!event.isCanceled()) FieldApi.capture(event.getBattle()); else FieldApi.clear(event.getBattle().getBattleId());
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
        JsonObject next = new JsonObject(), fields = new JsonObject(), items = new JsonObject();
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
            for (var entry : manager.method_14488("rejuvenation/mappings", id -> id.method_12832().endsWith(".json")).entrySet()) {
                JsonObject value = read(entry.getValue().method_14482());
                for (JsonElement mapping : value.getAsJsonArray("rules")) mappings.add(mapping);
            }
            for (var entry : manager.method_14488("rejuvenation/items", id -> id.method_12832().endsWith(".json")).entrySet()) {
                var value=read(entry.getValue().method_14482()).getAsJsonObject("items");
                for (var item:value.entrySet()) { if(items.has(item.getKey())) throw new IllegalArgumentException("Duplicate simulator item "+item.getKey()); items.add(item.getKey(),item.getValue()); }
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
            next.add("fields", fields); next.add("mappings", mappings); next.add("items", items);
            next.addProperty("default", "rejuvenation:indoor");
            CatalogValidator.validate(next);
            catalog = new Catalog(next, catalog.revision()+1);
            LOG.info("Loaded {} fields and {} environment rules (revision {})", fields.size(), mappings.size(), catalog.revision());
        } catch (Exception error) {
            LOG.error("Rejected field reload; previous revision retained", error);
            throw new IllegalArgumentException("Invalid Rejuvenation datapack: " + error.getMessage(), error);
        }
    }
    private static JsonObject read(InputStream in) throws IOException {
        return CatalogValidator.read(in);
    }
}
