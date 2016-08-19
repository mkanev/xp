import {Event} from "../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

import {BaseUserEvent} from "./BaseUserEvent";

export class EditPrincipalEvent extends BaseUserEvent {

    static on(handler: (event: EditPrincipalEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: EditPrincipalEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
