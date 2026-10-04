"""Generate inspectable catalogues and audit ledgers, without overstating fidelity."""
from pathlib import Path
import json,collections
from review_registry import reviewed_audit
ROOT=Path(__file__).resolve().parents[1];DOC=ROOT/'docs';DOC.mkdir(exist_ok=True)
def read(name):return json.loads((ROOT/'research'/name).read_text(encoding='utf-8'))
def write(path,text):path.parent.mkdir(parents=True,exist_ok=True);path.write_text(text.rstrip()+'\n',encoding='utf-8')
def cell(v):return str(v).replace('|','\\|').replace('\n','<br>')
def compact(v):return json.dumps(v,ensure_ascii=False,separators=(',',':'))
catalog=read('catalog.json');fields=catalog['fields'];audit=reviewed_audit();missing=read('reference-validation.json')['unavailable']
review_counts=collections.Counter(a['status'] for a in audit)
overview=['# Rejuvenation field catalogue','','Local reference: Rejuvenation **14.0.14**, 57 entries including `INDOOR` (56 substantive field states).',
    '', 'Each linked specification lists the imported move/type content and the additional executable rules. These describe current implementation data; they are not a claim that all distributed Ruby behavior has been reproduced.',
    '', '[Coverage and source review ledger](FIELD_COVERAGE.md) distinguishes definition comparisons from complete behavioral verification.',
    '', '| Original ID | Display name | Datapack ID | Specification |','|---|---|---|---|']
coverage=['# Field coverage','','**Full-system fidelity is unfinished.** All 57 definitions load and their 3,963 compared compiled-data properties match. No field is certified as fully verified against every distributed runtime branch.',
    '', 'An executed local Ruby oracle also compares `fieldDefenseBoost` across all shipped field IDs and `calculateFieldMultiplier` against the engine. The current receipt records 171,396 defense contexts and 120 difficulty/Frenzy contexts with zero differences. These two-method checks do not close unrelated runtime leads or certify complete fields; see [TESTING.md](TESTING.md).',
    '', f'The source audit found {len(audit):,} syntactic field-condition blocks: {sum(a["file"]=="Battle_AI.rb" for a in audit):,} in battle AI and {sum(a["file"]!="Battle_AI.rb" for a in audit):,} elsewhere. Blocks are nested, can mention multiple fields, and include inactive Reborn branches, UI/capture code and game-specific contexts. They are review leads, not unique mechanic counts.',
    '', 'The implementation has '+str(sum(len(f['rules']) for f in fields.values()))+' additional executable rule rows, plus engine operators, core move/type rows, type-chart overrides, seeds and transitions. Shared Pledge/Conversion rules repeat across all 57 definitions; rows are not counts of unique mechanics. A rule is not equivalent to an AST block. Unsupported references are listed precisely in [LIMITATIONS.md](LIMITATIONS.md); remaining implementation work is tracked separately.',
    '', 'Manual semantic decisions are retained in `research/semantic-reviews.json`. Source-file and AST-body fingerprints plus named passing test receipts validate each implementation decision. No generator infers completion from rule presence. Current source-lead dispositions: `'+compact(dict(review_counts))+'`.',
    '', '| Field | Core move rows | Additional rules | Runtime leads | Reviewed runtime leads | AI leads | Pending runtime leads | Verified |',
    '|---|---:|---:|---:|---:|---:|---:|---|']
