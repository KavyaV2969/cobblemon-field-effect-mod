"""Assign each Kanto league trainer the field that favors its exact team most.

Reads the installed RCT datapack without modifying it, snapshots the Kanto series teams
(research/kanto-league-teams.json), scores every field with the real engine
(trainer_fields.cjs) and writes the trainer-to-field mapping the mod applies at battle start
(datapack/.../trainers/kanto.json). Trainer teams and AI configuration are never edited.
"""
from pathlib import Path
import hashlib,json,subprocess,sys,zipfile
ROOT=Path(__file__).resolve().parents[1];PROFILE=ROOT.parent
PACK=PROFILE/'datapacks/COBBLEVERSE-RCT-DP-v20.zip'
OUT=ROOT/'datapack/data/rejuvenation/rejuvenation/trainers/kanto.json'
SERIES='kanto'
with zipfile.ZipFile(PACK) as z:
    ids=sorted(n.rsplit('/',1)[1][:-5] for n in z.namelist() if n.startswith('data/rctmod/mobs/trainers/single/') and n.endswith('.json')
               and SERIES in json.loads(z.read(n)).get('series',[]))
    trainers={}
    for trainer in ids:
        data=json.loads(z.read(f'data/rctmod/trainers/{trainer}.json'))
        trainers[trainer]={'name':data['name'].get('literal',trainer),'battleFormat':data.get('battleFormat','GEN_9_SINGLES'),
            'team':[{k:m.get(k) for k in ['species','level','gender','nature','ability','moveset','ivs','evs']}|{'item':(m.get('heldItem') or [None])[0]} for m in data['team']]}
source={'datapack':PACK.name,'sha256':hashlib.sha256(PACK.read_bytes()).hexdigest(),'series':SERIES}
# Simulator item IDs drop the Minecraft namespace (mega_showdown:booster_energy -> booster_energy).
for member in (m for t in trainers.values() for m in t['team']):
    if member['item'] and ':' in member['item']:member['item']=member['item'].split(':',1)[1]
(ROOT/'research/kanto-league-teams.json').write_text(json.dumps({'source':source,'trainers':trainers},indent=1)+'\n',encoding='utf-8')
if '--extract-only' in sys.argv:sys.exit(0)
subprocess.run(['node',str(ROOT/'research/trainer_fields.cjs')],check=True)
scores=json.loads((ROOT/'research/trainer-field-scores.json').read_text(encoding='utf-8'))
mapping={'schemaVersion':1,'series':SERIES,'source':source|{'scores':'research/trainer-field-scores.json'},
    'trainers':{t:{'field':s['best'],'winShare':s['ranking'][0]['winShare'],'indoorWinShare':s['baseline']['winShare']} for t,s in scores['trainers'].items()}}
OUT.parent.mkdir(parents=True,exist_ok=True);OUT.write_text(json.dumps(mapping,indent=2)+'\n',encoding='utf-8')
print('Assigned fields to',len(mapping['trainers']),'Kanto league trainers')
