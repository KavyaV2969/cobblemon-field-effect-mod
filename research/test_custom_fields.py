"""Unit tests for the custom-field builder and authoring kit (no game, no simulator): python research/test_custom_fields.py

Covers parent-rule selection (exact counts, deterministic order, guard retargeting, drift detection), the canonical input schema applied to the
four shipped inputs plus the template and worked example, the production input directory staying at four fields, and a byte-for-byte
rebuild of the shipped custom fields. Exits non-zero on the first failure and writes research/test-results/custom-fields-unit.json.
"""
from pathlib import Path
import copy, json, sys, traceback
sys.path.insert(0, str(Path(__file__).resolve().parent))
import custom_fields as cf  # noqa: E402
import build_custom_pack  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
FIELDS = ROOT / 'datapack/base/data/rejuvenation/rejuvenation/fields'
results, failures = [], []


def test(fn):
    try:
        fn(); results.append(fn.__name__); print('PASS', fn.__name__)
    except BaseException as error:  # noqa: BLE001
        failures.append(fn.__name__); print('FAIL', fn.__name__); traceback.print_exc()
    return fn


def shipped():
    return build_custom_pack.shipped()


def raises_exit(fn, fragment):
    try: fn()
    except SystemExit as error:
        assert fragment in str(error), f'{fragment!r} not in {error}'
        return
    raise AssertionError('expected SystemExit containing ' + fragment)


@test
def retarget_guards_follows_only_conditions():
    old, new = 'rejuvenation:dimensional', 'example:x'
    condition = {'all': [{'field': old}, {'any': [{'not': {'field': [old, 'rejuvenation:cave']}}, {'overlay': old}, {'move': 'surf'}]}]}
    assert cf.retarget_guards(condition, old, new) == {'all': [{'field': new}, {'any': [{'not': {'field': [new, 'rejuvenation:cave']}}, {'overlay': old}, {'move': 'surf'}]}]}
    assert cf.retarget_guards({'move': 'surf'}, old, new) == {'move': 'surf'}


@test
def selecting_a_parent_rule_retargets_its_guard_and_keeps_order():
    fields = shipped(); parent = fields['DIMENSIONAL']
    selector = {'event': 'residual', 'contains': ['comatose'], 'expect': 1}
    original = [r for r in parent['rules'] if r['event'] == 'residual' and 'comatose' in cf.compact(r)]
    assert len(original) == 1 and parent['id'] in cf.compact(original[0]['condition'])
    chosen = cf.select_rules(parent, selector, 'example:x', 'example:x')
    assert len(chosen) == 1
    assert parent['id'] not in cf.compact(chosen[0]) and 'example:x' in cf.compact(chosen[0]['condition'])
    assert chosen[0]['actions'] == original[0]['actions'] and chosen[0]['source'] == original[0]['source']
    # Without a new ID (legacy callers) the row is copied unchanged.
    assert cf.select_rules(parent, selector, 'x')[0] == original[0]
    # Order of several selected rows is the parent's own rule order, whatever order the selectors name them in.
    forest = fields['FOREST']
    both = [{'event': 'setStatus', 'contains': ['leafguard'], 'expect': 1}, {'event': 'residual', 'contains': ['sapsipper'], 'expect': 1}]
    field = {'rules': [], 'id': 'example:x'}
    cf.inherit(field, {'id': 'example:x', 'inherit': [{'from': 'FOREST', 'rules': both}]}, fields)
    assert [r['event'] for r in field['rules']] == ['setStatus', 'residual'], 'selector order, then parent order within each selector'
    names = [r for r in forest['rules'] if (r['event'], 'leafguard' in cf.compact(r)) == ('setStatus', True)]
    assert field['rules'][0] == names[0]


