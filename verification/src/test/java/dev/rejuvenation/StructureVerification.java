package dev.rejuvenation;

import com.google.gson.*;
import dev.rejuvenation.EnvironmentProbe.Participant;
import dev.rejuvenation.EnvironmentResolver.*;
import dev.rejuvenation.StructureGeometry.Box;
import java.util.*;

/**
 * Structure-based field selection: the containment policy, the probe's chunk/accessor path (through a View shaped exactly like the
 * server's chunk and structure-start data, with real Minecraft block boxes), the shipped structure rows, deterministic resolution,
 * cache invalidation and environment layers. The village layout is built from vanilla piece sizes with the open ground that real
 * villages have between buildings, which is where the reported failure occurred: positions in streets and yards are in no piece.
 */
final class StructureVerification {
    private StructureVerification() {}
    private static int checks;
    private static void check(boolean b, String text) { if (!b) throw new AssertionError(text); checks++; }

    /** A chunk and structure-start view over a hand-built layout: structure id -> starts -> piece boxes; loaded chunks only. */
    private static final class Layout implements EnvironmentProbe.View<String> {
        final Map<String, List<List<Box>>> starts = new TreeMap<>();
        final Set<Long> loaded = new HashSet<>();
        Layout loadAround(int cx, int cz, int radius) { for (int x = cx - radius; x <= cx + radius; x++) for (int z = cz - radius; z <= cz + radius; z++) loaded.add(key(x, z)); return this; }
        static long key(int cx, int cz) { return ((long) cx << 32) ^ (cz & 0xffffffffL); }
        boolean chunkLoaded(int x, int z) { return loaded.contains(key(x >> 4, z >> 4)); }
        @Override public Set<String> referenced(int x, int z) { return chunkLoaded(x, z) ? starts.keySet() : Set.of(); }
        @Override public List<List<Box>> starts(String structure, int x, int z) {
            if (!chunkLoaded(x, z)) return List.of();
            var out = new ArrayList<List<Box>>();
            for (var start : starts.getOrDefault(structure, List.of())) {
                // The start's chunk is the chunk of its first piece, as in a real structure start.
                var first = start.getFirst();
                if (loaded.contains(key(first.minX() >> 4, first.minZ() >> 4))) out.add(start);
            }
            return out;
        }
    }

    /** A plains village on flat ground (surface y=64) around a plaza at the origin: crossing streets, houses on lots, open yards. */
    private static List<Box> village() {
        var pieces = new ArrayList<Box>();
        pieces.add(new Box(-8, 62, -8, 8, 70, 8));                       // town centre plaza and well
        pieces.add(new Box(-40, 62, -1, 40, 65, 1));                     // east-west street
        pieces.add(new Box(-1, 62, -40, 1, 65, 40));                     // north-south street
        int[][] lots = {{-30, -14}, {-30, 6}, {-14, -30}, {6, -30}, {14, -14}, {14, 6}, {-14, 14}, {6, 14}, {24, -14}, {-36, -30}};
        for (var lot : lots) pieces.add(new Box(lot[0], 63, lot[1], lot[0] + 6, 69, lot[1] + 7)); // houses 7x8, floor at 63, roof at 69
        return pieces;
    }
    private static Box box(List<Box> pieces, int i) { return pieces.get(i); }

    private static Map<String, StructureHit> mapped(String... ids) {
        var tags = Map.of("minecraft:village_plains", Set.of("minecraft:village"), "repurposed_structures:village_ocean", Set.of("minecraft:village", "repurposed_structures:collections/villages"),
            "repurposed_structures:bastion_underground", Set.of("repurposed_structures:collections/bastions"), "repurposed_structures:fortress_jungle", Set.of("repurposed_structures:collections/fortresses"),
            "repurposed_structures:ancient_city_nether", Set.of("repurposed_structures:collections/ancient_cities"), "repurposed_structures:mansion_oak", Set.of("repurposed_structures:collections/mansions"));
        var map = new LinkedHashMap<String, StructureHit>();
        for (String id : ids) map.put(id, new StructureHit(id, tags.getOrDefault(id, Set.of())));
        return map;
    }
    private static List<StructureHit> probe(Layout layout, Index index, Map<String, StructureHit> mapped, Participant... who) {
        return EnvironmentProbe.structuresAt(layout, List.of(who), mapped, index.structureRows());
    }
    private static Participant at(String label, int x, int y, int z) { return new Participant(label, x, y, z); }
    private static Result select(Index index, List<StructureHit> hits, boolean submerged, String biome) {
        return EnvironmentResolver.resolve(new Snapshot(submerged, hits, biome, Set.of(), "minecraft:overworld", 64, 0, true), index);
    }

