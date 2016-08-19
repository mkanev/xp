import {ContentTypeSummary} from "../../../../../common/js/schema/content/ContentTypeSummary";

import {NewContentDialogListItem} from "./NewContentDialogListItem";

export class MostPopularItem extends NewContentDialogListItem {

    private hits: number;

    constructor(contentType: ContentTypeSummary, hits: number) {
        super(contentType);

        this.hits = hits;
    }

    getHits(): number {
        return this.hits;
    }
}
