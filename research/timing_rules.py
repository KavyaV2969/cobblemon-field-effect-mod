"""Reviewed two-turn timing, Encore/Tailwind clocks and Prankster immunity."""
def extend(fields,rule,action,both):
    for syms,mid,line in [('SKY GRASSY','razorwind',4430),('RAINBOW','solarbeam',4472),('RAINBOW','solarblade',4472),
        ('FROZENDIMENSION','freezeshock',4526),('FROZENDIMENSION','iceburn',4565),('SKY','skyattack',4608),
        ('CAVE SKY DRAGONSDEN','fly',4684),('CAVE SKY DRAGONSDEN','bounce',4808),('DESERT','dig',4719),
        ('WATERSURFACE UNDERWATER','dive',4756),('DIMENSIONAL FROZENDIMENSION HAUNTED SHORTCIRCUIT DEUXFINALIS','phantomforce',4850),
        ('DIMENSIONAL FROZENDIMENSION HAUNTED SHORTCIRCUIT DEUXFINALIS','shadowforce',4850)]:
        rule(syms,'chargeMove',{'move':mid},[action('reject')],'Battle_MoveEffects.rb:'+str(line))
    rule(' '.join(fields),'chargeMove',both({'move':'razorwind'},{'overlay':'rejuvenation:grassy_terrain'}),[action('reject')],'Battle_MoveEffects.rb:4430')
    rule(' '.join(fields),'chargeMove',both({'any':[{'move':'solarbeam'},{'move':'solarblade'}]},{'overlay':'rejuvenation:rainbow'}),[action('reject')],'Battle_MoveEffects.rb:4472')
    # Fail at the move boundary, before a Power Herb or charge turn is consumed.
    rule('DARKCRYSTALCAVERN','tryMove',both({'any':[{'move':'solarbeam'},{'move':'solarblade'}]}, {'not':{'weather':['sunnyday','desolateland']}}),[action('message',text='But it failed!'),action('reject')],'Battle_MoveEffects.rb:4461-4465')
    rule('STARLIGHT','modifyMove',{'move':'meteorassault'},[action('moveProperty',path='self',value=None)],'Battle_MoveEffects.rb:4416')
    rule('GLITCH BEWITCHED','modifyMove',{'always':True},[action('moveProperty',path='pranksterBoosted',value=False)],'Battler.rb:5410')
    for sym,duration in [('MOUNTAIN',6),('SNOWYMOUNTAIN',6),('VOLCANICTOP',6),('SKY',8)]:
        fields[sym].setdefault('conditionDurations',{})['tailwind']={'duration':duration,'sourceMoves':['tailwind'],'source':'Battle_MoveEffects.rb:1952-1953'}
    for sym in ['BIGTOP','CONCERT1','CONCERT2','CONCERT3','CONCERT4']:
        fields[sym].setdefault('conditionDurations',{})['encore']={'add':3,'sourceMoves':['encore'],'source':'Battle_MoveEffects.rb:4269'}
    for sym,f in fields.items():
        clocks=f.setdefault('conditionDurations',{})
        for mid,extended,line in [
            ('gravity',['PSYTERRAIN'],6820),
            ('trickroom',['CHESS','NEWWORLD','PSYTERRAIN','STARLIGHT'],6959),
            ('wonderroom',['NEWWORLD','PSYTERRAIN','STARLIGHT'],7029),
            ('magicroom',['NEWWORLD','PSYTERRAIN','STARLIGHT'],6137)]:
            clocks[mid]={'duration':8 if sym in extended else 5,'sourceMoves':[mid],
                'choices':[{'condition':{'item':{'who':'user','values':['amplifieldrock']}},'duration':8}],
                'source':'Battle_MoveEffects.rb:'+str(line)}
            # Random duration takes precedence over both the field and item.
            if sym=='DIMENSIONAL':clocks[mid]['choices'].insert(0,
                {'condition':{'always':True},'randomRange':{'minimum':3,'maximum':8}})
        clocks['magnetrise']={'duration':8 if sym in ['ELECTERRAIN','FACTORY','SHORTCIRCUIT'] else 5,
            'sourceMoves':['magnetrise'],'choices':[{'condition':{'overlay':'rejuvenation:electric_terrain'},'duration':8}],
            'source':'Battle_MoveEffects.rb:6847'}
    rule('PSYTERRAIN','modifyMove',{'move':'telekinesis'},[action('moveBehavior',recipe='appendHitActions',
         actions=[action('boost',who='target',stats={'def':-2,'spd':-2})])],'Battle_MoveEffects.rb:6880')
    for syms,weather,moves,abilities,line in [
        ('DESERT MOUNTAIN SNOWYMOUNTAIN SKY','sunnyday',['sunnyday'],['drought','orichalcumpulse'],6217),
        ('SKY','raindance',['raindance'],['drizzle'],6232),
        ('DESERT ASHENBEACH SKY','sandstorm',['sandstorm'],['sandstream'],6247),
        ('ICY SNOWYMOUNTAIN FROZENDIMENSION SKY','snow',['snowscape','chillyreception'],['snowwarning'],6202),
        ('ICY SNOWYMOUNTAIN FROZENDIMENSION SKY','hail',['hail','snowscape','chillyreception'],['snowwarning','hailwarning'],6262),
        ('BIGTOP','snow',['chillyreception'],[],9564)]:
        for sym in syms.split():fields[sym]['conditionDurations'][weather]={'duration':8,'sourceMoves':moves,
             'sourceAbilities':abilities,'source':'Battle_MoveEffects.rb:'+str(line)+'; Battler.rb:2937-2994'}
