package dev.rejuvenation.mixin;

import com.cobblemon.mod.common.api.battles.model.PokemonBattle;
import com.cobblemon.mod.common.battles.runner.graal.GraalShowdownService;
import com.google.gson.*;
import dev.rejuvenation.*;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.Unique;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

/** Runs on Cobblemon's existing Showdown worker, never accesses Graal from server ticks. */
@Mixin(value=GraalShowdownService.class, remap=false)
public abstract class ShowdownMixin {
    @Unique private long rejuvenation$revision = -1;
    @Inject(method="boot", at=@At("TAIL"))
    private void rejuvenation$boot(CallbackInfo ci) {
        ((GraalShowdownService)(Object)this).getContext().eval("js", RejuvenationFields.engine);
        rejuvenation$revision=-1;
    }
    @Inject(method="startBattle", at=@At("HEAD"))
    private void rejuvenation$start(PokemonBattle battle, String[] messages, CallbackInfo ci) {
        var snapshot=RejuvenationFields.catalog;
        if (!snapshot.data().has("fields") || snapshot.data().getAsJsonObject("fields").isEmpty()) return;
        var context=((GraalShowdownService)(Object)this).getContext();
        if (rejuvenation$revision!=snapshot.revision()) {
            var diagnostics=context.getBindings("js").getMember("RejuvenationEngine").getMember("load").execute(snapshot.data().toString()).asString();
            RejuvenationFields.LOG.info("Simulator field reference diagnostics: {}",diagnostics);
            rejuvenation$revision=snapshot.revision();
        }
        var resolved=FieldApi.resolve(battle,snapshot.data());
        var mode=FieldApi.consumeOptions(battle.getBattleId());
        if (!resolved.enabled()) return;
        HeldItemBridge.bridge(battle,messages,snapshot.data());
        String field=resolved.field();
        for (int i=0;i<messages.length;i++) if (messages[i].startsWith(">start ")) {
            var options=JsonParser.parseString(messages[i].substring(7)).getAsJsonObject();
            options.addProperty("rejuvenationField",field);
            var fieldOptions=mode.map(FieldApi.RuleOptions::json).orElseGet(JsonObject::new);
            fieldOptions.addProperty("online",battle.isPvP());
            var actorTypes=new JsonObject();for(var actor:battle.getActors())actorTypes.addProperty(actor.getShowdownId(),actor.getType().name().toLowerCase(java.util.Locale.ROOT));
            fieldOptions.add("actorTypes",actorTypes);
            options.add("rejuvenationFieldOptions",fieldOptions);
            messages[i]=">start "+options;
        }
    }
    @Inject(method="endBattle", at=@At("HEAD"))
    private void rejuvenation$end(PokemonBattle battle, CallbackInfo ci) { FieldApi.clear(battle.getBattleId()); }
}
