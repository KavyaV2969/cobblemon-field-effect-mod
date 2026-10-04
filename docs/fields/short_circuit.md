# Short-Circuit Field

Original ID: `SHORTCIRCUIT`; datapack ID: `rejuvenation:short_circuit`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "Bzzt!"

Nature Power: `discharge`. Secret Power animation/reference move: `electroball`.

Secret Power actual secondary choices: `[{"status":"par"}]`.

Mimicry type: `Electric`; Burmy cloak reference: `TRASHCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"syntheticseed","effect":"magnetrise","duration":5,"message":"{1} levitated with electromagnetism!","stats":{"spd":1}}`. Seed actions: `null`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":8,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `{"cobblemon:dusk_ball":3.5}` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The terrain returned to normal."`.

Shared stat pools: `null`. Absorber policies: `{"lightningrod":{"type":"Electric","stat":"spa","boosts":[1,2,0,1,3],"cycle":true,"maximizeOverlay":"rejuvenation:electric_terrain","source":"Battler.rb:5552-5567"},"motordrive":{"type":"Electric","stat":"spe","boosts":[1,2,0,1,3],"cycle":true,"maximizeOverlay":"rejuvenation:electric_terrain","source":"Battler.rb:5574-5583"},"voltabsorb":{"type":"Electric","healFractions":[0.2,0.375,0.125,0.3,0.5],"cycle":true,"maximizeOverlay":"rejuvenation:electric_terrain","source":"Battler.rb:5587-5595"}}`. Indirect immunity: `null`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"static":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"conditional","condition":{"all":[{"contact":{"who":"target"}},{"chance":{"numerator":6,"denominator":10}}]},"actions":[{"op":"status","who":"target","status":"par"}]}],"source":"Battler.rb:3669"}},"download":{"onStart":{"mode":"replace","condition":{"always":true},"actions":[{"op":"boost","stats":{"atk":1,"spa":1},"message":"{1} is glitching out!","messagePlacement":"before"}],"source":"Battler.rb:3126"}},"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":5,"extendedBy":3,"blockEverstone":false}],"source":"Battler.rb:3926"}}}`. Inactive abilities: `null`. Status type bypass: `null`.

Field form typing: `["arceus","silvally"]`. Custom volatile rules: `null`. Rampage policy: `null`.

Progression: `null`. Party roles: `null`.

Field clock policy: `null`.

Fields persist for the battle unless transformed/destroyed. Move/ability terrain creation uses its own finite duration; engine stack restoration and overlay clocks are described in ARCHITECTURE.md.

## Core move rules

