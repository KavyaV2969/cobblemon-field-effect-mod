# Blessed Field

Original ID: `HOLY`; datapack ID: `rejuvenation:holy`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "The field is blessed!"

Nature Power: `judgment`. Secret Power animation/reference move: `dazzlinggleam`.

Secret Power actual secondary choices: `[{"boosts":{"spa":-1}}]`.

Mimicry type: `Normal`; Burmy cloak reference: `TRASHCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"magicalseed","effect":"magiccoat","duration":true,"message":"{1} shrouded itself with Magic Coat!","stats":{"spa":1}}`. Seed actions: `null`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `null` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The terrain returned to normal."`.

Shared stat pools: `null`. Absorber policies: `null`. Indirect immunity: `null`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"justified":{"onDamagingHit":{"mode":"replace","condition":{"attackType":"Dark"},"actions":[{"op":"boost","stats":{"atk":2}}],"source":"Battler.rb:3824"}},"cursedbody":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[],"source":"Battler.rb:3747"}},"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":5,"extendedBy":3,"blockEverstone":false}],"source":"Battler.rb:3926"}}}`. Inactive abilities: `null`. Status type bypass: `null`.

Field form typing: `["arceus","silvally"]`. Custom volatile rules: `null`. Rampage policy: `null`.

Progression: `null`. Party roles: `null`.

Field clock policy: `null`.

Fields persist for the battle unless transformed/destroyed. Move/ability terrain creation uses its own finite duration; engine stack restoration and overlay clocks are described in ARCHITECTURE.md.

## Core move rules

| Move ID | Executable properties and exact source text |
|---|---|
| `psystrike` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `aeroblast` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `originpulse` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `doomdesire` | {"multiplier":1.3} |
| `doomdummy` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `mistball` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `crushgrip` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `lusterpurge` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `secretsword` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `psychoboost` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `relicsong` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `spacialrend` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `hyperspacehole` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `roaroftime` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `landswrath` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `precipiceblades` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `oblivionwing` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `dragonascent` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `moongeistbeam` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `sunsteelstrike` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `prismaticlaser` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `fleurcannon` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `diamondstorm` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `genesissupernova` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `searingsunrazesmash` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `menacingmoonrazemaelstrom` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `vcreate` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `doubleironbash` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `behemothblade` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `behemothbash` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `thundercage` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `dragonenergy` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `freezingglare` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `thunderouskick` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `glaciallance` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `astralbarrage` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `springtidestorm` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `wildboltstorm` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `bleakwindstorm` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `sandsearstorm` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `collisioncourse` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `electrodrift` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `ivycudgel` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `terastarstorm` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `multipulse` | {"multiplier":1.3,"message":"Legendary power accelerated the attack!"} |
| `mysticalfire` | {"multiplier":1.5,"message":"The holy energy resonated with the attack!"} |
| `magicalleaf` | {"multiplier":1.5,"message":"The holy energy resonated with the attack!"} |
| `ancientpower` | {"multiplier":1.5,"message":"The holy energy resonated with the attack!"} |
| `judgment` | {"multiplier":1.5,"message":"Legendary power accelerated the attack!"} |
| `sacredfire` | {"multiplier":1.5,"message":"Legendary power accelerated the attack!"} |
| `extremespeed` | {"multiplier":1.5,"message":"Godspeed!"} |
| `sacredsword` | {"multiplier":1.5,"message":"The holy energy resonated with the attack!"} |
| `return` | {"multiplier":1.5,"message":"The holy energy resonated with the attack!"} |
| `mysticalpower` | {"multiplier":1.5,"message":"The holy energy resonated with the attack!"} |
| `eeriespell` | {"multiplier":0.5,"message":"The attack was cleansed..."} |
| `bitterblade` | {"multiplier":0.5,"message":"The attack was cleansed..."} |
| `lightthatburnsthesky` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The holy light was consumed!"}} |
| `curse` | {"transition":{"field":"rejuvenation:haunted","condition":{"always":true},"push":true,"message":"Evil spirits gathered!"}} |
| `phantomforce` | {"transition":{"field":"rejuvenation:haunted","condition":{"always":true},"push":true,"message":"Evil spirits gathered!"}} |
| `spectralscream` | {"transition":{"field":"rejuvenation:haunted","condition":{"always":true},"push":true,"message":"Evil spirits gathered!"}} |
| `shadowforce` | {"transition":{"field":"rejuvenation:haunted","condition":{"always":true},"push":true,"message":"Evil spirits gathered!"}} |
| `ominouswind` | {"transition":{"field":"rejuvenation:haunted","condition":{"always":true},"push":true,"message":"Evil spirits gathered!"}} |
| `trickortreat` | {"transition":{"field":"rejuvenation:haunted","condition":{"always":true},"push":true,"message":"Evil spirits gathered!"}} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Fairy"} | {"condition":{"category":"Special"},"multiplier":1.5,"message":"The holy energy resonated with the attack!"} |
| {"moveType":"Normal"} | {"condition":{"category":"Special"},"multiplier":1.5,"message":"The holy energy resonated with the attack!"} |
| {"moveType":"Psychic"} | {"condition":{"always":true},"multiplier":1.2,"message":"The legendary energy resonated with the attack!"} |
| {"moveType":"Dragon"} | {"condition":{"always":true},"multiplier":1.2,"message":"The legendary energy resonated with the attack!"} |
| {"moveType":"Ghost"} | {"condition":{"always":true},"multiplier":0.5,"message":"The attack was cleansed..."} |
| {"moveType":"Dark"} | {"condition":{"category":"Special"},"multiplier":0.5,"message":"The attack was cleansed..."} |

## Type-chart exceptions

| Attacking type | Defending type | Result exponent / immunity | Condition |
|---|---|---|---|
| "Normal" | "Dark" | 1 | {"always":true} |
| "Normal" | "Ghost" | 1 | {"always":true} |
| "*" | "Ghost" | 1 | {"move":"spiritbreak"} |

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "damage" | {"ability":{"who":"user","values":["purifyingsalt"]}} | [{"op":"multiply","value":1.5}] | "Battle_Move.rb:1611" |
| "modifyMove" | {"move":"takeheart"} | [{"op":"moveBehavior","recipe":"cureAndBoost","stats":{"spa":2,"spd":2}}] | "Battle_MoveEffects.rb:9231" |
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
| "chargeMove" | {"all":[{"move":"razorwind"},{"overlay":"rejuvenation:grassy_terrain"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4430" |
| "chargeMove" | {"all":[{"any":[{"move":"solarbeam"},{"move":"solarblade"}]},{"overlay":"rejuvenation:rainbow"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4472" |
| "modifyMove" | {"move":"miracleeye"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"boost","stats":{"spa":2}}]}] | "Battle_MoveEffects.rb:3682" |
| "modifyMove" | {"all":[{"move":"mist"},{"not":{"sideCondition":"mist"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"createField","field":"rejuvenation:misty_terrain","duration":3,"extendedBy":3,"message":"Mist swirled around the battlefield!"}]}] | "Battle_MoveEffects.rb:1817" |
| "modifyMove" | {"move":"cosmicpower"} | [{"op":"moveProperty","path":"boosts","value":{"def":2,"spd":2}}] | "Battle_MoveEffects.rb:993" |
| "afterMove" | {"move":"wish"} | [{"op":"adjustWish","fraction":0.75}] | "Battle_MoveEffects.rb:5214" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "modifyMove" | {"move":"lifedew"} | [{"op":"moveBehavior","recipe":"targetHealing","fraction":0.5,"userFraction":0.5,"actions":[]}] | "Battle_MoveEffects.rb:8674" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"form","species":"silvallydark","type":"Dark","message":"A false god holds no power here..."}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"form","species":"silvallydark","type":"Dark","message":"A false god holds no power here..."}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |

## Original status-move highlights

Source UI buff highlights: `["lifedew","wish","miracleeye","cosmicpower","naturesmadness","junglehealing","lunarblessing","takeheart"]`.

Source UI nerf highlights: `[]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["cosmicpower","lifedew","miracleeye","takeheart"],"unreviewedHighlightedMoves":["junglehealing","lunarblessing","naturesmadness","wish"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Battle.rb:2054 | @battle.FE == :HOLY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6589 | @field.effect == :HOLY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6607 | [:HOLY, :DEUXFINALIS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6607 | [:HOLY, :DEUXFINALIS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Inspect.rb:11 | [:HAUNTED, :BEWITCHED, :HOLY, :PSYTERRAIN, :DEEPEARTH].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:450 | @battle.FE == :HOLY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1472 | @battle.FE == :HOLY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1581 | [:HAUNTED, :BEWITCHED, :HOLY, :PSYTERRAIN, :DEEPEARTH, :DEUXFINALIS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1619 | @battle.FE == :HOLY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1687 | @battle.FE == :HOLY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:993 | [:MISTY, :RAINBOW, :HOLY, :STARLIGHT, :NEWWORLD, :PSYTERRAIN].include?(@battle.FE) && @move == :COSMICPOWER | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2434 | @move == :NATURESMADNESS && @battle.FE == :HOLY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:3682 | [:HOLY, :FAIRYTALE, :PSYTERRAIN].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:5214 | [:MISTY, :RAINBOW, :HOLY, :FAIRYTALE, :STARLIGHT].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8674 | @battle.FE == :HOLY \|\| (@battle.FE == :RAINBOW && opponent == attacker) | implemented_and_tested | Holy Life Dew heals both allies by rounded half maximum HP; Rainbow doubles only the user. Native per-target canHeal eligibility precedes effect execution. Tests: Holy Life Dew doubles healing for both actual allied targets, Rainbow Life Dew doubles the user healing only |
| Battle_MoveEffects.rb:9064 | (@move == :LUNARBLESSING && [:STARLIGHT, :NEWWORLD, :HOLY].include?(@battle.FE)) \|\| (@move == :JUNGLEHEALING && [:FOREST, :HOLY, :NEWWORLD].include?(@battle.FE)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:9231 | [:WATERSURFACE, :UNDERWATER, :HOLY, :NEWWORLD].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:1854 | self.species == :SILVALLY && [:GLITCH, :HOLY].include?(@battle.FE) | implemented_and_tested | Holy forces ordinary Dark Silvally form 17, not Fairy. Glitch forces unknown typing and source corruption text. The custom unknown-type model/animation is absent; ordinary type semantics execute and item restoration resumes elsewhere. Tests: Holy Silvally uses its native Dark form and Glitch retains unknown typing until restored |
| Battler.rb:1856 | @battle.FE == :HOLY | implemented_and_tested | Holy forces ordinary Dark Silvally form 17, not Fairy. Glitch forces unknown typing and source corruption text. The custom unknown-type model/animation is absent; ordinary type semantics execute and item restoration resumes elsewhere. Tests: Holy Silvally uses its native Dark form and Glitch retains unknown typing until restored |
| Battler.rb:1860 | @battle.FE == :HOLY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:1864 | @battle.FE == :HOLY | implemented_and_tested | Holy forces ordinary Dark Silvally form 17, not Fairy. Glitch forces unknown typing and source corruption text. The custom unknown-type model/animation is absent; ordinary type semantics execute and item restoration resumes elsewhere. Tests: Holy Silvally uses its native Dark form and Glitch retains unknown typing until restored |
| Battler.rb:3682 | target.ability == :PERISHBODY && user.effects[:PerishSong] == 0 && target.effects[:PerishSong] == 0 && @battle.FE != :HOLY | implemented_and_tested | Perish Body requires both source counters to be absent; Holy suppresses it, Infernal sets one-turn counters, Dimensional/Haunted/Infernal trap the defender, and Deux Finalis unconditionally replaces the attacker status with Petrification. Tests: Perish Body source counters, suppression, trapping and forced status replacement |
| Battler.rb:3747 | (target.ability == :CURSEDBODY && @battle.FE != :HOLY && (@battle.pbRandom(10) < 3 \|\| (target.isFainted? && @battle.FE == :HAUNTED))) \|\| target.crested == :BEHEEYEM | implemented_and_tested | Holy disables ordinary Cursed Body. Haunted rolls ordinary 30 percent or guarantees activation when the holder faints, then checks known usable move, attacker survival and existing Disable. Tests: Haunted Cursed Body rejects called or exhausted moves and fainted attackers |
| Battler.rb:3824 | @battle.FE == :HOLY | implemented_and_tested | Holy Justified grants Attack +2 instead of +1 on a Dark hit; the native boost is replaced. Tests: Justified and Water Compaction replace native boosts without stacking |
| Battler.rb:5372 | @battle.FE == :HOLY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7276 | @battle.FE == :HOLY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7311 | @battle.FE == :HOLY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7331 | @battle.FE == :HOLY | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7386 | @battle.FE == :HOLY | requires_behavioral_comparison | Semantic comparison pending Tests:  |

AI source leads: 24. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":["spectralscream","doomdummy","multipulse"],"abilities":["gravitycontrol"],"items":[]}`.
