import {ResourceRequest} from "../../../rest/ResourceRequest";
import {Path} from "../../../rest/Path";
import {LayoutDescriptor} from "./LayoutDescriptor";
import {LayoutDescriptorBuilder} from "./LayoutDescriptor";
import {LayoutDescriptorCache} from "./LayoutDescriptorCache";
import {LayoutDescriptorJson} from "./LayoutDescriptorJson";

export class LayoutDescriptorResourceRequest<JSON_TYPE, PARSED_TYPE> extends ResourceRequest<JSON_TYPE, PARSED_TYPE> {

        private resourcePath: Path;

        cache: LayoutDescriptorCache;

        constructor() {
            super();
            this.cache = LayoutDescriptorCache.get();
            this.resourcePath = Path.fromParent(super.getRestPath(), "content", "page", "layout", "descriptor");
        }

        getResourcePath(): Path {
            return this.resourcePath;
        }

        fromJsonToLayoutDescriptor(json: LayoutDescriptorJson): LayoutDescriptor {

            var descriptor = new LayoutDescriptorBuilder().fromJson(json).build();
            this.cache.put(descriptor);
            return  descriptor;
        }
    }
