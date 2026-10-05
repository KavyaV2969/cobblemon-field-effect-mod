package dev.rejuvenation;

import com.cobblemon.mod.common.battles.runner.ShowdownService;
import com.cobblemon.mod.common.battles.runner.graal.GraalShowdownService;

/**
 * Publishes the validated field catalog into Cobblemon's Graal simulator.
 *
 * Publication parses, validates and freezes the whole catalog inside an interpreter-only Graal
 * runtime, which costs seconds. It therefore happens when the server starts and after every
 * datapack reload, on the server thread that already drives the simulator, never while a battle
 * is starting. {@link #ensurePublished} remains as a fallback for a battle that starts before an
 * eager publication (for example when the simulator booted late); it logs a warning when used.
 */
public final class SimulatorCatalog {
    private SimulatorCatalog() {}
    private static long published = -1;
    private static long lastPublishMillis = -1;

    /** A (re)booted simulator context has not received any catalog yet. */
    public static synchronized void reset() { published = -1; }
    public static synchronized long publishedRevision() { return published; }
    public static synchronized long lastPublishMillis() { return lastPublishMillis; }

    /** Eager publication from the server thread; skipped when the simulator is not running yet. */
    public static void publishNow(String reason, boolean force) {
        try {
            if (ShowdownService.Companion.getService() instanceof GraalShowdownService service && service.context != null)
                publish(service, reason, force);
        } catch (Exception error) {
            RejuvenationFields.LOG.error("Could not publish the field catalog to the simulator ({}); it will be retried at the next battle start", reason, error);
        }
    }

    /** Publishes the current revision if this simulator context does not have it yet. Returns true if it published. */
    public static boolean ensurePublished(GraalShowdownService service, String reason) { return publish(service, reason, false); }

    private static synchronized boolean publish(GraalShowdownService service, String reason, boolean force) {
        var snapshot = RejuvenationFields.catalog;
        if (!snapshot.data().has("fields") || snapshot.data().getAsJsonObject("fields").isEmpty()) return false;
        if (!force && published == snapshot.revision()) return false;
        long start = System.nanoTime();
        boolean fresh = published < 0;
        var engine = service.getContext().getBindings("js").getMember("RejuvenationEngine");
        engine.getMember("load").execute(snapshot.json());
        published = snapshot.revision();
        lastPublishMillis = (System.nanoTime() - start) / 1_000_000;
        RejuvenationFields.LOG.info("Published field catalog revision {} to the simulator in {} ms ({})", published, lastPublishMillis, reason);
        // A fresh interpreter-only context pays seconds of first-use cost on its first strategy decision and preview;
        // pay it here, with the publication, instead of stalling the first AI decision of a battle.
        if (fresh) {
            try {
                RejuvenationFields.LOG.info("Simulator strategy/preview warm-up: {}", engine.getMember("warmup").execute().asString());
            } catch (Exception error) {
                RejuvenationFields.LOG.warn("Simulator warm-up failed; the first decision will warm up instead", error);
            }
        }
        if (RejuvenationFields.LOG.isDebugEnabled())
            RejuvenationFields.LOG.debug("Simulator field reference diagnostics: {}", engine.getMember("references").execute().asString());
        return true;
    }
}
