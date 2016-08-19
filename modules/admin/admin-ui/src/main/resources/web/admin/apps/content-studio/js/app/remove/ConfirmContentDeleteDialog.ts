import {DeleteContentRequest} from "../../../../../common/js/content/resource/DeleteContentRequest";
import {CompareStatus} from "../../../../../common/js/content/CompareStatus";
import {ModalDialog} from "../../../../../common/js/ui/dialog/ModalDialog";
import {DialogButton} from "../../../../../common/js/ui/dialog/DialogButton";
import {Action} from "../../../../../common/js/ui/Action";
import {TextInput} from "../../../../../common/js/ui/text/TextInput";
import {ModalDialogHeader} from "../../../../../common/js/ui/dialog/ModalDialog";
import {Body} from "../../../../../common/js/dom/Body";
import {H6El} from "../../../../../common/js/dom/H6El";
import {DeleteContentResult} from "../../../../../common/js/content/resource/result/DeleteContentResult";
import {showError} from "../../../../../common/js/notify/MessageBus";
import {ValueChangedEvent} from "../../../../../common/js/ValueChangedEvent";
import {DivEl} from "../../../../../common/js/dom/DivEl";
import {SpanEl} from "../../../../../common/js/dom/SpanEl";

import {DeleteAction} from "../view/DeleteAction";

export interface ConfirmContentDeleteDialogConfig {

    totalItemsToDelete: number;

    deleteRequest: DeleteContentRequest;

    yesCallback: (exclude?: CompareStatus[]) => void;
}

export class ConfirmContentDeleteDialog extends ModalDialog {

    private confirmDeleteButton: DialogButton;

    private confirmDeleteAction: Action;

    private input: TextInput;

    private deleteConfig: ConfirmContentDeleteDialogConfig;

    constructor(deleteConfig: ConfirmContentDeleteDialogConfig) {
        super({
            title: new ModalDialogHeader("Confirm delete")
        });

        this.deleteConfig = deleteConfig;

        this.getEl().addClass("confirm-delete-dialog");

        this.addSubtitle();

        this.initConfirmDeleteAction();

        this.initConfirmationInput();

        this.initConfirmationBlock();

        this.addCancelButtonToBottom();
    }

    show() {
        Body.get().appendChild(this);
        super.show();
        this.input.giveFocus();
    }

    close() {
        super.close();
        this.remove();
    }

    private addSubtitle() {
        this.appendChildToTitle(new H6El("confirm-delete-subtitle").setHtml(
            "You are about to delete important content. This action cannot be undone."));
    }

    private initConfirmDeleteAction() {
        this.confirmDeleteAction = new Action("Confirm");

        this.confirmDeleteAction.setIconClass("confirm-delete-action");
        this.confirmDeleteAction.setEnabled(false);
        this.confirmDeleteAction.onExecuted(() => {

            if (!!this.deleteConfig.yesCallback) {
                !!this.deleteConfig.deleteRequest.getParams()["deleteOnline"]
                    ? this.deleteConfig.yesCallback([])
                    : this.deleteConfig.yesCallback();
            }

            this.deleteConfig.deleteRequest.sendAndParse().then((result: DeleteContentResult) => {
                this.close();
                DeleteAction.showDeleteResult(result);
            }).catch((reason: any) => {
                if (reason && reason.message) {
                    showError(reason.message);
                } else {
                    showError('Content could not be deleted.');
                }
            }).finally(() => {

            }).done();
        });

        this.confirmDeleteButton = this.addAction(this.confirmDeleteAction, true, true);
    }

    private initConfirmationInput() {
        this.input = TextInput.middle("text").setForbiddenCharsRe(/[^0-9]/);
        this.input.onValueChanged((event: ValueChangedEvent) => {
            if (this.isInputEmpty()) {
                this.input.removeClass("invalid valid");
                this.confirmDeleteAction.setEnabled(false);
                return;
            }

            if (this.isCorrectNumberEntered()) {
                this.input.removeClass("invalid").addClass("valid");
                this.confirmDeleteAction.setEnabled(true);
                setTimeout(()=> {
                    this.confirmDeleteButton.giveFocus();
                }, 0);
            }
            else {
                this.input.removeClass("valid").addClass("invalid");
                this.confirmDeleteAction.setEnabled(false);
            }

        });

        this.input.onKeyUp((event: KeyboardEvent) => {
            if (event.keyCode === 27) {
                this.getCancelAction().execute();
            }
        });
    }

    private initConfirmationBlock() {
        var confirmationDiv = new DivEl("confirm-delete-block");

        confirmationDiv.appendChildren(
            new SpanEl("confirm-delete-text").setHtml("Enter "),
            new SpanEl("confirm-delete-text-number").setHtml("" + this.deleteConfig.totalItemsToDelete),
            new SpanEl("confirm-delete-text").setHtml(" in the field and click Confirm: "),
            this.input);

        this.appendChildToContentPanel(confirmationDiv);
    }

    private isInputEmpty(): boolean {
        return this.input.getValue() == "";
    }

    private isCorrectNumberEntered(): boolean {
        return this.input.getValue() == this.deleteConfig.totalItemsToDelete.toString();
    }
}