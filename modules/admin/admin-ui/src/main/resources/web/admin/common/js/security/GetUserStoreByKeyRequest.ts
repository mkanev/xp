import {Path} from "../rest/Path";
import {JsonResponse} from "../rest/JsonResponse";
import {SecurityResourceRequest} from "./SecurityResourceRequest";
import {UserStore} from "./UserStore";
import {UserStoreJson} from "./UserStoreJson";
import {UserStoreKey} from "./UserStoreKey";

export class GetUserStoreByKeyRequest extends SecurityResourceRequest<UserStoreJson, UserStore> {

        private userStoreKey: UserStoreKey;

        constructor(userStoreKey: UserStoreKey) {
            super();
            super.setMethod("GET");
            this.userStoreKey = userStoreKey;
        }

        getParams(): Object {
            return {
                key: this.userStoreKey.toString()
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), 'userstore');
        }

        sendAndParse(): wemQ.Promise<UserStore> {
            return this.send().then((response: JsonResponse<UserStoreJson>) => {
                return this.fromJsonToUserStore(response.getResult());
            });
        }

        fromJsonToUserStore(json: UserStoreJson): UserStore {
            return UserStore.fromJson(json);
        }
    }
