// Regression repro for the Dive scoring error (fixed; see docs/KANTO_FIGHT_SIMULATION.md): prints ERR for any failed row, which the fixed engine never does.
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),profile=path.resolve(root,'..');
const req=require('module').createRequire(path.join(profile,'showdown/index.js'));
const {Battle}=req('./sim/battle'),{Dex}=req('./sim/dex');
const catalog=require('./catalog_io.cjs').load(root);
const sandbox={require:req,REJUVENATION_SHOWDOWN_ROOT:'./',console};vm.createContext(sandbox);
let src=fs.readFileSync(path.join(root,'core/src/main/resources/rejuvenation-engine.js'),'utf8').replace('error:String(error.message || error)','error:String(error.stack)');
vm.runInContext(src,sandbox);const E=sandbox.RejuvenationEngine;E.load(JSON.stringify(catalog));
const u=n=>'00000000-0000-0000-0000-'+String(n).padStart(12,'0');
const mk=(s,i)=>({...s,uuid:u(i),movesInfo:s.moves.map(m=>({pp:Dex.moves.get(m).pp,maxPp:Dex.moves.get(m).pp}))});
function run(label,foeSet,foeHp){
  const b=new Battle({formatid:'gen9customgame',seed:[1,2,3,4]});E.attach(b,'rejuvenation:water_surface');
  b.setPlayer('p1',{name:'A',team:[mk({species:'Gyarados',ability:'Intimidate',level:28,nature:'Jolly',moves:['dive','waterfall','crunch','dragondance']},1)]});
  b.setPlayer('p2',{name:'B',team:[mk(foeSet,11)]});
  if(b.requestState==='teampreview'){b.choose('p1','team 1');b.choose('p2','team 1');}
  if(foeHp) b.sides[1].active[0].hp=foeHp;
  const r=JSON.parse(E.strategy(b,{user:u(1),candidates:['dive','waterfall','crunch','dragondance'].map(m=>({user:u(1),target:u(11),move:m}))}));
  console.log(label,r.candidates.map(c=>c.query.move+':'+(c.error?'ERR':c.pruned?'pruned':c.score.toFixed(0))).join(' '));
}
run('blissey+earthquake',{species:'Blissey',ability:'Natural Cure',level:28,moves:['earthquake','splash']});
run('garchomp+splash',{species:'Garchomp',ability:'Rough Skin',level:28,moves:['splash']});
run('garchomp+earthquake',{species:'Garchomp',ability:'Rough Skin',level:28,moves:['earthquake']});
run('hippowdon',{species:'Hippowdon',ability:'Sand Stream',level:28,moves:['earthquake','slackoff']});
run('slowbro',{species:'Slowbro',ability:'Regenerator',level:28,moves:['scald','slackoff']});
run('corviknight',{species:'Corviknight',ability:'Pressure',level:28,moves:['bravebird','roost']});
run('flying-type magikarp-like: skarmory',{species:'Skarmory',ability:'Sturdy',level:28,moves:['bravebird','roost']});
run('magikarp',{species:'Magikarp',ability:'Swift Swim',level:5,moves:['splash']});
run('ferrothorn',{species:'Ferrothorn',ability:'Iron Barbs',level:28,moves:['powerwhip','leechseed']});
