import {ConfirmationDialog} from "../../../../../common/js/ui/dialog/ConfirmationDialog";
import {Form} from "../../../../../common/js/form/Form";
import {FormContext} from "../../../../../common/js/form/FormContext";
import {FormView} from "../../../../../common/js/form/FormView";
import {PropertyTree} from "../../../../../common/js/data/PropertyTree";
import {WizardStepValidityChangedEvent} from "../../../../../common/js/app/wizard/WizardStepValidityChangedEvent";
import {WizardStepForm} from "../../../../../common/js/app/wizard/WizardStepForm";
import {FormValidityChangedEvent} from "../../../../../common/js/form/FormValidityChangedEvent";
import {ValidationRecording} from "../../../../../common/js/form/ValidationRecording";

export class ContentWizardStepForm extends WizardStepForm {

    private formContext: FormContext;

    private form: Form;

    private formView: FormView;

    private data: PropertyTree;

    constructor() {
        super();
    }

    update(data: PropertyTree, unchangedOnly: boolean = true): wemQ.Promise<void> {
        this.data = data;
        return this.formView.update(data.getRoot(), unchangedOnly);
    }

    layout(formContext: FormContext, data: PropertyTree, form: Form): wemQ.Promise<void> {

        this.formContext = formContext;
        this.form = form;
        this.data = data;
        return this.doLayout(form, data).then(() => {
            if (form.getFormItems().length === 0) {
                this.hide();
            }
        });
    }

    private doLayout(form: Form, data: PropertyTree): wemQ.Promise<void> {

        this.formView = new FormView(this.formContext, form, data.getRoot());
        return this.formView.layout().then(() => {

            this.formView.onFocus((event) => {
                this.notifyFocused(event);
            });
            this.formView.onBlur((event) => {
                this.notifyBlurred(event);
            });

            this.appendChild(this.formView);

            this.formView.onValidityChanged((event: FormValidityChangedEvent) => {
                this.previousValidation = event.getRecording();
                this.notifyValidityChanged(new WizardStepValidityChangedEvent(event.isValid()));
            });
        });
    }

    public validate(silent?: boolean): ValidationRecording {
        return this.formView.validate(silent);
    }

    public displayValidationErrors(display: boolean) {
        this.formView.displayValidationErrors(display);
    }

    getForm(): Form {
        return this.form;
    }

    getFormView(): FormView {
        return this.formView;
    }

    getData(): PropertyTree {

        return this.data;
    }

    giveFocus(): boolean {
        return this.formView.giveFocus();
    }
}
