import {AccessControlList} from "../../security/acl/AccessControlList";
import {ContentPermissionsJson as ContentsPermissionsEntryJson} from "../json/ContentPermissionsJson";
import {ContentAccessControlList} from "../../security/acl/ContentAccessControlList";
import {Permission} from "../../security/acl/Permission";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {ContentId} from "../ContentId";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class GetPermittedActionsRequest extends ContentResourceRequest<string[], Permission[]> {

        private contentIds: ContentId[] = [];

        private permissions: Permission[] = [];

        /*
         When no contentIds provided - looking for root permissions
         When no permissions provided - checking all possible permissions
         */

        constructor() {
            super();
            super.setMethod("POST");
        }

        addContentIds(...contentIds: ContentId[]): GetPermittedActionsRequest {
            this.contentIds.push(...contentIds);
            return this;
        }

        addPermissionsToBeChecked(...permissions: Permission[]): GetPermittedActionsRequest {
            this.permissions.push(...permissions);
            return this;
        }

        getParams(): Object {
            var fn = (contentId: ContentId) => {
                return contentId.toString();
            };
            var fn2 = (permission: Permission) => {
                return Permission[permission];
            };

            return {
                contentIds: this.contentIds.map(fn),
                permissions: this.permissions.map(fn2)
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "allowedActions");
        }

        sendAndParse(): wemQ.Promise<Permission[]> {

            return this.send().then((response: JsonResponse<string[]>) => {
                let result = [];

                response.getResult().forEach((entry: string) => {
                    result.push(Permission[entry]);
                });

                return result;
            });
        }
    }
