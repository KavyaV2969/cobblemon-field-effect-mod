# Fairy Tale Field

Original ID: `FAIRYTALE`; datapack ID: `rejuvenation:fairytale`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "Once upon a time..."

Nature Power: `secretsword`. Secret Power animation/reference move: `slash`.

Secret Power actual secondary choices: `[{"status":"slp"}]`.

Mimicry type: `Fairy`; Burmy cloak reference: `PLANTCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"magicalseed","effect":"protect","duration":"KingsShield","message":"The Magical Seed shielded {1} against damage!","stats":{}}`. Seed actions: `null`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `null` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The terrain returned to normal."`.

Shared stat pools: `null`. Absorber policies: `null`. Indirect immunity: `null`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"soulheart":{"onAnyFaint":{"mode":"replace","condition":{"always":true},"actions":[{"op":"boost","stats":{"spa":1,"spd":1}}],"source":"Battler.rb:1400"}},"dauntlessshield":{"onStart":{"mode":"replace","condition":{"always":true},"actions":[{"op":"boost","stats":{"def":1,"spd":1},"message":"The fighting master's shield protects {1}!"}],"source":"Battler.rb:3219"}},"intrepidsword":{"onStart":{"mode":"replace","condition":{"always":true},"actions":[{"op":"boost","stats":{"atk":1,"spa":1},"message":"The fairy king's sword empowered {1}!"}],"source":"Battler.rb:3219"}},"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":5,"extendedBy":3,"blockEverstone":false}],"source":"Battler.rb:3926"}}}`. Inactive abilities: `null`. Status type bypass: `null`.

Field form typing: `["arceus","silvally"]`. Custom volatile rules: `null`. Rampage policy: `null`.

Progression: `null`. Party roles: `null`.

Field clock policy: `null`.

Fields persist for the battle unless transformed/destroyed. Move/ability terrain creation uses its own finite duration; engine stack restoration and overlay clocks are described in ARCHITECTURE.md.

## Core move rules

| Move ID | Executable properties and exact source text |
|---|---|
| `smartstrike` | {"multiplier":1.5,"message":"The blade cuts true!"} |
| `magicalleaf` | {"multiplier":1.5,"message":"The magical energy strengthened the attack!"} |
| `mysticalfire` | {"multiplier":1.5,"message":"The magical energy strengthened the attack!"} |
| `ancientpower` | {"multiplier":1.5,"message":"The magical energy strengthened the attack!"} |
| `relicsong` | {"multiplier":1.5,"message":"The magical energy strengthened the attack!"} |
| `sparklingaria` | {"multiplier":1.5,"message":"The magical energy strengthened the attack!"} |
| `moongeistbeam` | {"multiplier":1.5,"message":"The magical energy strengthened the attack!"} |
| `fleurcannon` | {"multiplier":1.5,"message":"The magical energy strengthened the attack!"} |
| `behemothbash` | {"multiplier":1.5,"message":"The shield strikes true!"} |
| `oceanicoperetta` | {"multiplier":1.5,"message":"The magical energy strengthened the attack!"} |
| `menacingmoonrazemaelstrom` | {"multiplier":1.5,"message":"The magical energy strengthened the attack!"} |
| `eeriespell` | {"multiplier":1.5,"message":"The magical energy strengthened the attack!"} |
| `armorcannon` | {"multiplier":1.5,"message":"The magical energy strengthened the attack!"} |
| `drainingkiss` | {"multiplier":2.0,"message":"True love never hurt so badly!"} |
| `mistball` | {"multiplier":2.0,"message":"The magical energy strengthened the attack!"} |
| `magicpowder` | {"additionalType":"FAIRY"} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Steel"} | {"condition":{"always":true},"multiplier":1.5,"message":"For justice!"} |
| {"moveType":"Fairy"} | {"condition":{"always":true},"multiplier":1.5,"message":"For ever after!"} |
| {"flag":"slicing"} | {"condition":{"always":true},"multiplier":1.5,"message":"The blade cuts true!"} |
| {"moveType":"Dragon"} | {"condition":{"always":true},"multiplier":2.0,"message":"The foul beast's attack gained strength!"} |
| {"moveType":"Fire"} | {"condition":{"always":true},"additionalType":"DRAGON"} |

## Type-chart exceptions

| Attacking type | Defending type | Result exponent / immunity | Condition |
|---|---|---|---|
| "Steel" | "Dragon" | 1 | {"always":true} |

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "switchIn" | {"ability":{"who":"user","values":["armortail","battlearmor","shellarmor","stancechange"]}} | [{"op":"boost","stats":{"def":1}}] | "Battler.rb:2140" |
| "switchIn" | {"ability":{"who":"user","values":["magicguard","magicbounce","mirrorarmor","pastelveil"]}} | [{"op":"boost","stats":{"spd":1}}] | "Battler.rb:2149" |
| "switchIn" | {"ability":{"who":"user","values":["powerofalchemy"]}} | [{"op":"boost","stats":{"def":1,"spd":1}}] | "Battler.rb:2157" |
| "switchIn" | {"ability":{"who":"user","values":["magician"]}} | [{"op":"boost","stats":{"spa":1}}] | "Battler.rb:2165" |
| "accuracy" | {"ability":{"who":"user","values":["fairyaura"]}} | [{"op":"set","value":true}] | "Battle_Move.rb:876" |
| "damage" | {"ability":{"who":"user","values":["queenlymajesty"]}} | [{"op":"multiply","value":1.5}] | "Battle_Move.rb:1611" |
| "modifyMove" | {"any":[{"move":"sacredsword"},{"move":"cut"},{"move":"slash"},{"move":"secretsword"}]} | [{"op":"moveType","type":"Steel"}] | "Battle_Move.rb:257" |
| "modifyMove" | {"move":"strangesteam"} | [{"op":"secondaryChance","chance":100}] | "Battle_Move.rb:2336" |
| "modifyMove" | {"move":"magicpowder"} | [{"op":"moveBehavior","recipe":"setTypes","types":["Psychic","Fairy"],"message":"{1} became Psychic/Fairy type!"}] | "Battle_MoveEffects.rb:8463" |
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
| "formChange" | {"all":[{"species":{"who":"user","value":"aegislash"}},{"ability":{"who":"user","values":["stancechange"]}},{"formName":{"who":"user","value":"Blade"}}]} | [{"op":"message","text":"Changed to Blade Forme!"},{"op":"boost","stats":{"atk":1,"def":-1}}] | "Battler.rb:1696-1701" |
| "formChange" | {"all":[{"species":{"who":"user","value":"aegislash"}},{"ability":{"who":"user","values":["stancechange"]}},{"formName":{"who":"user","value":""}}]} | [{"op":"message","text":"Changed to Shield Forme!"},{"op":"boost","stats":{"atk":-1,"def":1}}] | "Battler.rb:1696-1701" |
| "modifyMove" | {"move":"miracleeye"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"boost","stats":{"spa":2}}]}] | "Battle_MoveEffects.rb:3682" |
| "modifyMove" | {"all":[{"move":"mist"},{"not":{"sideCondition":"mist"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"createField","field":"rejuvenation:misty_terrain","duration":3,"extendedBy":3,"message":"Mist swirled around the battlefield!"}]}] | "Battle_MoveEffects.rb:1817" |
| "modifyMove" | {"move":"swordsdance"} | [{"op":"moveProperty","path":"boosts","value":{"atk":3}}] | "Battle_MoveEffects.rb:1050" |
| "modifyMove" | {"move":"acidarmor"} | [{"op":"moveProperty","path":"boosts","value":{"def":3}}] | "Battle_MoveEffects.rb:1069" |
| "afterMove" | {"move":"wish"} | [{"op":"adjustWish","fraction":0.75}] | "Battle_MoveEffects.rb:5214" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "modifyMove" | {"move":"forestscurse"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"volatile","id":"curse","who":"target"}]}] | "Battle_MoveEffects.rb:7415" |
| "modifyMove" | {"move":"craftyshield"} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"boost","stats":{"def":1,"spd":1}},{"op":"message","text":"{1} boosted its defenses with the shield!"}]}] | "Battle_MoveEffects.rb:7545" |
| "modifyMove" | {"move":"flowershield"} | [{"op":"moveBehavior","recipe":"allActiveHitActions","condition":{"any":[{"type":{"who":"target","value":"Grass"}},{"samePokemon":true}]},"actions":[{"op":"conditional","condition":{"samePokemon":true},"actions":[{"op":"boost","who":"target","stats":{"def":1,"spd":1}}]},{"op":"conditional","condition":{"not":{"samePokemon":true}},"actions":[{"op":"boost","who":"target","stats":{"def":1}}]}]}] | "Battle_MoveEffects.rb:7560" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |

## Original status-move highlights

Source UI buff highlights: `["kingsshield","craftyshield","flowershield","acidarmor","nobleroar","swordsdance","wish","healingwish","miracleeye","forestscurse","floralhealing"]`.

Source UI nerf highlights: `[]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["acidarmor","floralhealing","miracleeye","swordsdance"],"unreviewedHighlightedMoves":["craftyshield","flowershield","forestscurse","healingwish","kingsshield","nobleroar","wish"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Battle.rb:8004 | [:FAIRYTALE, :STARLIGHT].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:8009 | [:FAIRYTALE, :STARLIGHT].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:871 | :FAIRYTALE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Inspect.rb:8 | (self.ability == :QUEENLYMAJESTY && [:CHESS, :FAIRYTALE].include?(@battle.FE)) \|\| (@battle.FE == :CHESS && self.piece == :QUEEN) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:262 | :FAIRYTALE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:457 | @battle.FE == :FAIRYTALE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:876 | [:NOGUARD, :HOTSHOT, :DEFRAGMENT].include?(attacker.ability) \|\| [:NOGUARD, :HOTSHOT].include?(opponent.ability) \|\| (attacker.ability == :FAIRYAURA && @battle.FE == :FAIRYTALE) \|\| (attacker.ability == :DARKAURA && @battle.FE == :DEUXFINALIS) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:954 | [:NOGUARD, :HOTSHOT].include?(attacker.ability) \|\| [:NOGUARD, :HOTSHOT].include?(opponent.ability) \|\| (attacker.ability == :FAIRYAURA && @battle.FE == :FAIRYTALE) \|\| (attacker.ability == :DARKAURA && @battle.FE == :DEUXFINALIS) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1590 | @battle.FE == :FAIRYTALE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1615 | @battle.FE == :FAIRYTALE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1724 | opponent.ability == :MARVELSCALE && (!opponent.status.nil? \|\| [:MISTY, :RAINBOW, :FAIRYTALE, :DRAGONSDEN, :STARLIGHT, :DEUXFINALIS].include?(@battle.FE) \|\| @battle.OV == :MISTY) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:2332 | @move == :STRANGESTEAM && @battle.FE == :FAIRYTALE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:559 | @battle.FE == :FAIRYTALE && @move == :SWEETKISS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1050 | @move == :SWORDSDANCE && [:BIGTOP, :FAIRYTALE, :COLOSSEUM, :DANCEFLOOR].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1069 | @move == :ACIDARMOR && ([:CORROSIVE, :CORROSIVEMIST, :MURKWATERSURFACE, :FAIRYTALE].include?(@battle.FE) \|\| @battle.ProgressiveFieldCheck(PBFields::CONCERT)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:3682 | [:HOLY, :FAIRYTALE, :PSYTERRAIN].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:5214 | [:MISTY, :RAINBOW, :HOLY, :FAIRYTALE, :STARLIGHT].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7137 | [:FAIRYTALE, :DRAGONSDEN].include?(@battle.FE) && @move == :NOBLEROAR | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7152 | @battle.FE == :FAIRYTALE && @move == :DRAININGKISS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7415 | [:FOREST, :FAIRYTALE, :BEWITCHED].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7545 | @battle.FE == :FAIRYTALE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7560 | opponent.hasType?(:GRASS) \|\| (opponent == attacker && (@battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 2, 5) \|\| @battle.FE == :FAIRYTALE)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7561 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 2, 5) \|\| (opponent == attacker && @battle.FE == :FAIRYTALE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7572 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 2, 5) \|\| (opponent == attacker && @battle.FE == :FAIRYTALE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7890 | [:GRASSY, :FAIRYTALE].include?(@battle.FE) \|\|<br>       @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 3, 5) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8451 | opponent.types(excludeReflector: true) == [:PSYCHIC] && !(@battle.FE == :FAIRYTALE) | implemented_and_tested | Magic Powder type-change failure compares both type orders. Fairy Tale can add Fairy to a pure Psychic target, rejects existing Psychic/Fairy, retains native type-change eligibility, and replaces only canonical type text. Tests: Fairy Tale Magic Powder compares both type orders and can add Fairy to Psychic |
| Battle_MoveEffects.rb:8455 | opponent.types(excludeReflector: true).sort == [:FAIRY, :PSYCHIC] && @battle.FE == :FAIRYTALE | implemented_and_tested | Magic Powder type-change failure compares both type orders. Fairy Tale can add Fairy to a pure Psychic target, rejects existing Psychic/Fairy, retains native type-change eligibility, and replaces only canonical type text. Tests: Fairy Tale Magic Powder compares both type orders and can add Fairy to Psychic |
| Battle_MoveEffects.rb:8463 | @battle.FE == :FAIRYTALE | implemented_and_tested | Magic Powder type-change failure compares both type orders. Fairy Tale can add Fairy to a pure Psychic target, rejects existing Psychic/Fairy, retains native type-change eligibility, and replaces only canonical type text. Tests: Fairy Tale Magic Powder compares both type orders and can add Fairy to Psychic |
| Battler.rb:1400 | [:MISTY, :RAINBOW, :FAIRYTALE].include?(@battle.FE) | implemented_and_tested | Soul-Heart adds Special Defense alongside Special Attack on Misty/Rainbow/Fairy Tale, and Attack alongside Special Attack on Deux Finalis; no double native Special Attack boost. Tests: Soul-Heart gains the source defensive or offensive second stat |
| Battler.rb:1698 | @battle.FE == :FAIRYTALE \|\| (Rejuv && @battle.FE == :CHESS) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2140 | @battle.FE == :FAIRYTALE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2916 | @battle.FE == :FAIRYTALE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:3219 | [:FAIRYTALE, :COLOSSEUM].include?(@battle.FE) | implemented_and_tested | Dauntless Shield and Intrepid Sword grant paired defensive/offensive stats on Fairy Tale/Colosseum on every source entry activation; the ordinary once-per-battle native boost remains separate outside those fields. Tests: Fairy Tale and Colosseum sword and shield activate paired stats on each entry |
| Battler.rb:3238 | [:FAIRYTALE, :COLOSSEUM].include?(@battle.FE) | implemented_and_tested | Dauntless Shield and Intrepid Sword grant paired defensive/offensive stats on Fairy Tale/Colosseum on every source entry activation; the ordinary once-per-battle native boost remains separate outside those fields. Tests: Fairy Tale and Colosseum sword and shield activate paired stats on each entry |
| Battler.rb:5304 | [:FAIRYTALE, :CHESS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:5507 | [:FAIRYTALE, :CHESS, :COLOSSEUM].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7300 | self.ability == :MARVELSCALE && (!self.status.nil? \|\| [:MISTY, :RAINBOW, :FAIRYTALE, :DRAGONSDEN, :STARLIGHT, :DEUXFINALIS].include?(@battle.FE)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Rejuv/Battle/Battler.rb:33 | self.ability == :STANCECHANGE && (@battle.FE == :FAIRYTALE \|\| (Rejuv && @battle.FE == :CHESS)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Rejuv/Battle/Battler.rb:62 | self.ability == :STANCECHANGE && (@battle.FE == :FAIRYTALE \|\| (Rejuv && @battle.FE == :CHESS)) | excluded_crest | This field stat change is inside the explicitly Zoroark-crested illusion stance branch. Ordinary Aegislash Stance Change has separate rules and regression coverage. Tests:  |

AI source leads: 42. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":[],"abilities":["gravitycontrol"],"items":[]}`.
