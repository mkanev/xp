import {ContentMetadata} from "../content/ContentMetadata";
import {FindPrincipalsResultJson} from "./FindPrincipalsResultJson";
import {Principal} from "./Principal";

export class FindPrincipalsResult {

        private principals: Principal[];

        private totalSize: number;

        constructor(principals: Principal[], totalSize: number) {
            this.principals = principals;
            this.totalSize = totalSize;
        }

        getPrincipals(): Principal[] {
            return this.principals;
        }

        getTotalSize(): number {
            return this.totalSize;
        }

        static fromJson(json: FindPrincipalsResultJson): FindPrincipalsResult {
            let principals = json.principals.map(principalJson => Principal.fromJson(principalJson));
            return new FindPrincipalsResult(principals, json.totalSize);
        }
    }

