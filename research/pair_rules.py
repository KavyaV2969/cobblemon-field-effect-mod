"""Battle-wide Pledge and Conversion sequence memory, independent of sides/turns."""
def extend(fields,rule,action,both):
    for sym in ['FOREST','BEWITCHED']:fields[sym].setdefault('terrainPolicy',{})['moveDurations']={'rejuvenation:grassy_terrain':8}
    allfields=' '.join(fields)
    pledge={'firepledge':'Fire Pledge','grasspledge':'Grass Pledge','waterpledge':'Water Pledge'}
    outcomes={frozenset(['firepledge','grasspledge']):('rejuvenation:volcanic','set the field ablaze','fanned the flames'),
        frozenset(['firepledge','waterpledge']):('rejuvenation:rainbow','form a rainbow','refresh the rainbow'),
        frozenset(['grasspledge','waterpledge']):('rejuvenation:swamp','formed a swamp','reinforced the swamp')}
    for token,label in pledge.items():
        pairs=[]
        for other in pledge:
            if token==other:continue
            field,change,refresh=outcomes[frozenset([token,other])]
            pairs.append({'with':other,'field':field,'message':'The pledges combined '+('to ' if field=='rejuvenation:rainbow' else 'and ')+change+'!','refreshMessage':'The pledges combined '+('and ' if field!='rejuvenation:rainbow' else 'to ')+refresh+'!'})
        rule(allfields,'modifyMove',{'move':token},[action('removeCallbacks',callbacks=['onPrepareHit','onModifyMove','basePowerCallback'])],'Battle_MoveEffects.rb:6383-6410')
        rule(allfields,'afterMove',both({'move':token},{'missed':False}),[action('pairField',memory='pledge',token=token,pairs=pairs,duration=4,extendedBy=3,firstMessage='The '+label+' lingers in the air...',permanentMessage='The pledges combined!')],'Battle_Field.rb:506-540')
    for token,other in [('conversion','conversion2'),('conversion2','conversion')]:
        rule(allfields,'afterMove',both({'move':token},{'missed':False},{'not':{'item':{'who':'user','values':['everstone']}}}),[action('pairField',memory='conversion',token=token,
            pairs=[{'with':other,'field':'rejuvenation:glitch','message':'TH~ R0GUE DAa/ta cor$upt?@####','refreshMessage':'TH~ R0GUE DAa/ta cor$upt?@####'}],
            duration=5,extendedBy=3,firstMessage='Some rogue data remains...',permanentMessage='TH~ R0GUE DAa/ta cor$upt?@####',disallowPermanentField='rejuvenation:glitch')],'Battle_Field.rb:544-562; Battle_MoveEffects.rb:2061-2107')
