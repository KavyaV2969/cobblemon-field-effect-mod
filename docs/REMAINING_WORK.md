# Remaining ordinary implementation review

The continuation excludes only custom Rejuvenation moves and Crests, plus unavailable custom Silvally models while retaining ordinary type semantics. Trainer/Run & Bun integration and broad final multiplayer certification are later tasks. No field is currently declared implementation-complete or fully verified.

The explicit semantic review register currently closes 88 of the current 1,729 nested AST leads: 74 implemented and tested, nine custom-move exclusions, and five Crest exclusions. The other 1,641 leads still require review. These counts include 763 AI leads and overlapping nested branches; they are not unique mechanic counts. The audit now resolves local field-list aliases, including Zen Mode and sound-move boosts. Other indirect/contextual references still require comprehensive review. Generator metadata cannot certify a branch.

New executable work covers Petrification and its status/client/persistence path; independent real-time-night and underwater capture predicates; many distributed move handlers; ordinary ability amplifications/replacements; New World forms and restoration; Holy/Glitch Silvally types; source entry form checks; and native cure-message suppression. Focused tests and exact review decisions are in the test receipts and semantic register. These are implemented and are no longer implementation placeholders.

Implementation review still needs to close:

- Every remaining distributed ordinary move branch, including target/escape/protection/failure checks, hazards, room interactions, sleep-dependent effects, stat transfer and multi-stage handlers. Several recently added recipes still need source-specific compound guards and flavor ordering review.
- Every remaining damage/stat/status/ability branch, including global/partner suppression, absorption/redirection, changed stat callbacks and mixed Crest/ordinary conditions. Only the Crest clause may be excluded.
- Field-state paths through progression, destruction, counters, memory, temporary hard fields and overlays; failed moves, simultaneous clocks, expiry and chained replacements need exact call-site review.
- Exact flavor sequencing for all handlers. Magic Powder, Shattered Psyche, repeated Castling, success-only Recycle feedback and Download pre-boost flavor now have focused ordering tests. Remaining handlers still require their own review.
- Field-dependent money handlers for Pay Day/Make It Rain and related item interactions, including investigating the installed currency API before classifying any incompatibility.
- AI leads that reveal mechanics and each field's cross-handler completeness. Each pending branch needs an explicit semantic decision with regression evidence; no complete field can be inferred from compiled data alone.

The focused live persistent-status and message checks passed two owned battles: Petrification/residuals/Purify and Haunted Magic Powder/silent cure. Their receipt fingerprints the tested jar; later builds are not automatically live-certified. Exhaustive live/multiplayer behavior remains a later task. The bounded Ruby oracle covers only `fieldDefenseBoost` and `calculateFieldMultiplier`, not every caller or field. Custom-move/Crest exclusions are retained individually in the review register and must never close surrounding ordinary behavior.

Recent implementation fixes: exact ordinary Glitch Metronome source pool (265 moves), Punk Rock Big Top/Cave replacement callback, source Parting Shot user-stage gate and unconditional successful-use switch, independent temporary clocks, New World Gravity/Starlight restoration and permanence, Frozen Dimension overlay pause, hard-before-overlay expiry ordering, bound-clock cleanup and shared sequential roll preservation. The mixed Punk Rock/Jungle Beat source lead remains pending until its custom-ability clause is handled.
