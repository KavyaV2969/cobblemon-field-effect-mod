// Shared battle builders for the layer and custom-field regression files.
module.exports=({Battle,E,fid,assert})=>{
 const A='00000000-0000-0000-0000-000000000001',B='00000000-0000-0000-0000-000000000002';
 const id=n=>'00000000-0000-0000-0000-'+String(n).padStart(12,'0');
 const set=(v,uuid)=>({species:'Mew',ability:'Synchronize',moves:['splash'],...v,uuid,movesInfo:(v.moves||['splash']).map(()=>({pp:20,maxPp:20}))});
 /** A singles battle: `a` leads side 1, `t` leads side 2; opts.teamA/teamB add reserves, opts.layers starts the stack, opts.seed seeds the PRNG. */
 function make(field,a={},t={},opts={}){
  const b=new Battle({formatid:opts.format||'gen9customgame',seed:opts.seed||[1,2,3,4]});
  E.attach(b,fid(field),{...(opts.attach||{}),...(opts.layers?{layers:opts.layers.map(fid)}:{})});
  b.setPlayer('p1',{name:'A',team:[set(a,A),...(opts.teamA||[]).map((x,i)=>set(x,id(10+i)))]});
  b.setPlayer('p2',{name:'B',team:[set(t,B),...(opts.teamB||[]).map((x,i)=>set(x,id(20+i)))]});
  b.choose('p1','team '+Array.from({length:1+(opts.teamA||[]).length},(_,i)=>i+1).join(''));b.choose('p2','team '+Array.from({length:1+(opts.teamB||[]).length},(_,i)=>i+1).join(''));
  return b;
 }
 /** A doubles battle; side 1 members are numbered 100.., side 2 members 200..; extra members beyond two wait in reserve. */
 function doubles(field,a,c,opts={}){
  const b=new Battle({formatid:'gen9doublescustomgame',seed:opts.seed||[1,2,3,4]});
  E.attach(b,fid(field),{...(opts.attach||{}),...(opts.layers?{layers:opts.layers.map(fid)}:{})});
  b.setPlayer('p1',{name:'A',team:a.map((x,i)=>set(x,id(100+i)))});b.setPlayer('p2',{name:'B',team:c.map((x,i)=>set(x,id(200+i)))});
  b.choose('p1','team '+a.map((_,i)=>i+1).join(''));b.choose('p2','team '+c.map((_,i)=>i+1).join(''));
  return b;
 }
 const pokemon=b=>[b.sides[0].active[0],b.sides[1].active[0]];
 const move=(b,id)=>b.dex.getActiveMove(id);
 const play=(b,x,y)=>{b.choose('p1',x);b.choose('p2',y);};
 const turn=(b,x,y='move 1')=>play(b,x,y);
 const said=(b,text,from=0)=>b.log.slice(from).some(s=>s.includes('rejuvenationmessage') && s.includes(text));
 const lines=(b,from=0)=>b.log.slice(from).filter(s=>s.includes('rejuvenationmessage')).map(s=>s.split('|rejuvenationmessage|')[1]);
 const publicState=b=>JSON.parse(b.log.filter(s=>s.startsWith('|rejuvenationstate|')).at(-1).slice('|rejuvenationstate|'.length));
 return {make,doubles,pokemon,move,play,turn,said,lines,publicState,A,B,id,set};
};
