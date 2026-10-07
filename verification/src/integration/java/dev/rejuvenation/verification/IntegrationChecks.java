package dev.rejuvenation.verification;

import com.cobblemon.mod.common.api.battles.model.PokemonBattle;
import com.cobblemon.mod.common.api.moves.Moves;
import com.cobblemon.mod.common.api.pokemon.PokemonProperties;
import com.cobblemon.mod.common.api.storage.party.PlayerPartyStore;
import com.cobblemon.mod.common.battles.*;
import com.cobblemon.mod.common.entity.pokemon.PokemonEntity;
import com.google.gson.*;
import dev.rejuvenation.*;
import dev.rejuvenation.compat.client.BattleExtrasFieldAdapter;
import dev.rejuvenation.client.ClientFieldState;
import net.minecraft.class_2338;
import net.minecraft.class_2902;
import net.minecraft.class_2960;
import net.minecraft.class_310;
import net.minecraft.class_318;
import net.minecraft.class_3218;
import net.minecraft.class_3222;
import net.minecraft.class_6862;
import net.minecraft.class_7924;
import net.minecraft.server.MinecraftServer;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;

/**
 * Live checks for the 0.2.0 integration work (-Drejuvenation.verifyIntegration=true), run in the isolated game only:
 * environmental precedence on real terrain and generated structures, battle-start timings, the client field panel
 * (state, updates, screenshots), field-aware move previews through Battle Extras' own calculator, and a real RCT
 * trainer battle decided by the Run &amp; Bun AI with field evaluation.
 */
final class IntegrationChecks {
    private final JsonObject report = new JsonObject();
    private final JsonArray checks = new JsonArray(), skipped = new JsonArray(), timings = new JsonArray(), screenshots = new JsonArray();
    private final Path output = Path.of("rejuvenation/research/live-battle.json");
    private int step, delay, wait, battlesStarted;
    private boolean finished;
    private PokemonBattle battle;
    private PokemonEntity wild;
    private com.cobblemon.mod.common.pokemon.Pokemon playerPokemon;
    private UUID userPokemon;
    private class_2338 villagePos;
    private String expectField, expectSource;
    private final AtomicReference<Object> clientResult = new AtomicReference<>();
    private long[] aiBefore;

