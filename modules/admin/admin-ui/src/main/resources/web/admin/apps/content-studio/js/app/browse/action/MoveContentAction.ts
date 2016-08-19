import {Action} from "../../../../../../common/js/ui/Action";
import {ContentSummaryAndCompareStatus} from "../../../../../../common/js/content/ContentSummaryAndCompareStatus";

import {MoveContentEvent} from "../MoveContentEvent";
import {ContentTreeGrid} from "../ContentTreeGrid";

export class MoveContentAction extends Action {

    constructor(grid: ContentTreeGrid) {
        super("Move");
        this.setEnabled(false);
        this.onExecuted(() => {
            var contents: ContentSummaryAndCompareStatus[]
                = grid.getSelectedDataList();
            new MoveContentEvent(contents).fire();
        });
    }
}
