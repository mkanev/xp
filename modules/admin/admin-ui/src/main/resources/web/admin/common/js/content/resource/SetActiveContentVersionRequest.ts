import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {ContentId} from "../ContentId";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class SetActiveContentVersionRequest extends ContentResourceRequest<any, any> {

        private versionId: string;

        private contentId: ContentId;

        constructor(versionId: string, contentId: ContentId) {
            super();
            super.setMethod("POST");
            this.versionId = versionId;
            this.contentId = contentId;
        }

        getParams(): Object {
            return {
                versionId: this.versionId,
                contentId: this.contentId.toString()
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), 'setActiveVersion');
        }

        sendAndParse(): wemQ.Promise<ContentId> {

            return this.send().then((response: JsonResponse<any>) => {
                return new ContentId(response.getResult()["id"]);
            });
        }
    }
