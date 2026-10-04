"""Compare selected semantics with executed local Ruby, not copied expectations.

This certifies two methods only, not complete fields or distributed handlers.
The large Cartesian input and raw result arrays stay in process memory.
"""
from pathlib import Path
import hashlib, itertools, json, subprocess

ROOT = Path(__file__).resolve().parents[1]
source = Path(json.loads((ROOT/'research/source-location.json').read_text())['scripts'])
field_ids = json.loads((ROOT/'research/field-id-map.json').read_text())
types = 'NORMAL FIRE WATER ELECTRIC GRASS ICE FIGHTING POISON GROUND FLYING PSYCHIC BUG ROCK GHOST DRAGON DARK STEEL FAIRY'.split()
type_sets = [[t] for t in types] + [p.split() for p in ['GHOST ICE', 'GHOST FIRE', 'ICE FIRE', 'DARK GHOST', 'NORMAL DRAGON']]
defense = []
for field in field_ids:
    # Baseline across every shipped field, plus exhaustive dependency variations
    # for the fields where fieldDefenseBoost has a branch.
    relevant = field in 'MISTY DARKCRYSTALCAVERN RAINBOW CRYSTALCAVERN DRAGONSDEN NEWWORLD SNOWYMOUNTAIN ICY DESERT DIMENSIONAL FROZENDIMENSION DEUXFINALIS'.split()
    abilities = [None, 'PRISMARMOR', 'PURIFYINGSALT', 'FAIRYAURA', 'AURABREAK', 'DARKAURA'] if relevant else [None]
    attackers = [None, 'BEADSOFRUIN', 'SWORDOFRUIN', 'MEGASOL'] if relevant else [None]
    for ts, ability, airborne, weather, attacker, suppressed, category in itertools.product(
            type_sets, abilities, [False, True], [None, 'HAIL', 'RAINDANCE'], attackers,
            [False, True] if relevant else [False], ['physical', 'special']):
        defense.append([field, ts, ability, airborne, weather, attacker, suppressed, category])
multipliers = list(itertools.product([0, .25, .5, .75, 1, 1.2, 1.33, 1.5, 2, 3], [0, 1, 2], [False, True], [False, True]))
cases = {'defense': defense, 'multipliers': multipliers}
ruby = subprocess.run(['ruby', str(ROOT/'research/runtime_oracle.rb'), str(source)],
                      input=json.dumps(cases), text=True, capture_output=True, check=True)
expected = json.loads(ruby.stdout)
node = subprocess.run(['node', str(ROOT/'mod/src/test/js/source-oracle.cjs')],
                      input=json.dumps({'cases': cases, 'expected': expected}),
                      text=True, capture_output=True)
if node.returncode:
    raise RuntimeError(node.stderr or node.stdout)
result = json.loads(node.stdout)
result['sourceMethods'] = ['PokeBattle_Battler.fieldDefenseBoost', 'PokeBattle_Move.calculateFieldMultiplier']
result['sourceFile'] = str(source/'Battle_Field.rb')
result['sourceSha256'] = hashlib.sha256((source/'Battle_Field.rb').read_bytes()).hexdigest()
result['scope'] = 'Executed Ruby method outputs versus engine conditions/actions and real Showdown power events. Does not certify complete fields.'
(ROOT/'research/test-results/runtime-oracle.json').write_text(json.dumps(result, indent=2)+'\n')
print(f"Source oracle: {result['defenseCases']} defense cases, {result['multiplierCases']} difficulty cases, {len(result['differences'])} differences")
if result['differences']:
    print(json.dumps(result['differences'][:8], indent=2))
    raise SystemExit(1)
