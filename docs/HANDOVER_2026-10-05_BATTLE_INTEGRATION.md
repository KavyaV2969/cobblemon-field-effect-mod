# Handover prompt — continue battle integration completion

Continue the existing Pokémon Rejuvenation → Cobblemon project. Do not start over. Finish the original scope below, using the filesystem and current tests as authority. The previous agent was explicitly asked to halt and hand over; this is an incomplete-work checkpoint, not a completion report.

## Workspace and constraints

- Profile/workspace: `C:/Users/Lenovo/AppData/Roaming/ModrinthApp/profiles/COBBLEVERSE - Pokemon Adventure [Cobblemon]`.
- Project: `rejuvenation/`; authoritative installed simulator: `showdown/`.
- PowerShell on Windows. Use `-LiteralPath` for paths containing brackets. No applicable AGENTS.md was found during this continuation; check again if instructions change.
- Preserve optional Run & Bun decision/damage/immunity/Speed mixins and optional Battle Extras client adapters/server synchronization. Do not edit or bundle external jars.
- Mechanics must come from the shared, read-only evaluator/native simulator. Strategy adds scoring over effective consequences; do not introduce another field formula implementation.
- Queries must restore complete battle state, RNG, logs, action queues, forms, items, abilities and gimmick resources. Preserve rollback/isolation fixtures.
- Avoid Minecraft launches. Prefer JS, deterministic evaluators, isolated Java/client/server fixtures, Graal, parser/registry/mixin ABI, and existing lightweight runners. Launch only if a specific rendered/client API behavior cannot be certified otherwise; batch necessary live checks. This continuation launched Minecraft **zero times**.
- User wants implementation, complete verification, rebuilt/package/deployed outputs and an honest final report, not another plan. The user's latest instruction to the prior agent was to halt; a new agent should resume only when asked to use this handover.
- All tracked shell sessions exited. A final `Get-Process -Name java,node,python` found no running processes. No user Minecraft process was killed. There is no pending build to wait for.

## Full goal to finish

1. Close every ordinary applicable Rejuvenation AI field lead, using local `Battle_AI.rb` and helper source as the baseline, with individual evidence-backed dispositions. Distinguish mechanics coverage from strategy.
2. Integrate future field transformations/destruction/progression/restoration, overlays/counters/expiry, active and reserve team utility, field-aware switching/entry/hazards/residuals, status/setup/recovery/protection/trapping/phazing/screens/weather/terrain/rooms/delayed moves/priority/order into Run & Bun's stronger native scoring.
3. Intelligently compare legal normal/Mega/Z/Dynamax/Gigantamax/Ultra/Tera paths. Consider offensive and defensive consequences, Speed, forms/abilities, resource timing and better reserves. Follow installed legality and combination restrictions, not assumed cartridge rules.
4. Battle Extras' displayed ranges, KO labels, hit counts, accuracy and type/category must agree with actual simulator outcomes for the same supported state, including bench entry and gimmicks. Suppress unsupported/ambiguous speculative displays rather than present incorrect values; document exact display limitations.
5. Preserve the existing 57-backdrop field panel. Certify lifecycle/state synchronization, optional-mod operation, GUI scales/resizing, resync and supported participant/spectator behavior through fixtures where possible.
6. Keep ordinary AI practical on the synchronous server tick. Profile/cache immutable decision state safely; no exhaustive search causing multi-second stalls.
7. Run generation/validation/comparison/Ruby oracles/simulator/AI/preview/panel/Java/Graal/Gradle/integration fixtures/performance/package checks; rebuild and deploy authorized mod/datapack outputs.
8. Final report: original/final AI lead counts and reasons, strategies and improvements, each gimmick's actual mod/API/legality/evaluator/strategy/field tests, preview cases/limits, panel lifecycle/optional compatibility, exact test/oracle/build/performance results, launches and why, artifact/deployment paths.

## Authoritative installed dependencies and source

