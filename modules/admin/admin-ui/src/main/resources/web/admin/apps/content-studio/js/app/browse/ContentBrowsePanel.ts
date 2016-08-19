import {TreeNode} from "../../../../../common/js/ui/treegrid/TreeNode";
import {BrowseItem} from "../../../../../common/js/app/browse/BrowseItem";
import {UploadItem} from "../../../../../common/js/ui/uploader/UploadItem";
import {ContentSummary} from "../../../../../common/js/content/ContentSummary";
import {ContentSummaryBuilder} from "../../../../../common/js/content/ContentSummary";
import {ContentSummaryAndCompareStatus} from "../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {ContentSummaryAndCompareStatusFetcher} from "../../../../../common/js/content/resource/ContentSummaryAndCompareStatusFetcher";
import {CompareStatus} from "../../../../../common/js/content/CompareStatus";
import {ResponsiveManager} from "../../../../../common/js/ui/responsive/ResponsiveManager";
import {ResponsiveRanges} from "../../../../../common/js/ui/responsive/ResponsiveRanges";
import {ResponsiveItem} from "../../../../../common/js/ui/responsive/ResponsiveItem";
import {ContentPath} from "../../../../../common/js/content/ContentPath";
import {NodeServerChangeType} from "../../../../../common/js/event/NodeServerChange";
import {BatchContentRequest} from "../../../../../common/js/content/resource/BatchContentRequest";
import {ContentId} from "../../../../../common/js/content/ContentId";
import {BatchContentServerEvent} from "../../../../../common/js/content/event/BatchContentServerEvent";
import {ContentDeletedEvent} from "../../../../../common/js/content/event/ContentDeletedEvent";
import {ContentServerEventsHandler} from "../../../../../common/js/content/event/ContentServerEventsHandler";
import {DataChangedEvent} from "../../../../../common/js/ui/treegrid/DataChangedEvent";
import {BrowsePanel} from "../../../../../common/js/app/browse/BrowsePanel";
import {SplitPanel} from "../../../../../common/js/ui/panel/SplitPanel";
import {SplitPanelBuilder} from "../../../../../common/js/ui/panel/SplitPanel";
import {SplitPanelAlignment} from "../../../../../common/js/ui/panel/SplitPanel";
import {SplitPanelUnit} from "../../../../../common/js/ui/panel/SplitPanel";
import {IsRenderableRequest} from "../../../../../common/js/content/page/IsRenderableRequest";
import {ViewItem} from "../../../../../common/js/app/view/ViewItem";
import {TreeGridItemClickedEvent} from "../../../../../common/js/ui/treegrid/TreeGridItemClickedEvent";
import {ContentIconUrlResolver} from "../../../../../common/js/content/util/ContentIconUrlResolver";
import {PortalUriHelper} from "../../../../../common/js/rendering/PortalUriHelper";
import {RenderingMode} from "../../../../../common/js/rendering/RenderingMode";
import {Branch} from "../../../../../common/js/content/Branch";
import {ContentServerChangeItem} from "../../../../../common/js/content/event/ContentServerChange";

import {ContentTreeGridActions} from "./action/ContentTreeGridActions";
import {ContentBrowseToolbar} from "./ContentBrowseToolbar";
import {ContentTreeGrid} from "./ContentTreeGrid";
import {ContentBrowseFilterPanel} from "./filter/ContentBrowseFilterPanel";
import {ContentBrowseItemPanel} from "./ContentBrowseItemPanel";
import {MobileContentItemStatisticsPanel} from "../view/MobileContentItemStatisticsPanel";
import {MobileContentTreeGridActions} from "./action/MobileContentTreeGridActions";
import {DetailsPanel} from "../view/detail/DetailsPanel";
import {NonMobileDetailsPanelsManager, NonMobileDetailsPanelsManagerBuilder} from "../view/detail/NonMobileDetailsPanelsManager";
import {Router} from "../Router";
import {ActiveDetailsPanelManager} from "../view/detail/ActiveDetailsPanelManager";
import {ContentBrowseItem} from "./ContentBrowseItem";
import {ToggleSearchPanelEvent} from "./ToggleSearchPanelEvent";
import {ToggleSearchPanelWithDependenciesEvent} from "./ToggleSearchPanelWithDependenciesEvent";
import {NewMediaUploadEvent} from "../create/NewMediaUploadEvent";
import {ContentPreviewPathChangedEvent} from "../view/ContentPreviewPathChangedEvent";
import {ContentPublishMenuManager} from "./ContentPublishMenuManager";
import {TreeNodeParentOfContent} from "./TreeNodeParentOfContent";
import {TreeNodesOfContentPath} from "./TreeNodesOfContentPath";

