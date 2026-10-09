# Architecture

The Java mod owns Minecraft/Cobblemon integration; the datapack owns field content. An original JavaScript rule engine runs inside Cobblemon 1.7.3's existing shaded Graal Pokémon Showdown service. This is necessary because damage, accuracy, move execution, abilities, status and residuals are calculated in that simulator. Minecraft's post-battle events cannot implement those mechanics correctly.

## Modules and packs

Rejuvenation Fields is **two Fabric mods and two data packs**:

| Artifact | Contents |
|---|---|
| `rejuvenation-fields-<v>.jar` (mod id `rejuvenation_fields`) | The field system: engine, catalog loader and validators, field selection, evaluator and transactions, field panel, Field Notes, packets, held items, recipes, textures and the generic lifecycle hooks. Works alone. |
| `rejuvenation-fields-compat-<v>.jar` (mod id `rejuvenation_fields_compat`, requires the matching core) | Third-party integrations: the global NPC gimmick policy, Run & Bun and RCT scoring and declarations, Cobblemon Battle Extras previews and tooltips. Each integration is gated on its mod being installed. |
| `rejuvenation-fields-base-<v>.zip` | All 61 field definitions, notes, simulator items and abilities, and every mapping that vanilla Minecraft 1.21.1, Cobblemon and Fabric API support. |
| `rejuvenation-fields-cobbleverse-<v>.zip` | Mappings for other mods and backported content (Terralith, LumyMon, Legendary Monuments, Raid Dens, Cobblemon Additions, Repurposed Structures, VanillaBackport), the Kanto trainer-to-field bindings and the Lt. Surge gym override. Requires the base pack. Holds no Kanto teams. |
| `rejuvenation-fields-cobbleverse-classic-<v>.zip` / `rejuvenation-fields-cobbleverse-hardcore-<v>.zip` | The 13 Kanto league teams (`data/rctmod/trainers/kanto_*.json`), Classic (recommended, balanced) or Hardcore (the original override). Mutually exclusive: both define the same files, install one. Require the extension pack. |

The core never imports or names a compat, Run & Bun, RCT or Battle Extras class. It exposes small hooks instead: `ClientFieldState.onEvaluationsChanged` (a preview cache observer), `LogBounds.register` (where the battle log is), and the public `FieldApi`, `FieldEvaluator` and `FieldStateSync` surfaces that the compat mod consumes. The compat mod contains no second engine, catalog loader, item registry, panel or packet registration. See [MIGRATION.md](MIGRATION.md) for installation combinations and [BUILDING.md](BUILDING.md) for the Gradle layout (`core`, `compat`, `verification`).

## Build and compatibility

The profile is Minecraft 1.21.1, Fabric Loader 0.18.4, Fabric API 0.116.14+1.21.1 and Cobblemon 1.7.3+1.21.1. The Gradle project uses Java 21 and compiles against the exact installed jars (copied to `build/deps` by `research/prepare_build.py`, never redistributed). Minecraft symbols use intermediary names; Cobblemon classes are named. Mixins use `remap=false`. No installed jar or shipped Showdown script is edited.

## Battle lifecycle