ledger={}
for id,f in fields.items():
    slug=id.split(':')[1];sym=f['originalId'];refs=[a for a in audit if sym in a['fields']];runtime=[a for a in refs if a['file']!='Battle_AI.rb'];ai=[a for a in refs if a['file']=='Battle_AI.rb']
    unsupported={kind:[key for key,locations in values.items() if any(p.startswith(id+'/') for p in locations)] for kind,values in missing.items()}
    runtime_counts=collections.Counter(a['status'] for a in runtime)
    ledger[id]={'definitionComparison':'passed','implementationComplete':False,'fullBehaviorVerified':False,'runtimeSourceLeads':runtime,'aiSourceLeads':ai,'semanticReviewCounts':dict(runtime_counts),'implementedRules':len(f['rules']),'unavailableReferences':unsupported,
        'methodOracle':{'methods':['fieldDefenseBoost','calculateFieldMultiplier'],'receipt':'test-results/runtime-oracle.json','fullFieldCertification':False},
        'warning':'No automatic one-to-one certification of distributed source blocks. Review source conditions, enclosing guards, handler order and original tests before marking verified.'}
    overview.append('| '+ ' | '.join(map(cell,[sym,f['name'],id,f'[Details](fields/{slug}.md)']))+' |')
    coverage.append('| '+' | '.join(map(cell,[f['name'],len(f['moves']),len(f['rules']),len(runtime),len(runtime)-runtime_counts['requires_behavioral_comparison'],len(ai),runtime_counts['requires_behavioral_comparison'],'Definition properties only; full behavior pending']))+' |')
    text=[f'# {f["name"]}','','Original ID: `'+sym+'`; datapack ID: `'+id+'`.',
        '', '**Verification:** compiled definition comparison passed; full distributed behavior verification pending.',
        '', '## Initialization','','Entry text: '+compact(f['entryMessage']),
        '', 'Nature Power: `'+f['naturePower']+'`. Secret Power animation/reference move: `'+f['secretPower']+'`.',
        '', 'Secret Power actual secondary choices: `'+compact(f.get('secretPowerEffects'))+'`.',
        '', 'Mimicry type: `'+str(f.get('mimicry'))+'`; Burmy cloak reference: `'+str(f.get('burmyCloak'))+'`. The cloak metadata does not mutate persisted Minecraft Pokémon.',
        '', 'Seed data: `'+compact(f.get('seed'))+'`. Seed actions: `'+compact(f.get('seedActions'))+'`.',
        '', 'Absorbed healing configuration: `'+compact(f.get('healing'))+'`.',
        '', 'Grounding policy: `'+compact(f.get('grounding'))+'`. Terrain policy: `'+compact(f.get('terrainPolicy'))+'`.',
        '', 'Binding and Octolock: `'+compact(f.get('trapping'))+'`.',
        '', 'Condition durations: `'+compact(f.get('conditionDurations'))+'`. Volatile policies: `'+compact(f.get('volatilePolicies'))+'`.',
        '', 'Capture multipliers: `'+compact(f.get('captureModifiers'))+'` (Balls.rb:143,166). Incoming weather conversions: `'+compact(f.get('weatherConversions'))+'`.',
        '', 'Multiplier policy: `'+compact(f.get('multiplierPolicy'))+'`. Restoration text: `'+compact(f.get('expirationReturnMessage'))+'`.',
        '', 'Shared stat pools: `'+compact(f.get('statPools'))+'`. Absorber policies: `'+compact(f.get('abilityAbsorptions'))+'`. Indirect immunity: `'+compact(f.get('indirectImmunityAbilities'))+'`.',
        '', 'Persistent statuses: `'+compact(f.get('persistentStatusPolicies'))+'`. Independent capture environment: `'+compact(f.get('captureEnvironmentModifiers'))+'`.',
        '', 'Ability callback handlers: `'+compact(f.get('abilityHandlers'))+'`. Inactive abilities: `'+compact(f.get('inactiveAbilities'))+'`. Status type bypass: `'+compact(f.get('statusTypeBypass'))+'`.',
        '', 'Field form typing: `'+compact(f.get('nativeFormTyping'))+'`. Custom volatile rules: `'+compact(f.get('customVolatiles'))+'`. Rampage policy: `'+compact(f.get('rampagePolicy'))+'`.',
        '', 'Progression: `'+compact(f.get('progression'))+'`. Party roles: `'+compact(f.get('partyRoles'))+'`.',
        '', 'Field clock policy: `'+compact(f.get('clockPolicy'))+'`.\n\nFields persist for the battle unless transformed/destroyed. Move/ability terrain creation uses its own finite duration; engine stack restoration and overlay clocks are described in ARCHITECTURE.md.',
        '', '## Core move rules','','| Move ID | Executable properties and exact source text |','|---|---|']
    for mid,row in f['moves'].items():text.append('| `'+mid+'` | '+cell(compact(row))+' |')
    text+=['','## Core type and move-tag rules','','| Condition | Properties |','|---|---|']
    for row in f['types']:text.append('| '+cell(compact(row['match']))+' | '+cell(compact({k:v for k,v in row.items() if k!='match'}))+' |')
    if f.get('overlay'):text+=['','## Overlay definition','','```json',json.dumps(f['overlay'],indent=2,ensure_ascii=False),'```']
    if f.get('typeChart'):text+=['','## Type-chart exceptions','','| Attacking type | Defending type | Result exponent / immunity | Condition |','|---|---|---|---|']+['| '+' | '.join(cell(compact(r[k])) for k in ['attackType','defenseType','value','condition'])+' |' for r in f['typeChart']]
    text+=['','## Additional executable rules','','| Event | Condition | Actions | Local provenance |','|---|---|---|---|']
    for r in f['rules']:text.append('| '+' | '.join(cell(compact(r[k])) for k in ['event','condition','actions','source'])+' |')
    text+=['','## Original status-move highlights','','Source UI buff highlights: `'+compact(f['statusBuffs'])+'`.',
        '', 'Source UI nerf highlights: `'+compact(f['statusNerfs'])+'`. These lists are annotations, not executable mechanics.',
        '', 'Behavior review metadata: `'+compact(f.get('statusMoveBehaviorCoverage'))+'`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.',
        '', '## Distributed-source review leads','','These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.',
        '', '| Source location | Field condition | Review disposition | Decision and evidence |','|---|---|---|---|']
    for r in runtime:
        review=r.get('semanticReview',{})
        text.append('| '+' | '.join(cell(v) for v in [r['file']+':'+str(r['line']),r['condition'],r['status'],review.get('semantics','Semantic comparison pending')+' Tests: '+', '.join(review.get('tests',[]))])+' |')
    text+=['','AI source leads: '+str(len(ai))+'. See `research/field-coverage-ledger.json` for every AI and runtime location.',
        '', 'Unavailable IDs in current generated data: `'+compact(unsupported)+'`.']
    write(DOC/'fields'/f'{slug}.md','\n'.join(text))
