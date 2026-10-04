"""Reviewed move callbacks outside the compiled field tables.

Source: Battle_MoveEffects.rb, supplied Rejuvenation 14.0.14 installation.
Only mechanics are extracted; no original scripts are distributed.
"""
def extend(fields,rule,action,both):
    for f in fields.values():
        f['captureEnvironmentModifiers']=[
            {'ball':'cobblemon:dive_ball','predicate':'underwater','multiplier':3.5,'source':'Balls.rb:143'},
            {'ball':'cobblemon:dusk_ball','predicate':'night','multiplier':3.5,'source':'Balls.rb:166; Time.rb:269'}]
    for sym in ['WATERSURFACE','UNDERWATER']:
        fields[sym].setdefault('captureModifiers',{})['cobblemon:dive_ball']=3.5
    for sym in ['DARKCRYSTALCAVERN','SHORTCIRCUIT','UNDERWATER','CAVE','CRYSTALCAVERN','DRAGONSDEN','STARLIGHT','NEWWORLD','INVERSE']:
        fields[sym].setdefault('captureModifiers',{})['cobblemon:dusk_ball']=3.5
    for form,stats,message in [('Blade',{'atk':1,'def':-1},'Changed to Blade Forme!'),('',{'atk':-1,'def':1},'Changed to Shield Forme!')]:
        rule('FAIRYTALE CHESS','formChange',both({'species':{'who':'user','value':'aegislash'}},
             {'ability':{'who':'user','values':['stancechange']}},{'formName':{'who':'user','value':form}}),
             [action('message',text=message),action('boost',stats=stats)],'Battler.rb:1696-1701')
    def move(syms,mid,actions,line):
        rule(syms,'modifyMove',{'move':mid},actions,'Battle_MoveEffects.rb:'+str(line))
    def hit(syms,mid,actions,line):
        move(syms,mid,[action('moveBehavior',recipe='appendHitActions',actions=actions)],line)
    move('HAUNTED','destinybond',[action('moveBehavior',recipe='refreshVolatileBeforeHit',id='destinybond')],5563)
    rule('GLITCH','modifyMove',both({'move':'rest'},{'sourceMove':'sleeptalk'},{'pokemonStatus':'slp'}),
         [action('moveBehavior',recipe='reapplyStatusHeal',status='slp',duration=3,fraction=1,
                 message='{1} slept and restored its HP!')],'Battle_MoveEffects.rb:5266-5294')
    move('NEWWORLD','heartswap',[action('moveBehavior',recipe='shareHP',message='The battlers shared their pain!')],1777)
    hit('ASHENBEACH','psychup',[action('cureStatus')],1799)
    hit('PSYTERRAIN','psychup',[action('boost',stats={'spa':2})],1802)
    hit('PSYTERRAIN','mindreader',[action('boost',stats={'spa':2})],3641)
    hit('HOLY FAIRYTALE PSYTERRAIN','miracleeye',[action('boost',stats={'spa':2})],3682)
    move('RAINBOW','weatherball',[action('moveProperty',path='basePower',value=100)],2914)
    rule('SKY','modifyMove',both({'move':'weatherball'},{'weather':['deltastream']}),
         [action('moveProperty',path='basePower',value=100),action('moveType',type='Flying')],
         'Battle_MoveEffects.rb:2914-2927')
    move('HAUNTED','curse',[action('moveBehavior',recipe='payHP',fraction=.25,who='user')],6519)
    move('HAUNTED','spite',[action('moveBehavior',recipe='deductPP',amount=6)],6551)
    # Replace the native conditional double rather than adding a second double.
    # These are move-effect multipliers, independent of Casual/Field Frenzy.
    for syms,mid,power,callback,line in [
        ('CORROSIVE CORROSIVEMIST WASTELAND MURKWATERSURFACE','venoshock',130,'onBasePower',2758),
        ('DEUXFINALIS','brine',130,'onBasePower',2832),
        ('DEUXFINALIS','smellingsalts',140,'basePowerCallback',2769),
        ('INFERNAL','hex',130,'basePowerCallback',2818)]:
        move(syms,mid,[action('moveProperty',path='basePower',value=power,removeCallback=callback)],line)
    move('CORROSIVE CORROSIVEMIST WASTELAND MURKWATERSURFACE','venomdrench',
         [action('moveProperty',path='boosts',value={'atk':-1,'spa':-1,'spe':-1},removeCallback='onHit')],7313)
    move('COLOSSEUM','roar',[action('moveProperty',path='forceSwitch',value=False),
         action('moveBehavior',recipe='arenaRoar',stats={'atk':2},message='{2} stands their ground in the arena!!')],5645)
    for mid in ['dragontail','circlethrow']:
        move('COLOSSEUM',mid,[action('moveProperty',path='forceSwitch',value=False)],5698)
    move('COLOSSEUM','firstimpression',[action('moveProperty',path='flags.protect',value=0)],7852)
    move('DEUXFINALIS','clangingscales',[action('moveProperty',path='selfBoost',value=None)],7826)
    # Shipped Sky code repeats type1 twice and ignores Flying resistances.
    move('SKY','flyingpress',[action('moveBehavior',recipe='firstTypeBonus',type='Flying',repeat=2,positiveOnly=True)],778)
    move('DEUXFINALIS','luckychant',[action('moveBehavior',recipe='appendHitActions',callback='onHitSide',
         actions=[action('sideCondition',id='mist',duration=5,message="Lucky Chant's team became shrouded in mist!")])],3437)
    rule(' '.join(fields),'modifyMove',both({'move':'mist'},{'not':{'sideCondition':'mist'}}),
        [action('moveBehavior',recipe='appendHitActions',callback='onHitSide',actions=[
         action('createField',field='rejuvenation:misty_terrain',duration=3,extendedBy=3,
                message='Mist swirled around the battlefield!')])],'Battle_MoveEffects.rb:1817')
    # Nightmare is a native volatile; preserve its ordinary callbacks when no
    # custom field is attached, but read the current field on each residual.
    for sym,f in fields.items():
        f.setdefault('volatilePolicies',{})['nightmare']={
            'allowAwake':sym=='INFERNAL','suppressResidual':sym=='RAINBOW',
            'fraction':1/3 if sym=='HAUNTED' else .25,
            'message':'{1} is locked in a nightmare!',
            'source':'Battle.rb:6541-6551; Battle_MoveEffects.rb:6568'}