- Cobblemon: `mods/Cobblemon-fabric-1.7.3+1.21.1.jar`.
- Run & Bun: `mods/rbrctai-fabric-1.21.1-0.16.0-beta.jar`; `RunBunAI`, `MoveEvaluation`, `RBSlotInformation`, `PokeMathMax`.
- Mega Showdown: `mods/mega_showdown-fabric-1.8.4+1.7.3+1.21.1.jar`; battle integration for Mega, Z, Ultra, Dynamax/Gigantamax and Tera. Classes include `gimmick.MegaGimmick`, `UltraGimmick`, `MaxGimmick`, `GimmickTurnCheck` and `mixin.battle.ShowdownActionRequestMixin`, `MoveActionResponseMixin`, `PokemonBattleMixin`, `ShowdownInterpreterMixin`.
- ZA Mega: `mods/zamega-fabric-1.7.3.jar`, additional forms/abilities including Mega Sol.
- Battle Extras: `mods/cobblemon-battle-extras-fabric-1.13.45.jar`.
- Source: `rejuvenation/Rejuvenation 14 copy/Scripts/Battle_AI.rb` and related Ruby battle files; `research/source_path.py` resolves equivalent copies. AI file SHA-256: `0e0facc479030dfe2cdc97bade012346d444365ba0e97b45e42d40b34319e873`.
- Prior read-only decompilation evidence: `C:/Users/Lenovo/.codex/visualizations/2026/10/01/01a0f6c3-4b82-7dd2-86b6-58067fb21b03/battle-ai-audit/`.
- Sanitized `ShowdownMoveset` fields (`canMegaEvo`, `canUltraBurst`, `canZMove`, `canDynamax`/`maxMoves`, `canTerastallize`) and native `MoveActionResponse.isValid` are availability authority. Choice activation uses native `gimmickID`, one activation per action; legal combinations across turns are preserved.
- Installed simulator has one Mega and one Ultra per side, side-wide Z/Tera and ally-side Dynamax resources. Dynamax clears that Pokémon's Tera availability. Existing JS fixture verifies these. Mega Showdown `multipleMegas=true` is out-of-battle ownership logic, not extra simulator Mega uses. Power-spot rules come through the request.

## What was already done before this continuation

Preserve these existing improvements: snapshot restoration preserving object shapes/order; complete bounded memo fingerprints/catalog invalidation; cached empty Item; native-preserving candidate screening; actual lifecycle/pivots/faints/Update/residual/next-turn handling; chance branching; Wish/Future Sight/recharge/petrification; transactional leak fixes; Concert 1/4 fixed damage rolls; exact bench entry evaluator; server-authoritative eager/on-demand previews with batching/deduplication/decisionOpen; source prediction differential framework; generated BESTSKILL affinity/disruption ports and Ruby oracles; 57 attributed panel backdrops.

The older user-reported 540-test/913-client baseline is historical. Earlier reports of 164 consumed / 36 unused / 562 unported are superseded by individual review.

## Implemented in this continuation

### Shared JS engine

Main file: `mod/src/main/resources/rejuvenation-engine.js`.

- Explicit bounded source move preferences: Ashen Beach storms/Twister/Whirlpool, Glitch Ice Fang, Dragon's Den Surf/Muddy Water party tradeoff, Volcanic Top rampage, Rainbow/Mountain snow creation, Rocky flinch. Source zero weights cannot discard a winning KO.
- Starlight weather valuation considers both parties.
- Reserve weather/terrain/room utility uses real hypothetical switch entry and actual matchup measurements; baseline restores the original decision snapshot. Context cache key now includes full battle/team digests, not weather alone.
- Duration value is signed by measured future matchup/context.
- Main-field transitions still rate reserve affinity even when source disruption already rates the actives, avoiding active double-counting.
- Hazards incorporate actually available phazing through native `runMove`/forceSwitchFlag.
- Bounded opponent policy forecasts useful setup/status/Speed control, protection and reserve switching; Taunt option value is included.
- Native action queue entries/order now drive conditional Sucker Punch/Upper Hand and doubles spread/guards/redirection forecasts.
- Shared Upper Hand callback fix uses effective queued priority under fields; actual battle and strategy fixture both pass. Ruby uses effective `priorityCheck`, whereas native callback read base move priority.
- Rollouts now use native victory checks within full rollback and stop before residual damage after a final KO. Previously isolated transactions suppressed checkWin, incorrectly pricing post-victory field damage.
- Capture one full rollout snapshot per decision and restore/reuse it for independent branches.
- Performance screening of second opponent replies: fully branch two strongest contenders plus native choices, explicit counters/phazing and distinct field changes; other candidates receive a bounded risk term from the measured policy. `screen:false` fully branches. No fixed gimmick activation priority.
- Preview stochastic-power bounds now select low/high field `randomPower` and `randomPowerCallback` outcomes via `rejuvenationPreviewRoll` within the shared handler. Actual battles are unaffected when the preview marker is absent.
- Random secondary types are marked `randomSecondaryType`; ranged queries mark `uncertainDamageRange` and omit speculative totals. InspectorSync omits a seeded damage ratio or immunity claim for these ranges. The client already suppresses a field row without authoritative totals.

