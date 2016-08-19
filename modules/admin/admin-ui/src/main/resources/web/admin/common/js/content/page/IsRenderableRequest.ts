import {ContentId} from "../ContentId";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {PageTemplateResourceRequest} from "./PageTemplateResourceRequest";

export class IsRenderableRequest extends PageTemplateResourceRequest<boolean, boolean> {

        private contentId:ContentId;

        constructor(contentId:ContentId) {
            super();
            this.setMethod("GET");
            this.contentId = contentId;
        }

        setContentId(value:ContentId): IsRenderableRequest {
            this.contentId = value;
            return this;
        }

        getParams():Object {
            return {
                contentId: this.contentId.toString()
            }
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "isRenderable");
        }

        sendAndParse(): wemQ.Promise<boolean> {

            return this.send().then((response: JsonResponse<boolean>) => {
                return response.getResult();
            });
        }
    }
