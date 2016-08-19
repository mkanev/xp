import {Application} from "../../../../../common/js/application/Application";
import {Action} from "../../../../../common/js/ui/Action";

import {ApplicationTreeGrid} from "./ApplicationTreeGrid";
import {StopApplicationEvent} from "./StopApplicationEvent";

export class StopApplicationAction extends Action {

    constructor(applicationTreeGrid: ApplicationTreeGrid) {
        super("Stop");
        this.setEnabled(false);
        this.onExecuted(() => {
            var applications: Application[] = applicationTreeGrid.getSelectedDataList();
            new StopApplicationEvent(applications).fire();
        });
    }
}
