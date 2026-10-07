"""Player-facing Field Notes for every field, written as datapack data (data/<ns>/rejuvenation/notes/<field>.json).

The 57 original fields' notes are the entries of the Pokémon Rejuvenation Wiki (https://rejuvenation.wiki.gg/wiki/Field_Effects and the per-field
pages it lists), converted to plain lines by research/wiki_notes.py from the stored snapshots in research/wiki-notes/, plus a generated "Where it appears"
section and a Source section with the license (Creative Commons Attribution-ShareAlike 4.0). The Writer below still derives the overlay lines.
The four custom fields carry hand-written notes in the same style in research/custom-fields/*.json. Output is plain text: no JSON, rule operators,
Ruby, source line numbers or developer text. Server operators can replace any file with a datapack file at the same path.
"""
from pathlib import Path
import json, math, re, subprocess, sys

sys.path.insert(0, str(Path(__file__).resolve().parent))
import wiki_notes

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'datapack/base/data/rejuvenation/rejuvenation'
NOTES = DATA / 'notes'
MAX_SECTIONS, MAX_LINES, MAX_LINE = 14, 40, 220

STATS = {'atk': 'Attack', 'def': 'Defense', 'spa': 'Special Attack', 'spd': 'Special Defense', 'spe': 'Speed', 'accuracy': 'accuracy', 'evasion': 'evasiveness'}
STATUSES = {'brn': 'burn', 'par': 'paralysis', 'psn': 'poison', 'tox': 'bad poison', 'slp': 'sleep', 'frz': 'freezing', 'ptr': 'petrification'}
VOLATILES = {'ingrain': 'takes root (Ingrain)', 'taunt': 'is taunted', 'protect': 'is shielded', 'confusion': 'becomes confused', 'trapped': 'is trapped',
             'focusenergy': 'is pumped up (critical hits become likelier)', 'charge': 'is charged', 'aquaring': 'is wrapped in a veil of water (Aqua Ring)',
             'curse': 'is cursed', 'flashfire': 'powers up its Fire moves', 'shelltrap': 'sets a shell trap', 'partiallytrapped': 'is bound', 'multiturnattack': 'is bound',
             'hyperbeam': 'must recharge', 'leechseed': 'is seeded', 'magnetrise': 'floats on magnetism', 'substitute': 'makes a substitute', 'laserfocus': 'focuses'}
WEATHER = {'sunnyday': 'Sun', 'raindance': 'Rain', 'sandstorm': 'Sandstorm', 'hail': 'Hail', 'snow': 'Snow', 'shadowsky': 'Shadow Sky'}


def join(items, word='and'):
    items = list(items)
    if not items: return ''
    if len(items) == 1: return items[0]
    return ', '.join(items[:-1]) + (',' if len(items) > 2 else '') + f' {word} ' + items[-1]


def mult(m):
    text = ('%.2f' % m).rstrip('0').rstrip('.')
    return text + '×'


class Names:
    def __init__(self, abilities):
        data = json.loads((ROOT / 'research/display-names.json').read_text(encoding='utf-8'))
        self.moves, self.abilities, self.items = data['moves'], dict(data['abilities']), data['items']
        for aid, row in abilities.items(): self.abilities[aid] = row['name']
        self.items.update({'elementalseed': 'Elemental Seed', 'magicalseed': 'Magical Seed', 'telluricseed': 'Telluric Seed', 'syntheticseed': 'Synthetic Seed',
                           'amplifieldrock': 'Amplifield Rock', 'amuletcoin': 'Amulet Coin'})
    def move(self, mid): return self.moves.get(mid)
    def ability(self, aid): return self.abilities.get(aid)
    def item(self, iid): return self.items.get(iid)
    def moves_text(self, ids, word='and'):
        names = sorted({self.moves[m] for m in ids if m in self.moves})
        return join(names, word) if names else None


def field_label(fields, fid):
    name = fields[fid]['name']
    name = name[:-6] if name.endswith(' Field') else name
    stage = (fields[fid].get('progression') or {}).get('stage')
    return f'{name} {stage}' if stage else name


