const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),{createRequire}=require('node:module');
const root=path.resolve(__dirname,'../../..'),req=createRequire(path.join(root,'showdown/index.js')),sandbox={require:req,REJUVENATION_SHOWDOWN_ROOT:'./',console};vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(path.join(root,'rejuvenation/mod/src/main/resources/rejuvenation-engine.js'),'utf8'),sandbox);
const E=sandbox.RejuvenationEngine;E.load(fs.readFileSync(path.join(root,'rejuvenation/research/catalog.json'),'utf8'));
const {Battle}=req('./sim/battle'),A='00000000-0000-0000-0000-000000000001',B='00000000-0000-0000-0000-000000000002';
const b=new Battle({formatid:'gen9customgame',seed:[1,2,3,4]});E.attach(b,'rejuvenation:volcanic');
for(const [side,set]of [['p1',{species:'Necrozma-Dusk-Mane',ability:'Prism Armor',item:'Ultranecrozium Z',moves:['photongeyser'],uuid:A}],['p2',{species:'Snorlax',ability:'Thick Fat',moves:['splash'],uuid:B}]])b.setPlayer(side,{name:side,team:[{...set,movesInfo:set.moves.map(()=>({pp:20,maxPp:20}))}]});
b.choose('p1','team 1');b.choose('p2','team 1');b.sides[1].active[0].hp=1;
console.log(E.strategy(b,{user:A,candidates:[{move:'photongeyser',target:B},{move:'photongeyser',target:B,gimmick:'ultra'}]}));b.destroy();
