"""Package only the tested champion EV policy and exact optional mixins into the existing compat artifact."""
from pathlib import Path
import hashlib, json, shutil, zipfile

ROOT = Path(__file__).resolve().parents[1]
PROFILE = ROOT.parent
CLASSES = ROOT / 'research/classes/kanto-blue'
NAME = 'rejuvenation-fields-compat-0.1.jar'
installed = PROFILE / 'mods' / NAME
backup = Path(json.loads((ROOT / 'research/test-results/kanto-gyms-backup.json').read_text())['backup'])
previous = backup / installed.relative_to(PROFILE)
test = json.loads((ROOT / 'research/test-results/blue-npc-evs.json').read_text())
assert test['failed'] is False and test['checksPassed'] == 29
replacements = {f'dev/rejuvenation/compat/{name}.class': (CLASSES / f'dev/rejuvenation/compat/{name}.class').read_bytes()
                for name in ('BlueNpcEvPolicy', 'CompatMixinPlugin', 'mixin/BlueNpcStatsAccessor', 'mixin/BlueNpcTeamMixin')}
replacements['rejuvenation-compat.mixins.json'] = (ROOT / 'compat/src/main/resources/rejuvenation-compat.mixins.json').read_bytes()
target = ROOT / 'dist' / NAME
temp = target.with_suffix('.jar.tmp')
with zipfile.ZipFile(previous) as old, zipfile.ZipFile(temp, 'w', zipfile.ZIP_DEFLATED, compresslevel=9) as z:
    names = set(old.namelist()) | set(replacements)
    for name in sorted(names):
        entry = zipfile.ZipInfo(name, (2026, 10, 8, 0, 0, 0))
        entry.compress_type = zipfile.ZIP_DEFLATED
        entry.external_attr = 0o644 << 16
        z.writestr(entry, replacements[name] if name in replacements else old.read(name))
with zipfile.ZipFile(previous) as old, zipfile.ZipFile(temp) as z:
    assert z.testzip() is None
    assert len(z.namelist()) == len(set(z.namelist()))
    for name in old.namelist():
        if name not in replacements: assert old.read(name) == z.read(name), name
    for name, data in replacements.items(): assert z.read(name) == data
    meta = json.loads(z.read('fabric.mod.json'))
    assert meta['id'] == 'rejuvenation_fields_compat'
    config = json.loads(z.read('rejuvenation-compat.mixins.json'))
    assert {'BlueNpcStatsAccessor', 'BlueNpcTeamMixin'} <= set(config['mixins'])
shutil.copyfile(temp, target)
shutil.copyfile(temp, installed)
temp.unlink()
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
assert sha(installed) == sha(target)
receipt = {**test, 'installed': str(installed), 'sha256': sha(installed), 'previousSha256': sha(previous),
           'changedEntries': sorted(replacements), 'unrelatedEntriesPreserved': True,
           'compiledBytesMatchInstalled': True, 'backup': str(backup),
           'scope': 'NPC kanto_champion_blue teams only; normal EV cap unchanged',
           'classHashes': {k: hashlib.sha256(v).hexdigest() for k, v in replacements.items()}}
(ROOT / 'research/test-results/blue-npc-evs-install.json').write_text(json.dumps(receipt, indent=2) + '\n', encoding='utf-8')
manifest_path = ROOT / 'dist/manifest.json'
manifest = json.loads(manifest_path.read_text())
for artifact in manifest['artifacts']:
    if artifact['path'] == NAME: artifact.update(sha256=sha(target), bytes=target.stat().st_size)
manifest['blueNpcEvs'] = {'receipt': 'research/test-results/blue-npc-evs-install.json', 'perStat': 252, 'total': 1512, 'liveMinecraftBattleTested': False}
manifest['verified'] = False
manifest_path.write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
print('Installed champion EV compat adjustment:', installed, '\nSHA-256', sha(installed))
