# Coding-agent brief: custom-field authoring, validation, items and modular packaging

Prepared 7 October 2026 for the existing, working Rejuvenation Fields installation.

## Objective

Complete four related improvements while preserving the current behavior of the mod, then prepare their public release:

1. Provide a reusable custom-field template and a practical authoring/mapping guide.
2. Offline-playtest Deep Dark, Crimson Forest, Warped Forest and Pale Garden against the user's intended behavior.
3. Finish the four Rejuvenation terrain seeds and Amplifield Rock with their original icons and the requested crafting recipes.
4. Separate the code into a field-system mod and a compatibility mod, and separate the authored field datapacks into a portable Minecraft/Cobblemon pack and a COBBLEVERSE extension pack.

Package the completed mods and datapacks for online upload, and clean up the `rejuvenation` project and its documents for public GitHub distribution as **version 0.1**. This is an additional deliverable, not a replacement for any of the four workstreams.

The user considers the current installation working. Treat it as the regression baseline. This is a controlled extension and packaging refactor, not permission to redesign the field engine, trainer AI, existing field balance, UI or unrelated mods.

## Workspace and authoritative inputs

Workspace:

```text
C:\Users\Lenovo\AppData\Roaming\ModrinthApp\profiles\COBBLEVERSE - Pokemon Adventure [Cobblemon]
```

Current environment: Minecraft 1.21.1, Fabric Loader 0.18.4, Fabric API 0.116.14+1.21.1, Cobblemon 1.7.3+1.21.1, Java 21. Inspect installed metadata before building; compile against the exact installed ABIs.

The four intended-behavior documents are:

```text
C:\Users\Lenovo\Downloads\Deep_Dark_Field.md
C:\Users\Lenovo\Downloads\Crimson_Forest_Field.md
C:\Users\Lenovo\Downloads\Warped_Forest_Field.md
C:\Users\Lenovo\Downloads\Pale_Garden_Field.md
```

Read them in full. Copy their current contents into a versioned project specification directory and record source paths and SHA-256 hashes so the test report remains reproducible. Do not modify the originals in Downloads. Use these documents together with the explicit resolutions already recorded in `docs/CUSTOM_FIELDS.md`; do not substitute web summaries for the local specification.

Important existing paths, relative to the workspace:

| Path | Purpose |
|---|---|
| `rejuvenation/mod/` | Current Java/Fabric mod and tests |
| `rejuvenation/mod/src/main/resources/rejuvenation-engine.js` | Shared simulator field engine |
| `rejuvenation/research/custom-fields/*.json` | Canonical authored inputs for the four custom fields |
| `rejuvenation/research/custom_fields.py` | Builds custom definitions, including selected parent rules |
| `rejuvenation/research/generate.py` | Generates field content and mappings |
| `rejuvenation/research/field_notes.py` | Generates player-facing notes |
| `rejuvenation/datapack/data/rejuvenation/rejuvenation/fields/` | Generated runtime field definitions |
| `rejuvenation/datapack/data/rejuvenation/rejuvenation/mappings/modpack.json` | Currently mixed environment mappings |
| `rejuvenation/datapack/data/rejuvenation/rejuvenation/structures/vanilla.json` | Currently mixed vanilla/modded structure mappings |
| `rejuvenation/datapack/data/rejuvenation/rejuvenation/items/seeds.json` | Existing simulator item definitions |
| `rejuvenation/gym-overrides/` | Authored Surge trainer and gym overrides |
| `rejuvenation/docs/BATTLE_AI_POLICY.md` | Required current trainer permission/activation behavior |
| `rejuvenation/docs/INTEGRATIONS.md` | AI, previews, evaluator and performance boundaries |
| `rejuvenation/research/test-results/global-battle-ai.json` | Latest global trainer-AI deployment receipt |

## Protect the working baseline

Before changes, record hashes and retain recoverable backups of the installed authored jar/datapacks, source inputs, build configuration and packaging scripts. The last recorded installed jar is `mods/rejuvenation-fields-0.2.0.jar`, SHA-256:

```text
e58e457f0290fc0bc5e9b33231621b751c85a7ce4f9aac47d1bdc3470e8020d6
```

Verify the current file rather than assuming that this recorded hash is still current. Preserve subsequent user changes if it differs.

Preserve these invariants throughout all four workstreams:

