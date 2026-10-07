// Prediction-versus-mechanic differential for Battle_AI.rb field branches. Each row is the value a source AI
// branch predicts (with its line); the shipped engine must produce it when the move is really used on that field.
// The strategy prices these consequences by executing the same move in its rollout, so agreement here is the
// evidence that the strategy sees what the source AI anticipates.
const STATS=['atk','def','spa','spd','spe','accuracy','evasion'];
const CONCERT=['concert_1','concert_2','concert_3','concert_4'];
const garden=(a,b)=>Array.from({length:b-a+1},(_,i)=>'flower_garden_'+(a+i));
// [line, fields, move, who ('self' raises / 'foe' lowers / 'foeRaise' raises the target), statarray, options]
// options.mechanic: where the source AI's statarray disagrees with Rejuvenation's own move implementation, the
// engine must follow the cited mechanic (the strategy then prices the real effect) and the row is reported.
// options.unreachable: the named move never reaches this function-code handler in the source.
const STAT_PREDICTIONS=[
 [1971,['water_surface'],'splash','foe',[0,0,0,0,0,1,0],{control:'celebrate'}],
 [2107,['rainbow','beach'],'meditate','self',[3,0,0,0,0,0,0]],
 [2108,['psychic_terrain'],'meditate','self',[2,0,2,0,0,0,0]],
 [2109,['colosseum',...CONCERT],'howl','self',[2,0,0,0,0,0,0]],
 [2113,['psychic_terrain'],'psyshieldbash','self',[0,1,0,1,0,0,0]],
 [2124,['electric_terrain'],'charge','self',[0,0,0,2,0,0,0]],
 [2138,['grassy_terrain','dragons_den'],'coil','self',[2,2,0,0,0,2,0]],
 [2142,['big_top','dragons_den'],'dragondance','self',[2,0,0,0,2,0,0]],
 [2147,[...CONCERT,'city'],'workup','self',[2,0,2,0,0,0,0]],
 [2152,['grassy_terrain','forest',...garden(1,2)],'growth','self',[2,0,2,0,0,0,0]],
 [2153,garden(3,5),'growth','self',[3,0,3,0,0,0,0]],
 [2160,['misty_terrain','rainbow','holy','starlight','new_world','psychic_terrain'],'cosmicpower','self',[0,2,0,2,0,0,0]],
 [2161,['forest'],'defendorder','self',[0,2,0,2,0,0,0]],
 [2165,['big_top'],'quiverdance','self',[0,0,2,2,2,0,0]],
 [2170,['chess_board','beach','psychic_terrain'],'calmmind','self',[0,0,2,2,0,0,0]],
 [2176,['big_top','fairytale','colosseum'],'swordsdance','self',[3,0,0,0,0,0,0]],
 [2180,['factory'],'irondefense','self',[0,3,0,0,0,0,0]],
 [2180,['corrosive','corrosive_mist','murkwater_surface','fairytale',...CONCERT],'acidarmor','self',[0,3,0,0,0,0,0]],
 [2180,['swamp'],'shelter','self',[0,3,0,0,0,0,0]],
 [2188,['rocky'],'rockpolish','self',[0,0,0,0,3,0,0]],
 [2189,['crystal_cavern'],'rockpolish','self',[1,0,1,0,2,0,0]],
 [2193,['factory','city','deep_earth'],'autotomize','self',[0,0,0,0,3,0,0]],
 [2200,['chess_board','psychic_terrain','infernal','back_alley'],'nastyplot','self',[0,0,3,0,0,0,0]],
 [2218,['factory','city'],'shiftgear','self',[2,0,0,0,2,0,0]],
 [2236,['big_top'],'bellydrum','self',[6,1,0,1,0,0,0]],
 [2278,['colosseum'],'flatter','foeRaise',[0,0,2,0,0,0,0]],
 [2284,['colosseum'],'swagger','foeRaise',[3,0,0,0,0,0,0]],
 [2290,['haunted'],'bittermalice','foe',[1,0,1,0,0,0,0]],
 [2291,CONCERT,'growl','foe',[2,0,0,0,0,0,0]],
 [2294,['icy'],'lunge','self',[0,0,0,0,1,0,0],{also:'foe',foe:[1,0,0,0,0,0,0]}],
 [2304,['swamp'],'strugglebug','foe',[0,0,0,0,2,0,0],{unreachable:'Struggle Bug is function 0x45; its Swamp effect is SpAtk -2 (Battle_MoveEffects.rb:1458, lead 2331)'}],
 [2304,['electric_terrain'],'electroweb','foe',[0,0,0,0,2,0,0]],
 [2331,['frozen_dimension','back_alley'],'snarl','foe',[0,0,2,0,0,0,0]],
 [2331,['swamp'],'strugglebug','foe',[0,0,2,0,0,0,0]],
 [2342,['beach','desert'],'sandattack','foe',[0,0,0,0,0,2,0]],
 [2343,['dark_crystal_cavern','short_circuit','starlight','new_world'],'flash','foe',[0,0,0,0,0,2,0]],
 [2344,['corrosive_mist','volcanic','volcanic_top','back_alley','city'],'smokescreen','foe',[0,0,0,0,0,2,0]],
 [2345,['psychic_terrain','beach'],'kinesis','foe',[0,0,0,0,0,2,0]],
 [2349,['psychic_terrain'],'kinesis','self',[2,0,2,0,0,0,0]],
 [2362,['misty_terrain','flower_garden_3'],'sweetscent','foe',[0,1,0,1,0,0,2]],
 [2363,['flower_garden_4'],'sweetscent','foe',[0,2,0,2,0,0,2]],
 [2364,['flower_garden_5'],'sweetscent','foe',[0,3,0,3,0,0,2]],
 [2376,['big_top'],'featherdance','foe',[3,0,0,0,0,0,0]],
 [2381,CONCERT,'screech','foe',[0,3,0,0,0,0,0]],
 [2385,['haunted'],'scaryface','foe',[0,0,0,0,4,0,0],{mechanic:[0,0,0,0,3,0,0],source:'Battle_MoveEffects.rb:1646 lowers Speed by 3 on Haunted'}],
 [2395,['factory','short_circuit',...CONCERT],'metalsound','foe',[0,0,0,3,0,0,0]],
 [2396,['back_alley'],'faketears','foe',[0,0,0,3,0,0,0]],
 [2497,['grassy_terrain'],'worryseed','foe',[1,0,0,0,0,0,0]],
 [2851,['beach'],'firespin','foe',[0,0,0,0,0,1,0]],
 [2851,['beach'],'sandtomb','foe',[0,0,0,0,0,1,0]],
 [2715,['sky'],'mirrormove','self',[1,0,1,0,1,0,0],{foeLastMove:'tackle'}],
 [2899,['icy'],'rollout','self',[0,0,0,0,1,0,0]],
 [2899,['icy'],'iceball','self',[0,0,0,0,1,0,0]],
 [3282,['fairytale','dragons_den'],'nobleroar','foe',[2,0,2,0,0,0,0]],
 [3291,['electric_terrain'],'eerieimpulse','foe',[0,0,3,0,0,0,0]],
 [3298,['frozen_dimension'],'partingshot','foe',[1,0,1,0,1,0,0]],
 [3299,[...CONCERT,'back_alley'],'partingshot','foe',[2,0,2,0,0,0,0]],
 [3356,['electric_terrain'],'magneticflux','self',[0,1,0,1,0,0,0]],
 [3363,['electric_terrain'],'magneticflux','self',[0,2,0,2,0,0,0],{user:{ability:'Plus'}}],
 [3383,['fairytale'],'craftyshield','self',[0,1,0,1,0,0,0]],
 [3496,['water_surface','murkwater_surface'],'shoreup','self',[0,2,0,0,0,0,0],{user:{ability:'Water Compaction'},hp:.5}],
 [3519,['bewitched'],'strengthsap','foe',[1,0,1,0,0,0,0]],
 // 3556 boosts with the defensive drops the same branch prices at 3559 (selfstatdrop([0,1,0,1,0,0,0])).
 [3556,['chess_board','big_top'],'noretreat','self',[2,-1,2,-1,2,0,0]],
 [3557,['colosseum'],'noretreat','self',[2,2,2,2,2,0,0]],
 [3644,['colosseum',...CONCERT],'howl','self',[2,0,0,0,0,0,0]],
 [3669,['back_alley','city','corrosive_mist'],'corrosivegas','foe',[1,1,1,1,1,0,0]],
 [3689,['big_top'],'victorydance','self',[2,2,0,0,2,0,0]],
 [3700,['water_surface','underwater'],'takeheart','self',[0,0,2,2,0,0,0]],
 [3838,['big_top'],'aquabatics','self',[0,0,2,0,2,0,0]],
];
// pbStatChangingSwitch (Battle_AI.rb:12817-13054): entry stage changes the AI predicts for a Pokemon switching in.
// [line, fields, reserve setup, predicted stages | {volatile}, options]
const ab=ability=>({ability});
const ENTRY_PREDICTIONS=[
 [12822,['forest'],{stickyWeb:true},[0,0,0,0,-2,0,0]],
 [12838,['fairytale','starlight'],{replaces:'healingwish'},[1,0,1,0,0,0,0]],
 [12844,['starlight'],{replaces:'lunardance'},[1,0,1,0,0,0,0]],
 [12848,['new_world','big_top'],{replaces:'lunardance'},[1,1,1,1,1,0,0]],
 [12855,['deep_earth'],{item:'Iron Ball'},[0,0,0,0,-2,0,0]],
 [12859,['deep_earth'],{item:'Magnet'},[0,0,1,0,-1,0,0]],
 [12874,['electric_terrain'],{item:'Cell Battery'},[1,0,0,0,0,0,0]],
 [12881,['electric_terrain'],ab('Quark Drive'),{volatile:'quarkdrive'}],
 [12881,['new_world'],ab('Quark Drive'),{volatile:'quarkdrive'},{mechanic:{absent:'quarkdrive'},source:'Battler.rb:3417-3428 activates Quark Drive only on Electric Terrain (field or overlay) or with Booster Energy'}],
 [12896,['new_world','desert'],ab('Protosynthesis'),{volatile:'protosynthesis'},{mechanic:{absent:'protosynthesis'},source:'Battler.rb:3431-3442 activates Protosynthesis only in sun or with Booster Energy; pbWeather (Battle.rb) does not make these fields sunny'}],
 [12921,['fairytale','colosseum'],ab('Intrepid Sword'),[1,0,1,0,0,0,0]],
 [12926,['fairytale','colosseum'],ab('Dauntless Shield'),[0,1,0,1,0,0,0]],
 [12935,['deep_earth'],ab('Light Metal'),[0,0,0,0,1,0,0]],
 [12939,['deep_earth'],ab('Heavy Metal'),[0,1,0,0,-1,0,0]],
 [12944,['electric_terrain'],ab('Lightning Rod'),[0,0,1,0,0,0,0]],
 [12948,['volcanic'],ab('Magma Armor'),[0,1,0,0,0,0,0]],
 [12950,['dragons_den'],ab('Magma Armor'),[0,1,0,1,0,0,0]],
 [12952,['electric_terrain'],ab('Electromorphosis'),[0,0,1,0,0,0,0]],
 [12960,['dragons_den'],ab('Shell Armor'),[0,1,0,0,0,0,0]],
 [12964,['fairytale','chess_board'],{species:'Aegislash',ability:'Stance Change'},[0,1,0,0,0,0,0]],
 [12964,['chess_board'],ab('Stall'),[0,1,0,0,0,0,0]],
 ...[['Magic Guard',[0,0,0,1,0,0,0]],['Magic Bounce',[0,0,0,1,0,0,0]],['Power of Alchemy',[0,1,0,1,0,0,0]],['Mirror Armor',[0,0,0,1,0,0,0]],
   ['Pastel Veil',[0,0,0,1,0,0,0]],['Armor Tail',[0,1,0,0,0,0,0]],['Battle Armor',[0,1,0,0,0,0,0]],['Shell Armor',[0,1,0,0,0,0,0]],['Magician',[0,0,1,0,0,0,0]]]
   .map(([a,v])=>[12968,['fairytale'],ab(a),v]),
 [12974,['starlight'],ab('Illuminate'),[0,0,2,0,0,0,0]],
 [12978,['misty_terrain','corrosive_mist'],ab('Water Compaction'),[0,2,0,0,0,0,0]],
 [12988,['dimensional','frozen_dimension','haunted'],ab('Rattled'),[0,0,0,0,1,0,0]],
 [12992,['psychic_terrain'],ab('Forewarn'),[0,0,2,0,0,0,0]],
 [12992,['psychic_terrain'],ab('Anticipation'),[0,0,2,0,0,0,0]],
 [12992,['psychic_terrain'],ab("Mind's Eye"),[0,0,1,0,0,0,0]],
 [12996,['forest'],{ability:'Forewarn',overlay:'psychic_terrain'},[0,0,1,0,0,0,0]],
 [12996,['forest'],{ability:'Anticipation',overlay:'psychic_terrain'},[0,0,1,0,0,0,0]],
 [13000,['crystal_cavern'],ab('Tera Form Zero'),[0,0,1,0,0,0,0]],
 [13004,['dimensional','frozen_dimension'],ab('Berserk'),[0,0,1,0,0,0,0]],
 [13004,['dimensional','frozen_dimension'],ab('Justified'),[1,0,0,0,0,0,0]],
 [13004,['dimensional','frozen_dimension'],ab('Anger Point'),[1,0,0,0,0,0,0]],
 [13004,['dimensional','frozen_dimension'],ab('Anger Shell'),[1,-1,1,-1,1,0,0]],
 [13016,['sky'],ab('Big Pecks'),[0,1,0,0,0,0,0]],
 [13016,['sky'],ab('Levitate'),[0,0,0,0,1,0,0]],
 ...['Magma Armor','Flame Body','Desolate Land'].map(a=>[13021,['infernal'],ab(a),[0,1,0,1,0,0,0]]),
 ...[['Battle Armor',[0,1,0,0,0,0,0]],['Shell Armor',[0,1,0,0,0,0,0]],['Mirror Armor',[0,0,0,1,0,0,0]],['Magic Guard',[0,0,0,1,0,0,0]],
   ['Justified',[1,0,1,0,0,0,0]],['No Guard',[1,0,1,0,0,0,0]]].map(([a,v])=>[13026,['colosseum'],ab(a),v,
   a==='Mirror Armor'?{mechanic:[0,0,0,0,0,0,0],source:'Battler.rb:2365 tests :MIRORARMOR (misspelled), so Mirror Armor never gains Sp. Def on Colosseum entry'}:{}]),
 ...['Heavy Metal','Solid Rock','Punk Rock','Soundproof','Rock Head'].map(a=>[13033,['concert_1','concert_2','concert_3','concert_4'],ab(a),[0,1,0,0,0,0,0]]),
 ...['Emergency Exit','Run Away'].map(a=>[13035,['concert_2','concert_3','concert_4'],ab(a),[0,0,0,0,1,0,0]]),
 [13037,['concert_3','concert_4'],ab('Rattled'),[0,0,0,0,2,0,0]],
 ...[['Anticipation',[0,1,0,1,0,0,0]],['Forewarn',[0,1,0,1,0,0,0]],['Pickpocket',[1,0,0,0,0,0,0]],['Merciless',[1,0,0,0,0,0,0]],['Magician',[0,0,1,0,0,0,0]]]
   .map(([a,v])=>[13043,['back_alley'],ab(a),v]),
 ...[['Big Pecks',[0,1,0,0,0,0,0]],['Early Bird',[1,0,0,0,0,0,0]],['Pickup',[0,0,0,0,1,0,0]],['Rattled',[0,0,0,0,1,0,0]]].map(([a,v])=>[13050,['city'],ab(a),v]),
];
// hpGainPerTurn (Battle_AI.rb:9180-9365): the end-of-turn HP change (fraction of max HP) the AI predicts.
// [line, fields, subject setup, control setup, predicted fraction, options]; the measured change is the subject's
// one-turn HP change minus the control's, so field-wide effects common to both cancel.
const MG={ability:'Magic Guard'};
const trap=move=>({volatiles:[{id:'partiallytrapped',source:'foe',move}]});
const RESIDUAL_PREDICTIONS=[
 [9186,['volcanic'],{},MG,-1/8],
 [9187,['volcanic'],{ability:'Leaf Guard'},MG,-1/4],
 [9186,['volcanic'],{species:'Venusaur',ability:'Chlorophyll'},{species:'Venusaur',...MG},-1/4],
 [9193,['underwater'],{species:'Arcanine',ability:'Justified'},{species:'Arcanine',...MG},-1/4],
 [9196,['underwater'],{species:'Arcanine',ability:'Flame Body'},{species:'Arcanine',...MG},-1/2],
 [9199,['murkwater_surface'],{},MG,-1/8],
 [9202,['murkwater_surface'],{ability:'Flame Body'},MG,-1/4],
 [9206,['corrosive'],{ability:'Dry Skin'},{},-1/8,{mechanic:0,source:'Battle.rb:5984-5998 applies Dry Skin poison damage on Corrosive Mist and Corrupted, not Corrosive'}],
 [9206,['corrosive'],{ability:'Grass Pelt'},{},-1/4,{mechanic:-1/8,source:'Battle.rb:5968-5974 withers Grass Pelt by 1/8 once; the AI counts it at both 9206 and 9214'}],
 [9214,['corrosive'],{ability:'Leaf Guard'},{},-1/8,{mechanic:0,source:'Battle.rb:6180-6186 applies foliage damage on Corrupted, not Corrosive'}],
 [9214,['corrosive'],{ability:'Flower Veil'},{},-1/8,{mechanic:0,source:'Battle.rb:6180-6186 applies foliage damage on Corrupted, not Corrosive'}],
 [9214,['corrupted'],{ability:'Leaf Guard'},{},-1/8,{source:'mechanic named by the AI branch, on the field where the source applies it'}],
 [9214,['corrupted'],{ability:'Flower Veil'},{},-1/8,{source:'mechanic named by the AI branch, on the field where the source applies it'}],
 [9207,['desert'],{ability:'Dry Skin'},{},-1/8],
 [9208,['corrupted'],{ability:'Dry Skin'},{},-1/8],
 [9209,['desert'],{species:'Tangela',ability:'Leaf Guard',weather:'sunnyday'},{species:'Tangela',ability:'Leaf Guard',item:'Utility Umbrella',weather:'sunnyday'},-1/8],
 [9209,['desert'],{species:'Tangela',ability:'Chlorophyll',weather:'sunnyday'},{species:'Tangela',ability:'Chlorophyll',item:'Utility Umbrella',weather:'sunnyday'},-1/8,{mechanic:0,source:'Battle.rb:5464 exempts Chlorophyll, Solar Power and Mega Sol from the Desert sunlight damage'}],
 [9210,['corrosive_mist'],{volatiles:[{id:'aquaring'}]},{},-1/16],
 [9211,['corrosive','corrupted'],{volatiles:[{id:'ingrain'}]},{},-1/16],
 [9212,['haunted'],{status:'slp'},{},-1/16],
 [9229,['dimensional','bewitched'],{status:'slp'},{},-1/8,{mechanic:-1/16,source:'Battle.rb:6564-6569 deals 1/16 once; the AI charges it at both 9229 and 9245'}],
 [9229,['swamp'],{status:'slp'},{},-1/16],
 [9213,['dimensional'],{volatiles:[{id:'healblock',source:'foe'}]},{},-1/16],
 [9215,['infernal'],{volatiles:[{id:'torment',source:'foe'}]},{},-1/8],
 [9219,['desert'],{weather:'sandstorm'},{...MG,weather:'sandstorm'},-1/8],
 [9220,['frozen_dimension'],{weather:'hail'},{...MG,weather:'hail'},-1/8],
 [9226,['icy'],{status:'brn'},{},-1/32],
 [9235,['infernal'],{status:'slp',foe:{ability:'Bad Dreams'}},{status:'slp'},-1/4],
 [9234,['rainbow'],{status:'slp',foe:{ability:'Bad Dreams'}},{status:'slp'},0],
 [9250,['wasteland'],{volatiles:[{id:'leechseed',source:'foe'}]},{},-1/4],
 [9251,['haunted'],{status:'slp',volatiles:[{id:'nightmare'}]},{status:'slp'},-1/3],
 [9251,['rainbow'],{status:'slp',volatiles:[{id:'nightmare'}]},{status:'slp'},0],
 [9252,['holy'],{volatiles:[{id:'curse',source:'foe'}]},{},0],
 [9263,['holy','deux_finalis'],{volatiles:[{id:'saltcure',source:'foe'}]},{},-1/8,{mechanic:-1/6,source:'project decision recorded at research/battle_rules.py:95: the non-Champs Holy divisor (Battle.rb:6607) keeps Cobblemon’s native 1/8 Salt Cure base'}],
 [9263,['holy'],{species:'Registeel',ability:'Clear Body',volatiles:[{id:'saltcure',source:'foe'}]},{species:'Registeel',ability:'Clear Body'},-1/4,{mechanic:-1/3,source:'project decision recorded at research/battle_rules.py:95 (divisor 3 for Steel/Water)'}],
 [9272,['haunted'],trap('firespin'),{},-1/6],
 [9273,['dragons_den'],trap('magmastorm'),{},-1/6],
 [9274,['desert'],trap('sandtomb'),{},-1/6],
 [9275,['water_surface','underwater'],trap('whirlpool'),{},-1/6],
 [9276,['electric_terrain'],trap('thundercage'),{},-1/6],
 [9278,['forest','flower_garden_3'],trap('infestation'),{},-1/6],
 [9280,['flower_garden_4'],trap('infestation'),{},-1/4],
 [9282,['flower_garden_5'],trap('infestation'),{},-1/3],
 [9292,['corrupted'],{item:'Black Sludge'},{},-1/4],
 [9310,['corrosive_mist'],{species:'Registeel',ability:'Clear Body',volatiles:[{id:'aquaring'}]},{species:'Registeel',ability:'Clear Body'},1/16],
 [9313,['misty_terrain','swamp','water_surface','underwater'],{volatiles:[{id:'aquaring'}]},{},1/8],
 [9311,['grassy_terrain'],{item:'Big Root',volatiles:[{id:'aquaring'}]},{item:'Big Root'},1/10],
 [9321,['forest','flower_garden_2','flower_garden_3','grassy_terrain'],{volatiles:[{id:'ingrain'}]},{},1/8],
 [9322,['flower_garden_4','flower_garden_5'],{volatiles:[{id:'ingrain'}]},{},1/4],
 [9327,['corrosive'],{species:'Croagunk',ability:'Dry Skin'},{species:'Croagunk',ability:'Anticipation'},1/16,{mechanic:0,source:'Battle.rb:5984-5998 heals Poison-type Dry Skin on Corrosive Mist and Corrupted only'}],
 [9327,['corrupted','corrosive_mist'],{species:'Croagunk',ability:'Dry Skin'},{species:'Croagunk',ability:'Anticipation'},1/16,{mechanic:1/8,source:'Battle.rb:5992-5996 heals 1/8'}],
 [9327,['misty_terrain','swamp','water_surface','underwater'],{ability:'Dry Skin'},{},1/16],
 [9330,['corrupted'],{species:'Muk',ability:'Stench',item:'Black Sludge'},{species:'Muk',ability:'Stench'},1/8],
 [9338,['icy','snowy_mountain','frozen_dimension'],{ability:'Ice Body'},{},1/16],
 [9349,['corrosive','wasteland'],{ability:'Poison Heal'},{},1/8],
 [9350,['grassy_terrain'],{ability:'Sap Sipper'},{},1/16],
 [9351,['grassy_terrain'],{},{ability:'Levitate'},1/16],
 [9352,['electric_terrain'],{ability:'Volt Absorb'},{},1/16],
 [9354,['rainbow'],{status:'slp'},{},1/16],
 [9355,['forest'],{ability:'Sap Sipper'},{},1/16],
 [9356,['short_circuit'],{ability:'Volt Absorb'},{},1/16],
 [9357,['desert'],{ability:'Earth Eater'},{},1/16],
 [9359,['deux_finalis'],{ability:'Gluttony'},{},1/16],
 [9359,['deux_finalis'],{ability:'Purifying Salt'},{},1/16],
 [9360,['water_surface','underwater'],{ability:'Water Absorb'},{},1/16],
 [9361,['bewitched'],{species:'Tangela',ability:'Chlorophyll'},{species:'Tangela',ability:'Chlorophyll',item:'Air Balloon'},1/16],
 [9362,['back_alley'],{item:'Leftovers'},{},(1/16)*.67],
];
module.exports=({test,E,fid,assert,Battle,receipt})=>{
 function duel(field,user,foe){
   const b=new Battle({formatid:'gen9customgame',seed:[1,2,3,4]});E.attach(b,fid(field));
   const set=(v,uuid)=>({species:'Mew',ability:'Synchronize',...v,uuid,movesInfo:v.moves.map(()=>({pp:20,maxPp:20}))});
   b.setPlayer('p1',{name:'A',team:[set(user,'00000000-0000-0000-0000-000000000001'),set({species:'Chansey',moves:['splash']},'00000000-0000-0000-0000-000000000003')]});
   b.setPlayer('p2',{name:'B',team:[set(foe,'00000000-0000-0000-0000-000000000002')]});
   b.choose('p1','team 12');b.choose('p2','team 1');return b;
 }
 const vector=(boosts,sign)=>STATS.map(s=>sign*(boosts[s] || 0));
 function run(field,move,options){
   const b=duel(field,{moves:[move],...options.user},{species:'Snorlax',ability:'Thick Fat',moves:['splash'],...options.foe});
   const [u,t]=[b.sides[0].active[0],b.sides[1].active[0]];
   if(options.hp)u.hp=Math.floor(u.maxhp*options.hp);
   if(options.foeLastMove)t.lastMove=b.dex.getActiveMove(options.foeLastMove);
   // Every chance event connects, so accuracy and secondary chances do not hide the prediction.
   b.forceRandomChance=true;
   b.makeChoices('move 1','move 1');
   if(b.sides[0].activeRequest?.forceSwitch)b.choose('p1','switch 2');
   const out={self:STATS.map(s=>u.boosts[s] || 0),foe:STATS.map(s=>t.boosts[s] || 0)};
   b.destroy();return out;
 }
 // The move's own effect: the same turn with Splash isolates end-of-turn field effects (Swamp speed, Water Surface accuracy).
 function observe(field,move,options={}){
   const used=run(field,move,options),control=run(field,options.control || 'splash',options);
   return {self:used.self.map((x,i)=>x-control.self[i]),foe:used.foe.map((x,i)=>x-control.foe[i])};
 }
 const results=[];
 for(const [line,fields,move,who,array,options={}]of STAT_PREDICTIONS)for(const field of fields){
   const exists=new Battle({formatid:'gen9customgame'}).dex.moves.get(move).exists;
   if(!exists){results.push({line,field,move,status:'unavailable'});continue;}
   const seen=observe(field,move,options);
   const actual=who==='self'?seen.self:seen.foe.map(x=>who==='foe'?-x:x);
   const expected=options.mechanic || array;
   const same=(a,b)=>STATS.every((_,i)=>a[i]===b[i]);
   let ok=same(actual,expected);
   if(options.also)ok=ok && same(seen.foe.map(x=>-x),options.foe);
   const status=options.unreachable?'unreachable':!ok?'differs':options.mechanic?'ai_prediction_differs_from_source_mechanic':'match';
   results.push({line,field,move,who,predicted:array,expected,actual,status,note:options.unreachable || options.source});
 }
 // Switch-in: the reserve's stages after entering, minus the same switch by a Synchronize/no-item reserve.
 function enter(field,setup){
   const run=(reserve,web)=>{
     const b=new Battle({formatid:'gen9customgame',seed:[1,2,3,4]});E.attach(b,fid(field));
     const set=(v,uuid)=>({species:'Mew',ability:'Synchronize',moves:['splash'],...v,uuid,movesInfo:(v.moves || ['splash']).map(()=>({pp:20,maxPp:20}))});
     b.setPlayer('p1',{name:'A',team:[set({moves:[setup.replaces || 'splash']},'00000000-0000-0000-0000-000000000001'),set(reserve,'00000000-0000-0000-0000-000000000003')]});
     b.setPlayer('p2',{name:'B',team:[set({species:'Snorlax',ability:'Thick Fat'},'00000000-0000-0000-0000-000000000002')]});
     b.choose('p1','team 12');b.choose('p2','team 1');
     if(setup.overlay)E.change(b,fid(setup.overlay),{duration:5});
     if(web)b.sides[0].addSideCondition('stickyweb',b.sides[1].active[0]);
     b.forceRandomChance=true;
     if(setup.replaces){b.makeChoices('move 1','move 1');b.choose('p1','switch 2');}
     else b.makeChoices('switch 2','move 1');
     const p=b.sides[0].active[0];
     const out={stages:STATS.map(s=>p.boosts[s] || 0),volatiles:Object.keys(p.volatiles)};b.destroy();return out;
   };
   const {stickyWeb,overlay,replaces,...reserve}=setup;
   const used=run(reserve,stickyWeb);
   // A Healing Wish/Lunar Dance replacement is compared with the predicted absolute stages.
   if(replaces)return used;
   const control=stickyWeb?run(reserve,false):run({},false);
   return {...used,stages:used.stages.map((x,i)=>x-control.stages[i])};
 }
 const entries=[];
 for(const [line,fields,setup,predicted,options={}]of ENTRY_PREDICTIONS)for(const field of fields){
   const dex=new Battle({formatid:'gen9customgame'}).dex;
   if(setup.ability && !dex.abilities.get(setup.ability).exists){entries.push({line,field,setup,status:'unavailable'});continue;}
   const seen=enter(field,setup),expected=options.mechanic || predicted;
   const ok=Array.isArray(expected)?STATS.every((_,i)=>seen.stages[i]===expected[i]):expected.absent?!seen.volatiles.includes(expected.absent):seen.volatiles.includes(expected.volatile);
   const status=!ok?'differs':options.mechanic?'ai_prediction_differs_from_source_mechanic':'match';
   entries.push({line,field,setup,predicted,expected,actual:Array.isArray(expected)?seen.stages:seen.volatiles,status,note:options.source || options.note});
 }
 module.exports.entries=entries;
 test('AI switch-in stage predictions agree with the shipped entry mechanics',()=>{
   const counts={};for(const r of entries)counts[r.status]=(counts[r.status]||0)+1;
   if(process.env.AI_AUDIT_REPORT)console.log(JSON.stringify(entries.filter(r=>r.status!=='match')));
   assert.equal(entries.filter(r=>r.status==='differs').length,0,JSON.stringify(entries.filter(r=>r.status==='differs'))+' '+JSON.stringify(counts));
 });
 function hpChange(field,setup){
   const b=new Battle({formatid:'gen9customgame',seed:[1,2,3,4]});E.attach(b,fid(field));
   const {species='Mew',ability='Synchronize',item,status,volatiles=[],weather,foe={}}=setup;
   const set=(v,uuid)=>({species:'Mew',ability:'Synchronize',moves:['splash'],...v,uuid,movesInfo:[{pp:20,maxPp:20}]});
   b.setPlayer('p1',{name:'A',team:[set({species,ability,item},'00000000-0000-0000-0000-000000000001')]});
   b.setPlayer('p2',{name:'B',team:[set({species:'Snorlax',ability:'Thick Fat',...foe},'00000000-0000-0000-0000-000000000002')]});
   b.choose('p1','team 1');b.choose('p2','team 1');
   const [u,t]=[b.sides[0].active[0],b.sides[1].active[0]];
   if(weather)b.field.setWeather(weather,u);
   u.hp=Math.floor(u.maxhp/2);
   if(status){u.setStatus(status,t);if(status==='slp')u.statusState.time=5;}
   for(const v of volatiles)u.addVolatile(v.id,v.source==='foe'?t:u,v.move?b.dex.getActiveMove(v.move):undefined);
   const before=u.hp;b.makeChoices('move 1','move 1');
   const out={delta:u.hp-before,maxhp:u.maxhp};b.destroy();return out;
 }
 const residuals=[];
 for(const [line,fields,subject,control,predicted,options={}]of RESIDUAL_PREDICTIONS)for(const field of fields){
   const a=hpChange(field,subject),c=hpChange(field,control),measured=a.delta-c.delta;
   const target=options.mechanic ?? predicted,expected=target*a.maxhp;
   // Each residual effect floors separately; allow one HP per effect.
   const ok=Math.abs(measured-expected)<=2;
   const status=!ok?'differs':options.mechanic!==undefined?'ai_prediction_differs_from_source_mechanic':'match';
   residuals.push({line,field,subject,predicted,expected:target,measured:measured/a.maxhp,status,note:options.source || options.note});
 }
 module.exports.residuals=residuals;
 test('AI end-of-turn HP predictions agree with the shipped residual mechanics',()=>{
   if(process.env.AI_AUDIT_REPORT)console.log(JSON.stringify(residuals.filter(r=>r.status!=='match')));
   assert.equal(residuals.filter(r=>r.status==='differs').length,0,JSON.stringify(residuals.filter(r=>r.status==='differs')));
 });
 module.exports.results=results;
 test('AI stat-change predictions agree with the shipped field mechanics',()=>{
   const differs=results.filter(r=>r.status==='differs');
   const counts={};for(const r of results)counts[r.status]=(counts[r.status]||0)+1;
   assert(counts.match>=140,'prediction rows were skipped '+JSON.stringify(counts));
   if(process.env.AI_AUDIT_REPORT)console.log(JSON.stringify(results.filter(r=>r.status!=='match'),null,0));
   assert.equal(differs.length,0,JSON.stringify(differs));
 });
 // Per-lead receipt consumed by research/ai_review.py.
 if(receipt){
   const rows=[...results.map(r=>({kind:'moveStages',...r})),...entries.map(r=>({kind:'entryStages',...r})),...residuals.map(r=>({kind:'residualHp',...r}))];
   require('node:fs').writeFileSync(receipt,JSON.stringify({rows},null,1)+'\n');
 }
 return results;
};
module.exports.STAT_PREDICTIONS=STAT_PREDICTIONS;
