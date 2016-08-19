import {ContentJson} from "../json/ContentJson";
import {AccessControlList} from "../../security/acl/AccessControlList";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {Content} from "../Content";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class ApplyContentPermissionsRequest extends ContentResourceRequest<ContentJson, Content> {

        private id: string;

        private permissions: AccessControlList;

        private inheritPermissions: boolean;

        private overwriteChildPermissions: boolean;

        constructor() {
            super();
            this.inheritPermissions = true;
            this.overwriteChildPermissions = false;
            this.setMethod("POST");
        }

        setId(id: string): ApplyContentPermissionsRequest {
            this.id = id;
            return this;
        }

        setPermissions(permissions: AccessControlList): ApplyContentPermissionsRequest {
            this.permissions = permissions;
            return this;
        }

        setInheritPermissions(inheritPermissions: boolean): ApplyContentPermissionsRequest {
            this.inheritPermissions = inheritPermissions;
            return this;
        }

        setOverwriteChildPermissions(overwriteChildPermissions: boolean): ApplyContentPermissionsRequest {
            this.overwriteChildPermissions = overwriteChildPermissions;
            return this;
        }

        getParams(): Object {
            return {
                contentId: this.id,
                permissions: this.permissions ? this.permissions.toJson() : undefined,
                inheritPermissions: this.inheritPermissions,
                overwriteChildPermissions: this.overwriteChildPermissions
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "applyPermissions");
        }

        sendAndParse(): wemQ.Promise<Content> {

            return this.send().then((response: JsonResponse<ContentJson>) => {
                return this.fromJsonToContent(response.getResult());
            });
        }

    }

