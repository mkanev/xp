import {TabItem} from "./TabItem";
import {TabItemEvent} from "./TabItemEvent";

export class TabItemClosedEvent extends TabItemEvent {

        constructor(tab: TabItem) {
            super(tab);
        }
    }
