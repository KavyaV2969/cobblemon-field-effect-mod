# Water Surface

Original ID: `WATERSURFACE`; datapack ID: `rejuvenation:water_surface`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "The water's surface is calm."

Nature Power: `whirlpool`. Secret Power animation/reference move: `aquajet`.

Secret Power actual secondary choices: `[{"boosts":{"spe":-1}}]`.

Mimicry type: `Water`; Burmy cloak reference: `PLANTCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"elementalseed","effect":"aquaring","duration":true,"message":"{1} surrounded itself with a veil of water!","stats":{"spd":1}}`. Seed actions: `null`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{"aquaring":2},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{"whirlpool":1},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `{"cobblemon:dive_ball":3.5}` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The terrain returned to normal."`.

Shared stat pools: `null`. Absorber policies: `null`. Indirect immunity: `null`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"grounded":{"who":"user","value":true}},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"grounded":{"who":"user","value":true}},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"grounded":{"who":"user","value":true}},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"grounded":{"who":"user","value":true}},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":5,"extendedBy":3,"blockEverstone":false}],"source":"Battler.rb:3926"}}}`. Inactive abilities: `null`. Status type bypass: `null`.

Field form typing: `["arceus","silvally"]`. Custom volatile rules: `null`. Rampage policy: `null`.

Progression: `null`. Party roles: `null`.

Field clock policy: `null`.

Fields persist for the battle unless transformed/destroyed. Move/ability terrain creation uses its own finite duration; engine stack restoration and overlay clocks are described in ARCHITECTURE.md.

## Core move rules

