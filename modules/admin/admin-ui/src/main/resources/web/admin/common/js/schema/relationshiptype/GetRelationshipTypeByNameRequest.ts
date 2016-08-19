import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {RelationshipType} from "./RelationshipType";
import {RelationshipTypeJson} from "./RelationshipTypeJson";
import {RelationshipTypeName} from "./RelationshipTypeName";
import {RelationshipTypeResourceRequest} from "./RelationshipTypeResourceRequest";

export class GetRelationshipTypeByNameRequest extends RelationshipTypeResourceRequest<RelationshipTypeJson, RelationshipType> {

        private name: RelationshipTypeName;

        constructor(name: RelationshipTypeName) {
            super();
            super.setMethod("GET");
            this.name = name;
        }

        getParams(): Object {
            return {
                name: this.name.toString()
            };
        }

        getRequestPath(): Path {
            return super.getResourcePath();
        }

        sendAndParse(): wemQ.Promise<RelationshipType> {

            return this.send().then((response: JsonResponse<RelationshipTypeJson>) => {
                return this.fromJsonToReleationshipType(response.getResult());
            });
        }
    }
