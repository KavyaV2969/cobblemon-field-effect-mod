"""Write the integration documentation from current, passing, engine-fingerprinted offline receipts.

Refuses to write when a receipt failed, predates the current engine, or the AI review has pending/ordinary-gap leads.
Outputs: docs/INTEGRATIONS.md , REMAINING_WORK.md,
the generated sections of LIMITATIONS.md, TESTING.md and PERFORMANCE.md, and research/test-results/integration-completion.json.
"""
from pathlib import Path
import json, re, hashlib, collections

ROOT = Path(__file__).resolve().parents[1]
def read(name): return json.loads((ROOT / 'research' / name).read_text(encoding='utf-8'))
def write(name, text): (ROOT / 'docs' / name).write_text(text.strip() + '\n', encoding='utf-8')
def replace_section(path, heading, body):
    """Replace (or append) the generated section that starts at `heading` and ends at the next `## ` heading."""
    text = path.read_text(encoding='utf-8')
    pattern = re.compile(r'(?ms)^' + re.escape(heading) + r'\n.*?(?=^## |\Z)')
    section = heading + '\n\n' + body.strip() + '\n\n'
    text = pattern.sub(lambda _: section, text) if pattern.search(text) else text.rstrip() + '\n\n' + section
    path.write_text(text.rstrip() + '\n', encoding='utf-8')

ai = read('ai-coverage.json'); tests = read('test-results/simulator.json'); java = read('test-results/java-verification.json')
graal = read('test-results/graal-performance.json'); benchmark = read('test-results/strategy-benchmark.json')
oracle = read('test-results/runtime-oracle.json'); audit = read('test-results/ai-prediction-audit.json'); source = read('test-results/ai-source-oracle.json')
comparison = read('source-comparison.json'); abi = read('test-results/mixin-abi.json')
engine_sha = hashlib.sha256((ROOT / 'core/src/main/resources/rejuvenation-engine.js').read_bytes()).hexdigest()
d = ai['dispositions']
assert not tests['failed'] and not d.get('ai_strategy_gap') and not d.get('ai_review_pending'), 'Failing tests or open AI leads'
assert tests.get('engineSha256') == engine_sha, 'Simulator receipt predates the engine'
for name, receipt in [('java', java), ('graal', graal), ('benchmark', benchmark)]:
    assert receipt.get('engineSha256') == engine_sha, f'Stale {name} receipt'
assert not oracle['differences'] and not source['differences'] and not comparison['differences']

counts = '\n'.join(f'| `{k}` | {v} |' for k, v in sorted(d.items(), key=lambda kv: -kv[1]))
strategic = []
for file in (ROOT / 'verification/src/test/js').glob('*.cjs'):
    if file.name.startswith(('strategy-', 'ai-')):
        strategic.extend(re.findall(r"test\('([^']+)'", file.read_text(encoding='utf-8')))
strategic_count = sum(n in tests['passedTests'] for n in strategic)
audit_counts = collections.Counter(r['status'] for r in audit['rows'])
excluded = [r for r in read('semantic-reviews.json') if r['file'] == 'Battle_AI.rb' and r['disposition'] in ('excluded_custom_move', 'unreachable_in_build')]
def label(r): return ('6v6 doubles' if r.get('doubles') else str(r['teamSize'])) + (' turn ' + str(r['turn']) if r.get('turn') else ' fresh')
perf = '\n'.join(f"| {label(r)} | {r['candidates']} / {r['screened']} | {r['phases']['rollouts_count']} | {r['coldMillis']} | {r['warmMedianMillis']} | {r['warmMaxMillis']} |" for r in benchmark['strategy'])
affinity = benchmark.get('processorAffinity')
pinned = (f'The receipt was taken with processor affinity `{affinity}` (performance cores of this hybrid CPU) at high priority.' if affinity
          else 'The receipt was taken without processor pinning; on hybrid CPUs Windows may schedule it on efficiency cores, which roughly triples every figure.')

