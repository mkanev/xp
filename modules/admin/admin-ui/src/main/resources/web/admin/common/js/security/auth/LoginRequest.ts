import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {AuthResourceRequest} from "./AuthResourceRequest";
import {LoginCredentials} from "./LoginCredentials";
import {LoginResult} from "./LoginResult";
import {LoginResultJson} from "./LoginResultJson";

export class LoginRequest extends AuthResourceRequest<LoginResultJson, LoginResult> {

        private loginCredentials: LoginCredentials;

        constructor(loginCredentials: LoginCredentials) {
            super();
            super.setMethod("POST");
            this.loginCredentials = loginCredentials;
        }

        getParams(): Object {
            return {
                user: this.loginCredentials.getUser(),
                password: this.loginCredentials.getPassword(),
                rememberMe: this.loginCredentials.isRememberMe()
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), 'login');
        }

        sendAndParse(): wemQ.Promise<LoginResult> {

            return this.send().then((response: JsonResponse<LoginResultJson>) => {
                return new LoginResult(response.getResult());
            });
        }

    }
