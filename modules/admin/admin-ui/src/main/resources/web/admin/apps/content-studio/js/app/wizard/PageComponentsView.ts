import {ItemViewSelectedEvent} from "../../../../../common/js/liveedit/ItemViewSelectedEvent";
import {ItemViewDeselectedEvent} from "../../../../../common/js/liveedit/ItemViewDeselectedEvent";
import {LiveComponentAddedEvent as ComponentAddedEvent} from "../../../../../common/js/liveedit/LiveComponentAddedEvent";
import {LiveComponentRemovedEvent as ComponentRemovedEvent} from "../../../../../common/js/liveedit/LiveComponentRemovedEvent";
import {ComponentLoadedEvent} from "../../../../../common/js/liveedit/ComponentLoadedEvent";
import {LiveComponentResetEvent as ComponentResetEvent} from "../../../../../common/js/liveedit/LiveComponentResetEvent";
import {Content} from "../../../../../common/js/content/Content";
import {TreeGrid} from "../../../../../common/js/ui/treegrid/TreeGrid";
import {TreeNode} from "../../../../../common/js/ui/treegrid/TreeNode";
import {PageView} from "../../../../../common/js/liveedit/PageView";
import {ItemView} from "../../../../../common/js/liveedit/ItemView";
import {TextComponentView} from "../../../../../common/js/liveedit/text/TextComponentView";
import {FragmentComponentView} from "../../../../../common/js/liveedit/fragment/FragmentComponentView";
import {Mask} from "../../../../../common/js/ui/mask/Mask";
import {Highlighter} from "../../../../../common/js/liveedit/Highlighter";
import {ResponsiveManager} from "../../../../../common/js/ui/responsive/ResponsiveManager";
import {ResponsiveItem} from "../../../../../common/js/ui/responsive/ResponsiveItem";
import {ResponsiveRanges} from "../../../../../common/js/ui/responsive/ResponsiveRanges";
import {DivEl} from "../../../../../common/js/dom/DivEl";
import {ItemViewContextMenu} from "../../../../../common/js/liveedit/ItemViewContextMenu";
import {H3El} from "../../../../../common/js/dom/H3El";
import {AppHelper} from "../../../../../common/js/util/AppHelper";
import {CloseButton} from "../../../../../common/js/ui/button/CloseButton";
import {H2El} from "../../../../../common/js/dom/H2El";
import {Body} from "../../../../../common/js/dom/Body";
import {ObjectHelper} from "../../../../../common/js/ObjectHelper";
import {ElementHelper} from "../../../../../common/js/dom/ElementHelper";
import {DragHelper} from "../../../../../common/js/ui/DragHelper";
import {BrowserHelper} from "../../../../../common/js/BrowserHelper";
import {WindowDOM} from "../../../../../common/js/dom/WindowDOM";
import {Position} from "../../../../../common/js/liveedit/Position";
import {Action} from "../../../../../common/js/ui/Action";

import {LiveEditPageProxy} from "./page/LiveEditPageProxy";
import {PageComponentsTreeGrid} from "./PageComponentsTreeGrid";

export class PageComponentsView extends DivEl {

    private content: Content;
    private pageView: PageView;
    private liveEditPage: LiveEditPageProxy;
    private contextMenu: ItemViewContextMenu;

    private responsiveItem: ResponsiveItem;

    private tree: PageComponentsTreeGrid;
    private header: H3El;
    private modal: boolean;
    private floating: boolean;
    private draggable: boolean;
    private clicked: boolean;

    private mask: Mask;

    private selectionChangedHandler: (treeNode: TreeNode<ItemView>) =>
        void = AppHelper.debounce(this.selectItem, 500, this.clicked);

    private beforeInsertActionListeners: {(event):void}[] = [];

    private mouseDownListener: (event: MouseEvent) => void;
    private mouseUpListener: (event?: MouseEvent) => void;
    private mouseMoveListener: (event: MouseEvent) => void;
    private clickListener: (event, data) => void;
    private mouseDown: boolean = false;
    public static debug: boolean = false;

