import {SyncUserStoreResultJson} from "./SyncUserStoreResultJson";
import {UserStoreKey} from "./UserStoreKey";

export class SyncUserStoreResult {

        private userStoreKey: UserStoreKey;
        private synchronized: boolean;
        private reason: string;

        constructor() {
        }

        getUserStoreKey(): UserStoreKey {
            return this.userStoreKey;
        }

        isSynchronized(): boolean {
            return this.synchronized;
        }

        getReason(): string {
            return this.reason;
        }

        static fromJson(json: SyncUserStoreResultJson): SyncUserStoreResult {
            var result = new SyncUserStoreResult();
            result.userStoreKey = UserStoreKey.fromString(json.userStoreKey);
            result.synchronized = json.synchronized;
            result.reason = json.reason;
            return result;
        }
    }

