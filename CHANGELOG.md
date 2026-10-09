# Changelog

## 0.1 — first public release

* **License:** the original code and data are released under the Unlicense ([LICENSE](LICENSE)); third-party material keeps its own terms ([LICENSE-STATUS.md](LICENSE-STATUS.md)).

The private development builds were numbered 0.2.0; the public numbering starts again at 0.1. Changing the displayed version renames nothing that is stored: mod ID `rejuvenation_fields`, namespace `rejuvenation`, and every field, item, status, packet and payload ID are unchanged ([migration](docs/MIGRATION.md)).

* **Two Kanto difficulty variants.** The rebuilt Kanto league is now a choice of two roster packs, **Classic** (recommended: the same fields, AI and gimmicks, with less setup stacking, fewer Uber picks and normal stats) and **Hardcore** (the original roster override, unchanged). They replace the same 13 trainer files and are mutually exclusive. `rejuvenation-fields-cobbleverse-0.1.zip` no longer contains rosters (mappings, field assignments and the Lt. Surge gym only), so a Kanto setup is now extension + one of `rejuvenation-fields-cobbleverse-classic-0.1.zip` / `rejuvenation-fields-cobbleverse-hardcore-0.1.zip`. Classic changes: Iron Hands' item; Erika's Kartana to Ferrothorn; Mega Alakazam's Calm Mind to Shadow Ball; Koga's Naganadel, Sneasler and Mega Gengar to Mega Dragalge (second in his order); Blaine's Chi-Yu to Typhlosion-Hisui (Tera Grass); Giovanni's Chien-Pao to Toxtricity (Tera Normal); Lorelei, Bruno, Agatha and Lance set-up and item trims; Blue's EVs to normal spreads. Documentation: [Classic](README_KANTO_CLASSIC.md), [Hardcore](README_KANTO_HARDCORE.md), [comparison](README_KANTO_LEAGUE.md). Tools: `research/classic_league.py`, `research/verify_kanto_gyms.cjs --variant`, `research/simulate_kanto_fights.cjs --variant`, `research/deploy.py --league`. The fight simulation's Tera policy now accepts a declared member in any of its forms (it previously never let form-named members such as Ogerpon-Hearthflame Terastallize).
* **`config-overrides/`** holds the RCT server configuration (level cap and offset) and the LumyMon configuration (Poké Snack blacklist switched off) for fresh modpacks.
* **Kanto fight simulation** (`research/simulate_kanto_fights.cjs`, [report](docs/KANTO_FIGHT_SIMULATION.md)): all 13 Kanto league fights played to the end offline. It found one engine error, now fixed: field-changing moves such as Misty's Dive could not be scored against foes that faint during the rollout (the decision-time disruption view is now taken before the rollouts; regression test in `strategy-regression.cjs`, repro `research/repro_dive_scoring_error.cjs`). The engine hash changes, so the core jar must be rebuilt.
* The README is rewritten as a step-by-step install guide with the full mod and data pack list.

### Field Notes and names

* **Formal Field Notes for all 61 fields.** The notes of the 57 original fields are now the entries of the Pokémon Rejuvenation Wiki (https://rejuvenation.wiki.gg/wiki/Field_Effects and the field pages it lists), converted from stored revisions (`research/wiki-notes/`, `research/wiki_notes.py`): description, general effects, affected abilities and moves, transitions, items and special rules, plus a generated "Where it appears" section and a Source section naming the wiki page, revision and license. The wiki text is licensed Creative Commons Attribution-ShareAlike 4.0, so the notes and the markdown copy are shared under that license ([THIRD_PARTY.md](THIRD_PARTY.md)). The four custom fields' notes are rewritten in the same style.
* **`field-notes/FIELD_NOTES.md`** holds the text of every note verbatim, generated with the packs.
* **Custom field names** are now "Deep Dark", "Crimson Forest", "Warped Forest" and "Pale Garden" (without "Field"). IDs are unchanged.

### Structure

* **Two mods.** `rejuvenation-fields` (core: engine, catalog, selection, evaluator, UI, notes, packets, items, recipes) and the new `rejuvenation_fields_compat` (Run & Bun and RCT scoring and declarations, the global NPC gimmick policy, Cobblemon Battle Extras previews). The core names no third-party class; the compat mod requires the matching core, has no engine, loader, registry, panel or packet of its own, and gates each integration on its mod being installed. Verified code-for-code against the 0.2.0 jar: the split moved code without changing it.
* **Two data packs.** `rejuvenation-fields-base` (all 61 field definitions, notes, items, abilities and every mapping that vanilla Minecraft 1.21.1, Cobblemon and Fabric API support) and `rejuvenation-fields-cobbleverse` (mappings for other mods and backports, Kanto trainer bindings, the Lt. Surge gym; requires the base). Mapping and structure documents now merge by an explicit `order` and resource ID instead of listing order; the packs together resolve exactly like the former single pack over 1.36 million environment snapshots.
* The 0.2.0 field pack and gym override pack are superseded by the two new packs.

### Added

* **Item icons and recipes** for the existing Magical, Telluric, Synthetic and Elemental Seeds and the Amplifield Rock: the original Rejuvenation icons converted losslessly (the source `.png` files are BMP) and five cross-pattern crafting recipes around Cobblemon's terrain seeds or rocks. Registry IDs and held-item behaviour are unchanged.
* **Custom-field authoring kit**: schema, template, worked example, builder, pack verifier and the guide `docs/CUSTOM_FIELD_AUTHORING.md`. Parent-rule selection now retargets guards on the parent's own ID and reports any other parent reference.
* **Custom-field validation**: a requirement-to-test matrix for the four specification documents with their hashes, and 25 new simulator tests (656 in all) and 55 new Graal assertions (110 in all) (Base Power class boundaries, Commander-hidden battlers, STAB with added types, Bloodlust exclusions, Creaking connection rules, Pale Garden abilities, room durations with Amplifield Rock, untouched-twin previews, simultaneous battles and reload snapshots, among others).
* Installation-matrix, pack-equivalence, jar-differential and latency comparisons, and a reproducible packaging step with a hash manifest.

### Changed

* Build configuration no longer assumes a particular machine or profile location: `REJUVENATION_PROFILE`, `REJUVENATION_META`, `REJUVENATION_REFERENCE`, `RUBY`, `PYTHON` and command-line options replace them ([building](docs/BUILDING.md)).
* The field-catalog loader orders mapping and structure documents deterministically (`RuleDocuments`).
* Documentation was reorganised: one authoritative explanation per topic; working handoff documents were removed from the public set.

### Notes

* The Crimson Forest specification is ambiguous about its entry text ("The red flora preying..." in the Entry line, "The red flora is preying..." in the flavor pool). The shipped entry text is "The red flora is preying...", the grammatical form chosen by the project owner; the 0.2.0 build announced the Entry line as written ([custom fields](docs/CUSTOM_FIELDS.md)).

### Known limitations

See the README. Notably: offline verification only; no live run of the split or the new items; Global Packs ordering of the extension is relied on, not observed; the artwork reused from Pokémon Rejuvenation is used on the owner's fan-project basis without written permission from its authors ([THIRD_PARTY.md](THIRD_PARTY.md)); no license has been chosen yet ([LICENSE-STATUS.md](LICENSE-STATUS.md)).