write(DOC/'REJUVENATION_FIELDS.md','\n'.join(overview));write(DOC/'FIELD_COVERAGE.md','\n'.join(coverage))
write(ROOT/'research/field-coverage-ledger.json',json.dumps(ledger,indent=2,ensure_ascii=False))
rows=read('biome-mapping.json');mapping=['# Biome mapping','','The archive/loose-data scan discovered **165 candidate biome IDs**, all explicitly mapped: 66 `minecraft`, 95 `terralith`, 2 `lumymon`, 1 `cobblemonraiddens`, 1 `legendarymonuments`. No discovered candidate relies on fallback.',
    '', '`minecraft` includes 64 vanilla biomes plus VanillaBackport’s `minecraft:pale_garden` and `minecraft:sulfur_caves`. Its `ModBiomes` bytecode registers exactly those two additions; Iris/particle/map biome classes inspect biomes rather than supplying new ones.',
    '', '**Live registry:** an isolated Minecraft/Fabric startup using this profile’s installed mods, configuration, required packs and world level metadata exported **70 registered biome IDs**. All 70 have explicit mappings and zero use fallback. `research/runtime-biomes.json` records the actual IDs. This check generated fresh chunks and did not modify the original world.',
    '', '**Enabled-world distinction:** `saves/New World/level.dat` lists Terralith-DP.zip as disabled. Its additional 95 IDs are intentionally covered for optional activation. Therefore 165 is the candidate catalogue, not the active registry count.',
    '', 'At server start, the mod writes `rejuvenation/research/runtime-biomes.json` with actual registered IDs and explicit/fallback coverage. Dynamically registered future biomes are resolved through tags, dimensions, depth and the default.',
    '', 'Wild battle anchor: first non-player entity-backed actor (the wild Pokémon), then a player fallback. Environment overrides use the anchor position, not a player’s arbitrary home biome. Submerged Overworld battles use Underwater. Selected surface mappings use Cave when at least 12 blocks below the solid-surface height and sky is hidden.',
    '', '| Biome ID | Source mod/pack | Selected field | Reason | Mechanism / availability |','|---|---|---|---|---|']
