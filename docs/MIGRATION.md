# Installing, combining and migrating (0.1)

Rejuvenation Fields 0.1 is the first public release. It replaces the private development builds numbered 0.2.0 (one jar, one field pack and one gym override pack). The displayed version was reset to 0.1 for the public release; nothing that a save or a world stores changed: mod ID `rejuvenation_fields`, resource namespace `rejuvenation`, all field, item, status, packet and payload IDs, and the saved item stacks are the same.

## What you install

| File | Where | Required? |
|---|---|---|
| `rejuvenation-fields-0.1.jar` | `mods/` on the server and every client | **Yes.** The whole field system. Works alone. |
| `rejuvenation-fields-base-0.1.zip` | the world's `datapacks/` (or the Global Packs *required* data-pack folder) | **Yes.** All 61 field definitions and every mapping that vanilla Minecraft 1.21.1, Cobblemon and Fabric API support. The jar will not start fields without it (`rejuvenation:indoor` is required). |
| `rejuvenation-fields-compat-0.1.jar` | `mods/` (server and clients) | Optional. Adds the third-party integrations below. Requires the core jar of the same 0.1 series. |
| `rejuvenation-fields-cobbleverse-0.1.zip` | the same data-pack folder as the base | Optional. Mappings for COBBLEVERSE's other mods, the trainer field bindings and the Lt. Surge gym. Requires the base pack. |

Requirements: Minecraft 1.21.1, Fabric Loader 0.17.2 or newer (built against 0.18.4), Fabric API 0.116.6 or newer (built against 0.116.14+1.21.1), Cobblemon 1.7.3+1.21.1, Java 21. Nothing from Pokémon Rejuvenation is needed at runtime.

### What each optional piece adds, and what is absent without it

| Without… | Missing |
|---|---|
| compat jar | Run & Bun and RCT field-aware scoring, the global NPC gimmick policy (undeclared Tera/Dynamax cannot activate; eligible Mega on the first legal move) and Cobblemon Battle Extras' exact field-aware move previews. The field system itself, the field panel and Field Notes are unaffected. |
| Battle Extras / Run & Bun / RCT API | Only the matching integration inside the compat jar is skipped; the compat jar loads without them (each integration is gated on its mod being installed, including class loading and mixin application). |
| COBBLEVERSE extension | Mappings for Terralith, LumyMon, Legendary Monuments, Cobblemon Raid Dens, Cobblemon Additions villages and Repurposed Structures variants, plus the backported biomes (`minecraft:pale_garden`, `minecraft:sulfur_caves`, provided by VanillaBackport); the Kanto league bindings; the Surge gym. The fields themselves are all still available to explicit selection. |

### Supported combinations

Core + base alone; core + base + compat (with any subset of Run & Bun, RCT API, Battle Extras); core + base + extension; and everything together (the COBBLEVERSE profile this was built for). The compat jar without the core, and the extension without the base, are not supported: the first fails mod resolution, the second fails the catalog check ("Mapping references missing field") and the previous catalog stays active.

## Pack order and Global Packs

The two packs never define the same file and their mapping documents merge deterministically by an `order` number and resource ID, so **their relative order does not matter**. What does matter is the extension against the original COBBLEVERSE packs: it carries replacement copies of `data/rctmod/trainers/kanto_ltsurge.json` and `data/cobbleverse/structure/ltsurge.nbt`, which must override the originals in `COBBLEVERSE-RCT-DP` and `COBBLEVERSE-DP`. In a data-pack stack the pack listed later wins. The Global Packs mod, as used in the COBBLEVERSE profile, loads the packs of its required folder in file-name order, and the lower-case `rejuvenation-fields-…` names sort after the upper-case `COBBLEVERSE-…` ones: the former `rejuvenation-gym-overrides` pack depended on the same naming. This ordering was **not re-verified in a running game for 0.1** (the checks here are offline). After installing, run `/datapack list` once and confirm that `rejuvenation-fields-cobbleverse` is listed **after** (above) the COBBLEVERSE packs; if you manage pack order yourself, place the extension above them. Enable both Rejuvenation packs as *required* packs together with the other COBBLEVERSE data (they are not optional: a world that loses the base loses every field).

The extension is in the world's *Datapacks* list as a normal pack; removing it removes only its mappings, bindings and gym override (battles outside those places are unchanged).

## Migrating from the private 0.2.0 build

Do this with the game closed; new jars are only loaded at start, so **a client and server restart is required**.

1. Remove `mods/rejuvenation-fields-0.2.0.jar` (keep a copy if you want to roll back).
2. Remove `datapacks/rejuvenation-fields-datapack-0.2.0.zip` and `datapacks/rejuvenation-gym-overrides-0.2.0.zip`. The gym override is now part of the extension pack; leaving the old zip would let two copies compete.
3. Add the two jars to `mods/` and the two zips to `datapacks/`.
4. Start the game. The log shows `Loaded 61 fields, …` once the world has loaded.

`research/deploy.py` does these steps for a profile (dry run by default, `--apply` to write): it moves the old files to a dated backup folder instead of deleting them, verifies every copy by SHA-256, refuses to run while a game is running and writes a receipt. `python research/deploy.py --rollback <backup folder> --apply` restores the old files.

Saved worlds, trainer teams, player data and item stacks need no conversion. Mid-battle field state was never persisted.

## Rollback

Restore the 0.2.0 jar and the two 0.2.0 zips (the backup folder written by `deploy.py` contains them with their hashes), remove the four 0.1 files, restart. Because nothing stored changed, this is safe in either direction.

## Stable identifiers

`rejuvenation_fields` (core mod ID), `rejuvenation_fields_compat` (new), namespace `rejuvenation`, item IDs `rejuvenation:magical_seed`, `telluric_seed`, `synthetic_seed`, `elemental_seed`, `amplifield_rock` and `amulet_coin`, field IDs `rejuvenation:<field>`, payload IDs `rejuvenation:field_state`, `field_notes`, `move_evaluations`, `evaluation_request`, and the data directories `data/<namespace>/rejuvenation/{fields,mappings,structures,items,abilities,trainers,notes}`.
