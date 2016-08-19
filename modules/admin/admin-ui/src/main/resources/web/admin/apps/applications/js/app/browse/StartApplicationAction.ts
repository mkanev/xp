import {Application} from "../../../../../common/js/application/Application";
import {Action} from "../../../../../common/js/ui/Action";

import {ApplicationTreeGrid} from "./ApplicationTreeGrid";
import {StartApplicationEvent} from "./StartApplicationEvent";

export class StartApplicationAction extends Action {

    constructor(applicationTreeGrid: ApplicationTreeGrid) {
        super("Start");
        this.setEnabled(false);
        this.onExecuted(() => {
            var applications: Application[] = applicationTreeGrid.getSelectedDataList();
            new StartApplicationEvent(applications).fire();
        });
    }
}
