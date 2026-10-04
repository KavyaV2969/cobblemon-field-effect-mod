# New World

Original ID: `NEWWORLD`; datapack ID: `rejuvenation:new_world`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "From darkness, from stardust|,\n\nFrom memories of eons past and visions yet to come..."

Nature Power: `spacialrend`. Secret Power animation/reference move: `roaroftime`.

Secret Power actual secondary choices: `[{"boosts":{"atk":-1,"def":-1,"spa":-1,"spd":-1,"spe":-1}}]`.

Mimicry type: `Dark`; Burmy cloak reference: `TRASHCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"magicalseed","effect":"hyperbeam","duration":1,"message":"{1} must recharge!","stats":{"atk":1,"def":1,"spa":1,"spd":1,"spe":1}}`. Seed actions: `null`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `{"blockedMessage":"The terrain had no solid ground to attach...","blockedFields":[],"source":"Battle_Field.rb:288-301","clearOverlayOnEntry":true}`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":8,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":8,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":8,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `{"cobblemon:dusk_ball":3.5}` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The world broke apart again!"`.

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
| `aurorabeam` | {"multiplier":1.5,"message":"The light shone through the infinite darkness!"} |
| `signalbeam` | {"multiplier":1.5,"message":"The light shone through the infinite darkness!"} |
| `flashcannon` | {"multiplier":1.5,"message":"The light shone through the infinite darkness!"} |
| `dazzlinggleam` | {"multiplier":1.5,"message":"The light shone through the infinite darkness!"} |
| `mirrorshot` | {"multiplier":1.5,"message":"The light shone through the infinite darkness!"} |
| `mirrorbeam` | {"multiplier":1.5,"message":"The light shone through the infinite darkness!"} |
| `photongeyser` | {"multiplier":1.5,"message":"The light shone through the infinite darkness!"} |
| `psystrike` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `aeroblast` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `sacredfire` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `mistball` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `lusterpurge` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `originpulse` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `precipiceblades` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `dragonascent` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `psychoboost` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `roaroftime` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `magmastorm` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `crushgrip` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `judgment` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `seedflare` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `shadowforce` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `searingshot` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `vcreate` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `secretsword` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `sacredsword` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `relicsong` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `fusionbolt` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `fusionflare` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `glaciate` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `iceburn` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `freezeshock` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `boltstrike` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `blueflare` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `technoblast` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `oblivionwing` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `landswrath` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `thousandarrows` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `thousandwaves` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `diamondstorm` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `steameruption` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `coreenforcer` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `fleurcannon` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `prismaticlaser` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `sunsteelstrike` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `spectralthief` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `moongeistbeam` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `multiattack` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `mindblown` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `plasmafists` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `earthpower` | {"multiplier":1.5,"message":"The germinal matter amassed in the attack!"} |
| `powergem` | {"multiplier":1.5,"message":"The germinal matter amassed in the attack!"} |
| `eruption` | {"multiplier":1.5,"message":"The germinal matter amassed in the attack!"} |
| `continentalcrush` | {"multiplier":1.5,"message":"The germinal matter amassed in the attack!"} |
| `genesissupernova` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `soulstealing7starstrike` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `searingsunrazesmash` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `menacingmoonrazemaelstrom` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `doubleironbash` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `dynamaxcannon` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `behemothblade` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `behemothbash` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `wickedblow` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `surgingstrikes` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `thundercage` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `dragonenergy` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `freezingglare` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `fierywrath` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `thunderouskick` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `glaciallance` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `astralbarrage` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `springtidestorm` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `wildboltstorm` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `bleakwindstorm` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `sandsearstorm` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `mysticalpower` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `luminacrash` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `collisioncourse` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `electrodrift` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `hydrosteam` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `thunderclap` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `psyblade` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `mightycleave` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `ivycudgel` | {"multiplier":1.5,"message":"The ethereal energy strengthened the attack!"} |
| `malignantchain` | {"multiplier":1.5} |
| `vacuumwave` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `dracometeor` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `meteormash` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `moonblast` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `cometpunch` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `swift` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `hyperspacehole` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `spacialrend` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `hyperspacefury` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `ancientpower` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `futuresight` | {"multiplier":2.0} |
| `futuredummy` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `blackholeeclipse` | {"multiplier":2.0,"message":"{1} was swallowed up by the void!"} |
| `lightthatburnsthesky` | {"multiplier":2.0,"message":"The light shone through the infinite darkness!"} |
| `eternabeam` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `meteorbeam` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `bloodmoon` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `terastarstorm` | {"multiplier":2.0,"message":"The astral energy boosted the attack!","transition":{"field":"rejuvenation:starlight","condition":{"always":true},"push":true,"message":"Starlight amassed into a solid surface!"}} |
| `tachyoncutter` | {"multiplier":2.0,"message":"The astral energy boosted the attack!"} |
| `doomdesire` | {"multiplier":4.0} |
| `doomdummy` | {"multiplier":4.0,"additionalType":"FIRE","message":"A star came crashing down on {1}!"} |
| `earthquake` | {"multiplier":0.25,"message":"The unformed land diffused the attack..."} |
| `magnitude` | {"multiplier":0.25,"message":"The unformed land diffused the attack..."} |
| `bulldoze` | {"multiplier":0.25,"message":"The unformed land diffused the attack..."} |
| `fissure` | {"multiplier":0,"message":"The unformed land diffused the attack..."} |
| `darkvoid` | {"accuracy":100} |
| `geomancy` | {"transition":{"field":"rejuvenation:starlight","condition":{"always":true},"push":false,"message":"The world was regenerated!"}} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Dark"} | {"condition":{"always":true},"multiplier":1.5,"message":"Infinity boosted the attack!"} |

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "defense" | {"not":{"grounded":{"who":"user","value":true}}} | [{"op":"multiply","value":0.9}] | "Battle_Field.rb:1094-1128" |
| "specialDefense" | {"not":{"grounded":{"who":"user","value":true}}} | [{"op":"multiply","value":0.9}] | "Battle_Field.rb:1094-1128" |
| "speed" | {"grounded":{"who":"user","value":true}} | [{"op":"multiply","value":0.75}] | "Battler.rb:1187-1215" |
| "activate" | {"all":[{"weatherActive":true},{"not":{"globalAbility":["tempest"]}}]} | [{"op":"clearWeather","message":"The weather disappeared into space!"}] | "Battle_Field.rb:215-232" |
| "weatherChange" | {"all":[{"weatherActive":true},{"not":{"globalAbility":["tempest"]}}]} | [{"op":"clearWeather","message":"The weather disappeared into space!"}] | "Battle_Field.rb:215-232" |
| "activate" | {"always":true} | [{"op":"clearOverlay"}] | "Battle_Field.rb:250" |
| "residual" | {"ability":{"who":"user","values":["mimicry"]}} | [{"op":"mimicry"}] | "Battle.rb:6122; Battle_Field.rb:1181" |
| "modifyMove" | {"move":"takeheart"} | [{"op":"moveBehavior","recipe":"cureAndBoost","stats":{"spa":2,"spd":2}}] | "Battle_MoveEffects.rb:9231" |
| "pseudoWeatherStart" | {"pseudoWeather":{"id":"gravity","value":true}} | [{"op":"changeField","field":"rejuvenation:starlight","durationFromCondition":"gravity","force":true,"message":"The world's matter reformed!"},{"op":"bindFieldClock","durationCondition":{"pseudoWeather":{"id":"gravity","value":true}},"permanentCondition":{"not":{"field":"rejuvenation:starlight"}}}] | "Battle.rb:718-726" |
| "setWeather" | {"always":true} | [{"op":"message","text":"The weather drifted off into space..."},{"op":"reject"}] | "Battle.rb:367-406" |
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
| "modifyMove" | {"move":"heartswap"} | [{"op":"moveBehavior","recipe":"shareHP","message":"The battlers shared their pain!"}] | "Battle_MoveEffects.rb:1777" |
| "modifyMove" | {"all":[{"move":"mist"},{"not":{"sideCondition":"mist"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"createField","field":"rejuvenation:misty_terrain","duration":3,"extendedBy":3,"message":"Mist swirled around the battlefield!"}]}] | "Battle_MoveEffects.rb:1817" |
| "modifyMove" | {"move":"cosmicpower"} | [{"op":"moveProperty","path":"boosts","value":{"def":2,"spd":2}}] | "Battle_MoveEffects.rb:993" |
| "modifyMove" | {"move":"flash"} | [{"op":"moveProperty","path":"boosts","value":{"accuracy":-2}}] | "Battle_MoveEffects.rb:1503" |
| "modifyMove" | {"move":"moonlight"} | [{"op":"moveProperty","path":"heal","value":[0.75,1],"removeCallback":"onHit"}] | "Battle_MoveEffects.rb:5237" |
| "modifyMove" | {"move":"guardianofalola"} | [{"op":"moveBehavior","recipe":"fixedDamage","basis":"targetMaxHP","factor":0.75}] | "Battle_ZMove.rb:359" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "chargeMove" | {"move":"meteorbeam"} | [{"op":"reject"}] | "Battle_MoveEffects.rb:8840" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"randomForm","variants":[{"species":"silvally","type":"Normal"},{"species":"silvallyfire","type":"Fire"},{"species":"silvallywater","type":"Water"},{"species":"silvallyelectric","type":"Electric"},{"species":"silvallygrass","type":"Grass"},{"species":"silvallyice","type":"Ice"},{"species":"silvallyfighting","type":"Fighting"},{"species":"silvallypoison","type":"Poison"},{"species":"silvallyground","type":"Ground"},{"species":"silvallyflying","type":"Flying"},{"species":"silvallypsychic","type":"Psychic"},{"species":"silvallybug","type":"Bug"},{"species":"silvallyrock","type":"Rock"},{"species":"silvallyghost","type":"Ghost"},{"species":"silvallydragon","type":"Dragon"},{"species":"silvallydark","type":"Dark"},{"species":"silvallysteel","type":"Steel"},{"species":"silvallyfairy","type":"Fairy"}],"message":"{1} transformed into the {type} type!"}] | "Battler.rb:1846-1848; Battle_Field.rb:1166-1175" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]} | [{"op":"randomForm","variants":[{"species":"arceus","type":"Normal"},{"species":"arceusfire","type":"Fire"},{"species":"arceuswater","type":"Water"},{"species":"arceuselectric","type":"Electric"},{"species":"arceusgrass","type":"Grass"},{"species":"arceusice","type":"Ice"},{"species":"arceusfighting","type":"Fighting"},{"species":"arceuspoison","type":"Poison"},{"species":"arceusground","type":"Ground"},{"species":"arceusflying","type":"Flying"},{"species":"arceuspsychic","type":"Psychic"},{"species":"arceusbug","type":"Bug"},{"species":"arceusrock","type":"Rock"},{"species":"arceusghost","type":"Ghost"},{"species":"arceusdragon","type":"Dragon"},{"species":"arceusdark","type":"Dark"},{"species":"arceussteel","type":"Steel"},{"species":"arceusfairy","type":"Fairy"}],"message":"{1} transformed into the {type} type!"}] | "Battler.rb:1846-1848; Battle_Field.rb:1166-1175" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"randomForm","variants":[{"species":"silvally","type":"Normal"},{"species":"silvallyfire","type":"Fire"},{"species":"silvallywater","type":"Water"},{"species":"silvallyelectric","type":"Electric"},{"species":"silvallygrass","type":"Grass"},{"species":"silvallyice","type":"Ice"},{"species":"silvallyfighting","type":"Fighting"},{"species":"silvallypoison","type":"Poison"},{"species":"silvallyground","type":"Ground"},{"species":"silvallyflying","type":"Flying"},{"species":"silvallypsychic","type":"Psychic"},{"species":"silvallybug","type":"Bug"},{"species":"silvallyrock","type":"Rock"},{"species":"silvallyghost","type":"Ghost"},{"species":"silvallydragon","type":"Dragon"},{"species":"silvallydark","type":"Dark"},{"species":"silvallysteel","type":"Steel"},{"species":"silvallyfairy","type":"Fairy"}],"message":"{1} transformed into the {type} type!"}] | "Battler.rb:1846-1848; Battle_Field.rb:1166-1175" |
| "residual" | {"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]} | [{"op":"randomForm","variants":[{"species":"arceus","type":"Normal"},{"species":"arceusfire","type":"Fire"},{"species":"arceuswater","type":"Water"},{"species":"arceuselectric","type":"Electric"},{"species":"arceusgrass","type":"Grass"},{"species":"arceusice","type":"Ice"},{"species":"arceusfighting","type":"Fighting"},{"species":"arceuspoison","type":"Poison"},{"species":"arceusground","type":"Ground"},{"species":"arceusflying","type":"Flying"},{"species":"arceuspsychic","type":"Psychic"},{"species":"arceusbug","type":"Bug"},{"species":"arceusrock","type":"Rock"},{"species":"arceusghost","type":"Ghost"},{"species":"arceusdragon","type":"Dragon"},{"species":"arceusdark","type":"Dark"},{"species":"arceussteel","type":"Steel"},{"species":"arceusfairy","type":"Fairy"}],"message":"{1} transformed into the {type} type!"}] | "Battler.rb:1846-1848; Battle_Field.rb:1166-1175" |

## Original status-move highlights

Source UI buff highlights: `["darkvoid","heartswap","trickroom","magicroom","wonderroom","cosmicpower","flash","moonlight","lunardance","naturesmadness","lunarblessing","guardianofalola","junglehealing","takeheart","ruination"]`.

Source UI nerf highlights: `["sunnyday","raindance","sandstorm","hail","snowscape","chillyreception","shadowsky","electricterrain","grassyterrain","mistyterrain","psychicterrain"]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["cosmicpower","flash","heartswap","moonlight","takeheart"],"unreviewedHighlightedMoves":["chillyreception","darkvoid","electricterrain","grassyterrain","guardianofalola","hail","junglehealing","lunarblessing","lunardance","magicroom","mistyterrain","naturesmadness","psychicterrain","raindance","ruination","sandstorm","shadowsky","snowscape","sunnyday","trickroom","wonderroom"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Balls.rb:166 | PBDayNight.isNight?(pbGetTimeNow) \|\| [:DARKCRYSTALCAVERN, :SHORTCIRCUIT, :UNDERWATER, :CAVE, :CRYSTALCAVERN, :DRAGONSDEN, :STARLIGHT, :NEWWORLD, :INVERSE].include?(battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:386 | @field.effect == :NEWWORLD | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:531 | @field.effect == :ELECTERRAIN \|\| @field.overlay == :ELECTERRAIN \|\| @field.effect == :NEWWORLD | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:540 | @field.effect == :NEWWORLD | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:564 | pbWeather(nil) == :SUNNYDAY \|\| @field.effect == :NEWWORLD \|\| Rejuv && [:DESERT].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:573 | @field.effect == :NEWWORLD | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:721 | @field.effect == :NEWWORLD | implemented_and_tested | Gravity on New World creates a forced Starlight hard field using Gravity's current duration. The field counts down independently, restores when Gravity is removed, and becomes permanent on a subsequent hard-field transformation. Source activation flavor and restoration flavor are dispatched in order. Tests: Gravity reforms New World with its exact clock and restores when gravity is removed, Gravity temporary field becomes permanent on a subsequent hard transformation |
| Battle.rb:6115 | [:CRYSTALCAVERN, :NEWWORLD].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:7319 | @battle.FE == :NEWWORLD | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:8018 | [:STARLIGHT, :NEWWORLD, :BIGTOP, :DANCEFLOOR].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:8024 | [:STARLIGHT, :NEWWORLD, :BIGTOP, :DANCEFLOOR].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:8026 | [:NEWWORLD, :BIGTOP, :DANCEFLOOR].include?(@field.effect) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:232 | @field.effect == :NEWWORLD | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:252 | @field.effect == :NEWWORLD \|\| @field.effect == :UNDERWATER | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:267 | :NEWWORLD | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:288 | @field.effect == :NEWWORLD | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:1107 | :NEWWORLD | implemented_and_tested | New World airborne defenders use 0.9 on both defensive paths; grounded defenders retain 1. Tests: every compiled field defense branch uses the source type, stat and weather gates, Mega Sol overrides hail for field defense, Deux Finalis defense uses attacker-relative weather |
| Battle_Inspect.rb:4 | [:STARLIGHT, :NEWWORLD].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1471 | @battle.FE == :NEWWORLD | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1503 | attacker.ability == :HADRONENGINE && (@battle.FE == :NEWWORLD \|\| @battle.FE == :ELECTERRAIN \|\| @battle.OV == :ELECTERRAIN) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1523 | attacker.ability == :ORICHALCUMPULSE && (weather == :SUNNYDAY \|\| @battle.FE == :NEWWORLD) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1593 | [:STARLIGHT, :NEWWORLD].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1686 | @battle.FE == :NEWWORLD | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1701 | opponent.ability == :HADRONENGINE && (@battle.FE == :NEWWORLD \|\| @battle.FE == :ELECTERRAIN \|\| @battle.OV == :ELECTERRAIN) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1812 | opponent.ability == :SHADOWSHIELD && [:STARLIGHT, :NEWWORLD, :DARKCRYSTALCAVERN].include?(@battle.FE) && opponent.damagestate.typemod.superEffective? | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:993 | [:MISTY, :RAINBOW, :HOLY, :STARLIGHT, :NEWWORLD, :PSYTERRAIN].include?(@battle.FE) && @move == :COSMICPOWER | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1503 | [:SHORTCIRCUIT, :DARKCRYSTALCAVERN, :MIRROR, :STARLIGHT, :NEWWORLD, :DARKNESS1].include?(@battle.FE) && @move == :FLASH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1777 | @battle.FE == :NEWWORLD && !blockedBySubstitute?(attacker, opponent) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2436 | [:RUINATION, :NATURESMADNESS].include?(@move) && @battle.FE == :NEWWORLD | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:5237 | ([:DARKCRYSTALCAVERN, :STARLIGHT, :NEWWORLD, :BEWITCHED].include?(@battle.FE) && @move == :MOONLIGHT) \|\| (Rejuv && @battle.FE == :GRASSY && @move == :SYNTHESIS) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6137 | [:NEWWORLD, :PSYTERRAIN].include?(@battle.FE) \|\| attacker.hasWorkingItem(:AMPLIFIELDROCK) \|\| (Rejuv && @battle.FE == :STARLIGHT) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6959 | [:CHESS, :NEWWORLD, :PSYTERRAIN].include?(@battle.FE) \|\| attacker.hasWorkingItem(:AMPLIFIELDROCK) \|\| (Rejuv && @battle.FE == :STARLIGHT) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7029 | [:NEWWORLD, :PSYTERRAIN].include?(@battle.FE) \|\| attacker.hasWorkingItem(:AMPLIFIELDROCK) \|\| (Rejuv && @battle.FE == :STARLIGHT) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8840 | [:STARLIGHT, :NEWWORLD].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:9064 | (@move == :LUNARBLESSING && [:STARLIGHT, :NEWWORLD, :HOLY].include?(@battle.FE)) \|\| (@move == :JUNGLEHEALING && [:FOREST, :HOLY, :NEWWORLD].include?(@battle.FE)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:9231 | [:WATERSURFACE, :UNDERWATER, :HOLY, :NEWWORLD].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_ZMove.rb:359 | @battle.FE == :NEWWORLD | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:1190 | :NEWWORLD | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:1846 | @battle.FE == :NEWWORLD | implemented_and_tested | New World rolls an ordinary Arceus/Silvally type/form excluding its current type on entry/end round; native held-item typing must not overwrite the roll. Leaving the field restores the item form only at the next source form check. Tests: New World form typing survives native held-item callbacks and restores after leaving |
| Battler.rb:2822 | self.ability == :HADRONENGINE && @battle.FE == :NEWWORLD | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2960 | self.ability == :ORICHALCUMPULSE && @battle.FE == :NEWWORLD | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:4233 | :NEWWORLD | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:5307 | [:BURNING, :VOLCANIC, :NEWWORLD].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7273 | self.ability == :ORICHALCUMPULSE && (weather == :SUNNYDAY \|\| @battle.FE == :NEWWORLD) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7275 | @battle.FE == :NEWWORLD | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7310 | @battle.FE == :NEWWORLD | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7330 | @battle.FE == :NEWWORLD | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7345 | self.ability == :HADRONENGINE && (@battle.FE == :NEWWORLD \|\| @battle.FE == :ELECTERRAIN \|\| @battle.OV == :ELECTERRAIN) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7385 | @battle.FE == :NEWWORLD | requires_behavioral_comparison | Semantic comparison pending Tests:  |

AI source leads: 35. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":["mirrorbeam","doomdummy","shadowsky","futuredummy"],"abilities":["gravitycontrol","tempest"],"items":[]}`.
