import {ContentJson} from "../json/ContentJson";
import {ListContentResult} from "../resource/result/ListContentResult";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {PageTemplate} from "./PageTemplate";
import {PageTemplateResourceRequest} from "./PageTemplateResourceRequest";

export class GetPageTemplatesRequest extends PageTemplateResourceRequest<ListContentResult<ContentJson>, PageTemplate[]> {

        constructor() {
            super();
            super.setMethod("GET");
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "list");
        }

        sendAndParse(): wemQ.Promise<PageTemplate[]> {

            return this.send().then((response: JsonResponse<ListContentResult<ContentJson>>) => {
                return response.getResult().contents.map((contentJson: ContentJson) => {
                    return this.fromJsonToContent(contentJson);
                });
            });
        }
    }
