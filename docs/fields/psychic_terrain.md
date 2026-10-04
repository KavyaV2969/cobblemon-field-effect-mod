# Psychic Terrain

Original ID: `PSYTERRAIN`; datapack ID: `rejuvenation:psychic_terrain`.

**Verification:** compiled definition comparison passed; full distributed behavior verification pending.

## Initialization

Entry text: "The field became mysterious!"

Nature Power: `psychic`. Secret Power animation/reference move: `psychic`.

Secret Power actual secondary choices: `[{"volatileStatus":"confusion"}]`.

Mimicry type: `Psychic`; Burmy cloak reference: `TRASHCLOAK`. The cloak metadata does not mutate persisted Minecraft Pokémon.

Seed data: `{"item":"magicalseed","effect":null,"duration":0,"message":null,"stats":{"spa":2}}`. Seed actions: `[{"op":"volatile","id":"confusion"}]`.

Absorbed healing configuration: `{"rootFactor":1.2998046875,"agentMultipliers":{},"overlayAgents":[],"moveMultipliers":{},"harmfulAgents":{},"liquidOozeFactor":1,"drainStatLoss":false}`.

Grounding policy: `{"airborneAbilities":["gravitycontrol"],"forceGroundingItems":["ironball"],"source":"Battler.rb:1104-1112"}`. Terrain policy: `null`.

Binding and Octolock: `{"divisors":[8,6,4,3,2],"moveIncrements":{},"statLoss":{},"immuneAbilities":["magicguard"],"source":"Battle.rb:6634-6705; Battle_MoveEffects.rb:4975-5011"}`.

Condition durations: `{"gravity":{"duration":8,"sourceMoves":["gravity"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6820"},"trickroom":{"duration":8,"sourceMoves":["trickroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6959"},"wonderroom":{"duration":8,"sourceMoves":["wonderroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:7029"},"magicroom":{"duration":8,"sourceMoves":["magicroom"],"choices":[{"condition":{"item":{"who":"user","values":["amplifieldrock"]}},"duration":8}],"source":"Battle_MoveEffects.rb:6137"},"magnetrise":{"duration":5,"sourceMoves":["magnetrise"],"choices":[{"condition":{"overlay":"rejuvenation:electric_terrain"},"duration":8}],"source":"Battle_MoveEffects.rb:6847"}}`. Volatile policies: `{"nightmare":{"allowAwake":false,"suppressResidual":false,"fraction":0.25,"message":"{1} is locked in a nightmare!","source":"Battle.rb:6541-6551; Battle_MoveEffects.rb:6568"}}`.

Capture multipliers: `null` (Balls.rb:143,166). Incoming weather conversions: `null`.

Multiplier policy: `{"defaultDifficultyMode":0,"defaultFieldFrenzy":false,"casualMode":1,"casualFactor":0.5,"frenzyBoostFactor":2,"frenzyReductionFactor":0.5,"combinedMinimum":1.5,"source":"Battle_Field.rb:1001-1012; Battle_Move.rb:1355-1363"}`. Restoration text: `"The terrain returned to normal."`.

Shared stat pools: `null`. Absorber policies: `null`. Indirect immunity: `null`.

Persistent statuses: `{"ptr":{"name":"Petrification","immuneTypes":["Rock"],"immuneAbilities":["fairyaura","darkaura","aurabreak","roughskin"],"sideProtectionAbility":"fairyaura","drainAbility":"darkaura","invertAbility":"aurabreak","fraction":0.125,"blocksHealing":true,"blockedHealingAbilities":["regenerator"],"drainMessage":"{1}'s health is sapped by the {2}'s dark aura!","healingFailureMessage":"{1} is prevented from healing, so it can't use {2}!","source":"Battle_Effects.rb:377-410; Battler.rb:880,1137; Battle.rb:1347,6423-6459"}}`. Independent capture environment: `[{"ball":"cobblemon:dive_ball","predicate":"underwater","multiplier":3.5,"source":"Balls.rb:143"},{"ball":"cobblemon:dusk_ball","predicate":"night","multiplier":3.5,"source":"Balls.rb:166; Time.rb:269"}]`.

