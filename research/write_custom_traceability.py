"""Requirement-to-test traceability for the four custom fields.

    python research/write_custom_traceability.py [--receipt research/test-results/simulator.json]

Every statement of the four specification documents (docs/spec/custom-fields/*.md) or of an explicit resolution in docs/CUSTOM_FIELDS.md is a
row below: the field, the statement, where it is implemented (canonical input / engine hook) and the tests that exercise it. Tests are
referenced by a unique substring of their name in the simulator suite. The receipt (simulator.json) supplies the result: a row is `pass`
only if every referenced test is in passedTests; a referenced test that did not run is `not-executed`, a failed one `fail`, and a row marked
`unavailable` records content the installed simulator does not offer. Output: docs/reports/custom-field-validation.md and
research/test-results/custom-field-traceability.json. Exits non-zero if a token matches no test or more than one test.
"""
from pathlib import Path
import argparse, hashlib, json, sys

ROOT = Path(__file__).resolve().parents[1]
SPEC = ROOT / 'docs/spec/custom-fields'
IN = 'research/custom-fields/'
DD, CF, WF, PG = 'Deep Dark', 'Crimson Forest', 'Warped Forest', 'Pale Garden'

# (field, statement, implementation, [test tokens], optional status override and note)
ROWS = [
 (DD, 'Biome `minecraft:deep_dark` selects the field', IN + 'deep_dark.json biomes; datapack mappings', ['the four biomes and the required structures map']),
 (DD, 'Ancient City structures (vanilla and Repurposed Structures variants) select the field before every other structure', IN + 'deep_dark.json structures; structure rows are checked first (Java StructureVerification covers the resolver)', ['the four biomes and the required structures map']),
 (DD, 'Dark and Ghost damaging moves 1.5x, with the Deep Dark message', IN + 'deep_dark.json types', ['Deep Dark type multipliers, hooks and Terrain Pulse']),
 (DD, 'Fairy 0.5x; Rock and Ground 1.3x, with their messages', IN + 'deep_dark.json types', ['Deep Dark type multipliers, hooks and Terrain Pulse']),
 (DD, 'Mimicry / Camouflage / Terrain Pulse are Dark; Nature Power is Dark Pulse', IN + 'deep_dark.json hooks, terrainPulse', ['Deep Dark type multipliers, hooks and Terrain Pulse']),
 (DD, 'Secret Power may lower Accuracy with the darkness message', IN + 'deep_dark.json hooks.secretPowerEffects', ['Deep Dark type multipliers, hooks and Terrain Pulse']),
 (DD, 'Sculk Warning is one shared 0-4 counter', 'engine mechanics.sculkWarning (public counter 0)', ['public Warning is synchronized without any team information', 'Warning is battlefield state']),
 (DD, 'Base Power classes: below 90 +0, 90-149 +1, 150+ +2 (exact boundaries 89/90/149/150)', 'engine sculkWarning thresholds (resolved Base Power event value)', ['Base Power classes at the exact boundaries', 'Warning sources are exclusive classes']),
 (DD, 'Sound-based moves +2; explicit seismic/explosive moves +2 (Earthquake, Boomburst, Uproar, Explosion, Self-Destruct, Clanging Scales, Clangorous Soulblaze, ...)', IN + 'deep_dark.json mechanics.sculkWarning.overrides', ['Warning sources are exclusive classes']),
 (DD, 'Warning sources from one move are exclusive, never additive; multi-hit and spread moves count once', 'engine sculkWarning classification', ['Warning sources are exclusive classes', 'Z-Moves and Max Moves classify']),
 (DD, 'Each side may change the Warning once per turn; raising and calming share the allowance; a no-op does not consume it', 'engine custom.allow', ['each side changes Warning once per turn']),
 (DD, 'Calming moves (Calm Mind, Meditate, others) lower by 1 to a minimum of 0; Flash also lowers by 1', IN + 'deep_dark.json mechanics.sculkWarning', ['Warning sources are exclusive classes', 'each side changes Warning once per turn']),
 (DD, 'Execution semantics: a miss, Protect, immunity or absorption still generates Warning; sleep, paralysis, flinch and charging turns do not', 'engine TryMove attribution', ['execution, not outcome, generates Warning', 'a called move classifies by the move that was executed', 'a move that passes TryMove then fails still executed']),
 (DD, 'Magical Seed grants Soundproof, then attempts Warning +1 within the allowance, with both messages', IN + 'deep_dark.json seedActions', ['Magical Seed gives Soundproof in place of the original ability', 'a seed that raises Warning to 4 strikes']),
 (DD, 'Stage messages 1 and 2, then 3 (shriek + darkness) and 4 (tremble + struck back); reset text; darkness receded text', IN + 'deep_dark.json mechanics.sculkWarning.stages', ['milestones are announced in order', 'Warning 4 strikes every active non-immune Pokémon', 'Warning sources are exclusive classes']),
 (DD, 'At Warning >= 3 every accuracy check is x0.9 as a modifier; Keen Eye, Compound Eyes and Illuminate ignore it', IN + 'deep_dark.json rules (accuracy)', ['Darkness multiplies accuracy by 0.9', 'milestones are announced in order']),
 (DD, 'Rattled gains Speed +1 when the Warning genuinely crosses into 3', 'engine sculkWarning (Rattled crossing)', ['milestones are announced in order; Rattled reacts']),
 (DD, 'At Warning 4 every active non-immune Pokemon loses 20% max HP once per turn, then the Warning resets to 1', 'engine sculkWarning retaliation (directDamage)', ['Warning 4 strikes every active non-immune Pokémon', 'retaliation bypasses Substitute', 'retaliation resolves with the action', 'a capped Warning waits']),
 (DD, 'Retaliation immunities: Soundproof, Punk Rock, Solid Rock and current Ghost typing, with messages; immunity never prevents the Pokemon\'s own Warning', IN + 'deep_dark.json mechanics.sculkWarning.exempt', ['retaliation immunities: Soundproof, Punk Rock, Solid Rock']),
 (DD, 'Fainted and hidden (Commander) battlers are not struck', 'engine active-battler iteration', ['Commander-hidden battler is not struck', 'retaliation bypasses Substitute']),
 (DD, 'Switching and fainting never reset the Warning; leaving the field zeroes it', 'engine custom state lifecycle', ['Warning is battlefield state', 'switching and fainting clean per-side counters']),
 (DD, 'Retaliation and Warning damage are environmental and never part of the move\'s preview or KO estimate', 'engine evaluator fieldStrike', ['retaliation, Creaking and Bloodlust damage is never reported as move damage']),
 (DD, 'Mega Evolution, Terastallization and Z/Max Moves work with the Warning rules', 'engine hooks are move-resolution based', ['Mega Evolution, Terastallization and Z-Moves keep the Warning rules', 'Z-Moves and Max Moves classify', 'native hit pipelines on the new fields at both damage-roll endpoints']),
 (CF, 'Biome `minecraft:crimson_forest` selects the field', IN + 'crimson_forest.json biomes', ['the four biomes and the required structures map']),
 (CF, 'Fire, Grass, Poison 1.3x; special Bug 1.2x; Water 0.8x; Ice 0.5x with their messages', IN + 'crimson_forest.json types', ['Crimson Forest type multipliers, move rows and accuracy rows']),
 (CF, 'Special Flying moves gain Poison sub-typing for effectiveness only (no extra same-type bonus)', IN + 'crimson_forest.json typeComposition', ['Crimson Forest sub-typing', 'added Poison and Fire components never add same-type bonus']),
 (CF, 'Power Whip / Vine Whip 1.5x and gain Fire sub-typing (Grass + Fire composition, one STAB)', IN + 'crimson_forest.json moves, typeComposition', ['Crimson Forest sub-typing', 'added Poison and Fire components never add same-type bonus', 'Crimson Forest type multipliers, move rows and accuracy rows']),
 (CF, 'Forest cutting/slashing moves that gain Grass keep those interactions', 'inherited Forest move rows', ['Crimson Forest sub-typing']),
 (CF, 'Pokemon cannot be frozen; Snow (and Hail) end when established', IN + 'crimson_forest.json inherit Volcanic setStatus', ['Fire Spin deals 1/6, Snow and Hail end']),
 (CF, 'Piglin Bloodlust: +1 Attack on a direct opposing KO, stacks with Moxie, multiple KOs, no ally/recoil/status/weather KOs', 'engine mechanics.bloodlust', ['Piglin Bloodlust: +1 Attack per direct opposing knockout', 'Bloodlust ignores recoil, weather and status knockouts']),
 (CF, 'Good as Gold: Speed +1 and Special Attack +1 on entry, with the message', IN + 'crimson_forest.json rules', ['Good as Gold gains +1 Speed']),
 (CF, 'Pay Day 1.5x and Make It Rain 1.3x with their messages', IN + 'crimson_forest.json moves', ['Crimson Forest type multipliers, move rows and accuracy rows', 'every flavor line of the specification is announced']),
 (CF, 'Crimson Vines: positive-priority damaging moves have final accuracy x0.8 (actual resolved priority; never-miss moves exempt)', IN + 'crimson_forest.json rules (finalAccuracy)', ['Crimson Vines scale the final accuracy']),
 (CF, 'A miss caused only by the penalty crashes the user like High Jump Kick; ordinary misses, Protect, immunity and native crash moves never do', 'engine accuracyCrash (native probe)', ['a Crimson Vines crash happens only when the penalty itself caused the miss']),
 (CF, 'Inherited abilities: Grass Pelt, Leaf Guard, Overgrow, Swarm; Effect Spore; Merciless, Poison Heal, Toxic Boost; Flash Fire, Well-Baked Body, Steam Engine; Magma Armor', 'inherited Forest, Corrosive Mist and Volcanic rows', ['Crimson Forest inherits the specified Forest, Corrosive Mist and Volcanic rows', 'Crimson Forest ability effects']),
 (CF, 'Acid Spray / Clear Smog / Smog 1.5x; Barb Barrage / Venoshock double; Toxic and Will-O-Wisp 100% accuracy; Fire Spin 1/6', IN + 'crimson_forest.json moves', ['Crimson Forest type multipliers, move rows and accuracy rows', 'Fire Spin deals 1/6']),
 (CF, 'Mimicry / Camouflage / Terrain Pulse Fire; Nature Power Power Whip; Secret Power may burn; Shelter halves Fire damage', IN + 'crimson_forest.json hooks, customVolatiles', ['Crimson Forest type multipliers, move rows and accuracy rows', 'Shelter halves the field mimicry type']),
 (CF, 'Elemental Seed: Attack +1, Special Attack +1, Speed +1, then Taunt on the holder', IN + 'crimson_forest.json seed', ['Elemental Seed boosts then taunts']),
 (CF, 'Flavor text pool (14 lines)', IN + 'crimson_forest.json messages', ['flavor-text string of the Warped Forest and Crimson Forest specification pools', 'every flavor line of the specification is announced']),
 (WF, 'Biome `minecraft:warped_forest` selects the field', IN + 'warped_forest.json biomes', ['the four biomes and the required structures map']),
 (WF, 'Grass 1.5x, special Bug 1.5x, Dark 1.5x, Ghost 1.2x, Fairy 0.5x, Fire 1.3x, Ice 0.5x, Water 0.8x with messages', IN + 'warped_forest.json types', ['Warped Forest type multipliers, move rows and hooks']),
 (WF, 'Damaging Grass moves gain Dark sub-typing for effectiveness, composed once with the Forest cutters\' Grass; no extra STAB', IN + 'warped_forest.json typeComposition', ['damaging Grass moves gain Dark typing for effectiveness only']),
 (WF, 'Pokemon cannot be frozen; Snow ends when established; weather effects fail', 'inherited Volcanic setStatus + Warped weather rules', ['weather fails in Warped Forest', 'a temporary replacement restores it']),
 (WF, 'Ability effects: Grass Pelt, Leaf Guard, Overgrow, Swarm, Effect Spore, Sap Sipper, Rattled, Unnerve, Poison Heal, Toxic Boost', 'inherited Forest, Dimensional and Wasteland rows', ['Warped Forest inherits the specified Forest, Dimensional and Wasteland rows', 'Warped Forest ability effects']),
 (WF, 'Power Whip / Vine Whip 1.5x; Dark Pulse / Night Daze 1.2x and never miss; Hyperspace Fury/Hole, Shadow Force, Spacial Rend 1.5x', IN + 'warped_forest.json moves', ['Warped Forest type multipliers, move rows and hooks']),
 (WF, 'Leech Seed drains 1/4 max HP each turn (documented resolution: twice the native eighth, within 1 HP of a literal quarter)', IN + 'warped_forest.json rules (receivedDamage)', ['Warped Forest Leech Seed drains 1/4', 'a temporary replacement restores it']),
 (WF, 'Gravity, Magic Room, Trick Room and Wonder Room last a random 3-8 turns; Amplifield Rock does not extend them', 'inherited Dimensional conditionDurations', ['Warped Forest rooms and Gravity last 3 to 8 turns', 'Trick Room, Magic Room, Wonder Room and Gravity last 3 to 8 turns, and an Amplifield Rock']),
 (WF, 'Mimicry / Camouflage / Terrain Pulse Dark; Nature Power Wood Hammer; Secret Power may flinch; Shelter halves Dark damage', IN + 'warped_forest.json hooks', ['Warped Forest type multipliers, move rows and hooks', 'Shelter halves the field mimicry type']),
 (WF, 'Magical Seed: Defense +1, Special Defense +1, Speed -1 and Ingrain', IN + 'warped_forest.json seed', ['Warped Forest Magical Seed']),
 (WF, 'Field replacement and restoration; flavor text pool', 'engine field lifecycle', ['a temporary replacement restores it', 'flavor-text string of the Warped Forest and Crimson Forest specification pools']),
 (PG, 'Biome `minecraft:pale_garden` selects the field (the biome is provided by VanillaBackport, not vanilla 1.21.1)', IN + 'pale_garden.json biomes', ['the four biomes and the required structures map']),
 (PG, 'Bewitched Woods baseline with every parent self-reference retargeted to Pale Garden', IN + 'pale_garden.json base BEWITCHED', ['Pale Garden is Bewitched Woods plus only its explicit overrides', 'inherited Bewitched rules work under the new ID']),
 (PG, 'Fairy 1.5x and super effective on Steel / neutral on Dark; Grass 1.5x; Dark 1.3x and neutral on Fairy; Poison neutral on Grass', 'inherited Bewitched types and typeChart', ['inherited Bewitched rules work under the new ID']),
 (PG, 'Grounded Grass heal 1/16; sleeping Pokemon lose 1/16 (rule keyed to the field ID)', 'inherited Bewitched healing and residual rules', ['inherited Bewitched rules work under the new ID']),
 (PG, 'Effect Spore 60%, Flower Gift always active, Flower Veil affects everyone, Natural Cure heals at end of turn, Pastel Veil, Power Spot 1.5x, Prankster affects Dark', 'inherited Bewitched abilityHandlers', ['Bewitched abilities under the new ID']),
 (PG, 'Hex, Mystical Fire, Spirit Break 1.5x; the beam moves 1.4x; Dark Pulse, Moonblast, Night Daze 1.2x; Forest\'s Curse, Grass/Poison/Sleep/Stun powders, Magic Powder, Moonlight 75%, Strength Sap', 'inherited Bewitched move rows', ['inherited Bewitched rules work under the new ID', 'Pale Garden is Bewitched Woods plus only its explicit overrides']),
 (PG, 'Mirror Beam 1.4x (a Rejuvenation-only move)', 'inherited Bewitched move row `mirrorbeam`', ['Mirror Beam is part of the retained Bewitched move rows'], ('unavailable', 'The installed Showdown has no Mirror Beam, so its effect cannot be exercised; the data row is retained and verified.')),
 (PG, 'Creaking Distraction is a per-side 0-3 counter; a damaging move that connects ticks once per side per turn (doubles included)', 'engine mechanics.creakingDistraction', ['Creaking Distraction is per side', 'the Creaking counts a damaging move that connects']),
 (PG, 'A successfully executed status move fully resets the side\'s counter and keeps its normal effects; the reset never renews the tick', 'engine mechanics.creakingDistraction', ['Creaking Distraction is per side']),
 (PG, 'At 3 every active Pokemon of that side loses 40% max HP as environmental damage, then the counter resets; stage and reset messages', 'engine creakingDistraction (directDamage)', ['the Creaking strikes the side at 3 for 40%', 'the Creaking strike ignores Substitute']),
 (PG, 'Counters are side-specific and public; Shelter halves Fairy damage', 'engine custom state; customVolatiles', ['Pale Garden synchronizes both public counters', 'switching and fainting clean per-side counters']),
 (PG, 'Magical Seed: +6 Defense and petrification (the final explicit statement; Bewitched\'s Special Defense / Ingrain is not applied)', IN + 'pale_garden.json seed, seedActions', ['Pale Garden Magical Seed: Defense +6 and petrification only']),
 ('All four', 'Cached previews and strategy queries spend nothing: no seed, resource or RNG draw; identical to an untouched twin', 'engine evaluate/strategy transactions', ['cached repeated previews and strategy queries leave a battle identical']),
 ('All four', 'Simultaneous battles keep separate custom state; reloads leave running battles on their snapshot', 'per-battle catalog snapshot and custom state', ['simultaneous custom-field battles keep separate counters', 'a catalog reload leaves running custom-field battles']),
 ('All four', 'Custom fields attach, run their mechanics and clean up in Cobblemon\'s shaded Graal runtime', 'GraalVerification / graal-regression.js (110 assertions)', [], ('graal', 'Executed by the graalTest Gradle task; see research/test-results/graal-performance.json')),
 ('All four', 'Planning (Run & Bun style) prices standing risks and leaves the battle untouched', 'engine strategy', ['Deep Dark: calming prices the pending retaliation', 'every custom field plans singles, doubles and all gimmick-bearing candidates']),
]


