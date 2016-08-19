import {Principal} from "../../../../../common/js/security/Principal";
import {PasswordGenerator} from "../../../../../common/js/ui/text/PasswordGenerator";
import {DialogButton} from "../../../../../common/js/ui/dialog/DialogButton";
import {FormItemBuilder} from "../../../../../common/js/ui/form/FormItem";
import {Validators} from "../../../../../common/js/ui/form/Validators";
import {ModalDialog} from "../../../../../common/js/ui/dialog/ModalDialog";
import {H6El} from "../../../../../common/js/dom/H6El";
import {ModalDialogHeader} from "../../../../../common/js/ui/dialog/ModalDialog";
import {Fieldset} from "../../../../../common/js/ui/form/Fieldset";
import {Form} from "../../../../../common/js/ui/form/Form";
import {Action} from "../../../../../common/js/ui/Action";
import {SetUserPasswordRequest} from "../../../../../common/js/security/SetUserPasswordRequest";
import {showFeedback} from "../../../../../common/js/notify/MessageBus";
import {Body} from "../../../../../common/js/dom/Body";

import {OpenChangePasswordDialogEvent} from "./OpenChangePasswordDialogEvent";

export class ChangeUserPasswordDialog extends ModalDialog {

    private password: PasswordGenerator;

    private principal: Principal;

    private userPath: H6El;

    private changePasswordButton: DialogButton;

    constructor() {
        super({
            title: new ModalDialogHeader("Change password")
        });

        this.getEl().addClass("change-password-dialog");

        this.userPath = new H6El().addClass("user-path");
        var descMessage = new H6El().addClass("desc-message").setHtml("Password will be updated immediately after finishing");

        this.appendChildToContentPanel(this.userPath);
        this.appendChildToContentPanel(descMessage);

        this.password = new PasswordGenerator();
        this.password.onInput(() => this.toggleChangePasswordButton());
        this.password.onValidityChanged(() => this.toggleChangePasswordButton());

        this.onShown(() => this.toggleChangePasswordButton());

        var passwordFormItem = new FormItemBuilder(this.password).setLabel('Password').setValidator(Validators.required).build();

        var fieldSet = new Fieldset();
        fieldSet.add(passwordFormItem);

        var form = new Form().add(fieldSet);

        this.appendChildToContentPanel(form);
        this.initializeActions();

        OpenChangePasswordDialogEvent.on((event) => {
            this.principal = event.getPrincipal();
            this.userPath.setHtml(this.principal.getKey().toPath());
            this.open();
        });

        this.addCancelButtonToBottom();
    }

    private initializeActions() {

        this.changePasswordButton = this.addAction(new Action("Change Password", "").onExecuted(() => {
            new SetUserPasswordRequest().setKey(this.principal.getKey()).setPassword(
                this.password.getValue()).sendAndParse().then((result) => {
                showFeedback('Password was changed!');
                this.close();
            });
        }));
        this.changePasswordButton.setEnabled(false);
    }

    private toggleChangePasswordButton() {
        if (this.password.getValue().length == 0) {
            this.changePasswordButton.setEnabled(false);
        } else {
            this.changePasswordButton.setEnabled(true);
        }
    }

    open() {
        super.open();
    }

    show() {
        Body.get().appendChild(this);
        super.show();
    }

    close() {
        this.password.setValue("");
        super.close();
        this.remove();
    }

    getPrincipal(): Principal {
        return this.principal;
    }

}
