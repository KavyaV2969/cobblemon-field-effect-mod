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
 *
 * <p>Each recipient gets its own copy: public counters are per side, so a player sees them from their own side's point of view
 * ({@code viewer}: 0 or 1; spectators -1). A packet is sent to a recipient only when its visible part (field, layers, overlay, clocks,
 * public counters) changes, and a final empty state ends the panel. The first time a field is shown to a recipient the server also
 * sends that field's notes, taken from the battle's own catalog snapshot; a choice request resends everything (reconnects).
 * Nothing sent reveals either team's hidden information: only the visible field, its layers, and public battlefield counters.
 */
public final class FieldStateSync {
    private FieldStateSync() {}
    private static final Map<UUID, Map<UUID, String>> lastSent = new ConcurrentHashMap<>();
    private static final Map<UUID, Map<UUID, Set<String>>> notesSent = new ConcurrentHashMap<>();

    /** Choice requests are also a resynchronization point after joining/reconnecting. */
    public static void resync(PokemonBattle battle) {
        FieldApi.current(battle.getBattleId()).ifPresent(state -> {
            lastSent.remove(battle.getBattleId());
            notesSent.remove(battle.getBattleId());
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
        notesSent.remove(battle.getBattleId());
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
        // The dormant layer directly beneath the visible field (environment substrate), and the counters the field's notes describe.
        if (state.has("substrate") && !state.get("substrate").isJsonNull()) {
            json.addProperty("substrate", state.get("substrate").getAsString());
            json.addProperty("substrateName", displayName(state.get("substrate").getAsString()));
        }
        if (state.has("public") && state.get("public").isJsonObject() && !state.getAsJsonObject("public").isEmpty()) json.add("public", state.getAsJsonObject("public").deepCopy());
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

    /** 0 or 1 for a participant on side 1 or 2 (public per-side counters are shown from this side), -1 for spectators. */
    static int viewer(PokemonBattle battle, class_3222 player) {
        var actor = battle.getActor(player);
        if (actor == null) return -1;
        return actor.getSide() == battle.getSide1() ? 0 : actor.getSide() == battle.getSide2() ? 1 : -1;
    }

    private static void send(PokemonBattle battle, JsonObject json) {
        var recipients = recipients(battle);
        // A spectator who joins later receives the state with the next update.
        var sent = lastSent.computeIfAbsent(battle.getBattleId(), id -> new ConcurrentHashMap<>());
        for (var player : recipients) {
            var personal = json.deepCopy(); personal.addProperty("viewer", viewer(battle, player));
            String text = personal.toString();
            if (text.equals(sent.put(player.method_5667(), text))) continue;
            ServerPlayNetworking.send(player, new FieldPayloads.FieldState(text));
            sendNotes(battle, player, json);
        }
    }

    /** Notes for the visible field and the overlay, once per recipient and (field, revision) from the battle's catalog snapshot. */
    private static void sendNotes(PokemonBattle battle, class_3222 player, JsonObject state) {
        var snapshot = FieldApi.notes(battle.getBattleId());
        if (snapshot.isEmpty() || !ServerPlayNetworking.canSend(player, FieldPayloads.Notes.ID)) return;
        var already = notesSent.computeIfAbsent(battle.getBattleId(), id -> new ConcurrentHashMap<>()).computeIfAbsent(player.method_5667(), id -> ConcurrentHashMap.newKeySet());
        var wanted = new ArrayList<String>(List.of(state.get("field").getAsString()));
        if (state.has("overlay")) wanted.add(state.get("overlay").getAsString());
        for (String field : wanted)
            if (already.add(field + "@" + snapshot.get().revision()))
                ServerPlayNetworking.send(player, new FieldPayloads.Notes(FieldNotes.payload(battle.getBattleId(), field, snapshot.get().revision(), snapshot.get().notes())));
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
