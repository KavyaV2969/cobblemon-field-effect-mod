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
check_battles='--battle' in sys.argv or '--status' in sys.argv
v=json.loads((META/f'versions/{VERSION}/{VERSION}.json').read_text(encoding='utf-8'))
GAME.mkdir(parents=True,exist_ok=True)
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
shutil.copy2(OUT/'dist/rejuvenation-fields-0.1.0.jar',GAME/'mods/rejuvenation-fields-0.1.0.jar')
fixture=GAME/'mods/rejuvenation-verification-fixture-0.1.0.jar'
if check_battles:shutil.copy2(OUT/'integration/rejuvenation-verification-fixture-0.1.0.jar',fixture)
elif fixture.exists():fixture.unlink()
world=GAME/'saves/RejuvenationVerification';world.mkdir(parents=True,exist_ok=True)
shutil.copy2(ROOT/'saves/New World/level.dat',world/'level.dat')
if (ROOT/'saves/New World/datapacks').exists():shutil.copytree(ROOT/'saves/New World/datapacks',world/'datapacks',dirs_exist_ok=True)
shutil.copytree(OUT/'datapack',world/'datapacks/rejuvenation',dirs_exist_ok=True)
if (ROOT/'options.txt').exists():shutil.copy2(ROOT/'options.txt',GAME/'options.txt')
native=META/f'natives/{VERSION}'
args=[str(Path('C:/Program Files/Java/jdk-21/bin/java.exe')),'-Xmx4G','-XX:ActiveProcessorCount=4',
    '-Djava.library.path='+str(native),'-Dorg.lwjgl.system.SharedLibraryExtractPath='+str(native),
    '-Djna.tmpdir='+str(GAME/'natives'),'-Dminecraft.launcher.brand=RejuvenationVerification',
    '-cp',os.pathsep.join(cp),v['mainClass'],'--username','FieldCheck','--version',VERSION,
    '--gameDir',str(GAME),'--assetsDir',str(META/'assets'),'--assetIndex',v['assetIndex']['id'],
    '--uuid','00000000000000000000000000000003','--accessToken','0','--userType','legacy',
    '--versionType','release','--width','854','--height','480','--quickPlaySingleplayer','RejuvenationVerification']
if '--status' in sys.argv:args.insert(1,'-Drejuvenation.verifyStatuses=true')
log=OUT/'research/test-results/live-startup.log';report={'version':VERSION,'gameDir':str(GAME),'originalWorldCopied':False,'freshChunks':True,'success':False,'jarSha256':hashlib.sha256((OUT/'dist/rejuvenation-fields-0.1.0.jar').read_bytes()).hexdigest()}
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
        while proc.poll() is None and time.monotonic()-start<300:
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
    (OUT/'research/test-results/live-startup.json').write_text(json.dumps(report,indent=2)+'\n',encoding='utf-8')
print(json.dumps(report,indent=2))
