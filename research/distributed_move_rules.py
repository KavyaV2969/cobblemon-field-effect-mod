"""Further ordinary distributed move branches; Crests/custom moves are excluded."""
def extend(fields,rule,action,both):
    def move(syms,mid,acts,line):rule(syms,'modifyMove',{'move':mid},acts,'Battle_MoveEffects.rb:'+str(line))
    def prop(path,value,remove=None):
        row=action('moveProperty',path=path,value=value)
        if remove:row['removeCallback']=remove
        return row
    def hit(syms,mid,acts,line):move(syms,mid,[action('moveBehavior',recipe='appendHitActions',actions=acts)],line)
    hit('SWAMP','attackorder',[action('randomStat',who='target',stats=['atk','def','spa','spd','spe'],amount=-1)],109)
    rule('CHESS','modifyMove',both({'move':'falsesurrender'},
         {'not':{'effectiveAbility':{'who':'target','values':['oblivious']}}},
         {'not':{'sideAbility':{'who':'target','values':['aromaveil']}}}),
         [action('moveBehavior',recipe='appendHitActions',actions=[action('volatile',id='taunt',who='target')])],
         'Battle_MoveEffects.rb:113-119')
    fields['CHESS']['conditionDurations']['taunt']={'duration':4,'sourceMoves':['falsesurrender'],'source':'Battle_MoveEffects.rb:115'}
    move('WATERSURFACE','splash',[action('moveBehavior',recipe='otherActiveHitActions',
         actions=[action('boost',stats={'accuracy':-1},who='target')],failureMessage='But nothing happened!')],136)
    move('ELECTERRAIN','wildcharge',[prop('recoil',None)],123)
    move('WATERSURFACE UNDERWATER','wavecrash',[prop('recoil',[1,4])],125)
    move('VOLCANICTOP BACKALLEY CITY','poisongas',[prop('status','tox')],231)
    move('BACKALLEY CITY','smog',[prop('secondaries.0.status','tox')],254)
    force={'condition':{'any':[
        {'ability':{'who':'target','values':['poisonheal','toxicboost']}},
        both({'any':[{'type':{'who':'target','value':'Poison'}},{'type':{'who':'target','value':'Steel'}}]},
             {'not':{'ability':{'who':'user','values':['corrosion']}}}),
        {'effectiveAbility':{'who':'target','values':['immunity']}}]},'status':'psn'}
    for mid,line in [('gunkshot',239),('sludgebomb',239),('sludgewave',239),('sludge',239),('octazooka',1516)]:
        move('WASTELAND',mid,[action('moveBehavior',recipe='randomStatusSecondary',
             values=['brn','frz','par','psn'],force=force)],line)
    rule('WASTELAND','modifyMove',both({'move':'aciddownpour'},
         {'not':{'effectiveAbility':{'who':'target','values':['shielddust']}}},
         {'not':{'item':{'who':'target','values':['covertcloak']}}}),
         [action('moveBehavior',recipe='appendHitActions',callback='onAfterHit',
             actions=[action('randomStatus',who='target',values=['brn','frz','par','psn'],force=force)])],
         'Battle_ZMove.rb:245-259')
    hit('BIGTOP','teeterdance',[action('boost',stats={'def':-1},who='target')],565)
    hit('BIGTOP','bellydrum',[action('boost',stats={'def':1,'spd':1})],1260)
    for mid,stats,line in [('flatter',{'spa':2},1324),('swagger',{'atk':3},1343)]:
        move('COLOSSEUM',mid,[prop('boosts',stats)],line)
    move('HAUNTED','bittermalice',[prop('secondaries.0.boosts',{'atk':-1,'spa':-1})],1372)
    move('ICY SNOWYMOUNTAIN','bittermalice',[action('moveBehavior',recipe='appendSecondaryActions',actions=[action('conditional',condition={'chance':{'numerator':1,'denominator':10}},
         actions=[action('status',status='frz',who='target')])])],1374)
    # Replace dynamic callbacks instead of stacking a second power multiplier.
    for syms,mids,power,line in [
        ('CONCERT4',['return','frustration'],102,2962),
        ('CONCERT4',['eruption','waterspout','dragonenergy'],150,2986),
        ('DEEPEARTH CONCERT4',['wringout','crushgrip'],120,3000),
        ('DEEPEARTH CONCERT4',['hardpress'],100,3000),
        ('DEEPEARTH CONCERT4',['gyroball'],150,3012)]:
        for mid in mids:move(syms,mid,[prop('basePower',power,'basePowerCallback')],line)
    move('FROZENDIMENSION','powertrip',[action('moveBehavior',recipe='boostStagePower',base=40)],3029)
    rule('NEWWORLD','modifyMove',{'move':'guardianofalola'},[action('moveBehavior',recipe='fixedDamage',basis='targetMaxHP',factor=.75)],'Battle_ZMove.rb:359')
    rule('PSYTERRAIN','modifyMove',{'move':'shatteredpsyche'},
         [action('moveBehavior',recipe='appendHitActions',actions=[action('volatile',id='confusion',who='target',message='The field got too weird for {1}!')])],'Battle_ZMove.rb:281')
    for sym in fields:
        if sym not in ['GRASSY','FOREST'] and not sym.startswith('FLOWERGARDEN'):
            rule(sym,'modifyMove',{'move':'bloomdoom'},[action('moveBehavior',recipe='appendHitActions',actions=[action('createField',field='rejuvenation:grassy_terrain',duration=3,extendedBy=0,blockEverstone=False)])],'Battle_ZMove.rb:269')
    for syms,mids in [('CITY',['conversion','happyhour','celebrate']),('BACKALLEY',['conversion'])]:
        for mid in mids:rule(syms,'modifyMove',{'move':mid},[prop('zMove.boost',dict.fromkeys(['atk','def','spa','spd','spe'],2))],'Battle_ZMove.rb:113')
    for mids,power,line in [(['naturalgift'],100,3224),(['trumpcard','flail','reversal'],200,3246),
                           (['electroball'],150,3281),(['lowkick','grassknot','heavyslam','heatcrash'],120,3292),
                           (['fling'],130,6041),(['spitup'],300,6681)]:
        for mid in mids:move('CONCERT4',mid,[action('moveBehavior',recipe='forceBasePower',base=power)],line)
    for sym in ['DIMENSIONAL','FROZENDIMENSION']:
        move(sym,'rage',[prop('basePower',60),prop('self',{'boosts':{'atk':1}})],3103)
    move('DEEPEARTH','heavyslam',[action('moveBehavior',recipe='weightRatioPower',multiplier=2)],3313)
    move('DEEPEARTH','heatcrash',[action('moveBehavior',recipe='weightRatioPower',multiplier=2)],3313)
    for mid,stat in [('trick','spa'),('switcheroo','atk')]:
        hit('BACKALLEY',mid,[action('transferStat',stat=stat,amount=1)],5912)
    hit('CITY','recycle',[action('randomStat',stats=['atk','def','spa','spd','spe'],amount=1,message='Reduce, reuse, recycle!')],6016)
    move('CHESS','allyswitch',[action('moveBehavior',recipe='appendHitActions',silentCommands=['swap'],actions=[action('castling',userStats={'def':1,'spd':1},partnerStats={'atk':1,'spa':1},message='{1} castled with {2}!')])],6172)
    hit('UNDERWATER','whirlpool',[action('volatile',id='confusion',who='target')],5013)
    move('WASTELAND','swallow',[action('moveBehavior',recipe='swallow',fractions=[.5,1,1],cureAt=3)],6711)
    move('MISTY','aromaticmist',[prop('boosts',{'spd':2})],7208)
    move('ELECTERRAIN DEEPEARTH','eerieimpulse',[prop('boosts',{'spa':-3})],7222)
    # Shipped source checks the user's stages, then lowers the target's stages.
    # Its switch is permitted even when the target's loss is blocked or capped.
    for syms,stats in [('FROZENDIMENSION',{'atk':-1,'spa':-1,'spe':-1}),('CONCERT1 CONCERT2 CONCERT3 CONCERT4 BACKALLEY',{'atk':-2,'spa':-2})]:
        move(syms,'partingshot',[action('moveBehavior',recipe='gatedStatChanges',stats=stats,gateStats=dict.fromkeys(stats,-1),gateWho='user',selfSwitch=True,failureMessage="{1}'s stats can't be lowered!")],7244)
    for syms,mid,line in [('STARLIGHT DEEPEARTH','geomancy',7276),('STARLIGHT NEWWORLD','meteorbeam',8840),('ELECTERRAIN','electroshot',9783)]:
        rule(syms,'chargeMove',{'move':mid},[action('reject')],'Battle_MoveEffects.rb:'+str(line))
    hit('FOREST FAIRYTALE BEWITCHED','forestscurse',[action('volatile',id='curse',who='target')],7415)
    move('FAIRYTALE','craftyshield',[action('moveBehavior',recipe='appendHitActions',callback='onHitSide',
         actions=[action('boost',stats={'def':1,'spd':1}),action('message',text='{1} boosted its defenses with the shield!')])],7545)
    hit('ELECTERRAIN','electrify',[action('type',type='Electric',who='target')],7639)
    move('DEUXFINALIS','purify',[action('moveBehavior',recipe='purify',stats={'def':1,'spd':1},fraction=.5)],8019)
    hit('BIGTOP','spotlight',[action('boost',stats={'atk':1,'spa':1}),action('boost',stats={'atk':1,'spa':1},who='target')],8187)
    move('DEUXFINALIS DRAGONSDEN','scaleshot',[prop('self',{'boosts':{'spe':1}})],8824)
    move('CHESS','poltergeist',[action('removeCallbacks',callbacks=['onTry','onTryHit','onPrepareHit'])],8968)
    hit('BACKALLEY CITY CORROSIVEMIST','corrosivegas',[action('boost',who='target',stats=dict.fromkeys(['atk','def','spa','spd','spe'],-1))],9013)
    move('DRAGONSDEN','ficklebeam',[action('moveBehavior',recipe='randomPowerCallback',numerator=5,denominator=10,base=80,boosted=160,activation='Fickle Beam All Out')],9852)
    
    for sym in ['FLOWERGARDEN1','FLOWERGARDEN2','FLOWERGARDEN3','FLOWERGARDEN4','FLOWERGARDEN5','DEEPEARTH']:
        rule(sym,'modifyMove',{'move':'rototiller'},[action('moveBehavior',recipe='allActiveHitActions',
             condition={'any':[both({'type':{'who':'target','value':'Grass'}},{'grounded':{'who':'target','value':True}})] + ([{'samePokemon':True}] if sym.startswith('FLOWERGARDEN') else [])},
             actions=[action('boost',who='target',stats={'atk':2,'spa':2})])],'Battle_MoveEffects.rb:7585-7593')
    for sym in ['FLOWERGARDEN2','FLOWERGARDEN3','FLOWERGARDEN4','FLOWERGARDEN5','FAIRYTALE']:
        amount=2 if sym in ['FLOWERGARDEN3','FLOWERGARDEN4','FLOWERGARDEN5'] else 1
        move(sym,'flowershield',[action('moveBehavior',recipe='allActiveHitActions',
             condition={'any':[{'type':{'who':'target','value':'Grass'}},{'samePokemon':True}]},
             actions=[action('conditional',condition={'samePokemon':True} if sym=='FAIRYTALE' else {'always':True},
                    actions=[action('boost',who='target',stats={'def':amount,'spd':amount})])] +
                    ([action('conditional',condition={'not':{'samePokemon':True}},actions=[action('boost',who='target',stats={'def':1})])] if sym=='FAIRYTALE' else []))],7560)

    rule('ELECTERRAIN','modifyMove',{'move':'mudsport'},[action('moveBehavior',recipe='appendHitActions',callback='onHitField',actions=[action('changeField',field='rejuvenation:indoor',duration=5,force=True,boundCondition='mudsport',message='The hyper-charged terrain shorted out!')])],'Battle_MoveEffects.rb:3357-3361')
    for sym in ['VOLCANIC','VOLCANICTOP']:
        fields[sym]['rampagePolicy']={'noConfusionMoves':['ragingfury'],'source':'Battle_MoveEffects.rb:5053-5062'}
    fields['VOLCANICTOP']['rampagePolicy']['duration']=1
    move('SKY','mirrormove',[action('moveBehavior',recipe='beforeCalledMoveActions',callback='onTryHit',actions=[action('boost',stats={'atk':1,'spa':1,'spe':1})])],3819)
    from pathlib import Path
    import json
    calling=json.loads((Path(__file__).parent/'calling-pools.json').read_text())
    move('GLITCH','metronome',[action('moveBehavior',recipe='randomMovePool',minimumPower=70,choices=calling['glitchMetronome'])],4049)
    move('CONCERT1 CONCERT2 CONCERT3 CONCERT4','roar',[action('moveBehavior',recipe='concertRoar',stats={'atk':2})],5647)
    rule('SWAMP','tryMove',{'move':'roar'},[action('message',text="What are ya doin' in my swamp?!")],'Battle_MoveEffects.rb:5639')
    fields['SWAMP']['customVolatiles']={'rejuvenationswampweb':{'actions':[action('randomStat',who='target',stats=['atk','def','spa','spd','spe'],amount=-1)],'source':'Battle_MoveEffects.rb:5785-5786; Battle.rb:5939-5942; Battler.rb:738-740'}}
    fields['SWAMP']['customVolatiles']['rejuvenationswampwebsource']={'actions':[],'source':'Battler.rb:738-740'}
    hit('SWAMP','spiderweb',[action('volatile',id='rejuvenationswampweb',who='target',linkedStatus='rejuvenationswampwebsource')],5785)
    move('BEWITCHED','strengthsap',[action('moveBehavior',recipe='strengthSap',stats={'atk':-1,'spa':-1})],8225)
    # The source checks canHeal? per target before its effect handler. Its
    # defensive noHeal branches inside that handler do not bypass this gate.
    for sym in ['RAINBOW','HOLY','WATERSURFACE','CORROSIVEMIST','MURKWATERSURFACE']:
        fields[sym]['rules']=[r for r in fields[sym]['rules'] if not (r['event']=='modifyMove' and r['condition']=={'move':'lifedew'})]
        acts=[]
        if sym in ['CORROSIVEMIST','MURKWATERSURFACE']:acts=[action('status',who='target',status='psn')]
        if sym=='WATERSURFACE':acts=[action('conditional',condition={'samePokemon':True},actions=[action('volatile',id='aquaring',who='target')])]
        move(sym,'lifedew',[action('moveBehavior',recipe='targetHealing',fraction=.5 if sym=='HOLY' else .25,userFraction=.5 if sym in ['RAINBOW','HOLY'] else .25,actions=acts)],8674)
    for sym in ['ELECTERRAIN','DEEPEARTH']:
        flux={'always':True} if sym=='ELECTERRAIN' else {'ability':{'who':'target','values':['plus','minus']}}
        high={'always':True} if sym=='DEEPEARTH' else {'ability':{'who':'target','values':['plus','minus']}}
        move(sym,'magneticflux',[action('moveBehavior',recipe='alliesHitActions',condition=flux,actions=[action('conditional',condition=high,actions=[action('boost',who='target',stats={'def':2,'spd':2})])]+([action('conditional',condition={'not':high},actions=[action('boost',who='target',stats={'def':1,'spd':1})])] if sym=='ELECTERRAIN' else []))],7475)

    fields['PSYTERRAIN']['rules']=[r for r in fields['PSYTERRAIN']['rules'] if not (r['event']=='afterMove' and r['condition']=={'move':'kinesis'})]
    move('PSYTERRAIN','kinesis',[action('moveBehavior',recipe='dualBoost',targetStats={'accuracy':-2},userStats={'atk':2,'spa':2})],1492)
