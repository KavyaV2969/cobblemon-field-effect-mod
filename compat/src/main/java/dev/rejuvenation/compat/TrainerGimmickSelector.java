package dev.rejuvenation.compat;

import com.cobblemon.mod.common.battles.ShowdownMoveset;

/** Optional AI configuration constraints applied before the shared trainer decision boundary. */
public interface TrainerGimmickSelector {
    void rejuvenation$restrictTargets(ShowdownMoveset request, String species);
}
