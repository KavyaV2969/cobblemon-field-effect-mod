"""Author the requested Kanto gym override; validate before installation.

Run with --author to write source/README and back up existing artifacts, then
run verify_kanto_gyms.cjs, then --ship to package validated source and install it.
"""
from pathlib import Path
import argparse, copy, datetime, hashlib, json, re, shutil, zipfile

ROOT = Path(__file__).resolve().parents[1]
PROFILE = ROOT.parent
SOURCE = ROOT / 'datapack/cobbleverse'
BASE = PROFILE / 'datapacks/COBBLEVERSE-RCT-DP-v20.zip'
PACK_NAME = 'rejuvenation-fields-cobbleverse-0.1.zip'
STATS = ('hp', 'atk', 'def', 'spa', 'spd', 'spe')
CAPS = {'brock': 16, 'misty': 28, 'ltsurge': 36, 'erika': 44,
        'sabrina': 59, 'koga': 68, 'blaine': 76, 'giovanni': 81,
        'league_lorelei': 85, 'league_bruno': 85, 'league_agatha': 85, 'league_lance': 85, 'champion_blue': 85}
FIELDS = {'brock': 'crystal_cavern', 'misty': 'water_surface',
          'ltsurge': 'murkwater_surface', 'erika': 'warped_forest',
          'sabrina': 'psychic_terrain', 'koga': 'wasteland',
          'blaine': 'crimson_forest', 'giovanni': 'deep_dark', 'league_lorelei': 'frozen_dimension',
          'league_bruno': 'colosseum', 'league_agatha': 'haunted', 'league_lance': 'dragons_den', 'champion_blue': 'new_world'}

