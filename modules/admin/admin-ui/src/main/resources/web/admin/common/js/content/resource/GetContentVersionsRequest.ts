import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {ContentVersionJson} from "../json/ContentVersionJson";
import {ContentId} from "../ContentId";
import {ContentVersion} from "../ContentVersion";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class GetContentVersionsRequest extends ContentResourceRequest<json.GetContentVersionsResultsJson, ContentVersion[]> {

        private contentId: ContentId;
        private from: number;
        private size: number;

        constructor(contentId: ContentId) {
            super();
            super.setMethod("POST");
            this.contentId = contentId;
        }

        setFrom(from: number): GetContentVersionsRequest {
            this.from = from;
            return this;
        }

        setSize(size: number): GetContentVersionsRequest {
            this.size = size;
            return this;
        }

        getParams(): Object {
            return {
                contentId: this.contentId.toString(),
                from: this.from,
                size: this.size
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), 'getVersions');
        }

        sendAndParse(): wemQ.Promise<ContentVersion[]> {

            return this.send().then((response: JsonResponse<json.GetContentVersionsResultsJson>) => {
                return this.fromJsonToContentVersions(response.getResult().contentVersions);
            });
        }

        private fromJsonToContentVersions(json: ContentVersionJson[]): ContentVersion[] {

            var contentVersions: ContentVersion[] = [];
            json.forEach((contentVersionJson: ContentVersionJson) => {
                contentVersions.push(ContentVersion.fromJson(contentVersionJson));
            });

            return contentVersions;
        }

    }
