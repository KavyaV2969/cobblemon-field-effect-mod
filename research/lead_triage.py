"""List unreviewed runtime leads beside the generated rules citing them.

A triage aid only: a citing rule is where to look, never evidence of review.
"""
from pathlib import Path
import json,re,sys,collections
ROOT=Path(__file__).resolve().parents[1]
audit=json.loads((ROOT/'research/interaction-audit.json').read_text(encoding='utf-8'))
reviews={(r['file'],r['line']) for r in json.loads((ROOT/'research/semantic-reviews.json').read_text(encoding='utf-8'))}
cites=collections.defaultdict(set)
def walk(v,where):
    if isinstance(v,dict):
        s=v.get('source')
        if isinstance(s,str):
            m=re.match(r'([\w/ ]+\.rb):([\d,\- ]+)',s)
            if m:
                for part in m.group(2).split(','):
                    part=part.strip()
                    if not part:continue
                    lo,_,hi=part.partition('-');
                    for n in range(int(lo),int(hi or lo)+1):cites[(m.group(1),n)].add(where)
        for x in v.values():walk(x,where)
    elif isinstance(v,list):
        for x in v:walk(x,where)
for p in sorted((ROOT/'datapack/data/rejuvenation/rejuvenation/fields').glob('*.json')):walk(json.loads(p.read_text(encoding='utf-8')),p.stem)
for p in sorted((ROOT/'datapack/data/rejuvenation/rejuvenation/abilities').glob('*.json')):walk(json.loads(p.read_text(encoding='utf-8')),'abilities')
want=sys.argv[1] if len(sys.argv)>1 else None
for l in audit:
    if l['file']=='Battle_AI.rb' or (want and l['file']!=want):continue
    key=(l['file'],l['line']);cited=set()
    for n in range(l['line'],l['end_line']+1):cited|=cites.get((l['file'],n),set())
    print(('R' if key in reviews else 'c' if cited else '-'),f"{l['file']}:{l['line']}-{l['end_line']}",','.join(l['fields'])[:60],'|',l['condition'][:110].replace('\n',' '),'|',','.join(sorted(cited))[:60])