export class ContentBrowsePanel extends BrowsePanel<ContentSummaryAndCompareStatus> {

    private browseActions: ContentTreeGridActions;

    private toolbar: ContentBrowseToolbar;

    private contentTreeGrid: ContentTreeGrid;

    private contentFilterPanel: ContentBrowseFilterPanel;

    private contentBrowseItemPanel: ContentBrowseItemPanel;

    private mobileContentItemStatisticsPanel: MobileContentItemStatisticsPanel;

    private mobileBrowseActions: MobileContentTreeGridActions;

    private floatingDetailsPanel: DetailsPanel;

    private defaultDockedDetailsPanel: DetailsPanel;

    constructor() {

        this.contentTreeGrid = new ContentTreeGrid();

        // this.contentBrowseItemPanel = components.detailPanel = new ContentBrowseItemPanel();
        this.contentBrowseItemPanel = new ContentBrowseItemPanel(this.contentTreeGrid);

        this.contentFilterPanel = new ContentBrowseFilterPanel();

        this.browseActions = <ContentTreeGridActions>this.contentTreeGrid.getContextMenu().getActions();

        this.toolbar = new ContentBrowseToolbar(this.browseActions);

        this.defaultDockedDetailsPanel = DetailsPanel.create().setUseSplitter(false).build();

        super({
            browseToolbar: this.toolbar,
            treeGrid: this.contentTreeGrid,
            browseItemPanel: this.contentBrowseItemPanel,
            filterPanel: this.contentFilterPanel,
            hasDetailsPanel: true
        });

        var showMask = () => {
            if (this.isVisible()) {
                this.contentTreeGrid.mask();
            }
        };
        this.contentFilterPanel.onSearchStarted(showMask);
        this.contentFilterPanel.onReset(showMask);
        this.contentFilterPanel.onRefreshStarted(showMask);

        this.getTreeGrid().onDataChanged((event: DataChangedEvent<ContentSummaryAndCompareStatus>) => {
            if (event.getType() === 'updated') {
                let browseItems = this.treeNodesToBrowseItems(event.getTreeNodes());
                this.getBrowseItemPanel().updateItemViewers(browseItems);

                this.browseActions.updateActionsEnabledState(this.getBrowseItemPanel().getItems());
                this.mobileBrowseActions.updateActionsEnabledState(this.getBrowseItemPanel().getItems());
            }
        });

        this.onShown(() => {
            Router.setHash("browse");
        });

        ResponsiveManager.onAvailableSizeChanged(this, (item: ResponsiveItem) => {
            this.browseActions.TOGGLE_SEARCH_PANEL.setVisible(item.isInRangeOrSmaller(ResponsiveRanges._360_540));
        });

        this.handleGlobalEvents();
    }

