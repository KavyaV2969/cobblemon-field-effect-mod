"""Apply the Murkwater Surge gym reskin to gyms that already generated in a saved world (game must be closed).

For every placed cobbleverse:ltsurge piece (origin and rotation from the world's own structure starts), each position
where the reskin differs from the original template is rewritten only if the world still holds the original block there
(rotated like the piece), so player edits and terrain differences are kept and reported. Positions the original left
empty (the moat's mud bed, lily pads) are written when the world has air there (mud also over natural ground).
Only fully generated chunks are edited (unfinished chunks generate from the installed override template). Block entities,
entities, biomes and heightmaps are untouched; edited chunks are marked for relighting. Each region file is backed up
before it is rewritten. Default is a dry run; pass --apply to write.

python apply_gym_to_world.py "<world>" [--apply] [--backup DIR]
"""
from pathlib import Path
import argparse, datetime, io, json, math, shutil, struct, time, zlib, gzip
from structure_nbt import read_source, read_template, Tagged, _read, _write, state_string, state_entry, block_name, props
from find_structures import starts

ROOT = Path(__file__).resolve().parents[1]
ORIGINAL = f"{ROOT.parent / 'datapacks/COBBLEVERSE-DP-v31.zip'}::data/cobbleverse/structure/ltsurge.nbt"
RESKIN = ROOT / 'datapack/cobbleverse/data/cobbleverse/structure/ltsurge.nbt'
ROT_DIRS = {'NONE': {}, 'CLOCKWISE_90': {'north': 'east', 'east': 'south', 'south': 'west', 'west': 'north'},
            'CLOCKWISE_180': {'north': 'south', 'south': 'north', 'east': 'west', 'west': 'east'},
            'COUNTERCLOCKWISE_90': {'north': 'west', 'west': 'south', 'south': 'east', 'east': 'north'}}

def rotate_pos(p, rotation):
    x, y, z = p
    return {'NONE': (x, y, z), 'CLOCKWISE_90': (-z, y, x), 'CLOCKWISE_180': (-x, y, -z), 'COUNTERCLOCKWISE_90': (z, y, -x)}[rotation]

def rotate_state(state, rotation):
    if rotation == 'NONE' or '[' not in state: return state
    m = ROT_DIRS[rotation]; p = props(state); out = {}
    for k, v in p.items():
        if k == 'facing' and v in m: out[k] = m[v]
        elif k == 'axis' and rotation != 'CLOCKWISE_180' and v in ('x', 'z'): out[k] = 'z' if v == 'x' else 'x'
        elif k in m: out[m[k]] = v                      # side connections of panes, walls and fences
        else: out[k] = v
    return block_name(state) + '[' + ','.join(f'{k}={v}' for k, v in sorted(out.items())) + ']'