| Move ID | Executable properties and exact source text |
|---|---|
| `steelbeam` | {"multiplier":1.667,"additionalType":"ELECTRIC"} |
| `dazzlinggleam` | {"multiplier":1.5,"message":"Blinding!"} |
| `surf` | {"multiplier":1.5,"additionalType":"ELECTRIC","message":"The attack picked up electricity!"} |
| `muddywater` | {"multiplier":1.5,"additionalType":"ELECTRIC","message":"The attack picked up electricity!"} |
| `magnetbomb` | {"multiplier":1.5,"additionalType":"ELECTRIC","message":"The attack picked up electricity!"} |
| `gyroball` | {"multiplier":1.5,"additionalType":"ELECTRIC","message":"The attack picked up electricity!"} |
| `flashcannon` | {"multiplier":1.5,"additionalType":"ELECTRIC","message":"Blinding!"} |
| `geargrind` | {"multiplier":1.5,"additionalType":"ELECTRIC","message":"The attack picked up electricity!"} |
| `hydrovortex` | {"multiplier":1.5,"message":"The attack picked up electricity!"} |
| `ultramegadeath` | {"multiplier":1.5,"message":"CHARGING UP!","counter":{"index":1,"amount":2,"maximum":2,"message":null},"transition":{"field":"rejuvenation:factory","condition":{"all":[{"counter":{"index":1,"op":">","value":1}},{"not":{"all":[{"move":"ultramegadeath"},{"category":"Physical"}]}}]},"push":false,"message":"SYSTEM ONLINE."}} |
| `luminacrash` | {"multiplier":1.5,"message":"Blinding!"} |
| `darkpulse` | {"multiplier":1.3,"message":"The darkness strengthened the attack!"} |
| `nightdaze` | {"multiplier":1.3,"message":"The darkness strengthened the attack!"} |
| `nightslash` | {"multiplier":1.3,"message":"The darkness strengthened the attack!"} |
| `shadowball` | {"multiplier":1.3,"message":"The darkness strengthened the attack!"} |
| `shadowpunch` | {"multiplier":1.3,"message":"The darkness strengthened the attack!"} |
| `shadowclaw` | {"multiplier":1.3,"message":"The darkness strengthened the attack!"} |
| `shadowsneak` | {"multiplier":1.3,"message":"The darkness strengthened the attack!"} |
| `shadowforce` | {"multiplier":1.3,"message":"The darkness strengthened the attack!"} |
| `shadowbone` | {"multiplier":1.3,"message":"The darkness strengthened the attack!"} |
| `phantomforce` | {"multiplier":1.3,"message":"The darkness strengthened the attack!"} |
| `lightthatburnsthesky` | {"multiplier":0.5,"message":"{2} couldn't consume much light..."} |
| `zapcannon` | {"accuracy":80} |
| `tidyup` | {"counter":{"index":1,"amount":1,"maximum":2,"message":"Some junk was cleaned up!"},"transition":{"field":"rejuvenation:factory","condition":{"all":[{"counter":{"index":1,"op":">","value":1}},{"not":{"all":[{"move":"ultramegadeath"},{"category":"Physical"}]}}]},"push":false,"message":"SYSTEM ONLINE."}} |
| `aurawheel` | {"counter":{"index":1,"amount":2,"maximum":2,"message":null},"transition":{"field":"rejuvenation:factory","condition":{"all":[{"counter":{"index":1,"op":">","value":1}},{"not":{"all":[{"move":"ultramegadeath"},{"category":"Physical"}]}}]},"push":false,"message":"SYSTEM ONLINE."}} |
| `paraboliccharge` | {"counter":{"index":1,"amount":2,"maximum":2,"message":null},"transition":{"field":"rejuvenation:factory","condition":{"all":[{"counter":{"index":1,"op":">","value":1}},{"not":{"all":[{"move":"ultramegadeath"},{"category":"Physical"}]}}]},"push":false,"message":"SYSTEM ONLINE."}} |
| `wildcharge` | {"counter":{"index":1,"amount":2,"maximum":2,"message":null},"transition":{"field":"rejuvenation:factory","condition":{"all":[{"counter":{"index":1,"op":">","value":1}},{"not":{"all":[{"move":"ultramegadeath"},{"category":"Physical"}]}}]},"push":false,"message":"SYSTEM ONLINE."}} |
| `chargebeam` | {"counter":{"index":1,"amount":2,"maximum":2,"message":null},"transition":{"field":"rejuvenation:factory","condition":{"all":[{"counter":{"index":1,"op":">","value":1}},{"not":{"all":[{"move":"ultramegadeath"},{"category":"Physical"}]}}]},"push":false,"message":"SYSTEM ONLINE."}} |
| `iondeluge` | {"counter":{"index":1,"amount":2,"maximum":2,"message":null},"transition":{"field":"rejuvenation:factory","condition":{"all":[{"counter":{"index":1,"op":">","value":1}},{"not":{"all":[{"move":"ultramegadeath"},{"category":"Physical"}]}}]},"push":false,"message":"SYSTEM ONLINE."}} |
| `gigavolthavoc` | {"counter":{"index":1,"amount":2,"maximum":2,"message":null},"transition":{"field":"rejuvenation:factory","condition":{"all":[{"counter":{"index":1,"op":">","value":1}},{"not":{"all":[{"move":"ultramegadeath"},{"category":"Physical"}]}}]},"push":false,"message":"SYSTEM ONLINE."}} |
| `discharge` | {"counter":{"index":1,"amount":2,"maximum":2,"message":null},"transition":{"field":"rejuvenation:factory","condition":{"all":[{"counter":{"index":1,"op":">","value":1}},{"not":{"all":[{"move":"ultramegadeath"},{"category":"Physical"}]}}]},"push":false,"message":"SYSTEM ONLINE."}} |
| `overdrive` | {"counter":{"index":1,"amount":2,"maximum":2,"message":null},"transition":{"field":"rejuvenation:factory","condition":{"all":[{"counter":{"index":1,"op":">","value":1}},{"not":{"all":[{"move":"ultramegadeath"},{"category":"Physical"}]}}]},"push":false,"message":"SYSTEM ONLINE."}} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "basePower" | {"moveType":"Electric"} | [{"op":"cyclePower","values":[0.8,1.5,0.5,1.2,2],"maximize":{"overlay":"rejuvenation:electric_terrain"},"messages":["Bzzt.","Bzzapp!","Bzt...","Bzap!","BZZZAPP!"]}] | "Battle_Field.rb:85; Battle_Move.rb:1954" |
| "modifyMove" | {"all":[{"moveType":"Steel"},{"ability":{"who":"user","values":["steelworker"]}}]} | [{"op":"extraType","values":["Electric"]}] | "Battle_Move.rb:804" |
| "residual" | {"ability":{"who":"user","values":["voltabsorb"]}} | [{"op":"heal","fraction":0.0625,"message":"{1} absorbed stray electricity!"}] | "Battle.rb:5850-6109" |
| "speed" | {"ability":{"who":"user","values":["surgesurfer"]}} | [{"op":"multiply","value":2}] | "Battle_Effects.rb:1442" |
| "modifyMove" | {"move":"steelbeam"} | [{"op":"moveBehavior","recipe":"payHP","fraction":1,"callback":"onAfterMove","round":true,"respectMagicGuard":true}] | "Battle_MoveEffects.rb:8268" |
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
| "chargeMove" | {"move":"phantomforce"} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4850" |
| "chargeMove" | {"move":"shadowforce"} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4850" |
| "chargeMove" | {"all":[{"move":"razorwind"},{"overlay":"rejuvenation:grassy_terrain"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4430" |
| "chargeMove" | {"all":[{"any":[{"move":"solarbeam"},{"move":"solarblade"}]},{"overlay":"rejuvenation:rainbow"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4472" |
| "modifyMove" | {"all":[{"move":"mist"},{"not":{"sideCondition":"mist"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"createField","field":"rejuvenation:misty_terrain","duration":3,"extendedBy":3,"message":"Mist swirled around the battlefield!"}]}] | "Battle_MoveEffects.rb:1817" |
| "modifyMove" | {"move":"flash"} | [{"op":"moveProperty","path":"boosts","value":{"accuracy":-2}}] | "Battle_MoveEffects.rb:1503" |
| "modifyMove" | {"move":"metalsound"} | [{"op":"moveProperty","path":"boosts","value":{"spd":-3}}] | "Battle_MoveEffects.rb:1688" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["gulpmissile"]}},{"species":{"who":"user","value":"cramorant"}},{"formName":{"who":"user","value":"Gulping"}}]} | [{"op":"form","species":"cramorantgorging"}] | "Battler.rb:1720-1729" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |

## Original status-move highlights

Source UI buff highlights: `["flash","metalsound","magnetrise"]`.

Source UI nerf highlights: `[]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["flash","metalsound"],"unreviewedHighlightedMoves":["magnetrise"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Balls.rb:166 | PBDayNight.isNight?(pbGetTimeNow) \|\| [:DARKCRYSTALCAVERN, :SHORTCIRCUIT, :UNDERWATER, :CAVE, :CRYSTALCAVERN, :DRAGONSDEN, :STARLIGHT, :NEWWORLD, :INVERSE].include?(battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:5841 | [:ELECTERRAIN, :SHORTCIRCUIT].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:5842 | i.ability == :VOLTABSORB && i.canHeal? && (@field.effect == :SHORTCIRCUIT \|\| Rejuv) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:1444 | [:ELECTERRAIN, :SHORTCIRCUIT].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Inspect.rb:422 | [:CRYSTALCAVERN, :SHORTCIRCUIT].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Inspect.rb:423 | @battle.FE == :SHORTCIRCUIT && @battle.OV == :ELECTERRAIN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Inspect.rb:426 | @battle.FE == :SHORTCIRCUIT | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:805 | :SHORTCIRCUIT | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1250 | @battle.FE == :SHORTCIRCUIT | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1413 | :SHORTCIRCUIT | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1496 | [:PLUS, :MINUS].include?(attacker.pbPartner.ability) \|\| @battle.FE == :SHORTCIRCUIT \|\| (Rejuv && (@battle.FE == :ELECTERRAIN \|\| @battle.OV == :ELECTERRAIN)) \|\| (attacker.crested == :MINUN && attacker.ability == :MINUS) \|\|<br>          (attacker.crested == :PLUSLE && attacker.ability == :PLUS) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1696 | [:PLUS, :MINUS].include?(opponent.pbPartner.ability) \|\| @battle.FE == :SHORTCIRCUIT \|\| (Rejuv && (@battle.FE == :ELECTERRAIN \|\| @battle.OV == :ELECTERRAIN)) \|\| (opponent.crested == :MINUN && opponent.ability == :MINUS) \|\|<br>          (opponent.crested == :PLUSLE && opponent.ability == :PLUS) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1503 | [:SHORTCIRCUIT, :DARKCRYSTALCAVERN, :MIRROR, :STARLIGHT, :NEWWORLD, :DARKNESS1].include?(@battle.FE) && @move == :FLASH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1688 | @move == :METALSOUND && ([:FACTORY, :SHORTCIRCUIT].include?(@battle.FE) \|\| @battle.ProgressiveFieldCheck(PBFields::CONCERT)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:4850 | (Rejuv && [:DIMENSIONAL, :FROZENDIMENSION, :HAUNTED, :SHORTCIRCUIT, :DEUXFINALIS].include?(@battle.FE)) \|\| @battle.ProgressiveFieldCheck(PBFields::DARKNESS, 2, 3) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6847 | [:ELECTERRAIN, :FACTORY, :SHORTCIRCUIT].include?(@battle.FE) \|\| @battle.OV == :ELECTERRAIN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8268 | @battle.FE == :SHORTCIRCUIT && @move == :STEELBEAM | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:1723 | [:ELECTERRAIN, :FACTORY, :SHORTCIRCUIT].include?(@battle.FE) | implemented_and_tested | Surf/Dive catch form overrides: aquatic fields choose Gulping; electrical/mechanical fields choose Gorging; other fields retain native HP selection. Tests: field Gulp Missile selects its source forme rather than the HP-based native forme |
| Battler.rb:3127 | Rejuv && [:SHORTCIRCUIT, :GLITCH].include?(@battle.FE) | implemented_and_tested | Glitch/Short Circuit Download grants both offensive boosts; Factory/City/Back Alley grant two stages of the stat chosen from summed opposing stage-adjusted raw defenses. Tests: Download amplification replaces native boosting and compares both opposing defense stats |
| Battler.rb:3167 | Rejuv && [:SHORTCIRCUIT, :GLITCH].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:3669 | @battle.FE == :SHORTCIRCUIT \|\| (Rejuv && @battle.FE == :ELECTERRAIN) | implemented_and_tested | Electric Terrain/Short Circuit contact Static probability becomes 60 percent. Tests: Static doubles its contact paralysis chance on the electric fields |
| Battler.rb:5558 | (Rejuv && @battle.FE == :SHORTCIRCUIT) && target.ability == :LIGHTNINGROD | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:5573 | Rejuv && @battle.FE == :SHORTCIRCUIT | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:5587 | (Rejuv && @battle.FE == :SHORTCIRCUIT) && target.ability == :VOLTABSORB | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7339 | [:MINUS, :PLUS].include?(self.pbPartner.ability) \|\| @battle.FE == :SHORTCIRCUIT \|\| (Rejuv && @battle.FE == :ELECTERRAIN) \|\| @battle.OV == :ELECTERRAIN | requires_behavioral_comparison | Semantic comparison pending Tests:  |

AI source leads: 11. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":["ultramegadeath"],"abilities":["gravitycontrol"],"items":[]}`.
