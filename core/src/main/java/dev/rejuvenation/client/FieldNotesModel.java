package dev.rejuvenation.client;

import com.google.gson.*;
import java.util.*;
import java.util.function.ToIntFunction;

/**
 * Content, wrapping, layout and scrolling of the Field Notes overlay, with no Minecraft dependency so that all of it is tested offline.
 *
 * <p>Content comes only from the server: the battle's notes document for the visible field (and the overlay's), plus the public state of
 * the battle (field, layers, overlay clock, public counters). A missing or malformed document falls back to a plain sentence. Nothing
 * shown here is derived from hidden team information.
 */
final class FieldNotesModel {
    private FieldNotesModel() {}
    enum Style { SUMMARY, HEADING, BODY, BULLET, COUNTER, MUTED, SPACER }
    /** {@code value}/{@code max} describe a counter bar (-1 when the paragraph is not a counter). */
    record Paragraph(Style style, String text, int value, int max) {
        Paragraph(Style style, String text) { this(style, text, -1, -1); }
    }
    record Row(Style style, String text, boolean first, int value, int max) {}
    record Layout(int x, int y, int width, int height, int barY, int barHeight, int bannerY, int bannerHeight, int contentX, int contentY, int contentWidth, int contentHeight,
                  int closeX, int closeY, int closeSize, int trackX, int trackY, int trackWidth, int trackHeight) {
        boolean inside(double px, double py) { return px >= x && px < x + width && py >= y && py < y + height; }
        boolean inClose(double px, double py) { return px >= closeX && px < closeX + closeSize && py >= closeY && py < closeY + closeSize; }
        boolean inTrack(double px, double py) { return px >= trackX - 2 && px < trackX + trackWidth + 2 && py >= trackY && py < trackY + trackHeight; }
    }

    static final int BORDER_LEFT = 5, BORDER_RIGHT = 3, HEADER = 6, FOOTER = 3, BAR = 12, PADDING = 3, BULLET_INDENT = 8, TRACK = 4, BANNER = 34, BANNER_MIN_HEIGHT = 150;
    static final int MAX_WIDTH = 270, MAX_HEIGHT = 230, MIN_COMFORT = 120;

    /**
     * The overlay frame, never larger than the window: a small window gets a compact panel, a tiny one fills what it can. It is anchored
     * to the HUD panel's right edge and the battle log's bottom edge when those are known ({@code anchorRight}/{@code anchorBottom} >= 0),
     * so it opens over the log where the panel is, and is centred otherwise; it is always clamped inside the window.
     */
    static Layout layout(int screenW, int screenH, int anchorRight, int anchorBottom) {
        int margin = Math.max(2, Math.min(10, Math.min(screenW, screenH) / 16));
        int w = Math.min(MAX_WIDTH, screenW - 2 * margin), h = Math.min(MAX_HEIGHT, screenH - 2 * margin);
        w = Math.max(Math.min(w, screenW), Math.min(MIN_COMFORT, screenW));
        h = Math.max(Math.min(h, screenH), Math.min(MIN_COMFORT, screenH));
        w = Math.max(1, Math.min(w, screenW)); h = Math.max(1, Math.min(h, screenH));
        int x = anchorRight >= 0 ? anchorRight - w : (screenW - w) / 2, y = anchorBottom >= 0 ? anchorBottom - h : (screenH - h) / 2;
        x = Math.max(0, Math.min(screenW - w, x)); y = Math.max(0, Math.min(screenH - h, y));
        int innerX = x + BORDER_LEFT + PADDING, innerRight = x + w - BORDER_RIGHT - PADDING;
        int barY = y + HEADER, bannerY = barY + BAR + 1, banner = h >= BANNER_MIN_HEIGHT && w >= 160 ? BANNER : 0;
        int contentY = bannerY + (banner > 0 ? banner + 1 : 0), contentBottom = y + h - FOOTER - PADDING;
        int trackX = innerRight - TRACK;
        int contentW = Math.max(1, trackX - 2 - innerX), contentH = Math.max(1, contentBottom - contentY);
        int close = Math.min(BAR - 3, 9);
        return new Layout(x, y, w, h, barY, BAR, bannerY, banner, innerX, contentY, contentW, contentH, innerRight - close, barY + 1, close, trackX, contentY, TRACK, contentH);
    }
    static Layout layout(int screenW, int screenH) { return layout(screenW, screenH, -1, -1); }

