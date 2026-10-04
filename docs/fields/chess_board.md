# Chess Board

Original ID: `CHESS`; datapack ID: `rejuvenation:chess_board`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "Opening variation set."

Nature Power: `ancientpower`. Secret Power animation/reference move: `feint`.

Secret Power actual secondary choices: `[{"boosts":{"def":-1}}]`.

Mimicry type: `Psychic`; Burmy cloak reference: `TRASHCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"syntheticseed","effect":"magiccoat","duration":true,"message":"{1} shrouded itself with Magic Coat!","stats":{"spa":1}}`. Seed actions: `null`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":8,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"},"taunt":{"duration":4,"sourceMoves":["falsesurrender"],"source":"Battle_MoveEffects.rb:115"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `null` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The terrain returned to normal."`.

Shared stat pools: `null`. Absorber policies: `null`. Indirect immunity: `null`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"competitive":{"onAfterEachBoost":{"mode":"replace","condition":{"all":[{"statsLowered":true},{"not":{"samePokemon":true}}]},"actions":[],"source":"Battler.rb:900"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":5,"extendedBy":3,"blockEverstone":false}],"source":"Battler.rb:3926"}}}`. Inactive abilities: `null`. Status type bypass: `null`.

Field form typing: `["arceus","silvally"]`. Custom volatile rules: `null`. Rampage policy: `null`.

Progression: `null`. Party roles: `{"tailRole":"queen","frontRole":"pawn","frontCount":{"singles":1,"doubles":2},"leaderRole":"king","preferAbilities":["supremeoverlord"],"preferItems":["kingsrock"],"remaining":[{"role":"knight","maxStats":["spe"]},{"role":"bishop","maxStats":["atk","spa"]},{"role":"rook","maxStats":["def","spd"]}]}`.

Field clock policy: `null`.

Fields persist for the battle unless transformed/destroyed. Move/ability terrain creation uses its own finite duration; engine stack restoration and overlay clocks are described in ARCHITECTURE.md.

## Core move rules

| Move ID | Executable properties and exact source text |
|---|---|
| `feint` | {"multiplier":1.5,"message":"En passant!"} |
| `feintattack` | {"multiplier":1.5,"message":"En passant!"} |
| `fakeout` | {"multiplier":1.5,"message":"En passant!"} |
| `suckerpunch` | {"multiplier":1.5,"message":"En passant!"} |
| `firstimpression` | {"multiplier":1.5,"message":"En passant!"} |
| `shadowsneak` | {"multiplier":1.5,"message":"En passant!"} |
| `smartstrike` | {"multiplier":1.5,"message":"En passant!"} |
| `kowtowcleave` | {"multiplier":1.5,"message":"En passant!"} |
| `thunderclap` | {"multiplier":1.5,"message":"En passant!"} |
| `upperhand` | {"multiplier":1.5,"message":"En passant!"} |
| `strength` | {"multiplier":1.5,"additionalType":"ROCK","message":"The chess piece slammed forward!"} |
| `ancientpower` | {"multiplier":1.5,"additionalType":"ROCK","message":"The chess piece slammed forward!"} |
| `psychic` | {"multiplier":1.5,"additionalType":"ROCK","message":"The chess piece slammed forward!"} |
| `continentalcrush` | {"multiplier":1.5,"additionalType":"ROCK","message":"The chess piece slammed forward!"} |
| `secretpower` | {"multiplier":1.5,"additionalType":"ROCK","message":"The chess piece slammed forward!"} |
| `shatteredpsyche` | {"multiplier":1.5,"additionalType":"ROCK","message":"The chess piece slammed forward!"} |
| `barrage` | {"multiplier":2.0,"additionalType":"ROCK","message":"The chess piece slammed forward!"} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "switchIn" | {"ability":{"who":"user","values":["stall","stancechange"]}} | [{"op":"boost","stats":{"def":1}}] | "Battler.rb:2051" |
| "damage" | {"ability":{"who":"user","values":["gorillatactics","reckless"]}} | [{"op":"multiply","value":1.2}] | "Battle_Move.rb:1595" |
| "basePower" | {"all":[{"any":[{"move":"strength"},{"move":"ancientpower"},{"move":"psychic"},{"move":"continentalcrush"},{"move":"secretpower"},{"move":"shatteredpsyche"},{"move":"barrage"}]},{"ability":{"who":"target","values":["adaptability","anticipation","synchronize","telepathy"]}}]} | [{"op":"multiply","value":0.5}] | "Battle_Move.rb:1394" |
| "basePower" | {"all":[{"any":[{"move":"strength"},{"move":"ancientpower"},{"move":"psychic"},{"move":"continentalcrush"},{"move":"secretpower"},{"move":"shatteredpsyche"},{"move":"barrage"}]},{"any":[{"ability":{"who":"target","values":["oblivious","klutz","unaware","simple","defeatist"]}},{"volatile":{"who":"target","id":"confusion"}}]}]} | [{"op":"multiply","value":2}] | "Battle_Move.rb:1395" |
| "basePower" | {"any":[{"ability":{"who":"user","values":["queenlymajesty"]}},{"role":{"who":"user","value":"queen"}}]} | [{"op":"multiply","value":1.5},{"op":"moveMessage","text":"The Queen is dominating the board!"}] | "Battle_Move.rb:1398" |
| "damage" | {"ability":{"who":"user","values":["competitive"]}} | [{"op":"hpPower","maximum":2,"scale":0.8}] | "Battle_Move.rb:1600" |
| "damage" | {"ability":{"who":"user","values":["illusion"]}} | [{"op":"multiply","value":1.2}] | "Battle_Move.rb:1601" |
| "basePower" | {"all":[{"role":{"who":"user","value":"knight"}},{"role":{"who":"target","value":"queen"}}]} | [{"op":"multiply","value":3},{"op":"moveMessage","text":"An unblockable attack on the Queen!"}] | "Battle_Move.rb:1402" |
| "modifyMove" | {"all":[{"role":{"who":"user","value":"knight"}},{"moveTarget":"allAdjacentFoes"}]} | [{"op":"moveProperty","path":"spreadModifier","value":1.25},{"op":"moveMessage","text":"The knight forked the opponents!"}] | "Battle_Move.rb:1097" |
| "priority" | {"role":{"who":"user","value":"king"}} | [{"op":"add","value":1}] | "Battle_Move.rb:2304" |
| "switchIn" | {"role":{"who":"user","value":"pawn"}} | [{"op":"message","text":"{1} became a Pawn and stormed up the board!"}] | "Battle.rb:3083" |
| "switchIn" | {"role":{"who":"user","value":"king"}} | [{"op":"message","text":"{1} became a King and exposed itself!"}] | "Battle.rb:3083" |
| "switchIn" | {"role":{"who":"user","value":"knight"}} | [{"op":"message","text":"{1} became a Knight and readied its position!"}] | "Battle.rb:3083" |
| "switchIn" | {"role":{"who":"user","value":"bishop"}} | [{"op":"message","text":"{1} became a Bishop and took the diagonal!"},{"op":"boost","stats":{"atk":1,"spa":1}}] | "Battle.rb:3083" |
| "switchIn" | {"role":{"who":"user","value":"rook"}} | [{"op":"message","text":"{1} became a Rook and took the open file!"},{"op":"boost","stats":{"def":1,"spd":1}}] | "Battle.rb:3083" |
| "switchIn" | {"role":{"who":"user","value":"queen"}} | [{"op":"message","text":"{1} became a Queen and was placed on the center of the board!"},{"op":"boost","stats":{"def":1,"spd":1}}] | "Battle.rb:3083" |
| "receivedDamage" | {"role":{"who":"target","value":"pawn"}} | [{"op":"survive","who":"target","once":true,"message":"{1} hung on the edge of the board!"}] | "Battle_Move.rb:2126; Battle_DamageState.rb:37 (once per battler slot)" |
| "tryHit" | {"all":[{"role":{"who":"target","value":"pawn"}},{"any":[{"move":"fissure"},{"move":"sheercold"},{"move":"horndrill"},{"move":"guillotine"}]}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:2527" |
| "modifyMove" | {"move":"noretreat"} | [{"op":"moveProperty","path":"boosts","value":{"atk":2,"spa":2,"spe":2,"def":-1,"spd":-1}}] | "Battle_MoveEffects.rb:8390" |
| "criticalRatio" | {"ability":{"who":"target","values":["reckless","gorillatactics"]}} | [{"op":"add","value":1}] | "Battle_Move.rb:1010" |
| "criticalRatio" | {"lastMove":{"who":"target","values":["stompingtantrum","thrash","outrage","ragingfury"]}} | [{"op":"add","value":1}] | "Battle_Move.rb:1011" |
| "criticalRatio" | {"all":[{"ability":{"who":"user","values":["merciless"]}},{"hp":{"who":"target","op":"<","fraction":0.8,"round":false}}]} | [{"op":"add","value":1}] | "Battle_Move.rb:1013-1020" |
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
| "formChange" | {"all":[{"species":{"who":"user","value":"aegislash"}},{"ability":{"who":"user","values":["stancechange"]}},{"formName":{"who":"user","value":"Blade"}}]} | [{"op":"message","text":"Changed to Blade Forme!"},{"op":"boost","stats":{"atk":1,"def":-1}}] | "Battler.rb:1696-1701" |
| "formChange" | {"all":[{"species":{"who":"user","value":"aegislash"}},{"ability":{"who":"user","values":["stancechange"]}},{"formName":{"who":"user","value":""}}]} | [{"op":"message","text":"Changed to Shield Forme!"},{"op":"boost","stats":{"atk":-1,"def":1}}] | "Battler.rb:1696-1701" |
| "modifyMove" | {"all":[{"move":"mist"},{"not":{"sideCondition":"mist"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"createField","field":"rejuvenation:misty_terrain","duration":3,"extendedBy":3,"message":"Mist swirled around the battlefield!"}]}] | "Battle_MoveEffects.rb:1817" |
| "modifyMove" | {"move":"calmmind"} | [{"op":"moveProperty","path":"boosts","value":{"spa":2,"spd":2}}] | "Battle_MoveEffects.rb:1024" |
| "modifyMove" | {"move":"nastyplot"} | [{"op":"moveProperty","path":"boosts","value":{"spa":3}}] | "Battle_MoveEffects.rb:1131" |
| "modifyMove" | {"all":[{"move":"falsesurrender"},{"not":{"effectiveAbility":{"who":"target","values":["oblivious"]}}},{"not":{"sideAbility":{"who":"target","values":["aromaveil"]}}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"volatile","id":"taunt","who":"target"}]}] | "Battle_MoveEffects.rb:113-119" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "modifyMove" | {"move":"allyswitch"} | [{"op":"moveBehavior","recipe":"appendHitActions","silentCommands":["swap"],"actions":[{"op":"castling","userStats":{"def":1,"spd":1},"partnerStats":{"atk":1,"spa":1},"message":"{1} castled with {2}!"}]}] | "Battle_MoveEffects.rb:6172" |
| "modifyMove" | {"move":"poltergeist"} | [{"op":"removeCallbacks","callbacks":["onTry","onTryHit","onPrepareHit"]}] | "Battle_MoveEffects.rb:8968" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |

## Original status-move highlights

Source UI buff highlights: `["calmmind","nastyplot","trickroom","kingsshield","obstruct","noretreat","allyswitch"]`.

Source UI nerf highlights: `[]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["calmmind","nastyplot","noretreat"],"unreviewedHighlightedMoves":["allyswitch","kingsshield","obstruct","trickroom"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Battle.rb:3082 | @field.effect == :CHESS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:910 | self.ability == :COMPETITIVE && !(Rejuv && @battle.FE == :CHESS) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Inspect.rb:8 | (self.ability == :QUEENLYMAJESTY && [:CHESS, :FAIRYTALE].include?(@battle.FE)) \|\| (@battle.FE == :CHESS && self.piece == :QUEEN) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Inspect.rb:12 | Rejuv && @battle.FE == :CHESS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Inspect.rb:293 | @battle.FE == :CHESS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1009 | Rejuv && @battle.FE == :CHESS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1097 | attacker.piece == :KNIGHT && @battle.FE == :CHESS && attacker.pbTarget(self) == :AllOpposing | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1185 | @zmove \|\| (Gen >= Champs && unseenFistCheck(attacker)) \|\| (Rejuv && @move == :KOWTOWCLEAVE && @battle.FE == :CHESS) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1391 | :CHESS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1601 | Rejuv && @battle.FE == :CHESS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:2126 | damage == hpTotal && @battle.FE == :CHESS && opponent.piece == :PAWN && !opponent.damagestate.pawnsturdyused | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:2304 | @battle.FE == :CHESS && attacker.pokemon && attacker.piece == :KING | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:113 | @battle.FE == :CHESS && @move == :FALSESURRENDER | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1024 | [:CHESS, :ASHENBEACH, :PSYTERRAIN].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1131 | [:CHESS, :PSYTERRAIN, :INFERNAL, :BACKALLEY].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2527 | (@move == :SHEERCOLD && opponent.hasType?(:ICE)) \|\| (@battle.FE == :CHESS && opponent.piece == :PAWN) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6172 | @battle.FE == :CHESS && !attacker.pbOwnSide.effects[:Castled] | implemented_and_tested | Chess Ally Switch swaps natively with silent chat, then grants defensive/offensive partner boosts only once per side. Post-swap source index chooses O-O/O-O-O notation correctly on both sides; later swaps retain ordinary text. Tests: Chess castling uses source side notation, native silent swap and one boost per side |
| Battle_MoveEffects.rb:6959 | [:CHESS, :NEWWORLD, :PSYTERRAIN].include?(@battle.FE) \|\| attacker.hasWorkingItem(:AMPLIFIELDROCK) \|\| (Rejuv && @battle.FE == :STARLIGHT) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8376 | [:BIGTOP, :CHESS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8381 | [:BIGTOP, :CHESS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8390 | [:BIGTOP, :CHESS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8968 | opponent.itemWorks? \|\| (@battle.FE == :CHESS && Rejuv) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8969 | (@battle.FE != :CHESS && Rejuv) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8980 | (@battle.FE == :CHESS && Rejuv) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Scene.rb:6138 | move.move == :ALLYSWITCH && battle.FE == :CHESS && (!battle.doublebattle \|\| battler.pbOwnSide.effects[:Castled]) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:1698 | @battle.FE == :FAIRYTALE \|\| (Rejuv && @battle.FE == :CHESS) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2051 | Rejuv && @battle.FE == :CHESS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:5259 | @battle.FE == :CHESS && self.piece == :KING && Rejuv | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:5265 | basemove.canProtect? && !basemove.zmove && !basemove.unseenFistCheck(self) && !(Rejuv && basemove.move == :KOWTOWCLEAVE && @battle.FE == :CHESS) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:5304 | [:FAIRYTALE, :CHESS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:5305 | [:DIMENSIONAL, :CHESS, :DEUXFINALIS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:5507 | [:FAIRYTALE, :CHESS, :COLOSSEUM].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:5939 | Rejuv && @battle.FE == :CHESS && user.ability == :KLUTZ && PBFields::CHESSMOVES.include?(basemove.move) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:5965 | noPriority.any? && !(Rejuv && movetoblock.move == :KOWTOWCLEAVE && @battle.FE == :CHESS) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Rejuv/Battle/Battler.rb:33 | self.ability == :STANCECHANGE && (@battle.FE == :FAIRYTALE \|\| (Rejuv && @battle.FE == :CHESS)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Rejuv/Battle/Battler.rb:62 | self.ability == :STANCECHANGE && (@battle.FE == :FAIRYTALE \|\| (Rejuv && @battle.FE == :CHESS)) | excluded_crest | This field stat change is inside the explicitly Zoroark-crested illusion stance branch. Ordinary Aegislash Stance Change has separate rules and regression coverage. Tests:  |

AI source leads: 37. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":[],"abilities":["gravitycontrol"],"items":[]}`.
