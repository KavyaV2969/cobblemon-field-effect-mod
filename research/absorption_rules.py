"""Reviewed target-type interception and native absorber replacement policies."""
def extend(fields,rule,action,both,ability):
    fields['FACTORY']['abilityAbsorptions']={'motordrive':{'type':'Electric','stat':'spe','boosts':[2],'source':'Battler.rb:5572'}}
    fields['SHORTCIRCUIT']['abilityAbsorptions']={
        'lightningrod':{'type':'Electric','stat':'spa','boosts':[1,2,0,1,3],'cycle':True,'maximizeOverlay':'rejuvenation:electric_terrain','source':'Battler.rb:5552-5567'},
        'motordrive':{'type':'Electric','stat':'spe','boosts':[1,2,0,1,3],'cycle':True,'maximizeOverlay':'rejuvenation:electric_terrain','source':'Battler.rb:5574-5583'},
        'voltabsorb':{'type':'Electric','healFractions':[.2,.375,.125,.3,.5],'cycle':True,'maximizeOverlay':'rejuvenation:electric_terrain','source':'Battler.rb:5587-5595'}}
    rule('DESERT','tryHit',both({'attackType':'Water'},{'weather':['sunnyday','desolateland']},
        {'any':[{'type':{'who':'target','value':'Water'}},{'type':{'who':'target','value':'Grass'}}]},
        {'not':{'item':{'who':'target','values':['utilityumbrella']}}},{'foe':True}),
        [action('heal',who='target',fraction=.25,message='{1} had its HP restored.',failureMessage="It doesn't affect\n{1}..."),action('reject')],'Battle_Move.rb:626; Battler.rb:5584-5600')
    rule('VOLCANICTOP DRAGONSDEN INFERNAL','tryHit',both({'attackType':'Fire'},{'effectiveAbility':{'who':'target','values':['magmaarmor']}},{'foe':True}),
        [action('message',who='target',text="It doesn't affect {1}..."),action('reject')],'Battle_Move.rb:673-676')
    # pbShouldApplyTypeImmunity? skips Magma Armor along with every other
    # type absorber for Wildfire's primary Fire attacks on Infernal.
    for r in fields['INFERNAL']['rules']:
        if r['source']=='Battle_Move.rb:673-676':r['condition']['all'].append({'not':both({'field':fields['INFERNAL']['id']},{'moveType':'Fire'},ability('WILDFIRE'))})
    fields['COLOSSEUM']['indirectImmunityAbilities']=['wonderguard']
