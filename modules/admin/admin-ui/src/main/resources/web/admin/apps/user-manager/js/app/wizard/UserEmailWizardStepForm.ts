import {Principal} from "../../../../../common/js/security/Principal";
import {EmailInput} from "../../../../../common/js/ui/text/EmailInput";
import {FormItemBuilder} from "../../../../../common/js/ui/form/FormItem";
import {Validators} from "../../../../../common/js/ui/form/Validators";
import {DivEl} from "../../../../../common/js/dom/DivEl";
import {LabelEl} from "../../../../../common/js/dom/LabelEl";
import {WizardStepForm} from "../../../../../common/js/app/wizard/WizardStepForm";
import {UserStoreKey} from "../../../../../common/js/security/UserStoreKey";
import {Fieldset} from "../../../../../common/js/ui/form/Fieldset";
import {Form} from "../../../../../common/js/ui/form/Form";
import {FormView} from "../../../../../common/js/form/FormView";
import {ValidityChangedEvent} from "../../../../../common/js/ValidityChangedEvent";
import {WizardStepValidityChangedEvent} from "../../../../../common/js/app/wizard/WizardStepValidityChangedEvent";

export class UserEmailWizardStepForm extends WizardStepForm {

    private email: EmailInput;

    private userStoreKey: UserStoreKey;

    constructor(userStoreKey: UserStoreKey) {
        super();

        this.userStoreKey = userStoreKey;
        this.email = new EmailInput();
        this.email.setUserStoreKey(this.userStoreKey);

        var emailFormItem = new FormItemBuilder(this.email).setLabel('Email').setValidator(Validators.required).build();

        var fieldSet = new Fieldset();
        fieldSet.add(emailFormItem);

        var form = new Form(FormView.VALIDATION_CLASS).add(fieldSet);

        form.onFocus((event) => {
            this.notifyFocused(event);
        });
        form.onBlur((event) => {
            this.notifyBlurred(event);
        });

        form.onValidityChanged((event: ValidityChangedEvent) => {
            this.notifyValidityChanged(new WizardStepValidityChangedEvent(event.isValid()));
            emailFormItem.toggleClass("invalid", !event.isValid());
        });

        this.appendChild(form);
    }

    layout(principal: Principal) {
        this.email.setValue(principal.asUser().getEmail());
        this.email.setName(principal.asUser().getEmail());
        this.email.setOriginEmail(principal.asUser().getEmail());
    }

    isValid(): boolean {
        return this.email.isValid();
    }

    getEmail(): string {
        return this.email.getValue();
    }

    giveFocus(): boolean {
        return this.email.giveFocus();
    }
}
