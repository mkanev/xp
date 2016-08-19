import {ListContentResult} from "./result/ListContentResult";
import {ContentResponse} from "./result/ContentResponse";
import {ContentSummaryJson} from "../json/ContentSummaryJson";
import {Expand} from "../../rest/Expand";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {ContentMetadata} from "../ContentMetadata";
import {ContentPath} from "../ContentPath";
import {ContentSummary} from "../ContentSummary";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class ListContentByPathRequest<T> extends ContentResourceRequest<ListContentResult<ContentSummaryJson>, ContentResponse<ContentSummary>> {

        private parentPath: ContentPath;

        private expand: Expand = Expand.SUMMARY;

        private from: number;

        private size: number;

        constructor(parentPath: ContentPath) {
            super();
            super.setMethod("GET");
            this.parentPath = parentPath;
        }

        setExpand(value: Expand): ListContentByPathRequest<T> {
            this.expand = value;
            return this;
        }

        setFrom(value: number): ListContentByPathRequest<T> {
            this.from = value;
            return this;
        }

        setSize(value: number): ListContentByPathRequest<T> {
            this.size = value;
            return this;
        }

        getParams(): Object {
            return {
                parentPath: this.parentPath.toString(),
                expand: this.expand,
                from: this.from,
                size: this.size
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "list", "bypath");
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
