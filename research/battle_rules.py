"""Battle.rb audit: entry hazards, Wasteland's hazard eruption and the small battle-flow field checks."""
def extend(fields,rule,action,both):
    neg=lambda c:{'not':c}
    ability=lambda who,*ids:{'ability':{'who':who,'values':list(ids)}}
    def policy(sym):return fields[sym].setdefault('hazardPolicy',{'source':'Battle.rb:3175-3268'})
    # Spikes and Toxic Spikes cannot rest on water or air, nor a web in the sky (3176, 3251, 3260).
    for sym in ['WATERSURFACE','MURKWATERSURFACE']:policy(sym)['cleared']=['spikes','toxicspikes']
    policy('SKY')['cleared']=['spikes','stickyweb','toxicspikes']
    # Wasteland holds hazards back and erupts them at the end of the round instead (3177, 3198, 3252, 3261).
    policy('WASTELAND')['suspended']=True
    policy('ELECTERRAIN')['spikes']={'type':'Electric','affectsAirborne':True,'message':'{1} was hurt by the electrified spikes!'}
    policy('CRYSTALCAVERN')['stealthrock']={'cycleTypes':['Fire','Water','Grass','Psychic'],'message':'Crystallized stones dug into {1}!'}
    for sym in ['VOLCANICTOP','INFERNAL','DRAGONSDEN']:policy(sym)['stealthrock']={'type':'Fire','message':'Molten stones dug into {1}!'}
    policy('CORRUPTED')['stealthrock']={'type':'Poison','message':'Corrupted stones dug into {1}!'}
    for sym in ['ROCKY','CAVE']:policy(sym)['stealthrock']={'multiplier':2}
    policy('FOREST')['stickyweb']={'stages':-2}
    policy('CORROSIVE')['toxicspikes']={'keepOnPoisonType':True}
    rule('CORROSIVE','pokemonEntry',both({'grounded':{'who':'user','value':True}},neg({'type':{'who':'user','value':'Poison'}}),neg({'type':{'who':'user','value':'Steel'}}),
        neg({'item':{'who':'user','values':['heavydutyboots']}}),neg(ability('user','magicguard','poisonheal','immunity','wonderguard','toxicboost','pastelveil'))),
        [action('typedDamage',type='Poison',fraction=.25,message='{1} was seared by the corrosion!')],'Battle.rb:3231-3242')
    rule('WASTELAND','fieldResidual',{'always':True},[
        action('hazardBurst',id='stealthrock',messages=['The waste swallowed up the pointed stones!','...Rocks spewed out from the ground below!'],type='Rock',fraction=.25),
        action('hazardBurst',id='spikes',messages=['The waste swallowed up the spikes!','...Stalagmites burst up from the ground!'],fraction=1/3,perLayer=True,grounded=True),
        action('hazardBurst',id='toxicspikes',messages=['The waste swallowed up the poison spikes!','...Poison needles shot up from the ground!'],fraction=.125,perLayer=True,grounded=True,immuneTypes=['Steel','Poison'],poison=True),
        action('hazardBurst',id='stickyweb',messages=['The waste swallowed up the sticky web!','...Sticky string shot out of the ground!'],boosts={'spe':-4})],'Battle.rb:7007-7100')
    fields['STARLIGHT']['priorityBlockingAbilities']=['mirrorarmor']
    fields['HOLY']['revivalBlessing']={'fraction':.75,'source':'Battle.rb:2054-2056'}
    # Burn Up's lost Fire type returns at the end of the round on the burning fields (5340-5344).
    rule('VOLCANIC INFERNAL','afterMove',both({'move':'burnup'},{'missed':False}),[action('setPokemonFlag',id='burnup',value=True)],'Battle_MoveEffects.rb:7802-7806')
    rule('VOLCANIC INFERNAL','residual',{'pokemonFlag':{'who':'user','id':'burnup','value':True}},[action('restoreTypes'),action('setPokemonFlag',id='burnup',value=False)],'Battle.rb:5340-5344')
    fields['GLITCH']['volatileMoveLocks']={'rage':{'move':'rage','source':'Battle.rb:1260,4658-4668'}}
    # Quick Draw's activation also marks the holder for a certain critical hit in the Colosseum (1538; Battle_Move.rb:984).
    drawn=both(ability('user','quickdraw'),{'value':{'op':'>','value':0}})
    rule('COLOSSEUM','fractionalPriority',drawn,[action('setPokemonFlag',id='quickdrawsnipe',value=True)],'Battle.rb:1536-1538')
    rule('COLOSSEUM','fractionalPriority',neg(drawn),[action('setPokemonFlag',id='quickdrawsnipe',value=False)],'Battle.rb:5351')
    rule('COLOSSEUM','criticalRatio',both(ability('user','quickdraw'),{'pokemonFlag':{'who':'user','id':'quickdrawsnipe','value':True}}),[action('set',value=4)],'Battle_Move.rb:984')
    # pbCanSwitch? (1723-1747)
    ghost={'type':{'who':'user','value':'Ghost'}}
    foes=lambda *ids:{'sideAbility':{'who':'target','values':list(ids)}}
    rule('DIMENSIONAL','trapPokemon',both(ghost,foes('shadowtag'),{'foe':True},neg(ability('user','shadowtag'))),[action('trap',force=True)],'Battle.rb:1728,1744')
    rule('INFERNAL','trapPokemon',both({'pokemonStatus':'slp'},foes('baddreams'),{'foe':True},neg(ghost)),[action('trap')],'Battle.rb:1732')
    shadowed=both(ghost,{'field':fields['DIMENSIONAL']['id']},foes('shadowtag'),{'foe':True})
    rule('DIMENSIONAL FROZENDIMENSION','trapPokemon',both({'volatile':{'who':'user','id':'embargo'}},{'any':[neg(ghost),shadowed]}),[action('trap',force=True)],'Battle.rb:1728,1738')
    # Soul Dew on the dimensional fields (Battle_Move.rb:764,1532). PBStuff::DimensionalFields misspells the Frozen Dimension, which is therefore not included.
    def latis(who):return {'any':[{'species':{'who':who,'value':s}} for s in ['latias','latios']]}
    for sym in ['DIMENSIONAL','INFERNAL','DEUXFINALIS']:
        fields[sym]['effectivenessOverrides']=[{'condition':both({'any':[{'moveType':'Dark'},{'moveType':'Ghost'}]},{'item':{'who':'target','values':['souldew']}},latis('target')),'value':-1,'source':'Battle_Move.rb:762-765'}]
    for event in ['attack','specialAttack']:
        rule('DIMENSIONAL INFERNAL DEUXFINALIS',event,both({'moveType':'Dark'},{'item':{'who':'user','values':['souldew']}},latis('user')),[action('multiply',value=1.5)],'Battle_Move.rb:1532')
    end_of_round(fields,rule,action,both)

