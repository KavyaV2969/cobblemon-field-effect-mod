package dev.rejuvenation.client;

import net.fabricmc.fabric.api.client.screen.v1.ScreenEvents;
import net.fabricmc.fabric.api.client.screen.v1.ScreenKeyboardEvents;
import net.fabricmc.fabric.api.client.screen.v1.ScreenMouseEvents;
import net.minecraft.class_2561;
import net.minecraft.class_310;
import net.minecraft.class_332;
import net.minecraft.class_437;
import java.util.Optional;

/**
 * Draws the Field Notes overlay and connects {@link FieldNotesOverlay}'s input rules to the screens that can host it.
 *
 * <p>The overlay is drawn with the same frame (Cobblemon's battle log texture) as the HUD field panel, with the field's backdrop as a
 * banner, over the area of the battle log. It is hosted by the screens in which the mouse is free during a battle: Cobblemon's battle
 * screen and the chat screen (which is how a spectator, who has no battle screen, can click the panel). Hosting is by Fabric's screen
 * events, so no screen class is modified, and every handler is installed per screen instance and removed with it.
 */
final class FieldNotesRenderer {
    private FieldNotesRenderer() {}
    static final FieldNotesOverlay overlay = new FieldNotesOverlay();
    private static boolean failed;

    private static final int INSET = 0xFF2F2F2F, TEXT = 0xFFE0E0E0, SUMMARY = 0xFFFFFFFF, HEADING = 0xFFFFD36B, MUTED = 0xFFA0A0A0, TITLE = 0xFFFFFFFF, BAR = 0x70D04040;

    /** The live environment: the client's real screen size, font, state and HUD panel. */
    private static final FieldNotesOverlay.Env LIVE = new FieldNotesOverlay.Env() {
        @Override public int screenWidth() { return class_310.method_1551().method_22683().method_4486(); }
        @Override public int screenHeight() { return class_310.method_1551().method_22683().method_4502(); }
        @Override public int textWidth(String text) { return class_310.method_1551().field_1772.method_1727(text); }
        @Override public int lineHeight() { return class_310.method_1551().field_1772.field_2000 + 1; }
        @Override public Optional<ClientFieldState.State> state() { return ClientFieldState.current(); }
        @Override public Optional<ClientFieldState.NotesDoc> notes(String field) { return ClientFieldState.notes(field); }
        @Override public FieldPanelRenderer.Layout panel() { return FieldPanelRenderer.currentLayout(); }
        @Override public int anchorBottom() { return FieldPanelRenderer.logBottom(); }
    };

    static void register() {
        ScreenEvents.AFTER_INIT.register((client, screen, width, height) -> {
            if (!hosts(screen)) return;
            ScreenMouseEvents.allowMouseClick(screen).register((s, x, y, button) -> !guard(() -> overlay.mouseClicked(LIVE, x, y, button)));
            ScreenMouseEvents.allowMouseRelease(screen).register((s, x, y, button) -> !guard(() -> overlay.mouseReleased(LIVE, x, y, button)));
            ScreenMouseEvents.allowMouseScroll(screen).register((s, x, y, horizontal, vertical) -> !guard(() -> overlay.mouseScrolled(LIVE, x, y, vertical)));
            ScreenKeyboardEvents.allowKeyPress(screen).register((s, key, scancode, modifiers) -> !guard(() -> overlay.keyPressed(LIVE, key)));
            ScreenEvents.afterRender(screen).register((s, context, mouseX, mouseY, delta) -> draw(context, mouseX, mouseY));
            ScreenEvents.remove(screen).register(s -> overlay.screenClosed());
        });
    }

    /** The screens where the mouse is free during a battle. */
    static boolean hosts(class_437 screen) {
        return screen instanceof com.cobblemon.mod.common.client.gui.battle.BattleGUI || screen instanceof net.minecraft.class_408;
    }

    /** Runs an input handler; a failure disables the overlay for the session instead of breaking the battle screen. */
    private static boolean guard(java.util.function.BooleanSupplier handler) {
        if (failed) return false;
        try { return handler.getAsBoolean(); }
        catch (RuntimeException error) { disable(error); return false; }
    }
    private static void disable(RuntimeException error) {
        failed = true; overlay.close();
        dev.rejuvenation.RejuvenationFields.LOG.error("Field notes overlay failed; it is disabled for this session", error);
    }
    static void reset() { failed = false; overlay.close(); }

    private static void draw(class_332 context, int mouseX, int mouseY) {
        if (failed) return;
        try {
            var client = class_310.method_1551();
            var view = overlay.view(LIVE, mouseX, mouseY, client.field_1729.method_1608());
            if (view == null) {
                if (overlay.overPanel(LIVE, mouseX, mouseY)) context.method_51438(client.field_1772, class_2561.method_43470("Click for field notes"), mouseX, mouseY);
                return;
            }
            render(context, client.field_1772, view);
        } catch (RuntimeException error) { disable(error); }
    }

