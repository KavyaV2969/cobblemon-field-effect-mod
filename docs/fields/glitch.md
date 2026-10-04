# Glitch Field

Original ID: `GLITCH`; datapack ID: `rejuvenation:glitch`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "1n!taliz3 .b//////attl3"

Nature Power: `metronome`. Secret Power animation/reference move: `technoblast`.

Secret Power actual secondary choices: `[{"boosts":{"spe":-1}}]`.

Mimicry type: `Qmarks`; Burmy cloak reference: `TRASHCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"syntheticseed","effect":null,"duration":0,"message":"{1}.TYPE = :QMARKS","stats":{"def":1,"spd":1}}`. Seed actions: `[{"op":"type","type":"???"}]`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `null` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The terrain returned to normal."`.

Shared stat pools: `{"offensiveSpecial":["spa","spd"],"defensiveSpecial":["spd","spa"],"source":"Battler.rb:7245-7255; Battle_Move.rb:1461-1470,1625-1652,1758-1769"}`. Absorber policies: `null`. Indirect immunity: `null`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"download":{"onStart":{"mode":"replace","condition":{"always":true},"actions":[{"op":"boost","stats":{"atk":1,"spa":1},"message":"{1} is glitching out!","messagePlacement":"before"}],"source":"Battler.rb:3126"}},"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":5,"extendedBy":3,"blockEverstone":false}],"source":"Battler.rb:3926"}}}`. Inactive abilities: `null`. Status type bypass: `null`.

Field form typing: `["arceus","silvally"]`. Custom volatile rules: `null`. Rampage policy: `null`.

Progression: `null`. Party roles: `null`.

Field clock policy: `null`.

Fields persist for the battle unless transformed/destroyed. Move/ability terrain creation uses its own finite duration; engine stack restoration and overlay clocks are described in ARCHITECTURE.md.

## Core move rules

| Move ID | Executable properties and exact source text |
|---|---|
| `roar` | {"multiplier":0,"message":"ERROR! MOVE NOT FOUND!"} |
| `whirlwind` | {"multiplier":0,"message":"ERROR! MOVE NOT FOUND!"} |
| `blizzard` | {"accuracy":90} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Psychic"} | {"condition":{"always":true},"multiplier":1.2,"message":".0P pl$ nerf!-//"} |

## Type-chart exceptions

| Attacking type | Defending type | Result exponent / immunity | Condition |
|---|---|---|---|
| "Dragon" | "*" | 0 | {"always":true} |
| "Ghost" | "Psychic" | "immune" | {"always":true} |
| "Bug" | "Poison" | 1 | {"always":true} |
| "Poison" | "Bug" | 1 | {"always":true} |
| "Ice" | "Fire" | 0 | {"always":true} |
| "Dark" | "Steel" | -1 | {"always":true} |
| "Ghost" | "Steel" | -1 | {"always":true} |

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "modifyMove" | {"not":{"category":"Status"}} | [{"op":"oldCategory"}] | "Battle_Move.rb:278" |
| "modifyMove" | {"moveType":"Fairy"} | [{"op":"moveType","type":"???"}] | "Battle_Move.rb:259; PBStuff.rb:830 (Rejuv branch: Fairy only)" |
| "criticalRatio" | {"faster":{"stored":true}} | [{"op":"add","value":1}] | "Battle_Move.rb:1008" |
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
| "afterMove" | {"foeFainted":true} | [{"op":"removeVolatile","id":"mustrecharge"}] | "Battler.rb:3741-3745" |
| "defense" | {"move":"explosion"} | [{"op":"multiply","value":0.5}] | "Battle_Move.rb:1749" |
| "defense" | {"move":"selfdestruct"} | [{"op":"multiply","value":0.5}] | "Battle_Move.rb:1749" |
| "tryHit" | {"all":[{"species":{"who":"target","value":"genesect"}},{"attackType":"Electric"},{"item":{"who":"target","values":["shockdrive"]}},{"foe":true}]} | [{"op":"boost","who":"target","stats":{"spe":1}},{"op":"reject"}] | "Battle_Move.rb:605-654; Battler.rb:5569-5615" |
| "tryHit" | {"all":[{"species":{"who":"target","value":"genesect"}},{"attackType":"Water"},{"item":{"who":"target","values":["dousedrive"]}},{"foe":true}]} | [{"op":"heal","who":"target","fraction":0.25,"message":"{1} had its HP restored."},{"op":"reject"}] | "Battle_Move.rb:605-654; Battler.rb:5569-5615" |
| "tryHit" | {"all":[{"species":{"who":"target","value":"genesect"}},{"attackType":"Ice"},{"item":{"who":"target","values":["chilldrive"]}},{"foe":true}]} | [{"op":"heal","who":"target","fraction":0.25,"message":"{1} had its HP restored."},{"op":"reject"}] | "Battle_Move.rb:605-654; Battler.rb:5569-5615" |
| "tryHit" | {"all":[{"species":{"who":"target","value":"genesect"}},{"attackType":"Fire"},{"item":{"who":"target","values":["burndrive"]}},{"foe":true}]} | [{"op":"flashFire","who":"target"},{"op":"message","who":"target","text":"The power of {1}'s Fire-type moves rose!"},{"op":"reject"}] | "Battle_Move.rb:605-654; Battler.rb:5569-5615" |
| "chargeMove" | {"all":[{"move":"razorwind"},{"overlay":"rejuvenation:grassy_terrain"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4430" |
| "chargeMove" | {"all":[{"any":[{"move":"solarbeam"},{"move":"solarblade"}]},{"overlay":"rejuvenation:rainbow"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4472" |
| "modifyMove" | {"always":true} | [{"op":"moveProperty","path":"pranksterBoosted","value":false}] | "Battler.rb:5410" |
| "modifyMove" | {"all":[{"move":"rest"},{"sourceMove":"sleeptalk"},{"pokemonStatus":"slp"}]} | [{"op":"moveBehavior","recipe":"reapplyStatusHeal","status":"slp","duration":3,"fraction":1,"message":"{1} slept and restored its HP!"}] | "Battle_MoveEffects.rb:5266-5294" |
| "modifyMove" | {"all":[{"move":"mist"},{"not":{"sideCondition":"mist"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"createField","field":"rejuvenation:misty_terrain","duration":3,"extendedBy":3,"message":"Mist swirled around the battlefield!"}]}] | "Battle_MoveEffects.rb:1817" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "modifyMove" | {"move":"metronome"} | [{"op":"moveBehavior","recipe":"randomMovePool","minimumPower":70,"choices":["megahorn","attackorder","bugbuzz","xscissor","signalbeam","uturn","leechlife","foulplay","nightdaze","crunch","darkpulse","suckerpunch","nightslash","roaroftime","dracometeor","outrage","dragonrush","spacialrend","dragonpulse","dragonclaw","boltstrike","thunder","volttackle","zapcannon","fusionbolt","thunderbolt","wildcharge","discharge","thunderpunch","voltswitch","closecombat","focusblast","superpower","crosschop","dynamicpunch","hammerarm","jumpkick","aurasphere","sacredsword","skyuppercut","submission","brickbreak","drainpunch","vitalthrow","wakeupslap","blastburn","eruption","overheat","blueflare","fireblast","flareblitz","magmastorm","fusionflare","heatwave","inferno","sacredfire","flamethrower","blazekick","fierydance","lavaplume","firepunch","flameburst","firepledge","skyattack","bravebird","hurricane","aeroblast","fly","bounce","drillpeck","airslash","shadowforce","shadowball","shadowclaw","frenzyplant","leafstorm","petaldance","powerwhip","seedflare","solarbeam","woodhammer","leafblade","energyball","seedbomb","gigadrain","hornleech","grasspledge","earthquake","earthpower","dig","drillrun","blizzard","icebeam","iciclecrash","icepunch","explosion","selfdestruct","gigaimpact","hyperbeam","lastresort","doubleedge","headcharge","megakick","thrash","eggbomb","judgment","skullbash","hypervoice","rockclimb","takedown","uproar","bodyslam","extremespeed","hyperfang","megapunch","razorwind","slam","strength","triattack","crushclaw","chipaway","dizzypunch","facade","headbutt","retaliate","secretpower","slash","smellingsalts","gunkshot","sludgewave","sludgebomb","poisonjab","crosspoison","psychoboost","dreameater","futuresight","psystrike","psychic","extrasensory","psyshock","zenheadbutt","lusterpurge","mistball","psychocut","synchronoise","headsmash","rockwrecker","stoneedge","rockslide","powergem","doomdesire","irontail","meteormash","flashcannon","ironhead","steelwing","hydrocannon","waterspout","hydropump","muddywater","surf","aquatail","crabhammer","dive","scald","waterfall","razorshell","waterpledge","boomburst","dazzlinggleam","flyingpress","freezedry","landswrath","moonblast","mysticalfire","oblivionwing","petalblizzard","phantomforce","playrough","originpulse","precipiceblades","dragonascent","anchorshot","burnup","clangingscales","coreenforcer","darkestlariat","dragonhammer","firelash","firstimpression","highhorsepower","icehammer","liquidation","lunge","pollenpuff","prismaticlaser","psychicfangs","revelationdance","shadowbone","smartstrike","solarblade","sparklingaria","stompingtantrum","throatchop","tropkick","zingzap","multiattack","spiritshackle","snipeshot","jawlock","boltbeak","fishiousrend","scorchingsands","expandingforce","steelroller","meteorbeam","shellsidearm","mistyexplosion","risingvoltage","skittersmack","burningjealousy","lashout","poltergeist","eeriespell","psyshieldbash","mysticalpower","direclaw","springtidestorm","wavecrash","chloroblast","mountaingale","headlongrush","esperwing","bittermalice","triplearrows","bleakwindstorm","wildboltstorm","sandsearstorm","axekick","aquacutter","alluringvoice","aquastep","bitterblade","bloodmoon","electroshot","ficklebeam","flowertrick","gigatonhammer","glaiverush","hydrosteam","icespinner","ivycudgel","kowtowcleave","luminacrash","malignantchain","matchagotcha","mightycleave","psyblade","psychicnoise","spinout","supercellslam","temperflare","terablast","thunderclap","torchsong"]}] | "Battle_MoveEffects.rb:4049" |
| "pokemonEntry" | {"ability":{"who":"user","values":["quarkdrive"]}} | [{"op":"forcedType","type":"???","message":"{1} was corrupted by the rogue data!"}] | "Battler.rb:3157-3163" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"forcedType","type":"???","message":"{1} was corrupted by the rogue data!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"forcedType","type":"???","message":"{1} was corrupted by the rogue data!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |

## Original status-move highlights

Source UI buff highlights: `["metronome"]`.

Source UI nerf highlights: `[]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":[],"unreviewedHighlightedMoves":["metronome"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Battle.rb:1260 | thispkmn.effects[:Rage] && @field.effect == :GLITCH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:549 | @field.effect == :GLITCH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:259 | :GLITCH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:278 | @battle.FE == :GLITCH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:284 | @battle.FE == :GLITCH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:367 | @battle.FE == :GLITCH && attacker.changeSpecialStat(unaware: oppUnaware, attacker: true, moldBrokenArray: moldBrokenArray) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:388 | @battle.FE == :GLITCH && opponent.changeSpecialStat(unaware: attUnaware, attacker: false, moldBrokenArray: moldBrokenArray) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:460 | @battle.FE == :GLITCH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:539 | @battle.FE == :GLITCH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:605 | Rejuv && @battle.FE == :GLITCH && opponent.species == :GENESECT && opponent.hasWorkingItem(:SHOCKDRIVE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:627 | @battle.FE == :GLITCH && opponent.species == :GENESECT && opponent.hasWorkingItem(:DOUSEDRIVE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:632 | Rejuv && @battle.FE == :GLITCH && opponent.species == :GENESECT && opponent.hasWorkingItem(:CHILLDRIVE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:654 | Rejuv && @battle.FE == :GLITCH && opponent.species == :GENESECT && opponent.hasWorkingItem(:BURNDRIVE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:757 | type == :ICE && @battle.FE == :GLITCH && !@battle.inverse? | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1008 | attacker.speed > opponent.speed && @battle.FE == :GLITCH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1101 | !((@move == :VORPALBLADE && @battle.FE == :GLITCH) \|\| (attacker.crested == :ENTEI && type == :FIRE)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1260 | @type == :NORMAL && (type == :FAIRY \|\| (type == :NORMAL && @battle.FE == :GLITCH)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1271 | @type == :NORMAL && (type == :DARK \|\| (!Rejuv && type == :NORMAL && @battle.FE == :GLITCH)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1629 | @battle.FE == :GLITCH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1637 | @battle.FE == :GLITCH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1749 | @battle.FE == :GLITCH && @function == 0xE0 | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2061 | !attacker.hasWorkingItem(:EVERSTONE) && @battle.canChangeFE? && !(@battle.FE == :GLITCH && @battle.field.duration <= 0) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2106 | !attacker.hasWorkingItem(:EVERSTONE) && @battle.canChangeFE? && !(@battle.FE == :GLITCH && @battle.field.duration <= 0) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:4049 | @battle.FE == :GLITCH && move.basedamage < 70 | implemented_and_tested | Glitch Metronome samples uniformly from source MOVEHASH order after PBStuff Metronome blacklist, Shadow-type exclusion and source base-power >=70. Only ordinary IDs registered in the installed simulator are callable; canonical Showdown flags are not substituted for the source blacklist. Tests: Glitch Metronome uses the exact ordinary source pool and its blacklist |
| Battle_MoveEffects.rb:5266 | attacker.status == :SLEEP && attacker.sleeptalkUsed && Rejuv && @battle.FE == :GLITCH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:1854 | self.species == :SILVALLY && [:GLITCH, :HOLY].include?(@battle.FE) | implemented_and_tested | Holy forces ordinary Dark Silvally form 17, not Fairy. Glitch forces unknown typing and source corruption text. The custom unknown-type model/animation is absent; ordinary type semantics execute and item restoration resumes elsewhere. Tests: Holy Silvally uses its native Dark form and Glitch retains unknown typing until restored |
| Battler.rb:1855 | @battle.FE == :GLITCH | implemented_and_tested | Holy forces ordinary Dark Silvally form 17, not Fairy. Glitch forces unknown typing and source corruption text. The custom unknown-type model/animation is absent; ordinary type semantics execute and item restoration resumes elsewhere. Tests: Holy Silvally uses its native Dark form and Glitch retains unknown typing until restored |
| Battler.rb:1859 | @battle.FE == :GLITCH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:1863 | @battle.FE == :GLITCH | implemented_and_tested | Holy forces ordinary Dark Silvally form 17, not Fairy. Glitch forces unknown typing and source corruption text. The custom unknown-type model/animation is absent; ordinary type semantics execute and item restoration resumes elsewhere. Tests: Holy Silvally uses its native Dark form and Glitch retains unknown typing until restored |
| Battler.rb:3127 | Rejuv && [:SHORTCIRCUIT, :GLITCH].include?(@battle.FE) | implemented_and_tested | Glitch/Short Circuit Download grants both offensive boosts; Factory/City/Back Alley grant two stages of the stat chosen from summed opposing stage-adjusted raw defenses. Tests: Download amplification replaces native boosting and compares both opposing defense stats |
| Battler.rb:3157 | self.ability == :QUARKDRIVE && @battle.FE == :GLITCH | implemented_and_tested | Glitch Quark Drive gives unknown typing on actual Pokemon entry with source rogue-data message, independently of terrain-driven native Quark Drive stat activation. Tests: Glitch Quark Drive applies ordinary unknown typing on entry |
| Battler.rb:3167 | Rejuv && [:SHORTCIRCUIT, :GLITCH].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:3741 | @battle.FE == :GLITCH | implemented_and_tested | Glitch removes recharge when the attack user is alive and its target fainted. Tests: Glitch knockout clears recharge before the next action |
| Battler.rb:4220 | :GLITCH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:5410 | @battle.FE != :BEWITCHED && !(Rejuv && @battle.FE == :GLITCH) && self.ability == :PRANKSTER && movetoblock.pbIsStatus? | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Rejuv/Battle/MoveEffects.rb:58 | @battle.FE == :GLITCH | excluded_custom_move | The enclosing custom move handler changes Vorpal Blade only; it is absent from the installed ordinary move registry. Tests:  |
| Rejuv/Battle/MoveEffects.rb:63 | @move == :VORPALBLADE && @battle.FE == :GLITCH | excluded_custom_move | The enclosing custom move handler changes Vorpal Blade only; it is absent from the installed ordinary move registry. Tests:  |

AI source leads: 20. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":[],"abilities":["gravitycontrol"],"items":[]}`.
