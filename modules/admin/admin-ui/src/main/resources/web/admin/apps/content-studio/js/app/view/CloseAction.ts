import {Action} from "../../../../../common/js/ui/Action";
import {ItemViewPanel} from "../../../../../common/js/app/view/ItemViewPanel";
import {ContentSummaryAndCompareStatus} from "../../../../../common/js/content/ContentSummaryAndCompareStatus";

export class CloseAction extends Action {

    constructor(itemViewPanel: ItemViewPanel<ContentSummaryAndCompareStatus>,
                checkCanRemovePanel: boolean = true) {
        super("Close", "mod+alt+f4");

        this.onExecuted(() => {
            itemViewPanel.close(checkCanRemovePanel);
        });
    }
}
