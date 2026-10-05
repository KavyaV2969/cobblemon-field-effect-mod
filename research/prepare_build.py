from pathlib import Path
import json, shutil, zipfile
ROOT=Path(__file__).resolve().parents[2]
out=ROOT/'rejuvenation/mod/build/deps'; out.mkdir(parents=True,exist_ok=True)
meta=Path.home()/'AppData/Roaming/ModrinthApp/meta/libraries'
needed=[ROOT/'mods/Cobblemon-fabric-1.7.3+1.21.1.jar',ROOT/'.fabric/remappedJars/minecraft-1.21.1-0.18.4/client-intermediary.jar']
needed+=list(meta.glob('net/fabricmc/fabric-loader/0.18.4/*.jar'))
needed+=list(meta.glob('net/fabricmc/sponge-mixin/0.17.2*/*.jar'))
# The installed Minecraft 1.21.1 profile's own Java libraries at their exact versions, so packet codec fixtures can
# initialize real Minecraft classes offline. Natives, LWJGL and the loader/Mixin/ASM (pinned above and below) are skipped.
profile=json.loads((meta.parent/'versions/1.21.1-0.18.4/1.21.1-0.18.4.json').read_text(encoding='utf-8'))
for library in profile['libraries']:
    parts=library['name'].split(':')
    if len(parts)!=3 or parts[0] in ('org.lwjgl','net.fabricmc','org.ow2.asm','ca.weblite') or 'native' in parts[1]:continue
    group,artifact,version=parts
    jar=meta/group.replace('.','/')/artifact/version/f'{artifact}-{version}.jar'
    if not jar.exists():raise SystemExit(f'Installed Minecraft library missing: {jar}')
    needed.append(jar)
needed+=list(meta.glob('org/ow2/asm/asm/9.9/*.jar'))+list(meta.glob('org/ow2/asm/asm-tree/9.9/*.jar'))
# Compile-only integration targets (adapters/mixins); never bundled or modified.
needed+=sorted((ROOT/'mods').glob('rbrctai-fabric-*.jar'))+sorted((ROOT/'mods').glob('cobblemon-battle-extras-fabric-*.jar'))
names={p.name for p in needed}
for p in needed: shutil.copyfile(p,out/p.name)
for fn in ['fabric-api-0.116.14+1.21.1.jar','fabric-language-kotlin-1.13.13+kotlin.2.4.10.jar']:
    with zipfile.ZipFile(ROOT/'mods'/fn) as z:
        for n in z.namelist():
            if n.startswith('META-INF/jars/') and n.endswith('.jar'):
                (out/Path(n).name).write_bytes(z.read(n));names.add(Path(n).name)
# Remove stale dependencies from earlier preparations (for example other Minecraft versions' libraries).
for stale in out.glob('*.jar'):
    if stale.name not in names:stale.unlink()
print('Prepared',len(list(out.glob('*.jar'))),'installed compile dependencies')
