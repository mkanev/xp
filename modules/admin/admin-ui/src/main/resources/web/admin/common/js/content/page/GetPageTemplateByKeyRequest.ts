import {ContentJson} from "../json/ContentJson";
import {assertNotNull} from "../../util/Assert";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {PageTemplate} from "./PageTemplate";
import {PageTemplateKey} from "./PageTemplateKey";
import {PageTemplateResourceRequest} from "./PageTemplateResourceRequest";

export class GetPageTemplateByKeyRequest extends PageTemplateResourceRequest<ContentJson, PageTemplate> {

        private pageTemplateKey: PageTemplateKey;

        constructor(pageTemplateKey: PageTemplateKey) {
            super();
            super.setMethod("GET");
            this.pageTemplateKey = pageTemplateKey;
        }

        validate() {
            assertNotNull(this.pageTemplateKey, "pageTemplateKey cannot be null");
        }

        getParams(): Object {
            return {
                key: this.pageTemplateKey.toString()
            };
        }

        getRequestPath(): Path {
            return super.getResourcePath();
        }

        sendAndParse(): wemQ.Promise<PageTemplate> {

            return this.send().then((response: JsonResponse<ContentJson>) => {
                return this.fromJsonToContent(response.getResult());
            });
        }
    }
