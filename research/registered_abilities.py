"""Reusable declarations for source abilities required by ordinary field rules."""
def definitions():
    comparison={'statSumComparison':{'left':'spa','right':'atk','group':'foes','op':'>'}}
    boost=lambda stats:{'op':'boost','stats':stats}
    conditional=lambda condition,actions:{'op':'conditional','condition':condition,'actions':actions}
    absorb={'mode':'replace','condition':{'all':[{'samePokemon':False},{'moveType':'Ghost'}]},'actions':[{'op':'heal','who':'target','fraction':.25,'message':'{1} had its HP restored.','failureMessage':"It doesn't affect\n{1}..."},{'op':'set','value':None}],'source':'Battle_Move.rb:644; Battler.rb:5584-5595'}
    rows = {
        'eelevate':{'name':'Eelevate','description':'Levitates and raises its highest raw stat after a knockout.','inherit':'beastboost','airborne':True,'flags':{'breakable':1},'callbacks':{}},
        'gravitycontrol':{'name':'Gravity Control','num':328,'airborneBeforeGravity':True,'description':'Intensifies gravity on entry while remaining airborne.','airborne':True,'flags':{'breakable':1},'callbacks':{'onStart':{'mode':'replace','condition':{'pseudoWeather':{'id':'gravity','value':False}},'actions':[{'op':'pseudoWeather','id':'gravity'},{'op':'fieldMove','move':'gravity'}],'source':'Battler.rb:2923-2932'}}},
        'souleater':{'name':'Soul Eater','num':317,'description':'Restores HP when hit by Ghost attacks.','flags':{'breakable':1},'callbacks':{'onTryHit':absorb}},
        'chifocus':{'name':'Chi Focus','num':318,'description':'Raises the critical hit rate of the user and allies.',
            'flags':{'breakable':1},'callbacks':{
                'onModifyCritRatio':{'mode':'replace','condition':{'always':True},'actions':[{'op':'add','value':2}],
                    'source':'Battle_Move.rb:992; Rejuv/Definitions/abiltext.rb:2433-2438'},
                'onAllyModifyCritRatio':{'mode':'replace','condition':{'not':{'ability':{'who':'user','values':['chifocus']}}},'actions':[{'op':'add','value':2}],
                    'source':'Battle_Move.rb:992 (one side activation, never stacked)'}}},
        'defragment':{'name':'Defragment','num':331,'description':"Adjusts defenses according to a foe's offenses; the user's moves never miss.",
            'flags':{'breakable':1},'callbacks':{
                'onStart':{'mode':'replace','condition':{'always':True},'actions':[
                    conditional(comparison,[boost({'spd':1})]),conditional({'not':comparison},[boost({'def':1})])],
                    'source':'Battler.rb:3174-3192 (ordinary baseline)'},
                'onSourceAccuracy':{'mode':'replace','condition':{'always':True},'actions':[{'op':'set','value':True}],
                    'source':'Battle_Move.rb:876'}}},
        'junglebeat':{'name':'Jungle Beat','num':325,'description':'Powers up sound moves, resists them, and treats Grass attacks as sound moves.',
            'inherit':'punkrock','flags':{'breakable':1},'soundMoveTypes':['Grass'],'callbacks':{
                'onModifyMove':{'mode':'replace','condition':{'moveType':'Grass'},
                    'actions':[{'op':'moveProperty','path':'flags.sound','value':1},{'op':'moveProperty','path':'flags.bypasssub','value':1}],
                    'source':'Battle_Move.rb:231-236,244-249,678,1743,1827-1828'}}},
    }
    rows.update(ordinary_definitions())
    rows['duskilate']={'name':'Duskilate','description':'Normal moves become Dark and deal 20% more damage outside Glitch Field.','flags':{'breakable':1},'callbacks':{
      'onModifyType':callback([{'op':'moveType','type':'Dark'}],'PBMove.rb:138',both(typed('Normal'),neg({'zMove':True}),neg({'field':'rejuvenation:glitch'}))),
      'onBasePower':callback([multiply(1.2)],'Battle_Move.rb:1271-1274',both({'baseMoveType':'Normal'},typed('Dark')))}}
    return rows


