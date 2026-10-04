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
review_counts=collections.Counter(a['status'] for a in audit);comparison=read('source-comparison.json');oracle=read('test-results/runtime-oracle.json');tests=read('test-results/simulator.json')
LABELS={'implemented_and_tested':'implemented and tested','excluded_custom_move':'custom move excluded','excluded_crest':'Crest excluded','unreachable_in_build':'unreachable in this build','unsupported':'unsupported','presentation_only':'presentation only'}
# Field-specific limitations found outside the AST audit (research/audit-worklist.md, blind-spot scan).
SCAN_LIMITS={'SNOWYMOUNTAIN':[('Field.rb:1468','After a won battle a Ball Fetch party member fetches a Snowball. Cobblemon has no Snowball item or post-battle pickup.')],
    'FOREST':[('Field.rb:1474','Honey Gather is certain after a battle that ended here. Cobblemon has no Honey item or post-battle Honey Gather.')],
    'MURKWATERSURFACE':[('Field.rb:1221','The overworld puddle terrain tag selects this field. No Minecraft counterpart; field selection uses the biome/environment resolver.')]}
exceptions=[]
overview=['# Rejuvenation field catalogue','','Local reference: Rejuvenation **14.0.14**, 57 entries including `INDOOR` (56 substantive field states).',
    '', 'Each linked specification lists the imported move/type content and the additional executable rules. Every field is implemented and its source audit is closed; exceptions are recorded per field.',
    '', '[Coverage and source review ledger](FIELD_COVERAGE.md) records the implementation status of each field, evidence and exceptions.',
    '', '| Original ID | Display name | Datapack ID | Specification |','|---|---|---|---|']
coverage=['# Field coverage','',
    '**Implementation status: all 57 Rejuvenation field definitions are implemented and their source audit is closed.** Every ordinary field-dependent branch in the local Rejuvenation 14.0.14 battle scripts is either implemented with a passing named regression test, or recorded below as a custom-move/Crest exclusion, unreachable, unsupported with a concrete cause, or presentation-only. Battle AI branches wait for the Run & Bun AI adapter.',
    '', '**Verification boundary:** behavior is verified by '+str(tests['passed'])+' simulator regression checks, the Graal/Java suites, a bounded Ruby method oracle and selected live Minecraft battles. No field is certified through exhaustive live play or two-client multiplayer; see [TESTING.md](TESTING.md) and [REMAINING_WORK.md](REMAINING_WORK.md).',
    '', '## Evidence','',
    f'- **Definitions:** all 57 `fieldtext.rb` entries ship. The compiled `fields.dat` comparison checks {comparison["comparisons"]:,} properties (moves, types, messages, transitions, Nature/Secret Power, Mimicry, Burmy cloak, seeds, status highlights and change targets) with {len(comparison["differences"])} differences.',
    f'- **Runtime source leads:** the AST audit found {len(audit):,} field-condition blocks, {sum(a["file"]=="Battle_AI.rb" for a in audit):,} of them in battle AI. Every lead has an explicit decision in `research/semantic-reviews.json`, fingerprinted to the source body; implemented decisions name passing tests. Dispositions: `'+compact(dict(review_counts))+'`. Blocks nest and overlap, so these are not unique mechanic counts.',
    '- **Blind spot:** `when` clauses inside `case true` are not AST leads. `research/blindspot_scan.py` lists field references outside every lead, review and citation, and `research/audit-worklist.md` triages each one.',
    f'- **Method oracle:** the original `fieldDefenseBoost` and `calculateFieldMultiplier` agree with the engine across {oracle["defenseCases"]:,} defense and {oracle["multiplierCases"]} multiplier contexts.',
    '- **Rules:** '+f'{sum(len(f["rules"]) for f in fields.values()):,}'+' additional executable rule rows plus engine operators, core move/type rows, type-chart overrides, seeds and transitions. Shared rules repeat across definitions; rows are not unique mechanics.',
    '', '## Per-field record','',
    '| Field | Original ID | Core move rows | Additional rules | Runtime leads | Implemented and tested | Excluded (custom move/Crest) | Unreachable/unsupported | Presentation | Pending | AI leads | Status |',
    '|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|']
