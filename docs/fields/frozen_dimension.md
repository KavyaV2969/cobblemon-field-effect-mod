# Frozen Dimensional Field

Original ID: `FROZENDIMENSION`; datapack ID: `rejuvenation:frozen_dimension`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "Hate and anger radiates."

Nature Power: `icebeam`. Secret Power animation/reference move: `icebeam`.

Secret Power actual secondary choices: `[{"status":"frz"}]`.

Mimicry type: `Ice`; Burmy cloak reference: `TRASHCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"elementalseed","effect":"torment","duration":true,"message":"{1} is subjected to torment!","stats":{"spe":2}}`. Seed actions: `null`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `{"blockedMessage":"The frozen dimension remains unchanged.","blockedFields":[],"source":"Battle_Field.rb:288-301"}`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"},"snow":{"duration":8,"sourceMoves":["snowscape","chillyreception"],"sourceAbilities":["snowwarning"],"source":"Battle_MoveEffects.rb:6202; Battler.rb:2937-2994"},"hail":{"duration":8,"sourceMoves":["hail","snowscape","chillyreception"],"sourceAbilities":["snowwarning","hailwarning"],"source":"Battle_MoveEffects.rb:6262; Battler.rb:2937-2994"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `null` (Balls.rb:143,166). Incoming weather conversions: `{"snow":"hail"}`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The terrain returned to normal."`.

Shared stat pools: `null`. Absorber policies: `null`. Indirect immunity: `null`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"flamebody":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[],"source":"Battler.rb:3651"}},"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":5,"extendedBy":3,"blockEverstone":false}],"source":"Battler.rb:3926"}}}`. Inactive abilities: `null`. Status type bypass: `null`.

Field form typing: `["arceus","silvally"]`. Custom volatile rules: `null`. Rampage policy: `null`.

Progression: `null`. Party roles: `null`.

Field clock policy: `{"pauseOverlay":true,"source":"Battle.rb:7001-7005"}`.

Fields persist for the battle unless transformed/destroyed. Move/ability terrain creation uses its own finite duration; engine stack restoration and overlay clocks are described in ARCHITECTURE.md.

## Core move rules

