import {Path} from "../rest/Path";
import {JsonResponse} from "../rest/JsonResponse";
import {DeletePrincipalResult} from "./DeletePrincipalResult";
import {DeletePrincipalResultsJson} from "./DeletePrincipalResultsJson";
import {PrincipalKey} from "./PrincipalKey";
import {SecurityResourceRequest} from "./SecurityResourceRequest";

export class DeletePrincipalRequest extends SecurityResourceRequest<DeletePrincipalResultsJson, DeletePrincipalResult[]> {

        private keys: PrincipalKey[];

        constructor() {
            super();
            super.setMethod("POST");
        }

        setKeys(keys: PrincipalKey[]): DeletePrincipalRequest {
            this.keys = keys.slice(0);
            return this;
        }

        getParams(): Object {
            return {
                keys: this.keys.map((memberKey) => memberKey.toString())
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), 'principals', 'delete');
        }

        sendAndParse(): wemQ.Promise<DeletePrincipalResult[]> {

            return this.send().then((response: JsonResponse<DeletePrincipalResultsJson>) => {
                return response.getResult().results.map((resultJson) => DeletePrincipalResult.fromJson(resultJson));
            });
        }

    }
