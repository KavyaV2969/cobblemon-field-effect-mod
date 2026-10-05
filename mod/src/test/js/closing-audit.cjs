// Small source branches closed late in the audit (Battler.rb targets and seeds, Battle_ZMove.rb, stat-query ruin abilities).
module.exports=({test,battle,pokemon,move,E,fid,assert,catalog,Battle})=>{
 const said=(b,text,from=0)=>b.log.slice(from).some(s=>s.includes('rejuvenationmessage') && s.includes(text));
 function doubles(field,a,c){const b=new Battle({formatid:'gen9doublescustomgame',seed:[1,2,3,4]});E.attach(b,fid(field));let n=0;const set=v=>({species:'Mew',ability:'Inner Focus',moves:['harden'],...v,uuid:'00000000-0000-0000-0000-0000000000a'+(n++),movesInfo:(v.moves || ['harden']).map(()=>({pp:20,maxPp:20}))});
  b.setPlayer('p1',{name:'A',team:a.map(set)});b.setPlayer('p2',{name:'B',team:c.map(set)});b.choose('p1','team 12');b.choose('p2','team 12');b.randomChance=()=>true;return b;}
 // The request still offers a target for moves whose target the field widens; either spelling is accepted here.
 function act(b,id){for(const choice of ['move '+id+', move harden','move '+id+' 1, move harden']){b.choose('p1',choice);if(!b.sides[0].choice.error)break;}b.choose('p2','move harden, move harden');}

 test('a consumed seed grows Flower Garden stages one to four',()=>{
  for(const [start,end]of [[1,2],[2,3],[3,4],[4,5],[5,5]]){const item=catalog.fields[fid('flower_garden_'+start)].seed.item;const b=battle('flower_garden_'+start,{item}),[u]=pokemon(b);assert.equal(u.item,'','seed '+start);assert.equal(b.rejuvenation.id,fid('flower_garden_'+end),'stage '+start);assert.equal(said(b,'grew the garden!'),start<5,'line '+start);b.destroy();}
  const b=battle('flower_garden_1',{item:'Leftovers'});assert.equal(b.rejuvenation.id,fid('flower_garden_1'));b.destroy();});

 test('Haunted Mean Look and Fire Spin reach both foes and Deep Earth Topsy-Turvy reaches everyone else',()=>{
  for(const [field,both]of [['haunted',true],['indoor',false]]){
   let b=doubles(field,[{moves:['meanlook']},{}],[{},{}]);act(b,'meanlook');assert.deepEqual(b.sides[1].active.map(p=>!!p.volatiles.trapped),[true,both],field+' Mean Look');assert(!b.sides[0].active[1].volatiles.trapped);b.destroy();
   b=doubles(field,[{moves:['firespin']},{}],[{},{}]);act(b,'firespin');assert.deepEqual(b.sides[1].active.map(p=>!!p.volatiles.partiallytrapped),[true,both],field+' Fire Spin');assert.equal(b.sides[0].active[1].hp,b.sides[0].active[1].maxhp);b.destroy();}
  for(const [field,all]of [['deep_earth',true],['indoor',false]]){const b=doubles(field,[{moves:['topsyturvy']},{}],[{},{}]);const others=[b.sides[0].active[1],...b.sides[1].active];for(const p of others)p.boosts.atk=2;act(b,'topsyturvy');
   assert.deepEqual(others.map(p=>p.boosts.atk),all?[-2,-2,-2]:[2,-2,2],field);assert.deepEqual(others.map(p=>p.hp<p.maxhp),all?[true,true,true]:[false,false,false],field+' damage');assert.equal(b.sides[0].active[0].hp,b.sides[0].active[0].maxhp);b.destroy();}});

 test('Z-Conversion, Z-Happy Hour and Z-Celebrate raise every stat two stages on their source fields',()=>{
  const boost=(field,id)=>{const b=battle(field),[u,t]=pokemon(b),m=move(b,id);b.singleEvent('ModifyMove',m,null,u,t,m,m);b.runEvent('ModifyMove',u,t,m,m);const out=m.zMove?.boost?.atk;assert.equal(new Set(Object.values(m.zMove.boost)).size,1);assert.equal(Object.keys(m.zMove.boost).sort().join(),'atk,def,spa,spd,spe');b.destroy();return out;};
  for(const [field,id,amount]of [['city','conversion',2],['city','happyhour',2],['city','celebrate',2],['back_alley','conversion',2],['back_alley','happyhour',1],['back_alley','celebrate',1],['indoor','conversion',1],['indoor','happyhour',1],['indoor','celebrate',1]])assert.equal(boost(field,id),amount,field+' '+id);});

 test('Wasteland Acid Downpour adds the random status outside the secondary-effect system',()=>{
  const use=(field,index,target)=>{const b=battle(field,{moves:['aciddownpour'],ability:'Inner Focus'},{moves:['harden'],ability:'Inner Focus',...target}),[u,t]=pokemon(b);b.randomChance=()=>true;b.sample=list=>list[Math.min(index,list.length-1)];b.makeChoices('move aciddownpour','move harden');const status=t.status;b.destroy();return status;};
  assert.deepEqual([0,1,2,3].map(i=>use('wasteland',i,{})),['brn','frz','par','psn']);
  for(const target of [{ability:'Shield Dust'},{item:'Covert Cloak'}])assert.deepEqual([0,3].map(i=>use('wasteland',i,target)),['',''],JSON.stringify(target));
  for(const ability of ['Poison Heal','Toxic Boost'])assert.deepEqual([0,1,2].map(i=>use('wasteland',i,{ability})),['psn','psn','psn'],ability);
  assert.equal(use('wasteland',0,{ability:'Immunity'}),'','Immunity forces the poison draw and then blocks it');assert.equal(use('indoor',0,{}),'');});

 test('Deux Finalis spares the side of a Sword of Ruin holder in the Shell Side Arm stat query',()=>{
  // Attack 100 against Defense 100 and Special Attack 100 against Special Defense 80: the special side wins by 20
  // unless Sword of Ruin lowers the target Defense to 75 and the physical side wins by 25.
  for(const [field,holder,expected]of [['indoor','foe','Physical'],['deux_finalis','foe','Special'],['deux_finalis','user','Physical'],['indoor','none','Special']]){
   const b=doubles(field,[{moves:['shellsidearm']},{ability:holder==='user'?'Sword of Ruin':'Inner Focus'}],[{},{ability:holder==='foe'?'Sword of Ruin':'Inner Focus'}]),u=b.sides[0].active[0],t=b.sides[1].active[0];
   Object.assign(u.storedStats,{atk:100,spa:100});Object.assign(t.storedStats,{def:100,spd:80});const m=move(b,'shellsidearm');b.activeMove=m;b.activePokemon=u;b.activeTarget=t;b.singleEvent('ModifyMove',m,null,u,t,m,m);b.runEvent('ModifyMove',u,t,m,m);assert.equal(m.category,expected,field+' '+holder);b.destroy();}});
};
