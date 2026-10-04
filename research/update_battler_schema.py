"""Keep the closed validators synchronized for the Battler source audit hooks."""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
for name in ['mod/src/main/resources/rejuvenation-engine.js','research/validate.py','mod/src/main/java/dev/rejuvenation/CatalogValidator.java']:
    p=ROOT/name;s=p.read_text(encoding='utf-8')
    s=s.replace('drainHealed canFlinch oneHitKO','drainHealed canFlinch baseCanFlinch sheerForce oneHitKO')
    s=s.replace("'drainHealed','canFlinch','oneHitKO'","'drainHealed','canFlinch','baseCanFlinch','sheerForce','oneHitKO'")
    s=s.replace('weatherReconcile criticalMessage','weatherReconcile criticalMessage modifyMoveLate')
    s=s.replace("'onSourceTryPrimaryHit','onTryHit','onImmunity'","'onSourceTryPrimaryHit','onTryHit','onFoeTryMove','onImmunity'")
    s=s.replace('onSourceTryPrimaryHit onTryHit onImmunity','onSourceTryPrimaryHit onTryHit onFoeTryMove onImmunity')
    if name.endswith('.js'):
        needle="      if(a.op==='addSecondary'"
        idx=s.index(needle)
        s=s[:idx]+"      if(a.op==='secondaryChance' && (a.volatileStatus!==undefined && a.volatileStatus!=='flinch' || a.chance!==undefined && (!Number.isInteger(a.chance) || a.chance<0 || a.chance>100) || a.multiplier!==undefined && (!Number.isFinite(a.multiplier) || a.multiplier<0)))throw new Error('Invalid secondary chance');\n"+s[idx:]
        needle="      if(f.damageRoll"
        idx=s.index(needle)
        s=s[:idx]+"      if(f.switchTiming!==undefined && f.switchTiming!=='action')throw new Error('Invalid switch timing');\n"+s[idx:]
    elif name.endswith('.py'):
        needle="        if op=='addSecondary':"
        idx=s.index(needle)
        s=s[:idx]+"        if op=='secondaryChance':ensure(('volatileStatus' not in a or a['volatileStatus']=='flinch') and ('chance' not in a or integer(a['chance'],0,100)) and ('multiplier' not in a or number(a['multiplier']) and a['multiplier']>=0),where,'invalid secondary chance')\n"+s[idx:]
        needle="    if 'damageRoll' in f:"
        idx=s.index(needle)
        s=s[:idx]+"    if 'switchTiming' in f:ensure(f['switchTiming']=='action',name,'invalid switch timing')\n"+s[idx:]
    else:
        needle='   if(fieldExtra.has("damageRoll"))'
        idx=s.index(needle)
        s=s[:idx]+'   if(fieldExtra.has("switchTiming"))require(fieldExtra.get("switchTiming").isJsonPrimitive() && fieldExtra.get("switchTiming").getAsString().equals("action"),entry.getKey(),"Invalid switch timing");\n'+s[idx:]
        needle='   if(op.equals("addSecondary"))'
        idx=s.index(needle)
        s=s[:idx]+'   if(op.equals("secondaryChance"))require((!a.has("volatileStatus") || a.get("volatileStatus").getAsString().equals("flinch")) && (!a.has("chance") || integer(a.get("chance"),0,100)) && (!a.has("multiplier") || numeric(a.get("multiplier")) && a.get("multiplier").getAsDouble()>=0),where,"Invalid secondary chance");\n'+s[idx:]
    p.write_text(s,encoding='utf-8')
