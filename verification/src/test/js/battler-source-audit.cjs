module.exports=({test,battle,pokemon,move,E,fid,assert,catalog,Battle})=>{
 test('Rainbow hard field and overlay previews are typeless without locking or sampling rolls',()=>{
  for(const field of ['rainbow','indoor']){const b=battle(field),[u,t]=pokemon(b);if(field==='indoor')E.change(b,fid('rainbow'),{duration:4});b.sample=()=>{throw new Error('preview must not sample');};const m=move(b,'judgment');b.runEvent('ModifyMove',u,t,m,m);assert.deepEqual(Array.from(m.rejuvenationTypes),['???']);assert.equal(Object.keys(m.rejuvenationTypeRolls).length,0);b.activeMove=m;b.sample=()=> 'Fire';b.runEvent('ModifyMove',u,t,m,m);assert.deepEqual(Array.from(m.rejuvenationTypes),['Fire']);b.destroy();}
 });
 test('Inverse applies Shadow flags after inversion and includes every additional attacking type',()=>{
  const b=battle('inverse'),[u,t]=pokemon(b);t.setType('Dragon');let m=move(b,'moonblast');assert.equal(t.runEffectiveness(m),-1);t.rejuvenationFlags={shadow:true};assert.equal(t.runEffectiveness(m),0);m=move(b,'tackle');m.rejuvenationTypes=['Fairy'];assert.equal(t.runEffectiveness(m),-1);t.setType('Ghost');assert.equal(t.runEffectiveness(m),1);b.destroy();
 });
 test('Chess King bypasses Psychic overlays while every other Chess piece remains blocked',()=>{
  for(const role of ['king','queen','rook','bishop','knight','pawn']){const b=battle('chess_board',{moves:['aquajet']},{species:'Blissey'}),[u,t]=pokemon(b);u.rejuvenationRoles[fid('chess_board')]=role;E.change(b,fid('psychic_terrain'),{duration:4});b.makeChoices('move aquajet','move splash');assert.equal(t.hp<t.maxhp,role==='king',role);b.destroy();}
 });
 test('Chess Kowtow Cleave pierces each opposing priority-blocking ability without quartering damage',()=>{
  for(const ability of ['Queenly Majesty','Dazzling','Armor Tail']){const b=battle('chess_board',{moves:['kowtowcleave']},{ability,species:'Blissey'}),[u,t]=pokemon(b);u.rejuvenationRoles[fid('chess_board')]='king';b.makeChoices('move kowtowcleave','move splash');assert(t.hp<t.maxhp,ability);assert(!b.log.some(s=>s.includes("couldn't fully protect")),ability);b.destroy();}
  const b=battle('chess_board',{moves:['aquajet']},{ability:'Queenly Majesty'}),[u,t]=pokemon(b);u.rejuvenationRoles[fid('chess_board')]='king';b.makeChoices('move aquajet','move splash');assert.equal(t.hp,t.maxhp);b.destroy();
 });
 test('Kings Rock and Razor Fang use exactly 20 percent on Rainbow, overlay, or Serene Grace',()=>{
  for(const item of ["King's Rock",'Razor Fang'])for(const [field,ability,overlay,expected]of [['indoor','Synchronize',false,10],['rainbow','Synchronize',false,20],['indoor','Synchronize',true,20],['indoor','Serene Grace',false,20],['rainbow','Serene Grace',false,20]]){
   const b=battle(field,{item,ability}),[u,t]=pokemon(b);if(overlay)E.change(b,fid('rainbow'),{duration:3});const m=move(b,'tackle');b.activeMove=m;b.runEvent('ModifyMove',u,t,m,m);assert.equal(m.secondaries.find(s=>s.volatileStatus==='flinch').chance,expected,[item,field,ability,overlay].join());b.destroy();
  }
 });
 test('item flinch preserves inherent flinches and is suppressed by Sheer Force with positive effects',()=>{
  for(const item of ["King's Rock",'Razor Fang']){const b=battle('rainbow',{item,ability:'Sheer Force'}),[u,t]=pokemon(b);let m=move(b,'waterfall');b.activeMove=m;b.runEvent('ModifyMove',u,t,m,m);assert.equal(m.secondaries.length,0);m=move(b,'tackle');b.activeMove=m;b.runEvent('ModifyMove',u,t,m,m);assert.equal(m.secondaries[0].chance,20);b.destroy();const c=battle('rainbow',{item,ability:'Serene Grace'}),[v,w]=pokemon(c);m=move(c,'airslash');c.activeMove=m;c.runEvent('ModifyMove',v,w,m,m);assert.equal(m.secondaries.length,1);assert.equal(m.secondaries[0].chance,60);c.destroy();}
 });
 test('Comatose source entry flavor is suppressed only on the hard Electric field',()=>{
  for(const field of ['indoor','rainbow','electric_terrain']){const b=battle(field,{ability:'Comatose'});assert.equal(b.log.some(s=>s.includes('is drowsing!')),field!=='electric_terrain');b.destroy();}
 });
 function switchBattle(field,species,foeMove='tackle'){
  const b=new Battle({formatid:'gen9customgame',seed:[1,2,3,4]});E.attach(b,fid(field));let n=0;const set=s=>({species:s,ability:'Synchronize',moves:['tackle','splash'],uuid:'switch-'+(++n),movesInfo:[{pp:20,maxPp:20},{pp:20,maxPp:20}]});b.setPlayer('p1',{team:[set(species),set('Blissey')]});const f=set('Mew');f.moves=[foeMove];f.movesInfo=[{pp:20,maxPp:20}];b.setPlayer('p2',{team:[f]});b.choose('p1','team 1');b.choose('p2','team 1');b.randomizer=x=>x;b.randomChance=()=>false;return b;
 }
 test('Colosseum voluntary switches act at priority zero in Speed order',()=>{
  for(const [field,species,firstSwitch]of [['indoor','Shuckle',true],['colosseum','Shuckle',false],['colosseum','Ninjask',true]]){const b=switchBattle(field,species);b.makeChoices('switch 2','move tackle');const log=b.log.slice(b.log.findIndex(s=>s.startsWith('|turn|1'))),sw=log.findIndex(s=>s.startsWith('|switch|')),attack=log.findIndex(s=>s.startsWith('|move|'));assert.equal(sw<attack,firstSwitch,[field,species].join());b.destroy();}
 });
 test('Colosseum switch timing respects negative priority and leaves forced replacements immediate',()=>{
  const b=switchBattle('colosseum','Shuckle','trickroom');b.makeChoices('switch 2','move trickroom');const log=b.log.slice(b.log.findIndex(s=>s.startsWith('|turn|1')));assert(log.findIndex(s=>s.startsWith('|switch|'))<log.findIndex(s=>s.startsWith('|move|')));const p=b.sides[0].active[0];assert.equal(b.queue.resolveAction({choice:'instaswitch',pokemon:p,target:b.sides[0].pokemon[1]})[0].order,3);assert.equal(b.queue.resolveAction({choice:'switch',pokemon:p,target:b.sides[0].pokemon[1]},true)[0].order,103);b.destroy();
 });
 test('new late hooks and switch timing reject invalid configuration',()=>{
  for(const change of [c=>c.fields[fid('colosseum')].switchTiming='endTurn',c=>c.fields[fid('rainbow')].rules.find(r=>r.event==='modifyMoveLate').actions[0].volatileStatus='poison',c=>c.fields[fid('rainbow')].rules.push({event:'modifyMoveLate',condition:{baseCanFlinch:1},actions:[]})]){const c=JSON.parse(JSON.stringify(catalog));change(c);assert.throws(()=>E.load(c));}
 });
 test('Corrupted Black Sludge doubles healing and damage while retaining source HP and immunity guards',()=>{
  for(const [field,species,ability,full,expected]of [['corrupted','Muk','Synchronize',false,1/8],['indoor','Muk','Synchronize',false,1/16],['corrupted','Mew','Synchronize',false,-1/4],['indoor','Mew','Synchronize',false,-1/8],['corrupted','Mew','Synchronize',true,0],['corrupted','Mew','Magic Guard',false,0]]){
   const b=battle(field,{species,ability,item:'Black Sludge'}),[u]=pokemon(b);if(!full)u.hp=Math.floor(u.maxhp*.75);const hp=u.hp;b.singleEvent('Residual',u.getItem(),u.itemState,u);assert.equal(u.hp-hp,Math.sign(expected)*Math.floor(u.maxhp*Math.abs(expected)),[field,species,ability,full].join());b.destroy();
  }
  const b=battle('corrupted',{item:'Black Sludge'}),[u]=pokemon(b);u.hp=10;b.field.addPseudoWeather('magicroom',u);b.residualEvent('Residual');assert.equal(u.hp,10);b.destroy();
 });
 test('Slow Start original entry text is absent on Deep Earth without losing duration or expiry',()=>{
  for(const field of ['indoor','deep_earth']){const b=battle(field,{ability:'Slow Start'}),[u,t]=pokemon(b);assert(u.volatiles.slowstart);assert.equal(u.volatiles.slowstart.duration,5);assert.equal(b.log.some(s=>s.includes('is slow to get going!')),field==='indoor');assert(!b.log.some(s=>s.startsWith('|-start|')&&s.includes('Slow Start')&&!s.includes('[silent]')));if(field==='deep_earth')E.change(b,fid('indoor'));for(let n=0;n<4;n++)b.residualEvent('Residual');assert(u.volatiles.slowstart);assert.equal(b.runEvent('ModifyAtk',u,t,move(b,'tackle'),1000),500);b.residualEvent('Residual');assert(!u.volatiles.slowstart);assert.equal(b.runEvent('ModifyAtk',u,t,move(b,'tackle'),1000),1000);b.destroy();}
 });
 test('City Frisk special defense loss uses the source Intimidate immunity category',()=>{
  for(const ability of ['Inner Focus','Own Tempo','Oblivious','Scrappy','Clear Body','White Smoke','None']){const b=battle('city',{ability:'Frisk'},{ability}),[,t]=pokemon(b);assert.equal(t.boosts.spd,['Clear Body','White Smoke'].includes(ability)?0:-1,ability);assert.equal(b.log.filter(s=>s.includes('Just a routine inspection.')).length,1);b.destroy();}
  for(const ability of ['None','Contrary']){const b=battle('city',{ability:'Frisk'},{ability}),[u,t]=pokemon(b);t.boosts.spd=0;t.addVolatile('substitute');b.singleEvent('Start',u.getAbility(),u.abilityState,u);assert.equal(t.boosts.spd,ability==='Contrary'?1:0,ability+' substitute');b.destroy();}
 });
 test('item callback and healing predicates reject malformed source configurations',()=>{
  for(const change of [c=>c.fields[fid('corrupted')].itemHandlers.blacksludge.onResidual.mode='runRuby',c=>c.fields[fid('corrupted')].itemHandlers.blacksludge.onFaint=c.fields[fid('corrupted')].itemHandlers.blacksludge.onResidual,c=>c.fields[fid('indoor')].rules.push({event:'residual',condition:{canHeal:{who:'enemy',value:true}},actions:[]}),c=>c.fields[fid('indoor')].rules.push({event:'residual',condition:{allyCanHeal:'yes'},actions:[]})]){const c=JSON.parse(JSON.stringify(catalog));change(c);assert.throws(()=>E.load(c));}
 });
 test('ordinary field speed predicates cover grounding, Water types, abilities, overlays and held items',()=>{
  for(const [field,species,ability,item,overlay,expected]of [
   ['new_world','Mew','Synchronize','',null,750],['new_world','Mew','Levitate','',null,1000],
   ['water_surface','Mew','Synchronize','',null,750],['murkwater_surface','Mew','Synchronize','',null,750],['water_surface','Squirtle','Synchronize','',null,1000],['water_surface','Mew','Levitate','',null,1000],['water_surface','Mew','Swift Swim','',null,2000],['water_surface','Mew','Surge Surfer','',null,2000],
   ['underwater','Mew','Steelworker','',null,1000],['underwater','Mew','Eelevate','',null,1000],['underwater','Mew','Swift Swim','',null,2000],
   ['electric_terrain','Mew','Steadfast','',null,1500],['indoor','Mew','Steadfast','','electric_terrain',1500],
   ['deep_earth','Mew','Synchronize','Float Stone',null,1200],['deep_earth','Mew','Synchronize','Iron Ball',null,1000],['indoor','Mew','Synchronize','Iron Ball',null,500]]){
   const b=battle(field,{species,ability,item}),[u]=pokemon(b);if(overlay)E.change(b,fid(overlay),{duration:4});assert.equal(b.runEvent('ModifySpe',u,null,null,1000),expected,[field,species,ability,item,overlay].join());b.destroy();
  }
 });
 test('Frozen Dimension forces Morpeko Hangry on entry and stops every end-turn toggle',()=>{
  for(const [field,species,expected]of [['frozen_dimension','Morpeko','morpekohangry'],['frozen_dimension','Morpeko-Hangry','morpekohangry'],['indoor','Morpeko','morpeko']]){const b=battle(field,{species,ability:'Hunger Switch'}),[u]=pokemon(b);assert.equal(u.species.id,expected);for(let n=0;n<2;n++)b.residualEvent('Residual');assert.equal(u.species.id,expected);if(field==='frozen_dimension')assert.equal(b.log.filter(s=>s.includes('transformed!')).length,species==='Morpeko'?1:0);b.destroy();}
 });
 test('Expanding Force spreads while airborne on hard Psychic Terrain and an overlay without the grounded power bonus',()=>{
  for(const field of ['psychic_terrain','indoor'])for(const ability of ['Synchronize','Levitate']){const b=battle(field,{ability}),[u,t]=pokemon(b);if(field==='indoor')E.change(b,fid('psychic_terrain'),{duration:4});const m=move(b,'expandingforce');b.activeMove=m;b.runEvent('ModifyMove',u,t,m,m);b.singleEvent('ModifyMove',m,null,m,u,t);assert.equal(m.target,'allAdjacentFoes');let factor=1;const old=b.chainModify;b.chainModify=n=>{factor*=n;};try{b.singleEvent('BasePower',m,null,u,t,m,80);}finally{b.chainModify=old;}assert.equal(factor,ability==='Levitate'?1:1.5);b.destroy();}
 });
 test('source seed special effects retain Wish rounding, statuses, guards, type and field state',()=>{
  const seedBattle=(field,options={})=>{const f=catalog.fields[fid(field)];return battle(field,{item:catalog.items[f.seed.item].name,...options});};
  for(const field of ['misty_terrain','rainbow','starlight']){const b=seedBattle(field),[u]=pokemon(b),w=u.side.slotConditions[u.position].wish;assert.equal(w.hp,Math.floor((u.maxhp+1)*.75));assert.equal(w.duration,2);b.destroy();}
  for(const field of ['corrosive_mist','murkwater_surface','corrupted']){let b=seedBattle(field),[u]=pokemon(b);assert.equal(u.status,'tox');b.destroy();b=seedBattle(field,{species:'Muk'});[u]=pokemon(b);assert.equal(u.status,'');b.destroy();}
  for(const [field,effect]of [['swamp','clearbody'],['inverse','normalize']]){const b=seedBattle(field),[u]=pokemon(b);assert.equal(u.ability,effect);b.destroy();}
  for(const [field,type]of [['underwater','Water'],['glitch','???'],['inverse','Normal']]){const b=seedBattle(field),[u]=pokemon(b);assert.deepEqual(u.getTypes(),[type]);b.destroy();}
  const a=seedBattle('glitch',{species:'Arceus',ability:'Multitype'}),[arceus]=pokemon(a);assert.deepEqual(arceus.getTypes(),['???']);a.destroy();
  for(const [field,lost,ability]of [['icy',1/8,'Synchronize'],['icy',0,'Levitate'],['icy',0,'Magic Guard'],['rocky',1/4,'Synchronize'],['cave',1/4,'Synchronize'],['cave',0,'Magic Guard']]){const b=seedBattle(field,{ability}),[u]=pokemon(b);assert.equal(u.maxhp-u.hp,Math.floor(u.maxhp*lost),field+' '+ability);b.destroy();}
  const w=seedBattle('wasteland');assert(w.sides.every(s=>s.sideConditions.stealthrock));w.destroy();
  const h=seedBattle('haunted'),[hu]=pokemon(h);assert.equal(hu.status,'brn');h.destroy();
  const i=seedBattle('infernal'),[iu]=pokemon(i);assert(iu.volatiles.trapped);i.destroy();
  for(const ability of ['Synchronize','Soundproof']){const d=seedBattle('deux_finalis',{ability}),[u]=pokemon(d);assert.equal(!!u.volatiles.perishsong,ability==='Synchronize');d.destroy();}
  const d=seedBattle('dimensional');assert(d.field.pseudoWeather.trickroom.duration>=3&&d.field.pseudoWeather.trickroom.duration<=8);d.destroy();
 });
 test('Cave and Rocky Seeds consume even after lethal weakness damage and scale type resistance',()=>{
  for(const field of ['cave','rocky'])for(const [species,fraction]of [['Charizard',1],['Sandshrew',1/8]]){const f=catalog.fields[fid(field)],b=battle(field,{species,item:catalog.items[f.seed.item].name}),u=b.sides[0].pokemon[0];assert.equal(u.item,'');assert.equal(u.maxhp-u.hp,Math.floor(u.maxhp*fraction),field+' '+species);assert.equal(u.lastItem,f.seed.item);b.destroy();}
 });
};
