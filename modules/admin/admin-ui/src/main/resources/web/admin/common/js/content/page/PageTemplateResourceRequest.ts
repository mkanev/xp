import {ResourceRequest} from "../../rest/ResourceRequest";
import {Path} from "../../rest/Path";
import {ContentJson} from "../json/ContentJson";
import {Content} from "../Content";
import {PageTemplate} from "./PageTemplate";

export class PageTemplateResourceRequest<JSON_TYPE, PARSED_TYPE> extends ResourceRequest<JSON_TYPE, PARSED_TYPE> {

        private resourcePath: Path;

        constructor() {
            super();
            this.resourcePath = Path.fromParent(super.getRestPath(), "content", "page", "template");
        }

        getResourcePath(): Path {
            return this.resourcePath;
        }

        fromJsonToContent(json: ContentJson): PageTemplate {
            return <PageTemplate>Content.fromJson(json);
        }
    }
