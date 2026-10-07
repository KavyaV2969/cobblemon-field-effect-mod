# Biome mapping

The archive/loose-data scan discovered **165 candidate biome IDs**, all explicitly mapped: 66 `minecraft`, 95 `terralith`, 2 `lumymon`, 1 `cobblemonraiddens`, 1 `legendarymonuments`. No discovered candidate relies on fallback.

`minecraft` includes 64 vanilla biomes plus VanillaBackport’s `minecraft:pale_garden` and `minecraft:sulfur_caves`. Its `ModBiomes` bytecode registers exactly those two additions; Iris/particle/map biome classes inspect biomes rather than supplying new ones.

**Live registry:** an isolated Minecraft/Fabric startup using this profile’s installed mods, configuration, required packs and world level metadata exported **70 registered biome IDs**. All 70 have explicit mappings and zero use fallback. `research/runtime-biomes.json` records the actual IDs. This check generated fresh chunks and did not modify the original world.

**Enabled-world distinction:** in the inspected profile Terralith was an optional data pack that its world had disabled. Its additional 95 IDs are intentionally covered for optional activation. Therefore 165 is the candidate catalogue, not the active registry count.

At server start, the mod writes `rejuvenation/research/runtime-biomes.json` with actual registered IDs and explicit/fallback coverage. Dynamically registered future biomes are resolved through tags, dimensions, depth and the default.

Precedence for natural battles (see [FIELD_SELECTION.md](FIELD_SELECTION.md)): an explicit or RCT-configured trainer field, then a submerged battle (Underwater), then a configured generated structure, then the biome rows below, then the default. Wild battle anchor: first non-player entity-backed actor (the wild Pokémon), then a player fallback. Biome rows use the anchor position, not a player’s arbitrary home biome. Selected surface mappings use Cave when at least 12 blocks below the solid-surface height and sky is hidden.

Playtest changes (2026-10-05): every ordinary plains biome maps to Grassy Terrain (`minecraft:sunflower_plains` no longer falls to Flower Garden through the flower pattern) and mushroom biomes map to Fairy Tale Field.

