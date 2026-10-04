from pathlib import Path
import shutil, zipfile
ROOT=Path(__file__).resolve().parents[2]
out=ROOT/'rejuvenation/mod/build/deps'; out.mkdir(parents=True,exist_ok=True)
meta=Path.home()/'AppData/Roaming/ModrinthApp/meta/libraries'
needed=[ROOT/'mods/Cobblemon-fabric-1.7.3+1.21.1.jar',ROOT/'.fabric/remappedJars/minecraft-1.21.1-0.18.4/client-intermediary.jar']
needed+=list(meta.glob('net/fabricmc/fabric-loader/0.18.4/*.jar'))
needed+=list(meta.glob('net/fabricmc/sponge-mixin/0.17.2*/*.jar'))
needed+=list(meta.glob('com/google/code/gson/gson/2.10.1/*.jar'))
needed+=list(meta.glob('org/slf4j/slf4j-api/*/*.jar'))
needed+=list(meta.glob('com/mojang/brigadier/*/*.jar'))
needed+=list(meta.glob('com/mojang/datafixerupper/*/*.jar'))
stale_gson=out/'gson-2.11.0.jar'
if stale_gson.exists():stale_gson.unlink()
for p in needed: shutil.copyfile(p,out/p.name)
for fn in ['fabric-api-0.116.14+1.21.1.jar','fabric-language-kotlin-1.13.13+kotlin.2.4.10.jar']:
    with zipfile.ZipFile(ROOT/'mods'/fn) as z:
        for n in z.namelist():
            if n.startswith('META-INF/jars/') and n.endswith('.jar'):
                (out/Path(n).name).write_bytes(z.read(n))
print('Prepared',len(list(out.glob('*.jar'))),'installed compile dependencies')
