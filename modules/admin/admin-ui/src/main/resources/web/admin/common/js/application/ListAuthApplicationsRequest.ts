import {Path} from "../rest/Path";
import {JsonResponse} from "../rest/JsonResponse";
import {Application} from "./Application";
import {ApplicationListResult} from "./ApplicationListResult";
import {ApplicationResourceRequest} from "./ApplicationResourceRequest";

export class ListAuthApplicationsRequest extends ApplicationResourceRequest<ApplicationListResult, Application[]> {

        constructor() {
            super();
            super.setMethod("GET");
        }

        getParams(): Object {
            return {};
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "getIdProviderApplications");
        }

        sendAndParse(): wemQ.Promise<Application[]> {
            return this.send().then((response: JsonResponse<ApplicationListResult>) => {
                return Application.fromJsonArray(response.getResult().applications);
            });
        }
    }
