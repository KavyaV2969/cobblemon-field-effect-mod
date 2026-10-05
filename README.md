# Rejuvenation Fields for this Cobbleverse profile

**All 57 Rejuvenation 14.0.14 fields are implemented and the source audit is closed.** Every ordinary field-dependent battle branch in the local Rejuvenation scripts is implemented with a passing regression test, or recorded per field as a custom-move/Crest exclusion, unreachable, unsupported or presentation-only ([coverage](docs/FIELD_COVERAGE.md)). Exhaustive live/multiplayer verification is future work ([remaining work](docs/REMAINING_WORK.md)). Use a test profile first.

Version 0.2.0 adds:

- no battle-start stall: the field catalog reaches the simulator when the world loads, and publishing it no longer loads ~40 unused simulator dex mods ([performance](docs/PERFORMANCE.md));
- field selection by precedence RCT/explicit field > underwater > configured structure (villages → City, Woodland Mansions → Back Alley) > biome (Plains → Grassy Terrain, mushroom biomes → Fairy Tale) > default ([field selection](docs/FIELD_SELECTION.md));
- a read-only, field-aware move evaluation used by the Run & Bun AI and by Cobblemon Battle Extras' move damage/KO tooltip ([integrations](docs/INTEGRATIONS.md));
- a field panel above the battle log with the field's Rejuvenation backdrop and name ([field panel](docs/FIELD_PANEL.md)).

Outputs:

- `mod/`: Java 21/Fabric source project, targeting the installed Cobblemon 1.7.3 and Minecraft 1.21.1 ABI.
- `dist/rejuvenation-fields-0.2.0.jar`: compiled mod.
- `datapack/`: editable field content and environment mappings.
- `dist/rejuvenation-fields-datapack-0.2.0.zip`: packaged datapack.
- `docs/`: architecture, per-field specifications, biome tables, source provenance, compatibility and future trainer integration.
- `research/`: extracted mechanical specifications, generators, audits and test results.
- `dist/manifest.json`: hashes, per-field audit status and verification scope.

## Installation

Use a separate test profile first. Install the jar in `mods/` on the server and clients, because it registers six held items. Install and enable the datapack in that world's `datapacks/`, or in the modpack's required Global Packs directory. Start/reload the world; look for `Loaded 57 fields` in the log. The jar requires the datapack's `rejuvenation:indoor` definition. No Rejuvenation game installation is needed at runtime.

Natural wild battles select a field from their environment ([field selection](docs/FIELD_SELECTION.md)). The Kanto league (eight Gym Leaders, Elite Four, Champion) battles on fields chosen to favor each trainer's team ([Kanto league fields](docs/KANTO_LEAGUE_FIELDS.md)); other trainer and player battles remain opt-in through `FieldApi`. No trainer definitions, teams or AI settings have been edited. The Run & Bun jar is unchanged; an optional adapter in this mod corrects its estimates with the field engine's measurements. Read [trainer integration](docs/TRAINER_INTEGRATION.md) before opting a trainer battle into fields.

The only original game graphics included are the 57 field battle backgrounds used by the field panel, copied unmodified as client resources with attribution (`assets/rejuvenation/textures/gui/field/ATTRIBUTION.txt`); no animations, audio or complete Ruby scripts are included. Seed items use vanilla wheat-seed visuals; Amulet Coin uses the vanilla gold-nugget visual, and Amplifield Rock uses cobblestone. Existing Cobblemon Everstones are bridged into opted-in battle teams. Original field mechanics and required battle text are stored as data.

## Rebuilding and checks

Run `./rejuvenation/build.ps1` from this profile with Java 21, Python, Node, Ruby and cached Gradle 8.13 available. The script prepares compile-only dependencies from the installed profile, regenerates and validates content, compares compiled source definitions, executes the bounded original-Ruby method oracle, writes documentation, builds/tests the mod and packages the datapack. The oracle requires the recorded local reference installation. A direct Gradle `build` runs simulator/Java/Graal checks without requiring that installation; the separate `sourceOracleTest` task runs the original-source check. Dependencies are not bundled into the jar or zip. `-RefreshSource` additionally reruns the Ruby extraction/audit against the recorded local source.

`research/live_check.py` runs an isolated cached Minecraft client with copied configuration and fresh chunks using the existing world's level metadata. Its temporary dependencies stay under `integration/` and are not distributable output. It does not use account credentials or modify the original save. Simulator and shaded-Graal checks run during the normal Gradle build. Build the separate `integrationFixtureJar` task and run `research/live_check.py --battle` to exercise real battles, including the Dive/Dusk capture events, or `--integration` for field selection on real terrain and structures, the field panel (with screenshots), move previews and a Run & Bun trainer battle. The fixture is excluded from distributable artifacts and refuses to run outside its isolated game directory. Two-client multiplayer remains separate verification work.
