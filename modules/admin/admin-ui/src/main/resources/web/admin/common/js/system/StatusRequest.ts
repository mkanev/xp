import {ResourceRequest} from "../rest/ResourceRequest";
import {Path} from "../rest/Path";
import {JsonResponse} from "../rest/JsonResponse";
import {StatusJson} from "./StatusJson";
import {StatusResult} from "./StatusResult";

export class StatusRequest extends ResourceRequest<StatusJson, StatusResult> {

        getRequestPath(): Path {
            return Path.fromParent(super.getRestPath(), "status");
        }

        getParams(): Object {
            return {};
        }

        sendAndParse(): wemQ.Promise<StatusResult> {

            return this.send().then((response: JsonResponse<StatusJson>) => {
                return new StatusResult(response.getResult());
            });
        }
    }
