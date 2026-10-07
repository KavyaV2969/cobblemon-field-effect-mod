'use strict';
// Executes the installed simulator and field engine with the Mega form/item read from the installed ZA Mega jar.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'../../../..'),profile=process.env.REJUVENATION_PROFILE||path.dirname(root);
const req=require('node:module').createRequire(path.join(profile,'showdown/index.js'));
const {Battle}=req('./sim/battle'),{Dex}=req('./sim/dex');
const input=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
const dex=Dex.forFormat('gen9customgame'),item=vm.runInNewContext('('+input.itemScript+')'),form=input.form;
dex.data.Items.eelektrossite=item;
dex.data.Pokedex.eelektrossmega={num:604,name:'Eelektross-Mega',baseSpecies:'Eelektross',forme:form.name,types:['Electric'],
  baseStats:{hp:form.baseStats.hp,atk:form.baseStats.attack,def:form.baseStats.defence,spa:form.baseStats.special_attack,spd:form.baseStats.special_defence,spe:form.baseStats.speed},
  abilities:{0:form.abilities[0]},heightm:form.height/10,weightkg:form.weight/10,isMega:true,battleOnly:'Eelektross',requiredItem:item.name};
const sandbox={require:req,console};vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root,'core/src/main/resources/rejuvenation-engine.js'),'utf8'),sandbox);
const E=sandbox.RejuvenationEngine;E.load(fs.readFileSync(path.join(root,'research/catalog.json'),'utf8'));
let checks=0;const check=(condition,message)=>{assert(condition,message);checks++;};
const A='00000000-0000-0000-0000-000000000001',B='00000000-0000-0000-0000-000000000099';
function set(m,index){
  const species=m.aspects?.includes('alolan')?'Raichu-Alola':m.aspects?.includes('wash-appliance')?'Rotom-Wash':m.species;
  return {species,level:m.level,ability:m.ability,nature:m.nature,item:m.heldItem[0].split(':')[1],moves:m.moveset,ivs:m.ivs,evs:m.evs,
    teraType:m.gimmicks.tera||undefined,uuid:A.slice(0,-2)+String(index+1).padStart(2,'0'),movesInfo:m.moveset.map(()=>({pp:20,maxPp:20}))};
}
function battle(lead,foe){
  const b=new Battle({formatid:'gen9customgame',seed:[1,2,3,4]});E.attach(b,'rejuvenation:murkwater_surface');
  const members=[input.team.find(m=>m.species===lead),...input.team.filter(m=>m.species!==lead)];
  b.setPlayer('p1',{name:'Lt. Surge',team:members.map(set)});
  b.setPlayer('p2',{name:'Player',team:[{...foe,uuid:B,movesInfo:foe.moves.map(()=>({pp:20,maxPp:20}))}]});
  b.choose('p1','team 1');b.choose('p2','team 1');return b;
}
const b=battle('eelektross',{species:'Meowscarada',level:36,nature:'Serious',ability:'Protean',item:'Miracle Seed',moves:['bite','uturn','playrough','flowertrick'],
  ivs:{hp:24,atk:27,def:3,spa:10,spd:31,spe:21},evs:{hp:3,atk:5,def:4,spa:9,spd:11,spe:6}});
const user=b.sides[0].active[0],foe=b.sides[1].active[0];foe.hp=54;
check(user.canMegaEvo==='Eelektross-Mega','Installed item offers Mega Eelektross');
const snapshot=()=>JSON.stringify({log:b.log,team:b.sides.map(s=>s.pokemon.map(p=>[p.species.id,p.ability,p.hp,p.canMegaEvo,p.canTerastallize])),terrain:b.field.terrain});
const before=snapshot(),candidates=[];
for(const move of input.team.find(m=>m.species==='eelektross').moveset)for(const gimmick of ['', 'mega'])
  candidates.push({user:A,target:B,move,...(gimmick?{gimmick}:{}),...(move==='drainpunch' && gimmick?{native:true}:{})});
