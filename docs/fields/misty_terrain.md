# Misty Terrain

Original ID: `MISTY`; datapack ID: `rejuvenation:misty_terrain`.

**Status:** implemented; every runtime source lead is implemented and tested or recorded as an exclusion or limitation. Compiled definition comparison passed. Not certified through exhaustive live or multiplayer play. Field-specific exceptions are listed in [FIELD_COVERAGE.md](../FIELD_COVERAGE.md).

## Initialization

Entry text: "Mist settles on the field."

Nature Power: `mistball`. Secret Power animation/reference move: `mistball`.

Secret Power actual secondary choices: `[{"boosts":{"spa":-1}}]`.

Mimicry type: `Fairy`; Burmy cloak reference: `PLANTCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"elementalseed","effect":null,"duration":0,"message":null,"stats":{"spd":1}}`. Seed actions: `[{"op":"wish","fraction":0.75,"message":"A wish was made for {1}!"}]`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{"aquaring":2},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820","sourceAbilities":["gravitycontrol"]},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `null` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The terrain returned to normal."`.

Shared stat pools: `null`. Absorber policies: `null`. Indirect immunity: `null`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"soulheart":{"onAnyFaint":{"mode":"replace","condition":{"always":true},"actions":[{"op":"boost","stats":{"spa":1,"spd":1}}],"source":"Battler.rb:1400"}},"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":5,"extendedBy":3,"blockEverstone":false}],"source":"Battler.rb:3926"}},"galvanize":{"onBasePower":{"mode":"replace","condition":{"all":[{"abilityChangedType":true},{"overlay":"rejuvenation:electric_terrain"}]},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1249"}},"pixilate":{"onBasePower":{"mode":"replace","condition":{"abilityChangedType":true},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1262"}},"purepower":{"onModifyAtk":{"mode":"replace","condition":{"overlay":"rejuvenation:psychic_terrain"},"actions":[],"source":"Battle_Move.rb:1517"}},"plus":{"onModifySpA":{"mode":"replace","condition":{"overlay":"rejuvenation:electric_terrain"},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1495-1499"}},"minus":{"onModifySpA":{"mode":"replace","condition":{"overlay":"rejuvenation:electric_terrain"},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1495-1499"}},"marvelscale":{"onModifyDef":{"mode":"replace","condition":{"always":true},"actions":[{"op":"multiply","value":1.5}],"source":"Battle_Move.rb:1724"}},"tempest":{"onEnd":{"mode":"replace","condition":{"always":true},"actions":[{"op":"reconcileWeather"}],"source":"Battler.rb:3515-3516"}},"comatose":{"onStart":{"mode":"replace","condition":{"always":true},"actions":[{"op":"abilityMessage"},{"op":"message","text":"{1} is drowsing!"}],"source":"Battler.rb:3013-3017 (hard Electric field alone disables Comatose)"}},"slowstart":{"onStart":{"mode":"replace","condition":{"always":true},"actions":[{"op":"volatile","id":"slowstart","silent":true,"message":"{1} is slow to get going!"}],"source":"Battler.rb:3288-3289 (clock retained even on Deep Earth)"}}}`. Inactive abilities: `null`. Status type bypass: `null`.

Field form typing: `["arceus","silvally"]`. Custom volatile rules: `null`. Rampage policy: `null`.

Progression: `null`. Party roles: `null`.

Field clock policy: `null`.

Fields persist for the battle unless transformed/destroyed. Move/ability terrain creation uses its own finite duration; engine stack restoration and overlay clocks are described in ARCHITECTURE.md.

## Core move rules

