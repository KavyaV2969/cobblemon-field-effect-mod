# Infernal Field

Original ID: `INFERNAL`; datapack ID: `rejuvenation:infernal`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "The souls of the damned burn on..."

Nature Power: `punishment`. Secret Power animation/reference move: `inferno`.

Secret Power actual secondary choices: `[{"status":"brn"}]`.

Mimicry type: `Fire`; Burmy cloak reference: `SANDYCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"elementalseed","effect":null,"duration":null,"message":"{1} can't escape now!","stats":{"atk":1,"spa":1}}`. Seed actions: `[{"op":"volatile","id":"trapped"}]`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":true,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `null` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The terrain returned to normal."`.

Shared stat pools: `null`. Absorber policies: `null`. Indirect immunity: `null`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"pastelveil":{"onStart":{"mode":"replace","condition":{"always":true},"actions":[],"source":"Battler.rb:3042"},"onUpdate":{"mode":"replace","condition":{"always":true},"actions":[],"source":"Battler.rb:3042"},"onAllySwitchIn":{"mode":"replace","condition":{"always":true},"actions":[],"source":"Battler.rb:3042"},"onSetStatus":{"mode":"replace","condition":{"always":true},"actions":[],"source":"Battler.rb:3042"},"onAllySetStatus":{"mode":"replace","condition":{"always":true},"actions":[],"source":"Battler.rb:3042"}},"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":5,"extendedBy":3,"blockEverstone":false}],"source":"Battler.rb:3926"}}}`. Inactive abilities: `null`. Status type bypass: `null`.

Field form typing: `["arceus","silvally"]`. Custom volatile rules: `null`. Rampage policy: `null`.

Progression: `null`. Party roles: `null`.

Field clock policy: `null`.

Fields persist for the battle unless transformed/destroyed. Move/ability terrain creation uses its own finite duration; engine stack restoration and overlay clocks are described in ARCHITECTURE.md.

## Core move rules

| Move ID | Executable properties and exact source text |
|---|---|
| `punishment` | {"multiplier":2.0,"message":"Hellish suffering!"} |
| `smog` | {"multiplier":2.0,"message":"Hellish suffering!"} |
| `dreameater` | {"multiplier":2.0,"message":"Hellish suffering!"} |
| `blastburn` | {"multiplier":1.5,"message":"Infernal flames strengthened the attack"} |
| `eartpower` | {"multiplier":1.5,"message":"Infernal flames strengthened the attack"} |
| `infernooverdrive` | {"multiplier":1.5,"message":"Infernal flames strengthened the attack"} |
| `precipiceblades` | {"multiplier":1.5,"message":"Infernal flames strengthened the attack"} |
| `inferno` | {"multiplier":1.5,"accuracy":0,"message":"Infernal flames strengthened the attack"} |
| `ragingfury` | {"multiplier":1.5,"message":"Infernal flames strengthened the attack"} |
| `infernalparade` | {"multiplier":1.5,"message":"Infernal flames strengthened the attack"} |
| `willowisp` | {"accuracy":0} |
| `darkvoid` | {"accuracy":0} |
| `spiritbreak` | {"additionalType":"DARK"} |
| `aurasphere` | {"additionalType":"DARK"} |
| `frustration` | {"additionalType":"DARK"} |
| `glaciate` | {"transition":{"field":"rejuvenation:dimensional","condition":{"always":true},"push":false,"message":"The hellish landscape was doused of its fire!"}} |
| `judgment` | {"transition":{"field":"rejuvenation:volcanic_top","condition":{"always":true},"push":false,"message":"The hellish landscape was purified!"}} |
| `originpulse` | {"transition":{"field":"rejuvenation:volcanic_top","condition":{"always":true},"push":false,"message":"The hellish landscape was purified!"}} |
| `purify` | {"transition":{"field":"rejuvenation:volcanic_top","condition":{"always":true},"push":false,"message":"The hellish landscape was purified!"}} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Fire"} | {"condition":{"always":true},"multiplier":1.5,"message":"The infernal flames strengthened the attack!"} |
| {"moveType":"Dark"} | {"condition":{"always":true},"multiplier":1.5,"message":"The infernal flames strengthened the attack!"} |
| {"moveType":"Fairy"} | {"condition":{"category":"Special"},"multiplier":0.5,"message":"The hellfire burnt out the attack!"} |
| {"moveType":"Water"} | {"condition":{"always":true},"multiplier":0.5,"message":"The hellfire burnt out the attack!"} |
| {"moveType":"Ground"} | {"condition":{"always":true},"additionalType":"FIRE"} |
| {"moveType":"Steel"} | {"condition":{"always":true},"additionalType":"FIRE"} |
| {"moveType":"Rock"} | {"condition":{"always":true},"additionalType":"FIRE"} |

