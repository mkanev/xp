import {ContentId} from "../../../../../../common/js/content/ContentId";
import {ContentPath} from "../../../../../../common/js/content/ContentPath";
import {ContentSummaryAndCompareStatus} from "../../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {Action} from "../../../../../../common/js/ui/Action";

import {ContentWizardPanel} from "../ContentWizardPanel";
import {ContentDeleteDialog} from "../../remove/ContentDeleteDialog";

export class DeleteContentAction extends Action {

    constructor(wizardPanel: ContentWizardPanel) {
        super("Delete", "mod+del", true);
        this.onExecuted(() => {
            new ContentDeleteDialog()
                .setContentToDelete(
                    [new ContentSummaryAndCompareStatus().setContentSummary(wizardPanel.getPersistedItem()).setCompareStatus(
                        wizardPanel.getContentCompareStatus())
                    ])
                .open();
        });
    }
}