    void tick(MinecraftServer server) {
        if (finished) return;
        try {
            var players = server.method_3760().method_14571();
            if (players.isEmpty() || RejuvenationFields.catalog.revision() == 0) return;
            if (++wait > 2400) throw new IllegalStateException("Integration check timeout at step " + step);
            if (battle != null && wait % 200 == 0) RejuvenationFields.LOG.info("Integration battle at step {}: turn {}, dispatch {}, queued {}, actors {}", step, battle.getTurn(), battle.getDispatchResult(), battle.getDispatches().size(), java.util.stream.StreamSupport.stream(battle.getActors().spliterator(), false).map(a -> a.getClass().getSimpleName() + ":request=" + (a.getRequest() != null) + ",sending=" + a.getStillSendingOutCount() + ",active=" + a.getActivePokemon().stream().map(p -> String.valueOf(p.getBattlePokemon()) + "@" + p.getSendOutPosition()).toList()).toList());
            if (delay-- > 0) return;
            var player = players.getFirst(); var world = player.method_51469();
            switch (step) {
                case 0 -> {
                    if (wait < 200) return;
                    // The catalog must already be in the simulator before the first battle starts.
                    check(SimulatorCatalog.publishedRevision() == RejuvenationFields.catalog.revision(), "Catalog published to the simulator at server start, before any battle");
                    report.addProperty("serverStartPublishMillis", SimulatorCatalog.lastPublishMillis());
                    checkMixins();
                    next(1);
                }
                // Plains -> Grassy Terrain on real terrain (biome set with /fillbiome on an isolated platform).
                case 1 -> { platform(server, player, 20000, 20000, "minecraft:plains"); next(40); }
                case 2 -> { startWild(player, world, List.of("leafblade", "psychic", "growth")); expect("rejuvenation:grassy_terrain", "biome"); next(5); }
                case 3 -> { if (!started()) return; verifyStart("Plains biome battle opens on Grassy Terrain via the biome mapping"); next(5); }
                // The client receives the panel state and the move evaluations for the same battle.
                case 4 -> { requestClient(() -> ClientFieldState.current().map(s -> s.field() + "|" + s.name()).orElse(null)); next(5); }
                case 5 -> {
                    Object state = clientResult.get(); if (state == null) { requestClient(() -> ClientFieldState.current().map(s -> s.field() + "|" + s.name()).orElse(null)); delay = 10; return; }
                    check(("rejuvenation:grassy_terrain|Grassy Terrain").equals(state), "Client field panel state for the battle: " + state);
                    screenshot("panel-grassy-terrain"); next(30);
                }
                case 6 -> { requestClient(this::battleExtrasPreview); next(5); }
                case 7 -> {
                    Object result = clientResult.get(); if (result == null) { requestClient(this::battleExtrasPreview); delay = 10; return; }
                    if (result instanceof String text && text.startsWith("SKIP")) skipped.add(text);
                    else check(Boolean.TRUE.equals(result), "Battle Extras preview through its own calculator scales with the field: " + result);
                    end(); next(30);
                }
                // Mushroom Fields -> Fairy Tale Field.
                case 8 -> { platform(server, player, 20400, 20000, "minecraft:mushroom_fields"); next(40); }
                case 9 -> { startWild(player, world, List.of("psychic")); expect("rejuvenation:fairytale", "biome"); next(5); }
                case 10 -> { if (!started()) return; verifyStart("Mushroom Fields battle opens on Fairy Tale Field via the biome mapping"); end(); next(30); }
                // A naturally generated village -> City, and a submerged battle in the same village -> Underwater.
                case 11 -> {
                    villagePos = locateInside(world, "minecraft:village", player.method_24515());
                    if (villagePos == null) { skipped.add("No village located within range; village checks skipped"); next(0); step = 17; return; }
                    dryArena(server, villagePos);
                    tp(server, villagePos.method_10263() + 0.5, villagePos.method_10264(), villagePos.method_10260() + 0.5); next(60);
                }
                case 12 -> { startWild(player, world, List.of("iondeluge", "thief", "psychic")); expect("rejuvenation:city", "structure"); next(5); }
                case 13 -> {
                    if (!started()) return; verifyStart("Battle inside a generated village opens on City Field via the structure mapping");
                    screenshot("panel-city"); next(30);
                }
                // Live updates: Ion Deluge adds an Electric Terrain overlay; Thief then turns City into Back Alley.
                case 14 -> {
                    if (!act("iondeluge")) return;
                    next(60);
                }
                case 15 -> {
                    var state = FieldApi.current(battle.getBattleId()).orElseThrow();
                    if (state.get("overlay").isJsonNull()) { delay = 20; return; }
                    check("rejuvenation:electric_terrain".equals(state.get("overlay").getAsString()), "Ion Deluge creates the Electric Terrain overlay over City");
                    screenshot("panel-city-electric-overlay"); go(140, 20);
                }
                // Field Notes: a real mouse click on the HUD panel (through Minecraft's own input path and Fabric's screen events) opens the overlay.
                case 140 -> { probe(this::openChat); go(141, 10); }
                case 141 -> {
                    Object r = clientResult.get(); if (r == null) { delay = 5; return; }
                    check("ok".equals(r), "A mouse-enabled screen hosts the notes overlay: " + r); probe(this::clickPanel); go(142, 10);
                }
                case 142 -> {
                    Object r = clientResult.get(); if (r == null) { delay = 5; return; }
                    check("open".equals(r), "A real mouse click on the HUD field panel opens the Field Notes overlay: " + r); go(143, 20);
                }
                case 143 -> { screenshot("notes-city-electric-overlay"); go(144, 30); }
                case 144 -> { probe(() -> pressKey(256)); go(145, 10); }
                case 145 -> {
                    Object r = clientResult.get(); if (r == null) { delay = 5; return; }
                    check("closed|hosted".equals(r), "Escape closes the overlay and is consumed, the hosting screen stays: " + r); probe(this::clickPanel); go(146, 10);
                }
                case 146 -> {
                    Object r = clientResult.get(); if (r == null) { delay = 5; return; }
                    check("open".equals(r), "The overlay re-opens from the panel: " + r); go(150, 10);
                }
                case 150 -> { if (!act("thief")) return; next(60); step = 16; }
                case 16 -> {
                    var state = FieldApi.current(battle.getBattleId()).orElseThrow();
                    if (!"rejuvenation:back_alley".equals(state.get("field").getAsString())) { delay = 20; return; }
                    requestClient(() -> ClientFieldState.current().map(ClientFieldState.State::field).orElse(null));
                    delay = 10;
                    step = 160;
                }
                case 160 -> {
                    Object field = clientResult.get(); if (field == null) { requestClient(() -> ClientFieldState.current().map(ClientFieldState.State::field).orElse(null)); delay = 10; return; }
                    check("rejuvenation:back_alley".equals(field), "Thief turns City into Back Alley; the client panel follows: " + field);
                    screenshot("panel-back-alley"); go(1600, 10);
                }
                // The open overlay followed City -> Back Alley without being closed or clicked.
                case 1600 -> { probe(() -> pressKey(-1)); go(1601, 10); }
                case 1601 -> {
                    Object r = clientResult.get(); if (r == null) { delay = 5; return; }
                    check("open|hosted".equals(r), "The notes overlay stays open and follows the field transformation: " + r); screenshot("notes-back-alley"); go(1602, 30);
                }
                case 1602 -> { probe(() -> pressKey(256)); go(1603, 10); }
                case 1603 -> {
                    Object r = clientResult.get(); if (r == null) { delay = 5; return; }
                    check("closed|hosted".equals(r), "Escape closes the overlay: " + r);
                    probe(() -> { class_310.method_1551().method_1507(null); return "ok"; }); go(1604, 10);
                }
                case 1604 -> { end(); next(30); step = 161; }
                case 161 -> {
                    // Underwater wins over the village around it.
                    int x = villagePos.method_10263(), y = villagePos.method_10264(), z = villagePos.method_10260();
                    command(server, "fill " + (x - 4) + " " + y + " " + (z - 4) + " " + (x + 4) + " " + (y + 3) + " " + (z + 4) + " minecraft:water");
                    tp(server, x + 0.5, y, z + 0.5); next(20); step = 162;
                }
                case 162 -> { startWild(player, world, List.of("surf")); wild.method_5814(villagePos.method_10263() + 1.5, villagePos.method_10264() + 1, villagePos.method_10260() + 0.5); expect("rejuvenation:underwater", "underwater"); next(5); step = 163; }
                case 163 -> { if (!started()) return; verifyStart("Submerged battle inside a village opens on Underwater (underwater beats structure)"); end(); next(30); step = 164; }
                // Streets and plazas between a village's pieces: outside every piece box, inside the bounded footprint.
                case 164 -> {
                    var gap = villageGap(world, villagePos);
                    if (gap == null) { skipped.add("No street gap outside every village piece box was found; footprint covered by the API-shaped fixtures"); step = 17; return; }
                    report.addProperty("villageGap", gap.method_10263() + " " + gap.method_10264() + " " + gap.method_10260() + " (" + gapDistance + " blocks outside the nearest piece box)");
                    dryArena(server, gap);
                    tp(server, gap.method_10263() + 0.5, gap.method_10264(), gap.method_10260() + 0.5); go(165, 60);
                }
                case 165 -> { startWild(player, world, List.of("iondeluge", "thief", "psychic")); expect("rejuvenation:city", "structure"); next(5); step = 166; }
                case 166 -> {
                    if (!started()) return;
                    verifyStart("Battle in a village street gap " + gapDistance + " blocks outside every piece box opens on City via the footprint containment");
                    screenshot("panel-city-village-gap"); end(); next(30); step = 17;
                }
                // An unmapped structure falls through to its biome.
                case 17 -> {
                    var portal = locateInside(world, "minecraft:ruined_portal", player.method_24515());
                    if (portal == null) { skipped.add("No ruined portal located within range; unmapped-structure check skipped"); next(0); step = 19; return; }
                    dryArena(server, portal);
                    tp(server, portal.method_10263() + 0.5, portal.method_10264(), portal.method_10260() + 0.5); next(60); step = 170;
                }
                case 170 -> { startWild(player, world, List.of("psychic")); expect(null, "biome"); next(5); step = 18; }
                case 18 -> { if (!started()) return; verifyStart("Battle inside a ruined portal (no structure mapping) falls through to its biome"); end(); next(30); step = 19; }
                // Woodland Mansion -> Back Alley, when one is within locate range of the test seed.
                case 19 -> {
                    var mansion = locateInside(world, "minecraft:on_woodland_explorer_maps", player.method_24515());
                    if (mansion == null) { skipped.add("No Woodland Mansion located within range; covered by simulator/Java precedence tests"); next(0); step = 21; return; }
                    dryArena(server, mansion);
                    tp(server, mansion.method_10263() + 0.5, mansion.method_10264(), mansion.method_10260() + 0.5); next(80); step = 190;
                }
                case 190 -> { startWild(player, world, List.of("psychic")); expect("rejuvenation:back_alley", "structure"); next(5); step = 20; }
                case 20 -> { if (!started()) return; verifyStart("Battle inside a generated Woodland Mansion opens on Back Alley via the structure mapping"); end(); next(30); step = 21; }
                // Run & Bun: a real RCT league trainer, AI decisions with field evaluation, battle keeps running.
                case 21 -> { aiBefore = FieldEvaluator.totalsByPurpose().getOrDefault("Run & Bun AI", new long[3]); startBrock(player, world); next(20); step = 22; }
                case 22 -> {
                    if (battle.getTurn() < 1 || FieldApi.current(battle.getBattleId()).isEmpty()) return;
                    if (battle.getTurn() >= 3) { step = 23; return; }
                    playerSplash(); delay = 20;
                }
                case 23 -> {
                    var after = FieldEvaluator.totalsByPurpose().getOrDefault("Run & Bun AI", new long[3]);
                    report.addProperty("runBunEvaluationCalls", after[0] - aiBefore[0]); report.addProperty("runBunEvaluatedQueries", after[1] - aiBefore[1]); report.addProperty("runBunEvaluationMillis", after[2] - aiBefore[2]);
                    check(after[0] > aiBefore[0] && after[1] > aiBefore[1], "Run & Bun AI decisions in a live RCT Brock battle query the field engine (" + (after[1] - aiBefore[1]) + " queries, " + (after[2] - aiBefore[2]) + " ms)");
                    check(!battle.getEnded() && battle.getTurn() >= 3, "Live AI battle keeps running with field-aware decisions");
                    end(); next(30); step = 24;
                }
                case 24 -> {
                    // No battle start may publish the catalog or spend long in field work.
                    double worst = 0;
                    for (var record : BattleStartTimings.recent()) {
                        var row = new JsonObject(); row.addProperty("field", record.field()); row.addProperty("source", record.source());
                        row.addProperty("environmentMillis", record.environmentNanos() / 1e6); row.addProperty("simulatorHookMillis", record.simulatorNanos() / 1e6);
                        row.addProperty("catalogPublishedAtStart", record.publishedCatalog()); timings.add(row);
                        worst = Math.max(worst, record.totalMillis());
                        check(!record.publishedCatalog(), "Battle " + record.field() + " did not publish the catalog at battle start");
                    }
                    report.addProperty("worstBattleStartFieldMillis", worst);
                    check(worst < 500, "Field work at battle start stays below 0.5 s (worst " + worst + " ms)");
                    var totals = new JsonObject();
                    FieldEvaluator.totalsByPurpose().forEach((k, v) -> { var o = new JsonObject(); o.addProperty("calls", v[0]); o.addProperty("queries", v[1]); o.addProperty("millis", v[2]); totals.add(k, o); });
                    report.add("evaluationTotals", totals);
                    finish(null);
                }
                default -> throw new IllegalStateException("Unknown step " + step);
            }
        } catch (Throwable error) { finish(error); }
    }

