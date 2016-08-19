import {Application} from "../../../../../common/js/application/Application";
import {Action} from "../../../../../common/js/ui/Action";

import {ApplicationTreeGrid} from "./ApplicationTreeGrid";
import {UninstallApplicationDialog} from "./UninstallApplicationDialog";

export class UninstallApplicationAction extends Action {

    constructor(applicationTreeGrid: ApplicationTreeGrid) {
        super("Uninstall");
        this.setEnabled(false);

        this.onExecuted(() => {
            var applications: Application[] = applicationTreeGrid.getSelectedDataList();
            new UninstallApplicationDialog(applications).open();
        });
    }
}
