"""Copy the field-panel backdrops from the local Pokémon Rejuvenation installation into the mod's client assets.

Only the one battle background each field uses by default is copied (Battle_Field.rb#backdrop -> graphic[0],
Battle.rb#pbChangeBGSprite -> Graphics/Battlebacks/battlebg<graphic>.png). Files are copied byte for byte and
recorded with their source name and SHA-256. Nothing else from the game is copied.
"""
from pathlib import Path
import hashlib, json, sys
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'mod/src/main/resources/assets/rejuvenation/textures/gui/field'
spec = json.loads((ROOT / 'research/field-specification.json').read_text(encoding='utf-8'))
ids = json.loads((ROOT / 'research/field-id-map.json').read_text(encoding='utf-8'))
candidates = [ROOT / 'Rejuvenation 14 copy']
location = ROOT / 'research/source-location.json'
if location.exists(): candidates.append(Path(json.loads(location.read_text(encoding='utf-8'))['scripts']).parent)
game = next((c for c in candidates if (c / 'Graphics/Battlebacks').is_dir()), None)
if game is None: sys.exit('Local Rejuvenation installation with Graphics/Battlebacks not found: ' + ', '.join(map(str, candidates)))
battlebacks = {p.name.lower(): p for p in (game / 'Graphics/Battlebacks').iterdir() if p.is_file()}
OUT.mkdir(parents=True, exist_ok=True)
for stale in OUT.glob('*.png'): stale.unlink()

rows = {}
for sym, fid in sorted(ids.items(), key=lambda kv: kv[1]):
    graphic = dict(spec[sym])['graphic'][0]
    source = battlebacks.get(f'battlebg{graphic}.png'.lower())
    if source is None: sys.exit(f'Missing backdrop for {fid}: battlebg{graphic}.png')
    data = source.read_bytes()
    assert data[:8] == b'\x89PNG\r\n\x1a\n', source
    (OUT / (fid.split(':')[1] + '.png')).write_bytes(data)
    rows[fid] = {'texture': 'rejuvenation:textures/gui/field/' + fid.split(':')[1] + '.png', 'source': 'Graphics/Battlebacks/' + source.name,
                 'sha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data), 'size': [int.from_bytes(data[16:20], 'big'), int.from_bytes(data[20:24], 'big')]}
CREDIT = ('Field backdrops from Pokémon Rejuvenation V14 (Graphics/Battlebacks), a fan game by Janichroma (lead developer) and the '
          "Rejuvenation team; art credited in the game's ReadMe_Credits.txt to Zumi (Honnojis), Janichroma, Crimson, CeriseBlossome, Winter, "
          'Azeria, Dallas, Soulja, IronicOmens and MoonPaw. Pokémon is © Nintendo, Creatures Inc. and GAME FREAK inc. '
          'Used unmodified as client-side UI artwork for this non-commercial field port; not part of the datapack or the server logic.')
(OUT / 'ATTRIBUTION.txt').write_text(CREDIT + '\n\nFiles: <field id>.png = Graphics/Battlebacks/battlebg<graphic[0]>.png; '
                                     'see ../../../field_backdrops.json for each source file and SHA-256.\n', encoding='utf-8')
manifest = {'description': 'Field panel backdrops copied unmodified from Pokémon Rejuvenation 14 (client-side UI artwork only).',
            'credit': CREDIT,
            'selection': 'graphic[0] of each field definition; Battle_Field.rb backdrop, Battle.rb pbChangeBGSprite', 'fields': rows}
(ROOT / 'mod/src/main/resources/assets/rejuvenation/field_backdrops.json').write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
print(f'Copied {len(rows)} field backdrops ({sum(r["bytes"] for r in rows.values())} bytes) from {game}')
# The four custom fields' backdrops are not Rejuvenation artwork; the stale-file sweep above removed them, so rebuild them from the
# preserved originals (research/custom-artwork) and re-add their manifest rows. The 57 attributions above are not touched.
import custom_artwork
custom_artwork.main()