    constructor(liveEditPage: LiveEditPageProxy) {
        super('page-components-view');

        this.liveEditPage = liveEditPage;

        this.onHidden((event) => this.hideContextMenu());

        var closeButton = new CloseButton();
        closeButton.onClicked((event: MouseEvent) => this.hide());

        this.onRemoved(() => {
            if (this.contextMenu) {
                this.contextMenu.remove();
            }
        });

        this.header = new H2El('header');
        this.header.setHtml('Components');

        this.appendChildren(closeButton, this.header);

        this.setModal(false).setFloating(true).setDraggable(true);

        this.onShown((event) => {
            this.constrainToParent();
            this.getHTMLElement().style.display = "";
            if (this.pageView && this.pageView.isLocked()) {
                this.mask.show();
            }
        });

        this.responsiveItem = ResponsiveManager.onAvailableSizeChanged(Body.get(), (item: ResponsiveItem) => {
            var smallSize = item.isInRangeOrSmaller(ResponsiveRanges._360_540);
            if (!smallSize && this.isVisible()) {
                this.constrainToParent();
            }
            if (item.isRangeSizeChanged()) {
                this.setModal(smallSize).setDraggable(!smallSize);
            }
        });
    }

    setPageView(pageView: PageView) {

        if (this.mask) {
            this.destroyMask();
        }

        this.pageView = pageView;
        if (!this.tree && this.content && this.pageView) {

            this.createTree(this.content, this.pageView);
            this.initMask();

        } else if (this.tree) {

            this.tree.deselectAll();

            this.tree.setPageView(pageView).then(() => {
                this.initMask();
            });
        }

        this.pageView.onRemoved(() => {
            ResponsiveManager.unAvailableSizeChangedByItem(this.responsiveItem);
        });

        this.pageView.onPageLocked(this.pageLockedHandler.bind(this));
    }

    private destroyMask() {
        this.mask.remove();
        this.mask = null;

        if (this.pageView) {
            this.pageView.unPageLocked(this.pageLockedHandler.bind(this));
        }
    }

    private initMask() {
        this.mask = new Mask(this.tree);
        this.appendChild(this.mask);

        if (this.pageView.isLocked()) {
            this.mask.show();
        }

        this.mask.onContextMenu((event: MouseEvent) => this.maskClickHandler(event));
        this.mask.onClicked((event: MouseEvent) => this.maskClickHandler(event));
    }

    setContent(content: Content) {
        this.content = content;
        if (!this.tree && this.content && this.pageView) {
            this.createTree(this.content, this.pageView);
        }
    }

