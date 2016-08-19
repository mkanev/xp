import {SchemaJson} from "../SchemaJson";

export interface RelationshipTypeJson extends SchemaJson {

        fromSemantic:string;

        toSemantic:string;

        allowedFromTypes:string[];

        allowedToTypes:string[];
    }
