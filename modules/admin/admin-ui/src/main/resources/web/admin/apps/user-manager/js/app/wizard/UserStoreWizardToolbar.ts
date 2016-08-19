import {Action} from "../../../../../common/js/ui/Action";
import {Toolbar} from "../../../../../common/js/ui/toolbar/Toolbar";

export interface UserStoreWizardToolbarParams {
    saveAction:Action;
    deleteAction:Action;
}

export class UserStoreWizardToolbar extends Toolbar {

    constructor(params: UserStoreWizardToolbarParams) {
        super();
        super.addAction(params.saveAction);
        super.addAction(params.deleteAction);
    }
}
