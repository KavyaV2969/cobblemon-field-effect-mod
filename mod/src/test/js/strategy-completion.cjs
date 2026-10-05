// Remaining ordinary Battle_AI.rb intentions: explicit weights, party contexts, choices and plans.
const fs=require('node:fs'),path=require('node:path');
module.exports=({test,battle,pokemon,E,fid,assert,Battle})=>{
 const A='00000000-0000-0000-0000-000000000001',B='00000000-0000-0000-0000-000000000002',id=n=>'00000000-0000-0000-0000-'+String(n).padStart(12,'0');
 const plan=(b,moves)=>{const r=JSON.parse(E.strategy(b,{user:A,candidates:moves.map(m=>typeof m==='string'?{move:m,target:B}:m)}));assert(r.candidates.every(x=>!x.error),JSON.stringify(r));return r.candidates;};
 function teams(field,own,foe,format='gen9customgame'){
   const b=new Battle({formatid:format,seed:[1,2,3,4]});E.attach(b,fid(field));let n=2;
   const sets=(rows,lead)=>rows.map((v,i)=>({species:'Mew',ability:'Synchronize',...v,uuid:i? id(++n):lead,movesInfo:v.moves.map(()=>({pp:20,maxPp:20}))}));
   b.setPlayer('p1',{name:'A',team:sets(own,A)});b.setPlayer('p2',{name:'B',team:sets(foe,B)});
   b.choose('p1','team '+own.map((_,i)=>i+1).join(''));b.choose('p2','team '+foe.map((_,i)=>i+1).join(''));return b;
 }
 test('source move preferences influence strategic value without suppressing immediate KOs',()=>{
   for(const [field,moves,sign]of [['beach',['wildboltstorm','sandsearstorm','springtidestorm','twister','whirlpool'],-1],['glitch',['icefang'],1],
     ['volcanic_top',['outrage','thrash','petaldance'],-1],['rainbow',['snowscape'],1],['mountain',['chillyreception'],1],['rocky',['rockslide'],1]]){
     const b=battle(field,{moves},{species:'Snorlax',ability:'Thick Fat',moves:['splash']});
     for(const row of plan(b,moves))assert(row.sourceWeight*sign>0,field+' '+JSON.stringify(row));b.destroy();
   }
   const b=teams('dragons_den',[{moves:['surf','splash']},{species:'Charizard',ability:'Blaze',moves:['flamethrower']}],[{species:'Golem',ability:'Sturdy',moves:['splash']}]);
   pokemon(b)[1].hp=1;const [surf,splash]=plan(b,['surf','splash']);assert(surf.sourceWeight<0 && surf.score>splash.score,'party preservation cannot discard a winning KO');b.destroy();
 });
 test('Starlight weather strategy considers both remaining parties',()=>{
   const score=reserve=>{const b=teams('starlight',[{species:'Golem',ability:'Sturdy',moves:['raindance']}],
     [{species:'Snorlax',ability:'Thick Fat',moves:['splash']},reserve]);const r=plan(b,['raindance'])[0];b.destroy();return r;};
   const stars=score({species:'Espeon',ability:'Synchronize',moves:['psychic']}),neutral=score({species:'Snorlax',ability:'Thick Fat',moves:['bodyslam']});
   assert(stars.contextValue>neutral.contextValue,'concealing stars hurts opposing Psychic reserves: '+JSON.stringify([stars,neutral]));
 });
 test('weather and room duration value is signed and derived from actual future matchups',()=>{
   const room=item=>{const b=battle('indoor',{species:'Regice',ability:'Clear Body',moves:['wonderroom','icebeam'],item},
     {species:'Snorlax',ability:'Thick Fat',moves:['bodyslam']});const r=plan(b,['wonderroom'])[0];b.destroy();return r;};
   const extended=room('Amplifield Rock'),ordinary=room('');
   assert(extended.durationValue>ordinary.durationValue && ordinary.durationValue>0,JSON.stringify([extended,ordinary]));
   const weather=reserve=>{const b=teams('indoor',[{species:'Golem',ability:'Sturdy',moves:['raindance']},reserve],
     [{species:'Snorlax',ability:'Thick Fat',moves:['splash']}]);const r=plan(b,['raindance'])[0];b.destroy();return r;};
   const water=weather({species:'Kingdra',ability:'Swift Swim',moves:['surf']}),fire=weather({species:'Charizard',ability:'Blaze',moves:['flamethrower']});
   assert(water.contextValue>0 && fire.contextValue<0,'reserve weather utility: '+JSON.stringify([water,fire]));
 });
 test('opponent setup policy gives Taunt an actual prevention value',()=>{
   const b=battle('chess_board',{moves:['taunt','psychic']},{species:'Snorlax',ability:'Thick Fat',moves:['swordsdance','bodyslam']});
   const [taunt,attack]=plan(b,['taunt','psychic']);
   assert(taunt.replyOutcomes?.some(o=>o.reply.move==='swordsdance'),JSON.stringify(taunt));
   assert(taunt.replyOutcomes[1].score-taunt.replyOutcomes[0].score>attack.replyOutcomes[1].score-attack.replyOutcomes[0].score,'Taunt prevents the simulated setup: '+JSON.stringify([taunt,attack]));b.destroy();
 });
 test('opponent status protection is evaluated using field-specific shield mechanics',()=>{
   const shield=field=>{const b=battle(field,{moves:['hypnosis']},{species:'Aegislash',ability:'Stance Change',moves:['kingsshield','shadowball']});
     const r=plan(b,['hypnosis'])[0];b.destroy();return r;};
   const fairy=shield('fairytale'),plain=shield('indoor');
   assert(fairy.replyOutcomes?.some(o=>o.reply.move==='kingsshield') && plain.replyOutcomes?.some(o=>o.reply.move==='kingsshield'));
   assert(fairy.replyOutcomes[1].score<plain.replyOutcomes[1].score,'King’s Shield blocks status on Fairy Tale, not Indoor');
 });
 test('Sucker Punch and Upper Hand read real queued opponent choices and effective field priority',()=>{
   const b=battle('indoor',{moves:['suckerpunch']},{species:'Snorlax',ability:'Thick Fat',moves:['bodyslam']});
   assert(plan(b,['suckerpunch'])[0].targetHp<pokemon(b)[1].hp,'Sucker Punch sees the queued attack');b.destroy();
   const c=battle('chess_board',{moves:['upperhand']},{species:'Snorlax',ability:'Thick Fat',moves:['bodyslam']});
   pokemon(c)[1].rejuvenationRoles[fid('chess_board')]='king';
   const row=plan(c,['upperhand'])[0];assert(row.targetHp<pokemon(c)[1].hp,JSON.stringify(row));
   const before=pokemon(c)[1].hp;c.makeChoices('move 1','move 1');assert(pokemon(c)[1].hp<before,'actual Upper Hand also sees field priority');c.destroy();
 });
 test('field-modified speed control is consumed when forecasting the opponent turn',()=>{
   const speed=field=>{const b=battle(field,{species:'Mew',moves:['psychic'],evs:{spe:0}},{species:'Gastrodon',ability:'Sticky Hold',moves:['mudshot'],evs:{spe:144}});
     const r=plan(b,['psychic'])[0];b.destroy();return r;};
   const swamp=speed('swamp'),plain=speed('indoor');assert(swamp.tacticalValue<plain.tacticalValue,'Swamp Mud Shot changes lasting Speed/order: '+JSON.stringify([swamp,plain]));
 });
 test('locked attacks consider opposing switches under the actual field type rules',()=>{
   const b=teams('inverse',[{species:'Dragonite',ability:'Inner Focus',moves:['outrage']}],[{species:'Snorlax',ability:'Thick Fat',moves:['bodyslam']},
     {species:'Clefable',ability:'Magic Guard',moves:['moonblast']}]);
   const row=plan(b,['outrage'])[0];assert(row.replyOutcomes?.some(o=>o.reply.switch),'locked attack has a switch reply');b.destroy();
 });
 test('hazard strategy prices available phazing and respects field prevention',()=>{
   const hazard=(field,phase)=>{const b=teams(field,[{moves:phase?['stealthrock','roar']:['stealthrock']}],[{species:'Snorlax',ability:'Thick Fat',moves:['splash']},
     {species:'Charizard',ability:'Blaze',moves:['splash']}]);const r=plan(b,['stealthrock'])[0];b.destroy();return r.lasting;};
   assert(hazard('indoor',true)>hazard('indoor',false)*1.2,'successful phazing increases hazard option value');
   assert.equal(hazard('colosseum',true),hazard('colosseum',false),'Colosseum prevents phazing synergy');
 });
 test('imminent perish and field entry damage influence switching plans',()=>{
   const b=teams('deux_finalis',[{moves:['splash'],item:'Magical Seed'},{moves:['psychic']}],[{species:'Snorlax',ability:'Thick Fat',moves:['splash']}]);
   const u=pokemon(b)[0];u.addVolatile('perishsong');u.volatiles.perishsong.duration=0;
   const rows=plan(b,['splash',{switch:id(3)}]);assert(rows[1].score>rows[0].score,'switching avoids the impending seed/perish KO');b.destroy();
   const damage=field=>{const b=teams(field,[{moves:['splash']},{moves:['psychic']}],[{species:'Snorlax',ability:'Thick Fat',moves:['splash']}]);
     const r=plan(b,[{switch:id(3)}])[0];b.destroy();return r.immediate;};
   assert(damage('corrosive')<damage('indoor'),'Corrosive entry costs discourage unnecessary switching');
 });
 test('Chess king switching escapes field-created priority immunity',()=>{
   const b=teams('chess_board',[{species:'Snorlax',ability:'Thick Fat',moves:['bodyslam']},{moves:['psychic']}],
     [{species:'Tsareena',ability:'Queenly Majesty',moves:['powerwhip']}]);
   pokemon(b)[0].rejuvenationRoles[fid('chess_board')]='king';
   const [stay,leave]=plan(b,['bodyslam',{switch:id(3)}]);assert(leave.score>stay.score,JSON.stringify([stay,leave]));b.destroy();
 });
 test('main-field transition value includes opposing reserves even when disruption already rates the actives',()=>{
   const transition=reserve=>{const b=teams('cave',[{species:'Dragonite',ability:'Inner Focus',moves:['powergem']}],
     [{species:'Snorlax',ability:'Thick Fat',moves:['splash']},...reserve]);const row=plan(b,['powergem'])[0];b.destroy();return row;};
   const alone=transition([]),dragons=transition([{species:'Dragonite',ability:'Inner Focus',moves:['dragonclaw']},{species:'Goodra',ability:'Sap Sipper',moves:['dragonpulse']}]);
   assert.notEqual(alone.disruptionRatio,1);assert(dragons.fieldValue<alone.fieldValue,JSON.stringify([alone,dragons]));
 });
 test('doubles Wide Guard values the actual field-amplified spread actions',()=>{
   const b=teams('cave',[{moves:['wideguard','splash']},{species:'Golem',ability:'Sturdy',moves:['splash']}],
     [{species:'Golem',ability:'Sturdy',moves:['earthquake']},{species:'Snorlax',ability:'Thick Fat',moves:['earthquake']}],'gen9doublescustomgame');
   const [guard,plain]=plan(b,['wideguard','splash']);assert(guard.score>plain.score+5,JSON.stringify([guard,plain]));b.destroy();
 });
 test('Shadow Sky residual strategy consumes the registered field weather instead of excluding its unavailable move',()=>{
   const score=field=>{const b=battle(field,{ability:'Magic Guard',moves:['protect']},{species:'Snorlax',ability:'Thick Fat',moves:['splash']});
     const [u]=pokemon(b);b.field.setWeather('shadowsky',u,b.dex.moves.get('weatherball'));const row=plan(b,['protect'])[0];b.destroy();return row;};
   assert(score('dimensional').residual>score('indoor').residual+5,'Dimensional Shadow Sky doubles the opposing residual damage');
 });
 test('winning KOs stop before residual field damage and preserve an unnecessary Ultra Burst',()=>{
   const b=battle('volcanic',{species:'Necrozma-Dusk-Mane',ability:'Prism Armor',item:'Ultranecrozium Z',moves:['photongeyser']},{species:'Snorlax',ability:'Thick Fat',moves:['splash']});
   pokemon(b)[1].hp=1;const [normal,ultra]=plan(b,[{move:'photongeyser',target:B},{move:'photongeyser',target:B,gimmick:'ultra'}]);
   assert.equal(normal.residual,0);assert.equal(normal.score,ultra.score);b.destroy();
 });
 test('field and gimmick preview ranges match native hit pipelines at both damage-roll endpoints',()=>{
   const cases=[['mega','volcanic',{species:'Charizard',ability:'Blaze',item:'Charizardite X',moves:['flamethrower']}],
     ['ultra','starlight',{species:'Necrozma-Dusk-Mane',ability:'Prism Armor',item:'Ultranecrozium Z',moves:['photongeyser']}],
     ['zmove','concert_1',{species:'Mew',item:'Psychium Z',moves:['psychic']}],
     ['dynamax','city',{species:'Pikachu',ability:'Static',moves:['thunderbolt']}],
     ['dynamax','concert_4',{species:'Pikachu',ability:'Static',gigantamax:true,moves:['thunderbolt']}],
     ['terastallize','volcanic',{species:'Mew',ability:'Synchronize',teraType:'Fire',moves:['flamethrower']}]];
   for(const [gimmick,field,set]of cases)for(const low of [true,false]){
     const b=battle(field,set,{species:'Blissey',ability:'Battle Armor',moves:['splash']}),[u,t]=pokemon(b),move=set.moves[0];
     b.field.setWeather('sunnyday',u,b.dex.moves.get('sunnyday'));
     const q={user:A,target:B,move,gimmick,range:true},r=JSON.parse(E.evaluate(b,[q])).results[0];assert(!r.error,JSON.stringify(r));
     if(gimmick==='mega')b.actions.runMegaEvo(u);
     if(gimmick==='ultra'){u.canMegaEvo=null;b.actions.runMegaEvo(u);}
     if(gimmick==='terastallize')b.actions.terastallize(u);
     if(gimmick==='dynamax')b.runAction({choice:'runDynamax',pokemon:u});
     const nativeRandomizer=b.randomizer,fixed=['concert_1','concert_4'].includes(field);
     if(!fixed)b.randomizer=damage=>Math.floor(damage*(low?85:100)/100);
     const before=t.hp,active=b.dex.getActiveMove(move),z=gimmick==='zmove'?b.actions.getZMove(active,u):undefined,
       max=gimmick==='dynamax'?b.actions.getMaxMove(active,u).id:undefined;
     b.actions.useMove(active,u,t,null,z,max);b.runEvent('AfterMove',u,t,b.activeMove || active);
     assert.equal(before-t.hp,r.withField[low?'totalMinDamage':'totalMaxDamage'],gimmick+' '+field+' '+(low?'min':'max'));
     b.randomizer=nativeRandomizer;b.destroy();
   }
 });
 test('stochastic field power preview bounds cover every Big Top striker roll',()=>{
   for(const ability of ['Synchronize','Huge Power'])for(const stage of [0,6]){
     let bounds;
     for(let roll=0;roll<14;roll++){
       const b=battle('big_top',{ability,moves:['hammerarm']},{species:'Blissey',ability:'Battle Armor',moves:['splash']}),[u,t]=pokemon(b);u.boosts.atk=stage;
       if(!bounds)bounds=JSON.parse(E.evaluate(b,[{user:A,target:B,move:'hammerarm',range:true}])).results[0].withField;
       const random=b.random;b.random=function(n,m){return n===14 && m===undefined?roll:random.apply(this,arguments);};
       const before=t.hp;b.actions.useMove('hammerarm',u,t);
       assert(before-t.hp>=bounds.totalMinDamage && before-t.hp<=bounds.totalMaxDamage,JSON.stringify({ability,stage,roll,actual:before-t.hp,bounds}));b.destroy();
     }
   }
 });
 test('unknown random field types suppress a speculative damage range instead of displaying a seeded sample',()=>{
   const b=battle('rainbow',{moves:['judgment']},{species:'Blissey',ability:'Battle Armor',moves:['splash']});
   const r=JSON.parse(E.evaluate(b,[{user:A,target:B,move:'judgment',range:true}])).results[0];
   assert(r.withField.randomSecondaryType && r.withField.uncertainDamageRange);assert.equal(r.withField.totalMinDamage,undefined);assert.equal(r.withField.totalMaxDamage,undefined);
   const [u,t]=pokemon(b),hp=t.hp;b.sample=()=> 'Ghost';b.actions.useMove('judgment',u,t);assert.equal(t.hp,hp,'possible Ghost secondary type is immune against Normal');b.destroy();
 });
 test('ordinary strategic policy and context lookahead preserve the full future battle',()=>{
   const make=()=>teams('starlight',[{moves:['raindance','taunt']},{species:'Kingdra',ability:'Swift Swim',moves:['surf']}],
     [{species:'Snorlax',ability:'Thick Fat',moves:['curse','bodyslam']},{species:'Espeon',ability:'Synchronize',moves:['psychic']}]);
   const x=make(),y=make(),snapshot=b=>JSON.stringify({log:b.log.filter(s=>!s.startsWith('|t:|')),seed:b.prng.seed,queue:b.queue.list.length,
     mons:b.sides.flatMap(s=>s.pokemon.map(p=>[p.uuid,p.hp,p.maxhp,p.isActive,p.position,p.ability,p.item,p.status,p.getTypes(),p.boosts,Object.keys(p.volatiles)])),weather:b.field.weather,field:b.rejuvenation.id});
   const before=snapshot(x);plan(x,['raindance','taunt']);assert.equal(snapshot(x),before);
   x.makeChoices('move 1','move 1');y.makeChoices('move 1','move 1');assert.equal(snapshot(x),snapshot(y));x.destroy();y.destroy();
 });
};

