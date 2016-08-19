import {Principal} from "../../../../../common/js/security/Principal";
import {FormItemBuilder} from "../../../../../common/js/ui/form/FormItem";
import {DivEl} from "../../../../../common/js/dom/DivEl";
import {LabelEl} from "../../../../../common/js/dom/LabelEl";
import {WizardStepForm} from "../../../../../common/js/app/wizard/WizardStepForm";
import {FormView} from "../../../../../common/js/form/FormView";
import {PropertySet} from "../../../../../common/js/data/PropertySet";
import {UserStore} from "../../../../../common/js/security/UserStore";
import {FormValidityChangedEvent} from "../../../../../common/js/form/FormValidityChangedEvent";
import {WizardStepValidityChangedEvent} from "../../../../../common/js/app/wizard/WizardStepValidityChangedEvent";
import {FormBuilder} from "../../../../../common/js/form/Form";
import {InputBuilder} from "../../../../../common/js/form/Input";
import {TextLine} from "../../../../../common/js/form/inputtype/text/TextLine";
import {OccurrencesBuilder} from "../../../../../common/js/form/Occurrences";
import {InputTypeName} from "../../../../../common/js/form/InputTypeName";
import {PropertyTree} from "../../../../../common/js/data/PropertyTree";
import {FormContext} from "../../../../../common/js/form/FormContext";
import {ValidationRecording} from "../../../../../common/js/form/ValidationRecording";
import {AuthConfig} from "../../../../../common/js/security/AuthConfig";
import {ApplicationKey} from "../../../../../common/js/application/ApplicationKey";

export class UserStoreWizardStepForm extends WizardStepForm {

    private formView: FormView;

    private propertySet: PropertySet;

    constructor() {
        super();
    }

    layout(userStore?: UserStore): wemQ.Promise<void> {

        this.formView = this.createFormView(userStore);

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

            var formViewValid = this.formView.isValid();
            this.notifyValidityChanged(new WizardStepValidityChangedEvent(formViewValid));
        });
    }

    private createFormView(userStore?: UserStore): FormView {
        var isSystemUserStore = (!!userStore && userStore.getKey().isSystem()).toString();
        var formBuilder = new FormBuilder().
            addFormItem(new InputBuilder().
                setName("description").
                setInputType(TextLine.getName()).
                setLabel("Description").
                setOccurrences(new OccurrencesBuilder().setMinimum(0).setMaximum(1).build()).
                setInputTypeConfig({}).
                setMaximizeUIInputWidth(true).
                build()).
            addFormItem(new InputBuilder().
                setName("authConfig").
                setInputType(new InputTypeName("AuthApplicationSelector", false)).setLabel("ID Provider").setOccurrences(
            new OccurrencesBuilder().setMinimum(0).setMaximum(1).build()).setInputTypeConfig(
            {readOnly: [{value: isSystemUserStore}]}).
                setMaximizeUIInputWidth(true).
                build());

        this.propertySet = new PropertyTree().getRoot();
        if (userStore) {
            this.propertySet.addString("description", userStore.getDescription());
            var authConfig = userStore.getAuthConfig();
            if (authConfig) {
                var authConfigPropertySet = new PropertySet();
                authConfigPropertySet.addString("applicationKey", authConfig.getApplicationKey().toString())
                authConfigPropertySet.addPropertySet("config", authConfig.getConfig().getRoot())
                this.propertySet.addPropertySet("authConfig", authConfigPropertySet);
            }
        }

        return new FormView(FormContext.create().build(), formBuilder.build(), this.propertySet);
    }

    public validate(silent?: boolean): ValidationRecording {
        return this.formView.validate(silent);
    }

    getAuthConfig(): AuthConfig {
        var authConfigPropertySet = this.propertySet.getPropertySet("authConfig");
        if (authConfigPropertySet) {
            var applicationKey = ApplicationKey.fromString(authConfigPropertySet.getString("applicationKey"));
            var config = new PropertyTree(authConfigPropertySet.getPropertySet("config"));
            return AuthConfig.create().
                setApplicationKey(applicationKey).
                setConfig(config).
                build();
        }

        return null;
    }

    getDescription(): string {
        return this.propertySet.getString("description");
    }

    giveFocus(): boolean {
        return this.formView.giveFocus();
    }
}
