import {TreeNode} from "../../ui/treegrid/TreeNode";
import {ContentTypeSummary} from "./ContentTypeSummary";
import {Comparator} from "../../Comparator";

export class ContentTypeSummaryByDisplayNameComparator implements Comparator<ContentTypeSummary> {

        compare(item1: ContentTypeSummary, item2: ContentTypeSummary):number {
            if (item1.getDisplayName().toLowerCase() > item2.getDisplayName().toLowerCase()) {
                return 1;
            } else if (item1.getDisplayName().toLowerCase() < item2.getDisplayName().toLowerCase()) {
                return -1;
            } else if (item1.getName() > item2.getName()) {
                return 1;
            } else if (item1.getName() < item2.getName()) {
                return -1;
            } else {
                return 0;
            }
        }
    }
