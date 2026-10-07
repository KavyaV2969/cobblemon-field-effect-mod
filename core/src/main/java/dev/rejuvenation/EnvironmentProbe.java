package dev.rejuvenation;

import com.cobblemon.mod.common.api.battles.model.PokemonBattle;
import com.cobblemon.mod.common.api.battles.model.actor.EntityBackedBattleActor;
import dev.rejuvenation.EnvironmentResolver.StructureHit;
import dev.rejuvenation.EnvironmentResolver.StructureRule;
import dev.rejuvenation.StructureGeometry.Box;
import net.minecraft.class_1297;
import net.minecraft.class_1657;
import net.minecraft.class_1923;
import net.minecraft.class_2338;
import net.minecraft.class_2378;
import net.minecraft.class_2902;
import net.minecraft.class_2960;
import net.minecraft.class_3195;
import net.minecraft.class_3215;
import net.minecraft.class_3218;
import net.minecraft.class_3341;
import net.minecraft.class_6862;
import net.minecraft.class_7924;
import java.util.*;
import java.util.function.Function;

/**
 * Captures the Minecraft state a wild battle's field depends on, on the server thread at battle pre-start.
 *
 * Anchor: the wild Pokémon (first non-player entity-backed actor), else the first player. The battle is
 * submerged when the anchor and every participating player are submerged in water ({@code isSubmergedInWater}),
 * so a player on a shore or boat battling a submerged Pokémon is not "underwater".
 *
 * Structures: only structures named by a structure row are examined, through a per-server, per-catalog-revision identity
 * map built once from the structure registry. For each battle participant (anchor first, then players in battle order) the
 * chunk's structure references name the candidate structures and the loaded start chunks hold their piece boxes; the row's
 * {@link StructureGeometry.Policy} then decides containment. Nothing is generated or loaded for the battle: a chunk that is
 * not already loaded contributes nothing, and no registry or tag work happens per battle.
 */
final class EnvironmentProbe {
    private EnvironmentProbe() {}
    record Capture(EnvironmentResolver.Snapshot snapshot, boolean anchorSubmerged) {}

    /** The slice of world structure data the probe reads; tests supply API-shaped layouts, the server supplies {@link WorldView}. */
    interface View<S> {
        /** Structures referenced by the (loaded) chunk containing the column, empty when it is not loaded. */
        Set<S> referenced(int x, int z);
        /** Piece boxes of every loaded start of the structure that the column's chunk references. */
        List<List<Box>> starts(S structure, int x, int z);
    }

    /** A battle participant's block position; {@code label} names it in the debug evidence. */
    record Participant(String label, int x, int y, int z) {}

    /**
     * Rows in priority order, participants in battle order, candidate structures by ID: the first confirmed containment wins,
     * so overlapping structures and participants always resolve the same way. Returns at most one hit.
     */
    static <S> List<StructureHit> structuresAt(View<S> view, List<Participant> participants, Map<S, StructureHit> mapped, List<StructureRule> rows) {
        if (mapped.isEmpty() || participants.isEmpty()) return List.of();
        var candidates = new HashMap<Participant, List<Map.Entry<S, StructureHit>>>();
        for (var who : participants) {
            var found = new ArrayList<Map.Entry<S, StructureHit>>();
            for (S structure : view.referenced(who.x(), who.z())) { var hit = mapped.get(structure); if (hit != null) found.add(Map.entry(structure, hit)); }
            found.sort(Comparator.comparing(entry -> entry.getValue().id()));
            candidates.put(who, found);
        }
        var starts = new HashMap<String, List<List<Box>>>();
        for (int r = 0; r < rows.size(); r++) {
            var row = rows.get(r);
            for (var who : participants)
                for (var candidate : candidates.get(who)) {
                    if (!row.matches(candidate.getValue())) continue;
                    var key = candidate.getValue().id() + "@" + (who.x() >> 4) + "," + (who.z() >> 4);
                    var pieces = starts.computeIfAbsent(key, k -> view.starts(candidate.getKey(), who.x(), who.z()));
                    for (var start : pieces) {
                        int piece = StructureGeometry.containing(start, who.x(), who.y(), who.z(), row.policy());
                        if (piece >= 0) return List.of(candidate.getValue().confirmedBy(r, who.label() + " " + who.x() + "," + who.y() + "," + who.z()
                            + " inside " + row.policy() + " of piece " + piece + " [" + start.get(piece) + "]"));
                    }
                }
        }
        return List.of();
    }

    /** Minecraft's own block box as the pure box: (minX, minY, minZ, maxX, maxY, maxZ). */
    static Box box(class_3341 b) { return new Box(b.method_35415(), b.method_35416(), b.method_35417(), b.method_35418(), b.method_35419(), b.method_35420()); }

