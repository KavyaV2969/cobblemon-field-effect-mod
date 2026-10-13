"""Isolated local Fabric quick-play smoke check; never modifies the source profile.

Uses cached launcher libraries and anonymous local single-player identity. Copies
configuration and only the world's level metadata; generates fresh test chunks.
No login credentials, game assets or dependencies enter distributable artifacts.
"""
from pathlib import Path
import json,os,shutil,subprocess,time,sys,hashlib

OUT=Path(__file__).resolve().parents[1];ROOT=OUT.parent
META=Path.home()/'AppData/Roaming/ModrinthApp/meta'
VERSION='1.21.1-0.18.4';GAME=OUT/'integration/game'
MODES=['battle','status','abilities','extended','integration','evcards'];mode=next((m for m in MODES if '--'+m in sys.argv),None)
check_battles=mode is not None
v=json.loads((META/f'versions/{VERSION}/{VERSION}.json').read_text(encoding='utf-8'))
GAME.mkdir(parents=True,exist_ok=True)
MOD_VERSION=next(l.split('=',1)[1].strip() for l in (OUT/'gradle.properties').read_text(encoding='utf-8').splitlines() if l.startswith('version='))
CORE_JAR=OUT/f'dist/rejuvenation-fields-{MOD_VERSION}.jar'
def allowed(lib):
    result=not bool(lib.get('rules'))
    for r in lib.get('rules',[]):
        platform=r.get('os',{})
        if platform.get('name','windows')!='windows':continue
        if platform.get('arch','x86_64') not in ['x86_64','amd64']:continue
        result=r['action']=='allow'
    return result and lib.get('include_in_classpath',True)
cp=[]
for lib in v['libraries']:
    if not allowed(lib):continue
    artifact=lib.get('downloads',{}).get('artifact',{}).get('path')
    if artifact is None:
        group,name,version=lib['name'].split(':')[:3];artifact=f'{group.replace(".","/")}/{name}/{version}/{name}-{version}.jar'
    p=META/'libraries'/artifact
    if not p.is_file():raise FileNotFoundError('Missing cached runtime library '+str(p))
    cp.append(str(p))
cp.append(str(META/f'versions/{VERSION}/{VERSION}.jar'))
for folder in ['mods','config','defaultconfigs','datapacks']:
    if (ROOT/folder).exists():shutil.copytree(ROOT/folder,GAME/folder,dirs_exist_ok=True)
# Remove Reloading Screen (rrls, added to the profile on 2026-10-11) starts quick-play before the client atlas exists, and Cobblemon's
# berry model reload then aborts the world load ('Tried to lookup sprite'). It is a client-only loading-screen mod: leave it out of the isolated copy.
for visual in (GAME/'mods').glob('rrls-*.jar'):visual.unlink()
# The profile's shaderpack is not copied. Keep the isolated client independent
# of that optional visual setting, which can stop quick-play at an error screen.
iris=GAME/'config/iris.properties'
if iris.exists():iris.write_text(iris.read_text(encoding='utf-8').replace('enableShaders=true','enableShaders=false'),encoding='utf-8')
# Exactly the current build: the core and compat jars and the base, COBBLEVERSE and Classic Kanto packs from dist/ (Global Packs loads
# <gameDir>/datapacks). Copies the profile may still hold from older versions are dropped first.
for stale in list((GAME/'mods').glob('rejuvenation-fields-*.jar'))+list((GAME/'mods').glob('rejuvenation-verification-fixture-*.jar'))+list((GAME/'datapacks').glob('rejuvenation-fields-*.zip')):stale.unlink()
for name in [f'rejuvenation-fields-{MOD_VERSION}.jar',f'rejuvenation-fields-compat-{MOD_VERSION}.jar']:shutil.copy2(OUT/'dist'/name,GAME/'mods'/name)
for name in [f'rejuvenation-fields-base-{MOD_VERSION}.zip',f'rejuvenation-fields-cobbleverse-{MOD_VERSION}.zip',f'rejuvenation-fields-cobbleverse-classic-{MOD_VERSION}.zip']:shutil.copy2(OUT/'dist'/name,GAME/'datapacks'/name)
fixture=GAME/f'mods/rejuvenation-verification-fixture-{MOD_VERSION}.jar'
if check_battles:shutil.copy2(OUT/f'integration/rejuvenation-verification-fixture-{MOD_VERSION}.jar',fixture)
elif fixture.exists():fixture.unlink()
world=GAME/'saves/RejuvenationVerification'
# Reused chunks retained the first fixture's y=200 arena and defeated the ground-level fix.
# This is the owned verification world only; the real save is read solely for level metadata.
if world.resolve() != (OUT/'integration/game/saves/RejuvenationVerification').resolve():
    raise RuntimeError('Refusing to reset a world outside the isolated verification directory')
if world.exists():shutil.rmtree(world)
world.mkdir(parents=True,exist_ok=True)
shutil.copy2(ROOT/'saves/New World/level.dat',world/'level.dat')
if (ROOT/'saves/New World/datapacks').exists():shutil.copytree(ROOT/'saves/New World/datapacks',world/'datapacks',dirs_exist_ok=True)
if (ROOT/'options.txt').exists():shutil.copy2(ROOT/'options.txt',GAME/'options.txt')
# A paused integrated server stops ticking the fixture; keep it running when the window loses focus (isolated copy only).
options=GAME/'options.txt'
if options.exists():
    options.write_text(options.read_text(encoding='utf-8')
        .replace('pauseOnLostFocus:true','pauseOnLostFocus:false')
        .replace('fullscreen:true','fullscreen:false')
        .replace('enableVsync:true','enableVsync:false'),encoding='utf-8')
