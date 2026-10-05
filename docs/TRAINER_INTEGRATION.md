# Trainer integration

No Gym, Elite Four, League, Champion, trainer, NPC, progression, quest or trainer-team files were changed.

## Kanto league fields (implemented)

The 13 Kanto series trainers (eight Gym Leaders, the Elite Four and Champion Blue) start their battles on fields assigned by `datapack/data/rejuvenation/rejuvenation/trainers/kanto.json`. `TrainerFieldBridge` reads the original-trainer tag Radical Cobblemon Trainers stamps on each NPC team Pokemon (`<registry>#<trainer id>`, `TrainerNPC.initTeam`) on Cobblemon's battle pre-start event and selects the mapped field at TRAINER priority. There is no compile or runtime dependency on RCT; any datapack file under `rejuvenation/trainers/` can map further trainer IDs, and all three validators check it. [KANTO_LEAGUE_FIELDS.md](KANTO_LEAGUE_FIELDS.md) lists the assignments and how they were computed. Other RCT battles remain unchanged unless mapped.

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

The installed extension (`mods/rbrctai-fabric-1.21.1-0.16.0-beta.jar`; metadata 0.15.0-beta; RCT API 0.15.2-beta, RCT Mod 0.18.1-beta) decides with its own Java model (`RunBunAI`, `PokeMathMax`). In battles with a field, this mod now corrects that model's damage, immunity and speed estimates with the field engine's read-only measurements of the same attacker, move and defender, through optional adapter mixins; the jar itself is untouched. Battles without a field are unaffected. Details, coverage of the Rejuvenation `Battle_AI.rb` branches and limitations: [INTEGRATIONS.md](INTEGRATIONS.md).

`FieldApi.current(UUID)` still returns the ordered state snapshot. For field-aware estimates use `FieldEvaluator.evaluate(battle, queries, purpose)` on the server thread; never call Graal from another thread.

Optional rule modes can also be configured before the battle starts:

```java
FieldApi.configure(battle.getBattleId(), new FieldApi.RuleOptions(1, false));
```

Mode 1 selects Rejuvenation Casual scaling; modes 0 and 2 retain standard scaling unless `fieldFrenzy` is true. Mode 1 plus Field Frenzy leaves the original multipliers unchanged, following the Ruby branch order. Pending options are consumed once and cleared on cancellation/end/server shutdown. They do not opt an existing trainer battle into fields on their own.
