import {Equitable} from "../../../Equitable";
import {CompareStatus} from "../../CompareStatus";
import {ObjectHelper} from "../../../ObjectHelper";
import {CompareContentResultJson} from "../../json/CompareContentResultJson";

export class CompareContentResult implements Equitable {

        compareStatus: CompareStatus;

        id: string;

        constructor(id: string, compareStatus: CompareStatus) {

            this.compareStatus = compareStatus;
            this.id = id;
        }

        getId(): string {
            return this.id;
        }

        getCompareStatus(): CompareStatus {
            return this.compareStatus;
        }

        equals(o: Equitable): boolean {

            if (!ObjectHelper.iFrameSafeInstanceOf(o, CompareContentResult)) {
                return false;
            }

            var other = <CompareContentResult>o;

            if (!ObjectHelper.stringEquals(this.id.toString(), other.id.toString())) {
                return false;
            }

            return true;
        }

        static fromJson(json: CompareContentResultJson): CompareContentResult {

            var status: CompareStatus = <CompareStatus>CompareStatus[json.compareStatus];

            return new CompareContentResult(json.id, status);
        }
    }
