import {SchemaIconUrlResolver} from "../SchemaIconUrlResolver";
import {UriHelper} from "../../util/UriHelper";
import {Path} from "../../rest/Path";

export class ContentTypeIconUrlResolver extends SchemaIconUrlResolver {

        static default(): string {
            return UriHelper.getRestUri(Path.fromParent(SchemaIconUrlResolver.getResourcePath(),
                "base:structured").toString());
        }
    }
