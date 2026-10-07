// Context-aware starting layers: environment rows carry a substrate that the real simulator stack starts with, and melting
// or breaking the surface restores it. Original Icy behaviour without a substrate is unchanged.
const fs=require('node:fs'),path=require('node:path');
module.exports=({test,battle,pokemon,move,E,fid,assert,catalog,Battle,root,fixture})=>{
 const A='00000000-0000-0000-0000-000000000001',B='00000000-0000-0000-0000-000000000002';
 const {make}=fixture;const layered=(field,layers,a={},t={})=>make(field,a,t,{layers});
 const plain=x=>JSON.parse(JSON.stringify(x));
 const stack=b=>plain(b.rejuvenation.stack.map(f=>f.id.split(':')[1]+(f.context?'*':'')));
 const after=(b,id)=>{const [u,t]=pokemon(b);b.runEvent('AfterMove',u,t,move(b,id));};
 const said=(b,text)=>b.log.some(s=>s.includes('rejuvenationmessage') && s.includes(text));
 const env=(biome,extra={})=>plain(E.resolveLayers({biome,dimension:'minecraft:overworld',tags:[],y:70,depth:0,skyVisible:true,...extra}));

 test('environment rows start frozen water, snow and underground ice on the right substrate',()=>{
  const expect=[['minecraft:frozen_ocean','icy',['water_surface']],['minecraft:deep_frozen_ocean','icy',['water_surface']],['minecraft:frozen_river','icy',['water_surface']],
   ['minecraft:snowy_plains','icy',['grassy_terrain']],['minecraft:snowy_beach','icy',['beach']],['minecraft:snowy_taiga','icy',['forest']],
   ['minecraft:frozen_peaks','snowy_mountain',['mountain']],['minecraft:snowy_slopes','snowy_mountain',['mountain']],
   ['terralith:ice_marsh','icy',['swamp']],['terralith:snowy_badlands','icy',['desert']],['terralith:wintry_lowlands','icy',['grassy_terrain']]];
  for(const [biome,field,layers]of expect)assert.deepEqual(env(biome),{field:fid(field),layers:layers.map(fid)},biome);
  // Frozen underground: the same visible field over Cave rock (the source's own melt destination).
  assert.deepEqual(env('minecraft:snowy_plains',{depth:30,skyVisible:false}),{field:fid('icy'),layers:[fid('cave')]});
  assert.deepEqual(env('minecraft:frozen_peaks',{depth:30,skyVisible:false}),{field:fid('snowy_mountain'),layers:[fid('cave')]});
  // Unlayered by decision: ice spikes, frostfire caves and unknown biomes that merely carry the snowy tag.
  assert.deepEqual(env('minecraft:ice_spikes'),{field:fid('icy'),layers:[]});
  assert.deepEqual(env('terralith:cave/frostfire_caves'),{field:fid('frozen_dimension'),layers:[]});
  assert.deepEqual(plain(E.resolveLayers({biome:'future:white',dimension:'minecraft:overworld',tags:['c:is_snowy'],y:70,depth:0,skyVisible:true})),{field:fid('icy'),layers:[]});
  // Submerged battles use Underwater and never carry a natural substrate.
  assert.deepEqual(plain(E.resolveLayers({biome:'minecraft:frozen_ocean',dimension:'minecraft:overworld',tags:[],submerged:true,y:40,depth:0,skyVisible:false})),{field:fid('underwater'),layers:[]});
  // Plains are never layered beneath every icy field: only Icy and Snowy Mountain rows carry a substrate, each from its own biome.
  const rows=JSON.parse(fs.readFileSync(path.join(root,'research/biome-mapping.json')));
  for(const row of rows.filter(r=>r.substrate)){assert(['rejuvenation:icy','rejuvenation:snowy_mountain'].includes(row.field),row.biome);assert(catalog.fields[row.substrate]);}
  assert.notEqual(env('minecraft:snowy_taiga').layers[0],fid('grassy_terrain'));assert.notEqual(env('minecraft:snowy_beach').layers[0],fid('grassy_terrain'));
 });
 test('every mapping row with a substrate is a valid catalog row and the catalog rejects bad ones',()=>{
  const bad=[{substrate:'rejuvenation:nowhere'},{substrate:'rejuvenation:indoor'},{substrate:'rejuvenation:icy'},{substrate:7}];
  for(const extra of bad){const c=JSON.parse(JSON.stringify(catalog));c.mappings.push({biome:'x:y',field:fid('icy'),reason:'t',...extra});assert.throws(()=>E.load(JSON.stringify(c)),JSON.stringify(extra));}
  E.load(JSON.stringify(catalog));
 });
 test('battle start rejects unknown, repeated, Indoor, cyclic and too deep layer stacks',()=>{
  for(const layers of [['rejuvenation:nowhere'],['rejuvenation:indoor'],['rejuvenation:icy'],['rejuvenation:forest','rejuvenation:forest'],['rejuvenation:forest','rejuvenation:cave','rejuvenation:rocky','rejuvenation:desert'],'rejuvenation:forest',[7]]){
   const b=new Battle({formatid:'gen9customgame'});assert.throws(()=>E.attach(b,fid('icy'),{layers}),JSON.stringify(layers));assert.equal(b.rejuvenation,undefined,'no partial state');b.destroy();}
 });
 test('Frozen Ocean melts to Water Surface and Snowy Plains melts to Grassy Terrain through real moves',()=>{
  let b=layered('icy',['water_surface']);assert.deepEqual(stack(b),['water_surface*','icy']);after(b,'heatwave');assert.equal(E.current(b).id,fid('water_surface'));assert.deepEqual(stack(b),['water_surface*']);assert(said(b,'The ice melted away!'));b.destroy();
  b=layered('icy',['grassy_terrain']);assert.deepEqual(stack(b),['grassy_terrain*','icy']);after(b,'heatwave');assert.equal(E.current(b).id,fid('grassy_terrain'));assert(said(b,'The ice melted away!'));
  assert.notEqual(E.current(b).id,fid('cave'));b.destroy();
  for(const m of ['heatwave','searingshot','flameburst','lavaplume','firepledge','mindblown','incinerate','infernooverdrive','burningjealousy','ragingfury','eruption','magmadrift']){
   b=layered('icy',['grassy_terrain']);after(b,m);assert.equal(E.current(b).id,fid('grassy_terrain'),m);b.destroy();}
  // Hot water needs the source's two applications (counter) and then reveals the substrate, not an invented Water Surface.
  b=layered('icy',['grassy_terrain']);after(b,'scald');assert.equal(E.current(b).id,fid('icy'));after(b,'scald');assert.equal(E.current(b).id,fid('grassy_terrain'));assert(said(b,'The hot water melted the ice!'));b.destroy();
  b=layered('icy',['water_surface']);after(b,'scald');after(b,'scald');assert.equal(E.current(b).id,fid('water_surface'));assert.deepEqual(stack(b),['water_surface*']);b.destroy();
  b=layered('snowy_mountain',['mountain']);after(b,'heatwave');assert.equal(E.current(b).id,fid('mountain'));assert.deepEqual(stack(b),['mountain*']);b.destroy();
 });
 test('genuine transformations are not redirected to the substrate',()=>{
  let b=layered('snowy_mountain',['mountain']);after(b,'eruption');assert.equal(E.current(b).id,fid('volcanic_top'));assert.deepEqual(stack(b),['mountain*','volcanic_top']);E.destroy(b,'x');assert.equal(E.current(b).id,fid('mountain'));b.destroy();
  b=layered('snowy_mountain',['mountain']);after(b,'fly');assert.equal(E.current(b).id,fid('sky'));b.destroy();
  b=layered('icy',['forest']);after(b,'earthquake');assert.equal(E.current(b).id,fid('icy'),'a quake needs water below to break the ice');b.destroy();
 });
 test('ice-breaking moves restore a water substrate',()=>{
  for(const m of ['earthquake','bulldoze','magnitude','fissure','tectonicrage']){const b=layered('icy',['water_surface']);after(b,m);assert.equal(E.current(b).id,fid('water_surface'),m);assert(said(b,'revealed the water beneath'),m);b.destroy();}
  const b=layered('icy',['water_surface'],{moves:['dive']});const [u,t]=pokemon(b);b.runEvent('AfterMove',u,t,move(b,'dive'));b.rejuvenation.connected=true;
  E.destroy(b,'The ice was broken from underneath!');assert.equal(E.current(b).id,fid('water_surface'));b.destroy();
 });
 test('original Icy without a substrate keeps the source transitions and never acquires one',()=>{
  for(const [m,dest]of [['heatwave','cave'],['eruption','cave'],['scald','water_surface']]){const b=battle('icy');assert.deepEqual(stack(b),['icy']);after(b,m);if(m==='scald')after(b,m);assert.equal(E.current(b).id,fid(dest),m);assert(!stack(b).some(x=>x.endsWith('*')),m);b.destroy();}
  const b=battle('icy');E.change(b,fid('water_surface'),{push:true});E.change(b,fid('icy'),{push:true});assert.deepEqual(stack(b),['icy','water_surface','icy'],'ordinary pushed backups are not context frames');after(b,'heatwave');assert.equal(E.current(b).id,fid('water_surface'),'source backup rule retained');b.destroy();
  // Explicit and trainer fields never take a natural substrate: only the environment resolver supplies layers.
  assert.deepEqual(JSON.parse(JSON.stringify(E.resolveLayers({biome:'minecraft:plains',dimension:'minecraft:overworld',tags:[],y:70,depth:0,skyVisible:true}))).layers,[]);
 });
 test('layers start dormant: only the visible field supplies mechanics and rules',()=>{
  const b=layered('icy',['grassy_terrain'],{moves:['bodyslam']});const [u]=pokemon(b);
  assert.equal(E.current(b).id,fid('icy'));u.hp=Math.floor(u.maxhp/2);const hp=u.hp;b.residualEvent('Residual');assert.equal(u.hp,hp,'Grassy Terrain recovery is not active beneath Icy');
  after(b,'heatwave');b.residualEvent('Residual');assert(u.hp>hp,'Grassy Terrain recovery is active once exposed');b.destroy();
 });
 test('restoration resets counters, clocks, rolls and custom state, and processes entry effects once',()=>{
  const b=layered('icy',['forest'],{moves:['surf'],item:'Telluric Seed'});const [u,t]=pokemon(b);
  assert.equal(u.item,'telluricseed','Forest seed is dormant beneath Icy');
  b.rejuvenation.counters=[2,1,0,3,1];b.rejuvenation.custom={allow:{turn:1,used:{p1:true}}};b.rejuvenation.roll=3;
  after(b,'heatwave');assert.equal(E.current(b).id,fid('forest'));assert.deepEqual(plain(b.rejuvenation.counters),[0,0,0,0,0]);assert.deepEqual(plain(b.rejuvenation.custom),{});
  assert.equal(u.item,'','the holder triggers exactly the exposed Forest seed once on restoration');assert.equal(b.log.filter(s=>s.includes('shielded')).length,1);
  E.destroy(b,'again');assert.equal(b.log.filter(s=>s.includes('shielded')).length,1,'no duplicate seed processing');b.destroy();
 });
 test('temporary fields and overlays over a layered Icy restore through the stack',()=>{
  let b=layered('icy',['grassy_terrain']);E.change(b,fid('cave'),{duration:2,force:true});assert.deepEqual(stack(b),['grassy_terrain*','icy','cave']);b.residualEvent('Residual');b.residualEvent('Residual');assert.equal(E.current(b).id,fid('icy'));after(b,'heatwave');assert.equal(E.current(b).id,fid('grassy_terrain'));b.destroy();
  b=layered('icy',['water_surface']);E.change(b,fid('electric_terrain'),{duration:3});assert.equal(E.current(b).id,fid('icy'));assert.equal(b.rejuvenation.overlay.id,fid('electric_terrain'));after(b,'heatwave');assert.equal(E.current(b).id,fid('water_surface'));assert.equal(b.rejuvenation.overlay?.id,fid('electric_terrain'),'an overlay is not part of the stack');b.destroy();
 });
 test('repeated freezing and melting returns to the same substrate each time',()=>{
  const b=layered('icy',['water_surface']);for(let i=0;i<3;i++){after(b,'heatwave');assert.equal(E.current(b).id,fid('water_surface'));after(b,'blizzard');assert.equal(E.current(b).id,fid('icy'));assert.deepEqual(stack(b),['water_surface*','icy']);}b.destroy();
 });
 test('layers work in doubles and publish the visible field, stack and substrate',()=>{
  const b=new Battle({formatid:'gen9doublescustomgame',seed:[1,2,3,4]});E.attach(b,fid('icy'),{layers:[fid('grassy_terrain')]});let n=0;
  const set=v=>({species:'Mew',ability:'Synchronize',moves:['heatwave'],...v,uuid:'00000000-0000-0000-0000-00000000000'+(++n),movesInfo:[{pp:20,maxPp:20}]});
  b.setPlayer('p1',{name:'A',team:[set(),set()]});b.setPlayer('p2',{name:'B',team:[set(),set()]});b.choose('p1','team 12');b.choose('p2','team 12');
  const state=()=>JSON.parse(b.log.filter(s=>s.startsWith('|rejuvenationstate|')).at(-1).slice(19));
  assert.deepEqual([state().field,state().stack,state().substrate],[fid('icy'),[fid('grassy_terrain'),fid('icy')],fid('grassy_terrain')]);
  b.choose('p1','move 1, move 1');b.choose('p2','move 1, move 1');
  assert.equal(E.current(b).id,fid('grassy_terrain'));assert.equal(b.log.filter(s=>s.includes('The ice melted away!')).length,1,'two Heat Waves in one turn melt once');
  assert.deepEqual([state().field,state().stack,state().substrate],[fid('grassy_terrain'),[fid('grassy_terrain')],null]);b.destroy();
 });
 test('hypothetical evaluation sees the layered restoration and restores the whole stack afterwards',()=>{
  const b=layered('icy',['grassy_terrain'],{moves:['heatwave','splash']},{species:'Snorlax',ability:'Thick Fat'});
  const snapshot=JSON.stringify([b.rejuvenation.stack,b.rejuvenation.counters,b.rejuvenation.custom,b.rejuvenation.id]);
  const r=JSON.parse(E.evaluate(b,[{user:A,target:B,move:'heatwave',range:true}])).results[0];
  assert.equal(r.withField.changesFieldTo,fid('grassy_terrain'),'the evaluation reports the restored substrate, not Cave');
  assert.equal(JSON.stringify([b.rejuvenation.stack,b.rejuvenation.counters,b.rejuvenation.custom,b.rejuvenation.id]),snapshot);
  const plain=battle('icy',{moves:['heatwave','splash']},{species:'Snorlax',ability:'Thick Fat'});
  assert.equal(JSON.parse(E.evaluate(plain,[{user:A,target:B,move:'heatwave',range:true}])).results[0].withField.changesFieldTo,fid('cave'));
  const rows=E.strategy(b,{user:A,candidates:[{move:'heatwave',target:B}]});assert.equal(JSON.stringify([b.rejuvenation.stack,b.rejuvenation.id]),JSON.stringify([JSON.parse(snapshot)[0],JSON.parse(snapshot)[3]]));assert(JSON.parse(rows).candidates[0]);
  b.destroy();plain.destroy();
 });
 test('cache fingerprints distinguish battles that differ only by layer state',()=>{
  const a=layered('icy',['grassy_terrain']),c=layered('icy',['forest']),d=battle('icy');
  assert.notEqual(E.fingerprint(a),E.fingerprint(c));assert.notEqual(E.fingerprint(a),E.fingerprint(d));assert.equal(E.fingerprint(a),E.fingerprint(layered('icy',['grassy_terrain'])));
  const before=E.fingerprint(a);after(a,'heatwave');assert.notEqual(E.fingerprint(a),before);a.destroy();c.destroy();d.destroy();
 });
 test('a catalog reload leaves a running layered battle on its own snapshot',()=>{
  const b=layered('icy',['grassy_terrain']);const old=b.rejuvenation.catalog;E.load(JSON.stringify(catalog));assert.equal(b.rejuvenation.catalog,old);after(b,'heatwave');assert.equal(E.current(b).id,fid('grassy_terrain'));b.destroy();
 });
};
