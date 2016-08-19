import {TabItem} from "./TabItem";
import {TabItemEvent} from "./TabItemEvent";

export class TabItemSelectedEvent extends TabItemEvent {

        constructor(tab: TabItem) {
            super(tab);
        }
    }
