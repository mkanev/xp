import {Comparator} from "../../Comparator";
import {ExtraData} from "../ExtraData";

export class ExtraDataByMixinNameComparator implements Comparator<ExtraData> {

        compare(a: ExtraData, b: ExtraData): number {
            if (!a.getName()) {
                return 1;
            } else {
                var firstName = a.getName().getLocalName();
            }
            if (!b.getName()) {
                return -1;
            } else {
                var secondName = b.getName().getLocalName();
            }
            return firstName.localeCompare(secondName);
        }
    }
