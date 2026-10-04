"""Further reviewed move/status semantics; callbacks use reusable closed recipes."""
def extend(fields,rule,action,both,ability,grounded):
    def change(syms,move,values,line):rule(syms,'modifyMove',{'move':move},values,'Battle_MoveEffects.rb:'+str(line))
    def prop(path,value,remove=None):
        a=action('moveProperty',path=path,value=value)
        if remove:a['removeCallback']=remove
        return a
    change('BIGTOP CHESS','noretreat',[prop('boosts',{'atk':2,'spa':2,'spe':2,'def':-1,'spd':-1})],8390)
    change('COLOSSEUM','noretreat',[prop('boosts',dict.fromkeys(['atk','def','spa','spd','spe'],2))],8396)
    change('WATERSURFACE UNDERWATER HOLY NEWWORLD','takeheart',[action('moveBehavior',recipe='cureAndBoost',stats={'spa':2,'spd':2})],9231)
    change('BIGTOP','victorydance',[prop('boosts',{'atk':2,'def':2,'spe':2})],9147)
    for syms,fraction,amount in [('BIGTOP DRAGONSDEN CONCERT1 CONCERT2 CONCERT3 CONCERT4',.5,2),('DEUXFINALIS',.25,1)]:
        change(syms,'clangoroussoul',[prop('boosts',dict.fromkeys(['atk','def','spa','spd','spe'],amount)),action('moveBehavior',recipe='payHP',fraction=fraction,threshold=True)],8590)
    for syms,move,fraction,line in [('FACTORY','steelbeam',.25,8267),('SHORTCIRCUIT','steelbeam',1,8268),('FOREST','chloroblast',.25,9997)]:
        change(syms,move,[action('moveBehavior',recipe='payHP',fraction=fraction,callback='onAfterMove',round=True,respectMagicGuard=True)],line)
    for syms,move,callback,line in [('CORROSIVE CORROSIVEMIST WASTELAND MURKWATERSURFACE','barbbarrage','onBasePower',9159),('INFERNAL HAUNTED','infernalparade','basePowerCallback',9201)]:
        change(syms,move,[prop('basePower',120,callback)],line)
    change('ASHENBEACH','shoreup',[prop('heal',[3,4],'onHit')],8090)
    change('DESERT','shoreup',[prop('heal',[2,3],'onHit')],8092)
    change('HOLY','lifedew',[prop('heal',[1,2])],8674)
    change('WATERSURFACE','lifedew',[action('moveBehavior',recipe='appendHitActions',actions=[action('volatile',id='aquaring')])],8682)
    change('CORROSIVEMIST MURKWATERSURFACE','lifedew',[action('moveBehavior',recipe='appendHitActions',actions=[action('status',who='target',status='psn')])],8677)
    change('MURKWATERSURFACE CORRUPTED','tarshot',[action('moveBehavior',recipe='appendHitActions',actions=[action('status',who='target',status='psn')])],8426)
    change('HAUNTED BEWITCHED','magicpowder',[action('moveBehavior',recipe='appendHitActions',actions=[action('status',who='target',status='slp',message='{1} was put to sleep!')])],8470)
    change('FAIRYTALE','magicpowder',[action('moveBehavior',recipe='setTypes',types=['Psychic','Fairy'],message='{1} became Psychic/Fairy type!')],8463)
    change('DARKCRYSTALCAVERN RAINBOW ICY CRYSTALCAVERN SNOWYMOUNTAIN STARLIGHT FROZENDIMENSION','auroraveil',[prop('sideCondition','auroraveil','onTry')],7724)
    rule('CONCERT3 CONCERT4','setStatus',{'status':'slp'},[action('message',who='target',text='The concert is too loud and hype to sleep!'),action('reject')],'Battle_Effects.rb:143')
    rule('SKY','setStatus',both({'status':'slp'},ability('EARLYBIRD','target')),[action('message',who='target',text="{1} can't fall asleep in the open skies!"),action('reject')],'Battle_Effects.rb:144')
    rule('DRAGONSDEN','setStatus',{'item':{'who':'target','values':['amuletcoin']}},[action('message',who='target',text="The Amulet Coin prevents {1} from being inflicted with status on Dragon's Den!"),action('reject')],'Battle_Effects.rb:94')
    rule('VOLCANIC','setStatus',{'status':'frz'},[action('reject')],'Battle_Effects.rb:354')
    rule('ASHENBEACH','tryVolatile',both({'status':'confusion'},{'any':[{'type':{'who':'target','value':'Fighting'}},ability('INNERFOCUS','target')]}),[action('message',who='target',text='{1} broke through the confusion!'),action('reject')],'Battle_Effects.rb:489')
    rule('MISTY','tryVolatile',both({'status':'confusion'},grounded('target')),[action('reject')],'Battle_Effects.rb:492')
    fields['FROZENDIMENSION']['suppressedAbilityCallbacks']['magmaarmor']=['onImmunity']