class Writer:
    """One field's notes, built line by line with the exact-or-omit rule."""
    def __init__(self, fields, names, indoor_rules, indoor_handlers):
        self.fields, self.names, self.indoor_rules, self.indoor_handlers = fields, names, indoor_rules, indoor_handlers
        self.skipped = 0

    # ---- conditions: only forms that can be stated exactly return text; anything else returns None (the caller omits the clause)
    def cond(self, c):
        k, v = next(iter(c.items()))
        if k == 'always': return ''
        if k == 'category': return v.lower() + ' '
        if k == 'hp' and v.get('who') == 'target' and v['op'] == '<=' and v.get('fraction') == 0.5: return 'against targets at or below half HP '
        return None

    def type_rows(self, f):
        """Type power: 'Fire moves are 1.5× stronger.' grouped by multiplier."""
        groups = {}
        for row in f['types']:
            if 'multiplier' not in row: continue
            condition = self.cond(row['condition'])
            if condition is None: self.skipped += 1; continue
            match = row['match']
            if 'flag' in match: subject = {'sound': 'sound-based', 'wind': 'wind', 'slicing': 'slicing'}.get(match['flag'], match['flag']) + ' moves'
            else: subject = condition + match['moveType'] + ' moves'
            groups.setdefault(row['multiplier'], []).append(subject)
        lines = []
        for m, subjects in sorted(groups.items(), key=lambda kv: -kv[0]):
            if m == 0: lines.append(f'{join(subjects).capitalize()} fail.')
            elif m == 0.5: lines.append(f'{join(subjects).capitalize()} are halved (0.5×).')
            elif m > 1: lines.append(f'{join(subjects).capitalize()} are {mult(m)} stronger.')
            else: lines.append(f'{join(subjects).capitalize()} are weakened to {mult(m)}.')
        return lines

    def move_rows(self, f):
        power, accuracy, typing = {}, {}, {}
        for mid, row in f['moves'].items():
            if mid not in self.names.moves: continue
            if row.get('multiplier') not in (None, 1): power.setdefault(row['multiplier'], []).append(mid)
            if 'accuracy' in row: accuracy.setdefault(row['accuracy'], []).append(mid)
            if 'additionalType' in row: typing.setdefault(row['additionalType'].title(), []).append(mid)
        lines = []
        for m, ids in sorted(power.items(), key=lambda kv: -kv[0]):
            text = self.names.moves_text(ids)
            if m == 0: lines.append(f'{text}: no effect here.')
            elif m == 0.5: lines.append(f'{text}: halved (0.5×).')
            elif m > 1: lines.append(f'{text}: {mult(m)} stronger.')
            else: lines.append(f'{text}: weakened to {mult(m)}.')
        for a, ids in sorted(accuracy.items()):
            text = self.names.moves_text(ids)
            lines.append(f'{text}: never miss.' if a == 0 else f'{text}: {a}% accuracy.')
        extra = [f'{self.names.moves_text(ids)} also {"counts" if len(ids) == 1 else "count"} as {t} for type matchups.' for t, ids in sorted(typing.items())]
        for row in f['types']:
            if row.get('additionalType'):
                condition = self.cond(row['condition'])
                if condition is not None:
                    subject = ('wind' if row['match'].get('flag') == 'wind' else row['match'].get('flag', '')) or row['match'].get('moveType', '')
                    extra.append(f'{(condition + subject + " moves").capitalize()} also count as {row["additionalType"].title()} for type matchups.')
        return lines, extra

    # ---- field changes
    def simplify(self, c, mid):
        """Resolve the parts of a transition condition that depend only on the move; what remains depends on the battle."""
        k, v = next(iter(c.items()))
        if k == 'always': return True
        if k == 'move': return v == mid
        if k == 'not':
            s = self.simplify(v, mid)
            return (not s) if isinstance(s, bool) else {'not': s}
        if k in ('all', 'any'):
            items = [self.simplify(x, mid) for x in v]
            decisive = False if k == 'all' else True
            if any(i is decisive for i in items): return decisive
            items = [i for i in items if not isinstance(i, bool)]
            if not items: return not decisive
            return items[0] if len(items) == 1 else {k: items}
        return c

    def phrase(self, c):
        """Text for what remains after simplify, or None when it cannot be stated exactly."""
        if c is True: return ''
        k, v = next(iter(c.items()))
        if k == 'backup': return f'{field_label(self.fields, v)} lies beneath'
        if k == 'connected': return 'the move connects'
        if k == 'not' and next(iter(v)) == 'missed': return 'the move does not miss'
        if k == 'all':
            parts = [self.phrase(x) for x in v]
            return None if None in parts else ' and '.join(p for p in parts if p)
        if k == 'any' and all(next(iter(x)) == 'backup' for x in v): return join([field_label(self.fields, x['backup']) for x in v], 'or') + ' lies beneath'
        return None

    def transitions(self, f):
        groups, counters = {}, {}
        for mid, row in f['moves'].items():
            t = row.get('transition')
            if not t or mid not in self.names.moves: continue
            cond = self.simplify(t['condition'], mid)
            if cond is False: continue
            if row.get('counter'): counters[mid] = row['counter']
            key = (t['field'], json.dumps(cond, sort_keys=True), bool(t.get('push')))
            groups.setdefault(key, []).append(mid)
        lines = []
        for (dest, cond_json, push), ids in sorted(groups.items(), key=lambda kv: kv[0]):
            cond = json.loads(cond_json)
            names = self.names.moves_text(ids)
            plural = len(ids) > 1
            label = field_label(self.fields, dest) if dest != 'rejuvenation:indoor' else None
            counter = cond if isinstance(cond, dict) and next(iter(cond)) == 'counter' else None
            extra = ''
            if counter:
                c = counter['counter']
                need = c['value'] + (1 if c['op'] == '>' else 0)
                parts = [f'{self.names.moves[m]} {counters[m]["amount"]}' for m in sorted(ids, key=lambda m: self.names.moves[m]) if m in counters]
                extra = f' once their uses add up to {need}' + (f' ({join(parts)})' if parts else '') if c['op'] != '==' else None
                if extra is None: self.skipped += 1; continue
                cond = True
            text = self.phrase(cond) if cond is not True else ''
            if text is None: self.skipped += 1; continue
            when = (f' when {text}' if text else '') + extra
            verb = lambda one, many: many if plural else one
            if label is None: lines.append(f'{names} {verb("breaks", "break")} the field apart{when}, exposing whatever lay beneath it.')
            else: lines.append(f'{names} {verb("changes", "change")} the field into {label}{when}.' + (' The old field returns when the new one ends or is removed.' if push else ''))
        return lines

    def entry_hooks(self, f):
        lines = []
        if f.get('mimicry'): lines.append(f'Mimicry and Camouflage turn Pokémon {f["mimicry"]}-type.')
        if f.get('naturePower') and f['naturePower'] in self.names.moves: lines.append(f'Nature Power becomes {self.names.moves[f["naturePower"]]}.')
        effects = []
        for e in f.get('secretPowerEffects') or []:
            if 'status' in e: effects.append(STATUSES.get(e['status'], e['status']))
            elif e.get('volatileStatus') == 'flinch': effects.append('flinching')
            elif e.get('volatileStatus') == 'confusion': effects.append('confusion')
            elif 'boosts' in e: effects.append(join(f'{"raise" if v > 0 else "lower"} the target\'s {STATS[k]}' for k, v in e['boosts'].items()))
            else: self.skipped += 1
        if effects:
            plain = [e for e in effects if not e.startswith(('raise', 'lower'))]
            stat = [e for e in effects if e.startswith(('raise', 'lower'))]
            if plain: lines.append('Secret Power can cause ' + join(sorted(set(plain)), 'or') + '.')
            if stat: lines.append('Secret Power can ' + join(sorted(set(stat)), 'or') + '.')
        return lines

    def seed(self, f):
        s = f.get('seed')
        if not s: return []
        item = self.names.item(s['item']) or s['item']
        parts = []
        for stat, n in s.get('stats', {}).items(): parts.append(f'{STATS[stat]} {"+" if n > 0 else "−"}{abs(n)}')
        eff = s.get('effect')
        move = lambda raw: self.names.move(re.sub(r'[^a-z0-9]', '', str(raw).lower()))
        if eff in ('multiturnattack', 'partiallytrapped'): parts.append(f'is bound by {move(s.get("duration")) or "a trapping move"}')
        elif eff == 'protect': parts.append(f'is shielded as by {move(s.get("duration")) or "Protect"}')
        elif eff: parts.append(VOLATILES.get(eff, 'gains a special effect'))
        for a in f.get('seedActions') or []:
            op = a['op']
            if op == 'ability': parts.append(f'its ability becomes {self.names.ability(a["id"]) or a["id"]}')
            elif op == 'status': parts.append('suffers ' + STATUSES.get(a['status'], a['status']))
            elif op == 'type': parts.append(f'becomes {a["type"]}-type')
            elif op == 'volatile': parts.append(VOLATILES.get(a['id'], 'gains a special effect'))
            elif op == 'bothHazards': parts.append('scatters Stealth Rock on both sides')
            elif op == 'typedDamage': parts.append(f'is hurt by {a["type"]}-type debris')
            elif op == 'spikeDamage': parts.append('is hurt by icy spikes')
            elif op == 'trickRoom': parts.append('warps the room (Trick Room)')
            elif op == 'wish': parts.append('receives a Wish')
            elif op == 'perishSong': parts.append('is afflicted by Perish Song')
            elif op == 'weightDelta': parts.append('becomes heavier')
            else: self.skipped += 1
        return [f'{item}: ' + (join(parts) if parts else 'a field-specific effect') + '.'] if parts else []

    def progression(self, f):
        p = f.get('progression')
        if not p: return []
        name = 'garden' if p['group'] == 'flower_garden' else 'crowd'
        lines = [f'Stage {p["stage"]} of {p["maximum"]}: the {name} grows through its stages and shrinks again.']
        grow = [r for r in f['rules'] if any(a['op'] == 'progress' for a in r['actions']) and 'ability' in r['condition']]
        abilities = sorted({self.names.ability(x) for r in grow for x in r['condition']['ability']['values'] if self.names.ability(x)})
        if abilities: lines.append(f'Entering Pokémon with {join(abilities, "or")} grow it.')
        lines.append('Seeds grow it. Lowering accuracy or raising evasion shrinks it.')
        return lines

    # ---- rules the module can state exactly
    def specific(self, f):
        rules = [r for r in f['rules'] if json.dumps(r, sort_keys=True) not in self.indoor_rules]
        handlers = {k: v for k, v in f.get('abilityHandlers', {}).items() if json.dumps(v, sort_keys=True) != self.indoor_handlers.get(k)}
        return rules, handlers

    def abilities(self, f):
        rules, handlers = self.specific(f)
        lines, each_turn = [], []
        for r in rules:
            cond, event, actions = r['condition'], r['event'], r['actions']
            who = None
            ab = cond.get('ability') or (cond['all'][0].get('ability') if 'all' in cond and cond['all'] and 'ability' in cond['all'][0] else None)
            if ab and ab.get('who') == 'user': who = [self.names.ability(x) for x in ab['values'] if self.names.ability(x)]
            if not who:
                if event == 'setStatus' and cond.get('status') == 'frz': lines.append('Pokémon cannot be frozen.'); continue
                if event == 'residual' and len(actions) == 1 and actions[0]['op'] == 'heal' and 'all' in cond:
                    t = [c for c in cond['all'] if 'type' in c]
                    grounded = any('grounded' in c for c in cond['all'])
                    if t and grounded and 'groupMessage' in actions[0]:
                        each_turn.append(f'Grounded {t[0]["type"]["value"]}-type Pokémon recover {self.frac(actions[0]["fraction"])} of their HP.'); continue
                self.skipped += 1; continue
            label = join(sorted(who), 'or')
            if event == 'switchIn' and actions[0]['op'] == 'boost':
                lines.append(f'{label}: ' + self.boosts(actions[0]['stats']) + ' when it enters.')
            elif event == 'switchIn' and actions[0]['op'] == 'progress': pass
            elif event == 'residual' and actions[0]['op'] == 'heal': each_turn.append(f'{label} restores {self.frac(actions[0]["fraction"])} of its HP.')
            elif event == 'residual' and actions[0]['op'] == 'boost': each_turn.append(f'{label}: ' + self.boosts(actions[0]['stats']) + '.')
            elif event in ('attack', 'specialAttack') and actions[0]['op'] == 'multiply' and not isinstance(actions[0].get('value'), bool):
                both = any(o['event'] == ('specialAttack' if event == 'attack' else 'attack') and o['condition'] == cond and o['actions'][0].get('value') == actions[0]['value'] for o in rules)
                if event == 'attack' or not both: lines.append(f'{label}: {mult(actions[0]["value"])} ' + ('damage' if both else 'physical damage' if event == 'attack' else 'special damage') + '.')
            else: self.skipped += 1
        for aid, callbacks in handlers.items():
            name = self.names.ability(aid)
            if not name: continue
            for key, row in callbacks.items():
                a = row['actions']
                if len(a) == 1 and a[0]['op'] == 'multiply' and key in ('onModifyDef', 'onModifySpD') and row['condition'] == {'always': True}: lines.append(f'{name}: {mult(a[0]["value"])} {"Defense" if key == "onModifyDef" else "Special Defense"}.')
                elif len(a) == 1 and a[0]['op'] == 'multiply' and key in ('onModifyAtk', 'onModifySpA') and 'moveType' in row['condition']: lines.append(f'{name}: {mult(a[0]["value"])} power for {row["condition"]["moveType"]}-type moves.')
                elif key == 'onBasePower' and len(a) == 1 and a[0]['op'] == 'multiply' and row['condition'] == {'flag': 'sound'}: lines.append(f'{name}: {mult(a[0]["value"])} power for sound-based moves.')
                else: self.skipped += 1
        for aid in sorted(f.get('indirectImmunityAbilities') or []):
            if self.names.ability(aid): lines.append(f'{self.names.ability(aid)} also protects against the field\'s own damage.')
        return sorted(set(lines)), sorted(set(each_turn))

    def frac(self, v):
        for n, d in ((1, 16), (1, 8), (1, 6), (1, 4), (1, 3), (1, 2)):
            if abs(v - n / d) < 0.002: return f'{n}/{d}'
        return f'{round(v * 100)}%'

    def boosts(self, stats):
        ups = [f'{STATS[k]} +{v}' for k, v in stats.items() if v > 0]; downs = [f'{STATS[k]} −{-v}' for k, v in stats.items() if v < 0]
        return join(ups + downs)

    def each_turn(self, f):
        lines = []
        for r in f['rules']:
            if json.dumps(r, sort_keys=True) in self.indoor_rules: continue
            if r['event'] == 'residual' and r['actions'][0]['op'] in ('residualDamage', 'damage') and 'message' in r['actions'][0] and 'all' in r['condition']:
                a = r['actions'][0]
                clause = re.sub(r'^(The )?Pok.mon (were |are )?|^\{1\}(\'s)? ', '', a['message']).rstrip('!.').strip()
                who = self.affected(r['condition'])
                if who is not None and 'fraction' in a: lines.append(f'Each turn, {who} lose {self.frac(a["fraction"])} of their maximum HP ({clause}).')
        hz = f.get('hazardPolicy') or {}
        if hz.get('suspended'): lines.append('Entry hazards (Spikes, Stealth Rock, Sticky Web, Toxic Spikes) are suspended while this field lasts.')
        elif hz.get('cleared'): lines.append('This field sweeps away entry hazards.')
        return lines

    def affected(self, condition):
        """Who a per-turn field effect hits, when the condition is made only of groundedness, type, ability and a few volatile exclusions."""
        items = condition['all'] if 'all' in condition else [condition]
        flat = []
        for c in items: flat.extend(c['all'] if 'all' in c else [c])
        words, spared, types, abilities = [], [], [], []
        for c in flat:
            k, v = next(iter(c.items()))
            if k == 'grounded' and v == {'who': 'user', 'value': True}: words.append('grounded')
            elif k == 'not' and next(iter(v)) == 'type' and v['type']['who'] == 'user': types.append(v['type']['value'])
            elif k == 'not' and next(iter(v)) == 'ability' and v['ability']['who'] == 'user': abilities.extend(self.names.ability(a) for a in v['ability']['values'])
            elif k == 'not' and next(iter(v)) == 'volatile' and v['volatile']['who'] == 'user' and v['volatile']['id'] in ('aquaring', 'dig', 'dive'): spared.append({'aquaring': 'Aqua Ring', 'dig': 'Dig', 'dive': 'Dive'}[v['volatile']['id']])
            elif k == 'not' and next(iter(v)) == 'globalAbility': pass
            elif k == 'ability' and c.get('ability', {}).get('who') == 'user': return None
            else: return None
        if abilities and None in abilities: return None
        who = 'Pokémon'
        if words: who = 'grounded Pokémon'
        if types: who += ' that are not ' + join(types, 'or') + '-type'
        if spared: who += f' (not those using {join(spared, "or")})'
        if abilities: who += ' without ' + join(sorted(set(abilities)), 'or')
        return who

    def weather_status(self, f):
        lines = []
        for r in f['rules']:
            if json.dumps(r, sort_keys=True) in self.indoor_rules: continue
            if r['event'] == 'setWeather' and 'incomingWeather' in r['condition']:
                names = [WEATHER.get(w, w) for w in r['condition']['incomingWeather']]
                lines.append(f'{join(names)} cannot be started here.')
            elif r['event'] == 'setWeather' and r['condition'] == {'always': True}: lines.append('Weather cannot be started here.')
            elif r['event'] == 'fieldResidual' and r['actions'][0]['op'] == 'changeField' and 'weather' in r['condition']:
                lines.append(f'{WEATHER.get(r["condition"]["weather"], r["condition"]["weather"])} changes the field into {field_label(self.fields, r["actions"][0]["field"])} at the end of the turn.')
        conv = f.get('weatherConversions')
        if conv: lines.append('; '.join(f'{WEATHER.get(a, a)} becomes {WEATHER.get(b, b)}' for a, b in conv.items()) + '.')
        return sorted(set(lines))

    def overlay(self, f):
        o = f.get('overlay')
        if not o: return []
        probe = {'types': o['types'], 'moves': o['moves']}
        lines = self.type_rows(probe)
        rows, extra = self.move_rows(probe)
        return lines + rows + extra


