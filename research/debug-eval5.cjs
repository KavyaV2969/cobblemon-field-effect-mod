const {E,battle}=require('./debug-eval.cjs');
const A='00000000-0000-0000-0000-000000000001',B='00000000-0000-0000-0000-000000000002';
const a={moves:['flamethrower','surf','dive','rest']},t={species:'Starmie',ability:'Natural Cure',moves:['hydropump','recover','splash','thunderwave']};
const moves=[...new Set([...a.moves,...t.moves])];const all=moves.flatMap(m=>[{user:A,move:m,target:B},{user:B,move:m,target:A},{user:A,move:m,target:A}]);
const x=battle('underwater',a,t),y=battle('underwater',a,t);
for(let round=0;round<2;round++){
 E.evaluate(x,JSON.stringify(all));
 x.makeChoices('move 1','move 1');y.makeChoices('move 1','move 1');
 const lx=x.log,ly=y.log;let d=-1;for(let i=0;i<Math.max(lx.length,ly.length);i++)if(lx[i]!==ly[i]){d=i;break;}
 if(d>=0){console.log('round',round,'DIFF at',d,'\n  x:',lx.slice(d-2,d+4).join(' / '),'\n  y:',ly.slice(d-2,d+4).join(' / '));break;}
}