1. Fabric registers the resource reload listener, six held items, two Showdown instruction parsers and two server-to-client payloads. Cobblemon's pre-start event captures a wild battle's environment on the server thread (see [FIELD_SELECTION.md](FIELD_SELECTION.md)).
2. A mixin at the tail of `GraalShowdownService.boot` evaluates the engine in the existing simulator context. The engine wraps selected simulator methods with guards that require per-battle custom state.
3. `SimulatorCatalog` publishes the latest validated catalog to Graal on the server thread when the server starts and after every datapack reload. Cobblemon calls `startBattle` on the server thread; its head injection only checks the revision (publishing there is a logged fallback), consumes pending field selections and adds a namespaced field and the battle ID to the battle's `>start` JSON. Unselected trainer/PvP battles receive no custom state. See [PERFORMANCE.md](PERFORMANCE.md).
4. The BattleStream start wrapper attaches the field before player initialization and initial switch-in effects. Party-role allocation occurs before Showdown's start and is driven by datapack role metadata.
5. A battle-local pseudo-weather condition supplies simulator hooks. Mutable state belongs to that battle: current field, stack, duration, temporary index, terrain overlay, five counters, cycling rolls, eruption, battle-wide Pledge/Conversion memory and one-shot survival state. Each battle retains its immutable catalog snapshot across reloads.
6. Changes emit the original flavor text through the ordered `rejuvenationmessage` instruction. Cobblemon dispatches this into `broadcastChatMessage`. `rejuvenationstate` publishes a JSON snapshot for `FieldApi.current`; `FieldStateSync` forwards it to the battle's players and spectators (`rejuvenation:field_state`) for the [field panel](FIELD_PANEL.md).
7. `GraalShowdownService.endBattle` ends the client panel, drops cached move evaluations and clears pending selections, environment capture and server snapshots. Showdown `Battle.destroy` releases custom simulator state. Both simultaneous battles and cleanup have simulator tests. Late queued state instructions cannot resurrect an ended battle entry.

## Simulator hooks

Executable rule events include activation, field residual, Pokémon residual, switch-in, base power, damage, received damage, accuracy, priority, move modification, after-move, attack, Special Attack, Defense, Special Defense, Speed, healing, status, volatile status, effectiveness, critical ratio, weight, charge timing, pre-move validation and weather change. The engine supplies additional mechanics for secondary attacking types, type-chart exceptions, terrain duration/overlays, Seeds, Nature Power, Secret Power, Camouflage, Mimicry and party roles.

Generic operators cover arithmetic, stat stages, statuses, healing, damage, abilities, types, volatiles, counters, field replacement/destruction/progression, temporary fields, weather, hazards, Trick Room, Wish, Perish Song, cyclic/random power and typed residual damage. Complex move behavior uses closed reusable recipes (`cureAndBoost`, `setTypes`, `appendHitActions`, `payHP`, `fixedDamage`, `targetWeightPower`, `boostOnly`, `shareHP`, `deductPP`, `arenaRoar`), not datapack scripts. A few shared environmental operations handle cave collapse, mist explosion, water pollution, ice spikes, steam accuracy and volcanic eruptions. These have narrow source-derived behavior and are reusable by data definitions.

Native terrain callbacks are guarded to avoid applying canonical terrain boosts a second time. Native Mimicry and Grassy Glide callbacks also have guarded replacements. Selected native ability callbacks can be suppressed by field data; this implements Frozen Dimension's Flash Fire/Magma Armor behavior while retaining ordinary battles' canonical behavior. Secondary types also invoke native absorbing abilities, with Mold Breaker/suppression guards.

## Datapack schema

The Minecraft pack format is 48. Custom resources are JSON under:

```text
data/<namespace>/rejuvenation/fields/<field>.json
data/<namespace>/rejuvenation/mappings/<mapping>.json
data/<namespace>/rejuvenation/items/<items>.json
data/<namespace>/rejuvenation/structures/<structures>.json
data/<namespace>/rejuvenation/notes/<field>.json
data/<namespace>/rejuvenation/abilities/<abilities>.json
data/<namespace>/rejuvenation/trainers/<trainers>.json
```

The field path and its `id` must agree. `schemaVersion` is 1. Core properties include `originalId`, `name`, `entryMessage`, `naturePower`, `secretPower`, `mimicry`, `moves`, `types`, `rules`, `seed`, `seedActions`, optional `overlay`, `progression`, `partyRoles`, `typeChart`, `suppressedAbilityCallbacks`, `healing`, `grounding`, `terrainPolicy`, `trapping`, `statPools`, `abilityAbsorptions`, `indirectImmunityAbilities`, `conditionDurations`, `volatilePolicies`, `expirationReturnMessage` and `multiplierPolicy`. Original UI status highlights and Burmy-cloak metadata are identified as metadata, not falsely treated as executable behavior.

