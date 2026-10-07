(function(){
 const {Battle}=require('./sim/battle');
 const E=RejuvenationEngine,receipts=[];
 function make(size){
   const b=new Battle({formatid:'cobblemonsingles',seed:[1,2,3,4]});E.attach(b,'rejuvenation:forest');let n=0;
   const set=v=>({species:'Mew',ability:'Synchronize',...v,uuid:'00000000-0000-0000-0000-'+String(++n).padStart(12,'0'),movesInfo:v.moves.map(()=>({pp:20,maxPp:20}))});
   const own=[{moves:['leafblade','surf','growth','recover'],teraType:'Water'},{species:'Scizor',ability:'Technician',moves:['bulletpunch','uturn','swordsdance','roost']},
     {species:'Charizard',ability:'Blaze',moves:['flamethrower','airslash','dragonpulse','roost']},{species:'Venusaur',ability:'Overgrow',moves:['gigadrain','sludgebomb','sleeppowder','growth']},
     {species:'Gyarados',ability:'Intimidate',moves:['waterfall','crunch','dragondance','earthquake']},{species:'Blissey',ability:'Natural Cure',moves:['seismictoss','softboiled','toxic','protect']}];
   const foe=[{species:'Snorlax',ability:'Thick Fat',moves:['bodyslam','earthquake','curse','rest']},...own.slice(1)];
   b.setPlayer('p1',{name:'A',team:own.slice(0,size).map(set)});b.setPlayer('p2',{name:'B',team:foe.slice(0,size).map(set)});
   b.choose('p1','team '+own.slice(0,size).map((_,i)=>i+1).join(''));b.choose('p2','team '+foe.slice(0,size).map((_,i)=>i+1).join(''));return b;
 }
 function decide(b){
   const user=b.sides[0].active[0],target=b.sides[1].active[0];
   const candidates=user.moveSlots.map(s=>s.id).flatMap(move=>[{move,target:target.uuid},...(user.canTerastallize?[{move,target:target.uuid,gimmick:'terastallize'}]:[])]);
   for(const p of b.sides[0].pokemon)if(!p.isActive && p.hp>0)candidates.push({switch:p.uuid});
   const start=Date.now(),result=JSON.parse(E.strategy(b,{user:user.uuid,candidates})),millis=Date.now()-start;
   if(result.candidates.some(r=>r.error))throw Error(JSON.stringify(result));
   return {candidates:candidates.length,millis,...result.metrics};
 }
 // Single decisions on a fresh battle (no reuse) for one- and six-member teams.
 for(const size of [1,6]){const b=make(size);receipts.push({teamSize:size,...decide(b)});b.destroy();}
 // Three consecutive turns of one six-member battle, as live play makes them (reuse across decisions).
 const b=make(6);
 for(let turn=1;turn<=3;turn++){receipts.push({teamSize:6,turn,...decide(b)});b.makeChoices('move 1','move 1');}
 b.destroy();
 // Worst-case doubles lead as the Run & Bun adapter submits it: every move at every legal target (allies included),
 // every gimmick the request offers (Mega and Tera here) and every switch.
 const d=new Battle({formatid:'cobblemondoubles',seed:[1,2,3,4]});E.attach(d,'rejuvenation:forest');let n=0;
 const set=v=>({...v,uuid:'00000000-0000-0000-0000-1'+String(++n).padStart(11,'0'),movesInfo:v.moves.map(()=>({pp:20,maxPp:20}))});
 const reserves=[{species:'Scizor',ability:'Technician',moves:['bulletpunch','uturn','swordsdance','roost']},{species:'Venusaur',ability:'Overgrow',moves:['gigadrain','sludgebomb','sleeppowder','growth']},
   {species:'Gyarados',ability:'Intimidate',moves:['waterfall','crunch','dragondance','earthquake']},{species:'Blissey',ability:'Natural Cure',moves:['seismictoss','softboiled','toxic','protect']}];
 d.setPlayer('p1',{name:'A',team:[{species:'Charizard',ability:'Blaze',item:'Charizardite Y',moves:['flamethrower','airslash','solarbeam','roost'],teraType:'Fire'},
   {species:'Snorlax',ability:'Thick Fat',moves:['bodyslam','earthquake','curse','rest']},...reserves].map(set)});
 d.setPlayer('p2',{name:'B',team:[{species:'Garchomp',ability:'Rough Skin',moves:['earthquake','dragonclaw','swordsdance','protect']},
   {species:'Rotom-Wash',ability:'Levitate',moves:['hydropump','voltswitch','willowisp','protect']},...reserves].map(set)});
 d.choose('p1','team 123456');d.choose('p2','team 123456');
 const lead=d.sides[0].active[0],request=d.sides[0].activeRequest.active[0],candidates=[];
 for(const slot of lead.moveSlots){
   const single=['normal','any','adjacentFoe','adjacentAlly','adjacentAllyOrSelf'].includes(d.dex.moves.get(slot.id).target);
   for(const target of single?d.getAllActive().filter(p=>p!==lead):[d.sides[1].active[0]])for(const gimmick of ['',...(request.canMegaEvo?['mega']:[]),...(request.canTerastallize?['terastallize']:[])])
     candidates.push({move:slot.id,target:target.uuid,...(gimmick?{gimmick}:{})});
 }
 for(const p of d.sides[0].pokemon)if(!p.isActive)candidates.push({switch:p.uuid});
 const start=Date.now(),result=JSON.parse(E.strategy(d,{user:lead.uuid,candidates})),millis=Date.now()-start;
 if(result.candidates.some(r=>r.error))throw Error(JSON.stringify(result));
 receipts.push({teamSize:6,doubles:true,candidates:candidates.length,millis,...result.metrics});
 d.destroy();
 return JSON.stringify(receipts);
})()
