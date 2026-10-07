"""Which pack a mapping row belongs to: classified by the mod that actually provides the biome, structure or tag, never by namespace alone.

Base pack  : everything vanilla Minecraft 1.21.1, Cobblemon or Fabric API provides (research/vanilla-1.21.1-registry.json lists the vanilla
             IDs; `c:` convention tags come from Fabric API, a hard dependency of the core mod).
Extension  : everything another mod or data pack provides, including content that carries a `minecraft:` ID but is added by a backport mod
             (`minecraft:pale_garden`, `minecraft:sulfur_caves` from VanillaBackport 1.1.7.10).

The result also fixes the *document order* that keeps the merged rows resolving exactly as the former single file did (see
docs/BIOME_MAPPING.md): documents merge by (order, resource ID) and a row's relative position matters only between rows that can match the
same snapshot, so exact-ID biome rows precede tag and dimension rows, and structure classes keep their specificity order.
"""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
REGISTRY = json.loads((ROOT / 'research/vanilla-1.21.1-registry.json').read_text(encoding='utf-8'))
VANILLA_BIOMES, VANILLA_STRUCTURES = set(REGISTRY['biomes']), set(REGISTRY['structures'])

BASE, EXT = 'base', 'cobbleverse'
#: Providers of non-vanilla namespaces, for documentation and for the report.
PROVIDERS = {
    'minecraft': 'vanilla Minecraft 1.21.1 for the IDs in vanilla-1.21.1-registry.json; any other minecraft: ID is added by VanillaBackport 1.1.7.10',
    'c': 'Fabric API convention tags (hard dependency of the core mod)',
    'terralith': 'Terralith (data pack, optional)',
    'lumymon': 'LumyMon', 'legendarymonuments': 'Legendary Monuments (COBBLEVERSE build)', 'cobblemonraiddens': 'Cobblemon Raid Dens',
    'bca': 'Cobblemon Additions', 'repurposed_structures': 'Repurposed Structures',
}
BASE_DIMENSIONS = {'minecraft:overworld', 'minecraft:the_nether', 'minecraft:the_end'}


def _biome_pack(biome):
    namespace, path = biome.split(':', 1)
    return BASE if namespace == 'minecraft' and path in VANILLA_BIOMES else EXT


def mapping_segment(row):
    """(pack, segment) of one environment row. Segments become documents: `biomes` (exact biome IDs), `tags` (biome tags and the vanilla
    dimensions), `dimensions` (modded dimension fallbacks) and `fallback` (rows with no ID at all, such as the deep-underground rule)."""
    if 'biome' in row: return _biome_pack(row['biome']), 'biomes'
    if 'tag' in row:
        namespace = row['tag'].split(':', 1)[0]
        if namespace not in ('minecraft', 'c'): raise ValueError('Tag from an unknown provider: ' + row['tag'])
        return BASE, 'tags'
    if 'dimension' in row: return (BASE, 'tags') if row['dimension'] in BASE_DIMENSIONS else (EXT, 'dimensions')
    if row.get('submerged'): return BASE, 'biomes'
    return BASE, 'fallback'


def structure_pack(row):
    """(pack, class) of one structure row; the class is the field's specificity group (Ancient City, Colosseum, Back Alley, City)."""
    key = row.get('structure') or row['tag']
    namespace, path = key.split(':', 1)
    if row.get('structure'): pack = BASE if namespace == 'minecraft' and path in VANILLA_STRUCTURES else EXT
    else: pack = BASE if namespace == 'minecraft' else EXT   # structure tags: minecraft:village is vanilla; collections/* are Repurposed Structures
    return pack, row['field'].split(':', 1)[1]


#: Document orders. Lower is checked first. Gaps leave room for third-party packs to slot rows in between.
MAPPING_ORDER = {(BASE, 'biomes'): 100, (EXT, 'biomes'): 200, (BASE, 'tags'): 300, (EXT, 'dimensions'): 400, (BASE, 'fallback'): 500}
STRUCTURE_CLASS_ORDER = {'deep_dark': 100, 'colosseum': 200, 'back_alley': 300, 'city': 400}


def structure_order(pack, field_class):
    return STRUCTURE_CLASS_ORDER[field_class] + (0 if pack == BASE else 50)
