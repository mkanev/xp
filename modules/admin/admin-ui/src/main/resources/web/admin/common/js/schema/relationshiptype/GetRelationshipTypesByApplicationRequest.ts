import {ApplicationKey} from "../../application/ApplicationKey";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {RelationshipType} from "./RelationshipType";
import {RelationshipTypeJson} from "./RelationshipTypeJson";
import {RelationshipTypeListJson} from "./RelationshipTypeListJson";
import {RelationshipTypeResourceRequest} from "./RelationshipTypeResourceRequest";

export class GetRelationshipTypesByApplicationRequest extends RelationshipTypeResourceRequest<RelationshipTypeListJson, RelationshipType[]> {

        private applicationKey: ApplicationKey;

        constructor(applicationKey: ApplicationKey) {
            super();
            super.setMethod("GET");
            this.applicationKey = applicationKey;
        }

        getParams(): Object {
            return {
                applicationKey: this.applicationKey.toString()
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), "byApplication");
        }

        sendAndParse(): wemQ.Promise<RelationshipType[]> {

            return this.send().then((response: JsonResponse<RelationshipTypeListJson>) => {
                return response.getResult().relationshipTypes.map((json: RelationshipTypeJson) => this.fromJsonToReleationshipType(json));
            });
        }
    }
