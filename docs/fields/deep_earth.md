# Deep Earth

Original ID: `DEEPEARTH`; datapack ID: `rejuvenation:deep_earth`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "The Core is pulling you in..."

Nature Power: `gravity`. Secret Power animation/reference move: `heavyslam`.

Secret Power actual secondary choices: `[{"volatileStatus":"flinch"}]`.

Mimicry type: `Ground`; Burmy cloak reference: `SANDYCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"telluricseed","effect":null,"duration":null,"message":"{1}'s weight increased!","stats":{"def":1}}`. Seed actions: `[{"op":"weightDelta","baseMultiplier":1}]`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["magnetpull","contrary","unaware","oblivious","gravitycontrol"],"forceGroundingItems":[],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

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
| `landswrath` | {"multiplier":2.0,"message":"The power of the earth is utterly overwhelming!"} |
| `precipiceblades` | {"multiplier":2.0,"message":"The power of the earth is utterly overwhelming!"} |
| `magnetbomb` | {"multiplier":2.0,"message":"The magnetic field is strengthened!"} |
| `tectonicrage` | {"multiplier":2.0,"message":"The power of the earth is utterly overwhelming!"} |
| `crushgrip` | {"multiplier":2.0,"message":"CRUSHED!"} |
| `smackdown` | {"multiplier":2.0,"message":"Slammed into the ground!"} |
| `coreenforcer` | {"multiplier":2.0,"message":"The power of the Core obliterates all!"} |
| `heavyslam` | {"multiplier":1.5,"message":"The attack came crashing down!"} |
| `heatcrash` | {"multiplier":1.5,"message":"The attack came crashing down!"} |
| `bodyslam` | {"multiplier":1.5,"message":"The attack came crashing down!"} |
| `stomp` | {"multiplier":1.5,"message":"The attack came crashing down!"} |
| `dragonrush` | {"multiplier":1.5,"message":"The attack came crashing down!"} |
| `steamroller` | {"multiplier":1.5,"message":"The attack came crashing down!"} |
| `gravapple` | {"multiplier":1.5,"message":"The attack came crashing down!"} |
| `ancientpower` | {"multiplier":1.5,"message":"The power of ages gone by..."} |
| `fling` | {"multiplier":1.5,"message":"The attack came crashing down!"} |
| `grassknot` | {"multiplier":1.5,"message":"Enjoy the trip!"} |
| `lowkick` | {"multiplier":1.5,"message":"Enjoy the trip!"} |
| `spacialrend` | {"multiplier":1.5,"message":"The intense gravity is ruptured!"} |
| `stormthrow` | {"multiplier":1.5,"message":"Slammed into the ground!"} |
| `circlethrow` | {"multiplier":1.5,"message":"Slammed into the ground!"} |
| `vitalthrow` | {"multiplier":1.5,"message":"Slammed into the ground!"} |
| `bodypress` | {"multiplier":1.5,"message":"The attack came crashing down!"} |
| `submission` | {"multiplier":1.5,"message":"Slammed into the ground!"} |
| `icehammer` | {"multiplier":1.5,"message":"{2} threw their whole weight into it!"} |
| `hammerarm` | {"multiplier":1.5,"message":"{2} threw their whole weight into it!"} |
| `crabhammer` | {"multiplier":1.5,"message":"{2} threw their whole weight into it!"} |
| `iciclecrash` | {"multiplier":1.5,"message":"The attack came crashing down!"} |
| `thousandarrows` | {"multiplier":1.5,"message":"The power of the earth is utterly overwhelming!"} |
| `thousandwaves` | {"multiplier":1.5,"message":"The power of the earth is utterly overwhelming!"} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Rock"} | {"condition":{"always":true},"multiplier":1.3,"message":"The earth empowered the attack!"} |
| {"moveType":"Psychic"} | {"condition":{"always":true},"multiplier":1.3,"message":"The Core's magical forces are immense!"} |
| {"moveType":"Ground"} | {"condition":{"not":{"type":{"who":"target","value":"Ground"}}},"multiplier":1.5,"message":"The earth empowered the attack!"} |

## Type-chart exceptions

