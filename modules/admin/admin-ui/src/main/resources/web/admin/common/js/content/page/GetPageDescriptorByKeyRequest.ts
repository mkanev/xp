import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {DescriptorKey} from "./DescriptorKey";
import {PageDescriptor} from "./PageDescriptor";
import {PageDescriptorJson} from "./PageDescriptorJson";
import {PageDescriptorResourceRequest} from "./PageDescriptorResourceRequest";

export class GetPageDescriptorByKeyRequest extends PageDescriptorResourceRequest<PageDescriptorJson, PageDescriptor> {

        private key: DescriptorKey;

        constructor(key: DescriptorKey) {
            super();
            super.setMethod("GET");
            this.key = key;
        }

        getParams(): Object {
            return {
                key: this.key.toString()
            };
        }

        getRequestPath(): Path {
            return super.getResourcePath();
        }

        sendAndParse(): wemQ.Promise<PageDescriptor> {

            var pageDescriptor = this.cache.getByKey(this.key);
            if (pageDescriptor) {
                return wemQ(pageDescriptor);
            }
            else {
                return this.send().then((response: JsonResponse<PageDescriptorJson>) => {
                    pageDescriptor = this.fromJsonToPageDescriptor(response.getResult(), true);
                    return pageDescriptor;
                });
            }
        }
    }
