# Flower Garden

Original ID: `FLOWERGARDEN4`; datapack ID: `rejuvenation:flower_garden_4`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "Seeds line the field."

Nature Power: `growth`. Secret Power animation/reference move: `petalblizzard`.

Secret Power actual secondary choices: `[{"boosts":{"def":1,"spd":1,"evasion":1}}]`.

Mimicry type: `Grass`; Burmy cloak reference: `PLANTCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"syntheticseed","effect":"ingrain","duration":true,"message":"{1} planted its roots!","stats":{"spd":1}}`. Seed actions: `null`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{"ingrain":4},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{"infestation":2},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `null` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The terrain returned to normal."`.

Shared stat pools: `null`. Absorber policies: `null`. Indirect immunity: `null`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"cottondown":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"forEach","group":"others","actions":[{"op":"boost","who":"target","stats":{"spe":-2}}]}],"source":"Battler.rb:3875"}},"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"progress","amount":1,"message":"{1} grew the garden!"}],"source":"Battler.rb:3926"}}}`. Inactive abilities: `null`. Status type bypass: `null`.

Field form typing: `["arceus","silvally"]`. Custom volatile rules: `null`. Rampage policy: `null`.

Progression: `{"group":"flower_garden","stage":4,"maximum":5}`. Party roles: `null`.

Field clock policy: `null`.

Fields persist for the battle unless transformed/destroyed. Move/ability terrain creation uses its own finite duration; engine stack restoration and overlay clocks are described in ARCHITECTURE.md.

## Core move rules

| Move ID | Executable properties and exact source text |
|---|---|
| `cut` | {"multiplier":1.5,"message":"{1} was cut down to size!","transition":{"field":"rejuvenation:flower_garden_3","condition":{"always":true},"push":false,"message":"The garden was cut down a bit!"}} |
| `petalblizzard` | {"multiplier":1.5,"message":"The vibrant scent of flowers boosted the attack!"} |
| `petaldance` | {"multiplier":1.5,"message":"The vibrant scent of flowers boosted the attack!"} |
| `fleurcannon` | {"multiplier":1.5,"message":"The vibrant scent of flowers boosted the attack!"} |
| `springtidestorm` | {"multiplier":1.5,"message":"The vibrant scent of flowers boosted the attack!"} |
| `flowertrick` | {"multiplier":1.5,"message":"The vibrant scent of flowers boosted the attack!"} |
| `sleeppowder` | {"accuracy":85} |
| `stunspore` | {"accuracy":85} |
| `poisonpowder` | {"accuracy":85} |
| `growth` | {"transition":{"field":"rejuvenation:flower_garden_5","condition":{"always":true},"push":false,"message":"The garden grew a little!"}} |
| `flowershield` | {"transition":{"field":"rejuvenation:flower_garden_5","condition":{"always":true},"push":false,"message":"The garden grew a little!"}} |
| `raindance` | {"transition":{"field":"rejuvenation:flower_garden_5","condition":{"always":true},"push":false,"message":"The garden grew a little!"}} |
| `sunnyday` | {"transition":{"field":"rejuvenation:flower_garden_5","condition":{"always":true},"push":false,"message":"The garden grew a little!"}} |
| `rototiller` | {"transition":{"field":"rejuvenation:flower_garden_5","condition":{"always":true},"push":false,"message":"The garden grew a little!"}} |
| `ingrain` | {"transition":{"field":"rejuvenation:flower_garden_5","condition":{"always":true},"push":false,"message":"The garden grew a little!"}} |
| `grassyterrain` | {"transition":{"field":"rejuvenation:flower_garden_5","condition":{"always":true},"push":false,"message":"The garden grew a little!"}} |
| `watersport` | {"transition":{"field":"rejuvenation:flower_garden_5","condition":{"always":true},"push":false,"message":"The garden grew a little!"}} |
| `bloomdoom` | {"transition":{"field":"rejuvenation:flower_garden_5","condition":{"always":true},"push":false,"message":"The garden grew a little!"}} |
| `xscissor` | {"transition":{"field":"rejuvenation:flower_garden_3","condition":{"always":true},"push":false,"message":"The garden was cut down a bit!"}} |
| `breakingswipe` | {"transition":{"field":"rejuvenation:flower_garden_3","condition":{"always":true},"push":false,"message":"The garden was cut down a bit!"}} |
| `aciddownpour` | {"transition":{"field":"rejuvenation:flower_garden_1","condition":{"always":true},"push":false,"message":"The acid melted the bloom!"}} |
| `heatwave` | {"transition":{"field":"rejuvenation:flower_garden_2","condition":{"always":true},"push":false,"message":"The garden caught fire!"}} |
| `eruption` | {"transition":{"field":"rejuvenation:flower_garden_2","condition":{"always":true},"push":false,"message":"The garden caught fire!"}} |
| `searingshot` | {"transition":{"field":"rejuvenation:flower_garden_2","condition":{"always":true},"push":false,"message":"The garden caught fire!"}} |
| `flameburst` | {"transition":{"field":"rejuvenation:flower_garden_2","condition":{"always":true},"push":false,"message":"The garden caught fire!"}} |
| `lavaplume` | {"transition":{"field":"rejuvenation:flower_garden_2","condition":{"always":true},"push":false,"message":"The garden caught fire!"}} |
| `firepledge` | {"transition":{"field":"rejuvenation:flower_garden_2","condition":{"always":true},"push":false,"message":"The garden caught fire!"}} |
| `mindblown` | {"transition":{"field":"rejuvenation:flower_garden_2","condition":{"always":true},"push":false,"message":"The garden caught fire!"}} |
| `infernooverdrive` | {"transition":{"field":"rejuvenation:flower_garden_2","condition":{"always":true},"push":false,"message":"The garden caught fire!"}} |
| `burningjealousy` | {"transition":{"field":"rejuvenation:flower_garden_2","condition":{"always":true},"push":false,"message":"The garden caught fire!"}} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Bug"} | {"condition":{"always":true},"multiplier":2.0,"message":"The attack infested the flowers!"} |
| {"moveType":"Fire"} | {"condition":{"always":true},"multiplier":1.5,"message":"The nearby flowers caught flame!"} |
| {"moveType":"Grass"} | {"condition":{"always":true},"multiplier":1.5,"message":"The blooming flowers boosted the attack!"} |

