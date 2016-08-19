import {AccessControlList} from "../../security/acl/AccessControlList";
import {PermissionsJson} from "../json/PermissionsJson";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {ContentId} from "../ContentId";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class GetContentPermissionsByIdRequest extends ContentResourceRequest<PermissionsJson, AccessControlList> {

        private contentId: ContentId;

        constructor(contentId: ContentId) {
            super();
            super.setMethod("GET");
            this.contentId = contentId;
        }

        getParams(): Object {
            return {
                id: this.contentId.toString()
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "contentPermissions");
        }

        sendAndParse(): wemQ.Promise<AccessControlList> {

            return this.send().then((response: JsonResponse<PermissionsJson>) => {
                return AccessControlList.fromJson(response.getResult());
            });
        }
    }
