import {Event} from "../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

import {BaseContentModelEvent} from "./BaseContentModelEvent";

export class ViewContentEvent extends BaseContentModelEvent {

    static on(handler: (event: ViewContentEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: ViewContentEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
