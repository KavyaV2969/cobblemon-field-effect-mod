"""Field Notes text from the Pokémon Rejuvenation Wiki, converted from the stored wikitext snapshots.

The text of each field's wiki page is used as written (only wiki markup is removed: links, bold/italic, templates, images, tables become plain
lines). The snapshots live in research/wiki-notes/ with their revision numbers (research/wiki-notes/sources.json); `python research/wiki_notes.py --refresh`
downloads them again. The wiki text is licensed Creative Commons Attribution-ShareAlike 4.0; the notes and docs/field-notes/FIELD_NOTES.md
carry the attribution and that license.

convert(wikitext, stage=None) -> {'flavor': str|None, 'sections': [{'heading': str, 'lines': [str]}]}
"""
from pathlib import Path
import json, re, sys, time, urllib.parse, urllib.request

ROOT = Path(__file__).resolve().parents[1]
DIR = ROOT / 'research/wiki-notes'
SOURCES = DIR / 'sources.json'
API = 'https://rejuvenation.wiki.gg/api.php'
LICENSE = 'Creative Commons Attribution-ShareAlike 4.0'
#: our field id -> (wiki page, stage number for the Flower Garden stages)
PAGES = {
    'back_alley': 'Back Alley', 'beach': 'Beach', 'bewitched': 'Bewitched Woods', 'big_top': 'Big Top Arena', 'cave': 'Cave', 'chess_board': 'Chess Board', 'city': 'City',
    'colosseum': 'Colosseum Field', 'concert_1': 'Concert Venue', 'concert_2': 'Concert Venue', 'concert_3': 'Concert Venue', 'concert_4': 'Concert Venue',
    'corrosive': 'Corrosive Field', 'corrosive_mist': 'Corrosive Mist Field', 'corrupted': 'Corrupted Cave', 'crystal_cavern': 'Crystal Cavern', 'dark_crystal_cavern': 'Dark Crystal Cavern',
    'deep_earth': 'Deep Earth', 'desert': 'Desert Field', 'deux_finalis': 'Deux_Finalis_(Field)', 'dimensional': 'Dimensional Field', 'dragons_den': "Dragon's Den",
    'electric_terrain': 'Electric Terrain', 'factory': 'Factory Field', 'fairytale': 'Fairy Tale Field', 'flower_garden_1': 'Flower Garden', 'flower_garden_2': 'Flower Garden',
    'flower_garden_3': 'Flower Garden', 'flower_garden_4': 'Flower Garden', 'flower_garden_5': 'Flower Garden', 'forest': 'Forest Field', 'frozen_dimension': 'Frozen Dimensional Field',
    'glitch': 'Glitch Field', 'grassy_terrain': 'Grassy Terrain', 'haunted': 'Haunted Field', 'holy': 'Blessed Field', 'icy': 'Icy Field', 'infernal': 'Infernal Field',
    'inverse': 'Inverse Field', 'misty_terrain': 'Misty Terrain', 'mountain': 'Mountain', 'murkwater_surface': 'Murkwater Surface', 'new_world': 'New World',
    'psychic_terrain': 'Psychic Terrain', 'rainbow': 'Rainbow Field', 'rocky': 'Rocky Field', 'short_circuit': 'Short-Circuit Field', 'sky': 'Sky Field', 'snowy_mountain': 'Snowy Mountain',
    'starlight': 'Starlight Arena', 'swamp': 'Swamp Field', 'underwater': 'Underwater', 'volcanic': 'Volcanic Field', 'volcanic_top': 'Volcanic Top Field', 'wasteland': 'Wasteland',
    'water_surface': 'Water Surface', 'indoor': 'Field_Effects'}
STAGE = {f'flower_garden_{i}': i for i in range(1, 6)}


def filename(page): return page.replace('/', '_') + '.wikitext'


