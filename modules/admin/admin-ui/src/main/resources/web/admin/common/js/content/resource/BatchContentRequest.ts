import {BatchContentResult} from "./result/BatchContentResult";
import {ContentResponse} from "./result/ContentResponse";
import {ContentSummaryJson} from "../json/ContentSummaryJson";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {ContentMetadata} from "../ContentMetadata";
import {ContentPath} from "../ContentPath";
import {ContentSummary} from "../ContentSummary";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class BatchContentRequest extends ContentResourceRequest<BatchContentResult<ContentSummaryJson>, ContentResponse<ContentSummary>> {

        private contentPaths: ContentPath[] = [];

        constructor(contentPath?: ContentPath) {
            super();
            super.setMethod("POST");
            if (contentPath) {
                this.addContentPath(contentPath);
            }
        }

        setContentPaths(contentPaths: ContentPath[]): BatchContentRequest {
            this.contentPaths = contentPaths;
            return this;
        }

        addContentPath(contentPath: ContentPath): BatchContentRequest {
            this.contentPaths.push(contentPath);
            return this;
        }

        getParams(): Object {
            var fn = (contentPath: ContentPath) => {
                return contentPath.toString();
            };
            return {
                contentPaths: this.contentPaths.map(fn)
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "batch");
        }

        sendAndParse(): wemQ.Promise<ContentResponse<ContentSummary>> {

            return this.send().then((response: JsonResponse<BatchContentResult<ContentSummaryJson>>) => {
                return new ContentResponse(
                    ContentSummary.fromJsonArray(response.getResult().contents),
                    new ContentMetadata(response.getResult().metadata["hits"], response.getResult().metadata["totalHits"])
                );
            });
        }
    }
