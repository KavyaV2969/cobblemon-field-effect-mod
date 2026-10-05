# Continuation prompt: Rejuvenation battle integration

Continue the existing project. Do not start over or discard edits. The user requested a wrap-up/handoff because usage limits were almost reached, then supplied a substantial update from intervening work. This checkpoint finishes the immediate Battle Extras accuracy ABI verification and offline build. The full original objective remains incomplete.

This prompt supersedes `AI_INTEGRATION_HANDOFF_2026-10-05.md`, whose performance blocker, test counts and continuation priorities are stale. The repository and current tests are authoritative; reassess any numerical claim before reporting it.

## Workspace and objective

Windows PowerShell workspace/profile:

`C:\Users\Lenovo\AppData\Roaming\ModrinthApp\profiles\COBBLEVERSE - Pokemon Adventure [Cobblemon]`

Project directory: `rejuvenation/`. No applicable AGENTS.md was found in the project/profile/ancestor search. No new thread, subagent or goal was created at this checkpoint.

Finish the surrounding integration of the existing 57-field Rejuvenation implementation:

1. Adapted Run & Bun must strategically understand every ordinary applicable Rejuvenation AI field branch, at least matching the local Ruby source. Mechanics/damage knowledge alone does not close a strategic lead.
2. Value future field transitions, progression, restoration, overlays, counters, duration/expiry, both active Pokémon and both remaining teams. Integrate switching, setup, status, healing, hazards, protection, trapping, phazing, weather, terrain, rooms and delayed effects.
3. Meaningfully decide whether/when to use Mega, Z-Moves, Dynamax/Gigantamax, Ultra Burst and Terastallization. Enforce the actual installed legality, resource and combination rules; compare legal strategic paths instead of using fixed gimmick priority.
4. Every value Battle Extras displays must agree with the simulator for the same field/form/gimmick state. Preserve supported display scope and withhold pending exact results instead of inventing ranges.
5. Preserve the existing field panel design and 57 attributed backdrops. Finish synchronization/lifecycle, optional Battle Extras behavior, scaling/resizing and client/server compatibility.
6. Keep decisions practical, complete the relevant automated pipeline, rebuild/package/deploy outputs and write the user's detailed final report when the objective is truly achieved.

Preserve optional Run & Bun decision/damage/immunity/Speed adapters and optional Battle Extras client adapters plus server choice synchronization. Do not modify/bundle external jars. Mechanics must come from the shared side-effect-free field evaluator and real simulator; strategy may score consequences but must not recreate field formulas. Hypothetical queries must restore the full battle, resources, RNG and future behavior, and must not send hypothetical output.

Avoid launching Minecraft. Prefer JS tests, deterministic evaluators, Java/Graal/parser/mixin/packet/client-model fixtures and existing lightweight runners. Launch a full client only for behavior that cannot reasonably be certified otherwise, batching any unavoidable visual/API smoke checks. No Minecraft launch occurred at this checkpoint.

## What the intervening work already completed

The user reported substantial changes; the current source and fresh test run confirm their presence. Preserve them:

- Snapshot restoration retains object shapes and transient-property order; pair-local snapshots and active-only candidate snapshots reduce work.
- Memoization fingerprints now include volatiles, side conditions, allies, relevant battle/move history and field-catalog revision; caches are bounded. Empty Item objects are reused.
- Candidate screening preserves the native choice and normal/Z/Dynamax paths, trims Mega/Ultra/Tera candidates while preserving distinct field transitions, and screens switches. Representative 6v6 fixture retains 13 candidates but executes 8 rollouts and 42 matchup measurements.
- Rollouts process forced switches/drag-ins, faints/AfterFaint, Update events, pivots, residuals, next-turn boundaries and active replacements. Wish/Future Sight, recharge and petrification have strategic value. Full rollback and nested property/override leaks have regression coverage.
- Own secondary effects can be probability-branched using the simulator's adjusted chance; unrelated chances use a deterministic median policy rather than a fixed RNG seed bias.
- All three damage-roll override sites respect field-specific fixed rolls (Concert 1 = 85; Concert 4 = 100), with exact collapsed preview-range tests.
- All 762 Battle_AI.rb leads were individually reviewed. Do not mistake reviewed classifications for completed strategies: 53 remain explicitly classified as gaps.
- Generated getFieldDisruptScore: 226 source-derived rules across 37 relevant fields, neutral source default elsewhere. Main-field transitions use the source sqrt(current/new) disruption valuation with a floor; affinity applies to overlay/duration effects to avoid double counting.
- Affinity and disruption ports have actual Ruby-method differential oracles. Affinity represents BESTSKILL trainers, with an intentional correction of the dead PERISHBODY typo.
- Additional hazard, charge/two-turn, crit-stage, Glitch Special, Mirror Move/Sky, field-neutral disruption and petrification valuation is implemented.
- Exact bench evaluator hypothetically switches in a reserve through actual entry effects, measures the matchup and completely rolls back.
- On-demand server-authoritative gimmick/bench preview protocol is implemented. Active ordinary moves are eager; an empty eager packet still opens the decision. Client requests are deduplicated, queued per tick and batched; selected gimmick changes invalidate tooltip caches. Pending field-aware bench rows are withheld, and native no-field behavior remains.

