# Forest Field

Original ID: `FOREST`; datapack ID: `rejuvenation:forest`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "The field is abound with trees."

Nature Power: `woodhammer`. Secret Power animation/reference move: `woodhammer`.

Secret Power actual secondary choices: `[{"status":"slp"}]`.

Mimicry type: `Bug`; Burmy cloak reference: `PLANTCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"telluricseed","effect":"protect","duration":"SpikyShield","message":"The Telluric Seed shielded {1} against damage!","stats":{}}`. Seed actions: `null`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{"strengthsap":1.3,"ingrain":2},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `{"moveDurations":{"rejuvenation:grassy_terrain":8}}`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{"infestation":1},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `null` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The terrain returned to normal."`.

Shared stat pools: `null`. Absorber policies: `null`. Indirect immunity: `null`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"effectspore":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"conditional","condition":{"all":[{"contact":{"who":"target"}},{"not":{"any":[{"type":{"who":"target","value":"Grass"}},{"ability":{"who":"target","values":["overcoat"]}},{"item":{"who":"target","values":["safetygoggles"]}}]}},{"chance":{"numerator":6,"denominator":10}}]},"actions":[{"op":"randomStatus","who":"target","values":["psn","slp","par"]}]}],"source":"Battler.rb:3635"}},"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":8,"extendedBy":0,"blockEverstone":false}],"source":"Battler.rb:3926"}}}`. Inactive abilities: `null`. Status type bypass: `null`.

Field form typing: `["arceus","silvally"]`. Custom volatile rules: `null`. Rampage policy: `null`.

Progression: `null`. Party roles: `null`.

Field clock policy: `null`.

Fields persist for the battle unless transformed/destroyed. Move/ability terrain creation uses its own finite duration; engine stack restoration and overlay clocks are described in ARCHITECTURE.md.

## Core move rules

| Move ID | Executable properties and exact source text |
|---|---|
| `surf` | {"multiplier":0.5,"message":"The forest softened the attack...","counter":{"index":1,"amount":1,"maximum":3,"message":"The ground became waterlogged..."},"transition":{"field":"rejuvenation:swamp","condition":{"counter":{"index":1,"op":">","value":2}},"push":false,"message":"The forest became marshy!"}} |
| `muddywater` | {"multiplier":0.5,"message":"The forest softened the attack...","counter":{"index":1,"amount":2,"maximum":3,"message":"The ground became waterlogged..."},"transition":{"field":"rejuvenation:swamp","condition":{"counter":{"index":1,"op":">","value":2}},"push":false,"message":"The forest became marshy!"}} |
| `gravapple` | {"multiplier":1.5,"message":"The apple did not fall far from the tree!"} |
| `attackorder` | {"multiplier":1.5,"message":"They're coming out of the woodwork!"} |
| `electroweb` | {"multiplier":1.5,"message":"Gossamer and arbor strengthened the attack!"} |
| `slash` | {"multiplier":1.5,"additionalType":"GRASS","message":"A tree slammed down!"} |
| `airslash` | {"multiplier":1.5,"additionalType":"GRASS","message":"A tree slammed down!"} |
| `galestrike` | {"multiplier":1.5,"additionalType":"GRASS","message":"A tree slammed down!"} |
| `furycutter` | {"multiplier":1.5,"additionalType":"GRASS","message":"A tree slammed down!"} |
| `aircutter` | {"multiplier":1.5,"additionalType":"GRASS","message":"A tree slammed down!"} |
| `psychocut` | {"multiplier":1.5,"additionalType":"GRASS","message":"A tree slammed down!"} |
| `breakingswipe` | {"multiplier":1.5,"additionalType":"GRASS","message":"A tree slammed down!"} |
| `branchpoke` | {"multiplier":1.5,"message":"Straight from the tree!"} |
| `cut` | {"multiplier":2.0,"additionalType":"GRASS","message":"A tree slammed down!"} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Bug"} | {"condition":{"category":"Special"},"multiplier":1.5,"message":"The attack spread throughout the forest!"} |
| {"moveType":"Grass"} | {"condition":{"always":true},"multiplier":1.5,"message":"The forestry strengthened the attack!"} |

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "residual" | {"ability":{"who":"user","values":["sapsipper"]}} | [{"op":"heal","fraction":0.0625,"message":"{1} drank tree sap to recover!"}] | "Battle.rb:6025" |
| "setStatus" | {"ability":{"who":"target","values":["leafguard"]}} | [{"op":"reject"}] | "Battle_Effects.rb:1383" |
| "modifyMove" | {"move":"chloroblast"} | [{"op":"moveBehavior","recipe":"payHP","fraction":0.25,"callback":"onAfterMove","round":true,"respectMagicGuard":true}] | "Battle_MoveEffects.rb:9997" |
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
| "modifyMove" | {"all":[{"move":"mist"},{"not":{"sideCondition":"mist"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"createField","field":"rejuvenation:misty_terrain","duration":3,"extendedBy":3,"message":"Mist swirled around the battlefield!"}]}] | "Battle_MoveEffects.rb:1817" |
| "modifyMove" | {"move":"growth"} | [{"op":"moveProperty","path":"boosts","value":{"atk":2,"spa":2},"removeCallback":"onHit"}] | "Battle_MoveEffects.rb:964" |
| "modifyMove" | {"move":"defendorder"} | [{"op":"moveProperty","path":"boosts","value":{"def":2,"spd":2}}] | "Battle_MoveEffects.rb:994" |
| "modifyMove" | {"move":"healorder"} | [{"op":"moveProperty","path":"heal","value":[0.66,1],"removeCallback":"onHit"}] | "Battle_MoveEffects.rb:5167" |
| "modifyMove" | {"move":"forestscurse"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"volatile","id":"curse","who":"target"}]}] | "Battle_MoveEffects.rb:7415" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |

## Original status-move highlights

Source UI buff highlights: `["stickyweb","defendorder","growth","strengthsap","healorder","naturesmadness","forestscurse"]`.

Source UI nerf highlights: `[]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["defendorder","growth","healorder"],"unreviewedHighlightedMoves":["forestscurse","naturesmadness","stickyweb","strengthsap"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Battle.rb:3254 | @field.effect == :FOREST | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6025 | @field.effect == :FOREST | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6662 | :FOREST, :FLOWERGARDEN3 | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:7165 | [:GRASSY, :FOREST, :FLOWERGARDEN1, :FLOWERGARDEN2, :FLOWERGARDEN3, :FLOWERGARDEN4, :FLOWERGARDEN5].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:1190 | (!Rejuv && @battle.FE == :SWAMP) \|\| @battle.FE == :FOREST | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:1197 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 2, 3) \|\| @battle.FE == :FOREST \|\| (Rejuv && (@battle.FE == :GRASSY \|\| @battle.OV == :GRASSY)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:1388 | [:FOREST].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Inspect.rb:77 | self.ability == :LONGREACH && [:ROCKY, :FOREST].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:483 | (!Rejuv && @battle.FE == :FOREST) \|\| @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 2, 5) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:918 | attacker.ability == :LONGREACH && (@battle.FE == :ROCKY \|\| (!Rejuv && @battle.FE == :FOREST)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1542 | ([:FOREST].include?(@battle.FE) \|\| (Rejuv && @battle.FE == :GRASSY)) && attacker.ability == :OVERGROW && type == :GRASS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1544 | @battle.FE == :FOREST && attacker.ability == :SWARM && type == :BUG | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1726 | opponent.ability == :GRASSPELT && ([:GRASSY, :FOREST].include?(@battle.FE) \|\| @battle.OV == :GRASSY) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1828 | soundmoveboostfields.include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:964 | [:GRASSY, :FOREST].include?(@battle.FE) \|\| @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 1, 2) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:994 | @battle.FE == :FOREST && @move == :DEFENDORDER | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2432 | @move == :NATURESMADNESS && [:GRASSY, :FOREST].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:5167 | @battle.FE == :FOREST && @move == :HEALORDER | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7109 | Overlays && [:FOREST, :BEWITCHED].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7415 | [:FOREST, :FAIRYTALE, :BEWITCHED].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:9064 | (@move == :LUNARBLESSING && [:STARLIGHT, :NEWWORLD, :HOLY].include?(@battle.FE)) \|\| (@move == :JUNGLEHEALING && [:FOREST, :HOLY, :NEWWORLD].include?(@battle.FE)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:9997 | @battle.FE == :FOREST && @move == :CHLOROBLAST | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_ZMove.rb:269 | @battle.canChangeFE?([:GRASSY, :FOREST, *PBFields::FLOWERGARDEN]) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2843 | Overlays && [:FOREST, :BEWITCHED].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:3635 | [:FOREST, :WASTELAND, :BEWITCHED].include?(@battle.FE) | implemented_and_tested | Effect Spore doubles total chance to 60 percent and then selects poison/sleep/paralysis uniformly. Grass, Overcoat, Safety Goggles and noncontact attacks/pads prevent the roll. Tests: amplified Effect Spore uses an equal three-status draw and honors powder immunity |
| Battler.rb:3934 | Overlays && [:FOREST, :BEWITCHED].include?(@battle.FE) | implemented_and_tested | Seed Sower grows Garden stages 1-4; other permitted fields create Grassy terrain with source duration/Amplifield and Forest/Bewitched extensions. Ability creation ignores the move-only Everstone restriction. Tests: Seed Sower grows each garden stage and creates longer forest terrain without Everstone blocking |
| Battler.rb:5306 | [:FOREST].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7302 | self.ability == :GRASSPELT && ([:GRASSY, :FOREST].include?(@battle.FE) \|\| @battle.OV == :GRASSY) | requires_behavioral_comparison | Semantic comparison pending Tests:  |

AI source leads: 24. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":["galestrike"],"abilities":["gravitycontrol"],"items":[]}`.
