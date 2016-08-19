import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {AuthResourceRequest} from "./AuthResourceRequest";
import {LogoutResultJson} from "./LogoutResultJson";

export class LogoutRequest extends AuthResourceRequest<LogoutResultJson, void> {

        constructor() {
            super();
            super.setMethod("POST");
        }

        getParams(): Object {
            return {};
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), 'logout');
        }

        sendAndParse(): wemQ.Promise<void> {

            return this.send().then((response: JsonResponse<LogoutResultJson>) => {
                return;
            });
        }

    }
