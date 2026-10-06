package dev.rejuvenation;

import com.google.gson.*;
import dev.rejuvenation.EnvironmentResolver.*;
import java.util.*;

/** Environmental field precedence: trainer/explicit > underwater > configured structure > biome > fallback. */
final class EnvironmentVerification {
    private EnvironmentVerification() {}
    private static int checks;
    private static void check(boolean b, String text) { if (!b) throw new AssertionError(text); checks++; }
    private static Snapshot at(String biome, boolean submerged, StructureHit... structures) {
        return new Snapshot(submerged, List.of(structures), biome, Set.of(), "minecraft:overworld", 70, 0, true);
    }
    private static StructureHit structure(String id, String... tags) { return new StructureHit(id, Set.of(tags)); }
    private static final StructureHit VILLAGE = structure("minecraft:village_plains", "minecraft:village");
    private static final StructureHit MANSION = structure("minecraft:mansion");

    /** The pre-index algorithm: the first matching mapping row in catalog order, then the default. */
    private static String linear(JsonObject catalog, Snapshot s) {
        for (var e : catalog.getAsJsonArray("mappings")) {
            var r = e.getAsJsonObject();
            if (r.has("biome") && !r.get("biome").getAsString().equals(s.biome())) continue;
            if (r.has("tag") && !s.biomeTags().contains(r.get("tag").getAsString())) continue;
            if (r.has("dimension") && !r.get("dimension").getAsString().equals(s.dimension())) continue;
            if (r.has("submerged") && r.get("submerged").getAsBoolean() != s.submerged()) continue;
            if (r.has("maxY") && s.y() > r.get("maxY").getAsInt()) continue;
            if (r.has("minDepth") && s.depth() < r.get("minDepth").getAsInt()) continue;
            if (r.has("skyVisible") && r.get("skyVisible").getAsBoolean() != s.skyVisible()) continue;
            return r.get("field").getAsString();
        }
        return catalog.get("default").getAsString();
    }

