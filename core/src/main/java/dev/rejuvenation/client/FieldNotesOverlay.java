package dev.rejuvenation.client;

import java.util.*;

/**
 * The input and lifecycle controller of the Field Notes overlay, with no Minecraft dependency (the world is reached through {@link Env}),
 * so every rule below is tested offline.
 *
 * <p>Rules: a click on the HUD field panel opens the overlay (and, while open, closes it); clicks inside the overlay are consumed
 * (close button, scrollbar, text) and clicks anywhere else pass through untouched, so the battle UI stays usable behind it. Escape and
 * the scroll keys are consumed only while the overlay is open. The overlay follows the visible field: when the field changes (a
 * transformation, a restoration) it stays open on the new field's notes from the top. It closes when the battle's state ends, when a
 * different battle is shown, and when the screen that hosts it goes away. It only reads the client's copy of the server state, so server
 * clocks keep running whether it is open or not.
 */
final class FieldNotesOverlay {
    interface Env {
        int screenWidth();
        int screenHeight();
        int textWidth(String text);
        int lineHeight();
        Optional<ClientFieldState.State> state();
        Optional<ClientFieldState.NotesDoc> notes(String field);
        /** Bounds of the HUD field panel when it is drawn, else null. */
        FieldPanelRenderer.Layout panel();
        /** Bottom edge of the battle log, used to anchor the overlay, or -1. */
        int anchorBottom();
    }
    /** What the renderer draws: a snapshot taken once per frame. */
    record View(FieldNotesModel.Layout layout, ClientFieldState.State state, List<FieldNotesModel.Row> rows, int scroll, int total, int[] thumb, boolean hoverClose) {}

    static final int KEY_ESCAPE = 256, KEY_UP = 265, KEY_DOWN = 264, KEY_PAGE_UP = 266, KEY_PAGE_DOWN = 267, KEY_HOME = 268, KEY_END = 269;
    private static final int LEFT = 0, WHEEL_LINES = 3;

    private boolean open, dragging;
    private int scroll, grab;
    private UUID battle;
    private String field;
    // Wrapped rows are cached per (state, documents, width) and rebuilt only when one changes.
    private ClientFieldState.State rowsState;
    private Optional<ClientFieldState.NotesDoc> rowsNotes, rowsOverlayNotes;
    private int rowsWidth = -1;
    private List<FieldNotesModel.Row> rows = List.of();

    boolean isOpen() { return open; }
    int scroll() { return scroll; }

    void close() { open = false; dragging = false; scroll = 0; }

    /** Reconciles with the client's battle state; called before every event and frame. */
    private Optional<ClientFieldState.State> sync(Env env) {
        var state = env.state();
        UUID current = state.map(ClientFieldState.State::battle).orElse(null);
        if (state.isEmpty() || !Objects.equals(current, battle)) close();
        battle = current;
        if (state.isPresent()) {
            String next = state.get().field();
            if (!next.equals(field)) { scroll = 0; dragging = false; }
            field = next;
        } else field = null;
        return state;
    }

    private FieldNotesModel.Layout layout(Env env) {
        var panel = env.panel();
        return FieldNotesModel.layout(env.screenWidth(), env.screenHeight(), panel == null ? -1 : panel.x() + panel.width(), panel == null ? -1 : env.anchorBottom());
    }

    private List<FieldNotesModel.Row> rows(Env env, ClientFieldState.State state, FieldNotesModel.Layout layout) {
        var notes = env.notes(state.field());
        var overlayNotes = state.overlay() == null ? Optional.<ClientFieldState.NotesDoc>empty() : env.notes(state.overlay());
        if (!state.equals(rowsState) || !notes.equals(rowsNotes) || !overlayNotes.equals(rowsOverlayNotes) || layout.contentWidth() != rowsWidth) {
            rows = FieldNotesModel.wrap(FieldNotesModel.paragraphs(state, notes, overlayNotes), layout.contentWidth(), env::textWidth);
            rowsState = state; rowsNotes = notes; rowsOverlayNotes = overlayNotes; rowsWidth = layout.contentWidth();
        }
        return rows;
    }

    private int maxScroll(Env env, FieldNotesModel.Layout layout) { return FieldNotesModel.maxScroll(rows, env.lineHeight(), layout.contentHeight()); }