def refresh():
    DIR.mkdir(parents=True, exist_ok=True)
    meta = {}
    for page in sorted(set(PAGES.values()) | {'Field_Effects'}):
        url = API + '?action=parse&page=' + urllib.parse.quote(page) + '&prop=wikitext|revid&redirects=1&format=json'
        data = json.load(urllib.request.urlopen(urllib.request.Request(url, headers={'User-Agent': 'rejuvenation-fields-docs/0.1 (field notes import)'}), timeout=30))['parse']
        (DIR / filename(page)).write_text(data['wikitext']['*'], encoding='utf-8', newline='\n')
        meta[page] = {'title': data['title'], 'revid': data['revid'], 'url': 'https://rejuvenation.wiki.gg/wiki/' + urllib.parse.quote(page.replace(' ', '_'))}
        time.sleep(0.3)
    SOURCES.write_text(json.dumps({'license': LICENSE, 'licenseUrl': 'https://creativecommons.org/licenses/by-sa/4.0/', 'site': 'Pokémon Rejuvenation Wiki (rejuvenation.wiki.gg)',
                                   'pages': meta}, indent=1, ensure_ascii=False) + '\n', encoding='utf-8')
    print(f'Stored {len(meta)} pages')


def inline(text):
    text = re.sub(r'<br\s*/?>', ' ', text, flags=re.I)
    text = re.sub(r'</?u>', '', text)
    text = re.sub(r'\[\[(?:File|Image):[^\]]*\]\]', '', text)
    text = re.sub(r'\[\[(?:[^\]|]*\|)?([^\]]*)\]\]', r'\1', text)
    text = re.sub(r'\[https?://[^\s\]]+\s*\|?\s*([^\]]*)\]', r'\1', text)
    text = re.sub(r"'''(.*?)'''", r'\1', text)
    text = re.sub(r"''(.*?)''", r'\1', text)
    text = re.sub(r"'{2,}", '', text)
    return re.sub(r'\s+', ' ', text).strip()


def is_flavor(raw):
    """A line that is entirely italic (a field or move message)."""
    raw = raw.strip()
    # The last pattern is a message whose closing italic marks the wiki left unbalanced.
    return bool(re.fullmatch(r"''(?!').*?''", raw)) or bool(re.fullmatch(r"'''?''.*?''", raw)) or bool(re.fullmatch(r"'{2,3}[^'].*[^'\s]'{1,3}", raw) and "''" not in raw[2:].lstrip("'"))


def flavor_text(raw):
    text = inline(raw).strip().strip("'").strip('"“”').strip()
    return '“' + text + '”'


def strip_noise(text):
    text = re.sub(r'\[\[Category:[^\]]*\]\]', '', text)
    text = re.sub(r'\{\{(?:Field Effects Nav|CurrentSpoilers|Spoilerbox|SpoilerEnd)[^}]*\}\}', '', text)
    return text


def stage_slice(text, stage):
    """Flower Garden: the shared text plus the chosen stage's tab (the tabber's other tabs are dropped)."""
    if '<tabber>' not in text: return text
    before, rest = text.split('<tabber>', 1)
    tabs, after = rest.split('</tabber>', 1)
    parts = re.split(r'^\|-\|\s*(.*?)=\s*$', tabs, flags=re.M)
    chosen = ''
    for label, body in zip(parts[1::2], parts[2::2]):
        if label.strip() == f'Stage {stage}': chosen = f'\n=={label.strip()}==\n' + body.replace('\n===', '\n===', 1)
    # Tab content uses ===/==== headings; promote them under the stage heading by marking the stage as the parent.
    return before + chosen + '\n' + after


