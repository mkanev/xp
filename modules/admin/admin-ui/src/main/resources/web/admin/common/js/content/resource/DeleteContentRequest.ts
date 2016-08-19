import {DeleteContentResultJson} from "../json/DeleteContentResultJson";
import {DeleteContentResult} from "./result/DeleteContentResult";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {ContentPath} from "../ContentPath";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class DeleteContentRequest extends ContentResourceRequest<DeleteContentResultJson, DeleteContentResult> {

        private contentPaths: ContentPath[] = [];

        private deleteOnline: boolean;

        constructor(contentPath?: ContentPath) {
            super();
            this.setHeavyOperation(true);
            super.setMethod("POST");
            if (contentPath) {
                this.addContentPath(contentPath);
            }
        }

        setContentPaths(contentPaths: ContentPath[]): DeleteContentRequest {
            this.contentPaths = contentPaths;
            return this;
        }

        addContentPath(contentPath: ContentPath): DeleteContentRequest {
            this.contentPaths.push(contentPath);
            return this;
        }

        setDeleteOnline(deleteOnline: boolean) {
            this.deleteOnline = deleteOnline;
        }

        getParams(): Object {
            var fn = (contentPath: ContentPath) => {
                return contentPath.toString();
            };
            return {
                contentPaths: this.contentPaths.map(fn),
                deleteOnline: this.deleteOnline
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "delete");
        }

        sendAndParse(): wemQ.Promise<DeleteContentResult> {

            return this.send().then((response: JsonResponse<DeleteContentResultJson>) => {

                return DeleteContentResult.fromJson(response.getResult());

            });
        }
    }
