import {Path} from "../rest/Path";
import {JsonResponse} from "../rest/JsonResponse";
import {SecurityResourceRequest} from "./SecurityResourceRequest";
import {UserStoreKey} from "./UserStoreKey";

export interface CheckEmailAvailabilityResponse {
        available: boolean;
    }

    export class CheckEmailAvailabilityRequest extends SecurityResourceRequest<CheckEmailAvailabilityResponse, boolean> {

        private userStoreKey: UserStoreKey;

        private email: string;

        constructor(email: string) {
            super();
            super.setMethod("GET");
            this.email = email;
        }

        setUserStoreKey(key: UserStoreKey): CheckEmailAvailabilityRequest {
            this.userStoreKey = key;
            return this;
        }

        getParams(): Object {
            return {
                email: this.email,
                userStoreKey: this.userStoreKey ? this.userStoreKey.toString() : undefined
            };
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), 'principals', 'emailAvailable');
        }

        sendAndParse(): wemQ.Promise<boolean> {

            return this.send().then((response: JsonResponse<CheckEmailAvailabilityResponse>) => {
                return response.getResult().available;
            });
        }

    }
