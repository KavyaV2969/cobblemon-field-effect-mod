"""Install the two authored artifacts into this profile and record a hash-verified deployment receipt.

Only dist/rejuvenation-fields-<version>.jar -> mods/ and dist/rejuvenation-fields-datapack-<version>.zip -> datapacks/ are
written; nothing else in the profile is touched. Refuses while the packaged manifest is incomplete or a game JVM runs.
"""
from pathlib import Path
import datetime, hashlib, json, shutil, subprocess, sys

OUT = Path(__file__).resolve().parents[1]; PROFILE = OUT.parent
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
manifest = json.loads((OUT / 'dist/manifest.json').read_text(encoding='utf-8'))
if not manifest.get('implementationCompletionStandardMet'):
    sys.exit('Refusing to deploy: dist/manifest.json does not certify the packaged build (implementationCompletionStandardMet is false)')
# A running Minecraft client/server keeps the installed jar open and would not load a replaced one consistently.
if sys.platform == 'win32':
    running = subprocess.run(['powershell', '-NoProfile', '-Command',
        "Get-CimInstance Win32_Process -Filter \"Name='javaw.exe' or Name='java.exe'\" | Where-Object { $_.CommandLine -match 'minecraft|fabric|knot' } | Measure-Object | Select-Object -ExpandProperty Count"],
        capture_output=True, text=True).stdout.strip()
    if running and running != '0': sys.exit('Refusing to deploy while a Minecraft/Fabric JVM is running')
rows = []
for artifact in manifest['artifacts']:
    source = OUT / 'dist' / artifact['path']
    assert sha(source) == artifact['sha256'], f'{source.name} differs from the packaged manifest'
    target = PROFILE / ('mods' if source.suffix == '.jar' else 'datapacks') / source.name
    previous = sha(target) if target.exists() else None
    if previous != artifact['sha256']:
        temporary = target.with_name(target.name + '.deploying')
        if temporary.exists(): temporary.unlink()
        shutil.copyfile(source, temporary)
        assert sha(temporary) == artifact['sha256'], f'Copy of {source.name} is corrupt'
        if target.exists(): target.unlink()
        temporary.rename(target)
    assert sha(target) == artifact['sha256'], f'Installed {target.name} does not match'
    rows.append({'artifact': source.name, 'installedPath': str(target.relative_to(PROFILE)).replace('\\', '/'), 'bytes': target.stat().st_size,
                 'sha256': artifact['sha256'], 'previousSha256': previous, 'replaced': previous != artifact['sha256']})
receipt = {'timestamp': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'engineSha256': manifest['integrationEvidence']['engineSha256'],
           'deployed': rows, 'note': 'Only authored artifacts were written; research/audit_protected.py records the surrounding profile.'}
(OUT / 'research/test-results/deployment.json').write_text(json.dumps(receipt, indent=2) + '\n', encoding='utf-8')
print(json.dumps(receipt, indent=2))
