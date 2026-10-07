"""Isometric and cut-away PNG previews of a structure template (approximate block colours, for design review only).

python structure_preview.py <file.nbt | pack.zip::member> <out.png> [--cut Y] [--yaw 0|1|2|3] [--scale N]
--cut Y hides blocks above layer Y to show interiors.
"""
import sys, argparse
from PIL import Image, ImageDraw
from structure_nbt import read_source, read_template, block_name

COLOURS = [  # first matching keyword wins
    ('water', (40, 70, 60)), ('mud_brick', (140, 105, 80)), ('packed_mud', (142, 107, 80)), ('mud', (60, 50, 45)),
    ('mangrove_roots', (90, 70, 45)), ('mangrove', (115, 50, 45)), ('lily_pad', (40, 120, 40)), ('moss', (90, 110, 50)),
    ('dark_prismarine', (40, 85, 75)), ('prismarine', (95, 160, 145)), ('sculk', (15, 45, 55)),
    ('yellow_concrete', (240, 175, 20)), ('white_concrete', (210, 215, 215)), ('black_concrete', (20, 22, 26)),
    ('gray_concrete', (55, 58, 62)), ('cyan_concrete', (20, 120, 135)), ('green_concrete', (75, 92, 36)), ('brown_concrete', (95, 60, 32)),
    ('lime', (110, 180, 30)), ('green_stained', (80, 110, 40)), ('cyan_stained', (60, 120, 130)), ('light_blue_stained', (100, 150, 210)),
    ('yellow_stained', (220, 200, 60)), ('tinted', (45, 35, 55)), ('glass', (175, 205, 215)),
    ('oxidized', (80, 160, 130)), ('weathered', (100, 150, 110)), ('exposed', (160, 125, 95)), ('copper', (190, 110, 75)),
    ('redstone_lamp', (230, 170, 90)), ('redstone', (170, 20, 10)), ('shroomlight', (240, 150, 70)), ('sea_lantern', (200, 230, 220)),
    ('lantern', (230, 170, 80)), ('chain', (60, 65, 80)), ('quartz', (235, 230, 222)), ('smooth_stone', (160, 160, 160)),
    ('deepslate', (75, 75, 82)), ('stone_brick', (120, 120, 120)), ('cobblestone', (115, 115, 115)), ('stone', (125, 125, 125)),
    ('red_sandstone', (185, 100, 35)), ('acacia_leaves', (100, 140, 40)), ('leaves', (60, 110, 40)), ('acacia', (170, 90, 50)),
    ('dark_oak', (65, 45, 25)), ('spruce', (110, 80, 50)), ('oak', (160, 130, 80)), ('wool', (230, 200, 60)), ('carpet', (230, 200, 60)),
    ('grindstone', (140, 140, 140)), ('fence', (150, 100, 60)), ('iron', (200, 200, 200)), ('slime', (110, 190, 90)),
]
def colour(state):
    name = block_name(state).split(':')[1]
    for key, rgb in COLOURS:
        if key in name: return rgb
    return (200, 0, 200)  # unknown: magenta, so it is noticed

def shade(rgb, f): return tuple(max(0, min(255, int(c * f))) for c in rgb)

def render(size, blocks, out, cut=None, yaw=0, scale=10):
    sx, sy, sz = size
    def rotate(x, z):
        for _ in range(yaw): x, z = sz - 1 - z, x
        return x, z
    w, h = (sx + sz) * scale + 4, (sx + sz) * scale // 2 + sy * scale + 4
    img = Image.new('RGB', (w, h), (28, 30, 34)); d = ImageDraw.Draw(img)
    solid = {p: s for p, s in blocks.items() if block_name(s) not in ('minecraft:air', 'minecraft:structure_void') and (cut is None or p[1] <= cut)}
    keyed = []
    for (x, y, z), s in solid.items():
        rx, rz = rotate(x, z); keyed.append((rx + rz, y, rx, rz, s))
    keyed.sort(key=lambda k: (k[0], k[1]))
    ox = sz * scale + 2
    for _, y, x, z, s in keyed:
        c = colour(s); px = ox + (x - z) * scale; py = (x + z) * scale // 2 + (sy - 1 - y) * scale + 2
        top = [(px, py), (px + scale, py + scale // 2), (px, py + scale), (px - scale, py + scale // 2)]
        left = [(px - scale, py + scale // 2), (px, py + scale), (px, py + 2 * scale), (px - scale, py + 3 * scale // 2)]
        right = [(px + scale, py + scale // 2), (px, py + scale), (px, py + 2 * scale), (px + scale, py + 3 * scale // 2)]
        d.polygon(top, fill=shade(c, 1.0)); d.polygon(left, fill=shade(c, 0.72)); d.polygon(right, fill=shade(c, 0.55))
    img.save(out)

if __name__ == '__main__':
    a = argparse.ArgumentParser(); a.add_argument('source'); a.add_argument('out'); a.add_argument('--cut', type=int); a.add_argument('--yaw', type=int, default=0); a.add_argument('--scale', type=int, default=10)
    o = a.parse_args(); _, _, size, blocks, _ = read_template(read_source(o.source)); render(size, blocks, o.out, o.cut, o.yaw, o.scale)
    unknown = sorted({block_name(s) for s in blocks.values() if colour(s) == (200, 0, 200)})
    if unknown: print('no preview colour:', ', '.join(unknown))
