import {ResourceRequest} from "../../rest/ResourceRequest";
import {Path} from "../../rest/Path";
import {PageDescriptorJson} from "./PageDescriptorJson";
import {PageDescriptorBuilder} from "./PageDescriptor";
import {PageDescriptor} from "./PageDescriptor";
import {PageDescriptorCache} from "./PageDescriptorCache";
import {PageDescriptorsJson} from "./PageDescriptorsJson";

export class PageDescriptorResourceRequest<JSON_TYPE, PARSED_TYPE> extends ResourceRequest<JSON_TYPE, PARSED_TYPE> {

        private resourcePath: Path;

        cache: PageDescriptorCache;

        constructor() {
            super();
            this.cache = PageDescriptorCache.get();
            this.resourcePath = Path.fromParent(super.getRestPath(), "content", "page", "descriptor");
        }

        getResourcePath(): Path {
            return this.resourcePath;
        }

        fromJsonToPageDescriptor(json: PageDescriptorJson, ignoreCache: boolean = false): PageDescriptor {

            var pageDescriptor = new PageDescriptorBuilder().fromJson(json).build();
            if(!ignoreCache) {
                this.cache.put(pageDescriptor);
            }

            return  pageDescriptor;
        }

        fromJsonToPageDescriptors(json: PageDescriptorsJson): PageDescriptor[] {

            return json.descriptors.map((descriptorJson: PageDescriptorJson)=> {
                return this.fromJsonToPageDescriptor(descriptorJson);
            });
        }
    }
