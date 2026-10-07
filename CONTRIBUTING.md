# Contributing

Thanks for helping. A few rules keep the project reliable.

* **Edit sources, not output.** Field definitions, notes, mappings, item models and `lang` are generated: change the canonical inputs (`research/custom-fields/*.json` for the four custom fields, `research/*.py` generators for the originals) and run `python research/generate.py`. `datapack/`, `docs/fields/` and the files marked *generated* are overwritten. See [docs/BUILDING.md](docs/BUILDING.md).
* **Behaviour needs a test.** Add a named check to the simulator suites in `verification/src/test/js` (fixed seeds, explicit state assertions) and, for engine code, a Graal counterpart in `graal-regression.js`. Never delete, weaken or skip a failing test to get a green run; report unexecuted checks as unexecuted.
* **Keep the three validators in step.** A new engine event, operator or condition must be added to the engine (`core/src/main/resources/rejuvenation-engine.js`), `CatalogValidator.java` and `research/validate.py` together, with rejection tests for malformed use. The engine file is LF.
* **Preserve stable IDs.** Do not rename a field, item, status, packet or resource ID, or change a shipped field's numbers, without a migration note and a changelog entry. The 57 original fields keep their source-audited behaviour; custom-field corrections cite the specification line they fix and carry a regression test.
* **The core must not name third-party mods.** Integrations belong in `compat/`, gated on the mod's presence; `./gradlew :verification:installationMatrix` checks the separation.
* **Mapping rows go in the pack of the mod that provides them** (`research/provider_map.py`), and the base alone must stay free of third-party IDs (`python research/validate.py --packs base`).
* **Offline first, honestly.** State what was verified and how; do not claim live or multiplayer verification that was not run. Do not commit game files, third-party jars, world saves, logs, credentials or local paths; use the environment variables described in the build docs.
* Run `./gradlew check` (and `python research/package.py`) before opening a pull request, and keep each change small and reviewable; do not mix a mechanical file move with a behaviour change.

Questions about the Pokémon Rejuvenation artwork or about permissions go to the game's authors, not to this project (see [THIRD_PARTY.md](THIRD_PARTY.md)).
