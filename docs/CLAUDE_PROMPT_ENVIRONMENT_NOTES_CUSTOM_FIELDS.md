# Continue Rejuvenation: environment layers, field notes, structures and four custom fields

Implement the work below in the existing project and deploy the verified outputs into the installed COBBLEVERSE profile. Continue from the filesystem; do not start over or create a parallel field framework.

## Workspace and authoritative inputs

Profile root:

`C:\Users\Lenovo\AppData\Roaming\ModrinthApp\profiles\COBBLEVERSE - Pokemon Adventure [Cobblemon]`

Project: `rejuvenation/` inside that profile. The live `mods/` and `datapacks/` folders are siblings of `rejuvenation/`.

Read these four user specifications in full, and implement their mechanics:

- `C:\Users\Lenovo\Downloads\Deep_Dark_Field.md`
- `C:\Users\Lenovo\Downloads\Pale_Garden_Field.md`
- `C:\Users\Lenovo\Downloads\Warped_Forest_Field.md`
- `C:\Users\Lenovo\Downloads\Crimson_Forest_Field.md`

Use these existing user-provided images for the corresponding battle-panel field backdrops/icons:

- `C:\Users\Lenovo\Downloads\deepdark.jpg`
- `C:\Users\Lenovo\Downloads\palegarden.jpg`
- `C:\Users\Lenovo\Downloads\warpedforest.jpg`
- `C:\Users\Lenovo\Downloads\crimsonforest.jpg`

Preserve the originals. Decode/convert and fit them to the existing panel asset format, keeping their recognizable content and avoiding distortion. Record their provenance as user-provided artwork; retain the existing 57 backdrop attributions. Do not generate substitute artwork.

Read applicable repository instructions and these current documents first:

- `rejuvenation/docs/INTEGRATIONS.md`
- `rejuvenation/docs/ARCHITECTURE.md`
- `rejuvenation/docs/FIELD_SELECTION.md`
- `rejuvenation/docs/FIELD_PANEL.md`
- `rejuvenation/docs/TESTING.md`

Repository code, installed APIs and current test receipts are authoritative. The last deployed baseline reported 57 fields, 564 passing simulator tests, 51 named AI/strategy tests, 933 client checks, 35 mixin ABI checks, 12 packet codec checks and zero pending ordinary AI leads. Re-establish the actual baseline rather than assuming those counts remain current.

The existing AI is a bounded field-aware integration into Run & Bun, not proven source-equivalent Rejuvenation play. Preserve that honest description.

## Architectural requirements

Keep one shared mechanics implementation:

`actual simulator + field handlers -> read-only evaluator -> Run & Bun strategy / Battle Extras previews`

Extend our mod where necessary, especially its bundled `rejuvenation-engine.js`, schema validators, synchronization and client UI. Keep field values, configurable move groups, mappings, messages and notes in datapack/resource data wherever practical. The result must work through the existing datapack loading and reload system. Do not evaluate arbitrary executable code from datapacks.

Do not modify or bundle external Cobblemon, Run & Bun, Battle Extras, Mega Showdown or ZA Mega jars. Preserve optional integrations, dedicated-server safety, multiplayer authority, request validation, complete evaluator rollback and decision-cache correctness.

Keep generated content reproducible. `build.ps1` invokes generation before validation, so changes made only to generated JSON will be overwritten. Add canonical custom-field inputs and generator support rather than patching generated outputs alone. Keep the original 57-field Ruby comparison/oracle scope distinct from the four new Minecraft-inspired fields.

## 1. Context-aware starting field layers

Implement environment-specific underlying fields where appropriate, so melting or removing the surface exposes the correct context.

Confirmed current gap:

- Frozen Ocean and Deep Frozen Ocean currently select Water Surface directly.
- Snowy Plains selects Icy without an underlying layer.
- Battle attachment initializes a one-entry stack: `stack: [{id: field}]`.
- Icy's Heat Wave transition normally selects Cave. Thus snowy plains can incorrectly become Cave after melting.
- The engine already supports stacks, field destruction, temporary fields and restoration during battle; reuse and extend them.

Required representative behavior:

| Environment | Initial visible field | Underlying field when ice/snow is removed |
|---|---|---|
| Frozen Ocean / Deep Frozen Ocean, surface battle | Icy | Water Surface |
| Frozen River, appropriate surface context | Icy | Water Surface |
| Snowy Plains | Icy | Grassy Terrain, the existing Plains allocation |

Audit the full installed biome mapping for analogous cases: snowy beaches, snowy forests/taigas, snowy mountains, and genuinely frozen underground environments. Choose their substrate from actual environmental context and existing allocations. Do not put Grassy Terrain beneath every icy field or invent a new Plains field. Document every layered mapping and cases intentionally left unlayered.

