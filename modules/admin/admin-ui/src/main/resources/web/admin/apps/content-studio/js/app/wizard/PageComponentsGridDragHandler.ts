import {GridDragHandler} from "../../../../../common/js/ui/grid/GridDragHandler";
import {TreeNode} from "../../../../../common/js/ui/treegrid/TreeNode";
import {DragEventData} from "../../../../../common/js/ui/grid/GridDragHandler";
import {RegionView} from "../../../../../common/js/liveedit/RegionView";
import {ItemView} from "../../../../../common/js/liveedit/ItemView";
import {PageView} from "../../../../../common/js/liveedit/PageView";
import {ComponentView} from "../../../../../common/js/liveedit/ComponentView";
import {LayoutComponentView} from "../../../../../common/js/liveedit/layout/LayoutComponentView";
import {FragmentComponentView} from "../../../../../common/js/liveedit/fragment/FragmentComponentView";
import {Component} from "../../../../../common/js/content/page/region/Component";
import {DragHelper} from "../../../../../common/js/ui/DragHelper";
import {ElementHelper} from "../../../../../common/js/dom/ElementHelper";
import {Element} from "../../../../../common/js/dom/Element";
import {BrowserHelper} from "../../../../../common/js/BrowserHelper";
import {Highlighter} from "../../../../../common/js/liveedit/Highlighter";
import {Body} from "../../../../../common/js/dom/Body";
import {ItemViewContextMenuPosition} from "../../../../../common/js/liveedit/ItemViewContextMenuPosition";
import {ObjectHelper} from "../../../../../common/js/ObjectHelper";
import {TreeGrid} from "../../../../../common/js/ui/treegrid/TreeGrid";

export class PageComponentsGridDragHandler extends GridDragHandler<ItemView> {

    protected handleDragInit(e, dd) {
        var row = this.getRowByTarget(new ElementHelper(<HTMLElement>e.target)),
            nodes = this.contentGrid.getRoot().getCurrentRoot().treeToList(),
            draggedNode = nodes[row.getSiblingIndex()];

        if (draggedNode.getData().isDraggableView() && !BrowserHelper.isMobile()) { // prevent the grid from cancelling drag'n'drop by default
            e.stopImmediatePropagation();
        }
    }

    protected handleDragStart() {
        super.handleDragStart();

        Highlighter.get().hide();
        this.getDraggableItem().getChildren().forEach((childEl: Element) => {
            childEl.removeClass("selected");
        });

        DragHelper.get().setDropAllowed(true);

        Body.get().appendChild(DragHelper.get());
        Body.get().onMouseMove(this.handleHelperMove);

        this.contentGrid.onMouseLeave(this.handleMouseLeave);
        this.contentGrid.onMouseEnter(this.handleMouseEnter);
    }


    protected handleDragEnd(event: Event, data) {
        Body.get().unMouseMove(this.handleHelperMove);
        Body.get().removeChild(DragHelper.get());

        this.contentGrid.unMouseLeave(this.handleMouseLeave);
        this.contentGrid.unMouseEnter(this.handleMouseEnter);

        super.handleDragEnd(event, data);
    }

    protected handleBeforeMoveRows(event: Event, data): boolean {

        var dataList = this.contentGrid.getRoot().getCurrentRoot().treeToList();

        var draggableRow = data.rows[0],
            insertBefore = data.insertBefore;

        var insertPosition = (draggableRow > insertBefore) ? insertBefore : insertBefore + 1;

        this.updateDragHelperStatus(draggableRow, insertPosition, dataList);

        if (DragHelper.get().isDropAllowed()) {
            super.handleBeforeMoveRows(event, data);
        }
        return true;
    }

    protected handleMoveRows(event: Event, args: DragEventData) {
        if (DragHelper.get().isDropAllowed()) {
            super.handleMoveRows(event, args);
        }
    }

    protected makeMovementInNodes(draggableRow: number, insertBefore: number): number {

        var root = this.contentGrid.getRoot().getCurrentRoot();
        var dataList = root.treeToList();

        var item = dataList.slice(draggableRow, draggableRow + 1)[0];
        var insertPosition = (draggableRow > insertBefore) ? insertBefore : insertBefore + 1;

        this.moveIntoNewParent(item, insertPosition, dataList);

        dataList.splice(dataList.indexOf(item), 1);
        dataList.splice(insertBefore, 0, item);

        return dataList.indexOf(item);
    }


    protected getModelId(model: ItemView) {
        return model ? model.getItemId() : null;
    }

    protected handleMovements(rowDataId, moveBeforeRowDataId) {
        return;
    }