- All 57 original field definitions retain their current mechanics, values and source-audit dispositions. Keep the four custom fields distinct: 57 original + 4 custom = 61.
- Unchanged field scenarios retain the same seeded simulator outcomes, messages, transitions and lifecycle behavior. Any intentional custom-field correction must cite a specification mismatch and be covered by a regression test.
- All mutable field state remains battle-local. Preview and AI evaluations remain read-only transactions that restore RNG, HP, statuses, abilities, forms, items, logs, counters, action queues and gimmick resources.
- Preserve field panels, Field Notes, authoritative damage/KO previews, type/effectiveness displays, payload IDs and client/server lifecycle behavior.
- Preserve field-selection precedence, underwater detection, structure containment, village footprints, substrate layers, trainer overrides, reload snapshots and cleanup.
- Preserve existing item registry IDs, field IDs, resource namespaces and saved-stack compatibility. Do not duplicate item, type, ability, status, packet or simulator-handler registration.
- Preserve the global NPC policy: undeclared Tera/Dynamax cannot activate; AI targets only narrow permission; eligible NPC Mega activates on the first legal move; spent resources cannot be recreated; allied slots cannot reserve the same resource twice. Preserve documented native bag-item/pass handling and player/wild scope.
- Preserve Surge's Murkwater Surface assignment, existing custom team, Eelektross Mega, and Magnezone Flying Tera. Do not reintroduce a trainer/species exception or unauthorized Dynamax.
- Do not edit, replace or bundle external mod jars, the installed Showdown distribution, the original COBBLEVERSE trainer pack or the user's world/save. Test offline in an isolated build/simulator environment.

Use small, separately reviewable changes. Establish a baseline before moving code. Complete and validate content changes before the packaging split, then prove the split itself introduces no behavior changes. Avoid mixing a mechanical fix with a large file move in the same review unit.

## Workstream 1 — Custom-field template and authoring guide

Create a reusable, schema-valid template based on the common structure actually present in the current fields. Inspect the canonical authoring schema and generated runtime schema separately; they are not interchangeable.

Deliver an authoring template compatible with the existing custom-field generator, plus a generated runtime example that demonstrates the complete workflow. Keep the example outside the installed production catalog so it does not increase the shipped count beyond 61.

The common template should cover identity, entry message, standard field hooks, type modifiers, move modifiers, declarative event/condition/action rules and seed behavior. Present transitions, counters/mechanics, secondary typing, overlays, notes and artwork as optional sections, with valid examples in documentation rather than invalid placeholder values in loadable JSON.

Use the engine's existing operators, conditions and mechanic recipes. The promised workflow is adding custom fields whose logic already exists in this engine. Do not invent an event/operator, introduce executable datapack scripts, or require Java/JavaScript edits for each new field. If a requested mechanic cannot be expressed with existing primitives, identify that limitation explicitly.

Write `CUSTOM_FIELD_AUTHORING.md` with an end-to-end example covering:

1. Choosing a stable namespaced ID, filename, display name and base field.
2. Which files are authored and which are generated; edit canonical inputs, not generated JSON.
3. Reusing selected parent rules without accidentally inheriting every parent effect. Retarget parent-field ID guards and preserve deterministic rule order. Retain existing inheritance checks that detect parent-rule drift.
4. The distinction between move/type multipliers, secondary effectiveness typing and STAB; avoid applying the same bonus twice.
5. Configuring seeds, messages, standard hooks, counters and transitions through existing data primitives.
6. Adding Field Notes and artwork using the existing resource pipeline.
7. Mapping a field to an exact biome ID or structure ID/tag, optionally constrained by dimension/depth/sky visibility or containment policy as supported today.
8. Selection precedence and overlapping mappings, including why an Ancient City can override its enclosing biome and how village footprint matching works.
9. Where a mapping belongs after the datapack split; distinguish a resource's namespace from the mod that actually provides it.
10. Generation, validation, isolated simulator testing and packaging/reload steps, with executable commands matched to the final project layout.
11. A short troubleshooting section for unknown IDs, unsupported operators, missing biome providers, bad references and mappings shadowed by higher-priority rules.

Acceptance: copying the template and changing the documented fields produces a valid custom field without engine changes. Tests prove the example's rule, seed and mapping behavior, and prove that it is not automatically shipped/enabled as a 62nd field.

## Workstream 2 — Offline playtests of the four custom fields

