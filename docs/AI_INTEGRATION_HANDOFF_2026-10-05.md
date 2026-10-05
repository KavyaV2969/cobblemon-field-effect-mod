# Continuation prompt: Rejuvenation battle intelligence/integration

**Superseded checkpoint:** use [the updated handoff](AI_INTEGRATION_HANDOFF_2026-10-05_UPDATED.md). This earlier file retains historical implementation detail; its performance blocker, counts and priorities are stale.

Continue the existing project; do not start over. The user paused this turn because usage limits were almost reached and explicitly requested this handoff. The original goal is NOT complete. Preserve the current edits and authoritative filesystem/tests. Do not convert the audit to zero pending without an actual semantic review and evidence.

## Workspace and goal

Profile/workspace:

`C:\Users\Lenovo\AppData\Roaming\ModrinthApp\profiles\COBBLEVERSE - Pokemon Adventure [Cobblemon]`

Project: `rejuvenation/`. Windows PowerShell, Java 21, Node available. No Git repository or applicable AGENTS.md was found at the beginning of the work.

Complete the surrounding integration of the already implemented 57-field Rejuvenation engine:

1. Run & Bun must strategically understand all ordinary applicable Rejuvenation AI field branches, at least matching the local Ruby source. Damage support is not strategic coverage.
2. Reason about future fields, restoration/expiry, progression/counters, active and reserve teams, switching, setup/status/utility and resource timing.
3. Strategically support Mega, Z-Moves, Dynamax/Gigantamax, Ultra Burst and Tera according to the installed implementations and configuration.
4. Battle Extras displayed values must agree with actual simulator results, including gimmick selections.
5. Preserve the existing panel design while finishing lifecycle, optional-mod and compatibility robustness.
6. Keep decision performance practical; rebuild, package and deploy only once genuinely verified.

Preserve the optional Run & Bun decision/damage/immunity/Speed mixins and optional Battle Extras preview/tooltip + server choice synchronization. Do not modify or bundle external jars. All mechanics come from the shared, read-only evaluator/actual simulator. Strategy may add heuristics; do not create independent field formulas. Hypothetical evaluation must not mutate the battle, publish output or consume real resources/PRNG state.

Use simulator tests, deterministic evaluators, Java/Graal/parser/mixin/packet/UI fixtures first. No Minecraft launch occurred in this continuation. Do not launch it for logic already testable in fixtures; batch any genuinely unavoidable visual/API smoke tests.

## Verification at handoff

Latest Node run: **519 passed, zero failures**, `mod/src/test/js/engine.test.cjs`. Baseline was 511. Eight named tests were added by `strategy-regression.cjs`; some contain several cases.

Latest Gradle invocation ran `graalTest javaVerification integrationFixtureJar`: **BUILD SUCCESSFUL**, including compileJava/compileTestJava/compileIntegrationJava.

Graal: all 57 fields attach/destroy, 42 existing runtime assertions, declared-ability restoration, three-dex guard, 18 existing adapter checks, twin-battle evaluator isolation. New strategy benchmarks run in the actual Cobblemon shaded interpreter.

Java: strict parser and existing fixtures; **26,948 environment checks**. New isolated client packet/model, exact range presentation and panel geometry fixtures: **900 checks**. They need no client window or Minecraft startup.

Current validation: 57 fields, 2,997 rules, 1,647 move entries, 517 transitions, 165 candidate explicit biomes, 27 unavailable source moves, zero missing abilities/items. There are 60 additional installed registry resources.

The full definition comparison and Ruby oracle were NOT rerun after all changes in this continuation. Existing receipts retain 4,494 property comparisons / zero differences and 171,396 defense + 120 multiplier cases / zero differences. Re-run as part of final certification; do not present old receipts as fresh.

Primary receipts:

- `research/test-results/simulator.json`
- `research/test-results/simulator-console.log`
- `research/test-results/graal-console.log` (latest combined Graal/Java/integration fixture build)
- `research/test-results/graal-performance.json`
- `research/test-results/java-console.log` (earlier isolated Java run)

Latest Graal timings:

| Fixture | Candidates | Time | Damage calls | Cache hits |
| --- | ---: | ---: | ---: | ---: |
| one-member teams, normal + Tera | 8 | 2,087 ms | 30 | 11 |
| six-member teams, normal + Tera + switches | 13 | 4,463 ms | 59 | 21 |

