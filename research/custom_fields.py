"""Build the four custom Minecraft-inspired fields from the canonical inputs in research/custom-fields/*.json.

These fields have no Ruby source: the supplied specifications are their reference, and inherited behaviour is taken from
the already generated parent fields (Indoor for the universal rules, Bewitched for Pale Garden, selected Forest,
Dimensional, Wasteland, Volcanic and Corrosive Mist rows for the fusions). Selectors must match exactly the number of rows
they declare, so a parent change can never silently alter or drop an inherited rule. The original 57 fields and their
Ruby comparison and oracle scope are untouched; custom fields are marked `custom: true`.
"""
from pathlib import Path
import copy, json

ROOT = Path(__file__).resolve().parents[1]
CUSTOM = ROOT / 'research/custom-fields'
GLOBAL_INDOOR_KEYS = ('typeDefinitions', 'typeFlagInteractions', 'environmentAbilities')
OVERLAY_TERRAINS = ['electric_terrain', 'grassy_terrain', 'misty_terrain', 'psychic_terrain']
TYPES = ['Normal', 'Fire', 'Water', 'Electric', 'Grass', 'Ice', 'Fighting', 'Poison', 'Ground', 'Flying', 'Psychic', 'Bug', 'Rock', 'Ghost', 'Dragon', 'Dark', 'Steel', 'Fairy']
INPUT_KEYS = {'schemaVersion', 'id', 'originalId', 'name', 'entryMessage', 'specification', 'base', 'baseExpect', 'hooks', 'types', 'moves',
              'typeComposition', 'terrainPulse', 'accuracyCrash', 'customVolatiles', 'inherit', 'rules', 'seed', 'seedActions', 'mechanics',
              'artwork', 'biomes', 'structures', 'notes'}


def compact(x):
    return json.dumps(x, separators=(',', ':'), ensure_ascii=False)


def load_inputs(directory=None):
    """Canonical inputs, one JSON file per field, read in file-name order (that order is the deterministic build order).

    `directory` defaults to research/custom-fields (the shipped fields). Only that directory's top-level *.json files are read, so the
    authoring kit under custom-fields/_template and _examples never joins the production catalog.
    """
    specs = []
    for path in sorted(Path(directory or CUSTOM).glob('*.json')):
        spec = json.loads(path.read_text(encoding='utf-8'))
        unknown = set(spec) - INPUT_KEYS
        if unknown: raise SystemExit(f'{path.name}: unknown custom field input keys {sorted(unknown)}')
        if spec.get('schemaVersion') != 1: raise SystemExit(f'{path.name}: unsupported schemaVersion')
        if path.stem != spec['id'].split(':')[1]: raise SystemExit(f'{path.name}: file name must equal the field id path')
        specs.append(spec)
    if not specs: raise SystemExit('No custom field inputs found')
    ids = [s['id'] for s in specs]
    if len(set(ids)) != len(ids): raise SystemExit(f'Duplicate custom field ids: {sorted({i for i in ids if ids.count(i) > 1})}')
    return specs


def retarget(value, old, new):
    """A copied field's references to itself (field conditions) must follow the copy, not keep pointing at the parent."""
    if isinstance(value, dict): return {k: retarget(v, old, new) for k, v in value.items()}
    if isinstance(value, list): return [retarget(v, old, new) for v in value]
    return new if value == old else value


def retarget_guards(condition, old, new):
    """Rewrite only `field` guards of a rule condition (the field the rule is active in) from the parent's ID to the copy's ID.

    Action targets, transition destinations and overlay IDs are deliberately left alone: a copied rule that changes *to* its parent must
    keep doing so. A guard written as {"field": "<id>"} or {"field": ["<id>", ...]} is followed through all/any/not groups.
    """
    if isinstance(condition, dict):
        out = {}
        for key, value in condition.items():
            if key == 'field' and isinstance(value, str): out[key] = new if value == old else value
            elif key == 'field' and isinstance(value, list): out[key] = [new if v == old else v for v in value]
            else: out[key] = retarget_guards(value, old, new)
        return out
    if isinstance(condition, list): return [retarget_guards(c, old, new) for c in condition]
    return condition


def parent_references(value, parent_id):
    """Number of places the (retargeted) rows still mention the parent's ID, so a drifting or unintended reference is visible."""
    if isinstance(value, dict): return sum(parent_references(v, parent_id) for v in value.values())
    if isinstance(value, list): return sum(parent_references(v, parent_id) for v in value)
    return 1 if value == parent_id else 0


def select_rules(parent, selector, label, new_id=None):
    """Copy the parent's rules for one event whose compact JSON contains every `contains` text, in the parent's own order.

    `expect` is mandatory and exact: if the parent gains or loses a matching rule, generation stops instead of silently changing the
    inherited behaviour. Guards on the parent's own field ID are retargeted to `new_id` (the new field); any remaining mention of the parent
    ID (for example a transition back to it) must be declared with `keepParentReferences` and its exact count, so it is a decision, not an accident.
    """
    rows = [r for r in parent['rules'] if r['event'] == selector['event'] and all(s in compact(r) for s in selector['contains'])]
    if len(rows) != selector['expect']:
        raise SystemExit(f"{label}: selector {selector} matched {len(rows)} {parent['originalId']} rules, expected {selector['expect']}")
    out = copy.deepcopy(rows)
    if new_id:
        for row in out: row['condition'] = retarget_guards(row['condition'], parent['id'], new_id)
        left = parent_references(out, parent['id'])
        if left != selector.get('keepParentReferences', 0):
            raise SystemExit(f"{label}: selected {parent['originalId']} rules still mention {parent['id']} {left} time(s) after retargeting guards; "
                             f"set keepParentReferences to {left} if that is intended")
    if selector.get('requireGrounded'):
        for row in out:
            row['condition'] = {'all': [row['condition'], {'grounded': {'who': 'user', 'value': True}}]}
            row['source'] += '; custom: grounded users only (Crimson_Forest_Field.md)'
    return out