### Java integration

- `compat/RunBunStrategy.java`: extracted production `candidateScore`; forced-switch requests can have null movesets; preserves existing resource costs and native scoring.
- `compat/mixin/RunBunDecisionMixin.java`: choice/switch metadata reconciliation no longer incorrectly depends on a nonnull moveset. Native resource flags reconcile with the actual chosen response.
- `compat/RunBunFieldAdapter.java`: null decision inputs cleanly reset scope.
- `InspectorSync.java`: per-player battle/turn/decision serial, same-turn request validation, cleanup, serial on outgoing eager/merge payloads. Also uncertainty suppression described above.
- `FieldApi.java`: clears InspectorSync state on battle/global cleanup.
- `client/ClientFieldState.java`: merge/eager serial checks, outbox serial, cannot reopen invalidated decisions from stale merges; retains empty eager payload guard.
- `compat/CompatMixinPlugin.java`: pure optional-mod predicate shared with production; 12 fixture checks across both optional mods present/absent.
- `MixinAbiVerification.java` (previous turn): actual Battle Extras provider certification for runtime-added `calculateAdjustedAccuracy` descriptor `(DLjava/lang/String;Lcom/cobblemon/mod/common/client/battle/ClientBattlePokemon;Lcom/cobblemon/mod/common/api/moves/MoveTemplate;)D`; provider registration/target/callsite and consumer handler checked. 31 ABI checks, no absent optional target. Do not invent a merged-priority rejection: Mixin 0.8.7 BeforeReturn allows any merged priority.

### Tests and source review

- New `mod/src/test/js/strategy-completion.cjs`, required by full simulator suite and runnable independently. Latest **19/19 focused tests pass** (`research/test-results/strategy-focused-console.log`). These include source preferences, parties, durations, opponent utility/protection/Speed/switching, phazing, perish/entry damage, Chess roles, reserve field transitions, doubles Wide Guard, Shadow Sky, winning KO boundary, 12 exact gimmick/field/weather endpoint comparisons, 56 Big Top power-roll bound comparisons, random-type preview suppression and future-battle rollback.
- `AdapterVerification.java`: actual Graal field simulations use production Java candidate scoring for preserve/use cases for all five gimmicks. Total **38 adapter checks passed** at the last broad run. Mega uses Dragon Claw; Ultra uses Photon Geyser versus Regirock so native category/stat changes actually improve the matchup. Safe-KO opponent uses Splash; worthwhile-use opponent attacks. Ultra versus Snorlax can be worse because Photon Geyser becomes Special: do not weaken the strategy to force that bad transformation.
- `JavaVerification.java`: 6 decision identity and 12 optional-mod checks added. Durable receipt planned/written only after all checks pass.
- New `PacketVerification.java`: actual installed field/evaluation/request codecs over isolated Netty buffers, roundtrip/unicode/no trailing bytes/oversize encode+decode, 12 checks. **Not passing yet: fixture dependencies are incomplete** (see first priority).
- Simulator receipts now include engine SHA-256. Graal and strategy benchmark receipts also fingerprint the engine; Java receipt will do so when the packet fixture passes.
- `research/ai-review-decisions.json`: 53 old strategy-gap leads reclassified `implemented_strategy` with semantics/rationale/test evidence. `ai_review.py` now refuses ordinary gaps/pending; `review_registry.py` recognizes new disposition and requires evidence.
- **Important final correction, not yet regenerated:** former `excluded-shadow-sky` lead at line 9221 is now `shadow-sky-residual-strategy`, `ai_rollout_consequence`, with two passing named tests. The Shadow Sky move is absent, but this mod's registered Tempest ability can create its supported weather. The old claim that the weather itself is unavailable was false. Do not re-exclude it.
- `mod/build.gradle`: `aiReview` depends on simulatorTest; `reviewEvidence` depends on aiReview; check depends on both.
- `build.ps1`: regenerates affinity/disruption; builds runtime + strategyBenchmark + integrationFixtureJar; writes docs after fresh test/review receipts.
- `research/prepare_build.py`: adds installed Netty codec-base, Fastutil, JOML, Guava and most recently Commons Lang dependencies needed to instantiate actual packet codecs offline. **Commons Lang addition has not been prepared/tested yet**.