    private createTree(content: Content, pageView: PageView) {
        this.tree = new PageComponentsTreeGrid(content, pageView);

        this.liveEditPage.onItemViewSelected((event: ItemViewSelectedEvent) => {
            if (!event.isNew() && !this.pageView.isLocked()) {
                var selectedItemId = this.tree.getDataId(event.getItemView());
                this.tree.selectNode(selectedItemId);
                this.tree.getGrid().focus();
            }
        });

        this.liveEditPage.onItemViewDeselected((event: ItemViewDeselectedEvent) => {
            this.tree.deselectNodes([this.tree.getDataId(event.getItemView())]);
        });

        this.liveEditPage.onComponentAdded((event: ComponentAddedEvent) => {
            var parentNode = this.tree.getRoot().getCurrentRoot().findNode(this.tree.getDataId(event.getParentRegionView()));
            if (parentNode) {
                // deselect all otherwise node is going to be added as child to selection (that is weird btw)
                this.tree.deselectAll();
                var index = event.getParentRegionView().getComponentViews().indexOf(event.getComponentView());
                if (index >= 0) {
                    this.tree.insertNode(event.getComponentView(), false, index, parentNode).then(() => {
                        // expand parent node to show added one
                        this.tree.expandNode(parentNode);

                        if (event.getComponentView().isSelected()) {
                            this.tree.selectNode(this.tree.getDataId(event.getComponentView()));
                        }

                        if (this.tree.hasChildren(event.getComponentView())) {
                            var componentNode = this.tree.getRoot().getCurrentRoot().findNode(
                                this.tree.getDataId(event.getComponentView()));
                            this.tree.expandNode(componentNode, true);
                        }

                        if (ObjectHelper.iFrameSafeInstanceOf(event.getComponentView(), TextComponentView)) {
                            this.bindTreeTextNodeUpdateOnTextComponentModify(<TextComponentView>event.getComponentView());
                        }
                        if (ObjectHelper.iFrameSafeInstanceOf(event.getComponentView(), FragmentComponentView)) {
                            this.bindTreeFragmentNodeUpdateOnComponentLoaded(<FragmentComponentView>event.getComponentView());
                        }

                        this.constrainToParent();
                    });
                }
            }
        });

        this.liveEditPage.onComponentRemoved((event: ComponentRemovedEvent) => {
            this.tree.deleteNode(event.getComponentView());
            // update parent node in case it was the only child
            this.tree.updateNode(event.getParentRegionView()).then(() => {
                this.tree.refresh();
            });

        });

        this.liveEditPage.onComponentLoaded((event: ComponentLoadedEvent) => {
            var oldDataId = this.tree.getDataId(event.getOldComponentView());

            var oldNode = this.tree.getRoot().getCurrentRoot().findNode(oldDataId);
            oldNode.removeChildren();

            this.tree.updateNode(event.getNewComponentView(), oldDataId).then(() => {
                var newDataId = this.tree.getDataId(event.getNewComponentView());

                if (this.tree.hasChildren(event.getNewComponentView())) {
                    // expand new node as it has children
                    var newNode = this.tree.getRoot().getCurrentRoot().findNode(newDataId);
                    this.tree.expandNode(newNode, true);
                }

                if (event.getNewComponentView().isSelected()) {
                    this.tree.selectNode(newDataId);
                    this.scrollToItem(newDataId);
                }

                if (ObjectHelper.iFrameSafeInstanceOf(event.getNewComponentView(), TextComponentView)) {
                    this.bindTreeTextNodeUpdateOnTextComponentModify(<TextComponentView>event.getNewComponentView());
                }
                if (ObjectHelper.iFrameSafeInstanceOf(event.getNewComponentView(), FragmentComponentView)) {
                    this.bindTreeFragmentNodeUpdateOnComponentLoaded(<FragmentComponentView>event.getNewComponentView());
                }
            });
        });

        this.liveEditPage.onComponentReset((event: ComponentResetEvent) => {
            var oldDataId = this.tree.getDataId(event.getOldComponentView());

            if (this.tree.hasChildren(event.getOldComponentView())) {
                var oldNode = this.tree.getRoot().getCurrentRoot().findNode(oldDataId);
                oldNode.removeChildren();
                this.tree.refreshNode(oldNode);
            }

            this.tree.updateNode(event.getNewComponentView(), oldDataId).then(() => {

                if (event.getNewComponentView().isSelected()) {
                    var newDataId = this.tree.getDataId(event.getNewComponentView());
                    this.tree.selectNode(newDataId);
                }
            });
        });

        this.clickListener = (event, data) => {
            var elem = new ElementHelper(event.target);

            if (this.sameRowClicked(data.row)) {
                this.hideContextMenu();
            } else {
                this.clicked = true;
            }

            if (elem.hasClass('toggle')) {
                // do nothing if expand toggle is clicked
                return;
            }

            this.tree.getGrid().selectRow(data.row);

            Highlighter.get().hide();

            if (this.isMenuIconClicked(data.cell)) {
                this.showContextMenu(data.row, {x: event.pageX, y: event.pageY});
            }

            if (this.isModal()) {
                this.hide();
            }
        };

        this.tree.getGrid().subscribeOnClick(this.clickListener);

        this.tree.getGrid().subscribeOnMouseEnter((event, data) => {

            if (DragHelper.get().isVisible()) {
                return;
            }

            var rowElement = event.target,
                selected = false;

            while (!rowElement.classList.contains("slick-row")) {
                if (rowElement.classList.contains("selected")) {
                    selected = true;
                }

                rowElement = rowElement.parentElement;
            }

            if (!this.pageView.isLocked()) {
                this.highlightRow(rowElement, selected);
                if (this.isMenuIcon(event.target) && BrowserHelper.isIOS()) {
                    this.showContextMenu(new ElementHelper(rowElement).getSiblingIndex(), {x: event.pageX, y: event.pageY});
                }
            }
        });

        this.tree.getGrid().subscribeOnMouseLeave((event, data) => {
            Highlighter.get().hide();
        });

        this.tree.onSelectionChanged((data, nodes) => {
            if (nodes.length > 0 && this.isModal()) {
                this.hide();
            }

            var treeNode = data[0];

            if (treeNode && !treeNode.getData().isSelected()) {
                this.clicked ? this.selectItem(treeNode) : //immediate
                this.selectionChangedHandler(treeNode); // with timeout
                this.clicked = false;
            }

            this.hideContextMenu();
        });

        this.tree.getGrid().subscribeOnContextMenu((event) => {
            event.stopPropagation();
            event.preventDefault();

            var cell = this.tree.getGrid().getCellFromEvent(event);

            this.showContextMenu(cell.row, {x: event.pageX, y: event.pageY});
        });

        this.appendChild(this.tree);

        this.tree.onRemoved((event) => this.tree.getGrid().unsubscribeOnClick(this.clickListener));

        this.tree.onLoaded(() => this.bindTextComponentViewsUpdateOnTextModify());
    }

