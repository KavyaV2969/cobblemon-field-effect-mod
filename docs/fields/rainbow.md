# Rainbow Field

Original ID: `RAINBOW`; datapack ID: `rejuvenation:rainbow`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "What does it mean?"

Nature Power: `aurorabeam`. Secret Power animation/reference move: `aurorabeam`.

Secret Power actual secondary choices: `[{"status":"par"},{"status":"psn"},{"status":"brn"},{"status":"frz"},{"status":"slp"}]`.

Mimicry type: `Dragon`; Burmy cloak reference: `PLANTCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"magicalseed","effect":null,"duration":0,"message":null,"stats":{"spa":1}}`. Seed actions: `[{"op":"wish","fraction":0.75,"message":"A wish was made for {1}!"}]`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":5,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":5,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":5,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":5,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":true,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `null` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The terrain returned to normal."`.

Shared stat pools: `null`. Absorber policies: `null`. Indirect immunity: `null`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"soulheart":{"onAnyFaint":{"mode":"replace","condition":{"always":true},"actions":[{"op":"boost","stats":{"spa":1,"spd":1}}],"source":"Battler.rb:1400"}},"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":5,"extendedBy":3,"blockEverstone":false}],"source":"Battler.rb:3926"}}}`. Inactive abilities: `null`. Status type bypass: `null`.

Field form typing: `["arceus","silvally"]`. Custom volatile rules: `null`. Rampage policy: `null`.

Progression: `null`. Party roles: `null`.

Field clock policy: `null`.

Fields persist for the battle unless transformed/destroyed. Move/ability terrain creation uses its own finite duration; engine stack restoration and overlay clocks are described in ARCHITECTURE.md.

## Core move rules

| Move ID | Executable properties and exact source text |
|---|---|
| `silverwind` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `mysticalfire` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `dragonpulse` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `triattack` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `sacredfire` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `firepledge` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `waterpledge` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `grasspledge` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `aurorabeam` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `mirrorbeam` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `judgment` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `relicsong` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `hiddenpower` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `secretpower` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `weatherball` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `mistball` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `heartstamp` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `moonblast` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `zenheadbutt` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `sparklingaria` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `fleurcannon` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `prismaticlaser` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `twinkletackle` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `oceanicoperetta` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `solarbeam` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `solarblade` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `dazzlinggleam` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `luminacrash` | {"multiplier":1.5,"message":"The attack was rainbow-charged!"} |
| `darkpulse` | {"multiplier":0.5,"message":"The rainbow softened the attack..."} |
| `shadowball` | {"multiplier":0.5,"message":"The rainbow softened the attack..."} |
| `nightdaze` | {"multiplier":0.5,"message":"The rainbow softened the attack..."} |
| `neverendingnightmare` | {"multiplier":0.5,"message":"The rainbow softened the attack..."} |
| `lightthatburnsthesky` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The rainbow was consumed!"}} |
| `sandsearstorm` | {"transition":{"field":"rejuvenation:indoor","condition":{"always":true},"push":false,"message":"The sandstorm blocked out the rainbow!"}} |

## Core type and move-tag rules

| Condition | Properties |
|---|---|
| {"moveType":"Normal"} | {"condition":{"category":"Special"},"multiplier":1.5,"message":"The rainbow energized the attack!"} |

## Overlay definition

```json
{
  "moves": {
    "silverwind": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "mysticalfire": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "dragonpulse": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "triattack": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "sacredfire": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "firepledge": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "waterpledge": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "grasspledge": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "aurorabeam": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "mirrorbeam": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "judgment": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "relicsong": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "hiddenpower": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "secretpower": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "weatherball": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "mistball": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "heartstamp": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "moonblast": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "zenheadbutt": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "sparklingaria": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "fleurcannon": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "prismaticlaser": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "twinkletackle": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "oceanicoperetta": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "solarbeam": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "solarblade": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "dazzlinggleam": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    },
    "luminacrash": {
      "multiplier": 1.5,
      "message": "The attack was rainbow-charged!"
    }
  },
  "types": [
    {
      "match": {
        "moveType": "Normal"
      },
      "condition": {
        "category": "Special"
      },
      "multiplier": 1.3,
      "message": "The rainbow energized the attack!"
    }
  ]
}
```

## Additional executable rules

