import {Action} from "../../../../../common/js/ui/Action";
import {Toolbar} from "../../../../../common/js/ui/toolbar/Toolbar";

export interface PrincipalWizardToolbarParams {
    saveAction:Action;
    deleteAction:Action;
}

export class PrincipalWizardToolbar extends Toolbar {

    constructor(params: PrincipalWizardToolbarParams) {
        super();
        super.addAction(params.saveAction);
        super.addAction(params.deleteAction);
        super.addGreedySpacer();
    }
}