    private static void render(class_332 c, net.minecraft.class_327 font, FieldNotesOverlay.View v) {
        var l = v.layout();
        c.method_51448().method_46416(0, 0, 400);   // above the screen's own widgets and tooltips of the HUD
        FieldPanelRenderer.frame(c, l.x(), l.y(), l.width(), l.height());
        // Title bar: dark inset with the field name and the close button.
        c.method_25294(l.contentX() - 1, l.barY(), l.trackX() + l.trackWidth() + 1, l.barY() + l.barHeight(), INSET);
        c.method_51433(font, fit(font, FieldNotesModel.title(v.state()), l.closeX() - l.contentX() - 6), l.contentX() + 2, l.barY() + 2, TITLE, true);
        boolean hot = v.hoverClose();
        c.method_25294(l.closeX(), l.closeY(), l.closeX() + l.closeSize(), l.closeY() + l.closeSize(), hot ? 0xFFC04040 : 0xFF6A6A6A);
        c.method_51433(font, "x", l.closeX() + (l.closeSize() - font.method_1727("x")) / 2 + 1, l.closeY() + 1, 0xFFFFFFFF, false);
        if (l.bannerHeight() > 0) {
            FieldPanelRenderer.banner(c, v.state().field(), l.contentX(), l.bannerY(), l.trackX() + l.trackWidth() - l.contentX(), l.bannerHeight());
            if (v.state().overlay() != null || v.state().substrate() != null) {
                String note = v.state().overlay() != null ? "Overlay: " + v.state().overlayName() : "Over " + v.state().substrateName();
                c.method_25294(l.contentX(), l.bannerY() + l.bannerHeight() - 10, l.trackX() + l.trackWidth(), l.bannerY() + l.bannerHeight(), 0xA0101010);
                c.method_51433(font, fit(font, note, l.contentWidth()), l.contentX() + 2, l.bannerY() + l.bannerHeight() - 9, 0xFFE8E8E8, false);
            }
        }
        // Scrolling text on a dark inset, clipped to the content box.
        c.method_25294(l.contentX() - 1, l.contentY() - 1, l.trackX() + l.trackWidth() + 1, l.contentY() + l.contentHeight() + 1, INSET);
        c.method_44379(l.contentX(), l.contentY(), l.contentX() + l.contentWidth(), l.contentY() + l.contentHeight());
        int line = font.field_2000 + 1, y = l.contentY() - v.scroll();
        for (var row : v.rows()) {
            if (y + line > l.contentY() && y < l.contentY() + l.contentHeight()) row(c, font, l, row, y);
            y += line;
        }
        c.method_44380();
        if (v.thumb() != null) {
            c.method_25294(l.trackX(), l.trackY(), l.trackX() + l.trackWidth(), l.trackY() + l.trackHeight(), 0xFF1A1A1A);
            c.method_25294(l.trackX(), v.thumb()[0], l.trackX() + l.trackWidth(), v.thumb()[0] + v.thumb()[1], 0xFFB0B0B0);
        }
        c.method_51448().method_46416(0, 0, -400);
    }

    private static void row(class_332 c, net.minecraft.class_327 font, FieldNotesModel.Layout l, FieldNotesModel.Row row, int y) {
        int x = l.contentX();
        switch (row.style()) {
            case SPACER -> {}
            case HEADING -> c.method_51433(font, row.text(), x, y, HEADING, false);
            case SUMMARY -> c.method_51433(font, row.text(), x, y, SUMMARY, false);
            case MUTED -> c.method_51433(font, row.text(), x, y, MUTED, false);
            case COUNTER -> {
                if (row.first() && row.max() > 0) {
                    int filled = l.contentWidth() * Math.max(0, Math.min(row.max(), row.value())) / row.max();
                    c.method_25294(x, y - 1, x + filled, y + font.field_2000, BAR);
                }
                c.method_51433(font, row.text(), x, y, TEXT, false);
            }
            case BULLET -> {
                if (row.first()) c.method_51433(font, "-", x + 1, y, MUTED, false);
                c.method_51433(font, row.text(), x + FieldNotesModel.BULLET_INDENT, y, TEXT, false);
            }
            default -> c.method_51433(font, row.text(), x, y, TEXT, false);
        }
    }

    private static String fit(net.minecraft.class_327 font, String text, int width) {
        if (font.method_1727(text) <= width) return text;
        String cut = text;
        while (cut.length() > 1 && font.method_1727(cut + "...") > width) cut = cut.substring(0, cut.length() - 1);
        return cut + "...";
    }
}
