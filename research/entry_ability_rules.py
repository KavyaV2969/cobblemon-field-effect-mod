"""Ordinary field branches of the Battler.rb entry-ability code (pbAbilitiesOnField, pbAbilitiesOnSwitchIn)."""
def extend(fields,rule,action,both):
    def ability(a,who='user'):return {'ability':{'who':who,'values':a.split()}}
    def src(line):return 'Battler.rb:'+str(line)
    def raised(stats,text=None):return [action('boost',stats=stats,message=text,messagePlacement='before')] if text else [action('boost',stats=stats,guarded=True)]
    def foes(actions):return [action('forEach',group='foes',actions=[action('conditional',condition={'not':{'volatile':{'who':'target','id':'substitute'}}},actions=actions)])]
    def handler(syms,aid,callback,actions,line,mode='replace',condition=None):
        for sym in syms.split():
            slot=fields[sym].setdefault('abilityHandlers',{}).setdefault(aid,{})
            if callback in slot:raise ValueError(f'Duplicate handler {sym} {aid} {callback}')
            slot[callback]={'mode':mode,'condition':condition or {'always':True},'actions':actions,'source':src(line)}
    # Chess: Stall keeps its Defense rule and gains the source flavor.
    for r in fields['CHESS']['rules']:
        if r['event']=='switchIn' and r['condition']==ability('stall stancechange'):r['condition']=ability('stancechange')
    rule('CHESS','switchIn',ability('stall'),raised({'def':1},'{1} is playing defensively!'),src('2037-2044'))
    spotlight=[action('volatile',who='target',id='followme'),action('message',text="{1}'s dazzling shine put a spotlight on its partner!")]
    rule('STARLIGHT','switchIn',ability('illuminate'),[action('forEach',group='allies',actions=[action('conditional',condition=ability('mirrorarmor','target'),actions=spotlight)])],src('2203-2207'))
    dims='DIMENSIONAL FROZENDIMENSION DEUXFINALIS'
    rule(dims,'switchIn',ability('pressure'),foes([action('boost',who='target',stats={'def':-1,'spd':-1})]),src('2286-2291'))
    rule(dims,'switchIn',ability('unnerve asoneglastrier asonespectrier'),foes([action('boost',who='target',stats={'spe':-1})]),src('2292-2299'))
    rule('HAUNTED','switchIn',both(ability('shadowtag'),{'actorType':{'who':'user','values':['player']}}),[action('identifyItems',message="{1}'s shadow frisked {2} and found its {3}!")],src('2321-2331'))
    rule('SKY','switchIn',ability('levitate'),raised({'spe':1}),src('2343-2349'))
    rule('SKY','switchIn',ability('cloudnine'),[action('clearWeather')],src('2350-2352'))
    for abil,text in [('magnetpull','The strong magnetism causes {1} to float!'),('unaware oblivious','{1} fails to notice the intense gravity...'),('contrary',"Gravity's just a theory, after all...")]:
        rule('DEEPEARTH','switchIn',ability(abil),[action('abilityMessage'),action('message',text=text)],src('2417-2424'))
    rule('CONCERT1 CONCERT2 CONCERT3','switchIn',ability('plus galvanize heavymetal solidrock punkrock'),[action('progress',amount=1,message='{1} is getting the crowd hyped!')],src('2445-2447; Battle_Field.rb:830-832'))
    rule('CONCERT2 CONCERT3 CONCERT4','switchIn',ability('minus klutz'),[action('progress',amount=-1,message='The crowd is booing!')],src('2448-2452; Battle_Field.rb:850-852'))
    rule('BACKALLEY','switchIn',ability('pickpocket merciless'),raised({'atk':1},'Merciless cutpurses get ready to strike!'),src('2455-2462'))
    rule('BACKALLEY','switchIn',ability('magician'),raised({'spa':1},'The street magician plays its tricks!'),src('2463-2470'))
    rule('BACKALLEY','switchIn',ability('anticipation forewarn'),raised({'def':1,'spd':1},'{1} is getting ready to defend itself!'),src('2471-2478'))
    rule('BACKALLEY','switchIn',ability('rattled'),raised({'spe':1},'The gloomy backalley makes {1} ready to bolt!'),src('2479-2486'))
    rule('CITY','switchIn',ability('earlybird'),raised({'atk':1},'The early bird catches the worm!'),src('2489-2496'))
    rule('CITY','switchIn',ability('bigpecks'),raised({'def':1}),src('2497-2503'))
    rule('CITY','switchIn',ability('rattled'),raised({'spe':1},'The busy city is rattling {1}!'),src('2504-2515'))
    rule('CITY','switchIn',ability('pickup'),raised({'spe':1},'{1} is picking up speed!'),src('2504-2515'))
    rule('DEUXFINALIS','pokemonEntry',ability('neutralizinggas'),[action('clearBoosts',message='All stat changes have been cleared!')],src('2765-2776'))
    # setField(..., 0, ...) replaces the field permanently; the attached duration condition is never consulted for a permanent field.
    handler('DEUXFINALIS','primordialsea','onStart',[action('conditional',condition={'weather':'primordialsea'},actions=[action('changeField',field=fields['DIMENSIONAL']['id'],message='The salt world was flooded!')])],'2786-2791',mode='append')
    handler('GRASSY','desolateland','onStart',[action('conditional',condition={'weather':'desolateland'},actions=[action('changeField',field=fields['DESERT']['id'],message='The extremely harsh sunlight dried out the meadow!')])],'2803-2806',mode='append')
    handler('NEWWORLD','hadronengine','onStart',[action('abilityMessage'),action('message',text='{1} used the energy of the New World to energize its futuristic engine!')],'2822-2823')
    handler('ELECTERRAIN','hadronengine','onStart',[action('abilityMessage'),action('message',text='{1} used the Electric Terrain to energize its futuristic engine!')],'2824-2825')
    handler('NEWWORLD','orichalcumpulse','onStart',[action('abilityMessage'),action('message',text="The energy of the New World sent {1}'s ancient pulse into a frenzy!")],'2960-2961')
    handler('BEWITCHED','curiousmedicine','onStart',[action('abilityMessage'),action('clearBoosts',message='All stat changes on the field were eliminated!',always=True)],'2883-2893')
    # Dimensional rolls 3-8 turns for weather from moves and abilities alike; the roll replaces the rock extension.
    for weather,moves,abilities,line in [('sunnyday',['sunnyday'],['drought','orichalcumpulse'],'6218; Battler.rb:2968'),('raindance',['raindance'],['drizzle'],'6233; Battler.rb:2941'),
            ('sandstorm',['sandstorm'],['sandstream'],'6248; Battler.rb:2953'),('snow',['snowscape','chillyreception'],['snowwarning'],'6203; Battler.rb:2983'),('hail',['hail'],['snowwarning'],'6203; Battler.rb:2983')]:
        fields['DIMENSIONAL']['conditionDurations'][weather]={'duration':5,'sourceMoves':moves,'sourceAbilities':abilities,
            'choices':[{'condition':{'always':True},'randomRange':{'minimum':3,'maximum':8}}],'source':'Battle_MoveEffects.rb:'+line}
