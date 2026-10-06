const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');const simulator=path.join(root,'..','showdown');
const {createRequire}=require('node:module');const req=createRequire(path.join(simulator,'index.js'));const {Battle}=req('./sim/battle');
const sandbox={require:req,REJUVENATION_SHOWDOWN_ROOT:'./',console};vm.createContext(sandbox);vm.runInContext(fs.readFileSync(path.join(root,'mod/src/main/resources/rejuvenation-engine.js'),'utf8'),sandbox);
const E=sandbox.RejuvenationEngine;E.load(fs.readFileSync(path.join(root,'research/catalog.json'),'utf8'));
module.exports={E,Battle,battle(field,a={},t={}){const b=new Battle({formatid:'gen9customgame',seed:[1,2,3,4]});E.attach(b,'rejuvenation:'+field);
 const set=(v,uuid)=>{v.uuid=uuid;v.movesInfo=v.moves.map(()=>({pp:20,maxPp:20}));return v;};
 b.setPlayer('p1',{name:'A',team:[set({species:'Mew',ability:'Synchronize',moves:['psychic'],...a},'00000000-0000-0000-0000-000000000001')]});
 b.setPlayer('p2',{name:'B',team:[set({species:'Mew',ability:'Synchronize',moves:['splash'],...t},'00000000-0000-0000-0000-000000000002')]});
 b.choose('p1','team 1');b.choose('p2','team 1');return b;}};
if(require.main===module){
 const {battle}=module.exports;const b=battle('electric_terrain',{moves:['thunderbolt'],item:'Wacan Berry'},{species:'Charizard',moves:['flamethrower'],item:'Wacan Berry'});
 const p=b.sides[0].active[0];console.log('before',p.itemState,Object.getPrototypeOf(p.itemState)===Object.prototype,Object.isFrozen(p.itemState));
 const ref=p.itemState;
 E.evaluate(b,JSON.stringify([{user:'00000000-0000-0000-0000-000000000001',move:'thunderbolt',target:'00000000-0000-0000-0000-000000000002'}]));
 console.log('after',p.itemState,p.itemState===ref);
}
