import {ListContentResult} from "./result/ListContentResult";
import {ContentResponse} from "./result/ContentResponse";
import {ContentSummaryJson} from "../json/ContentSummaryJson";
import {Expand} from "../../rest/Expand";
import {ChildOrder} from "../order/ChildOrder";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {ContentId} from "../ContentId";
import {ContentMetadata} from "../ContentMetadata";
import {ContentSummary} from "../ContentSummary";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class ListContentByIdRequest extends ContentResourceRequest<ListContentResult<ContentSummaryJson>, ContentResponse<ContentSummary>> {

        private parentId: ContentId;

        private expand: Expand = Expand.SUMMARY;

        private from: number;

        private size: number;

        private order: ChildOrder;

        constructor(parentId: ContentId) {
            super();
            super.setMethod("GET");
            this.parentId = parentId;
        }

        setExpand(value: Expand): ListContentByIdRequest {
            this.expand = value;
            return this;
        }

        setFrom(value: number): ListContentByIdRequest {
            this.from = value;
            return this;
        }

        setSize(value: number): ListContentByIdRequest {
            this.size = value;
            return this;
        }

        setOrder(value: ChildOrder): ListContentByIdRequest {
            this.order = value;
            return this;
        }

        getParams(): Object {
            return {
                parentId: this.parentId ? this.parentId.toString() : null,
                expand: this.expand,
                from: this.from,
                size: this.size,
                childOrder: !!this.order ? this.order.toString() : ""
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "list");
        }

        sendAndParse(): wemQ.Promise<ContentResponse<ContentSummary>> {

            return this.send().then((response: JsonResponse<ListContentResult<ContentSummaryJson>>) => {
                return new ContentResponse(
                    ContentSummary.fromJsonArray(response.getResult().contents),
                    new ContentMetadata(response.getResult().metadata["hits"], response.getResult().metadata["totalHits"])
                );
            });
        }
    }
