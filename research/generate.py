"""Convert reviewed field-definition semantics into declarative simulator data.

Ruby fragments are recognized individually and translated to a closed condition
algebra. No Ruby/JS from a datapack is evaluated. Unknown fragments stop generation.
"""
from pathlib import Path
import json, re, zipfile
ROOT=Path(__file__).resolve().parents[2]; OUT=ROOT/'rejuvenation'
SPEC=json.loads((OUT/'research/field-specification.json').read_text(encoding='utf-8'))
def write(p,x):
    p.parent.mkdir(parents=True,exist_ok=True); p.write_text(json.dumps(x,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
NAMES={'ELECTERRAIN':'electric_terrain','GRASSY':'grassy_terrain','MISTY':'misty_terrain','PSYTERRAIN':'psychic_terrain',
 'DARKCRYSTALCAVERN':'dark_crystal_cavern','CRYSTALCAVERN':'crystal_cavern','CHESS':'chess_board','BIGTOP':'big_top',
 'CORROSIVEMIST':'corrosive_mist','VOLCANICTOP':'volcanic_top','SHORTCIRCUIT':'short_circuit','ASHENBEACH':'beach',
 'WATERSURFACE':'water_surface','MURKWATERSURFACE':'murkwater_surface','SNOWYMOUNTAIN':'snowy_mountain',
 'DEEPEARTH':'deep_earth','DRAGONSDEN':'dragons_den','NEWWORLD':'new_world','FROZENDIMENSION':'frozen_dimension',
 'BACKALLEY':'back_alley','DEUXFINALIS':'deux_finalis'}
NAMES.update({'DEEPDARK':'deep_dark','PALEGARDEN':'pale_garden','WARPEDFOREST':'warped_forest','CRIMSONFOREST':'crimson_forest'})
NAMES.update({f'FLOWERGARDEN{i}':f'flower_garden_{i}' for i in range(1,6)})
NAMES.update({f'CONCERT{i}':f'concert_{i}' for i in range(1,5)})
def fid(s): return 'rejuvenation:'+NAMES.get(s,s.lower())
def norm(s): return re.sub(r'[^a-z0-9]','',s.lower())
def cond(expr):
    if not expr: return {'always':True}
    expr=expr.strip()
    # Remove enclosing parentheses only if they wrap the entire expression.
    if expr.startswith('('):
        depth=0; end=None
        for i,ch in enumerate(expr):
            depth+=ch=='('; depth-=ch==')'
            if depth==0: end=i; break
        if end==len(expr)-1: return cond(expr[1:-1])
    for op,key in [('||','any'),('&&','all')]:
        depth=0
        for i,ch in enumerate(expr):
            if ch in '([': depth+=1
            if ch in ')]': depth-=1
            if depth==0 and expr[i:i+2]==op: return {key:[cond(expr[:i]),cond(expr[i+2:])]}
    if expr.startswith('!') and not expr.startswith('!='): return {'not':cond(expr[1:])}
    if re.fullmatch(r'(attacker|opponent)\.isAirborne\?(?:\(.*\))?',expr):
        return {'grounded':{'who':'user' if expr.startswith('attacker') else 'target','value':False}}
    if expr.startswith('self.pbIsSpecial?'): return {'category':'Special'}
    if expr.startswith('self.pbIsPhysical?'): return {'category':'Physical'}
    if expr=='attacker.makesContact?(self)': return {'flag':'contact'}
    if expr=='attacker.missAcc': return {'missed':True}
    m=re.fullmatch(r'@battle\.field\.counter(\d*)\s*(>|>=|==)\s*(\d+)',expr)
    if m: return {'counter':{'index':int(m[1] or 1),'op':m[2],'value':int(m[3])}}
    m=re.fullmatch(r'(?:self|basemove)\.move\s*(==|!=)\s*:([A-Z0-9]+)',expr)
    if m: return {'move':norm(m[2])} if m[1]=='==' else {'not':{'move':norm(m[2])}}
    m=re.fullmatch(r'@battle.FE\s*(==|!=)\s*:([A-Z0-9]+)',expr)
    if m: return {'field':fid(m[2])} if m[1]=='==' else {'not':{'field':fid(m[2])}}
    m=re.fullmatch(r'opponent.hasType\?\(:([A-Z]+)\)',expr)
    if m: return {'type':{'who':'target','value':m[1].title()}}
    if expr=='opponent.hp <= (opponent.totalhp / 2.0).floor': return {'hp':{'who':'target','op':'<=','fraction':0.5}}
    m=re.fullmatch(r'opponent\.(species|form)\s*==\s*:?(\w+)',expr)
    if m: return {m[1]:{'who':'target','value':norm(m[2]) if m[1]=='species' else int(m[2])}}
    m=re.fullmatch(r'\[([\s:A-Z0-9,]+)\]\.include\?\((self.move|@battle.field.backup)\)',expr)
    if m:
        syms=re.findall(r':([A-Z0-9]+)',m[1]); return {'any':[{'move':norm(s)} if m[2]=='self.move' else {'backup':fid(s)} for s in syms]}
    raise ValueError('Unreviewed Ruby condition: '+expr)
OPERATORS={'@battle.iceSpikes':'ice_spikes','@battle.fieldAccuracyDrop':'accuracy_cloud',
 '@battle.eruptionChecker':'arm_eruption','@battle.caveCollapse(basemove, user)':'cave_collapse',
 '@battle.mistExplosion(basemove, user)':'mist_explosion','@battle.waterPollution':'water_pollution'}
def invert(pairs):
    return {norm(x):k for k,values in pairs for x in values}
def contents(sym,pairs):
    d=dict(pairs); moves={}
    for name,key in [('damageMods','multiplier'),('accuracyMods','accuracy'),('typeMods','additionalType'),('moveMessages','message')]:
        for move,v in invert(d.get(name,[])).items(): moves.setdefault(move,{})[key]=v
    for code,ids in d.get('moveEffects',[]):
        for move in ids: moves.setdefault(norm(move),{}).setdefault('after',[]).append({'op':OPERATORS[code]})
    for counter,ids in d.get('fieldCounterIncreases',[]):
        for move in ids: moves.setdefault(norm(move),{})['counter']={'index':counter[0],'amount':counter[1],'maximum':counter[2],'message':counter[3]}
    changes=dict(d.get('changeCondition',[])); texts=invert(d.get('changeMessage',[])); effects=invert(d.get('changeEffects',[]))
    for target,ids in d.get('fieldChange',[]):
        for move in ids:
            mid=norm(move); transition={'field':fid(target),'condition':cond(changes.get(target)),
                'push':move in d.get('dontChangeBackup',[]),'message':texts.get(mid)}
            if mid in effects: transition['after']=[{'op':OPERATORS[effects[mid]]}]
            moves.setdefault(mid,{})['transition']=transition
    types=[]; conditions=dict(d.get('typeCondition',[])); texts=invert(d.get('typeMessages',[])); adds=invert(d.get('typeAddOns',[]))
    keys=list(dict.fromkeys([x for a,xs in d.get('typeBoosts',[]) for x in xs]+[x for a,xs in d.get('typeAddOns',[]) for x in xs]+[k for k,v in d.get('typeEffects',[])]))
    boosts={x:a for a,xs in d.get('typeBoosts',[]) for x in xs}; effects=dict(d.get('typeEffects',[]))
    for key in keys:
        rule={'match':{'flag':{'soundmove':'sound','sharpmove':'slicing','windmove':'wind'}[key]} if key in ['soundmove','sharpmove','windmove'] else {'moveType':key.title()},
            'condition':cond(conditions.get(key))}
        if key in boosts: rule['multiplier']=boosts[key]
        if norm(key) in texts: rule['message']=texts[norm(key)]
        if norm(key) in adds: rule['additionalType']=adds[norm(key)]
        if key in effects: rule['after']=[{'op':OPERATORS[effects[key]]}]
        types.append(rule)
    return {'moves':moves,'types':types}
fields={}
for sym,pairs in SPEC.items():
    d=dict(pairs); field={'schemaVersion':1,'id':fid(sym),'originalId':sym,'name':d['name'] or 'No Field','entryMessage':d['fieldMessage'],
        'naturePower':norm(d['naturePower']),'secretPower':norm(d['secretPower']),'mimicry':d['mimicry'].title() if d['mimicry'] else None,
        'burmyCloak':d.get('burmyCloak'),'statusBuffs':[norm(m) for m in d.get('statusBuffs',[])],
        'statusNerfs':[norm(m) for m in d.get('statusNerfs',[])],**contents(sym,pairs),'rules':[]}
    if d.get('overlay') and sym!='INDOOR': field['overlay']=contents(sym,d['overlay'])
    seed=dict(d.get('seed',[])); stats=['hp','atk','def','spa','spd','spe','accuracy','evasion']
    if seed.get('seedtype'):
        field['seed']={'item':norm(seed['seedtype']),'effect':norm(seed['effect']) if seed.get('effect') else None,
            'duration':seed.get('duration'),'message':seed.get('message'),'stats':{stats[int(k)]:v for k,v in seed['stats']}}
    if sym.startswith('FLOWERGARDEN'): field['progression']={'group':'flower_garden','stage':int(sym[-1]),'maximum':5,'statChangeShrinkMessage':'The garden was cut down!'}
    if sym.startswith('CONCERT'): field['progression']={'group':'concert','stage':int(sym[-1]),'maximum':4,'statChangeShrinkMessage':'The crowd is booing!'}
    fields[sym]=field
def rule(syms,event,when,actions,source):
    for sym in syms.split(): fields[sym]['rules'].append({'event':event,'condition':when,'actions':actions,'source':source})
def ability(names,who='user'): return {'ability':{'who':who,'values':[norm(x) for x in names.split()]}}
def grounded(who='user'): return {'grounded':{'who':who,'value':True}}
def both(*cs): return {'all':list(cs)}
def action(op,**values): return {'op':op,**values}
def boost(syms,abil,stats,line,message=None,flavor=None):
    acts=[action('boost',stats=stats,message=message,messagePlacement='before')] if message else [action('boost',stats=stats,flavor=flavor)] if flavor else [action('boost',stats=stats)]
    rule(syms,'switchIn',ability(abil),acts,'Battler.rb:'+str(line))
boost('ELECTERRAIN','LIGHTNINGROD ELECTROMORPHOSIS',{'spa':1},2035)
boost('CHESS','STALL STANCECHANGE',{'def':1},2051)
boost('SWAMP HAUNTED DIMENSIONAL FROZENDIMENSION DEUXFINALIS','RATTLED',{'spe':1},2068)
boost('FACTORY','LIGHTMETAL',{'spe':1},2077,"{1}'s light body makes it nimble!")
boost('FACTORY','HEAVYMETAL',{'def':1,'spe':-1},2086,"{1}'s heavy body is sturdy and unmoving!")
boost('VOLCANIC','MAGMAARMOR',{'def':1},2096)
# getFieldAbilityFlavorString (Battle_Effects.rb:861-888) names the cause in place of the ordinary stat line.
boost('FAIRYTALE','ARMORTAIL BATTLEARMOR SHELLARMOR',{'def':1},2140,flavor='shining armor')
boost('FAIRYTALE','STANCECHANGE',{'def':1},2140,flavor='royal shield')
boost('FAIRYTALE','MAGICGUARD MAGICBOUNCE PASTELVEIL',{'spd':1},2149,flavor='magical power')
boost('FAIRYTALE','MIRRORARMOR',{'spd':1},2149,flavor='reflective armor')
boost('FAIRYTALE','POWEROFALCHEMY',{'def':1,'spd':1},2157,flavor='magical power')
boost('FAIRYTALE','MAGICIAN',{'spa':1},2165,flavor='magical power')
boost('DRAGONSDEN','MAGMAARMOR',{'def':1,'spd':1},2172)
boost('DRAGONSDEN','SHELLARMOR',{'def':1},2181)
boost('STARLIGHT','ILLUMINATE',{'spa':2},2197,'{1} flared up with starlight!')
boost('PSYTERRAIN','ANTICIPATION FOREWARN',{'spa':2},2215)
boost('PSYTERRAIN','MINDSEYE',{'spa':1},2225)
boost('MISTY CORROSIVEMIST','WATERCOMPACTION',{'def':2},2231)
boost('CRYSTALCAVERN','TERAFORMZERO',{'spa':1},2242)
boost('DIMENSIONAL FROZENDIMENSION','BERSERK',{'spa':1},2265,flavor='anger')
boost('DIMENSIONAL FROZENDIMENSION','ANGERSHELL',{'atk':1,'spa':1,'spe':1,'def':-1,'spd':-1},2273)
boost('DIMENSIONAL FROZENDIMENSION','JUSTIFIED ANGERPOINT',{'atk':1},2282,flavor='anger')
boost('SKY','BIGPECKS',{'def':1},2335)
for f in range(1,5): rule(f'FLOWERGARDEN{f}','switchIn',ability('FLOWERGIFT FLOWERVEIL DROUGHT DRIZZLE ORICHALCUMPULSE GRASSYSURGE'),[action('progress',amount=1,message='{1} grew the garden!')],'Battler.rb:2189')
rule('FROZENDIMENSION','switchIn',both(ability('HUNGERSWITCH'),{'species':{'who':'user','value':'morpeko'}}),[action('form',species='morpekohangry',message='{1} transformed!')],'Battler.rb:2304')
# Reviewed end-turn ability interactions, separate from ordinary weather effects.
rule('ICY SNOWYMOUNTAIN FROZENDIMENSION','residual',ability('ICEBODY'),[action('heal',fraction=1/16,message='{1} was healed a little by the ice!')],'Battle.rb:6014')
rule('FOREST','residual',ability('SAPSIPPER'),[action('heal',fraction=1/16,message='{1} drank tree sap to recover!')],'Battle.rb:6025')
rule('WATERSURFACE','residual',both(ability('WATERABSORB DRYSKIN'),grounded()),[action('heal',fraction=1/16,message='{1} absorbed some of the water!')],'Battle.rb:6090')
rule('UNDERWATER','residual',ability('WATERABSORB DRYSKIN'),[action('heal',fraction=1/16,message='{1} absorbed some of the water!')],'Battle.rb:6090')
rule('SWAMP WATERSURFACE MURKWATERSURFACE','residual',both(ability('WATERCOMPACTION'),grounded()),[action('boost',stats={'def':2})],'Battle.rb:6165')
rule('UNDERWATER','residual',ability('WATERCOMPACTION'),[action('boost',stats={'def':2})],'Battle.rb:6165')
rule('MURKWATERSURFACE','residual',both(ability('DRYSKIN WATERABSORB'),grounded(),{'type':{'who':'user','value':'Poison'}}),[action('heal',fraction=1/8,message='{1} is healed by the poisoned water!')],'Battle.rb:6125')
rule('BACKALLEY','tryHeal',{'always':True},[action('multiply',value=0.67)],'Battler.rb:1293')
rule('FAIRYTALE','perfectAccuracy',ability('FAIRYAURA'),[action('set',value=True)],'Battle_Move.rb:876')
rule('DEUXFINALIS','perfectAccuracy',ability('DARKAURA'),[action('set',value=True)],'Battle_Move.rb:876')
rule('UNDERWATER','baseAccuracy',both({'moveType':'Electric'},{'oneHitKO':False}),[action('set',value=True)],'Battle_Move.rb:884')
rule('RAINBOW','baseAccuracy',both({'effectiveAbility':{'who':'target','values':['wonderskin']}},{'category':'Status'}),[action('set',value=0)],'Battle_Move.rb:895')
rule('PSYTERRAIN','baseAccuracy',both({'effectiveAbility':{'who':'target','values':['magician']}},{'category':'Status'}),[action('cap',value=50)],'Battle_Move.rb:894')
rule('ROCKY','accuracy',ability('LONGREACH'),[action('multiply',value=0.9)],'Battle_Move.rb:918')
for syms,abil in [('MOUNTAIN SNOWYMOUNTAIN VOLCANICTOP SKY','LONGREACH'),('CORROSIVE CORROSIVEMIST CORRUPTED','CORROSION'),('HOLY','PURIFYINGSALT'),('FAIRYTALE CHESS','QUEENLYMAJESTY')]:
    for event in ['attack','specialAttack']:rule(syms,event,ability(abil),[action('multiply',value=1.5)],'Battle_Move.rb:1615-1619')
for event in ['attack','specialAttack']:rule('CHESS',event,ability('GORILLATACTICS RECKLESS'),[action('multiply',value=1.2)],'Battle_Move.rb:1601-1603')
rule('DEEPEARTH','activate',{'always':True},[action('pseudoWeather',id='gravity',permanent=True)],'Battle_Field.rb:419')
rule('GLITCH','modifyMove',{'not':{'category':'Status'}},[action('oldCategory')],'Battle_Move.rb:278')
rule('INVERSE','effectiveness',{'always':True},[action('inverse')],'Battle_Typemod.rb:73')
rule('GRASSY','residual',grounded(),[action('heal',fraction=1/16)],'Battle.rb:field grassy recovery')
rule('ELECTERRAIN','setStatus',both(grounded('target'),{'status':'slp'}),[action('reject')],'Battler.rb:electric sleep immunity')
rule('MISTY','setStatus',grounded('target'),[action('reject')],'Battler.rb:mist status immunity')
rule('PSYTERRAIN','tryHit',both(grounded('target'),{'priority':{'op':'>','value':0}},{'foe':True}),[action('reject')],'Battle_Move.rb:psychic priority immunity')
rule('GRASSY','priority',{'move':'grassyglide'},[action('add',value=1)],'Battle_Move.rb:2302')
rule('DIMENSIONAL FROZENDIMENSION','priority',{'move':'quash'},[action('add',value=1)],'Battle_Move.rb:2303')
rule('DEEPEARTH','priority',{'move':'coreenforcer'},[action('add',value=-1)],'Battle_Move.rb:2309')
for syms,moves,newtype in [('ASHENBEACH','STRENGTH','Fighting'),('WATERSURFACE','SHOREUP','Water'),
 ('MURKWATERSURFACE','MUDSLAP MUDBOMB MUDBARRAGE MUDSHOT THOUSANDWAVES SHOREUP','Water'),
 ('FAIRYTALE','SACREDSWORD CUT SLASH SECRETSWORD','Steel'),('DIMENSIONAL FROZENDIMENSION','RAGE','Dark'),
 ('DRAGONSDEN','ROCKCLIMB STRENGTH','Rock'),('DEEPEARTH','TOPSYTURVY','Ground')]:
    rule(syms,'modifyMove',{'any':[{'move':norm(m)} for m in moves.split()]},[action('moveType',type=newtype)],'Battle_Move.rb:257')
# Serene Grace and the rainbow double once together for flinching moves and twice for the rest (2328-2329).
rainbow_chance={'not':both(ability('SERENEGRACE'),{'canFlinch':True})}
rule('RAINBOW','modifyMove',rainbow_chance,[action('secondaryChance',multiplier=2)],'Battle_Move.rb:2328-2329')
for other in [s for s in fields if s!='RAINBOW']:rule(other,'modifyMove',both({'overlay':fields['RAINBOW']['id']},rainbow_chance),[action('secondaryChance',multiplier=2)],'Battle_Move.rb:2328-2329')
rule('HAUNTED','modifyMove',{'move':'ominouswind'},[action('secondaryChance',chance=20)],'Battle_Move.rb:2330')
for sym,move in [('FAIRYTALE','strangesteam'),('HAUNTED','lick'),('WASTELAND','direclaw'),('INFERNAL','infernalparade'),('DEUXFINALIS','freezingglare')]:
    rule(sym,'modifyMove',{'move':move},[action('secondaryChance',chance=100)],'Battle_Move.rb:2336')
rule('ELECTERRAIN','switchIn',{'item':{'who':'user','values':['cellbattery']}},[action('consume')],'Battler.rb:4320; native Cell Battery use event supplies +1 Attack')
rule('DEEPEARTH','switchIn',{'item':{'who':'user','values':['ironball']}},[action('boost',stats={'spe':-2})],'Battler.rb:4361')
rule('DEEPEARTH','switchIn',{'item':{'who':'user','values':['magnet']}},[action('boost',stats={'spe':-1,'spa':1}),action('message',text="{1}'s Magnet is affected by the magnetic field!")],'Battler.rb:4370')
for sym in ['UNDERWATER','INVERSE']: fields[sym]['seedActions']=[action('type',type='Water' if sym=='UNDERWATER' else 'Normal')]
fields['GLITCH']['seedActions']=[action('type',type='???')]
fields['DEEPEARTH']['seedActions']=[action('weightDelta',baseMultiplier=1)]
rule('DEEPEARTH','weight',{'always':True},[action('multiply',value=2)],'Battler.rb:472-482')
fields['INVERSE']['seedActions'].append(action('ability',id='normalize'))
fields['SWAMP']['seedActions']=[action('ability',id='clearbody')]
for sym in ['CORROSIVEMIST','MURKWATERSURFACE','CORRUPTED']: fields[sym]['seedActions']=[action('status',status='tox')]
fields['HAUNTED']['seedActions']=[action('status',status='brn')]
fields['PSYTERRAIN']['seedActions']=[action('volatile',id='confusion')]
for sym in ['WASTELAND']: fields[sym]['seedActions']=[action('bothHazards',id='stealthrock',message='Pointed stones float in the air around the battlefield!')]
for sym in ['ROCKY','CAVE']: fields[sym]['seedActions']=[action('typedDamage',type='Rock',fraction=0.25,message='Pointed stones dug into {1}!')]
fields['ICY']['seedActions']=[action('spikeDamage',message='{1} was hurt by the icy spikes!')]
fields['INFERNAL']['seedActions']=[action('volatile',id='trapped')]
fields['DIMENSIONAL']['seedActions']=[action('trickRoom',minimum=3,maximum=8)]
for sym in ['MISTY','RAINBOW','STARLIGHT']: fields[sym]['seedActions']=[action('wish',fraction=0.75,message='A wish was made for {1}!')]
fields['DEUXFINALIS']['seedActions']=[action('perishSong')]
endmessages={'GRASSY':'The grass disappeared from the battlefield.','MISTY':'The mist disappeared from the battlefield.',
 'ELECTERRAIN':'The electricity disappeared from the battlefield.','PSYTERRAIN':'The psychic energy disappeared from the battlefield.',
 'RAINBOW':'The rainbow disappeared.'}
for sym,msg in endmessages.items(): fields[sym]['endMessage']=msg
from extended_rules import extend
from source_path import scripts as source_scripts
source=source_scripts()
extend(fields,rule,ability,grounded,both,action,boost,norm,fid,source)
from party_rules import extend as extend_party
extend_party(fields,rule,action,both,ability)
from type_rules import extend as extend_types
extend_types(fields,rule,action,both,ability)
from remaining_moves import extend as extend_remaining
extend_remaining(fields,rule,action,both,ability,grounded)
from healing_rules import extend as extend_healing
extend_healing(fields,rule,action)
from critical_rules import extend as extend_critical
extend_critical(rule,action,both,ability,grounded)
rule('ASHENBEACH','modifyMove',{'move':'focusenergy'},[action('moveBehavior',recipe='appendHitActions',actions=[action('criticalStage',id='focusenergy',stage=3)])],'Battle_MoveEffects.rb:888')
for typ,stage in [('Dragon',3),(None,2)]:
    cond={'type':{'who':'target','value':'Dragon'}}
    if typ is None:cond={'not':cond}
    rule('DRAGONSDEN DEUXFINALIS','modifyMove',both({'move':'dragoncheer'},cond),[action('moveBehavior',recipe='appendHitActions',actions=[action('criticalStage',id='dragoncheer',stage=stage,who='target')])],'Battle_MoveEffects.rb:9909-9915')
from environment_rules import extend as extend_environment
extend_environment(fields,rule,action,both,ability)
from pair_rules import extend as extend_pairs
extend_pairs(fields,rule,action,both)
from trapping_rules import extend as extend_trapping
extend_trapping(fields)
from glitch_rules import extend as extend_glitch
extend_glitch(fields,rule,action,both)
from absorption_rules import extend as extend_absorptions
extend_absorptions(fields,rule,action,both,ability)
from timing_rules import extend as extend_timing
extend_timing(fields,rule,action,both)
from context_moves import extend as extend_context_moves
extend_context_moves(fields,rule,action,both)
from move_rules import extend as move_rules
move_rules(rule,action,both,fields)
from status_rules import extend as extend_status
extend_status(fields,rule,action,both)
from distributed_move_rules import extend as extend_distributed_moves
extend_distributed_moves(fields,rule,action,both)
from ability_rules import extend as extend_abilities
extend_abilities(fields,rule,action,both)
from battle_move_rules import extend as extend_battle_move
extend_battle_move(fields,rule,action,both)
from entry_ability_rules import extend as extend_entry_abilities
extend_entry_abilities(fields,rule,action,both)
from battler_move_rules import extend as extend_battler_moves
extend_battler_moves(fields,rule,action,both)
from move_effect_rules import extend as extend_move_effects
extend_move_effects(fields,rule,action,both)
from registered_abilities import extend as extend_declared_abilities
extend_declared_abilities(fields)
from weather_rules import extend as extend_weather
extend_weather(fields)
from move_rules import coverage as status_move_coverage
from battler_source_rules import extend as extend_battler_source
extend_battler_source(fields,rule,action,both)
from battle_rules import extend as extend_battle
extend_battle(fields,rule,action,both)
status_move_coverage(fields)
# Surface removal: the transitions that melt snow or ice (fire moves, and hot water on ice) restore the environment's own
# substrate frame when the battle began on one (engine `removesSurface`, see docs/ENVIRONMENT_LAYERS.md). Without a context
# frame they keep their source destination (Cave, Water Surface, Mountain). Anything else (eruptions, flying, Dive, quakes
# that need water below) is a genuine transformation or has its own backup test and is deliberately not listed.
HEAT=['heatwave','searingshot','flameburst','lavaplume','firepledge','mindblown','incinerate','infernooverdrive','burningjealousy','ragingfury']
SURFACE_REMOVAL={'ICY':{'rejuvenation:cave':HEAT+['eruption','magmadrift'],'rejuvenation:water_surface':['scald','steameruption','hydrosteam','matchagotcha']},
    'SNOWYMOUNTAIN':{'rejuvenation:mountain':HEAT}}
for sym,groups in SURFACE_REMOVAL.items():
    for destination,moves in groups.items():
        for move in moves:
            transition=fields[sym]['moves'][move]['transition']
            assert transition['field']==destination,(sym,move,transition['field'])
            transition['removesSurface']=True
import custom_fields
custom=custom_fields.build(fields)
# The shipped game loads fields.dat unless it is missing (Cache.rb:94). The
# compiler discards message-only move rows. Keep the effective executable rows.
compiled=json.loads((OUT/'research/compiled-field-specification.json').read_text(encoding='utf-8'))
orphans=[]
for sym,f in fields.items():
    for prefix,data in [('',f),('overlay',f.get('overlay'))]:
        if data is None:continue
        allowed={norm(m) for m in compiled[sym][prefix+'movedata' if prefix else 'fieldmovedata']}
        for m in list(data['moves']):
            if m not in allowed:orphans.append({'field':sym,'overlay':bool(prefix),'move':m,'unusedDefinition':data['moves'].pop(m)})
write(OUT/'research/unused-source-definition-rows.json',orphans)
items={norm(s):{'name':s.replace('_',' ').title(),'isNonstandard':'Custom','fling':{'basePower':10}} for s in ['elemental_seed','magical_seed','telluric_seed','synthetic_seed','amulet_coin','amplifield_rock']}
items['everstone']={'name':'Everstone','isNonstandard':'Custom','fling':{'basePower':10},'minecraftItem':'cobblemon:everstone'}
write(OUT/'datapack/data/rejuvenation/rejuvenation/items/seeds.json',{'schemaVersion':1,'items':items})
from registered_abilities import definitions as ability_definitions
write(OUT/'datapack/data/rejuvenation/rejuvenation/abilities/source.json',{'schemaVersion':1,'abilities':ability_definitions()})
assets=OUT/'mod/src/main/resources/assets/rejuvenation'
translations={'item.rejuvenation.'+s:s.replace('_',' ').title() for s in ['elemental_seed','magical_seed','telluric_seed','synthetic_seed','amulet_coin','amplifield_rock']}
translations.update({'status.rejuvenation.petrified.apply':'%s was petrified!',
    'status.rejuvenation.petrified.remove':'%s was released from the stone.',
    'status.rejuvenation.petrified':'Petrified'})
# Cobblemon resolves ability names through its own translation-key convention.
for aid,row in ability_definitions().items():
    for key in dict.fromkeys([aid,norm(row['name'])]):translations.update({'cobblemon.ability.'+key:row['name'],'cobblemon.ability.'+key+'.desc':row['description']})
translations.update({'cobblemon.type.shadow':'Shadow','cobblemon.battle.weather.shadowsky.start':'A shadowy aura filled the sky!','cobblemon.battle.weather.shadowsky.end':'The shadowy aura faded away!','cobblemon.battle.weather.shadowsky.upkeep':'A shadowy aura fills the sky.'})
write(OUT/'mod/src/main/resources/rejuvenation-types.json',fields['INDOOR']['typeDefinitions'])
write(assets/'lang/en_us.json',translations)
for s in ['elemental_seed','magical_seed','telluric_seed','synthetic_seed','amulet_coin','amplifield_rock']:
    write(assets/f'models/item/{s}.json',{'parent':'minecraft:item/generated','textures':{'layer0':'minecraft:item/gold_nugget' if s=='amulet_coin' else 'minecraft:item/cobblestone' if s=='amplifield_rock' else 'minecraft:item/wheat_seeds'}})
for sym,field in [*fields.items(),*custom.items()]: write(OUT/f'datapack/data/rejuvenation/rejuvenation/fields/{field["id"].split(":")[1]}.json',field)
# Player-facing Field Notes for all 61 fields (data/<ns>/rejuvenation/notes); the custom fields' notes come from their canonical inputs.
import field_notes
notes_written,notes_skipped=field_notes.build({**{f['id']:f for f in fields.values()},**{f['id']:f for f in custom.values()}},custom_fields.load_inputs())
print('Wrote',len(notes_written),'field notes;',notes_skipped,'rule shapes left out of the prose rather than approximated')
write(OUT/'datapack/pack.mcmeta',{'pack':{'pack_format':48,'description':'Rejuvenation v14 field definitions for Cobblemon 1.7.3'}})
write(OUT/'research/field-id-map.json',{sym:fid(sym) for sym in fields})
# Mapping based on actual biome IDs; all choices explicit and reproducible.
biomes=json.loads((OUT/'research/biome-inventory.json').read_text(encoding='utf-8'))
# The four custom fields own their biomes (research/custom-fields/*.json); the other Minecraft-inspired allocations stay as before.
custom_biome_rows,custom_structures=custom_fields.mapping_rows()
custom_sym={f['id']:sym for sym,f in custom.items()}
custom_biomes={b:(custom_sym[field],reason) for b,field,reason in custom_biome_rows}
# Environment layers (docs/ENVIRONMENT_LAYERS.md). A layer is the substrate beneath a snow or ice surface, taken from the
# biome's own allocation, so melting or breaking the surface exposes the right ground instead of the source's generic Cave.
# Icy and Snowy Mountain are the only surface fields with a melt transition, so they are the only fields that get layers.
# Frozen water is Icy over Water Surface (the ocean and river rows used to select Water Surface directly).
LAYER_OVERRIDES={'minecraft:frozen_ocean':('ICY','Ice sheet over open ocean water'),'minecraft:deep_frozen_ocean':('ICY','Ice sheet over deep ocean water'),
 'minecraft:frozen_river':('ICY','Ice over river water')}
SUBSTRATE={
 'minecraft:frozen_ocean':('WATERSURFACE','Open ocean water under the ice'),'minecraft:deep_frozen_ocean':('WATERSURFACE','Deep ocean water under the ice'),
 'minecraft:frozen_river':('WATERSURFACE','River water under the ice'),
 'minecraft:snowy_plains':('GRASSY','Plains grass under the snow (the existing Plains allocation)'),
 'minecraft:snowy_beach':('ASHENBEACH','Beach sand under the snow (the existing Beach allocation)'),
 'minecraft:snowy_taiga':('FOREST','Taiga forest floor under the snow (the existing Taiga allocation)'),
 'minecraft:frozen_peaks':('MOUNTAIN','Bare mountain rock under the snow'),'minecraft:snowy_slopes':('MOUNTAIN','Bare mountain rock under the snow'),
 'terralith:alpha_islands_winter':('GRASSY','Island grass under the snow (the existing Island allocation)'),
 'terralith:cold_shrubland':('GRASSY','Shrubland under the snow (the existing Shrubland allocation)'),
 'terralith:ice_marsh':('SWAMP','Marsh ground under the ice (the existing Swamp allocation)'),
 'terralith:snowy_badlands':('DESERT','Mesa sand under the snow (the existing Badlands allocation)'),
 'terralith:snowy_cherry_grove':('FOREST','Grove floor under the snow (the existing Grove allocation)'),
 'terralith:snowy_maple_forest':('FOREST','Forest floor under the snow (the existing Forest allocation)'),
 'terralith:snowy_shield':('FOREST','Shield forest floor under the snow (the existing Shield allocation)'),
 'terralith:wintry_forest':('FOREST','Forest floor under the snow (the existing Forest allocation)'),
 'terralith:wintry_lowlands':('GRASSY','Lowland grass under the snow (the existing Lowlands allocation)'),
 'terralith:frozen_cliffs':('MOUNTAIN','Bare cliff rock under the snow'),'terralith:glacial_chasm':('MOUNTAIN','Bare chasm rock under the ice and snow')}
# Frozen biomes with no layer, each intentional.
UNLAYERED={'minecraft:ice_spikes':'Snow blocks and packed ice run all the way down, so melting exposes no distinct ground: Icy keeps the source transition.',
 'terralith:cave/frostfire_caves':'Frozen Dimension is a combined anomaly, not an ice surface; its own Purify transition returns to Icy.'}
UNDERGROUND_SUBSTRATE=('CAVE','Cave rock under a frozen underground')
def select(b):
    p=b.split(':')[1]
    if b in LAYER_OVERRIDES: return LAYER_OVERRIDES[b]
    overrides={'legendarymonuments:distortion_world_biome':('DIMENSIONAL','Distorted extradimensional environment'),
     'lumymon:nightmare_void':('HAUNTED','Nightmare dimension'),'lumymon:origin_sky':('SKY','Open sky dimension'),
     'cobblemonraiddens:raid_den':('CAVE','Underground raid den'), 
     'minecraft:sulfur_caves':('CORROSIVEMIST','Sulfurous cave gases'),
     'terralith:warped_mesa':('DIMENSIONAL','Warped fantasy mesa'),'terralith:cave/frostfire_caves':('FROZENDIMENSION','Combined anomalous fire and ice'),
     'terralith:cave/mantle_caves':('DEEPEARTH','Deep mantle'),'terralith:cave/deep_caves':('DEEPEARTH','Deep underground'),
     'terralith:cave/infested_caves':('CORRUPTED','Infested cave'),'terralith:cave/fungal_caves':('CORROSIVE','Fungal cave'),
     'terralith:moonlight_grove':('BEWITCHED','Glowing enchanted woodland'),'terralith:moonlight_valley':('STARLIGHT','Moonlit valley'),
     'terralith:mirage_isles':('RAINBOW','Mirage island atmosphere'),'terralith:cloud_forest':('SKY','Cloud-level woodland'),
     'terralith:yellowstone':('VOLCANIC','Geothermal terrain'),'terralith:caldera':('VOLCANICTOP','Volcanic caldera'),
     # Playtest decision (2026-10-05): every ordinary plains biome is Grassy Terrain; the flower pattern below must not claim sunflower plains.
     'minecraft:sunflower_plains':('GRASSY','Plains biome variant')}
    if b in custom_biomes: return custom_biomes[b]
    if b in overrides: return overrides[b]
    for pattern,sym,reason in [
      ('skylands','SKY','Floating sky islands'),('amethyst','CRYSTALCAVERN','Amethyst crystal environment'),
      ('volcanic_(peaks|crater)','VOLCANICTOP','Volcano summit/crater'),('thermal|basalt_deltas|nether_wastes','VOLCANIC','Hot volcanic environment'),
      ('soul_sand','INFERNAL','Tormented soul environment'),
      ('the_end|end_|the_void','NEWWORLD','Fragmented void-world'),('ice_marsh','ICY','Frozen marsh'),
      ('swamp','SWAMP','Wet swamp'),('ocean|river','WATERSURFACE','Open surface water'),
      ('snow.*(peak|mountain|slope)|frozen_(peak|cliff)|glacial_chasm','SNOWYMOUNTAIN','Snow-covered mountain'),
      ('snow|frozen|ice|wintry|winter|cold_shrub','ICY','Ice/snow environment'),
      ('cave|underground','CAVE','Subterranean environment'),('beach|shore','ASHENBEACH','Coastal sand/rock'),
      ('flower|bloom|orchid|lavender_valley','FLOWERGARDEN2','Flower-rich vegetation'),
      ('mushroom','FAIRYTALE','Mushroom biome'),('forest|taiga|grove|jungle|wooded|shield$','FOREST','Dense woodland'),
      ('desert|sands|badlands|mesa|arid|oasis','DESERT','Arid sand/mesa terrain'),
      ('mountain|peak|highland|cliff|spire|windswept|plateau','MOUNTAIN','Elevated mountain terrain'),
      ('rocky|gravel|stone|canyon','ROCKY','Exposed rock'),
      ('plain|savanna|meadow|valley|brush|shrub|clearing|lowland|steppe|island','GRASSY','Open vegetated land')]:
        if re.search(pattern,p): return sym,reason
    raise ValueError('Biome needs intentional review: '+b)
rows=[]
# Submerged rows form the underwater stage, which the resolver checks before structures and biomes in every dimension.
rules=[{'submerged':True,'field':fid('UNDERWATER'),'reason':'Battle submerged in water'}]
for b,entries in sorted(biomes.items()):
    sym,reason=select(b); source='; '.join(sorted(set(e['source'] for e in entries)))
    substrate=SUBSTRATE.get(b)
    if sym in ('ICY','SNOWYMOUNTAIN') and not substrate and b not in UNLAYERED: raise ValueError('Frozen biome needs an intentional layer or an explicit exemption: '+b)
    if substrate and sym not in ('ICY','SNOWYMOUNTAIN'): raise ValueError('Only Icy and Snowy Mountain take a layer: '+b)
    rows.append({'biome':b,'source':source,'field':fid(sym),'reason':reason,'mechanism':'explicit',
        **({'substrate':fid(substrate[0]),'layerReason':substrate[1]} if substrate else {}),**({'layerExemption':UNLAYERED[b]} if b in UNLAYERED else {})})
    if substrate and not b.endswith(('ocean','river')):
        rules.append({'biome':b,'dimension':'minecraft:overworld','minDepth':12,'skyVisible':False,'field':fid(sym),'substrate':fid(UNDERGROUND_SUBSTRATE[0]),
            'reason':'Frozen underground: '+UNDERGROUND_SUBSTRATE[1]})
    if sym in ['GRASSY','FOREST','FLOWERGARDEN2','DESERT','MOUNTAIN','ROCKY','ASHENBEACH','FAIRYTALE']:
        rules.append({'biome':b,'dimension':'minecraft:overworld','minDepth':12,'skyVisible':False,'field':fid('CAVE'),'reason':'Battle at least 12 blocks below solid surface in a surface biome'})
    rules.append({'biome':b,'field':fid(sym),'reason':reason,**({'substrate':fid(substrate[0])} if substrate else {})})
for tag,sym in [('minecraft:is_forest','FOREST'),('minecraft:is_jungle','FOREST'),('minecraft:is_taiga','FOREST'),
 ('minecraft:is_ocean','WATERSURFACE'),('minecraft:is_river','WATERSURFACE'),('minecraft:is_mountain','MOUNTAIN'),
 ('minecraft:is_beach','ASHENBEACH'),('minecraft:is_badlands','DESERT'),('c:is_snowy','ICY'),('c:is_swamp','SWAMP'),('c:is_cave','CAVE')]:
    rules.append({'tag':tag,'field':fid(sym),'reason':'Future biome tag compatibility'})
rules.extend([{'dimension':d,'field':fid(f),'reason':'Dimension fallback'} for d,f in [('minecraft:the_nether','VOLCANIC'),('minecraft:the_end','NEWWORLD'),('lumymon:nightmare','HAUNTED'),('lumymon:origin','SKY'),('cobblemonraiddens:raid_dimension','CAVE'),('legendarymonuments:distortion_world','DIMENSIONAL')]])
rules.append({'maxY':0,'skyVisible':False,'field':fid('DEEPEARTH'),'reason':'Unknown deep underground biome'})
write(OUT/'datapack/data/rejuvenation/rejuvenation/mappings/modpack.json',{'schemaVersion':1,'rules':rules})
write(OUT/'research/biome-mapping.json',rows)
# Generated structures override biome rules only when configured; any other structure falls through to the biome.
# Tags cover the vanilla variants and the equivalent Repurposed Structures ones (which join #minecraft:village).
# Containment (docs/FIELD_SELECTION.md): a generated village is scattered building and street pieces with open ground between them,
# and players and wild Pokemon stand on that ground, so villages use a bounded footprint around their real pieces (8 blocks
# horizontally, 12 above the roofs, 4 below the floors: streets, plazas and yards count; caves below and open sky above do not).
# Every other structure keeps exact piece containment.
VILLAGE={'mode':'footprint','horizontal':8,'above':12,'below':4}
structures=[
    {'structure':'minecraft:mansion','field':fid('BACKALLEY'),'reason':'Woodland Mansion'},
    {'tag':'repurposed_structures:collections/mansions','field':fid('BACKALLEY'),'reason':'Woodland Mansion variant'},
    *[{'structure':'minecraft:village_'+v,'field':fid('CITY'),'reason':'Village','containment':VILLAGE} for v in ['plains','desert','savanna','snowy','taiga']],
    {'tag':'minecraft:village','field':fid('CITY'),'reason':'Village','containment':VILLAGE}]
# Every installed village variant is City, whether or not it joins #minecraft:village: Cobblemon Additions' village structures
# are listed one by one (its #bca:villages tag also contains a swamp witch hut, which is not a village).
structures+=[{'structure':'bca:village/'+v,'field':fid('CITY'),'reason':'Cobblemon Additions village','containment':VILLAGE} for v in
    ['default_small','default_mid','default_large','dark_small','dark_mid','fighting_small','fighting_mid','fighting_large']]
# Bastion Remnants and Nether Fortresses are Colosseum arenas; Repurposed Structures' variants join through its collection tags.
structures+=[{'structure':'minecraft:bastion_remnant','field':fid('COLOSSEUM'),'reason':'Bastion Remnant'},
    {'tag':'repurposed_structures:collections/bastions','field':fid('COLOSSEUM'),'reason':'Bastion variant'},
    {'structure':'minecraft:fortress','field':fid('COLOSSEUM'),'reason':'Nether Fortress'},
    {'tag':'repurposed_structures:collections/fortresses','field':fid('COLOSSEUM'),'reason':'Fortress variant'}]
structures+=custom_structures
# Overlapping structures resolve by class, most specific first, then by listed order: Ancient City, Colosseum arenas, mansions, villages.
structures.sort(key=lambda row:{fid('DEEPDARK'):0,fid('COLOSSEUM'):1,fid('BACKALLEY'):2,fid('CITY'):3}.get(row['field'],9))
write(OUT/'datapack/data/rejuvenation/rejuvenation/structures/vanilla.json',{'schemaVersion':1,'rules':structures})
print('Generated',len(fields),'field definitions;',len(rows),'explicit biome mappings;',sum(len(f['rules']) for f in fields.values()),'additional rules')
