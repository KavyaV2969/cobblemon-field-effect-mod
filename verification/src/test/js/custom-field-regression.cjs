// The four custom Minecraft-inspired fields: Deep Dark and Pale Garden (data audit, counters, retaliation, seeds, immunities).
// Warped Forest and Crimson Forest live in custom-fusion-regression.cjs. None of these fields has a Ruby source.
module.exports=({test,E,fid,assert,Battle,catalog,fixture})=>{
 const {make,doubles,pokemon,move,play,turn,said,lines,publicState,set,id}=fixture;
 const warning=b=>b.rejuvenation.counters[0];
 const plain=x=>JSON.parse(JSON.stringify(x));
 const fast=(b,side=0,slot=0)=>{b.sides[side].active[slot].boosts.spe=6;};
 const power=(b,u,t,moveId,v=100)=>{const m=move(b,moveId);b.activeMove=m;b.runEvent('ModifyMove',u,t,m,m);return b.runEvent('BasePower',u,t,m,v);};

 test('the catalog holds 57 original fields and 4 custom fields, each custom field distinct and marked',()=>{
  const all=Object.values(catalog.fields),custom=all.filter(f=>f.custom);
  assert.equal(all.length,61);assert.equal(custom.length,4);assert.equal(all.length-custom.length,57);
  assert.deepEqual(custom.map(f=>f.id).sort(),['rejuvenation:crimson_forest','rejuvenation:deep_dark','rejuvenation:pale_garden','rejuvenation:warped_forest']);
  assert.equal(new Set(all.map(f=>f.originalId)).size,61);
  for(const f of custom){assert(f.specification.endsWith('_Field.md'),f.id);const b=make(f.id.split(':')[1]);assert.equal(E.current(b).id,f.id);assert(b.log.some(s=>s.includes(f.entryMessage)),f.id+' entry text');b.destroy();}
  for(const f of all.filter(f=>!f.custom))assert.equal(f.mechanics,undefined,f.id+' keeps its original definition');
 });
 test('the four biomes and the required structures map to their fields; Pale Garden exists at runtime',()=>{
  const at=biome=>E.resolve({biome,dimension:'minecraft:overworld',tags:[],y:70,depth:0,skyVisible:true});
  assert.equal(at('minecraft:deep_dark'),fid('deep_dark'));assert.equal(at('minecraft:pale_garden'),fid('pale_garden'));
  assert.equal(at('minecraft:warped_forest'),fid('warped_forest'));assert.equal(at('minecraft:crimson_forest'),fid('crimson_forest'));
  assert.equal(E.resolve({biome:'minecraft:deep_dark',dimension:'minecraft:overworld',tags:[],y:-40,depth:60,skyVisible:false}),fid('deep_dark'),'Deep Dark stays Deep Dark underground');
  const rows=catalog.structures,row=key=>rows.find(r=>r.structure===key || r.tag===key)?.field;
  assert.equal(row('minecraft:ancient_city'),fid('deep_dark'));assert.equal(row('repurposed_structures:collections/ancient_cities'),fid('deep_dark'));
  assert.equal(row('minecraft:bastion_remnant'),fid('colosseum'));assert.equal(row('minecraft:fortress'),fid('colosseum'));
  assert.equal(row('repurposed_structures:collections/bastions'),fid('colosseum'));assert.equal(row('repurposed_structures:collections/fortresses'),fid('colosseum'));
  assert.equal(row('minecraft:mansion'),fid('back_alley'));assert.equal(row('minecraft:village'),fid('city'));
  for(const v of ['default_small','default_mid','default_large','dark_small','dark_mid','fighting_small','fighting_mid','fighting_large'])assert.equal(row('bca:village/'+v),fid('city'),v);
  assert.equal(row('bca:village/witch_hut'),undefined,'a swamp witch hut is not a village');
  assert.equal(rows.findIndex(r=>r.field===fid('deep_dark')),0,'Ancient City is checked before every other structure');
 });

 // ----------------------------------------------------------------------------------------------- Deep Dark
 test('Deep Dark type multipliers, hooks and Terrain Pulse follow the specification',()=>{
  const b=make('deep_dark'),[u,t]=pokemon(b);
  assert.equal(power(b,u,t,'darkpulse'),150);assert.equal(power(b,u,t,'shadowball'),150);assert.equal(power(b,u,t,'moonblast'),50);assert.equal(power(b,u,t,'stoneedge'),130);assert.equal(power(b,u,t,'earthpower'),130);assert.equal(power(b,u,t,'tackle'),100);
  const d=catalog.fields[fid('deep_dark')];assert.equal(d.mimicry,'Dark');assert.equal(d.naturePower,'darkpulse');
  let m=move(b,'terrainpulse');b.runEvent('ModifyMove',u,t,m,m);assert.equal(m.type,'Dark');assert.equal(m.basePower,100);
  m=move(b,'camouflage');b.runEvent('ModifyMove',u,t,m,m);m.onHit.call(b,u);assert(u.hasType('Dark'));
  m=move(b,'secretpower');b.runEvent('ModifyMove',u,t,m,m);assert.deepEqual(plain(m.secondaries[0].boosts),{accuracy:-1});assert.equal(typeof m.secondaries[0].onHit,'function');
  b.destroy();
 });
 test('Deep Dark Warning sources are exclusive classes: calming, explicit, sound, seismic, then resolved power',()=>{
  const gain=(moveId,{a={},t={},start=0,prep=()=>{},reserve=false}={})=>{
   const b=make('deep_dark',{moves:[moveId,'splash'],...a},{moves:['splash'],species:'Snorlax',ability:'Thick Fat',...t},{teamA:reserve?[{species:'Blissey'}]:[]});b.rejuvenation.counters[0]=start;prep(b);turn(b,'move 1');const w=warning(b);b.destroy();return w-start;};
  assert.equal(gain('tackle'),0);assert.equal(gain('thunderbolt'),1,'90 BP');assert.equal(gain('flamethrower'),1);assert.equal(gain('hyperbeam'),2,'150 BP');assert.equal(gain('blastburn'),2);
  assert.equal(gain('darkpulse'),0,'80 BP resolves below 90 before the 1.5× field and STAB boosts');assert.equal(gain('shadowball'),0);
  for(const m of ['earthquake','bulldoze','rockslide','stoneedge'])assert.equal(gain(m),2,m+': an explicit move is +2, never added to a power class');
  for(const m of ['explosion','selfdestruct'])assert.equal(gain(m,{a:{species:'Blissey'},reserve:true}),2,m+': +2 even though the user faints');
  assert.equal(gain('boomburst'),2,'140 BP in the installed simulator, +2 by its sound class and not +1+2');assert.equal(gain('hypervoice'),2,'sound flag');assert.equal(gain('screech'),2,'sound status move');assert.equal(gain('uproar'),2);
  const ill=b=>{const u=pokemon(b)[0];u.hp=Math.floor(u.maxhp/2);u.setStatus('brn');};
  for(const m of ['calmmind','meditate','flash','rest','aromatherapy','lunarblessing'])assert.equal(gain(m,{start:2,prep:ill}),-1,m);
  assert.equal(gain('calmmind',{start:0}),0,'calming at zero is a clamped no-op');
  {const b=make('deep_dark',{moves:['earthquake'],species:'Blissey',ability:'Synchronize'},{moves:['splash'],species:'Snorlax',ability:'Rattled'});b.rejuvenation.counters[0]=3;turn(b,'move 1');
   assert.equal(warning(b),1,'+2 from 3 clamps to 4, which struck back and reset');assert.equal(pokemon(b)[1].boosts.spe,0,'already in Darkness: no new crossing');assert.equal(b.log.filter(s=>s.includes('struck back')).length,1);b.destroy();}
  // Dynamic power comes from the simulator's own callback for the hit.
  assert.equal(gain('eruption',{a:{species:'Typhlosion'}}),2,'150 BP at full HP');
  assert.equal(gain('eruption',{a:{species:'Typhlosion'},prep:b=>{const u=pokemon(b)[0];u.hp=Math.floor(u.maxhp/2);}}),0,'about 75 BP at half HP');
  assert.equal(gain('lowkick',{t:{species:'Snorlax'}}),1,'120 BP against 460 kg');assert.equal(gain('lowkick',{t:{species:'Pikachu'}}),0,'20 BP against 6 kg');
  assert.equal(gain('tripleaxel'),0,'a multi-hit move counts once, by its strongest hit (60)');
  let b=doubles('deep_dark',[{moves:['surf']},{}],[{species:'Snorlax'},{species:'Snorlax'}]);play(b,'move 1, move 1','move 1, move 1');assert.equal(warning(b),1,'Surf (90 BP, spread) counts once');b.destroy();
  b=doubles('deep_dark',[{moves:['earthquake']},{}],[{species:'Snorlax'},{species:'Snorlax'}]);play(b,'move 1, move 1','move 1, move 1');assert.equal(warning(b),2,'a three-target Earthquake counts once');b.destroy();
 });
 test('Z-Moves and Max Moves classify by their own resolved power, with the impact text',()=>{
  const z=(base,item,type)=>{const b=make('deep_dark',{moves:[base],species:'Mew',item},{species:'Snorlax'}),[u,t]=pokemon(b),active=b.dex.getActiveMove(base),zm=b.actions.getZMove(active,u);assert(zm,base);
   b.actions.useMove(active,u,t,null,zm);b.runEvent('AfterMove',u,t,b.activeMove || active);const out={w:warning(b),said:said(b,'The Deep Dark trembled from the impact!')};b.destroy();return out;};
  assert.deepEqual(z('hyperbeam','Normalium Z'),{w:2,said:true});
  const max=(base)=>{const b=make('deep_dark',{moves:[base],species:'Pikachu'},{species:'Snorlax'}),[u,t]=pokemon(b);b.runAction({choice:'runDynamax',pokemon:u});const active=b.dex.getActiveMove(base),mm=b.actions.getMaxMove(active,u);
   b.actions.useMove(active,u,t,null,undefined,mm.id);b.runEvent('AfterMove',u,t,b.activeMove || active);const w=warning(b);b.destroy();return w;};
  assert(max('thunderbolt')>=1,'a Max Move is classified by its own power');
 });
 test('execution, not outcome, generates Warning: Protect, immunity, absorption and misses count; prevented and charging actions do not',()=>{
  const run=(a,t,choose='move 1',setup=()=>{})=>{const b=make('deep_dark',{moves:['earthquake','hyperbeam','thunderbolt','solarbeam','splash'],...a},{moves:['protect','splash'],species:'Snorlax',...t});setup(b);b.choose('p1',choose);b.choose('p2','move 1');const w=warning(b);b.destroy();return w;};
  assert.equal(run({},{}),2,'Protect');
  assert.equal(run({},{species:'Pidgeot',ability:'Keen Eye',moves:['splash']}),2,'a Flying target is immune to Earthquake');
  assert.equal(run({},{species:'Gastrodon',ability:'Storm Drain',moves:['splash']},'move 3'),1,'Thunderbolt into Ground immunity');
  assert.equal(run({},{ability:'Volt Absorb',moves:['splash']},'move 3'),1,'absorbed Thunderbolt');
  assert.equal(run({},{moves:['splash']},'move 2',b=>{b.randomChance=()=>false;}),2,'a missed Hyper Beam was still executed');
  assert.equal(run({},{moves:['splash']},'move 1',b=>{const u=pokemon(b)[0];u.setStatus('slp');u.statusState.time=5;}),0,'asleep: prevented before execution');
  assert.equal(run({},{moves:['splash']},'move 1',b=>{pokemon(b)[0].setStatus('par');b.randomChance=(n,d)=>n===1&&d===4;}),0,'fully paralyzed');
  assert.equal(run({},{moves:['splash']},'move 1',b=>{pokemon(b)[0].addVolatile('flinch');}),0,'flinched');
  const b=make('deep_dark',{moves:['solarbeam'],ability:'Synchronize'},{moves:['splash'],species:'Snorlax'});turn(b,'move 1');assert.equal(warning(b),0,'a charging turn is not an execution');turn(b,'move 1');assert.equal(warning(b),1,'the release turn (120 BP) is');b.destroy();
 });
 test('a called move classifies by the move that was executed',()=>{
  const call=moveId=>{const b=make('deep_dark',{moves:['sleeptalk',moveId],ability:'Synchronize'},{moves:['splash'],species:'Snorlax'});const u=pokemon(b)[0];u.setStatus('slp');u.statusState.time=5;turn(b,'move 1');const w=warning(b);b.destroy();return w;};
  assert.equal(call('earthquake'),2,'Sleep Talk calling Earthquake');assert.equal(call('tackle'),0,'Sleep Talk calling Tackle');
 });
 test('each side changes Warning once per turn; raising and calming share it; a clamped no-op does not consume it',()=>{
  const foes=()=>[{moves:['splash'],species:'Snorlax'},{moves:['splash'],species:'Snorlax'}];
  let b=doubles('deep_dark',[{moves:['earthquake'],species:'Blissey'},{moves:['earthquake'],species:'Blissey'}],foes());play(b,'move 1, move 1','move 1, move 1');assert.equal(warning(b),2,'two Earthquakes from one side change Warning once');
  play(b,'move 1, move 1','move 1, move 1');assert.equal(warning(b),1,'the next turn renews the allowance: 2 to 4 struck back and reset to 1');b.destroy();
  // Calming at zero is a no-op that leaves the allowance for the ally's raise (the calmer acts first).
  b=doubles('deep_dark',[{moves:['calmmind'],species:'Blissey'},{moves:['earthquake'],species:'Blissey'}],foes());fast(b);play(b,'move 1, move 1','move 1, move 1');assert.equal(warning(b),2,'no-op calm, then raise');b.destroy();
  // A real calm spends the allowance: the ally's raise in the same turn is ignored.
  b=doubles('deep_dark',[{moves:['calmmind'],species:'Blissey'},{moves:['earthquake'],species:'Blissey'}],foes());fast(b);b.rejuvenation.counters[0]=2;play(b,'move 1, move 1','move 1, move 1');assert.equal(warning(b),1,'calm used the side change; Earthquake changed nothing');b.destroy();
  // Opposing sides each get their own change in the same turn.
  b=make('deep_dark',{moves:['earthquake']},{moves:['hyperbeam'],species:'Snorlax'});fast(b);turn(b,'move 1');
  assert.deepEqual(plain(b.rejuvenation.custom.allow.used),{p1:true,p2:true});assert.equal(warning(b),1,'0 to 2 (side 1), then 2 to 4 (side 2), which struck back and reset to 1');assert.equal(b.log.filter(s=>s.includes('struck back')).length,1);b.destroy();
 });
 test('Warning is battlefield state: switching and fainting never reset it',()=>{
  const b=make('deep_dark',{moves:['earthquake']},{moves:['splash'],species:'Snorlax'},{teamA:[{species:'Blissey',moves:['splash']}]});turn(b,'move 1');assert.equal(warning(b),2);
  b.choose('p1','switch 2');b.choose('p2','move 1');assert.equal(warning(b),2);
  b.sides[0].active[0].faint();b.faintMessages();assert.equal(warning(b),2);b.destroy();
 });
 test('milestones are announced in order; Rattled reacts to genuine crossings only; Darkness follows Warning 3',()=>{
  const cross=(start,ability='Rattled')=>{const b=make('deep_dark',{moves:['earthquake'],ability:'Synchronize'},{moves:['splash'],species:'Snorlax',ability});b.rejuvenation.counters[0]=start;turn(b,'move 1');const out={lines:lines(b),spe:pokemon(b)[1].boosts.spe};b.destroy();return out;};
  let r=cross(0);assert.deepEqual(r.lines.filter(l=>/sculk sensor|stirred beneath/.test(l)),['A sculk sensor stirred...','Something stirred beneath the darkness...']);assert.equal(r.spe,0);
  r=cross(2);assert.equal(r.spe,1,'a jump from 2 to 4 crosses 3');assert(r.lines.indexOf('Darkness engulfed the battlefield!')<r.lines.indexOf('The earth began to tremble...'),'stage 3 precedes stage 4');assert(r.lines.some(l=>l.includes('was rattled by the ancient shriek!')));
  assert.equal(cross(3).spe,0,'3 to 4 is not a crossing');assert.equal(cross(1).spe,1,'1 to 3');assert.equal(cross(2,'Synchronize').spe,0,'no Rattled, no boost');
  const b=make('deep_dark',{moves:['earthquake','calmmind'],ability:'Synchronize',species:'Blissey'},{moves:['splash'],species:'Snorlax',ability:'Rattled'});b.rejuvenation.counters[0]=2;
  turn(b,'move 1');assert.equal(pokemon(b)[1].boosts.spe,1,'2 to 4');assert.equal(warning(b),1,'struck back and reset');
  turn(b,'move 1');assert.equal(pokemon(b)[1].boosts.spe,2,'1 to 3: it fell below 3 through the reset, so Rattled may react again');assert.equal(warning(b),3);
  turn(b,'move 2');assert.equal(warning(b),2);assert(said(b,'The darkness receded...'),'calming below 3 lifts the Darkness');
  turn(b,'move 1');assert.equal(pokemon(b)[1].boosts.spe,3,'2 to 4 crosses 3 once more after calming');b.destroy();
 });
 test('Darkness multiplies accuracy by 0.9 as a modifier, not a stat stage, with the ability exemptions',()=>{
  const acc=(w,a={})=>{const b=make('deep_dark',a),[u,t]=pokemon(b),m=move(b,'thunderbolt');b.rejuvenation.counters[0]=w;b.activeMove=m;const v=b.runEvent('ModifyAccuracy',t,u,m,100);const stage=u.boosts.accuracy;b.destroy();return [v,stage];};
  assert.deepEqual(acc(2),[100,0]);assert.deepEqual(acc(3),[90,0]);assert.deepEqual(acc(4),[90,0]);
  for(const ability of ['Keen Eye','Illuminate'])assert.equal(acc(3,{ability})[0],100,ability);
  assert.equal(acc(3,{ability:'Compound Eyes'})[0],130,'Compound Eyes keeps its own boost and ignores the penalty');
  const b=make('deep_dark'),[u,t]=pokemon(b),m=move(b,'blizzard');b.rejuvenation.counters[0]=3;b.activeMove=m;assert.equal(b.runEvent('ModifyAccuracy',t,u,m,70),63);
  assert.equal(b.runEvent('ModifyAccuracy',t,u,move(b,'aerialace'),true),true,'accuracy bypass is untouched');b.destroy();
 });
 test('Warning 4 strikes every active non-immune Pokémon for 20% maximum HP, once, then resets to 1',()=>{
  const b=doubles('deep_dark',[{moves:['earthquake'],species:'Blissey'},{species:'Chansey'}],[{species:'Snorlax',moves:['splash']},{species:'Snorlax',moves:['splash']}]);
  const mons=[...b.sides[0].active,...b.sides[1].active],before=mons.map(p=>p.hp);b.rejuvenation.counters[0]=2;play(b,'move 1, move 1','move 1, move 1');
  assert.equal(warning(b),1);assert.equal(b.rejuvenation.custom.retaliated,1,'fired during turn 1');
  for(const [i,p] of mons.entries())assert(before[i]-p.hp>=Math.floor(p.maxhp*0.2),'20% of '+p.name+' lost '+(before[i]-p.hp));
  assert.equal(b.log.filter(s=>s.includes('The Deep Dark struck back!')).length,1);assert.equal(b.log.filter(s=>s.includes('Silence returned to the Deep Dark...')).length,1);
  assert(!b.log.some(s=>s.includes('The darkness receded...')),'no duplicate end-of-Darkness text after the reset');b.destroy();
 });
 test('retaliation bypasses Substitute, Protect, Endure and Focus Sash, and can be fatal',()=>{
  const b=make('deep_dark',{moves:['earthquake'],species:'Blissey',ability:'Natural Cure'},{moves:['protect'],species:'Snorlax',item:'Focus Sash',ability:'Thick Fat'});
  const [u,t]=pokemon(b);t.addVolatile('substitute');const sub=t.volatiles.substitute.hp;b.rejuvenation.counters[0]=2;const hp=t.hp,uhp=u.hp;turn(b,'move 1');
  assert.equal(hp-t.hp,Math.floor(t.maxhp*0.2),'direct loss behind Protect and a Substitute');assert.equal(t.volatiles.substitute.hp,sub,'the Substitute was not involved');assert(uhp-u.hp>=Math.floor(u.maxhp*0.2));b.destroy();
  const f=make('deep_dark',{moves:['earthquake'],species:'Blissey'},{moves:['splash'],species:'Snorlax',item:'Focus Sash'});const [x]=pokemon(f);f.rejuvenation.counters[0]=2;x.hp=5;turn(f,'move 1');
  assert(x.fainted && x.hp===0,'fatal');assert(f.log.some(s=>s.startsWith('|faint|')));f.destroy();
 });
 test('retaliation immunities: Soundproof, Punk Rock, Solid Rock and current Ghost typing, never preventing their own Warning',()=>{
  for(const [name,mon,text]of [['Soundproof',{species:'Exploud',ability:'Soundproof'},'Soundproof shut out the sonic assault!'],['Punk Rock',{species:'Toxtricity',ability:'Punk Rock'},'endured the violent resonance!'],
   ['Solid Rock',{species:'Rhyperior',ability:'Solid Rock'},'Solid Rock absorbed the violent resonance!'],['Ghost',{species:'Gengar',ability:'Cursed Body'},'spectral form let the resonance pass through it!']]){
   const b=make('deep_dark',{moves:['earthquake'],...mon},{moves:['splash'],species:'Snorlax'});const [u,t]=pokemon(b);b.rejuvenation.counters[0]=2;const uhp=u.hp,thp=t.hp;turn(b,'move 1');
   assert.equal(u.hp,uhp,name+' is immune');assert(b.log.some(s=>s.includes(text)),name+' message');assert(thp-t.hp>=Math.floor(t.maxhp*0.2),'the foe is not');
   assert.equal(warning(b),1,name+' still raised Warning with its own move (2 to 4, then reset)');b.destroy();}
  let b=make('deep_dark',{moves:['earthquake'],species:'Snorlax',teraType:'Ghost'},{moves:['splash'],species:'Snorlax'});let u=pokemon(b)[0];b.actions.terastallize(u);assert(u.hasType('Ghost'));b.rejuvenation.counters[0]=2;let hp=u.hp;turn(b,'move 1');assert.equal(u.hp,hp,'a Ghost Tera type is immune');b.destroy();
  b=make('deep_dark',{moves:['earthquake'],species:'Gengar',ability:'Cursed Body',teraType:'Normal'},{moves:['splash'],species:'Snorlax'});u=pokemon(b)[0];b.actions.terastallize(u);assert(!u.hasType('Ghost'));b.rejuvenation.counters[0]=2;hp=u.hp;turn(b,'move 1');assert(u.hp<hp,'a Ghost that Terastallized into another type is no longer immune');b.destroy();
  b=make('deep_dark',{moves:['earthquake'],species:'Exploud',ability:'Soundproof'},{moves:['splash'],species:'Snorlax'});u=pokemon(b)[0];u.setAbility('keeneye');b.rejuvenation.counters[0]=2;hp=u.hp;turn(b,'move 1');assert(u.hp<hp,'a replaced ability no longer protects');b.destroy();
  b=make('deep_dark',{moves:['earthquake'],species:'Exploud',ability:'Soundproof'},{moves:['splash'],species:'Snorlax',ability:'Neutralizing Gas'});u=pokemon(b)[0];b.rejuvenation.counters[0]=2;hp=u.hp;turn(b,'move 1');assert(u.hp<hp,'a suppressed ability does not protect');b.destroy();
 });
 test('retaliation resolves with the action: faints share one queue, and it fires once per turn',()=>{
  const b=make('deep_dark',{moves:['earthquake'],species:'Blissey'},{moves:['splash'],species:'Magikarp'});const [u,t]=pokemon(b);b.rejuvenation.counters[0]=2;u.hp=1;t.hp=1;turn(b,'move 1');
  assert(b.ended && t.fainted && u.fainted,'both fainted together; the battle ended only after the strike');b.destroy();
  const c=make('deep_dark',{moves:['earthquake','splash'],species:'Blissey'},{moves:['hyperbeam'],species:'Snorlax'});c.rejuvenation.counters[0]=2;turn(c,'move 1');
  assert.equal(c.log.filter(s=>s.includes('struck back')).length,1,'one strike per turn');assert.equal(warning(c),3,'the second side raised the reset Warning 1 to 3 in the same turn');c.destroy();
 });
 test('a capped Warning waits for the next valid processing point instead of striking twice in one turn',()=>{
  const b=make('deep_dark',{moves:['splash'],species:'Blissey'},{moves:['splash'],species:'Snorlax'});
  b.rejuvenation.counters[0]=4;b.rejuvenation.custom={retaliated:b.turn};const from=b.log.length;
  turn(b,'move 1');assert(!b.log.slice(from).some(s=>s.includes('struck back')),'same turn: held');assert.equal(warning(b),4);
  turn(b,'move 1');assert.equal(b.log.filter(s=>s.includes('struck back')).length,1,'first processing point of the next turn');assert.equal(warning(b),1);b.destroy();
 });
 const seedBattle=extra=>{
  const b=new Battle({formatid:'gen9customgame',seed:[1,2,3,4]});E.attach(b,fid('deep_dark'));
  b.setPlayer('p1',{name:'A',team:[set({},1),set({species:'Nidoking',ability:'Poison Point',item:'Magical Seed'},3)]});b.setPlayer('p2',{name:'B',team:[set({species:'Snorlax'},2)]});
  b.choose('p1','team 12');b.choose('p2','team 1');extra?.(b);return b;
 };
 test('Magical Seed gives Soundproof in place of the original ability, then attempts +1 Warning within the side allowance',()=>{
  let b=make('deep_dark',{species:'Nidoking',ability:'Poison Point',item:'Magical Seed'},{moves:['splash'],species:'Snorlax'});const [u]=pokemon(b);
  assert.equal(u.item,'','consumed');assert(u.hasAbility('soundproof') && !u.hasAbility('poisonpoint'),'replaced, not doubled');assert.equal(warning(b),1);
  assert(said(b,"The Magical Seed muffled Nidoking's presence!"));assert(said(b,'But the disturbance stirred the sculk...'));b.destroy();
  b=seedBattle();b.rejuvenation.custom={allow:{turn:b.turn,used:{p1:true}}};b.choose('p1','switch 2');b.choose('p2','move 1');const nido=b.sides[0].active[0];
  assert(nido.hasAbility('soundproof'),'Soundproof is granted first');assert.equal(nido.item,'');assert.equal(warning(b),0,'the side had already changed Warning this turn');assert(!said(b,'But the disturbance stirred the sculk...'));
  b.choose('p1','switch 2');b.choose('p2','move 1');assert.equal(b.sides[0].pokemon.find(p=>p.species.name==='Nidoking').ability,'poisonpoint','switching out restores the original ability');b.destroy();
 });
 test('a seed that raises Warning to 4 strikes through the same pipeline',()=>{
  const b=seedBattle();b.rejuvenation.counters[0]=3;const hp=b.sides[1].active[0].hp;b.choose('p1','switch 2');b.choose('p2','move 1');
  assert.equal(warning(b),1);assert(b.sides[1].active[0].hp<hp);assert(said(b,'The Deep Dark struck back!'));b.destroy();
 });
 test('public Warning is synchronized without any team information',()=>{
  const b=make('deep_dark',{moves:['earthquake']},{moves:['splash'],species:'Snorlax'});turn(b,'move 1');const s=publicState(b);
  assert.equal(s.public.warning,2);assert.deepEqual(Object.keys(s.public),['warning']);assert.deepEqual(Object.keys(s).sort(),['counters','duration','field','overlay','overlayDuration','public','stack','substrate']);b.destroy();
 });

 // ----------------------------------------------------------------------------------------------- Pale Garden
 test('Pale Garden is Bewitched Woods plus only its explicit overrides, with self references retargeted',()=>{
  const pale=catalog.fields[fid('pale_garden')],bew=catalog.fields[fid('bewitched')];
  const retarget=v=>JSON.parse(JSON.stringify(v).replaceAll('rejuvenation:bewitched','rejuvenation:pale_garden'));
  const overridden=new Set(['id','originalId','name','entryMessage','custom','specification','seed','seedActions','mechanics','customVolatiles','rules']);
  for(const key of new Set([...Object.keys(bew),...Object.keys(pale)]))if(!overridden.has(key))assert.deepEqual(pale[key],retarget(bew[key]),'inherited '+key);
  assert.deepEqual(pale.rules.slice(0,bew.rules.length),retarget(bew.rules));assert.equal(pale.rules.length,bew.rules.length+3,'Shelter (2) and Terrain Pulse (1) only');
  assert(JSON.stringify(pale.rules).includes('"field":"rejuvenation:pale_garden"'));assert(!JSON.stringify(pale).includes('rejuvenation:bewitched'),'no leftover reference to the parent');
  assert.equal(pale.moves.purify.transition.field,fid('forest'),'Purify keeps the Bewitched destination');
 });
 test('inherited Bewitched rules work under the new ID, including those keyed to the parent field',()=>{
  const b=make('pale_garden',{species:'Blissey'},{}),[u,t]=pokemon(b);
  assert.equal(power(b,u,t,'moonblast'),180,'Fairy 1.5 × Moonblast 1.2');assert.equal(power(b,u,t,'energyball'),150);assert.equal(power(b,u,t,'hex'),150);assert.equal(power(b,u,t,'icebeam'),140);assert.equal(power(b,u,t,'crunch'),130);
  let m=move(b,'moonlight');b.runEvent('ModifyMove',u,t,m,m);assert.equal(m.heal[0]/m.heal[1],.75);
  m=move(b,'sleeppowder');b.runEvent('ModifyMove',u,t,m,m);assert.equal(m.accuracy,85);
  t.setStatus('slp');t.statusState.time=5;const hp=t.hp;b.residualEvent('Residual');assert.equal(hp-t.hp,Math.floor(t.maxhp/16),'sleeping Pokémon lose 1/16 (the rule keyed to the field ID)');assert(said(b,"dream is corrupted by the evil in the woods!"));b.destroy();
  const g=make('pale_garden',{species:'Venusaur'},{}),[v]=pokemon(g);v.hp=Math.floor(v.maxhp/2);const before=v.hp;g.residualEvent('Residual');assert.equal(v.hp-before,Math.floor(v.maxhp/16),'grounded Grass heals 1/16');g.destroy();
  const eff=(moveId,target)=>{const c=make('pale_garden',{moves:[moveId]},{species:target}),[x,y]=pokemon(c),mv=move(c,moveId);c.activePokemon=x;c.activeMove=mv;const out=y.runEffectiveness(mv);c.destroy();return out;};
  assert.equal(eff('poisonjab','Tangrowth'),0,'Poison is neutral against Grass');assert.equal(eff('moonblast','Aggron'),1,'Fairy is super effective against Steel');assert.equal(eff('moonblast','Umbreon'),0,'Fairy is neutral against Dark');
 });
 test('Creaking Distraction is per side: one damaging tick per turn, a status reset never renews it, and both doubles orders agree',()=>{
  const counts=b=>[b.rejuvenation.custom.distraction?.p1||0,b.rejuvenation.custom.distraction?.p2||0];
  const act=(b,side,slot,moveId)=>{const u=b.sides[side].active[slot],t=b.sides[1-side].active[0],m=move(b,moveId);u.moveThisTurnResult=true;b.runEvent('AfterMove',u,t,m);};
  // Damage, status, damage within one turn of one side: the reset leaves the spent tick spent.
  let b=doubles('pale_garden',[{species:'Blissey'},{species:'Blissey'}],[{species:'Blissey'},{species:'Blissey'}]);
  act(b,0,0,'tackle');assert.deepEqual(counts(b),[1,0]);act(b,0,1,'protect');assert.deepEqual(counts(b),[0,0],'a successful status move resets the side fully');
  act(b,0,0,'tackle');assert.deepEqual(counts(b),[0,0],'the reset did not refresh the turn\'s damaging tick');assert(said(b,'The marionettes froze under watchful eyes...'));
  // Status first: the tick is still available afterwards, once.
  b.rejuvenation.custom={distraction:{p1:2}};act(b,0,1,'protect');assert.deepEqual(counts(b),[0,0]);act(b,0,0,'tackle');assert.deepEqual(counts(b),[1,0],'status then damage ticks once');act(b,0,1,'tackle');assert.deepEqual(counts(b),[1,0],'only once per turn');b.destroy();
  // The same two orders in real doubles turns (the faster ally acts first).
  const real=(first,second)=>{const c=doubles('pale_garden',[{moves:['tackle','splash'],species:'Blissey'},{moves:['tackle','splash'],species:'Blissey'}],[{moves:['splash'],species:'Blissey'},{moves:['splash'],species:'Blissey'}]);
   c.rejuvenation.custom={distraction:{p1:1}};fast(c);const pick=kind=>kind==='damage'?'move 1 1':'move 2';play(c,pick(first)+', '+pick(second),'move 1, move 1');const out=counts(c);c.destroy();return out;};
  assert.deepEqual(real('damage','status'),[0,0],'damage ticks 1 to 2, then the status move resets it');assert.deepEqual(real('status','damage'),[1,0],'status resets 1 to 0, then damage ticks once');
 });
 test('the Creaking strikes the side at 3 for 40% maximum HP and resets only that side',()=>{
  const b=doubles('pale_garden',[{moves:['tackle'],species:'Blissey'},{moves:['tackle'],species:'Blissey'}],[{moves:['tackle'],species:'Chansey'},{moves:['tackle'],species:'Chansey'}]);
  b.rejuvenation.custom={distraction:{p1:2,p2:1}};const own=b.sides[0].active.map(p=>p.hp),foe=b.sides[1].active.map(p=>p.hp);
  play(b,'move 1 1, move 1 1','move 1 1, move 1 1');
  const lead=own[0]-b.sides[0].active[0].hp,partner=own[1]-b.sides[0].active[1].hp;
  assert(lead>=Math.floor(b.sides[0].active[0].maxhp*0.4),'the lead lost 40% (and may have taken the foes\' Tackles)');assert.equal(partner,Math.floor(b.sides[0].active[1].maxhp*0.4),'the partner lost exactly 40%');
  assert(foe[0]-b.sides[1].active[0].hp<Math.floor(b.sides[1].active[0].maxhp*0.4),'the other side was not struck');
  assert.deepEqual([b.rejuvenation.custom.distraction.p1,b.rejuvenation.custom.distraction.p2],[0,2],'side 1 reset, side 2 ticked once on its own');
  for(const text of ['The marionettes grow restless!','The marionettes struck from the trees!','The Creaking subsided...'])assert(said(b,text),text);b.destroy();
 });
 test('the Creaking strike ignores Substitute and faints Pokémon through the normal pipeline',()=>{
  const b=doubles('pale_garden',[{moves:['tackle'],species:'Magikarp'},{species:'Blissey'}],[{moves:['splash'],species:'Chansey'},{moves:['splash'],species:'Chansey'}]);
  const [u,ally]=b.sides[0].active;fast(b);ally.addVolatile('substitute');const sub=ally.volatiles.substitute.hp;b.rejuvenation.custom={distraction:{p1:2}};ally.hp=ally.maxhp;const hp=ally.hp;
  play(b,'move 1 1, move 1','move 1, move 1');assert.equal(hp-ally.hp,Math.floor(ally.maxhp*0.4),'direct loss through a Substitute');assert.equal(ally.volatiles.substitute.hp,sub);
  b.rejuvenation.custom={distraction:{p1:2}};ally.hp=3;play(b,'move 1 1, move 1','move 1, move 1');assert(ally.fainted,'fatal');assert(b.log.some(s=>s.startsWith('|faint|')));b.destroy();
 });
 test('Pale Garden Magical Seed: Defense +6 and petrification only; no Special Defense, no Ingrain',()=>{
  const b=make('pale_garden',{species:'Mew',item:'Magical Seed'},{});const [u]=pokemon(b);
  assert.equal(u.boosts.def,6);assert.equal(u.boosts.spd,0);assert(!u.volatiles.ingrain);assert.equal(u.status,'ptr');assert.equal(u.item,'');b.destroy();
  const c=make('pale_garden',{species:'Golem',item:'Magical Seed'},{});const [r]=pokemon(c);assert.equal(r.boosts.def,6);assert.equal(r.status,'','a Rock type cannot be petrified: ordinary status legality');c.destroy();
  const d=make('pale_garden',{species:'Mew',item:'Magical Seed'},{});const [m]=pokemon(d);d.boost({def:2},m,m);assert.equal(m.boosts.def,6,'stage cap');d.destroy();
 });
 test('Pale Garden synchronizes both public counters and Shelter halves Fairy damage to its user',()=>{
  const b=make('pale_garden',{moves:['tackle']},{moves:['splash']});turn(b,'move 1');assert.deepEqual(publicState(b).public.distraction,[1,0]);b.destroy();
  const damage=sheltered=>{const c=make('pale_garden',{moves:['splash'],species:'Mew'},{moves:['shelter','splash'],species:'Snorlax'}),[u,t]=pokemon(c);c.randomizer=d=>d;
   if(sheltered){turn(c,'move 1','move 1');assert(t.volatiles.rejuvenationshelter);}const hp=t.hp;c.actions.useMove(c.dex.getActiveMove('moonblast'),u,t);const lost=hp-t.hp;c.destroy();return lost;};
  const normal=damage(false),halved=damage(true);assert(Math.abs(halved*2-normal)<=2,'halved: '+halved+' against '+normal);
 });
};