    /** The overlay's title: the field's display name (with its stage for progressive fields). */
    static String title(ClientFieldState.State state) { return state.name(); }

    static List<Paragraph> paragraphs(ClientFieldState.State state, Optional<ClientFieldState.NotesDoc> notes, Optional<ClientFieldState.NotesDoc> overlayNotes) {
        var out = new ArrayList<Paragraph>();
        JsonObject doc = notes.filter(n -> !n.missing()).map(ClientFieldState.NotesDoc::doc).orElse(null);
        if (doc == null) {
            out.add(new Paragraph(Style.SUMMARY, notes.isPresent() ? "This server provided no notes for " + state.name() + ". The field still follows its normal rules."
                : "Notes for " + state.name() + " have not arrived yet."));
        } else {
            String summary = string(doc, "summary");
            if (summary != null) out.add(new Paragraph(Style.SUMMARY, summary));
        }
        var now = new ArrayList<Paragraph>();
        if (state.duration() > 0) now.add(new Paragraph(Style.BODY, "This field lasts " + state.duration() + (state.duration() == 1 ? " more turn." : " more turns.")));
        if (state.overlay() != null) {
            now.add(new Paragraph(Style.BODY, "Overlay terrain: " + state.overlayName() + (state.overlayDuration() > 0 ? " (" + state.overlayDuration() + (state.overlayDuration() == 1 ? " turn left" : " turns left") + ")" : "")
                + ". It adds its own effects while the field's own rules keep applying."));
            overlayNotes.filter(n -> !n.missing()).map(ClientFieldState.NotesDoc::doc).ifPresent(o -> {
                if (o.has("overlay")) for (var line : o.getAsJsonArray("overlay")) now.add(new Paragraph(Style.BULLET, line.getAsString()));
            });
        }
        if (state.substrate() != null) {
            String text = doc != null ? string(doc, "substrateText") : null;
            now.add(new Paragraph(Style.BODY, text != null ? text.replace("{substrate}", state.substrateName() == null ? state.substrate() : state.substrateName())
                : "Beneath this field: " + state.substrateName() + ". Removing the surface restores it."));
        }
        if (doc != null && doc.has("counters")) for (var element : doc.getAsJsonArray("counters")) counter(state, element.getAsJsonObject(), now);
        if (!now.isEmpty()) { out.add(new Paragraph(Style.SPACER, "")); out.add(new Paragraph(Style.HEADING, "Right now")); out.addAll(now); }
        if (doc != null && doc.has("sections")) for (var element : doc.getAsJsonArray("sections")) {
            var section = element.getAsJsonObject();
            out.add(new Paragraph(Style.SPACER, ""));
            out.add(new Paragraph(Style.HEADING, string(section, "heading") == null ? "" : string(section, "heading")));
            for (var line : section.getAsJsonArray("lines")) out.add(new Paragraph(Style.BULLET, line.getAsString()));
        }
        return out;
    }

