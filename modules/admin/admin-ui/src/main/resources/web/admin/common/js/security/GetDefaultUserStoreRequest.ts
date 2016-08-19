import {Path} from "../rest/Path";
import {JsonResponse} from "../rest/JsonResponse";
import {SecurityResourceRequest} from "./SecurityResourceRequest";
import {UserStore} from "./UserStore";
import {UserStoreJson} from "./UserStoreJson";

export class GetDefaultUserStoreRequest extends SecurityResourceRequest<UserStoreJson, UserStore> {

        constructor() {
            super();
            super.setMethod("GET");
        }

        getParams(): Object {
            return null;
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), 'userstore/default');
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
