# Desert Field

Original ID: `DESERT`; datapack ID: `rejuvenation:desert`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "The field is rife with sand."

Nature Power: `sandtomb`. Secret Power animation/reference move: `sandtomb`.

Secret Power actual secondary choices: `[{"boosts":{"accuracy":-1}}]`.

Mimicry type: `Ground`; Burmy cloak reference: `SANDYCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"telluricseed","effect":"multiturnattack","duration":"SANDTOMB","message":"{1} was trapped by Sand Tomb!","stats":{"def":1,"spd":1,"spe":1}}`. Seed actions: `null`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{"sandtomb":1},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"},"sunnyday":{"duration":8,"sourceMoves":["sunnyday"],"sourceAbilities":["drought","orichalcumpulse"],"source":"Battle_MoveEffects.rb:6217; Battler.rb:2937-2994"},"sandstorm":{"duration":8,"sourceMoves":["sandstorm"],"sourceAbilities":["sandstream","sandspit","sandspit","sandspit"],"source":"Battle_MoveEffects.rb:6247; Battler.rb:2937-2994"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `null` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The terrain returned to normal."`.

Shared stat pools: `null`. Absorber policies: `null`. Indirect immunity: `null`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"sandspit":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"setWeather","id":"sandstorm","onSuccess":[{"op":"boost","who":"target","stats":{"accuracy":-1}}]}],"source":"Battler.rb:3897"}},"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":5,"extendedBy":3,"blockEverstone":false}],"source":"Battler.rb:3926"}}}`. Inactive abilities: `null`. Status type bypass: `null`.

Field form typing: `["arceus","silvally"]`. Custom volatile rules: `null`. Rampage policy: `null`.

Progression: `null`. Party roles: `null`.

Field clock policy: `null`.

Fields persist for the battle unless transformed/destroyed. Move/ability terrain creation uses its own finite duration; engine stack restoration and overlay clocks are described in ARCHITECTURE.md.

## Core move rules

