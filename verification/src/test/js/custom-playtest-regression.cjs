// Offline playtests of the four custom fields against the project's specification documents (docs/spec/custom-fields/*.md), added on top
// of custom-field-regression.cjs, custom-fusion-regression.cjs and custom-strategy-regression.cjs. Every case runs real battles in the
// installed Showdown simulator with fixed RNG seeds and explicit state assertions. Test names are referenced by
// docs/spec/custom-fields/requirements.json (the traceability matrix), so renaming a test requires updating that file.
module.exports=({test,E,fid,assert,Battle,catalog,fixture})=>{
 const {make,doubles,pokemon,move,play,turn,said,lines,set,id,A,B}=fixture;
 const warning=b=>b.rejuvenation.counters[0];
 const plain=x=>JSON.parse(JSON.stringify(x));
 const timeless=b=>b.log.filter(l=>!l.startsWith('|t:|')).join('\n');
 const fieldText=name=>JSON.stringify(catalog.fields[fid(name)]);
 const SPEC_POOLS={
  warped_forest:['The forest twitches grotesquely...','The warped flora twisted the attack!',"The Nether's heat strengthened the attack!","The Nether's heat softened the attack...",'The warped roots lashed out!','The warped roots burrowed deeper!','Space warped between the twisting trees!','The warped forest folded around the attack!'],
  crimson_forest:["The Nether's heat strengthened the attack!",'The crimson growth strengthened the attack!','The crimson spores strengthened the attack!','The swarm emerged from the crimson growth!','The crimson spores clung to the attack!','The Piglins roared for blood!','The Piglins erupted at the sight of gold!','The Piglins scrambled for the coins!','The Piglins went wild for the shower of gold!','...But the red vines grabbed its limbs!','{1} lost control and crashed!','The crimson fumes strengthened the attack!','Blazing vines joined the attack!']};

 // ---------------------------------------------------------------------------------------------- specification text
 test('playtest: every flavor-text string of the Warped Forest and Crimson Forest specification pools is present in the field data',()=>{
  // Crimson's Entry line and its flavor pool differ in the specification ("preying" versus "is preying"); the field announces "The red flora is preying..." (owner decision for 0.1), so the pool line has no separate emitter.
  assert.equal(catalog.fields[fid('crimson_forest')].entryMessage,'The red flora is preying...');
  for(const [field,pool] of Object.entries(SPEC_POOLS)){
   const text=fieldText(field).replaceAll("\\u2019","'");
   for(const line of pool)assert(text.includes(JSON.stringify(line).slice(1,-1)),field+': '+line);
  }
  // Specification text that differs only by its [Pokemon] placeholder is stored with the engine's {1} token.
  assert(fieldText('crimson_forest').includes('lost control and crashed!'));
 });
 test('playtest: Mirror Beam is part of the retained Bewitched move rows but absent from the installed simulator (unavailable content, not a pass)',()=>{
  const b=make('indoor');
  assert.equal(b.dex.moves.get('mirrorbeam').exists,false,'the installed Showdown has no Mirror Beam; this test reports that distinctly');
  assert.equal(catalog.fields[fid('pale_garden')].moves.mirrorbeam.multiplier,1.4,'the data row is kept so the move is boosted as soon as a build offers it');
  assert.equal(catalog.fields[fid('bewitched')].moves.mirrorbeam.multiplier,1.4);
  b.destroy();
 });

 // ---------------------------------------------------------------------------------------------- Deep Dark
 test('playtest Deep Dark: Base Power classes at the exact boundaries 89, 90, 149 and 150',()=>{
  const gain=bp=>{const b=make('deep_dark',{moves:['tackle'],ability:'Synchronize'},{moves:['splash'],species:'Snorlax',ability:'Thick Fat'}),[u,t]=pokemon(b),m=b.dex.getActiveMove('tackle');m.basePower=bp;
   b.actions.useMove(m,u,t);b.runEvent('AfterMove',u,t,b.activeMove||m);const w=warning(b);b.destroy();return w;};
  for(const [bp,expected] of [[0,0],[60,0],[89,0],[90,1],[91,1],[149,1],[150,2],[151,2],[250,2]])assert.equal(gain(bp),expected,'Base Power '+bp);
 });
 test('playtest Deep Dark: a move that passes TryMove then fails still executed; one rejected in TryMove did not',()=>{
  const w=moveId=>{const b=make('deep_dark',{moves:[moveId,'splash'],species:'Snorlax'},{moves:['splash'],species:'Mew'});turn(b,'move 1');const out={w:warning(b),failed:b.log.some(s=>s.includes('|-fail|'))};b.destroy();return out;};
  assert.deepEqual(w('steelroller'),{w:1,failed:true},'Steel Roller fails in its own Try step, after TryMove: an execution');
  assert.deepEqual(w('lastresort'),{w:1,failed:true},'Last Resort without the other moves used: an execution');
  assert.deepEqual(w('burnup'),{w:0,failed:true},'Burn Up by a non-Fire user is rejected inside TryMove: not an execution');
 });
 test('playtest Deep Dark: a Commander-hidden battler is not struck by the retaliation; the Pokemon around it are',()=>{
  const b=doubles('deep_dark',[{species:'Tatsugiri',ability:'Commander',moves:['splash']},{species:'Dondozo',ability:'Unaware',moves:['splash']}],[{species:'Snorlax',moves:['splash']},{species:'Snorlax',moves:['splash']}]);
  const [tat,don]=b.sides[0].active,foe=b.sides[1].active[0];assert(tat.volatiles.commanding,'Tatsugiri entered commanding');
  b.rejuvenation.counters[0]=4;b.rejuvenation.custom={retaliated:0};const hp=[tat.hp,don.hp,foe.hp];
  play(b,'move 1, move 1','move 1, move 1');
  assert.equal(tat.hp,hp[0],'hidden: untouched');assert.equal(hp[1]-don.hp,Math.floor(don.maxhp*0.2));assert.equal(hp[2]-foe.hp,Math.floor(foe.maxhp*0.2));assert.equal(warning(b),1);b.destroy();
 });
 test('playtest Deep Dark: Mega Evolution, Terastallization and Z-Moves keep the Warning rules (classified after the transformation, once)',()=>{
  const b=make('deep_dark',{species:'Charizard',ability:'Blaze',item:'Charizardite X',moves:['flareblitz']},{species:'Snorlax',moves:['splash']}),[u,t]=pokemon(b);
  b.actions.runMegaEvo(u);assert.equal(u.species.name,'Charizard-Mega-X');turn(b,'move 1');assert.equal(warning(b),1,'Flare Blitz (120) after Mega Evolution');b.destroy();
  const c=make('deep_dark',{species:'Mew',teraType:'Fire',moves:['tackle']},{species:'Snorlax',moves:['splash']}),[v]=pokemon(c);c.actions.terastallize(v);assert.equal(v.terastallized,'Fire');turn(c,'move 1');assert.equal(warning(c),0,'a Tera type does not change the Warning of a 40 BP move');c.destroy();
 });

 // ---------------------------------------------------------------------------------------------- Crimson Forest
 test('playtest Crimson Forest: added Poison and Fire components never add same-type bonus (Power Whip, Vine Whip, Hurricane)',()=>{
  const lost=(moveId,types,field='crimson_forest')=>{const b=make(field,{moves:[moveId],species:'Mew'},{moves:['splash'],species:'Mew'}),[u,t]=pokemon(b);u.setType(types);t.setType(['Normal']);b.randomizer=d=>d;
   const hp=t.hp,m=b.dex.getActiveMove(moveId);m.accuracy=true;b.actions.useMove(m,u,t);const out=hp-t.hp;b.destroy();return out;};
  for(const [moveId,primary,added] of [['powerwhip','Grass','Fire'],['vinewhip','Grass','Fire'],['hurricane','Flying','Poison']]){
   const neutral=lost(moveId,['Normal']),stab=lost(moveId,[primary]),addedOnly=lost(moveId,[added]),both=lost(moveId,[primary,added]);
   assert.equal(addedOnly,neutral,moveId+': the added '+added+' component gives its user no same-type bonus');
   assert.equal(both,stab,moveId+': '+primary+'+'+added+' gets the one '+primary+' bonus, not two');
   assert(Math.abs(stab/neutral-1.5)<0.02,moveId+': STAB is 1.5x, found '+(stab/neutral));
  }
  const whip=lost('powerwhip',['Grass']),indoor=lost('powerwhip',['Grass'],'indoor');assert(Math.abs(whip/indoor-1.95)<0.02,'move row 1.5 x Grass 1.3 = 1.95 against Indoor: '+(whip/indoor));
 });
 test('playtest Crimson Forest: Bloodlust ignores recoil, weather and status knockouts, counts a move\'s binding damage exactly as Moxie does, and pays the opposing side symmetrically',()=>{
  const foes=(extra=[{},{},{}])=>[{moves:['splash'],species:'Magikarp',...extra[0]},{moves:['splash'],species:'Magikarp',...extra[1]},{moves:['splash'],species:'Snorlax',...extra[2]}];
  const own=(extra={})=>[{moves:['tackle','earthquake','surf','splash'],species:'Mew',...extra},{moves:['splash'],species:'Blissey'},{moves:['splash'],species:'Blissey'}];
  const run=(foe,choose,prep,foeChoose='move 1, move 1',side=own())=>{const b=doubles('crimson_forest',side,foe);prep(b);play(b,choose,foeChoose);const out={atk:b.sides[0].active.map(p=>p.boosts.atk),said:said(b,'The Piglins roared for blood!'),foe:b.sides[1].active.map(p=>p.boosts.atk)};b.destroy();return out;};
  assert.deepEqual(run(foes([{moves:['doubleedge']}]),'move 4, move 1',b=>{b.sides[1].active[0].hp=1;},'move 1 1, move 1').atk,[0,0],'the foe fainted from its own recoil');
  assert.deepEqual(run(foes(),'move 4, move 1',b=>{b.field.setWeather('sandstorm',b.sides[1].active[0]);b.sides[1].active[0].hp=1;}).atk,[0,0],'weather');
  assert.deepEqual(run(foes(),'move 4, move 1',b=>{const v=b.sides[1].active[0];v.hp=1;v.setStatus('brn');}).atk,[0,0],'burn');
  assert.deepEqual(run(foes(),'move 3, move 1',b=>{for(const p of b.sides[1].active)p.hp=1;}).atk,[2,0],'one spread move, two direct knockouts');
  // A move's binding damage (Fire Spin residual) is move-caused in the simulator: Moxie reacts, and Bloodlust follows the same attribution.
  const trapped=(field,ability)=>{const b=make(field,{moves:['splash'],species:'Mew',ability},{moves:['splash'],species:'Magikarp'},{teamB:[{species:'Snorlax'}]}),[u,t]=pokemon(b);t.hp=1;t.addVolatile('partiallytrapped',u,b.dex.moves.get('firespin'));turn(b,'move 1');const out=u.boosts.atk;b.destroy();return out;};
  assert.equal(trapped('indoor','Moxie'),1,'native Moxie reacts to a Fire Spin knockout');assert.equal(trapped('crimson_forest','Synchronize'),1,'Bloodlust agrees with that attribution');assert.equal(trapped('crimson_forest','Moxie'),2,'and stacks with Moxie');
  // The opposing side earns it symmetrically: a foe that directly knocks out one of our Pokemon gets +1.
  const b=doubles('crimson_forest',[{moves:['splash'],species:'Magikarp'},{moves:['splash'],species:'Blissey'}],[{moves:['tackle','splash'],species:'Mew'},{moves:['splash'],species:'Snorlax'}]);
  b.sides[0].active[0].hp=1;play(b,'move 1, move 1','move 1 1, move 1');assert.equal(b.sides[1].active[0].boosts.atk,1);b.destroy();
 });
 test('playtest Crimson Forest: every flavor line of the specification is announced by its mechanic',()=>{
  const heard=(setup)=>{const b=setup();const out=lines(b);b.destroy();return out;};
  assert(heard(()=>{const b=make('crimson_forest',{species:'Mew',moves:['firepunch']},{species:'Snorlax'});turn(b,'move 1');return b;}).includes("The Nether's heat strengthened the attack!"));
  assert(heard(()=>{const b=make('crimson_forest',{species:'Mew',moves:['energyball']},{species:'Snorlax'});turn(b,'move 1');return b;}).includes('The crimson growth strengthened the attack!'));
  assert(heard(()=>{const b=make('crimson_forest',{species:'Mew',moves:['sludgebomb']},{species:'Snorlax'});turn(b,'move 1');return b;}).includes('The crimson spores strengthened the attack!'));
  assert(heard(()=>{const b=make('crimson_forest',{species:'Mew',moves:['bugbuzz']},{species:'Snorlax'});turn(b,'move 1');return b;}).includes('The swarm emerged from the crimson growth!'));
  assert(heard(()=>{const b=make('crimson_forest',{species:'Mew',moves:['hurricane']},{species:'Snorlax'});turn(b,'move 1');return b;}).includes('The crimson spores clung to the attack!'));
  assert(heard(()=>{const b=make('crimson_forest',{species:'Mew',moves:['acidspray']},{species:'Snorlax'});turn(b,'move 1');return b;}).includes('The crimson fumes strengthened the attack!'));
  assert(heard(()=>{const b=make('crimson_forest',{species:'Mew',moves:['powerwhip']},{species:'Snorlax'});turn(b,'move 1');return b;}).includes('Blazing vines joined the attack!'));
  assert(heard(()=>{const b=make('crimson_forest',{species:'Mew',moves:['payday']},{species:'Snorlax'});turn(b,'move 1');return b;}).includes('The Piglins scrambled for the coins!'));
  assert(heard(()=>{const b=make('crimson_forest',{species:'Mew',moves:['makeitrain']},{species:'Snorlax'});turn(b,'move 1');return b;}).includes('The Piglins went wild for the shower of gold!'));
 });

 // ---------------------------------------------------------------------------------------------- Warped Forest
 test('playtest Warped Forest: Trick Room, Magic Room, Wonder Room and Gravity last 3 to 8 turns, and an Amplifield Rock does not extend them',()=>{
  for(const mid of ['trickroom','magicroom','wonderroom','gravity']){
   const seen={plain:new Set(),rock:new Set()};
   for(let seed=1;seed<=80;seed++)for(const [label,item] of [['plain',''],['rock','Amplifield Rock']]){
    const b=make('warped_forest',{moves:[mid],item},{},{seed:[seed,2,3,4]}),[u]=pokemon(b);b.field.addPseudoWeather(mid,u,b.dex.moves.get(mid));const d=b.field.pseudoWeather[mid].duration;
    assert(d>=3 && d<=8,mid+' '+label+' duration '+d);seen[label].add(d);b.destroy();}
   assert.deepEqual([...seen.plain].sort(),[3,4,5,6,7,8],mid+' reaches every duration in the range');assert.deepEqual([...seen.rock].sort(),[3,4,5,6,7,8],mid+' with the rock keeps the same range (no +3)');
  }
 });
 test('playtest Warped Forest: a temporary replacement restores it, with weather still failing and its Leech Seed rule intact',()=>{
  const b=make('warped_forest');E.change(b,fid('glitch'),{duration:1,force:true});assert.equal(E.current(b).id,fid('glitch'));
  b.residualEvent('Residual');assert.equal(E.current(b).id,fid('warped_forest'),'restored when the clock ends');
  const [u]=pokemon(b);b.field.setWeather('raindance',u);assert.equal(b.field.weather,'','weather fails again after restoration');
  const c=make('warped_forest',{moves:['splash'],species:'Mew'},{species:'Snorlax',moves:['splash']}),[x,y]=pokemon(c);E.change(c,fid('forest'),{duration:1,force:true});E.change(c,fid('warped_forest'),{force:true});
  y.addVolatile('leechseed',x);const hp=y.hp;c.residualEvent('Residual');const lost=hp-y.hp;
  // Documented resolution: the field doubles the native 1/8 drain (the Wasteland source rule), so the amount is twice the floored eighth; against the literal quarter that is at most 1 HP less.
  assert.equal(lost,2*Math.floor(y.maxhp/8),'Leech Seed drains twice the native eighth after a field change back');assert(Math.floor(y.maxhp/4)-lost<=1 && lost<=Math.floor(y.maxhp/4),'within 1 HP of a literal quarter');b.destroy();c.destroy();
 });

 // ---------------------------------------------------------------------------------------------- Pale Garden
 test('playtest Pale Garden: the Creaking counts a damaging move that connects; misses, Protect, immunity, absorption, flinch, sleep and charging do not',()=>{
  const counts=b=>[b.rejuvenation.custom.distraction?.p1||0,b.rejuvenation.custom.distraction?.p2||0];
  const one=(label,a,t,prep=()=>{})=>{const b=make('pale_garden',{moves:['tackle'],species:'Mew',...a},{moves:['splash'],species:'Snorlax',...t});prep(b);turn(b,'move 1');const out=counts(b);b.destroy();return out;};
  assert.deepEqual(one('hit',{},{}),[1,0]);
  assert.deepEqual(one('substitute',{},{},b=>{pokemon(b)[1].addVolatile('substitute');}),[1,0],'a hit on a Substitute connects');
  assert.deepEqual(one('miss',{},{},b=>{b.randomChance=()=>false;}),[0,0],'a miss does not connect');
  assert.deepEqual(one('protect',{},{moves:['protect']}),[0,0]);assert.deepEqual(one('immune',{},{species:'Gastly',ability:'Levitate',moves:['splash']},b=>{}),[0,0],'Normal into Ghost');
  assert.deepEqual(one('absorbed',{moves:['thunderbolt']},{species:'Gastrodon',ability:'Storm Drain'}),[0,0]);
  assert.deepEqual(one('flinch',{},{},b=>{pokemon(b)[0].addVolatile('flinch');}),[0,0]);assert.deepEqual(one('asleep',{},{},b=>{const u=pokemon(b)[0];u.setStatus('slp');u.statusState.time=5;}),[0,0]);
  assert.deepEqual(one('charging',{moves:['solarbeam']},{}),[0,0]);assert.deepEqual(one('status',{moves:['growl']},{}),[0,0]);
 });
 test('playtest Pale Garden: Bewitched abilities under the new ID: Prankster, Natural Cure, Pastel Veil, Power Spot, Flower Gift, Flower Veil, Effect Spore 60%',()=>{
  const wave=field=>{const b=make(field,{species:'Mew',ability:'Prankster',moves:['thunderwave']},{species:'Umbreon',moves:['splash']});turn(b,'move 1');const out={status:pokemon(b)[1].status,immune:b.log.some(s=>s.includes('-immune'))};b.destroy();return out;};
  assert.deepEqual(wave('pale_garden'),{status:'par',immune:false},'Prankster affects Dark-types');assert.deepEqual(wave('indoor'),{status:'',immune:true},'and does not elsewhere');
  const cure=make('pale_garden',{species:'Mew',ability:'Natural Cure',moves:['splash']},{}),[c]=pokemon(cure);c.setStatus('par');cure.residualEvent('Residual');assert.equal(c.status,'','Natural Cure heals status at end of turn');cure.destroy();
  const veil=(field,ability)=>{const b=make(field,{moves:['poisonjab','ironhead'],species:'Mew'},{species:'Clefable',ability,moves:['splash']}),[u,t]=pokemon(b);const out=['poisonjab','ironhead'].map(m=>{const am=b.dex.getActiveMove(m);b.activePokemon=u;b.activeMove=am;return t.runEffectiveness(am);});b.destroy();return out;};
  assert.deepEqual(veil('pale_garden','Pastel Veil'),[0,0],'a Fairy bearer is no longer weak to Poison and Steel');assert.deepEqual(veil('pale_garden','Inner Focus'),[1,1]);assert.deepEqual(veil('indoor','Pastel Veil'),[1,1],'only in this field');
  const spot=field=>{const b=doubles(field,[{species:'Mew',moves:['tackle']},{species:'Stonjourner',ability:'Power Spot',moves:['splash']}],[{species:'Snorlax',moves:['splash']},{species:'Snorlax',moves:['splash']}]);const m=b.dex.getActiveMove('tackle');b.activeMove=m;const v=b.runEvent('BasePower',b.sides[0].active[0],b.sides[1].active[0],m,100);b.destroy();return v;};
  assert.equal(spot('pale_garden'),150,'partner move power 1.5x');assert.equal(spot('indoor'),130);
  const gift=field=>{const b=doubles(field,[{species:'Cherrim',ability:'Flower Gift',moves:['tackle']},{species:'Mew',moves:['splash']}],[{species:'Snorlax',moves:['splash']},{species:'Snorlax',moves:['splash']}]);const [ch,ally]=b.sides[0].active,t=b.sides[1].active[0],m=b.dex.getActiveMove('tackle');b.activeMove=m;
   const out=[b.runEvent('ModifyAtk',ch,t,m,100),b.runEvent('ModifySpD',ally,t,m,100)];b.destroy();return out;};
  assert.deepEqual(gift('pale_garden'),[150,150],'Flower Gift is active without sun');assert.deepEqual(gift('indoor'),[100,100]);
  const flower=field=>{const b=doubles(field,[{species:'Florges',ability:'Flower Veil',moves:['splash']},{species:'Mew',moves:['splash']}],[{species:'Snorlax',moves:['growl']},{species:'Snorlax',moves:['splash']}]);play(b,'move 1, move 1','move 1, move 1');const out=b.sides[0].active[1].boosts.atk;b.destroy();return out;};
  assert.equal(flower('pale_garden'),0,'Flower Veil protects a non-Grass ally');assert.equal(flower('indoor'),-1);
  const spore=field=>{let n=0;for(let i=0;i<400;i++){const b=make(field,{moves:['tackle'],species:'Mew'},{species:'Breloom',ability:'Effect Spore',moves:['splash']},{seed:[i+1,2,3,4]});turn(b,'move 1');if(pokemon(b)[0].status)n++;b.destroy();}return n/400;};
  const rate=spore('pale_garden');assert(rate>0.54 && rate<0.66,'Effect Spore 60%: '+rate);
 });

 // ---------------------------------------------------------------------------------------------- cross-cutting
 const dump=b=>{const mons=b.sides.flatMap(s=>s.pokemon.map(p=>({uuid:p.uuid,hp:p.hp,status:p.status,boosts:{...p.boosts},volatiles:Object.keys(p.volatiles).sort(),item:p.item,ability:p.ability,types:p.getTypes(),moves:p.moveSlots.map(m=>m.id+':'+m.pp),active:p.isActive,fainted:p.fainted})));
  const s=b.rejuvenation?{...b.rejuvenation}:null;if(s)delete s.catalog;return JSON.stringify({mons,state:s,weather:b.field.weather,pseudo:Object.keys(b.field.pseudoWeather),seed:b.prng.seed.join(),log:timeless(b),turn:b.turn});};
 const twinSetups={
  deep_dark:()=>make('deep_dark',{moves:['earthquake','calmmind','tackle','splash'],species:'Blissey'},{moves:['hyperbeam','splash'],species:'Snorlax'},{teamA:[{species:'Nidoking',ability:'Poison Point',item:'Magical Seed',moves:['splash']}],seed:[7,8,9,10]}),
  pale_garden:()=>make('pale_garden',{moves:['tackle','protect','splash'],species:'Blissey'},{moves:['tackle','splash'],species:'Snorlax'},{teamA:[{species:'Mew',item:'Magical Seed',moves:['splash']}],seed:[7,8,9,10]}),
  warped_forest:()=>make('warped_forest',{moves:['energyball','leechseed','splash'],species:'Blissey'},{moves:['trickroom','splash'],species:'Snorlax'},{teamA:[{species:'Mew',item:'Magical Seed',moves:['splash']}],seed:[7,8,9,10]}),
  crimson_forest:()=>make('crimson_forest',{moves:['quickattack','powerwhip','splash'],species:'Blissey'},{moves:['tackle','splash'],species:'Snorlax'},{teamA:[{species:'Mew',item:'Elemental Seed',moves:['splash']}],seed:[7,8,9,10]})};
 test('playtest: cached repeated previews and strategy queries leave a battle identical to an untouched twin over the following turns (no seed, resource or RNG spent)',()=>{
  for(const [field,build] of Object.entries(twinSetups)){
   const queried=build(),twin=build();
   const moves=queried.sides[0].active[0].moves.filter(m=>m!=='splash').map(m=>m);
   for(let round=0;round<3;round++){
    JSON.parse(E.evaluate(queried,moves.flatMap(m=>[{user:A,target:B,move:m,range:true},{user:A,target:B,move:m,range:true,crit:true}])));
    JSON.parse(E.strategy(queried,{user:A,candidates:[...moves.map(m=>({move:m,target:B})),{switch:id(10)}]}));
    assert.equal(dump(queried),dump(twin),field+': the queries changed nothing (round '+round+')');
   }
   const reserve=queried.sides[0].pokemon[1];assert.notEqual(reserve.item,'',field+': the reserve\'s seed is still unspent after the queries');
   for(const choice of ['move 1','move 2','move 1']){play(queried,choice,'move 1');play(twin,choice,'move 1');assert.equal(dump(queried),dump(twin),field+': real turns agree with the untouched twin ('+choice+')');}
   queried.destroy();twin.destroy();
  }
 });
 test('playtest: simultaneous custom-field battles keep separate counters, allowances and cleanup',()=>{
  const dd=make('deep_dark',{moves:['earthquake'],species:'Blissey'},{moves:['splash'],species:'Snorlax'}),pg=make('pale_garden',{moves:['tackle'],species:'Blissey'},{moves:['splash'],species:'Snorlax'}),cf=make('crimson_forest',{moves:['tackle'],species:'Mew'},{moves:['splash'],species:'Magikarp'},{teamB:[{species:'Snorlax'}]});
  turn(dd,'move 1');turn(pg,'move 1');pokemon(cf)[1].hp=1;turn(cf,'move 1');
  assert.equal(warning(dd),2);assert.deepEqual([pg.rejuvenation.custom.distraction.p1,pg.rejuvenation.custom.distraction.p2||0],[1,0]);assert.equal(pokemon(cf)[0].boosts.atk,1);
  assert.equal(warning(pg),0,'Pale Garden has no Warning');assert.equal(dd.rejuvenation.custom.distraction,undefined,'Deep Dark has no Distraction');
  dd.destroy();turn(pg,'move 1');assert.equal(pg.rejuvenation.custom.distraction.p1,2,'destroying one battle leaves the others running: the second turn adds its own tick');
  pg.destroy();cf.destroy();
  const fresh=make('deep_dark');assert.equal(warning(fresh),0,'a new battle starts clean');fresh.destroy();
 });
 test('playtest: a catalog reload leaves running custom-field battles on their own snapshot and mid-battle counters intact',()=>{
  const b=make('deep_dark',{moves:['earthquake','splash'],species:'Blissey'},{moves:['splash'],species:'Snorlax'});turn(b,'move 1');assert.equal(warning(b),2);const snapshot=b.rejuvenation.catalog;
  E.load(JSON.stringify(catalog));assert.equal(b.rejuvenation.catalog,snapshot);assert.equal(warning(b),2);
  const c=make('deep_dark');assert.notEqual(c.rejuvenation.catalog,snapshot);assert.equal(warning(c),0);turn(b,'move 1');assert.equal(warning(b),1,'the running battle keeps playing by its snapshot: 2 to 4, struck back, reset to 1');b.destroy();c.destroy();
 });
 test('playtest: switching and fainting clean per-side counters correctly, and a new field starts with zeroed counters',()=>{
  const b=doubles('pale_garden',[{moves:['tackle'],species:'Blissey'},{moves:['tackle'],species:'Blissey'}],[{moves:['splash'],species:'Chansey'},{moves:['splash'],species:'Chansey'}]);
  b.rejuvenation.custom={distraction:{p1:2,p2:1}};b.sides[0].active[0].faint();b.faintMessages();assert.deepEqual([b.rejuvenation.custom.distraction.p1,b.rejuvenation.custom.distraction.p2],[2,1],'a faint does not change a side counter');
  E.change(b,fid('forest'),{force:true});assert.equal(b.rejuvenation.custom.distraction,undefined,'leaving Pale Garden drops its state');E.change(b,fid('pale_garden'),{force:true});assert.equal(b.rejuvenation.custom.distraction?.p1||0,0,'returning starts from zero');b.destroy();
  const d=make('deep_dark',{moves:['earthquake'],species:'Blissey'},{moves:['splash'],species:'Snorlax'});turn(d,'move 1');assert.equal(warning(d),2);E.change(d,fid('forest'),{force:true});assert.equal(d.rejuvenation.counters[0],0,'leaving Deep Dark zeroes the Warning');d.destroy();
 });
};
