"""Reviewed semantic rules outside fieldtext.rb, with source line provenance.

Only data is produced. This module is imported by generate.py before emission.
"""
def extend(fields,rule,ability,grounded,both,action,boost,norm,fid,source):
    import re
    def neg(c):return {'not':c}
    def anyof(*cs):return {'any':list(cs)}
    def typeis(t,who='user'):return {'type':{'who':who,'value':t}}
    def vol(v):return {'volatile':{'who':'user','id':v}}
    def item(v):return {'item':{'who':'user','values':v.split()}}
    def times(n):return [action('multiply',value=n)]
    for syms,c,m in [('DARKCRYSTALCAVERN',anyof(typeis('Dark'),typeis('Ghost')),1.5),
        ('DARKCRYSTALCAVERN RAINBOW CRYSTALCAVERN',ability('PRISMARMOR'),1.33),
        ('DRAGONSDEN',typeis('Dragon'),1.3),('NEWWORLD',neg(grounded()),.9),
        ('DIMENSIONAL FROZENDIMENSION',typeis('Ghost'),1.5),('FROZENDIMENSION',typeis('Ice'),1.2),
        ('FROZENDIMENSION',typeis('Fire'),.8),
        ('DEUXFINALIS',both(anyof(typeis('Dragon'),typeis('Normal'),typeis('Dark'),ability('PURIFYINGSALT FAIRYAURA AURABREAK DARKAURA')),
            neg({'weatherFor':{'who':'target','values':['raindance','primordialsea']}}),neg(ability('BEADSOFRUIN SWORDOFRUIN','target'))),1.3)]:
        for event in ['defense','specialDefense']:rule(syms,event,c,times(m),'Battle_Field.rb:1094-1128')
    rule('MISTY','specialDefense',typeis('Fairy'),times(1.5),'Battle_Field.rb:1098')
    rule('DESERT','specialDefense',typeis('Ground'),times(1.5),'Battle_Field.rb:1111')
    rule('ICY SNOWYMOUNTAIN','defense',both(typeis('Ice'),{'weatherFor':{'who':'target','values':['hail']}}),times(1.5),'Battle_Field.rb:1108')
    for syms,c,m in [('ELECTERRAIN',ability('STEADFAST'),1.5),('NEWWORLD',grounded(),.75),
        ('WATERSURFACE MURKWATERSURFACE',both(grounded(),neg(typeis('Water')),neg(ability('SURGESURFER SWIFTSWIM'))),.75),
        ('UNDERWATER',both(neg(typeis('Water')),neg(ability('EELEVATE STEELWORKER SWIFTSWIM'))),.5),
        ('DEEPEARTH',item('floatstone'),1.2),('DEEPEARTH',item('ironball'),2),
        ('DEEPEARTH',both(ability('SLOWSTART'),vol('slowstart')),2)]:
        rule(syms,'speed',c,times(m),'Battler.rb:1187-1215')
    rule('DEEPEARTH','attack',both(ability('SLOWSTART'),vol('slowstart')),times(2),'Battle_Move.rb:physical Slow Start exclusion')
    rule('PSYTERRAIN','specialAttack',ability('PUREPOWER'),times(2),'Battle_Move.rb:1502')
    chessmoves=re.search(r'CHESSMOVES = \[(.*?)\]',(source/'PBStuff.rb').read_text(),re.S)[1]
    chess={'any':[{'move':norm(m)} for m in re.findall(r':(\w+)',chessmoves)+['BARRAGE']]}
    rule('CHESS','basePower',both(chess,ability('ADAPTABILITY ANTICIPATION SYNCHRONIZE TELEPATHY','target')),times(.5),'Battle_Move.rb:1394')
    rule('CHESS','basePower',both(chess,anyof(ability('OBLIVIOUS KLUTZ UNAWARE SIMPLE DEFEATIST','target'),{'volatile':{'who':'target','id':'confusion'}})),times(2),'Battle_Move.rb:1395')
    rule('CHESS','basePower',ability('QUEENLYMAJESTY'),times(1.5)+[action('moveMessage',text='The Queen is dominating the board!')],'Battle_Move.rb:1398')
    # Queenly Majesty's Chess boost is a base-power factor, not a second damage factor.
    fields['CHESS']['rules']=[r for r in fields['CHESS']['rules'] if not (r['event'] in ['damage','attack','specialAttack'] and r['condition']==ability('QUEENLYMAJESTY'))]
    for event in ['attack','specialAttack']:
        rule('CHESS',event,ability('COMPETITIVE'),[action('hpPower',maximum=2,scale=.8)],'Battle_Move.rb:1604-1611')
        rule('CHESS',event,{'pokemonFlag':{'who':'user','id':'illusion','value':True}},times(1.2),'Battle_Move.rb:1603 (active disguise only)')
    rule('DEEPEARTH','basePower',{'priority':{'op':'>','value':0}},times(.7)+[action('moveMessage',text='The intense pull slowed the attack...')],'Battle_Move.rb:1436')
    rule('DEEPEARTH','basePower',{'priority':{'op':'<','value':0}},times(1.3)+[action('moveMessage',text='Slow and heavy!')],'Battle_Move.rb:1440')
    rule('MOUNTAIN SNOWYMOUNTAIN VOLCANICTOP','basePower',both({'weather':'deltastream'},anyof({'flag':'wind'},both({'moveType':'Flying'},{'category':'Special'}))),times(1.5)+[action('moveMessage',text='The windy weather strengthened the attack!')],'Battle_Move.rb:1420')
    striker=re.search(r'STRIKERMOVES = \[(.*?)\]\s*\+', (source/'PBStuff.rb').read_text(),re.S)[1]
    striker={'any':[both({'moveType':'Fighting'},{'category':'Physical'})]+[{'move':norm(m)} for m in re.findall(r':(\w+)',striker)+['IVYCUDGEL']]}
    rule('BIGTOP','basePower',striker,[action('randomPower',range=14,threshold=8,low=13,high=14,
        maximize=ability('HUGEPOWER GUTS PUREPOWER SHEERFORCE'),values=[.5,.5,1,1,1,1,1,1,1.5,1.5,1.5,1.5,2,2,3],
        messages=['...WEAK!','...WEAK!']+['...OK!']*6+['...NICE!']*4+['...POWERFUL!']*2+['...OVER 9000!!!'])],'Battle_Field.rb:98; Battle_Move.rb:1985')
    rule('SHORTCIRCUIT','basePower',{'moveType':'Electric'},[action('cyclePower',values=[.8,1.5,.5,1.2,2],
        maximize={'overlay':fid('ELECTERRAIN')},messages=['Bzzt.','Bzzapp!','Bzt...','Bzap!','BZZZAPP!'])],'Battle_Field.rb:85; Battle_Move.rb:1954')
    alltypes=['Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison','Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy']
    rule('RAINBOW','modifyMove',both({'moveType':'Normal'},{'category':'Special'}),[action('extraType',values=alltypes,excludePrimary=True)],'Battle_Move.rb:795')
    for sym in fields:
        rule(sym,'modifyMove',both({'overlay':fid('RAINBOW')},{'moveType':'Normal'},{'category':'Special'}),[action('extraType',values=alltypes,excludePrimary=True,layer='overlay')],'Battle_Move.rb:837-838; Battle_Field.rb:117-136')
    rule('CORROSIVEMIST','modifyMove',both({'moveType':'Flying'},{'category':'Special'}),[action('extraType',values=['Poison'])],'Battle_Move.rb:800')
    rule('SHORTCIRCUIT','modifyMove',both({'moveType':'Steel'},ability('STEELWORKER')),[action('extraType',values=['Electric'])],'Battle_Move.rb:804')
    rule('CRYSTALCAVERN','modifyMove',anyof({'moveType':'Rock'},{'any':[{'move':m} for m in ['judgment','rockclimb','strength','multiattack','prismaticlaser','terablast','terastarstorm']]}),[action('extraType',values=['Fire','Water','Grass','Psychic'],cycle=True)],'Battle_Move.rb:807')
    # Native weather and field-independent abilities remain with Showdown.
    rule('DARKCRYSTALCAVERN','fieldResidual',{'weather':'sunnyday'},[action('weatherTemporary',field=fid('CRYSTALCAVERN'),weather='sunnyday',message='The sun lit up the crystal cavern!')],'Battle.rb:5390')
    for weather,word in [('raindance','rain'),('sandstorm','sand')]:rule('VOLCANIC','fieldResidual',{'weather':weather},[action('changeField',field=fid('CAVE'),message=f'The {word} snuffed out the flame!')],'Battle.rb:5407')
    rule('RAINBOW','fieldResidual',{'weather':['sandstorm','hail','snow']},[action('destroyField',message='The weather blocked out the rainbow!')],'Battle.rb:5420')
    rule('MOUNTAIN','fieldResidual',{'weather':['hail','snow']},[action('counter',index=1,amount=1)],'Battle.rb:5432')
    rule('MOUNTAIN','fieldResidual',{'counter':{'index':1,'op':'==','value':3}},[action('changeField',field=fid('SNOWYMOUNTAIN'),message='The mountain was covered in snow!')],'Battle.rb:5434')
    for syms,weather,msg in [('NEWWORLD',None,'The weather disappeared into space!'),('UNDERWATER',None,"You're too deep to notice the weather!"),
        ('VOLCANIC VOLCANICTOP INFERNAL DRAGONSDEN',['hail'],'The hail melted away!'),('VOLCANIC VOLCANICTOP INFERNAL DRAGONSDEN',['snow'],'The snow melted away!'),('INFERNAL',['raindance'],'The rain evaporated!')]:
        c=both({'weather':weather} if weather else {'weatherActive':True},neg({'globalAbility':['tempest']}))
        for event in ['activate','weatherChange']:rule(syms,event,c,[action('clearWeather',message=msg)],'Battle_Field.rb:215-232')
    rule('FROZENDIMENSION','weatherChange',{'weather':'snow'},[action('setWeather',id='hail')],'Battle_Field.rb:420')
    rule('NEWWORLD UNDERWATER','activate',{'always':True},[action('clearOverlay')],'Battle_Field.rb:250')
    # Field residuals use direct HP loss as in pbReduceHP; exclusions are explicit.
    for syms,abil,msg in [('ELECTERRAIN SHORTCIRCUIT','VOLTABSORB','{1} absorbed stray electricity!'),
        ('GRASSY','SAPSIPPER','{1} ate some grass to recover!'),('MISTY','DRYSKIN','{1} was healed a little by the mist!'),
        ('SWAMP','DRYSKIN','{1} was healed a little by the murk!'),('DESERT','EARTHEATER','{1} ate sand to recover!'),
        ('HAUNTED DIMENSIONAL DEUXFINALIS INFERNAL','SOULEATER','{1} devoured spirits to recover!')]:rule(syms,'residual',ability(abil),[action('heal',fraction=1/16,message=msg)],'Battle.rb:5850-6109')
    for r in fields['SNOWYMOUNTAIN']['rules']:
        if r['event']=='residual' and r['condition']==ability('ICEBODY'):r['actions']=[dict(r['actions'][0],message='{1} was healed a little by the snow!')]
    for r in fields['GRASSY']['rules']:
        if r['event']=='residual' and r['condition']==grounded():r['condition']=both(grounded(),{'semiInvulnerable':{'who':'user','value':False}});r['actions'][0]['groupMessage']='The grass healed the Pokémon on the battlefield.'
    for syms,c,msg in [('DESERT',ability('DRYSKIN'),'{1} was hurt by the desert air!'),('CORROSIVE',ability('GRASSPELT'),"{1}'s pelt is withering!"),
        ('CORRUPTED',ability('GRASSPELT LEAFGUARD FLOWERVEIL'),"{1}'s foliage caused harm!")]:rule(syms,'residual',c,[action('residualDamage',fraction=1/8,message=msg)],'Battle.rb:5970-6220')
    c=both({'weather':['sunnyday','desolateland']},anyof(typeis('Grass'),typeis('Water')),neg(ability('SOLARPOWER CHLOROPHYLL MEGASOL')),neg(item('utilityumbrella')))
    rule('DESERT','residual',c,[action('residualDamage',fraction=1/8,message='{1} was hurt by the sunlight!')],'Battle.rb:5485')
    rule('CORROSIVEMIST CORRUPTED','residual',both(ability('DRYSKIN'),neg(typeis('Steel')),neg(typeis('Poison'))),[action('residualDamage',fraction=1/8,message='{1} absorbed the poison!')],'Battle.rb:5990')
    rule('CORROSIVEMIST CORRUPTED','residual',both(ability('DRYSKIN'),neg(typeis('Steel')),typeis('Poison')),[action('heal',fraction=1/8,message='{1} was healed by the poison!')],'Battle.rb:5998')
    rule('CORROSIVEMIST','residual',neg({'globalAbility':['neutralizinggas']}),[action('status',status='psn',message='The Pokémon were poisoned by the corrosive mist!')],'Battle.rb:5984')
    rule('CORRUPTED','residual',both(grounded(),neg(typeis('Poison')),neg(ability('WONDERSKIN IMMUNITY PASTELVEIL'))),[action('status',status='psn',message='The Pokémon were poisoned!')],'Battle.rb:6225')
    rule('BEWITCHED','residual',both(grounded(),typeis('Grass')),[action('heal',fraction=1/16,groupMessage='The woods healed the Grass-type Pokémon on the battlefield.')],'Battle.rb:6235')
    swamp=both(grounded(),neg(item('heavydutyboots clearamulet')),neg(ability('WHITESMOKE CLEARBODY QUICKFEET SWIFTSWIM PROPELLERTAIL')))
    rule('SWAMP','residual',both(swamp,neg(vol('partiallytrapped'))),[action('boost',stats={'spe':-1}),action('groupMessage',text="The Pokémon's Speed sank...")],'Battle.rb:5930')
    rule('SWAMP','residual',both(swamp,vol('partiallytrapped')),[action('boost',stats={'spe':-2}),action('groupMessage',text="The Pokémon's Speed sank...")],'Battle.rb:5932')
    rule('RAINBOW','residual',ability('CLOUDNINE'),[action('randomBoost',stats=['atk','def','spa','spd','spe','accuracy','evasion'],amount=1)],'Battle.rb:5950')
    burning=both(grounded(),neg(typeis('Fire')),neg(vol('aquaring')),neg(vol('dig')),neg(vol('dive')),
        neg(ability('FLAREBOOST MAGMAARMOR FLAMEBODY FLASHFIRE WATERVEIL MAGICGUARD HEATPROOF WATERBUBBLE')))
    rule('VOLCANIC INFERNAL','residual',both(burning,ability('WELLBAKEDBODY')),[action('boost',stats={'def':1})],'Battle.rb:5907')
    mods=[{'condition':ability('LEAFGUARD ICEBODY FLUFFY GRASSPELT'),'multiplier':2},{'condition':vol('tarshot'),'multiplier':2}]
    rule('VOLCANIC INFERNAL','residual',both(burning,neg(ability('WELLBAKEDBODY'))),[action('residualDamage',type='Fire',fraction=1/8,modifiers=mods,message='The Pokémon were burned by the field!')],'Battle.rb:5913')
    rule('VOLCANIC INFERNAL','residual',both(burning,ability('THERMALEXCHANGE')),[action('boost',stats={'atk':1})],'Battle.rb:5921')
    rule('VOLCANIC INFERNAL','residual',ability('FLASHFIRE'),[action('flashFire',message="The power of {1}'s Fire-type moves rose!")],'Battle.rb:5894')
    rule('UNDERWATER','residual',both(neg(typeis('Water')),neg(ability('WATERABSORB DRYSKIN STORMDRAIN SWIFTSWIM MAGICGUARD')),{'effectiveness':{'who':'user','type':'Water','op':'>','value':0}}),
        [action('residualDamage',type='Water',fraction=1/8,modifiers=[{'condition':ability('FLAMEBODY MAGMAARMOR'),'multiplier':2}],message='{1} struggled in the water!')],'Battle.rb:6110; Battle_Field.rb:1143')
    murky=both(neg(typeis('Steel')),neg(typeis('Poison')),neg(ability('POISONHEAL MAGICGUARD WONDERGUARD TOXICBOOST IMMUNITY PASTELVEIL SURGESURFER')))
    mods=[{'condition':ability('FLAMEBODY MAGMAARMOR DRYSKIN WATERABSORB'),'multiplier':2}]
    rule('MURKWATERSURFACE','residual',both(murky,vol('dive')),[action('residualDamage',type='Poison',fraction=.5,modifiers=mods,message='{1} suffocated underneath the toxic water!')],'Battle.rb:6139')
    rule('MURKWATERSURFACE','residual',both(murky,grounded(),neg(vol('dive'))),[action('residualDamage',type='Poison',fraction=1/8,modifiers=mods,message='The Pokémon are hurt by the toxic water!')],'Battle.rb:6142')
    rule('WATERSURFACE UNDERWATER','residual',vol('tarshot'),[action('removeVolatile',id='tarshot',message='The tar washed off {1} in the water!')],'Battle.rb:6098')
    rule('INFERNAL','residual',both(vol('torment'),neg(ability('MAGICGUARD'))),[action('residualDamage',fraction=1/8,message='{1} is hurt by Torment!')],'Battle.rb:6243')
    rule('DESERT HAUNTED','residual',ability('WANDERINGSPIRIT'),[action('boost',stats={'spe':-1})],'Battle.rb:6203')
    rule('MOUNTAIN SNOWYMOUNTAIN','residual',both({'weather':'deltastream'},ability('WINDRIDER')),[action('boost',stats={'atk':1})],'Battle.rb:6180')
    rule('MOUNTAIN SNOWYMOUNTAIN','residual',both({'weather':'deltastream'},ability('WINDPOWER')),[action('volatile',id='charge'),action('message',text='The wind charged {1} with power!')],'Battle.rb:6189')
    rule('ELECTERRAIN','residual',both(ability('MOTORDRIVE'),{'turnsActive':{'op':'>','value':0}}),[action('boost',stats={'spe':1})],'Battle.rb:5858')
    rule('VOLCANIC VOLCANICTOP WATERSURFACE UNDERWATER INFERNAL','residual',both(ability('STEAMENGINE'),{'turnsActive':{'op':'>','value':0}}),[action('boost',stats={'spe':1})],'Battle.rb:6251')
    boost('COLOSSEUM','BATTLEARMOR SHELLARMOR',{'def':1},2359,flavor='shining armor')
    # Source misspells MIRORARMOR; preserve the actual behavior for Magic Guard.
    boost('COLOSSEUM','MAGICGUARD',{'spd':1},2367,flavor='magical power')
    boost('COLOSSEUM','NOGUARD JUSTIFIED',{'atk':1,'spa':1},2375,flavor='ferocious heart')
    boost('INFERNAL','MAGMAARMOR FLAMEBODY DESOLATELAND',{'def':1,'spd':1},2385)
    boost('DEEPEARTH','LIGHTMETAL',{'spe':1},2394)
    boost('DEEPEARTH','HEAVYMETAL',{'def':1,'spe':-1},2402,"{1}'s weight makes it harder to be moved!")
    boost('DEEPEARTH','SLOWSTART',{'atk':1,'def':1,'spd':1,'spe':-6,'evasion':-6},2411,'Slow but powerful!')
    boost('CONCERT1 CONCERT2 CONCERT3 CONCERT4','SOUNDPROOF PUNKROCK HEAVYMETAL SOLIDROCK ROCKHEAD',{'def':1},2435,'{1} is accustomed to the music!')
    boost('CONCERT2 CONCERT3 CONCERT4','RUNAWAY EMERGENCYEXIT',{'spe':1},2444,'{1} wants to get away from the noise!')
    boost('CONCERT3 CONCERT4','RATTLED',{'spe':2},2444,'{1} wants to get away from the noise!')
    rule('CONCERT3 CONCERT4','activate',{'always':True},[action('concertNoise',message="The Concert's noise could wake up even the dead!")],'Battle_Field.rb:781')
    rule('CONCERT3 CONCERT4','switchIn',{'always':True},[action('concertNoise',single=True,message="The Concert's noise could wake up even the dead!")],'Battle.rb:3243')
    fields['CRYSTALCAVERN']['mimicryRoll']={'values':['Fire','Water','Grass','Psychic'],'cycle':True}
    fields['NEWWORLD']['mimicryRoll']={'values':alltypes}
    rule('CRYSTALCAVERN NEWWORLD','residual',ability('MIMICRY'),[action('mimicry')],'Battle.rb:6122; Battle_Field.rb:1181')
    eruption={'stateFlag':'eruption'}
    immune=anyof(typeis('Fire'),vol('aquaring'),{'sideCondition':'wideguard'},ability('MAGMAARMOR FLASHFIRE FLAREBOOST BLAZE FLAMEBODY SOLIDROCK STURDY BATTLEARMOR SHELLARMOR WATERBUBBLE MAGICGUARD WONDERGUARD PRISMARMOR'))
    rule('VOLCANICTOP','residual',both(eruption,immune),[action('message',text='{1} is immune to the eruption!')],'Battle.rb:6039')
    rule('VOLCANICTOP','residual',both(eruption,neg(immune)),[action('residualDamage',type='Fire',fraction=1/8,modifiers=[{'condition':ability('THICKFAT'),'multiplier':.5},{'condition':vol('tarshot'),'multiplier':2}],message='{1} is hurt by the eruption!')],'Battle.rb:6048')
    rule('VOLCANICTOP','residual',both(eruption,ability('MAGMAARMOR')),[action('boost',stats={'def':1,'spd':1})],'Battle.rb:6056')
    rule('VOLCANICTOP','residual',both(eruption,ability('FLAREBOOST')),[action('boost',stats={'spa':1})],'Battle.rb:6063')
    rule('VOLCANICTOP','residual',both(eruption,ability('FLASHFIRE')),[action('flashFire',message="The power of {1}'s Fire-type moves rose!")],'Battle.rb:6070')
    rule('VOLCANICTOP','residual',both(eruption,ability('BLAZE')),[action('volatile',id='rejuvenationblazed',message="The power of {1}'s Fire-type moves rose!")],'Battle.rb:6077')
    rule('VOLCANICTOP','residual',both(eruption,{'pokemonStatus':'slp'},neg(ability('SOUNDPROOF'))),[action('cureStatus',message='{1} woke up due to the eruption!')],'Battle.rb:6083')
    rule('VOLCANICTOP','residual',both(eruption,vol('leechseed')),[action('removeVolatile',id='leechseed',message="{1}'s Leech Seed burned away in the eruption!")],'Battle.rb:6087')
    for syms,abil,weather,extra in [('FLOWERGARDEN4 FLOWERGARDEN5','CHLOROPHYLL',['sunnyday','desolateland'],{'always':True}),
        ('UNDERWATER','SWIFTSWIM',['raindance','primordialsea'],{'always':True}),('WATERSURFACE MURKWATERSURFACE','SWIFTSWIM',['raindance','primordialsea'],grounded()),
        ('DESERT ASHENBEACH','SANDRUSH',['sandstorm'],{'always':True}),('ICY SNOWYMOUNTAIN FROZENDIMENSION','SLUSHRUSH',['hail','snow'],{'always':True})]:
        native=both({'weather':weather},neg(item('utilityumbrella'))) if abil in ['CHLOROPHYLL','SWIFTSWIM'] else {'weather':weather}
        rule(syms,'speed',both(ability(abil),neg(native),extra),times(2),'Battle_Effects.rb:1411-1440')
    rule('SHORTCIRCUIT','speed',ability('SURGESURFER'),times(2),'Battle_Effects.rb:1442')
    rule('WATERSURFACE MURKWATERSURFACE','speed',both(ability('SURGESURFER'),grounded(),neg({'overlay':fid('ELECTERRAIN')})),times(2),'Battle_Effects.rb:1444')
    rule('SKY','priority',both(ability('GALEWINGS'),{'moveType':'Flying'},{'hp':{'who':'user','op':'<','fraction':1}}),[action('add',value=1)],'Battle_Effects.rb:1403')
    rule('MOUNTAIN SNOWYMOUNTAIN VOLCANICTOP','priority',both(ability('GALEWINGS'),{'moveType':'Flying'},{'hp':{'who':'user','op':'<','fraction':1}},{'weather':'deltastream'}),[action('add',value=1)],'Battle_Effects.rb:1407')
    for syms,abil,extra in [('UNDERWATER','HYDRATION',{'always':True}),('WATERSURFACE','HYDRATION',grounded()),('WATERSURFACE UNDERWATER','WATERVEIL',{'always':True}),('BEWITCHED','NATURALCURE',{'always':True})]:
        rule(syms,'residual',both(ability(abil),extra),[action('cureStatus')],'Battle_Effects.rb:1372-1380')
    rule('FOREST GRASSY FLOWERGARDEN2 FLOWERGARDEN3 FLOWERGARDEN4 FLOWERGARDEN5','setStatus',{'effectiveAbility':{'who':'target','values':['leafguard']}},[action('reject')],'Battle_Effects.rb:99,1383-1391')
    # Quick Feet is active without a status on the hard Electric Terrain (Battle_Effects.rb:1457-1462).
    rule('ELECTERRAIN','speed',both(ability('QUICKFEET'),{'field':fid('ELECTERRAIN')},{'pokemonStatus':''}),times(1.5),'Battle_Effects.rb:1457-1462; Battler.rb:1179')
    # Telepathy doubles Speed on the hard Psychic Terrain only; the overlay clause is commented out in the source.
    rule('PSYTERRAIN','speed',both(ability('TELEPATHY'),{'field':fid('PSYTERRAIN')}),times(2),'Battle_Effects.rb:1450-1455; Battler.rb:1177')
    # Secret Power: animation ID is metadata; effect semantics live in Move_0A4.
    for sym,f in fields.items():
        if sym in 'ELECTERRAIN SHORTCIRCUIT INDOOR'.split():s={'status':'par'}
        elif sym in 'GRASSY FOREST FAIRYTALE'.split():s={'status':'slp'}
        elif sym in 'MISTY HOLY'.split():s={'boosts':{'spa':-1}}
        elif sym in 'DARKCRYSTALCAVERN DESERT ASHENBEACH'.split():s={'boosts':{'accuracy':-1}}
        elif sym=='CHESS':s={'boosts':{'def':-1}}
        elif sym in 'BIGTOP STARLIGHT'.split():s={'boosts':{'spd':-1}}
        elif sym in 'VOLCANIC VOLCANICTOP DRAGONSDEN INFERNAL'.split():s={'status':'brn'}
        elif sym in 'SWAMP WATERSURFACE GLITCH'.split():s={'boosts':{'spe':-1}}
        elif sym in 'CORROSIVE CORROSIVEMIST MURKWATERSURFACE CORRUPTED BACKALLEY CITY'.split():s={'status':'psn'}
        elif sym in 'ICY SNOWYMOUNTAIN FROZENDIMENSION'.split():s={'status':'frz'}
        elif sym in 'ROCKY CAVE MOUNTAIN DEUXFINALIS DIMENSIONAL DEEPEARTH'.split() or sym.startswith('CONCERT'):s={'volatileStatus':'flinch'}
        elif sym in 'FACTORY UNDERWATER'.split():s={'boosts':{'atk':-1}}
        elif sym=='NEWWORLD':s={'boosts':dict.fromkeys(['atk','def','spa','spd','spe'],-1)}
        elif sym in 'INVERSE PSYTERRAIN SKY'.split():s={'volatileStatus':'confusion'}
        elif sym=='HAUNTED':s={'volatileStatus':'curse'}
        elif sym=='COLOSSEUM':s={'self':{'boosts':{'atk':1}}}
        elif sym.startswith('FLOWERGARDEN'):s={'boosts':dict.fromkeys(['def','spd','evasion'] if int(sym[-1])>=3 else ['evasion'],2 if sym.endswith('5') else 1)}
        elif sym in ['RAINBOW','WASTELAND','CRYSTALCAVERN','BEWITCHED']:
            values={'RAINBOW':['par','psn','brn','frz','slp'],'WASTELAND':['par','psn','brn','frz'],'CRYSTALCAVERN':['brn','frz','slp','confusion'],'BEWITCHED':['par','psn','slp']}[sym]
            f['secretPowerEffects']=[{'volatileStatus':v} if v=='confusion' else {'status':v} for v in values];continue
        else:raise ValueError('Secret Power missing '+sym)
        f['secretPowerEffects']=[s]

    # Only these dynamic base-power factors call calculateFieldMultiplier in Ruby.
    for sym in fields:
        for r in fields[sym]['rules']:
            if r['event']=='basePower' and r['source'].startswith(('Battle_Move.rb:1436','Battle_Move.rb:1440','Battle_Move.rb:1420','Battle_Field.rb:98','Battle_Field.rb:85')):
                for a in r['actions']:
                    if a['op'] in ['multiply','cyclePower','randomPower']:a['scaleField']=True
