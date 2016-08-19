import {TreeNode} from "../../ui/treegrid/TreeNode";
import {Comparator} from "../../Comparator";
import {ContentSummaryAndCompareStatus} from "../ContentSummaryAndCompareStatus";

export class ContentNodeByModifiedTimeComparator implements Comparator<TreeNode<ContentSummaryAndCompareStatus>> {

        compare(a:TreeNode<ContentSummaryAndCompareStatus>, b:TreeNode<ContentSummaryAndCompareStatus>):number {
            var firstDate = !a.getData().getContentSummary() ? null : a.getData().getContentSummary().getModifiedTime(),
                secondDate = !b.getData().getContentSummary() ? null : b.getData().getContentSummary().getModifiedTime();
            return firstDate < secondDate ? 1 : (firstDate > secondDate) ? -1 : 0;
        }
    }
