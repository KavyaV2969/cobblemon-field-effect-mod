# Remaining QA and extensions

The ordinary field runtime and all 762 AI source leads have evidence-backed dispositions, with zero ordinary applicable strategy pending. The offline build runs:

- simulator strategy and preview differentials, and the Ruby oracles;
- Graal, parser/registry and mixin ABI checks;
- packet codec checks and isolated client/server checks;
- the decision benchmark and integration-fixture packaging.

See [INTEGRATIONS.md](INTEGRATIONS.md).

Open items, none blocking the ordinary integration:

1. **Doubles decision latency.** A worst-case doubles lead offering every gimmick variant still takes seconds per decision in the interpreter-only runtime ([INTEGRATIONS.md](INTEGRATIONS.md#decision-performance)). Further reductions would need a cheaper branching model, without weakening the reviewed strategy.
2. **Live multiplayer QA.** Full two-client PvP/spectator reconnect, disconnect ordering and rendered HUD and tooltip checks, including the new effectiveness label hook in a real client. Isolated fixtures certify state, serialization, layout and bytecode ABI; they do not replace a live render.
3. **Live mechanic sampling.** Historical live receipts are fingerprinted to older jars, and this continuation required zero Minecraft launches.
4. **Unavailable content.** Custom Rejuvenation moves, Crests, unavailable form models and post-battle rewards; see [LIMITATIONS.md](LIMITATIONS.md). Revisit only when equivalent installed content exists.
5. **Separate features.** A field details screen, and league extensions beyond the mapped Kanto trainers.
6. **Stronger AI.** Full minimax or opponent-belief modelling would be an optional enhancement over the bounded strategy.

Reproduce everything with `build.ps1` (see [BUILDING.md](BUILDING.md)). Pass `-AffinityMask` to take latency receipts on performance cores.
