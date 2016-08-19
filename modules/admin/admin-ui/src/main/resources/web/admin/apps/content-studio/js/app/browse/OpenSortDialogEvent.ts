import {Event} from "../../../../../common/js/event/Event";
import {ContentSummaryAndCompareStatus} from "../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

export class OpenSortDialogEvent extends Event {
    private content: ContentSummaryAndCompareStatus;

    constructor(content: ContentSummaryAndCompareStatus) {
        super();
        this.content = content;
    }

    getContent(): ContentSummaryAndCompareStatus {
        return this.content;
    }

    static on(handler: (event: OpenSortDialogEvent) => void, contextWindow: Window = window) {
        Event.bind(ClassHelper.getFullName(this), handler, contextWindow);
    }

    static un(handler?: (event: OpenSortDialogEvent) => void, contextWindow: Window = window) {
        Event.unbind(ClassHelper.getFullName(this), handler, contextWindow);
    }
}
