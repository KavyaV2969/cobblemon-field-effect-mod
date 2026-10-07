"""Prove that the base + COBBLEVERSE packs resolve exactly like the former single datapack.

    python research/compare_split.py [--baseline research/baseline/monolith-rules.json]

The baseline holds the ordered mapping rows, structure rows and trainer bindings of the 0.2.0 monolith. This script
  * checks the merged rows are the same rows (multiset) and the same trainer bindings,
  * resolves a large grid of environment snapshots (every mapped biome, an unmapped one, every dimension, depths, sky visibility, heights, every
    single biome tag and combinations, submerged) and a grid of structure hits (every row alone and every pair, with and without containment
    confirmation) with the monolith's row order and with the merged order, and requires identical fields, substrates and reasons,
  * repeats the merge with the documents listed in shuffled orders (the loader must not depend on listing or pack order),
  * validates that the base alone names no third-party biome, structure or tag.
It mirrors EnvironmentResolver.resolve (Rule.matches, underwater stage, structure rows by index, first matching biome row, default).
Writes research/test-results/pack-equivalence.json and exits non-zero on any difference.
"""
from pathlib import Path
import argparse, hashlib, itertools, json, random, sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'research'))
import catalog_io, provider_map  # noqa: E402


def matches(row, s):
    return ((row.get('biome') is None or row['biome'] == s['biome']) and (row.get('tag') is None or row['tag'] in s['tags'])
            and (row.get('dimension') is None or row['dimension'] == s['dimension']) and (row.get('submerged') is None or row['submerged'] == s['submerged'])
            and (row.get('maxY') is None or s['y'] <= row['maxY']) and (row.get('minDepth') is None or s['depth'] >= row['minDepth'])
            and (row.get('skyVisible') is None or row['skyVisible'] == s['sky']))


def resolve(s, mappings, structures):
    if s['submerged']:
        for row in mappings:
            if row.get('submerged') is True and matches(row, s): return ('underwater', row['field'], None, row['reason'])
    for i, row in enumerate(structures):
        for hit in s['structures']:
            if hit['row'] in (None, i) and ((row.get('structure') == hit['id']) if 'structure' in row else (row['tag'] in hit['tags'])):
                return ('structure', row['field'], None, row['reason'] + hit['id'])
    for row in mappings:
        if row.get('submerged') is True: continue
        if matches(row, s): return ('biome', row['field'], row.get('substrate'), row['reason'])
    return ('fallback', 'rejuvenation:indoor', None, '')


