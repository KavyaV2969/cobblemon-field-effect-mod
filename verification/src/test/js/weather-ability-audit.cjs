module.exports=({test,battle,pokemon,move,E,fid,assert,catalog,Battle})=>{
 function pick(b,w){b.sample=rows=>rows.find(r=>r.id===w)||rows[0];}
 test('Storm 9 sets each source weather directly even on restricted fields with one original message',()=>{
  const messages={raindance:'Storm-9 created a downpour!',hail:'Storm-9 brought hailfall!',sandstorm:'Storm-9 whipped up a duststorm!',deltastream:'Storm-9 whipped up terrible winds!',shadowsky:'Storm-9 shrouded the sky in a shadowy aura...'};
  for(const field of ['indoor','underwater','new_world','infernal'])for(const w of Object.keys(messages)){
   const b=battle(field,{ability:'Tempest'}),[u]=pokemon(b);b.field.clearWeather();pick(b,w);const start=b.log.length;b.singleEvent('Start',u.getAbility(),u.abilityState,u);assert.equal(b.field.weather,w,field+' '+w);assert.equal(b.field.weatherState.duration,8);const lines=b.log.slice(start);assert.equal(lines.filter(s=>s.includes(messages[w])).length,1);assert(lines.find(s=>s.startsWith('|-weather|'))?.includes('[rejuvenationsilent]'));assert.equal(b.rejuvenationForceWeather,undefined);b.destroy();
  }
 });
 test('Storm 9 rotates before weather damage and duration decrement, excluding current weather',()=>{
  const b=battle('indoor',{ability:'Tempest'}),[u,t]=pokemon(b);b.field.clearWeather();pick(b,'hail');b.singleEvent('Start',u.getAbility(),u.abilityState,u);pick(b,'shadowsky');const hp=t.hp;b.residualEvent('Residual');assert.equal(b.field.weather,'shadowsky');assert.equal(b.field.weatherState.duration,7);assert.equal(hp-t.hp,Math.floor(t.maxhp/16));assert.equal(u.hp,u.maxhp,'weather damage immunity');
  pick(b,'shadowsky');b.residualEvent('Residual');assert.notEqual(b.field.weather,'shadowsky','current weather is excluded from the sample');b.destroy();
 });
 test('Storm 9 rotates once globally with multiple holders and keeps weather state isolated',()=>{
  const b=new Battle({formatid:'gen9doublescustomgame'});E.attach(b,fid('indoor'));let n=0;const mon=()=>({species:'Mew',ability:'Tempest',moves:['splash'],uuid:'storm-'+n++,movesInfo:[{pp:20,maxPp:20}]});for(const p of ['p1','p2'])b.setPlayer(p,{team:[mon(),mon()]});b.choose('p1','team 12');b.choose('p2','team 12');let calls=0;b.sample=rows=>{calls++;return rows[0];};b.residualEvent('Residual');assert.equal(calls,1);const other=battle('indoor');assert.equal(other.field.weather,'');b.destroy();other.destroy();
 });
 test('Shadow Sky damage follows the source fields, immunity guards and message order',()=>{
  for(const [field,denom]of [['indoor',16],['dimensional',8],['frozen_dimension',8]]){const b=battle(field),[u,t]=pokemon(b);b.field.setWeather('shadowsky',u,move(b,'weatherball'));const hp=t.hp,start=b.log.length;b.residualEvent('Residual');assert.equal(hp-t.hp,Math.floor(t.maxhp/denom),field);const lines=b.log.slice(start);assert.equal(lines.filter(s=>s.includes('struck by bursts of light')).length,1);assert(lines.findIndex(s=>s.includes('struck by bursts of light'))<lines.findIndex(s=>s.startsWith('|-damage|')));b.destroy();}
  for(const guards of [{ability:'Magic Guard'},{ability:'Overcoat'},{item:'Safety Goggles'},{flag:'shadow'},{volatile:'dig'},{volatile:'dive'}]){const b=battle('dimensional',{},guards),[u,t]=pokemon(b);if(guards.flag)t.rejuvenationFlags={shadow:true};if(guards.volatile)t.addVolatile(guards.volatile,t);b.field.setWeather('shadowsky',u,move(b,'weatherball'));const hp=t.hp;b.residualEvent('Residual');assert.equal(t.hp,hp,JSON.stringify(guards));b.destroy();}
  const clear=battle('indoor'),[u]=pokemon(clear);clear.field.setWeather('shadowsky',u,move(clear,'weatherball'));clear.field.weatherState.duration=1;clear.residualEvent('Residual');assert.equal(clear.field.weather,'');assert(clear.log.some(s=>s.includes('The shadowy aura faded away!')));clear.destroy();
 });
 test('Storm 9 survives forbidden field changes and reconciles weather when its ability ends',()=>{
  const b=battle('indoor',{ability:'Tempest'}),[u]=pokemon(b);b.field.clearWeather();pick(b,'raindance');b.singleEvent('Start',u.getAbility(),u.abilityState,u);E.change(b,fid('underwater'));assert.equal(b.field.weather,'raindance');u.setAbility('synchronize');assert.equal(b.field.weather,'');assert(b.log.some(s=>s.includes("You're too deep to notice the weather!")));b.destroy();
  const c=battle('indoor',{ability:'Tempest'}),[p]=pokemon(c),old=c.field.weather;p.setAbility('synchronize');assert.equal(c.field.weather,old,'permitted weather remains until its native duration ends');c.destroy();
 });
 test('Shadow Weather Ball has source power, typing, spread target and type interactions in a real turn',()=>{
  const b=battle('indoor',{ability:'Tempest',moves:['weatherball']}),[u,t]=pokemon(b);b.field.clearWeather();pick(b,'shadowsky');b.singleEvent('Start',u.getAbility(),u.abilityState,u);let seen;const old=b.actions.getDamage;b.actions.getDamage=function(a,d,m,...args){if(m.id==='weatherball')seen={type:m.type,power:m.basePower,target:m.target};return old.call(this,a,d,m,...args);};b.makeChoices('move weatherball','move splash');assert.deepEqual(seen,{type:'Shadow',power:100,target:'allAdjacentFoes'});assert(t.hp<t.maxhp);const m=move(b,'weatherball');m.type='Shadow';for(const [type,flag,value]of [['Normal',false,1],['Fairy',false,-1],['Normal',true,-1],['Fairy',true,-2]]){t.setType(type);t.rejuvenationFlags={shadow:flag};assert.equal(t.runEffectiveness(m),value,[type,flag].join());}assert(b.dex.types.get('Shadow').exists);b.destroy();
 });
 test('legacy Hail Warning is registered and respects field ability weather duration',()=>{
  for(const [field,duration]of [['indoor',5],['icy',8],['snowy_mountain',8],['sky',8]]){const b=battle(field,{ability:'Hail Warning'});assert.equal(b.field.weather,'hail');assert.equal(b.field.weatherState.duration,duration);b.destroy();}
 });
 test('weather cycles and custom weather or type definitions reject malformed content',()=>{
  for(const change of [c=>c.abilities.tempest.callbacks.onStart.actions[0].duration=0,c=>c.abilities.tempest.callbacks.onStart.actions[0].force='yes',c=>c.abilities.tempest.callbacks.onStart.actions[0].choices[0].id='typhoon',c=>c.fields[fid('indoor')].weatherDefinitions.shadowsky.damageFraction=2,c=>c.fields[fid('indoor')].weatherDefinitions.shadowsky.excludedVolatiles='dig',c=>c.fields[fid('indoor')].typeDefinitions.Shadow.hue=361,c=>c.fields[fid('indoor')].typeDefinitions.Shadow.damageTaken.Fire=9,c=>c.fields[fid('indoor')].typeDefinitions.Shadow.flagInteraction.flagged=2]){const c=JSON.parse(JSON.stringify(catalog));change(c);assert.throws(()=>E.load(c));}
 });
};
