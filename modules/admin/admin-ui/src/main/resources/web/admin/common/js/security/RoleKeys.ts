import {PrincipalKey} from "./PrincipalKey";

export class RoleKeys {

        public static EVERYONE: PrincipalKey = PrincipalKey.ofRole('system.everyone');

        public static ADMIN: PrincipalKey = PrincipalKey.ofRole('system.admin');
    }
