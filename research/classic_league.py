"""Derive the Classic Kanto league rosters from the Hardcore ones.

    python research/classic_league.py

Hardcore (datapack/kanto-hardcore) is the original roster override and is never edited here. Classic (datapack/kanto-classic) is the same 13
trainer files with only the balance changes listed in CLASSIC_CHANGES applied: every other field (levels, caps, IVs, AI block, battle rules, bag,
battle format, Mega/Tera/Z policy, order) is copied from Hardcore unchanged. New Pokemon are built with the same helper that authored the
Hardcore sets (update_kanto_gyms.make_team), so item and form IDs are resolved against the installed mods.

Choices the request left open (recorded in README_KANTO_CLASSIC.md):
  * Mega Dragalge: pre-Mega ability Adaptability (Dragalge's hidden ability), nature Modest (no nature was given; its Speed is 44 and the EVs are in SpA).
  * Typhlosion-Hisui: ability Blaze, Tera Grass (the owner's decision: Blaine keeps one Tera user, and Tera Blast replaces Focus Blast).
  * Ferrothorn: ability Iron Barbs. Toxtricity: Low-Key form (Timid is a Low-Key nature), ability Punk Rock.
  * Blue's replacement spreads (all 508 EVs): see BLUE_EVS.
"""
from pathlib import Path
import copy, json, sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
import update_kanto_gyms as authoring

ROOT = Path(__file__).resolve().parents[1]
HARDCORE = ROOT / 'datapack/kanto-hardcore/data/rctmod/trainers'
CLASSIC = ROOT / 'datapack/kanto-classic/data/rctmod/trainers'
STATS = authoring.STATS

# name | item | ability | nature | EVs | moves | Tera | aspects   (same row format as update_kanto_gyms.SETS)
NEW_SETS = {
    'ferrothorn': 'Ferrothorn|Rocky Helmet|Iron Barbs|Adamant|252 HP / 252 Atk / 4 SpD|Power Whip, Gyro Ball, Leech Seed, Knock Off||',
    'dragalge': 'Dragalge|Dragalgite|Adaptability|Modest|252 HP / 252 SpA / 4 SpD|Sludge Bomb, Draco Meteor, Flip Turn, Focus Blast||',
    'typhlosion': 'Typhlosion|Charcoal Stick|Blaze|Timid|4 Def / 252 SpA / 252 Spe|Eruption, Flamethrower, Extrasensory, Tera Blast|Grass|hisuian',
    'toxtricity': 'Toxtricity|Silk Scarf|Punk Rock|Timid|4 Def / 252 SpA / 252 Spe|Boomburst, Overdrive, Sludge Bomb, Protect|Normal|low_key-form',
}

# Blue: normal competitive spreads (508 EVs each), natures unchanged.
BLUE_EVS = {
    'hawlucha': '252 Atk / 4 SpD / 252 Spe', 'ironvaliant': '4 Def / 252 SpA / 252 Spe', 'kingambit': '252 HP / 252 Atk / 4 SpD',
    'ursaluna': '252 HP / 252 SpA / 4 SpD', 'metagross': '252 Atk / 4 SpD / 252 Spe', 'arceus': '4 Def / 252 SpA / 252 Spe',
}


_resources = None


def resources():
    global _resources
    if _resources is None: _resources = authoring.resources()
    return _resources


def load(gym): return json.loads((HARDCORE / f'kanto_{gym}.json').read_text(encoding='utf-8'))


def member(trainer, species):
    found = [m for m in trainer['team'] if m['species'] == species]
    assert len(found) == 1, (species, len(found))
    return found[0]


def swap_move(mon, old, new):
    assert old in mon['moveset'] and new not in mon['moveset'], (mon['species'], old, new, mon['moveset'])
    mon['moveset'][mon['moveset'].index(old)] = new


def set_item(mon, item_id):
    mon['heldItem'] = [item_id]


def spread(text):
    evs = dict.fromkeys(STATS, 0)
    for part in text.split(' / '):
        value, stat = part.split()
        evs[stat.lower()] = int(value)
    assert sum(evs.values()) <= 510 and all(0 <= v <= 252 for v in evs.values())
    return evs


def replace_member(trainer, old_species, key, level):
    """Swap one team member for a new set in the same slot; returns the new member."""
    species, items = resources()
    # make_team insists on a full team of six rows; build six copies of the row and keep the first.
    new = authoring.make_team('\n'.join([NEW_SETS[key]] * 6), level, species, items)[0]
    slot = [i for i, m in enumerate(trainer['team']) if m['species'] == old_species]
    assert len(slot) == 1, old_species
    trainer['team'][slot[0]] = new
    return new, slot[0]