| Biome ID | Provider | Pack | Selected field | Reason | Mechanism / availability |
|---|---|---|---|---|---|
| cobblemonraiddens:raid_den | cobblemonraiddens | cobbleverse | rejuvenation:cave | Underground raid den | explicit; non-Terralith candidate |
| legendarymonuments:distortion_world_biome | legendarymonuments | cobbleverse | rejuvenation:dimensional | Distorted extradimensional environment | explicit; non-Terralith candidate |
| lumymon:nightmare_void | lumymon | cobbleverse | rejuvenation:haunted | Nightmare dimension | explicit; non-Terralith candidate |
| lumymon:origin_sky | lumymon | cobbleverse | rejuvenation:sky | Open sky dimension | explicit; non-Terralith candidate |
| minecraft:badlands | Minecraft | base | rejuvenation:desert | Arid sand/mesa terrain | explicit; non-Terralith candidate |
| minecraft:bamboo_jungle | Minecraft | base | rejuvenation:forest | Dense woodland | explicit; non-Terralith candidate |
| minecraft:basalt_deltas | Minecraft | base | rejuvenation:volcanic | Hot volcanic environment | explicit; non-Terralith candidate |
| minecraft:beach | Minecraft | base | rejuvenation:beach | Coastal sand/rock | explicit; non-Terralith candidate |
| minecraft:birch_forest | Minecraft | base | rejuvenation:forest | Dense woodland | explicit; non-Terralith candidate |
| minecraft:cherry_grove | Minecraft | base | rejuvenation:forest | Dense woodland | explicit; non-Terralith candidate |
| minecraft:cold_ocean | Minecraft | base | rejuvenation:water_surface | Open surface water | explicit; non-Terralith candidate |
| minecraft:crimson_forest | Minecraft | base | rejuvenation:crimson_forest | Crimson Forest biome | explicit; non-Terralith candidate |
| minecraft:dark_forest | Minecraft | base | rejuvenation:forest | Dense woodland | explicit; non-Terralith candidate |
| minecraft:deep_cold_ocean | Minecraft | base | rejuvenation:water_surface | Open surface water | explicit; non-Terralith candidate |
| minecraft:deep_dark | Minecraft | base | rejuvenation:deep_dark | Deep Dark biome | explicit; non-Terralith candidate |
| minecraft:deep_frozen_ocean | Minecraft | base | rejuvenation:icy | Ice sheet over deep ocean water | explicit; non-Terralith candidate |
| minecraft:deep_lukewarm_ocean | Minecraft | base | rejuvenation:water_surface | Open surface water | explicit; non-Terralith candidate |
| minecraft:deep_ocean | Minecraft | base | rejuvenation:water_surface | Open surface water | explicit; non-Terralith candidate |
| minecraft:desert | Minecraft | base | rejuvenation:desert | Arid sand/mesa terrain | explicit; non-Terralith candidate |
| minecraft:dripstone_caves | Minecraft | base | rejuvenation:cave | Subterranean environment | explicit; non-Terralith candidate |
| minecraft:end_barrens | Minecraft | base | rejuvenation:new_world | Fragmented void-world | explicit; non-Terralith candidate |
| minecraft:end_highlands | Minecraft | base | rejuvenation:new_world | Fragmented void-world | explicit; non-Terralith candidate |
| minecraft:end_midlands | Minecraft | base | rejuvenation:new_world | Fragmented void-world | explicit; non-Terralith candidate |
| minecraft:eroded_badlands | Minecraft | base | rejuvenation:desert | Arid sand/mesa terrain | explicit; non-Terralith candidate |
| minecraft:flower_forest | Minecraft | base | rejuvenation:flower_garden_2 | Flower-rich vegetation | explicit; non-Terralith candidate |
| minecraft:forest | Minecraft | base | rejuvenation:forest | Dense woodland | explicit; non-Terralith candidate |
| minecraft:frozen_ocean | Minecraft | base | rejuvenation:icy | Ice sheet over open ocean water | explicit; non-Terralith candidate |
| minecraft:frozen_peaks | Minecraft | base | rejuvenation:snowy_mountain | Snow-covered mountain | explicit; non-Terralith candidate |
| minecraft:frozen_river | Minecraft | base | rejuvenation:icy | Ice over river water | explicit; non-Terralith candidate |
| minecraft:grove | Minecraft | base | rejuvenation:forest | Dense woodland | explicit; non-Terralith candidate |
| minecraft:ice_spikes | Minecraft | base | rejuvenation:icy | Ice/snow environment | explicit; non-Terralith candidate |
| minecraft:jagged_peaks | Minecraft | base | rejuvenation:mountain | Elevated mountain terrain | explicit; non-Terralith candidate |
| minecraft:jungle | Minecraft | base | rejuvenation:forest | Dense woodland | explicit; non-Terralith candidate |
| minecraft:lukewarm_ocean | Minecraft | base | rejuvenation:water_surface | Open surface water | explicit; non-Terralith candidate |
| minecraft:lush_caves | Minecraft | base | rejuvenation:cave | Subterranean environment | explicit; non-Terralith candidate |
| minecraft:mangrove_swamp | Minecraft | base | rejuvenation:swamp | Wet swamp | explicit; non-Terralith candidate |
| minecraft:meadow | Minecraft | base | rejuvenation:grassy_terrain | Open vegetated land | explicit; non-Terralith candidate |
| minecraft:mushroom_fields | Minecraft | base | rejuvenation:fairytale | Mushroom biome | explicit; non-Terralith candidate |
| minecraft:nether_wastes | Minecraft | base | rejuvenation:volcanic | Hot volcanic environment | explicit; non-Terralith candidate |
| minecraft:ocean | Minecraft | base | rejuvenation:water_surface | Open surface water | explicit; non-Terralith candidate |
| minecraft:old_growth_birch_forest | Minecraft | base | rejuvenation:forest | Dense woodland | explicit; non-Terralith candidate |
| minecraft:old_growth_pine_taiga | Minecraft | base | rejuvenation:forest | Dense woodland | explicit; non-Terralith candidate |
| minecraft:old_growth_spruce_taiga | Minecraft | base | rejuvenation:forest | Dense woodland | explicit; non-Terralith candidate |
| minecraft:pale_garden | VanillaBackport | cobbleverse | rejuvenation:pale_garden | Pale Garden biome | explicit; non-Terralith candidate |
| minecraft:plains | Minecraft | base | rejuvenation:grassy_terrain | Open vegetated land | explicit; non-Terralith candidate |
| minecraft:river | Minecraft | base | rejuvenation:water_surface | Open surface water | explicit; non-Terralith candidate |
| minecraft:savanna | Minecraft | base | rejuvenation:grassy_terrain | Open vegetated land | explicit; non-Terralith candidate |
| minecraft:savanna_plateau | Minecraft | base | rejuvenation:mountain | Elevated mountain terrain | explicit; non-Terralith candidate |
| minecraft:small_end_islands | Minecraft | base | rejuvenation:new_world | Fragmented void-world | explicit; non-Terralith candidate |
| minecraft:snowy_beach | Minecraft | base | rejuvenation:icy | Ice/snow environment | explicit; non-Terralith candidate |
| minecraft:snowy_plains | Minecraft | base | rejuvenation:icy | Ice/snow environment | explicit; non-Terralith candidate |
| minecraft:snowy_slopes | Minecraft | base | rejuvenation:snowy_mountain | Snow-covered mountain | explicit; non-Terralith candidate |
| minecraft:snowy_taiga | Minecraft | base | rejuvenation:icy | Ice/snow environment | explicit; non-Terralith candidate |
| minecraft:soul_sand_valley | Minecraft | base | rejuvenation:infernal | Tormented soul environment | explicit; non-Terralith candidate |
| minecraft:sparse_jungle | Minecraft | base | rejuvenation:forest | Dense woodland | explicit; non-Terralith candidate |
| minecraft:stony_peaks | Minecraft | base | rejuvenation:mountain | Elevated mountain terrain | explicit; non-Terralith candidate |
| minecraft:stony_shore | Minecraft | base | rejuvenation:beach | Coastal sand/rock | explicit; non-Terralith candidate |
| minecraft:sulfur_caves | VanillaBackport | cobbleverse | rejuvenation:corrosive_mist | Sulfurous cave gases | explicit; non-Terralith candidate |
| minecraft:sunflower_plains | Minecraft | base | rejuvenation:grassy_terrain | Plains biome variant | explicit; non-Terralith candidate |
| minecraft:swamp | Minecraft | base | rejuvenation:swamp | Wet swamp | explicit; non-Terralith candidate |
| minecraft:taiga | Minecraft | base | rejuvenation:forest | Dense woodland | explicit; non-Terralith candidate |
| minecraft:the_end | Minecraft | base | rejuvenation:new_world | Fragmented void-world | explicit; non-Terralith candidate |
| minecraft:the_void | Minecraft | base | rejuvenation:new_world | Fragmented void-world | explicit; non-Terralith candidate |
| minecraft:warm_ocean | Minecraft | base | rejuvenation:water_surface | Open surface water | explicit; non-Terralith candidate |
| minecraft:warped_forest | Minecraft | base | rejuvenation:warped_forest | Warped Forest biome | explicit; non-Terralith candidate |
| minecraft:windswept_forest | Minecraft | base | rejuvenation:forest | Dense woodland | explicit; non-Terralith candidate |
| minecraft:windswept_gravelly_hills | Minecraft | base | rejuvenation:mountain | Elevated mountain terrain | explicit; non-Terralith candidate |
| minecraft:windswept_hills | Minecraft | base | rejuvenation:mountain | Elevated mountain terrain | explicit; non-Terralith candidate |
| minecraft:windswept_savanna | Minecraft | base | rejuvenation:mountain | Elevated mountain terrain | explicit; non-Terralith candidate |
| minecraft:wooded_badlands | Minecraft | base | rejuvenation:forest | Dense woodland | explicit; non-Terralith candidate |
| terralith:alpha_islands | Terralith (optional datapack) | cobbleverse | rejuvenation:grassy_terrain | Open vegetated land | explicit; optional disabled pack |
| terralith:alpha_islands_winter | Terralith (optional datapack) | cobbleverse | rejuvenation:icy | Ice/snow environment | explicit; optional disabled pack |
| terralith:alpine_grove | Terralith (optional datapack) | cobbleverse | rejuvenation:forest | Dense woodland | explicit; optional disabled pack |
| terralith:alpine_highlands | Terralith (optional datapack) | cobbleverse | rejuvenation:mountain | Elevated mountain terrain | explicit; optional disabled pack |
| terralith:amethyst_canyon | Terralith (optional datapack) | cobbleverse | rejuvenation:crystal_cavern | Amethyst crystal environment | explicit; optional disabled pack |
| terralith:amethyst_rainforest | Terralith (optional datapack) | cobbleverse | rejuvenation:crystal_cavern | Amethyst crystal environment | explicit; optional disabled pack |
| terralith:ancient_sands | Terralith (optional datapack) | cobbleverse | rejuvenation:desert | Arid sand/mesa terrain | explicit; optional disabled pack |
| terralith:arid_highlands | Terralith (optional datapack) | cobbleverse | rejuvenation:desert | Arid sand/mesa terrain | explicit; optional disabled pack |
| terralith:ashen_savanna | Terralith (optional datapack) | cobbleverse | rejuvenation:grassy_terrain | Open vegetated land | explicit; optional disabled pack |
| terralith:basalt_cliffs | Terralith (optional datapack) | cobbleverse | rejuvenation:mountain | Elevated mountain terrain | explicit; optional disabled pack |
| terralith:birch_taiga | Terralith (optional datapack) | cobbleverse | rejuvenation:forest | Dense woodland | explicit; optional disabled pack |
| terralith:blooming_plateau | Terralith (optional datapack) | cobbleverse | rejuvenation:flower_garden_2 | Flower-rich vegetation | explicit; optional disabled pack |
| terralith:blooming_valley | Terralith (optional datapack) | cobbleverse | rejuvenation:flower_garden_2 | Flower-rich vegetation | explicit; optional disabled pack |
| terralith:brushland | Terralith (optional datapack) | cobbleverse | rejuvenation:grassy_terrain | Open vegetated land | explicit; optional disabled pack |
| terralith:bryce_canyon | Terralith (optional datapack) | cobbleverse | rejuvenation:rocky | Exposed rock | explicit; optional disabled pack |
| terralith:caldera | Terralith (optional datapack) | cobbleverse | rejuvenation:volcanic_top | Volcanic caldera | explicit; optional disabled pack |
| terralith:cave/andesite_caves | Terralith (optional datapack) | cobbleverse | rejuvenation:cave | Subterranean environment | explicit; optional disabled pack |
| terralith:cave/deep_caves | Terralith (optional datapack) | cobbleverse | rejuvenation:deep_earth | Deep underground | explicit; optional disabled pack |
| terralith:cave/diorite_caves | Terralith (optional datapack) | cobbleverse | rejuvenation:cave | Subterranean environment | explicit; optional disabled pack |
| terralith:cave/frostfire_caves | Terralith (optional datapack) | cobbleverse | rejuvenation:frozen_dimension | Combined anomalous fire and ice | explicit; optional disabled pack |
| terralith:cave/fungal_caves | Terralith (optional datapack) | cobbleverse | rejuvenation:corrosive | Fungal cave | explicit; optional disabled pack |
| terralith:cave/granite_caves | Terralith (optional datapack) | cobbleverse | rejuvenation:cave | Subterranean environment | explicit; optional disabled pack |
| terralith:cave/infested_caves | Terralith (optional datapack) | cobbleverse | rejuvenation:corrupted | Infested cave | explicit; optional disabled pack |
| terralith:cave/mantle_caves | Terralith (optional datapack) | cobbleverse | rejuvenation:deep_earth | Deep mantle | explicit; optional disabled pack |
| terralith:cave/thermal_caves | Terralith (optional datapack) | cobbleverse | rejuvenation:volcanic | Hot volcanic environment | explicit; optional disabled pack |
| terralith:cave/tuff_caves | Terralith (optional datapack) | cobbleverse | rejuvenation:cave | Subterranean environment | explicit; optional disabled pack |
| terralith:cave/underground_jungle | Terralith (optional datapack) | cobbleverse | rejuvenation:cave | Subterranean environment | explicit; optional disabled pack |
| terralith:cloud_forest | Terralith (optional datapack) | cobbleverse | rejuvenation:sky | Cloud-level woodland | explicit; optional disabled pack |
| terralith:cold_shrubland | Terralith (optional datapack) | cobbleverse | rejuvenation:icy | Ice/snow environment | explicit; optional disabled pack |
| terralith:deep_warm_ocean | Terralith (optional datapack) | cobbleverse | rejuvenation:water_surface | Open surface water | explicit; optional disabled pack |
| terralith:desert_canyon | Terralith (optional datapack) | cobbleverse | rejuvenation:desert | Arid sand/mesa terrain | explicit; optional disabled pack |
| terralith:desert_oasis | Terralith (optional datapack) | cobbleverse | rejuvenation:desert | Arid sand/mesa terrain | explicit; optional disabled pack |
| terralith:desert_spires | Terralith (optional datapack) | cobbleverse | rejuvenation:desert | Arid sand/mesa terrain | explicit; optional disabled pack |
| terralith:emerald_peaks | Terralith (optional datapack) | cobbleverse | rejuvenation:mountain | Elevated mountain terrain | explicit; optional disabled pack |
| terralith:forested_highlands | Terralith (optional datapack) | cobbleverse | rejuvenation:forest | Dense woodland | explicit; optional disabled pack |
| terralith:fractured_savanna | Terralith (optional datapack) | cobbleverse | rejuvenation:grassy_terrain | Open vegetated land | explicit; optional disabled pack |
| terralith:frozen_cliffs | Terralith (optional datapack) | cobbleverse | rejuvenation:snowy_mountain | Snow-covered mountain | explicit; optional disabled pack |
| terralith:glacial_chasm | Terralith (optional datapack) | cobbleverse | rejuvenation:snowy_mountain | Snow-covered mountain | explicit; optional disabled pack |
| terralith:granite_cliffs | Terralith (optional datapack) | cobbleverse | rejuvenation:mountain | Elevated mountain terrain | explicit; optional disabled pack |
| terralith:gravel_beach | Terralith (optional datapack) | cobbleverse | rejuvenation:beach | Coastal sand/rock | explicit; optional disabled pack |
| terralith:gravel_desert | Terralith (optional datapack) | cobbleverse | rejuvenation:desert | Arid sand/mesa terrain | explicit; optional disabled pack |
| terralith:haze_mountain | Terralith (optional datapack) | cobbleverse | rejuvenation:mountain | Elevated mountain terrain | explicit; optional disabled pack |
| terralith:highlands | Terralith (optional datapack) | cobbleverse | rejuvenation:mountain | Elevated mountain terrain | explicit; optional disabled pack |
| terralith:hot_shrubland | Terralith (optional datapack) | cobbleverse | rejuvenation:grassy_terrain | Open vegetated land | explicit; optional disabled pack |
| terralith:ice_marsh | Terralith (optional datapack) | cobbleverse | rejuvenation:icy | Frozen marsh | explicit; optional disabled pack |
| terralith:jungle_mountains | Terralith (optional datapack) | cobbleverse | rejuvenation:forest | Dense woodland | explicit; optional disabled pack |
| terralith:lavender_forest | Terralith (optional datapack) | cobbleverse | rejuvenation:forest | Dense woodland | explicit; optional disabled pack |
| terralith:lavender_valley | Terralith (optional datapack) | cobbleverse | rejuvenation:flower_garden_2 | Flower-rich vegetation | explicit; optional disabled pack |
| terralith:lush_desert | Terralith (optional datapack) | cobbleverse | rejuvenation:desert | Arid sand/mesa terrain | explicit; optional disabled pack |
| terralith:lush_valley | Terralith (optional datapack) | cobbleverse | rejuvenation:grassy_terrain | Open vegetated land | explicit; optional disabled pack |
| terralith:mirage_isles | Terralith (optional datapack) | cobbleverse | rejuvenation:rainbow | Mirage island atmosphere | explicit; optional disabled pack |
| terralith:moonlight_grove | Terralith (optional datapack) | cobbleverse | rejuvenation:bewitched | Glowing enchanted woodland | explicit; optional disabled pack |
| terralith:moonlight_valley | Terralith (optional datapack) | cobbleverse | rejuvenation:starlight | Moonlit valley | explicit; optional disabled pack |
| terralith:orchid_swamp | Terralith (optional datapack) | cobbleverse | rejuvenation:swamp | Wet swamp | explicit; optional disabled pack |
| terralith:painted_mountains | Terralith (optional datapack) | cobbleverse | rejuvenation:mountain | Elevated mountain terrain | explicit; optional disabled pack |
| terralith:red_oasis | Terralith (optional datapack) | cobbleverse | rejuvenation:desert | Arid sand/mesa terrain | explicit; optional disabled pack |
| terralith:rocky_jungle | Terralith (optional datapack) | cobbleverse | rejuvenation:forest | Dense woodland | explicit; optional disabled pack |
| terralith:rocky_mountains | Terralith (optional datapack) | cobbleverse | rejuvenation:mountain | Elevated mountain terrain | explicit; optional disabled pack |
| terralith:rocky_shrubland | Terralith (optional datapack) | cobbleverse | rejuvenation:rocky | Exposed rock | explicit; optional disabled pack |
| terralith:sakura_grove | Terralith (optional datapack) | cobbleverse | rejuvenation:forest | Dense woodland | explicit; optional disabled pack |
| terralith:sakura_valley | Terralith (optional datapack) | cobbleverse | rejuvenation:grassy_terrain | Open vegetated land | explicit; optional disabled pack |
| terralith:sandstone_valley | Terralith (optional datapack) | cobbleverse | rejuvenation:desert | Arid sand/mesa terrain | explicit; optional disabled pack |
| terralith:savanna_badlands | Terralith (optional datapack) | cobbleverse | rejuvenation:desert | Arid sand/mesa terrain | explicit; optional disabled pack |
| terralith:savanna_slopes | Terralith (optional datapack) | cobbleverse | rejuvenation:grassy_terrain | Open vegetated land | explicit; optional disabled pack |
| terralith:scarlet_mountains | Terralith (optional datapack) | cobbleverse | rejuvenation:mountain | Elevated mountain terrain | explicit; optional disabled pack |
| terralith:shield | Terralith (optional datapack) | cobbleverse | rejuvenation:forest | Dense woodland | explicit; optional disabled pack |
| terralith:shield_clearing | Terralith (optional datapack) | cobbleverse | rejuvenation:grassy_terrain | Open vegetated land | explicit; optional disabled pack |
| terralith:shrubland | Terralith (optional datapack) | cobbleverse | rejuvenation:grassy_terrain | Open vegetated land | explicit; optional disabled pack |
| terralith:siberian_grove | Terralith (optional datapack) | cobbleverse | rejuvenation:forest | Dense woodland | explicit; optional disabled pack |
| terralith:siberian_taiga | Terralith (optional datapack) | cobbleverse | rejuvenation:forest | Dense woodland | explicit; optional disabled pack |
| terralith:skylands_autumn | Terralith (optional datapack) | cobbleverse | rejuvenation:sky | Floating sky islands | explicit; optional disabled pack |
| terralith:skylands_spring | Terralith (optional datapack) | cobbleverse | rejuvenation:sky | Floating sky islands | explicit; optional disabled pack |
| terralith:skylands_summer | Terralith (optional datapack) | cobbleverse | rejuvenation:sky | Floating sky islands | explicit; optional disabled pack |
| terralith:skylands_winter | Terralith (optional datapack) | cobbleverse | rejuvenation:sky | Floating sky islands | explicit; optional disabled pack |
| terralith:snowy_badlands | Terralith (optional datapack) | cobbleverse | rejuvenation:icy | Ice/snow environment | explicit; optional disabled pack |
| terralith:snowy_cherry_grove | Terralith (optional datapack) | cobbleverse | rejuvenation:icy | Ice/snow environment | explicit; optional disabled pack |
| terralith:snowy_maple_forest | Terralith (optional datapack) | cobbleverse | rejuvenation:icy | Ice/snow environment | explicit; optional disabled pack |
| terralith:snowy_shield | Terralith (optional datapack) | cobbleverse | rejuvenation:icy | Ice/snow environment | explicit; optional disabled pack |
| terralith:steppe | Terralith (optional datapack) | cobbleverse | rejuvenation:grassy_terrain | Open vegetated land | explicit; optional disabled pack |
| terralith:stony_spires | Terralith (optional datapack) | cobbleverse | rejuvenation:mountain | Elevated mountain terrain | explicit; optional disabled pack |
| terralith:temperate_highlands | Terralith (optional datapack) | cobbleverse | rejuvenation:mountain | Elevated mountain terrain | explicit; optional disabled pack |
| terralith:tropical_jungle | Terralith (optional datapack) | cobbleverse | rejuvenation:forest | Dense woodland | explicit; optional disabled pack |
| terralith:valley_clearing | Terralith (optional datapack) | cobbleverse | rejuvenation:grassy_terrain | Open vegetated land | explicit; optional disabled pack |
| terralith:volcanic_crater | Terralith (optional datapack) | cobbleverse | rejuvenation:volcanic_top | Volcano summit/crater | explicit; optional disabled pack |
| terralith:volcanic_peaks | Terralith (optional datapack) | cobbleverse | rejuvenation:volcanic_top | Volcano summit/crater | explicit; optional disabled pack |
| terralith:warm_river | Terralith (optional datapack) | cobbleverse | rejuvenation:water_surface | Open surface water | explicit; optional disabled pack |
| terralith:warped_mesa | Terralith (optional datapack) | cobbleverse | rejuvenation:dimensional | Warped fantasy mesa | explicit; optional disabled pack |
| terralith:white_cliffs | Terralith (optional datapack) | cobbleverse | rejuvenation:mountain | Elevated mountain terrain | explicit; optional disabled pack |
| terralith:white_mesa | Terralith (optional datapack) | cobbleverse | rejuvenation:desert | Arid sand/mesa terrain | explicit; optional disabled pack |
| terralith:windswept_spires | Terralith (optional datapack) | cobbleverse | rejuvenation:mountain | Elevated mountain terrain | explicit; optional disabled pack |
| terralith:wintry_forest | Terralith (optional datapack) | cobbleverse | rejuvenation:icy | Ice/snow environment | explicit; optional disabled pack |
| terralith:wintry_lowlands | Terralith (optional datapack) | cobbleverse | rejuvenation:icy | Ice/snow environment | explicit; optional disabled pack |
| terralith:yellowstone | Terralith (optional datapack) | cobbleverse | rejuvenation:volcanic | Geothermal terrain | explicit; optional disabled pack |
| terralith:yosemite_cliffs | Terralith (optional datapack) | cobbleverse | rejuvenation:mountain | Elevated mountain terrain | explicit; optional disabled pack |
| terralith:yosemite_lowlands | Terralith (optional datapack) | cobbleverse | rejuvenation:grassy_terrain | Open vegetated land | explicit; optional disabled pack |

