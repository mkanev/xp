import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {ContentTypeResourceRequest} from "./ContentTypeResourceRequest";
import {ContentTypeSummary} from "./ContentTypeSummary";
import {ContentTypeSummaryJson} from "./ContentTypeSummaryJson";
import {ContentTypeSummaryListJson} from "./ContentTypeSummaryListJson";

export class GetAllContentTypesRequest extends ContentTypeResourceRequest<ContentTypeSummaryListJson, ContentTypeSummary[]> {

        private inlineMixinsToFormItems:boolean = true;

        constructor() {
            super();
            super.setMethod("GET");
        }

        getParams():Object {
            return {
                inlineMixinsToFormItems: this.inlineMixinsToFormItems
            };
        }

        getRequestPath():Path {
            return Path.fromParent(super.getResourcePath(), "all");
        }

        sendAndParse(): wemQ.Promise<ContentTypeSummary[]> {

            return this.send().then((response: JsonResponse<ContentTypeSummaryListJson>) => {
                return response.getResult().contentTypes.map((contentTypeJson: ContentTypeSummaryJson) => {
                    return this.fromJsonToContentTypeSummary(contentTypeJson);
                });
            });
        }
    }
