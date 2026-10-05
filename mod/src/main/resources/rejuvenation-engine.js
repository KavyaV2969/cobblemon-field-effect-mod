/* Original implementation. Loaded into Cobblemon's existing Graal context.
 * Datapacks contain a closed rule algebra, never executable Ruby or JavaScript.
 */
(function (global) {
  'use strict';
  if (global.RejuvenationEngine) return;
  const root = typeof global.REJUVENATION_SHOWDOWN_ROOT === 'string' ? global.REJUVENATION_SHOWDOWN_ROOT : './';
  const {BattleStream} = require(root + 'sim/battle-stream');
  const {Battle} = require(root + 'sim/battle');
  const {BattleActions} = require(root + 'sim/battle-actions');
  const {BattleQueue} = require(root + 'sim/battle-queue');
  const {Field} = require(root + 'sim/field');
  const {Pokemon} = require(root + 'sim/pokemon');
  const {Dex:RegistryDex} = require(root + 'sim/dex');
  const {Cobblemon} = require(root + 'sim/cobblemon/cobblemon');
  const id = s => String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const indoor = 'rejuvenation:indoor';
  const effectId = 'rejuvenationfieldengine';
  const effect = {id:effectId, name:'Rejuvenation Field', effectType:'PseudoWeather'};
  let catalog = null;
  const types = ['Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison','Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy','Shadow','???'];
  function freeze(o) { if(o && typeof o === 'object' && !Object.isFrozen(o)) { Object.freeze(o); for (const v of Object.values(o)) freeze(v); } return o; }
  function state(b) { return b.rejuvenation; }
  function current(b) { return state(b)?.catalog.fields[state(b).id]; }
  function active(b) { return b.sides.filter(Boolean).flatMap(s=>s.active).filter(p => p && !p.fainted); }
  function orderedActive(b){const mons=active(b);b.speedSort(mons,(a,c)=>c.getActionSpeed()-a.getActionSpeed());return mons;}
  function airborne(p) { return p && !p.isGrounded(); }
  function canHeal(b,p){return p.hp>0 && p.hp<p.maxhp && !p.volatiles.healblock && !healingBlocked(b,p,b.effect);}
  function context(b,user,target,move,value) { return {b,user,target,move:move || b.activeMove,value}; }
  const conditionEntries=new WeakMap();
  function test(c,x) {
    if(!c) return true;
    let entry=conditionEntries.get(c);
    if(!entry){entry=Object.entries(c)[0];if(Object.isFrozen(c))conditionEntries.set(c,entry);}
    const [key,arg] = entry;
    const who = v => x[v === 'target' ? 'target' : 'user'];
    const compare=(a,op,b)=>op==='>'?a>b:op==='>='?a>=b:op==='<'?a<b:op==='<='?a<=b:a===b;
    switch(key) {
      case 'volatileSourceMove': return who(arg.who)?.volatiles[arg.id]?.sourceEffect?.id===arg.move;
      case 'immunityType': return arg.includes(x.immunityType);
      case 'always': return arg;
      case 'all': return arg.every(v=>test(v,x));
      case 'any': return arg.some(v=>test(v,x));
      case 'not': return !test(arg,x);
      case 'move': return x.move?.id===arg;
      case 'sourceMove': return x.move?.sourceEffect===arg;
      case 'moveType': return x.move?.type===arg;
      case 'attackType': return x.move?.type===arg || !!x.move?.rejuvenationTypes?.includes(arg);
      case 'foeFainted': return (!!x.target && x.target.side!==x.user?.side && x.target.hp<=0)===arg;
      case 'category': return x.move?.category===arg;
      case 'flag': return !!x.move?.flags?.[arg];
      case 'pseudoWeather': return !!x.b.field.pseudoWeather[arg.id]===arg.value;
      case 'field': return state(x.b)?.id===arg;
      case 'backup': return state(x.b)?.stack.at(-2)?.id===arg;
      case 'grounded': return !!who(arg.who) && !airborne(who(arg.who))===arg.value;
      case 'ability': return !!who(arg.who)?.hasAbility(arg.values);
      case 'effectiveAbility': return !!who(arg.who)?.hasAbility(arg.values) && !x.b.suppressingAbility(who(arg.who));
      case 'item': return !!who(arg.who)?.hasItem(arg.values);
      case 'type': return !!who(arg.who)?.hasType(arg.value);
      case 'species': return id(who(arg.who)?.baseSpecies?.baseSpecies || who(arg.who)?.baseSpecies?.name)===arg.value;
      case 'formName': return (who(arg.who)?.species?.forme || '')===arg.value;
      case 'role': return who(arg.who)?.rejuvenationRoles?.[state(x.b)?.id]===arg.value;
      case 'moveTarget': return x.move?.target===arg;
      case 'fullHealing': return (x.value===x.target?.maxhp)===arg;
      case 'faster': return !!x.target && (arg.stored?x.user?.storedStats.spe:x.user?.getStat('spe'))>(arg.stored?x.target.storedStats.spe:x.target.getStat('spe'));
      case 'lastMove': return arg.values.includes(who(arg.who)?.lastMove?.id);
      case 'form': return arg.value===0 ? !who(arg.who)?.species?.id.includes('-') : false;
      case 'status': return (x.status?.id || x.status)===arg;
      case 'weather': return !!x.b.field.weather && x.b.field.isWeather(arg);
      case 'weatherFor': return arg.values.includes(who(arg.who)?.hasAbility('megasol')?'sunnyday':x.b.field.effectiveWeather());
      case 'incomingWeather': return arg.includes(x.status?.id || x.status);
      case 'startedCondition': return arg.includes(x.status?.id || x.status);
      case 'damageSource': return arg.includes(x.move?.id);
      case 'counter': return compare(state(x.b)?.counters[arg.index-1] || 0,arg.op,arg.value);
      case 'hp': {const amount=(who(arg.who)?.maxhp || 0)*arg.fraction;return compare(who(arg.who)?.hp,arg.op,arg.round===false?amount:Math.floor(amount));}
      case 'priority': return compare(x.move?.priority || 0,arg.op,arg.value);
      case 'foe': return !!x.user && !!x.target && x.user.side!==x.target.side;
      case 'missed': return !!state(x.b)?.missed===arg;
      case 'volatile': return !!who(arg.who)?.volatiles[arg.id];
      case 'semiInvulnerable': return !!who(arg.who)?.isSemiInvulnerable()===arg.value;
      case 'globalAbility': return active(x.b).some(p=>p.hasAbility(arg));
      case 'effectiveness': return compare(x.b.dex.getEffectiveness(arg.type,who(arg.who)),arg.op,arg.value);
      case 'turnsActive': return compare(who(arg.who)?.activeTurns || 0,arg.op,arg.value);
      case 'stateFlag': return !!state(x.b)?.[arg]===true;
      case 'overlay': return state(x.b)?.overlay?.id===arg;
      case 'weatherActive': return (!!x.b.field.weather && !!x.b.field.effectiveWeather())===arg;
      case 'pokemonStatus': return x.user?.status===arg;
      case 'targetStatus': return x.target?.status===arg;
      case 'chance': return x.b.randomChance(arg.numerator,arg.denominator);
      case 'samePokemon': return (x.user===x.target)===arg;
      case 'level': return compare(who(arg.who)?.level,arg.op,arg.value);
      case 'transformed': return !!x.user?.transformed===arg;
      case 'wild': return (state(x.b)?.actorTypes?.[who(arg.who)?.side.id]==='wild')===arg.value;
      case 'itemStealable': return canStealItem(x.b,x.user,x.target)===arg;
      case 'usableMove': {const slot=who(arg.who)?.moveSlots.find(s=>s.id===x.move?.id);return !!slot && (slot.pp>0 || slot.maxpp===0);}
      case 'pokemonActive': return !!who(arg.who)?.isActive;
      case 'pokemonFlag': return !!(arg.id==='illusion'?who(arg.who)?.illusion:who(arg.who)?.rejuvenationFlags?.[arg.id])===arg.value;
      case 'statSumComparison': {const mons=arg.group==='foes'?x.user.foes():x.user.alliesAndSelf();const sum=stat=>mons.filter(p=>p.hp>0).reduce((total,p)=>{const stage=p.boosts[stat];return total+p.storedStats[stat]*(stage<0?2/(2-stage):(2+stage)/2);},0);return compare(sum(arg.left),arg.op,sum(arg.right));}
      case 'contact': {const attacker=who(arg.who),defender=arg.who==='target'?x.user:x.target;return !!x.move && !!attacker && x.b.checkMoveMakesContact(x.move,attacker,defender);}
      case 'hasAlly': return !!x.user?.allies().some(p=>p.hp>0)===arg;
      case 'statsLowered': return (!!x.boosts && Object.values(x.boosts).some(n=>n<0))===arg;
      case 'selfInflicted': return (x.source===x.target)===arg;
      case 'sideAbility': return active(x.b).some(p=>p.side===who(arg.who)?.side && p.hasAbility(arg.values));
      case 'sideCondition': return !!x.user?.side.sideConditions[arg];
      case 'value': return compare(x.value,arg.op,arg.value);
      case 'abilityChangedType': return !!x.move?.typeChangerBoosted===arg;
      case 'basePower': return compare(x.basePower ?? x.move?.basePower ?? 0,arg.op,arg.value);
      case 'holderAllied': return (!!x.holder && !!x.user && x.holder.isAlly(x.user))===arg;
      case 'hitEffectiveness': return !!x.target && !!x.move && compare(x.target.getMoveHitData(x.move).typeMod,arg.op,arg.value);
      case 'allyAbility': return !!who(arg.who)?.allies().some(p=>p.hp>0 && p.hasAbility(arg.values));
      case 'variableMultihit': return (!!x.move && Array.isArray(x.b.dex.moves.get(x.move.id).multihit))===arg;
      case 'sideItem': return active(x.b).some(p=>p.side===who(arg.who)?.side && p.hasItem(arg.values));
      case 'holderAbilityState': return !!x.holder?.abilityState?.[arg];
      case 'baseMoveType': return !!x.move && x.b.dex.moves.get(x.move.id).type===arg;
      case 'effectId': return x.move?.id===arg;
      case 'calledBy': return (x.move?.sourceEffect || '')===arg;
      case 'accuracyMiss': return (!!x.user && state(x.b)?.accuracyMiss===x.user)===arg;
      case 'zMove': return !!x.move?.isZ===arg;
      case 'oneHitKO': return !!x.move?.ohko===arg;
      case 'canFlinch': return (!!x.move?.secondaries?.some(s=>s.volatileStatus==='flinch'))===arg;
      case 'baseCanFlinch': return (!!x.b.dex.moves.get(x.move?.id).secondaries?.some(s=>s.volatileStatus==='flinch'))===arg;
      case 'sheerForce': return !!x.move?.hasSheerForce===arg;
      case 'canHeal': return !!who(arg.who) && canHeal(x.b,who(arg.who))===arg.value;
      case 'allyCanHeal': return !!x.user?.allies().some(p=>canHeal(x.b,p))===arg;
      case 'drainHealed': return (!!x.user && state(x.b)?.drainHealed===x.user)===arg;
      case 'damageDealt': return (x.move?.totalDamage>0)===arg;
      case 'connected': return !!state(x.b)?.connected===arg;
      case 'boostStage': return compare(who(arg.who)?.boosts?.[arg.stat] ?? 0,arg.op,arg.value);
      case 'actorType': return arg.values.includes(state(x.b)?.actorTypes?.[who(arg.who)?.side.id]);
      case 'holderIsUser': return (!!x.holder && x.holder===x.user)===arg;
      default: throw new Error('Unknown field condition '+key);
    }
  }
  function message(b,text,user,target) {
    if(!text) return;
    // The pipe is Rejuvenation's field-note cutoff marker, not a line break.
    text=text.replace(/\|/g,'').replace(/\{1\}/g,user?.name || 'The Pokémon').replace(/\{2\}/g,target?.name || 'the Pokémon');
    for(const line of text.split(/\n+/)) if(line) b.add('rejuvenationmessage',line);
  }
  // Source entry effects are wrapped in pbCanIncrease/ReduceStatStage: nothing at all is shown when no listed stage can move.
  // playStatMessage(:FieldAbility) (Battle_Effects.rb:836-838): one line naming the cause replaces the ordinary stat lines.
  function flavoredBoost(b,p,a,apply){
    const names={atk:'Attack',def:'Defense',spa:'Sp. Atk',spd:'Sp. Def',spe:'Speed',accuracy:'accuracy',evasion:'evasiveness'},moved=Object.keys(a.stats).filter(k=>p.boosts[k]<6).map(k=>names[k]);
    if(!moved.length)return apply();
    const list=moved.length>1?moved.slice(0,-1).join(', ')+' and '+moved.at(-1):moved[0],old=b.add;let shown=false;
    b.add=function(...args){if(args[0]==='-boost' && args[1]===p){if(!shown){shown=true;message(this,"{1}'s "+a.flavor+' raised its '+list+'!',p);}args.push('[rejuvenationsilent]');}return old.apply(this,args);};
    try{return apply();}finally{b.add=old;}
  }
  function canChangeStages(p,stats){const flip=p.hasAbility('contrary')?-1:1;return Object.entries(stats).some(([k,n])=>n*flip>0?p.boosts[k]<6:p.boosts[k]>-6);}
  function runActions(actions,x) {
    for (const a of actions || []) {
      const p=a.who==='target'?x.target:x.user;
      switch(a.op) {
        case 'multiply': if(typeof x.value==='number') x.value*=a.scaleField?scaledMultiplier(x.b,a.value):a.value; break;
        case 'add': if(typeof x.value==='number') x.value+=a.value; break;
        case 'set': x.value=a.value; break;
        case 'cap': if(typeof x.value==='number') x.value=Math.min(x.value,a.value); break;
        case 'reject': x.value=false; break;
        case 'clearBoosts': {let changed=false;for(const mon of a.group==='ally'?(x.user?.allies() || []):active(x.b)){if(Object.values(mon.boosts).some(n=>n!==0))changed=true;mon.clearBoosts();if(a.group==='ally')x.b.add('-clearboost',mon);}if(a.group!=='ally' && changed)x.b.add('-clearallboost');if(changed || a.always)message(x.b,a.message,x.user,a.group==='ally'?x.user?.allies()[0]:null);break;}
        case 'identifyItems': if(x.user)for(const foe of x.user.foes())if(foe.hp>0 && foe.item){x.b.add('-item',foe,foe.getItem().name,'[from] ability: '+x.user.getAbility().name,'[of] '+x.user,'[identify]');message(x.b,a.message?.replace(/\{3\}/g,foe.getItem().name),x.user,foe);}break;
        case 'boostByHighestStat': {const of=a.of==='target'?x.target:x.user;if(of && x.user && !x.user.fainted){let best='atk';for(const k of ['atk','def','spa','spd','spe'])if(of.storedStats[k]>of.storedStats[best])best=k;
          if(x.b.boost({[best]:a.amount*(a.perValue && typeof x.value==='number'?x.value:1)},x.user,x.user,effect))message(x.b,a.message?.replace('{stat}',{atk:'Attack',def:'Defense',spa:'Sp. Atk',spd:'Sp. Def',spe:'Speed'}[best]),x.user);}break;}
        case 'streakPower': {const streak=x.user?.rejuvenationStreak;if(typeof x.value==='number' && streak && x.move && streak.id===x.move.id)x.value*=a.values[Math.min(streak.count,a.values.length-1)];break;}
        case 'damageShare': x.value=Math.floor((x.b.activeMove?.totalDamage || 0)/a.divisor);break;
        case 'healByDamage': if(p && !p.fainted && x.move?.totalDamage>0 && x.b.heal(Math.floor(x.move.totalDamage/a.divisor),p,p,x.sourceEffect || effect))message(x.b,a.message,p);break;
        case 'baseAccuracy': if(x.move && !x.move.ohko)x.value=x.move.accuracy; break;
        case 'message': message(x.b,a.text,a.who==='target'?x.target:x.user,a.who==='target'?x.user:x.target); break;
        case 'groupMessage': onceMessage(x.b,a.text,x.user);break;
        case 'moveMessage': if(x.b.activeMove===x.move){x.move.rejuvenationRuleMessages ||= new Set();if(!x.move.rejuvenationRuleMessages.has(a.text)){message(x.b,a.text.replaceAll('{move}',x.move.name),x.user,x.target);x.move.rejuvenationRuleMessages.add(a.text);}}break;
        case 'boost': if(p && !p.fainted && (!(a.guarded || a.messagePlacement==='before') || canChangeStages(p,a.stats))){const apply=()=>x.b.boost(a.stats,p,a.source==='environment'?null:x.user,a.sourceAbility?x.b.dex.abilities.get(a.sourceAbility):x.move || x.sourceEffect || effect);if(a.flavor && !p.hasAbility('contrary'))flavoredBoost(x.b,p,a,apply);else if(a.messagePlacement==='before')beforeCanonicalMessage(x.b,['-boost','-unboost'],p,a.message,apply);else if(apply())message(x.b,a.message,p);} break;
        case 'preventStatLoss': if(x.boosts){let prevented=false;for(const key of Object.keys(x.boosts))if(x.boosts[key]<0){delete x.boosts[key];prevented=true;}if(prevented)message(x.b,a.message,x.target);}break;
        case 'heal': if(p && !p.fainted){if(x.b.heal((a.round?Math.round:Math.floor)(p.maxhp*a.fraction),p,p,x.sourceEffect || effect)){message(x.b,a.message,a.messageFrom==='user'?x.user:p,a.messageFrom==='user'?p:null);onceMessage(x.b,a.groupMessage,p);}else message(x.b,a.failureMessage,p);} break;
        case 'damage': if(p && a.direct){x.b.directDamage(Math.max(a.minimum || 0,Math.floor(p.maxhp*a.fraction)),p,null,effect);message(x.b,a.message,p);}else if(p && !p.hasAbility('magicguard')) { x.b.damage(Math.max(a.minimum || 0,Math.floor(p.maxhp*a.fraction)),p,p,effect); message(x.b,a.message,p); } break;
        case 'status': if(p && silentCommands(x.b,a.message?['-status']:[],p,()=>p.trySetStatus(a.status,x.user,x.sourceEffect || effect))) onceMessage(x.b,a.message,p); break;
        case 'ability': p?.setAbility(a.id,p); break;
        case 'type': if(p && p.setType(a.type)) { x.b.add('-start',p,'typechange',a.type); } break;
        case 'moveType': x.move.type=a.type; break;
        case 'volatile': if(p && silentCommands(x.b,a.message || a.silent?['-start']:[],p,()=>p.addVolatile(a.id,x.user,x.move || effect,a.linkedStatus)))message(x.b,a.message,p); break;
        case 'criticalStage': {const v=p?.volatiles[a.id];if(v)v.rejuvenationCritStage=a.stage;break;}
        case 'weightDelta': if(p){p.addVolatile('rejuvenationweight',p,effect);p.volatiles.rejuvenationweight.delta=(p.volatiles.rejuvenationweight.delta || 0)+p.species.weighthg*a.baseMultiplier;}break;
        case 'consume': if(p && !p.ignoringItem()) p.useItem(p,effect); break;
        case 'form': if(p && p.species.id!==id(a.species) && p.formeChange(a.species,p.getAbility())){if(a.type){p.setType(a.type,true);preserveFormType(p);}message(x.b,a.message,p);} break;
        case 'forcedType': if(p && (p.types.length!==1 || p.types[0]!==a.type)){p.setType(a.type,true);preserveFormType(p);message(x.b,a.message,p);}break;
        case 'itemForm': if(p){const row=a.variants.find(v=>v.items.includes(p.item));const species=row?.species || a.defaultSpecies,type=row?.type || a.defaultType;if(p.species.id!==species || p.types.length!==1 || p.types[0]!==type){p.formeChange(species,p.getAbility());p.setType(type,true);preserveFormType(p);message(x.b,a.message?.replace('{type}',type),p);}}break;
        case 'randomType': if(p && p.setType(x.b.sample(a.values),a.force || false)){message(x.b,a.message?.replace('{type}',p.getTypes()[0]),p);x.b.add('-start',p,'typechange',p.getTypes().join('/'));}break;
        case 'randomForm': if(p){const variants=a.variants.filter(v=>v.species!==p.species.id);if(variants.length){const chosen=x.b.sample(variants);p.formeChange(chosen.species,p.getAbility());p.setType(chosen.type,true);preserveFormType(p);message(x.b,a.message?.replace('{type}',chosen.type),p);}}break;
        case 'forEach': {const anchor=a.anchor==='holder'?x.holder:x.user;if(!anchor)break;const mons=a.group==='foes'?anchor.foes():a.group==='others'?active(x.b).filter(p=>p!==anchor):anchor.allies();if(a.order==='speed')x.b.speedSort(mons,(p,q)=>q.getActionSpeed()-p.getActionSpeed());let announced=false;for(const target of mons){const next={...x,user:anchor,target};if(target.hp<=0 || !test(a.condition,next))continue;if(!announced){message(x.b,a.message,anchor,target);announced=true;}runActions(a.actions,next);}break;}
        case 'abilityMessage': if(p)x.b.add('-ability',p,p.getAbility().name);break;
        case 'addSecondary': if(!x.move.secondaries?.some(s=>s[a.duplicateKey]===a.effect[a.duplicateKey])){x.move.secondaries ||= [];x.move.secondaries.push(structuredCloneValue(a.effect));}break;
        case 'stealItem': if(canStealItem(x.b,x.user,x.target)){const item=x.target.takeItem(x.user);if(item && x.user.setItem(item)){x.b.add('-enditem',x.target,item.name,'[from] ability: '+x.user.getAbility().name);x.b.add('-item',x.user,item.name,'[from] ability: '+x.user.getAbility().name);message(x.b,a.message,x.user,x.target);}}break;
        case 'removeVolatile': if(p?.removeVolatile(a.id))message(x.b,a.message,p);break;
        case 'mimicry': if(p)applyMimicry(x.b,p);break;
        case 'moveBehavior': moveBehavior(a,x);break;
        case 'removeCallbacks': for(const key of a.callbacks)delete x.move[key];break;
        case 'pairField': {
          const s=state(x.b);if(current(x.b).terrainPolicy?.blockedMessage || (a.disallowPermanentField===s.id && s.duration<=0))break;
          s.pairMemory ||= {};const previous=s.pairMemory[a.memory];s.pairMemory[a.memory]=a.token;
          const pair=previous!==a.token && a.pairs.find(pair=>pair.with===previous);
          if(!pair){message(x.b,a.firstMessage,x.user);break;}
          const duration=a.duration+(x.user?.hasItem('amplifieldrock')?a.extendedBy:0);
          if(s.id===pair.field){message(x.b,s.duration>0?pair.refreshMessage:a.permanentMessage,x.user);if(s.duration>0)s.duration=Math.max(s.duration,duration);}
          else change(x.b,pair.field,{duration,force:true,message:pair.message},x.user);
          break;
        }
        case 'survive': if(p && x.move?.effectType==='Move' && p.hp===p.maxhp && x.value>=p.hp){const slot=p.side.id+':'+p.position;if(!a.once || !state(x.b).survival.has(slot)){if(a.once)state(x.b).survival.add(slot);x.value=p.hp-1;message(x.b,a.message,p);}}break;
        case 'cureStatus': if(p){if(a.message){const status=p.status;if(status && p.clearStatus()){x.b.add('-curestatus',p,status,'[rejuvenationsilent]');message(x.b,a.message,p);}}else p.cureStatus();}break;
        case 'randomBoost': if(p){const eligible=a.stats.filter(k=>p.boosts[k]<6);if(eligible.length)x.b.boost({[x.b.sample(eligible)]:a.amount},p,p,effect);}break;
        case 'randomStat': if(p && x.b.boost({[x.b.sample(a.stats)]:a.amount},p,x.user,x.move || effect))message(x.b,a.message,p);break;
        case 'conditional': if(test(a.condition,x))runActions(a.actions,x);break;
        case 'randomStatus': if(p?.hp){const status=a.force && test(a.force.condition,x)?a.force.status:x.b.sample(a.values);p.trySetStatus(status,x.user,x.move || effect);}break;
        case 'transferStat': if(x.b.boost({[a.stat]:-a.amount},x.target,x.user,x.move || effect))x.b.boost({[a.stat]:a.amount},x.user,x.user,x.move || effect);break;
        case 'castling': if(p){const partner=p.allies().find(mon=>mon.hp>0);if(partner){if(!p.side.rejuvenationCastled){p.side.rejuvenationCastled=true;message(x.b,(p.side.n+p.position)%2===0?'O-O-O!':'O-O!');x.b.boost(a.userStats,p,p,x.move);x.b.boost(a.partnerStats,partner,p,x.move);message(x.b,a.message,p,partner);}else message(x.b,'{1} and {2} switched places!',p,partner);}}break;
        case 'counter': state(x.b).counters[a.index-1]+=a.amount;break;
        case 'clearWeather': if(x.b.field.weather)withWeatherText(x.b,a.message,()=>x.b.field.clearWeather());break;
        case 'reconcileWeather': if(p){const old=p.ability;p.ability='';try{rules(x.b,'weatherReconcile',context(x.b,p,p));}finally{p.ability=old;}}break;
        case 'randomWeather': {if(!p)break;const choices=a.choices.filter(c=>c.id!==x.b.field.weather);if(!choices.length)break;const chosen=x.b.sample(choices),previous=x.b.rejuvenationForceWeather;if(a.force)x.b.rejuvenationForceWeather=true;try{const changed=withWeatherText(x.b,chosen.message,()=>x.b.field.setWeather(chosen.id,p,x.sourceEffect || effect));if(changed){x.b.field.weatherState.duration=a.duration;x.b.field.weatherState.rejuvenationTimed=true;}}finally{if(previous)x.b.rejuvenationForceWeather=previous;else delete x.b.rejuvenationForceWeather;}break;}
        case 'setWeather': {const left=x.b.field.weatherState?.duration,set=()=>x.b.field.setWeather(a.id,x.user || 'debug',x.sourceEffect || effect),text=a.duration && current(x.b)?.timedWeatherText?.[a.id]?.startMessage;
          if(text?withWeatherText(x.b,text,set):set()){if(a.keepDuration && left!==undefined)x.b.field.weatherState.duration=left;if(a.duration){x.b.field.weatherState.duration=a.duration;x.b.field.weatherState.rejuvenationTimed=true;}runActions(a.onSuccess,x);}break;}
        case 'clearOverlay': state(x.b).overlay=null;if(x.b.field.terrain)x.b.field.clearTerrain();break;
        case 'setFlag': state(x.b)[a.id]=a.value;break;
        case 'setPokemonFlag': if(p){p.rejuvenationFlags ||= {};p.rejuvenationFlags[a.id]=a.value;}break;
        case 'weatherTemporary': {
          const turns=x.b.field.weatherState.duration;
          change(x.b,a.field,{duration:turns===undefined?0:turns+1,force:true,message:a.message},x.user);
          state(x.b).durationCondition={weather:a.weather};state(x.b).permanentCondition={not:{field:a.field}};break;
        }
        case 'bindFieldClock': state(x.b).durationCondition=a.durationCondition;state(x.b).permanentCondition=a.permanentCondition;break;
        case 'hpPower': if(x.user)x.value*=Math.min(a.maximum,1+(1-x.user.hp/x.user.maxhp)/a.scale);break;
        case 'cyclePower': {
          const s=state(x.b);let roll=x.move.rejuvenationCycleRoll ?? s.roll % a.values.length;
          if(a.maximize && test(a.maximize,x))roll=a.values.length-1;
          x.value*=a.scaleField?scaledMultiplier(x.b,a.values[roll]):a.values[roll];
          if(x.b.activeMove===x.move && !x.move.rejuvenationRollUsed){x.move.rejuvenationCycleRoll=roll;s.roll=(s.roll+1)%a.values.length;x.move.rejuvenationRollUsed=true;message(x.b,a.messages?.[roll],x.user);}
          break;
        }
        case 'randomPower': {
          let roll=x.move.rejuvenationRandomPower;
          if(roll===undefined){if(x.b.activeMove!==x.move){let choices=Array.from({length:a.range},(_,i)=>i);if(a.maximize && test(a.maximize,x))choices=[a.low,a.high];const average=choices.reduce((n,i)=>n+a.values[Math.max(0,Math.min(a.values.length-1,i+(x.user?.boosts.atk || 0)))],0)/choices.length;x.value*=a.scaleField?scaledMultiplier(x.b,average):average;break;}roll=x.b.rejuvenationPreviewRoll===undefined?x.b.random(a.range):x.b.rejuvenationPreviewRoll?a.range-1:0;if(a.maximize && test(a.maximize,x))roll=roll<a.threshold?a.low:a.high;roll=Math.max(0,Math.min(a.values.length-1,roll+(x.user?.boosts.atk || 0)));x.move.rejuvenationRandomPower=roll;message(x.b,'WHAMMO!');message(x.b,a.messages?.[roll]);}
          x.value*=a.scaleField?scaledMultiplier(x.b,a.values[roll]):a.values[roll];break;
        }
        case 'extraType': {
          const candidates=a.values.filter(t=>!a.excludePrimary || t!==x.move.type),layer=a.layer || 'field';
          if(!a.cycle && candidates.length>1)x.move.rejuvenationRandomTypes=true;
          x.move.rejuvenationTypeRolls ||= {};let t=x.move.rejuvenationTypeRolls[layer];
          if(t===undefined){const s=state(x.b);t=a.cycle?candidates[s.roll%candidates.length]:x.b.activeMove===x.move?x.b.sample(candidates):'???';
            if(x.b.activeMove===x.move){x.move.rejuvenationTypeRolls[layer]=t;if(a.cycle)s.roll=(s.roll+1)%candidates.length;}}
          // A hard field and overlay each add a type; each roll is locked independently for this move.
          if(layer==='overlay')(x.move.rejuvenationTypes ||= []).push(t);else x.move.rejuvenationTypes=[t,...(x.move.rejuvenationTypeRolls.overlay?[x.move.rejuvenationTypeRolls.overlay]:[])];break;
        }
        case 'residualDamage': {
          if(!p || p.fainted)break;
          let mult=1;
          if(a.type)mult=x.b.dex.getImmunity(a.type,p)?Math.pow(2,x.b.dex.getEffectiveness(a.type,p)):0;
          for(const modifier of a.modifiers || [])if(test(modifier.condition,x))mult*=modifier.multiplier;
          if(mult>0){x.b.directDamage(Math.floor(p.maxhp*a.fraction*mult),p,null,effect);onceMessage(x.b,a.message,p);}
          break;
        }
        case 'flashFire': if(p && !p.volatiles.flashfire){p.addVolatile('flashfire',p,x.b.dex.abilities.get('flashfire'));message(x.b,a.message,p);}break;
        case 'concertNoise': for(const mon of a.single?[p]:active(x.b))if(mon && (mon.status==='slp'||mon.hasAbility('comatose'))){mon.cureStatus();if(mon.hasAbility('comatose'))mon.setAbility('none',mon,effect);x.b.directDamage(Math.floor(mon.maxhp/4),mon,null,effect);onceMessage(x.b,a.message);}break;
        case 'secondaryChance': for(const s of x.move.secondaries || []) if(!a.volatileStatus || s.volatileStatus===a.volatileStatus)s.chance=a.chance ?? Math.min(100,s.chance*a.multiplier); break;
        case 'fieldMove': if(x.user){const m=x.b.dex.getActiveMove(a.move);applyFieldMove(x.b,x.user,null,m);}break;
        case 'pseudoWeather': if(x.user)x.b.field.addPseudoWeather(a.id,x.user,x.sourceEffect || effect);else x.b.field.pseudoWeather[a.id]={id:a.id}; if(a.permanent) delete x.b.field.pseudoWeather[a.id].duration; break;
        case 'progress': progress(x.b,a.amount,x.user,a.message); break;
        case 'changeField': if(change(x.b,a.field,{duration:a.durationFromCondition?x.b.field.pseudoWeather[a.durationFromCondition]?.duration || 0:a.duration || 0,push:a.push,force:a.force,message:a.message},x.user) && a.boundCondition)state(x.b).durationCondition={pseudoWeather:{id:a.boundCondition,value:true}};break;
        case 'createField': {
          const s=state(x.b),policy=current(x.b)?.terrainPolicy;
          if(a.blockEverstone!==false && x.user?.hasItem('everstone') || policy?.blockedMessage || policy?.blockedFields?.includes(a.field) || s.id===a.field || s.overlay?.id===a.field)break;
          change(x.b,a.field,{duration:a.duration+(x.user?.hasItem('amplifieldrock')?a.extendedBy:0),message:a.message},x.user);break;
        }
        case 'destroyField': destroy(x.b,a.message); break;
        case 'oldCategory': x.move.category=['Fire','Water','Grass','Electric','Ice','Psychic','Dragon','Dark'].includes(x.move.type)?'Special':'Physical'; break;
        case 'setHPFraction': {const mon=x.target || p;if(mon)x.value=Math.max(1,Math.floor(mon.maxhp*a.fraction));break;}
        case 'harvestBerry': if(p && p.hp && !p.item && x.b.dex.items.get(p.lastItem).isBerry){const item=p.lastItem;p.lastItem='';if(p.setItem(item))x.b.add('-item',p,x.b.dex.items.get(item),'[from] ability: Harvest');}break;
        case 'volatileDuration': {const v=p?.volatiles[a.id];if(v?.duration)v.duration=Math.max(a.minimum,v.duration+a.amount);break;}
        case 'clearHazards': {let any=false;for(const side of x.b.sides)for(const key of ['spikes','toxicspikes','stealthrock','stickyweb'])if(side.removeSideCondition(key))any=true;if(any)message(x.b,a.message);break;}
        case 'trap': if(p){if(a.force)p.trapped=true;else p.tryTrap();}break;
        case 'restoreTypes': if(p && !p.fainted){const types=p.species.types;if(p.getTypes(true).join()!==types.join() && p.setType(types,true))x.b.add('-start',p,'typechange',types.join('/'),'[silent]');}break;
        case 'hazardBurst': {
          if(!x.b.sides.some(side=>side.sideConditions[a.id]))break;
          for(const text of a.messages)message(x.b,text);
          for(const mon of orderedActive(x.b)){
            const row=mon.side.sideConditions[a.id];if(!row || mon.fainted || mon.isSemiInvulnerable())continue;
            if(a.boosts){x.b.boost(a.boosts,mon,null,effect);continue;}
            if(mon.hasAbility('magicguard') || (a.grounded && airborne(mon)) || (a.immuneTypes && mon.hasType(a.immuneTypes)))continue;
            const factor=a.type?(x.b.dex.getImmunity(a.type,mon)?Math.pow(2,x.b.dex.getEffectiveness(a.type,mon)):0):1;if(!factor)continue;
            const layers=a.perLayer?row.layers || 1:1;x.b.damage(Math.floor(layers*mon.maxhp*a.fraction*factor),mon,null,effect);
            if(a.poison && !mon.fainted)mon.trySetStatus(layers>1?'tox':'psn',null,effect);
          }
          for(const side of x.b.sides)side.removeSideCondition(a.id);break;}
        case 'bothHazards': for(const side of x.b.sides)side.addSideCondition(a.id,p,effect);message(x.b,a.message,p);break;
        case 'sideCondition': if(p){p.side.addSideCondition(a.id,p,x.move || effect);if(a.duration && p.side.sideConditions[a.id])p.side.sideConditions[a.id].duration=a.duration;message(x.b,a.message,p);}break;
        case 'typedDamage': if(p && !p.hasAbility('magicguard')) {const m=x.b.dex.getImmunity(a.type,p)?Math.pow(2,x.b.dex.getEffectiveness(a.type,p)):0;const amount=Math.floor(p.maxhp*a.fraction*m);if(amount>0)(a.direct?x.b.directDamage:x.b.damage).call(x.b,amount,p,x.user,effect);message(x.b,a.message,p);}break;
        case 'spikeDamage': if(p && !airborne(p) && !p.hasAbility('magicguard')){const layers=p.side.sideConditions.spikes?.layers || 0;x.b.damage(Math.floor(p.maxhp/[8,8,6,4][layers]),p,p,effect);message(x.b,a.message,p);}break;
        case 'trickRoom': if(x.b.field.pseudoWeather.trickroom)x.b.field.removePseudoWeather('trickroom');else {x.b.field.addPseudoWeather('trickroom',p,effect);x.b.field.pseudoWeather.trickroom.duration=x.b.random(a.minimum,a.maximum+1);}break;
        case 'wish': if(p && !p.side.slotConditions[p.position]?.wish){p.side.addSlotCondition(p,'wish',p,effect);const w=p.side.slotConditions[p.position]?.wish;if(w)w.hp=Math.floor((p.maxhp+1)*a.fraction);message(x.b,a.message,p);}break;
        case 'adjustWish': {const w=p?.side.slotConditions[p.position]?.wish;if(w)w.hp=Math.max(1,Math.floor(p.maxhp*a.fraction));break;}
        case 'moveProperty': {
          const path=a.path.split('.');let container=x.move;
          for(const k of path.slice(0,-1)){container[k] ||= /^\d+$/.test(path[path.indexOf(k)+1])?[]:{};container=container[k];}
          container[path.at(-1)]=structuredCloneValue(a.value);
          if(a.removeCallback)delete x.move[a.removeCallback];break;
        }
        case 'perishSong': if(p && !p.hasAbility('soundproof'))p.addVolatile('perishsong',p,effect);break;
        case 'inverse': x.value=-(x.value || 0); break;
        case 'ice_spikes':
          if(!['rejuvenation:water_surface','rejuvenation:murkwater_surface'].includes(state(x.b).stack.at(-2)?.id)) {
            let added=false; for(const side of x.b.sides) if(side.addSideCondition('spikes',x.user,effect)) added=true;
            if(added) message(x.b,'The quake broke up the ice into spiky pieces!');
          } break;
        case 'accuracy_cloud':
          message(x.b,current(x.b).originalId==='ASHENBEACH'?'The sand was stirred up from the ground!':'Steam shot up from the field!');
          for(const mon of active(x.b)) if(!mon.isSemiInvulnerable() && !mon.volatiles.commanding) x.b.boost({accuracy:-1},mon,null,effect);
          break;
        case 'arm_eruption': if(!state(x.b).eruption) message(x.b,'The volcano is going to erupt!'); state(x.b).eruption=true; break;
        case 'cave_collapse':
          if(++state(x.b).counters[0]<2) { message(x.b,'Bits of rock fell from the crumbling ceiling!'); break; }
          message(x.b,'The quake collapsed the ceiling!');
          for(const mon of active(x.b)) {
            if(protectedFromField(mon,x.move) || mon.hasAbility(['bulletproof','rockhead'])) continue;
            let amount=mon.maxhp;
            if(mon.hasAbility(['sturdy','stalwart']) || mon.volatiles.endure) amount--;
            if(mon.hasAbility(['shellarmor','battlearmor','armortail'])) amount/=2;
            if(mon.hasAbility(['prismarmor','solidrock'])) amount/=3;
            x.b.directDamage(Math.floor(amount),mon,x.user,effect);
          }
          state(x.b).counters[0]=0; break;
        case 'mist_explosion':
          if(active(x.b).some(p=>p.hasAbility('damp'))) { message(x.b,'The dampness prevents a complete explosion!'); break; }
          for(const mon of active(x.b)) {
            if(protectedFromField(mon,x.move) || mon.hasAbility('flashfire')) continue;
            let amount=mon.maxhp*(current(x.b).originalId==='CORRUPTED'?0.5:1);
            if(current(x.b).originalId==='CORROSIVEMIST' && (mon.volatiles.endure || mon.hasAbility('sturdy'))) amount--;
            x.b.directDamage(Math.floor(amount),mon,x.user,effect);
          } break;
        case 'water_pollution':
          message(x.b,'The water was polluted!');
          for(const mon of active(x.b)) if(!mon.isSemiInvulnerable() && !mon.hasType(['Poison','Steel'])) x.b.directDamage(mon.maxhp,mon,x.user,effect);
          state(x.b).counters[0]=0; break;
        default: throw new Error('Unknown field action '+a.op);
      }
    }
    return x.value;
  }
  function moveBehavior(a,x){
    const move=x.move;
    if(a.recipe==='smartCategory'){
      const counterpart=a.comparison==='difference'?x.target:null;
      const stat=(p,stat,other)=>{const unaware=other?.hasAbility('unaware') && !x.b.suppressingAbility(other);return x.b.runEvent('Modify'+{atk:'Atk',def:'Def',spa:'SpA',spd:'SpD'}[stat],p,other,move,p.calculateStat(stat,unaware?0:p.boosts[stat],1,p));};
      const pool=(p,stats,other)=>Math.max(...stats.map(s=>stat(p,s,other)));
      const pools=current(x.b)?.statPools;
      let physical=stat(x.user,'atk',counterpart),special=pool(x.user,pools?.offensiveSpecial || ['spa'],counterpart);
      const mult=rows=>rows.reduce((n,r)=>test(r.condition,x)?n*r.factor:n,1);
      physical*=mult(a.physicalMultipliers);special*=mult(a.specialMultipliers);
      if(a.comparison==='difference' && counterpart){physical-=stat(counterpart,'def',x.user)*mult(a.defenseMultipliers);special-=pool(counterpart,pools?.defensiveSpecial || ['spd'],x.user)*mult(a.specialDefenseMultipliers);}
      move.category=physical>special?'Physical':'Special';
      if(a.contactByCategory){if(move.category==='Physical')move.flags.contact=1;else delete move.flags.contact;}
    }
    else if(a.recipe==='cureAndBoost')move.onHit=function(p){const cured=p.cureStatus();return !!this.boost(a.stats,p,p,move) || cured;};
    else if(a.recipe==='setTypes')move.onHit=function(p){if(p.getTypes().slice().sort().join('/')===a.types.slice().sort().join('/') || !p.setType([...a.types]))return false;this.add('-start',p,'typechange',a.types.join('/'),'[silent]');message(this,a.message,p);};
    else if(a.recipe==='appendHitActions'){const key=a.callback || 'onHit',old=move[key];move[key]=function(target,user,...args){const result=silentCommands(this,a.silentCommands || [],user || target,()=>old?.call(this,target,user,...args));if(result===false || result===null || result===this.NOT_FAIL)return result;runActions(a.actions,context(this,user || target,target,move));return result;};}
    else if(a.recipe==='replaceHitActions'){delete move.onTry;move.onHit=function(target,user){runActions(a.actions,context(this,user,target,move));return true;};}
    else if(a.recipe==='otherActiveHitActions'){delete move.onTry;move.onHit=function(user){let changed=false;for(const target of active(this))if(target!==user){const before=JSON.stringify(target.boosts);runActions(a.actions,context(this,user,target,move));changed ||= JSON.stringify(target.boosts)!==before;}if(!changed)message(this,a.failureMessage,user);return changed || this.NOT_FAIL;};}
    else if(a.recipe==='randomStatusSecondary')move.secondaries=(move.secondaries || [{chance:100}]).map(secondary=>({chance:secondary.chance,onHit(target,user){runActions([{op:'randomStatus',values:a.values,force:a.force,who:'target'}],context(this,user,target,move));}}));
    else if(a.recipe==='appendSecondaryActions')move.secondaries=(move.secondaries || [{chance:100}]).map(secondary=>{const old=secondary.onHit;return {...secondary,onHit(target,user,...args){const result=old?.call(this,target,user,...args);runActions(a.actions,context(this,user,target,move));return result;}};});
    else if(a.recipe==='alliesHitActions')move.onHitSide=function(side,user){let changed=false;for(const target of side.allies())if(test(a.condition,context(this,user,target,move)) && (!target.volatiles.maxguard || this.runEvent('TryHit',target,user,move))){const before=JSON.stringify(target.boosts);runActions(a.actions,context(this,user,target,move));changed ||= before!==JSON.stringify(target.boosts);}return changed;};
    else if(a.recipe==='beforeCalledMoveActions'){
      const old=move[a.callback];move[a.callback]=function(target,user,...args){const use=this.actions.useMove;this.actions.useMove=function(...moveArgs){runActions(a.actions,context(this.battle,user,target,move));return use.apply(this,moveArgs);};try{return old?.call(this,target,user,...args);}finally{this.actions.useMove=use;}};
    }
    else if(a.recipe==='randomMovePool')move.onHit=function(user){const choices=a.choices.map(mid=>this.dex.moves.get(mid));if(!choices.length)return false;const chosen=this.sample(choices);user.side.lastSelectedMove=chosen.id;this.actions.useMove(chosen.id,user);};
    else if(a.recipe==='strengthSap')move.onHit=function(target,user){if(target.boosts.atk===-6)return false;const amount=target.getStat('atk',false,true);const success=this.boost(a.stats,target,user,move,false,true);return !!this.heal(amount,user,target,move) || success;};
    else if(a.recipe==='dualBoost'){
      delete move.boosts;delete move.onTryHit;move.onHit=function(target,user){const targetChanged=this.boost(a.targetStats,target,user,move);const userChanged=this.boost(a.userStats,user,user,move);return targetChanged || userChanged;};
    }
    else if(a.recipe==='gatedStatChanges'){
      delete move.boosts;move.selfSwitch=a.selfSwitch;
      move.onTryHit=function(target,user){const p=a.gateWho==='user'?user:target;const contrary=p.hasAbility('contrary');const allowed=Object.entries(a.gateStats).some(([k,n])=>n*(contrary?-1:1)>0?p.boosts[k]<6:p.boosts[k]>-6);if(!allowed){message(this,a.failureMessage,p);return null;}return true;};
      move.onHit=function(target,user){this.boost(a.stats,target,user,move);return true;};
    }
    else if(a.recipe==='targetHealing'){
      const canHeal=(b,p)=>p.hp>0 && p.hp<p.maxhp && !p.volatiles.healblock && !healingBlocked(b,p,move);
      delete move.heal;move.onTry=function(user){return user.alliesAndSelf().some(p=>canHeal(this,p)) || false;};
      move.onTryHit=function(target){return canHeal(this,target) || false;};
      move.onHit=function(target,user){if(!canHeal(this,target))return false;const fraction=a.userFraction!==undefined && target===user?a.userFraction:a.fraction;const healed=this.heal(Math.round(target.maxhp*fraction),target,user,move);runActions(a.actions,context(this,user,target,move));return !!healed || (a.actions?.length?true:false);};
    }
    else if(a.recipe==='concertRoar'){
      delete move.forceSwitch;delete move.onTryHit;move.onTryHit=function(target,user){return user.boosts.atk<6 || target.side.pokemonLeft>target.side.active.length;};
      move.onHit=function(target,user){const increased=this.boost(a.stats,user,user,move);const canSwitch=target.side.pokemonLeft>target.side.active.length && this.runEvent('DragOut',target,user,move)!==false;if(canSwitch)target.forceSwitchFlag=true;return increased || canSwitch;};
    }
    else if(a.recipe==='boostStagePower')move.basePowerCallback=function(user){return a.base*(1+Object.values(user.boosts).reduce((n,v)=>n+Math.max(0,v),0));};
    else if(a.recipe==='forceBasePower'){
      delete move.basePowerCallback;move.basePower=a.base;
      const old=move.onPrepareHit;move.onPrepareHit=function(target,user,activeMove){const result=old?.call(this,target,user,activeMove);if(result!==false && result!==null)activeMove.basePower=a.base;return result;};
    }
    else if(a.recipe==='allActiveHitActions'){delete move.onTry;move.onHitField=function(user){for(const target of active(this))if(test(a.condition,context(this,user,target,move)))runActions(a.actions,context(this,user,target,move));return true;};}
    else if(a.recipe==='weightRatioPower')move.basePowerCallback=function(user,target){const ratio=Math.floor(user.getWeight()/target.getWeight())*a.multiplier;return ratio>=5?120:ratio>=4?100:ratio>=3?80:ratio>=2?60:40;};
    else if(a.recipe==='purify'){
      move.flags.bypasssub=1;move.onHit=function(target,user){const cured=target.cureStatus();if(cured)this.boost(a.stats,user,user,move);return !!this.heal(Math.floor(user.maxhp*a.fraction),user,user,move) || cured;};
      move.onTryHit=function(target,user){return !!target.status || user.hp<user.maxhp;};
    }
    else if(a.recipe==='swallow')move.onHit=function(p){const layers=p.volatiles.stockpile?.layers;if(!layers)return false;if(layers>=a.cureAt)p.cureStatus();const amount=Math.round(p.maxhp*a.fractions[layers-1]);this.heal(amount,p,p,move);p.removeVolatile('stockpile');};
    else if(a.recipe==='randomPowerCallback'){delete move.onBasePower;move.basePowerCallback=function(user,target){if(move.rejuvenationChancePower===undefined){const boosted=this.rejuvenationPreviewRoll===undefined?this.randomChance(a.numerator,a.denominator):this.rejuvenationPreviewRoll?a.boosted>a.base:a.boosted<a.base;move.rejuvenationChancePower=boosted?a.boosted:a.base;if(boosted && a.activation){this.attrLastMove('[anim] '+a.activation);this.add('-activate',user,'move: '+move.name);}}return move.rejuvenationChancePower;};}
    else if(a.recipe==='refreshVolatileBeforeHit')move.onPrepareHit=function(p){p.removeVolatile(a.id);};
    else if(a.recipe==='reapplyStatusHeal'){
      const oldTry=move.onTry,oldHit=move.onHit;
      move.onTry=function(p,...args){
        if(p.status!==a.status)return oldTry?.call(this,p,...args);
        if(p.hp===p.maxhp){this.add('-fail',p,'heal');return null;}
      };
      move.onHit=function(p,user,...args){
        if(p.status!==a.status)return oldHit?.call(this,p,user,...args);
        const previous=p.status,previousState=p.statusState;p.status='';
        let applied;
        // Revalidate immunity and new field restrictions without re-running
        // native status Start: that would roll RNG and clear Nightmare.
        try{applied=p.runStatusImmunity(a.status) && this.runEvent('SetStatus',p,user,move,this.dex.conditions.get(a.status));}
        finally{p.status=previous;p.statusState=previousState;}
        if(!applied)return applied;
        p.statusState={...previousState,source:user,time:a.duration,startTime:a.duration};
        this.add('-status',p,a.status,'[from] move: '+move.name);
        message(this,a.message,p);this.runEvent('AfterSetStatus',p,user,move,this.dex.conditions.get(a.status));
        this.heal(Math.floor(p.maxhp*a.fraction),p,p,move);
      };
    }
    else if(a.recipe==='payHP'){
      if(a.threshold)move.onTry=function(p){return p.hp>Math.max(1,Math.floor(p.maxhp*a.fraction));};
      // A replaced after-move cost supersedes the simulator's built-in half-HP recoil (getRecoil returns 0 unless something was hit).
      if(a.callback==='onAfterMove')move.mindBlownRecoil=false;
      move[a.callback || 'onHit']=function(target,user){const p=a.who==='user'?user:target;if(a.respectMagicGuard && p.hasAbility('magicguard'))return;if(a.requireHit && p.moveThisTurnResult!==true)return;const amount=Math.max(1,a.round?Math.round(p.maxhp*a.fraction):Math.floor(p.maxhp*a.fraction));this.directDamage(amount,p,p,move);};
    }
    else if(a.recipe==='fixedDamage'){
      delete move.damage;move.damageCallback=function(source,target){message(this,a.message,source,target);if(a.basis==='constant')return a.amount;return Math.max(1,Math.floor(a.basis==='targetHP'?target.hp*a.factor:a.basis==='targetMaxHP'?target.maxhp*a.factor:source.level*(a.randomRange?this.random(a.randomRange.minimum,a.randomRange.maximum+1)/100:a.factor)));};
    }
    else if(a.recipe==='targetWeightPower')move.basePowerCallback=function(source,target){const w=target.getWeight();return w>=2000?120:w>=1000?100:w>=500?80:w>=250?60:w>=100?40:20;};
    else if(a.recipe==='boostOnly'){
      delete move.volatileStatus;delete move.onTry;delete move.onHit;move.boosts=a.stats;
      move.onHit=function(p){message(this,a.message,p);};
    }
    else if(a.recipe==='shareHP'){
      const old=move.onHit;move.onHit=function(target,user,...args){
        const result=old?.call(this,target,user,...args);if(result===false || result===null || result===this.NOT_FAIL)return result;
        if(target.volatiles.substitute)return result;
        const average=Math.floor((target.hp+user.hp)/2);
        for(const p of [user,target]){p.sethp(Math.min(p.maxhp,average));this.add('-sethp',p,p.getHealth,'[silent]');}
        message(this,a.message,user,target);return result;
      };
    }
    else if(a.recipe==='deductPP')move.onHit=function(target){
      const last=target.lastMove;if(!last)return false;
      const deducted=target.deductPP(last.id,a.amount);if(!deducted)return false;
      this.add('-activate',target,'move: Spite',last.name,deducted);
      message(this,'{1} lost '+deducted+' PP from '+last.name+'!',target);
    };
    else if(a.recipe==='arenaRoar')move.onHit=function(target,user){
      if(!this.boost(a.stats,user,user,move))return false;
      message(this,a.message,user,target);
    };
    else if(a.recipe==='partialProtection')move.rejuvenationPartialProtection={conditions:a.conditions,fraction:a.fraction,message:a.message};
    else if(a.recipe==='firstTypeBonus')move.onEffectiveness=function(value,target,defType){
      if(defType!==target.getTypes()[0])return value;
      const bonus=this.dex.getEffectiveness(a.type,defType);
      return value+(a.positiveOnly?Math.max(0,bonus):bonus)*a.repeat;
    };
  }
  function structuredCloneValue(v){return v===undefined?undefined:JSON.parse(JSON.stringify(v));}
  function silentCommands(b,commands,p,fn){
    if(!commands.length)return fn();const old=b.add;
    b.add=function(...args){if(commands.includes(args[0]) && args[1]===p)args.push(args[0]==='-status'?'[rejuvenationsilent]':'[silent]');return old.apply(this,args);};
    try{return fn();}finally{b.add=old;}
  }
  function beforeCanonicalMessage(b,commands,p,text,fn){const old=b.add;let emitted=false;b.add=function(...args){if(!emitted && commands.includes(args[0]) && args[1]===p){emitted=true;message(this,text,p);}return old.apply(this,args);};try{return fn();}finally{b.add=old;}}
  function canStealItem(b,user,target){
    if(!user || !target || user.item || !target.item || target.volatiles.substitute || target.hasAbility('stickyhold') && !b.suppressingAbility(target))return false;
    const item=target.getItem();if(item.onTakeItem===false)return false;
    if(typeof item.onTakeItem==='function' && (item.onTakeItem.call(b,item,target,user)===false || item.onTakeItem.call(b,item,user,target)===false))return false;
    return true;
  }
  function onceMessage(b,text,user){if(!text)return;const s=state(b);s.turnMessages ||= new Set();const key=text.includes('{1}')?text+'|'+user?.getSlot():text;if(s.turnMessages.has(key))return;s.turnMessages.add(key);message(b,text,user);}
  function sync(b){const s=state(b);if(s)b.add('rejuvenationstate',JSON.stringify({field:s.id,counters:s.counters,duration:s.duration,overlay:s.overlay?.id || null,overlayDuration:s.overlay?.duration || 0}));}
  function protectedFromField(p,move) { return p.isSemiInvulnerable() || p.volatiles.commanding || p.volatiles.protect || p.side.sideConditions.wideguard || p.side.sideConditions.matblock || (p.side.sideConditions.quickguard && move?.priority>0); }
  const eventRules=new WeakMap();
  function rulesFor(field,event){
    if(!field)return [];
    if(!Object.isFrozen(field))return (field.rules || []).filter(r=>r.event===event);
    let index=eventRules.get(field);
    if(!index){index=new Map();for(const rule of field.rules || []){if(!index.has(rule.event))index.set(rule.event,[]);index.get(rule.event).push(rule);}eventRules.set(field,index);}
    return index.get(event) || [];
  }
  function rules(b,event,x) {
    for(const r of rulesFor(current(b),event))if(test(r.condition,x))runActions(r.actions,x);
    const overlay=state(b)?.overlay;
    if(overlay && ['residual','setStatus','tryHit','priority','speed','specialAttack'].includes(event))for(const r of rulesFor(state(b).catalog.fields[overlay.id],event))if(test(r.condition,x))runActions(r.actions,x);
    return x.value;
  }
  function family(f) { return f.progression?.group; }
  function releaseFieldRoll(b){if(b.activeMove)for(const key of ['rejuvenationCycleRoll','rejuvenationRollUsed','rejuvenationCycleType','rejuvenationRandomType','rejuvenationRandomPower','rejuvenationTypeRolls'])delete b.activeMove[key];}
  function change(b,field,options={},user=null) {
    const s=state(b); if(!s || s.id===field) return false;
    if(!s.catalog.fields[field]) throw new Error('Missing field '+field);
    const previous=current(b);let duration=options.duration || 0;
    if(duration>0 && s.catalog.fields[field].overlay && s.id!==indoor && !options.force) {
      if(previous.originalId==='DIMENSIONAL')duration=b.random(3,9);
      s.overlay={id:field,duration}; message(b,options.message ?? s.catalog.fields[field].entryMessage,user);
      for(const p of orderedActive(b)){rules(b,'overlayIn',context(b,p,p));applyMimicry(b,p);}reconcileEnvironmentAbilities(b,null,'field');sync(b);return true;
    }
    if(!duration && !options.push) s.stack.pop();
    if(duration && s.tempIndex===null) s.tempIndex=s.stack.length;
    s.stack.push({id:field}); s.id=field; s.counters=[0,0,0,0,0]; s.duration=duration || s.duration;
    releaseFieldRoll(b);
    s.eruption=false;
    if(s.permanentCondition && test(s.permanentCondition,context(b,user,null))){s.duration=0;s.tempIndex=null;delete s.permanentCondition;delete s.durationCondition;}
    pausedClockShift(b,previous,current(b));
    message(b,options.message ?? current(b).entryMessage,user);
    const overlayBefore=s.overlay;
    cleanOverlay(b);
    if(previous.originalId==='DEEPEARTH') b.field.removePseudoWeather('gravity');
    rules(b,'activate',context(b,user,null));
    if(!family(previous) || family(previous)!==family(current(b))){for(const mon of orderedActive(b)) enter(b,mon);
      // quarkdriveCheck precedes noOverlay in pbEffectsOnFieldChange, so it still sees an overlay that the new field removes.
      reconcileEnvironmentAbilities(b,null,'field',overlayBefore);}
    sync(b);
    return true;
  }
  function destroy(b,text) {
    const s=state(b); if(!s) return;
    const old=current(b);
    s.stack.pop(); if(!s.stack.length) s.stack.push({id:indoor});
    s.id=s.stack.at(-1).id; s.counters=[0,0,0,0,0];
    releaseFieldRoll(b);
    if(s.tempIndex!==null && s.stack.length<=s.tempIndex) { s.duration=0;s.tempIndex=null;delete s.durationCondition;delete s.permanentCondition; }
    if(old.originalId==='DEEPEARTH') b.field.removePseudoWeather('gravity');
    pausedClockShift(b,old,current(b));
    message(b,text);const overlayBefore=s.overlay;cleanOverlay(b);rules(b,'activate',context(b));for(const p of orderedActive(b)) enter(b,p);reconcileEnvironmentAbilities(b,null,'field',overlayBefore);sync(b);
  }
  function cleanOverlay(b){
    const s=state(b),policy=current(b)?.terrainPolicy;
    if(!s.overlay)return;
    if(policy?.clearOverlayOnEntry || s.overlay.id===s.id || policy?.blockedFields?.includes(s.overlay.id)){
      if(policy?.clearOverlayOnEntry)message(b,policy.blockedMessage);
      s.overlay=null;if(b.field.terrain)b.field.clearTerrain();
    }
  }
  function progress(b,amount,user,text) {
    const f=current(b),p=f.progression;if(!p)return;
    if(p.group==='flower_garden' && amount>0 && user?.hasAbility('ripen'))amount*=2;
    const stage=Math.max(1,Math.min(p.maximum,p.stage+amount));
    change(b,'rejuvenation:'+p.group+'_'+stage,{message:text || (amount>0?'{1} grew the garden!':'The garden was cut down!')},user);
  }
  function secondaryTypes(b,move,user,target,data=current(b)) {
    const extra=[]; const mr=data?.moves[move.id];
    if(mr?.additionalType) extra.push(mr.additionalType[0]+mr.additionalType.slice(1).toLowerCase());
    else for(const r of data?.types || []) if(r.additionalType && test(r.match,context(b,user,target,move)) && test(r.condition,context(b,user,target,move))) extra.push(r.additionalType[0]+r.additionalType.slice(1).toLowerCase());
    return extra;
  }
  function typeMultiplier(b,move,user,target,data) {
    const selected=(data?.types || []).filter(r=>r.multiplier!==undefined && test(r.match,context(b,user,target,move)) && test(r.condition,context(b,user,target,move)));
    const flags=selected.filter(r=>r.match.flag); const candidates=flags.length?flags:selected;
    return candidates.length?Math.max(...candidates.map(r=>r.multiplier)):1;
  }
  function typeMessage(b,move,user,target,data) {
    // Ruby chooses the first matching flag message, before the ordinary type.
    // Conditions select the multiplier, not the message lookup.
    const rows=data?.types || [],x=context(b,user,target,move);
    return rows.find(r=>r.match.flag && r.message && test(r.match,x))?.message ||
      rows.find(r=>r.match.moveType && r.message && test(r.match,x))?.message;
  }
  function willChange(b,move,user,target) {
    const s=state(b),f=current(b),m=f.moves[move.id]; if(!m?.transition)return false;
    const counters=s.counters.slice();if(m.counter)s.counters[m.counter.index-1]+=m.counter.amount;
    // Battle_Field.rb:568 runs the change condition inside the damage calculation of a move that hits
    // (missAcc is false there), so an earlier action's per-move result never decides it.
    const own=k=>Object.prototype.hasOwnProperty.call(s,k),had=[own('missed'),own('connected')],results=[s.missed,s.connected];
    s.missed=false;s.connected=true;
    let can;
    try{can=test(m.transition.condition,context(b,user,target,move));}
    finally{s.counters=counters;['missed','connected'].forEach((k,i)=>{if(had[i])s[k]=results[i];else delete s[k];});}
    const dest=s.catalog.fields[m.transition.field];
    return can && (!family(f) || family(f)!==family(dest));
  }
  function power(b,power,user,target,move) {
    const f=current(b);if(!f || move.category==='Status')return;
    const s=state(b),overlay=s.overlay && s.catalog.fields[s.overlay.id]?.overlay;
    let mult=f.moves[move.id]?.multiplier ?? 1;
    const weather=user?.hasAbility('megasol')?'sunnyday':b.field.effectiveWeather();
    const blocked=f.originalId==='STARLIGHT' && weather && weather!=='deltastream';
    if(blocked)mult=1;
    let hard=typeMultiplier(b,move,user,target,f),soft=typeMultiplier(b,move,user,target,overlay);
    if(blocked)hard=1;
    mult=scaledMultiplier(b,mult);hard=scaledMultiplier(b,hard);soft=scaledMultiplier(b,soft);
    const moveBoost=mult,overlayMoveBoost=scaledMultiplier(b,overlay?.moves[move.id]?.multiplier ?? 1);
    mult*=hard>1 && soft>1?Math.max(hard,soft,scaledMultiplier(b,f.multiplierPolicy?.combinedMinimum || 1.5)):hard*soft;
    mult*=overlayMoveBoost;
    mult=rules(b,'basePower',context(b,user,target,move,mult));
    if(willChange(b,move,user,target))mult*=1.3;
    if(b.activeMove===move) {
      const text=f.moves[move.id]?.message;
      if(moveBoost!==1 && text && (!move.rejuvenationMessage || text.includes('{1}'))){
        const seen=move.rejuvenationMessageTargets ||= new Set();
        if(!seen.has(target)){message(b,text,target,user);seen.add(target);}
      }
      if(!move.rejuvenationMessage){
        if(hard!==1)message(b,typeMessage(b,move,user,target,f),user,target);
        else if(soft!==1)message(b,typeMessage(b,move,user,target,overlay),user,target);
        if(overlayMoveBoost!==1)message(b,overlay?.moves[move.id]?.message,user,target);
        move.rejuvenationMessage=true;
      }
    }
    if(mult!==1)return b.chainModify(mult);
  }
  function scaledMultiplier(b,value){
    const policy=current(b)?.multiplierPolicy,mode=state(b)?.mode;
    if(!policy || !mode || mode.online || value===0)return value;
    if(mode.difficultyMode===policy.casualMode && !mode.fieldFrenzy)return 1+(value-1)*policy.casualFactor;
    if(mode.difficultyMode!==policy.casualMode && mode.fieldFrenzy)return value>1?1+(value-1)*policy.frenzyBoostFactor:value<1?value*policy.frenzyReductionFactor:value;
    return value;
  }
  function modifyMove(b,move,user,target) {
    const f=current(b);if(!f)return;
    const r=f.moves[move.id];
    if(r?.accuracy!==undefined)move.accuracy=r.accuracy===0?true:r.accuracy;
    move.rejuvenationTypes=secondaryTypes(b,move,user,target);
    rules(b,'modifyMove',context(b,user,target,move));
    if(!move.rejuvenationTryMoveWrapped){const nativeTry=move.onTryMove;
      move.rejuvenationTryMoveWrapped=true;
      move.onTryMove=function(user,target,activeMove){
        if(rules(this,'tryMove',context(this,user,target,activeMove,true))===false)return false;
        const f=current(this);
        if(f.moves[activeMove.id]?.multiplier===0){message(this,f.moves[activeMove.id]?.message,target,user);return false;}
        if(typeMultiplier(this,activeMove,user,target,f)===0){message(this,typeMessage(this,activeMove,user,target,f),user,target);return false;}
        return nativeTry?.call(this,user,target,activeMove);
      };
    }
    const overlay=state(b).overlay;
    if(overlay)move.rejuvenationTypes.push(...secondaryTypes(b,move,user,target,state(b).catalog.fields[overlay.id].overlay));
    if(move.id==='naturepower' && b.dex.moves.get(f.naturePower).exists) {
      move.onHit=function(target,source) { this.actions.useMove(f.naturePower,source,target); };
    }
    if(move.id==='secretpower'){
      const mimic=state(b).catalog.fields[state(b).overlay?.id || state(b).id];
      // The chosen effect is a secondary: it never changes the hit's damage (previews treat the draw as effect-only).
      effectDraws++;let chosen;try{chosen=b.sample(mimic.secretPowerEffects);}finally{effectDraws--;}
      // The catalog is frozen; the simulator annotates secondary and self effect objects while it applies them.
      move.secondaries=[{chance:move.secondaries?.[0]?.chance || 30,...JSON.parse(JSON.stringify(chosen))}];
    }
    if(move.id==='camouflage'){const mimic=state(b).catalog.fields[state(b).overlay?.id || state(b).id];move.onHit=function(p){const t=mimic.mimicry;if(t && types.includes(t)){p.setType(t);this.add('-start',p,'typechange',t);}};}
  }
  function afterMove(b,user,target,move) {
    const f=current(b);if(!f)return;
    const r=f.moves[move.id];
    state(b).missed=user.moveThisTurnResult===false;
    // Protection and immunity leave a null result: the move neither failed outright nor connected (Battler.rb:6725 realnumhits == 0).
    state(b).connected=user.moveThisTurnResult===true;
    applyFieldMove(b,user,target,move);
    // effects[:Metronome]: consecutive successful uses of one move, counted without the item (Battler.rb:7156-7167).
    const streak=user.rejuvenationStreak;
    user.rejuvenationStreak=state(b).connected?{id:move.id,count:streak?.id===move.id?streak.count+1:1}:{id:move.id,count:0};
    state(b).accuracyMiss=null;state(b).drainHealed=null;
    sync(b);
  }
  function applyFieldMove(b,user,target,move){
    const f=current(b);if(!f)return;const r=f.moves[move.id];
    for(const t of f.types)if(t.after && test(t.match,context(b,user,target,move)) && test(t.condition,context(b,user,target,move)))runActions(t.after,context(b,user,target,move));
    if(r?.counter) {
      const c=r.counter,s=state(b);s.counters[c.index-1]+=c.amount;
      if(s.counters[c.index-1]<c.maximum)message(b,c.message);
    }
    if(r?.after)runActions(r.after,context(b,user,target,move));
    if(r?.transition && test(r.transition.condition,context(b,user,target,move))) {
      const t=r.transition;
      // Ruby evaluates change effects after replacement, except water pollution.
      const early=(t.after || []).filter(a=>a.op==='water_pollution');
      runActions(early,context(b,user,target,move));
      let dest=t.field;
      if(f.originalId==='ICY' && ['rejuvenation:water_surface','rejuvenation:murkwater_surface','rejuvenation:cave'].includes(state(b).stack.at(-2)?.id))dest=indoor;
      if(f.progression?.group==='flower_garden' && user.hasAbility('ripen') && state(b).catalog.fields[dest]?.progression?.stage>f.progression.stage)dest=state(b).catalog.fields[dest].moves[move.id]?.transition?.field || dest;
      if(dest===indoor)destroy(b,t.message);
      else change(b,dest,{push:t.push,message:t.message},user);
      runActions((t.after || []).filter(a=>a.op!=='water_pollution'),context(b,user,target,move));
    }
    rules(b,'afterMove',context(b,user,target,move));
    sync(b);
  }
  function seed(b,p) {
    const f=current(b),s=f.seed;if(!s || !p.hasItem(s.item) || p.ignoringItem())return;
    b.boost(s.stats,p,p,effect);
    runActions(f.seedActions,context(b,p,p));
    if(s.effect) {
      let volatile=s.effect;
      if(volatile==='protect' && typeof s.duration==='string')volatile=id(s.duration);
      if(volatile==='multiturnattack')volatile='partiallytrapped';
      if(volatile==='hyperbeam')volatile='mustrecharge';
      if(volatile==='flashfire') { p.addVolatile('flashfire',p,b.dex.abilities.get('flashfire')); }
      else if(b.dex.conditions.get(volatile).exists) {
        p.addVolatile(volatile,p,volatile==='partiallytrapped'?b.dex.moves.get(s.duration):effect);
        const v=p.volatiles[volatile];
        if(v){
          if(volatile==='focusenergy')v.rejuvenationCritStage=s.duration;
          else if(volatile==='partiallytrapped')v.duration=4;
          else if(typeof s.duration==='number' && s.duration>0)v.duration=s.duration;
          if(volatile==='shelltrap')v.rejuvenationSeed=true;
        }
      }
    }
    message(b,s.message,p);
    if(f.progression?.group==='flower_garden')progress(b,1,p,'The '+p.getItem().name+' grew the garden!');
    if(!p.useItem(p,effect) && !p.hp && p.item===s.item){const item=p.getItem();b.add('-enditem',p,item);p.lastItem=p.item;p.item='';p.itemState={id:'',target:p};p.usedItemThisTurn=true;b.runEvent('AfterUseItem',p,null,null,item);}
  }
  function enter(b,p) {
    const f=current(b);if(!f || p.fainted)return;
    seed(b,p);rules(b,'switchIn',context(b,p,p));rules(b,'overlayIn',context(b,p,p));
    applyMimicry(b,p);
  }
  function environmentAbilityRows(b){return (state(b)?.catalog || catalog)?.fields[indoor]?.environmentAbilities || {};}
  // Battle.rb quarkdriveCheck / protosynthesisCheck and the switch-in block of Battler.rb:3416-3441 run at different moments:
  //  entry   - a battler entering (or gaining the ability) is boosted only by the entry condition, otherwise by Booster Energy;
  //  field   - Quark Drive is re-examined when an overlay is set, the hard field changes or an Electric Terrain overlay ends;
  //  weather - Protosynthesis is re-examined when weather starts, ends or is uncovered/hidden by Cloud Nine and Air Lock.
  // Nothing else re-examines them, so a qualifying hard field does not boost a battler that merely switches into it.
  function reconcileEnvironmentAbilities(b,only,mode,overlayBefore){
    const s=state(b);if(!s)return;
    const kept=s.overlay;if(overlayBefore!==undefined)s.overlay=overlayBefore;
    try{
    for(const p of only?[only]:orderedActive(b))for(const [key,row]of Object.entries(environmentAbilityRows(b))){
      if(!p.hp)continue;
      const x=context(b,p,p),v=p.volatiles[key],ability=b.dex.abilities.get(key),usable=p.hasAbility(key) && !p.transformed;
      const stats={atk:'Attack',def:'Defense',spa:'Sp. Atk',spd:'Sp. Def',spe:'Speed'};
      function activate(text,sourceEffect=ability){b.add('-ability',p,ability.name);const result=silentCommands(b,['-start','-activate'],p,()=>p.addVolatile(key,p,sourceEffect));if(result)message(b,text.replace('{stat}',stats[p.volatiles[key]?.bestStat || p.getBestStat(false,true)]),p);}
      if(mode==='entry'){if(usable && !v && test(row.entryCondition,x))activate(row.messages.at(-1).text);continue;}
      if((row.callback==='onTerrainChange'?'field':'weather')!==mode)continue;
      if(test(row.condition,x)){if(usable && !v){const text=row.messages.find(r=>test(r.condition,x))?.text;if(text)activate(text);}}
      else if(v && !v.fromBooster){silentCommands(b,['-end'],p,()=>p.removeVolatile(key));message(b,row.expiryMessage,p);if(usable && p.hasItem('boosterenergy')){const item=p.getItem();if(p.useItem(p,ability))activate(row.boosterMessage,item);}}
    }
    }finally{s.overlay=kept;}
  }
  function installEnvironmentAbilities(b){
    for(const [key,row]of Object.entries(environmentAbilityRows(b))){const ability=b.dex.abilities.get(key);if(ability.rejuvenationEnvironmentWrapped)continue;const next={...ability,rejuvenationEnvironmentWrapped:true};
      for(const callback of ['onStart',row.callback]){const old=ability[callback];next[callback]=function(p,...args){if(state(this) && environmentAbilityRows(this)[key]){if(callback==='onStart')return reconcileEnvironmentAbilities(this,p,'entry');if(callback==='onWeatherChange')return reconcileEnvironmentAbilities(this,p,'weather');return;}return old?.call(this,p,...args);};}
      b.dex.abilities.abilityCache.set(key,Object.freeze(next));
    }
    const item=b.dex.items.get('boosterenergy');if(!item.rejuvenationEnvironmentWrapped){const old=item.onUpdate;b.dex.items.itemCache.set('boosterenergy',Object.freeze({...item,rejuvenationEnvironmentWrapped:true,onUpdate(p){const row=environmentAbilityRows(this)[p.ability];if(state(this) && row && (p.volatiles[p.ability] || test(row.entryCondition,context(this,p,p))))return;return old.call(this,p);}}));}
  }
  function applyMimicry(b,p){
    if(!p.hasAbility('mimicry'))return;
    const s=state(b),f=s.catalog.fields[s.overlay?.id || s.id];
    function setBaseTypes(next){
      const added=p.addedType;
      const changed=p.setType(next,true);if(changed && added)p.addType(added);
      return changed;
    }
    if(f.id===indoor){if(p.types.join('/')!==p.baseSpecies.types.join('/') && setBaseTypes(p.baseSpecies.types))message(b,'{1} returned to its original type!',p);return;}
    let type=f.mimicry==='Qmarks'?'???':f.mimicry;
    if(f.mimicryRoll){const r=f.mimicryRoll;if(r.cycle){type=r.values[s.roll%r.values.length];if(p.types.length===1 && p.types[0]===type)return;s.roll=(s.roll+1)%r.values.length;}else type=b.sample(r.values);}
    if(type && types.includes(type) && (p.types.length!==1 || p.types[0]!==type) && setBaseTypes(type)){message(b,"{1}'s type changed to "+type+'!',p);b.add('-start',p,'typechange',type,'[from] ability: Mimicry');}
  }
  function residual(b) {
    const s=state(b);if(!s)return;
    s.turnMessages=new Set();
    holdPausedClocks(b);
    rules(b,'fieldResidual',context(b));
    for(const p of orderedActive(b))rules(b,'residual',context(b,p,p));
    s.eruption=false;
    if(s.duration>0 && s.permanentCondition && test(s.permanentCondition,context(b))){s.duration=0;s.tempIndex=null;delete s.permanentCondition;delete s.durationCondition;}
    if(s.duration>0){--s.duration;if(s.durationCondition && !test(s.durationCondition,context(b)))s.duration=0;}
    if(s.duration===0 && s.tempIndex!==null) {
      const text=current(b).endMessage,expired=current(b);
      s.stack.splice(s.tempIndex); if(!s.stack.length)s.stack.push({id:indoor});
      if(current(b).originalId==='DEEPEARTH')b.field.removePseudoWeather('gravity');
      s.id=s.stack.at(-1).id;s.tempIndex=null;s.counters=[0,0,0,0,0];delete s.durationCondition;delete s.permanentCondition;pausedClockShift(b,expired,current(b));message(b,text || current(b).expirationReturnMessage);cleanOverlay(b);rules(b,'activate',context(b));
      releaseFieldRoll(b);
      for(const p of orderedActive(b))enter(b,p);
      if(b.field.terrain)b.field.clearTerrain();
      reconcileEnvironmentAbilities(b,null,'field');
    }
    if(s.overlay && !current(b).clockPolicy?.pauseOverlay && --s.overlay.duration<=0) { message(b,s.catalog.fields[s.overlay.id].endMessage || 'The terrain returned to normal.');const ended=s.overlay.id;s.overlay=null;if(b.field.terrain)b.field.clearTerrain();for(const p of active(b))applyMimicry(b,p);if(s.catalog.fields[ended].originalId==='ELECTERRAIN')reconcileEnvironmentAbilities(b,null,'field'); }
    sync(b);
  }
  const condition={
    name:'Rejuvenation Field Engine',effectType:'PseudoWeather',
    onFieldStart(){message(this,current(this)?.entryMessage);rules(this,'activate',context(this));},
    onBasePowerPriority:1,onBasePower(powerValue,user,target,move){return power(this,powerValue,user,target,move);},
    onModifyMovePriority:100,onModifyMove(move,user,target){modifyMove(this,move,user,target);},
    onAfterMove(user,target,move){afterMove(this,user,target,move);},
    onDamagingHitPriority:100,onDamagingHit(damage,target,user,move){if(damage>0 && target?.hp>0)rules(this,'afterHit',context(this,user,target,move));},
    onSwitchInPriority:-2,onSwitchIn(p){rules(this,'pokemonEntry',context(this,p,p));enter(this,p);},
    onFieldResidualOrder:28,onFieldResidual(){residual(this);},
    onModifyAccuracyPriority:-1,onModifyAccuracy(value,target,user,move){return rules(this,'accuracy',context(this,user,target,move,value));},
    onAccuracy(value,target,user,move){return rules(this,'perfectAccuracy',context(this,user,target,move,value));},
    // invulMisses? (Battle_Move.rb:954) repeats the field aura conditions of the perfect-accuracy line; a base-accuracy result is not a bypass.
    onInvulnerabilityPriority:2,onInvulnerability(target,user,move){if(rules(this,'perfectAccuracy',context(this,user,target,move,undefined))===true)return 0;},
    // pbOnKillEffects: effects for the user of a move that knocked out a target.
    onAfterFaint(length,target,source,sourceEffect){if(source && source.hp>0 && sourceEffect?.effectType==='Move')rules(this,'afterFaint',context(this,source,target,sourceEffect,length));},
    onCriticalHit(target,source,move){if(rules(this,'criticalHit',context(this,this.activePokemon,target,move,true))===false)return false;},
    onModifyPriority(value,user,target,move){return rules(this,'priority',context(this,user,target,move,value));},
    onModifyCritRatio(value,user,target,move){return rules(this,'criticalRatio',context(this,user,target,move,value));},
    onModifyWeightPriority:-100,onModifyWeight(value,p){return rules(this,'weight',context(this,p,p,null,value));},
    onModifyDamage(value,user,target,move){if(move.rejuvenationPartialProtection && target.getMoveHitData(move).rejuvenationProtected){onceMessage(this,move.rejuvenationPartialProtection.message,target);this.chainModify(move.rejuvenationPartialProtection.fraction);}const x=context(this,user,target,move,value);const out=rules(this,'damage',x);return out===value?undefined:this.chainModify(out/value);},
    onDamagePriority:-29,onDamage(value,target,user,move){return rules(this,'receivedDamage',context(this,user,target,move,value));},
    onModifyAtk(value,user,target,move){const out=rules(this,'attack',context(this,user,target,move,value));if(out!==value)return this.chainModify(out/value);},
    onModifySpA(value,user,target,move){const out=rules(this,'specialAttack',context(this,user,target,move,value));if(out!==value)return this.chainModify(out/value);},
    onModifyDef(value,target,user,move){const out=rules(this,'defense',context(this,target,user,move,value));if(out!==value)return this.chainModify(out/value);},
    onModifySpD(value,target,user,move){const out=rules(this,'specialDefense',context(this,target,user,move,value));if(out!==value)return this.chainModify(out/value);},
    onModifySpe(value,p){const out=rules(this,'speed',context(this,p,p,null,value));if(out!==value)return this.chainModify(out/value);},
    // pbChangeStats (Battle_Effects.rb:1066-1068): every stage change that raises evasion or lowers evasion or accuracy
    // shrinks a progressive field by one stage; the caller never checks which field it is, so gardens shrink like concerts.
    onAfterEachBoost(boost,target){const s=state(this);if(!s)return;for(const [stat,amount]of Object.entries(boost))if(stat==='evasion' && amount || stat==='accuracy' && amount<0)s.stageShrink=(s.stageShrink || 0)+1;},
    onAfterBoost(boost,target){const s=state(this),steps=s?.stageShrink;if(!steps)return;s.stageShrink=0;const p=current(this)?.progression;if(p?.statChangeShrinkMessage && p.stage>1)progress(this,-steps,null,p.statChangeShrinkMessage);},
    onTryHealPriority:100,onTryHeal(value,target,user,sourceEffect){const modified=absorbedHealing(this,value,target,user,sourceEffect);if(modified===0)return 0;const result=rules(this,'tryHeal',context(this,user || target,target,sourceEffect,modified));return typeof result==='number'?Math.max(1,Math.floor(result)):result;},
    onSetStatus(status,target,user,sourceEffect){const x=context(this,user || target,target,sourceEffect,true);x.status=status;return rules(this,'setStatus',x);},
    onTryAddVolatile(status,target,user,sourceEffect){const x=context(this,user || target,target,sourceEffect,true);x.status=status;return rules(this,'tryVolatile',x);},
    onTryHit(target,user,move){
      const result=rules(this,'tryHit',context(this,user,target,move,true));if(result===false)return false;
      // Rejuvenation applies absorbing abilities to every attacking type. Call
      // only native type absorbers, not unrelated TryHit handlers twice.
      if(user!==target && !target.ignoringAbility() && !this.suppressingAbility(target) && (['sapsipper','stormdrain','lightningrod','motordrive','wellbakedbody','dryskin','waterabsorb','voltabsorb','eartheater','flashfire'].includes(target.ability) || state(this)?.catalog.abilities?.[target.ability]?.callbacks.onTryHit)){
        const ability=target.getAbility();for(const type of move.rejuvenationTypes || []){if(type===move.type)continue;const result=this.singleEvent('TryHit',ability,target.abilityState,target,user,{...move,type});if(result===null || result===false)return result;}
      }
      return result;
    },
    onChargeMovePriority:200,onChargeMove(user,target,move){return rules(this,'chargeMove',context(this,user,target,move,true));},
    onWeatherChange(p){rules(this,'weatherChange',context(this,p,p));},
    // Battle.rb:1260 pbCanShowCommands?: a listed volatile leaves its holder repeating one move with no command menu.
    // Battle.rb:1723-1747 pbCanSwitch?: field rules may trap a battler; Shed Shell still releases it afterwards.
    onTrapPokemon(p){rules(this,'trapPokemon',context(this,p,p.foes()[0] || p));},
    onLockMove(p){for(const [key,row]of Object.entries(current(this)?.volatileMoveLocks || {}))if(p.volatiles[key])return row.move;},
    // Runs between abilities (-1) and Quick Claw (-2), so a positive value here was granted by the ability.
    onFractionalPriorityPriority:-1.5,onFractionalPriority(priority,p,target,move){rules(this,'fractionalPriority',context(this,p,p,move,priority));},
    onSideConditionStart(target,source,status){rules(this,'sideConditionStart',{...context(this,source,source,this.activeMove || status),status});},
    onSetWeather(p,source,weather){if(rules(this,'setWeather',{...context(this,source || p,p),status:weather,value:true})===false)return null;},
    onEffectiveness(value,target,defType,move){const custom=chartOverride(this,move.type,defType,move,target);return (custom===undefined || custom==='immune'?value:custom)+(move.rejuvenationTypes || []).reduce((n,t)=>{const custom=chartOverride(this,t,defType,move,target);const policy=current(this)?.extraTypePolicies?.[t];if(policy?.mode==='firstWeaknessTwice')return n+(defType===target.getTypes()[0]?Math.max(0,this.dex.getEffectiveness(t,defType))*2:0);return n+(custom===undefined || custom==='immune'?this.dex.getEffectiveness(t,defType):custom);},0);},
  };
  function attach(b,field,options={}) {
    if(!catalog?.fields[field])throw new Error('Unknown initial field '+field);
    for(const [key,item]of Object.entries(catalog.items || {})){b.dex.data.Items[key]=item;b.dex.items.itemCache.delete(key);}
    // The installed dex caches only existing items, so every getItem() of a Pokemon without an item constructed
    // a new empty Item. The empty item is immutable data; it is cached frozen, as the dex caches existing ones.
    if(!b.dex.items.itemCache.get(''))b.dex.items.itemCache.set('',b.dex.deepFreeze(b.dex.items.getByID('')));
    if(typeof options.battleId==='string'){b.rejuvenationBattleId=options.battleId;battlesById.set(options.battleId,b);}
    b.rejuvenation={catalog,id:field,stack:[{id:field}],counters:[0,0,0,0,0],roll:0,overlay:null,duration:0,tempIndex:null,eruption:false,survival:new Set()};
    b.rejuvenation.actorTypes=structuredCloneValue(options.actorTypes || {});
    if(Object.entries(b.rejuvenation.actorTypes).some(([k,v])=>!/^p[1-4]$/.test(k) || !['wild','player','npc'].includes(v)))throw new Error('Invalid battle actor types');
    const policy=current(b).multiplierPolicy;
    b.rejuvenation.mode={difficultyMode:options.difficultyMode ?? policy?.defaultDifficultyMode ?? 0,fieldFrenzy:options.fieldFrenzy ?? policy?.defaultFieldFrenzy ?? false,online:options.online ?? false};
    if(![0,1,2].includes(b.rejuvenation.mode.difficultyMode) || typeof b.rejuvenation.mode.fieldFrenzy!=='boolean' || typeof b.rejuvenation.mode.online!=='boolean'){delete b.rejuvenation;throw new Error('Invalid per-battle field options');}
    b.dex.data.Conditions[effectId]=condition;b.dex.conditions.conditionCache.delete(effectId);
    b.dex.data.Conditions.rejuvenationblazed={name:'rejuvenationblazed',effectType:'Condition'};b.dex.conditions.conditionCache.delete('rejuvenationblazed');
    b.dex.data.Conditions.rejuvenationweight={name:'rejuvenationweight',effectType:'Condition',onModifyWeightPriority:3,onModifyWeight(value){return value+(this.effectState.delta || 0);}};b.dex.conditions.conditionCache.delete('rejuvenationweight');
    installSeedCallbacks(b);
    installGravityCallbacks(b);
    installTerrainCallbacks(b);
    installSuppressedCallbacks(b);
    installHealingCallbacks(b);
    installTrappingCallbacks(b);
    installAbsorptionCallbacks(b);
    installDurationCallbacks(b);
    installHazardCallbacks(b);
    installEntryWishes(b);
    installSilentVolatileEnds(b);
    installPriorityBlockers(b);
    installRampageCallbacks(b);
    installCustomVolatiles(b);
    installVolatilePolicies(b);
    installPersistentStatusCallbacks(b);
    installContactPolicies(b);
    installAbilityHandlers(b);
    installItemHandlers(b);
    installEnvironmentAbilities(b);
    installCriticalScreenCallbacks(b);
    installAbilityDamageCategories(b);
    installConditionHooks(b);
    installRecoilHook(b);
    if(Object.keys(declaredSoundTypes).length)installSoundAliases(b.dex);
    // Grassy Glide's canonical callback and our data rule otherwise both add
    // priority. Rejuvenation's rule also applies to airborne users.
    const glide=b.dex.moves.get('grassyglide');
    if(!glide.rejuvenationWrapped){const fn=glide.onModifyPriority;b.dex.moves.moveCache.set('grassyglide',Object.freeze({...glide,rejuvenationWrapped:true,onModifyPriority(...args){if(state(this))return;return fn?.apply(this,args);}}));}
    // Rejuvenation Upper Hand checks the queued move's effective priority (Battle_MoveEffects.rb:9925),
    // including Chess king/field additions. The native callback only reads the base move priority.
    const upper=b.dex.moves.get('upperhand');
    if(!upper.rejuvenationWrapped){const fn=upper.onTryHit;b.dex.moves.moveCache.set('upperhand',Object.freeze({...upper,rejuvenationWrapped:true,onTryHit(target,user,...args){
      const action=state(this)?this.queue.willMove(target):null;
      if(!action)return fn?.call(this,target,user,...args);
      const move=action.move;action.move={...move,priority:action.priority ?? move.priority};
      try{return fn?.call(this,target,user,...args);}finally{action.move=move;}
    }}));}
    const mimicry=b.dex.abilities.get('mimicry');
    if(!mimicry.rejuvenationWrapped){const wrapped={...mimicry,rejuvenationWrapped:true};for(const key of ['onStart','onTerrainChange']){const fn=mimicry[key];wrapped[key]=function(...args){if(state(this))return;return fn?.apply(this,args);};}b.dex.abilities.abilityCache.set('mimicry',Object.freeze(wrapped));}
    // An accuracy miss is announced by the -miss line; failures and blocked moves are not misses (Battler.rb:6963 user.missAcc).
    const add=b.add;b.add=function(...args){if(args[0]==='-miss' && state(this))state(this).accuracyMiss=args[1];if(args[0]==='-heal' && args[3]==='[from] drain' && state(this))state(this).drainHealed=args[1];const result=add.apply(this,args);if(args[0]==='-crit' && state(this))rules(this,'criticalMessage',context(this,this.activePokemon,args[1],this.activeMove));return result;};
    b.field.addPseudoWeather(effectId);
    assignPartyRoles(b);
    sync(b);
  }
  function statusPolicy(b,key){return (state(b)?.catalog || b.rejuvenationStatusCatalog || catalog)?.fields[indoor]?.persistentStatusPolicies?.[key];}
  function protectedStatusHealing(b,p,row){return active(b).some(mon=>mon.side===p.side && mon.hasAbility(row.sideProtectionAbility));}
  function healingBlocked(b,p,sourceEffect){
    const row=statusPolicy(b,p.status);if(!row?.blocksHealing)return false;
    return row.blockedHealingAbilities.includes(sourceEffect?.id) || !protectedStatusHealing(b,p,row);
  }
  function installPersistentStatusCallbacks(b){
    b.rejuvenationStatusCatalog ||= state(b)?.catalog || catalog;
    const synchronize=b.dex.abilities.get('synchronize');if(!synchronize.rejuvenationStatusGuard){const old=synchronize.onAfterSetStatus;
      b.dex.abilities.abilityCache.set('synchronize',Object.freeze({...synchronize,rejuvenationStatusGuard:true,onAfterSetStatus(status,...args){if(statusPolicy(this,status.id))return;return old.call(this,status,...args);}}));}
    for(const [key,row] of Object.entries(b.rejuvenationStatusCatalog?.fields[indoor]?.persistentStatusPolicies || {})){
      const previous=b.dex.conditions.get(key);if(previous.rejuvenationPersistentStatus)continue;
      b.dex.data.Conditions[key]={name:key,fullname:row.name,effectType:'Status',rejuvenationPersistentStatus:true,
        onStart(p,source,sourceEffect){const data=statusPolicy(this,key);
          // These four status-specific immunity checks do not consult Mold Breaker.
          if(p.hasType(data.immuneTypes) || (!p.ignoringAbility() && data.immuneAbilities.includes(p.ability)))return false;
          this.add('-status',p,key);this.runEvent('Update',p);return true;
        },
        onBeforeMove(p,target,move){const data=statusPolicy(this,key);if(data.blocksHealing && !protectedStatusHealing(this,p,data) && (move.heal || move.drain || move.flags?.heal)){
          message(this,data.healingFailureMessage,p,{name:move.name});return false;
        }},
        onTryHeal(value,p,source,sourceEffect){if(healingBlocked(this,p,sourceEffect))return false;},
        onResidualOrder:8.5,onResidual(){
          if(this.rejuvenationStatusResidualSequence===this.rejuvenationResidualSequence)return;
          this.rejuvenationStatusResidualSequence=this.rejuvenationResidualSequence;
          const priority=orderedActive(this);
          for(const p of priority){const data=statusPolicy(this,p.status);if(!data || !p.hp)continue;
            let lost=Math.floor(p.maxhp*data.fraction);
            if(!protectedStatusHealing(this,p,data))lost=this.directDamage(lost,p,null,this.dex.conditions.get(p.status));
            // The original loop stops completely when this victim faints.
            if(!p.hp)break;
            const inverted=priority.some(mon=>mon.hp>0 && mon.hasAbility(data.invertAbility));
            for(const receiver of priority){if(receiver===p || !receiver.hp || !receiver.hasAbility(data.drainAbility))continue;
              this.add('-ability',receiver,receiver.getAbility().name);
              if(inverted){this.directDamage(Math.floor(receiver.maxhp*data.fraction),receiver,null,this.dex.abilities.get(data.invertAbility));if(!receiver.hp)break;}
              else{message(this,data.drainMessage,p,receiver);this.heal(lost,receiver,p,'drain');}
            }
          }
        },
      };b.dex.conditions.conditionCache.delete(key);
    }
  }
  function installContactPolicies(b){
    for(const f of Object.values(state(b).catalog.fields))for(const key of Object.keys(f.abilityContactPolicies || {})){
      const ability=b.dex.abilities.get(key);if(ability.rejuvenationContactPolicy)continue;
      const old=ability.onDamagingHit;
      b.dex.abilities.abilityCache.set(key,Object.freeze({...ability,rejuvenationContactPolicy:true,onDamagingHit(damage,p,user,move){
        const row=current(this)?.abilityContactPolicies?.[key];if(!row)return old?.call(this,damage,p,user,move);
        if(row.disabled || !this.checkMoveMakesContact(move,user,p) || user.volatiles.perishsong || p.volatiles.perishsong)return;
        this.add('-ability',p,ability.name);message(this,row.message);
        for(const mon of [user,p]){mon.addVolatile('perishsong',p,ability);if(mon.volatiles.perishsong)mon.volatiles.perishsong.time=row.duration;}
        if(row.trapDefender){p.addVolatile('trapped',user,ability);message(this,'{1} can no longer escape!',p);}
        if(row.forceAttackerStatus){
          // Source pbPetrify is deliberately unconditional on this branch.
          user.status=row.forceAttackerStatus;user.statusState={id:row.forceAttackerStatus,target:user,source:p};
          this.add('-status',user,row.forceAttackerStatus);this.runEvent('Update',user);
        }
      }}));
    }
  }
  // Showdown passes (value, attacker, defender, move) to offensive modifier events and (value, defender, attacker, move) to defensive ones.
  const attackerFirstCallbacks=new Set(['onBasePower','onAllyBasePower','onAnyBasePower','onModifyAtk','onModifySpA','onAllyModifyAtk','onAllyModifySpA','onModifyDamage','onSourceModifyDamage','onModifyCritRatio','onAllyModifyCritRatio']);
  const defenderFirstCallbacks=new Set(['onModifyDef','onModifySpD','onAllyModifySpD','onModifyAccuracy','onSourceModifyAccuracy','onSourceAccuracy']);
  const chainedCallbacks=new Set(['onBasePower','onAllyBasePower','onAnyBasePower','onModifyAtk','onModifySpA','onAllyModifyAtk','onAllyModifySpA','onModifyDamage','onSourceModifyDamage','onModifyDef','onModifySpD','onAllyModifySpD','onModifyAccuracy','onSourceModifyAccuracy','onSourceAccuracy','onModifySpe']);
  function abilityCallback(key,callback,old,resolve,kind='abilities'){
    return function(...args){
      const row=resolve(this);if(!row)return old?.apply(this,args);
        let user=args[0],target=user,move;
        if(callback==='onImmunity'){user=target=args[1];}
        else
        if(callback==='onDamagingHit'){user=args[1];target=args[2];move=args[3];}
        else if(callback==='onSourceDamagingHit'){user=args[2];target=args[1];move=args[3];}
        else if(['onSourceTryPrimaryHit','onTryHit','onFoeTryMove'].includes(callback)){user=args[1];target=args[0];move=args[2];}
        else if(['onModifyMove','onModifyType'].includes(callback)){move=args[0];user=args[1];target=args[2];}
        else if(attackerFirstCallbacks.has(callback)){user=args[1];target=args[2];move=args[3];}
        else if(defenderFirstCallbacks.has(callback)){user=args[2];target=args[1];move=args[3];}
        else if(['onAfterEachBoost','onAllyTryBoost','onAllySetStatus','onAllyTryAddVolatile'].includes(callback)){user=callback==='onAfterEachBoost'?args[1]:this.effectState.target;target=callback==='onAfterEachBoost'?args[2]:args[1];move=args[3];}
        else if(['onAnyFaint','onAllySwitchIn'].includes(callback)){user=this.effectState.target;target=args[0];}
        else if(callback==='onModifySpe'){user=target=args[1];}
        else if(callback==='onDeductPP'){user=args[1];target=args[0];}
        else if(callback==='onSourceAfterFaint'){user=args[2];target=args[1];move=args[3];}
        else if(callback==='onAfterMoveSecondary'){user=args[0];target=args[1];move=args[2];}
        const x=context(this,user,target,move);x.sourceEffect=this.dex[kind].get(key);x.holder=this.effectState.target;if(callback==='onImmunity')x.immunityType=args[0];if(['onAfterEachBoost','onAllyTryBoost'].includes(callback)){x.boosts=args[0];x.source=args[2];}
        const chained=chainedCallbacks.has(callback);
        if(chained)x.value=1;else if(['onModifyCritRatio','onAllyModifyCritRatio'].includes(callback))x.value=args[0];
        if(callback.endsWith('BasePower'))x.basePower=args[0];
        if(['onAllySetStatus','onAllyTryAddVolatile'].includes(callback)){x.status=args[0];x.source=args[2];}
        if(!test(row.condition,x))return old?.apply(this,args);
        if(row.mode==='scaleBoosts'){
          // The native callback keeps its own trigger and stat choice; only the size of its stage changes follows the field.
          x.value=1;const factor=runActions(row.actions,x),boost=this.boost;
          this.boost=function(stages,...rest){return boost.call(this,Object.fromEntries(Object.entries(stages || {}).map(([k,n])=>[k,n*factor])),...rest);};
          try{return old?.apply(this,args);}finally{this.boost=boost;}
        }
        if(row.mode==='prepend')runActions(row.actions,x);
        const result=row.mode==='replace'?undefined:old?.apply(this,args);
        if(row.mode!=='prepend')runActions(row.actions,x);
        // Modifier events chain like native callbacks; a non-numeric result (perfect accuracy) is returned as-is.
        if(chained)return typeof x.value!=='number'?x.value:x.value===1?result:this.chainModify(x.value);
        return x.value===undefined?result:x.value;
    };
  }
  function installAbilityHandlers(b){
    const ids=new Set(Object.values(state(b).catalog.fields).flatMap(f=>Object.keys(f.abilityHandlers || {})));
    for(const key of ids){const original=b.dex.abilities.get(key);if(original.rejuvenationHandlersWrapped)continue;
      const next={...original,rejuvenationHandlersWrapped:true,rejuvenationOriginalAbility:original};
      const callbacks=new Set(Object.values(state(b).catalog.fields).flatMap(f=>Object.keys(f.abilityHandlers?.[key] || {})));
      for(const callback of callbacks)next[callback]=abilityCallback(key,callback,original[callback],b=>current(b)?.abilityHandlers?.[key]?.[callback]);
      b.dex.abilities.abilityCache.set(key,Object.freeze(next));
    }
  }
  function installItemHandlers(b){
    const ids=new Set(Object.values(state(b).catalog.fields).flatMap(f=>Object.keys(f.itemHandlers || {})));
    for(const key of ids){const original=b.dex.items.get(key);if(original.rejuvenationHandlersWrapped)continue;const next={...original,rejuvenationHandlersWrapped:true};
      const callbacks=new Set(Object.values(state(b).catalog.fields).flatMap(f=>Object.keys(f.itemHandlers?.[key] || {})));
      for(const callback of callbacks)next[callback]=abilityCallback(key,callback,original[callback],b=>current(b)?.itemHandlers?.[key]?.[callback],'items');
      b.dex.items.itemCache.set(key,Object.freeze(next));
    }
  }
  function withWeatherText(b,text,fn){
    if(!text)return fn();const old=b.add,previous=b.rejuvenationWeatherTextOverride;b.rejuvenationWeatherTextOverride=true;message(b,text);
    b.add=function(...args){if(args[0]==='-weather')args.push('[rejuvenationsilent]');return old.apply(this,args);};
    try{return fn();}finally{b.add=old;if(previous)b.rejuvenationWeatherTextOverride=previous;else delete b.rejuvenationWeatherTextOverride;}
  }
  function weatherDefinition(b,key){return current(b)?.weatherDefinitions?.[key] || (state(b)?.catalog || catalog)?.fields[indoor]?.weatherDefinitions?.[key];}
  // Declared types and weathers are patched into each simulator dex when that dex's data loads.
  // Reading `dex.data` on every registered mod would force all ~45 Showdown mods to load; in
  // Cobblemon's interpreter-only Graal runtime that alone took ~18 s on the first battle start.
  let declaredAssets=null,declaredSoundTypes={};
  const dexPrototype=Object.getPrototypeOf(RegistryDex);
  if(!dexPrototype.rejuvenationLoadWrapped){
    const nativeLoad=dexPrototype.loadData;
    dexPrototype.loadData=function(){if(this.dataCache)return this.dataCache;const data=nativeLoad.call(this);patchDexAssets(this);return data;};
    dexPrototype.rejuvenationLoadWrapped=true;
  }
  function installDeclaredFieldAssets(data){
    declaredAssets={data,revision:(declaredAssets?.revision || 0)+1};
    // Only already-loaded dexes are patched now; the rest are patched by the loadData wrapper.
    for(const dex of Object.values(RegistryDex.dexes))if(dex.dataCache)patchDexAssets(dex);
  }
  function patchDexAssets(dex){
    if(!declaredAssets || dex.rejuvenationAssetsRevision===declaredAssets.revision)return;
    dex.rejuvenationAssetsRevision=declaredAssets.revision;
    if(Object.keys(declaredSoundTypes).length)installSoundAliases(dex);
    const data=declaredAssets.data,defaultTypes=data.fields[indoor]?.typeDefinitions || {};
    {
      for(const [name,row]of Object.entries(defaultTypes)){
        const key=id(name);dex.data.TypeChart[key]={name,damageTaken:{...row.damageTaken}};dex.types.typeCache.delete(key);dex.types.allCache=null;
        for(const [target,n]of Object.entries(row.outgoing)){const k=id(target),old=dex.data.TypeChart[k];if(old){dex.data.TypeChart[k]={...old,damageTaken:{...old.damageTaken,[name]:n}};dex.types.typeCache.delete(k);}}
      }
      for(const [key,row]of Object.entries(data.fields[indoor]?.weatherDefinitions || {})){
        const condition={id:key,name:row.name,exists:true,effectType:'Weather',duration:row.duration,
          onFieldStart(){const r=weatherDefinition(this,key);if(this.rejuvenationWeatherTextOverride)this.add('-weather',r.name);else withWeatherText(this,r.startMessage,()=>this.add('-weather',r.name));},
          onFieldResidualOrder:1,onFieldResidual(){this.effectState.rejuvenationDamageMessage=false;if(this.field.isWeather(key))this.eachEvent('Weather');},
          onWeather(p){const r=weatherDefinition(this,key);if(!r || p.hasAbility(r.excludedAbilities) || p.hasItem(r.excludedItems) || r.excludedVolatiles.some(k=>p.volatiles[k]) || r.excludedFlags.some(k=>p.rejuvenationFlags?.[k]) || !p.runStatusImmunity(key))return;
            if(!this.effectState.rejuvenationDamageMessage){message(this,r.damageMessage);this.effectState.rejuvenationDamageMessage=true;}this.damage(Math.floor(p.maxhp*r.damageFraction),p,null,this.effect);},
          onFieldEnd(){const r=weatherDefinition(this,key);if(this.rejuvenationWeatherTextOverride)this.add('-weather','none');else withWeatherText(this,r.endMessage,()=>this.add('-weather','none'));}};
        dex.data.Conditions[key]=condition;dex.conditions.conditionCache.set(key,Object.freeze(condition));
      }
    }
  }
  const ownAbilityIds=new Set();
  function installDeclaredAbilities(data){
    for(const key of [...ownAbilityIds])if(!data.abilities?.[key]){Cobblemon.registries.ability.contents.delete(key);ownAbilityIds.delete(key);for(const dex of Object.values(RegistryDex.dexes)){dex.abilities.abilityCache.delete(key);dex.abilities.allCache=null;}}
    for(const [key,row]of Object.entries(data.abilities || {})){
      const existing=Cobblemon.registries.ability.get(key) || RegistryDex.abilities.get(key);
      if(existing.exists && !ownAbilityIds.has(key))throw new Error('Ability definition conflicts with installed ability '+key);
      const inherited=row.inherit?RegistryDex.mod('cobblemon').abilities.get(row.inherit):{};
      const native=inherited.rejuvenationOriginalAbility || inherited;
      const next={...native,...row,id:key,exists:true,gen:9,isNonstandard:'Custom',rejuvenationHandlersWrapped:true};
      delete next.callbacks;delete next.inherit;delete next.soundMoveTypes;delete next.airborne;delete next.airborneBeforeGravity;
      const callbacks=new Set([...Object.keys(row.callbacks),...Object.values(data.fields).flatMap(f=>Object.keys(f.abilityHandlers?.[key] || {}))]);
      for(const callback of callbacks)next[callback]=abilityCallback(key,callback,native[callback],b=>current(b)?.abilityHandlers?.[key]?.[callback] || (state(b)?.catalog || catalog)?.abilities?.[key]?.callbacks?.[callback]);
      // This Cobblemon registry derives IDs from name and ignores its _id parameter.
      // Construct with the canonical source ID, then restore the display name.
      const registered=Cobblemon.registries.ability.register({...next,name:key,fullname:'ability: '+row.name},key);
      registered.name=row.name;registered.id=key;ownAbilityIds.add(key);
      for(const dex of Object.values(RegistryDex.dexes)){dex.abilities.abilityCache.delete(key);dex.abilities.allCache=null;}
    }
    declaredSoundTypes=Object.fromEntries(Object.entries(data.abilities || {}).filter(([,row])=>row.soundMoveTypes).map(([key,row])=>[key,[...row.soundMoveTypes]]));
    // Unloaded dexes receive the aliases from the loadData wrapper (patchDexAssets) when they load.
    if(Object.keys(declaredSoundTypes).length)for(const dex of Object.values(RegistryDex.dexes))if(dex.dataCache)installSoundAliases(dex);
  }
  // Source checkSoundMove? also gates Throat Chop (Battle.rb:1351, Battler.rb:5801).
  // Showdown checks that volatile before ModifyMove can add the sound flag.
  function declaredSound(p,move){const list=!p.ignoringAbility() && declaredSoundTypes[p.ability];return !!list && !!move && move.category!==undefined && list.includes(move.type);}
  function installSoundAliases(dex){
    const c=dex.conditions.get('throatchop');if(!c.exists || c.rejuvenationSoundAliases)return;
    const disable=c.onDisableMove,before=c.onBeforeMove;
    dex.conditions.conditionCache.set('throatchop',Object.freeze({...c,rejuvenationSoundAliases:true,
      onDisableMove(p){disable?.call(this,p);for(const slot of p.moveSlots)if(declaredSound(p,this.dex.moves.get(slot.id)))p.disableMove(slot.id);},
      onBeforeMove(p,target,move){if(!move.isZOrMaxPowered && declaredSound(p,move)){this.add('cant',p,'move: Throat Chop');return false;}return before?.call(this,p,target,move);}}));
  }
  // Battle_Move.rb:1144-1145 replaces the 85-100 percent variance with one fixed percentage on some fields.
  // Chloroblast's recoil is hard-coded by move id in the simulator; a field rule may replace its share of maximum HP.
  function installRecoilHook(b){
    const proto=Object.getPrototypeOf(b.actions);if(proto.rejuvenationRecoilWrapped)return;const old=proto.calcRecoilDamage;
    proto.calcRecoilDamage=function(damageDealt,move,pokemon){return move.maxHPRecoil?Math.round(pokemon.maxhp*move.maxHPRecoil):old.call(this,damageDealt,move,pokemon);};
    proto.rejuvenationRecoilWrapped=true;
  }
  const oldRandomizer=Battle.prototype.randomizer;
  Battle.prototype.randomizer=function(baseDamage){const roll=current(this)?.damageRoll;if(roll===undefined)return oldRandomizer.call(this,baseDamage);return this.trunc(this.trunc(baseDamage*roll)/100);};
  // Field hooks on native volatile conditions: flinching, Snatch and the protection family.
  function installConditionHooks(b){
    const flinch=b.dex.conditions.get('flinch');
    if(!flinch.rejuvenationWrapped){const before=flinch.onBeforeMove;
      b.dex.conditions.conditionCache.set('flinch',Object.freeze({...flinch,rejuvenationWrapped:true,onBeforeMove(p,...args){
        if(state(this) && rules(this,'tryFlinch',context(this,p,p,null,true))===false){p.removeVolatile('flinch');return;}
        const result=before.call(this,p,...args);if(state(this))rules(this,'flinch',context(this,p,p));return result;}}));}
    const snatch=b.dex.conditions.get('snatch');
    if(!snatch.rejuvenationWrapped){const prepare=snatch.onAnyPrepareHit;
      b.dex.conditions.conditionCache.set('snatch',Object.freeze({...snatch,rejuvenationWrapped:true,onAnyPrepareHit(source,target,move){
        if(!state(this))return prepare.call(this,source,target,move);
        const battle=this,holder=this.effectState.source,use=this.actions.useMove;
        this.actions.useMove=function(...args){rules(battle,'snatch',context(battle,holder,source,move));return use.apply(this,args);};
        try{return prepare.call(this,source,target,move);}finally{this.actions.useMove=use;}}}));}
    const keys=new Set(['protect','kingsshield','obstruct','spikyshield','banefulbunker','silktrap','burningbulwark','matblock','wideguard','quickguard',...Object.values(state(b).catalog.fields).flatMap(f=>Object.keys(f.protectionPolicy || {}))]);
    for(const key of keys){const c=b.dex.conditions.get(key);if(!c.exists || c.rejuvenationProtectionWrapped || !c.onTryHit)continue;const tryHit=c.onTryHit;
      b.dex.conditions.conditionCache.set(key,Object.freeze({...c,rejuvenationProtectionWrapped:true,onTryHit(target,source,move){
        const partial=state(this) && move.rejuvenationPartialProtection;
        if(partial?.conditions.includes(key) && move.category!=='Status' && (key!=='wideguard' || ['allAdjacent','allAdjacentFoes'].includes(move.target)) && (key!=='quickguard' || move.priority>0)){
          target.getMoveHitData(move).rejuvenationProtected=true;return;
        }
        const row=current(this)?.protectionPolicy?.[key];if(!row)return tryHit.call(this,target,source,move);
        // Source protection ignores the status exception of these shields on the listed fields (Battler.rb:5301-5309).
        if(row.blockStatus && move.category==='Status' && move.flags.protect && !move.isZ && !move.isMax){this.add('-activate',target,'move: Protect');const locked=source.getVolatile('lockedmove');if(locked && source.volatiles.lockedmove.duration===2)delete source.volatiles.lockedmove;return this.NOT_FAIL;}
        const boost=this.boost,damage=this.damage;
        if(row.contactBoosts)this.boost=function(stages,...rest){return boost.call(this,row.contactBoosts,...rest);};
        if(row.contactFraction)this.damage=function(amount,victim,...rest){return damage.call(this,Math.floor(victim.baseMaxhp*row.contactFraction),victim,...rest);};
        try{return tryHit.call(this,target,source,move);}finally{this.boost=boost;this.damage=damage;}}}));}
  }
  const oldResidualEvent=Battle.prototype.residualEvent;
  Battle.prototype.residualEvent=function(...args){if(args[0]==='Residual'){const seen=new Set();for(const p of orderedActive(this)){if(p.ignoringAbility() || seen.has(p.ability))continue;const a=p.getAbility();if(a.onBeforeResidual){seen.add(p.ability);this.singleEvent('BeforeResidual',a,p.abilityState,p);}}}this.rejuvenationResidualSequence=(this.rejuvenationResidualSequence || 0)+1;return oldResidualEvent.apply(this,args);};
  const oldPokemonHeal=Pokemon.prototype.heal;
  Pokemon.prototype.heal=function(value,source,sourceEffect){if(healingBlocked(this.battle,this,sourceEffect))return false;return oldPokemonHeal.call(this,value,source,sourceEffect);};
  function installGravityCallbacks(b){
    const smack=b.dex.conditions.get('smackdown');if(!smack.rejuvenationGroundingWrapped){const start=smack.onStart;b.dex.conditions.conditionCache.set('smackdown',Object.freeze({...smack,rejuvenationGroundingWrapped:true,onStart(p){const result=start.call(this,p);if(result!==false)return result;if(state(this)?.catalog.abilities?.[p.ability]?.airborne || current(this)?.grounding?.airborneAbilities.includes(p.ability)){this.add('-start',p,'Smack Down');return;}return false;}}));}
    const c=b.dex.conditions.get('gravity');if(c.rejuvenationWrapped)return;
    const wrapped={...c,rejuvenationWrapped:true};
    for(const key of ['onBeforeMove','onModifyMove']){const fn=c[key];wrapped[key]=function(...args){const move=key==='onModifyMove'?args[0]:args[2];if(current(this)?.gravityUsableMoves?.includes(move?.id))return;return fn?.apply(this,args);};}
    b.dex.conditions.conditionCache.set('gravity',Object.freeze(wrapped));
  }
  function installDurationCallbacks(b){
    for(const f of Object.values(state(b).catalog.fields))for(const key of Object.keys(f.conditionDurations || {})){
      const c=b.dex.conditions.get(key);if(c.rejuvenationDurationWrapped)continue;const fn=c.durationCallback;
      b.dex.conditions.conditionCache.set(key,Object.freeze({...c,rejuvenationDurationWrapped:true,durationCallback(p,source,sourceEffect){
        const duration=fn?fn.call(this,p,source,sourceEffect):c.duration;
        const row=current(this)?.conditionDurations?.[key];
        if(!row || ![...row.sourceMoves,...(row.sourceAbilities || [])].includes(sourceEffect?.id))return duration;
        const pending=state(this)?.clockOverride;
        if(pending?.key===key)return pending.value;
        return clockDuration(this,row,p,source,sourceEffect,duration);
      }}));
    }
  }
  // Battle.rb:3175-3268. A field policy replaces a native entry hazard only where the source differs from it.
  function installHazardCallbacks(b){
    for(const key of ['spikes','stealthrock','stickyweb','toxicspikes']){
      const c=b.dex.conditions.get(key);if(c.rejuvenationHazardWrapped)continue;const native=c.onEntryHazard;
      b.dex.conditions.conditionCache.set(key,Object.freeze({...c,rejuvenationHazardWrapped:true,onEntryHazard(p){
        const policy=current(this)?.hazardPolicy;if(!policy)return native.call(this,p);
        if(policy.cleared?.includes(key)){p.side.removeSideCondition(key);return;}
        if(policy.suspended)return;
        const row=policy[key];if(!row)return native.call(this,p);
        const boots=p.hasItem('heavydutyboots'),typed=type=>this.dex.getImmunity(type,p)?Math.pow(2,this.dex.getEffectiveness(type,p)):0;
        const hurt=amount=>{if(!row.message)this.damage(amount,p);else if(this.damage(amount,p,null,effect))message(this,row.message,p);};
        if(key==='spikes'){
          if(boots || (!row.affectsAirborne && airborne(p)))return;
          const factor=row.type?typed(row.type):1;if(factor)hurt(Math.floor(p.maxhp/[8,8,6,4][this.effectState.layers]*factor));
        }else if(key==='stealthrock'){
          if(boots)return;const s=state(this);let type=row.type || 'Rock';
          if(row.cycleTypes){type=row.cycleTypes[s.roll%row.cycleTypes.length];s.roll=(s.roll+1)%row.cycleTypes.length;}
          const factor=typed(type)*(row.multiplier || 1);if(factor)hurt(Math.floor(p.maxhp/8*factor));
        }else if(key==='stickyweb'){
          if(boots || airborne(p))return;this.add('-activate',p,'move: Sticky Web');this.boost({spe:row.stages},p,p.side.foe.active[0],this.dex.getActiveMove('stickyweb'));
        }else if(!(row.keepOnPoisonType && p.hasType('Poison')))return native.call(this,p);
      }}));
    }
  }
  // Battle.rb:8002-8031: on the listed fields the wish is granted to a healthy replacement too and raises its stats.
  function installEntryWishes(b){
    const ids=new Set(Object.values(state(b).catalog.fields).flatMap(f=>Object.keys(f.entryWishes || {})));
    for(const key of ids){const c=b.dex.conditions.get(key);if(c.rejuvenationWishWrapped)continue;
      b.dex.conditions.conditionCache.set(key,Object.freeze({...c,rejuvenationWishWrapped:true,onSwap(target){
        const row=current(this)?.entryWishes?.[key];if(!row || target.fainted)return c.onSwap.call(this,target);
        c.onSwap.call(this,target);
        if(target.side.getSlotCondition(target,key)){target.side.removeSlotCondition(target,key);message(this,row.message,target);}
        this.boost(row.boosts,target,target,effect);
      }}));
    }
  }
  function installSilentVolatileEnds(b){
    const ids=new Set(Object.values(state(b).catalog.fields).flatMap(f=>f.silentVolatileEnds || []));
    for(const key of ids){const c=b.dex.conditions.get(key);if(c.rejuvenationSilentEndWrapped)continue;
      b.dex.conditions.conditionCache.set(key,Object.freeze({...c,rejuvenationSilentEndWrapped:true,onEnd(...args){if(current(this)?.silentVolatileEnds?.includes(key))return;return c.onEnd?.apply(this,args);}}));
    }
  }
  // Battle.rb:6920-6961: a field may stop the listed room clocks. The decrement of the coming round is granted in advance.
  function pausedClockShift(b,from,to){
    const old=from?.clockPolicy?.pausedConditions || [],next=to?.clockPolicy?.pausedConditions || [];
    for(const key of old)if(!next.includes(key)){const row=b.field.pseudoWeather[key];if(row?.rejuvenationAdvance){row.duration=Math.max(1,row.duration-1);delete row.rejuvenationAdvance;}}
    for(const key of next){const row=b.field.pseudoWeather[key];if(row?.duration && !row.rejuvenationAdvance){row.duration++;row.rejuvenationAdvance=true;}}
  }
  function holdPausedClocks(b){
    for(const key of current(b)?.clockPolicy?.pausedConditions || []){const row=b.field.pseudoWeather[key];if(!row?.duration)continue;row.duration+=row.rejuvenationAdvance?1:2;row.rejuvenationAdvance=true;}
  }
  // Battle.rb:882-884 priorityBlockingAbilities: a field may lend the Dazzling family's block to further abilities.
  function installPriorityBlockers(b){
    const ids=new Set(Object.values(state(b).catalog.fields).flatMap(f=>f.priorityBlockingAbilities || []));
    for(const key of ids){const original=b.dex.abilities.get(key);if(original.rejuvenationPriorityWrapped)continue;const old=original.onFoeTryMove;
      b.dex.abilities.abilityCache.set(key,Object.freeze({...original,rejuvenationPriorityWrapped:true,onFoeTryMove(target,source,move){
        if(!current(this)?.priorityBlockingAbilities?.includes(key))return old?.call(this,target,source,move);
        if(move.target==='foeSide' || (move.target==='all' && !['perishsong','flowershield','rototiller'].includes(move.id)))return;
        const holder=this.effectState.target;
        if((source.isAlly(holder) || move.target==='all') && move.priority>0.1){this.attrLastMove('[still]');this.add('cant',holder,'ability: '+original.name,move,'[of] '+target);return false;}
      }}));
    }
  }
  function clockDuration(b,row,p,source,sourceEffect,duration){
    for(const choice of row.choices || [])if(test(choice.condition,context(b,source,p,sourceEffect))){
      return choice.randomRange?b.random(choice.randomRange.minimum,choice.randomRange.maximum+1):choice.duration;
    }
    return row.duration ?? duration+row.add;
  }
  function installRampageCallbacks(b){
    const original=b.dex.conditions.get('lockedmove');if(original.rejuvenationRampageWrapped)return;
    b.dex.conditions.conditionCache.set('lockedmove',Object.freeze({...original,rejuvenationRampageWrapped:true,
      onStart(p,source,move){const result=original.onStart.call(this,p,source,move);const row=current(this)?.rampagePolicy;if(row?.duration){this.effectState.trueDuration=row.duration;this.effectState.duration=row.duration;}return result;},
      onEnd(p){const row=current(this)?.rampagePolicy;if(row?.noConfusionMoves?.includes(this.effectState.move))return;return original.onEnd.call(this,p);}
    }));
  }
  function installCustomVolatiles(b){
    for(const f of Object.values(state(b).catalog.fields))for(const [key,row]of Object.entries(f.customVolatiles || {})){
      b.dex.data.Conditions[key]={name:key,noCopy:true,onResidualOrder:28.1,onResidual(p){const config=current(this)?.customVolatiles?.[key];if(config)runActions(config.actions,context(this,this.effectState.source,p));}};
      b.dex.conditions.conditionCache.delete(key);
    }
  }
  function installVolatilePolicies(b){
    for(const f of Object.values(state(b).catalog.fields))for(const key of Object.keys(f.volatilePolicies || {})){
      const c=b.dex.conditions.get(key);if(c.rejuvenationPolicyWrapped)continue;
      const wrapped={...c,rejuvenationPolicyWrapped:true};
      wrapped.onStart=function(p,...args){
        const row=current(this)?.volatilePolicies?.[key];
        if(row?.allowAwake){this.add('-start',p,c.name);return;}
        return c.onStart?.call(this,p,...args);
      };
      wrapped.onResidual=function(p,...args){
        const row=current(this)?.volatilePolicies?.[key];if(!row)return c.onResidual?.call(this,p,...args);
        if(row.suppressResidual)return;
        if(!row.allowAwake && p.status!=='slp' && !p.hasAbility('comatose')){p.removeVolatile(key);return;}
        if(p.hasAbility('magicguard') || (current(this)?.indirectImmunityAbilities?.includes(p.ability)))return;
        this.damage(Math.floor(p.maxhp*row.fraction),p,null,this.dex.conditions.get(key));message(this,row.message,p);
      };
      b.dex.conditions.conditionCache.set(key,Object.freeze(wrapped));
    }
  }
  function installAbsorptionCallbacks(b){
    for(const f of Object.values(state(b).catalog.fields)){
      for(const aid of Object.keys(f.abilityAbsorptions || {})){
        const a=b.dex.abilities.get(aid);if(a.rejuvenationAbsorptionWrapped)continue;const old=a.onTryHit;
        b.dex.abilities.abilityCache.set(aid,Object.freeze({...a,rejuvenationAbsorptionWrapped:true,onTryHit(p,source,move){
          const row=current(this)?.abilityAbsorptions?.[aid];if(!row || p===source || move.type!==row.type)return old?.call(this,p,source,move);
          const values=row.boosts || row.healFractions,s=state(this);
          let index=row.cycle?s.roll%values.length:0;
          if(row.maximizeOverlay===s.overlay?.id)index=values.indexOf(Math.max(...values));
          if(row.cycle)s.roll=(s.roll+1)%values.length;
          const changed=row.boosts?values[index]>0 && this.boost({[row.stat]:values[index]},p,p,a):this.heal(Math.floor(p.maxhp*values[index]),p,p,a);
          if(!changed)this.add('-immune',p,'[from] ability: '+a.name);
          return null;
        }}));
      }
      for(const aid of f.indirectImmunityAbilities || []){
        const a=b.dex.abilities.get(aid);if(a.rejuvenationIndirectWrapped)continue;const old=a.onDamage;
        b.dex.abilities.abilityCache.set(aid,Object.freeze({...a,rejuvenationIndirectWrapped:true,onDamage(value,p,source,damageEffect){
          if(current(this)?.indirectImmunityAbilities?.includes(aid) && damageEffect?.effectType!=='Move')return false;
          return old?.call(this,value,p,source,damageEffect);
        }}));
      }
    }
  }
  function installTrappingCallbacks(b){
    const trap=b.dex.conditions.get('partiallytrapped');
    if(!trap.rejuvenationWrapped){const oldStart=trap.onStart,oldResidual=trap.onResidual;
      b.dex.conditions.conditionCache.set('partiallytrapped',Object.freeze({...trap,rejuvenationWrapped:true,
        onStart(p,source){const result=oldStart.call(this,p,source);if(current(this)?.trapping)this.effectState.rejuvenationBand=!!source?.hasItem('bindingband');return result;},
        onResidual(p){const config=current(this)?.trapping;if(!config)return oldResidual.call(this,p);
          const source=this.effectState.source,mid=this.effectState.sourceEffect.id;
          if(source && (!source.isActive || source.hp<=0) && !['gmaxcentiferno','gmaxsandblast'].includes(mid)){p.removeVolatile('partiallytrapped');return;}
          if(p.hasAbility(config.immuneAbilities))return;
          const index=(this.effectState.rejuvenationBand?1:0)+(config.moveIncrements[mid] || 0);
          this.damage(Math.floor(p.maxhp/config.divisors[index]),p,source,this.effectState.sourceEffect);
          if(p.hp>0 && config.statLoss[mid])this.boost({[this.sample(config.statLoss[mid])]:-1},p,null,effect);
        }}));
    }
    const lock=b.dex.conditions.get('octolock');
    if(!lock.rejuvenationWrapped){const old=lock.onResidual;
      b.dex.conditions.conditionCache.set('octolock',Object.freeze({...lock,rejuvenationWrapped:true,onResidual(p){
        const amount=current(this)?.trapping?.octolockAmount;if(amount===undefined)return old.call(this,p);
        const source=this.effectState.source;if(!source?.isActive){p.removeVolatile('octolock');return;}
        this.boost({def:amount,spd:amount},p,source,this.dex.getActiveMove('octolock'));
      }}));
    }
  }
  // Select a fully modified stat from a declarative pool at the damage boundary.
  // The native calculator still owns critical rolls, damage rounding, screens,
  // type modifiers and all later effects. Pure stat queries use the native path.
  function criticalPolicy(b,user,target,move){const policy=current(b)?.criticalPolicy;return policy && test(policy.condition,context(b,user,target,move))?policy:null;}
  function installCriticalScreenCallbacks(b){
    for(const key of ['reflect','lightscreen','auroraveil']){
      const original=b.dex.conditions.get(key);if(original.rejuvenationCriticalScreen)continue;
      const old=original.onAnyModifyDamage;
      b.dex.conditions.conditionCache.set(key,Object.freeze({...original,rejuvenationCriticalScreen:true,onAnyModifyDamage(damage,user,target,move){
        const hit=target.getMoveHitData(move),policy=criticalPolicy(this,user,target,move),wasCrit=hit.crit;
        if(wasCrit && policy?.applyScreens)hit.crit=false;
        try{return old?.call(this,damage,user,target,move);}finally{hit.crit=wasCrit;}
      }}));
    }
  }
  const oldModifyDamage=BattleActions.prototype.modifyDamage;
  BattleActions.prototype.modifyDamage=function(damage,user,target,move,...args){
    const policy=criticalPolicy(this.battle,user,target,move);
    if(!policy || !target.getMoveHitData(move).crit)return oldModifyDamage.call(this,damage,user,target,move,...args);
    const previous=move.critModifier,add=this.battle.add;
    move.critModifier=policy.modifier;
    if(policy.hideMessage)this.battle.add=function(...args){if(args[0]==='-crit' && args[1]===target)return this;return add.apply(this,args);};
    try{return oldModifyDamage.call(this,damage,user,target,move,...args);}finally{
      if(previous===undefined)delete move.critModifier;else move.critModifier=previous;
      this.battle.add=add;
    }
  };
  const oldGetDamage=BattleActions.prototype.getDamage;
  BattleActions.prototype.getDamage=function(user,target,move,...args){
    if(!current(this.battle)?.statPools)return oldGetDamage.call(this,user,target,move,...args);
    const m=typeof move==='string'?this.dex.getActiveMove(move):move;
    if(!m || typeof m!=='object' || m.category!=='Special' && m.overrideDefensiveStat!=='spd')return oldGetDamage.call(this,user,target,move,...args);
    const previous=this.battle.rejuvenationStatQuery;
    this.battle.rejuvenationStatQuery={user,target,move:m};
    try{return oldGetDamage.call(this,user,target,m,...args);}finally{this.battle.rejuvenationStatQuery=previous;}
  };
  const oldRunEvent=Battle.prototype.runEvent;
  Battle.prototype.runEvent=function(event,p,other,move,value,...args){
    if(event==='ModifyMove' && state(this)){const result=oldRunEvent.call(this,event,p,other,move,value,...args);if(result && typeof result==='object')rules(this,'modifyMoveLate',context(this,p,other,result,result));return result;}
    if(event==='SetWeather' && this.rejuvenationForceWeather)return true;
    if(event==='ModifyAccuracy' && value!==true && state(this)){
      value=rules(this,'baseAccuracy',context(this,other,p,move,value));
      // These values encode source early returns before stages and accuracy multipliers.
      if(value===true || value===0)return value;
    }
    const q=this.rejuvenationStatQuery,config=current(this)?.statPools;
    const offensive=q && event==='ModifySpA' && p===q.user;
    const defensive=q && event==='ModifySpD' && p===q.target && (!q.move.overrideDefensiveStat || q.move.overrideDefensiveStat==='spd');
    if(!config || (!offensive && !defensive))return oldRunEvent.call(this,event,p,other,move,value,...args);
    const crit=q.target.getMoveHitData(q.move).crit;
    const unaware=other?.hasAbility('unaware') && !this.suppressingAbility(other);
    const borrowed=offensive && config.borrowedOffense?.[q.move.id];
    if(borrowed){
      const stats=config.offensiveSpecial;
      // Source Foul Play borrows the target's staged raw Special stat, while
      // selecting the user's modifier branch by modifiers alone (onlyModifiers).
      let stat=stats[0];for(const candidate of stats.slice(1))if(q.target.calculateStat(candidate,q.target.boosts[candidate],1,q.target)>q.target.calculateStat(stat,q.target.boosts[stat],1,q.target))stat=candidate;
      let stage=q.target.boosts[stat];if(unaware || q.move.ignoreOffensive || ((crit || q.move.ignoreNegativeOffensive) && stage<0))stage=0;
      const raw=q.target.calculateStat(stat,stage,1,q.target);
      let modifier=stats[0],best=-Infinity;
      for(const candidate of stats){const score=oldRunEvent.call(this,candidate==='spa'?'ModifySpA':'ModifySpD',q.user,q.target,move,1000,...args);if(score>best){best=score;modifier=candidate;}}
      return oldRunEvent.call(this,modifier==='spa'?'ModifySpA':'ModifySpD',q.user,q.target,move,raw,...args);
    }
    let best=-Infinity;
    for(const stat of config[offensive?'offensiveSpecial':'defensiveSpecial']){
      let stage=p.boosts[stat];
      if(unaware || (offensive?q.move.ignoreOffensive:q.move.ignoreDefensive) || (offensive?(crit || q.move.ignoreNegativeOffensive) && stage<0:(crit || q.move.ignorePositiveDefensive) && stage>0))stage=0;
      const raw=p.calculateStat(stat,stage,1,p);
      const result=oldRunEvent.call(this,stat==='spa'?'ModifySpA':'ModifySpD',p,other,move,raw,...args);
      best=Math.max(best,result);
    }
    return best;
  };
  function preserveFormType(p){
    p.rejuvenationFormType=true;
    const species=p.baseSpecies;if(species.rejuvenationFieldTypeWrapped)return;
    const old=species.onType;
    p.baseSpecies=Object.assign(Object.create(Object.getPrototypeOf(species)),species,{rejuvenationFieldTypeWrapped:true,onType(types,p){
      if(p.rejuvenationFormType && !p.transformed && current(this)?.nativeFormTyping?.includes(id(species.baseSpecies)))return types;
      return old?old.call(this,types,p):types;
    }});
  }
  const oldDisableMove=Pokemon.prototype.disableMove;
  const oldFormeChange=Pokemon.prototype.formeChange;
  Pokemon.prototype.formeChange=function(...args){
    const before=this.species.id,result=oldFormeChange.apply(this,args);
    if(result && before!==this.species.id && state(this.battle))rules(this.battle,'formChange',context(this.battle,this,this,this.battle.activeMove));
    return result;
  };
  const oldRemoveVolatile=Pokemon.prototype.removeVolatile;
  const oldSetStatus=Pokemon.prototype.setStatus;
  const oldStatusImmunity=Pokemon.prototype.runStatusImmunity;
  const oldHasAbility=Pokemon.prototype.hasAbility;
  Pokemon.prototype.hasAbility=function(abilities){const disabled=current(this.battle)?.inactiveAbilities || [];if(Array.isArray(abilities))abilities=abilities.filter(a=>!disabled.includes(id(a)));else if(disabled.includes(id(abilities)))return false;return oldHasAbility.call(this,abilities);};
  Pokemon.prototype.setStatus=function(status,source,...args){const previous=this.rejuvenationStatusSource;this.rejuvenationStatusSource=source;try{return oldSetStatus.call(this,status,source,...args);}finally{if(previous)this.rejuvenationStatusSource=previous;else delete this.rejuvenationStatusSource;}};
  Pokemon.prototype.runStatusImmunity=function(status,...args){const x=context(this.battle,this.rejuvenationStatusSource,this,null);for(const row of current(this.battle)?.statusTypeBypass || [])if(row.status===status && test(row.condition,x))return !!this.battle.runEvent('Immunity',this,null,null,status);return oldStatusImmunity.call(this,status,...args);};
  Pokemon.prototype.removeVolatile=function(key,...args){
    // Native wake-up removes Nightmare unconditionally. Rejuvenation keeps it
    // on an awake Infernal battler and while Rainbow suppresses its ticking.
    const row=current(this.battle)?.volatilePolicies?.[id(key)];
    if(this.status==='slp' && row && (row.allowAwake || row.suppressResidual))return false;
    return oldRemoveVolatile.call(this,key,...args);
  };
  Pokemon.prototype.disableMove=function(mid,...args){if(this.battle.effect?.id==='gravity' && current(this.battle)?.gravityUsableMoves?.includes(id(mid)))return;return oldDisableMove.call(this,mid,...args);};
  function installSeedCallbacks(b){
    for(const key of ['focusenergy','dragoncheer','shelltrap']){
      const c=b.dex.conditions.get(key);if(c.rejuvenationSeedWrapped)continue;
      const wrapped={...c,rejuvenationSeedWrapped:true};
      if(key==='shelltrap'){
        const oldHit=c.onHit,oldEnd=c.onEnd;
        wrapped.onHit=function(p,source,move){if(state(this) && this.effectState.rejuvenationSeed){if(!p.isAlly(source) && move.category==='Physical')this.effectState.gotHit=true;return;}return oldHit?.call(this,p,source,move);};
        wrapped.onEnd=function(p){if(state(this) && this.effectState.rejuvenationSeed && !this.effectState.gotHit)message(this,"{1}'s shell trap didn't work!",p);return oldEnd?.call(this,p);};
      }else{const fn=c.onModifyCritRatio;wrapped.onModifyCritRatio=function(value,...args){return this.effectState.rejuvenationCritStage!==undefined?value+this.effectState.rejuvenationCritStage:fn?.call(this,value,...args);};}
      b.dex.conditions.conditionCache.set(key,Object.freeze(wrapped));
    }
  }
  const oldRunAction=Battle.prototype.runAction;
  const oldResolveAction=BattleQueue.prototype.resolveAction;
  BattleQueue.prototype.resolveAction=function(action,midTurn=false){const result=oldResolveAction.call(this,action,midTurn);if(!midTurn && current(this.battle)?.switchTiming==='action')for(const row of result)if(row.choice==='switch'){row.order=200;row.priority=0;row.fractionalPriority=0;}return result;};
  Battle.prototype.runAction=function(action){
    const result=oldRunAction.call(this,action);
    if(state(this) && action.choice==='move' && !this.rejuvenationShellResolving){
      this.rejuvenationShellResolving=true;
      try{for(const p of active(this)){const v=p.volatiles.shelltrap;if(v?.rejuvenationSeed && v.gotHit){v.rejuvenationSeed=false;this.actions.useMove('shelltrap',p);p.removeVolatile('shelltrap');}}}finally{this.rejuvenationShellResolving=false;}
    }
    return result;
  };
  function absorbedHealing(b,value,target,source,sourceEffect){
    const config=current(b)?.healing;if(!config)return value;const agent=sourceEffect?.id;
    const absorbed=['drain','leechseed','ingrain','aquaring','strengthsap'].includes(agent);
    const harmful=config.harmfulAgents[agent];
    if(harmful && !target.hasType(['Poison','Steel'])){if(!harmful.respectMagicGuard || !target.hasAbility('magicguard')){b.directDamage(value,target,target,effect);message(b,harmful.message,target);}return 0;}
    if(absorbed && target.hasItem('bigroot'))value=Math.round(value*config.rootFactor);
    const overlay=state(b).overlay && state(b).catalog.fields[state(b).overlay.id]?.healing;
    let factor=config.agentMultipliers[agent] || 1;
    if(overlay?.overlayAgents.includes(agent))factor=Math.max(factor,overlay.agentMultipliers[agent] || 1);
    if(factor!==1)value=Math.round(value*factor);
    if(agent==='drain' && config.moveMultipliers[b.activeMove?.id])value=Math.round(value*config.moveMultipliers[b.activeMove.id]);
    if(config.drainStatLoss && ['drain','leechseed','strengthsap'].includes(agent) && source?.hp>0 && source!==target)b.boost({[b.sample(['atk','def','spa','spd','spe'])]:-1},source,target,effect);
    return value;
  }
  function installHealingCallbacks(b){
    const root=b.dex.items.get('bigroot');if(!root.rejuvenationWrapped){const fn=root.onTryHeal;b.dex.items.itemCache.set('bigroot',Object.freeze({...root,rejuvenationWrapped:true,onTryHeal(...args){if(current(this)?.healing)return;return fn.apply(this,args);}}));}
    const ooze=b.dex.abilities.get('liquidooze');if(!ooze.rejuvenationWrapped){const fn=ooze.onSourceTryHeal;b.dex.abilities.abilityCache.set('liquidooze',Object.freeze({...ooze,rejuvenationWrapped:true,onSourceTryHeal(value,...args){return fn.call(this,value*(current(this)?.healing?.liquidOozeFactor || 1),...args);}}));}
  }
  function installAbilityDamageCategories(b){
    const ids=new Set(Object.values(state(b).catalog.fields).flatMap(f=>Object.keys(f.abilityDamageCategories || {})));
    for(const aid of ids){const original=b.dex.abilities.get(aid);if(original.rejuvenationDamageCategory)continue;const next={...original,rejuvenationDamageCategory:true};
      for(const [key,index]of Object.entries({onDamage:3,onCriticalHit:2,onEffectiveness:3})){
        const old=original[key];if(typeof old!=='function')continue;
        next[key]=function(...args){const row=current(this)?.abilityDamageCategories?.[aid],move=args[index];if(row && move?.effectType==='Move' && row.categories.includes(move.category))args[index]={...move,category:row.nativeCategory};return old.apply(this,args);};
      }
      b.dex.abilities.abilityCache.set(aid,Object.freeze(next));
    }
  }
  function installSuppressedCallbacks(b){
    const ids=new Set(Object.values(state(b).catalog.fields).flatMap(f=>Object.keys(f.suppressedConditionCallbacks || {})));
    for(const cid of ids){const original=b.dex.conditions.get(cid);if(original.rejuvenationSuppressedCallbacks)continue;const next={...original,rejuvenationSuppressedCallbacks:true};
      for(const key of ['onModifyAtk','onModifySpA']){const old=original[key];if(typeof old!=='function')continue;next[key]=function(...args){if(current(this)?.suppressedConditionCallbacks?.[cid]?.includes(key))return;return old.apply(this,args);};}
      b.dex.conditions.conditionCache.set(cid,Object.freeze(next));
    }
    for(const f of Object.values(state(b).catalog.fields))for(const [abilityId,callbacks]of Object.entries(f.suppressedAbilityCallbacks || {})){
      const original=b.dex.abilities.get(abilityId);if(original.rejuvenationCallbackWrapper)continue;const wrapped={...original,rejuvenationCallbackWrapper:true};
      for(const key of ['onTryHit','onImmunity']){const fn=original[key];if(typeof fn!=='function')continue;wrapped[key]=function(...args){if(current(this)?.suppressedAbilityCallbacks?.[abilityId]?.includes(key))return;return fn.apply(this,args);};}
      b.dex.abilities.abilityCache.set(abilityId,Object.freeze(wrapped));
    }
  }
  // A reusable ordered-party role allocator. Precedence, preferences and stat
  // classes live in the datapack; stable sorting preserves source party ties.
  function assignPartyRoles(b){
    if(!state(b))return;
    for(const f of Object.values(state(b).catalog.fields))if(f.partyRoles)for(const side of b.sides.filter(Boolean)){
      const party=side.pokemon;if(!party?.length || party[0].rejuvenationRoles?.[f.id])continue;
      const config=f.partyRoles,roles=new Map();roles.set(party.at(-1),config.tailRole);
      for(const p of party.filter(p=>p.hp>0).slice(0,b.gameType==='doubles'?config.frontCount.doubles:config.frontCount.singles))if(!roles.has(p))roles.set(p,config.frontRole);
      const score=p=>[roles.has(p)?1:0,config.preferAbilities.includes(p.ability)?0:1,config.preferItems.includes(p.item)?0:1,p.maxhp];
      const leader=[...party].sort((a,c)=>{const av=score(a),cv=score(c);for(let i=0;i<av.length;i++)if(av[i]!==cv[i])return av[i]-cv[i];return 0;})[0];
      if(!roles.has(leader))roles.set(leader,config.leaderRole);
      for(const p of party)if(!roles.has(p)){const maximum=Math.max(...Object.values(p.storedStats));for(const rule of config.remaining)if(rule.maxStats.some(stat=>p.storedStats[stat]===maximum))roles.set(p,rule.role);}
      for(const p of party){p.rejuvenationRoles ||= {};p.rejuvenationRoles[f.id]=roles.get(p);}
    }
  }
  const oldStart=Battle.prototype.start;
  Battle.prototype.start=function(...args){installPersistentStatusCallbacks(this);assignPartyRoles(this);return oldStart.apply(this,args);};
  const terrainFields={electricterrain:'rejuvenation:electric_terrain',grassyterrain:'rejuvenation:grassy_terrain',mistyterrain:'rejuvenation:misty_terrain',psychicterrain:'rejuvenation:psychic_terrain'};
  function installTerrainCallbacks(b){
    for(const tid of Object.keys(terrainFields)){
      const original=b.dex.conditions.get(tid);if(original.rejuvenationWrapped)continue;
      const wrapped={...original,rejuvenationWrapped:true};
      for(const [key,fn]of Object.entries(original))if(key.startsWith('on') && typeof fn==='function')wrapped[key]=function(...args){if(state(this))return key==='onFieldStart'?true:undefined;return fn.apply(this,args);};
      b.dex.conditions.conditionCache.set(tid,Object.freeze(wrapped));
    }
  }
  const oldTerrain=Field.prototype.setTerrain;
  const oldSetWeather=Field.prototype.setWeather;
  Field.prototype.setWeather=function(status,source,sourceEffect){
    const f=current(this.battle);if(!f)return oldSetWeather.call(this,status,source,sourceEffect);
    const converted=f.weatherConversions?.[id(status.id || status)];if(converted)status=converted;
    const user=source || this.battle.event?.target;
    if(!user && rules(this.battle,'setWeather',{...context(this.battle),status:{id:id(status.id || status)},value:true})===false)return null;
    // A primal source takes over timed weather of the same kind instead of failing against it.
    if(this.weatherState.rejuvenationTimed && this.weather===id(status.id || status) && (sourceEffect || this.battle.effect)?.effectType==='Ability' && this.battle.dex.conditions.get(this.weather).duration===0){this.weather='';this.weatherState={id:''};}
    const before=this.weather,result=oldSetWeather.call(this,status,source,sourceEffect);
    if(result)weatherRainbow(this.battle,before,user);
    return result;
  };
  // Battle.rb:2054 Revival Blessing: a field may restore more than the usual half of the revived Pokémon's HP.
  const nativeRunAction=Battle.prototype.runAction;
  Battle.prototype.runAction=function(action){
    const row=action.choice==='revivalblessing' && current(this)?.revivalBlessing,target=action.target;if(!row || !target)return nativeRunAction.call(this,action);
    const sethp=target.sethp;target.sethp=function(){return sethp.call(this,Math.max(1,Math.floor(this.maxhp*row.fraction)));};
    try{return nativeRunAction.call(this,action);}finally{delete target.sethp;}
  };
  const oldClearWeather=Field.prototype.clearWeather;
  Field.prototype.clearWeather=function(){
    const text=this.weatherState.rejuvenationTimed && current(this.battle)?.timedWeatherText?.[this.weather]?.endMessage;
    return text?withWeatherText(this.battle,text,()=>oldClearWeather.call(this)):oldClearWeather.call(this);
  };
  // pbSetWeather: rain following sun, or sun following rain, raises a rainbow for the duration of the new weather.
  function weatherRainbow(b,before,source){
    const s=state(b),row=current(b)?.weatherRainbow;if(!row)return;
    const group=w=>row.groups.findIndex(g=>g.includes(w)),old=group(before),now=group(b.field.weather);if(old<0 || now<0 || old===now)return;
    if(s.id===row.field && s.duration<=0)return;
    const holder=source && source!=='debug'?source:null,rock=row.extendingItems[b.field.weather];
    const duration=b.field.weatherState.duration || (rock && holder?.hasItem(rock)?row.extendedDuration:row.baseDuration);
    if(s.id===row.field){message(b,row.refreshMessage);if(s.duration<duration)s.duration=duration;sync(b);return;}
    change(b,row.field,{duration,message:row.message},holder);
  }
  const oldPseudoWeather=Field.prototype.addPseudoWeather;
  Field.prototype.addPseudoWeather=function(status,source,sourceEffect){
    const s=state(this.battle),key=id(status.id || status),row=current(this.battle)?.conditionDurations?.[key];
    const invoke=()=>{const result=oldPseudoWeather.call(this,status,source,sourceEffect);if(result && s)rules(this.battle,'pseudoWeatherStart',context(this.battle,source && source!=='debug'?source:null,null,sourceEffect));return result;};
    if(!s || !row || ![...row.sourceMoves,...(row.sourceAbilities || [])].includes(sourceEffect?.id) || this.pseudoWeather[key])return invoke();
    const user=source==='debug'?this.battle.sides[0].active[0]:source || this.battle.event?.target;
    // Evaluate working held items before Magic Room inserts its own condition.
    const previous=s.clockOverride;
    s.clockOverride={key,value:clockDuration(this.battle,row,user,user,sourceEffect,row.duration || 0)};
    try{return invoke();}
    finally{if(previous)s.clockOverride=previous;else delete s.clockOverride;}
  };
  Field.prototype.setTerrain=function(status,source,sourceEffect){
    // Surge abilities call setTerrain without arguments; resolve the holder and ability as the native method does.
    if(!sourceEffect && this.battle.effect)sourceEffect=this.battle.effect;
    if(!source && this.battle.event?.target)source=this.battle.event.target;
    const f=current(this.battle),dest=terrainFields[id(status)];
    if(f && dest){
      const policy=f.terrainPolicy;
      if(policy?.blockedMessage){if(sourceEffect?.effectType==='Move')message(this.battle,policy.blockedMessage);return false;}
      if(policy?.blockedFields?.includes(dest))return false;
      if(state(this.battle).id===dest || state(this.battle).overlay?.id===dest)return false;
    }
    const result=oldTerrain.call(this,status,source,sourceEffect);
    if(result && state(this.battle) && terrainFields[this.terrain]){
      const duration=source?.hasItem('amplifieldrock')?8:(sourceEffect?.effectType==='Move'?f.terrainPolicy?.moveDurations?.[dest]:sourceEffect?.effectType==='Ability'?f.terrainPolicy?.abilityDurations?.[dest]:null) || 5;
      change(this.battle,terrainFields[this.terrain],{duration,message:{electricterrain:'An electric current ran across the battlefield!',grassyterrain:'Grass grew to cover the battlefield!',mistyterrain:'Mist swirled around the battlefield!',psychicterrain:'Psychic energy spread across the battlefield!'}[this.terrain]},source);
      this.terrainState.duration=0;
    }
    return result;
  };
  const oldIsTerrain=Field.prototype.isTerrain;
  Field.prototype.isTerrain=function(terrain,target){
    if(!state(this.battle))return oldIsTerrain.call(this,terrain,target);
    // Source ability and move checks read the hard field and the overlay independently (FE == x || OV == x).
    const effective=[state(this.battle).overlay?.id,state(this.battle).id];
    const requested=Array.isArray(terrain)?terrain:[terrain];
    return requested.some(t=>effective.includes(terrainFields[id(t)])) && (!target || !airborne(target));
  };
  const oldGrounded=Pokemon.prototype.isGrounded;
  Pokemon.prototype.isGrounded=function(negateImmunity=false){
    const policy=current(this.battle)?.grounding;
    const declared=(state(this.battle)?.catalog || catalog)?.abilities?.[this.ability];
    const forcedIron=(!policy || policy.forceGroundingItems.includes('ironball')) && this.hasItem('ironball');
    if(!(this.volatiles.ingrain || this.volatiles.smackdown || forcedIron) && !this.ignoringAbility() && !this.battle.suppressingAbility(this) && declared?.airborneBeforeGravity)return false;
    if(policy){
      if(this.volatiles.ingrain || this.volatiles.smackdown || this.hasItem(policy.forceGroundingItems))return true;
      if(!this.ignoringAbility() && !this.battle.suppressingAbility(this) && this.hasAbility(policy.airborneAbilities))return false;
    }
    if(!(this.volatiles.ingrain || this.volatiles.smackdown || forcedIron || this.battle.field.pseudoWeather.gravity) && !this.ignoringAbility() && !this.battle.suppressingAbility(this) && (state(this.battle)?.catalog || catalog)?.abilities?.[this.ability]?.airborne)return false;
    if(policy && !policy.forceGroundingItems.includes('ironball') && this.item==='ironball'){const ignoring=this.ignoringItem;this.ignoringItem=()=>true;try{return oldGrounded.call(this,negateImmunity);}finally{this.ignoringItem=ignoring;}}
    return oldGrounded.call(this,negateImmunity);
  };
  // Teams.unpack recovers the display name from the Dex (Storm 9), but Pokemon
  // derives its ability id from that string. Restore the declared source id at
  // the team boundary, after unpacking and before constructing Pokemon.
  const oldGetTeam=Battle.prototype.getTeam;
  Battle.prototype.getTeam=function(...args){const team=oldGetTeam.apply(this,args),rows=(state(this)?.catalog || catalog)?.abilities || {};
    for(const set of team){const match=Object.entries(rows).find(([key,row])=>id(set.ability)===key || id(set.ability)===id(row.name));if(match)set.ability=match[0];}return team;};
  const oldWrite=BattleStream.prototype._writeLine;
  BattleStream.prototype._writeLine=function(type,messageText) {
    const out=oldWrite.call(this,type,messageText);
    if(type==='start') {
      const options=JSON.parse(messageText);
      if(options.rejuvenationField && this.battle)attach(this.battle,options.rejuvenationField,options.rejuvenationFieldOptions || {});
      else if(this.battle)installPersistentStatusCallbacks(this.battle);
    }
    return out;
  };
  const oldDestroy=Battle.prototype.destroy;
  Battle.prototype.destroy=function(...args){if(this.rejuvenationBattleId && battlesById.get(this.rejuvenationBattleId)===this)battlesById.delete(this.rejuvenationBattleId);for(const side of this.sides.filter(Boolean))for(const p of side.pokemon){delete p.rejuvenationFlags;delete p.rejuvenationFormType;}delete this.rejuvenation;return oldDestroy.apply(this,args);};
  const oldImmunity=Pokemon.prototype.runImmunity;
  function chartOverride(b,attackType,defenseType,move,target){
    let value;for(const r of current(b)?.typeChart || [])if((r.attackType==='*' || r.attackType===attackType) && (r.defenseType==='*' || r.defenseType===defenseType) && test(r.condition,context(b,b.activePokemon,target,move)))value=r.value;return value;
  }
  function fieldImmunity(p,typeName,args){
    const b=p.battle,move=b.activeMove;let changed=false,immune=false;
    for(const t of p.getTypes()){const custom=chartOverride(b,typeName,t,move,p);changed ||= custom!==undefined;immune ||= custom===undefined?!b.dex.getImmunity(typeName,t):custom==='immune';}
    if(!changed)return oldImmunity.call(p,typeName,...args);
    if(immune && !p.hasItem('ringtarget') && b.runEvent('NegateImmunity',p,typeName)){if(args[0])b.add('-immune',p);return false;}
    if(typeName==='Ground' && p.isGrounded(true)!==true){if(args[0])b.add('-immune',p);return false;}
    return true;
  }
  Pokemon.prototype.runImmunity=function(typeName,...args) {
    if(!typeName || typeName==='???' || !state(this.battle))return oldImmunity.call(this,typeName,...args);
    if(current(this.battle)?.originalId==='INVERSE')return typeName!=='Ground' || this.isGrounded(true)===true;
    if(!fieldImmunity(this,typeName,args))return false;
    const move=this.battle.activeMove;
    if(move && typeName===move.type)for(const extra of move.rejuvenationTypes || [])if(!fieldImmunity(this,extra,args))return false;
    return true;
  };
  const oldEffectiveness=Pokemon.prototype.runEffectiveness;
  Pokemon.prototype.runEffectiveness=function(move) {
    let value=oldEffectiveness.call(this,move);
    if(current(this.battle)?.originalId==='INVERSE') {
      value=0;for(const attackType of [move.type,...(move.rejuvenationTypes || [])])for(const defenseType of this.getTypes())value+=this.battle.dex.getImmunity(attackType,defenseType)?-this.battle.dex.getEffectiveness(attackType,defenseType):1;
    }
    const type=(state(this.battle)?.catalog || catalog)?.fields[indoor]?.typeDefinitions?.[move.type]?.flagInteraction;
    if(type){if(this.rejuvenationFlags?.[type.flag])value+=type.flagged;else if(!this.hasType(type.unflaggedExceptions))value+=type.unflagged;}
    for(const row of (state(this.battle)?.catalog || catalog)?.fields[indoor]?.typeFlagInteractions || [])if(row.attackType===move.type)value+=this.rejuvenationFlags?.[row.flag]?row.flagged:row.unflagged;
    // Battle_Move.rb:762-765: a field may fix the whole matchup regardless of the defender's types.
    for(const row of current(this.battle)?.effectivenessOverrides || [])if(test(row.condition,context(this.battle,this.battle.activePokemon,this,move)))value=row.value;
    return value;
  };
  function references(data){
    const dex=RegistryDex.mod('cobblemon'),missing={moves:new Set(),abilities:new Set(),items:new Set()};
    const check=(kind,id)=>{if(!dex[kind].get(id).exists && !(kind==='items' && data.items?.[id]) && !(kind==='abilities' && data.abilities?.[id]))missing[kind].add(id);};
    function visit(v){if(!v || typeof v!=='object')return;if(v.move)check('moves',v.move);if(v.sourceMove)check('moves',v.sourceMove);if(v.ability?.values)for(const id of v.ability.values)check('abilities',id);if(v.effectiveAbility?.values)for(const id of v.effectiveAbility.values)check('abilities',id);if(v.item?.values)for(const id of v.item.values)check('items',id);if(v.globalAbility)for(const id of v.globalAbility)check('abilities',id);if(v.lastMove)for(const id of v.lastMove.values)check('moves',id);if(v.op==='ability')check('abilities',v.id);if(v.sourceAbility)check('abilities',v.sourceAbility);if(v.recipe==='randomMovePool')for(const mid of v.choices || [])check('moves',mid);if(v.op==='pairField'){check('moves',v.token);for(const row of v.pairs)check('moves',row.with);}for(const x of Object.values(v))visit(x);}
    for(const f of Object.values(data.fields)){for(const content of [f,f.overlay].filter(Boolean))for(const mid of Object.keys(content.moves))check('moves',mid);for(const iid of Object.keys(f.itemHandlers || {}))check('items',iid);check('moves',f.naturePower);check('moves',f.secretPower);if(f.seed)check('items',f.seed.item);for(const mid of [...f.statusBuffs,...f.statusNerfs,...Object.keys(f.healing?.moveMultipliers || {}),...(f.gravityUsableMoves || [])])check('moves',mid);for(const aid of [...Object.keys(f.abilityHandlers || {}),...Object.keys(f.abilityDamageCategories || {}),...Object.keys(f.suppressedAbilityCallbacks || {}),...(f.grounding?.airborneAbilities || [])])check('abilities',aid);for(const iid of f.grounding?.forceGroundingItems || [])check('items',iid);visit(f);}
    for(const f of Object.values(data.fields))if(f.trapping){for(const mid of [...Object.keys(f.trapping.moveIncrements),...Object.keys(f.trapping.statLoss)])check('moves',mid);for(const aid of f.trapping.immuneAbilities)check('abilities',aid);}
    for(const f of Object.values(data.fields))for(const aid of [...Object.keys(f.abilityAbsorptions || {}),...(f.indirectImmunityAbilities || [])])check('abilities',aid);
    for(const f of Object.values(data.fields))for(const row of Object.values(f.conditionDurations || {})){for(const mid of row.sourceMoves)check('moves',mid);for(const aid of row.sourceAbilities || [])check('abilities',aid);}
    return Object.fromEntries(Object.entries(missing).map(([k,v])=>[k,[...v].sort()]));
  }
  // ---------------------------------------------------------------------------------------------
  // Read-only move evaluation, shared by the Run & Bun AI adapter and the client damage preview.
  // Each query runs the simulator's own pipeline (priority, ModifyType/ModifyMove, TryMove, TryHit,
  // immunity, accuracy, getDamage, status/heal application) inside a transaction that restores the
  // Pokémon involved, both sides, the field, the battle's own properties and field-engine state,
  // uses a cloned PRNG and restores the log tail. The whole call is additionally wrapped in one
  // transaction over every Pokémon. The same query is measured with the field state attached and
  // detached, so consumers apply the field's effect without a second implementation of any rule.
  // ---------------------------------------------------------------------------------------------
  const battlesById=new Map();
  // Plain data is recognised structurally, so objects created in another realm (the simulator's) qualify too.
  // The kind depends only on the prototype, so it is computed once per prototype; frozen data is shared.
  const kindByPrototype=new Map();
  function plainKind(v){
    if(v===null || typeof v!=='object')return null;
    let kind;
    if(Array.isArray(v))kind='array';
    else{
      const p=Object.getPrototypeOf(v);kind=kindByPrototype.get(p);
      if(kind===undefined){const tag=Object.prototype.toString.call(v);
        kind=tag==='[object Set]'?'set':tag==='[object Map]'?'map':p===null || Object.getPrototypeOf(p)===null?'object':null;kindByPrototype.set(p,kind);}
    }
    return kind && !Object.isFrozen(v)?kind:null;
  }
  // Snapshots allocate only for mutable containers; primitive and shared reference leaves are stored as they are.
  function Capture(ref,kind,keys,values){this.ref=ref;this.kind=kind;this.keys=keys;this.values=values;}
  function captureValue(v,depth){
    const kind=depth>0?plainKind(v):null;
    if(!kind)return v;
    if(kind==='array'){const values=new Array(v.length);for(let i=0;i<v.length;i++)values[i]=captureValue(v[i],depth-1);return new Capture(v,0,null,values);}
    if(kind==='set')return new Capture(v,1,null,[...v]);
    if(kind==='map')return new Capture(v,2,null,[...v.entries()]);
    const keys=Object.keys(v),values=new Array(keys.length);
    for(let i=0;i<keys.length;i++)values[i]=captureValue(v[keys[i]],depth-1);
    return new Capture(v,3,keys,values);
  }
  // Restoration writes only what changed, preserving element/entry order exactly as captured.
  function restoreValue(c){
    const v=c.ref,values=c.values,n=values.length;
    if(c.kind===0){
      let same=v.length===n;
      for(let i=0;i<n;i++){const x=values[i] instanceof Capture?restoreValue(values[i]):values[i];if(same && v[i]!==x)same=false;}
      if(!same){v.length=0;for(let i=0;i<n;i++)v.push(values[i] instanceof Capture?values[i].ref:values[i]);}
    }else if(c.kind===1){
      let same=v.size===n,i=0;if(same)for(const x of v)if(x!==values[i++]){same=false;break;}
      if(!same){v.clear();for(const x of values)v.add(x);}
    }else if(c.kind===2){
      let same=v.size===n,i=0;if(same)for(const [k,x] of v){const e=values[i++];if(k!==e[0] || x!==e[1]){same=false;break;}}
      if(!same){v.clear();for(const [k,x] of values)v.set(k,x);}
    }else{
      const keys=c.keys,present=Object.keys(v);
      let same=present.length===n;
      if(same)for(let i=0;i<n;i++)if(present[i]!==keys[i]){same=false;break;}
      if(!same){const known=new Set(keys);for(const k of present)if(!known.has(k))delete v[k];}
      for(let i=0;i<n;i++){const k=keys[i],x=values[i] instanceof Capture?restoreValue(values[i]):values[i];
        if(v[k]!==x || (!same && !Object.prototype.hasOwnProperty.call(v,k)))v[k]=x;}
    }
    return v;
  }
  // The team set and the base move slots never change during a battle; they are kept by reference.
  const fixedPokemonKeys=new Set(['set','baseMoveSlots','battle','side']);
  // A side's team is assigned once by its constructor and holds the same sets as each Pokemon's `set`.
  const fixedSideKeys=new Set([...fixedPokemonKeys,'team']);
  function captureInstance(o,depth,fixed){
    const keys=Object.keys(o),values=new Array(keys.length);
    for(let i=0;i<keys.length;i++)values[i]=fixed?.has(keys[i])?o[keys[i]]:captureValue(o[keys[i]],depth);
    return new Capture(o,3,keys,values);
  }
  function captureBattle(b,pokemon){
    const parts=[captureInstance(b.field,3)];
    for(const side of b.sides.filter(Boolean))parts.push(captureInstance(side,3,fixedSideKeys));
    for(const p of pokemon || b.sides.filter(Boolean).flatMap(side=>side.pokemon))parts.push(captureInstance(p,3,fixedPokemonKeys));
    if(b.queue?.list)parts.push(captureValue(b.queue.list,1));
    if(b.faintQueue)parts.push(captureValue(b.faintQueue,3));
    if(b.inputLog)parts.push(captureValue(b.inputLog,2));
    const own=Object.create(null);for(const k of Object.keys(b))if(k!=='log' && k!=='rejuvenation')own[k]=b[k];
    // attrLastMove/retargetLastMove edit or splice log[lastMoveLine] in place, so the tail from that line is kept.
    const tailStart=b.lastMoveLine>=0?Math.min(b.lastMoveLine,b.log.length):b.log.length;
    return {parts,own,tailStart,tail:b.log.slice(tailStart),state:b.rejuvenation,hasState:Object.prototype.hasOwnProperty.call(b,"rejuvenation"),stateCopy:b.rejuvenation?captureValue(b.rejuvenation,5):null};
  }
  function restoreBattle(b,snapshot){
    for(const part of snapshot.parts)if(part instanceof Capture)restoreValue(part);
    // Transient keys are removed newest first, which lets engines revert the object's shape instead of degrading it.
    const keys=Object.keys(b);for(let i=keys.length-1;i>=0;i--){const k=keys[i];if(k!=='log' && k!=='rejuvenation' && !(k in snapshot.own))delete b[k];}
    for(const k in snapshot.own)if(b[k]!==snapshot.own[k])b[k]=snapshot.own[k];
    b.log.length=snapshot.tailStart;b.log.push(...snapshot.tail);
    if(snapshot.state){b.rejuvenation=snapshot.state;if(snapshot.stateCopy instanceof Capture)restoreValue(snapshot.stateCopy);}
    else if(snapshot.hasState)b.rejuvenation=undefined;else delete b.rejuvenation;
  }
  function transaction(b,fn,pokemon){
    const snapshot=captureBattle(b,pokemon),prng=b.prng;b.prng=prng.clone();
    // No hypothetical event may publish simulator output or finish the real battle.
    b.send=()=>{};b.checkWin=()=>false;
    try{return fn();}finally{restoreBattle(b,snapshot);b.prng=prng;}
  }
  // Several independent hypotheticals from the same state: a snapshot only records references and captured
  // values, so one capture is restored after each item exactly as separate transactions would be.
  function transactionEach(b,items,fn,pokemon){
    const snapshot=captureBattle(b,pokemon),prng=b.prng,results=[];
    for(const item of items){
      b.prng=prng.clone();b.send=()=>{};b.checkWin=()=>false;
      try{results.push(fn(item));}finally{restoreBattle(b,snapshot);b.prng=prng;}
    }
    return results;
  }
  // Temporarily replaces a member of an object that snapshots do not cover (BattleActions); the returned function
  // restores it exactly, including whether it was an own property or inherited from the prototype.
  function swap(o,key,value){const own=Object.prototype.hasOwnProperty.call(o,key),old=o[key];o[key]=value;return ()=>{if(own)o[key]=old;else delete o[key];};}
  // Pokemon a hypothetical move can affect: the actives (abilities, allies, Commander...) and the participants.
  function involved(b,...pokemon){const out=new Set(b.getAllActive());for(const p of pokemon)if(p)out.add(p);return [...out];}
  function findPokemon(b,uuid){for(const side of b.sides.filter(Boolean))for(const p of side.pokemon)if(p.uuid===uuid)return p;return null;}
  function spreadTargets(user,move){
    if(!['allAdjacent','allAdjacentFoes'].includes(move.target))return 1;
    return (move.target==='allAdjacent'?[...user.adjacentAllies(),...user.adjacentFoes()]:user.adjacentFoes()).filter(p=>p && !p.fainted).length;
  }
  function evaluatorPriority(b,user,moveId,query){
    const move=b.dex.getActiveMove(moveId),action={choice:'move',pokemon:user,move,fractionalPriority:0};
    if(query.gimmick==='zmove')action.zmove=b.actions.getZMove(move,user);
    if(query.gimmick==='dynamax' || user.volatiles.dynamax)action.maxMove=b.actions.getMaxMove(move,user)?.id;
    b.getActionSpeed(action);
    return action.priority;
  }
  function prepareMove(b,user,target,moveId,priority,query={}){
    let move=b.dex.getActiveMove(moveId);
    // Conversion belongs to BattleActions: generic Z/Max moves in the dex have placeholder power/category.
    if(query.gimmick==='zmove')move=b.actions.getActiveZMove(move,user);
    else if(query.gimmick==='dynamax' || user.volatiles.dynamax)move=b.actions.getActiveMaxMove(move,user);
    move.priority=priority;move.hit=1;
    b.setActiveMove(move,user,target);
    b.singleEvent('ModifyType',move,null,user,target,move,move);
    b.singleEvent('ModifyMove',move,null,user,target,move,move);
    move=b.runEvent('ModifyType',user,target,move,move);
    move=b.runEvent('ModifyMove',user,target,move,move);
    if(move && move.spreadHit===undefined)move.spreadHit=spreadTargets(user,move)>1;
    return move;
  }
  // Hit steps that can make a target immune, in Showdown's trySpreadMoveHit order.
  function isImmune(b,user,target,move){
    if(['self','allies','allySide','all','foeSide'].includes(move.target) || target===user)return false;
    const tryHit=b.singleEvent('TryHit',move,null,target,user,move);
    const result=tryHit===false || tryHit===null?tryHit:b.runEvent('TryHit',target,user,move);
    if(result===false || result===null || result==='')return true;
    const typeImmunity=move.category!=='Status'?!move.ignoreImmunity || (move.ignoreImmunity!==true && !move.ignoreImmunity[move.type]):move.ignoreImmunity===false;
    if(typeImmunity && !target.runImmunity(move.type))return true;
    if(b.runEvent('TryImmunity',target,user,move)===false)return true;
    return !!(move.pranksterBoosted && target.hasType('Dark') && !target.isAlly(user));
  }
  // A chosen damage roll (percent) for hypothetical evaluation. A field with a fixed roll (Concert 1 and 4, applied
  // through Battle.prototype.randomizer) keeps its own roll, so previews and lookahead see the real damage there.
  function forcedRoll(b,percent){const roll=current(b)?.damageRoll;return d=>b.trunc(b.trunc(d*(roll ?? percent))/100);}
  // One damage roll; `fixed` is the random percentage removed (0 = highest roll, 15 = lowest).
  function rollDamage(b,user,target,move,fixed,crit,ignoreImmunity){
    // A shallow copy equals the former fresh clone overwritten by every property of the prepared move.
    // Arrays are copied too: callbacks consume them per roll (Beat Up shifts move.allies).
    const m=Object.assign(Object.create(Object.getPrototypeOf(move)),move);if(crit!==undefined)m.willCrit=crit;
    for(const k of Object.keys(m))if(Array.isArray(m[k]))m[k]=m[k].slice();m.hit=1;if(ignoreImmunity)m.ignoreImmunity=true;
    b.randomizer=forcedRoll(b,100-fixed);
    try{const d=b.actions.getDamage(user,target,m,true);return typeof d==='number'?d:d===false?null:0;}finally{delete b.randomizer;}
  }
  function guaranteedCritical(b,user,target,move){
    if(move.willCrit!==undefined)return !!move.willCrit;
    // Installed modern Showdown guarantees critical hits at stage 4. Ordinary preview ranges exclude
    // chance critical hits, matching Battle Extras, but must retain guaranteed ones.
    return b.gen>=6 && b.runEvent('ModifyCritRatio',user,target,move,move.critRatio || 0)>=4;
  }
  function measure(b,user,target,moveId,query){
    const out={};
    // Priority is resolved on a fresh active move before any modification, as the action queue does.
    out.priority=evaluatorPriority(b,user,moveId,query);
    const move=prepareMove(b,user,target,moveId,out.priority,query);
    if(!move)return {fails:true,priority:out.priority};
    Object.assign(out,{type:move.type,category:move.category,target:move.target,basePower:move.basePower,
      multihit:move.multihit ?? null,drain:move.drain ?? null,recoil:move.recoil ?? null,heal:move.heal ?? null,
      bypassesProtect:!move.flags?.protect,overrideOffensiveStat:move.overrideOffensiveStat ?? null,overrideDefensiveStat:move.overrideDefensiveStat ?? null,
      secondaryTypes:[...(move.rejuvenationTypes || [])],randomSecondaryType:!!move.rejuvenationRandomTypes});
    const transition=state(b)?current(b).moves[move.id]?.transition:null;
    out.changesFieldTo=transition && willChange(b,move,user,target)?transition.field:null;
    out.fails=!b.singleEvent('TryMove',move,null,user,target,move) || !b.runEvent('TryMove',user,target,move);
    out.immune=isImmune(b,user,target,move);
    // Accuracy as hitStepAccuracy computes it, without the random roll.
    let accuracy=move.accuracy;
    if(move.ohko)accuracy=30;
    else{
      accuracy=b.runEvent('ModifyAccuracy',target,user,move,accuracy);
      if(accuracy!==true){
        let boost=0;
        if(!move.ignoreAccuracy)boost=b.clampIntRange(b.runEvent('ModifyBoost',user,null,null,{...user.boosts}).accuracy,-6,6);
        if(!move.ignoreEvasion)boost=b.clampIntRange(boost-b.runEvent('ModifyBoost',target,null,null,{...target.boosts}).evasion,-6,6);
        if(boost>0)accuracy=b.trunc(accuracy*(3+boost)/3);else if(boost<0)accuracy=b.trunc(accuracy*3/(3-boost));
      }
    }
    if(move.alwaysHit || (move.target==='self' && move.category==='Status'))accuracy=true;
    else accuracy=b.runEvent('Accuracy',target,user,move,accuracy);
    out.accuracy=accuracy===true?true:typeof accuracy==='number'?Math.max(0,Math.min(100,accuracy)):0;
    out.critRatio=b.runEvent('ModifyCritRatio',user,target,move,move.critRatio || 0);
    if(query.strategy){
      // Strategic lookahead reads only priority, accuracy, immunity and the highest roll; speeds come from the
      // caller and the stage-4 critical policy reuses the stage computed above (as guaranteedCritical does).
      // `facts` callers read only priority, accuracy and chances; their own rollout deals the damage.
      if(move.category!=='Status' && !query.facts)out.maxDamage=rollDamage(b,user,target,move,0,move.willCrit!==undefined?!!move.willCrit:b.gen>=6 && out.critRatio>=4);
      // Probability that at least one chance-based secondary applies, from the chances after ModifyMove
      // (Serene Grace, field rules) and the target's ModifySecondaries (Shield Dust, Covert Cloak).
      out.critBlocked=b.runEvent('CriticalHit',target,null,move)===false;
      if(query.secondaries!==false && move.secondaries?.length && target!==user){
        const list=b.runEvent('ModifySecondaries',target,user,move,move.secondaries.slice());
        let none=1;for(const s of Array.isArray(list)?list:[])if(s.chance!==undefined && s.chance<100)none*=1-Math.max(0,s.chance)/100;
        if(none<1)out.secondaryChance=1-none;
      }
      return out;
    }
    out.userSpeed=user.getStat('spe');out.targetSpeed=target.getStat('spe');
    out.targetHp=target.hp;out.targetMaxHp=target.maxhp;
    if(move.category!=='Status'){
      out.typeMod=b.clampIntRange(target.runEffectiveness(move),-6,6);
      out.critBlocked=b.runEvent('CriticalHit',target,null,move)===false;
      // Optional rolls need the pre-damage state (an eaten resist berry, Stellar boosts), so they run in their own transactions.
      if(query.range)out.minDamage=transaction(b,()=>rollDamage(b,user,target,move,15,guaranteedCritical(b,user,target,move)),[user,target]);
      if(query.crit)out.critDamage=transaction(b,()=>[rollDamage(b,user,target,move,15,true),rollDamage(b,user,target,move,0,true)],[user,target]);
      // Last, inside measure's own transaction: the highest roll, then endure-style effects (Sturdy, Chess pawns,
      // Colosseum Stalwart), which act in the Damage event after getDamage and do not depend on the roll.
      out.maxDamage=rollDamage(b,user,target,move,0,guaranteedCritical(b,user,target,move));
      out.survivesLethal=target.hp>0 && (r=>typeof r==='number' && r<target.hp)(b.runEvent('Damage',target,user,move,target.hp));
    }else{
      // Status moves: does the primary effect apply under the current rules?
      const applies=fn=>!out.immune && transaction(b,()=>{const r=fn();return r!==false && r!==null && r!==undefined && r!=='';},[user,target]);
      if(move.status)out.statusApplies=applies(()=>target.setStatus(move.status,user,move));
      else if(move.volatileStatus && target!==user)out.statusApplies=applies(()=>target.addVolatile(move.volatileStatus,user,move));
      else if(move.boosts && target!==user)out.statusApplies=applies(()=>b.boost(move.boosts,target,user,move));
      if(move.flags?.heal)out.healFraction=transaction(b,()=>{user.hp=1;
        if(move.heal)b.heal(b.modify(user.maxhp,move.heal),user,user,move);else if(typeof move.onHit==='function')move.onHit.call(b,user,user,move);
        return Math.max(0,user.hp-1)/user.maxhp;},[user,target]);
    }
    return out;
  }
  // The native measurement only needs what a consumer's own calculator lacks: the native damage and immunity
  // under the same battle state, to scale its own estimate by the field's effect.
  function measureNative(b,user,target,moveId,query){
    // Detached by value, not deletion: restoring the battle then keeps its own-key order.
    b.rejuvenation=undefined;
    const move=prepareMove(b,user,target,moveId,evaluatorPriority(b,user,moveId,query),query);
    if(!move)return {fails:true};
    const out={type:move.type,category:move.category,fails:!b.singleEvent('TryMove',move,null,user,target,move) || !b.runEvent('TryMove',user,target,move),
      immune:isImmune(b,user,target,move),userSpeed:user.getStat('spe'),targetSpeed:target.getStat('spe')};
    if(move.category!=='Status'){
      out.typeMod=b.clampIntRange(target.runEffectiveness(move),-6,6);
      if(query.range)out.minDamage=transaction(b,()=>rollDamage(b,user,target,move,15,guaranteedCritical(b,user,target,move)),[user,target]);
      out.maxDamage=rollDamage(b,user,target,move,0,guaranteedCritical(b,user,target,move));
      // A native type immunity stops getDamage before any event runs; this is the baseline for a field that removes it.
      if(out.maxDamage===null)out.maxDamageIgnoringImmunity=rollDamage(b,user,target,move,0,false,true);
    }else if(move.status)out.statusApplies=!out.immune && transaction(b,()=>!!target.setStatus(move.status,user,move),[user,target]);
    return out;
  }
  function applyEvaluationGimmick(b,user,gimmick){
    if(!gimmick || gimmick==='zmove')return;
    if(gimmick==='mega' || gimmick==='ultra'){
      if(!(gimmick==='mega'?user.canMegaEvo:user.canUltraBurst))throw Error('unavailable '+gimmick);
      // runMegaEvo chooses canMegaEvo first; Ultra Burst must explicitly select its own form.
      if(gimmick==='ultra')user.canMegaEvo=null;
      b.actions.runMegaEvo(user);
    }else if(gimmick==='terastallize'){
      if(!user.canTerastallize)throw Error('unavailable tera');b.actions.terastallize(user);
    }else if(gimmick==='dynamax'){
      // Battle.runAction 'runDynamax' as installed: the volatile, the side resources and the Pokemon's Tera option.
      if(!user.volatiles.dynamax){
        if(!user.getDynamaxRequest())throw Error('unavailable dynamax');
        user.addVolatile('dynamax');user.side.dynamaxUsed=true;user.canTerastallize=null;
        if(user.side.allySide)user.side.allySide.dynamaxUsed=true;
      }
    }else throw Error('unknown gimmick');
  }
  // Complete hit pipeline for displayed ranges, including per-hit items/abilities, protection,
  // fixed damage and endure effects. Damage is conditional on connecting (accuracy is reported separately).
  // One bound of a preview range, by the real move pipeline. The damage roll, the critical policy and accuracy are set
  // to the bound; so is the hit count, through the simulator's own draws (the 2-5 hit distribution, Loaded Dice) and,
  // on the low run, the misses of a multi-accuracy move's later hits. Any other random draw before or during a damage
  // calculation (Magnitude, Psywave, Present, called moves, random targets, a contact ability between hits) makes the
  // run one sample rather than a bound: it is reported as stochastic and the range is not displayed.
  let effectDraws=0;
  function previewRoll(b,user,target,query,low){
    applyEvaluationGimmick(b,user,query.gimmick);
    b.rejuvenationPreviewRoll=low?0:1;
    const before=target.hp,oldEvent=b.runEvent,oldDamage=b.actions.getDamage,oldLoop=b.actions.hitStepMoveHitLoop,oldSpread=b.actions.spreadMoveHit;
    let hits=0,damageCalls=0,inDamage=0,countingHits=false;const draws=[];
    // A draw is recorded with the number of completed damage calculations against the target (-1 inside one);
    // only draws after the last one cannot have changed the damage.
    const note=()=>draws.push(inDamage?-1:damageCalls),oldSample=b.sample,oldRandom=b.random,oldChance=b.randomChance;
    // Hit-count draws: sample() of the count distribution, random(m,n) of a count range, and Loaded Dice's random(k)
    // subtracted from the count; each returns the value that yields the bound.
    const restoreSample=swap(b,'sample',function(items){
      if(countingHits && Array.isArray(items) && items.length && items.every(x=>typeof x==='number'))return low?Math.min(...items):Math.max(...items);
      // One possible outcome, or a draw that only selects a secondary effect, cannot change the damage.
      if(!effectDraws && !(Array.isArray(items) && items.length && items.every(x=>x===items[0])))note();
      return oldSample.apply(this,arguments);});
    const restoreRandom=swap(b,'random',function(m,n){
      if(countingHits && typeof m==='number')return n===undefined?(low?m-1:0):(low?m:n-1);
      note();return oldRandom.apply(this,arguments);});
    // A certain outcome (0 or full chance) draws nothing that could change the result.
    const restoreChance=swap(b,'randomChance',function(numerator,denominator){
      if(this.forceRandomChance!==null && this.forceRandomChance!==undefined)return this.forceRandomChance;
      if(numerator<=0)return false;if(numerator>=denominator)return true;
      note();return oldChance.apply(this,arguments);});
    const restoreLoop=swap(b.actions,'hitStepMoveHitLoop',function(...args){countingHits=true;try{return oldLoop.apply(this,args);}finally{countingHits=false;}});
    const restoreSpread=swap(b.actions,'spreadMoveHit',function(...args){countingHits=false;return oldSpread.apply(this,args);});
    b.randomizer=forcedRoll(b,low?85:100);
    b.runEvent=function(event,...args){
      const value=oldEvent.call(this,event,...args);
      if(event!=='Accuracy')return value;
      const move=args[2];
      return low && move?.multiaccuracy && move.hit>1?0:true;
    };
    // A hit passes the active move; secondary and self effects re-enter the hit pipeline with their bare effect
    // objects (no id) and deal no damage, so they are neither hits nor damage calculations.
    const restoreDamage=swap(b.actions,'getDamage',function(u,t,m,...args){
      countingHits=false;
      const hit=u===user && t===target && !!m && typeof m==='object' && typeof m.id==='string';
      if(m && typeof m==='object'){
        m.willCrit=guaranteedCritical(b,u,t,m);
        if(hit)hits++;
      }
      inDamage++;
      try{return oldDamage.call(this,u,t,m,...args);}finally{inDamage--;if(hit)damageCalls++;}
    });
    try{
      const base=b.dex.getActiveMove(query.move),z=query.gimmick==='zmove'?b.actions.getZMove(base,user):undefined;
      const max=query.gimmick==='dynamax' || user.volatiles.dynamax?b.actions.getMaxMove(base,user)?.id:undefined;
      b.actions.useMove(base,user,target,null,z,max);
      // Field destruction/collapse may occur in AfterMove, after the hit pipeline finishes.
      b.runEvent('AfterMove',user,target,b.activeMove || base);
      return {damage:Math.max(0,before-target.hp),hits,stochastic:draws.some(at=>at<damageCalls)};
    }finally{b.runEvent=oldEvent;restoreSample();restoreRandom();restoreChance();restoreLoop();restoreSpread();restoreDamage();delete b.randomizer;}
  }
  function evaluateMove(b,query){
    const user=findPokemon(b,query.user),target=findPokemon(b,query.target ?? query.user);
    if(!user || !target || !b.dex.moves.get(query.move).exists)return {query,error:'unknown pokemon or move'};
    // A benched Pokemon is measured as it would attack after switching in: the simulator ignores the abilities and
    // items of inactive Pokemon, so it enters the side's first occupied slot (or query.slot) with its entry effects.
    if(query.bench && !user.isActive){
      const slot=Number.isInteger(query.slot)?query.slot:user.side.active.findIndex(a=>a);
      if(slot<0 || user.hp<=0 || user.fainted || query.gimmick)return {query,error:'unavailable bench evaluation'};
      const result=transaction(b,()=>{b.actions.switchIn(user,slot);b.actions.runSwitch(user);if(b.gen>=5)b.eachEvent('Update');
        return evaluateMove(b,{...query,bench:false});});
      return {...result,query};
    }
    if(query.gimmick==='zmove' && !b.actions.getZMove(b.dex.moves.get(query.move),user))return {query,error:'unavailable zmove'};
    const withField=transaction(b,()=>{applyEvaluationGimmick(b,user,query.gimmick);return measure(b,user,target,query.move,query);});
    const nativeRules=transaction(b,()=>{applyEvaluationGimmick(b,user,query.gimmick);return measureNative(b,user,target,query.move,query);});
    // A random additional type is deliberately typeless during read-only measurements. A seeded sample is
    // not a certified range over its possible immunities/types; omit damage display until the type is known.
    if(query.range && withField.randomSecondaryType)withField.uncertainDamageRange=true;
    if(query.range && withField.category!=='Status' && !withField.randomSecondaryType){
      const low=transaction(b,()=>previewRoll(b,user,target,query,true));
      const high=transaction(b,()=>previewRoll(b,user,target,query,false));
      // A range from random power, damage, called moves or targets would be one seeded sample: it is not displayed.
      if(low.stochastic || high.stochastic){withField.stochasticDamage=true;withField.uncertainDamageRange=true;}
      else{withField.totalMinDamage=low.damage;withField.totalMaxDamage=high.damage;withField.minHits=low.hits;withField.maxHits=high.hits;}
    }
    return {query,withField,native:nativeRules};
  }
  function evaluate(b,queries){
    if(!state(b))return {field:null,overlay:null,turn:b.turn,results:[]};
    // One query's failure reports an error row for it; the others keep their measurements.
    const results=transaction(b,()=>queries.map(q=>transaction(b,()=>{
      try{return evaluateMove(b,q);}catch(error){return {query:q,error:'evaluation failed: '+String(error?.message || error)};}
    })));
    return {field:state(b).id,overlay:state(b).overlay?.id || null,turn:b.turn,results};
  }
  // Strategic scoring contains no field formulas. Consequences are produced by the same actions,
  // entry events and residual events as a real turn, inside the evaluator's rollback transaction.
  // BEGIN GENERATED SOURCE AI AFFINITY
  // Rejuvenation switch strategy weights; mechanics continue to come exclusively from the simulator.
  function sourceAffinity(b,p,field=current(b)){
    const original=field?.originalId || "INDOOR",stage=Number(original.match(/\d+$/)?.[0] || 0);
    const effective=p.hasAbility(p.ability)?p.ability:"",unsuppressed=!!effective;
    const ability=a=>effective===a,baseAbility=a=>unsuppressed && p.baseAbility===a;let score=0;
    switch(original){
    case "ELECTERRAIN":
      if(ability("surgesurfer"))score+=50; // Battle_AI.rb:11535
      if(true && ability("teravolt"))score+=50; // Battle_AI.rb:11536
      if(ability("galvanize"))score+=25; // Battle_AI.rb:11537
      if(true && ability("steadfast"))score+=25; // Battle_AI.rb:11538
      if(true && ability("quickfeet"))score+=25; // Battle_AI.rb:11539
      if(true && ability("lightningrod"))score+=25; // Battle_AI.rb:11540
      if(true && ability("battery"))score+=25; // Battle_AI.rb:11541
      if(ability("transistor"))score+=25; // Battle_AI.rb:11542
      if(p.hasType("Electric"))score+=25; // Battle_AI.rb:11543
      if(ability("electromorphosis"))score+=25; // Battle_AI.rb:11544
      if(true && ability("static"))score+=20; // Battle_AI.rb:11545
      if(true && ability("voltabsorb"))score+=15; // Battle_AI.rb:11546
      break;
    case "GRASSY":
      if(ability("grasspelt"))score+=30; // Battle_AI.rb:11548
      if(ability("cottondown"))score+=30; // Battle_AI.rb:11549
      if(true && ability("overgrow"))score+=30; // Battle_AI.rb:11550
      if(true && ability("sapsipper"))score+=20; // Battle_AI.rb:11551
      if(true && ability("harvest"))score+=25; // Battle_AI.rb:11552
      if(p.hasType("Grass") || p.hasType("Fire"))score+=25; // Battle_AI.rb:11553
      break;
    case "MISTY":
      if(p.hasType("Fairy"))score+=20; // Battle_AI.rb:11555
      if(ability("marvelscale"))score+=20; // Battle_AI.rb:11556
      if(ability("dryskin"))score+=20; // Battle_AI.rb:11557
      if(ability("watercompaction"))score+=20; // Battle_AI.rb:11558
      if(ability("pixilate"))score+=25; // Battle_AI.rb:11559
      if(ability("soulheart"))score+=25; // Battle_AI.rb:11560
      if(ability("pastelveil"))score+=20; // Battle_AI.rb:11561
      break;
    case "DARKCRYSTALCAVERN":
      if(ability("prismarmor"))score+=30; // Battle_AI.rb:11563
      if(ability("shadowshield"))score+=30; // Battle_AI.rb:11564
      break;
    case "CHESS":
      if(ability("adaptability"))score+=10; // Battle_AI.rb:11566
      if(ability("synchronize"))score+=10; // Battle_AI.rb:11567
      if(ability("anticipation"))score+=10; // Battle_AI.rb:11568
      if(ability("telepathy"))score+=10; // Battle_AI.rb:11569
      if(true && ability("stancechange"))score+=30; // Battle_AI.rb:11570
      if(true && ability("stall"))score+=25; // Battle_AI.rb:11571
      break;
    case "BIGTOP":
      if(ability("sheerforce"))score+=30; // Battle_AI.rb:11573
      if(ability("purepower"))score+=30; // Battle_AI.rb:11574
      if(ability("hugepower"))score+=30; // Battle_AI.rb:11575
      if(ability("guts"))score+=30; // Battle_AI.rb:11576
      if(ability("dancer"))score+=10; // Battle_AI.rb:11577
      if(p.hasType("Fighting"))score+=20; // Battle_AI.rb:11578
      if(ability("punkrock") || ability("junglebeat"))score+=20; // Battle_AI.rb:11579
      if(ability("costar") && b.gameType!=="singles")score+=10; // Battle_AI.rb:11580
      break;
    case "BURNING":
      if(p.hasType("Fire"))score+=25; // Battle_AI.rb:11582
      if(ability("waterveil"))score+=15; // Battle_AI.rb:11583
      if(ability("heatproof"))score+=15; // Battle_AI.rb:11584
      if(ability("waterbubble"))score+=15; // Battle_AI.rb:11585
      if(ability("steamengine"))score+=25; // Battle_AI.rb:11586
      if(ability("flashfire"))score+=30; // Battle_AI.rb:11587
      if(ability("flareboost"))score+=30; // Battle_AI.rb:11588
      if(ability("blaze"))score+=30; // Battle_AI.rb:11589
      if(ability("wellbakedbody"))score+=30; // Battle_AI.rb:11590
      if(ability("thermalexchange"))score+=15; // Battle_AI.rb:11591
      if((ability("icebody")))score-=30; // Battle_AI.rb:11592
      if(ability("leafguard"))score-=30; // Battle_AI.rb:11593
      if(ability("grasspelt"))score-=30; // Battle_AI.rb:11594
      if(ability("fluffy"))score-=30; // Battle_AI.rb:11595
      if(ability("iceface"))score-=30; // Battle_AI.rb:11596
      break;
    case "VOLCANIC":
      if(p.hasType("Fire"))score+=25; // Battle_AI.rb:11598
      if(ability("waterveil"))score+=15; // Battle_AI.rb:11599
      if(ability("heatproof"))score+=15; // Battle_AI.rb:11600
      if(ability("waterbubble"))score+=15; // Battle_AI.rb:11601
      if(ability("magmaarmor") || baseAbility("magmaarmor"))score+=20; // Battle_AI.rb:11602
      if(ability("steamengine"))score+=25; // Battle_AI.rb:11603
      if(ability("flashfire"))score+=30; // Battle_AI.rb:11604
      if(ability("flareboost"))score+=30; // Battle_AI.rb:11605
      if(ability("blaze"))score+=30; // Battle_AI.rb:11606
      if((ability("icebody")))score-=30; // Battle_AI.rb:11607
      if(ability("leafguard"))score-=30; // Battle_AI.rb:11608
      if(ability("grasspelt"))score-=30; // Battle_AI.rb:11609
      if(ability("fluffy"))score-=30; // Battle_AI.rb:11610
      if(ability("iceface"))score-=30; // Battle_AI.rb:11611
      break;
    case "SWAMP":
      if(ability("gooey"))score+=15; // Battle_AI.rb:11613
      if(ability("watercompaction"))score+=20; // Battle_AI.rb:11614
      if(ability("propellertail"))score+=15; // Battle_AI.rb:11615
      if(ability("dryskin"))score+=20; // Battle_AI.rb:11616
      if(ability("rattled") || baseAbility("rattled"))score+=10; // Battle_AI.rb:11617
      break;
    case "RAINBOW":
      if(ability("wonderskin"))score+=10; // Battle_AI.rb:11619
      if(ability("marvelscale"))score+=20; // Battle_AI.rb:11620
      if(ability("soulheart"))score+=25; // Battle_AI.rb:11621
      if(ability("cloudnine"))score+=30; // Battle_AI.rb:11622
      if(ability("prismarmor"))score+=30; // Battle_AI.rb:11623
      if(ability("pastelveil"))score+=20; // Battle_AI.rb:11624
      break;
    case "CORROSIVE":
      if(ability("poisonheal"))score+=20; // Battle_AI.rb:11626
      if(ability("toxicboost"))score+=25; // Battle_AI.rb:11627
      if(ability("merciless"))score+=30; // Battle_AI.rb:11628
      if(ability("corrosion"))score+=30; // Battle_AI.rb:11629
      if(ability("toxicchain"))score+=20; // Battle_AI.rb:11630
      if(p.hasType("Poison"))score+=15; // Battle_AI.rb:11631
      break;
    case "CORROSIVEMIST":
      if(ability("watercompaction"))score+=10; // Battle_AI.rb:11633
      if(ability("poisonheal"))score+=20; // Battle_AI.rb:11634
      if(ability("toxicboost"))score+=25; // Battle_AI.rb:11635
      if(ability("merciless"))score+=30; // Battle_AI.rb:11636
      if(ability("corrosion"))score+=30; // Battle_AI.rb:11637
      if(ability("toxicchain"))score+=20; // Battle_AI.rb:11638
      if(p.hasType("Poison"))score+=15; // Battle_AI.rb:11639
      break;
    case "DESERT":
      if(ability("sandstream") || baseAbility("sandstream") || ability("sandspit") || baseAbility("sandspit"))score+=20; // Battle_AI.rb:11641
      if(ability("sandveil"))score+=25; // Battle_AI.rb:11642
      if(ability("sandforce"))score+=30; // Battle_AI.rb:11643
      if(ability("sandrush"))score+=50; // Battle_AI.rb:11644
      if(ability("eartheater"))score+=20; // Battle_AI.rb:11645
      if(p.hasType("Ground"))score+=20; // Battle_AI.rb:11646
      if(p.hasType("Electric"))score-=25; // Battle_AI.rb:11647
      break;
    case "ICY":
      if(p.hasType("Ice"))score+=25; // Battle_AI.rb:11649
      if((ability("icebody")))score+=25; // Battle_AI.rb:11650
      if(ability("snowcloak"))score+=25; // Battle_AI.rb:11651
      if(ability("refrigerate"))score+=25; // Battle_AI.rb:11652
      if(ability("icescales"))score+=20; // Battle_AI.rb:11653
      if(ability("slushrush") || false)score+=50; // Battle_AI.rb:11654
      break;
    case "ROCKY":
      if(ability("gorillatactics"))score-=15; // Battle_AI.rb:11656
      break;
    case "FOREST":
      if(ability("sapsipper"))score+=20; // Battle_AI.rb:11658
      if(p.hasType("Grass") || p.hasType("Bug"))score+=25; // Battle_AI.rb:11659
      if(ability("grasspelt"))score+=30; // Battle_AI.rb:11660
      if(ability("overgrow"))score+=30; // Battle_AI.rb:11661
      if(ability("swarm"))score+=30; // Battle_AI.rb:11662
      if(ability("effectspore"))score+=20; // Battle_AI.rb:11663
      break;
    case "SUPERHEATED":
      if(p.hasType("Fire"))score+=15; // Battle_AI.rb:11665
      break;
    case "VOLCANICTOP":
      if(p.hasType("Fire"))score+=15; // Battle_AI.rb:11667
      if(ability("steamengine"))score+=25; // Battle_AI.rb:11668
      if(ability("iceface"))score-=30; // Battle_AI.rb:11669
      if(ability("galewings") && b.field.isWeather("deltastream"))score+=30; // Battle_AI.rb:11670
      break;
    case "FACTORY":
      if(p.hasType("Electric"))score+=25; // Battle_AI.rb:11672
      if(ability("motordrive"))score+=20; // Battle_AI.rb:11673
      if(ability("steelworker"))score+=20; // Battle_AI.rb:11674
      if(ability("download"))score+=25; // Battle_AI.rb:11675
      if(ability("technician"))score+=25; // Battle_AI.rb:11676
      if(ability("galvanize"))score+=25; // Battle_AI.rb:11677
      break;
    case "SHORTCIRCUIT":
      if(ability("voltabsorb"))score+=20; // Battle_AI.rb:11679
      if(ability("static"))score+=20; // Battle_AI.rb:11680
      if(ability("galvanize"))score+=25; // Battle_AI.rb:11681
      if(ability("surgesurfer"))score+=50; // Battle_AI.rb:11682
      if(true && ability("download"))score+=20; // Battle_AI.rb:11683
      if(p.hasType("Electric"))score+=25; // Battle_AI.rb:11684
      break;
    case "WASTELAND":
      if(p.hasType("Poison"))score+=10; // Battle_AI.rb:11686
      if(ability("corrosion"))score+=10; // Battle_AI.rb:11687
      if(ability("poisonheal"))score+=20; // Battle_AI.rb:11688
      if(ability("effectspore"))score+=20; // Battle_AI.rb:11689
      if(ability("poisonpoint"))score+=20; // Battle_AI.rb:11690
      if(ability("stench"))score+=20; // Battle_AI.rb:11691
      if(ability("gooey"))score+=20; // Battle_AI.rb:11692
      if(ability("toxicboost"))score+=25; // Battle_AI.rb:11693
      if(ability("merciless"))score+=30; // Battle_AI.rb:11694
      break;
    case "ASHENBEACH":
      if(p.hasType("Fighting"))score+=10; // Battle_AI.rb:11696
      if(ability("innerfocus"))score+=15; // Battle_AI.rb:11697
      if(ability("owntempo"))score+=15; // Battle_AI.rb:11698
      if(ability("purepower"))score+=15; // Battle_AI.rb:11699
      if(ability("steadfast"))score+=15; // Battle_AI.rb:11700
      if(ability("stalwart"))score+=15; // Battle_AI.rb:11701
      if(ability("sandstream") || baseAbility("sandstream"))score+=20; // Battle_AI.rb:11702
      if(ability("watercompaction"))score+=20; // Battle_AI.rb:11703
      if(ability("sandforce"))score+=30; // Battle_AI.rb:11704
      if(ability("sandveil"))score+=35; // Battle_AI.rb:11705
      if(ability("sandrush"))score+=50; // Battle_AI.rb:11706
      break;
    case "WATERSURFACE":
      if(p.hasType("Water"))score+=25; // Battle_AI.rb:11708
      if(p.hasType("Electric"))score+=25; // Battle_AI.rb:11709
      if(ability("waterveil"))score+=25; // Battle_AI.rb:11710
      if(ability("hydration"))score+=25; // Battle_AI.rb:11711
      if(ability("torrent"))score+=25; // Battle_AI.rb:11712
      if(ability("schooling"))score+=25; // Battle_AI.rb:11713
      if(ability("watercompaction"))score+=25; // Battle_AI.rb:11714
      if(ability("swiftswim"))score+=50; // Battle_AI.rb:11715
      if(ability("surgesurfer"))score+=50; // Battle_AI.rb:11716
      if(ability("steamengine"))score+=25; // Battle_AI.rb:11717
      if(b.dex.getEffectiveness("Water",p)>0)score-=50; // Battle_AI.rb:11718
      break;
    case "UNDERWATER":
      if(p.hasType("Water"))score+=25; // Battle_AI.rb:11720
      if(p.hasType("Electric"))score+=25; // Battle_AI.rb:11721
      if(ability("waterveil"))score+=25; // Battle_AI.rb:11722
      if(ability("hydration"))score+=25; // Battle_AI.rb:11723
      if(ability("torrent"))score+=25; // Battle_AI.rb:11724
      if(ability("schooling"))score+=25; // Battle_AI.rb:11725
      if(ability("watercompaction"))score+=25; // Battle_AI.rb:11726
      if(ability("swiftswim"))score+=50; // Battle_AI.rb:11727
      if(ability("steamengine"))score+=25; // Battle_AI.rb:11728
      if(b.dex.getEffectiveness("Water",p)>0)score-=50; // Battle_AI.rb:11729
      break;
    case "CAVE":
      if(p.hasType("Ground"))score+=15; // Battle_AI.rb:11731
      break;
    case "GLITCH":
      if(true && ability("download"))score+=20; // Battle_AI.rb:11733
      break;
    case "CRYSTALCAVERN":
      if(p.hasType("Dragon"))score+=25; // Battle_AI.rb:11735
      if(ability("prismarmor"))score+=30; // Battle_AI.rb:11736
      if(ability("teraformzero"))score+=20; // Battle_AI.rb:11737
      if(ability("terashell"))score+=10; // Battle_AI.rb:11738
      break;
    case "MURKWATERSURFACE":
      if(p.hasType("Water"))score+=25; // Battle_AI.rb:11740
      if(p.hasType("Poison"))score+=25; // Battle_AI.rb:11741
      if(p.hasType("Electric"))score+=25; // Battle_AI.rb:11742
      if(ability("schooling"))score+=25; // Battle_AI.rb:11743
      if(ability("watercompaction"))score+=25; // Battle_AI.rb:11744
      if(ability("toxicboost"))score+=25; // Battle_AI.rb:11745
      if(ability("poisonheal"))score+=25; // Battle_AI.rb:11746
      if(ability("merciless"))score+=25; // Battle_AI.rb:11747
      if(ability("swiftswim"))score+=50; // Battle_AI.rb:11748
      if(ability("surgesurfer"))score+=50; // Battle_AI.rb:11749
      if(ability("gooey"))score+=20; // Battle_AI.rb:11750
      if(ability("stench"))score+=20; // Battle_AI.rb:11751
      break;
    case "MOUNTAIN":
      if(p.hasType("Rock"))score+=25; // Battle_AI.rb:11753
      if(p.hasType("Flying"))score+=25; // Battle_AI.rb:11754
      if(["snowwarning","hailwarning"].some(a=>ability(a)||baseAbility(a)))score+=20; // Battle_AI.rb:11755
      if(ability("drought") || baseAbility("drought"))score+=20; // Battle_AI.rb:11756
      if(ability("longreach"))score+=25; // Battle_AI.rb:11757
      if(ability("galewings") && b.field.isWeather("deltastream"))score+=30; // Battle_AI.rb:11758
      if(ability("windrider") && b.field.isWeather("deltastream"))score+=20; // Battle_AI.rb:11759
      if(ability("windpower") && b.field.isWeather("deltastream"))score+=20; // Battle_AI.rb:11760
      break;
    case "SNOWYMOUNTAIN":
      if(p.hasType("Rock"))score+=25; // Battle_AI.rb:11762
      if(p.hasType("Flying"))score+=25; // Battle_AI.rb:11763
      if(p.hasType("Ice"))score+=25; // Battle_AI.rb:11764
      if(["snowwarning","hailwarning"].some(a=>ability(a)||baseAbility(a)))score+=20; // Battle_AI.rb:11765
      if(ability("drought") || baseAbility("drought"))score+=20; // Battle_AI.rb:11766
      if((ability("icebody")))score+=20; // Battle_AI.rb:11767
      if(ability("snowcloak"))score+=20; // Battle_AI.rb:11768
      if(ability("longreach"))score+=25; // Battle_AI.rb:11769
      if(ability("refrigerate"))score+=25; // Battle_AI.rb:11770
      if(ability("galewings") && b.field.isWeather("deltastream"))score+=30; // Battle_AI.rb:11771
      if(ability("windrider") && b.field.isWeather("deltastream"))score+=20; // Battle_AI.rb:11772
      if(ability("windpower") && b.field.isWeather("deltastream"))score+=20; // Battle_AI.rb:11773
      if(ability("icescales"))score+=20; // Battle_AI.rb:11774
      if(ability("slushrush") || false)score+=50; // Battle_AI.rb:11775
      break;
    case "HOLY":
      if(p.hasType("Normal"))score+=20; // Battle_AI.rb:11777
      if(ability("justified"))score+=20; // Battle_AI.rb:11778
      if(ability("powerspot"))score+=25; // Battle_AI.rb:11779
      if(ability("purifyingsalt"))score+=10; // Battle_AI.rb:11780
      break;
    case "MIRROR":
      if(ability("sandveil"))score+=25; // Battle_AI.rb:11782
      if(ability("snowcloak"))score+=25; // Battle_AI.rb:11783
      if(ability("illusion"))score+=25; // Battle_AI.rb:11784
      if(ability("tangledfeet"))score+=25; // Battle_AI.rb:11785
      if(ability("magicbounce"))score+=25; // Battle_AI.rb:11786
      if(ability("colorchange"))score+=25; // Battle_AI.rb:11787
      if(ability("mirrorarmor"))score+=25; // Battle_AI.rb:11788
      break;
    case "FAIRYTALE":
      if(p.hasType("Fairy"))score+=25; // Battle_AI.rb:11790
      if(p.hasType("Steel"))score+=25; // Battle_AI.rb:11791
      if(p.hasType("Dragon"))score+=40; // Battle_AI.rb:11792
      if(ability("powerofalchemy"))score+=25; // Battle_AI.rb:11793
      if(ability("mirrorarmor") || baseAbility("mirrorarmor"))score+=25; // Battle_AI.rb:11794
      if(ability("pastelveil"))score+=25; // Battle_AI.rb:11795
      if(ability("magicguard") || baseAbility("magicguard"))score+=25; // Battle_AI.rb:11796
      if(ability("magicbounce"))score+=25; // Battle_AI.rb:11797
      if(ability("fairyaura"))score+=25; // Battle_AI.rb:11798
      if(ability("battlearmor") || baseAbility("battlearmor"))score+=25; // Battle_AI.rb:11799
      if(ability("shellarmor") || baseAbility("shellarmor"))score+=25; // Battle_AI.rb:11800
      if(ability("armortail") || baseAbility("armortail"))score+=25; // Battle_AI.rb:11801
      if(ability("magician"))score+=25; // Battle_AI.rb:11802
      if(ability("marvelscale"))score+=25; // Battle_AI.rb:11803
      if(ability("stancechange"))score+=30; // Battle_AI.rb:11804
      if(ability("dauntlessshield"))score+=30; // Battle_AI.rb:11805
      if(ability("intrepidsword"))score+=30; // Battle_AI.rb:11806
      break;
    case "DRAGONSDEN":
      if(p.hasType("Fire"))score+=25; // Battle_AI.rb:11808
      if(p.hasType("Dragon"))score+=50; // Battle_AI.rb:11809
      if(ability("marvelscale"))score+=20; // Battle_AI.rb:11810
      if(ability("multiscale"))score+=20; // Battle_AI.rb:11811
      if(ability("dragonsmaw"))score+=25; // Battle_AI.rb:11812
      if(ability("dragonize"))score+=25; // Battle_AI.rb:11813
      if(ability("goodasgold"))score+=20; // Battle_AI.rb:11814
      if(ability("magmaarmor") || baseAbility("magmaarmor"))score+=20; // Battle_AI.rb:11815
      break;
    case "FLOWERGARDEN1":
    case "FLOWERGARDEN2":
    case "FLOWERGARDEN3":
    case "FLOWERGARDEN4":
    case "FLOWERGARDEN5":
      if(p.hasType("Grass"))score+=25; // Battle_AI.rb:11817
      if(p.hasType("Bug"))score+=25; // Battle_AI.rb:11818
      if(ability("flowergift"))score+=20; // Battle_AI.rb:11819
      if(ability("flowerveil"))score+=20; // Battle_AI.rb:11820
      if(ability("drought") || baseAbility("drought"))score+=20; // Battle_AI.rb:11821
      if(ability("drizzle") || baseAbility("drizzle"))score+=20; // Battle_AI.rb:11822
      if(true && (ability("grassysurge") || baseAbility("grassysurge")))score+=20; // Battle_AI.rb:11823
      if(ability("seedsower") || baseAbility("seedsower"))score+=15; // Battle_AI.rb:11824
      if(ability("ripen"))score+=25; // Battle_AI.rb:11825
      break;
    case "STARLIGHT":
      if(p.hasType("Psychic"))score+=25; // Battle_AI.rb:11827
      if(p.hasType("Fairy"))score+=25; // Battle_AI.rb:11828
      if(p.hasType("Dark"))score+=25; // Battle_AI.rb:11829
      if(ability("marvelscale"))score+=20; // Battle_AI.rb:11830
      if(ability("victorystar"))score+=20; // Battle_AI.rb:11831
      if(ability("illuminate") || baseAbility("illuminate"))score+=25; // Battle_AI.rb:11832
      if(ability("shadowshield"))score+=30; // Battle_AI.rb:11833
      break;
    case "NEWWORLD":
      if(p.hasType("Flying"))score+=25; // Battle_AI.rb:11835
      if(p.hasType("Dark"))score+=25; // Battle_AI.rb:11836
      if(ability("victorystar"))score+=20; // Battle_AI.rb:11837
      if(["levitate","eelevate","solaridol","lunaridol","gravitycontrol"].some(ability))score+=25; // Battle_AI.rb:11838
      if(ability("shadowshield"))score+=30; // Battle_AI.rb:11839
      break;
    case "INVERSE":
      if(p.hasType("Normal"))score+=10; // Battle_AI.rb:11841
      if(p.hasType("Ice"))score+=10; // Battle_AI.rb:11842
      if(p.hasType("Fire"))score-=10; // Battle_AI.rb:11843
      if(p.hasType("Steel"))score-=30; // Battle_AI.rb:11844
      break;
    case "PSYTERRAIN":
      if(p.hasType("Psychic"))score+=25; // Battle_AI.rb:11846
      if(ability("purepower"))score+=20; // Battle_AI.rb:11847
      if(ability("anticipation") || baseAbility("anticipation"))score+=20; // Battle_AI.rb:11848
      if(true && (ability("forewarn") || baseAbility("forewarn")))score+=20; // Battle_AI.rb:11849
      if(ability("telepathy"))score+=50; // Battle_AI.rb:11850
      if(ability("powerspot"))score+=25; // Battle_AI.rb:11851
      if(ability("mindseye"))score+=10; // Battle_AI.rb:11852
      break;
    case "DIMENSIONAL":
      if(p.hasType("Dark"))score+=25; // Battle_AI.rb:11854
      if(ability("shadowshield"))score+=30; // Battle_AI.rb:11855
      if(ability("beastboost"))score+=30; // Battle_AI.rb:11856
      if(ability("perishbody"))score+=30; // Battle_AI.rb:11857
      if(ability("rattled") || baseAbility("rattled"))score+=20; // Battle_AI.rb:11858
      if(ability("berserk") || baseAbility("berserk"))score+=20; // Battle_AI.rb:11859
      if(ability("angerpoint") || baseAbility("angerpoint"))score+=20; // Battle_AI.rb:11860
      if(ability("justified") || baseAbility("justified"))score+=20; // Battle_AI.rb:11861
      if(["pressure","unnerve","asonechilling","asonegrim"].some(a=>ability(a)||baseAbility(a)))score+=20; // Battle_AI.rb:11862
      break;
    case "FROZENDIMENSION":
      if(p.hasType("Ice"))score+=25; // Battle_AI.rb:11864
      if(p.hasType("Dark"))score+=25; // Battle_AI.rb:11865
      if((ability("icebody")))score+=25; // Battle_AI.rb:11866
      if(ability("snowcloak"))score+=25; // Battle_AI.rb:11867
      if(ability("refrigerate"))score+=25; // Battle_AI.rb:11868
      if(ability("slushrush") || false)score+=50; // Battle_AI.rb:11869
      if(ability("iceface"))score+=25; // Battle_AI.rb:11870
      if(ability("rattled") || baseAbility("rattled"))score+=20; // Battle_AI.rb:11871
      if(ability("berserk") || baseAbility("berserk"))score+=20; // Battle_AI.rb:11872
      if(ability("angerpoint") || baseAbility("angerpoint"))score+=20; // Battle_AI.rb:11873
      if(ability("justified") || baseAbility("justified"))score+=20; // Battle_AI.rb:11874
      if(["pressure","unnerve","asonechilling","asonegrim"].some(a=>ability(a)||baseAbility(a)))score+=20; // Battle_AI.rb:11875
      break;
    case "HAUNTED":
      if(p.hasType("Ghost"))score+=25; // Battle_AI.rb:11877
      if(ability("rattled"))score+=25; // Battle_AI.rb:11878
      if(ability("cursedbody"))score+=15; // Battle_AI.rb:11879
      if(ability("perishbody"))score+=25; // Battle_AI.rb:11880
      if(ability("powerspot"))score+=25; // Battle_AI.rb:11881
      break;
    case "CORRUPTED":
      if(p.hasType("Poison"))score+=25; // Battle_AI.rb:11883
      if(["grasspelt","leafguard","flowerveil"].some(ability))score-=25; // Battle_AI.rb:11884
      if(ability("poisonheal"))score+=25; // Battle_AI.rb:11885
      if(["wonderskin","immunity","pastelveil"].some(ability))score+=15; // Battle_AI.rb:11886
      if(["poisontouch","poisonpoint"].some(ability))score+=15; // Battle_AI.rb:11887
      if(ability("liquidooze"))score+=15; // Battle_AI.rb:11888
      if(["toxicboost","corrosion"].some(ability))score+=30; // Battle_AI.rb:11889
      if(ability("dryskin") && (p.hasType("Poison")))score+=25; // Battle_AI.rb:11891
      if(ability("dryskin") && (!p.hasType("Poison")))score-=25; // Battle_AI.rb:11892
      break;
    case "BEWITCHED":
      if(ability("flowerveil"))score+=20; // Battle_AI.rb:11895
      if(p.hasType("Grass") || p.hasType("Fairy"))score+=25; // Battle_AI.rb:11896
      if(ability("naturalcure"))score+=25; // Battle_AI.rb:11897
      if(ability("pastelveil"))score+=25; // Battle_AI.rb:11898
      if(ability("cottondown"))score+=25; // Battle_AI.rb:11899
      if(ability("powerspot"))score+=25; // Battle_AI.rb:11900
      if(ability("effectspore"))score+=20; // Battle_AI.rb:11901
      break;
    case "SKY":
      if(ability("earlybird"))score+=15; // Battle_AI.rb:11903
      if(ability("cloudnine"))score+=15; // Battle_AI.rb:11904
      if(p.hasType("Flying"))score+=25; // Battle_AI.rb:11905
      if(ability("galewings"))score+=25; // Battle_AI.rb:11906
      if(ability("bigpecks") || baseAbility("bigpecks"))score+=25; // Battle_AI.rb:11907
      if(["levitate","eelevate","solaridol","lunaridol","gravitycontrol"].some(a=>ability(a)||baseAbility(a)))score+=25; // Battle_AI.rb:11908
      if(ability("aerilate"))score+=25; // Battle_AI.rb:11909
      if(ability("longreach"))score+=30; // Battle_AI.rb:11910
      break;
    case "INFERNAL":
      if(p.hasType("Fire"))score+=25; // Battle_AI.rb:11912
      if(p.hasType("Dark"))score+=25; // Battle_AI.rb:11913
      if(ability("perishbody"))score+=25; // Battle_AI.rb:11914
      if(ability("magmaarmor") || baseAbility("magmaarmor"))score+=30; // Battle_AI.rb:11915
      if(ability("flamebody") || baseAbility("flamebody"))score+=20; // Battle_AI.rb:11916
      if(ability("desolateland") || baseAbility("desolateland"))score+=20; // Battle_AI.rb:11917
      if(ability("steamengine"))score+=25; // Battle_AI.rb:11918
      if(ability("flashfire"))score+=30; // Battle_AI.rb:11919
      if(ability("flareboost"))score+=30; // Battle_AI.rb:11920
      if(ability("blaze"))score+=30; // Battle_AI.rb:11921
      if(ability("pastelveil"))score-=20; // Battle_AI.rb:11922
      if(ability("iceface"))score-=30; // Battle_AI.rb:11923
      break;
    case "COLOSSEUM":
      if(ability("stalwart"))score+=15; // Battle_AI.rb:11925
      if(ability("defiant"))score+=20; // Battle_AI.rb:11926
      if(ability("competitive"))score+=20; // Battle_AI.rb:11927
      if(ability("rattled") || ability("wimpout"))score-=30; // Battle_AI.rb:11928
      if(ability("wonderguard"))score+=25; // Battle_AI.rb:11929
      if(ability("quickdraw"))score+=25; // Battle_AI.rb:11930
      if(ability("emergencyexit"))score+=25; // Battle_AI.rb:11931
      if(ability("battlearmor") || baseAbility("battlearmor"))score+=25; // Battle_AI.rb:11932
      if(ability("shellarmor") || baseAbility("shellarmor"))score+=25; // Battle_AI.rb:11933
      if(ability("mirrorarmor") || baseAbility("mirrorarmor"))score+=25; // Battle_AI.rb:11934
      if(ability("magicguard") || baseAbility("magicguard"))score+=25; // Battle_AI.rb:11935
      if(ability("skilllink"))score+=25; // Battle_AI.rb:11936
      if(ability("noguard") || baseAbility("noguard"))score+=30; // Battle_AI.rb:11937
      if(ability("dauntlessshield"))score+=50; // Battle_AI.rb:11938
      if(ability("intrepidsword"))score+=50; // Battle_AI.rb:11939
      break;
    case "CONCERT1":
    case "CONCERT2":
    case "CONCERT3":
    case "CONCERT4":
      if(ability("technician"))score+=25; // Battle_AI.rb:11941
      if(["heavymetal","solidrock","punkrock","rockhead","soundproof"].some(ability))score+=25; // Battle_AI.rb:11942
      if(["heavymetal","solidrock","punkrock","galvanize","plus"].some(ability) && (stage>=1 && stage<=3))score+=15; // Battle_AI.rb:11943
      if(["klutz","minus"].some(ability) && (stage>=2 && stage<=4))score-=15; // Battle_AI.rb:11944
      if(["runaway","emergencyexit"].some(ability) && (stage>=2 && stage<=4))score+=25; // Battle_AI.rb:11945
      if(ability("rattled") && (stage>=3 && stage<=4))score+=30; // Battle_AI.rb:11946
      break;
    case "BACKALLEY":
      if(p.hasType("Dark"))score+=25; // Battle_AI.rb:11948
      if(p.hasType("Poison"))score+=20; // Battle_AI.rb:11949
      if(p.hasType("Bug"))score+=20; // Battle_AI.rb:11950
      if(p.hasType("Steel"))score+=20; // Battle_AI.rb:11951
      if(p.hasType("Fairy"))score-=25; // Battle_AI.rb:11952
      if(ability("stench"))score+=20; // Battle_AI.rb:11953
      if(ability("download"))score+=25; // Battle_AI.rb:11954
      if(ability("pickpocket") || baseAbility("pickpocket"))score+=25; // Battle_AI.rb:11955
      if(ability("merciless") || baseAbility("merciless"))score+=25; // Battle_AI.rb:11956
      if(ability("magician") || baseAbility("magician"))score+=25; // Battle_AI.rb:11957
      if(ability("anticipation") || baseAbility("anticipation"))score+=25; // Battle_AI.rb:11958
      if(ability("forewarn") || baseAbility("forewarn"))score+=25; // Battle_AI.rb:11959
      if(ability("rattled") || baseAbility("rattled"))score+=25; // Battle_AI.rb:11960
      if(ability("defiant"))score+=20; // Battle_AI.rb:11961
      break;
    case "CITY":
      if(p.hasType("Normal"))score+=25; // Battle_AI.rb:11963
      if(p.hasType("Poison"))score+=20; // Battle_AI.rb:11964
      if(p.hasType("Bug"))score+=20; // Battle_AI.rb:11965
      if(p.hasType("Steel"))score+=20; // Battle_AI.rb:11966
      if(p.hasType("Fairy"))score-=20; // Battle_AI.rb:11967
      if(ability("stench"))score+=20; // Battle_AI.rb:11968
      if(ability("download"))score+=25; // Battle_AI.rb:11969
      if(ability("bigpecks") || baseAbility("bigpecks"))score+=25; // Battle_AI.rb:11970
      if(ability("pickup") || baseAbility("pickup"))score+=25; // Battle_AI.rb:11971
      if(ability("earlybird") || baseAbility("earlybird"))score+=25; // Battle_AI.rb:11972
      if(ability("rattled") || baseAbility("rattled"))score+=25; // Battle_AI.rb:11973
      if(ability("hustle"))score+=20; // Battle_AI.rb:11974
      if(ability("frisk") || baseAbility("frisk"))score+=20; // Battle_AI.rb:11975
      if(ability("competitive"))score+=20; // Battle_AI.rb:11976
      break;
    case "CLOUDS":
      if(p.hasType("Flying"))score+=25; // Battle_AI.rb:11978
      if(ability("cloudnine"))score+=20; // Battle_AI.rb:11979
      if(ability("fluffy"))score+=20; // Battle_AI.rb:11980
      if(ability("bigpecks"))score+=20; // Battle_AI.rb:11981
      if(ability("earlybird"))score+=20; // Battle_AI.rb:11982
      if(ability("windpower"))score+=20; // Battle_AI.rb:11983
      if(ability("voltabsorb") && b.field.isWeather("raindance"))score+=20; // Battle_AI.rb:11984
      if(ability("lightningrod") && b.field.isWeather("raindance"))score+=20; // Battle_AI.rb:11985
      if(ability("motordrive") && b.field.isWeather("raindance"))score+=20; // Battle_AI.rb:11986
      if(ability("snowcloak") && b.field.isWeather(["hail","snow"]))score+=20; // Battle_AI.rb:11987
      if(ability("icebody") && b.field.isWeather(["hail","snow"]))score+=20; // Battle_AI.rb:11988
      if(ability("forecast"))score+=20; // Battle_AI.rb:11989
      if(ability("overcoat"))score+=20; // Battle_AI.rb:11990
      break;
    case "DARKNESS1":
      if(p.hasType("Dark"))score+=10; // Battle_AI.rb:11992
      if(ability("darkaura"))score+=10; // Battle_AI.rb:11993
      if(ability("fairyaura"))score-=10; // Battle_AI.rb:11994
      if(ability("rattled"))score+=20; // Battle_AI.rb:11995
      break;
    case "DARKNESS2":
      if(p.hasType("Dark"))score+=20; // Battle_AI.rb:11997
      if(ability("darkaura"))score+=20; // Battle_AI.rb:11998
      if(ability("fairyaura"))score-=20; // Battle_AI.rb:11999
      if(ability("rattled"))score+=20; // Battle_AI.rb:12000
      if(ability("insomnia"))score-=20; // Battle_AI.rb:12001
      if(ability("baddreams"))score+=20; // Battle_AI.rb:12002
      if(ability("shadowshield"))score+=20; // Battle_AI.rb:12003
      if(ability("pickpocket"))score+=20; // Battle_AI.rb:12004
      break;
    case "DARKNESS3":
      if(p.hasType("Dark"))score+=40; // Battle_AI.rb:12006
      if(ability("darkaura"))score+=40; // Battle_AI.rb:12007
      if(ability("fairyaura"))score-=40; // Battle_AI.rb:12008
      if(ability("rattled"))score+=40; // Battle_AI.rb:12009
      if(ability("insomnia"))score-=40; // Battle_AI.rb:12010
      if(ability("baddreams"))score+=40; // Battle_AI.rb:12011
      if(ability("shadowshield"))score+=40; // Battle_AI.rb:12012
      if(ability("pickpocket"))score+=40; // Battle_AI.rb:12013
      break;
    case "DANCEFLOOR":
      if(ability("insomnia"))score+=20; // Battle_AI.rb:12015
      if(ability("magicguard"))score+=20; // Battle_AI.rb:12016
      if(ability("magician"))score+=10; // Battle_AI.rb:12017
      if(ability("dancer"))score+=40; // Battle_AI.rb:12018
      if(ability("illuminate"))score+=20; // Battle_AI.rb:12019
      break;
    case "CROWD":
      if(ability("guts"))score+=20; // Battle_AI.rb:12021
      if(ability("innerfocus"))score+=10; // Battle_AI.rb:12022
      if(ability("intimidate"))score+=30; // Battle_AI.rb:12023
      if(ability("ironfist"))score+=20; // Battle_AI.rb:12024
      break;
    }return score/100;
  }
  // END GENERATED SOURCE AI AFFINITY
  // BEGIN GENERATED SOURCE AI DISRUPTION
  // Battle_AI.rb getFieldDisruptScore: field preference of the current matchup (1 is neutral, higher favours the
  // opponent). Strategic weights only; every battle mechanic still comes from the simulator.
  function sourceDisruptionScore(V,original,overlay=false,violent=false){
    const A=V.attacker,O=V.opponent,AP=V.attackerPartner,OP=V.opponentPartner;
    const type=(p,t)=>!!p && p.types.includes(t),party=t=>V.partyTypes.includes(t);
    const ability=(p,a)=>!!p && p.ability===a,hasMove=(p,moves)=>!!p && moves.some(m=>p.moves.includes(m));
    const role=(p,r)=>!!p && p.roles.includes(r);
    let score=100,ratio1=0,ratio2=0,oratio1=0,oratio2=0;
    switch(original){
    case "INDOOR":
      break;
    case "ELECTERRAIN":
      if(type(O,"Electric") || type(OP,"Electric"))score*=1.5; // Battle_AI.rb:9780
      if(type(A,"Electric"))score*=0.5; // Battle_AI.rb:9781
      if(party("Electric"))score*=0.5; // Battle_AI.rb:9782
      if(ability(O,"surgesurfer"))score*=1.3; // Battle_AI.rb:9783
      if(ability(A,"surgesurfer"))score*=0.7; // Battle_AI.rb:9784
      break;
    case "GRASSY":
      if(type(O,"Grass") || type(OP,"Grass"))score*=1.5; // Battle_AI.rb:9786
      if(type(A,"Grass"))score*=0.5; // Battle_AI.rb:9787
      if(party("Grass"))score*=0.5; // Battle_AI.rb:9788
      if(!overlay){
        if(type(O,"Fire") || type(OP,"Fire"))score*=1.8; // Battle_AI.rb:9790
        if(type(A,"Fire"))score*=0.2; // Battle_AI.rb:9791
        if(party("Fire"))score*=0.2; // Battle_AI.rb:9792
      }
      if(type(A,"Water"))score*=1.3; // Battle_AI.rb:9794
      if(party("Water"))score*=1.5; // Battle_AI.rb:9795
      if(role(A,"SPECIALWALL") || role(A,"PHYSICALWALL"))score*=0.8; // Battle_AI.rb:9796
      if(role(O,"SPECIALWALL") || role(O,"PHYSICALWALL"))score*=1.2; // Battle_AI.rb:9797
      break;
    case "MISTY":
      if(!overlay){
        if(A.spa > A.atk && (type(O,"Fairy") || type(OP,"Fairy")))score*=1.3; // Battle_AI.rb:9800
        if(type(A,"Fairy") && O.spa > O.atk)score*=0.7; // Battle_AI.rb:9801
        if(type(O,"Dragon") || type(OP,"Dragon"))score*=0.5; // Battle_AI.rb:9802
        if(type(A,"Dragon"))score*=1.5; // Battle_AI.rb:9803
        if(party("Dragon"))score*=1.5; // Battle_AI.rb:9804
        if(V.counter===1 && !(type(A,"Poison") || type(A,"Steel")))score*=1.8; // Battle_AI.rb:9805
      }
      if(party("Fairy"))score*=0.7; // Battle_AI.rb:9807
      break;
    case "DARKCRYSTALCAVERN":
      if(type(O,"Dark") || type(OP,"Dark") || type(O,"Ghost") || type(OP,"Ghost"))score*=1.3; // Battle_AI.rb:9809
      if(type(A,"Dark") || type(A,"Ghost"))score*=0.7; // Battle_AI.rb:9810
      if(party("Dark") || party("Ghost"))score*=0.7; // Battle_AI.rb:9811
      break;
    case "CHESS":
      if(type(O,"Psychic") || type(OP,"Psychic"))score*=1.3; // Battle_AI.rb:9813
      if(type(A,"Psychic"))score*=0.7; // Battle_AI.rb:9814
      if(party("Psychic"))score*=0.7; // Battle_AI.rb:9815
      score*=(A.speed>O.speed?1.3:0.7); // Battle_AI.rb:9816
      break;
    case "BIGTOP":
      if(type(O,"Fighting") || type(OP,"Fighting"))score*=1.5; // Battle_AI.rb:9818
      if(type(A,"Fighting"))score*=0.5; // Battle_AI.rb:9819
      if(party("Fighting"))score*=0.5; // Battle_AI.rb:9820
      if(ability(O,"dancer"))score*=1.5; // Battle_AI.rb:9821
      if(ability(A,"dancer"))score*=0.5; // Battle_AI.rb:9822
      if(hasMove(A,["sing","dragondance","quiverdance"]))score*=0.5; // Battle_AI.rb:9823
      if(hasMove(O,["sing","dragondance","quiverdance"]))score*=1.5; // Battle_AI.rb:9824
      break;
    case "SWAMP":
      if(hasMove(A,["sleeppowder"]))score*=0.7; // Battle_AI.rb:9836
      if(hasMove(O,["sleeppowder"]))score*=1.3; // Battle_AI.rb:9837
      break;
    case "RAINBOW":
      if(type(O,"Normal") || type(OP,"Normal"))score*=1.5; // Battle_AI.rb:9839
      if(type(A,"Normal"))score*=0.5; // Battle_AI.rb:9840
      if(party("Normal"))score*=0.5; // Battle_AI.rb:9841
      if(ability(O,"cloudnine"))score*=1.4; // Battle_AI.rb:9842
      if(ability(A,"cloudnine"))score*=0.6; // Battle_AI.rb:9843
      if(hasMove(A,["sonicboom"]))score*=0.8; // Battle_AI.rb:9844
      if(hasMove(O,["sonicboom"]))score*=1.2; // Battle_AI.rb:9845
      break;
    case "CORROSIVE":
      if(type(O,"Poison") || type(OP,"Poison"))score*=1.3; // Battle_AI.rb:9847
      if(type(A,"Poison"))score*=0.7; // Battle_AI.rb:9848
      if(party("Poison"))score*=0.7; // Battle_AI.rb:9849
      if(ability(O,"corrosion"))score*=1.5; // Battle_AI.rb:9850
      if(ability(A,"corrosion"))score*=0.5; // Battle_AI.rb:9851
      if(hasMove(A,["sleeppowder"]))score*=0.7; // Battle_AI.rb:9852
      if(hasMove(O,["sleeppowder"]))score*=1.3; // Battle_AI.rb:9853
      break;
    case "CORROSIVEMIST":
      if(violent){
        if(!O.protect && !O.skyDrop && !(O.semiInvulnerable && V.attackerFaster) && !ability(O,"flashfire")){
          if(A.hp/A.maxhp < 0.2)score*=2; // Battle_AI.rb:9859
          if(V.opponentReserves===0)score*=5; // Battle_AI.rb:9860
        }
      }
      if(type(O,"Poison") || type(OP,"Poison"))score*=1.3; // Battle_AI.rb:9863
      if(type(A,"Poison")){
        score*=0.7; // Battle_AI.rb:9865
      }else if(!type(A,"Steel")){
        score*=1.4; // Battle_AI.rb:9867
      }
      if(!party("Poison"))score*=1.4; // Battle_AI.rb:9869
      if(ability(O,"corrosion"))score*=1.5; // Battle_AI.rb:9870
      if(ability(A,"corrosion"))score*=0.5; // Battle_AI.rb:9871
      if(type(O,"Fire") || type(OP,"Fire"))score*=1.5; // Battle_AI.rb:9872
      if(type(A,"Fire"))score*=0.8; // Battle_AI.rb:9873
      if(party("Fire"))score*=0.8; // Battle_AI.rb:9874
      break;
    case "DESERT":
      if(A.spa > A.atk && (type(O,"Ground") || type(OP,"Ground")))score*=1.3; // Battle_AI.rb:9876
      if(O.spa > O.atk && (type(A,"Ground")))score*=0.7; // Battle_AI.rb:9877
      if(type(A,"Electric") || type(A,"Water"))score*=1.5; // Battle_AI.rb:9878
      if(type(O,"Electric") || type(OP,"Water"))score*=0.5; // Battle_AI.rb:9879
      if(party("Ground"))score*=0.7; // Battle_AI.rb:9880
      if(party("Water") || party("Electric"))score*=1.5; // Battle_AI.rb:9881
      if(ability(O,"sandrush") && V.weather!=="sandstorm")score*=1.3; // Battle_AI.rb:9882
      if(ability(A,"sandrush") && V.weather!=="sandstorm")score*=0.7; // Battle_AI.rb:9883
      break;
    case "ICY":
      if(type(O,"Ice") || type(OP,"Ice"))score*=1.3; // Battle_AI.rb:9885
      if(type(A,"Ice"))score*=0.5; // Battle_AI.rb:9886
      if(party("Ice"))score*=0.5; // Battle_AI.rb:9887
      if(type(O,"Fire") || type(OP,"Fire"))score*=0.5; // Battle_AI.rb:9888
      if(type(A,"Fire"))score*=1.1; // Battle_AI.rb:9889
      if(party("Fire"))score*=1.1; // Battle_AI.rb:9890
      if(ability(O,"icescales"))score*=1.3; // Battle_AI.rb:9891
      if(ability(A,"icescales"))score*=0.7; // Battle_AI.rb:9892
      if((ability(O,"slushrush") || false || false) && !["hail","snow"].includes(V.weather))score*=1.3; // Battle_AI.rb:9893
      if((ability(A,"slushrush") || false || false) && !["hail","snow"].includes(V.weather))score*=0.7; // Battle_AI.rb:9894
      break;
    case "ROCKY":
      if(type(O,"Rock") || type(OP,"Rock"))score*=1.5; // Battle_AI.rb:9896
      if(type(A,"Rock"))score*=0.5; // Battle_AI.rb:9897
      if(party("Rock"))score*=0.5; // Battle_AI.rb:9898
      break;
    case "FOREST":
      if(type(O,"Grass") || type(O,"Bug") || type(OP,"Grass") || type(OP,"Bug"))score*=1.5; // Battle_AI.rb:9900
      if(type(A,"Grass") || type(A,"Bug"))score*=0.5; // Battle_AI.rb:9901
      if(party("Grass") || party("Bug"))score*=0.5; // Battle_AI.rb:9902
      if(type(O,"Fire") || type(OP,"Fire"))score*=1.8; // Battle_AI.rb:9903
      if(type(A,"Fire"))score*=0.2; // Battle_AI.rb:9904
      if(party("Fire"))score*=0.2; // Battle_AI.rb:9905
      break;
    case "FACTORY":
      if(type(O,"Electric") || type(OP,"Electric"))score*=1.2; // Battle_AI.rb:9917
      if(type(A,"Electric"))score*=0.8; // Battle_AI.rb:9918
      if(party("Electric"))score*=0.8; // Battle_AI.rb:9919
      break;
    case "SHORTCIRCUIT":
      if(type(O,"Electric") || type(OP,"Electric"))score*=1.4; // Battle_AI.rb:9921
      if(type(A,"Electric"))score*=0.6; // Battle_AI.rb:9922
      if(party("Electric"))score*=0.6; // Battle_AI.rb:9923
      if(ability(O,"surgesurfer"))score*=1.3; // Battle_AI.rb:9924
      if(ability(A,"surgesurfer"))score*=0.7; // Battle_AI.rb:9925
      if(type(O,"Dark") || type(OP,"Dark") || type(O,"Ghost") || type(OP,"Ghost"))score*=1.3; // Battle_AI.rb:9926
      if(type(A,"Dark") || type(A,"Ghost"))score*=0.7; // Battle_AI.rb:9927
      if(party("Dark") || party("Ghost"))score*=0.7; // Battle_AI.rb:9928
      break;
    case "WASTELAND":
      if(type(O,"Poison") || type(OP,"Poison"))score*=1.3; // Battle_AI.rb:9930
      if(type(A,"Poison"))score*=0.7; // Battle_AI.rb:9931
      if(party("Poison"))score*=0.7; // Battle_AI.rb:9932
      break;
    case "ASHENBEACH":
      if(type(O,"Fighting") || type(OP,"Fighting") || type(O,"Psychic") || type(OP,"Psychic"))score*=1.3; // Battle_AI.rb:9934
      if(type(A,"Fighting") || type(A,"Psychic"))score*=0.7; // Battle_AI.rb:9935
      if(party("Fighting") || party("Psychic"))score*=0.7; // Battle_AI.rb:9936
      if(ability(O,"sandrush") && V.weather!=="sandstorm")score*=1.3; // Battle_AI.rb:9937
      if(ability(A,"sandrush") && V.weather!=="sandstorm")score*=0.7; // Battle_AI.rb:9938
      break;
    case "WATERSURFACE":
      if(type(O,"Water") || type(OP,"Water"))score*=1.6; // Battle_AI.rb:9940
      if(type(A,"Water")){
        score*=0.4; // Battle_AI.rb:9942
      }else if(!A.airborne){
        score*=1.3; // Battle_AI.rb:9944
      }
      if(party("Water"))score*=0.4; // Battle_AI.rb:9946
      if(ability(O,"swiftswim") && V.weather!=="raindance")score*=1.3; // Battle_AI.rb:9947
      if(ability(A,"swiftswim") && V.weather!=="raindance")score*=0.7; // Battle_AI.rb:9948
      if(ability(O,"surgesurfer"))score*=1.3; // Battle_AI.rb:9949
      if(ability(A,"surgesurfer"))score*=0.7; // Battle_AI.rb:9950
      if(!type(A,"Poison") && V.counter===1)score*=1.3; // Battle_AI.rb:9951
      break;
    case "UNDERWATER":
      if(type(O,"Water") || type(OP,"Water"))score*=2.0; // Battle_AI.rb:9953
      if(type(A,"Water")){
        score*=0.1; // Battle_AI.rb:9955
      }else{
        score*=1.5; // Battle_AI.rb:9957
        if(type(A,"Rock") || type(A,"Ground"))score*=2; // Battle_AI.rb:9958
      }
      if(A.atk > A.spa)score*=1.2; // Battle_AI.rb:9960
      if(O.atk > O.spa)score*=0.8; // Battle_AI.rb:9961
      if(party("Water"))score*=0.1; // Battle_AI.rb:9962
      if(ability(O,"swiftswim"))score*=0.9; // Battle_AI.rb:9963
      if(ability(A,"swiftswim"))score*=1.1; // Battle_AI.rb:9964
      if(!type(A,"Poison") && V.counter===1)score*=1.3; // Battle_AI.rb:9965
      break;
    case "CAVE":
      if(type(O,"Rock") || type(OP,"Rock"))score*=1.5; // Battle_AI.rb:9967
      if(type(A,"Rock"))score*=0.5; // Battle_AI.rb:9968
      if(party("Rock"))score*=0.5; // Battle_AI.rb:9969
      if(type(O,"Ground") || type(OP,"Ground"))score*=1.2; // Battle_AI.rb:9970
      if(type(A,"Ground"))score*=0.8; // Battle_AI.rb:9971
      if(party("Ground"))score*=0.8; // Battle_AI.rb:9972
      if(type(O,"Flying") || type(OP,"Flying"))score*=0.7; // Battle_AI.rb:9973
      if(type(A,"Flying"))score*=1.3; // Battle_AI.rb:9974
      if(party("Flying"))score*=1.3; // Battle_AI.rb:9975
      break;
    case "GLITCH":
      if(type(A,"Dark") || type(A,"Steel") || type(A,"Fairy"))score*=1.3; // Battle_AI.rb:9977
      if(party("Dark") || party("Steel") || party("Fairy"))score*=1.3; // Battle_AI.rb:9978
      ratio1=A.spa/A.spd; // Battle_AI.rb:9979
      ratio2=A.spd/A.spa; // Battle_AI.rb:9980
      if(ratio1<1){
        score*=ratio1; // Battle_AI.rb:9982
      }else if(ratio2 < 1){
        score*=ratio2; // Battle_AI.rb:9984
      }
      oratio1=O.spa/A.spd; // Battle_AI.rb:9986
      oratio2=O.spd/A.spa; // Battle_AI.rb:9987
      if(oratio1>1){
        score*=oratio1; // Battle_AI.rb:9989
      }else if(oratio2 > 1){
        score*=oratio2; // Battle_AI.rb:9991
      }
      break;
    case "CRYSTALCAVERN":
      if(type(O,"Rock") || type(OP,"Rock") || type(O,"Dragon") || type(OP,"Dragon"))score*=1.5; // Battle_AI.rb:9994
      if(type(A,"Rock") || type(A,"Dragon"))score*=0.5; // Battle_AI.rb:9995
      if(party("Rock") || party("Dragon"))score*=0.5; // Battle_AI.rb:9996
      break;
    case "MURKWATERSURFACE":
      if(type(O,"Water") || type(OP,"Water"))score*=1.6; // Battle_AI.rb:9998
      if(type(A,"Water")){
        score*=0.4; // Battle_AI.rb:10000
      }else if(!A.airborne){
        score*=1.3; // Battle_AI.rb:10002
      }
      if(party("Water"))score*=0.4; // Battle_AI.rb:10004
      if(ability(O,"swiftswim") && V.weather!=="raindance")score*=1.3; // Battle_AI.rb:10005
      if(ability(A,"swiftswim") && V.weather!=="raindance")score*=0.7; // Battle_AI.rb:10006
      if(ability(O,"surgesurfer"))score*=1.3; // Battle_AI.rb:10007
      if(ability(A,"surgesurfer"))score*=0.7; // Battle_AI.rb:10008
      if(type(O,"Steel") || type(OP,"Steel") || type(O,"Poison") || type(OP,"Poison"))score*=1.3; // Battle_AI.rb:10009
      if(type(A,"Poison")){
        score*=0.7; // Battle_AI.rb:10011
      }else if(!type(A,"Steel")){
        score*=1.8; // Battle_AI.rb:10013
      }
      if(party("Poison"))score*=0.7; // Battle_AI.rb:10015
      break;
    case "MOUNTAIN":
      if(type(O,"Rock") || type(OP,"Rock") || type(O,"Flying") || type(OP,"Flying"))score*=1.5; // Battle_AI.rb:10017
      if(type(A,"Rock") || type(A,"Flying"))score*=0.5; // Battle_AI.rb:10018
      if(party("Rock") || party("Flying"))score*=0.5; // Battle_AI.rb:10019
      break;
    case "SNOWYMOUNTAIN":
      if(type(O,"Rock") || type(OP,"Rock") || type(O,"Flying") || type(OP,"Flying") || type(O,"Ice") || type(OP,"Ice"))score*=1.5; // Battle_AI.rb:10021
      if(type(A,"Rock") || type(A,"Flying") || type(A,"Ice"))score*=0.5; // Battle_AI.rb:10022
      if(party("Rock") || party("Flying") || party("Ice"))score*=0.5; // Battle_AI.rb:10023
      if(type(O,"Fire") || type(OP,"Fire"))score*=0.5; // Battle_AI.rb:10024
      if(type(A,"Fire"))score*=1.5; // Battle_AI.rb:10025
      if(party("Fire"))score*=1.5; // Battle_AI.rb:10026
      if(ability(O,"icescales"))score*=1.3; // Battle_AI.rb:10027
      if(ability(A,"icescales"))score*=0.7; // Battle_AI.rb:10028
      if((ability(O,"slushrush") || false || false) && !["hail","snow"].includes(V.weather))score*=1.3; // Battle_AI.rb:10029
      if((ability(A,"slushrush") || false || false) && !["hail","snow"].includes(V.weather))score*=0.7; // Battle_AI.rb:10030
      break;
    case "HOLY":
      if(type(O,"Normal") || type(OP,"Normal") || type(O,"Fairy") || type(OP,"Fairy"))score*=1.4; // Battle_AI.rb:10032
      if(type(A,"Normal") || type(A,"Fairy"))score*=0.6; // Battle_AI.rb:10033
      if(party("Normal") || party("Fairy"))score*=0.6; // Battle_AI.rb:10034
      if(type(O,"Dark") || type(OP,"Dark") || type(O,"Ghost") || type(OP,"Ghost"))score*=0.5; // Battle_AI.rb:10035
      if(type(A,"Dark") || type(A,"Ghost"))score*=1.5; // Battle_AI.rb:10036
      if(party("Dark") || party("Ghost"))score*=1.5; // Battle_AI.rb:10037
      if(type(O,"Dragon") || type(OP,"Dragon") || type(O,"Psychic") || type(OP,"Psychic"))score*=1.2; // Battle_AI.rb:10038
      if(type(A,"Dragon") || type(A,"Psychic"))score*=0.8; // Battle_AI.rb:10039
      if(party("Dragon") || party("Psychic"))score*=0.8; // Battle_AI.rb:10040
      break;
    case "HAUNTED":
      if(type(O,"Ghost") || type(OP,"Ghost") || type(O,"Fire") || type(OP,"Fire"))score*=1.4; // Battle_AI.rb:10042
      if(type(A,"Ghost") || type(A,"Fire"))score*=0.6; // Battle_AI.rb:10043
      if(type(A,"Normal") || type(A,"Psychic") || type(A,"Dragon") || type(A,"Fairy"))score*=1.5; // Battle_AI.rb:10044
      if(party("Normal") || party("Psychic") || party("Dragon") || party("Fairy"))score*=1.5; // Battle_AI.rb:10045
      break;
    case "FAIRYTALE":
      if(type(O,"Dragon") || type(OP,"Dragon") || type(O,"Steel") || type(OP,"Steel") || type(O,"Fairy") || type(OP,"Fairy"))score*=1.5; // Battle_AI.rb:10060
      if(type(A,"Dragon") || type(A,"Steel") || type(A,"Fairy"))score*=0.5; // Battle_AI.rb:10061
      if(party("Dragon") || party("Steel") || party("Fairy"))score*=0.5; // Battle_AI.rb:10062
      if(ability(O,"stancechange"))score*=1.3; // Battle_AI.rb:10063
      if(ability(A,"stancechange"))score*=0.7; // Battle_AI.rb:10064
      break;
    case "DRAGONSDEN":
      if(type(O,"Dragon") || type(OP,"Dragon"))score*=1.7; // Battle_AI.rb:10066
      if(type(A,"Dragon"))score*=0.3; // Battle_AI.rb:10067
      if(party("Dragon"))score*=0.3; // Battle_AI.rb:10068
      if(type(O,"Fire") || type(OP,"Fire"))score*=1.5; // Battle_AI.rb:10069
      if(type(A,"Fire"))score*=0.5; // Battle_AI.rb:10070
      if(party("Fire"))score*=0.5; // Battle_AI.rb:10071
      if(ability(O,"multiscale") || ability(O,"goodasgold"))score*=1.3; // Battle_AI.rb:10072
      if(ability(A,"multiscale") || ability(O,"goodasgold"))score*=0.7; // Battle_AI.rb:10073
      break;
    case "FLOWERGARDEN4":
      if(type(O,"Bug") || type(OP,"Bug") || type(O,"Grass") || type(OP,"Grass"))score*=1.5; // Battle_AI.rb:10075
      if(type(A,"Grass") || type(A,"Bug"))score*=0.33; // Battle_AI.rb:10076
      if(party("Bug") || party("Grass"))score*=0.33; // Battle_AI.rb:10077
      if(type(O,"Fire") || type(OP,"Fire"))score*=1.2; // Battle_AI.rb:10078
      if(type(A,"Fire"))score*=0.33; // Battle_AI.rb:10079
      if(party("Fire"))score*=0.33; // Battle_AI.rb:10080
      break;
    case "FLOWERGARDEN5":
      if(type(O,"Bug") || type(OP,"Bug") || type(O,"Grass") || type(OP,"Grass"))score*=2.0; // Battle_AI.rb:10082
      if(type(A,"Grass") || type(A,"Bug"))score*=0.25; // Battle_AI.rb:10083
      if(party("Bug") || party("Grass"))score*=0.25; // Battle_AI.rb:10084
      if(type(O,"Fire") || type(OP,"Fire"))score*=1.6; // Battle_AI.rb:10085
      if(type(A,"Fire"))score*=0.25; // Battle_AI.rb:10086
      if(party("Fire"))score*=0.25; // Battle_AI.rb:10087
      break;
    case "STARLIGHT":
      if(type(O,"Psychic") || type(OP,"Psychic"))score*=1.5; // Battle_AI.rb:10089
      if(type(A,"Psychic"))score*=0.5; // Battle_AI.rb:10090
      if(party("Psychic"))score*=0.5; // Battle_AI.rb:10091
      if(type(O,"Fairy") || type(OP,"Fairy") || type(O,"Dark") || type(OP,"Dark"))score*=1.3; // Battle_AI.rb:10092
      if(type(A,"Fairy") || type(A,"Dark"))score*=0.7; // Battle_AI.rb:10093
      if(party("Fairy") || party("Dark"))score*=0.7; // Battle_AI.rb:10094
      break;
    case "NEWWORLD":
      break;
    case "INVERSE":
      if(type(O,"Normal") || type(OP,"Normal"))score*=1.7; // Battle_AI.rb:10098
      if(type(A,"Normal"))score*=0.3; // Battle_AI.rb:10099
      if(party("Normal"))score*=0.3; // Battle_AI.rb:10100
      if(type(O,"Ice") || type(OP,"Ice"))score*=1.5; // Battle_AI.rb:10101
      if(type(A,"Ice"))score*=0.5; // Battle_AI.rb:10102
      if(party("Ice"))score*=0.5; // Battle_AI.rb:10103
      break;
    case "PSYTERRAIN":
      if(type(O,"Psychic") || type(OP,"Psychic"))score*=1.7; // Battle_AI.rb:10105
      if(type(A,"Psychic"))score*=0.3; // Battle_AI.rb:10106
      if(party("Psychic"))score*=0.3; // Battle_AI.rb:10107
      if(!overlay){
        if(ability(O,"telepathy"))score*=1.3; // Battle_AI.rb:10109
        if(ability(A,"telepathy"))score*=0.7; // Battle_AI.rb:10110
      }
      break;
    }
    return score*0.01;
  }
  // END GENERATED SOURCE AI DISRUPTION
  // View of a matchup for the generated getFieldDisruptScore port, read from simulator Pokemon: types, effective
  // ability, raw stats (Ruby's attack/spatk), effective speed, moves, wall roles (Battle_AI.rb pbGetMonRoles: a
  // healing move with >251 EVs and a matching nature), the AI side's living party types and the field counter.
  const wallNatures={PHYSICALWALL:['Bold','Relaxed','Impish','Lax'],SPECIALWALL:['Calm','Gentle','Sassy','Careful']};
  function disruptionMon(b,p){
    if(!p || p.hp<=0)return null;
    const healing=p.moveSlots.some(s=>b.dex.moves.get(s.id).flags?.heal),evs=p.set?.evs || {},nature=b.dex.natures.get(p.set?.nature || '').name;
    const roles=healing?[...(evs.def>251 && wallNatures.PHYSICALWALL.includes(nature)?['PHYSICALWALL']:[]),...(evs.spd>251 && wallNatures.SPECIALWALL.includes(nature)?['SPECIALWALL']:[])]:[];
    return {types:p.getTypes(),ability:p.hasAbility(p.ability)?p.ability:'',atk:p.storedStats.atk,def:p.storedStats.def,spa:p.storedStats.spa,spd:p.storedStats.spd,
      speed:p.getStat('spe'),hp:p.hp,maxhp:p.maxhp,moves:p.moveSlots.map(s=>s.id),airborne:!p.isGrounded(),roles,
      protect:!!p.volatiles.protect,skyDrop:!!p.volatiles.skydrop,semiInvulnerable:p.isSemiInvulnerable()};
  }
  function disruptionView(b,attacker,opponent){
    const partner=p=>p.side.active.find(a=>a && a!==p && a.hp>0 && !a.fainted) || null;
    const party=[attacker.side,attacker.side.allySide].filter(Boolean).flatMap(s=>s.pokemon).filter(p=>p.hp>0);
    const trickRoom=!!b.field.pseudoWeather.trickroom,a=attacker.getStat('spe'),o=opponent.getStat('spe');
    return {attacker:disruptionMon(b,attacker),opponent:disruptionMon(b,opponent),attackerPartner:disruptionMon(b,partner(attacker)),opponentPartner:disruptionMon(b,partner(opponent)),
      partyTypes:[...new Set(party.flatMap(p=>p.getTypes()))],weather:b.field.effectiveWeather(),counter:state(b)?.counters?.[0] || 0,
      opponentReserves:opponent.side.pokemon.filter(p=>!p.isActive && p.hp>0).length,attackerFaster:trickRoom?a<o:a>o};
  }
  // Structural fingerprint of everything a damage measurement can read: every own property of the
  // Pokemon (volatiles, statuses, history, flags, slots), sides, active allies, field and engine state.
  // Only remaining-turn durations are omitted; no installed or catalog damage rule reads them.
  const digestSkip=new Set(['getDetails','getHealth','side','battle','set','baseMoveSlots','details','fullname','name']);
  function digest(v,depth){
    if(v===null || v===undefined)return '~';
    const t=typeof v;if(t==='function')return 'f';if(t!=='object')return t[0]+v;
    if(typeof v.uuid==='string')return '@'+v.uuid;
    const kind=depth>0?plainKind(v):null;
    if(!kind)return '#'+(v.id ?? v.name ?? 'o');
    let out=kind[0]+'(';
    if(kind==='array' || kind==='set')for(const x of v)out+=digest(x,depth-1)+',';
    else if(kind==='map')for(const [k,x] of v)out+=digest(k,depth-1)+'='+digest(x,depth-1)+',';
    // An effect state's target is its holder, already identified by the enclosing Pokemon or side.
    else for(const k of Object.keys(v))if(k!=='duration' && k!=='catalog' && k!=='target')out+=k+'='+digest(v[k],depth-1)+',';
    return out+')';
  }
  // An own property holding undefined is the same state as an absent one.
  function pokemonDigest(p){let out='';for(const k of Object.keys(p))if(!digestSkip.has(k) && p[k]!==undefined)out+=k+'='+digest(p[k],3)+';';return out;}
  // Whether a field definition's rules read move history (lastMove conditions, streak power, turns active).
  const historyReaders=new WeakMap();
  function readsHistory(definition){
    if(!definition || typeof definition!=='object')return {lastMove:false,streak:false,turnsActive:false};
    let row=historyReaders.get(definition);
    if(!row){const text=JSON.stringify(definition.rules || []);row={lastMove:text.includes('"lastMove"'),streak:text.includes('"streakPower"'),turnsActive:text.includes('"turnsActive"')};historyReaders.set(definition,row);}
    return row;
  }
  // Per-turn counters that the simulator core only writes while moves run. Only an effect's own handler reads them
  // (Rage Fist, Fake Out, Stomping Tantrum, Stakeout, Burning Jealousy, Lash Out...); a handler's source text names
  // the property it reads. 'moveThisTurn' also matches 'moveThisTurnResult', which only keeps more state.
  const turnCounters=['timesAttacked','activeMoveActions','activeTurns','moveThisTurn','moveThisTurnResult','moveLastTurnResult',
    'statsRaisedThisTurn','statsLoweredThisTurn','hurtThisTurn','newlySwitched'];
  const counterReaders=new WeakMap();
  function countersRead(effect){
    if(!effect || (typeof effect!=='object' && typeof effect!=='function'))return [];
    let found=counterReaders.get(effect);if(found)return found;
    const names=new Set(),seen=new Set();
    const scan=(o,depth)=>{
      if(typeof o==='function'){const text=Function.prototype.toString.call(o);
        // A function without source text (native or bound) could read anything.
        if(/\[native code\]/.test(text) && !/^class /.test(text))turnCounters.forEach(n=>names.add(n));
        else for(const n of turnCounters)if(text.includes(n))names.add(n);return;}
      if(!o || typeof o!=='object' || seen.has(o) || depth<0)return;seen.add(o);
      for(const k of Object.keys(o))scan(o[k],depth-1);
    };
    scan(effect,3);found=[...names];counterReaders.set(effect,found);return found;
  }
  // Counters read by any handler the simulator can find during a measurement: the format and registered battle
  // events, field, side and slot conditions, and every active Pokemon's status, volatiles, ability, item, species
  // and moves (with their Max forms while Dynamaxed), plus field rules reading turns active.
  function countersInPlay(b,definitions){
    const read=new Set();const add=e=>{for(const n of countersRead(e))read.add(n);};
    if(definitions.some(r=>r.turnsActive))read.add('activeTurns');
    add(b.format);for(const list of Object.values(b.events || {}))for(const h of list || [])add(h.callback);
    const conditions=ids=>{for(const id of Object.keys(ids || {}))add(b.dex.conditions.getByID(id));};
    conditions(b.field.pseudoWeather);if(b.field.weather)add(b.dex.conditions.getByID(b.field.weather));if(b.field.terrain)add(b.dex.conditions.getByID(b.field.terrain));
    for(const side of b.sides.filter(Boolean)){conditions(side.sideConditions);for(const slot of side.slotConditions || [])conditions(slot);}
    for(const p of b.getAllActive()){
      add(p.getStatus());conditions(p.volatiles);add(p.getAbility());add(p.getItem());add(p.baseSpecies);add(p.species);
      for(const slot of p.moveSlots){const move=b.dex.moves.get(slot.id);add(move);
        if(p.volatiles.dynamax){const max=b.actions.getMaxMove(move,p);if(max)add(b.dex.moves.get(max.id || max));}}
    }
    return read;
  }
  // Per-action move results are read only by after-move rules and move transitions (which a measurement evaluates for
  // the measured move itself, see willChange); turn messages only deduplicate text. Durations are omitted as in digest.
  const transientStateKeys=new Set(['missed','connected','accuracyMiss','drainHealed','turnMessages','duration','catalog','target']);
  function stateDigest(s){
    if(!s)return '~';
    let out='o(';for(const k of Object.keys(s))if(!transientStateKeys.has(k))out+=k+'='+digest(s[k],3)+',';
    return out+')';
  }
  const sideDigestSkip=new Set(['foe','allySide','battle','team','pokemon','activeRequest','choice','name','avatar','lastSelectedMove']);
  function battleDigest(b){
    const f=b.field;
    let out=stateDigest(state(b))+'|'+f.weather+digest(f.weatherState,3)+f.terrain+digest(f.terrainState,3)+digest(f.pseudoWeather,3)
      +'|'+digest(b.lastSuccessfulMoveThisTurn,0)+digest(b.lastMove,0);
    for(const side of b.sides.filter(Boolean)){
      out+='|';for(const k of Object.keys(side))if(!sideDigestSkip.has(k))out+=k+'='+digest(side[k],3)+';';
      for(const a of side.active)if(a)out+='\n'+pokemonDigest(a);
    }
    return out;
  }
  // Status moves that a field turns into attacks (e.g. Deep Earth Topsy-Turvy), cached per frozen definition.
  const statusAttackRules=new WeakMap();
  function statusMoveAttacks(b,moveId){
    return [current(b),current(b)?.overlay,(state(b)?.catalog || catalog)?.fields[indoor]].some(f=>{
      if(!f || typeof f!=='object')return false;let rules=statusAttackRules.get(f);
      if(!rules){rules=(f.rules || []).filter(r=>r.event==='modifyMove' && JSON.stringify(r.actions).includes('"category"')).map(r=>JSON.stringify(r.condition));statusAttackRules.set(f,rules);}
      return rules.some(c=>c.includes('"'+moveId+'"'));
    });
  }
  // Best-attack results keyed by the complete fingerprint stay valid for the whole battle: later decisions of the
  // same battle (doubles partners, later turns) reuse them. A battle keeps its catalog; the cache is bounded.
  const strategyMemos=new WeakMap();
  function strategyMemo(b){
    let row=strategyMemos.get(b);
    if(!row || row.catalog!==state(b).catalog || row.map.size>4000){row={catalog:state(b).catalog,map:new Map()};strategyMemos.set(b,row);}
    return row.map;
  }
  function strategy(b,request){
    if(!state(b))return {candidates:[]};
    return transaction(b,()=>{
      // Use a reproducible analysis seed, independently of the real battle's next random roll.
      b.prng.seed=[7919,104729,1543,3253];
      const user=findPokemon(b,request.user);if(!user)return {candidates:[]};
      const team=user.side.pokemon.filter(p=>p.hp>0 && !p.fainted);
      const foes=b.sides.filter(s=>s && s!==user.side && s!==user.side.allySide).flatMap(s=>s.pokemon).filter(p=>p.hp>0 && !p.fainted);
      const opponents=foes.filter(p=>p.isActive);if(!opponents.length)return {candidates:[]};
      const memo=strategyMemo(b);let damageCalls=0,cacheHits=0,damageMillis=0,damageMechanicsMillis=0;
      // Wall-clock phases (nested phases are also included in their parents) for decision-latency receipts.
      const phases={setup:0,screening:0,rollouts:0,matchups:0,branches:0,resources:0,policies:0,rollouts_count:0};
      const timed=(name,fn)=>{const at=Date.now();try{return fn();}finally{phases[name]+=Date.now()-at;}};
      const environment=()=>JSON.stringify({field:state(b)?.id,overlay:state(b)?.overlay,counters:state(b)?.counters,duration:state(b)?.duration,
        weather:b.field.weather,terrain:b.field.terrain,rooms:Object.entries(b.field.pseudoWeather).map(([id,s])=>[id,s.duration])});
      // `digests` optionally supplies [battleDigest, pokemonDigest(p), pokemonDigest(t)] of the current state.
      const bestAttack=(p,t,digests)=>{
        if(!p || !t || p.hp<=0 || t.hp<=0)return {damage:0,priority:0,speed:p?.getStat('spe') || 0,move:null};
        const [base,attacker,defender]=digests || [battleDigest(b),pokemonDigest(p),pokemonDigest(t)];
        const key=base+'\n>'+attacker+'\n<'+defender;if(memo.has(key)){cacheHits++;return memo.get(key);}
        const speed=p.getStat('spe');let best={damage:0,priority:0,speed,move:null};
        // Some fields turn status moves into attacks (e.g. Deep Earth Topsy-Turvy).
        const slots=p.moveSlots.filter(slot=>slot.pp>0 && !slot.disabled && (b.dex.moves.get(slot.id).category!=='Status' || statusMoveAttacks(b,slot.id)));
        const start=Date.now();
        const outs=transactionEach(b,slots,slot=>{const at=Date.now(),out=measure(b,p,t,slot.id,{strategy:true,secondaries:false});damageMechanicsMillis+=Date.now()-at;return out;},involved(b,p,t));
        damageCalls+=slots.length;damageMillis+=Date.now()-start;
        slots.forEach((slot,i)=>{
          const out=outs[i];if(out.fails || out.immune || out.category==='Status')return;
          // Expected critical hits from the measured stage (Gen 7+ chances 1/24, 1/8, 1/2; stage 4 is already a
          // guaranteed critical inside maxDamage), so crit-raising fields and moves change the potential.
          const stage=Math.max(0,Math.min(4,out.critRatio || 0)),critChance=out.critBlocked || stage>=4?0:[0,1/24,1/8,1/2][stage];
          const damage=(out.maxDamage || 0)*.925*(1+.5*critChance)*(out.accuracy===true?1:(out.accuracy || 0)/100);
          if(damage>best.damage)best={damage,priority:out.priority || 0,speed,move:slot.id};
        });
        memo.set(key,best);return best;
      };
      // Decision-time move history. The matchup potential describes the lasting state (boosts, status, types,
      // items, abilities, volatiles, sides, field and counters); one turn's transient history is reset to these
      // values unless the active field's rules read it. The incoming-reply measurements keep the complete state.
      const history=new Map(),historyLastMove=b.lastMove,historySides=b.sides.map(s=>s?.lastMove);
      for(const side of b.sides.filter(Boolean))for(const p of side.pokemon)history.set(p,{lastMove:p.lastMove,lastMoveUsed:p.lastMoveUsed,
        lastMoveTargetLoc:p.lastMoveTargetLoc,attackedBy:p.attackedBy.map(a=>({...a})),lastDamage:p.lastDamage,
        slots:new Map(p.moveSlots.map(s=>[s.id,[s.pp,s.used]])),streak:p.rejuvenationStreak,counters:turnCounters.map(k=>p[k])});
      // Per-turn counters return to their decision-time values too, unless a handler in play reads them (Rage Fist after
      // being hit, Fake Out after the first turn, Stomping Tantrum after a failure keep their real consequence).
      const canonicalHistory=()=>{
        const definitions=[current(b),state(b)?.overlay?(state(b).catalog || catalog).fields[state(b).overlay.id]:null].map(readsHistory);
        const keepLastMove=definitions.some(r=>r.lastMove),keepStreak=definitions.some(r=>r.streak),counters=countersInPlay(b,definitions);
        if(!keepLastMove){b.lastMove=historyLastMove;b.sides.forEach((s,i)=>{if(s)s.lastMove=historySides[i];});}
        for(const a of b.getAllActive()){
          const h=history.get(a);if(!h)continue;
          if(!keepLastMove){a.lastMove=h.lastMove;a.lastMoveUsed=h.lastMoveUsed;}
          a.lastMoveTargetLoc=h.lastMoveTargetLoc;a.attackedBy=h.attackedBy.map(x=>({...x}));a.lastDamage=h.lastDamage;
          for(const s of a.moveSlots){const row=h.slots.get(s.id);if(row){s.pp=row[0];s.used=row[1];}}
          if(!keepStreak)a.rejuvenationStreak=h.streak;
          turnCounters.forEach((k,i)=>{if(!counters.has(k) && a[k]!==h.counters[i])a[k]=h.counters[i];});
        }
      };
      const matchup=(p,t)=>timed('matchups',()=>transaction(b,()=>{
        // Potential is measured at full health to separate lasting matchup changes from HP already
        // priced by the rollout. The actual reply and KO calculation always use current health.
        p.hp=p.maxhp;t.hp=t.maxhp;canonicalHistory();
        const base=battleDigest(b),mine=pokemonDigest(p),theirs=pokemonDigest(t);
        const offense=bestAttack(p,t,[base,mine,theirs]),defense=bestAttack(t,p,[base,theirs,mine]);
        const faster=!!b.field.pseudoWeather.trickroom?offense.speed<=defense.speed:offense.speed>=defense.speed;
        return Math.min(1.5,offense.damage/t.maxhp)-Math.min(1.5,defense.damage/p.maxhp)+(faster?.08:-.08);
      },involved(b,p,t)));
      // Source switch heuristics make reserve planning linear and cheap. Active and proposed switch
      // consequences still use exact simulator measurements, including entry effects and hazards.
      const teamValue=(reservesOnly=false)=>{
        const overlay=state(b)?.overlay?.id,definition=(state(b)?.catalog || catalog)?.fields[overlay];
        const s=state(b),backup=s.duration && s.tempIndex!==null?s.catalog.fields[s.stack[s.tempIndex-1]?.id]:null;
        const durationWeight=s.duration?Math.min(1,s.duration/3):1;
        const overlayWeight=definition?Math.min(.7,(s.overlay.duration || 3)/3*.7):0;
        const affinity=p=>durationWeight*sourceAffinity(b,p)+(backup?(1-durationWeight)*sourceAffinity(b,p,backup):0)
          +(definition && definition!==current(b)?overlayWeight*sourceAffinity(b,p,definition):0);
        return team.reduce((v,p)=>v+(p.hp>0 && !(reservesOnly && p.isActive)?(p.isActive?1:.5)*affinity(p):0),0)
          -foes.reduce((v,p)=>v+(p.hp>0 && !(reservesOnly && p.isActive)?(p.isActive?1:.5)*affinity(p):0),0);
      };
      const health=()=>b.sides.filter(Boolean).flatMap(s=>s.pokemon).map(p=>({p,hp:p.hp/p.maxhp,boosts:{...p.boosts},status:p.status}));
      const hpValue=before=>before.reduce((sum,r)=>sum+(r.p.side===user.side || r.p.side===user.side.allySide?1:-1)*
        ((r.p.hp/r.p.maxhp-r.hp)*100+(r.hp>0 && r.p.hp<=0?-40:0)),0);
      // Entry hazards are valued by what they actually do to the reserves that would enter: each living reserve
      // switches in through the simulator's switchIn/runSwitch inside a transaction (field-modified spikes and
      // rocks, Sticky Web on Forest, Wasteland conversions...). Each reserve is expected to enter half the time.
      const hazardIds=new Set(['spikes','toxicspikes','stealthrock','stickyweb','gmaxsteelsurge']),hazardMemo=new Map();
      // Petrification (ptr) deals 1/8 per turn and blocks healing (persistentStatusPolicies.ptr).
      const statusCost={slp:18,frz:20,par:12,brn:10,tox:15,psn:8,ptr:14};
      const hazardImpact=side=>{
        if(!Object.keys(side.sideConditions).some(id=>hazardIds.has(id)))return 0;
        const reserves=side.pokemon.filter(p=>p.hp>0 && !p.fainted && !p.isActive),slot=side.active.findIndex(a=>a);
        if(!reserves.length || slot<0)return 0;
        const key=digest(side.sideConditions,3)+'|'+battleDigest(b)+'|'+reserves.map(pokemonDigest).join('\n');
        if(hazardMemo.has(key))return hazardMemo.get(key);
        let total=0;
        for(const r of reserves)total+=transaction(b,()=>{
          const hp=r.hp/r.maxhp,status=r.status,boosts={...r.boosts};
          b.actions.switchIn(r,slot);b.actions.runSwitch(r);
          const lost=Math.max(0,hp-r.hp/r.maxhp)*100+(r.hp<=0?40:0);
          const afflicted=r.status!==status?statusCost[r.status] || 0:0;
          const lowered=Object.keys(boosts).reduce((s,k)=>s+Math.max(0,boosts[k]-(r.boosts[k] || 0))*4,0);
          return lost+afflicted+lowered;
        });
        // Battle_AI.rb:7803: hazards gain value when a living ally can actually force another entry. Probe the
        // simulator's forceSwitchFlag rather than copying Colosseum, Suction Cups, Ingrain or Guard Dog rules.
        let phazing=false;
        const target=side.active.find(p=>p?.hp>0),other=b.sides.find(s=>s!==side && s!==side.allySide);
        if(target && other)for(const p of other.pokemon){
          if(p.hp<=0)continue;
          for(const slot of p.moveSlots)if(slot.pp>0 && b.dex.moves.get(slot.id).forceSwitch){
            phazing=transaction(b,()=>{b.actions.runMove(slot.id,p,p.getLocOf(target));return !!target.forceSwitchFlag;});
            if(phazing)break;
          }
          if(phazing)break;
        }
        const result=.5*total*(phazing?1.3:1);hazardMemo.set(key,result);return result;
      };
      const lastingValue=()=>{
        let value=0;
        for(const side of b.sides.filter(Boolean)){
          const sign=side===user.side || side===user.side.allySide?1:-1;
          for(const p of side.pokemon)if(p.hp>0){
            const status=statusCost[p.status] || 0;
            value-=sign*status*(p.isActive?1:.4);
            if(p.volatiles.perishsong)value-=sign*15/Math.max(1,p.volatiles.perishsong.duration || 1);
            if(p.volatiles.substitute)value+=sign*8*p.volatiles.substitute.hp/p.maxhp;
            if(p.volatiles.trapped || p.volatiles.partiallytrapped)value-=sign*3;
            if(p.volatiles.taunt && p.isActive)value-=sign*3*p.moveSlots.filter(s=>b.dex.moves.get(s.id).category==='Status').length;
            // A recharge turn (Hyper Beam family) forfeits the next action unless a field removes it.
            if(p.isActive && p.volatiles.mustrecharge)value-=sign*25;
          }
          // Wish and Future Sight are slot conditions in the installed simulator: Wish restores its stored HP to the
          // slot's occupant (only the missing part counts); a pending future attack is measured against it.
          side.slotConditions.forEach((conditions,slot)=>{
            const holder=side.active[slot];if(!holder || holder.hp<=0)return;
            if(conditions.wish)value+=sign*.8*Math.min(conditions.wish.hp || 0,holder.maxhp-holder.hp)/holder.maxhp*100;
            const future=conditions.futuremove,source=future?.source;
            if(future?.move && source && source.hp>0){
              const m=transaction(b,()=>measure(b,source,holder,future.move,{strategy:true,secondaries:false}),involved(b,source,holder));
              if(!m.fails && !m.immune)value-=sign*.8*Math.min(100,(m.maxDamage || 0)*.925/holder.maxhp*100);
            }
          });
          // Strategic option value, not mechanical damage: actual entry/residual calculations still
          // determine the rollout. Hazards, screens and delayed support also matter beyond this turn.
          value-=sign*hazardImpact(side);
          for(const [id,s]of Object.entries(side.sideConditions)){
            const turns=Math.min(4,s.duration || 4);
            if(['reflect','lightscreen','auroraveil','tailwind','safeguard'].includes(id))value+=sign*turns*2;
          }
        }
        return value;
      };
      const setupStart=Date.now();
      const fieldBefore=environment(),utilityBefore=teamValue(),reserveBefore=teamValue(true),decisionField=state(b).id;
      const decisionSnapshot=captureBattle(b);
      const contextBefore={weather:b.field.weather,terrain:b.field.terrain,rooms:Object.keys(b.field.pseudoWeather).sort().join(',')};
      // Source preferences (Battle_AI.rb:2013..4178), retained as bounded strategic weights. Unlike the source's
      // zero Surf/Muddy Water multiplier, a favourable immediate KO is never discarded by a party preference.
      const sourcePreference=q=>{
        if(q.switch)return 1;
        const field=originalOf(decisionField),id=q.move;let factor=1;
        if(field==='ASHENBEACH' && ['wildboltstorm','sandsearstorm','springtidestorm','twister','whirlpool'].includes(id))factor*=.7;
        if(field==='GLITCH' && id==='icefang')factor*=1.2;
        if(field==='DRAGONSDEN' && ['surf','muddywater'].includes(id))factor*=team.some(p=>p.hasType('Fire') || p.hasType('Dragon'))?.25:1.5;
        if(field==='VOLCANICTOP' && ['outrage','thrash','petaldance','ragingfury'].includes(id) && !user.hasAbility('owntempo'))factor*=.5;
        if(['RAINBOW','MOUNTAIN'].includes(field) && ['snowscape','chillyreception'].includes(id))factor*=1.5;
        const move=b.dex.moves.get(id);
        if(field==='ROCKY' && (move.secondary?.volatileStatus==='flinch' || move.secondaries?.some(s=>s.volatileStatus==='flinch')))factor*=1.1;
        return factor;
      };
      // Battle_AI.rb:1908 values a move that changes the field by sqrt(current/new) of getFieldDisruptScore, both
      // computed for the decision-time matchup. The view is taken once per opponent before any rollout.
      const disruptionViews=new Map();
      const disruptionFor=foe=>{if(!disruptionViews.has(foe))disruptionViews.set(foe,disruptionView(b,user,foe));return disruptionViews.get(foe);};
      const originalOf=id=>(state(b).catalog || catalog).fields[id]?.originalId || 'INDOOR';
      const tacticalBefore=matchup(user,opponents[0]),lastingBefore=lastingValue();
      phases.setup+=Date.now()-setupStart;
      // Chance policy of the lookahead. The deciding move branches explicitly on its secondary effects (weighted by
      // the simulator's own modified chance); every other chance event takes its median outcome (it happens when at
      // least as likely as not), so no single draw of the analysis seed biases every candidate in the same way.
      let secondaryRoll=49,inSecondaries=0;
      const chancePolicy=fn=>{
        const random=b.random,randomChance=b.randomChance,secondaries=b.actions.secondaries;
        const restoreSecondaries=swap(b.actions,'secondaries',function(...args){inSecondaries++;try{return secondaries.apply(this,args);}finally{inSecondaries--;}});
        b.random=function(m,n){return inSecondaries && m===100 && n===undefined?secondaryRoll:random.apply(this,arguments);};
        b.randomChance=function(n,d){return this.forceRandomChance!==null?this.forceRandomChance:n/d>=.5;};
        try{return fn();}finally{restoreSecondaries();b.random=random;b.randomChance=randomChance;}
      };
      const execute=(p,t,q,connect=true,secondary)=>{
        const base=b.dex.getActiveMove(q.move);if(q.gimmick==='zmove' && !b.actions.getZMove(base,p))throw Error('unavailable zmove');
        const z=q.gimmick==='zmove'?b.actions.getZMove(base,p):undefined;
        const max=q.gimmick==='dynamax' || p.volatiles.dynamax?b.actions.getMaxMove(base,p)?.id:undefined;
        const event=b.runEvent,damage=b.actions.getDamage,randomizer=b.randomizer,roll=secondaryRoll;
        b.runEvent=function(name,...args){const result=event.call(this,name,...args);return name==='Accuracy' && result!==0 && result!==false?(connect?true:0):result;};
        const restoreDamage=swap(b.actions,'getDamage',function(u,t,m,...args){if(m && typeof m==='object')m.willCrit=guaranteedCritical(b,u,t,m);return damage.call(this,u,t,m,...args);});
        b.randomizer=forcedRoll(b,93);
        // Secondary branch: roll 0 applies every chance secondary, roll 99 only guaranteed ones.
        if(secondary!==undefined)secondaryRoll=secondary?0:99;
        try{b.queue.cancelMove(p);b.actions.runMove(base,p,p.getLocOf(t),null,z,false,max);}
        finally{b.runEvent=event;restoreDamage();secondaryRoll=roll;if(randomizer)b.randomizer=randomizer;else delete b.randomizer;}
      };
      const resourceMemo=new Map();
      const resourceGain=(p,t,gimmick)=>transaction(b,()=>{
        const threat=bestAttack(t,user).move;
        const potential=()=>{
          const physical=p.moveSlots.filter(s=>b.dex.moves.get(s.id).category==='Physical').length;
          const special=p.moveSlots.filter(s=>b.dex.moves.get(s.id).category==='Special').length;
          const offense=(physical*p.getStat('atk')+special*p.getStat('spa'))/Math.max(1,physical+special);
          let defence=0;
          if(threat){const move=prepareMove(b,t,p,threat,evaluatorPriority(b,t,threat,{}));
            defence=isImmune(b,t,p,move)?1.5:-.3*p.runEffectiveness(move);}
          // Reserve opportunity is a bounded heuristic over simulator stats, immunity and effective
          // typing, not another damage model. Current candidates retain complete move rollouts.
          let coverage=0;
          for(const slot of p.moveSlots){if(b.dex.moves.get(slot.id).category==='Status')continue;
            const move=prepareMove(b,p,t,slot.id,evaluatorPriority(b,p,slot.id,{}));
            if(move && (p.hasType(move.type) || p.terastallized===move.type))coverage+=.1;}
          return .4*Math.log(Math.max(1,offense))+.2*Math.log(Math.max(1,p.getStat('spe')))
            +.3*Math.log(Math.max(1,(p.getStat('def')+p.getStat('spd'))/2))+.3*Math.log(p.maxhp)+defence+coverage+sourceAffinity(b,p);
        };
        const before=potential();
        if(gimmick==='zmove'){
          let gain=0;
          for(const slot of p.moveSlots){
            if(!b.actions.getZMove(b.dex.moves.get(slot.id),p))continue;
            const z=transaction(b,()=>measure(b,p,t,slot.id,{gimmick}),involved(b,p,t));damageCalls++;
            gain=Math.max(gain,Math.min(1.5,(z.maxDamage || 0)/t.maxhp)-bestAttack(p,t).damage/t.maxhp);
          }
          return gain;
        }
        applyEvaluationGimmick(b,p,gimmick);return potential()-before;
      // A gimmick and measurements change only the holder, the actives, sides and field (all captured).
      },involved(b,p,t,user));
      const bestReserve=(gimmick,t)=>{
        const key=gimmick+'/'+t.uuid;if(resourceMemo.has(key))return resourceMemo.get(key);
        let gain=0;
        for(const p of team)if(p!==user && !p.isActive){try{gain=Math.max(gain,resourceGain(p,t,gimmick));}catch(_){/* reserve cannot use this resource */}}
        resourceMemo.set(key,gain);return gain;
      };
      // Replacement after a pivot (U-turn, Volt Switch, Parting Shot...): the reserve whose source affinity and
      // simulator immunity/effectiveness against the opposing threat are best. Only the choice is heuristic;
      // the switch itself runs through the simulator's own switchIn/runSwitch and entry events.
      // Switch-in preference in the manner of the source's party scoring: field affinity, simulator immunity and
      // effectiveness against the opposing threat, and remaining health.
      const switchInScore=(r,move)=>{
        const resist=!move || move.category==='Status'?0:!r.runImmunity(move.type)?3:-r.runEffectiveness(move);
        return sourceAffinity(b,r)/25+resist+r.hp/r.maxhp;
      };
      const threatMove=(foe,p)=>{const threat=foe && foe.hp>0?bestAttack(foe,p).move:null;return threat?b.dex.getActiveMove(threat):null;};
      const pivotReplacement=(p,foe)=>{
        const move=threatMove(foe,p);
        let best=null,bestScore=-Infinity;
        for(const r of p.side.pokemon){
          if(r.isActive || r.hp<=0 || r.fainted)continue;
          const score=switchInScore(r,move);
          if(score>bestScore){bestScore=score;best=r;}
        }
        return best;
      };
      // The simulator's own post-action sequence (Battle.runAction): forced drag-ins, active move clearing,
      // faint processing (Faint/AfterFaint rules), Update (berries, herbs) and pivot replacements.
      const afterAction=foeOf=>{
        for(const side of b.sides.filter(Boolean))for(const a of side.active)if(a?.forceSwitchFlag){if(a.hp)b.actions.dragIn(a.side,a.position);a.forceSwitchFlag=false;}
        b.clearActiveMove();b.faintMessages();
        if(b.gen>=5)b.eachEvent('Update');
        for(const side of b.sides.filter(Boolean))for(const a of side.active)if(a?.switchFlag && a.hp>0 && !a.fainted){
          const r=pivotReplacement(a,foeOf(a));a.switchFlag=false;
          if(r){b.actions.switchIn(r,a.position);b.actions.runSwitch(r);b.faintMessages();if(b.gen>=5)b.eachEvent('Update');}
        }
      };
      // One bounded opponent policy per decision. Utility moves are tried through the real move/entry pipeline,
      // so field status protection, speed control, Taunt and setup are consequences, never duplicated formulas.
      const policyMemo=new Map();
      const opponentPolicy=foe=>{
        if(policyMemo.has(foe.uuid))return policyMemo.get(foe.uuid);
        const policy=timed('policies',()=>{
          const before=health(),lasting=lastingValue(),potential=matchup(user,foe),options=[];
          for(const slot of foe.moveSlots){
            if(slot.pp<=0 || slot.disabled)continue;
            const move=b.dex.moves.get(slot.id);
            if(move.stallingMove || ['wideguard','quickguard','craftyshield','matblock'].includes(move.sideCondition)){options.push({move:slot.id,protect:true,value:0});continue;}
            if(move.category!=='Status' && !move.secondary?.boosts && !move.secondaries?.some(s=>s.boosts) && !move.self?.boosts && !move.forceSwitch)continue;
            const value=transaction(b,()=>chancePolicy(()=>{
              execute(foe,user,{move:slot.id});afterAction(a=>a.side===foe.side?user:foe);
              const mine=user.side.active[user.position],theirs=foe.side.active[foe.position];
              const tactical=mine?.hp>0 && theirs?.hp>0?matchup(mine,theirs)-potential:0;
              return -hpValue(before)-(lastingValue()-lasting)-12*tactical;
            }));
            options.push({move:slot.id,value});
          }
          const protection=options.find(o=>o.protect),utility=options.filter(o=>!o.protect).sort((a,b)=>b.value-a.value)[0];
          const threat=threatMove(user,foe);
          const reserve=foe.side.pokemon.filter(p=>!p.isActive && p.hp>0 && !p.fainted)
            .sort((a,b)=>switchInScore(b,threat)-switchInScore(a,threat))[0];
          return {protection,utility:utility?.value>1?utility:null,reserve};
        });
        policyMemo.set(foe.uuid,policy);return policy;
      };
      // Reserve weather/terrain/room utility of a resulting context against the opposing lead. Every decision-time
      // reserve enters through the real switch-in pipeline at the decision state, once in the decision context and
      // once with the resulting weather, terrain and rooms transplanted, comparing the strongest moves both ways. The
      // term thus isolates the context from a rollout's incidental damage, boosts and history (and from a field
      // change, which the field terms value), and is measured once per distinct context in a decision. Each side's
      // `contextReserves` likeliest entrants (the switch-in preference of switch screening and pivots) are profiled.
      const contextMemo=new Map(),contextBaselines=new Map();
      const contextReserves=request.screen===false?Infinity:(request.screen?.contextReserves ?? 2);
      let likelyEntrants=null;
      const reserveContextValue=()=>{
        const f=b.field;
        const changed=f.weather!==contextBefore.weather || f.terrain!==contextBefore.terrain || Object.keys(f.pseudoWeather).sort().join(',')!==contextBefore.rooms;
        if(!changed)return 0;
        const key=f.weather+digest(f.weatherState,3)+'|'+f.terrain+digest(f.terrainState,3)+'|'+digest(f.pseudoWeather,3);
        if(contextMemo.has(key))return contextMemo.get(key);
        const context={weather:f.weather,weatherState:f.weatherState,terrain:f.terrain,terrainState:f.terrainState,
          rooms:Object.entries(f.pseudoWeather).filter(([id])=>id!==effectId)};
        const transplant=()=>{
          f.weather=context.weather;f.weatherState=context.weatherState;f.terrain=context.terrain;f.terrainState=context.terrainState;
          for(const id of Object.keys(f.pseudoWeather))if(id!==effectId && !context.rooms.some(([room])=>room===id))delete f.pseudoWeather[id];
          for(const [id,room] of context.rooms)f.pseudoWeather[id]=room;
        };
        const value=transaction(b,()=>{
          restoreBattle(b,decisionSnapshot);
          if(!likelyEntrants){
            const likely=(list,threat)=>list.filter(r=>!r.isActive && r.hp>0 && !r.fainted)
              .map(r=>({r,score:switchInScore(r,threat)})).sort((x,y)=>y.score-x.score).slice(0,contextReserves).map(x=>x.r);
            likelyEntrants=new Set([...likely(team,threatMove(opponents[0],user)),...likely(foes,threatMove(user,opponents[0]))]);
          }
          let total=0;
          for(const group of [[team,foes,-1],[foes,team,1]])for(const r of group[0]){
            if(r.isActive || r.hp<=0 || r.fainted || !likelyEntrants.has(r))continue;
            const target=group[1].find(p=>p.isActive && p.hp>0);if(!target)continue;
            const profile=()=>{
              b.actions.switchIn(r,0);b.actions.runSwitch(r);
              r.hp=r.maxhp;target.hp=target.maxhp;
              return bestAttack(r,target).damage/target.maxhp-bestAttack(target,r).damage/r.maxhp;
            };
            const baselineKey=r.uuid+'/'+target.uuid;
            if(!contextBaselines.has(baselineKey))contextBaselines.set(baselineKey,transaction(b,profile));
            total-=group[2]*6*(transaction(b,()=>{transplant();return profile();})-contextBaselines.get(baselineKey));
          }
          return total;
        });
        contextMemo.set(key,value);return value;
      };
      const candidates=[];
      // Every independent rollout starts at this identical decision state. Capture the complete team once,
      // retaining full rollback safety for forced entries/forms without recapturing twelve Pokemon per branch.
      const rolloutSnapshot=captureBattle(b),rolloutPrng=b.prng;
      const rolloutTransaction=fn=>{
        b.prng=rolloutPrng.clone();b.send=()=>{};b.checkWin=()=>false;
        try{return fn();}finally{restoreBattle(b,rolloutSnapshot);b.prng=rolloutPrng;}
      };
      const candidate=(q,connect,secondary,policyReply)=>timed('rollouts',()=>{phases.rollouts_count++;return rolloutTransaction(()=>chancePolicy(()=>{
          let p=user,t=findPokemon(b,q.target) || opponents[0];const before=health();
          const foe=t.side===user.side || t.side===user.side.allySide?opponents[0]:t;
          const slot=user.position,foeSide=foe.side,foeSlot=foe.position;
          const own=()=>user.side.active[slot],opposing=()=>foeSide.active[foeSlot];
          const foeOf=a=>a.side===user.side?opposing():own();
          // Hypothetical turn boundaries never build or publish choice requests.
          b.makeRequest=function(){};
          // Transactions normally suppress victory checks for isolated measurements. A turn rollout needs the
          // native end-of-battle boundary; its win/PP/request changes are covered by the full rollback snapshot.
          b.checkWin=Object.getPrototypeOf(b).checkWin;
          if(q.switch){
            p=findPokemon(b,q.switch);if(!p || p.isActive || p.hp<=0)throw Error('invalid switch');
            b.actions.switchIn(p,user.position);b.actions.runSwitch(p);afterAction(foeOf);
          }else applyEvaluationGimmick(b,p,q.gimmick);
          b.queue.list.length=0;
          const enqueue=(actor,target,query)=>{
            const action={choice:'move',pokemon:actor,moveid:query.move,targetLoc:actor.getLocOf(target)};
            if(query.gimmick==='zmove')action.zmove=b.actions.getZMove(b.dex.moves.get(query.move),actor);
            if(query.gimmick==='dynamax' || actor.volatiles.dynamax)action.maxMove=b.actions.getMaxMove(b.dex.moves.get(query.move),actor)?.id;
            b.queue.addChoice(action);
          };
          if(!q.switch)enqueue(p,t,q);
          // The native queue orders every enqueued action by its effective priority and speed.
          let incoming=bestAttack(foe,p);
          if(policyReply?.move)incoming={...incoming,move:policyReply.move};
          if(incoming.move && !policyReply?.switch)enqueue(foe,p,{move:incoming.move});
          // Doubles partners also act: real spread targets, redirection, Wide Guard and field side effects
          // are executed by the simulator. Unknown partner choices use their strongest known measured attack.
          for(const actor of b.getAllActive())if(actor!==p && actor!==foe && actor.hp>0){
            const target=actor.side===user.side || actor.side===user.side.allySide?foe:p;
            const move=bestAttack(actor,target).move;if(move)enqueue(actor,target,{move});
          }
          // Accuracy, priority and secondary chance of the deciding move; the rollout itself deals the damage.
          const measurement=q.switch?null:transaction(b,()=>measure(b,p,t,q.move,{...q,strategy:true,facts:true}),involved(b,p,t));
          const reply=()=>{
            const attacker=opposing(),defender=own();
            if(!attacker || !defender || attacker.hp<=0 || defender.hp<=0 || attacker.fainted || defender.fainted)return;
            if(policyReply?.switch){const reserve=findPokemon(b,policyReply.switch);if(reserve && !reserve.isActive && reserve.hp>0){b.actions.switchIn(reserve,foeSlot);b.actions.runSwitch(reserve);afterAction(foeOf);}return;}
            const move=attacker===foe && defender===p?incoming.move:bestAttack(attacker,defender).move;
            if(move){execute(attacker,defender,{move});afterAction(foeOf);}
          };
          if(policyReply?.switch)reply();
          b.queue.sort();
          const actions=b.queue.list.filter(a=>a.choice==='move');
          for(const action of actions){
            const actor=action.pokemon;if(!actor.isActive || actor.hp<=0 || actor.fainted){b.queue.cancelMove(actor);continue;}
            if(actor===p && !q.switch){const target=t.isActive || t.side===user.side?t:opposing();if(target){execute(p,target,q,connect,secondary);afterAction(foeOf);}}
            else if(actor===foe)reply();
            else{const target=actor.side===user.side || actor.side===user.side.allySide?opposing():own();if(target?.hp>0){execute(actor,target,{move:action.move.id});afterAction(foeOf);}}
          }
          const hpImmediate=hpValue(before);
          // The move's own value for the multiplicative source rule: damage dealt to the opposing side (percent).
          const dealt=before.filter(r=>r.p.side!==user.side && r.p.side!==user.side.allySide).reduce((s,r)=>s+Math.max(0,(r.hp-r.p.hp/r.p.maxhp)*100),0);
          // End of turn as in runAction's residual case, then the simulator's own next-turn boundary
          // (DisableMove/choice locks, trapping, Dynamax expiry, per-turn history), so the lasting matchup
          // describes the state in which the next decision is actually made.
          b.clearActiveMove(true);
          if(!b.ended){b.updateSpeed();b.residualEvent('Residual');afterAction(foeOf);}
          // Fainted actives are replaced before the next turn, as the simulator's end-of-turn switch requests do:
          // Healing Wish and Lunar Dance act on the replacement, and the next matchup is against whoever comes in.
          for(const side of b.sides.filter(Boolean))side.active.forEach((a,slot)=>{
            if(!a || !(a.fainted || a.hp<=0) || b.ended)return;
            const r=pivotReplacement(a,foeOf(a));
            if(r){b.actions.switchIn(r,slot);b.actions.runSwitch(r);b.faintMessages();if(b.gen>=5)b.eachEvent('Update');}
          });
          if(!b.ended)b.nextTurn();
          const residual=hpValue(before)-hpImmediate;
          // A charging two-turn move (Solar Beam, Fly, Razor Wind...) strikes next turn: the strike is measured
          // now and credited at a discount; fields that skip the charge already deal the damage in the rollout.
          let deferred=0;
          const charging=own()?.volatiles.twoturnmove,striker=own(),struck=opposing();
          if(charging?.move && striker===p && struck && struck.hp>0){
            const m=transaction(b,()=>measure(b,striker,struck,charging.move,{strategy:true,secondaries:false}),involved(b,striker,struck));
            if(!m.fails && !m.immune && m.category!=='Status')deferred=.8*Math.min(100,(m.maxDamage || 0)*.925*(m.accuracy===true?1:(m.accuracy || 0)/100)/struck.maxhp*100);
          }
          const envAfter=environment(),fieldChanged=state(b).id!==decisionField;
          let disruption=0,disruptionRatio=1;
          if(fieldChanged && !q.switch){
            const view=disruptionFor(foe);
            disruptionRatio=sourceDisruptionScore(view,originalOf(decisionField))/sourceDisruptionScore(view,originalOf(state(b).id));
            disruption=(Math.sqrt(disruptionRatio)-1)*Math.max(25,dealt);
          }
          // Overlays, durations and expiry keep the team field-affinity valuation; a main-field change made by the
          // candidate is valued by the source disruption rule instead, so it is not counted twice.
          // Field changes the source disruption table rates neutral at both ends (e.g. Flower Garden stages) keep the
          // team field-affinity valuation.
          const rated=fieldChanged && !q.switch && disruptionRatio!==1;
          const future=envAfter!==fieldBefore?(rated?teamValue(true)-reserveBefore:teamValue()-utilityBefore):0;
          const mine=own(),theirs=opposing();
          const tactical=mine && theirs && mine.hp>0 && theirs.hp>0 && !mine.fainted && !theirs.fainted?matchup(mine,theirs)-tacticalBefore:0;
          const lasting=lastingValue()-lastingBefore;
          const preference=sourcePreference(q),sourceWeight=(preference-1)*Math.max(5,.15*dealt+Math.max(0,lasting+deferred));
          const context=reserveContextValue();
          const contextChanged=b.field.weather!==contextBefore.weather || b.field.terrain!==contextBefore.terrain || Object.keys(b.field.pseudoWeather).sort().join(',')!==contextBefore.rooms;
          const turns=Math.max(b.field.weatherState?.duration || 0,b.field.terrainState?.duration || 0,...Object.values(b.field.pseudoWeather).map(s=>s.duration || 0));
          const durationValue=contextChanged?Math.min(2,Math.max(0,turns-1)/5)*(12*tactical+context):0;
          // Source Starlight party rule: concealing the stars is useful when no living ally uses their boosts.
          // Both parties are considered; the source only examines its own party.
          const stars=originalOf(decisionField)==='STARLIGHT' && b.field.weather!==contextBefore.weather
            ?(b.field.weather?1:-1)*6*(foes.filter(p=>p.getTypes().some(t=>['Dark','Fairy','Psychic'].includes(t))).length-
              team.filter(p=>p.getTypes().some(t=>['Dark','Fairy','Psychic'].includes(t))).length):0;
          // Use limited rollout, giving setup, recovery, recoil, traps/protect and temporary expiry
          // their actual consequences. The native AI continues to supply its detailed family heuristics.
          const score=hpImmediate+.7*residual+22*future+disruption+12*tactical+lasting+deferred+sourceWeight+context+durationValue+stars;
          return {query:q,score,fieldValue:22*future+disruption,disruptionRatio,tacticalValue:tactical,immediate:hpImmediate,residual,lasting,deferred,
            fieldAfter:state(b)?.id,overlayAfter:state(b)?.overlay?.id || null,durationAfter:state(b)?.duration || 0,
            userHp:p.hp,targetHp:t.hp,userSpeedAfter:p.getStat('spe'),targetSpeedAfter:t.getStat('spe'),accuracy:measurement?.accuracy,priority:measurement?.priority,
            sourceWeight,contextValue:context+stars,durationValue,reply:policyReply || {move:incoming.move},
            secondaryChance:measurement?.secondaryChance ?? 0,activeAfter:own()?.uuid || null,opposingAfter:opposing()?.uuid || null,
            activeAfterBoosts:own()?{...own().boosts}:null};
      }));});
      const blend=(row,other,weight)=>{for(const key of ['score','fieldValue','disruptionRatio','tacticalValue','immediate','residual','lasting','deferred','sourceWeight','contextValue','durationValue'])row[key]=weight*row[key]+(1-weight)*other[key];};
      const outcomes=(q,reply)=>{
        const hit=candidate(q,true,true,reply),chance=q.switch || hit.accuracy===true?1:Math.max(0,Math.min(1,(hit.accuracy || 0)/100));
        const effect=hit.secondaryChance;
        if(effect>0 && effect<1){
          const plain=timed('branches',()=>candidate(q,true,false,reply));
          hit.secondaryOutcomes=[{probability:effect,field:hit.fieldAfter},{probability:1-effect,field:plain.fieldAfter}];
          blend(hit,plain,effect);
        }
        if(chance<1){
          const miss=timed('branches',()=>candidate(q,false,undefined,reply));blend(hit,miss,chance);
          hit.outcomes=[{probability:chance,field:hit.fieldAfter,overlay:hit.overlayAfter},{probability:1-chance,field:miss.fieldAfter,overlay:miss.overlayAfter}];
        }
        return hit;
      };
      // Deterministic screening before complete rollouts. Ordinary moves, Z-moves, Dynamax variants (Max moves set
      // weather and terrain) and the native choice are always rolled out. Mega/Ultra/Tera variants keep the best
      // `gimmickMoves` moves per gimmick by a simulator measurement under that gimmick (immediate damage share,
      // KO, field transition); switches keep the best `switches` reserves by switch-in preference. In doubles, the
      // same move and gimmick aimed at different targets keeps the best `targets` targets by that measurement (an
      // ally hit counts against it). Screened candidates are reported explicitly and the consumer keeps its own
      // decision for them.
      const limits={gimmickMoves:request.screen?.gimmickMoves ?? 2,switches:request.screen?.switches ?? 2,targets:request.screen?.targets ?? 1};
      const screenedOut=new Map();
      const formGimmicks=['mega','ultra','terastallize'];
      const measuredValue=q=>{
        try{
          const t=findPokemon(b,q.target) || opponents[0];
          const m=transaction(b,()=>{applyEvaluationGimmick(b,user,q.gimmick);
            return measure(b,user,t,q.move,{strategy:true,secondaries:false,...(q.gimmick==='zmove'?{gimmick:'zmove'}:{})});},involved(b,user,t));
          const accuracy=m.accuracy===true?1:(m.accuracy || 0)/100;
          const share=m.fails || m.immune?0:Math.min(1,(m.maxDamage || 0)*.925/Math.max(1,t.hp));
          const sign=t.side===user.side || t.side===user.side.allySide?-1:1;
          return accuracy*sign*(share+(share>=1?.5:0))+(m.changesFieldTo?2:0)+(m.category==='Status'?.25:0);
        }catch(_){return -Infinity;}
      };
      if(request.screen!==false)timed('screening',()=>{
        const groups=new Map(),targets=new Map(),targetKey=q=>q.move+'/'+(q.gimmick || '');
        for(const q of request.candidates || [])if(q.move && !formGimmicks.includes(q.gimmick))targets.set(targetKey(q),(targets.get(targetKey(q)) || 0)+1);
        for(const q of request.candidates || []){
          if(q.native)continue;
          let group=null,value=0;
          if(q.switch){
            const r=findPokemon(b,q.switch);if(!r)continue;
            group='switch';value=switchInScore(r,threatMove(opponents[0],user));
          }else if(formGimmicks.includes(q.gimmick)){group=q.gimmick;value=measuredValue(q);}
          else if(targets.get(targetKey(q))>1){group='target:'+targetKey(q);value=measuredValue(q);}
          if(!group)continue;
          if(!groups.has(group))groups.set(group,[]);
          groups.get(group).push({q,value});
        }
        for(const [group,rows]of groups){
          const keep=group==='switch'?limits.switches:group.startsWith('target:')?limits.targets:limits.gimmickMoves;
          rows.sort((x,y)=>y.value-x.value);
          rows.slice(keep).forEach((row,i)=>screenedOut.set(row.q,{group,value:row.value,rank:keep+i+1}));
        }
      });
      const replyOptions=[];
      for(const q of request.candidates || []){
        if(screenedOut.has(q)){candidates.push({query:q,pruned:'screened',screen:screenedOut.get(q)});continue;}
        try{
          const target=findPokemon(b,q.target),foe=target && target.side!==user.side?target:opponents[0];
          const policy=opponentPolicy(foe);
          const hit=outcomes(q);
          // A single additional strategic reply prevents automatic attack-only assumptions without a minimax tree.
          // Protect is conditional on an incoming attack; a useful status/speed-control reply remains possible.
          let alternative=policy.utility;
          if(policy.protection && !q.switch && b.dex.moves.get(q.move).flags?.protect)alternative=policy.protection;
          const locked=user.volatiles.lockedmove || ['outrage','thrash','petaldance','ragingfury'].includes(q.move);
          if(policy.reserve && locked && !foe.trapped)alternative={switch:policy.reserve.uuid};
          if(alternative && alternative.move!==hit.reply.move)replyOptions.push({q,hit,alternative});
          candidates.push(hit);
        }catch(error){candidates.push({query:q,error:String(error.message || error)});}
      }
      // Forecast utility for every candidate, but fully branch the strongest contenders plus native choices,
      // explicit utility counters and distinct field changes. Exhaustively doubling all rollouts stalls the
      // interpreter-only server. The cheap risk term comes from the already measured opponent policy.
      const counterMoves=new Set(['taunt','encore','disable','spite','haze','clearsmog','topsyturvy','imprison']);
      replyOptions.sort((a,c)=>c.hit.score-a.hit.score);
      for(let i=0;i<replyOptions.length;i++){
        const {q,hit,alternative}=replyOptions[i],m=q.move?b.dex.moves.get(q.move):null;
        if(request.screen===false || i<(request.screen?.replies ?? 2) || q.native || counterMoves.has(q.move) || m?.forceSwitch || hit.fieldAfter!==decisionField || hit.overlayAfter!==(state(b)?.overlay?.id || null)){
          const reply=timed('branches',()=>outcomes(q,alternative));
          hit.replyOutcomes=[{probability:.65,reply:hit.reply,score:hit.score},{probability:.35,reply:alternative,score:reply.score}];
          blend(hit,reply,.65);
        }else{
          const risk=hit.targetHp>0 && alternative.value>0?.35*alternative.value:0;
          hit.score-=risk;hit.replyEstimate={reply:alternative,measuredPolicyRisk:risk,reason:'bounded contender forecast'};
        }
      }
      const currentGains=new Map();
      timed('resources',()=>{for(const row of candidates)if(!row.error && !row.pruned && row.query.gimmick && team.length>1){
        let t=findPokemon(b,row.query.target) || opponents[0];if(t.side===user.side || t.side===user.side.allySide)t=opponents[0];
        const key=row.query.gimmick+'/'+t.uuid;
        if(!currentGains.has(key)){let gain=0;try{gain=resourceGain(user,t,row.query.gimmick);}catch(_){}currentGains.set(key,gain);}
        row.opportunityCost=22*Math.max(0,bestReserve(row.query.gimmick,t)-currentGains.get(key));
        row.score-=row.opportunityCost;
      }});
      return {candidates,metrics:{damageCalls,cacheHits,damageMillis,damageMechanicsMillis,candidates:candidates.length,
        screened:candidates.filter(r=>r.pruned).length,phases}};
    });
  }
  // Reference diagnostics walk the whole catalog; they are computed on request, not on every publication.
  global.RejuvenationEngine={load(json){const data=typeof json==='string'?JSON.parse(json):json;validate(data);installDeclaredFieldAssets(data);installDeclaredAbilities(data);catalog=freeze(data);return '{}';},
    references(){return JSON.stringify(catalog?references(catalog):{});},attach,change,destroy,progress,current,test,runActions,
    /** Read-only effective-move evaluation for a Cobblemon battle UUID (or a Battle); returns JSON text. */
    evaluate(battle,queries){const b=typeof battle==='string'?battlesById.get(battle):battle;const list=typeof queries==='string'?JSON.parse(queries):queries;
      if(!b)return JSON.stringify({field:null,overlay:null,results:[]});return JSON.stringify(evaluate(b,list));},
    strategy(battle,request){const b=typeof battle==='string'?battlesById.get(battle):battle;
      return JSON.stringify(b?strategy(b,typeof request==='string'?JSON.parse(request):request):{candidates:[]});},
    /** One strategy decision and one preview evaluation on a throwaway, unregistered battle: the interpreter-only
     *  runtime then pays its first-use cost at catalog publication instead of during the first AI decision. */
    warmup(){
      const started=Date.now(),b=new Battle({formatid:'cobblemonsingles',seed:[1,2,3,4]});
      try{
        attach(b,catalog?.default || indoor);
        const set=(species,ability,moves,n)=>({species,ability,moves,uuid:'00000000-0000-0000-0000-00000000000'+n,movesInfo:moves.map(()=>({pp:20,maxPp:20}))});
        b.setPlayer('p1',{name:'A',team:[set('Mew','Synchronize',['psychic','surf','growth','recover'],1),set('Scizor','Technician',['bulletpunch','uturn','swordsdance','roost'],3)]});
        b.setPlayer('p2',{name:'B',team:[set('Snorlax','Thick Fat',['bodyslam','earthquake','curse','rest'],2)]});
        b.choose('p1','team 12');b.choose('p2','team 1');
        const user=b.sides[0].active[0],target=b.sides[1].active[0];
        strategy(b,{user:user.uuid,candidates:[...user.moveSlots.map(s=>({move:s.id,target:target.uuid})),{switch:b.sides[0].pokemon[1].uuid}]});
        evaluate(b,user.moveSlots.map(s=>({user:user.uuid,target:target.uuid,move:s.id,range:true})));
      }finally{b.destroy();}
      return JSON.stringify({millis:Date.now()-started});
    },
    battle(id){return battlesById.get(id) || null;},
    /** Source AI strategy weights (read-only), for the Ruby-oracle comparison of the generated ports. */
    sourceDisruption(view,original,overlay,violent){return sourceDisruptionScore(typeof view==='string'?JSON.parse(view):view,original,!!overlay,!!violent);},
    sourceAffinity(battle,uuid,original){const b=typeof battle==='string'?battlesById.get(battle):battle,p=b && findPokemon(b,uuid);
      const field=Object.values((state(b)?.catalog || catalog).fields).find(f=>f.originalId===original);return p && field?sourceAffinity(b,p,field):null;},
    resolve(environment){for(const r of catalog.mappings)if(Object.entries(r).every(([k,v])=>!['biome','dimension','tag','submerged','maxY','skyVisible','minDepth'].includes(k) || (k==='tag'?environment.tags?.includes(v):k==='maxY'?environment.y<=v:k==='minDepth'?environment.depth>=v:environment[k]===v)))return r.field;return catalog.default;},
  };
  function validate(data) {
    if(!data.fields || !data.fields[indoor])throw new Error('Missing no-field definition');
    if(data.trainers!==undefined){
      if(!data.trainers || typeof data.trainers!=='object' || Array.isArray(data.trainers))throw new Error('Invalid trainer field map');
      for(const [id,row]of Object.entries(data.trainers)){
        if(!/^[a-z0-9_.-]+$/.test(id) || !row || typeof row!=='object' || Object.keys(row).some(k=>!['field','winShare','indoorWinShare'].includes(k)) || !data.fields[row.field] || row.field===indoor)throw new Error('Invalid trainer field '+id);
        for(const k of ['winShare','indoorWinShare'])if(row[k]!==undefined && (typeof row[k]!=='number' || row[k]<0 || row[k]>1))throw new Error('Invalid trainer score '+id);
      }
    }
    const knownConditions=new Set(['always','all','any','not','move','sourceMove','moveType','category','flag','field','backup','grounded','ability','item','type','species','form','formName','status','weather','weatherFor','incomingWeather','startedCondition','damageSource','counter','hp','priority','foe','missed','volatile','value','semiInvulnerable','globalAbility','effectiveness','turnsActive','level','stateFlag','overlay','weatherActive','pokemonStatus','targetStatus','chance','samePokemon','statsLowered','selfInflicted','contact','hasAlly','level','transformed','wild','itemStealable','usableMove','pokemonActive','pokemonFlag','statSumComparison','sideAbility','sideCondition','role','moveTarget','fullHealing','faster','lastMove','attackType','foeFainted','effectiveAbility','pseudoWeather','abilityChangedType','basePower','holderAllied','hitEffectiveness','allyAbility','variableMultihit','holderIsUser','sideItem','holderAbilityState','baseMoveType','actorType','boostStage','connected','effectId','calledBy','accuracyMiss','damageDealt','drainHealed','canFlinch','baseCanFlinch','sheerForce','allyCanHeal','oneHitKO','zMove','immunityType','volatileSourceMove','canHeal']);
    const knownActions=new Set(['multiply','add','set','cap','reject','message','boost','heal','damage','status','ability','type','moveType','volatile','consume','form','forcedType','itemForm','randomType','randomForm','forEach','abilityMessage','addSecondary','stealItem','preventStatLoss','secondaryChance','pseudoWeather','progress','changeField','destroyField','oldCategory','inverse','ice_spikes','accuracy_cloud','arm_eruption','cave_collapse','mist_explosion','water_pollution','bothHazards','hazardBurst','restoreTypes','trap','setHPFraction','harvestBerry','volatileDuration','clearHazards','sideCondition','typedDamage','spikeDamage','trickRoom','wish','perishSong','removeVolatile','cureStatus','randomBoost','randomStat','randomStatus','conditional','transferStat','castling','counter','setFlag','setPokemonFlag','bindFieldClock','weatherTemporary','hpPower','cyclePower','randomPower','extraType','residualDamage','flashFire','concertNoise','moveMessage','groupMessage','clearWeather','setWeather','clearOverlay','moveProperty','adjustWish','mimicry','survive','moveBehavior','criticalStage','weightDelta','removeCallbacks','pairField','createField','baseAccuracy','clearBoosts','identifyItems','boostByHighestStat','streakPower','healByDamage','damageShare','fieldMove','randomWeather','reconcileWeather']);
    const knownEvents=new Set('activate fieldResidual residual switchIn pokemonEntry basePower modifyMove afterMove accuracy priority damage attack specialAttack defense specialDefense speed tryHeal setStatus tryHit weatherChange effectiveness receivedDamage tryVolatile criticalRatio weight chargeMove tryMove overlayIn formChange setWeather afterHit pseudoWeatherStart perfectAccuracy baseAccuracy criticalHit tryFlinch flinch snatch afterFaint weatherReconcile criticalMessage modifyMoveLate sideConditionStart fractionalPriority trapPokemon'.split(' '));
    function checkCondition(c) {
      if(!c || Object.keys(c).length!==1 || !knownConditions.has(Object.keys(c)[0]))throw new Error('Malformed condition '+JSON.stringify(c));const [k,v]=Object.entries(c)[0];
      if(c.all||c.any){if(!Array.isArray(v) || !v.length)throw new Error('Empty Boolean condition');v.forEach(checkCondition);}if(c.not)checkCondition(c.not);
      if(['role','type','species','form','formName','grounded','volatile','ability','effectiveAbility','sideAbility','allyAbility','item','sideItem','semiInvulnerable','lastMove'].includes(k) && !['user','target'].includes(v?.who))throw new Error('Invalid condition subject '+k);
      if(k==='formName' && typeof v?.value!=='string')throw new Error('Invalid form name');
      if(k==='incomingWeather' && (!Array.isArray(v) || !v.length || v.some(w=>!['sunnyday','raindance','sandstorm','hail','snow','desolateland','primordialsea','deltastream','shadowsky'].includes(w))))throw new Error('Invalid incoming weather');
      if(k==='weatherFor' && (!['user','target'].includes(v?.who) || !Array.isArray(v?.values) || !v.values.length || v.values.some(w=>!['sunnyday','raindance','sandstorm','hail','snow','desolateland','primordialsea','deltastream','shadowsky'].includes(w))))throw new Error('Invalid subject weather');
      if(['effectId','calledBy'].includes(k) && (typeof v!=='string' || !/^[a-z0-9]+$/.test(v)))throw new Error('Invalid effect identifier predicate');
      if(k==='boostStage' && (!v || !['user','target'].includes(v.who) || !['atk','def','spa','spd','spe','accuracy','evasion'].includes(v.stat) || !['>','>=','<','<=','=='].includes(v.op) || !Number.isInteger(v.value) || Math.abs(v.value)>6))throw new Error('Invalid stage predicate');
      if(k==='actorType' && (!v || !['user','target'].includes(v.who) || !Array.isArray(v.values) || !v.values.length || v.values.some(a=>!['wild','player','npc'].includes(a))))throw new Error('Invalid actor type predicate');
      if(k==='holderAbilityState' && !['resisted'].includes(v))throw new Error('Invalid ability state predicate');
      if(k==='baseMoveType' && !types.includes(v))throw new Error('Invalid base move type');
      if(k==='sideItem' && (!Array.isArray(v?.values) || !v.values.length || v.values.some(a=>typeof a!=='string' || !/^[a-z0-9]+$/.test(a))))throw new Error('Invalid side item list');
      if(k==='allyAbility' && (!Array.isArray(v?.values) || !v.values.length || v.values.some(a=>typeof a!=='string' || !/^[a-z0-9]+$/.test(a))))throw new Error('Invalid ally ability list');
      if(['counter','priority','value','hp','effectiveness','turnsActive','level','basePower','hitEffectiveness'].includes(k) && (!['>','>=','<','<=','=='].includes(v?.op) || !Number.isFinite(v[k==='hp'?'fraction':'value'])))throw new Error('Malformed comparison '+k);
      if(k==='faster' && typeof v?.stored!=='boolean')throw new Error('Malformed speed comparison');
      if(k==='lastMove' && (!Array.isArray(v?.values) || !v.values.length))throw new Error('Malformed history condition');
      if(['always','foe','missed','weatherActive','fullHealing','foeFainted','samePokemon','hasAlly','transformed','itemStealable','statsLowered','selfInflicted','abilityChangedType','holderAllied','variableMultihit','holderIsUser','connected','accuracyMiss','damageDealt','drainHealed','canFlinch','baseCanFlinch','sheerForce','allyCanHeal','oneHitKO','zMove'].includes(k) && typeof v!=='boolean')throw new Error('Expected Boolean '+k);
      if(k==='pokemonFlag' && (!v || Object.keys(v).sort().join()!=='id,value,who' || !['user','target'].includes(v.who) || !/^[a-z][a-z0-9_]*$/.test(v.id) || typeof v.value!=='boolean'))throw new Error('Invalid Pokemon flag predicate');
      if(k==='statSumComparison' && (!v || !['foes','allies'].includes(v.group) || !['>','>=','<','<=','=='].includes(v.op) || !['atk','def','spa','spd','spe'].includes(v.left) || !['atk','def','spa','spd','spe'].includes(v.right)))throw new Error('Invalid stat sum comparison');
      if(k==='chance')checkProbability(v);
      if(k==='volatileSourceMove' && (!v || Object.keys(v).sort().join()!=='id,move,who' || !['user','target'].includes(v.who) || !/^[a-z0-9]+$/.test(v.id) || !/^[a-z0-9]+$/.test(v.move) || !RegistryDex.moves.get(v.move).exists))throw new Error('Invalid volatile source move');
      if(k==='immunityType' && (!Array.isArray(v) || !v.length || v.some(t=>!['hail','sandstorm','shadowsky'].includes(t))))throw new Error('Invalid immunity type');
      if(k==='canHeal' && (!v || Object.keys(v).sort().join()!=='value,who' || !['user','target'].includes(v.who) || typeof v.value!=='boolean'))throw new Error('Invalid healing predicate');
      if(k==='pseudoWeather' && (!v || Object.keys(v).sort().join()!=='id,value' || !['gravity','mudsport','trickroom','magicroom','wonderroom','iondeluge'].includes(v.id) || typeof v.value!=='boolean'))throw new Error('Invalid field condition');
      if(['contact','wild','usableMove','pokemonActive'].includes(k) && (!v || !['user','target'].includes(v.who) || k==='wild' && typeof v.value!=='boolean'))throw new Error('Invalid actor/contact predicate');
    }
    function checkProbability(a){if(!a || !Number.isInteger(a.numerator) || !Number.isInteger(a.denominator) || a.numerator<0 || a.denominator<1 || a.numerator>a.denominator || a.denominator>10000)throw new Error('Invalid probability');}
    function checkStatMap(value){if(!value || Array.isArray(value) || !Object.keys(value).length || Object.entries(value).some(([k,v])=>!['atk','def','spa','spd','spe','accuracy','evasion'].includes(k) || !Number.isInteger(v) || !v || Math.abs(v)>12))throw new Error('Invalid stat map');}
    function checkStatusPool(a){if(!Array.isArray(a.values) || !a.values.length || a.values.some(v=>!['brn','frz','par','psn','tox','slp','ptr'].includes(v)))throw new Error('Invalid random status pool');if(a.force){checkCondition(a.force.condition);if(!a.values.includes(a.force.status))throw new Error('Invalid forced status');}}
    function checkActions(actions){for(const a of actions || []){
      if(!a || typeof a!=='object' || Array.isArray(a))throw new Error('Invalid action');
      if(a.who!==undefined && !['user','target'].includes(a.who))throw new Error('Invalid action subject');
      if(a.op==='conditional'){checkCondition(a.condition);if(!Array.isArray(a.actions))throw new Error('Missing conditional actions');checkActions(a.actions);}
      if(a.op==='setPokemonFlag' && (!/^[a-z][a-z0-9_]*$/.test(a.id) || typeof a.value!=='boolean'))throw new Error('Invalid Pokemon flag action');
      if(a.op==='setWeather' && a.keepDuration!==undefined && a.keepDuration!==true)throw new Error('Invalid weather clock policy');if(a.op==='setWeather' && a.duration!==undefined && (!Number.isInteger(a.duration) || a.duration<=0 || a.duration>20 || a.keepDuration))throw new Error('Invalid weather duration');if(a.op==='setWeather' && a.onSuccess!==undefined){if(!Array.isArray(a.onSuccess))throw new Error('Invalid weather success actions');checkActions(a.onSuccess);}
      if(a.op==='randomWeather'){if(!Number.isInteger(a.duration) || a.duration<1 || a.duration>20 || typeof a.force!=='boolean' || !Array.isArray(a.choices) || a.choices.length<2 || new Set(a.choices.map(c=>c.id)).size!==a.choices.length || a.choices.some(c=>Object.keys(c).sort().join()!=='id,message' || !['sunnyday','raindance','sandstorm','hail','snow','desolateland','primordialsea','deltastream','shadowsky'].includes(c.id) || typeof c.message!=='string'))throw new Error('Invalid weather cycle');}
      if(a.op==='forEach'){if(!['foes','allies','others'].includes(a.group) || !Array.isArray(a.actions))throw new Error('Invalid action group');checkActions(a.actions);}
      if(a.op==='forcedType' && !types.includes(a.type))throw new Error('Invalid forced type');
      if(a.op==='itemForm' && (!/^[a-z0-9]+$/.test(a.defaultSpecies) || !types.includes(a.defaultType) || !Array.isArray(a.variants) || !a.variants.length || a.variants.some(v=>Object.keys(v).sort().join()!=='items,species,type' || !Array.isArray(v.items) || !v.items.length || v.items.some(i=>!/^[a-z0-9]+$/.test(i)) || !/^[a-z0-9]+$/.test(v.species) || !types.includes(v.type))))throw new Error('Invalid item form');
      if(a.op==='randomType' && (!Array.isArray(a.values) || !a.values.length || a.values.some(t=>!types.includes(t)) || a.force!==undefined && typeof a.force!=='boolean'))throw new Error('Invalid random type');
      if(a.op==='randomForm' && (!Array.isArray(a.variants) || a.variants.length<2 || a.variants.some(v=>!RegistryDex.species.get(v.species).exists || !types.includes(v.type))))throw new Error('Invalid random forms');
      if(a.sourceAbility!==undefined && (a.op!=='boost' || a.sourceAbility!=='intimidate'))throw new Error('Invalid boost source ability');
      if(a.silent!==undefined && (a.op!=='volatile' || typeof a.silent!=='boolean'))throw new Error('Invalid silent volatile');
      if(a.op==='secondaryChance' && (a.volatileStatus!==undefined && a.volatileStatus!=='flinch' || a.chance!==undefined && (!Number.isInteger(a.chance) || a.chance<0 || a.chance>100) || a.multiplier!==undefined && (!Number.isFinite(a.multiplier) || a.multiplier<0)))throw new Error('Invalid secondary chance');
      if(a.op==='addSecondary' && (a.duplicateKey!=='volatileStatus' || !['flinch','confusion'].includes(a.effect?.volatileStatus) || !Number.isInteger(a.effect?.chance) || a.effect.chance<1 || a.effect.chance>100 || Object.keys(a.effect).some(k=>!['chance','volatileStatus'].includes(k))))throw new Error('Invalid additional secondary');
      if(a.messagePlacement!==undefined && !['before','after'].includes(a.messagePlacement))throw new Error('Invalid message placement');
      if(a.op==='boost'){checkStatMap(a.stats);if(a.flavor!==undefined && (typeof a.flavor!=='string' || !/^[a-z ]+$/.test(a.flavor) || Object.values(a.stats).some(n=>n!==1)))throw new Error('Invalid boost flavour');if(a.source!==undefined && a.source!=='environment')throw new Error('Invalid boost source');}
      if(a.op==='typedDamage' && a.direct!==undefined && typeof a.direct!=='boolean')throw new Error('Invalid direct damage policy');
      if(a.op==='trap' && a.force!==undefined && typeof a.force!=='boolean')throw new Error('Invalid trap policy');
      if(a.op==='setHPFraction' && !(a.fraction>0 && a.fraction<=1))throw new Error('Invalid HP fraction');
      if(a.op==='volatileDuration' && (!/^[a-z0-9]+$/.test(a.id || '') || !Number.isInteger(a.amount) || !a.amount || !Number.isInteger(a.minimum) || a.minimum<1))throw new Error('Invalid volatile duration change');
      if(a.op==='clearHazards' && (typeof a.message!=='string' || !a.message))throw new Error('Invalid hazard clearing message');
      if(a.op==='hazardBurst'){
        if(!['spikes','stealthrock','stickyweb','toxicspikes'].includes(a.id) || !Array.isArray(a.messages) || !a.messages.length || a.messages.some(t=>typeof t!=='string' || !t) || Object.keys(a).some(k=>!['op','id','messages','type','fraction','perLayer','grounded','immuneTypes','poison','boosts'].includes(k)))throw new Error('Invalid hazard burst');
        if(a.boosts?(a.fraction!==undefined || Object.entries(a.boosts).some(([k,n])=>!['atk','def','spa','spd','spe','accuracy','evasion'].includes(k) || !Number.isInteger(n) || !n)):!(a.fraction>0 && a.fraction<=1))throw new Error('Invalid hazard burst effect');
        if([a.perLayer,a.grounded,a.poison].some(v=>v!==undefined && typeof v!=='boolean') || [a.type,...(a.immuneTypes || [])].some(t=>t!==undefined && !RegistryDex.types.get(t).exists))throw new Error('Invalid hazard burst filter');
      }
      if(a.op==='randomStatus')checkStatusPool(a);
      if(['randomBoost','randomStat'].includes(a.op) && (!Array.isArray(a.stats) || !a.stats.length || a.stats.some(k=>!['atk','def','spa','spd','spe','accuracy','evasion'].includes(k)) || !Number.isInteger(a.amount) || !a.amount || Math.abs(a.amount)>12))throw new Error('Invalid random stat action');
      if(a.op==='transferStat')checkStatMap({[a.stat]:a.amount});
      if(a.op==='bindFieldClock'){checkCondition(a.durationCondition);checkCondition(a.permanentCondition);}
      if(a.op==='changeField' && a.durationFromCondition && !['gravity','mudsport','trickroom','magicroom','wonderroom'].includes(a.durationFromCondition))throw new Error('Invalid duration source');
      if(a.op==='castling'){checkStatMap(a.userStats);checkStatMap(a.partnerStats);if(typeof a.message!=='string')throw new Error('Invalid castling message');}
      if(a.op==='changeField'){if(!data.fields[a.field] || a.duration!==undefined && (!Number.isInteger(a.duration) || a.duration<0 || a.duration>20) || a.force!==undefined && typeof a.force!=='boolean' || a.boundCondition!==undefined && !/^[a-z0-9]+$/.test(a.boundCondition))throw new Error('Invalid temporary field');}
      if(a.op==='createField' && (a.blockEverstone!==undefined && typeof a.blockEverstone!=='boolean' || !data.fields[a.field] || !Number.isInteger(a.duration) || a.duration<=0 || a.duration>20 || !Number.isInteger(a.extendedBy) || a.extendedBy<0 || a.extendedBy>20))throw new Error('Invalid field creation');
      if(a.op==='sideCondition' && (!['mist','safeguard','luckychant','reflect','lightscreen','auroraveil','tailwind','spikes','toxicspikes','stealthrock','stickyweb'].includes(a.id) || a.duration!==undefined && (!Number.isInteger(a.duration) || a.duration<=0 || a.duration>20)))throw new Error('Invalid side condition');
      if(a.op==='moveBehavior'){
        if(!['partialProtection','smartCategory','cureAndBoost','setTypes','appendHitActions','payHP','fixedDamage','targetWeightPower','boostOnly','shareHP','deductPP','arenaRoar','firstTypeBonus','refreshVolatileBeforeHit','reapplyStatusHeal','replaceHitActions','otherActiveHitActions','randomStatusSecondary','boostStagePower','allActiveHitActions','weightRatioPower','purify','swallow','randomPowerCallback','forceBasePower','appendSecondaryActions','alliesHitActions','beforeCalledMoveActions','randomMovePool','strengthSap','targetHealing','concertRoar','dualBoost','gatedStatChanges'].includes(a.recipe))throw new Error('Unknown move recipe');
        if(a.recipe==='refreshVolatileBeforeHit' && !/^[a-z0-9]+$/.test(a.id || ''))throw new Error('Invalid refreshed volatile');
        if(a.recipe==='reapplyStatusHeal' && (!['slp','brn','par','psn','tox','frz'].includes(a.status) || !Number.isInteger(a.duration) || a.duration<=0 || a.duration>20 || !Number.isFinite(a.fraction) || a.fraction<=0 || a.fraction>1))throw new Error('Invalid status refresh/heal');
        if(['appendHitActions','appendSecondaryActions','replaceHitActions','otherActiveHitActions','allActiveHitActions','alliesHitActions','beforeCalledMoveActions','targetHealing'].includes(a.recipe)){if(!Array.isArray(a.actions))throw new Error('Missing recipe actions');checkActions(a.actions);}
        if(['allActiveHitActions','alliesHitActions'].includes(a.recipe))checkCondition(a.condition);
        if(a.recipe==='randomStatusSecondary')checkStatusPool(a);
        if(['boostStagePower','forceBasePower'].includes(a.recipe) && (!Number.isInteger(a.base) || a.base<1 || a.base>1000))throw new Error('Invalid fixed base power');
        if(a.recipe==='weightRatioPower' && (!Number.isFinite(a.multiplier) || a.multiplier<=0 || a.multiplier>10))throw new Error('Invalid weight ratio');
        if(a.recipe==='randomPowerCallback'){checkProbability(a);if([a.base,a.boosted].some(n=>!Number.isInteger(n) || n<1 || n>1000))throw new Error('Invalid chance power');}
        if(a.recipe==='purify'){checkStatMap(a.stats);if(!Number.isFinite(a.fraction) || a.fraction<=0 || a.fraction>1)throw new Error('Invalid purification healing');}
        if(['strengthSap','concertRoar'].includes(a.recipe))checkStatMap(a.stats);
        if(a.recipe==='swallow' && (!Array.isArray(a.fractions) || a.fractions.length!==3 || a.fractions.some(v=>!Number.isFinite(v) || v<=0 || v>1) || !Number.isInteger(a.cureAt) || a.cureAt<1 || a.cureAt>3))throw new Error('Invalid stockpile healing');
        if(a.recipe==='gatedStatChanges'){checkStatMap(a.stats);checkStatMap(a.gateStats);if(!['user','target'].includes(a.gateWho) || typeof a.selfSwitch!=='boolean' || typeof a.failureMessage!=='string')throw new Error('Invalid gated stat change');}
      if(a.recipe==='smartCategory'){
        if(!['offense','difference'].includes(a.comparison) || typeof a.contactByCategory!=='boolean')throw new Error('Invalid smart category');
        for(const key of ['physicalMultipliers','specialMultipliers','defenseMultipliers','specialDefenseMultipliers']){if(!Array.isArray(a[key]))throw new Error('Missing category multipliers');for(const row of a[key]){if(Object.keys(row).sort().join()!=='condition,factor' || !Number.isFinite(row.factor) || row.factor<=0 || row.factor>4)throw new Error('Invalid category multiplier');checkCondition(row.condition);}}
      }
      if(a.recipe==='dualBoost'){checkStatMap(a.targetStats);checkStatMap(a.userStats);}
        if(a.recipe==='randomMovePool' && (!Number.isInteger(a.minimumPower) || a.minimumPower<1 || a.minimumPower>1000 || !Array.isArray(a.choices) || !a.choices.length || new Set(a.choices).size!==a.choices.length || a.choices.some(mid=>!RegistryDex.moves.get(mid).exists)))throw new Error('Invalid random move pool');
        if(a.recipe==='beforeCalledMoveActions' && a.callback!=='onTryHit')throw new Error('Invalid caller callback');
        if(a.recipe==='targetHealing' && [a.fraction,a.userFraction ?? a.fraction].some(v=>!Number.isFinite(v) || v<=0 || v>1))throw new Error('Invalid target healing');
        if(a.silentCommands && (!Array.isArray(a.silentCommands) || !a.silentCommands.length || a.silentCommands.some(v=>!['swap','-start','-status'].includes(v))))throw new Error('Invalid silent command policy');
        if(a.recipe==='appendHitActions' && !['onHit','onHitSide','onAfterHit','onHitField'].includes(a.callback || 'onHit'))throw new Error('Invalid hit action callback');
        if(a.recipe==='deductPP' && (!Number.isInteger(a.amount) || a.amount<=0 || a.amount>64))throw new Error('Invalid PP deduction');
        if(a.recipe==='firstTypeBonus' && (!types.includes(a.type) || !Number.isInteger(a.repeat) || a.repeat<1 || a.repeat>3 || typeof a.positiveOnly!=='boolean'))throw new Error('Invalid first-type bonus');
        if(a.recipe==='payHP' && (!Number.isFinite(a.fraction) || a.fraction<=0 || a.fraction>1 || !['onHit','onAfterMove'].includes(a.callback || 'onHit') || a.requireHit!==undefined && (a.requireHit!==true || a.callback!=='onAfterMove')))throw new Error('Invalid HP cost');
      }
      if(a.op==='criticalStage' && (!['focusenergy','dragoncheer'].includes(a.id) || !Number.isInteger(a.stage) || a.stage<1 || a.stage>3))throw new Error('Invalid critical stage');
      if(a.op==='weightDelta' && (!Number.isFinite(a.baseMultiplier) || a.baseMultiplier<=0))throw new Error('Invalid weight increment');
      if(a.op==='forEach'){if(a.anchor!==undefined && a.anchor!=='holder' || a.order!==undefined && a.order!=='speed' || a.message!==undefined && typeof a.message!=='string')throw new Error('Invalid iteration options');if(a.condition)checkCondition(a.condition);}
      if(a.op==='heal' && a.messageFrom!==undefined && a.messageFrom!=='user')throw new Error('Invalid healing message actor');
      if(a.op==='fieldMove' && (!/^[a-z0-9]+$/.test(a.move || '') || !RegistryDex.moves.get(a.move).exists))throw new Error('Invalid field move');
      if(a.op==='heal' && a.failureMessage!==undefined && typeof a.failureMessage!=='string')throw new Error('Invalid healing failure message');
      if(a.op==='removeCallbacks' && (!Array.isArray(a.callbacks) || !a.callbacks.length || a.callbacks.some(c=>!['onPrepareHit','onTry','onTryHit','onModifyMove','onHit','basePowerCallback'].includes(c))))throw new Error('Invalid callback removal list');
      if(a.op==='pairField'){
        if(!['pledge','conversion'].includes(a.memory) || !Number.isInteger(a.duration) || a.duration<=0 || a.duration>20 || !Number.isInteger(a.extendedBy) || a.extendedBy<0 || a.extendedBy>20)throw new Error('Invalid pair memory/duration');
        if(!Array.isArray(a.pairs) || !a.pairs.length || a.pairs.some(p=>!data.fields[p.field] || typeof p.message!=='string' || typeof p.refreshMessage!=='string'))throw new Error('Invalid paired field');
        if(a.disallowPermanentField && !data.fields[a.disallowPermanentField])throw new Error('Invalid permanent restriction');
      }
      if(a.op==='moveBehavior' && a.recipe==='fixedDamage'){
        if(!['level','targetHP','targetMaxHP','constant'].includes(a.basis) || !Number.isFinite(a.factor) || a.factor<=0 || a.factor>2 || (a.basis==='constant')!==(a.amount!==undefined) || a.amount!==undefined && (!Number.isInteger(a.amount) || a.amount<1 || a.amount>9999))throw new Error('Invalid fixed damage');
        if(a.randomRange && (!Number.isInteger(a.randomRange.minimum) || !Number.isInteger(a.randomRange.maximum) || a.randomRange.minimum<=0 || a.randomRange.maximum<a.randomRange.minimum || a.randomRange.maximum>1000))throw new Error('Invalid random damage range');
      }
if(a.scaleField!==undefined && (!['multiply','cyclePower','randomPower'].includes(a.op) || typeof a.scaleField!=='boolean'))throw new Error('Invalid field scaling flag');if(a.op==='moveBehavior' && a.recipe==='partialProtection' && (!Array.isArray(a.conditions) || !a.conditions.length || a.conditions.some(k=>!['protect','kingsshield','obstruct','spikyshield','banefulbunker','silktrap','burningbulwark','matblock','wideguard','quickguard'].includes(k)) || !Number.isFinite(a.fraction) || a.fraction<=0 || a.fraction>1 || typeof a.message!=='string'))throw new Error('Invalid partial protection');if(a.op==='extraType' && (!Array.isArray(a.values) || !a.values.length || a.values.some(t=>!types.includes(t)) || a.layer!==undefined && !['field','overlay'].includes(a.layer) || a.cycle!==undefined && typeof a.cycle!=='boolean' || a.excludePrimary!==undefined && typeof a.excludePrimary!=='boolean'))throw new Error('Invalid additional type roll');if(!knownActions.has(a.op))throw new Error('Unknown action '+a.op);if(a.op==='moveProperty' && !['boosts','self.boosts','secondaries.0.self.boosts','secondaries.0.self','secondaries.0.boosts','heal','recoil','basePower','damage','priority','accuracy','target','spreadModifier','sideCondition','category','status','zMove.boost','secondaries','secondaries.0.status','pseudoWeather','flags.gravity','flags.protect','flags.sound','flags.bypasssub','selfBoost','self','pranksterBoosted','forceSwitch','maxHPRecoil','magnitude','drain','ignoreImmunity','overrideOffensiveStat','overrideDefensiveStat'].includes(a.path))throw new Error('Unsafe move property');if(a.op==='moveProperty' && ['overrideOffensiveStat','overrideDefensiveStat'].includes(a.path) && !['atk','def','spa','spd','spe'].includes(a.value))throw new Error('Invalid stat override');if(a.op==='moveProperty' && a.path==='secondaries.0.self' && a.value!==null)throw new Error('Invalid secondary self override');if(a.op==='moveProperty' && a.path==='ignoreImmunity' && JSON.stringify(a.value)!=='{"Ground":true}')throw new Error('Invalid immunity override');if(a.op==='moveProperty' && a.path==='drain' && (!Array.isArray(a.value) || a.value.length!==2 || a.value.some(n=>!Number.isInteger(n) || n<1) || a.value[0]>a.value[1]))throw new Error('Invalid drain share');if(a.op==='moveProperty' && a.path==='magnitude' && (!Number.isInteger(a.value) || a.value<4 || a.value>10))throw new Error('Invalid magnitude');if(a.op==='moveProperty' && a.path==='maxHPRecoil' && (!Number.isFinite(a.value) || a.value<=0 || a.value>1))throw new Error('Invalid max-HP recoil');}}
    for(const [aid,row]of Object.entries(data.abilities || {})){
      if(!/^[a-z0-9]+$/.test(aid) || Object.keys(row).some(k=>!['name','num','description','flags','inherit','callbacks','soundMoveTypes','airborne','airborneBeforeGravity'].includes(k)) || !row.name || !row.description || (row.num!==undefined && (!Number.isInteger(row.num) || row.num<1 || row.num>10000)) || !row.flags || !row.callbacks)throw new Error('Invalid declared ability');
      if(typeof row.name!=='string' || typeof row.description!=='string' || Object.entries(row.flags).some(([k,v])=>!['breakable','cantsuppress','notrace','noreceiver','noentrain','noskillSwap','failroleplay'].includes(k) || v!==1))throw new Error('Invalid ability metadata');
      if(row.airborneBeforeGravity!==undefined && (typeof row.airborneBeforeGravity!=='boolean' || row.airborne!==true))throw new Error('Invalid gravity-independent ability');
      if(row.airborne!==undefined && typeof row.airborne!=='boolean')throw new Error('Invalid airborne ability');
      if(row.soundMoveTypes!==undefined && (!Array.isArray(row.soundMoveTypes) || !row.soundMoveTypes.length || row.soundMoveTypes.some(t=>!types.includes(t) || t==='???')))throw new Error('Invalid sound move types');
      if(row.inherit && (data.abilities[row.inherit] || !RegistryDex.mod('cobblemon').abilities.get(row.inherit).exists))throw new Error('Invalid ability inheritance');
      const existing=Cobblemon.registries.ability.get(aid) || RegistryDex.abilities.get(aid);
      if(existing.exists && !ownAbilityIds.has(aid))throw new Error('Ability definition conflicts with installed ability '+aid);
      for(const [key,callback]of Object.entries(row.callbacks)){
        if(!['onStart','onModifyMove','onBasePower','onSourceModifyAccuracy','onSourceAccuracy','onModifyCritRatio','onAllyModifyCritRatio','onTryHit','onModifyType','onModifyAtk','onModifySpA','onResidual','onDamagingHit','onImmunity','onBeforeResidual','onEnd'].includes(key) || Object.keys(callback).sort().join()!=='actions,condition,mode,source' || !['replace','append','prepend','scaleBoosts'].includes(callback.mode))throw new Error('Invalid declared callback');
        checkCondition(callback.condition);checkActions(callback.actions);
      }
    }
    for(const [name,f] of Object.entries(data.fields)) {
      for(const [type,row]of Object.entries(f.extraTypePolicies || {}))if(!types.includes(type) || Object.keys(row).sort().join()!=='mode,source' || row.mode!=='firstWeaknessTwice' || typeof row.source!=='string')throw new Error('Invalid secondary type policy');
      for(const row of f.typeFlagInteractions || [])if(Object.keys(row).sort().join()!=='attackType,flag,flagged,source,unflagged' || !types.includes(row.attackType) || !/^[a-z0-9]+$/.test(row.flag) || ![-1,0,1].includes(row.flagged) || ![-1,0,1].includes(row.unflagged) || typeof row.source!=='string')throw new Error('Invalid type flag interaction');
      if(f.clockPolicy && (!['pauseOverlay,source','pauseOverlay,pausedConditions,source'].includes(Object.keys(f.clockPolicy).sort().join()) || typeof f.clockPolicy.pauseOverlay!=='boolean' || (f.clockPolicy.pausedConditions!==undefined && (!Array.isArray(f.clockPolicy.pausedConditions) || !f.clockPolicy.pausedConditions.length || f.clockPolicy.pausedConditions.some(k=>!['trickroom','gravity','wonderroom','magicroom'].includes(k))))))throw new Error('Invalid clock policy');
      for(const [key,row]of Object.entries(f.entryWishes || {}))if(!['healingwish','lunardance'].includes(key) || Object.keys(row).sort().join()!=='boosts,message,source' || typeof row.message!=='string' || !row.message || typeof row.source!=='string' || !Object.keys(row.boosts).length || Object.entries(row.boosts).some(([k,n])=>!['atk','def','spa','spd','spe'].includes(k) || !Number.isInteger(n) || n<=0 || n>6))throw new Error('Invalid entry wish');
      if(f.silentVolatileEnds!==undefined && (!Array.isArray(f.silentVolatileEnds) || !f.silentVolatileEnds.length || f.silentVolatileEnds.some(k=>!['slowstart'].includes(k))))throw new Error('Invalid silent volatile end');
      for(const [cid,callbacks]of Object.entries(f.suppressedConditionCallbacks || {}))if(!/^[a-z0-9]+$/.test(cid) || !RegistryDex.mod('cobblemon').conditions.get(cid).exists || !Array.isArray(callbacks) || !callbacks.length || callbacks.length!==new Set(callbacks).size || callbacks.some(k=>!['onModifyAtk','onModifySpA'].includes(k)))throw new Error('Invalid condition suppression');
      for(const [aid,row]of Object.entries(f.abilityDamageCategories || {}))if(!RegistryDex.mod('cobblemon').abilities.get(aid).exists || Object.keys(row).sort().join()!=='categories,nativeCategory,source' || !Array.isArray(row.categories) || !row.categories.length || row.categories.length!==new Set(row.categories).size || row.categories.some(c=>!['Physical','Special'].includes(c)) || !['Physical','Special'].includes(row.nativeCategory) || typeof row.source!=='string')throw new Error('Invalid ability damage category');
      if(f.criticalPolicy){const p=f.criticalPolicy;if(Object.keys(p).sort().join()!=='applyScreens,condition,hideMessage,modifier,source' || !Number.isFinite(p.modifier) || p.modifier<=0 || p.modifier>2 || typeof p.applyScreens!=='boolean' || typeof p.hideMessage!=='boolean' || typeof p.source!=='string')throw new Error('Invalid critical policy');checkCondition(p.condition);}
      for(const [aid,row]of Object.entries(f.environmentAbilities || {})){if(!['quarkdrive','protosynthesis'].includes(aid) || Object.keys(row).sort().join()!=='boosterMessage,callback,condition,entryCondition,expiryMessage,messages,source' || !['onTerrainChange','onWeatherChange'].includes(row.callback) || typeof row.expiryMessage!=='string' || typeof row.boosterMessage!=='string' || typeof row.source!=='string' || !Array.isArray(row.messages) || !row.messages.length)throw new Error('Invalid environmental ability');checkCondition(row.condition);checkCondition(row.entryCondition);for(const r of row.messages){if(Object.keys(r).sort().join()!=='condition,text' || typeof r.text!=='string')throw new Error('Invalid environmental ability message');checkCondition(r.condition);}}
      for(const [iid,callbacks]of Object.entries(f.itemHandlers || {})){if(!RegistryDex.items.get(iid).exists)throw new Error('Unknown item handler');for(const [key,row]of Object.entries(callbacks)){if(!['onResidual','onStart','onModifyMove'].includes(key) || Object.keys(row).sort().join()!=='actions,condition,mode,source' || !['replace','append','prepend'].includes(row.mode))throw new Error('Invalid item handler');checkCondition(row.condition);checkActions(row.actions);}}
      for(const [aid,callbacks]of Object.entries(f.abilityHandlers || {})){if((!RegistryDex.abilities.get(aid).exists || ownAbilityIds.has(aid)) && !data.abilities?.[aid])throw new Error('Unregistered ability handler '+aid);for(const [key,row]of Object.entries(callbacks)){if(!['onStart','onResidual','onBeforeResidual','onEnd','onUpdate','onAllySwitchIn','onSetStatus','onAllySetStatus','onAnyFaint','onDamagingHit','onSourceDamagingHit','onSourceTryPrimaryHit','onTryHit','onFoeTryMove','onImmunity','onBasePower','onSourceModifyAccuracy','onSourceAccuracy','onAllyBasePower','onAnyBasePower','onModifyAtk','onModifySpA','onAllyModifyAtk','onAllyModifySpA','onAllyModifySpD','onWeatherChange','onModifyDef','onModifySpD','onModifyDamage','onSourceModifyDamage','onModifyAccuracy','onModifySpe','onModifyCritRatio','onAllyModifyCritRatio','onModifyType','onEmergencyExit','onDeductPP','onSourceAfterFaint','onAfterMoveSecondary','onModifyMove','onAfterEachBoost','onAllyTryBoost','onAllyTryAddVolatile'].includes(key) || Object.keys(row).sort().join()!=='actions,condition,mode,source' || !['replace','append','prepend','scaleBoosts'].includes(row.mode) || !Array.isArray(row.actions))throw new Error('Invalid ability handler');checkCondition(row.condition);checkActions(row.actions);}}
      for(const [key,row]of Object.entries(f.protectionPolicy || {})){
        if(!['kingsshield','obstruct','silktrap','burningbulwark','spikyshield','banefulbunker','protect'].includes(key) || Object.keys(row).some(k=>!['blockStatus','contactBoosts','contactFraction','source'].includes(k)) || typeof row.source!=='string')throw new Error('Invalid protection policy');
        if(row.blockStatus!==undefined && row.blockStatus!==true)throw new Error('Invalid protection status block');
        if(row.contactBoosts!==undefined)checkStatMap(row.contactBoosts);
        if(row.contactFraction!==undefined && (!Number.isFinite(row.contactFraction) || row.contactFraction<=0 || row.contactFraction>1))throw new Error('Invalid protection contact damage');
      }
      if(f.switchTiming!==undefined && f.switchTiming!=='action')throw new Error('Invalid switch timing');
      if(f.damageRoll!==undefined && (!Number.isInteger(f.damageRoll) || f.damageRoll<85 || f.damageRoll>100))throw new Error('Invalid fixed damage roll');
      if(f.nativeFormTyping && (!Array.isArray(f.nativeFormTyping) || !f.nativeFormTyping.length || f.nativeFormTyping.some(a=>!['arceus','silvally'].includes(a))))throw new Error('Invalid native form typing');
      if(f.inactiveAbilities && (!Array.isArray(f.inactiveAbilities) || f.inactiveAbilities.some(a=>!RegistryDex.abilities.get(a).exists)))throw new Error('Invalid inactive abilities');
      for(const row of f.statusTypeBypass || []){if(Object.keys(row).sort().join()!=='condition,source,status' || row.status!=='psn')throw new Error('Invalid status type bypass');checkCondition(row.condition);}
      for(const [key,row]of Object.entries(f.customVolatiles || {})){if(!/^rejuvenation[a-z0-9]+$/.test(key) || Object.keys(row).sort().join()!=='actions,source' || !Array.isArray(row.actions))throw new Error('Invalid custom volatile');checkActions(row.actions);}
      if(f.progression){const p=f.progression;if(typeof p.group!=='string' || !Number.isInteger(p.stage) || !Number.isInteger(p.maximum) || p.stage<1 || p.stage>p.maximum || p.statChangeShrinkMessage!==undefined && (typeof p.statChangeShrinkMessage!=='string' || !p.statChangeShrinkMessage))throw new Error('Invalid progression');}
      if(f.rampagePolicy){const row=f.rampagePolicy;if(Object.keys(row).some(k=>!['duration','noConfusionMoves','source'].includes(k)) || row.duration!==undefined && (!Number.isInteger(row.duration) || row.duration<1 || row.duration>3) || !Array.isArray(row.noConfusionMoves) || row.noConfusionMoves.some(m=>!['outrage','thrash','petaldance','ragingfury'].includes(m)))throw new Error('Invalid rampage policy');}
      if(f.multiplierPolicy){const p=f.multiplierPolicy;if(Object.keys(p).sort().join()!==['defaultDifficultyMode','defaultFieldFrenzy','casualMode','casualFactor','frenzyBoostFactor','frenzyReductionFactor','combinedMinimum','source'].sort().join() || ![0,1,2].includes(p.defaultDifficultyMode) || ![0,1,2].includes(p.casualMode) || typeof p.defaultFieldFrenzy!=='boolean' || ['casualFactor','frenzyBoostFactor','frenzyReductionFactor','combinedMinimum'].some(k=>!Number.isFinite(p[k]) || p[k]<=0 || p[k]>4))throw new Error('Invalid multiplier policy');}
      if(f.expirationReturnMessage!==undefined && typeof f.expirationReturnMessage!=='string')throw new Error('Invalid restoration message');
      for(const row of Object.values(f.conditionDurations || {})){
        if(row.sourceAbilities!==undefined && (!Array.isArray(row.sourceAbilities) || row.sourceAbilities.some(a=>typeof a!=='string' || !/^[a-z0-9]+$/.test(a))))throw new Error('Invalid duration ability filter');
        if(row.choices!==undefined && !Array.isArray(row.choices))throw new Error('Invalid clock choices');
        for(const choice of row.choices || []){
          if(Object.keys(choice).some(k=>!['condition','duration','randomRange'].includes(k)) || ('duration' in choice)===('randomRange' in choice))throw new Error('Invalid clock choice');checkCondition(choice.condition);
          if(choice.duration!==undefined && (!Number.isInteger(choice.duration) || choice.duration<=0 || choice.duration>20))throw new Error('Invalid choice duration');
          const r=choice.randomRange;if(r && (Object.keys(r).sort().join()!=='maximum,minimum' || !Number.isInteger(r.minimum) || !Number.isInteger(r.maximum) || r.minimum<1 || r.maximum<r.minimum || r.maximum>20))throw new Error('Invalid random clock');
        }
      }
      for(const [ball,value] of Object.entries(f.captureModifiers || {}))if(!/^[a-z0-9_.-]+:[a-z0-9_/.-]+$/.test(ball) || !Number.isFinite(value) || value<=0 || value>10)throw new Error('Invalid capture modifier');
      for(const row of f.captureEnvironmentModifiers || [])if(Object.keys(row).sort().join()!=='ball,multiplier,predicate,source' || !/^[a-z0-9_.-]+:[a-z0-9_/.-]+$/.test(row.ball) || !['night','underwater'].includes(row.predicate) || !Number.isFinite(row.multiplier) || row.multiplier<=0 || row.multiplier>10)throw new Error('Invalid capture environment rule');
      for(const [key,row] of Object.entries(f.persistentStatusPolicies || {})){
        if(key!=='ptr' || Object.keys(row).sort().join()!==['name','immuneTypes','immuneAbilities','sideProtectionAbility','drainAbility','invertAbility','fraction','blocksHealing','blockedHealingAbilities','drainMessage','healingFailureMessage','source'].sort().join() || !Number.isFinite(row.fraction) || row.fraction<=0 || row.fraction>1 || typeof row.blocksHealing!=='boolean')throw new Error('Invalid persistent status policy');
        for(const values of [row.immuneTypes,row.immuneAbilities,row.blockedHealingAbilities])if(!Array.isArray(values) || !values.length || values.some(v=>typeof v!=='string'))throw new Error('Invalid persistent status IDs');
        if(row.immuneTypes.some(t=>!types.includes(t)))throw new Error('Invalid persistent status type');
        for(const k of ['name','sideProtectionAbility','drainAbility','invertAbility','drainMessage','healingFailureMessage','source'])if(typeof row[k]!=='string' || !row[k])throw new Error('Invalid persistent status text/ability');
      }
      for(const [key,row] of Object.entries(f.abilityContactPolicies || {}))if(key!=='perishbody' || Object.keys(row).sort().join()!==['disabled','duration','trapDefender','forceAttackerStatus','message','source'].sort().join() || typeof row.disabled!=='boolean' || typeof row.trapDefender!=='boolean' || !Number.isInteger(row.duration) || row.duration<1 || row.duration>10 || !['','ptr'].includes(row.forceAttackerStatus) || typeof row.message!=='string')throw new Error('Invalid contact policy');
      if(f.hazardPolicy){const h=f.hazardPolicy,shape={spikes:['type','affectsAirborne','message'],stealthrock:['type','cycleTypes','multiplier','message'],stickyweb:['stages'],toxicspikes:['keepOnPoisonType']};
        if(typeof h.source!=='string' || Object.keys(h).some(k=>!['source','cleared','suspended',...['spikes','stealthrock','stickyweb','toxicspikes']].includes(k)) || (h.suspended!==undefined && h.suspended!==true) || (h.cleared!==undefined && (!Array.isArray(h.cleared) || !h.cleared.length || h.cleared.some(k=>!['spikes','stealthrock','stickyweb','toxicspikes'].includes(k)))))throw new Error('Invalid hazard policy');
        for(const [key,keys]of Object.entries(shape)){const r=h[key];if(r===undefined)continue;
          if(!Object.keys(r).length || Object.keys(r).some(k=>!keys.includes(k)) || [r.type,...(r.cycleTypes || [])].some(t=>t!==undefined && !RegistryDex.types.get(t).exists) || (r.message!==undefined && (typeof r.message!=='string' || !r.message)) || (r.multiplier!==undefined && !(r.multiplier>0)) || [r.affectsAirborne,r.keepOnPoisonType].some(v=>v!==undefined && v!==true) || (r.stages!==undefined && (!Number.isInteger(r.stages) || r.stages>=0 || r.stages<-6)) || (r.type && r.cycleTypes))throw new Error('Invalid hazard policy row');}}
      for(const row of f.effectivenessOverrides || []){if(Object.keys(row).sort().join()!=='condition,source,value' || !Number.isInteger(row.value) || Math.abs(row.value)>3 || typeof row.source!=='string')throw new Error('Invalid effectiveness override');checkCondition(row.condition);}
      if(f.revivalBlessing && (Object.keys(f.revivalBlessing).sort().join()!=='fraction,source' || !(f.revivalBlessing.fraction>0 && f.revivalBlessing.fraction<=1) || typeof f.revivalBlessing.source!=='string'))throw new Error('Invalid Revival Blessing policy');
      for(const aid of f.priorityBlockingAbilities || [])if(!RegistryDex.abilities.get(aid).exists)throw new Error('Unknown priority-blocking ability '+aid);
      for(const [key,row]of Object.entries(f.volatileMoveLocks || {}))if(!/^[a-z0-9]+$/.test(key) || Object.keys(row).sort().join()!=='move,source' || !RegistryDex.moves.get(row.move).exists || typeof row.source!=='string')throw new Error('Invalid volatile move lock');
      for(const [weather,row]of Object.entries(f.timedWeatherText || {}))if(!['sunnyday','raindance','sandstorm','hail','snow','desolateland','primordialsea','deltastream','shadowsky'].includes(weather) || Object.keys(row).sort().join()!=='endMessage,source,startMessage' || Object.values(row).some(v=>typeof v!=='string' || !v))throw new Error('Invalid timed weather text');
      if(f.weatherRainbow){const r=f.weatherRainbow;if(Object.keys(r).sort().join()!=='baseDuration,extendedDuration,extendingItems,field,groups,message,refreshMessage,source' || !data.fields[r.field] || !Array.isArray(r.groups) || r.groups.length!==2 || r.groups.some(g=>!Array.isArray(g) || !g.length || g.some(w=>!['sunnyday','raindance','sandstorm','hail','snow','desolateland','primordialsea','deltastream','shadowsky'].includes(w))) || r.groups[0].some(w=>r.groups[1].includes(w)) || ![r.baseDuration,r.extendedDuration].every(n=>Number.isInteger(n) && n>0 && n<=20) || [r.message,r.refreshMessage,r.source].some(v=>typeof v!=='string' || !v) || Object.entries(r.extendingItems).some(([w,item])=>!r.groups.flat().includes(w) || !RegistryDex.items.get(item).exists))throw new Error('Invalid weather rainbow policy');}
      for(const [from,to] of Object.entries(f.weatherConversions || {}))if(from===to || [from,to].some(w=>!['sunnyday','raindance','sandstorm','hail','snow','desolateland','primordialsea','deltastream','shadowsky'].includes(w)))throw new Error('Invalid weather conversion');
      for(const [key,row] of Object.entries(f.volatilePolicies || {}))if(key!=='nightmare' || Object.keys(row).sort().join()!==['allowAwake','suppressResidual','fraction','message','source'].sort().join() || typeof row.allowAwake!=='boolean' || typeof row.suppressResidual!=='boolean' || !Number.isFinite(row.fraction) || row.fraction<=0 || row.fraction>1 || typeof row.message!=='string')throw new Error('Invalid volatile policy');
      for(const row of Object.values(f.conditionDurations || {}))if(Object.keys(row).some(k=>!['duration','add','sourceMoves','source','choices','sourceAbilities'].includes(k)) || (('duration' in row)===('add' in row)) || !Number.isInteger(row.duration ?? row.add) || (row.duration ?? row.add)<=0 || (row.duration ?? row.add)>20 || !Array.isArray(row.sourceMoves) || !row.sourceMoves.length)throw new Error('Invalid condition clock');
      for(const row of Object.values(f.abilityAbsorptions || {})){
        if(Object.keys(row).some(k=>!['type','stat','boosts','healFractions','cycle','maximizeOverlay','source'].includes(k)) || !types.includes(row.type) || (!!row.boosts===!!row.healFractions))throw new Error('Invalid absorption policy');
        const values=row.boosts || row.healFractions;if(!Array.isArray(values) || !values.length || values.some(v=>!Number.isFinite(v) || v<0 || (row.boosts?v>6 || !Number.isInteger(v):v>1)))throw new Error('Invalid absorption values');
        if(row.boosts && !['atk','def','spa','spd','spe'].includes(row.stat))throw new Error('Invalid absorption stat');
        if(row.cycle!==undefined && typeof row.cycle!=='boolean')throw new Error('Invalid absorption cycle');
        if(row.maximizeOverlay && !data.fields[row.maximizeOverlay])throw new Error('Invalid absorption overlay');
      }
      if(f.statPools){const p=f.statPools;if(!p.borrowedOffense || Object.entries(p.borrowedOffense).some(([mid,row])=>!RegistryDex.mod('cobblemon').moves.get(mid).exists || Object.keys(row).sort().join()!=='modifierSelection,selection' || row.selection!=='staged' || row.modifierSelection!=='modifiersOnly'))throw new Error('Invalid borrowed stat pool');if(Object.keys(p).sort().join()!==['offensiveSpecial','defensiveSpecial','borrowedOffense','source'].sort().join())throw new Error('Invalid shared stat keys');for(const key of ['offensiveSpecial','defensiveSpecial'])if(!Array.isArray(p[key]) || p[key].length!==2 || [...p[key]].sort().join()!=='spa,spd')throw new Error('Invalid shared Special stats');}
      if(f.trapping){const t=f.trapping;
        if(Object.keys(t).some(k=>!['divisors','moveIncrements','statLoss','immuneAbilities','octolockAmount','source'].includes(k)) || JSON.stringify(t.divisors)!=='[8,6,4,3,2]' || !Array.isArray(t.immuneAbilities))throw new Error('Invalid binding policy');
        for(const v of Object.values(t.moveIncrements))if(!Number.isInteger(v) || v<0 || v>3)throw new Error('Invalid binding increment');
        for(const v of Object.values(t.statLoss))if(!Array.isArray(v) || !v.length || v.some(s=>!['atk','def','spa','spd','spe','accuracy','evasion'].includes(s)))throw new Error('Invalid binding stat loss');
        if(t.octolockAmount!==undefined && ![-1,-2].includes(t.octolockAmount))throw new Error('Invalid Octolock scaling');
      }
      if(f.grounding){const g=f.grounding;if(Object.keys(g).sort().join()!==['airborneAbilities','forceGroundingItems','source'].sort().join() || !Array.isArray(g.airborneAbilities) || !Array.isArray(g.forceGroundingItems) || [...g.airborneAbilities,...g.forceGroundingItems].some(id=>typeof id!=='string' || !/^[a-z0-9]+$/.test(id)))throw new Error('Invalid grounding policy');}
      if(f.terrainPolicy){const p=f.terrainPolicy;
        if(p.clearOverlayOnEntry!==undefined && typeof p.clearOverlayOnEntry!=='boolean')throw new Error('Invalid overlay clearing policy');
        if(Object.keys(p).some(k=>!['blockedMessage','blockedFields','moveDurations','abilityDurations','source','clearOverlayOnEntry'].includes(k)) || ('blockedMessage' in p && typeof p.blockedMessage!=='string') || (p.blockedFields || []).some(id=>!data.fields[id]))throw new Error('Invalid terrain policy');
        for(const [id,duration] of [...Object.entries(p.moveDurations || {}),...Object.entries(p.abilityDurations || {})])if(!data.fields[id] || !Number.isInteger(duration) || duration<=0 || duration>20)throw new Error('Invalid terrain duration');
      }
      if(f.healing){const h=f.healing;
        if(Object.keys(h).sort().join()!==['rootFactor','agentMultipliers','overlayAgents','moveMultipliers','harmfulAgents','liquidOozeFactor','drainStatLoss'].sort().join())throw new Error('Malformed healing keys');
        for(const v of [h.rootFactor,h.liquidOozeFactor,...Object.values(h.agentMultipliers),...Object.values(h.moveMultipliers)])if(!Number.isFinite(v) || v<=0)throw new Error('Invalid healing multiplier');
        if(typeof h.drainStatLoss!=='boolean' || !Array.isArray(h.overlayAgents) || h.overlayAgents.some(a=>!['drain','leechseed','ingrain','aquaring','strengthsap'].includes(a)))throw new Error('Invalid healing configuration');
        for(const v of Object.values(h.harmfulAgents))if(typeof v.respectMagicGuard!=='boolean' || typeof v.message!=='string')throw new Error('Malformed harmful healing');
      }
      for(const [key,row]of Object.entries(f.weatherDefinitions || {})){if(!/^[a-z0-9]+$/.test(key) || Object.keys(row).sort().join()!=='damageFraction,damageMessage,duration,endMessage,excludedAbilities,excludedFlags,excludedItems,excludedVolatiles,name,source,startMessage' || !Number.isInteger(row.duration) || row.duration<1 || row.duration>20 || !Number.isFinite(row.damageFraction) || row.damageFraction<=0 || row.damageFraction>1)throw new Error('Invalid weather definition');for(const k of ['name','source','startMessage','endMessage','damageMessage'])if(typeof row[k]!=='string')throw new Error('Invalid weather text');for(const k of ['excludedAbilities','excludedItems','excludedFlags','excludedVolatiles'])if(!Array.isArray(row[k]) || row[k].some(v=>typeof v!=='string' || !/^[a-z0-9]+$/.test(v)))throw new Error('Invalid weather exclusions');}
      for(const [type,row]of Object.entries(f.typeDefinitions || {})){if(type!=='Shadow' || Object.keys(row).sort().join()!=='damageTaken,displayName,flagInteraction,hue,outgoing,source,textureBasis' || typeof row.displayName!=='string' || typeof row.source!=='string' || !Number.isInteger(row.hue) || row.hue<0 || row.hue>360 || !types.includes(row.textureBasis))throw new Error('Invalid custom type');for(const k of ['damageTaken','outgoing'])if(!row[k] || Object.entries(row[k]).some(([k,n])=>!types.includes(k) || ![0,1,2,3].includes(n)))throw new Error('Invalid custom type chart');const r=row.flagInteraction;if(!r || Object.keys(r).sort().join()!=='flag,flagged,unflagged,unflaggedExceptions' || !/^[a-z0-9]+$/.test(r.flag) || ![-1,0,1].includes(r.flagged) || ![-1,0,1].includes(r.unflagged) || !Array.isArray(r.unflaggedExceptions) || r.unflaggedExceptions.some(t=>!types.includes(t)))throw new Error('Invalid custom type flag');}
      if(f.id!==name || f.schemaVersion!==1)throw new Error('Malformed field '+name);
      for(const content of [f,f.overlay].filter(Boolean)) {
        for(const m of Object.values(content.moves)) {
          if(m.multiplier!==undefined && (!Number.isFinite(m.multiplier)||m.multiplier<0))throw new Error('Invalid multiplier in '+name);
          if(m.accuracy!==undefined && (!Number.isFinite(m.accuracy)||m.accuracy<0||m.accuracy>100))throw new Error('Invalid accuracy in '+name);
          if(m.transition){if(!data.fields[m.transition.field])throw new Error('Invalid transition '+m.transition.field);checkCondition(m.transition.condition);checkActions(m.transition.after);}
          checkActions(m.after);
        }
        for(const r of content.types){checkCondition(r.match);checkCondition(r.condition);checkActions(r.after);}
      }
      for(const r of f.rules){if(!knownEvents.has(r.event))throw new Error('Unknown event '+r.event);checkCondition(r.condition);checkActions(r.actions);}checkActions(f.seedActions);
      for(const r of f.typeChart || []){if(![-1,0,1,'immune'].includes(r.value))throw new Error('Invalid chart result');checkCondition(r.condition);}
      for(const callbacks of Object.values(f.suppressedAbilityCallbacks || {}))if(!['["onTryHit"]','["onImmunity"]'].includes(JSON.stringify(callbacks)))throw new Error('Unsupported ability callback');
    }
    for(const m of data.mappings)if(!data.fields[m.field])throw new Error('Invalid biome mapping '+m.field);
    for(const m of data.structures || [])if(!m || !data.fields[m.field] || (m.structure===undefined)===(m.tag===undefined) || Object.keys(m).some(k=>!['structure','tag','field','reason'].includes(k)) || !/^[a-z0-9_.-]+:[a-z0-9_./-]+$/.test(m.structure ?? m.tag))throw new Error('Invalid structure mapping '+JSON.stringify(m));
  }
})(globalThis);
