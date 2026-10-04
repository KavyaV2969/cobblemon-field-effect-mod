# Colosseum

Original ID: `COLOSSEUM`; datapack ID: `rejuvenation:colosseum`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "All eyes are on the combatants!"

Nature Power: `beatup`. Secret Power animation/reference move: `poweruppunch`.

Secret Power actual secondary choices: `[{"self":{"boosts":{"atk":1}}}]`.

Mimicry type: `Steel`; Burmy cloak reference: `SANDYCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"syntheticseed","effect":"taunt","duration":4,"message":"{1} feels taunted!","stats":{"atk":1}}`. Seed actions: `null`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{},"statLoss":{},"immuneAbilities":["magicguard","wonderguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `null` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The terrain returned to normal."`.

Shared stat pools: `null`. Absorber policies: `null`. Indirect immunity: `["wonderguard"]`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"dauntlessshield":{"onStart":{"mode":"replace","condition":{"always":true},"actions":[{"op":"boost","stats":{"def":1,"spd":1},"message":"The fighting master's shield protects {1}!"}],"source":"Battler.rb:3219"}},"intrepidsword":{"onStart":{"mode":"replace","condition":{"always":true},"actions":[{"op":"boost","stats":{"atk":1,"spa":1},"message":"The fairy king's sword empowered {1}!"}],"source":"Battler.rb:3219"}},"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"defiant":{"onAfterEachBoost":{"mode":"replace","condition":{"all":[{"statsLowered":true},{"not":{"samePokemon":true}}]},"actions":[{"op":"boost","stats":{"atk":2,"def":2}}],"source":"Battler.rb:900"}},"competitive":{"onAfterEachBoost":{"mode":"replace","condition":{"all":[{"statsLowered":true},{"not":{"samePokemon":true}}]},"actions":[{"op":"boost","stats":{"spa":2,"spd":2}}],"source":"Battler.rb:900"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":5,"extendedBy":3,"blockEverstone":false}],"source":"Battler.rb:3926"}}}`. Inactive abilities: `null`. Status type bypass: `null`.

Field form typing: `["arceus","silvally"]`. Custom volatile rules: `null`. Rampage policy: `null`.

Progression: `null`. Party roles: `null`.

Field clock policy: `null`.

Fields persist for the battle unless transformed/destroyed. Move/ability terrain creation uses its own finite duration; engine stack restoration and overlay clocks are described in ARCHITECTURE.md.

## Core move rules

| Move ID | Executable properties and exact source text |
|---|---|
| `beatup` | {"multiplier":2.0,"message":"The fighters rallied together!"} |
| `fellstinger` | {"multiplier":2.0,"message":"The coup de grâce!"} |
| `payday` | {"multiplier":2.0,"message":"The audience hurled coins down!"} |
| `reversal` | {"multiplier":2.0,"message":"For Honor!"} |
| `pursuit` | {"multiplier":2.0,"message":"There is no escape!"} |
| `sacredsword` | {"multiplier":1.5,"message":"For Honor!"} |
| `secretsword` | {"multiplier":1.5,"message":"For Honor!"} |
| `submission` | {"multiplier":1.5,"message":"For Honor!"} |
| `meteorassault` | {"multiplier":1.5,"message":"For Honor!"} |
| `smartstrike` | {"multiplier":1.5,"message":"For Honor!"} |
| `smackdown` | {"multiplier":1.5,"message":"For Honor!"} |
| `brutalswing` | {"multiplier":1.5,"message":"For Honor!"} |
| `electroweb` | {"multiplier":1.5,"message":"For Glory!"} |
| `clangoroussoulblaze` | {"multiplier":1.5} |
| `vinewhip` | {"multiplier":1.5,"message":"For Glory!"} |
| `psychocut` | {"multiplier":1.5,"message":"For Glory!"} |
| `nightslash` | {"multiplier":1.5,"message":"For Glory!"} |
| `bonemerang` | {"multiplier":1.5,"message":"For Glory!"} |
| `firstimpression` | {"multiplier":1.5,"message":"For Glory!"} |
| `bonerush` | {"multiplier":1.5,"message":"For Glory!"} |
| `boneclub` | {"multiplier":1.5,"message":"For Glory!"} |
| `leafblade` | {"multiplier":1.5,"message":"For Glory!"} |
| `payback` | {"multiplier":1.5,"message":"For Glory!"} |
| `punishment` | {"multiplier":1.5,"message":"For Glory!"} |
| `meteormash` | {"multiplier":1.5,"message":"For Glory!"} |
| `bulletpunch` | {"multiplier":1.5,"message":"For Glory!"} |
| `clangingscales` | {"multiplier":1.5,"message":"For Glory!"} |
| `steamroller` | {"multiplier":1.5,"message":"For Glory!"} |
| `stormthrow` | {"multiplier":1.2,"message":"For Honor!"} |
| `woodhammer` | {"multiplier":1.2,"message":"For Glory!"} |
| `dragonhammer` | {"multiplier":1.2,"message":"For Glory!"} |
| `powerwhip` | {"multiplier":1.2,"message":"For Glory!"} |
| `spiritshackle` | {"multiplier":1.2,"message":"For Glory!"} |
| `drillrun` | {"multiplier":1.2,"message":"For Glory!"} |
| `drillpeck` | {"multiplier":1.2,"message":"For Glory!"} |
| `icehammer` | {"multiplier":1.2,"message":"For Glory!"} |
| `iciclespear` | {"multiplier":1.2,"message":"For Glory!"} |
| `anchorshot` | {"multiplier":1.2,"message":"For Glory!"} |
| `crabhammer` | {"multiplier":1.2,"message":"For Glory!"} |
| `shadowbone` | {"multiplier":1.2,"message":"For Glory!"} |
| `firelash` | {"multiplier":1.2,"message":"For Glory!"} |
| `suckerpunch` | {"multiplier":1.2,"message":"For Glory!"} |
| `throatchop` | {"multiplier":1.2,"message":"For Glory!"} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "switchIn" | {"ability":{"who":"user","values":["battlearmor","shellarmor"]}} | [{"op":"boost","stats":{"def":1}}] | "Battler.rb:2359" |
| "switchIn" | {"ability":{"who":"user","values":["magicguard"]}} | [{"op":"boost","stats":{"spd":1}}] | "Battler.rb:2367" |
| "switchIn" | {"ability":{"who":"user","values":["noguard","justified"]}} | [{"op":"boost","stats":{"atk":1,"spa":1}}] | "Battler.rb:2375" |
| "receivedDamage" | {"ability":{"who":"target","values":["stalwart"]}} | [{"op":"survive","who":"target","message":"{1} endured the hit!"}] | "Battle_Move.rb:2143" |
| "modifyMove" | {"move":"noretreat"} | [{"op":"moveProperty","path":"boosts","value":{"atk":2,"def":2,"spa":2,"spd":2,"spe":2}}] | "Battle_MoveEffects.rb:8396" |
| "criticalRatio" | {"ability":{"who":"target","values":["rattled","wimpout"]}} | [{"op":"set","value":4}] | "Battle_Move.rb:981" |
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
| "modifyMove" | {"move":"roar"} | [{"op":"moveProperty","path":"forceSwitch","value":false},{"op":"moveBehavior","recipe":"arenaRoar","stats":{"atk":2},"message":"{2} stands their ground in the arena!!"}] | "Battle_MoveEffects.rb:5645" |
| "modifyMove" | {"move":"dragontail"} | [{"op":"moveProperty","path":"forceSwitch","value":false}] | "Battle_MoveEffects.rb:5698" |
| "modifyMove" | {"move":"circlethrow"} | [{"op":"moveProperty","path":"forceSwitch","value":false}] | "Battle_MoveEffects.rb:5698" |
| "modifyMove" | {"move":"firstimpression"} | [{"op":"moveProperty","path":"flags.protect","value":0}] | "Battle_MoveEffects.rb:7852" |
| "modifyMove" | {"all":[{"move":"mist"},{"not":{"sideCondition":"mist"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"createField","field":"rejuvenation:misty_terrain","duration":3,"extendedBy":3,"message":"Mist swirled around the battlefield!"}]}] | "Battle_MoveEffects.rb:1817" |
| "modifyMove" | {"move":"howl"} | [{"op":"moveProperty","path":"boosts","value":{"atk":2}}] | "Battle_MoveEffects.rb:754" |
| "modifyMove" | {"move":"swordsdance"} | [{"op":"moveProperty","path":"boosts","value":{"atk":3}}] | "Battle_MoveEffects.rb:1050" |
| "modifyMove" | {"move":"flatter"} | [{"op":"moveProperty","path":"boosts","value":{"spa":2}}] | "Battle_MoveEffects.rb:1324" |
| "modifyMove" | {"move":"swagger"} | [{"op":"moveProperty","path":"boosts","value":{"atk":3}}] | "Battle_MoveEffects.rb:1343" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |

## Original status-move highlights

Source UI buff highlights: `["swordsdance","kingsshield","howl","noretreat","roar","swagger","flatter"]`.

Source UI nerf highlights: `["whirlwind"]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["howl","noretreat","roar","swordsdance"],"unreviewedHighlightedMoves":["flatter","kingsshield","swagger","whirlwind"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Battle.rb:887 | @field.effect == :COLOSSEUM | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:1538 | @battle.FE == :COLOSSEUM | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:1832 | @shiftStyle && !isOnline? && @internalbattle && @battle.FE != :COLOSSEUM && !@doublebattle && !@controlPlayer && !pbIsWild? && switchers.any? { \|i\| pbIsOpposing?(i) } && !switchers.include?(0) && pbCanChooseNonActive?(0) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:5037 | @choices[i.index][0] == :switch && !(@field.effect == :COLOSSEUM) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:880 | :COLOSSEUM | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:902 | @battle.FE == :COLOSSEUM && pbCanIncreaseStatStage?(PBStats::DEFENSE, self, nil) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:917 | @battle.FE == :COLOSSEUM && pbCanIncreaseStatStage?(PBStats::SPDEF, self, nil) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:981 | [:RATTLED, :WIMPOUT].include?(opponent.ability) && @battle.FE == :COLOSSEUM | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1618 | @battle.FE == :COLOSSEUM && (@function == 0xC0 \|\| @function == 0x307 \|\| (attacker.crested == :CINCCINO && attacker.effects[:CincCrest])) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:2143 | damage == hpTotal && opponent.ability == :STALWART && @battle.FE == :COLOSSEUM && !opponent.moldbroken | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:754 | (@battle.FE == :COLOSSEUM \|\| @battle.ProgressiveFieldCheck(PBFields::CONCERT)) && @move == :HOWL | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1050 | @move == :SWORDSDANCE && [:BIGTOP, :FAIRYTALE, :COLOSSEUM, :DANCEFLOOR].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1324 | @battle.FE == :COLOSSEUM | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1343 | @battle.FE == :COLOSSEUM | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2531 | (opponent.ability == :STURDY \|\| (@battle.FE == :COLOSSEUM && opponent.ability == :STALWART)) && !opponent.moldbroken | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:3606 | @battle.FE == :COLOSSEUM | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:5647 | @battle.FE == :COLOSSEUM | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:5659 | @move == :ROAR && (@battle.FE == :COLOSSEUM \|\| @battle.ProgressiveFieldCheck(PBFields::CONCERT)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:5666 | @battle.FE == :COLOSSEUM | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:5695 | !attacker.isFainted? && !opponent.isFainted? &&<br>       !opponent.damagestate.substitute &&<br>       attacker.canForceSwitchOpponent?(opponent) &&<br>       @battle.FE != :COLOSSEUM | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7852 | @battle.FE == :COLOSSEUM | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8396 | @battle.FE == :COLOSSEUM | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:10035 | @battle.FE == :COLOSSEUM \|\| @battle.ProgressiveFieldCheck(PBFields::CONCERT) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2357 | @battle.FE == :COLOSSEUM | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:3219 | [:FAIRYTALE, :COLOSSEUM].include?(@battle.FE) | implemented_and_tested | Dauntless Shield and Intrepid Sword grant paired defensive/offensive stats on Fairy Tale/Colosseum on every source entry activation; the ordinary once-per-battle native boost remains separate outside those fields. Tests: Fairy Tale and Colosseum sword and shield activate paired stats on each entry |
| Battler.rb:3238 | [:FAIRYTALE, :COLOSSEUM].include?(@battle.FE) | implemented_and_tested | Dauntless Shield and Intrepid Sword grant paired defensive/offensive stats on Fairy Tale/Colosseum on every source entry activation; the ordinary once-per-battle native boost remains separate outside those fields. Tests: Fairy Tale and Colosseum sword and shield activate paired stats on each entry |
| Battler.rb:4109 | @battle.FE == :COLOSSEUM | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:5507 | [:FAIRYTALE, :CHESS, :COLOSSEUM].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:5518 | @battle.FE == :COLOSSEUM | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:6072 | @battle.FE == :COLOSSEUM | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7502 | choice[0] == :switch && @battle.FE == :COLOSSEUM | requires_behavioral_comparison | Semantic comparison pending Tests:  |

AI source leads: 30. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":[],"abilities":["gravitycontrol"],"items":[]}`.
