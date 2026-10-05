// Scores every shipped field for each league trainer by simulating the trainer's exact
// team on that field with the real engine, and writes research/trainer-field-scores.json.
//
// Metric: for each team member and each of 18 single-type reference opponents (Mew-statted,
// same level, no ability, an 80-power physical and special attack of its own type), start a
// fresh battle on the field and measure, with every field rule applied:
//   offense  best expected damage per turn the member deals (accuracy, hits, charge, crit-free)
//   defense  best expected damage per turn the reference deals back
//   residual end-of-round HP change of both sides from 50% HP (field, weather, items)
//   speed    action speed after entry effects
// The member wins the 1v1 if it needs fewer turns to KO (ties go to the faster side; equal
// speed is half a win). A field's score is the team's mean win share over all 6x18 pairings;
// the mean log damage ratio breaks ties. No team, AI or trainer file is read for writing.
'use strict';
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..'),simulator=path.resolve(root,'..','showdown');
const req=require('node:module').createRequire(path.join(simulator,'index.js'));
const {Battle}=req('./sim/battle');const {Dex,toID}=req('./sim/dex');
const pack=path.join(root,'datapack/data/rejuvenation/rejuvenation');
const fields={};for(const f of fs.readdirSync(path.join(pack,'fields'))){const d=JSON.parse(fs.readFileSync(path.join(pack,'fields',f)));fields[d.id]=d;}
const sandbox={require:req,REJUVENATION_SHOWDOWN_ROOT:'./',console};vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root,'mod/src/main/resources/rejuvenation-engine.js'),'utf8'),sandbox);
const E=sandbox.RejuvenationEngine;
E.load(JSON.stringify({fields,mappings:JSON.parse(fs.readFileSync(path.join(pack,'mappings/modpack.json'))).rules,
  items:JSON.parse(fs.readFileSync(path.join(pack,'items/seeds.json'))).items,abilities:JSON.parse(fs.readFileSync(path.join(pack,'abilities/source.json'))).abilities,default:'rejuvenation:indoor'}));
const teams=JSON.parse(fs.readFileSync(path.join(root,'research/kanto-league-teams.json'))).trainers;
const TYPES=['Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison','Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy'];
// Reference attacks are re-typed Tackle; no field references it, so only type-level rules apply.
if(Object.values(fields).some(f=>JSON.stringify(f).includes('"tackle"')))throw new Error('Reference move tackle is field-specific');
const dex=Dex.forFormat('gen9customgame');

