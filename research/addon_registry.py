"""Find data-driven battle registries in every installed archive and datapack."""
from pathlib import Path
import json,re,zipfile,io
ROOT=Path(__file__).resolve().parents[2];rows=[]
def archive(z,label):
    for n in z.namelist():
        m=re.fullmatch(r'data/([^/]+)/(?:mega_showdown/showdown/)?(moves|abilities|held_items)/(.+)\.(js|json)',n)
        if m:rows.append({'source':label,'namespace':m[1],'kind':{'held_items':'items'}.get(m[2],m[2]),'id':re.sub('[^a-z0-9]','',m[3].lower()),'path':n})
        if n.startswith('META-INF/jars/') and n.endswith('.jar'):archive(zipfile.ZipFile(io.BytesIO(z.read(n))),label+'!'+n)
for folder in ['mods','datapacks','resourcepacks']:
    for p in (ROOT/folder).rglob('*'):
        if p.suffix in ['.jar','.zip']:
            with zipfile.ZipFile(p) as z:archive(z,str(p.relative_to(ROOT)))
(ROOT/'rejuvenation/research/addon-battle-registry.json').write_text(json.dumps(rows,indent=2),encoding='utf-8')
print('Discovered',len(rows),'additional battle registry resources')
