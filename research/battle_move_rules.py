"""Ordinary field branches of the Battle_Move.rb damage, accuracy and type code.

Native ability multipliers are replaced only where the source changes their
trigger or size; field-only modifiers use the stage the source applies them to.
Crest, boss and custom-move clauses in the same lines are not represented.
"""
RATIO=5461/4096  # PBMults::ParadoxLeads
def extend(fields,rule,action,both):
    def ability(a,who='user'):return {'ability':{'who':who,'values':a.split()}}
    def anyof(*cs):return {'any':list(cs)}
    def neg(c):return {'not':c}
    def overlay(sym):return {'overlay':fields[sym]['id']}
    def times(v):return [action('multiply',value=v)]
    def movetype(*ts):return {'moveType':ts[0]} if len(ts)==1 else anyof(*[{'moveType':t} for t in ts])
    ALWAYS={'always':True}
    def src(line):return 'Battle_Move.rb:'+str(line)
    def handler(syms,aid,callbacks,actions,line,condition=None,mode='replace'):
        for sym in syms.split():
            for callback in callbacks.split():
                slot=fields[sym].setdefault('abilityHandlers',{}).setdefault(aid,{})
                if callback in slot:raise ValueError(f'Duplicate handler {sym} {aid} {callback}')
                slot[callback]={'mode':mode,'condition':condition or ALWAYS,'actions':actions,'source':line if isinstance(line,str) and '.rb:' in line else src(line)}
    def others(syms):return ' '.join(s for s in fields if s not in syms.split())
    grounded={'grounded':{'who':'user','value':True}}
    physical={'category':'Physical'}

    # ---- Base power (1205-1303) ----
    # Deux Finalis: an aura only strengthens moves used from its holder's side.
    for aid in ['darkaura','fairyaura']:handler('DEUXFINALIS',aid,'onAnyBasePower',[],'1215,1230',condition={'holderAllied':False})
    changed={'abilityChangedType':True}
    handler('MOUNTAIN SNOWYMOUNTAIN SKY','aerilate','onBasePower',times(1.5),1243,condition=changed)
    handler('ELECTERRAIN FACTORY','galvanize','onBasePower',times(1.5),1249,condition=changed)
    handler('SHORTCIRCUIT','galvanize','onBasePower',times(2),1250,condition=changed)
    handler(others('ELECTERRAIN FACTORY SHORTCIRCUIT'),'galvanize','onBasePower',times(1.5),1249,condition=both(changed,overlay('ELECTERRAIN')))
    handler('ICY SNOWYMOUNTAIN FROZENDIMENSION','refrigerate','onBasePower',times(1.5),1256,condition=changed)
    handler('MISTY','pixilate','onBasePower',times(1.5),1262,condition=changed)
    handler(others('MISTY GLITCH'),'pixilate','onBasePower',times(1.5),1262,condition=both(changed,overlay('MISTY')))
    # Glitch has no Fairy type: Pixilate leaves Normal moves Normal but keeps its boost (PBMove.rb:133).
    handler('GLITCH','pixilate','onModifyType',[],'1260; PBMove.rb:133')
    handler('GLITCH','pixilate','onBasePower',[action('conditional',condition=overlay('MISTY'),actions=times(1.5)),action('conditional',condition=neg(overlay('MISTY')),actions=times(1.2))],'1260-1262',condition=both(movetype('Normal'),{'baseMoveType':'Normal'}))
    handler('DESERT ASHENBEACH','sandforce','onBasePower',times(1.3),1276,condition=movetype('Rock','Ground','Steel'))
    handler('FACTORY CONCERT1 CONCERT2 CONCERT3 CONCERT4','technician','onBasePower',times(1.5),'1278-1284',condition={'basePower':{'op':'<=','value':80}})
    handler('VOLCANIC INFERNAL','flareboost','onBasePower',times(1.5),1286,condition={'category':'Special'})
    handler('FROZENDIMENSION','flareboost','onBasePower',[],1286)
    poisoned=anyof({'pokemonStatus':'psn'},{'pokemonStatus':'tox'})
    handler('CORROSIVEMIST','toxicboost','onBasePower',times(1.5),'1287-1290',condition=physical)
    handler('CORROSIVE WASTELAND MURKWATERSURFACE','toxicboost','onBasePower',times(1.5),'1287-1290',condition=both(physical,anyof(poisoned,grounded)))
    handler('CORRUPTED','toxicboost','onBasePower',times(2),1289,condition=both(physical,poisoned))
    handler('ELECTERRAIN','battery','onAllyBasePower',times(1.5),1302,condition=both({'category':'Special'},{'holderIsUser':False}))

    # ---- Attack (1470-1621) ----
    # Ruin abilities: the native 0.75 is rescaled, and on the source "dimensional" list a partner's ruin ability spares its ally.
    # PBStuff::DimensionalFields names :FROZENDIMENSIONAL, which is not a field, so Frozen Dimension is not on that list.
    for aid,event in [('tabletsofruin','attack'),('vesselofruin','specialAttack'),('swordofruin','defense'),('beadsofruin','specialDefense')]:
        lowered=both({'globalAbility':[aid]},neg(ability(aid)))
        rule('NEWWORLD',event,lowered,times(0.667/0.75),src('1471,1686'))
        rule('HOLY',event,lowered,times(0.875/0.75),src('1472,1687'))
        rule('DIMENSIONAL INFERNAL DEUXFINALIS',event,both(lowered,{'allyAbility':{'who':'user','values':[aid]}}),times(1/0.75),src('1480-1481,1504,1521,1705,1734-1735; PBStuff.rb:87'))
    handler('FROZENDIMENSION','solarpower','onModifySpA',[],1492)
    # Pure Power doubles the special attacking stat instead of Attack on Psychic Terrain, hard field or overlay.
    handler('PSYTERRAIN','purepower','onModifyAtk',[],1517)
    handler(others('PSYTERRAIN'),'purepower','onModifyAtk',[],1517,condition=overlay('PSYTERRAIN'))
    # The existing Psychic Terrain specialAttack rule already runs for an overlay.
    for aid in ['plus','minus']:
        handler('SHORTCIRCUIT ELECTERRAIN',aid,'onModifySpA',times(1.5),'1495-1499')
        handler(others('SHORTCIRCUIT ELECTERRAIN'),aid,'onModifySpA',times(1.5),'1495-1499',condition=overlay('ELECTERRAIN'))
    handler('NEWWORLD','hadronengine','onModifySpA',times(RATIO),1503)
    handler('NEWWORLD','orichalcumpulse','onModifyAtk',times(RATIO),1523)
    handler('FACTORY','steelworker','onModifyAtk onModifySpA',times(2),1531,condition=movetype('Steel'))
    handler('ROCKY MOUNTAIN VOLCANICTOP SNOWYMOUNTAIN','rockypayload','onModifyAtk onModifySpA',times(2),1533,condition=movetype('Rock'))
    handler('ELECTERRAIN','transistor','onModifyAtk onModifySpA',times(1.6),1535,condition=movetype('Electric'))
    handler('DRAGONSDEN','dragonsmaw','onModifyAtk onModifySpA',times(2),1536,condition=movetype('Dragon'))
    # Pinch abilities are one elsif chain: a field branch replaces the low-HP branch instead of stacking with it.
    pinch='onModifyAtk onModifySpA'
    handler('VOLCANIC INFERNAL','blaze',pinch,times(1.5),1538,condition=movetype('Fire'))
    handler('FROZENDIMENSION','blaze',pinch,[],1560,condition=movetype('Fire'))
    handler('VOLCANICTOP','blaze',pinch,times(1.5),1540,condition=both(movetype('Fire'),{'volatile':{'who':'user','id':'rejuvenationblazed'}}))
    fields['FROZENDIMENSION']['suppressedConditionCallbacks']={'flashfire':['onModifyAtk','onModifySpA']}
    fields['FROZENDIMENSION']['abilityDamageCategories']={'iceface':{'categories':['Physical','Special'],'nativeCategory':'Physical','source':src('2079-2087')}}
    handler('FOREST GRASSY','overgrow',pinch,times(1.5),1542,condition=movetype('Grass'))
    handler('FOREST','swarm',pinch,times(1.5),1544,condition=movetype('Bug'))
    handler('UNDERWATER','torrent',pinch,times(1.5),1546,condition=movetype('Water'))
    handler('WATERSURFACE','torrent',pinch,times(1.5),1546,condition=both(movetype('Water'),grounded))
    for sym,value in [('FLOWERGARDEN1',1.5),('FLOWERGARDEN2',1.5),('FLOWERGARDEN3',1.8),('FLOWERGARDEN4',1.8),('FLOWERGARDEN5',2)]:
        handler(sym,'swarm',pinch,times(value),'1548-1551',condition=movetype('Bug'))
    handler('FLOWERGARDEN2','overgrow',pinch,[action('conditional',condition={'hp':{'who':'user','op':'<=','fraction':0.67}},actions=times(1.5))],1554,condition=movetype('Grass'))
    for sym,value in [('FLOWERGARDEN3',1.5),('FLOWERGARDEN4',1.8),('FLOWERGARDEN5',2)]:
        handler(sym,'overgrow',pinch,times(value),'1555-1557',condition=movetype('Grass'))
    handler('HAUNTED BEWITCHED HOLY PSYTERRAIN DEEPEARTH DEUXFINALIS','powerspot','onAllyBasePower',times(1.5),1581,condition={'holderIsUser':False})
    handler('FAIRYTALE','steelyspirit','onAllyBasePower',times(2),1590,condition=movetype('Steel'))
    for event in ['attack','specialAttack']:
        rule('STARLIGHT NEWWORLD',event,{'sideAbility':{'who':'user','values':['victorystar']}},times(1.5),src('1593-1597'))
        rule('WATERSURFACE UNDERWATER',event,both(ability('propellertail'),{'priority':{'op':'>=','value':1}}),times(1.5),src('1598-1600'))
    rule('COLOSSEUM','damage',both(ability('skilllink'),{'variableMultihit':True}),times(1.2),src(1618))
    handler('BACKALLEY CITY','hustle','onModifyAtk',times(1.75),1678)

    # ---- Defense (1724-1726) ----
    handler('MISTY RAINBOW FAIRYTALE DRAGONSDEN STARLIGHT DEUXFINALIS','marvelscale','onModifyDef',times(1.5),1724)
    handler(others('MISTY RAINBOW FAIRYTALE DRAGONSDEN STARLIGHT DEUXFINALIS'),'marvelscale','onModifyDef',times(1.5),1724,condition=overlay('MISTY'))
    handler('FOREST','grasspelt','onModifyDef',times(1.5),1726)

    # ---- Final damage (1789-1826) ----
    handler('DIMENSIONAL','shadowshield','onSourceModifyDamage',times(0.5),1811)
    handler('STARLIGHT NEWWORLD DARKCRYSTALCAVERN','shadowshield','onSourceModifyDamage',times(0.75),1812,condition={'hitEffectiveness':{'op':'>','value':0}},mode='append')
    veil=both(movetype('Poison'),{'sideAbility':{'who':'target','values':['pastelveil']}})
    rule('MISTY RAINBOW','damage',veil,times(0.5),src(1821))
    rule(others('MISTY RAINBOW'),'damage',both(veil,overlay('MISTY')),times(0.5),src(1821))
    # effects[:TeraShell] is set by the full-HP activation and lasts for the rest of that attack (Battle_Move.rb:1057-1060).
    handler('CRYSTALCAVERN','terashell','onSourceModifyDamage',times(0.5),1822,condition={'holderAbilityState':'resisted'})
    flowerveil={'sideAbility':{'who':'target','values':['flowerveil']}}
    rule('FLOWERGARDEN3 FLOWERGARDEN4 FLOWERGARDEN5','damage',both(flowerveil,anyof(ability('flowerveil','target'),{'type':{'who':'target','value':'Grass'}})),times(0.75),src('1823-1826'))
    # A critical hit against a side holding an Amulet Coin gets no 1.5, keeps screens and shows no critical message on Deux Finalis.
    fields['DEUXFINALIS']['criticalPolicy']={'condition':{'sideItem':{'who':'target','values':['amuletcoin']}},'modifier':1,'applyScreens':True,'hideMessage':True,'source':src('1129-1133,1789,2211')}
    fields['CONCERT1']['damageRoll']=85;fields['CONCERT4']['damageRoll']=100

    # ---- Removed weaknesses (520-532) ----
    weak={'Grass':['Fire','Ice','Poison','Flying','Bug'],'Ice':['Fire','Fighting','Rock','Steel'],'Dragon':['Ice','Dragon','Fairy'],'Steel':['Fire','Fighting','Ground'],'Fairy':['Poison','Steel']}
    def neutral(syms,defend,condition,line):
        for sym in syms.split():
            for attack in weak[defend]:fields[sym].setdefault('typeChart',[]).append({'attackType':attack,'defenseType':defend,'value':0,'condition':condition or ALWAYS,'source':line if isinstance(line,str) and '.rb:' in line else src(line)})
    neutral('FLOWERGARDEN4 FLOWERGARDEN5','Grass',None,'520-522')
    neutral('SNOWYMOUNTAIN ICY','Ice',{'effectiveAbility':{'who':'target','values':['icescales']}},'523-525')
    neutral('DRAGONSDEN','Dragon',{'effectiveAbility':{'who':'target','values':['multiscale']}},527)
    neutral('DRAGONSDEN','Steel',{'effectiveAbility':{'who':'target','values':['goodasgold']}},528)
    neutral('BEWITCHED','Fairy',{'sideAbility':{'who':'target','values':['pastelveil']}},'530-532')

    # ---- Accuracy (904-913) ----
    steady=both(ability('owntempo innerfocus purepower sandveil stalwart steadfast'),neg(ability('unnerve asonespectrier asoneglastrier','target')))
    rule('ASHENBEACH','perfectAccuracy',steady,[action('baseAccuracy')],src('904-906'))
    handler('BACKALLEY CITY','hustle','onSourceModifyAccuracy',times(0.67),911,condition=physical)
    handler('DESERT ASHENBEACH','sandveil','onModifyAccuracy',times(0.8),912)
    handler('ICY SNOWYMOUNTAIN FROZENDIMENSION','snowcloak','onModifyAccuracy',times(0.8),913)
    # Cave: damaging Ground moves skip every airborne immunity (Levitate, Air Balloon, Magnet Rise, Telekinesis); the
    # Flying-type row of the type chart is already neutral there (445-446, 711-724).
    rule('CAVE','modifyMove',both({'moveType':'Ground'},neg({'category':'Status'})),[action('moveProperty',path='ignoreImmunity',value={'Ground':True})],src('711-724'))
    handler('ICY','liquidvoice','onModifyType',[action('conditional',condition={'zMove':False},actions=[action('moveType',type='Ice')])],'PBMove.rb:140',condition={'flag':'sound'})
    handler('ASHENBEACH','chifocus','onModifyCritRatio',[action('set',value=4)],982)
    handler('ASHENBEACH','chifocus','onAllyModifyCritRatio',[action('set',value=4)],982)

    # Rejuvenation compares fully modified stats for smart categories, including
    # shared Glitch Special, Battery and field-activated Flare Boost.
    for sym in fields:
        flare=both(ability('flareboost'),{'always':False}) if sym=='FROZENDIMENSION' else both(ability('flareboost'),ALWAYS if sym in ['VOLCANIC','INFERNAL'] else {'pokemonStatus':'brn'})
        special=[{'condition':{'allyAbility':{'who':'user','values':['battery']}},'factor':1.5 if sym=='ELECTERRAIN' else 1.3},{'condition':flare,'factor':1.5}]
        common={'specialMultipliers':special,'physicalMultipliers':[],'defenseMultipliers':[],'specialDefenseMultipliers':[]}
        rule(sym,'modifyMove',anyof({'move':'photongeyser'},{'move':'lightthatburnsthesky'}),[action('moveBehavior',recipe='smartCategory',comparison='offense',contactByCategory=False,**common)],src('359-390'))
        shell={**common,'physicalMultipliers':[{'condition':ability('toughclaws'),'factor':1.3}],
            'defenseMultipliers':[{'condition':both({'effectiveAbility':{'who':'target','values':['fluffy']}},neg(ability('longreach'))),'factor':2}],
            'specialDefenseMultipliers':[{'condition':{'effectiveAbility':{'who':'target','values':['icescales']}},'factor':2}]}
        rule(sym,'modifyMove',{'move':'shellsidearm'},[action('moveBehavior',recipe='smartCategory',comparison='difference',contactByCategory=True,**shell)],src('359-390'))
        rule(sym,'modifyMove',both({'move':'terastarstorm'},{'species':{'who':'user','value':'terapagos'}},{'formName':{'who':'user','value':'Stellar'}}),[action('moveBehavior',recipe='smartCategory',comparison='offense',contactByCategory=False,**common)],src('359-390; Battle_MoveEffects.rb:9817-9838'))

    # Defender-held Never-Melt Ice reduces the attack stat, before defense and final damage.
    for sym in fields:
        cold=ALWAYS if sym=='FROZENDIMENSION' else {'stateFlag':'neverMeltIce'}
        for event in ['attack','specialAttack']:
            rule(sym,event,both(movetype('Fire'),{'item':{'who':'target','values':['nevermeltice']}},cold),times(.66)+[action('moveMessage',text="The Never-Melt Ice's sheer cold weakened {move}'s power!")],src('1570-1573,1939-1944'))
    rule('CHESS','modifyMove',{'move':'kowtowcleave'},[action('moveBehavior',recipe='partialProtection',conditions=['protect','kingsshield','obstruct','spikyshield','banefulbunker','silktrap','burningbulwark','matblock','wideguard','quickguard'],fraction=.25,message="{1} couldn't fully protect itself and got hurt!")],src('1185-1196'))
    for sym in ['CONCERT1','CONCERT2','CONCERT3']:
        rule(sym,'criticalMessage',ALWAYS,[action('progress',amount=1,message='The critical hit is getting the crowd hyped!')],src('2211-2217; Battle_Field.rb:825-844'))
    fields['SKY']['extraTypePolicies']={'Flying':{'mode':'firstWeaknessTwice','source':src('779-781 (type1 is deliberately tested twice)')}}

    rule('UNDERWATER','attack',both(neg({'type':{'who':'user','value':'Water'}}),neg({'attackType':'Water'}),neg(ability('eelevate steelworker swiftswim'))),times(.5),src('1528'))
