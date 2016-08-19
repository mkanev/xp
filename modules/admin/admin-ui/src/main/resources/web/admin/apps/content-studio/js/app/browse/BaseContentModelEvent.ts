import {Event} from "../../../../../common/js/event/Event";
import {ContentSummaryAndCompareStatus} from "../../../../../common/js/content/ContentSummaryAndCompareStatus";

export class BaseContentModelEvent extends Event {

    private model: ContentSummaryAndCompareStatus[];

    constructor(model: ContentSummaryAndCompareStatus[]) {
        this.model = model;
        super();
    }

    getModels(): ContentSummaryAndCompareStatus[] {
        return this.model;
    }
}