    doRender(): wemQ.Promise<boolean> {
        return super.doRender().then((rendered) => {

            var nonMobileDetailsPanelsManagerBuilder = NonMobileDetailsPanelsManager.create();
            this.initSplitPanelWithDockedDetails(nonMobileDetailsPanelsManagerBuilder);
            this.initFloatingDetailsPanel(nonMobileDetailsPanelsManagerBuilder);
            this.initItemStatisticsPanelForMobile();

            var nonMobileDetailsPanelsManager = nonMobileDetailsPanelsManagerBuilder.build();
            if (nonMobileDetailsPanelsManager.requiresCollapsedDetailsPanel()) {
                nonMobileDetailsPanelsManager.hideDockedDetailsPanel();
            }
            nonMobileDetailsPanelsManager.ensureButtonHasCorrectState();

            this.setActiveDetailsPanel(nonMobileDetailsPanelsManager);

            this.subscribeDetailsPanelsOnEvents(nonMobileDetailsPanelsManager);

            this.onShown(() => {
                if (!!nonMobileDetailsPanelsManager.getActivePanel().getActiveWidget()) {
                    nonMobileDetailsPanelsManager.getActivePanel().getActiveWidget().slideIn();
                }
            });

            this.toolbar.appendChild(nonMobileDetailsPanelsManager.getToggleButton());

            let contentPublishMenuManager = new ContentPublishMenuManager(this.browseActions);
            this.toolbar.appendChild(contentPublishMenuManager.getPublishMenuButton());

            return rendered;
        });
    }

    private subscribeDetailsPanelsOnEvents(nonMobileDetailsPanelsManager: NonMobileDetailsPanelsManager) {

        this.getTreeGrid().onSelectionChanged((currentSelection: TreeNode<Object>[], fullSelection: TreeNode<Object>[]) => {
            var browseItems: BrowseItem<ContentSummaryAndCompareStatus>[] = this.getBrowseItemPanel().getItems(),
                item: BrowseItem<ContentSummaryAndCompareStatus> = null;
            if (browseItems.length > 0) {
                item = browseItems[0];
            }
            this.doUpdateDetailsPanel(item ? item.getModel() : null);
        });

        ResponsiveManager.onAvailableSizeChanged(this.getFilterAndGridSplitPanel(), (item: ResponsiveItem) => {
            nonMobileDetailsPanelsManager.handleResizeEvent();
        });

        ResponsiveManager.onAvailableSizeChanged(this, (item: ResponsiveItem) => {
            if (ResponsiveRanges._540_720.isFitOrBigger(item.getOldRangeValue()) &&
                item.isInRangeOrSmaller(ResponsiveRanges._360_540)) {
                nonMobileDetailsPanelsManager.hideActivePanel();
                ActiveDetailsPanelManager.setActiveDetailsPanel(this.mobileContentItemStatisticsPanel.getDetailsPanel());
            }
        });

    }

    private initSplitPanelWithDockedDetails(nonMobileDetailsPanelsManagerBuilder: NonMobileDetailsPanelsManagerBuilder) {

        var contentPanelsAndDetailPanel: SplitPanel = new SplitPanelBuilder(this.getFilterAndGridSplitPanel(),
            this.defaultDockedDetailsPanel).setAlignment(SplitPanelAlignment.VERTICAL).setSecondPanelSize(280,
            SplitPanelUnit.PIXEL).setSecondPanelMinSize(280, SplitPanelUnit.PIXEL).setAnimationDelay(
            600).setSecondPanelShouldSlideRight(true).build();

        contentPanelsAndDetailPanel.addClass("split-panel-with-details");
        contentPanelsAndDetailPanel.setSecondPanelSize(280, SplitPanelUnit.PIXEL);

        this.appendChild(contentPanelsAndDetailPanel);

        nonMobileDetailsPanelsManagerBuilder.setSplitPanelWithGridAndDetails(contentPanelsAndDetailPanel);
        nonMobileDetailsPanelsManagerBuilder.setDefaultDetailsPanel(this.defaultDockedDetailsPanel);
    }

    private initFloatingDetailsPanel(nonMobileDetailsPanelsManagerBuilder: NonMobileDetailsPanelsManagerBuilder) {

        this.floatingDetailsPanel = DetailsPanel.create().build();

        this.floatingDetailsPanel.addClass("floating-details-panel");

        nonMobileDetailsPanelsManagerBuilder.setFloatingDetailsPanel(this.floatingDetailsPanel);

        this.appendChild(this.floatingDetailsPanel);
    }

