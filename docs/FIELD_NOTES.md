# Field Notes

Click the field panel above the battle log to open **Field Notes**: a framed overlay with the field's backdrop, its player-facing rules and, where they exist, the public counters of the battle. Escape or the close button closes it.

```text
┌───────────────────────────────┐
│ Deep Dark Field            [x]│
│ ┌───────────────────────────┐ │
│ │  backdrop (cropped strip) │ │
│ └───────────────────────────┘ │
│ The sculk of the Deep Dark …  │▒
│ Right now                     │▒
│ ▓▓▓▓▓▓░░ Sculk Warning: 3 / 4 │
│ At 3 (reached): Darkness …    │
│ Type power …                  │
└───────────────────────────────┘
```

## Content

Every one of the 61 fields has a notes document: `datapack/data/rejuvenation/rejuvenation/notes/<field>.json`, generated from the same field definitions the simulator runs (`research/field_notes.py`, called by `generate.py`) so the text cannot drift from the rules: type multipliers, move effects, typing, transformations and restoration, abilities, seeds, residual effects and, for the custom fields, their hand-written mechanics. It is plain player language: no JSON, rule or operation names, source file names, namespaced IDs or developer text (`validate.py` and the Java and client tests reject such text). Rule shapes that cannot be put in a sentence faithfully are left out of the prose rather than approximated, and every document ends with the line that rarer interactions follow the Rejuvenation field rules and are not all listed.

A document is: `schemaVersion`, `field`, `title`, `summary` (the field's entry text), `sections` (heading plus lines), optional `overlay` lines (shown when the field is an overlay terrain), optional `counters` (public counters the field has: `warning` for Deep Dark, `distraction` for Pale Garden; label, `shared` or `perSide` scope, maximum, thresholds with the effect of each level) and optional `substrateText` for fields that appear over a substrate.

**Editable by datapack.** Another datapack may ship `data/<ns>/rejuvenation/notes/<field>.json` for any field and replaces the shipped text (a duplicate within one namespace is an error). Notes are validated with the catalog on load: closed key set, bounded sizes (14 sections, 40 lines per section, 80-character titles, 60-character headings and labels, 400-character summaries, 240-character threshold texts, 960-character body lines, 16,000 bytes per document), plain text only (no control characters, no `§` formatting codes), counters limited to the two public ones, and the document must name the field whose file it is. Invalid notes reject the whole reload with a named reason, so a broken pack cannot corrupt the screen.

## Where the numbers come from

The overlay shows what the server tells it, never what the client works out. The counters are public battlefield state (the Warning, each side's Distraction), carried with the field state; no team, moveset, item, ability or HP information is sent. Per-side counters are shown from the viewer's side (`your side`, `opposing side`); spectators see both sides. A Warning or Distraction level that the notes explain is shown as a bar with the thresholds underneath, and reached thresholds are marked.

## Synchronisation

- The server pushes a field's notes (`rejuvenation:field_notes`, one packet per field, bounded at 32 KiB) together with the field state the first time that field is shown to a recipient, from the battle's own catalog snapshot (the notes of the catalog the battle started with, like its mechanics). The client never asks for anything and sends nothing back.
- Notes are cached on the client by `(field, revision)`: an older revision never replaces a newer one, a notes packet for another battle is never shown for this one, and everything is dropped at battle end or disconnect. A choice request resynchronises state and notes, so reconnecting and late-joining spectators converge.
- Field changes (a transformation, restoration of a substrate, an overlay appearing or ending) arrive as ordinary state updates; the overlay follows the current field without being closed and restarts at the top. Server clocks and counters keep running whether the overlay is open or not; it only reads the client's copy.
- Works with Battle Extras present or absent (it anchors to the log that is actually drawn), for players and spectators, and with the notes missing: the overlay then says that the server has no notes for the field (or that they have not arrived yet) and still shows the field's clocks, overlay terrain and substrate.

## Input and lifecycle

- A left click on the HUD field panel opens the overlay. Clicks inside the overlay (text, scrollbar, close button) are consumed; clicks anywhere else pass through untouched, so the battle UI stays usable behind it. A click on an uncovered panel while open closes it.
- Escape closes the overlay and is consumed only while it is open; Page Up/Down, Up/Down, Home and End scroll it only while open; the mouse wheel scrolls it only over its bounds; the scrollbar thumb can be dragged (polled while the button is held).
- It closes on battle end, when another battle is shown, and when the hosting screen goes away. A small window shrinks the overlay (never larger than the window, content scrolls); long notes scroll to their last line at every GUI scale.
- The overlay is hosted by the screens in which the mouse is free during a battle: Cobblemon's battle screen and the chat screen (so a spectator, who has no battle screen, can open it with the chat key). It is installed per screen through Fabric's screen events; no Cobblemon or Battle Extras class is modified. Any failure disables only the overlay for the session and is logged.

## Look

The frame is the HUD panel's frame (Cobblemon's own battle log texture, so resource packs that restyle it restyle this too), the banner is a centre-cropped strip of the same backdrop, text is Minecraft's default font on the dark inset used for the log. Placement reuses the panel's: the overlay's right edge is the panel's right edge and its bottom edge is the log's bottom edge (so it opens over the log, the panel's own neighbour), clamped inside the window; it is centred when no panel position is known.

## Tests

`NotesVerification` (client, offline): the notes of all 61 fields through the real model (content rules, wrapping at five widths, no developer text), layout at 80 window sizes with and without anchors, counters from each viewer's side, fallbacks, scrolling and drag math, the overlay's complete input and lifecycle rules driven through a scripted client (open, close, Escape, wheel, keys, drag, field change, battle end, another battle, screen change, resize, no panel) and the client store (revisions, other battles, ended battles, malformed packets). `NotesVerification` (server): validation of every document against the catalog, hostile and malformed documents, datapack replacement, packet bounds, and per-battle snapshot revisions. `PacketVerification`: the notes packet codec. The isolated live check clicks the real panel through Minecraft's mouse handler and presses Escape through its keyboard handler, then takes the screenshots listed in [FIELD_PANEL.md](FIELD_PANEL.md).