def inherit(field, spec, parents):
    label = spec['id']
    for block in spec.get('inherit', []):
        parent = parents[block['from']]
        for selector in block.get('rules', []):
            field['rules'].extend(select_rules(parent, selector, label, field['id']))
        for ability in block.get('abilityHandlers', []):
            if ability not in parent.get('abilityHandlers', {}): raise SystemExit(f'{label}: {parent["originalId"]} has no {ability} handler')
            field.setdefault('abilityHandlers', {})[ability] = copy.deepcopy(parent['abilityHandlers'][ability])
        for key in block.get('keys', []):
            if key not in parent: raise SystemExit(f'{label}: {parent["originalId"]} has no {key}')
            field[key] = copy.deepcopy(parent[key])
        if 'moveRows' in block:
            for move in block['moveRows']['moves']:
                row = parent['moves'].get(move)
                if not row: raise SystemExit(f'{label}: {parent["originalId"]} has no move row {move}')
                for key in block['moveRows']['keys']:
                    if key not in row: raise SystemExit(f'{label}: {parent["originalId"]} {move} has no {key}')
                    field['moves'].setdefault(move, {})[key] = row[key]


def terrain_pulse_rule(spec):
    """Terrain Pulse takes the field's mimicry type and doubles its 50 base power (Battle_MoveEffects.rb:8927-8935), unless an overlay terrain decides."""
    kind = spec['terrainPulse']['type']
    return {'event': 'modifyMove',
            'condition': {'all': [{'move': 'terrainpulse'}, {'not': {'any': [{'overlay': 'rejuvenation:' + t} for t in OVERLAY_TERRAINS]}}]},
            'actions': [{'op': 'moveType', 'type': kind}, {'op': 'moveProperty', 'path': 'basePower', 'value': 100, 'removeCallback': 'basePowerCallback'}],
            'source': f'{spec["specification"]}: Mimicry / Camouflage / Terrain Pulse; Battle_MoveEffects.rb:8927-8935'}


def build_one(spec, fields):
    base = copy.deepcopy(fields[spec['base']])
    fid = spec['id']
    if spec['base'] == 'INDOOR':
        for key in GLOBAL_INDOOR_KEYS: base.pop(key, None)
    else:
        base = retarget(base, base['id'], fid)
    for key, expected in spec.get('baseExpect', {}).items():
        if base.get(key) != expected: raise SystemExit(f'{fid}: base {spec["base"]} has {key}={base.get(key)!r}, expected {expected!r}')
    base.update({'id': fid, 'originalId': spec['originalId'], 'name': spec['name'], 'entryMessage': spec['entryMessage'],
                 'custom': True, 'specification': spec['specification']})
    if spec['base'] == 'INDOOR': base.update({'burmyCloak': None, 'statusBuffs': [], 'statusNerfs': []})
    for key, value in spec['hooks'].items(): base[key] = value
    for row in spec.get('types', []):
        if row['type'] not in TYPES: raise SystemExit(f'{fid}: unknown type {row["type"]}')
        base['types'].append({'match': {'moveType': row['type']}, 'condition': {'category': row['category']} if 'category' in row else {'always': True},
                              'multiplier': row['multiplier'], 'message': row['message']})
    for move, row in spec.get('moves', {}).items(): base['moves'].setdefault(move, {}).update(row)
    for key in ('typeComposition', 'accuracyCrash', 'mechanics'):
        if key in spec: base[key] = copy.deepcopy(spec[key])
    if 'customVolatiles' in spec: base.setdefault('customVolatiles', {}).update(copy.deepcopy(spec['customVolatiles']))
    base['seed'] = copy.deepcopy(spec['seed'])
    if spec['seedActions']: base['seedActions'] = copy.deepcopy(spec['seedActions'])
    else: base.pop('seedActions', None)
    return base


def build(fields, specs=None):
    """fields: the generated original fields keyed by Ruby symbol (read only). Returns the custom fields keyed by original ID.

    `specs` are canonical inputs from load_inputs(); by default the shipped research/custom-fields/*.json."""
    specs = specs if specs is not None else load_inputs()
    out = {}
    for spec in specs:
        field = build_one(spec, fields)
        field['rules'].extend(copy.deepcopy(spec.get('rules', [])))
        inherit(field, spec, fields)
        if 'terrainPulse' in spec: field['rules'].append(terrain_pulse_rule(spec))
        out[spec['originalId']] = field
    return out


def mapping_rows(specs=None):
    """Biome and structure rows requested by the custom inputs: (biome id, field id, reason) and structure rows."""
    specs = specs or load_inputs()
    biomes, structures = [], []
    for spec in specs:
        for biome in spec['biomes']: biomes.append((biome, spec['id'], spec['name'].replace(' Field', '') + ' biome'))
        for row in spec['structures']: structures.append({**row, 'field': spec['id']})
    return biomes, structures
