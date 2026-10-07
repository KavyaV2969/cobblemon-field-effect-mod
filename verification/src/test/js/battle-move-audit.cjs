// Semantic probes for the remaining Battle_Move source branches.
module.exports=({test,battle,pokemon,move,E,fid,assert,Battle,catalog})=>{
 function doubles(field,a,c){const b=new Battle({formatid:'gen9doublescustomgame',seed:[1,2,3,4]});E.attach(b,fid(field));let n=0;const set=v=>({species:'Mew',ability:'Synchronize',moves:['splash'],...v,uuid:'00000000-0000-0000-0000-00000000001'+(n++),movesInfo:(v.moves || ['splash']).map(()=>({pp:20,maxPp:20}))});b.setPlayer('p1',{name:'A',team:a.map(set)});b.setPlayer('p2',{name:'B',team:c.map(set)});b.choose('p1','team 12');b.choose('p2','team 12');return b;}
 test('Cave damaging Ground moves hit every source airborne state during a real turn',()=>{
  for(const field of ['cave','indoor'])for(const kind of ['Flying','Levitate','Air Balloon','magnetrise','telekinesis']){
   const b=battle(field,{moves:['earthquake']},{ability:kind==='Levitate'?'Levitate':'Synchronize',item:kind==='Air Balloon'?'Air Balloon':''}),[u,t]=pokemon(b);
   if(kind==='Flying')t.setType('Flying');if(['magnetrise','telekinesis'].includes(kind))t.addVolatile(kind,t);
   const hp=t.hp;b.makeChoices('move earthquake','move splash');
   assert.equal(t.hp<hp,field==='cave',field+' '+kind);
   assert.equal(b.log.some(s=>s.startsWith('|-immune|p2a')),field==='indoor',field+' '+kind+' message');b.destroy();
  }
 });
 test('Rainbow secondary chances combine with Serene Grace once for flinch and twice otherwise',()=>{
  for(const field of ['rainbow','indoor','overlay'])for(const ability of ['Synchronize','Serene Grace'])for(const [id,base]of [['airslash',30],['flamethrower',10]]){
   const b=battle(field==='overlay'?'rocky':field,{ability}),[u,t]=pokemon(b);if(field==='overlay')b.rejuvenation.overlay={id:fid('rainbow'),duration:5};
   const m=move(b,id);b.runEvent('ModifyMove',u,t,m,m);
   const grace=ability==='Serene Grace',rainbow=field!=='indoor',factor=(grace?2:1)*(rainbow&&!(grace&&id==='airslash')?2:1);
   assert.equal(m.secondaries[0].chance,base*factor,[field,ability,id].join());b.destroy();
  }
 });
 test('strict immunity override and flinch predicates reject malformed datapacks',()=>{
  for(const action of [{op:'moveProperty',path:'ignoreImmunity',value:true},{op:'moveProperty',path:'ignoreImmunity',value:{Ground:false}},{op:'moveProperty',path:'ignoreImmunity',value:{Ground:true,Fire:true}}]){
   const c=JSON.parse(JSON.stringify(catalog));c.fields[fid('cave')].rules.push({event:'modifyMove',condition:{always:true},actions:[action]});assert.throws(()=>E.load(c));
  }
  const c=JSON.parse(JSON.stringify(catalog));c.fields[fid('rainbow')].rules.push({event:'modifyMove',condition:{canFlinch:'yes'},actions:[]});assert.throws(()=>E.load(c));
 });
 test('source field move types and Glitch categories follow the shipped Rejuvenation switches',()=>{
  const rows=[['beach','strength','Fighting'],['water_surface','shoreup','Water'],...['mudslap','mudbomb','mudshot','thousandwaves','shoreup'].map(id=>['murkwater_surface',id,'Water']),...['sacredsword','cut','slash','secretsword'].map(id=>['fairytale',id,'Steel']),['starlight','solarbeam','Grass'],['starlight','solarblade','Grass'],['dimensional','rage','Dark'],['frozen_dimension','rage','Dark'],['dragons_den','rockclimb','Rock'],['dragons_den','strength','Rock'],['deep_earth','topsyturvy','Ground']];
  for(const [field,id,type]of rows){const b=battle(field),[u,t]=pokemon(b),m=move(b,id);b.runEvent('ModifyMove',u,t,m,m);assert.equal(m.type,type,field+' '+id);b.destroy();}
  for(const [id,type,category]of [['moonblast','???','Physical'],['shadowball','Ghost','Physical'],['darkpulse','Dark','Special'],['bite','Dark','Special'],['icepunch','Ice','Special'],['swordsdance','Normal','Status']]){const b=battle('glitch'),[u,t]=pokemon(b),m=move(b,id);b.runEvent('ModifyMove',u,t,m,m);assert.equal(m.type,type,id);assert.equal(m.category,category,id);b.destroy();}
 });
 test('field type chart branches apply exact source single-type values and immunity',()=>{
  const rows=[['cave','earthquake','Ground','Flying',0],['holy','tackle','Normal','Dark',1],['holy','tackle','Normal','Ghost',1],['holy','spiritbreak','Fairy','Ghost',1],['haunted','spiritbreak','Fairy','Ghost',1],['underwater','surf','Water','Water',0],['fairytale','ironhead','Steel','Dragon',1],['glitch','dragonclaw','Dragon','Fairy',0],['glitch','shadowball','Ghost','Psychic','immune'],['glitch','bugbite','Bug','Poison',1],['glitch','poisonjab','Poison','Bug',1],['glitch','icebeam','Ice','Fire',0],['glitch','darkpulse','Dark','Steel',-1],['glitch','shadowball','Ghost','Steel',-1],['haunted','shadowball','Ghost','Normal',0],['bewitched','poisonjab','Poison','Grass',0],['bewitched','moonblast','Fairy','Steel',1],['bewitched','moonblast','Fairy','Dark',0],['bewitched','darkpulse','Dark','Fairy',0],['sky','bonemerang','Ground','Flying',1],['sky','tackle','Normal','Flying',1,'Long Reach'],...['flower_garden_2','flower_garden_3','flower_garden_4','flower_garden_5'].map(f=>[f,'cut','Normal','Grass',1]),['forest','cut','Normal','Grass',0],['infernal','flamethrower','Fire','Ghost',1],['deep_earth','earthquake','Ground','Ground',-1],['deux_finalis','shadowball','Ghost','Rock',-1],...['Fire','Poison','Steel','Dragon'].map(t=>['deux_finalis','moonblast','Fairy',t,0]),['electric_terrain','thunderbolt','Electric','Ground',0,'Teravolt']];
  for(const [field,id,type,defense,expected,ability='Synchronize']of rows){const b=battle(field,{ability}),[u,t]=pokemon(b),m=move(b,id);m.type=type;t.setType(defense);b.activeMove=m;b.activePokemon=u;
   if(expected==='immune')assert.equal(t.runImmunity(type),false,[field,type,defense].join());else assert.equal(t.runEffectiveness(m),expected,[field,type,defense,id].join());b.destroy();}
 });
 test('source accuracy changes honor airborne targets and ability suppression',()=>{
  for(const [field,ability,breaker,id,expected]of [['rainbow','Wonder Skin',false,'growl',0],['rainbow','Wonder Skin',true,'growl',100],['psychic_terrain','Magician',false,'growl',50],['psychic_terrain','Magician',true,'growl',100],['indoor','Magician',false,'growl',100],['underwater','Synchronize',false,'zapcannon',true]]){
   const b=battle(field,{ability:breaker?'Mold Breaker':'Synchronize'},{ability}),[u,t]=pokemon(b),m=move(b,id);if(breaker)m.ignoreAbility=true;b.activeMove=m;b.activePokemon=u;
   assert.equal(b.runEvent('ModifyAccuracy',t,u,m,m.accuracy),expected,[field,ability,breaker,id].join());b.destroy();
  }
  for(const field of ['rocky','forest','indoor']){const b=battle(field,{ability:'Long Reach'}),[u,t]=pokemon(b),m=move(b,'tackle');assert.equal(b.runEvent('ModifyAccuracy',t,u,m,100),field==='rocky'?90:100,field);b.destroy();}
 });
 test('accuracy early returns preserve perfect moves, OHKO exceptions and native item order',()=>{
  for(const [field,ability,id,expected]of [['rainbow','Wonder Skin','confide',true],['psychic_terrain','Magician','confide',true],['psychic_terrain','Magician','hypnosis',45],['rainbow','Wonder Skin','hypnosis',0]]){
   const b=battle(field,{},{ability,item:'Bright Powder'}),[u,t]=pokemon(b),m=move(b,id);b.activeMove=m;b.activePokemon=u;
   assert.equal(b.runEvent('ModifyAccuracy',t,u,m,m.accuracy),expected,[field,ability,id].join());b.destroy();
  }
  const b=battle('underwater'),[u,t]=pokemon(b),ohko=move(b,'fissure');ohko.type='Electric';assert.equal(b.runEvent('ModifyAccuracy',t,u,ohko,30),30);b.destroy();
  const flying=battle('underwater',{moves:['zapcannon']},{moves:['fly']}),[att,tar]=pokemon(flying);tar.storedStats.spe=999;flying.makeChoices('move zapcannon','move fly');assert.equal(tar.hp,tar.maxhp,'perfect electric accuracy does not bypass semi-invulnerability');assert(flying.log.some(s=>s.startsWith('|-miss|p1a')));flying.destroy();
 });
 test('Chi Focus grants one side boost and guarantees critical hits on Ashen Beach',()=>{
  for(const field of ['beach','indoor'])for(const abilities of [['Chi Focus','Synchronize'],['Synchronize','Chi Focus'],['Chi Focus','Chi Focus'],['Synchronize','Synchronize']]){
   const b=doubles(field,abilities.map(ability=>({ability})),[{},{}]),u=b.sides[0].active[0],t=b.sides[1].active[0],m=move(b,'tackle');b.activeMove=m;b.activePokemon=u;
   assert.equal(b.runEvent('ModifyCritRatio',u,t,m,1),abilities.includes('Chi Focus')?(field==='beach'?4:3):1,field+' '+abilities);
   if(field==='beach' && abilities.includes('Chi Focus')){b.randomChance=(n,d)=>n>=d;b.actions.getDamage(u,t,m);assert.equal(t.getMoveHitData(m).crit,true,'guaranteed crit uses probability one');}b.destroy();
  }
 });
 test('Liquid Voice changes sound moves to Ice only on Icy Field and preserves Z moves',()=>{
  for(const [field,id,type]of [['icy','hypervoice','Ice'],['icy','psychic','Psychic'],['snowy_mountain','hypervoice','Water'],['frozen_dimension','hypervoice','Water'],['indoor','hypervoice','Water']]){
   const b=battle(field,{ability:'Liquid Voice'}),[u,t]=pokemon(b),m=move(b,id);b.runEvent('ModifyType',u,t,m,m);assert.equal(m.type,type,field+' '+id);b.destroy();
  }
  const b=battle('icy',{ability:'Liquid Voice'}),[u,t]=pokemon(b),m=move(b,'clangoroussoulblaze');b.runEvent('ModifyType',u,t,m,m);assert.equal(m.type,'Dragon');b.destroy();
 });
 test('field priority additions cover hard terrain, overlays, chess roles and negative moves',()=>{
  for(const [field,id,delta,overlay,king]of [['grassy_terrain','grassyglide',1],['indoor','grassyglide',1,'grassy_terrain'],['indoor','grassyglide',0],['dimensional','quash',1],['frozen_dimension','quash',1],['indoor','quash',0],['chess_board','tackle',1,null,true],['chess_board','tackle',0],['deep_earth','coreenforcer',-1],['indoor','coreenforcer',0]]){
   const b=battle(field),[u,t]=pokemon(b),m=move(b,id);if(overlay)b.rejuvenation.overlay={id:fid(overlay),duration:5};u.rejuvenationRoles ||= {};u.rejuvenationRoles[fid('chess_board')]=king?'king':'pawn';assert.equal(b.runEvent('ModifyPriority',u,t,m,m.priority),m.priority+delta,[field,id,overlay,king].join());b.destroy();
  }
 });
 test('Chess knights fork only opposing spread targets with the source damage share and flavor',()=>{
  for(const id of ['rockslide','earthquake']){const b=doubles('chess_board',[{moves:[id]},{}],[{},{}]),u=b.sides[0].active[0];u.rejuvenationRoles[fid('chess_board')]='knight';b.randomChance=()=>true;
   b.makeChoices('move '+id+', move splash','move splash, move splash');const hits=b.log.filter(s=>s.startsWith('|-damage|p2'));assert.equal(new Set(hits).size,2,id+' '+JSON.stringify(hits));assert.equal(b.log.filter(s=>s.includes('The knight forked the opponents!')).length,id==='rockslide'?1:0,id);b.destroy();}
  const b=doubles('chess_board',[{},{}],[{},{}]),u=b.sides[0].active[0],t=b.sides[1].active[0];u.rejuvenationRoles[fid('chess_board')]='knight';for(const [id,expected]of [['rockslide',1.25],['earthquake',undefined]]){const m=move(b,id);b.runEvent('ModifyMove',u,t,m,m);assert.equal(m.spreadModifier,expected,id);}b.destroy();
 });
 test('Deux Finalis Amulet Coin preserves critical stat bypass while removing its damage and message',()=>{
  function damage({field='deux_finalis',item='Amulet Coin',crit=true,stages=false,screen=null,ability='Synchronize'}={}){
   const b=battle(field,{ability},{item}),[u,t]=pokemon(b),m=move(b,'tackle');m.willCrit=crit;b.randomChance=()=>false;b.randomizer=n=>n;u.storedStats.atk=t.storedStats.def=100;
   if(stages){u.boosts.atk=-6;t.boosts.def=6;}if(screen)t.side.addSideCondition(screen,t,move(b,screen));b.activeMove=m;b.activePokemon=u;
   const d=b.actions.getDamage(u,t,m),isCrit=t.getMoveHitData(m).crit,critMessage=b.log.some(s=>s.startsWith('|-crit|'));b.destroy();return {d,isCrit,critMessage};
  }
  const neutral=damage({crit:false}),coin=damage(),staged=damage({stages:true}),ordinary=damage({item:''});
  assert(coin.isCrit);assert(!coin.critMessage);assert.equal(coin.d,neutral.d);assert.equal(staged.d,coin.d,'critical hit still bypasses negative offense and positive defense');assert(damage({crit:false,stages:true}).d<coin.d/8);
  assert(ordinary.critMessage);assert(Math.abs(ordinary.d/coin.d-1.5)<.05);
  for(const screen of ['reflect','auroraveil']){const screened=damage({screen,stages:true});assert(screened.isCrit);assert(Math.abs(screened.d/coin.d-.5)<.04,screen);assert.equal(damage({item:'',screen}).d,ordinary.d,'ordinary crit bypasses '+screen);}
  assert.equal(damage({screen:'lightscreen'}).d,coin.d,'wrong-category screen stays irrelevant');
  assert(Math.abs(damage({ability:'Sniper'}).d/coin.d-1.5)<.05,'Sniper still sees a critical hit');
  assert(damage({field:'indoor'}).critMessage,'Coin suppression is field-dependent');
  const b=battle('deux_finalis',{moves:['frostbreath']},{item:'Amulet Coin'}),[u,t]=pokemon(b);b.makeChoices('move frostbreath','move splash');assert(t.hp<t.maxhp);assert(!b.log.some(s=>s.startsWith('|-crit|')));b.destroy();
 });
 test('critical policy reload validation rejects invalid multipliers and switches',()=>{
  for(const patch of [{modifier:0},{modifier:3},{modifier:'one'},{applyScreens:1},{hideMessage:'yes'},{condition:{sideItem:{who:'invalid',values:['amuletcoin']}}}]){
   const c=JSON.parse(JSON.stringify(catalog));Object.assign(c.fields[fid('deux_finalis')].criticalPolicy,patch);assert.throws(()=>E.load(c));
  }
 });
 test('Volcanic Top eruption Blaze is a single ability boost and its flavor activates once',()=>{
  const b=battle('volcanic_top',{ability:'Blaze'}),[u,t]=pokemon(b);u.hp=Math.floor(u.maxhp/4);u.addVolatile('rejuvenationblazed',u);
  for(const event of ['ModifyAtk','ModifySpA'])assert.equal(b.runEvent(event,u,t,move(b,'flamethrower'),100),150,'pinch and eruption do not stack');
  u.hp=u.maxhp;assert.equal(b.runEvent('ModifySpA',u,t,move(b,'flamethrower'),100),150);
  u.setAbility('synchronize');assert.equal(b.runEvent('ModifySpA',u,t,move(b,'flamethrower'),100),100,'marker alone is no boost');
  u.setAbility('blaze');E.change(b,fid('forest'));assert.equal(b.runEvent('ModifySpA',u,t,move(b,'flamethrower'),100),100,'Blazed boost requires Volcanic Top');b.destroy();
  const erupt=battle('volcanic_top',{ability:'Blaze'}),[holder]=pokemon(erupt);for(let n=0;n<2;n++){erupt.rejuvenation.eruption=true;erupt.residualEvent('Residual');}
  assert(holder.volatiles.rejuvenationblazed);assert.equal(erupt.log.filter(s=>s.includes("Fire-type moves rose!")).length,1);erupt.destroy();
 });
 test('Frozen Dimension suppresses stored Flash Fire power and restores it after replacement',()=>{
  const b=battle('forest',{ability:'Flash Fire'}),[u,t]=pokemon(b);u.addVolatile('flashfire',u);
  for(const [field,value]of [['forest',150],['frozen_dimension',100],['forest',150]]){E.change(b,fid(field));for(const event of ['ModifyAtk','ModifySpA'])assert.equal(b.runEvent(event,u,t,move(b,'flamethrower'),100),value,field);assert(u.volatiles.flashfire,'suppression does not destroy stored boost');}b.destroy();
 });
 test('Frozen Dimension Ice Face blocks special hits with native substitute and Mold Breaker guards',()=>{
  for(const [field,breaker,sub]of [['frozen_dimension',false,false],['indoor',false,false],['frozen_dimension',true,false],['frozen_dimension',false,true]]){
   const b=battle(field,{ability:breaker?'Mold Breaker':'Synchronize',moves:['psychic']},{species:'Eiscue',ability:'Ice Face'}),[u,t]=pokemon(b);if(sub)t.addVolatile('substitute',t);const hp=t.hp;
   b.makeChoices('move psychic','move splash');const breaks=field==='frozen_dimension'&&!breaker&&!sub;
   assert.equal(t.species.id,breaks?'eiscuenoice':'eiscue',[field,breaker,sub].join());assert.equal(t.hp<hp,!breaks&&!sub,[field,breaker,sub,'HP'].join());if(sub)assert(!t.volatiles.substitute || t.volatiles.substitute.hp<t.maxhp/4);b.destroy();
  }
 });
 test('damage category and condition suppression validators reject invalid callback data',()=>{
  for(const patch of [{categories:[]},{categories:['Status']},{nativeCategory:'Status'},{categories:['Physical','Physical']}]){const c=JSON.parse(JSON.stringify(catalog));Object.assign(c.fields[fid('frozen_dimension')].abilityDamageCategories.iceface,patch);assert.throws(()=>E.load(c));}
  for(const callbacks of [[],['onStart'],['onModifyAtk','onModifyAtk']]){const c=JSON.parse(JSON.stringify(catalog));c.fields[fid('frozen_dimension')].suppressedConditionCallbacks.flashfire=callbacks;assert.throws(()=>E.load(c));}
 });
 test('Glitch Foul Play borrows target Special stats and user modifiers independently',()=>{
  function damage({userStat=1,item='',targetItem='',stage=0}={}){const b=battle('glitch',{item},{item:targetItem}),[u,t]=pokemon(b),m=move(b,'foulplay');u.storedStats.spa=u.storedStats.spd=userStat;t.storedStats.spa=200;t.storedStats.spd=100;t.boosts.spa=stage;b.activeMove=m;b.activePokemon=u;b.runEvent('ModifyMove',u,t,m,m);m.willCrit=false;b.randomChance=()=>false;b.randomizer=n=>n;b.activeMove=m;b.activePokemon=u;const d=b.actions.getDamage(u,t,m);assert.equal(b.rejuvenationStatQuery,undefined);b.destroy();return d;}
  const plain=damage();assert.equal(damage({userStat:1000}),plain,'user raw Special stats are not borrowed');assert.equal(damage({stage:2}),plain,'target offense and defense use the same staged Special');
  for(const item of ['Choice Specs','Assault Vest'])assert(Math.abs(damage({item})/plain-1.5)<.05,item+' changes the user modifier branch');assert(damage({targetItem:'Assault Vest'})<=plain,'target defensive item does not become the user item');
 });
 test('Glitch special Body Press and physical Secret Sword use the source substituted stats',()=>{
  const b=battle('glitch'),[u,t]=pokemon(b),body=move(b,'bodypress');body.type='Electric';b.runEvent('ModifyMove',u,t,body,body);assert.equal(body.category,'Special');assert.equal(body.overrideOffensiveStat,'spa');u.storedStats.spa=100;u.storedStats.spd=200;u.storedStats.def=999;t.storedStats.spa=t.storedStats.spd=100;b.randomChance=()=>false;b.randomizer=n=>n;b.activeMove=body;b.activePokemon=u;const d=b.actions.getDamage(u,t,body);u.storedStats.def=1;assert.equal(b.actions.getDamage(u,t,body),d,'Defense is not used by special Body Press');
  const sword=move(b,'secretsword');b.runEvent('ModifyMove',u,t,sword,sword);assert.equal(sword.category,'Physical');assert.equal(sword.overrideDefensiveStat,'spd');u.storedStats.atk=100;t.storedStats.def=999;t.storedStats.spd=100;t.storedStats.spa=200;b.activeMove=sword;const high=b.actions.getDamage(u,t,sword);t.storedStats.def=1;assert.equal(b.actions.getDamage(u,t,sword),high,'Secret Sword hits shared Special on Glitch');t.storedStats.spa=100;assert(b.actions.getDamage(u,t,sword)>high,'higher target Special Attack supplies defense');b.destroy();
 });
 test('borrowed-stat selectors and native stat override paths reject malformed values',()=>{
  for(const patch of [{selection:'eval'},{modifierSelection:'raw'},{extra:true}]){const c=JSON.parse(JSON.stringify(catalog));Object.assign(c.fields[fid('glitch')].statPools.borrowedOffense.foulplay,patch);assert.throws(()=>E.load(c));}
  for(const path of ['overrideOffensiveStat','overrideDefensiveStat']){const c=JSON.parse(JSON.stringify(catalog));c.fields[fid('glitch')].rules.push({event:'modifyMove',condition:{always:true},actions:[{op:'moveProperty',path,value:'hp'}]});assert.throws(()=>E.load(c));}
 });
 test('smart move categories use field Flare Boost, shared Special and Battery before comparing',()=>{
  for(const id of ['photongeyser','lightthatburnsthesky'])for(const [field,status,atk,spa,spd,expected]of [['volcanic','',120,100,90,'Special'],['infernal','',120,100,90,'Special'],['indoor','',120,100,90,'Physical'],['indoor','brn',120,100,90,'Special'],['frozen_dimension','brn',120,100,90,'Physical'],['glitch','',120,100,150,'Special'],['glitch','',200,100,150,'Physical']]){
   const b=battle(field,{ability:'Flare Boost'}),[u,t]=pokemon(b);u.status=status;Object.assign(u.storedStats,{atk,spa,spd});const m=move(b,id);b.activeMove=m;b.activePokemon=u;b.runEvent('ModifyMove',u,t,m,m);assert.equal(m.category,expected,[field,status,id].join());b.destroy();
  }
  for(const [field,atk,expected]of [['electric_terrain',140,'Special'],['indoor',140,'Physical'],['indoor',120,'Special']]){const b=doubles(field,[{},{ability:'Battery'}],[{},{}]),u=b.sides[0].active[0],t=b.sides[1].active[0],m=move(b,'photongeyser');Object.assign(u.storedStats,{atk,spa:100});b.activeMove=m;b.activePokemon=u;b.runEvent('ModifyMove',u,t,m,m);assert.equal(m.category,expected,field+' Battery');b.destroy();}
 });
 test('Shell Side Arm compares stat differences with ability defenses and source contact behavior',()=>{
  for(const [ability,defAbility,atk,spa,def,spd,expected]of [['Synchronize','Synchronize',200,100,170,80,'Physical'],['Tough Claws','Synchronize',110,115,100,100,'Physical'],['Synchronize','Ice Scales',100,150,100,100,'Physical'],['Synchronize','Fluffy',150,100,100,100,'Special'],['Long Reach','Fluffy',150,100,100,100,'Physical'],['Synchronize','Synchronize',100,100,100,100,'Special']]){
   const b=battle('indoor',{ability},{ability:defAbility}),[u,t]=pokemon(b);Object.assign(u.storedStats,{atk,spa});Object.assign(t.storedStats,{def,spd});const m=move(b,'shellsidearm');b.activeMove=m;b.activePokemon=u;b.singleEvent('ModifyMove',m,null,u,t,m,m);b.runEvent('ModifyMove',u,t,m,m);assert.equal(m.category,expected,[ability,defAbility].join());assert.equal(!!m.flags.contact,expected==='Physical'&&ability!=='Long Reach','contact respects Long Reach');b.destroy();
  }
  const b=battle('glitch'),[u,t]=pokemon(b),m=move(b,'shellsidearm');Object.assign(u.storedStats,{atk:100,spa:50,spd:300});Object.assign(t.storedStats,{def:100,spa:100,spd:100});b.activeMove=m;b.activePokemon=u;b.runEvent('ModifyMove',u,t,m,m);assert.equal(m.category,'Special','smart category overrides the Glitch Poison category');b.destroy();
 });
 test('smart category selection is used during a real Photon Geyser turn',()=>{
  const b=battle('volcanic',{ability:'Flare Boost',moves:['photongeyser']}),[u,t]=pokemon(b);Object.assign(u.storedStats,{atk:120,spa:100});let category;const old=b.actions.getDamage;b.actions.getDamage=function(user,target,m,...args){if(m.id==='photongeyser')category=m.category;return old.call(this,user,target,m,...args);};b.makeChoices('move photongeyser','move splash');assert.equal(category,'Special');assert(t.hp<t.maxhp);b.destroy();
 });
 test('smart category validation rejects missing arrays and malformed multipliers',()=>{
  for(const patch of [{comparison:'ratio'},{contactByCategory:'yes'},{specialMultipliers:null},{specialMultipliers:[{condition:{always:true},factor:0}]},{specialMultipliers:[{condition:{unknown:true},factor:2}]}]){
   const c=JSON.parse(JSON.stringify(catalog)),a=c.fields[fid('glitch')].rules.flatMap(r=>r.actions).find(a=>a.recipe==='smartCategory');Object.assign(a,patch);assert.throws(()=>E.load(c));
  }
 });
};
