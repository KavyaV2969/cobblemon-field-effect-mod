"""Second-pass ordinary Battler semantics, independently regression-tested."""
def extend(fields,rule,action,both):
    neg=lambda c:{'not':c}
    ability=lambda a:{'ability':{'who':'user','values':a.split()}}
    king=both({'field':fields['CHESS']['id']},{'role':{'who':'user','value':'king'}})
    for r in fields['PSYTERRAIN']['rules']:
        if r['event']=='tryHit' and any(a['op']=='reject' for a in r['actions']):
            r['condition']=both(r['condition'],neg(king))
    for aid in ['queenlymajesty','dazzling','armortail']:
        fields['CHESS'].setdefault('abilityHandlers',{}).setdefault(aid,{})['onFoeTryMove']={
          'mode':'replace','condition':{'move':'kowtowcleave'},'actions':[],
          'source':'Battler.rb:5957-5968 (priority-blocking abilities bypassed)'}
    for sym in fields:
        if sym!='ELECTERRAIN':
            fields[sym].setdefault('abilityHandlers',{}).setdefault('comatose',{})['onStart']={
              'mode':'replace','condition':{'always':True},
              'actions':[action('abilityMessage'),action('message',text='{1} is drowsing!')],
              'source':'Battler.rb:3013-3017 (hard Electric field alone disables Comatose)'}
        item={'item':{'who':'user','values':['kingsrock','razorfang']}}
        # Run after both native item and Serene Grace callbacks. The source is 20%,
        # never 40%, even when Rainbow and Serene Grace occur together.
        rule(sym,'modifyMoveLate',both(item,{'baseCanFlinch':False},{'any':[
            {'field':fields['RAINBOW']['id']},{'overlay':fields['RAINBOW']['id']},ability('serenegrace')]}),
            [action('secondaryChance',chance=20,volatileStatus='flinch')],'Battler.rb:3544-3548')
        rule(sym,'modifyMoveLate',both(item,{'sheerForce':True}),
            [action('moveProperty',path='secondaries',value=[])],'Battler.rb:3544 (Sheer Force with a secondary effect suppresses item flinch)')
    fields['COLOSSEUM']['switchTiming']='action'
    fields['FROZENDIMENSION'].setdefault('abilityHandlers',{}).setdefault('hungerswitch',{})['onResidual']={
      'mode':'replace','condition':{'always':True},'actions':[],
      'source':'Battle.rb:7364-7375 (Frozen Dimension stops the end-turn toggle)'}
    for sym in fields:
        rule(sym,'modifyMove',both({'move':'expandingforce'},{'any':[{'field':fields['PSYTERRAIN']['id']},{'overlay':fields['PSYTERRAIN']['id']}]}),
          [action('moveProperty',path='target',value='allAdjacentFoes')],'Battler.rb:4979-4980 (spread regardless of user grounding)')
    fields['GLITCH']['seedActions'].append(action('conditional',condition=both(
      {'species':{'who':'user','value':'arceus'}},ability('multitype')),
      actions=[action('forcedType',type='???')]))
    fields['INDOOR']['environmentAbilities']={}
    for aid,callback,extra,cause in [('quarkdrive','onTerrainChange',[
      {'field':fields['ELECTERRAIN']['id']},{'overlay':fields['ELECTERRAIN']['id']}],'Electric Terrain'),
      ('protosynthesis','onWeatherChange',[{'weather':['sunnyday','desolateland']},{'field':fields['DESERT']['id']}],'harsh sunlight')]:
        name={'quarkdrive':'Quark Drive','protosynthesis':'Protosynthesis'}[aid]
        text=lambda reason:'The '+reason+" activated {1}'s "+name+', heightening its {stat}!'
        fields['INDOOR']['environmentAbilities'][aid]={
          'condition':{'any':[{'field':fields['NEWWORLD']['id']},*extra]},'callback':callback,
          # The switch-in block (Battler.rb:3416-3441) knows only Electric Terrain and sunlight; New World and Desert
          # boost through the battle-wide checks, which run on field changes and weather changes respectively.
          'entryCondition':{'any':extra[:1] if aid=='protosynthesis' else extra},
          'messages':[{'condition':{'field':fields['NEWWORLD']['id']},'text':text('ethereal energy')},{'condition':{'always':True},'text':text(cause)}],
          'expiryMessage':"{1}'s "+name+' wore off!',
          'boosterMessage':'{1} used its Booster Energy to activate '+name+', heightening its {stat}!',
          'source':'Battle.rb:529-559,562-591; Battler.rb:3416-3441'}
    for sym in fields:
        fields[sym].setdefault('abilityHandlers',{}).setdefault('slowstart',{})['onStart']={
          'mode':'replace','condition':{'always':True},
          'actions':[action('volatile',id='slowstart',silent=True,**({} if sym=='DEEPEARTH' else {'message':'{1} is slow to get going!'}))],
          'source':'Battler.rb:3288-3289 (clock retained even on Deep Earth)'}
    frisk=fields['CITY']['abilityHandlers']['frisk']['onStart']
    frisk['actions'][1]['actions'][0]['sourceAbility']='intimidate'
    frisk['actions'][1]['condition']={'any':[{'not':{'volatile':{'who':'target','id':'substitute'}}},{'ability':{'who':'target','values':['contrary']}}]}
    poison={'type':{'who':'user','value':'Poison'}}
    fields['CORRUPTED']['itemHandlers']={'blacksludge':{'onResidual':{
      'mode':'replace','condition':{'always':True},'actions':[
        action('conditional',condition=poison,actions=[action('heal',fraction=1/8)]),
        action('conditional',condition=both(neg(poison),{'any':[{'canHeal':{'who':'user','value':True}},{'allyCanHeal':True}]}),
          actions=[action('damage',fraction=1/4,message='{1} is hurt by its Black Sludge!')])],
      'source':'Battler.rb:4379-4393,4445-4448 (full-HP and ally-healing guard retained)'}}}