    private void go(int to, int ticks) { step = to; delay = ticks; wait = 0; clientResult.set(null); }
    private int gapDistance;
    /** Where the nearest generated village has ground that is outside every one of its piece boxes but within 8 blocks of one. */
    private class_2338 villageGap(class_3218 world, class_2338 from) {
        var key = class_6862.method_40092(class_7924.field_41246, class_2960.method_60654("minecraft:village"));
        var registry = world.method_30349().method_30530(class_7924.field_41246);
        for (var start : world.method_27056().method_41035(new net.minecraft.class_1923(from), s -> registry.method_47983(s).method_40220(key))) {
            if (!start.method_16657()) continue;
            var boxes = new ArrayList<net.minecraft.class_3341>();
            for (var piece : start.method_14963()) boxes.add(((net.minecraft.class_3443) piece).method_14935());
            for (int d = 2; d <= 7; d++) for (var box : boxes) {
                int cx = (box.method_35415() + box.method_35418()) / 2, cz = (box.method_35417() + box.method_35420()) / 2;
                int[][] candidates = {{box.method_35415() - d, cz}, {box.method_35418() + d, cz}, {cx, box.method_35417() - d}, {cx, box.method_35420() + d}};
                for (int[] c : candidates) {
                    int x = c[0], z = c[1];
                    if (boxes.stream().anyMatch(b -> x >= b.method_35415() && x <= b.method_35418() && z >= b.method_35417() && z <= b.method_35420())) continue;
                    world.method_8497(x >> 4, z >> 4);
                    int y = world.method_8624(class_2902.class_2903.field_13197, x, z);
                    if (y < box.method_35416() - 3 || y > box.method_35419() + 8) continue;
                    gapDistance = d;
                    return new class_2338(x, y, z);
                }
            }
        }
        return null;
    }
    private interface Probe { Object get() throws Exception; }
    private void probe(Probe query) {
        requestClient(() -> { try { return query.get(); } catch (Exception error) { throw new RuntimeException(error); } });
    }
    private Object openChat() {
        var client = class_310.method_1551();
        if (!isHost(client.field_1755)) client.method_1507(new net.minecraft.class_408(""));
        return client.field_1755 == null ? "no screen" : "ok";
    }
    private static boolean isHost(net.minecraft.class_437 screen) {
        return screen instanceof net.minecraft.class_408 || screen instanceof com.cobblemon.mod.common.client.gui.battle.BattleGUI;
    }
    private static boolean overlayOpen() throws ReflectiveOperationException {
        var field = Class.forName("dev.rejuvenation.client.FieldNotesRenderer").getDeclaredField("overlay"); field.setAccessible(true);
        Object overlay = field.get(null); var open = overlay.getClass().getDeclaredMethod("isOpen"); open.setAccessible(true);
        return (boolean) open.invoke(overlay);
    }
    /** A genuine left click in the middle of the HUD field panel, delivered through Minecraft's mouse handler. */
    private Object clickPanel() throws ReflectiveOperationException {
        var client = class_310.method_1551();
        var current = Class.forName("dev.rejuvenation.client.FieldPanelRenderer").getDeclaredMethod("currentLayout"); current.setAccessible(true);
        Object layout = current.invoke(null); if (layout == null) return "no panel";
        var type = layout.getClass();
        double gx = (int) type.getMethod("x").invoke(layout) + (int) type.getMethod("width").invoke(layout) / 2.0, gy = (int) type.getMethod("y").invoke(layout) + (int) type.getMethod("height").invoke(layout) / 2.0;
        var window = client.method_22683();
        var mouse = client.field_1729;
        var x = mouse.getClass().getDeclaredField("field_1795"); var y = mouse.getClass().getDeclaredField("field_1794"); x.setAccessible(true); y.setAccessible(true);
        x.setDouble(mouse, gx * window.method_4480() / window.method_4486()); y.setDouble(mouse, gy * window.method_4507() / window.method_4502());
        var button = mouse.getClass().getDeclaredMethod("method_1601", long.class, int.class, int.class, int.class); button.setAccessible(true);
        button.invoke(mouse, window.method_4490(), 0, 1, 0); button.invoke(mouse, window.method_4490(), 0, 0, 0);
        return overlayOpen() ? "open" : "closed";
    }
    /** A key press and release through Minecraft's keyboard handler; key -1 only reports the state. */
    private Object pressKey(int key) throws ReflectiveOperationException {
        var client = class_310.method_1551();
        if (key >= 0) {
            var onKey = client.field_1774.getClass().getDeclaredMethod("method_1466", long.class, int.class, int.class, int.class, int.class); onKey.setAccessible(true);
            long window = client.method_22683().method_4490();
            onKey.invoke(client.field_1774, window, key, 0, 1, 0); onKey.invoke(client.field_1774, window, key, 0, 0, 0);
        }
        return (overlayOpen() ? "open" : "closed") + "|" + (isHost(client.field_1755) ? "hosted" : client.field_1755 == null ? "none" : "other");
    }
    private void next(int ticks) { step++; delay = ticks; wait = 0; clientResult.set(null); RejuvenationFields.LOG.info("Integration verification step {}", step); }
    private void check(boolean ok, String text) { if (!ok) throw new IllegalStateException("Failed: " + text); checks.add(text); }
    private void expect(String field, String source) { expectField = field; expectSource = source; }
    private boolean started() {
        boolean ok = battle != null && battle.getStarted() && battle.getTurn() >= 1 && FieldApi.current(battle.getBattleId()).isPresent();
        if (!ok && battle != null && wait > 600)
            throw new IllegalStateException("Battle did not start: started=" + battle.getStarted() + ", ended=" + battle.getEnded() + ", state=" + FieldApi.current(battle.getBattleId()) + ", log=" + battle.getBattleLog());
        return ok;
    }
    private void verifyStart(String text) {
        var origin = FieldApi.origin(battle.getBattleId()).orElseThrow();
        if (expectField != null && !expectField.equals(origin.field())) throw new IllegalStateException(text + ": got " + origin);
        if (!expectSource.equals(origin.source())) throw new IllegalStateException(text + ": source " + origin);
        checks.add(text + " [" + origin.field() + " via " + origin.source() + ": " + origin.reason() + "]");
    }

