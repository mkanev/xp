import {Event} from "../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

import {BaseContentModelEvent} from "./BaseContentModelEvent";

export class MoveContentEvent extends BaseContentModelEvent {

    static on(handler: (event: MoveContentEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: MoveContentEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
