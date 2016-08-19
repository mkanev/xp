import {Attachments} from "../attachment/Attachments";
import {AttachmentJson} from "../attachment/AttachmentJson";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {ContentId} from "../ContentId";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class GetContentAttachmentsRequest extends ContentResourceRequest<any, any> {

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
            return Path.fromParent(super.getResourcePath(), 'getAttachments');
        }

        sendAndParse(): wemQ.Promise<any> {
            return this.send().then((response: JsonResponse<AttachmentJson[]>) => {
                return response.getResult().length > 0 ? Attachments.create().fromJson(response.getResult()).build() : null;
            });
        }

    }