Audit implementation against every specification statement. Produce a traceability table linking each intended behavior to its canonical data/engine implementation, named test and result. Run battles in the actual installed Showdown simulator and Cobblemon's shaded Graal runtime; schema validation alone is insufficient.

Existing suites include `custom-field-regression.cjs`, `custom-fusion-regression.cjs`, `custom-strategy-regression.cjs`, `graal-regression.js`, and the broader engine/evaluator/Java suites. Extend them for uncovered behavior rather than replacing the established tests. Keep fixed RNG seeds and explicit battle-state assertions.

### Deep Dark

Verify all type modifiers, messages, Mimicry/Camouflage/Terrain Pulse, Nature Power and Secret Power effects. Validate Deep Dark biome and Ancient City selection, including modded Ancient City variants when the extension pack is present.

Exercise Sculk Warning as one shared 0–4 counter: BP boundaries below 90, 90, 149 and 150; sound/seismic/explosive overrides; exclusive rather than additive warning sources; once-per-side-per-turn allowance; doubles, spread and multi-hit actions; calming and Flash; seed activation; and ineffective changes at the bounds. Preserve the documented distinction between move execution, failed execution, misses, protection, immunity and charging turns.

At Warning 3, test the 0.9 accuracy modifier, exemption abilities, Rattled crossing behavior and darkness removal after calming. At 4, test 20% maximum-HP retaliation, exact immunity behavior using current types/abilities, once-per-turn processing, reset to 1, faint/hidden battler handling, and persistence across switches. Verify environmental damage is not incorrectly treated as ordinary move damage or included in the preview's move KO estimate.

### Crimson Forest

Verify the stated type/move multipliers, inherited ability effects, standard hooks, seed boosts/Taunt, freeze/weather restrictions, selected move effects and flavor text.

Test special Flying moves' Poison effectiveness component and the Grass/Fire composition of Power Whip and Vine Whip, including interaction with type bonuses without extra STAB. Test Bloodlust for direct opposing KOs, stacking with Moxie, multiple KOs, and exclusion of ally KOs, recoil, status, weather and field damage. Verify Good as Gold entry boosts.

For Crimson Vines, use actual resolved positive priority and verify the 0.8 final-accuracy modifier. Crash occurs only when this penalty causes the miss; test ordinary misses, protection, immunity, never-miss moves, existing crash moves and deterministic RNG boundary cases. Preserve standard High Jump Kick-style crash behavior and the existing broad attribution scan.

### Warped Forest

Verify all stated type/move modifiers, selective parent effects, ability effects, standard hooks, seed boosts/Ingrain, freeze/weather policy, Leech Seed's quarter-HP drain and unstable Room/Gravity durations.

Verify ordered secondary-type composition, including Forest cutters gaining Grass and then the field's Dark effectiveness component, without recursive duplication or added STAB. Test Dark Pulse/Night Daze accuracy and combined move/type multipliers, the 3–8-turn duration range and its existing item precedence, field replacement/restoration and entry/residual handling.

### Pale Garden

Verify that selected Bewitched Woods behavior remains active after parent-ID guards are retargeted: type-chart exceptions, move modifiers, abilities, healing, sleep damage, standard hooks and messages.

Test Creaking Distraction as separate side counters: one damaging tick per side per turn, successful status reset without suppressing the status move's normal effects, doubles, threshold damage of 40% maximum HP, correct side attribution and reset to zero. Cover misses/protection/immunity and preserve the current documented execution-versus-connection resolution.

The source document contains conflicting Magical Seed descriptions. The existing documented resolution is the final explicit statement: **Defense +6 and petrification**. Preserve that resolution; do not revert to Bewitched Woods' Special Defense +1/Ingrain while copying parent behavior.

### Cross-cutting acceptance

For all four fields, cover simultaneous battles, switches/faints, reload snapshots, field changes/restoration, counter/allowance cleanup, seeded random durations, item consumption and suppression, relevant abilities, and Mega/Tera/Z/Ultra/Max paths where offered and authorized. Test cached repeated previews and strategy queries against an untouched twin battle: evaluating alternatives must not spend a resource, consume a seed or alter a real turn.

Use availability-aware fixtures for source-only moves/forms. Report unsupported or unavailable content distinctly from failures; do not silently alias IDs or mark an unexecuted check as passed. Preserve existing documented resolutions unless a clear, new source discrepancy requires a narrowly scoped correction.

These are offline simulated playtests. Do not claim live rendered Minecraft or multiplayer verification unless separately performed and recorded.

