package dev.rejuvenation.client;

import com.google.gson.*;
import java.nio.file.*;
import java.util.*;

/**
 * Field Notes client fixtures: the shipped notes of every field through the real model (content, wrapping, scrolling, layout at every GUI
 * scale and window size), the overlay's input and lifecycle rules, and the client store's notes handling. No window, renderer, server or
 * Minecraft launch: the overlay is driven through its {@link FieldNotesOverlay.Env}.
 */
public final class NotesVerification {
    private static int checks;
    private static void check(boolean value, String text) { if (!value) throw new AssertionError(text); checks++; }
    private static final UUID B = UUID.fromString("00000000-0000-0000-0000-0000000000a0"), B2 = UUID.fromString("00000000-0000-0000-0000-0000000000a1");

    /** A scripted client: window size, 6-pixel glyphs, 10-pixel lines, the HUD panel where Cobblemon would put it. */
    private static final class Fake implements FieldNotesOverlay.Env {
        int w = 640, h = 360;
        Optional<ClientFieldState.State> state = Optional.empty();
        final Map<String, ClientFieldState.NotesDoc> notes = new HashMap<>();
        FieldPanelRenderer.Layout panel = new FieldPanelRenderer.Layout(w - 170, 5, 100, 70, w - 164, 11, 90, 50);
        @Override public int screenWidth() { return w; }
        @Override public int screenHeight() { return h; }
        @Override public int textWidth(String t) { return t.length() * 6; }
        @Override public int lineHeight() { return 10; }
        @Override public Optional<ClientFieldState.State> state() { return state; }
        @Override public Optional<ClientFieldState.NotesDoc> notes(String f) { return Optional.ofNullable(notes.get(f)); }
        @Override public FieldPanelRenderer.Layout panel() { return panel; }
        @Override public int anchorBottom() { return h - 30; }
        double panelX() { return panel.x() + 5; }
        double panelY() { return panel.y() + 5; }
        Fake show(UUID battle, String field, String name, Map<String, List<Integer>> counters, int viewer) {
            state = Optional.of(new ClientFieldState.State(battle, field, name, 0, null, null, 0, 1L, null, null, counters, viewer));
            return this;
        }
    }

    private static Path notesDir() {
        for (Path p = Path.of("").toAbsolutePath(); p != null; p = p.getParent()) {
            for (String rel : List.of("datapack/data/rejuvenation/rejuvenation/notes", "rejuvenation/datapack/data/rejuvenation/rejuvenation/notes"))
                if (Files.isDirectory(p.resolve(rel))) return p.resolve(rel);
        }
        throw new IllegalStateException("notes directory not found");
    }

