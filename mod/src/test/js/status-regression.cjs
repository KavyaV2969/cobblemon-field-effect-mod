module.exports=({test,battle,pokemon,move,E,fid,assert,catalog})=>{
 test('Petrification is an ordinary persistent status and does not prevent movement',()=>{
  const b=battle('deux_finalis',{moves:['splash']},{moves:['splash']}),[u,t]=pokemon(b);
  assert(t.trySetStatus('ptr',u));const before=b.log.length;
  b.choose('p1','move 1');b.choose('p2','move 1');
  assert(b.log.slice(before).some(s=>s.startsWith('|move|p2')));assert.equal(t.status,'ptr');
  assert.equal(b.log.filter(s=>s.includes('|-status|')&&s.includes('|ptr')).length,1);
  assert(t.cureStatus());assert.equal(t.status,'');b.destroy();
 });
 test('Petrification immunities survive Mold Breaker and Rock type is immune',()=>{
  for(const ability of ['Fairy Aura','Dark Aura','Aura Break','Rough Skin']){
   const b=battle('dimensional',{ability:'Mold Breaker'},{ability}),[u,t]=pokemon(b);
   b.activePokemon=u;b.activeMove=move(b,'ruination');assert.equal(t.trySetStatus('ptr',u),false,ability);assert.equal(t.status,'');b.destroy();
  }
  const b=battle('dimensional',{}, {species:'Geodude'}),[u,t]=pokemon(b);assert.equal(t.trySetStatus('ptr',u),false);b.destroy();
 });
 test('Petrification residual bypasses Magic Guard with exact one-eighth rounding',()=>{
  const b=battle('indoor',{}, {ability:'Magic Guard'}),[u,t]=pokemon(b);assert(t.trySetStatus('ptr',u));
  const before=t.hp;b.residualEvent('Residual');assert.equal(t.hp,before-Math.floor(t.maxhp/8));assert.equal(t.boosts.spe,0);b.destroy();
 });
 test('Petrification blocks direct healing, recovery and draining moves',()=>{
  for(const mid of ['recover','gigadrain']){const b=battle('indoor',{moves:[mid]},{}),[u,t]=pokemon(b);u.trySetStatus('ptr',t);u.hp=Math.floor(u.maxhp/2);
   assert.equal(b.heal(50,u,u,move(b,'recover')),false);const hp=t.hp;
   b.choose('p1','move 1');b.choose('p2','move 1');assert.equal(t.hp,hp);assert(b.log.some(s=>s.includes("is prevented from healing, so it can't use")));b.destroy();}
 });
 test('Fairy Aura protects its side from Petrification damage and healing restriction',()=>{
  const b=battle('indoor',{ability:'Fairy Aura'},{}),[u,t]=pokemon(b);u.status='ptr';u.statusState={id:'ptr',target:u};u.hp-=50;
  const hp=u.hp;b.residualEvent('Residual');assert.equal(u.hp,hp);assert.equal(b.heal(30,u,u,move(b,'recover')),30);
  assert.equal(b.heal(30,u,u,b.dex.abilities.get('regenerator')),false);b.destroy();
 });
 test('Dark Aura drain follows victim damage and Aura Break inverts recipient damage',()=>{
  for(const inverse of [false,true]){const b=battle('indoor',{ability:'Dark Aura'},{}),[u,t]=pokemon(b);t.trySetStatus('ptr',u);u.hp-=100;
   if(inverse)t.setAbility('aurabreak');const uh=u.hp,th=t.hp;b.residualEvent('Residual');
   assert.equal(t.hp,th-Math.floor(t.maxhp/8));assert.equal(u.hp,uh+(inverse?-Math.floor(u.maxhp/8):Math.floor(t.maxhp/8)));
   if(!inverse)assert(b.log.some(s=>s.includes("health is sapped by")));b.destroy();}
 });
 test('Dark Aura drain honors Big Root and Liquid Ooze',()=>{
  const b=battle('indoor',{ability:'Dark Aura',item:'Big Root'},{ability:'Liquid Ooze'}),[u,t]=pokemon(b);t.trySetStatus('ptr',u);u.hp-=100;
  const hp=u.hp;b.residualEvent('Residual');assert.equal(u.hp,hp-Math.round(Math.floor(t.maxhp/8)*5324/4096));b.destroy();
 });
 test('ordinary field moves inflict Petrification with native secondary gating',()=>{
  for(const [field,mid]of [['deux_finalis','freezingglare'],['deux_finalis','bittermalice'],['deux_finalis','bitterblade'],['dimensional','ruination'],['frozen_dimension','oblivionwing']]){
   const b=battle(field,{moves:[mid]},{species:'Blissey'}),[u,t]=pokemon(b);t.setType('Psychic');b.randomChance=(numerator,denominator)=>denominator===100 || numerator>=denominator;
   b.choose('p1','move 1');b.choose('p2','move 1');assert.equal(t.status,'ptr',field+' '+mid+' hp='+t.hp+' '+b.log.slice(-15).join('\n'));b.destroy();
  }
  const b=battle('deux_finalis',{moves:['bittermalice']},{ability:'Shield Dust'}),[,t]=pokemon(b);b.choose('p1','move 1');b.choose('p2','move 1');assert.equal(t.status,'');assert.equal(t.boosts.atk,0);b.destroy();
 });
 test('Sword of Ruin petrifies only on a successful damaging hit in Deux Finalis',()=>{
  for(const field of ['deux_finalis','indoor']){const b=battle(field,{ability:'Sword of Ruin',moves:['tackle']},{species:'Blissey'}),[,t]=pokemon(b);b.choose('p1','move 1');b.choose('p2','move 1');assert.equal(t.status,field==='deux_finalis'?'ptr':'');b.destroy();}
 });
 test('Ruin abilities add source Petrification multipliers on the correct stat branch',()=>{
  const b=battle('deux_finalis',{ability:'Beads of Ruin'},{ability:'Tablets of Ruin'}),[u,t]=pokemon(b);t.status='ptr';t.statusState={id:'ptr',target:t};
  const m=move(b,'tackle');assert.equal(b.runEvent('BasePower',u,t,m,100),195);
  u.status='ptr';u.statusState={id:'ptr',target:u};assert.equal(b.runEvent('ModifyDef',t,u,m,100),130);
  t.setAbility('vesselofruin');assert.equal(b.runEvent('ModifySpD',t,u,m,100),97);b.destroy();
 });
 test('Perish Body source counters, suppression, trapping and forced status replacement',()=>{
  for(const field of ['deux_finalis','holy','infernal','haunted','indoor']){
   const b=battle(field,{moves:['tackle']},{ability:'Perish Body'}),[u,t]=pokemon(b);
   if(field==='deux_finalis')u.trySetStatus('brn',t);
   const m=move(b,'tackle');b.singleEvent('DamagingHit',t.getAbility(),t.abilityState,t,u,m,10);
   assert.equal(!!t.volatiles.perishsong,field!=='holy');
   if(field!=='holy')assert.equal(t.volatiles.perishsong.time,field==='infernal'?1:3);
   assert.equal(!!t.volatiles.trapped,['infernal','haunted'].includes(field));
   if(field==='deux_finalis')assert.equal(u.status,'ptr');b.destroy();
  }
  const b=battle('deux_finalis',{}, {ability:'Perish Body'}),[u,t]=pokemon(b);u.addVolatile('perishsong');b.singleEvent('DamagingHit',t.getAbility(),t.abilityState,t,u,move(b,'tackle'),10);assert.equal(t.volatiles.perishsong,undefined);assert.equal(u.status,'');b.destroy();
 });
 test('capture environmental rules and persistent status validation reject malformed data',()=>{
  for(const change of [c=>{c.fields[fid('forest')].captureEnvironmentModifiers[0].predicate='dark';},c=>{c.fields[fid('indoor')].persistentStatusPolicies.ptr.fraction=-1;}]){
   const c=JSON.parse(JSON.stringify(catalog));change(c);assert.throws(()=>E.load(JSON.stringify(c)));
  }
 });
};
