# Field-aware battle integrations

Run & Bun and Battle Extras use the same read-only simulator evaluator. Damage, abilities, items, effective types, categories and stats, accuracy, priority, critical policy, absorption, status, healing and field transitions all come from the installed simulator plus the shared field handlers. Transactions restore complete battle state: RNG, side conditions, logs, forms, entry effects, gimmick resources and action queues. Neither adapter contains a field damage formula of its own. External mod jars are compile-only dependencies, never changed or bundled.

This is a field-aware integration with Run & Bun's AI, not a reimplementation of Rejuvenation's `Battle_AI.rb`. Its strategy is a bounded heuristic, not exhaustive search, and not a claim of source-equivalent play.

## Run & Bun

Installed target: `rbrctai-fabric-1.21.1-0.16.0-beta.jar` (`RunBunAI.choose`, `MoveEvaluation`, `PokeMathMax`).

- **Decision path.** Optional decision, damage, immunity and Speed mixins keep Run & Bun's native move-family scores. The adapter then compares the legal move, switch and gimmick candidates through `RejuvenationEngine.strategy`.
- **Request handling.** Forced-switch requests with null movesets are supported. Native resource and switch flags are reconciled with the chosen response. The native `MoveEvaluation` of the selected move is kept rather than rebuilt for a gimmick variant.

**Lookahead.** Each candidate is rolled out through the simulator's real turn:

- native action ordering, including conditional attacks and field-created priority;
- faints, forced switches and pivots;
- Update, residuals and end-of-turn replacements;
- the next-turn boundary.

Native victory checks stop a winning rollout before residual damage. Chance is handled deterministically:

- Accuracy and the deciding move's secondary chance branch, weighted by the simulator's own modified chances.
- Every other chance event takes its median outcome.

**Opponent replies.** A bounded opponent policy per decision tries the opponent's useful setup, status and speed-control moves through the real move pipeline, plus protection and its best reserve switch. Full reply branches go to:

- the two strongest contenders;
- the native choice;
- explicit utility counters (Taunt, Encore, Disable, Haze...);
- phazing moves;
- candidates that change the field or overlay.

Every other candidate is charged a bounded risk term: 0.35 × the measured value of the opponent's best utility reply. `screen:false` branches every candidate.

**Future value** covers:

- both remaining teams;
- source field affinity and disruption;
- field transitions, overlays, progression, duration and restoration;
- measured reserve entry;
- actual hazards and available phazing;
- weather, terrain and rooms;
- setup, status, recovery, traps and protection;
- delayed attacks (Wish, Future Sight), charge and recharge turns;
- critical stages, field Speed and turn order, and forms.

Duration value is signed by the measured future matchup. Source move preferences are bounded so they can never discard a winning KO. A main-field change is rated by the generated source disruption rule; reserve affinity stays a separate term to avoid double counting.

Reserve weather, terrain and room utility is measured once per distinct resulting context. Each side's two likeliest entrants (by the same switch-in preference used for switch screening and pivots) enter through the real switch-in pipeline. They enter at the decision state, once in the old context and once with the new weather, terrain and rooms transplanted. This keeps the term independent of a rollout's incidental damage.

### AI source review

All 762 `Battle_AI.rb` field leads carry an individual, source-fingerprinted review with semantics, rationale and passing test evidence (`research/ai-review-decisions.json`, `research/ai-coverage.json`). Ordinary applicable strategy pending: **0**; open strategy gaps: **0**.

| Final disposition | Source leads |
|---|---:|
| `ai_rollout_consequence` | 318 |
| `ai_mechanic_measured` | 313 |
| `ai_source_weights_ported` | 72 |
| `implemented_strategy` | 53 |
| `excluded_custom_move` | 3 |
| `unreachable_in_build` | 3 |

What backs those dispositions:

- **Prediction audit:** 334 prediction-versus-mechanic rows. 314 match; 18 are AI expectations that differ from Rejuvenation's own mechanics, where the engine follows the mechanics; 1 is unreachable and 1 unavailable.
- **Project decision preserved:** the Holy field Salt Cure divisor (the source's pre-Champions 1/6, 1/3 for Water or Steel).
- **Generated source ports:** the BESTSKILL switch affinity and `getFieldDisruptScore` tables, checked by a Ruby differential.
- **Ruby differential:** 10,000 disruption and 6,000 affinity cases, 0 unexpected differences.
- **Intentional correction:** the dead `PERSIHBODY` (Perish Body) typo in the source.

Exclusions, each with a stated reason:

- **3 unavailable custom-move leads** (Magma Drift, Fever Pitch, Aquabatics). These moves are absent from the installed registry.
- **3 unreachable leads.** One is guarded by the `Reborn` constant; the others need the Neved jurisdiction story system or in-battle trainer bag items, neither of which exists in Cobblemon.

The Shadow Sky lead is **not** excluded. The move is absent, but this mod's registered Tempest ability creates the weather, and the rollout prices its residual damage (two named tests).

Intentional departures from the source AI, all measured by the simulator:

- Use the actual mechanic where a Ruby AI prediction is stale.
- Consider the opposing reserves as well as the AI's own party.
- Keep winning attacks over the source's zero multipliers.
- Simulate real delayed healing and damage, switch entry and field-created immunity.
- Compare every legal gimmick on one consequence scale, with a reserve opportunity cost.

## Installed gimmicks

Mega Showdown 1.8.4 supplies the battle integration for Mega, Z, Ultra Burst, Dynamax/Gigantamax and Terastallization; ZA Mega 1.7.3 adds forms and abilities such as Mega Sol. Availability comes from the sanitized `ShowdownMoveset` (`canMegaEvo`, `canUltraBurst`, `canZMove`, `canDynamax`/`maxMoves`, `canTerastallize`) and `MoveActionResponse.isValid`; activation uses its native `gimmickID`.

| Gimmick | Evaluator/API path | Strategy and field interactions |
|---|---|---|
| Mega | `BattleActions.runMegaEvo`, Mega Showdown `MegaGimmick` | Resulting stats, typing, ability, Speed, damage and survival; delay versus reserve or normal value; field-modified form |
| Z | `getZMove` and native Z conversion/status effects | Complete hit range, accuracy, protection, status bonuses, KO and once-per-side timing; the converted move's actual field effects |
| Dynamax/Gigantamax | native `runDynamax`, `getMaxMove`/`getActiveMaxMove`, Mega Showdown `MaxGimmick` | HP, remaining turns, Max/G-Max power and secondaries, protection, weather/terrain/stat consequences, field transitions, reserve value |
| Ultra Burst | `canUltraBurst` + `runMegaEvo` selecting Ultra, Mega Showdown `UltraGimmick` | Actual form, stats, typing, ability, Speed and field matchup; later Z availability where legal |
| Tera | `BattleActions.terastallize` | STAB, defensive typing and immunities, coverage, Tera Blast, incoming attacks, field abilities |

There is no fixed gimmick priority: every legal normal, Mega, Ultra, Z, Max and Tera path competes on the same scale. Rules follow the installed simulator, not cartridge assumptions:

- **Per action:** the installed response allows one activation per action, and combinations across turns follow native legality.
- **Per side:** Z and Tera are side-wide; there is one simulator Mega and one Ultra per side; Dynamax resources are per allied side.
- **Exclusions:** Dynamax removes that Pokémon's Tera.
- **Config scope:** Mega Showdown's `multipleMegas` setting controls out-of-battle Mega ownership only.
- **Power spots:** availability arrives through the sanitized request.

Screening keeps the best two Mega, Ultra and Tera moves (measured under the gimmick) and the best two switches. In doubles it also keeps the best measured target per move and gimmick, with an ally hit counting against it. Normal, Z and Max paths, the native choice and distinct field transitions are always rolled out.

Graal fixtures run production Java candidate scoring on actual Volcanic-field simulations. For each of the five resources they check that it is preserved for a safe normal KO and used when the transformation produces a worthwhile one. JS fixtures cover resource consumption and restoration, G-Max conversion, Max terrain, Tera defence, conditional attacks and cross-turn restrictions.

## Battle Extras 1.13.45

Audited display paths:

- active move-tile range, KO label and hit count;
- the selected gimmick variant;
- the switch-screen row for a benched Pokémon;
- tooltip effectiveness, type, category, accuracy and field facts;
- cache invalidation.

Displayed ranges replace the native base-stat estimate with complete-hit server measurements by the real move pipeline. That pipeline includes forms, stat substitutions, abilities, items, screens and protection, weather, overlays and counters, fixed-roll fields and target Dynamax HP. Bench rows actually switch the Pokémon in (entry effects included) and roll back.

**Requests.** Active evaluations are sent eagerly; gimmick and bench queries are lazy, batched and deduplicated.

- **Validation:** the server checks ownership, known moves, opposing active targets, sanitized gimmick availability, battle ID, turn and a decision serial.
- **Bounds:** at most 24 queries per request and 160 per turn.
- **Hidden rows:** pending or ambiguous doubles rows are omitted until authoritative data exists.
- **Battles without a field** keep Battle Extras' own behaviour.

**Effectiveness label.** While Battle Extras builds the hovered move's tooltip, its client type chart returns the simulator's measured effectiveness:

- 0 when the field or an ability blocks the move;
- otherwise 2^typeMod, including field charts and added types.

Its "Immune / Not very / Super effective" label and its decision to request a damage range follow that value. On Cave, Earthquake against a Flying type is no longer labelled immune with no range. If no single certified value exists (pending, a random type, or doubles targets that disagree), the effectiveness label is removed rather than left showing the native chart.

**Display limits**, all tested against the simulator's actual outcomes:

- **Chance critical hits** are excluded from ranges, as Battle Extras does; guaranteed and stage-4 critical hits are included.
- **Hit counts** are exact bounds from the simulator's own draws: the 2–5 distribution, Skill Link, Loaded Dice, and multi-accuracy moves such as Triple Axel and Population Bomb, which can stop after the first hit.
- **Field random power** (Big Top) uses its lowest and highest field outcome.
- **Random field types** (for example Rainbow special Normal moves): no range, ratio, effectiveness or immunity is shown or sent.
- **Native random power or damage** (Magnitude, Psywave, Present, called moves such as Metronome, random doubles targets, a contact ability triggering between hits): the range is not shown. Any random draw before or during a damage calculation would make it one sample rather than a bound. Draws that only choose a secondary effect (Secret Power) or have a single outcome keep their range.
- **Accuracy** is displayed separately from conditional hit damage.
- **KO labels** describe the current hit only, not later recovery or residual damage.

**ABI verification.** The installed Battle Extras methods that these hooks target were certified by bytecode against exact descriptors, provider registration, call sites and mixin application order:

- `calculateAdjustedAccuracy` and `renderTooltipAtPosition`, which Battle Extras adds to Cobblemon's move tile;
- its `TypeChart` effectiveness methods.

All 35 injector/shadow ABI checks pass. This certifies bytecode compatibility, not a full rendered-client run.

## Panel and multiplayer boundary

The existing 57 attributed backdrops and the panel layout are unchanged.

- **Lifecycle:** isolated client checks cover entry, replacement, overlay expiry and restoration, destruction, progression, clocks, battle end, late messages and decision invalidation.
- **Layout:** geometry fixtures cover GUI scales, resizing and enhanced, classic and native log bounds.
- **Optional mods:** the core panel does not depend on Battle Extras, and the optional mixin gates are tested with each mod present and absent. Packaging rejects client references in common code.
- **Resync:** every choice request resynchronizes the field panel for participants and reconnecting players, whether or not move previews are enabled.
- **Spectators:** they receive the state at the next field update or choice resync. There is no immediate spectator-join hook, because Cobblemon exposes none.

Full two-client disconnect/rejoin and rendered HUD checks remain separate QA. This continuation required **zero Minecraft launches**.

## Current verification

- **Simulator:** **564/564** passing, including **51 named AI/strategy tests** plus the source prediction and oracle matrices.
- **Java:**
  - **933** client/preview/panel checks;
  - **26,948** environment checks;
  - **12** request-legality, **6** decision-identity and **12** optional-mod checks;
  - **12** checks of the installed packet codecs, run offline on the Minecraft 1.21.1 profile's own libraries;
  - **35** mixin ABI checks.
- **Graal:** all **57** fields, **42** runtime assertions and **42** adapter checks on real evaluations; declared abilities restore and the three-dex guard passes.
- **Definitions and Ruby oracle:**
  - definitions: **4,494** properties, zero differences;
  - Ruby mechanic oracle: **171,396** defense and **120** difficulty contexts, zero differences.
- **Build and packaging:** Gradle builds the runtime jar and the isolated integration fixture offline. Packaging verifies the current engine and resources and redistributes no dependency.

Mechanics corrected in this continuation:

- The field-change ×1.3 damage boost (`Battle_Field.rb:568`) is evaluated for the measured hit itself. Previously Icy Dive read the previous action's connect/miss flags.
- Preview hit-count bounds now come from the simulator's real Gen 5+ draw.

## Decision performance

The receipt measures complete synchronous decisions in Cobblemon's shaded, interpreter-only Graal runtime: three single-battle states and a production-shaped worst-case doubles lead, with 5 warm repetitions.

- **Cold column:** first decision after the publication warm-up, as in production.
- **Publication warm-up:** catalog publication now runs a throwaway decision and preview (1177 ms in this receipt), so the first AI decision of a server no longer pays roughly 3 s of interpreter warm-up.
- **Pinning:** The receipt was taken with processor affinity `0xFFF` (performance cores of this hybrid CPU) at high priority.

| Decision | Candidates / screened | Rollouts | Cold ms | Warm median ms | Warm max ms |
|---|---:|---:|---:|---:|---:|
| 1 fresh | 8 / 2 | 8 | 591 | 479 | 588 |
| 6 fresh | 13 / 5 | 10 | 771 | 736 | 872 |
| 6 turn 1 | 13 / 5 | 10 | 702 | 687 | 868 |
| 6 turn 2 | 13 / 5 | 10 | 834 | 762 | 987 |
| 6 turn 3 | 13 / 5 | 10 | 906 | 776 | 823 |
| 6v6 doubles fresh | 24 / 16 | 17 | 2941 | 2730 | 2841 |

The singles optimizations are exact: candidate scores are bit-identical to the engine before them on 315 candidate rows across five fields, including history-reading moves. They include:

- canonical per-turn counters in the matchup, unless a handler in play reads them (Rage Fist, Fake Out, Stomping Tantrum...);
- a cache key without per-action transient state;
- shared digests;
- an immutable team kept out of snapshots;
- narrower snapshots for measurements;
- removal of the dead reply measurement;
- a facts-only measurement mode.

The doubles reductions (target screening, reserve-context bounding) are documented heuristics. **Remaining limitation:** a worst-case doubles lead with every gimmick variant still takes seconds per decision in the interpreter-only runtime. Ordinary singles decisions take a fraction of a second on performance cores.

Receipts:

- `research/ai-coverage.json` and `ai-review-decisions.json`;
- in `test-results/`: `simulator.json`, `ai-prediction-audit.json`, `ai-source-oracle.json`, `java-verification.json`, `mixin-abi.json`, `graal-performance.json`, `strategy-benchmark.json`, `build.log`.

The simulator, Java, Graal and benchmark receipts all fingerprint this engine: `1f9494870e9affd4b7194c54e087d15f04929f4e5841ad9c6c55b01bf0d6e26b`.