The exact source archive paths for each row are in `research/biome-mapping.json` and `research/biome-inventory.json`.

## Future compatibility rules

| Predicate | Field | Reason |
|---|---|---|
| {"submerged":true} | rejuvenation:underwater | Battle submerged in water |
| {"tag":"minecraft:is_forest"} | rejuvenation:forest | Future biome tag compatibility |
| {"tag":"minecraft:is_jungle"} | rejuvenation:forest | Future biome tag compatibility |
| {"tag":"minecraft:is_taiga"} | rejuvenation:forest | Future biome tag compatibility |
| {"tag":"minecraft:is_ocean"} | rejuvenation:water_surface | Future biome tag compatibility |
| {"tag":"minecraft:is_river"} | rejuvenation:water_surface | Future biome tag compatibility |
| {"tag":"minecraft:is_mountain"} | rejuvenation:mountain | Future biome tag compatibility |
| {"tag":"minecraft:is_beach"} | rejuvenation:beach | Future biome tag compatibility |
| {"tag":"minecraft:is_badlands"} | rejuvenation:desert | Future biome tag compatibility |
| {"tag":"c:is_snowy"} | rejuvenation:icy | Future biome tag compatibility |
| {"tag":"c:is_swamp"} | rejuvenation:swamp | Future biome tag compatibility |
| {"tag":"c:is_cave"} | rejuvenation:cave | Future biome tag compatibility |
| {"dimension":"minecraft:the_nether"} | rejuvenation:volcanic | Dimension fallback |
| {"dimension":"minecraft:the_end"} | rejuvenation:new_world | Dimension fallback |
| {"dimension":"lumymon:nightmare"} | rejuvenation:haunted | Dimension fallback |
| {"dimension":"lumymon:origin"} | rejuvenation:sky | Dimension fallback |
| {"dimension":"cobblemonraiddens:raid_dimension"} | rejuvenation:cave | Dimension fallback |
| {"dimension":"legendarymonuments:distortion_world"} | rejuvenation:dimensional | Dimension fallback |
| {"maxY":0,"skyVisible":false} | rejuvenation:deep_earth | Unknown deep underground biome |