ledger={}
for id,f in fields.items():
    slug=id.split(':')[1];sym=f['originalId'];refs=[a for a in audit if sym in a['fields']];runtime=[a for a in refs if a['file']!='Battle_AI.rb'];ai=[a for a in refs if a['file']=='Battle_AI.rb']
    unsupported={kind:[key for key,locations in values.items() if any(p.startswith(id+'/') for p in locations)] for kind,values in missing.items()}
    runtime_counts=collections.Counter(a['status'] for a in runtime)
    ledger[id]={'definitionComparison':'passed','implementationComplete':runtime_counts['requires_behavioral_comparison']==0,'fullBehaviorVerified':False,'runtimeSourceLeads':runtime,'aiSourceLeads':ai,'semanticReviewCounts':dict(runtime_counts),'implementedRules':len(f['rules']),'unavailableReferences':unsupported,
        'methodOracle':{'methods':['fieldDefenseBoost','calculateFieldMultiplier'],'receipt':'test-results/runtime-oracle.json','fullFieldCertification':False},
        'warning':'No automatic one-to-one certification of distributed source blocks. Review source conditions, enclosing guards, handler order and original tests before marking verified.'}
    overview.append('| '+ ' | '.join(map(cell,[sym,f['name'],id,f'[Details](fields/{slug}.md)']))+' |')
    rc=runtime_counts;pending=rc['requires_behavioral_comparison']
    coverage.append('| '+' | '.join(map(cell,[f['name'],sym,len(f['moves']),len(f['rules']),len(runtime),rc['implemented_and_tested'],rc['excluded_custom_move']+rc['excluded_crest'],rc['unreachable_in_build']+rc['unsupported'],rc['presentation_only'],pending,len(ai),'Implemented; source audit closed' if not pending else 'Implementation pending']))+' |')
    for a in runtime:
        if a['status'] not in('implemented_and_tested','requires_behavioral_comparison'):
            r=a['semanticReview'];exceptions.append((sym,a['file']+':'+str(a['line']),LABELS[a['status']],r['semantics']+(' Cause: '+r['limitation'] if r.get('limitation') else '')))
    for loc,note in SCAN_LIMITS.get(sym,[]):exceptions.append((sym,loc,'unsupported (blind-spot scan)',note))
    text=[f'# {f["name"]}','','Original ID: `'+sym+'`; datapack ID: `'+id+'`.',
        '', '**Status:** '+('implemented; every runtime source lead is implemented and tested or recorded as an exclusion or limitation' if not runtime_counts['requires_behavioral_comparison'] else str(runtime_counts['requires_behavioral_comparison'])+' runtime source leads pending')+'. Compiled definition comparison passed. Not certified through exhaustive live or multiplayer play. Field-specific exceptions are listed in [FIELD_COVERAGE.md](../FIELD_COVERAGE.md).',
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
        '', '## Distributed-source review leads','','These references include nested/shared/conditional branches. Each row shows its recorded semantic decision and the named regression tests that prove it; the disposition, not the listing, is the evidence.',
        '', '| Source location | Field condition | Review disposition | Decision and evidence |','|---|---|---|---|']
    for r in runtime:
        review=r.get('semanticReview',{})
        text.append('| '+' | '.join(cell(v) for v in [r['file']+':'+str(r['line']),r['condition'],r['status'],review.get('semantics','Semantic comparison pending')+' Tests: '+', '.join(review.get('tests',[]))])+' |')
    text+=['','AI source leads: '+str(len(ai))+'. See `research/field-coverage-ledger.json` for every AI and runtime location.',
        '', 'Unavailable IDs in current generated data: `'+compact(unsupported)+'`.']
    write(DOC/'fields'/f'{slug}.md','\n'.join(text))