Example rule:

```json
{
  "event": "priority",
  "condition": {"move": "quash"},
  "actions": [{"op": "add", "value": 1}],
  "source": "Battle_Move.rb:2303"
}
```

Conditions form a closed algebra: Boolean groups, move/type/category/flags, field and backup, groundedness, ability, held item, Pokémon type/species/form, status, weather, counters, HP, priority, opposing sides, missed moves, volatiles, effectiveness, active turns, overlays, state flags, side conditions and party roles. There is no Ruby `eval`, JavaScript content execution or arbitrary property traversal from data.

Core move entries express a power multiplier, accuracy override, additional attacking type, flavor message, counter increment, post-move actions and transition. Additional attacking types modify matchup/immunity; they are not substituted for a move's primary type. Rules separately express actual primary-type changes.

`typeChart` entries match an attacking/defending type pair and an optional condition. Results use an effectiveness exponent (-1, 0, 1) or `immune`. Matching overrides are applied in source order; type immunity and Ground airborne abilities are handled separately.

Mappings are ordered predicates over `biome`, `tag`, `dimension`, `submerged`, `maxY`, `skyVisible` and `minDepth`, with a `field` and readable reason. Rows with `"submerged": true` form the underwater stage, checked before structures; among the other rows the first match wins. Structure rows live under `data/<namespace>/rejuvenation/structures/` and name one structure ID or structure tag each. Mapping and structure documents may carry an integer `order` (default 0, lower first); all documents from all packs merge by `(order, resource ID)`, never by pack or listing order, and rows keep their order inside a document (`RuleDocuments`). The shipped documents use orders 100 to 500 (mappings) and 100 to 450 (structures) so that the base and COBBLEVERSE packs together resolve exactly like the former single file; see [BIOME_MAPPING.md](BIOME_MAPPING.md).

## Reload and validation

The synchronous server-data reload listener builds a complete new catalog, validates it, then publishes one revision atomically. Malformed data logs its error and rejects the reload while preserving the previous catalog. Active battles retain the previous frozen snapshot; new battles use the new revision. Unknown field references, duplicate JSON properties, invalid events/operators, unsafe move-property paths, invalid comparisons and malformed numerical content are rejected. Offline validators additionally resolve installed move/ability/item references and report unavailable IDs without silently aliasing typos.

Additional validation is still needed before this engine can be called a comprehensive field port. Passing schema/reference checks proves data validity, not the semantics of every rule. FIELD_COVERAGE.md and the source review ledger explicitly preserve that distinction.

## Resolution and integrations

Selection order is explicit battle override, trainer-defined selection, arena selection, then for wild battles the environment (underwater, configured structure, biome rows) and finally Indoor; see [FIELD_SELECTION.md](FIELD_SELECTION.md). Unconfigured trainer/PvP battles stay opt-in. Integrations call `FieldApi.select` before simulator startup; see TRAINER_INTEGRATION.md.

`RejuvenationEngine.evaluate(battleId, queries)` is a read-only evaluation layer over the live simulator battle: priority, effective type/category, failure, immunity/absorption, accuracy, critical ratio, damage rolls, status application, healing and Speed, each measured with and without the field inside a snapshot/restore transaction. `FieldEvaluator` is its server-side API (batched, cached per turn, server thread only). The Run & Bun AI adapter and the Battle Extras move preview (both in the compat mod) consume it; see [INTEGRATIONS.md](INTEGRATIONS.md).

Fields are transient battle state. They are not persisted into Pokémon save data or trainer/world configurations. A battle restart does not restore a mid-battle field stack. Runtime registry discovery writes an audit under `rejuvenation/research` in the game directory without modifying the registry or pack enablement.


## Layers, field notes and configured mechanics

