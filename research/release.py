"""Assemble the upload-ready release folder (nothing is uploaded, pushed or published).

    python research/release.py            (after gradlew check, research/package.py and research/export_public.py)

Writes release/<version>/: the four artifacts, the source zip (from export_public.py), a convenience bundle, SHA256SUMS, release-manifest.json,
RELEASE_NOTES.md and HOSTING_DESCRIPTIONS.md. No account, repository or hosting-project URL is invented.
"""
from pathlib import Path
import hashlib, json, shutil, sys, zipfile

ROOT = Path(__file__).resolve().parents[1]
dist = json.loads((ROOT / 'dist/manifest.json').read_text(encoding='utf-8'))
V = dist['version']
OUT = ROOT / 'release' / V
OUT.mkdir(parents=True, exist_ok=True)
sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()
if not dist.get('verified'): sys.exit('dist/manifest.json is not verified; run research/package.py after the checks')
names = [a['path'] for a in dist['artifacts']]
for n in names:
    target = OUT / n
    if target.exists(): target.unlink()
    shutil.copyfile(ROOT / 'dist' / n, target)
    assert sha(target) == next(a['sha256'] for a in dist['artifacts'] if a['path'] == n)
source_zip = OUT / f'rejuvenation-fields-source-{V}.zip'
if not source_zip.is_file(): sys.exit('Missing the source zip; run research/export_public.py --out public/rejuvenation-fields --zip ' + str(source_zip))
art = {a['path']: a for a in dist['artifacts']}
core, compat, base, ext = (f'rejuvenation-fields-{x}{V}.' for x in ('', 'compat-', 'base-', 'cobbleverse-'))
core_jar, compat_jar, base_zip, ext_zip = (next(n for n in names if n.startswith(p)) for p in (core, compat, base, ext))

