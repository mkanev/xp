import {ContentSummaryAndCompareStatus} from "../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {Event} from "../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

import {BaseContentModelEvent} from "./BaseContentModelEvent";

export class ShowNewContentDialogEvent extends BaseContentModelEvent {

    private parentContent: ContentSummaryAndCompareStatus;

    constructor(parentContent: ContentSummaryAndCompareStatus) {
        super([parentContent]);
        this.parentContent = parentContent;
    }

    getParentContent(): ContentSummaryAndCompareStatus {
        return this.parentContent;
    }

    static on(handler: (event: ShowNewContentDialogEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: ShowNewContentDialogEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
