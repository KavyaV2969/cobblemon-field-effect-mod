# Grassy Terrain

Original ID: `GRASSY`; datapack ID: `rejuvenation:grassy_terrain`.

**Status:** implemented; every runtime source lead is implemented and tested or recorded as an exclusion or limitation. Compiled definition comparison passed. Not certified through exhaustive live or multiplayer play. Field-specific exceptions are listed in [FIELD_COVERAGE.md](../FIELD_COVERAGE.md).

## Initialization

Entry text: "The field is in full bloom."

Nature Power: `energyball`. Secret Power animation/reference move: `seedbomb`.

Secret Power actual secondary choices: `[{"status":"slp"}]`.

Mimicry type: `Grass`; Burmy cloak reference: `PLANTCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"elementalseed","effect":"ingrain","duration":true,"message":"{1} planted its roots!","stats":{"def":1}}`. Seed actions: `null`.

Absorbed healing configuration: `{"rootFactor":1.6,"agentMultipliers":{"leechseed":1.3,"ingrain":2},"overlayAgents":["ingrain"],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820","sourceAbilities":["gravitycontrol"]},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `null` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The terrain returned to normal."`.

Shared stat pools: `null`. Absorber policies: `null`. Indirect immunity: `null`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"cottondown":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"forEach","group":"others","actions":[{"op":"boost","who":"target","stats":{"spe":-2}}]}],"source":"Battler.rb:3875"}},"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":5,"extendedBy":3,"blockEverstone":false}],"source":"Battler.rb:3926"}},"galvanize":{"onBasePower":{"mode":"replace","condition":{"all":[{"abilityChangedType":true},{"overlay":"rejuvenation:electric_terrain"}]},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1249"}},"pixilate":{"onBasePower":{"mode":"replace","condition":{"all":[{"abilityChangedType":true},{"overlay":"rejuvenation:misty_terrain"}]},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1262"}},"purepower":{"onModifyAtk":{"mode":"replace","condition":{"overlay":"rejuvenation:psychic_terrain"},"actions":[],"source":"Battle_Move.rb:1517"}},"plus":{"onModifySpA":{"mode":"replace","condition":{"overlay":"rejuvenation:electric_terrain"},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1495-1499"}},"minus":{"onModifySpA":{"mode":"replace","condition":{"overlay":"rejuvenation:electric_terrain"},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1495-1499"}},"overgrow":{"onModifyAtk":{"mode":"replace","condition":{"moveType":"Grass"},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1542"},"onModifySpA":{"mode":"replace","condition":{"moveType":"Grass"},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1542"}},"marvelscale":{"onModifyDef":{"mode":"replace","condition":{"overlay":"rejuvenation:misty_terrain"},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1724"}},"desolateland":{"onStart":{"mode":"append","condition":{"always":true},"actions":[{"op":"conditional","condition":{"weather":"desolateland"},"actions":[{"op":"changeField","field":"rejuvenation:desert","message":"The extremely harsh sunlight dried out the meadow!"}]}],"source":"Battler.rb:2803-2806"}},"wildfire":{"onResidual":{"mode":"replace","condition":{"always":true},"actions":[{"op":"forEach","group":"foes","actions":[{"op":"damage","who":"target","fraction":0.16666666666666666}],"condition":{"all":[{"not":{"type":{"who":"target","value":"Fire"}}},{"not":{"ability":{"who":"target","values":["magicguard"]}}}]},"order":"speed","message":"The Pokémon were burnt by the wildfire!!"}],"source":"Battle.rb:7165"}},"tempest":{"onEnd":{"mode":"replace","condition":{"always":true},"actions":[{"op":"reconcileWeather"}],"source":"Battler.rb:3515-3516"}},"comatose":{"onStart":{"mode":"replace","condition":{"always":true},"actions":[{"op":"abilityMessage"},{"op":"message","text":"{1} is drowsing!"}],"source":"Battler.rb:3013-3017 (hard Electric field alone disables Comatose)"}},"slowstart":{"onStart":{"mode":"replace","condition":{"always":true},"actions":[{"op":"volatile","id":"slowstart","silent":true,"message":"{1} is slow to get going!"}],"source":"Battler.rb:3288-3289 (clock retained even on Deep Earth)"}},"harvest":{"onResidual":{"mode":"replace","condition":{"always":true},"actions":[{"op":"harvestBerry"}],"source":"Battle.rb:7245-7254"}}}`. Inactive abilities: `null`. Status type bypass: `null`.

Field form typing: `["arceus","silvally"]`. Custom volatile rules: `null`. Rampage policy: `null`.

Progression: `null`. Party roles: `null`.

Field clock policy: `null`.

Fields persist for the battle unless transformed/destroyed. Move/ability terrain creation uses its own finite duration; engine stack restoration and overlay clocks are described in ARCHITECTURE.md.

## Core move rules

| Move ID | Executable properties and exact source text |
|---|---|
| `fairywind` | {"multiplier":1.5,"message":"The wind picked up strength from the field!"} |
| `silverwind` | {"multiplier":1.5,"message":"The wind picked up strength from the field!"} |
| `ominouswind` | {"multiplier":1.5,"message":"The wind picked up strength from the field!"} |
| `icywind` | {"multiplier":1.5,"message":"The wind picked up strength from the field!"} |
| `razorwind` | {"multiplier":1.5,"message":"The wind picked up strength from the field!"} |
| `gust` | {"multiplier":1.5,"message":"The wind picked up strength from the field!"} |
| `twister` | {"multiplier":1.5,"message":"The wind picked up strength from the field!"} |
| `grassknot` | {"multiplier":1.5,"message":"The grass strengthened the attack!"} |
| `muddywater` | {"multiplier":0.5,"message":"The grass softened the attack...","counter":{"index":1,"amount":2,"maximum":3,"message":"The ground became waterlogged..."},"transition":{"field":"rejuvenation:swamp","condition":{"counter":{"index":1,"op":">","value":2}},"push":false,"message":"The grassy terrain became marshy!"}} |
| `surf` | {"multiplier":0.5,"message":"The grass softened the attack...","counter":{"index":1,"amount":1,"maximum":3,"message":"The ground became waterlogged..."},"transition":{"field":"rejuvenation:swamp","condition":{"counter":{"index":1,"op":">","value":2}},"push":false,"message":"The grassy terrain became marshy!"}} |
| `earthquake` | {"multiplier":0.5,"message":"The grass softened the attack..."} |
| `magnitude` | {"multiplier":0.5,"message":"The grass softened the attack..."} |
| `bulldoze` | {"multiplier":0.5,"message":"The grass softened the attack..."} |
| `grasswhistle` | {"accuracy":80} |
| `sludgewave` | {"transition":{"field":"rejuvenation:corrosive","condition":{"always":true},"push":false,"message":"The grassy terrain was corroded!"}} |
| `aciddownpour` | {"transition":{"field":"rejuvenation:corrosive","condition":{"always":true},"push":false,"message":"The grassy terrain was corroded!"}} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Grass"} | {"condition":{"not":{"grounded":{"who":"user","value":false}}},"multiplier":1.5,"message":"The Grassy Terrain strengthened the attack!"} |
| {"moveType":"Fire"} | {"condition":{"not":{"grounded":{"who":"target","value":false}}},"multiplier":1.5,"message":"The grass below caught flame!"} |

## Overlay definition

```json
{
  "moves": {
    "fairywind": {
      "multiplier": 1.5,
      "message": "The wind picked up strength from the field!"
    },
    "silverwind": {
      "multiplier": 1.5,
      "message": "The wind picked up strength from the field!"
    },
    "ominouswind": {
      "multiplier": 1.5,
      "message": "The wind picked up strength from the field!"
    },
    "icywind": {
      "multiplier": 1.5,
      "message": "The wind picked up strength from the field!"
    },
    "razorwind": {
      "multiplier": 1.5,
      "message": "The wind picked up strength from the field!"
    },
    "gust": {
      "multiplier": 1.5,
      "message": "The wind picked up strength from the field!"
    },
    "twister": {
      "multiplier": 1.5,
      "message": "The wind picked up strength from the field!"
    }
  },
  "types": [
    {
      "match": {
        "moveType": "Grass"
      },
      "condition": {
        "not": {
          "grounded": {
            "who": "user",
            "value": false
          }
        }
      },
      "multiplier": 1.3,
      "message": "The Grassy Terrain strengthened the attack!"
    }
  ]
}
```

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "residual" | {"all":[{"grounded":{"who":"user","value":true}},{"semiInvulnerable":{"who":"user","value":false}}]} | [{"op":"heal","fraction":0.0625,"groupMessage":"The grass healed the Pokémon on the battlefield."}] | "Battle.rb:field grassy recovery" |
| "priority" | {"move":"grassyglide"} | [{"op":"add","value":1}] | "Battle_Move.rb:2302" |
| "modifyMove" | {"all":[{"overlay":"rejuvenation:rainbow"},{"not":{"all":[{"ability":{"who":"user","values":["serenegrace"]}},{"canFlinch":true}]}}]} | [{"op":"secondaryChance","multiplier":2}] | "Battle_Move.rb:2328-2329" |
| "modifyMove" | {"all":[{"overlay":"rejuvenation:rainbow"},{"moveType":"Normal"},{"category":"Special"}]} | [{"op":"extraType","values":["Normal","Fire","Water","Electric","Grass","Ice","Fighting","Poison","Ground","Flying","Psychic","Bug","Rock","Ghost","Dragon","Dark","Steel","Fairy"],"excludePrimary":true,"layer":"overlay"}] | "Battle_Move.rb:837-838; Battle_Field.rb:117-136" |
| "residual" | {"ability":{"who":"user","values":["sapsipper"]}} | [{"op":"heal","fraction":0.0625,"message":"{1} ate some grass to recover!"}] | "Battle.rb:5850-6109" |
| "setStatus" | {"effectiveAbility":{"who":"target","values":["leafguard"]}} | [{"op":"reject"}] | "Battle_Effects.rb:99,1383-1391" |
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
| "chargeMove" | {"move":"razorwind"} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4430" |
| "chargeMove" | {"all":[{"move":"razorwind"},{"overlay":"rejuvenation:grassy_terrain"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4430" |
| "chargeMove" | {"all":[{"any":[{"move":"solarbeam"},{"move":"solarblade"}]},{"overlay":"rejuvenation:rainbow"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4472" |
| "modifyMove" | {"all":[{"move":"mist"},{"not":{"sideCondition":"mist"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"createField","field":"rejuvenation:misty_terrain","duration":3,"extendedBy":3,"message":"Mist swirled around the battlefield!"}]}] | "Battle_MoveEffects.rb:1817" |
| "modifyMove" | {"move":"coil"} | [{"op":"moveProperty","path":"boosts","value":{"atk":2,"def":2,"accuracy":2}}] | "Battle_MoveEffects.rb:917" |
| "modifyMove" | {"move":"growth"} | [{"op":"moveProperty","path":"boosts","value":{"atk":2,"spa":2},"removeCallback":"onHit"}] | "Battle_MoveEffects.rb:964" |
| "modifyMove" | {"move":"cottonspore"} | [{"op":"moveProperty","path":"boosts","value":{"spe":-3}}] | "Battle_MoveEffects.rb:1647" |
| "modifyMove" | {"move":"synthesis"} | [{"op":"moveProperty","path":"heal","value":[0.75,1],"removeCallback":"onHit"}] | "Battle_MoveEffects.rb:5237" |
| "modifyMove" | {"move":"stokedsparksurfer"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:electric_terrain","duration":3,"extendedBy":0,"blockEverstone":false,"message":"An electric current ran across the battlefield!"}]}] | "Battle_ZMove.rb:290-301" |
| "modifyMove" | {"move":"genesissupernova"} | [{"op":"moveProperty","path":"secondaries.0.self","value":null},{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:psychic_terrain","duration":5,"extendedBy":0,"blockEverstone":false,"message":"Psychic energy spread across the battlefield!"}]}] | "Battle_ZMove.rb:322-332" |
| "modifyMove" | {"move":"plasmafists"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:electric_terrain","duration":3,"extendedBy":3,"message":"An electric current ran across the battlefield!"}]}] | "Battle_MoveEffects.rb:8306-8320" |
| "modifyMove" | {"all":[{"move":"iondeluge"},{"not":{"pseudoWeather":{"id":"iondeluge","value":true}}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitField","actions":[{"op":"createField","field":"rejuvenation:electric_terrain","duration":3,"extendedBy":3,"message":"An electric current ran across the battlefield!"}]}] | "Battle_MoveEffects.rb:7500-7519" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "damage" | {"all":[{"all":[{"moveType":"Poison"},{"sideAbility":{"who":"target","values":["pastelveil"]}}]},{"overlay":"rejuvenation:misty_terrain"}]} | [{"op":"multiply","value":0.5}] | "Battle_Move.rb:1821" |
| "modifyMove" | {"any":[{"move":"photongeyser"},{"move":"lightthatburnsthesky"}]} | [{"op":"moveBehavior","recipe":"smartCategory","comparison":"offense","contactByCategory":false,"specialMultipliers":[{"condition":{"allyAbility":{"who":"user","values":["battery"]}},"factor":1.3},{"condition":{"all":[{"ability":{"who":"user","values":["flareboost"]}},{"pokemonStatus":"brn"}]},"factor":1.5}],"physicalMultipliers":[],"defenseMultipliers":[],"specialDefenseMultipliers":[]}] | "Battle_Move.rb:359-390" |
| "modifyMove" | {"move":"shellsidearm"} | [{"op":"moveBehavior","recipe":"smartCategory","comparison":"difference","contactByCategory":true,"specialMultipliers":[{"condition":{"allyAbility":{"who":"user","values":["battery"]}},"factor":1.3},{"condition":{"all":[{"ability":{"who":"user","values":["flareboost"]}},{"pokemonStatus":"brn"}]},"factor":1.5}],"physicalMultipliers":[{"condition":{"ability":{"who":"user","values":["toughclaws"]}},"factor":1.3}],"defenseMultipliers":[{"condition":{"all":[{"effectiveAbility":{"who":"target","values":["fluffy"]}},{"not":{"ability":{"who":"user","values":["longreach"]}}}]},"factor":2}],"specialDefenseMultipliers":[{"condition":{"effectiveAbility":{"who":"target","values":["icescales"]}},"factor":2}]}] | "Battle_Move.rb:359-390" |
| "modifyMove" | {"all":[{"move":"terastarstorm"},{"species":{"who":"user","value":"terapagos"}},{"formName":{"who":"user","value":"Stellar"}}]} | [{"op":"moveBehavior","recipe":"smartCategory","comparison":"offense","contactByCategory":false,"specialMultipliers":[{"condition":{"allyAbility":{"who":"user","values":["battery"]}},"factor":1.3},{"condition":{"all":[{"ability":{"who":"user","values":["flareboost"]}},{"pokemonStatus":"brn"}]},"factor":1.5}],"physicalMultipliers":[],"defenseMultipliers":[],"specialDefenseMultipliers":[]}] | "Battle_Move.rb:359-390; Battle_MoveEffects.rb:9817-9838" |
| "attack" | {"all":[{"moveType":"Fire"},{"item":{"who":"target","values":["nevermeltice"]}},{"stateFlag":"neverMeltIce"}]} | [{"op":"multiply","value":0.66},{"op":"moveMessage","text":"The Never-Melt Ice's sheer cold weakened {move}'s power!"}] | "Battle_Move.rb:1570-1573,1939-1944" |
| "specialAttack" | {"all":[{"moveType":"Fire"},{"item":{"who":"target","values":["nevermeltice"]}},{"stateFlag":"neverMeltIce"}]} | [{"op":"multiply","value":0.66},{"op":"moveMessage","text":"The Never-Melt Ice's sheer cold weakened {move}'s power!"}] | "Battle_Move.rb:1570-1573,1939-1944" |
| "modifyMove" | {"move":"worryseed"} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHit","actions":[{"op":"boost","who":"target","stats":{"atk":-1}}]}] | "Battle_MoveEffects.rb:2251-2253" |
| "modifyMove" | {"move":"naturesmadness"} | [{"op":"moveBehavior","recipe":"fixedDamage","basis":"targetHP","factor":0.75,"message":null}] | "Battle_MoveEffects.rb:2432-2433" |
| "modifyMove" | {"move":"absorb"} | [{"op":"moveProperty","path":"drain","value":[3,4]}] | "Battle_MoveEffects.rb:5365-5366" |
| "modifyMove" | {"move":"megadrain"} | [{"op":"moveProperty","path":"drain","value":[3,4]}] | "Battle_MoveEffects.rb:5365-5366" |
| "modifyMove" | {"move":"gigadrain"} | [{"op":"moveProperty","path":"drain","value":[3,4]}] | "Battle_MoveEffects.rb:5365-5366" |
| "modifyMove" | {"move":"hornleech"} | [{"op":"moveProperty","path":"drain","value":[3,4]}] | "Battle_MoveEffects.rb:5365-5366" |
| "modifyMove" | {"all":[{"move":"weatherball"},{"weather":"shadowsky"}]} | [{"op":"moveType","type":"Shadow"},{"op":"moveProperty","path":"basePower","value":100}] | "Battle_MoveEffects.rb:2914,2928" |
| "modifyMoveLate" | {"all":[{"item":{"who":"user","values":["kingsrock","razorfang"]}},{"baseCanFlinch":false},{"any":[{"field":"rejuvenation:rainbow"},{"overlay":"rejuvenation:rainbow"},{"ability":{"who":"user","values":["serenegrace"]}}]}]} | [{"op":"secondaryChance","chance":20,"volatileStatus":"flinch"}] | "Battler.rb:3544-3548" |
| "modifyMoveLate" | {"all":[{"item":{"who":"user","values":["kingsrock","razorfang"]}},{"sheerForce":true}]} | [{"op":"moveProperty","path":"secondaries","value":[]}] | "Battler.rb:3544 (Sheer Force with a secondary effect suppresses item flinch)" |
| "modifyMove" | {"all":[{"move":"expandingforce"},{"any":[{"field":"rejuvenation:psychic_terrain"},{"overlay":"rejuvenation:psychic_terrain"}]}]} | [{"op":"moveProperty","path":"target","value":"allAdjacentFoes"}] | "Battler.rb:4979-4980 (spread regardless of user grounding)" |

## Original status-move highlights

Source UI buff highlights: `["coil","growth","floralhealing","synthesis","worryseed","ingrain","grasswhistle","leechseed","cottonspore","naturesmadness","grassyglide"]`.

Source UI nerf highlights: `[]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["coil","cottonspore","floralhealing","grassyglide","growth","naturesmadness","synthesis","worryseed"],"unreviewedHighlightedMoves":["grasswhistle","ingrain","leechseed"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Each row shows its recorded semantic decision and the named regression tests that prove it; the disposition, not the listing, is the evidence.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Battle.rb:3670 | [:ELECTERRAIN, :GRASSY, :MISTY, :PSYTERRAIN, :RAINBOW].include?(@battle.field.effect) && @turncount == 0 | unreachable_in_build | A scripted trainer field change remembers a terrain set on the first turn. Tests:  |
| Battle.rb:5859 | @field.effect == :GRASSY | implemented_and_tested | Grassy Terrain heals grounded, visible Pokémon a sixteenth; Sap Sipper heals another sixteenth, even when airborne. Tests: field abilities and field damage resolve at the end of the round |
| Battle.rb:7165 | [:GRASSY, :FOREST, :FLOWERGARDEN1, :FLOWERGARDEN2, :FLOWERGARDEN3, :FLOWERGARDEN4, :FLOWERGARDEN5].include?(@battle.FE) | implemented_and_tested | Wildfire damages non-Fire opposing active Pokemon by floor(maxHP/6) on grassy, forest and all garden stages, taking precedence over burn/trap 1/8; baseline is 1/16. Magic Guard prevents damage and original flavor is emitted before victims take damage. Tests: Wildfire residual fractions honor burned foes, foliage fields, immunity and source flavor |
| Battle.rb:7246 | pbIsBerry?(i.permeffs[:ItemRecycle]) && (pbRandom(100) > 50 \|\| (pbWeather(nil) == :SUNNYDAY && !i.hasWorkingItem(:UTILITYUMBRELLA)) \|\|<br>           @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 2, 5) \|\| (Rejuv && @battle.FE == :GRASSY)) | implemented_and_tested | Harvest always regrows its berry on Flower Garden stages two to five and on a hard Grassy Terrain. Tests: room clocks, Bad Dreams, Harvest and Slow Start follow the field at the end of the round |
| Battle_Effects.rb:1184 | Rejuv && @battle.FE == :GRASSY | implemented_and_tested | Big Root multiplies absorbed healing by 1.6 on Grassy Terrain. Tests: absorbed healing uses the source field multipliers, absorbed healing rounds Big Root before field scaling |
| Battle_Effects.rb:1188 | Rejuv && @battle.FE == :GRASSY | implemented_and_tested | Leech Seed restores 1.3 times as much on Grassy Terrain. Tests: absorbed healing uses the source field multipliers |
| Battle_Effects.rb:1197 | @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 2, 3) \|\| @battle.FE == :FOREST \|\| (Rejuv && (@battle.FE == :GRASSY \|\| @battle.OV == :GRASSY)) | implemented_and_tested | Ingrain restores twice as much on Flower Garden stages 2-3, Forest and Grassy Terrain (hard field or overlay). Tests: absorbed healing uses the source field multipliers, Aqua Ring and Ingrain scaling avoid overlay duplication |
| Battle_Effects.rb:1390 | Rejuv && (@battle.FE == :GRASSY \|\| @battle.OV == :GRASSY) | implemented_and_tested | Leaf Guard is active on Grassy Terrain, hard field or overlay. Tests: Leaf Guard, Flower Gift and Gale Wings are active on their source fields |
| Battle_Move.rb:1542 | ([:FOREST].include?(@battle.FE) \|\| (Rejuv && @battle.FE == :GRASSY)) && attacker.ability == :OVERGROW && type == :GRASS | implemented_and_tested | Overgrow is always active for Grass attacks on Forest and Grassy Terrain. Tests: pinch abilities activate from the field instead of low HP and never stack with it |
| Battle_Move.rb:1726 | opponent.ability == :GRASSPELT && ([:GRASSY, :FOREST].include?(@battle.FE) \|\| @battle.OV == :GRASSY) | implemented_and_tested | Grass Pelt is active on Forest as well as on Grassy Terrain (hard field or overlay). Tests: Marvel Scale and Grass Pelt are always active on their source fields |
| Battle_Move.rb:2302 | @move == :GRASSYGLIDE && (@battle.FE == :GRASSY \|\| @battle.OV == :GRASSY) | implemented_and_tested | Grassy Glide +1 hard field or overlay; Quash +1 on Dimensional/Frozen Dimension; Chess King +1; Deep Earth Core Enforcer -1 priority. Neutral controls and non-King roles retain native values. Tests: field priority additions cover hard terrain, overlays, chess roles and negative moves |
| Battle_MoveEffects.rb:917 | @battle.FE == :GRASSY \|\| (Rejuv && @battle.FE == :DRAGONSDEN) | implemented_and_tested | Coil raises all three stats two stages on Grassy Terrain and Dragon's Den. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_MoveEffects.rb:964 | [:GRASSY, :FOREST].include?(@battle.FE) \|\| @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 1, 2) | implemented_and_tested | Growth raises both stats two stages on Grassy Terrain, Forest and Flower Garden stages 1-2. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_MoveEffects.rb:1647 | Rejuv && @battle.FE == :GRASSY && @move == :COTTONSPORE | implemented_and_tested | Grassy Terrain Cotton Spore lowers Speed three stages. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_MoveEffects.rb:2251 | Rejuv && @battle.FE == :GRASSY | implemented_and_tested | Grassy Terrain Worry Seed also lowers the target Attack one stage after a successful ability change. Tests: Grassy Terrain Worry Seed also lowers Attack |
| Battle_MoveEffects.rb:2432 | @move == :NATURESMADNESS && [:GRASSY, :FOREST].include?(@battle.FE) | implemented_and_tested | Nature's Madness removes 75 percent of current HP on Grassy Terrain and Forest. Tests: fixed-damage moves use their source field amounts |
| Battle_MoveEffects.rb:4430 | [:CLOUDS, :SKY].include?(@battle.FE) \|\| (Rejuv && (@battle.FE == :GRASSY \|\| @battle.OV == :GRASSY)) | implemented_and_tested | Razor Wind strikes at once in the Sky and on Grassy Terrain, hard field or overlay. Tests: two-turn moves strike at once on their source fields |
| Battle_MoveEffects.rb:5237 | ([:DARKCRYSTALCAVERN, :STARLIGHT, :NEWWORLD, :BEWITCHED].include?(@battle.FE) && @move == :MOONLIGHT) \|\| (Rejuv && @battle.FE == :GRASSY && @move == :SYNTHESIS) | implemented_and_tested | Moonlight restores 75 percent on Dark Crystal Cavern, Starlight, New World and Bewitched Woods, and Synthesis on Grassy Terrain. Tests: healing moves restore their source field shares |
| Battle_MoveEffects.rb:5366 | Rejuv && @battle.FE == :GRASSY && [:ABSORB, :MEGADRAIN, :GIGADRAIN, :HORNLEECH].include?(@move) | implemented_and_tested | Absorb, Mega Drain, Giga Drain and Horn Leech restore 75 percent on Grassy Terrain. Tests: healing moves restore their source field shares |
| Battle_MoveEffects.rb:7890 | [:GRASSY, :FAIRYTALE].include?(@battle.FE) \|\|<br>       @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 3, 5) | implemented_and_tested | Floral Healing restores all HP on Grassy Terrain, Fairy Tale and from Flower Garden stage 3. Tests: healing moves restore their source field shares |
| Battle_ZMove.rb:269 | @battle.canChangeFE?([:GRASSY, :FOREST, *PBFields::FLOWERGARDEN]) | implemented_and_tested | Bloom Doom creates three turns of Grassy Terrain where the field can change. Tests: Bloom Doom creates a three-turn field but respects native field restrictions |
| Battler.rb:2804 | Rejuv && @battle.FE == :GRASSY && @battle.state.effects[:HarshSunlight] | implemented_and_tested | When Desolate Land starts harsh sunlight on Grassy Terrain the field becomes Desert permanently. Tests: primal weather abilities transform Deux Finalis and Grassy Terrain permanently |
| Battler.rb:2841 | self.ability == :GRASSYSURGE && @battle.FE != :GRASSY && @battle.OV != :GRASSY | implemented_and_tested | Grassy Surge creates Grassy Terrain unless it is already the hard field or overlay. Tests: surge abilities respect the source terrain restrictions |
| Battler.rb:3878 | [:BEWITCHED, :GRASSY, :FLOWERGARDEN2, :FLOWERGARDEN3, :FLOWERGARDEN4, :FLOWERGARDEN5].include?(@battle.FE) | implemented_and_tested | Cotton Down reduces Speed by two on the listed plant fields for every other active battler, including partners; ordinary stat protections remain native. Tests: Cotton Down doubles its speed loss for all other active Pokemon on plant fields |
| Battler.rb:3930 | @battle.canChangeFE?(:GRASSY) && @battle.OV != :GRASSY && @battle.FE != :FROZENDIMENSION && (Overlays \|\| @battle.FE != :FLOWERGARDEN5) | implemented_and_tested | Seed Sower grows Garden stages 1-4; other permitted fields create Grassy terrain with source duration/Amplifield and Forest/Bewitched extensions. Ability creation ignores the move-only Everstone restriction. Tests: Seed Sower grows each garden stage and creates longer forest terrain without Everstone blocking |
| Battler.rb:7302 | self.ability == :GRASSPELT && ([:GRASSY, :FOREST].include?(@battle.FE) \|\| @battle.OV == :GRASSY) | implemented_and_tested | Grass Pelt activates on Forest/Grassy hard field or Grassy overlay. Tests: Marvel Scale and Grass Pelt are always active on their source fields |

AI source leads: 24. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":[],"abilities":[],"items":[]}`.
