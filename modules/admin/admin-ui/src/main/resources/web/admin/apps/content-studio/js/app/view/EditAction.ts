import {Action} from "../../../../../common/js/ui/Action";
import {ItemViewPanel} from "../../../../../common/js/app/view/ItemViewPanel";
import {ContentSummaryAndCompareStatus} from "../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {EditContentEvent} from "../../../../../common/js/content/event/EditContentEvent";

export class EditAction extends Action {

    constructor(panel: ItemViewPanel<ContentSummaryAndCompareStatus>) {
        super("Edit");
        this.onExecuted(() => {
            new EditContentEvent([panel.getItem().getModel()]).fire();
        });
    }
}