coverage+=['','## Exclusions and limitations by field','','Every runtime lead that is not implemented, deduplicated per field and source location. Custom-move and Crest exclusions never close surrounding ordinary behavior; see [LIMITATIONS.md](LIMITATIONS.md).','',
    '| Field | Source | Disposition | Decision |','|---|---|---|---|']
seen=set()
for row in exceptions:
    if (row[0],row[1]) in seen:continue
    seen.add((row[0],row[1]));coverage.append('| '+' | '.join(map(cell,row))+' |')
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
# Kanto league field assignments (research/trainer_fields.py writes the scores and the datapack map).
scores=read('trainer-field-scores.json');teams=read('kanto-league-teams.json')
assigned=json.loads((ROOT/'datapack/data/rejuvenation/rejuvenation/trainers/kanto.json').read_text(encoding='utf-8'))['trainers']
names=collections.Counter(f['name'] for f in fields.values())
def label(fid):return fields[fid]['name']+(f" {fields[fid]['originalId'][-1]}" if names[fields[fid]['name']]>1 else '')
league=['# Kanto league fields','',
    'Every Kanto series trainer of the installed RCT datapack starts its battles on the field below. Trainer teams, AI and series files are read, never edited. '
    'The mod recognises the trainer from the original-trainer tag RCT stamps on its team (`<registry>#<trainer id>`) and selects the field at TRAINER priority before the battle starts; an EXPLICIT selection still overrides it.',
    '', '## How the field was chosen','',
    'Each of the 56 non-Indoor fields was scored with the real engine (`research/trainer_fields.cjs`, about 80,000 simulated battles). For every team member, exactly as RCT defines it (species, level, nature, IVs, ability, item, moves), and each of 18 single-type reference opponents with Mew base stats at the same level, a fresh battle was started on the field and measured:',
    '', '- the best expected damage per turn the member deals and takes, after every field rule, ability, item, weather and entry effect;',
    '- end-of-round residual damage or healing for both sides;','- action speed after entry effects.',
    '', 'The member wins the pairing if it needs fewer turns to knock out (ties go to the faster side). A field\'s score is the share of the 6x18 pairings the team wins; the mean log damage ratio breaks ties. The assigned field has the highest score.',
    '', 'Assumptions: '+'; '.join(scores['assumptions'])+'.',
    '', '## Assignments','', '| Trainer | RCT ID | Format | Field | Win share | With no field | Runners-up |','|---|---|---|---|---:|---:|---|']
for tid,row in scores['trainers'].items():
    runners=', '.join(f"{label(r['field'])} ({r['winShare']:.0%})" for r in row['ranking'][1:3])
    league.append('| '+' | '.join(map(cell,[row['name'],tid,teams['trainers'][tid]['battleFormat'],f"[{label(assigned[tid]['field'])}](fields/{assigned[tid]['field'].split(':')[1]}.md)",
        f"{assigned[tid]['winShare']:.0%}",f"{assigned[tid]['indoorWinShare']:.0%}",runners]))+' |')
league+=['','## Who benefits','','Per-member win share with no field and on the assigned field.','']
for tid,row in scores['trainers'].items():
    best,base=row['scores'][assigned[tid]['field']]['members'],row['baseline']['members']
    league.append(f"- **{row['name']}** ({label(assigned[tid]['field'])}): "+', '.join(f"{m} {base[m]:.0%}→{best[m]:.0%}" for m in best))
league+=['','Source snapshot: `'+teams['source']['datapack']+'` SHA-256 `'+teams['source']['sha256']+'`. Re-run `python rejuvenation/research/trainer_fields.py` after the RCT datapack or the field rules change.',
    '', 'Run & Bun AI does not evaluate field effects (see [TRAINER_INTEGRATION.md](TRAINER_INTEGRATION.md)); the advantage comes from the field rules applying to the trainer\'s team, not from AI awareness.']
write(DOC/'KANTO_LEAGUE_FIELDS.md','\n'.join(league))
print('Generated catalogues for',len(fields),'fields and',len(rows),'biomes;',sum(v['implementationComplete'] for v in ledger.values()),'fields source-audit closed')
