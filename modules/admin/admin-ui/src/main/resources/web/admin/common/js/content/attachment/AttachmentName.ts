import {Equitable} from "../../Equitable";
import {ObjectHelper} from "../../ObjectHelper";

export class AttachmentName implements Equitable {

        private fileName: string;

        constructor(fileName: string) {
            this.fileName = fileName;
        }

        equals(o: Equitable): boolean {
            if (!ObjectHelper.iFrameSafeInstanceOf(o, AttachmentName)) {
                return false;
            }

            var other = <AttachmentName>o;

            if (!ObjectHelper.stringEquals(this.fileName, other.fileName)) {
                return false;
            }

            return true;
        }

        toString(): string {
            return this.fileName;
        }
    }
