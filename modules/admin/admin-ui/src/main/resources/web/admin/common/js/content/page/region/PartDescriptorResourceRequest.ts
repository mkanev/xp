import {ResourceRequest} from "../../../rest/ResourceRequest";
import {Path} from "../../../rest/Path";
import {PartDescriptor} from "./PartDescriptor";
import {PartDescriptorBuilder} from "./PartDescriptor";
import {PartDescriptorCache} from "./PartDescriptorCache";
import {PartDescriptorJson} from "./PartDescriptorJson";

export class PartDescriptorResourceRequest<JSON_TYPE, PARSED_TYPE> extends ResourceRequest<JSON_TYPE, PARSED_TYPE> {

        private resourcePath: Path;

        cache: PartDescriptorCache;

        constructor() {
            super();
            this.cache = PartDescriptorCache.get();
            this.resourcePath = Path.fromParent(super.getRestPath(), "content", "page", "part", "descriptor");
        }

        getResourcePath(): Path {
            return this.resourcePath;
        }

        fromJsonToPartDescriptor(json: PartDescriptorJson): PartDescriptor {
            var partDescriptor = new PartDescriptorBuilder().fromJson(json).build();
            this.cache.put(partDescriptor);
            return  partDescriptor;
        }
    }
