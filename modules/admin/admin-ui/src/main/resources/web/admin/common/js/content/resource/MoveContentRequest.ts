import {MoveContentResultJson} from "../json/MoveContentResultJson";
import {MoveContentResult} from "./result/MoveContentResult";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {ContentId} from "../ContentId";
import {ContentIds} from "../ContentIds";
import {ContentPath} from "../ContentPath";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class MoveContentRequest extends ContentResourceRequest<MoveContentResultJson, MoveContentResult> {

        private ids: ContentIds;

        private parentPath: ContentPath;

        constructor(id: ContentIds, parentPath: ContentPath) {
            super();
            super.setMethod("POST");
            this.ids = id;
            this.parentPath = parentPath;
        }

        getParams(): Object {
            var fn = (contentId: ContentId) => {
                return contentId.toString();
            };
            return {
                contentIds: this.ids.map(fn),
                parentContentPath: !!this.parentPath ? this.parentPath.toString() : ""
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "move");
        }

        sendAndParse(): wemQ.Promise<MoveContentResult> {

            return this.send().then((response: JsonResponse<MoveContentResultJson>) => {
                return MoveContentResult.fromJson(response.getResult());
            });
        }
    }
