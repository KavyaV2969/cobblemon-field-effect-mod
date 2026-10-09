"""Assemble the upload-ready release folder (nothing is uploaded, pushed or published).

    python research/release.py            (after gradlew check, research/package.py and research/export_public.py)

Writes release/<version>/: the six artifacts (core jar, compat jar, base pack, COBBLEVERSE extension pack, and the two mutually exclusive Kanto
roster packs Classic and Hardcore), the source zip (from export_public.py), a convenience bundle (Classic only), SHA256SUMS,
release-manifest.json, RELEASE_NOTES.md, INSTALL.md and HOSTING_DESCRIPTIONS.md. No account, repository or hosting-project URL is invented.
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
for stale in OUT.iterdir():   # nothing from an earlier assembly (for example the old single-roster bundle) may linger beside the new files
    if stale.is_file() and stale.name != f'rejuvenation-fields-source-{V}.zip': stale.unlink()
for n in names:
    target = OUT / n
    shutil.copyfile(ROOT / 'dist' / n, target)
    assert sha(target) == next(a['sha256'] for a in dist['artifacts'] if a['path'] == n)
source_zip = OUT / f'rejuvenation-fields-source-{V}.zip'
if not source_zip.is_file(): sys.exit('Missing the source zip; run research/export_public.py --out public/rejuvenation-fields --zip ' + str(source_zip))
core_jar, compat_jar, base_zip, ext_zip, classic_zip, hardcore_zip = (f'rejuvenation-fields-{x}{V}.' + e for x, e in
    (('', 'jar'), ('compat-', 'jar'), ('base-', 'zip'), ('cobbleverse-', 'zip'), ('cobbleverse-classic-', 'zip'), ('cobbleverse-hardcore-', 'zip')))
assert {core_jar, compat_jar, base_zip, ext_zip, classic_zip, hardcore_zip} == set(names), names
art = {a['path']: a for a in dist['artifacts']}


def receipt(name): return json.loads((ROOT / 'research/test-results' / name).read_text(encoding='utf-8'))


rc, rh = receipt('kanto-gyms-simulator-classic.json'), receipt('kanto-gyms-simulator-hardcore.json')
fc, fh = receipt('kanto-fights-simulation-classic.json'), receipt('kanto-fights-simulation-hardcore.json')
assert not rc['failures'] and not rh['failures'] and not fc['problems'] and not fh['problems']

install = f'''# Installing Rejuvenation Fields {V}

| File | Where | Required |
|---|---|---|
| `{core_jar}` | `mods/` on the server and every client | yes |
| `{base_zip}` | the world's `datapacks/` (or the Global Packs required data-pack folder) | yes |
| `{compat_jar}` | `mods/` | optional: Run & Bun / RCT scoring, the global NPC gimmick policy, Battle Extras previews |
| `{ext_zip}` | the same data-pack folder | optional: COBBLEVERSE mappings, the Kanto trainers' fields, the Lt. Surge gym (needs the base pack) |
| **one** of `{classic_zip}` (recommended) or `{hardcore_zip}` | the same data-pack folder | optional: the rebuilt Kanto league teams, needs the extension pack |

**Install only one Kanto roster pack.** Classic and Hardcore replace the same 13 trainer files, so they are alternatives, not add-ons. To switch, delete the one you have and put the other in its place, then restart the world.

Requires Minecraft 1.21.1, Fabric Loader 0.17.2+, Fabric API 0.116.6+, Cobblemon 1.7.3+1.21.1, Java 21. Restart the client and server after changing jars. Without the compat jar there are no third-party trainer or preview adapters (intentional); without the COBBLEVERSE extension the mappings for COBBLEVERSE's other mods and for backported biomes are absent but every field can still be selected explicitly. If you used the private 0.2.0 build, remove its jar, its field data pack and its `rejuvenation-gym-overrides` pack first. Full details, supported combinations, pack order and rollback: `docs/MIGRATION.md` in the source package.
'''
(OUT / 'INSTALL.md').write_text(install, encoding='utf-8')

downloads = '\n'.join(f"| `{a['path']}` | {a['bytes']} | `{a['sha256']}` |" for a in dist['artifacts'])
notes = f'''# Rejuvenation Fields {V} (first public release)

Data-driven battle fields for Cobblemon 1.7.3 (Minecraft 1.21.1, Fabric): the 57 fields of Pokémon Rejuvenation 14 plus four custom Minecraft-inspired fields (Deep Dark, Pale Garden, Warped Forest, Crimson Forest), 61 in all. Public numbering starts at {V}; the private development builds were 0.2.0 and nothing stored changed (same mod ID, namespace, item and field IDs).

## Kanto challenge: choose Classic or Hardcore

The 13-fight Kanto challenge (eight Gym Leaders, the Elite Four and the Champion) now comes in two difficulty variants. Both use the same fields, level caps, trainer AI and Mega / Tera / Z-Move / Ultra Burst gimmicks; they differ in the teams.

| | **Classic** (recommended) | **Hardcore** |
|---|---|---|
| File | `{classic_zip}` | `{hardcore_zip}` |
| What it is | A balanced rebuild of the rosters. Still a hard, Rejuvenation-style challenge, with less setup stacking, fewer Uber-level picks and no inflated stats. | The original roster override, unchanged: the maximum-difficulty version with its highly optimised teams. |
| Blue's EVs | Normal legal spreads (508) | 252 in every stat (needs the compat jar, as before) |

**Install exactly one of the two.** They replace the same 13 trainer files, so they cannot be combined; with both present the later file name silently wins and you would not know which one you are fighting. If you are unsure, take Classic.

### Choosing and installing

1. Install the mod jars as usual: `{core_jar}` and `{compat_jar}` in `mods`, plus Run & Bun AI.
2. Put these three zips in `datapacks`, without unzipping: `{base_zip}`, `{ext_zip}` and **one** roster zip, `{classic_zip}` **or** `{hardcore_zip}`.
3. To switch later, delete the roster zip you have, add the other, restart the world. Trainers that already spawned keep their old team; use a new trainer or world.

`{ext_zip}` no longer contains any roster: it holds the mappings, the Kanto trainers' fields and the Lt. Surge gym, and works with either variant. **If you already installed the first upload of 0.1**, its `{ext_zip}` contained the Hardcore rosters. Replace it with the new file and add a roster zip, otherwise the Kanto trainers use COBBLEVERSE's stock teams.

### What Classic changes (everything else is identical to Hardcore)

* **Lt. Surge:** Iron Hands holds Expert Belt instead of Booster Energy.
* **Erika:** Kartana is replaced by an Adamant Ferrothorn (Rocky Helmet; Power Whip, Gyro Ball, Leech Seed, Knock Off).
* **Sabrina:** Mega Alakazam swaps Calm Mind for Shadow Ball.
* **Koga:** Naganadel swaps Nasty Plot for Dark Pulse; Sneasler swaps Swords Dance for Knock Off; Mega Gengar is replaced by Mega Dragalge, who now comes second in his team order.
* **Blaine:** Chi-Yu is replaced by Timid Typhlosion-Hisui (Eruption, Flamethrower, Extrasensory, Tera Blast), who is now Blaine's Tera Grass user.
* **Giovanni:** Chien-Pao is replaced by Timid Toxtricity (Boomburst, Overdrive, Sludge Bomb, Protect), who takes over Giovanni's Tera permission (Tera Normal).
* **Lorelei:** Calyrex-Ice swaps Swords Dance for Crunch; Arctovish holds Chople Berry instead of Choice Band.
* **Bruno:** Terrakion swaps Swords Dance for Poison Jab; Mega Lucario swaps Swords Dance for Crunch.
* **Agatha:** Basculegion is now an Adamant 252 HP / 252 Atk / 4 SpD set with Clear Amulet instead of Choice Scarf.
* **Lance:** only Mega Dragonite keeps Dragon Dance; Haxorus runs Close Combat, Roaring Moon Earthquake and Necrozma-Dusk-Mane Sunsteel Strike.
* **Blue:** the 252-EVs-in-every-stat rule is removed; all six have normal legal spreads. Team, moves, items and gimmicks are unchanged.
* Brock and Misty are unchanged.

Complete rosters, with every item, ability, nature, IV, EV and move, plus the Mega, Tera and Z-Move users and the field interactions: `README_KANTO_CLASSIC.md` and `README_KANTO_HARDCORE.md` in `rejuvenation-fields-source-{V}.zip`.

## Downloads

| Artifact | Size (bytes) | SHA-256 |
|---|---:|---|
{downloads}
| `rejuvenation-fields-source-{V}.zip` (sanitized source) | {source_zip.stat().st_size} | `{sha(source_zip)}` |

`SHA256SUMS` lists every file in this folder, including the convenience bundle `rejuvenation-fields-{V}-bundle-classic.zip` (the mods, the base and extension packs and the Classic roster pack only; Hardcore is always a separate download).

## Dependencies and versions

| | Core mod | Compat mod | Base pack | COBBLEVERSE extension | Classic / Hardcore roster |
|---|---|---|---|---|---|
| Minecraft | 1.21.1 | 1.21.1 | pack_format 48 (1.21.1) | pack_format 48 | pack_format 48 |
| Fabric Loader / API | ≥0.17.2 / ≥0.116.6 | same | – | – | – |
| Cobblemon | 1.7.3+1.21.1 | 1.7.3+1.21.1 | – | – | – |
| Needs | – | core {V} (`>={V} <0.2`) | core mod | base pack | extension pack; Hardcore Blue also needs the compat jar |
| Optional integrations | – | Run & Bun (`rbrctai`), RCT API (`rctapi`), Cobblemon Battle Extras | – | Terralith, VanillaBackport, Repurposed Structures, Cobblemon Additions, LumyMon, Legendary Monuments, Raid Dens, COBBLEVERSE RCT pack | COBBLEVERSE RCT pack |

{install.split(chr(10), 2)[2]}
## What changed from 0.2.0

See `CHANGELOG.md`: two mods and four packs, the five held items with the original icons and cross recipes, the custom-field authoring kit, deterministic mapping-document order, 25 new simulator tests and 55 new Graal assertions for the custom fields, two Kanto roster variants, and a reproducible package.

## Verification (all offline; nothing was run in a live rendered game or in multiplayer)

* Simulator suite 657 checks, Graal 110 runtime assertions plus 42 adapter checks, Java verification (environment 26,949 + structure 120 + notes + client + packets + mixin ABI), item recipes through Minecraft's real recipe API (20 craft combinations, 170 rejected cases), installation-matrix linkage over five classpath combinations, base+extension versus the former single pack over 1.36 million environment snapshots (and byte-identical to the installed 0.2.0 pack's 124 data files), and Gradle `build check`. The jar differential against 0.2.0, the latency comparison and the clean-source rebuild were made for the earlier build and were not repeated for this one.
* Kanto rosters, each checked separately: Classic {rc['checksPassed']} trainer-file checks and {fc['fightCount']} full simulated fights, Hardcore {rh['checksPassed']} checks and {fh['fightCount']} fights, with no crash, illegal choice or gimmick-policy violation (`docs/KANTO_FIGHT_SIMULATION.md`). The checks cover every species, form, item, ability, move and EV spread, Mega Evolution, Z-Moves and Ultra Burst, that only the declared Tera user Terastallizes (Typhlosion-Hisui for Blaine and Toxtricity for Giovanni in Classic), Koga's team order, and that Hardcore is byte-identical to the former roster override and Classic differs only by the changes listed above. The two roster packs share no file with any other pack and hold the same 13 file names, so they cannot be mixed up.
* Custom-field traceability: 66 specification statements, 64 pass, 1 unavailable content (Mirror Beam does not exist in the installed Showdown), 1 covered by the Graal task.

## Known limitations and open items

* No live-game or multiplayer verification of 0.1; earlier live checks were on 0.2.0. The Kanto rosters have only been played in the offline simulator.
* The COBBLEVERSE extension and the roster pack must load after the original COBBLEVERSE packs to override the Lt. Surge files and the trainer teams; this is expected from Global Packs' file-name ordering but was not observed in a running game (`/datapack list` shows it).
* Nothing stops a player from installing both roster packs; the mod does not detect it. Install one.
* Sneasler's Knock Off in Classic is not in Cobblemon's learnset data for Sneasler; it exists in the battle engine, so the set works as written (Hardcore already has six such sets).
* **Artwork:** the 57 field backdrops and 5 item icons come from Pokémon Rejuvenation and are used on the owner's fan-project basis; no written permission from its authors is on file (see `THIRD_PARTY.md`).
* **License:** the original code and data are released under the Unlicense (`LICENSE`); third-party material (Rejuvenation artwork and data, the wiki-derived Field Notes, COBBLEVERSE-derived files) keeps its own terms (`LICENSE-STATUS.md`, `THIRD_PARTY.md`).
* Warped Forest's Leech Seed can drain 1 HP less than a literal quarter; Crimson Forest's entry text is "The red flora is preying..." (owner's choice between two specification forms; see `docs/CUSTOM_FIELDS.md`).
* The Field Notes of the 57 original fields are text from the Pokémon Rejuvenation Wiki (Creative Commons Attribution-ShareAlike 4.0; attribution in every note and in `THIRD_PARTY.md`), so those notes and `field-notes/FIELD_NOTES.md` are shared under the same license.
'''
(OUT / 'RELEASE_NOTES.md').write_text(notes, encoding='utf-8')
hosting = f'''# Hosting descriptions ({V})

No account, repository or project IDs are filled in; add them when publishing.

## GitHub release title and body
**Rejuvenation Fields {V}**: contextual battle fields for Cobblemon (57 Pokémon Rejuvenation fields + 4 custom). Download the core mod and the base data pack to use it; add the compat mod for Run & Bun / RCT / Battle Extras support and the COBBLEVERSE pack for that modpack's biome, structure and trainer-field mappings, then choose **one** Kanto roster pack: Classic (recommended) or Hardcore (the original rosters). See `RELEASE_NOTES.md`, `INSTALL.md` and `SHA256SUMS`.

## `{core_jar}` (mod page summary)
Data-driven battle fields for Cobblemon 1.7.3 on Fabric 1.21.1. Where a wild battle happens (biome, structure, underwater) selects a field that changes type power, moves, abilities, weather and status with the original messages; includes the field panel, Field Notes, exact read-only previews, and five held items with crafting recipes. Requires the base data pack. Works alone; integrations with other mods are in the optional compat mod.

## `{compat_jar}` (mod page summary)
Optional add-on for Rejuvenation Fields: Run & Bun and RCT trainers score moves with the field engine, a global NPC gimmick policy (only declared Tera/Dynamax, eligible Mega on the first legal move), and Cobblemon Battle Extras exact field-aware move previews. Each integration loads only when its mod is installed. Requires the core mod {V}.

## `{base_zip}` (data pack page summary)
The 61 field definitions, Field Notes, simulator items and abilities, and every biome/structure mapping supported by vanilla Minecraft 1.21.1, Cobblemon and Fabric API. Required by the core mod.

## `{ext_zip}` (data pack page summary)
Mappings for COBBLEVERSE's other mods (Terralith, LumyMon, Legendary Monuments, Raid Dens, Cobblemon Additions, Repurposed Structures, VanillaBackport's Pale Garden), the field of each of the 13 Kanto league fights and the Lt. Surge gym override. Requires the base pack; load it after the original COBBLEVERSE packs. The teams come from a roster pack below.

## `{classic_zip}` (data pack page summary, recommended)
Classic Kanto league: the balanced rebuild of all 13 teams (Gym Leaders, Elite Four, Champion) on the Rejuvenation fields. Still a hard challenge, with less setup stacking, fewer Uber picks and normal stats. Rosters in `README_KANTO_CLASSIC.md`. Requires the extension pack. Install only one roster pack.

## `{hardcore_zip}` (data pack page summary)
Hardcore Kanto league: the original roster override, unchanged, for the maximum-difficulty version. Rosters in `README_KANTO_HARDCORE.md`. Requires the extension pack and, for Blue's 252-EV spreads, the compat jar. Install only one roster pack.

## Source package
`rejuvenation-fields-source-{V}.zip`: sanitized source with build instructions (`docs/BUILDING.md`), the authoring kit (`docs/CUSTOM_FIELD_AUTHORING.md`), the validation reports and the file inventory.
'''
(OUT / 'HOSTING_DESCRIPTIONS.md').write_text(hosting, encoding='utf-8')
# Convenience bundle: everything for the recommended setup. Hardcore is deliberately not inside, so one download can never hold both rosters.
bundle = OUT / f'rejuvenation-fields-{V}-bundle-classic.zip'
bundle_names = [n for n in names if n != hardcore_zip]
with zipfile.ZipFile(bundle, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    members = [(OUT / n, n) for n in bundle_names] + [(OUT / 'INSTALL.md', 'INSTALL.md'), (OUT / 'RELEASE_NOTES.md', 'RELEASE_NOTES.md'), (ROOT / 'README.md', 'README.md'), (ROOT / 'README_KANTO_CLASSIC.md', 'README_KANTO_CLASSIC.md'),
                                                (ROOT / 'CHANGELOG.md', 'CHANGELOG.md'), (ROOT / 'THIRD_PARTY.md', 'THIRD_PARTY.md'), (ROOT / 'LICENSE-STATUS.md', 'LICENSE-STATUS.md'), (ROOT / 'LICENSE', 'LICENSE'), (ROOT / 'docs/MIGRATION.md', 'MIGRATION.md')]
    for src, arc in members:
        info = zipfile.ZipInfo(f'rejuvenation-fields-{V}/{arc}', (2026, 10, 9, 0, 0, 0)); info.compress_type = zipfile.ZIP_DEFLATED; info.external_attr = 0o644 << 16
        z.writestr(info, Path(src).read_bytes())
manifest = {**dist, 'release': {'tag': f'v{V}', 'folder': f'release/{V}', 'bundle': bundle.name, 'bundleContains': bundle_names, 'sourceZip': source_zip.name,
            'files': {p.name: {'bytes': p.stat().st_size, 'sha256': sha(p)} for p in sorted(OUT.iterdir()) if p.is_file() and p.name not in ('SHA256SUMS', 'release-manifest.json')},
            'unresolved': ['Pokémon Rejuvenation artwork redistribution rests on the owner statement; no written permission (THIRD_PARTY.md)',
                           'extension and roster pack load order versus the COBBLEVERSE packs not observed live', 'no live-game or multiplayer verification of 0.1',
                           'installing both Kanto roster packs is not detected by the mod; the documentation says to install one']}}
(OUT / 'release-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
sums = '\n'.join(f'{sha(p)}  {p.name}' for p in sorted(OUT.iterdir()) if p.is_file() and p.name != 'SHA256SUMS') + '\n'
(OUT / 'SHA256SUMS').write_text(sums, encoding='utf-8')
print(sums)