def section(heading, lines):
    lines = [l for l in lines if l]
    return {'heading': heading, 'lines': lines[:MAX_LINES]} if lines else None


def source_section(field_id):
    """The attribution every wiki-derived note carries (the wiki text is licensed Creative Commons Attribution-ShareAlike 4.0)."""
    row = wiki_notes.source_row(field_id)
    page = wiki_notes.PAGES[field_id].replace('_', ' ')
    stage = ' (the text of this stage)' if field_id in wiki_notes.STAGE else ''
    return {'heading': 'Source', 'lines': [
        f'Adapted from the Pokémon Rejuvenation Wiki page “{page}”{stage}, revision {row["revid"]}: {row["url"]}',
        f'Text licensed under {wiki_notes.LICENSE} (https://creativecommons.org/licenses/by-sa/4.0/). Wiki markup, links and images were removed; the wording is otherwise unchanged.']}


def build_original(f, writer, biomes, structures):
    """A note for one of the 57 original fields: the wiki's entry for the field, a generated "Where it appears" section and the source line."""
    fid = f['id'].split(':')[1]
    wiki = wiki_notes.load(fid)
    overlay = writer.overlay(f)
    where = biomes.get(f['id'], [])
    flavor = wiki['flavor'] or ('“' + ' '.join(f['entryMessage'].split()) + '”' if f['entryMessage'] else 'No field: ordinary battle rules apply.')
    sections = [dict(s) for s in wiki['sections']]
    if where: sections.insert(0, {'heading': 'Where it appears', 'lines': [where]})
    sections.append(source_section(fid))
    doc = {'schemaVersion': 1, 'field': f['id'], 'title': f['name'], 'summary': flavor, 'sections': sections}
    if overlay: doc['overlay'] = overlay[:MAX_LINES]
    if f['id'] in ('rejuvenation:icy', 'rejuvenation:snowy_mountain'):
        doc['substrateText'] = 'When the ' + ('ice' if f['id'].endswith('icy') else 'snow') + ' is melted or broken, the ground beneath it ({substrate}) is restored instead of the usual replacement.'
    return doc


