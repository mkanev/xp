import {TabMenuItemBuilder} from "../../../../../common/js/ui/tab/TabMenuItem";
import {TabMenuItem} from "../../../../../common/js/ui/tab/TabMenuItem";
import {ChildOrder} from "../../../../../common/js/content/order/ChildOrder";

export class SortContentTabMenuItem extends TabMenuItem {

    private childOrder: ChildOrder;

    constructor(builder: SortContentTabMenuItemBuilder) {
        super((<TabMenuItemBuilder>new TabMenuItemBuilder().setLabel(builder.label)));
        this.childOrder = builder.childOrder;
    }

    getChildOrder(): ChildOrder {
        return this.childOrder;
    }

}

export class SortContentTabMenuItemBuilder {
    label: string;
    childOrder: ChildOrder;

    setLabel(label: string): SortContentTabMenuItemBuilder {
        this.label = label;
        return this;
    }

    setChildOrder(value: ChildOrder): SortContentTabMenuItemBuilder {
        this.childOrder = value;
        return this;
    }

    build(): SortContentTabMenuItem {
        return new SortContentTabMenuItem(this);
    }

}
