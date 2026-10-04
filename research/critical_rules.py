"""Field changes to critical stages, preserving the shipped Chess HP branch bug."""
def extend(rule,action,both,ability,grounded):
    rule('GLITCH','criticalRatio',{'faster':{'stored':True}},[action('add',value=1)],'Battle_Move.rb:1008')
    rule('CHESS','criticalRatio',ability('RECKLESS GORILLATACTICS','target'),[action('add',value=1)],'Battle_Move.rb:1010')
    rule('CHESS','criticalRatio',{'lastMove':{'who':'target','values':['stompingtantrum','thrash','outrage','ragingfury']}},[action('add',value=1)],'Battle_Move.rb:1011')
    # The source tests <0.8 first, making subsequent <0.6/<0.4 branches unreachable.
    rule('CHESS','criticalRatio',both(ability('MERCILESS'),{'hp':{'who':'target','op':'<','fraction':.8,'round':False}}),[action('add',value=1)],'Battle_Move.rb:1013-1020')
    rule('COLOSSEUM','criticalRatio',ability('RATTLED WIMPOUT','target'),[action('set',value=4)],'Battle_Move.rb:981')
    rule('CORROSIVEMIST','criticalRatio',ability('MERCILESS'),[action('set',value=4)],'Battle_Move.rb:980')
    rule('CORROSIVE WASTELAND MURKWATERSURFACE','criticalRatio',both(ability('MERCILESS'),grounded()),[action('set',value=4)],'Battle_Move.rb:980')