    private isMenuIcon(element: HTMLElement): boolean {
        if (!!element && !!element.className && element.className.indexOf("menu-icon") > -1) {
            return true;
        }
        return false;
    }

    private bindTextComponentViewsUpdateOnTextModify() {
        this.tree.getGrid().getDataView().getItems().map((dataItem) => {
            return dataItem.getData();
        }).filter((itemView: ItemView) => {
            return ObjectHelper.iFrameSafeInstanceOf(itemView, TextComponentView);
        }).forEach((textComponentView: TextComponentView) => {
            this.bindTreeTextNodeUpdateOnTextComponentModify(textComponentView);
        });
    }

    private bindTreeTextNodeUpdateOnTextComponentModify(textComponentView: TextComponentView) {
        var handler = () => this.tree.updateNode(textComponentView);

        textComponentView.onKeyUp(handler);
        textComponentView.getHTMLElement().onpaste = handler;
    }

    private bindTreeFragmentNodeUpdateOnComponentLoaded(fragmentComponentView: FragmentComponentView) {
        fragmentComponentView.onFragmentContentLoaded((e)=> {
            this.tree.updateNode(e.getFragmentComponentView())
        });
    }

    private selectItem(treeNode: TreeNode<ItemView>) {
        treeNode.getData().selectWithoutMenu();
        this.scrollToItem(treeNode.getDataId());
    }

    isDraggable(): boolean {
        return this.draggable;
    }

