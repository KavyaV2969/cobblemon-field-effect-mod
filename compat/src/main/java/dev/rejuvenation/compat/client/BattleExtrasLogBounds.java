package dev.rejuvenation.compat.client;

import dev.rejuvenation.client.LogBounds;
import java.lang.reflect.Field;

/**
 * Cobblemon Battle Extras can replace Cobblemon's message pane with an enhanced or classic log at a user-chosen position; its widgets publish
 * their bounds in static fields, read here (by name, without modifying or linking that mod) so the field panel does not cover its log.
 * Registered with the core only when Battle Extras is installed.
 */
final class BattleExtrasLogBounds implements LogBounds.Provider {
    private Field enhancedX, enhancedY, enhancedW, enhancedH, classicX, classicY, classicW, classicH, enhancedStyle;
    private Object config;
    private boolean resolved;

    @Override public LogBounds.Bounds current(int screenW, int screenH) throws Exception {
        resolve();
        boolean enhanced = enhancedStyle == null || enhancedStyle.getBoolean(config());
        return enhanced ? read(enhancedX, enhancedY, enhancedW, enhancedH) : read(classicX, classicY, classicW, classicH);
    }
    private static LogBounds.Bounds read(Field x, Field y, Field w, Field h) throws IllegalAccessException {
        if (x == null || y == null || w == null || h == null) return null;
        return new LogBounds.Bounds(x.getInt(null), y.getInt(null), w.getInt(null), h.getInt(null));
    }
    private void resolve() throws ReflectiveOperationException {
        if (resolved) return;
        resolved = true;
        var enhanced = Class.forName("name.modid.client.battlelog.EnhancedBattleLogWidget");
        enhancedX = field(enhanced, "widgetX"); enhancedY = field(enhanced, "widgetY"); enhancedW = field(enhanced, "widgetW"); enhancedH = field(enhanced, "widgetH");
        var classic = Class.forName("name.modid.client.battlelog.BattleLogWidget");
        classicX = field(classic, "x"); classicY = field(classic, "y"); classicW = field(classic, "width"); classicH = field(classic, "height");
        var configClass = Class.forName("name.modid.client.BattleExtrasConfig");
        enhancedStyle = field(configClass, "useEnhancedBattleLogStyle");
    }
    private Object config() throws ReflectiveOperationException {
        if (config == null) config = Class.forName("name.modid.client.BattleExtrasConfig").getMethod("get").invoke(null);
        return config;
    }
    private static Field field(Class<?> owner, String name) {
        try { Field f = owner.getDeclaredField(name); f.setAccessible(true); return f; } catch (NoSuchFieldException e) { return null; }
    }
}