## Generated structures

Only structures listed here override the biome; any other structure falls through to the biome rows. A battle is inside a structure when the wild Pokémon or a participating player is inside one of its generated pieces, or, for rows with a footprint containment (villages), inside the piece footprint of the structure plus bounded margins configured on the row (see [FIELD_SELECTION.md](FIELD_SELECTION.md)).

| Structure or tag | Field | Reason |
|---|---|---|
| minecraft:ancient_city | rejuvenation:deep_dark | Ancient City |
| #repurposed_structures:collections/ancient_cities | rejuvenation:deep_dark | Ancient City variant |
| minecraft:bastion_remnant | rejuvenation:colosseum | Bastion Remnant |
| minecraft:fortress | rejuvenation:colosseum | Nether Fortress |
| #repurposed_structures:collections/bastions | rejuvenation:colosseum | Bastion variant |
| #repurposed_structures:collections/fortresses | rejuvenation:colosseum | Fortress variant |
| minecraft:mansion | rejuvenation:back_alley | Woodland Mansion |
| #repurposed_structures:collections/mansions | rejuvenation:back_alley | Woodland Mansion variant |
| minecraft:village_plains | rejuvenation:city | Village |
| minecraft:village_desert | rejuvenation:city | Village |
| minecraft:village_savanna | rejuvenation:city | Village |
| minecraft:village_snowy | rejuvenation:city | Village |
| minecraft:village_taiga | rejuvenation:city | Village |
| #minecraft:village | rejuvenation:city | Village |
| bca:village/default_small | rejuvenation:city | Cobblemon Additions village |
| bca:village/default_mid | rejuvenation:city | Cobblemon Additions village |
| bca:village/default_large | rejuvenation:city | Cobblemon Additions village |
| bca:village/dark_small | rejuvenation:city | Cobblemon Additions village |
| bca:village/dark_mid | rejuvenation:city | Cobblemon Additions village |
| bca:village/fighting_small | rejuvenation:city | Cobblemon Additions village |
| bca:village/fighting_mid | rejuvenation:city | Cobblemon Additions village |
| bca:village/fighting_large | rejuvenation:city | Cobblemon Additions village |

