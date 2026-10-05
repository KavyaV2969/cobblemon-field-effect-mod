"""Read, edit, write and preview Minecraft structure templates (.nbt) without external libraries.

A template becomes a dict {(x, y, z): block state string}, e.g. 'minecraft:stone_brick_stairs[facing=east,half=bottom]'.
Unlisted positions are structure voids (left untouched when placed). `write_template` rebuilds the palette.
CLI: python structure_nbt.py layers <file.nbt | pack.zip::member>   prints one character map per Y layer.
"""
import gzip, io, struct, sys, zipfile, collections

# ---- NBT --------------------------------------------------------------------------------------------------------
class Tagged:
    """A value with an explicit NBT tag id (keeps byte/short/list types exact on rewrite)."""
    __slots__ = ('tag', 'value', 'item')
    def __init__(self, tag, value, item=None): self.tag, self.value, self.item = tag, value, item

def _read(f, tag):
    if tag == 1: return Tagged(1, struct.unpack('>b', f.read(1))[0])
    if tag == 2: return Tagged(2, struct.unpack('>h', f.read(2))[0])
    if tag == 3: return Tagged(3, struct.unpack('>i', f.read(4))[0])
    if tag == 4: return Tagged(4, struct.unpack('>q', f.read(8))[0])
    if tag == 5: return Tagged(5, struct.unpack('>f', f.read(4))[0])
    if tag == 6: return Tagged(6, struct.unpack('>d', f.read(8))[0])
    if tag == 7: n = struct.unpack('>i', f.read(4))[0]; return Tagged(7, f.read(n))
    if tag == 8: n = struct.unpack('>H', f.read(2))[0]; return Tagged(8, f.read(n).decode('utf-8'))
    if tag == 9:
        item = f.read(1)[0]; n = struct.unpack('>i', f.read(4))[0]
        return Tagged(9, [_read(f, item) for _ in range(n)], item)
    if tag == 10:
        out = {}
        while True:
            t = f.read(1)[0]
            if t == 0: return Tagged(10, out)
            name = _read(f, 8).value; out[name] = _read(f, t)
    if tag == 11: n = struct.unpack('>i', f.read(4))[0]; return Tagged(11, list(struct.unpack('>%di' % n, f.read(4 * n))))
    if tag == 12: n = struct.unpack('>i', f.read(4))[0]; return Tagged(12, list(struct.unpack('>%dq' % n, f.read(8 * n))))
    raise ValueError(f'Unknown NBT tag {tag}')

def _write(f, t):
    tag, v = t.tag, t.value
    if tag == 1: f.write(struct.pack('>b', v))
    elif tag == 2: f.write(struct.pack('>h', v))
    elif tag == 3: f.write(struct.pack('>i', v))
    elif tag == 4: f.write(struct.pack('>q', v))
    elif tag == 5: f.write(struct.pack('>f', v))
    elif tag == 6: f.write(struct.pack('>d', v))
    elif tag == 7: f.write(struct.pack('>i', len(v))); f.write(v)
    elif tag == 8: b = v.encode('utf-8'); f.write(struct.pack('>H', len(b))); f.write(b)
    elif tag == 9:
        f.write(bytes([t.item if v == [] or t.item is not None else v[0].tag])); f.write(struct.pack('>i', len(v)))
        for x in v: _write(f, x)
    elif tag == 10:
        for name, x in v.items():
            f.write(bytes([x.tag])); _write(f, Tagged(8, name)); _write(f, x)
        f.write(b'\x00')
    elif tag == 11: f.write(struct.pack('>i', len(v))); f.write(struct.pack('>%di' % len(v), *v))
    elif tag == 12: f.write(struct.pack('>i', len(v))); f.write(struct.pack('>%dq' % len(v), *v))
    else: raise ValueError(tag)

def load_nbt(data):
    f = io.BytesIO(gzip.decompress(data)); tag = f.read(1)[0]; name = _read(f, 8).value
    return name, _read(f, tag)

