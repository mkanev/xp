import {Event} from "../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

import {BaseContentModelEvent} from "./BaseContentModelEvent";

export class ShowDetailsEvent extends BaseContentModelEvent {

    static on(handler: (event: ShowDetailsEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: ShowDetailsEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
