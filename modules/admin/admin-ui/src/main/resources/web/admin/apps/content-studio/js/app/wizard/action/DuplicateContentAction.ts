import {Action} from "../../../../../../common/js/ui/Action";
import {WizardPanel} from "../../../../../../common/js/app/wizard/WizardPanel";
import {Content} from "../../../../../../common/js/content/Content";
import {DuplicateContentRequest} from "../../../../../../common/js/content/resource/DuplicateContentRequest";
import {ContentSummaryAndCompareStatus} from "../../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {EditContentEvent} from "../../../../../../common/js/content/event/EditContentEvent";
import {showFeedback} from "../../../../../../common/js/notify/MessageBus";

export class DuplicateContentAction extends Action {

    constructor(wizardPanel: WizardPanel<Content>) {
        super("Duplicate");
        this.onExecuted(() => {
            var source = wizardPanel.getPersistedItem();
            new DuplicateContentRequest(source.getContentId()).sendAndParse().then((content: Content) => {
                var summaryAndStatus = ContentSummaryAndCompareStatus.fromContentSummary(content);
                new EditContentEvent([summaryAndStatus]).fire();
                showFeedback('\"' + source.getDisplayName() + '\" duplicated');
            })
        });
    }
}
