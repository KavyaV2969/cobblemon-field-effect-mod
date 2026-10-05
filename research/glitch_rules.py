"""Glitch shared Special stat, Drive interceptions and knockout recharge reset."""
def extend(fields,rule,action,both):
    fields['GLITCH']['statPools']={'offensiveSpecial':['spa','spd'],'defensiveSpecial':['spd','spa'],'borrowedOffense':{'foulplay':{'selection':'staged','modifierSelection':'modifiersOnly'}},
        'source':'Battler.rb:7245-7255; Battle_Move.rb:1461-1470,1625-1652,1758-1769'}
    rule('GLITCH','modifyMove',both({'any':[{'move':'foulplay'},{'move':'bodypress'}]},{'category':'Special'}),[action('moveProperty',path='overrideOffensiveStat',value='spa')],'Battle_Move.rb:1629-1645')
    rule('GLITCH','modifyMove',both({'move':'secretsword'},{'category':'Physical'}),[action('moveProperty',path='overrideDefensiveStat',value='spd')],'Battle_Move.rb:308-315 (Psyshock-family inverse category)')
    rule('GLITCH','afterMove',{'foeFainted':True},[action('removeVolatile',id='mustrecharge')],'Battler.rb:3741-3745')
    for mid in ['explosion','selfdestruct']:
        rule('GLITCH','defense',{'move':mid},[action('multiply',value=.5)],'Battle_Move.rb:1749')
    pokemon={'species':{'who':'target','value':'genesect'}}
    for moveType,item,effects in [('Electric','shockdrive',[action('boost',who='target',stats={'spe':1})]),
        ('Water','dousedrive',[action('heal',who='target',fraction=.25,message='{1} had its HP restored.',failureMessage="It doesn't affect\n{1}...")]),
        ('Ice','chilldrive',[action('heal',who='target',fraction=.25,message='{1} had its HP restored.',failureMessage="It doesn't affect\n{1}...")]),
        ('Fire','burndrive',[action('conditional',condition={'volatile':{'who':'target','id':'flashfire'}},actions=[action('message',who='target',text="It doesn't affect\n{1}...")]),action('conditional',condition={'not':{'volatile':{'who':'target','id':'flashfire'}}},actions=[action('flashFire',who='target'),action('message',who='target',text="The power of {1}'s Fire-type moves rose!")])])]:
        rule('GLITCH','tryHit',both(pokemon,{'attackType':moveType},{'item':{'who':'target','values':[item]}},{'foe':True}),effects+[action('reject')],'Battle_Move.rb:605-654; Battler.rb:5569-5615')