Ability callback handlers: `{"schooling":{"onStart":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"},"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"wishiwashi"}},{"not":{"transformed":true}}]},"actions":[{"op":"conditional","condition":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]},"actions":[{"op":"form","species":"wishiwashischool","message":"{1} formed a school!"}]},{"op":"conditional","condition":{"not":{"any":[{"always":false},{"all":[{"level":{"who":"user","op":">=","value":20}},{"hp":{"who":"user","op":">","fraction":0.25}}]}]}},"actions":[{"op":"form","species":"wishiwashi","message":"{1} stopped schooling!"}]}],"source":"Battler.rb:1739"}},"zenmode":{"onResidual":{"mode":"replace","condition":{"all":[{"species":{"who":"user","value":"darmanitan"}},{"any":[{"formName":{"who":"user","value":""}},{"formName":{"who":"user","value":"Zen"}}]}]},"actions":[{"op":"form","species":"darmanitanzen","message":"Zen Mode triggered!"}],"source":"Battler.rb:1767"}},"seedsower":{"onDamagingHit":{"mode":"replace","condition":{"always":true},"actions":[{"op":"createField","field":"rejuvenation:grassy_terrain","duration":5,"extendedBy":3,"blockEverstone":false}],"source":"Battler.rb:3926"}}}`. Inactive abilities: `null`. Status type bypass: `null`.

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
| "accuracy" | {"all":[{"ability":{"who":"target","values":["magician"]}},{"category":"Status"}]} | [{"op":"cap","value":50}] | "Battle_Move.rb:894" |
| "tryHit" | {"all":[{"grounded":{"who":"target","value":true}},{"priority":{"op":">","value":0}},{"foe":true}]} | [{"op":"reject"}] | "Battle_Move.rb:psychic priority immunity" |
| "specialAttack" | {"ability":{"who":"user","values":["purepower"]}} | [{"op":"multiply","value":2}] | "Battle_Move.rb:1502" |
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
| "modifyMove" | {"move":"kinesis"} | [{"op":"moveBehavior","recipe":"dualBoost","targetStats":{"accuracy":-2},"userStats":{"atk":2,"spa":2}}] | "Battle_MoveEffects.rb:1492" |
| "formChange" | {"all":[{"ability":{"who":"user","values":["zerotohero"]}},{"species":{"who":"user","value":"palafin"}},{"formName":{"who":"user","value":"Hero"}}]} | [{"op":"setPokemonFlag","id":"hero_pending","value":true}] | "Battler.rb:1929-1940 (native Hero transformation); 3269-3279" |
| "pokemonEntry" | {"pokemonFlag":{"who":"user","id":"hero_pending","value":true}} | [{"op":"setPokemonFlag","id":"hero_pending","value":false}] | "Battler.rb:3269-3279 (consume transformation marker only on first send-out)" |
| "pokemonEntry" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"all":[{"ability":{"who":"user","values":["multitype"]}},{"species":{"who":"user","value":"arceus"}}]},{"not":{"type":{"who":"user","value":"???"}}}]} | [{"op":"itemForm","defaultSpecies":"arceus","defaultType":"Normal","variants":[{"items":["fistplate","fightiniumz"],"species":"arceusfighting","type":"Fighting"},{"items":["skyplate","flyiniumz"],"species":"arceusflying","type":"Flying"},{"items":["toxicplate","poisoniumz"],"species":"arceuspoison","type":"Poison"},{"items":["earthplate","groundiumz"],"species":"arceusground","type":"Ground"},{"items":["stoneplate","rockiumz"],"species":"arceusrock","type":"Rock"},{"items":["insectplate","buginiumz"],"species":"arceusbug","type":"Bug"},{"items":["spookyplate","ghostiumz"],"species":"arceusghost","type":"Ghost"},{"items":["ironplate","steeliumz"],"species":"arceussteel","type":"Steel"},{"items":["flameplate","firiumz"],"species":"arceusfire","type":"Fire"},{"items":["splashplate","wateriumz"],"species":"arceuswater","type":"Water"},{"items":["meadowplate","grassiumz"],"species":"arceusgrass","type":"Grass"},{"items":["zapplate","electriumz"],"species":"arceuselectric","type":"Electric"},{"items":["mindplate","psychiumz"],"species":"arceuspsychic","type":"Psychic"},{"items":["icicleplate","iciumz"],"species":"arceusice","type":"Ice"},{"items":["dracoplate","dragoniumz"],"species":"arceusdragon","type":"Dragon"},{"items":["dreadplate","darkiniumz"],"species":"arceusdark","type":"Dark"},{"items":["pixieplate","fairiumz"],"species":"arceusfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "residual" | {"all":[{"ability":{"who":"user","values":["rkssystem"]}},{"species":{"who":"user","value":"silvally"}}]} | [{"op":"itemForm","defaultSpecies":"silvally","defaultType":"Normal","variants":[{"items":["fightingmemory"],"species":"silvallyfighting","type":"Fighting"},{"items":["flyingmemory"],"species":"silvallyflying","type":"Flying"},{"items":["poisonmemory"],"species":"silvallypoison","type":"Poison"},{"items":["groundmemory"],"species":"silvallyground","type":"Ground"},{"items":["rockmemory"],"species":"silvallyrock","type":"Rock"},{"items":["bugmemory"],"species":"silvallybug","type":"Bug"},{"items":["ghostmemory"],"species":"silvallyghost","type":"Ghost"},{"items":["steelmemory"],"species":"silvallysteel","type":"Steel"},{"items":["firememory"],"species":"silvallyfire","type":"Fire"},{"items":["watermemory"],"species":"silvallywater","type":"Water"},{"items":["grassmemory"],"species":"silvallygrass","type":"Grass"},{"items":["electricmemory"],"species":"silvallyelectric","type":"Electric"},{"items":["psychicmemory"],"species":"silvallypsychic","type":"Psychic"},{"items":["icememory"],"species":"silvallyice","type":"Ice"},{"items":["dragonmemory"],"species":"silvallydragon","type":"Dragon"},{"items":["darkmemory"],"species":"silvallydark","type":"Dark"},{"items":["fairymemory"],"species":"silvallyfairy","type":"Fairy"}],"message":"{1} reverted to the {type} type!"}] | "Battler.rb:1842-1880; 2746 (ordinary ability clauses; Crest/Pulse exceptions excluded)" |
| "pokemonEntry" | {"all":[{"ability":{"who":"user","values":["zenmode"]}},{"species":{"who":"user","value":"darmanitan"}},{"formName":{"who":"user","value":""}}]} | [{"op":"form","species":"darmanitanzen","message":"Zen Mode triggered!"}] | "Battler.rb:1767-1782; 2746" |
| "residual" | {"all":[{"ability":{"who":"user","values":["zenmode"]}},{"species":{"who":"user","value":"darmanitan"}},{"formName":{"who":"user","value":""}}]} | [{"op":"form","species":"darmanitanzen","message":"Zen Mode triggered!"}] | "Battler.rb:1767-1782; 2746" |

## Original status-move highlights

Source UI buff highlights: `["calmmind","cosmicpower","kinesis","meditate","nastyplot","hypnosis","psychup","mindreader","miracleeye","telekinesis","gravity","magicroom","trickroom","wonderroom","mysticalpower","expandingforce"]`.

Source UI nerf highlights: `[]`. These lists are annotations, not executable mechanics.

Behavior review metadata: `{"explicitRuleMoves":["calmmind","cosmicpower","kinesis","meditate","mindreader","miracleeye","mysticalpower","nastyplot","psychup","telekinesis"],"unreviewedHighlightedMoves":["expandingforce","gravity","hypnosis","magicroom","trickroom","wonderroom"]}`. The executable rule table above is authoritative; this summary groups reviewed highlight entries.

## Distributed-source review leads

These references include nested/shared/conditional branches. Some already have related executable rules above; others still need semantic comparison. Listing a reference does not certify implementation.

| Source location | Field condition | Review disposition | Decision and evidence |
|---|---|---|---|
| Battle.rb:3670 | [:ELECTERRAIN, :GRASSY, :MISTY, :PSYTERRAIN, :RAINBOW].include?(@battle.field.effect) && @turncount == 0 | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Effects.rb:1452 | @battle.FE == :PSYTERRAIN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Inspect.rb:11 | [:HAUNTED, :BEWITCHED, :HOLY, :PSYTERRAIN, :DEEPEARTH].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:894 | pbIsStatus? && (opponent.ability == :WONDERSKIN \|\| (Rejuv && @battle.FE == :PSYTERRAIN && opponent.ability == :MAGICIAN)) && !opponent.moldbroken | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1494 | attacker.ability == :PUREPOWER && (@battle.FE == :PSYTERRAIN \|\| @battle.OV == :PSYTERRAIN) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1517 | attacker.ability == :PUREPOWER && !(@battle.FE == :PSYTERRAIN \|\| @battle.OV == :PSYTERRAIN) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1581 | [:HAUNTED, :BEWITCHED, :HOLY, :PSYTERRAIN, :DEEPEARTH, :DEUXFINALIS].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Move.rb:1694 | opponent.ability == :PUREPOWER && (@battle.FE == :PSYTERRAIN \|\| @battle.OV == :PSYTERRAIN) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:744 | @battle.FE == :PSYTERRAIN && @move == :MEDITATE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:756 | @battle.FE == :PSYTERRAIN && @move == :MEDITATE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:784 | @battle.FE == :PSYTERRAIN && @move == :PSYSHIELDBASH | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:823 | @move == :ESPERWING && @battle.FE == :PSYTERRAIN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:845 | @battle.FE == :PSYTERRAIN && @move == :MYSTICALPOWER | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:993 | [:MISTY, :RAINBOW, :HOLY, :STARLIGHT, :NEWWORLD, :PSYTERRAIN].include?(@battle.FE) && @move == :COSMICPOWER | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1024 | [:CHESS, :ASHENBEACH, :PSYTERRAIN].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1131 | [:CHESS, :PSYTERRAIN, :INFERNAL, :BACKALLEY].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1440 | @move == :CONFIDE && @battle.FE == :PSYTERRAIN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1492 | @battle.FE == :PSYTERRAIN && @move == :KINESIS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1504 | [:ASHENBEACH, :PSYTERRAIN].include?(@battle.FE) && @move == :KINESIS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1508 | stats == PBStats::ACCURACY && !(@battle.FE == :PSYTERRAIN && @move == :KINESIS) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1510 | @battle.FE == :PSYTERRAIN && @move == :KINESIS | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:1802 | @battle.FE == :PSYTERRAIN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:3641 | @battle.FE == :PSYTERRAIN && @move == :MINDREADER | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:3682 | [:HOLY, :FAIRYTALE, :PSYTERRAIN].include?(@battle.FE) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6137 | [:NEWWORLD, :PSYTERRAIN].include?(@battle.FE) \|\| attacker.hasWorkingItem(:AMPLIFIELDROCK) \|\| (Rejuv && @battle.FE == :STARLIGHT) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6820 | attacker.hasWorkingItem(:AMPLIFIELDROCK) \|\| @battle.FE == :PSYTERRAIN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6873 | @battle.FE == :PSYTERRAIN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:6959 | [:CHESS, :NEWWORLD, :PSYTERRAIN].include?(@battle.FE) \|\| attacker.hasWorkingItem(:AMPLIFIELDROCK) \|\| (Rejuv && @battle.FE == :STARLIGHT) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:7029 | [:NEWWORLD, :PSYTERRAIN].include?(@battle.FE) \|\| attacker.hasWorkingItem(:AMPLIFIELDROCK) \|\| (Rejuv && @battle.FE == :STARLIGHT) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_MoveEffects.rb:9108 | (@battle.FE == :PSYTERRAIN \|\| @battle.OV == :PSYTERRAIN) && !attacker.isAirborne? | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_Scene.rb:6140 | move.move == :EXPANDINGFORCE && battle.FE == :PSYTERRAIN && attacker.isAirborne? | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battle_ZMove.rb:281 | @battle.FE == :PSYTERRAIN | implemented_and_tested | Psychic Terrain Shattered Psyche inflicts confusion when eligible, preserves its native state/start event with silent generic text, then emits the exact weird-field message. Tests: Shattered Psyche confusion retains the source weird-field message and silent native update |
| Battler.rb:1770 | self.hp <= zenHP \|\| (unovaZenFields.include?(@battle.FE) && self.form < 2) \|\| (galarZenFields.include?(@battle.FE) && self.form > 1) | implemented_and_tested | Zen Mode uses <= floor(maxHP/2), or full-HP force on Unovan Ashen Beach/Psychic Terrain forms only. Galarian forms retain native HP behavior on these fields. Ordinary ability gates and entry/end-round timing are preserved; the enclosing Crest clause is excluded separately. Tests: Ashen Beach and Psychic Terrain force ordinary Zen Mode at full HP and restore outside, source forced Zen fields leave Galarian forms and suppressed Zen Mode unchanged, field form checks run on entry before the first move |
| Battler.rb:2215 | @battle.FE == :PSYTERRAIN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2644 | @battle.OV == :PSYTERRAIN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2858 | self.ability == :PSYCHICSURGE && @battle.FE != :PSYTERRAIN && @battle.OV != :PSYTERRAIN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:2926 | self.hasWorkingItem(:AMPLIFIELDROCK) \|\| @battle.FE == :PSYTERRAIN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:4242 | :PSYTERRAIN | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:4979 | (@battle.FE == :PSYTERRAIN \|\| @battle.OV == :PSYTERRAIN) && move.move == :EXPANDINGFORCE | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:5255 | (@battle.FE == :PSYTERRAIN \|\| @battle.OV == :PSYTERRAIN) && movetoblock.priorityCheck(self) > 0 | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7280 | self.ability == :PUREPOWER && !(@battle.FE == :PSYTERRAIN \|\| @battle.OV == :PSYTERRAIN) | requires_behavioral_comparison | Semantic comparison pending Tests:  |
| Battler.rb:7337 | self.ability == :PUREPOWER && (@battle.FE == :PSYTERRAIN \|\| @battle.OV == :PSYTERRAIN) | requires_behavioral_comparison | Semantic comparison pending Tests:  |

AI source leads: 27. See `research/field-coverage-ledger.json` for every AI and runtime location.

Unavailable IDs in current generated data: `{"moves":[],"abilities":["gravitycontrol"],"items":[]}`.