integration = f'''# Field-aware battle integrations

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

All {ai['leads']} `Battle_AI.rb` field leads carry an individual, source-fingerprinted review with semantics, rationale and passing test evidence (`research/ai-review-decisions.json`, `research/ai-coverage.json`). Ordinary applicable strategy pending: **0**; open strategy gaps: **0**.

| Final disposition | Source leads |
|---|---:|
{counts}

What backs those dispositions:

- **Prediction audit:** {len(audit['rows'])} prediction-versus-mechanic rows. {audit_counts['match']} match; {audit_counts['ai_prediction_differs_from_source_mechanic']} are AI expectations that differ from Rejuvenation's own mechanics, where the engine follows the mechanics; {audit_counts['unreachable']} is unreachable and {audit_counts['unavailable']} unavailable.
- **Project decision preserved:** the Holy field Salt Cure divisor (the source's pre-Champions 1/6, 1/3 for Water or Steel).
- **Generated source ports:** the BESTSKILL switch affinity and `getFieldDisruptScore` tables, checked by a Ruby differential.
- **Ruby differential:** {source['disruptionCases']:,} disruption and {source['affinityCases']:,} affinity cases, {source['differences']} unexpected differences.
- **Intentional correction:** the dead `PERSIHBODY` (Perish Body) typo in the source.

Exclusions, each with a stated reason:

- **{d.get('excluded_custom_move', 0)} unavailable custom-move leads** (Magma Drift, Fever Pitch, Aquabatics). These moves are absent from the installed registry.
- **{d.get('unreachable_in_build', 0)} unreachable leads.** One is guarded by the `Reborn` constant; the others need the Neved jurisdiction story system or in-battle trainer bag items, neither of which exists in Cobblemon.

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

All {java['mixinAbiChecks']} injector/shadow ABI checks pass. This certifies bytecode compatibility, not a full rendered-client run.

## Environment layers, custom fields and Field Notes in the strategy

The strategy values what the rollout cannot see. The rollout itself runs the real turn, so a Deep Dark retaliation or a Pale Garden strike that happens this turn is priced as the HP it costs. On top of that:

- **Standing counter risk.** For fields with a public counter (Deep Dark Warning, Pale Garden Distraction) the lasting value includes what the next strike would cost each side's present Pokémon (exempt Pokémon decided by the simulator's own immunity rule), times the chance the counter gets there. Calming the Warning, resetting a Distraction, or taking a strike on an exempt Pokémon therefore changes a candidate's value, and the sign depends on who is exposed.
- **Dormant substrate.** A layered field keeps 30% of its affinity for the team, so preserving or exposing a favourable substrate counts.
- **Crimson crash risk.** The evaluator reports the chance a priority move misses because of the field's accuracy penalty; the strategy adds that chance times the crash fraction to the deciding move's cost, once, outside the miss branch (which is a plain miss).
- **Declared affinity.** Custom fields have no source party rule, so their affinity comes from their own data: the always-on type multipliers for a Pokémon's types and exemption from the strike. The Ruby-oracle export of the original affinity table is unchanged.
- Previews show only the move's own damage; environmental strikes are recorded separately (`fieldStrike`) and never counted into a displayed range or KO label.

Decision latency with these additions, pinned to the performance cores as above, against the previous receipt (0.48 s for 1v1, 0.69-0.78 s for 6v6, 2.7 s for doubles): see the table below. An A/B run of the shipped engine against a copy without these valuations showed no systematic difference between them; run-to-run noise on this machine is larger than any difference.

## Panel and multiplayer boundary

The 57 attributed backdrops are unchanged; four custom backdrops were added (see [FIELD_PANEL.md](FIELD_PANEL.md)). The panel also opens the clickable [Field Notes](FIELD_NOTES.md) overlay.

- **Lifecycle:** isolated client checks cover entry, replacement, overlay expiry and restoration, destruction, progression, clocks, battle end, late messages and decision invalidation.
- **Layout:** geometry fixtures cover GUI scales, resizing and enhanced, classic and native log bounds.
- **Optional mods:** the core panel does not depend on Battle Extras, and the optional mixin gates are tested with each mod present and absent. Packaging rejects client references in common code.
- **Resync:** every choice request resynchronizes the field panel for participants and reconnecting players, whether or not move previews are enabled.
- **Spectators:** they receive the state at the next field update or choice resync. There is no immediate spectator-join hook, because Cobblemon exposes none.

Full two-client disconnect/rejoin and rendered HUD checks remain separate QA. This continuation required **zero Minecraft launches**.

## Current verification

- **Simulator:** **{tests['passed']}/{tests['passed']}** passing, including **{strategic_count} named AI/strategy tests** plus the source prediction and oracle matrices.
- **Java:**
  - **{java['clientChecks']}** client/preview/panel checks;
  - **{java['environmentChecks']:,}** environment checks;
  - **{java['requestLegalityChecks']}** request-legality, **{java['decisionIdentityChecks']}** decision-identity and **{java['optionalModChecks']}** optional-mod checks;
  - **{java['packetCodecChecks']}** checks of the installed packet codecs, run offline on the Minecraft 1.21.1 profile's own libraries;
  - **{java['mixinAbiChecks']}** mixin ABI checks.
- **Graal:** all **{graal['fieldsAttached']}** fields, **{graal['runtimeAssertions']}** runtime assertions and **{graal['adapterChecks']}** adapter checks on real evaluations; declared abilities restore and the three-dex guard passes.
- **Definitions and Ruby oracle:**
  - definitions: **{comparison['comparisons']:,}** properties, zero differences;
  - Ruby mechanic oracle: **{oracle['defenseCases']:,}** defense and **{oracle['multiplierCases']}** difficulty contexts, zero differences.
- **Build and packaging:** Gradle builds the runtime jar and the isolated integration fixture offline. Packaging verifies the current engine and resources and redistributes no dependency.

Mechanics corrected in this continuation:

- The field-change ×1.3 damage boost (`Battle_Field.rb:568`) is evaluated for the measured hit itself. Previously Icy Dive read the previous action's connect/miss flags.
- Preview hit-count bounds now come from the simulator's real Gen 5+ draw.

## Decision performance

The receipt measures complete synchronous decisions in Cobblemon's shaded, interpreter-only Graal runtime: three single-battle states and a production-shaped worst-case doubles lead, with {benchmark['warmRepetitions']} warm repetitions.

- **Cold column:** {benchmark.get('coldMeaning', 'the first decision in a fresh context')}.
- **Publication warm-up:** catalog publication now runs a throwaway decision and preview ({benchmark.get('publicationWarmupMillis', '?')} ms in this receipt), so the first AI decision of a server no longer pays roughly 3 s of interpreter warm-up.
- **Pinning:** {pinned}

| Decision | Candidates / screened | Rollouts | Cold ms | Warm median ms | Warm max ms |
|---|---:|---:|---:|---:|---:|
{perf}

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

The simulator, Java, Graal and benchmark receipts all fingerprint this engine: `{engine_sha}`.
'''
write('INTEGRATIONS.md', integration)
write('REMAINING_WORK.md', f'''# Remaining QA and extensions

The ordinary field runtime and all {ai['leads']} AI source leads have evidence-backed dispositions, with zero ordinary applicable strategy pending. The offline build runs:

- simulator strategy and preview differentials, and the Ruby oracles;
- Graal, parser/registry and mixin ABI checks;
- packet codec checks and isolated client/server checks;
- the decision benchmark and integration-fixture packaging.

See [INTEGRATIONS.md](INTEGRATIONS.md).

Open items, none blocking the ordinary integration:

1. **Doubles decision latency.** A worst-case doubles lead offering every gimmick variant still takes seconds per decision in the interpreter-only runtime ([INTEGRATIONS.md](INTEGRATIONS.md#decision-performance)). Further reductions would need a cheaper branching model, without weakening the reviewed strategy.
2. **Live multiplayer QA.** Full two-client PvP/spectator reconnect, disconnect ordering and rendered HUD and tooltip checks, including the new effectiveness label hook in a real client. Isolated fixtures certify state, serialization, layout and bytecode ABI; they do not replace a live render.
3. **Live mechanic sampling.** Historical live receipts are fingerprinted to older jars, and this continuation required zero Minecraft launches.
4. **Unavailable content.** Custom Rejuvenation moves, Crests, unavailable form models and post-battle rewards; see [LIMITATIONS.md](LIMITATIONS.md). Revisit only when equivalent installed content exists.
5. **Separate features.** A field details screen, and league extensions beyond the mapped Kanto trainers.
6. **Stronger AI.** Full minimax or opponent-belief modelling would be an optional enhancement over the bounded strategy.

Reproduce everything with `build.ps1` (see [BUILDING.md](BUILDING.md)). Pass `-AffinityMask` to take latency receipts on performance cores.
''')

