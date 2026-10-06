const {E,battle}=require('./debug-eval.cjs');
const A='00000000-0000-0000-0000-000000000001',B='00000000-0000-0000-0000-000000000002';
const a={moves:['flamethrower','surf','dive','rest']},t={species:'Starmie',ability:'Natural Cure',moves:['hydropump','recover','splash','thunderwave']};
const moves=[...new Set([...a.moves,...t.moves])];
for(const m of moves)for(const [u,tg] of [[A,B],[B,A],[A,A]]){
 const x=battle('underwater',a,t),y=battle('underwater',a,t);
 E.evaluate(x,JSON.stringify([{user:u,move:m,target:tg}]));
 for(let i=0;i<2;i++){x.makeChoices('move 1','move 1');y.makeChoices('move 1','move 1');}
 const lx=x.log,ly=y.log;let d=-1;for(let i=0;i<Math.max(lx.length,ly.length);i++)if(lx[i]!==ly[i]){d=i;break;}
 if(d>=0)console.log('DIFF',m,u===A?'A':'B','->',tg===A?'A':'B','\n  x:',lx.slice(d,d+3).join(' / '),'\n  y:',ly.slice(d,d+3).join(' / '));
}
