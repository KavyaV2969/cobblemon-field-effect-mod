// Field branches of Battle.rb outside the end-of-round phase: weather creation, entry, hazards, switching helpers and the Wasteland eruption.
module.exports=({test,battle,pokemon,move,E,fid,assert,catalog,Battle})=>{
 const said=(b,text,from=0)=>b.log.slice(from).some(s=>s.includes('rejuvenationmessage') && s.includes(text));
 const short=b=>b.rejuvenation.id.split(':')[1];
 function team(field,mine,theirs,format='gen9customgame'){const b=new Battle({formatid:format,seed:[1,2,3,4]});E.attach(b,fid(field));let n=0;
  const set=v=>{const moves=v.moves || ['harden'];return {species:'Mew',ability:'Inner Focus',...v,moves,uuid:'00000000-0000-0000-0000-0000000000'+String(++n).padStart(2,'0'),movesInfo:moves.map(()=>({pp:20,maxPp:20}))};};
  b.setPlayer('p1',{name:'A',team:mine.map(set)});b.setPlayer('p2',{name:'B',team:theirs.map(set)});b.choose('p1','team '+mine.map((_,i)=>i+1).join(''));b.choose('p2','team '+theirs.map((_,i)=>i+1).join(''));return b;}
 // The second Pokémon of the far side enters onto the prepared hazards.
 function entry(field,incoming,hazards={},prepare){const b=team(field,[{}],[{},incoming]);for(const [key,layers]of Object.entries(hazards))for(let i=0;i<layers;i++)b.sides[1].addSideCondition(key,b.sides[0].active[0]);if(prepare)prepare(b);
  const from=b.log.length;b.makeChoices('move harden','switch 2');const p=b.sides[1].active[0];return {b,p,from,loss:p.maxhp-p.hp,left:Object.keys(b.sides[1].sideConditions).sort().join()};}

 test('fields refuse or convert the weather they cannot hold',()=>{
  // canSetWeather? (369-408) and pbSetWeather (413)
  for(const [field,id,foeAbility,result,text]of [['new_world','raindance','Inner Focus','','The weather drifted off into space...'],['underwater','raindance','Inner Focus','',"You're too deep to notice the weather!"],
   ['volcanic','hail','Inner Focus','','The hail melted away.'],['volcanic','snowscape','Inner Focus','','The snow melted away.'],['volcanic_top','hail','Inner Focus','','The hail melted away.'],['infernal','snowscape','Inner Focus','','The snow melted away.'],
   ['infernal','raindance','Inner Focus','','The rain evaporated.'],['dragons_den','sandstorm','Inner Focus','sandstorm',null],['sky','raindance','Cloud Nine','','But it failed!'],['indoor','raindance','Cloud Nine','raindance',null],
   ['frozen_dimension','snowscape','Inner Focus','hail',null],['indoor','snowscape','Inner Focus','snow',null]]){
   const b=battle(field,{moves:[id]},{moves:['harden'],ability:foeAbility}),from=b.log.length;b.makeChoices('move '+id,'move harden');assert.equal(b.field.weather,result,field+' '+id);if(text)assert(said(b,text,from),field+' '+id+' text');b.destroy();}
  for(const [field,ability,result,text]of [['new_world','Drizzle','','The weather drifted off into space...'],['underwater','Drought','',"You're too deep to notice the weather!"],['volcanic','Snow Warning','','The snow melted away.'],['dragons_den','Snow Warning','','The snow melted away.'],
   ['infernal','Drizzle','','The rain evaporated.'],['frozen_dimension','Snow Warning','hail',null]]){const b=battle(field,{ability});assert.equal(b.field.weather,result,field+' '+ability);if(text)assert(said(b,text),field+' '+ability);b.destroy();}});

 test('rain after sun or sun after rain raises a rainbow',()=>{
  // pbSetWeather (462-475)
  const cast=(field,set={})=>{const b=battle(field,{moves:['raindance','sunnyday'],...set},{moves:['harden']});b.makeChoices('move raindance','move harden');const from=b.log.length;b.makeChoices('move sunnyday','move harden');return {b,from};};
  let r=cast('indoor');assert.equal(short(r.b),'rainbow');assert.equal(r.b.rejuvenation.duration,4,'five turns, one already spent');assert.equal(r.b.rejuvenation.overlay,null);assert(said(r.b,'The weather created a rainbow!',r.from));
  let from=r.b.log.length;r.b.makeChoices('move raindance','move harden');assert(said(r.b,'The weather refreshed the rainbow!',from));assert.equal(r.b.rejuvenation.duration,4,'the longer clock is kept');r.b.destroy();
  // A real field keeps its identity and receives the rainbow as an overlay, created anew each time.
  r=cast('forest');assert.equal(short(r.b),'forest');assert.equal(r.b.rejuvenation.overlay?.id,fid('rainbow'));assert.equal(r.b.rejuvenation.overlay.duration,4);from=r.b.log.length;r.b.makeChoices('move raindance','move harden');assert(said(r.b,'The weather created a rainbow!',from));r.b.destroy();
  r=cast('forest',{item:'Heat Rock'});assert.equal(r.b.rejuvenation.overlay.duration,7,'the rainbow lasts as long as the new weather');r.b.destroy();
  // A permanent Rainbow Field is left alone, and the Frozen Dimension cannot change.
  r=cast('rainbow');assert.equal(short(r.b),'rainbow');assert.equal(r.b.rejuvenation.duration,0);assert(!said(r.b,'rainbow!',r.from));r.b.destroy();
  r=cast('frozen_dimension');assert.equal(short(r.b),'frozen_dimension');assert.equal(r.b.rejuvenation.overlay,null);r.b.destroy();
  // Only the sun and rain pair counts, and primal weather uses the weather rock of its holder.
  let b=battle('forest',{moves:['raindance','sandstorm']},{moves:['harden']});b.makeChoices('move raindance','move harden');b.makeChoices('move sandstorm','move harden');assert.equal(b.rejuvenation.overlay,null);b.destroy();
  for(const [item,left]of [['',5],['Damp Rock',8]]){b=battle('forest',{moves:['harden']},{moves:['harden']});const [u,t]=pokemon(b);b.field.setWeather('sunnyday',u);u.setItem(item);u.setAbility('Primordial Sea');assert.equal(b.field.weather,'primordialsea');assert.equal(b.rejuvenation.overlay?.duration,left,'primal '+item);b.destroy();}});

 test('Tailwind stirs up timed strong winds on the high fields',()=>{
  // pbSetTailwind (746-749); canSetWeather? (369)
  for(const [field,foeAbility,prepare,turns]of [['mountain','Inner Focus',null,6],['snowy_mountain','Inner Focus',null,6],['volcanic_top','Inner Focus',null,6],['sky','Inner Focus',null,8],['indoor','Inner Focus',null,0],['sky','Cloud Nine',null,0],['mountain','Cloud Nine',null,6],
   ['mountain','Inner Focus','raindance',6],['mountain','Inner Focus','desolateland',0]]){
   const b=battle(field,{moves:['tailwind','harden']},{moves:['harden'],ability:foeAbility}),[u]=pokemon(b);if(prepare)b.field.setWeather(prepare,u);const from=b.log.length;b.makeChoices('move tailwind','move harden');
   assert.equal(b.field.weather==='deltastream',turns>0,field+' '+foeAbility+' '+prepare);if(!turns){b.destroy();continue;}
   assert(said(b,'Strong winds kicked up around the field!',from),field);assert.equal(b.field.weatherState.duration,turns-1,field);
   if(field==='mountain' && !prepare && foeAbility==='Inner Focus'){for(let i=0;i<5;i++)b.makeChoices('move harden','move harden');assert.equal(b.field.weather,'');assert(said(b,'The strong wind petered out.',from));}
   b.destroy();}
  // Delta Stream takes the timed winds over as permanent weather.
  const b=battle('mountain',{moves:['tailwind','harden']},{moves:['harden']}),[u,t]=pokemon(b);b.makeChoices('move tailwind','move harden');t.setAbility('Delta Stream');assert.equal(b.field.weather,'deltastream');assert(!b.field.weatherState.duration);
  for(let i=0;i<7;i++)b.makeChoices('move harden','move harden');assert.equal(b.field.weather,'deltastream');b.destroy();});

 test('Starlight Mirror Armor, Colosseum Wonder Guard, Glitch Rage and Colosseum Quick Draw',()=>{
  // priorityBlockingAbilities (883)
  for(const [field,ability,id,userAbility,blocked]of [['starlight','Mirror Armor','quickattack','Inner Focus',true],['indoor','Mirror Armor','quickattack','Inner Focus',false],['starlight','Mirror Armor','tackle','Inner Focus',false],
   ['starlight','Mirror Armor','quickattack','Mold Breaker',false],['starlight','Mirror Armor','thunderwave','Prankster',true],['starlight','Mirror Armor','swordsdance','Prankster',false],['starlight','Dazzling','quickattack','Inner Focus',true]]){
   const b=battle(field,{moves:[id],ability:userAbility},{moves:['harden'],ability}),[u,t]=pokemon(b);b.randomChance=()=>true;b.makeChoices('move '+id,'move harden');
   assert.equal(b.log.some(s=>s.startsWith('|cant|p2a') && s.includes('ability: '+ability)),blocked,[field,ability,id,userAbility].join());if(blocked){assert.equal(t.hp,t.maxhp);assert.equal(t.status,'');}b.destroy();}
  // magicGuardAbilities (887): hazards, Leech Seed and weather pass a Colosseum Wonder Guard by.
  for(const [field,hurt]of [['colosseum',false],['indoor',true]]){const r=entry(field,{ability:'Wonder Guard'},{spikes:1,stealthrock:1});assert.equal(r.loss>0,hurt,field+' hazards');r.b.destroy();
   const b=battle(field,{moves:['harden'],ability:'Wonder Guard'},{moves:['harden']}),[u,t]=pokemon(b);u.addVolatile('leechseed',t);b.field.setWeather('sandstorm',t);b.makeChoices('move harden','move harden');assert.equal(u.hp<u.maxhp,hurt,field+' residual');b.destroy();}
  // pbCanShowCommands? (1260): Rage cannot be given up on the Glitch Field.
  for(const [field,locked]of [['glitch',true],['indoor',false]]){const b=battle(field,{moves:['rage','harden']},{moves:['harden']});b.makeChoices('move rage','move harden');
   assert.equal(b.sides[0].activeRequest.active[0].moves.map(m=>m.id).join(),locked?'rage':'rage,harden',field);const from=b.log.length;b.makeChoices(locked?'move 1':'move harden','move harden');assert.equal(b.log.slice(from).some(s=>s.startsWith('|move|p1a') && s.includes('|Rage|')),locked,field);
   if(locked){E.change(b,fid('forest'));b.makeChoices('move 1','move harden');assert.equal(b.sides[0].activeRequest.active[0].moves.length,2,'released with the field');}b.destroy();}
  // setSubPrioData (1536-1538) and pbCritRate? (Battle_Move.rb:984)
  for(const [field,drawn,ratio]of [['colosseum',true,4],['colosseum',false,1],['indoor',true,1]]){const b=battle(field,{moves:['tackle'],ability:'Quick Draw'},{moves:['harden']}),[u,t]=pokemon(b);b.randomChance=(n,d)=>n===3 && d===10?drawn:true;b.makeChoices('move tackle','move harden');
   assert.equal(b.log.some(s=>s.includes('ability: Quick Draw')),drawn,field);assert.equal(b.runEvent('ModifyCritRatio',u,t,move(b,'tackle'),1),ratio,field+' '+drawn);b.destroy();}});

 test('Holy Revival Blessing, Deep Earth gravity, Burn Up and the Chess pieces at entry',()=>{
  // pbReviveDefeated (2054)
  for(const [field,fraction]of [['holy',.75],['indoor',.5]]){const b=team(field,[{moves:['revivalblessing','memento']},{moves:['revivalblessing','memento']}],[{}]);b.makeChoices('move memento','move harden');b.makeChoices('switch 2','');b.makeChoices('move revivalblessing','move harden');b.makeChoices('switch 2','');
   const revived=b.sides[0].pokemon.find(p=>p!==b.sides[0].active[0]);assert.equal(revived.hp,Math.floor(revived.maxhp*fraction),field);b.destroy();}
  // pbStartBattle (4565): the Deep Earth starts under endless gravity.
  let b=battle('deep_earth');assert(b.field.pseudoWeather.gravity);for(let i=0;i<7;i++)b.makeChoices('move 1','move 1');assert(b.field.pseudoWeather.gravity,'gravity does not run out');b.destroy();
  // 5340-5344: Burn Up's lost type returns at the end of the round on the burning fields.
  for(const [field,types]of [['volcanic','Fire/Flying'],['infernal','Fire/Flying'],['indoor','???/Flying']]){b=battle(field,{species:'Charizard',moves:['burnup']},{moves:['harden'],species:'Blissey'});const [u]=pokemon(b);b.makeChoices('move burnup','move harden');assert.equal(u.getTypes().join('/'),types,field);b.destroy();}
  // 3081-3099: each Chess piece announces itself and the heavy pieces take their boosts.
  b=new Battle({formatid:'gen9customgame',seed:[1,2,3,4]});E.attach(b,fid('chess_board'));const species=['Mew','Kingambit','Ninjask','Alakazam','Shuckle','Blissey'];
  for(let side=1;side<=2;side++)b.setPlayer('p'+side,{team:species.map((species,i)=>({species,ability:i===1?'Supreme Overlord':'Run Away',moves:['splash'],uuid:'entry-'+side+i,movesInfo:[{pp:20,maxPp:20}]}))});b.choose('p1','team 1, 2, 3, 4, 5, 6');b.choose('p2','team 1, 2, 3, 4, 5, 6');
  const lines={pawn:['became a Pawn and stormed up the board!',{}],king:['became a King and exposed itself!',{}],knight:['became a Knight and readied its position!',{}],bishop:['became a Bishop and took the diagonal!',{atk:1,spa:1}],rook:['became a Rook and took the open file!',{def:1,spd:1}],queen:['became a Queen and was placed on the center of the board!',{def:1,spd:1}]};
  assert(said(b,lines.pawn[0]));
  for(let slot=2;slot<=6;slot++){const from=b.log.length;b.makeChoices('switch '+slot,'move splash');const p=b.sides[0].active[0],[text,boosts]=lines[p.rejuvenationRoles[fid('chess_board')]];assert(said(b,text,from),p.name);
   assert.equal(JSON.stringify(Object.entries(p.boosts).filter(([,n])=>n).sort()),JSON.stringify(Object.entries(boosts).sort()),p.name);}
  b.destroy();});

 test('entry hazards take the shape of the field',()=>{
  const eighth=p=>Math.floor(p.maxhp/8);
  // Spikes (3176-3191)
  for(const [field,incoming,layers,loss,left,text]of [['indoor',{},1,p=>eighth(p),'spikes',null],['water_surface',{},1,()=>0,'',null],['murkwater_surface',{item:'Air Balloon'},3,()=>0,'',null],['sky',{},2,()=>0,'',null],
   ['electric_terrain',{},1,p=>eighth(p),'spikes','was hurt by the electrified spikes!'],['electric_terrain',{species:'Pidgeot'},3,p=>Math.floor(p.maxhp/4*2),'spikes','was hurt by the electrified spikes!'],
   ['electric_terrain',{species:'Sandslash'},3,()=>0,'spikes',null],['electric_terrain',{species:'Blastoise'},2,p=>Math.floor(p.maxhp/6*2),'spikes',null],['electric_terrain',{item:'Heavy-Duty Boots'},1,()=>0,'spikes',null],
   ['electric_terrain',{ability:'Magic Guard'},1,()=>0,'spikes',null],['indoor',{species:'Pidgeot'},3,()=>0,'spikes',null]]){
   const r=entry(field,incoming,{spikes:layers});assert.equal(r.loss,loss(r.p),field+' spikes '+JSON.stringify(incoming));assert.equal(r.left,left,field+' spikes left');if(text)assert(said(r.b,text,r.from),field);r.b.destroy();}
  // A terrain laid over another field does not electrify the spikes.
  let r=entry('rocky',{species:'Pidgeot'},{spikes:1},b=>E.change(b,fid('electric_terrain'),{duration:5}));assert.equal(r.loss,0);r.b.destroy();
  // Stealth Rock (3198-3224)
  for(const [field,incoming,loss,text]of [['indoor',{},p=>eighth(p),null],['rocky',{},p=>Math.floor(p.maxhp/8*2),null],['cave',{species:'Charizard'},p=>Math.floor(p.maxhp/8*8),null],
   ['volcanic_top',{},p=>eighth(p),'Molten stones dug into'],['infernal',{species:'Tangela',ability:'Magma Armor'},p=>Math.floor(p.maxhp/8*2),'Molten stones dug into'],['dragons_den',{species:'Charizard'},p=>Math.floor(p.maxhp/8*.5),'Molten stones dug into'],
   ['corrupted',{species:'Tangela',item:'Air Balloon'},p=>Math.floor(p.maxhp/8*2),'Corrupted stones dug into'],['corrupted',{species:'Registeel'},()=>0,null],['crystal_cavern',{species:'Tangela'},p=>Math.floor(p.maxhp/8*2),'Crystallized stones dug into'],
   ['volcanic_top',{item:'Heavy-Duty Boots'},()=>0,null],['rocky',{ability:'Magic Guard'},()=>0,null]]){
   r=entry(field,incoming,{stealthrock:1});assert.equal(r.loss,loss(r.p),field+' rocks '+JSON.stringify(incoming));assert.equal(r.left,'stealthrock');if(text)assert(said(r.b,text,r.from),field);r.b.destroy();}
  // Crystal Cavern rocks take the next type of the field's cycle: Fire, Water, Grass, Psychic.
  for(const [n,factor]of [[0,2],[1,.5],[2,.5],[3,1]]){r=entry('crystal_cavern',{species:'Tangela'},{stealthrock:1},b=>{b.rejuvenation.roll=n;});assert.equal(r.loss,Math.floor(r.p.maxhp/8*factor),'roll '+n);assert.equal(r.b.rejuvenation.roll,(n+1)%4);r.b.destroy();}
  // Corrosive Field entry (3231-3242)
  for(const [incoming,loss]of [[{},p=>Math.floor(p.maxhp/4)],[{species:'Tangela'},p=>Math.floor(p.maxhp/4*2)],[{species:'Pidgeot'},()=>0],[{species:'Arbok'},()=>0],[{species:'Registeel'},()=>0],[{item:'Heavy-Duty Boots'},()=>0],
   ...['Magic Guard','Poison Heal','Immunity','Wonder Guard','Toxic Boost','Pastel Veil'].map(ability=>[{ability},()=>0])]){
   r=entry('corrosive',incoming);assert.equal(r.loss,loss(r.p),'corrosion '+JSON.stringify(incoming));assert.equal(said(r.b,'was seared by the corrosion!',r.from),r.loss>0);r.b.destroy();}
  r=entry('indoor',{});assert.equal(r.loss,0);r.b.destroy();
  // Sticky Web (3251-3258)
  for(const [field,incoming,stages,left]of [['indoor',{},-1,'stickyweb'],['forest',{},-2,'stickyweb'],['forest',{item:'Air Balloon'},0,'stickyweb'],['forest',{item:'Heavy-Duty Boots'},0,'stickyweb'],['sky',{},0,'']]){
   r=entry(field,incoming,{stickyweb:1});assert.equal(r.p.boosts.spe,stages,field+' web '+JSON.stringify(incoming));assert.equal(r.left,left,field);r.b.destroy();}
  // Toxic Spikes (3260-3268)
  for(const [field,incoming,layers,status,left]of [['indoor',{},1,'psn','toxicspikes'],['indoor',{},2,'tox','toxicspikes'],['indoor',{species:'Arbok'},2,'',''],['corrosive',{species:'Arbok'},2,'','toxicspikes'],['corrosive',{ability:'Immunity'},1,'','toxicspikes'],
   ['water_surface',{},2,'',''],['murkwater_surface',{item:'Air Balloon'},1,'',''],['sky',{},1,'',''],['indoor',{item:'Heavy-Duty Boots'},1,'','toxicspikes']]){
   r=entry(field,incoming,{toxicspikes:layers});assert.equal(r.p.status,status,field+' toxic spikes '+JSON.stringify(incoming));assert.equal(r.left,left,field+' toxic spikes left');r.b.destroy();}
  // 3243: the din of a full Concert wakes a sleeper that enters.
  for(const [field,woken]of [['concert_3',true],['concert_4',true],['concert_2',false]]){r=entry(field,{},{},b=>{const p=b.sides[1].pokemon[1];p.status='slp';p.statusState={id:'slp',time:4,startTime:4};});
   assert.equal(r.p.status,woken?'':'slp',field);assert.equal(r.loss,woken?Math.floor(r.p.maxhp/4):0,field);assert.equal(said(r.b,"The Concert's noise could wake up even the dead!",r.from),woken,field);r.b.destroy();}});

 test('the Wasteland swallows hazards and throws them back at the end of the round',()=>{
  // 3177-3261: nothing is triggered on entry; 7007-7100: the eruption.
  const burst=(incoming,hazards)=>entry('wasteland',incoming,hazards);
  let r=burst({},{stealthrock:1});assert.equal(r.loss,Math.floor(r.p.maxhp/4));assert.equal(r.left,'');assert(said(r.b,'The waste swallowed up the pointed stones!',r.from) && said(r.b,'...Rocks spewed out from the ground below!',r.from));
  assert.equal(r.b.sides[0].active[0].hp,r.b.sides[0].active[0].maxhp,'only the side that held the hazard');r.b.destroy();
  r=burst({species:'Charizard'},{stealthrock:1});assert.equal(r.loss,Math.floor(r.p.maxhp/4*4));r.b.destroy();r=burst({ability:'Magic Guard'},{stealthrock:1});assert.equal(r.loss,0);assert.equal(r.left,'');r.b.destroy();
  for(const [incoming,layers,loss]of [[{},1,p=>Math.floor(p.maxhp/3)],[{},2,p=>Math.floor(2*p.maxhp/3)],[{},3,p=>p.maxhp],[{species:'Pidgeot'},3,()=>0],[{ability:'Magic Guard'},2,()=>0]]){
   r=burst(incoming,{spikes:layers});assert.equal(r.loss,Math.min(r.p.maxhp,loss(r.p)),'spikes '+layers+JSON.stringify(incoming));assert.equal(r.left,'');assert(said(r.b,'...Stalagmites burst up from the ground!',r.from));r.b.destroy();}
  for(const [incoming,layers,loss,status]of [[{},1,p=>Math.floor(p.maxhp/8),'psn'],[{},2,p=>Math.floor(2*p.maxhp/8),'tox'],[{species:'Arbok'},2,()=>0,''],[{species:'Registeel'},2,()=>0,''],[{item:'Air Balloon'},1,()=>0,''],[{ability:'Immunity'},1,p=>Math.floor(p.maxhp/8),'']]){
   r=burst(incoming,{toxicspikes:layers});assert.equal(r.loss,loss(r.p),'toxic spikes '+layers+JSON.stringify(incoming));assert.equal(r.p.status,status,'toxic spikes status '+JSON.stringify(incoming));assert.equal(r.left,'');assert(said(r.b,'...Poison needles shot up from the ground!',r.from));r.b.destroy();}
  r=burst({},{stickyweb:1});assert.equal(r.p.boosts.spe,-4);assert.equal(r.left,'');assert(said(r.b,'...Sticky string shot out of the ground!',r.from));r.b.destroy();
  r=burst({},{});assert.equal(r.loss,0);assert(!said(r.b,'The waste swallowed',r.from));r.b.destroy();});

 test('field traps hold battlers that could otherwise switch',()=>{
  // pbCanSwitch? (1723-1747): the `when` clauses of a `case true`, which the lead audit does not enumerate.
  const sleep=(b,u)=>{u.status='slp';u.statusState={id:'slp',time:6,startTime:6};},embargo=(b,u,t)=>u.addVolatile('embargo',t);
  for(const [field,mine,foe,prepare,held]of [
   ['dimensional',{species:'Gengar'},{ability:'Shadow Tag'},null,true],['indoor',{species:'Gengar'},{ability:'Shadow Tag'},null,false],['haunted',{species:'Gengar'},{ability:'Shadow Tag'},null,false],
   ['dimensional',{species:'Gengar',item:'Shed Shell'},{ability:'Shadow Tag'},null,false],['dimensional',{species:'Gengar',ability:'Shadow Tag'},{ability:'Shadow Tag'},null,false],['dimensional',{species:'Gengar'},{},null,false],
   ['infernal',{ability:'Magma Armor'},{ability:'Bad Dreams'},sleep,true],['infernal',{ability:'Magma Armor'},{ability:'Bad Dreams'},null,false],['infernal',{ability:'Magma Armor'},{},sleep,false],['indoor',{},{ability:'Bad Dreams'},sleep,false],
   ['infernal',{ability:'Magma Armor',item:'Shed Shell'},{ability:'Bad Dreams'},sleep,false],['infernal',{species:'Gengar',ability:'Magma Armor'},{ability:'Bad Dreams'},sleep,false],
   ['dimensional',{},{},embargo,true],['frozen_dimension',{},{},embargo,true],['infernal',{ability:'Magma Armor'},{},embargo,false],['indoor',{},{},embargo,false],['dimensional',{species:'Gengar'},{},embargo,false],
   ['dimensional',{item:'Shed Shell'},{},embargo,true,'Embargo silences the Shed Shell']]){
   const b=team(field,[mine,{}],[foe]),u=b.sides[0].active[0],t=b.sides[1].active[0];if(prepare)prepare(b,u,t);b.makeChoices('move harden','move harden');const request=b.sides[0].activeRequest.active[0];
   assert.equal(!!request.trapped,held,[field,JSON.stringify(mine),JSON.stringify(foe),prepare?.name].join(' '));
   if(held){b.choose('p1','switch 2');assert(b.sides[0].choice.error,'the switch is refused');}b.destroy();}});

 test('status gates and Soul Dew follow their field branches',()=>{
  // Battle_Effects.rb pbCanStatus? and relatives (91-95, 142-144, 211, 489-492)
  const inflict=(field,id,set,user={})=>{const b=battle(field,{moves:[id],ability:'No Guard',...user},{moves:['harden'],ability:'Synchronize',...set}),[u,t]=pokemon(b);b.randomChance=()=>true;b.random=(m,n)=>n===undefined?0:m;const from=b.log.length;b.makeChoices('move '+id,'move harden');return {b,t,from};};
  for(const [field,item,status]of [['dragons_den','Amulet Coin',''],['dragons_den','','par'],['indoor','Amulet Coin','par']]){const r=inflict(field,'thunderwave',{item});assert.equal(r.t.status,status,field+' '+item);
   assert.equal(said(r.b,"The Amulet Coin prevents",r.from),field==='dragons_den' && !!item);r.b.destroy();}
  for(const [field,ability,status]of [['sky','Early Bird',''],['indoor','Early Bird','slp'],['sky','Synchronize','slp']]){const r=inflict(field,'spore',{ability});assert.equal(r.t.status,status,field+' '+ability);r.b.destroy();}
  for(const [field,set,confused]of [['beach',{species:'Machamp'},false],['beach',{ability:'Inner Focus'},false],['beach',{},true],['indoor',{species:'Machamp'},true],['indoor',{ability:'Inner Focus'},true],['misty_terrain',{},false],['misty_terrain',{item:'Air Balloon'},true]]){
   const r=inflict(field,'confuseray',set);assert.equal(!!r.t.volatiles.confusion,confused,field+' '+JSON.stringify(set));r.b.destroy();}
  for(const [field,ability,species,status]of [['corrosive','Toxic Chain','Arbok','tox'],['corrosive_mist','Toxic Chain','Registeel','tox'],['indoor','Toxic Chain','Arbok',''],['corrosive','Inner Focus','Arbok','']]){
   const r=inflict(field,'tackle',{species,ability:'Inner Focus'},{ability});assert.equal(r.t.status,status,field+' '+ability);r.b.destroy();}
  // Battle_Move.rb:762-765 and 1532: Soul Dew shelters and arms Latias and Latios on the dimensional fields.
  for(const [field,active]of [['dimensional',true],['infernal',true],['deux_finalis',true],['frozen_dimension',false],['indoor',false]]){
   for(const [id,species,item,sheltered]of [['darkpulse','Latias','Soul Dew',true],['shadowball','Latios','Soul Dew',true],['darkpulse','Latias','',false],['darkpulse','Mew','Soul Dew',false],['psychic','Latias','Soul Dew',false]]){
    const b=battle(field,{moves:[id]},{species,item,ability:'Inner Focus'}),[u,t]=pokemon(b),m=move(b,id);b.activeMove=m;b.activePokemon=u;b.activeTarget=t;const plain=b.dex.getEffectiveness(m.type,t);
    assert.equal(t.runEffectiveness(m),active && sheltered?-1:plain,[field,id,species,item].join());b.destroy();}
   for(const [id,species,item,factor]of [['darkpulse','Latios','Soul Dew',1.5],['darkpulse','Latias','Soul Dew',1.5],['darkpulse','Latios','',1],['darkpulse','Mew','Soul Dew',1],['shadowball','Latios','Soul Dew',1]]){
    const b=battle(field,{species,item,ability:'Inner Focus',moves:[id]},{}),[u,t]=pokemon(b),m=move(b,id);b.activeMove=m;assert.equal(b.runEvent('ModifySpA',u,t,m,1000),active?1000*factor:1000,[field,id,species,item].join());b.destroy();}}});

 test('Healing Wish and Lunar Dance are granted even to a healthy replacement on their fields',()=>{
  // healingWish and lunarDance (8002-8031)
  const all={atk:1,def:1,spa:1,spd:1,spe:1},offense={atk:1,spa:1};
  for(const [id,field,boosts,text]of [['healingwish','indoor',null],['healingwish','fairytale',offense,'The healing wish came true for'],['healingwish','starlight',offense,'The healing wish came true for'],['healingwish','new_world',null],
   ['lunardance','indoor',null],['lunardance','fairytale',null],['lunardance','starlight',offense,'became cloaked in mystical moonlight!'],['lunardance','new_world',all,'became cloaked in mystical moonlight!'],['lunardance','big_top',all,'became cloaked in mystical moonlight!']]){
   const b=team(field,[{moves:[id]},{}],[{}]),from=b.log.length;b.makeChoices('move '+id,'move harden');b.makeChoices('switch 2','');const p=b.sides[0].active[0],pending=!!b.sides[0].slotConditions[0]?.[id];
   assert.equal(pending,!boosts,id+' '+field+' pending');assert.equal(JSON.stringify(Object.entries(p.boosts).filter(([,n])=>n).sort()),JSON.stringify(Object.entries(boosts || {}).sort()),id+' '+field);if(text)assert(said(b,text,from),id+' '+field);b.destroy();}
  // A hurt replacement is healed as usual and still receives the field's boost.
  const b=team('starlight',[{moves:['healingwish']},{}],[{}]),hurt=b.sides[0].pokemon[1];hurt.hp=10;hurt.status='par';b.makeChoices('move healingwish','move harden');b.makeChoices('switch 2','');assert.equal(hurt.hp,hurt.maxhp);assert.equal(hurt.status,'');assert.equal(hurt.boosts.atk,1);assert.equal(hurt.boosts.spa,1);b.destroy();});
 test('Battle.rb audit operators and field policies reject malformed configuration',()=>{
  const rule=(action,condition={always:true})=>c=>c.fields[fid('forest')].rules.push({event:'residual',condition,actions:action?[action]:[],source:'test'});
  const policy=(key,value)=>c=>{c.fields[fid('forest')][key]=value;};
  for(const change of [rule({op:'setWeather',id:'deltastream',duration:0}),rule({op:'hazardBurst',id:'spikes',messages:['x']}),rule({op:'hazardBurst',id:'wish',messages:['x'],fraction:.25}),rule({op:'setHPFraction',fraction:2}),
   rule({op:'volatileDuration',id:'slowstart',amount:0,minimum:1}),rule({op:'clearHazards'}),c=>{c.trainers={kanto_brock:{field:'rejuvenation:indoor'}};},c=>c.fields[fid('forest')].rules.push({event:'modifyMove',condition:{always:true},actions:[{op:'moveProperty',path:'secondaries.0.self',value:{boosts:{atk:6}}}],source:'test'}),rule({op:'trap',force:'yes'}),c=>c.fields[fid('forest')].rules.push({event:'sideConditionEnd',condition:{always:true},actions:[],source:'test'}),
   policy('hazardPolicy',{source:'t',stickyweb:{stages:1}}),policy('hazardPolicy',{source:'t',cleared:['reflect']}),policy('weatherRainbow',{field:fid('rainbow')}),policy('timedWeatherText',{fog:{startMessage:'a',endMessage:'b',source:'t'}}),
   policy('entryWishes',{wish:{boosts:{atk:1},message:'m',source:'t'}}),policy('effectivenessOverrides',[{condition:{always:true},value:9,source:'t'}]),policy('revivalBlessing',{fraction:2,source:'t'}),
   policy('volatileMoveLocks',{rage:{move:'notamove',source:'t'}}),policy('silentVolatileEnds',['rage']),policy('priorityBlockingAbilities',['notanability']),policy('clockPolicy',{pauseOverlay:false,pausedConditions:['tailwind'],source:'t'})]){
   const c=JSON.parse(JSON.stringify(catalog));change(c);assert.throws(()=>E.load(JSON.stringify(c)),String(change));}
  E.load(JSON.stringify(catalog));});
};