def main():
    parser = argparse.ArgumentParser(); parser.add_argument('--baseline', default=str(ROOT / 'research/baseline/monolith-rules.json'))
    parser.add_argument('--installed-pack', help='glob of the installed 0.2.0 monolithic field data pack zip to compare byte for byte')
    args = parser.parse_args()
    baseline = json.loads(Path(args.baseline).read_text(encoding='utf-8'))
    merged = catalog_io.load()
    problems = []
    canon = lambda rows: sorted(json.dumps(r, sort_keys=True) for r in rows)
    if canon(baseline['mappings']) != canon(merged['mappings']): problems.append('mapping rows differ from the monolith')
    if canon(baseline['structures']) != canon(merged['structures']): problems.append('structure rows differ from the monolith')
    if baseline['trainers']['trainers'] != merged['trainers']: problems.append('trainer bindings differ')
    old_map, new_map, old_st, new_st = baseline['mappings'], merged['mappings'], baseline['structures'], merged['structures']
    biomes = sorted({r['biome'] for r in old_map if 'biome' in r}) + ['minecraft:unmapped_test_biome', 'terralith:unmapped_test_biome']
    tags = sorted({r['tag'] for r in old_map if 'tag' in r})
    tagsets = [frozenset()] + [frozenset([t]) for t in tags] + [frozenset(c) for c in itertools.combinations(tags, 2)] + [frozenset(tags)]
    dimensions = sorted({r['dimension'] for r in old_map if 'dimension' in r} | {'minecraft:overworld', 'some:other_dimension'})
    grid = 0
    for biome, dim, depth, sky, y, submerged, tagset in itertools.product(biomes, dimensions, (0, 12, 60), (True, False), (70, -8, 0), (False, True), tagsets):
        if depth and sky: continue   # a position below the surface cannot see the sky
        if submerged and (depth or not sky): continue
        s = {'biome': biome, 'dimension': dim, 'depth': depth, 'sky': sky, 'y': y, 'submerged': submerged, 'tags': tagset, 'structures': []}
        grid += 1
        if resolve(s, old_map, old_st) != resolve(s, new_map, new_st): problems.append('environment differs: ' + json.dumps({**s, 'tags': sorted(tagset)})); break
    # Structure hits: each row alone, every pair of rows (the overlap case), with and without a containment confirmation index.
    def hit_for(row, index): return {'id': row.get('structure') or 'x:' + row['tag'].replace(':', '_'), 'tags': {row['tag']} if 'tag' in row else set(), 'row': index}
    all_rows = old_st
    structure_cases = 0
    for a, b in itertools.product(range(len(all_rows)), repeat=2):
        base_snapshot = {'biome': 'minecraft:plains', 'dimension': 'minecraft:overworld', 'depth': 0, 'sky': True, 'y': 70, 'submerged': False, 'tags': frozenset()}
        for confirmed in (False, True):
            def snapshot(rows):
                hits = []
                for row in (all_rows[a], all_rows[b]):
                    hits.append({'id': row.get('structure') or 'x:' + row['tag'].replace(':', '_'), 'tags': {row['tag']} if 'tag' in row else set(),
                                 'row': (rows.index(row) if confirmed and row in rows else None)})
                return {**base_snapshot, 'structures': hits}
            structure_cases += 1
            if resolve(snapshot(old_st), old_map, old_st)[1] != resolve(snapshot(new_st), new_map, new_st)[1]: problems.append(f'structure overlap differs: rows {a},{b} confirmed={confirmed}')
    # Listing order must not matter.
    docs = []
    for name in catalog_io.PACK_NAMES:
        for kind in ('mappings', 'structures'):
            for p in sorted((catalog_io.pack_dir(name) / kind).glob('*.json')):
                docs.append((kind, f'rejuvenation:rejuvenation/{kind}/{p.name}', json.loads(p.read_text(encoding='utf-8'))))
    rng = random.Random(20261007)
    for _ in range(200):
        rng.shuffle(docs)
        for kind, expected in (('mappings', new_map), ('structures', new_st)):
            if catalog_io.merge_rules([(rid, d) for k, rid, d in docs if k == kind]) != expected: problems.append('merge depends on listing order'); break
    installed = None
    if args.installed_pack:
        import glob, zipfile
        found = sorted(glob.glob(args.installed_pack))
        if not found: problems.append('installed pack not found: ' + args.installed_pack)
        else:
            z = zipfile.ZipFile(found[0]); prefix = 'data/rejuvenation/rejuvenation/'; compared = 0
            for name in z.namelist():
                if not name.startswith(prefix) or name.endswith('/'): continue
                rel = name[len(prefix):]; kind = rel.split('/')[0]
                if kind in ('fields', 'notes', 'items', 'abilities'):
                    target = catalog_io.pack_dir('base') / rel; compared += 1
                    if not target.exists() or target.read_bytes() != z.read(name): problems.append('installed 0.2.0 file differs from the regenerated base: ' + rel)
                elif rel == 'mappings/modpack.json':
                    if json.loads(z.read(name))['rules'] != baseline['mappings']: problems.append('installed mapping rows differ from the recorded baseline rows')
                elif rel == 'structures/vanilla.json':
                    if json.loads(z.read(name))['rules'] != baseline['structures']: problems.append('installed structure rows differ from the recorded baseline rows')
                elif rel == 'trainers/kanto.json':
                    if json.loads(z.read(name))['trainers'] != merged['trainers']: problems.append('installed trainer bindings differ')
            installed = {'pack': Path(found[0]).name, 'sha256': hashlib.sha256(Path(found[0]).read_bytes()).hexdigest(), 'filesComparedByteForByte': compared}
    # The base alone names nothing third-party.
    base_only = catalog_io.load(('base',))
    for row in base_only['mappings']:
        if provider_map.mapping_segment(row)[0] != provider_map.BASE: problems.append('base mapping row needs another provider: ' + json.dumps(row)[:100])
    for row in base_only['structures']:
        if provider_map.structure_pack(row)[0] != provider_map.BASE: problems.append('base structure row needs another provider: ' + json.dumps(row)[:100])
    if base_only['trainers']: problems.append('the base pack must not bind trainers')
    receipt = {'environmentSnapshots': grid, 'structureOverlapCases': structure_cases, 'mappingRows': {'monolith': len(old_map), 'merged': len(new_map), 'baseOnly': len(base_only['mappings'])},
               'structureRows': {'monolith': len(old_st), 'merged': len(new_st), 'baseOnly': len(base_only['structures'])}, 'trainers': len(merged['trainers']),
               'shuffledMerges': 200, 'installed0_2_0': installed, 'differences': problems[:20]}
    out = ROOT / 'research/test-results/pack-equivalence.json'
    if out.exists(): out.unlink()
    out.write_text(json.dumps(receipt, indent=1) + '\n', encoding='utf-8')
    print(json.dumps({k: v for k, v in receipt.items() if k != 'differences'}), 'differences:', len(problems))
    if problems:
        print('\n'.join(problems[:10])); sys.exit(1)


if __name__ == '__main__':
    main()
