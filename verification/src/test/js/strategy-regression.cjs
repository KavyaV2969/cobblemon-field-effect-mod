module.exports=({test,battle,pokemon,E,fid,assert,Battle})=>{
 const A='00000000-0000-0000-0000-000000000001',B='00000000-0000-0000-0000-000000000002';
 const query=(move,gimmick)=>({user:A,target:B,move,gimmick,range:true});
 const evaluate=(b,q)=>JSON.parse(E.evaluate(b,[q])).results[0];
 const plan=(b,candidates)=>JSON.parse(E.strategy(b,{user:A,candidates}));
 const timeless=b=>b.log.filter(l=>!l.startsWith('|t:|')).join('\n');
 const state=b=>JSON.stringify({pokemon:b.sides.flatMap(s=>s.pokemon.map(p=>({uuid:p.uuid,hp:p.hp,maxhp:p.maxhp,
   types:p.getTypes(),species:p.species.id,ability:p.ability,item:p.item,status:p.status,boosts:p.boosts,
   dynamax:p.volatiles.dynamax?.duration,tera:p.terastallized,mega:p.canMegaEvo,ultra:p.canUltraBurst,
   slots:p.moveSlots.map(m=>[m.id,m.pp]),position:p.position,isActive:p.isActive}))),seed:b.prng.seed,
   field:[b.rejuvenation.id,b.rejuvenation.counters,b.rejuvenation.duration,b.rejuvenation.overlay,b.rejuvenation.stack],
   active:b.sides.map(s=>s.active.map(p=>p?.uuid)),weather:b.field.weather,terrain:b.field.terrain,log:timeless(b),faints:b.faintQueue.length});
 test('strategy evaluates transformations, progression and overlays without changing current or future battles',()=>{
   for(const [field,moves]of [['city',['smog','psychic']],['forest',['surf','growth']],['mountain',['snowscape','rockslide']],['cave',['earthquake','recover']],['indoor',['electricterrain','trickroom']]]){
     const x=battle(field,{moves},{moves:['splash']}),y=battle(field,{moves},{moves:['splash']});const before=state(x);
     const results=plan(x,moves.map(move=>({move,target:B})));assert(results.candidates.every(r=>!r.error),JSON.stringify(results));
     assert.equal(state(x),before,field+' plan mutated battle');
     assert(Number.isInteger(results.metrics.damageCalls) && Number.isInteger(results.metrics.cacheHits));
     x.makeChoices('move 1','move 1');y.makeChoices('move 1','move 1');assert.equal(timeless(x),timeless(y),field+' future');x.destroy();y.destroy();
   }
 });
 test('setup and recovery have measured future and residual consequences',()=>{
   const b=battle('forest',{moves:['growth','psychic','recover']},{moves:['splash']});const [u]=pokemon(b);u.hp=Math.floor(u.maxhp/2);
   const result=plan(b,['growth','recover','psychic'].map(move=>({move,target:B})));assert(result.candidates.every(r=>!r.error),JSON.stringify(result));
   assert(result.candidates[0].tacticalValue>0,'Growth increases effective future damage');assert(result.candidates[1].immediate>0,'Recovery heals');b.destroy();
 });
 test('gimmick evaluations use actual Mega, Ultra, Tera, Z and Max move states and restore all resources',()=>{
   const cases=[['mega',{species:'Charizard',ability:'Blaze',item:'Charizardite X',moves:['flamethrower','dragonclaw']}],
     ['ultra',{species:'Necrozma-Dusk-Mane',ability:'Prism Armor',item:'Ultranecrozium Z',moves:['photongeyser']}],
     ['zmove',{species:'Mew',item:'Psychium Z',moves:['psychic']}],
     ['dynamax',{species:'Pikachu',ability:'Static',moves:['thunderbolt']}],
     ['terastallize',{species:'Mew',teraType:'Fire',moves:['flamethrower']}]];
   for(const [gimmick,set]of cases){
     const b=battle('volcanic',set,{species:'Blissey',moves:['splash']});const before=state(b),move=set.moves[0];
     const row=evaluate(b,query(move,gimmick));assert(!row.error,JSON.stringify(row));
     assert(row.withField.totalMaxDamage>0,gimmick+' total damage');
     const r=plan(b,[{move,target:B},{move,target:B,gimmick}]);assert(r.candidates.every(c=>!c.error),JSON.stringify(r));
     assert.equal(state(b),before,gimmick+' leaked hypothetical state');b.destroy();
   }
 });
 test('preview total ranges agree with complete simulator hit outcomes including protection and multiple hits',()=>{
   for(const [field,move,a,t]of [
     ['forest','leafblade',{},{ability:'Battle Armor'}],['glitch','bodypress',{species:'Registeel'},{ability:'Battle Armor'}],
     ['cave','earthquake',{},{species:'Pidgeot',ability:'Battle Armor'}],['indoor','seismictoss',{},{ability:'Battle Armor'}],
     ['indoor','bulletseed',{ability:'Skill Link'},{ability:'Battle Armor'}],['colosseum','closecombat',{},{species:'Snorlax',level:1,ability:'Stalwart'}]]){
       const b=battle(field,{moves:[move],...a},{moves:['splash'],...t});const [,target]=pokemon(b);const before=target.hp;
       const r=evaluate(b,query(move));b.makeChoices('move 1','move 1');const actual=before-target.hp;
       // These cases have no residual target HP changes; complete hit result must lie in the server range.
       assert(actual>=r.withField.totalMinDamage && actual<=r.withField.totalMaxDamage,field+' '+move+' '+actual+' vs '+JSON.stringify(r.withField));b.destroy();
   }
 });
 test('Dynamax conversions create terrain and expose duration in strategic lookahead',()=>{
   const b=battle('city',{species:'Pikachu',moves:['thunderbolt']},{moves:['splash']});
   const result=plan(b,[{move:'thunderbolt',target:B,gimmick:'dynamax'}]);assert(!result.candidates[0].error,JSON.stringify(result));
   assert(result.candidates[0].overlayAfter===fid('electric_terrain') || result.candidates[0].fieldAfter===fid('electric_terrain'),JSON.stringify(result));b.destroy();
 });
 test('converted move priorities match the actual installed action queue',()=>{
   for(const gimmick of ['zmove','dynamax']){
     const b=battle('indoor',{moves:['quickattack'],item:gimmick==='zmove'?'Normalium Z':''},{moves:['splash']});const [u]=pokemon(b);
     const r=evaluate(b,query('quickattack',gimmick));assert(!r.error,JSON.stringify(r));
     const action={choice:'move',pokemon:u,move:b.dex.getActiveMove('quickattack'),fractionalPriority:0};
     if(gimmick==='zmove')action.zmove=b.actions.getZMove(action.move,u);else action.maxMove=b.actions.getMaxMove(action.move,u).id;
     b.getActionSpeed(action);assert.equal(r.withField.priority,action.priority);assert.equal(action.priority,0);b.destroy();
   }
 });
 test('guaranteed critical policies and Gigantamax moves survive the shared range pipeline',()=>{
   const b=battle('indoor',{species:'Urshifu',ability:'Unseen Fist',moves:['wickedblow']},{species:'Snorlax',ability:'Thick Fat',moves:['splash']});
   const [,t]=pokemon(b),before=t.hp,r=evaluate(b,query('wickedblow'));b.makeChoices('move 1','move 1');
   assert(before-t.hp>=r.withField.totalMinDamage && before-t.hp<=r.withField.totalMaxDamage);b.destroy();
   const g=battle('city',{species:'Pikachu',gigantamax:true,moves:['thunderbolt']},{species:'Blissey',moves:['splash']});const [p]=pokemon(g);
   const beforeG=state(g);
   assert.equal(g.actions.getActiveMaxMove(g.dex.getActiveMove('thunderbolt'),p).id,'gmaxvoltcrash');
   const result=plan(g,[{move:'thunderbolt',target:B,gimmick:'dynamax'}]);assert(!result.candidates[0].error,JSON.stringify(result));assert.equal(state(g),beforeG);g.destroy();
 });
 test('status and hazard benefits are priced beyond immediate damage',()=>{
   const b=battle('indoor',{moves:['toxic','psychic']},{species:'Snorlax',ability:'Thick Fat',moves:['splash']});
   const r=plan(b,[{move:'toxic',target:B},{move:'psychic',target:B}]);assert(r.candidates.every(x=>!x.error));
   assert(r.candidates[0].lasting>0,'Toxic has future option value');b.destroy();
 });
};