    private static void command(MinecraftServer server, String command) { server.method_3734().method_44252(server.method_3739().method_9217(), command); }
    private void tp(MinecraftServer server, double x, double y, double z) { command(server, "tp FieldCheck " + x + " " + y + " " + z); }
    /** Clear a dry walkable spot inside the real piece; retain its generated structure references. */
    private static void dryArena(MinecraftServer server, class_2338 pos) {
        int x = pos.method_10263(), y = pos.method_10264(), z = pos.method_10260();
        // Seal the perimeter as well: some generated pieces sit below surrounding water.
        command(server, "fill " + (x - 6) + " " + (y - 1) + " " + (z - 6) + " " + (x + 6) + " " + (y + 5) + " " + (z + 6) + " minecraft:stone");
        command(server, "fill " + (x - 5) + " " + y + " " + (z - 5) + " " + (x + 5) + " " + (y + 4) + " " + (z + 5) + " minecraft:air");
    }
    /** A flat, cleared ground arena in a fresh area with the given biome, so Cobblemon can place sent-out Pokémon. */
    private void platform(MinecraftServer server, class_3222 player, int x, int z, String biome) {
        var world = server.method_30002();
        world.method_8497(x >> 4, z >> 4);
        int y = world.method_8624(class_2902.class_2903.field_13197, x, z);
        command(server, "forceload add " + (x - 16) + " " + (z - 16) + " " + (x + 16) + " " + (z + 16));
        command(server, "fill " + (x - 8) + " " + (y - 1) + " " + (z - 8) + " " + (x + 8) + " " + (y - 1) + " " + (z + 8) + " minecraft:grass_block");
        command(server, "fill " + (x - 8) + " " + y + " " + (z - 8) + " " + (x + 8) + " " + (y + 6) + " " + (z + 8) + " minecraft:air");
        command(server, "fillbiome " + (x - 12) + " " + (y - 8) + " " + (z - 12) + " " + (x + 12) + " " + (y + 12) + " " + (z + 12) + " " + biome);
        tp(server, x + 0.5, y, z + 0.5);
    }
    /** The centre of a piece of the nearest generated structure in the tag, at ground level. */
    private static class_2338 locateInside(class_3218 world, String tag, class_2338 from) {
        var key = class_6862.method_40092(class_7924.field_41246, class_2960.method_60654(tag));
        var found = world.method_8487(key, from, 64, false);
        if (found == null) return null;
        var registry = world.method_30349().method_30530(class_7924.field_41246);
        world.method_8497(found.method_10263() >> 4, found.method_10260() >> 4);
        for (var start : world.method_27056().method_41035(new net.minecraft.class_1923(found), s -> registry.method_47983(s).method_40220(key))) {
            if (!start.method_16657() || start.method_14963().isEmpty()) continue;
            var center = ((net.minecraft.class_3443) start.method_14963().getFirst()).method_14935().method_22874();
            world.method_8497(center.method_10263() >> 4, center.method_10260() >> 4);
            // Use the piece's actual centre, not the heightmap (which can put us above its roof).
            return center;
        }
        return null;
    }

