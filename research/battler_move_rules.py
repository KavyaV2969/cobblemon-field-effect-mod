"""Ordinary field branches of the Battler.rb move-resolution code (targets, protection, failure, contact abilities)."""
def extend(fields,rule,action,both):
    def ability(a,who='user'):return {'ability':{'who':who,'values':a.split()}}
    def anyof(*cs):return {'any':list(cs)}
    def neg(c):return {'not':c}
    def src(line):return 'Battler.rb:'+str(line)
    def handler(syms,aid,callback,actions,line,mode='replace',condition=None):
        for sym in syms.split():
            slot=fields[sym].setdefault('abilityHandlers',{}).setdefault(aid,{})
            if callback in slot:raise ValueError(f'Duplicate handler {sym} {aid} {callback}')
            slot[callback]={'mode':mode,'condition':condition or {'always':True},'actions':actions,'source':src(line)}
    def protect(syms,key,line,**row):
        for sym in syms.split():fields[sym].setdefault('protectionPolicy',{}).setdefault(key,{'source':src(line)}).update(row)
    # Contact abilities
    handler('SWAMP MURKWATERSURFACE','gooey','onDamagingHit',[action('boost',who='target',stats={'spe':-2})],'3706-3709',condition={'contact':{'who':'target'}})
    # Colosseum: no retreat (pbEmergencyExitCheck)
    handler('COLOSSEUM','wimpout','onEmergencyExit',[action('abilityMessage'),action('message',text='{1} has nowhere to run!')],'4109-4111')
    handler('COLOSSEUM','emergencyexit','onEmergencyExit',[action('boost',stats={'spe':2},guarded=True)],'4112-4118')
    # Snatch and Pressure
    rule('BACKALLEY','snatch',{'always':True},[action('randomStat',stats=['atk','def','spa','spd','spe'],amount=2)],src('4942-4945'))
    handler('DIMENSIONAL DEEPEARTH','pressure','onDeductPP',[action('set',value=2)],'4957-4960,5919-5921',condition={'foe':True})
    # Targets
    spread=anyof({'flag':'powder'},{'move':'petaldance'},{'move':'petalblizzard'})
    rule('FLOWERGARDEN5','modifyMove',both(spread,anyof({'moveTarget':'normal'},{'moveTarget':'randomNormal'},{'moveTarget':'allAdjacent'})),[action('moveProperty',path='target',value='allAdjacentFoes')],src('4983-4984; PBStuff.rb:812'))
    # Protection family against status moves, and contact penalties
    protect('FAIRYTALE CHESS','kingsshield',5304,blockStatus=True)
    protect('FAIRYTALE CHESS COLOSSEUM','kingsshield',5507,contactBoosts={'atk':-1,'spa':-1})
    protect('DIMENSIONAL CHESS DEUXFINALIS','obstruct',5305,blockStatus=True)
    protect('FOREST','silktrap',5306,blockStatus=True)
    protect('VOLCANIC NEWWORLD','burningbulwark',5307,blockStatus=True)
    protect('COLOSSEUM','spikyshield',5518,contactFraction=0.25)
    # Kowtow Cleave pierces protection on the Chess Board at a quarter of its damage (Battle_Move.rb:1185-1196).
    shields=anyof(*[{'volatile':{'who':'target','id':v}} for v in ['protect','kingsshield','spikyshield','banefulbunker','obstruct','silktrap','burningbulwark']])
    # Holy Field: damaging moves avoid allies like Telepathy
    rule('HOLY','tryHit',both(neg({'category':'Status'}),neg({'foe':True}),{'samePokemon':False}),[action('message',who='target',text='{1} avoids attacks by its ally Pokémon!'),action('reject')],src('5372-5379,5476'))
    # Rocky Field
    rule('ROCKY','tryHit',both({'flag':'bullet'},anyof({'volatile':{'who':'target','id':'substitute'}},{'boostStage':{'who':'target','stat':'def','op':'>','value':0}})),[action('message',who='target',text='{1} hid behind a rock to dodge the attack!'),action('reject')],src('5394-5401,5474'))
    crash=[action('message',text='{1} hit a rock instead!'),action('conditional',condition=ability('gorillatactics'),actions=[action('damage',fraction=1/4)]),action('conditional',condition=neg(ability('gorillatactics')),actions=[action('damage',fraction=1/8)])]
    rule('ROCKY','afterMove',both({'connected':False},{'category':'Physical'},{'contact':{'who':'user'}},neg(ability('rockhead'))),crash,src('5647-5655,6743'))
    rule('ROCKY','tryFlinch',{'boostStage':{'who':'user','stat':'def','op':'>=','value':1}},[action('message',text="{1} won't flinch because of its bolstered Defenses!"),action('reject')],src('5756-5758'))
    rule('ROCKY','flinch',neg(ability('steadfast sturdy magicguard')),[action('damage',fraction=1/4,message='{1} was knocked into a rock!',minimum=1)],src('5759-5765'))
    # Electric Terrain: Focus Punch always loses focus
    rule('ELECTERRAIN','tryMove',{'move':'focuspunch'},[action('message',text="{1} lost its focus and couldn't move!"),action('reject')],src('5750-5754'))
    # ---- Knock-out effects (pbOnKillEffects) ----
    double=[action('multiply',value=2)]
    for aid in ['grimneigh','asonespectrier']:handler('DEUXFINALIS HAUNTED',aid,'onSourceAfterFaint',double,6044,mode='scaleBoosts')
    for aid in ['chillingneigh','asoneglastrier']:handler('DEUXFINALIS FROZENDIMENSION',aid,'onSourceAfterFaint',double,6055,mode='scaleBoosts')
    handler('DIMENSIONAL','beastboost','onSourceAfterFaint',double,6063,mode='scaleBoosts')
    rule('COLOSSEUM','afterFaint',{'always':True},[action('boostByHighestStat',of='target',amount=1,message="The cheering audience raised {1}'s {stat}!")],src('6072-6085; Battle_Effects.rb:841'))
    rule('BACKALLEY','afterFaint',{'move':'pursuit'},[action('boost',stats={'spe':1},message="{1}'s Pursuit raised its Speed!")],src('6087-6089; Battle_Effects.rb:839'))
    handler('DRAGONSDEN','berserk','onAfterMoveSecondary',double,6121,mode='scaleBoosts')
    # ---- After-move effects ----
    chess=anyof(*[{'move':m} for m in ['strength','ancientpower','psychic','continentalcrush','secretpower','shatteredpsyche','barrage']])
    rule('CHESS','tryMove',both(ability('klutz'),chess),[action('abilityMessage'),action('message',text='It was too much of a klutz to move the chess piece.'),action('reject')],src('5939-5942'))
    rule('BIGTOP','afterMove',both(ability('dancer'),{'flag':'dance'},neg({'calledBy':'dancer'})),[action('boost',stats={'spa':1,'spe':1},guarded=True)],src('6199-6207,7172'))
    rule('CONCERT2 CONCERT3 CONCERT4','afterMove',{'accuracyMiss':True},[action('progress',amount=-1,message='The crowd is booing!')],src('6963-6976'))
    rule('DIMENSIONAL','chargeMove',anyof(*[{'move':m} for m in ['dig','dive','fly','bounce']]),[action('message',text='The corrupted dimension is harmful to the untainted!'),action('damage',fraction=1/4,minimum=1,direct=True)],src('7005-7030'))
    icy=anyof(both({'priority':{'op':'>=','value':1}},neg({'category':'Status'}),{'contact':{'who':'user'}}),*[{'move':m} for m in ['feint','rollout','defensecurl','steamroller','lunge','iceball','spinout','icespinner']])
    rule('ICY','afterMove',both({'grounded':{'who':'user','value':True}},icy),[action('boost',stats={'spe':1},message='{1} gained momentum on the ice!')],src('7057-7061; Battle_Effects.rb:830-832'))
    for syms,divisor in [('DIMENSIONAL FROZENDIMENSION',4),('DEUXFINALIS',3)]:
        rule(syms,'afterMove',both(ability('darkaura'),{'damageDealt':True}),[action('healByDamage',divisor=divisor,message='{1} restored a little HP using its Dark Aura!')],src('7071-7078'))
    rule('ASHENBEACH','tryHeal',{'effectId':'shellbell'},[action('damageShare',divisor=4)],src(7086))
    rule('CONCERT4','damage',{'always':True},[action('streakPower',values=[1,1.2,1.4,6553/4096,7372/4096,2])],'Battle_Move.rb:1820; PBConstants.rb:41-48')
