# Deux Finalis

Original ID: `DEUXFINALIS`; datapack ID: `rejuvenation:deux_finalis`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "Purifying mediums line the arena..."

Nature Power: `saltcure`. Secret Power animation/reference move: `saltcure`.

Secret Power actual secondary choices: `[{"volatileStatus":"flinch"}]`.

Mimicry type: `Rock`; Burmy cloak reference: `SANDYCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"magicalseed","effect":null,"duration":3,"message":null,"stats":{"def":1,"spd":1,"spe":1}}`. Seed actions: `[{"op":"perishSong"}]`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `null` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The terrain returned to normal."`.

Shared stat pools: `null`. Absorber policies: `null`. Indirect immunity: `null`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"soulheart":{"onAnyFaint":{"mode":"replace","condition":{"always":true},"actions":[{"op":"boost","stats":{"atk":1,"spa":1}}],"source":"Battler.rb:1407"}},"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":5,"extendedBy":3,"blockEverstone":false}],"source":"Battler.rb:3926"}}}`. Inactive abilities: `null`. Status type bypass: `null`.

Field form typing: `["arceus","silvally"]`. Custom volatile rules: `null`. Rampage policy: `null`.

Progression: `null`. Party roles: `null`.

Field clock policy: `null`.

Fields persist for the battle unless transformed/destroyed. Move/ability terrain creation uses its own finite duration; engine stack restoration and overlay clocks are described in ARCHITECTURE.md.

## Core move rules

| Move ID | Executable properties and exact source text |
|---|---|
| `doomdesire` | {"multiplier":2.0,"message":"All shall end..."} |
| `lightofruin` | {"multiplier":2.0,"message":"All shall end..."} |
| `oblivionwing` | {"multiplier":2.0,"message":"All shall end..."} |
| `hyperspacefury` | {"multiplier":1.5,"message":"The dimensions' barrier was torn apart!"} |
| `hyperspacehole` | {"multiplier":1.5,"message":"The dimensions' barrier was torn apart!"} |
| `spacialrend` | {"multiplier":1.5,"message":"The dimensions' barrier was torn apart!"} |
| `roaroftime` | {"multiplier":1.5,"message":"The dimensions' barrier was torn apart!"} |
| `eternabeam` | {"multiplier":1.5,"message":"The dimensions' barrier was torn apart!"} |
| `dynamaxcannon` | {"multiplier":1.5,"message":"The dimensions' barrier was torn apart!"} |
| `shadowforce` | {"multiplier":1.5,"message":"The distortion above strengthened the attack!"} |
| `phantomforce` | {"multiplier":1.5,"message":"The distortion above strengthened the attack!"} |
| `bittermalice` | {"multiplier":1.5,"message":"The distortion above strengthened the attack!"} |
| `judgment` | {"multiplier":1.5,"message":"The Lord's judgment is swift and merciless!"} |
| `saltcure` | {"multiplier":1.5,"message":"The purifying mediums merged with the attack!"} |
| `ancientpower` | {"multiplier":1.5,"message":"The purifying mediums merged with the attack!"} |
| `diamondstorm` | {"multiplier":1.5,"accuracy":0,"message":"The purifying mediums merged with the attack!"} |
| `shadowsneak` | {"multiplier":1.5,"message":"The distortion above strengthened the attack!"} |
| `dazzlinggleam` | {"multiplier":1.5,"message":"The purifying mediums merged with the attack!"} |
| `bitterblade` | {"multiplier":1.5,"message":"The distortion above strengthened the attack!"} |
| `lusterpurge` | {"multiplier":1.5,"message":"The purifying mediums merged with the attack!"} |
| `terastarstorm` | {"multiplier":1.5,"message":"The purifying mediums merged with the attack!"} |
| `shadowclaw` | {"multiplier":1.5,"message":"The distortion above strengthened the attack!"} |
| `shadowball` | {"multiplier":1.5,"message":"The distortion above strengthened the attack!"} |
| `coldtruth` | {"multiplier":1.5,"accuracy":0,"message":"The Lord's judgment is swift and merciless!"} |
| `hydrovortex` | {"multiplier":1.5,"message":"The world was flooded!"} |
| `flashcannon` | {"multiplier":1.5,"message":"The purifying mediums merged with the attack!"} |
| `moonblast` | {"multiplier":1.5} |
| `darkpulse` | {"multiplier":1.2,"accuracy":0,"message":"The distortion above strengthened the attack!"} |
| `nightdaze` | {"multiplier":1.2,"accuracy":0,"message":"The distortion above strengthened the attack!"} |
| `brine` | {"multiplier":1.2,"message":"The purifying mediums merged with the attack!"} |
| `radiantclaw` | {"multiplier":1.2,"message":"The purifying mediums merged with the attack!"} |
| `darkvoid` | {"accuracy":0} |
| `scaleshot` | {"accuracy":100} |
| `ruination` | {"accuracy":100} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Dark"} | {"condition":{"always":true},"multiplier":1.5,"message":"The darkness is here..."} |
| {"moveType":"Normal"} | {"condition":{"not":{"all":[{"species":{"who":"target","value":"yveltal"}},{"form":{"who":"target","value":1}}]}},"multiplier":1.5,"message":"The purifying mediums merged with the attack!"} |
| {"moveType":"Dragon"} | {"condition":{"always":true},"multiplier":1.5,"message":"The legendary energy resonated with the attack!"} |
| {"moveType":"Water"} | {"condition":{"hp":{"who":"target","op":"<=","fraction":0.5}},"multiplier":1.5,"message":"Doused for the grand-finale!"} |
| {"moveType":"Rock"} | {"condition":{"any":[{"type":{"who":"target","value":"Water"}},{"type":{"who":"target","value":"Steel"}}]},"multiplier":1.5,"message":"The salt wears away at what it touches!"} |

## Type-chart exceptions

| Attacking type | Defending type | Result exponent / immunity | Condition |
|---|---|---|---|
| "Ghost" | "Rock" | -1 | {"always":true} |
| "Fairy" | "*" | 0 | {"always":true} |

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "switchIn" | {"ability":{"who":"user","values":["rattled"]}} | [{"op":"boost","stats":{"spe":1}}] | "Battler.rb:2068" |
| "accuracy" | {"ability":{"who":"user","values":["darkaura"]}} | [{"op":"set","value":true}] | "Battle_Move.rb:876" |
| "modifyMove" | {"move":"freezingglare"} | [{"op":"secondaryChance","chance":100}] | "Battle_Move.rb:2336" |
| "defense" | {"all":[{"any":[{"type":{"who":"user","value":"Dragon"}},{"type":{"who":"user","value":"Normal"}},{"type":{"who":"user","value":"Dark"}},{"ability":{"who":"user","values":["purifyingsalt","fairyaura","aurabreak","darkaura"]}}]},{"not":{"weatherFor":{"who":"target","values":["raindance","primordialsea"]}}},{"not":{"ability":{"who":"target","values":["beadsofruin","swordofruin"]}}}]} | [{"op":"multiply","value":1.3}] | "Battle_Field.rb:1094-1128" |
| "specialDefense" | {"all":[{"any":[{"type":{"who":"user","value":"Dragon"}},{"type":{"who":"user","value":"Normal"}},{"type":{"who":"user","value":"Dark"}},{"ability":{"who":"user","values":["purifyingsalt","fairyaura","aurabreak","darkaura"]}}]},{"not":{"weatherFor":{"who":"target","values":["raindance","primordialsea"]}}},{"not":{"ability":{"who":"target","values":["beadsofruin","swordofruin"]}}}]} | [{"op":"multiply","value":1.3}] | "Battle_Field.rb:1094-1128" |
| "residual" | {"ability":{"who":"user","values":["souleater"]}} | [{"op":"heal","fraction":0.0625,"message":"{1} devoured spirits to recover!"}] | "Battle.rb:5850-6109" |
| "modifyMove" | {"move":"clangoroussoul"} | [{"op":"moveProperty","path":"boosts","value":{"atk":1,"def":1,"spa":1,"spd":1,"spe":1}},{"op":"moveBehavior","recipe":"payHP","fraction":0.25,"threshold":true}] | "Battle_MoveEffects.rb:8590" |
| "modifyMove" | {"all":[{"move":"dragoncheer"},{"type":{"who":"target","value":"Dragon"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"criticalStage","id":"dragoncheer","stage":3,"who":"target"}]}] | "Battle_MoveEffects.rb:9909-9915" |
| "modifyMove" | {"all":[{"move":"dragoncheer"},{"not":{"type":{"who":"target","value":"Dragon"}}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"criticalStage","id":"dragoncheer","stage":2,"who":"target"}]}] | "Battle_MoveEffects.rb:9909-9915" |
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
| "chargeMove" | {"move":"phantomforce"} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4850" |
| "chargeMove" | {"move":"shadowforce"} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4850" |
| "chargeMove" | {"all":[{"move":"razorwind"},{"overlay":"rejuvenation:grassy_terrain"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4430" |
| "chargeMove" | {"all":[{"any":[{"move":"solarbeam"},{"move":"solarblade"}]},{"overlay":"rejuvenation:rainbow"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4472" |
| "modifyMove" | {"move":"brine"} | [{"op":"moveProperty","path":"basePower","value":130,"removeCallback":"onBasePower"}] | "Battle_MoveEffects.rb:2832" |
| "modifyMove" | {"move":"smellingsalts"} | [{"op":"moveProperty","path":"basePower","value":140,"removeCallback":"basePowerCallback"}] | "Battle_MoveEffects.rb:2769" |
| "modifyMove" | {"move":"clangingscales"} | [{"op":"moveProperty","path":"selfBoost","value":null}] | "Battle_MoveEffects.rb:7826" |
| "modifyMove" | {"move":"luckychant"} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"sideCondition","id":"mist","duration":5,"message":"Lucky Chant's team became shrouded in mist!"}]}] | "Battle_MoveEffects.rb:3437" |
| "modifyMove" | {"all":[{"move":"mist"},{"not":{"sideCondition":"mist"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"createField","field":"rejuvenation:misty_terrain","duration":3,"extendedBy":3,"message":"Mist swirled around the battlefield!"}]}] | "Battle_MoveEffects.rb:1817" |
| "modifyMove" | {"move":"freezingglare"} | [{"op":"moveProperty","path":"secondaries.0.status","value":"ptr"}] | "Battle_MoveEffects.rb:414-417" |
| "modifyMove" | {"move":"bittermalice"} | [{"op":"moveProperty","path":"secondaries.0.status","value":"ptr"}] | "Battle_MoveEffects.rb:1381-1384" |
| "modifyMove" | {"move":"bitterblade"} | [{"op":"moveProperty","path":"secondaries","value":[{"chance":100,"status":"ptr"}]}] | "Battle_MoveEffects.rb:5373-5376" |
| "modifyMove" | {"move":"ruination"} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onAfterHit","actions":[{"op":"status","status":"ptr","who":"target"}]}] | "Battle_MoveEffects.rb:2447" |
| "modifyMove" | {"move":"oblivionwing"} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onAfterHit","actions":[{"op":"status","status":"ptr","who":"target"}]}] | "Battle_MoveEffects.rb:7157" |
| "basePower" | {"all":[{"ability":{"who":"user","values":["beadsofruin"]}},{"targetStatus":"ptr"}]} | [{"op":"multiply","value":1.3}] | "Battle_Move.rb:1285" |
| "defense" | {"all":[{"ability":{"who":"user","values":["tabletsofruin"]}},{"targetStatus":"ptr"}]} | [{"op":"multiply","value":1.3}] | "Battle_Move.rb:1716" |
| "specialDefense" | {"all":[{"ability":{"who":"user","values":["vesselofruin"]}},{"targetStatus":"ptr"}]} | [{"op":"multiply","value":1.3}] | "Battle_Move.rb:1733" |
| "afterHit" | {"all":[{"ability":{"who":"user","values":["swordofruin"]}},{"not":{"effectiveAbility":{"who":"target","values":["shielddust"]}}},{"not":{"item":{"who":"target","values":["covertcloak"]}}}]} | [{"op":"status","status":"ptr","who":"target"}] | "Battler.rb:3563-3566" |
| "residual" | {"all":[{"pokemonStatus":"ptr"},{"not":{"sideAbility":{"who":"user","values":["fairyaura"]}}}]} | [{"op":"boost","stats":{"spe":-1}},{"op":"groupMessage","text":"The Pokémon's Speed sank..."}] | "Battle.rb:5961-5965,6223" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "modifyMove" | {"move":"purify"} | [{"op":"moveBehavior","recipe":"purify","stats":{"def":1,"spd":1},"fraction":0.5}] | "Battle_MoveEffects.rb:8019" |
| "modifyMove" | {"move":"scaleshot"} | [{"op":"moveProperty","path":"self","value":{"boosts":{"spe":1}}}] | "Battle_MoveEffects.rb:8824" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |

## Original status-move highlights

Source UI buff highlights: `["obstruct","healblock","darkvoid","dragoncheer","luckychant","clangoroussoul","purify","glare"]`.

Source UI nerf highlights: `[]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["clangoroussoul","luckychant"],"unreviewedHighlightedMoves":["darkvoid","dragoncheer","glare","healblock","obstruct","purify"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Battle.rb:5961 | @field.effect == :DEUXFINALIS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6096 | [:HAUNTED, :DIMENSIONAL, :DEUXFINALIS, :INFERNAL].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6503 | (i.ability == :GLUTTONY) &&  @battle.FE == :DEUXFINALIS && i.canHeal? | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6515 | (i.ability == :PURIFYINGSALT) &&  @battle.FE == :DEUXFINALIS && i.canHeal? | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6607 | [:HOLY, :DEUXFINALIS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6607 | [:HOLY, :DEUXFINALIS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:1119 | :DEUXFINALIS | implemented_and_tested | Deux Finalis grants 1.3 once for Dragon/Normal/Dark typing OR Purifying Salt/Fairy Aura/Aura Break/Dark Aura, only outside attacker-relative rain and unless the attacker has Beads/Sword of Ruin. Tests: every compiled field defense branch uses the source type, stat and weather gates, Mega Sol overrides hail for field defense, Deux Finalis defense uses attacker-relative weather |
| Battle_Move.rb:492 | @battle.FE == :DEUXFINALIS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:876 | [:NOGUARD, :HOTSHOT, :DEFRAGMENT].include?(attacker.ability) \|\| [:NOGUARD, :HOTSHOT].include?(opponent.ability) \|\| (attacker.ability == :FAIRYAURA && @battle.FE == :FAIRYTALE) \|\| (attacker.ability == :DARKAURA && @battle.FE == :DEUXFINALIS) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:954 | [:NOGUARD, :HOTSHOT].include?(attacker.ability) \|\| [:NOGUARD, :HOTSHOT].include?(opponent.ability) \|\| (attacker.ability == :FAIRYAURA && @battle.FE == :FAIRYTALE) \|\| (attacker.ability == :DARKAURA && @battle.FE == :DEUXFINALIS) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1129 | @battle.FE != :DEUXFINALIS \|\| @battle.pbCheckSideItem(:AMULETCOIN, opponent).none? | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1215 | :DEUXFINALIS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1230 | :DEUXFINALIS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1285 | opponent.status == :PETRIFIED && @battle.FE == :DEUXFINALIS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1581 | [:HAUNTED, :BEWITCHED, :HOLY, :PSYTERRAIN, :DEEPEARTH, :DEUXFINALIS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1705 | @battle.pbCheckGlobalAbility(:VESSELOFRUIN) && opponent.ability != :VESSELOFRUIN && !(@battle.FE == :DEUXFINALIS && opponent.pbPartner.ability == :VESSELOFRUIN) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1716 | opponent.ability == :TABLETSOFRUIN && attacker.status == :PETRIFIED && @battle.FE == :DEUXFINALIS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1724 | opponent.ability == :MARVELSCALE && (!opponent.status.nil? \|\| [:MISTY, :RAINBOW, :FAIRYTALE, :DRAGONSDEN, :STARLIGHT, :DEUXFINALIS].include?(@battle.FE) \|\| @battle.OV == :MISTY) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1733 | opponent.ability == :VESSELOFRUIN && attacker.status == :PETRIFIED && @battle.FE == :DEUXFINALIS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1789 | (!opponent.damagestate.critical \|\| (opponent.damagestate.critical && (@battle.pbCheckSideItem(:AMULETCOIN, opponent).any? && @battle.FE == :DEUXFINALIS))) && attacker.ability != :INFILTRATOR | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:2211 | opponent.damagestate.critical && !(@battle.pbCheckSideItem(:AMULETCOIN, opponent).any? && @battle.FE == :DEUXFINALIS) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:2336 | @move == :FREEZINGGLARE && @battle.FE == :DEUXFINALIS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:2337 | @move == :BITTERBLADE && @battle.FE == :DEUXFINALIS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:414 | @battle.FE == :DEUXFINALIS && @move == :FREEZINGGLARE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1381 | @move == :BITTERMALICE && [:DEUXFINALIS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2447 | @move == :RUINATION && [:DEUXFINALIS, :DIMENSIONAL, :FROZENDIMENSION].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2769 | (opponent.status == :PARALYSIS && !opponent.damagestate.substitute && opponent.crested != :SUICUNE) \|\| [:DEUXFINALIS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2832 | opponent.hp <= (opponent.totalhp / 2.0).floor \|\| ([:DEUXFINALIS].include?(@battle.FE)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:3437 | @battle.FE == :DEUXFINALIS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:4850 | (Rejuv && [:DIMENSIONAL, :FROZENDIMENSION, :HAUNTED, :SHORTCIRCUIT, :DEUXFINALIS].include?(@battle.FE)) \|\| @battle.ProgressiveFieldCheck(PBFields::DARKNESS, 2, 3) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:5373 | @move == :BITTERBLADE && [:DEUXFINALIS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7157 | @move == :OBLIVIONWING && [:DEUXFINALIS, :DIMENSIONAL, :FROZENDIMENSION].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7826 | ![:DEUXFINALIS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8019 | @battle.FE == :DEUXFINALIS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8575 | @battle.FE == :DEUXFINALIS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8593 | @battle.FE == :DEUXFINALIS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8824 | Rejuv && [:DEUXFINALIS, :DRAGONSDEN].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:9910 | Rejuv && [:DRAGONSDEN, :DEUXFINALIS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:1406 | [:DEUXFINALIS].include?(@battle.FE) | implemented_and_tested | Soul-Heart adds Special Defense alongside Special Attack on Misty/Rainbow/Fairy Tale, and Attack alongside Special Attack on Deux Finalis; no double native Special Attack boost. Tests: Soul-Heart gains the source defensive or offensive second stat |
| Battler.rb:2252 | [:DIMENSIONAL, :FROZENDIMENSION, :DEUXFINALIS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2765 | @battle.FE == :DEUXFINALIS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2787 | Rejuv && @battle.FE == :DEUXFINALIS && @battle.state.effects[:HeavyRain] | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:3563 | user.ability == :SWORDOFRUIN && @battle.FE == :DEUXFINALIS && target.pbCanPetrify?(user, move) | implemented_and_tested | Deux Finalis Sword of Ruin tries Petrification after a successful damaging hit, retaining secondary-effect protection and custom-status eligibility. Tests: Sword of Ruin petrifies only on a successful damaging hit in Deux Finalis |
| Battler.rb:3701 | @battle.FE == :DEUXFINALIS | implemented_and_tested | Perish Body requires both source counters to be absent; Holy suppresses it, Infernal sets one-turn counters, Dimensional/Haunted/Infernal trap the defender, and Deux Finalis unconditionally replaces the attacker status with Petrification. Tests: Perish Body source counters, suppression, trapping and forced status replacement |
| Battler.rb:4266 | :DEUXFINALIS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:5305 | [:DIMENSIONAL, :CHESS, :DEUXFINALIS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:6044 | [:DEUXFINALIS, :HAUNTED].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:6055 | [:DEUXFINALIS, :FROZENDIMENSION].include?(@battle.FE) && [:CHILLINGNEIGH, :ASONECHILLING].include?(self.ability) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7071 | ((user.ability == :DARKAURA && [:DIMENSIONAL,:FROZENDIMENSION, :DEUXFINALIS].include?(@battle.FE)) \|\| user.hasWorkingItem(:SOULSTONEHELD)) && flags[:totaldamage] > 0 && user.canHeal? | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7072 | (user.ability == :DARKAURA && [:DIMENSIONAL,:FROZENDIMENSION, :DEUXFINALIS].include?(@battle.FE)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7074 | @battle.FE == :DEUXFINALIS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7277 | @battle.pbCheckGlobalAbility(:TABLETSOFRUIN) && self.ability != :TABLETSOFRUIN && !(@battle.FE == :DEUXFINALIS && @battle.pbCheckSideAbility(:TABLETSOFRUIN, self)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7300 | self.ability == :MARVELSCALE && (!self.status.nil? \|\| [:MISTY, :RAINBOW, :FAIRYTALE, :DRAGONSDEN, :STARLIGHT, :DEUXFINALIS].include?(@battle.FE)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7312 | self.wonderroom && @battle.pbCheckGlobalAbility(:BEADSOFRUIN) && self.ability != :BEADSOFRUIN && !(@battle.FE == :DEUXFINALIS && @battle.pbCheckSideAbility(:BEADSOFRUIN, self)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7313 | !self.wonderroom && @battle.pbCheckGlobalAbility(:SWORDOFRUIN) && self.ability != :SWORDOFRUIN && !(@battle.FE == :DEUXFINALIS && @battle.pbCheckSideAbility(:SWORDOFRUIN, self)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7352 | @battle.pbCheckGlobalAbility(:VESSELOFRUIN) && self.ability != :VESSELOFRUIN && !(@battle.FE == :DEUXFINALIS && @battle.pbCheckSideAbility(:VESSELOFRUIN, self)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Rejuv/Battle/MoveEffects.rb:139 | [:DESERT, :ROCKY, :ASHENBEACH, :DEUXFINALIS].include?(@battle.FE) | excluded_custom_move | The enclosing custom move handler changes Arenite Wall only; it is absent from the installed ordinary move registry. Tests:  |

AI source leads: 30. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":["coldtruth","radiantclaw"],"abilities":["gravitycontrol","souleater"],"items":[]}`.
