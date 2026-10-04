"""Package only authored field content, with reproducible archives and receipts."""
from pathlib import Path
import hashlib,json,zipfile
ROOT=Path(__file__).resolve().parents[1];DIST=ROOT/'dist';DIST.mkdir(exist_ok=True)
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
jar=DIST/'rejuvenation-fields-0.1.0.jar'
with zipfile.ZipFile(jar) as z:
    required=['fabric.mod.json','rejuvenation.mixins.json','rejuvenation-engine.js','dev/rejuvenation/RejuvenationFields.class','dev/rejuvenation/mixin/ShowdownMixin.class']
    assert all(n in z.namelist() for n in required),'Missing runtime component'
    assert not any(n.endswith('.jar') or n.startswith('com/cobblemon/') for n in z.namelist()),'Dependencies must not be redistributed'
    assert z.read('rejuvenation-engine.js')==(ROOT/'mod/src/main/resources/rejuvenation-engine.js').read_bytes(),'Jar has stale engine'
pack=DIST/'rejuvenation-fields-datapack-0.1.0.zip'
with zipfile.ZipFile(pack,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in sorted((ROOT/'datapack').rglob('*')):
        if not p.is_file():continue
        name=p.relative_to(ROOT/'datapack').as_posix();info=zipfile.ZipInfo(name,(2026,10,4,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o644<<16
        z.writestr(info,p.read_bytes())
with zipfile.ZipFile(pack) as z:
    assert 'pack.mcmeta' in z.namelist()
    definitions=[n for n in z.namelist() if '/fields/' in n and n.endswith('.json')];assert len(definitions)==57
    for n in definitions:assert read(ROOT/'datapack'/n)==json.loads(z.read(n))
validation=read(ROOT/'research/test-results/datapack-validation.json');tests=read(ROOT/'research/test-results/simulator.json');comparison=read(ROOT/'research/source-comparison.json')
assert not validation['errors'] and not tests['failed'] and not comparison['differences']
manifest={'version':'0.1.0','releaseStatus':'incomplete-fidelity-preview','minecraft':'1.21.1','loader':'Fabric 0.18.4','cobblemon':'1.7.3+1.21.1',
    'artifacts':[{'path':p.name,'bytes':p.stat().st_size,'sha256':digest(p)} for p in [jar,pack]],
    'fieldsDiscovered':57,'definitionsLoaded':57,'fullyBehaviorallyVerified':0,'partiallyImplemented':57,
    'compiledDefinitionPropertiesCompared':comparison['comparisons'],'compiledDefinitionDifferences':len(comparison['differences']),
    'simulatorTestsPassed':tests['passed'],'candidateBiomes':validation['biomes'],'explicitlyMappedCandidates':validation['explicitBiomes'],'candidateFallbacks':0,
    'unavailableReferences':validation['unavailableCounts'],'fullCompletionStandardMet':False,
    'remainingWork':'../docs/REMAINING_WORK.md','protectedFiles':'../research/protected-integrity.json'}
oracle=ROOT/'research/test-results/runtime-oracle.json'
if oracle.exists():
    result=read(oracle)
    assert not result['differences'],'Source method oracle differences remain'
    manifest['sourceMethodOracle']={'defenseCases':result['defenseCases'],'multiplierCases':result['multiplierCases'],
        'differences':len(result['differences']),'methods':result['sourceMethods'],
        'receipt':'../research/test-results/runtime-oracle.json','scope':'Two methods only; not full field certification'}
live=ROOT/'research/test-results/live-startup.json'
if live.exists():
    result=read(live)
    manifest['liveVerification']={'artifactMatches':result.get('jarSha256')==digest(jar),
        'success':result.get('success',False),'battles':result.get('battleChecks',{}).get('battles',0),
        'registeredBiomes':result.get('liveBiomes'),'receipt':'../research/test-results/live-startup.json'}
runtime=ROOT/'research/runtime-biomes.json'
if runtime.exists():
    registry=read(runtime);manifest['liveBiomeRegistry']={'count':len(registry['biomes']),
        'receipt':'../research/runtime-biomes.json'}
build=ROOT/'research/test-results/build.log'
if build.exists():manifest['buildLog']={'successful':'BUILD SUCCESSFUL' in build.read_text(encoding='utf-8',errors='replace'),'sha256':digest(build),'path':'../research/test-results/build.log'}
(DIST/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
print('Packaged',jar.name,'and',pack.name,'with SHA-256 receipt; full fidelity remains unfinished')
