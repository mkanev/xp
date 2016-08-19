import {AccessControlList} from "../../security/acl/AccessControlList";
import {EffectivePermissionJson} from "../json/EffectivePermissionJson";
import {EffectivePermission} from "../../ui/security/acl/EffectivePermission";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {ContentId} from "../ContentId";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class GetEffectivePermissionsRequest extends ContentResourceRequest<EffectivePermissionJson[], EffectivePermission[]> {

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
            return Path.fromParent(super.getResourcePath(), "effectivePermissions");
        }

        sendAndParse(): wemQ.Promise<EffectivePermission[]> {

            return this.send().then((response: JsonResponse<EffectivePermissionJson[]>) => {
                if (response.getJson()) {
                    return response.getJson().map((json) => {
                        return EffectivePermission.fromJson(json);
                    });
                }
                return null;
            });
        }
    }
