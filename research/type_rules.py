"""Per-defending-type overrides, not whole-matchup replacement multipliers."""
def extend(fields,rule,action,both,ability):
    fields['FROZENDIMENSION']['suppressedAbilityCallbacks']={'flashfire':['onTryHit']}
    def row(syms,attack,defend,value,condition=None):
        for sym in syms.split():fields[sym].setdefault('typeChart',[]).append({'attackType':attack,'defenseType':defend,'value':value,'condition':condition or {'always':True},'source':'Battle_Move.rb:437-504'})
    for defend in ['Dark','Ghost']:row('HOLY','Normal',defend,1)
    row('CAVE','Ground','Flying',0)
    row('HOLY HAUNTED','*','Ghost',1,{'move':'spiritbreak'})
    row('UNDERWATER','Water','Water',0)
    row('FAIRYTALE','Steel','Dragon',1)
    row('GLITCH','Dragon','*',0)
    row('GLITCH','Ghost','Psychic','immune')
    row('GLITCH','Bug','Poison',1);row('GLITCH','Poison','Bug',1);row('GLITCH','Ice','Fire',0)
    row('GLITCH','Dark','Steel',-1);row('GLITCH','Ghost','Steel',-1)
    row('HAUNTED','Ghost','Normal',0)
    row('BEWITCHED','Poison','Grass',0);row('BEWITCHED','Fairy','Steel',1);row('BEWITCHED','Fairy','Dark',0);row('BEWITCHED','Dark','Fairy',0)
    row('SKY','*','Flying',1,{'move':'bonemerang'});row('SKY','*','Flying',1,ability('LONGREACH'))
    row('FLOWERGARDEN2 FLOWERGARDEN3 FLOWERGARDEN4 FLOWERGARDEN5','*','Grass',1,{'move':'cut'})
    row('INFERNAL','Fire','Ghost',1);row('DEEPEARTH','Ground','Ground',-1)
    row('DEUXFINALIS','Ghost','Rock',-1);row('DEUXFINALIS','Fairy','*',0)
    row('ELECTERRAIN','Electric','Ground',0,ability('TERAVOLT'))
    rule('GLITCH','modifyMove',{'moveType':'Fairy'},[action('moveType',type='???')],'Battle_Move.rb:259; PBStuff.rb:830 (Rejuv branch: Fairy only)')
