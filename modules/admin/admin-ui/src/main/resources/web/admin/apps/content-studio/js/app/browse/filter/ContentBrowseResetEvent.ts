import {Event} from "../../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../../common/js/ClassHelper";

export class ContentBrowseResetEvent extends Event {

    static on(handler: (event: ContentBrowseResetEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: ContentBrowseResetEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
