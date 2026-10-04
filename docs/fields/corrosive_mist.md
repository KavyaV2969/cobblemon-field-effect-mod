# Corrosive Mist Field

Original ID: `CORROSIVEMIST`; datapack ID: `rejuvenation:corrosive_mist`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "Corrosive mist settles on the field!"

Nature Power: `corrosivegas`. Secret Power animation/reference move: `acidspray`.

Secret Power actual secondary choices: `[{"status":"psn"}]`.

Mimicry type: `Poison`; Burmy cloak reference: `TRASHCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"elementalseed","effect":null,"duration":0,"message":null,"stats":{"atk":1,"spa":1}}`. Seed actions: `[{"op":"status","status":"tox"}]`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{"aquaring":{"respectMagicGuard":false,"message":"{1}'s Aqua Ring absorbed the poison!"}},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `{"blockedFields":["rejuvenation:misty_terrain"],"source":"Battle_Field.rb:303-308"}`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `null` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The terrain returned to normal."`.

Shared stat pools: `null`. Absorber policies: `null`. Indirect immunity: `null`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"aftermath":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"conditional","condition":{"all":[{"contact":{"who":"target"}},{"hp":{"who":"user","op":"<=","fraction":0}},{"not":{"globalAbility":["damp"]}},{"not":{"ability":{"who":"target","values":["magicguard"]}}}]},"actions":[{"op":"damage","who":"target","fraction":0.5}]}],"source":"Battler.rb:3609"}},"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":5,"extendedBy":3,"blockEverstone":false}],"source":"Battler.rb:3926"}}}`. Inactive abilities: `null`. Status type bypass: `[{"status":"psn","condition":{"ability":{"who":"user","values":["toxicchain"]}},"source":"Battle_Effects.rb:211"}]`.

Field form typing: `["arceus","silvally"]`. Custom volatile rules: `null`. Rampage policy: `null`.

Progression: `null`. Party roles: `null`.

Field clock policy: `null`.

Fields persist for the battle unless transformed/destroyed. Move/ability terrain creation uses its own finite duration; engine stack restoration and overlay clocks are described in ARCHITECTURE.md.

## Core move rules

| Move ID | Executable properties and exact source text |
|---|---|
| `bubblebeam` | {"multiplier":1.5,"additionalType":"POISON","message":"The poison strengthened the attack!"} |
| `acidspray` | {"multiplier":1.5,"message":"The poison strengthened the attack!"} |
| `bubble` | {"multiplier":1.5,"additionalType":"POISON","message":"The poison strengthened the attack!"} |
| `smog` | {"multiplier":1.5,"message":"The poison strengthened the attack!"} |
| `clearsmog` | {"multiplier":1.5,"message":"The poison strengthened the attack!"} |
| `sparklingaria` | {"multiplier":1.5,"additionalType":"POISON","message":"The poison strengthened the attack!"} |
| `appleacid` | {"multiplier":1.5,"additionalType":"POISON","message":"The poison strengthened the attack!"} |
| `toxic` | {"accuracy":100} |
| `energyball` | {"additionalType":"POISON"} |
| `mistyexplosion` | {"additionalType":"POISON"} |
| `whirlwind` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The mist was blown away!"}} |
| `gust` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The mist was blown away!"}} |
| `razorwind` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The mist was blown away!"}} |
| `defog` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The mist was blown away!"}} |
| `hurricane` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The mist was blown away!"}} |
| `twister` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The mist was blown away!"}} |
| `tailwind` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The mist was blown away!"}} |
| `supersonicskystrike` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The mist was blown away!"}} |
| `heatwave` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The toxic mist combusted!","after":[{"op":"mist_explosion"}]}} |
| `eruption` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The toxic mist combusted!","after":[{"op":"mist_explosion"}]}} |
| `searingshot` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The toxic mist combusted!","after":[{"op":"mist_explosion"}]}} |
| `flameburst` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The toxic mist combusted!","after":[{"op":"mist_explosion"}]}} |
| `lavaplume` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The toxic mist combusted!","after":[{"op":"mist_explosion"}]}} |
| `firepledge` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The toxic mist combusted!","after":[{"op":"mist_explosion"}]}} |
| `mindblown` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The toxic mist combusted!","after":[{"op":"mist_explosion"}]}} |
| `incinerate` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The toxic mist combusted!","after":[{"op":"mist_explosion"}]}} |
| `infernooverdrive` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The toxic mist combusted!","after":[{"op":"mist_explosion"}]}} |
| `burningjealousy` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The toxic mist combusted!","after":[{"op":"mist_explosion"}]}} |
| `selfdestruct` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The toxic mist combusted!","after":[{"op":"mist_explosion"}]}} |
| `explosion` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The toxic mist combusted!","after":[{"op":"mist_explosion"}]}} |
| `bleakwindstorm` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The mist was blown away!"}} |
| `seedflare` | {"transition":{"field":"rejuvenation:misty_terrain","condition":{"always":true},"push":false,"message":"The polluted mist was purified!"}} |
| `gravity` | {"transition":{"field":"rejuvenation:corrosive","condition":{"always":true},"push":true,"message":"The toxic mist collected on the ground!"}} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Fire"} | {"condition":{"always":true},"multiplier":1.5,"message":"The toxic mist caught flame!"} |

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "switchIn" | {"ability":{"who":"user","values":["watercompaction"]}} | [{"op":"boost","stats":{"def":2}}] | "Battler.rb:2231" |
| "damage" | {"ability":{"who":"user","values":["corrosion"]}} | [{"op":"multiply","value":1.5}] | "Battle_Move.rb:1611" |
| "modifyMove" | {"all":[{"moveType":"Flying"},{"category":"Special"}]} | [{"op":"extraType","values":["Poison"]}] | "Battle_Move.rb:800" |
| "residual" | {"all":[{"ability":{"who":"user","values":["dryskin"]}},{"not":{"type":{"who":"user","value":"Steel"}}},{"not":{"type":{"who":"user","value":"Poison"}}}]} | [{"op":"residualDamage","fraction":0.125,"message":"{1} absorbed the poison!"}] | "Battle.rb:5990" |
| "residual" | {"all":[{"ability":{"who":"user","values":["dryskin"]}},{"not":{"type":{"who":"user","value":"Steel"}}},{"type":{"who":"user","value":"Poison"}}]} | [{"op":"heal","fraction":0.125,"message":"{1} was healed by the poison!"}] | "Battle.rb:5998" |
| "residual" | {"not":{"globalAbility":["neutralizinggas"]}} | [{"op":"status","status":"psn","message":"The Pokémon were poisoned by the corrosive mist!"}] | "Battle.rb:5984" |
| "modifyMove" | {"move":"barbbarrage"} | [{"op":"moveProperty","path":"basePower","value":120,"removeCallback":"onBasePower"}] | "Battle_MoveEffects.rb:9159" |
| "criticalRatio" | {"ability":{"who":"user","values":["merciless"]}} | [{"op":"set","value":4}] | "Battle_Move.rb:980" |
| "overlayIn" | {"all":[{"overlay":"rejuvenation:psychic_terrain"},{"ability":{"who":"user","values":["anticipation","forewarn"]}}]} | [{"op":"boost","stats":{"spa":1}}] | "Battler.rb:2644-2652" |
| "overlayIn" | {"all":[{"overlay":"rejuvenation:misty_terrain"},{"ability":{"who":"user","values":["watercompaction"]}}]} | [{"op":"boost","stats":{"def":2}}] | "Battler.rb:2654-2662" |
| "modifyMove" | {"move":"floralhealing"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"status","status":"psn","who":"target"}]}] | "Battle_MoveEffects.rb:7893" |
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
| "modifyMove" | {"move":"venoshock"} | [{"op":"moveProperty","path":"basePower","value":130,"removeCallback":"onBasePower"}] | "Battle_MoveEffects.rb:2758" |
| "modifyMove" | {"move":"venomdrench"} | [{"op":"moveProperty","path":"boosts","value":{"atk":-1,"spa":-1,"spe":-1},"removeCallback":"onHit"}] | "Battle_MoveEffects.rb:7313" |
| "modifyMove" | {"all":[{"move":"mist"},{"not":{"sideCondition":"mist"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"createField","field":"rejuvenation:misty_terrain","duration":3,"extendedBy":3,"message":"Mist swirled around the battlefield!"}]}] | "Battle_MoveEffects.rb:1817" |
| "modifyMove" | {"move":"acidarmor"} | [{"op":"moveProperty","path":"boosts","value":{"def":3}}] | "Battle_MoveEffects.rb:1069" |
| "modifyMove" | {"move":"smokescreen"} | [{"op":"moveProperty","path":"boosts","value":{"accuracy":-2}}] | "Battle_MoveEffects.rb:1501" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "modifyMove" | {"move":"corrosivegas"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"boost","who":"target","stats":{"atk":-1,"def":-1,"spa":-1,"spd":-1,"spe":-1}}]}] | "Battle_MoveEffects.rb:9013" |
| "modifyMove" | {"move":"lifedew"} | [{"op":"moveBehavior","recipe":"targetHealing","fraction":0.25,"userFraction":0.25,"actions":[{"op":"status","who":"target","status":"psn"}]}] | "Battle_MoveEffects.rb:8674" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |

## Original status-move highlights

Source UI buff highlights: `["acidarmor","smokescreen","toxic","venomdrench","venoshock","barbbarrage","mistyexplosion"]`.

Source UI nerf highlights: `[]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["acidarmor","barbbarrage","smokescreen","venomdrench","venoshock"],"unreviewedHighlightedMoves":["mistyexplosion","toxic"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Battle.rb:5977 | @field.effect == :CORROSIVEMIST | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:5985 | [:CORROSIVEMIST, :CORRUPTED].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6335 | @field.effect == :CORROSIVEMIST && !i.hasType?(:STEEL) && !i.hasType?(:POISON) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6491 | (i.ability == :POISONHEAL \|\| i.crested == :ZANGOOSE) && i.canHeal? &&<br>         (i.status == :POISON \|\| [:CORROSIVEMIST, :CORRUPTED].include?(@battle.FE) \|\| ([:CORROSIVE, :MURKWATERSURFACE, :WASTELAND].include?(@battle.FE) && !i.isAirborne?)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:277 | :CORROSIVEMIST | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:300 | Overlays && !ignoreOverlays &&<br>       (newfield.include?(@field.overlay) \|\|<br>       (newfield.include?(:MISTY) && @field.effect == :CORROSIVEMIST) \|\|<br>       (newfield.include?(:DARKNESS2) && [:DARKNESS1, :DARKNESS3].include?(@field.effect))) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:680 | (i.effects[:Endure] \|\| i.ability == :STURDY) && @field.effect == :CORROSIVEMIST | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Inspect.rb:10 | self.ability == :CORROSION && [:CORROSIVE, :CORROSIVEMIST, :CORRUPTED].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Inspect.rb:35 | self.ability == :TOXICBOOST && (self.status == :POISON \|\| @battle.FE == :CORROSIVEMIST \|\| ([:CORROSIVE, :WASTELAND, :MURKWATERSURFACE].include?(@battle.FE) && !self.isAirborne?)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:801 | :CORROSIVEMIST | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:980 | attacker.ability == :MERCILESS && (opponent.status == :POISON \|\| [:CORROSIVEMIST].include?(@battle.FE) \|\| ([:CORROSIVE, :WASTELAND, :MURKWATERSURFACE].include?(@battle.FE) && !attacker.isAirborne?)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1288 | (attacker.status == :POISON \|\| [:CORROSIVEMIST].include?(@battle.FE) \|\| ([:CORROSIVE, :WASTELAND, :MURKWATERSURFACE].include?(@battle.FE) && !attacker.isAirborne?)) && pbIsPhysical?(attacker, type) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1617 | [:CORROSIVE, :CORROSIVEMIST, :CORRUPTED].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1069 | @move == :ACIDARMOR && ([:CORROSIVE, :CORROSIVEMIST, :MURKWATERSURFACE, :FAIRYTALE].include?(@battle.FE) \|\| @battle.ProgressiveFieldCheck(PBFields::CONCERT)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1501 | [:BURNING, :CORROSIVEMIST, :VOLCANIC, :VOLCANICTOP, :BACKALLEY, :CITY].include?(@battle.FE) && @move == :SMOKESCREEN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2758 | [:CORROSIVE, :CORROSIVEMIST, :WASTELAND, :MURKWATERSURFACE].include?(@battle.FE) \|\|<br>                         (opponent.status == :POISON && !blockedBySubstitute?(attacker, opponent) && opponent.crested != :SUICUNE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:5442 | @move == :MISTYEXPLOSION && ([:MISTY, :CORROSIVEMIST].include?(@battle.FE) \|\| @battle.OV == :MISTY) && !attacker.isAirborne? | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7313 | opponent.status != :POISON && ![:CORROSIVE, :CORROSIVEMIST, :WASTELAND, :MURKWATERSURFACE].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7897 | [:CORROSIVE, :CORROSIVEMIST].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8677 | [:CORROSIVEMIST, :MURKWATERSURFACE].include?(@battle.FE) | implemented_and_tested | Life Dew extra poison or user Aqua Ring runs only on targets that passed the source canHeal gate. Full HP, Heal Block and unprotected Petrification do not gain a field reaction. Tests: Life Dew field reactions require the source per-target canHeal gate |
| Battle_MoveEffects.rb:9013 | [:BACKALLEY, :CITY, :CORROSIVEMIST].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:9159 | [:CORROSIVE, :CORROSIVEMIST, :WASTELAND, :MURKWATERSURFACE].include?(@battle.FE) \|\|<br>       ((!opponent.status.nil? \|\| opponent.isSleeping?) && !blockedBySubstitute?(attacker, opponent)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Scene.rb:6139 | move.move == :MISTYEXPLOSION && [:MISTY, :CORROSIVEMIST].include?(battle.FE) && attacker.isAirborne? | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2232 | [:MISTY, :CORROSIVEMIST].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2850 | self.ability == :MISTYSURGE && @battle.FE != :MISTY && @battle.OV != :MISTY && (!Overlays \|\| @battle.FE != :CORROSIVEMIST) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:3609 | @battle.FE == :CORROSIVEMIST | implemented_and_tested | Corrosive Mist Aftermath uses one-half attacker maximum HP instead of one-quarter, with contact, fainting, Damp and Magic Guard guards. Tests: Corrosive Mist Aftermath loses half the attacker maximum HP |
| Battler.rb:4197 | :CORROSIVEMIST, :MURKWATERSURFACE, :CORRUPTED | requires_behavioral_comparison | Semantic comparison pending Tests:  |

AI source leads: 18. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":[],"abilities":["gravitycontrol"],"items":[]}`.
