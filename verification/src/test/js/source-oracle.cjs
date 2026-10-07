const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'../../../..'),profile=process.env.REJUVENATION_PROFILE||path.resolve(root,'..');
const requireSimulator=require('node:module').createRequire(path.join(profile,'showdown/index.js'));
const {Battle}=requireSimulator('./sim/battle');
const sandbox={require:requireSimulator,REJUVENATION_SHOWDOWN_ROOT:'./',console};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync(path.join(root,'core/src/main/resources/rejuvenation-engine.js'),'utf8'),sandbox);
const E=sandbox.RejuvenationEngine,catalog=JSON.parse(fs.readFileSync(path.join(root,'research/catalog.json')));
const ids=JSON.parse(fs.readFileSync(path.join(root,'research/field-id-map.json')));
E.load(JSON.stringify(catalog));
const input=JSON.parse(fs.readFileSync(0,'utf8')),differences=[];
const normalize=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
const title=s=>s[0]+s.slice(1).toLowerCase();
function pokemon(types,ability,airborne){return {
  hasType:t=>types.map(title).includes(t),isGrounded:()=>!airborne,
  hasAbility:a=>(Array.isArray(a)?a:[a]).map(normalize).includes(normalize(ability)),
};}
let i=0;
for(const [field,types,ability,airborne,weather,attacker,suppressed,category] of input.cases.defense){
  const f=catalog.fields[ids[field]],w=normalize(weather),b={rejuvenation:{id:f.id},field:{
    weather:w,isWeather:a=>!suppressed && (Array.isArray(a)?a:[a]).includes(w),
    effectiveWeather:()=>suppressed?'':w,
  }};
  const user=pokemon(types,ability,airborne),target=pokemon([],attacker,false),x={b,user,target,value:1};
  for(const r of f.rules)if(r.source?.startsWith('Battle_Field.rb:') && r.event===(category==='physical'?'defense':'specialDefense') && E.test(r.condition,x))E.runActions(r.actions,x);
  const expected=input.expected.defense[i++];
  if(Math.abs(x.value-expected)>1e-12 && differences.length<100)differences.push({kind:'defense',field,types,ability,airborne,weather,attacker,suppressed,category,expected,actual:x.value});
}
i=0;
for(const [value,mode,frenzy,online] of input.cases.multipliers){
  const c=JSON.parse(JSON.stringify(catalog));c.fields['rejuvenation:forest'].moves.tackle={multiplier:value};
  E.load(JSON.stringify(c));
  const b=new Battle({formatid:'gen9customgame'});E.attach(b,'rejuvenation:forest');
  b.rejuvenation.mode={difficultyMode:mode,fieldFrenzy:frenzy,online};
  for(const side of ['p1','p2'])b.setPlayer(side,{name:side,team:[{species:'Mew',ability:'Synchronize',moves:['tackle'],movesInfo:[{pp:35,maxPp:35}],uuid:'00000000-0000-0000-0000-00000000000'+side[1]}]});
  b.choose('p1','team 1');b.choose('p2','team 1');
  const [user,target]=[b.sides[0].active[0],b.sides[1].active[0]],move=b.dex.getActiveMove('tackle');
  const actual=b.runEvent('BasePower',user,target,move,10000),factor=input.expected.multipliers[i++];
  const expected=b.modify(10000,factor);
  if(actual!==expected && differences.length<100)differences.push({kind:'multiplier',value,mode,frenzy,online,expected,actual});
  b.destroy();
}
process.stdout.write(JSON.stringify({defenseCases:input.cases.defense.length,multiplierCases:input.cases.multipliers.length,differences}));