@test
def parent_id_left_in_actions_must_be_declared():
    fields = shipped(); parent = fields['VOLCANIC']
    selector = {'event': 'afterMove', 'contains': ['"token":"firepledge"'], 'expect': 1}
    raises_exit(lambda: cf.select_rules(parent, selector, 'example:x', 'example:x'), 'keepParentReferences')
    chosen = cf.select_rules(parent, {**selector, 'keepParentReferences': cf.parent_references(cf.select_rules(parent, selector, 'e'), parent['id'])}, 'example:x', 'example:x')
    assert len(chosen) == 1 and parent['id'] in cf.compact(chosen[0]['actions']), 'a declared self-reference (an action target) is preserved, not retargeted'


@test
def parent_drift_is_detected_by_exact_counts():
    fields = shipped(); parent = copy.deepcopy(fields['FOREST'])
    selector = {'event': 'residual', 'contains': ['sapsipper'], 'expect': 1}
    assert len(cf.select_rules(parent, selector, 'x', 'example:x')) == 1
    extra = copy.deepcopy([r for r in parent['rules'] if r['event'] == 'residual' and 'sapsipper' in cf.compact(r)][0])
    parent['rules'].append(extra)
    raises_exit(lambda: cf.select_rules(parent, selector, 'x', 'example:x'), 'matched 2')
    parent['rules'] = [r for r in parent['rules'] if 'sapsipper' not in cf.compact(r)]
    raises_exit(lambda: cf.select_rules(parent, selector, 'x', 'example:x'), 'matched 0')
    wrong_base = {'id': 'example:x', 'originalId': 'X', 'name': 'X', 'entryMessage': '', 'specification': 'X_Field.md', 'base': 'FOREST', 'baseExpect': {'naturePower': 'tackle'},
                  'hooks': {}, 'seed': {'item': 'magicalseed', 'effect': None, 'duration': None, 'message': None, 'stats': {}}, 'seedActions': []}
    raises_exit(lambda: cf.build_one(wrong_base, fields), 'expected')


@test
def whole_field_base_copies_retarget_self_guards():
    fields = shipped(); spec = next(s for s in cf.load_inputs() if s['originalId'] == 'PALEGARDEN')
    built = cf.build_one(spec, fields)
    guards = [r for r in built['rules'] if '"field":"rejuvenation:pale_garden"' in cf.compact(r['condition'])]
    assert guards, 'the inherited sleep-damage rule is guarded by Pale Garden itself'
    assert not any('"field":"rejuvenation:bewitched"' in cf.compact(r['condition']) for r in built['rules'])


@test
def production_inputs_are_exactly_the_four_fields_and_kit_files_are_excluded():
    ids = sorted(s['id'] for s in cf.load_inputs())
    assert ids == ['rejuvenation:crimson_forest', 'rejuvenation:deep_dark', 'rejuvenation:pale_garden', 'rejuvenation:warped_forest'], ids
    assert not (ROOT / 'research/custom-fields/my_field.json').exists() and not (ROOT / 'research/custom-fields/mossy_ruins.json').exists()
    assert (ROOT / 'research/custom-fields/_template/my_field.json').is_file() and (ROOT / 'research/custom-fields/_examples/mossy_ruins.json').is_file()
    assert len(list(FIELDS.glob('*.json'))) == 61
    assert not (FIELDS / 'mossy_ruins.json').exists() and not (FIELDS / 'my_field.json').exists()
    # load_inputs rejects a mismatched file name and unknown keys.
    import tempfile
    with tempfile.TemporaryDirectory() as tmp:
        spec = json.loads((ROOT / 'research/custom-fields/_template/my_field.json').read_text(encoding='utf-8'))
        (Path(tmp) / 'wrong_name.json').write_text(json.dumps(spec)); raises_exit(lambda: cf.load_inputs(tmp), 'file name must equal')
        (Path(tmp) / 'wrong_name.json').unlink()
        (Path(tmp) / 'my_field.json').write_text(json.dumps({**spec, 'surprise': 1})); raises_exit(lambda: cf.load_inputs(tmp), 'unknown custom field input keys')