    static int run(JsonObject catalog) {
        checks = 0;
        var index = EnvironmentResolver.compile(catalog);
        String city = "rejuvenation:city", colosseum = "rejuvenation:colosseum", deepDark = "rejuvenation:deep_dark", alley = "rejuvenation:back_alley";

        // ---- geometry: exact boxes versus the bounded footprint
        var plains = StructureGeometry.Policy.PIECES;
        var foot = StructureGeometry.Policy.footprint(8, 12, 4);
        var house = new Box(10, 63, 10, 16, 69, 17);
        check(plains.contains(house, 10, 63, 10) && plains.contains(house, 16, 69, 17) && !plains.contains(house, 9, 66, 12) && !plains.contains(house, 17, 66, 12), "Exact piece boundaries are inclusive");
        check(foot.contains(house, 2, 66, 12) && !foot.contains(house, 1, 66, 12), "Footprint reaches exactly 8 blocks west of a piece");
        check(foot.contains(house, 24, 66, 12) && !foot.contains(house, 25, 66, 12), "... and 8 blocks east");
        check(foot.contains(house, 12, 66, 2) && !foot.contains(house, 12, 66, 1) && foot.contains(house, 12, 66, 25) && !foot.contains(house, 12, 66, 26), "... and 8 blocks north and south");
        check(foot.contains(house, 12, 81, 12) && !foot.contains(house, 12, 82, 12), "Footprint reaches 12 blocks above the roof");
        check(foot.contains(house, 12, 59, 12) && !foot.contains(house, 12, 58, 12), "Footprint reaches 4 blocks below the floor, no deeper (caves under a village stay caves)");
        check(foot.contains(house, 2, 66, 2) && !foot.contains(house, 1, 66, 2) && !foot.contains(house, 2, 66, 1), "The margin is a square around the box: the corner is in, one block further out is not");
        for (var bad : List.of(new int[]{-1, 0, 0}, new int[]{33, 0, 0}, new int[]{0, 65, 0}, new int[]{0, 0, 33})) {
            try { StructureGeometry.Policy.footprint(bad[0], bad[1], bad[2]); throw new AssertionError("Out-of-range margin accepted"); } catch (IllegalArgumentException expected) { checks++; }
        }
        try { new Box(1, 1, 1, 0, 1, 1); throw new AssertionError("Empty box accepted"); } catch (IllegalArgumentException expected) { checks++; }

        // ---- Minecraft's own block box maps to the pure box (minX, minY, minZ, maxX, maxY, maxZ)
        var real = new net.minecraft.class_3341(-3, 40, 7, 12, 61, 29);
        check(EnvironmentProbe.box(real).equals(new Box(-3, 40, 7, 12, 61, 29)), "BlockBox getters map to (minX,minY,minZ,maxX,maxY,maxZ)");
        check(EnvironmentProbe.box(new net.minecraft.class_3341(5, 5, 5, 5, 5, 5)).contains(5, 5, 5), "A one-block box contains its block");

        // ---- the shipped rows: villages take the footprint, everything else exact pieces
        var rows = index.structureRows();
        for (var row : rows) {
            boolean village = row.field().equals(city);
            check(village ? row.policy().equals(foot) : row.policy().equals(plains), "Containment of row " + (row.structure() != null ? row.structure() : "#" + row.tag()));
        }
        check(rows.getFirst().field().equals(deepDark), "Ancient City is the first (highest priority) row");

        // ---- the reported failure: a village's streets, yards and gaps are in no piece
        var layout = new Layout().loadAround(0, 0, 4);
        layout.starts.put("minecraft:village_plains", List.of(village()));
        var villagePieces = village();
        var map = mapped("minecraft:village_plains");
        // Inside a building and on a street: the old exact-piece rule already worked.
        var inside = probe(layout, index, map, at("anchor", 33 - 3, 66, -14 + 3));
        check(inside.size() == 1 && select(index, inside, false, "minecraft:plains").field().equals(city), "Inside a house is City");
        check(probe(layout, index, map, at("anchor", 20, 63, 0)).size() == 1, "On a street piece is City");
        // Gaps: open ground between pieces. With exact boxes (the old behaviour) none of these is in a piece.
        int[][] gaps = {{-20, 64, -8}, {10, 64, 8}, {-20, 64, 20}, {3, 64, -20}, {22, 64, 10}, {-27, 64, -3}};
        for (var g : gaps) {
            check(StructureGeometry.containing(villagePieces, g[0], g[1], g[2], plains) < 0, "Old exact-piece rule misses the gap at " + Arrays.toString(g));
            var hits = probe(layout, index, map, at("anchor", g[0], g[1], g[2]));
            check(hits.size() == 1, "Footprint policy finds the gap at " + Arrays.toString(g));
            var result = select(index, hits, false, "minecraft:plains");
            check(result.field().equals(city) && result.source() == Source.STRUCTURE, "Village gap selects City at " + Arrays.toString(g));
            check(result.reason().contains("footprint(8/12/4)") && result.reason().length() < 400, "Bounded evidence names the policy: " + result.reason());
        }
        // Boundaries around the nearest piece (the east end of the east-west street at x=40: its last block, 8 and 9 blocks further).
        check(probe(layout, index, map, at("anchor", 40, 64, 0)).size() == 1 && probe(layout, index, map, at("anchor", 48, 64, 0)).size() == 1, "Up to 8 blocks past the end of a street is the village");
        check(probe(layout, index, map, at("anchor", 49, 64, 0)).isEmpty(), "9 blocks past the end of the last piece is not");
        check(probe(layout, index, map, at("anchor", 120, 64, 120)).isEmpty() && probe(layout, index, map, at("anchor", 60, 64, 60)).isEmpty(), "Open country around the village stays its biome");
        // Vertical: caves below, roofs and the sky above.
        check(probe(layout, index, map, at("anchor", -20, 64, -8)).size() == 1, "Ground level");
        check(probe(layout, index, map, at("anchor", -20, 57, -8)).isEmpty() && probe(layout, index, map, at("anchor", -20, 40, -8)).isEmpty(), "A cave under the village is not City (at most 4 blocks below the nearest floor)");
        check(probe(layout, index, map, at("anchor", 20, 58, 0)).size() == 1 && probe(layout, index, map, at("anchor", 20, 57, 0)).isEmpty(), "Vertical limit is exactly 4 below the street piece's floor");
        check(probe(layout, index, map, at("anchor", 33, 81, -11)).size() == 1 && probe(layout, index, map, at("anchor", 33, 82, -11)).isEmpty(), "Above the roofs is bounded: 12 blocks over the highest nearby piece");
        check(probe(layout, index, map, at("anchor", 20, 100, 8)).isEmpty() && probe(layout, index, map, at("anchor", 20, 150, 8)).isEmpty(), "High above the village is not City");
        // A chunk that is not loaded contributes nothing; the probe never asks for terrain.
        var cold = new Layout(); cold.starts.put("minecraft:village_plains", List.of(village()));
        check(probe(cold, index, map, at("anchor", 33, 66, -11)).isEmpty(), "No loaded chunk, no hit (nothing is loaded or generated for the battle)");
        var partial = new Layout().loadAround(0, 0, 0); partial.starts.put("minecraft:village_plains", List.of(village().stream().map(b -> new Box(b.minX() + 400, b.minY(), b.minZ() + 400, b.maxX() + 400, b.maxY(), b.maxZ() + 400)).toList()));
        check(probe(partial, index, map, at("anchor", 410, 64, 410)).isEmpty(), "A village whose start chunk is not loaded cannot be confirmed");

        // ---- participants: the wild Pokemon, then each player; any of them inside decides
        var gapPos = at("anchor", 60, 64, 60);
        var hitPlayer = probe(layout, index, map, gapPos, at("player", -20, 64, -8));
        check(hitPlayer.size() == 1 && hitPlayer.getFirst().evidence().startsWith("player "), "A player inside the village decides when the anchor stands outside");
        var both = probe(layout, index, map, at("anchor", 10, 64, 8), at("player", -20, 64, -8));
        check(both.getFirst().evidence().startsWith("anchor "), "Anchor first, then players in battle order (deterministic)");
        check(probe(layout, index, map, gapPos, at("player", 70, 64, 70)).isEmpty(), "No participant inside: no structure");

        // ---- every required structure family through the shipped rows, vanilla and modded
        var pieceBox = List.of(new Box(100, 20, 100, 140, 60, 140));
        for (var row : new Object[][]{
            {"minecraft:ancient_city", deepDark}, {"repurposed_structures:ancient_city_nether", deepDark},
            {"minecraft:bastion_remnant", colosseum}, {"repurposed_structures:bastion_underground", colosseum},
            {"minecraft:fortress", colosseum}, {"repurposed_structures:fortress_jungle", colosseum},
            {"minecraft:mansion", alley}, {"repurposed_structures:mansion_oak", alley},
            {"minecraft:village_plains", city}, {"repurposed_structures:village_ocean", city}, {"bca:village/default_mid", city}, {"bca:village/fighting_large", city}}) {
            var l = new Layout().loadAround(7, 7, 3); l.starts.put((String) row[0], List.of(pieceBox));
            var hits = probe(l, index, mapped((String) row[0]), at("anchor", 120, 40, 120));
            check(hits.size() == 1 && select(index, hits, false, "minecraft:plains").field().equals(row[1]), row[0] + " -> " + row[1]);
        }
        // Exact-piece structures do not claim their surroundings, villages do.
        for (var id : List.of("minecraft:fortress", "minecraft:bastion_remnant", "minecraft:ancient_city", "minecraft:mansion")) {
            var l = new Layout().loadAround(7, 7, 3); l.starts.put(id, List.of(pieceBox));
            check(probe(l, index, mapped(id), at("anchor", 100, 40, 99)).isEmpty() && probe(l, index, mapped(id), at("anchor", 100, 40, 100)).size() == 1, id + " uses exact pieces");
        }
        var wl = new Layout().loadAround(7, 7, 3); wl.starts.put("bca:village/witch_hut", List.of(pieceBox));
        check(probe(wl, index, mapped("bca:village/witch_hut"), at("anchor", 120, 40, 120)).isEmpty(), "A swamp witch hut is not a village");
        check(probe(new Layout().loadAround(7, 7, 3), index, mapped("minecraft:stronghold"), at("anchor", 120, 40, 120)).isEmpty(), "An unmapped structure is ignored");

        // ---- deterministic when structures overlap
        var overlap = new Layout().loadAround(0, 0, 4);
        overlap.starts.put("minecraft:village_plains", List.of(village())); overlap.starts.put("minecraft:ancient_city", List.of(List.of(new Box(-30, 50, -30, 30, 80, 30))));
        overlap.starts.put("minecraft:fortress", List.of(List.of(new Box(-30, 50, -30, 30, 80, 30))));
        var allMapped = mapped("minecraft:village_plains", "minecraft:ancient_city", "minecraft:fortress");
        var reversed = new LinkedHashMap<String, StructureHit>(); new ArrayList<>(allMapped.entrySet()).reversed().forEach(e -> reversed.put(e.getKey(), e.getValue()));
        for (var m : List.of(allMapped, reversed))
            for (var who : List.of(List.of(at("anchor", 0, 64, 5), at("player", 20, 64, 0)), List.of(at("player", 20, 64, 0), at("anchor", 0, 64, 5))))
                check(select(index, EnvironmentProbe.structuresAt(overlap, who, m, index.structureRows()), false, "minecraft:plains").field().equals(deepDark), "Ancient City outranks Colosseum and City whatever the registry or participant order");
        overlap.starts.remove("minecraft:ancient_city");
        check(select(index, EnvironmentProbe.structuresAt(overlap, List.of(at("anchor", 0, 64, 5)), allMapped, index.structureRows()), false, "minecraft:plains").field().equals(colosseum), "Colosseum arenas outrank villages");

        // ---- precedence: underwater and explicit/trainer selections never consult structures
        var village = probe(layout, index, map, at("anchor", -20, 64, -8));
        var wet = select(index, village, true, "minecraft:plains");
        check(wet.field().equals("rejuvenation:underwater") && wet.source() == Source.UNDERWATER && wet.substrate() == null, "Underwater beats a village and carries no substrate");
        var explicit = new EnumMap<FieldApi.Priority, String>(FieldApi.Priority.class); explicit.put(FieldApi.Priority.TRAINER, "rejuvenation:crystal_cavern");
        check(FieldApi.choose(explicit, city, List.of(), true).field().equals("rejuvenation:crystal_cavern") && FieldApi.choose(explicit, "rejuvenation:icy", List.of("rejuvenation:grassy_terrain"), true).layers().isEmpty(), "A trainer-configured field wins and never takes a natural substrate");
        explicit.clear(); explicit.put(FieldApi.Priority.EXPLICIT, "rejuvenation:icy");
        check(FieldApi.choose(explicit, null, List.of("rejuvenation:grassy_terrain"), false).layers().isEmpty(), "An explicitly selected Icy field has no substrate");

        // ---- environment layers
        var frozen = select(index, List.of(), false, "minecraft:frozen_ocean");
        check(frozen.field().equals("rejuvenation:icy") && "rejuvenation:water_surface".equals(frozen.substrate()), "Frozen Ocean: Icy over Water Surface");
        check("rejuvenation:grassy_terrain".equals(select(index, List.of(), false, "minecraft:snowy_plains").substrate()), "Snowy Plains: Icy over Grassy Terrain");
        check(select(index, List.of(), false, "minecraft:ice_spikes").substrate() == null && select(index, List.of(), false, "minecraft:plains").substrate() == null, "Ice Spikes and plain biomes carry no layer");
        var deep = EnvironmentResolver.resolve(new Snapshot(false, List.of(), "minecraft:snowy_plains", Set.of(), "minecraft:overworld", 20, 40, false), index);
        check(deep.field().equals("rejuvenation:icy") && "rejuvenation:cave".equals(deep.substrate()), "Frozen underground: Icy over Cave");
        var layered = FieldApi.choose(null, frozen.field(), List.of(frozen.substrate()), true);
        check(layered.layers().equals(List.of("rejuvenation:water_surface")) && layered.field().equals("rejuvenation:icy"), "A wild battle carries the derived layers");
        check(FieldApi.choose(null, frozen.field(), List.of(frozen.substrate()), false).layers().isEmpty(), "A trainer or PvP battle without a configured field stays on Indoor with no layers");

        // ---- cache invalidation by registry and catalog revision
        var cache = new EnvironmentProbe.MappedCache<Object, String>();
        var registryA = new Object(); var registryB = new Object(); int[] builds = {0};
        java.util.function.Function<Object, Map<String, StructureHit>> build = r -> { builds[0]++; return Map.of("s", new StructureHit("s", Set.of())); };
        var first = cache.get(registryA, 1, build);
        check(cache.get(registryA, 1, build) == first && builds[0] == 1, "Same registry and revision: no rebuild");
        cache.get(registryA, 2, build); check(builds[0] == 2, "A datapack reload (new revision) rebuilds");
        cache.get(registryB, 2, build); check(builds[0] == 3, "A new registry (server restart) rebuilds");
        check(cache.get(registryB, 2, build) != null && builds[0] == 3, "Stable afterwards");

        // ---- malformed rows are rejected by the reload validator
        for (var change : List.<java.util.function.Consumer<JsonObject>>of(
            c -> c.getAsJsonArray("structures").get(8).getAsJsonObject().add("containment", JsonParser.parseString("{\"mode\":\"footprint\",\"horizontal\":99,\"above\":12,\"below\":4}")),
            c -> c.getAsJsonArray("structures").get(8).getAsJsonObject().add("containment", JsonParser.parseString("{\"mode\":\"footprint\",\"horizontal\":8}")),
            c -> c.getAsJsonArray("structures").get(8).getAsJsonObject().add("containment", JsonParser.parseString("{\"mode\":\"radius\",\"horizontal\":8,\"above\":1,\"below\":1}")),
            c -> c.getAsJsonArray("structures").get(8).getAsJsonObject().add("containment", JsonParser.parseString("{\"mode\":\"pieces\",\"horizontal\":8}")),
            c -> c.getAsJsonArray("structures").get(8).getAsJsonObject().add("containment", JsonParser.parseString("{\"mode\":\"footprint\",\"horizontal\":8,\"above\":12,\"below\":4,\"script\":\"x\"}")),
            c -> c.getAsJsonArray("mappings").get(c.getAsJsonArray("mappings").size() - 1).getAsJsonObject().addProperty("substrate", "rejuvenation:nowhere"),
            c -> c.getAsJsonArray("mappings").get(c.getAsJsonArray("mappings").size() - 1).getAsJsonObject().addProperty("substrate", "rejuvenation:indoor"),
            c -> c.getAsJsonArray("mappings").get(c.getAsJsonArray("mappings").size() - 1).getAsJsonObject().add("substrate", JsonParser.parseString("7")))) {
            var malformed = catalog.deepCopy(); change.accept(malformed);
            try { CatalogValidator.validate(malformed); throw new AssertionError("Malformed environment row accepted"); } catch (IllegalArgumentException expected) { checks++; }
        }
        return checks;
    }
}
