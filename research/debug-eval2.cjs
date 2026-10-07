const {E,battle}=require('./debug-eval.cjs');
const A='00000000-0000-0000-0000-000000000001',B='00000000-0000-0000-0000-000000000002';
const moves=['thunderbolt','spore','swordsdance','recover','flamethrower','earthquake','roost','thunderwave'];
for(const m of moves)for(const [u,t] of [[A,B],[B,A],[A,A]]){
 const b=battle('electric_terrain',{moves:['thunderbolt','spore','swordsdance','recover'],item:'Wacan Berry'},{species:'Charizard',ability:'Blaze',moves:['flamethrower','earthquake','roost','thunderwave'],item:'Wacan Berry'});
 const snap=JSON.stringify(b.sides.map(s=>s.pokemon.map(p=>({i:Object.keys(p.itemState),v:Object.keys(p.volatiles),h:p.hp}))));
 E.evaluate(b,JSON.stringify([{user:u,move:m,target:t}]));
 const after=JSON.stringify(b.sides.map(s=>s.pokemon.map(p=>({i:Object.keys(p.itemState),v:Object.keys(p.volatiles),h:p.hp}))));
 if(snap!==after)console.log('MUTATED',m,u===A?'A':'B','->',t===A?'A':'B',after);
}
