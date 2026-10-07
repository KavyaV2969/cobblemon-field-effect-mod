"""Murkwater Surface reskin of COBBLEVERSE's Lt. Surge gym (cobbleverse:ltsurge), shipped as an override datapack.

The original template is read from the installed COBBLEVERSE datapack (never modified). Footprint, size, walls, roof,
furniture, the arena emblem, Surge's trainer spawner and its redstone power, the Battle Positions markers and every block
entity are kept exactly; only materials change and a murky moat is added around the arena ring:
  * moat: water outside the copper arena ring on mud, with waterlogged mangrove roots and lily pads; dry bridges on the
    battle (east-west) and entrance (north-south) axes; never beside redstone, block entities or standing furniture;
  * floor: mud bricks and packed mud instead of smooth stone; lower wall course of mud bricks;
  * corrosion: waxed copper weathered/oxidized, stone bricks partly mossy;
  * murk: dark prismarine instead of the black concrete band, green-tinted windows, mangrove instead of acacia.
Surge's yellow concrete roof and electric fittings stay.

python surge_murkwater_gym.py [--preview DIR]  -> writes datapack/cobbleverse/data/cobbleverse/structure/ltsurge.nbt
"""
from pathlib import Path
import argparse, collections
from structure_nbt import read_source, read_template, write_template, block_name, props

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parent / 'datapacks/COBBLEVERSE-DP-v31.zip'
MEMBER = 'data/cobbleverse/structure/ltsurge.nbt'
OUT = ROOT / 'datapack/cobbleverse/data/cobbleverse/structure/ltsurge.nbt'

def noise(x, y, z, salt=0):
    """Deterministic per-block value in [0, 1) so the pattern is reproducible."""
    h = (x * 73856093) ^ (y * 19349663) ^ (z * 83492791) ^ (salt * 2654435761)
    h = (h ^ (h >> 13)) * 1274126177 & 0xFFFFFFFF
    return (h & 0xFFFF) / 65536

def with_name(state, name):
    _, sep, rest = state.partition('[')
    return name + sep + rest

def keep_props(state, name, allowed=None):
    p = props(state)
    if allowed is not None: p = {k: v for k, v in p.items() if k in allowed}
    return name + ('[' + ','.join(f'{k}={v}' for k, v in sorted(p.items())) + ']' if p else '')

FUNCTIONAL = ('redstone', 'piston', 'button', 'lever', 'trainer_spawner', 'battlepositions', 'healing_machine', 'chest', 'barrel',
              'display_case', 'decorated_pot', 'copper_bulb', 'lamp', 'lightning_rod', 'statue', 'sofa', 'stool', 'table', 'bonsai', 'carpet')

