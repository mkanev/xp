import {Event} from "../../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../../common/js/ClassHelper";

export class PrincipalBrowseResetEvent extends Event {

    static on(handler: (event: PrincipalBrowseResetEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: PrincipalBrowseResetEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
