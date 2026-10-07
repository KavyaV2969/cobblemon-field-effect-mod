"""Read-only scan of a world's region files for generated structure starts (e.g. cobbleverse:ltsurge).

Prints each start's pieces with bounding box, rotation and template origin, nearest to the player first, plus the
`/place template` command that re-places the template on the same spot. Never writes to the world.
python find_structures.py "<world folder>" cobbleverse:ltsurge [--radius-regions N]
"""
import sys, zlib, struct, math, argparse
from pathlib import Path
from structure_nbt import load_nbt, _read
import gzip, io

def chunk_nbt(raw):
    length, kind = struct.unpack('>iB', raw[:5]); body = raw[5:4 + length]
    data = zlib.decompress(body) if kind == 2 else gzip.decompress(body) if kind == 1 else body
    f = io.BytesIO(data); tag = f.read(1)[0]; _read(f, 8); return _read(f, tag).value

def starts(region, wanted):
    data = region.read_bytes()
    if len(data) < 8192: return
    for i in range(1024):
        loc = struct.unpack('>I', data[i * 4:i * 4 + 4])[0]
        if not loc: continue
        offset, sectors = (loc >> 8) * 4096, loc & 0xFF
        try: chunk = chunk_nbt(data[offset:offset + sectors * 4096])
        except Exception: continue
        s = chunk.get('structures')
        if not s: continue
        for sid, start in s.value['starts'].value.items():
            if sid == wanted and start.value.get('id', None) and start.value['id'].value != 'INVALID':
                yield start.value

ROT = {'NONE': 'none', 'CLOCKWISE_90': 'clockwise_90', 'CLOCKWISE_180': '180', 'COUNTERCLOCKWISE_90': 'counterclockwise_90'}
if __name__ == '__main__':
    a = argparse.ArgumentParser(); a.add_argument('world'); a.add_argument('structure'); a.add_argument('--radius-regions', type=int, default=6)
    o = a.parse_args(); world = Path(o.world)
    level = load_nbt((world / 'level.dat').read_bytes())[1].value['Data'].value
    player = level.get('Player'); pos = [t.value for t in player.value['Pos'].value] if player else [0, 0, 0]
    rx, rz = int(pos[0]) >> 9, int(pos[2]) >> 9
    found = []
    for region in sorted((world / 'region').glob('r.*.*.mca')):
        _, x, z, _ = region.name.split('.')
        if abs(int(x) - rx) > o.radius_regions or abs(int(z) - rz) > o.radius_regions: continue
        for start in starts(region, o.structure):
            for piece in start['Children'].value:
                p = piece.value; bb = p['BB'].value
                found.append((math.dist((pos[0], pos[2]), ((bb[0] + bb[3]) / 2, (bb[2] + bb[5]) / 2)), p, bb))
    print('player at', [round(c) for c in pos])
    for d, p, bb in sorted(found, key=lambda r: r[0]):
        rot = p.get('rotation'); rot = rot.value if rot else None
        origin = [p[k].value for k in ('PosX', 'PosY', 'PosZ')] if 'PosX' in p else [p[k].value for k in ('pos_x', 'pos_y', 'pos_z')] if 'pos_x' in p else None
        keys = sorted(p.keys())
        print(f'distance {d:7.0f}  BB {bb}  rotation {rot}  origin {origin}  keys {keys}')