## Immediate work completed in this checkpoint

The installed Battle Extras jar contributes this private instance method through `name.modid.mixin.client.MoveTileMixin`:

```text
calculateAdjustedAccuracy(double, String, ClientBattlePokemon, MoveTemplate) -> double
(DLjava/lang/String;Lcom/cobblemon/mod/common/client/battle/ClientBattlePokemon;Lcom/cobblemon/mod/common/api/moves/MoveTemplate;)D
```

Its client mixin config registers the provider, the provider targets Cobblemon's `BattleMoveSelection$MoveTile`, and its tooltip code calls the method. Provider priority is 1000; our `BattleExtrasAccuracyMixin` is 1100. Inspection of installed Mixin 0.8.7 confirms `BeforeReturn.checkPriority` accepts merged methods without a priority restriction. Do not introduce the generic injection point's priority restriction into this RETURN hook.

Changed files:

- `mod/src/test/java/dev/rejuvenation/MixinAbiVerification.java`: validates the provider registration, actual target, exact descriptor, ordinary non-static/non-abstract/non-Unique/non-Shadow/non-injector/non-@Final method, live call site, and our handler ABI. Adds the provider's method to the verifier's target model. Records provider/consumer priorities as provenance.
- `mod/src/test/java/dev/rejuvenation/JavaVerification.java`: writes `research/test-results/mixin-abi.json` and reports certified merged targets.

The verifier now reports **31 injector/shadow checks, zero optional targets absent**, including accuracy. This is bytecode/config/handler certification, not a claim that the full Minecraft mixin bootstrap or rendered tooltip was exercised.

## Fresh verification and receipts

This checkpoint ran offline Gradle `build integrationFixtureJar`, then reran `javaVerification` after the final verifier edit. Both succeeded.

- Simulator: **540/540 passing** (`research/test-results/simulator.json`).
- Isolated client state, exact preview presentation and panel layout: **913 checks**.
- Sanitized request gimmick legality: **12 checks**.
- Mixin ABI: **31 injector/shadow checks**, no missing optional target (`research/test-results/mixin-abi.json`).
- Java environment resolution: **26,948 checks** plus parser/catalog/trainer/capture fixtures.
- Shaded Graal: all **57 fields** attach/destroy, **42 runtime assertions**, declared-ability restoration, three-dex guard, twin-battle evaluator isolation and **18 adapter checks**.
- AI prediction receipt now has **334 rows**: **314 matches**, **18 documented source-AI/mechanic discrepancies**, **1 unreachable**, **1 unavailable**. This supersedes the user's earlier 333-row summary. These are audit rows, not additional top-level simulator tests.
- AI Ruby source oracle: **10,000 disruption cases + 6,000 affinity cases; zero differences** (`ai-source-oracle.json`).
- Datapack validation: 57 fields, 2,997 rules, 1,647 move entries, 517 transitions, 165 explicit candidate biomes, 27 unavailable moves, zero unavailable ability/item IDs. Candidate biomes differ from the separately captured live biome registry.

Logs:

- `research/test-results/integration-wrapup-console.log`: complete build/Graal/Java/simulator/integration-fixture output, BUILD SUCCESSFUL.
- `research/test-results/mixin-wrapup-console.log`: final Java verifier revision, BUILD SUCCESSFUL.
- `research/test-results/graal-performance.json`: refreshed by this build.
- `research/test-results/ai-prediction-audit.json` and `ai-source-oracle.json`: refreshed by the simulator suite.

The older full field-definition comparison still records **4,494 properties, zero differences**; the older runtime Ruby oracle records **171,396 defense + 120 multiplier cases, zero differences**. They were NOT rerun in this checkpoint; recertify in the final pipeline. Do not present old live/oracle receipts as current artifact certification.

Performance is no longer the original blocker. Existing dedicated `strategy-benchmark.json` records representative warm 6v6 median **565 ms**, maximum 809 ms, 8 rollouts/42 measurements; the user's controlled comparison was about 1.7x faster than the reconstructed original. The fresh broader Graal verification records 6v6 samples around **1,627–2,183 ms** and a first catalog publish of 8,061 ms; those are single samples in the verification context, not the dedicated warm benchmark. Do not compare these as identical cold/warm conditions or discard the structural improvements. Strategy executes synchronously on the server tick. Use `strategyBenchmark` for reproducible comparisons as future strategy work grows.

## Actual AI completion gap — next priority

