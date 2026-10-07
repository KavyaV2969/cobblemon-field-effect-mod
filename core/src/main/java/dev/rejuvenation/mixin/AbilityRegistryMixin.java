package dev.rejuvenation.mixin;

import com.cobblemon.mod.common.api.abilities.Abilities;
import dev.rejuvenation.RejuvenationFields;
import net.minecraft.class_3300;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

/**
 * Cobblemon clears and rebuilds its ability registry at the start of each data reload, before
 * species data resolves ability names. Fabric gives no ordering between that reload and this
 * mod's catalog listener, so declared abilities are re-added as soon as the rebuild finishes.
 */
@Mixin(value=Abilities.class, remap=false)
public abstract class AbilityRegistryMixin {
    @Inject(method="reload", at=@At("TAIL"))
    private void rejuvenation$declaredAbilities(class_3300 manager, CallbackInfo ci) {
        try { RejuvenationFields.registerAbilityTemplates(RejuvenationFields.readAbilities(manager)); }
        catch (Exception error) { RejuvenationFields.LOG.error("Declared abilities were not added to Cobblemon's registry", error); }
    }
}
