import {Equitable} from "../Equitable";
import {assert} from "../util/Assert";
import {StringHelper} from "../util/StringHelper";
import {ObjectHelper} from "../ObjectHelper";

export class UserStoreKey implements Equitable {

        public static SYSTEM: UserStoreKey = new UserStoreKey('system');

        private id: string;

        constructor(id: string) {
            assert(!StringHelper.isBlank(id), "UserStoreKey id cannot be null or empty");
            this.id = id;
        }

        isSystem(): boolean {
            return this.id === UserStoreKey.SYSTEM.id;
        }

        toString(): string {
            return this.id;
        }

        getId(): string {
            return this.id;
        }

        static fromString(value: string): UserStoreKey {
            return new UserStoreKey(value);
        }

        equals(o: Equitable): boolean {
            if (!ObjectHelper.iFrameSafeInstanceOf(o, UserStoreKey)) {
                return false;
            }

            var other = <UserStoreKey>o;
            return this.id === other.id;
        }
    }
