import {Permission} from "./Permission";
import {LoginResult} from "../auth/LoginResult";
import {PrincipalKey} from "../PrincipalKey";
import {RoleKeys} from "../RoleKeys";
import {AccessControlEntry} from "./AccessControlEntry";
import {AccessControlList} from "./AccessControlList";

export class PermissionHelper {

        static hasPermission(permission: Permission,
                             loginResult: LoginResult,
                             accessControlList: AccessControlList): boolean {
            var result = false;
            var entries = accessControlList.getEntries();
            var accessEntriesWithGivenPermissions: AccessControlEntry[] = entries.filter((item: AccessControlEntry) => {
                return item.isAllowed(permission);
            });

            loginResult.getPrincipals().some((principalKey: PrincipalKey) => {
                if (RoleKeys.ADMIN.equals(principalKey) ||
                    this.isPrincipalPresent(principalKey, accessEntriesWithGivenPermissions)) {
                    result = true;
                    return true;
                }
            });
            return result;
        }

        static isPrincipalPresent(principalKey: PrincipalKey,
                                  accessEntriesToCheck: AccessControlEntry[]): boolean {
            var result = false;
            accessEntriesToCheck.some((entry: AccessControlEntry) => {
                if (entry.getPrincipalKey().equals(principalKey)) {
                    result = true;
                    return true;
                }
            });

            return result;
        }
    }