    public static int run() throws Exception {
        checks = 0;
        ClientFieldState.reset();
        var docs = new TreeMap<String, JsonObject>();
        try (var files = Files.list(notesDir())) {
            for (var file : (Iterable<Path>) files.filter(f -> f.toString().endsWith(".json")).sorted()::iterator) {
                var doc = JsonParser.parseString(Files.readString(file)).getAsJsonObject();
                docs.put(doc.get("field").getAsString(), doc);
            }
        }
        check(docs.size() == 61, "Notes for all 61 fields (" + docs.size() + ")");

        // Content: every field's notes read as plain player text, wrap at every width, and scroll to the end.
        var banned = List.of("{", "}", "\"", "schemaVersion", "JSON", "json", ".rb", "TODO", "undefined", "null", "rejuvenation:", "Ruby", "Battle.rb", "§");
        for (var entry : docs.entrySet()) {
            var state = new ClientFieldState.State(B, entry.getKey(), entry.getValue().get("title").getAsString(), 0, null, null, 0, 1L, null, null, Map.of(), 0);
            var note = Optional.of(new ClientFieldState.NotesDoc(entry.getKey(), 1, false, entry.getValue()));
            var paragraphs = FieldNotesModel.paragraphs(state, note, Optional.empty());
            check(paragraphs.size() >= 4 && paragraphs.get(0).style() == FieldNotesModel.Style.SUMMARY, "Notes have a summary and sections: " + entry.getKey());
            for (var p : paragraphs) for (String bad : banned)
                if (p.text().contains(bad)) throw new AssertionError("Developer text '" + bad + "' in notes of " + entry.getKey() + ": " + p.text());
            for (int width : new int[]{24, 60, 120, 200, 258}) {
                var rows = FieldNotesModel.wrap(paragraphs, width, s -> s.length() * 6);
                for (var row : rows) {
                    int limit = Math.max(8, row.style() == FieldNotesModel.Style.BULLET ? width - FieldNotesModel.BULLET_INDENT : width);
                    // A single glyph is the smallest unit; anything wider than the limit was not wrapped.
                    if (row.text().length() * 6 > limit && row.text().length() > 1)
                        throw new AssertionError("Row wider than the box (" + width + ") in " + entry.getKey() + ": " + row.text());
                }
                check(rows.stream().noneMatch(r -> r.style() != FieldNotesModel.Style.SPACER && r.text().isBlank()), "No blank text rows");
            }
        }
        // Layout: inside the window, the content box inside the frame, at every GUI scale and window size, anchored or centred.
        for (int w : List.of(40, 64, 120, 213, 320, 427, 640, 960, 1280, 1920)) for (int h : List.of(30, 80, 120, 180, 240, 360, 540, 1080)) for (int anchor = 0; anchor < 3; anchor++) {
            var l = anchor == 0 ? FieldNotesModel.layout(w, h) : FieldNotesModel.layout(w, h, anchor == 1 ? w - 5 : w / 2, anchor == 1 ? h - 30 : h + 500);
            check(l.x() >= 0 && l.y() >= 0 && l.x() + l.width() <= w && l.y() + l.height() <= h, "Overlay inside the window " + w + "x" + h);
            check(l.contentWidth() >= 1 && l.contentHeight() >= 1 && l.contentX() >= l.x() && l.contentX() + l.contentWidth() <= l.x() + l.width()
                && l.contentY() + l.contentHeight() <= l.y() + l.height(), "Content box inside the frame " + w + "x" + h);
            check(l.closeX() >= l.x() && l.closeX() + l.closeSize() <= l.x() + l.width() && l.closeY() + l.closeSize() <= l.y() + l.height(), "Close button reachable");
        }
        var tall = FieldNotesModel.layout(640, 360); var tiny = FieldNotesModel.layout(64, 80);
        check(tall.bannerHeight() > 0 && tiny.bannerHeight() == 0, "Backdrop banner only when there is room");

        // Counters read from the viewer's side and never show hidden information.
        var pale = Optional.of(new ClientFieldState.NotesDoc("rejuvenation:pale_garden", 1, false, docs.get("rejuvenation:pale_garden")));
        var dark = Optional.of(new ClientFieldState.NotesDoc("rejuvenation:deep_dark", 1, false, docs.get("rejuvenation:deep_dark")));
        var paleState = new ClientFieldState.State(B, "rejuvenation:pale_garden", "Pale Garden", 0, null, null, 0, 1L, null, null, Map.of("distraction", List.of(1, 3)), 1);
        var text = FieldNotesModel.paragraphs(paleState, pale, Optional.empty()).stream().map(FieldNotesModel.Paragraph::text).toList();
        check(text.stream().anyMatch(t -> t.contains("your side: 3 / 3")) && text.stream().anyMatch(t -> t.contains("opposing side: 1 / 3")), "Per-side counter from the viewer's side");
        text = FieldNotesModel.paragraphs(new ClientFieldState.State(B, paleState.field(), "Pale Garden", 0, null, null, 0, 1L, null, null, Map.of("distraction", List.of(1, 3)), -1), pale, Optional.empty())
            .stream().map(FieldNotesModel.Paragraph::text).toList();
        check(text.stream().anyMatch(t -> t.contains("side 1: 1 / 3")) && text.stream().anyMatch(t -> t.contains("side 2: 3 / 3")), "Spectators see both sides");
        text = FieldNotesModel.paragraphs(new ClientFieldState.State(B, "rejuvenation:deep_dark", "Deep Dark", 0, null, null, 0, 1L, null, null, Map.of("warning", List.of(3)), 0), dark, Optional.empty())
            .stream().map(FieldNotesModel.Paragraph::text).toList();
        check(text.stream().anyMatch(t -> t.equals("Sculk Warning: 3 / 4")) && text.stream().anyMatch(t -> t.startsWith("At 3 (reached)")) && text.stream().noneMatch(t -> t.startsWith("At 4 (reached)")), "Shared counter and reached thresholds");
        // Layers and overlay terrain follow the state, and the lifetime of a temporary field is shown.
        var layered = new ClientFieldState.State(B, "rejuvenation:icy", "Icy Field", 3, "rejuvenation:electric_terrain", "Electric Terrain", 2, 1L, "rejuvenation:water_surface", "Water Surface", Map.of(), 0);
        text = FieldNotesModel.paragraphs(layered, Optional.empty(), Optional.empty()).stream().map(FieldNotesModel.Paragraph::text).toList();
        check(text.stream().anyMatch(t -> t.contains("Water Surface")) && text.stream().anyMatch(t -> t.contains("Electric Terrain") && t.contains("2 turns left")) && text.stream().anyMatch(t -> t.contains("3 more turns")), "Substrate, overlay and clock shown");
        check(text.get(0).contains("not arrived"), "Fallback while notes are pending");
        text = FieldNotesModel.paragraphs(layered, Optional.of(new ClientFieldState.NotesDoc("rejuvenation:icy", 1, true, null)), Optional.empty()).stream().map(FieldNotesModel.Paragraph::text).toList();
        check(text.get(0).contains("no notes") && !text.get(0).contains("{"), "Fallback when the server has no notes");
        // Malformed documents do not break the model (it reads only what it understands).
        var broken = new JsonObject(); broken.addProperty("summary", "Only a summary.");
        check(FieldNotesModel.paragraphs(layered, Optional.of(new ClientFieldState.NotesDoc("rejuvenation:icy", 1, false, broken)), Optional.empty()).size() >= 2, "Sparse documents render");

        // Scrolling math.
        var lay = FieldNotesModel.layout(640, 360);
        var longRows = new ArrayList<FieldNotesModel.Row>();
        for (int i = 0; i < 80; i++) longRows.add(new FieldNotesModel.Row(FieldNotesModel.Style.BODY, "row " + i, true, -1, -1));
        int total = FieldNotesModel.contentHeight(longRows, 10), max = FieldNotesModel.maxScroll(longRows, 10, lay.contentHeight());
        check(max == total - lay.contentHeight() && FieldNotesModel.clamp(-5, max) == 0 && FieldNotesModel.clamp(max + 99, max) == max, "Scroll limits");
        int[] top = FieldNotesModel.thumb(lay, total, 0), bottom = FieldNotesModel.thumb(lay, total, max);
        check(top[0] == lay.trackY() && bottom[0] + bottom[1] == lay.trackY() + lay.trackHeight(), "Thumb spans the track");
        check(FieldNotesModel.scrollFor(lay, total, lay.trackY() + lay.trackHeight() + 50, 0) == max && FieldNotesModel.scrollFor(lay, total, lay.trackY() - 50, 0) == 0, "Dragging clamps");
        check(FieldNotesModel.thumb(lay, 5, 0) == null, "No scrollbar when everything fits");

        // Input and lifecycle.
        var env = new Fake().show(B, "rejuvenation:pale_garden", "Pale Garden", Map.of(), 0);
        env.notes.put("rejuvenation:pale_garden", new ClientFieldState.NotesDoc("rejuvenation:pale_garden", 1, false, docs.get("rejuvenation:pale_garden")));
        env.notes.put("rejuvenation:deep_dark", new ClientFieldState.NotesDoc("rejuvenation:deep_dark", 1, false, docs.get("rejuvenation:deep_dark")));
        var overlay = new FieldNotesOverlay();
        check(!overlay.mouseClicked(env, 300, 300, 0) && !overlay.mouseScrolled(env, env.panelX(), env.panelY(), 1) && !overlay.keyPressed(env, FieldNotesOverlay.KEY_ESCAPE), "A closed overlay consumes nothing outside the panel");
        check(overlay.view(env, 0, 0, false) == null, "Nothing to draw while closed");
        check(overlay.mouseClicked(env, env.panelX(), env.panelY(), 1) && !overlay.isOpen(), "Right-click on the panel is consumed but does not open");
        check(overlay.mouseClicked(env, env.panelX(), env.panelY(), 0) && overlay.isOpen(), "Left-click on the panel opens the notes");
        var view = overlay.view(env, 0, 0, false);
        check(view != null && view.layout().x() + view.layout().width() == env.panel.x() + env.panel.width() && view.layout().y() + view.layout().height() == env.h - 30, "Anchored to the panel and the log");
        double inX = view.layout().contentX() + 4, inY = view.layout().contentY() + 4;
        check(overlay.mouseClicked(env, inX, inY, 0) && overlay.isOpen(), "Clicks inside the overlay are consumed and keep it open");
        check(!overlay.mouseClicked(env, 3, 3, 0) && overlay.isOpen(), "Clicks outside pass through");
        check(!overlay.mouseScrolled(env, 3, 3, -1), "Wheel outside passes through");
        check(overlay.mouseScrolled(env, inX, inY, -1) && overlay.scroll() == 30, "Wheel inside scrolls three lines");
        check(overlay.mouseScrolled(env, inX, inY, 1) && overlay.scroll() == 0 && overlay.mouseScrolled(env, inX, inY, 1) && overlay.scroll() == 0, "Wheel clamps at the top");
        check(overlay.keyPressed(env, FieldNotesOverlay.KEY_END) && overlay.scroll() == FieldNotesModel.maxScroll(overlay.view(env, 0, 0, false).rows(), 10, view.layout().contentHeight()) && overlay.scroll() > 0, "End scrolls to the last line");
        check(overlay.keyPressed(env, FieldNotesOverlay.KEY_HOME) && overlay.scroll() == 0 && overlay.keyPressed(env, FieldNotesOverlay.KEY_PAGE_DOWN) && overlay.scroll() > 0, "Home and Page Down");
        check(!overlay.keyPressed(env, 65), "Other keys are not consumed");
        // Scrollbar drag, polled from the pointer position while the button is held.
        var thumb = overlay.view(env, 0, 0, false).thumb();
        double trackX = view.layout().trackX() + 1;
        check(overlay.mouseClicked(env, trackX, thumb[0] + 1, 0), "Scrollbar press consumed");
        int before = overlay.scroll();
        var dragged = overlay.view(env, trackX, view.layout().trackY() + view.layout().trackHeight(), true);
        check(dragged.scroll() >= before && dragged.scroll() == FieldNotesModel.maxScroll(dragged.rows(), 10, view.layout().contentHeight()), "Dragging the thumb scrolls");
        overlay.view(env, trackX, view.layout().trackY(), false);
        check(overlay.view(env, trackX, view.layout().trackY(), true).scroll() == dragged.scroll(), "Releasing the button ends the drag");
        check(!overlay.mouseReleased(env, trackX, 0, 0), "A release outside a drag is not consumed");
        // The field changes (transformation) while open: follows the new field from the top; restoration likewise.
        overlay.keyPressed(env, FieldNotesOverlay.KEY_END);
        env.show(B, "rejuvenation:deep_dark", "Deep Dark", Map.of("warning", List.of(2)), 0);
        view = overlay.view(env, 0, 0, false);
        check(view != null && view.scroll() == 0 && view.state().field().equals("rejuvenation:deep_dark") && overlay.isOpen(), "Follows the field and restarts at the top");
        check(view.rows().stream().anyMatch(r -> r.text().contains("Sculk Warning: 2 / 4")), "Counter updates while open");
        env.show(B, "rejuvenation:deep_dark", "Deep Dark", Map.of("warning", List.of(4)), 0);
        check(overlay.view(env, 0, 0, false).rows().stream().anyMatch(r -> r.text().contains("Sculk Warning: 4 / 4")), "Same-field counter change refreshes the rows");
        // Close controls.
        check(overlay.mouseClicked(env, view.layout().closeX() + 1, view.layout().closeY() + 1, 0) && !overlay.isOpen(), "Close button");
        overlay.mouseClicked(env, env.panelX(), env.panelY(), 0);
        check(overlay.isOpen() && overlay.keyPressed(env, FieldNotesOverlay.KEY_ESCAPE) && !overlay.isOpen(), "Escape closes and is consumed");
        check(!overlay.keyPressed(env, FieldNotesOverlay.KEY_ESCAPE), "Escape passes through when closed");
        overlay.mouseClicked(env, env.panelX(), env.panelY(), 0);
        check(overlay.mouseClicked(env, env.panelX(), env.panelY(), 0) && !overlay.isOpen(), "Clicking an uncovered panel again toggles it closed");
        // A panel the overlay covers is part of the overlay while it is open.
        overlay.mouseClicked(env, env.panelX(), env.panelY(), 0);
        var covered = overlay.view(env, 0, 0, false).layout();
        env.panel = new FieldPanelRenderer.Layout(covered.x() + 10, covered.y() + 10, 100, 70, 0, 0, 90, 50);
        check(overlay.mouseClicked(env, env.panelX(), env.panelY(), 0) && overlay.isOpen(), "A covered panel does not toggle");
        overlay.keyPressed(env, FieldNotesOverlay.KEY_ESCAPE);
        env.panel = new FieldPanelRenderer.Layout(env.w - 170, 5, 100, 70, env.w - 164, 11, 90, 50);
        // Battle end, another battle, screen change, disconnect.
        overlay.mouseClicked(env, env.panelX(), env.panelY(), 0);
        env.state = Optional.empty();
        check(overlay.view(env, 0, 0, false) == null && !overlay.isOpen(), "Closes when the battle state ends");
        env.show(B, "rejuvenation:pale_garden", "Pale Garden", Map.of(), 0);
        check(overlay.view(env, 0, 0, false) == null, "Stays closed when a battle starts");
        overlay.mouseClicked(env, env.panelX(), env.panelY(), 0);
        env.show(B2, "rejuvenation:pale_garden", "Pale Garden", Map.of(), 0);
        check(overlay.view(env, 0, 0, false) == null && !overlay.isOpen(), "Closes when a different battle is shown");
        overlay.mouseClicked(env, env.panelX(), env.panelY(), 0);
        overlay.screenClosed();
        check(!overlay.isOpen() && overlay.view(env, 0, 0, false) == null, "Closes when the hosting screen goes away");
        // Panel absent (minimised, HUD hidden, no room): the overlay cannot be opened.
        env.panel = null;
        check(!overlay.mouseClicked(env, 10, 10, 0) && !overlay.isOpen(), "No panel, no way in");
        // Resizing while open keeps it inside the window.
        env.panel = new FieldPanelRenderer.Layout(env.w - 170, 5, 100, 70, env.w - 164, 11, 90, 50);
        overlay.mouseClicked(env, env.panelX(), env.panelY(), 0);
        for (int[] size : new int[][]{{320, 180}, {200, 120}, {64, 80}, {1920, 1080}}) {
            env.w = size[0]; env.h = size[1]; env.panel = new FieldPanelRenderer.Layout(Math.max(0, env.w - 170), 2, 100, 70, 0, 0, 90, 50);
            var resized = overlay.view(env, 0, 0, false);
            check(resized != null && resized.layout().x() >= 0 && resized.layout().y() >= 0 && resized.layout().x() + resized.layout().width() <= env.w
                && resized.layout().y() + resized.layout().height() <= env.h && resized.scroll() <= Math.max(0, resized.total() - resized.layout().contentHeight()), "Resize keeps the overlay and scroll valid " + size[0] + "x" + size[1]);
        }
        // A long note in a small window scrolls to its end, and its last line is reachable.
        env.w = 200; env.h = 120;
        overlay.view(env, 0, 0, false);
        overlay.keyPressed(env, FieldNotesOverlay.KEY_END);
        var endView = overlay.view(env, 0, 0, false);
        check(endView.total() > endView.layout().contentHeight() && endView.scroll() + endView.layout().contentHeight() >= endView.total(), "Small window: the whole note is reachable");

        // Client store: notes cached by (field, revision) for the battle, stale revisions ignored, cleared with the battle.
        ClientFieldState.reset();
        String start = "{\"battle\":\"" + B + "\",\"field\":\"rejuvenation:icy\",\"name\":\"Icy Field\",\"duration\":0,\"substrate\":\"rejuvenation:water_surface\",\"substrateName\":\"Water Surface\",\"viewer\":1,\"public\":{\"distraction\":[1,2],\"warning\":3,\"junk\":\"x\",\"huge\":[1,2,3,4,5]}}";
        check(ClientFieldState.notes("rejuvenation:icy").isEmpty(), "No notes before any state");
        ClientFieldState.acceptState(start);
        var s = ClientFieldState.received().orElseThrow();
        check("rejuvenation:water_surface".equals(s.substrate()) && "Water Surface".equals(s.substrateName()) && s.viewer() == 1, "Substrate and viewer parsed");
        check(s.counters().get("warning").equals(List.of(3)) && s.counters().get("distraction").equals(List.of(1, 2)) && !s.counters().containsKey("junk") && !s.counters().containsKey("huge"), "Counters parsed and bounded");
        String notesPacket = "{\"battle\":\"" + B + "\",\"field\":\"rejuvenation:icy\",\"revision\":4,\"notes\":" + docs.get("rejuvenation:icy") + "}";
        ClientFieldState.acceptNotes(notesPacket);
        check(ClientFieldState.notes("rejuvenation:icy").map(n -> !n.missing() && n.revision() == 4).orElse(false), "Notes cached");
        ClientFieldState.acceptNotes(notesPacket.replace("\"revision\":4", "\"revision\":3"));
        check(ClientFieldState.notes("rejuvenation:icy").orElseThrow().revision() == 4, "Older revision ignored");
        ClientFieldState.acceptNotes(notesPacket.replace("\"revision\":4", "\"revision\":5"));
        check(ClientFieldState.notes("rejuvenation:icy").orElseThrow().revision() == 5, "Newer revision replaces");
        ClientFieldState.acceptNotes("{\"battle\":\"" + B + "\",\"field\":\"rejuvenation:beach\",\"revision\":5,\"missing\":true}");
        check(ClientFieldState.notes("rejuvenation:beach").map(ClientFieldState.NotesDoc::missing).orElse(false), "A field without notes is remembered as missing");
        boolean rejected = false;
        try { ClientFieldState.acceptNotes("not json"); } catch (RuntimeException expected) { rejected = true; }
        check(rejected, "Malformed notes packets are rejected (the receiver logs and ignores them)");
        ClientFieldState.acceptNotes("{\"battle\":\"" + B2 + "\",\"field\":\"rejuvenation:icy\",\"revision\":9,\"notes\":" + docs.get("rejuvenation:icy") + "}");
        check(ClientFieldState.notes("rejuvenation:icy").isEmpty(), "Another battle's notes are never shown for this one");
        ClientFieldState.acceptState(start.replace(B.toString(), B2.toString()));
        check(ClientFieldState.notes("rejuvenation:icy").map(n -> n.revision() == 9).orElse(false), "Notes follow the battle on screen");
        ClientFieldState.acceptState("{\"battle\":\"" + B2 + "\",\"field\":null}");
        check(ClientFieldState.notes("rejuvenation:icy").isEmpty(), "Battle end clears notes");
        ClientFieldState.acceptNotes("{\"battle\":\"" + B2 + "\",\"field\":\"rejuvenation:icy\",\"revision\":10,\"notes\":" + docs.get("rejuvenation:icy") + "}");
        check(ClientFieldState.notes("rejuvenation:icy").isEmpty(), "Late notes after the battle ended are ignored");
        ClientFieldState.reset();
        check(ClientFieldState.notes("rejuvenation:icy").isEmpty() && ClientFieldState.received().isEmpty(), "Disconnect reset");
        return checks;
    }
}