    static int run(JsonObject catalog) {
        checks = 0;
        var index = EnvironmentResolver.compile(catalog);
        String underwater = "rejuvenation:underwater", city = "rejuvenation:city", alley = "rejuvenation:back_alley", grassy = "rejuvenation:grassy_terrain";
        // Explicit RCT trainer field wins over every environmental source, in trainer and wild battles alike.
        var trainer = new EnumMap<FieldApi.Priority, String>(FieldApi.Priority.class); trainer.put(FieldApi.Priority.TRAINER, "rejuvenation:crystal_cavern");
        for (var snapshot : List.of(at("minecraft:plains", true, VILLAGE), at("minecraft:plains", true), at("minecraft:plains", false, VILLAGE), at("minecraft:plains", false, MANSION), at("minecraft:plains", false))) {
            var derived = EnvironmentResolver.resolve(snapshot, index).field();
            check(FieldApi.choose(trainer, derived, true).field().equals("rejuvenation:crystal_cavern"), "Explicit RCT field overrides " + derived + " in a wild battle");
            check(FieldApi.choose(trainer, derived, false).field().equals("rejuvenation:crystal_cavern"), "Explicit RCT field overrides " + derived + " in a trainer battle");
        }
        check(EnvironmentResolver.resolve(at("minecraft:plains", true), index).field().equals(underwater), "Explicit RCT precondition: underwater resolves");
        // Underwater overrides structure and biome.
        var r = EnvironmentResolver.resolve(at("minecraft:plains", true, VILLAGE), index);
        check(r.field().equals(underwater) && r.source() == Source.UNDERWATER, "Underwater overrides a village");
        check(EnvironmentResolver.resolve(at("minecraft:plains", true, MANSION), index).field().equals(underwater), "Underwater overrides a mansion");
        for (String biome : List.of("minecraft:plains", "minecraft:desert", "minecraft:ocean", "minecraft:mushroom_fields", "minecraft:deep_dark"))
            check(EnvironmentResolver.resolve(at(biome, true), index).field().equals(underwater), "Underwater overrides biome " + biome);
        var otherDimension = new Snapshot(true, List.of(), "legendarymonuments:distortion_world_biome", Set.of(), "legendarymonuments:distortion_world", 70, 0, true);
        check(EnvironmentResolver.resolve(otherDimension, index).field().equals(underwater), "Underwater applies in every dimension");
        // Configured structures.
        r = EnvironmentResolver.resolve(at("minecraft:dark_forest", false, MANSION), index);
        check(r.field().equals(alley) && r.source() == Source.STRUCTURE, "Woodland Mansion -> Back Alley");
        check(EnvironmentResolver.resolve(at("minecraft:dark_forest", false, structure("repurposed_structures:mansion_birch", "repurposed_structures:collections/mansions")), index).field().equals(alley), "Mansion variant -> Back Alley");
        for (String village : List.of("plains", "desert", "savanna", "snowy", "taiga")) {
            r = EnvironmentResolver.resolve(at("minecraft:plains", false, structure("minecraft:village_" + village, "minecraft:village")), index);
            check(r.field().equals(city) && r.source() == Source.STRUCTURE, "Village " + village + " -> City");
            // Also without tag binding (an ID row alone must suffice for vanilla villages).
            check(EnvironmentResolver.resolve(at("minecraft:plains", false, structure("minecraft:village_" + village)), index).field().equals(city), "Village ID " + village + " -> City");
        }
        check(EnvironmentResolver.resolve(at("minecraft:jungle", false, structure("repurposed_structures:village_jungle", "minecraft:village")), index).field().equals(city), "Tagged village variant -> City");
        check(index.structureIds().contains("minecraft:mansion") && index.structureTags().contains("minecraft:village"), "Structure index");
        // Unmapped structures fall through to the biome.
        for (String other : List.of("minecraft:stronghold", "minecraft:trail_ruins", "minecraft:pillager_outpost")) {
            r = EnvironmentResolver.resolve(at("minecraft:forest", false, structure(other)), index);
            check(r.field().equals("rejuvenation:forest") && r.source() == Source.BIOME, "Unmapped " + other + " falls through to its biome");
        }
        // Updated biome mappings.
        check(EnvironmentResolver.resolve(at("minecraft:plains", false), index).field().equals(grassy), "Plains -> Grassy Terrain");
        check(EnvironmentResolver.resolve(at("minecraft:sunflower_plains", false), index).field().equals(grassy), "Sunflower Plains -> Grassy Terrain, not Flower Garden");
        check(EnvironmentResolver.resolve(at("minecraft:mushroom_fields", false), index).field().equals("rejuvenation:fairytale"), "Mushroom Fields -> Fairy Tale");
        var deepMushroom = new Snapshot(false, List.of(), "minecraft:mushroom_fields", Set.of(), "minecraft:overworld", 20, 40, false);
        check(EnvironmentResolver.resolve(deepMushroom, index).field().equals("rejuvenation:cave"), "Deep below Mushroom Fields is a cave");
        for (var e : catalog.getAsJsonArray("mappings")) {
            var row = e.getAsJsonObject();
            if (row.has("biome") && row.get("biome").getAsString().endsWith("plains"))
                check(!row.get("field").getAsString().startsWith("rejuvenation:flower_garden"), "No plains biome maps to Flower Garden: " + row);
        }
        // Ordinary biome behaviour is unchanged: the index equals the pre-index linear algorithm for every biome and situation.
        Set<String> biomes = new TreeSet<>();
        for (var e : catalog.getAsJsonArray("mappings")) if (e.getAsJsonObject().has("biome")) biomes.add(e.getAsJsonObject().get("biome").getAsString());
        biomes.add("modded:unknown_biome");
        var tagSets = List.of(Set.<String>of(), Set.of("minecraft:is_forest"), Set.of("c:is_swamp", "minecraft:is_river"));
        int compared = 0;
        for (String biome : biomes) for (String dimension : List.of("minecraft:overworld", "minecraft:the_nether", "lumymon:origin"))
            for (int depth : new int[]{0, 12, 30}) for (int y : new int[]{-10, 0, 64}) for (boolean sky : new boolean[]{true, false}) for (var tags : tagSets) {
                var s = new Snapshot(false, List.of(), biome, tags, dimension, y, depth, sky);
                check(EnvironmentResolver.resolve(s, index).field().equals(linear(catalog, s)), "Indexed biome resolution equals ordered rules for " + s);
                compared++;
            }
        check(compared > 10000, "Exhaustive biome grid");
        check(EnvironmentResolver.resolve(at("minecraft:forest", false), index).field().equals("rejuvenation:forest"), "Forest unchanged");
        check(EnvironmentResolver.resolve(at("minecraft:desert", false), index).field().equals("rejuvenation:desert"), "Desert unchanged");
        check(EnvironmentResolver.resolve(at("minecraft:ocean", false), index).field().equals("rejuvenation:water_surface"), "Ocean surface unchanged");
        check(EnvironmentResolver.resolve(at("minecraft:flower_forest", false), index).field().equals("rejuvenation:flower_garden_2"), "Flower Forest unchanged");
        r = EnvironmentResolver.resolve(new Snapshot(false, List.of(), "modded:unknown", Set.of(), "modded:dimension", 64, 0, true), index);
        check(r.field().equals("rejuvenation:indoor") && r.source() == Source.FALLBACK, "Fallback");
        // Malformed structure rows are rejected by the reload validator.
        for (String bad : List.of("{\"structure\":\"minecraft:mansion\",\"tag\":\"minecraft:village\",\"field\":\"rejuvenation:city\"}",
                "{\"field\":\"rejuvenation:city\"}", "{\"structure\":\"Mansion\",\"field\":\"rejuvenation:city\"}",
                "{\"structure\":\"minecraft:mansion\",\"field\":\"rejuvenation:nowhere\"}", "{\"structure\":\"minecraft:mansion\",\"field\":\"rejuvenation:city\",\"biome\":\"x:y\"}")) {
            var malformed = catalog.deepCopy(); malformed.getAsJsonArray("structures").add(JsonParser.parseString(bad));
            try { CatalogValidator.validate(malformed); throw new AssertionError("Malformed structure mapping accepted: " + bad); } catch (IllegalArgumentException expected) { checks++; }
        }
        return checks;
    }
}
