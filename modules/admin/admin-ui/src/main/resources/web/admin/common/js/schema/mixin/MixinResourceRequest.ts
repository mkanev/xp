import {ResourceRequest} from "../../rest/ResourceRequest";
import {Path} from "../../rest/Path";
import {MixinJson} from "./MixinJson";
import {Mixin} from "./Mixin";

export class MixinResourceRequest<JSON_TYPE, PARSED_TYPE> extends ResourceRequest<JSON_TYPE, PARSED_TYPE> {
        private resourceUrl: Path;

        constructor() {
            super();
            this.resourceUrl = Path.fromParent(super.getRestPath(), "schema/mixin");
        }

        getResourcePath(): Path {
            return this.resourceUrl;
        }

        fromJsonToMixin(json: MixinJson) {
            return Mixin.fromJson(json);
        }
    }
