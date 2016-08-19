import {ContentIdBaseItemJson} from "../json/ContentIdBaseItemJson";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {CompareStatus} from "../CompareStatus";
import {ContentId} from "../ContentId";
import {ContentPath} from "../ContentPath";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class GetDescendantsOfContentsRequest extends ContentResourceRequest<ContentIdBaseItemJson[], ContentId[]> {

        private contentPaths: ContentPath[] = [];

        private filterStatuses: CompareStatus[] = [];

        public static LOAD_SIZE: number = 20;

        constructor(contentPath?: ContentPath) {
            super();
            super.setMethod("POST");
            if (contentPath) {
                this.addContentPath(contentPath);
            }
        }

        setContentPaths(contentPaths: ContentPath[]): GetDescendantsOfContentsRequest {
            this.contentPaths = contentPaths;
            return this;
        }

        setFilterStatuses(filterStatuses: CompareStatus[]): GetDescendantsOfContentsRequest {
            this.filterStatuses = filterStatuses;
            return this;
        }

        addContentPath(contentPath: ContentPath): GetDescendantsOfContentsRequest {
            this.contentPaths.push(contentPath);
            return this;
        }

        getParams(): Object {
            var fn = (contentPath: ContentPath) => {
                return contentPath.toString();
            };
            return {
                contentPaths: this.contentPaths.map(fn),
                filterStatuses: this.filterStatuses
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "getDescendantsOfContents");
        }

        sendAndParse(): wemQ.Promise<ContentId[]> {

            return this.send().then((response: JsonResponse<ContentIdBaseItemJson[]>) => {
                return response.getResult().map((item => new ContentId(item.id)))
            });
        }
    }
