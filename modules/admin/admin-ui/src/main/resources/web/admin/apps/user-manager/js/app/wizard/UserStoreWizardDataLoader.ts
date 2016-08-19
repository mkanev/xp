import {UserStore} from "../../../../../common/js/security/UserStore";
import {UserStoreKey} from "../../../../../common/js/security/UserStoreKey";
import {GetUserStoreByKeyRequest} from "../../../../../common/js/security/GetUserStoreByKeyRequest";
import {GetDefaultUserStoreRequest} from "../../../../../common/js/security/GetDefaultUserStoreRequest";

import {UserStoreWizardPanelParams} from "./UserStoreWizardPanelParams";

export class UserStoreWizardDataLoader {

    userStore: UserStore;

    defaultUserStore: UserStore;

    loadData(params: UserStoreWizardPanelParams): wemQ.Promise<UserStoreWizardDataLoader> {
        if (!params.persistedItem && !params.userStoreKey) {
            return this.loadDataForNew(params);
        } else {
            return this.loadDataForEdit(params);
        }
    }

    private loadDataForNew(params: UserStoreWizardPanelParams): wemQ.Promise<UserStoreWizardDataLoader> {

        return this.loadDefaultUserStore().then((defaultUserStore: UserStore) => {

            this.defaultUserStore = defaultUserStore;

            return this;
        });
    }

    loadDataForEdit(params: UserStoreWizardPanelParams): wemQ.Promise<UserStoreWizardDataLoader> {

        return this.loadDataForNew(params).then((loader) => {

            return this.loadUserStoreToEdit(params).then((loadedUserStoreToEdit: UserStore) => {

                this.userStore = loadedUserStoreToEdit;

                return this;
            });
        });
    }

    private loadUserStoreToEdit(params: UserStoreWizardPanelParams): wemQ.Promise<UserStore> {
        if (!params.persistedItem && !!params.userStoreKey) {
            return new GetUserStoreByKeyRequest(params.userStoreKey).sendAndParse();
        } else {
            return wemQ(params.persistedItem);
        }
    }

    private loadDefaultUserStore(): wemQ.Promise<UserStore> {
        return new GetDefaultUserStoreRequest().sendAndParse();
    }

}
