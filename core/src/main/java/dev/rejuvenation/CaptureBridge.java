package dev.rejuvenation;

import com.cobblemon.mod.common.api.events.pokeball.PokemonCatchRateEvent;
import com.cobblemon.mod.common.api.pokeball.catching.CatchRateModifier;

/** Field ball bonus replaces, rather than stacks with, the native ball bonus. */
public final class CaptureBridge {
    private CaptureBridge() {}
    public static float adjustedRate(float rate,double fieldMultiplier,float nativeMultiplier){
        if(!Float.isFinite(rate) || rate<0 || !Float.isFinite(nativeMultiplier) || nativeMultiplier<=0 || !Double.isFinite(fieldMultiplier) || fieldMultiplier<=0)
            throw new IllegalArgumentException("Invalid capture multiplier");
        return (float)(Math.floor(rate*fieldMultiplier)/nativeMultiplier);
    }
    public static void apply(PokemonCatchRateEvent event){
        var target=event.getPokemonEntity();var ball=event.getPokeBallEntity().getPokeBall();
        var field=FieldApi.captureMultiplier(target.getBattleId(),ball.getName().toString());if(field.isEmpty())return;
        var modifier=ball.getCatchRateModifier();var pokemon=target.getPokemon();var thrower=event.getThrower();
        if(modifier.isGuaranteed() || modifier.behavior(thrower,pokemon)!=CatchRateModifier.Behavior.MULTIPLY)return;
        float nativeMultiplier=modifier.isValid(thrower,pokemon)?modifier.value(thrower,pokemon):1;
        if(nativeMultiplier>0 && Float.isFinite(nativeMultiplier))event.setCatchRate(adjustedRate(event.getCatchRate(),field.getAsDouble(),nativeMultiplier));
    }
}
