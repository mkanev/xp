import {Event} from "../../../../../common/js/event/Event";
import {Content} from "../../../../../common/js/content/Content";
import {OpenEditPermissionsDialogEvent} from "../../../../../common/js/content/event/OpenEditPermissionsDialogEvent";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

export class ContentPermissionsAppliedEvent extends Event {
    private content: Content;

    constructor(content: Content) {
        super();
        this.content = content;
    }

    getContent(): Content {
        return this.content;
    }

    static on(handler: (event: OpenEditPermissionsDialogEvent) => void, contextWindow: Window = window) {
        Event.bind(ClassHelper.getFullName(this), handler, contextWindow);
    }

    static un(handler?: (event: OpenEditPermissionsDialogEvent) => void, contextWindow: Window = window) {
        Event.unbind(ClassHelper.getFullName(this), handler, contextWindow);
    }
}