for row in rows:
    src=row['source'];label='Terralith (optional datapack)' if row['biome'].startswith('terralith:') else 'VanillaBackport' if row['biome'] in ['minecraft:pale_garden','minecraft:sulfur_caves'] else 'Minecraft' if row['biome'].startswith('minecraft:') else row['biome'].split(':')[0]
    mapping.append('| '+' | '.join(cell(v) for v in [row['biome'],label,row['field'],row['reason'],'explicit; optional disabled pack' if label.startswith('Terralith') else 'explicit; non-Terralith candidate'])+' |')
mapping+=['','The exact source archive paths for each row are in `research/biome-mapping.json` and `research/biome-inventory.json`.','', '## Future compatibility rules','','| Predicate | Field | Reason |','|---|---|---|']
for row in catalog['mappings']:
    if 'biome' not in row:mapping.append('| '+cell(compact({k:v for k,v in row.items() if k not in ['field','reason']}))+' | '+cell(row['field'])+' | '+cell(row['reason'])+' |')
write(DOC/'BIOME_MAPPING.md','\n'.join(mapping))
mods=read('mod-inventory.json');top={m['id']:m for m in mods if m['archive'].startswith('mods\\') and '!' not in m['archive']}
inventory=['# Inspected profile','','Minecraft 1.21.1; Fabric Loader 0.18.4; Fabric API 0.116.14+1.21.1; Cobblemon 1.7.3+1.21.1; Java 21. No existing Java/Kotlin project or Git checkout was present in the profile.',
    '', 'Standalone Java 21 project, Gradle 8.13, exact installed intermediary Minecraft ABI. Cobblemon’s named classes remain unchanged. No Yarn/official source remapping is performed by this project; all Minecraft symbols are compiled against the installed intermediary client jar.',
    '', 'Trainer framework: RCT API 0.15.2-beta and RCT Mod 0.18.1-beta. Run & Bun extension: rbrctai metadata 0.15.0-beta (filename says 0.16.0-beta). Existing RCT global packs, trainer teams, League content, Run & Bun configs and code remain untouched.',
    '', 'The scan inventoried 142 top-level mod jars, 548 metadata records across jars/nested jars/cache copies, 651 biome-tag IDs and 5 custom dimension definitions. Counts include optional and duplicate-source candidates; detailed inventories retain provenance.',
    '', '| Installed mod ID | Version from metadata | Archive |','|---|---|---|']
for m in sorted(top.values(),key=lambda m:m['id']):inventory.append('| '+' | '.join(cell(m[k]) for k in ['id','version','archive'])+' |')
inventory+=['','## Packs','','| Pack/archive | Format | Entries |','|---|---:|---:|']
for p in read('pack-inventory.json'):inventory.append('| '+' | '.join(cell(v) for v in [p['path'],p['metadata'].get('pack',{}).get('pack_format','?'),p['entries']])+' |')
inventory+=['','Resource-pack sources include `config/cobbleverse`, resourcepacks archives and mod resources. Global Packs requires `datapacks/` and makes `datapacks/extra` optional. This task did not change those settings or existing pack enablement.',
    '', 'Other battle extensions detected include Cobblemon Battle Extras, battle positions, raid dens, Mega Showdown, ZA Mega, Fight or Flight and custom held-item/move resources. Engine reference validation includes 60 addon registry resources in addition to the shipped simulator dex.']
write(DOC/'MODPACK_INVENTORY.md','\n'.join(inventory))
print('Generated catalogues for',len(fields),'fields and',len(rows),'biomes; full behavioral verification remains pending')