def extend(fields):
    for sym in ['DIMENSIONAL','INFERNAL']:
        fields[sym].setdefault('abilityHandlers',{})['souleater']={'onTryHit':{'mode':'replace',
            'condition':{'all':[{'samePokemon':False},{'any':[{'moveType':'Ghost'},{'moveType':'Dark'}]}]},
            'actions':[{'op':'heal','who':'target','fraction':.25,'message':'{1} had its HP restored.','failureMessage':"It doesn't affect\n{1}..."},{'op':'set','value':None}],
            'source':'Battle_Move.rb:644; Battler.rb:5584-5595'}}
    for sym,f in fields.items():
        handlers=f.setdefault('abilityHandlers',{})
        if sym in ['SUPERHEATED','BURNING','VOLCANIC','VOLCANICTOP','INFERNAL']:
            handlers['firemane']={key:callback([multiply(2)],'Battle_Move.rb:1534',typed('Fire')) for key in ['onModifyAtk','onModifySpA']}
        if sym=='DRAGONSDEN':handlers['dragonize']={'onBasePower':callback([multiply(1.5)],'Battle_Move.rb:1268',both({'baseMoveType':'Normal'},typed('Dragon')))}
        if sym=='FAIRYTALE':handlers['swornduty']={'onStart':callback([duty(1/3)],'Battler.rb:2916')}
        if sym in ['WATERSURFACE','SWAMP','MURKWATERSURFACE']:handlers['foamspray']={'onDamagingHit':callback([foam(-2)],'Battler.rb:3890')}
        if sym in ['GRASSY','FOREST','FLOWERGARDEN1','FLOWERGARDEN2','FLOWERGARDEN3','FLOWERGARDEN4','FLOWERGARDEN5']:handlers['wildfire']={'onResidual':callback([fire_damage(1/6)],'Battle.rb:7165')}
        if sym=='INFERNAL':
            handlers.setdefault('wildfire',{}).update({key:callback([multiply(1.5)],'Battle_Move.rb:1567') for key in ['onModifyAtk','onModifySpA']})
            for aid in ['sapsipper','stormdrain','lightningrod','motordrive','wellbakedbody','dryskin','waterabsorb','voltabsorb','eartheater','flashfire','souleater']:
                old=handlers.setdefault(aid,{}).get('onTryHit')
                bypass=both(typed('Fire'),ability('wildfire'))
                handlers[aid]['onTryHit']=callback([{'op':'conditional','condition':old['condition'],'actions':old['actions']}] if old else [],'Battle_Move.rb:729-732',{'any':[old['condition'],bypass]} if old else bypass)
        f['conditionDurations']['gravity']['sourceAbilities']=['gravitycontrol']


def callback(actions,source,condition=None):
    return {'mode':'replace','condition':condition or {'always':True},'actions':actions,'source':source}

def multiply(n):return {'op':'multiply','value':n}
def both(*args):return {'all':list(args)}
def neg(c):return {'not':c}
def typed(t):return {'moveType':t}
def ability(a,who='user'):return {'ability':{'who':who,'values':a.split()}}
def each(group,actions,**extra):return {'op':'forEach','group':group,'actions':actions,**extra}
def weather(w):return {'weatherFor':{'who':'user','values':w.split()}}
def duty(fraction):return each('allies',[{'op':'heal','who':'target','fraction':fraction,'messageFrom':'user','message':'{1} shared its mead with {2}!'}])
def foam(n):return each('others',[{'op':'boost','who':'target','stats':{'def':n}}],anchor='holder')
def fire_damage(fraction=None):
    acts=[]
    if fraction is None:
        # Status belongs to the victim; do not confuse it with the holder status.
        cond={'any':[{'targetStatus':'brn'},{'volatileSourceMove':{'who':'user','id':'partiallytrapped','move':'firespin'}}]}
        acts=[{'op':'conditional','condition':cond,'actions':[{'op':'damage','who':'target','fraction':1/8}]},
              {'op':'conditional','condition':neg(cond),'actions':[{'op':'damage','who':'target','fraction':1/16}]}]
    else:acts=[{'op':'damage','who':'target','fraction':fraction}]
    return each('foes',acts,condition=both(neg({'type':{'who':'target','value':'Fire'}}),neg(ability('magicguard','target'))),order='speed',message='The Pokémon were burnt by the wildfire!!')

