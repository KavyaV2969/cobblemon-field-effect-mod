"""Party-role semantics reviewed against Rejuvenation 14.0.14."""
def extend(fields,rule,action,both,ability):
    def role(value,who='user'):return {'role':{'who':who,'value':value}}
    fields['CHESS']['partyRoles']={'tailRole':'queen','frontRole':'pawn','frontCount':{'singles':1,'doubles':2},
        'leaderRole':'king','preferAbilities':['supremeoverlord'],'preferItems':['kingsrock'],
        'remaining':[{'role':'knight','maxStats':['spe']},{'role':'bishop','maxStats':['atk','spa']},{'role':'rook','maxStats':['def','spd']}]}
    # OR, rather than two multipliers, is crucial for a Queen with Queenly Majesty.
    for r in fields['CHESS']['rules']:
        if r['event']=='basePower' and r['condition']==ability('QUEENLYMAJESTY'):
            r['condition']={'any':[r['condition'],role('queen')]}
    rule('CHESS','basePower',both(role('knight'),role('queen','target')),
        [action('multiply',value=3),action('moveMessage',text='An unblockable attack on the Queen!')],'Battle_Move.rb:1402')
    rule('CHESS','modifyMove',both(role('knight'),{'moveTarget':'allAdjacentFoes'}),
        [action('moveProperty',path='spreadModifier',value=1.25),action('moveMessage',text='The knight forked the opponents!')],'Battle_Move.rb:1097')
    rule('CHESS','priority',role('king'),[action('add',value=1)],'Battle_Move.rb:2304')
    for value,label,verb,stats in [('pawn','Pawn','stormed up the board',{}),('king','King','exposed itself',{}),
        ('knight','Knight','readied its position',{}),('bishop','Bishop','took the diagonal',{'atk':1,'spa':1}),
        ('rook','Rook','took the open file',{'def':1,'spd':1}),('queen','Queen','was placed on the center of the board',{'def':1,'spd':1})]:
        actions=[action('message',text='{1} became a '+label+' and '+verb+'!')]
        if stats:actions.append(action('boost',stats=stats))
        rule('CHESS','switchIn',role(value),actions,'Battle.rb:3083')
    rule('CHESS','receivedDamage',role('pawn','target'),[action('survive',who='target',once=True,message='{1} hung on the edge of the board!')],'Battle_Move.rb:2126; Battle_DamageState.rb:37 (once per battler slot)')
    rule('CHESS','tryHit',both(role('pawn','target'),{'any':[{'move':m} for m in ['fissure','sheercold','horndrill','guillotine']]}),[action('reject')],'Battle_MoveEffects.rb:2527')
    rule('COLOSSEUM','receivedDamage',ability('STALWART','target'),[action('survive',who='target',message='{1} endured the hit!')],'Battle_Move.rb:2143')
