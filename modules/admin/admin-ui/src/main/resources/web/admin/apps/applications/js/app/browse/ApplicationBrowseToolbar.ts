import {Toolbar} from "../../../../../common/js/ui/toolbar/Toolbar";

import {ApplicationBrowseActions} from "./ApplicationBrowseActions";

export class ApplicationBrowseToolbar extends Toolbar {

    constructor(actions: ApplicationBrowseActions) {
        super();
        super.addAction(actions.INSTALL_APPLICATION);
        super.addAction(actions.UNINSTALL_APPLICATION);
        super.addAction(actions.START_APPLICATION);
        super.addAction(actions.STOP_APPLICATION);
    }
}