## Workstream 3 — Complete the existing five items

The four seeds and Amplifield Rock already have item registrations, Showdown IDs and field-related behavior. Finish and validate those existing items; do not introduce duplicate items or rewrite working mechanics. The existing Amulet Coin is outside this request and must remain unchanged.

### Original graphics

Use these exact source icons:

```text
Rejuvenation 14 copy/Graphics/Icons/Item/magicalseed.png
Rejuvenation 14 copy/Graphics/Icons/Item/telluricseed.png
Rejuvenation 14 copy/Graphics/Icons/Item/syntheticseed.png
Rejuvenation 14 copy/Graphics/Icons/Item/elementalseed.png
Rejuvenation 14 copy/Graphics/Icons/Item/amplifieldrock.png
```

Important: despite their `.png` filenames, the inspected files are **BMP-format, 48×48, RGBA**. Decode the actual format and losslessly encode valid PNG textures for Minecraft. Do not simply rename/copy BMP bytes into a PNG resource, and do not redraw or generate replacements. Preserve exact RGBA pixels, transparency, dimensions, colors and orientation. Update item models to reference the new `assets/rejuvenation/textures/item/` textures.

Verify decoded source/output pixel equality, valid PNG signatures, model references and resource loading. Supply a contact sheet or other visual review showing each source icon beside the resulting Minecraft texture. Record source hashes, conversion method and provenance/attribution, consistent with the project's existing Rejuvenation asset attribution practice.

Keep these registry IDs:

| Display name | Output item |
|---|---|
| Magical Seed | `rejuvenation:magical_seed` |
| Telluric Seed | `rejuvenation:telluric_seed` |
| Synthetic Seed | `rejuvenation:synthetic_seed` |
| Elemental Seed | `rejuvenation:elemental_seed` |
| Amplifield Rock | `rejuvenation:amplifield_rock` |

### Crafting recipes

Use a shaped 3×3 **cardinal cross** with four surrounding ingredients, a single center ingredient, empty corners, and one output:

```json
[" A ", "ASA", " A "]
```

Here `S` is the center and `A` is the surrounding ingredient. The spaces are empty slots. Use the recipe/tag format supported by Minecraft 1.21.1, with namespaced IDs.

| Output | Center: any one of these | Four surrounding ingredients |
|---|---|---|
| Magical Seed | Cobblemon Grassy, Misty, Electric or Psychic Seed | `minecraft:amethyst_shard` |
| Telluric Seed | Cobblemon Grassy, Misty, Electric or Psychic Seed | `minecraft:gunpowder` |
| Synthetic Seed | Cobblemon Grassy, Misty, Electric or Psychic Seed | `minecraft:redstone` |
| Elemental Seed | Cobblemon Grassy, Misty, Electric or Psychic Seed | `minecraft:glowstone_dust` |
| Amplifield Rock | Cobblemon Damp, Icy, Smooth or Heat Rock | `cobblemon:everstone` |

The inspected input IDs are `cobblemon:grassy_seed`, `misty_seed`, `electric_seed`, `psychic_seed`, `damp_rock`, `icy_rock`, `smooth_rock`, `heat_rock` and `everstone` (all in the Cobblemon namespace). Verify the live registry as well as packaged assets. Use narrow, explicit ingredient tags or equivalent alternatives; accept every named center option and no unrelated item.

Acceptance: all 16 seed/center combinations and all four rock/center combinations craft the correct single item, consume exactly the five occupied slots, and reject incorrect surrounding materials, unauthorized centers and incorrect patterns. Verify recipe parsing and outputs through actual recipe APIs where feasible, not only JSON inspection.

Validate resulting held-item effects through the existing field engine: field-specific seed boosts/effects and consumption, nonmatching fields, suppression and reactivation semantics, and Amplifield Rock's supported terrain/temporary-field duration effects and exceptions. Keep existing Everstone behavior and the distinction between Cobblemon's native terrain seeds and the four Rejuvenation seeds.

Package the item textures/models, registration and recipes so the portable core installation can use them without the compatibility mod or COBBLEVERSE extension pack.

## Workstream 4 — Two mods and two authored field datapacks

### Mod boundaries

Produce these two runtime artifacts with a reproducible build:

| Artifact | Responsibility |
|---|---|
| `rejuvenation-fields-0.1.jar` | Core field system, existing namespace/item registration, declarative engine, validators/catalog, generic Minecraft/Cobblemon lifecycle integration, field selection APIs, evaluator/transactions, field UI/notes/networking and required native simulator hooks |
| `rejuvenation-fields-compat-0.1.jar` | Third-party integrations: Battle Extras previews/tooltips, Run & Bun scoring hooks, RCT declarations/trainer bindings and the global NPC gimmick-policy boundary |

Keep the existing core mod ID `rejuvenation_fields` and resource namespace `rejuvenation` for migration compatibility. Give the new compatibility mod a distinct ID, such as `rejuvenation_fields_compat`, and an explicit compatible dependency on the core. The core must not depend on the compatibility jar or import RCT, Run & Bun or Battle Extras classes.

Inventory classes, mixins, entrypoints and registrations before moving them. Define a small core-facing API for adapters; reuse the existing `FieldApi`, `FieldEvaluator` and related immutable data where suitable. The compatibility module must not contain a second engine, catalog loader, item registry, field panel, packet registration or resource publication path.

Optional integrations must be independently gated by installed mod presence, including class loading and mixin application, so absent dependencies do not cause linkage errors. Test dedicated-server safety: client-only Battle Extras classes must not initialize on the server. Preserve the existing mixin priorities needed for Battle Extras' merged methods.

Move global trainer policy and its RCT declaration adapter together. Keep the required permission checks, cached-Max cleanup, authoritative offer restoration, resource reservations, legal fallbacks and Mega activation constraint. Ensure those hooks run exactly once with both jars installed. Preserve early trainer field selection before the core's battle-start capture.

The core-only installation provides the field system; its documented lack of third-party trainer/preview adapters is intentional. With both modules and their integrations present, behavior must match the current combined mod. Do not leave the old monolithic jar installed beside the split jars.

### Datapack boundaries

Produce exactly two new authored field-pack artifacts:

| Artifact | Contents |
|---|---|
| `rejuvenation-fields-base-0.1.zip` | Shared definitions for all 61 fields, field items/abilities/notes as currently required, and mappings supported by vanilla Minecraft 1.21.1 plus Cobblemon. Shared field definitions exist here only. |
| `rejuvenation-fields-cobbleverse-0.1.zip` | Additional mappings for COBBLEVERSE's mods/biomes/structures, backported registry additions, trainer field bindings, and the existing authored gym/team overrides where they are currently required. Depends on the base field pack. |

Classify mapping entries by the actual provider and registry availability, not namespace alone. In particular, `minecraft:pale_garden` is not vanilla Minecraft 1.21.1 content: this profile supplies it through VanillaBackport. The field definition still belongs in the shared base catalog, but its backport-dependent biome mapping belongs in the extension pack. Vanilla Deep Dark/Crimson/Warped biome mappings and vanilla Ancient City mappings belong in the base; Repurposed Structures variants belong in the extension.

Audit the currently misleading filenames: `mappings/modpack.json` and `structures/vanilla.json` each contain mixed content. Preserve underwater handling and substrate mappings in the appropriate portable layer. Preserve all original and user-authored trainer data; do not bundle or alter the external COBBLEVERSE trainer pack.

Keep field/resource IDs stable. Do not duplicate definitions between packs. When moving the authored Surge/gym override into the extension, preserve team configuration and NBT bytes; retire the superseded authored override zip during final installation so duplicate override packs cannot change loading precedence.

Preserve the effective combined catalog and mapping precedence. Do not depend on ZIP filename order or arbitrary resource iteration order. Demonstrate that base + extension resolve the same fields/layers/structures/trainers as the current installation across the established fixtures. Base alone must validate without references to missing third-party biomes, structures, tags or trainer APIs. The core may still expose all custom fields for explicit selection when their natural biome provider is absent.

Document the dependency relationship, supported installation combinations, pack ordering/enablement and removal behavior. Disable both the old monolithic field pack and the superseded authored gym override when replacing them; preserve unrelated Global Packs content and the user's world.

## Public release preparation — version 0.1

Prepare upload-ready artifacts and a clean public GitHub project after the four workstreams pass their checks. The public release number is **0.1**, with a proposed release tag `v0.1`. The previous `0.2.0` filenames describe the private development baseline; document this numbering reset as the first public release. Changing the displayed version must not rename registries, resources, payloads or saved items, or alter behavior.

### Upload packages