def dump_nbt(name, root):
    f = io.BytesIO(); f.write(bytes([root.tag])); _write(f, Tagged(8, name)); _write(f, root)
    return gzip.compress(f.getvalue(), mtime=0)

# ---- Templates ----------------------------------------------------------------------------------------------------
def state_string(entry):
    name = entry.value['Name'].value; props = entry.value.get('Properties')
    if not props: return name
    return name + '[' + ','.join(f'{k}={v.value}' for k, v in sorted(props.value.items())) + ']'

def state_entry(state):
    name, _, rest = state.partition('[')
    entry = {'Name': Tagged(8, name)}
    if rest:
        entry['Properties'] = Tagged(10, {k: Tagged(8, v) for k, v in (p.split('=') for p in rest.rstrip(']').split(','))})
    return Tagged(10, entry)

def read_source(source):
    if '::' in source:
        archive, member = source.split('::', 1)
        return zipfile.ZipFile(archive).read(member)
    return open(source, 'rb').read()

def read_template(data):
    """Returns (name, root, size, blocks, block_nbt) with blocks {(x,y,z): state} and block entity NBT by position."""
    name, root = load_nbt(data); r = root.value
    palette = (r['palette'] if 'palette' in r else r['palettes'].value[0]).value
    states = [state_string(p) for p in palette]
    blocks, block_nbt = {}, {}
    for b in r['blocks'].value:
        pos = tuple(c.value for c in b.value['pos'].value)
        blocks[pos] = states[b.value['state'].value]
        if 'nbt' in b.value: block_nbt[pos] = b.value['nbt']
    size = tuple(c.value for c in r['size'].value)
    return name, root, size, blocks, block_nbt

def write_template(name, root, blocks, block_nbt):
    """Rebuilds palette and block list from `blocks`; keeps every other root tag (size, entities, DataVersion)."""
    r = dict(root.value)
    palette, index, rows = [], {}, []
    for pos in sorted(blocks, key=lambda p: (p[1], p[2], p[0])):
        state = blocks[pos]
        if state not in index: index[state] = len(palette); palette.append(state_entry(state))
        row = {'pos': Tagged(9, [Tagged(3, c) for c in pos], 3), 'state': Tagged(3, index[state])}
        if pos in block_nbt: row['nbt'] = block_nbt[pos]
        rows.append(Tagged(10, row))
    r.pop('palettes', None)
    r['palette'] = Tagged(9, palette, 10); r['blocks'] = Tagged(9, rows, 10)
    return dump_nbt(name, Tagged(10, r))

def block_name(state): return state.split('[')[0]
def props(state):
    _, _, rest = state.partition('[')
    return dict(p.split('=') for p in rest.rstrip(']').split(',')) if rest else {}

# ---- Previews -----------------------------------------------------------------------------------------------------
SYMBOLS = {'water': '~', 'concrete': '#', 'stone': 's', 'brick': 'b', 'copper': 'c', 'glass': 'g', 'pane': '|',
           'fence': 'f', 'slab': '_', 'stairs': '^', 'lamp': 'L', 'lantern': 'l', 'mud': 'm', 'root': 'r', 'leaves': '*', 'wood': 'w'}
def symbol(state):
    n = block_name(state).split(':')[1]
    if n == 'air': return '.'
    if 'water' in n and 'waterlogged' not in n: return '~'
    for key, ch in SYMBOLS.items():
        if key in n: return ch
    return n[0].upper()

def layers(size, blocks):
    out = []
    for y in range(size[1]):
        rows = [''.join(symbol(blocks[(x, y, z)]) if (x, y, z) in blocks else ' ' for x in range(size[0])) for z in range(size[2])]
        if any(set(r) - {' ', '.'} for r in rows): out.append(f'y={y}\n' + '\n'.join(rows))
    return '\n\n'.join(out)

if __name__ == '__main__':
    if sys.argv[1] == 'layers':
        _, _, size, blocks, _ = read_template(read_source(sys.argv[2]))
        print('size', size); print(layers(size, blocks))
