import {ContentSummaryAndCompareStatus} from "../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {Event} from "../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

import {BaseContentModelEvent} from "./BaseContentModelEvent";

export class ContentPublishPromptEvent extends BaseContentModelEvent {

    private includeChildItems: boolean;

    constructor(model: ContentSummaryAndCompareStatus[], includeChildItems: boolean = false) {
        super(model);
        this.includeChildItems = includeChildItems;
    }
    
    isIncludeChildItems(): boolean {
        return this.includeChildItems;
    }

    static on(handler: (event: ContentPublishPromptEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: ContentPublishPromptEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
