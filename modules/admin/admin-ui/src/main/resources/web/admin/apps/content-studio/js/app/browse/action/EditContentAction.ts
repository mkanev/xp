import {Action} from "../../../../../../common/js/ui/Action";
import {ContentSummaryAndCompareStatus} from "../../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {showWarning} from "../../../../../../common/js/notify/MessageBus";
import {EditContentEvent} from "../../../../../../common/js/content/event/EditContentEvent";

import {ContentTreeGrid} from "../ContentTreeGrid";

export class EditContentAction extends Action {

    private static MAX_ITEMS_TO_EDIT: number = 5;

    constructor(grid: ContentTreeGrid) {
        super("Edit", "mod+e");
        this.setEnabled(false);
        this.onExecuted(() => {
            var contents: ContentSummaryAndCompareStatus[]
                = grid.getSelectedDataList();

            if (contents.length > EditContentAction.MAX_ITEMS_TO_EDIT) {
                showWarning("Too many items selected for edit ("
                                       + EditContentAction.MAX_ITEMS_TO_EDIT +
                                       " allowed) - performance may degrade. Please deselect some of the items.");
            }
            else {
                new EditContentEvent(contents).fire();
            }

        });
    }
}