# species | item (empty = none) | ability | nature | EVs | moves | Tera | aspects
# These rows are the user's requested sets, not learnset/competitive legality substitutions.
SETS = {
    'brock': '''
Geodude||Sturdy|Adamant|128 HP / 124 Atk|Stealth Rock, Rock Tomb, Spark, Self-Destruct||alolan
Archen|Berry Juice|Defeatist|Jolly|128 Atk / 124 Spe|Rock Tomb, Wing Attack, U-turn, Quick Attack||
Lileep|Big Root|Storm Drain|Bold|128 HP / 124 Def|Ancient Power, Mega Drain, Recover, Stockpile||
Sableye|Roseli Berry|Prankster|Impish|128 HP / 124 Def|Will-O-Wisp, Shadow Sneak, Recover, Parting Shot|Steel|
Lunatone|Passho Berry|Levitate|Modest|128 SpA / 124 Spe|Ancient Power, Psybeam, Icy Wind, Hidden Power-Ground||
Tirtouga|White Herb|Solid Rock|Adamant|128 Atk / 124 Spe|Shell Smash, Smack Down, Liquidation, Aqua Jet||
''',
    'misty': '''
Vaporeon|Elemental Seed|Water Absorb|Bold|252 HP / 252 Def / 4 SpD|Wish, Toxic, Scald, Protect||
Togekiss|Wacan Berry|Serene Grace|Timid|252 HP / 252 Spe / 4 SpA|Air Slash, Aura Sphere, Roost, Dazzling Gleam||
Quagsire|Rindo Berry|Water Absorb|Bold|252 HP / 128 Def / 128 SpD|Muddy Water, Recover, Ice Beam, Haze||
Floatzel|Mystic Water|Swift Swim|Adamant|252 Atk / 252 Spe / 4 HP|Liquidation, Flip Turn, Ice Punch, Brick Break|Water|
Lanturn|Sitrus Berry|Volt Absorb|Modest|252 HP / 252 SpA / 4 SpD|Discharge, Volt Switch, Ice Beam, Scald||
Gyarados|Gyaradosite|Intimidate|Jolly|252 Atk / 252 Spe / 4 HP|Dive, Waterfall, Crunch, Dragon Dance||
''',
    'erika': '''
Ting-Lu|Magical Seed|Vessel of Ruin|Careful|252 HP / 4 Def / 252 SpD|Stealth Rock, Earthquake, Ruination, Whirlwind||
Serperior|Leftovers|Contrary|Timid|252 HP / 4 SpA / 252 Spe|Leaf Storm, Substitute, Leech Seed, Tera Blast||
Kartana|Life Orb|Beast Boost|Jolly|252 Atk / 4 SpD / 252 Spe|Leaf Blade, Smart Strike, Knock Off, Sacred Sword||
Meowscarada|Choice Scarf|Protean|Adamant|252 Atk / 4 Def / 252 Spe|Knock Off, U-turn, Low Kick, Flower Trick||
Ogerpon|Hearthflame Mask|Mold Breaker|Jolly|252 Atk / 4 SpD / 252 Spe|Swords Dance, Ivy Cudgel, Power Whip, U-turn|Fire|hearthflame-mask
Venusaur|Venusaurite|Chlorophyll|Bold|248 HP / 100 Def / 140 SpD / 20 Spe|Giga Drain, Sludge Bomb, Leech Seed, Earth Power||
''',
    'koga': '''
Glimmora|Focus Sash|Toxic Debris|Timid|4 Def / 252 SpA / 252 Spe|Spikes, Stealth Rock, Sludge Bomb, Earth Power||
Pecharunt|Leftovers|Poison Puppeteer|Bold|252 HP / 228 Def / 28 Spe|Parting Shot, Recover, Malignant Chain, Shadow Ball||
Sneasler|Telluric Seed|Unburden|Adamant|252 Atk / 4 SpD / 252 Spe|Dire Claw, Close Combat, Acrobatics, Swords Dance|Dark|
Naganadel|Life Orb|Beast Boost|Timid|252 SpA / 4 SpD / 252 Spe|Nasty Plot, Draco Meteor, Sludge Bomb, Fire Blast||
Cinderace|Life Orb|Libero|Jolly|252 Atk / 4 SpD / 252 Spe|Gunk Shot, Pyro Ball, U-turn, Sucker Punch||
Gengar|Gengarite|Cursed Body|Timid|4 Def / 252 SpA / 252 Spe|Venoshock, Shadow Ball, Focus Blast, Energy Ball||
''',
    'sabrina': '''
Delphox|Magical Seed|Magician|Timid|252 SpA / 4 SpD / 252 Spe|Hypnosis, Mystical Fire, Psychic, Focus Blast||
Metagross|Assault Vest|Clear Body|Adamant|252 HP / 252 Atk / 4 SpD|Psychic Fangs, Meteor Mash, Earthquake, Knock Off||
Armarouge|Colbur Berry|Flash Fire|Modest|252 HP / 252 SpA / 4 SpD|Expanding Force, Armor Cannon, Aura Sphere, Energy Ball||
Iron Valiant|Life Orb|Quark Drive|Timid|4 Def / 252 SpA / 252 Spe|Moonblast, Focus Blast, Psyshock, Shadow Ball||
Espathra|Leftovers|Speed Boost|Bold|252 HP / 252 Def / 4 Spe|Calm Mind, Stored Power, Dazzling Gleam, Protect|Fairy|
Alakazam|Alakazite|Magic Guard|Timid|4 Def / 252 SpA / 252 Spe|Calm Mind, Psychic, Focus Blast, Recover||
''',
    'blaine': '''
Gouging Fire|Loaded Dice|Protosynthesis|Adamant|4 HP / 252 Atk / 252 Spe|Dragon Dance, Heat Crash, Scale Shot, Earthquake||
Heatran|Leftovers|Flash Fire|Calm|252 HP / 4 SpA / 252 SpD|Magma Storm, Earth Power, Toxic, Protect||
Blaziken|Focus Sash|Speed Boost|Adamant|252 Atk / 4 SpD / 252 Spe|Swords Dance, Flare Blitz, Close Combat, Thunder Punch||
Gholdengo|White Herb|Good as Gold|Timid|4 Def / 252 SpA / 252 Spe|Make It Rain, Shadow Ball, Focus Blast, Recover||
Chi-Yu|Life Orb|Beads of Ruin|Modest|252 SpA / 4 SpD / 252 Spe|Flamethrower, Dark Pulse, Tera Blast, Psychic|Grass|
Charizard|Charizardite Y|Blaze|Timid|4 Def / 252 SpA / 252 Spe|Weather Ball, Solar Beam, Focus Blast, Roost||
''',
    'giovanni': '''
Marshadow|Life Orb|Technician|Jolly|252 Atk / 4 SpD / 252 Spe|Spectral Thief, Close Combat, Shadow Sneak, Bulk Up||
Rhyperior|Assault Vest|Solid Rock|Adamant|252 HP / 252 Atk / 4 SpD|Earthquake, Stone Edge, Megahorn, Ice Punch||
Kommo-o|Kommonium Z|Soundproof|Timid|4 Def / 252 SpA / 252 Spe|Clanging Scales, Aura Sphere, Flamethrower, Flash Cannon||
Chien-Pao|Focus Sash|Sword of Ruin|Jolly|252 Atk / 4 SpD / 252 Spe|Swords Dance, Crunch, Icicle Crash, Sacred Sword|Dark|
Hydreigon|Magical Seed|Levitate|Timid|4 Def / 252 SpA / 252 Spe|Dark Pulse, Draco Meteor, Flamethrower, Earth Power||
Tyranitar|Tyranitarite|Sand Stream|Jolly|252 Atk / 4 SpD / 252 Spe|Dragon Dance, Crunch, Stone Edge, Ice Punch||
''',
    'league_lorelei': '''
Arctovish|Choice Band|Slush Rush|Adamant|252 Atk / 4 SpD / 252 Spe|Fishious Rend, Icicle Crash, Crunch, Psychic Fangs|Water|
Kyurem|Loaded Dice|Pressure|Naive|252 Atk / 4 SpA / 252 Spe|Icicle Spear, Scale Shot, Earth Power, Roost||
Iron Bundle|Light Clay|Quark Drive|Timid|4 Def / 252 SpA / 252 Spe|Aurora Veil, Freeze-Dry, Hydro Pump, Flip Turn||
Greninja|Life Orb|Protean|Timid|4 Def / 252 SpA / 252 Spe|Hydro Pump, Dark Pulse, Ice Beam, U-turn||
Calyrex|Elemental Seed|As One (Glastrier)|Jolly|252 Atk / 4 SpD / 252 Spe|Glacial Lance, High Horsepower, Close Combat, Swords Dance||ice-rider
Baxcalibur|Baxcalibrite|Thermal Exchange|Jolly|252 Atk / 4 SpD / 252 Spe|Dragon Dance, Icicle Crash, Glaive Rush, Earthquake||
''',
    'league_bruno': '''
Gallade|Synthetic Seed|Justified|Jolly|252 Atk / 4 SpD / 252 Spe|Sacred Sword, Psycho Cut, Night Slash, Leaf Blade||
Keldeo|Choice Specs|Justified|Timid|4 Def / 252 SpA / 252 Spe|Secret Sword, Hydro Pump, Icy Wind, Air Slash||
Cloyster|White Herb|Skill Link|Jolly|252 Atk / 4 SpD / 252 Spe|Shell Smash, Icicle Spear, Rock Blast, Liquidation||
Terrakion|Focus Sash|Justified|Jolly|252 Atk / 4 SpD / 252 Spe|Swords Dance, Reversal, Sacred Sword, Stone Edge|Fighting|
Zamazenta|Rusted Shield|Dauntless Shield|Jolly|252 Atk / 4 Def / 252 Spe|Body Press, Behemoth Bash, Crunch, Roar||crowned
Lucario|Lucarionite|Justified|Jolly|252 Atk / 4 SpD / 252 Spe|Swords Dance, Meteor Mash, Close Combat, Bullet Punch||
''',
    'league_agatha': '''
Dragapult|Choice Band|Cursed Body|Jolly|252 Atk / 4 SpD / 252 Spe|Phantom Force, Dragon Darts, U-turn, Sucker Punch||
Flutter Mane|Booster Energy|Protosynthesis|Timid|4 Def / 252 SpA / 252 Spe|Shadow Ball, Moonblast, Mystical Fire, Psyshock||
Ceruledge|Focus Sash|Weak Armor|Jolly|252 Atk / 4 SpD / 252 Spe|Swords Dance, Bitter Blade, Poltergeist, Shadow Sneak|Fire|
Calyrex|Magical Seed|As One (Spectrier)|Timid|4 Def / 252 SpA / 252 Spe|Nasty Plot, Astral Barrage, Psyshock, Draining Kiss||shadow-rider
Gengar|Gengarite|Cursed Body|Timid|4 Def / 252 SpA / 252 Spe|Hypnosis, Hex, Focus Blast, Destiny Bond||
Basculegion|Choice Scarf|Mold Breaker|Jolly|252 Atk / 4 SpD / 252 Spe|Last Respects, Wave Crash, Aqua Jet, Psychic Fangs||
''',
    'league_lance': '''
Archaludon|Elemental Seed|Stamina|Modest|252 HP / 252 SpA / 4 Def|Draco Meteor, Earth Power, Flash Cannon, Body Press||
Haxorus|Loaded Dice|Mold Breaker|Jolly|252 Atk / 4 SpD / 252 Spe|Dragon Dance, Scale Shot, Earthquake, Poison Jab||
Latios|Soul Dew|Levitate|Timid|4 Def / 252 SpA / 252 Spe|Luster Purge, Draco Meteor, Aura Sphere, Recover||
Roaring Moon|Booster Energy|Protosynthesis|Adamant|252 Atk / 4 SpD / 252 Spe|Dragon Dance, Acrobatics, Dragon Rush, Knock Off|Flying|
Necrozma|Ultranecrozium Z|Prism Armor|Jolly|252 Atk / 4 SpD / 252 Spe|Dragon Dance, Photon Geyser, Dragon Claw, Earthquake||dusk-fusion
Dragonite|Dragoninite|Multiscale|Jolly|252 Atk / 4 SpD / 252 Spe|Dragon Dance, Dragon Rush, Fire Punch, Earthquake||
''',
    'champion_blue': '''
Hawlucha|Magical Seed|Unburden|Jolly|252 HP / 252 Atk / 252 Def / 252 SpA / 252 SpD / 252 Spe|Acrobatics, Close Combat, Stone Edge, Encore||
Iron Valiant|Life Orb|Quark Drive|Timid|252 HP / 252 Atk / 252 Def / 252 SpA / 252 SpD / 252 Spe|Moonblast, Close Combat, Vacuum Wave, Knock Off||
Kingambit|Darkinium Z|Supreme Overlord|Adamant|252 HP / 252 Atk / 252 Def / 252 SpA / 252 SpD / 252 Spe|Kowtow Cleave, Iron Head, Low Kick, Sucker Punch||
Ursaluna|Leftovers|Mind's Eye|Modest|252 HP / 252 Atk / 252 Def / 252 SpA / 252 SpD / 252 Spe|Blood Moon, Earth Power, Vacuum Wave, Moonlight|Normal|bloodmoon
Metagross|Metagrossite|Clear Body|Jolly|252 HP / 252 Atk / 252 Def / 252 SpA / 252 SpD / 252 Spe|Meteor Mash, Zen Headbutt, Bullet Punch, Stomping Tantrum||
Arceus|Life Orb|Multitype|Timid|252 HP / 252 Atk / 252 Def / 252 SpA / 252 SpD / 252 Spe|Judgment, Spacial Rend, Earth Power, Recover||
''',
}

