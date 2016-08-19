import {ContentJson} from "../json/ContentJson";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {Content} from "../Content";
import {ContentId} from "../ContentId";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class DuplicateContentRequest extends ContentResourceRequest<ContentJson, Content> {

        private id: ContentId;

        constructor(id: ContentId) {
            super();
            super.setMethod("POST");
            this.id = id;
        }

        getParams(): Object {
            return {
                contentId: this.id.toString()
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "duplicate");
        }

        sendAndParse(): wemQ.Promise<Content> {

            return this.send().then((response: JsonResponse<ContentJson>) => {
                return this.fromJsonToContent(response.getResult());
            });
        }
    }
