"""Losslessly convert the five Rejuvenation item icons to Minecraft PNG textures.

The inspected source files are named *.png but are BMP files (48x48, 32 bpp, bottom-up, BI_BITFIELDS with channel masks). They are
decoded exactly (no resampling, no recolouring, orientation corrected only by the BMP row order) and written as real PNG files
(8-bit RGBA, filter 0, zlib level 9, IHDR/IDAT/IEND only, so the output is deterministic).

Inputs: the Rejuvenation reference game directory, from --reference, REJUVENATION_REFERENCE, or a sibling "Rejuvenation 14 copy".
Outputs: assets/rejuvenation/textures/item/<id>.png, assets/rejuvenation/item_icons.json (provenance), textures/item/ATTRIBUTION.txt
and, with --sheet, a source-beside-texture contact sheet for visual review.
"""
from pathlib import Path
import argparse, hashlib, json, os, struct, sys, zlib

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'core/src/main/resources/assets/rejuvenation'
ICONS = {  # registry path -> source file under Graphics/Icons/Item
    'magical_seed': 'magicalseed.png', 'telluric_seed': 'telluricseed.png', 'synthetic_seed': 'syntheticseed.png',
    'elemental_seed': 'elementalseed.png', 'amplifield_rock': 'amplifieldrock.png'}
PNG_SIGNATURE = b'\x89PNG\r\n\x1a\n'


def decode_bmp(data):
    """Return (width, height, rows) with rows top-down, each row a list of (r, g, b, a). Supports 32-bpp BI_RGB / BI_BITFIELDS."""
    if data[:2] != b'BM': raise ValueError('not a BMP file')
    offset, header = struct.unpack_from('<II', data, 10)
    width, height, planes, bpp, compression, _ = struct.unpack_from('<iiHHII', data, 18)
    if planes != 1 or bpp != 32 or compression not in (0, 3): raise ValueError(f'unsupported BMP: bpp={bpp} compression={compression}')
    bottom_up = height > 0
    height = abs(height)
    if compression == 3 and header >= 56: masks = struct.unpack_from('<IIII', data, 54)
    elif compression == 3: masks = struct.unpack_from('<III', data, 54) + (0,)
    else: masks = (0xFF0000, 0xFF00, 0xFF, 0xFF000000)
    shifts = [(m & -m).bit_length() - 1 if m else 0 for m in masks]
    widths = [bin(m).count('1') for m in masks]
    def channel(value, i):
        if not masks[i]: return 255 if i == 3 else 0
        raw = (value & masks[i]) >> shifts[i]
        return raw if widths[i] == 8 else round(raw * 255 / ((1 << widths[i]) - 1))
    rows = []
    for y in range(height):
        base = offset + y * width * 4
        rows.append([tuple(channel(struct.unpack_from('<I', data, base + x * 4)[0], i) for i in range(4)) for x in range(width)])
    if bottom_up: rows.reverse()
    return width, height, rows


def decode_bmp_bytes(data):
    """Second, independent decoder for the verified layout (BGRA bytes); used to cross-check decode_bmp."""
    offset = struct.unpack_from('<I', data, 10)[0]
    width, height = struct.unpack_from('<ii', data, 18)
    rows = []
    for y in range(abs(height)):
        row = data[offset + y * width * 4: offset + (y + 1) * width * 4]
        rows.append([(row[i + 2], row[i + 1], row[i], row[i + 3]) for i in range(0, len(row), 4)])
    if height > 0: rows.reverse()
    return width, abs(height), rows


def png_chunk(kind, payload):
    return struct.pack('>I', len(payload)) + kind + payload + struct.pack('>I', zlib.crc32(kind + payload) & 0xFFFFFFFF)


def encode_png(width, height, rows):
    raw = b''.join(b'\x00' + b''.join(bytes(p) for p in row) for row in rows)
    return PNG_SIGNATURE + png_chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)) + \
        png_chunk(b'IDAT', zlib.compress(raw, 9)) + png_chunk(b'IEND', b'')


