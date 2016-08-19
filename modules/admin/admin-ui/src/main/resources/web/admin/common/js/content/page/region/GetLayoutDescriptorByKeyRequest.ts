import {ApplicationKey} from "../../../application/ApplicationKey";
import {DescriptorKey} from "../DescriptorKey";
import {Path} from "../../../rest/Path";
import {DefaultErrorHandler} from "../../../DefaultErrorHandler";
import {GetLayoutDescriptorsByApplicationRequest} from "./GetLayoutDescriptorsByApplicationRequest";
import {LayoutDescriptor} from "./LayoutDescriptor";
import {LayoutDescriptorJson} from "./LayoutDescriptorJson";
import {LayoutDescriptorResourceRequest} from "./LayoutDescriptorResourceRequest";

export class GetLayoutDescriptorByKeyRequest extends LayoutDescriptorResourceRequest<LayoutDescriptorJson,LayoutDescriptor> {

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

        sendAndParse(): wemQ.Promise<LayoutDescriptor> {
            var deferred = wemQ.defer<LayoutDescriptor>();

            new GetLayoutDescriptorsByApplicationRequest(this.key.getApplicationKey()).sendAndParse().then((descriptors: LayoutDescriptor[]) => {
                descriptors.forEach((descriptor: LayoutDescriptor) => {
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