limits = ROOT / 'docs/LIMITATIONS.md'; text = limits.read_text(encoding='utf-8')
text = re.sub(r"Run & Bun's own evaluator now receives.*?Unconfigured trainer battles remain opt-in and start without a field\.",
              "Run & Bun uses the shared evaluator, a bounded strategic lookahead, generated source field weights, reserve-team utility and a comparison of every legal gimmick. All " + str(ai['leads']) + " AI leads have reviewed dispositions, with zero ordinary applicable strategy pending ([INTEGRATIONS.md](INTEGRATIONS.md)). Its deterministic opponent and chance policy is a bounded heuristic, not exhaustive search. Unconfigured trainer battles remain opt-in and start without a field.", text, flags=re.S)
text = re.sub(r"Battle Extras' move tooltip shows field-modified damage ranges.*?(\n|$)",
              "Battle Extras displays exact server hit ranges, hit counts and HP-based KO labels for active, gimmick and benched switch previews, together with the measured effectiveness, type, category and accuracy. Pending or ambiguous rows are hidden. Ranges that would only be a seeded sample are not displayed: random additional field types, and native random power, damage, called moves or targets. The exact display limits are listed in [INTEGRATIONS.md](INTEGRATIONS.md#battle-extras-11345).\\1", text, flags=re.S)