## Verification state — distinguish current from older receipts

Current engine SHA-256 at halt: `7ed34ebb265089fc98743c293c3c61244e964a256f2244179b1e4fec33d4400c`.

- Last full simulator receipt: **556/556**, `failed:false`, before the last three focused cases and later engine refinements. Latest focused current source: **19/19**. Expected next full count is **559**, but regenerate rather than assume.
- Last generated AI counts: 762 leads: 53 implemented_strategy, 317 ai_rollout_consequence, 72 ai_source_weights_ported, 313 ai_mechanic_measured, 4 excluded_custom_move, 3 unreachable_in_build. After the Shadow Sky correction, expected counts are **318 rollout / 3 custom-move exclusions** with other counts unchanged. Regenerate after fresh full simulator pass.
- Remaining AI move exclusions should be Magma Drift, Fever Pitch, Aquabatics. Three unreachable leads: Reborn Shelly (Reborn false), Neved jurisdiction story system, trainer bag potion logic absent in Cobblemon.
- Freshly rerun source generation/validation: 57 fields, 165 explicitly mapped biome candidates, 2,997 rules, 1,647 move entries, 517 transitions, 27 unresolved source move IDs, no absent referenced abilities/items.
- Freshly rerun field comparison: **4,494 properties, zero differences**.
- Freshly rerun Ruby mechanic oracle: **171,396 defense / 120 difficulty cases, zero differences**.
- Fresh AI source oracle: **10,000 disruption / 6,000 affinity cases, zero unexpected differences**. 433 affinity rules / 226 disruption rules across 37 fields. Intentional Perish Body typo correction retained.
- AI prediction audit: earlier verified **334 rows: 314 mechanic matches, 18 documented source/project differences, 1 unreachable, 1 unavailable**. Recount the current receipt. Preserve Holy Salt Cure divisor project decision.
- Broad Graal run passed 57 fields / 42 assertions / declared-ability restoration / three-dex guard / 38 adapters, but fingerprint predates current source.
- Client fixtures should be 917 checks (913 + four added); they ran before packet failure, but no final Java receipt exists. Rerun to certify. Environment 26,948, request legality 12, serial identity 6, optional mods 12; ABI 31.
- **Full Gradle build is not green.** Latest full `build.log` failed javaVerification due packet fixture dependencies. `optimization-build.log` has the most recent narrower failure/benchmark.
- Dist/installed artifacts are stale. Nothing from this continuation was deployed or packaged as complete.

## First priority: finish packet fixture dependencies and performance

### Packet fixture

The real `FieldPayloads.FieldState` identifier initialization loads Minecraft text classes even without a client. Missing dependencies discovered successively: Netty codec exceptions, Fastutil, JOML, then `org.apache.commons.lang3.StringEscapeUtils`.

`prepare_build.py` now includes Commons Lang, but it was added after the last dependency preparation. Run prepare_build then `javaVerification`; inspect actual exception if more installed common libraries are needed. Do not launch Minecraft to resolve a classpath-only fixture. Do not catch arbitrary exceptions and falsely mark serialization verified. Add only installed compatible dependencies, compile/test-only, never bundle.

### Performance is an unresolved acceptance issue

The previous handover's ~565 ms warm 6v6 benchmark is historical. Naively branching opponent utility for every candidate regressed to ~3.5–3.8 s warm. Snapshot reuse and two-contender reply screening reduced it, but the latest measured pre-final-refinement engine still showed:

| Fixture | Cold ms | Warm median ms | Warm max ms |
|---|---:|---:|---:|
| 1v1 | 3207 | 1301 | 1503 |
| fresh 6v6 | 2646 | 2028 | 2379 |
| 6v6 turn 1 | 2758 | 2138 | 2184 |
| 6v6 turn 2 | 2244 | 2408 | 2452 |
| 6v6 turn 3 | 1957 | 2084 | 2214 |

Receipt: `research/test-results/strategy-benchmark.json`, three warm repetitions, engine hash `2c77f926604238bf43e6dbc8ed4fd7ddb9b6dfd47651e46c96f2289dae339148` (not current). Six-member fixture now has 13 candidates, five screened, 10 rollouts instead of 16, ~58 matchup move measurements instead of 82. Still too slow to silently call finished. Profile complete synchronous decisions and improve without dropping source intent or corrupting memo keys.

Unimplemented optimization ideas (investigate; do not assume already present):

- Candidate `measurement` uses `measure(...strategy:true)` only for accuracy/priority/secondary facts yet still computes full damage/crit/immunity. A shared facts-only evaluator mode could avoid unnecessary damage work while the actual runMove still enforces failure/immunity. Policy reply's extra `measure` appears used only for priority although native queue ordering already computes it. Validate conditional moves and secondary guards before removing work.
- Inspect generic fingerprint misses and expensive pair transactions; preserve Rage Fist/Fake Out/Stomping Tantrum/history/allies/side-condition coverage.
- Native prefetch and strategy may be measuring identical decision-time matchups separately; safe shared immutable per-state reuse could help.
- Keep all normal/Z/Max/native paths and meaningful distinct field transitions. Avoid a fixed gimmick priority, stale across-state caching or a performance-only reduction that reopens ordinary strategy gaps.

## Remaining preview audit and code review

- Current Big Top randomized field-power bounds pass all 56 tested roll/ability/stage outcomes. Preview marker restores through transactions; run full rollback suite to certify after latest changes.
- Random secondary-type damage ranges are deliberately suppressed, not "pending forever awaiting a calculation." Ensure server entry conversion cannot display a seeded immunity or ratio; current InspectorSync edit handles this but needs Java/Graal regression coverage. Add a pure serialized-result fixture with uncertainDamageRange + immune:true and assert no fieldBlocks/factor/totals displayed.
- Explicitly document this display limitation in final docs. The draft report currently says random recipes use preview policy too vaguely.
- **Investigation only, not a confirmed defect:** native stochastic damage/power moves such as Magnitude, Psywave, Present, random called moves may not have meaningful complete min/max bounds from the existing two seeded preview hits. Audit which Battle Extras actually displays. Do not apply a blanket `random()=min/max` override: Present, immunity, random types and other nonmonotonic outcomes make that unsafe. Either derive supported bounds through native outcomes or explicitly suppress uncertifiable displays. Avoid duplicating engine formulas.
- Preserve exact fixed-roll Concert 1/4 handling, complete multi-hit/item/protection/survival paths, bench real entry, transformed forms and Dynamax HP denominators.
- Review current opponent-reply screening: full branches for top two/native/counters/field changes, bounded measured policy risk for others. Add a regression for this performance/decision behavior if necessary; docs must describe the actual bounded heuristic.
- Review RunBun selected metadata if variant transformation changes damage; currently keeps corresponding native MoveEvaluation rather than reconstructing its fields. Native resource/switch flags were reconciled.
- `FieldStateSync.resync` is called from InspectorSync choice requests, but `choiceRequested` currently returns early when moveEvaluations is disabled. Consider separating panel resync from that preview toggle. Mid-battle spectators currently get state on the next field update/choice resync; no immediate spectator-join hook was added. PokemonBattle exposes spectator set/sendSpectatorUpdate, not a simple addSpectator method. Do not invent APIs.
- Field panel has unchanged layout/resources; existing fixtures cover lifecycle and geometry. Full two-client rendering/disconnect QA can remain separate per user instructions; be precise about limits.

## Documentation/package/deployment still unfinished

