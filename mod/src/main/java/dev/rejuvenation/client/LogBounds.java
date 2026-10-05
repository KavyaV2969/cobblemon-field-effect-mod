package dev.rejuvenation.client;

import net.fabricmc.loader.api.FabricLoader;
import java.lang.reflect.Field;

/**
 * Where the battle log is on screen. Cobblemon's message pane sits at the bottom right (x = width - 181,
 * y = height - 30 - frame height, 169 wide). Battle Extras can replace it with an enhanced or classic log at a
 * user-chosen position; its widgets publish their bounds in static fields, read here without modifying that mod.
 * Any failure falls back to Cobblemon's pane.
 */
final class LogBounds {
    private LogBounds() {}
    record Bounds(int x, int y, int width, int height) {}
    private static final boolean BATTLE_EXTRAS = FabricLoader.getInstance().isModLoaded("cobblemon-battle-extras");
    private static Field enhancedX, enhancedY, enhancedW, enhancedH, classicX, classicY, classicW, classicH, enhancedStyle;
    private static Object config;
    private static boolean resolved, failed;

    static Bounds current(int screenW, int screenH) {
        if (BATTLE_EXTRAS && !failed) {
            try {
                resolve();
                boolean enhanced = enhancedStyle == null || enhancedStyle.getBoolean(config());
                Bounds b = enhanced ? read(enhancedX, enhancedY, enhancedW, enhancedH) : read(classicX, classicY, classicW, classicH);
                if (b != null && b.width() > 0 && b.height() > 0) return b;
            } catch (ReflectiveOperationException | RuntimeException error) {
                failed = true;
                dev.rejuvenation.RejuvenationFields.LOG.warn("Battle Extras log position unavailable; anchoring the field panel to Cobblemon's battle log", error);
            }
        }
        boolean expanded = nativeExpanded();
        int frameH = expanded ? 101 : 55;
        return new Bounds(screenW - 181, screenH - 30 - frameH, 169, frameH);
    }

    private static Bounds read(Field x, Field y, Field w, Field h) throws IllegalAccessException {
        if (x == null || y == null || w == null || h == null) return null;
        return new Bounds(x.getInt(null), y.getInt(null), w.getInt(null), h.getInt(null));
    }

    private static void resolve() throws ReflectiveOperationException {
        if (resolved) return;
        resolved = true;
        var enhanced = Class.forName("name.modid.client.battlelog.EnhancedBattleLogWidget");
        enhancedX = field(enhanced, "widgetX"); enhancedY = field(enhanced, "widgetY"); enhancedW = field(enhanced, "widgetW"); enhancedH = field(enhanced, "widgetH");
        var classic = Class.forName("name.modid.client.battlelog.BattleLogWidget");
        classicX = field(classic, "x"); classicY = field(classic, "y"); classicW = field(classic, "width"); classicH = field(classic, "height");
        var configClass = Class.forName("name.modid.client.BattleExtrasConfig");
        enhancedStyle = field(configClass, "useEnhancedBattleLogStyle");
    }
    private static Object config() throws ReflectiveOperationException {
        if (config == null) config = Class.forName("name.modid.client.BattleExtrasConfig").getMethod("get").invoke(null);
        return config;
    }
    private static Field field(Class<?> owner, String name) {
        try { Field f = owner.getDeclaredField(name); f.setAccessible(true); return f; } catch (NoSuchFieldException e) { return null; }
    }
    private static Field nativeExpandedField;
    private static boolean nativeExpanded() {
        try {
            if (nativeExpandedField == null) nativeExpandedField = field(Class.forName("com.cobblemon.mod.common.client.gui.battle.widgets.BattleMessagePane"), "expanded");
            return nativeExpandedField != null && nativeExpandedField.getBoolean(null);
        } catch (ReflectiveOperationException | RuntimeException e) { return false; }
    }
}
