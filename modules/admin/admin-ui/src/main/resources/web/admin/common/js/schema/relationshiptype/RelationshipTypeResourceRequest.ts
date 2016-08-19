import {ResourceRequest} from "../../rest/ResourceRequest";
import {Path} from "../../rest/Path";
import {RelationshipTypeJson} from "./RelationshipTypeJson";
import {RelationshipType} from "./RelationshipType";

export class RelationshipTypeResourceRequest<JSON_TYPE, PARSED_TYPE> extends ResourceRequest<JSON_TYPE, PARSED_TYPE> {

        private resourceUrl: Path;

        constructor() {
            super();
            this.resourceUrl = Path.fromParent(super.getRestPath(), "schema/relationship");
        }

        getResourcePath(): Path {
            return this.resourceUrl;
        }

        fromJsonToReleationshipType(json: RelationshipTypeJson): RelationshipType {
            return RelationshipType.fromJson(json);
        }
    }
