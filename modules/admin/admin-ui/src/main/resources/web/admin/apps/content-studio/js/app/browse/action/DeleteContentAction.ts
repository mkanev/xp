import {ContentSummaryAndCompareStatus} from "../../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {CompareStatus} from "../../../../../../common/js/content/CompareStatus";
import {Action} from "../../../../../../common/js/ui/Action";

import {ContentTreeGrid} from "../ContentTreeGrid";
import {ContentDeletePromptEvent} from "../ContentDeletePromptEvent";

export class DeleteContentAction extends Action {

    constructor(grid: ContentTreeGrid) {
        super("Delete", "mod+del");
        this.setEnabled(false);
        this.onExecuted(() => {
            var contents: ContentSummaryAndCompareStatus[]
                = grid.getSelectedDataList();
            new ContentDeletePromptEvent(contents)
                .setNoCallback(null)
                .setYesCallback((exclude?: CompareStatus[]) => {

                    var excludeStatuses = !!exclude ? exclude : [CompareStatus.EQUAL, CompareStatus.NEWER, CompareStatus.MOVED,
                            CompareStatus.PENDING_DELETE, CompareStatus.OLDER],
                    deselected = [];
                    grid.getSelectedDataList().forEach((content: ContentSummaryAndCompareStatus) => {
                        if (excludeStatuses.indexOf(content.getCompareStatus()) < 0) {
                            deselected.push(content.getId());
                        }
                    });
                grid.deselectNodes(deselected);
                }).fire();
        });
    }
}