import {Comparator} from "../../Comparator";
import {ContentSummary} from "../ContentSummary";

export class ContentByPathComparator implements Comparator<ContentSummary> {

        compare(a: ContentSummary, b: ContentSummary): number {
            if (!a) {
                return 1;
            } else {
                var firstName = a.getPath().toString();
            }
            if (!b) {
                return -1;
            } else {
                var secondName = b.getPath().toString();
            }
            return firstName.localeCompare(secondName);
        }
    }
