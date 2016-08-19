import {ResourceRequest} from "../../rest/ResourceRequest";
import {Path} from "../../rest/Path";
import {ContentTypeJson} from "./ContentTypeJson";
import {ContentTypeSummaryJson} from "./ContentTypeSummaryJson";
import {ContentType} from "./ContentType";
import {ContentTypeSummary} from "./ContentTypeSummary";

export class ContentTypeResourceRequest<JSON_TYPE, PARSED_TYPE> extends ResourceRequest<JSON_TYPE, PARSED_TYPE> {

        private resourceUrl: Path;

        constructor() {
            super();
            this.resourceUrl = Path.fromParent(super.getRestPath(), "schema/content");
        }

        getResourcePath(): Path {
            return this.resourceUrl;
        }

        fromJsonToContentType(json: ContentTypeJson): ContentType {
            return ContentType.fromJson(json);
        }

        fromJsonToContentTypeSummary(json: ContentTypeSummaryJson): ContentTypeSummary {
            return ContentTypeSummary.fromJson(json);
        }
    }
