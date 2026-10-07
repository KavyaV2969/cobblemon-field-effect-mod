// Strategic lookahead: screening contract, simulator post-action sequence, turn boundary, chance policy,
// fingerprint memoization and complete rollback. Mechanics always come from the simulator itself.
module.exports=({test,battle,pokemon,E,fid,assert,Battle})=>{
 const A='00000000-0000-0000-0000-000000000001',B='00000000-0000-0000-0000-000000000002';
 const plan=(b,candidates,extra={})=>JSON.parse(E.strategy(b,{user:A,candidates,...extra}));
 const id=n=>'00000000-0000-0000-0000-'+String(n).padStart(12,'0');
 function teams(field,own,foe){
   // Leads are A and B as in the single-Pokemon helper; reserves follow from 3.
   const b=new Battle({formatid:'gen9customgame',seed:[1,2,3,4]});E.attach(b,fid(field));let n=2;
   const set=(v,i,lead)=>({species:'Mew',ability:'Synchronize',...v,uuid:i===0?lead:id(++n),movesInfo:v.moves.map(()=>({pp:20,maxPp:20}))});
   const mine=own.map((v,i)=>set(v,i,A)),theirs=foe.map((v,i)=>set(v,i,B));
   b.setPlayer('p1',{name:'A',team:mine});b.setPlayer('p2',{name:'B',team:theirs});
   b.choose('p1','team '+mine.map((_,i)=>i+1).join(''));b.choose('p2','team '+theirs.map((_,i)=>i+1).join(''));return b;
 }
 // Every own property in order, Set/Map order, nested state; functions only by presence.
 function deep(v,seen=new Set(),depth=0){
   if(v===null || typeof v!=='object')return typeof v==='function'?'fn':JSON.stringify(v);
   if(depth>6 || seen.has(v))return v.uuid?'@'+v.uuid:v.id!==undefined?'#'+v.id:'^';
   seen.add(v);
   try{
     if(v instanceof Set || Object.prototype.toString.call(v)==='[object Set]')return 'S['+[...v].map(x=>deep(x,seen,depth+1))+']';
     if(v instanceof Map || Object.prototype.toString.call(v)==='[object Map]')return 'M['+[...v].map(([k,x])=>deep(k,seen,depth+1)+':'+deep(x,seen,depth+1))+']';
     if(Array.isArray(v))return '['+v.map(x=>deep(x,seen,depth+1))+']';
     if(Object.isFrozen(v))return '#'+(v.id ?? v.name ?? 'frozen');
     return '{'+Object.keys(v).filter(k=>!['battle','side','foe','allySide','catalog','dex','log','prng'].includes(k)).map(k=>k+'='+deep(v[k],seen,depth+1))+'}';
   }finally{seen.delete(v);}
 }
 const fingerprint=b=>deep({own:Object.keys(b),turn:b.turn,requestState:b.requestState,ended:b.ended,field:b.field,sides:b.sides,state:b.rejuvenation,
   faintQueue:b.faintQueue,queue:b.queue.list,actions:Object.keys(b.actions),seed:b.prng.seed,log:b.log.filter(l=>!l.startsWith('|t:|'))});
 // Equality with a readable excerpt around the first difference.
 function same(actual,expected,message){
   if(actual===expected)return;let i=0;while(actual[i]===expected[i])i++;
   assert.fail(message+' at '+i+': '+JSON.stringify(expected.slice(Math.max(0,i-200),i+200))+' became '+JSON.stringify(actual.slice(Math.max(0,i-200),i+200)));
 }

 test('lookahead screening keeps ordinary, Z, Dynamax and native candidates and reports screened variants explicitly',()=>{
   const own=[{moves:['psychic','surf','growth','recover'],teraType:'Fire'},...['Scizor','Charizard','Venusaur','Gyarados','Blissey'].map(species=>({species,ability:'Pressure',moves:['tackle']}))];
   const b=teams('forest',own,[{species:'Snorlax',ability:'Thick Fat',moves:['bodyslam']}]);
   const moves=['psychic','surf','growth','recover'];
   const candidates=[...moves.map(move=>({move,target:B})),...moves.map(move=>({move,target:B,gimmick:'terastallize',native:move==='recover'})),
     ...moves.filter(m=>m!=='growth' && m!=='recover').map(move=>({move,target:B,gimmick:'dynamax'})),...[3,4,5,6,7].map(n=>({switch:id(n)}))];
   const before=fingerprint(b),r=plan(b,candidates);
   same(fingerprint(b),before,'screened plan mutated battle');
   assert(r.candidates.every(c=>!c.error),JSON.stringify(r.candidates.filter(c=>c.error)));
   const rows=r.candidates.map((c,i)=>({c,q:candidates[i]}));
   assert(rows.filter(x=>!x.q.gimmick && !x.q.switch).every(x=>!x.c.pruned),'ordinary moves are always rolled out');
   assert(rows.filter(x=>x.q.gimmick==='dynamax').every(x=>!x.c.pruned),'Dynamax variants are always rolled out');
   const tera=rows.filter(x=>x.q.gimmick==='terastallize');
   assert(!tera.find(x=>x.q.native).c.pruned,'native choice is never screened');
   assert.equal(tera.filter(x=>!x.c.pruned && !x.q.native).length,2,'two best Tera moves besides the native one');
   assert.equal(rows.filter(x=>x.q.switch && !x.c.pruned).length,2,'two best switches');
   for(const x of rows.filter(x=>x.c.pruned))assert(x.c.pruned==='screened' && x.c.screen.rank>2 && typeof x.c.screen.value==='number',JSON.stringify(x.c));
   assert.equal(r.metrics.screened,rows.filter(x=>x.c.pruned).length);
   const all=plan(b,candidates,{screen:false});assert(all.candidates.every(c=>!c.pruned && !c.error),'screen:false rolls out everything');
   b.destroy();
 });
 test('pivot moves bring in the preferred reserve through the simulator switch and entry pipeline',()=>{
   const b=teams('indoor',[{species:'Scizor',ability:'Technician',moves:['uturn','bulletpunch']},{species:'Gyarados',ability:'Intimidate',moves:['waterfall']}],
     [{species:'Snorlax',ability:'Thick Fat',moves:['bodyslam']}]);
   const before=fingerprint(b),r=plan(b,[{move:'uturn',target:B},{move:'bulletpunch',target:B}]);
   same(fingerprint(b),before,'pivot plan mutated battle');
   assert.equal(r.candidates[0].activeAfter,id(3),JSON.stringify(r.candidates[0]));assert.equal(r.candidates[1].activeAfter,A);
   b.destroy();
 });
 test('rollouts run the post-action Update event, so berries act between actions as in a real turn',()=>{
   const rows=['Sitrus Berry',''].map(item=>{
     const b=battle('indoor',{moves:['splash'],item},{species:'Snorlax',ability:'Thick Fat',moves:['bodyslam']});const [u]=pokemon(b);
     u.hp=Math.floor(u.maxhp*.55);const r=plan(b,[{move:'splash',target:B}]).candidates[0];b.destroy();return r;
   });
   assert(rows[0].userHp>rows[1].userHp,'Sitrus Berry restores HP inside the rollout: '+rows.map(r=>r.userHp));
 });
 test('the lasting matchup is measured after the simulator next-turn boundary (choice lock disables other moves)',()=>{
   const b=battle('indoor',{moves:['psychic','confusion'],item:'Choice Specs'},{species:'Snorlax',ability:'Thick Fat',moves:['splash']});
   const r=plan(b,[{move:'psychic',target:B},{move:'confusion',target:B}]);
   assert(r.candidates[1].tacticalValue<r.candidates[0].tacticalValue-.05,'locking into the weaker move loses lasting potential: '+JSON.stringify(r.candidates.map(c=>c.tacticalValue)));
   b.destroy();
 });
 test('secondary effects of the deciding move are weighted by the simulator-modified chance',()=>{
   const chance=(ability,target={})=>{
     const b=battle('indoor',{moves:['bodyslam'],ability},{species:'Snorlax',ability:'Thick Fat',moves:['splash'],...target});
     const r=plan(b,[{move:'bodyslam',target:B}]).candidates[0];b.destroy();return r;
   };
   const plain=chance('Synchronize');assert(Math.abs(plain.secondaryOutcomes?.[0].probability-.3)<1e-9,JSON.stringify(plain));
   const grace=chance('Serene Grace');assert(Math.abs(grace.secondaryOutcomes[0].probability-.6)<1e-9,JSON.stringify(grace));
   const dust=chance('Synchronize',{ability:'Shield Dust'});assert.equal(dust.secondaryOutcomes,undefined,'Shield Dust removes the branch');
 });
 test('lookahead memo is keyed by the complete state: reuse when unchanged, recomputation after side conditions or volatiles',()=>{
   const b=battle('indoor',{moves:['psychic','surf']},{species:'Snorlax',ability:'Thick Fat',moves:['bodyslam','earthquake']});
   const q=[{move:'psychic',target:B}];
   const first=plan(b,q);assert(first.metrics.damageCalls>0);
   const again=plan(b,q);assert.equal(again.metrics.damageCalls,0,'unchanged state reuses measurements');
   assert.equal(JSON.stringify(again.candidates),JSON.stringify(first.candidates),'reuse gives identical results');
   b.sides[0].addSideCondition('reflect',b.sides[0].active[0]);
   const reflect=plan(b,q);assert(reflect.metrics.damageCalls>0,'Reflect changes the measured state');
   const [u]=pokemon(b);u.addVolatile('charge');
   assert(plan(b,q).metrics.damageCalls>0,'a new volatile changes the measured state');
   b.destroy();
 });
 test('complete rollback after pivots, faints, residuals and next-turn boundaries, and identical future turns',()=>{
   const make=()=>teams('forest',[{species:'Scizor',ability:'Technician',moves:['uturn','bulletpunch','swordsdance']},{species:'Gyarados',ability:'Intimidate',moves:['waterfall']}],
     [{species:'Snorlax',ability:'Thick Fat',moves:['bodyslam','earthquake'],item:'Leftovers'},{species:'Charizard',ability:'Blaze',moves:['flamethrower']}]);
   const x=make(),y=make();const [,foe]=pokemon(x);foe.hp=1;
   const [,foeY]=pokemon(y);foeY.hp=1;
   const before=fingerprint(x);
   plan(x,[{move:'uturn',target:B},{move:'bulletpunch',target:B},{move:'swordsdance',target:B},{switch:id(3)}]);
   same(fingerprint(x),before,'state, key order, Set order and log restored');
   for(const b of [x,y])b.makeChoices('move 2','move 1');
   const log=b=>b.log.filter(l=>!l.startsWith('|t:|')).join('\n');assert.equal(log(x),log(y),'future identical');
   x.destroy();y.destroy();
 });
 test('fainted actives are replaced before the next turn, so Healing Wish field boosts and KO follow-ups are seen',()=>{
   const wish=field=>{const b=teams(field,[{moves:['healingwish']},{moves:['psychic']}],[{species:'Snorlax',ability:'Thick Fat',moves:['splash']}]);
     const r=plan(b,[{move:'healingwish',target:B}]).candidates[0];b.destroy();return r;};
   const fairy=wish('fairytale'),plain=wish('indoor');
   assert.equal(fairy.activeAfter,id(3));assert.equal(fairy.activeAfterBoosts.atk,1);assert.equal(fairy.activeAfterBoosts.spa,1);
   assert.equal(plain.activeAfterBoosts.atk,0,'Healing Wish boosts only on Fairy Tale and Starlight');
   const b=teams('indoor',[{moves:['psychic']}],[{species:'Snorlax',ability:'Thick Fat',moves:['splash']},{species:'Golem',ability:'Sturdy',moves:['splash']}]);
   pokemon(b)[1].hp=1;
   assert.equal(plan(b,[{move:'psychic',target:B}]).candidates[0].opposingAfter,id(3),'the KO brings in the reserve');b.destroy();
 });
 test('Wish and Future Sight are valued from their slot conditions and recharge turns are priced',()=>{
   const b=battle('indoor',{moves:['wish','futuresight','hyperbeam']},{species:'Snorlax',ability:'Thick Fat',moves:['splash']});
   pokemon(b)[0].hp=Math.floor(pokemon(b)[0].maxhp/2);
   const [w,f,h]=plan(b,[{move:'wish',target:B},{move:'futuresight',target:B},{move:'hyperbeam',target:B}]).candidates;
   assert(w.lasting>20,'Wish restores half the maximum HP next turn: '+w.lasting);
   assert(f.lasting>5,'a pending Future Sight on the opponent is positive: '+f.lasting);
   assert(h.lasting<=-20,'Hyper Beam forfeits the next turn: '+h.lasting);
   b.destroy();
 });
 test('entry hazards are valued by their measured, field-modified effect on the opposing reserves',()=>{
   const hazard=(field,move)=>{const b=teams(field,[{moves:[move]}],[{species:'Snorlax',ability:'Thick Fat',moves:['splash']},
     {species:'Charizard',ability:'Blaze',moves:['splash']},{species:'Golem',ability:'Sturdy',moves:['splash']}]);
     const r=plan(b,[{move,target:B}]).candidates[0];b.destroy();return r.lasting;};
   const rocks=hazard('indoor','stealthrock'),caveRocks=hazard('cave','stealthrock');
   assert(rocks>5 && caveRocks>rocks*1.5,'Stealth Rock '+rocks+' vs doubled Cave rocks '+caveRocks);
   assert(Math.abs(hazard('water_surface','spikes'))<1e-9,'Spikes fail on Water Surface');
   assert(hazard('indoor','spikes')>0);
 });
 test('two-turn moves credit the measured pending strike unless the field skips the charge',()=>{
   const two=(field,move)=>{const b=battle(field,{moves:[move]},{species:'Snorlax',ability:'Thick Fat',moves:['splash']});
     const r=plan(b,[{move,target:B}]).candidates[0];b.destroy();return r;};
   const charge=two('indoor','razorwind');assert(charge.deferred>5,'the charging turn credits the pending strike: '+JSON.stringify(charge));
   const sky=two('sky','razorwind');assert.equal(sky.deferred,0);assert(sky.immediate>charge.immediate,'Sky strikes immediately');
 });
 test('critical-hit stages raise the measured damage potential',()=>{
   const b=battle('indoor',{moves:['focusenergy','psychic']},{species:'Snorlax',ability:'Thick Fat',moves:['splash']});
   const r=plan(b,[{move:'focusenergy',target:B}]).candidates[0];assert(r.tacticalValue>0,JSON.stringify(r));b.destroy();
   const armored=battle('indoor',{moves:['focusenergy','psychic']},{species:'Snorlax',ability:'Battle Armor',moves:['splash']});
   assert(Math.abs(plan(armored,[{move:'focusenergy',target:B}]).candidates[0].tacticalValue)<1e-9,'Battle Armor blocks the gain');armored.destroy();
 });
 test('bench previews measure the benched Pokemon after its real switch-in, including field entry effects',()=>{
   const make=ability=>teams('electric_terrain',[{moves:['splash']},{moves:['psychic'],ability}],[{species:'Snorlax',ability:'Thick Fat',moves:['splash']}]);
   const bench=b=>JSON.parse(E.evaluate(b,[{user:id(3),move:'psychic',target:B,range:true,bench:true}])).results[0];
   const rod=make('Lightning Rod'),plain=make('Synchronize');
   const before=fingerprint(rod),r=bench(rod),q=bench(plain);
   same(fingerprint(rod),before,'bench evaluation mutated the battle');
   assert(!r.error && r.withField.totalMaxDamage>q.withField.totalMaxDamage,'Lightning Rod enters with +1 Sp. Atk: '+JSON.stringify([r.withField,q.withField]));
   assert.equal(r.query.bench,true);
   rod.makeChoices('switch 2','move 1');const t=rod.sides[1].active[0],hp=t.hp;rod.makeChoices('move 1','move 1');
   assert(hp-t.hp>=r.withField.totalMinDamage && hp-t.hp<=r.withField.totalMaxDamage,'real damage '+(hp-t.hp)+' within '+JSON.stringify(r.withField));
   assert(JSON.parse(E.evaluate(plain,[{user:id(3),move:'psychic',target:B,range:true,bench:true,gimmick:'terastallize'}])).results[0].error,'bench gimmicks are rejected');
   rod.destroy();plain.destroy();
 });
 test('fixed field damage rolls (Concert 1 and 4) govern previews and lookahead damage',()=>{
   for(const field of ['concert_1','concert_4']){
     const b=battle(field,{moves:['psychic']},{species:'Snorlax',ability:'Thick Fat',moves:['splash']});const [,t]=pokemon(b),before=t.hp;
     const r=JSON.parse(E.evaluate(b,[{user:A,target:B,move:'psychic',range:true}])).results[0].withField;
     assert.equal(r.totalMinDamage,r.totalMaxDamage,field+' fixed roll: '+JSON.stringify(r));
     const look=plan(b,[{move:'psychic',target:B}]).candidates[0];
     b.makeChoices('move 1','move 1');
     assert.equal(before-t.hp,r.totalMaxDamage,field+' preview equals the real damage');
     assert.equal(look.targetHp,t.hp,field+' lookahead damage equals the real damage');
     b.destroy();
   }
 });
 test('strategy decisions consume the measured field mechanic in every AI prediction category',()=>{
   const one=(field,user,foe,move,extra)=>{const b=battle(field,{moves:[move],...user},{moves:['splash'],...foe});extra?.(b);
     const r=plan(b,[{move,target:B}]).candidates[0];const [u,t]=pokemon(b);r.uMax=u.maxhp;r.tMax=t.maxhp;b.destroy();return r;};
   // Damage (pbRoughDamage/pbBetterBaseDamage): Forest strengthens Grass moves.
   const grass=one('forest',{},{},'energyball'),plainGrass=one('indoor',{},{},'energyball');
   assert(grass.immediate>plainGrass.immediate*1.3,'Forest Energy Ball '+grass.immediate+' vs '+plainGrass.immediate);
   // Accuracy (pbRoughAccuracy): Grassy Terrain sets Grass Whistle to 80, and the miss branch is weighted by it.
   const whistle=one('grassy_terrain',{},{},'grasswhistle');
   assert.equal(whistle.accuracy,80);assert(Math.abs(whistle.outcomes[0].probability-.8)<1e-9,JSON.stringify(whistle.outcomes));
   // Priority (getMovePriority): Dimensional gives Quash +1.
   assert.equal(one('dimensional',{},{},'quash').priority,1);
   // Effectiveness/immunity (pbTypeModNoMessages): Inverse lets Normal hit Ghost.
   const ghost={species:'Gengar',ability:'Cursed Body'};
   assert(one('inverse',{},ghost,'strength').targetHp<one('inverse',{},ghost,'strength').tMax,'Inverse Normal vs Ghost connects');
   assert.equal(one('indoor',{},ghost,'strength').targetHp,one('indoor',{},ghost,'strength').tMax,'native immunity');
   // Draining (getDrainAmount): Grassy Terrain makes Giga Drain restore 75% of the damage (Battle_MoveEffects.rb:5366).
   const drain=(field)=>{const r=one(field,{ability:'Levitate'},{species:'Snorlax',ability:'Levitate'},'gigadrain',b=>{pokemon(b)[0].hp=1;});return (r.userHp-1)/(r.tMax-r.targetHp);};
   assert(Math.abs(drain('grassy_terrain')-.75)<.02 && Math.abs(drain('indoor')-.5)<.02,'drain '+drain('grassy_terrain')+' vs '+drain('indoor'));
   // Speed order (buildspeedGuess): Surge Surfer on Electric Terrain outspeeds Jolteon and KOs it before it moves.
   const fast=f=>{const b=battle(f,{moves:['psychic'],ability:'Surge Surfer'},{species:'Jolteon',ability:'Volt Absorb',moves:['thunderbolt']});pokemon(b)[1].hp=1;
     const r=plan(b,[{move:'psychic',target:B}]).candidates[0];const full=pokemon(b)[0].maxhp;b.destroy();return r.userHp===full;};
   assert(fast('electric_terrain') && !fast('indoor'),'speed order follows the field');
   // Survival (notOHKO?/survivesAt1HP?): Stalwart endures a lethal hit at full HP on Colosseum.
   assert.equal(one('colosseum',{},{species:'Snorlax',level:1,ability:'Stalwart'},'psychic').targetHp,1);
   // End-of-turn HP (hpGainPerTurn): Grassy Terrain heals a grounded Pokemon.
   const heal=one('grassy_terrain',{},{},'splash',b=>{pokemon(b)[0].hp=100;});assert(heal.residual>0,'Grassy residual '+heal.residual);
   // Entry effects (pbStatChangingSwitch): the switch rollout runs entry abilities; Lightning Rod gains Sp. Atk.
   const entry=ability=>{const b=teams('electric_terrain',[{moves:['splash']},{moves:['psychic'],ability}],[{species:'Snorlax',ability:'Thick Fat',moves:['splash']}]);
     const r=plan(b,[{switch:id(3)}]);b.destroy();return r.candidates[0].tacticalValue;};
   assert(entry('Lightning Rod')>entry('Synchronize'),'Lightning Rod entry boost raises the lasting matchup');
 });
 test('a move that changes the field is valued by the source disruption rule (Battle_AI.rb:1908) in both directions',()=>{
   // Cave -> Crystal Cavern on Power Gem. Crystal Cavern favours Dragon users and Rock/Dragon opponents
   // (getFieldDisruptScore), so the same transition helps a Dragon facing Golem and hurts a Mew facing Dragonite.
   const plan2=(user,foe)=>{const b=battle('cave',{moves:['powergem','psychic'],...user},{moves:['splash'],...foe});
     const r=plan(b,[{move:'powergem',target:B},{move:'psychic',target:B}]);b.destroy();return r.candidates;};
   const good=plan2({species:'Dragonite',ability:'Inner Focus'},{species:'Golem',ability:'Sturdy'});
   assert.equal(good[0].fieldAfter,fid('crystal_cavern'),JSON.stringify(good[0]));
   assert(good[0].disruptionRatio>1 && good[0].fieldValue>0,'Crystal Cavern favours the Dragon user: '+JSON.stringify(good[0]));
   const bad=plan2({},{species:'Dragonite',ability:'Inner Focus'});
   assert(bad[0].disruptionRatio<1 && bad[0].fieldValue<0,'Crystal Cavern favours the Dragon opponent: '+JSON.stringify(bad[0]));
   assert.equal(good[1].disruptionRatio,1,'moves that keep the field are not rescaled');
 });
 test('installed gimmick resources: one Mega and one Ultra Burst per side, side-wide Tera and Z, Dynamax excludes Tera',()=>{
   // These are the rules the Run & Bun resource strategy relies on; Mega Showdown's multipleMegas only affects
   // out-of-battle ownership (MegaGimmick.hasMega), not runMegaEvo.
   const b=teams('indoor',[{species:'Charizard',ability:'Blaze',item:'Charizardite X',moves:['flamethrower']},{species:'Venusaur',ability:'Overgrow',item:'Venusaurite',moves:['gigadrain']},
     {species:'Necrozma-Dusk-Mane',ability:'Prism Armor',item:'Ultranecrozium Z',moves:['photongeyser']}],[{species:'Snorlax',ability:'Thick Fat',moves:['splash']}]);
   const [lead,ally,necro]=b.sides[0].pokemon;
   assert(lead.canMegaEvo && ally.canMegaEvo && necro.canUltraBurst,'precondition');
   b.actions.runMegaEvo(lead);
   assert.equal(ally.canMegaEvo,null,'Mega clears every ally');assert(necro.canUltraBurst,'Ultra Burst is a separate resource');
   b.destroy();
   const d=teams('indoor',[{moves:['psychic'],teraType:'Fire'},{species:'Snorlax',ability:'Thick Fat',moves:['bodyslam'],teraType:'Ghost'}],[{species:'Snorlax',ability:'Thick Fat',moves:['splash']}]);
   const [mew,lax]=d.sides[0].pokemon;
   assert(mew.canTerastallize && lax.canTerastallize);
   d.actions.terastallize(mew);assert.equal(lax.canTerastallize,null,'Tera is side-wide');
   d.destroy();
   const x=battle('indoor',{moves:['psychic'],teraType:'Fire'},{species:'Snorlax',ability:'Thick Fat',moves:['splash']});
   x.makeChoices('move 1 dynamax','move 1');const [u]=pokemon(x);
   assert(u.volatiles.dynamax && x.sides[0].dynamaxUsed && !u.canTerastallize,'runDynamax marks the side and removes Tera');
   x.destroy();
 });

 test('per-turn counters keep their consequence only where a handler in play reads them',()=>{
   // After Splash the user has been hit once more. Rage Fist reads timesAttacked, so the lasting matchup improves;
   // Drain Punch reads no per-turn counter, so the canonical matchup equals the decision-time one (a cache hit).
   const tactical=move=>{
     const b=battle('indoor',{species:'Annihilape',ability:'Defiant',moves:[move,'splash']},{species:'Mew',ability:'Synchronize',moves:['ember']});
     const out=plan(b,[{move:'splash',target:B}]);const row=out.candidates[0];b.destroy();return [row.tacticalValue,out.metrics.cacheHits];
   };
   const [rage]=tactical('ragefist'),[plain,hits]=tactical('drainpunch');
   assert(rage>0,'Rage Fist values being attacked: '+rage);
   assert.equal(plain,0,'no reader: the counter change has no lasting value');
   assert(hits>0,'the canonical matchup reuses the decision-time measurements');
 });

 test('opponent replies branch fully for the strongest contenders and the native choice; others carry the measured policy risk',()=>{
   const b=battle('indoor',{moves:['psychic','surf','thunderbolt','icebeam']},{species:'Snorlax',ability:'Thick Fat',moves:['swordsdance','bodyslam']});
   const qs=['psychic','surf','thunderbolt','icebeam'].map(move=>({move,target:B,...(move==='psychic'?{native:true}:{})}));
   const rows=plan(b,qs).candidates,full=rows.filter(r=>r.replyOutcomes),bounded=rows.filter(r=>r.replyEstimate);
   assert(full.length+bounded.length===4 && bounded.length>=1,'every candidate forecasts the setup reply: '+JSON.stringify(rows.map(r=>[r.query.move,!!r.replyOutcomes,r.replyEstimate?.measuredPolicyRisk])));
   assert(rows.find(r=>r.query.move==='psychic').replyOutcomes,'the native choice is always fully branched');
   const ranked=rows.slice().sort((x,y)=>(y.replyOutcomes?.[0].score ?? y.score+(y.replyEstimate?.measuredPolicyRisk || 0))-(x.replyOutcomes?.[0].score ?? x.score+(x.replyEstimate?.measuredPolicyRisk || 0)));
   assert(ranked.slice(0,2).every(r=>r.replyOutcomes),'the two strongest contenders (native included) are fully branched');
   assert(bounded.every(r=>r.replyEstimate.reason==='bounded contender forecast' && r.replyEstimate.measuredPolicyRisk>=0));
   const all=plan(b,qs,{screen:false}).candidates;
   assert(all.every(r=>r.replyOutcomes),'screen:false branches every reply');
   b.destroy();
 });

 test('publication warm-up runs a throwaway decision and preview without touching live battles',()=>{
   const b=battle('forest',{moves:['psychic','surf']},{species:'Snorlax',ability:'Thick Fat',moves:['bodyslam']}),before=fingerprint(b);
   const out=JSON.parse(E.warmup());
   assert(Number.isInteger(out.millis) && out.millis>=0,JSON.stringify(out));
   same(fingerprint(b),before,'live battle unchanged by the warm-up');
   assert.equal(E.battle('00000000-0000-0000-0000-000000000001'),null,'the warm-up battle is never registered');
   b.destroy();
 });
};