| Move ID | Executable properties and exact source text |
|---|---|
| `whirlpool` | {"multiplier":1.2,"message":"The attack rode the current!"} |
| `surf` | {"multiplier":1.2,"message":"The attack rode the current!"} |
| `muddywater` | {"multiplier":1.2,"message":"The attack rode the current!"} |
| `dive` | {"multiplier":1.2,"message":"The attack rode the current!","transition":{"field":"rejuvenation:underwater","condition":{"always":true},"push":false,"message":"The battle was pulled underwater!"}} |
| `sludgewave` | {"multiplier":1.2,"message":"Poison spread through the water!","counter":{"index":1,"amount":1,"maximum":2,"message":"Poison spread through the water!"},"transition":{"field":"rejuvenation:murkwater_surface","condition":{"counter":{"index":1,"op":">","value":1}},"push":false,"message":"The water was polluted!"}} |
| `octazooka` | {"multiplier":1.2} |
| `originpulse` | {"multiplier":1.2,"message":"The attack rode the current!"} |
| `hydrovortex` | {"multiplier":1.2,"message":"The attack rode the current!"} |
| `tripledive` | {"multiplier":1.2,"message":"The attack rode the current!","transition":{"field":"rejuvenation:underwater","condition":{"always":true},"push":false,"message":"The battle was pulled underwater!"}} |
| `spikes` | {"multiplier":0,"message":"...The spikes sank into the water and vanished!"} |
| `toxicspikes` | {"multiplier":0,"message":"...The spikes sank into the water and vanished!"} |
| `aciddownpour` | {"counter":{"index":1,"amount":2,"maximum":2,"message":null},"transition":{"field":"rejuvenation:murkwater_surface","condition":{"counter":{"index":1,"op":">","value":1}},"push":false,"message":"The water was polluted!"}} |
| `gravity` | {"transition":{"field":"rejuvenation:underwater","condition":{"always":true},"push":false,"message":"The battle sank into the depths!"}} |
| `anchorshot` | {"transition":{"field":"rejuvenation:underwater","condition":{"always":true},"push":false,"message":"The battle was pulled underwater!"}} |
| `gravapple` | {"transition":{"field":"rejuvenation:underwater","condition":{"always":true},"push":false,"message":"The battle sank into the depths!"}} |
| `blizzard` | {"transition":{"field":"rejuvenation:icy","condition":{"always":true},"push":true,"message":"The water froze over!"}} |
| `glaciate` | {"transition":{"field":"rejuvenation:icy","condition":{"always":true},"push":true,"message":"The water froze over!"}} |
| `subzeroslammer` | {"transition":{"field":"rejuvenation:icy","condition":{"always":true},"push":true,"message":"The water froze over!"}} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Water"} | {"condition":{"always":true},"multiplier":1.5,"message":"The water strengthened the attack!"} |
| {"moveType":"Electric"} | {"condition":{"not":{"grounded":{"who":"target","value":false}}},"multiplier":1.5,"message":"The water conducted the attack!"} |
| {"moveType":"Fire"} | {"condition":{"not":{"grounded":{"who":"target","value":false}}},"multiplier":0.5,"message":"The water deluged the attack..."} |
| {"moveType":"Ground"} | {"condition":{"always":true},"multiplier":0,"message":"...But there was no solid ground to attack from!"} |

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "residual" | {"all":[{"ability":{"who":"user","values":["waterabsorb","dryskin"]}},{"grounded":{"who":"user","value":true}}]} | [{"op":"heal","fraction":0.0625,"message":"{1} absorbed some of the water!"}] | "Battle.rb:6090" |
| "residual" | {"all":[{"ability":{"who":"user","values":["watercompaction"]}},{"grounded":{"who":"user","value":true}}]} | [{"op":"boost","stats":{"def":2}}] | "Battle.rb:6165" |
| "modifyMove" | {"any":[{"move":"shoreup"}]} | [{"op":"moveType","type":"Water"}] | "Battle_Move.rb:257" |
| "speed" | {"all":[{"grounded":{"who":"user","value":true}},{"not":{"type":{"who":"user","value":"Water"}}},{"not":{"ability":{"who":"user","values":["surgesurfer","swiftswim"]}}}]} | [{"op":"multiply","value":0.75}] | "Battler.rb:1187-1215" |
| "residual" | {"volatile":{"who":"user","id":"tarshot"}} | [{"op":"removeVolatile","id":"tarshot","message":"The tar washed off {1} in the water!"}] | "Battle.rb:6098" |
| "residual" | {"all":[{"ability":{"who":"user","values":["steamengine"]}},{"turnsActive":{"op":">","value":0}}]} | [{"op":"boost","stats":{"spe":1}}] | "Battle.rb:6251" |
| "speed" | {"all":[{"ability":{"who":"user","values":["swiftswim"]}},{"not":{"all":[{"weather":["raindance","primordialsea"]},{"not":{"item":{"who":"user","values":["utilityumbrella"]}}}]}},{"grounded":{"who":"user","value":true}}]} | [{"op":"multiply","value":2}] | "Battle_Effects.rb:1411-1440" |
| "speed" | {"all":[{"ability":{"who":"user","values":["surgesurfer"]}},{"grounded":{"who":"user","value":true}},{"not":{"overlay":"rejuvenation:electric_terrain"}}]} | [{"op":"multiply","value":2}] | "Battle_Effects.rb:1444" |
| "residual" | {"all":[{"ability":{"who":"user","values":["hydration"]}},{"grounded":{"who":"user","value":true}}]} | [{"op":"cureStatus"}] | "Battle_Effects.rb:1372-1380" |
| "residual" | {"all":[{"ability":{"who":"user","values":["waterveil"]}},{"always":true}]} | [{"op":"cureStatus"}] | "Battle_Effects.rb:1372-1380" |
| "modifyMove" | {"move":"takeheart"} | [{"op":"moveBehavior","recipe":"cureAndBoost","stats":{"spa":2,"spd":2}}] | "Battle_MoveEffects.rb:9231" |
| "overlayIn" | {"all":[{"overlay":"rejuvenation:psychic_terrain"},{"ability":{"who":"user","values":["anticipation","forewarn"]}}]} | [{"op":"boost","stats":{"spa":1}}] | "Battler.rb:2644-2652" |
| "overlayIn" | {"all":[{"overlay":"rejuvenation:misty_terrain"},{"ability":{"who":"user","values":["watercompaction"]}}]} | [{"op":"boost","stats":{"def":2}}] | "Battler.rb:2654-2662" |
| "modifyMove" | {"move":"firepledge"} | [{"op":"removeCallbacks","callbacks":["onPrepareHit","onModifyMove","basePowerCallback"]}] | "Battle_MoveEffects.rb:6383-6410" |
| "afterMove" | {"all":[{"move":"firepledge"},{"missed":false}]} | [{"op":"pairField","memory":"pledge","token":"firepledge","pairs":[{"with":"grasspledge","field":"rejuvenation:volcanic","message":"The pledges combined and set the field ablaze!","refreshMessage":"The pledges combined and fanned the flames!"},{"with":"waterpledge","field":"rejuvenation:rainbow","message":"The pledges combined to form a rainbow!","refreshMessage":"The pledges combined to refresh the rainbow!"}],"duration":4,"extendedBy":3,"firstMessage":"The Fire Pledge lingers in the air...","permanentMessage":"The pledges combined!"}] | "Battle_Field.rb:506-540" |
| "modifyMove" | {"move":"grasspledge"} | [{"op":"removeCallbacks","callbacks":["onPrepareHit","onModifyMove","basePowerCallback"]}] | "Battle_MoveEffects.rb:6383-6410" |
| "afterMove" | {"all":[{"move":"grasspledge"},{"missed":false}]} | [{"op":"pairField","memory":"pledge","token":"grasspledge","pairs":[{"with":"firepledge","field":"rejuvenation:volcanic","message":"The pledges combined and set the field ablaze!","refreshMessage":"The pledges combined and fanned the flames!"},{"with":"waterpledge","field":"rejuvenation:swamp","message":"The pledges combined and formed a swamp!","refreshMessage":"The pledges combined and reinforced the swamp!"}],"duration":4,"extendedBy":3,"firstMessage":"The Grass Pledge lingers in the air...","permanentMessage":"The pledges combined!"}] | "Battle_Field.rb:506-540" |
| "modifyMove" | {"move":"waterpledge"} | [{"op":"removeCallbacks","callbacks":["onPrepareHit","onModifyMove","basePowerCallback"]}] | "Battle_MoveEffects.rb:6383-6410" |
| "afterMove" | {"all":[{"move":"waterpledge"},{"missed":false}]} | [{"op":"pairField","memory":"pledge","token":"waterpledge","pairs":[{"with":"firepledge","field":"rejuvenation:rainbow","message":"The pledges combined to form a rainbow!","refreshMessage":"The pledges combined to refresh the rainbow!"},{"with":"grasspledge","field":"rejuvenation:swamp","message":"The pledges combined and formed a swamp!","refreshMessage":"The pledges combined and reinforced the swamp!"}],"duration":4,"extendedBy":3,"firstMessage":"The Water Pledge lingers in the air...","permanentMessage":"The pledges combined!"}] | "Battle_Field.rb:506-540" |
| "afterMove" | {"all":[{"move":"conversion"},{"missed":false},{"not":{"item":{"who":"user","values":["everstone"]}}}]} | [{"op":"pairField","memory":"conversion","token":"conversion","pairs":[{"with":"conversion2","field":"rejuvenation:glitch","message":"TH~ R0GUE DAa/ta cor$upt?@####","refreshMessage":"TH~ R0GUE DAa/ta cor$upt?@####"}],"duration":5,"extendedBy":3,"firstMessage":"Some rogue data remains...","permanentMessage":"TH~ R0GUE DAa/ta cor$upt?@####","disallowPermanentField":"rejuvenation:glitch"}] | "Battle_Field.rb:544-562; Battle_MoveEffects.rb:2061-2107" |
| "afterMove" | {"all":[{"move":"conversion2"},{"missed":false},{"not":{"item":{"who":"user","values":["everstone"]}}}]} | [{"op":"pairField","memory":"conversion","token":"conversion2","pairs":[{"with":"conversion","field":"rejuvenation:glitch","message":"TH~ R0GUE DAa/ta cor$upt?@####","refreshMessage":"TH~ R0GUE DAa/ta cor$upt?@####"}],"duration":5,"extendedBy":3,"firstMessage":"Some rogue data remains...","permanentMessage":"TH~ R0GUE DAa/ta cor$upt?@####","disallowPermanentField":"rejuvenation:glitch"}] | "Battle_Field.rb:544-562; Battle_MoveEffects.rb:2061-2107" |
| "chargeMove" | {"move":"dive"} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4756" |
| "chargeMove" | {"all":[{"move":"razorwind"},{"overlay":"rejuvenation:grassy_terrain"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4430" |
| "chargeMove" | {"all":[{"any":[{"move":"solarbeam"},{"move":"solarblade"}]},{"overlay":"rejuvenation:rainbow"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4472" |
| "modifyMove" | {"all":[{"move":"mist"},{"not":{"sideCondition":"mist"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"createField","field":"rejuvenation:misty_terrain","duration":3,"extendedBy":3,"message":"Mist swirled around the battlefield!"}]}] | "Battle_MoveEffects.rb:1817" |
| "modifyMove" | {"move":"wavecrash"} | [{"op":"moveProperty","path":"recoil","value":[1,4]}] | "Battle_MoveEffects.rb:125" |
| "modifyMove" | {"move":"splash"} | [{"op":"moveBehavior","recipe":"otherActiveHitActions","actions":[{"op":"boost","stats":{"accuracy":-1},"who":"target"}],"failureMessage":"But nothing happened!"}] | "Battle_MoveEffects.rb:136" |
| "modifyMove" | {"move":"wavecrash"} | [{"op":"moveProperty","path":"recoil","value":[1,4]}] | "Battle_MoveEffects.rb:125" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "modifyMove" | {"move":"lifedew"} | [{"op":"moveBehavior","recipe":"targetHealing","fraction":0.25,"userFraction":0.25,"actions":[{"op":"conditional","condition":{"samePokemon":true},"actions":[{"op":"volatile","id":"aquaring","who":"target"}]}]}] | "Battle_MoveEffects.rb:8674" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["gulpmissile"]}},{"species":{"who":"user","value":"cramorant"}},{"formName":{"who":"user","value":"Gorging"}}]} | [{"op":"form","species":"cramorantgulping"}] | "Battler.rb:1720-1729" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |

## Original status-move highlights

Source UI buff highlights: `["splash","aquaring","lifedew","takeheart"]`.

Source UI nerf highlights: `[]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["lifedew","takeheart"],"unreviewedHighlightedMoves":["aquaring","splash"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Balls.rb:143 | battle.environment == :Underwater \|\| [:WATERSURFACE, :UNDERWATER].include?(battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:3176 | [:WATERSURFACE, :MURKWATERSURFACE, :SKY, :CLOUDS].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:3260 | [:WATERSURFACE, :MURKWATERSURFACE, :SKY, :CLOUDS].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6084 | [:WATERSURFACE, :UNDERWATER].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6141 | [:SWAMP, :WATERSURFACE, :UNDERWATER, :MURKWATERSURFACE].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6212 | [:BURNING, :VOLCANIC, :VOLCANICTOP, :WATERSURFACE, :UNDERWATER, :INFERNAL].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6659 | [:WATERSURFACE, :UNDERWATER].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:1193 | [:MISTY, :SWAMP, :WATERSURFACE, :UNDERWATER].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:1375 | @battle.FE == :WATERSURFACE && !self.isAirborne? | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:1378 | self.ability == :WATERVEIL && [:WATERSURFACE, :UNDERWATER].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:1424 | [:WATERSURFACE, :MURKWATERSURFACE].include?(@battle.FE) && !self.isAirborne? | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:1445 | [:WATERSURFACE, :MURKWATERSURFACE].include?(@battle.FE) && !self.isAirborne? | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:642 | Rejuv && @field.effect == :ICY && [:WATERSURFACE, :MURKWATERSURFACE, :CAVE].include?(@battle.field.backup) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:260 | :WATERSURFACE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1546 | ((@battle.FE == :WATERSURFACE && !attacker.isAirborne?) \|\| @battle.FE == :UNDERWATER) && attacker.ability == :TORRENT && type == :WATER | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1598 | [:WATERSURFACE, :UNDERWATER].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:125 | @move == :WAVECRASH && [:WATERSURFACE, :UNDERWATER].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:136 | @battle.FE == :WATERSURFACE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:4720 | [:WATERSURFACE, :MURKWATERSURFACE].include?(@battle.FE) && self.pbType(attacker, self.type) == :GROUND | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:4756 | [:WATERSURFACE, :UNDERWATER].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:4779 | Rejuv && @battle.FE == :ICY && [:WATERSURFACE, :MURKWATERSURFACE].include?(@battle.field.backup) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:5013 | (!Rejuv && @battle.FE == :WATERSURFACE) \|\| @battle.FE == :UNDERWATER | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6292 | [:WATERSURFACE, :MURKWATERSURFACE].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8099 | [:WATERSURFACE, :MURKWATERSURFACE].include?(@battle.FE) && attacker.ability == :WATERCOMPACTION | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8682 | @battle.FE == :WATERSURFACE && opponent == attacker && !opponent.effects[:AquaRing] && @move == :LIFEDEW | implemented_and_tested | Life Dew extra poison or user Aqua Ring runs only on targets that passed the source canHeal gate. Full HP, Heal Block and unprotected Petrification do not gain a field reaction. Tests: Life Dew field reactions require the source per-target canHeal gate |
| Battle_MoveEffects.rb:9231 | [:WATERSURFACE, :UNDERWATER, :HOLY, :NEWWORLD].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:1192 | :WATERSURFACE, :MURKWATERSURFACE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:1721 | [:SWAMP, :WATERSURFACE, :UNDERWATER].include?(@battle.FE) | implemented_and_tested | Surf/Dive catch form overrides: aquatic fields choose Gulping; electrical/mechanical fields choose Gorging; other fields retain native HP selection. Tests: field Gulp Missile selects its source forme rather than the HP-based native forme |
| Battler.rb:1739 | (self.hp > schoolHP && self.level > 19) \|\| @battle.FE == :UNDERWATER \|\| ([:WATERSURFACE, :MURKWATERSURFACE].include?(@battle.FE) && !self.isAirborne?) | implemented_and_tested | Schooling permits low level/HP Underwater, or grounded water-surface fields; reverts when neither the environmental nor canonical HP/level condition holds. Form-specific start and stop text emits once. Tests: Schooling ignores low HP and level in aquatic fields but reverts on dry ground |
| Battler.rb:3890 | [:WATERSURFACE, :SWAMP, :MURKWATERSURFACE].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |

AI source leads: 28. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":[],"abilities":["gravitycontrol"],"items":[]}`.