@test
def template_builds_a_loadable_pack_without_engine_changes():
    files = build_custom_pack.render(ROOT / 'research/custom-fields/_template')
    assert 'data/mypack/rejuvenation/fields/my_field.json' in files and 'data/mypack/rejuvenation/notes/my_field.json' in files
    assert not any('/mappings/' in name or '/structures/' in name for name in files), 'the template maps nothing until biomes/structures are listed'
    field = json.loads(files['data/mypack/rejuvenation/fields/my_field.json'])
    assert field['id'] == 'mypack:my_field' and field['custom'] is True and field['types'][-1]['multiplier'] == 1.2
    again = build_custom_pack.render(ROOT / 'research/custom-fields/_template')
    assert files == again, 'building twice is byte-identical'


@test
def example_pack_is_generated_with_biome_and_structure_documents():
    files = build_custom_pack.render(ROOT / 'research/custom-fields/_examples', order=40)
    mapping = json.loads(files['data/example/rejuvenation/mappings/example_mossy_ruins.json'])
    structure = json.loads(files['data/example/rejuvenation/structures/example_mossy_ruins.json'])
    assert mapping['order'] == 40 and mapping['rules'] == [{'biome': 'minecraft:lush_caves', 'field': 'example:mossy_ruins', 'reason': 'Mossy Ruins biome'}]
    assert structure['rules'][0]['structure'] == 'minecraft:trail_ruins' and structure['rules'][0]['field'] == 'example:mossy_ruins'
    notes = json.loads(files['data/example/rejuvenation/notes/mossy_ruins.json'])
    assert notes['sections'][0]['heading'] == 'Where it appears'


@test
def shipped_custom_fields_rebuild_byte_identically():
    fields = shipped(); built = cf.build({k: v for k, v in fields.items() if not v.get('custom')})
    for original_id, field in built.items():
        path = FIELDS / (field['id'].split(':')[1] + '.json')
        assert json.loads(path.read_text(encoding='utf-8')) == field, field['id']


@test
def canonical_schema_accepts_shipped_inputs_template_and_example_and_rejects_bad_ones():
    try:
        import jsonschema
    except ImportError:
        print('SKIPPED schema validation: the jsonschema package is not installed (pip install jsonschema); this is reported, not passed')
        results.append('canonical_schema_SKIPPED_jsonschema_missing'); return
    schema = json.loads((ROOT / 'research/schema/custom-field.schema.json').read_text(encoding='utf-8'))
    jsonschema.Draft202012Validator.check_schema(schema)
    validator = jsonschema.Draft202012Validator(schema)
    files = sorted((ROOT / 'research/custom-fields').glob('*.json'))
    files += [ROOT / 'research/custom-fields/_template/my_field.json', ROOT / 'research/custom-fields/_examples/mossy_ruins.json']
    for path in files:
        errors = list(validator.iter_errors(json.loads(path.read_text(encoding='utf-8'))))
        assert not errors, f'{path.name}: {errors[0].message[:160]}'
    template = json.loads((ROOT / 'research/custom-fields/_template/my_field.json').read_text(encoding='utf-8'))
    for label, mutate in [('unknown key', lambda d: d.update(surprise=1)), ('bad id', lambda d: d.update(id='My Field')), ('bad type', lambda d: d['types'][0].update(type='Sound')),
                          ('zero multiplier', lambda d: d['types'][0].update(multiplier=0)), ('unknown mechanic', lambda d: d.update(mechanics={'newThing': {}})),
                          ('bad seed item', lambda d: d['seed'].update(item='everstone')), ('missing seed', lambda d: d.pop('seed'))]:
        broken = copy.deepcopy(template); mutate(broken)
        assert list(validator.iter_errors(broken)), f'schema accepted {label}'


if __name__ == '__main__':
    receipt = ROOT / 'research/test-results/custom-fields-unit.json'
    if receipt.exists(): receipt.unlink()
    receipt.write_text(json.dumps({'passed': results, 'failed': failures}, indent=1) + '\n', encoding='utf-8')
    print(f'{len(results)} passed, {len(failures)} failed')
    sys.exit(1 if failures else 0)
