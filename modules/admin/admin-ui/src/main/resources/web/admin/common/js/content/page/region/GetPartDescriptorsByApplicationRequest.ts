import {ApplicationKey} from "../../../application/ApplicationKey";
import {Path} from "../../../rest/Path";
import {JsonResponse} from "../../../rest/JsonResponse";
import {PartDescriptor} from "./PartDescriptor";
import {PartDescriptorsJson} from "./PartDescriptorsJson";
import {PartDescriptorsResourceRequest} from "./PartDescriptorsResourceRequest";

export class GetPartDescriptorsByApplicationRequest extends PartDescriptorsResourceRequest {

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

        sendAndParse(): wemQ.Promise<PartDescriptor[]> {

            var cached = this.cache.getByApplication(this.applicationKey);
            if (cached) {
                return wemQ(cached);
            }
            else {
                return this.send().then((response: JsonResponse<PartDescriptorsJson>) => {
                    return this.fromJsonToPartDescriptors(response.getResult());
                });
            }
        }
    }
