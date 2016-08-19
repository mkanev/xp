import {Path} from "../rest/Path";
import {JsonResponse} from "../rest/JsonResponse";
import {SecurityResourceRequest} from "./SecurityResourceRequest";
import {SyncUserStoreResult} from "./SyncUserStoreResult";
import {SyncUserStoreResultsJson} from "./SyncUserStoreResultsJson";
import {UserStoreKey} from "./UserStoreKey";

export class SyncUserStoreRequest extends SecurityResourceRequest<SyncUserStoreResultsJson, SyncUserStoreResult[]> {

        private keys: UserStoreKey[];

        constructor() {
            super();
            super.setMethod("POST");
        }

        setKeys(keys: UserStoreKey[]): SyncUserStoreRequest {
            this.keys = keys.slice(0);
            return this;
        }

        getParams(): Object {
            return {
                keys: this.keys.map((memberKey) => memberKey.toString())
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), 'userstore', 'sync');
        }

        sendAndParse(): wemQ.Promise<SyncUserStoreResult[]> {
            return this.send().then((response: JsonResponse<SyncUserStoreResultsJson>) => {
                return response.getResult().results.map((resultJson) => SyncUserStoreResult.fromJson(resultJson));
            });
        }

    }