STRUCTURE_NAMES = {'rejuvenation:city': 'generated villages (vanilla and modded variants)', 'rejuvenation:back_alley': 'Woodland Mansions',
                   'rejuvenation:colosseum': 'Bastion Remnants and Nether Fortresses (and their variants)', 'rejuvenation:deep_dark': 'Ancient Cities'}


def biome_lines(fields):
    rows = json.loads((ROOT / 'research/biome-mapping.json').read_text(encoding='utf-8'))
    out, over = {}, {}
    for row in rows:
        if row['biome'].startswith('terralith:'): continue
        name = row['biome'].split(':')[1].replace('_', ' ').title()
        out.setdefault(row['field'], []).append(name)
        if row.get('substrate'): over.setdefault(row['field'], {})[name] = field_label(fields, row['substrate'])
    pretty = {}
    for fid in sorted({*out, *STRUCTURE_NAMES}):
        parts = []
        names = sorted(set(out.get(fid, [])))
        if names:
            shown = [n + (f' (over {over[fid][n]})' if n in over.get(fid, {}) else '') for n in names[:8]]
            parts.append('Natural battles in ' + join(shown) + (f' and {len(names) - 8} more biomes' if len(names) > 8 else '') + '.')
        if fid in STRUCTURE_NAMES: parts.append('Battles inside ' + STRUCTURE_NAMES[fid] + '.')
        pretty[fid] = ' '.join(parts)
    return pretty


