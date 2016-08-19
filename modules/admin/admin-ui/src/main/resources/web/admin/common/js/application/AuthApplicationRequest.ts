import {ApplicationJson} from "./json/ApplicationJson";
import {Path} from "../rest/Path";
import {JsonResponse} from "../rest/JsonResponse";
import {Application} from "./Application";
import {ApplicationKey} from "./ApplicationKey";
import {ApplicationResourceRequest} from "./ApplicationResourceRequest";

export class AuthApplicationRequest extends ApplicationResourceRequest<ApplicationJson, Application> {

        private applicationKey: ApplicationKey;

        constructor(applicationKey: ApplicationKey) {
            super();
            super.setMethod("GET");

            this.applicationKey = applicationKey;
        }

        getParams(): Object {
            return {
                applicationKey: this.applicationKey.toString()
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "getIdProvider");
        }

        sendAndParse(): wemQ.Promise<Application> {
            return this.send().then((response: JsonResponse<ApplicationJson>) => {
                return response.getResult() ? Application.fromJson(response.getResult()) : null;
            });
        }
    }
