import {Action} from "../../../../../../common/js/ui/Action";
import {ContentSummaryAndCompareStatus} from "../../../../../../common/js/content/ContentSummaryAndCompareStatus";

import {ContentUnpublishPromptEvent} from "../ContentUnpublishPromptEvent";
import {ContentTreeGrid} from "../ContentTreeGrid";

export class UnpublishContentAction extends Action {

    constructor(grid: ContentTreeGrid) {
        super("Unpublish");

        this.setEnabled(false);

        this.onExecuted(() => {
            var contents: ContentSummaryAndCompareStatus[]
                = grid.getSelectedDataList();
            new ContentUnpublishPromptEvent(contents).fire();
        });
    }
}