Authoritative `research/ai-coverage.json` dispositions (762 total):

| Disposition | Leads |
| --- | ---: |
| ai_mechanic_measured | 313 |
| ai_rollout_consequence | 317 |
| ai_source_weights_ported | 72 |
| ai_strategy_gap | 53 |
| excluded_custom_move | 4 |
| unreachable_in_build | 3 |

Read `research/ai-review-decisions.json` and the exact Ruby source lines before changing any classification. Five gap groups remain:

1. **source-preference-without-mechanic — 12 leads:** Ashen Beach Storm/Twister/Whirlpool preferences; Glitch Ice Fang; Dragon's Den Surf/Muddy Water party preference; Volcanic Top rampage; Rainbow/Mountain Snowscape/Chilly Reception; Rocky flinch. A static source weight may encode tactical intent even without a direct field formula. Investigate each. Port justified intent or document a tested intentional improvement; do not blanket-exclude because it is not immediate damage.
2. **starlight-weather-party-preference — 6:** weather hides stars powering Dark/Fairy/Psychic; current active rollout sees suppression but reserve-team weather value is missing.
3. **opponent-choice-anticipation — 25 leads on 24 source lines:** field protection/status interactions, opponent speed control, Wide Guard against amplified spread, Upper Hand/Sucker Punch/Trick Room against Chess king, False Surrender/Taunt, Protect against Future Sight, Inverse rampage switching. The opponent reply currently chooses its strongest damaging move; status/protection/switch policies are missing. Add bounded opponent alternatives/heuristics without exhaustive minimax.
4. **duration-value — 6:** extended weather/Wonder Room duration beyond the next turn is not priced. Use simulator-provided durations and measured future utility; do not duplicate extension formulas.
5. **multi-turn-plans — 4:** hazard/phazing synergy, Deux Finalis Magical Seed recycling, Chess king priority-block switching, Corrosive hazard anti-switch decisions.

Target: zero ordinary applicable strategic gaps after implementation and evidence. Preserve true unavailable/custom/Crest/reward exclusions. Prediction discrepancies (Scary Face Haunted, paradox entry assumptions, MIRORARMOR typo, residual source-AI mistakes, ordinary Forest drain assumptions) must continue following actual mechanics. Preserve the project's intentional Holy Salt Cure divisor; do not silently replace it with a different upstream branch.

## Installed implementations and key files

Installed jars:

- `mods/Cobblemon-fabric-1.7.3+1.21.1.jar`
- `mods/rbrctai-fabric-1.21.1-0.16.0-beta.jar`
- `mods/mega_showdown-fabric-1.8.4+1.7.3+1.21.1.jar`
- `mods/zamega-fabric-1.7.3.jar`
- `mods/cobblemon-battle-extras-fabric-1.13.45.jar`

Actual simulator: `showdown/`. Actual gimmick configuration: `config/mega_showdown/config.json`. The prior investigation found multipleMegas=true, Mega/Z/Tera/Dynamax enabled, dynamaxAnywhere=false and power-spot range 32. Current resource regression tests one Mega/Ultra per side, side-wide Tera/Z and Dynamax excluding Tera; reconcile that test with Java availability policy and actual sanitized requests before claiming every installed configuration rule is covered. Do not infer cartridge rules. `MoveActionResponse(moveName,targetPnx,gimmickID)` carries one activation per action; legal combinations may span actions.

Authoritative Ruby: `rejuvenation/Rejuvenation 14 copy/Scripts/Battle_AI.rb` and related helpers/mechanics. `source_path.py`/source hash receipts resolve other recorded local copies. Do not redistribute Ruby game source or external decompilations.

Implementation map:

- `mod/src/main/resources/rejuvenation-engine.js`: evaluator, transactions, bench entry measurement, strategies and generated source weights.
- `scripts/generate_ai_affinity.py`, `generate_ai_disruption.py`; `research/ai-affinity-source.json`, `ai-disruption-source.json`; `research/ai_source_oracle.rb`.
- `research/ai_review.py`, `review_registry.py`, `ai-review-decisions.json`, `ai-coverage.json`, semantic review registry.
- `mod/src/main/java/dev/rejuvenation/FieldEvaluator.java`: shared Java query/results/cache bridge.
- `compat/RunBunStrategy.java` and `compat/mixin/RunBun*`: legal candidate/native score integration and returned decisions.
- `InspectorSync.java`: eager/on-demand server evaluation and legality validation. Limits: 24 queries/request and 160/player/turn.
- `net/FieldPayloads.java`, `FieldStateSync.java`, `client/ClientFieldState.java`, `client/RejuvenationFieldsClient.java`: protocol/model/outbox/resync/client tick handling.
- `client/BattleExtrasFieldAdapter.java` and `compat/mixin/BattleExtras*`: move/switch/tooltips/accuracy/selection/cache hooks.
- `client/FieldPanelRenderer.java`: panel lifecycle/geometry/backdrops.
- `mod/src/test/js/strategy-regression.cjs`, `strategy-lookahead-regression.cjs`, `evaluation-regression.cjs`, `ai-prediction-audit.cjs`, `ai-source-oracle.cjs` and `engine.test.cjs`.
- `mod/src/test/java/dev/rejuvenation/{JavaVerification,MixinAbiVerification,GraalVerification,AdapterVerification,StrategyBenchmark}.java`, and `client/ClientVerification.java`.