- **Layers.** A biome row may name a `substrate`; `EnvironmentResolver` returns the field plus its layers, `ShowdownMixin` hands them to the simulator as `layers` in the battle's field options and `attach` builds the stack bottom first with `context` frames. Surface removal (`removesSurface` on a transition) exposes the frame beneath; frames are bounded (three), validated before any state exists, captured and restored by every evaluator transaction and included in the strategy and preview fingerprints. See [ENVIRONMENT_LAYERS.md](ENVIRONMENT_LAYERS.md).
- **Structure containment.** Structure rows carry a `containment` policy (`pieces` or a bounded `footprint`), applied by `StructureGeometry` to the piece boxes the probe reads from already-loaded chunks. The probe is pure over a small `WorldView` interface, so tests supply API-shaped layouts. See [FIELD_SELECTION.md](FIELD_SELECTION.md).
- **Configured mechanics.** Counters, per-side allowances and similar state are data: `field.mechanics.sculkWarning`, `creakingDistraction` and `bloodlust`, `typeComposition`, `accuracyCrash`, the `finalAccuracy` event and the `accuracyPenalty` op. They live in the battle-local `custom` state (reset when the visible field changes, restored by every transaction) and are validated by all three validators. Datapacks stay data only. See [CUSTOM_FIELDS.md](CUSTOM_FIELDS.md).
- **Field Notes.** `rejuvenation/notes/<field>.json` documents are validated with the catalog (`FieldNotes`), snapshotted per battle with the catalog revision, pushed by `FieldStateSync` with the state (`FieldPayloads.Notes`, per-recipient `viewer` and public counters, once per field and revision), cached on the client by `(field, revision)` and shown by `FieldNotesOverlay` (input and lifecycle, no Minecraft dependency) through `FieldNotesRenderer` and Fabric screen events. See [FIELD_NOTES.md](FIELD_NOTES.md).

## Contextual operators and clocks

Pledge and Conversion use `pairField` actions with named battle-wide memory, compatible move tokens, destination fields, exact first/combination/refresh text and durations. This memory persists across sides and turns, matching the local Ruby variables. Pledge fields last four turns, Conversion Glitch five; Amplifield Rock adds three. A temporary replacement restores its saved field when the clock expires. Forest/Bewitched Grassy Terrain moves last eight turns, while ability-created terrain lasts five unless the source holds Amplifield Rock. Everstone blocks move-created terrain and Conversion sequences.

`grounding` separates airborne abilities and forced-grounding held items. Rooting and Smack Down override levitation; Deep Earth exceptions can precede gravity/Iron Ball as in the local source. `gravityUsableMoves` allows Deep Earth's changed Magnet Rise to remain selectable under permanent gravity. `terrainPolicy` records blocked fields, original rejection text and move-specific durations.

`trapping` uses a divisor table and move increments, combining the captured Binding Band flag with the current field at each residual. Its optional stat-loss pools and Octolock amount are data. `conditionDurations` filters source moves and sets or extends native side/volatile clocks, preserving native initialization and expiry. ChargeMove rules reject charging to execute a move immediately, before a Power Herb is consumed. Pre-move rejection wraps native move preparation because Showdown otherwise prepares/charges before running global TryMove callbacks.

`statPools` selects the higher fully modified Special stat for offense/defense in Glitch. The native damage calculator retains critical rolls and subsequent damage arithmetic. Pool queries account for individual stages, items, abilities, Unaware and critical-stage bypass. Compound source-only Crest and custom-form cases still need additional integration and exhaustive comparison.

`abilityAbsorptions` changes native absorber results through guarded callbacks. Short Circuit shares its sequential roll with move power, and an Electric overlay selects the maximum result while advancing the roll normally. Native callbacks remain active in battles without this engine. `indirectImmunityAbilities` extends selected abilities' protection against non-move damage while preserving direct hit behavior.

`HeldItemBridge` rewrites only opted-in `>player` messages when a held Minecraft item lacks an installed simulator definition. Cobblemon's packed team layout puts Pokémon UUID at slot 2 and item at slot 6; it differs from upstream Showdown. The bridge preserves every other slot, trailing empty fields and unrelated Pokémon. Currently this connects the existing `cobblemon:everstone` without changing any original item resource.

