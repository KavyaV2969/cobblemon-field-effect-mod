// Quark Drive and Protosynthesis follow three separate source checks:
//  Battler.rb:3416-3441 (switch-in), Battle.rb:529-559 (quarkdriveCheck) and Battle.rb:562-591 (protosynthesisCheck).
// The battle-wide checks run only when the field/overlay (Quark Drive) or the weather (Protosynthesis) changes, so a
// battler that merely switches into New World or Desert is not boosted by the field and spends its Booster Energy.
module.exports=({test,battle,pokemon,move,E,fid,assert,catalog,Battle})=>{
 const said=(b,text,from=0)=>b.log.slice(from).some(s=>s.includes('rejuvenationmessage') && s.includes(text));
 const key=ability=>ability.toLowerCase().replace(' ','');
 // The lead is a bystander; the paradox Pokemon is brought in by a real switch after `prepare` shaped the battlefield.
 function entering(field,set,prepare){const b=new Battle({formatid:'gen9customgame',seed:[1,2,3,4]});E.attach(b,fid(field));let n=0;const mon=v=>({species:'Mew',ability:'Inner Focus',moves:['splash'],...v,uuid:'00000000-0000-0000-0000-00000000008'+(n++),movesInfo:[{pp:20,maxPp:20}]});
  b.setPlayer('p1',{name:'A',team:[mon({}),mon(set)]});b.setPlayer('p2',{name:'B',team:[mon({})]});b.choose('p1','team 1');b.choose('p2','team 1');if(prepare)prepare(b);const from=b.log.length;b.makeChoices('switch 2','move splash');return {b,u:b.sides[0].active[0],t:b.sides[1].active[0],from};}

 test('paradox abilities entering the field are boosted only by Electric Terrain or sunlight, otherwise by Booster Energy',()=>{
  // [field, ability, preparation, item, expected source: 'field' | 'booster' | null, expected text]
  const overlay=b=>E.change(b,fid('electric_terrain'),{duration:5});const sun=b=>b.field.setWeather('sunnyday',b.sides[1].active[0]);
  for(const [field,ability,prepare,item,source,text]of [
   ['electric_terrain','Quark Drive',null,'Booster Energy','field','The Electric Terrain activated'],['rocky','Quark Drive',overlay,'Booster Energy','field','The Electric Terrain activated'],
   ['new_world','Quark Drive',null,'Booster Energy','booster','used its Booster Energy to activate Quark Drive'],['new_world','Quark Drive',null,'',null,null],['indoor','Quark Drive',null,'',null,null],
   ['indoor','Protosynthesis',sun,'Booster Energy','field','The harsh sunlight activated'],['desert','Protosynthesis',null,'Booster Energy','booster','used its Booster Energy to activate Protosynthesis'],
   ['desert','Protosynthesis',null,'',null,null],['new_world','Protosynthesis',null,'',null,null],['new_world','Protosynthesis',null,'Booster Energy','booster','used its Booster Energy to activate Protosynthesis']]){
   const {b,u,t,from}=entering(field,{ability,item},prepare),v=u.volatiles[key(ability)],label=[field,ability,item].join();
   assert.equal(!!v,source!==null,label);
   if(v){assert.equal(!!v.fromBooster,source==='booster',label);assert.equal(u.item,source==='booster'?'':(item?'boosterenergy':''),label+' item');assert.equal(v.bestStat,'atk');assert.equal(b.runEvent('ModifyAtk',u,t,move(b,'tackle'),1000),1300,label);}
   else assert.equal(b.runEvent('ModifyAtk',u,t,move(b,'tackle'),1000),1000,label);
   for(const line of ['ethereal energy activated','The Electric Terrain activated','The harsh sunlight activated'])assert.equal(said(b,line,from),!!text && text.includes(line.replace(' activated','')) && source==='field',label+' '+line);
   // A Booster Energy activation on entry is announced by the simulator's own item line.
   assert.equal(b.log.slice(from).some(s=>s.startsWith('|-activate|p1a') && s.includes('[fromitem]')),source==='booster',label+' item announcement');b.destroy();}});

 test('Quark Drive is re-examined when the field or an overlay changes and when an Electric Terrain overlay ends',()=>{
  // An overlay boosts the highest stat counting stages and wears off with the overlay.
  let b=battle('forest',{ability:'Quark Drive'}),[u,t]=pokemon(b);u.boosts.spe=2;E.change(b,fid('electric_terrain'),{duration:2});assert.equal(b.rejuvenation.overlay?.id,fid('electric_terrain'));assert.equal(u.volatiles.quarkdrive.bestStat,'spe');assert.equal(b.runEvent('ModifySpe',u,null,null,1000),1500);
  b.residualEvent('Residual');assert(u.volatiles.quarkdrive);let from=b.log.length;b.residualEvent('Residual');assert.equal(b.rejuvenation.overlay,null);assert(!u.volatiles.quarkdrive);assert(said(b,'Quark Drive wore off!',from));b.destroy();
  // New World boosts battlers that are present when the field becomes New World.
  b=battle('indoor',{ability:'Quark Drive'});[u,t]=pokemon(b);assert(!u.volatiles.quarkdrive);from=b.log.length;E.change(b,fid('new_world'));assert(u.volatiles.quarkdrive && !u.volatiles.quarkdrive.fromBooster);assert(said(b,'The ethereal energy activated',from));assert.equal(b.runEvent('ModifyAtk',u,t,move(b,'tackle'),1000),1300);
  from=b.log.length;E.destroy(b,'The field collapsed!');assert(!u.volatiles.quarkdrive,'leaving New World ends the boost');assert(said(b,'Quark Drive wore off!',from));b.destroy();
  // Leaving a qualifying field spends Booster Energy once; the replacement boost then ignores later changes.
  b=battle('electric_terrain',{ability:'Quark Drive',item:'Booster Energy'});[u,t]=pokemon(b);assert(!u.volatiles.quarkdrive.fromBooster);assert.equal(u.item,'boosterenergy');from=b.log.length;E.change(b,fid('forest'));
  assert(said(b,'Quark Drive wore off!',from));assert(said(b,'used its Booster Energy to activate Quark Drive',from));assert(u.volatiles.quarkdrive.fromBooster);assert.equal(u.item,'');from=b.log.length;E.change(b,fid('new_world'));E.change(b,fid('rocky'));assert(u.volatiles.quarkdrive.fromBooster);assert(!said(b,'wore off',from));assert(!said(b,'activated',from));b.destroy();
  // The stat is chosen once: changing from one qualifying source to another does not re-pick it.
  b=battle('electric_terrain',{ability:'Quark Drive'});[u,t]=pokemon(b);assert.equal(u.volatiles.quarkdrive.bestStat,'atk');u.boosts.spe=6;from=b.log.length;E.change(b,fid('new_world'));assert.equal(u.volatiles.quarkdrive.bestStat,'atk');assert(!said(b,'activated',from) && !said(b,'wore off',from));b.destroy();
  // A transformed battler is never boosted, and the stages of one progressive field do not trigger the check.
  b=battle('indoor',{ability:'Quark Drive'});[u,t]=pokemon(b);u.transformed=true;E.change(b,fid('new_world'));assert(!u.volatiles.quarkdrive);b.destroy();
  // quarkdriveCheck runs before the new field removes the overlay, and nothing re-examines the boost afterwards.
  b=battle('rocky',{ability:'Quark Drive'});[u,t]=pokemon(b);E.change(b,fid('electric_terrain'),{duration:5});assert(u.volatiles.quarkdrive);from=b.log.length;E.change(b,fid('underwater'));assert.equal(b.rejuvenation.overlay,null);assert(u.volatiles.quarkdrive,'the check still saw the overlay');assert(!said(b,'wore off',from));
  from=b.log.length;E.change(b,fid('forest'));assert(!u.volatiles.quarkdrive);assert(said(b,'Quark Drive wore off!',from));b.destroy();
  // Weather never touches Quark Drive and the end of a turn is not a check.
  b=battle('indoor',{ability:'Quark Drive'});[u,t]=pokemon(b);E.change(b,fid('new_world'));assert(u.volatiles.quarkdrive);u.removeVolatile('quarkdrive');b.residualEvent('Residual');assert(!u.volatiles.quarkdrive,'no end-of-turn reactivation');b.destroy();});

 test('Protosynthesis is re-examined only when the weather changes, where Desert and New World also qualify',()=>{
  let b=battle('indoor',{ability:'Protosynthesis'}),[u,t]=pokemon(b),from=b.log.length;b.field.setWeather('sunnyday',u);assert(u.volatiles.protosynthesis);assert(said(b,'The harsh sunlight activated',from));from=b.log.length;b.field.clearWeather();assert(!u.volatiles.protosynthesis);assert(said(b,'Protosynthesis wore off!',from));b.destroy();
  // Desert: nothing on entry or on a field change, a boost at the next weather change, which then outlives the Desert until the weather changes again.
  b=battle('desert',{ability:'Protosynthesis'});[u,t]=pokemon(b);assert(!u.volatiles.protosynthesis);E.change(b,fid('rocky'));E.change(b,fid('desert'));assert(!u.volatiles.protosynthesis,'field changes are not a Protosynthesis check');
  from=b.log.length;b.field.setWeather('sandstorm',u);assert(u.volatiles.protosynthesis,'any weather change on Desert');assert(said(b,'The harsh sunlight activated',from));assert.equal(b.runEvent('ModifyAtk',u,t,move(b,'tackle'),1000),1300);
  from=b.log.length;E.change(b,fid('rocky'));assert(u.volatiles.protosynthesis,'leaving Desert is not a check');assert(!said(b,'wore off',from));b.field.clearWeather();assert(!u.volatiles.protosynthesis);assert(said(b,'Protosynthesis wore off!',from));b.destroy();
  // Booster Energy on expiry, once.
  b=battle('indoor',{ability:'Protosynthesis'});[u,t]=pokemon(b);b.field.setWeather('sunnyday',u);u.setItem('boosterenergy');assert.equal(u.item,'boosterenergy','an active boost keeps the item');from=b.log.length;b.field.setWeather('raindance',u);
  assert(said(b,'Protosynthesis wore off!',from));assert(said(b,'used its Booster Energy to activate Protosynthesis',from));assert(u.volatiles.protosynthesis.fromBooster);assert.equal(u.item,'');b.field.clearWeather();assert(u.volatiles.protosynthesis.fromBooster);b.destroy();
  // Cloud Nine hides the sunlight; Desert still qualifies at a weather check because it is a field condition.
  b=battle('indoor',{ability:'Protosynthesis'},{ability:'Cloud Nine'});[u,t]=pokemon(b);b.field.setWeather('sunnyday',u);assert(!u.volatiles.protosynthesis);b.destroy();
  b=battle('desert',{ability:'Protosynthesis'},{ability:'Cloud Nine'});[u,t]=pokemon(b);b.field.setWeather('sunnyday',u);assert(u.volatiles.protosynthesis);b.destroy();
  // A field change is not a check for Quark Drive's sibling either way round: weather does not boost Quark Drive.
  b=battle('indoor',{ability:'Quark Drive'});[u,t]=pokemon(b);b.field.setWeather('sunnyday',u);assert(!u.volatiles.quarkdrive);b.destroy();});

 test('paradox boosts survive complete turns without duplicate activations',()=>{
  const b=battle('electric_terrain',{ability:'Quark Drive',item:'Booster Energy',moves:['tackle']},{moves:['splash']}),[u]=pokemon(b);const count=()=>b.log.filter(s=>s.includes('activated') || s.includes('to activate')).length;const before=count();
  for(let i=0;i<3;i++)b.makeChoices('move tackle','move splash');assert.equal(count(),before);assert(u.volatiles.quarkdrive && !u.volatiles.quarkdrive.fromBooster);assert.equal(u.item,'boosterenergy');assert.equal(before,1);b.destroy();
  const c=battle('desert',{ability:'Protosynthesis',moves:['sunnyday','tackle']},{moves:['splash']}),[p]=pokemon(c);c.makeChoices('move sunnyday','move splash');assert(p.volatiles.protosynthesis);const n=c.log.filter(s=>s.includes('activated')).length;assert.equal(n,1);
  for(let i=0;i<9;i++)c.makeChoices('move tackle','move splash');assert.equal(c.field.weather,'','the sunlight has faded');assert(p.volatiles.protosynthesis,'Desert still qualifies when the weather ends');assert.equal(c.log.filter(s=>s.includes('activated')).length,1);assert(!c.log.some(s=>s.includes('Protosynthesis wore off!')));c.destroy();});

 test('environmental ability declarations reject malformed callbacks, entry conditions and message predicates',()=>{
  for(const change of [c=>c.fields[fid('indoor')].environmentAbilities.quarkdrive.callback='onAnyFaint',c=>c.fields[fid('indoor')].environmentAbilities.quarkdrive.messages[0].condition={unknown:true},c=>c.fields[fid('indoor')].environmentAbilities.quarkdrive.messages=[],
   c=>delete c.fields[fid('indoor')].environmentAbilities.protosynthesis.entryCondition,c=>c.fields[fid('indoor')].environmentAbilities.protosynthesis.entryCondition={unknown:true}]){const c=JSON.parse(JSON.stringify(catalog));change(c);assert.throws(()=>E.load(c));}
  E.load(JSON.stringify(catalog));});
};