def ordinary_definitions():
    from pathlib import Path
    import json
    root=Path(__file__).resolve().parent
    known=json.loads((root/'simulator-registry.json').read_text())['moves']
    shot=[{'move':{'HIJUMPKICK':'highjumpkick'}.get(s,s.lower())} for s in json.loads((root/'source-shot-moves.json').read_text()) if {'HIJUMPKICK':'highjumpkick'}.get(s,s.lower()) in known]
    from weather_rules import cycle_action
    rows={
      'hailwarning':{'name':'Hail Warning','description':'Summons hail on entering battle (legacy pre-Gen-9 Snow Warning).','flags':{},'callbacks':{'onStart':callback([{'op':'setWeather','id':'hail'}],'Load.rb:1225; Battler.rb:2977-2988')}},
      'tempest':{'name':'Storm 9','num':307,'description':'Changes the weather on entry and before each end of turn; immune to weather damage.','flags':{},'callbacks':{
        'onStart':callback([cycle_action()],'Battler.rb:2991-3002'),
        'onBeforeResidual':callback([cycle_action()],'Battle.rb:5367-5379'),
        'onModifyMove':callback([{'op':'moveProperty','path':'target','value':'allAdjacentFoes'}],'Battler.rb:4991-4992',{'move':'weatherball'}),
        'onImmunity':callback([{'op':'set','value':False}],'Battle_Effects.rb:1361',{'immunityType':['hail','sandstorm','shadowsky']})}},
      'dragonize':{'name':'Dragonize','description':'Normal moves become Dragon and deal 20% more damage.','flags':{'breakable':1},'callbacks':{
        'onModifyType':callback([{'op':'moveType','type':'Dragon'}],'PBMove.rb:128-137',both(typed('Normal'),neg({'zMove':True}))),
        'onBasePower':callback([multiply(1.2)],'Battle_Move.rb:1265-1269',both({'baseMoveType':'Normal'},typed('Dragon')))}},
      'firemane':{'name':'Fire Mane','description':'Powers up Fire attacks by 50%.','flags':{},'callbacks':{key:callback([multiply(1.5)],'Battle_Move.rb:1534',typed('Fire')) for key in ['onModifyAtk','onModifySpA']}},
      'hotshot':{'name':'Hotshot','num':324,'description':'Attacks by and against the holder never miss; ball, shot and kick moves deal 30% more damage.','inherit':'noguard','flags':{},'callbacks':{
        'onBasePower':callback([multiply(1.3)],'Battle_Move.rb:168-169,1295',{'any':shot})}},
      'solaridol':{'name':'Solar Idol','num':308,'description':'Levitates; boosts Fire attacks and Attack in sun.','airborne':True,'flags':{'breakable':1},'callbacks':{
        'onBasePower':callback([multiply(1.5)],'Battle_Move.rb:1296',typed('Fire')),
        'onModifyAtk':callback([multiply(1.5)],'Battle_Move.rb:1520; Battler.rb:7278',both(weather('sunnyday desolateland'),neg({'item':{'who':'user','values':['utilityumbrella']}})))}},
      'lunaridol':{'name':'Lunar Idol','num':309,'description':'Levitates; boosts Ice attacks and Special Attack in hail or snow; immune to hail.','airborne':True,'flags':{'breakable':1},'callbacks':{
        'onBasePower':callback([multiply(1.5)],'Battle_Move.rb:1297',typed('Ice')),
        'onModifySpA':callback([multiply(1.5)],'Battle_Move.rb:1493; Battler.rb:7343',weather('snow hail')),
        'onImmunity':callback([{'op':'set','value':False}],'Battle_Effects.rb:1362',{'immunityType':['hail']})}},
      'swornduty':{'name':'Sworn Duty','description':'Restores an ally’s HP upon entering battle.','flags':{},'callbacks':{'onStart':callback([duty(.25)],'Battler.rb:2913-2919')}},
      'foamspray':{'name':'Foam Spray','num':319,'description':'Lowers adjacent Pokémon’s Defense when hit.','flags':{},'callbacks':{'onDamagingHit':callback([foam(-1)],'Battler.rb:3884-3893')}},
      'wildfire':{'name':'Wildfire','num':315,'description':'Damages non-Fire foes every turn and powers up attacks against burned targets.','flags':{},'callbacks':{
        'onResidual':callback([fire_damage()],'Battle.rb:7145-7169'),
        **{key:callback([multiply(1.5)],'Battle_Move.rb:1567',{'targetStatus':'brn'}) for key in ['onModifyAtk','onModifySpA']}}},
    }
    return rows
