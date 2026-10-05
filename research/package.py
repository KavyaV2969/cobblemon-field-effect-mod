"""Package only authored field content, with reproducible archives and receipts."""
from pathlib import Path
import hashlib,json,zipfile
ROOT=Path(__file__).resolve().parents[1];DIST=ROOT/'dist';DIST.mkdir(exist_ok=True)
def read(p):return json.loads(p.read_text(encoding='utf-8'))
def digest(p):return hashlib.sha256(p.read_bytes()).hexdigest()
jar=DIST/'rejuvenation-fields-0.2.0.jar'
with zipfile.ZipFile(jar) as z:
    required=['fabric.mod.json','rejuvenation.mixins.json','rejuvenation-engine.js','dev/rejuvenation/RejuvenationFields.class','dev/rejuvenation/mixin/ShowdownMixin.class']
    assert all(n in z.namelist() for n in required),'Missing runtime component'
    assert not any(n.endswith('.jar') or n.startswith('com/cobblemon/') for n in z.namelist()),'Dependencies must not be redistributed'
    assert all(n.startswith('dev/rejuvenation/') for n in z.namelist() if n.endswith('.class')),'External classes must not be bundled'
    assert z.read('rejuvenation-engine.js')==(ROOT/'mod/src/main/resources/rejuvenation-engine.js').read_bytes(),'Jar has stale engine'
    # Client UI resources: exactly the 57 field backdrops plus their attribution and provenance manifest.
    backdrops=[n for n in z.namelist() if n.startswith('assets/rejuvenation/textures/gui/field/') and n.endswith('.png')]
    assert len(backdrops)==57,'Missing field backdrops'
    assert 'assets/rejuvenation/textures/gui/field/ATTRIBUTION.txt' in z.namelist() and 'assets/rejuvenation/field_backdrops.json' in z.namelist()
    assert 'rejuvenation.compat.mixins.json' in z.namelist() and 'dev/rejuvenation/client/RejuvenationFieldsClient.class' in z.namelist()
    # Dedicated-server safety: only client classes may refer to client-only Minecraft, Cobblemon or Fabric classes.
    import re
    client_only=[rb'net/minecraft/class_310(?![0-9])',rb'net/minecraft/class_332(?![0-9])',rb'com/cobblemon/mod/common/client/',rb'net/fabricmc/fabric/api/client/',rb'dev/rejuvenation/client/']
    for n in z.namelist():
        if not n.endswith('.class') or n.startswith('dev/rejuvenation/client/') or n.startswith('dev/rejuvenation/compat/mixin/BattleExtras'):continue
        data=z.read(n)
        leaked=[c.decode() for c in client_only if re.search(c,data)]
        assert not leaked,f'{n} references client-only classes {leaked}'
    meta=json.loads(z.read('fabric.mod.json'))
    assert meta['entrypoints']['client']==['dev.rejuvenation.client.RejuvenationFieldsClient']
    compat=json.loads(z.read('rejuvenation.compat.mixins.json'))
    assert all(m.startswith('BattleExtras') for m in compat['client']) and all(m.startswith('RunBun') for m in compat['mixins'])
