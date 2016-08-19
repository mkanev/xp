import {PrincipalType} from "../../../security/PrincipalType";
import {AccessControlEntry} from "../../../security/acl/AccessControlEntry";
import {NamesAndIconViewer} from "../../NamesAndIconViewer";

export class AccessControlEntryViewer extends NamesAndIconViewer<AccessControlEntry> {

        constructor() {
            super();
        }

        resolveDisplayName(object: AccessControlEntry): string {
            return object.getPrincipalDisplayName();
        }

        resolveUnnamedDisplayName(object: AccessControlEntry): string {
            return object.getPrincipalTypeName();
        }

        resolveSubName(object: AccessControlEntry, relativePath: boolean = false): string {
            return object.getPrincipalKey().toPath();
        }

        resolveIconClass(object: AccessControlEntry): string {
            switch (object.getPrincipalKey().getType()) {
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