| Event | Condition | Actions | Local provenance |
|---|---|---|---|
| "accuracy" | {"all":[{"ability":{"who":"target","values":["wonderskin"]}},{"category":"Status"}]} | [{"op":"set","value":0}] | "Battle_Move.rb:895" |
| "modifyMove" | {"always":true} | [{"op":"secondaryChance","multiplier":2}] | "Battle_Move.rb:2331" |
| "defense" | {"ability":{"who":"user","values":["prismarmor"]}} | [{"op":"multiply","value":1.33}] | "Battle_Field.rb:1094-1128" |
| "specialDefense" | {"ability":{"who":"user","values":["prismarmor"]}} | [{"op":"multiply","value":1.33}] | "Battle_Field.rb:1094-1128" |
| "modifyMove" | {"all":[{"moveType":"Normal"},{"category":"Special"}]} | [{"op":"extraType","values":["Normal","Fire","Water","Electric","Grass","Ice","Fighting","Poison","Ground","Flying","Psychic","Bug","Rock","Ghost","Dragon","Dark","Steel","Fairy"],"excludePrimary":true}] | "Battle_Move.rb:795" |
| "fieldResidual" | {"weather":["sandstorm","hail","snow"]} | [{"op":"destroyField","message":"The weather blocked out the rainbow!"}] | "Battle.rb:5420" |
| "residual" | {"ability":{"who":"user","values":["cloudnine"]}} | [{"op":"randomBoost","stats":["atk","def","spa","spd","spe","accuracy","evasion"],"amount":1}] | "Battle.rb:5950" |
| "modifyMove" | {"move":"auroraveil"} | [{"op":"moveProperty","path":"sideCondition","value":"auroraveil","removeCallback":"onTry"}] | "Battle_MoveEffects.rb:7724" |
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
| "chargeMove" | {"move":"solarbeam"} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4472" |
| "chargeMove" | {"move":"solarblade"} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4472" |
| "chargeMove" | {"all":[{"move":"razorwind"},{"overlay":"rejuvenation:grassy_terrain"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4430" |
| "chargeMove" | {"all":[{"any":[{"move":"solarbeam"},{"move":"solarblade"}]},{"overlay":"rejuvenation:rainbow"}]} | [{"op":"reject"}] | "Battle_MoveEffects.rb:4472" |
| "modifyMove" | {"move":"weatherball"} | [{"op":"moveProperty","path":"basePower","value":100}] | "Battle_MoveEffects.rb:2914" |
| "modifyMove" | {"all":[{"move":"mist"},{"not":{"sideCondition":"mist"}}]} | [{"op":"moveBehavior","recipe":"appendHitActions","callback":"onHitSide","actions":[{"op":"createField","field":"rejuvenation:misty_terrain","duration":3,"extendedBy":3,"message":"Mist swirled around the battlefield!"}]}] | "Battle_MoveEffects.rb:1817" |
| "modifyMove" | {"move":"meditate"} | [{"op":"moveProperty","path":"boosts","value":{"atk":3}}] | "Battle_MoveEffects.rb:755" |
| "modifyMove" | {"move":"cosmicpower"} | [{"op":"moveProperty","path":"boosts","value":{"def":2,"spd":2}}] | "Battle_MoveEffects.rb:993" |
| "afterMove" | {"move":"wish"} | [{"op":"adjustWish","fraction":0.75}] | "Battle_MoveEffects.rb:5214" |
| "modifyMove" | {"move":"bloomdoom"} | [{"op":"moveBehavior","recipe":"appendHitActions","actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":3,"extendedBy":0,"blockEverstone":false}]}] | "Battle_ZMove.rb:269" |
| "modifyMove" | {"move":"lifedew"} | [{"op":"moveBehavior","recipe":"targetHealing","fraction":0.25,"userFraction":0.5,"actions":[]}] | "Battle_MoveEffects.rb:8674" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |

## Original status-move highlights

Source UI buff highlights: `["cosmicpower","meditate","wish","lifedew","auroraveil","sonicboom"]`.

Source UI nerf highlights: `[]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["auroraveil","cosmicpower","meditate"],"unreviewedHighlightedMoves":["lifedew","sonicboom","wish"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Battle.rb:464 | canChangeFE? && !(@field.effect == :RAINBOW && @field.duration <= 0) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:466 | @field.effect == :RAINBOW | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:3670 | [:ELECTERRAIN, :GRASSY, :MISTY, :PSYTERRAIN, :RAINBOW].include?(@battle.field.effect) && @turncount == 0 | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:5417 | @field.effect == :RAINBOW | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:5422 | @field.effect == :RAINBOW | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:5946 | @field.effect == :RAINBOW | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6542 | i.effects[:Nightmare] && !magicGuardAbilities.include?(i.ability) && @field.effect != :RAINBOW | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:6578 | @field.effect == :RAINBOW && i.canHeal? | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle.rb:7128 | i.ability == :BADDREAMS && @battle.FE != :RAINBOW | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Field.rb:1103 | :RAINBOW, :CRYSTALCAVERN | implemented_and_tested | Rainbow and Crystal Cavern grant Prism Armor 1.33 on either defensive stat path. Tests: every compiled field defense branch uses the source type, stat and weather gates, Mega Sol overrides hail for field defense, Deux Finalis defense uses attacker-relative weather |
| Battle_Move.rb:797 | :RAINBOW | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:837 | @battle.OV == :RAINBOW && type == :NORMAL && pbIsSpecial?(attacker, type) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:895 | opponent.ability == :WONDERSKIN && @battle.FE == :RAINBOW | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1724 | opponent.ability == :MARVELSCALE && (!opponent.status.nil? \|\| [:MISTY, :RAINBOW, :FAIRYTALE, :DRAGONSDEN, :STARLIGHT, :DEUXFINALIS].include?(@battle.FE) \|\| @battle.OV == :MISTY) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1821 | @battle.pbCheckSideAbility(:PASTELVEIL, opponent).any? && type == :POISON && ([:MISTY, :RAINBOW].include?(@battle.FE) \|\| @battle.OV == :MISTY) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:2328 | user.ability == :SERENEGRACE \|\| @battle.FE == :RAINBOW \|\| @battle.OV == :RAINBOW | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:2329 | !self.canFlinch? && user.ability == :SERENEGRACE && (@battle.FE == :RAINBOW \|\| @battle.OV == :RAINBOW) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:755 | [:RAINBOW, :ASHENBEACH].include?(@battle.FE) && @move == :MEDITATE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:993 | [:MISTY, :RAINBOW, :HOLY, :STARLIGHT, :NEWWORLD, :PSYTERRAIN].include?(@battle.FE) && @move == :COSMICPOWER | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2398 | @battle.FE == :RAINBOW | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:2914 | @battle.FE == :RAINBOW \|\| [:SANDSTORM, :HAIL, :SNOW].include?(weather) \|\| ([:SUNNYDAY, :RAINDANCE].include?(weather) && !attacker.hasWorkingItem(:UTILITYUMBRELLA)) \|\| (weather == :STRONGWINDS && @battle.FE == :SKY) \|\| (weather == :SHADOWSKY && Rejuv) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:3536 | (@battle.FE == :RAINBOW && rnd != 5) \|\| (@battle.FE == :WASTELAND && rnd < 4) \|\| (@battle.FE == :CRYSTALCAVERN && rnd > 1) \|\| (@battle.FE == :BEWITCHED && (rnd < 2 \|\| rnd == 4)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:4472 | @battle.FE == :RAINBOW \|\| @battle.OV == :RAINBOW | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:5214 | [:MISTY, :RAINBOW, :HOLY, :FAIRYTALE, :STARLIGHT].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7724 | [:DARKCRYSTALCAVERN, :RAINBOW, :ICY, :CRYSTALCAVERN, :SNOWYMOUNTAIN, :MIRROR, :STARLIGHT, :FROZENDIMENSION].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:8674 | @battle.FE == :HOLY \|\| (@battle.FE == :RAINBOW && opponent == attacker) | implemented_and_tested | Holy Life Dew heals both allies by rounded half maximum HP; Rainbow doubles only the user. Native per-target canHeal eligibility precedes effect execution. Tests: Holy Life Dew doubles healing for both actual allied targets, Rainbow Life Dew doubles the user healing only |
| Battler.rb:1400 | [:MISTY, :RAINBOW, :FAIRYTALE].include?(@battle.FE) | implemented_and_tested | Soul-Heart adds Special Defense alongside Special Attack on Misty/Rainbow/Fairy Tale, and Attack alongside Special Attack on Deux Finalis; no double native Special Attack boost. Tests: Soul-Heart gains the source defensive or offensive second stat |
| Battler.rb:3545 | (@battle.FE == :RAINBOW \|\| @battle.OV == :RAINBOW \|\| user.ability == :SERENEGRACE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:4184 | :MISTY, :RAINBOW, :STARLIGHT | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7300 | self.ability == :MARVELSCALE && (!self.status.nil? \|\| [:MISTY, :RAINBOW, :FAIRYTALE, :DRAGONSDEN, :STARLIGHT, :DEUXFINALIS].include?(@battle.FE)) | requires_behavioral_comparison | Semantic comparison pending Tests:  |

AI source leads: 25. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":["mirrorbeam"],"abilities":["gravitycontrol"],"items":[]}`.
