import {Action} from "../../../../../../common/js/ui/Action";

import {ShowLiveEditEvent} from "../ShowLiveEditEvent";
import {ContentWizardPanel} from "../ContentWizardPanel";

export class ShowLiveEditAction extends Action {

    constructor(wizard: ContentWizardPanel) {
        super("Live");

        this.setEnabled(false);
        this.setTitle("Show Page Editor");
        this.onExecuted(() => {
            wizard.showLiveEdit();
            new ShowLiveEditEvent().fire();
        });
    }
}
