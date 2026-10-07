"""Second pass: compare ALL generated definition rows to marshalled fields.dat.

This proves definition coverage, not coverage of Ruby runtime special cases.
"""
from pathlib import Path
import json, re
ROOT=Path(__file__).resolve().parents[1]
def read(p):return json.loads(p.read_text(encoding='utf-8'))
original=read(ROOT/'research/compiled-field-specification.json')
ids=read(ROOT/'research/field-id-map.json')
def norm(v):return re.sub('[^a-z0-9]','',v.lower()) if v else v
comparisons=[];differences=[]
def compare(sym,at,a,b):
    comparisons.append({'field':sym,'property':at,'equal':a==b})
    if a!=b:differences.append({'field':sym,'property':at,'compiled':a,'generated':b})
for sym,compiled in original.items():
    f=read(ROOT/f'datapack/base/data/rejuvenation/rejuvenation/fields/{ids[sym].split(":")[1]}.json')
    for k in ['naturePower','secretPower']:compare(sym,k,norm(compiled[k]),f[k])
    compare(sym,'entryMessage',compiled['message'],f['entryMessage'])
    compare(sym,'name',compiled['name'] or 'No Field',f['name'])
    compare(sym,'mimicry',norm(compiled['mimicry']),norm(f.get('mimicry')))
    compare(sym,'burmyCloak',compiled['burmyCloak'],f.get('burmyCloak'))
    # Hard-field status lists are battle-UI highlights; overlay lists are unused by the source scene.
    for k in ['statusBuffs','statusNerfs']:compare(sym,k,[norm(m) for m in compiled[k] or []],f.get(k))
    seed=compiled['seeddata'] or {}
    if not seed.get('seedtype'):compare(sym,'seed',None,f.get('seed'))
    else:
        dest=f.get('seed') or {}
        compare(sym,'seed/item',norm(seed['seedtype']),dest.get('item'))
        compare(sym,'seed/effect',norm(seed['effect']),dest.get('effect') and norm(dest['effect']))
        compare(sym,'seed/duration',seed['duration'],dest.get('duration'))
        compare(sym,'seed/message',seed['message'],dest.get('message'))
        stats=['','atk','def','spa','spd','spe','accuracy','evasion']
        compare(sym,'seed/stats',{stats[int(i)]:n for i,n in (seed.get('stats') or {}).items()},dest.get('stats'))
    # Change conditions are Ruby expressions; check each destination is reachable from the definition.
    text=json.dumps(f)
    for target in compiled['fieldchangeconditions'] or {}:compare(sym,'fieldchange/'+target,True,f'"{ids[target]}"' in text)
    for prefix,data in [('',f),('overlay',f.get('overlay',{'moves':{},'types':[]}))]:
        originalmoves=compiled[prefix+'movedata' if prefix else 'fieldmovedata']
        compare(sym,prefix+'moves set',sorted(norm(m) for m in originalmoves),sorted(data['moves']))
        for mid,info in originalmoves.items():
            dest=data['moves'].get(norm(mid),{})
            for k,newk in [('mult','multiplier'),('accmod','accuracy'),('typemod','additionalType')]:
                if k in info:compare(sym,prefix+'/'+mid+'/'+k,info[k],dest.get(newk))
            if info.get('fieldchange'):compare(sym,mid+'/fieldchange',ids[info['fieldchange']],dest.get('transition',{}).get('field'))
            for key,newkey,listkey in [('multtext','message',prefix+'movemessagelist'),('changetext','transition', 'changemessagelist')]:
                if info.get(key):
                    text=dest.get('message') if key=='multtext' else dest.get('transition',{}).get('message')
                    compare(sym,prefix+'/'+mid+'/'+key,compiled[listkey][info[key]-1],text)
        originaltypes=compiled[prefix+'typedata' if prefix else 'fieldtypedata']
        for tid,t in originaltypes.items():
            match={'flag':{'soundmove':'sound','sharpmove':'slicing','windmove':'wind'}[tid]} if tid in ['soundmove','sharpmove','windmove'] else {'moveType':tid.title()}
            row=next((x for x in data['types'] if x['match']==match),{})
            for k,newk in [('mult','multiplier'),('typemod','additionalType')]:
                if k in t:compare(sym,prefix+'/type/'+tid+'/'+k,t[k],row.get(newk))
            if t.get('multtext'):compare(sym,prefix+'/type/'+tid+'/message',compiled[prefix+'typemessagelist'][t['multtext']-1],row.get('message'))
report={'fieldsCompared':len(original),'comparisons':len(comparisons),'equal':sum(r['equal'] for r in comparisons),
    'differences':differences,'scope':'Definitions only. Does not verify distributed runtime mechanics or AI.'}
(ROOT/'research/source-comparison.json').write_text(json.dumps(report,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print(f"Compared {len(original)} fields: {len(comparisons)} properties, {len(differences)} differences")
if differences:
    for d in differences[:20]:print(d)