## Type-chart exceptions

| Attacking type | Defending type | Result exponent / immunity | Condition |
|---|---|---|---|
| "Fire" | "Ghost" | 1 | {"always":true} |

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "modifyMove" | {"move":"infernalparade"} | [{"op":"secondaryChance","chance":100}] | "Battle_Move.rb:2336" |
| "activate" | {"all":[{"weather":["hail"]},{"not":{"globalAbility":["tempest"]}}]} | [{"op":"clearWeather","message":"The hail melted away!"}] | "Battle_Field.rb:215-232" |
| "weatherChange" | {"all":[{"weather":["hail"]},{"not":{"globalAbility":["tempest"]}}]} | [{"op":"clearWeather","message":"The hail melted away!"}] | "Battle_Field.rb:215-232" |
| "activate" | {"all":[{"weather":["snow"]},{"not":{"globalAbility":["tempest"]}}]} | [{"op":"clearWeather","message":"The snow melted away!"}] | "Battle_Field.rb:215-232" |
| "weatherChange" | {"all":[{"weather":["snow"]},{"not":{"globalAbility":["tempest"]}}]} | [{"op":"clearWeather","message":"The snow melted away!"}] | "Battle_Field.rb:215-232" |
| "activate" | {"all":[{"weather":["raindance"]},{"not":{"globalAbility":["tempest"]}}]} | [{"op":"clearWeather","message":"The rain evaporated!"}] | "Battle_Field.rb:215-232" |
| "weatherChange" | {"all":[{"weather":["raindance"]},{"not":{"globalAbility":["tempest"]}}]} | [{"op":"clearWeather","message":"The rain evaporated!"}] | "Battle_Field.rb:215-232" |
| "residual" | {"ability":{"who":"user","values":["souleater"]}} | [{"op":"heal","fraction":0.0625,"message":"{1} devoured spirits to recover!"}] | "Battle.rb:5850-6109" |
| "residual" | {"all":[{"all":[{"grounded":{"who":"user","value":true}},{"not":{"type":{"who":"user","value":"Fire"}}},{"not":{"volatile":{"who":"user","id":"aquaring"}}},{"not":{"volatile":{"who":"user","id":"dig"}}},{"not":{"volatile":{"who":"user","id":"dive"}}},{"not":{"ability":{"who":"user","values":["flareboost","magmaarmor","flamebody","flashfire","waterveil","magicguard","heatproof","waterbubble"]}}}]},{"ability":{"who":"user","values":["wellbakedbody"]}}]} | [{"op":"boost","stats":{"def":1}}] | "Battle.rb:5907" |
| "residual" | {"all":[{"all":[{"grounded":{"who":"user","value":true}},{"not":{"type":{"who":"user","value":"Fire"}}},{"not":{"volatile":{"who":"user","id":"aquaring"}}},{"not":{"volatile":{"who":"user","id":"dig"}}},{"not":{"volatile":{"who":"user","id":"dive"}}},{"not":{"ability":{"who":"user","values":["flareboost","magmaarmor","flamebody","flashfire","waterveil","magicguard","heatproof","waterbubble"]}}}]},{"not":{"ability":{"who":"user","values":["wellbakedbody"]}}}]} | [{"op":"residualDamage","type":"Fire","fraction":0.125,"modifiers":[{"condition":{"ability":{"who":"user","values":["leafguard","icebody","fluffy","grasspelt"]}},"multiplier":2},{"condition":{"volatile":{"who":"user","id":"tarshot"}},"multiplier":2}],"message":"The Pokémon were burned by the field!"}] | "Battle.rb:5913" |
| "residual" | {"all":[{"all":[{"grounded":{"who":"user","value":true}},{"not":{"type":{"who":"user","value":"Fire"}}},{"not":{"volatile":{"who":"user","id":"aquaring"}}},{"not":{"volatile":{"who":"user","id":"dig"}}},{"not":{"volatile":{"who":"user","id":"dive"}}},{"not":{"ability":{"who":"user","values":["flareboost","magmaarmor","flamebody","flashfire","waterveil","magicguard","heatproof","waterbubble"]}}}]},{"ability":{"who":"user","values":["thermalexchange"]}}]} | [{"op":"boost","stats":{"atk":1}}] | "Battle.rb:5921" |
| "residual" | {"ability":{"who":"user","values":["flashfire"]}} | [{"op":"flashFire","message":"The power of {1}'s Fire-type moves rose!"}] | "Battle.rb:5894" |
| "residual" | {"all":[{"volatile":{"who":"user","id":"torment"}},{"not":{"ability":{"who":"user","values":["magicguard"]}}}]} | [{"op":"residualDamage","fraction":0.125,"message":"{1} is hurt by Torment!"}] | "Battle.rb:6243" |
| "residual" | {"all":[{"ability":{"who":"user","values":["steamengine"]}},{"turnsActive":{"op":">","value":0}}]} | [{"op":"boost","stats":{"spe":1}}] | "Battle.rb:6251" |
| "switchIn" | {"ability":{"who":"user","values":["magmaarmor","flamebody","desolateland"]}} | [{"op":"boost","stats":{"def":1,"spd":1}}] | "Battler.rb:2385" |
| "modifyMove" | {"move":"infernalparade"} | [{"op":"moveProperty","path":"basePower","value":120,"removeCallback":"basePowerCallback"}] | "Battle_MoveEffects.rb:9201" |
| "setWeather" | {"incomingWeather":["hail"]} | [{"op":"message","text":"The hail melted away."},{"op":"reject"}] | "Battle.rb:367-406" |
| "setWeather" | {"incomingWeather":["snow"]} | [{"op":"message","text":"The snow melted away."},{"op":"reject"}] | "Battle.rb:367-406" |
| "setWeather" | {"incomingWeather":["raindance"]} | [{"op":"message","text":"The rain evaporated."},{"op":"reject"}] | "Battle.rb:367-406" |
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
| "tryHit" | {"all":[{"attackType":"Fire"},{"effectiveAbility":{"who":"target","values":["magmaarmor"]}},{"foe":true}]} | [{"op":"message","who":"target","text":"It doesn't affect {1}..."},{"op":"reject"}] | "Battle_Move.rb:673-676" |
| "chargeMove" | {"all":[{"move":"razorwind"},{"overlay":"rejuvenation:grassy_terrain"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4430" |
| "chargeMove" | {"all":[{"any":[{"move":"solarbeam"},{"move":"solarblade"}]},{"overlay":"rejuvenation:rainbow"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4472" |
| "modifyMove" | {"move":"hex"} | [{"op":"moveProperty","path":"basePower","value":130,"removeCallback":"basePowerCallback"}] | "Battle_MoveEffects.rb:2818" |
| "modifyMove" | {"all":[{"move":"mist"},{"not":{"sideCondition":"mist"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"createField","field":"rejuvenation:misty_terrain","duration":3,"extendedBy":3,"message":"Mist swirled around the battlefield!"}]}] | "Battle_MoveEffects.rb:1817" |
| "modifyMove" | {"move":"nastyplot"} | [{"op":"moveProperty","path":"boosts","value":{"spa":3}}] | "Battle_MoveEffects.rb:1131" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"species":{"who":"user","value":"eiscue"}},{"formName":{"who":"user","value":""}}]} | [{"op":"form","species":"eiscuenoice","message":"{1} transformed!"}] | "Battler.rb:1809-1816; 2746" |
| "residual" | {"all":[{"species":{"who":"user","value":"eiscue"}},{"formName":{"who":"user","value":""}}]} | [{"op":"form","species":"eiscuenoice","message":"{1} transformed!"}] | "Battler.rb:1809-1816; 2746" |

## Original status-move highlights

Source UI buff highlights: `["willowisp","darkvoid","torment","nightmare","stealthrock"]`.

Source UI nerf highlights: `["raindance","hail","snowscape","chillyreception"]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":[],"unreviewedHighlightedMoves":["chillyreception","darkvoid","hail","nightmare","raindance","snowscape","stealthrock","torment","willowisp"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Battle.rb:392 | ([:SUPERHEATED, :VOLCANIC, :VOLCANICTOP, :INFERNAL].include?(@field.effect) \|\| (@field.effect == :DRAGONSDEN && Rejuv)) && [:HAIL, :SNOW].include?(newweather) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:395 | @field.effect == :INFERNAL && newweather == :RAINDANCE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:3205 | @field.effect == :VOLCANICTOP \|\| @field.effect == :INFERNAL \|\| (Rejuv && @field.effect == :DRAGONSDEN) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:5340 | [:BURNING, :VOLCANIC, :INFERNAL].include?(@field.effect) && i.effects[:BurnUp] | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:5879 | [:VOLCANIC, :INFERNAL, :ROCKY, :CAVE, :VOLCANICTOP].include?(@field.effect) &&  i.ability == :COALFURNACE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:5892 | [:BURNING, :VOLCANIC, :INFERNAL].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6096 | [:HAUNTED, :DIMENSIONAL, :DEUXFINALIS, :INFERNAL].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6205 | @field.effect == :INFERNAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6212 | [:BURNING, :VOLCANIC, :VOLCANICTOP, :WATERSURFACE, :UNDERWATER, :INFERNAL].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6543 | i.isSleeping? \|\| @battle.FE == :INFERNAL \|\| @battle.pbCheckSideAbility(:WORLDOFNIGHTMARES, i.pbOpposing1).any? | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6619 | [:DIMENSIONAL, :FROZENDIMENSION, :INFERNAL].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:7138 | [:INFERNAL, :DARKNESS3].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:204 | @battle.FE != :INFERNAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:238 | ([:SUPERHEATED, :VOLCANIC, :VOLCANICTOP, :INFERNAL].include?(@field.effect) \|\| (@field.effect == :DRAGONSDEN && Rejuv)) && [:HAIL, :SNOW].include?(@weather) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:242 | @field.effect == :INFERNAL && @weather == :RAINDANCE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:255 | @weatherbackup == :RAINDANCE && @field.effect == :INFERNAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:256 | [:HAIL, :SNOW].include?(@weatherbackup) && ([:SUPERHEATED, :VOLCANIC, :VOLCANICTOP, :INFERNAL].include?(@field.effect) \|\| (@field.effect == :DRAGONSDEN && Rejuv)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Inspect.rb:45 | self.ability == :FLAREBOOST && (self.status == :BURN \|\| [:BURNING, :VOLCANIC, :INFERNAL].include?(@battle.FE)) && @battle.FE != :FROZENDIMENSION | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:374 | attacker.ability == :FLAREBOOST && (attacker.status == :BURN \|\| [:BURNING, :VOLCANIC, :INFERNAL].include?(@battle.FE)) && @battle.FE != :FROZENDIMENSION | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:486 | @battle.FE == :INFERNAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:643 | types.include?(:GHOST) \|\| ([:DIMENSIONAL, :INFERNAL].include?(@battle.FE) && types.include?(:DARK)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:672 | types.include?(:FIRE) && [:VOLCANICTOP, :DRAGONSDEN, :INFERNAL].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:732 | self.type == :FIRE && attacker.ability == :WILDFIRE && @battle.FE == :INFERNAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1286 | (attacker.status == :BURN \|\| [:BURNING, :VOLCANIC, :INFERNAL].include?(@battle.FE)) && pbIsSpecial?(attacker, type) && @battle.FE != :FROZENDIMENSION | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1534 | [:SUPERHEATED, :BURNING, :VOLCANIC, :VOLCANICTOP, :INFERNAL].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1538 | [:BURNING, :VOLCANIC, :INFERNAL].include?(@battle.FE) && attacker.ability == :BLAZE && type == :FIRE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1567 | attacker.ability == :WILDFIRE && (opponent.status == :BURN  \|\| @battle.FE == :INFERNAL) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:2335 | @move == :INFERNALPARADE && @battle.FE == :INFERNAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1131 | [:CHESS, :PSYTERRAIN, :INFERNAL, :BACKALLEY].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2818 | [:INFERNAL, :ROTTING].include?(@battle.FE) \|\|<br>       ((!opponent.status.nil? \|\| opponent.isSleeping?) && !blockedBySubstitute?(attacker, opponent) && opponent.crested != :SUICUNE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6572 | (!opponent.isSleeping? && @battle.FE != :INFERNAL &&<br>       @battle.pbCheckSideAbility(:WORLDOFNIGHTMARES, opponent.pbOpposing1).none?) \|\|<br>       opponent.effects[:Nightmare] \|\| blockedBySubstitute?(attacker, opponent) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:9201 | [:INFERNAL, :HAUNTED].include?(@battle.FE) \|\|<br>       ((!opponent.status.nil? \|\| opponent.isSleeping?) && !blockedBySubstitute?(attacker, opponent)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:1809 | self.pokemon&.species == :EISCUE && !self.isFainted? &&<br>       self.effects[:IceFace] && [:VOLCANIC, :VOLCANICTOP, :INFERNAL, :BURNING].include?(@battle.FE) | implemented_and_tested | Eiscue base Ice Face melts on entry/end round on Volcanic, Volcanic Top and Infernal; this source predicate does not require the Ice Face ability. Tests: volcanic fields melt Eiscue Ice Face without requiring a physical hit |
| Battler.rb:2380 | @battle.FE == :INFERNAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:3042 | self.ability == :PASTELVEIL && @battle.FE != :INFERNAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:3684 | @battle.FE == :INFERNAL | implemented_and_tested | Perish Body requires both source counters to be absent; Holy suppresses it, Infernal sets one-turn counters, Dimensional/Haunted/Infernal trap the defender, and Deux Finalis unconditionally replaces the attacker status with Petrification. Tests: Perish Body source counters, suppression, trapping and forced status replacement |
| Battler.rb:3697 | [:DIMENSIONAL, :HAUNTED, :INFERNAL].include?(@battle.FE) | implemented_and_tested | Perish Body requires both source counters to be absent; Holy suppresses it, Infernal sets one-turn counters, Dimensional/Haunted/Infernal trap the defender, and Deux Finalis unconditionally replaces the attacker status with Petrification. Tests: Perish Body source counters, suppression, trapping and forced status replacement |
| Battler.rb:4256 | :INFERNAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |

AI source leads: 29. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":["eartpower"],"abilities":["gravitycontrol","souleater","tempest"],"items":[]}`.
