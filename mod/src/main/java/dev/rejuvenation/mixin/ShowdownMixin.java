package dev.rejuvenation.mixin;

import com.cobblemon.mod.common.api.battles.model.PokemonBattle;
import com.cobblemon.mod.common.battles.runner.graal.GraalShowdownService;
import com.google.gson.*;
import dev.rejuvenation.*;
import org.spongepowered.asm.mixin.Mixin;
import org.spongepowered.asm.mixin.injection.At;
import org.spongepowered.asm.mixin.injection.Inject;
import org.spongepowered.asm.mixin.injection.callback.CallbackInfo;

/**
 * Cobblemon calls startBattle on the server thread, the same thread that drives every other simulator call.
 * Field work here is limited to lookups; the catalog is published to Graal ahead of time by SimulatorCatalog.
 */
@Mixin(value=GraalShowdownService.class, remap=false)
public abstract class ShowdownMixin {
    @Inject(method="boot", at=@At("TAIL"))
    private void rejuvenation$boot(CallbackInfo ci) {
        ((GraalShowdownService)(Object)this).getContext().eval("js", RejuvenationFields.engine);
        SimulatorCatalog.reset();
    }
    @Inject(method="startBattle", at=@At("HEAD"))
    private void rejuvenation$start(PokemonBattle battle, String[] messages, CallbackInfo ci) {
        long start=System.nanoTime();
        var snapshot=RejuvenationFields.catalog;
        if (!snapshot.data().has("fields") || snapshot.data().getAsJsonObject("fields").isEmpty()) return;
        // Normally published at server start / datapack reload; this is only the fallback path.
        boolean published=SimulatorCatalog.ensurePublished((GraalShowdownService)(Object)this,"battle start fallback");
        var resolved=FieldApi.resolve(battle,snapshot.data());
        var mode=FieldApi.consumeOptions(battle.getBattleId());
        if (!resolved.enabled()) { BattleStartTimings.simulator(battle.getBattleId(),System.nanoTime()-start,published,"none","not opted in"); return; }
        HeldItemBridge.bridge(battle,messages,snapshot.data());
        String field=resolved.field();
        for (int i=0;i<messages.length;i++) if (messages[i].startsWith(">start ")) {
            var options=JsonParser.parseString(messages[i].substring(7)).getAsJsonObject();
            options.addProperty("rejuvenationField",field);
            var fieldOptions=mode.map(FieldApi.RuleOptions::json).orElseGet(JsonObject::new);
            fieldOptions.addProperty("online",battle.isPvP());
            fieldOptions.addProperty("battleId",battle.getBattleId().toString());
            var actorTypes=new JsonObject();for(var actor:battle.getActors())actorTypes.addProperty(actor.getShowdownId(),actor.getType().name().toLowerCase(java.util.Locale.ROOT));
            fieldOptions.add("actorTypes",actorTypes);
            options.add("rejuvenationFieldOptions",fieldOptions);
            messages[i]=">start "+options;
        }
        BattleStartTimings.simulator(battle.getBattleId(),System.nanoTime()-start,published,field,FieldApi.origin(battle.getBattleId()).map(FieldApi.Origin::source).orElse("?"));
    }
    @Inject(method="endBattle", at=@At("HEAD"))
    private void rejuvenation$end(PokemonBattle battle, CallbackInfo ci) { FieldStateSync.end(battle); FieldEvaluator.forget(battle.getBattleId()); FieldApi.clear(battle.getBattleId()); }
}