    private initItemStatisticsPanelForMobile() {
        this.mobileBrowseActions = new MobileContentTreeGridActions(this.contentTreeGrid);
        this.mobileContentItemStatisticsPanel = new MobileContentItemStatisticsPanel(this.mobileBrowseActions);

        let updateItem = () => {
            if (ActiveDetailsPanelManager.getActiveDetailsPanel() == this.mobileContentItemStatisticsPanel.getDetailsPanel()) {
                var browseItems: BrowseItem<ContentSummaryAndCompareStatus>[] = this.getBrowseItemPanel().getItems();
                if (browseItems.length == 1) {
                    new IsRenderableRequest(new ContentId(browseItems[0].getId())).sendAndParse().then(
                        (renderable: boolean) => {
                            var item: ViewItem<ContentSummaryAndCompareStatus> = browseItems[0].toViewItem();
                            item.setRenderable(renderable);
                            this.mobileContentItemStatisticsPanel.setItem(item);
                            this.mobileBrowseActions.updateActionsEnabledState(browseItems);
                        });
                }
            }
        };

        // new selection
        this.contentTreeGrid.onSelectionChanged(updateItem);

        // repeated selection
        TreeGridItemClickedEvent.on((event) => {
            if (event.isRepeatedSelection()) {
                updateItem();
            }
        });

        this.appendChild(this.mobileContentItemStatisticsPanel);
    }

    private setActiveDetailsPanel(nonMobileDetailsPanelsManager: NonMobileDetailsPanelsManager) {
        if (this.mobileContentItemStatisticsPanel.isVisible()) {
            ActiveDetailsPanelManager.setActiveDetailsPanel(this.mobileContentItemStatisticsPanel.getDetailsPanel());
        } else {
            ActiveDetailsPanelManager.setActiveDetailsPanel(nonMobileDetailsPanelsManager.getActivePanel());
        }
    }

    treeNodesToBrowseItems(nodes: TreeNode<ContentSummaryAndCompareStatus>[]): BrowseItem<ContentSummaryAndCompareStatus>[] {
        var browseItems: BrowseItem<ContentSummaryAndCompareStatus>[] = [];

        // do not proceed duplicated content. still, it can be selected
        nodes.forEach((node: TreeNode<ContentSummaryAndCompareStatus>, index: number) => {
            for (var i = 0; i <= index; i++) {
                if (nodes[i].getData().getId() === node.getData().getId()) {
                    break;
                }
            }
            if (i === index) {
                var data = node.getData();
                if (!!data && !!data.getContentSummary()) {
                    let item = new ContentBrowseItem(data).setId(data.getId()).setDisplayName(
                        data.getContentSummary().getDisplayName()).setPath(data.getContentSummary().getPath().toString()).setIconUrl(
                        new ContentIconUrlResolver().setContent(data.getContentSummary()).resolve());
                    browseItems.push(item);
                }
            }
        });

        return browseItems;
    }


    private handleGlobalEvents() {

        ToggleSearchPanelEvent.on(() => {
            this.toggleFilterPanel();
        });

        ToggleSearchPanelWithDependenciesEvent.on((event: ToggleSearchPanelWithDependenciesEvent) => {
            this.showFilterPanel();
            this.contentFilterPanel.setDependencyItem(event.getContent(), event.isInbound());
        });

        NewMediaUploadEvent.on((event) => {
            this.handleNewMediaUpload(event);
        });

        this.subscribeOnContentEvents();

        ContentPreviewPathChangedEvent.on((event: ContentPreviewPathChangedEvent) => {
            this.selectPreviewedContentInGrid(event.getPreviewPath());
        });

        ContentPreviewPathChangedEvent.on((event: ContentPreviewPathChangedEvent) => {
            this.selectPreviewedContentInGrid(event.getPreviewPath());
        });
    }

