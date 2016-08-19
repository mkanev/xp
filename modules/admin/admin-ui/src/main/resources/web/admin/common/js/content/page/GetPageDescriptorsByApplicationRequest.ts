import {ApplicationKey} from "../../application/ApplicationKey";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {PageDescriptor} from "./PageDescriptor";
import {PageDescriptorResourceRequest} from "./PageDescriptorResourceRequest";
import {PageDescriptorsJson} from "./PageDescriptorsJson";

export class GetPageDescriptorsByApplicationRequest extends PageDescriptorResourceRequest<PageDescriptorsJson, PageDescriptor[]> {

        private applicationKey: ApplicationKey;

        constructor(applicationKey: ApplicationKey) {
            super();
            super.setMethod("GET");
            this.applicationKey = applicationKey;
        }

        getParams(): Object {
            return {
                applicationKey: this.applicationKey.toString()
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "list", "by_application");
        }

        sendAndParse(): wemQ.Promise<PageDescriptor[]> {

            var cached = this.cache.getByApplication(this.applicationKey);
            if (cached) {
                return wemQ(cached);
            }
            else {
                return this.send().then((response: JsonResponse<PageDescriptorsJson>) => {
                    return this.fromJsonToPageDescriptors(response.getResult());
                });
            }
        }
    }
