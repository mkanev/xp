import {GridColumn} from "../../../../../common/js/ui/grid/GridColumn";
import {GridColumnBuilder} from "../../../../../common/js/ui/grid/GridColumn";
import {ContentResponse} from "../../../../../common/js/content/resource/result/ContentResponse";
import {ContentSummary} from "../../../../../common/js/content/ContentSummary";
import {ContentSummaryBuilder} from "../../../../../common/js/content/ContentSummary";
import {ContentSummaryViewer} from "../../../../../common/js/content/ContentSummaryViewer";
import {TreeGrid} from "../../../../../common/js/ui/treegrid/TreeGrid";
import {TreeNode} from "../../../../../common/js/ui/treegrid/TreeNode";
import {TreeGridBuilder} from "../../../../../common/js/ui/treegrid/TreeGridBuilder";
import {ContentSummaryAndCompareStatusFetcher} from "../../../../../common/js/content/resource/ContentSummaryAndCompareStatusFetcher";
import {ContentSummaryAndCompareStatus} from "../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {Content} from "../../../../../common/js/content/Content";
import {Comparator} from "../../../../../common/js/Comparator";
import {ContentNodeByDisplayNameComparator} from "../../../../../common/js/content/util/ContentNodeByDisplayNameComparator";
import {ContentNodeByModifiedTimeComparator} from "../../../../../common/js/content/util/ContentNodeByModifiedTimeComparator";

export class CompareContentGrid extends TreeGrid<ContentSummaryAndCompareStatus> {

    private content: Content;

    constructor(content: Content) {
        super(new TreeGridBuilder<ContentSummaryAndCompareStatus>().setColumns([
                new GridColumnBuilder<TreeNode<ContentSummaryAndCompareStatus>>().setName("Name").setId("displayName").setField(
                    "displayName").setFormatter(this.nameFormatter).build()
            ]).setPartialLoadEnabled(true).setLoadBufferSize(20). // rows count
            prependClasses("compare-content-grid")
        );

        this.content = content;

        this.onLoaded(() => {
            this.selectAll();
        });
    }

    private nameFormatter(row: number, cell: number, value: any, columnDef: any, node: TreeNode<ContentSummaryAndCompareStatus>) {

        var viewer = <ContentSummaryViewer>node.getViewer("name");
        if (!viewer) {
            viewer = new ContentSummaryViewer();
            viewer.setObject(node.getData().getContentSummary());
            node.setViewer("name", viewer);
        }
        return viewer.toString();
    }

    fetchChildren(parentNode?: TreeNode<ContentSummaryAndCompareStatus>): wemQ.Promise<ContentSummaryAndCompareStatus[]> {
        var parentContentId = parentNode && parentNode.getData() ? parentNode.getData().getContentId() : null;
        return ContentSummaryAndCompareStatusFetcher.fetchChildren(parentContentId).then(
            (data: ContentResponse<ContentSummaryAndCompareStatus>) => {
                return data.getContents();
            });
    }

    hasChildren(elem: ContentSummaryAndCompareStatus): boolean {
        return elem.hasChildren();
    }

    getDataId(data: ContentSummaryAndCompareStatus): string {
        return data.getId();
    }

    refreshNodeData(parentNode: TreeNode<ContentSummaryAndCompareStatus>): wemQ.Promise<TreeNode<ContentSummaryAndCompareStatus>> {
        return ContentSummaryAndCompareStatusFetcher.fetch(parentNode.getData().getContentId()).then(
            (content: ContentSummaryAndCompareStatus) => {
                parentNode.setData(content);
                this.refreshNode(parentNode);
                return parentNode;
            });
    }

    sortNodeChildren(node: TreeNode<ContentSummaryAndCompareStatus>) {
        var comparator: Comparator<TreeNode<ContentSummaryAndCompareStatus>>;
        if (this.getRoot().getCurrentRoot() == node) {
            comparator = new ContentNodeByDisplayNameComparator();
        } else {
            comparator = new ContentNodeByModifiedTimeComparator();
        }
        var children: TreeNode<ContentSummaryAndCompareStatus>[] = node.getChildren().sort(comparator.compare);
        node.setChildren(children);
        this.initData(this.getRoot().getCurrentRoot().treeToList());
    }
}
