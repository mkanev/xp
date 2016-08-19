import {Path} from "../rest/Path";
import {JsonResponse} from "../rest/JsonResponse";
import {DeleteUserStoreResult} from "./DeleteUserStoreResult";
import {DeleteUserStoreResultsJson} from "./DeleteUserStoreResultsJson";
import {SecurityResourceRequest} from "./SecurityResourceRequest";
import {UserStoreKey} from "./UserStoreKey";

export class DeleteUserStoreRequest extends SecurityResourceRequest<DeleteUserStoreResultsJson, DeleteUserStoreResult[]> {

        private keys: UserStoreKey[];

        constructor() {
            super();
            super.setMethod("POST");
        }

        setKeys(keys: UserStoreKey[]): DeleteUserStoreRequest {
            this.keys = keys.slice(0);
            return this;
        }

        getParams(): Object {
            return {
                keys: this.keys.map((memberKey) => memberKey.toString())
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), 'userstore', 'delete');
        }

        sendAndParse(): wemQ.Promise<DeleteUserStoreResult[]> {
            return this.send().then((response: JsonResponse<DeleteUserStoreResultsJson>) => {
                return response.getResult().results.map((resultJson) => DeleteUserStoreResult.fromJson(resultJson));
            });
        }

    }
