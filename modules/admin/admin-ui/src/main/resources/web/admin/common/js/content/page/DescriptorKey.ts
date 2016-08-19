import {Equitable} from "../../Equitable";
import {ApplicationKey} from "../../application/ApplicationKey";
import {ObjectHelper} from "../../ObjectHelper";
import {DescriptorName} from "./DescriptorName";

export class DescriptorKey implements Equitable {

        private static SEPARATOR = ":";

        private applicationKey: ApplicationKey;

        private name: DescriptorName;

        private refString: string;

        public static fromString(str: string): DescriptorKey {
            var sepIndex: number = str.indexOf(DescriptorKey.SEPARATOR);
            if (sepIndex == -1) {
                throw new Error("DescriptorKey must contain separator '" + DescriptorKey.SEPARATOR + "':" + str);
            }

            var applicationKey = str.substring(0, sepIndex);
            var name = str.substring(sepIndex + 1, str.length);

            return new DescriptorKey(ApplicationKey.fromString(applicationKey), new DescriptorName(name));
        }

        constructor(applicationKey: ApplicationKey, name: DescriptorName) {
            this.applicationKey = applicationKey;
            this.name = name;
            this.refString = applicationKey.toString() + DescriptorKey.SEPARATOR + name.toString();
        }

        getApplicationKey(): ApplicationKey {
            return this.applicationKey;
        }

        getName(): DescriptorName {
            return this.name;
        }

        toString(): string {
            return this.refString;
        }

        equals(o: Equitable): boolean {

            if (!ObjectHelper.iFrameSafeInstanceOf(o, DescriptorKey)) {
                return false;
            }

            var other = <DescriptorKey>o;

            if (!ObjectHelper.stringEquals(this.refString, other.refString)) {
                return false;
            }

            return true;
        }
    }
