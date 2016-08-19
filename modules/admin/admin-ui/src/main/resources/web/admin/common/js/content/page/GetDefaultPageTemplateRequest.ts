import {ContentJson} from "../json/ContentJson";
import {ContentId} from "../ContentId";
import {ContentTypeName} from "../../schema/content/ContentTypeName";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {PageTemplate} from "./PageTemplate";
import {PageTemplateResourceRequest} from "./PageTemplateResourceRequest";

export class GetDefaultPageTemplateRequest extends PageTemplateResourceRequest<ContentJson, PageTemplate> {

        private site: ContentId;

        private contentTypeName: ContentTypeName;

        constructor(site: ContentId, contentName: ContentTypeName) {
            super();
            this.setMethod("GET");
            this.site = site;
            this.contentTypeName = contentName;
        }

        getParams(): Object {
            return {
                siteId: this.site.toString(),
                contentTypeName: this.contentTypeName.toString()
            }
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "default");
        }

        sendAndParse(): wemQ.Promise<PageTemplate> {

            return this.send().then((response: JsonResponse<ContentJson>) => {

                if (response.hasResult()) {
                    return this.fromJsonToContent(response.getResult());
                }
                else {
                    return null;
                }
            });
        }
    }
