// Warped Forest and Crimson Forest (selective fusions), plus gimmick differentials for all four custom fields.
module.exports=({test,E,fid,assert,Battle,catalog,fixture})=>{
 const {make,doubles,pokemon,move,play,turn,said,lines,set,id,A,B}=fixture;
 const plain=x=>JSON.parse(JSON.stringify(x));
 const power=(b,u,t,moveId,v=100)=>{const m=move(b,moveId);b.activeMove=m;b.runEvent('ModifyMove',u,t,m,m);return b.runEvent('BasePower',u,t,m,v);};
 const prepared=(b,u,t,moveId)=>{const m=move(b,moveId);b.activeMove=m;b.runEvent('ModifyMove',u,t,m,m);return m;};
 const effect=(field,moveId,target,user={})=>{const b=make(field,{moves:[moveId],...user},{species:target}),[u,t]=pokemon(b),m=move(b,moveId);b.activePokemon=u;b.activeMove=m;b.runEvent('ModifyMove',u,t,m,m);const out=t.runEffectiveness(m);b.destroy();return out;};

 // ----------------------------------------------------------------------------------------------- Warped Forest
 test('Warped Forest type multipliers, move rows and hooks follow the specification',()=>{
  const b=make('warped_forest',{species:'Blissey'},{}),[u,t]=pokemon(b);
  for(const [moveId,expected]of [['energyball',150],['signalbeam',150],['xscissor',100],['crunch',150],['shadowclaw',120],['moonblast',50],['flamethrower',130],['icebeam',50],['watergun',80],['tackle',100]])assert.equal(power(b,u,t,moveId),expected,moveId);
  // Move rows multiply with the type bonus under the existing convention; documented, not applied twice.
  assert.equal(power(b,u,t,'powerwhip'),225,'1.5 × 1.5');assert.equal(power(b,u,t,'vinewhip'),225);assert.equal(power(b,u,t,'darkpulse'),180,'1.2 × 1.5');assert.equal(power(b,u,t,'nightdaze'),180);
  assert.equal(power(b,u,t,'hyperspacefury'),225);assert.equal(power(b,u,t,'hyperspacehole'),150);assert.equal(power(b,u,t,'shadowforce'),180);assert.equal(power(b,u,t,'spacialrend'),150);
  assert.equal(prepared(b,u,t,'darkpulse').accuracy,true,'Dark Pulse cannot miss');assert.equal(prepared(b,u,t,'nightdaze').accuracy,true);
  const f=catalog.fields[fid('warped_forest')];assert.equal(f.mimicry,'Dark');assert.equal(f.naturePower,'woodhammer');
  let m=move(b,'terrainpulse');b.runEvent('ModifyMove',u,t,m,m);assert.equal(m.type,'Dark');assert.equal(m.basePower,100);
  m=move(b,'secretpower');b.runEvent('ModifyMove',u,t,m,m);assert.equal(m.secondaries[0].volatileStatus,'flinch');
  b.destroy();
 });
 test('damaging Grass moves gain Dark typing for effectiveness only, composed once from the move and the Forest cutters',()=>{
  const b=make('warped_forest',{species:'Blissey'},{species:'Mew'}),[u,t]=pokemon(b);
  const types=moveId=>plain(prepared(b,u,t,moveId).rejuvenationTypes);
  assert.deepEqual(types('energyball'),['Dark']);assert.deepEqual(types('powerwhip'),['Dark']);
  for(const cutter of ['slash','airslash','furycutter','aircutter','psychocut','breakingswipe','cut'])assert.deepEqual(types(cutter),['Grass','Dark'],cutter+' gains Grass, which then gains Dark');
  assert.deepEqual(types('flamethrower'),[]);assert.deepEqual(types('growth'),[],'status moves never gain it');
  const m=move(b,'leafblade');b.activeMove=m;b.runEvent('ModifyMove',u,t,m,m);b.runEvent('ModifyMove',u,t,m,m);assert.deepEqual(plain(m.rejuvenationTypes),['Dark'],'evaluating twice never duplicates');assert.equal(m.type,'Grass','the primary type is preserved');
  b.destroy();
  assert.equal(effect('warped_forest','energyball','Mew'),1,'Dark is super effective against Psychic (Grass is neutral): Warped');assert.equal(effect('indoor','energyball','Mew'),0,'Indoor');
  assert.equal(effect('warped_forest','energyball','Snorlax'),0);assert.equal(effect('warped_forest','powerwhip','Mew'),1);
  assert.equal(effect('warped_forest','slash','Mew'),1,'a Normal cutter that gains Grass and Dark: Dark is super effective against Psychic');
  const c=make('warped_forest',{moves:['energyball'],species:'Blissey'},{species:'Mew'});const from=c.log.length;c.actions.useMove(c.dex.getActiveMove('energyball'),pokemon(c)[0],pokemon(c)[1]);assert.equal(lines(c,from).filter(l=>l==='The warped flora twisted the attack!').length,1,'announced once per move');c.destroy();
 });
 test('Warped Forest inherits the specified Forest, Dimensional and Wasteland rows, and nothing else',()=>{
  const w=catalog.fields[fid('warped_forest')];
  for(const ability of ['overgrow','swarm','grasspelt','effectspore'])assert.deepEqual(w.abilityHandlers[ability],catalog.fields[fid('forest')].abilityHandlers[ability],ability);
  assert.deepEqual(w.abilityHandlers.toxicboost,catalog.fields[fid('wasteland')].abilityHandlers.toxicboost);assert.deepEqual(w.conditionDurations,catalog.fields[fid('dimensional')].conditionDurations);
  assert.deepEqual(Object.keys(w.abilityHandlers).filter(k=>!['junglebeat','schooling','seedsower','galvanize','pixilate','purepower','plus','minus','marvelscale','wildfire','tempest','comatose','slowstart','flowergift','flowerveil','cottondown','powerspot','curiousmedicine'].includes(k)).sort(),['effectspore','grasspelt','overgrow','swarm','toxicboost']);
  assert.equal(w.trapping.moveIncrements.infestation,undefined,'Forest binding rows are not inherited');assert.equal(w.seed.item,'magicalseed');assert.equal(w.terrainPolicy,undefined);assert.equal(w.healing.agentMultipliers.ingrain,catalog.fields[fid('indoor')].healing.agentMultipliers.ingrain);
 });
 test('Warped Forest ability effects: Rattled, Unnerve, Poison Heal, Toxic Boost, Sap Sipper, Grass Pelt, Overgrow, Swarm',()=>{
  let b=make('warped_forest',{ability:'Rattled'},{});assert.equal(pokemon(b)[0].boosts.spe,1);b.destroy();
  b=make('warped_forest',{ability:'Unnerve'},{});assert.equal(pokemon(b)[1].boosts.spe,-1);assert.equal(pokemon(b)[0].boosts.spe,0);b.destroy();
  const heal=(species,ability,field='warped_forest')=>{const c=make(field,{species,ability,moves:['splash']},{});const [u]=pokemon(c);u.hp=Math.floor(u.maxhp/2);const hp=u.hp;c.residualEvent('Residual');const out=u.hp-hp;c.destroy();return out;};
  const breloom=make('warped_forest',{species:'Breloom'},{});const max=pokemon(breloom)[0].maxhp;breloom.destroy();
  assert.equal(heal('Breloom','Poison Heal'),Math.floor(max/8),'grounded Poison Heal');assert.equal(heal('Gliscor','Poison Heal'),0,'an airborne user does not');assert.equal(heal('Breloom','Poison Heal','indoor'),0);
  assert.equal(heal('Mew','Sap Sipper'),Math.floor(pokemon(make('warped_forest',{},{}))[0].maxhp/16));
  const stat=(ability,event,moveId,species='Mew')=>{const c=make('warped_forest',{species,ability,moves:[moveId]},{}),[u,t]=pokemon(c),m=move(c,moveId);c.activeMove=m;const v=c.runEvent(event,u,t,m,100);c.destroy();return v;};
  assert.equal(stat('Grass Pelt','ModifyDef','tackle'),150);assert.equal(stat('Overgrow','ModifyAtk','leafblade'),150);assert.equal(stat('Swarm','ModifySpA','bugbuzz'),150);
  const c=make('warped_forest',{ability:'Toxic Boost'},{}),[u,t]=pokemon(c),m=move(c,'tackle');c.activeMove=m;assert.equal(c.runEvent('BasePower',u,t,m,100),150,'grounded Toxic Boost without poison');c.destroy();
  const d=make('warped_forest',{species:'Pidgeot',ability:'Toxic Boost'},{}),[x,y]=pokemon(d),mm=move(d,'tackle');d.activeMove=mm;assert.equal(d.runEvent('BasePower',x,y,mm,100),100,'an airborne unpoisoned user does not');d.destroy();
 });
 test('Warped Forest Leech Seed drains 1/4 of maximum HP with its message',()=>{
  const drain=field=>{const b=make(field,{moves:['splash'],species:'Mew'},{species:'Snorlax',moves:['splash']}),[u,t]=pokemon(b);t.addVolatile('leechseed',u);u.hp=Math.floor(u.maxhp/2);const hp=t.hp,uhp=u.hp,from=b.log.length;b.residualEvent('Residual');
   const out={lost:hp-t.hp,healed:u.hp-uhp,max:t.maxhp,said:said(b,'The warped roots burrowed deeper!',from)};b.destroy();return out;};
  const warped=drain('warped_forest'),plain=drain('indoor');assert.equal(plain.lost,Math.floor(plain.max/8),'1/8 elsewhere');assert.equal(warped.lost,2*plain.lost,'exactly twice that here (1/4 of maximum HP)');assert.equal(warped.healed,warped.lost,'the seeder heals what was drained');assert(warped.said);assert(!plain.said);
 });
 test('weather fails in Warped Forest: attempts fail, weather on entry is cleared, and nothing freezes',()=>{
  for(const weather of ['raindance','sunnyday','sandstorm','hail','snow','desolateland','primordialsea','deltastream']){
   const b=make('warped_forest'),[u]=pokemon(b);b.field.setWeather(weather,u);assert.equal(b.field.weather,'',weather);assert(said(b,'The weather faded into the warped forest...'),weather);b.destroy();}
  const c=make('forest'),[v]=pokemon(c);c.field.setWeather('raindance',v);assert.equal(c.field.weather,'raindance');E.change(c,fid('warped_forest'));assert.equal(c.field.weather,'','weather present on entry is cleared');c.destroy();
  const d=make('warped_forest'),[w,x]=pokemon(d);assert.equal(x.trySetStatus('frz',w),false);assert.equal(x.status,'');
  const e=make('warped_forest',{moves:['icebeam']},{});e.randomChance=()=>true;assert.equal(pokemon(e)[1].setStatus('frz'),false,'freezing is rejected at the status step too');d.destroy();e.destroy();
  const f=make('forest'),[y,z]=pokemon(f);assert(z.trySetStatus('frz',y),'other fields still freeze');f.destroy();
 });
 test('Warped Forest rooms and Gravity last 3 to 8 turns, not the ordinary five',()=>{
  const seen=new Set();
  for(let seed=1;seed<=60;seed++){const b=make('warped_forest',{moves:['trickroom']},{},{seed:[seed,2,3,4]}),[u]=pokemon(b);b.field.addPseudoWeather('trickroom',u,b.dex.moves.get('trickroom'));const d=b.field.pseudoWeather.trickroom.duration;assert(d>=3 && d<=8,'duration '+d);seen.add(d);b.destroy();}
  assert(seen.size>=4,'a random range, not a constant: '+[...seen].sort());
 });
 test('Warped Forest Magical Seed: Defense +1, Special Defense +1, Speed −1 and Ingrain',()=>{
  const b=make('warped_forest',{species:'Mew',item:'Magical Seed'},{});const [u]=pokemon(b);assert.deepEqual([u.boosts.def,u.boosts.spd,u.boosts.spe],[1,1,-1]);assert(u.volatiles.ingrain);assert.equal(u.item,'');b.destroy();
 });
 test('Shelter halves the field mimicry type: Dark in Warped Forest, Fire in Crimson Forest, and only for its user',()=>{
  const lost=(field,attack,sheltered)=>{const b=make(field,{moves:['splash'],species:'Mew'},{moves:['shelter','splash'],species:'Snorlax'}),[u,t]=pokemon(b);b.randomizer=d=>d;if(sheltered){turn(b,'move 1','move 1');assert(t.volatiles.rejuvenationshelter);}
   const hp=t.hp;b.actions.useMove(b.dex.getActiveMove(attack),u,t);const out=hp-t.hp;b.destroy();return out;};
  for(const [field,attack,other]of [['warped_forest','darkpulse','flamethrower'],['crimson_forest','flamethrower','darkpulse']]){
   const base=lost(field,attack,false),halved=lost(field,attack,true);assert(Math.abs(halved*2-base)<=2,field+' '+attack+': '+halved+' vs '+base);
   const unrelated=lost(field,other,false),stillFull=lost(field,other,true);assert(Math.abs(unrelated-stillFull)<=1,'other types are not halved');}
 });

 // ----------------------------------------------------------------------------------------------- Crimson Forest
 test('Crimson Forest type multipliers, move rows and accuracy rows follow the specification',()=>{
  const b=make('crimson_forest',{species:'Blissey'},{}),[u,t]=pokemon(b);
  for(const [moveId,expected]of [['flamethrower',130],['energyball',130],['sludgebomb',130],['signalbeam',120],['xscissor',100],['icebeam',50],['watergun',80],['tackle',100],['payday',150],['makeitrain',130]])assert.equal(power(b,u,t,moveId),expected,moveId);
  for(const moveId of ['acidspray','clearsmog','smog'])assert.equal(power(b,u,t,moveId),195,moveId+': 1.5 × the Poison 1.3');
  assert.equal(power(b,u,t,'powerwhip'),195,'1.5 × the Grass 1.3');assert.equal(prepared(b,u,t,'toxic').accuracy,100);assert.equal(prepared(b,u,t,'willowisp').accuracy,100);
  assert.equal(prepared(b,u,t,'barbbarrage').basePower,120);assert.equal(prepared(b,u,t,'venoshock').basePower,130);
  const f=catalog.fields[fid('crimson_forest')];assert.equal(f.mimicry,'Fire');assert.equal(f.naturePower,'powerwhip');
  let m=move(b,'terrainpulse');b.runEvent('ModifyMove',u,t,m,m);assert.equal(m.type,'Fire');assert.equal(m.basePower,100);
  m=move(b,'secretpower');b.runEvent('ModifyMove',u,t,m,m);assert.equal(m.secondaries[0].status,'brn');b.destroy();
 });
 test('Crimson Forest sub-typing: special Flying gains Poison, Power Whip and Vine Whip gain Fire, cutters keep Grass',()=>{
  const b=make('crimson_forest',{species:'Blissey'},{species:'Mew'}),[u,t]=pokemon(b);
  const types=moveId=>plain(prepared(b,u,t,moveId).rejuvenationTypes);
  assert.deepEqual(types('airslash'),['Grass','Poison'],'Air Slash: Forest slashing gains Grass, and special Flying gains Poison');
  assert.deepEqual(types('hurricane'),['Poison']);assert.deepEqual(types('bravebird'),[],'physical Flying is untouched');
  assert.deepEqual(types('powerwhip'),['Fire']);assert.deepEqual(types('vinewhip'),['Fire']);assert.deepEqual(types('slash'),['Grass']);assert.deepEqual(types('energyball'),[],'only the two whips gain Fire');
  b.destroy();
  assert.equal(effect('crimson_forest','powerwhip','Tangrowth'),effect('indoor','powerwhip','Tangrowth')+1,'Fire is super effective against Grass: the resisted Grass whip becomes neutral');
  assert.equal(effect('crimson_forest','hurricane','Tangrowth'),effect('indoor','hurricane','Tangrowth')+1,'Poison sub-typing is super effective against Grass');
  assert.equal(effect('crimson_forest','powerwhip','Mew'),effect('indoor','powerwhip','Mew')+0,'Fire is neutral against Psychic');
 });
 test('Piglin Bloodlust: +1 Attack per direct opposing knockout, stacking with Moxie, and nothing else counts',()=>{
  const squad=(extra={})=>[{moves:['tackle','earthquake','surf','splash'],species:'Mew',...extra},{moves:['splash'],species:'Blissey'},{moves:['splash'],species:'Blissey'}];
  const foes=()=>[{moves:['splash'],species:'Magikarp'},{moves:['splash'],species:'Magikarp'},{moves:['splash'],species:'Snorlax'}];
  const run=(own,foe,choose,prep=()=>{})=>{const b=doubles('crimson_forest',own,foe);prep(b);play(b,choose,'move 1, move 1');return b;};
  let b=run(squad(),foes(),'move 1 1, move 1',b=>{b.sides[1].active[0].hp=1;});assert.equal(pokemon(b)[0].boosts.atk,1,'a direct KO');assert(said(b,'The Piglins roared for blood!'));b.destroy();
  b=run(squad(),foes(),'move 3, move 1',b=>{for(const p of b.sides[1].active)p.hp=1;});assert.equal(pokemon(b)[0].boosts.atk,2,'a spread move that knocks out two opposing Pokémon pays +2, announced once');assert.equal(b.log.filter(s=>s.includes('The Piglins roared for blood!')).length,1);b.destroy();
  b=run(squad(),foes(),'move 1 1, move 1',b=>{b.sides[1].active[0].hp=1;});assert.equal(pokemon(b)[0].boosts.atk,1);b.destroy();
  b=run(squad({ability:'Moxie'}),foes(),'move 1 1, move 1',b=>{b.sides[1].active[0].hp=1;});assert.equal(pokemon(b)[0].boosts.atk,2,'Moxie +1 and Bloodlust +1');b.destroy();
  b=run(squad(),foes(),'move 2, move 1',b=>{b.sides[0].active[1].hp=1;for(const p of b.sides[1].active)p.hp=Math.floor(p.maxhp*0.9);});assert.equal(pokemon(b)[0].boosts.atk,0,'an ally knockout never counts');b.destroy();
  b=run(squad(),foes(),'move 4, move 1',b=>{const v=b.sides[1].active[0];v.hp=1;v.setStatus('psn');});assert.equal(pokemon(b)[0].boosts.atk,0,'a poison knockout is not a direct attack');assert.equal(pokemon(b)[1].boosts.atk,0);b.destroy();
  b=run(squad(),foes(),'move 4, move 1',b=>{b.sides[1].active[0].hp=1;b.sides[1].active[0].addVolatile('leechseed',b.sides[0].active[0]);});assert.equal(pokemon(b)[0].boosts.atk,0,'a residual knockout is not a direct attack');b.destroy();
  const f=make('crimson_forest',{moves:['tackle'],species:'Mew'},{moves:['splash'],species:'Magikarp'}),[u,t]=pokemon(f);t.hp=1;turn(f,'move 1');assert.equal(u.boosts.atk,0,'the final knockout ends the battle; the simulator grants no boost there either');f.destroy();
  assert.equal(catalog.fields[fid('indoor')].mechanics,undefined);const g=make('indoor',{moves:['tackle'],species:'Mew'},{moves:['splash'],species:'Magikarp'},{teamB:[{species:'Snorlax'}]});pokemon(g)[1].hp=1;turn(g,'move 1');assert.equal(pokemon(g)[0].boosts.atk,0,'no field, no Bloodlust');g.destroy();
 });
 test('Good as Gold gains +1 Speed and +1 Special Attack on entry through normal boost handling',()=>{
  let b=make('crimson_forest',{species:'Gholdengo',ability:'Good as Gold'},{});const [u]=pokemon(b);assert.deepEqual([u.boosts.spe,u.boosts.spa],[1,1]);assert(said(b,'The Piglins erupted at the sight of gold!'));b.destroy();
  b=make('indoor',{species:'Gholdengo',ability:'Good as Gold'},{});assert.deepEqual([pokemon(b)[0].boosts.spe,pokemon(b)[0].boosts.spa],[0,0]);b.destroy();
  b=make('crimson_forest',{species:'Gholdengo',ability:'Good as Gold'},{},{teamA:[{species:'Gholdengo',ability:'Good as Gold'}]});const first=pokemon(b)[0];first.boosts.spe=6;b.choose('p1','switch 2');b.choose('p2','move 1');assert.equal(b.sides[0].active[0].boosts.spa,1,'a later entry gets it too');b.destroy();
 });
 test('Crimson Vines scale the final accuracy of positive-priority damaging moves by 0.8 using the actual effective priority',()=>{
  const evaluate=(field,user,moveId,target={species:'Snorlax'})=>{const b=make(field,{moves:[moveId],...user},{moves:['splash'],...target});const r=JSON.parse(E.evaluate(b,[{user:A,target:B,move:moveId,range:true}])).results[0];b.destroy();return r.withField.accuracy;};
  assert.equal(evaluate('crimson_forest',{},'quickattack'),80,'+1 priority');assert.equal(evaluate('crimson_forest',{},'extremespeed'),80,'+2 priority');assert.equal(evaluate('crimson_forest',{},'tackle'),100,'no priority');assert.equal(evaluate('crimson_forest',{},'protect'),true,'status moves are not damaging');
  assert.equal(evaluate('crimson_forest',{},'avalanche'),100,'negative priority');assert.equal(evaluate('indoor',{},'quickattack'),100);
  assert.equal(evaluate('crimson_forest',{species:'Talonflame',ability:'Gale Wings'},'wingattack'),80,'priority granted by an ability counts');assert.equal(evaluate('crimson_forest',{species:'Talonflame',ability:'Gale Wings',},'peck'),80);
  const hurt=make('crimson_forest',{species:'Talonflame',ability:'Gale Wings',moves:['wingattack']},{moves:['splash']});pokemon(hurt)[0].hp=1;assert.equal(JSON.parse(E.evaluate(hurt,[{user:A,target:B,move:'wingattack',range:true}])).results[0].withField.accuracy,100,'Gale Wings off at low HP: ordinary priority');hurt.destroy();
  assert.equal(evaluate('crimson_forest',{species:'Talonflame',ability:'Gale Wings'},'aerialace'),true,'accuracy-bypassing moves stay exempt even with priority');
  assert.equal(evaluate('crimson_forest',{ability:'No Guard'},'quickattack'),true,'No Guard bypasses the check');
  assert.equal(evaluate('crimson_forest',{ability:'Compound Eyes'},'quickattack'),100,'130 × 0.8 = 104 still always hits');
  const b=make('crimson_forest',{moves:['quickattack']},{moves:['splash'],species:'Snorlax'}),[u,t]=pokemon(b);t.boosts.evasion=2;const acc=JSON.parse(E.evaluate(b,[{user:A,target:B,move:'quickattack',range:true}])).results[0].withField.accuracy;assert.equal(acc,48,'accuracy stages apply before the penalty: 100×3/5=60, ×0.8');b.destroy();
 });
 test('a Crimson Vines crash happens only when the penalty itself caused the miss',()=>{
  const once=(field,seed,{moveId='quickattack',user={},target={},evasion=2,prep=()=>{}}={})=>{
   const b=make(field,{moves:[moveId],species:'Mew',ability:'Inner Focus',...user},{moves:['splash'],species:'Snorlax',ability:'Immunity',...target},{seed:[seed,2,3,4]});b.sides[1].active[0].boosts.evasion=evasion;prep(b);
   const hp=pokemon(b)[0].hp;turn(b,'move 1');return {miss:b.log.some(s=>s.startsWith('|-miss')),crash:said(b,'lost control and crashed!'),vines:said(b,'...But the red vines grabbed its limbs!'),lost:hp-pokemon(b)[0].hp,max:pokemon(b)[0].maxhp,log:b.log,b};};
  const kinds={hit:0,ordinary:0,penalty:0};
  for(let seed=1;seed<=300;seed++){
   const c=once('crimson_forest',seed),i=once('indoor',seed),kind=!c.miss?'hit':i.miss?'ordinary':'penalty';kinds[kind]++;
   assert.equal(c.crash,kind==='penalty',`seed ${seed}: ${kind}`);assert.equal(c.vines,kind==='penalty');
   if(kind==='penalty')assert.equal(c.lost,Math.floor(c.max/2),'the standard half-HP crash');if(kind!=='penalty')assert.equal(c.lost,0,'no crash damage');c.b.destroy();i.b.destroy();
  }
  assert(kinds.penalty>10 && kinds.ordinary>10 && kinds.hit>10,JSON.stringify(kinds));
  // Immunity, Protect and failures never crash.
  let r=once('crimson_forest',1,{moveId:'quickattack',target:{species:'Gastly',ability:'Levitate'}});assert(!r.crash && r.lost===0,'immune target');r.b.destroy();
  const b=make('crimson_forest',{moves:['quickattack'],species:'Mew'},{moves:['protect'],species:'Snorlax'});turn(b,'move 1');assert(!said(b,'lost control and crashed!') && pokemon(b)[0].hp===pokemon(b)[0].maxhp,'Protect');b.destroy();
  // Never twice: a move with its own crash is left to the simulator.
  const j=make('crimson_forest',{moves:['splash'],species:'Mew'},{moves:['splash'],species:'Snorlax'}),[u,t]=pokemon(j),hjk=j.dex.getActiveMove('highjumpkick');hjk.priority=1;t.boosts.evasion=6;j.randomChance=()=>false;
  const from=j.log.length;j.actions.useMove(hjk,u,t);assert(!said(j,'lost control and crashed!',from),'native crash only');assert.equal(j.log.slice(from).filter(s=>s.includes('[from] highjumpkick')).length,2,'exactly one crash (each damage prints a public and a private line)');j.destroy();
 });
 test('Crimson Forest inherits the specified Forest, Corrosive Mist and Volcanic rows',()=>{
  const c=catalog.fields[fid('crimson_forest')];
  for(const ability of ['overgrow','swarm','grasspelt','effectspore'])assert.deepEqual(c.abilityHandlers[ability],catalog.fields[fid('forest')].abilityHandlers[ability],ability);
  assert.deepEqual(c.abilityHandlers.toxicboost,catalog.fields[fid('corrosive_mist')].abilityHandlers.toxicboost);assert.deepEqual(c.trapping,catalog.fields[fid('volcanic')].trapping);
  assert.equal(c.seed.item,'elementalseed');assert.deepEqual(c.seed.stats,{atk:1,spa:1,spe:1});assert.equal(c.seed.effect,'taunt');
  const wellBaked=c.rules.filter(r=>r.event==='residual' && JSON.stringify(r).includes('wellbakedbody'));assert.equal(wellBaked.length,1);
  const burn=c.rules.filter(r=>r.event==='residual' && JSON.stringify(r).includes('residualDamage'));assert.equal(burn.length,0,'the Volcanic field burn is not inherited');
  const flash=c.rules.find(r=>JSON.stringify(r.actions).includes('flashFire'));assert(JSON.stringify(flash.condition).includes('"grounded"'),'grounded Flash Fire users only');
 });
 test('Crimson Forest ability effects: Magma Armor, Well-Baked Body, Flash Fire, Steam Engine, Merciless, Poison Heal, Toxic Boost',()=>{
  let b=make('crimson_forest',{ability:'Magma Armor'},{});assert.equal(pokemon(b)[0].boosts.def,1);b.destroy();
  const residual=(a,field='crimson_forest')=>{const c=make(field,{moves:['splash'],...a},{});c.residualEvent('Residual');const out=pokemon(c)[0];return {def:out.boosts.def,spe:out.boosts.spe,flash:!!out.volatiles.flashfire,hp:out.hp,max:out.maxhp,b:c};};
  let r=residual({species:'Mew',ability:'Well-Baked Body'});assert.equal(r.def,1,'grounded Well-Baked Body');r.b.destroy();r=residual({species:'Mew',ability:'Well-Baked Body'},'indoor');assert.equal(r.def,0);r.b.destroy();
  r=residual({species:'Mew',ability:'Flash Fire'});assert(r.flash,'grounded Flash Fire activates at end of turn');r.b.destroy();r=residual({species:'Charizard',ability:'Flash Fire'},'crimson_forest');assert(!r.flash,'airborne Flash Fire does not');r.b.destroy();
  const steam=field=>{const s=make(field,{moves:['splash'],species:'Mew',ability:'Steam Engine'},{});turn(s,'move 1');turn(s,'move 1');const out=pokemon(s)[0].boosts.spe;s.destroy();return out;};
  assert(steam('crimson_forest')>=1,'Steam Engine gains Speed at the end of a turn here');assert.equal(steam('indoor'),0);
  const crit=ability=>{const c=make('crimson_forest',{ability},{}),[u,t]=pokemon(c),m=move(c,'tackle');c.activeMove=m;const v=c.runEvent('ModifyCritRatio',u,t,m,0);c.destroy();return v;};assert.equal(crit('Merciless'),4);assert.equal(crit('Synchronize'),0);
  const heal=make('crimson_forest',{species:'Breloom',ability:'Poison Heal'},{});const [u]=pokemon(heal);u.hp=Math.floor(u.maxhp/2);const hp=u.hp;heal.residualEvent('Residual');assert.equal(u.hp-hp,Math.floor(u.maxhp/8));heal.destroy();
  const tb=make('crimson_forest',{ability:'Toxic Boost'},{}),[x,y]=pokemon(tb),m=move(tb,'tackle');tb.activeMove=m;assert.equal(tb.runEvent('BasePower',x,y,m,100),150,'as in Corrosive Mist');tb.destroy();
 });
 test('Crimson Forest Fire Spin deals 1/6, Snow and Hail end, freezing is impossible, and Elemental Seed boosts then taunts',()=>{
  const spin=field=>{const b=make(field,{moves:['splash'],species:'Mew'},{species:'Snorlax'}),[u,t]=pokemon(b);t.addVolatile('partiallytrapped',u,b.dex.moves.get('firespin'));const hp=t.hp;b.residualEvent('Residual');const lost=hp-t.hp;const max=t.maxhp;b.destroy();return [lost,max];};
  let [lost,max]=spin('crimson_forest');assert.equal(lost,Math.floor(max/6));[lost,max]=spin('indoor');assert.equal(lost,Math.floor(max/8));
  for(const weather of ['snow','hail']){const b=make('crimson_forest'),[u]=pokemon(b);b.field.setWeather(weather,u);assert.equal(b.field.weather,'',weather);b.destroy();}
  let b=make('crimson_forest'),[u]=pokemon(b);b.field.setWeather('raindance',u);assert.equal(b.field.weather,'raindance','other weather is allowed');b.residualEvent('Residual');assert.equal(E.current(b).id,fid('crimson_forest'),'rain does not snuff out this field');b.destroy();
  b=make('forest');[u]=pokemon(b);b.field.setWeather('snow',u);assert.equal(b.field.weather,'snow');E.change(b,fid('crimson_forest'));assert.equal(b.field.weather,'','snow ends when the field begins');b.destroy();
  b=make('crimson_forest');assert.equal(pokemon(b)[1].trySetStatus('frz',pokemon(b)[0]),false);b.destroy();
  b=make('crimson_forest',{species:'Mew',item:'Elemental Seed'},{});[u]=pokemon(b);assert.deepEqual([u.boosts.atk,u.boosts.spa,u.boosts.spe],[1,1,1]);assert(u.volatiles.taunt);assert.equal(u.item,'');b.destroy();
 });

 // ----------------------------------------------------------------------------------------------- gimmicks
 test('field and gimmick preview ranges match native hit pipelines on the new fields at both damage-roll endpoints',()=>{
  const cases=[['mega','warped_forest',{species:'Charizard',ability:'Blaze',item:'Charizardite X',moves:['flamethrower']}],
   ['ultra','deep_dark',{species:'Necrozma-Dusk-Mane',ability:'Prism Armor',item:'Ultranecrozium Z',moves:['photongeyser']}],
   ['zmove','crimson_forest',{species:'Mew',item:'Psychium Z',moves:['psychic']}],
   ['dynamax','pale_garden',{species:'Venusaur',ability:'Overgrow',moves:['energyball']}],
   ['dynamax','crimson_forest',{species:'Pikachu',ability:'Static',gigantamax:true,moves:['thunderbolt']}],
   ['terastallize','crimson_forest',{species:'Mew',ability:'Synchronize',teraType:'Fire',moves:['flamethrower']}],
   ['terastallize','warped_forest',{species:'Mew',ability:'Synchronize',teraType:'Dark',moves:['crunch']}]];
  for(const [gimmick,field,setup]of cases)for(const low of [true,false]){
   const b=make(field,setup,{species:'Blissey',ability:'Battle Armor',moves:['splash']}),[u,t]=pokemon(b),moveId=setup.moves[0];
   const q={user:A,target:B,move:moveId,gimmick,range:true},r=JSON.parse(E.evaluate(b,[q])).results[0];assert(!r.error,JSON.stringify(r));
   if(gimmick==='mega')b.actions.runMegaEvo(u);
   if(gimmick==='ultra'){u.canMegaEvo=null;b.actions.runMegaEvo(u);}
   if(gimmick==='terastallize')b.actions.terastallize(u);
   if(gimmick==='dynamax')b.runAction({choice:'runDynamax',pokemon:u});
   const nativeRandomizer=b.randomizer;b.randomizer=damage=>Math.floor(damage*(low?85:100)/100);
   const before=t.hp,active=b.dex.getActiveMove(moveId),z=gimmick==='zmove'?b.actions.getZMove(active,u):undefined,max=gimmick==='dynamax'?b.actions.getMaxMove(active,u).id:undefined;
   b.actions.useMove(active,u,t,null,z,max);b.runEvent('AfterMove',u,t,b.activeMove || active);
   assert.equal(before-t.hp,r.withField[low?'totalMinDamage':'totalMaxDamage'],gimmick+' '+field+' '+(low?'min':'max'));
   b.randomizer=nativeRandomizer;b.destroy();
  }
 });
 test('retaliation, Creaking and Bloodlust damage is never reported as move damage by the evaluator',()=>{
  const b=make('deep_dark',{moves:['earthquake'],species:'Blissey'},{moves:['splash'],species:'Snorlax'});b.rejuvenation.counters[0]=2;
  const r=JSON.parse(E.evaluate(b,[{user:A,target:B,move:'earthquake',range:true}])).results[0].withField;const before=pokemon(b)[1].hp;
  const actual=make('deep_dark',{moves:['earthquake'],species:'Blissey'},{moves:['splash'],species:'Snorlax'});actual.rejuvenation.counters[0]=2;const target=pokemon(actual)[1];turn(actual,'move 1');
  const lost=before-target.hp,strike=Math.floor(target.maxhp*0.2);
  assert(r.totalMinDamage<=lost-strike && lost-strike<=r.totalMaxDamage,'the preview range covers the move damage alone: '+JSON.stringify([r.totalMinDamage,lost-strike,r.totalMaxDamage]));
  assert(r.totalMaxDamage<lost,'the strike is not folded into the range or the KO label');
  assert.equal(pokemon(b)[1].hp,before,'evaluating mutated nothing');assert.equal(b.rejuvenation.counters[0],2);b.destroy();actual.destroy();
 });
};