    private selectPreviewedContentInGrid(contentPreviewPath: string) {
        var path = this.getPathFromPreviewPath(contentPreviewPath);
        if (path) {
            var contentPath = ContentPath.fromString(path);
            if (this.isSingleItemSelectedInGrid() && !this.isGivenPathSelectedInGrid(contentPath)) {
                this.selectContentInGridByPath(contentPath);
            }
        }
    }

    private selectContentInGridByPath(path: ContentPath) {
        this.contentTreeGrid.expandTillNodeWithGivenPath(path, this.contentTreeGrid.getSelectedNodes()[0]);
    }

    private isGivenPathSelectedInGrid(path: ContentPath): boolean {
        var contentSummary: ContentSummaryAndCompareStatus = this.contentTreeGrid.getSelectedNodes()[0].getData();
        return contentSummary.getPath().equals(path);
    }

    private isSingleItemSelectedInGrid(): boolean {
        return this.contentTreeGrid.getSelectedNodes() && this.contentTreeGrid.getSelectedNodes().length == 1;
    }

    private getPathFromPreviewPath(contentPreviewPath: string): string {
        return PortalUriHelper.getPathFromPortalPreviewUri(contentPreviewPath, RenderingMode.PREVIEW,
            Branch.DRAFT);
    }

    private subscribeOnContentEvents() {
        var handler = ContentServerEventsHandler.getInstance();

        handler.onContentCreated((data: ContentSummaryAndCompareStatus[]) => this.handleContentCreated(data));

        handler.onContentUpdated((data: ContentSummaryAndCompareStatus[]) => this.handleContentUpdated(data));

        handler.onContentRenamed((data: ContentSummaryAndCompareStatus[], oldPaths: ContentPath[]) => {
            this.handleContentCreated(data, oldPaths);
        });

        handler.onContentDeleted((data: ContentServerChangeItem[]) => {
            this.handleContentDeleted(data.map(d => d.getPath()));
        });

        handler.onContentPending((data: ContentSummaryAndCompareStatus[]) => this.handleContentPending(data));

        handler.onContentDuplicated((data: ContentSummaryAndCompareStatus[]) => this.handleContentCreated(data));

        handler.onContentPublished((data: ContentSummaryAndCompareStatus[]) => this.handleContentPublished(data));

        handler.onContentUnpublished((data: ContentSummaryAndCompareStatus[]) => this.handleContentUnpublished(data));

        handler.onContentMoved((data: ContentSummaryAndCompareStatus[], oldPaths: ContentPath[]) => {
            // combination of delete and create
            this.handleContentDeleted(oldPaths);
            this.handleContentCreated(data);
        });

        handler.onContentSorted((data: ContentSummaryAndCompareStatus[]) => this.handleContentSorted(data));
    }

    private handleContentCreated(data: ContentSummaryAndCompareStatus[], oldPaths?: ContentPath[]) {
        if (ContentBrowsePanel.debug) {
            console.debug("ContentBrowsePanel: created", data, oldPaths);
        }

        var paths: ContentPath[] = data.map(d => d.getContentSummary().getPath());
        var createResult: TreeNodesOfContentPath[] = this.contentTreeGrid.findByPaths(paths, true);

        var isFiltered = this.contentTreeGrid.getRoot().isFiltered(),
            nodes: TreeNode<ContentSummaryAndCompareStatus>[] = [];

        data.forEach((el) => {
            for (var i = 0; i < createResult.length; i++) {
                if (el.getContentSummary().getPath().isChildOf(createResult[i].getPath())) {
                    if (oldPaths && oldPaths.length > 0) {
                        var renameResult: TreeNodesOfContentPath[] = this.contentTreeGrid.findByPaths(oldPaths);
                        var premerged = renameResult.map((el) => {
                            return el.getNodes();
                        });
                        // merge array of nodes arrays
                        nodes = nodes.concat.apply(nodes, premerged);
                        nodes.forEach((node) => {
                            if (node.getDataId() === el.getId()) {
                                node.setData(el);
                                node.clearViewers();
                                this.contentTreeGrid.xUpdatePathsInChildren(node);
                            }
                        });
                        this.contentTreeGrid.xPlaceContentNodes(nodes);
                    } else {
                        this.contentTreeGrid.xAppendContentNodes(
                            createResult[i].getNodes().map((node) => {
                                return new TreeNodeParentOfContent(el, node);
                            }),
                            !isFiltered
                        ).then((results) => {
                            nodes = nodes.concat(results);
                        });
                    }
                    break;
                }
            }
        });

        this.contentTreeGrid.initAndRender();

        isFiltered = true;
        if (isFiltered) {
            this.setRefreshOfFilterRequired();
            window.setTimeout(() => {
                this.refreshFilter();
            }, 1000);
        }

    }

