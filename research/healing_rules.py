"""Absorbed healing order, rounding and harmful roots/water from the source."""
def extend(fields,rule,action):
    for f in fields.values():f['healing']={'rootFactor':5324/4096,'agentMultipliers':{},'overlayAgents':[],'moveMultipliers':{},'harmfulAgents':{},'liquidOozeFactor':1,'drainStatLoss':False}
    fields['GRASSY']['healing']['rootFactor']=1.6
    def scale(syms,agent,factor):
        for sym in syms.split():fields[sym]['healing']['agentMultipliers'][agent]=factor
    scale('GRASSY','leechseed',1.3);scale('FOREST','strengthsap',1.3)
    scale('MISTY SWAMP WATERSURFACE UNDERWATER','aquaring',2)
    scale('FLOWERGARDEN4 FLOWERGARDEN5','ingrain',4)
    scale('FLOWERGARDEN2 FLOWERGARDEN3 FOREST GRASSY','ingrain',2)
    fields['GRASSY']['healing']['overlayAgents']=['ingrain']
    for sym in ['ICY','SNOWYMOUNTAIN']:fields[sym]['healing']['moveMultipliers']['matchagotcha']=1.3
    fields['CORROSIVEMIST']['healing']['harmfulAgents']['aquaring']={'respectMagicGuard':False,'message':"{1}'s Aqua Ring absorbed the poison!"}
    for sym in ['CORROSIVE','CORRUPTED']:fields[sym]['healing']['harmfulAgents']['ingrain']={'respectMagicGuard':True,'message':'{1} absorbed foul nutrients with its roots!'}
    for sym in ['WASTELAND','MURKWATERSURFACE','CORRUPTED']:fields[sym]['healing']['liquidOozeFactor']=2
    fields['SWAMP']['healing']['drainStatLoss']=True
    for r in fields['BACKALLEY']['rules']:
        if r['event']=='tryHeal':r['condition']={'fullHealing':False}
    rule('WASTELAND','receivedDamage',{'move':'leechseed'},[action('multiply',value=2)],'Battle.rb:6372')
