import {Application} from "../../../../../common/js/application/Application";
import {Action} from "../../../../../common/js/ui/Action";

import {ApplicationTreeGrid} from "./ApplicationTreeGrid";
import {InstallAppPromptEvent} from "../installation/InstallAppPromptEvent";

export class InstallApplicationAction extends Action {

    constructor(applicationTreeGrid: ApplicationTreeGrid) {
        super("Install");
        this.setEnabled(false);
        this.onExecuted(() => {
            const installedApplications: Application[] = applicationTreeGrid.getRoot().getCurrentRoot().treeToList().map(
                (node) => node.getData());
            new InstallAppPromptEvent(installedApplications).fire();
        });
    }
}
