package dev.rejuvenation;

import java.util.List;
import net.minecraft.class_124;
import net.minecraft.class_1792;
import net.minecraft.class_1799;
import net.minecraft.class_1836;
import net.minecraft.class_2561;

/**
 * An EV Training Card. A plain item: it has no Showdown held-item ID, so in battle it is no item at all (no Power Item Speed halving,
 * nothing can consume, knock off or trade it), and it is never used up. The EV rules are in {@link EvCards}.
 */
public final class EvCardItem extends class_1792 {
    public final EvCards.Card card;

    public EvCardItem(EvCards.Card card) {
        super(new class_1792.class_1793());
        this.card = card;
    }

    @Override public void method_7851(class_1799 stack, class_1792.class_9635 context, List<class_2561> tooltip, class_1836 type) {
        tooltip.add(class_2561.method_43471("item.rejuvenation." + card.id + ".tooltip").method_27692(class_124.field_1080));
        tooltip.add(class_2561.method_43471("item.rejuvenation.ev_card.tooltip").method_27692(class_124.field_1063));
    }
}
