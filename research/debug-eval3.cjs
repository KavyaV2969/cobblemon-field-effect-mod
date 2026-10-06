const {E,battle}=require('./debug-eval.cjs');
const A='00000000-0000-0000-0000-000000000001',B='00000000-0000-0000-0000-000000000002';
const b=battle('electric_terrain',{moves:['thunderbolt'],item:'Wacan Berry'},{species:'Charizard',ability:'Blaze',moves:['flamethrower'],item:'Wacan Berry'});
const t=b.sides[1].active[0];let val;
console.log("same obj before?", t.itemState);const ref=t.itemState;
E.evaluate(b,JSON.stringify([{user:A,move:'thunderbolt',target:B}]));
console.log('keys after',Object.keys(t.itemState), t.itemState===ref, Object.keys(ref));
