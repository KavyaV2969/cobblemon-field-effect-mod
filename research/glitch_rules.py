"""Glitch shared Special stat, Drive interceptions and knockout recharge reset."""
def extend(fields,rule,action,both):
    fields['GLITCH']['statPools']={'offensiveSpecial':['spa','spd'],'defensiveSpecial':['spd','spa'],
        'source':'Battler.rb:7245-7255; Battle_Move.rb:1461-1470,1625-1652,1758-1769'}
    rule('GLITCH','afterMove',{'foeFainted':True},[action('removeVolatile',id='mustrecharge')],'Battler.rb:3741-3745')
    for mid in ['explosion','selfdestruct']:
        rule('GLITCH','defense',{'move':mid},[action('multiply',value=.5)],'Battle_Move.rb:1749')
    pokemon={'species':{'who':'target','value':'genesect'}}
    for moveType,item,effects in [('Electric','shockdrive',[action('boost',who='target',stats={'spe':1})]),
        ('Water','dousedrive',[action('heal',who='target',fraction=.25,message='{1} had its HP restored.')]),
        ('Ice','chilldrive',[action('heal',who='target',fraction=.25,message='{1} had its HP restored.')]),
        ('Fire','burndrive',[action('flashFire',who='target'),action('message',who='target',text="The power of {1}'s Fire-type moves rose!")])]:
        rule('GLITCH','tryHit',both(pokemon,{'attackType':moveType},{'item':{'who':'target','values':[item]}},{'foe':True}),effects+[action('reject')],'Battle_Move.rb:605-654; Battler.rb:5569-5615')
