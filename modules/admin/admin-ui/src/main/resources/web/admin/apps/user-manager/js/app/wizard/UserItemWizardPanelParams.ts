import {Principal} from "../../../../../common/js/security/Principal";
import {Equitable} from "../../../../../common/js/Equitable";
import {AppBarTabId} from "../../../../../common/js/app/bar/AppBarTabId";
import {UserStoreKey} from "../../../../../common/js/security/UserStoreKey";

export class UserItemWizardPanelParams<USER_ITEM_TYPE extends Equitable> {

    tabId: AppBarTabId;

    userStoreKey: UserStoreKey;

    persistedPath: string;

    persistedItem: USER_ITEM_TYPE;

    setPersistedPath(value: string): UserItemWizardPanelParams<USER_ITEM_TYPE> {
        this.persistedPath = value;
        return this;
    }

    setPersistedItem(value: USER_ITEM_TYPE): UserItemWizardPanelParams<USER_ITEM_TYPE> {
        this.persistedItem = value;
        return this;
    }

    setUserStoreKey(value: UserStoreKey): UserItemWizardPanelParams<USER_ITEM_TYPE> {
        this.userStoreKey = value;
        return this;
    }

    setTabId(value: AppBarTabId): UserItemWizardPanelParams<USER_ITEM_TYPE> {
        this.tabId = value;
        return this;
    }

}