    private handleContentUpdated(data: ContentSummaryAndCompareStatus[]) {
        if (ContentBrowsePanel.debug) {
            console.debug("ContentBrowsePanel: updated", data);
        }

        var changed = this.doHandleContentUpdate(data);

        this.updateStatisticsPanel(data);

        return this.contentTreeGrid.xPlaceContentNodes(changed);
    }

    private handleContentDeleted(paths: ContentPath[]) {
        if (ContentBrowsePanel.debug) {
            console.debug("ContentBrowsePanel: deleted", paths);
        }

        var nodes = this.contentTreeGrid.findByPaths(paths).map(el => el.getNodes());
        var merged = [];
        // merge array of nodes arrays
        merged = merged.concat.apply(merged, nodes);

        merged.forEach((node: TreeNode<ContentSummaryAndCompareStatus>) => {
            var contentSummary = node.getData().getContentSummary();
            if (node.getData() && !!contentSummary) {
                this.doUpdateDetailsPanel(null);
            }
        });

        this.contentTreeGrid.xDeleteContentNodes(merged);

        // now get unique parents and update their hasChildren
        var uniqueParents = paths.map(path => path.getParentPath()).filter((parent, index, self) => {
            return self.indexOf(parent) === index;
        });
        let parentNodes = this.contentTreeGrid.findByPaths(uniqueParents).map(parentNode => parentNode.getNodes());
        let mergedParentNodes = [];
        mergedParentNodes = mergedParentNodes.concat.apply(mergedParentNodes, parentNodes);

        mergedParentNodes.forEach((parentNode: TreeNode<ContentSummaryAndCompareStatus>) => {
            if (parentNode.getChildren().length == 0) {
                // update parent if all children were deleted
                this.contentTreeGrid.refreshNodeData(parentNode);
            }
        });

        this.setRefreshOfFilterRequired();
        window.setTimeout(() => {
            this.refreshFilter();
        }, 1000);
    }

    private handleContentPending(data: ContentSummaryAndCompareStatus[]) {
        if (ContentBrowsePanel.debug) {
            console.debug("ContentBrowsePanel: pending", data);
        }
        this.doHandleContentUpdate(data);
    }

    private handleContentPublished(data: ContentSummaryAndCompareStatus[]) {
        if (ContentBrowsePanel.debug) {
            console.debug("ContentBrowsePanel: published", data);
        }
        this.doHandleContentUpdate(data);
    }

    private handleContentUnpublished(data: ContentSummaryAndCompareStatus[]) {
        if (ContentBrowsePanel.debug) {
            console.debug("ContentBrowsePanel: unpublished", data);
        }
        this.doHandleContentUpdate(data);
    }

    private doHandleContentUpdate(data: ContentSummaryAndCompareStatus[]): TreeNode<ContentSummaryAndCompareStatus>[] {
        var changed = this.updateNodes(data);

        this.updateDetailsPanel(data);

        this.contentTreeGrid.invalidate();

        // Update since CompareStatus changed
        let changedEvent = new DataChangedEvent<ContentSummaryAndCompareStatus>(changed, DataChangedEvent.UPDATED);
        this.contentTreeGrid.notifyDataChanged(changedEvent);

        return changed;
    }

