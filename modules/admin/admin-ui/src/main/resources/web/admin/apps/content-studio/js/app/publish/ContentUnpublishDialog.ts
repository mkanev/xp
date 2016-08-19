import {ContentSummaryAndCompareStatus} from "../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {DialogButton} from "../../../../../common/js/ui/dialog/DialogButton";
import {UnpublishContentRequest} from "../../../../../common/js/content/resource/UnpublishContentRequest";
import {ResolvePublishDependenciesResult} from "../../../../../common/js/content/resource/result/ResolvePublishDependenciesResult";
import {CompareStatus} from "../../../../../common/js/content/CompareStatus";
import {ContentId} from "../../../../../common/js/content/ContentId";
import {ListBox} from "../../../../../common/js/ui/selector/list/ListBox";
import {JsonResponse} from "../../../../../common/js/rest/JsonResponse";
import {UnpublishContentJson} from "../../../../../common/js/content/json/UnpublishContentJson";
import {Action} from "../../../../../common/js/ui/Action";

import {DependantItemsDialog} from "../dialog/DependantItemsDialog";

export class ContentUnpublishDialog extends DependantItemsDialog {


    constructor() {
        super("Unpublish item",
            "<b>Take offline?</b> - Unpublishing selected item(s) will set status back to offline",
            "Dependent items - Clean up references to selected item(s) or click unpublish to take all items offline");

        this.getEl().addClass("unpublish-dialog");

        var unpublishAction = new ContentUnpublishDialogAction();
        unpublishAction.onExecuted(this.doUnpublish.bind(this));
        this.actionButton = this.addAction(unpublishAction, true, true);
        this.actionButton.setEnabled(false);

        this.addCancelButtonToBottom();

        this.getItemList().onItemsRemoved((items: ContentSummaryAndCompareStatus[]) => {
            if (!this.isIgnoreItemsChanged()) {
                this.refreshUnpublishDependencies().done();
            }
        });
    }

    open() {
        this.refreshUnpublishDependencies().done(() => this.centerMyself());

        super.open();
    }

    private refreshUnpublishDependencies(): wemQ.Promise<void> {

        this.getDependantList().clearItems();
        this.showLoadingSpinner();
        this.actionButton.setEnabled(false);

        return this.loadDescendantIds([CompareStatus.EQUAL,CompareStatus.NEWER,CompareStatus.PENDING_DELETE]).then(() => {
            this.loadDescendants(0, 20).
                then((items: ContentSummaryAndCompareStatus[]) => {
                    this.setDependantItems(items);

                    // do not set requested contents as they are never going to change

                    this.hideLoadingSpinner();
                    this.actionButton.setEnabled(true);
                }).finally(() => {
                    this.loadMask.hide();
                });
        });

    }

    private filterUnpublishableItems(items: ContentSummaryAndCompareStatus[]): ContentSummaryAndCompareStatus[] {
        return items.filter(item => {
            let status = item.getCompareStatus();
            return status == CompareStatus.EQUAL || status == CompareStatus.NEWER || status == CompareStatus.PENDING_DELETE;
        });
    }

    setDependantItems(items: ContentSummaryAndCompareStatus[]) {
        super.setDependantItems(this.filterUnpublishableItems(items));

        this.updateButtonCount("Unpublish", this.countTotal());
    }

    addDependantItems(items: ContentSummaryAndCompareStatus[]) {
        super.addDependantItems(this.filterUnpublishableItems(items));

        this.updateButtonCount("Unpublish", this.countTotal());
    }

    setContentToUnpublish(contents: ContentSummaryAndCompareStatus[]) {
        this.setIgnoreItemsChanged(true);
        this.setListItems(this.filterUnpublishableItems(contents));
        this.setIgnoreItemsChanged(false);
        return this;
    }

    private getContentToUnpublishIds(): ContentId[] {
        return this.getItemList().getItems().map(item => {
            return item.getContentId();
        })
    }


    private doUnpublish() {

        this.showLoadingSpinner();
        this.actionButton.setEnabled(false);

        var selectedIds = this.getContentToUnpublishIds();

        new UnpublishContentRequest().setIds(selectedIds).setIncludeChildren(true).send().then(
            (jsonResponse: JsonResponse<UnpublishContentJson>) => {
                this.close();
                UnpublishContentRequest.feedback(jsonResponse);
            }).finally(() => {
                this.hideLoadingSpinner();
                this.actionButton.setEnabled(true);
            });
    }
}

export class ContentUnpublishDialogAction extends Action {
    constructor() {
        super("Unpublish");
        this.setIconClass("unpublish-action");
    }
}
