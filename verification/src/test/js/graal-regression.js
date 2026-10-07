/* Portable regression examples run inside Cobblemon's shaded Graal runtime. */
(function () {
  const {Battle}=require('./sim/battle'),E=globalThis.RejuvenationEngine;
  let checks=0;
  function check(value,description){if(!value)throw Error(description);checks++;}
  function battle(field,first,second={},options={}){
    const b=new Battle({formatid:'cobblemonsingles',seed:[1,2,3,4]});E.attach(b,'rejuvenation:'+field,options);
    for(const [side,config] of [[1,first],[2,second]]){
      const pokemon={species:'Mew',ability:'Synchronize',moves:['splash'],...config};
      pokemon.uuid='00000000-0000-0000-0000-00000000000'+side;
      pokemon.movesInfo=pokemon.moves.map(()=>({pp:20,maxPp:20}));
      b.setPlayer('p'+side,{name:'Graal '+side,team:[pokemon]});
    }
    return b;
  }
  function turn(b,move){b.choose('p1','move '+move);b.choose('p2','move 1');}
  let b=battle('forest',{moves:['growth']});turn(b,1);check(b.sides[0].active[0].boosts.atk===2,'Forest Growth');b.destroy();
  b=battle('indoor',{item:'Amplifield Rock',moves:['magicroom']});turn(b,1);
  check(b.field.pseudoWeather.magicroom.duration===7,'Magic Room pre-insertion item snapshot');check(b.rejuvenation.clockOverride===undefined,'Clock snapshot cleanup');b.destroy();
  b=battle('frozen_dimension',{moves:['snowscape']});turn(b,1);
  check(b.field.weather==='hail','Snow conversion');check(b.field.weatherState.duration===7,'Weather clock');b.destroy();
  b=battle('fairytale',{species:'Aegislash',ability:'Stance Change',moves:['shadowball','kingsshield']},{species:'Blissey'});
  const initialAtk=b.sides[0].active[0].boosts.atk,initialDef=b.sides[0].active[0].boosts.def;
  turn(b,1);check(b.sides[0].active[0].boosts.atk===initialAtk+1,'Stance attack stage');check(b.sides[0].active[0].boosts.def===initialDef-1,'Stance defense stage');
  turn(b,2);check(b.sides[0].active[0].boosts.def===initialDef,'Stance restoration');b.destroy();
  b=battle('underwater',{moves:['flamethrower']});turn(b,1);
  check(b.sides[1].active[0].hp===b.sides[1].active[0].maxhp,'Forbidden type blocks actual damage');
  check(b.log.some(s=>s.includes('rejuvenationmessage')),'Forbidden type original flavor');b.destroy();
  check(b.rejuvenation===undefined,'Battle cleanup');
  b=battle('forest',{ability:'Mimicry'});
  const mimic=b.sides[0].active[0];mimic.addType('Grass');
  E.change(b,'rejuvenation:desert');
  check(mimic.types[0]==='Ground' && mimic.addedType==='Grass','Mimicry preserves added type');
  E.change(b,'rejuvenation:indoor');
  check(mimic.types[0]==='Psychic' && mimic.addedType==='Grass','Mimicry restores base type and preserves added type');b.destroy();
  b=battle('glitch',{moves:['sleeptalk','rest']});
  const sleeper=b.sides[0].active[0];sleeper.hp=Math.floor(sleeper.maxhp/2);sleeper.setStatus('slp');sleeper.statusState.time=5;turn(b,1);
  check(sleeper.hp===sleeper.maxhp,'Glitch Sleep Talk Rest heals');
  check(sleeper.status==='slp' && sleeper.statusState.time===3,'Glitch Sleep Talk Rest resets clock');b.destroy();
  for(const field of ['haunted','indoor']){b=battle(field,{moves:['destinybond']});turn(b,1);turn(b,1);check(!!b.sides[0].active[0].volatiles.destinybond===(field==='haunted'),'Consecutive Destiny Bond '+field);b.destroy();}
  b=battle('deux_finalis',{moves:['freezingglare']},{species:'Blissey',ability:'None'});const stone=b.sides[1].active[0];turn(b,1);check(stone.status==='ptr','Native move applies custom persistent Petrification');check(stone.boosts.spe===-1,'Deux Petrification residual speed');check(b.log.some(s=>s.includes('|-status|') && s.includes('|ptr')),'Canonical registered-status dispatch');b.destroy();
  b=battle('forest',{ability:'None'});const victim=b.sides[0].active[0];victim.trySetStatus('ptr',b.sides[1].active[0]);const initial=victim.hp;b.residualEvent('Residual');check(victim.hp===initial-Math.floor(victim.maxhp/8),'Petrification residual in Graal');check(!b.heal(10,victim,victim),'Petrification heal denial in Graal');victim.cureStatus();check(victim.status==='','Petrification cure in Graal');b.destroy();
  b=battle('electric_terrain',{moves:['mudsport']});turn(b,1);check(E.current(b).id==='rejuvenation:indoor','Mud Sport temporary replacement in Graal');for(let i=0;i<4;i++)b.residualEvent('Residual');check(E.current(b).id==='rejuvenation:electric_terrain','Mud Sport restoration in Graal');b.destroy();
  b=battle('new_world',{species:'Arceus',ability:'Multitype',item:'Flame Plate'});const god=b.sides[0].active[0];b.sample=values=>values.find(v=>v.type==='Dark') || values[0];b.residualEvent('Residual');const rolled=god.types[0];check(god.getTypes()[0]===rolled && rolled!=='Fire','Field form type overrides native item type in Graal');E.change(b,'rejuvenation:forest');check(god.getTypes()[0]===rolled,'Field change waits for form restoration');b.residualEvent('Residual');check(god.getTypes()[0]==='Fire' && god.species.id==='arceusfire','End-round item form restoration in Graal');b.destroy();
  b=battle('holy',{species:'Silvally',ability:'RKS System',item:'Water Memory'});check(b.sides[0].active[0].getTypes()[0]==='Dark','Holy ordinary Dark Silvally type in Graal');b.destroy();
  b=battle('glitch',{ability:'Download'});check(b.sides[0].active[0].boosts.atk===1 && b.sides[0].active[0].boosts.spa===1,'Download ordinary double offensive boost in Graal');b.destroy();
  b=battle('underwater',{species:'Cramorant',ability:'Gulp Missile'},{ability:'None'});const bird=b.sides[0].active[0],enemy=b.sides[1].active[0];bird.formeChange('cramorantgulping');enemy.setType('Fire');const hp=enemy.hp;b.singleEvent('DamagingHit',bird.getAbility(),{...bird.abilityState,target:bird},bird,enemy,b.dex.getActiveMove('tackle'),10);check(bird.species.id==='cramorant' && enemy.hp===hp-Math.floor(enemy.maxhp/2),'Underwater typed Gulp Missile retaliation in Graal');b.destroy();
  // Declared source abilities resolve through Cobblemon's registry in a real started battle.
  b=battle('factory',{ability:'Defragment',moves:['sheercold']},{species:'Alakazam',ability:'Inner Focus'});turn(b,1);
  const defrag=b.sides[0].active[0];check(defrag.ability==='defragment' && defrag.getAbility().exists,'Declared ability survives team unpacking in Graal');
  check(defrag.boosts.spd===2 && defrag.boosts.def===0,'Factory Defragment in Graal');check(b.runEvent('Accuracy',b.sides[1].active[0],defrag,b.dex.getActiveMove('fissure'),30)===true,'Defragment perfect accuracy in Graal');b.destroy();
  b=battle('forest',{ability:'Jungle Beat',moves:['energyball']},{ability:'Soundproof'});turn(b,1);
  check(b.sides[1].active[0].hp===b.sides[1].active[0].maxhp,'Jungle Beat Grass attacks are sound moves in Graal');b.destroy();
  b=battle('underwater',{ability:'tempest',moves:['weatherball']});const storm=b.sides[0].active[0];
  check(storm.getAbility().id==='tempest' && storm.getAbility().name==='Storm 9','Canonical custom ability ID and display name in Graal');
  check(Object.keys(b.rejuvenation.catalog.abilities).every(id=>b.dex.abilities.get(id).exists && b.dex.abilities.get(id).id===id),'Every declared ability resolves by its canonical source ID');
  b.field.clearWeather();b.sample=rows=>rows.find(r=>r.id==='shadowsky') || rows[0];b.singleEvent('Start',storm.getAbility(),storm.abilityState,storm);
  check(b.field.weather==='shadowsky' && b.field.weatherState.duration===8,'Forced Shadow Sky ignores restricted field in Graal');
  check(b.dex.types.get('Shadow').exists,'Registered simulator Shadow type in Graal');
  check(b.log.some(s=>s.startsWith('|-weather|ShadowSky') && s.includes('[rejuvenationsilent]')),'Custom weather context and flavor suppression marker in Graal');
  const wb=b.dex.getActiveMove('weatherball');b.runEvent('ModifyMove',storm,b.sides[1].active[0],wb,wb);check(wb.type==='Shadow' && wb.basePower===100 && wb.target==='allAdjacentFoes','Storm Weather Ball behavior in Graal');
  storm.setAbility('synchronize');check(b.field.weather==='','Weather reconciles on ability loss in Graal');b.destroy();
  // Environment layers start in the real simulator stack (as ShowdownMixin passes them) and melting restores the substrate.
  b=battle('icy',{species:'Charizard',moves:['heatwave','splash']},{},{layers:['rejuvenation:water_surface']});
  check(JSON.stringify(b.rejuvenation.stack.map(f=>f.id))===JSON.stringify(['rejuvenation:water_surface','rejuvenation:icy']),'Layered start in Graal');
  const planned=JSON.parse(E.strategy(b,{user:'00000000-0000-0000-0000-000000000001',candidates:[{move:'heatwave',target:'00000000-0000-0000-0000-000000000002'}]}));
  check(!planned.candidates[0].error && planned.candidates[0].fieldAfter==='rejuvenation:water_surface' && b.rejuvenation.stack.length===2,'Layered strategy in Graal rolls back');
  turn(b,1);check(b.rejuvenation.id==='rejuvenation:water_surface' && b.rejuvenation.stack.length===1,'Melting restores the substrate in Graal');b.destroy();
  // The custom fields attach, run their mechanics in the shaded runtime and clean up.
  for(const field of ['deep_dark','pale_garden','warped_forest','crimson_forest']){
    b=battle(field,{moves:['splash']});check(b.rejuvenation.id==='rejuvenation:'+field,'Custom field attaches in Graal: '+field);b.destroy();check(b.rejuvenation===undefined,'Custom field cleanup in Graal: '+field);
  }
  b=battle('deep_dark',{moves:['earthquake']});turn(b,1);check(b.rejuvenation.counters[0]===2,'Deep Dark Warning rises by the seismic amount in Graal');b.destroy();
  b=battle('crimson_forest',{moves:['quickattack']});
  const quick=b.dex.getActiveMove('quickattack');b.runEvent('ModifyMove',b.sides[0].active[0],b.sides[1].active[0],quick,quick);
  check(b.runEvent('Accuracy',b.sides[1].active[0],b.sides[0].active[0],quick,100)===80,'Crimson priority accuracy penalty in Graal');b.destroy();
  // Playtests of the four custom fields in the shaded runtime (counterparts of custom-playtest-regression.cjs).
  for(const [bp,expected] of [[89,0],[90,1],[149,1],[150,2]]){
    b=battle('deep_dark',{moves:['tackle'],ability:'Synchronize'},{species:'Snorlax',ability:'Thick Fat'});const user=b.sides[0].active[0],foe=b.sides[1].active[0],probe=b.dex.getActiveMove('tackle');probe.basePower=bp;
    b.actions.useMove(probe,user,foe);b.runEvent('AfterMove',user,foe,b.activeMove||probe);check(b.rejuvenation.counters[0]===expected,'Deep Dark Warning class at Base Power '+bp+' in Graal');b.destroy();
  }
  b=battle('deep_dark',{moves:['splash']});b.rejuvenation.counters[0]=3;const eye=b.dex.getActiveMove('thunderbolt');b.activeMove=eye;
  check(b.runEvent('ModifyAccuracy',b.sides[1].active[0],b.sides[0].active[0],eye,100)===90,'Deep Dark Darkness multiplies accuracy by 0.9 in Graal');b.destroy();
  b=battle('deep_dark',{moves:['earthquake']},{species:'Snorlax'});b.rejuvenation.counters[0]=2;const striker=b.sides[0].active[0],struck=b.sides[1].active[0],hpBefore=[striker.hp,struck.hp];turn(b,1);
  check(b.rejuvenation.counters[0]===1 && hpBefore[0]-striker.hp===Math.floor(striker.maxhp*0.2),'Deep Dark retaliation takes exactly 20% of maximum HP, then resets to 1, in Graal');
  check(b.log.filter(s=>s.includes('The Deep Dark struck back!')).length===1,'Deep Dark retaliation fires once in Graal');b.destroy();
  b=battle('pale_garden',{moves:['tackle']},{species:'Snorlax'});turn(b,1);check((b.rejuvenation.custom.distraction?.p1||0)===1,'Pale Garden counts a connected damaging move in Graal');b.destroy();
  b=battle('pale_garden',{moves:['tackle']},{species:'Snorlax'});b.randomChance=()=>false;turn(b,1);check((b.rejuvenation.custom.distraction?.p1||0)===0,'Pale Garden ignores a missed move in Graal');b.destroy();
  b=battle('pale_garden',{item:'Magical Seed'});const gardener=b.sides[0].active[0];check(gardener.boosts.def===6 && gardener.status==='ptr' && gardener.item==='','Pale Garden Magical Seed: Defense +6 and petrification in Graal');b.destroy();
  b=battle('warped_forest',{moves:['splash']});const warpedMon=b.sides[0].active[0];b.field.setWeather('raindance',warpedMon);check(b.field.weather==='','Warped Forest weather fails in Graal');b.destroy();
  const seenRoom=new Set();for(let seed=1;seed<=40;seed++){b=new Battle({formatid:'cobblemonsingles',seed:[seed,2,3,4]});E.attach(b,'rejuvenation:warped_forest',{});for(const side of [1,2]){const mon={species:'Mew',ability:'Synchronize',moves:['trickroom'],uuid:'00000000-0000-0000-0000-00000000000'+side,movesInfo:[{pp:20,maxPp:20}]};b.setPlayer('p'+side,{name:'Graal '+side,team:[mon]});}
    b.field.addPseudoWeather('trickroom',b.sides[0].active[0],b.dex.moves.get('trickroom'));const d=b.field.pseudoWeather.trickroom.duration;check(d>=3&&d<=8,'Warped Forest room lasts 3 to 8 turns in Graal: '+d);seenRoom.add(d);b.destroy();}
  check(seenRoom.size>=4,'Warped Forest room duration is random in Graal');
  const whipDamage=types=>{const c=battle('crimson_forest',{moves:['powerwhip']},{species:'Mew'});const u=c.sides[0].active[0],t=c.sides[1].active[0];u.setType(types);t.setType(['Normal']);c.randomizer=d=>d;const m=c.dex.getActiveMove('powerwhip');m.accuracy=true;const hp=t.hp;c.actions.useMove(m,u,t);const lost=hp-t.hp;c.destroy();return lost;};
  check(whipDamage(['Fire','Grass'])===whipDamage(['Grass']) && whipDamage(['Fire'])===whipDamage(['Normal']),'Crimson Forest added Fire component gives no extra same-type bonus in Graal');
  b=battle('crimson_forest',{species:'Gholdengo',ability:'Good as Gold'});check(b.sides[0].active[0].boosts.spe===1 && b.sides[0].active[0].boosts.spa===1,'Crimson Forest Good as Gold entry boosts in Graal');b.destroy();
  // A cached preview and a strategy query leave a real battle exactly as an untouched twin.
  const quiet=()=>battle('deep_dark',{moves:['earthquake','calmmind']},{species:'Snorlax'});const asked=quiet(),twin=quiet();
  for(let i=0;i<3;i++){E.evaluate(asked,JSON.stringify([{user:'00000000-0000-0000-0000-000000000001',target:'00000000-0000-0000-0000-000000000002',move:'earthquake',range:true}]));
   E.strategy(asked,{user:'00000000-0000-0000-0000-000000000001',candidates:[{move:'earthquake',target:'00000000-0000-0000-0000-000000000002'}]});}
  turn(asked,1);turn(twin,1);check(asked.rejuvenation.counters[0]===twin.rejuvenation.counters[0] && asked.prng.seed.join()===twin.prng.seed.join() && asked.sides[1].active[0].hp===twin.sides[1].active[0].hp,'Preview and strategy queries spend nothing in Graal');asked.destroy();twin.destroy();
  return checks;
})()
