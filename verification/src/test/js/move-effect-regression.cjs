// Field branches of Battle_MoveEffects.rb found by the handler-by-handler audit.
module.exports=({test,battle,pokemon,move,E,fid,assert,catalog})=>{
 const said=(b,text,from=0)=>b.log.slice(from).some(s=>s.includes('rejuvenationmessage') && s.includes(text));
 const stats=['atk','def','spa','spd','spe','accuracy','evasion'];
 const C=['concert_1','concert_2','concert_3','concert_4'];
 // One turn of `id` against a foe that only uses Harden; returns the stage changes of both.
 function turn(field,id,a={},t={},prepare){const b=battle(field,{moves:[id],ability:'Inner Focus',...a},{moves:['harden'],ability:'Inner Focus',...t}),[u,v]=pokemon(b);b.randomChance=()=>true;b.random=(m,n)=>n===undefined?0:m;if(prepare)prepare(u,v,b);const bu={...u.boosts},bv={...v.boosts},hp=v.hp,uhp=u.hp,from=b.log.length;b.makeChoices('move '+id,'move harden');
  const du={},dv={};for(const s of stats){if(u.boosts[s]-bu[s])du[s]=u.boosts[s]-bu[s];if(v.boosts[s]-bv[s])dv[s]=v.boosts[s]-bv[s];}return {b,u,v,du,dv,damage:hp-v.hp,userChange:u.hp-uhp,from};}
 // Stage changes of `id` beyond what a turn of Harden on the same field already causes (field residuals, the foe's own Harden).
 function net(field,id,a,t,prepare){const base=turn(field,'harden',a,t,prepare),r=turn(field,id,a,t,prepare);const sub=(d,e,own)=>{const o={};for(const s of stats){const n=(d[s] || 0)-((e[s] || 0)-(own && s==='def'?1:0));if(n)o[s]=n;}return o;};
  const out={user:sub(r.du,base.du,true),target:sub(r.dv,base.dv,false),r};base.b.destroy();return out;}

 test('stat-changing moves use the Battle_MoveEffects field amounts',()=>{
  const rows=[
   [['colosseum',...C],'howl',{atk:2},{}],[['rainbow','beach'],'meditate',{atk:3},{}],[['psychic_terrain'],'meditate',{atk:2,spa:2},{}],
   [['electric_terrain'],'charge',{spd:2},{}],[['grassy_terrain','dragons_den'],'coil',{atk:2,def:2,accuracy:2},{}],[['big_top','dragons_den'],'dragondance',{atk:2,spe:2},{}],
   [[...C,'city'],'workup',{atk:2,spa:2},{}],[['grassy_terrain','forest','flower_garden_1','flower_garden_2'],'growth',{atk:2,spa:2},{}],[['flower_garden_3','flower_garden_4','flower_garden_5'],'growth',{atk:3,spa:3},{}],
   [['misty_terrain','rainbow','holy','starlight','new_world','psychic_terrain'],'cosmicpower',{def:2,spd:2},{}],[['forest'],'defendorder',{def:2,spd:2},{}],[['big_top'],'quiverdance',{spa:2,spd:2,spe:2},{}],
   [['chess_board','beach','psychic_terrain'],'calmmind',{spa:2,spd:2},{}],[['big_top','fairytale','colosseum'],'swordsdance',{atk:3},{}],[['factory'],'irondefense',{def:3},{}],[['swamp'],'shelter',{def:3},{}],
   [['corrosive','corrosive_mist','murkwater_surface','fairytale',...C],'acidarmor',{def:3},{}],[['rocky'],'rockpolish',{spe:3},{}],[['crystal_cavern'],'rockpolish',{atk:1,spa:1,spe:2},{}],
   [['factory','deep_earth','city'],'autotomize',{spe:3},{}],[['chess_board','psychic_terrain','infernal','back_alley'],'nastyplot',{spa:3},{}],[['factory','city'],'shiftgear',{atk:2,spe:2},{}],
   [['colosseum'],'flatter',{},{spa:2}],[['colosseum'],'swagger',{},{atk:3}],[C,'growl',{},{atk:-2}],
   [['electric_terrain'],'electroweb',{},{spe:-2}],[['swamp'],'mudshot',{},{spe:-2}],[['swamp'],'strugglebug',{},{spa:-2}],[['frozen_dimension','back_alley'],'snarl',{},{spa:-2}],
   [['big_top'],'teeterdance',{},{def:-1}],[['psychic_terrain'],'psyshieldbash',{def:1,spd:1},{}],[['psychic_terrain'],'esperwing',{spe:2},{}],[['psychic_terrain'],'mysticalpower',{spa:2},{}],
   [['haunted'],'bittermalice',{},{atk:-1,spa:-1}],[['big_top'],'bellydrum',{atk:6,def:1,spd:1},{}],[['haunted'],'scaryface',{},{spe:-3}],[['grassy_terrain'],'cottonspore',{},{spe:-3}],
   [['psychic_terrain'],'kinesis',{atk:2,spa:2},{accuracy:-2}],[['electric_terrain','deep_earth'],'eerieimpulse',{},{spa:-3}],[['big_top'],'victorydance',{atk:2,def:2,spe:2},{}],
   [['water_surface','underwater','holy','new_world'],'takeheart',{spa:2,spd:2},{}],[['colosseum'],'noretreat',{atk:2,def:2,spa:2,spd:2,spe:2},{}],[['big_top','chess_board'],'noretreat',{atk:2,def:-1,spa:2,spd:-1,spe:2},{}],
   [['back_alley',...C],'partingshot',{},{atk:-2,spa:-2}],[['frozen_dimension'],'partingshot',{},{atk:-1,spa:-1,spe:-1}],
   [['volcanic','corrosive_mist','volcanic_top','back_alley','city'],'smokescreen',{},{accuracy:-2}],[['desert','beach'],'sandattack',{},{accuracy:-2}],[['short_circuit','dark_crystal_cavern','starlight','new_world'],'flash',{},{accuracy:-2}],
   [['beach'],'kinesis',{},{accuracy:-2}],[['indoor'],'kinesis',{},{accuracy:-1}],[['big_top'],'featherdance',{},{atk:-3}],[C,'screech',{},{def:-3}],[['factory','short_circuit',...C],'metalsound',{},{spd:-3}],[['back_alley'],'faketears',{},{spd:-3}],
   // Sweet Scent: evasion always falls two stages; the defenses follow the garden stage (1546-1553).
   [['misty_terrain','flower_garden_3'],'sweetscent',{},{evasion:-2,def:-1,spd:-1}],[['flower_garden_4'],'sweetscent',{},{evasion:-2,def:-2,spd:-2}],[['flower_garden_5'],'sweetscent',{},{evasion:-2,def:-3,spd:-3}],[['flower_garden_2','indoor'],'sweetscent',{},{evasion:-2}],
   // Noble Roar (7137) and the unchanged baselines
   [['fairytale','dragons_den'],'nobleroar',{},{atk:-2,spa:-2}],[['indoor'],'nobleroar',{},{atk:-1,spa:-1}],[['indoor'],'swordsdance',{atk:2},{}],[['indoor'],'growl',{},{atk:-1}]];
  for(const [fields,id,user,target]of rows)for(const field of fields){const n=net(field,id);assert.deepEqual(n.user,user,field+' '+id+' user');assert.deepEqual(n.target,target,field+' '+id+' target');n.r.b.destroy();}});

 test('Secret Power applies every field effect, including the Colosseum self boost',()=>{
  for(const [id,f]of Object.entries(catalog.fields)){const name=id.split(':')[1];for(let i=0;i<f.secretPowerEffects.length;i++){const b=battle(name,{moves:['secretpower']},{moves:['harden']});b.randomChance=()=>true;b.sample=list=>list[Math.min(i,list.length-1)];assert.doesNotThrow(()=>b.makeChoices('move secretpower','move harden'),name+' '+i);b.destroy();}}
  const n=net('colosseum','secretpower');assert.deepEqual(n.user,{atk:1});assert.deepEqual(n.target,{});n.r.b.destroy();
  const m=net('misty_terrain','secretpower');assert.deepEqual(m.target,{spa:-1});m.r.b.destroy();});

 test('Fairy Tale Sweet Kiss and Draining Kiss wake a sleeping target',()=>{
  for(const id of ['sweetkiss','drainingkiss'])for(const [field,woken]of [['fairytale',true],['indoor',false]]){const r=turn(field,id,{},{},(u,v)=>{v.setStatus('slp');v.statusState.time=5;v.statusState.startTime=5;});assert.equal(r.v.status,woken?'':'slp',field+' '+id);if(id==='sweetkiss')assert(r.v.volatiles.confusion,field+' confusion');r.b.destroy();}
  const r=turn('fairytale','drainingkiss',{},{},(u,v)=>{v.setStatus('slp');v.statusState.time=5;v.addVolatile('substitute');});assert.equal(r.v.status,'slp','a substitute keeps the target asleep');r.b.destroy();});

 test('Psychic Terrain Confide shows its source line only when the move can act',()=>{
  let r=turn('psychic_terrain','confide');assert(said(r.b,'Psst... This field is pretty weird, huh?',r.from));assert.equal(r.dv.spa,-1);r.b.destroy();
  r=turn('indoor','confide');assert(!said(r.b,'Psst...',r.from));r.b.destroy();
  r=turn('psychic_terrain','confide',{},{},(u,v)=>{v.boosts.spa=-6;});assert(!said(r.b,'Psst...',r.from));r.b.destroy();});

 test('Swamp String Shot lowers a random stat as well as Speed',()=>{
  for(const [index,expected]of [[0,{spe:-2,atk:-1}],[2,{spe:-2,spa:-1}],[4,{spe:-3}]]){const base=turn('swamp','harden');const b=battle('swamp',{moves:['stringshot'],ability:'Inner Focus'},{moves:['harden'],ability:'Inner Focus'}),[u,v]=pokemon(b);b.randomChance=()=>true;b.sample=list=>list[Math.min(index,list.length-1)];b.makeChoices('move stringshot','move harden');
   const got={};for(const s of stats){const n=v.boosts[s]-(base.dv[s] || 0);if(n)got[s]=n;}assert.deepEqual(got,expected,'draw '+index);b.destroy();base.b.destroy();}
  const n=net('indoor','stringshot');assert.deepEqual(n.target,{spe:-2});n.r.b.destroy();});

 test('Grassy Terrain Worry Seed also lowers Attack',()=>{for(const [field,expected]of [['grassy_terrain',{atk:-1}],['forest',{}],['indoor',{}]]){const n=net(field,'worryseed');assert.deepEqual(n.target,expected,field);assert.equal(n.r.v.ability,'insomnia');n.r.b.destroy();}
  const n=net('grassy_terrain','worryseed',{},{ability:'Truant'});assert.deepEqual(n.target,{},'a failed Worry Seed lowers nothing');n.r.b.destroy();});

 test('fixed-damage moves use their source field amounts',()=>{
  const hit=(field,id,prepare,t={})=>{const r=turn(field,id,{},{species:'Blissey',...t},prepare);const out=[r.damage,r.v.maxhp,r.b,r.from];return out;};
  for(const [field,id,amount,text]of [['rainbow','sonicboom',140,"It's a Sonic Rainboom!"],['indoor','sonicboom',20,null],['dimensional','dragonrage',140,'Unstoppable Rage!'],['frozen_dimension','dragonrage',140,'Unstoppable Rage!'],['deux_finalis','dragonrage',40,null],['indoor','dragonrage',40,null]]){
   const [damage,,b,from]=hit(field,id);assert.equal(damage,amount,field+' '+id);if(text)assert(said(b,text,from),field+' '+id+' text');else assert(!said(b,'Rainboom',from) && !said(b,'Unstoppable Rage',from));b.destroy();}
  // Nature's Madness and Ruination (2432-2440); the target starts at 401 of 651 HP so current and maximum HP differ.
  const wound=(u,v)=>{v.hp=401;};
  for(const [field,id,expected]of [['forest','naturesmadness',Math.floor(401*.75)],['holy','naturesmadness',Math.floor(401*.66)],['new_world','naturesmadness','half-max'],['new_world','ruination','half-max'],['indoor','naturesmadness',200],['indoor','ruination',200],['holy','ruination',200],['forest','superfang',200]]){
   const [damage,max,b]=hit(field,id,wound);assert.equal(damage,expected==='half-max'?Math.floor(max*.5):expected,field+' '+id);b.destroy();}
  // Grassy Terrain heals at the end of the turn, so read the damage from the log instead.
  const r=turn('grassy_terrain','naturesmadness',{},{species:'Blissey'},wound);const line=r.b.log.slice(r.from).find(s=>s.startsWith('|-damage|p2a'));assert.equal(401-Number(line.split('|')[3].split('/')[0]),Math.floor(401*.75));r.b.destroy();});

 test('Colosseum Stalwart is immune to one-hit knockout moves',()=>{
  for(const [field,ability,attacker,immune]of [['colosseum','Stalwart','Inner Focus',true],['colosseum','Inner Focus','Inner Focus',false],['indoor','Stalwart','Inner Focus',false],['colosseum','Stalwart','Mold Breaker',false]]){
   const r=turn(field,'fissure',{ability:attacker},{ability});assert.equal(r.v.hp,immune?r.v.maxhp:0,[field,ability,attacker].join());assert.equal(said(r.b,"It doesn't affect",r.from),immune);r.b.destroy();}});

 test('Corrosive Mist strengthens a grounded Misty Explosion',()=>{
  for(const [field,item,expected]of [['corrosive_mist','',1.5],['corrosive_mist','Air Balloon',1],['indoor','',1]]){const b=battle(field,{item}),[u,t]=pokemon(b);const m=move(b,'mistyexplosion');const value=b.runEvent('BasePower',u,t,m,100)/100;assert(Math.abs(value-expected)<.01,field+' '+item+' '+value);b.destroy();}});

 test('Factory Gear Up, Corrupted Toxic Thread and the blessing moves use their field amounts',()=>{
  for(const [field,amount]of [['factory',2],['indoor',1]]){const n=net(field,'gearup',{ability:'Plus'});assert.deepEqual(n.user,{atk:amount,spa:amount},field);n.r.b.destroy();}
  let n=net('factory','gearup');assert.deepEqual(n.user,{},'Gear Up still needs Plus or Minus');n.r.b.destroy();
  for(const [field,status]of [['corrupted','tox'],['indoor','psn']]){const r=turn(field,'toxicthread',{},{item:'Safety Goggles'});assert.equal(r.v.status,status,field);assert.equal(r.dv.spe,-1);r.b.destroy();}
  for(const [id,boosted]of [['lunarblessing',['starlight','new_world','holy']],['junglehealing',['forest','holy','new_world']]])for(const field of [...boosted,'indoor','rocky']){
   const r=turn(field,id,{},{},(u,v,b)=>{u.hp=10;u.setStatus('par');b.randomChance=()=>false;});assert.equal(r.userChange,Math.round(r.u.maxhp*(boosted.includes(field)?.33:.25)),field+' '+id);assert.equal(r.u.status,'',field+' '+id+' status');r.b.destroy();}
  const r=turn('holy','lunarblessing',{},{},(u,v,b)=>{u.setStatus('par');b.randomChance=()=>false;});assert.equal(r.u.status,'','status is cured at full HP');r.b.destroy();});

 test('Matcha Gotcha shows its cold-field line only after healing',()=>{
  for(const [field,hp,expected]of [['snowy_mountain',10,true],['icy',10,true],['snowy_mountain',null,false],['indoor',10,false]]){const r=turn(field,'matchagotcha',{},{species:'Snorlax'},(u)=>{if(hp)u.hp=hp;});assert.equal(said(r.b,'Warm tea tastes best in the cold!',r.from),expected,field+' '+hp);r.b.destroy();}});

 test('Chess Poltergeist needs no item and shows its source line',()=>{
  let r=turn('chess_board','poltergeist',{},{species:'Gardevoir'});assert(r.damage>0);assert(said(r.b,'The Chess piece came to life!',r.from));r.b.destroy();
  r=turn('indoor','poltergeist',{},{species:'Gardevoir'});assert.equal(r.damage,0);assert(!said(r.b,'The Chess piece came to life!',r.from));r.b.destroy();});

 test('self-damaging beams and Scale Shot use the source field costs once',()=>{
  // Steel Beam and Chloroblast: getRecoil replaces the half-HP cost, it does not add to it (8263-8269, 9991-9998).
  for(const [field,id,share]of [['factory','steelbeam',.25],['indoor','steelbeam',.5],['forest','chloroblast',.25],['indoor','chloroblast',.5]]){const r=turn(field,id,{},{species:'Blissey'});assert(r.damage>0);assert.equal(-r.userChange,Math.round(r.u.maxhp*share),field+' '+id);r.b.destroy();}
  let r=turn('short_circuit','steelbeam',{},{species:'Blissey'});assert(r.u.fainted,'Short Circuit Steel Beam costs all HP');r.b.destroy();
  r=turn('factory','steelbeam',{},{species:'Blissey',moves:['protect','harden']});r.b.destroy();
  const b=battle('factory',{moves:['steelbeam']},{moves:['protect']}),[u]=pokemon(b);b.makeChoices('move steelbeam','move protect');assert.equal(u.hp,u.maxhp,'no cost when nothing was hit');b.destroy();
  for(const ability of ['Rock Head','Magic Guard']){r=turn('forest','chloroblast',{ability},{species:'Blissey'});assert.equal(r.userChange,0,ability);r.b.destroy();}
  // Scale Shot: one Speed stage and no Defense drop, however many times it hits (8824-8828).
  for(const [field,expected]of [['deux_finalis',{spe:1}],['dragons_den',{spe:1}],['indoor',{spe:1,def:-1}]]){const n=net(field,'scaleshot',{},{species:'Blissey'});assert.deepEqual(n.user,expected,field);n.r.b.destroy();}});

 test('audit operators reject malformed parameters on reload',()=>{
  const rules=[{event:'modifyMove',condition:{always:true},actions:[{op:'moveBehavior',recipe:'fixedDamage',basis:'constant',factor:1}]},{event:'modifyMove',condition:{always:true},actions:[{op:'moveBehavior',recipe:'fixedDamage',basis:'level',factor:1,amount:140}]},
   {event:'modifyMove',condition:{always:true},actions:[{op:'moveProperty',path:'maxHPRecoil',value:2}]},{event:'modifyMove',condition:{always:true},actions:[{op:'moveProperty',path:'magnitude',value:11}]},{event:'modifyMove',condition:{always:true},actions:[{op:'moveProperty',path:'drain',value:[3,2]}]},
   {event:'modifyMove',condition:{always:true},actions:[{op:'moveBehavior',recipe:'payHP',fraction:.25,requireHit:true}]},{event:'afterMove',condition:{drainHealed:'yes'},actions:[]}];
  for(const rule of rules){const c=JSON.parse(JSON.stringify(catalog));c.fields[fid('forest')].rules.push({...rule,source:'test'});assert.throws(()=>E.load(JSON.stringify(c)),JSON.stringify(rule));}
  const good=JSON.parse(JSON.stringify(catalog));good.fields[fid('forest')].rules.push({event:'modifyMove',condition:{move:'sonicboom'},actions:[{op:'moveBehavior',recipe:'fixedDamage',basis:'constant',factor:1,amount:140,message:null}],source:'test'});assert.doesNotThrow(()=>E.load(JSON.stringify(good)));E.load(JSON.stringify(catalog));});

 test('Ashen Beach Shore Up restores all HP',()=>{for(const [field,share]of [['beach',1],['desert',.667],['indoor',.5]]){const r=turn(field,'shoreup',{},{},(u)=>{u.hp=1;});assert.equal(r.userChange,Math.min(r.u.maxhp-1,Math.ceil(r.u.maxhp*share-.5)),field);r.b.destroy();}});
};
