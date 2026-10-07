// Field branches of Battle_Effects.rb: status gates, Defiant/Competitive, absorbed healing and the ability predicates.
module.exports=({test,battle,pokemon,move,E,fid,assert,catalog,Battle})=>{
 const said=(b,text,from=0)=>b.log.slice(from).some(s=>s.includes('rejuvenationmessage') && s.includes(text));
 const fix=b=>{b.randomChance=()=>true;b.random=(m,n)=>n===undefined?0:m;};
 const speed=(field,set,prepare)=>{const b=battle(field,{ability:'Inner Focus',...set}),[u,t]=pokemon(b);if(prepare)prepare(b,u,t);const value=b.runEvent('ModifySpe',u,null,null,1000);b.destroy();return value;};
 const overlay=id=>b=>E.change(b,fid(id),{duration:5});

 test('status gates follow the Battle_Effects field exceptions',()=>{
  // The status gate and the ability cure check are separate in the source: where the field lifts the gate the status
  // lands and pbAbilityCureCheck (Battler.rb:4077-4088) removes it again right after the move.
  const inflict=(field,id,ability)=>{const b=battle(field,{moves:[id]},{ability,moves:['harden']}),[u,t]=pokemon(b);fix(b);const from=b.log.length;b.makeChoices('move '+id,'move harden');const lines=b.log.slice(from);
   const out={landed:lines.some(s=>s.startsWith('|-status|p2a')),cured:lines.some(s=>s.startsWith('|-curestatus|p2a')),status:t.status};b.destroy();return out;};
  // Pastel Veil does not stop poison on Infernal Field (204-207).
  assert.deepEqual(inflict('infernal','toxic','Pastel Veil'),{landed:true,cured:true,status:''});assert.deepEqual(inflict('indoor','toxic','Pastel Veil'),{landed:false,cured:false,status:''});assert.deepEqual(inflict('infernal','toxic','Immunity'),{landed:false,cured:false,status:''});assert.equal(inflict('infernal','toxic','Inner Focus').status,'tox');
  // Magma Armor does not stop freezing on Frozen Dimension (353); nothing freezes on Volcanic Field (354).
  assert.deepEqual(inflict('frozen_dimension','icebeam','Magma Armor'),{landed:true,cured:true,status:''});assert.deepEqual(inflict('indoor','icebeam','Magma Armor'),{landed:false,cured:false,status:''});
  assert.equal(inflict('indoor','icebeam','Inner Focus').status,'frz');assert.equal(inflict('frozen_dimension','icebeam','Inner Focus').status,'frz');assert.deepEqual(inflict('volcanic','icebeam','Inner Focus'),{landed:false,cured:false,status:''});
  // On Infernal a Pastel Veil holder neither shields nor cures its partner (Battler.rb:3041-3048).
  const d=new Battle({formatid:'gen9doublescustomgame',seed:[1,2,3,4]});E.attach(d,fid('infernal'));let n=0;const set=v=>({species:'Mew',ability:'Inner Focus',moves:['harden'],...v,uuid:'00000000-0000-0000-0000-0000000000b'+(n++),movesInfo:(v.moves || ['harden']).map(()=>({pp:20,maxPp:20}))});
  d.setPlayer('p1',{name:'A',team:[set({moves:['toxic']}),set({})]});d.setPlayer('p2',{name:'B',team:[set({ability:'Pastel Veil'}),set({})]});d.choose('p1','team 12');d.choose('p2','team 12');fix(d);d.makeChoices('move toxic 2, move harden','move harden, move harden');assert.equal(d.sides[1].active[1].status,'tox');d.destroy();});

 test('Defiant and Competitive use their source field amounts',()=>{
  const drop=(field,ability,id)=>{const b=battle(field,{moves:[id]},{ability,moves:['harden']}),[u,t]=pokemon(b);fix(b);const before={...t.boosts};b.makeChoices('move '+id,'move harden');const out={};for(const s of ['atk','def','spa','spd'])if(t.boosts[s]-before[s])out[s]=t.boosts[s]-before[s];b.destroy();return out;};
  // Growl: Attack -1 on the holder, then the ability; Harden adds one Defense stage every time.
  assert.deepEqual(drop('indoor','Defiant','growl'),{atk:1,def:1});assert.deepEqual(drop('back_alley','Defiant','growl'),{atk:2,def:1});assert.deepEqual(drop('colosseum','Defiant','growl'),{atk:1,def:3});
  assert.deepEqual(drop('indoor','Competitive','growl'),{atk:-1,def:1,spa:2});assert.deepEqual(drop('city','Competitive','growl'),{atk:-1,def:1,spa:3});assert.deepEqual(drop('colosseum','Competitive','growl'),{atk:-1,def:1,spa:2,spd:2});
  assert.deepEqual(drop('chess_board','Competitive','growl').spa,undefined,'Competitive is replaced by its damage bonus on the Chess Board');assert.equal(drop('chess_board','Defiant','growl').atk,1);});

 test('absorbed healing uses the source field multipliers',()=>{
  const heal=(field,agent,set={},prepare)=>{const b=battle(field,{ability:'Inner Focus',...set}),[u,t]=pokemon(b);if(prepare)prepare(b);u.hp=1;const amount=b.heal(20,u,t,b.dex.conditions.get(agent));b.destroy();return amount;};
  for(const [field,agent,expected,prepare]of [['grassy_terrain','leechseed',26],['forest','leechseed',20],['forest','strengthsap',26],['swamp','strengthsap',20],['indoor','strengthsap',20],
   ['misty_terrain','aquaring',40],['swamp','aquaring',40],['water_surface','aquaring',40],['underwater','aquaring',40],['indoor','aquaring',20],
   ['flower_garden_4','ingrain',80],['flower_garden_5','ingrain',80],['flower_garden_2','ingrain',40],['flower_garden_3','ingrain',40],['forest','ingrain',40],['grassy_terrain','ingrain',40],['rocky','ingrain',40,overlay('grassy_terrain')],['flower_garden_1','ingrain',20],['indoor','ingrain',20]])
   assert.equal(heal(field,agent,{},prepare),expected,field+' '+agent);
  // Matcha Gotcha restores 1.3 times as much on Icy Field and Snowy Mountain (1192).
  for(const [field,expected]of [['icy',26],['snowy_mountain',26],['indoor',20]])assert.equal(heal(field,'drain',{},b=>{b.activeMove=move(b,'matchagotcha');}),expected,field+' Matcha Gotcha');
  // Big Root: 1.6 on Grassy Terrain, the ordinary factor elsewhere, applied before the agent multiplier.
  assert.equal(heal('grassy_terrain','drain',{item:'Big Root'}),32);assert.equal(heal('indoor','drain',{item:'Big Root'}),26);assert.equal(heal('grassy_terrain','leechseed',{item:'Big Root'}),Math.round(32*1.3));
  // Liquid Ooze hurts twice as much on the three polluted fields (1205).
  for(const [field,loss]of [['wasteland',40],['murkwater_surface',40],['corrupted',40],['indoor',20]]){const b=battle(field,{ability:'Inner Focus'},{ability:'Liquid Ooze'}),[u,t]=pokemon(b);u.hp=100;b.heal(20,u,t,b.dex.conditions.get('drain'));assert.equal(100-u.hp,loss,field);b.destroy();}
  // Swamp: draining lowers a random stat of the victim (1223-1226).
  for(const [field,agent,drops]of [['swamp','drain',true],['swamp','leechseed',true],['swamp','strengthsap',true],['swamp','aquaring',false],['indoor','drain',false]]){const b=battle(field,{ability:'Inner Focus'},{ability:'Inner Focus'}),[u,t]=pokemon(b);u.hp=100;b.sample=list=>list[0];const sum=()=>Object.values(t.boosts).reduce((n,v)=>n+v,0),before=sum();b.heal(20,u,t,b.dex.conditions.get(agent));assert.equal(sum()-before,drops?-1:0,field+' '+agent);b.destroy();}});

 test('end-of-turn status cures follow hydrationActive?',()=>{
  for(const [field,ability,item,cured]of [['underwater','Hydration','',true],['water_surface','Hydration','',true],['water_surface','Hydration','Air Balloon',false],['indoor','Hydration','',false],['water_surface','Water Veil','',true],['underwater','Water Veil','',true],['murkwater_surface','Water Veil','',false],['bewitched','Natural Cure','',true],['forest','Natural Cure','',false]]){
   const b=battle(field,{ability,item,moves:['harden']},{moves:['harden']}),[u]=pokemon(b);u.setStatus('par');assert.equal(u.status,'par',field+' '+ability);b.makeChoices('move harden','move harden');assert.equal(u.status,cured?'':'par',[field,ability,item].join());b.destroy();}});

 test('Leaf Guard, Flower Gift and Gale Wings are active on their source fields',()=>{
  // Leaf Guard (1388-1390)
  for(const [field,prepare,blocked]of [['forest',null,true],['flower_garden_2',null,true],['flower_garden_5',null,true],['grassy_terrain',null,true],['rocky',overlay('grassy_terrain'),true],['flower_garden_1',null,false],['indoor',null,false]]){
   const b=battle(field,{moves:['thunderwave']},{ability:'Leaf Guard',moves:['harden']}),[u,t]=pokemon(b);fix(b);if(prepare)prepare(b);b.makeChoices('move thunderwave','move harden');assert.equal(t.status,blocked?'':'par',field);b.destroy();}
  let b=battle('forest',{moves:['thunderwave'],ability:'Mold Breaker'},{ability:'Leaf Guard',moves:['harden']}),[u,t]=pokemon(b);fix(b);b.makeChoices('move thunderwave','move harden');assert.equal(t.status,'par','Mold Breaker ignores Leaf Guard');b.destroy();
  // Flower Gift (1398-1399): Attack and Special Defense of the holder's side.
  for(const [field,active]of [['flower_garden_1',true],['flower_garden_5',true],['bewitched',true],['indoor',false],['forest',false]]){b=battle(field,{species:'Cherrim',ability:'Flower Gift'});[u,t]=pokemon(b);
   assert.equal(b.runEvent('ModifyAtk',u,t,move(b,'tackle'),1000),active?1500:1000,field+' attack');assert.equal(b.runEvent('ModifySpD',u,t,move(b,'surf'),1000),active?1500:1000,field+' special defense');b.destroy();}
  // Cherrim takes its Sunshine form at entry and keeps it through weather changes there; the form is re-read only at
  // entry and weather events, so it outlives the field until the weather next changes (Battler.rb:1634-1646).
  for(const [field,sunny]of [['flower_garden_1',true],['flower_garden_4',true],['bewitched',true],['indoor',false],['forest',false]]){b=battle(field,{species:'Cherrim',ability:'Flower Gift'});[u]=pokemon(b);assert.equal(u.species.id,sunny?'cherrimsunshine':'cherrim',field);b.destroy();}
  b=battle('flower_garden_2',{species:'Cherrim',ability:'Flower Gift'});[u]=pokemon(b);b.field.setWeather('raindance',u);assert.equal(u.species.id,'cherrimsunshine','rain does not close the blossom in the garden');E.change(b,fid('rocky'));assert.equal(u.species.id,'cherrimsunshine','a field change is not a form check');b.field.setWeather('sandstorm',u);assert.equal(u.species.id,'cherrim');b.destroy();
  b=battle('flower_garden_2',{species:'Cherrim',ability:'Inner Focus'});assert.equal(pokemon(b)[0].species.id,'cherrim','the form needs Flower Gift');b.destroy();
  // Gale Wings (1406-1407)
  const priority=(field,weather)=>{const b=battle(field,{ability:'Gale Wings'}),[u,t]=pokemon(b);u.hp=Math.floor(u.maxhp/2);if(weather)b.field.setWeather(weather,u);const m=move(b,'peck');const value=b.runEvent('ModifyPriority',u,null,m,m.priority);const other=b.runEvent('ModifyPriority',u,null,move(b,'tackle'),0);b.destroy();return [value,other];};
  assert.deepEqual(priority('sky'),[1,0]);assert.deepEqual(priority('mountain','deltastream'),[1,0]);assert.deepEqual(priority('snowy_mountain','deltastream'),[1,0]);assert.deepEqual(priority('volcanic_top','deltastream'),[1,0]);assert.deepEqual(priority('mountain'),[0,0]);assert.deepEqual(priority('indoor','deltastream'),[0,0]);});

 test('speed abilities are active on their source fields',()=>{
  const none=field=>speed(field,{});
  // [field, ability, preparation, expected multiple of the same field without the ability]
  for(const [field,ability,prepare,factor,set]of [
   ['flower_garden_4','Chlorophyll',null,2],['flower_garden_5','Chlorophyll',null,2],['flower_garden_3','Chlorophyll',null,1],
   ['desert','Sand Rush',null,2],['beach','Sand Rush',null,2],['indoor','Sand Rush',null,1],
   ['icy','Slush Rush',null,2],['snowy_mountain','Slush Rush',null,2],['frozen_dimension','Slush Rush',null,2],['indoor','Slush Rush',null,1],
   ['electric_terrain','Surge Surfer',null,2],['short_circuit','Surge Surfer',null,2],['rocky','Surge Surfer',overlay('electric_terrain'),2],['indoor','Surge Surfer',null,1],
   ['psychic_terrain','Telepathy',null,2],['rocky','Telepathy',overlay('psychic_terrain'),1],['indoor','Telepathy',null,1],
   ['electric_terrain','Quick Feet',null,1.5],['rocky','Quick Feet',overlay('electric_terrain'),1],['indoor','Quick Feet',null,1],
   ['electric_terrain','Steadfast',null,1.5],['rocky','Steadfast',overlay('electric_terrain'),1.5]])
   assert.equal(speed(field,{ability,...(set || {})},prepare),Math.floor(speed(field,{},prepare)*factor),field+' '+ability);
  // A statused Quick Feet holder keeps the single 1.5 multiplier on Electric Terrain.
  assert.equal(speed('electric_terrain',{ability:'Quick Feet'},(b,u)=>{u.setStatus('psn');}),1500);assert.equal(speed('indoor',{ability:'Quick Feet'},(b,u)=>{u.setStatus('psn');}),1500);
  // Water Surface and Murkwater Surface: Surge Surfer and Swift Swim double a grounded holder and also escape the surface penalty.
  for(const field of ['water_surface','murkwater_surface'])for(const ability of ['Surge Surfer','Swift Swim']){assert.equal(speed(field,{ability}),2000,field+' '+ability);assert.equal(speed(field,{ability,item:'Air Balloon'}),1000,field+' airborne '+ability);}
  assert.equal(none('water_surface'),750);assert.equal(speed('underwater',{ability:'Swift Swim'}),2000);assert.equal(none('underwater'),500);});

 test('field abilities announce their stat changes with the source flavour',()=>{
  for(const [field,ability,text]of [['fairytale','Battle Armor','shining armor'],['fairytale','Stance Change','royal shield'],['fairytale','Magic Guard','magical power'],['fairytale','Mirror Armor','reflective armor'],
   ['colosseum','Shell Armor','shining armor'],['colosseum','Magic Guard','magical power'],['colosseum','No Guard','ferocious heart']]){
   const b=battle(field,{ability,species:ability==='Stance Change'?'Aegislash':'Mew'}),[u]=pokemon(b);assert(Object.values(u.boosts).some(v=>v>0),field+' '+ability+' boost');assert(said(b,"'s "+text+' raised its '),field+' '+ability+' flavour');
   assert(b.log.filter(s=>s.startsWith('|-boost|p1a')).every(s=>s.includes('[rejuvenationsilent]')),'the ordinary stat line is withheld');b.destroy();}
  // One line names every stat that moved, and a capped stat is left out.
  let b=battle('colosseum',{ability:'No Guard'});assert(said(b,"'s ferocious heart raised its Attack and Sp. Atk!"));b.destroy();b=battle('fairytale',{ability:'Power of Alchemy'});assert(said(b,"'s magical power raised its Defense and Sp. Def!"));b.destroy();
  for(const field of ['dimensional','frozen_dimension'])for(const [ability,stat]of [['Berserk','Sp. Atk'],['Justified','Attack'],['Anger Point','Attack']]){b=battle(field,{ability});assert(said(b,"'s anger raised its "+stat+'!'),field+' '+ability);b.destroy();}
  b=battle('indoor',{ability:'Battle Armor'});const [u]=pokemon(b);u.boosts.def=6;const from=b.log.length;E.change(b,fid('fairytale'));assert(!said(b,'shining armor',from),'no line when nothing can rise');b.destroy();
  // Colosseum misspells Mirror Armor, which therefore gains nothing there (Battler.rb:2364).
  b=battle('colosseum',{ability:'Mirror Armor'});assert.equal(pokemon(b)[0].boosts.spd,0);b.destroy();
  for(const stats of [{def:2},{def:1,flavor:''}]){const c=JSON.parse(JSON.stringify(catalog));c.fields[fid('forest')].rules.push({event:'switchIn',condition:{always:true},actions:[{op:'boost',stats:{def:stats.def},flavor:stats.flavor ?? 'shining armor'}],source:'test'});assert.throws(()=>E.load(JSON.stringify(c)));}
  E.load(JSON.stringify(catalog));});
};
