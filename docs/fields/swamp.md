# Swamp Field

Original ID: `SWAMP`; datapack ID: `rejuvenation:swamp`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "The field is swamped."

Nature Power: `muddywater`. Secret Power animation/reference move: `muddywater`.

Secret Power actual secondary choices: `[{"boosts":{"spe":-1}}]`.

Mimicry type: `Water`; Burmy cloak reference: `PLANTCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"telluricseed","effect":null,"duration":null,"message":"{1}'s body became clear!","stats":{"def":1}}`. Seed actions: `[{"op":"ability","id":"clearbody"}]`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{"aquaring":2},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":true}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{},"statLoss":{"snaptrap":["atk","def","spa","spd","spe"],"infestation":["atk","def","spa","spd","spe"]},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `null` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The terrain returned to normal."`.

Shared stat pools: `null`. Absorber policies: `null`. Indirect immunity: `null`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":5,"extendedBy":3,"blockEverstone":false}],"source":"Battler.rb:3926"}}}`. Inactive abilities: `null`. Status type bypass: `null`.

Field form typing: `["arceus","silvally"]`. Custom volatile rules: `{"rejuvenationswampweb":{"actions":[{"op":"randomStat","who":"target","stats":["atk","def","spa","spd","spe"],"amount":-1}],"source":"Battle_MoveEffects.rb:5785-5786; Battle.rb:5939-5942; Battler.rb:738-740"},"rejuvenationswampwebsource":{"actions":[],"source":"Battler.rb:738-740"}}`. Rampage policy: `null`.

Progression: `null`. Party roles: `null`.

Field clock policy: `null`.

Fields persist for the battle unless transformed/destroyed. Move/ability terrain creation uses its own finite duration; engine stack restoration and overlay clocks are described in ARCHITECTURE.md.

## Core move rules

| Move ID | Executable properties and exact source text |
|---|---|
| `mudbomb` | {"multiplier":1.5,"message":"The murk strengthened the attack!"} |
| `mudshot` | {"multiplier":1.5,"message":"The murk strengthened the attack!"} |
| `mudslap` | {"multiplier":1.5,"message":"The murk strengthened the attack!"} |
| `mudbarrage` | {"multiplier":1.5,"message":"The murk strengthened the attack!"} |
| `muddywater` | {"multiplier":1.5,"message":"The murk strengthened the attack!"} |
| `sludgewave` | {"multiplier":1.5,"message":"The murk strengthened the attack!"} |
| `gunkshot` | {"multiplier":1.5,"message":"The murk strengthened the attack!"} |
| `brine` | {"multiplier":1.5,"message":"The murk strengthened the attack!"} |
| `smackdown` | {"multiplier":1.5,"additionalType":"WATER","message":"The murk strengthened the attack!"} |
| `thousandarrows` | {"multiplier":1.5,"additionalType":"WATER","message":"The murk strengthened the attack!"} |
| `hydrovortex` | {"multiplier":1.5,"message":"The murk strengthened the attack!"} |
| `savagespinout` | {"multiplier":1.5,"message":"There are bugs EVERYWHERE!"} |
| `earthquake` | {"multiplier":0.25,"message":"The attack dissipated in the soggy ground..."} |
| `magnitude` | {"multiplier":0.25,"message":"The attack dissipated in the soggy ground..."} |
| `bulldoze` | {"multiplier":0.25,"message":"The attack dissipated in the soggy ground..."} |
| `selfdestruct` | {"multiplier":0,"message":"The dampness prevents the explosion!"} |
| `explosion` | {"multiplier":0,"message":"The dampness prevents the explosion!"} |
| `mindblown` | {"multiplier":0,"message":"The dampness prevents the explosion!"} |
| `sleeppowder` | {"accuracy":100} |
| `stunspore` | {"accuracy":100} |
| `poisonpowder` | {"accuracy":100} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Bug"} | {"condition":{"always":true},"multiplier":1.3,"message":"Bugs are swarming!"} |
| {"moveType":"Water"} | {"condition":{"always":true},"multiplier":1.3,"message":"The dampness strengthened the attack!"} |
| {"moveType":"Grass"} | {"condition":{"always":true},"multiplier":1.3,"message":"Thick mangroves line the area!"} |
| {"moveType":"Fire"} | {"condition":{"always":true},"multiplier":0.8,"message":"The dampness weakened the flame..."} |

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "switchIn" | {"ability":{"who":"user","values":["rattled"]}} | [{"op":"boost","stats":{"spe":1}}] | "Battler.rb:2068" |
| "residual" | {"all":[{"ability":{"who":"user","values":["watercompaction"]}},{"grounded":{"who":"user","value":true}}]} | [{"op":"boost","stats":{"def":2}}] | "Battle.rb:6165" |
| "residual" | {"ability":{"who":"user","values":["dryskin"]}} | [{"op":"heal","fraction":0.0625,"message":"{1} was healed a little by the murk!"}] | "Battle.rb:5850-6109" |
| "residual" | {"all":[{"all":[{"grounded":{"who":"user","value":true}},{"not":{"item":{"who":"user","values":["heavydutyboots","clearamulet"]}}},{"not":{"ability":{"who":"user","values":["whitesmoke","clearbody","quickfeet","swiftswim","propellertail"]}}}]},{"not":{"volatile":{"who":"user","id":"partiallytrapped"}}}]} | [{"op":"boost","stats":{"spe":-1}},{"op":"groupMessage","text":"The Pokémon's Speed sank..."}] | "Battle.rb:5930" |
| "residual" | {"all":[{"all":[{"grounded":{"who":"user","value":true}},{"not":{"item":{"who":"user","values":["heavydutyboots","clearamulet"]}}},{"not":{"ability":{"who":"user","values":["whitesmoke","clearbody","quickfeet","swiftswim","propellertail"]}}}]},{"volatile":{"who":"user","id":"partiallytrapped"}}]} | [{"op":"boost","stats":{"spe":-2}},{"op":"groupMessage","text":"The Pokémon's Speed sank..."}] | "Battle.rb:5932" |
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
| "modifyMove" | {"move":"shelter"} | [{"op":"moveProperty","path":"boosts","value":{"def":3}}] | "Battle_MoveEffects.rb:1068" |
| "modifyMove" | {"move":"mudshot"} | [{"op":"moveProperty","path":"secondaries.0.boosts","value":{"spe":-2}}] | "Battle_MoveEffects.rb:1429" |
| "modifyMove" | {"move":"strugglebug"} | [{"op":"moveProperty","path":"secondaries.0.boosts","value":{"spa":-2}}] | "Battle_MoveEffects.rb:1458" |
| "modifyMove" | {"move":"attackorder"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"randomStat","who":"target","stats":["atk","def","spa","spd","spe"],"amount":-1}]}] | "Battle_MoveEffects.rb:109" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "tryMove" | {"move":"roar"} | [{"op":"message","text":"What are ya doin' in my swamp?!"}] | "Battle_MoveEffects.rb:5639" |
| "modifyMove" | {"move":"spiderweb"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"volatile","id":"rejuvenationswampweb","who":"target","linkedStatus":"rejuvenationswampwebsource"}]}] | "Battle_MoveEffects.rb:5785" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["gulpmissile"]}},{"species":{"who":"user","value":"cramorant"}},{"formName":{"who":"user","value":"Gorging"}}]} | [{"op":"form","species":"cramorantgulping"}] | "Battler.rb:1720-1729" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |

## Original status-move highlights

Source UI buff highlights: `["sleeppowder","stunspore","poisonpowder","aquaring","strengthsap","leechseed","stringshot","spiderweb"]`.

Source UI nerf highlights: `[]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":[],"unreviewedHighlightedMoves":["aquaring","leechseed","poisonpowder","sleeppowder","spiderweb","strengthsap","stringshot","stunspore"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Battle.rb:5927 | @field.effect == :SWAMP | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6141 | [:SWAMP, :WATERSURFACE, :UNDERWATER, :MURKWATERSURFACE].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6351 | ((!Rejuv && @field.effect == :SWAMP) \|\| [:CORROSIVE, :CORRUPTED, :ROTTING].include?(@field.effect)) && !i.hasType?(:STEEL) && !i.hasType?(:POISON) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6560 | @field.effect == :SWAMP | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6678 | Rejuv && @field.effect == :SWAMP && [:SNAPTRAP, :INFESTATION].include?(i.effects[:MultiTurnAttack]) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:1190 | (!Rejuv && @battle.FE == :SWAMP) \|\| @battle.FE == :FOREST | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:1193 | [:MISTY, :SWAMP, :WATERSURFACE, :UNDERWATER].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:1223 | Rejuv && @battle.FE == :SWAMP && [:HPDrainingMove, :MatchaGotcha, :StrengthSap, :LeechSeed].include?(agent) && !opponent.isFainted? | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:109 | Rejuv && @battle.FE == :SWAMP && @move == :ATTACKORDER | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1068 | @move == :SHELTER && @battle.FE == :SWAMP | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1429 | Rejuv && @battle.FE == :SWAMP && @move == :MUDSHOT | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1458 | Rejuv && @battle.FE == :SWAMP && @move == :STRUGGLEBUG | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1637 | Rejuv && @battle.FE == :SWAMP && @move == :STRINGSHOT | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:5639 | @move == :ROAR && @battle.FE == :SWAMP | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:5785 | Rejuv && @move == :SPIDERWEB && @battle.FE == :SWAMP | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:1721 | [:SWAMP, :WATERSURFACE, :UNDERWATER].include?(@battle.FE) | implemented_and_tested | Surf/Dive catch form overrides: aquatic fields choose Gulping; electrical/mechanical fields choose Gorging; other fields retain native HP selection. Tests: field Gulp Missile selects its source forme rather than the HP-based native forme |
| Battler.rb:2068 | Rejuv && @battle.FE == :SWAMP | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:3708 | target.ability == :GOOEY && [:SWAMP, :MURKWATERSURFACE].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:3890 | [:WATERSURFACE, :SWAMP, :MURKWATERSURFACE].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:4195 | :SWAMP | requires_behavioral_comparison | Semantic comparison pending Tests:  |

AI source leads: 17. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":["mudbarrage"],"abilities":["gravitycontrol"],"items":[]}`.
