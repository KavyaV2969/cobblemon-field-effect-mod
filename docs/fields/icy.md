# Icy Field

Original ID: `ICY`; datapack ID: `rejuvenation:icy`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "The field is covered in ice."

Nature Power: `icebeam`. Secret Power animation/reference move: `iceshard`.

Secret Power actual secondary choices: `[{"status":"frz"}]`.

Mimicry type: `Ice`; Burmy cloak reference: `SANDYCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"elementalseed","effect":null,"duration":0,"message":null,"stats":{"spe":2}}`. Seed actions: `[{"op":"spikeDamage","message":"{1} was hurt by the icy spikes!"}]`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{"matchagotcha":1.3},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"},"snow":{"duration":8,"sourceMoves":["snowscape","chillyreception"],"sourceAbilities":["snowwarning"],"source":"Battle_MoveEffects.rb:6202; Battler.rb:2937-2994"},"hail":{"duration":8,"sourceMoves":["hail","snowscape","chillyreception"],"sourceAbilities":["snowwarning","hailwarning"],"source":"Battle_MoveEffects.rb:6262; Battler.rb:2937-2994"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `null` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The terrain returned to normal."`.

Shared stat pools: `null`. Absorber policies: `null`. Indirect immunity: `null`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":5,"extendedBy":3,"blockEverstone":false}],"source":"Battler.rb:3926"}}}`. Inactive abilities: `null`. Status type bypass: `null`.

Field form typing: `["arceus","silvally"]`. Custom volatile rules: `null`. Rampage policy: `null`.

Progression: `null`. Party roles: `null`.

Field clock policy: `null`.

Fields persist for the battle unless transformed/destroyed. Move/ability terrain creation uses its own finite duration; engine stack restoration and overlay clocks are described in ARCHITECTURE.md.

## Core move rules

