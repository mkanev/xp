import {User} from "../../../../../common/js/security/User";
import {Principal} from "../../../../../common/js/security/Principal";
import {PasswordGenerator} from "../../../../../common/js/ui/text/PasswordGenerator";
import {DivEl} from "../../../../../common/js/dom/DivEl";
import {LabelEl} from "../../../../../common/js/dom/LabelEl";
import {FormItemBuilder} from "../../../../../common/js/ui/form/FormItem";
import {Validators} from "../../../../../common/js/ui/form/Validators";
import {FormItem} from "../../../../../common/js/ui/form/FormItem";
import {Fieldset} from "../../../../../common/js/ui/form/Fieldset";
import {Button} from "../../../../../common/js/ui/button/Button";
import {WizardStepForm} from "../../../../../common/js/app/wizard/WizardStepForm";
import {Form} from "../../../../../common/js/ui/form/Form";
import {ValidityChangedEvent} from "../../../../../common/js/ValidityChangedEvent";
import {WizardStepValidityChangedEvent} from "../../../../../common/js/app/wizard/WizardStepValidityChangedEvent";

import {OpenChangePasswordDialogEvent} from "./OpenChangePasswordDialogEvent";

export class UserPasswordWizardStepForm extends WizardStepForm {

    private password: PasswordGenerator;

    private changePasswordButton: Button;

    private createPasswordFormItem: FormItem;

    private updatePasswordFormItem: FormItem;

    private principal: Principal;

    private fieldSet: Fieldset;


    constructor() {
        super();

        this.password = new PasswordGenerator();

        this.changePasswordButton = new Button("Change Password");
        this.changePasswordButton.addClass("change-password-button");

        this.createPasswordFormItem = new FormItemBuilder(this.password).setLabel('Password').setValidator(Validators.required).build();

        this.updatePasswordFormItem = new FormItemBuilder(this.changePasswordButton).setLabel('Password').build();

        this.fieldSet = new Fieldset();
        this.fieldSet.add(this.createPasswordFormItem);
        this.fieldSet.add(this.updatePasswordFormItem);

        var passwordForm = new Form().add(this.fieldSet);

        passwordForm.onValidityChanged((event: ValidityChangedEvent) => {
            this.notifyValidityChanged(new WizardStepValidityChangedEvent(event.isValid()));
        });

        this.changePasswordButton.onClicked(() => {
            new OpenChangePasswordDialogEvent(this.principal).fire();
        });
        this.updatePasswordFormItem.setVisible(false);
        this.appendChild(passwordForm);
    }

    layout(principal: Principal) {
        this.updatePrincipal(principal);
    }

    updatePrincipal(principal: Principal) {
        this.principal = principal;
        if (principal) {
            this.fieldSet.removeItem(this.createPasswordFormItem);
            this.updatePasswordFormItem.setVisible(true);
        }
    }

    isValid(): boolean {
        return !!this.principal || !!this.password.getValue();
    }

    getPassword(): string {
        return this.password.getValue();
    }

    giveFocus(): boolean {
        return this.password.giveFocus();
    }
}
