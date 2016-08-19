import {ApplicationKey} from "../../../application/ApplicationKey";
import {Path} from "../../../rest/Path";
import {JsonResponse} from "../../../rest/JsonResponse";
import {LayoutDescriptor} from "./LayoutDescriptor";
import {LayoutDescriptorsJson} from "./LayoutDescriptorsJson";
import {LayoutDescriptorsResourceRequest} from "./LayoutDescriptorsResourceRequest";

export class GetLayoutDescriptorsByApplicationRequest extends LayoutDescriptorsResourceRequest {

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

        sendAndParse(): wemQ.Promise<LayoutDescriptor[]> {

            var cached = this.cache.getByApplication(this.applicationKey);
            if (cached) {
                return wemQ(cached);
            }
            else {
                return this.send().then((response: JsonResponse<LayoutDescriptorsJson>) => {
                    return this.fromJsonToLayoutDescriptors(response.getResult());
                });
            }
        }
    }