def split_line(text, limit=800):
    """Long lists (move names) become several lines at a comma, each within the notes' per-line bound."""
    out = []
    while len(text) > limit:
        cut = text.rfind(', ', 0, limit)
        if cut <= 0: cut = text.rfind(' ', 0, limit)
        if cut <= 0: cut = limit
        out.append(text[:cut + 1].rstrip()); text = text[cut + 1:].lstrip()
    return out + [text]


def finalize_lines(doc):
    """Every line is whitespace-normalised and split to the per-line bound that FieldNotes enforces."""
    for s in doc['sections']:
        s['lines'] = [part for l in s['lines'] for part in split_line(re.sub(r'\s+', ' ', l).strip())]
    return doc


def custom_document(f, spec, where=None):
    """Field Notes for a custom field: its authored summary/sections/counters, preceded by a generated "Where it appears" line.

    Shared by the production build and the authoring example builder so both produce the same shape.
    """
    n = spec['notes']
    doc = {'schemaVersion': 1, 'field': f['id'], 'title': f['name'], 'summary': n['summary'], 'sections': [dict(s) for s in n['sections']], 'counters': n.get('counters', [])}
    if where: doc['sections'] = [{'heading': 'Where it appears', 'lines': [where]}] + doc['sections']
    return finalize_lines(doc)


