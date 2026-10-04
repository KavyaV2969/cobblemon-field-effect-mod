"""Ordinary field branches of Battle_MoveEffects.rb found by the handler-by-handler audit."""
def extend(fields,rule,action,both):
    def anyof(*cs):return {'any':list(cs)}
    def neg(c):return {'not':c}
    def src(line):return 'Battle_MoveEffects.rb:'+str(line)
    def move(syms,mid,actions,line):rule(syms,'modifyMove',{'move':mid},actions,src(line))
    def hit(syms,mid,actions,line,callback='onHit'):move(syms,mid,[action('moveBehavior',recipe='appendHitActions',callback=callback,actions=actions)],line)
    def fixed(syms,mid,line,**row):move(syms,mid,[action('moveBehavior',recipe='fixedDamage',**row)],line)
    # Sweet Kiss wakes a sleeping target before confusing it
    hit('FAIRYTALE','sweetkiss',[action('conditional',condition=both({'targetStatus':'slp'},{'volatile':{'who':'target','id':'confusion'}}),actions=[action('cureStatus',who='target')])],'559-563')
    # Confide flavor
    rule('PSYTERRAIN','tryHit',both({'move':'confide'},{'boostStage':{'who':'target','stat':'spa','op':'>','value':-6}}),[action('message',text='Psst... This field is pretty weird, huh?')],src('1440-1442'))
    # String Shot: a random stat also drops (Speed again when Speed is drawn)
    hit('SWAMP','stringshot',[action('randomStat',who='target',stats=['atk','def','spa','spd','spe'],amount=-1)],'1637-1643')
    # Worry Seed
    hit('GRASSY','worryseed',[action('boost',who='target',stats={'atk':-1})],'2251-2253')
    # Fixed-damage moves
    fixed('RAINBOW','sonicboom','2398-2400',basis='constant',factor=1,amount=140,message="It's a Sonic Rainboom!")
    fixed('DIMENSIONAL FROZENDIMENSION','dragonrage','2415-2417',basis='constant',factor=1,amount=140,message='Unstoppable Rage!')
    fixed('GRASSY FOREST','naturesmadness','2432-2433',basis='targetHP',factor=.75,message=None)
    fixed('HOLY','naturesmadness','2434-2435',basis='targetHP',factor=.66,message=None)
    for mid in ['naturesmadness','ruination']:fixed('NEWWORLD',mid,'2436-2437',basis='targetMaxHP',factor=.5,message=None)
    # One-hit KO immunity
    ohko=anyof(*[{'move':m} for m in ['fissure','guillotine','horndrill','sheercold']])
    rule('COLOSSEUM','tryHit',both(ohko,{'effectiveAbility':{'who':'target','values':['stalwart']}}),[action('abilityMessage',who='target'),action('message',who='target',text="It doesn't affect {1}..."),action('reject')],src('2531-2534'))
    # Misty Explosion
    rule('CORROSIVEMIST','basePower',both({'move':'mistyexplosion'},{'grounded':{'who':'user','value':True}}),[action('multiply',value=1.5)],src(5442))
    # Stat moves
    move('FAIRYTALE DRAGONSDEN','nobleroar',[action('moveProperty',path='boosts',value={'atk':-2,'spa':-2})],7137)
    move('FACTORY','gearup',[action('moveBehavior',recipe='alliesHitActions',condition={'ability':{'who':'target','values':['plus','minus']}},actions=[action('boost',who='target',stats={'atk':2,'spa':2})])],7919)
    move('CORRUPTED','toxicthread',[action('moveProperty',path='status',value='tox')],8255)
    # Lunar Blessing and Jungle Healing restore a third
    for syms,mid in [('STARLIGHT NEWWORLD HOLY','lunarblessing'),('FOREST HOLY NEWWORLD','junglehealing')]:
        move(syms,mid,[action('moveBehavior',recipe='replaceHitActions',actions=[action('heal',who='target',fraction=.33,round=True),action('cureStatus',who='target')])],9064)
    # Draining moves restore three quarters of the damage (5365-5366)
    for syms,mids in [('ELECTERRAIN',['paraboliccharge']),('GRASSY',['absorb','megadrain','gigadrain','hornleech'])]:
        for mid in mids:move(syms,mid,[action('moveProperty',path='drain',value=[3,4])],'5365-5366')
    # Acrobatics is always doubled under the Big Top (2900)
    move('BIGTOP','acrobatics',[action('moveBehavior',recipe='forceBasePower',base=110)],2900)
    # Shore Up packs a Water Compaction user (8099-8105)
    hit('WATERSURFACE MURKWATERSURFACE','shoreup',[action('conditional',condition={'ability':{'who':'user','values':['watercompaction']}},actions=[action('abilityMessage'),action('boost',stats={'def':2})])],'8099-8105')
    # Draining Kiss wakes its target
    hit('FAIRYTALE','drainingkiss',[action('conditional',condition={'targetStatus':'slp'},actions=[action('cureStatus',who='target')])],'7152-7156')
    # Poltergeist flavor (Battle_Move.rb:2003)
    rule('CHESS','basePower',{'move':'poltergeist'},[action('moveMessage',text='The Chess piece came to life!')],src('8980-8982'))
    # Magnitude is not random on the quietest and loudest stage (3176-3178)
    for sym,magnitude,power in [('CONCERT1',4,10),('CONCERT4',10,150)]:
        move(sym,'magnitude',[action('moveProperty',path='magnitude',value=magnitude),action('moveProperty',path='basePower',value=power)],'3177-3178')
    # Pay Day and Make It Rain flavor; the prize money itself has no counterpart in this battle system
    rule('DRAGONSDEN','afterMove',both(anyof({'move':'payday'},{'move':'makeitrain'}),{'connected':True}),[action('message',text='Treasure scattered everywhere!')],src('6426-6427,9493-9494'))
    # Dive breaks thin ice on the turn it strikes (4773 sets the field counter that the INDOOR change condition reads) and
    # announces the hole on the turn it submerges (4779-4787).
    water=anyof({'backup':'rejuvenation:water_surface'},{'backup':'rejuvenation:murkwater_surface'})
    fields['ICY']['moves']['dive']['transition']['condition']=both(water,{'connected':True})
    rule('ICY','chargeMove',both({'move':'dive'},water),[action('message',text='{1} made a hole in the ice!')],src('4779-4787'))
    # A field that turns into Frozen Dimension while it snows turns the snow into hail on its remaining clock (Battle_Field.rb:434).
    rule('FROZENDIMENSION','activate',{'weather':'snow'},[action('setWeather',id='hail',keepDuration=True)],'Battle_Field.rb:434')
    # Matcha Gotcha flavor
    rule('SNOWYMOUNTAIN ICY','afterMove',both({'move':'matchagotcha'},{'drainHealed':True}),[action('message',text='Warm tea tastes best in the cold!')],src(9726))
