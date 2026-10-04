/* Portable regression examples run inside Cobblemon's shaded Graal runtime. */
(function () {
  const {Battle}=require('./sim/battle'),E=globalThis.RejuvenationEngine;
  let checks=0;
  function check(value,description){if(!value)throw Error(description);checks++;}
  function battle(field,first,second={}){
    const b=new Battle({formatid:'cobblemonsingles',seed:[1,2,3,4]});E.attach(b,'rejuvenation:'+field);
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
  return checks;
})()
