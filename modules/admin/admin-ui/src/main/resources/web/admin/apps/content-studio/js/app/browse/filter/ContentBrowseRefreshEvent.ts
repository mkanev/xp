import {Event} from "../../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../../common/js/ClassHelper";

export class ContentBrowseRefreshEvent extends Event {

    static on(handler: (event: ContentBrowseRefreshEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: ContentBrowseRefreshEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