The engine resource is loaded at class initialization because Cobblemon's worker can boot before this mod's Fabric initializer. Compilation uses the installed Gson 2.10.1 ABI. Testing a newer compile-time Gson would miss a real startup failure.

`overlayIn` dispatches current-field rules when an overlay is established or a Pokemon enters with one active. Source policies remove incompatible overlays when a hard field changes; hard-field clocks decrement even while their bound weather remains; overlay clocks run independently and pause only where the datapack requests it. Hard-field restoration resolves before overlay expiry in the same round. `volatilePolicies` supplies guarded Nightmare entry and residual behavior, including awake Infernal targets, Haunted damage and Rainbow suppression. Ordinary battles retain the native callbacks.

`multiplierPolicy` supplies the Casual and Field Frenzy arithmetic from Battle_Field.rb:1001-1012. The casual mode scales a multiplier toward one; Frenzy strengthens boosts and halves reductions. Zero stays zero. This applies individually to core move, type and overlay factors, including the combined minimum. Ability/stat factors are not accidentally rescaled. Opted-in PvP uses the source online exception. Default mode is standard; use `FieldApi.configure` before start to select mode 1 or Field Frenzy for a particular battle.

`conditionDurations.choices` evaluates ordered conditions before the default clock. Each choice provides a duration or an inclusive random range. Dimensional's 3–8-turn roll takes precedence over Amplifield Rock. Room and Gravity initialization evaluates working held items before a new Magic Room suppresses them; a scoped override is removed in `finally`, including failure paths. Native room toggling and expiry remain active. Magnet Rise reads the electric overlay as well as the hard field.

`sideCondition` applies a validated native side condition and optional duration to the selected battler's side. This lets Deux Finalis Lucky Chant create five-turn Mist without confusing side Mist with the terrain created by the Mist move. Move recipes can replace conditional power callbacks, remove forced switching or self drops, bypass Protect, and select a native secondary-type calculation. `firstTypeBonus` preserves Sky Flying Press's repeated first-defending-type check rather than silently correcting the shipped Ruby bug.

Power flavor is selected from the factors actually applied: move, then hard type or overlay type, then overlay move. Matching move-tag flavor takes precedence over ordinary type flavor. Unchanged or weather-suppressed factors emit no boost text. Generic flavor is emitted once per attack; move text containing a target placeholder is emitted once per affected target. These reviewed rules do not certify the sequence of every other source handler.

The `formChange` event runs only after a native form change succeeds and changes the species ID. Rules use canonical species identity plus `formName` to apply Aegislash's Chess/Fairy Tale stage changes. Repeated attacks while already in Blade form do not repeatedly boost stats. Source-only Crest illusions need separate inputs and are not covered by this standard form hook.

`setWeather` rules inspect `incomingWeather` before native weather starts. Their rejection text differs from `activate` rules that clear already-existing weather. `weatherConversions` maps Snow to Hail on Frozen Dimension before initialization. Weather duration rows filter both `sourceMoves` and optional `sourceAbilities`; extended fields use eight turns while native duration callbacks still handle weather rocks elsewhere.

`weatherFor` selects weather relative to a named battler, applying Mega Sol's sunny interpretation before ordinary weather suppression. Defensive stat rules refer to the attacker (`target` in a defensive event), as the original `pbWeather(attacker)` does. Ordinary environmental weather predicates continue to use `weather`. Mimicry replaces base typing while preserving separately added types and emits restoration text only when a type actually changes.

`sourceMove` distinguishes a called move from a selected move. `reapplyStatusHeal` revalidates immunity/SetStatus for a caller-dependent refresh without invoking native status Start again, preserving Nightmare and avoiding an unnecessary random sleep roll. Glitch uses it for Sleep Talk's Rest exception. `refreshVolatileBeforeHit` replaces the consecutive-use gate while retaining the native volatile; Haunted uses it for Destiny Bond.

