// End-of-round field branches of Battle.rb (pbEndOfRoundPhase, 5404-7370): weather, field abilities, overlays, status and timed effects.
module.exports=({test,battle,pokemon,move,E,fid,assert,catalog,Battle})=>{
 const said=(b,text,from=0)=>b.log.slice(from).some(s=>s.includes('rejuvenationmessage') && s.includes(text));
 const overlay=id=>b=>E.change(b,fid(id),{duration:5});
 const sleep=p=>{p.status='slp';p.statusState={id:'slp',time:6,startTime:6};};
 const weather=w=>(b,u)=>b.field.setWeather(w,u);
 // One round in which both sides only use Harden. `hp` lists signed divisors: [-8,16] is a loss of floor(max/8) and a gain of floor(max/16).
 function round(field,set={},prepare,foe={}){const b=battle(field,{moves:['harden'],ability:'Inner Focus',...set},{moves:['harden'],ability:'Inner Focus',...foe}),[u,t]=pokemon(b);u.hp=Math.floor(u.maxhp/2);if(prepare)prepare(b,u,t);const hp=u.hp,from=b.log.length;b.makeChoices('move harden','move harden');
  const boosts={};for(const [k,n]of Object.entries(u.boosts)){const v=k==='def'?n-1:n;if(v)boosts[k]=v;}return {b,u,t,from,delta:u.hp-hp,boosts};}
 const amount=(u,list)=>list.reduce((n,d)=>n+(typeof d==='function'?d(u):Math.sign(d)*Math.floor(u.maxhp/Math.abs(d))),0);
 function table(rows){const bad=[];for(const [field,set,prepare,expect,label]of rows){const r=round(field,set,prepare),name=[field,JSON.stringify(set),label || ''].join(' ');
   if(expect.hp!==undefined){const hp=amount(r.u,expect.hp);if(r.delta!==hp)bad.push(name+': HP '+r.delta+' expected '+hp);}
   const sorted=o=>JSON.stringify(Object.entries(o).sort());
   if(expect.boosts!==undefined && sorted(r.boosts)!==sorted(expect.boosts))bad.push(name+': boosts '+JSON.stringify(r.boosts)+' expected '+JSON.stringify(expect.boosts));
   if(expect.status!==undefined && r.u.status!==expect.status)bad.push(name+': status '+r.u.status);
   for(const text of [].concat(expect.says || []))if(!said(r.b,text,r.from))bad.push(name+': missing "'+text+'"');
   for(const text of [].concat(expect.silent || []))if(said(r.b,text,r.from))bad.push(name+': unexpected "'+text+'"');
   if(expect.check){const problem=expect.check(r);if(problem)bad.push(name+': '+problem);}
   r.b.destroy();}
  assert.deepEqual(bad,[]);}

 test('weather acts on the field and its battlers at the end of the round',()=>{
  // Field transitions (5404-5431)
  for(const [field,w,turns,end,text]of [['volcanic','raindance',1,'cave','The rain snuffed out the flame!'],['volcanic','sandstorm',1,'cave','The sand snuffed out the flame!'],['rainbow','sandstorm',1,'indoor','The weather blocked out the rainbow!'],['rainbow','hail',1,'indoor','The weather blocked out the rainbow!'],['rainbow','snow',1,'indoor','The weather blocked out the rainbow!'],
   ['mountain','hail',2,'mountain',null],['mountain','hail',3,'snowy_mountain','The mountain was covered in snow!'],['mountain','snow',3,'snowy_mountain','The mountain was covered in snow!'],['mountain','raindance',3,'mountain',null]]){
   const b=battle(field,{moves:['harden']},{moves:['harden']}),[u]=pokemon(b);b.field.setWeather(w,u);const from=b.log.length;for(let i=0;i<turns;i++)b.makeChoices('move harden','move harden');
   assert.equal(b.rejuvenation.id,fid(end),field+' '+w+' '+turns);if(text)assert(said(b,text,from),field+' '+w);b.destroy();}
  table([
   // Solar Power does not burn its holder in the Frozen Dimension (5446).
   ['frozen_dimension',{ability:'Solar Power'},weather('sunnyday'),{hp:[]}],['indoor',{ability:'Solar Power'},weather('sunnyday'),{hp:[-8]}],
   // Desert sun parches Grass and Water types (5464).
   ['desert',{species:'Tangela'},weather('sunnyday'),{hp:[-8],says:'Tangela was hurt by the sunlight!'}],['desert',{species:'Blastoise'},weather('sunnyday'),{hp:[-8]}],
   ['desert',{species:'Tangela',ability:'Chlorophyll'},weather('sunnyday'),{hp:[]}],['desert',{species:'Tangela',ability:'Solar Power'},weather('sunnyday'),{hp:[-8]},'only the ability damage'],
   ['desert',{species:'Tangela',item:'Utility Umbrella'},weather('sunnyday'),{hp:[]}],['desert',{},weather('sunnyday'),{hp:[]}],['indoor',{species:'Tangela'},weather('sunnyday'),{hp:[]}],
   // Sandstorm, hail and Shadow Sky bite twice as hard on their fields (5530, 5549, 5586).
   ['desert',{},weather('sandstorm'),{hp:[-8]}],['indoor',{},weather('sandstorm'),{hp:[-16]}],['frozen_dimension',{},weather('hail'),{hp:[-8]}],['indoor',{},weather('hail'),{hp:[-16]}],
   ['dimensional',{},weather('shadowsky'),{hp:[-8]}],['frozen_dimension',{},weather('shadowsky'),{hp:[-8]}],['indoor',{},weather('shadowsky'),{hp:[-16]}]]);});

 test('field abilities and field damage resolve at the end of the round',()=>{
  const tar=(b,u,t)=>u.addVolatile('tarshot',t);
  table([
   // Electric Terrain and Short Circuit (5841-5857)
   ['electric_terrain',{ability:'Motor Drive'},null,{hp:[],boosts:{spe:1}}],['indoor',{ability:'Motor Drive'},null,{hp:[],boosts:{}}],
   ['electric_terrain',{ability:'Volt Absorb'},null,{hp:[16],says:'absorbed stray electricity!'}],['short_circuit',{ability:'Volt Absorb'},null,{hp:[16]}],['indoor',{ability:'Volt Absorb'},null,{hp:[]}],
   // Grassy and Misty Terrain (5859-5878)
   ['grassy_terrain',{},null,{hp:[16],says:'The grass healed the Pokémon on the battlefield.'}],['grassy_terrain',{item:'Air Balloon'},null,{hp:[]}],
   ['grassy_terrain',{ability:'Sap Sipper'},null,{hp:[16,16],says:'ate some grass to recover!'}],['grassy_terrain',{ability:'Sap Sipper',item:'Air Balloon'},null,{hp:[16]}],
   ['misty_terrain',{ability:'Dry Skin'},null,{hp:[16],says:'was healed a little by the mist!'}],
   // Burning fields (5892-5925)
   ['volcanic',{},null,{hp:[-8],says:'The Pokémon were burned by the field!'}],['infernal',{},null,{hp:[-8]}],['volcanic',{item:'Air Balloon'},null,{hp:[]}],['volcanic',{species:'Charizard'},null,{hp:[]}],
   ['volcanic',{ability:'Flash Fire'},null,{hp:[],says:"Fire-type moves rose!"}],['volcanic',{ability:'Well-Baked Body'},null,{hp:[],boosts:{def:1}}],
   ['volcanic',{ability:'Leaf Guard'},null,{hp:[-4]}],['volcanic',{},tar,{hp:[-4]},'Tar Shot'],['volcanic',{ability:'Thermal Exchange'},null,{hp:[-8],boosts:{atk:1}}],
   ['volcanic',{species:'Tangela'},null,{hp:[-4]},'super effective'],['volcanic',{species:'Blastoise'},null,{hp:[-16]},'resisted'],['volcanic',{ability:'Magic Guard'},null,{hp:[]}],['volcanic',{},(b,u)=>u.addVolatile('aquaring'),{hp:[16]},'Aqua Ring'],
   // Swamp (5927-5938)
   ['swamp',{},null,{hp:[],boosts:{spe:-1},says:"The Pokémon's Speed sank..."}],['swamp',{ability:'Clear Body'},null,{boosts:{}}],['swamp',{item:'Air Balloon'},null,{boosts:{}}],['swamp',{item:'Heavy-Duty Boots'},null,{boosts:{}}],
   ['swamp',{},(b,u,t)=>u.addVolatile('partiallytrapped',t,b.dex.getActiveMove('wrap')),{hp:[-8],boosts:{spe:-2}},'trapped'],['swamp',{ability:'Dry Skin'},null,{hp:[16],boosts:{spe:-1},says:'was healed a little by the murk!'}],
   // Rainbow (5946-5959)
   ['rainbow',{ability:'Cloud Nine'},null,{check:r=>Object.values(r.boosts).reduce((n,v)=>n+v,0)===1?null:'no random boost'}],
   // Corrosive, Corrosive Mist and Corrupted Cave (5968-6000, 6180-6195)
   ['corrosive',{ability:'Grass Pelt'},null,{hp:[-8],says:'pelt is withering!'}],
   ['corrosive_mist',{},null,{status:'psn',says:'The Pokémon were poisoned by the corrosive mist!'}],['corrosive_mist',{species:'Registeel'},null,{status:''}],
   ['corrosive_mist',{ability:'Dry Skin'},null,{hp:[-8],says:'absorbed the poison!'}],['corrosive_mist',{species:'Arbok',ability:'Dry Skin'},null,{hp:[8],says:'was healed by the poison!'}],['corrosive_mist',{species:'Registeel',ability:'Dry Skin'},null,{hp:[]}],
   ['corrupted',{ability:'Dry Skin'},null,{hp:[-8]}],['corrupted',{ability:'Leaf Guard'},null,{hp:[-8],says:'foliage caused harm!'}],
   ['corrupted',{},null,{status:'psn',says:'The Pokémon were poisoned!'}],['corrupted',{item:'Air Balloon'},null,{status:''}],['corrupted',{ability:'Immunity'},null,{status:''}],['corrupted',{ability:'Wonder Skin'},null,{status:''}],
   // Desert, ice and forest (6002-6031)
   ['desert',{ability:'Earth Eater'},null,{hp:[16],says:'ate sand to recover!'}],['desert',{ability:'Dry Skin'},null,{hp:[-8],says:'was hurt by the desert air!'}],
   ['icy',{ability:'Ice Body'},null,{hp:[16],says:'was healed a little by the ice!'}],['snowy_mountain',{ability:'Ice Body'},null,{hp:[16],says:'was healed a little by the snow!'}],['frozen_dimension',{ability:'Ice Body'},null,{hp:[16],says:'by the ice!'}],
   ['forest',{ability:'Sap Sipper'},null,{hp:[16],says:'drank tree sap to recover!'}],
   // Water (6084-6113, 6141-6149)
   ['water_surface',{ability:'Water Absorb'},null,{hp:[16],says:'absorbed some of the water!'}],['water_surface',{ability:'Dry Skin'},null,{hp:[16]}],['water_surface',{ability:'Water Absorb',item:'Air Balloon'},null,{hp:[]}],['underwater',{ability:'Water Absorb',item:'Air Balloon'},null,{hp:[16]}],
   ['water_surface',{},tar,{says:'The tar washed off',check:r=>r.u.volatiles.tarshot?'tar remains':null}],
   ['underwater',{species:'Charizard'},null,{hp:[-4],says:'struggled in the water!'}],['underwater',{species:'Charizard',ability:'Flame Body'},null,{hp:[-2]}],['underwater',{},null,{hp:[]}],['underwater',{species:'Charizard',ability:'Swift Swim'},null,{hp:[]}],
   ['swamp',{ability:'Water Compaction',item:'Clear Amulet'},null,{boosts:{def:2}}],['water_surface',{ability:'Water Compaction'},null,{boosts:{def:2}}],['water_surface',{ability:'Water Compaction',item:'Air Balloon'},null,{boosts:{}}],['underwater',{ability:'Water Compaction',item:'Air Balloon'},null,{boosts:{def:2}}],
   // Spirits (6096-6103, 6170-6178)
   ['haunted',{ability:'Soul Eater'},null,{hp:[16],says:'devoured spirits to recover!'}],['dimensional',{ability:'Soul Eater'},null,{hp:[16]}],['deux_finalis',{ability:'Soul Eater'},null,{hp:[16]}],['indoor',{ability:'Soul Eater'},null,{hp:[]}],
   ['desert',{ability:'Wandering Spirit'},null,{boosts:{spe:-1}}],['haunted',{ability:'Wandering Spirit'},null,{boosts:{spe:-1}}],['indoor',{ability:'Wandering Spirit'},null,{boosts:{}}],
   // Murkwater Surface (6119-6139)
   ['murkwater_surface',{},null,{hp:[-8],says:'The Pokémon are hurt by the toxic water!'}],['murkwater_surface',{item:'Air Balloon'},null,{hp:[]}],['murkwater_surface',{species:'Registeel'},null,{hp:[]}],['murkwater_surface',{ability:'Flame Body'},null,{hp:[-4]}],
   ['murkwater_surface',{species:'Tangela'},null,{hp:[-4]},'super effective'],['murkwater_surface',{ability:'Surge Surfer'},null,{hp:[]}],['murkwater_surface',{species:'Arbok',ability:'Dry Skin'},null,{hp:[8],says:'is healed by the poisoned water!'}],
   // Strong winds on the mountains (6151-6168)
   ['mountain',{ability:'Wind Rider'},weather('deltastream'),{boosts:{atk:1}}],['snowy_mountain',{ability:'Wind Rider'},weather('deltastream'),{boosts:{atk:1}}],['mountain',{ability:'Wind Rider'},null,{boosts:{}}],
   ['mountain',{ability:'Wind Power'},weather('deltastream'),{says:'The wind charged',check:r=>r.u.volatiles.charge?null:'no charge'}],
   // Bewitched Woods, Infernal and Steam Engine (6197-6220)
   ['bewitched',{species:'Tangela'},null,{hp:[16],says:'The woods healed the Grass-type Pokémon on the battlefield.'}],['bewitched',{},null,{hp:[]}],
   ['infernal',{ability:'Magma Armor'},(b,u)=>u.addVolatile('torment'),{hp:[-8],says:'is hurt by Torment!'}],['infernal',{ability:'Magic Guard'},(b,u)=>u.addVolatile('torment'),{hp:[]}],
   ['volcanic_top',{ability:'Steam Engine'},null,{boosts:{spe:1}}],['water_surface',{ability:'Steam Engine'},null,{boosts:{spe:1}}],['underwater',{ability:'Steam Engine'},null,{boosts:{spe:1}}],['indoor',{ability:'Steam Engine'},null,{boosts:{}}]]);});

 test('the Volcanic Top eruption, petrified Speed and Mimicry resolve at the end of the round',()=>{
  const erupt=more=>(b,u,t)=>{E.runActions([{op:'arm_eruption'}],{b,user:u});if(more)more(b,u,t);};
  const immune='is immune to the eruption!',hurt='is hurt by the eruption!';
  table([
   // 6033-6082
   ['volcanic_top',{},erupt(),{hp:[-8],says:hurt}],['volcanic_top',{species:'Charizard'},erupt(),{hp:[],says:immune}],['volcanic_top',{},erupt((b,u)=>u.addVolatile('aquaring')),{hp:[16],says:immune}],
   ['volcanic_top',{},erupt((b,u)=>u.side.addSideCondition('wideguard',u)),{hp:[],says:immune}],
   ...['Sturdy','Battle Armor','Shell Armor','Solid Rock','Flame Body','Water Bubble','Magic Guard','Wonder Guard','Prism Armor'].map(ability=>['volcanic_top',{ability},erupt(),{hp:[],says:immune,boosts:{}}]),
   ['volcanic_top',{ability:'Thick Fat'},erupt(),{hp:[-16]}],['volcanic_top',{},erupt((b,u,t)=>u.addVolatile('tarshot',t)),{hp:[-4]}],['volcanic_top',{species:'Tangela'},erupt(),{hp:[-4]}],['volcanic_top',{species:'Blastoise'},erupt(),{hp:[-16]}],
   ['volcanic_top',{ability:'Magma Armor'},erupt(),{hp:[],boosts:{def:1,spd:1},says:immune}],['volcanic_top',{ability:'Flare Boost'},erupt(),{hp:[],boosts:{spa:1}}],
   ['volcanic_top',{ability:'Flash Fire'},erupt(),{hp:[],says:'Fire-type moves rose!'}],['volcanic_top',{ability:'Blaze'},erupt(),{hp:[],says:'Fire-type moves rose!'}],
   ['volcanic_top',{},erupt((b,u)=>sleep(u)),{hp:[-8],status:'',says:'woke up due to the eruption!'}],['volcanic_top',{ability:'Soundproof'},erupt((b,u)=>sleep(u)),{hp:[-8],status:'slp'}],
   ['volcanic_top',{ability:'Sturdy'},erupt((b,u,t)=>u.addVolatile('leechseed',t)),{says:'Leech Seed burned away in the eruption!',check:r=>r.u.volatiles.leechseed?'still seeded':null}],
   ['volcanic_top',{},null,{hp:[],silent:[hurt,immune]},'no eruption'],
   // Deux Finalis sinks the Speed of the petrified unless Fairy Aura guards their side (5961-5966, 6223).
   ['deux_finalis',{ability:'Magic Guard'},(b,u)=>{u.status='ptr';u.statusState={id:'ptr'};},{boosts:{spe:-1},says:"The Pokémon's Speed sank..."}],['deux_finalis',{ability:'Fairy Aura'},(b,u)=>{u.status='ptr';u.statusState={id:'ptr'};},{boosts:{}}],['deux_finalis',{},null,{boosts:{}}]]);
  // Mimicry is re-rolled every round on the Crystal Cavern and the New World (6115-6117).
  for(const field of ['crystal_cavern','new_world','forest']){const b=battle(field,{moves:['harden'],ability:'Mimicry'},{moves:['harden']}),[u]=pokemon(b),seen=new Set([u.getTypes().join()]);for(let i=0;i<4;i++){b.makeChoices('move harden','move harden');seen.add(u.getTypes().join());}
   if(field==='forest')assert.equal(seen.size,1,field);else assert(seen.size>1,field+' '+[...seen]);b.destroy();}
  let b=battle('crystal_cavern',{moves:['harden'],ability:'Mimicry'},{moves:['harden']}),[u]=pokemon(b);const cycle=['Fire','Water','Grass','Psychic'],first=cycle.indexOf(u.getTypes()[0]);assert(first>=0);
  for(let i=1;i<=4;i++){b.makeChoices('move harden','move harden');assert.equal(u.getTypes().join(),cycle[(first+i)%4],'round '+i);}b.destroy();});

 test('binding moves squeeze harder on their fields',()=>{
  // 6651-6681
  for(const [field,id,item,divisor]of [['indoor','wrap','',8],['indoor','wrap','Binding Band',6],['dragons_den','magmastorm','',6],['indoor','magmastorm','',8],['desert','sandtomb','',6],['water_surface','whirlpool','',6],['underwater','whirlpool','',6],['indoor','whirlpool','',8],
   ['forest','infestation','',6],['flower_garden_2','infestation','',8],['flower_garden_3','infestation','',6],['flower_garden_4','infestation','',4],['flower_garden_5','infestation','',3],['flower_garden_5','infestation','Binding Band',2],
   ['volcanic','firespin','',6],['haunted','firespin','',6],['indoor','firespin','',8],['electric_terrain','thundercage','',6],['indoor','thundercage','',8],['rocky','thundercage','',8]]){
   const b=battle(field,{item,ability:'Inner Focus'},{ability:'Magma Armor'}),[u,t]=pokemon(b);t.addVolatile('partiallytrapped',u,move(b,id));const hp=t.hp;b.residualEvent('Residual');assert.equal(hp-t.hp,Math.floor(t.maxhp/divisor),[field,id,item].join());b.destroy();}
  for(const [field,id,drops]of [['beach','sandtomb',true],['beach','wrap',false],['desert','sandtomb',false]]){const b=battle(field,{},{ability:'Inner Focus'}),[u,t]=pokemon(b);t.addVolatile('partiallytrapped',u,move(b,id));b.residualEvent('Residual');assert.equal(t.boosts.accuracy,drops?-1:0,field+' '+id);b.destroy();}
  // Swamp: Snap Trap and Infestation also cost a random stat, on top of the doubled sinking (6678-6681, 5931).
  for(const [id,total]of [['snaptrap',-3],['infestation',-3],['wrap',-2]]){const b=battle('swamp',{},{ability:'Inner Focus'}),[u,t]=pokemon(b);t.addVolatile('partiallytrapped',u,move(b,id));b.residualEvent('Residual');assert.equal(Object.values(t.boosts).reduce((n,v)=>n+v,0),total,id);b.destroy();}
  // Octolock squeezes twice as hard under water (6710).
  for(const [field,stages]of [['underwater',-2],['indoor',-1]]){const b=battle(field,{},{ability:'Inner Focus'}),[u,t]=pokemon(b);t.addVolatile('octolock',u,move(b,'octolock'));b.residualEvent('Residual');assert.equal(t.boosts.def,stages,field);assert.equal(t.boosts.spd,stages,field);b.destroy();}});

 test('terrain overlays heal at the end of the round and an eruption sweeps hazards away',()=>{
  // Overlays (6224-6255)
  table([['rocky',{ability:'Volt Absorb'},overlay('electric_terrain'),{hp:[16],says:'absorbed stray electricity!'}],['rocky',{},overlay('grassy_terrain'),{hp:[16],says:'The grass healed the Pokémon on the battlefield.'}],
   ['rocky',{item:'Air Balloon'},overlay('grassy_terrain'),{hp:[]}],['rocky',{ability:'Sap Sipper'},overlay('grassy_terrain'),{hp:[16,16],says:'ate some grass to recover!'}],['rocky',{ability:'Dry Skin'},overlay('misty_terrain'),{hp:[16],says:'was healed a little by the mist!'}]]);
  // Extremely harsh sunlight erupts the Volcanic Top every round (5834); the eruption removes every hazard (6257-6278).
  for(const [w,erupts]of [['desolateland',true],['sunnyday',false]]){const b=battle('volcanic_top',{moves:['harden']},{moves:['harden']}),[u]=pokemon(b);b.field.setWeather(w,u);for(const side of b.sides)for(const key of ['spikes','toxicspikes','stealthrock','stickyweb'])side.addSideCondition(key,u);
   const from=b.log.length;b.makeChoices('move harden','move harden');assert.equal(said(b,'The volcano is going to erupt!',from),erupts,w);assert.equal(said(b,'The eruption removed all hazards from the field!',from),erupts,w);
   assert.equal(Object.keys(b.sides[0].sideConditions).length+Object.keys(b.sides[1].sideConditions).length,erupts?0:8,w);assert.equal(u.hp<u.maxhp,erupts,w+' damage');b.destroy();}
  const b=battle('volcanic_top',{moves:['harden']},{moves:['harden']}),[u]=pokemon(b);b.field.setWeather('desolateland',u);const from=b.log.length;b.makeChoices('move harden','move harden');assert(!said(b,'The eruption removed all hazards',from),'nothing to remove');b.destroy();});

 test('status, draining and healing effects follow the field at the end of the round',()=>{
  const shed=(b,u)=>{b.randomChance=()=>false;u.setStatus('par');};
  const seeded=(b,u,t)=>u.addVolatile('leechseed',t);
  table([
   // Shed Skin always sheds in the Dragon's Den (6286-6298).
   ['dragons_den',{ability:'Shed Skin'},shed,{hp:[4],status:'',boosts:{spe:1,spa:1,def:-1,spd:-1},says:"scaled sheen glimmers brightly!"}],['indoor',{ability:'Shed Skin'},shed,{hp:[],status:'par',boosts:{}}],['dragons_den',{ability:'Shed Skin'},null,{hp:[],boosts:{}},'no status'],
   // Aqua Ring and Ingrain draw poison (6335-6361).
   ['corrosive_mist',{},(b,u)=>u.addVolatile('aquaring'),{hp:[-16],says:"Aqua Ring absorbed the poison!"}],['corrosive_mist',{species:'Arbok'},(b,u)=>u.addVolatile('aquaring'),{hp:[16]}],['corrosive_mist',{species:'Registeel'},(b,u)=>u.addVolatile('aquaring'),{hp:[16]}],
   ['corrosive',{},(b,u)=>u.addVolatile('ingrain'),{hp:[-16],says:'absorbed foul nutrients with its roots!'}],['corrupted',{ability:'Immunity'},(b,u)=>u.addVolatile('ingrain'),{hp:[-16]}],['corrosive',{species:'Arbok'},(b,u)=>u.addVolatile('ingrain'),{hp:[16]}],
   ['corrosive',{ability:'Magic Guard'},(b,u)=>u.addVolatile('ingrain'),{hp:[]}],['swamp',{item:'Clear Amulet'},(b,u)=>u.addVolatile('ingrain'),{hp:[16]}],
   // Leech Seed saps twice as much on the Wasteland (6373).
   ['wasteland',{},seeded,{hp:[-8,-8]}],['indoor',{},seeded,{hp:[-8]}],
   // Poison Heal feeds on polluted fields (6491-6497).
   ['corrosive_mist',{ability:'Poison Heal'},null,{hp:[8],says:'was healed by the poison!'}],['corrupted',{ability:'Poison Heal'},null,{hp:[8]}],['corrosive_mist',{ability:'Poison Heal',item:'Air Balloon'},null,{hp:[8]}],
   ['corrosive',{ability:'Poison Heal'},null,{hp:[8]}],['murkwater_surface',{ability:'Poison Heal'},null,{hp:[8]}],['wasteland',{ability:'Poison Heal'},null,{hp:[8]}],['corrosive',{ability:'Poison Heal',item:'Air Balloon'},null,{hp:[]}],['wasteland',{ability:'Poison Heal',item:'Air Balloon'},null,{hp:[]}],
   ['indoor',{ability:'Poison Heal'},null,{hp:[]}],['corrosive',{ability:'Poison Heal'},(b,u)=>{u.status='psn';u.statusState={id:'psn'};},{hp:[8]},'already poisoned heals once'],
   // Gluttony and Purifying Salt on Deux Finalis (6503-6521).
   ['deux_finalis',{ability:'Gluttony'},null,{hp:[16],says:'started devouring its surroundings!'}],['deux_finalis',{ability:'Purifying Salt'},null,{hp:[16],says:'repaired itself using the surrounding salt!'}],['indoor',{ability:'Gluttony'},null,{hp:[]}],['indoor',{ability:'Purifying Salt'},null,{hp:[]}],
   // Burns are halved on the Icy Field (6530).
   ['icy',{},(b,u)=>{u.status='brn';u.statusState={id:'brn'};},{hp:[-32]}],['indoor',{},(b,u)=>{u.status='brn';u.statusState={id:'brn'};},{hp:[-16]}],['icy',{ability:'Heatproof'},(b,u)=>{u.status='brn';u.statusState={id:'brn'};},{hp:[-32]}]]);});

 test('sleep, curses, salt and blocked healing follow the field',()=>{
  const asleep=(b,u)=>sleep(u),trapped=(b,u,t)=>{sleep(u);u.addVolatile('partiallytrapped',t,b.dex.getActiveMove('wrap'));};
  const nightmare=(b,u)=>{sleep(u);u.volatiles.nightmare={id:'nightmare',target:u};};
  table([
   // Sleeping on a hostile field (6558-6580)
   ['swamp',{item:'Clear Amulet'},asleep,{hp:[-16],says:"strength is sapped by the swamp!"}],['swamp',{item:'Clear Amulet'},trapped,{hp:[-8,-8]},'trap damage and doubled sapping'],['swamp',{ability:'Magic Guard'},asleep,{hp:[]}],
   ['dimensional',{},asleep,{hp:[-16],says:'dream is corrupted by the dimension!'}],['haunted',{},asleep,{hp:[-16],says:'dream is corrupted by the evil spirits!'}],['haunted',{species:'Gengar'},asleep,{hp:[]}],
   ['bewitched',{},asleep,{hp:[-16],says:'dream is corrupted by the evil in the woods!'}],['corrosive',{},asleep,{hp:[-16],says:'is seared by the corrosion!'}],['corrosive',{item:'Air Balloon'},asleep,{hp:[]}],['corrosive',{ability:'Immunity'},asleep,{hp:[]}],
   ['corrosive',{species:'Registeel'},asleep,{hp:[]}],['rainbow',{},asleep,{hp:[16],says:'recovered health in its peaceful sleep!'}],['indoor',{},asleep,{hp:[]}],['dimensional',{},null,{hp:[]},'awake'],
   // Nightmare (6541-6552): a third on the Haunted Field, nothing on Rainbow, and no sleep needed on Infernal.
   ['indoor',{},nightmare,{hp:[-4],says:'is locked in a nightmare!'}],['haunted',{},nightmare,{hp:[-3,-16]}],['rainbow',{},nightmare,{hp:[16]}],
   ['infernal',{ability:'Magma Armor'},(b,u)=>{u.volatiles.nightmare={id:'nightmare',target:u};},{hp:[-4]},'awake'],['indoor',{},(b,u)=>{u.volatiles.nightmare={id:'nightmare',target:u};},{hp:[],check:r=>r.u.volatiles.nightmare?'nightmare persists':null},'awake'],
   // Curse is lifted on the Holy Field (6589-6591).
   ['holy',{},(b,u,t)=>u.addVolatile('curse',t),{hp:[],says:"curse was lifted!",check:r=>r.u.volatiles.curse?'still cursed':null}],['indoor',{},(b,u,t)=>u.addVolatile('curse',t),{hp:[-4],check:r=>r.u.volatiles.curse?null:'curse gone'}],
   // Salt Cure deals 1/6 (1/3 to Water/Steel) on the Holy Field and Deux Finalis (6607-6609, pre-Champions divisor).
   ['holy',{},(b,u,t)=>u.addVolatile('saltcure',t),{hp:[-6]}],['deux_finalis',{},(b,u,t)=>u.addVolatile('saltcure',t),{hp:[-6]}],['indoor',{},(b,u,t)=>u.addVolatile('saltcure',t),{hp:[-8]}],
   ['holy',{species:'Blastoise'},(b,u,t)=>u.addVolatile('saltcure',t),{hp:[-3]}],['deux_finalis',{species:'Steelix'},(b,u,t)=>u.addVolatile('saltcure',t),{hp:[-3]}],['indoor',{species:'Blastoise'},(b,u,t)=>u.addVolatile('saltcure',t),{hp:[-4]}],
   // Heal Block drains in the dimensions (6613-6627).
   ['dimensional',{},(b,u,t)=>u.addVolatile('healblock',t),{hp:[-16],says:'Heal Block is draining its health!'}],['frozen_dimension',{},(b,u,t)=>u.addVolatile('healblock',t),{hp:[-16]}],['infernal',{ability:'Magma Armor'},(b,u,t)=>u.addVolatile('healblock',t),{hp:[-16]}],
   ['dimensional',{ability:'Magic Guard'},(b,u,t)=>u.addVolatile('healblock',t),{hp:[]}],['indoor',{},(b,u,t)=>u.addVolatile('healblock',t),{hp:[]}]]);});

 test('room clocks, Bad Dreams, Harvest and Slow Start follow the field at the end of the round',()=>{
  // Trick Room, Gravity, Wonder Room and Magic Room do not count down in the Frozen Dimension (6920-6961).
  for(const id of ['trickroom','gravity','wonderroom','magicroom']){const b=battle('dimensional',{moves:[id,'harden']},{moves:['harden']});b.makeChoices('move '+id,'move harden');const left=b.field.pseudoWeather[id].duration;assert(left>1,id);
   E.change(b,fid('frozen_dimension'));for(let i=0;i<4;i++)b.makeChoices('move harden','move harden');assert(b.field.pseudoWeather[id],id+' still active');
   E.change(b,fid('indoor'));assert.equal(b.field.pseudoWeather[id].duration,left,id+' resumes where it stopped');b.makeChoices('move harden','move harden');assert.equal(b.field.pseudoWeather[id].duration,left-1,id);b.destroy();}
  // Bad Dreams (7128-7143)
  for(const [field,foe,divisor]of [['indoor',{},8],['rainbow',{},0],['infernal',{ability:'Magma Armor'},4],['colosseum',{ability:'Wonder Guard'},0],['indoor',{ability:'Magic Guard'},0]]){
   const b=battle(field,{moves:['harden'],ability:'Bad Dreams'},{moves:['harden'],ability:'Inner Focus',...foe}),[u,t]=pokemon(b);sleep(t);b.makeChoices('move harden','move harden');assert.equal(t.maxhp-t.hp,divisor?Math.floor(t.maxhp/divisor):0,field+' '+JSON.stringify(foe));b.destroy();}
  // Harvest never fails on Flower Garden stages two to five or on Grassy Terrain (7245-7247).
  for(const [field,regrown]of [['flower_garden_1',false],['flower_garden_2',true],['flower_garden_3',true],['flower_garden_4',true],['flower_garden_5',true],['grassy_terrain',true],['forest',false],['indoor',false]]){
   const b=battle(field,{moves:['harden'],ability:'Harvest',item:'Lum Berry'},{moves:['harden']}),[u]=pokemon(b);b.randomChance=()=>false;u.eatItem(true);assert.equal(u.item,'');b.makeChoices('move harden','move harden');assert.equal(u.item,regrown?'lumberry':'',field);b.destroy();}
  // Slow Start counts twice as fast on Electric Terrain (7295) and ends without a word in the Deep Earth (7296).
  for(const [field,rounds,line]of [['indoor',5,true],['electric_terrain',3,true],['deep_earth',5,false]]){const b=battle(field,{moves:['harden'],ability:'Slow Start'},{moves:['harden']}),[u]=pokemon(b);
   for(let i=1;i<=5;i++){b.makeChoices('move harden','move harden');assert.equal(!!u.volatiles.slowstart,i<rounds,field+' round '+i);}assert.equal(b.log.some(s=>s.startsWith('|-end|') && s.includes('Slow Start')),line,field+' end line');b.destroy();}
  let b=battle('rocky',{moves:['harden'],ability:'Slow Start'},{moves:['harden']}),[u]=pokemon(b);E.change(b,fid('electric_terrain'),{duration:8});for(let i=0;i<3;i++)b.makeChoices('move harden','move harden');assert(u.volatiles.slowstart,'an overlay does not hurry Slow Start');b.destroy();
  // Hunger Switch stops in the Frozen Dimension (7365).
  for(const [field,changes]of [['frozen_dimension',false],['indoor',true]]){b=battle(field,{species:'Morpeko',ability:'Hunger Switch',moves:['harden']},{moves:['harden']});[u]=pokemon(b);const form=u.species.name;b.makeChoices('move harden','move harden');assert.equal(u.species.name!==form,changes,field);b.destroy();}});
};
