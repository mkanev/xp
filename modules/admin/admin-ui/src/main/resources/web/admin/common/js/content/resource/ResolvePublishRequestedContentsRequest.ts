import {ResolvePublishContentResultJson} from "../json/ResolvePublishContentResultJson";
import {Path} from "../../rest/Path";
import {ContentId} from "../ContentId";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class ResolvePublishRequestedContentsRequest extends ContentResourceRequest<ResolvePublishContentResultJson, any> {

        private ids: ContentId[] = [];

        private includeChildren: boolean;

        constructor(contentIds: ContentId[], includeChildren: boolean) {
            super();
            super.setMethod("POST");
            this.ids = contentIds;
            this.includeChildren = includeChildren;
        }

        getParams(): Object {
            return {
                ids: this.ids.map((el) => {
                    return el.toString();
                }),
                includeChildren: this.includeChildren
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "resolvePublishContent");
        }
    }