// Fast focused entry point; the same cases are also part of the complete simulator suite.
if(require.main===module){
 const vm=require('node:vm'),assert=require('node:assert/strict'),{createRequire}=require('node:module');
 const root=path.resolve(__dirname,'../../../..'),requireSimulator=createRequire(path.resolve(root,'../showdown/index.js'));
 const {Battle}=requireSimulator('./sim/battle'),sandbox={require:requireSimulator,REJUVENATION_SHOWDOWN_ROOT:'./',console};vm.createContext(sandbox);
 vm.runInContext(fs.readFileSync(path.join(root,'mod/src/main/resources/rejuvenation-engine.js'),'utf8'),sandbox);
 const E=sandbox.RejuvenationEngine;E.load(fs.readFileSync(path.join(root,'research/catalog.json'),'utf8'));const fid=s=>'rejuvenation:'+s;
 const battle=(field,a={},t={})=>{const b=new Battle({formatid:'gen9customgame',seed:[1,2,3,4]});E.attach(b,fid(field));
   for(const [side,v,n]of [['p1',a,1],['p2',t,2]]){const set={species:'Mew',ability:'Synchronize',moves:['splash'],...v};set.uuid='00000000-0000-0000-0000-'+String(n).padStart(12,'0');set.movesInfo=set.moves.map(()=>({pp:20,maxPp:20}));b.setPlayer(side,{name:side,team:[set]});}
   b.choose('p1','team 1');b.choose('p2','team 1');return b;};
 let passed=0;const failures=[];const test=(name,fn)=>{try{fn();passed++;console.log('PASS '+name);}catch(e){failures.push(name);console.error('FAIL '+name,e);}};
 module.exports({test,battle,pokemon:b=>b.sides.map(s=>s.active[0]),E,fid,assert,Battle});console.log(passed+' focused strategy tests passed');if(failures.length)process.exitCode=1;
}
