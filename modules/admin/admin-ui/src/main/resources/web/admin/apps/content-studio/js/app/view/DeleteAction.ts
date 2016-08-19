import {Action} from "../../../../../common/js/ui/Action";
import {ItemViewPanel} from "../../../../../common/js/app/view/ItemViewPanel";
import {ContentSummaryAndCompareStatus} from "../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {ConfirmationDialog} from "../../../../../common/js/ui/dialog/ConfirmationDialog";
import {DeleteContentRequest} from "../../../../../common/js/content/resource/DeleteContentRequest";
import {DeleteContentResult} from "../../../../../common/js/content/resource/result/DeleteContentResult";
import {showError} from "../../../../../common/js/notify/MessageBus";
import {showFeedback} from "../../../../../common/js/notify/MessageBus";
import {StringHelper} from "../../../../../common/js/util/StringHelper";
import {showSuccess} from "../../../../../common/js/notify/MessageBus";
import {showWarning} from "../../../../../common/js/notify/MessageBus";

export class DeleteAction extends Action {

    constructor(itemViewPanel: ItemViewPanel<ContentSummaryAndCompareStatus>) {
        super("Delete", "mod+del");

        this.onExecuted(() => {

            var contentToDelete = itemViewPanel.getItem().getModel().getContentSummary();

            ConfirmationDialog.get()
                .setQuestion("Are you sure you want to delete this content?")
                .setNoCallback(null)
                .setYesCallback(() => {
                    itemViewPanel.close();
                    new DeleteContentRequest()
                        .addContentPath(contentToDelete.getPath())
                        .sendAndParse()
                        .then((result: DeleteContentResult) => {
                            DeleteAction.showDeleteResult(result);
                        }).catch((reason: any) => {
                            if (reason && reason.message) {
                                showError(reason.message);
                            } else {
                                showError('Content could not be deleted.');
                            }
                        }).done();
                }).open();
        });
    }

    public static showDeleteResult(result: DeleteContentResult) {
        if(result.getPendings() + result.getDeleted() == 1) {
            if (result.getPendings() == 1) {
                showFeedback(`"${result.getContentName()}" marked for deletion`);
            } else if (result.getPendings() > 1) {
                showFeedback(`${result.getPendings()} items marked for deletion`);
            }

            else if (result.getDeleted() == 1) {
                let name = result.getContentName() ||
                           `Unnamed ${StringHelper.capitalizeAll(result.getContentType().replace(/-/g, " ").trim())}`;
                showFeedback(name + " deleted");
            } else if (result.getDeleted() > 1) {
                showFeedback(result.getDeleted() + ' items deleted');
            }


        } else {
            if (result.getDeleted() > 0) {
                showSuccess(result.getDeleted() + ' items were deleted');
            }
            if (result.getPendings() > 0) {
                showSuccess(result.getPendings() + ' items were marked for deletion');
            }
        }
        if (result.getFailureReason()) {
            showWarning(`Content could not be deleted. ${result.getFailureReason()}`);
        }
    }

}
