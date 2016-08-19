import {ResourceRequest} from "../../rest/ResourceRequest";
import {Path} from "../../rest/Path";
import {ContentJson} from "../json/ContentJson";
import {Content} from "../Content";

export class PageResourceRequest<JSON_TYPE, PARSED_TYPE> extends ResourceRequest<JSON_TYPE, PARSED_TYPE> {

        private resourcePath: Path;

        constructor() {
            super();
            this.resourcePath = Path.fromParent(super.getRestPath(), "content", "page");
        }

        getResourcePath(): Path {
            return this.resourcePath;
        }

        fromJsonToContent(json: ContentJson): Content {
            return Content.fromJson(json);
        }
    }