# ---- region files -------------------------------------------------------------------------------------------------
class Region:
    def __init__(self, path):
        self.path = path; data = path.read_bytes()
        self.locations = struct.unpack('>1024I', data[:4096]); self.timestamps = list(struct.unpack('>1024I', data[4096:8192]))
        self.payloads = {}
        for i, loc in enumerate(self.locations):
            if not loc: continue
            off = (loc >> 8) * 4096; length = struct.unpack('>i', data[off:off + 4])[0]
            self.payloads[i] = data[off:off + 4 + length]
        self.dirty = {}
    def chunk(self, cx, cz):
        i = (cx & 31) + (cz & 31) * 32
        if i in self.dirty: return self.dirty[i]
        raw = self.payloads.get(i)
        if raw is None: return None
        kind = raw[4]
        if kind & 128: return None                     # stored externally (.mcc): never edited here
        body = raw[5:]; data = zlib.decompress(body) if kind == 2 else gzip.decompress(body) if kind == 1 else body
        f = io.BytesIO(data); tag = f.read(1)[0]; name = _read(f, 8).value; root = _read(f, tag)
        return (i, name, root)
    def mark(self, entry): self.dirty[entry[0]] = entry
    def save(self):
        for i, name, root in self.dirty.values():
            f = io.BytesIO(); f.write(bytes([root.tag])); _write(f, Tagged(8, name)); _write(f, root)
            body = zlib.compress(f.getvalue()); self.payloads[i] = struct.pack('>iB', len(body) + 1, 2) + body
            self.timestamps[i] = int(time.time())
        out = io.BytesIO(); locations = [0] * 1024; sector = 2; chunks = []
        for i in sorted(self.payloads, key=lambda i: self.locations[i] >> 8 if self.locations[i] else 0):
            raw = self.payloads[i]; sectors = math.ceil(len(raw) / 4096)
            if sectors > 255: raise SystemExit(f'{self.path.name}: chunk {i} needs {sectors} sectors (external storage unsupported)')
            locations[i] = sector << 8 | sectors; chunks.append(raw + b'\0' * (sectors * 4096 - len(raw))); sector += sectors
        out.write(struct.pack('>1024I', *locations)); out.write(struct.pack('>1024I', *self.timestamps))
        for c in chunks: out.write(c)
        temporary = self.path.with_name(self.path.name + '.writing'); temporary.write_bytes(out.getvalue())
        check = Region(temporary)
        assert set(check.payloads) == set(self.payloads) and all(check.payloads[i] == self.payloads[i] for i in self.payloads)
        temporary.replace(self.path)

def section_of(root, sy):
    for s in root.value['sections'].value:
        if s.value['Y'].value == sy: return s.value
    return None

