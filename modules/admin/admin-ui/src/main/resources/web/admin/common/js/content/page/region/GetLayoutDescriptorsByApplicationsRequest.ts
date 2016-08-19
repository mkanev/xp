import {ApplicationKey} from "../../../application/ApplicationKey";
import {Path} from "../../../rest/Path";
import {GetLayoutDescriptorsByApplicationRequest} from "./GetLayoutDescriptorsByApplicationRequest";
import {LayoutDescriptor} from "./LayoutDescriptor";
import {LayoutDescriptorsResourceRequest} from "./LayoutDescriptorsResourceRequest";

export class GetLayoutDescriptorsByApplicationsRequest extends LayoutDescriptorsResourceRequest {

        private applicationKeys: ApplicationKey[];

        constructor(applicationKey: ApplicationKey[]) {
            super();
            this.applicationKeys = applicationKey;
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


        sendAndParse(): wemQ.Promise<LayoutDescriptor[]> {

            var promises = this.applicationKeys.map((applicationKey: ApplicationKey) => new GetLayoutDescriptorsByApplicationRequest(applicationKey).sendAndParse());

            return wemQ.all(promises).
                then((results: LayoutDescriptor[][]) => {
                    var all: LayoutDescriptor[] = [];
                    results.forEach((result: LayoutDescriptor[]) => {
                        Array.prototype.push.apply(all, result);
                    });
                    return all;
                });
        }
    }
