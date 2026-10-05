"""Closed schema/ref validation and compiled Ruby data round-trip comparison."""
from pathlib import Path
import json,math,re,subprocess,sys
ROOT=Path(__file__).resolve().parents[1]
DATA=ROOT/'datapack/data/rejuvenation/rejuvenation'
def strict_pairs(pairs):
    obj={}
    for k,v in pairs:
        if k in obj:raise ValueError('Duplicate JSON key '+k)
        obj[k]=v
    return obj
def read(p):return json.loads(p.read_text(encoding='utf-8'),object_pairs_hook=strict_pairs)
def write(p,d):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(json.dumps(d,indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
subprocess.run(['node',str(ROOT/'research/inspect_registry.cjs')],check=True)
subprocess.run([sys.executable,str(ROOT/'research/addon_registry.py')],check=True)
registry=read(ROOT/'research/simulator-registry.json')
for r in read(ROOT/'research/addon-battle-registry.json'):
    if r['kind'] in registry:registry[r['kind']].append(r['id'])
fields={};errors=[];refs={k:{} for k in ['moves','abilities','items']}
def ensure(ok,where,text):
    if not ok:errors.append(where+': '+text)
def reference(kind,value,where):refs[kind].setdefault(value,[]).append(where)
for p in sorted((DATA/'fields').glob('*.json')):
    f=read(p);ensure(f.get('id')=='rejuvenation:'+p.stem,str(p),'path/ID mismatch');ensure(f['id'] not in fields,str(p),'duplicate ID');fields[f['id']]=f
items={}
for p in (DATA/'items').glob('*.json'):items.update(read(p)['items'])
abilities={}
for p in (DATA/'abilities').glob('*.json'):
    document=read(p);ensure(document.get('schemaVersion')==1,str(p),'invalid ability schema')
    for aid,row in document['abilities'].items():
        ensure(aid not in abilities,str(p),'duplicate ability ID');abilities[aid]=row
events=set('activate fieldResidual residual switchIn pokemonEntry basePower modifyMove afterMove accuracy priority damage attack specialAttack defense specialDefense speed tryHeal setStatus tryHit weatherChange effectiveness receivedDamage tryVolatile criticalRatio weight chargeMove tryMove overlayIn formChange setWeather afterHit pseudoWeatherStart perfectAccuracy baseAccuracy criticalHit tryFlinch flinch snatch afterFaint weatherReconcile criticalMessage modifyMoveLate sideConditionStart fractionalPriority trapPokemon'.split())
actions=set('multiply add set cap reject message boost heal damage status ability type moveType volatile consume form forcedType itemForm randomType randomForm forEach abilityMessage addSecondary stealItem preventStatLoss secondaryChance pseudoWeather progress changeField destroyField oldCategory inverse ice_spikes accuracy_cloud arm_eruption cave_collapse mist_explosion water_pollution hazardBurst restoreTypes trap setHPFraction harvestBerry volatileDuration clearHazards bothHazards sideCondition typedDamage spikeDamage trickRoom wish perishSong removeVolatile cureStatus randomBoost randomStat randomStatus conditional transferStat castling counter setFlag setPokemonFlag bindFieldClock weatherTemporary hpPower cyclePower randomPower extraType residualDamage flashFire concertNoise moveMessage groupMessage clearWeather setWeather clearOverlay moveProperty adjustWish mimicry survive moveBehavior criticalStage weightDelta removeCallbacks pairField createField baseAccuracy clearBoosts identifyItems boostByHighestStat streakPower healByDamage damageShare fieldMove randomWeather reconcileWeather'.split())
conditions=set('always all any not move sourceMove moveType category flag field backup grounded ability item type species form formName status weather weatherFor incomingWeather startedCondition damageSource counter hp priority foe missed volatile value semiInvulnerable globalAbility effectiveness turnsActive stateFlag overlay weatherActive pokemonStatus targetStatus chance samePokemon statsLowered selfInflicted contact hasAlly level transformed wild itemStealable usableMove pokemonActive pokemonFlag statSumComparison sideAbility sideCondition role moveTarget fullHealing faster lastMove attackType foeFainted effectiveAbility pseudoWeather abilityChangedType basePower holderAllied hitEffectiveness allyAbility variableMultihit holderIsUser sideItem holderAbilityState baseMoveType actorType boostStage connected effectId calledBy accuracyMiss damageDealt drainHealed canFlinch baseCanFlinch sheerForce allyCanHeal oneHitKO zMove immunityType volatileSourceMove canHeal'.split())
types=set('Normal Fire Water Electric Grass Ice Fighting Poison Ground Flying Psychic Bug Rock Ghost Dragon Dark Steel Fairy Shadow ???'.split())
stats=set('atk def spa spd spe accuracy evasion'.split());count={'conditions':0,'actions':0,'rules':0,'moves':0,'transitions':0}
def number(v):return isinstance(v,(int,float)) and not isinstance(v,bool) and math.isfinite(v)
def integer(v,minimum,maximum):return isinstance(v,int) and not isinstance(v,bool) and minimum<=v<=maximum
def probability(v,where):ensure(isinstance(v,dict) and integer(v.get('numerator'),0,10000) and integer(v.get('denominator'),1,10000) and v['numerator']<=v['denominator'],where,'invalid probability')
def stat_map(v,where):ensure(isinstance(v,dict) and len(v)>0 and all(k in stats and integer(a,-12,12) and a!=0 for k,a in v.items()),where,'invalid stat map')
def status_pool(a,where):
    ensure(isinstance(a.get('values'),list) and len(a['values'])>0 and all(s in ['brn','frz','par','psn','tox','slp','ptr'] for s in a['values']),where,'invalid status pool')
    if a.get('force'):
        check_condition(a['force'].get('condition'),where);ensure(a['force'].get('status') in a['values'],where,'invalid forced status')
def check_condition(c,where):
    count['conditions']+=1
    if not isinstance(c,dict) or len(c)!=1 or next(iter(c)) not in conditions:ensure(False,where,'malformed condition');return
    k,v=next(iter(c.items()))
    if k in ['all','any']:
        ensure(isinstance(v,list) and len(v)>0,where,'empty or malformed boolean group')
        if isinstance(v,list):
            for a in v:check_condition(a,where)
    elif k=='not':check_condition(v,where)
    elif k=='volatileSourceMove':
        ensure(isinstance(v,dict) and set(v)=={'who','id','move'} and v['who'] in ['user','target'] and re.fullmatch('[a-z0-9]+',v['id']) and re.fullmatch('[a-z0-9]+',v['move']),where,'invalid volatile source move');reference('moves',v['move'],where)
    elif k=='canHeal':ensure(isinstance(v,dict) and set(v)=={'who','value'} and v['who'] in ['user','target'] and isinstance(v['value'],bool),where,'invalid healing predicate')
    elif k=='immunityType':ensure(isinstance(v,list) and len(v)>0 and all(t in ['hail','sandstorm','shadowsky'] for t in v),where,'invalid immunity type')
    elif k=='pseudoWeather':ensure(isinstance(v,dict) and set(v)=={'id','value'} and v.get('id') in ['gravity','mudsport','trickroom','magicroom','wonderroom','iondeluge'] and isinstance(v.get('value'),bool),where,'invalid field condition')
    elif k in ['move','sourceMove']:reference('moves',v,where)
    elif k in ['field','backup','overlay']:ensure(v in fields,where,'invalid field '+str(v))
    elif k in ['effectId','calledBy']:ensure(isinstance(v,str) and re.fullmatch('[a-z0-9]+',v),where,'invalid effect identifier predicate')
    elif k=='boostStage':ensure(isinstance(v,dict) and set(v)=={'who','stat','op','value'} and v['who'] in ['user','target'] and v['stat'] in stats and v['op'] in ['>','>=','<','<=','=='] and integer(v['value'],-6,6),where,'invalid stage predicate')
    elif k=='actorType':ensure(isinstance(v,dict) and v.get('who') in ['user','target'] and isinstance(v.get('values'),list) and len(v['values'])>0 and all(a in ['wild','player','npc'] for a in v['values']),where,'invalid actor type predicate')
    elif k=='holderAbilityState':ensure(v in ['resisted'],where,'invalid ability state predicate')
    elif k in ['ability','effectiveAbility','sideAbility','allyAbility','item','sideItem']:
        ensure(isinstance(v,dict) and v.get('who') in ['user','target'] and isinstance(v.get('values'),list) and len(v['values'])>0,where,'invalid subject/values')
        for a in v.get('values',[]):reference('abilities' if k not in ['item','sideItem'] else 'items',a,where)
    elif k=='lastMove':
        ensure(v.get('who') in ['user','target'] and isinstance(v.get('values'),list) and len(v['values'])>0,where,'invalid move history predicate')
        for a in v.get('values',[]):reference('moves',a,where)
    elif k=='faster':ensure(isinstance(v,dict) and isinstance(v.get('stored'),bool),where,'invalid speed comparison')
    elif k=='globalAbility':
        for a in v:reference('abilities',a,where)
    elif k in ['moveType','attackType','baseMoveType','type']:ensure((v if k in ['moveType','attackType','baseMoveType'] else v.get('value')) in types,where,'invalid type')
    elif k in ['counter','priority','value','hp','effectiveness','turnsActive','level','basePower','hitEffectiveness']:
        ensure(v.get('op') in ['>','>=','<','<=','=='],where,'invalid comparator')
        ensure(number(v.get('fraction') if k=='hp' else v.get('value')),where,'invalid comparison number')
        if k=='counter':ensure(v.get('index') in range(1,6),where,'invalid counter')
    elif k=='category':ensure(v in ['Physical','Special','Status'],where,'invalid category')
    elif k=='pokemonFlag':ensure(isinstance(v,dict) and set(v)=={'who','id','value'} and v['who'] in ['user','target'] and re.fullmatch('[a-z][a-z0-9_]*',v['id']) and isinstance(v['value'],bool),where,'invalid Pokemon flag predicate')
    elif k=='statSumComparison':ensure(isinstance(v,dict) and set(v)=={'left','right','group','op'} and v.get('group') in ['foes','allies'] and v.get('op') in ['>','>=','<','<=','=='] and v.get('left') in stats and v.get('right') in stats,where,'invalid stat sum comparison')
    elif k=='chance':probability(v,where)
    elif k=='samePokemon':ensure(isinstance(v,bool),where,'invalid same-Pokemon predicate')
    elif k in ['hasAlly','transformed','itemStealable','statsLowered','selfInflicted','abilityChangedType','holderAllied','variableMultihit','holderIsUser','connected','accuracyMiss','damageDealt','drainHealed','canFlinch','baseCanFlinch','sheerForce','allyCanHeal','oneHitKO','zMove']:ensure(isinstance(v,bool),where,'invalid Boolean predicate')
    elif k in ['contact','wild','usableMove','pokemonActive']:ensure(isinstance(v,dict) and v.get('who') in ['user','target'] and (k!='wild' or isinstance(v.get('value'),bool)),where,'invalid actor/contact predicate')
    elif k=='formName':ensure(isinstance(v,dict) and v.get('who') in ['user','target'] and isinstance(v.get('value'),str),where,'invalid form name')
    elif k=='damageSource':ensure(isinstance(v,list) and len(v)>0 and all(isinstance(a,str) and re.fullmatch('[a-z0-9]+',a) for a in v),where,'invalid damage source')
    elif k=='startedCondition':ensure(isinstance(v,list) and len(v)>0 and all(a in ['mist','safeguard','luckychant','reflect','lightscreen','auroraveil','tailwind','spikes','toxicspikes','stealthrock','stickyweb'] for a in v),where,'invalid started condition')
    elif k=='incomingWeather':ensure(isinstance(v,list) and len(v)>0 and all(a in ['sunnyday','raindance','sandstorm','hail','snow','desolateland','primordialsea','deltastream','shadowsky'] for a in v),where,'invalid incoming weather')
    elif k=='weatherFor':ensure(isinstance(v,dict) and v.get('who') in ['user','target'] and isinstance(v.get('values'),list) and len(v['values'])>0 and all(a in ['sunnyday','raindance','sandstorm','hail','snow','desolateland','primordialsea','deltastream','shadowsky'] for a in v['values']),where,'invalid subject weather')
def check_actions(values,where):
    ensure(isinstance(values,list),where,'actions must be an array')
    for a in values:
        count['actions']+=1
        ensure(a.get('op') in actions,where,'unknown action '+str(a.get('op')))
        op=a.get('op')
        if 'who' in a:ensure(a['who'] in ['user','target'],where,'invalid action subject')
        if op=='conditional':check_condition(a.get('condition'),where);check_actions(a.get('actions'),where)
        if op=='setPokemonFlag':ensure(re.fullmatch('[a-z][a-z0-9_]*',a.get('id','')) and isinstance(a.get('value'),bool),where,'invalid Pokemon flag action')
        if op=='setWeather' and 'onSuccess' in a:check_actions(a['onSuccess'],where+'/weather')
        if op=='setWeather' and 'keepDuration' in a:ensure(a['keepDuration'] is True,where,'invalid weather clock policy')
        if op=='setWeather' and 'duration' in a:ensure(integer(a['duration'],1,20) and 'keepDuration' not in a,where,'invalid weather duration')
        if 'scaleField' in a:ensure(op in ['multiply','cyclePower','randomPower'] and isinstance(a['scaleField'],bool),where,'invalid field scaling flag')
        if op=='moveBehavior' and a.get('recipe')=='partialProtection':ensure(isinstance(a.get('conditions'),list) and len(a['conditions'])>0 and all(k in ['protect','kingsshield','obstruct','spikyshield','banefulbunker','silktrap','burningbulwark','matblock','wideguard','quickguard'] for k in a['conditions']) and number(a.get('fraction')) and 0<a['fraction']<=1 and isinstance(a.get('message'),str),where,'invalid partial protection')
        if op=='extraType':ensure(isinstance(a.get('values'),list) and len(a['values'])>0 and all(t in types for t in a['values']) and a.get('layer','field') in ['field','overlay'] and isinstance(a.get('cycle',False),bool) and isinstance(a.get('excludePrimary',False),bool),where,'invalid additional type roll')
        if op=='randomWeather':
            ensure(integer(a.get('duration'),1,20) and isinstance(a.get('force'),bool) and isinstance(a.get('choices'),list) and len(a['choices'])>=2 and len({r.get('id') for r in a['choices']})==len(a['choices']) and all(set(r)=={'id','message'} and r['id'] in ['sunnyday','raindance','sandstorm','hail','snow','desolateland','primordialsea','deltastream','shadowsky'] and isinstance(r['message'],str) for r in a['choices']),where,'invalid weather cycle')
        if op=='forEach':
            ensure(('anchor' not in a or a['anchor']=='holder') and ('order' not in a or a['order']=='speed') and ('message' not in a or isinstance(a['message'],str)),where,'invalid iteration options')
            if 'condition' in a:check_condition(a['condition'],where)
        if op=='forEach':ensure(a.get('group') in ['foes','allies','others'],where,'invalid action group');check_actions(a.get('actions'),where)
        if op=='forcedType':ensure(a.get('type') in types,where,'invalid forced type')
        if op=='itemForm':
            ensure(re.fullmatch('[a-z0-9]+',a.get('defaultSpecies','')) and a.get('defaultType') in types and isinstance(a.get('variants'),list) and len(a['variants'])>0,where,'invalid item form')
            for v in a.get('variants',[]):
                ensure(set(v)=={'items','species','type'} and v.get('type') in types and re.fullmatch('[a-z0-9]+',v.get('species','')) and isinstance(v.get('items'),list) and len(v['items'])>0,where,'invalid item form variant')
                for iid in v.get('items',[]):reference('items',iid,where+'/itemForm')
        if op=='randomType':ensure(isinstance(a.get('values'),list) and len(a['values'])>0 and all(v in types for v in a['values']) and ('force' not in a or isinstance(a['force'],bool)),where,'invalid random types')
        if op=='randomForm':ensure(isinstance(a.get('variants'),list) and len(a['variants'])>1 and all(set(v)=={'species','type'} and re.fullmatch('[a-z0-9]+',v['species']) and v['type'] in types for v in a['variants']),where,'invalid random forms')
        if 'sourceAbility' in a:ensure(op=='boost' and a['sourceAbility']=='intimidate',where,'invalid boost source');reference('abilities',a['sourceAbility'],where)
        if 'silent' in a:ensure(op=='volatile' and isinstance(a['silent'],bool),where,'invalid silent volatile')
        if op=='secondaryChance':ensure(('volatileStatus' not in a or a['volatileStatus']=='flinch') and ('chance' not in a or integer(a['chance'],0,100)) and ('multiplier' not in a or number(a['multiplier']) and a['multiplier']>=0),where,'invalid secondary chance')
        if op=='addSecondary':ensure(a.get('duplicateKey')=='volatileStatus' and isinstance(a.get('effect'),dict) and set(a['effect'])=={'chance','volatileStatus'} and integer(a['effect']['chance'],1,100) and a['effect']['volatileStatus'] in ['flinch','confusion'],where,'invalid additional secondary')
        if op=='randomStatus':status_pool(a,where)
        if op in ['randomBoost','randomStat']:ensure(isinstance(a.get('stats'),list) and len(a['stats'])>0 and all(k in stats for k in a['stats']) and integer(a.get('amount'),-12,12) and a['amount']!=0,where,'invalid random stat')
        if op=='transferStat':stat_map({a.get('stat'):a.get('amount')},where)
        if op=='castling':stat_map(a.get('userStats'),where);stat_map(a.get('partnerStats'),where);ensure(isinstance(a.get('message'),str),where,'invalid castling message')
        if op=='bindFieldClock':
            check_condition(a.get('durationCondition'),where);check_condition(a.get('permanentCondition'),where)
        if op=='changeField' and 'durationFromCondition' in a:ensure(a['durationFromCondition'] in ['gravity','mudsport','trickroom','magicroom','wonderroom'],where,'invalid duration source')
        if op=='changeField':ensure(('duration' not in a or integer(a['duration'],0,20)) and ('force' not in a or isinstance(a['force'],bool)) and ('boundCondition' not in a or isinstance(a['boundCondition'],str) and re.fullmatch('[a-z0-9]+',a['boundCondition'])),where,'invalid temporary field')
        if op in ['multiply','add','cap']:ensure(number(a.get('value')),where,'nonfinite action value')
        if op=='volatileDuration':ensure(re.fullmatch('[a-z0-9]+',a.get('id','')) and integer(a.get('amount'),-20,20) and a['amount']!=0 and integer(a.get('minimum'),1,20),where,'invalid volatile duration change')
        if op=='trap':ensure('force' not in a or isinstance(a['force'],bool),where,'invalid trap policy')
        if op=='clearHazards':ensure(isinstance(a.get('message'),str) and a['message'],where,'invalid hazard clearing message')
        if op in ['heal','damage','typedDamage','residualDamage','wish','adjustWish','setHPFraction']:ensure(number(a.get('fraction')) and 0<a['fraction']<=1,where,'invalid HP fraction')
        if op=='heal' and 'messageFrom' in a:ensure(a['messageFrom']=='user',where,'invalid healing message actor')
        if op=='fieldMove':ensure(re.fullmatch('[a-z0-9]+',a.get('move','')),where,'invalid field move');reference('moves',a['move'],where+'/fieldMove')
        if op=='heal' and 'failureMessage' in a:ensure(isinstance(a['failureMessage'],str),where,'invalid healing failure message')
        if op=='typedDamage' and 'direct' in a:ensure(isinstance(a['direct'],bool),where,'invalid direct damage policy')
        if 'messagePlacement' in a:ensure(a['messagePlacement'] in ['before','after'],where,'invalid message placement')
        if op=='boost':
            if 'source' in a:ensure(a['source']=='environment',where,'invalid boost source')
            if 'flavor' in a:ensure(isinstance(a['flavor'],str) and re.fullmatch('[a-z ]+',a['flavor']) and all(v==1 for v in a.get('stats',{}).values()),where,'invalid boost flavour')
            ensure(isinstance(a.get('stats'),dict) and all(k in stats and isinstance(v,int) and -12<=v<=12 for k,v in a.get('stats',{}).items()),where,'invalid stat modification')
        if op in ['changeField','weatherTemporary']:ensure(a.get('field') in fields,where,'invalid action field')
        if op in ['type','moveType','typedDamage']:ensure(a.get('type') in types,where,'invalid action type')
        if op=='hazardBurst':
            ensure(a.get('id') in ['spikes','stealthrock','stickyweb','toxicspikes'] and isinstance(a.get('messages'),list) and len(a['messages'])>0 and all(isinstance(t,str) and t for t in a['messages']) and set(a)<={'op','id','messages','type','fraction','perLayer','grounded','immuneTypes','poison','boosts'},where,'invalid hazard burst')
            if 'boosts' in a:stat_map(a['boosts'],where);ensure('fraction' not in a,where,'invalid hazard burst effect')
            else:ensure(number(a.get('fraction')) and 0<a['fraction']<=1,where,'invalid hazard burst effect')
            ensure(all(isinstance(a[k],bool) for k in ['perLayer','grounded','poison'] if k in a) and ('type' not in a or a['type'] in types) and all(t in types for t in a.get('immuneTypes',[])),where,'invalid hazard burst filter')
        if op=='ability':reference('abilities',a.get('id'),where)
        if op=='criticalStage':ensure(a.get('id') in ['focusenergy','dragoncheer'] and isinstance(a.get('stage'),int) and 1<=a['stage']<=3,where,'invalid critical stage')
        if op=='weightDelta':ensure(number(a.get('baseMultiplier')) and a['baseMultiplier']>0,where,'invalid weight increment')
        if op=='removeCallbacks':ensure(isinstance(a.get('callbacks'),list) and len(a['callbacks'])>0 and all(k in ['onPrepareHit','onTry','onTryHit','onModifyMove','onHit','basePowerCallback'] for k in a['callbacks']),where,'invalid callback removal list')
        if op=='pairField':
            ensure(a.get('memory') in ['pledge','conversion'],where,'invalid pair memory')
            ensure(isinstance(a.get('duration'),int) and 0<a['duration']<=20 and isinstance(a.get('extendedBy'),int) and 0<=a['extendedBy']<=20,where,'invalid pair duration')
            reference('moves',a.get('token'),where+'/pair')
            ensure(isinstance(a.get('pairs'),list) and len(a['pairs'])>0,where,'missing pair outcomes')
            for row in a.get('pairs',[]):
                reference('moves',row.get('with'),where+'/pair');ensure(row.get('field') in fields,where,'invalid pair field')
                ensure(isinstance(row.get('message'),str) and isinstance(row.get('refreshMessage'),str),where,'invalid pair messages')
            if 'disallowPermanentField' in a:ensure(a['disallowPermanentField'] in fields,where,'invalid permanent restriction')
        if op=='createField':ensure(('blockEverstone' not in a or isinstance(a['blockEverstone'],bool)) and a.get('field') in fields and isinstance(a.get('duration'),int) and 0<a['duration']<=20 and isinstance(a.get('extendedBy'),int) and 0<=a['extendedBy']<=20,where,'invalid field creation')
        if op=='counter':ensure(a.get('index') in range(1,6) and isinstance(a.get('amount'),int),where,'invalid counter action')
        if op=='sideCondition':
            ensure(a.get('id') in ['mist','safeguard','luckychant','reflect','lightscreen','auroraveil','tailwind','spikes','toxicspikes','stealthrock','stickyweb'],where,'invalid side condition')
            if 'duration' in a:ensure(isinstance(a['duration'],int) and 0<a['duration']<=20,where,'invalid side duration')
        if 'maximize' in a:check_condition(a['maximize'],where)
        for m in a.get('modifiers',[]):check_condition(m['condition'],where);ensure(number(m['multiplier']),where,'invalid residual multiplier')
        if op=='moveProperty':ensure(a.get('path') in ['boosts','self.boosts','secondaries.0.self.boosts','secondaries.0.self','secondaries.0.boosts','heal','recoil','basePower','damage','priority','accuracy','target','spreadModifier','sideCondition','category','status','zMove.boost','secondaries','secondaries.0.status','pseudoWeather','flags.gravity','flags.protect','flags.sound','flags.bypasssub','selfBoost','self','pranksterBoosted','forceSwitch','maxHPRecoil','magnitude','drain','ignoreImmunity','overrideOffensiveStat','overrideDefensiveStat'],where,'unsafe/invalid move path')
        if op=='moveProperty' and a.get('path') in ['overrideOffensiveStat','overrideDefensiveStat']:ensure(a.get('value') in ['atk','def','spa','spd','spe'],where,'invalid stat override')
        if op=='moveProperty' and a.get('path')=='secondaries.0.self':ensure('value' in a and a['value'] is None,where,'invalid secondary self override')
        if op=='moveProperty' and a.get('path')=='ignoreImmunity':ensure(a.get('value')=={'Ground':True},where,'invalid immunity override')
        if op=='moveProperty' and a.get('path')=='drain':ensure(isinstance(a.get('value'),list) and len(a['value'])==2 and all(integer(n,1,100) for n in a['value']) and a['value'][0]<=a['value'][1],where,'invalid drain share')
        if op=='moveProperty' and a.get('path')=='magnitude':ensure(integer(a.get('value'),4,10),where,'invalid magnitude')
        if op=='moveProperty' and a.get('path')=='maxHPRecoil':ensure(number(a.get('value')) and 0<a['value']<=1,where,'invalid max-HP recoil')
        if 'removeCallback' in a:ensure(a['removeCallback'] in ['onHit','onTry','onBasePower','basePowerCallback'],where,'invalid callback removal')
        if op=='moveBehavior' and a.get('recipe')=='smartCategory':
            ensure(a.get('comparison') in ['offense','difference'] and isinstance(a.get('contactByCategory'),bool),where,'invalid smart category')
            for key in ['physicalMultipliers','specialMultipliers','defenseMultipliers','specialDefenseMultipliers']:
                ensure(isinstance(a.get(key),list),where,'missing category multipliers')
                for row in a.get(key,[]):ensure(set(row)=={'condition','factor'} and number(row.get('factor')) and 0<row['factor']<=4,where,'invalid category multiplier');check_condition(row.get('condition'),where)
        if op=='moveBehavior':
            ensure(a.get('recipe') in ['partialProtection','smartCategory','cureAndBoost','setTypes','appendHitActions','payHP','fixedDamage','targetWeightPower','boostOnly','shareHP','deductPP','arenaRoar','firstTypeBonus','refreshVolatileBeforeHit','reapplyStatusHeal','replaceHitActions','otherActiveHitActions','randomStatusSecondary','boostStagePower','allActiveHitActions','weightRatioPower','purify','swallow','randomPowerCallback','forceBasePower','appendSecondaryActions','alliesHitActions','beforeCalledMoveActions','randomMovePool','strengthSap','targetHealing','concertRoar','dualBoost','gatedStatChanges'],where,'unknown move recipe')
            if a.get('recipe')=='refreshVolatileBeforeHit':ensure(isinstance(a.get('id'),str) and a['id'].isalnum() and a['id'].islower(),where,'invalid refreshed volatile')
            if a.get('recipe')=='reapplyStatusHeal':ensure(a.get('status') in ['slp','brn','par','psn','tox','frz'] and isinstance(a.get('duration'),int) and 0<a['duration']<=20 and number(a.get('fraction')) and 0<a['fraction']<=1,where,'invalid status refresh/heal')
            if a.get('recipe') in ['appendHitActions','appendSecondaryActions','replaceHitActions','otherActiveHitActions','allActiveHitActions','alliesHitActions','beforeCalledMoveActions','targetHealing']:check_actions(a.get('actions'),where+'/hit')
            if a.get('recipe') in ['allActiveHitActions','alliesHitActions']:check_condition(a.get('condition'),where)
            if a.get('recipe')=='randomStatusSecondary':status_pool(a,where)
            if a.get('recipe') in ['boostStagePower','forceBasePower']:ensure(integer(a.get('base'),1,1000),where,'invalid fixed base power')
            if a.get('recipe')=='weightRatioPower':ensure(number(a.get('multiplier')) and 0<a['multiplier']<=10,where,'invalid weight ratio')
            if a.get('recipe')=='randomPowerCallback':probability(a,where);ensure(integer(a.get('base'),1,1000) and integer(a.get('boosted'),1,1000),where,'invalid chance power')
            if a.get('recipe') in ['purify','strengthSap','concertRoar']:stat_map(a.get('stats'),where)
            if a.get('recipe') in ['purify','targetHealing']:ensure(number(a.get('fraction')) and 0<a['fraction']<=1 and ('userFraction' not in a or number(a['userFraction']) and 0<a['userFraction']<=1),where,'invalid target healing')
            if a.get('recipe')=='swallow':ensure(isinstance(a.get('fractions'),list) and len(a['fractions'])==3 and all(number(v) and 0<v<=1 for v in a['fractions']) and integer(a.get('cureAt'),1,3),where,'invalid stockpile healing')
            if a.get('recipe')=='gatedStatChanges':
                stat_map(a.get('stats'),where);stat_map(a.get('gateStats'),where);ensure(a.get('gateWho') in ['user','target'] and isinstance(a.get('selfSwitch'),bool) and isinstance(a.get('failureMessage'),str),where,'invalid gated stat change')
            if a.get('recipe')=='dualBoost':stat_map(a.get('targetStats'),where);stat_map(a.get('userStats'),where)
            if a.get('recipe')=='randomMovePool':
                ensure(integer(a.get('minimumPower'),1,1000) and isinstance(a.get('choices'),list) and len(a['choices'])>0 and len(set(a['choices']))==len(a['choices']),where,'invalid random move pool')
                for mid in a.get('choices',[]):reference('moves',mid,where+'/callingPool')
            if a.get('recipe')=='beforeCalledMoveActions':ensure(a.get('callback')=='onTryHit',where,'invalid caller callback')
            if 'silentCommands' in a:ensure(isinstance(a['silentCommands'],list) and len(a['silentCommands'])>0 and all(v in ['swap','-start','-status'] for v in a['silentCommands']),where,'invalid silent command policy')
            if a.get('recipe')=='appendHitActions':ensure(a.get('callback','onHit') in ['onHit','onHitSide','onAfterHit','onHitField'],where,'invalid hit action callback')
            if a.get('recipe')=='deductPP':ensure(isinstance(a.get('amount'),int) and 0<a['amount']<=64,where,'invalid PP deduction')
            if a.get('recipe')=='firstTypeBonus':ensure(a.get('type') in types and isinstance(a.get('repeat'),int) and 1<=a['repeat']<=3 and isinstance(a.get('positiveOnly'),bool),where,'invalid first-type bonus')
            if a.get('recipe')=='payHP':
                ensure(number(a.get('fraction')) and 0<a['fraction']<=1,where,'invalid HP cost')
                ensure(a.get('callback','onHit') in ['onHit','onAfterMove'],where,'invalid cost callback')
                ensure('requireHit' not in a or a['requireHit'] is True and a.get('callback')=='onAfterMove',where,'invalid cost hit requirement')
            if a.get('recipe')=='setTypes':ensure(isinstance(a.get('types'),list) and 0<len(a['types'])<=2 and all(t in types for t in a['types']),where,'invalid replacement types')
            if a.get('recipe')=='fixedDamage':
                ensure(a.get('basis') in ['level','targetHP','targetMaxHP','constant'] and number(a.get('factor')) and 0<a['factor']<=2 and ((a['basis']=='constant')==('amount' in a)) and ('amount' not in a or integer(a['amount'],1,9999)),where,'invalid fixed damage')
                if 'randomRange' in a:
                    r=a['randomRange'];ensure(isinstance(r.get('minimum'),int) and isinstance(r.get('maximum'),int) and 0<r['minimum']<=r['maximum']<=1000,where,'invalid random damage range')
            if a.get('recipe')=='boostOnly':ensure(isinstance(a.get('stats'),dict) and len(a['stats'])>0 and all(k in stats and isinstance(v,int) and -12<=v<=12 for k,v in a['stats'].items()),where,'invalid move boosts')
for aid,row in abilities.items():
    ensure(re.fullmatch('[a-z0-9]+',aid) and set(row)<=set('name num description flags inherit callbacks soundMoveTypes airborne airborneBeforeGravity'.split()) and set('name description flags callbacks'.split())<=set(row),aid,'invalid declared ability keys')
    ensure(all(isinstance(row.get(k),str) and row[k] for k in ['name','description']) and ('num' not in row or integer(row['num'],1,10000)),aid,'invalid ability metadata')
    ensure(isinstance(row.get('flags'),dict) and all(k in ['breakable','cantsuppress','notrace','noreceiver','noentrain','noskillSwap','failroleplay'] and v==1 for k,v in row['flags'].items()),aid,'invalid ability flags')
    if 'airborneBeforeGravity' in row:ensure(isinstance(row['airborneBeforeGravity'],bool) and row.get('airborne') is True,aid,'invalid gravity-independent ability')
    if 'airborne' in row:ensure(isinstance(row['airborne'],bool),aid,'invalid airborne ability')
    if 'soundMoveTypes' in row:ensure(isinstance(row['soundMoveTypes'],list) and len(row['soundMoveTypes'])>0 and all(t in types and t!='???' for t in row['soundMoveTypes']),aid,'invalid sound move types')
    if 'inherit' in row:ensure(row['inherit'] in registry['abilities'] and row['inherit'] not in abilities,aid,'invalid native ability inheritance')
    for key,callback in row['callbacks'].items():
        ensure(key in ['onStart','onModifyMove','onBasePower','onSourceModifyAccuracy','onSourceAccuracy','onModifyCritRatio','onAllyModifyCritRatio','onTryHit','onModifyType','onModifyAtk','onModifySpA','onResidual','onDamagingHit','onImmunity','onBeforeResidual','onEnd'] and set(callback)=={'condition','actions','source','mode'} and callback.get('mode') in ['replace','prepend','append','scaleBoosts'],aid,'invalid declared callback')
        check_condition(callback.get('condition'),aid);check_actions(callback.get('actions'),aid)
    registry['abilities'].append(aid)
for name,f in fields.items():
    for key,row in f.get('weatherDefinitions',{}).items():
        ensure(re.fullmatch('[a-z0-9]+',key) and set(row)==set('name duration damageFraction damageMessage startMessage endMessage excludedAbilities excludedItems excludedVolatiles excludedFlags source'.split()) and integer(row.get('duration'),1,20) and number(row.get('damageFraction')) and 0<row['damageFraction']<=1,name,'invalid weather definition')
        for k in ['name','source','startMessage','endMessage','damageMessage']:ensure(isinstance(row.get(k),str),name,'invalid weather text')
        for k in ['excludedAbilities','excludedItems','excludedVolatiles','excludedFlags']:
            ensure(isinstance(row.get(k),list) and all(isinstance(v,str) and re.fullmatch('[a-z0-9]+',v) for v in row[k]),name,'invalid weather exclusions')
            if k in ['excludedAbilities','excludedItems']:
                for v in row[k]:reference('abilities' if k=='excludedAbilities' else 'items',v,name+'/weather')
    for t,row in f.get('extraTypePolicies',{}).items():ensure(t in types and set(row)=={'mode','source'} and row.get('mode')=='firstWeaknessTwice' and isinstance(row.get('source'),str),name,'invalid secondary type policy')
    for row in f.get('typeFlagInteractions',[]):
        ensure(set(row)==set('attackType flag flagged unflagged source'.split()) and row.get('attackType') in types and re.fullmatch('[a-z0-9]+',row.get('flag','')) and row.get('flagged') in [-1,0,1] and row.get('unflagged') in [-1,0,1] and isinstance(row.get('source'),str),name,'invalid type flag interaction')
    for t,row in f.get('typeDefinitions',{}).items():
        ensure(t=='Shadow' and set(row)==set('displayName hue textureBasis damageTaken outgoing flagInteraction source'.split()) and isinstance(row.get('displayName'),str) and isinstance(row.get('source'),str) and integer(row.get('hue'),0,360) and row.get('textureBasis') in types,name,'invalid custom type')
        for k in ['damageTaken','outgoing']:ensure(isinstance(row.get(k),dict) and all(t in types and n in [0,1,2,3] for t,n in row[k].items()),name,'invalid custom type chart')
        r=row['flagInteraction'];ensure(set(r)==set('flag flagged unflagged unflaggedExceptions'.split()) and re.fullmatch('[a-z0-9]+',r.get('flag','')) and r.get('flagged') in [-1,0,1] and r.get('unflagged') in [-1,0,1] and isinstance(r.get('unflaggedExceptions'),list) and all(t in types for t in r['unflaggedExceptions']),name,'invalid custom type flag')
    for cid,callbacks in f.get('suppressedConditionCallbacks',{}).items():
        ensure(re.fullmatch('[a-z0-9]+',cid) and isinstance(callbacks,list) and len(callbacks)>0 and len(callbacks)==len(set(callbacks)) and all(c in ['onModifyAtk','onModifySpA'] for c in callbacks),name,'invalid suppressed condition callbacks')
    for aid,row in f.get('abilityDamageCategories',{}).items():
        reference('abilities',aid,name+'/abilityDamageCategories');ensure(set(row)=={'categories','nativeCategory','source'} and isinstance(row.get('categories'),list) and len(row['categories'])>0 and len(row['categories'])==len(set(row['categories'])) and all(c in ['Physical','Special'] for c in row['categories']) and row.get('nativeCategory') in ['Physical','Special'] and isinstance(row.get('source'),str),name,'invalid ability damage category override')
    if 'criticalPolicy' in f:
        p=f['criticalPolicy'];ensure(set(p)==set('condition modifier applyScreens hideMessage source'.split()) and number(p.get('modifier')) and 0<p['modifier']<=2 and isinstance(p.get('applyScreens'),bool) and isinstance(p.get('hideMessage'),bool) and isinstance(p.get('source'),str),name,'invalid critical policy');check_condition(p.get('condition'),name)
    for key,row in f.get('protectionPolicy',{}).items():
        ensure(key in ['kingsshield','obstruct','silktrap','burningbulwark','spikyshield','banefulbunker','protect'] and set(row)<=set('blockStatus contactBoosts contactFraction source'.split()) and isinstance(row.get('source'),str),name,'invalid protection policy')
        ensure(row.get('blockStatus',True) is True,name,'invalid protection status block')
        if 'contactBoosts' in row:ensure(isinstance(row['contactBoosts'],dict) and len(row['contactBoosts'])>0 and all(k in stats and isinstance(n,int) and n and abs(n)<=12 for k,n in row['contactBoosts'].items()),name,'invalid protection contact stages')
        if 'contactFraction' in row:ensure(number(row['contactFraction']) and 0<row['contactFraction']<=1,name,'invalid protection contact damage')
    if 'switchTiming' in f:ensure(f['switchTiming']=='action',name,'invalid switch timing')
    if 'damageRoll' in f:ensure(integer(f['damageRoll'],85,100),name,'invalid fixed damage roll')
    if 'nativeFormTyping' in f:ensure(isinstance(f['nativeFormTyping'],list) and len(f['nativeFormTyping'])>0 and all(v in ['arceus','silvally'] for v in f['nativeFormTyping']),name,'invalid native form typing')
    if 'inactiveAbilities' in f:
        ensure(isinstance(f['inactiveAbilities'],list),name,'invalid inactive abilities')
        for aid in f['inactiveAbilities']:reference('abilities',aid,name+'/inactiveAbilities')
    for row in f.get('statusTypeBypass',[]):
        ensure(set(row)=={'condition','source','status'} and row.get('status')=='psn',name,'invalid status type bypass');check_condition(row.get('condition'),name)
    if 'progression' in f:
        p=f['progression'];ensure(isinstance(p.get('group'),str) and integer(p.get('stage'),1,9) and integer(p.get('maximum'),1,9) and p['stage']<=p['maximum'] and ('statChangeShrinkMessage' not in p or isinstance(p['statChangeShrinkMessage'],str) and p['statChangeShrinkMessage']),name,'invalid progression')
    for aid,row in f.get('environmentAbilities',{}).items():
        reference('abilities',aid,name);ensure(aid in ['quarkdrive','protosynthesis'] and set(row)=={'boosterMessage','callback','condition','entryCondition','expiryMessage','messages','source'} and row['callback'] in ['onTerrainChange','onWeatherChange'] and all(isinstance(row[k],str) for k in ['expiryMessage','boosterMessage','source']) and isinstance(row['messages'],list) and len(row['messages'])>0,name,'invalid environmental ability');check_condition(row['condition'],name);check_condition(row['entryCondition'],name)
        for r in row['messages']:ensure(set(r)=={'condition','text'} and isinstance(r['text'],str),name,'invalid environmental message');check_condition(r['condition'],name)
    for iid,callbacks in f.get('itemHandlers',{}).items():
        reference('items',iid,name)
        for key,row in callbacks.items():
            ensure(key in ['onResidual','onStart','onModifyMove'] and set(row)=={'condition','actions','source','mode'} and row.get('mode') in ['replace','prepend','append'],name,'invalid item handler');check_condition(row['condition'],name);check_actions(row['actions'],name)
    for aid,callbacks in f.get('abilityHandlers',{}).items():
        reference('abilities',aid,name+'/abilityHandlers')
        for key,row in callbacks.items():
            ensure(key in ['onStart','onResidual','onBeforeResidual','onEnd','onUpdate','onAllySwitchIn','onSetStatus','onAllySetStatus','onAnyFaint','onDamagingHit','onSourceDamagingHit','onSourceTryPrimaryHit','onTryHit','onFoeTryMove','onImmunity','onBasePower','onSourceModifyAccuracy','onSourceAccuracy','onAllyBasePower','onAnyBasePower','onModifyAtk','onModifySpA','onAllyModifyAtk','onAllyModifySpA','onAllyModifySpD','onWeatherChange','onModifyDef','onModifySpD','onModifyDamage','onSourceModifyDamage','onModifyAccuracy','onModifySpe','onModifyCritRatio','onAllyModifyCritRatio','onModifyType','onEmergencyExit','onDeductPP','onSourceAfterFaint','onAfterMoveSecondary','onModifyMove','onAfterEachBoost','onAllyTryBoost','onAllyTryAddVolatile'] and set(row)=={'condition','actions','source','mode'} and row.get('mode') in ['replace','prepend','append','scaleBoosts'],name,'invalid ability handler')
            check_condition(row.get('condition'),name);check_actions(row.get('actions'),name)
    for key,row in f.get('customVolatiles',{}).items():
        ensure(re.fullmatch('rejuvenation[a-z0-9]+',key) and set(row)=={'actions','source'},name,'invalid custom volatile');check_actions(row.get('actions'),name)
    if f.get('rampagePolicy'):
        row=f['rampagePolicy'];ensure(set(row)<=set('duration noConfusionMoves source'.split()) and ('duration' not in row or integer(row['duration'],1,3)) and isinstance(row.get('noConfusionMoves'),list) and all(v in ['outrage','thrash','petaldance','ragingfury'] for v in row['noConfusionMoves']),name,'invalid rampage policy')
    if 'multiplierPolicy' in f:
        row=f['multiplierPolicy'];ensure(set(row)==set('defaultDifficultyMode defaultFieldFrenzy casualMode casualFactor frenzyBoostFactor frenzyReductionFactor combinedMinimum source'.split()),name,'invalid multiplier policy keys')
        ensure(row.get('defaultDifficultyMode') in [0,1,2] and isinstance(row.get('defaultFieldFrenzy'),bool) and row.get('casualMode') in [0,1,2],name,'invalid difficulty defaults')
        ensure(all(number(row.get(key)) and 0<row[key]<=4 for key in ['casualFactor','frenzyBoostFactor','frenzyReductionFactor','combinedMinimum']),name,'invalid difficulty factors')
    if 'expirationReturnMessage' in f:ensure(isinstance(f['expirationReturnMessage'],str),name,'invalid restoration message')
    for key,row in f.get('volatilePolicies',{}).items():
        ensure(key=='nightmare' and set(row)==set('allowAwake suppressResidual fraction message source'.split()),name,'unknown volatile policy')
        ensure(isinstance(row.get('allowAwake'),bool) and isinstance(row.get('suppressResidual'),bool) and number(row.get('fraction')) and 0<row.get('fraction',0)<=1 and isinstance(row.get('message'),str),name,'malformed volatile policy')
    for key,row in f.get('conditionDurations',{}).items():
        ensure(set(row)<=set('duration add sourceMoves source choices sourceAbilities'.split()) and ('duration' in row)!=('add' in row),name,'invalid condition duration policy')
        ensure(isinstance(row.get('sourceMoves'),list) and len(row['sourceMoves'])>0,name,'missing duration move filter')
        for mid in row.get('sourceMoves',[]):reference('moves',mid,name+'/conditionDurations')
        ensure(isinstance(row.get('sourceAbilities',[]),list),name,'invalid duration ability filter')
        for aid in row.get('sourceAbilities',[]):reference('abilities',aid,name+'/conditionDurations')
        ensure(isinstance(row.get('duration',row.get('add')),int) and 0<row.get('duration',row.get('add',0))<=20,name,'invalid duration value')
        for choice in row.get('choices',[]):
            ensure(set(choice)<=set('condition duration randomRange'.split()) and ('duration' in choice)!=('randomRange' in choice),name,'invalid duration choice')
            check_condition(choice.get('condition'),name+'/conditionDurations')
            if 'duration' in choice:ensure(isinstance(choice['duration'],int) and 0<choice['duration']<=20,name,'invalid choice clock')
            if 'randomRange' in choice:
                r=choice['randomRange'];ensure(set(r)=={'minimum','maximum'} and all(isinstance(r.get(k),int) for k in ['minimum','maximum']) and 1<=r['minimum']<=r['maximum']<=20,name,'invalid random clock')
    for row in f.get('captureEnvironmentModifiers',[]):
        ensure(set(row)=={'ball','predicate','multiplier','source'} and row.get('predicate') in ['night','underwater'] and number(row.get('multiplier')) and 0<row['multiplier']<=10,name,'invalid capture environment rule')
    for key,row in f.get('persistentStatusPolicies',{}).items():
        ensure(key=='ptr' and set(row)==set('name immuneTypes immuneAbilities sideProtectionAbility drainAbility invertAbility fraction blocksHealing blockedHealingAbilities drainMessage healingFailureMessage source'.split()),name,'invalid persistent status policy')
        ensure(number(row.get('fraction')) and 0<row['fraction']<=1 and isinstance(row.get('blocksHealing'),bool),name,'invalid persistent status damage/healing')
        ensure(all(t in types for t in row.get('immuneTypes',[])),name,'invalid persistent status type')
        for aid in row['immuneAbilities']+row['blockedHealingAbilities']+[row['sideProtectionAbility'],row['drainAbility'],row['invertAbility']]:reference('abilities',aid,name+'/persistentStatus')
    for key,row in f.get('abilityContactPolicies',{}).items():
        reference('abilities',key,name+'/contactPolicy')
        ensure(key=='perishbody' and set(row)==set('disabled duration trapDefender forceAttackerStatus message source'.split()) and isinstance(row.get('duration'),int) and 0<row['duration']<=10 and isinstance(row.get('disabled'),bool) and isinstance(row.get('trapDefender'),bool) and row.get('forceAttackerStatus') in ['','ptr'],name,'invalid contact policy')
    for ball,value in f.get('captureModifiers',{}).items():ensure(bool(re.fullmatch('[a-z0-9_.-]+:[a-z0-9_/.-]+',ball)) and number(value) and 0<value<=10,name,'invalid capture modifier')
    if 'hazardPolicy' in f:
        h=f['hazardPolicy'];shape={'spikes':{'type','affectsAirborne','message'},'stealthrock':{'type','cycleTypes','multiplier','message'},'stickyweb':{'stages'},'toxicspikes':{'keepOnPoisonType'}}
        ensure(isinstance(h.get('source'),str) and set(h)<={'source','cleared','suspended',*shape} and h.get('suspended',True) is True and ('cleared' not in h or (isinstance(h['cleared'],list) and h['cleared'] and all(k in shape for k in h['cleared']))),name,'invalid hazard policy')
        for key,keys in shape.items():
            if key not in h:continue
            r=h[key];ensure(isinstance(r,dict) and r and set(r)<=keys and all(t in types for t in ([r['type']] if 'type' in r else [])+r.get('cycleTypes',[])) and ('message' not in r or (isinstance(r['message'],str) and r['message'])) and ('multiplier' not in r or (number(r['multiplier']) and r['multiplier']>0)) and all(r[k] is True for k in ['affectsAirborne','keepOnPoisonType'] if k in r) and ('stages' not in r or integer(r['stages'],-6,-1)) and not ('type' in r and 'cycleTypes' in r),name,'invalid hazard policy row')
    for row in f.get('effectivenessOverrides',[]):
        ensure(isinstance(row,dict) and set(row)=={'condition','value','source'} and integer(row['value'],-3,3) and isinstance(row['source'],str),name,'invalid effectiveness override');check_condition(row['condition'],name)
    if 'revivalBlessing' in f:ensure(set(f['revivalBlessing'])=={'fraction','source'} and number(f['revivalBlessing']['fraction']) and 0<f['revivalBlessing']['fraction']<=1 and isinstance(f['revivalBlessing']['source'],str),name,'invalid Revival Blessing policy')
    for aid in f.get('priorityBlockingAbilities',[]):reference('abilities',aid,name+'/priorityBlocking')
    for key,row in f.get('volatileMoveLocks',{}).items():
        ensure(re.fullmatch('[a-z0-9]+',key) and isinstance(row,dict) and set(row)=={'move','source'} and isinstance(row['source'],str),name,'invalid volatile move lock');reference('moves',row.get('move'),name+'/volatileMoveLock')
    for weather,row in f.get('timedWeatherText',{}).items():ensure(weather in ['sunnyday','raindance','sandstorm','hail','snow','desolateland','primordialsea','deltastream','shadowsky'] and set(row)=={'startMessage','endMessage','source'} and all(isinstance(v,str) and v for v in row.values()),name,'invalid timed weather text')
    if 'weatherRainbow' in f:
        r=f['weatherRainbow'];ensure(set(r)=={'field','groups','message','refreshMessage','baseDuration','extendedDuration','extendingItems','source'} and r['field'] in fields and isinstance(r['groups'],list) and len(r['groups'])==2 and all(isinstance(g,list) and g and all(w in ['sunnyday','raindance','sandstorm','hail','snow','desolateland','primordialsea','deltastream','shadowsky'] for w in g) for g in r['groups']) and not set(r['groups'][0])&set(r['groups'][1]) and integer(r['baseDuration'],1,20) and integer(r['extendedDuration'],1,20) and all(isinstance(r[k],str) and r[k] for k in ['message','refreshMessage','source']) and isinstance(r['extendingItems'],dict) and all(w in r['groups'][0]+r['groups'][1] and isinstance(i,str) and i for w,i in r['extendingItems'].items()),name,'invalid weather rainbow policy')
    for old,new in f.get('weatherConversions',{}).items():ensure(old in ['sunnyday','raindance','sandstorm','hail','snow','desolateland','primordialsea','deltastream','shadowsky'] and new in ['sunnyday','raindance','sandstorm','hail','snow','desolateland','primordialsea','deltastream','shadowsky'] and old!=new,name,'invalid weather conversion')
    for aid,row in f.get('abilityAbsorptions',{}).items():
        reference('abilities',aid,name+'/abilityAbsorptions')
        ensure(set(row)<=set('type stat boosts healFractions cycle maximizeOverlay source'.split()) and row.get('type') in types and (bool(row.get('boosts'))!=bool(row.get('healFractions'))),name,'invalid absorption policy')
        values=row.get('boosts',row.get('healFractions',[]));ensure(isinstance(values,list) and len(values)>0 and all(number(v) and 0<=v<= (6 if 'boosts' in row else 1) for v in values),name,'invalid absorption values')
        if 'boosts' in row:ensure(row.get('stat') in stats and all(isinstance(v,int) for v in values),name,'invalid absorption stat/boosts')
        if 'maximizeOverlay' in row:ensure(row['maximizeOverlay'] in fields,name,'invalid absorption overlay')
        if 'cycle' in row:ensure(isinstance(row['cycle'],bool),name,'invalid absorption cycle')
    for aid in f.get('indirectImmunityAbilities',[]):reference('abilities',aid,name+'/indirectImmunity')
    if 'statPools' in f:
        p=f['statPools'];ensure(set(p)=={'offensiveSpecial','defensiveSpecial','borrowedOffense','source'},name,'malformed shared stat pool')
        ensure(isinstance(p.get('borrowedOffense'),dict),name,'invalid borrowed stat pool')
        for mid,row in p.get('borrowedOffense',{}).items():
            reference('moves',mid,name+'/borrowedOffense');ensure(set(row)=={'selection','modifierSelection'} and row.get('selection')=='staged' and row.get('modifierSelection')=='modifiersOnly',name,'invalid borrowed stat selection')
        for key in ['offensiveSpecial','defensiveSpecial']:ensure(isinstance(p.get(key),list) and len(p[key])==2 and set(p[key])=={'spa','spd'},name,'invalid shared Special stats')
    if 'trapping' in f:
        t=f['trapping'];ensure(set(t)<=set('divisors moveIncrements statLoss immuneAbilities octolockAmount source'.split()),name,'unknown trapping key')
        ensure(t.get('divisors')==[8,6,4,3,2],name,'invalid binding divisor table')
        for mid,value in t.get('moveIncrements',{}).items():reference('moves',mid,name+'/trapping');ensure(isinstance(value,int) and 0<=value<=3,name,'invalid binding increment')
        for mid,values in t.get('statLoss',{}).items():reference('moves',mid,name+'/trapping');ensure(isinstance(values,list) and len(values)>0 and all(v in stats for v in values),name,'invalid binding stat loss')
        for value in t.get('immuneAbilities',[]):reference('abilities',value,name+'/trapping')
        if 'octolockAmount' in t:ensure(t['octolockAmount'] in [-1,-2],name,'invalid octolock amount')
    if 'grounding' in f:
        g=f['grounding'];ensure(set(g)=={'airborneAbilities','forceGroundingItems','source'},name,'malformed grounding keys')
        for k,kind in [('airborneAbilities','abilities'),('forceGroundingItems','items')]:
            ensure(isinstance(g.get(k),list),name,'invalid grounding IDs')
            for value in g.get(k,[]):reference(kind,value,name+'/grounding')
    for value in f.get('gravityUsableMoves',[]):reference('moves',value,name+'/gravityUsableMoves')
    if 'terrainPolicy' in f:
        p=f['terrainPolicy'];ensure(set(p)<=set('blockedMessage blockedFields moveDurations abilityDurations source clearOverlayOnEntry'.split()),name,'unknown terrain policy key')
        if 'clearOverlayOnEntry' in p:ensure(isinstance(p['clearOverlayOnEntry'],bool),name,'invalid overlay clearing policy')
        if 'blockedMessage' in p:ensure(isinstance(p['blockedMessage'],str),name,'invalid terrain message')
        for value in p.get('blockedFields',[]):ensure(value in fields,name,'invalid blocked terrain field')
        for value,duration in list(p.get('moveDurations',{}).items())+list(p.get('abilityDurations',{}).items()):ensure(value in fields and isinstance(duration,int) and 0<duration<=20,name,'invalid terrain duration')
    if 'healing' in f:
        h=f['healing'];ensure(set(h)==set('rootFactor agentMultipliers overlayAgents moveMultipliers harmfulAgents liquidOozeFactor drainStatLoss'.split()),name,'malformed healing keys')
        for k in ['rootFactor','liquidOozeFactor']:ensure(number(h.get(k)) and h[k]>0,name,'invalid healing factor')
        for k in ['agentMultipliers','moveMultipliers']:
            ensure(isinstance(h.get(k),dict) and all(number(v) and v>0 for v in h[k].values()),name,'invalid healing scaling')
        for mid in h.get('moveMultipliers',{}):reference('moves',mid,name+'/healing')
        ensure(isinstance(h.get('drainStatLoss'),bool),name,'invalid drain stat loss')
        ensure(isinstance(h.get('overlayAgents'),list) and all(a in ['drain','leechseed','ingrain','aquaring','strengthsap'] for a in h['overlayAgents']),name,'invalid overlay healing')
        for a in h.get('harmfulAgents',{}).values():ensure(set(a)=={'respectMagicGuard','message'} and isinstance(a['respectMagicGuard'],bool) and isinstance(a['message'],str),name,'invalid harmful healing')

    ensure(f.get('schemaVersion')==1,name,'invalid schema version')
    ensure(isinstance(f.get('name'),str) and isinstance(f.get('entryMessage'),str),name,'invalid text')
    for k in ['naturePower','secretPower']:reference('moves',f[k],name+'/'+k)
    for m in f['statusBuffs']+f['statusNerfs']:reference('moves',m,name+'/highlight')
    for data in [f,f.get('overlay')]:
        if data is None:continue
        for m,v in data['moves'].items():
            count['moves']+=1;reference('moves',m,name+'/'+m)
            if 'multiplier' in v:ensure(number(v['multiplier']) and v['multiplier']>=0,name+'/'+m,'invalid multiplier')
            if 'accuracy' in v:ensure(number(v['accuracy']) and 0<=v['accuracy']<=100,name+'/'+m,'invalid accuracy')
            if 'transition' in v:
                count['transitions']+=1;t=v['transition'];ensure(t['field'] in fields,name+'/'+m,'invalid transition');check_condition(t['condition'],name+'/'+m);check_actions(t.get('after',[]),name+'/'+m)
            check_actions(v.get('after',[]),name+'/'+m)
        for t in data['types']:
            check_condition(t['match'],name+'/type');check_condition(t['condition'],name+'/type');check_actions(t.get('after',[]),name+'/type')
    for r in f['rules']:
        count['rules']+=1;ensure(r['event'] in events,name,'unknown event');check_condition(r['condition'],name+'/'+r['event']);check_actions(r['actions'],name+'/'+r['event'])
    for abilityId,callbacks in f.get('suppressedAbilityCallbacks',{}).items():
        reference('abilities',abilityId,name+'/suppressedCallback')
        ensure(callbacks in [['onTryHit'],['onImmunity']],name,'invalid suppressed callback')
    for row in f.get('typeChart',[]):
        ensure(row['attackType'] in types|{'*'} and row['defenseType'] in types|{'*'},name,'invalid type chart key')
        ensure(row['value'] in [-1,0,1,'immune'],name,'invalid type chart value')
        check_condition(row['condition'],name+'/typeChart')
    check_actions(f.get('seedActions',[]),name+'/seed')
    if 'clockPolicy' in f:ensure(set(f['clockPolicy'])-{'pausedConditions'}=={'pauseOverlay','source'} and isinstance(f['clockPolicy']['pauseOverlay'],bool) and ('pausedConditions' not in f['clockPolicy'] or (isinstance(f['clockPolicy']['pausedConditions'],list) and f['clockPolicy']['pausedConditions'] and all(k in ['trickroom','gravity','wonderroom','magicroom'] for k in f['clockPolicy']['pausedConditions']))),name,'invalid clock policy')
    for key,row in f.get('entryWishes',{}).items():
        ensure(key in ['healingwish','lunardance'] and set(row)=={'boosts','message','source'} and isinstance(row['message'],str) and row['message'] and isinstance(row['source'],str) and isinstance(row['boosts'],dict) and row['boosts'] and all(k in ['atk','def','spa','spd','spe'] and integer(n,1,6) for k,n in row['boosts'].items()),name,'invalid entry wish')
    if 'silentVolatileEnds' in f:ensure(isinstance(f['silentVolatileEnds'],list) and f['silentVolatileEnds'] and all(k in ['slowstart'] for k in f['silentVolatileEnds']),name,'invalid silent volatile end')
    if 'seed' in f:reference('items',f['seed']['item'],name+'/seed')
mapping=read(DATA/'mappings/modpack.json')['rules'];known=read(ROOT/'research/biome-inventory.json')
for r in mapping:ensure(r['field'] in fields,'mapping','unknown field');ensure(set(r)<=set('biome tag dimension submerged maxY skyVisible minDepth field reason'.split()),'mapping','unknown predicate')
explicit={r['biome'] for r in mapping if 'biome' in r};ensure(set(known)<=explicit,'mapping','unmapped detected biomes')
structures=[]
for p in sorted((DATA/'structures').glob('*.json')):
    doc=read(p);ensure(doc.get('schemaVersion')==1,'structures/'+p.name,'unsupported schema')
    for r in doc['rules']:
        where='structures/'+p.name
        ensure(isinstance(r,dict) and set(r)<={'structure','tag','field','reason'} and r.get('field') in fields,where,'invalid structure mapping')
        ensure(('structure' in r)!=('tag' in r),where,'a structure mapping names exactly one structure or tag')
        ensure(re.fullmatch(r'[a-z0-9_.-]+:[a-z0-9_./-]+',r.get('structure',r.get('tag','')) or '') is not None,where,'invalid structure identifier')
        structures.append(r)
ensure(any(r.get('submerged') is True for r in mapping),'mapping','missing underwater stage')
unavailable={kind:{v:locations for v,locations in values.items() if v not in registry[kind] and not (kind=='items' and v in items)} for kind,values in refs.items()}
write(ROOT/'research/reference-validation.json',{'unavailable':unavailable,'counts':{kind:len(values) for kind,values in refs.items()},'reason':'Rejuvenation-specific or misspelled IDs absent from installed Showdown base. These rules cannot trigger until a compatible definition is registered.'})
trainers={}
for p in sorted((DATA/'trainers').glob('*.json')):
    for tid,row in read(p)['trainers'].items():
        where='trainers/'+p.name+'/'+tid
        ensure(tid not in trainers,where,'duplicate trainer field')
        ensure(re.fullmatch(r'[a-z0-9_.-]+',tid) is not None and isinstance(row,dict) and set(row)<={'field','winShare','indoorWinShare'}
               and row.get('field') in fields and row.get('field')!='rejuvenation:indoor',where,'invalid trainer field')
        for k in ['winShare','indoorWinShare']:
            if k in row:ensure(isinstance(row[k],(int,float)) and not isinstance(row[k],bool) and 0<=row[k]<=1,where,'invalid trainer score')
        trainers[tid]=row
catalog={'fields':fields,'mappings':mapping,'structures':structures,'items':items,'abilities':abilities,'trainers':trainers,'default':'rejuvenation:indoor'}
write(ROOT/'research/catalog.json',catalog)
write(ROOT/'research/test-results/datapack-validation.json',{'errors':errors,'fields':len(fields),'biomes':len(known),'explicitBiomes':len(explicit),'counts':count,'unavailableCounts':{k:len(v) for k,v in unavailable.items()}})
if errors:
    print('\n'.join(errors));sys.exit(1)
print(f"Validated {len(fields)} fields, {count['rules']} rules, {count['moves']} move entries, {count['transitions']} transitions and {len(known)} explicit biomes")
print('Unavailable source IDs (reported, never aliased silently):', {k:len(v) for k,v in unavailable.items()})
