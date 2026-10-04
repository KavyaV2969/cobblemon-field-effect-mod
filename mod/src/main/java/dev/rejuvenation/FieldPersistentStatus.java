package dev.rejuvenation;

import com.cobblemon.mod.common.pokemon.Pokemon;
import com.cobblemon.mod.common.pokemon.status.PersistentStatus;
import kotlin.random.Random;
import kotlin.ranges.IntRange;
import net.minecraft.class_2960;
import net.minecraft.class_3222;

/** Source persistent statuses expire only through an explicit cure, not passive time. */
public final class FieldPersistentStatus extends PersistentStatus {
    public FieldPersistentStatus(String name,String showdown) {
        super(class_2960.method_60655("rejuvenation",name),showdown,
            "status.rejuvenation."+name+".apply","status.rejuvenation."+name+".remove",
            new IntRange(Integer.MAX_VALUE,Integer.MAX_VALUE));
    }
    @Override public void onSecondPassed(class_3222 player,Pokemon pokemon,Random random) {
        var container=pokemon.getStatus();
        if(container!=null && container.getStatus()==this)container.setSecondsLeft(Integer.MAX_VALUE);
    }
}