| Move ID | Executable properties and exact source text |
|---|---|
| `mysticalfire` | {"multiplier":1.5,"message":"The mist's energy strengthened the attack!"} |
| `magicalleaf` | {"multiplier":1.5,"message":"The mist's energy strengthened the attack!"} |
| `doomdesire` | {"multiplier":1.5} |
| `doomdummy` | {"multiplier":1.5,"message":"The mist's energy strengthened the attack!"} |
| `icywind` | {"multiplier":1.5,"message":"The mist's energy strengthened the attack!"} |
| `mistball` | {"multiplier":1.5,"message":"The mist's energy strengthened the attack!"} |
| `aurasphere` | {"multiplier":1.5,"message":"The mist's energy strengthened the attack!"} |
| `steameruption` | {"multiplier":1.5,"message":"The mist's energy strengthened the attack!"} |
| `silverwind` | {"multiplier":1.5,"message":"The mist's energy strengthened the attack!"} |
| `moongeistbeam` | {"multiplier":1.5,"message":"The mist's energy strengthened the attack!"} |
| `smog` | {"multiplier":1.5,"message":"The mist's energy strengthened the attack!","counter":{"index":1,"amount":1,"maximum":2,"message":"Poison spread through the mist!"},"transition":{"field":"rejuvenation:corrosive_mist","condition":{"counter":{"index":1,"op":">","value":1}},"push":true,"message":"The mist was corroded!"}} |
| `clearsmog` | {"multiplier":1.5,"message":"The mist's energy strengthened the attack!","counter":{"index":1,"amount":1,"maximum":2,"message":"Poison spread through the mist!"},"transition":{"field":"rejuvenation:corrosive_mist","condition":{"counter":{"index":1,"op":">","value":1}},"push":true,"message":"The mist was corroded!"}} |
| `strangesteam` | {"multiplier":1.5,"message":"The mist's energy strengthened the attack!"} |
| `springtidestorm` | {"multiplier":1.5,"message":"The mist's energy strengthened the attack!"} |
| `hydrosteam` | {"multiplier":1.5,"message":"The mist's energy strengthened the attack!"} |
| `darkpulse` | {"multiplier":0.5,"message":"The mist softened the attack..."} |
| `shadowball` | {"multiplier":0.5,"message":"The mist softened the attack..."} |
| `nightdaze` | {"multiplier":0.5,"message":"The mist softened the attack..."} |
| `selfdestruct` | {"multiplier":0,"message":"The damp mist prevented the explosion..."} |
| `explosion` | {"multiplier":0,"message":"The damp mist prevented the explosion..."} |
| `mindblown` | {"multiplier":0,"message":"The damp mist prevented the explosion..."} |
| `sweetkiss` | {"accuracy":100} |
| `poisongas` | {"counter":{"index":1,"amount":1,"maximum":2,"message":"Poison spread through the mist!"},"transition":{"field":"rejuvenation:corrosive_mist","condition":{"counter":{"index":1,"op":">","value":1}},"push":true,"message":"The mist was corroded!"}} |
| `corrosivegas` | {"counter":{"index":1,"amount":1,"maximum":2,"message":"Poison spread through the mist!"},"transition":{"field":"rejuvenation:corrosive_mist","condition":{"counter":{"index":1,"op":">","value":1}},"push":true,"message":null}} |
| `aciddownpour` | {"counter":{"index":1,"amount":2,"maximum":2,"message":null},"transition":{"field":"rejuvenation:corrosive_mist","condition":{"counter":{"index":1,"op":">","value":1}},"push":true,"message":"The mist was corroded!"}} |
| `whirlwind` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The mist was blown away!"}} |
| `gust` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The mist was blown away!"}} |
| `razorwind` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The mist was blown away!"}} |
| `defog` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The mist was blown away!"}} |
| `hurricane` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The mist was blown away!"}} |
| `twister` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The mist was blown away!"}} |
| `tailwind` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The mist was blown away!"}} |
| `supersonicskystrike` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The mist was blown away!"}} |
| `bleakwindstorm` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The mist was blown away!"}} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Fairy"} | {"condition":{"always":true},"multiplier":1.5,"message":"The Misty Terrain strengthened the attack!"} |
| {"moveType":"Dragon"} | {"condition":{"always":true},"multiplier":0.5,"message":"The Misty Terrain weakened the attack!"} |

## Overlay definition