## Type-chart exceptions

| Attacking type | Defending type | Result exponent / immunity | Condition |
|---|---|---|---|
| "*" | "Grass" | 1 | {"move":"cut"} |

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "switchIn" | {"ability":{"who":"user","values":["flowergift","flowerveil","drought","drizzle","orichalcumpulse","grassysurge"]}} | [{"op":"progress","amount":1,"message":"{1} grew the garden!"}] | "Battler.rb:2189" |
| "speed" | {"all":[{"ability":{"who":"user","values":["chlorophyll"]}},{"not":{"all":[{"weather":["sunnyday","desolateland"]},{"not":{"item":{"who":"user","values":["utilityumbrella"]}}}]}},{"always":true}]} | [{"op":"multiply","value":2}] | "Battle_Effects.rb:1411-1440" |
| "setStatus" | {"ability":{"who":"target","values":["leafguard"]}} | [{"op":"reject"}] | "Battle_Effects.rb:1383" |
| "overlayIn" | {"all":[{"overlay":"rejuvenation:psychic_terrain"},{"ability":{"who":"user","values":["anticipation","forewarn"]}}]} | [{"op":"boost","stats":{"spa":1}}] | "Battler.rb:2644-2652" |
| "overlayIn" | {"all":[{"overlay":"rejuvenation:misty_terrain"},{"ability":{"who":"user","values":["watercompaction"]}}]} | [{"op":"boost","stats":{"def":2}}] | "Battler.rb:2654-2662" |
| "modifyMove" | {"move":"floralhealing"} | [{"op":"moveProperty","path":"heal","value":[1,1],"removeCallback":"onHit"}] | "Battle_MoveEffects.rb:7884" |
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
| "modifyMove" | {"move":"growth"} | [{"op":"moveProperty","path":"boosts","value":{"atk":3,"spa":3},"removeCallback":"onHit"}] | "Battle_MoveEffects.rb:965" |
| "modifyMove" | {"move":"sweetscent"} | [{"op":"moveProperty","path":"boosts","value":{"def":-1,"spd":-1,"evasion":-1}}] | "Battle_MoveEffects.rb:1546" |
| "modifyMove" | {"move":"rototiller"} | [{"op":"moveBehavior","recipe":"allActiveHitActions","condition":{"any":[{"all":[{"type":{"who":"target","value":"Grass"}},{"grounded":{"who":"target","value":true}}]},{"samePokemon":true}]},"actions":[{"op":"boost","who":"target","stats":{"atk":2,"spa":2}}]}] | "Battle_MoveEffects.rb:7585-7593" |
| "modifyMove" | {"move":"flowershield"} | [{"op":"moveBehavior","recipe":"allActiveHitActions","condition":{"any":[{"type":{"who":"target","value":"Grass"}},{"samePokemon":true}]},"actions":[{"op":"conditional","condition":{"always":true},"actions":[{"op":"boost","who":"target","stats":{"def":2,"spd":2}}]}]}] | "Battle_MoveEffects.rb:7560" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |

## Original status-move highlights

Source UI buff highlights: `["growth","rototiller","raindance","watersport","sunnyday","flowershield","sweetscent","ingrain","floralhealing"]`.

Source UI nerf highlights: `[]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["floralhealing","growth","sweetscent"],"unreviewedHighlightedMoves":["flowershield","ingrain","raindance","rototiller","sunnyday","watersport"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Battle.rb:6663 | :FLOWERGARDEN4 | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:7165 | [:GRASSY, :FOREST, :FLOWERGARDEN1, :FLOWERGARDEN2, :FLOWERGARDEN3, :FLOWERGARDEN4, :FLOWERGARDEN5].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:7246 | pbIsBerry?(i.permeffs[:ItemRecycle]) && (pbRandom(100) > 50 \|\| (pbWeather(nil) == :SUNNYDAY && !i.hasWorkingItem(:UTILITYUMBRELLA)) \|\|<br>           @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 2, 5) \|\| (Rejuv && @battle.FE == :GRASSY)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:1195 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 4, 5) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:1197 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 2, 3) \|\| @battle.FE == :FOREST \|\| (Rejuv && (@battle.FE == :GRASSY \|\| @battle.OV == :GRASSY)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:1389 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 2, 5) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:1398 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:1416 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 4, 5) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:643 | ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 1, 3) && user.ability == :RIPEN &&<br>       PBFields::FLOWERGARDEN.include?(newfield) && PBFields::FLOWERGARDEN.index(@field.effect) < PBFields::FLOWERGARDEN.index(newfield) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:826 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 1, 4) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:847 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 2, 5) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Inspect.rb:54 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 3, 5) && self.ability == :FLOWERVEIL \|\| (self.pbPartner.ability == :FLOWERVEIL && self.hasType?(:GRASS)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:483 | (!Rejuv && @battle.FE == :FOREST) \|\| @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 2, 5) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:520 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 4, 5) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1548 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN) && attacker.ability == :SWARM && type == :BUG | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1549 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 1, 2) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1550 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 3, 4) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1552 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 2, 5) && attacker.ability == :OVERGROW && type == :GRASS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1556 | :FLOWERGARDEN4 | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1823 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 3, 5) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:964 | [:GRASSY, :FOREST].include?(@battle.FE) \|\| @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 1, 2) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:965 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 3, 5) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1539 | @battle.FE == :MISTY \|\| @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 3, 5) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1546 | @battle.FE == :MISTY \|\| @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 3, 5) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1550 | :FLOWERGARDEN4 | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:3581 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 3, 5) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7560 | opponent.hasType?(:GRASS) \|\| (opponent == attacker && (@battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 2, 5) \|\| @battle.FE == :FAIRYTALE)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7561 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 2, 5) \|\| (opponent == attacker && @battle.FE == :FAIRYTALE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7572 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 2, 5) \|\| (opponent == attacker && @battle.FE == :FAIRYTALE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7573 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 3, 5) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7585 | (opponent.hasType?(:GRASS) && !opponent.isAirborne?) \|\| (opponent == attacker && @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7593 | @battle.FE == :DEEPEARTH \|\| @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7890 | [:GRASSY, :FAIRYTALE].include?(@battle.FE) \|\|<br>       @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 3, 5) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_ZMove.rb:269 | @battle.canChangeFE?([:GRASSY, :FOREST, *PBFields::FLOWERGARDEN]) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2191 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 1, 4) && flowergardenabils.include?(ability) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:3878 | [:BEWITCHED, :GRASSY, :FLOWERGARDEN2, :FLOWERGARDEN3, :FLOWERGARDEN4, :FLOWERGARDEN5].include?(@battle.FE) | implemented_and_tested | Cotton Down reduces Speed by two on the listed plant fields for every other active battler, including partners; ordinary stat protections remain native. Tests: Cotton Down doubles its speed loss for all other active Pokemon on plant fields |
| Battler.rb:3926 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 1, 4) | implemented_and_tested | Seed Sower grows Garden stages 1-4; other permitted fields create Grassy terrain with source duration/Amplifield and Forest/Bewitched extensions. Ability creation ignores the move-only Everstone restriction. Tests: Seed Sower grows each garden stage and creates longer forest terrain without Everstone blocking |
| Battler.rb:4296 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 1, 4) | requires_behavioral_comparison | Semantic comparison pending Tests:  |

AI source leads: 34. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":[],"abilities":["gravitycontrol"],"items":[]}`.
