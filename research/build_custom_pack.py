"""Build a loadable data pack from canonical custom-field inputs (the authoring tool).

    python research/build_custom_pack.py <inputs-dir> <output-dir> [--order N] [--check]

Reads every top-level *.json in <inputs-dir> (the same canonical input files research/custom_fields.py builds the shipped custom
fields from), builds each runtime field definition against the generated shipped fields (so `base` and `inherit` can name any
field's `originalId`), and writes a self-contained data pack:

    <output-dir>/pack.mcmeta
    <output-dir>/data/<namespace>/rejuvenation/fields/<field>.json
    <output-dir>/data/<namespace>/rejuvenation/notes/<field>.json
    <output-dir>/data/<namespace>/rejuvenation/mappings/<namespace>_<field>.json      (when the input lists biomes)
    <output-dir>/data/<namespace>/rejuvenation/structures/<namespace>_<field>.json    (when the input lists structures)

It never writes into datapack/ (the shipped packs) and never changes the shipped catalog. --order sets the document order of the mapping files (rows of a
lower order are checked first; see docs/CUSTOM_FIELD_AUTHORING.md). --check builds into memory and fails if <output-dir> differs.
"""
from pathlib import Path
import argparse, json, sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
import custom_fields, field_notes  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
SHIPPED_FIELDS = ROOT / 'datapack/base/data/rejuvenation/rejuvenation/fields'


def shipped():
    """The generated shipped fields keyed by Ruby symbol (`originalId`), read only."""
    out = {}
    for path in sorted(SHIPPED_FIELDS.glob('*.json')):
        field = json.loads(path.read_text(encoding='utf-8'))
        out[field['originalId']] = field
    return out


def where_text(spec):
    parts = []
    names = [b.split(':', 1)[1].replace('_', ' ').title() for b in spec.get('biomes', [])]
    if names: parts.append('Natural battles in ' + ', '.join(names) + '.')
    structures = [(row.get('structure') or row.get('tag')).split(':', 1)[1].split('/')[-1].replace('_', ' ').title() for row in spec.get('structures', [])]
    if structures: parts.append('Battles inside ' + ', '.join(structures) + '.')
    return ' '.join(parts)


def render(inputs, order=None):
    """Return {relative path: JSON text} for the pack."""
    specs = custom_fields.load_inputs(inputs)
    built = custom_fields.build(shipped(), specs)
    files = {'pack.mcmeta': {'pack': {'pack_format': 48, 'description': 'Custom Rejuvenation fields: ' + ', '.join(s['id'] for s in specs)}}}
    for spec in specs:
        field = built[spec['originalId']]
        namespace, path = spec['id'].split(':', 1)
        base = f'data/{namespace}/rejuvenation'
        files[f'{base}/fields/{path}.json'] = field
        files[f'{base}/notes/{path}.json'] = field_notes.custom_document(field, spec, where_text(spec))
        if spec.get('biomes'):
            rules = [{'biome': b, 'field': spec['id'], 'reason': spec['name'].replace(' Field', '') + ' biome'} for b in spec['biomes']]
            files[f'{base}/mappings/{namespace}_{path}.json'] = {'schemaVersion': 1, **({'order': order} if order is not None else {}), 'rules': rules}
        if spec.get('structures'):
            rules = [{**row, 'field': spec['id']} for row in spec['structures']]
            files[f'{base}/structures/{namespace}_{path}.json'] = {'schemaVersion': 1, **({'order': order} if order is not None else {}), 'rules': rules}
    return {name: json.dumps(doc, indent=2, ensure_ascii=False) + '\n' for name, doc in files.items()}


def main():
    parser = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    parser.add_argument('inputs'); parser.add_argument('output'); parser.add_argument('--order', type=int); parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    out = Path(args.output)
    files = render(args.inputs, args.order)
    if args.check:
        drift = [name for name, text in files.items() if not (out / name).is_file() or (out / name).read_text(encoding='utf-8') != text]
        if drift: raise SystemExit('Generated pack differs from ' + str(out) + ': ' + ', '.join(drift))
        print(f'{out} is up to date ({len(files)} files)')
        return
    for name, text in files.items():
        target = out / name
        target.parent.mkdir(parents=True, exist_ok=True)
        if target.exists(): target.unlink()
        target.write_text(text, encoding='utf-8')
    print(f'Wrote {len(files)} files to {out}')


if __name__ == '__main__':
    main()