| Attacking type | Defending type | Result exponent / immunity | Condition |
|---|---|---|---|
| "Ground" | "Ground" | -1 | {"always":true} |

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "activate" | {"always":true} | [{"op":"pseudoWeather","id":"gravity","permanent":true}] | "Battle_Field.rb:419" |
| "priority" | {"move":"coreenforcer"} | [{"op":"add","value":-1}] | "Battle_Move.rb:2309" |
| "modifyMove" | {"any":[{"move":"topsyturvy"}]} | [{"op":"moveType","type":"Ground"}] | "Battle_Move.rb:257" |
| "switchIn" | {"item":{"who":"user","values":["ironball"]}} | [{"op":"boost","stats":{"spe":-2}}] | "Battler.rb:4361" |
| "switchIn" | {"item":{"who":"user","values":["magnet"]}} | [{"op":"boost","stats":{"spe":-1,"spa":1}},{"op":"message","text":"{1}'s Magnet is affected by the magnetic field!"}] | "Battler.rb:4370" |
| "weight" | {"always":true} | [{"op":"multiply","value":2}] | "Battler.rb:472-482" |
| "speed" | {"item":{"who":"user","values":["floatstone"]}} | [{"op":"multiply","value":1.2}] | "Battler.rb:1187-1215" |
| "speed" | {"item":{"who":"user","values":["ironball"]}} | [{"op":"multiply","value":2}] | "Battler.rb:1187-1215" |
| "speed" | {"all":[{"ability":{"who":"user","values":["slowstart"]}},{"volatile":{"who":"user","id":"slowstart"}}]} | [{"op":"multiply","value":2}] | "Battler.rb:1187-1215" |
| "attack" | {"all":[{"ability":{"who":"user","values":["slowstart"]}},{"volatile":{"who":"user","id":"slowstart"}}]} | [{"op":"multiply","value":2}] | "Battle_Move.rb:physical Slow Start exclusion" |
| "basePower" | {"priority":{"op":">","value":0}} | [{"op":"multiply","value":0.7},{"op":"moveMessage","text":"The intense pull slowed the attack..."}] | "Battle_Move.rb:1436" |
| "basePower" | {"priority":{"op":"<","value":0}} | [{"op":"multiply","value":1.3},{"op":"moveMessage","text":"Slow and heavy!"}] | "Battle_Move.rb:1440" |
| "switchIn" | {"ability":{"who":"user","values":["lightmetal"]}} | [{"op":"boost","stats":{"spe":1}}] | "Battler.rb:2394" |
| "switchIn" | {"ability":{"who":"user","values":["heavymetal"]}} | [{"op":"boost","stats":{"def":1,"spe":-1}},{"op":"message","text":"{1}'s weight makes it harder to be moved!"}] | "Battler.rb:2402" |
| "switchIn" | {"ability":{"who":"user","values":["slowstart"]}} | [{"op":"boost","stats":{"atk":1,"def":1,"spd":1,"spe":-6,"evasion":-6}},{"op":"message","text":"Slow but powerful!"}] | "Battler.rb:2411" |
| "overlayIn" | {"all":[{"overlay":"rejuvenation:psychic_terrain"},{"ability":{"who":"user","values":["anticipation","forewarn"]}}]} | [{"op":"boost","stats":{"spa":1}}] | "Battler.rb:2644-2652" |
| "overlayIn" | {"all":[{"overlay":"rejuvenation:misty_terrain"},{"ability":{"who":"user","values":["watercompaction"]}}]} | [{"op":"boost","stats":{"def":2}}] | "Battler.rb:2654-2662" |
| "modifyMove" | {"move":"gravity"} | [{"op":"moveProperty","path":"category","value":"Physical"},{"op":"moveProperty","path":"target","value":"allAdjacentFoes"},{"op":"moveProperty","path":"pseudoWeather","value":null},{"op":"moveBehavior","recipe":"fixedDamage","basis":"targetHP","factor":0.5},{"op":"moveProperty","path":"basePower","value":1,"removeCallback":"onHit"}] | "Battle_MoveEffects.rb:6792" |
| "modifyMove" | {"move":"magnetrise"} | [{"op":"moveBehavior","recipe":"boostOnly","stats":{"spe":2},"message":"{1} uses electromagnetism to move faster!"},{"op":"moveProperty","path":"flags.gravity","value":0}] | "Battle_MoveEffects.rb:6834" |
| "modifyMove" | {"move":"topsyturvy"} | [{"op":"moveProperty","path":"category","value":"Physical"},{"op":"moveProperty","path":"target","value":"allAdjacent"},{"op":"moveProperty","path":"basePower","value":20},{"op":"moveBehavior","recipe":"targetWeightPower"}] | "Battle_MoveEffects.rb:7354" |
| "modifyMove" | {"move":"seismictoss"} | [{"op":"moveBehavior","recipe":"fixedDamage","basis":"level","factor":1.5,"message":"Slammed into the ground!"}] | "Battle_MoveEffects.rb:2461" |
| "modifyMove" | {"move":"psywave"} | [{"op":"moveBehavior","recipe":"fixedDamage","basis":"level","factor":1,"randomRange":{"minimum":100,"maximum":200},"message":"The Core's magical forces are immense!"}] | "Battle_MoveEffects.rb:2506" |
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
| "modifyMove" | {"move":"autotomize"} | [{"op":"moveProperty","path":"boosts","value":{"spe":3}}] | "Battle_MoveEffects.rb:1114" |
| "modifyMove" | {"move":"wringout"} | [{"op":"moveProperty","path":"basePower","value":120,"removeCallback":"basePowerCallback"}] | "Battle_MoveEffects.rb:3000" |
| "modifyMove" | {"move":"crushgrip"} | [{"op":"moveProperty","path":"basePower","value":120,"removeCallback":"basePowerCallback"}] | "Battle_MoveEffects.rb:3000" |
| "modifyMove" | {"move":"hardpress"} | [{"op":"moveProperty","path":"basePower","value":100,"removeCallback":"basePowerCallback"}] | "Battle_MoveEffects.rb:3000" |
| "modifyMove" | {"move":"gyroball"} | [{"op":"moveProperty","path":"basePower","value":150,"removeCallback":"basePowerCallback"}] | "Battle_MoveEffects.rb:3012" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "modifyMove" | {"move":"heavyslam"} | [{"op":"moveBehavior","recipe":"weightRatioPower","multiplier":2}] | "Battle_MoveEffects.rb:3313" |
| "modifyMove" | {"move":"heatcrash"} | [{"op":"moveBehavior","recipe":"weightRatioPower","multiplier":2}] | "Battle_MoveEffects.rb:3313" |
| "modifyMove" | {"move":"eerieimpulse"} | [{"op":"moveProperty","path":"boosts","value":{"spa":-3}}] | "Battle_MoveEffects.rb:7222" |
| "chargeMove" | {"move":"geomancy"} | [{"op":"reject"}] | "Battle_MoveEffects.rb:7276" |
| "modifyMove" | {"move":"rototiller"} | [{"op":"moveBehavior","recipe":"allActiveHitActions","condition":{"any":[{"all":[{"type":{"who":"target","value":"Grass"}},{"grounded":{"who":"target","value":true}}]}]},"actions":[{"op":"boost","who":"target","stats":{"atk":2,"spa":2}}]}] | "Battle_MoveEffects.rb:7585-7593" |
| "modifyMove" | {"move":"magneticflux"} | [{"op":"moveBehavior","recipe":"alliesHitActions","condition":{"ability":{"who":"target","values":["plus","minus"]}},"actions":[{"op":"conditional","condition":{"always":true},"actions":[{"op":"boost","who":"target","stats":{"def":2,"spd":2}}]}]}] | "Battle_MoveEffects.rb:7475" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["powerconstruct"]}},{"species":{"who":"user","value":"zygarde"}},{"formName":{"who":"user","value":"Complete"}}]} | [{"op":"message","text":"The Core's energy empowered {1}!"},{"op":"boost","stats":{"atk":1,"def":1,"spa":1,"spd":1,"spe":1}}] | "Battler.rb:1834-1837" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |

## Original status-move highlights

Source UI buff highlights: `["autotomize","geomancy","rototiller","magnetflux","eerieimpulse","magnetrise","gravity","topsyturvy","seismictoss","psywave"]`.

Source UI nerf highlights: `[]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["autotomize","gravity","magnetrise","psywave","seismictoss","topsyturvy"],"unreviewedHighlightedMoves":["eerieimpulse","geomancy","magnetflux","rototiller"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Battle.rb:4565 | @field.effect == :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:7296 | i.effects[:SlowStart] >= 5 && i.ability == :SLOWSTART && @battle.FE != :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:433 | @field.effect == :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Inspect.rb:11 | [:HAUNTED, :BEWITCHED, :HOLY, :PSYTERRAIN, :DEEPEARTH].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Inspect.rb:305 | pkmn.ability == :SLOWSTART && pkmn.effects[:SlowStart] < 5 && @battle.FE != :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:267 | :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:489 | @battle.FE == :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:720 | @battle.FE == :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1434 | :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1513 | attacker.ability == :SLOWSTART && attacker.effects[:SlowStart] < 5 && @battle.FE != :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1581 | [:HAUNTED, :BEWITCHED, :HOLY, :PSYTERRAIN, :DEEPEARTH, :DEUXFINALIS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:2309 | @battle.FE == :DEEPEARTH && @move == :COREENFORCER | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:2321 | @move == :GRAVITY && @battle.FE == :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1114 | [:FACTORY, :DEEPEARTH, :CITY].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2461 | (@move == :NIGHTSHADE && [:HAUNTED, :BEWITCHED].include?(@battle.FE)) \|\| (@move == :SEISMICTOSS && @battle.FE == :DEEPEARTH) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2462 | @move == :SEISMICTOSS && @battle.FE == :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2506 | @battle.FE == :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:3000 | [:DEEPEARTH, :CONCERT4].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:3012 | [:DEEPEARTH, :CONCERT4].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:3313 | @battle.FE == :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6800 | @battle.FE == :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6809 | @battle.FE == :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6817 | @battle.FE == :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6835 | @battle.FE == :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6846 | @battle.FE != :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7222 | [:ELECTERRAIN, :DEEPEARTH].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7276 | [:STARLIGHT, :DEEPEARTH].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7366 | @battle.FE == :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7483 | @battle.FE == :DEEPEARTH \|\| (Rejuv && @battle.FE == :ELECTERRAIN && [:PLUS, :MINUS].include?(opponent.ability)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7593 | @battle.FE == :DEEPEARTH \|\| @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:478 | @battle.FE == :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:1104 | self.hasWorkingItem(:IRONBALL) && @battle.FE != :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:1110 | [:MAGNETPULL, :CONTRARY, :UNAWARE, :OBLIVIOUS].include?(self.ability) && @battle.FE == :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:1184 | self.ability == :SLOWSTART && self.effects[:SlowStart] < 5 && @battle.FE != :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:1202 | @battle.FE == :DEEPEARTH && self.item == :FLOATSTONE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:1207 | @battle.FE == :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:1834 | @battle.FE == :DEEPEARTH | implemented_and_tested | Deep Earth adds one stage to the five main stats after native Complete-form transformation, with source empowerment text. Tests: Deep Earth Power Construct adds a single omniboost when the complete forme appears |
| Battler.rb:2389 | @battle.FE == :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:3288 | self.ability == :SLOWSTART && self.effects[:SlowStart] < 5 && @battle.FE != :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:4258 | :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:4356 | @battle.FE == :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:4957 | [:DIMENSIONAL, :DEEPEARTH].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:4987 | @battle.FE == :DEEPEARTH && move.move == :TOPSYTURVY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:4989 | @battle.FE == :DEEPEARTH && move.move == :GRAVITY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:5790 | @battle.state.effects[:Gravity] != 0 && basemove.unusableInGravity? && !(basemove.move == :MAGNETRISE && @battle.FE == :DEEPEARTH) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:5919 | [:DIMENSIONAL, :DEEPEARTH].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7268 | self.ability == :SLOWSTART && self.effects[:SlowStart] < 5 && @battle.FE != :DEEPEARTH | requires_behavioral_comparison | Semantic comparison pending Tests:  |

AI source leads: 25. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":["magnetflux"],"abilities":["gravitycontrol"],"items":[]}`.