Requirements:

- Make layer configuration data-driven and validated; reject unknown fields, malformed stacks, cycles and excessive depth.
- Carry the resolved stack from environment selection into actual simulator initialization, not just UI metadata.
- Only the active field supplies its mechanics. Underlying layers are dormant; this is not simultaneous field stacking. Existing terrain overlays keep their existing semantics.
- Relevant melt/break/destruction paths must restore the configured substrate, including applicable fire moves, Scald and ice-breaking moves. Merely initializing a stack is insufficient if the transition still replaces it with Cave.
- Preserve original Rejuvenation behavior when no contextual substrate exists: an explicitly selected Icy field must not silently acquire an arbitrary Plains substrate, and original source-oracle fixtures must keep their expected transitions.
- Distinguish removing a surface layer from a genuine transformation into another field. Do not redirect every transition to the substrate.
- Preserve explicit/trainer/arena precedence and submerged Underwater selection. Do not attach a natural biome substrate to an explicit trainer field without an explicit rule.
- Define restoration of counters, durations, overlays and custom-field state consistently with the existing lifecycle; prevent state leaking between fields and duplicate entry/seed processing.
- Hypothetical evaluations must see the same stack and restoration as actual battles, and restore it completely afterward. Cache keys must include relevant layer state.
- Synchronize the visible field, notes and panel after restoration. Define reload behavior for existing battle catalog snapshots.

Use deterministic actual-move tests proving Frozen Ocean melts to Water Surface and Snowy Plains melts to Grassy Terrain, plus original Icy-without-substrate behavior, underground cases, underwater precedence, overlays, repeated transformations, doubles and rollback.

## 2. Clickable field notes overlay

The field panel above the battle log currently renders without input handling. Make clicking its field button/panel open an in-battle Field Notes overlay for the currently displayed field.

Requirements:

- Reuse existing panel placement, backdrop, styling and computed layout bounds. Do not redesign the battle UI unnecessarily.
- Provide accurate, readable, player-facing notes for all existing fields and all four new fields. Do not display raw JSON, Ruby fragments, internal op names or developer audit text.
- Explain type/move modifiers, additional typing, relevant abilities/items, standard field moves, transitions/restoration and special counters. Include conditional behavior and progression stages where relevant.
- Use data-backed notes with sensible sections, wrapping and scrolling. Make editable notes available through the resource/datapack path, with server-authoritative notes or a version-safe synchronization strategy when servers customize mechanics. Avoid unbounded packet sizes and arbitrary markup execution.
- While open, update to the current field after transformations, progression and restoration. Explain active overlay effects and substrate/restoration where relevant without conflating them with the active field.
- For Deep Dark and Pale Garden, show the applicable public counters and explain their thresholds and per-side rules. Do not expose hidden team information.
- Support a close button and Escape, small windows, different GUI scales, resizing and long notes.
- Consume clicks only in the intended panel/overlay bounds. Avoid activating moves or switches underneath the notes. Close cleanly on battle end, disconnect and screen changes.
- Keep battle/server processing and multiplayer timers running while notes are open.
- Work with Battle Extras present or absent, enhanced/classic/native battle logs, and spectating where supported.
- Provide safe unknown-field/missing-note fallbacks and preserve reconnect/resync behavior.

Test content selection, input routing, close behavior, scrolling/layout and field changes primarily through fixtures. A single batched rendered-client check is justified only for aspects that cannot be certified without rendering.

## 3. Fix structure-based field selection

The user observes battles inside villages still selecting Forest/Grassy Terrain. Existing village mapping rows are already present. Diagnose and fix the real capture/detection/selection path, rather than adding duplicate rows and declaring completion.

Relevant code:

- `EnvironmentProbe.java`: captures anchor/player positions and currently uses generated structure piece containment.
- `EnvironmentResolver.java`: pure indexed resolution.
- `FieldApi.java` and `mixin/ShowdownMixin.java`: actual battle selection/startup bridge.
- `datapack/data/rejuvenation/rejuvenation/structures/vanilla.json`: existing mansion and village mappings.

Required mappings:

- All vanilla village variants and installed modded village variants: **City**.
- Bastion Remnants and appropriate installed bastion variants: **Colosseum**.
- Nether Fortresses and appropriate installed fortress variants: **Colosseum**.
- Ancient Cities: **Deep Dark**.

Use actual installed structure IDs/tags; vanilla IDs include `minecraft:bastion_remnant`, `minecraft:fortress`, and `minecraft:ancient_city`. Discover modded variants rather than guessing IDs. Preserve existing mansion -> Back Alley behavior.

