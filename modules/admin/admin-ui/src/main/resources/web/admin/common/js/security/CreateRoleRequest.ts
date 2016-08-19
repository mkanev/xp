import {Path} from "../rest/Path";
import {JsonResponse} from "../rest/JsonResponse";
import {PrincipalKey} from "./PrincipalKey";
import {Role} from "./Role";
import {RoleJson} from "./RoleJson";
import {SecurityResourceRequest} from "./SecurityResourceRequest";

export class CreateRoleRequest extends SecurityResourceRequest<RoleJson, Role> {

        private key: PrincipalKey;
        private displayName: string;
        private members: PrincipalKey[] = [];
        private description: string;

        constructor() {
            super();
            super.setMethod("POST");
        }

        setKey(key: PrincipalKey): CreateRoleRequest {
            this.key = key;
            return this;
        }

        setDisplayName(displayName: string): CreateRoleRequest {
            this.displayName = displayName;
            return this;
        }

        setMembers(members: PrincipalKey[]): CreateRoleRequest {
            this.members = members.slice(0);
            return this;
        }

        setDescription(description: string): CreateRoleRequest {
            this.description = description;
            return this;
        }

        getParams(): Object {
            return {
                key: this.key.toString(),
                displayName: this.displayName,
                members: this.members.map((memberKey) => memberKey.toString()),
                description: this.description
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), 'principals', 'createRole');
        }

        sendAndParse(): wemQ.Promise<Role> {

            return this.send().then((response: JsonResponse<RoleJson>) => {
                return Role.fromJson(response.getResult());
            });
        }

    }
