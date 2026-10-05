package dev.rejuvenation;

import com.google.gson.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Environmental field selection for natural battles. Precedence, highest first:
 * <ol>
 * <li>an explicit or trainer-configured field (handled by {@link FieldApi#choose}, before this resolver);</li>
 * <li>a submerged battle: the mapping rows with {@code "submerged": true};</li>
 * <li>a configured generated structure containing the battle ({@code rejuvenation/structures});</li>
 * <li>the ordered biome/tag/dimension/depth mapping rows;</li>
 * <li>the catalog default.</li>
 * </ol>
 * The resolver is pure: Minecraft state is captured into a {@link Snapshot} on the server thread and
 * the datapack is compiled into an {@link Index} once per reload, so battle start only performs lookups.
 */
public final class EnvironmentResolver {
    private EnvironmentResolver() {}
    public enum Source { UNDERWATER, STRUCTURE, BIOME, FALLBACK }
    /** A generated structure whose pieces contain the battle position, with the configured structure tags it belongs to. */
    public record StructureHit(String id, Set<String> tags) {}
    public record Snapshot(boolean submerged, List<StructureHit> structures, String biome, Set<String> biomeTags,
                           String dimension, int y, int depth, boolean skyVisible) {}
    public record Result(String field, Source source, String reason) {}

    record Rule(String biome, String tag, String dimension, Boolean submerged, Integer maxY, Integer minDepth, Boolean skyVisible, String field, String reason) {
        boolean matches(Snapshot s) {
            return (biome == null || biome.equals(s.biome())) && (tag == null || s.biomeTags().contains(tag))
                && (dimension == null || dimension.equals(s.dimension())) && (submerged == null || submerged == s.submerged())
                && (maxY == null || s.y() <= maxY) && (minDepth == null || s.depth() >= minDepth)
                && (skyVisible == null || skyVisible == s.skyVisible());
        }
    }
    record StructureRule(String structure, String tag, String field, String reason) {
        boolean matches(StructureHit hit) { return structure != null ? structure.equals(hit.id()) : hit.tags().contains(tag); }
    }

    public static final class Index {
        final List<Rule> underwater, biomes;
        final List<StructureRule> structures;
        final String fallback;
        private final Set<String> structureIds = new HashSet<>(), structureTags = new HashSet<>();
        // Ordered candidate rows per biome ID: rows naming that biome plus rows without a biome predicate.
        private final Map<String, List<Rule>> byBiome = new ConcurrentHashMap<>();
        Index(List<Rule> underwater, List<StructureRule> structures, List<Rule> biomes, String fallback) {
            this.underwater = List.copyOf(underwater); this.structures = List.copyOf(structures); this.biomes = List.copyOf(biomes); this.fallback = fallback;
            for (var row : structures) if (row.structure() != null) structureIds.add(row.structure()); else structureTags.add(row.tag());
        }
        public static final Index EMPTY = new Index(List.of(), List.of(), List.of(), "rejuvenation:indoor");
        /** Structure registry IDs named by a structure row. */
        public Set<String> structureIds() { return Collections.unmodifiableSet(structureIds); }
        /** Structure tag IDs named by a structure row. */
        public Set<String> structureTags() { return Collections.unmodifiableSet(structureTags); }
        public boolean hasStructureRules() { return !structures.isEmpty(); }
        List<Rule> biomeCandidates(String biome) {
            return byBiome.computeIfAbsent(biome == null ? "" : biome, id -> biomes.stream().filter(r -> r.biome() == null || r.biome().equals(id)).toList());
        }
    }

    public static Result resolve(Snapshot s, Index index) {
        if (s.submerged()) for (var row : index.underwater) if (row.matches(s)) return new Result(row.field(), Source.UNDERWATER, row.reason());
        if (!s.structures().isEmpty())
            for (var row : index.structures) for (var hit : s.structures()) if (row.matches(hit)) return new Result(row.field(), Source.STRUCTURE, row.reason() + " (" + hit.id() + ")");
        for (var row : index.biomeCandidates(s.biome())) if (row.matches(s)) return new Result(row.field(), Source.BIOME, row.reason());
        return new Result(index.fallback, Source.FALLBACK, "Default field");
    }

    /** Compiles a validated catalog's {@code mappings}, {@code structures} and {@code default}. */
    public static Index compile(JsonObject catalog) {
        var underwater = new ArrayList<Rule>(); var biomes = new ArrayList<Rule>(); var structures = new ArrayList<StructureRule>();
        if (catalog.has("mappings")) for (var element : catalog.getAsJsonArray("mappings")) {
            var o = element.getAsJsonObject();
            var rule = new Rule(string(o, "biome"), string(o, "tag"), string(o, "dimension"), bool(o, "submerged"), integer(o, "maxY"), integer(o, "minDepth"),
                bool(o, "skyVisible"), o.get("field").getAsString(), o.has("reason") ? o.get("reason").getAsString() : "");
            (Boolean.TRUE.equals(rule.submerged()) ? underwater : biomes).add(rule);
        }
        if (catalog.has("structures")) for (var element : catalog.getAsJsonArray("structures")) {
            var o = element.getAsJsonObject();
            structures.add(new StructureRule(string(o, "structure"), string(o, "tag"), o.get("field").getAsString(), o.has("reason") ? o.get("reason").getAsString() : ""));
        }
        return new Index(underwater, structures, biomes, catalog.has("default") ? catalog.get("default").getAsString() : "rejuvenation:indoor");
    }
    private static String string(JsonObject o, String key) { return o.has(key) ? o.get(key).getAsString() : null; }
    private static Boolean bool(JsonObject o, String key) { return o.has(key) ? o.get(key).getAsBoolean() : null; }
    private static Integer integer(JsonObject o, String key) { return o.has(key) ? o.get(key).getAsInt() : null; }
}
