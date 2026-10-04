"""Source Storm-9 weather and the ordinary Weather Ball behavior it requires."""
def cycle_action():
    return {'op':'randomWeather','duration':8,'force':True,'choices':[
      {'id':'raindance','message':'Storm-9 created a downpour!'},
      {'id':'hail','message':'Storm-9 brought hailfall!'},
      {'id':'sandstorm','message':'Storm-9 whipped up a duststorm!'},
      {'id':'deltastream','message':'Storm-9 whipped up terrible winds!'},
      {'id':'shadowsky','message':'Storm-9 shrouded the sky in a shadowy aura...'}]}

def extend(fields):
    from registered_abilities import callback
    fields['INDOOR']['typeDefinitions']={'Shadow':{'displayName':'Shadow','hue':270,'textureBasis':'Dark',
      'damageTaken':{'Fairy':1,'Shadow':2},'outgoing':{'Fairy':2},
      'flagInteraction':{'flag':'shadow','flagged':-1,'unflagged':1,'unflaggedExceptions':['Fairy']},
      'source':'Rejuv/Definitions/typetext.rb:122-135; Battle_Move.rb:555-561'}}
    fields['INDOOR']['typeFlagInteractions']=[{'attackType':'Fairy','flag':'shadow','flagged':1,'unflagged':0,'source':'Battle_Move.rb:555-557'}]
    for sym,f in fields.items():
        f['weatherDefinitions']={'shadowsky':{'name':'ShadowSky','duration':5,
          'damageFraction':1/8 if sym in ['DIMENSIONAL','FROZENDIMENSION'] else 1/16,
          'damageMessage':'The Pokémon were struck by bursts of light!',
          'startMessage':'A shadowy aura filled the sky!','endMessage':'The shadowy aura faded away!',
          'excludedAbilities':['magicguard','overcoat','tempest'],'excludedItems':['safetygoggles'],
          'excludedVolatiles':['dig','dive'],'excludedFlags':['shadow'],
          'source':'Battle.rb:5573-5589; Battle_Effects.rb:1354-1364'}}
        f['abilityHandlers'].setdefault('tempest',{})['onEnd']=callback([{'op':'reconcileWeather'}],'Battler.rb:3515-3516')
        # Ordinary Weather Ball, not the excluded custom Shadow Sky move.
        f['rules'].append({'event':'modifyMove','condition':{'all':[{'move':'weatherball'},{'weather':'shadowsky'}]},
          'actions':[{'op':'moveType','type':'Shadow'},{'op':'moveProperty','path':'basePower','value':100}],
          'source':'Battle_MoveEffects.rb:2914,2928'})
        for r in list(f['rules']):
            if r['event']=='weatherChange' and any(a['op']=='clearWeather' for a in r['actions']):
                f['rules'].append({**r,'event':'weatherReconcile'})
