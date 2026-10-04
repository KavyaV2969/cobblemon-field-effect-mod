"""Reusable declarations for source abilities required by ordinary field rules."""
def definitions():
    comparison={'statSumComparison':{'left':'spa','right':'atk','group':'foes','op':'>'}}
    boost=lambda stats:{'op':'boost','stats':stats}
    conditional=lambda condition,actions:{'op':'conditional','condition':condition,'actions':actions}
    return {
        'defragment':{'name':'Defragment','num':331,'description':"Adjusts defenses according to a foe's offenses; the user's moves never miss.",
            'flags':{'breakable':1},'callbacks':{
                'onStart':{'mode':'replace','condition':{'always':True},'actions':[
                    conditional(comparison,[boost({'spd':1})]),conditional({'not':comparison},[boost({'def':1})])],
                    'source':'Battler.rb:3174-3192 (ordinary baseline)'},
                'onSourceModifyAccuracy':{'mode':'replace','condition':{'always':True},'actions':[{'op':'set','value':True}],
                    'source':'Battle_Move.rb:876'}}},
        'junglebeat':{'name':'Jungle Beat','num':325,'description':'Powers up sound moves, resists them, and treats Grass attacks as sound moves.',
            'inherit':'punkrock','flags':{'breakable':1},'callbacks':{
                'onModifyMove':{'mode':'replace','condition':{'moveType':'Grass'},
                    'actions':[{'op':'moveProperty','path':'flags.sound','value':1}],
                    'source':'Battle_Move.rb:233,1743,1827-1828'}}},
    }