def decode_png(data):
    """Minimal PNG reader for 8-bit RGBA non-interlaced images (all five outputs); verifies CRCs and applies every row filter."""
    if data[:8] != PNG_SIGNATURE: raise ValueError('bad PNG signature')
    pos, idat, width = 8, b'', None
    while pos < len(data):
        length, kind = struct.unpack_from('>I4s', data, pos)
        payload = data[pos + 8:pos + 8 + length]
        if zlib.crc32(kind + payload) & 0xFFFFFFFF != struct.unpack_from('>I', data, pos + 8 + length)[0]: raise ValueError('bad chunk CRC ' + kind.decode())
        if kind == b'IHDR': width, height, depth, color, _, _, interlace = struct.unpack('>IIBBBBB', payload); assert (depth, color, interlace) == (8, 6, 0)
        elif kind == b'IDAT': idat += payload
        pos += 12 + length
    raw, stride, rows, previous = zlib.decompress(idat), width * 4, [], bytearray(width * 4)
    for y in range(height):
        kind, line = raw[y * (stride + 1)], bytearray(raw[y * (stride + 1) + 1:(y + 1) * (stride + 1)])
        for i in range(stride):
            a = line[i - 4] if i >= 4 else 0; b = previous[i]; c = previous[i - 4] if i >= 4 else 0
            if kind == 1: line[i] = (line[i] + a) & 255
            elif kind == 2: line[i] = (line[i] + b) & 255
            elif kind == 3: line[i] = (line[i] + (a + b) // 2) & 255
            elif kind == 4:
                p = a + b - c; pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                line[i] = (line[i] + (a if pa <= pb and pa <= pc else b if pb <= pc else c)) & 255
        rows.append([tuple(line[x * 4:x * 4 + 4]) for x in range(width)]); previous = line
    return width, height, rows


def contact_sheet(pairs, scale=4):
    """Rows of [source | texture] on a checkerboard, enlarged by nearest-neighbour for review only."""
    cell = 48 * scale; gap = 8; width = cell * 2 + gap * 3; height = (cell + gap) * len(pairs) + gap
    canvas = [[(60, 60, 60, 255)] * width for _ in range(height)]
    def blit(rows, ox, oy):
        for y in range(48 * scale):
            for x in range(48 * scale):
                r, g, b, a = rows[y // scale][x // scale]
                bg = 200 if ((x // 8) + (y // 8)) % 2 else 150
                canvas[oy + y][ox + x] = (round(r * a / 255 + bg * (255 - a) / 255), round(g * a / 255 + bg * (255 - a) / 255), round(b * a / 255 + bg * (255 - a) / 255), 255)
    for i, (src, out) in enumerate(pairs):
        blit(src, gap, gap + i * (cell + gap)); blit(out, gap * 2 + cell, gap + i * (cell + gap))
    return encode_png(width, height, canvas)


def find_reference(explicit):
    sys.path.insert(0, str(Path(__file__).resolve().parent))
    import source_path
    if explicit and (Path(explicit) / 'Graphics/Icons/Item').is_dir(): return Path(explicit)
    root = source_path.reference_root()
    if root is None or not (root / 'Graphics/Icons/Item').is_dir(): raise SystemExit('Rejuvenation reference directory not found; pass --reference or set REJUVENATION_REFERENCE')
    return root


def main():
    parser = argparse.ArgumentParser(description=__doc__.split('\n')[0])
    parser.add_argument('--reference'); parser.add_argument('--sheet', help='write a contact sheet PNG to this path')
    args = parser.parse_args()
    game = find_reference(args.reference)
    out_dir = ASSETS / 'textures/item'; out_dir.mkdir(parents=True, exist_ok=True)
    manifest, pairs = {}, []
    for item, source_name in ICONS.items():
        source = game / 'Graphics/Icons/Item' / source_name
        data = source.read_bytes()
        w, h, rows = decode_bmp(data)
        assert (w, h) == (48, 48), (source_name, w, h)
        assert (w, h, rows) == decode_bmp_bytes(data), f'{source_name}: decoders disagree'
        png = encode_png(w, h, rows)
        assert decode_png(png) == (w, h, rows), f'{item}: PNG round trip differs'
        target = out_dir / f'{item}.png'
        if target.exists(): target.unlink()
        target.write_bytes(png)
        manifest[f'rejuvenation:{item}'] = {'texture': f'rejuvenation:item/{item}', 'sourceFile': f'Graphics/Icons/Item/{source_name}',
            'sourceFormat': 'BMP (BI_BITFIELDS, 32-bit BGRA, bottom-up) despite the .png extension', 'sourceSha256': hashlib.sha256(data).hexdigest(),
            'sourceBytes': len(data), 'size': [w, h], 'rgbaSha256': hashlib.sha256(b''.join(bytes(px) for row in rows for px in row)).hexdigest(),
            'sha256': hashlib.sha256(png).hexdigest(), 'bytes': len(png),
            'transparentPixels': sum(1 for r in rows for p in r if p[3] == 0), 'partiallyTransparentPixels': sum(1 for r in rows for p in r if 0 < p[3] < 255)}
        pairs.append((rows, rows))
    credit = ('Item icons from Pokémon Rejuvenation V14 (Graphics/Icons/Item), a fan game by Janichroma (lead developer) and the Rejuvenation team; '
              "art credited in the game's ReadMe_Credits.txt to Zumi (Honnojis), Janichroma, Crimson, CeriseBlossome, Winter, Azeria, Dallas, "
              'Soulja, IronicOmens and MoonPaw. Pokémon is © Nintendo, Creatures Inc. and GAME FREAK inc.')
    basis = ('Redistribution basis: the project owner states this is a non-commercial fan mod for the game and that its use of these game icons '
             'is allowed as such. No written permission from the Rejuvenation team is on file; see THIRD_PARTY.md. Remove the five '
             'files if that basis is withdrawn.')
    method = ('Decoded the BMP pixel data exactly (channel masks honoured, bottom-up rows flipped) and re-encoded them as 8-bit RGBA PNG; no '
              'resampling, recolouring or redrawing. Reproduce with research/convert_item_icons.py.')
    (ASSETS / 'item_icons.json').write_text(json.dumps({'description': 'Held-item icons converted losslessly from Pokémon Rejuvenation 14.', 'credit': credit,
        'basis': basis, 'method': method, 'items': manifest}, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    (out_dir / 'ATTRIBUTION.txt').write_text(credit + '\n\n' + basis + '\n\n' + method + '\n\nSee ../../item_icons.json for each source file, SHA-256 and output hash.\n', encoding='utf-8')
    if args.sheet:
        sheet = Path(args.sheet); sheet.parent.mkdir(parents=True, exist_ok=True)
        decoded = [(decode_bmp((game / 'Graphics/Icons/Item' / s).read_bytes())[2], decode_png((out_dir / f'{i}.png').read_bytes())[2]) for i, s in ICONS.items()]
        sheet.write_bytes(contact_sheet(decoded))
    print(f'Converted {len(ICONS)} icons from {game}')


if __name__ == '__main__':
    main()
