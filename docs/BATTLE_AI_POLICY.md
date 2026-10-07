# Global trainer battle AI policy

The shared `TrainerBattlePolicy` runs around `BattleAI.choose` inside Cobblemon's `AIBattleActor`. It covers Run & Bun, RCT, and default implementations, including unmapped trainers and battles without a custom field. It applies to NPC-origin Pokemon controlled by an AI actor. Player choices and wild Pokemon keep their existing behavior.

## Permission and precedence

The simulator's sanitized offer is the upper bound. Policy only removes availability. It never enables a spent resource, changes battle format, grants an item, or changes player rules.

| Resource | Trainer authorization | Activation |
|---|---|---|
| Mega | Matching held item/native simulator offer | First legal move while the offer exists; all trainers and species |
| Tera | This member declares a nonblank `gimmicks.tera` | Consequence scoring where available; native decision otherwise |
| Dynamax/Gmax | This member declares `gimmicks.dynamax: true`; Gmax form follows the member's Gmax factor | Consequence scoring where available; native decision otherwise |
| Z | Matching held crystal/native per-move offer | Consequence scoring where available; native decision otherwise |
| Ultra | Native simulator offer | Consequence scoring where available; native decision otherwise |

Missing Tera/Dynamax declarations deny initiation. RCT's live registry supplies declarations, so datapack reloads and team UUIDs remain authoritative. If no declaration can be resolved, Tera/Dynamax stay disabled. Run & Bun's optional `teraTarget`/`dynamaxTarget` restrict the declaring members by species; AI-wide flags cannot authorize undeclared members. Empty target settings preserve per-member permissions. Explicit per-member permissions work with Run & Bun's default AI configuration.

A Mega stone is the Mega declaration supported by the installed RCT API. Its `Gimmicks` record contains Tera, Dynamax and Gmax; the legacy JSON `mega` field does not govern native Mega eligibility. Multiple holders still share the simulator's one-Mega resource: the first eligible active NPC uses it.

## Decision order

1. Filter the simulator request by live trainer declarations and optional AI targets.
2. Remove resources reserved by earlier allied slot choices in this prompt.
3. Run the selected native AI. Run & Bun also retains its native move-family scores and field measurements.
4. Restore the filtered offer after native AI mutations; an AI cannot grant or consume simulator availability speculatively.
5. Compare legal field consequences through the shared evaluator. Mega candidates are mandatory when a legal Mega move exists; other resources are priced against ordinary moves and remaining reserves.
6. Validate the final response against actual gimmick availability and Cobblemon move/target legality. Repair a forbidden gimmick by retaining the legal ordinary move and target where possible; otherwise choose a legal move or switch.
7. Reserve the selected resource for this prompt and log final activation choices. The simulator executes the action and owns subsequent-turn resource consumption.

Forced switches never force Mega. Native bag items, passes, forfeits and shifts are preserved: the consequence evaluator models moves and switches, so those other actions wait until the next legal move for Mega activation. A missing field state, unavailable evaluator or evaluation error retains a validated native choice, with a legal Mega upgrade when offered. A native AI exception falls back to legal actions. Already active Dynamax retains mandatory Max Moves and cached mapping; it cannot start a second Dynamax. Removing initiation clears stale Max Move mapping and rebuilds permitted Z mapping.

Only one gimmick is attached to an action. Mega and Tera can both be used by different members, in either order, when offered by the installed simulator. The policy does not impose the standard RCT AI's extra actor-wide Mega/Tera exclusion on shared field scoring.

Reservations use weak request identity keys and PNX slot values. They end with the prompt, release a slot's previous selection when rechoosing, and avoid retaining battles. The simulator remains authoritative across turns; no permanent policy-side resource ledger can accidentally carry into another battle.

## Verification

`gimmickPolicyTest` exercises real Cobblemon request classes: member/target permissions, stale Max mapping, enabled resources, active Dynamax, spent resources, native mutations, allied reservations and mandatory Mega candidates. `MixinAbiVerification` checks the exact shared AI invocation descriptor and all optional adapter hooks against installed jars. Graal fixtures run the production Java scoring policy on actual field simulations. `surge-mega.cjs` verifies installed ZA Mega Eelektross data and Mega/Tera execution in both orders. These are offline checks; a client restart is needed to load the installed mod, followed by an in-game battle for live confirmation.
