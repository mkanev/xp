import {ApplicationKey} from "../../../application/ApplicationKey";
import {DescriptorKey} from "../DescriptorKey";
import {Path} from "../../../rest/Path";
import {DefaultErrorHandler} from "../../../DefaultErrorHandler";
import {GetPartDescriptorsByApplicationRequest} from "./GetPartDescriptorsByApplicationRequest";
import {PartDescriptor} from "./PartDescriptor";
import {PartDescriptorJson} from "./PartDescriptorJson";
import {PartDescriptorResourceRequest} from "./PartDescriptorResourceRequest";

export class GetPartDescriptorByKeyRequest extends PartDescriptorResourceRequest<PartDescriptorJson,PartDescriptor> {

        private key: DescriptorKey;

        constructor(key: DescriptorKey) {
            super();
            this.key = key;
        }

        setKey(key: DescriptorKey) {
            this.key = key;
        }

        getParams(): Object {
            throw new Error("Unexpected call");
        }

        getRequestPath(): Path {
            throw new Error("Unexpected call");
        }

        sendAndParse(): wemQ.Promise<PartDescriptor> {
            var deferred = wemQ.defer<PartDescriptor>();

            new GetPartDescriptorsByApplicationRequest(this.key.getApplicationKey()).sendAndParse().then((descriptors: PartDescriptor[]) => {
                descriptors.forEach((descriptor: PartDescriptor) => {
                    if (this.key.equals(descriptor.getKey())) {
                        deferred.resolve(descriptor);
                    }
                });
            }).catch((reason: any) => {
                DefaultErrorHandler.handle(reason);
            }).done();

            return deferred.promise;
        }
    }