    setDraggable(draggable: boolean): PageComponentsView {
        var body = Body.get();
        if (!this.draggable && draggable) {
            var lastPos;
            if (!this.mouseDownListener) {
                this.mouseDownListener = (event: MouseEvent) => {
                    if (PageComponentsView.debug) {
                        console.log('mouse down', this.mouseDown, event);
                    }
                    if (!this.mouseDown && event.buttons == 1) {
                        // left button was clicked
                        event.preventDefault();
                        event.stopPropagation();
                        this.mouseDown = true;
                        lastPos = {
                            x: event.clientX,
                            y: event.clientY
                        };
                    }
                }
            }
            if (!this.mouseUpListener) {
                this.mouseUpListener = (event?: MouseEvent) => {
                    if (PageComponentsView.debug) {
                        console.log('mouse up', this.mouseDown, event);
                    }
                    if (this.mouseDown) {
                        // left button was released
                        if (event) {
                            event.preventDefault();
                            event.stopPropagation();
                        }

                        this.mouseDown = false;
                    }
                }
            }
            if (!this.mouseMoveListener) {
                this.mouseMoveListener = (event: MouseEvent) => {
                    if (this.mouseDown) {
                        if (event.buttons != 1) {
                            // button was probably released outside browser window
                            this.mouseUpListener();
                            return;
                        }
                        event.preventDefault();
                        event.stopPropagation();

                        var el = this.getEl(),
                            newPos = {
                                x: event.clientX,
                                y: event.clientY
                            },
                            offset = el.getOffset(),
                            newOffset = {
                                top: offset.top + newPos.y - lastPos.y,
                                left: offset.left + newPos.x - lastPos.x
                            };

                        this.constrainToParent(newOffset);

                        lastPos = newPos;

                        this.hideContextMenu();
                    }
                }
            }
            this.header.onMouseDown(this.mouseDownListener);
            body.onMouseUp(this.mouseUpListener);
            body.onMouseMove(this.mouseMoveListener);
        } else if (this.draggable && !draggable) {
            this.header.unMouseDown(this.mouseDownListener);
            body.unMouseUp(this.mouseUpListener);
            body.unMouseMove(this.mouseMoveListener);
        }
        this.toggleClass('draggable', draggable);
        this.draggable = draggable;
        return this;
    }

    private constrainToParent(offset?: {top: number; left: number}) {

        var parentEl, parentOffset,
            el = this.getEl(),
            offset = offset || el.getOffset();

        if (this.getParentElement()) {
            parentEl = this.getParentElement().getEl();
            parentOffset = parentEl.getOffset();
        }
        else {
            parentEl = WindowDOM.get();
            parentOffset = {
                top: 0,
                left: 0
            }
        }

        el.setMaxHeightPx(parentEl.getHeight());

        el.setOffset({
            top: Math.max(parentOffset.top,
                Math.min(offset.top, parentOffset.top + parentEl.getHeight() - el.getHeightWithBorder())),
            left: Math.max(parentOffset.left,
                Math.min(offset.left, parentOffset.left + parentEl.getWidth() - el.getWidthWithBorder()))
        });
    }

    isFloating(): boolean {
        return this.floating;
    }

    setFloating(floating: boolean): PageComponentsView {
        this.toggleClass('floating', floating);
        this.floating = floating;
        return this;
    }

    isModal(): boolean {
        return this.modal;
    }

    setModal(modal: boolean): PageComponentsView {
        this.toggleClass('modal', modal);
        if (this.tree) {
            // tree may not be yet initialized
            this.tree.getGrid().resizeCanvas();
        }
        this.modal = modal;
        return this;
    }

    private scrollToItem(dataId: string) {
        var node = this.tree.getRoot().getCurrentRoot().findNode(dataId);

        if (node) {
            node.getData().scrollComponentIntoView();
            this.tree.scrollToRow(this.tree.getGrid().getDataView().getRowById(node.getId()));
        }
    }

    private pageLockedHandler(value: boolean) {
        if (this.mask) {
            if (value) {
                this.mask.show();
            } else {
                this.mask.hide();
            }
        }
    }

    private maskClickHandler(event: MouseEvent) {
        event.stopPropagation();
        event.preventDefault();

        if (this.contextMenu && this.contextMenu.isVisible()) {
            this.hideContextMenu();
        } else {
            this.showContextMenu(null, {x: event.pageX, y: event.pageY});
        }
    }


    private isMenuIconClicked(cellNumber: number): boolean {
        return cellNumber == 1;
    }

