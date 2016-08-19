import {Action} from "../../../../../../common/js/ui/Action";
import {ContentSummaryAndCompareStatus} from "../../../../../../common/js/content/ContentSummaryAndCompareStatus";

import {ContentTreeGrid} from "../ContentTreeGrid";
import {SortContentEvent} from "../SortContentEvent";

export class SortContentAction extends Action {

    constructor(grid: ContentTreeGrid) {
        super("Sort");
        this.setEnabled(false);
        this.onExecuted(() => {
            var contents: ContentSummaryAndCompareStatus[]
                = grid.getSelectedDataList();
            new SortContentEvent(contents).fire();
        });
    }
}
