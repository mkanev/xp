import {GetPrincipalsByUserStoreRequest} from "../../../../../../common/js/security/GetPrincipalsByUserStoreRequest";
import {PrincipalType} from "../../../../../../common/js/security/PrincipalType";
import {UserStore} from "../../../../../../common/js/security/UserStore";
import {UserStoreKey} from "../../../../../../common/js/security/UserStoreKey";

import {UserItemWizardActions} from "./UserItemWizardActions";
import {UserItemWizardPanel} from "../UserItemWizardPanel";

export class UserStoreWizardActions extends UserItemWizardActions<UserStore> {

    constructor(wizardPanel: UserItemWizardPanel<UserStore>) {
        super(wizardPanel);

        var userStore = wizardPanel.getPersistedItem();
        this.establishDeleteActionState(userStore ? userStore.getKey() : null);
    }

    establishDeleteActionState(key: UserStoreKey) {
        if (key) {
            UserStore.checkOnDeletable(key).then((result: boolean) => {
                this.getDeleteAction().setEnabled(result);
            });
        }
    }
}