| Move ID | Executable properties and exact source text |
|---|---|
| `needlearm` | {"multiplier":1.5,"message":"The desert strengthened the attack!"} |
| `pinmissile` | {"multiplier":1.5,"message":"The desert strengthened the attack!"} |
| `dig` | {"multiplier":1.5,"message":"The desert strengthened the attack!"} |
| `sandtomb` | {"multiplier":1.5,"message":"The desert strengthened the attack!"} |
| `heatwave` | {"multiplier":1.5,"message":"The desert strengthened the attack!"} |
| `thousandwaves` | {"multiplier":1.5,"message":"The desert strengthened the attack!"} |
| `burnup` | {"multiplier":1.5,"message":"The desert strengthened the attack!"} |
| `searingsunrazesmash` | {"multiplier":1.5,"message":"The desert strengthened the attack!"} |
| `hydrosteam` | {"multiplier":1.5,"message":"The desert strengthened the attack!"} |
| `solarblade` | {"multiplier":1.5,"message":"The desert strengthened the attack!"} |
| `solarbeam` | {"multiplier":1.5,"message":"The desert strengthened the attack!"} |
| `scald` | {"multiplier":1.5,"message":"The desert strengthened the attack!"} |
| `steameruption` | {"multiplier":1.5,"message":"The desert strengthened the attack!"} |
| `sandsearstorm` | {"multiplier":1.5,"message":"The desert strengthened the attack!"} |
| `boneclub` | {"multiplier":1.5,"message":"The lifeless desert strengthened the attack!"} |
| `bonerush` | {"multiplier":1.5,"message":"The lifeless desert strengthened the attack!"} |
| `bonemerang` | {"multiplier":1.5,"message":"The lifeless desert strengthened the attack!"} |
| `shadowbone` | {"multiplier":1.5,"message":"The lifeless desert strengthened the attack!"} |
| `scorchingsands` | {"multiplier":1.5,"message":"The desert strengthened the attack!"} |
| `soak` | {"multiplier":0,"message":"The desert is too dry..."} |
| `aquaring` | {"multiplier":0,"message":"The desert is too dry..."} |
| `lifedew` | {"multiplier":0,"message":"The desert is too dry..."} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Water"} | {"condition":{"all":[{"not":{"grounded":{"who":"user","value":false}}},{"all":[{"not":{"move":"scald"}},{"all":[{"not":{"move":"steameruption"}},{"not":{"move":"hydrosteam"}}]}]}]},"multiplier":0.5,"message":"The desert softened the attack..."} |
| {"moveType":"Electric"} | {"condition":{"not":{"grounded":{"who":"target","value":false}}},"multiplier":0.5,"message":"The desert softened the attack..."} |

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "specialDefense" | {"type":{"who":"user","value":"Ground"}} | [{"op":"multiply","value":1.5}] | "Battle_Field.rb:1111" |
| "residual" | {"ability":{"who":"user","values":["eartheater"]}} | [{"op":"heal","fraction":0.0625,"message":"{1} ate sand to recover!"}] | "Battle.rb:5850-6109" |
| "residual" | {"ability":{"who":"user","values":["dryskin"]}} | [{"op":"residualDamage","fraction":0.125,"message":"{1} was hurt by the desert air!"}] | "Battle.rb:5970-6220" |
| "residual" | {"all":[{"weather":["sunnyday","desolateland"]},{"any":[{"type":{"who":"user","value":"Grass"}},{"type":{"who":"user","value":"Water"}}]},{"not":{"ability":{"who":"user","values":["solarpower","chlorophyll","megasol"]}}},{"not":{"item":{"who":"user","values":["utilityumbrella"]}}}]} | [{"op":"residualDamage","fraction":0.125,"message":"{1} was hurt by the sunlight!"}] | "Battle.rb:5485" |
| "residual" | {"ability":{"who":"user","values":["wanderingspirit"]}} | [{"op":"boost","stats":{"spe":-1}}] | "Battle.rb:6203" |
| "speed" | {"all":[{"ability":{"who":"user","values":["sandrush"]}},{"not":{"weather":["sandstorm"]}},{"always":true}]} | [{"op":"multiply","value":2}] | "Battle_Effects.rb:1411-1440" |
| "modifyMove" | {"move":"shoreup"} | [{"op":"moveProperty","path":"heal","value":[2,3],"removeCallback":"onHit"}] | "Battle_MoveEffects.rb:8092" |
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
| "tryHit" | {"all":[{"attackType":"Water"},{"weather":["sunnyday","desolateland"]},{"any":[{"type":{"who":"target","value":"Water"}},{"type":{"who":"target","value":"Grass"}}]},{"not":{"item":{"who":"target","values":["utilityumbrella"]}}},{"foe":true}]} | [{"op":"heal","who":"target","fraction":0.25,"message":"{1} had its HP restored."},{"op":"reject"}] | "Battle_Move.rb:626; Battler.rb:5584-5600" |
| "chargeMove" | {"move":"dig"} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4719" |
| "chargeMove" | {"all":[{"move":"razorwind"},{"overlay":"rejuvenation:grassy_terrain"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4430" |
| "chargeMove" | {"all":[{"any":[{"move":"solarbeam"},{"move":"solarblade"}]},{"overlay":"rejuvenation:rainbow"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4472" |
| "modifyMove" | {"all":[{"move":"mist"},{"not":{"sideCondition":"mist"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"createField","field":"rejuvenation:misty_terrain","duration":3,"extendedBy":3,"message":"Mist swirled around the battlefield!"}]}] | "Battle_MoveEffects.rb:1817" |
| "modifyMove" | {"move":"sandattack"} | [{"op":"moveProperty","path":"boosts","value":{"accuracy":-2}}] | "Battle_MoveEffects.rb:1502" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |

## Original status-move highlights

Source UI buff highlights: `["sandstorm","sunnyday","sandattack","shoreup","arenitewall"]`.

Source UI nerf highlights: `["soak"]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["sandattack","shoreup"],"unreviewedHighlightedMoves":["arenitewall","sandstorm","soak","sunnyday"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Battle.rb:564 | pbWeather(nil) == :SUNNYDAY \|\| @field.effect == :NEWWORLD \|\| Rejuv && [:DESERT].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:5464 | Rejuv && @field.effect == :DESERT && (i.hasType?(:GRASS) \|\| i.hasType?(:WATER)) && ![:SOLARPOWER, :CHLOROPHYLL, :MEGASOL].include?(i.ability) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:5530 | Rejuv && @field.effect == :DESERT | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6002 | @field.effect == :DESERT | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6170 | [:DESERT, :HAUNTED].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6657 | @field.effect == :DESERT | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:1431 | [:DESERT, :ASHENBEACH].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:1111 | :DESERT | implemented_and_tested | Desert grants Ground defenders 1.5 only to the special defensive path. Tests: every compiled field defense branch uses the source type, stat and weather gates, Mega Sol overrides hail for field defense, Deux Finalis defense uses attacker-relative weather |
| Battle_Inspect.rb:86 | self.ability == :SANDVEIL && (@battle.pbWeather(nil) == :SANDSTORM \|\| [:DESERT, :ASHENBEACH].include?(@battle.FE)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:626 | @battle.FE == :DESERT && (opponent.hasType?(:GRASS) \|\| opponent.hasType?(:WATER)) && @battle.pbWeather(attacker) == :SUNNYDAY && !opponent.hasWorkingItem(:UTILITYUMBRELLA) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:912 | opponent.ability == :SANDVEIL && (@battle.pbWeather(attacker) == :SANDSTORM \|\| [:DESERT, :ASHENBEACH].include?(@battle.FE)) && !opponent.moldbroken | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1276 | (weather == :SANDSTORM \|\| [:DESERT, :ASHENBEACH].include?(@battle.FE)) && (type == :ROCK \|\| type == :GROUND \|\| type == :STEEL) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1502 | [:DESERT, :ASHENBEACH].include?(@battle.FE) && @move == :SANDATTACK | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:4719 | Rejuv && @battle.FE == :DESERT | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6217 | attacker.hasWorkingItem(:HEATROCK) \|\| [:DESERT, :MOUNTAIN, :SNOWYMOUNTAIN, :SKY].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6247 | attacker.hasWorkingItem(:SMOOTHROCK) \|\| [:DESERT, :ASHENBEACH, :SKY].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8092 | @battle.pbWeather(attacker) == :SANDSTORM \|\| @battle.FE == :DESERT | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2952 | self.hasWorkingItem(:SMOOTHROCK) \|\| [:DESERT, :ASHENBEACH, :SKY].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2967 | self.hasWorkingItem(:HEATROCK) \|\| [:DESERT, :MOUNTAIN, :SNOWYMOUNTAIN, :SKY].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:3899 | target.hasWorkingItem(:SMOOTHROCK) \|\| [:DESERT, :ASHENBEACH, :SKY].include?(@battle.FE) | implemented_and_tested | Sand Spit lasts eight turns on Desert/Ashen Beach/Sky; Desert/Ashen Beach also reduce attacker accuracy once only if weather was successfully set. Tests: Sand Spit accuracy loss requires successful weather and uses the field eight-turn clock |
| Battler.rb:3901 | [:DESERT, :ASHENBEACH].include?(@battle.FE) | implemented_and_tested | Sand Spit lasts eight turns on Desert/Ashen Beach/Sky; Desert/Ashen Beach also reduce attacker accuracy once only if weather was successfully set. Tests: Sand Spit accuracy loss requires successful weather and uses the field eight-turn clock |
| Battler.rb:4192 | :BURNING, :DESERT, :VOLCANIC | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Rejuv/Battle/Battle.rb:23 | [:DESERT, :MOUNTAIN, :SNOWYMOUNTAIN, :SKY].include?(@field.effect) | excluded_crest | These field duration clauses are wholly inside pbCrestEffects, guarded by crested and selected by the Castform Crest. Ordinary weather extensions are audited separately. Tests:  |
| Rejuv/Battle/Battle.rb:25 | [:DESERT, :ASHENBEACH, :SKY].include?(@field.effect) | excluded_crest | These field duration clauses are wholly inside pbCrestEffects, guarded by crested and selected by the Castform Crest. Ordinary weather extensions are audited separately. Tests:  |
| Rejuv/Battle/MoveEffects.rb:139 | [:DESERT, :ROCKY, :ASHENBEACH, :DEUXFINALIS].include?(@battle.FE) | excluded_custom_move | The enclosing custom move handler changes Arenite Wall only; it is absent from the installed ordinary move registry. Tests:  |
| Rejuv/Battle/MoveEffects.rb:156 | [:DESERT, :ROCKY, :ASHENBEACH].include?(@battle.FE) | excluded_custom_move | The enclosing custom move handler changes Arenite Wall only; it is absent from the installed ordinary move registry. Tests:  |

AI source leads: 21. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":["arenitewall"],"abilities":["gravitycontrol"],"items":[]}`.
