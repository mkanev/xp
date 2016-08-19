import {Path} from "../rest/Path";
import {JsonResponse} from "../rest/JsonResponse";
import {PrincipalKey} from "./PrincipalKey";
import {SecurityResourceRequest} from "./SecurityResourceRequest";
import {User} from "./User";
import {UserJson} from "./UserJson";

export class SetUserPasswordRequest extends SecurityResourceRequest<UserJson, User> {

        private key: PrincipalKey;
        private password: string;

        constructor() {
            super();
            super.setMethod("POST");
        }

        setKey(key: PrincipalKey): SetUserPasswordRequest {
            this.key = key;
            return this;
        }

        setPassword(password: string): SetUserPasswordRequest {
            this.password = password;
            return this;
        }

        getParams(): Object {
            return {
                key: this.key.toString(),
                password: this.password
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), 'principals', 'setPassword');
        }

        sendAndParse(): wemQ.Promise<User> {

            return this.send().then((response: JsonResponse<UserJson>) => {
                return User.fromJson(response.getResult());
            });
        }

    }
