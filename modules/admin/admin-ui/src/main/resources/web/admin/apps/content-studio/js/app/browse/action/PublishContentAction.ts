import {Action} from "../../../../../../common/js/ui/Action";
import {ContentSummary} from "../../../../../../common/js/content/ContentSummary";
import {PublishContentRequest} from "../../../../../../common/js/content/resource/PublishContentRequest";
import {ContentSummaryAndCompareStatus} from "../../../../../../common/js/content/ContentSummaryAndCompareStatus";

import {ContentPublishPromptEvent} from "../ContentPublishPromptEvent";
import {ContentTreeGrid} from "../ContentTreeGrid";

export class PublishContentAction extends Action {

    constructor(grid: ContentTreeGrid) {
        super("Publish");
        this.setEnabled(false);
        this.onExecuted(() => {
            var contents: ContentSummaryAndCompareStatus[]
                = grid.getSelectedDataList();
            new ContentPublishPromptEvent(contents).fire();
        });
    }
}
