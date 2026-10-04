"""Ordinary field-native Petrification, reviewed against the supplied v14 code.

No Decimation/custom move or Crest implementation is included.
"""
def extend(fields,rule,action,both):
    for f in fields.values():
        f['persistentStatusPolicies']={'ptr':{
            'name':'Petrification','immuneTypes':['Rock'],
            'immuneAbilities':['fairyaura','darkaura','aurabreak','roughskin'],
            'sideProtectionAbility':'fairyaura','drainAbility':'darkaura',
            'invertAbility':'aurabreak','fraction':.125,'blocksHealing':True,
            'blockedHealingAbilities':['regenerator'],
            'drainMessage':"{1}'s health is sapped by the {2}'s dark aura!",
            'healingFailureMessage':"{1} is prevented from healing, so it can't use {2}!",
            'source':'Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459'}}
    rule('DEUXFINALIS','modifyMove',{'move':'freezingglare'},
         [action('moveProperty',path='secondaries.0.status',value='ptr')],'Battle_MoveEffects.rb:414-417')
    rule('DEUXFINALIS','modifyMove',{'move':'bittermalice'},
         [action('moveProperty',path='secondaries.0.status',value='ptr')],'Battle_MoveEffects.rb:1381-1384')
    rule('DEUXFINALIS','modifyMove',{'move':'bitterblade'},
         [action('moveProperty',path='secondaries',value=[{'chance':100,'status':'ptr'}])],'Battle_MoveEffects.rb:5373-5376')
    for syms,mid,callback,line in [
        ('DEUXFINALIS DIMENSIONAL FROZENDIMENSION','ruination','onAfterHit',2447),
        ('DEUXFINALIS DIMENSIONAL FROZENDIMENSION','oblivionwing','onAfterHit',7157)]:
        rule(syms,'modifyMove',{'move':mid},[action('moveBehavior',recipe='appendHitActions',callback=callback,
             actions=[action('status',status='ptr',who='target')])],'Battle_MoveEffects.rb:'+str(line))
    # Defender/user roles on stat hooks follow the existing runtime convention.
    rule('DEUXFINALIS','basePower',both({'ability':{'who':'user','values':['beadsofruin']}},
         {'targetStatus':'ptr'}),[action('multiply',value=1.3)],'Battle_Move.rb:1285')
    for event,aid,line in [('defense','tabletsofruin',1716),('specialDefense','vesselofruin',1733)]:
        rule('DEUXFINALIS',event,both({'ability':{'who':'user','values':[aid]}},{'targetStatus':'ptr'}),
             [action('multiply',value=1.3)],'Battle_Move.rb:'+str(line))
    rule('DEUXFINALIS','afterHit',both({'ability':{'who':'user','values':['swordofruin']}},
         {'not':{'effectiveAbility':{'who':'target','values':['shielddust']}}},
         {'not':{'item':{'who':'target','values':['covertcloak']}}}),
         [action('status',status='ptr',who='target')],'Battler.rb:3563-3566')
    rule('DEUXFINALIS','residual',both({'pokemonStatus':'ptr'},
         {'not':{'sideAbility':{'who':'user','values':['fairyaura']}}}),
         [action('boost',stats={'spe':-1}),action('groupMessage',text="The Pokémon's Speed sank...")],
         'Battle.rb:5961-5965,6223')
    # Source requires BOTH Perish Song counters to be zero, unlike Showdown.
    for sym,f in fields.items():
        f['abilityContactPolicies']={'perishbody':{
            'disabled':sym=='HOLY','duration':1 if sym=='INFERNAL' else 3,
            'trapDefender':sym in ['DIMENSIONAL','HAUNTED','INFERNAL'],
            'forceAttackerStatus':'ptr' if sym=='DEUXFINALIS' else '',
            'message':'Both Pokémon will faint in one turn!' if sym=='INFERNAL' else 'Both Pokémon will faint in three turns!',
            'source':'Battler.rb:3683-3705'}}
