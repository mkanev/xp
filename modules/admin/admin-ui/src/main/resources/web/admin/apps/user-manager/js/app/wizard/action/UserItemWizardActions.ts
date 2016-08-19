import {Equitable} from "../../../../../../common/js/Equitable";
import {WizardActions} from "../../../../../../common/js/app/wizard/WizardActions";
import {Action} from "../../../../../../common/js/ui/Action";
import {SaveAction} from "../../../../../../common/js/app/wizard/SaveAction";
import {CloseAction} from "../../../../../../common/js/app/wizard/CloseAction";

import {UserItemWizardPanel} from "../UserItemWizardPanel";
import {DeleteUserItemAction} from "./DeleteUserItemAction";

export class UserItemWizardActions<USER_ITEM_TYPE extends Equitable> extends WizardActions<USER_ITEM_TYPE> {

    private save: Action;

    private close: Action;

    private delete: Action;

    constructor(wizardPanel: UserItemWizardPanel<USER_ITEM_TYPE>) {
        this.save = new SaveAction(wizardPanel);
        this.delete = new DeleteUserItemAction(wizardPanel);
        this.close = new CloseAction(wizardPanel);
        super(this.save, this.delete, this.close);
    }

    enableActionsForNew() {
        this.save.setEnabled(false);
        this.delete.setEnabled(false);
    }

    enableActionsForExisting() {
        this.save.setEnabled(true);
        this.delete.setEnabled(true);
    }

    getDeleteAction(): Action {
        return this.delete;
    }

    getSaveAction(): Action {
        return this.save;
    }

    getCloseAction(): Action {
        return this.close;
    }

}
