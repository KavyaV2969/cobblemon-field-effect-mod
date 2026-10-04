# Electric Terrain

Original ID: `ELECTERRAIN`; datapack ID: `rejuvenation:electric_terrain`.

**Status:** implemented; every runtime source lead is implemented and tested or recorded as an exclusion or limitation. Compiled definition comparison passed. Not certified through exhaustive live or multiplayer play. Field-specific exceptions are listed in [FIELD_COVERAGE.md](../FIELD_COVERAGE.md).

## Initialization

Entry text: "The field is hyper-charged!"

Nature Power: `thunderbolt`. Secret Power animation/reference move: `shockwave`.

Secret Power actual secondary choices: `[{"status":"par"}]`.

Mimicry type: `Electric`; Burmy cloak reference: `TRASHCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"elementalseed","effect":"charge","duration":2,"message":"{1} began charging power!","stats":{"spe":1}}`. Seed actions: `null`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{"thundercage":1},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820","sourceAbilities":["gravitycontrol"]},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":8,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `null` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The field electrified again!"`.

Shared stat pools: `null`. Absorber policies: `null`. Indirect immunity: `null`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"static":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"conditional","condition":{"all":[{"contact":{"who":"target"}},{"chance":{"numerator":6,"denominator":10}}]},"actions":[{"op":"status","who":"target","status":"par"}]}],"source":"Battler.rb:3669"}},"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":5,"extendedBy":3,"blockEverstone":false}],"source":"Battler.rb:3926"}},"comatose":{"onStart":{"mode":"replace","condition":{"always":true},"actions":[],"source":"Battler.rb:1131"},"onSetStatus":{"mode":"replace","condition":{"always":true},"actions":[],"source":"Battler.rb:1131"}},"galvanize":{"onBasePower":{"mode":"replace","condition":{"abilityChangedType":true},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1249"}},"pixilate":{"onBasePower":{"mode":"replace","condition":{"all":[{"abilityChangedType":true},{"overlay":"rejuvenation:misty_terrain"}]},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1262"}},"battery":{"onAllyBasePower":{"mode":"replace","condition":{"all":[{"category":"Special"},{"holderIsUser":false}]},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1302"}},"purepower":{"onModifyAtk":{"mode":"replace","condition":{"overlay":"rejuvenation:psychic_terrain"},"actions":[],"source":"Battle_Move.rb:1517"}},"plus":{"onModifySpA":{"mode":"replace","condition":{"always":true},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1495-1499"}},"minus":{"onModifySpA":{"mode":"replace","condition":{"always":true},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1495-1499"}},"transistor":{"onModifyAtk":{"mode":"replace","condition":{"moveType":"Electric"},"actions":[{"op":"multiply","value":1.6}],"source":"Battle_Move.rb:1535"},"onModifySpA":{"mode":"replace","condition":{"moveType":"Electric"},"actions":[{"op":"multiply","value":1.6}],"source":"Battle_Move.rb:1535"}},"marvelscale":{"onModifyDef":{"mode":"replace","condition":{"overlay":"rejuvenation:misty_terrain"},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1724"}},"hadronengine":{"onStart":{"mode":"replace","condition":{"always":true},"actions":[{"op":"abilityMessage"},{"op":"message","text":"{1} used the Electric Terrain to energize its futuristic engine!"}],"source":"Battler.rb:2824-2825"}},"tempest":{"onEnd":{"mode":"replace","condition":{"always":true},"actions":[{"op":"reconcileWeather"}],"source":"Battler.rb:3515-3516"}},"slowstart":{"onStart":{"mode":"replace","condition":{"always":true},"actions":[{"op":"volatile","id":"slowstart","silent":true,"message":"{1} is slow to get going!"}],"source":"Battler.rb:3288-3289 (clock retained even on Deep Earth)"}}}`. Inactive abilities: `["comatose"]`. Status type bypass: `null`.

Field form typing: `["arceus","silvally"]`. Custom volatile rules: `null`. Rampage policy: `null`.

Progression: `null`. Party roles: `null`.

Field clock policy: `null`.

Fields persist for the battle unless transformed/destroyed. Move/ability terrain creation uses its own finite duration; engine stack restoration and overlay clocks are described in ARCHITECTURE.md.

## Core move rules

| Move ID | Executable properties and exact source text |
|---|---|
| `explosion` | {"multiplier":1.5,"additionalType":"ELECTRIC","message":"The explosion became hyper-charged!"} |
| `selfdestruct` | {"multiplier":1.5,"additionalType":"ELECTRIC","message":"The explosion became hyper-charged!"} |
| `hurricane` | {"multiplier":1.5,"additionalType":"ELECTRIC","message":"The attack became hyper-charged!"} |
| `surf` | {"multiplier":1.5,"additionalType":"ELECTRIC","message":"The attack became hyper-charged!"} |
| `smackdown` | {"multiplier":1.5,"additionalType":"ELECTRIC","message":"The attack became hyper-charged!"} |
| `muddywater` | {"multiplier":1.5,"additionalType":"ELECTRIC","message":"The attack became hyper-charged!"} |
| `thousandarrows` | {"multiplier":1.5,"additionalType":"ELECTRIC","message":"The attack became hyper-charged!"} |
| `wildboltstorm` | {"multiplier":1.5,"message":"The attack became hyper-charged!"} |
| `hydrovortex` | {"multiplier":1.5,"additionalType":"ELECTRIC","message":"The attack became hyper-charged!"} |
| `magnetbomb` | {"multiplier":2.0,"message":"The attack powered up!"} |
| `tectonicrage` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The hyper-charged terrain shorted out!"}} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Electric"} | {"condition":{"not":{"grounded":{"who":"user","value":false}}},"multiplier":1.5,"message":"The Electric Terrain strengthened the attack!"} |

## Overlay definition

```json
{
  "moves": {
    "explosion": {
      "multiplier": 1.5,
      "additionalType": "ELECTRIC",
      "message": "The explosion became hyper-charged!"
    },
    "selfdestruct": {
      "multiplier": 1.5,
      "additionalType": "ELECTRIC",
      "message": "The explosion became hyper-charged!"
    },
    "hurricane": {
      "multiplier": 1.5,
      "additionalType": "ELECTRIC",
      "message": "The attack became hyper-charged!"
    },
    "surf": {
      "multiplier": 1.5,
      "additionalType": "ELECTRIC",
      "message": "The attack became hyper-charged!"
    },
    "smackdown": {
      "multiplier": 1.5,
      "additionalType": "ELECTRIC",
      "message": "The attack became hyper-charged!"
    },
    "muddywater": {
      "multiplier": 1.5,
      "additionalType": "ELECTRIC",
      "message": "The attack became hyper-charged!"
    },
    "thousandarrows": {
      "multiplier": 1.5,
      "additionalType": "ELECTRIC",
      "message": "The attack became hyper-charged!"
    },
    "wildboltstorm": {
      "multiplier": 1.5,
      "message": "The attack became hyper-charged!"
    },
    "magnetbomb": {
      "multiplier": 2.0,
      "message": "The attack powered up!"
    }
  },
  "types": [
    {
      "match": {
        "moveType": "Electric"
      },
      "condition": {
        "all": [
          {
            "not": {
              "grounded": {
                "who": "user",
                "value": false
              }
            }
          },
          {
            "not": {
              "field": "rejuvenation:short_circuit"
            }
          }
        ]
      },
      "multiplier": 1.3,
      "message": "The Electric Terrain strengthened the attack!"
    }
  ]
}
```

## Type-chart exceptions

| Attacking type | Defending type | Result exponent / immunity | Condition |
|---|---|---|---|
| "Electric" | "Ground" | 0 | {"ability":{"who":"user","values":["teravolt"]}} |

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "switchIn" | {"ability":{"who":"user","values":["lightningrod","electromorphosis"]}} | [{"op":"boost","stats":{"spa":1}}] | "Battler.rb:2035" |
| "setStatus" | {"all":[{"grounded":{"who":"target","value":true}},{"status":"slp"}]} | [{"op":"reject"}] | "Battler.rb:electric sleep immunity" |
| "modifyMove" | {"all":[{"overlay":"rejuvenation:rainbow"},{"not":{"all":[{"ability":{"who":"user","values":["serenegrace"]}},{"canFlinch":true}]}}]} | [{"op":"secondaryChance","multiplier":2}] | "Battle_Move.rb:2328-2329" |
| "switchIn" | {"item":{"who":"user","values":["cellbattery"]}} | [{"op":"consume"}] | "Battler.rb:4320; native Cell Battery use event supplies +1 Attack" |
| "speed" | {"ability":{"who":"user","values":["steadfast"]}} | [{"op":"multiply","value":1.5}] | "Battler.rb:1187-1215" |
| "modifyMove" | {"all":[{"overlay":"rejuvenation:rainbow"},{"moveType":"Normal"},{"category":"Special"}]} | [{"op":"extraType","values":["Normal","Fire","Water","Electric","Grass","Ice","Fighting","Poison","Ground","Flying","Psychic","Bug","Rock","Ghost","Dragon","Dark","Steel","Fairy"],"excludePrimary":true,"layer":"overlay"}] | "Battle_Move.rb:837-838; Battle_Field.rb:117-136" |
| "residual" | {"ability":{"who":"user","values":["voltabsorb"]}} | [{"op":"heal","fraction":0.0625,"message":"{1} absorbed stray electricity!"}] | "Battle.rb:5850-6109" |
| "residual" | {"all":[{"ability":{"who":"user","values":["motordrive"]}},{"turnsActive":{"op":">","value":0}}]} | [{"op":"boost","stats":{"spe":1}}] | "Battle.rb:5858" |
| "speed" | {"all":[{"ability":{"who":"user","values":["quickfeet"]}},{"field":"rejuvenation:electric_terrain"},{"pokemonStatus":""}]} | [{"op":"multiply","value":1.5}] | "Battle_Effects.rb:1457-1462; Battler.rb:1179" |
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
| "modifyMove" | {"move":"charge"} | [{"op":"moveProperty","path":"boosts","value":{"spd":2}}] | "Battle_MoveEffects.rb:857" |
| "modifyMove" | {"move":"electroweb"} | [{"op":"moveProperty","path":"secondaries.0.boosts","value":{"spe":-2}}] | "Battle_MoveEffects.rb:1428" |
| "modifyMove" | {"move":"wildcharge"} | [{"op":"moveProperty","path":"recoil","value":null}] | "Battle_MoveEffects.rb:123" |
| "modifyMove" | {"move":"wildcharge"} | [{"op":"moveProperty","path":"recoil","value":null}] | "Battle_MoveEffects.rb:123" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "modifyMove" | {"move":"stokedsparksurfer"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:electric_terrain","duration":3,"extendedBy":0,"blockEverstone":false,"message":"An electric current ran across the battlefield!"}]}] | "Battle_ZMove.rb:290-301" |
| "modifyMove" | {"move":"genesissupernova"} | [{"op":"moveProperty","path":"secondaries.0.self","value":null},{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:psychic_terrain","duration":5,"extendedBy":0,"blockEverstone":false,"message":"Psychic energy spread across the battlefield!"}]}] | "Battle_ZMove.rb:322-332" |
| "modifyMove" | {"move":"plasmafists"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:electric_terrain","duration":3,"extendedBy":3,"message":"An electric current ran across the battlefield!"}]}] | "Battle_MoveEffects.rb:8306-8320" |
| "modifyMove" | {"all":[{"move":"iondeluge"},{"not":{"pseudoWeather":{"id":"iondeluge","value":true}}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitField","actions":[{"op":"createField","field":"rejuvenation:electric_terrain","duration":3,"extendedBy":3,"message":"An electric current ran across the battlefield!"}]}] | "Battle_MoveEffects.rb:7500-7519" |
| "modifyMove" | {"move":"eerieimpulse"} | [{"op":"moveProperty","path":"boosts","value":{"spa":-3}}] | "Battle_MoveEffects.rb:7222" |
| "chargeMove" | {"move":"electroshot"} | [{"op":"reject"}] | "Battle_MoveEffects.rb:9783" |
| "modifyMove" | {"move":"electrify"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"type","type":"Electric","who":"target"}]}] | "Battle_MoveEffects.rb:7639" |
| "modifyMove" | {"move":"mudsport"} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitField","actions":[{"op":"changeField","field":"rejuvenation:indoor","duration":5,"force":true,"boundCondition":"mudsport","message":"The hyper-charged terrain shorted out!"}]}] | "Battle_MoveEffects.rb:3357-3361" |
| "modifyMove" | {"move":"magneticflux"} | [{"op":"moveBehavior","recipe":"alliesHitActions","condition":{"always":true},"actions":[{"op":"conditional","condition":{"ability":{"who":"target","values":["plus","minus"]}},"actions":[{"op":"boost","who":"target","stats":{"def":2,"spd":2}}]},{"op":"conditional","condition":{"not":{"ability":{"who":"target","values":["plus","minus"]}}},"actions":[{"op":"boost","who":"target","stats":{"def":1,"spd":1}}]}]}] | "Battle_MoveEffects.rb:7475" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["gulpmissile"]}},{"species":{"who":"user","value":"cramorant"}},{"formName":{"who":"user","value":"Gulping"}}]} | [{"op":"form","species":"cramorantgorging"}] | "Battler.rb:1720-1729" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "damage" | {"all":[{"all":[{"moveType":"Poison"},{"sideAbility":{"who":"target","values":["pastelveil"]}}]},{"overlay":"rejuvenation:misty_terrain"}]} | [{"op":"multiply","value":0.5}] | "Battle_Move.rb:1821" |
| "modifyMove" | {"any":[{"move":"photongeyser"},{"move":"lightthatburnsthesky"}]} | [{"op":"moveBehavior","recipe":"smartCategory","comparison":"offense","contactByCategory":false,"specialMultipliers":[{"condition":{"allyAbility":{"who":"user","values":["battery"]}},"factor":1.5},{"condition":{"all":[{"ability":{"who":"user","values":["flareboost"]}},{"pokemonStatus":"brn"}]},"factor":1.5}],"physicalMultipliers":[],"defenseMultipliers":[],"specialDefenseMultipliers":[]}] | "Battle_Move.rb:359-390" |
| "modifyMove" | {"move":"shellsidearm"} | [{"op":"moveBehavior","recipe":"smartCategory","comparison":"difference","contactByCategory":true,"specialMultipliers":[{"condition":{"allyAbility":{"who":"user","values":["battery"]}},"factor":1.5},{"condition":{"all":[{"ability":{"who":"user","values":["flareboost"]}},{"pokemonStatus":"brn"}]},"factor":1.5}],"physicalMultipliers":[{"condition":{"ability":{"who":"user","values":["toughclaws"]}},"factor":1.3}],"defenseMultipliers":[{"condition":{"all":[{"effectiveAbility":{"who":"target","values":["fluffy"]}},{"not":{"ability":{"who":"user","values":["longreach"]}}}]},"factor":2}],"specialDefenseMultipliers":[{"condition":{"effectiveAbility":{"who":"target","values":["icescales"]}},"factor":2}]}] | "Battle_Move.rb:359-390" |
| "modifyMove" | {"all":[{"move":"terastarstorm"},{"species":{"who":"user","value":"terapagos"}},{"formName":{"who":"user","value":"Stellar"}}]} | [{"op":"moveBehavior","recipe":"smartCategory","comparison":"offense","contactByCategory":false,"specialMultipliers":[{"condition":{"allyAbility":{"who":"user","values":["battery"]}},"factor":1.5},{"condition":{"all":[{"ability":{"who":"user","values":["flareboost"]}},{"pokemonStatus":"brn"}]},"factor":1.5}],"physicalMultipliers":[],"defenseMultipliers":[],"specialDefenseMultipliers":[]}] | "Battle_Move.rb:359-390; Battle_MoveEffects.rb:9817-9838" |
| "attack" | {"all":[{"moveType":"Fire"},{"item":{"who":"target","values":["nevermeltice"]}},{"stateFlag":"neverMeltIce"}]} | [{"op":"multiply","value":0.66},{"op":"moveMessage","text":"The Never-Melt Ice's sheer cold weakened {move}'s power!"}] | "Battle_Move.rb:1570-1573,1939-1944" |
| "specialAttack" | {"all":[{"moveType":"Fire"},{"item":{"who":"target","values":["nevermeltice"]}},{"stateFlag":"neverMeltIce"}]} | [{"op":"multiply","value":0.66},{"op":"moveMessage","text":"The Never-Melt Ice's sheer cold weakened {move}'s power!"}] | "Battle_Move.rb:1570-1573,1939-1944" |
| "tryMove" | {"move":"focuspunch"} | [{"op":"message","text":"{1} lost its focus and couldn't move!"},{"op":"reject"}] | "Battler.rb:5750-5754" |
| "modifyMove" | {"move":"paraboliccharge"} | [{"op":"moveProperty","path":"drain","value":[3,4]}] | "Battle_MoveEffects.rb:5365-5366" |
| "modifyMove" | {"all":[{"move":"weatherball"},{"weather":"shadowsky"}]} | [{"op":"moveType","type":"Shadow"},{"op":"moveProperty","path":"basePower","value":100}] | "Battle_MoveEffects.rb:2914,2928" |
| "modifyMoveLate" | {"all":[{"item":{"who":"user","values":["kingsrock","razorfang"]}},{"baseCanFlinch":false},{"any":[{"field":"rejuvenation:rainbow"},{"overlay":"rejuvenation:rainbow"},{"ability":{"who":"user","values":["serenegrace"]}}]}]} | [{"op":"secondaryChance","chance":20,"volatileStatus":"flinch"}] | "Battler.rb:3544-3548" |
| "modifyMoveLate" | {"all":[{"item":{"who":"user","values":["kingsrock","razorfang"]}},{"sheerForce":true}]} | [{"op":"moveProperty","path":"secondaries","value":[]}] | "Battler.rb:3544 (Sheer Force with a secondary effect suppresses item flinch)" |
| "modifyMove" | {"all":[{"move":"expandingforce"},{"any":[{"field":"rejuvenation:psychic_terrain"},{"overlay":"rejuvenation:psychic_terrain"}]}]} | [{"op":"moveProperty","path":"target","value":"allAdjacentFoes"}] | "Battler.rb:4979-4980 (spread regardless of user grounding)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["slowstart"]}},{"volatile":{"who":"user","id":"slowstart"}},{"field":"rejuvenation:electric_terrain"}]} | [{"op":"volatileDuration","id":"slowstart","amount":-1,"minimum":1}] | "Battle.rb:7295" |

## Original status-move highlights

Source UI buff highlights: `["charge","eerieimpulse","magnetrise","spikes","electrify","risingvoltage","psyblade"]`.

Source UI nerf highlights: `["focuspunch"]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["charge","eerieimpulse","electrify","focuspunch"],"unreviewedHighlightedMoves":["magnetrise","psyblade","risingvoltage","spikes"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Each row shows its recorded semantic decision and the named regression tests that prove it; the disposition, not the listing, is the evidence.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Battle.rb:531 | @field.effect == :ELECTERRAIN \|\| @field.overlay == :ELECTERRAIN \|\| @field.effect == :NEWWORLD | implemented_and_tested | quarkdriveCheck runs when an overlay is set, when the hard field changes to a different field family and when an Electric Terrain overlay ends. Electric Terrain, an Electric overlay or New World boosts unboosted Quark Drive holders; otherwise an environmental boost wears off and Booster Energy, if held, replaces it once. A Booster boost is never removed and an existing boost never re-picks its stat. The check precedes noOverlay, so an overlay removed by the new field still counts. Tests: Quark Drive is re-examined when the field or an overlay changes and when an Electric Terrain overlay ends, paradox abilities entering the field are boosted only by Electric Terrain or sunlight, otherwise by Booster Energy, paradox boosts survive complete turns without duplicate activations |
| Battle.rb:3177 | pkmn.pbOwnSide.effects[:Spikes] > 0 && @field.effect != :WASTELAND &&<br>       (!pkmn.isAirborne? \|\| (Rejuv && @field.effect == :ELECTERRAIN)) &&<br>       !pkmn.hasWorkingItem(:HEAVYDUTYBOOTS) && !magicGuardAbilities.include?(pkmn.ability) | implemented_and_tested | Spikes do not trigger on entry on the Wasteland; on a hard Electric Terrain they also strike airborne Pokémon. Heavy-Duty Boots and Magic Guard (Wonder Guard on the Colosseum) still protect. Tests: entry hazards take the shape of the field, the Wasteland swallows hazards and throws them back at the end of the round, Starlight Mirror Armor, Colosseum Wonder Guard, Glitch Rage and Colosseum Quick Draw |
| Battle.rb:3181 | Rejuv && @battle.FE == :ELECTERRAIN | implemented_and_tested | On a hard Electric Terrain Spikes deal Electric-typed damage (layer fraction times effectiveness, none to Ground types) with "was hurt by the electrified spikes!". A terrain overlay does not electrify them. Tests: entry hazards take the shape of the field |
| Battle.rb:3670 | [:ELECTERRAIN, :GRASSY, :MISTY, :PSYTERRAIN, :RAINBOW].include?(@battle.field.effect) && @turncount == 0 | unreachable_in_build | A scripted trainer field change remembers a terrain set on the first turn. Tests:  |
| Battle.rb:5841 | [:ELECTERRAIN, :SHORTCIRCUIT].include?(@field.effect) | implemented_and_tested | Volt Absorb heals a sixteenth at the end of the round on Electric Terrain and Short Circuit. Tests: field abilities and field damage resolve at the end of the round |
| Battle.rb:5849 | @field.effect == :ELECTERRAIN | implemented_and_tested | Motor Drive gains a Speed stage every round on Electric Terrain. Tests: field abilities and field damage resolve at the end of the round |
| Battle.rb:6669 | @field.effect == :ELECTERRAIN | implemented_and_tested | Thunder Cage binds one step harder on a hard Electric Terrain. Steps follow the 1/8, 1/6, 1/4, 1/3, 1/2 ladder shared with Binding Band. Tests: binding moves squeeze harder on their fields |
| Battle.rb:7295 | @battle.FE == :ELECTERRAIN | implemented_and_tested | Slow Start counts two per round on a hard Electric Terrain and so ends after three rounds; an overlay does not hurry it. Tests: room clocks, Bad Dreams, Harvest and Slow Start follow the field at the end of the round |
| Battle_Effects.rb:125 | (!ignorestatus && self.status == :SLEEP) \|\| (self.ability == :COMATOSE && @battle.FE != :ELECTERRAIN) | implemented_and_tested | Comatose does not make its holder count as already asleep on Electric Terrain. Tests: Electric Terrain disables Comatose trait and status immunity |
| Battle_Effects.rb:1444 | [:ELECTERRAIN, :SHORTCIRCUIT].include?(@battle.FE) | implemented_and_tested | Surge Surfer is active on Electric Terrain and Short Circuit. Tests: speed abilities are active on their source fields |
| Battle_Effects.rb:1446 | @battle.OV == :ELECTERRAIN | implemented_and_tested | Surge Surfer is active under an Electric Terrain overlay. Tests: speed abilities are active on their source fields |
| Battle_Effects.rb:1460 | Rejuv && @battle.FE == :ELECTERRAIN | implemented_and_tested | Quick Feet is active without a status on the hard Electric Terrain. Tests: speed abilities are active on their source fields |
| Battle_Inspect.rb:44 | (Rejuv && @battle.FE == :ELECTERRAIN) | presentation_only | Battle Inspect screen: recomputes a multiplier or status line for display in the stat-inspection panel. Tests:  |
| Battle_Inspect.rb:423 | @battle.FE == :SHORTCIRCUIT && @battle.OV == :ELECTERRAIN | presentation_only | Battle Inspect screen: recomputes a multiplier or status line for display in the stat-inspection panel. Tests:  |
| Battle_Move.rb:372 | Rejuv && @battle.FE == :ELECTERRAIN | implemented_and_tested | Smart categories compare fully modified Attack against Special or stat differences. Shared Glitch Special, Electric Terrain Battery 1.5 vs baseline 1.3, field-active Flare Boost, Frozen Dimension suppression, Tough Claws contact preview, Fluffy/Long Reach and Ice Scales are data-driven inputs. Photon Geyser and Shell Side Arm retain their source category overrides on Glitch. Tests: smart move categories use field Flare Boost, shared Special and Battery before comparing, Shell Side Arm compares stat differences with ability defenses and source contact behavior, smart category selection is used during a real Photon Geyser turn |
| Battle_Move.rb:496 | Rejuv && @battle.FE == :ELECTERRAIN | implemented_and_tested | Reviewed Sky move/Long Reach Flying weakness, the shipped Flower Garden Cut boost (inactive !Rejuv Forest stays absent), Infernal Fire/Ghost, Deep Earth Ground/Ground, Deux Finalis Ghost/Rock and Fairy normalization, and Electric Terrain Teravolt/Ground. Exact per-type assertions cover every shipped clause. Tests: field type chart branches apply exact source single-type values and immunity |
| Battle_Move.rb:1249 | [:ELECTERRAIN, :FACTORY].include?(@battle.FE) \|\| @battle.OV == :ELECTERRAIN | implemented_and_tested | Galvanize-converted moves get 1.5 on Electric Terrain, Factory or under an Electric Terrain overlay. Tests: type-changing abilities use the source field multiplier and the baseline elsewhere, Galvanize, Pixilate and Marvel Scale read an overlay as well as the hard field |
| Battle_Move.rb:1302 | Rejuv && @battle.FE == :ELECTERRAIN | implemented_and_tested | Battery strengthens an ally's special moves by 1.5 on Electric Terrain instead of 1.3. Tests: ally power abilities use the source field multiplier |
| Battle_Move.rb:1496 | [:PLUS, :MINUS].include?(attacker.pbPartner.ability) \|\| @battle.FE == :SHORTCIRCUIT \|\| (Rejuv && (@battle.FE == :ELECTERRAIN \|\| @battle.OV == :ELECTERRAIN)) \|\| (attacker.crested == :MINUN && attacker.ability == :MINUS) \|\|<br>          (attacker.crested == :PLUSLE && attacker.ability == :PLUS) | implemented_and_tested | Plus and Minus raise Special Attack by 1.5 without a partner on Short Circuit, Electric Terrain or under an Electric Terrain overlay. Tests: stat-doubling and terrain abilities follow their source field conditions |
| Battle_Move.rb:1503 | attacker.ability == :HADRONENGINE && (@battle.FE == :NEWWORLD \|\| @battle.FE == :ELECTERRAIN \|\| @battle.OV == :ELECTERRAIN) | implemented_and_tested | Hadron Engine is active on New World as well as on Electric Terrain (hard field or overlay). Tests: stat-doubling and terrain abilities follow their source field conditions |
| Battle_Move.rb:1535 | @battle.FE == :ELECTERRAIN | implemented_and_tested | Transistor multiplies Electric attacks by 1.6 on Electric Terrain (Gen is 9.5 in this build, so the baseline is 1.3). Tests: type-specialist abilities use the source field multiplier for both attacking stats |
| Battle_Move.rb:1696 | [:PLUS, :MINUS].include?(opponent.pbPartner.ability) \|\| @battle.FE == :SHORTCIRCUIT \|\| (Rejuv && (@battle.FE == :ELECTERRAIN \|\| @battle.OV == :ELECTERRAIN)) \|\| (opponent.crested == :MINUN && opponent.ability == :MINUS) \|\|<br>          (opponent.crested == :PLUSLE && opponent.ability == :PLUS) | implemented_and_tested | Defensive Special Attack borrowing includes ordinary Plus/Minus partners and Electric overlays. Plusle/Minun Crest clauses are excluded. Tests: Glitch defensive shared Special borrows the fully modified Special Attack under ordinary field overlays, stat-doubling and terrain abilities follow their source field conditions |
| Battle_Move.rb:1701 | opponent.ability == :HADRONENGINE && (@battle.FE == :NEWWORLD \|\| @battle.FE == :ELECTERRAIN \|\| @battle.OV == :ELECTERRAIN) | implemented_and_tested | Defensive Special Attack borrowing includes ordinary Hadron Engine under Electric overlays. The shared pool is active only on Glitch; direct stat ability branches are tested separately on their hard fields. Tests: Glitch defensive shared Special borrows the fully modified Special Attack under ordinary field overlays, stat-doubling and terrain abilities follow their source field conditions |
| Battle_MoveEffects.rb:123 | @move == :WILDCHARGE && @battle.FE == :ELECTERRAIN | implemented_and_tested | Wild Charge has no recoil on Electric Terrain. Tests: Electric Wild Charge and aquatic Wave Crash use source recoil |
| Battle_MoveEffects.rb:857 | @battle.FE == :ELECTERRAIN | implemented_and_tested | Electric Terrain Charge raises Special Defense two stages. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_MoveEffects.rb:1428 | Rejuv && @battle.FE == :ELECTERRAIN && @move == :ELECTROWEB | implemented_and_tested | Electric Terrain Electroweb lowers Speed two stages. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_MoveEffects.rb:3357 | Rejuv && @battle.FE == :ELECTERRAIN | implemented_and_tested | Electric Terrain Mud Sport shorts the field to Indoor for as long as Mud Sport lasts. Tests: Mud Sport shorts Electric Terrain for five turns and restores it on expiry |
| Battle_MoveEffects.rb:5365 | Rejuv && @battle.FE == :ELECTERRAIN && @move == :PARABOLICCHARGE | implemented_and_tested | Electric Terrain Parabolic Charge restores 75 percent of the damage dealt. Tests: healing moves restore their source field shares |
| Battle_MoveEffects.rb:6847 | [:ELECTERRAIN, :FACTORY, :SHORTCIRCUIT].include?(@battle.FE) \|\| @battle.OV == :ELECTERRAIN | implemented_and_tested | Magnet Rise lasts eight turns on Electric Terrain (hard field or overlay), Factory and Short Circuit. Tests: Magnet Rise clocks respect electric fields and overlays |
| Battle_MoveEffects.rb:7222 | [:ELECTERRAIN, :DEEPEARTH].include?(@battle.FE) | implemented_and_tested | Eerie Impulse lowers Special Attack three stages on Electric Terrain and Deep Earth. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_MoveEffects.rb:7483 | @battle.FE == :DEEPEARTH \|\| (Rejuv && @battle.FE == :ELECTERRAIN && [:PLUS, :MINUS].include?(opponent.ability)) | implemented_and_tested | Magnetic Flux raises two stages on Deep Earth and for Plus or Minus holders on Electric Terrain. Tests: Dive breaks thin ice, Conversion respects a permanent Glitch and pawns ignore one-hit knockouts, Magnetic Flux allows all allies on Electric Terrain and doubles Plus/Minus boosts |
| Battle_MoveEffects.rb:7639 | Rejuv && @battle.FE == :ELECTERRAIN && opponent.canChangeType? | implemented_and_tested | Electric Terrain Electrify also turns the target into a pure Electric type. Tests: status effects of moves follow their Battle_MoveEffects field branches |
| Battle_MoveEffects.rb:8917 | (@battle.FE == :ELECTERRAIN \|\| @battle.OV == :ELECTERRAIN) && !opponent.isAirborne? | implemented_and_tested | Rising Voltage doubles against grounded targets on Electric Terrain, hard field or overlay. Tests: variable-power moves use their source field values |
| Battle_MoveEffects.rb:9783 | @battle.FE == :ELECTERRAIN | implemented_and_tested | Electric Terrain Electro Shot needs no charging turn. Tests: two-turn moves strike at once on their source fields, field two-turn Geomancy, Meteor Beam and Electro Shot skip charging |
| Battle_MoveEffects.rb:9982 | @battle.FE == :ELECTERRAIN \|\| @battle.OV == :ELECTERRAIN | implemented_and_tested | Psyblade gains 1.5 on Electric Terrain, hard field or overlay. Tests: variable-power moves use their source field values |
| Battle_Scene.rb:6141 | move.move == :RISINGVOLTAGE && battle.FE == :ELECTERRAIN && opponent.isAirborne? | presentation_only | Fight-menu highlight: decides whether a move button is tinted as field-boosted. Tests:  |
| Battler.rb:1131 | self.ability == :COMATOSE && @battle.FE != :ELECTERRAIN | implemented_and_tested | Hard Electric field alone disables Comatose sleep traits and status immunity; an Electric overlay does not. Tests: Electric Terrain disables Comatose trait and status immunity |
| Battler.rb:1187 | self.ability == :STEADFAST && (@battle.FE == :ELECTERRAIN \|\| @battle.OV == :ELECTERRAIN) | implemented_and_tested | Steadfast Speed is multiplied by 1.5 on the hard Electric field or its overlay. Tests: ordinary field speed predicates cover grounding, Water types, abilities, overlays and held items |
| Battler.rb:1392 | (@battle.OV == :ELECTERRAIN \|\| @battle.FE == :ELECTERRAIN) | excluded_crest | The enclosing Raikou Crest flag ends its own generated Electric field/overlay on faint or leaving; Crests are explicitly excluded. Tests:  |
| Battler.rb:1723 | [:ELECTERRAIN, :FACTORY, :SHORTCIRCUIT].include?(@battle.FE) | implemented_and_tested | Surf/Dive catch form overrides: aquatic fields choose Gulping; electrical/mechanical fields choose Gorging; other fields retain native HP selection. Tests: field Gulp Missile selects its source forme rather than the HP-based native forme |
| Battler.rb:2035 | @battle.FE == :ELECTERRAIN | implemented_and_tested | Lightning Rod and Electromorphosis gain one Special Attack stage on entering Electric Terrain. Tests: every source field-entry stat ability changes exactly its listed stages |
| Battler.rb:2824 | self.ability == :HADRONENGINE && (@battle.FE == :ELECTERRAIN \|\| @battle.OV == :ELECTERRAIN) | implemented_and_tested | Hadron Engine on Electric Terrain shows its source flavor. Tests: paradox engines draw on New World without creating terrain or sun |
| Battler.rb:2826 | ([:ELECTRICSURGE, :HADRONENGINE].include?(self.ability) \|\| self.crested == :RAIKOU) && @battle.FE != :ELECTERRAIN && @battle.OV != :ELECTERRAIN | implemented_and_tested | Elsewhere Electric Surge and Hadron Engine create Electric Terrain for five turns, eight with Amplifield Rock. Tests: paradox engines draw on New World without creating terrain or sun, surge abilities respect the source terrain restrictions |
| Battler.rb:3014 | @battle.FE != :ELECTERRAIN | implemented_and_tested | Comatose original drowsing text is emitted except on the hard Electric field. Tests: Comatose source entry flavor is suppressed only on the hard Electric field |
| Battler.rb:3419 | @battle.FE == :ELECTERRAIN \|\| @battle.OV == :ELECTERRAIN | implemented_and_tested | A battler entering with Quark Drive is boosted by Electric Terrain (hard field or overlay) and otherwise spends Booster Energy; the switch-in block does not know New World, so a battler entering New World is boosted only by its item. The highest stat counts stages and a transformed battler is skipped. Tests: paradox abilities entering the field are boosted only by Electric Terrain or sunlight, otherwise by Booster Energy, paradox boosts survive complete turns without duplicate activations |
| Battler.rb:3471 | (@battle.OV == :ELECTERRAIN \|\| @battle.FE == :ELECTERRAIN) | excluded_crest | The enclosing Raikou Crest flag ends its own generated Electric field/overlay on faint or leaving; Crests are explicitly excluded. Tests:  |
| Battler.rb:3669 | @battle.FE == :SHORTCIRCUIT \|\| (Rejuv && @battle.FE == :ELECTERRAIN) | implemented_and_tested | Electric Terrain/Short Circuit contact Static probability becomes 60 percent. Tests: Static doubles its contact paralysis chance on the electric fields |
| Battler.rb:4318 | Rejuv && @battle.FE == :ELECTERRAIN | implemented_and_tested | Electric hard field activates and consumes Cell Battery to raise Attack by one when eligible. Tests: item switch-in consumption |
| Battler.rb:5750 | basemove.function == 0x115 && ((@lastHPLost > 0 && !@damagestate.substitute) \|\| @battle.FE == :ELECTERRAIN) | implemented_and_tested | Focus Punch always loses focus on the Electric Terrain hard field. Tests: Focus Punch always loses focus on Electric Terrain |
| Battler.rb:7339 | [:MINUS, :PLUS].include?(self.pbPartner.ability) \|\| @battle.FE == :SHORTCIRCUIT \|\| (Rejuv && @battle.FE == :ELECTERRAIN) \|\| @battle.OV == :ELECTERRAIN | implemented_and_tested | Plus/Minus activates independently from a partner on Short Circuit/Electric hard or Electric overlay. Tests: stat-doubling and terrain abilities follow their source field conditions |
| Battler.rb:7345 | self.ability == :HADRONENGINE && (@battle.FE == :NEWWORLD \|\| @battle.FE == :ELECTERRAIN \|\| @battle.OV == :ELECTERRAIN) | implemented_and_tested | Hadron Engine draws its native Special Attack boost from New World/Electric hard field/overlay. Tests: stat-doubling and terrain abilities follow their source field conditions |

AI source leads: 41. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":[],"abilities":[],"items":[]}`.
