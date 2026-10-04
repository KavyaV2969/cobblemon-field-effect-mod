"""Reviewed creation restrictions, grounding exceptions and contextual move recipes."""
def extend(fields,rule,action,both,ability):
    for f in fields.values():f['grounding']={'airborneAbilities':['gravitycontrol'],'forceGroundingItems':['ironball'],'source':'Battler.rb:1104-1112'}
    fields['DEEPEARTH']['gravityUsableMoves']=['magnetrise']
    fields['FROZENDIMENSION']['clockPolicy']={'pauseOverlay':True,'source':'Battle.rb:7001-7005'}
    rule('NEWWORLD','pseudoWeatherStart',{'pseudoWeather':{'id':'gravity','value':True}},[
        action('changeField',field='rejuvenation:starlight',durationFromCondition='gravity',force=True,message="The world's matter reformed!"),
        action('bindFieldClock',durationCondition={'pseudoWeather':{'id':'gravity','value':True}},permanentCondition={'not':{'field':'rejuvenation:starlight'}})],'Battle.rb:718-726')
    fields['DEEPEARTH']['grounding']={'airborneAbilities':['magnetpull','contrary','unaware','oblivious','gravitycontrol'],'forceGroundingItems':[],'source':'Battler.rb:1104-1112'}
    for sym,message in [('NEWWORLD','The terrain had no solid ground to attach...'),('UNDERWATER','The terrain disappeared in the water!'),('FROZENDIMENSION','The frozen dimension remains unchanged.')]:
        fields[sym]['terrainPolicy']={'blockedMessage':message,'blockedFields':[],'source':'Battle_Field.rb:288-301'}
    fields['CORROSIVEMIST']['terrainPolicy']={'blockedFields':['rejuvenation:misty_terrain'],'source':'Battle_Field.rb:303-308'}
    for sym in ['NEWWORLD','UNDERWATER']:fields[sym]['terrainPolicy']['clearOverlayOnEntry']=True
    for f in fields.values():
        f['expirationReturnMessage']='The terrain returned to normal.'
        f['multiplierPolicy']={'defaultDifficultyMode':0,'defaultFieldFrenzy':False,
            'casualMode':1,'casualFactor':.5,'frenzyBoostFactor':2,'frenzyReductionFactor':.5,
            'combinedMinimum':1.5,'source':'Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363'}
    fields['NEWWORLD']['expirationReturnMessage']='The world broke apart again!'
    fields['ELECTERRAIN']['expirationReturnMessage']='The field electrified again!'
    fields['FROZENDIMENSION']['weatherConversions']={'snow':'hail'}
    for syms,weather,message in [
        ('NEWWORLD',None,'The weather drifted off into space...'),
        ('UNDERWATER',None,"You're too deep to notice the weather!"),
        ('VOLCANIC VOLCANICTOP INFERNAL DRAGONSDEN',['hail'],'The hail melted away.'),
        ('VOLCANIC VOLCANICTOP INFERNAL DRAGONSDEN',['snow'],'The snow melted away.'),
        ('INFERNAL',['raindance'],'The rain evaporated.')]:
        rule(syms,'setWeather',{'incomingWeather':weather} if weather else {'always':True},
             [action('message',text=message),action('reject')],'Battle.rb:367-406')
    rule('SKY','setWeather',{'globalAbility':['cloudnine']},[action('message',text='But it failed!'),action('reject')],'Battle.rb:367-372')
    rule(' '.join(fields),'overlayIn',both({'overlay':'rejuvenation:psychic_terrain'},{'ability':{'who':'user','values':['anticipation','forewarn']}}),[action('boost',stats={'spa':1})],'Battler.rb:2644-2652')
    rule(' '.join(fields),'overlayIn',both({'overlay':'rejuvenation:misty_terrain'},{'ability':{'who':'user','values':['watercompaction']}}),[action('boost',stats={'def':2})],'Battler.rb:2654-2662')
    def move(syms,mid,acts,line):rule(syms,'modifyMove',{'move':mid},acts,'Battle_MoveEffects.rb:'+str(line))
    def prop(path,value,remove=None):
        a=action('moveProperty',path=path,value=value)
        if remove:a['removeCallback']=remove
        return a
    move('DEEPEARTH','gravity',[prop('category','Physical'),prop('target','allAdjacentFoes'),prop('pseudoWeather',None),action('moveBehavior',recipe='fixedDamage',basis='targetHP',factor=.5),prop('basePower',1,'onHit')],6792)
    move('DEEPEARTH','magnetrise',[action('moveBehavior',recipe='boostOnly',stats={'spe':2},message='{1} uses electromagnetism to move faster!'),prop('flags.gravity',0)],6834)
    move('DEEPEARTH','topsyturvy',[prop('category','Physical'),prop('target','allAdjacent'),prop('basePower',20),action('moveBehavior',recipe='targetWeightPower')],7354)
    for syms,mid,message in [('DEEPEARTH','seismictoss','Slammed into the ground!'),('BEWITCHED','nightshade','Shadowy figures came out of the woods!'),('HAUNTED','nightshade',None)]:
        # HauntedNightSHade is misspelled at the call site; the source emits no
        # matching HauntedNightShade feedback message for that move.
        move(syms,mid,[action('moveBehavior',recipe='fixedDamage',basis='level',factor=1.5,message=message)],2461)
    move('DEEPEARTH','psywave',[action('moveBehavior',recipe='fixedDamage',basis='level',factor=1,randomRange={'minimum':100,'maximum':200},message="The Core's magical forces are immense!")],2506)
    move('GRASSY FAIRYTALE FLOWERGARDEN3 FLOWERGARDEN4 FLOWERGARDEN5','floralhealing',[prop('heal',[1,1],'onHit')],7884)
    move('CORROSIVE CORROSIVEMIST','floralhealing',[action('moveBehavior',recipe='appendHitActions',actions=[action('status',status='psn',who='target')])],7893)
    move('HAUNTED','firespin',[prop('target','allAdjacentFoes')],4985)
    move('HAUNTED','meanlook',[prop('target','allAdjacentFoes')],4985)
