// Field-machinery branches of Battle_Field.rb: weather removal, overlays, progressive fields and field-wide events.
module.exports=({test,battle,pokemon,move,E,fid,assert,catalog,Battle})=>{
 const said=(b,text,from=0)=>b.log.slice(from).some(s=>s.includes('rejuvenationmessage') && s.includes(text));
 const fix=b=>{b.randomChance=()=>true;b.random=(m,n)=>n===undefined?0:m;};
 const short=b=>b.rejuvenation.id.split(':')[1];

 test('Indoor is the absence of a field while City is a real field in Rejuvenation',()=>{
  // isFieldEffect? (51-55): no introduction and no move or type boosts indoors; the City exclusion applies only to other games.
  const indoor=catalog.fields[fid('indoor')],city=catalog.fields[fid('city')];assert.equal(Object.keys(indoor.moves).length,0);assert.equal(indoor.types.length,0);assert(!indoor.entryMessage);assert(Object.keys(city.moves).length>0);assert(city.entryMessage);
  const b=battle('indoor'),[u,t]=pokemon(b);for(const id of ['tackle','flamethrower','surf','earthquake','moonblast'])assert.equal(b.runEvent('BasePower',u,t,move(b,id),100),100,id);assert(!b.log.some(s=>s.includes('rejuvenationmessage')),'no field introduction');b.destroy();
  const c=battle('city');assert(c.log.some(s=>s.includes('rejuvenationmessage') && s.includes(city.entryMessage)));c.destroy();});

 test('entering a weatherless or hot field removes the weather it cannot hold',()=>{
  // noWeather (228-248)
  for(const [field,weather,gone,text]of [['new_world','raindance',true,'The weather disappeared into space!'],['underwater','sunnyday',true,"You're too deep to notice the weather!"],
   ['volcanic','hail',true,'The hail melted away!'],['volcanic_top','snow',true,'The snow melted away!'],['infernal','hail',true,'The hail melted away!'],['dragons_den','snow',true,'The snow melted away!'],['infernal','raindance',true,'The rain evaporated!'],
   ['volcanic','raindance',false,null],['dragons_den','sandstorm',false,null],['rocky','hail',false,null]]){
   const b=battle('forest'),[u]=pokemon(b);b.field.setWeather(weather,u);assert.equal(b.field.weather,weather==='snow'?'snow':weather);const from=b.log.length;E.change(b,fid(field));
   if(field==='volcanic' && weather==='raindance'){b.destroy();continue;}
   assert.equal(b.field.weather==='',gone,field+' '+weather);if(text)assert(said(b,text,from),field+' '+weather+' text');b.destroy();}});

 test('overlays are dropped, kept or refused according to the hard field',()=>{
  // noOverlay (263-284)
  for(const [dest,overlay,removed,text]of [['new_world','misty_terrain',true,'The terrain had no solid ground to attach...'],['underwater','grassy_terrain',true,'The terrain disappeared in the water!'],['corrosive_mist','misty_terrain',true,null],['misty_terrain','misty_terrain',true,null],
   ['corrosive_mist','grassy_terrain',false,null],['rocky','misty_terrain',false,null]]){const b=battle('forest');E.change(b,fid(overlay),{duration:4});assert.equal(b.rejuvenation.overlay?.id,fid(overlay));const from=b.log.length;E.change(b,fid(dest));
   assert.equal(b.rejuvenation.overlay===null,removed,dest+' '+overlay);if(text)assert(said(b,text,from),dest);b.destroy();}
  // setField (338-352): a temporary terrain is a hard field over Indoor and an overlay elsewhere; Dimensional rolls its clock.
  let b=battle('indoor',{moves:['electricterrain']},{moves:['harden']});b.makeChoices('move electricterrain','move harden');assert.equal(short(b),'electric_terrain');assert.equal(b.rejuvenation.overlay,null);b.destroy();
  b=battle('rocky',{moves:['electricterrain']},{moves:['harden']});b.makeChoices('move electricterrain','move harden');assert.equal(short(b),'rocky');assert.equal(b.rejuvenation.overlay?.id,fid('electric_terrain'));assert.equal(b.rejuvenation.overlay.duration,4);b.destroy();
  const seen=new Set();for(const roll of [3,5,8]){b=battle('dimensional');b.random=(m,n)=>{assert.deepEqual([m,n],[3,9]);return roll;};E.change(b,fid('misty_terrain'),{duration:5});seen.add(b.rejuvenation.overlay.duration);b.destroy();}assert.deepEqual([...seen],[3,5,8]);
  // canChangeFE (286-306): the three immovable fields refuse terrain with their own lines.
  for(const [field,text]of [['new_world','The terrain had no solid ground to attach...'],['underwater','The terrain disappeared in the water!'],['frozen_dimension','The frozen dimension remains unchanged.']]){b=battle(field,{moves:['grassyterrain']},{moves:['harden']});const from=b.log.length;b.makeChoices('move grassyterrain','move harden');assert.equal(short(b),field);assert.equal(b.rejuvenation.overlay,null,field);assert(said(b,text,from),field);b.destroy();}
  // The same terrain twice, or Misty Terrain over Corrosive Mist, simply fails.
  b=battle('rocky',{moves:['mistyterrain']},{moves:['harden']});b.makeChoices('move mistyterrain','move harden');const from=b.log.length;b.makeChoices('move mistyterrain','move harden');assert(b.log.slice(from).some(s=>s.startsWith('|-fail|p1a')) || said(b,'But it failed!',from));b.destroy();
  b=battle('corrosive_mist',{moves:['mistyterrain']},{moves:['harden']});b.makeChoices('move mistyterrain','move harden');assert.equal(b.rejuvenation.overlay,null);b.destroy();});

 test('field changes carry their source side effects',()=>{
  // pbEffectsOnFieldChange (431-435)
  let b=battle('forest'),[u,t]=pokemon(b);E.change(b,fid('deep_earth'));assert(b.field.pseudoWeather.gravity,'Deep Earth brings gravity');E.change(b,fid('forest'));assert(!b.field.pseudoWeather.gravity,'and takes it away');b.destroy();
  b=battle('forest');[u,t]=pokemon(b);b.field.setWeather('snow',u);E.change(b,fid('frozen_dimension'));assert.equal(b.field.weather,'hail');b.destroy();
  for(const [field,woken]of [['concert_3',true],['concert_4',true],['concert_2',false]]){b=battle('forest');[u,t]=pokemon(b);u.setStatus('slp');const hp=u.hp,from=b.log.length;E.change(b,fid(field));assert.equal(u.status,woken?'':'slp',field);assert.equal(hp-u.hp,woken?Math.floor(u.maxhp/4):0,field);assert.equal(said(b,"The Concert's noise could wake up even the dead!",from),woken,field);b.destroy();}});

 test('progressive fields grow and shrink with the source texts, and Ripen doubles the growth',()=>{
  // growField (825-844)
  const seed=catalog.fields[fid('flower_garden_1')].seed.item;
  let b=battle('flower_garden_1',{item:seed,ability:'Ripen'});assert.equal(short(b),'flower_garden_3');b.destroy();b=battle('flower_garden_4',{item:seed,ability:'Ripen'});assert.equal(short(b),'flower_garden_5','growth stops at the last stage');b.destroy();
  // Field-changing moves take the next stage's own change with Ripen on stages 1-3 (643-647).
  for(const [start,ability,end]of [[1,'Ripen',3],[2,'Ripen',4],[3,'Ripen',5],[4,'Ripen',5],[1,'Inner Focus',2]]){b=battle('flower_garden_'+start,{moves:['growth'],ability},{moves:['harden']});b.makeChoices('move growth','move harden');assert.equal(short(b),'flower_garden_'+end,start+' '+ability);b.destroy();}
  // reduceField (846-864)
  b=battle('flower_garden_3',{moves:['cut']},{moves:['harden']});fix(b);let from=b.log.length;b.makeChoices('move cut','move harden');assert.equal(short(b),'flower_garden_2');assert(said(b,'The garden was cut down a bit!',from));b.destroy();
  b=battle('flower_garden_1',{moves:['cut']},{moves:['harden']});fix(b);b.makeChoices('move cut','move harden');assert.equal(short(b),'flower_garden_1');b.destroy();
  // pbChangeStats (Battle_Effects.rb:1066-1068): evasion going up, or evasion or accuracy going down, shrinks the field
  // one stage per such stat. The call is not limited to concerts, so gardens are cut down too.
  for(const [field,id,end,text]of [['concert_3','sandattack','concert_2','The crowd is booing!'],['concert_3','doubleteam','concert_2','The crowd is booing!'],['concert_1','sandattack','concert_1',null],['concert_4','sweetscent','concert_3','The crowd is booing!'],
   ['flower_garden_3','sandattack','flower_garden_2','The garden was cut down!'],['flower_garden_5','doubleteam','flower_garden_4','The garden was cut down!'],['flower_garden_1','sandattack','flower_garden_1',null],['flower_garden_2','swordsdance','flower_garden_2',null],['forest','sandattack','forest',null]]){
   b=battle(field,{moves:[id],ability:'Inner Focus'},{moves:['harden'],ability:'Inner Focus'});fix(b);from=b.log.length;b.makeChoices('move '+id,'move harden');assert.equal(short(b),end,field+' '+id);if(text)assert(said(b,text,from),field+' '+id);else assert(!said(b,'cut down',from) && !said(b,'booing',from),field+' '+id);b.destroy();}
  // A stat that cannot move does not count, and two qualifying stats in one change count twice.
  b=battle('concert_3',{moves:['sandattack'],ability:'Inner Focus'},{moves:['harden'],ability:'Keen Eye'});fix(b);b.makeChoices('move sandattack','move harden');assert.equal(short(b),'concert_3','Keen Eye keeps the crowd');b.destroy();
  b=battle('flower_garden_5');const [mon]=pokemon(b);b.boost({accuracy:-1,evasion:-1},mon,mon);assert.equal(short(b),'flower_garden_3');b.destroy();
  b=battle('concert_3',{ability:'Klutz'});assert.equal(short(b),'concert_2');assert(said(b,'The crowd is booing!'));b.destroy();b=battle('concert_2',{ability:'Punk Rock'});assert.equal(short(b),'concert_3');assert(said(b,'is getting the crowd hyped!'));b.destroy();});

 test('field-wide move events use the source damage and immunities',()=>{
  // mistExplosion (659-688)
  const blast=(field,target={},user={})=>{const b=battle(field,{moves:['heatwave'],ability:'Inner Focus',...user},{moves:['harden'],ability:'Inner Focus',species:'Blissey',...target}),[u,t]=pokemon(b);fix(b);const from=b.log.length;b.makeChoices('move heatwave','move harden');return {b,u,t,from};};
  let r=blast('corrosive_mist');assert(r.u.fainted && r.t.fainted,'everything combusts');r.b.destroy();
  // The change effect runs after the field has already changed (setField/breakField evaluate it last), so the Corrosive
  // Mist Sturdy/Endure allowance (680) and the Corrupted Cave half damage (679) never see their own field and never apply.
  r=blast('corrosive_mist',{},{ability:'Sturdy'});assert(r.u.fainted,'Sturdy does not survive the explosion');assert.equal(r.b.rejuvenation.id,fid('indoor'));r.b.destroy();
  r=blast('corrupted');assert(r.u.fainted && r.t.fainted,'the Corrupted Cave explosion is not halved');assert.equal(r.b.rejuvenation.id,fid('volcanic'));r.b.destroy();
  r=blast('corrupted',{moves:['protect','harden']});r.b.destroy();r=blast('corrosive_mist',{ability:'Flash Fire'},{ability:'Flash Fire'});assert(!r.u.fainted,'Flash Fire is untouched');r.b.destroy();
  r=blast('corrosive_mist',{ability:'Damp'});assert(!r.u.fainted);assert(said(r.b,'The dampness prevents a complete explosion!',r.from));assert.equal(r.b.rejuvenation.id,fid('indoor'),'the mist is still burnt away');r.b.destroy();
  // fieldAccuracyDrop (808-817)
  for(const [field,id,text]of [['volcanic_top','surf','Steam shot up from the field!'],['beach','sandstorm','The sand was stirred up from the ground!']]){const b=battle(field,{moves:[id],ability:'Inner Focus'},{moves:['harden'],ability:'Inner Focus'}),[u,t]=pokemon(b);fix(b);const from=b.log.length;b.makeChoices('move '+id,'move harden');
   assert(said(b,text,from),field);assert.equal(u.boosts.accuracy,-1,field);assert.equal(t.boosts.accuracy,-1,field);b.destroy();}
  // iceSpikes (774-789): only over solid ground.
  for(const [base,spikes]of [['indoor',true],['water_surface',false]]){const b=battle(base,{moves:['earthquake'],ability:'Inner Focus'},{moves:['harden'],ability:'Inner Focus'});fix(b);E.change(b,fid('icy'),{push:true});const from=b.log.length;b.makeChoices('move earthquake','move harden');
   assert.equal(!!b.sides[0].sideConditions.spikes && !!b.sides[1].sideConditions.spikes,spikes,base);assert.equal(said(b,'The quake broke up the ice into spiky pieces!',from),spikes,base);b.destroy();}});
};
