import {Role} from "./Role";
import {Group} from "./Group";
import {User} from "./User";
import {ResourceRequest} from "../rest/ResourceRequest";
import {Path} from "../rest/Path";
import {PrincipalJson} from "./PrincipalJson";
import {RoleJson} from "./RoleJson";
import {GroupJson} from "./GroupJson";
import {UserJson} from "./UserJson";
import {Principal} from "./Principal";
import {PrincipalKey} from "./PrincipalKey";

export class SecurityResourceRequest<JSON_TYPE, PARSED_TYPE> extends ResourceRequest<JSON_TYPE, PARSED_TYPE> {

        private resourcePath: Path;

        constructor() {
            super();
            this.resourcePath = Path.fromParent(super.getRestPath(), "security");
        }

        getResourcePath(): Path {
            return this.resourcePath;
        }

        fromJsonToPrincipal(json: PrincipalJson): Principal {
            var pKey: PrincipalKey = PrincipalKey.fromString(json.key);
            if (pKey.isRole()) {
                return Role.fromJson(<RoleJson>json)

            } else if (pKey.isGroup()) {
                return Group.fromJson(<GroupJson>json);

            } else if (pKey.isUser()) {
                return User.fromJson(<UserJson>json);
            }
        }
    }