## Remaining integration/build checks

- Finish ordinary strategic gaps first; add deterministic decisions that distinguish strategic reasoning from mechanical measurement. Keep rollback/fingerprint tests and dedicated performance receipts current.
- Audit all five gimmicks for legality, timing/resource reservation, transformed offensive/defensive/Speed/ability consequences and field interactions. Verify distinct G-Max/Z-status paths and legal cross-turn combinations rather than simply button availability.
- Extend exact preview differentials where coverage remains thin: bench entry, selected variants, current transformed state, fixed rolls, screen/protection/crit/category/stat substitutions, type/ability/item changes, HP denominators and complex fields. Count displayed-value cases honestly.
- Check packet serialization, stale turn/same-turn decision handling, malformed/unauthorized requests, budgets, forced/pivot replacement, reconnect/resync, optional-mod absence and isolated server safety. `InspectorSync.requested` visibly validates battle ownership/current request; inspect whether explicit request turn/decision identifiers are validated sufficiently. This is a follow-up question, not a newly verified failure.
- Panel: preserve existing layout; certify all replacement/overlay/expiry/restoration/destruction/progression/counter paths, no-special-field behavior, Battle Extras absent/present, scales/window sizes and supported spectators/PvP. Separate model/geometry proof from actual render proof.
- Full `build.ps1` currently runs prepare_build, generate, validate, compare, runtime_oracle, write_docs, Gradle build, package. Verify generators/source review/AI oracle/strategy benchmark/new receipts are reproducibly included where appropriate. Do not let docs generation replace honest integration status with stale templates.
- `package.py`/manifest completion flags currently describe field-runtime audit closure, not full AI/preview/panel completion. Correct the scope before publishing a final completion claim. Historical live hashes must remain marked as not matching new artifacts.

## Commands and artifact state

Python: `C:/Users/Lenovo/AppData/Local/Python/pythoncore-3.12-64/python.exe`; `node` works. Java/javap: `C:/Program Files/Java/jdk-21/bin/`. Use PowerShell `-LiteralPath` for paths containing `[Cobblemon]`. Keep file operations within one shell. Gradle's local daemon connection needed sandbox escalation; automatic review approved both verification runs, with no rejection.

Reliable direct Gradle launcher from profile root:

```powershell
& 'C:/Program Files/Java/jdk-21/bin/java.exe' -cp 'C:/Users/Lenovo/.gradle/wrapper/dists/gradle-8.13-bin/5xuhj0ry160q40clulazy9h7d/gradle-8.13/lib/gradle-launcher-8.13.jar' org.gradle.launcher.GradleMain -p rejuvenation/mod --gradle-user-home rejuvenation/mod/.gradle-home --offline --no-daemon build integrationFixtureJar --console=plain
```

Use `strategyBenchmark -PbenchmarkRepetitions=5` for dedicated timing; `-PbenchmarkEngine=<file>` measures an alternative without overwriting the shipped receipt. JS suite: `node rejuvenation/mod/src/test/js/engine.test.cjs`.

The build refreshed `rejuvenation/dist/rejuvenation-fields-0.2.0.jar` (**1,602,575 bytes** at this checkpoint). The integration fixture task succeeded; its jar remained up-to-date. **No deployment or package/manifest refresh was performed.** Installed `mods/rejuvenation-fields-0.2.0.jar` remains the older **1,551,232-byte** build. `datapacks/rejuvenation-fields-datapack-0.2.0.zip` and the dist datapack/manifest retain older packaging receipts. Do not assume the installed profile contains the new AI/protocol source.

After actual completion: run generation/validators/definition comparison/full Ruby oracle/JS AI and preview tests/benchmark/client and packet fixtures/Graal/Gradle/integration/package; deploy to the profile's mods/datapacks paths; verify artifact hashes and protected external-mod integrity. Report AI dispositions/strategies/improvements/exclusions/performance, each gimmick's implementing API/legality/evaluator/strategy/field tests, preview paths/case counts/limits, panel lifecycle/optional compatibility, complete verification counts, any live launches with exact reasons, and built/deployed absolute artifact paths.

Continue implementation autonomously. Do not stop at a plan, mark measured mechanics as strategic completion, or claim source-equivalent AI while the explicit 53-lead gap remains.
