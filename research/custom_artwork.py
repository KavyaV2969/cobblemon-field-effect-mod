"""Convert the user-provided artwork for the four custom fields into panel backdrops.

The supplied files (deepdark.jpg, palegarden.jpg, warpedforest.jpg, crimsonforest.jpg) are Minecraft screenshots; despite the
extension three are WebP and one is PNG. The originals are never modified: they are read from the Downloads folder (or
REJUVENATION_ARTWORK_DIR), copied byte for byte into research/custom-artwork/originals/ and fingerprinted in
research/custom-artwork/sources.json. Each is centre-cropped to the panel's 16:9 without scaling either axis independently,
resized to 512x288 and written as a PNG next to the 57 Rejuvenation backdrops. The attribution text and the backdrop manifest
keep the existing 57 entries and add the four with their provenance. No artwork is generated.
"""
from pathlib import Path
import hashlib, json, os, shutil, sys
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / 'core/src/main/resources/assets/rejuvenation'
TEXTURES = ASSETS / 'textures/gui/field'
MANIFEST = ASSETS / 'field_backdrops.json'
KEEP = ROOT / 'research/custom-artwork'
SOURCES = KEEP / 'sources.json'
SIZE = (512, 288)
CUSTOM = ROOT / 'research/custom-fields'


def sha(data): return hashlib.sha256(data).hexdigest()


def locate(name):
    folders = [Path(os.environ['REJUVENATION_ARTWORK_DIR'])] if os.environ.get('REJUVENATION_ARTWORK_DIR') else []
    folders += [Path.home() / 'Downloads', KEEP / 'originals']
    for folder in folders:
        if (folder / name).is_file(): return folder / name
    sys.exit(f'User-provided artwork {name} not found in: ' + ', '.join(map(str, folders)))


def fit(image):
    """Centre-crop to 16:9 (no distortion), then resize."""
    image = image.convert('RGB')
    width, height = image.size
    target = SIZE[0] / SIZE[1]
    if width / height > target:
        crop = round(height * target); left = (width - crop) // 2; box = (left, 0, left + crop, height)
    else:
        crop = round(width / target); top = (height - crop) // 2; box = (0, top, width, top + crop)
    return image.crop(box).resize(SIZE, Image.LANCZOS), box


def main():
    recorded = json.loads(SOURCES.read_text(encoding='utf-8')) if SOURCES.exists() else {}
    manifest = json.loads(MANIFEST.read_text(encoding='utf-8'))
    (KEEP / 'originals').mkdir(parents=True, exist_ok=True)
    rows = {}
    for path in sorted(CUSTOM.glob('*.json')):
        spec = json.loads(path.read_text(encoding='utf-8'))
        art = spec['artwork']; name = art['file']; slug = spec['id'].split(':')[1]
        source = locate(name); data = source.read_bytes(); digest = sha(data)
        if name in recorded and recorded[name]['sha256'] != digest:
            sys.exit(f'{name} changed since it was recorded ({recorded[name]["sha256"]} -> {digest}); delete research/custom-artwork/sources.json to accept the new artwork')
        kept = KEEP / 'originals' / name
        if not kept.exists(): shutil.copyfile(source, kept)
        elif sha(kept.read_bytes()) != digest: sys.exit(f'{kept} differs from {source}')
        with Image.open(source) as image:
            real, size = image.format, image.size
            out, box = fit(image)
        target = TEXTURES / (slug + '.png')
        if target.exists(): target.unlink()
        out.save(target, 'PNG', optimize=True)
        recorded[name] = {'sha256': digest, 'bytes': len(data), 'format': real, 'size': list(size), 'description': art['description'],
                          'provenance': 'user-provided artwork (a Minecraft screenshot supplied by the project owner)'}
        png = target.read_bytes()
        rows['rejuvenation:' + slug] = {'texture': f'rejuvenation:textures/gui/field/{slug}.png', 'source': 'user-provided artwork: ' + name,
            'provenance': 'user-provided', 'originalSha256': digest, 'originalFormat': real, 'originalSize': list(size), 'crop': list(box),
            'sha256': sha(png), 'bytes': len(png), 'size': list(SIZE)}
    SOURCES.write_text(json.dumps(recorded, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    originals = {k: v for k, v in manifest['fields'].items() if v.get('provenance') != 'user-provided'}
    if len(originals) != 57: sys.exit(f'Expected the 57 original backdrop attributions, found {len(originals)}')
    manifest['fields'] = {**originals, **rows}
    manifest['customArtwork'] = ('Four custom-field backdrops are user-provided Minecraft screenshots, centre-cropped to 16:9 and resized to 512x288 '
                                 '(research/custom_artwork.py); originals are kept unmodified in research/custom-artwork/originals.')
    MANIFEST.write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + '\n', encoding='utf-8')
    attribution = TEXTURES / 'ATTRIBUTION.txt'
    text = attribution.read_text(encoding='utf-8')
    marker = '\n\nCustom field backdrops'
    text = text.split(marker)[0]
    text += (marker + ' (deep_dark, pale_garden, warped_forest, crimson_forest): user-provided Minecraft screenshots supplied by the project owner, '
             'centre-cropped to 16:9 and resized to 512x288. Minecraft is a trademark of Mojang Studios; the screenshots are used as non-commercial '
             'client-side UI artwork. The four files are not Pokémon Rejuvenation artwork; the 57 attributions above are unchanged.\n')
    attribution.write_text(text, encoding='utf-8')
    print('Converted', len(rows), 'user-provided backdrops;', len(manifest['fields']), 'manifest entries')


if __name__ == '__main__': main()