| Move ID | Executable properties and exact source text |
|---|---|
| `ragingfury` | {"multiplier":1.5,"message":"The rage continues.","counter":{"index":1,"amount":1,"maximum":2,"message":"The corrupted ice is starting to thaw..."},"transition":{"field":"rejuvenation:dimensional","condition":{"counter":{"index":1,"op":">","value":1}},"push":false,"message":"The dimension thawed away!"}} |
| `thrash` | {"multiplier":1.5,"message":"The rage continues."} |
| `outrage` | {"multiplier":1.5,"message":"The rage continues."} |
| `stompingtantrum` | {"multiplier":1.5,"message":"The rage continues."} |
| `rage` | {"multiplier":1.5,"message":"The rage continues."} |
| `lashout` | {"multiplier":1.5,"message":"The rage continues."} |
| `freezingglare` | {"multiplier":1.5,"message":"The rage continues."} |
| `fierywrath` | {"multiplier":1.5,"message":"The rage continues."} |
| `roaroftime` | {"multiplier":1.5,"message":"The rage continues."} |
| `bittermalice` | {"multiplier":1.5,"additionalType":"ICE","message":"The ice warped the attack."} |
| `blackholeeclipse` | {"multiplier":1.5} |
| `bitterblade` | {"multiplier":1.5,"additionalType":"ICE","message":"The ice warped the attack."} |
| `surf` | {"multiplier":1.2,"additionalType":"ICE","message":"The ice warped the attack."} |
| `muddywater` | {"multiplier":1.2,"additionalType":"ICE","message":"The ice warped the attack."} |
| `waterpulse` | {"multiplier":1.2,"additionalType":"ICE","message":"The ice warped the attack."} |
| `hydropump` | {"multiplier":1.2,"additionalType":"ICE","message":"The ice warped the attack."} |
| `nightslash` | {"multiplier":1.2,"additionalType":"ICE","message":"The ice warped the attack."} |
| `darkpulse` | {"multiplier":1.2,"additionalType":"ICE","message":"The ice warped the attack."} |
| `hyperspacefury` | {"multiplier":1.2,"message":"The ice warped the attack."} |
| `hyperspacehole` | {"multiplier":1.2,"message":"The ice warped the attack."} |
| `magicroom` | {"multiplier":0,"message":"The frozen dimension remains unchanged."} |
| `wonderroom` | {"multiplier":0,"message":"The frozen dimension remains unchanged."} |
| `trickroom` | {"multiplier":0,"message":"The frozen dimension remains unchanged."} |
| `gravity` | {"multiplier":0,"message":"The frozen dimension remains unchanged."} |
| `courtchange` | {"multiplier":0,"message":"The frozen dimension remains unchanged."} |
| `teatime` | {"multiplier":0,"message":"But it failed."} |
| `electricterrain` | {"multiplier":0,"message":"The frozen dimension remains unchanged."} |
| `grassyterrain` | {"multiplier":0,"message":"The frozen dimension remains unchanged."} |
| `psychicterrain` | {"multiplier":0,"message":"The frozen dimension remains unchanged."} |
| `mistyterrain` | {"multiplier":0,"message":"The frozen dimension remains unchanged."} |
| `darkvoid` | {"accuracy":100} |
| `heatwave` | {"counter":{"index":1,"amount":1,"maximum":2,"message":"The corrupted ice is starting to thaw..."},"transition":{"field":"rejuvenation:dimensional","condition":{"counter":{"index":1,"op":">","value":1}},"push":false,"message":"The dimension thawed away!"}} |
| `searingshot` | {"counter":{"index":1,"amount":1,"maximum":2,"message":"The corrupted ice is starting to thaw..."},"transition":{"field":"rejuvenation:dimensional","condition":{"counter":{"index":1,"op":">","value":1}},"push":false,"message":"The dimension thawed away!"}} |
| `flameburst` | {"counter":{"index":1,"amount":1,"maximum":2,"message":"The corrupted ice is starting to thaw..."},"transition":{"field":"rejuvenation:dimensional","condition":{"counter":{"index":1,"op":">","value":1}},"push":false,"message":"The dimension thawed away!"}} |
| `firepledge` | {"counter":{"index":1,"amount":1,"maximum":2,"message":"The corrupted ice is starting to thaw..."},"transition":{"field":"rejuvenation:dimensional","condition":{"counter":{"index":1,"op":">","value":1}},"push":false,"message":"The dimension thawed away!"}} |
| `mindblown` | {"counter":{"index":1,"amount":1,"maximum":2,"message":"The corrupted ice is starting to thaw..."},"transition":{"field":"rejuvenation:dimensional","condition":{"counter":{"index":1,"op":">","value":1}},"push":false,"message":"The dimension thawed away!"}} |
| `incinerate` | {"counter":{"index":1,"amount":1,"maximum":2,"message":"The corrupted ice is starting to thaw..."},"transition":{"field":"rejuvenation:dimensional","condition":{"counter":{"index":1,"op":">","value":1}},"push":false,"message":"The dimension thawed away!"}} |
| `burningjealousy` | {"counter":{"index":1,"amount":1,"maximum":2,"message":"The corrupted ice is starting to thaw..."},"transition":{"field":"rejuvenation:dimensional","condition":{"counter":{"index":1,"op":">","value":1}},"push":false,"message":"The dimension thawed away!"}} |
| `infernooverdrive` | {"counter":{"index":1,"amount":2,"maximum":2,"message":null},"transition":{"field":"rejuvenation:dimensional","condition":{"counter":{"index":1,"op":">","value":1}},"push":false,"message":"The dimension thawed away!"}} |
| `eruption` | {"counter":{"index":1,"amount":2,"maximum":2,"message":null},"transition":{"field":"rejuvenation:dimensional","condition":{"counter":{"index":1,"op":">","value":1}},"push":false,"message":"The dimension thawed away!"}} |
| `lavaplume` | {"counter":{"index":1,"amount":2,"maximum":2,"message":null},"transition":{"field":"rejuvenation:dimensional","condition":{"counter":{"index":1,"op":">","value":1}},"push":false,"message":"The dimension thawed away!"}} |
| `purify` | {"transition":{"field":"rejuvenation:icy","condition":{"always":true},"push":false,"message":"The dimension was purified!"}} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Dark"} | {"condition":{"always":true},"multiplier":1.5,"message":"The darkness is here!"} |
| {"moveType":"Ice"} | {"condition":{"always":true},"multiplier":1.5,"message":"The dimension mutated the ice!"} |
| {"moveType":"Ghost"} | {"condition":{"always":true},"multiplier":1.3,"message":"The evil aura powered up the attack!"} |

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "switchIn" | {"ability":{"who":"user","values":["rattled"]}} | [{"op":"boost","stats":{"spe":1}}] | "Battler.rb:2068" |
| "switchIn" | {"ability":{"who":"user","values":["berserk"]}} | [{"op":"boost","stats":{"spa":1}}] | "Battler.rb:2265" |
| "switchIn" | {"ability":{"who":"user","values":["angershell"]}} | [{"op":"boost","stats":{"atk":1,"spa":1,"spe":1,"def":-1,"spd":-1}}] | "Battler.rb:2273" |
| "switchIn" | {"ability":{"who":"user","values":["justified","angerpoint"]}} | [{"op":"boost","stats":{"atk":1}}] | "Battler.rb:2282" |
| "switchIn" | {"all":[{"ability":{"who":"user","values":["hungerswitch"]}},{"species":{"who":"user","value":"morpeko"}}]} | [{"op":"form","species":"morpekohangry","message":"{1} transformed!"}] | "Battler.rb:2304" |
| "residual" | {"ability":{"who":"user","values":["icebody"]}} | [{"op":"heal","fraction":0.0625,"message":"{1} was healed a little by the snow!"}] | "Battle.rb:6014" |
| "damage" | {"all":[{"item":{"who":"target","values":["nevermeltice"]}},{"moveType":"Fire"}]} | [{"op":"multiply","value":0.66}] | "Battle_Move.rb:1569" |
| "priority" | {"move":"quash"} | [{"op":"add","value":1}] | "Battle_Move.rb:2303" |
| "modifyMove" | {"any":[{"move":"rage"}]} | [{"op":"moveType","type":"Dark"}] | "Battle_Move.rb:257" |
| "defense" | {"type":{"who":"user","value":"Ghost"}} | [{"op":"multiply","value":1.5}] | "Battle_Field.rb:1094-1128" |
| "specialDefense" | {"type":{"who":"user","value":"Ghost"}} | [{"op":"multiply","value":1.5}] | "Battle_Field.rb:1094-1128" |
| "defense" | {"type":{"who":"user","value":"Ice"}} | [{"op":"multiply","value":1.2}] | "Battle_Field.rb:1094-1128" |
| "specialDefense" | {"type":{"who":"user","value":"Ice"}} | [{"op":"multiply","value":1.2}] | "Battle_Field.rb:1094-1128" |
| "defense" | {"type":{"who":"user","value":"Fire"}} | [{"op":"multiply","value":0.8}] | "Battle_Field.rb:1094-1128" |
| "specialDefense" | {"type":{"who":"user","value":"Fire"}} | [{"op":"multiply","value":0.8}] | "Battle_Field.rb:1094-1128" |
| "weatherChange" | {"weather":"snow"} | [{"op":"setWeather","id":"hail"}] | "Battle_Field.rb:420" |
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
| "chargeMove" | {"move":"freezeshock"} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4526" |
| "chargeMove" | {"move":"iceburn"} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4565" |
| "chargeMove" | {"move":"phantomforce"} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4850" |
| "chargeMove" | {"move":"shadowforce"} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4850" |
| "chargeMove" | {"all":[{"move":"razorwind"},{"overlay":"rejuvenation:grassy_terrain"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4430" |
| "chargeMove" | {"all":[{"any":[{"move":"solarbeam"},{"move":"solarblade"}]},{"overlay":"rejuvenation:rainbow"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4472" |
| "modifyMove" | {"all":[{"move":"mist"},{"not":{"sideCondition":"mist"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"createField","field":"rejuvenation:misty_terrain","duration":3,"extendedBy":3,"message":"Mist swirled around the battlefield!"}]}] | "Battle_MoveEffects.rb:1817" |
| "modifyMove" | {"move":"snarl"} | [{"op":"moveProperty","path":"secondaries.0.boosts","value":{"spa":-2}}] | "Battle_MoveEffects.rb:1459" |
| "modifyMove" | {"move":"ruination"} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onAfterHit","actions":[{"op":"status","status":"ptr","who":"target"}]}] | "Battle_MoveEffects.rb:2447" |
| "modifyMove" | {"move":"oblivionwing"} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onAfterHit","actions":[{"op":"status","status":"ptr","who":"target"}]}] | "Battle_MoveEffects.rb:7157" |
| "modifyMove" | {"move":"powertrip"} | [{"op":"moveBehavior","recipe":"boostStagePower","base":40}] | "Battle_MoveEffects.rb:3029" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "modifyMove" | {"move":"rage"} | [{"op":"moveProperty","path":"basePower","value":60},{"op":"moveProperty","path":"self","value":{"boosts":{"atk":1}}}] | "Battle_MoveEffects.rb:3103" |
| "modifyMove" | {"move":"partingshot"} | [{"op":"moveBehavior","recipe":"gatedStatChanges","stats":{"atk":-1,"spa":-1,"spe":-1},"gateStats":{"atk":-1,"spa":-1,"spe":-1},"gateWho":"user","selfSwitch":true,"failureMessage":"{1}'s stats can't be lowered!"}] | "Battle_MoveEffects.rb:7244" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |

## Original status-move highlights

Source UI buff highlights: `["partingshot","auroraveil","darkvoid","hail","snowscape","chillyreception"]`.

Source UI nerf highlights: `[]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["auroraveil"],"unreviewedHighlightedMoves":["chillyreception","darkvoid","hail","partingshot","snowscape"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| AdvancedWeather.rb:5444 | battle.field.effect == :FROZENDIMENSION | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:413 | @field.effect == :FROZENDIMENSION && weather == :SNOW | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:5446 | (i.ability == :SOLARPOWER \|\| (i.crested == :CASTFORM && i.form == 1)) && @field.effect != :FROZENDIMENSION | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:5549 | @field.effect == :FROZENDIMENSION | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:5586 | [:DIMENSIONAL, :FROZENDIMENSION].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6016 | [:ICY, :SNOWYMOUNTAIN, :FROZENDIMENSION].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6619 | [:DIMENSIONAL, :FROZENDIMENSION, :INFERNAL].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6922 | @field.effect != :FROZENDIMENSION | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6930 | @field.effect != :FROZENDIMENSION | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6950 | @field.effect != :FROZENDIMENSION | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6959 | @field.effect != :FROZENDIMENSION | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:7000 | Overlays && @field.overlay && @field.effect != :FROZENDIMENSION | implemented_and_tested | An existing overlay clock pauses on Frozen Dimension and resumes after leaving. Hard-field clocks resolve before overlay clocks; simultaneous expiries emit hard-field restoration text first. Overlay incompatibility removal remains a separate field-entry policy. Tests: Frozen Dimension pauses existing overlay clock and resumes it after leaving, hard restoration occurs before overlay expiry flavor on the same turn |
| Battle.rb:7365 | @field.effect == :FROZENDIMENSION | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:353 | self.ability == :MAGMAARMOR && !shouldBeMoldBroken?(attacker, move) && @battle.FE != :FROZENDIMENSION | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:878 | :DIMENSIONAL, :FROZENDIMENSION | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:1438 | [:ICY, :SNOWYMOUNTAIN, :FROZENDIMENSION].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:294 | @field.effect == :FROZENDIMENSION | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:434 | @field.effect == :FROZENDIMENSION && @weather == :SNOW | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:1115 | :FROZENDIMENSION | implemented_and_tested | Frozen Dimension independently compounds Ghost 1.5, Ice 1.2, Fire 0.8 defensive factors, including dual-type combinations. Tests: every compiled field defense branch uses the source type, stat and weather gates, Mega Sol overrides hail for field defense, Deux Finalis defense uses attacker-relative weather |
| Battle_Inspect.rb:45 | self.ability == :FLAREBOOST && (self.status == :BURN \|\| [:BURNING, :VOLCANIC, :INFERNAL].include?(@battle.FE)) && @battle.FE != :FROZENDIMENSION | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:265 | :FROZENDIMENSION | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:374 | attacker.ability == :FLAREBOOST && (attacker.status == :BURN \|\| [:BURNING, :VOLCANIC, :INFERNAL].include?(@battle.FE)) && @battle.FE != :FROZENDIMENSION | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:649 | @battle.FE != :FROZENDIMENSION | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:913 | opponent.ability == :SNOWCLOAK && ([:HAIL, :SNOW].include?(@battle.pbWeather(attacker)) \|\| [:ICY, :SNOWYMOUNTAIN, :FROZENDIMENSION].include?(@battle.FE) \|\| opponent.crested == :GLACEON) && !opponent.moldbroken | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1256 | [:ICY, :SNOWYMOUNTAIN, :FROZENDIMENSION].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1286 | (attacker.status == :BURN \|\| [:BURNING, :VOLCANIC, :INFERNAL].include?(@battle.FE)) && pbIsSpecial?(attacker, type) && @battle.FE != :FROZENDIMENSION | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1492 | (attacker.ability == :SOLARPOWER \|\| (attacker.crested == :CASTFORM && attacker.form == 1)) && weather == :SUNNYDAY && !(attacker.hasWorkingItem(:UTILITYUMBRELLA) \|\| @battle.FE == :FROZENDIMENSION) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1560 | (attacker.ability == :OVERGROW && type == :GRASS) \|\| (attacker.ability == :BLAZE && type == :FIRE && @battle.FE != :FROZENDIMENSION) \|\|<br>         (attacker.ability == :TORRENT && type == :WATER) \|\| (attacker.ability == :SWARM && type == :BUG) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1565 | attacker.effects[:FlashFire] && type == :FIRE && @battle.FE != :FROZENDIMENSION | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1570 | oppitemworks && opponent.item == :NEVERMELTICE && (@battle.state.effects[:NeverMeltIce] \|\| @battle.FE == :FROZENDIMENSION) && type == :FIRE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1692 | (opponent.ability == :SOLARPOWER \|\| (opponent.crested == :CASTFORM && opponent.form == 1)) && weather == :SUNNYDAY && !(opponent.hasWorkingItem(:UTILITYUMBRELLA) \|\| @battle.FE == :FROZENDIMENSION) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:2079 | opponent.effects[:IceFace] && (pbIsPhysical?(attacker, type) \|\| @battle.FE == :FROZENDIMENSION) && (!attacker \|\| attacker.index != opponent.index) && !opponent.moldbroken | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:2303 | @move == :QUASH && [:DIMENSIONAL, :FROZENDIMENSION].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1459 | [:FROZENDIMENSION, :BACKALLEY].include?(@battle.FE) && @move == :SNARL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2415 | [:DIMENSIONAL, :FROZENDIMENSION].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2447 | @move == :RUINATION && [:DEUXFINALIS, :DIMENSIONAL, :FROZENDIMENSION].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:3029 | @battle.FE == :FROZENDIMENSION && @move == :POWERTRIP | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:3103 | [:DIMENSIONAL, :FROZENDIMENSION].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:3110 | [:DIMENSIONAL, :FROZENDIMENSION].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:4526 | @battle.FE == :FROZENDIMENSION | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:4565 | @battle.FE == :FROZENDIMENSION | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:4850 | (Rejuv && [:DIMENSIONAL, :FROZENDIMENSION, :HAUNTED, :SHORTCIRCUIT, :DEUXFINALIS].include?(@battle.FE)) \|\| @battle.ProgressiveFieldCheck(PBFields::DARKNESS, 2, 3) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6202 | attacker.hasWorkingItem(:ICYROCK) \|\| [:ICY, :SNOWYMOUNTAIN, :FROZENDIMENSION, :SKY, :CLOUDS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6262 | attacker.hasWorkingItem(:ICYROCK) \|\| [:ICY, :SNOWYMOUNTAIN, :FROZENDIMENSION, :SKY, :CLOUDS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7157 | @move == :OBLIVIONWING && [:DEUXFINALIS, :DIMENSIONAL, :FROZENDIMENSION].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7244 | @battle.FE == :FROZENDIMENSION | implemented_and_tested | Parting Shot validity checks the USER offensive stages (plus Speed on Frozen Dimension), honoring Contrary; it then lowers TARGET stats by one on Frozen Dimension or two on Concert/Back Alley. A successful source-valid use can switch even when target stat loss is blocked/capped. Outside these field deviations native behavior is retained. Tests: Parting Shot field stat changes replace native stat callbacks, Parting Shot source gate checks user stages with Contrary and includes Frozen Speed, Parting Shot switches after source-valid use even when target stat loss is blocked |
| Battle_MoveEffects.rb:7256 | @battle.FE == :FROZENDIMENSION | implemented_and_tested | Parting Shot validity checks the USER offensive stages (plus Speed on Frozen Dimension), honoring Contrary; it then lowers TARGET stats by one on Frozen Dimension or two on Concert/Back Alley. A successful source-valid use can switch even when target stat loss is blocked/capped. Outside these field deviations native behavior is retained. Tests: Parting Shot field stat changes replace native stat callbacks, Parting Shot source gate checks user stages with Contrary and includes Frozen Speed, Parting Shot switches after source-valid use even when target stat loss is blocked |
| Battle_MoveEffects.rb:7724 | [:DARKCRYSTALCAVERN, :RAINBOW, :ICY, :CRYSTALCAVERN, :SNOWYMOUNTAIN, :MIRROR, :STARLIGHT, :FROZENDIMENSION].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:9564 | attacker.hasWorkingItem(:ICYROCK) \|\| [:ICY, :SNOWYMOUNTAIN, :FROZENDIMENSION, :SKY, :CLOUDS, :BIGTOP].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2252 | [:DIMENSIONAL, :FROZENDIMENSION, :DEUXFINALIS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2260 | [:DIMENSIONAL, :FROZENDIMENSION].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2304 | @battle.FE == :FROZENDIMENSION && self.ability == :HUNGERSWITCH && self.species == :MORPEKO && self.form == 0 | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2982 | self.hasWorkingItem(:ICYROCK) \|\| [:ICY, :SNOWYMOUNTAIN, :FROZENDIMENSION, :SKY, :CLOUDS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:3651 | target.ability == :FLAMEBODY && user.pbCanBurn?(target, nil) && @battle.FE != :FROZENDIMENSION && @battle.pbRandom(10) < 3 | implemented_and_tested | Frozen Dimension prevents Flame Body burning even when its ordinary contact roll would succeed. Native behavior resumes outside the field. Tests: amplified Poison Point uses 60 percent and Frozen Dimension disables Flame Body |
| Battler.rb:3930 | @battle.canChangeFE?(:GRASSY) && @battle.OV != :GRASSY && @battle.FE != :FROZENDIMENSION && (Overlays \|\| @battle.FE != :FLOWERGARDEN5) | implemented_and_tested | Seed Sower grows Garden stages 1-4; other permitted fields create Grassy terrain with source duration/Amplifield and Forest/Bewitched extensions. Ability creation ignores the move-only Everstone restriction. Tests: Seed Sower grows each garden stage and creates longer forest terrain without Everstone blocking |
| Battler.rb:6055 | [:DEUXFINALIS, :FROZENDIMENSION].include?(@battle.FE) && [:CHILLINGNEIGH, :ASONECHILLING].include?(self.ability) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7071 | ((user.ability == :DARKAURA && [:DIMENSIONAL,:FROZENDIMENSION, :DEUXFINALIS].include?(@battle.FE)) \|\| user.hasWorkingItem(:SOULSTONEHELD)) && flags[:totaldamage] > 0 && user.canHeal? | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7072 | (user.ability == :DARKAURA && [:DIMENSIONAL,:FROZENDIMENSION, :DEUXFINALIS].include?(@battle.FE)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7344 | (self.ability == :SOLARPOWER \|\| (self.crested == :CASTFORM && self.form == 1)) && weather == :SUNNYDAY && !(self.hasWorkingItem(:UTILITYUMBRELLA) \|\| @battle.FE == :FROZENDIMENSION) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Rejuv/Battle/Battle.rb:26 | [:ICY, :SNOWYMOUNTAIN, :FROZENDIMENSION, :SKY, :CLOUDS].include?(@field.effect) | excluded_crest | These field duration clauses are wholly inside pbCrestEffects, guarded by crested and selected by the Castform Crest. Ordinary weather extensions are audited separately. Tests:  |

AI source leads: 48. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":[],"abilities":["gravitycontrol","hailwarning"],"items":[]}`.