Six-member damage measurement total: 2,099 ms; simulator mechanics inside measurements: 1,563 ms. First catalog publication 8,666 ms; warm 919 ms; four ordinary evaluator queries 276 ms. Catalog publication occurs at server startup/reload, not battle startup.

The first rollout prototype was ~21.8 seconds for six members/384 damage calls. Improvements reduced it, but **4.5 seconds remains too slow to certify or deploy as completed AI**. The user's prior reference was 60 field queries/1,867 ms through three live turns.

## Installed implementations and source evidence

- `mods/rbrctai-fabric-1.21.1-0.16.0-beta.jar`
- `mods/mega_showdown-fabric-1.8.4+1.7.3+1.21.1.jar`
- `mods/zamega-fabric-1.7.3.jar`
- `mods/Cobblemon-fabric-1.7.3+1.21.1.jar`
- `mods/cobblemon-battle-extras-fabric-1.13.45.jar`
- actual installed simulator: `showdown/`
- actual configuration: `config/mega_showdown/config.json`

The config currently enables Mega/Z/Tera/Dynamax, has `multipleMegas: true`, `dynamaxAnywhere: false`, power spot range 32, and separate outside-battle Mega/Ultra options. **Investigate `multipleMegas` next**: local `showdown/sim/battle-actions.js::runMegaEvo` still clears all allies' canMegaEvo. The Java mod may deliberately restore/override that availability. Do not assume cartridge exclusivity or declare this reconciled from simulator-only fixtures.

Native Run & Bun already has Tera and Dynamax heuristics; its Mega activation is eager. Z and Ultra were absent from native choice logic. Do not repeat the assumption that native AI only supported Mega.

Installed Cobblemon response: `MoveActionResponse(moveName,targetPnx,gimmickID)`, serializer appends ONE gimmick string per action. Legal combinations across turns are dictated by actual requests/mod policy. Relevant IDs used by adapters are `mega`, `ultra`, `zmove`, `dynamax`, `terastallize`.

Mega Showdown's sanitized requests include availability/player item restrictions. Its MoveActionResponse validity overwrite does not fully validate gimmick availability, so candidates explicitly enumerate legal sanitized request flags/lists. NPC restrictions differ from player bracelet/band/orb checks. Verify exact Java policy, including config-driven resource restoration.

Simulator APIs already used:

- `actions.runMegaEvo` uses canMegaEvo first, otherwise canUltraBurst. Ultra hypothetical clears canMegaEvo to select Ultra.
- `actions.getZMove/getActiveZMove/canZMove` provide actual crystal legality, Z status conversion and actual power/category.
- `pokemon.getDynamaxRequest`, `actions.getMaxMove/getActiveMaxMove`, `addVolatile('dynamax')` provide actual HP/form/Max/G-Max states.
- `actions.terastallize`, canTerastallize and `pokemon.getTypes` provide actual Tera states.
- `battle.getActionSpeed(action)` supplies exact converted Z/Max priority. The old base move priority was wrong for converted Quick Attack; this was fixed and tested.

Local authoritative Ruby: `Rejuvenation 14 copy/Scripts/Battle_AI.rb` (15,352 lines), plus PBStuff/helper modules. `research/source_path.py` may first resolve a recorded external Test (1) copy, then fall back to this local copy; check source identity before regenerating reviews.

Existing read-only decompilation evidence from the prior work:

