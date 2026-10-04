# Dragon's Den

Original ID: `DRAGONSDEN`; datapack ID: `rejuvenation:dragons_den`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "If you wish to slay a dragon..."

Nature Power: `dragonpulse`. Secret Power animation/reference move: `dragonpulse`.

Secret Power actual secondary choices: `[{"status":"brn"}]`.

Mimicry type: `Dragon`; Burmy cloak reference: `SANDYCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"elementalseed","effect":"flashfire","duration":true,"message":"{1} raised its Fire power!","stats":{"spa":1}}`. Seed actions: `null`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{"magmastorm":1},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `{"cobblemon:dusk_ball":3.5}` (Balls.rb:143,166). Incoming weather conversions: `null`.

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
| `megakick` | {"multiplier":1.5,"message":"Trial of the Dragon!!!"} |
| `magmastorm` | {"multiplier":1.5,"message":"The lava strengthened the attack!"} |
| `lavaplume` | {"multiplier":1.5,"message":"The lava strengthened the attack!"} |
| `stompingtantrum` | {"multiplier":1.5,"message":"Trial of the Dragon!!!"} |
| `earthpower` | {"multiplier":1.5,"message":"The lava strengthened the attack!"} |
| `diamondstorm` | {"multiplier":1.5,"message":"Sparkling treasure!"} |
| `matrixshot` | {"multiplier":1.5,"message":"Sparkling treasure!"} |
| `shelltrap` | {"multiplier":1.5,"message":"The lava strengthened the attack!"} |
| `powergem` | {"multiplier":1.5,"message":"Sparkling treasure!"} |
| `magmadrift` | {"multiplier":1.5,"message":"The lava strengthened the attack!"} |
| `rockclimb` | {"multiplier":1.5,"additionalType":"FIRE","message":"Unrivaled power!"} |
| `strength` | {"multiplier":1.5,"additionalType":"FIRE","message":"Unrivaled power!"} |
| `payday` | {"multiplier":1.5,"message":"Sparkling treasure!"} |
| `makeitrain` | {"multiplier":1.5,"message":"Sparkling treasure!"} |
| `terastarstorm` | {"multiplier":1.5,"message":"Sparkling treasure!"} |
| `smackdown` | {"multiplier":2.0,"additionalType":"FIRE","message":"{1} was knocked into the lava!"} |
| `thousandarrows` | {"multiplier":2.0,"additionalType":"FIRE","message":"{1} was knocked into the lava!"} |
| `dragonascent` | {"multiplier":2.0,"message":"The draconic energy boosted the attack!"} |
| `mistball` | {"multiplier":2.0,"message":"The draconic energy boosted the attack!","transition":{"field":"rejuvenation:fairytale","condition":{"always":true},"push":false,"message":"The mist-ical energy altered the surroundings!"}} |
| `lusterpurge` | {"multiplier":2.0,"message":"The draconic energy boosted the attack!"} |
| `hail` | {"multiplier":0,"message":"The hail is melting in the heat..."} |
| `snowscape` | {"multiplier":0,"message":"The snow is melting in the heat..."} |
| `dragonrush` | {"accuracy":100} |
| `glaciate` | {"transition":{"field":"rejuvenation:cave","condition":{"always":true},"push":false,"message":"The lava was frozen solid!"}} |
| `subzeroslammer` | {"transition":{"field":"rejuvenation:cave","condition":{"always":true},"push":false,"message":"The lava was frozen solid!"}} |
| `oceanicoperetta` | {"transition":{"field":"rejuvenation:cave","condition":{"always":true},"push":false,"message":"The lava solidified!"}} |
| `hydrovortex` | {"transition":{"field":"rejuvenation:cave","condition":{"always":true},"push":false,"message":"The lava solidified!"}} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Dragon"} | {"condition":{"always":true},"multiplier":1.5,"message":"The draconic energy boosted the attack!"} |
| {"moveType":"Fire"} | {"condition":{"always":true},"multiplier":1.5,"message":"The lava's heat boosted the flame!"} |
| {"moveType":"Ice"} | {"condition":{"always":true},"multiplier":0.5,"message":"The lava's heat softened the attack..."} |
| {"moveType":"Water"} | {"condition":{"always":true},"multiplier":0.5,"message":"The lava's heat softened the attack..."} |

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "switchIn" | {"ability":{"who":"user","values":["magmaarmor"]}} | [{"op":"boost","stats":{"def":1,"spd":1}}] | "Battler.rb:2172" |
| "switchIn" | {"ability":{"who":"user","values":["shellarmor"]}} | [{"op":"boost","stats":{"def":1}}] | "Battler.rb:2181" |
| "modifyMove" | {"any":[{"move":"rockclimb"},{"move":"strength"}]} | [{"op":"moveType","type":"Rock"}] | "Battle_Move.rb:257" |
| "defense" | {"type":{"who":"user","value":"Dragon"}} | [{"op":"multiply","value":1.3}] | "Battle_Field.rb:1094-1128" |
| "specialDefense" | {"type":{"who":"user","value":"Dragon"}} | [{"op":"multiply","value":1.3}] | "Battle_Field.rb:1094-1128" |
| "activate" | {"all":[{"weather":["hail"]},{"not":{"globalAbility":["tempest"]}}]} | [{"op":"clearWeather","message":"The hail melted away!"}] | "Battle_Field.rb:215-232" |
| "weatherChange" | {"all":[{"weather":["hail"]},{"not":{"globalAbility":["tempest"]}}]} | [{"op":"clearWeather","message":"The hail melted away!"}] | "Battle_Field.rb:215-232" |
| "activate" | {"all":[{"weather":["snow"]},{"not":{"globalAbility":["tempest"]}}]} | [{"op":"clearWeather","message":"The snow melted away!"}] | "Battle_Field.rb:215-232" |
| "weatherChange" | {"all":[{"weather":["snow"]},{"not":{"globalAbility":["tempest"]}}]} | [{"op":"clearWeather","message":"The snow melted away!"}] | "Battle_Field.rb:215-232" |
| "modifyMove" | {"move":"clangoroussoul"} | [{"op":"moveProperty","path":"boosts","value":{"atk":2,"def":2,"spa":2,"spd":2,"spe":2}},{"op":"moveBehavior","recipe":"payHP","fraction":0.5,"threshold":true}] | "Battle_MoveEffects.rb:8590" |
| "setStatus" | {"item":{"who":"target","values":["amuletcoin"]}} | [{"op":"message","who":"target","text":"The Amulet Coin prevents {1} from being inflicted with status on Dragon's Den!"},{"op":"reject"}] | "Battle_Effects.rb:94" |
| "modifyMove" | {"all":[{"move":"dragoncheer"},{"type":{"who":"target","value":"Dragon"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"criticalStage","id":"dragoncheer","stage":3,"who":"target"}]}] | "Battle_MoveEffects.rb:9909-9915" |
| "modifyMove" | {"all":[{"move":"dragoncheer"},{"not":{"type":{"who":"target","value":"Dragon"}}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"criticalStage","id":"dragoncheer","stage":2,"who":"target"}]}] | "Battle_MoveEffects.rb:9909-9915" |
| "setWeather" | {"incomingWeather":["hail"]} | [{"op":"message","text":"The hail melted away."},{"op":"reject"}] | "Battle.rb:367-406" |
| "setWeather" | {"incomingWeather":["snow"]} | [{"op":"message","text":"The snow melted away."},{"op":"reject"}] | "Battle.rb:367-406" |
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
| "chargeMove" | {"move":"fly"} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4684" |
| "chargeMove" | {"move":"bounce"} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4808" |
| "chargeMove" | {"all":[{"move":"razorwind"},{"overlay":"rejuvenation:grassy_terrain"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4430" |
| "chargeMove" | {"all":[{"any":[{"move":"solarbeam"},{"move":"solarblade"}]},{"overlay":"rejuvenation:rainbow"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4472" |
| "modifyMove" | {"all":[{"move":"mist"},{"not":{"sideCondition":"mist"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"createField","field":"rejuvenation:misty_terrain","duration":3,"extendedBy":3,"message":"Mist swirled around the battlefield!"}]}] | "Battle_MoveEffects.rb:1817" |
| "modifyMove" | {"move":"coil"} | [{"op":"moveProperty","path":"boosts","value":{"atk":2,"def":2,"accuracy":2}}] | "Battle_MoveEffects.rb:917" |
| "modifyMove" | {"move":"dragondance"} | [{"op":"moveProperty","path":"boosts","value":{"atk":2,"spe":2}}] | "Battle_MoveEffects.rb:932" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "modifyMove" | {"move":"scaleshot"} | [{"op":"moveProperty","path":"self","value":{"boosts":{"spe":1}}}] | "Battle_MoveEffects.rb:8824" |
| "modifyMove" | {"move":"ficklebeam"} | [{"op":"moveBehavior","recipe":"randomPowerCallback","numerator":5,"denominator":10,"base":80,"boosted":160,"activation":"Fickle Beam All Out"}] | "Battle_MoveEffects.rb:9852" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |

## Original status-move highlights

Source UI buff highlights: `["dragondance","nobleroar","coil","stealthrock"]`.

Source UI nerf highlights: `["chillyreception"]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["coil","dragondance"],"unreviewedHighlightedMoves":["chillyreception","nobleroar","stealthrock"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Balls.rb:166 | PBDayNight.isNight?(pbGetTimeNow) \|\| [:DARKCRYSTALCAVERN, :SHORTCIRCUIT, :UNDERWATER, :CAVE, :CRYSTALCAVERN, :DRAGONSDEN, :STARLIGHT, :NEWWORLD, :INVERSE].include?(battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:392 | ([:SUPERHEATED, :VOLCANIC, :VOLCANICTOP, :INFERNAL].include?(@field.effect) \|\| (@field.effect == :DRAGONSDEN && Rejuv)) && [:HAIL, :SNOW].include?(newweather) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:3205 | @field.effect == :VOLCANICTOP \|\| @field.effect == :INFERNAL \|\| (Rejuv && @field.effect == :DRAGONSDEN) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6287 | (pbRandom(10) < 3 \|\| @field.effect == :DRAGONSDEN) && !i.status.nil? | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6290 | @field.effect == :DRAGONSDEN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6655 | @field.effect == :DRAGONSDEN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:238 | ([:SUPERHEATED, :VOLCANIC, :VOLCANICTOP, :INFERNAL].include?(@field.effect) \|\| (@field.effect == :DRAGONSDEN && Rejuv)) && [:HAIL, :SNOW].include?(@weather) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:256 | [:HAIL, :SNOW].include?(@weatherbackup) && ([:SUPERHEATED, :VOLCANIC, :VOLCANICTOP, :INFERNAL].include?(@field.effect) \|\| (@field.effect == :DRAGONSDEN && Rejuv)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:1105 | :DRAGONSDEN | implemented_and_tested | Dragon Den grants Dragon-type defenders 1.3 on both defensive paths. Tests: every compiled field defense branch uses the source type, stat and weather gates, Mega Sol overrides hail for field defense, Deux Finalis defense uses attacker-relative weather |
| Battle_Move.rb:266 | :DRAGONSDEN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:526 | @battle.FE == :DRAGONSDEN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:672 | types.include?(:FIRE) && [:VOLCANICTOP, :DRAGONSDEN, :INFERNAL].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1268 | @battle.FE == :DRAGONSDEN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1536 | @battle.FE == :DRAGONSDEN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1724 | opponent.ability == :MARVELSCALE && (!opponent.status.nil? \|\| [:MISTY, :RAINBOW, :FAIRYTALE, :DRAGONSDEN, :STARLIGHT, :DEUXFINALIS].include?(@battle.FE) \|\| @battle.OV == :MISTY) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:917 | @battle.FE == :GRASSY \|\| (Rejuv && @battle.FE == :DRAGONSDEN) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:932 | [:BIGTOP, :DRAGONSDEN, :DANCEFLOOR].include?(@battle.FE) && @move == :DRAGONDANCE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:4684 | [:CLOUDS, :CAVE, :SKY].include?(@battle.FE) \|\| (Rejuv && @battle.FE == :DRAGONSDEN) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:4808 | [:CLOUDS, :CAVE, :SKY].include?(@battle.FE) \|\| (Rejuv && @battle.FE == :DRAGONSDEN) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6078 | [:BIGTOP, :DRAGONSDEN].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6083 | @battle.FE == :DRAGONSDEN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6421 | [:BIGTOP, :DRAGONSDEN].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6426 | @battle.FE == :DRAGONSDEN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7137 | [:FAIRYTALE, :DRAGONSDEN].include?(@battle.FE) && @move == :NOBLEROAR | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8574 | [:BIGTOP, :DRAGONSDEN].include?(@battle.FE) \|\| @battle.ProgressiveFieldCheck(PBFields::CONCERT) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8590 | [:BIGTOP, :DRAGONSDEN].include?(@battle.FE) \|\| @battle.ProgressiveFieldCheck(PBFields::CONCERT) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8594 | [:BIGTOP, :DRAGONSDEN].include?(@battle.FE) \|\| @battle.ProgressiveFieldCheck(PBFields::CONCERT) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8824 | Rejuv && [:DEUXFINALIS, :DRAGONSDEN].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:9493 | @battle.FE == :DRAGONSDEN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:9503 | [:BIGTOP, :DRAGONSDEN].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:9852 | @battle.FE == :DRAGONSDEN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:9910 | Rejuv && [:DRAGONSDEN, :DEUXFINALIS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:9913 | opponent.hasType?(:DRAGON) \|\| @battle.FE == :DRAGONSDEN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2172 | @battle.FE == :DRAGONSDEN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:6121 | Rejuv && @battle.FE == :DRAGONSDEN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7300 | self.ability == :MARVELSCALE && (!self.status.nil? \|\| [:MISTY, :RAINBOW, :FAIRYTALE, :DRAGONSDEN, :STARLIGHT, :DEUXFINALIS].include?(@battle.FE)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |

AI source leads: 28. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":["magmadrift","matrixshot"],"abilities":["gravitycontrol","tempest"],"items":[]}`.
