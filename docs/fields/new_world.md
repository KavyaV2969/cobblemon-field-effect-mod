# New World

Original ID: `NEWWORLD`; datapack ID: `rejuvenation:new_world`.

**Status:** implemented; every runtime source lead is implemented and tested or recorded as an exclusion or limitation. Compiled definition comparison passed. Not certified through exhaustive live or multiplayer play. Field-specific exceptions are listed in [FIELD_COVERAGE.md](../FIELD_COVERAGE.md).

## Initialization

Entry text: "From darkness, from stardust|,\n\nFrom memories of eons past and visions yet to come..."

Nature Power: `spacialrend`. Secret Power animation/reference move: `roaroftime`.

Secret Power actual secondary choices: `[{"boosts":{"atk":-1,"def":-1,"spa":-1,"spd":-1,"spe":-1}}]`.

Mimicry type: `Dark`; Burmy cloak reference: `TRASHCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"magicalseed","effect":"hyperbeam","duration":1,"message":"{1} must recharge!","stats":{"atk":1,"def":1,"spa":1,"spd":1,"spe":1}}`. Seed actions: `null`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `{"blockedMessage":"The terrain had no solid ground to attach...","blockedFields":[],"source":"Battle_Field.rb:288-301","clearOverlayOnEntry":true}`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820","sourceAbilities":["gravitycontrol"]},"trickroom":{"duration":8,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":8,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":8,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `{"cobblemon:dusk_ball":3.5}` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The world broke apart again!"`.

Shared stat pools: `null`. Absorber policies: `null`. Indirect immunity: `null`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":5,"extendedBy":3,"blockEverstone":false}],"source":"Battler.rb:3926"}},"galvanize":{"onBasePower":{"mode":"replace","condition":{"all":[{"abilityChangedType":true},{"overlay":"rejuvenation:electric_terrain"}]},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1249"}},"pixilate":{"onBasePower":{"mode":"replace","condition":{"all":[{"abilityChangedType":true},{"overlay":"rejuvenation:misty_terrain"}]},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1262"}},"purepower":{"onModifyAtk":{"mode":"replace","condition":{"overlay":"rejuvenation:psychic_terrain"},"actions":[],"source":"Battle_Move.rb:1517"}},"plus":{"onModifySpA":{"mode":"replace","condition":{"overlay":"rejuvenation:electric_terrain"},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1495-1499"}},"minus":{"onModifySpA":{"mode":"replace","condition":{"overlay":"rejuvenation:electric_terrain"},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1495-1499"}},"hadronengine":{"onModifySpA":{"mode":"replace","condition":{"always":true},"actions":[{"op":"multiply","value":1.333251953125}],"source":"Battle_Move.rb:1503"},"onStart":{"mode":"replace","condition":{"always":true},"actions":[{"op":"abilityMessage"},{"op":"message","text":"{1} used the energy of the New World to energize its futuristic engine!"}],"source":"Battler.rb:2822-2823"}},"orichalcumpulse":{"onModifyAtk":{"mode":"replace","condition":{"always":true},"actions":[{"op":"multiply","value":1.333251953125}],"source":"Battle_Move.rb:1523"},"onStart":{"mode":"replace","condition":{"always":true},"actions":[{"op":"abilityMessage"},{"op":"message","text":"The energy of the New World sent {1}'s ancient pulse into a frenzy!"}],"source":"Battler.rb:2960-2961"}},"marvelscale":{"onModifyDef":{"mode":"replace","condition":{"overlay":"rejuvenation:misty_terrain"},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1724"}},"shadowshield":{"onSourceModifyDamage":{"mode":"append","condition":{"hitEffectiveness":{"op":">","value":0}},"actions":[{"op":"multiply","value":0.75}],"source":"Battle_Move.rb:1812"}},"tempest":{"onEnd":{"mode":"replace","condition":{"always":true},"actions":[{"op":"reconcileWeather"}],"source":"Battler.rb:3515-3516"}},"comatose":{"onStart":{"mode":"replace","condition":{"always":true},"actions":[{"op":"abilityMessage"},{"op":"message","text":"{1} is drowsing!"}],"source":"Battler.rb:3013-3017 (hard Electric field alone disables Comatose)"}},"slowstart":{"onStart":{"mode":"replace","condition":{"always":true},"actions":[{"op":"volatile","id":"slowstart","silent":true,"message":"{1} is slow to get going!"}],"source":"Battler.rb:3288-3289 (clock retained even on Deep Earth)"}}}`. Inactive abilities: `null`. Status type bypass: `null`.

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
| "modifyMove" | {"all":[{"overlay":"rejuvenation:rainbow"},{"not":{"all":[{"ability":{"who":"user","values":["serenegrace"]}},{"canFlinch":true}]}}]} | [{"op":"secondaryChance","multiplier":2}] | "Battle_Move.rb:2328-2329" |
| "defense" | {"not":{"grounded":{"who":"user","value":true}}} | [{"op":"multiply","value":0.9}] | "Battle_Field.rb:1094-1128" |
| "specialDefense" | {"not":{"grounded":{"who":"user","value":true}}} | [{"op":"multiply","value":0.9}] | "Battle_Field.rb:1094-1128" |
| "speed" | {"grounded":{"who":"user","value":true}} | [{"op":"multiply","value":0.75}] | "Battler.rb:1187-1215" |
| "modifyMove" | {"all":[{"overlay":"rejuvenation:rainbow"},{"moveType":"Normal"},{"category":"Special"}]} | [{"op":"extraType","values":["Normal","Fire","Water","Electric","Grass","Ice","Fighting","Poison","Ground","Flying","Psychic","Bug","Rock","Ghost","Dragon","Dark","Steel","Fairy"],"excludePrimary":true,"layer":"overlay"}] | "Battle_Move.rb:837-838; Battle_Field.rb:117-136" |
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
| "modifyMove" | {"move":"stokedsparksurfer"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:electric_terrain","duration":3,"extendedBy":0,"blockEverstone":false,"message":"An electric current ran across the battlefield!"}]}] | "Battle_ZMove.rb:290-301" |
| "modifyMove" | {"move":"genesissupernova"} | [{"op":"moveProperty","path":"secondaries.0.self","value":null},{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:psychic_terrain","duration":5,"extendedBy":0,"blockEverstone":false,"message":"Psychic energy spread across the battlefield!"}]}] | "Battle_ZMove.rb:322-332" |
| "modifyMove" | {"move":"plasmafists"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:electric_terrain","duration":3,"extendedBy":3,"message":"An electric current ran across the battlefield!"}]}] | "Battle_MoveEffects.rb:8306-8320" |
| "modifyMove" | {"all":[{"move":"iondeluge"},{"not":{"pseudoWeather":{"id":"iondeluge","value":true}}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitField","actions":[{"op":"createField","field":"rejuvenation:electric_terrain","duration":3,"extendedBy":3,"message":"An electric current ran across the battlefield!"}]}] | "Battle_MoveEffects.rb:7500-7519" |
| "chargeMove" | {"move":"meteorbeam"} | [{"op":"reject"},{"op":"message","text":"{1} absorbed the starlight!"}] | "Battle_MoveEffects.rb:8840; Battler.rb:7033-7035" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"randomForm","variants":[{"species":"silvally","type":"Normal"},{"species":"silvallyfire","type":"Fire"},{"species":"silvallywater","type":"Water"},{"species":"silvallyelectric","type":"Electric"},{"species":"silvallygrass","type":"Grass"},{"species":"silvallyice","type":"Ice"},{"species":"silvallyfighting","type":"Fighting"},{"species":"silvallypoison","type":"Poison"},{"species":"silvallyground","type":"Ground"},{"species":"silvallyflying","type":"Flying"},{"species":"silvallypsychic","type":"Psychic"},{"species":"silvallybug","type":"Bug"},{"species":"silvallyrock","type":"Rock"},{"species":"silvallyghost","type":"Ghost"},{"species":"silvallydragon","type":"Dragon"},{"species":"silvallydark","type":"Dark"},{"species":"silvallysteel","type":"Steel"},{"species":"silvallyfairy","type":"Fairy"}],"message":"{1} transformed into the {type} type!"}] | "Battler.rb:1846-1848; Battle_Field.rb:1166-1175" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]} | [{"op":"randomForm","variants":[{"species":"arceus","type":"Normal"},{"species":"arceusfire","type":"Fire"},{"species":"arceuswater","type":"Water"},{"species":"arceuselectric","type":"Electric"},{"species":"arceusgrass","type":"Grass"},{"species":"arceusice","type":"Ice"},{"species":"arceusfighting","type":"Fighting"},{"species":"arceuspoison","type":"Poison"},{"species":"arceusground","type":"Ground"},{"species":"arceusflying","type":"Flying"},{"species":"arceuspsychic","type":"Psychic"},{"species":"arceusbug","type":"Bug"},{"species":"arceusrock","type":"Rock"},{"species":"arceusghost","type":"Ghost"},{"species":"arceusdragon","type":"Dragon"},{"species":"arceusdark","type":"Dark"},{"species":"arceussteel","type":"Steel"},{"species":"arceusfairy","type":"Fairy"}],"message":"{1} transformed into the {type} type!"}] | "Battler.rb:1846-1848; Battle_Field.rb:1166-1175" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"randomForm","variants":[{"species":"silvally","type":"Normal"},{"species":"silvallyfire","type":"Fire"},{"species":"silvallywater","type":"Water"},{"species":"silvallyelectric","type":"Electric"},{"species":"silvallygrass","type":"Grass"},{"species":"silvallyice","type":"Ice"},{"species":"silvallyfighting","type":"Fighting"},{"species":"silvallypoison","type":"Poison"},{"species":"silvallyground","type":"Ground"},{"species":"silvallyflying","type":"Flying"},{"species":"silvallypsychic","type":"Psychic"},{"species":"silvallybug","type":"Bug"},{"species":"silvallyrock","type":"Rock"},{"species":"silvallyghost","type":"Ghost"},{"species":"silvallydragon","type":"Dragon"},{"species":"silvallydark","type":"Dark"},{"species":"silvallysteel","type":"Steel"},{"species":"silvallyfairy","type":"Fairy"}],"message":"{1} transformed into the {type} type!"}] | "Battler.rb:1846-1848; Battle_Field.rb:1166-1175" |
| "residual" | {"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]} | [{"op":"randomForm","variants":[{"species":"arceus","type":"Normal"},{"species":"arceusfire","type":"Fire"},{"species":"arceuswater","type":"Water"},{"species":"arceuselectric","type":"Electric"},{"species":"arceusgrass","type":"Grass"},{"species":"arceusice","type":"Ice"},{"species":"arceusfighting","type":"Fighting"},{"species":"arceuspoison","type":"Poison"},{"species":"arceusground","type":"Ground"},{"species":"arceusflying","type":"Flying"},{"species":"arceuspsychic","type":"Psychic"},{"species":"arceusbug","type":"Bug"},{"species":"arceusrock","type":"Rock"},{"species":"arceusghost","type":"Ghost"},{"species":"arceusdragon","type":"Dragon"},{"species":"arceusdark","type":"Dark"},{"species":"arceussteel","type":"Steel"},{"species":"arceusfairy","type":"Fairy"}],"message":"{1} transformed into the {type} type!"}] | "Battler.rb:1846-1848; Battle_Field.rb:1166-1175" |
| "attack" | {"all":[{"globalAbility":["tabletsofruin"]},{"not":{"ability":{"who":"user","values":["tabletsofruin"]}}}]} | [{"op":"multiply","value":0.8893333333333334}] | "Battle_Move.rb:1471,1686" |
| "specialAttack" | {"all":[{"globalAbility":["vesselofruin"]},{"not":{"ability":{"who":"user","values":["vesselofruin"]}}}]} | [{"op":"multiply","value":0.8893333333333334}] | "Battle_Move.rb:1471,1686" |
| "defense" | {"all":[{"globalAbility":["swordofruin"]},{"not":{"ability":{"who":"user","values":["swordofruin"]}}}]} | [{"op":"multiply","value":0.8893333333333334}] | "Battle_Move.rb:1471,1686" |
| "specialDefense" | {"all":[{"globalAbility":["beadsofruin"]},{"not":{"ability":{"who":"user","values":["beadsofruin"]}}}]} | [{"op":"multiply","value":0.8893333333333334}] | "Battle_Move.rb:1471,1686" |
| "attack" | {"sideAbility":{"who":"user","values":["victorystar"]}} | [{"op":"multiply","value":1.5}] | "Battle_Move.rb:1593-1597" |
| "specialAttack" | {"sideAbility":{"who":"user","values":["victorystar"]}} | [{"op":"multiply","value":1.5}] | "Battle_Move.rb:1593-1597" |
| "damage" | {"all":[{"all":[{"moveType":"Poison"},{"sideAbility":{"who":"target","values":["pastelveil"]}}]},{"overlay":"rejuvenation:misty_terrain"}]} | [{"op":"multiply","value":0.5}] | "Battle_Move.rb:1821" |
| "modifyMove" | {"any":[{"move":"photongeyser"},{"move":"lightthatburnsthesky"}]} | [{"op":"moveBehavior","recipe":"smartCategory","comparison":"offense","contactByCategory":false,"specialMultipliers":[{"condition":{"allyAbility":{"who":"user","values":["battery"]}},"factor":1.3},{"condition":{"all":[{"ability":{"who":"user","values":["flareboost"]}},{"pokemonStatus":"brn"}]},"factor":1.5}],"physicalMultipliers":[],"defenseMultipliers":[],"specialDefenseMultipliers":[]}] | "Battle_Move.rb:359-390" |
| "modifyMove" | {"move":"shellsidearm"} | [{"op":"moveBehavior","recipe":"smartCategory","comparison":"difference","contactByCategory":true,"specialMultipliers":[{"condition":{"allyAbility":{"who":"user","values":["battery"]}},"factor":1.3},{"condition":{"all":[{"ability":{"who":"user","values":["flareboost"]}},{"pokemonStatus":"brn"}]},"factor":1.5}],"physicalMultipliers":[{"condition":{"ability":{"who":"user","values":["toughclaws"]}},"factor":1.3}],"defenseMultipliers":[{"condition":{"all":[{"effectiveAbility":{"who":"target","values":["fluffy"]}},{"not":{"ability":{"who":"user","values":["longreach"]}}}]},"factor":2}],"specialDefenseMultipliers":[{"condition":{"effectiveAbility":{"who":"target","values":["icescales"]}},"factor":2}]}] | "Battle_Move.rb:359-390" |
| "modifyMove" | {"all":[{"move":"terastarstorm"},{"species":{"who":"user","value":"terapagos"}},{"formName":{"who":"user","value":"Stellar"}}]} | [{"op":"moveBehavior","recipe":"smartCategory","comparison":"offense","contactByCategory":false,"specialMultipliers":[{"condition":{"allyAbility":{"who":"user","values":["battery"]}},"factor":1.3},{"condition":{"all":[{"ability":{"who":"user","values":["flareboost"]}},{"pokemonStatus":"brn"}]},"factor":1.5}],"physicalMultipliers":[],"defenseMultipliers":[],"specialDefenseMultipliers":[]}] | "Battle_Move.rb:359-390; Battle_MoveEffects.rb:9817-9838" |
| "attack" | {"all":[{"moveType":"Fire"},{"item":{"who":"target","values":["nevermeltice"]}},{"stateFlag":"neverMeltIce"}]} | [{"op":"multiply","value":0.66},{"op":"moveMessage","text":"The Never-Melt Ice's sheer cold weakened {move}'s power!"}] | "Battle_Move.rb:1570-1573,1939-1944" |
| "specialAttack" | {"all":[{"moveType":"Fire"},{"item":{"who":"target","values":["nevermeltice"]}},{"stateFlag":"neverMeltIce"}]} | [{"op":"multiply","value":0.66},{"op":"moveMessage","text":"The Never-Melt Ice's sheer cold weakened {move}'s power!"}] | "Battle_Move.rb:1570-1573,1939-1944" |
| "modifyMove" | {"move":"naturesmadness"} | [{"op":"moveBehavior","recipe":"fixedDamage","basis":"targetMaxHP","factor":0.5,"message":null}] | "Battle_MoveEffects.rb:2436-2437" |
| "modifyMove" | {"move":"ruination"} | [{"op":"moveBehavior","recipe":"fixedDamage","basis":"targetMaxHP","factor":0.5,"message":null}] | "Battle_MoveEffects.rb:2436-2437" |
| "modifyMove" | {"move":"lunarblessing"} | [{"op":"moveBehavior","recipe":"replaceHitActions","actions":[{"op":"heal","who":"target","fraction":0.33,"round":true},{"op":"cureStatus","who":"target"}]}] | "Battle_MoveEffects.rb:9064" |
| "modifyMove" | {"move":"junglehealing"} | [{"op":"moveBehavior","recipe":"replaceHitActions","actions":[{"op":"heal","who":"target","fraction":0.33,"round":true},{"op":"cureStatus","who":"target"}]}] | "Battle_MoveEffects.rb:9064" |
| "modifyMove" | {"all":[{"move":"weatherball"},{"weather":"shadowsky"}]} | [{"op":"moveType","type":"Shadow"},{"op":"moveProperty","path":"basePower","value":100}] | "Battle_MoveEffects.rb:2914,2928" |
| "weatherReconcile" | {"all":[{"weatherActive":true},{"not":{"globalAbility":["tempest"]}}]} | [{"op":"clearWeather","message":"The weather disappeared into space!"}] | "Battle_Field.rb:215-232" |
| "modifyMoveLate" | {"all":[{"item":{"who":"user","values":["kingsrock","razorfang"]}},{"baseCanFlinch":false},{"any":[{"field":"rejuvenation:rainbow"},{"overlay":"rejuvenation:rainbow"},{"ability":{"who":"user","values":["serenegrace"]}}]}]} | [{"op":"secondaryChance","chance":20,"volatileStatus":"flinch"}] | "Battler.rb:3544-3548" |
| "modifyMoveLate" | {"all":[{"item":{"who":"user","values":["kingsrock","razorfang"]}},{"sheerForce":true}]} | [{"op":"moveProperty","path":"secondaries","value":[]}] | "Battler.rb:3544 (Sheer Force with a secondary effect suppresses item flinch)" |
| "modifyMove" | {"all":[{"move":"expandingforce"},{"any":[{"field":"rejuvenation:psychic_terrain"},{"overlay":"rejuvenation:psychic_terrain"}]}]} | [{"op":"moveProperty","path":"target","value":"allAdjacentFoes"}] | "Battler.rb:4979-4980 (spread regardless of user grounding)" |

## Original status-move highlights

Source UI buff highlights: `["darkvoid","heartswap","trickroom","magicroom","wonderroom","cosmicpower","flash","moonlight","lunardance","naturesmadness","lunarblessing","guardianofalola","junglehealing","takeheart","ruination"]`.

Source UI nerf highlights: `["sunnyday","raindance","sandstorm","hail","snowscape","chillyreception","shadowsky","electricterrain","grassyterrain","mistyterrain","psychicterrain"]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["cosmicpower","flash","guardianofalola","heartswap","junglehealing","lunarblessing","moonlight","naturesmadness","ruination","takeheart"],"unreviewedHighlightedMoves":["chillyreception","darkvoid","electricterrain","grassyterrain","hail","lunardance","magicroom","mistyterrain","psychicterrain","raindance","sandstorm","shadowsky","snowscape","sunnyday","trickroom","wonderroom"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Each row shows its recorded semantic decision and the named regression tests that prove it; the disposition, not the listing, is the evidence.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Balls.rb:166 | PBDayNight.isNight?(pbGetTimeNow) \|\| [:DARKCRYSTALCAVERN, :SHORTCIRCUIT, :UNDERWATER, :CAVE, :CRYSTALCAVERN, :DRAGONSDEN, :STARLIGHT, :NEWWORLD, :INVERSE].include?(battle.FE) | implemented_and_tested | Dusk Ball catch rate is 3.5x on its nine dark fields. Tests: capture metadata covers every original field branch and rejects bad factors |
| Battle.rb:386 | @field.effect == :NEWWORLD | implemented_and_tested | No weather can be created on the New World; the attempt shows "The weather drifted off into space...". Tests: fields refuse or convert the weather they cannot hold |
| Battle.rb:531 | @field.effect == :ELECTERRAIN \|\| @field.overlay == :ELECTERRAIN \|\| @field.effect == :NEWWORLD | implemented_and_tested | quarkdriveCheck runs when an overlay is set, when the hard field changes to a different field family and when an Electric Terrain overlay ends. Electric Terrain, an Electric overlay or New World boosts unboosted Quark Drive holders; otherwise an environmental boost wears off and Booster Energy, if held, replaces it once. A Booster boost is never removed and an existing boost never re-picks its stat. The check precedes noOverlay, so an overlay removed by the new field still counts. Tests: Quark Drive is re-examined when the field or an overlay changes and when an Electric Terrain overlay ends, paradox abilities entering the field are boosted only by Electric Terrain or sunlight, otherwise by Booster Energy, paradox boosts survive complete turns without duplicate activations |
| Battle.rb:540 | @field.effect == :NEWWORLD | implemented_and_tested | The activation line names the ethereal energy on New World and the Electric Terrain otherwise. Tests: Quark Drive is re-examined when the field or an overlay changes and when an Electric Terrain overlay ends, paradox abilities entering the field are boosted only by Electric Terrain or sunlight, otherwise by Booster Energy |
| Battle.rb:564 | pbWeather(nil) == :SUNNYDAY \|\| @field.effect == :NEWWORLD \|\| Rejuv && [:DESERT].include?(@battle.FE) | implemented_and_tested | protosynthesisCheck runs only when weather starts or ends and when Cloud Nine or Air Lock enters or leaves. Sunlight, New World or Desert boosts unboosted Protosynthesis holders at such a check; otherwise the environmental boost wears off and Booster Energy replaces it once. Field changes are not a check, so Desert boosts nothing until the weather next changes and the boost outlives the Desert until then. Tests: Protosynthesis is re-examined only when the weather changes, where Desert and New World also qualify, paradox abilities entering the field are boosted only by Electric Terrain or sunlight, otherwise by Booster Energy, paradox boosts survive complete turns without duplicate activations |
| Battle.rb:573 | @field.effect == :NEWWORLD | implemented_and_tested | The activation line names the ethereal energy on New World and the harsh sunlight otherwise, including on Desert without sun. Tests: Protosynthesis is re-examined only when the weather changes, where Desert and New World also qualify |
| Battle.rb:721 | @field.effect == :NEWWORLD | implemented_and_tested | Gravity on New World creates a forced Starlight hard field using Gravity's current duration. The field counts down independently, restores when Gravity is removed, and becomes permanent on a subsequent hard-field transformation. Source activation flavor and restoration flavor are dispatched in order. Tests: Gravity reforms New World with its exact clock and restores when gravity is removed, Gravity temporary field becomes permanent on a subsequent hard transformation |
| Battle.rb:6115 | [:CRYSTALCAVERN, :NEWWORLD].include?(@field.effect) | implemented_and_tested | Mimicry changes type again every round on Crystal Cavern (following the cycle) and the New World. Tests: the Volcanic Top eruption, petrified Speed and Mimicry resolve at the end of the round |
| Battle.rb:7319 | @battle.FE == :NEWWORLD | unreachable_in_build | World of Nightmares chip damage is doubled on the New World. Tests:  |
| Battle.rb:8018 | [:STARLIGHT, :NEWWORLD, :BIGTOP, :DANCEFLOOR].include?(@field.effect) | implemented_and_tested | On Starlight, New World and Big Top fields Lunar Dance is granted even to a healthy replacement with full PP. Tests: Healing Wish and Lunar Dance are granted even to a healthy replacement on their fields |
| Battle.rb:8024 | [:STARLIGHT, :NEWWORLD, :BIGTOP, :DANCEFLOOR].include?(@field.effect) | implemented_and_tested | The replacement then receives the field boost. Tests: Healing Wish and Lunar Dance are granted even to a healthy replacement on their fields |
| Battle.rb:8026 | [:NEWWORLD, :BIGTOP, :DANCEFLOOR].include?(@field.effect) | implemented_and_tested | On the New World and Big Top the boost is +1 to all five stats. Tests: Healing Wish and Lunar Dance are granted even to a healthy replacement on their fields |
| Battle_Field.rb:92 | :NEWWORLD | implemented_and_tested | New World rolls a random type, typeless in previews. Tests: New World Multitype and RKS System roll native forms excluding the current type |
| Battle_Field.rb:232 | @field.effect == :NEWWORLD | implemented_and_tested | New World removes existing weather with its source line. Tests: entering a weatherless or hot field removes the weather it cannot hold, weather creation rejects before native start while field entry clears existing weather |
| Battle_Field.rb:252 | @field.effect == :NEWWORLD \|\| @field.effect == :UNDERWATER | unsupported | New World and Underwater never restore the overworld weather. Tests:  |
| Battle_Field.rb:267 | :NEWWORLD | implemented_and_tested | New World drops an overlay with its source line. Tests: overlays are dropped, kept or refused according to the hard field, hard field entry removes only source-incompatible overlays |
| Battle_Field.rb:288 | @field.effect == :NEWWORLD | implemented_and_tested | New World refuses field changes. Tests: overlays are dropped, kept or refused according to the hard field, creation policies reject terrain with exact original messages |
| Battle_Field.rb:1107 | :NEWWORLD | implemented_and_tested | New World airborne defenders use 0.9 on both defensive paths; grounded defenders retain 1. Tests: every compiled field defense branch uses the source type, stat and weather gates, Mega Sol overrides hail for field defense, Deux Finalis defense uses attacker-relative weather |
| Battle_Inspect.rb:4 | [:STARLIGHT, :NEWWORLD].include?(@battle.FE) | presentation_only | Battle Inspect screen: recomputes a multiplier or status line for display in the stat-inspection panel. Tests:  |
| Battle_Move.rb:1471 | @battle.FE == :NEWWORLD | implemented_and_tested | The ruin abilities lower the affected stat to 0.667 on New World instead of 0.75. Tests: ruin abilities use the New World and Holy factors and spare a partner on the source dimensional list |
| Battle_Move.rb:1503 | attacker.ability == :HADRONENGINE && (@battle.FE == :NEWWORLD \|\| @battle.FE == :ELECTERRAIN \|\| @battle.OV == :ELECTERRAIN) | implemented_and_tested | Hadron Engine is active on New World as well as on Electric Terrain (hard field or overlay). Tests: stat-doubling and terrain abilities follow their source field conditions |
| Battle_Move.rb:1523 | attacker.ability == :ORICHALCUMPULSE && (weather == :SUNNYDAY \|\| @battle.FE == :NEWWORLD) | implemented_and_tested | Orichalcum Pulse is active on New World without sun. Tests: stat-doubling and terrain abilities follow their source field conditions |
| Battle_Move.rb:1593 | [:STARLIGHT, :NEWWORLD].include?(@battle.FE) | implemented_and_tested | Victory Star multiplies the attacking stat of its side by 1.5 on Starlight and New World. Tests: Victory Star, Propeller Tail and Skill Link gain their source field attack bonuses |
| Battle_Move.rb:1686 | @battle.FE == :NEWWORLD | implemented_and_tested | Defensive ruin modifier on New World, same factor as the offensive one. Tests: ruin abilities use the New World and Holy factors and spare a partner on the source dimensional list |
| Battle_Move.rb:1701 | opponent.ability == :HADRONENGINE && (@battle.FE == :NEWWORLD \|\| @battle.FE == :ELECTERRAIN \|\| @battle.OV == :ELECTERRAIN) | implemented_and_tested | Defensive Special Attack borrowing includes ordinary Hadron Engine under Electric overlays. The shared pool is active only on Glitch; direct stat ability branches are tested separately on their hard fields. Tests: Glitch defensive shared Special borrows the fully modified Special Attack under ordinary field overlays, stat-doubling and terrain abilities follow their source field conditions |
| Battle_Move.rb:1812 | opponent.ability == :SHADOWSHIELD && [:STARLIGHT, :NEWWORLD, :DARKCRYSTALCAVERN].include?(@battle.FE) && opponent.damagestate.typemod.superEffective? | implemented_and_tested | Shadow Shield additionally multiplies super-effective damage by 0.75 on Starlight, New World and Dark Crystal Cavern. Tests: Shadow Shield follows the source Dimensional and starlit field rules |
| Battle_MoveEffects.rb:993 | [:MISTY, :RAINBOW, :HOLY, :STARLIGHT, :NEWWORLD, :PSYTERRAIN].include?(@battle.FE) && @move == :COSMICPOWER | implemented_and_tested | Cosmic Power raises both defenses two stages on its six source fields. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_MoveEffects.rb:1503 | [:SHORTCIRCUIT, :DARKCRYSTALCAVERN, :MIRROR, :STARLIGHT, :NEWWORLD, :DARKNESS1].include?(@battle.FE) && @move == :FLASH | implemented_and_tested | Flash lowers accuracy two stages on Short Circuit, Dark Crystal Cavern, Starlight and New World. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_MoveEffects.rb:1777 | @battle.FE == :NEWWORLD && !blockedBySubstitute?(attacker, opponent) | implemented_and_tested | New World Heart Swap also averages the HP of user and target unless a substitute blocks it. Tests: New World Heart Swap shares capped HP after swapping stat stages |
| Battle_MoveEffects.rb:2436 | [:RUINATION, :NATURESMADNESS].include?(@move) && @battle.FE == :NEWWORLD | implemented_and_tested | Nature's Madness and Ruination remove half of maximum HP on New World. Tests: fixed-damage moves use their source field amounts |
| Battle_MoveEffects.rb:5237 | ([:DARKCRYSTALCAVERN, :STARLIGHT, :NEWWORLD, :BEWITCHED].include?(@battle.FE) && @move == :MOONLIGHT) \|\| (Rejuv && @battle.FE == :GRASSY && @move == :SYNTHESIS) | implemented_and_tested | Moonlight restores 75 percent on Dark Crystal Cavern, Starlight, New World and Bewitched Woods, and Synthesis on Grassy Terrain. Tests: healing moves restore their source field shares |
| Battle_MoveEffects.rb:6137 | [:NEWWORLD, :PSYTERRAIN].include?(@battle.FE) \|\| attacker.hasWorkingItem(:AMPLIFIELDROCK) \|\| (Rejuv && @battle.FE == :STARLIGHT) | implemented_and_tested | Magic Room lasts eight turns on New World, Psychic Terrain and Starlight. Tests: room and Gravity clocks use source fields and working Amplifield Rock |
| Battle_MoveEffects.rb:6959 | [:CHESS, :NEWWORLD, :PSYTERRAIN].include?(@battle.FE) \|\| attacker.hasWorkingItem(:AMPLIFIELDROCK) \|\| (Rejuv && @battle.FE == :STARLIGHT) | implemented_and_tested | Trick Room lasts eight turns on Chess Board, New World, Psychic Terrain and Starlight. Tests: room and Gravity clocks use source fields and working Amplifield Rock |
| Battle_MoveEffects.rb:7029 | [:NEWWORLD, :PSYTERRAIN].include?(@battle.FE) \|\| attacker.hasWorkingItem(:AMPLIFIELDROCK) \|\| (Rejuv && @battle.FE == :STARLIGHT) | implemented_and_tested | Wonder Room lasts eight turns on New World, Psychic Terrain and Starlight. Tests: room and Gravity clocks use source fields and working Amplifield Rock |
| Battle_MoveEffects.rb:8840 | [:STARLIGHT, :NEWWORLD].include?(@battle.FE) | implemented_and_tested | Meteor Beam needs no charging turn on Starlight and New World. Tests: field two-turn Geomancy, Meteor Beam and Electro Shot skip charging |
| Battle_MoveEffects.rb:9064 | (@move == :LUNARBLESSING && [:STARLIGHT, :NEWWORLD, :HOLY].include?(@battle.FE)) \|\| (@move == :JUNGLEHEALING && [:FOREST, :HOLY, :NEWWORLD].include?(@battle.FE)) | implemented_and_tested | Lunar Blessing and Jungle Healing restore 33 percent on their source fields. Tests: Factory Gear Up, Corrupted Toxic Thread and the blessing moves use their field amounts, ally-targeting moves use their field amounts in double battles |
| Battle_MoveEffects.rb:9231 | [:WATERSURFACE, :UNDERWATER, :HOLY, :NEWWORLD].include?(@battle.FE) | implemented_and_tested | Take Heart raises both stats two stages on Water Surface, Underwater, Holy and New World. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_ZMove.rb:359 | @battle.FE == :NEWWORLD | implemented_and_tested | New World Guardian of Alola removes 75 percent of maximum HP. Tests: New World Guardian of Alola uses target maximum HP |
| Battler.rb:1190 | :NEWWORLD | implemented_and_tested | New World multiplies grounded Speed by .75; airborne users retain ordinary Speed. Tests: ordinary field speed predicates cover grounding, Water types, abilities, overlays and held items |
| Battler.rb:1846 | @battle.FE == :NEWWORLD | implemented_and_tested | New World rolls an ordinary Arceus/Silvally type/form excluding its current type on entry/end round; native held-item typing must not overwrite the roll. Leaving the field restores the item form only at the next source form check. Tests: New World form typing survives native held-item callbacks and restores after leaving |
| Battler.rb:2822 | self.ability == :HADRONENGINE && @battle.FE == :NEWWORLD | implemented_and_tested | Hadron Engine on New World only shows its source flavor; no terrain is created. Tests: paradox engines draw on New World without creating terrain or sun |
| Battler.rb:2960 | self.ability == :ORICHALCUMPULSE && @battle.FE == :NEWWORLD | implemented_and_tested | Orichalcum Pulse on New World only shows its source flavor and starts no sun. Tests: paradox engines draw on New World without creating terrain or sun |
| Battler.rb:4233 | :NEWWORLD | implemented_and_tested | New World Seed imposes native recharge on the next chosen move. Tests: New World seed applies native recharge instead of an unused volatile |
| Battler.rb:5307 | [:BURNING, :VOLCANIC, :NEWWORLD].include?(@battle.FE) | implemented_and_tested | Burning Bulwark also blocks status moves on Volcanic and New World. :BURNING is not a field in this game. Tests: field-favoured shields also stop status moves |
| Battler.rb:7273 | self.ability == :ORICHALCUMPULSE && (weather == :SUNNYDAY \|\| @battle.FE == :NEWWORLD) | implemented_and_tested | Orichalcum Pulse draws its native Attack boost from New World without creating sun. Tests: stat-doubling and terrain abilities follow their source field conditions |
| Battler.rb:7275 | @battle.FE == :NEWWORLD | implemented_and_tested | New World global ruin factor is .667. Tests: ruin abilities use the New World and Holy factors and spare a partner on the source dimensional list |
| Battler.rb:7310 | @battle.FE == :NEWWORLD | implemented_and_tested | New World defensive ruin multiplier is .667. Tests: ruin abilities use the New World and Holy factors and spare a partner on the source dimensional list |
| Battler.rb:7330 | @battle.FE == :NEWWORLD | implemented_and_tested | New World Vessel of Ruin Special Attack factor is .667. Tests: ruin abilities use the New World and Holy factors and spare a partner on the source dimensional list |
| Battler.rb:7345 | self.ability == :HADRONENGINE && (@battle.FE == :NEWWORLD \|\| @battle.FE == :ELECTERRAIN \|\| @battle.OV == :ELECTERRAIN) | implemented_and_tested | Hadron Engine draws its native Special Attack boost from New World/Electric hard field/overlay. Tests: stat-doubling and terrain abilities follow their source field conditions |
| Battler.rb:7385 | @battle.FE == :NEWWORLD | implemented_and_tested | New World Beads of Ruin Special Defense factor is .667. Tests: ruin abilities use the New World and Holy factors and spare a partner on the source dimensional list |

AI source leads: 35. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":["mirrorbeam","doomdummy","shadowsky","futuredummy"],"abilities":[],"items":[]}`.
