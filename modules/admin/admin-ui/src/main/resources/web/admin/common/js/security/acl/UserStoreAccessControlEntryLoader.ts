import {PrincipalListJson} from "../PrincipalListJson";
import {PrincipalJson} from "../PrincipalJson";
import {PrincipalType} from "../PrincipalType";
import {UserStoreKey} from "../UserStoreKey";
import {SecurityResourceRequest} from "../SecurityResourceRequest";
import {Path} from "../../rest/Path";
import {JsonResponse} from "../../rest/JsonResponse";
import {BaseLoader} from "../../util/loader/BaseLoader";
import {UserStoreAccessControlEntry} from "./UserStoreAccessControlEntry";

export class FindUserStoreAccessControlEntriesRequest extends SecurityResourceRequest<PrincipalListJson, UserStoreAccessControlEntry[]> {

        private allowedTypes: PrincipalType[];
        private searchQuery: string;
        private userStoreKey: UserStoreKey;

        constructor() {
            super();
        }

        getParams(): Object {
            return {
                /*"types": this.enumToStrings(this.allowedTypes),*/
                "query": this.searchQuery
            }
        }

        getRequestPath(): Path {
            return Path.fromParent(super.getResourcePath(), 'principals');
        }

        sendAndParse(): wemQ.Promise<UserStoreAccessControlEntry[]> {
            return this.send().
                then((response: JsonResponse<PrincipalListJson>) => {
                    return response.getResult().principals.map((principalJson: PrincipalJson) => {
                        return new UserStoreAccessControlEntry(this.fromJsonToPrincipal(principalJson));
                    });
                });
        }

        private enumToStrings(types: PrincipalType[]): string[] {
            return types.map((type: PrincipalType) => {
                return PrincipalType[type].toUpperCase();
            });
        }

        setUserStoreKey(key: UserStoreKey): FindUserStoreAccessControlEntriesRequest {
            this.userStoreKey = key;
            return this;
        }

        setAllowedTypes(types: PrincipalType[]): FindUserStoreAccessControlEntriesRequest {
            this.allowedTypes = types;
            return this;
        }

        setSearchQuery(query: string): FindUserStoreAccessControlEntriesRequest {
            this.searchQuery = query;
            return this;
        }
    }

    export class UserStoreAccessControlEntryLoader extends BaseLoader<PrincipalListJson, UserStoreAccessControlEntry> {

        private findRequest: FindUserStoreAccessControlEntriesRequest;

        constructor() {
            this.findRequest = new FindUserStoreAccessControlEntriesRequest();
            // allow all by default
            this.setAllowedTypes([PrincipalType.GROUP, PrincipalType.USER, PrincipalType.ROLE]);
            super(this.findRequest);
        }

        setUserStoreKey(key: UserStoreKey): UserStoreAccessControlEntryLoader {
            this.findRequest.setUserStoreKey(key);
            return this;
        }

        setAllowedTypes(principalTypes: PrincipalType[]): UserStoreAccessControlEntryLoader {
            this.findRequest.setAllowedTypes(principalTypes);
            return this;
        }

        search(searchString: string): wemQ.Promise<UserStoreAccessControlEntry[]> {
            this.findRequest.setSearchQuery(searchString);
            return this.load();
        }

    }

