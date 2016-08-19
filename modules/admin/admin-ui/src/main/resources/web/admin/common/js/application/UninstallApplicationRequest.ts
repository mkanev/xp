import {Path} from "../rest/Path";
import {JsonResponse} from "../rest/JsonResponse";
import {ApplicationKey} from "./ApplicationKey";
import {ApplicationResourceRequest} from "./ApplicationResourceRequest";

export class UninstallApplicationRequest extends ApplicationResourceRequest<void, void> {

        private applicationKeys: ApplicationKey[];

        constructor(applicationKeys: ApplicationKey[]) {
            super();
            super.setMethod("POST");
            this.applicationKeys = applicationKeys;
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "uninstall");
        }

        getParams(): Object {
            return {
                key: ApplicationKey.toStringArray(this.applicationKeys)
            };
        }

        sendAndParse(): wemQ.Promise<void> {
            return this.send().then((response: JsonResponse<void>) => {

            });
        }
    }