def retarget_tera(trainer):
    """Keep the AI block in step with the single declared Tera member (the same rule the Hardcore files follow)."""
    targets = [m['species'] for m in trainer['team'] if m['gimmicks']['tera']]
    assert len(targets) == 1, targets
    trainer['ai']['data'].update(canTera=True, teraTarget=targets[0])


def classic():
    out = {gym: load(gym) for gym in authoring.CAPS}

    # Lt. Surge
    swap_item = member(out['ltsurge'], 'ironhands'); assert swap_item['heldItem'] == ['mega_showdown:booster_energy']
    set_item(swap_item, 'cobblemon:expert_belt')

    # Erika: Kartana -> Ferrothorn (same slot)
    replace_member(out['erika'], 'kartana', 'ferrothorn', authoring.CAPS['erika'])

    # Sabrina: Mega Alakazam
    swap_move(member(out['sabrina'], 'alakazam'), 'calmmind', 'shadowball')

    # Koga: Nasty Plot / Swords Dance out, Mega Gengar -> Mega Dragalge in slot 2
    swap_move(member(out['koga'], 'naganadel'), 'nastyplot', 'darkpulse')
    swap_move(member(out['koga'], 'sneasler'), 'swordsdance', 'knockoff')
    dragalge, slot = replace_member(out['koga'], 'gengar', 'dragalge', authoring.CAPS['koga'])
    team = out['koga']['team']
    team.insert(1, team.pop(slot))
    assert [m['species'] for m in team] == ['glimmora', 'dragalge', 'pecharunt', 'sneasler', 'naganadel', 'cinderace'], [m['species'] for m in team]

    # Blaine: Chi-Yu -> Typhlosion-Hisui (Tera Grass, Tera Blast)
    replace_member(out['blaine'], 'chiyu', 'typhlosion', authoring.CAPS['blaine'])
    retarget_tera(out['blaine'])

    # Giovanni: Chien-Pao -> Toxtricity, Tera moves with it
    replace_member(out['giovanni'], 'chienpao', 'toxtricity', authoring.CAPS['giovanni'])
    retarget_tera(out['giovanni'])

    # Lorelei
    swap_move(member(out['league_lorelei'], 'calyrex'), 'swordsdance', 'crunch')
    arctovish = member(out['league_lorelei'], 'arctovish'); assert arctovish['heldItem'] == ['cobblemon:choice_band']
    set_item(arctovish, 'cobblemon:chople_berry')

    # Bruno
    swap_move(member(out['league_bruno'], 'terrakion'), 'swordsdance', 'poisonjab')
    swap_move(member(out['league_bruno'], 'lucario'), 'swordsdance', 'crunch')

    # Agatha: Basculegion
    bascule = member(out['league_agatha'], 'basculegion'); assert bascule['heldItem'] == ['cobblemon:choice_scarf']
    set_item(bascule, 'cobblemon:clear_amulet'); bascule['nature'] = 'adamant'; bascule['evs'] = spread('252 HP / 252 Atk / 4 SpD')

    # Lance: only Mega Dragonite keeps Dragon Dance
    swap_move(member(out['league_lance'], 'haxorus'), 'dragondance', 'closecombat')
    swap_move(member(out['league_lance'], 'roaringmoon'), 'dragondance', 'earthquake')
    swap_move(member(out['league_lance'], 'necrozma'), 'dragondance', 'sunsteelstrike')
    assert [m['species'] for m in out['league_lance']['team'] if 'dragondance' in m['moveset']] == ['dragonite']

    # Blue: normal EV spreads
    for mon in out['champion_blue']['team']: mon['evs'] = spread(BLUE_EVS[mon['species']])

    return out


def main():
    CLASSIC.mkdir(parents=True, exist_ok=True)
    changed = []
    for gym, trainer in classic().items():
        text = json.dumps(trainer, indent=2) + '\n'
        original = (HARDCORE / f'kanto_{gym}.json').read_text(encoding='utf-8')
        if text != original: changed.append(gym)
        # CRLF like every other file in this working tree (git stores LF); the comparison above is line-ending blind.
        (CLASSIC / f'kanto_{gym}.json').write_text(text, encoding='utf-8', newline='\r\n')
    print('Classic trainer files written; differ from Hardcore:', ', '.join(changed))
    unchanged = sorted(set(authoring.CAPS) - set(changed))
    print('Identical to Hardcore:', ', '.join(unchanged))


if __name__ == '__main__': main()