def convert(text, stage=None):
    text = strip_noise(text)
    if stage: text = stage_slice(text, stage)
    flavor, overview = None, []
    m = re.search(r'\{\{Quote\s*\|\s*(.*?)\}\}', text, flags=re.S)
    if m:
        flavor = flavor_text(m.group(1)); text = text.replace(m.group(0), '', 1)
    sections, stack, current, intro, in_table, table, pending = [], [], None, True, False, [], None

    def start(heading):
        nonlocal current
        current = {'heading': heading, 'lines': []}; sections.append(current)

    start('Description')
    lines = text.split('\n')
    i = 0
    while i < len(lines):
        raw = lines[i].rstrip(); i += 1
        if not raw.strip() or raw.startswith('[[File:') or raw.startswith('__'): continue
        if raw.startswith('{|'):
            in_table = True; table = []; continue
        if in_table:
            if raw.startswith('|}'):
                in_table = False
                row = []
                for r in table: current['lines'].append(r)
                pending = None
                continue
            if raw.startswith('|+'): table.append(inline(raw[2:])); continue
            if raw.startswith('|-'): continue
            if raw.startswith('!'): table.append(' | '.join(inline(c) for c in re.split(r'!!|\|\|', raw[1:]))); continue
            if raw.startswith('|'): table.append(' | '.join(inline(c) for c in raw[1:].split('||'))); continue
            continue
        h = re.match(r'^(=+)\s*(.*?)\s*=+\s*$', raw)
        if h:
            level = len(h.group(1)); name = inline(h.group(2))
            if level <= 2:
                start(name); pending = None; stack = [(level, name)]
            else:
                # A sub-heading becomes a label line inside its section; a container label directly followed by its child label is merged ("Moves Affected: Other moves").
                if pending is not None and pending[0] < level and current['lines'] and current['lines'][-1] == pending[1]:
                    current['lines'][-1] = pending[1][:-1] + ': ' + name + ':'
                else: current['lines'].append(name + ':')
                pending = (level, current['lines'][-1])
            continue
        b = re.match(r'^(\*+)\s*(.*)$', raw)
        if b:
            depth, body = len(b.group(1)), b.group(2)
            if not body.strip(): continue
            text_line = flavor_text(body) if is_flavor(body) else inline(body)
            if text_line and text_line != '“”': current['lines'].append(text_line); pending = None
            continue
        if raw.startswith(':'): body = raw.lstrip(':').strip()
        else: body = raw
        if is_flavor(body) and current['heading'] == 'Description' and flavor is None and not current['lines']:
            flavor = flavor_text(body); continue
        t = flavor_text(body) if is_flavor(body) else inline(body)
        if t: current['lines'].append(t); pending = None
    # Drop empty containers; the Description keeps the page's introduction.
    cleaned = []
    for sec in sections:
        lines = list(sec['lines'])
        while lines and lines[-1].endswith(':') and len(lines[-1]) < 90 and (len(lines) == 1 or True): lines.pop()
        # a label immediately followed by another label of its own kind carries nothing
        pruned = [l for i, l in enumerate(lines) if not (l.endswith(':') and i + 1 < len(lines) and lines[i + 1].endswith(':') and False)]
        if pruned: cleaned.append({'heading': sec['heading'], 'lines': pruned})
    return {'flavor': flavor, 'sections': split_long(cleaned)}


def split_long(sections, limit=36):
    """Sections of more than `limit` lines continue in a section of the same name, split at a label line where possible."""
    out = []
    for sec in sections:
        lines = sec['lines']; part = 0
        while len(lines) > limit:
            cut = limit
            for j in range(limit, limit // 2, -1):
                if lines[j].endswith(':'): cut = j; break
            out.append({'heading': sec['heading'] + (' (continued)' if part else ''), 'lines': lines[:cut]}); lines = lines[cut:]; part += 1
        out.append({'heading': sec['heading'] + (' (continued)' if part else ''), 'lines': lines})
    return out


def load(field_id):
    page = PAGES[field_id]
    return convert((DIR / filename(page)).read_text(encoding='utf-8'), STAGE.get(field_id))


def source_row(field_id):
    meta = json.loads(SOURCES.read_text(encoding='utf-8'))
    page = meta['pages'][PAGES[field_id]]
    return page


if __name__ == '__main__':
    if '--refresh' in sys.argv: refresh()
    else:
        out = load(sys.argv[1]) if len(sys.argv) > 1 else None
        print(json.dumps(out, indent=1, ensure_ascii=False))