text = text.replace('Seven real Cobblemon battles on the current jar', 'Seven historical real Cobblemon battles on an earlier, fingerprinted jar')
text = text.replace('An isolated Fabric integrated-server session applies', 'A historical isolated Fabric integrated-server session applies')
text = text.replace('PokÃƒÂ©mon', 'Pokémon').replace('PokÃ©mon', 'Pokémon')
limits.write_text(text, encoding='utf-8')


def _receipt(name):
    path = ROOT / 'research/test-results' / name
    return json.loads(path.read_text(encoding='utf-8')) if path.exists() else None
_rows = []
_r = _receipt('recipe-verification.json')
if _r: _rows.append(f"| Item recipes and textures | {_r['recipes']} recipes through Minecraft's real recipe codec and matcher: {_r['positiveCombinations']} craft combinations, {_r['negativeCases']} rejected cases, PNG pixel equality with the converted source icons |")
_r = _receipt('installation-matrix.json')
if _r: _rows.append(f"| Installation combinations | {_r['checks']} checks over {len(_r['combinations'])} classpath combinations of the two jars and {_r['mixinGateEvaluations']} mixin gate evaluations (offline linkage, not a live game) |")
_r = _receipt('pack-equivalence.json')
if _r: _rows.append(f"| Base + COBBLEVERSE packs versus the former single pack | {_r['environmentSnapshots']:,} environment snapshots and {_r['structureOverlapCases']} structure overlaps resolve identically; {_r['shuffledMerges']} shuffled merges; {len(_r['differences'])} differences |")
_r = _receipt('jar-differential.json')
if _r: _rows.append(f"| Jar differential (0.2.0 monolith vs core + compat) | {_r['classesWithIdenticalDisassembly']} classes with identical disassembly, {_r['resourcesByteIdentical']} resources byte-identical, {_r['moved']} moved, {len(_r['intendedChanges'])} intentional changes, {len(_r['problems'])} unexplained |")
_r = _receipt('authoring-kit.json')
if _r: _rows.append(f"| Authoring kit | {_r['passed']} checks: example behaviour, template acceptance, engine rejection cases, shipped count stays 61 |")
_r = _receipt('custom-field-traceability.json')
if _r: _rows.append(f"| Custom-field traceability | {len(_r['rows'])} specification statements: {_r['summary']} ([report](reports/custom-field-validation.md)) |")
_r = _receipt('latency-comparison.json')
if _r: _rows.append(f"| Latency, baseline vs candidate | warm-median change {min(x['warmChangePercent'] for x in _r['fixtures']):+.1f}% to {max(x['warmChangePercent'] for x in _r['fixtures']):+.1f}% versus the baseline on the same pinned cores ({_r['candidateAffinity']}); no fixture slower by more than 15%: {not _r['flaggedOver15Percent']}. The engine is byte-identical, so a difference reflects machine load, not code |")
extra_rows = chr(10).join(_rows)
testing = ROOT / 'docs/TESTING.md'; text = testing.read_text(encoding='utf-8')
text = re.sub(r"\| Installed simulator regression suite \|[^\n]*", f"| Installed simulator regression suite | {tests['passed']} checks passed | Named regression test for every implemented source lead, plus strategy, preview, singles/doubles, complete turns, simultaneous state and cleanup |", text)
text = re.sub(r"\| Shared evaluation and adapters \|[^\n]*", f"| Shared evaluation and adapters | {graal['adapterChecks']} shaded-Graal adapter checks passed | Production candidate scoring for all five gimmicks; AI and preview corrections, effectiveness certification and random-type suppression on real evaluations |", text)
text = re.sub(r"\| Live performance and AI consumption \|([^\n]*)\| Timings cover[^\n]*", r"| Live performance (historical) |\1| Historical receipt from an earlier jar; it predates the AI review and strategy integration. Current decision latency: [INTEGRATIONS.md](INTEGRATIONS.md#decision-performance) |", text)
text = text.replace("`build.ps1` does not run `research/review_registry.py`; run it after `validate.py` to recheck the semantic register.",
                    "Gradle `check` regenerates the AI review (`ai_review.py`) and validates the semantic register (`review_registry.py`) after the simulator suite.")
