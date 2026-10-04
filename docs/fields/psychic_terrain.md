# Psychic Terrain

Original ID: `PSYTERRAIN`; datapack ID: `rejuvenation:psychic_terrain`.

**Status:** implemented; every runtime source lead is implemented and tested or recorded as an exclusion or limitation. Compiled definition comparison passed. Not certified through exhaustive live or multiplayer play. Field-specific exceptions are listed in [FIELD_COVERAGE.md](../FIELD_COVERAGE.md).

## Initialization

Entry text: "The field became mysterious!"

Nature Power: `psychic`. Secret Power animation/reference move: `psychic`.

Secret Power actual secondary choices: `[{"volatileStatus":"confusion"}]`.

Mimicry type: `Psychic`; Burmy cloak reference: `TRASHCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"magicalseed","effect":null,"duration":0,"message":null,"stats":{"spa":2}}`. Seed actions: `[{"op":"volatile","id":"confusion"}]`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":8,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820","sourceAbilities":["gravitycontrol"]},"trickroom":{"duration":8,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":8,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":8,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `null` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The terrain returned to normal."`.

Shared stat pools: `null`. Absorber policies: `null`. Indirect immunity: `null`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"zenmode":{"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"darmanitan"}},{"any":[{"formName":{"who":"user","value":""}},{"formName":{"who":"user","value":"Zen"}}]}]},"actions":[{"op":"form","species":"darmanitanzen","message":"Zen Mode triggered!"}],"source":"Battler.rb:1767"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":5,"extendedBy":3,"blockEverstone":false}],"source":"Battler.rb:3926"}},"galvanize":{"onBasePower":{"mode":"replace","condition":{"all":[{"abilityChangedType":true},{"overlay":"rejuvenation:electric_terrain"}]},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1249"}},"pixilate":{"onBasePower":{"mode":"replace","condition":{"all":[{"abilityChangedType":true},{"overlay":"rejuvenation:misty_terrain"}]},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1262"}},"purepower":{"onModifyAtk":{"mode":"replace","condition":{"always":true},"actions":[],"source":"Battle_Move.rb:1517"}},"plus":{"onModifySpA":{"mode":"replace","condition":{"overlay":"rejuvenation:electric_terrain"},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1495-1499"}},"minus":{"onModifySpA":{"mode":"replace","condition":{"overlay":"rejuvenation:electric_terrain"},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1495-1499"}},"powerspot":{"onAllyBasePower":{"mode":"replace","condition":{"holderIsUser":false},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1581"}},"marvelscale":{"onModifyDef":{"mode":"replace","condition":{"overlay":"rejuvenation:misty_terrain"},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1724"}},"tempest":{"onEnd":{"mode":"replace","condition":{"always":true},"actions":[{"op":"reconcileWeather"}],"source":"Battler.rb:3515-3516"}},"comatose":{"onStart":{"mode":"replace","condition":{"always":true},"actions":[{"op":"abilityMessage"},{"op":"message","text":"{1} is drowsing!"}],"source":"Battler.rb:3013-3017 (hard Electric field alone disables Comatose)"}},"slowstart":{"onStart":{"mode":"replace","condition":{"always":true},"actions":[{"op":"volatile","id":"slowstart","silent":true,"message":"{1} is slow to get going!"}],"source":"Battler.rb:3288-3289 (clock retained even on Deep Earth)"}}}`. Inactive abilities: `null`. Status type bypass: `null`.

Field form typing: `["arceus","silvally"]`. Custom volatile rules: `null`. Rampage policy: `null`.

Progression: `null`. Party roles: `null`.

Field clock policy: `null`.

Fields persist for the battle unless transformed/destroyed. Move/ability terrain creation uses its own finite duration; engine stack restoration and overlay clocks are described in ARCHITECTURE.md.

## Core move rules

| Move ID | Executable properties and exact source text |
|---|---|
| `secretpower` | {"multiplier":1.5,"message":"The psychic energy strengthened the attack!"} |
| `hiddenpower` | {"multiplier":1.5,"message":"The psychic energy strengthened the attack!"} |
| `hex` | {"multiplier":1.5,"message":"The psychic energy strengthened the attack!"} |
| `magicalleaf` | {"multiplier":1.5,"message":"The psychic energy strengthened the attack!"} |
| `mysticalfire` | {"multiplier":1.5,"message":"The psychic energy strengthened the attack!"} |
| `moonblast` | {"multiplier":1.5,"message":"The psychic energy strengthened the attack!"} |
| `aurasphere` | {"multiplier":1.5,"message":"The psychic energy strengthened the attack!"} |
| `focusblast` | {"multiplier":1.5,"message":"The psychic energy strengthened the attack!"} |
| `mindblown` | {"multiplier":1.5,"message":"The psychic energy strengthened the attack!"} |
| `hypnosis` | {"accuracy":90} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Psychic"} | {"condition":{"not":{"grounded":{"who":"user","value":false}}},"multiplier":1.5,"message":"The Psychic Terrain strengthened the attack!"} |

## Overlay definition

```json
{
  "moves": {
    "secretpower": {
      "multiplier": 1.5,
      "message": "The psychic energy strengthened the attack!"
    },
    "hiddenpower": {
      "multiplier": 1.5,
      "message": "The psychic energy strengthened the attack!"
    },
    "hex": {
      "multiplier": 1.5,
      "message": "The psychic energy strengthened the attack!"
    },
    "magicalleaf": {
      "multiplier": 1.5,
      "message": "The psychic energy strengthened the attack!"
    },
    "mysticalfire": {
      "multiplier": 1.5,
      "message": "The psychic energy strengthened the attack!"
    },
    "moonblast": {
      "multiplier": 1.5,
      "message": "The psychic energy strengthened the attack!"
    },
    "aurasphere": {
      "multiplier": 1.5,
      "message": "The psychic energy strengthened the attack!"
    },
    "focusblast": {
      "multiplier": 1.5,
      "message": "The psychic energy strengthened the attack!"
    },
    "mindblown": {
      "multiplier": 1.5,
      "message": "The psychic energy strengthened the attack!"
    }
  },
  "types": [
    {
      "match": {
        "moveType": "Psychic"
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
      "message": "The Psychic Terrain strengthened the attack!"
    }
  ]
}
```

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "switchIn" | {"ability":{"who":"user","values":["anticipation","forewarn"]}} | [{"op":"boost","stats":{"spa":2}}] | "Battler.rb:2215" |
| "switchIn" | {"ability":{"who":"user","values":["mindseye"]}} | [{"op":"boost","stats":{"spa":1}}] | "Battler.rb:2225" |
| "baseAccuracy" | {"all":[{"effectiveAbility":{"who":"target","values":["magician"]}},{"category":"Status"}]} | [{"op":"cap","value":50}] | "Battle_Move.rb:894" |
| "tryHit" | {"all":[{"all":[{"grounded":{"who":"target","value":true}},{"priority":{"op":">","value":0}},{"foe":true}]},{"not":{"all":[{"field":"rejuvenation:chess_board"},{"role":{"who":"user","value":"king"}}]}}]} | [{"op":"reject"}] | "Battle_Move.rb:psychic priority immunity" |
| "modifyMove" | {"all":[{"overlay":"rejuvenation:rainbow"},{"not":{"all":[{"ability":{"who":"user","values":["serenegrace"]}},{"canFlinch":true}]}}]} | [{"op":"secondaryChance","multiplier":2}] | "Battle_Move.rb:2328-2329" |
| "specialAttack" | {"ability":{"who":"user","values":["purepower"]}} | [{"op":"multiply","value":2}] | "Battle_Move.rb:1502" |
| "modifyMove" | {"all":[{"overlay":"rejuvenation:rainbow"},{"moveType":"Normal"},{"category":"Special"}]} | [{"op":"extraType","values":["Normal","Fire","Water","Electric","Grass","Ice","Fighting","Poison","Ground","Flying","Psychic","Bug","Rock","Ghost","Dragon","Dark","Steel","Fairy"],"excludePrimary":true,"layer":"overlay"}] | "Battle_Move.rb:837-838; Battle_Field.rb:117-136" |
| "speed" | {"all":[{"ability":{"who":"user","values":["telepathy"]}},{"field":"rejuvenation:psychic_terrain"}]} | [{"op":"multiply","value":2}] | "Battle_Effects.rb:1450-1455; Battler.rb:1177" |
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
| "modifyMove" | {"move":"telekinesis"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"boost","who":"target","stats":{"def":-2,"spd":-2}}]}] | "Battle_MoveEffects.rb:6880" |
| "modifyMove" | {"move":"psychup"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"boost","stats":{"spa":2}}]}] | "Battle_MoveEffects.rb:1802" |
| "modifyMove" | {"move":"mindreader"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"boost","stats":{"spa":2}}]}] | "Battle_MoveEffects.rb:3641" |
| "modifyMove" | {"move":"miracleeye"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"boost","stats":{"spa":2}}]}] | "Battle_MoveEffects.rb:3682" |
| "modifyMove" | {"all":[{"move":"mist"},{"not":{"sideCondition":"mist"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"createField","field":"rejuvenation:misty_terrain","duration":3,"extendedBy":3,"message":"Mist swirled around the battlefield!"}]}] | "Battle_MoveEffects.rb:1817" |
| "modifyMove" | {"move":"meditate"} | [{"op":"moveProperty","path":"boosts","value":{"atk":2,"spa":2}}] | "Battle_MoveEffects.rb:756" |
| "modifyMove" | {"move":"cosmicpower"} | [{"op":"moveProperty","path":"boosts","value":{"def":2,"spd":2}}] | "Battle_MoveEffects.rb:993" |
| "modifyMove" | {"move":"calmmind"} | [{"op":"moveProperty","path":"boosts","value":{"spa":2,"spd":2}}] | "Battle_MoveEffects.rb:1024" |
| "modifyMove" | {"move":"nastyplot"} | [{"op":"moveProperty","path":"boosts","value":{"spa":3}}] | "Battle_MoveEffects.rb:1131" |
| "modifyMove" | {"move":"kinesis"} | [{"op":"moveProperty","path":"boosts","value":{"accuracy":-2}}] | "Battle_MoveEffects.rb:1504" |
| "modifyMove" | {"move":"psyshieldbash"} | [{"op":"moveProperty","path":"self.boosts","value":{"def":1,"spd":1}}] | "Battle_MoveEffects.rb:784" |
| "modifyMove" | {"move":"esperwing"} | [{"op":"moveProperty","path":"secondaries.0.self.boosts","value":{"spe":2}}] | "Battle_MoveEffects.rb:823" |
| "modifyMove" | {"move":"mysticalpower"} | [{"op":"moveProperty","path":"secondaries.0.self.boosts","value":{"spa":2}}] | "Battle_MoveEffects.rb:845" |
| "modifyMove" | {"move":"shatteredpsyche"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"volatile","id":"confusion","who":"target","message":"The field got too weird for {1}!"}]}] | "Battle_ZMove.rb:281" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "modifyMove" | {"move":"stokedsparksurfer"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:electric_terrain","duration":3,"extendedBy":0,"blockEverstone":false,"message":"An electric current ran across the battlefield!"}]}] | "Battle_ZMove.rb:290-301" |
| "modifyMove" | {"move":"genesissupernova"} | [{"op":"moveProperty","path":"secondaries.0.self","value":null},{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:psychic_terrain","duration":5,"extendedBy":0,"blockEverstone":false,"message":"Psychic energy spread across the battlefield!"}]}] | "Battle_ZMove.rb:322-332" |
| "modifyMove" | {"move":"plasmafists"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:electric_terrain","duration":3,"extendedBy":3,"message":"An electric current ran across the battlefield!"}]}] | "Battle_MoveEffects.rb:8306-8320" |
| "modifyMove" | {"all":[{"move":"iondeluge"},{"not":{"pseudoWeather":{"id":"iondeluge","value":true}}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitField","actions":[{"op":"createField","field":"rejuvenation:electric_terrain","duration":3,"extendedBy":3,"message":"An electric current ran across the battlefield!"}]}] | "Battle_MoveEffects.rb:7500-7519" |
| "modifyMove" | {"move":"kinesis"} | [{"op":"moveBehavior","recipe":"dualBoost","targetStats":{"accuracy":-2},"userStats":{"atk":2,"spa":2}}] | "Battle_MoveEffects.rb:1492" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["zenmode"]}},{"species":{"who":"user","value":"darmanitan"}},{"formName":{"who":"user","value":""}}]} | [{"op":"form","species":"darmanitanzen","message":"Zen Mode triggered!"}] | "Battler.rb:1767-1782; 2746" |
| "residual" | {"all":[{"ability":{"who":"user","values":["zenmode"]}},{"species":{"who":"user","value":"darmanitan"}},{"formName":{"who":"user","value":""}}]} | [{"op":"form","species":"darmanitanzen","message":"Zen Mode triggered!"}] | "Battler.rb:1767-1782; 2746" |
| "damage" | {"all":[{"all":[{"moveType":"Poison"},{"sideAbility":{"who":"target","values":["pastelveil"]}}]},{"overlay":"rejuvenation:misty_terrain"}]} | [{"op":"multiply","value":0.5}] | "Battle_Move.rb:1821" |
| "modifyMove" | {"any":[{"move":"photongeyser"},{"move":"lightthatburnsthesky"}]} | [{"op":"moveBehavior","recipe":"smartCategory","comparison":"offense","contactByCategory":false,"specialMultipliers":[{"condition":{"allyAbility":{"who":"user","values":["battery"]}},"factor":1.3},{"condition":{"all":[{"ability":{"who":"user","values":["flareboost"]}},{"pokemonStatus":"brn"}]},"factor":1.5}],"physicalMultipliers":[],"defenseMultipliers":[],"specialDefenseMultipliers":[]}] | "Battle_Move.rb:359-390" |
| "modifyMove" | {"move":"shellsidearm"} | [{"op":"moveBehavior","recipe":"smartCategory","comparison":"difference","contactByCategory":true,"specialMultipliers":[{"condition":{"allyAbility":{"who":"user","values":["battery"]}},"factor":1.3},{"condition":{"all":[{"ability":{"who":"user","values":["flareboost"]}},{"pokemonStatus":"brn"}]},"factor":1.5}],"physicalMultipliers":[{"condition":{"ability":{"who":"user","values":["toughclaws"]}},"factor":1.3}],"defenseMultipliers":[{"condition":{"all":[{"effectiveAbility":{"who":"target","values":["fluffy"]}},{"not":{"ability":{"who":"user","values":["longreach"]}}}]},"factor":2}],"specialDefenseMultipliers":[{"condition":{"effectiveAbility":{"who":"target","values":["icescales"]}},"factor":2}]}] | "Battle_Move.rb:359-390" |
| "modifyMove" | {"all":[{"move":"terastarstorm"},{"species":{"who":"user","value":"terapagos"}},{"formName":{"who":"user","value":"Stellar"}}]} | [{"op":"moveBehavior","recipe":"smartCategory","comparison":"offense","contactByCategory":false,"specialMultipliers":[{"condition":{"allyAbility":{"who":"user","values":["battery"]}},"factor":1.3},{"condition":{"all":[{"ability":{"who":"user","values":["flareboost"]}},{"pokemonStatus":"brn"}]},"factor":1.5}],"physicalMultipliers":[],"defenseMultipliers":[],"specialDefenseMultipliers":[]}] | "Battle_Move.rb:359-390; Battle_MoveEffects.rb:9817-9838" |
| "attack" | {"all":[{"moveType":"Fire"},{"item":{"who":"target","values":["nevermeltice"]}},{"stateFlag":"neverMeltIce"}]} | [{"op":"multiply","value":0.66},{"op":"moveMessage","text":"The Never-Melt Ice's sheer cold weakened {move}'s power!"}] | "Battle_Move.rb:1570-1573,1939-1944" |
| "specialAttack" | {"all":[{"moveType":"Fire"},{"item":{"who":"target","values":["nevermeltice"]}},{"stateFlag":"neverMeltIce"}]} | [{"op":"multiply","value":0.66},{"op":"moveMessage","text":"The Never-Melt Ice's sheer cold weakened {move}'s power!"}] | "Battle_Move.rb:1570-1573,1939-1944" |
| "tryHit" | {"all":[{"move":"confide"},{"boostStage":{"who":"target","stat":"spa","op":">","value":-6}}]} | [{"op":"message","text":"Psst... This field is pretty weird, huh?"}] | "Battle_MoveEffects.rb:1440-1442" |
| "modifyMove" | {"all":[{"move":"weatherball"},{"weather":"shadowsky"}]} | [{"op":"moveType","type":"Shadow"},{"op":"moveProperty","path":"basePower","value":100}] | "Battle_MoveEffects.rb:2914,2928" |
| "modifyMoveLate" | {"all":[{"item":{"who":"user","values":["kingsrock","razorfang"]}},{"baseCanFlinch":false},{"any":[{"field":"rejuvenation:rainbow"},{"overlay":"rejuvenation:rainbow"},{"ability":{"who":"user","values":["serenegrace"]}}]}]} | [{"op":"secondaryChance","chance":20,"volatileStatus":"flinch"}] | "Battler.rb:3544-3548" |
| "modifyMoveLate" | {"all":[{"item":{"who":"user","values":["kingsrock","razorfang"]}},{"sheerForce":true}]} | [{"op":"moveProperty","path":"secondaries","value":[]}] | "Battler.rb:3544 (Sheer Force with a secondary effect suppresses item flinch)" |
| "modifyMove" | {"all":[{"move":"expandingforce"},{"any":[{"field":"rejuvenation:psychic_terrain"},{"overlay":"rejuvenation:psychic_terrain"}]}]} | [{"op":"moveProperty","path":"target","value":"allAdjacentFoes"}] | "Battler.rb:4979-4980 (spread regardless of user grounding)" |

## Original status-move highlights

Source UI buff highlights: `["calmmind","cosmicpower","kinesis","meditate","nastyplot","hypnosis","psychup","mindreader","miracleeye","telekinesis","gravity","magicroom","trickroom","wonderroom","mysticalpower","expandingforce"]`.

Source UI nerf highlights: `[]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["calmmind","cosmicpower","expandingforce","kinesis","meditate","mindreader","miracleeye","mysticalpower","nastyplot","psychup","telekinesis"],"unreviewedHighlightedMoves":["gravity","hypnosis","magicroom","trickroom","wonderroom"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Each row shows its recorded semantic decision and the named regression tests that prove it; the disposition, not the listing, is the evidence.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Battle.rb:3670 | [:ELECTERRAIN, :GRASSY, :MISTY, :PSYTERRAIN, :RAINBOW].include?(@battle.field.effect) && @turncount == 0 | unreachable_in_build | A scripted trainer field change remembers a terrain set on the first turn. Tests:  |
| Battle_Effects.rb:1452 | @battle.FE == :PSYTERRAIN | implemented_and_tested | Telepathy doubles Speed on the hard Psychic Terrain; the overlay clause is commented out. Tests: speed abilities are active on their source fields |
| Battle_Inspect.rb:11 | [:HAUNTED, :BEWITCHED, :HOLY, :PSYTERRAIN, :DEEPEARTH].include?(@battle.FE) | presentation_only | Battle Inspect screen: recomputes a multiplier or status line for display in the stat-inspection panel. Tests:  |
| Battle_Move.rb:894 | pbIsStatus? && (opponent.ability == :WONDERSKIN \|\| (Rejuv && @battle.FE == :PSYTERRAIN && opponent.ability == :MAGICIAN)) && !opponent.moldbroken | implemented_and_tested | Underwater Electric accuracy has an early perfect result except OHKO moves; Rainbow Wonder Skin sets zero and Psychic Terrain Magician caps base accuracy at 50 only when not suppressed. Rocky Long Reach multiplies accuracy by 0.9; inactive !Rejuv Forest stays absent. Base caps precede item multipliers and stages; perfect moves stay perfect. Tests: source accuracy changes honor airborne targets and ability suppression, accuracy early returns preserve perfect moves, OHKO exceptions and native item order |
| Battle_Move.rb:1494 | attacker.ability == :PUREPOWER && (@battle.FE == :PSYTERRAIN \|\| @battle.OV == :PSYTERRAIN) | implemented_and_tested | Pure Power doubles the special attacking stat on Psychic Terrain, hard field or overlay. Tests: stat-doubling and terrain abilities follow their source field conditions |
| Battle_Move.rb:1517 | attacker.ability == :PUREPOWER && !(@battle.FE == :PSYTERRAIN \|\| @battle.OV == :PSYTERRAIN) | implemented_and_tested | Pure Power does not double Attack on Psychic Terrain, hard field or overlay. Tests: stat-doubling and terrain abilities follow their source field conditions |
| Battle_Move.rb:1581 | [:HAUNTED, :BEWITCHED, :HOLY, :PSYTERRAIN, :DEEPEARTH, :DEUXFINALIS].include?(@battle.FE) | implemented_and_tested | Power Spot strengthens an ally by 1.5 on Haunted, Bewitched Woods, Holy, Psychic Terrain, Deep Earth and Deux Finalis. Tests: ally power abilities use the source field multiplier |
| Battle_Move.rb:1694 | opponent.ability == :PUREPOWER && (@battle.FE == :PSYTERRAIN \|\| @battle.OV == :PSYTERRAIN) | implemented_and_tested | Defensive Special Attack borrowing on Glitch includes Pure Power under a Psychic overlay. Tests: Glitch defensive shared Special borrows the fully modified Special Attack under ordinary field overlays |
| Battle_MoveEffects.rb:744 | @battle.FE == :PSYTERRAIN && @move == :MEDITATE | implemented_and_tested | Psychic Terrain Meditate can be used while either offensive stat can still rise. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_MoveEffects.rb:756 | @battle.FE == :PSYTERRAIN && @move == :MEDITATE | implemented_and_tested | Psychic Terrain Meditate raises Attack and Special Attack two stages each. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_MoveEffects.rb:784 | @battle.FE == :PSYTERRAIN && @move == :PSYSHIELDBASH | implemented_and_tested | Psychic Terrain Psyshield Bash raises both defenses. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_MoveEffects.rb:823 | @move == :ESPERWING && @battle.FE == :PSYTERRAIN | implemented_and_tested | Psychic Terrain Esper Wing raises Speed two stages. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_MoveEffects.rb:845 | @battle.FE == :PSYTERRAIN && @move == :MYSTICALPOWER | implemented_and_tested | Psychic Terrain Mystical Power raises Special Attack two stages. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_MoveEffects.rb:993 | [:MISTY, :RAINBOW, :HOLY, :STARLIGHT, :NEWWORLD, :PSYTERRAIN].include?(@battle.FE) && @move == :COSMICPOWER | implemented_and_tested | Cosmic Power raises both defenses two stages on its six source fields. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_MoveEffects.rb:1024 | [:CHESS, :ASHENBEACH, :PSYTERRAIN].include?(@battle.FE) | implemented_and_tested | Calm Mind raises both stats two stages on Chess Board, Ashen Beach and Psychic Terrain. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_MoveEffects.rb:1131 | [:CHESS, :PSYTERRAIN, :INFERNAL, :BACKALLEY].include?(@battle.FE) | implemented_and_tested | Nasty Plot raises Special Attack three stages on Chess Board, Psychic Terrain, Infernal and Back Alley. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_MoveEffects.rb:1440 | @move == :CONFIDE && @battle.FE == :PSYTERRAIN | implemented_and_tested | Psychic Terrain Confide shows "Psst... This field is pretty weird, huh?" when it is able to act. The port prints the line in the hit check; a target protected from stat drops by an ability still gets the line. Tests: Psychic Terrain Confide shows its source line only when the move can act |
| Battle_MoveEffects.rb:1492 | @battle.FE == :PSYTERRAIN && @move == :KINESIS | implemented_and_tested | Psychic Terrain Kinesis can be used while the user can still raise an offensive stat. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_MoveEffects.rb:1504 | [:ASHENBEACH, :PSYTERRAIN].include?(@battle.FE) && @move == :KINESIS | implemented_and_tested | Kinesis lowers accuracy two stages on Ashen Beach and Psychic Terrain. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_MoveEffects.rb:1508 | stats == PBStats::ACCURACY && !(@battle.FE == :PSYTERRAIN && @move == :KINESIS) | implemented_and_tested | Ability-box presentation choice for the Kinesis stat change; the stat result is the tested behaviour. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_MoveEffects.rb:1510 | @battle.FE == :PSYTERRAIN && @move == :KINESIS | implemented_and_tested | Psychic Terrain Kinesis raises the user offensive stats two stages. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_MoveEffects.rb:1802 | @battle.FE == :PSYTERRAIN | implemented_and_tested | Psychic Terrain Psych Up raises Special Attack two stages. Tests: Psych Up cures Beach status and adds Psychic field Special Attack |
| Battle_MoveEffects.rb:3641 | @battle.FE == :PSYTERRAIN && @move == :MINDREADER | implemented_and_tested | Psychic Terrain Mind Reader raises Special Attack two stages; Lock-On does not. Tests: remaining single-battle move branches follow the source |
| Battle_MoveEffects.rb:3682 | [:HOLY, :FAIRYTALE, :PSYTERRAIN].include?(@battle.FE) | implemented_and_tested | Miracle Eye raises Special Attack two stages on Holy, Fairy Tale and Psychic Terrain. Tests: remaining single-battle move branches follow the source |
| Battle_MoveEffects.rb:6137 | [:NEWWORLD, :PSYTERRAIN].include?(@battle.FE) \|\| attacker.hasWorkingItem(:AMPLIFIELDROCK) \|\| (Rejuv && @battle.FE == :STARLIGHT) | implemented_and_tested | Magic Room lasts eight turns on New World, Psychic Terrain and Starlight. Tests: room and Gravity clocks use source fields and working Amplifield Rock |
| Battle_MoveEffects.rb:6820 | attacker.hasWorkingItem(:AMPLIFIELDROCK) \|\| @battle.FE == :PSYTERRAIN | implemented_and_tested | Gravity lasts eight turns on Psychic Terrain. Tests: room and Gravity clocks use source fields and working Amplifield Rock |
| Battle_MoveEffects.rb:6873 | @battle.FE == :PSYTERRAIN | implemented_and_tested | Psychic Terrain Telekinesis lowers both defenses two stages. Tests: Psychic terrain Telekinesis lowers both defensive stages |
| Battle_MoveEffects.rb:6959 | [:CHESS, :NEWWORLD, :PSYTERRAIN].include?(@battle.FE) \|\| attacker.hasWorkingItem(:AMPLIFIELDROCK) \|\| (Rejuv && @battle.FE == :STARLIGHT) | implemented_and_tested | Trick Room lasts eight turns on Chess Board, New World, Psychic Terrain and Starlight. Tests: room and Gravity clocks use source fields and working Amplifield Rock |
| Battle_MoveEffects.rb:7029 | [:NEWWORLD, :PSYTERRAIN].include?(@battle.FE) \|\| attacker.hasWorkingItem(:AMPLIFIELDROCK) \|\| (Rejuv && @battle.FE == :STARLIGHT) | implemented_and_tested | Wonder Room lasts eight turns on New World, Psychic Terrain and Starlight. Tests: room and Gravity clocks use source fields and working Amplifield Rock |
| Battle_MoveEffects.rb:9108 | (@battle.FE == :PSYTERRAIN \|\| @battle.OV == :PSYTERRAIN) && !attacker.isAirborne? | implemented_and_tested | Expanding Force gains 1.5 for a grounded user on Psychic Terrain, hard field or overlay. Tests: variable-power moves use their source field values |
| Battle_Scene.rb:6140 | move.move == :EXPANDINGFORCE && battle.FE == :PSYTERRAIN && attacker.isAirborne? | presentation_only | Fight-menu highlight: decides whether a move button is tinted as field-boosted. Tests:  |
| Battle_ZMove.rb:281 | @battle.FE == :PSYTERRAIN | implemented_and_tested | Psychic Terrain Shattered Psyche inflicts confusion when eligible, preserves its native state/start event with silent generic text, then emits the exact weird-field message. Tests: Shattered Psyche confusion retains the source weird-field message and silent native update |
| Battler.rb:1770 | self.hp <= zenHP \|\| (unovaZenFields.include?(@battle.FE) && self.form < 2) \|\| (galarZenFields.include?(@battle.FE) && self.form > 1) | implemented_and_tested | Zen Mode uses <= floor(maxHP/2), or full-HP force on Unovan Ashen Beach/Psychic Terrain forms only. Galarian forms retain native HP behavior on these fields. Ordinary ability gates and entry/end-round timing are preserved; the enclosing Crest clause is excluded separately. Tests: Ashen Beach and Psychic Terrain force ordinary Zen Mode at full HP and restore outside, source forced Zen fields leave Galarian forms and suppressed Zen Mode unchanged, field form checks run on entry before the first move |
| Battler.rb:2215 | @battle.FE == :PSYTERRAIN | implemented_and_tested | Psychic Terrain: Anticipation and Forewarn +2 Special Attack, Mind's Eye +1. Tests: every source field-entry stat ability changes exactly its listed stages |
| Battler.rb:2644 | @battle.OV == :PSYTERRAIN | implemented_and_tested | Under a Psychic Terrain overlay Anticipation and Forewarn gain one Special Attack stage. Tests: overlay entry ability boosts apply to current and newly entering battlers |
| Battler.rb:2858 | self.ability == :PSYCHICSURGE && @battle.FE != :PSYTERRAIN && @battle.OV != :PSYTERRAIN | implemented_and_tested | Psychic Surge creates Psychic Terrain unless already present; Amplifield Rock gives eight turns. Tests: surge abilities respect the source terrain restrictions |
| Battler.rb:2926 | self.hasWorkingItem(:AMPLIFIELDROCK) \|\| @battle.FE == :PSYTERRAIN | implemented_and_tested | Gravity Control starts Gravity for five turns or eight with working Amplifield Rock/Psychic Terrain, only if inactive. Its source Gravity move reactions also run. Tests: Gravity Control sets source clocks once and remains airborne under its own gravity |
| Battler.rb:4242 | :PSYTERRAIN | implemented_and_tested | Psychic Seed uses native confusion and immunity handling. Tests: every defined field Seed activates and is consumed |
| Battler.rb:4979 | (@battle.FE == :PSYTERRAIN \|\| @battle.OV == :PSYTERRAIN) && move.move == :EXPANDINGFORCE | implemented_and_tested | Psychic hard field/overlay makes Expanding Force spread even when airborne; its separate native 1.5 power multiplier still requires grounding. Tests: Expanding Force spreads while airborne on hard Psychic Terrain and an overlay without the grounded power bonus |
| Battler.rb:5255 | (@battle.FE == :PSYTERRAIN \|\| @battle.OV == :PSYTERRAIN) && movetoblock.priorityCheck(self) > 0 | implemented_and_tested | Psychic hard/overlay blocks opposing positive-priority moves against grounded targets, except the Chess King. Tests: Chess King bypasses Psychic overlays while every other Chess piece remains blocked |
| Battler.rb:7280 | self.ability == :PUREPOWER && !(@battle.FE == :PSYTERRAIN \|\| @battle.OV == :PSYTERRAIN) | implemented_and_tested | Pure Power physical Attack is not doubled under Psychic hard field/overlay. Tests: stat-doubling and terrain abilities follow their source field conditions |
| Battler.rb:7337 | self.ability == :PUREPOWER && (@battle.FE == :PSYTERRAIN \|\| @battle.OV == :PSYTERRAIN) | implemented_and_tested | Psychic Pure Power doubles Special Attack instead of physical Attack, including overlays. Tests: stat-doubling and terrain abilities follow their source field conditions |

AI source leads: 27. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":[],"abilities":[],"items":[]}`.
