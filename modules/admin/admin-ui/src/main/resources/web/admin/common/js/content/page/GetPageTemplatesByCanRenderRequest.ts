import {ContentJson} from "../json/ContentJson";
import {ListContentResult} from "../resource/result/ListContentResult";
import {ContentId} from "../ContentId";
import {ContentTypeName} from "../../schema/content/ContentTypeName";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {PageTemplate} from "./PageTemplate";
import {PageTemplateResourceRequest} from "./PageTemplateResourceRequest";

export class GetPageTemplatesByCanRenderRequest extends PageTemplateResourceRequest<ListContentResult<ContentJson>, PageTemplate[]> {

        private site: ContentId;

        private contentTypeName: ContentTypeName;

        constructor(site: ContentId, contentTypeName: ContentTypeName) {
            super();
            this.setMethod("GET");
            this.site = site;
            this.contentTypeName = contentTypeName;
        }

        getParams(): Object {
            return {
                siteId: this.site.toString(),
                contentTypeName: this.contentTypeName.toString()
            }
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "listByCanRender");
        }

        sendAndParse(): wemQ.Promise<PageTemplate[]> {

            return this.send().then((response: JsonResponse<ListContentResult<ContentJson>>) => {
                return response.getResult().contents.map((contentJson: ContentJson) => {
                    return this.fromJsonToContent(contentJson);
                });
            });
        }
    }