Inspect the Minecraft 1.21.1 API and confirm the meaning of the current mapped accessors. Trace registered IDs/tags, chunk references, valid structure starts, actor/participant anchors, containment, catalog reload caches and the final simulator-selected field. Check whether the reported village failure occurs in open spaces between pieces or through another missing step.

For generated villages, recognize normal village streets, plazas and spaces between buildings within a defensible village footprint, not only the exact blocks of a building piece. Choose and document a structure-aware horizontal/vertical containment policy that avoids classifying unrelated underground caves or arbitrary surrounding chunks as City. Do not use a broad unbounded radius, nearby village blocks or merely the presence of a chunk reference as proof of containment.

Preserve the current precedence: explicit/trainer/arena > genuinely submerged Underwater > configured structures > biome/depth rows > fallback. Keep existing trainer/PvP opt-in behavior unless an existing explicit setting enables natural fields; do not override configured trainer fields to force the surrounding structure.

Keep selection deterministic when participants or mapped structures overlap. Avoid world-wide scans, forced chunk generation or registry enumeration per battle. Invalidate caches safely by world/registry/catalog revision. Add bounded debug evidence for why a field was selected.

Tests must exercise realistic capture/accessor/startup fixtures as well as the pure resolver. Synthetic `StructureHit` objects alone do not demonstrate that the in-world bug is fixed. Cover village buildings and gaps, boundaries, outside positions, vertical cases, modded tags, bastions, fortresses, Ancient Cities, anchors, underwater precedence, explicit overrides and reloads.

## 4. Implement the four custom fields

Register distinct fields:

- `rejuvenation:deep_dark`
- `rejuvenation:pale_garden`
- `rejuvenation:warped_forest`
- `rejuvenation:crimson_forest`

Replace the corresponding biome allocations with these fields:

| Biome | New field |
|---|---|
| `minecraft:deep_dark` | Deep Dark |
| `minecraft:pale_garden` | Pale Garden |
| `minecraft:warped_forest` | Warped Forest |
| `minecraft:crimson_forest` | Crimson Forest |

Check actual runtime biome availability on this 1.21.1 profile, including backports/replacers. A configured Pale Garden ID may differ from a runtime ID. Map actual equivalents where present; if none exists, still implement an assignable field and the configured mapping, report its runtime availability accurately, and do not fabricate successful natural-biome coverage.

Read the supplied documents completely; this prompt supplements them rather than replacing their detailed move lists, messages and ability rules. Resolve these important details as follows.

### Deep Dark

- Shared battlefield Warning 0–4; initial 0. One actual warning mutation per side per turn, increases and calming sharing the allowance. Switching/fainting must not reset it.
- Clamped no-op changes do not consume the side allowance. Reset turn allowances at the real turn boundary, including entry/seed timing.
- Exclusive classification: calming/Flash, explicit override, sound flag, seismic/explosive list, then generic resolved Base Power thresholds. Never add categories together.
- Use native resolved power before field/STAB/item/ability damage amplification. Handle dynamic moves through simulator facilities, not copied formulas. Define target-dependent spread/multihit power classification consistently and test it.
- Actual execution may cause warning despite Protect, immunity or absorption; prevention before execution does not. Define misses, charging actions and called moves explicitly. Spread/multihit actions must not multiply mutations.
- Announce each crossed milestone in sequence. Darkness at Warning >=3 is a multiplicative 0.9 accuracy modifier with the specified ability exemptions, not a stat-stage drop.
- Rattled activates on a genuine below-3 to >=3 crossing, including a jump to 4, and may activate again after the counter falls below 3.
- At 4, schedule retaliation after the triggering action resolves: 20% maximum HP to every active non-immune Pokemon, native rounding, potentially fatal, direct environmental loss bypassing Substitute/Protect/guards and the move-damage/Counter pipeline. Resolve faint/victory and pivot timing consistently; avoid prematurely ending a battle before queued retaliation.
- Immunities are the specified Soundproof, Punk Rock, Solid Rock and current Ghost typing. Immunity never suppresses warning generation. Respect actual effective ability/type and gimmick state.
- Retaliate at most once per turn, reset Warning to 1 afterward, and end Darkness without duplicate reset/milestone messages. Define the next valid processing point if Warning is capped at 4 after that turn's retaliation.
- Magical Seed gives Soundproof before attempting +1 Warning and shares the side allowance. Use existing seed ability replacement semantics; it replaces Nidoking's original ability rather than silently providing two abilities. Restore/switch behavior follows the existing battle-local ability lifecycle.
- Boomburst is 140 BP in the installed simulator, but still gets +2 through its sound classification.

