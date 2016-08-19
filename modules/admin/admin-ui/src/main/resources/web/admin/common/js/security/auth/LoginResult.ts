import {User} from "../User";
import {PrincipalKey} from "../PrincipalKey";
import {LoginResultJson} from "./LoginResultJson";

export class LoginResult {

        private authenticated: boolean;

        private user: User;

        private principals: PrincipalKey[];

        private message: string;

        constructor(json: LoginResultJson) {
            this.authenticated = json.authenticated;
            if (json.user) {
                this.user = User.fromJson(json.user);
            }
            this.principals = json.principals ?
                              json.principals.map((principal) => PrincipalKey.fromString(principal)) : [];
            this.message = json.message;
        }

        isAuthenticated(): boolean {
            return this.authenticated;
        }

        getUser(): User {
            return this.user;
        }

        getPrincipals(): PrincipalKey[] {
            return this.principals;
        }

        getMessage(): string {
            return this.message;
        }
    }
