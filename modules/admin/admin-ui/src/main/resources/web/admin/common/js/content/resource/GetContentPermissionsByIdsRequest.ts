import {AccessControlList} from "../../security/acl/AccessControlList";
import {ContentPermissionsJson as ContentsPermissionsEntryJson} from "../json/ContentPermissionsJson";
import {ContentAccessControlList} from "../../security/acl/ContentAccessControlList";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {ContentId} from "../ContentId";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class GetContentPermissionsByIdsRequest extends ContentResourceRequest<ContentsPermissionsEntryJson[], ContentAccessControlList[]> {

        private contentIds: ContentId[];

        constructor(contentIds: ContentId[]) {
            super();
            super.setMethod("POST");
            this.contentIds = contentIds;
        }

        getParams(): Object {
            var fn = (contentId: ContentId) => {
                return contentId.toString();
            };
            return {
                contentIds: this.contentIds.map(fn)
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "contentPermissionsByIds");
        }

        sendAndParse(): wemQ.Promise<ContentAccessControlList[]> {

            return this.send().then((response: JsonResponse<ContentsPermissionsEntryJson[]>) => {
                let result = [];

                response.getResult().forEach((entry: ContentsPermissionsEntryJson) => {
                    result.push(ContentAccessControlList.fromJson(entry));
                });

                return result;
            });
        }
    }
