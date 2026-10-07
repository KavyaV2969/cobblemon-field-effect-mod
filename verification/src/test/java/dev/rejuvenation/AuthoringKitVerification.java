package dev.rejuvenation;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import dev.rejuvenation.EnvironmentResolver.Snapshot;
import dev.rejuvenation.EnvironmentResolver.StructureHit;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * The custom-field authoring kit, through the production Java loader path: the example pack built from
 * research/custom-fields/_examples is validated by CatalogValidator together with the shipped catalog, its mapping and structure documents
 * merge by (order, resource ID) exactly as the mod merges them, and the shipped catalog itself neither contains nor ships the example.
 */
final class AuthoringKitVerification {
    private AuthoringKitVerification() {}
    private static int checks;
    private static void check(boolean ok, String message) { if (!ok) throw new AssertionError(message); checks++; }

    private static JsonObject json(Path file) throws IOException { return CatalogValidator.read(Files.newInputStream(file)); }
    private static Snapshot at(String biome, StructureHit... hits) { return new Snapshot(false, List.of(hits), biome, Set.of(), "minecraft:overworld", 70, 0, true); }
    private static RuleDocuments.Doc doc(String id, JsonObject json) { return new RuleDocuments.Doc(id, json); }

    private static JsonObject withExample(JsonObject shipped, Path pack, int order) throws IOException {
        var catalog = shipped.deepCopy();
        var base = pack.resolve("data/example/rejuvenation");
        catalog.getAsJsonObject("fields").add("example:mossy_ruins", json(base.resolve("fields/mossy_ruins.json")));
        for (String kind : List.of("mappings", "structures")) {
            var shippedDoc = new JsonObject();
            shippedDoc.addProperty("schemaVersion", 1);
            shippedDoc.add("rules", shipped.getAsJsonArray(kind));
            var exampleDoc = json(base.resolve(kind + "/example_mossy_ruins.json"));
            exampleDoc.addProperty("order", order);
            catalog.add(kind, RuleDocuments.merge(List.of(doc("rejuvenation:rejuvenation/" + kind + "/modpack.json", shippedDoc), doc("example:rejuvenation/" + kind + "/example_mossy_ruins.json", exampleDoc))));
        }
        return catalog;
    }

    /** @param shipped the validated shipped catalog; @param repo the repository root (research/test-results/example-pack must already be built). */
    static int run(JsonObject shipped, Path repo) throws IOException {
        checks = 0;
        // 1. The shipped catalog is exactly 57 original + 4 custom, with no authoring example in it.
        var fields = shipped.getAsJsonObject("fields");
        long custom = fields.entrySet().stream().filter(e -> e.getValue().getAsJsonObject().has("custom")).count();
        check(fields.size() == 61 && custom == 4, "shipped catalog is 57 original + 4 custom = 61, found " + fields.size() + " with " + custom + " custom");
        check(fields.keySet().stream().noneMatch(id -> !id.startsWith("rejuvenation:")), "every shipped field is in the rejuvenation namespace");
        for (String pack : List.of("base", "cobbleverse"))
            check(Files.notExists(repo.resolve("datapack/" + pack + "/data/example")) && !Files.exists(repo.resolve("datapack/" + pack + "/data/rejuvenation/rejuvenation/fields/mossy_ruins.json")), "the example is not in the shipped " + pack + " pack");
        check(Files.notExists(repo.resolve("research/custom-fields/mossy_ruins.json")) && Files.exists(repo.resolve("research/custom-fields/_examples/mossy_ruins.json")), "the example lives outside the production input directory");

        // 2. The example field passes the Java validator alongside the shipped catalog; the shipped catalog stays 61.
        var pack = repo.resolve("research/test-results/example-pack");
        check(Files.isRegularFile(pack.resolve("pack.mcmeta")), "example pack is built (research/build_custom_pack.py)");
        var extended = withExample(shipped, pack, 0);
        CatalogValidator.validate(extended);
        check(extended.getAsJsonObject("fields").size() == 62, "validator accepts the example as the 62nd field only inside this test catalog");
        check(fields.size() == 61, "building the extended catalog does not change the shipped one");

        // 3. Mapping behaviour. At equal order the example's document (resource ID "example:...") sorts before the shipped one, so its exact
        //    biome row decides before the shipped Cave row for the same biome; a positive order hands precedence back to the shipped rows.
        var index = EnvironmentResolver.compile(extended);
        check(EnvironmentResolver.resolve(at("minecraft:lush_caves"), index).field().equals("example:mossy_ruins"), "example biome row wins at equal order");
        check(EnvironmentResolver.resolve(at("minecraft:dripstone_caves"), index).field().equals("rejuvenation:cave"), "unmapped neighbours keep their shipped field");
        check(EnvironmentResolver.resolve(at("minecraft:plains"), index).field().equals("rejuvenation:grassy_terrain"), "unrelated biomes are unchanged");
        var trail = new StructureHit("minecraft:trail_ruins", Set.of());
        var result = EnvironmentResolver.resolve(at("minecraft:old_growth_pine_taiga", trail), index);
        check(result.field().equals("example:mossy_ruins") && result.source() == EnvironmentResolver.Source.STRUCTURE, "example structure row selects the field from inside Trail Ruins");
        check(EnvironmentResolver.resolve(at("minecraft:old_growth_pine_taiga"), index).field().equals("rejuvenation:forest"), "outside the structure the biome decides");
        // Overlapping structures: rows are checked in merged order, so at equal order the example's row is first and wins; with a later order the
        // shipped Ancient City row keeps precedence (Ancient City is a more specific place than any authoring example).
        var ancient = new StructureHit("minecraft:ancient_city", Set.of());
        check(EnvironmentResolver.resolve(at("minecraft:deep_dark", ancient, trail), index).field().equals("example:mossy_ruins"), "equal order: example structure row is checked first");
        var late = EnvironmentResolver.compile(withExample(shipped, pack, 500));
        check(EnvironmentResolver.resolve(at("minecraft:lush_caves"), late).field().equals("rejuvenation:cave"), "a later order lets the shipped row shadow the example (troubleshooting case)");
        check(EnvironmentResolver.resolve(at("minecraft:old_growth_pine_taiga", trail), late).field().equals("example:mossy_ruins"), "an unshadowed structure row is still reachable");
        check(EnvironmentResolver.resolve(at("minecraft:deep_dark", ancient, trail), late).field().equals("rejuvenation:deep_dark"), "later order: the shipped Ancient City row keeps precedence");

        // 4. Underwater and the dimension fallbacks are unaffected by the example.
        var underwater = new Snapshot(true, List.of(), "minecraft:lush_caves", Set.of(), "minecraft:overworld", 70, 0, true);
        check(EnvironmentResolver.resolve(underwater, index).field().equals("rejuvenation:underwater"), "underwater still comes first");
        return checks;
    }
}
