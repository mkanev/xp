import {ContentSummaryAndCompareStatus} from "../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {Event} from "../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

import {BaseContentModelEvent} from "./BaseContentModelEvent";

export class ContentUnpublishPromptEvent extends BaseContentModelEvent {

    constructor(model: ContentSummaryAndCompareStatus[]) {
        super(model);
    }

    static on(handler: (event: ContentUnpublishPromptEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: ContentUnpublishPromptEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