- New `research/write_integration_report.py` is a **draft, not yet run**. It requires passing, current-hash simulator/Java/Graal/benchmark receipts and writes INTEGRATIONS.md, INTEGRATION_COMPLETION_REPORT.md, FINAL_REPORT.md, REMAINING_WORK.md, updates LIMITATIONS/PERFORMANCE, and a JSON completion receipt. Correct its stale four-exclusion/Shadow Sky sentence, exact current counts, bounded opponent policy wording and random-type display limitation before using it. It has not yet been wired into build.ps1.
- `research/write_docs.py` stale 164/762 coverage statements were edited, but generated documents have not been regenerated since the latest source correction.
- Existing docs/INTEGRATIONS.md, LIMITATIONS.md and REMAINING_WORK.md still largely describe obsolete partial integration; do not rely on those as final status. Earlier handovers are historical.
- `research/package.py` still sets implementationCompletionStandardMet based only on general runtime field review. Require fresh AI zero-pending evidence, current simulator/Java/Graal/performance fingerprints and successful final build; do not package a false completion claim. Include integration/benchmark receipts and honest historical live artifact-match status.
- Package checks already enforce exact current engine in jar, 57 attributed assets, no bundled external classes/jars and no common-code client references.
- Existing dist runtime jar: `rejuvenation/dist/rejuvenation-fields-0.2.0.jar` currently 1,608,384 bytes, but predates latest engine. Datapack zip/manifest older still.
- Installed runtime jar: `mods/rejuvenation-fields-0.2.0.jar`, 1,551,232 bytes, old. Installed pack: `datapacks/rejuvenation-fields-datapack-0.2.0.zip`.
- Rebuild runtime and `integration/rejuvenation-verification-fixture-0.2.0.jar`, package datapack, then deploy only authorized authored jar/pack paths, hash-verify and record deployment. Preserve unrelated mod/config/trainer content. Run `research/audit_protected.py`; historical profile settings differences are not automatically this continuation's edits.
- Temporary diagnostic `research/test-results/diagnose-strategy.cjs` can be retained as diagnostic or removed if unnecessary; not part of build.

## Commands and dependable runtimes

Python: `C:/Users/Lenovo/AppData/Local/Python/pythoncore-3.12-64/python.exe`.

Java/javap: `C:/Program Files/Java/jdk-21/bin/`.

Fast current JS tests:

```powershell
node rejuvenation/mod/src/test/js/strategy-completion.cjs
```

Reliable direct Gradle launcher (the .bat wrapper previously hung):

```powershell
& 'C:/Program Files/Java/jdk-21/bin/java.exe' -cp 'C:/Users/Lenovo/.gradle/wrapper/dists/gradle-8.13-bin/5xuhj0ry160q40clulazy9h7d/gradle-8.13/lib/gradle-launcher-8.13.jar' org.gradle.launcher.GradleMain -p rejuvenation/mod --gradle-user-home rejuvenation/mod/.gradle-home --offline --no-daemon build strategyBenchmark integrationFixtureJar --continue --console=plain
```

For bounded iteration use `javaVerification strategyBenchmark -PbenchmarkRepetitions=3`; final benchmark should use default five repetitions. Direct simulator suite is `node rejuvenation/mod/src/test/js/engine.test.cjs`; it spawns Ruby and failed with `spawnSync ruby EOF` in the sandbox. Full Gradle/escalated local executions work. Gradle daemon execution also required sandbox escalation, previously approved. This is a local offline tool requirement, not authorization to launch a client.

Recommended final order:

1. Re-prepare local dependencies; certify packet/client Java fixtures. Fix/profile strategy practical latency and preview uncertainties; run focused meaningful tests.
2. Regenerate affinity/disruption/fields; validate; compare; run mechanic Ruby oracle. Full simulator/Graal/Java/AI reviews/benchmark/build/integration fixtures with current source, capture final successful build.log.
3. Regenerate per-lead AI review and semantic evidence (Gradle check does this), confirm zero ordinary pending, exact exclusions and all named receipts.
4. Repair/run integration documentation generator and package completion accounting; wire reproducible pipeline. Rebuild if code/resources changed after receipts.
5. Package and deploy authored outputs with hash receipts, audit protected content. Finish the required user-facing report, with zero launches unless a concrete remaining client behavior requires one.

Do not represent this handover or the last 556-test receipt as current full completion. Start with the packet classpath and performance issue, then certify the newer preview changes, reports and deployment.