### Pale Garden

- Preserve the actual implemented Bewitched Woods baseline except explicit overrides. Audit inherited rules, transitions and original-ID-dependent engine branches; copying a JSON file under a new ID does not automatically preserve all semantics. Do not accidentally transplant an inappropriate hardcoded destination or overwrite parent behavior.
- Each side has independent Creaking Distraction 0–3. A damaging execution adds one tick, at most one damaging tick per side per turn. A status execution resets that side's counter fully.
- This differs from Deep Dark: status resetting is not forbidden merely because the side already gained its damaging tick. A status reset must not refresh an already-used damaging-tick allowance. Test both action orders in doubles.
- At 3, apply 40% max-HP environmental loss to active Pokemon on that side, then reset its counter to 0 with the supplied text. Use the consistent environmental damage/faint pipeline and define any unspecified timing/immunity behavior explicitly.
- **Seed conflict resolution:** the document first lists the Bewitched Woods default seed, but ends with an explicit override. The final override wins: Magical Seed gives **Defense +6 and applies petrification to the user**. Do not also grant Special Defense +1 or Ingrain. Use the existing petrification implementation, ordinary stat-stage handling/caps and status legality.

### Warped Forest

- Implement the specified selective Forest/Dimensional/Wasteland/Volcanic fusion, not every rule from all four parents.
- Preserve primary move typing; Grass attacks gain Dark additional typing for effectiveness. Forest cutting moves that acquire Grass must also obtain the specified Dark component. Support deduplication and bounded composition without recursive loops or invented extra STAB.
- Include the specified field/ability effects, Leech Seed fraction, move-specific power and accuracy, room durations and seed effects.
- Weather fails while the field is active: handle attempted weather creation and existing weather on entry consistently. Freezing prevention and Snow clearing must agree with that policy.
- Reuse the existing multiplier conventions for overlapping move/type bonuses; document resulting representative multipliers rather than accidentally applying a bonus twice.

### Crimson Forest

- Implement the specified selective parent effects, additional Poison typing for special Flying moves, Grass typing on Forest cutters, and Fire additional typing on Power Whip/Vine Whip.
- Piglin Bloodlust gives the direct attacker Attack +1 after an opposing KO, stacking legally with Moxie. Prevent residual/environmental/ally KOs or duplicate faint callbacks from awarding it incorrectly. Define multi-target KO behavior and test it.
- Good as Gold entry gains the specified Speed and Special Attack boosts through normal entry/boost handling.
- Positive-priority damaging moves receive the specified 0.8 final accuracy modifier, using actual effective priority. Inherently accuracy-bypassing moves remain exempt.
- Crash damage occurs only when the field penalty is what caused the miss. Use the same native accuracy roll/counterfactual threshold; do not crash on every ordinary miss, immunity, Protect or failed execution. Reuse native High Jump Kick-style crash semantics and avoid duplicate crash on moves that already have it. Include modified priority, accuracy stages, field abilities and AI accuracy branches.
- Implement all named move, poison, heat, ability and seed effects. Preserve their ordinary conditions and installed support; document an unavailable effect rather than silently omitting it.

For all four, use local Rejuvenation source/current mechanics as the reference for inherited behavior. Provided custom specifications control their overrides. If a substantive ambiguity cannot be resolved from these instructions, ask a targeted question while continuing independent work; do not invent a balance change or claim unfinished behavior is complete.

## 5. Run & Bun, gimmicks, previews and synchronization

These additions must be integrated into the surrounding battle systems, not merely produce legal simulator moves.

- Feed actual layered restoration and new-field consequences through the shared evaluator. Extend strategy valuation where short lookahead misses counter proximity, future retaliation, calming, reset moves or a team's ability to exploit immunity.
- Demonstrate decisions that preserve an advantageous substrate, melt an opponent-favored field, calm Deep Dark, safely weaponize retaliation, reset Pale Garden distraction, account for Crimson crash risk and switch into field-favored reserves.
- Consider remaining allied/opposing teams, entry seeds, status/setup, move order and available doubles information. State bounded opponent/joint-action assumptions honestly.
- Evaluate Mega/Z/Max/G-Max/Ultra/Tera under the new fields. Include Ghost Tera granting or removing retaliation immunity, ability-changing forms, sound/Z/Max classification, seed replacement, altered move power, weather/terrain and current Dynamax HP.
- Hypothetical state includes layer frames, both sides' counters/allowances, retaliation flags, field-specific temporary state and notes-visible counters. Verify full rollback and correct cache invalidation across all of them. No query may mutate the real battle.
- Battle Extras displayed damage, accuracy, typing, effectiveness and hit counts must match the actual simulator under new fields and restored substrates. Retaliation/environmental HP loss must not be mislabeled as direct move damage or silently included in a current-hit KO label. Preserve omission of uncertifiable random/ambiguous values.
- Synchronize counters, visible field and notes independently of whether move previews are enabled. Cover decision serials, stale packets, spectator updates and reconnects without introducing client authority.

