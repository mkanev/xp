import {ApplicationKey} from "../../application/ApplicationKey";
import {Path} from "../../rest/Path";
import {GetPageDescriptorsByApplicationRequest} from "./GetPageDescriptorsByApplicationRequest";
import {PageDescriptor} from "./PageDescriptor";
import {PageDescriptorResourceRequest} from "./PageDescriptorResourceRequest";
import {PageDescriptorsJson} from "./PageDescriptorsJson";

export class GetPageDescriptorsByApplicationsRequest extends PageDescriptorResourceRequest<PageDescriptorsJson, PageDescriptor[]> {

        private applicationKeys: ApplicationKey[];

        constructor(applicationKeys: ApplicationKey[]) {
            super();
            this.applicationKeys = applicationKeys;
        }

        setApplicationKeys(applicationKeys: ApplicationKey[]) {
            this.applicationKeys = applicationKeys;
        }

        getParams(): Object {
            throw new Error("Unexpected call");
        }

        getRequestPath(): Path {
            throw new Error("Unexpected call");
        }

        sendAndParse(): wemQ.Promise<PageDescriptor[]> {

            var promises = this.applicationKeys.map((applicationKey: ApplicationKey) => new GetPageDescriptorsByApplicationRequest(applicationKey).sendAndParse());

            return wemQ.all(promises).then((results: PageDescriptor[][]) => {
                var all: PageDescriptor[] = [];
                results.forEach((descriptors: PageDescriptor[]) => {
                    Array.prototype.push.apply(all, descriptors);
                });
                return all;
            });
        }
    }
