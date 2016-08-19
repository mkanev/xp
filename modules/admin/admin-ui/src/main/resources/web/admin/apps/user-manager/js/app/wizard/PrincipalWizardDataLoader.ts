import {Principal} from "../../../../../common/js/security/Principal";
import {PrincipalKey} from "../../../../../common/js/security/PrincipalKey";
import {PrincipalType} from "../../../../../common/js/security/PrincipalType";
import {UserStore} from "../../../../../common/js/security/UserStore";
import {WizardPanelParams} from "../../../../../common/js/app/wizard/WizardPanel";
import {GetPrincipalByKeyRequest} from "../../../../../common/js/security/GetPrincipalByKeyRequest";

import {PrincipalWizardPanelParams} from "./PrincipalWizardPanelParams";

export class PrincipalWizardDataLoader {

    principal: Principal;

    loadData(params: PrincipalWizardPanelParams): wemQ.Promise<PrincipalWizardDataLoader> {

        if (!params.persistedItem && !params.principalKey) {
            return this.loadDataForNew(params);

        } else {
            return this.loadDataForEdit(params);

        }
    }

    private loadDataForNew(params: PrincipalWizardPanelParams): wemQ.Promise<PrincipalWizardDataLoader> {

        return wemQ(this);
    }

    private loadDataForEdit(params: PrincipalWizardPanelParams): wemQ.Promise<PrincipalWizardDataLoader> {

        return this.loadDataForNew(params).then((loader) => {

            return this.loadPrincipalToEdit(params).then((loadedPrincipalToEdit: Principal) => {

                this.principal = loadedPrincipalToEdit;

                return this;
            });
        });
    }

    private loadPrincipalToEdit(params: PrincipalWizardPanelParams): wemQ.Promise<Principal> {
        if (!params.persistedItem && !!params.principalKey) {
            return new GetPrincipalByKeyRequest(params.principalKey).includeUserMemberships(true).sendAndParse();
        } else {
            return wemQ(params.persistedItem);
        }

    }

}