install = f'''# Installing Rejuvenation Fields {V}

| File | Where | Required |
|---|---|---|
| `{core_jar}` | `mods/` on the server and every client | yes |
| `{base_zip}` | the world's `datapacks/` (or the Global Packs required data-pack folder) | yes |
| `{compat_jar}` | `mods/` | optional: Run & Bun / RCT scoring, the global NPC gimmick policy, Battle Extras previews |
| `{ext_zip}` | the same data-pack folder | optional: COBBLEVERSE mappings, trainer fields, Lt. Surge gym (needs the base pack) |

Requires Minecraft 1.21.1, Fabric Loader 0.17.2+, Fabric API 0.116.6+, Cobblemon 1.7.3+1.21.1, Java 21. Restart the client and server after changing jars. Without the compat jar there are no third-party trainer or preview adapters (intentional); without the COBBLEVERSE extension the mappings for COBBLEVERSE's other mods and for backported biomes are absent but every field can still be selected explicitly. If you used the private 0.2.0 build, remove its jar, its field data pack and its `rejuvenation-gym-overrides` pack first. Full details, supported combinations, pack order and rollback: `docs/MIGRATION.md` in the source package.
'''
(OUT / 'INSTALL.md').write_text(install, encoding='utf-8')
notes = f'''# Rejuvenation Fields {V} (first public release)

Data-driven battle fields for Cobblemon 1.7.3 (Minecraft 1.21.1, Fabric): the 57 fields of Pokémon Rejuvenation 14 plus four custom Minecraft-inspired fields (Deep Dark, Pale Garden, Warped Forest, Crimson Forest), 61 in all. Public numbering starts at {V}; the private development builds were 0.2.0 and nothing stored changed (same mod ID, namespace, item and field IDs).

## Downloads

| Artifact | Size (bytes) | SHA-256 |
|---|---:|---|
''' + '\n'.join(f"| `{a['path']}` | {a['bytes']} | `{a['sha256']}` |" for a in dist['artifacts']) + f'''
| `rejuvenation-fields-source-{V}.zip` (sanitized source) | {source_zip.stat().st_size} | `{sha(source_zip)}` |

`SHA256SUMS` lists every file in this folder, including the convenience bundle `rejuvenation-fields-{V}-bundle.zip`.

## Dependencies and versions

| | Core mod | Compat mod | Base pack | COBBLEVERSE pack |
|---|---|---|---|---|
| Minecraft | 1.21.1 | 1.21.1 | pack_format 48 (1.21.1) | pack_format 48 |
| Fabric Loader / API | ≥0.17.2 / ≥0.116.6 | same | – | – |
| Cobblemon | 1.7.3+1.21.1 | 1.7.3+1.21.1 | – | – |
| Needs | – | core {V} (`>={V} <0.2`) | core mod | base pack |
| Optional integrations | – | Run & Bun (`rbrctai`), RCT API (`rctapi`), Cobblemon Battle Extras | – | Terralith, VanillaBackport, Repurposed Structures, Cobblemon Additions, LumyMon, Legendary Monuments, Raid Dens, COBBLEVERSE RCT pack |

{install.split(chr(10), 2)[2]}
## What changed from 0.2.0

See `CHANGELOG.md`: two mods and two packs, the five held items with the original icons and cross recipes, the custom-field authoring kit, deterministic mapping-document order, 25 new simulator tests and 55 new Graal assertions for the custom fields, and a reproducible package.

## Verification (all offline; nothing was run in a live rendered game or in multiplayer)

* Simulator suite 656 checks, Graal 110 runtime assertions plus 42 adapter checks, Java verification (environment 26,949 + structure 120 + notes + client + packets + mixin ABI), item recipes through Minecraft's real recipe API (20 craft combinations, 170 rejected cases), installation-matrix linkage over five classpath combinations, base+extension versus the former single pack over 1.36 million environment snapshots (and byte-identical to the installed 0.2.0 pack's 124 data files), jar differential against 0.2.0, latency within noise of the baseline, and a clean-source rebuild from the source zip that reproduced all four artifact hashes (without the original game scripts; the one Ruby-oracle check that needs them is reported as skipped there).
* Custom-field traceability: 66 specification statements, 64 pass, 1 unavailable content (Mirror Beam does not exist in the installed Showdown), 1 covered by the Graal task.

## Known limitations and open items

* No live-game or multiplayer verification of 0.1; earlier live checks were on 0.2.0.
* The COBBLEVERSE extension must load after the original COBBLEVERSE packs to override the Lt. Surge files; this is expected from Global Packs' file-name ordering but was not observed in a running game (`/datapack list` shows it).
* **Artwork:** the 57 field backdrops and 5 item icons come from Pokémon Rejuvenation and are used on the owner's fan-project basis; no written permission from its authors is on file (see `THIRD_PARTY.md`).
* **License:** none chosen yet (`LICENSE-STATUS.md`); all rights reserved until then.
* Warped Forest's Leech Seed can drain 1 HP less than a literal quarter; Crimson Forest's entry text is "The red flora is preying..." (owner's choice between two specification forms; see `docs/CUSTOM_FIELDS.md`).
* The Field Notes of the 57 original fields are text from the Pokémon Rejuvenation Wiki (Creative Commons Attribution-ShareAlike 4.0; attribution in every note and in `THIRD_PARTY.md`), so those notes and `field-notes/FIELD_NOTES.md` are shared under the same license; the rest of the project's license is still unchosen.
'''
(OUT / 'RELEASE_NOTES.md').write_text(notes, encoding='utf-8')
hosting = f'''# Hosting descriptions ({V})

No account, repository or project IDs are filled in; add them when publishing.

## GitHub release title and body
**Rejuvenation Fields {V}**: contextual battle fields for Cobblemon (57 Pokémon Rejuvenation fields + 4 custom). Download the core mod and the base data pack to use it; add the compat mod for Run & Bun / RCT / Battle Extras support and the COBBLEVERSE pack for that modpack's biome, structure and trainer mappings. See `RELEASE_NOTES.md`, `INSTALL.md` and `SHA256SUMS`.

## `{core_jar}` (mod page summary)
Data-driven battle fields for Cobblemon 1.7.3 on Fabric 1.21.1. Where a wild battle happens (biome, structure, underwater) selects a field that changes type power, moves, abilities, weather and status with the original messages; includes the field panel, Field Notes, exact read-only previews, and five held items with crafting recipes. Requires the base data pack. Works alone; integrations with other mods are in the optional compat mod.

## `{compat_jar}` (mod page summary)
Optional add-on for Rejuvenation Fields: Run & Bun and RCT trainers score moves with the field engine, a global NPC gimmick policy (only declared Tera/Dynamax, eligible Mega on the first legal move), and Cobblemon Battle Extras exact field-aware move previews. Each integration loads only when its mod is installed. Requires the core mod {V}.

## `{base_zip}` (data pack page summary)
The 61 field definitions, Field Notes, simulator items and abilities, and every biome/structure mapping supported by vanilla Minecraft 1.21.1, Cobblemon and Fabric API. Required by the core mod.

## `{ext_zip}` (data pack page summary)
Mappings for COBBLEVERSE's other mods (Terralith, LumyMon, Legendary Monuments, Raid Dens, Cobblemon Additions, Repurposed Structures, VanillaBackport's Pale Garden), the Kanto league trainer fields and the Lt. Surge gym override. Requires the base pack; load it after the original COBBLEVERSE packs.

## Source package
`rejuvenation-fields-source-{V}.zip`: sanitized source with build instructions (`docs/BUILDING.md`), the authoring kit (`docs/CUSTOM_FIELD_AUTHORING.md`), the validation reports and the file inventory.
'''
(OUT / 'HOSTING_DESCRIPTIONS.md').write_text(hosting, encoding='utf-8')
# Convenience bundle.
bundle = OUT / f'rejuvenation-fields-{V}-bundle.zip'
if bundle.exists(): bundle.unlink()
with zipfile.ZipFile(bundle, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    members = [(OUT / n, n) for n in names] + [(OUT / 'INSTALL.md', 'INSTALL.md'), (OUT / 'RELEASE_NOTES.md', 'RELEASE_NOTES.md'), (ROOT / 'README.md', 'README.md'), (ROOT / 'CHANGELOG.md', 'CHANGELOG.md'),
                                                (ROOT / 'THIRD_PARTY.md', 'THIRD_PARTY.md'), (ROOT / 'LICENSE-STATUS.md', 'LICENSE-STATUS.md'), (ROOT / 'docs/MIGRATION.md', 'MIGRATION.md')]
    for src, arc in members:
        info = zipfile.ZipInfo(f'rejuvenation-fields-{V}/{arc}', (2026, 10, 7, 0, 0, 0)); info.compress_type = zipfile.ZIP_DEFLATED; info.external_attr = 0o644 << 16
        z.writestr(info, Path(src).read_bytes())
manifest = {**dist, 'release': {'tag': f'v{V}', 'folder': f'release/{V}', 'bundle': bundle.name, 'sourceZip': source_zip.name,
            'files': {p.name: {'bytes': p.stat().st_size, 'sha256': sha(p)} for p in sorted(OUT.iterdir()) if p.is_file() and p.name not in ('SHA256SUMS', 'release-manifest.json')},
            'unresolved': ['license not chosen (LICENSE-STATUS.md)', 'Pokémon Rejuvenation artwork redistribution rests on the owner statement; no written permission (THIRD_PARTY.md)',
                           'extension load order versus the COBBLEVERSE packs not observed live', 'no live-game or multiplayer verification of 0.1']}}
(OUT / 'release-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
sums = '\n'.join(f'{sha(p)}  {p.name}' for p in sorted(OUT.iterdir()) if p.is_file() and p.name != 'SHA256SUMS') + '\n'
(OUT / 'SHA256SUMS').write_text(sums, encoding='utf-8')
print(sums)
