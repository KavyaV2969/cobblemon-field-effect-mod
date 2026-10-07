"""Install (or roll back) the four runtime artifacts in a game profile, with backups and a hash-verified receipt.

    python research/deploy.py [--profile DIR] [--apply]      dry run unless --apply
    python research/deploy.py [--profile DIR] --rollback <backup-dir> [--apply]

Only the artifacts named here are touched; worlds, other mods, other data packs and every configuration file are left alone.
Install:   dist/rejuvenation-fields-<v>.jar and dist/rejuvenation-fields-compat-<v>.jar  -> <profile>/mods/
           dist/rejuvenation-fields-base-<v>.zip and dist/rejuvenation-fields-cobbleverse-<v>.zip -> <profile>/datapacks/
Replaced:  any earlier rejuvenation-fields-*.jar and rejuvenation-fields-datapack-*.zip / rejuvenation-gym-overrides-*.zip (the monolith and its
           superseded override pack) are MOVED to <backup-dir> (never deleted), so no old copy can load beside the new ones.
Refuses to run while a Minecraft/Fabric JVM is running or when dist/manifest.json does not certify the artifacts. A running game must be
restarted to load new jars; data packs are read on world load or /reload.
"""
from pathlib import Path
import argparse, datetime, hashlib, json, os, shutil, subprocess, sys

REPO = Path(__file__).resolve().parents[1]
ap = argparse.ArgumentParser()
ap.add_argument('--profile'); ap.add_argument('--apply', action='store_true'); ap.add_argument('--rollback')
args = ap.parse_args()
PROFILE = Path(args.profile or os.environ.get('REJUVENATION_PROFILE') or REPO.parent).resolve()
sha = lambda p: hashlib.sha256(Path(p).read_bytes()).hexdigest()


def running_game():
    if sys.platform != 'win32': return False
    out = subprocess.run(['powershell', '-NoProfile', '-Command',
        "Get-CimInstance Win32_Process -Filter \"Name='javaw.exe' or Name='java.exe'\" | Where-Object { $_.CommandLine -match 'net.fabricmc|knot|minecraft' -and $_.CommandLine -notmatch 'gradle' } | Measure-Object | Select-Object -ExpandProperty Count"],
        capture_output=True, text=True).stdout.strip()
    return bool(out) and out != '0'


def rel(p): return Path(p).resolve().relative_to(PROFILE).as_posix()


if args.rollback:
    backup = Path(args.rollback).resolve()
    receipt = json.loads((backup / 'receipt.json').read_text(encoding='utf-8'))
    if args.apply and running_game(): sys.exit('Refusing to roll back while a Minecraft/Fabric JVM is running')
    for row in receipt['installed']:
        print(('remove ' if args.apply else 'would remove ') + row['installedPath'])
        if args.apply: (PROFILE / row['installedPath']).unlink(missing_ok=True)
    for row in receipt['replaced']:
        print(('restore ' if args.apply else 'would restore ') + row['originalPath'])
        if args.apply:
            target = PROFILE / row['originalPath']; shutil.copyfile(backup / row['backupName'], target)
            assert sha(target) == row['sha256'], 'restored file differs from the backup'
    sys.exit(0)

manifest = json.loads((REPO / 'dist/manifest.json').read_text(encoding='utf-8'))
if not manifest.get('verified'): sys.exit('Refusing to deploy: dist/manifest.json does not certify the packaged build (verified is false)')
for a in manifest['artifacts']:
    if sha(REPO / 'dist' / a['path']) != a['sha256']: sys.exit(f"{a['path']} differs from the manifest; rerun research/package.py")
if args.apply and running_game(): sys.exit('Refusing to deploy while a Minecraft/Fabric JVM is running')

stamp = datetime.datetime.now().strftime('%Y%m%d-%H%M%S')
backup = REPO / 'research/backups' / f'replaced-by-{manifest["version"]}-{stamp}'
old = [p for pattern, folder in (('rejuvenation-fields-*.jar', 'mods'), ('rejuvenation-fields-datapack-*.zip', 'datapacks'), ('rejuvenation-gym-overrides-*.zip', 'datapacks'),
       ('rejuvenation-fields-base-*.zip', 'datapacks'), ('rejuvenation-fields-cobbleverse-*.zip', 'datapacks'), ('rejuvenation-fields-compat-*.jar', 'mods'))
       for p in sorted((PROFILE / folder).glob(pattern))]
new_names = {a['path'] for a in manifest['artifacts']}
replaced, installed = [], []
if args.apply: backup.mkdir(parents=True, exist_ok=True)
for p in old:
    if p.name in new_names and sha(p) == next(a['sha256'] for a in manifest['artifacts'] if a['path'] == p.name): continue   # already the exact artifact
    name = f'{len(replaced):02d}-{p.name}'
    print(('move ' if args.apply else 'would move ') + rel(p) + ' -> backup')
    replaced.append({'originalPath': rel(p), 'backupName': name, 'sha256': sha(p), 'bytes': p.stat().st_size})
    if args.apply: shutil.copyfile(p, backup / name); assert sha(backup / name) == replaced[-1]['sha256']; p.unlink()
for a in manifest['artifacts']:
    folder = 'mods' if a['path'].endswith('.jar') else 'datapacks'
    target = PROFILE / folder / a['path']
    print(('install ' if args.apply else 'would install ') + rel(target))
    installed.append({'artifact': a['path'], 'installedPath': rel(target), 'bytes': a['bytes'], 'sha256': a['sha256']})
    if args.apply:
        temporary = target.with_name(target.name + '.deploying')
        shutil.copyfile(REPO / 'dist' / a['path'], temporary)
        assert sha(temporary) == a['sha256'], 'copy is corrupt'
        if target.exists(): target.unlink()
        temporary.rename(target); assert sha(target) == a['sha256']
receipt = {'timestamp': datetime.datetime.now(datetime.timezone.utc).isoformat(), 'version': manifest['version'], 'engineSha256': manifest['engineSha256'], 'applied': args.apply,
           'installed': installed, 'replaced': replaced, 'note': 'Only the listed artifacts were written; worlds, other mods and packs are untouched. Restart the game to load new jars.'}
if args.apply:
    (backup / 'receipt.json').write_text(json.dumps(receipt, indent=2) + '\n', encoding='utf-8')
    out = REPO / 'research/test-results/deployment.json'
    if out.exists(): out.unlink()
    out.write_text(json.dumps({**receipt, 'backup': backup.relative_to(REPO).as_posix()}, indent=2) + '\n', encoding='utf-8')
    print('Backup of replaced files:', backup.relative_to(REPO).as_posix())
else:
    print('Dry run only; add --apply to write.')
