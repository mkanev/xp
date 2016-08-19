import {Element} from "../../../../../common/js/dom/Element";
import {ElementHelper} from "../../../../../common/js/dom/ElementHelper";
import {GridColumn} from "../../../../../common/js/ui/grid/GridColumn";
import {GridColumnBuilder} from "../../../../../common/js/ui/grid/GridColumn";
import {TreeGrid} from "../../../../../common/js/ui/treegrid/TreeGrid";
import {TreeNode} from "../../../../../common/js/ui/treegrid/TreeNode";
import {TreeGridBuilder} from "../../../../../common/js/ui/treegrid/TreeGridBuilder";
import {DateTimeFormatter} from "../../../../../common/js/ui/treegrid/DateTimeFormatter";
import {TreeGridContextMenu} from "../../../../../common/js/ui/treegrid/TreeGridContextMenu";
import {ContentResponse} from "../../../../../common/js/content/resource/result/ContentResponse";
import {ContentSummary} from "../../../../../common/js/content/ContentSummary";
import {ContentSummaryBuilder} from "../../../../../common/js/content/ContentSummary";
import {ContentSummaryViewer} from "../../../../../common/js/content/ContentSummaryViewer";
import {ContentSummaryAndCompareStatus} from "../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {ContentSummaryAndCompareStatusFetcher} from "../../../../../common/js/content/resource/ContentSummaryAndCompareStatusFetcher";
import {ChildOrder} from "../../../../../common/js/content/order/ChildOrder";
import {CompareStatus} from "../../../../../common/js/content/CompareStatus";
import {CompareStatusFormatter} from "../../../../../common/js/content/CompareStatus";
import {ContentId} from "../../../../../common/js/content/ContentId";
import {SpanEl} from "../../../../../common/js/dom/SpanEl";
import {StringHelper} from "../../../../../common/js/util/StringHelper";
import {DivEl} from "../../../../../common/js/dom/DivEl";

export class SortContentTreeGrid extends TreeGrid<ContentSummaryAndCompareStatus> {

    private contentId: ContentId;

    private curChildOrder: ChildOrder;

    static MAX_FETCH_SIZE: number = 30;

    constructor() {
        var nameColumn = new GridColumnBuilder<TreeNode<ContentSummaryAndCompareStatus>>().setName("Name").setId("displayName").setField(
            "contentSummary.displayName").setMinWidth(130).setFormatter(this.nameFormatter).setBehavior("selectAndMove").build();
        var modifiedTimeColumn = new GridColumnBuilder<TreeNode<ContentSummaryAndCompareStatus>>().setName("ModifiedTime").setId(
            "modifiedTime").setField("contentSummary.modifiedTime").setCssClass("modified").setMinWidth(150).setMaxWidth(170).setFormatter(
            DateTimeFormatter.format).setBehavior("selectAndMove").build();

        super(new TreeGridBuilder<ContentSummaryAndCompareStatus>().setColumns([
                nameColumn,
                modifiedTimeColumn
            ]).setPartialLoadEnabled(true).setCheckableRows(false).setShowToolbar(false).setDragAndDrop(true).disableMultipleSelection(
            true).prependClasses("content-tree-grid").setSelectedCellCssClass("selected-sort-row")
        );

    }

    private statusFormatter(row: number, cell: number, value: any, columnDef: any, node: TreeNode<ContentSummaryAndCompareStatus>) {

        if (!node.getData().getContentSummary()) {
            return "";
        }

        var compareLabel: string = CompareStatus[value];
        return CompareStatusFormatter.formatStatus(CompareStatus[compareLabel]);
    }

    private dragFormatter(row: number, cell: number, value: any, columnDef: any, node: TreeNode<ContentSummaryAndCompareStatus>) {
        var wrapper = new SpanEl();

        if (!StringHelper.isBlank(value)) {
            wrapper.getEl().setTitle(value);
        }

        var icon = new DivEl("icon-menu3 drag-icon");
        wrapper.getEl().setInnerHtml(icon.toString(), false);
        return wrapper.toString();
    }

    private nameFormatter(row: number, cell: number, value: any, columnDef: any, node: TreeNode<ContentSummaryAndCompareStatus>) {
        const data = node.getData();
        if (data.getContentSummary()) {
            var viewer: ContentSummaryViewer = <ContentSummaryViewer>node.getViewer("name");
            if (!viewer) {
                viewer = new ContentSummaryViewer();
                viewer.setObject(node.getData().getContentSummary(), node.calcLevel() > 1);
                node.setViewer("name", viewer);
            }
            return viewer.toString();

        }

        return "";
    }

    isEmptyNode(node: TreeNode<ContentSummaryAndCompareStatus>): boolean {
        const data = node.getData();
        return !data.getContentSummary();
    }

    sortNodeChildren(node: TreeNode<ContentSummaryAndCompareStatus>) {
        this.initData(this.getRoot().getCurrentRoot().treeToList());
    }

    fetchChildren(): wemQ.Promise<ContentSummaryAndCompareStatus[]> {
        var parentContentId: ContentId;
        var parentNode = this.getRoot().getCurrentRoot();
        if (parentNode.getData()) {
            parentContentId = parentNode.getData().getContentSummary().getContentId();
            this.contentId = parentContentId;
            parentNode.setData(null);
        } else {
            parentContentId = this.contentId;
        }

        var from = parentNode.getChildren().length;
        if (from > 0 && !parentNode.getChildren()[from - 1].getData().getContentSummary()) {
            parentNode.getChildren().pop();
            from--;
        }

        return ContentSummaryAndCompareStatusFetcher.fetchChildren(parentContentId, from, SortContentTreeGrid.MAX_FETCH_SIZE,
            this.curChildOrder).then((data: ContentResponse<ContentSummaryAndCompareStatus>) => {
            var contents = parentNode.getChildren().map((el) => {
                return el.getData();
            }).slice(0, from).concat(data.getContents());
            var meta = data.getMetadata();
            parentNode.setMaxChildren(meta.getTotalHits());
            if (from + meta.getHits() < meta.getTotalHits()) {
                contents.push(new ContentSummaryAndCompareStatus());
            }
            return contents;
        });

    }

    hasChildren(data: ContentSummaryAndCompareStatus): boolean {
        return data.hasChildren();
    }

    getDataId(data: ContentSummaryAndCompareStatus): string {
        return data.getId();
    }

    getContentId() {
        return this.contentId;
    }

    getChildOrder(): ChildOrder {
        return this.curChildOrder;
    }

    setChildOrder(value: ChildOrder) {
        this.curChildOrder = value;
    }


}