def resolve(token, names):
    matches = [n for n in names if token in n]
    if len(matches) != 1:
        raise SystemExit(f'token {token!r} matches {len(matches)} tests: {matches[:3]}')
    return matches[0]


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--receipt', default=str(ROOT / 'research/test-results/simulator.json'))
    args = parser.parse_args()
    receipt = json.loads(Path(args.receipt).read_text(encoding='utf-8'))
    names = {'passed': receipt['passedTests'], 'failed': receipt['failedTests']}
    passed, failed = set(names['passed']), set(names['failed'])
    rows, problems = [], []
    for index, row in enumerate(ROWS, 1):
        field, statement, implementation, tokens = row[:4]
        override = row[4] if len(row) > 4 else None
        tests = [resolve(t, names['passed'] + names['failed']) for t in tokens]
        if any(t in failed for t in tests): status = 'fail'
        elif override: status = override[0]
        elif tests and all(t in passed for t in tests): status = 'pass'
        elif not tests: status = 'not-executed'
        else: status = 'not-executed'
        if status == 'fail': problems.append(statement)
        rows.append({'id': f'CF-{index:03d}', 'field': field, 'statement': statement, 'implementation': implementation, 'tests': tests,
                     'status': status, **({'note': override[1]} if override else {})})
    hashes = {p.name: hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(SPEC.glob('*.md'))}
    summary = {s: sum(1 for r in rows if r['status'] == s) for s in ['pass', 'fail', 'unavailable', 'graal', 'not-executed']}
    out = {'specificationHashes': hashes, 'engineSha256': receipt.get('engineSha256'), 'suite': {'passed': receipt['passed'], 'failed': receipt['failed']}, 'summary': summary, 'rows': rows}
    target = ROOT / 'research/test-results/custom-field-traceability.json'
    if target.exists(): target.unlink()
    target.write_text(json.dumps(out, indent=1, ensure_ascii=False) + '\n', encoding='utf-8')
    md = ['# Custom-field validation: requirement to test matrix', '',
          'Generated by `research/write_custom_traceability.py` from `docs/spec/custom-fields/*.md` (hashes below), the installed-simulator suite receipt and the Graal receipt. '
          'All results are **offline simulated playtests** in the installed Showdown simulator and Cobblemon\'s shaded Graal runtime; no live rendered Minecraft or multiplayer session was run.', '',
          '| Status | Meaning |', '|---|---|', '| pass | every referenced test ran and passed |', '| unavailable | content the installed simulator does not offer; reported separately, never counted as a pass |',
          '| graal | executed by the Graal Gradle task (see its receipt) |', '| fail / not-executed | a referenced test failed or did not run |', '',
          f'Summary: {summary}. Simulator suite: {receipt["passed"]} passed, failed={receipt["failed"]}.', '', '## Specification documents', '']
    md += [f'- `{name}` SHA-256 `{h}`' for name, h in hashes.items()]
    md += ['', '## Matrix', '', '| ID | Field | Statement | Implementation | Tests | Status |', '|---|---|---|---|---|---|']
    for r in rows:
        tests = '<br>'.join(t.replace('|', '\\|') for t in r['tests']) or '(see note)'
        status = r['status'] + (f' — {r["note"]}' if r.get('note') else '')
        md.append(f'| {r["id"]} | {r["field"]} | {r["statement"].replace("|", chr(92) + "|")} | {r["implementation"]} | {tests} | {status} |')
    page = ROOT / 'docs/reports/custom-field-validation.md'
    page.parent.mkdir(parents=True, exist_ok=True)
    if page.exists(): page.unlink()
    page.write_text('\n'.join(md) + '\n', encoding='utf-8')
    print(f'{len(rows)} requirements: {summary}')
    if problems: sys.exit('failing requirements: ' + '; '.join(problems))


if __name__ == '__main__':
    main()
