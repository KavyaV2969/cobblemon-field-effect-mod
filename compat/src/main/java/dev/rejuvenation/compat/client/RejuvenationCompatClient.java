package dev.rejuvenation.compat.client;

import dev.rejuvenation.client.ClientFieldState;
import net.fabricmc.api.ClientModInitializer;
import net.fabricmc.loader.api.FabricLoader;

/**
 * Client entrypoint of the compatibility mod. It runs only on a client, so Battle Extras' client classes are never touched on a dedicated
 * server, and registers the Battle Extras cache hook only when that mod is installed (exactly once per client start).
 */
public final class RejuvenationCompatClient implements ClientModInitializer {
    @Override public void onInitializeClient() {
        if (!FabricLoader.getInstance().isModLoaded("cobblemon-battle-extras")) return;
        ClientFieldState.onEvaluationsChanged(BattleExtrasFieldAdapter::invalidateTooltipCache);
        dev.rejuvenation.client.LogBounds.register(new BattleExtrasLogBounds());
    }
}
