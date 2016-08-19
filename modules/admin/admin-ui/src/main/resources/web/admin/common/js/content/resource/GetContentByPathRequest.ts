import {ContentJson} from "../json/ContentJson";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {Content} from "../Content";
import {ContentPath} from "../ContentPath";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class GetContentByPathRequest extends ContentResourceRequest<ContentJson, Content> {

        private contentPath: ContentPath;

        constructor(path: ContentPath) {
            super();
            super.setMethod("GET");
            this.contentPath = path;
        }

        getParams(): Object {
            return {
                path: this.contentPath.toString()
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "bypath");
        }

        sendAndParse(): wemQ.Promise<Content> {

            return this.send().then((response: JsonResponse<ContentJson>) => {
                return this.fromJsonToContent(response.getResult());
            });
        }
    }
