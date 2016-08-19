import {SecurityResourceRequest} from "./SecurityResourceRequest";
import {FindPrincipalsRequest} from "./FindPrincipalsRequest";
import {JsonResponse} from "../rest/JsonResponse";
import {FindPrincipalsResultJson} from "./FindPrincipalsResultJson";
import {Principal} from "./Principal";
import {PrincipalJson} from "./PrincipalJson";
import {PrincipalListJson} from "./PrincipalListJson";
import {PrincipalType} from "./PrincipalType";
import {UserStoreKey} from "./UserStoreKey";

export class FindPrincipalListRequest extends SecurityResourceRequest<PrincipalListJson, Principal[]> {

        private request: FindPrincipalsRequest;

        constructor() {
            super();
            this.request = new FindPrincipalsRequest();
        }

        sendAndParse(): wemQ.Promise<Principal[]> {
            return this.request.send().
                then((response: JsonResponse<FindPrincipalsResultJson>) => {
                    var principals: Principal[] = response.getResult().principals.map((principalJson: PrincipalJson) => {
                        return this.fromJsonToPrincipal(principalJson);
                    });

                    return principals;
                });
        }

        setUserStoreKey(key: UserStoreKey): FindPrincipalListRequest {
            this.request.setUserStoreKey(key);
            return this;
        }

        setAllowedTypes(types: PrincipalType[]): FindPrincipalListRequest {
            this.request.setAllowedTypes(types);
            return this;
        }

        setSearchQuery(query: string): FindPrincipalListRequest {
            this.request.setSearchQuery(query);
            return this;
        }

        setResultFilter(filterPredicate: (principal: Principal) => boolean) {
            this.request.setResultFilter(filterPredicate);
        }


    }
