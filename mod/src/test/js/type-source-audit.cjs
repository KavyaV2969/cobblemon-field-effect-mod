module.exports=({test,battle,pokemon,move,E,fid,assert,catalog,Battle})=>{
 test('packed simulator teams restore declared ability IDs after display-name unpacking',()=>{
  const b=new Battle({formatid:'gen9customgame'});E.attach(b,fid('indoor'));
  // Packed teams are the exact boundary used by Cobblemon's Java battle builder.
  const team=b.getTeam({team:'Mew||uuid|100||0||tempest|splash||||||||||'});assert.equal(team[0].ability,'tempest');b.destroy();
  const live=battle('indoor',{ability:'Storm 9'}),[u]=pokemon(live);assert.equal(u.ability,'tempest');assert.notEqual(live.field.weather,'');assert(live.log.some(s=>s.includes('Storm-9')));live.destroy();
 });
 test('Duskilate registers ordinary conversion and preserves Glitch Normal typing without a boost',()=>{
  for(const [field,type,power]of [['indoor','Dark',120],['glitch','Normal',100]]){
   const b=battle(field,{ability:'Duskilate',moves:['tackle']}),[u,t]=pokemon(b),m=move(b,'tackle');b.singleEvent('ModifyType',u.getAbility(),u.abilityState,m,u,t);assert.equal(m.type,type);assert.equal(b.runEvent('BasePower',u,t,m,100),power);b.destroy();
  }
  const b=battle('indoor',{ability:'Duskilate'}),[u,t]=pokemon(b),m=move(b,'breakneckblitz');m.type='Normal';m.isZ=true;b.singleEvent('ModifyType',u.getAbility(),u.abilityState,m,u,t);assert.equal(m.type,'Normal');b.destroy();
 });
 test('Fairy attacks double against Shadow-flag Pokemon without changing their natural types',()=>{
  const b=battle('indoor'),[u,t]=pokemon(b),m=move(b,'moonblast');t.setType('Dragon');assert.equal(t.runEffectiveness(m),1);t.rejuvenationFlags={shadow:true};assert.equal(t.runEffectiveness(m),2);assert.deepEqual(t.getTypes(),['Dragon']);t.setType('Steel');assert.equal(t.runEffectiveness(m),0);t.rejuvenationFlags.shadow=false;assert.equal(t.runEffectiveness(m),-1);b.destroy();
 });
 test('Rainbow overlay adds an independent random attacking type and locks it across hits',()=>{
  const b=battle('crystal_cavern',{moves:['judgment']}),[u,t]=pokemon(b);E.change(b,fid('rainbow'),{overlay:true,duration:4});let samples=0;b.sample=rows=>{samples++;return 'Water';};
  const m=move(b,'judgment');m.type='Normal';m.category='Special';b.activePokemon=u;b.activeMove=m;b.runEvent('ModifyMove',u,t,m,m);assert.deepEqual(Array.from(m.rejuvenationTypes),['Fire','Water'],JSON.stringify({type:m.type,category:m.category,overlay:b.rejuvenation.overlay,rolls:m.rejuvenationTypeRolls}));assert.equal(b.rejuvenation.roll,1);b.runEvent('ModifyMove',u,t,m,m);assert.deepEqual(Array.from(m.rejuvenationTypes),['Fire','Water'],JSON.stringify({type:m.type,category:m.category,overlay:b.rejuvenation.overlay,rolls:m.rejuvenationTypeRolls}));assert.equal(samples,1);assert.equal(b.rejuvenation.roll,1);b.destroy();
 });
 test('Infernal Wildfire bypasses Magma Armor while other fields and suppressed Wildfire retain immunity',()=>{
  for(const [field,ability,hit]of [['infernal','Wildfire',true],['infernal','Synchronize',false],['volcanic_top','Wildfire',false],['dragons_den','Wildfire',false]]){
   const b=battle(field,{ability},{ability:'Magma Armor'}),[u,t]=pokemon(b),m=move(b,'flamethrower');b.activePokemon=u;b.activeMove=m;assert.equal(b.runEvent('TryHit',t,u,m),hit,field+' '+ability);b.destroy();
  }
 });
 test('Chess Illusion multiplier depends on an active disguise, surviving ability replacement',()=>{
  const b=battle('chess_board',{ability:'Illusion'}),[u,t]=pokemon(b),m=move(b,'watergun');assert.equal(b.runEvent('ModifySpA',u,t,m,100),100);u.illusion=t;assert.equal(b.runEvent('ModifySpA',u,t,m,100),120);u.ability='synchronize';assert.equal(b.runEvent('ModifySpA',u,t,m,100),120);u.illusion=null;assert.equal(b.runEvent('ModifySpA',u,t,m,100),100);b.destroy();
 });
 test('additional type layers and native type flag interactions reject malformed definitions',()=>{
  for(const mutate of [c=>c.fields[fid('indoor')].typeFlagInteractions[0].flagged=4,c=>c.fields[fid('indoor')].typeFlagInteractions[0].attackType='Unknown',c=>c.fields[fid('rainbow')].rules.find(r=>r.actions.some(a=>a.op==='extraType')).actions[0].layer='combined']){const c=JSON.parse(JSON.stringify(catalog));mutate(c);assert.throws(()=>E.load(c));}
 });
 test('Never-Melt Ice reduces the Fire attack stat once and emits the original item feedback',()=>{
  for(const field of ['indoor','frozen_dimension'])for(const magic of [false,true]){
   const b=battle(field,{moves:['flamethrower']},{item:'Never-Melt Ice'}),[u,t]=pokemon(b),m=move(b,'flamethrower');if(magic)b.field.addPseudoWeather('magicroom',u);b.activePokemon=u;b.activeMove=m;
   assert.equal(b.runEvent('ModifySpA',u,t,m,1000),field==='frozen_dimension'&&!magic?660:1000);assert.equal(b.runEvent('ModifyDamage',u,t,m,1000),1000,'no second final-damage factor');
   assert.equal(b.log.filter(s=>s.includes('sheer cold weakened')).length,field==='frozen_dimension'&&!magic?1:0);b.destroy();
  }
  const b=battle('indoor',{}, {item:'Never-Melt Ice'}),[u,t]=pokemon(b),m=move(b,'ember');b.rejuvenation.neverMeltIce=true;assert.equal(b.runEvent('ModifyAtk',u,t,m,1000),660);b.destroy();
 });
 test('Chess Kowtow Cleave partially pierces Protect with quarter damage and source flavor',()=>{
  function turn(field,protect){const b=battle(field,{moves:['kowtowcleave']},{moves:[protect?'protect':'splash']}),[u,t]=pokemon(b);u.rejuvenationRoles[fid('chess_board')]='pawn';t.rejuvenationRoles ||= {};t.rejuvenationRoles[fid('chess_board')]='queen';b.randomChance=()=>false;b.randomizer=n=>n;b.makeChoices('move kowtowcleave','move '+(protect?'protect':'splash'));const hp=t.maxhp-t.hp,log=b.log.slice();b.destroy();return {hp,log};}
  const base=turn('chess_board',false),protectedHit=turn('chess_board',true);assert(protectedHit.hp>0);assert(Math.abs(protectedHit.hp/base.hp-.25)<.035,JSON.stringify({base:base.hp,protectedHit:protectedHit.hp}));assert(protectedHit.log.some(s=>s.includes("couldn't fully protect itself and got hurt!")));assert.equal(turn('indoor',true).hp,0);
 });
 test('Concert critical-hit progression follows the crit message and changes only subsequent damage',()=>{
  for(const field of ['concert_1','concert_2','concert_3','concert_4']){
   const b=battle(field,{moves:['frostbreath']},{species:'Blissey'}),[u,t]=pokemon(b);let fieldAtDamage;const native=b.actions.modifyDamage;b.actions.modifyDamage=function(...args){fieldAtDamage=E.current(b).id;return native.apply(this,args);};b.makeChoices('move frostbreath','move splash');const stage=+field.at(-1),expected='concert_'+Math.min(4,stage+1);assert.equal(E.current(b).id,fid(expected));assert.equal(fieldAtDamage,fid(field));const crit=b.log.findIndex(s=>s.startsWith('|-crit|')),grow=b.log.findIndex(s=>s.includes('The critical hit is getting the crowd hyped!')),damage=b.log.findIndex(s=>s.startsWith('|-damage|'));assert(crit>=0&&damage>crit);if(stage<4)assert(grow>crit&&grow<damage);b.destroy();
  }
 });
 test('Sky added Flying type preserves the source first-type-twice behavior',()=>{
  const b=battle('sky'),[u,t]=pokemon(b);for(const [types,expected]of [[['Grass','Normal'],2],[['Normal','Grass'],0],[['Grass','Steel'],1],[['Steel','Grass'],-1]]){t.setType(types);const m=move(b,'tackle');m.rejuvenationTypes=['Flying'];b.activePokemon=u;b.activeMove=m;assert.equal(t.runEffectiveness(m),expected,types.join('/'));}b.destroy();
 });
 test('protection and secondary-type policies reject invalid content at reload',()=>{
  for(const mutate of [c=>c.fields[fid('chess_board')].rules.find(r=>r.actions.some(a=>a.recipe==='partialProtection')).actions[0].fraction=0,c=>c.fields[fid('chess_board')].rules.find(r=>r.actions.some(a=>a.recipe==='partialProtection')).actions[0].conditions=['substitute'],c=>c.fields[fid('sky')].extraTypePolicies.Flying.mode='wholeMatchup']){const c=JSON.parse(JSON.stringify(catalog));mutate(c);assert.throws(()=>E.load(c));}
 });
 test('all Chess shields are partially pierced while their native contact penalties do not trigger',()=>{
  for(const shield of ['protect','kingsshield','obstruct','spikyshield','banefulbunker','silktrap','burningbulwark','matblock']){
   const b=battle('chess_board',{moves:['kowtowcleave'],ability:'Inner Focus'},{moves:[shield],ability:'Inner Focus'}),[u,t]=pokemon(b),hp=u.hp;b.randomChance=()=>false;b.randomizer=n=>n;b.makeChoices('move kowtowcleave','move '+shield);assert(t.hp<t.maxhp,shield);assert.equal(u.hp,hp,shield+' no contact recoil');assert.equal(u.status,'',shield+' no shield status');assert.equal(u.boosts.atk,0,shield+' no contact stat penalty');b.destroy();
  }
  const b=battle('chess_board',{moves:['kowtowcleave']},{moves:['quickguard']}),[u,t]=pokemon(b);u.rejuvenationRoles[fid('chess_board')]='king';b.makeChoices('move kowtowcleave','move quickguard');assert(t.hp<t.maxhp);assert(b.log.some(s=>s.includes("couldn't fully protect itself")));b.destroy();
 });
 test('Underwater physical attack reduction respects Water users, attacking types and each source ability',()=>{
  for(const [species,ability,extra,expected]of [['Mew','Synchronize',null,500],['Mew','Eelevate',null,1000],['Mew','Steelworker',null,1000],['Mew','Swift Swim',null,1000],['Squirtle','Synchronize',null,1000],['Mew','Synchronize','Water',1000]]){
   const b=battle('underwater',{species,ability}),[u,t]=pokemon(b),m=move(b,'tackle');if(extra)m.rejuvenationTypes=[extra];assert.equal(b.runEvent('ModifyAtk',u,t,m,1000),expected,[species,ability,extra].join());assert.equal(b.runEvent('ModifySpA',u,t,m,1000),1000,'Special is unchanged');assert.equal(b.runEvent('ModifyAtk',u,t,move(b,'aquajet'),1000),1000,'primary Water');b.destroy();
  }
 });
 test('Deep Earth Slow Start cancels only the native physical Attack and Speed penalty',()=>{
  for(const [field,expected]of [['indoor',500],['deep_earth',1000]]){const b=battle(field,{ability:'Slow Start'}),[u,t]=pokemon(b);assert(u.volatiles.slowstart);assert.equal(b.runEvent('ModifyAtk',u,t,move(b,'tackle'),1000),expected);assert.equal(b.runEvent('ModifySpe',u,t,move(b,'tackle'),1000),expected);assert.equal(b.runEvent('ModifySpA',u,t,move(b,'swift'),1000),1000);b.destroy();}
 });
 test('ordinary field offense abilities act at the Attack or Special Attack stage without a final-damage duplicate',()=>{
  for(const [ability,field,expected]of [['Queenly Majesty','fairytale',1500],['Long Reach','mountain',1500],['Long Reach','snowy_mountain',1500],['Long Reach','volcanic_top',1500],['Long Reach','sky',1500],['Corrosion','corrosive',1500],['Corrosion','corrosive_mist',1500],['Corrosion','corrupted',1500],['Purifying Salt','holy',1500],['Long Reach','indoor',1000]]){
   const b=battle(field,{ability}),[u,t]=pokemon(b),m=move(b,'tackle');for(const e of ['ModifyAtk','ModifySpA'])assert.equal(b.runEvent(e,u,t,m,1000),expected,field+' '+e);assert.equal(b.runEvent('ModifyDamage',u,t,m,1000),1000,'not duplicated');b.destroy();
  }
 });
 test('Chess offense stacks ordinary ability and active Illusion factors and preserves Competitive HP branch',()=>{
  for(const [ability,expected]of [['Reckless',1200],['Gorilla Tactics',1800],['Competitive',1000],['Queenly Majesty',1000]]){const b=battle('chess_board',{ability}),[u,t]=pokemon(b),m=move(b,'tackle');assert.equal(b.runEvent('ModifyAtk',u,t,m,1000),expected);u.illusion=t;assert.equal(b.runEvent('ModifyAtk',u,t,m,1000),Math.round(expected*1.2));b.destroy();}
  const b=battle('chess_board',{ability:'Competitive'}),[u,t]=pokemon(b),m=move(b,'swift');u.hp=u.maxhp/2;assert.equal(b.runEvent('ModifySpA',u,t,m,1000),1625);u.hp=u.maxhp*.1;assert.equal(b.runEvent('ModifySpA',u,t,m,1000),2000);b.destroy();
 });
 test('Glitch defensive shared Special borrows the fully modified Special Attack under ordinary field overlays',()=>{
  for(const [ability,weather,overlay,item,expected]of [['Solar Power','sunnyday',null,'',300],['Solar Power','sunnyday',null,'Utility Umbrella',200],['Pure Power',null,'psychic_terrain','',400],['Plus',null,'electric_terrain','',300],['Minus',null,'electric_terrain','',300],['Hadron Engine',null,'electric_terrain','',267]]){
   const b=battle('glitch',{}, {ability,item}),[u,t]=pokemon(b),m=move(b,'psychic');if(weather)b.field.setWeather(weather,u);if(overlay)E.change(b,fid(overlay),{duration:5});t.storedStats.spa=200;t.storedStats.spd=100;m.category='Special';b.rejuvenationStatQuery={user:u,target:t,move:m};b.activeMove=m;b.activePokemon=u;assert(Math.abs(b.runEvent('ModifySpD',t,u,m,100)-expected)<=1,[ability,weather,overlay,item].join());delete b.rejuvenationStatQuery;b.destroy();
  }
 });
 test('Glitch Explosion and Self-Destruct halve physical defense only on that field',()=>{
  for(const field of ['glitch','indoor'])for(const mid of ['explosion','selfdestruct','tackle']){const b=battle(field),[u,t]=pokemon(b),m=move(b,mid);assert.equal(b.runEvent('ModifyDef',t,u,m,1000),field==='glitch'&&mid!=='tackle'?500:1000);b.destroy();}
 });
 test('Merciless and Colosseum guaranteed crit rules keep grounding and Battle Armor restrictions',()=>{
  for(const [field,species,ability,defAbility,expected]of [['corrosive_mist','Zapdos','Merciless','Synchronize',true],['corrosive','Mew','Merciless','Synchronize',true],['corrosive','Zapdos','Merciless','Synchronize',false],['wasteland','Mew','Merciless','Synchronize',true],['murkwater_surface','Mew','Merciless','Synchronize',true],['colosseum','Mew','Synchronize','Wimp Out',true],['corrosive_mist','Mew','Merciless','Battle Armor',false]]){
   const b=battle(field,{species,ability},{ability:defAbility}),[u,t]=pokemon(b),m=move(b,'tackle');b.randomChance=(n,d)=>n>=d;b.activeMove=m;b.activePokemon=u;b.actions.getDamage(u,t,m);assert.equal(t.getMoveHitData(m).crit,expected,[field,species,ability,defAbility].join());b.destroy();
  }
 });
 test('ordinary field secondary-effect chance overrides execute before the native random roll',()=>{
  for(const [field,mid,chance]of [['haunted','ominouswind',20],['fairytale','strangesteam',100],['haunted','lick',100],['wasteland','direclaw',100],['infernal','infernalparade',100],['deux_finalis','freezingglare',100],['deux_finalis','bitterblade',100]]){
   const b=battle(field),[u,t]=pokemon(b),m=move(b,mid);b.activeMove=m;b.activePokemon=u;b.runEvent('ModifyMove',u,t,m,m);assert.equal(m.secondaries?.[0]?.chance,chance,field+' '+mid);b.destroy();
  }
 });
 test('dynamic field multipliers preserve Casual, Field Frenzy and online behavior with source roll messages',()=>{
  for(const [mode,frenzy,online,scale]of [[0,false,false,n=>n],[1,false,false,n=>1+(n-1)/2],[0,true,false,n=>n>1?1+(n-1)*2:n/2],[1,true,false,n=>n],[0,true,true,n=>n]])for(const [field,mid,raw]of [['short_circuit','thunderbolt',.8],['big_top','hammerarm',.5],['deep_earth','quickattack',.7],['deep_earth','revenge',1.3]]){
   const b=battle(field),[u,t]=pokemon(b),m=move(b,mid);b.rejuvenation.mode={difficultyMode:mode,fieldFrenzy:frenzy,online};b.activeMove=m;b.activePokemon=u;b.random=()=>0;u.boosts.atk=0;assert(Math.abs(b.runEvent('BasePower',u,t,m,1000)-1000*scale(raw))<1,[field,mode,frenzy,online].join());if(field==='short_circuit')assert(b.log.some(s=>s.includes('Bzzt.')));if(field==='big_top')assert(b.log.some(s=>s.includes('WHAMMO!')));b.destroy();
  }
 });
 test('Big Top striker clamps its randomized stat-stage roll and averages source preview rolls',()=>{
  for(const [ability,random,stage,factor]of [['Synchronize',0,0,.5],['Synchronize',13,0,2],['Synchronize',13,6,3],['Huge Power',0,0,2],['Huge Power',9,0,3]]){
   const b=battle('big_top',{ability}),[u,t]=pokemon(b),m=move(b,'hammerarm');u.boosts.atk=stage;b.activeMove=m;b.random=()=>random;assert.equal(b.runEvent('BasePower',u,t,m,1000),factor*1000);b.destroy();
  }
  const b=battle('big_top'),[u,t]=pokemon(b),m=move(b,'hammerarm');u.boosts.atk=0;const factor=b.runEvent('BasePower',u,t,m,1400);assert.equal(factor,1700,'sum of source rolls 0 through 13 is 17');assert(!b.log.some(s=>s.includes('WHAMMO!')),'preview is silent');b.destroy();
 });
 test('Mountain wind amplification and Deep Earth priority messages apply at base power',()=>{
  for(const [field,mid,wind,expected]of [['mountain','airslash',true,1500],['snowy_mountain','hurricane',true,1500],['volcanic_top','gust',true,1500],['mountain','bravebird',true,1000],['mountain','airslash',false,1000]]){
   const b=battle(field),[u,t]=pokemon(b),m=move(b,mid);const base=b.runEvent('BasePower',u,t,m,1000);if(wind)b.field.setWeather('deltastream',u);b.activeMove=m;assert(Math.abs(b.runEvent('BasePower',u,t,m,1000)-base*(expected===1500?1.5:1))<1,field+' '+mid);b.destroy();
  }
 });
 test('Chess move-sensitive base-power factors apply only once per source guard',()=>{
  for(const [ability,confused,expected]of [['Synchronize',false,.5],['Adaptability',false,.5],['Oblivious',false,2],['Defeatist',false,2],['Synchronize',true,1],['None',true,2]]){
   const b=battle('chess_board',{}, {ability}),[u,t]=pokemon(b),m=move(b,'strength');u.rejuvenationRoles[fid('chess_board')]='pawn';t.rejuvenationRoles[fid('chess_board')]='pawn';if(confused)t.addVolatile('confusion',t);assert.equal(b.runEvent('BasePower',u,t,m,1000),expected*1500,ability+' '+confused);b.destroy();
  }
 });
 test('Glitch Drive and sunny Desert absorptions emit the original full-HP and repeat messages',()=>{
  for(const [field,item,species,mid]of [['glitch','Douse Drive','Genesect','watergun'],['glitch','Chill Drive','Genesect','icebeam'],['desert','','Bulbasaur','watergun']]){
   const b=battle(field,{moves:[mid]},{species,item,ability:'Magic Guard'}),[u,t]=pokemon(b);if(field==='desert')b.field.setWeather('sunnyday',u);const start=b.log.length;b.activeMove=move(b,mid);b.activePokemon=u;b.runEvent('TryHit',t,u,b.activeMove);assert.equal(t.hp,t.maxhp);assert(b.log.slice(start).some(s=>s.includes("It doesn't affect")),field+' '+item);b.destroy();
  }
  const b=battle('glitch',{moves:['flamethrower']},{species:'Genesect',item:'Burn Drive'});b.makeChoices('move flamethrower','move splash');const start=b.log.length;b.makeChoices('move flamethrower','move splash');assert.equal(b.log.filter(s=>s.includes('Fire-type moves rose!')).length,1);assert(b.log.slice(start).some(s=>s.includes("It doesn't affect")));b.destroy();
 });
 test('Chess Pawn survival is limited to one full-HP save per active slot and checks actual damage',()=>{
  const b=battle('chess_board'),[u,t]=pokemon(b),m=move(b,'tackle');t.rejuvenationRoles[fid('chess_board')]='pawn';const hp=t.hp;b.activeMove=m;b.activePokemon=u;assert.equal(b.damage(hp,t,u,m),hp-1);assert.equal(t.hp,1);t.hp=t.maxhp;assert.equal(b.damage(hp,t,u,m),hp);assert.equal(t.hp,0);assert.equal(b.log.filter(s=>s.includes('hung on the edge of the board')).length,1);b.destroy();
 });
 test('Chess knight versus queen triples base power and ordinary queens dominate without stacking Majesty',()=>{
  for(const [role,targetRole,ability,factor]of [['knight','queen','Synchronize',3],['knight','rook','Synchronize',1],['queen','queen','Synchronize',1.5],['queen','rook','Queenly Majesty',1.5]]){
   const b=battle('chess_board',{ability},{ability:'Inner Focus'}),[u,t]=pokemon(b),m=move(b,'tackle');u.rejuvenationRoles[fid('chess_board')]=role;t.rejuvenationRoles[fid('chess_board')]=targetRole;b.activeMove=m;assert.equal(b.runEvent('BasePower',u,t,m,1000),factor*1000);if(factor===3)assert(b.log.some(s=>s.includes('An unblockable attack on the Queen!')));b.destroy();
  }
 });
 test('Deep Earth grants only the source exceptional levitation list and strips native Levitate under Gravity',()=>{
  for(const [ability,airborne]of [['Unaware',true],['Oblivious',true],['Magnet Pull',true],['Contrary',true],['Gravity Control',true],['Levitate',false],['Eelevate',false],['Solar Idol',false],['Lunar Idol',false]]){
   const b=battle('deep_earth',{ability}),[u]=pokemon(b);assert.equal(u.isGrounded(),!airborne,ability);assert.equal(u.runImmunity('Ground'),!airborne,ability+' Ground immunity');u.addVolatile('ingrain',u);assert.equal(u.isGrounded(),true,ability+' roots force grounding');b.destroy();
  }
 });
 test('Stellar Terapagos Tera Starstorm chooses source smart category while ordinary Terapagos stays Special',()=>{
  for(const [species,atk,spa,expected]of [['Terapagos-Stellar',300,100,'Physical'],['Terapagos-Stellar',100,300,'Special'],['Terapagos',300,100,'Special']]){
   const b=battle('indoor',{species,moves:['terastarstorm'],ability:'None'}),[u,t]=pokemon(b),m=move(b,'terastarstorm');Object.assign(u.storedStats,{atk,spa});b.activeMove=m;b.activePokemon=u;b.runEvent('ModifyMove',u,t,m,m);assert.equal(m.category,expected,species+' '+atk);b.destroy();
  }
 });
 test('Colosseum Stalwart saves full-HP lethal damage with source text unless Mold Breaker suppresses it',()=>{
  for(const [field,breaker,expected]of [['colosseum',false,1],['colosseum',true,0],['indoor',false,0]]){
   const b=battle(field,{ability:breaker?'Mold Breaker':'Synchronize'},{ability:'Stalwart'}),[u,t]=pokemon(b),m=move(b,'tackle');t.hp=t.maxhp=25;b.activeMove=m;b.activePokemon=u;b.runEvent('ModifyMove',u,t,m,m);assert.equal(b.damage(50,t,u,m),25-expected);assert.equal(t.hp,expected);assert.equal(b.log.some(s=>s.includes('endured the hit!')),expected===1);b.destroy();
  }
 });
};