`captureModifiers` supplies ball multipliers by Minecraft Poké Ball ID. `CaptureBridge` handles `POKEMON_CATCH_RATE` at LOWEST priority for an opted-in, active battle. It compensates for the native ball multiplier before that multiplier is applied, reproducing the source's floored catch-rate multiplication without stacking bonuses. Java keeps a separate immutable capture-rule snapshot for each battle; the ordered field-state message selects its current row, and ending the battle removes it. Unlisted balls/fields and out-of-battle captures retain native behavior. Independent `captureEnvironmentModifiers` add real-time night (20:00 through 03:59, evaluated per throw) and an immutable underwater environment snapshot. These predicates remain separate from the current field, including explicit field overrides; a matching field or environment sets one 3.5 multiplier without stacking. Java regression checks exercise the night boundaries, independence, snapshots and cleanup. Canonical capture calculations remain native.


## Distributed callbacks and form-check ordering

`abilityHandlers` contains a closed callback recipe with an ability ID, replace/append/prepend mode, condition, action list and source reference. Each battle resolves callbacks from its immutable field snapshot. The wrapper routes source/target arguments for contact, relay and global events; it delegates to the native ability when no applicable row exists. Stat boosts replace native boosts where the source does, while Costar and Gooey retain native behavior before field additions. Weather actions can run nested actions only after successful weather creation.

`pokemonEntry` runs the original form-check step only on an actual switch-in. `switchIn` is the existing field-entry event and also runs when the hard field changes. Keeping these separate prevents field transitions from rolling New World types or restoring held-item forms prematurely. The same form checks run at source end-round timing. `form`, `randomForm`, `itemForm` and `forcedType` preserve source form typing through a per-Pokémon species callback, while the native Type event still handles added types and Terastallization. No global species registry is rewritten.

`usableMove` checks the actual move slot and remaining PP, `pokemonActive` guards present attackers, and `statSumComparison` compares stage-adjusted raw stats across active foes/allies. `forEach` applies shared operators to foes, allies or other active Pokémon. Native ability/status/item protection remains in the underlying battle events.

## Persistent Petrification

The reusable persistent-status policy registers simulator `ptr` and Java `rejuvenation:petrified`. Native status/cure instructions own party state, client packets and persistence. Source Petrification permits ordinary movement, prevents healing except side Fairy Aura, always prevents Regenerator, damages by floor(maxHP/8), and implements Dark Aura drain/Aura Break order and rounding. Canonical status dispatch is retained. A cure instruction marked `rejuvenationsilent` suppresses only its generic chat message, allowing exact source cure flavor to appear once while native status updates still execute.

## Semantic review evidence

`research/semantic-reviews.json` holds explicit per-branch decisions, source-file and AST-body fingerprints, focused passing test names and narrow exclusions. `review_registry.py` rejects changed source or missing test receipts. Documentation generation merges these decisions without inferring review from a rule or imported field definition. The per-field ledger keeps implementation completion separate from full behavioral verification.

`pseudoWeatherStart` dispatches after a successful native room/Gravity condition starts. `changeField.durationFromCondition` reads the native clock, and `bindFieldClock` attaches declarative duration and permanence predicates. New World Gravity uses these to reform Starlight, restore when Gravity disappears, and cancel restoration after another hard transformation. Weather-created Crystal Cavern uses the same predicate mechanism. Expiry removes predicates so they cannot leak into another temporary field. Field counters reset on replacement/restoration; the source shared sequential roll index survives, while the current move's locked field roll is released.

`gatedStatChanges` separates the validity subject/stats from the affected target, preserving Parting Shot's shipped user-stage check. Ability `onBasePower` handlers replace a native multiplier through the same declarative actions, without stacking it. `randomMovePool.choices` provides a validated source-derived ordered pool of registered move IDs rather than relying on native calling flags.
