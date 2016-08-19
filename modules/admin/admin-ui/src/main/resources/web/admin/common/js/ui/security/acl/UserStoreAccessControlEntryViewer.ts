import {UserStoreAccessControlEntry} from "../../../security/acl/UserStoreAccessControlEntry";
import {PrincipalType} from "../../../security/PrincipalType";
import {NamesAndIconViewer} from "../../NamesAndIconViewer";

export class UserStoreAccessControlEntryViewer extends NamesAndIconViewer<UserStoreAccessControlEntry> {

        constructor() {
            super();
        }

        resolveDisplayName(object: UserStoreAccessControlEntry): string {
            return object.getPrincipalDisplayName();
        }

        resolveUnnamedDisplayName(object: UserStoreAccessControlEntry): string {
            return object.getPrincipalTypeName();
        }

        resolveSubName(object: UserStoreAccessControlEntry, relativePath: boolean = false): string {
            return object.getPrincipalKey().toPath();
        }

        resolveIconClass(object: UserStoreAccessControlEntry): string {
            switch (object.getPrincipal().getKey().getType()) {
            case PrincipalType.USER:
                return "icon-user";
            case PrincipalType.GROUP:
                return "icon-users";
            case PrincipalType.ROLE:
                return "icon-masks";
            }

            return "";
        }
    }

