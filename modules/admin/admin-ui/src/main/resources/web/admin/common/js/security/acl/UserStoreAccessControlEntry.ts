import {Equitable} from "../../Equitable";
import {assertNotNull} from "../../util/Assert";
import {ObjectHelper} from "../../ObjectHelper";
import {UserStoreAccessControlEntryJson} from "./UserStoreAccessControlEntryJson";
import {Principal} from "../Principal";
import {PrincipalKey} from "../PrincipalKey";
import {UserStoreAccess} from "./UserStoreAccess";

export class UserStoreAccessControlEntry implements Equitable {

        private principal: Principal;

        private access: UserStoreAccess;

        constructor(principal: Principal, access?: UserStoreAccess) {
            assertNotNull(principal, "principal not set");
            //    assertNotNull(access, "access not set");
            this.principal = principal;
            this.access = access;
        }

        getPrincipal(): Principal {
            return this.principal;
        }

        getAccess(): UserStoreAccess {
            return this.access;
        }

        setAccess(value: string): UserStoreAccessControlEntry {
            this.access = UserStoreAccess[value];
            return this;
        }

        getPrincipalKey(): PrincipalKey {
            return this.principal.getKey();
        }

        getPrincipalDisplayName(): string {
            return this.principal.getDisplayName();
        }

        getPrincipalTypeName(): string {
            return this.principal.getTypeName();
        }

        equals(o: Equitable): boolean {
            if (!ObjectHelper.iFrameSafeInstanceOf(o, UserStoreAccessControlEntry)) {
                return false;
            }
            var other = <UserStoreAccessControlEntry>o;
            return this.principal.equals(other.getPrincipal()) &&
                   this.access === other.access;
        }

        getId(): string {
            return this.principal.getKey().toString();
        }

        toString(): string {
            return this.principal.getKey().toString() + '[' + UserStoreAccess[this.access] + ']';
        }

        toJson(): UserStoreAccessControlEntryJson {
            return {
                "principal": this.principal.toJson(),
                "access": UserStoreAccess[this.access]
            };
        }

        static fromJson(json: UserStoreAccessControlEntryJson): UserStoreAccessControlEntry {
            return new UserStoreAccessControlEntry(Principal.fromJson(json.principal), UserStoreAccess[json.access.toUpperCase()]);
        }
    }

