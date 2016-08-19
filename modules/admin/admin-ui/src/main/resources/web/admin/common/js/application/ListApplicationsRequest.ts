import {Path} from "../rest/Path";
import {JsonResponse} from "../rest/JsonResponse";
import {Application} from "./Application";
import {ApplicationListResult} from "./ApplicationListResult";
import {ApplicationResourceRequest} from "./ApplicationResourceRequest";

export class ListApplicationsRequest extends ApplicationResourceRequest<ApplicationListResult, Application[]> {

        private searchQuery: string;

        constructor() {
            super();
            super.setMethod("GET");
        }

        getParams(): Object {
            return {
                "query": this.searchQuery
            }
        }

        setSearchQuery(query: string): ListApplicationsRequest {
            this.searchQuery = query;
            return this;
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "list");
        }

        sendAndParse(): wemQ.Promise<Application[]> {

            return this.send().then((response: JsonResponse<ApplicationListResult>) => {
                return Application.fromJsonArray(response.getResult().applications);
            });
        }
    }
