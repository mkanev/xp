import {ContentSummaryJson} from "../json/ContentSummaryJson";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {ContentId} from "../ContentId";
import {ContentSummary} from "../ContentSummary";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class GetContentSummaryByIdRequest extends ContentResourceRequest<ContentSummaryJson, ContentSummary> {

        private id: ContentId;

        private expand: string;

        constructor(id: ContentId) {
            super();
            super.setMethod("GET");
            this.id = id;
            this.expand = ContentResourceRequest.EXPAND_SUMMARY;
        }

        getParams(): Object {
            return {
                id: this.id.toString(),
                expand: this.expand
            };
        }

        getRequestPath(): Path {
            return super.getResourcePath();
        }

        sendAndParse(): wemQ.Promise<ContentSummary> {

            return this.send().then((response: JsonResponse<ContentSummaryJson>) => {
                return this.fromJsonToContentSummary(response.getResult());
            });
        }
    }