def ident(name): return re.sub('[^a-z0-9]', '', name.lower())
def digest(path): return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def write_json(path, value):
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, indent=2) + '\n', encoding='utf-8')

def resources():
    species, items = {}, set()
    for jar in (PROFILE / 'mods').glob('*.jar'):
        with zipfile.ZipFile(jar) as z:
            for name in z.namelist():
                match = re.fullmatch(r'assets/([^/]+)/models/item/([^/]+)\.json', name)
                if match: items.add(':'.join(match.groups()))
                if jar.name.startswith('Cobblemon-fabric') and re.fullmatch(r'data/cobblemon/species/[^/]+/[^/]+\.json', name):
                    doc = json.loads(z.read(name))
                    species[ident(doc['name'])] = doc
    return species, items

def make_team(rows, level, species, items, blue=False):
    team = []
    special_items = {'Elemental Seed': 'rejuvenation:elemental_seed', 'Magical Seed': 'rejuvenation:magical_seed',
                     'Telluric Seed': 'rejuvenation:telluric_seed', 'Synthetic Seed': 'rejuvenation:synthetic_seed'}
    for row in rows.strip().splitlines():
        name, item, ability, nature, spread, moves, tera, aspects = row.split('|')
        sid = ident(name)
        doc = species[sid]
        chosen_aspects = aspects.split(',') if aspects else []
        form = next((f for f in doc.get('forms', []) if set(f.get('aspects', [])) == set(chosen_aspects)), doc)
        if chosen_aspects: assert form is not doc, (name, chosen_aspects)
        ratio = form.get('maleRatio', doc.get('maleRatio', 0.5))
        gender = 'GENDERLESS' if ratio == -1 else 'FEMALE' if ratio == 0 else 'MALE'
        evs = dict.fromkeys(STATS, 0)
        for part in spread.split(' / '):
            value, stat = part.split()
            evs[stat.lower()] = int(value)
        held = []
        if item:
            iid = special_items.get(item)
            if iid is None:
                slug = re.sub('[^a-z0-9]+', '_', item.lower()).strip('_')
                matches = [ns + ':' + slug for ns in ('cobblemon', 'mega_showdown', 'zamega') if ns + ':' + slug in items]
                assert len(matches) == 1, (item, matches)
                iid = matches[0]
            assert iid in items, iid
            held = [iid]
        mon = {'species': sid, 'gender': gender, 'level': level, 'nature': nature.lower(),
               'ability': ident(ability), 'heldItem': held, 'moveset': [ident(m.strip()) for m in moves.split(',')],
               'ivs': dict.fromkeys(STATS, 31), 'evs': evs}
        if chosen_aspects: mon['aspects'] = chosen_aspects
        mon['gimmicks'] = {'tera': tera.lower() or None, 'dynamax': False, 'gmax': False}
        assert len(mon['moveset']) == 4 and (sum(evs.values()) <= 510 or blue and all(v == 252 for v in evs.values()))
        team.append(mon)
    assert len(team) == 6
    return team

