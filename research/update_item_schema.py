"""Synchronized validator update for reusable item callbacks and stage sources."""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
for name in ['mod/src/main/resources/rejuvenation-engine.js','research/validate.py','mod/src/main/java/dev/rejuvenation/CatalogValidator.java']:
 p=ROOT/name;s=p.read_text(encoding='utf-8')
 s=s.replace('baseCanFlinch sheerForce oneHitKO','baseCanFlinch sheerForce allyCanHeal canHeal oneHitKO')
 s=s.replace("'baseCanFlinch','sheerForce','oneHitKO'","'baseCanFlinch','sheerForce','allyCanHeal','oneHitKO'")
 if name.endswith('.js'):
  # canHeal is structured; allyCanHeal is a Boolean.
  s=s.replace("'oneHitKO','zMove','immunityType','volatileSourceMove']);","'oneHitKO','zMove','immunityType','volatileSourceMove','canHeal']);")
  s=s.replace("      if(k==='immunityType')", "      if(k==='canHeal' && (!v || Object.keys(v).sort().join()!=='value,who' || !['user','target'].includes(v.who) || typeof v.value!=='boolean'))throw new Error('Invalid healing predicate');\n      if(k==='immunityType')")
  s=s.replace("      if(a.op==='secondaryChance'", "      if(a.sourceAbility!==undefined && (a.op!=='boost' || a.sourceAbility!=='intimidate'))throw new Error('Invalid boost source ability');\n      if(a.silent!==undefined && (a.op!=='volatile' || typeof a.silent!=='boolean'))throw new Error('Invalid silent volatile');\n      if(a.op==='secondaryChance'",1)
  needle='      for(const [aid,callbacks]of Object.entries(f.abilityHandlers'
  at=s.index(needle)
  s=s[:at]+"      for(const [iid,callbacks]of Object.entries(f.itemHandlers || {})){if(!RegistryDex.items.get(iid).exists)throw new Error('Unknown item handler');for(const [key,row]of Object.entries(callbacks)){if(!['onResidual','onStart','onModifyMove'].includes(key) || Object.keys(row).sort().join()!=='actions,condition,mode,source' || !['replace','append','prepend'].includes(row.mode))throw new Error('Invalid item handler');checkCondition(row.condition);checkActions(row.actions);}}\n"+s[at:]
  s=s.replace("if(v.op==='ability')check('abilities',v.id);","if(v.op==='ability')check('abilities',v.id);if(v.sourceAbility)check('abilities',v.sourceAbility);")
  s=s.replace("check('moves',f.naturePower);","for(const iid of Object.keys(f.itemHandlers || {}))check('items',iid);check('moves',f.naturePower);")
 elif name.endswith('.py'):
  s=s.replace('sheerForce allyCanHeal canHeal oneHitKO','sheerForce allyCanHeal oneHitKO') # structured predicate excluded from Boolean validation
  s=s.replace('conditions=set(', 'conditions=set(',1)
  s=s.replace('oneHitKO zMove immunityType volatileSourceMove\'.split())','oneHitKO zMove immunityType volatileSourceMove canHeal\'.split())',1)
  at=s.index("    elif k=='immunityType':")
  s=s[:at]+"    elif k=='canHeal':ensure(isinstance(v,dict) and set(v)=={'who','value'} and v['who'] in ['user','target'] and isinstance(v['value'],bool),where,'invalid healing predicate')\n"+s[at:]
  at=s.index("        if op=='secondaryChance':")
  s=s[:at]+"        if 'sourceAbility' in a:ensure(op=='boost' and a['sourceAbility']=='intimidate',where,'invalid boost source');reference('abilities',a['sourceAbility'],where)\n        if 'silent' in a:ensure(op=='volatile' and isinstance(a['silent'],bool),where,'invalid silent volatile')\n"+s[at:]
  at=s.index("    for aid,callbacks in f.get('abilityHandlers'")
  s=s[:at]+"    for iid,callbacks in f.get('itemHandlers',{}).items():\n        reference('items',iid,name)\n        for key,row in callbacks.items():\n            ensure(key in ['onResidual','onStart','onModifyMove'] and set(row)=={'condition','actions','source','mode'} and row.get('mode') in ['replace','prepend','append'],name,'invalid item handler');check_condition(row['condition'],name);check_actions(row['actions'],name)\n"+s[at:]
 else:
  s=s.replace('sheerForce allyCanHeal canHeal oneHitKO','sheerForce allyCanHeal oneHitKO')
  s=s.replace('oneHitKO zMove immunityType volatileSourceMove");','oneHitKO zMove immunityType volatileSourceMove canHeal");',1)
  at=s.index('  else if(k.equals("not"))')
  s=s[:at]+'  else if(k.equals("canHeal")){require(v.isJsonObject() && v.getAsJsonObject().keySet().equals(words("who value")),where,"Invalid healing predicate");var h=v.getAsJsonObject();require(words("user target").contains(h.get("who").getAsString()) && h.get("value").isJsonPrimitive() && h.getAsJsonPrimitive("value").isBoolean(),where,"Invalid healing predicate");}\n'+s[at:]
  at=s.index('   if(op.equals("secondaryChance"))')
  s=s[:at]+'   if(a.has("sourceAbility"))require(op.equals("boost") && a.get("sourceAbility").getAsString().equals("intimidate"),where,"Invalid boost source");\n   if(a.has("silent"))require(op.equals("volatile") && a.get("silent").isJsonPrimitive() && a.getAsJsonPrimitive("silent").isBoolean(),where,"Invalid silent volatile");\n'+s[at:]
  at=s.index('   if(fieldExtra.has("abilityHandlers"))')
  s=s[:at]+'   if(fieldExtra.has("itemHandlers"))for(var iid:fieldExtra.getAsJsonObject("itemHandlers").entrySet()){require(iid.getKey().matches("[a-z0-9]+"),entry.getKey(),"Invalid item handler ID");for(var handler:iid.getValue().getAsJsonObject().entrySet()){var r=handler.getValue().getAsJsonObject();require(words("onResidual onStart onModifyMove").contains(handler.getKey()) && r.keySet().equals(words("actions condition mode source")) && words("replace append prepend").contains(r.get("mode").getAsString()),entry.getKey(),"Invalid item handler");condition(r.get("condition"),fields,entry.getKey());actions(r.getAsJsonArray("actions"),fields,entry.getKey());}}\n'+s[at:]
 p.write_text(s,encoding='utf-8')