## Packs and merge order

The mapping rows are split by the mod that provides the biome, structure or tag (`research/provider_map.py`), not by namespace: `minecraft:pale_garden` and `minecraft:sulfur_caves` come from VanillaBackport, so they are in the COBBLEVERSE extension although the IDs say `minecraft`. Documents merge by `(order, resource ID)`; a row only competes with rows that can match the same position, so exact-biome rows precede tag and dimension rows and structure classes keep their specificity order. `research/compare_split.py` resolves over a million environment snapshots and every structure overlap with the former single file and with the merged packs and requires identical answers.

| Document | Pack | Order | Rows |
|---|---|---|---|
| `mappings/base_biomes.json` | base | 100 | 101 |
| `mappings/base_fallback.json` | base | 500 | 1 |
| `mappings/base_tags.json` | base | 300 | 13 |
| `structures/base_back_alley.json` | base | 300 | 1 |
| `structures/base_city.json` | base | 400 | 6 |
| `structures/base_colosseum.json` | base | 200 | 2 |
| `structures/base_deep_dark.json` | base | 100 | 1 |
| `mappings/cobbleverse_biomes.json` | cobbleverse | 200 | 167 |
| `mappings/cobbleverse_dimensions.json` | cobbleverse | 400 | 4 |
| `structures/cobbleverse_back_alley.json` | cobbleverse | 350 | 1 |
| `structures/cobbleverse_city.json` | cobbleverse | 450 | 8 |
| `structures/cobbleverse_colosseum.json` | cobbleverse | 250 | 2 |
| `structures/cobbleverse_deep_dark.json` | cobbleverse | 150 | 1 |