    private void startWild(class_3222 player, class_3218 world, List<String> moves) {
        var properties = new PokemonProperties(); properties.setSpecies("mew"); properties.setLevel(60); properties.setMoves(moves);
        var pokemon = properties.create(player);
        var party = com.cobblemon.mod.common.Cobblemon.INSTANCE.getStorage().getParty(player);
        party.clearParty(); party.add(pokemon);
        playerPokemon = pokemon;
        // Send out the registered lead before moving into the battle initialization.
        var leadEntity = pokemon.sendOut(world, new net.minecraft.class_243(player.method_23317() - 3, player.method_23318(), player.method_23321()), null, entity -> kotlin.Unit.INSTANCE);
        if (leadEntity == null) throw new IllegalStateException("Fixture player Pokemon was not sent out");
        userPokemon = pokemon.getUuid();
        var enemy = new PokemonProperties(); enemy.setSpecies("snorlax"); enemy.setLevel(60); enemy.setMoves(List.of("splash"));
        wild = enemy.createEntity(world);
        wild.method_5814(player.method_23317() + 3, player.method_23318(), player.method_23321()); wild.method_5875(true); wild.method_5977(true);
        if (!world.method_8649(wild)) throw new IllegalStateException("Fixture wild entity was not spawned in the world");
        // createEntity constructs an entity but does not install its active Pokemon
        // state. Match natural spawning so the battle actor can find its entity.
        wild.getPokemon().setState(new com.cobblemon.mod.common.pokemon.activestate.SentOutState(wild));
        // Entity.isSubmergedInWater reads tick-maintained fluid state. Let this newly
        // spawned fixture Pokemon tick before the pre-start environment capture.
        var opponent = wild;
        com.cobblemon.mod.common.api.scheduling.SchedulingFunctionsKt.afterOnServer(0.5f, () -> {
            try {
                // Cobblemon's -1 radius explicitly disables distance fleeing. This
                // unattended fixture exercises field rules, not player movement.
                var result = BattleBuilder.INSTANCE.pve(player, opponent, pokemon.getUuid(), BattleFormat.Companion.getGEN_9_SINGLES(), false, false, -1f, party);
                if (!(result instanceof SuccessfulBattleStart success)) throw new IllegalStateException("Battle start rejected: " + result);
                battle = success.getBattle();
                battlesStarted++;
            } catch (Throwable error) { finish(error); }
            return kotlin.Unit.INSTANCE;
        });
    }
    private void startBrock(class_3222 player, class_3218 world) throws Exception {
        var party = com.cobblemon.mod.common.Cobblemon.INSTANCE.getStorage().getParty(player);
        party.clearParty();
        if (party.occupied() == 0) { var lead = new PokemonProperties(); lead.setSpecies("mew"); lead.setLevel(60); lead.setMoves(List.of("splash")); party.add(lead.create(player)); }
        Class<?> mobClass = Class.forName("com.gitlab.srcmc.rctmod.world.entities.TrainerMob");
        var mob = (net.minecraft.class_1297) ((net.minecraft.class_1299<?>) mobClass.getMethod("getEntityType").invoke(null)).method_5883(world);
        mobClass.getMethod("setTrainerId", String.class).invoke(mob, "kanto_brock");
        mob.method_5814(player.method_23317() + 2, player.method_23318(), player.method_23321()); world.method_8649(mob);
        Object rct = Class.forName("com.gitlab.srcmc.rctmod.api.RCTMod").getMethod("getInstance").invoke(null);
        if (!(boolean) rct.getClass().getMethod("makeBattle", mobClass, net.minecraft.class_1657.class).invoke(rct, mob, player)) {
            Object api = null, npc = null;
            for (Object entry : ((java.util.stream.Stream<?>) Class.forName("com.gitlab.srcmc.rctapi.api.RCTApi").getMethod("getInstances").invoke(null)).toList()) {
                Object instance = ((Map.Entry<?, ?>) entry).getValue(), registry = instance.getClass().getMethod("getTrainerRegistry").invoke(instance);
                Object trainer = registry.getClass().getMethod("getById", String.class).invoke(registry, "kanto_brock");
                if (trainer != null) { api = instance; npc = trainer; break; }
            }
            if (npc == null) throw new IllegalStateException("RCT did not register kanto_brock");
            npc.getClass().getMethod("setEntity", net.minecraft.class_1309.class).invoke(npc, mob);
            Object registry = api.getClass().getMethod("getTrainerRegistry").invoke(api);
            Object me = registry.getClass().getMethod("registerPlayer", String.class, class_3222.class).invoke(registry, "rejuvenation_integration", player);
            Object manager = api.getClass().getMethod("getBattleManager").invoke(api);
            Class<?> trainerType = Class.forName("com.gitlab.srcmc.rctapi.api.trainer.Trainer");
            if (!(boolean) manager.getClass().getMethod("startSingle", trainerType, trainerType).invoke(manager, me, npc)) throw new IllegalStateException("RCT refused the Brock battle");
        }
        battle = BattleRegistry.getBattleByParticipatingPlayer(player);
        if (battle == null) throw new IllegalStateException("RCT battle did not start");
        battlesStarted++;
        wild = null;
    }
    /** The player's choice only; the opposing side decides for itself (wild AI or Run & Bun). */
    private boolean act(String move) {
        for (var actor : battle.getActors()) if (actor.getPlayerUUIDs().iterator().hasNext()) {
            if (actor.getRequest() == null || !actor.getMustChoose()) return false;
            var response = new MoveActionResponse(move, null, null);
            actor.setResponses(new ArrayList<>(List.of(response))); actor.setMustChoose(false);
        }
        // The wild side's test entity has its AI disabled: answer for it too.
        for (var actor : battle.getActors()) if (!actor.getPlayerUUIDs().iterator().hasNext() && wild != null && actor.getRequest() != null) {
            actor.setResponses(new ArrayList<>(List.of(new MoveActionResponse("splash", null, null)))); actor.setMustChoose(false);
        }
        battle.checkForInputDispatch();
        return true;
    }
    private void playerSplash() {
        for (var actor : battle.getActors()) if (actor.getPlayerUUIDs().iterator().hasNext() && actor.getRequest() != null && actor.getMustChoose()) {
            var moves = actor.getRequest().getActive().getFirst().getMoves();
            String move = moves.stream().filter(m -> !m.getDisabled()).map(InBattleMove::getId).findFirst().orElse("struggle");
            actor.setResponses(new ArrayList<>(List.of(new MoveActionResponse(move, null, null)))); actor.setMustChoose(false);
            battle.checkForInputDispatch();
        }
    }
    private void end() { if (battle != null) battle.stop(); battle = null; if (playerPokemon != null) playerPokemon.recall(); playerPokemon = null; if (wild != null) wild.method_31472(); wild = null; }

