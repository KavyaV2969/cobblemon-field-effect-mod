"""Copy the compile-time dependencies from an installed profile into build/deps (never redistributed, never bundled).

    python research/prepare_build.py [--profile DIR] [--meta DIR] [--out DIR]

--profile  the Minecraft instance that has Cobblemon, Fabric API and the optional integration jars in mods/ and the remapped Minecraft jar
           in .fabric/remappedJars (default: $REJUVENATION_PROFILE, else this repository's parent directory).
--meta     the launcher's library cache (Modrinth App: <app data>/ModrinthApp/meta) that holds Fabric Loader, Mixin and ASM
           (default: $REJUVENATION_META, else <profile>/../../meta, else the Modrinth App folder under the user's home).
--out      destination (default: build/deps in this repository).
The exact versions are the ones the mods target: Minecraft 1.21.1, Fabric Loader 0.18.4, Cobblemon 1.7.3+1.21.1, Fabric API 0.116.14+1.21.1.
"""
from pathlib import Path
import argparse, json, os, shutil, sys, zipfile

REPO = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__.split('\n')[0])
parser.add_argument('--profile'); parser.add_argument('--meta'); parser.add_argument('--out')
args = parser.parse_args()
PROFILE = Path(args.profile or os.environ.get('REJUVENATION_PROFILE') or REPO.parent).resolve()
candidates = [args.meta, os.environ.get('REJUVENATION_META'), PROFILE.parent.parent / 'meta', Path.home() / 'AppData/Roaming/ModrinthApp/meta']
meta = next((Path(c) for c in candidates if c and (Path(c) / 'libraries').is_dir()), None)
if meta is None: sys.exit('Launcher library cache not found; pass --meta or set REJUVENATION_META (the folder that contains libraries/ and versions/)')
libraries = meta / 'libraries'
out = Path(args.out) if args.out else REPO / 'build/deps'
out.mkdir(parents=True, exist_ok=True)
needed = [PROFILE / 'mods/Cobblemon-fabric-1.7.3+1.21.1.jar', PROFILE / '.fabric/remappedJars/minecraft-1.21.1-0.18.4/client-intermediary.jar']
needed += list(libraries.glob('net/fabricmc/fabric-loader/0.18.4/*.jar'))
needed += list(libraries.glob('net/fabricmc/sponge-mixin/0.17.2*/*.jar'))
# The installed Minecraft 1.21.1 profile's own Java libraries at their exact versions, so packet codec fixtures can
# initialize real Minecraft classes offline. Natives, LWJGL and the loader/Mixin/ASM (pinned above and below) are skipped.
profile = json.loads((meta / 'versions/1.21.1-0.18.4/1.21.1-0.18.4.json').read_text(encoding='utf-8'))
for library in profile['libraries']:
    parts = library['name'].split(':')
    if len(parts) != 3 or parts[0] in ('org.lwjgl', 'net.fabricmc', 'org.ow2.asm', 'ca.weblite') or 'native' in parts[1]: continue
    group, artifact, version = parts
    jar = libraries / group.replace('.', '/') / artifact / version / f'{artifact}-{version}.jar'
    if not jar.exists(): sys.exit(f'Installed Minecraft library missing: {jar}')
    needed.append(jar)
needed += list(libraries.glob('org/ow2/asm/asm/9.9/*.jar')) + list(libraries.glob('org/ow2/asm/asm-tree/9.9/*.jar'))
# Compile-only integration targets (adapters/mixins); never bundled or modified.
mods = PROFILE / 'mods'
needed += sorted(mods.glob('rbrctai-fabric-*.jar')) + sorted(mods.glob('rctapi-fabric-*.jar')) + sorted(mods.glob('cobblemon-battle-extras-fabric-*.jar'))
missing = [p for p in needed if not Path(p).is_file()]
if missing: sys.exit('Missing build inputs:\n  ' + '\n  '.join(map(str, missing)))
names = {p.name for p in needed}
for p in needed: shutil.copyfile(p, out / p.name)
for fn in ['fabric-api-0.116.14+1.21.1.jar', 'fabric-language-kotlin-1.13.13+kotlin.2.4.10.jar']:
    with zipfile.ZipFile(mods / fn) as z:
        for n in z.namelist():
            if n.startswith('META-INF/jars/') and n.endswith('.jar'):
                (out / Path(n).name).write_bytes(z.read(n)); names.add(Path(n).name)
# Remove stale dependencies from earlier preparations (for example other Minecraft versions' libraries).
for stale in out.glob('*.jar'):
    if stale.name not in names: stale.unlink()
print('Prepared', len(list(out.glob('*.jar'))), 'installed compile dependencies in', out)
