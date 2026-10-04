# Sky Field

Original ID: `SKY`; datapack ID: `rejuvenation:sky`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "The sky is filled with clouds."

Nature Power: `skyattack`. Secret Power animation/reference move: `wingattack`.

Secret Power actual secondary choices: `[{"volatileStatus":"confusion"}]`.

Mimicry type: `Flying`; Burmy cloak reference: `PLANTCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"elementalseed","effect":null,"duration":0,"message":null,"stats":{"def":1,"spd":1}}`. Seed actions: `null`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"tailwind":{"duration":8,"sourceMoves":["tailwind"],"source":"Battle_MoveEffects.rb:1952-1953"},"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"},"sunnyday":{"duration":8,"sourceMoves":["sunnyday"],"sourceAbilities":["drought","orichalcumpulse"],"source":"Battle_MoveEffects.rb:6217; Battler.rb:2937-2994"},"raindance":{"duration":8,"sourceMoves":["raindance"],"sourceAbilities":["drizzle"],"source":"Battle_MoveEffects.rb:6232; Battler.rb:2937-2994"},"sandstorm":{"duration":8,"sourceMoves":["sandstorm"],"sourceAbilities":["sandstream","sandspit","sandspit","sandspit"],"source":"Battle_MoveEffects.rb:6247; Battler.rb:2937-2994"},"snow":{"duration":8,"sourceMoves":["snowscape","chillyreception"],"sourceAbilities":["snowwarning"],"source":"Battle_MoveEffects.rb:6202; Battler.rb:2937-2994"},"hail":{"duration":8,"sourceMoves":["hail","snowscape","chillyreception"],"sourceAbilities":["snowwarning","hailwarning"],"source":"Battle_MoveEffects.rb:6262; Battler.rb:2937-2994"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

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
| `icywind` | {"multiplier":1.5,"message":"The open skies strengthened the attack!"} |
| `silverwind` | {"multiplier":1.5,"message":"The open skies strengthened the attack!"} |
| `ominouswind` | {"multiplier":1.5,"message":"The open skies strengthened the attack!"} |
| `fairywind` | {"multiplier":1.5,"message":"The open skies strengthened the attack!"} |
| `aeroblast` | {"multiplier":1.5,"message":"The open skies strengthened the attack!"} |
| `flyingpress` | {"multiplier":1.5,"message":"The open skies strengthened the attack!"} |
| `skyuppercut` | {"multiplier":1.5,"message":"The open skies strengthened the attack!"} |
| `thundershock` | {"multiplier":1.5,"message":"The open skies strengthened the attack!"} |
| `thunderbolt` | {"multiplier":1.5,"message":"The open skies strengthened the attack!"} |
| `steelwing` | {"multiplier":1.5,"message":"The open skies strengthened the attack!"} |
| `dragondarts` | {"multiplier":1.5,"message":"The open skies strengthened the attack!"} |
| `gravapple` | {"multiplier":1.5,"message":"The open skies strengthened the attack!","transition":{"field":"rejuvenation:mountain","condition":{"always":true},"push":false,"message":"The battle has been brought down to the mountains!"}} |
| `dragonascent` | {"multiplier":1.5,"message":"The open skies strengthened the attack!"} |
| `thunder` | {"multiplier":1.5,"accuracy":0,"message":"The open skies strengthened the attack!"} |
| `twister` | {"multiplier":1.5,"additionalType":"FLYING","message":"The open skies strengthened the attack!"} |
| `razorwind` | {"multiplier":1.5,"message":"The open skies strengthened the attack!"} |
| `dive` | {"multiplier":1.5,"additionalType":"FLYING","message":"The open skies strengthened the attack!"} |
| `esperwing` | {"multiplier":1.5,"message":"The open skies strengthened the attack!"} |
| `bleakwindstorm` | {"multiplier":1.5,"message":"The open skies strengthened the attack!"} |
| `springtidestorm` | {"multiplier":1.3,"message":"The open skies strengthened the attack!"} |
| `wildboltstorm` | {"multiplier":1.3,"message":"The open skies strengthened the attack!"} |
| `sandsearstorm` | {"multiplier":1.3,"message":"The open skies strengthened the attack!"} |
| `earthquake` | {"multiplier":0,"message":"But there is no solid ground!"} |
| `magnitude` | {"multiplier":0,"message":"But there is no solid ground!"} |
| `bulldoze` | {"multiplier":0,"message":"But there is no solid ground!"} |
| `dig` | {"multiplier":0,"message":"But there is no solid ground!"} |
| `rototiller` | {"multiplier":0,"message":"But there is no solid ground!"} |
| `spikes` | {"multiplier":0,"message":"But there is no solid ground!"} |
| `toxicspikes` | {"multiplier":0,"message":"But there is no solid ground!"} |
| `stickyweb` | {"multiplier":0,"message":"But there is no solid ground!"} |
| `hurricane` | {"accuracy":0} |
| `gravity` | {"transition":{"field":"rejuvenation:mountain","condition":{"always":true},"push":false,"message":"The battle has been brought down to the mountains!"}} |
| `ingrain` | {"transition":{"field":"rejuvenation:mountain","condition":{"always":true},"push":false,"message":"The battle has been brought down to the mountains!"}} |
| `thousandarrows` | {"transition":{"field":"rejuvenation:mountain","condition":{"always":true},"push":false,"message":"The battle has been brought down to the mountains!"}} |
| `smackdown` | {"transition":{"field":"rejuvenation:mountain","condition":{"always":true},"push":false,"message":"The battle has been brought down to the mountains!"}} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Flying"} | {"condition":{"always":true},"multiplier":1.5,"message":"The open air strengthened the attack!"} |

## Type-chart exceptions

| Attacking type | Defending type | Result exponent / immunity | Condition |
|---|---|---|---|
| "*" | "Flying" | 1 | {"move":"bonemerang"} |
| "*" | "Flying" | 1 | {"ability":{"who":"user","values":["longreach"]}} |

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "switchIn" | {"ability":{"who":"user","values":["bigpecks"]}} | [{"op":"boost","stats":{"def":1}}] | "Battler.rb:2335" |
| "damage" | {"ability":{"who":"user","values":["longreach"]}} | [{"op":"multiply","value":1.5}] | "Battle_Move.rb:1611" |
| "priority" | {"all":[{"ability":{"who":"user","values":["galewings"]}},{"moveType":"Flying"},{"hp":{"who":"user","op":"<","fraction":1}}]} | [{"op":"add","value":1}] | "Battle_Effects.rb:1403" |
| "setStatus" | {"all":[{"status":"slp"},{"ability":{"who":"target","values":["earlybird"]}}]} | [{"op":"message","who":"target","text":"{1} can't fall asleep in the open skies!"},{"op":"reject"}] | "Battle_Effects.rb:144" |
| "setWeather" | {"globalAbility":["cloudnine"]} | [{"op":"message","text":"But it failed!"},{"op":"reject"}] | "Battle.rb:367-372" |
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
| "chargeMove" | {"move":"razorwind"} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4430" |
| "chargeMove" | {"move":"skyattack"} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4608" |
| "chargeMove" | {"move":"fly"} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4684" |
| "chargeMove" | {"move":"bounce"} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4808" |
| "chargeMove" | {"all":[{"move":"razorwind"},{"overlay":"rejuvenation:grassy_terrain"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4430" |
| "chargeMove" | {"all":[{"any":[{"move":"solarbeam"},{"move":"solarblade"}]},{"overlay":"rejuvenation:rainbow"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4472" |
| "modifyMove" | {"all":[{"move":"weatherball"},{"weather":["deltastream"]}]} | [{"op":"moveProperty","path":"basePower","value":100},{"op":"moveType","type":"Flying"}] | "Battle_MoveEffects.rb:2914-2927" |
| "modifyMove" | {"move":"flyingpress"} | [{"op":"moveBehavior","recipe":"firstTypeBonus","type":"Flying","repeat":2,"positiveOnly":true}] | "Battle_MoveEffects.rb:778" |
| "modifyMove" | {"all":[{"move":"mist"},{"not":{"sideCondition":"mist"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"createField","field":"rejuvenation:misty_terrain","duration":3,"extendedBy":3,"message":"Mist swirled around the battlefield!"}]}] | "Battle_MoveEffects.rb:1817" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "modifyMove" | {"move":"mirrormove"} | [{"op":"moveBehavior","recipe":"beforeCalledMoveActions","callback":"onTryHit","actions":[{"op":"boost","stats":{"atk":1,"spa":1,"spe":1}}]}] | "Battle_MoveEffects.rb:3819" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |

## Original status-move highlights

Source UI buff highlights: `["mirrormove","tailwind","sunnyday","hail","snowscape","chillyreception","sandstorm","raindance"]`.

Source UI nerf highlights: `[]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":[],"unreviewedHighlightedMoves":["chillyreception","hail","mirrormove","raindance","sandstorm","snowscape","sunnyday","tailwind"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Battle.rb:369 | @battle.FE == :SKY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:746 | [:MOUNTAIN, :SNOWYMOUNTAIN, :VOLCANICTOP, :SKY].include?(@field.effect) && canSetWeather?(:STRONGWINDS) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:747 | @field.effect == :SKY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:3176 | [:WATERSURFACE, :MURKWATERSURFACE, :SKY, :CLOUDS].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:3251 | [:SKY, :CLOUDS].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:3260 | [:WATERSURFACE, :MURKWATERSURFACE, :SKY, :CLOUDS].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:1406 | @battle.FE == :SKY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Inspect.rb:9 | self.ability == :LONGREACH && [:MOUNTAIN, :SNOWYMOUNTAIN, :SKY].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:479 | @battle.FE == :SKY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:779 | @secondtype == :FLYING && @battle.FE == :SKY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1243 | [:MOUNTAIN, :SNOWYMOUNTAIN, :SKY].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1616 | [:MOUNTAIN, :SNOWYMOUNTAIN, :VOLCANICTOP, :SKY].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1953 | @battle.FE == :SKY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2914 | @battle.FE == :RAINBOW \|\| [:SANDSTORM, :HAIL, :SNOW].include?(weather) \|\| ([:SUNNYDAY, :RAINDANCE].include?(weather) && !attacker.hasWorkingItem(:UTILITYUMBRELLA)) \|\| (weather == :STRONGWINDS && @battle.FE == :SKY) \|\| (weather == :SHADOWSKY && Rejuv) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2927 | @battle.FE == :SKY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:3819 | @battle.FE == :SKY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:4430 | [:CLOUDS, :SKY].include?(@battle.FE) \|\| (Rejuv && (@battle.FE == :GRASSY \|\| @battle.OV == :GRASSY)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:4608 | [:CLOUDS, :SKY].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:4684 | [:CLOUDS, :CAVE, :SKY].include?(@battle.FE) \|\| (Rejuv && @battle.FE == :DRAGONSDEN) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:4808 | [:CLOUDS, :CAVE, :SKY].include?(@battle.FE) \|\| (Rejuv && @battle.FE == :DRAGONSDEN) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6202 | attacker.hasWorkingItem(:ICYROCK) \|\| [:ICY, :SNOWYMOUNTAIN, :FROZENDIMENSION, :SKY, :CLOUDS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6217 | attacker.hasWorkingItem(:HEATROCK) \|\| [:DESERT, :MOUNTAIN, :SNOWYMOUNTAIN, :SKY].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6232 | attacker.hasWorkingItem(:DAMPROCK) \|\| [:CLOUDS, :SKY].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6247 | attacker.hasWorkingItem(:SMOOTHROCK) \|\| [:DESERT, :ASHENBEACH, :SKY].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6262 | attacker.hasWorkingItem(:ICYROCK) \|\| [:ICY, :SNOWYMOUNTAIN, :FROZENDIMENSION, :SKY, :CLOUDS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:9564 | attacker.hasWorkingItem(:ICYROCK) \|\| [:ICY, :SNOWYMOUNTAIN, :FROZENDIMENSION, :SKY, :CLOUDS, :BIGTOP].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Shadow.rb:278 | @battle.FE == :SKY | excluded_custom_move | The enclosing custom Shadow Sky handler changes the custom shadow weather clock; ordinary Sky/Dimensional weather clocks are separate. Tests:  |
| Battler.rb:2335 | @battle.FE == :SKY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2940 | self.hasWorkingItem(:DAMPROCK) \|\| [:CLOUDS, :SKY].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2952 | self.hasWorkingItem(:SMOOTHROCK) \|\| [:DESERT, :ASHENBEACH, :SKY].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2967 | self.hasWorkingItem(:HEATROCK) \|\| [:DESERT, :MOUNTAIN, :SNOWYMOUNTAIN, :SKY].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2982 | self.hasWorkingItem(:ICYROCK) \|\| [:ICY, :SNOWYMOUNTAIN, :FROZENDIMENSION, :SKY, :CLOUDS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:3899 | target.hasWorkingItem(:SMOOTHROCK) \|\| [:DESERT, :ASHENBEACH, :SKY].include?(@battle.FE) | implemented_and_tested | Sand Spit lasts eight turns on Desert/Ashen Beach/Sky; Desert/Ashen Beach also reduce attacker accuracy once only if weather was successfully set. Tests: Sand Spit accuracy loss requires successful weather and uses the field eight-turn clock |
| Rejuv/Battle/Battle.rb:23 | [:DESERT, :MOUNTAIN, :SNOWYMOUNTAIN, :SKY].include?(@field.effect) | excluded_crest | These field duration clauses are wholly inside pbCrestEffects, guarded by crested and selected by the Castform Crest. Ordinary weather extensions are audited separately. Tests:  |
| Rejuv/Battle/Battle.rb:24 | [:CLOUDS, :SKY].include?(@field.effect) | excluded_crest | These field duration clauses are wholly inside pbCrestEffects, guarded by crested and selected by the Castform Crest. Ordinary weather extensions are audited separately. Tests:  |
| Rejuv/Battle/Battle.rb:25 | [:DESERT, :ASHENBEACH, :SKY].include?(@field.effect) | excluded_crest | These field duration clauses are wholly inside pbCrestEffects, guarded by crested and selected by the Castform Crest. Ordinary weather extensions are audited separately. Tests:  |
| Rejuv/Battle/Battle.rb:26 | [:ICY, :SNOWYMOUNTAIN, :FROZENDIMENSION, :SKY, :CLOUDS].include?(@field.effect) | excluded_crest | These field duration clauses are wholly inside pbCrestEffects, guarded by crested and selected by the Castform Crest. Ordinary weather extensions are audited separately. Tests:  |

AI source leads: 20. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":[],"abilities":["gravitycontrol","hailwarning"],"items":[]}`.