def build():
    name, root, size, blocks, block_nbt = read_template(read_source(f'{SOURCE}::{MEMBER}'))
    original = dict(blocks)
    get = lambda p: blocks.get(p)
    functional = {p for p, s in blocks.items() if any(k in block_name(s) for k in FUNCTIONAL)} | set(block_nbt)

    # ---- moat around the arena ring (floor layer y=1) ------------------------------------------------------------
    ring = {p for p, s in blocks.items() if p[1] == 1 and block_name(s) == 'minecraft:waxed_copper_block'}
    def near(p, cells, r=1):
        return any((p[0] + dx, p[1] + dy, p[2] + dz) in cells for dx in range(-r, r + 1) for dy in range(-r, r + 1) for dz in range(-r, r + 1))
    moat = set()
    for (x, y, z), s in blocks.items():
        if y != 1 or block_name(s) != 'minecraft:smooth_stone': continue
        if not any((x + dx, 1, z + dz) in ring for dx in (-1, 0, 1) for dz in (-1, 0, 1)): continue
        if 11 <= z <= 13 or 12 <= x <= 14: continue                     # dry battle and entrance axes
        if block_name(get((x, 2, z)) or 'minecraft:air') != 'minecraft:air': continue   # something stands here
        if near((x, 1, z), functional): continue                          # keep water off redstone and block entities
        moat.add((x, 1, z))
    for (x, y, z) in moat:
        roots = noise(x, y, z, 1) < 0.2
        blocks[(x, 1, z)] = 'minecraft:mangrove_roots[waterlogged=true]' if roots else 'minecraft:water[level=0]'
        blocks[(x, 0, z)] = 'minecraft:mud'                               # the moat never drains into the ground
        if not roots and noise(x, y, z, 2) < 0.3: blocks[(x, 2, z)] = 'minecraft:lily_pad'

    # ---- materials --------------------------------------------------------------------------------------------------
    copper = ['waxed_copper', 'waxed_exposed_copper', 'waxed_weathered_copper', 'waxed_oxidized_copper']
    def corroded(x, y, z):
        v = noise(x, y, z, 3)
        return copper[0 if v < 0.15 else 1 if v < 0.35 else 2 if v < 0.75 else 3]
    for p, s in list(blocks.items()):
        if p in moat or p in functional or (p[1] == 0 and p[0:3:2] in {(m[0], m[2]) for m in moat}): continue
        n = block_name(s); x, y, z = p; v = noise(x, y, z, 4)
        if n == 'minecraft:smooth_stone' and y <= 1:
            blocks[p] = 'minecraft:packed_mud' if v < 0.3 else 'minecraft:mud_bricks'
        elif n == 'minecraft:white_concrete' and y == 2:
            blocks[p] = 'minecraft:mud_bricks'
        elif n == 'minecraft:black_concrete':
            blocks[p] = 'minecraft:dark_prismarine'
        elif n == 'minecraft:light_blue_stained_glass_pane':
            blocks[p] = with_name(s, 'minecraft:green_stained_glass_pane')
        elif n == 'minecraft:waxed_copper_block':
            c = corroded(x, y, z); blocks[p] = 'minecraft:' + ('waxed_copper_block' if c == 'waxed_copper' else c)
        elif n == 'minecraft:waxed_cut_copper_stairs':
            c = corroded(x, y, z); blocks[p] = with_name(s, 'minecraft:' + c.replace('copper', 'cut_copper_stairs'))
        elif n == 'minecraft:waxed_cut_copper':
            c = corroded(x, y, z); blocks[p] = 'minecraft:' + c.replace('copper', 'cut_copper')
        elif n == 'minecraft:stone_bricks' and v < 0.45:
            blocks[p] = 'minecraft:mossy_stone_bricks'
        elif n == 'minecraft:stone_brick_stairs' and v < 0.45:
            blocks[p] = with_name(s, 'minecraft:mossy_stone_brick_stairs')
        elif n == 'minecraft:stone_brick_slab' and v < 0.45:
            blocks[p] = with_name(s, 'minecraft:mossy_stone_brick_slab')
        elif n == 'minecraft:stripped_acacia_wood':
            blocks[p] = with_name(s, 'minecraft:stripped_mangrove_wood')
        elif n == 'minecraft:acacia_stairs':
            blocks[p] = with_name(s, 'minecraft:mangrove_stairs')
        elif n == 'minecraft:acacia_leaves':
            blocks[p] = keep_props(s, 'minecraft:mangrove_leaves', {'persistent', 'distance', 'waterlogged'})

    # ---- invariants --------------------------------------------------------------------------------------------------
    assert set(original) <= set(blocks), 'positions were removed'
    for p in functional: assert blocks[p] == original[p], f'functional block changed at {p}: {original[p]}'
    assert all(-1 < c < s for p in blocks for c, s in zip(p, size)), 'block outside the template'
    data = write_template(name, root, blocks, block_nbt)
    check = read_template(data)
    assert check[2] == size and check[3] == blocks and set(check[4]) == set(block_nbt)
    return data, size, original, blocks, moat

if __name__ == '__main__':
    a = argparse.ArgumentParser(); a.add_argument('--preview'); o = a.parse_args()
    data, size, original, blocks, moat = build()
    OUT.parent.mkdir(parents=True, exist_ok=True); OUT.write_bytes(data)
    changed = collections.Counter((block_name(original.get(p, 'minecraft:air')), block_name(s)) for p, s in blocks.items() if original.get(p) != s)
    print(f'Wrote {OUT.relative_to(ROOT)}: {len(moat)} moat cells; {sum(changed.values())} blocks changed')
    for (a_, b_), n in changed.most_common(): print(f'  {n:4} {a_} -> {b_}')
    if o.preview:
        from structure_preview import render
        out = Path(o.preview)
        render(size, blocks, out / 'surge-murk.png', scale=14)
        render(size, blocks, out / 'surge-murk-cut4.png', cut=4, yaw=2, scale=14)
        render(size, blocks, out / 'surge-murk-cut2.png', cut=2, yaw=0, scale=14)