    /** A public counter: shared (one value) or per side, shown from the viewer's side; thresholds say what each level does. */
    private static void counter(ClientFieldState.State state, JsonObject c, List<Paragraph> out) {
        String id = string(c, "id"), label = string(c, "label"), scope = string(c, "scope");
        int max = c.has("maximum") ? c.get("maximum").getAsInt() : 1;
        var values = state.counters().get(id);
        if (id == null || label == null || values == null || values.isEmpty()) return;
        if ("perSide".equals(scope) && values.size() >= 2) {
            int own = state.viewer();
            if (own == 0 || own == 1) {
                out.add(new Paragraph(Style.COUNTER, label + ", your side: " + values.get(own) + " / " + max, values.get(own), max));
                out.add(new Paragraph(Style.COUNTER, label + ", opposing side: " + values.get(1 - own) + " / " + max, values.get(1 - own), max));
            } else for (int i = 0; i < values.size(); i++) out.add(new Paragraph(Style.COUNTER, label + ", side " + (i + 1) + ": " + values.get(i) + " / " + max, values.get(i), max));
        } else out.add(new Paragraph(Style.COUNTER, label + ": " + values.get(0) + " / " + max, values.get(0), max));
        if (c.has("thresholds")) for (var element : c.getAsJsonArray("thresholds")) {
            var t = element.getAsJsonObject();
            int at = t.get("at").getAsInt(), reached = values.stream().mapToInt(Integer::intValue).max().orElse(0);
            out.add(new Paragraph(Style.MUTED, "At " + at + (reached >= at ? " (reached)" : "") + ": " + t.get("text").getAsString()));
        }
    }
    private static String string(JsonObject o, String key) { return o.has(key) && o.get(key).isJsonPrimitive() ? o.get(key).getAsString() : null; }

    /** Greedy word wrap with a measuring function; words wider than the line are broken. Bullets are indented. */
    static List<Row> wrap(List<Paragraph> paragraphs, int width, ToIntFunction<String> measure) {
        var rows = new ArrayList<Row>();
        for (var p : paragraphs) {
            if (p.style() == Style.SPACER) { rows.add(new Row(Style.SPACER, "", true, -1, -1)); continue; }
            int limit = Math.max(8, p.style() == Style.BULLET ? width - BULLET_INDENT : width);
            var line = new StringBuilder();
            boolean first = true;
            for (String word : p.text().split(" +")) {
                if (word.isEmpty()) continue;
                String candidate = line.isEmpty() ? word : line + " " + word;
                if (measure.applyAsInt(candidate) <= limit) { line.setLength(0); line.append(candidate); continue; }
                if (!line.isEmpty()) { rows.add(new Row(p.style(), line.toString(), first, p.value(), p.max())); first = false; line.setLength(0); }
                String rest = word;
                while (measure.applyAsInt(rest) > limit) {
                    int cut = 1; while (cut < rest.length() && measure.applyAsInt(rest.substring(0, cut + 1)) <= limit) cut++;
                    rows.add(new Row(p.style(), rest.substring(0, cut), first, p.value(), p.max())); first = false; rest = rest.substring(cut);
                }
                line.append(rest);
            }
            if (!line.isEmpty() || first) rows.add(new Row(p.style(), line.toString(), first, p.value(), p.max()));
        }
        return rows;
    }

    static int contentHeight(List<Row> rows, int lineHeight) { return rows.size() * lineHeight; }
    static int maxScroll(List<Row> rows, int lineHeight, int viewHeight) { return Math.max(0, contentHeight(rows, lineHeight) - viewHeight); }
    static int clamp(int scroll, int max) { return Math.max(0, Math.min(max, scroll)); }
    /** The scrollbar thumb: {y, height} inside the track, or null when everything fits. */
    static int[] thumb(Layout l, int total, int scroll) {
        if (total <= l.contentHeight()) return null;
        int height = Math.max(8, l.trackHeight() * l.contentHeight() / total), room = l.trackHeight() - height, max = total - l.contentHeight();
        return new int[]{l.trackY() + (max == 0 ? 0 : room * scroll / max), height};
    }
    /** The scroll offset that puts the thumb's centre at a pointer position on the track. */
    static int scrollFor(Layout l, int total, double pointerY, int grabOffset) {
        int[] t = thumb(l, total, 0);
        if (t == null) return 0;
        int room = l.trackHeight() - t[1], max = total - l.contentHeight();
        if (room <= 0) return 0;
        double top = pointerY - grabOffset - l.trackY();
        return clamp((int) Math.round(top * max / room), max);
    }
}
