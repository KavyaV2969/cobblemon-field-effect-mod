# Trainer integration

The original COBBLEVERSE trainer datapack is preserved. Lt. Surge's custom team is authored in `datapack/cobbleverse/data/rctmod/trainers/kanto_ltsurge.json` and shipped in the COBBLEVERSE extension pack (`rejuvenation-fields-cobbleverse-<version>.zip`), alongside his gym structure override; the extension must load after the original COBBLEVERSE packs so that its copies of those two files win (see [MIGRATION.md](MIGRATION.md)).

## Kanto league fields (implemented)

The 13 Kanto series trainers (eight Gym Leaders, the Elite Four and Champion Blue) start their battles on fields assigned by `datapack/data/rejuvenation/rejuvenation/trainers/kanto.json`. `TrainerFieldBridge` reads the original-trainer tag Radical Cobblemon Trainers stamps on each NPC team Pokemon (`<registry>#<trainer id>`, `TrainerNPC.initTeam`) on Cobblemon's battle pre-start event and selects the mapped field at TRAINER priority. The field mapping bridge itself does not depend on RCT (the global battle policy uses a separate optional RCT adapter); any datapack file under `rejuvenation/trainers/` can map further trainer IDs, and all three validators check it. [KANTO_LEAGUE_FIELDS.md](KANTO_LEAGUE_FIELDS.md) lists the assignments and how they were computed. Other RCT battles remain unchanged unless mapped.

## Selection API

A per-trainer configuration value read by a future adapter could look like:

```text
field = "rejuvenation:forest"
```

This is **not currently a recognized RCT configuration key**. A later adapter must parse it and call the API on the battle's pre-start event, before `GraalShowdownService.startBattle` runs. Do not add it to existing trainer files expecting the current mod to parse RCT definitions.

```java
FieldApi.select(battle.getBattleId(), FieldApi.Priority.TRAINER,
                "rejuvenation:forest");
```

Use `EXPLICIT` for a caller-specified battle override and `ARENA` for a location/arena adapter. IDs are validated against the loaded catalog. Explicit `rejuvenation:indoor` enables an intentional no-field start. Priority is EXPLICIT > TRAINER > ARENA > wild environment > Indoor. Subscribe before the LOWEST-priority environment capture/start boundary. Clear selections if battle creation is abandoned before its cancellation/end event; `FieldApi.clear` is available.

`FieldApi.current(UUID)` returns a defensive copy of the ordered simulator state snapshot for display and diagnostics. For field-aware estimates use `FieldEvaluator` on the server thread, where Cobblemon drives the simulator context; do not access Graal directly from another thread.

## Run & Bun AI

The installed extension (`mods/rbrctai-fabric-1.21.1-0.16.0-beta.jar`; metadata 0.15.0-beta; RCT API 0.15.2-beta, RCT Mod 0.18.1-beta) decides with its own Java model (`RunBunAI`, `PokeMathMax`). In battles with a field, this mod corrects that model's damage, immunity and speed estimates with the field engine's read-only measurements of the same attacker, move and defender, through optional adapter mixins; the external jar itself is untouched. Details, coverage of the Rejuvenation `Battle_AI.rb` branches and limitations: [INTEGRATIONS.md](INTEGRATIONS.md).

The global [trainer battle policy](BATTLE_AI_POLICY.md) now runs at Cobblemon's shared AI actor boundary, covering Run & Bun, RCT and default AI implementations. Per-Pokemon declarations authorize Tera and Dynamax; Run & Bun's target settings narrow that permission. Missing declarations disable those resources. Mega, Ultra and Z require the actual simulator offer and appropriate held item. No request filter grants a resource the simulator did not offer.

All NPC Mega users activate on their first legal move, regardless of trainer, species, field or evaluator availability. Field consequence scoring applies to all trainer AI implementations, with Run & Bun retaining its native move-family scores. The final response is checked for both gimmick availability and move/target legality; native mutations cannot grant permissions. Reservations prevent two allied slots from choosing the same resource in one prompt. Spent resources remain governed by the simulator on subsequent turns. Players and wild Pokemon bypass the trainer policy.

Surge therefore follows the same rules as every other trainer: all six members disable Dynamax/Gmax, Magnezone alone declares Flying Tera, and Eelektross's Eelektrossite supplies Mega availability. The former hardcoded trainer/species exception has been removed. `gimmickPolicyTest` checks real Cobblemon request objects; the installed-simulator `src/test/js/surge-mega.cjs` regression verifies the actual Eelektross form, stats and ability, resource restoration during scoring, single-use enforcement, and Mega/Tera in both orders.

`FieldApi.current(UUID)` still returns the ordered state snapshot. For field-aware estimates use `FieldEvaluator.evaluate(battle, queries, purpose)` on the server thread; never call Graal from another thread.

Optional rule modes can also be configured before the battle starts:

```java
FieldApi.configure(battle.getBattleId(), new FieldApi.RuleOptions(1, false));
```

Mode 1 selects Rejuvenation Casual scaling; modes 0 and 2 retain standard scaling unless `fieldFrenzy` is true. Mode 1 plus Field Frenzy leaves the original multipliers unchanged, following the Ruby branch order. Pending options are consumed once and cleared on cancellation/end/server shutdown. They do not opt an existing trainer battle into fields on their own.
