# Future trainer integration

No Gym, Elite Four, League, Champion, trainer, NPC, progression, quest or trainer-team files were changed. Existing RCT/Run & Bun battles do not automatically opt into fields. The mod provides a battle selection API for a later integration project.

The intended future trainer configuration value is:

```text
field = "rejuvenation:forest"
```

This is **not currently a recognized RCT configuration key**. A later adapter must parse it and call the API on the battle's pre-start event, before `GraalShowdownService.startBattle` runs. Do not add it to existing trainer files expecting the current mod to parse RCT definitions.

```java
FieldApi.select(battle.getBattleId(), FieldApi.Priority.TRAINER,
                "rejuvenation:forest");
```

Use `EXPLICIT` for a caller-specified battle override and `ARENA` for a location/arena adapter. IDs are validated against the loaded catalog. Explicit `rejuvenation:indoor` enables an intentional no-field start. Priority is EXPLICIT > TRAINER > ARENA > wild environment > Indoor. Subscribe before the LOWEST-priority environment capture/start boundary. Clear selections if battle creation is abandoned before its cancellation/end event; `FieldApi.clear` is available.

`FieldApi.current(UUID)` returns a defensive copy of the ordered simulator state snapshot. It is useful for displaying/debugging the current field but is not a Java damage calculator and does not expose a field-aware AI evaluator. Do not call Graal directly from an AI/server thread; Cobblemon confines that context to its simulator worker.

## Run & Bun coexistence

The installed extension's metadata reports rbrctai 0.15.0-beta (its filename says 0.16.0-beta), using RCT API 0.15.2-beta/RCT Mod 0.18.1-beta. Its `RunBunAI` and `RBMoveContext` use independent Java decision and damage/speed calculations. Those calculations do not automatically observe the custom Showdown pseudo-weather hooks. No established extension hook that receives the complete new field rule context was found during the API inspection.

Existing trainer battles keep their existing behavior. A future explicit-field adapter must also address AI scoring for field power/accuracy, changed types, priority, status behavior, survival, delayed transitions, Seeds, weather and residuals. Reading only the field ID or multiplying one damage estimate would be insufficient. No unrelated Run & Bun changes are included here. The current build does not claim field-aware Run & Bun trainer decisions.

Optional rule modes can also be configured before the battle starts:

```java
FieldApi.configure(battle.getBattleId(), new FieldApi.RuleOptions(1, false));
```

Mode 1 selects Rejuvenation Casual scaling; modes 0 and 2 retain standard scaling unless `fieldFrenzy` is true. Mode 1 plus Field Frenzy leaves the original multipliers unchanged, following the Ruby branch order. Pending options are consumed once and cleared on cancellation/end/server shutdown. They do not opt an existing trainer battle into fields on their own.
