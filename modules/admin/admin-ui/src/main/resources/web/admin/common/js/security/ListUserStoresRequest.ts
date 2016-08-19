import {Path} from "../rest/Path";
import {JsonResponse} from "../rest/JsonResponse";
import {SecurityResourceRequest} from "./SecurityResourceRequest";
import {UserStore} from "./UserStore";
import {UserStoreJson} from "./UserStoreJson";
import {UserStoreListResult} from "./UserStoreListResult";

export class ListUserStoresRequest extends SecurityResourceRequest<UserStoreListResult, UserStore[]> {

        constructor() {
            super();
            super.setMethod("GET");
        }

        getParams(): Object {
            return {};
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), 'userstore/list');
        }

        sendAndParse(): wemQ.Promise<UserStore[]> {

            return this.send().then((response: JsonResponse<UserStoreListResult>) => {
                return response.getResult().userStores.map((userStoreJson: UserStoreJson) => {
                    return this.fromJsonToUserStore(userStoreJson);
                });
            });
        }

        fromJsonToUserStore(json: UserStoreJson): UserStore {
            return UserStore.fromJson(json);
        }
    }
