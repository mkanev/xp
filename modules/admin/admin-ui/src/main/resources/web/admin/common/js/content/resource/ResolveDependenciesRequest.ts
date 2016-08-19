import {ContentDependencyJson} from "../json/ContentDependencyJson";
import {Path} from "../../rest/Path";
import {ContentId} from "../ContentId";
import {ContentResourceRequest} from "./ContentResourceRequest";

export class ResolveDependenciesRequest extends ContentResourceRequest<ContentDependencyJson, any> {

        private id: ContentId;

        constructor(contentId: ContentId) {
            super();
            super.setMethod("GET");
            this.id = contentId;
        }

        getParams(): Object {
            return {
                id: this.id.toString()
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "getDependencies");
        }
    }