- Use `0.1` consistently in both mods' Fabric metadata, build version, compatibility dependency range, artifact filenames, changelog, release manifest and documentation. Keep Minecraft datapack `pack_format` appropriate for 1.21.1; it is not the project version.
- Produce the four exact jar/zip artifacts named above. Jar contents must contain only the required project code/resources/metadata; datapack archives must have `pack.mcmeta` and `data/` at their root, not nested under a project directory.
- Provide `SHA256SUMS`, a machine-readable release manifest, release notes, dependency/version tables and concise download/installation descriptions suitable for GitHub Releases and mod/datapack hosting pages. Do not invent account URLs, repository URLs or hosting project IDs.
- Offer a convenience release bundle containing the four artifacts and installation/readme/checksum files. Mark the compatibility mod and COBBLEVERSE extension as optional for the portable core configuration; explain precisely which integrations are absent without them.
- Build packages from an explicit allowlist or clean staging directory. Exclude source-game installations, external mod/dependency jars, cached Minecraft clients, world saves, profile files, logs, backups, credentials and test-only fixture mods.
- Verify archive structure, metadata versions, checksums, dependency declarations, duplicate resources and packaged-output test results. Reproduce a build from a fresh source export using documented prerequisites, rather than relying on untracked files from this computer.

### Clean public GitHub project

Inventory the existing `rejuvenation` folder and Git state before organizing it. Preserve the user's working source and recoverable baseline outside the public export. Cleanup must not destroy the local Rejuvenation reference installation, backups, audit history or saves merely because those files should not be uploaded.

Create a clearly organized public source tree containing both mod modules, editable datapack sources, the authoring kit, tests, required generators, build scripts and maintained documentation. Remove redundant/stale handoff documents from the public-facing documentation set or place a small, sanitized history in a clearly marked archive. Keep one authoritative explanation for each topic and update links after moves.

Provide a public README covering purpose, the 57-original/4-custom field scope, version 0.1, screenshots where appropriate, the two-mod/two-pack layout, supported versions, dependencies, installation combinations, migration from the private monolith, custom-field authoring, building/testing and honest known limitations. Add a changelog/release notes, contribution instructions and the project's selected license/third-party attribution material. Do not assign a new license to the user's original code without an existing license or their choice; identify an unresolved license choice in the handoff.

Replace machine-specific assumptions with documented configuration or command-line/environment inputs. Public build instructions must not require `C:\Users\Lenovo`, the Modrinth profile's absolute path or a private Downloads folder. Keep optional original-source comparison tooling usable with a user-supplied reference path, but make its private game files unnecessary for ordinary runtime use. Document external build dependencies rather than redistributing their jars.

Audit `.gitignore` and public archive contents. Exclude at least Gradle caches, compiled output, local dependency copies, integration game directories, full `Rejuvenation 14 copy` installations, research backups, local source-location configuration, profile/world data and raw gameplay logs. Preserve necessary canonical inputs, source provenance, test fixtures and sanitized summary evidence. Generated files should be included only when required or explicitly justified and reproducible.

Sanitize public documents, receipts, screenshots and manifests for usernames, absolute personal paths, account identifiers, world/player information and secrets. Replace references with relative paths or placeholders while retaining useful test scope, source/artifact hashes and accurate pass/fail/blocked status. Search both the staged public files and any Git history intended for upload; a clean current tree does not establish that older commits are safe. Prefer a fresh sanitized source export when existing private history contains material that should not be public. Do not rewrite the user's existing Git history or push it without a separate instruction.

Retain provenance and attribution for the Rejuvenation artwork and any other third-party material, and verify the redistribution status of the exact included assets. Attribution alone is not a substitute for establishing that the assets can be distributed. Do not include a complete reference game, source-script collection or third-party binaries in the public repository or release bundle. If distribution status is unresolved, identify the specific affected files and keep them out of the public-upload staging area while completing the unaffected work; do not silently replace the user's requested icons or claim the package is fully ready.

### Public-release acceptance

Deliver a clean, inspectable GitHub-ready source directory or `rejuvenation-fields-source-0.1.zip`, plus the four runtime artifacts and convenience bundle. Include a file inventory and a cleanup summary distinguishing retained public source, excluded private material, and relocated local material. Confirm there are no accidental private files or bundled dependencies, that all links/build instructions resolve in the public layout, and that the final packaged outputs retain the tested gameplay behavior.

Prepare the release completely for review, but **do not actually publish, push to GitHub, create a public repository, or upload to an external host as part of this brief**. Those actions require a later user instruction specifying the destination. Preparing local upload packages and cleaning/staging the public project are authorized now.

