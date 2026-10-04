"""Reviewed binding rules: capture Binding Band at entry, read field at residual."""
def extend(fields):
    for f in fields.values():
        f['trapping']={'divisors':[8,6,4,3,2], 'moveIncrements':{}, 'statLoss':{},
            'immuneAbilities':['magicguard'], 'source':'Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011'}
    fields['COLOSSEUM']['trapping']['immuneAbilities'].append('wonderguard')
    for sym,mid,increment in [('DRAGONSDEN','magmastorm',1),('DESERT','sandtomb',1),
        ('WATERSURFACE','whirlpool',1),('UNDERWATER','whirlpool',1),('FOREST','infestation',1),
        ('FLOWERGARDEN3','infestation',1),('FLOWERGARDEN4','infestation',2),('FLOWERGARDEN5','infestation',3),
        ('VOLCANIC','firespin',1),('HAUNTED','firespin',1),('ELECTERRAIN','thundercage',1)]:
        fields[sym]['trapping']['moveIncrements'][mid]=increment
    fields['ASHENBEACH']['trapping']['statLoss']['sandtomb']=['accuracy']
    for mid in ['snaptrap','infestation']:fields['SWAMP']['trapping']['statLoss'][mid]=['atk','def','spa','spd','spe']
    fields['UNDERWATER']['trapping']['octolockAmount']=-2
