import {ApplicationKey} from "../../../application/ApplicationKey";
import {Path} from "../../../rest/Path";
import {GetPartDescriptorsByApplicationRequest} from "./GetPartDescriptorsByApplicationRequest";
import {PartDescriptor} from "./PartDescriptor";
import {PartDescriptorsResourceRequest} from "./PartDescriptorsResourceRequest";

export class GetPartDescriptorsByApplicationsRequest extends PartDescriptorsResourceRequest {

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

        sendAndParse(): wemQ.Promise<PartDescriptor[]> {

            var promises = this.applicationKeys.map((applicationKey: ApplicationKey) => new GetPartDescriptorsByApplicationRequest(applicationKey).sendAndParse());

            return wemQ.all(promises).then((results: PartDescriptor[][]) => {
                var all: PartDescriptor[] = [];
                results.forEach((result: PartDescriptor[]) => {
                    Array.prototype.push.apply(all, result);
                });
                return all;
            });
        }
    }
