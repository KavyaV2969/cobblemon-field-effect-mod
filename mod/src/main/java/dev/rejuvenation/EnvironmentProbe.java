package dev.rejuvenation;

import com.cobblemon.mod.common.api.battles.model.PokemonBattle;
import com.cobblemon.mod.common.api.battles.model.actor.EntityBackedBattleActor;
import dev.rejuvenation.EnvironmentResolver.StructureHit;
import net.minecraft.class_1297;
import net.minecraft.class_1657;
import net.minecraft.class_2338;
import net.minecraft.class_2378;
import net.minecraft.class_2902;
import net.minecraft.class_2960;
import net.minecraft.class_3195;
import net.minecraft.class_3218;
import net.minecraft.class_6862;
import net.minecraft.class_7924;
import java.util.*;

/**
 * Captures the Minecraft state a wild battle's field depends on, on the server thread at battle pre-start.
 *
 * Anchor: the wild Pokémon (first non-player entity-backed actor), else the first player. The battle is
 * submerged when the anchor and every participating player are submerged in water ({@code isSubmergedInWater}),
 * so a player on a shore or boat battling a submerged Pokémon is not "underwater". Structures are checked at
 * the anchor and player positions using piece containment, and only for structures named by a structure row:
 * the chunk's structure references are filtered through a per-server, per-revision cache built once from the
 * structure registry, so no registry enumeration or tag resolution happens per battle.
 */
final class EnvironmentProbe {
    private EnvironmentProbe() {}
    record Capture(EnvironmentResolver.Snapshot snapshot, boolean anchorSubmerged) {}
    private record MappedStructures(class_2378<class_3195> registry, long revision, Map<class_3195, StructureHit> mapped) {}
    private static volatile MappedStructures cache;

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
            var positions = new ArrayList<class_2338>(); positions.add(pos);
            for (var player : players) if (player.method_37908() == world) positions.add(player.method_24515());
            structures = structuresAt(server, positions, catalog);
        }
        var snapshot = new EnvironmentResolver.Snapshot(submerged, structures, biomeId, tags, dimension, pos.method_10264(), depth, world.method_8311(pos));
        return new Capture(snapshot, anchorSubmerged);
    }

    private static List<StructureHit> structuresAt(class_3218 world, List<class_2338> positions, RejuvenationFields.Catalog catalog) {
        var mapped = mapped(world, catalog);
        if (mapped.isEmpty()) return List.of();
        var accessor = world.method_27056();
        var hits = new ArrayList<StructureHit>();
        for (var pos : positions)
            // References in this chunk are the only candidates; piece containment confirms the position is inside.
            for (var structure : accessor.method_41037(pos).keySet()) {
                var hit = mapped.get(structure);
                if (hit != null && !hits.contains(hit) && accessor.method_38854(pos, structure).method_16657()) hits.add(hit);
            }
        return hits;
    }

    /** Structures named by a structure row, by ID or tag, for this server's registry and catalog revision. */
    static Map<class_3195, StructureHit> mapped(class_3218 world, RejuvenationFields.Catalog catalog) {
        class_2378<class_3195> registry = world.method_30349().method_30530(class_7924.field_41246);
        var current = cache;
        if (current != null && current.registry() == registry && current.revision() == catalog.revision()) return current.mapped();
        var index = catalog.environment();
        var tags = index.structureTags().stream().map(id -> class_6862.method_40092(class_7924.field_41246, class_2960.method_60654(id))).toList();
        var mapped = new IdentityHashMap<class_3195, StructureHit>();
        for (var entry : registry.method_29722()) {
            String id = entry.getKey().method_29177().toString();
            var holder = registry.method_47983(entry.getValue());
            Set<String> memberOf = new HashSet<>();
            for (var tag : tags) if (holder.method_40220(tag)) memberOf.add(tag.comp_327().toString());
            if (index.structureIds().contains(id) || !memberOf.isEmpty()) mapped.put(entry.getValue(), new StructureHit(id, Set.copyOf(memberOf)));
        }
        cache = new MappedStructures(registry, catalog.revision(), Collections.unmodifiableMap(mapped));
        RejuvenationFields.LOG.info("Indexed {} generated structure types with configured fields (catalog revision {})", mapped.size(), catalog.revision());
        return cache.mapped();
    }
}
