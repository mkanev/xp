import {Action} from "../../../../../../common/js/ui/Action";

import {ShowSplitEditEvent} from "../ShowSplitEditEvent";
import {ContentWizardPanel} from "../ContentWizardPanel";

export class ShowSplitEditAction extends Action {

    constructor(wizard: ContentWizardPanel) {
        super("Split");

        this.setEnabled(false);
        this.onExecuted(() => {
            wizard.showSplitEdit();
            new ShowSplitEditEvent().fire();
        });
    }
}
