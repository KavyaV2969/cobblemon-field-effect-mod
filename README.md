# Rejuvenation Fields for this Cobbleverse profile

**Full behavioral fidelity is unfinished.** This is a buildable field engine with all 57 discovered field definitions and substantial executable behavior. It is not yet the complete faithful recreation requested. See [remaining work](docs/REMAINING_WORK.md) and [coverage](docs/FIELD_COVERAGE.md) before installation.

Outputs:

- `mod/`: Java 21/Fabric source project, targeting the installed Cobblemon 1.7.3 and Minecraft 1.21.1 ABI.
- `dist/rejuvenation-fields-0.1.0.jar`: compiled mod.
- `datapack/`: editable field content and environment mappings.
- `dist/rejuvenation-fields-datapack-0.1.0.zip`: packaged datapack.
- `docs/`: architecture, per-field specifications, biome tables, source provenance, compatibility and future trainer integration.
- `research/`: extracted mechanical specifications, generators, audits and test results.
- `dist/manifest.json`: hashes and verification scope, explicitly marking incomplete fidelity.

## Installation

Use a separate test profile first. Install the jar in `mods/` on the server and clients, because it registers six held items. Install and enable the datapack in that world's `datapacks/`, or in the modpack's required Global Packs directory. Start/reload the world; look for `Loaded 57 fields` in the log. The jar requires the datapack's `rejuvenation:indoor` definition. No Rejuvenation game installation is needed at runtime.

Natural wild battles select a field from the wild Pokémon's environment. Existing trainer and player battles remain opt-in through `FieldApi`; no trainer definitions have been edited. The Run & Bun implementation is unchanged. Read [trainer integration](docs/TRAINER_INTEGRATION.md) before opting a trainer battle into fields.

No original game graphics, animations, audio or complete Ruby scripts are included. Seed items use vanilla wheat-seed visuals; Amulet Coin uses the vanilla gold-nugget visual, and Amplifield Rock uses cobblestone. Existing Cobblemon Everstones are bridged into opted-in battle teams. Original field mechanics and required battle text are stored as data.

## Rebuilding and checks

Run `./rejuvenation/build.ps1` from this profile with Java 21, Python, Node, Ruby and cached Gradle 8.13 available. The script prepares compile-only dependencies from the installed profile, regenerates and validates content, compares compiled source definitions, executes the bounded original-Ruby method oracle, writes documentation, builds/tests the mod and packages the datapack. The oracle requires the recorded local reference installation. A direct Gradle `build` runs simulator/Java/Graal checks without requiring that installation; the separate `sourceOracleTest` task runs the original-source check. Dependencies are not bundled into the jar or zip. `-RefreshSource` additionally reruns the Ruby extraction/audit against the recorded local source.

`research/live_check.py` runs an isolated cached Minecraft client with copied configuration and fresh chunks using the existing world's level metadata. Its temporary dependencies stay under `integration/` and are not distributable output. It does not use account credentials or modify the original save. Simulator and shaded-Graal checks run during the normal Gradle build. Build the separate `integrationFixtureJar` task and run `research/live_check.py --battle` to exercise five real battles, including the Dive/Dusk capture events in the isolated game. The fixture is excluded from distributable artifacts and refuses to run outside its isolated game directory. Two-client multiplayer remains separate verification work.
