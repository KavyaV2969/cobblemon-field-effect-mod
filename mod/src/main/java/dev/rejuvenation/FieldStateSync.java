package dev.rejuvenation;

import com.cobblemon.mod.common.api.battles.model.PokemonBattle;
import com.google.gson.*;
import dev.rejuvenation.net.FieldPayloads;
import net.fabricmc.fabric.api.networking.v1.ServerPlayNetworking;
import net.minecraft.class_3222;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Forwards the simulator's ordered {@code rejuvenationstate} snapshots to the battle's players and spectators.
 * This is the same state {@link FieldApi#current} exposes; the client never derives field state on its own.
 * A packet is sent only when the visible part (field, overlay, clocks) changes, and a final empty state ends the panel.
 */
public final class FieldStateSync {
    private FieldStateSync() {}
    private static final Map<UUID, String> lastSent = new ConcurrentHashMap<>();

    /** Choice requests are also a resynchronization point after joining/reconnecting. */
    public static void resync(PokemonBattle battle) {
        FieldApi.current(battle.getBattleId()).ifPresent(state -> {
            lastSent.remove(battle.getBattleId());
            send(battle, describe(battle.getBattleId(), state));
        });
    }

    /** Called from the dispatched state instruction on the server thread. */
    public static void update(PokemonBattle battle, String json) {
        FieldApi.update(battle.getBattleId(), json);
        var state = FieldApi.current(battle.getBattleId());
        if (state.isEmpty()) return;
        send(battle, describe(battle.getBattleId(), state.get()));
    }

    /** Called when the battle ends: clients drop the panel and any evaluations for it. */
    public static void end(PokemonBattle battle) {
        if (lastSent.remove(battle.getBattleId()) == null) return;
        var json = new JsonObject(); json.addProperty("battle", battle.getBattleId().toString()); json.add("field", JsonNull.INSTANCE);
        for (var player : recipients(battle)) ServerPlayNetworking.send(player, new FieldPayloads.FieldState(json.toString()));
    }

    static JsonObject describe(UUID battle, JsonObject state) {
        var json = new JsonObject();
        json.addProperty("battle", battle.toString());
        String field = state.get("field").getAsString();
        json.addProperty("field", field);
        json.addProperty("name", displayName(field));
        json.addProperty("duration", state.has("duration") ? state.get("duration").getAsInt() : 0);
        var overlay = state.has("overlay") && !state.get("overlay").isJsonNull() ? state.get("overlay").getAsString() : null;
        if (overlay != null) {
            json.addProperty("overlay", overlay);
            json.addProperty("overlayName", displayName(overlay));
            json.addProperty("overlayDuration", state.has("overlayDuration") ? state.get("overlayDuration").getAsInt() : 0);
        }
        FieldApi.origin(battle).ifPresent(origin -> json.addProperty("source", origin.source()));
        return json;
    }

    /** The source field name; progressive fields (Flower Garden, Concert Venue) add their stage. */
    static String displayName(String field) {
        var definition = RejuvenationFields.catalog.data().has("fields") ? RejuvenationFields.catalog.data().getAsJsonObject("fields").getAsJsonObject(field) : null;
        if (definition == null) return field;
        String name = definition.has("name") ? definition.get("name").getAsString() : field;
        if (definition.has("progression") && definition.getAsJsonObject("progression").has("stage"))
            name += " " + definition.getAsJsonObject("progression").get("stage").getAsInt();
        return name;
    }

    private static void send(PokemonBattle battle, JsonObject json) {
        String text = json.toString();
        var recipients = recipients(battle);
        // A spectator who joins later receives the state with the next update.
        String key = text + recipients.stream().map(p -> p.method_5845()).sorted().toList();
        if (key.equals(lastSent.put(battle.getBattleId(), key))) return;
        var payload = new FieldPayloads.FieldState(text);
        for (var player : recipients) ServerPlayNetworking.send(player, payload);
    }

    static List<class_3222> recipients(PokemonBattle battle) {
        var players = new ArrayList<class_3222>(battle.getPlayers());
        if (!players.isEmpty() && !battle.getSpectators().isEmpty()) {
            var server = players.getFirst().method_5682();
            if (server != null) for (var id : battle.getSpectators()) {
                var spectator = server.method_3760().method_14602(id);
                if (spectator != null && !players.contains(spectator)) players.add(spectator);
            }
        }
        players.removeIf(player -> !ServerPlayNetworking.canSend(player, FieldPayloads.FieldState.ID));
        return players;
    }
}