MARKDOWN = ROOT / 'field-notes/FIELD_NOTES.md'
MARKDOWN_HEADER = f'''# Field Notes

The text of the Field Notes of all 61 fields, exactly as the mod shows it in the Field Notes overlay (the files under `datapack/base/data/rejuvenation/rejuvenation/notes/`).
This file is generated by `python research/generate.py` (`research/field_notes.py`); edit the sources, not this file.

## Source and license

* The notes of the 57 original fields are the entries of the Pokémon Rejuvenation Wiki (https://rejuvenation.wiki.gg/wiki/Field_Effects and the field pages it lists), taken from the revisions recorded in `research/wiki-notes/sources.json`. Wiki markup, links and images were removed; the wording is otherwise unchanged. The "Where it appears" sections are this mod's.
* The notes of Deep Dark, Crimson Forest, Warped Forest and Pale Garden are written for this mod in the same style (`research/custom-fields/*.json`).
* The wiki text is licensed under {wiki_notes.LICENSE} (https://creativecommons.org/licenses/by-sa/4.0/). This file and the note files adapt it and are shared under the same license. The Pokémon Rejuvenation Wiki and Pokémon Rejuvenation are not affiliated with this project.
'''


def write_markdown(written, fields):
    """One markdown file with every note's text, in the order of the notes' own sections."""
    out = [MARKDOWN_HEADER]
    stage = lambda d: (fields[d['field']].get('progression') or {}).get('stage')
    label = lambda d: d['title'] + (f' (Stage {stage(d)})' if stage(d) else '')  # the staged fields share one title in the overlay
    ordered = sorted(written.values(), key=lambda d: (d['field'] != 'rejuvenation:indoor', d['title'].lower(), stage(d) or 0))
    out += ['## Contents', '']
    out.extend(f'* {label(d)}' for d in ordered)
    for d in ordered:
        out += ['', f'## {label(d)}', '', f'> {d["summary"]}']
        for sec in d['sections']:
            out += ['', f'### {sec["heading"]}', ''] + [f'* {line}' for line in sec['lines']]
        if d.get('overlay'):
            out += ['', '### When it is an overlay terrain', ''] + [f'* {line}' for line in d['overlay']]
        if d.get('counters'):
            out += ['', '### Counters shown in the overlay', '']
            for c in d['counters']:
                out.append(f'* {c["label"]} (0 to {c["maximum"]}, {"shared by both sides" if c["scope"] == "shared" else "one for each side"})')
                out += [f'  * At {t["at"]}: {t["text"]}' for t in c.get('thresholds', [])]
        if d.get('substrateText'): out += ['', '### Restored ground', '', f'* {d["substrateText"]}']
    MARKDOWN.parent.mkdir(parents=True, exist_ok=True)
    MARKDOWN.write_text('\n'.join(out) + '\n', encoding='utf-8', newline='\n')


