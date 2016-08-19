import {ContentJson} from "../json/ContentJson";
import {Content} from "../Content";
import {ContentId} from "../ContentId";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {PageCUDRequest} from "./PageCUDRequest";
import {PageResourceRequest} from "./PageResourceRequest";

export class DeletePageRequest extends PageResourceRequest<ContentJson, Content> implements PageCUDRequest {

        private contentId: ContentId;

        constructor(contentId: ContentId) {
            super();
            super.setMethod("GET");
            this.contentId = contentId;
        }

        getParams(): Object {
            return {
                contentId: this.contentId.toString()
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "delete");
        }

        sendAndParse(): wemQ.Promise<Content> {

            return this.send().then((response: JsonResponse<ContentJson>) => {
                return response.isBlank() ? null : this.fromJsonToContent(response.getResult());
            });
        }
    }
