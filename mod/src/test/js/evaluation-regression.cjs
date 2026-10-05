// Read-only effective-move evaluation shared by the Run & Bun AI adapter and the client damage preview.
module.exports=({test,battle,pokemon,E,fid,assert,Battle})=>{
 const A='00000000-0000-0000-0000-000000000001',B='00000000-0000-0000-0000-000000000002';
 const ev=(b,queries)=>JSON.parse(E.evaluate(b,JSON.stringify(queries)));
 const one=(b,move,user=A,target=B)=>ev(b,[{user,move,target,range:true}]).results[0];
 // Canonical simulator state: everything a later turn could observe.
 function dump(b){
  // Canonical form: class instances by identity tag (Pokemon/Side/Battle are reachable from states), Sets sorted.
  const plain=(v,depth=0)=>{if(v===undefined || v===null || typeof v!=='object')return v===undefined?null:v;if(depth>6)return '...';
   if(v instanceof Set)return [...v].map(x=>plain(x,depth+1)).sort();if(Array.isArray(v))return v.map(x=>plain(x,depth+1));
   const name=v.constructor?.name;if(name && !['Object','Array'].includes(name))return name+':'+(v.uuid || v.fullname || v.id || '');
   const o={};for(const k of Object.keys(v).sort())if(typeof v[k]!=='function')o[k]=plain(v[k],depth+1);return o;};
  const mons=b.sides.flatMap(s=>s.pokemon.map(p=>({uuid:p.uuid,species:p.species.id,hp:p.hp,maxhp:p.maxhp,status:p.status,statusState:plain(p.statusState),boosts:{...p.boosts},
   volatiles:plain(p.volatiles),item:p.item,itemState:plain(p.itemState),lastItem:p.lastItem,ability:p.ability,types:p.getTypes(),addedType:p.addedType,lastMoveUsed:p.lastMoveUsed?.id,
   stellar:p.stellarBoostedTypes,storedStats:{...p.storedStats},moves:p.moveSlots.map(m=>m.id+':'+m.pp),flags:plain(p.rejuvenationFlags)})));
  const s=b.rejuvenation?{...b.rejuvenation}:null;if(s)delete s.catalog;
  return JSON.stringify({mons,field:plain({weather:b.field.weather,weatherState:b.field.weatherState,terrain:b.field.terrain,terrainState:b.field.terrainState,pseudoWeather:b.field.pseudoWeather}),
   sides:b.sides.map(x=>plain(x.sideConditions)),state:plain(s),seed:b.prng.seed.join(),log:timeless(b),lastMoveLine:b.lastMoveLine,active:b.activeMove?.id ?? null,turn:b.turn});
 }
 // Showdown stamps wall-clock seconds into |t:| lines; everything else must match exactly.
 const timeless=b=>b.log.filter(l=>!l.startsWith('|t:|')).join('\n');
 const everyMove=(b,moves)=>moves.flatMap(m=>[{user:A,move:m,target:B,range:true,crit:true},{user:B,move:m,target:A},{user:A,move:m,target:A}]);

 test('move evaluation never mutates the battle: identical state and identical future turns after many queries',()=>{
  const cases=[
   ['electric_terrain',{moves:['thunderbolt','spore','swordsdance','recover'],item:'Wacan Berry'},{species:'Charizard',ability:'Blaze',moves:['flamethrower','earthquake','roost','thunderwave'],item:'Wacan Berry'}],
   ['fairytale',{species:'Aegislash',ability:'Stance Change',moves:['shadowball','kingsshield','sacredsword','swordsdance']},{species:'Blissey',moves:['seismictoss','softboiled','toxic','splash'],item:'Leftovers'}],
   ['short_circuit',{moves:['discharge','thunderwave','voltswitch','charge']},{species:'Magnezone',ability:'Sturdy',moves:['thunderbolt','flashcannon','splash','magnetrise']}],
   ['underwater',{moves:['flamethrower','surf','dive','rest']},{species:'Starmie',ability:'Natural Cure',moves:['hydropump','recover','splash','thunderwave']}],
   ['glitch',{moves:['psychic','sleeptalk','rest','conversion']},{species:'Porygon2',ability:'Download',moves:['triattack','recover','splash','conversion2']}],
   ['new_world',{moves:['gravity','psychic','cosmicpower','recover']},{species:'Clefable',ability:'Magic Guard',moves:['moonblast','splash','calmmind','softboiled']}]];
  for(const [field,a,t]of cases){
   const x=battle(field,a,t),y=battle(field,a,t);
   const queries=everyMove(x,[...new Set([...a.moves,...t.moves])]);
   for(let round=0;round<2;round++){
    const before=dump(x);const out=ev(x,queries);
    assert.equal(out.field,y.rejuvenation.id,field);assert.equal(out.results.length,queries.length);assert(out.results.every(r=>!r.error),field);
    assert.equal(dump(x),before,field+': evaluation mutated the battle');assert.equal(dump(x),dump(y),field+': diverged from twin');
    x.makeChoices('move 1','move 1');y.makeChoices('move 1','move 1');
    assert.equal(timeless(x),timeless(y),field+': queried battle played a different turn');
   }
   x.destroy();y.destroy();
  }
 });
 test('doubles evaluation of spread moves leaves both sides untouched and identical to a twin battle',()=>{
  const make=()=>{const b=new Battle({formatid:'cobblemondoubles',seed:[1,2,3,4]});E.attach(b,fid('electric_terrain'));let n=0;
   const set=v=>({species:'Mew',ability:'Synchronize',...v,uuid:'00000000-0000-0000-0000-0000000000'+String(++n).padStart(2,'0'),movesInfo:v.moves.map(()=>({pp:20,maxPp:20}))});
   b.setPlayer('p1',{name:'A',team:[set({moves:['discharge','earthquake']}),set({species:'Pikachu',ability:'Lightning Rod',moves:['thunderbolt','protect']})]});
   b.setPlayer('p2',{name:'B',team:[set({species:'Gyarados',ability:'Intimidate',moves:['waterfall','protect'],item:'Sitrus Berry'}),set({species:'Raichu',ability:'Volt Absorb',moves:['surf','fakeout']})]});
   b.choose('p1','team 12');b.choose('p2','team 12');return b;};
  const x=make(),y=make(),ids=x.sides.flatMap(s=>s.pokemon.map(p=>p.uuid)),moves=['discharge','earthquake','thunderbolt','surf','waterfall','fakeout'];
  const queries=moves.flatMap(move=>ids.flatMap(user=>ids.map(target=>({user,move,target}))));
  const out=ev(x,queries);assert.equal(out.results.length,queries.length);
  const discharge=out.results.find(r=>r.query.move==='discharge' && r.query.user===ids[0] && r.query.target===ids[3]);
  assert.equal(discharge.withField.immune,true,'Volt Absorb absorbs the electric spread move');
  assert.equal(dump(x),dump(y));x.makeChoices('move 1, move 1 1','move 1 1, move 1');y.makeChoices('move 1, move 1 1','move 1 1, move 1');
  assert.equal(timeless(x),timeless(y));x.destroy();y.destroy();
 });
 test('evaluation without field state reports no results, and the native measurement matches an unfielded battle',()=>{
  const b=battle('forest',{moves:['leafblade']},{ability:'Battle Armor'});const r=one(b,'leafblade');
  assert(r.withField.maxDamage>r.native.maxDamage,'Forest raises Grass damage');
  // Two independent rolls bracket every possible non-critical damage value.
  assert(r.withField.minDamage<=r.withField.maxDamage && r.native.minDamage<=r.native.maxDamage);
  assert.deepEqual(JSON.parse(E.evaluate('no-such-battle','[]')).results,[]);b.destroy();
 });
 test('evaluated damage brackets the damage the simulator actually deals on fields',()=>{
  for(const [field,move,attacker,defender]of [['forest','leafblade',{},{ability:'Battle Armor'}],['cave','earthquake',{},{species:'Pidgeot',ability:'Battle Armor'}],
    ['volcanic','flamethrower',{},{ability:'Battle Armor'}],['back_alley','crunch',{},{ability:'Battle Armor'}],['indoor','psychic',{},{ability:'Battle Armor'}]]){
   for(const seed of [[1,2,3,4],[5,6,7,8],[9,10,11,12]]){
    const b=battle(field,{moves:[move],...attacker},{moves:['splash'],...defender});b.prng=new (Object.getPrototypeOf(b.prng).constructor)(seed);
    const r=one(b,move);const [u]=pokemon(b);b.makeChoices('move 1','move 1');
    // source.lastDamage is the move's own damage, excluding end-of-round field damage.
    if(u.lastDamage>0 && !b.log.some(l=>l.startsWith('|-crit')))assert(u.lastDamage>=r.withField.minDamage && u.lastDamage<=r.withField.maxDamage,field+' '+move+' dealt '+u.lastDamage+' outside '+r.withField.minDamage+'-'+r.withField.maxDamage);
    b.destroy();
   }
  }
 });
 test('field-modified results where native mechanics differ: chart, rejection, category, accuracy, priority, speed and status',()=>{
  let b=battle('cave',{moves:['earthquake']},{species:'Pidgeot'});let r=one(b,'earthquake');
  assert.equal(r.native.immune,true,'Ground does not hit Flying natively');assert.equal(r.native.maxDamage,null);assert(r.native.maxDamageIgnoringImmunity>0,'Native baseline ignoring the type immunity');assert.equal(r.withField.immune,false,'Cave lets Ground hit Flying');assert(r.withField.minDamage>0);b.destroy();
  b=battle('underwater',{moves:['flamethrower']});r=one(b,'flamethrower');
  assert.equal(r.withField.fails,true,'Underwater rejects Fire moves');assert.equal(r.native.fails,false);assert(r.native.minDamage>0);b.destroy();
  b=battle('deep_earth',{moves:['topsyturvy']});r=one(b,'topsyturvy');
  assert.equal(r.native.category,'Status');assert.equal(r.withField.category,'Physical');assert.equal(r.withField.basePower,20);assert(r.withField.maxDamage>0);b.destroy();
  b=battle('bewitched',{moves:['sleeppowder']},{species:'Snorlax'});r=one(b,'sleeppowder');
  assert.equal(r.withField.accuracy,85);b=battle('indoor',{moves:['sleeppowder']},{species:'Snorlax'});assert.equal(one(b,'sleeppowder').withField.accuracy,75);b.destroy();
  b=battle('grassy_terrain',{moves:['grassyglide']});r=one(b,'grassyglide');
  assert.equal(r.withField.priority,1);b.destroy();b=battle('indoor',{moves:['grassyglide']});assert.equal(one(b,'grassyglide').withField.priority,0);
  b=battle('colosseum',{moves:['closecombat']},{species:'Snorlax',ability:'Stalwart',level:1});r=one(b,'closecombat');
  assert.equal(r.withField.survivesLethal,true,'Colosseum Stalwart endures a lethal hit');b.destroy();
  b=battle('electric_terrain',{ability:'Steadfast',moves:['spore']},{species:'Snorlax'});r=one(b,'spore');
  assert.equal(r.withField.userSpeed,Math.floor(r.native.userSpeed*1.5));
  assert.equal(r.native.statusApplies,true,'Spore puts a grounded target to sleep natively');assert.equal(r.withField.statusApplies,false,'Electric Terrain prevents sleep on the ground');b.destroy();
 });
 test('evaluation queries are cheap enough to repeat and are independent of query order',()=>{
  const b=battle('forest',{moves:['leafblade','bugbuzz','surf','cut']},{species:'Snorlax'});
  const queries=['leafblade','bugbuzz','surf','cut'].map(move=>({user:A,move,target:B}));
  const forward=ev(b,queries).results,backward=ev(b,[...queries].reverse()).results.reverse();
  assert.deepEqual(forward,backward);
  assert(forward.find(r=>r.query.move==='surf').withField.maxDamage<forward.find(r=>r.query.move==='surf').native.maxDamage,'Forest halves Surf');
  b.destroy();
 });

 test('field-change damage boost assumes the measured move connects, not the previous action result',()=>{
  // Battle_Field.rb:568 evaluates the change condition inside the damage calculation of a hitting move: Icy Dive
  // (water backup, "connected") must not read an earlier move's result. Without the water backup it never changes.
  const boosted=[];
  for(const [lower,upper,mover,target,moveId,destination]of [
   ['water_surface','icy',{moves:['dive']},{},'dive','indoor'],
   ['forest','icy',{moves:['dive']},{},'dive',null]]){
   const b=battle(lower,mover,target);E.change(b,fid(upper),{push:true});
   const results=[[true,false],[false,true],[undefined,undefined]].map(([missed,connected])=>{
    const s=b.rejuvenation;if(missed===undefined){delete s.missed;delete s.connected;}else{s.missed=missed;s.connected=connected;}
    const before=JSON.stringify(Object.keys(s))+s.missed+s.connected;
    const r=ev(b,[{user:A,move:moveId,target:B,range:true}]).results[0];
    assert.equal(JSON.stringify(Object.keys(s))+s.missed+s.connected,before,'per-action results are restored exactly');
    return r.withField;
   });
   for(const r of results){assert.equal(r.changesFieldTo,destination && fid(destination),lower+' '+moveId);assert.equal(r.maxDamage,results[0].maxDamage);}
   b.destroy();
   boosted.push(results[0].maxDamage);
  }
  assert(boosted[0]>boosted[1],'the change boost (x1.3) applies only when the ice actually breaks: '+boosted);
 });

 test('preview bounds cover every native hit-count outcome and stochastic power or damage is not displayed as a sample',()=>{
  // Shell Armor removes chance critical hits, which previews exclude by design; the hit-count bounds come from the
  // simulator's own draws (2-5 distribution, multi-accuracy misses, Skill Link, Loaded Dice).
  const foe={species:'Snorlax',ability:'Shell Armor',moves:['splash']};
  const make=(mover,move,field='indoor')=>battle(field,{...mover,moves:[move]},foe);
  for(const [mover,move,hits]of [[{species:'Cloyster',ability:'Overcoat'},'iciclespear',[2,5]],[{species:'Cloyster',ability:'Skill Link'},'iciclespear',[5,5]],
    [{species:'Cloyster',ability:'Overcoat',item:'Loaded Dice'},'iciclespear',[4,5]],[{species:'Maushold',ability:'Friend Guard'},'populationbomb',[1,10]],
    [{species:'Hitmontop',ability:'Technician'},'tripleaxel',[1,3]],[{species:'Hitmontop',ability:'Technician'},'doublekick',[2,2]]]){
   const b=make(mover,move),r=one(b,move).withField;b.destroy();
   assert(!r.uncertainDamageRange && r.minHits===hits[0] && r.maxHits===hits[1],move+' '+JSON.stringify(mover)+' hits '+r.minHits+'-'+r.maxHits);
   for(let s=0;s<120;s++){
    const x=make(mover,move),[u,t]=pokemon(x),hp=t.hp;x.prng=new x.prng.constructor([s+1,s*7+3,s*13+5,s*31+7]);
    x.actions.useMove(move,u,t);const dealt=hp-t.hp;x.destroy();
    if(dealt>0)assert(dealt>=r.totalMinDamage && dealt<=r.totalMaxDamage,move+' outcome '+dealt+' outside '+r.totalMinDamage+'-'+r.totalMaxDamage);
   }
  }
  for(const move of ['magnitude','psywave','present']){
   const b=make({},move),r=one(b,move).withField;b.destroy();
   assert(r.uncertainDamageRange && r.stochasticDamage && r.totalMinDamage===undefined && r.totalMaxDamage===undefined,move+' '+JSON.stringify(r));
  }
  const fixed=make({},'seismictoss'),s=one(fixed,'seismictoss').withField;fixed.destroy();
  assert(!s.uncertainDamageRange && s.totalMinDamage===100 && s.totalMaxDamage===100,'deterministic damage keeps its exact value');
  // Draws that cannot change damage keep the range: Secret Power's field secondary, a single fixed added type, and a
  // 100% secondary (its effect re-enters the hit pipeline without damage: neither a hit nor a damage calculation).
  for(const [field,move]of [['forest','secretpower'],['corrosive_mist','hurricane'],['grassy_terrain','mysticalfire'],['forest','snarl'],['indoor','icywind']]){
   const b=make({},move,field),r=one(b,move).withField;b.destroy();
   assert(!r.uncertainDamageRange && r.totalMinDamage>0 && r.totalMaxDamage>=r.totalMinDamage && r.minHits===1 && r.maxHits===1,field+' '+move+' '+JSON.stringify(r));
  }
  // A callback that consumes move state per roll (Beat Up's allies) evaluates every roll, and a failing query never
  // takes the other queries of its batch down with it.
  const beat=make({species:'Weavile',ability:'Pressure'},'beatup'),rows=ev(beat,[{user:A,move:'beatup',target:B,range:true,crit:true},{user:A,move:'nonexistentmove',target:B},{user:A,move:'tackle',target:B,range:true}]).results;beat.destroy();
  assert(!rows[0].error && rows[0].withField.totalMaxDamage>0 && rows[1].error && !rows[2].error && rows[2].withField.totalMaxDamage>0,JSON.stringify(rows));
 });
};
