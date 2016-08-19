import {Equitable} from "../Equitable";
import {assert} from "../util/Assert";
import {ObjectHelper} from "../ObjectHelper";

export class ItemViewId implements Equitable {

        static DATA_ATTRIBUTE = "live-edit-id";

        private value: number;

        private refString: string;

        constructor(value: number) {
            assert(value >= 1, "An ItemViewId must be 1 or larger");
            this.value = value;
            this.refString = "" + value;
        }

        equals(o: Equitable): boolean {

            if (!ObjectHelper.iFrameSafeInstanceOf(o, ItemViewId)) {
                return false;
            }

            var other = <ItemViewId>o;

            if (!ObjectHelper.numberEquals(this.value, other.value)) {
                return false;
            }

            return true;
        }

        toNumber(): number {
            return this.value;
        }

        toString(): string {
            return this.refString;
        }

        static fromString(s: string) {
            return new ItemViewId(+s);
        }
    }
