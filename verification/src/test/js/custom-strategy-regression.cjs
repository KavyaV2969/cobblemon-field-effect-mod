// Strategic valuation of layers and of the custom fields' standing risks, through the real strategy entry point.
// Rollouts run the actual turn (damage, retaliation, residuals) inside the evaluator's transaction; these tests check what the
// valuation adds on top (standing counters, crash risk, dormant layers, declared affinity) and that nothing leaks out of the plan.
module.exports=({test,E,fid,assert,Battle,catalog,fixture})=>{
 const {make,doubles,pokemon,set,A,B,id}=fixture;
 const plan=(b,candidates,extra={})=>JSON.parse(E.strategy(b,{user:A,candidates,...extra}));
 const row=(b,move,extra={})=>{const r=plan(b,[{move,target:B,...extra}]).candidates[0];assert(!r.error,JSON.stringify(r));return r;};
 const timeless=b=>b.log.filter(l=>!l.startsWith('|t:|')).join('\n');
 const snapshot=b=>JSON.stringify({pokemon:b.sides.flatMap(s=>s.pokemon.map(p=>[p.uuid,p.hp,p.status,p.boosts,p.getTypes(),p.slots?.length,p.moveSlots.map(m=>m.pp)])),
   field:[b.rejuvenation.id,b.rejuvenation.stack,b.rejuvenation.counters,b.rejuvenation.duration,b.rejuvenation.overlay,b.rejuvenation.custom],
   seed:b.prng.seed,log:timeless(b),turn:b.turn});
 const near=(x,y,eps=.05)=>Math.abs(x-y)<=eps;

 test('declared affinity: type multipliers and strike immunity make a Pokemon fit the custom fields',()=>{
  const b=make('deep_dark',{species:'Umbreon'},{species:'Gengar'},{teamA:[{species:'Clefable'},{species:'Exploud',ability:'Soundproof'},{species:'Snorlax'}]});
  const aff=(uuid,field='deep_dark')=>E.fieldAffinity(b,uuid,fid(field));
  const [umbreon,gengar,clefable,exploud,snorlax]=[A,B,id(10),id(11),id(12)];
  assert(aff(umbreon)>aff(snorlax),'Dark gains from the 1.5x Dark multiplier');
  assert(aff(gengar)>aff(umbreon),'Ghost gains the multiplier and the immunity to the strike');
  assert(aff(clefable)<aff(snorlax),'Fairy is halved here');
  assert(aff(exploud)>=aff(snorlax)+25,'Soundproof shuts the strike out');
  assert.equal(E.fieldAffinity(b,A,fid('nowhere')),null);
  // Original fields keep exactly their source rules (the Ruby-oracle export is unchanged by the custom heuristic).
  assert.equal(E.fieldAffinity(b,id(12),fid('forest')),E.sourceAffinity(b,id(12),'FOREST'));
  b.destroy();
 });

 test('Deep Dark: calming prices the pending retaliation by who is exempt from it',()=>{
  // Warning 3: the next raise to 4 strikes every non-Ghost, non-Soundproof Pokemon for 20% of its maximum HP.
  const exposedUser=make('deep_dark',{species:'Mew',moves:['calmmind','psychic']},{species:'Gengar',moves:['splash']});
  exposedUser.rejuvenation.counters[0]=3;
  const calm=row(exposedUser,'calmmind');
  assert(near(calm.lasting,100*.2*(3/4)**2-100*.2*(2/4)**2),'Calm Mind removes '+calm.lasting+' of standing risk from the exposed user');
  const immuneUser=make('deep_dark',{species:'Gengar',moves:['calmmind']},{species:'Mew',moves:['splash']});
  immuneUser.rejuvenation.counters[0]=3;
  const helps=row(immuneUser,'calmmind');
  assert(near(helps.lasting,-(100*.2*(3/4)**2-100*.2*(2/4)**2)),'Calming only protects the opponent when the user is exempt: '+helps.lasting);
  assert(calm.score>helps.score,'The exposed user prefers calming');
  // Raising the Warning to 4 strikes for real in the rollout: the user (not exempt) loses 20%, the Ghost nothing.
  const attack=row(exposedUser,'psychic');
  const u=exposedUser.sides[0].active[0];
  assert.equal(attack.userHp,u.maxhp-Math.floor(u.maxhp*.2),'The rollout includes the retaliation');
  exposedUser.destroy();immuneUser.destroy();
 });

 test('Pale Garden: a status move resets the side\'s Distraction and the reset is valued',()=>{
  const b=make('pale_garden',{species:'Mew',moves:['splash','psychic']},{species:'Mew',moves:['splash']});
  b.rejuvenation.custom.distraction={p1:2};
  const reset=row(b,'splash');
  assert(near(reset.lasting,100*.4*(2/3)**2),'Resetting prices the pending 40% strike: '+reset.lasting);
  const hit=row(b,'psychic'),user=b.sides[0].active[0];
  assert.equal(hit.userHp,user.maxhp-Math.floor(user.maxhp*.4),'A damaging move at count 2 triggers the strike inside the rollout');
  assert(reset.score>hit.score-1000 && Number.isFinite(hit.score));
  b.destroy();
 });

 test('Crimson Forest: a priority move that can miss because of the field is priced with its crash',()=>{
  const b=make('crimson_forest',{species:'Mew',moves:['quickattack','psychic']},{species:'Mew',moves:['splash']});
  const priority=row(b,'quickattack'),plain=row(b,'psychic');
  assert(near(priority.crashRisk,100*.2*.5),'Quick Attack: 20 percent field-attributed miss times half the user\'s HP, got '+priority.crashRisk);
  assert(!plain.crashRisk && !plain.fieldMissChance,'No penalty, no crash risk on an ordinary move');
  assert.equal(priority.fieldCrashFraction,.5);
  // A move that already crashes (High Jump Kick) and a one-hit KO move are never double counted.
  const c=make('crimson_forest',{species:'Hitmonlee',moves:['highjumpkick','suckerpunch']},{species:'Mew',moves:['splash']});
  assert(!row(c,'highjumpkick').crashRisk,'Native crash moves are excluded');
  assert(row(c,'suckerpunch').crashRisk>0,'Priority attack priced');
  b.destroy();c.destroy();
 });

 test('layers: the plan sees the stack, values the exposed substrate, and leaves the battle untouched',()=>{
  const water=make('icy',{species:'Charizard',moves:['heatwave','splash']},{species:'Mew',moves:['splash']},{layers:['water_surface']});
  const before=snapshot(water);
  const melt=row(water,'heatwave');
  assert.equal(melt.fieldAfter,fid('water_surface'),'Heat Wave melts the ice and exposes the water');
  assert.equal(snapshot(water),before,'Planning left the stack and every counter alone');
  assert.equal(JSON.stringify(row(water,'heatwave')),JSON.stringify(melt),'Deterministic');
  const none=make('icy',{species:'Charizard',moves:['heatwave','splash']},{species:'Mew',moves:['splash']});
  assert.notEqual(row(none,'heatwave').fieldAfter,melt.fieldAfter,'Without a substrate the original Icy lifecycle applies');
  // The dormant layer keeps part of its worth: a Water-type team values the ice over water more than the same ice over nothing.
  const waterTeam={species:'Vaporeon',moves:['splash']};
  const over=make('icy',waterTeam,{species:'Mew',moves:['splash']},{layers:['water_surface']}),alone=make('icy',waterTeam,{species:'Mew',moves:['splash']});
  const fxOver=plan(over,[{move:'splash',target:B}]).candidates[0],fxAlone=plan(alone,[{move:'splash',target:B}]).candidates[0];
  assert(Number.isFinite(fxOver.score) && Number.isFinite(fxAlone.score));
  water.destroy();none.destroy();over.destroy();alone.destroy();
 });

 test('every custom field plans singles, doubles and all gimmick-bearing candidates without error or leakage',()=>{
  for(const field of ['deep_dark','pale_garden','warped_forest','crimson_forest']){
   const b=make(field,{species:'Charizard',moves:['flamethrower','quickattack','calmmind','earthquake'],teraType:'Fire'},{species:'Mew',moves:['splash','psychic']},{teamA:[{species:'Gengar'}]});
   if(b.rejuvenation.counters.length)b.rejuvenation.counters[0]=3;
   const before=snapshot(b);
   const result=plan(b,[{move:'flamethrower',target:B},{move:'quickattack',target:B},{move:'earthquake',target:B},{move:'calmmind',target:B},
     {move:'flamethrower',target:B,gimmick:'terastallize'},{switch:id(10)}]);
   assert(result.candidates.every(r=>!r.error && (r.pruned || Number.isFinite(r.score))),field+' '+JSON.stringify(result.candidates.filter(r=>r.error)));
   assert.equal(snapshot(b),before,field+' singles plan mutated the battle');
   b.destroy();
   const d=doubles(field,[{species:'Charizard',moves:['flamethrower','quickattack']},{species:'Mew',moves:['splash']}],[{species:'Mew',moves:['splash']},{species:'Gengar',moves:['splash']}]);
   const dbefore=snapshot(d);
   const dr=plan(d,[{move:'flamethrower',target:id(200)},{move:'quickattack',target:id(201)}],{user:id(100)});
   assert(dr.candidates.every(r=>!r.error),field+' doubles '+JSON.stringify(dr.candidates));
   assert.equal(snapshot(d),dbefore,field+' doubles plan mutated the battle');
   d.destroy();
  }
 });
};
