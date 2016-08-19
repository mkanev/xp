import {TreeNode} from "../../ui/treegrid/TreeNode";
import {Comparator} from "../../Comparator";
import {ContentSummaryAndCompareStatus} from "../ContentSummaryAndCompareStatus";

export class ContentNodeByDisplayNameComparator implements Comparator<TreeNode<ContentSummaryAndCompareStatus>> {

        compare(a: TreeNode<ContentSummaryAndCompareStatus>, b: TreeNode<ContentSummaryAndCompareStatus>): number {
            if (!a.getData().getContentSummary()) {
                return 1;
            } else {
                var firstName = a.getData().getContentSummary().getDisplayName() || '';
            }
            if (!b.getData().getContentSummary()) {
                return -1;
            } else {
                var secondName = b.getData().getContentSummary().getDisplayName() || '';
            }
            return firstName.localeCompare(secondName);
        }
    }
