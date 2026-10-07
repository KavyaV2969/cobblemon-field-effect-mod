"""Assemble the authored packs into one catalog the way the mod's loader does (RejuvenationFields.reload + RuleDocuments).

Mapping and structure documents are ordered by their integer `order` (default 0, lower first) and then by resource ID
(`namespace:rejuvenation/<kind>/<file>.json`), never by pack or file-system listing order; rows keep their order inside a document. Other
kinds (fields, notes, items, abilities, trainers) merge by key and a duplicate is an error. Used by validate.py and the test suites.
"""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
PACK_NAMES = ('base', 'cobbleverse')
MAX_ORDER = 1_000_000


def doc_order(doc, where='document'):
    unknown = set(doc) - {'schemaVersion', 'order', 'rules', 'description'}
    if unknown: raise ValueError(f'{where}: unknown rule document key {sorted(unknown)}')
    if not isinstance(doc.get('rules'), list): raise ValueError(f'{where}: rules must be an array')
    order = doc.get('order', 0)
    if isinstance(order, bool) or not isinstance(order, int) or abs(order) > MAX_ORDER: raise ValueError(f'{where}: order must be an integer within +/-{MAX_ORDER}')
    return order


def merge_rules(docs):
    """docs: [(resource id, document)] in any order -> rows ordered by (order, resource id)."""
    keyed = [(doc_order(doc, rid), rid, doc) for rid, doc in docs]
    keyed.sort(key=lambda k: (k[0], k[1]))
    return [row for _, _, doc in keyed for row in doc['rules']]


def pack_dir(name, root=None):
    return Path(root or ROOT) / 'datapack' / name / 'data/rejuvenation/rejuvenation'


def load(packs=PACK_NAMES, root=None):
    """The merged catalog of the named packs: {fields, mappings, structures, items, abilities, trainers, notes, default}."""
    out = {'fields': {}, 'items': {}, 'abilities': {}, 'trainers': {}, 'notes': {}, 'default': 'rejuvenation:indoor'}
    mapping_docs, structure_docs = [], []
    for name in packs:
        base = pack_dir(name, root)
        for p in sorted((base / 'fields').glob('*.json')):
            field = json.loads(p.read_text(encoding='utf-8'))
            if field['id'] in out['fields']: raise ValueError('Duplicate field ' + field['id'])
            out['fields'][field['id']] = field
        for p in sorted((base / 'notes').glob('*.json')):
            doc = json.loads(p.read_text(encoding='utf-8'))
            if doc['field'] in out['notes']: raise ValueError('Duplicate notes for ' + doc['field'])
            out['notes'][doc['field']] = doc
        for kind in ('items', 'abilities', 'trainers'):
            for p in sorted((base / kind).glob('*.json')):
                for k, v in json.loads(p.read_text(encoding='utf-8'))[kind].items():
                    if k in out[kind]: raise ValueError(f'Duplicate {kind[:-1]} {k}')
                    out[kind][k] = v
        for p in sorted((base / 'mappings').glob('*.json')): mapping_docs.append((f'rejuvenation:rejuvenation/mappings/{p.name}', json.loads(p.read_text(encoding='utf-8'))))
        for p in sorted((base / 'structures').glob('*.json')): structure_docs.append((f'rejuvenation:rejuvenation/structures/{p.name}', json.loads(p.read_text(encoding='utf-8'))))
    out['mappings'] = merge_rules(mapping_docs)
    out['structures'] = merge_rules(structure_docs)
    return out