function battleForm(member){
  // Pick the battle form the item or ability implies (plates, masks, Rusted Sword, As One).
  let species=dex.species.get(member.species),item=dex.items.get(member.item||''),ability=toID(member.ability||'');
  for(const name of species.otherFormes||[]){
    const f=dex.species.get(name);if(f.isMega || f.isPrimal || f.name.includes('-Mega'))continue;
    const required=[].concat(f.requiredItem||[],f.requiredItems||[]);
    if(item.exists && required.includes(item.name))return f.name;
    if(ability && !Object.values(species.abilities).map(toID).includes(ability) && Object.values(f.abilities).map(toID).includes(ability))return f.name;
  }
  return species.name;
}
function set(member,uuid){
  const moves=member.moveset.map(toID);
  return {species:battleForm(member),level:member.level,ability:member.ability,item:toID(member.item||''),nature:member.nature||'hardy',
    gender:member.gender==='MALE'?'M':member.gender==='FEMALE'?'F':'',moves,ivs:member.ivs,evs:member.evs,uuid,movesInfo:moves.map(()=>({pp:20,maxPp:20}))};
}
function start(field,member,type){
  const b=new Battle({formatid:'gen9customgame',seed:[1,2,3,4]});E.attach(b,field);
  b.setPlayer('p1',{name:'Trainer',team:[set(member,'00000000-0000-0000-0000-000000000001')]});
  b.setPlayer('p2',{name:'Reference',team:[{species:'Mew',level:member.level,ability:'No Ability',nature:'Hardy',moves:['tackle'],ivs:{hp:31,atk:31,def:31,spa:31,spd:31,spe:31},evs:{},uuid:'00000000-0000-0000-0000-000000000002',movesInfo:[{pp:20,maxPp:20}]}]});
  b.choose('p1','team 1');b.choose('p2','team 1');
  const [u,t]=[b.sides[0].active[0],b.sides[1].active[0]];
  t.setType([type]);t.apparentType=type;
  // Mega Stones evolve on the first turn in practice; score the evolved form.
  if(dex.items.get(u.item).megaStone && b.actions.canMegaEvo(u))b.actions.runMegaEvo(u);
  b.randomizer=d=>d;b.randomChance=()=>false;
  return {b,u,t};
}
function prepared(b,user,target,move){
  b.singleEvent('ModifyType',move,null,user,target,move,move);b.singleEvent('ModifyMove',move,null,user,target,move,move);
  move=b.runEvent('ModifyType',user,target,move,move);move=b.runEvent('ModifyMove',user,target,move,move);return move;
}
function expected(b,user,target,move){
  if(!move || move.category==='Status' || move.selfdestruct)return 0;
  const items=[user.item,target.item],states=[{...user.itemState},{...target.itemState}];
  let damage=0;
  try{damage=b.actions.getDamage(user,target,move)||0;}catch(e){damage=0;}
  [user.item,target.item]=items;user.itemState=states[0];target.itemState=states[1];
  if(!damage)return 0;
  let accuracy=move.accuracy;
  if(accuracy!==true){accuracy=b.runEvent('ModifyAccuracy',target,user,move,accuracy);if(accuracy!==true)accuracy=b.runEvent('Accuracy',target,user,move,accuracy);}
  const hit=accuracy===true?1:Math.max(0,Math.min(100,accuracy))/100;
  let hits=1;if(typeof move.multihit==='number')hits=move.multihit;else if(Array.isArray(move.multihit))hits=user.hasAbility('skilllink')?move.multihit[1]:user.hasItem('loadeddice')?4.5:3.1;
  let tempo=1;
  if(move.flags.charge && !user.hasItem('powerherb') && !(['solarbeam','solarblade'].includes(move.id) && ['sunnyday','desolateland'].includes(user.effectiveWeather())))tempo=.5;
  if(move.self?.volatileStatus==='mustrecharge')tempo=.5;
  return damage*hit*hits*tempo;
}
function reference(b,type,category){const m=b.dex.getActiveMove('tackle');m.type=type;m.basePower=80;m.category=category;m.flags={protect:1};return m;}
function pairing(field,member,type){
  const {b,u,t}=start(field,member,type);
  let offense=0;for(const slot of u.moveSlots){const m=prepared(b,u,t,b.dex.getActiveMove(slot.id));offense=Math.max(offense,expected(b,u,t,m));}
  let defense=0;for(const category of ['Physical','Special']){const m=prepared(b,t,u,reference(b,type,category));defense=Math.max(defense,expected(b,t,u,m));}
  const speeds=[u.getActionSpeed(),t.getActionSpeed()];
  // End-of-round effects from half HP so both damage and healing register.
  u.hp=Math.floor(u.maxhp/2);t.hp=Math.floor(t.maxhp/2);const before=[u.hp,t.hp];
  try{b.residualEvent('Residual');}catch(e){}
  const residual=[(before[0]-u.hp)/u.maxhp,(before[1]-t.hp)/t.maxhp];
  const dealt=offense/t.maxhp+residual[1],taken=defense/u.maxhp+residual[0];
  b.destroy();
  const turns=x=>x>0?Math.ceil(1/x):Infinity,mine=turns(dealt),theirs=turns(taken);
  let win=mine<theirs?1:mine>theirs?0:speeds[0]>speeds[1]?1:speeds[0]<speeds[1]?0:.5;
  if(mine===Infinity && theirs===Infinity)win=.5;
  return {win,margin:Math.log(Math.max(dealt,1e-3)/Math.max(taken,1e-3)),dealt,taken,faster:speeds[0]>speeds[1]};
}
if(process.env.TRAINER_FIELDS_PROBE){
  // Diagnostic: resolved battle forms and one Indoor pairing per member.
  for(const [id,trainer] of Object.entries(teams))for(const member of trainer.team){
    const {b,u}=start('rejuvenation:indoor',member,'Normal');const form=u.species.name+' / '+u.ability+' / '+u.item+' / '+u.getTypes().join('-');b.destroy();
    const r=pairing('rejuvenation:indoor',member,'Normal');
    console.log(id.padEnd(22),member.species.padEnd(14),form.padEnd(60),'dealt',r.dealt.toFixed(3),'taken',r.taken.toFixed(3),'win',r.win);
  }
  process.exit(0);
}
const candidates=Object.keys(fields).sort();
const result={metric:'Mean 1v1 win share of each team member against 18 single-type reference opponents on the field; mean log damage ratio breaks ties',
  reference:'Mew base stats, same level, 31 IVs, no EVs, no ability; re-typed 80-power physical and special Tackle with STAB',
  assumptions:['Mega Stones evolve on turn one; item and ability forms (plates, masks, Rusted Sword, As One, Primal orbs) are their battle forms',
    'Average damage roll, no critical hits; accuracy after field and ability modifiers; multi-hit expectation 3.1 hits (Skill Link 5, Loaded Dice 4.5)',
    'Charge moves count half unless Power Herb or sun-boosted Solar Beam/Blade; recharge moves count half; status and self-KO moves add no damage',
    'Doubles trainers are scored as 1v1 pairings without spread reduction; set-up, status, hazards and switching are outside the metric'],
  trainers:{}};
for(const [id,trainer] of Object.entries(teams)){
  const scores={};
  for(const field of candidates){
    let win=0,margin=0,n=0;const members={};
    for(const member of trainer.team){
      let mw=0;for(const type of TYPES){const r=pairing(field,member,type);win+=r.win;margin+=r.margin;mw+=r.win;n++;}
      members[member.species]=+(mw/TYPES.length).toFixed(4);
    }
    scores[field]={winShare:+(win/n).toFixed(4),margin:+(margin/n).toFixed(4),members};
  }
  const ranked=Object.entries(scores).filter(([f])=>f!=='rejuvenation:indoor').sort((a,b)=>b[1].winShare-a[1].winShare || b[1].margin-a[1].margin);
  result.trainers[id]={name:trainer.name,baseline:scores['rejuvenation:indoor'],best:ranked[0][0],ranking:ranked.slice(0,5).map(([f,s])=>({field:f,...s})),scores};
  console.log(id.padEnd(22),ranked[0][0].padEnd(36),JSON.stringify({best:ranked[0][1].winShare,indoor:scores['rejuvenation:indoor'].winShare,second:ranked[1][0]+' '+ranked[1][1].winShare}));
}
fs.writeFileSync(path.join(root,'research/trainer-field-scores.json'),JSON.stringify(result,null,1)+'\n');