| Move ID | Executable properties and exact source text |
|---|---|
| `bittermalice` | {"multiplier":1.5,"message":"The cold strengthened the attack!"} |
| `chillingwater` | {"multiplier":1.5,"message":"The cold strengthened the attack!"} |
| `scald` | {"multiplier":0.5,"message":"The cold softened the attack...","counter":{"index":1,"amount":1,"maximum":2,"message":"Parts of the ice melted!"},"transition":{"field":"rejuvenation:water_surface","condition":{"counter":{"index":1,"op":">","value":1}},"push":false,"message":"The hot water melted the ice!"}} |
| `steameruption` | {"multiplier":0.5,"message":"The cold softened the attack...","counter":{"index":1,"amount":2,"maximum":2,"message":null},"transition":{"field":"rejuvenation:water_surface","condition":{"counter":{"index":1,"op":">","value":1}},"push":false,"message":"The hot water melted the ice!"}} |
| `hydrosteam` | {"multiplier":0.5,"message":"The cold softened the attack...","counter":{"index":1,"amount":1,"maximum":2,"message":"Parts of the ice melted!"},"transition":{"field":"rejuvenation:water_surface","condition":{"counter":{"index":1,"op":">","value":1}},"push":false,"message":"The hot water melted the ice!"}} |
| `earthquake` | {"after":[{"op":"ice_spikes"}],"transition":{"field":"rejuvenation:indoor","condition":{"all":[{"any":[{"backup":"rejuvenation:water_surface"},{"backup":"rejuvenation:murkwater_surface"}]},{"any":[{"not":{"move":"dive"}},{"counter":{"index":1,"op":"==","value":3}}]}]},"push":false,"message":"The quake broke up the ice and revealed the water beneath!"}} |
| `bulldoze` | {"after":[{"op":"ice_spikes"}],"transition":{"field":"rejuvenation:indoor","condition":{"all":[{"any":[{"backup":"rejuvenation:water_surface"},{"backup":"rejuvenation:murkwater_surface"}]},{"any":[{"not":{"move":"dive"}},{"counter":{"index":1,"op":"==","value":3}}]}]},"push":false,"message":"The quake broke up the ice and revealed the water beneath!"}} |
| `magnitude` | {"after":[{"op":"ice_spikes"}],"transition":{"field":"rejuvenation:indoor","condition":{"all":[{"any":[{"backup":"rejuvenation:water_surface"},{"backup":"rejuvenation:murkwater_surface"}]},{"any":[{"not":{"move":"dive"}},{"counter":{"index":1,"op":"==","value":3}}]}]},"push":false,"message":"The quake broke up the ice and revealed the water beneath!"}} |
| `fissure` | {"after":[{"op":"ice_spikes"}],"transition":{"field":"rejuvenation:indoor","condition":{"all":[{"any":[{"backup":"rejuvenation:water_surface"},{"backup":"rejuvenation:murkwater_surface"}]},{"any":[{"not":{"move":"dive"}},{"counter":{"index":1,"op":"==","value":3}}]}]},"push":false,"message":"The quake broke up the ice and revealed the water beneath!"}} |
| `tectonicrage` | {"after":[{"op":"ice_spikes"}],"transition":{"field":"rejuvenation:indoor","condition":{"all":[{"any":[{"backup":"rejuvenation:water_surface"},{"backup":"rejuvenation:murkwater_surface"}]},{"any":[{"not":{"move":"dive"}},{"counter":{"index":1,"op":"==","value":3}}]}]},"push":false,"message":"The quake broke up the ice and revealed the water beneath!"}} |
| `matchagotcha` | {"counter":{"index":1,"amount":1,"maximum":2,"message":"Parts of the ice melted!"},"transition":{"field":"rejuvenation:water_surface","condition":{"counter":{"index":1,"op":">","value":1}},"push":false,"message":"The hot tea melted the ice!"}} |
| `dive` | {"transition":{"field":"rejuvenation:indoor","condition":{"all":[{"any":[{"backup":"rejuvenation:water_surface"},{"backup":"rejuvenation:murkwater_surface"}]},{"any":[{"not":{"move":"dive"}},{"counter":{"index":1,"op":"==","value":3}}]}]},"push":false,"message":"The ice was broken from underneath!"}} |
| `heatwave` | {"transition":{"field":"rejuvenation:cave","condition":{"always":true},"push":false,"message":"The ice melted away!"}} |
| `eruption` | {"transition":{"field":"rejuvenation:cave","condition":{"always":true},"push":false,"message":"The ice melted away!"}} |
| `searingshot` | {"transition":{"field":"rejuvenation:cave","condition":{"always":true},"push":false,"message":"The ice melted away!"}} |
| `flameburst` | {"transition":{"field":"rejuvenation:cave","condition":{"always":true},"push":false,"message":"The ice melted away!"}} |
| `lavaplume` | {"transition":{"field":"rejuvenation:cave","condition":{"always":true},"push":false,"message":"The ice melted away!"}} |
| `firepledge` | {"transition":{"field":"rejuvenation:cave","condition":{"always":true},"push":false,"message":"The ice melted away!"}} |
| `mindblown` | {"transition":{"field":"rejuvenation:cave","condition":{"always":true},"push":false,"message":"The ice melted away!"}} |
| `incinerate` | {"transition":{"field":"rejuvenation:cave","condition":{"always":true},"push":false,"message":"The ice melted away!"}} |
| `infernooverdrive` | {"transition":{"field":"rejuvenation:cave","condition":{"always":true},"push":false,"message":"The ice melted away!"}} |
| `burningjealousy` | {"transition":{"field":"rejuvenation:cave","condition":{"always":true},"push":false,"message":"The ice melted away!"}} |
| `magmadrift` | {"transition":{"field":"rejuvenation:cave","condition":{"always":true},"push":false,"message":"The ice melted away!"}} |
| `ragingfury` | {"transition":{"field":"rejuvenation:cave","condition":{"always":true},"push":false,"message":"The ice melted away!"}} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Ice"} | {"condition":{"always":true},"multiplier":1.5,"message":"The cold strengthened the attack!"} |
| {"moveType":"Fire"} | {"condition":{"always":true},"multiplier":0.5,"message":"The cold softened the attack..."} |
| {"moveType":"Rock"} | {"condition":{"always":true},"additionalType":"ICE"} |

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "residual" | {"ability":{"who":"user","values":["icebody"]}} | [{"op":"heal","fraction":0.0625,"message":"{1} was healed a little by the snow!"}] | "Battle.rb:6014" |
| "defense" | {"all":[{"type":{"who":"user","value":"Ice"}},{"weatherFor":{"who":"target","values":["hail"]}}]} | [{"op":"multiply","value":1.5}] | "Battle_Field.rb:1108" |
| "speed" | {"all":[{"ability":{"who":"user","values":["slushrush"]}},{"not":{"weather":["hail","snow"]}},{"always":true}]} | [{"op":"multiply","value":2}] | "Battle_Effects.rb:1411-1440" |
| "modifyMove" | {"move":"auroraveil"} | [{"op":"moveProperty","path":"sideCondition","value":"auroraveil","removeCallback":"onTry"}] | "Battle_MoveEffects.rb:7724" |
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
| "chargeMove" | {"all":[{"move":"razorwind"},{"overlay":"rejuvenation:grassy_terrain"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4430" |
| "chargeMove" | {"all":[{"any":[{"move":"solarbeam"},{"move":"solarblade"}]},{"overlay":"rejuvenation:rainbow"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4472" |
| "modifyMove" | {"all":[{"move":"mist"},{"not":{"sideCondition":"mist"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"createField","field":"rejuvenation:misty_terrain","duration":3,"extendedBy":3,"message":"Mist swirled around the battlefield!"}]}] | "Battle_MoveEffects.rb:1817" |
| "modifyMove" | {"move":"bittermalice"} | [{"op":"moveBehavior","recipe":"appendSecondaryActions","actions":[{"op":"conditional","condition":{"chance":{"numerator":1,"denominator":10}},"actions":[{"op":"status","status":"frz","who":"target"}]}]}] | "Battle_MoveEffects.rb:1374" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |

## Original status-move highlights

Source UI buff highlights: `["hail","auroraveil","snowscape","chillyreception","matchagotcha"]`.

Source UI nerf highlights: `[]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["auroraveil"],"unreviewedHighlightedMoves":["chillyreception","hail","matchagotcha","snowscape"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Battle.rb:6016 | [:ICY, :SNOWYMOUNTAIN, :FROZENDIMENSION].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6530 | i.ability == :HEATPROOF \|\| @field.effect == :ICY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:1192 | [:SNOWYMOUNTAIN, :ICY].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:1438 | [:ICY, :SNOWYMOUNTAIN, :FROZENDIMENSION].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:642 | Rejuv && @field.effect == :ICY && [:WATERSURFACE, :MURKWATERSURFACE, :CAVE].include?(@battle.field.backup) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:1109 | :SNOWYMOUNTAIN, :ICY | implemented_and_tested | Snowy Mountain/Icy grant Ice defenders 1.5 only to physical defense under attacker-relative Hail. Mega Sol weather override and ordinary weather suppression are preserved. Tests: every compiled field defense branch uses the source type, stat and weather gates, Mega Sol overrides hail for field defense, Deux Finalis defense uses attacker-relative weather |
| Battle_Inspect.rb:87 | self.ability == :SNOWCLOAK && ([:HAIL, :SNOW].include?(@battle.pbWeather(nil)) \|\| [:ICY, :SNOWYMOUNTAIN].include?(@battle.FE)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:523 | @battle.FE == :SNOWYMOUNTAIN \|\| @battle.FE == :ICY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:913 | opponent.ability == :SNOWCLOAK && ([:HAIL, :SNOW].include?(@battle.pbWeather(attacker)) \|\| [:ICY, :SNOWYMOUNTAIN, :FROZENDIMENSION].include?(@battle.FE) \|\| opponent.crested == :GLACEON) && !opponent.moldbroken | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1256 | [:ICY, :SNOWYMOUNTAIN, :FROZENDIMENSION].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1374 | @move == :BITTERMALICE && [:ICY, :SNOWYMOUNTAIN].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:4773 | Rejuv && @battle.FE == :ICY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:4779 | Rejuv && @battle.FE == :ICY && [:WATERSURFACE, :MURKWATERSURFACE].include?(@battle.field.backup) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6202 | attacker.hasWorkingItem(:ICYROCK) \|\| [:ICY, :SNOWYMOUNTAIN, :FROZENDIMENSION, :SKY, :CLOUDS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6262 | attacker.hasWorkingItem(:ICYROCK) \|\| [:ICY, :SNOWYMOUNTAIN, :FROZENDIMENSION, :SKY, :CLOUDS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7724 | [:DARKCRYSTALCAVERN, :RAINBOW, :ICY, :CRYSTALCAVERN, :SNOWYMOUNTAIN, :MIRROR, :STARLIGHT, :FROZENDIMENSION].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:9564 | attacker.hasWorkingItem(:ICYROCK) \|\| [:ICY, :SNOWYMOUNTAIN, :FROZENDIMENSION, :SKY, :CLOUDS, :BIGTOP].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:9726 | @healed && [:SNOWYMOUNTAIN, :ICY].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2982 | self.hasWorkingItem(:ICYROCK) \|\| [:ICY, :SNOWYMOUNTAIN, :FROZENDIMENSION, :SKY, :CLOUDS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:4199 | :ICY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7057 | @battle.FE == :ICY && !user.isAirborne? | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Rejuv/Battle/Battle.rb:26 | [:ICY, :SNOWYMOUNTAIN, :FROZENDIMENSION, :SKY, :CLOUDS].include?(@field.effect) | excluded_crest | These field duration clauses are wholly inside pbCrestEffects, guarded by crested and selected by the Castform Crest. Ordinary weather extensions are audited separately. Tests:  |

AI source leads: 21. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":["magmadrift"],"abilities":["gravitycontrol","hailwarning"],"items":[]}`.