def get_block(section, idx):
    bs = section['block_states'].value; palette = bs['palette'].value
    if len(palette) == 1 or 'data' not in bs: return state_string(palette[0])
    bits = max(4, (len(palette) - 1).bit_length()); per = 64 // bits
    word = bs['data'].value[idx // per] & 0xFFFFFFFFFFFFFFFF
    return state_string(palette[(word >> (idx % per) * bits) & ((1 << bits) - 1)])

def set_blocks(section, changes):
    """changes {index: state}; rebuilds the packed array (palette grows as needed, unused entries kept)."""
    bs = section['block_states'].value; palette = bs['palette'].value
    states = [state_string(p) for p in palette]
    if len(palette) == 1 or 'data' not in bs: indices = [0] * 4096
    else:
        bits = max(4, (len(palette) - 1).bit_length()); per = 64 // bits; words = bs['data'].value; indices = []
        for i in range(4096):
            w = words[i // per] & 0xFFFFFFFFFFFFFFFF; indices.append((w >> (i % per) * bits) & ((1 << bits) - 1))
    for idx, state in changes.items():
        if state not in states: states.append(state); palette.append(state_entry(state))
        indices[idx] = states.index(state)
    bits = max(4, (len(palette) - 1).bit_length()); per = 64 // bits; words = []
    for start in range(0, 4096, per):
        w = 0
        for j, v in enumerate(indices[start:start + per]): w |= v << (j * bits)
        words.append(w - (1 << 64) if w >= 1 << 63 else w)
    bs['data'] = Tagged(12, words)

# ---- main -----------------------------------------------------------------------------------------------------------
if __name__ == '__main__':
    a = argparse.ArgumentParser(); a.add_argument('world'); a.add_argument('--apply', action='store_true'); a.add_argument('--backup')
    o = a.parse_args(); world = Path(o.world)
    _, _, size, original, _ = read_template(read_source(ORIGINAL))
    _, _, size2, reskin, _ = read_template(RESKIN.read_bytes())
    assert size == size2
    changes = {p: s for p, s in reskin.items() if original.get(p) != s}
    placements = []
    for region in sorted((world / 'region').glob('r.*.*.mca')):
        for start in starts(region, 'cobbleverse:ltsurge'):
            for piece in start['Children'].value:
                p = piece.value
                placements.append(((p['PosX'].value, p['PosY'].value, p['PosZ'].value), p['rotation'].value, p['BB'].value))
    regions = {}; report = []
    for origin, rotation, bb in placements:
        stats = {'origin': origin, 'rotation': rotation, 'boundingBox': bb, 'written': 0, 'alreadyApplied': 0, 'keptModified': [], 'skippedUnfinishedChunks': set()}
        pending = {}
        for p, new in changes.items():
            dx, dy, dz = rotate_pos(p, rotation); w = (origin[0] + dx, origin[1] + dy, origin[2] + dz)
            pending[w] = (p, rotate_state(original[p], rotation) if p in original else None, rotate_state(new, rotation))
        by_chunk = {}
        for w, row in pending.items(): by_chunk.setdefault((w[0] >> 4, w[2] >> 4), {})[w] = row
        for (cx, cz), rows in by_chunk.items():
            path = world / 'region' / f'r.{cx >> 5}.{cz >> 5}.mca'
            region = regions.get(path) or regions.setdefault(path, Region(path)) if path.exists() else None
            entry = region.chunk(cx, cz) if region else None
            status = entry[2].value.get('Status') if entry else None
            if entry is None or status is None or status.value != 'minecraft:full':
                stats['skippedUnfinishedChunks'].add((cx, cz)); continue
            per_section = {}
            for w, (p, old, new) in rows.items():
                section = section_of(entry[2], w[1] >> 4)
                if section is None: stats['keptModified'].append([w, 'no section']); continue
                idx = ((w[1] & 15) << 8) | ((w[2] & 15) << 4) | (w[0] & 15); current = get_block(section, idx)
                if current == new: stats['alreadyApplied'] += 1; continue
                ok = current == old if old is not None else (current in ('minecraft:air', 'minecraft:cave_air') or (block_name(new) == 'minecraft:mud'))
                if not ok: stats['keptModified'].append([w, current, old]); continue
                per_section.setdefault(w[1] >> 4, {})[idx] = new
            for sy, ch in per_section.items():
                set_blocks(section_of(entry[2], sy), ch); stats['written'] += len(ch)
            if per_section:
                if 'isLightOn' in entry[2].value: entry[2].value['isLightOn'] = Tagged(1, 0)
                region.mark(entry)
        stats['skippedUnfinishedChunks'] = sorted(stats['skippedUnfinishedChunks'])
        report.append(stats)
    for s in report:
        print(f"gym at {s['origin']} ({s['rotation']}): {s['written']} blocks to write, {s['alreadyApplied']} already applied, "
              f"{len(s['keptModified'])} kept (world differs), {len(s['skippedUnfinishedChunks'])} unfinished chunks left to the datapack")
        for k in s['keptModified'][:8]: print('   kept', k)
    dirty = [r for r in regions.values() if r.dirty]
    if not o.apply:
        print(f'Dry run: {len(dirty)} region files would be rewritten:', ', '.join(r.path.name for r in dirty)); raise SystemExit
    backup = Path(o.backup) if o.backup else ROOT.parent / 'backups' / ('surge-murkwater-gym-' + datetime.datetime.now().strftime('%Y%m%d-%H%M%S'))
    (backup / 'region').mkdir(parents=True, exist_ok=False)
    for r in dirty: shutil.copy2(r.path, backup / 'region' / r.path.name)
    for r in dirty: r.save()
    receipt = {'world': str(world), 'backup': str(backup), 'regions': [r.path.name for r in dirty], 'gyms': report,
               'timestamp': datetime.datetime.now(datetime.timezone.utc).isoformat()}
    (backup / 'receipt.json').write_text(json.dumps(receipt, indent=2, default=str) + '\n', encoding='utf-8')
    (ROOT / 'research/test-results/world-gym-reskin.json').write_text(json.dumps(receipt, indent=2, default=str) + '\n', encoding='utf-8')
    print('Applied; backup of the original region files:', backup)
