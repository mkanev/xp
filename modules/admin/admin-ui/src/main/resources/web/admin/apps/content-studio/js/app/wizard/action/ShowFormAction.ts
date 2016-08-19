import {Action} from "../../../../../../common/js/ui/Action";

import {ShowContentFormEvent} from "../ShowContentFormEvent";
import {ContentWizardPanel} from "../ContentWizardPanel";

export class ShowFormAction extends Action {

    constructor(wizard: ContentWizardPanel) {
        super("Form");

        this.setEnabled(true);
        this.setTitle("Hide Page Editor");
        this.onExecuted(() => {
            wizard.showForm();
            new ShowContentFormEvent().fire();
        })
    }
}