```json
{
  "moves": {
    "mysticalfire": {
      "multiplier": 1.5,
      "message": "The mist's energy strengthened the attack!"
    },
    "magicalleaf": {
      "multiplier": 1.5,
      "message": "The mist's energy strengthened the attack!"
    },
    "doomdesire": {
      "multiplier": 1.5
    },
    "doomdummy": {
      "multiplier": 1.5,
      "message": "The mist's energy strengthened the attack!"
    },
    "icywind": {
      "multiplier": 1.5,
      "message": "The mist's energy strengthened the attack!"
    },
    "mistball": {
      "multiplier": 1.5,
      "message": "The mist's energy strengthened the attack!"
    },
    "aurasphere": {
      "multiplier": 1.5,
      "message": "The mist's energy strengthened the attack!"
    },
    "steameruption": {
      "multiplier": 1.5,
      "message": "The mist's energy strengthened the attack!"
    },
    "silverwind": {
      "multiplier": 1.5,
      "message": "The mist's energy strengthened the attack!"
    },
    "moongeistbeam": {
      "multiplier": 1.5,
      "message": "The mist's energy strengthened the attack!"
    },
    "smog": {
      "multiplier": 1.5,
      "message": "The mist's energy strengthened the attack!"
    },
    "clearsmog": {
      "multiplier": 1.5,
      "message": "The mist's energy strengthened the attack!"
    },
    "strangesteam": {
      "multiplier": 1.5,
      "message": "The mist's energy strengthened the attack!"
    },
    "springtidestorm": {
      "multiplier": 1.5,
      "message": "The mist's energy strengthened the attack!"
    },
    "hydrosteam": {
      "multiplier": 1.5,
      "message": "The mist's energy strengthened the attack!"
    }
  },
  "types": [
    {
      "match": {
        "moveType": "Fairy"
      },
      "condition": {
        "always": true
      },
      "multiplier": 1.3,
      "message": "The Misty Terrain strengthened the attack!"
    }
  ]
}
```

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "switchIn" | {"ability":{"who":"user","values":["watercompaction"]}} | [{"op":"boost","stats":{"def":2}}] | "Battler.rb:2231" |
| "setStatus" | {"grounded":{"who":"target","value":true}} | [{"op":"reject"}] | "Battler.rb:mist status immunity" |
| "modifyMove" | {"all":[{"overlay":"rejuvenation:rainbow"},{"not":{"all":[{"ability":{"who":"user","values":["serenegrace"]}},{"canFlinch":true}]}}]} | [{"op":"secondaryChance","multiplier":2}] | "Battle_Move.rb:2328-2329" |
| "specialDefense" | {"type":{"who":"user","value":"Fairy"}} | [{"op":"multiply","value":1.5}] | "Battle_Field.rb:1098" |
| "modifyMove" | {"all":[{"overlay":"rejuvenation:rainbow"},{"moveType":"Normal"},{"category":"Special"}]} | [{"op":"extraType","values":["Normal","Fire","Water","Electric","Grass","Ice","Fighting","Poison","Ground","Flying","Psychic","Bug","Rock","Ghost","Dragon","Dark","Steel","Fairy"],"excludePrimary":true,"layer":"overlay"}] | "Battle_Move.rb:837-838; Battle_Field.rb:117-136" |
| "residual" | {"ability":{"who":"user","values":["dryskin"]}} | [{"op":"heal","fraction":0.0625,"message":"{1} was healed a little by the mist!"}] | "Battle.rb:5850-6109" |
| "tryVolatile" | {"all":[{"status":"confusion"},{"grounded":{"who":"target","value":true}}]} | [{"op":"reject"}] | "Battle_Effects.rb:492" |
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
| "modifyMove" | {"move":"cosmicpower"} | [{"op":"moveProperty","path":"boosts","value":{"def":2,"spd":2}}] | "Battle_MoveEffects.rb:993" |
| "afterMove" | {"move":"wish"} | [{"op":"adjustWish","fraction":0.75}] | "Battle_MoveEffects.rb:5214" |
| "modifyMove" | {"move":"sweetscent"} | [{"op":"moveProperty","path":"boosts","value":{"evasion":-2,"def":-1,"spd":-1}}] | "Battle_MoveEffects.rb:1546-1553" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "modifyMove" | {"move":"stokedsparksurfer"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:electric_terrain","duration":3,"extendedBy":0,"blockEverstone":false,"message":"An electric current ran across the battlefield!"}]}] | "Battle_ZMove.rb:290-301" |
| "modifyMove" | {"move":"genesissupernova"} | [{"op":"moveProperty","path":"secondaries.0.self","value":null},{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:psychic_terrain","duration":5,"extendedBy":0,"blockEverstone":false,"message":"Psychic energy spread across the battlefield!"}]}] | "Battle_ZMove.rb:322-332" |
| "modifyMove" | {"move":"plasmafists"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:electric_terrain","duration":3,"extendedBy":3,"message":"An electric current ran across the battlefield!"}]}] | "Battle_MoveEffects.rb:8306-8320" |
| "modifyMove" | {"all":[{"move":"iondeluge"},{"not":{"pseudoWeather":{"id":"iondeluge","value":true}}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitField","actions":[{"op":"createField","field":"rejuvenation:electric_terrain","duration":3,"extendedBy":3,"message":"An electric current ran across the battlefield!"}]}] | "Battle_MoveEffects.rb:7500-7519" |
| "modifyMove" | {"move":"aromaticmist"} | [{"op":"moveProperty","path":"boosts","value":{"spd":2}}] | "Battle_MoveEffects.rb:7208" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "damage" | {"all":[{"moveType":"Poison"},{"sideAbility":{"who":"target","values":["pastelveil"]}}]} | [{"op":"multiply","value":0.5}] | "Battle_Move.rb:1821" |
| "modifyMove" | {"any":[{"move":"photongeyser"},{"move":"lightthatburnsthesky"}]} | [{"op":"moveBehavior","recipe":"smartCategory","comparison":"offense","contactByCategory":false,"specialMultipliers":[{"condition":{"allyAbility":{"who":"user","values":["battery"]}},"factor":1.3},{"condition":{"all":[{"ability":{"who":"user","values":["flareboost"]}},{"pokemonStatus":"brn"}]},"factor":1.5}],"physicalMultipliers":[],"defenseMultipliers":[],"specialDefenseMultipliers":[]}] | "Battle_Move.rb:359-390" |
| "modifyMove" | {"move":"shellsidearm"} | [{"op":"moveBehavior","recipe":"smartCategory","comparison":"difference","contactByCategory":true,"specialMultipliers":[{"condition":{"allyAbility":{"who":"user","values":["battery"]}},"factor":1.3},{"condition":{"all":[{"ability":{"who":"user","values":["flareboost"]}},{"pokemonStatus":"brn"}]},"factor":1.5}],"physicalMultipliers":[{"condition":{"ability":{"who":"user","values":["toughclaws"]}},"factor":1.3}],"defenseMultipliers":[{"condition":{"all":[{"effectiveAbility":{"who":"target","values":["fluffy"]}},{"not":{"ability":{"who":"user","values":["longreach"]}}}]},"factor":2}],"specialDefenseMultipliers":[{"condition":{"effectiveAbility":{"who":"target","values":["icescales"]}},"factor":2}]}] | "Battle_Move.rb:359-390" |
| "modifyMove" | {"all":[{"move":"terastarstorm"},{"species":{"who":"user","value":"terapagos"}},{"formName":{"who":"user","value":"Stellar"}}]} | [{"op":"moveBehavior","recipe":"smartCategory","comparison":"offense","contactByCategory":false,"specialMultipliers":[{"condition":{"allyAbility":{"who":"user","values":["battery"]}},"factor":1.3},{"condition":{"all":[{"ability":{"who":"user","values":["flareboost"]}},{"pokemonStatus":"brn"}]},"factor":1.5}],"physicalMultipliers":[],"defenseMultipliers":[],"specialDefenseMultipliers":[]}] | "Battle_Move.rb:359-390; Battle_MoveEffects.rb:9817-9838" |
| "attack" | {"all":[{"moveType":"Fire"},{"item":{"who":"target","values":["nevermeltice"]}},{"stateFlag":"neverMeltIce"}]} | [{"op":"multiply","value":0.66},{"op":"moveMessage","text":"The Never-Melt Ice's sheer cold weakened {move}'s power!"}] | "Battle_Move.rb:1570-1573,1939-1944" |
| "specialAttack" | {"all":[{"moveType":"Fire"},{"item":{"who":"target","values":["nevermeltice"]}},{"stateFlag":"neverMeltIce"}]} | [{"op":"multiply","value":0.66},{"op":"moveMessage","text":"The Never-Melt Ice's sheer cold weakened {move}'s power!"}] | "Battle_Move.rb:1570-1573,1939-1944" |
| "modifyMove" | {"all":[{"move":"weatherball"},{"weather":"shadowsky"}]} | [{"op":"moveType","type":"Shadow"},{"op":"moveProperty","path":"basePower","value":100}] | "Battle_MoveEffects.rb:2914,2928" |
| "modifyMoveLate" | {"all":[{"item":{"who":"user","values":["kingsrock","razorfang"]}},{"baseCanFlinch":false},{"any":[{"field":"rejuvenation:rainbow"},{"overlay":"rejuvenation:rainbow"},{"ability":{"who":"user","values":["serenegrace"]}}]}]} | [{"op":"secondaryChance","chance":20,"volatileStatus":"flinch"}] | "Battler.rb:3544-3548" |
| "modifyMoveLate" | {"all":[{"item":{"who":"user","values":["kingsrock","razorfang"]}},{"sheerForce":true}]} | [{"op":"moveProperty","path":"secondaries","value":[]}] | "Battler.rb:3544 (Sheer Force with a secondary effect suppresses item flinch)" |
| "modifyMove" | {"all":[{"move":"expandingforce"},{"any":[{"field":"rejuvenation:psychic_terrain"},{"overlay":"rejuvenation:psychic_terrain"}]}]} | [{"op":"moveProperty","path":"target","value":"allAdjacentFoes"}] | "Battler.rb:4979-4980 (spread regardless of user grounding)" |

## Original status-move highlights

Source UI buff highlights: `["cosmicpower","aromaticmist","sweetscent","wish","aquaring","mistyexplosion"]`.

Source UI nerf highlights: `[]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["aromaticmist","cosmicpower","sweetscent","wish"],"unreviewedHighlightedMoves":["aquaring","mistyexplosion"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Each row shows its recorded semantic decision and the named regression tests that prove it; the disposition, not the listing, is the evidence.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Battle.rb:3670 | [:ELECTERRAIN, :GRASSY, :MISTY, :PSYTERRAIN, :RAINBOW].include?(@battle.field.effect) && @turncount == 0 | unreachable_in_build | A scripted trainer field change remembers a terrain set on the first turn. Tests:  |
| Battle.rb:5872 | @field.effect == :MISTY | implemented_and_tested | Dry Skin heals a sixteenth on Misty Terrain. Tests: field abilities and field damage resolve at the end of the round |
| Battle_Effects.rb:1193 | [:MISTY, :SWAMP, :WATERSURFACE, :UNDERWATER].include?(@battle.FE) | implemented_and_tested | Aqua Ring restores twice as much on Misty Terrain, Swamp, Water Surface and Underwater. Tests: absorbed healing uses the source field multipliers |
| Battle_Field.rb:278 | @field.overlay == :MISTY | implemented_and_tested | Only the Misty overlay is dropped by Corrosive Mist. Tests: overlays are dropped, kept or refused according to the hard field |
| Battle_Field.rb:300 | Overlays && !ignoreOverlays &&<br>       (newfield.include?(@field.overlay) \|\|<br>       (newfield.include?(:MISTY) && @field.effect == :CORROSIVEMIST) \|\|<br>       (newfield.include?(:DARKNESS2) && [:DARKNESS1, :DARKNESS3].include?(@field.effect))) | implemented_and_tested | A terrain equal to the current overlay, or Misty Terrain over Corrosive Mist, fails. Tests: overlays are dropped, kept or refused according to the hard field, terrain cannot restart its current hard field or duplicate overlay |
| Battle_Field.rb:1098 | :MISTY | implemented_and_tested | Misty boosts the actually used special defensive stat by 1.5 for Fairy targets only; the physical defensive path is unchanged. Tests: every compiled field defense branch uses the source type, stat and weather gates, Mega Sol overrides hail for field defense, Deux Finalis defense uses attacker-relative weather |
| Battle_Move.rb:1262 | @battle.FE == :MISTY \|\| @battle.OV == :MISTY | implemented_and_tested | Pixilate-boosted moves get 1.5 on Misty Terrain or under a Misty overlay. Tests: type-changing abilities use the source field multiplier and the baseline elsewhere, Galvanize, Pixilate and Marvel Scale read an overlay as well as the hard field |
| Battle_Move.rb:1724 | opponent.ability == :MARVELSCALE && (!opponent.status.nil? \|\| [:MISTY, :RAINBOW, :FAIRYTALE, :DRAGONSDEN, :STARLIGHT, :DEUXFINALIS].include?(@battle.FE) \|\| @battle.OV == :MISTY) | implemented_and_tested | Marvel Scale is always active on Misty Terrain, Rainbow, Fairy Tale, Dragon's Den, Starlight and Deux Finalis, or under a Misty overlay. Tests: Marvel Scale and Grass Pelt are always active on their source fields, Galvanize, Pixilate and Marvel Scale read an overlay as well as the hard field |
| Battle_Move.rb:1821 | @battle.pbCheckSideAbility(:PASTELVEIL, opponent).any? && type == :POISON && ([:MISTY, :RAINBOW].include?(@battle.FE) \|\| @battle.OV == :MISTY) | implemented_and_tested | Poison-type damage is halved against a side with Pastel Veil on Misty Terrain and Rainbow, or under a Misty overlay. Tests: Pastel Veil, Flower Veil and Tera Shell reduce damage on their source fields |
| Battle_MoveEffects.rb:993 | [:MISTY, :RAINBOW, :HOLY, :STARLIGHT, :NEWWORLD, :PSYTERRAIN].include?(@battle.FE) && @move == :COSMICPOWER | implemented_and_tested | Cosmic Power raises both defenses two stages on its six source fields. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_MoveEffects.rb:1539 | @battle.FE == :MISTY \|\| @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 3, 5) | implemented_and_tested | Sweet Scent can be used on Misty Terrain and from Flower Garden stage 3 while evasion or either defense can fall. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_MoveEffects.rb:1546 | @battle.FE == :MISTY \|\| @battle.ProgressiveFieldCheck(PBFields::FLOWERGARDEN, 3, 5) | implemented_and_tested | Sweet Scent lowers evasion two stages and both defenses by the garden amount. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_MoveEffects.rb:1549 | :MISTY, :FLOWERGARDEN3 | implemented_and_tested | Defenses fall one stage on Misty Terrain and Flower Garden stage 3. Tests: stat-changing moves use the Battle_MoveEffects field amounts |
| Battle_MoveEffects.rb:5214 | [:MISTY, :RAINBOW, :HOLY, :FAIRYTALE, :STARLIGHT].include?(@battle.FE) | implemented_and_tested | Wish restores 75 percent on Misty Terrain, Rainbow, Holy, Fairy Tale and Starlight. Tests: healing moves restore their source field shares |
| Battle_MoveEffects.rb:5442 | @move == :MISTYEXPLOSION && ([:MISTY, :CORROSIVEMIST].include?(@battle.FE) \|\| @battle.OV == :MISTY) && !attacker.isAirborne? | implemented_and_tested | Misty Explosion gains 1.5 for a grounded user on Misty Terrain (native terrain check, hard field or overlay) and on Corrosive Mist. Tests: Corrosive Mist strengthens a grounded Misty Explosion, variable-power moves use their source field values |
| Battle_MoveEffects.rb:7208 | @battle.FE == :MISTY | implemented_and_tested | Misty Terrain Aromatic Mist raises the ally Special Defense two stages. Tests: ally-targeting moves use their field amounts in double battles |
| Battle_Scene.rb:6139 | move.move == :MISTYEXPLOSION && [:MISTY, :CORROSIVEMIST].include?(battle.FE) && attacker.isAirborne? | presentation_only | Fight-menu highlight: decides whether a move button is tinted as field-boosted. Tests:  |
| Battler.rb:1400 | [:MISTY, :RAINBOW, :FAIRYTALE].include?(@battle.FE) | implemented_and_tested | Soul-Heart adds Special Defense alongside Special Attack on Misty/Rainbow/Fairy Tale, and Attack alongside Special Attack on Deux Finalis; no double native Special Attack boost. Tests: Soul-Heart gains the source defensive or offensive second stat |
| Battler.rb:2232 | [:MISTY, :CORROSIVEMIST].include?(@battle.FE) | implemented_and_tested | Water Compaction gains two Defense stages on Misty Terrain and Corrosive Mist. Tests: every source field-entry stat ability changes exactly its listed stages |
| Battler.rb:2653 | @battle.OV == :MISTY | implemented_and_tested | Under a Misty overlay Water Compaction gains two Defense stages. Tests: overlay entry ability boosts apply to current and newly entering battlers |
| Battler.rb:2850 | self.ability == :MISTYSURGE && @battle.FE != :MISTY && @battle.OV != :MISTY && (!Overlays \|\| @battle.FE != :CORROSIVEMIST) | implemented_and_tested | Misty Surge does nothing on Corrosive Mist. Tests: surge abilities respect the source terrain restrictions |
| Battler.rb:4184 | :MISTY, :RAINBOW, :STARLIGHT | implemented_and_tested | Misty/Rainbow/Starlight Seed creates a two-turn Wish only in an empty slot, using floor((maxHP+1)*.75). Tests: source seed special effects retain Wish rounding, statuses, guards, type and field state |
| Battler.rb:7300 | self.ability == :MARVELSCALE && (!self.status.nil? \|\| [:MISTY, :RAINBOW, :FAIRYTALE, :DRAGONSDEN, :STARLIGHT, :DEUXFINALIS].include?(@battle.FE)) | implemented_and_tested | Marvel Scale is always active on the specified six fields and also retains status activation. Tests: Marvel Scale and Grass Pelt are always active on their source fields |

AI source leads: 16. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":["doomdummy"],"abilities":[],"items":[]}`.