## Verification and release gates

Start from the current baseline receipts and actual tests. The last global-AI receipt records 121 permission checks, 40 mixin ABI checks, 18 installed Eelektross simulator checks, 42 Graal adapter checks and 55 Graal runtime assertions. The broad simulator run passed 630 cases; its separate original-Ruby comparison could not run because the installed Ruby executable failed to start. Older successful source-oracle receipts are historical evidence, not proof of a fresh run.

Address the Ruby/tooling limitation if practical, or record the exact environmental blockage. Never delete, weaken, silently skip or relabel a failed/unexecuted test to manufacture a green report. Run required checks against the packaged output as well as development classes.

Required release evidence:

- Specification traceability and offline battle results for all four custom fields, including counter timing, inherited rules and transaction rollback.
- Original-57 regression/source-definition comparison and existing parser/catalog/environment/structure/notes/packet/client-state suites.
- All 20 recipe input variants, negative recipe cases, registry IDs, icon pixel equality and model/resource integrity.
- Current trainer-permission/Mega regressions, including Surge, enabled/disabled members, unavailable/spent resources, active Dynamax, allied reservations, forced switches, no-field/evaluator fallback and Mega/Tera in both orders.
- Core alone; core + compatibility with third-party integrations absent; each relevant integration present independently; and the complete installed-profile combination. Include dedicated-server class-loading checks.
- Base datapack alone and base + COBBLEVERSE extension. Validate no duplicate IDs, missing providers or changed mapping precedence. Verify reload and battle snapshot behavior across these configurations.
- Differential checks between the current monolith and split combined setup on unchanged battle fixtures, selection fixtures, item behavior, preview payloads and resource consumption. Preserve intentional custom-field corrections separately from pure split equivalence.
- A bounded latency comparison using the existing strategy benchmark, with the same fixtures/runtime and reported machine conditions. New duplication or repeated catalog publication must not increase decision/startup cost unnoticed.
- Artifact contents/dependencies, optional-mod gates, no bundled third-party classes, matching source/artifact hashes, reproducible packaging and a documented rollback path.
- Public version 0.1 consistency; clean-source build reproducibility; archive-root checks; privacy/history review of the proposed public export; artwork provenance/distribution status; and the final upload-package inventory.

Use baseline-versus-candidate results and focused tests to investigate actual differences. Do not make unrelated performance or AI changes just to improve a benchmark.

## Deliverables

1. **Two built mod jars**: field core and compatibility, plus their complete source/build configuration.
2. **Two packaged field datapacks**: portable base and COBBLEVERSE extension, plus editable canonical sources/generators. The existing external COBBLEVERSE packs remain external.
3. **Custom-field authoring kit**: schema-valid canonical template, generated runtime example, example biome/structure mappings, and a tested `CUSTOM_FIELD_AUTHORING.md` guide.
4. **Five finished existing items**: original matching icons converted losslessly to valid PNG, updated models, requested recipes/ingredient definitions and provenance/visual comparison sheet.
5. **Custom-field validation report**: requirement-to-test matrix, source-spec hashes, offline battle scenarios/results, actual discrepancies and narrowly scoped fixes, plus explicit unavailable-content and execution limitations.
6. **Regression and compatibility report**: baseline/candidate results, installation matrix, trainer-policy regressions, packaged-artifact checks and latency comparison.
7. **Migration guide and manifest**: exact files to install/remove, required versions/dependencies, pack ordering, stable IDs, artifact SHA-256 hashes, known limitations and rollback steps. Update stale architecture/README/build documentation to reflect the split and current trainer overrides.
8. **Version 0.1 upload kit**: the four versioned artifacts, convenience bundle, `SHA256SUMS`, manifest, release notes and hosting-ready descriptions.
9. **Public GitHub source package**: cleaned project/source archive, maintained and sanitized documentation removing working documentation like coding agent briefs, ignore rules, license/attribution status, reproducible build instructions, file inventory and cleanup/privacy review summary.

Finish with a concise handoff identifying what changed, how it was validated, artifact locations and any remaining blockers. Build and verify the complete replacement package before changing the active profile. If installing into the existing profile, perform only the scoped replacement of authored artifacts after preserving backups; do not restart a running game or modify a save as part of an offline test. State clearly that loading new runtime jars requires a client/server restart.
