package dev.rejuvenation.compat;

import net.fabricmc.loader.api.FabricLoader;
import org.objectweb.asm.tree.ClassNode;
import org.spongepowered.asm.mixin.extensibility.IMixinConfigPlugin;
import org.spongepowered.asm.mixin.extensibility.IMixinInfo;
import java.util.List;
import java.util.Set;

/**
 * Applies an integration mixin only when the mod it adapts is installed: rbrctai for the Run &amp; Bun AI and
 * cobblemon-battle-extras for its move-damage preview. Neither jar is modified or bundled. The global NPC gimmick policy
 * ({@code TrainerDecisionMixin}) targets Cobblemon's own AI actor and so applies whenever this mod is installed; it reads trainer
 * declarations from RCT only when {@code rctapi} is loaded.
 */
public final class CompatMixinPlugin implements IMixinConfigPlugin {
    @Override public boolean shouldApplyMixin(String targetClassName, String mixinClassName) {
        return enabled(mixinClassName, id -> FabricLoader.getInstance().isModLoaded(id));
    }
    /** Exact optional-mod gate, exercisable without bootstrapping Fabric or Minecraft. */
    public static boolean enabled(String mixinClassName, java.util.function.Predicate<String> installed) {
        String simple = mixinClassName.substring(mixinClassName.lastIndexOf('.') + 1);
        if (simple.startsWith("BlueNpc")) return installed.test("rctapi");
        if (simple.startsWith("RunBun")) return installed.test("rbrctai");
        if (simple.startsWith("BattleExtras")) return installed.test("cobblemon-battle-extras");
        return true;
    }
    @Override public void onLoad(String mixinPackage) {}
    @Override public String getRefMapperConfig() { return null; }
    @Override public void acceptTargets(Set<String> myTargets, Set<String> otherTargets) {}
    @Override public List<String> getMixins() { return null; }
    @Override public void preApply(String targetClassName, ClassNode targetClass, String mixinClassName, IMixinInfo mixinInfo) {}
    @Override public void postApply(String targetClassName, ClassNode targetClass, String mixinClassName, IMixinInfo mixinInfo) {}
}
