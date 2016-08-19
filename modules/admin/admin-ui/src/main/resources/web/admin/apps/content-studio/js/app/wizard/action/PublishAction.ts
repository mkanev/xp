import {Content} from "../../../../../../common/js/content/Content";
import {ContentId} from "../../../../../../common/js/content/ContentId";
import {ContentSummaryAndCompareStatus} from "../../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {Action} from "../../../../../../common/js/ui/Action";
import {DefaultErrorHandler} from "../../../../../../common/js/DefaultErrorHandler";
import {showWarning} from "../../../../../../common/js/notify/MessageBus";

import {ContentWizardPanel} from "../ContentWizardPanel";
import {ContentPublishPromptEvent} from "../../browse/ContentPublishPromptEvent";

export class PublishAction extends Action {

    constructor(wizard: ContentWizardPanel, includeChildItems: boolean = false) {
        super("Publish");

        this.setEnabled(false);

        this.onExecuted(() => {

            if (wizard.checkContentCanBePublished()) {
                wizard.setRequireValid(true);

                if (wizard.hasUnsavedChanges()) {
                    this.setEnabled(false);
                    wizard.saveChanges().then((content) => {
                        if (content) {
                            let contentSummary = ContentSummaryAndCompareStatus.fromContentSummary(content);
                            contentSummary.setCompareStatus(wizard.getContentCompareStatus());
                            new ContentPublishPromptEvent([contentSummary], includeChildItems).fire();
                        }
                    }).catch((reason: any) => {
                        DefaultErrorHandler.handle(reason)
                    }).finally(() => this.setEnabled(true)).done();
                } else {
                    let contentSummary = ContentSummaryAndCompareStatus.fromContentSummary(wizard.getPersistedItem());
                    contentSummary.setCompareStatus(wizard.getContentCompareStatus());
                    new ContentPublishPromptEvent([contentSummary], includeChildItems).fire();
                }
            } else {
                showWarning('The content cannot be published yet. One or more form values are not valid.');
            }
        });
    }
}
