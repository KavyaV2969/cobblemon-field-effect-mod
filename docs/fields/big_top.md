# Big Top Arena

Original ID: `BIGTOP`; datapack ID: `rejuvenation:big_top`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "Now presenting...!"

Nature Power: `acrobatics`. Secret Power animation/reference move: `dynamicpunch`.

Secret Power actual secondary choices: `[{"boosts":{"spd":-1}}]`.

Mimicry type: `Fighting`; Burmy cloak reference: `TRASHCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"syntheticseed","effect":"helpinghand","duration":true,"message":"{1} accepts the crowd's help!","stats":{"atk":1}}`. Seed actions: `null`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"encore":{"add":3,"sourceMoves":["encore"],"source":"Battle_MoveEffects.rb:4269"},"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"},"snow":{"duration":8,"sourceMoves":["chillyreception"],"sourceAbilities":[],"source":"Battle_MoveEffects.rb:9564; Battler.rb:2937-2994"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `null` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The terrain returned to normal."`.

Shared stat pools: `null`. Absorber policies: `null`. Indirect immunity: `null`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"punkrock":{"onBasePower":{"mode":"replace","condition":{"flag":"sound"},"actions":[{"op":"multiply","value":1.5}],"source":"Battler.rb:1828"}},"costar":{"onStart":{"mode":"append","condition":{"hasAlly":true},"actions":[{"op":"boost","stats":{"atk":1,"spa":1}}],"source":"Battler.rb:3410"}},"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":5,"extendedBy":3,"blockEverstone":false}],"source":"Battler.rb:3926"}}}`. Inactive abilities: `null`. Status type bypass: `null`.

Field form typing: `["arceus","silvally"]`. Custom volatile rules: `null`. Rampage policy: `null`.

Progression: `null`. Party roles: `null`.

Field clock policy: `null`.

Fields persist for the battle unless transformed/destroyed. Move/ability terrain creation uses its own finite duration; engine stack restoration and overlay clocks are described in ARCHITECTURE.md.

## Core move rules

| Move ID | Executable properties and exact source text |
|---|---|
| `vinewhip` | {"multiplier":1.5,"message":"Back, foul beast!"} |
| `powerwhip` | {"multiplier":1.5,"message":"Back, foul beast!"} |
| `firelash` | {"multiplier":1.5,"message":"Back, foul beast!"} |
| `fierydance` | {"multiplier":1.5,"message":"What grace!"} |
| `petaldance` | {"multiplier":1.5,"message":"What grace!"} |
| `revelationdance` | {"multiplier":1.5,"message":"What grace!"} |
| `fly` | {"multiplier":1.5,"message":"An extravagant aerial finish!"} |
| `acrobatics` | {"multiplier":1.5,"message":"An extravagant aerial finish!"} |
| `firstimpression` | {"multiplier":1.5,"message":"And what an entrance it is!"} |
| `drumbeating` | {"multiplier":1.5,"message":"Loud and clear!"} |
| `payday` | {"multiplier":1.5,"message":"And a little extra for you, darling!"} |
| `flowertrick` | {"multiplier":1.5,"message":"A spectacular magic trick!"} |
| `aquastep` | {"multiplier":1.5,"message":"What grace!"} |
| `makeitrain` | {"multiplier":1.5,"message":"And a little extra for you, darling!"} |
| `sing` | {"accuracy":100} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"flag":"sound"} | {"condition":{"always":true},"multiplier":1.5,"message":"Loud and clear!"} |

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "basePower" | {"any":[{"all":[{"moveType":"Fighting"},{"category":"Physical"}]},{"move":"strength"},{"move":"woodhammer"},{"move":"dualchop"},{"move":"heatcrash"},{"move":"skydrop"},{"move":"bulldoze"},{"move":"pound"},{"move":"iciclecrash"},{"move":"bodyslam"},{"move":"stomp"},{"move":"slam"},{"move":"gigaimpact"},{"move":"smackdown"},{"move":"irontail"},{"move":"meteormash"},{"move":"dragonrush"},{"move":"crabhammer"},{"move":"bounce"},{"move":"heavyslam"},{"move":"magnitude"},{"move":"earthquake"},{"move":"stompingtantrum"},{"move":"brutalswing"},{"move":"highhorsepower"},{"move":"icehammer"},{"move":"dragonhammer"},{"move":"blazekick"},{"move":"continentalcrush"},{"move":"doubleironbash"},{"move":"behemothbash"},{"move":"gravapple"},{"move":"headlongrush"},{"move":"glaiverush"},{"move":"gigatonhammer"},{"move":"mightycleave"},{"move":"hardpress"},{"move":"temperflare"},{"move":"supercellslam"},{"move":"ivycudgel"}]} | [{"op":"randomPower","range":14,"threshold":8,"low":13,"high":14,"maximize":{"ability":{"who":"user","values":["hugepower","guts","purepower","sheerforce"]}},"values":[0.5,0.5,1,1,1,1,1,1,1.5,1.5,1.5,1.5,2,2,3],"messages":["...WEAK!","...WEAK!","...OK!","...OK!","...OK!","...OK!","...OK!","...OK!","...NICE!","...NICE!","...NICE!","...NICE!","...POWERFUL!","...POWERFUL!","...OVER 9000!!!"]}] | "Battle_Field.rb:98; Battle_Move.rb:1985" |
| "modifyMove" | {"move":"noretreat"} | [{"op":"moveProperty","path":"boosts","value":{"atk":2,"spa":2,"spe":2,"def":-1,"spd":-1}}] | "Battle_MoveEffects.rb:8390" |
| "modifyMove" | {"move":"victorydance"} | [{"op":"moveProperty","path":"boosts","value":{"atk":2,"def":2,"spe":2}}] | "Battle_MoveEffects.rb:9147" |
| "modifyMove" | {"move":"clangoroussoul"} | [{"op":"moveProperty","path":"boosts","value":{"atk":2,"def":2,"spa":2,"spd":2,"spe":2}},{"op":"moveBehavior","recipe":"payHP","fraction":0.5,"threshold":true}] | "Battle_MoveEffects.rb:8590" |
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
| "modifyMove" | {"move":"dragondance"} | [{"op":"moveProperty","path":"boosts","value":{"atk":2,"spe":2}}] | "Battle_MoveEffects.rb:932" |
| "modifyMove" | {"move":"quiverdance"} | [{"op":"moveProperty","path":"boosts","value":{"spa":2,"spd":2,"spe":2}}] | "Battle_MoveEffects.rb:1009" |
| "modifyMove" | {"move":"swordsdance"} | [{"op":"moveProperty","path":"boosts","value":{"atk":3}}] | "Battle_MoveEffects.rb:1050" |
| "modifyMove" | {"move":"featherdance"} | [{"op":"moveProperty","path":"boosts","value":{"atk":-3}}] | "Battle_MoveEffects.rb:1608" |
| "modifyMove" | {"move":"teeterdance"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"boost","stats":{"def":-1},"who":"target"}]}] | "Battle_MoveEffects.rb:565" |
| "modifyMove" | {"move":"bellydrum"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"boost","stats":{"def":1,"spd":1}}]}] | "Battle_MoveEffects.rb:1260" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "modifyMove" | {"move":"spotlight"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"boost","stats":{"atk":1,"spa":1}},{"op":"boost","stats":{"atk":1,"spa":1},"who":"target"}]}] | "Battle_MoveEffects.rb:8187" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"volatile","id":"helpinghand"},{"op":"message","text":"The crowd cheers for {1}!"},{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |

## Original status-move highlights

Source UI buff highlights: `["encore","dragondance","quiverdance","swordsdance","featherdance","lunardance","teeterdance","sing","bellydrum","spotlight","aquabatics","clangoroussoul","noretreat","victorydance","chillyreception"]`.

Source UI nerf highlights: `[]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["clangoroussoul","dragondance","featherdance","noretreat","quiverdance","swordsdance","victorydance"],"unreviewedHighlightedMoves":["aquabatics","bellydrum","chillyreception","encore","lunardance","sing","spotlight","teeterdance"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Battle.rb:8018 | [:STARLIGHT, :NEWWORLD, :BIGTOP, :DANCEFLOOR].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:8024 | [:STARLIGHT, :NEWWORLD, :BIGTOP, :DANCEFLOOR].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:8026 | [:NEWWORLD, :BIGTOP, :DANCEFLOOR].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1406 | :BIGTOP | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1828 | soundmoveboostfields.include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:565 | [:BIGTOP, :DANCEFLOOR].include?(@battle.FE) && @move == :TEETERDANCE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:932 | [:BIGTOP, :DRAGONSDEN, :DANCEFLOOR].include?(@battle.FE) && @move == :DRAGONDANCE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1009 | [:BIGTOP, :DANCEFLOOR].include?(@battle.FE) && @move == :QUIVERDANCE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1050 | @move == :SWORDSDANCE && [:BIGTOP, :FAIRYTALE, :COLOSSEUM, :DANCEFLOOR].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1260 | @battle.FE == :BIGTOP | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1608 | @battle.FE == :BIGTOP && @move == :FEATHERDANCE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2900 | @battle.FE == :BIGTOP | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:4269 | @battle.FE == :BIGTOP \|\| @battle.ProgressiveFieldCheck(PBFields::CONCERT) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6078 | [:BIGTOP, :DRAGONSDEN].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6421 | [:BIGTOP, :DRAGONSDEN].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8187 | @battle.FE == :BIGTOP | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8376 | [:BIGTOP, :CHESS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8381 | [:BIGTOP, :CHESS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8390 | [:BIGTOP, :CHESS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8574 | [:BIGTOP, :DRAGONSDEN].include?(@battle.FE) \|\| @battle.ProgressiveFieldCheck(PBFields::CONCERT) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8590 | [:BIGTOP, :DRAGONSDEN].include?(@battle.FE) \|\| @battle.ProgressiveFieldCheck(PBFields::CONCERT) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8594 | [:BIGTOP, :DRAGONSDEN].include?(@battle.FE) \|\| @battle.ProgressiveFieldCheck(PBFields::CONCERT) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:9147 | [:BIGTOP, :DANCEFLOOR].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:9503 | [:BIGTOP, :DRAGONSDEN].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:9564 | attacker.hasWorkingItem(:ICYROCK) \|\| [:ICY, :SNOWYMOUNTAIN, :FROZENDIMENSION, :SKY, :CLOUDS, :BIGTOP].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:3272 | @battle.FE == :BIGTOP | implemented_and_tested | The first send-out after Zero to Hero transformation gains Helping Hand and crowd-cheer text on Big Top. A per-Pokemon battle marker is consumed on first send-out in any field, preventing later entry reactivation and battle-state leakage. Tests: Big Top cheers only on the first send-out after Zero to Hero transformation |
| Battler.rb:3410 | @battle.FE == :BIGTOP | implemented_and_tested | Big Top Costar first copies partner stat stages and Focus Energy, then adds one to both offensive stats. No partner means no field addition. Tests: Big Top Costar copies partner stages before adding its offensive boost |
| Battler.rb:6199 | self.ability == :DANCER && @battle.FE == :BIGTOP | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Rejuv/Battle/MoveEffects.rb:231 | @battle.FE == :BIGTOP | excluded_custom_move | The enclosing custom move handler changes Aquabatics only; it is absent from the installed ordinary move registry. Tests:  |

AI source leads: 22. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":["aquabatics"],"abilities":["gravitycontrol"],"items":[]}`.
