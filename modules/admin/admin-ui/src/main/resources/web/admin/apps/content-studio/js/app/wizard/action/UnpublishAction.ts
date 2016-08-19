import {ContentSummaryAndCompareStatus} from "../../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {Action} from "../../../../../../common/js/ui/Action";
import {DefaultErrorHandler} from "../../../../../../common/js/DefaultErrorHandler";

import {ContentWizardPanel} from "../ContentWizardPanel";
import {ContentUnpublishPromptEvent} from "../../browse/ContentUnpublishPromptEvent";
export class UnpublishAction extends Action {

    private wizard: ContentWizardPanel;

    constructor(wizard: ContentWizardPanel) {
        super("Unpublish");

        this.wizard = wizard;

        this.onExecuted(() => {
            if (this.wizard.hasUnsavedChanges()) {
                this.setEnabled(false);
                this.wizard.saveChanges().then((content) => {
                    if (content) {
                        this.fireContentUnpublishPromptEvent();
                    }
                }).catch((reason: any) => {
                    DefaultErrorHandler.handle(reason)
                }).finally(() => this.setEnabled(true)).done();
            } else {
                this.fireContentUnpublishPromptEvent();
            }
        });
    }

    private fireContentUnpublishPromptEvent(): void {
        let contentSummary = ContentSummaryAndCompareStatus.fromContentSummary(this.wizard.getPersistedItem());
        contentSummary.setCompareStatus(this.wizard.getContentCompareStatus());
        new ContentUnpublishPromptEvent([contentSummary]).fire();
    }
}
