import {ApplicationKey} from "../../application/ApplicationKey";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {ContentTypeResourceRequest} from "./ContentTypeResourceRequest";
import {ContentTypeSummary} from "./ContentTypeSummary";
import {ContentTypeSummaryJson} from "./ContentTypeSummaryJson";
import {ContentTypeSummaryListJson} from "./ContentTypeSummaryListJson";

export class GetContentTypesByApplicationRequest extends ContentTypeResourceRequest<ContentTypeSummaryListJson, ContentTypeSummary[]> {

        private applicationKey: ApplicationKey;

        constructor(applicationKey: ApplicationKey) {
            super();
            super.setMethod("GET");
            this.applicationKey = applicationKey;
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "byApplication");
        }

        getParams(): Object {
            return {
                applicationKey: this.applicationKey.toString()
            };
        }

        sendAndParse(): wemQ.Promise<ContentTypeSummary[]> {

            return this.send().then((response: JsonResponse<ContentTypeSummaryListJson>) => {
                return response.getResult().contentTypes.map((contentTypeJson: ContentTypeSummaryJson) => {
                    return this.fromJsonToContentTypeSummary(contentTypeJson);
                });
            });
        }

    }

