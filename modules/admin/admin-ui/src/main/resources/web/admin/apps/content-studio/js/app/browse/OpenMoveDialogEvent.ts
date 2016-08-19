import {Event} from "../../../../../common/js/event/Event";
import {ContentSummary} from "../../../../../common/js/content/ContentSummary";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

export class OpenMoveDialogEvent extends Event {
    private content: ContentSummary[];

    constructor(content: ContentSummary[]) {
        super();
        this.content = content;
    }

    getContentSummaries(): ContentSummary[] {
        return this.content;
    }

    static on(handler: (event: OpenMoveDialogEvent) => void, contextWindow: Window = window) {
        Event.bind(ClassHelper.getFullName(this), handler, contextWindow);
    }

    static un(handler?: (event: OpenMoveDialogEvent) => void, contextWindow: Window = window) {
        Event.unbind(ClassHelper.getFullName(this), handler, contextWindow);
    }
}