def end_of_round(fields,rule,action,both):
    """pbEndOfRoundPhase branches (Battle.rb:5438-7370)."""
    neg=lambda c:{'not':c}
    anyof=lambda *c:{'any':list(c)}
    ability=lambda *ids:{'ability':{'who':'user','values':list(ids)}}
    typed=lambda t:{'type':{'who':'user','value':t}}
    vol=lambda v:{'volatile':{'who':'user','id':v}}
    grounded={'grounded':{'who':'user','value':True}}
    fid=lambda sym:fields[sym]['id']
    def handler(syms,aid,callback,actions,source,condition=None):
        for sym in syms.split():fields[sym].setdefault('abilityHandlers',{}).setdefault(aid,{})[callback]={'mode':'replace','condition':condition or {'always':True},'actions':actions,'source':source}
    # Weather damage
    rule('FROZENDIMENSION','receivedDamage',{'damageSource':['solarpower']},[action('reject')],'Battle.rb:5446')
    rule('DESERT','receivedDamage',{'damageSource':['sandstorm']},[action('setHPFraction',fraction=1/8)],'Battle.rb:5530')
    rule('FROZENDIMENSION','receivedDamage',{'damageSource':['hail']},[action('setHPFraction',fraction=1/8)],'Battle.rb:5549')
    # Extremely harsh sunlight keeps the Volcanic Top erupting, and an eruption sweeps the hazards away.
    eruption=[r for r in fields['VOLCANICTOP']['rules'] if r['event']=='residual' and 'stateFlag' in str(r['condition'])]
    fields['VOLCANICTOP']['rules'].append({'event':'fieldResidual','condition':{'weather':['desolateland']},'actions':[action('arm_eruption')],'source':'Battle.rb:5834'})
    fields['VOLCANICTOP']['rules'].append({'event':'fieldResidual','condition':{'stateFlag':'eruption'},'actions':[action('clearHazards',message='The eruption removed all hazards from the field!')],'source':'Battle.rb:6257-6278'})
    assert eruption
    # Shed Skin always sheds in the Dragon's Den and renews its holder.
    status=anyof(*[{'pokemonStatus':s} for s in ['psn','tox','brn','par','slp','frz','ptr']])
    handler('DRAGONSDEN','shedskin','onResidual',[action('abilityMessage'),action('cureStatus'),action('message',text="{1}'s scaled sheen glimmers brightly!"),
        action('heal',fraction=.25),action('boost',stats={'spe':1,'spa':1,'def':-1,'spd':-1})],'Battle.rb:6286-6298',status)
    # Poison Heal feeds on the polluted fields without being poisoned. The rule leads the list so the field has not yet poisoned the holder.
    healthy=both(ability('poisonheal'),neg({'pokemonStatus':'psn'}),neg({'pokemonStatus':'tox'}))
    for syms,extra in [('CORROSIVEMIST CORRUPTED',[]),('CORROSIVE MURKWATERSURFACE WASTELAND',[grounded])]:
        for sym in syms.split():fields[sym]['rules'].insert(0,{'event':'residual','condition':both(healthy,*extra),'actions':[action('heal',fraction=1/8,message='{1} was healed by the poison!')],'source':'Battle.rb:6491-6497'})
    rule('DEUXFINALIS','residual',ability('gluttony'),[action('heal',fraction=1/16,message='{1} started devouring its surroundings!')],'Battle.rb:6503-6509')
    rule('DEUXFINALIS','residual',ability('purifyingsalt'),[action('heal',fraction=1/16,message='{1} repaired itself using the surrounding salt!')],'Battle.rb:6515-6521')
    rule('ICY','receivedDamage',{'damageSource':['brn']},[action('setHPFraction',fraction=1/32)],'Battle.rb:6530')
    # Sleeping on a hostile field
    asleep=anyof({'pokemonStatus':'slp'},ability('comatose'))
    guarded=neg(ability('magicguard'))
    def nightmare(sym,text,fraction=1/16,*extra):rule(sym,'residual',both(asleep,guarded,{'field':fid(sym)},*extra),[action('damage',fraction=fraction,message=text)],'Battle.rb:6558-6574')
    nightmare('SWAMP',"{1}'s strength is sapped by the swamp!",1/16,neg(vol('partiallytrapped')))
    nightmare('SWAMP',"{1}'s strength is sapped by the swamp!",1/8,vol('partiallytrapped'))
    nightmare('DIMENSIONAL',"{1}'s dream is corrupted by the dimension!")
    nightmare('HAUNTED',"{1}'s dream is corrupted by the evil spirits!",1/16,neg(typed('Ghost')))
    nightmare('BEWITCHED',"{1}'s dream is corrupted by the evil in the woods!")
    nightmare('CORROSIVE','{1} is seared by the corrosion!',1/16,grounded,neg(typed('Steel')),neg(typed('Poison')),neg(ability('poisonheal','toxicboost','wonderguard','immunity','pastelveil')))
    rule('RAINBOW','residual',both(asleep,{'field':fid('RAINBOW')}),[action('heal',fraction=1/16,message='{1} recovered health in its peaceful sleep!')],'Battle.rb:6577-6580')
    # Curse, Salt Cure and Heal Block. Salt Cure uses the source's pre-Champions
    # Holy divisor (6, halved to 3 for Water/Steel) by project decision.
    rule('HOLY','receivedDamage',{'damageSource':['curse']},[action('reject')],'Battle.rb:6589-6591')
    rule('HOLY','residual',vol('curse'),[action('removeVolatile',id='curse',message="{1}'s curse was lifted!")],'Battle.rb:6589-6591')
    brine={'any':[{'type':{'who':'target','value':'Steel'}},{'type':{'who':'target','value':'Water'}}]}
    rule('HOLY DEUXFINALIS','receivedDamage',both({'damageSource':['saltcure']},neg(brine)),[action('setHPFraction',fraction=1/6)],'Battle.rb:6607-6609')
    rule('HOLY DEUXFINALIS','receivedDamage',both({'damageSource':['saltcure']},brine),[action('setHPFraction',fraction=1/3)],'Battle.rb:6607-6609')
    rule('DIMENSIONAL FROZENDIMENSION INFERNAL','residual',both(vol('healblock'),guarded),[action('damage',fraction=1/16,message="{1}'s Heal Block is draining its health!")],'Battle.rb:6613-6627')
    # Room clocks stand still in the Frozen Dimension.
    fields['FROZENDIMENSION']['clockPolicy']['pausedConditions']=['trickroom','gravity','wonderroom','magicroom']
    fields['FROZENDIMENSION']['clockPolicy']['source']='Battle.rb:6920-6961,7001-7005'
    # End-of-round abilities
    handler('RAINBOW','baddreams','onResidual',[],'Battle.rb:7128')
    rule('INFERNAL','receivedDamage',{'damageSource':['baddreams']},[action('setHPFraction',fraction=1/4)],'Battle.rb:7138')
    handler('FLOWERGARDEN2 FLOWERGARDEN3 FLOWERGARDEN4 FLOWERGARDEN5 GRASSY','harvest','onResidual',[action('harvestBerry')],'Battle.rb:7245-7254')
    rule('ELECTERRAIN','residual',both(ability('slowstart'),vol('slowstart'),{'field':fid('ELECTERRAIN')}),[action('volatileDuration',id='slowstart',amount=-1,minimum=1)],'Battle.rb:7295')
    fields['DEEPEARTH']['silentVolatileEnds']=['slowstart']
    # Healing Wish and Lunar Dance
    for sym in ['FAIRYTALE','STARLIGHT']:fields[sym].setdefault('entryWishes',{})['healingwish']={'boosts':{'atk':1,'spa':1},'message':'The healing wish came true for {1}!','source':'Battle.rb:8002-8014'}
    for sym,stats in [('STARLIGHT',['atk','spa']),('NEWWORLD',['atk','def','spa','spd','spe']),('BIGTOP',['atk','def','spa','spd','spe'])]:
        fields[sym].setdefault('entryWishes',{})['lunardance']={'boosts':{s:1 for s in stats},'message':'{1} became cloaked in mystical moonlight!','source':'Battle.rb:8016-8031'}