    /** The frame to draw, or null when closed. {@code pointerY}/{@code leftDown} drive scrollbar dragging, polled here because drags are not events. */
    View view(Env env, double pointerX, double pointerY, boolean leftDown) {
        var state = sync(env);
        if (state.isEmpty() || !open) return null;
        var layout = layout(env);
        var rows = rows(env, state.get(), layout);
        int total = FieldNotesModel.contentHeight(rows, env.lineHeight());
        if (dragging) {
            if (!leftDown) dragging = false;
            else scroll = FieldNotesModel.scrollFor(layout, total, pointerY, grab);
        }
        scroll = FieldNotesModel.clamp(scroll, maxScroll(env, layout));
        return new View(layout, state.get(), rows, scroll, total, FieldNotesModel.thumb(layout, total, scroll), layout.inClose(pointerX, pointerY));
    }

    /** @return true when the click belongs to the overlay or the panel (and must not reach anything else). */
    boolean mouseClicked(Env env, double x, double y, int button) {
        var state = sync(env);
        if (state.isEmpty()) return false;
        var panel = env.panel();
        boolean onPanel = panel != null && x >= panel.x() && x < panel.x() + panel.width() && y >= panel.y() && y < panel.y() + panel.height();
        if (!open) {
            if (!onPanel) return false;
            if (button == LEFT) { open = true; scroll = 0; }
            return true;
        }
        var layout = layout(env);
        if (layout.inside(x, y)) {
            if (button != LEFT) return true;
            if (layout.inClose(x, y)) { close(); return true; }
            var rows = rows(env, state.get(), layout);
            int total = FieldNotesModel.contentHeight(rows, env.lineHeight());
            if (layout.inTrack(x, y) && FieldNotesModel.thumb(layout, total, scroll) != null) {
                int[] thumb = FieldNotesModel.thumb(layout, total, scroll);
                grab = y >= thumb[0] && y < thumb[0] + thumb[1] ? (int) (y - thumb[0]) : thumb[1] / 2;
                dragging = true;
                scroll = FieldNotesModel.scrollFor(layout, total, y, grab);
            }
            return true;
        }
        if (onPanel) { if (button == LEFT) close(); return true; }
        return false;
    }

    boolean mouseReleased(Env env, double x, double y, int button) {
        sync(env);
        if (!dragging || button != LEFT) return false;
        dragging = false;
        return true;
    }

    boolean mouseScrolled(Env env, double x, double y, double vertical) {
        var state = sync(env);
        if (!open || state.isEmpty() || vertical == 0) return false;
        var layout = layout(env);
        if (!layout.inside(x, y)) return false;
        rows(env, state.get(), layout);
        scroll = FieldNotesModel.clamp(scroll - (int) Math.signum(vertical) * WHEEL_LINES * env.lineHeight(), maxScroll(env, layout));
        return true;
    }

    /** @return true when the key was used by the overlay (only while it is open). */
    boolean keyPressed(Env env, int key) {
        var state = sync(env);
        if (!open || state.isEmpty()) return false;
        var layout = layout(env);
        rows(env, state.get(), layout);
        int max = maxScroll(env, layout), line = env.lineHeight(), page = Math.max(line, layout.contentHeight() - line);
        switch (key) {
            case KEY_ESCAPE -> close();
            case KEY_UP -> scroll = FieldNotesModel.clamp(scroll - line, max);
            case KEY_DOWN -> scroll = FieldNotesModel.clamp(scroll + line, max);
            case KEY_PAGE_UP -> scroll = FieldNotesModel.clamp(scroll - page, max);
            case KEY_PAGE_DOWN -> scroll = FieldNotesModel.clamp(scroll + page, max);
            case KEY_HOME -> scroll = 0;
            case KEY_END -> scroll = max;
            default -> { return false; }
        }
        return true;
    }

    /** The screen hosting the overlay was removed or replaced. */
    void screenClosed() { close(); }

    /** Whether the HUD panel at these coordinates is a click target now (for the hover cue). */
    boolean overPanel(Env env, double x, double y) {
        var panel = env.panel();
        return !open && sync(env).isPresent() && panel != null && x >= panel.x() && x < panel.x() + panel.width() && y >= panel.y() && y < panel.y() + panel.height();
    }
}
