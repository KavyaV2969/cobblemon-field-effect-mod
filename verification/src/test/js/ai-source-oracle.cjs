// Ruby oracle for the generated source-AI ports: the original Battle_AI.rb methods (getFieldDisruptScore and the
// getSwitchInScoresParty affinity table) run on synthetic matchups and must equal the JavaScript ports exactly.
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process');
module.exports=({test,skip,E,assert,Battle,root,receipt})=>{
 // The original scripts: REJUVENATION_SCRIPTS, REJUVENATION_REFERENCE/Scripts, or a sibling "Rejuvenation 14 copy" folder.
 const scripts=[process.env.REJUVENATION_SCRIPTS,process.env.REJUVENATION_REFERENCE&&path.join(process.env.REJUVENATION_REFERENCE,'Scripts'),path.join(root,'Rejuvenation 14 copy','Scripts'),path.join(root,'..','Rejuvenation 14 copy','Scripts')]
  .find(c=>c && fs.existsSync(path.join(c,'Battle_AI.rb')));
 const testName='generated getFieldDisruptScore and switch-in affinity ports equal the original Ruby methods';
 if(!scripts){skip(testName,'the original Rejuvenation scripts are not available (set REJUVENATION_REFERENCE); this check was NOT executed');return;}
 const fields=Object.keys(JSON.parse(fs.readFileSync(path.join(root,'research/field-id-map.json'),'utf8')));
 const TYPES=['Normal','Fire','Water','Electric','Grass','Ice','Fighting','Poison','Ground','Flying','Psychic','Bug','Rock','Ghost','Dragon','Dark','Steel','Fairy'];
 const symbols=(file,key)=>[...new Set(JSON.parse(fs.readFileSync(path.join(root,file),'utf8')).rules.flatMap(r=>[...r.condition.matchAll(/:([A-Z]{3,})/g)].map(m=>m[1].toLowerCase())))];
 const disruptionWords=symbols('research/ai-disruption-source.json'),affinityWords=symbols('research/ai-affinity-source.json');
 // Deterministic generator (no Math.random), so receipts are reproducible.
 let seed=20261005;const rnd=n=>{seed=(seed*1103515245+12345)%2147483648;return seed%n;};
 const pick=a=>a[rnd(a.length)],some=(a,k)=>Array.from({length:rnd(k+1)},()=>pick(a));
 const types=()=>[...new Set([pick(TYPES),...(rnd(2)?[pick(TYPES)]:[])])];
 const mon=words=>({types:types(),ability:rnd(3)?pick(words):'pressure',atk:50+rnd(200),spa:50+rnd(200),spd:50+rnd(200),def:50+rnd(200),
   speed:20+rnd(300),hp:1+rnd(300),maxhp:300,moves:some(words,3),airborne:!!rnd(2),roles:rnd(5)?[]:[pick(['SPECIALWALL','PHYSICALWALL'])],
   protect:!rnd(6),skyDrop:!rnd(9),semiInvulnerable:!rnd(6)});
 const disruption=[];
 for(let i=0;i<10000;i++){
   const view={attacker:mon(disruptionWords),opponent:mon(disruptionWords),opponentPartner:rnd(3)?null:mon(disruptionWords),
     partyTypes:[...new Set(some(TYPES,4))],weather:pick(['','sunnyday','raindance','sandstorm','hail','snow']),counter:rnd(3),
     opponentReserves:rnd(4),attackerFaster:!!rnd(2)};
   disruption.push({view,field:fields[i%fields.length],overlay:!rnd(4),violent:!rnd(4)});
 }
 // Affinity runs on real simulator Pokemon: one singles and one doubles battle whose lead is reconfigured per case.
 // The affinity port deliberately reads the source's misspelled :PERSIHBODY (Battle_AI.rb, Dimensional/Infernal)
 // as Perish Body. The oracle therefore receives the misspelling wherever the port receives Perish Body.
 const affinityWords2=[...new Set(affinityWords.filter(a=>!['cloudnine','airlock'].includes(a)).map(a=>a==='persihbody'?'perishbody':a))];
 const sourceSpelling=a=>a==='perishbody'?'persihbody':a;
 const affinity=[];
 // Abilities are drawn mostly from the rules of the field under test, so the table's branches are exercised.
 const affinityRules=JSON.parse(fs.readFileSync(path.join(root,'research/ai-affinity-source.json'),'utf8')).rules;
 const fieldWords=field=>{const own=affinityRules.filter(r=>r.field===':'+field || (r.field.startsWith('*PBFields::') && field.startsWith(r.field.slice(11))))
   .flatMap(r=>[...r.condition.matchAll(/:([A-Z]{3,})/g)].map(m=>m[1].toLowerCase())).filter(a=>affinityWords2.includes(a==='persihbody'?'perishbody':a)).map(a=>a==='persihbody'?'perishbody':a);
   return own.length?own:affinityWords2;};
 for(let i=0;i<6000;i++){const field=fields[i%fields.length],words=rnd(4)?fieldWords(field):affinityWords2;
   affinity.push({field,mon:{types:types(),ability:pick(words)},base:rnd(4)?null:{ability:pick(words)},
   view:{weather:pick(['','raindance','sunnyday','hail','snow','sandstorm']),doubles:!!rnd(2)}});}
 const run=spawnSync(process.env.RUBY||'ruby',[path.join(root,'research/ai_source_oracle.rb'),scripts],{input:JSON.stringify({disruption,affinity:affinity.map(r=>({...r,mon:{...r.mon,ability:sourceSpelling(r.mon.ability)},base:r.base?{...r.mon,ability:sourceSpelling(r.base.ability)}:null}))}),encoding:'utf8',maxBuffer:1<<26});
 const ruby=run.status===0?JSON.parse(run.stdout):null;
 const battles={};
 const battleFor=doubles=>{
   if(battles[doubles])return battles[doubles];
   const b=new Battle({formatid:doubles?'gen9doublescustomgame':'gen9customgame',seed:[1,2,3,4]});E.attach(b,'rejuvenation:indoor');
   const set=uuid=>({species:'Mew',ability:'Synchronize',moves:['splash'],movesInfo:[{pp:20,maxPp:20}],uuid});
   const team=n=>Array.from({length:doubles?2:1},(_,i)=>set('00000000-0000-0000-0000-00000000000'+(n*2+i+1)));
   b.setPlayer('p1',{name:'A',team:team(0)});b.setPlayer('p2',{name:'B',team:team(1)});
   b.choose('p1','team '+(doubles?'12':'1'));b.choose('p2','team '+(doubles?'12':'1'));
   return battles[doubles]=b;
 };
 const portAffinity=row=>{
   const b=battleFor(row.view.doubles),p=b.sides[0].active[0];
   p.setType(row.mon.types);p.ability=row.mon.ability;p.baseAbility=row.base?.ability ?? row.mon.ability;
   b.field.weather=row.view.weather;b.field.weatherState={id:row.view.weather};
   return E.sourceAffinity(b,p.uuid,row.field)*100;
 };
 test('generated getFieldDisruptScore and switch-in affinity ports equal the original Ruby methods',()=>{
   assert(ruby,'Ruby oracle failed: '+run.stderr+run.error);
   const differ=[];
   disruption.forEach((row,i)=>{const js=E.sourceDisruption(row.view,row.field,row.overlay,row.violent);if(Math.abs(js-ruby.disruption[i])>1e-9)differ.push({kind:'disruption',row,js,ruby:ruby.disruption[i]});});
   affinity.forEach((row,i)=>{const js=portAffinity(row);if(Math.abs(js-ruby.affinity[i])>1e-9)differ.push({kind:'affinity',row,js,ruby:ruby.affinity[i]});});
   if(receipt)fs.writeFileSync(receipt,JSON.stringify({disruptionCases:disruption.length,affinityCases:affinity.length,
     nonNeutralDisruption:ruby.disruption.filter(x=>x!==1).length,nonZeroAffinity:ruby.affinity.filter(x=>x!==0).length,differences:differ.length},null,1)+'\n');
   assert.equal(differ.length,0,JSON.stringify(differ.slice(0,5)));
   assert(ruby.disruption.filter(x=>x!==1).length>2500 && ruby.affinity.filter(x=>x!==0).length>600,'oracle inputs exercise the rules '+[ruby.disruption.filter(x=>x!==1).length,ruby.affinity.filter(x=>x!==0).length]);
 });
 for(const b of Object.values(battles))b.destroy();
};
