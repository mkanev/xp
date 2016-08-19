import {Event} from "../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

import {BaseContentModelEvent} from "./BaseContentModelEvent";

export class SortContentEvent extends BaseContentModelEvent {

    static on(handler: (event: SortContentEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: SortContentEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
