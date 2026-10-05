module.exports=({test,battle,pokemon,move,E,fid,assert,catalog,Battle})=>{
 function doubles(field,a,c){const b=new Battle({formatid:'gen9doublescustomgame',seed:[1,2,3,4]});E.attach(b,fid(field));let n=0;const set=v=>({species:'Mew',ability:'Synchronize',moves:['splash'],...v,uuid:'00000000-0000-0000-0000-00000000001'+(n++),movesInfo:(v.moves || ['splash']).map(()=>({pp:20,maxPp:20}))});b.setPlayer('p1',{name:'A',team:a.map(set)});b.setPlayer('p2',{name:'B',team:c.map(set)});b.choose('p1','team 12');b.choose('p2','team 12');return b;}
 test('Eelevate levitates with native grounding guards and boosts highest raw stat after a KO',()=>{
  const b=battle('dimensional',{ability:'Eelevate',moves:['psychic']}),[u,t]=pokemon(b);assert.equal(u.isGrounded(),false);u.addVolatile('smackdown');assert.equal(u.isGrounded(),true);u.removeVolatile('smackdown');u.setItem('ironball');assert.equal(u.isGrounded(),true);u.clearItem();b.field.addPseudoWeather('gravity',t);assert.equal(u.isGrounded(),true);b.field.removePseudoWeather('gravity');
  u.storedStats.def=999;t.hp=1;b.sides[1].pokemonLeft=2;b.makeChoices('move psychic','move splash');assert.equal(u.boosts.def,1,'Dimensional doubles Beast Boost only');assert.equal(u.boosts.atk,0);b.destroy();
  const c=battle('indoor',{moves:['earthquake']},{ability:'Eelevate'}),[att,tar]=pokemon(c);c.makeChoices('move earthquake','move splash');assert.equal(tar.hp,tar.maxhp);c.destroy();
  const d=battle('indoor',{ability:'Mold Breaker',moves:['earthquake']},{ability:'Eelevate'}),[,def]=pokemon(d);d.makeChoices('move earthquake','move splash');assert(def.hp<def.maxhp);d.destroy();
 });
 test('Gravity Control sets source clocks once and remains airborne under its own gravity',()=>{
  for(const [field,item,expected]of [['indoor','',5],['indoor','Amplifield Rock',8],['psychic_terrain','',8],['dimensional','Amplifield Rock',null],['frozen_dimension','',5]]){
   const b=battle(field,{ability:'Gravity Control',item}),[u,t]=pokemon(b);assert(b.field.pseudoWeather.gravity,field);const duration=b.field.pseudoWeather.gravity.duration;assert(expected===null?duration>=3&&duration<=8:duration===expected,field+' '+duration);assert.equal(u.isGrounded(),false);assert.equal(t.isGrounded(),true);u.setItem('ironball');assert.equal(u.isGrounded(),true);u.clearItem();
   b.singleEvent('Start',u.getAbility(),u.abilityState,u);assert.equal(b.field.pseudoWeather.gravity.duration,duration,'does not restart active Gravity');b.destroy();
  }
 });
 test('Gravity Control invokes Gravity field reactions without changing move streaks',()=>{
  for(const [field,expected,message]of [['water_surface','underwater','The battle sank into the depths!'],['corrosive_mist','corrosive','The toxic mist collected on the ground!'],['sky','mountain','The battle has been brought down to the mountains!'],['new_world','starlight',"The world's matter reformed!"]]){
   const b=battle(field,{ability:'Gravity Control'}),[u]=pokemon(b);assert.equal(E.current(b).id,fid(expected));assert(b.log.some(s=>s.includes(message)),field);assert.equal(u.rejuvenationStreak,undefined);if(field==='new_world'){assert.equal(b.rejuvenation.duration,5);for(let n=0;n<5;n++)b.residualEvent('Residual');assert.equal(E.current(b).id,fid('new_world'));}b.destroy();
  }
  const cave=battle('cave',{ability:'Gravity Control'}),[u]=pokemon(cave);assert.equal(cave.rejuvenation.counters[3],1);cave.field.removePseudoWeather('gravity');cave.singleEvent('Start',u.getAbility(),u.abilityState,u);assert.equal(E.current(cave).id,fid('deep_earth'));cave.destroy();
 });
 test('Soul Eater absorbs Ghost and field Dark attacks with healing and full-HP messages',()=>{
  for(const [field,id,absorbed]of [['indoor','shadowball',true],['indoor','darkpulse',false],['dimensional','darkpulse',true],['infernal','darkpulse',true]]){
   const b=battle(field,{moves:[id]},{ability:'Soul Eater'}),[u,t]=pokemon(b);t.hp=Math.floor(t.maxhp/2);const hp=t.hp;b.makeChoices('move '+id,'move splash');assert(absorbed?t.hp>hp:t.hp<hp,field+' '+id);assert.equal(b.log.some(s=>s.includes('had its HP restored.')),absorbed);b.destroy();
  }
  const full=battle('indoor',{moves:['shadowball']},{ability:'Soul Eater'}),[,t]=pokemon(full);full.makeChoices('move shadowball','move splash');assert.equal(t.hp,t.maxhp);assert(full.log.some(s=>s.includes("It doesn't affect")));full.destroy();
  const breaker=battle('infernal',{ability:'Mold Breaker',moves:['darkpulse']},{ability:'Soul Eater'}),[,target]=pokemon(breaker);breaker.makeChoices('move darkpulse','move splash');assert(target.hp<target.maxhp);assert(!breaker.log.some(s=>s.includes('had its HP restored.')));breaker.destroy();
 });
 test('Soul Eater absorbs an additional field Ghost type and does not absorb allies self effects',()=>{
  const b=battle('indoor',{}, {ability:'Soul Eater'}),[u,t]=pokemon(b),m=move(b,'tackle');m.rejuvenationTypes=['Ghost'];t.hp=Math.floor(t.maxhp/2);const before=t.hp;assert.equal(b.runEvent('TryHit',t,u,m),null);assert(t.hp>before);assert.notEqual(b.singleEvent('TryHit',t.getAbility(),t.abilityState,t,t,move(b,'shadowball')),null);b.destroy();
 });
 test('declared airborne, field move and heal-failure schemas reject invalid data',()=>{
  for(const mutate of [c=>c.abilities.eelevate.airborne='yes',c=>c.abilities.eelevate.num=0,c=>c.abilities.gravitycontrol.callbacks.onStart.actions[1].move='doesnotexist',c=>c.abilities.souleater.callbacks.onTryHit.actions[0].failureMessage=false,c=>c.abilities.souleater.callbacks.onUnknown={mode:'replace',condition:{always:true},actions:[],source:'test'}]){const c=JSON.parse(JSON.stringify(catalog));mutate(c);assert.throws(()=>E.load(c));}
 });

 test('Dragonize changes ordinary Normal moves and uses the Dragon Den conversion boost',()=>{
  for(const field of ['indoor','dragons_den']){const b=battle(field,{ability:'Dragonize'}),[u,t]=pokemon(b),m=move(b,'hypervoice');b.runEvent('ModifyType',u,t,m,m);assert.equal(m.type,'Dragon');assert.equal(b.runEvent('BasePower',u,t,m,100),field==='indoor'?120:225);const z=move(b,'breakneckblitz');b.runEvent('ModifyType',u,t,z,z);assert.equal(z.type,'Normal');const other=move(b,'dragonpulse');assert.equal(b.runEvent('BasePower',u,t,other,100),field==='indoor'?100:150);b.destroy();}
 });
 test('Fire Mane boosts either offensive stat once and doubles Fire attacks on hot fields',()=>{
  for(const field of ['indoor','volcanic','volcanic_top','infernal']){const b=battle(field,{ability:'Fire Mane'}),[u,t]=pokemon(b);for(const e of ['ModifyAtk','ModifySpA']){assert.equal(b.runEvent(e,u,t,move(b,'flamethrower'),100),field==='indoor'?150:200,field);assert.equal(b.runEvent(e,u,t,move(b,'psychic'),100),100);}b.destroy();}
 });
 test('Hotshot uses the source ball-shot-kick list and No Guard in both directions',()=>{
  const b=battle('indoor',{ability:'Hotshot'}),[u,t]=pokemon(b);for(const [id,n]of [['mudshot',130],['highjumpkick',130],['shadowball',130],['sludgebomb',100],['focusblast',100],['psychic',100]])assert.equal(b.runEvent('BasePower',u,t,move(b,id),100),n,id);for(const [a,d]of [[u,t],[t,u]])assert.equal(b.runEvent('Accuracy',d,a,move(b,'zapcannon'),50),true);b.destroy();
  const c=battle('indoor',{ability:'Hotshot',moves:['zapcannon']},{moves:['fly']}),[a,d]=pokemon(c);d.storedStats.spe=999;c.makeChoices('move zapcannon','move fly');assert(d.hp<d.maxhp,'No Guard hits a semi-invulnerable opponent');c.destroy();
 });
 test('Solar and Lunar Idol levitate, modify their typed moves and apply weather stats independently',()=>{
  for(const [ability,weather,event,type]of [['Solar Idol','sunnyday','ModifyAtk','Fire'],['Lunar Idol','snow','ModifySpA','Ice'],['Lunar Idol','hail','ModifySpA','Ice']]){
   const b=battle('indoor',{ability}),[u,t]=pokemon(b),m=move(b,type==='Fire'?'flamethrower':'icebeam');assert.equal(u.isGrounded(),false);assert.equal(b.runEvent('BasePower',u,t,m,100),150);b.field.setWeather(weather,t,move(b,weather==='snow'?'snowscape':weather));assert.equal(b.runEvent(event,u,t,m,100),150);if(ability==='Solar Idol'){u.setItem('utilityumbrella');assert.equal(b.runEvent(event,u,t,m,100),100);}else{assert.equal(u.runStatusImmunity('hail'),false);const before=u.hp;b.residualEvent('Residual');assert.equal(u.hp,before);}b.destroy();
  }
 });
 test('Sworn Duty heals its ally by a quarter or third and emits the source paired message',()=>{
  for(const field of ['indoor','fairytale']){const b=doubles(field,[{ability:'Sworn Duty'},{}],[{},{}]),[u,ally]=b.sides[0].active;ally.hp=Math.floor(ally.maxhp/3);const hp=ally.hp;b.singleEvent('Start',u.getAbility(),u.abilityState,u);assert.equal(ally.hp-hp,Math.floor(ally.maxhp/(field==='fairytale'?3:4)));assert(b.log.some(s=>s.includes('Mew shared its mead with Mew!')));ally.hp=ally.maxhp;const before=b.log.length;b.singleEvent('Start',u.getAbility(),u.abilityState,u);assert(!b.log.slice(before).some(s=>s.includes('shared its mead')));b.destroy();}
 });
 test('Foam Spray lowers every other active Pokemon after a hit with stronger water-field drops',()=>{
  for(const field of ['indoor','water_surface','swamp','murkwater_surface']){const b=doubles(field,[{moves:['tackle']},{}],[{ability:'Foam Spray'},{}]);b.makeChoices('move tackle 1, move splash','move splash, move splash');const holder=b.sides[1].active[0],amount=field==='indoor'?-1:-2;for(const p of b.sides.flatMap(s=>s.active))assert.equal(p.boosts.def,p===holder?0:amount,field+' '+p.getSlot());b.destroy();}
 });
 test('Wildfire residual fractions honor burned foes, foliage fields, immunity and source flavor',()=>{
  for(const [field,burn,denom]of [['indoor',false,16],['indoor',true,8],['forest',false,6],['forest',true,6],['flower_garden_1',false,6]]){const b=battle(field,{ability:'Wildfire'},{ability:'Synchronize'}),[u,t]=pokemon(b);if(burn)t.status='brn';const hp=t.hp;b.singleEvent('Residual',u.getAbility(),u.abilityState,u);assert.equal(hp-t.hp,Math.floor(t.maxhp/denom),field);assert.equal(b.log.filter(s=>s.includes('burnt by the wildfire')).length,1);b.destroy();}
  for(const foe of [{ability:'Magic Guard'},{species:'Charizard'}]){const b=battle('forest',{ability:'Wildfire'},foe),[u,t]=pokemon(b),hp=t.hp;b.singleEvent('Residual',u.getAbility(),u.abilityState,u);assert.equal(t.hp,hp);assert(!b.log.some(s=>s.includes('burnt by the wildfire')));b.destroy();}
  const b=battle('indoor',{ability:'Wildfire'}),[u,t]=pokemon(b);u.addVolatile('partiallytrapped',t,move(b,'firespin'));let hp=t.hp;b.singleEvent('Residual',u.getAbility(),u.abilityState,u);assert.equal(hp-t.hp,Math.floor(t.maxhp/8));u.removeVolatile('partiallytrapped');u.addVolatile('partiallytrapped',t,move(b,'whirlpool'));hp=t.hp;b.singleEvent('Residual',u.getAbility(),u.abilityState,u);assert.equal(hp-t.hp,Math.floor(t.maxhp/16),'other traps do not double Wildfire');b.destroy();
 });
 test('Infernal Wildfire powers either attack category and bypasses type-absorbing abilities',()=>{
  for(const field of ['indoor','infernal']){const b=battle(field,{ability:'Wildfire'}),[u,t]=pokemon(b);for(const e of ['ModifyAtk','ModifySpA']){assert.equal(b.runEvent(e,u,t,move(b,'psychic'),100),field==='infernal'?150:100);t.status='brn';assert.equal(b.runEvent(e,u,t,move(b,'psychic'),100),150);t.status='';}b.destroy();}
  for(const [field,ability]of [['infernal','Flash Fire'],['indoor','Flash Fire'],['infernal','Well-Baked Body']]){const b=battle(field,{ability:'Wildfire',moves:['flamethrower']},{ability}),[u,t]=pokemon(b);const initialDefense=t.boosts.def;let hits=0;const old=b.actions.getDamage;b.actions.getDamage=function(a,d,m,...rest){if(m.id==='flamethrower')hits++;return old.call(this,a,d,m,...rest);};b.makeChoices('move flamethrower','move splash');assert.equal(hits>0,field==='infernal',field+' '+ability);assert.equal(t.boosts.def,initialDefense+(field==='infernal'&&ability==='Well-Baked Body'?1:0),'only the field residual defense boost remains');b.destroy();}
 });
 test('ability iteration, message actors and weather immunity reject malformed declarations',()=>{
  for(const mutate of [c=>c.abilities.lunaridol.callbacks.onImmunity.condition={immunityType:['lava']},c=>c.abilities.wildfire.callbacks.onResidual.actions[0].anchor='foe',c=>c.abilities.wildfire.callbacks.onResidual.actions[0].order='random',c=>c.abilities.wildfire.callbacks.onResidual.actions[0].condition={oops:true},c=>c.abilities.swornduty.callbacks.onStart.actions[0].actions[0].messageFrom='target',c=>c.abilities.wildfire.callbacks.onResidual.actions[0].actions[0].condition={volatileSourceMove:{who:'bad',id:'partiallytrapped',move:'firespin'}}]){const c=JSON.parse(JSON.stringify(catalog));mutate(c);assert.throws(()=>E.load(c));}
 });
};
