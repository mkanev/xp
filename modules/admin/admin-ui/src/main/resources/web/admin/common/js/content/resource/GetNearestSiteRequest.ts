import {ContentJson} from "../json/ContentJson";
import {Site} from "../site/Site";
import {ContentId} from "../ContentId";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class GetNearestSiteRequest extends ContentResourceRequest<ContentJson, Site> {

        private contentId: ContentId;

        constructor(contentId: ContentId) {
            super();
            super.setMethod("POST");
            this.contentId = contentId;
        }

        getParams(): Object {
            return {
                contentId: this.contentId.toString()
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "nearestSite");
        }

        sendAndParse(): wemQ.Promise<Site> {

            return this.send().then((response: JsonResponse<ContentJson>) => {
                return response.isBlank() ? null : <Site>this.fromJsonToContent(response.getResult());
            });
        }
    }
