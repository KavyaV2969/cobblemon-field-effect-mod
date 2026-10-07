package dev.rejuvenation.client;

import java.lang.reflect.Field;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * Where the battle log is on screen. Cobblemon's message pane sits at the bottom right (x = width - 181,
 * y = height - 30 - frame height, 169 wide). An optional integration (the compatibility mod's Battle Extras support) may register a
 * {@link Provider} that reports a replacement log at a user-chosen position; the first provider with a valid answer wins and any
 * failure falls back to Cobblemon's pane. This class names no third-party class.
 */
public final class LogBounds {
    private LogBounds() {}
    public record Bounds(int x, int y, int width, int height) {}
    /** Reports the battle log's bounds, or null when this provider has none. May throw; the failure is treated as "none". */
    public interface Provider { Bounds current(int screenW, int screenH) throws Exception; }
    private static final List<Provider> providers = new CopyOnWriteArrayList<>();
    /** Registers a log-position provider (once per client start). */
    public static void register(Provider provider) { providers.add(java.util.Objects.requireNonNull(provider)); }

    static Bounds current(int screenW, int screenH) {
        for (Provider provider : providers) {
            try {
                Bounds b = provider.current(screenW, screenH);
                if (b != null && b.width() > 0 && b.height() > 0) return b;
            } catch (Exception | LinkageError error) {
                providers.remove(provider);
                dev.rejuvenation.RejuvenationFields.LOG.warn("A battle log position provider failed and was disabled; anchoring the field panel to Cobblemon's battle log", error);
            }
        }
        boolean expanded = nativeExpanded();
        int frameH = expanded ? 101 : 55;
        return new Bounds(screenW - 181, screenH - 30 - frameH, 169, frameH);
    }

    private static Field nativeExpandedField;
    private static boolean nativeExpanded() {
        try {
            if (nativeExpandedField == null) {
                nativeExpandedField = Class.forName("com.cobblemon.mod.common.client.gui.battle.widgets.BattleMessagePane").getDeclaredField("expanded");
                nativeExpandedField.setAccessible(true);
            }
            return nativeExpandedField.getBoolean(null);
        } catch (ReflectiveOperationException | RuntimeException e) { return false; }
    }
}