testing.write_text(text, encoding='utf-8')
replace_section(testing, '## Current offline receipts', f'''Generated by `research/write_integration_report.py` from the receipts that fingerprint engine `{engine_sha}`.

| Receipt | Result |
|---|---|
| Simulator (`simulator.json`) | {tests['passed']} passed, {strategic_count} named AI/strategy tests |
| AI review (`ai-coverage.json`) | {ai['leads']} leads; {', '.join(f"{k} {v}" for k, v in d.items())} |
| AI prediction audit | {len(audit['rows'])} rows: {', '.join(f"{k} {v}" for k, v in audit_counts.items())} |
| AI Ruby oracle | {source['disruptionCases']:,} disruption / {source['affinityCases']:,} affinity cases, {source['differences']} differences |
| Mechanic Ruby oracle | {oracle['defenseCases']:,} defense / {oracle['multiplierCases']} difficulty contexts, {len(oracle['differences'])} differences |
| Definitions | {comparison['comparisons']:,} properties, {len(comparison['differences'])} differences |
| Java | {java['clientChecks']} client (including the notes overlay), {java['notesServerChecks']} notes (server), {java['structureChecks']} structure selection, {java['environmentChecks']:,} environment, {java['packetCodecChecks']} packet codec, {java['mixinAbiChecks']} mixin ABI, {java['requestLegalityChecks'] + java['decisionIdentityChecks'] + java['optionalModChecks']} request/decision/optional-mod checks |
| Graal | {graal['fieldsAttached']} fields, {graal['runtimeAssertions']} runtime assertions, {graal['adapterChecks']} adapter checks, publication warm-up {graal.get('publicationWarmupMillis', '?')} ms |
| Decision benchmark | see [INTEGRATIONS.md](INTEGRATIONS.md#decision-performance) |
{extra_rows}''')

performance = ROOT / 'docs/PERFORMANCE.md'
replace_section(performance, '## Current strategic decision benchmark', f'''The `strategyBenchmark` receipt measures complete strategy decisions, including opponent utility forecasts and a production-shaped worst-case doubles lead. Historical startup measurements above are separate workloads. Cold: {benchmark.get('coldMeaning', 'first decision in a fresh context')}; publication warm-up {benchmark.get('publicationWarmupMillis', '?')} ms. {pinned}

| Decision | Candidates / screened | Rollouts | Cold ms | Warm median ms | Warm max ms |
|---|---:|---:|---:|---:|---:|
{perf}

{benchmark['warmRepetitions']} warm repetitions; real Cobblemon shaded Graal, interpreter only. Receipt: `research/test-results/strategy-benchmark.json`. Engine SHA-256: `{engine_sha}`.''')

summary = {'engineSha256': engine_sha, 'aiLeads': ai['leads'], 'aiDispositions': d, 'ordinaryAiPending': 0, 'aiExclusions': [{k: r[k] for k in ('line', 'disposition', 'decision')} for r in excluded],
           'namedAiStrategyTests': strategic_count, 'simulatorTests': tests['passed'], 'predictionAudit': dict(audit_counts), 'aiSourceOracle': source,
           'mechanicOracle': {k: oracle[k] for k in ('defenseCases', 'multiplierCases')}, 'definitionComparisons': comparison['comparisons'],
           'java': java, 'mixinMergedTargets': abi.get('mergedTargets', abi.get('merged')), 'graal': graal, 'benchmark': benchmark, 'liveIntegrationReceiptMatchesJar': (lambda r: r.exists() and read('test-results/live-mode-integration.json').get('jarSha256') == hashlib.sha256(next((ROOT / 'dist').glob('rejuvenation-fields-[0-9]*.jar')).read_bytes()).hexdigest())(ROOT / 'research/test-results/live-mode-integration.json')}
(ROOT / 'research/test-results/integration-completion.json').write_text(json.dumps(summary, indent=2) + '\n', encoding='utf-8')
print('Wrote integration reports:', tests['passed'], 'simulator checks;', strategic_count, 'named AI/strategy tests; zero ordinary AI pending; engine', engine_sha[:12])