    //
    private showContextMenu(row: number, clickPosition: Position) {
        var node = this.tree.getGrid().getDataView().getItem(row);
        if (node) {
            var itemView: ItemView = node.getData(),
                pageView: PageView = itemView.getPageView();
        } else {
            pageView = this.pageView;
        }
        var contextMenuActions: Action[];

        if (pageView.isLocked()) {
            contextMenuActions = pageView.getLockedMenuActions();
        } else {
            contextMenuActions = itemView.getContextMenuActions();
        }

        if (!this.contextMenu) {
            this.contextMenu = new ItemViewContextMenu(null, contextMenuActions, false, false);
            this.contextMenu.onHidden(this.removeMenuOpenStyleFromMenuIcon.bind(this));
        } else {
            this.contextMenu.setActions(contextMenuActions);
        }

        this.contextMenu.getMenu().onBeforeAction((action: Action) => {
            this.pageView.setDisabledContextMenu(true);
            if (action.hasParentAction() && action.getParentAction().getLabel() == "Insert") {
                this.notifyBeforeInsertAction();
            }
        });

        this.contextMenu.getMenu().onAfterAction((action: Action) => {
            this.hidePageComponentsIfInMobileView(action);

            setTimeout(() => {
                this.pageView.setDisabledContextMenu(false);
                this.contextMenu.getMenu().clearActionListeners();
            }, 500);
        });

        this.setMenuOpenStyleOnMenuIcon(row);

        // show menu at position
        var x = clickPosition.x;
        var y = clickPosition.y;

        this.contextMenu.showAt(x, y, false);
    }

    private hidePageComponentsIfInMobileView(action: Action) {
        if (BrowserHelper.isMobile() && ((action.hasParentAction() && action.getParentAction().getLabel() == "Insert")
                                             || action.getLabel() == "Inspect" || action.getLabel() == "Edit" ||
                                             action.getLabel() == "Duplicate")) {
            this.hide();
        }
    }

    private setMenuOpenStyleOnMenuIcon(row: number) {
        var stylesHash: Slick.CellCssStylesHash = {};
        stylesHash[row] = {menu: "menu-open"};
        this.tree.getGrid().setCellCssStyles("menu-open", stylesHash);
    }

    private removeMenuOpenStyleFromMenuIcon() {
        this.tree.getGrid().removeCellCssStyles("menu-open");
    }

    private hideContextMenu() {
        if (this.contextMenu && this.contextMenu.isVisible()) {
            this.contextMenu.hide();
        }
    }

    private sameRowClicked(clickedRow: number): boolean {
        var currentlySelectedRow = this.tree.getGrid().getSelectedRows()[0];
        return clickedRow == currentlySelectedRow;
    }

    private highlightRow(rowElement: HTMLElement, selected: boolean): void {
        if (selected) {
            Highlighter.get().hide();
        }
        else {
            var elementHelper = new ElementHelper(rowElement);
            var dimensions = elementHelper.getDimensions();
            var nodes = this.tree.getRoot().getCurrentRoot().treeToList(),
                hoveredNode = nodes[new ElementHelper(rowElement).getSiblingIndex()];

            if (hoveredNode) {
                var data = hoveredNode.getData();
                if (/*data.getType().isComponentType() && */!BrowserHelper.isMobile()) {
                    Highlighter.get().highlightElement(dimensions,
                        data.getType().getConfig().getHighlighterStyle());
                }
                if (BrowserHelper.isIOS()) {
                    this.selectItem(hoveredNode);
                }
            }
        }
    }

    onBeforeInsertAction(listener: (event)=>void) {
        this.beforeInsertActionListeners.push(listener);
    }

    unBeforeInsertAction(listener: (event)=>void) {
        this.beforeInsertActionListeners = this.beforeInsertActionListeners.filter((currentListener: (event)=>void)=> {
            return listener != currentListener
        });
    }

    private notifyBeforeInsertAction() {
        this.beforeInsertActionListeners.forEach((listener: (event)=>void)=> {
            listener.call(this);
        });
    }


}