    /** The production view: only chunks that are already loaded are read, so a battle never loads or generates terrain. */
    static final class WorldView implements View<class_3195> {
        private final class_3215 chunks;
        WorldView(class_3218 world) { chunks = world.method_14178(); }
        @Override public Set<class_3195> referenced(int x, int z) {
            var chunk = chunks.method_21730(x >> 4, z >> 4);
            return chunk == null ? Set.of() : chunk.method_12179().keySet();
        }
        @Override public List<List<Box>> starts(class_3195 structure, int x, int z) {
            var chunk = chunks.method_21730(x >> 4, z >> 4);
            if (chunk == null) return List.of();
            var result = new ArrayList<List<Box>>();
            for (long packed : chunk.method_12180(structure)) {
                var at = new class_1923(packed);
                var holder = chunks.method_21730(at.field_9181, at.field_9180);
                var start = holder == null ? null : holder.method_12181(structure);
                if (start == null || !start.method_16657()) continue;
                var boxes = new ArrayList<Box>();
                for (var piece : start.method_14963()) boxes.add(box(piece.method_14935()));
                result.add(boxes);
            }
            return result;
        }
    }

    /** Structures named by a structure row, by ID or tag, for one registry and catalog revision. Rebuilt only when either changes. */
    static final class MappedCache<R, S> {
        private record Entry<R, S>(R registry, long revision, Map<S, StructureHit> mapped) {}
        private volatile Entry<R, S> cache;
        Map<S, StructureHit> get(R registry, long revision, Function<R, Map<S, StructureHit>> build) {
            var current = cache;
            if (current != null && current.registry() == registry && current.revision() == revision) return current.mapped();
            var built = Collections.unmodifiableMap(build.apply(registry));
            cache = new Entry<>(registry, revision, built);
            return built;
        }
    }
    private static final MappedCache<class_2378<class_3195>, class_3195> cache = new MappedCache<>();

    static Capture capture(PokemonBattle battle, RejuvenationFields.Catalog catalog) {
        class_1297 anchor = null;
        for (var actor : battle.getActors())
            if (actor instanceof EntityBackedBattleActor<?> entity && entity.getEntity() != null && !(entity.getEntity() instanceof class_1657)) { anchor = entity.getEntity(); break; }
        List<class_1297> players = new ArrayList<>(battle.getPlayers());
        if (anchor == null && !players.isEmpty()) anchor = players.getFirst();
        if (anchor == null) return null;
        boolean anchorSubmerged = anchor.method_5869();
        boolean submerged = anchorSubmerged;
        for (var player : players) submerged &= player.method_5869();
        var world = anchor.method_37908(); class_2338 pos = anchor.method_24515();
        var biome = world.method_23753(pos);
        String biomeId = biome.method_40230().map(k -> k.method_29177().toString()).orElse("");
        Set<String> tags = new HashSet<>(); biome.method_40228().forEach(t -> tags.add(t.comp_327().toString()));
        String dimension = world.method_27983().method_29177().toString();
        int depth = world.method_8624(class_2902.class_2903.field_13203, pos.method_10263(), pos.method_10260()) - pos.method_10264();
        List<StructureHit> structures = List.of();
        if (catalog.environment().hasStructureRules() && world instanceof class_3218 server) {
            var who = new ArrayList<Participant>(); who.add(new Participant("anchor", pos.method_10263(), pos.method_10264(), pos.method_10260()));
            for (var player : players) if (player.method_37908() == world) { var p = player.method_24515(); who.add(new Participant("player", p.method_10263(), p.method_10264(), p.method_10260())); }
            structures = structuresAt(new WorldView(server), who, mapped(server, catalog), catalog.environment().structureRows());
        }
        var snapshot = new EnvironmentResolver.Snapshot(submerged, structures, biomeId, tags, dimension, pos.method_10264(), depth, world.method_8311(pos));
        return new Capture(snapshot, anchorSubmerged);
    }

    /** Structures named by a structure row, by ID or tag, for this server's registry and catalog revision. */
    static Map<class_3195, StructureHit> mapped(class_3218 world, RejuvenationFields.Catalog catalog) {
        class_2378<class_3195> registry = world.method_30349().method_30530(class_7924.field_41246);
        return cache.get(registry, catalog.revision(), reg -> {
            var index = catalog.environment();
            var tags = index.structureTags().stream().map(id -> class_6862.method_40092(class_7924.field_41246, class_2960.method_60654(id))).toList();
            var mapped = new IdentityHashMap<class_3195, StructureHit>();
            for (var entry : reg.method_29722()) {
                String id = entry.getKey().method_29177().toString();
                var holder = reg.method_47983(entry.getValue());
                Set<String> memberOf = new HashSet<>();
                for (var tag : tags) if (holder.method_40220(tag)) memberOf.add(tag.comp_327().toString());
                if (index.structureIds().contains(id) || !memberOf.isEmpty()) mapped.put(entry.getValue(), new StructureHit(id, Set.copyOf(memberOf)));
            }
            RejuvenationFields.LOG.info("Indexed {} generated structure types with configured fields (catalog revision {})", mapped.size(), catalog.revision());
            return mapped;
        });
    }
}
