import {Event} from "../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

export class ShowSplitEditEvent extends Event {

    static on(handler: (event: ShowSplitEditEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: ShowSplitEditEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