Profile current decision times before/after on comparable hardware/affinity. The previous baseline was roughly 0.48 s for 1v1, 0.69–0.78 s for 6v6 singles and 2.7 s worst-case doubles on performance cores. Do not expand this task into an AI rewrite, remove important branches silently, or accept substantial new stalls without investigation. Cache immutable per-decision results safely.

## 6. Verification, generation, packaging and deployment

Prefer existing simulator tests, deterministic evaluator/AI harnesses, Java/client fixtures, Graal, parser/registry/mixin checks and isolated integration over launching Minecraft.

Run the complete relevant `rejuvenation/build.ps1` pipeline after implementation. It must regenerate custom fields, mappings, notes and image assets safely; validate schemas and references; preserve original source comparisons and Ruby mechanic/AI oracles; run simulator, AI, preview differential, client/panel/input, structure-capture, packet, ABI and Graal checks; build; regenerate reports; and package.

Use `-AffinityMask 0xFFF` only when appropriate to this machine, and record affinity/runtime alongside performance receipts. Keep test-only profile libraries out of shipped jars.

Update hardcoded 57-field assumptions in tests, packaging, docs and asset manifests correctly: retain **57 original Rejuvenation fields**, add **4 custom fields**, and certify **61 total** plus their notes and panel assets. Do not pretend custom fields have a Ruby source oracle or change the original baseline to hide regressions. All five supported gimmick families need representative new-field simulator differential fixtures.

Required new verification includes:

- Initial contextual stacks and actual melt/break restoration.
- Structure capture through real API-shaped fixtures into simulator startup, including village gaps and all required structures.
- Notes content/input/layout/lifecycle and optional Battle Extras behavior.
- Deep Dark boundaries, exclusive sources, resolved power, no-op allowance, both sides/doubles, seeds, crossing text, Rattled, Darkness, retaliation and immunity.
- Pale Garden damaging/status ordering, per-side independence, environmental loss and final seed override.
- Warped composed typing, abilities, rooms, weather and draining.
- Crimson final priority, causally attributable misses, crash rules, direct KO rewards and entry effects.
- All 61 field attachment/destruction under Graal and evaluator isolation with the new state.
- Representative field/gimmick preview-versus-actual outcomes and strategic choices.
- Fresh, engine/data-fingerprinted receipts and no external dependency redistribution.

Avoid full-client launches for logic already covered by fixtures. If actual rendered notes/input or generated-structure behavior cannot reasonably be certified otherwise, batch necessary checks into one minimal client session and report exactly why. Exhaustive two-client QA is not required on every change; do not present offline fixtures as rendered/multiplayer certification.

After successful verification, rebuild distributables and deploy only the authored Rejuvenation jar/datapack (and any intentionally required resource artifact) into this profile's live `mods/` and `datapacks/` locations. Hash-check the installed files against packaged outputs and write an updated deployment receipt. Account for the profile's actual datapack enablement path.

Preserve all unrelated profile content, user changes, disabled mods and saves. Record protected-content changes relative to the current baseline; do not restore or delete the three previously reported missing disabled mods as part of this work. Do not commit unless asked.

## Completion report

Finish the implementation, tests, packaging and authorized deployment; do not stop at a plan or at data-only stubs.

Report:

1. Current baseline and final counts, distinguishing the original 57 fields from the four customs.
2. Contextual layer table and actual restoration cases, with unlayered reasons.
3. Root cause and fix for village selection, required structure mappings and containment policy.
4. Notes architecture/content coverage, input/lifecycle results and custom image paths.
5. Each custom field's requirement-to-implementation/test matrix, seed conflict resolution, inherited behavior and any exact limitations.
6. Run & Bun strategic and gimmick decisions demonstrated, preview differentials, rollback/caching and performance comparisons.
7. Original oracle/comparison results, simulator/Java/Graal/ABI/packet/build receipts and whether any Minecraft launch was necessary.
8. Built and installed artifacts, absolute paths, complete hashes and deployment/enablement verification.
9. Any remaining live-QA boundary or genuinely unsupported mechanic, with evidence rather than blanket completion claims.
