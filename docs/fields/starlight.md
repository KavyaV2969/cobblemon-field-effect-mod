# Starlight Arena

Original ID: `STARLIGHT`; datapack ID: `rejuvenation:starlight`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "Starlight fills the battlefield."

Nature Power: `moonblast`. Secret Power animation/reference move: `swift`.

Secret Power actual secondary choices: `[{"boosts":{"spd":-1}}]`.

Mimicry type: `Dark`; Burmy cloak reference: `PLANTCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"magicalseed","effect":null,"duration":0,"message":null,"stats":{"spa":1}}`. Seed actions: `[{"op":"wish","fraction":0.75,"message":"A wish was made for {1}!"}]`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":8,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":8,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":8,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `{"cobblemon:dusk_ball":3.5}` (Balls.rb:143,166). Incoming weather conversions: `null`.

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
| `aurorabeam` | {"multiplier":1.5,"message":"Starlight surged through the attack!"} |
| `signalbeam` | {"multiplier":1.5,"message":"Starlight surged through the attack!"} |
| `flashcannon` | {"multiplier":1.5,"message":"Starlight surged through the attack!"} |
| `lusterpurge` | {"multiplier":1.5,"message":"Starlight surged through the attack!"} |
| `dazzlinggleam` | {"multiplier":1.5,"message":"Starlight surged through the attack!"} |
| `mirrorshot` | {"multiplier":1.5,"message":"Starlight surged through the attack!"} |
| `mirrorbeam` | {"multiplier":1.5,"message":"Starlight surged through the attack!"} |
| `technoblast` | {"multiplier":1.5,"message":"Starlight surged through the attack!"} |
| `solarbeam` | {"multiplier":1.5,"additionalType":"FAIRY","message":"Starlight surged through the attack!"} |
| `photongeyser` | {"multiplier":1.5,"message":"Starlight surged through the attack!"} |
| `moonblast` | {"multiplier":1.5,"message":"Lunar energy surged through the attack!"} |
| `prismaticlaser` | {"multiplier":1.5,"message":"Starlight surged through the attack!"} |
| `nightslash` | {"multiplier":1.5,"message":"Lunar energy surged through the attack!"} |
| `nightdaze` | {"multiplier":1.5,"message":"Lunar energy surged through the attack!"} |
| `luminacrash` | {"multiplier":1.5,"message":"Starlight surged through the attack!"} |
| `bloodmoon` | {"multiplier":1.5,"message":"Lunar energy surged through the attack!"} |
| `dracometeor` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `meteormash` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `cometpunch` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `spacialrend` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `swift` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `hyperspacehole` | {"multiplier":2.0,"message":"The astral vortex accelerated the attack!"} |
| `hyperspacefury` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `moongeistbeam` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `sunsteelstrike` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `meteorassault` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `blackholeeclipse` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `searingsunrazesmash` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `menacingmoonrazemaelstrom` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `lightthatburnsthesky` | {"multiplier":2.0,"message":"Starlight surged through the attack!","transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The cosmic light was consumed!"}} |
| `meteorbeam` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `tachyoncutter` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `terastarstorm` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `doomdesire` | {"multiplier":4.0} |
| `doomdummy` | {"multiplier":4.0,"additionalType":"FIRE","message":"A star came crashing down!"} |
| `solarblade` | {"additionalType":"FAIRY"} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Dark"} | {"condition":{"always":true},"multiplier":1.5,"message":"The night sky boosted the attack!","additionalType":"FAIRY"} |
| {"moveType":"Psychic"} | {"condition":{"always":true},"multiplier":1.5,"message":"The astral energy boosted the attack!"} |
| {"moveType":"Fairy"} | {"condition":{"always":true},"multiplier":1.3,"message":"Starlight supercharged the attack!"} |

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "switchIn" | {"ability":{"who":"user","values":["illuminate"]}} | [{"op":"boost","stats":{"spa":2}},{"op":"message","text":"{1} flared up with starlight!"}] | "Battler.rb:2197" |
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
| "chargeMove" | {"all":[{"move":"razorwind"},{"overlay":"rejuvenation:grassy_terrain"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4430" |
| "chargeMove" | {"all":[{"any":[{"move":"solarbeam"},{"move":"solarblade"}]},{"overlay":"rejuvenation:rainbow"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4472" |
| "modifyMove" | {"move":"meteorassault"} | [{"op":"moveProperty","path":"self","value":null}] | "Battle_MoveEffects.rb:4416" |
| "modifyMove" | {"all":[{"move":"mist"},{"not":{"sideCondition":"mist"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"createField","field":"rejuvenation:misty_terrain","duration":3,"extendedBy":3,"message":"Mist swirled around the battlefield!"}]}] | "Battle_MoveEffects.rb:1817" |
| "modifyMove" | {"move":"cosmicpower"} | [{"op":"moveProperty","path":"boosts","value":{"def":2,"spd":2}}] | "Battle_MoveEffects.rb:993" |
| "modifyMove" | {"move":"flash"} | [{"op":"moveProperty","path":"boosts","value":{"accuracy":-2}}] | "Battle_MoveEffects.rb:1503" |
| "modifyMove" | {"move":"moonlight"} | [{"op":"moveProperty","path":"heal","value":[0.75,1],"removeCallback":"onHit"}] | "Battle_MoveEffects.rb:5237" |
| "afterMove" | {"move":"wish"} | [{"op":"adjustWish","fraction":0.75}] | "Battle_MoveEffects.rb:5214" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "chargeMove" | {"move":"geomancy"} | [{"op":"reject"}] | "Battle_MoveEffects.rb:7276" |
| "chargeMove" | {"move":"meteorbeam"} | [{"op":"reject"}] | "Battle_MoveEffects.rb:8840" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |

## Original status-move highlights

Source UI buff highlights: `["auroraveil","cosmicpower","flash","wish","healingwish","lunardance","moonlight","trickroom","magicroom","wonderroom","lunarblessing"]`.

Source UI nerf highlights: `[]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["auroraveil","cosmicpower","flash","moonlight"],"unreviewedHighlightedMoves":["healingwish","lunarblessing","lunardance","magicroom","trickroom","wish","wonderroom"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Balls.rb:166 | PBDayNight.isNight?(pbGetTimeNow) \|\| [:DARKCRYSTALCAVERN, :SHORTCIRCUIT, :UNDERWATER, :CAVE, :CRYSTALCAVERN, :DRAGONSDEN, :STARLIGHT, :NEWWORLD, :INVERSE].include?(battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:883 | @field.effect == :STARLIGHT | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:4561 | pbCheckGlobalAbility(:WORLDOFNIGHTMARES) && @field.effect == :STARLIGHT | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:8004 | [:FAIRYTALE, :STARLIGHT].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:8009 | [:FAIRYTALE, :STARLIGHT].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:8018 | [:STARLIGHT, :NEWWORLD, :BIGTOP, :DANCEFLOOR].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:8024 | [:STARLIGHT, :NEWWORLD, :BIGTOP, :DANCEFLOOR].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:8025 | @field.effect == :STARLIGHT | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Inspect.rb:4 | [:STARLIGHT, :NEWWORLD].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:263 | :STARLIGHT | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1593 | [:STARLIGHT, :NEWWORLD].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1724 | opponent.ability == :MARVELSCALE && (!opponent.status.nil? \|\| [:MISTY, :RAINBOW, :FAIRYTALE, :DRAGONSDEN, :STARLIGHT, :DEUXFINALIS].include?(@battle.FE) \|\| @battle.OV == :MISTY) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1812 | opponent.ability == :SHADOWSHIELD && [:STARLIGHT, :NEWWORLD, :DARKCRYSTALCAVERN].include?(@battle.FE) && opponent.damagestate.typemod.superEffective? | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:993 | [:MISTY, :RAINBOW, :HOLY, :STARLIGHT, :NEWWORLD, :PSYTERRAIN].include?(@battle.FE) && @move == :COSMICPOWER | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1503 | [:SHORTCIRCUIT, :DARKCRYSTALCAVERN, :MIRROR, :STARLIGHT, :NEWWORLD, :DARKNESS1].include?(@battle.FE) && @move == :FLASH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:4416 | !(@battle.FE == :STARLIGHT && @move == :METEORASSAULT) && !(attacker.crested == :CLAYDOL && [:HYPERBEAM, :PRISMATICLASER, :ETERNABEAM].include?(@move)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:5214 | [:MISTY, :RAINBOW, :HOLY, :FAIRYTALE, :STARLIGHT].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:5237 | ([:DARKCRYSTALCAVERN, :STARLIGHT, :NEWWORLD, :BEWITCHED].include?(@battle.FE) && @move == :MOONLIGHT) \|\| (Rejuv && @battle.FE == :GRASSY && @move == :SYNTHESIS) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6137 | [:NEWWORLD, :PSYTERRAIN].include?(@battle.FE) \|\| attacker.hasWorkingItem(:AMPLIFIELDROCK) \|\| (Rejuv && @battle.FE == :STARLIGHT) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6959 | [:CHESS, :NEWWORLD, :PSYTERRAIN].include?(@battle.FE) \|\| attacker.hasWorkingItem(:AMPLIFIELDROCK) \|\| (Rejuv && @battle.FE == :STARLIGHT) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7029 | [:NEWWORLD, :PSYTERRAIN].include?(@battle.FE) \|\| attacker.hasWorkingItem(:AMPLIFIELDROCK) \|\| (Rejuv && @battle.FE == :STARLIGHT) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7276 | [:STARLIGHT, :DEEPEARTH].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7724 | [:DARKCRYSTALCAVERN, :RAINBOW, :ICY, :CRYSTALCAVERN, :SNOWYMOUNTAIN, :MIRROR, :STARLIGHT, :FROZENDIMENSION].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8840 | [:STARLIGHT, :NEWWORLD].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:9064 | (@move == :LUNARBLESSING && [:STARLIGHT, :NEWWORLD, :HOLY].include?(@battle.FE)) \|\| (@move == :JUNGLEHEALING && [:FOREST, :HOLY, :NEWWORLD].include?(@battle.FE)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2197 | @battle.FE == :STARLIGHT | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:4184 | :MISTY, :RAINBOW, :STARLIGHT | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7033 | [:GEOMANCY, :METEORBEAM].include?(basemove.move) && @battle.FE == :STARLIGHT | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7300 | self.ability == :MARVELSCALE && (!self.status.nil? \|\| [:MISTY, :RAINBOW, :FAIRYTALE, :DRAGONSDEN, :STARLIGHT, :DEUXFINALIS].include?(@battle.FE)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |

AI source leads: 31. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":["mirrorbeam","doomdummy"],"abilities":["gravitycontrol"],"items":[]}`.