def author():
    backup = ROOT / 'research/backups' / ('kanto-gyms-' + datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%d-%H%M%S'))
    backup.mkdir(parents=True)
    paths = [PROFILE / 'datapacks' / PACK_NAME, ROOT / 'dist' / PACK_NAME, ROOT / 'dist/manifest.json',
             ROOT / 'README_KANTO_GYMS.md', ROOT / 'docs/KANTO_LEAGUE_FIELDS.md', ROOT / 'docs/TRAINER_INTEGRATION.md',
             ROOT / 'README_KANTO_LEAGUE.md', ROOT / 'research/package.py',
             PROFILE / 'mods/rejuvenation-fields-compat-0.1.jar', ROOT / 'dist/rejuvenation-fields-compat-0.1.jar'] + [p for p in SOURCE.rglob('*') if p.is_file()]
    for p in paths:
        if p.exists():
            target = backup / p.relative_to(PROFILE)
            target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(p, target)
    write_json(ROOT / 'research/test-results/kanto-gyms-backup.json', {'backup': str(backup), 'originalPackSha256': digest(PROFILE / 'datapacks' / PACK_NAME)})
    species, items = resources()
    with zipfile.ZipFile(BASE) as z:
        for gym, rows in SETS.items():
            trainer = json.loads(z.read(f'data/rctmod/trainers/kanto_{gym}.json'))
            trainer['team'] = make_team(rows, CAPS[gym], species, items, blue=gym == 'champion_blue')
            targets = [m['species'] for m in trainer['team'] if m['gimmicks']['tera']]
            trainer['ai']['data'] = {'canTera': bool(targets), 'teraTarget': targets[0] if len(targets) == 1 else '',
                                     'canDynamax': False, 'dynamaxTarget': '', 'canGmax': False}
            write_json(SOURCE / f'data/rctmod/trainers/kanto_{gym}.json', trainer)
    mapping_path = SOURCE / 'data/rejuvenation/rejuvenation/trainers/kanto.json'
    mapping = json.loads(mapping_path.read_text(encoding='utf-8'))
    # Old performance scores apply to the previous teams/fields; do not label these sets with them.
    for gym, field in FIELDS.items():
        if gym != 'ltsurge': mapping['trainers'][f'kanto_{gym}'] = {'field': 'rejuvenation:' + field}
    mapping['source']['gymOverrides'] = 'User-authored complete Kanto league rosters and fields, 2026-10-08; README_KANTO_LEAGUE.md'
    mapping['source'].pop('scores', None)
    write_json(mapping_path, mapping)
    meta_path = SOURCE / 'pack.mcmeta'
    meta = json.loads(meta_path.read_text(encoding='utf-8'))
    meta['pack']['description'] = 'Rejuvenation Fields COBBLEVERSE extension (modded mappings, all 13 Kanto league teams and fields, Lt. Surge gym). Requires Rejuvenation Fields base and compat. Version 0.1.'
    write_json(meta_path, meta)
    package = ROOT / 'research/package.py'
    text = package.read_text(encoding='utf-8')
    text = text.replace("r'data/rctmod/trainers/kanto_ltsurge\\.json': 1", "r'data/rctmod/trainers/kanto_(brock|misty|ltsurge|erika|sabrina|koga|blaine|giovanni)\\.json': 8")
    text = text.replace("r'data/rctmod/trainers/kanto_(brock|misty|ltsurge|erika|sabrina|koga|blaine|giovanni)\\.json': 8", "r'data/rctmod/trainers/kanto_(brock|misty|ltsurge|erika|sabrina|koga|blaine|giovanni|league_lorelei|league_bruno|league_agatha|league_lance|champion_blue)\\.json': 13")
    package.write_text(text, encoding='utf-8')
    integration = ROOT / 'docs/TRAINER_INTEGRATION.md'
    text = integration.read_text(encoding='utf-8')
    first = text.split('\n')[2]
    text = text.replace(first, 'The original COBBLEVERSE trainer datapack is preserved. All 13 custom Kanto league teams are authored in `datapack/cobbleverse/data/rctmod/trainers/` and shipped in the existing COBBLEVERSE extension pack, alongside the existing Lt. Surge gym structure override. Load the extension after the original COBBLEVERSE packs. [README_KANTO_LEAGUE.md](../README_KANTO_LEAGUE.md) contains the caps, fields and complete teams. The compat mod preserves Blue NPC teams\' requested 252 EVs in every stat; ordinary Pokemon retain normal EV limits.')
    text = text.replace('`datapack/data/rejuvenation/rejuvenation/trainers/kanto.json`', '`datapack/cobbleverse/data/rejuvenation/rejuvenation/trainers/kanto.json`')
    text = text.replace('lists the assignments and how they were computed', 'lists the current assignments; gym fields follow the user-authored roster specification')
    integration.write_text(text, encoding='utf-8')
    print('Backed up and authored all league replacements; Surge preserved:', backup)

def ship():
    receipt = json.loads((ROOT / 'research/test-results/kanto-gyms-simulator.json').read_text())
    assert receipt['failures'] == []
    blue_receipt = json.loads((ROOT / 'research/test-results/blue-npc-evs-install.json').read_text())
    assert blue_receipt['failed'] is False
    assert digest(PROFILE / 'mods/rejuvenation-fields-compat-0.1.jar') == blue_receipt['sha256'], 'Install the tested Blue EV compat adjustment with this pack'
    for rel, sha in receipt['sourceHashes'].items(): assert digest(SOURCE / rel) == sha, ('Unvalidated source', rel)
    assert digest(BASE) == receipt['originalTrainerPackSha256']
    with zipfile.ZipFile(PROFILE / 'mods/rejuvenation-fields-0.1.jar') as z:
        assert hashlib.sha256(z.read('rejuvenation-engine.js')).hexdigest() == receipt['fieldEngineSha256'], 'Installed engine differs from tested engine'
    with zipfile.ZipFile(PROFILE / 'datapacks/rejuvenation-fields-base-0.1.zip') as z:
        for name in z.namelist():
            if name.endswith('/') or name == 'pack.mcmeta': continue
            assert z.read(name) == (ROOT / 'datapack/base' / name).read_bytes(), ('Installed base differs', name)
    installed = PROFILE / 'datapacks' / PACK_NAME
    original_backup = json.loads((ROOT / 'research/test-results/kanto-gyms-backup.json').read_text())
    old = Path(original_backup['backup']) / installed.relative_to(PROFILE)
    # All unrelated resource bytes, including Surge and its structure, must be retained.
    replacements = {f'data/rctmod/trainers/kanto_{gym}.json' for gym in SETS} | {'data/rejuvenation/rejuvenation/trainers/kanto.json', 'pack.mcmeta', 'README.md'}
    with zipfile.ZipFile(old) as z:
        for name in z.namelist():
            if name.endswith('/') or name in replacements: continue
            assert (SOURCE / name).read_bytes() == z.read(name), ('Unrelated resource changed', name)
    target = ROOT / 'dist' / PACK_NAME
    temp = target.with_suffix('.zip.tmp')
    with zipfile.ZipFile(temp, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
        for p in sorted(SOURCE.rglob('*')):
            if not p.is_file(): continue
            entry = zipfile.ZipInfo(p.relative_to(SOURCE).as_posix(), (2026, 10, 8, 0, 0, 0))
            entry.compress_type = zipfile.ZIP_DEFLATED
            entry.external_attr = 0o644 << 16
            z.writestr(entry, p.read_bytes())
    with zipfile.ZipFile(temp) as z:
        assert z.testzip() is None
        assert len(z.namelist()) == len(set(z.namelist()))
        assert len([n for n in z.namelist() if n.startswith('data/rctmod/trainers/') and n.endswith('.json')]) == 13
        for name in z.namelist():
            if name.endswith('.json') or name == 'pack.mcmeta': json.loads(z.read(name))
            assert z.read(name) == (SOURCE / name).read_bytes()
    try:
        temp.replace(target)
    except PermissionError:
        # Some Windows hosts permit overwriting file contents but deny replacement.
        # The source zip has already been verified and the previous file backed up.
        shutil.copyfile(temp, target)
        temp.unlink()
    installed_temp = installed.with_suffix('.zip.tmp')
    shutil.copy2(target, installed_temp)
    try:
        installed_temp.replace(installed)
    except PermissionError:
        shutil.copyfile(installed_temp, installed)
        installed_temp.unlink()
    assert digest(target) == digest(installed)
    manifest_path = ROOT / 'dist/manifest.json'
    if manifest_path.exists():
        manifest = json.loads(manifest_path.read_text())
        for artifact in manifest.get('artifacts', []):
            if artifact['path'] == PACK_NAME: artifact.update(bytes=target.stat().st_size, sha256=digest(target))
        manifest['gymOverrides'] = {'date': '2026-10-08', 'count': 8, 'leagueCount': 13, 'receipt': 'research/test-results/kanto-gyms-simulator.json', 'liveMinecraftBattleTested': False}
        # Historical monolith equivalence evidence predates intentional gym-binding changes.
        manifest['verification']['packEquivalence'] = False
        manifest['verified'] = False
        manifest['verificationNotes'] = 'Gym field bindings intentionally differ from the old monolith baseline. See the current gym simulator receipt; previous release checks were not rerun.'
        write_json(manifest_path, manifest)
    write_json(ROOT / 'research/test-results/kanto-gyms-install.json', {
        'installed': str(installed), 'sha256': digest(installed), 'bytes': installed.stat().st_size,
        'source': str(SOURCE), 'backup': original_backup['backup'], 'gymOverrides': 8, 'leagueOverrides': 13,
        'allGymIVs31': True, 'originalCobbleversePackPreserved': True,
        'unrelatedExtensionResourcesPreserved': True, 'surgeTeamAndStructurePreserved': True,
        'liveMinecraftBattleTested': False, 'simulatorReceipt': receipt})
    print('Installed', installed, '\nSHA-256', digest(installed))

def runtime():
    """Extract actual add-on resources for simulator parity; never patch installed Showdown."""
    addon_path = PROFILE / 'mods/zamega-fabric-1.7.3.jar'
    with zipfile.ZipFile(addon_path) as z:
        addons = {}
        for mon, generation, stone in [('eelektross', 5, 'eelektrossite'), ('baxcalibur', 9, 'baxcalibrite'), ('dragonite', 1, 'dragoninite')]:
            addons[mon] = {'stone': stone, 'itemJS': z.read(f'data/zamega/mega_showdown/showdown/held_items/{stone}.js').decode('utf-8'),
                           'addition': json.loads(z.read(f'data/cobblemon/species_additions/generation{generation}/{mon}_mega.json'))}
    with zipfile.ZipFile(BASE) as z:
        controls = {}
        for gym in CAPS:
            trainer = json.loads(z.read(f'data/rctmod/trainers/kanto_{gym}.json'))
            controls[gym] = {k: trainer[k] for k in ('battleRules', 'bag', 'battleFormat')}
    saved_world = json.loads((ROOT / 'research/world-datapack-metadata.json').read_text())
    enabled = next(iter(saved_world.values()))['packs']['Enabled']
    assert enabled.index(PACK_NAME) > enabled.index(BASE.name), 'Saved pack order must prefer gym overrides'
    write_json(ROOT / 'research/test-results/kanto-gyms-runtime.json', {
        'addonSha256': digest(addon_path), 'addons': addons,
        'originalControls': controls, 'originalTrainerPackSha256': digest(BASE), 'savedWorldPackOrder': enabled})

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--author', action='store_true')
    parser.add_argument('--ship', action='store_true')
    parser.add_argument('--runtime', action='store_true')
    args = parser.parse_args()
    if args.author: author()
    elif args.ship: ship()
    elif args.runtime: runtime()
    else: parser.error('Choose --author, --runtime or --ship')
