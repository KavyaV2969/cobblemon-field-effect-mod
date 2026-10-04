# Remaining and future work

## Status (2026-10-04)

All 57 Rejuvenation 14.0.14 field definitions ship, and the implementation audit is closed for every field. [FIELD_COVERAGE.md](FIELD_COVERAGE.md) records each field's status, evidence and exceptions.

Two things support that claim:

- **AST leads:** every one of the 1,736 nested AST leads has an explicit decision in `research/semantic-reviews.json`, and zero runtime leads are pending. The 973 runtime leads break down as 905 implemented and tested, 27 presentation-only, 11 custom-move exclusions, 11 Crest exclusions, 10 unreachable in this build, and 9 proven unsupported. A further 763 leads are Battle AI.
- **Blind-spot scan:** the AST audit cannot see `when` clauses inside `case true`. `research/blindspot_scan.py` lists those references, and `research/audit-worklist.md` triages every one.
- **Definitions:** the compiled-definition comparison covers 4,494 properties with zero differences.

Scope exclusions are unchanged: custom Rejuvenation moves, Crests, and unavailable custom Silvally models (their ordinary type semantics are kept). Trainer, Gym, Elite Four, League and story files are untouched. Custom-move and Crest exclusions are recorded individually and never close the surrounding ordinary behavior.

## Deliberate deviations

- **Salt Cure on Holy Field and Deux Finalis** deals 1/6 per turn (1/3 to Water/Steel). The shipped Champions build deals 1/8 (1/4). This port uses the source's pre-Champions Holy divisor by project decision. Off these fields, Cobblemon's native 1/8 (1/4) applies.

## Future work

1. **More live coverage.** `--battle`, `--abilities` and `--extended` pass on the current jar; the extended suite covers stat-boost messages, the ability registry across a data reload, timed strong winds, electrified Spikes, Holy Revival Blessing and Genesis Supernova terrain. Further live checks are worthwhile for any new Java mixin or chat path.
2. **Two-client multiplayer and disconnect verification.** This has never been run. Simulator doubles and single-client checks don't replace it.
3. **Run & Bun AI adapter.** The 763 Battle AI leads are deferred to it, and it isn't started. See [TRAINER_INTEGRATION.md](TRAINER_INTEGRATION.md).
4. **Forms absent from the pack.** Coal Furnace, World of Nightmares, Mega Sol and 26 other abilities belong to such forms and are recorded unsupported/unreachable. Revisit only if those forms are added.
5. **Outside-battle mechanics,** recorded unsupported: post-battle Ball Fetch Snowballs on Snowy Mountain, Honey Gather on Forest, and Pay Day/Make It Rain/Gimmighoul Coin prize money. Revisit only if Cobblemon gains matching items or a payout hook.
6. **Broader oracle coverage.** The executed Ruby oracle covers only `fieldDefenseBoost` and `calculateFieldMultiplier`; other methods rely on named simulator tests.
7. **Maintenance.** After any change to the source copy or rules, rerun the pipeline: `build.ps1`, plus `review_registry.py` and `blindspot_scan.py`. Triage new blind-spot references in `audit-worklist.md`.

## Recently completed

- Kanto league trainers battle on engine-scored fields (`research/trainer_fields.py`, `TrainerFieldBridge`); re-run the scorer when the RCT datapack or field rules change. Johto/Hoenn/Sinnoh leagues can be added the same way.

- Battle.rb, Battler.rb, Battle_Move.rb, Battle_MoveEffects.rb, Battle_Effects.rb, Battle_Field.rb and the smaller files are fully reviewed.
- The blind-spot scan was triaged:
  - Ion Deluge, Plasma Fists, Stoked Sparksurfer and Genesis Supernova terrain creation is implemented.
  - Terrain moves no longer fail for an Everstone holder; the source checks Everstone only for Mist, Ion Deluge, Plasma Fists and Conversion/Conversion 2.
- The definition comparison was extended to Mimicry, Burmy cloak, seeds, status highlights and field-change targets.
- The one-off `research/update_*_schema.py` scripts were removed; their edits are already in the three validators.
- Six live checks were added as `live_check.py --extended` (fixture phases 10-15) and pass on the current jar.