native=META/f'natives/{VERSION}'
args=[str(Path('C:/Program Files/Java/jdk-21/bin/java.exe')),'-Xmx4G','-XX:ActiveProcessorCount=4',
    '-Djava.library.path='+str(native),'-Dorg.lwjgl.system.SharedLibraryExtractPath='+str(native),
    '-Djna.tmpdir='+str(GAME/'natives'),'-Dminecraft.launcher.brand=RejuvenationVerification',
    '-cp',os.pathsep.join(cp),v['mainClass'],'--username','FieldCheck','--version',VERSION,
    '--gameDir',str(GAME),'--assetsDir',str(META/'assets'),'--assetIndex',v['assetIndex']['id'],
    '--uuid','00000000000000000000000000000003','--accessToken','0','--userType','legacy',
    '--versionType','release','--width','854','--height','480','--quickPlaySingleplayer','RejuvenationVerification']
if '--abilities' in sys.argv:args.insert(1,'-Drejuvenation.verifyAbilities=true')
if '--status' in sys.argv:args.insert(1,'-Drejuvenation.verifyStatuses=true')
if '--extended' in sys.argv:args.insert(1,'-Drejuvenation.verifyExtended=true')
if '--evcards' in sys.argv:args.insert(1,'-Drejuvenation.verifyEvCards=true')
if '--integration' in sys.argv:
    args.insert(1,'-Drejuvenation.verifyIntegration=true')
    # Readable screenshots of the battle HUD.
    args[args.index('--width')+1]='1600';args[args.index('--height')+1]='900'
    shots=GAME/'screenshots'
    for stale in (shots.glob('rejuvenation-*.png') if shots.exists() else []):stale.unlink()
log=OUT/'research/test-results/live-startup.log';report={'mode':mode or 'startup','version':VERSION,'gameDir':str(GAME),'originalWorldCopied':False,'freshChunks':True,'success':False,'jarSha256':hashlib.sha256(CORE_JAR.read_bytes()).hexdigest()}
if log.exists():shutil.copy2(log,log.with_name('live-startup-'+str(int(time.time()))+'.log'))
previous=log.with_suffix('.json')
if previous.exists():shutil.copy2(previous,previous.with_name('live-startup-'+str(int(time.time()))+'.json'))
export=GAME/'rejuvenation/research/runtime-biomes.json'
if export.exists():export.unlink()
battle_export=GAME/'rejuvenation/research/live-battle.json'
if battle_export.exists():battle_export.unlink()
start=time.monotonic()
with log.open('w',encoding='utf-8') as stream:
    proc=subprocess.Popen(args,cwd=GAME,stdout=stream,stderr=subprocess.STDOUT,creationflags=subprocess.CREATE_NO_WINDOW)
    report['processId']=proc.pid
    (OUT/'research/test-results/live-process.json').write_text(json.dumps({'pid':proc.pid,'gameDir':str(GAME)}),encoding='utf-8')
    try:
        while proc.poll() is None and time.monotonic()-start<(900 if mode in ('integration','evcards') else 600 if mode=='extended' else 300):
            stream.flush()
            tail=log.read_text(encoding='utf-8',errors='replace')[-12000:]
            if 'Uncaught exception in thread "Cobblemon Showdown"' in tail:
                report['failure']='Battle worker startup exception';break
            if "can't proceed with server load" in tail:
                report['failure']='Integrated server resource/level load failed';break
            if 'Failed to encode packet' in tail:
                report['failure']='Client/server packet encoding failure';break
            if export.exists():
                data=json.loads(export.read_text(encoding='utf-8'));report['liveBiomes']=len(data['biomes']);report['catalogRevision']=data['revision']
                shutil.copy2(export,OUT/'research/runtime-biomes.json')
                if not check_battles:report['success']=True;break
                if battle_export.exists():
                    result=json.loads(battle_export.read_text(encoding='utf-8'));shutil.copy2(battle_export,OUT/'research/test-results/live-battle.json')
                    report['success']=result['success'];report['battleChecks']=result
                    break
            time.sleep(5)
    finally:
        if proc.poll() is None:proc.terminate();proc.wait(timeout=30)
    report['exitCode']=proc.returncode;report['elapsedSeconds']=round(time.monotonic()-start,1)
    report['terminationReason']='Owned test process terminated after verification/timeout; exit code is not a crash assertion'
    stream.flush()
    field_errors=('Could not prepare field-aware move previews','Field evaluation failed','Malformed field payload ignored','Field panel rendering failed','Failed to encode packet','Uncaught exception in thread "Cobblemon Showdown"')
    report['fieldIntegrationErrors']=[line for line in log.read_text(encoding='utf-8',errors='replace').splitlines() if any(marker in line for marker in field_errors)]
    if report['fieldIntegrationErrors']:
        report['success']=False;report['failure']='Field integration error in the owned game log'
    if mode:
        mode_log=OUT/f'research/test-results/live-mode-{mode}.log'
        if mode_log.exists():mode_log.unlink()
        shutil.copy2(log,mode_log)
        report['log']='research/test-results/'+mode_log.name
    (OUT/'research/test-results/live-startup.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
    # One receipt per mode, so later runs do not overwrite other evidence.
    if mode:(OUT/f'research/test-results/live-mode-{mode}.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
    if mode=='integration':
        # Keep the panel screenshots next to the receipt.
        target=OUT/'research/test-results/screenshots';target.mkdir(parents=True,exist_ok=True)
        for shot in (GAME/'screenshots').glob('rejuvenation-*.png'):shutil.copy2(shot,target/shot.name)
print(json.dumps(report,indent=2))
sys.exit(0 if report['success'] else 1)
