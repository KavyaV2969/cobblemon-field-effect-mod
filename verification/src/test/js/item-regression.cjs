// The four Rejuvenation seeds and Amplifield Rock: simulator identity, per-field seed effects, non-matching fields,
// suppression and reactivation, and Amplifield Rock's temporary-field durations and exceptions. Executed in the installed simulator.
module.exports=({test,battle,pokemon,move,E,fid,assert,catalog})=>{
 const SEEDS=['magicalseed','telluricseed','syntheticseed','elementalseed'];
 const name=id=>catalog.items[id].name;
 const clamp=v=>Math.max(-6,Math.min(6,v));
 const seeded=Object.values(catalog.fields).filter(f=>f.seed);

 test('item definitions: four seeds, Amplifield Rock and Everstone bridge exist; Amulet Coin is unchanged',()=>{
  for(const [id,label] of [['magicalseed','Magical Seed'],['telluricseed','Telluric Seed'],['syntheticseed','Synthetic Seed'],['elementalseed','Elemental Seed'],['amplifieldrock','Amplifield Rock']]){
   assert.equal(catalog.items[id].name,label);assert.equal(catalog.items[id].isNonstandard,'Custom');assert.deepEqual(catalog.items[id].fling,{basePower:10});}
  assert.equal(catalog.items.everstone.minecraftItem,'cobblemon:everstone');
  assert.deepEqual(catalog.items.amuletcoin,{name:'Amulet Coin',isNonstandard:'Custom',fling:{basePower:10}});
  assert.equal(Object.keys(catalog.items).length,7);
  // Every seed named by a field is one of the four Rejuvenation seeds, and each is used by at least one field.
  const used=new Set(seeded.map(f=>f.seed.item));assert.deepEqual([...used].sort(),[...SEEDS].sort());
 });

 test('every field seed applies exactly its declared stage changes and is consumed (60 seeded fields)',()=>{
  assert.equal(seeded.length,60);
  for(const f of seeded){
   // The control battle holds nothing: fields may have their own entry effects, which the seed must not disturb or duplicate.
   const control=battle(f.id.split(':')[1]),[c]=pokemon(control),base={...c.boosts};control.destroy();
   const b=battle(f.id.split(':')[1],{item:name(f.seed.item)}),[u]=pokemon(b);
   assert.equal(u.item,'',f.id+' seed consumed');
   for(const [stat,amount] of Object.entries(f.seed.stats||{}))assert.equal(u.boosts[stat],clamp(base[stat]+amount),f.id+' '+stat);
   for(const stat of Object.keys(u.boosts))if(!(f.seed.stats||{})[stat] && !JSON.stringify(f.seedActions||[]).includes(stat))assert.equal(u.boosts[stat],base[stat],f.id+' unexpected '+stat);
   b.destroy();
  }
 });

 test('a seed from another field family is not consumed and changes nothing',()=>{
  for(const f of seeded){
   const control=battle(f.id.split(':')[1]),[c]=pokemon(control),base={...c.boosts};control.destroy();
   for(const other of SEEDS.filter(id=>id!==f.seed.item)){
    const b=battle(f.id.split(':')[1],{item:name(other)}),[u]=pokemon(b);
    assert.equal(u.item,other,f.id+' keeps '+other);assert.deepEqual(u.boosts,base,f.id+' unchanged by '+other);b.destroy();
   }
  }
  const b=battle('indoor',{item:'Telluric Seed'}),[u]=pokemon(b);assert.equal(u.item,'telluricseed');b.destroy();
 });

 test('suppressed holders keep the seed; lifting suppression and re-entering consumes it',()=>{
  const suppressors={
   'Klutz':{enter:{ability:'Klutz'},lift:u=>{u.setAbility('Synchronize');}},
   'Embargo':{enter:{},arm:u=>{u.addVolatile('embargo');},lift:u=>{delete u.volatiles.embargo;}},
   'Magic Room':{enter:{},arm:(u,b)=>{b.field.addPseudoWeather('magicroom',u,move(b,'magicroom'));},lift:(u,b)=>{b.field.removePseudoWeather('magicroom');}}};
  for(const f of seeded.filter((x,i)=>i%6===0)){
   const target=f.id.split(':')[1];
   for(const [label,s] of Object.entries(suppressors)){
    const b=battle('indoor',{item:name(f.seed.item),...s.enter}),[u]=pokemon(b);
    s.arm?.(u,b);E.change(b,fid(target));
    assert.equal(u.item,f.seed.item,`${target} ${label}: kept while suppressed`);
    const held={...u.boosts};
    s.lift(u,b);b.runEvent('SwitchIn',u);
    assert.equal(u.item,'',`${target} ${label}: consumed after reactivation`);
    for(const [stat,amount] of Object.entries(f.seed.stats||{}))assert(u.boosts[stat]>=Math.min(held[stat]+0,clamp(held[stat]+amount)) && (amount<0?u.boosts[stat]<=held[stat]:u.boosts[stat]>=held[stat]),`${target} ${label} ${stat}`);
    b.destroy();
   }
  }
 });

 test('a seed is consumed once: re-entering or changing field again does not repeat it',()=>{
  const b=battle('cave',{item:'Telluric Seed'}),[u]=pokemon(b);assert.equal(u.boosts.def,2);
  b.runEvent('SwitchIn',u);E.change(b,fid('forest'));E.change(b,fid('cave'));assert.equal(u.boosts.def,2);b.destroy();
 });

 const dur=(field,item,mid)=>{
  const b=battle(field,{item,moves:[mid]}),[u]=pokemon(b);b.choose('p1','move 1');b.choose('p2','move 1');
  const out={overlay:b.rejuvenation.overlay?.duration??null,hard:b.rejuvenation.duration,field:E.current(b).id.split(':')[1],weather:b.field.weather?b.field.weatherState.duration:null,
   pseudo:b.field.pseudoWeather[mid]?.duration??null,side:u.side.sideConditions[mid]?.duration??null};b.destroy();return out;};

 test('Amplifield Rock extends terrain, hard-field and room clocks by three and leaves ordinary conditions alone',()=>{
  for(const [field,mid,key] of [['forest','electricterrain','overlay'],['cave','mistyterrain','overlay'],['indoor','psychicterrain','hard'],['indoor','trickroom','pseudo'],['indoor','gravity','pseudo']]){
   const plain=dur(field,'',mid),rock=dur(field,'Amplifield Rock',mid);
   assert.equal(rock[key],plain[key]+3,`${field} ${mid}`);
  }
  // Not extended: native weather rocks stay in charge, screens and Tailwind are not field clocks, Forest's own eight-turn Grassy Terrain is fixed.
  for(const [field,mid,key] of [['desert','sunnyday','weather'],['indoor','raindance','weather'],['indoor','reflect','side'],['indoor','tailwind','side'],['forest','grassyterrain','overlay']])
   assert.equal(dur(field,'Amplifield Rock',mid)[key],dur(field,'',mid)[key],`${field} ${mid} unaffected`);
 });

 test('Amplifield Rock and Everstone: Mist terrain is extended by the rock and blocked by Everstone; Everstone leaves other terrain alone',()=>{
  const plain=dur('indoor','','mist'),rock=dur('indoor','Amplifield Rock','mist'),stone=dur('indoor','Everstone','mist');
  assert.equal(plain.field,'misty_terrain');assert.equal(rock.field,'misty_terrain');assert.equal(rock.hard,plain.hard+3);
  assert.equal(stone.field,'indoor','Everstone blocks the move-created terrain');
  for(const mid of ['electricterrain','mistyterrain','psychicterrain'])assert.equal(dur('cave','Everstone',mid).overlay,dur('cave','',mid).overlay,mid+' with Everstone');
 });

 test('Dimensional random room clock takes precedence over Amplifield Rock',()=>{
  for(const mid of ['trickroom','gravity','magicroom','wonderroom'])assert.equal(dur('dimensional','Amplifield Rock',mid).pseudo,dur('dimensional','',mid).pseudo,mid);
 });
};
