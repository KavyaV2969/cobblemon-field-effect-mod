"""Read-only inventory of profile archives and local game source; outputs only here."""
from pathlib import Path
import hashlib, io, json, re, sys, zipfile
ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'rejuvenation/research'
SOURCE = Path(sys.argv[1])
def save(name, data):
    (OUT/name).write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding='utf-8')
biomes, tags, dimensions, mods, packs, candidates = {}, {}, {}, [], [], []
def archive(z, label, nested=True):
    names = z.namelist()
    if 'fabric.mod.json' in names:
        meta = json.loads(z.read('fabric.mod.json'), strict=False)
        mods.append({'archive':label, **meta})
    for n in names:
        m = re.fullmatch(r'data/([^/]+)/worldgen/biome/(.+)\.json', n)
        if m:
            key = m[1]+':'+m[2]
            biomes.setdefault(key, []).append({'source':label, 'path':n, 'data':json.loads(z.read(n))})
        m = re.fullmatch(r'data/([^/]+)/tags/worldgen/biome/(.+)\.json', n)
        if m:
            tags.setdefault(m[1]+':'+m[2], []).append({'source':label,'data':json.loads(z.read(n))})
        m = re.fullmatch(r'data/([^/]+)/dimension/(.+)\.json', n)
        if m:
            dimensions.setdefault(m[1]+':'+m[2], []).append({'source':label,'data':json.loads(z.read(n))})
        if re.search(r'(?i)rejuv|\.rb$|\.rxdata$|\.rgss', n): candidates.append([label,n])
        if nested and n.startswith('META-INF/jars/') and n.endswith('.jar'):
            archive(zipfile.ZipFile(io.BytesIO(z.read(n))), label+'!'+n, False)
    if 'pack.mcmeta' in names:
        packs.append({'path':label,'metadata':json.loads(z.read('pack.mcmeta')),'entries':len(names)})
archives = [p for p in ROOT.rglob('*') if p.is_file() and p.suffix in ('.jar','.zip') and 'rejuvenation' not in p.relative_to(ROOT).parts]
# Vanilla definitions from the actual launcher-remapped client.
for p in archives:
    try:
        with zipfile.ZipFile(p) as z: archive(z,str(p.relative_to(ROOT)))
    except (zipfile.BadZipFile, json.JSONDecodeError) as e:
        print('Archive error',p,e)
for p in ROOT.rglob('*.json'):
    rel=p.relative_to(ROOT).as_posix()
    if rel.startswith('rejuvenation/'): continue
    m=re.search(r'(?:^|/)data/([^/]+)/worldgen/biome/(.+)\.json$',rel)
    if m: biomes.setdefault(m[1]+':'+m[2],[]).append({'source':rel,'data':json.loads(p.read_text(encoding='utf-8'))})
refs, hashes = [], {}
pattern = re.compile(r'(?:\bFE\b|\bOV\b|\bfield\.(?:effect|counter\d*|duration|layer|overlay)|setField\(|breakField\(|ProgressiveField|FIELDEFFECTS|PBFields::)')
for p in SOURCE.rglob('*.rb'):
    data=p.read_bytes(); name=str(p.relative_to(SOURCE)); hashes[name]=hashlib.sha256(data).hexdigest()
    for i,line in enumerate(data.decode('utf-8',errors='replace').splitlines(),1):
        if pattern.search(line):
            # Keep locations and referenced identifiers, not unrelated game scripts.
            refs.append({'file':name,'line':i,'fields':re.findall(r':([A-Z][A-Z0-9]+)',line),'kind':'ai' if 'AI' in name else 'runtime'})
protected={}
for folder in ['config','defaultconfigs','datapacks','mods','showdown','data']:
    for p in (ROOT/folder).rglob('*'):
        if p.is_file(): protected[str(p.relative_to(ROOT))]=hashlib.sha256(p.read_bytes()).hexdigest()
if not (OUT/'protected-baseline.json').exists(): save('protected-baseline.json',protected)
else:
    before=json.loads((OUT/'protected-baseline.json').read_text(encoding='utf-8'))
    save('protected-integrity.json',{'changed':[p for p,h in before.items() if protected.get(p)!=h],
        'added':[p for p in protected if p not in before], 'checked':len(before)})
save('mod-inventory.json',mods); save('pack-inventory.json',packs)
save('biome-inventory.json',biomes); save('biome-tags.json',tags); save('dimension-inventory.json',dimensions)
save('source-reference-index.json',refs); save('source-hashes.json',hashes)
save('source-location.json',{'scripts':str(SOURCE),'profile':str(ROOT)})
save('archive-source-candidates.json',candidates)
print(f'{len(mods)} mod metadata entries, {len(biomes)} JSON-defined biomes, {len(tags)} biome tags, {len(dimensions)} dimensions, {len(refs)} field source references')
