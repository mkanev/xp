import {Event} from "../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

import {BaseUserEvent} from "./BaseUserEvent";

export class NewPrincipalEvent extends BaseUserEvent {

    static on(handler: (event: NewPrincipalEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: NewPrincipalEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