    private void requestClient(java.util.function.Supplier<Object> query) {
        clientResult.set(null);
        class_310.method_1551().execute(() -> { try { clientResult.set(query.get()); } catch (Throwable error) { clientResult.set("ERROR " + error); } });
    }
    private void screenshot(String name) {
        var client = class_310.method_1551();
        client.execute(() -> class_318.method_22690(client.field_1697, "rejuvenation-" + name + ".png", client.method_1522(), text -> {}));
        screenshots.add("screenshots/rejuvenation-" + name + ".png");
    }
    /** On the client: Battle Extras' own calculator with and without the field adapter for the hovered Leaf Blade. */
    private Object battleExtrasPreview() {
        if (!net.fabricmc.loader.api.FabricLoader.getInstance().isModLoaded("cobblemon-battle-extras")) return "SKIP Battle Extras not installed";
        var evaluations = ClientFieldState.evaluations(userPokemon, "leafblade");
        if (evaluations.isEmpty()) return null;
        try {
            Class<?> calc = Class.forName("name.modid.client.MoveDamagePreviewCalculator");
            Class<?> attackType = Class.forName("name.modid.client.MoveDamagePreviewCalculator$AttackContext"), defenceType = Class.forName("name.modid.client.MoveDamagePreviewCalculator$DefenceContext");
            Object attack = attackType.getDeclaredConstructors()[0].newInstance(60, 150, 150, 0, 0, "", true, "", "synchronize", 1f, 150, 0);
            Object defence = defenceType.getDeclaredConstructors()[0].newInstance(60, 160, 65, 110, 0f, false, 0, 0, 1f, true, false);
            var template = Moves.INSTANCE.getByName("leafblade");
            var method = calc.getMethod("calculatePreview", attackType, defenceType, com.cobblemon.mod.common.api.moves.MoveTemplate.class, float.class, float.class);
            BattleExtrasFieldAdapter.tile(null, null, null);
            Object nativePreview = method.invoke(null, attack, defence, template, 1f, 1f);
            BattleExtrasFieldAdapter.tile(userPokemon, "leafblade", template);
            Object fieldPreview = method.invoke(null, attack, defence, template, 1f, 1f);
            BattleExtrasFieldAdapter.tile(null, null, null);
            int nativeMax = (int) nativePreview.getClass().getMethod("maxPercent").invoke(nativePreview), fieldMax = (int) fieldPreview.getClass().getMethod("maxPercent").invoke(fieldPreview);
            double factor = evaluations.getFirst().factor().orElse(1);
            report.addProperty("battleExtrasNativeMaxPercent", nativeMax); report.addProperty("battleExtrasFieldMaxPercent", fieldMax); report.addProperty("battleExtrasFieldFactor", factor);
            // Previews now show the server's exact range as a share of the real target's HP, so the displayed maximum must equal that
            // exact figure (not the fixture's synthetic calculator contexts) and the field must be measurably stronger than native.
            var exact = BattleExtrasFieldAdapter.exact(evaluations.getFirst());
            report.addProperty("battleExtrasExactMaxPercent", exact.maxPercent());
            return factor > 1.05 && exact.maxPercent() > 0 && fieldMax == exact.maxPercent();
        } catch (ReflectiveOperationException error) { return "SKIP Battle Extras calculator API changed: " + error; }
    }
    private void checkMixins() throws ClassNotFoundException {
        check(Arrays.stream(Class.forName("com.cobblemon.mod.common.battles.actor.PlayerBattleActor").getDeclaredMethods()).anyMatch(m -> m.getName().contains("rejuvenation$previews")), "Choice-request preview synchronization hook applied");
        if (net.fabricmc.loader.api.FabricLoader.getInstance().isModLoaded("rbrctai"))
            check(Arrays.stream(Class.forName("com.gitlab.surilexa.rbrctai.api.ai.utils.PokeMathMax").getDeclaredMethods()).anyMatch(m -> m.getName().contains("rejuvenation$damage")),
                "Run & Bun damage adapter applied to the installed rbrctai PokeMathMax");
        if (net.fabricmc.loader.api.FabricLoader.getInstance().isModLoaded("cobblemon-battle-extras")) {
            check(Arrays.stream(Class.forName("name.modid.client.MoveDamagePreviewCalculator").getDeclaredMethods()).anyMatch(m -> m.getName().contains("rejuvenation$field")),
                "Battle Extras preview adapter applied to its MoveDamagePreviewCalculator");
            var tile = Class.forName("com.cobblemon.mod.common.client.gui.battle.subscreen.BattleMoveSelection$MoveTile");
            check(Arrays.stream(tile.getDeclaredMethods()).anyMatch(m -> m.getName().contains("rejuvenation$tile")), "Move tile context hook applied");
            report.addProperty("battleExtrasAccuracyHookApplied", Arrays.stream(tile.getDeclaredMethods()).anyMatch(m -> m.getName().contains("rejuvenation$accuracy")));
        }
    }
    private void finish(Throwable error) {
        finished = true;
        report.addProperty("success", error == null); report.add("checks", checks); report.add("skipped", skipped); report.add("battleStartTimings", timings); report.add("screenshots", screenshots);
        report.addProperty("battles", battlesStarted);
        if (error != null) { report.addProperty("error", error.toString()); report.addProperty("step", step); if (battle != null) { report.addProperty("turn", battle.getTurn()); report.add("battleLog", new Gson().toJsonTree(battle.getBattleLog())); } RejuvenationFields.LOG.error("Integration verification failed", error); }
        try { Files.createDirectories(output.getParent()); Files.writeString(output, new GsonBuilder().setPrettyPrinting().create().toJson(report)); } catch (Exception e) { throw new RuntimeException(e); }
    }
}
