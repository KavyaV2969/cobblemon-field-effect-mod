"""Ordinary distributed ability handlers, with explicit source semantics."""
def extend(fields,rule,action,both):
    def ability(a,who='user'):return {'ability':{'who':who,'values':a.split()}}
    def handler(syms,aid,callback,actions,line,mode='replace',condition=None):
        for sym in syms.split():fields[sym].setdefault('abilityHandlers',{}).setdefault(aid,{})[callback]={'mode':mode,'condition':condition or {'always':True},'actions':actions,'source':'Battler.rb:'+str(line)}
    def boost(stats):return action('boost',stats=stats)
    def contact(who='target'):return {'contact':{'who':who}}
    def safe_secondary():return both({'not':{'effectiveAbility':{'who':'target','values':['shielddust']}}},{'not':{'item':{'who':'target','values':['covertcloak']}}})
    # Source :CONCERT is an inactive identifier, not CONCERT1-4. Preserve it.
    handler('BIGTOP CAVE','punkrock','onBasePower',[action('multiply',value=1.5)],1828,condition={'flag':'sound'})
    handler('BIGTOP CAVE FOREST','junglebeat','onBasePower',[action('multiply',value=1.5)],1828,condition={'flag':'sound'})
    handler('GLITCH SHORTCIRCUIT','defragment','onStart',[action('boost',stats={'def':1,'spd':1},message='{1} is glitching out!',messagePlacement='before')],3165)
    defensive_comparison={'statSumComparison':{'left':'spa','right':'atk','group':'foes','op':'>'}}
    handler('FACTORY CITY BACKALLEY','defragment','onStart',[action('conditional',condition=defensive_comparison,actions=[boost({'spd':2})]),action('conditional',condition={'not':defensive_comparison},actions=[boost({'def':2})])],3189)
    handler('MISTY RAINBOW FAIRYTALE','soulheart','onAnyFaint',[boost({'spa':1,'spd':1})],1400)
    handler('DEUXFINALIS','soulheart','onAnyFaint',[boost({'atk':1,'spa':1})],1407)
    handler('SHORTCIRCUIT ELECTERRAIN','static','onDamagingHit',[action('conditional',condition=both(contact(),{'chance':{'numerator':6,'denominator':10}}),actions=[action('status',who='target',status='par')])],3669)
    powder_immune={'any':[{'type':{'who':'target','value':'Grass'}},ability('overcoat','target'),{'item':{'who':'target','values':['safetygoggles']}}]}
    handler('FOREST WASTELAND BEWITCHED','effectspore','onDamagingHit',[action('conditional',condition=both(contact(),{'not':powder_immune},{'chance':{'numerator':6,'denominator':10}}),actions=[action('randomStatus',who='target',values=['psn','slp','par'])])],3635)
    handler('WASTELAND CORRUPTED','poisonpoint','onDamagingHit',[action('conditional',condition=both(contact(),{'chance':{'numerator':6,'denominator':10}}),actions=[action('status',who='target',status='psn')])],3657)
    handler('FROZENDIMENSION','flamebody','onDamagingHit',[],3651)
    for sym in ['DESERT','ASHENBEACH','SKY']:
        fields[sym]['conditionDurations']['sandstorm']['sourceAbilities'].append('sandspit')
    handler('DESERT ASHENBEACH','sandspit','onDamagingHit',[action('setWeather',id='sandstorm',onSuccess=[action('boost',who='target',stats={'accuracy':-1})])],3897)
    handler('GLITCH SHORTCIRCUIT','download','onStart',[action('boost',stats={'atk':1,'spa':1},message='{1} is glitching out!',messagePlacement='before')],3126)
    comparison={'statSumComparison':{'left':'spd','right':'def','group':'foes','op':'>'}}
    handler('FACTORY CITY BACKALLEY','download','onStart',[action('conditional',condition=comparison,actions=[boost({'atk':2})]),action('conditional',condition={'not':comparison},actions=[boost({'spa':2})])],3150)
    for aid,stats,message in [('dauntlessshield',{'def':1,'spd':1},"The fighting master's shield protects {1}!"),('intrepidsword',{'atk':1,'spa':1},"The fairy king's sword empowered {1}!")]:
        handler('FAIRYTALE COLOSSEUM',aid,'onStart',[action('boost',stats=stats,message=message)],3219)
    rule('GLITCH','pokemonEntry',ability('quarkdrive'),[action('forcedType',type='???',message='{1} was corrupted by the rogue data!')],'Battler.rb:3157-3163')
    for sym in fields:
        pending={'pokemonFlag':{'who':'user','id':'hero_pending','value':True}}
        rule(sym,'formChange',both(ability('zerotohero'),{'species':{'who':'user','value':'palafin'}},{'formName':{'who':'user','value':'Hero'}}),[action('setPokemonFlag',id='hero_pending',value=True)],'Battler.rb:1929-1940 (native Hero transformation); 3269-3279')
        acts=[action('setPokemonFlag',id='hero_pending',value=False)]
        if sym=='BIGTOP':acts=[action('volatile',id='helpinghand'),action('message',text='The crowd cheers for {1}!')]+acts
        rule(sym,'pokemonEntry',pending,acts,'Battler.rb:3269-3279 (consume transformation marker only on first send-out)')
    handler('CORRUPTED','poisontouch','onSourceDamagingHit',[action('conditional',condition=both(contact('user'),safe_secondary(),{'chance':{'numerator':6,'denominator':10}}),actions=[action('status',who='target',status='psn')])],3597)
    rule('WASTELAND','afterHit',both(ability('corrosion'),safe_secondary(),{'chance':{'numerator':1,'denominator':10}}),[action('randomStatus',who='target',values=['brn','psn','par','frz'])],'Battler.rb:3568-3590')
    handler('WASTELAND','gooey','onDamagingHit',[action('conditional',condition=contact(),actions=[action('status',who='target',status='psn')])],3710,mode='append')
    handler('HOLY','justified','onDamagingHit',[boost({'atk':2})],3824,condition={'attackType':'Dark'})
    handler('ASHENBEACH','watercompaction','onDamagingHit',[boost({'def':2,'spd':2})],3865,condition={'attackType':'Water'})
    handler('HOLY','cursedbody','onDamagingHit',[],3747)
    handler('HAUNTED','cursedbody','onDamagingHit',[action('conditional',condition=both(
        {'any':[{'chance':{'numerator':3,'denominator':10}},{'hp':{'who':'user','op':'<=','fraction':0}}]},
        {'not':{'volatile':{'who':'target','id':'disable'}}},{'usableMove':{'who':'target'}},
        {'hp':{'who':'target','op':'>','fraction':0}}),actions=[action('volatile',id='disable',who='target')])],3747)
    handler('CORROSIVEMIST','aftermath','onDamagingHit',[action('conditional',condition=both(contact(),{'hp':{'who':'user','op':'<=','fraction':0}},{'not':{'globalAbility':['damp']}},{'not':ability('magicguard','target')}),actions=[action('damage',who='target',fraction=.5)])],3609)
    handler('BIGTOP','costar','onStart',[boost({'atk':1,'spa':1})],3410,mode='append',condition={'hasAlly':True})
    for sym in ['BEWITCHED','GRASSY','FLOWERGARDEN2','FLOWERGARDEN3','FLOWERGARDEN4','FLOWERGARDEN5']:
        handler(sym,'cottondown','onDamagingHit',[action('forEach',group='others',actions=[action('boost',who='target',stats={'spe':-2})])],3875)
    # Flower Gift is active on every Flower Garden stage and on Bewitched Woods (Battle_Effects.rb:1394-1401): the side's
    # physical Attack and Special Defense, and Cherrim's Sunshine form at the two moments the source re-reads the form
    # (entry and weather changes, pbCheckWeatherForm).
    garden='FLOWERGARDEN1 FLOWERGARDEN2 FLOWERGARDEN3 FLOWERGARDEN4 FLOWERGARDEN5 BEWITCHED'
    for callback in ['onAllyModifyAtk','onAllyModifySpD']:handler(garden,'flowergift',callback,[action('multiply',value=1.5)],'1634-1646; Battle_Effects.rb:1394-1401; Battle_Move.rb:1510,1711')
    cherrim=both({'species':{'who':'user','value':'cherrim'}},{'not':{'transformed':True}})
    for callback in ['onStart','onWeatherChange']:handler(garden,'flowergift',callback,[action('form',species='cherrimsunshine',message='{1} transformed!')],'1634-1646',condition=cherrim)
    # pbAbilityCureCheck (Battler.rb:4081) still cures the holder's own poison on Infernal, so onUpdate stays native.
    for callback in ['onStart','onAllySwitchIn','onSetStatus','onAllySetStatus']:
        handler('INFERNAL','pastelveil',callback,[],3042)
    # Stench is appended after retaining existing move secondaries, avoiding an
    # extra flinch roll on moves that already flinch.
    handler('WASTELAND MURKWATERSURFACE BACKALLEY CITY','stench','onModifyMove',
        [action('addSecondary',effect={'chance':20,'volatileStatus':'flinch'},duplicateKey='volatileStatus')],3552,
        condition={'not':{'category':'Status'}})
    handler('CITY','frisk','onStart',[action('message',text='Just a routine inspection.'),action('forEach',group='foes',actions=[action('boost',who='target',stats={'spd':-1})])],3294,mode='prepend')
    handler('BACKALLEY','frisk','onStart',[action('forEach',group='foes',actions=[action('stealItem',message="Don't mind if I do!")])],3315,mode='append')
    rule('BACKALLEY','basePower',both({'any':[{'move':'thief'},{'move':'covet'}]},{'itemStealable':True},{'wild':{'who':'user','value':False}}),[action('multiply',value=2)],'Battle_MoveEffects.rb:5826-5835')
    standard_types=['Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison','Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy']
    for event in ['pokemonEntry','residual']:
        rule('DIMENSIONAL',event,ability('download'),[action('randomType',values=standard_types,message='{1} transformed into the {type} type!')],'Battler.rb:1818-1821')
        for aid,species in [('rkssystem','silvally'),('multitype','arceus')]:
            variants=[{'species':species if t=='Normal' else species+t.lower(),'type':t} for t in standard_types]
            rule('NEWWORLD',event,both(ability(aid),{'species':{'who':'user','value':species}}),[action('randomForm',variants=variants,message='{1} transformed into the {type} type!')],'Battler.rb:1846-1848; Battle_Field.rb:1166-1175')
    rule('DEEPEARTH','formChange',both(ability('powerconstruct'),{'species':{'who':'user','value':'zygarde'}},{'formName':{'who':'user','value':'Complete'}}),[action('message',text="The Core's energy empowered {1}!"),boost(dict.fromkeys(['atk','def','spa','spd','spe'],1))],'Battler.rb:1834-1837')
    # Native forms exist in the installed dex; the school is permitted below
    # level 20 / one-quarter HP by the environment branch in the source.
    for sym in fields:
        environmental={'always':True} if sym=='UNDERWATER' else {'grounded':{'who':'user','value':True}} if sym in ['WATERSURFACE','MURKWATERSURFACE'] else {'always':False}
        school={'any':[environmental,both({'level':{'who':'user','op':'>=','value':20}},{'hp':{'who':'user','op':'>','fraction':.25}})]}
        actions=[action('conditional',condition=school,actions=[action('form',species='wishiwashischool',message='{1} formed a school!')]),action('conditional',condition={'not':school},actions=[action('form',species='wishiwashi',message='{1} stopped schooling!')])]
        for callback in ['onStart','onResidual']:
            handler(sym,'schooling',callback,actions,1739,condition=both({'species':{'who':'user','value':'wishiwashi'}},{'not':{'transformed':True}}))
    # Native Gulp Missile transforms on Surf / Dive; correct its chosen forme
    # immediately, before any retaliation can observe it.
    for syms,desired in [('SWAMP WATERSURFACE UNDERWATER','Gulping'),('ELECTERRAIN FACTORY SHORTCIRCUIT','Gorging')]:
        opposite='Gorging' if desired=='Gulping' else 'Gulping'
        rule(syms,'formChange',both(ability('gulpmissile'),{'species':{'who':'user','value':'cramorant'}},{'formName':{'who':'user','value':opposite}}),[action('form',species='cramorant'+desired.lower())],'Battler.rb:1720-1729')

    retaliation=[action('message',text='{1} spit its catch at {2}!')]
    for forme,extra in [('Gulping',action('boost',who='target',stats={'def':-1})),('Gorging',action('status',who='target',status='par'))]:
        retaliation.append(action('conditional',condition={'formName':{'who':'user','value':forme}},actions=[
            action('form',species='cramorant'),action('typedDamage',who='target',type='Water',fraction=.25,direct=True),extra]))
    handler('UNDERWATER','gulpmissile','onDamagingHit',retaliation,3793,condition=both(
        {'species':{'who':'user','value':'cramorant'}},{'any':[{'formName':{'who':'user','value':v}} for v in ['Gulping','Gorging']]},
        {'hp':{'who':'target','op':'>','fraction':0}},{'pokemonActive':{'who':'target'}}))

    # Native species type callbacks normally re-read the held item every time.
    # Field-induced forms must retain their actual type until the source's next
    # end-round restoration, including when the hard field changes mid-round.
    plates=['fistplate','skyplate','toxicplate','earthplate','stoneplate','insectplate','spookyplate','ironplate','flameplate','splashplate','meadowplate','zapplate','mindplate','icicleplate','dracoplate','dreadplate','pixieplate']
    crystals=['fightiniumz','flyiniumz','poisoniumz','groundiumz','rockiumz','buginiumz','ghostiumz','steeliumz','firiumz','wateriumz','grassiumz','electriumz','psychiumz','iciumz','dragoniumz','darkiniumz','fairiumz']
    item_types=['Fighting','Flying','Poison','Ground','Rock','Bug','Ghost','Steel','Fire','Water','Grass','Electric','Psychic','Ice','Dragon','Dark','Fairy']
    for sym in fields:
        fields[sym]['nativeFormTyping']=['arceus','silvally']
        if sym=='NEWWORLD':continue
        for aid,species in [('multitype','arceus'),('rkssystem','silvally')]:
            cond=both(ability(aid),{'species':{'who':'user','value':species}})
            if species=='silvally' and sym=='GLITCH':
                acts=[action('forcedType',type='???',message='{1} was corrupted by the rogue data!')]
            elif species=='silvally' and sym=='HOLY':
                acts=[action('form',species='silvallydark',type='Dark',message='A false god holds no power here...')]
            else:
                if species=='arceus':cond=both(cond,{'not':{'type':{'who':'user','value':'???'}}})
                variants=[{'items':[t.lower()+'memory'] if species=='silvally' else [plates[i],crystals[i]],'species':species+t.lower(),'type':t} for i,t in enumerate(item_types)]
                acts=[action('itemForm',defaultSpecies=species,defaultType='Normal',variants=variants,message='{1} reverted to the {type} type!')]
            for event in ['pokemonEntry','residual']:rule(sym,event,cond,acts,'Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)')
    handler('ASHENBEACH PSYTERRAIN','zenmode','onResidual',[action('form',species='darmanitanzen',message='Zen Mode triggered!')],1767,condition=both(
        {'species':{'who':'user','value':'darmanitan'}},{'any':[{'formName':{'who':'user','value':''}},{'formName':{'who':'user','value':'Zen'}}]}))
    for event in ['pokemonEntry','residual']:
        rule('ASHENBEACH PSYTERRAIN',event,both(ability('zenmode'),{'species':{'who':'user','value':'darmanitan'}},{'formName':{'who':'user','value':''}}),[action('form',species='darmanitanzen',message='Zen Mode triggered!')],'Battler.rb:1767-1782; 2746')
        rule('VOLCANIC VOLCANICTOP INFERNAL',event,both({'species':{'who':'user','value':'eiscue'}},{'formName':{'who':'user','value':''}}),
            [action('form',species='eiscuenoice',message='{1} transformed!')],'Battler.rb:1809-1816; 2746')

    for syms,aid,stats in [('BACKALLEY','defiant',{'atk':3}),('COLOSSEUM','defiant',{'atk':2,'def':2}),('CITY','competitive',{'spa':3}),('COLOSSEUM','competitive',{'spa':2,'spd':2}),('CHESS','competitive',None)]:
        handler(syms,aid,'onAfterEachBoost',[boost(stats)] if stats else [],900,
            condition=both({'statsLowered':True},{'not':{'samePokemon':True}}))
    for callback,acts,condition in [
        ('onAllyTryBoost',[action('preventStatLoss',message='{1} surrounded itself with a veil of petals!')],{'not':{'selfInflicted':True}}),
        ('onAllySetStatus',[action('message',who='target',text='{1} surrounded itself with a veil of petals!'),action('reject')],{'not':{'selfInflicted':True}}),
        ('onAllyTryAddVolatile',[action('reject')],{'status':'yawn'})]:
        handler('BEWITCHED','flowerveil',callback,acts,91,condition=condition)
    for sym in fields:
        acts=[action('progress',amount=1,message='{1} grew the garden!')] if sym in ['FLOWERGARDEN1','FLOWERGARDEN2','FLOWERGARDEN3','FLOWERGARDEN4'] else [action('createField',field='rejuvenation:grassy_terrain',duration=8 if sym in ['FOREST','BEWITCHED'] else 5,extendedBy=0 if sym in ['FOREST','BEWITCHED'] else 3,blockEverstone=False)]
        handler(sym,'seedsower','onDamagingHit',acts,3926)
    for sym in ['CORROSIVE','CORROSIVEMIST']:
        fields[sym]['statusTypeBypass']=[{'status':'psn','condition':ability('toxicchain'),'source':'Battle_Effects.rb:211'}]
    fields['ELECTERRAIN']['inactiveAbilities']=['comatose']
    for callback in ['onStart','onSetStatus']:
        handler('ELECTERRAIN','comatose',callback,[],1131)
