import {BatchContentResult} from "./result/BatchContentResult";
import {ContentSummaryJson} from "../json/ContentSummaryJson";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {ContentId} from "../ContentId";
import {ContentSummary} from "../ContentSummary";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class GetContentSummaryByIds extends ContentResourceRequest<BatchContentResult<ContentSummaryJson>, ContentSummary[]> {

        private ids: ContentId[];

        constructor(ids: ContentId[]) {
            super();
            super.setMethod("GET");
            this.ids = ids;
        }

        getParams(): Object {
            return {
                ids: this.ids.map(id => id.toString()).join(",")
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), 'resolveByIds');
        }

        sendAndParse(): wemQ.Promise<ContentSummary[]> {
            if (this.ids && this.ids.length > 0) {
                return this.send().then((response: JsonResponse<BatchContentResult<ContentSummaryJson>>) => {
                    return ContentSummary.fromJsonArray(response.getResult().contents);
                });
            } else {
                var deferred = wemQ.defer<ContentSummary[]>();
                deferred.resolve([]);
                return deferred.promise;
            }
        }

    }
