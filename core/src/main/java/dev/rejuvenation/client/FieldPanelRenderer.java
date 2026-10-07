package dev.rejuvenation.client;

import com.cobblemon.mod.common.client.CobblemonClient;
import com.cobblemon.mod.common.client.CobblemonResources;
import com.cobblemon.mod.common.client.render.RenderHelperKt;
import net.minecraft.class_124;
import net.minecraft.class_2561;
import net.minecraft.class_2960;
import net.minecraft.class_310;
import net.minecraft.class_332;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * The active field, drawn above the battle log as a framed Rejuvenation backdrop thumbnail with the field name.
 *
 * The frame is cut from Cobblemon's own battle log texture ({@code battle_log_expanded.png}: dark outline, light
 * header band, grey body, dark inset), so the panel follows Cobblemon's HUD and any resource pack that restyles it.
 * The panel is anchored to the log that is actually on screen: Battle Extras' enhanced or classic log when that mod
 * draws one, else Cobblemon's message pane. It never covers the opponent's battle tiles and takes no input.
 * Layout is computed by {@link #layout} so a later info control can be attached to the returned bounds.
 */
public final class FieldPanelRenderer {
    private FieldPanelRenderer() {}
    private static final class Resources {
        static final class_2960 FRAME = class_2960.method_60655("cobblemon", "textures/gui/battle/battle_log_expanded.png");
    }
    private static final int FRAME_W = 169, FRAME_H = 101;
    private static final int BORDER_LEFT = 5, BORDER_RIGHT = 3, HEADER = 6, FOOTER = 3, NAME_STRIP = 11;
    private static final int MAX_WIDTH = 160, MIN_WIDTH = 72, GAP = 3;
    private static final long CROSSFADE_MILLIS = 400;
    private static final Map<String, class_2960> textures = new HashMap<>();

    /** Panel bounds in GUI pixels, and the backdrop rectangle inside it. */
    public record Layout(int x, int y, int width, int height, int imageX, int imageY, int imageWidth, int imageHeight) {}

    public static void render(class_332 context) {
        var state = ClientFieldState.current();
        var layout = currentLayout();
        if (state.isEmpty() || layout == null) return;
        draw(context, layout, state.get());
    }

    /** Where the panel is drawn right now, or null when it is not (no battle, minimised, HUD hidden, no room). */
    static Layout currentLayout() {
        var client = class_310.method_1551();
        var battle = CobblemonClient.INSTANCE.getBattle();
        if (battle == null || battle.getMinimised() || client.field_1690.field_1842 || ClientFieldState.current().isEmpty()) return null;
        int screenW = client.method_22683().method_4486(), screenH = client.method_22683().method_4502();
        int opposing = 1;
        for (var side : battle.getSides()) if (side != null && side != battle.getSide1()) {
            int n = 0; for (var actor : side.getActors()) n += actor.getActivePokemon().size(); opposing = Math.max(opposing, n);
        }
        return layout(LogBounds.current(screenW, screenH), screenW, screenH, opposing);
    }

    /** Bottom edge of the battle log the panel sits above, or -1 when unknown. */
    static int logBottom() {
        var window = class_310.method_1551().method_22683();
        var log = LogBounds.current(window.method_4486(), window.method_4502());
        return log.y() + log.height();
    }

    /** Above the log, right-aligned with it, below the opponent tiles (Cobblemon: inset 10, 40 per tile). */
    static Layout layout(LogBounds.Bounds log, int screenW, int screenH, int opposingTiles) {
        int top = 10 + 40 * Math.max(1,opposingTiles) + GAP;
        int bottom = Math.min(screenH-2,log.y()-GAP);
        int available = bottom - top;
        if (screenW<MIN_WIDTH+4 || available<height(MIN_WIDTH)) return null;
        int width = Math.min(screenW-4,Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, log.width())));
        // Shrink to fit the vertical room: height = header + image (16:9) + name strip + footer.
        while (width > MIN_WIDTH && height(width) > available) width -= 2;
        if (height(width) > available) return null;
        int x = Math.max(2, Math.min(screenW - width - 2, log.x() + log.width() - width));
        int h = height(width), y = bottom - h;
        int iw = width - BORDER_LEFT - BORDER_RIGHT - 2, ih = iw * 9 / 16;
        return new Layout(x, y, width, h, x + BORDER_LEFT + 1, y + HEADER, iw, ih);
    }
    private static int height(int width) { int iw = width - BORDER_LEFT - BORDER_RIGHT - 2; return HEADER + iw * 9 / 16 + 1 + NAME_STRIP + FOOTER; }

    static void draw(class_332 context, Layout l, ClientFieldState.State state) {
        frame(context, l.x(), l.y(), l.width(), l.height());
        // Dark inset around the backdrop, as around the log's text box.
        context.method_25294(l.imageX() - 1, l.imageY() - 1, l.imageX() + l.imageWidth() + 1, l.imageY() + l.imageHeight() + 1, 0xFF2F2F2F);
        var previous = ClientFieldState.previous(CROSSFADE_MILLIS);
        float fade = previous.isPresent() ? Math.min(1f, (System.currentTimeMillis() - state.changedAt()) / (float) CROSSFADE_MILLIS) : 1f;
        if (previous.isPresent() && fade < 1f) backdrop(context, l, previous.get(), 1f);
        backdrop(context, l, state.field(), fade);
        // Overlay terrain or a temporary field's clock: a strip along the bottom of the backdrop.
        String detail = null;
        if (state.overlay() != null) detail = state.overlayName() + (state.overlayDuration() > 0 ? " · " + state.overlayDuration() : "");
        else if (state.duration() > 0) detail = state.duration() + (state.duration() == 1 ? " turn left" : " turns left");
        if (detail != null) {
            int sy = l.imageY() + l.imageHeight() - 9;
            context.method_25294(l.imageX(), sy, l.imageX() + l.imageWidth(), l.imageY() + l.imageHeight(), 0xA0101010);
            text(context, detail, l.imageX() + l.imageWidth() / 2f, sy + 1.5f, 0.75f, l.imageWidth() - 4, false, 0xFFE8E8E8);
        }
        text(context, state.name(), l.x() + l.width() / 2f, l.imageY() + l.imageHeight() + 2.5f, 1f, l.width() - 8, true, 0xFFFFFFFF);
    }

    /** A horizontal strip of a field's backdrop (centre-cropped to the strip's aspect), for the notes overlay's banner. */
    static void banner(class_332 context, String field, int x, int y, int w, int h) {
        int regionH = Math.max(1, Math.min(288, 512 * h / Math.max(1, w))), v = (288 - regionH) / 2;
        context.method_25293(texture(field), x, y, w, h, 0, v, 512, regionH, 512, 288);
    }

    private static void backdrop(class_332 context, Layout l, String field, float alpha) {
        context.method_51422(1f, 1f, 1f, alpha);
        com.mojang.blaze3d.systems.RenderSystem.enableBlend();
        // Backdrops are 512x288 (two are 512x290); scaled into the 16:9 inset.
        context.method_25293(texture(field), l.imageX(), l.imageY(), l.imageWidth(), l.imageHeight(), 0, 0, 512, 288, 512, 288);
        context.method_51422(1f, 1f, 1f, 1f);
    }

    /** {@code rejuvenation:textures/gui/field/<field>.png}; fields without artwork use the Indoor backdrop. */
    static class_2960 texture(String field) {
        return textures.computeIfAbsent(field, id -> {
            int colon = id.indexOf(':');
            String namespace = colon < 0 ? "rejuvenation" : id.substring(0, colon), path = id.substring(colon + 1).toLowerCase(Locale.ROOT);
            var candidate = class_2960.method_60655(namespace, "textures/gui/field/" + path + ".png");
            return class_310.method_1551().method_1478().method_14486(candidate).isPresent() ? candidate : class_2960.method_60655("rejuvenation", "textures/gui/field/indoor.png");
        });
    }
    static void clearTextureCache() { textures.clear(); }

    /** Nine-slice of Cobblemon's log frame: outline, header band, body, footer; the log's scrollbar column is not used. */
    static void frame(class_332 c, int x, int y, int w, int h) {
        int midW = w - BORDER_LEFT - BORDER_RIGHT, midH = h - HEADER - FOOTER;
        // Header band (rows 0-5); the right part carries the frame's chamfered corner.
        c.method_25293(Resources.FRAME, x, y, 6, HEADER, 0, 0, 6, HEADER, FRAME_W, FRAME_H);
        c.method_25293(Resources.FRAME, x + 6, y, w - 12, HEADER, 20, 0, 1, HEADER, FRAME_W, FRAME_H);
        c.method_25293(Resources.FRAME, x + w - 6, y, 6, HEADER, FRAME_W - 6, 0, 6, HEADER, FRAME_W, FRAME_H);
        // Body: left border, grey fill, right border.
        c.method_25293(Resources.FRAME, x, y + HEADER, BORDER_LEFT, midH, 0, 10, BORDER_LEFT, 1, FRAME_W, FRAME_H);
        c.method_25293(Resources.FRAME, x + BORDER_LEFT, y + HEADER, midW, midH, 160, 10, 1, 1, FRAME_W, FRAME_H);
        c.method_25293(Resources.FRAME, x + w - BORDER_RIGHT, y + HEADER, BORDER_RIGHT, midH, FRAME_W - BORDER_RIGHT, 10, BORDER_RIGHT, 1, FRAME_W, FRAME_H);
        // Footer (rows 98-100).
        c.method_25293(Resources.FRAME, x, y + h - FOOTER, BORDER_LEFT, FOOTER, 0, FRAME_H - FOOTER, BORDER_LEFT, FOOTER, FRAME_W, FRAME_H);
        c.method_25293(Resources.FRAME, x + BORDER_LEFT, y + h - FOOTER, midW, FOOTER, 20, FRAME_H - FOOTER, 1, FOOTER, FRAME_W, FRAME_H);
        c.method_25293(Resources.FRAME, x + w - BORDER_RIGHT, y + h - FOOTER, BORDER_RIGHT, FOOTER, FRAME_W - BORDER_RIGHT, FRAME_H - FOOTER, BORDER_RIGHT, FOOTER, FRAME_W, FRAME_H);
    }

    /** Cobblemon's battle HUD text: its large font, bold, centred, shadowed, scaled to fit. */
    private static void text(class_332 context, String value, float centerX, float y, float scale, int maxWidth, boolean bold, int colour) {
        var client = class_310.method_1551();
        var font = CobblemonResources.INSTANCE.getDEFAULT_LARGE();
        // Measured in Cobblemon's font so long names shrink to fit instead of overflowing the frame.
        var component = class_2561.method_43470(value).method_27694(style -> style.method_27704(font));
        if (bold) component = component.method_27692(class_124.field_1067);
        int width = client.field_1772.method_27525(component);
        float fitted = width * scale > maxWidth ? maxWidth / (float) width : scale;
        RenderHelperKt.drawScaledText(context, font, component, centerX, y, fitted, 1f,
            Integer.MAX_VALUE, colour, true, true, null, null);
    }
}