pack=DIST/'rejuvenation-fields-datapack-0.2.0.zip'
with zipfile.ZipFile(pack,'w',compression=zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in sorted((ROOT/'datapack').rglob('*')):
        if not p.is_file():continue
        name=p.relative_to(ROOT/'datapack').as_posix();info=zipfile.ZipInfo(name,(2026,10,4,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o644<<16
        z.writestr(info,p.read_bytes())
with zipfile.ZipFile(pack) as z:
    assert 'pack.mcmeta' in z.namelist()
    definitions=[n for n in z.namelist() if '/fields/' in n and n.endswith('.json')];assert len(definitions)==57
    for n in definitions:assert read(ROOT/'datapack'/n)==json.loads(z.read(n))
    # The datapack is server data only: no client artwork.
    assert not any(n.endswith('.png') or n.startswith('assets/') for n in z.namelist()),'Graphics must not be in the datapack'
    assert any('/structures/' in n for n in z.namelist()),'Structure mappings missing'
validation=read(ROOT/'research/test-results/datapack-validation.json');tests=read(ROOT/'research/test-results/simulator.json');comparison=read(ROOT/'research/source-comparison.json');review=read(ROOT/'research/test-results/semantic-review-validation.json')
assert not validation['errors'] and not tests['failed'] and not comparison['differences']
manifest={'version':'0.2.0','releaseStatus':'source-audit-complete-preview','minecraft':'1.21.1','loader':'Fabric 0.18.4','cobblemon':'1.7.3+1.21.1',
    'artifacts':[{'path':p.name,'bytes':p.stat().st_size,'sha256':digest(p)} for p in [jar,pack]],
    'fieldsDiscovered':57,'definitionsLoaded':57,'sourceAuditClosedFields':len(review['completeFields']),'partiallyImplemented':57-len(review['completeFields']),
    'fullyBehaviorallyVerified':0,'behaviorVerificationScope':'Simulator regression suite plus selected live Minecraft battles; no exhaustive live or two-client multiplayer certification',
    'compiledDefinitionPropertiesCompared':comparison['comparisons'],'compiledDefinitionDifferences':len(comparison['differences']),
    'simulatorTestsPassed':tests['passed'],'candidateBiomes':validation['biomes'],'explicitlyMappedCandidates':validation['explicitBiomes'],'candidateFallbacks':0,
    'unavailableReferences':validation['unavailableCounts'],
    'clientAssets':{'fieldBackdrops':57,'source':'Pokémon Rejuvenation V14 Graphics/Battlebacks (see assets/rejuvenation/field_backdrops.json)','clientOnly':True},
    'integrations':{'rbrctai':'adapter mixins (optional, applied only when installed)','cobblemon-battle-extras':'client adapter mixins (optional, applied only when installed)'},
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
    manifest['liveVerification']={'historical':True,'artifactMatches':result.get('jarSha256')==digest(jar),
        'success':result.get('success',False),'battles':result.get('battleChecks',{}).get('battles',0),
        'registeredBiomes':result.get('liveBiomes'),'receipt':'../research/test-results/live-startup.json'}
# Per-mode receipts (live_check.py --battle/--status/--abilities/--extended).
modes={}
for receipt in sorted((ROOT/'research/test-results').glob('live-mode-*.json')):
    mode=receipt.stem[len('live-mode-'):]
    if mode not in ("battle","status","abilities","extended","integration"):continue
    result=read(receipt);checks=result.get('battleChecks',{})
    modes[mode]={'artifactMatches':result.get('jarSha256')==digest(jar),'success':result.get('success',False),
        'battles':checks.get('battles',0),'checks':len(checks.get('checks',[])),'receipt':'../research/test-results/'+receipt.name}
if modes:manifest['liveModes']=modes
runtime=ROOT/'research/runtime-biomes.json'
if runtime.exists():
    registry=read(runtime);manifest['liveBiomeRegistry']={'count':len(registry['biomes']),
        'receipt':'../research/runtime-biomes.json'}
graal=ROOT/'research/test-results/graal-performance.json'
if graal.exists():manifest['performance']=read(graal)
build=ROOT/'research/test-results/build.log'
if build.exists():manifest['buildLog']={'successful':'BUILD SUCCESSFUL' in build.read_text(encoding='utf-8',errors='replace'),'sha256':digest(build),'path':'../research/test-results/build.log'}
# Completion requires the closed field register, zero open AI leads, receipts of the shipped engine and a successful build.
engine_sha=digest(ROOT/'mod/src/main/resources/rejuvenation-engine.js')
ai=read(ROOT/'research/ai-coverage.json')
receipts={name:ROOT/'research/test-results'/file for name,file in [('simulator','simulator.json'),('java','java-verification.json'),('graal','graal-performance.json'),
    ('benchmark','strategy-benchmark.json'),('integrationReport','integration-completion.json')]}
fresh={name:path.exists() and read(path).get('engineSha256')==engine_sha for name,path in receipts.items()}
build_ok=manifest.get('buildLog',{}).get('successful',False)
ai_open=ai['dispositions'].get('ai_review_pending',0)+ai['dispositions'].get('ai_strategy_gap',0)
manifest['integrationEvidence']={'engineSha256':engine_sha,'aiLeads':ai['leads'],'aiDispositions':ai['dispositions'],'aiOpenLeads':ai_open,
    'receiptsMatchEngine':fresh,'buildSuccessful':build_ok,'report':'../docs/INTEGRATIONS.md','receipt':'../research/test-results/integration-completion.json',
    'scope':'Bounded field-aware strategy over Run & Bun scoring and exact field previews; not a claim of source-equivalent AI play'}
if receipts['benchmark'].exists():
    bench=read(receipts['benchmark'])
    manifest['integrationEvidence']['decisionLatency']={'warmMedianMillis':{('doubles' if r.get('doubles') else str(r['teamSize']))+(f"-turn{r['turn']}" if r.get('turn') else ''):r['warmMedianMillis'] for r in bench['strategy']},
        'processorAffinity':bench.get('processorAffinity'),'publicationWarmupMillis':bench.get('publicationWarmupMillis')}
manifest['implementationCompletionStandardMet']=(not review['ordinaryPending'] and len(review['completeFields'])==57 and ai_open==0 and all(fresh.values()) and build_ok)
(DIST/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
print('Packaged',jar.name,'and',pack.name,'with SHA-256 receipt;',len(review['completeFields']),'of 57 fields source-audit closed')
