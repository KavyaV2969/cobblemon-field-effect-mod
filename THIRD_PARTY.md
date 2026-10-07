# Third-party material, attribution and redistribution status

This is an unofficial, non-commercial fan project. *Pokémon* and related names are © Nintendo, Creatures Inc. and GAME FREAK inc. The project is not affiliated with or endorsed by them, by the authors of Pokémon Rejuvenation, or by any mod named below.

## Pokémon Rejuvenation (reused artwork and game data)

*Pokémon Rejuvenation* V14 (14.0.14) is a fan game by Janichroma (lead developer) and the Rejuvenation team; art is credited in the game's `ReadMe_Credits.txt` to Zumi (Honnojis), Janichroma, Crimson, CeriseBlossome, Winter, Azeria, Dallas, Soulja, IronicOmens and MoonPaw. This project reimplements the game's *field mechanics* from its data and scripts (as data and an original engine; no script, audio, music or character artwork is included) and reuses two sets of its graphics:

| Material | Files | Where | Provenance |
|---|---|---|---|
| Field battle backdrops | 57 PNG, `Graphics/Battlebacks/battlebg*.png` copied unmodified | `core/src/main/resources/assets/rejuvenation/textures/gui/field/` | `field_backdrops.json` records each source file and SHA-256 |
| Held-item icons | 5 PNG (Magical, Telluric, Synthetic, Elemental Seed, Amplifield Rock), converted losslessly from the game's BMP files | `core/src/main/resources/assets/rejuvenation/textures/item/` | `item_icons.json` records source file, source SHA-256, pixel SHA-256 and method |

**Redistribution status: unresolved, used on the owner's stated basis.** The game's credits file asks anyone taking its assets to make sure they may. The project owner states that this is a non-commercial fan mod for the game and that using these graphics in it is allowed. **No written permission from the Rejuvenation team is on file.** Attribution is not a substitute for permission; if the rights holders object, remove the 62 files above (the mod then falls back to the Indoor backdrop and vanilla item textures) and republish. Do not reuse the Rejuvenation artwork elsewhere without asking the team (contact details are in the game's credits file).

Four of the 61 backdrops (Deep Dark, Pale Garden, Warped Forest, Crimson Forest) are Minecraft screenshots supplied by the project owner (`research/custom-artwork/`), not Rejuvenation artwork.

## Field Notes text (Pokémon Rejuvenation Wiki)

The Field Notes of the 57 original fields reproduce the field entries of the Pokémon Rejuvenation Wiki (https://rejuvenation.wiki.gg/wiki/Field_Effects and the per-field pages it lists; the snapshots and their revision numbers are in `research/wiki-notes/`). The wiki's text is licensed under **Creative Commons Attribution-ShareAlike 4.0 International** (https://creativecommons.org/licenses/by-sa/4.0/). Only wiki markup, links and images were removed. Every note carries a "Source" section naming its page, revision and license, and `field-notes/FIELD_NOTES.md` repeats it. As ShareAlike requires, the notes (`datapack/base/data/rejuvenation/rejuvenation/notes/`, the four custom notes in `research/custom-fields/`, `field-notes/FIELD_NOTES.md`, and the packs that contain them) are shared under the same license, whatever license the rest of the project later receives. The wiki and the wiki's contributors are not affiliated with this project. The notes of the four custom fields follow the wiki's layout and are original text.

## Data extracted from the Rejuvenation scripts

`research/field-specification.json`, `compiled-field-specification.json`, `interaction-audit.json`, `semantic-reviews.json`, `source-hashes.json`, `source-reference-index.json`, `ai-affinity-source.json` and `ai-disruption-source.json` hold *facts derived from* the game's scripts: field definition values, AI weights and short condition expressions with file and line references, and SHA-256 fingerprints. They are the inputs of the generators and audits; no script file and no script body is included. If the game's authors object, remove them; the committed data packs are then still buildable but not regenerable.

## Not included, not redistributed

* **Minecraft, Fabric Loader, Fabric API, Cobblemon, Pokémon Showdown (including Cobblemon's shaded copy), Mixin, ASM**: compiled against and tested with the installed copies; nothing is bundled in any jar or pack.
* **Run & Bun (`rbrctai`), RCT API (`rctapi`), Cobblemon Battle Extras**: the compat mod's mixins and adapters target their classes by name and are only applied when the mods are installed; none of their code is included.
* **Terralith, VanillaBackport, Repurposed Structures, Cobblemon Additions, LumyMon, Legendary Monuments, Cobblemon Raid Dens, the COBBLEVERSE packs**: the extension pack names their biome and structure IDs and trainer IDs (facts about their registries) but contains none of their content. The COBBLEVERSE RCT trainer pack is referenced by name and hash only; the Lt. Surge trainer file and gym structure in the extension are this project's own override of two files of that pack.
* **The Pokémon Rejuvenation game itself** (scripts, graphics other than the 62 files above, audio): never part of the repository or any release. The comparison and oracle tools read a copy you supply through `REJUVENATION_REFERENCE`.

## Names of mods used for build and test

Cobblemon (MPL-2.0), Fabric (Apache-2.0) and the other projects above have their own licenses; consult them directly. This repository does not copy their source.
