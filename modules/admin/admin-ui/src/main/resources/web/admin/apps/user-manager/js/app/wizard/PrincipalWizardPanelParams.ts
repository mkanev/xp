import {Principal} from "../../../../../common/js/security/Principal";
import {PrincipalType} from "../../../../../common/js/security/PrincipalType";
import {UserStore} from "../../../../../common/js/security/UserStore";
import {PrincipalKey} from "../../../../../common/js/security/PrincipalKey";

import {UserItemWizardPanelParams} from "./UserItemWizardPanelParams";
export class PrincipalWizardPanelParams extends UserItemWizardPanelParams<Principal> {

    persistedType: PrincipalType;

    userStore: UserStore;

    parentOfSameType: boolean;

    principalKey: PrincipalKey;


    setPrincipalKey(value: PrincipalKey): PrincipalWizardPanelParams {
        this.principalKey = value;
        return this;
    }

    setPersistedType(value: PrincipalType): PrincipalWizardPanelParams {
        this.persistedType = value;
        return this;
    }

    setUserStore(value: UserStore): PrincipalWizardPanelParams {
        this.userStore = value;
        return this;
    }

    setParentOfSameType(value: boolean): PrincipalWizardPanelParams {
        this.parentOfSameType = value;
        return this;
    }
}