    private updateNodes(data: ContentSummaryAndCompareStatus[]): TreeNode<ContentSummaryAndCompareStatus>[] {
        var paths: ContentPath[] = data.map(d => d.getContentSummary().getPath());
        var treeNodes: TreeNodesOfContentPath[] = this.contentTreeGrid.findByPaths(paths);

        let changed = [];
        data.forEach((el) => {
            for (var i = 0; i < treeNodes.length; i++) {
                if (treeNodes[i].getId() === el.getId()) {
                    treeNodes[i].updateNodeData(el);
                    changed.push(...treeNodes[i].getNodes());
                    break;
                }
            }
        });

        return changed;
    }

    private handleContentSorted(data: ContentSummaryAndCompareStatus[]) {
        if (ContentBrowsePanel.debug) {
            console.debug("ContentBrowsePanel: sorted", data);
        }
        var paths: ContentPath[] = data.map(d => d.getContentSummary().getPath());
        var sortResult: TreeNodesOfContentPath[] = this.contentTreeGrid.findByPaths(paths);

        var nodes = sortResult.map((el) => {
            return el.getNodes();
        });
        var merged = [];
        // merge array of nodes arrays
        merged = merged.concat.apply(merged, nodes);

        this.contentTreeGrid.xSortNodesChildren(merged).then(() => this.contentTreeGrid.invalidate());
    }

    private handleNewMediaUpload(event: NewMediaUploadEvent) {
        event.getUploadItems().forEach((item: UploadItem<ContentSummary>) => {
            this.contentTreeGrid.appendUploadNode(item);
        });
    }

    private updateStatisticsPanel(data: ContentSummaryAndCompareStatus[]) {
        var previewItem = this.getBrowseItemPanel().getStatisticsItem();

        if (!previewItem) {
            return;
        }

        var content: ContentSummaryAndCompareStatus;
        var previewItemNeedsUpdate = data.some((contentItem: ContentSummaryAndCompareStatus) => {
            if (contentItem.getPath().toString() === previewItem.getPath()) {
                content = contentItem;
                return true;
            }
        });

        if (previewItemNeedsUpdate) {
            new IsRenderableRequest(content.getContentId()).sendAndParse().then((renderable: boolean) => {
                var item = new BrowseItem<ContentSummaryAndCompareStatus>(content).setId(content.getId()).setDisplayName(
                    content.getDisplayName()).setPath(content.getPath().toString()).setIconUrl(
                    new ContentIconUrlResolver().setContent(content.getContentSummary()).resolve()).setRenderable(
                    renderable);
                this.getBrowseItemPanel().setStatisticsItem(item);
            });
        }
    }

    private updateDetailsPanel(data: ContentSummaryAndCompareStatus[]) {
        var detailsPanel = ActiveDetailsPanelManager.getActiveDetailsPanel();
        var itemInDetailPanel = detailsPanel ? detailsPanel.getItem() : null;

        if (!itemInDetailPanel) {
            return;
        }

        var content: ContentSummaryAndCompareStatus;
        var detailsPanelNeedsUpdate = data.some((contentItem: ContentSummaryAndCompareStatus) => {
            if (contentItem.getId() == itemInDetailPanel.getId()) {
                content = contentItem;
                return true;
            }
        });

        if (detailsPanelNeedsUpdate) {
            this.doUpdateDetailsPanel(content);
        }
    }

    private doUpdateDetailsPanel(item: ContentSummaryAndCompareStatus) {
        var detailsPanel = ActiveDetailsPanelManager.getActiveDetailsPanel();
        if (detailsPanel) {
            detailsPanel.setItem(item)
        }
    }

    getBrowseItemPanel(): ContentBrowseItemPanel {
        return <ContentBrowseItemPanel>super.getBrowseItemPanel();
    }
}
