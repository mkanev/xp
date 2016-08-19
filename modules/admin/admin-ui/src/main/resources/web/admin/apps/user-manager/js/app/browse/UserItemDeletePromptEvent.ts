import {Event} from "../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

import {BaseUserEvent} from "./BaseUserEvent";

export class UserItemDeletePromptEvent extends BaseUserEvent {

    static on(handler: (event: UserItemDeletePromptEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: UserItemDeletePromptEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
