import {AccessControlList} from "../../security/acl/AccessControlList";
import {PermissionsJson} from "../json/PermissionsJson";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class GetContentRootPermissionsRequest extends ContentResourceRequest<PermissionsJson, AccessControlList> {

        constructor() {
            super();
            super.setMethod("GET");
        }

        getParams(): Object {
            return {};
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "rootPermissions");
        }

        sendAndParse(): wemQ.Promise<AccessControlList> {

            return this.send().then((response: JsonResponse<PermissionsJson>) => {
                return AccessControlList.fromJson(response.getResult());
            });
        }
    }
