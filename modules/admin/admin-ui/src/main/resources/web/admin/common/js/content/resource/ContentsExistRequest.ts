import {ContentsExistJson} from "../json/ContentsExistJson";
import {ContentsExistResult} from "./result/ContentsExistResult";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class ContentsExistRequest extends ContentResourceRequest<ContentsExistJson, ContentsExistResult> {

        private contentIds: string[] = [];

        constructor(contentIds: string[]) {
            super();
            super.setMethod("POST");
            this.contentIds = contentIds;
        }

        getParams(): Object {
            return {
                contentIds: this.contentIds
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "contentsExist");
        }

        sendAndParse(): wemQ.Promise<ContentsExistResult> {

            return this.send().then((response: JsonResponse<ContentsExistJson>) => {
                return new ContentsExistResult(response.getResult());
            });
        }
    }
