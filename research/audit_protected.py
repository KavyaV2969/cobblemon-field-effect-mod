"""Read-only comparison against the original profile baseline; never restore files."""
from pathlib import Path
import hashlib,json,datetime
OUT=Path(__file__).resolve().parents[1];ROOT=OUT.parent
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
baseline=json.loads((OUT/'research/protected-baseline.json').read_text(encoding='utf-8'))
changed=[];deleted=[]
for name,expected in baseline.items():
    p=ROOT/name
    if not p.exists():deleted.append(name)
    elif sha(p)!=expected:changed.append(name)
folders={Path(name).parts[0] for name in baseline}
present={str(p.relative_to(ROOT)) for folder in folders for p in (ROOT/folder).rglob('*') if p.is_file()}
report={'checked':len(baseline),'changed':sorted(changed),'added':sorted(present-set(baseline)),
        'deleted':sorted(deleted),'timestamp':datetime.datetime.now(datetime.timezone.utc).isoformat(),
        'authoredOutsideRejuvenation':[],
        'note':'Read-only audit; all observed settings differences are preserved and listed below. Original trainer/content archives are compared byte-for-byte. Authorized field-mod/datapack installs appear as additions.',
        'differences':[{'path':name,'baselineSha256':baseline[name],'currentSha256':sha(ROOT/name),
                        'modifiedUtc':datetime.datetime.fromtimestamp((ROOT/name).stat().st_mtime,datetime.timezone.utc).isoformat()} for name in changed]}
before=OUT/'research/test-results/protected-before-continuation.json'
if before.exists():
    previous=json.loads(before.read_text(encoding='utf-8'))
    expected=dict(baseline)
    expected.update({row['path']:row['currentSha256'] for row in previous['differences']})
    report['continuationChangedOriginalFiles']=sorted(name for name,value in expected.items() if not (ROOT/name).exists() or sha(ROOT/name)!=value)
(OUT/'research/protected-integrity.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:report[k] for k in ['checked','changed','added','deleted']},indent=2))
