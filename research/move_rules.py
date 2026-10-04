"""Move effect adaptations reviewed against Battle_MoveEffects.rb."""
def extend(rule,action,both,fields):
    concerts='CONCERT1 CONCERT2 CONCERT3 CONCERT4'
    def stats(syms,move,values,line,location='boosts',callback=None):
        a=action('moveProperty',path=location,value=values)
        if callback:a['removeCallback']=callback
        rule(syms,'modifyMove',{'move':move},[a],'Battle_MoveEffects.rb:'+str(line))
    for syms,move,values,line in [
        ('COLOSSEUM '+concerts,'howl',{'atk':2},754),('RAINBOW ASHENBEACH','meditate',{'atk':3},755),
        ('PSYTERRAIN','meditate',{'atk':2,'spa':2},756),('ELECTERRAIN','charge',{'spd':2},857),
        ('GRASSY DRAGONSDEN','coil',{'atk':2,'def':2,'accuracy':2},917),
        ('BIGTOP DRAGONSDEN','dragondance',{'atk':2,'spe':2},932),
        (concerts+' CITY','workup',{'atk':2,'spa':2},947),
        ('GRASSY FOREST FLOWERGARDEN1 FLOWERGARDEN2','growth',{'atk':2,'spa':2},964),
        ('FLOWERGARDEN3 FLOWERGARDEN4 FLOWERGARDEN5','growth',{'atk':3,'spa':3},965),
        ('MISTY RAINBOW HOLY STARLIGHT NEWWORLD PSYTERRAIN','cosmicpower',{'def':2,'spd':2},993),
        ('FOREST','defendorder',{'def':2,'spd':2},994),('BIGTOP','quiverdance',{'spa':2,'spd':2,'spe':2},1009),
        ('CHESS ASHENBEACH PSYTERRAIN','calmmind',{'spa':2,'spd':2},1024),
        ('BIGTOP FAIRYTALE COLOSSEUM','swordsdance',{'atk':3},1050),('FACTORY','irondefense',{'def':3},1067),
        ('SWAMP','shelter',{'def':3},1068),('CORROSIVE CORROSIVEMIST MURKWATERSURFACE FAIRYTALE '+concerts,'acidarmor',{'def':3},1069),
        ('ROCKY','rockpolish',{'spe':3},1096),('CRYSTALCAVERN','rockpolish',{'atk':1,'spa':1,'spe':2},1097),
        ('FACTORY DEEPEARTH CITY','autotomize',{'spe':3},1114),('CHESS PSYTERRAIN INFERNAL BACKALLEY','nastyplot',{'spa':3},1131),
        ('FACTORY CITY','shiftgear',{'atk':2,'spe':2},1194),
        (concerts,'growl',{'atk':-2},1366),('VOLCANIC CORROSIVEMIST VOLCANICTOP BACKALLEY CITY','smokescreen',{'accuracy':-2},1501),
        ('DESERT ASHENBEACH','sandattack',{'accuracy':-2},1502),('SHORTCIRCUIT DARKCRYSTALCAVERN STARLIGHT NEWWORLD','flash',{'accuracy':-2},1503),
        ('ASHENBEACH PSYTERRAIN','kinesis',{'accuracy':-2},1504),('BIGTOP','featherdance',{'atk':-3},1608),
        (concerts,'screech',{'def':-3},1623),('HAUNTED','scaryface',{'spe':-3},1646),('GRASSY','cottonspore',{'spe':-3},1647),
        ('FACTORY SHORTCIRCUIT '+concerts,'metalsound',{'spd':-3},1688),('BACKALLEY','faketears',{'spd':-3},1689)]:
        stats(syms,move,values,line,callback='onHit' if move=='growth' else None)
    for syms,move,path,values,line in [
        ('PSYTERRAIN','psyshieldbash','self.boosts',{'def':1,'spd':1},784),
        ('PSYTERRAIN','esperwing','secondaries.0.self.boosts',{'spe':2},823),
        ('PSYTERRAIN','mysticalpower','secondaries.0.self.boosts',{'spa':2},845),
        ('ELECTERRAIN','electroweb','secondaries.0.boosts',{'spe':-2},1428),
        ('SWAMP','mudshot','secondaries.0.boosts',{'spe':-2},1429),
        ('SWAMP','strugglebug','secondaries.0.boosts',{'spa':-2},1458),
        ('FROZENDIMENSION BACKALLEY','snarl','secondaries.0.boosts',{'spa':-2},1459)]:stats(syms,move,values,line,path)
    rule('PSYTERRAIN','afterMove',{'move':'kinesis'},[action('boost',stats={'atk':1,'spa':1})],'Battle_MoveEffects.rb:1510')
    for syms,moves,ratio,line in [('FOREST',['healorder'],.66,5167),('DARKCRYSTALCAVERN STARLIGHT NEWWORLD BEWITCHED',['moonlight'],.75,5237),
        ('GRASSY',['synthesis'],.75,5237),('DARKCRYSTALCAVERN',['morningsun','synthesis'],.25,5241)]:
        for move in moves:rule(syms,'modifyMove',{'move':move},[action('moveProperty',path='heal',value=[ratio,1],removeCallback='onHit')],'Battle_MoveEffects.rb:'+str(line))
    rule('WATERSURFACE UNDERWATER','modifyMove',{'move':'wavecrash'},[action('moveProperty',path='recoil',value=[1,4])],'Battle_MoveEffects.rb:125')
    rule('ELECTERRAIN','modifyMove',{'move':'wildcharge'},[action('moveProperty',path='recoil',value=None)],'Battle_MoveEffects.rb:123')
    rule('MISTY RAINBOW HOLY FAIRYTALE STARLIGHT','afterMove',{'move':'wish'},[action('adjustWish',fraction=.75)],'Battle_MoveEffects.rb:5214')
    for sym in ['MISTY','FLOWERGARDEN3','FLOWERGARDEN4','FLOWERGARDEN5']:
        amount=-2 if sym=='FLOWERGARDEN5' else -1
        stats(sym,'sweetscent',{'def':amount,'spd':amount,'evasion':amount},1546)
    for sym,field in fields.items():
        # Mark source UI highlights separately: a highlight is not an executable rule.
        implemented={r['condition']['move'] for r in field['rules'] if r['event']=='modifyMove' and 'move' in r['condition']}
        field['statusMoveBehaviorCoverage']={'explicitRuleMoves':sorted(implemented & set(field['statusBuffs']+field['statusNerfs'])),
            'unreviewedHighlightedMoves':sorted(set(field['statusBuffs']+field['statusNerfs'])-implemented)}