const result=JSON.parse(E.strategy(b,{user:A,candidates}));
check(snapshot()===before,'Scoring restores Mega availability, reserve resources, abilities, HP and terrain');
const nativeScores={wildcharge:5,drainpunch:9,knockoff:-5,coil:1};
const rows=result.candidates.filter(r=>!r.error && !r.pruned).map(r=>({...r,adjusted:r.score+3*nativeScores[r.query.move]-(r.query.gimmick?22:0)+(r.query.native?1:0)}));
check(rows.some(r=>r.query.gimmick==='mega'),'Mega evaluation succeeds');
const normal=rows.filter(r=>!r.query.gimmick).sort((a,c)=>c.adjusted-a.adjusted)[0];
// The Java candidatePermitted regression certifies that the required policy supplies only these Mega rows.
const mandated=rows.filter(r=>r.query.gimmick==='mega').sort((a,c)=>c.adjusted-a.adjusted)[0];
check(normal.adjusted>mandated.adjusted,'Regression reproduces ordinary move outscoring Mega before the activation constraint');
b.makeChoices('move '+mandated.query.move+' mega','move flowertrick');
check(user.species.id==='eelektrossmega','Constrained choice actually evolves Eelektross');
check(user.ability==='hadronengine' && user.species.baseStats.atk===form.baseStats.attack,'Installed Mega ability and stats applied');
check(b.log.filter(l=>l.startsWith('|-mega|')).length===1,'Exactly one Mega activation');
check(b.sides[0].pokemon.every(p=>!p.canMegaEvo),'Mega resource consumed once across all reserves');
check(!b.log.some(l=>l.includes('|-start|') && l.toLowerCase().includes('dynamax')),'No Dynamax activation');b.destroy();
const t=battle('magnezone',{species:'Mew',level:100,ability:'Synchronize',moves:['splash']});
const mag=t.sides[0].active[0],eel=t.sides[0].pokemon.find(p=>p.species.id==='eelektross');
t.makeChoices('move flashcannon terastallize','move splash');
check(mag.terastallized==='Flying','Magnezone Flying Tera works');
check(eel.canMegaEvo==='Eelektross-Mega','Prior Tera does not consume Eelektross Mega');
t.makeChoices('switch '+(t.sides[0].pokemon.indexOf(eel)+1),'move splash');
check(t.sides[0].active[0]===eel,'Eelektross is active after Magnezone Tera');
t.makeChoices('move drainpunch mega','move splash');
check(eel.species.id==='eelektrossmega','Mega works after Magnezone Tera');
check(t.log.filter(l=>l.startsWith('|-mega|')).length===1 && t.log.filter(l=>l.startsWith('|-terastallize|')).length===1,'One Mega and one Tera, independently');
const repeat=t.choose('p1','move drainpunch mega');
check(repeat===false,'A second Mega action is rejected');t.destroy();
const reverse=battle('eelektross',{species:'Mew',level:100,ability:'Synchronize',moves:['splash']});
reverse.makeChoices('move drainpunch mega','move splash');
const laterMag=reverse.sides[0].pokemon.find(p=>p.species.id==='magnezone');
check(laterMag.canTerastallize==='flying' || laterMag.canTerastallize==='Flying','Prior Mega does not consume Magnezone Tera');
reverse.makeChoices('switch '+(reverse.sides[0].pokemon.indexOf(laterMag)+1),'move splash');
reverse.makeChoices('move flashcannon terastallize','move splash');
check(laterMag.terastallized==='Flying','Magnezone Tera works after Eelektross Mega');
check(reverse.log.filter(l=>l.startsWith('|-mega|')).length===1 && reverse.log.filter(l=>l.startsWith('|-terastallize|')).length===1,'One Mega and one Tera in the reverse order');reverse.destroy();
console.log(JSON.stringify({checks,ordinaryScore:normal.adjusted,mandatedMegaScore:mandated.adjusted,megaMove:mandated.query.move,megaAbility:form.abilities[0],previousTeraThenMega:true}));