def build(fields, custom_specs):
    subprocess.run(['node', str(ROOT / 'research/inspect_registry.cjs')], check=True, stdout=subprocess.DEVNULL)
    abilities = json.loads((DATA / 'abilities/source.json').read_text(encoding='utf-8'))['abilities']
    names = Names(abilities)
    by_id = {f['id']: f for f in fields.values()}
    indoor = by_id['rejuvenation:indoor']
    indoor_rules = {json.dumps(r, sort_keys=True) for r in indoor['rules']}
    indoor_handlers = {k: json.dumps(v, sort_keys=True) for k, v in indoor.get('abilityHandlers', {}).items()}
    writer = Writer(by_id, names, indoor_rules, indoor_handlers)
    where = biome_lines(by_id)
    NOTES.mkdir(parents=True, exist_ok=True)
    for stale in NOTES.glob('*.json'): stale.unlink()
    written = {}
    for f in by_id.values():
        spec = next((s for s in custom_specs if s['id'] == f['id']), None)
        doc = custom_document(f, spec, where.get(f['id'])) if spec else finalize_lines(build_original(f, writer, where, []))
        text = json.dumps(doc, indent=2, ensure_ascii=False) + '\n'
        (NOTES / (f['id'].split(':')[1] + '.json')).write_text(text, encoding='utf-8')
        written[f['id']] = doc
    write_markdown(written, by_id)
    return written, writer.skipped
