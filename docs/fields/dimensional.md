# Dimensional Field

Original ID: `DIMENSIONAL`; datapack ID: `rejuvenation:dimensional`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "Darkness radiates."

Nature Power: `darkpulse`. Secret Power animation/reference move: `darkpulse`.

Secret Power actual secondary choices: `[{"volatileStatus":"flinch"}]`.

Mimicry type: `Dark`; Burmy cloak reference: `TRASHCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"magicalseed","effect":null,"duration":null,"message":null,"stats":{"def":1}}`. Seed actions: `[{"op":"trickRoom","minimum":3,"maximum":8}]`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"always":true},"randomRange":{"minimum":3,"maximum":8}},{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"always":true},"randomRange":{"minimum":3,"maximum":8}},{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"always":true},"randomRange":{"minimum":3,"maximum":8}},{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"always":true},"randomRange":{"minimum":3,"maximum":8}},{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

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
| `blackholeeclipse` | {"multiplier":2.0} |
| `hyperspacefury` | {"multiplier":1.5,"message":"The attack has been corrupted!"} |
| `hyperspacehole` | {"multiplier":1.5,"message":"The attack has been corrupted!"} |
| `spacialrend` | {"multiplier":1.5,"message":"The attack has been corrupted!"} |
| `roaroftime` | {"multiplier":1.5,"message":"The attack has been corrupted!"} |
| `eternabeam` | {"multiplier":1.5,"message":"The attack has been corrupted!"} |
| `dynamaxcannon` | {"multiplier":1.5,"message":"The attack has been corrupted!"} |
| `shadowforce` | {"multiplier":1.5,"message":"The attack has been corrupted!"} |
| `bitterblade` | {"multiplier":1.5,"message":"The rage continues!"} |
| `outrage` | {"multiplier":1.5,"message":"The rage continues!"} |
| `thrash` | {"multiplier":1.5,"message":"The rage continues!"} |
| `stompingtantrum` | {"multiplier":1.5,"message":"The rage continues!"} |
| `lashout` | {"multiplier":1.5,"message":"The rage continues!"} |
| `freezingglare` | {"multiplier":1.5,"message":"The rage continues!"} |
| `fierywrath` | {"multiplier":1.5,"message":"The rage continues!"} |
| `ragingfury` | {"multiplier":1.5,"message":"The rage continues!"} |
| `bittermalice` | {"multiplier":1.5,"message":"The rage continues!"} |
| `temperflare` | {"multiplier":1.5} |
| `thunderouskick` | {"multiplier":1.5,"message":"The rage continues!"} |
| `darkpulse` | {"multiplier":1.2,"accuracy":0,"message":"The attack has been corrupted!"} |
| `nightdaze` | {"multiplier":1.2,"accuracy":0,"message":"The attack has been corrupted!"} |
| `teatime` | {"multiplier":0,"message":"But it failed."} |
| `luckychant` | {"multiplier":0,"message":"But it failed."} |
| `darkvoid` | {"accuracy":0} |
| `blizzard` | {"counter":{"index":1,"amount":1,"maximum":2,"message":"A frightening chill goes down your spine..."},"transition":{"field":"rejuvenation:frozen_dimension","condition":{"counter":{"index":1,"op":">","value":1}},"push":false,"message":"The dimension froze up!"}} |
| `sheercold` | {"counter":{"index":1,"amount":1,"maximum":2,"message":"A frightening chill goes down your spine..."},"transition":{"field":"rejuvenation:frozen_dimension","condition":{"counter":{"index":1,"op":">","value":1}},"push":false,"message":"The dimension froze up!"}} |
| `coldtruth` | {"counter":{"index":1,"amount":1,"maximum":2,"message":"A frightening chill goes down your spine..."},"transition":{"field":"rejuvenation:frozen_dimension","condition":{"counter":{"index":1,"op":">","value":1}},"push":false,"message":"The dimension froze up!"}} |
| `iceburn` | {"counter":{"index":1,"amount":2,"maximum":2,"message":null},"transition":{"field":"rejuvenation:frozen_dimension","condition":{"counter":{"index":1,"op":">","value":1}},"push":false,"message":"The dimension froze up!"}} |
| `freezeshock` | {"counter":{"index":1,"amount":2,"maximum":2,"message":null},"transition":{"field":"rejuvenation:frozen_dimension","condition":{"counter":{"index":1,"op":">","value":1}},"push":false,"message":"The dimension froze up!"}} |
| `glaciate` | {"counter":{"index":1,"amount":2,"maximum":2,"message":null},"transition":{"field":"rejuvenation:frozen_dimension","condition":{"counter":{"index":1,"op":">","value":1}},"push":false,"message":"The dimension froze up!"}} |
| `precipiceblades` | {"transition":{"field":"rejuvenation:infernal","condition":{"always":true},"push":false,"message":"The field went up in flames!"}} |
| `purify` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The dimension was purified!"}} |
| `seedflare` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The dimension was purified!"}} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Dark"} | {"condition":{"always":true},"multiplier":1.5,"message":"The darkness is here!"} |
| {"moveType":"Shadow"} | {"condition":{"always":true},"multiplier":1.5,"message":"The shadow is strengthened!"} |
| {"moveType":"Ghost"} | {"condition":{"always":true},"multiplier":1.3,"message":"The evil aura powered up the attack!"} |
| {"moveType":"Fairy"} | {"condition":{"always":true},"multiplier":0.5,"message":"The evil aura depleted the attack!"} |

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "switchIn" | {"ability":{"who":"user","values":["rattled"]}} | [{"op":"boost","stats":{"spe":1}}] | "Battler.rb:2068" |
| "switchIn" | {"ability":{"who":"user","values":["berserk"]}} | [{"op":"boost","stats":{"spa":1}}] | "Battler.rb:2265" |
| "switchIn" | {"ability":{"who":"user","values":["angershell"]}} | [{"op":"boost","stats":{"atk":1,"spa":1,"spe":1,"def":-1,"spd":-1}}] | "Battler.rb:2273" |
| "switchIn" | {"ability":{"who":"user","values":["justified","angerpoint"]}} | [{"op":"boost","stats":{"atk":1}}] | "Battler.rb:2282" |
| "priority" | {"move":"quash"} | [{"op":"add","value":1}] | "Battle_Move.rb:2303" |
| "modifyMove" | {"any":[{"move":"rage"}]} | [{"op":"moveType","type":"Dark"}] | "Battle_Move.rb:257" |
| "defense" | {"type":{"who":"user","value":"Ghost"}} | [{"op":"multiply","value":1.5}] | "Battle_Field.rb:1094-1128" |
| "specialDefense" | {"type":{"who":"user","value":"Ghost"}} | [{"op":"multiply","value":1.5}] | "Battle_Field.rb:1094-1128" |
| "residual" | {"ability":{"who":"user","values":["souleater"]}} | [{"op":"heal","fraction":0.0625,"message":"{1} devoured spirits to recover!"}] | "Battle.rb:5850-6109" |
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
| "modifyMove" | {"all":[{"move":"mist"},{"not":{"sideCondition":"mist"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"createField","field":"rejuvenation:misty_terrain","duration":3,"extendedBy":3,"message":"Mist swirled around the battlefield!"}]}] | "Battle_MoveEffects.rb:1817" |
| "modifyMove" | {"move":"ruination"} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onAfterHit","actions":[{"op":"status","status":"ptr","who":"target"}]}] | "Battle_MoveEffects.rb:2447" |
| "modifyMove" | {"move":"oblivionwing"} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onAfterHit","actions":[{"op":"status","status":"ptr","who":"target"}]}] | "Battle_MoveEffects.rb:7157" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "modifyMove" | {"move":"rage"} | [{"op":"moveProperty","path":"basePower","value":60},{"op":"moveProperty","path":"self","value":{"boosts":{"atk":1}}}] | "Battle_MoveEffects.rb:3103" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"ability":{"who":"user","values":["download"]}} | [{"op":"randomType","values":["Normal","Fire","Water","Electric","Grass","Ice","Fighting","Poison","Ground","Flying","Psychic","Bug","Rock","Ghost","Dragon","Dark","Steel","Fairy"],"message":"{1} transformed into the {type} type!"}] | "Battler.rb:1818-1821" |
| "residual" | {"ability":{"who":"user","values":["download"]}} | [{"op":"randomType","values":["Normal","Fire","Water","Electric","Grass","Ice","Fighting","Poison","Ground","Flying","Psychic","Bug","Rock","Ghost","Dragon","Dark","Steel","Fairy"],"message":"{1} transformed into the {type} type!"}] | "Battler.rb:1818-1821" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |

## Original status-move highlights

Source UI buff highlights: `["obstruct","quash","embargo","healblock","darkvoid"]`.

Source UI nerf highlights: `[]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":[],"unreviewedHighlightedMoves":["darkvoid","embargo","healblock","obstruct","quash"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Battle.rb:5586 | [:DIMENSIONAL, :FROZENDIMENSION].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6096 | [:HAUNTED, :DIMENSIONAL, :DEUXFINALIS, :INFERNAL].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6564 | @field.effect == :DIMENSIONAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6619 | [:DIMENSIONAL, :FROZENDIMENSION, :INFERNAL].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:878 | :DIMENSIONAL, :FROZENDIMENSION | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:340 | @field.effect == :DIMENSIONAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:1113 | :DIMENSIONAL | implemented_and_tested | Dimensional grants Ghost defenders 1.5 on either defensive stat path. Tests: every compiled field defense branch uses the source type, stat and weather gates, Mega Sol overrides hail for field defense, Deux Finalis defense uses attacker-relative weather |
| Battle_Inspect.rb:53 | self.ability == :SHADOWSHIELD && (@battle.FE == :DIMENSIONAL \|\| self.hp == self.totalhp) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:264 | :DIMENSIONAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:643 | types.include?(:GHOST) \|\| ([:DIMENSIONAL, :INFERNAL].include?(@battle.FE) && types.include?(:DARK)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1811 | opponent.ability == :SHADOWSHIELD && (opponent.hp == opponent.totalhp \|\| [:DIMENSIONAL].include?(@battle.FE)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:2303 | @move == :QUASH && [:DIMENSIONAL, :FROZENDIMENSION].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2415 | [:DIMENSIONAL, :FROZENDIMENSION].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2447 | @move == :RUINATION && [:DEUXFINALIS, :DIMENSIONAL, :FROZENDIMENSION].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:3103 | [:DIMENSIONAL, :FROZENDIMENSION].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:3110 | [:DIMENSIONAL, :FROZENDIMENSION].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:4850 | (Rejuv && [:DIMENSIONAL, :FROZENDIMENSION, :HAUNTED, :SHORTCIRCUIT, :DEUXFINALIS].include?(@battle.FE)) \|\| @battle.ProgressiveFieldCheck(PBFields::DARKNESS, 2, 3) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6138 | @battle.FE == :DIMENSIONAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6203 | @battle.FE == :DIMENSIONAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6218 | @battle.FE == :DIMENSIONAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6233 | @battle.FE == :DIMENSIONAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6248 | @battle.FE == :DIMENSIONAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6821 | @battle.FE == :DIMENSIONAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6960 | @battle.FE == :DIMENSIONAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7030 | @battle.FE == :DIMENSIONAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7157 | @move == :OBLIVIONWING && [:DEUXFINALIS, :DIMENSIONAL, :FROZENDIMENSION].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Shadow.rb:279 | @battle.FE == :DIMENSIONAL | excluded_custom_move | The enclosing custom Shadow Sky handler changes the custom shadow weather clock; ordinary Sky/Dimensional weather clocks are separate. Tests:  |
| Battler.rb:1818 | @battle.FE == :DIMENSIONAL && self.ability == :DOWNLOAD && self.canChangeType? | implemented_and_tested | Dimensional Download changes ordinary type on entry and end round, using native type-change eligibility. Its ordinary entry stat boost is retained. Tests: Dimensional Download changes type on entry and each end of turn |
| Battler.rb:2252 | [:DIMENSIONAL, :FROZENDIMENSION, :DEUXFINALIS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2260 | [:DIMENSIONAL, :FROZENDIMENSION].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2927 | @battle.FE == :DIMENSIONAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2941 | @battle.FE == :DIMENSIONAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2953 | @battle.FE == :DIMENSIONAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2968 | @battle.FE == :DIMENSIONAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2983 | @battle.FE == :DIMENSIONAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:3697 | [:DIMENSIONAL, :HAUNTED, :INFERNAL].include?(@battle.FE) | implemented_and_tested | Perish Body requires both source counters to be absent; Holy suppresses it, Infernal sets one-turn counters, Dimensional/Haunted/Infernal trap the defender, and Deux Finalis unconditionally replaces the attacker status with Petrification. Tests: Perish Body source counters, suppression, trapping and forced status replacement |
| Battler.rb:4244 | :DIMENSIONAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:4957 | [:DIMENSIONAL, :DEEPEARTH].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:5305 | [:DIMENSIONAL, :CHESS, :DEUXFINALIS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:5919 | [:DIMENSIONAL, :DEEPEARTH].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:6063 | @battle.FE == :DIMENSIONAL && self.ability == :BEASTBOOST | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7005 | @battle.FE == :DIMENSIONAL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7071 | ((user.ability == :DARKAURA && [:DIMENSIONAL,:FROZENDIMENSION, :DEUXFINALIS].include?(@battle.FE)) \|\| user.hasWorkingItem(:SOULSTONEHELD)) && flags[:totaldamage] > 0 && user.canHeal? | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7072 | (user.ability == :DARKAURA && [:DIMENSIONAL,:FROZENDIMENSION, :DEUXFINALIS].include?(@battle.FE)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |

AI source leads: 34. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":["coldtruth"],"abilities":["gravitycontrol","souleater"],"items":[]}`.
