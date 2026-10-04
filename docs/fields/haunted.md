# Haunted Field

Original ID: `HAUNTED`; datapack ID: `rejuvenation:haunted`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "The field is haunted!"

Nature Power: `phantomforce`. Secret Power animation/reference move: `shadowclaw`.

Secret Power actual secondary choices: `[{"volatileStatus":"curse"}]`.

Mimicry type: `Ghost`; Burmy cloak reference: `TRASHCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"magicalseed","effect":null,"duration":null,"message":null,"stats":{"def":1,"spd":1}}`. Seed actions: `[{"op":"status","status":"brn"}]`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{"firespin":1},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.3333333333333333,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `null` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The terrain returned to normal."`.

Shared stat pools: `null`. Absorber policies: `null`. Indirect immunity: `null`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"cursedbody":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"conditional","condition":{"all":[{"any":[{"chance":{"numerator":3,"denominator":10}},{"hp":{"who":"user","op":"<=","fraction":0}}]},{"not":{"volatile":{"who":"target","id":"disable"}}},{"usableMove":{"who":"target"}},{"hp":{"who":"target","op":">","fraction":0}}]},"actions":[{"op":"volatile","id":"disable","who":"target"}]}],"source":"Battler.rb:3747"}},"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":5,"extendedBy":3,"blockEverstone":false}],"source":"Battler.rb:3926"}}}`. Inactive abilities: `null`. Status type bypass: `null`.

Field form typing: `["arceus","silvally"]`. Custom volatile rules: `null`. Rampage policy: `null`.

Progression: `null`. Party roles: `null`.

Field clock policy: `null`.

Fields persist for the battle unless transformed/destroyed. Move/ability terrain creation uses its own finite duration; engine stack restoration and overlay clocks are described in ARCHITECTURE.md.

## Core move rules

| Move ID | Executable properties and exact source text |
|---|---|
| `flameburst` | {"multiplier":1.5,"additionalType":"GHOST","message":"Will-o'-wisps joined the attack!"} |
| `inferno` | {"multiplier":1.5,"additionalType":"GHOST","message":"Will-o'-wisps joined the attack!"} |
| `flamecharge` | {"multiplier":1.5,"additionalType":"GHOST","message":"Will-o'-wisps joined the attack!"} |
| `firespin` | {"multiplier":1.5,"additionalType":"GHOST","message":"Will-o'-wisps joined the attack!"} |
| `burningjealousy` | {"multiplier":1.5,"message":"Will-o'-wisps joined the attack!"} |
| `torchsong` | {"multiplier":1.5,"message":"A dirge for the dead..."} |
| `bitterblade` | {"multiplier":1.5,"message":"Will-o'-wisps joined the attack!"} |
| `boneclub` | {"multiplier":1.5,"message":"Spooky scary skeletons!"} |
| `bonerush` | {"multiplier":1.5,"message":"Spooky scary skeletons!"} |
| `bonemerang` | {"multiplier":1.5,"message":"Spooky scary skeletons!"} |
| `astonish` | {"multiplier":1.5,"message":"Boo!"} |
| `shadowbone` | {"multiplier":1.2,"message":"Spooky scary skeletons!"} |
| `willowisp` | {"accuracy":90} |
| `hypnosis` | {"accuracy":90} |
| `judgment` | {"transition":{"field":"rejuvenation:holy","condition":{"always":true},"push":false,"message":"The evil spirits have been exorcised!"}} |
| `originpulse` | {"transition":{"field":"rejuvenation:holy","condition":{"always":true},"push":false,"message":"The evil spirits have been exorcised!"}} |
| `sacredfire` | {"transition":{"field":"rejuvenation:holy","condition":{"always":true},"push":false,"message":"The evil spirits have been exorcised!"}} |
| `purify` | {"transition":{"field":"rejuvenation:holy","condition":{"always":true},"push":false,"message":"The evil spirits have been exorcised!"}} |
| `flash` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":true,"message":"The evil spirits have been forced back!"}} |
| `dazzlinggleam` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":true,"message":"The evil spirits have been forced back!"}} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Ghost"} | {"condition":{"always":true},"multiplier":1.5,"message":"The evil aura powered up the attack!"} |

## Type-chart exceptions

| Attacking type | Defending type | Result exponent / immunity | Condition |
|---|---|---|---|
| "*" | "Ghost" | 1 | {"move":"spiritbreak"} |
| "Ghost" | "Normal" | 0 | {"always":true} |

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "switchIn" | {"ability":{"who":"user","values":["rattled"]}} | [{"op":"boost","stats":{"spe":1}}] | "Battler.rb:2068" |
| "modifyMove" | {"move":"ominouswind"} | [{"op":"secondaryChance","chance":20}] | "Battle_Move.rb:2330" |
| "modifyMove" | {"move":"lick"} | [{"op":"secondaryChance","chance":100}] | "Battle_Move.rb:2336" |
| "residual" | {"ability":{"who":"user","values":["souleater"]}} | [{"op":"heal","fraction":0.0625,"message":"{1} devoured spirits to recover!"}] | "Battle.rb:5850-6109" |
| "residual" | {"ability":{"who":"user","values":["wanderingspirit"]}} | [{"op":"boost","stats":{"spe":-1}}] | "Battle.rb:6203" |
| "modifyMove" | {"move":"infernalparade"} | [{"op":"moveProperty","path":"basePower","value":120,"removeCallback":"basePowerCallback"}] | "Battle_MoveEffects.rb:9201" |
| "modifyMove" | {"move":"magicpowder"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"status","who":"target","status":"slp","message":"{1} was put to sleep!"}]}] | "Battle_MoveEffects.rb:8470" |
| "overlayIn" | {"all":[{"overlay":"rejuvenation:psychic_terrain"},{"ability":{"who":"user","values":["anticipation","forewarn"]}}]} | [{"op":"boost","stats":{"spa":1}}] | "Battler.rb:2644-2652" |
| "overlayIn" | {"all":[{"overlay":"rejuvenation:misty_terrain"},{"ability":{"who":"user","values":["watercompaction"]}}]} | [{"op":"boost","stats":{"def":2}}] | "Battler.rb:2654-2662" |
| "modifyMove" | {"move":"nightshade"} | [{"op":"moveBehavior","recipe":"fixedDamage","basis":"level","factor":1.5,"message":null}] | "Battle_MoveEffects.rb:2461" |
| "modifyMove" | {"move":"firespin"} | [{"op":"moveProperty","path":"target","value":"allAdjacentFoes"}] | "Battle_MoveEffects.rb:4985" |
| "modifyMove" | {"move":"meanlook"} | [{"op":"moveProperty","path":"target","value":"allAdjacentFoes"}] | "Battle_MoveEffects.rb:4985" |
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
| "modifyMove" | {"move":"destinybond"} | [{"op":"moveBehavior","recipe":"refreshVolatileBeforeHit","id":"destinybond"}] | "Battle_MoveEffects.rb:5563" |
| "modifyMove" | {"move":"curse"} | [{"op":"moveBehavior","recipe":"payHP","fraction":0.25,"who":"user"}] | "Battle_MoveEffects.rb:6519" |
| "modifyMove" | {"move":"spite"} | [{"op":"moveBehavior","recipe":"deductPP","amount":6}] | "Battle_MoveEffects.rb:6551" |
| "modifyMove" | {"all":[{"move":"mist"},{"not":{"sideCondition":"mist"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"createField","field":"rejuvenation:misty_terrain","duration":3,"extendedBy":3,"message":"Mist swirled around the battlefield!"}]}] | "Battle_MoveEffects.rb:1817" |
| "modifyMove" | {"move":"scaryface"} | [{"op":"moveProperty","path":"boosts","value":{"spe":-3}}] | "Battle_MoveEffects.rb:1646" |
| "modifyMove" | {"move":"bittermalice"} | [{"op":"moveProperty","path":"secondaries.0.boosts","value":{"atk":-1,"spa":-1}}] | "Battle_MoveEffects.rb:1372" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |

## Original status-move highlights

Source UI buff highlights: `["nightmare","spite","curse","destinybond","meanlook","scaryface","magicpowder","hypnosis","willowisp"]`.

Source UI nerf highlights: `[]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["curse","destinybond","magicpowder","meanlook","scaryface","spite"],"unreviewedHighlightedMoves":["hypnosis","nightmare","willowisp"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Battle.rb:6096 | [:HAUNTED, :DIMENSIONAL, :DEUXFINALIS, :INFERNAL].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6170 | [:DESERT, :HAUNTED].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6547 | [:HAUNTED, :DARKNESS3, :ROTTING].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6566 | @field.effect == :HAUNTED && !i.hasType?(:GHOST) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6667 | [:BURNING, :VOLCANIC, :HAUNTED].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Inspect.rb:11 | [:HAUNTED, :BEWITCHED, :HOLY, :PSYTERRAIN, :DEEPEARTH].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:469 | @battle.FE == :HAUNTED | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1581 | [:HAUNTED, :BEWITCHED, :HOLY, :PSYTERRAIN, :DEEPEARTH, :DEUXFINALIS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:2327 | @move == :OMINOUSWIND && @battle.FE == :HAUNTED | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:2333 | @move == :LICK && @battle.FE == :HAUNTED | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1372 | @battle.FE == :HAUNTED && @move == :BITTERMALICE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1646 | @battle.FE == :HAUNTED && @move == :SCARYFACE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2461 | (@move == :NIGHTSHADE && [:HAUNTED, :BEWITCHED].include?(@battle.FE)) \|\| (@move == :SEISMICTOSS && @battle.FE == :DEEPEARTH) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2465 | @move == :NIGHTSHADE && @battle.FE == :HAUNTED | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:4850 | (Rejuv && [:DIMENSIONAL, :FROZENDIMENSION, :HAUNTED, :SHORTCIRCUIT, :DEUXFINALIS].include?(@battle.FE)) \|\| @battle.ProgressiveFieldCheck(PBFields::DARKNESS, 2, 3) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:5563 | attacker.lastRegularMoveUsed == :DESTINYBOND && attacker.effects[:DestinyRate] == true && @battle.FE != :HAUNTED | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6529 | @battle.FE == :HAUNTED | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6557 | @battle.FE == :HAUNTED | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8470 | [:HAUNTED, :BEWITCHED].include?(@battle.FE) && opponent.pbCanSleep?(attacker, self) | implemented_and_tested | After successful Haunted/Bewitched Magic Powder type change, normal sleep eligibility is checked. Native status/persistence output is marked for chat-only suppression; the exact put-to-sleep text follows type and status updates once. Tests: Haunted Magic Powder preserves type then sleep flavor without duplicate status chat |
| Battle_MoveEffects.rb:9201 | [:INFERNAL, :HAUNTED].include?(@battle.FE) \|\|<br>       ((!opponent.status.nil? \|\| opponent.isSleeping?) && !blockedBySubstitute?(attacker, opponent)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:1370 | @battle.FE == :HAUNTED | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2313 | @battle.FE == :HAUNTED | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:3697 | [:DIMENSIONAL, :HAUNTED, :INFERNAL].include?(@battle.FE) | implemented_and_tested | Perish Body requires both source counters to be absent; Holy suppresses it, Infernal sets one-turn counters, Dimensional/Haunted/Infernal trap the defender, and Deux Finalis unconditionally replaces the attacker status with Petrification. Tests: Perish Body source counters, suppression, trapping and forced status replacement |
| Battler.rb:3747 | (target.ability == :CURSEDBODY && @battle.FE != :HOLY && (@battle.pbRandom(10) < 3 \|\| (target.isFainted? && @battle.FE == :HAUNTED))) \|\| target.crested == :BEHEEYEM | implemented_and_tested | Holy disables ordinary Cursed Body. Haunted rolls ordinary 30 percent or guarantees activation when the holder faints, then checks known usable move, attacker survival and existing Disable. Tests: Haunted Cursed Body rejects called or exhausted moves and fainted attackers |
| Battler.rb:4254 | :HAUNTED | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:4985 | @battle.FE == :HAUNTED && (move.move == :MEANLOOK \|\| move.move == :FIRESPIN) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:6044 | [:DEUXFINALIS, :HAUNTED].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |

AI source leads: 18. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":[],"abilities":["gravitycontrol","souleater"],"items":[]}`.
