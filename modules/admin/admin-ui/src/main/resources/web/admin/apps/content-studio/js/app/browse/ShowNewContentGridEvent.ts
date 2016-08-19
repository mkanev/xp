import {Event} from "../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

export class ShowNewContentGridEvent extends Event {

    static on(handler: (event: ShowNewContentGridEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: ShowNewContentGridEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
