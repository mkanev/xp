import {PrincipalKey} from "../../../security/PrincipalKey";
import {EffectivePermissionMemberJson} from "../../../content/json/EffectivePermissionMemberJson";

export class EffectivePermissionMember {

        private userKey: PrincipalKey;

        private displayName: string;

        constructor(userKey: PrincipalKey, displayName: string) {
            this.userKey = userKey;
            this.displayName = displayName;
        }

        getUserKey(): PrincipalKey {
            return this.userKey;
        }

        getDisplayName(): string {
            return this.displayName;
        }

        static fromJson(json: EffectivePermissionMemberJson) {
            return new EffectivePermissionMember(PrincipalKey.fromString(json.key), json.displayName);
        }

    }