    protected moveIntoNewParent(item: TreeNode<ItemView>, insertBefore: number, data: TreeNode<ItemView>[]) {
        var insertData = this.getParentPosition(insertBefore, data),
            regionPosition = insertData.parentPosition,
            insertIndex = insertData.insertIndex;

        var newParent = data[regionPosition];

        if (newParent == item.getParent() && data.indexOf(item) < insertBefore) {
            insertIndex--;
        }

        this.contentGrid.deselectAll();
        item.getData().deselect();

        (<ComponentView<Component>>item.getData()).moveToRegion(<RegionView>newParent.getData(), insertIndex);

        item.getData().select(null, ItemViewContextMenuPosition.NONE);
        this.contentGrid.refresh();


        return data[regionPosition];
    }

    private updateDragHelperStatus(draggableRow: number, insertBeforePos: number, data: TreeNode<ItemView>[]) {

        var parentPosition = this.getParentPosition(insertBeforePos, data).parentPosition;

        var parentComponentNode = data[parentPosition],
            parentComponentView = parentComponentNode.getData(),
            draggableComponentView = data[draggableRow].getData();


        if (parentComponentView) {

            if (ObjectHelper.iFrameSafeInstanceOf(draggableComponentView, LayoutComponentView)) {
                if (parentComponentView.getName() != "main") {
                    DragHelper.get().setDropAllowed(false);
                    return;
                }
            }

            if (ObjectHelper.iFrameSafeInstanceOf(parentComponentView, RegionView)) {

                if (ObjectHelper.iFrameSafeInstanceOf(draggableComponentView, FragmentComponentView)) {
                    if (ObjectHelper.iFrameSafeInstanceOf(parentComponentView.getParentItemView(), LayoutComponentView)) {
                        if ((<FragmentComponentView> draggableComponentView).containsLayout()) {
                            // Fragment with layout over Layout region
                            DragHelper.get().setDropAllowed(false);
                            return;
                        }
                    }
                }

                DragHelper.get().setDropAllowed(true);

                var draggableItem = this.getDraggableItem();
                if (draggableItem) {
                    this.updateDraggableItemPosition(draggableItem, parentComponentNode.calcLevel());
                }
                return;
            }
        }
        DragHelper.get().setDropAllowed(false);
    }

    private updateDraggableItemPosition(draggableItem: Element, parentLevel: number) {
        var margin = parentLevel * TreeGrid.LEVEL_STEP_INDENT;
        var nodes = draggableItem.getEl().getElementsByClassName("toggle icon");

        if (nodes.length == 1) {
            nodes[0].setMarginLeft(margin + "px");
        }
    }


    private getParentPosition(insertBeforePos: number, data: TreeNode<ItemView>[]): InsertData {
        var parentPosition = insertBeforePos,
            insertIndex = 0;

        if (!data[insertBeforePos - 1]) {
            return {parentPosition: 0, insertIndex: 0};
        }

        var calcLevel = data[parentPosition - 1].calcLevel();

        var isFirstChildPosition = ( data[insertBeforePos]
                ? data[insertBeforePos - 1].calcLevel() < data[insertBeforePos].calcLevel()
                : false) ||
                                   (ObjectHelper.iFrameSafeInstanceOf(data[insertBeforePos - 1].getData(), RegionView));

        do {

            parentPosition = parentPosition <= 0 ? 0 : parentPosition - 1;


            var parentComponentNode = data[parentPosition],
                parentComponentView = parentComponentNode.getData();

            if (parentComponentNode.calcLevel() == calcLevel && !isFirstChildPosition) {
                insertIndex++;
            }


        } while (!(ObjectHelper.iFrameSafeInstanceOf(parentComponentView, RegionView) ||

                 ( ObjectHelper.iFrameSafeInstanceOf(parentComponentView, LayoutComponentView) &&  // lets drag items inside the 'main' region between layouts
                   (parentComponentNode.isExpanded() && parentComponentNode.getChildren().length > 0) ) ||

                 ObjectHelper.iFrameSafeInstanceOf(parentComponentView, PageView))

                 || (parentComponentNode.calcLevel() >= calcLevel && !isFirstChildPosition));

        return {parentPosition: parentPosition, insertIndex: insertIndex};
    }

    private getRowByTarget(el: ElementHelper): ElementHelper {

        return (el && el.hasClass("slick-row")) ? el : this.getRowByTarget(el.getParent());
    }

    private handleMouseLeave() {
        DragHelper.get().setVisible(false);
    }

    private handleMouseEnter() {
        DragHelper.get().setVisible(true);
    }


    private handleHelperMove(event: MouseEvent) {
        DragHelper.get().getEl().setLeftPx(event.pageX);
        DragHelper.get().getEl().setTopPx(event.pageY);
    }

}


export interface InsertData {
    parentPosition: number;
    insertIndex: number;
}
