import {IconUrlResolver} from "../icon/IconUrlResolver";
import {Path} from "../rest/Path";
import {Schema} from "./Schema";

export class SchemaIconUrlResolver extends IconUrlResolver {

        resolve(schema: Schema) {

            return schema.getIconUrl();
        }

        public static getResourcePath(): Path {
            return Path.fromString("schema/icon");
        }
    }