`C:\Users\Lenovo\.codex\visualizations\2026\10\01\01a0f6c3-4b82-7dd2-86b6-58067fb21b03\battle-ai-audit\`

Contains CFR, decompiled `rbrctai/.../RunBunAI.java`, `utils/RBSlotInformation.java`, Mega Showdown battle mixins and Cobblemon response classes. Current Battle Extras calculator was additionally decompiled into `research/bytecode/battleextras/name/modid/client/MoveDamagePreviewCalculator.java`. Do not redistribute these external decompilations; check ignore/packaging rules.

## Current edits

### Shared engine: `mod/src/main/resources/rejuvenation-engine.js`

- Evaluator Query now accepts `gimmick` and `range`.
- Actual Z/Max conversion, actual form/Tera/Dynamax application inside transactions; same form used for field/native measurements.
- `evaluatorPriority` invokes actual action-speed API for converted priority.
- `guaranteedCritical` preserves guaranteed modern critical stage 4 and explicit willCrit while ordinary ranges exclude chance criticals (matching Battle Extras convention).
- `previewRoll` invokes complete `useMove` hit pipeline and AfterMove, fixing low/high random rolls, per-hit count, protection, damage mitigation, absorption and lethal-survival behavior. Ranges are conditional on connecting/executing.
- Transaction snapshots include faintQueue/inputLog; suppress hypothetical send/checkWin. Restore real PRNG/log/state/items/forms/teams after queries.
- Immutable rule lists indexed by event using WeakMap; frozen predicate key/value entries cached. Dynamic mutable conditions are not cached.
- New `strategy(battle,request)` compares normal moves, switches and legal gimmick candidates through actual runMove/entry/residual consequences.
- Damage/HP/KO, healing/drain/recoil/protection, setup potential, status, hazards/screens/delayed-support option value, field transitions/overlays/durations and team field affinity influence scores.
- Independent deterministic analysis seed; connect/miss branches weighted by measured accuracy. Does not peek at the real next PRNG roll.
- Matchup potential deliberately measured at full health, separating lasting matchups from HP already priced by actual rollout. Real incoming attacks and KO consequences use current HP.
- Reserve resource opportunity uses a bounded heuristic over simulator effective stats/types/immunity plus source affinity, avoiding a full team cross product. Current gimmick candidates still use complete rollouts. This is NOT yet proven Rejuvenation-equivalent for every branch.

### Source affinity

New `scripts/generate_ai_affinity.py` ports **433 source switch-affinity weight rules** from the source table (~11530–12025). Fail-fast Ruby syntax translation, generated marked region embedded in engine. Evidence: `research/ai-affinity-source.json` with source line/weight/condition.

Traits include typing, ability, weather, doubles and Concert stages. Crest portions of mixed Slush Rush/Crest rules are excluded; ordinary Slush Rush preserved. Corrects source typo PERSIHBODY to Perish Body. Uses effective/suppressed ability state, not raw ability string. Main + overlay affinity and temporary expiry/backup weights are considered for both teams, with reserves counted individually.

This is source strategic metadata, NOT field damage formulas. It does not prove all source strategic knowledge is ported. The source's `getFieldDisruptScore` (~9770–10143) was read comprehensively but NOT fully ported; it includes additional move/role/type/team preferences (notably Fire benefiting on Forest) beyond the switch-affinity table. This is a concrete remaining gap.

### Run & Bun

- New `compat/RunBunStrategy.java`: captures native move-family scores; enumerates sanitized normal/Mega/Ultra/Z/Max/Tera/switch paths; submits one shared-engine strategy request; combines native scores, consequence scores and resource opportunity/consumption costs.
- New optional `compat/mixin/RunBunScoreMixin.java`, added to compat mixin JSON; captures MoveEvaluation.setScore result and original evaluation object.
- `RunBunDecisionMixin` now changes the returned response and reconciles eagerly marked Mega/Tera/Dynamax flags if activation was delayed.
- If selection changes, it updates selfInfo.chosenMove and willBeSwitchedIn flags to avoid retaining native abandoned move/switch state.
- `RunBunFieldAdapter.begin` clears evaluator decision cache and starts score capture. Existing math/immunity/Speed corrections retained.

Actual mixin application/choice serialization with Mega Showdown + Run & Bun is NOT certified by compilation alone. Add isolated bytecode/mixin/request fixtures. Native chosenMove damage/gimmick prediction may still represent the native evaluation rather than the new selected gimmick; partner coordination needs further review. Missing captured scores/default fallbacks and ally targets need tests.

### Preview/server/client

- `FieldEvaluator.Query` expanded to `(UUID user,String move,UUID target,String gimmick,boolean range)` with original three-arg overload.
- `InspectorSync` forgets stale same-turn cache at each player choice; resyncs field; sends ranged ordinary AND all legal available gimmick variants for active moves against opposing actives.
- Entries include actual total ranges/target HP/hits and gimmick.
- `ClientFieldState` keys include gimmick; rejects older turns/replaced fields/wrong battles/late ended-battle data; resets on disconnect. New field snapshots invalidate evaluations, including clocks/overlays.
- `BattleExtrasMoveTileMixin` reads actual tile response (getMoveName/getGimmickID), including specialized gimmick tiles.
- `BattleExtrasPreviewMixin` returns exact simulator range presentation. In an active field preview context, it returns no range rather than displaying a native estimate while data is pending/ambiguous.
- Target identification by species base HP + level now requires one unique match in doubles. Ambiguous ranges withheld.
- Exact KO keys/colors/HP-clipped percentages match the installed Battle Extras DamagePreview record (6-arg constructor).

IMPORTANT remaining preview issues:

1. `BattleExtrasSwitchPreviewMixin` STILL deliberately leaves benched switch-screen previews native. Their field damage is NOT covered. Need authoritative bench/entry preview queries or safe suppression; do not claim all displayed values exact yet.
2. InspectorSync eagerly queries every gimmick variant: benchmark server choice latency on full teams/doubles. It may be too expensive; consider on-demand selection requests or safe bounded prefetch, preserving server authority and synchronization.
3. Test every specialized gimmick tile/tooltip cache path against installed bytecode. Cache keys may omit toggled gimmick/form and preserve stale tooltip lines.
4. Complex stochastic field power, chance outcomes, multi-hit/accuracy edge cases, defensive options and current opponent gimmicks need broader exact endpoint differential tests. Current representative tests generally check actual random outcomes lie inside bounds, not exhaustive endpoint equality.
5. Ranges intentionally omit chance criticals/misses, conditional on execution, like native Battle Extras; UI limitations must be explicit. Guaranteed critical test and converted priority test exist.

### Panel

- `FieldStateSync.resync` at choices; ordered snapshot packet remains authoritative, includes players/spectators.
- Small-window/resized bounds clamped; hide when minimum panel cannot fit. Existing design/backdrops unchanged.
- Renderer resource Identifier initialization made lazy so pure layout fixtures do not initialize Minecraft resource codecs.
- Render failure flag resets on disconnect; texture/state reset retained.
- New `test/java/dev/rejuvenation/client/ClientVerification.java`: packet/state/clock/overlay/progression/end/late data, exact percentages/KO, and GUI dimension/log position/1–3 opponent tile grid.

Still review immediate spectator join/resync (currently next choice/update), reconnect, optional Battle Extras load/application, actual rendered layout if fixtures cannot certify it, PvP/doubles ordering. New packet model tests do not certify all native network codecs or actual HUD rendering.

## AI coverage accounting: unfinished

`research/ai-coverage.json` and `research/ai_coverage.py` still contain the OLD method-level counts: **762 total / 164 consumed / 36 measured / 562 strategy**. They are not a per-branch equivalence audit. The new code changes behavior but the audit was not falsely closed.

`research/semantic-reviews.json` AI rows STILL say `excluded_ai_adapter` based on a stale earlier request that deferred AI. Those rows are invalid for the current scope; replace them with actual semantics, disposition, exact reason and test evidence as you review. Do not keep the stale exclusion or simply blanket-mark generic strategies complete.

`research/ai-source-worklist.txt` was generated from the existing audit and used as starting worklist. Review full branch context; single-line leads can have empty recorded bodies and method-level grouping loses intent. Relevant source was read substantially, especially field-disruption and switch-affinity tables, but a comprehensive final semantic review remains unfinished.

Large strategy groups: getMoveScore 254, getSwitchInScoresParty 70, hpGainPerTurn 62, pbStatChangingSwitch 39, plus hazards/removal, protection, setup/stat drops, phazing/pivots, weather/terrain and helpers. Mechanic prediction groups and the 36 measured cases must receive explicit strategic consumption evidence, not mere evaluator availability.

Preserve actual unavailable/custom moves, Crests and after-battle reward exclusions with exact reasons. Investigate any newly provided installed registry IDs. Target ordinary applicable strategy leads: zero pending only after actual closure.

## Highest-priority next actions

1. Resolve decision performance before deploying. Latest 4.46-second full-team fixture is an open defect. Profile and safely reduce repeated native damage/entry/transform calls; memoization must account for statuses, boosts, forms, items, volatiles, side conditions, allies, counter/duration and move/history-dependent mechanics. Current memo key is incomplete (e.g. many volatiles/side conditions/history), so audit correctness, not just speed. Do not silently fall back to native mechanics for applicable field strategy just to meet a time target.
2. Investigate config `multipleMegas: true` versus JS runMegaEvo clearing side flags and Run & Bun's hasUsedMega. Inspect Java restore paths/sanitized requests and add fixtures. Model actual cross-gimmick rules.
3. Complete source semantic review, additional disruption/move/item/team knowledge and long-horizon utility. Current rollout does not fully resolve queued pivot/phazing switch flags, all delayed effects, opponent status/setup choices, doubles partner actions or hidden-information policy. Main reply is the opponent's strongest damaging move; no full minimax requested, but source intent must be preserved.
4. Finish bench previews and specialized gimmick/client cache synchronization; benchmark preview latency.
5. Expand decision-quality tests: field sacrifice vs immediate damage, reserve-friendly transformation, all five timing/resource choices including delaying Mega/Ultra, Tera defensive/offensive/reserve options, Z status and protection, remaining Dynamax turns/G-Max effects, weather/terrain/field interactions, switch hazards/forms, duration expiry and counter thresholds. Validate full state/future log isolation.
6. Finish packet/optional-mixin/ABI/isolated integration certification, then full generation/validation/comparison/oracle/test/build/package pipeline.

## Commands/runtimes

Python executable (the Windows python.exe alias was inaccessible in sandbox):

`C:/Users/Lenovo/AppData/Local/Python/pythoncore-3.12-64/python.exe`

Node: `node` works (`C:/nvm4w/nodejs/node.exe`). Java/javap: `C:/Program Files/Java/jdk-21/bin/`.

Generation/test examples from profile root:

```powershell
& 'C:/Users/Lenovo/AppData/Local/Python/pythoncore-3.12-64/python.exe' rejuvenation/scripts/generate_ai_affinity.py
node rejuvenation/mod/src/test/js/engine.test.cjs
```

Gradle .bat invocation hung once; direct launcher worked reliably:

```powershell
& 'C:/Program Files/Java/jdk-21/bin/java.exe' -cp 'C:/Users/Lenovo/.gradle/wrapper/dists/gradle-8.13-bin/5xuhj0ry160q40clulazy9h7d/gradle-8.13/lib/gradle-launcher-8.13.jar' org.gradle.launcher.GradleMain -p rejuvenation/mod --gradle-user-home rejuvenation/mod/.gradle-home --offline --no-daemon graalTest javaVerification integrationFixtureJar --console=plain
```

Sandbox escalation was required for Gradle's local daemon connection; auto review approved these read/build tests. No approval rejection occurred. Keep filesystem operations in PowerShell, use -LiteralPath because the profile path contains square brackets. No java/node processes remained at the final process check.

`rejuvenation/build.ps1` is existing full pipeline: prepare_build.py, generate.py, validate.py, compare.py, runtime_oracle.py, write_docs.py, Gradle build, package.py. Use the working Python executable/PATH and direct Gradle launcher as needed. Wire new affinity generation and source/AI/preview receipts into reproducible builds. Ruby available previously via local installation; inspect runtime_oracle.py for path handling.

## Artifact/deployment state

No new runtime jar or datapack was deployed during this continuation. Installed `mods/rejuvenation-fields-0.2.0.jar` and `rejuvenation/dist/rejuvenation-fields-0.2.0.jar` remain the prior verified build (1,551,232 bytes, last write 2026-10-05 09:07 local). **They do not contain these new edits.** The existing integration fixture jar was rebuilt as needed by Gradle.

dist/manifest.json and dist datapack ZIP existed with later timestamps; they are old project receipts/content and are not certification of this new source. Versioning/package scripts still hardcode 0.2.0. Before final shipping, rebuild both outputs and update manifest completion scope honestly; its implementationCompletionStandardMet currently describes field runtime closure, not finished AI.

Do not redistribute Ruby game source or external decompilations/jars. Preserve integrity receipts for protected installed mods.

## Required final report when truly complete

Report original/final AI dispositions, implemented/generic strategies and improvements, exact exclusions, performance; per-gimmick implementing mod/API/legality/evaluator/strategy/field tests; preview audited paths/differential counts/display limits; panel lifecycle/optional compatibility tests; simulator/AI/preview/oracle/comparison/Graal/Gradle results; all live launches and why (currently zero); final artifacts and deployed profile paths.

Continue implementation, not just planning, but do not describe this checkpoint as completed or source-equivalent AI.
