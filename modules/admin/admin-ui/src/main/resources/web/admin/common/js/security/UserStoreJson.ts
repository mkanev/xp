import {UserStoreAccessControlEntryJson} from "./acl/UserStoreAccessControlEntryJson";
import {AuthConfigJson} from "./AuthConfigJson";

export interface UserStoreJson {

        displayName: string;
        key: string;
        description?: string;
        authConfig?: AuthConfigJson;
        idProviderMode: string;
        permissions?: UserStoreAccessControlEntryJson[];
    }
