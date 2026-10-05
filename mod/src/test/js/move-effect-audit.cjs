// Behavioral checks for the Battle_MoveEffects.rb field branches that earlier only had structural tests or none.
module.exports=({test,battle,pokemon,move,E,fid,assert,Battle})=>{
 const said=(b,text,from=0)=>b.log.slice(from).some(s=>s.includes('rejuvenationmessage') && s.includes(text));
 const stats=['atk','def','spa','spd','spe','accuracy','evasion'];
 const fixRolls=b=>{b.randomChance=()=>true;b.random=(m,n)=>n===undefined?0:m;};
 function turn(field,id,a={},t={},prepare){const b=battle(field,{moves:[id],ability:'Inner Focus',...a},{moves:['harden'],ability:'Inner Focus',...t}),[u,v]=pokemon(b);fixRolls(b);if(prepare)prepare(u,v,b);const bu={...u.boosts},bv={...v.boosts},hp=v.hp,uhp=u.hp,from=b.log.length;b.makeChoices('move '+id,'move harden');
  const du={},dv={};for(const s of stats){if(u.boosts[s]-bu[s])du[s]=u.boosts[s]-bu[s];if(v.boosts[s]-bv[s])dv[s]=v.boosts[s]-bv[s];}return {b,u,v,du,dv,damage:hp-v.hp,userChange:u.hp-uhp,from};}
 function net(field,id,a,t,prepare){const base=turn(field,'harden',a,t,prepare),r=turn(field,id,a,t,prepare);const sub=(d,e,own)=>{const o={};for(const s of stats){const n=(d[s] || 0)-((e[s] || 0)-(own && s==='def'?1:0));if(n)o[s]=n;}return o;};
  const out={user:sub(r.du,base.du,true),target:sub(r.dv,base.dv,false),r};base.b.destroy();return out;}
 // Base power entering and leaving the BasePower event during a real turn.
 function power(field,id,a={},t={},prepare){const b=battle(field,{moves:[id],ability:'Inner Focus',...a},{moves:['harden'],ability:'Inner Focus',...t}),[u,v]=pokemon(b);fixRolls(b);if(prepare)prepare(u,v,b);let seen=null;const run=b.runEvent;
  b.runEvent=function(name,...args){const out=run.call(this,name,...args);if(name==='BasePower' && seen===null)seen={input:args[3],output:out,type:args[2].type};return out;};b.makeChoices('move '+id,'move harden');const result={...(seen || {input:null}),u,volatiles:Object.keys(u.volatiles),boosts:{...u.boosts}};b.destroy();return result;}
 function custom(field,format,a,c){const b=new Battle({formatid:format,seed:[1,2,3,4]});E.attach(b,fid(field));let n=0;const set=v=>({species:'Mew',ability:'Inner Focus',moves:['splash'],...v,uuid:'00000000-0000-0000-0000-00000000007'+(n++),movesInfo:(v.moves || ['splash']).map(()=>({pp:20,maxPp:20}))});
  b.setPlayer('p1',{name:'A',team:a.map(set)});b.setPlayer('p2',{name:'B',team:c.map(set)});const order=format.includes('doubles')?'team 12':'team 1';b.choose('p1',order);b.choose('p2',order);fixRolls(b);return b;}
 const doubles=(field,a,c)=>custom(field,'gen9doublescustomgame',a,c);

 test('status effects of moves follow their Battle_MoveEffects field branches',()=>{
  // Attack Order (109-112): one random stat falls a stage.
  for(const [index,stat]of [[0,'atk'],[2,'spa'],[3,'spd']]){const base=turn('swamp','harden',{},{});const b=battle('swamp',{moves:['attackorder'],ability:'Inner Focus'},{moves:['harden'],ability:'Inner Focus'}),[u,v]=pokemon(b);fixRolls(b);b.sample=list=>list[Math.min(index,list.length-1)];b.makeChoices('move attackorder','move harden');assert.equal(v.boosts[stat]-(base.dv[stat] || 0),-1,'Attack Order '+stat);b.destroy();base.b.destroy();}
  let n=net('indoor','attackorder');assert.deepEqual(n.target,{});n.r.b.destroy();
  // False Surrender (113-119)
  for(const [field,ability,taunted]of [['chess_board','Inner Focus',true],['chess_board','Oblivious',false],['indoor','Inner Focus',false]]){const r=turn(field,'falsesurrender',{},{ability});assert.equal(!!r.v.volatiles.taunt,taunted,field+' '+ability);if(taunted)assert(r.b.log.slice(r.from).some(s=>s.startsWith('|-start|p2a') && s.includes('Taunt')),'the simulator start line carries the source text');r.b.destroy();}
  // Poison Gas and Smog (231-235, 254-258), Toxic Thread is covered with the other Corrupted checks.
  for(const [field,id,status]of [['volcanic_top','poisongas','tox'],['back_alley','poisongas','tox'],['city','poisongas','tox'],['indoor','poisongas','psn'],['back_alley','smog','tox'],['city','smog','tox'],['indoor','smog','psn']]){const r=turn(field,id);assert.equal(r.v.status,status,field+' '+id);r.b.destroy();}
  // Petrification (414-418, 1381-1385, 2447-2451, 5373-5377, 7157-7161)
  for(const [id,fields]of [['freezingglare',['deux_finalis']],['bittermalice',['deux_finalis']],['bitterblade',['deux_finalis']],['ruination',['deux_finalis','dimensional','frozen_dimension']],['oblivionwing',['deux_finalis','dimensional','frozen_dimension']]]){
   for(const field of fields){const r=turn(field,id);assert.equal(r.v.status,'ptr',field+' '+id);r.b.destroy();}
   const r=turn('indoor',id);assert.notEqual(r.v.status,'ptr','indoor '+id);r.b.destroy();}
  let r=turn('dimensional','freezingglare');assert.equal(r.v.status,'frz','only Deux Finalis petrifies with Freezing Glare');r.b.destroy();
  // Whirlpool (5013-5017): Rejuvenation confuses only underwater.
  for(const [field,confused]of [['underwater',true],['water_surface',false],['indoor',false]]){r=turn(field,'whirlpool');assert(r.v.volatiles.partiallytrapped,field);assert.equal(!!r.v.volatiles.confusion,confused,field);r.b.destroy();}
  // Tar Shot (8426-8430) and Floral Healing (7897-7901)
  for(const [field,status]of [['murkwater_surface','psn'],['indoor','']]){r=turn(field,'tarshot');assert.equal(r.v.status,status,field);assert(r.v.volatiles.tarshot);r.b.destroy();}
  r=turn('corrupted','tarshot',{},{ability:'Immunity'});assert.equal(r.v.status,'');r.b.destroy();
  for(const [field,status]of [['corrosive','psn'],['corrosive_mist','psn'],['indoor','']]){r=turn(field,'floralhealing',{},{},(u,v)=>{v.hp=10;});assert.equal(r.v.status,status,field);r.b.destroy();}
  // Forest's Curse (7415-7420)
  for(const [field,cursed]of [['forest',true],['fairytale',true],['bewitched',true],['indoor',false]]){r=turn(field,'forestscurse');assert(r.v.hasType('Grass'),field);assert.equal(!!r.v.volatiles.curse,cursed,field);r.b.destroy();}
  // Magic Powder (8446-8472)
  for(const [field,types,status]of [['fairytale',['Psychic','Fairy'],''],['haunted',['Psychic'],'slp'],['bewitched',['Psychic'],'slp'],['indoor',['Psychic'],'']]){r=turn(field,'magicpowder',{},{species:'Snorlax'});assert.equal(r.v.getTypes().join('/'),types.join('/'),field);assert.equal(r.v.status,status,field);r.b.destroy();}
  r=turn('fairytale','magicpowder');assert.equal(r.v.getTypes().join('/'),'Psychic/Fairy','a pure Psychic target is still changed on Fairy Tale');r.b.destroy();
  // Electrify (7639-7644)
  for(const [field,types]of [['electric_terrain',['Electric']],['indoor',['Normal']]]){r=turn(field,'electrify',{},{species:'Snorlax',item:'Lagging Tail'});assert.equal(r.v.getTypes().join('/'),types.join('/'),field);r.b.destroy();}
  // Corrosive Gas (9013-9016)
  for(const [field,drop]of [['back_alley',true],['city',true],['corrosive_mist',true],['indoor',false]]){n=net(field,'corrosivegas',{},{item:'Leftovers'});assert.equal(n.r.v.item,'',field);assert.deepEqual(n.target,drop?{atk:-1,def:-1,spa:-1,spd:-1,spe:-1}:{},field);n.r.b.destroy();}
  // Splash (136-142): everyone but the user loses accuracy.
  n=net('water_surface','splash');assert.deepEqual(n.target,{accuracy:-1});assert.deepEqual(n.user,{});n.r.b.destroy();n=net('indoor','splash');assert.deepEqual(n.target,{});n.r.b.destroy();
  const b=doubles('water_surface',[{moves:['splash']},{moves:['harden']}],[{moves:['harden']},{moves:['harden']}]);b.makeChoices('move splash, move harden','move harden, move harden');assert.deepEqual([b.sides[0].active[0].boosts.accuracy,b.sides[0].active[1].boosts.accuracy,b.sides[1].active[0].boosts.accuracy,b.sides[1].active[1].boosts.accuracy],[0,-1,-1,-1]);b.destroy();});

 test('variable-power moves use their source field values',()=>{
  const low=(u,v)=>{u.hp=10;v.hp=20;};
  // Concert 4 always plays at full volume (2962-3310, 6041, 6681).
  for(const [id,expected,quiet,prepare,a]of [['frustration',102,1],['return',102,102],['eruption',150,4,low],['waterspout',150,4,low],['dragonenergy',150,4,low],['wringout',120,7,low],['crushgrip',120,7,low],['hardpress',100,5,low],['gyroball',150,null,low],['trumpcard',200,40],['flail',200,20],['reversal',200,20],['electroball',150,null],['lowkick',120,null],['grassknot',120,null],['heatcrash',120,40],['heavyslam',120,40],['magnitude',150,null],['naturalgift',100,null,null,{item:'Oran Berry'}],['fling',130,10,null,{item:'Leftovers'}],['spitup',300,100,(u)=>{u.addVolatile('stockpile');}]]){
   const loud=power('concert_4',id,a || {},{},prepare);assert.equal(loud.input,expected,'Concert 4 '+id);if(quiet!==null){const plain=power('indoor',id,a || {},{},prepare);assert.equal(plain.input,quiet,'indoor '+id);}}
  let p=power('concert_1','magnitude');assert.equal(p.input,10,'Concert 1 Magnitude 4');p=power('concert_2','frustration');assert.equal(p.input,1,'only the fourth stage fixes these powers');
  // Deep Earth (3000, 3012)
  for(const [id,expected]of [['wringout',120],['crushgrip',120],['hardpress',100],['gyroball',150]]){p=power('deep_earth',id,{},{},low);assert.equal(p.input,expected,'Deep Earth '+id);}
  // Rage (3103-3114)
  for(const [field,base,rage]of [['dimensional',60,false],['frozen_dimension',60,false],['indoor',20,true]]){p=power(field,'rage');assert.equal(p.input,base,field);assert.equal(p.volatiles.includes('rage'),rage,field);assert.equal(p.boosts.atk,rage?0:1,field);}
  // Status-doubling moves and friends (2758, 2769, 2818, 2832, 2900, 3029, 9159, 9201)
  for(const [field,id,expected,a,prepare]of [['deux_finalis','smellingsalts',140],['indoor','smellingsalts',70],['infernal','hex',130],['indoor','hex',65],
   ['corrosive','venoshock',130],['corrosive_mist','venoshock',130],['wasteland','venoshock',130],['murkwater_surface','venoshock',130],['indoor','venoshock',65],
   ['big_top','acrobatics',110,{item:'Leftovers'}],['indoor','acrobatics',55,{item:'Leftovers'}],['frozen_dimension','powertrip',120,{},(u)=>{u.boosts.spe=2;}],['indoor','powertrip',60,{},(u)=>{u.boosts.spe=2;}],
   ['corrosive','barbbarrage',120],['corrosive_mist','barbbarrage',120],['wasteland','barbbarrage',120],['murkwater_surface','barbbarrage',120],['indoor','barbbarrage',60],['infernal','infernalparade',120],['haunted','infernalparade',120],['indoor','infernalparade',60]]){
   p=power(field,id,a || {},{item:'Safety Goggles'},prepare);assert.equal(p.input,expected,field+' '+id);}
  const brine=power('deux_finalis','brine'),plain=power('indoor','brine');assert.equal(plain.output,65);assert(brine.output>=130,'Brine is always doubled on Deux Finalis');
  // Venoshock never doubles twice.
  p=power('corrosive','venoshock',{},{item:'Safety Goggles'},(u,v)=>{v.setStatus('psn');});assert.equal(p.output,power('corrosive','venoshock',{},{item:'Safety Goggles'}).output);
  // Weather Ball (2914, 2927)
  p=power('rainbow','weatherball');assert.equal(p.input,100);p=power('sky','weatherball');assert.equal(p.input,50);p=power('sky','weatherball',{},{},(u,v,b)=>{b.field.setWeather('deltastream');});assert.equal(p.input,100);assert.equal(p.type,'Flying');
  p=power('indoor','weatherball',{},{},(u,v,b)=>{b.field.setWeather('deltastream');});assert.equal(p.type,'Normal','Strong Winds change the type only in the Sky');
  // Terrain moves keep their native bonus on the hard field and under an overlay (8917, 9108, 9982).
  for(const [id,terrain]of [['risingvoltage','electric_terrain'],['psyblade','electric_terrain'],['expandingforce','psychic_terrain']]){
   const none=power('indoor',id),hard=power(terrain,id),overlay=power('rocky',id,{},{},(u,v,b)=>{b.rejuvenation.overlay={id:fid(terrain),duration:5};});
   const gain=p=>(id==='risingvoltage'?p.input*p.output/p.input:p.output)/none.output;assert(gain(hard)>=1.5-.01,id+' hard field');assert(gain(overlay)>=1.5-.01,id+' overlay');}});

 test('fixed-damage moves show the source lines that exist',()=>{
  for(const [field,id,amount,text]of [['haunted','nightshade',150,null],['bewitched','nightshade',150,'Shadowy figures came out of the woods!'],['indoor','nightshade',100,null],['deep_earth','seismictoss',150,'Slammed into the ground!'],['indoor','seismictoss',100,null],['haunted','seismictoss',100,null]]){
   const r=turn(field,id);assert.equal(r.damage,amount,field+' '+id);if(text)assert(said(r.b,text,r.from),field+' '+id);r.b.destroy();}
  // The Haunted line is pushed under a misspelled key (2466) and is never shown.
  let r=turn('haunted','nightshade');assert(!said(r.b,'The specters became real!',r.from));r.b.destroy();
  r=turn('deep_earth','psywave');assert.equal(r.damage,100,'minimum Deep Earth Psywave roll is the full level');assert(said(r.b,"The Core's magical forces are immense!",r.from));r.b.destroy();
  r=turn('indoor','psywave');assert.equal(r.damage,50);r.b.destroy();});

 test('two-turn moves strike at once on their source fields',()=>{
  const use=(field,id,overlay)=>{const b=battle(field,{moves:[id],ability:'Inner Focus'},{moves:['harden'],ability:'Inner Focus'}),[u,v]=pokemon(b);fixRolls(b);if(overlay)b.rejuvenation.overlay={id:fid(overlay),duration:5};const hp=v.hp,from=b.log.length;b.makeChoices('move '+id,'move harden');const out={instant:!u.volatiles.twoturnmove && b.log.slice(from).some(s=>s.startsWith('|-damage|p2a') && !s.includes('[from]')),charging:!!u.volatiles.twoturnmove,failed:b.log.slice(from).some(s=>s.startsWith('|-fail|p1a')) || said(b,'But it failed!',from),b,from};return out;};
  const rows=[['razorwind',['sky','grassy_terrain']],['freezeshock',['frozen_dimension']],['iceburn',['frozen_dimension']],['skyattack',['sky']],['fly',['cave','sky','dragons_den']],['bounce',['cave','sky','dragons_den']],['dig',['desert']],['dive',['water_surface','underwater']],
   ['phantomforce',['dimensional','frozen_dimension','haunted','short_circuit','deux_finalis']],['shadowforce',['dimensional','frozen_dimension','haunted','short_circuit','deux_finalis']],['solarbeam',['rainbow']],['solarblade',['rainbow']],['electroshot',['electric_terrain']]];
  for(const [id,fields]of rows){for(const field of fields){const r=use(field,id);assert(r.instant,field+' '+id);r.b.destroy();}const r=use('indoor',id);assert(r.charging,'indoor '+id);r.b.destroy();}
  for(const [id,overlay]of [['razorwind','grassy_terrain'],['solarbeam','rainbow']]){const r=use('rocky',id,overlay);assert(r.instant,id+' under a '+overlay+' overlay');r.b.destroy();}
  // Dig cannot leave the water (4720) and the Solar moves fail in the dark cavern without sun (4461-4465).
  for(const field of ['water_surface','murkwater_surface']){const r=use(field,'dig');assert(!r.charging,field);assert(said(r.b,'But there was no solid ground to attack from!',r.from),field);assert(!r.b.log.slice(r.from).some(s=>s.startsWith('|-damage|p2a') && !s.includes('[from]') && r.b.log[r.b.log.indexOf(s)-1]?.startsWith('|move|p1a')),field+' deals no damage');r.b.destroy();}
  for(const id of ['solarbeam','solarblade']){const r=use('dark_crystal_cavern',id);assert(!r.instant && !r.charging && r.failed,id);r.b.destroy();}});

 test('healing moves restore their source field shares',()=>{
  const hurt=(u)=>{u.hp=1;};const round=x=>Math.ceil(x-.5);
  let r=turn('forest','healorder',{},{},hurt);assert.equal(r.userChange,Math.round(r.u.maxhp*.66));r.b.destroy();
  // Moonlight, Synthesis and Morning Sun (5237-5242)
  for(const [field,id,share]of [['dark_crystal_cavern','moonlight',.75],['starlight','moonlight',.75],['new_world','moonlight',.75],['bewitched','moonlight',.75],['grassy_terrain','synthesis',.75],['dark_crystal_cavern','morningsun',.25],['dark_crystal_cavern','synthesis',.25],['indoor','moonlight',.5],['forest','synthesis',.5]]){
   const b=battle(field,{moves:[id]},{moves:['harden']}),[u]=pokemon(b);fixRolls(b);u.hp=1;const from=b.log.length;b.makeChoices('move '+id,'move harden');const line=b.log.slice(from).find(s=>s.startsWith('|-heal|p1a'));assert(line,field+' '+id);assert.equal(Number(line.split('|')[3].split('/')[0])-1,round(u.maxhp*share),field+' '+id);b.destroy();}
  // Wish (5214-5218)
  for(const [field,share]of [['misty_terrain',.75],['rainbow',.75],['holy',.75],['fairytale',.75],['starlight',.75],['indoor',.5]]){const b=battle(field,{moves:['wish','harden']},{moves:['harden']}),[u]=pokemon(b);fixRolls(b);b.makeChoices('move wish','move harden');u.hp=1;const from=b.log.length;b.makeChoices('move harden','move harden');
   const line=b.log.slice(from).find(s=>s.startsWith('|-heal|p1a') && s.includes('Wish'));assert(line,field);assert.equal(Number(line.split('|')[3].split('/')[0])-1,Math.floor(u.maxhp*share),field);b.destroy();}
  // Draining moves (5365-5366)
  for(const [field,id,share]of [['electric_terrain','paraboliccharge',.75],['indoor','paraboliccharge',.5],['grassy_terrain','absorb',.75],['grassy_terrain','megadrain',.75],['grassy_terrain','gigadrain',.75],['grassy_terrain','hornleech',.75],['grassy_terrain','drainpunch',.5],['indoor','gigadrain',.5]]){
   const b=battle(field,{moves:[id]},{moves:['harden'],species:'Snorlax'}),[u,v]=pokemon(b);fixRolls(b);u.hp=1;const hp=v.hp,from=b.log.length;b.makeChoices('move '+id,'move harden');const lines=b.log.slice(from);const dealt=hp-Number(lines.find(s=>s.startsWith('|-damage|p2a')).split('|')[3].split('/')[0]);
   const line=lines.find(s=>s.startsWith('|-heal|p1a') && s.includes('[from] drain'));assert.equal(Number(line.split('|')[3].split('/')[0])-1,Math.round(dealt*share),field+' '+id);b.destroy();}
  // Floral Healing (7890-7895)
  for(const [field,full]of [['grassy_terrain',true],['fairytale',true],['flower_garden_3',true],['flower_garden_4',true],['flower_garden_5',true],['flower_garden_2',false],['indoor',false]]){const b=battle(field,{moves:['floralhealing']},{moves:['harden']}),[u,v]=pokemon(b);fixRolls(b);v.hp=1;const from=b.log.length;b.makeChoices('move floralhealing','move harden');
   const line=b.log.slice(from).find(s=>s.startsWith('|-heal|p2a'));assert.equal(Number(line.split('|')[3].split('/')[0]),full?v.maxhp:1+Math.round(v.maxhp*.5),field);b.destroy();}
  // Shore Up with Water Compaction (8099-8105)
  for(const [field,ability,gain]of [['water_surface','Water Compaction',2],['murkwater_surface','Water Compaction',2],['water_surface','Inner Focus',0],['desert','Water Compaction',0]]){const n=net(field,'shoreup',{ability},{},(u)=>{u.hp=Math.floor(u.maxhp/2);});assert.equal(n.user.def || 0,gain,field+' '+ability+' (beyond the end-of-turn boost)');n.r.b.destroy();}});

 test('remaining single-battle move branches follow the source',()=>{
  let n=net('psychic_terrain','mindreader');assert.deepEqual(n.user,{spa:2});n.r.b.destroy();n=net('indoor','mindreader');assert.deepEqual(n.user,{});n.r.b.destroy();n=net('psychic_terrain','lockon');assert.deepEqual(n.user,{},'Lock-On is not Mind Reader');n.r.b.destroy();
  for(const [field,gain]of [['holy',2],['fairytale',2],['psychic_terrain',2],['indoor',0]]){n=net(field,'miracleeye');assert.equal(n.user.spa || 0,gain,field);n.r.b.destroy();}
  let r=turn('swamp','roar');assert(said(r.b,"What are ya doin' in my swamp?!",r.from));r.b.destroy();r=turn('swamp','whirlwind');assert(!said(r.b,'my swamp',r.from));r.b.destroy();
  // Spikes sink (6292); Clanging Scales keeps its Defense on Deux Finalis (7826-7828).
  for(const [field,laid]of [['water_surface',false],['murkwater_surface',false],['indoor',true]]){r=turn(field,'spikes');assert.equal(!!r.b.sides[1].sideConditions.spikes,laid,field);r.b.destroy();}
  for(const [field,drop]of [['deux_finalis',{}],['dragons_den',{def:-1}],['indoor',{def:-1}]]){n=net(field,'clangingscales',{},{species:'Snorlax'});assert.deepEqual(n.user,drop,field);n.r.b.destroy();}
  // Crafty Shield (7545-7550)
  n=net('fairytale','craftyshield');assert.deepEqual(n.user,{def:1,spd:1});assert(said(n.r.b,'boosted its defenses with the shield!',n.r.from));n.r.b.destroy();n=net('indoor','craftyshield');assert.deepEqual(n.user,{});n.r.b.destroy();
  // Pay Day and Make It Rain (6426-6427, 9493-9494)
  for(const id of ['payday','makeitrain'])for(const [field,shown]of [['dragons_den',true],['big_top',false],['indoor',false]]){r=turn(field,id);assert.equal(said(r.b,'Treasure scattered everywhere!',r.from),shown,field+' '+id);r.b.destroy();}
  // Chilly Reception (9564)
  for(const [field,left]of [['big_top',7],['icy',7],['snowy_mountain',7],['sky',7],['indoor',4]]){r=turn(field,'chillyreception');assert.equal(r.b.field.weather,'snow',field);assert.equal(r.b.field.weatherState.duration,left,field);r.b.destroy();}
  // Dragon Tail and Circle Throw cannot throw a foe out of the arena (5695-5707).
  for(const [field,stays]of [['colosseum',true],['indoor',false]])for(const id of ['dragontail','circlethrow']){const b=custom(field,'gen9customgame',[{moves:[id]}],[{species:'Snorlax'},{species:'Blissey'}]);const first=b.sides[1].active[0];b.makeChoices('move '+id,'move splash');assert.equal(b.sides[1].active[0]===first,stays,field+' '+id);b.destroy();}});

 test('Dive breaks thin ice, Conversion respects a permanent Glitch and pawns ignore one-hit knockouts',()=>{
  // Dive on Icy Field frozen over water (4773-4787)
  for(const [base,thin]of [['water_surface',true],['murkwater_surface',true],['indoor',false],['cave',false]]){const b=battle(base,{moves:['dive'],ability:'Inner Focus'},{moves:['harden'],ability:'Inner Focus'});fixRolls(b);E.change(b,fid('icy'),{push:true});
   let from=b.log.length;b.makeChoices('move dive','move harden');assert.equal(said(b,'made a hole in the ice!',from),thin,base);assert.equal(b.rejuvenation.id,fid('icy'),base+' still frozen while submerged');
   from=b.log.length;b.makeChoices('move dive','move harden');assert.equal(said(b,'The ice was broken from underneath!',from),thin,base);assert.equal(b.rejuvenation.id,fid(thin?base:'icy'),base);b.destroy();}
  // Conversion and Conversion 2 (2061-2064, 2106-2109)
  const conv=(field,item,sequence)=>{const b=battle(field,{moves:['conversion','conversion2'],item},{moves:['growl']});const out=[];for(const id of sequence){const from=b.log.length;b.makeChoices('move '+id,'move growl');out.push([said(b,'Some rogue data remains...',from),said(b,'TH~ R0GUE DAa/ta',from),b.rejuvenation.id.split(':')[1],b.rejuvenation.duration]);}b.destroy();return out;};
  assert.deepEqual(conv('indoor','',['conversion','conversion2']),[[true,false,'indoor',0],[false,true,'glitch',4]]);
  assert.deepEqual(conv('indoor','Amplifield Rock',['conversion','conversion2'])[1],[false,true,'glitch',7]);
  assert.deepEqual(conv('indoor','Everstone',['conversion','conversion2']),[[false,false,'indoor',0],[false,false,'indoor',0]]);
  assert.deepEqual(conv('glitch','',['conversion','conversion2']),[[false,false,'glitch',0],[false,false,'glitch',0]],'a permanent Glitch Field is left alone');
  const refreshed=conv('indoor','',['conversion','conversion2','conversion']);assert.deepEqual(refreshed[2],[false,true,'glitch',4],'a temporary Glitch Field is refreshed to five turns');
  // Chess pawns (2527-2530): the lead of a full team is the pawn.
  for(const [field,immune]of [['chess_board',true],['indoor',false]]){const b=custom(field,'gen9customgame',[{moves:['fissure']}],[{species:'Snorlax'},{species:'Blissey'}]);const pawn=b.sides[1].active[0];b.makeChoices('move fissure','move splash');assert.equal(pawn.fainted,!immune,field);if(immune)assert.equal(pawn.hp,pawn.maxhp);b.destroy();}
  // Deep Earth Topsy-Turvy (7353-7366) and Magnetic Flux (7483)
  for(const [field,hits]of [['deep_earth',true],['indoor',false]]){const r=turn(field,'topsyturvy',{},{species:'Snorlax'},(u,v)=>{v.boosts.atk=2;});assert.equal(r.damage>0,hits,field);assert.equal(r.v.boosts.atk,-2,field);r.b.destroy();}
  for(const [field,ability,gain]of [['deep_earth','Plus',2],['deep_earth','Inner Focus',0],['electric_terrain','Plus',2],['electric_terrain','Inner Focus',1],['indoor','Plus',1],['indoor','Inner Focus',0]]){const n=net(field,'magneticflux',{ability});assert.deepEqual(n.user,gain?{def:gain,spd:gain}:{},field+' '+ability);n.r.b.destroy();}});

 test('field-wide support moves follow their source tables',()=>{
  // Flower Shield (7560-7573) and Rototiller (7585-7593): [field, species, expected user change]
  for(const [id,rows]of [['flowershield',[['fairytale','Mew',{def:1,spd:1}],['fairytale','Sceptile',{def:1,spd:1}],['flower_garden_1','Mew',{}],['flower_garden_1','Sceptile',{def:1}],['flower_garden_2','Mew',{def:1,spd:1}],['flower_garden_2','Sceptile',{def:1,spd:1}],
    ['flower_garden_3','Mew',{def:2,spd:2}],['flower_garden_5','Sceptile',{def:2,spd:2}],['indoor','Mew',{}],['indoor','Sceptile',{def:1}]]],
   ['rototiller',[['flower_garden_1','Mew',{atk:2,spa:2}],['flower_garden_4','Sceptile',{atk:2,spa:2}],['deep_earth','Mew',{}],['deep_earth','Sceptile',{atk:2,spa:2}],['fairytale','Sceptile',{atk:1,spa:1}],['indoor','Mew',{}],['indoor','Sceptile',{atk:1,spa:1}]]]])
   for(const [field,species,expected]of rows){const n=net(field,id,{species});assert.deepEqual(n.user,expected,[id,field,species].join());assert.deepEqual(n.target,{});n.r.b.destroy();}
  // Aurora Veil needs no hail on the reflective and frozen fields (7724).
  for(const [field,works]of [['dark_crystal_cavern',true],['rainbow',true],['icy',true],['crystal_cavern',true],['snowy_mountain',true],['starlight',true],['frozen_dimension',true],['indoor',false],['forest',false]]){const r=turn(field,'auroraveil');assert.equal(r.b.sides[0].sideConditions.auroraveil?.duration,works?4:undefined,field);r.b.destroy();}
  // Clangorous Soul (8574-8594)
  for(const [field,share,gain]of [['big_top',2,2],['dragons_den',2,2],['concert_1',2,2],['concert_4',2,2],['deux_finalis',4,1],['indoor',null,1]]){const n=net(field,'clangoroussoul');if(share)assert.equal(-n.r.userChange,Math.floor(n.r.u.maxhp/share),field);assert.deepEqual(n.user,{atk:gain,def:gain,spa:gain,spd:gain,spe:gain},field);n.r.b.destroy();}
  // Heavy Slam and Heat Crash double the floored weight ratio on Deep Earth (3312-3313): 550 kg against 202 kg.
  for(const id of ['heavyslam','heatcrash'])for(const [field,expected]of [['deep_earth',100],['indoor',60]]){const p=power(field,id,{species:'Metagross'},{species:'Tyranitar'});assert.equal(p.input,expected,field+' '+id);}});

 test('ally-targeting moves use their field amounts in double battles',()=>{
  const pair=(field,id,user={},ally={})=>{const b=doubles(field,[{moves:[id],...user},{...ally}],[{},{}]);const [u,p]=b.sides[0].active;return {b,u,p};};
  // Aromatic Mist (7208)
  for(const [field,gain]of [['misty_terrain',2],['indoor',1]]){const {b,p}=pair(field,'aromaticmist');b.makeChoices('move aromaticmist -2, move splash','move splash, move splash');assert.equal(p.boosts.spd,gain,field);b.destroy();}
  // Spotlight (8187-8190)
  for(const [field,gain]of [['big_top',1],['indoor',0]]){const {b,u,p}=pair(field,'spotlight');b.makeChoices('move spotlight -2, move splash','move splash, move splash');assert.deepEqual([u.boosts.atk,u.boosts.spa,p.boosts.atk,p.boosts.spa],[gain,gain,gain,gain],field);b.destroy();}
  // Dragon Cheer (9910-9914)
  for(const [field,species,stage]of [['dragons_den','Dragonite',3],['deux_finalis','Dragonite',3],['dragons_den','Mew',2],['deux_finalis','Mew',2],['indoor','Dragonite',2],['indoor','Mew',1]]){const {b,p}=pair(field,'dragoncheer',{},{species});b.makeChoices('move dragoncheer -2, move splash','move splash, move splash');
   const v=p.volatiles.dragoncheer;assert(v,field+' '+species);const m=move(b,'tackle');const ratio=b.runEvent('ModifyCritRatio',p,b.sides[1].active[0],m,1);assert.equal(ratio-1,stage,field+' '+species);b.destroy();}
  // Gear Up reaches a Plus partner (7919)
  for(const [field,gain]of [['factory',2],['indoor',1]]){const {b,u,p}=pair(field,'gearup',{},{ability:'Plus'});b.makeChoices('move gearup, move splash','move splash, move splash');assert.deepEqual([p.boosts.atk,p.boosts.spa,u.boosts.atk],[gain,gain,0],field);b.destroy();}
  // Lunar Blessing and Jungle Healing restore the partner too (9064)
  for(const [field,id,share]of [['holy','lunarblessing',.33],['forest','junglehealing',.33],['indoor','junglehealing',.25]]){const {b,u,p}=pair(field,id);p.hp=1;p.setStatus('brn');const from=b.log.length;b.makeChoices('move '+id+', move splash','move splash, move splash');const line=b.log.slice(from).find(s=>s.startsWith('|-heal|p1b'));assert.equal(Number(line.split('|')[3].split('/')[0])-1,Math.round(p.maxhp*share),field+' '+id);assert.equal(p.status,'',field);b.destroy();}});
};
