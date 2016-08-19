import {WizardStepForm} from "../../../../../common/js/app/wizard/WizardStepForm";
import {TextInput} from "../../../../../common/js/ui/text/TextInput";
import {DivEl} from "../../../../../common/js/dom/DivEl";
import {LabelEl} from "../../../../../common/js/dom/LabelEl";
import {Principal} from "../../../../../common/js/security/Principal";
import {ObjectHelper} from "../../../../../common/js/ObjectHelper";
import {Role} from "../../../../../common/js/security/Role";
import {Group} from "../../../../../common/js/security/Group";

export class PrincipalDescriptionWizardStepForm extends WizardStepForm {

    private description: TextInput;

    constructor() {
        super();

        this.description = new TextInput("middle");
        this.description.onFocus((event) => {
            this.notifyFocused(event);
        });
        this.description.onBlur((event) => {
            this.notifyBlurred(event);
        });
        var formView = new DivEl("form-view"),
            inputView = new DivEl("input-view valid"),
            label = new LabelEl("Description", this.description, "input-label"),
            inputTypeView = new DivEl("input-type-view"),
            inputOccurrenceView = new DivEl("input-occurrence-view single-occurrence"),
            inputWrapper = new DivEl("input-wrapper");

        inputWrapper.appendChild(this.description);
        inputOccurrenceView.appendChild(inputWrapper);
        inputTypeView.appendChild(inputOccurrenceView);
        inputView.appendChild(label);
        inputView.appendChild(inputTypeView);
        formView.appendChild(inputView);

        this.appendChild(formView);
    }

    layout(principal: Principal) {
        if (ObjectHelper.iFrameSafeInstanceOf(principal, Role)
            || ObjectHelper.iFrameSafeInstanceOf(principal, Group)) {
            var description = principal.getDescription();
            this.description.setValue(!!description ? description : "");
        }
        else {
            this.description.setValue("");
        }

    }

    giveFocus(): boolean {
        return this.description.giveFocus();
    }

    getDescription(): string {
        return this.description.getValue();
    }
}
