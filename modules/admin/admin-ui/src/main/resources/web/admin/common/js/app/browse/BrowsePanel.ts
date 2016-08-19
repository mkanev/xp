import {ResponsiveManager} from "../../ui/responsive/ResponsiveManager";
import {ResponsiveRanges} from "../../ui/responsive/ResponsiveRanges";
import {ResponsiveItem} from "../../ui/responsive/ResponsiveItem";
import {TreeNode} from "../../ui/treegrid/TreeNode";
import {Equitable} from "../../Equitable";
import {Toolbar} from "../../ui/toolbar/Toolbar";
import {TreeGrid} from "../../ui/treegrid/TreeGrid";
import {BrowseFilterPanel} from "./filter/BrowseFilterPanel";
import {Panel} from "../../ui/panel/Panel";
import {ActionContainer} from "../../ui/ActionContainer";
import {SplitPanel} from "../../ui/panel/SplitPanel";
import {Action} from "../../ui/Action";
import {ActionButton} from "../../ui/button/ActionButton";
import {BrowseItem} from "./BrowseItem";
import {DefaultErrorHandler} from "../../DefaultErrorHandler";
import {SplitPanelBuilder} from "../../ui/panel/SplitPanel";
import {SplitPanelUnit} from "../../ui/panel/SplitPanel";
import {SplitPanelAlignment} from "../../ui/panel/SplitPanel";
import {ToggleFilterPanelAction} from "./action/ToggleFilterPanelAction";
import {BrowseItemPanel} from "./BrowseItemPanel";
import {ItemDeselectedEvent} from "./ItemDeselectedEvent";

export interface BrowsePanelParams<M extends Equitable> {

        browseToolbar: Toolbar;

        treeGrid?: TreeGrid<Object>;

        browseItemPanel: BrowseItemPanel<M>;

        filterPanel?: BrowseFilterPanel;

        hasDetailsPanel?: boolean;
    }

    export class BrowsePanel<M extends Equitable> extends Panel implements ActionContainer {

        private static SPLIT_PANEL_ALIGNMENT_TRESHOLD: number = 720;

        private browseToolbar: Toolbar;

        private treeGrid: TreeGrid<Object>;

        private gridAndToolbarPanel: Panel;

        private browseItemPanel: BrowseItemPanel<M>;

        private gridAndItemsSplitPanel: SplitPanel;

        private filterPanel: BrowseFilterPanel;

        private filterAndGridSplitPanel: SplitPanel;

        private filterPanelForcedShown: boolean = false;

        private filterPanelForcedHidden: boolean = false;

        private filterPanelToBeShownFullScreen: boolean = false;

        private filterPanelIsHiddenByDefault: boolean = true;

        private toggleFilterPanelAction: Action;

        private toggleFilterPanelButton: ActionButton;

        constructor(params: BrowsePanelParams<M>) {
            super();

            this.browseToolbar = params.browseToolbar;
            this.treeGrid = params.treeGrid;
            this.browseItemPanel = params.browseItemPanel;
            this.filterPanel = params.filterPanel;

            this.browseItemPanel.onDeselected((event: ItemDeselectedEvent<M>) => {
                let oldSelectedCount = this.treeGrid.getGrid().getSelectedRows().length;
                this.treeGrid.deselectNodes([event.getBrowseItem().getId()]);
                let newSelectedCount = this.treeGrid.getGrid().getSelectedRows().length;

                if (oldSelectedCount === newSelectedCount) {
                    this.treeGrid.getContextMenu().getActions()
                        .updateActionsEnabledState(this.browseItemPanel.getItems())
                        .then(() => {
                            this.browseItemPanel.updateDisplayedPanel();
                        });
                }
            });

            this.treeGrid.onSelectionChanged((currentSelection: TreeNode<Object>[], fullSelection: TreeNode<Object>[]) => {
                let browseItems: BrowseItem<M>[] = this.treeNodesToBrowseItems(fullSelection);
                let changes = this.browseItemPanel.setItems(browseItems);
                this.treeGrid.getContextMenu().getActions()
                    .updateActionsEnabledState(this.browseItemPanel.getItems(), changes)
                    .then(() => {
                        this.browseItemPanel.updateDisplayedPanel();
                    }).catch(DefaultErrorHandler.handle);
            });

            ResponsiveManager.onAvailableSizeChanged(this, (item: ResponsiveItem) => {
                this.checkFilterPanelToBeShownFullScreen(item);

                if (this.isRendered()) {
                    if (!this.filterPanelIsHiddenByDefault) { //not relevant if filter panel is hidden by default
                        this.toggleFilterPanelDependingOnScreenSize(item);
                    }
                    this.togglePreviewPanelDependingOnScreenSize(item);
                }
            });

            this.onShown(() => {
                if (this.treeGrid.isFiltered()) {
                    this.filterPanel.refresh();
                }
            });
        }

        doRender(): wemQ.Promise<boolean> {
            return super.doRender().then((rendered) => {
                this.gridAndItemsSplitPanel = new SplitPanelBuilder(this.treeGrid, this.browseItemPanel)
                    .setAlignmentTreshold(BrowsePanel.SPLIT_PANEL_ALIGNMENT_TRESHOLD)
                    .build();

                this.gridAndItemsSplitPanel.setFirstPanelSize(38, SplitPanelUnit.PERCENT);

                this.browseToolbar.addClass("browse-toolbar");
                this.gridAndItemsSplitPanel.addClass("content-grid-and-browse-split-panel");

                if (this.filterPanel) {
                    this.gridAndToolbarPanel = new Panel();
                    this.gridAndToolbarPanel.appendChildren<any>(this.browseToolbar, this.gridAndItemsSplitPanel);

                    this.filterAndGridSplitPanel = this.setupFilterPanel();
                    this.appendChild(this.filterAndGridSplitPanel);
                    if (this.filterPanelIsHiddenByDefault) {
                        this.hideFilterPanel();
                    }
                } else {
                    this.appendChildren<any>(this.browseToolbar, this.gridAndItemsSplitPanel);
                }
                return rendered;
            });
        }

        getFilterAndGridSplitPanel(): Panel {
            return this.filterAndGridSplitPanel;
        }

        getTreeGrid(): TreeGrid<Object> {
            return this.treeGrid;
        }

        getBrowseItemPanel(): BrowseItemPanel<M> {
            return this.browseItemPanel;
        }

        getActions(): Action[] {
            return this.browseToolbar.getActions();
        }

        treeNodesToBrowseItems(nodes: TreeNode<Object>[]): BrowseItem<M>[] {
            return [];
        }

        refreshFilter() {
            if (this.filterPanel && this.filterPanel.isVisible()) {
                this.filterPanel.refresh();
            }
        }

        setRefreshOfFilterRequired() {
            if (this.filterPanel) {
                this.filterPanel.setRefreshOfFilterRequired();
            }
        }

        toggleFilterPanel() {
            this.filterAndGridSplitPanel.setFirstPanelIsFullScreen(this.filterPanelToBeShownFullScreen);

            if (this.filterPanelIsHidden()) {
                this.showFilterPanel();
            } else {
                this.hideFilterPanel();
            }
        }

        private filterPanelIsHidden(): boolean {
            return this.filterAndGridSplitPanel.isFirstPanelHidden();
        }

        protected showFilterPanel() {
            this.filterPanelForcedShown = true;
            this.filterPanelForcedHidden = false;

            if (this.filterPanelToBeShownFullScreen) {
                this.filterAndGridSplitPanel.hideSecondPanel();
            }

            this.filterAndGridSplitPanel.showFirstPanel();
            this.filterPanel.giveFocusToSearch();
            this.toggleFilterPanelAction.setVisible(false);
            this.toggleFilterPanelButton.removeClass("filtered");
        }

        private hideFilterPanel() {
            this.filterPanelForcedShown = false;
            this.filterPanelForcedHidden = true;
            this.filterAndGridSplitPanel.showSecondPanel();
            this.filterAndGridSplitPanel.hideFirstPanel();

            this.toggleFilterPanelAction.setVisible(true);
            if (this.filterPanel.hasFilterSet()) {
                this.toggleFilterPanelButton.addClass("filtered");
            }

        }

        private setupFilterPanel() {
            var splitPanel = new SplitPanelBuilder(this.filterPanel, this.gridAndToolbarPanel)
                .setFirstPanelSize(215, SplitPanelUnit.PIXEL)
                .setAlignment(SplitPanelAlignment.VERTICAL)
                .setAnimationDelay(100)     // filter panel animation time
                .build();

            this.filterPanel.onHideFilterPanelButtonClicked(this.toggleFilterPanel.bind(this));
            this.filterPanel.onShowResultsButtonClicked(this.toggleFilterPanel.bind(this));

            this.addToggleFilterPanelButtonInToolbar();
            return splitPanel;
        }

        private addToggleFilterPanelButtonInToolbar() {
            this.toggleFilterPanelAction = new ToggleFilterPanelAction(this);
            var existingActions: Action[] = this.browseToolbar.getActions();
            this.browseToolbar.removeActions();
            this.toggleFilterPanelButton = this.browseToolbar.addAction(this.toggleFilterPanelAction);
            this.browseToolbar.addActions(existingActions);
            this.toggleFilterPanelAction.setVisible(false);
        }

        private checkFilterPanelToBeShownFullScreen(item: ResponsiveItem) {
            this.filterPanelToBeShownFullScreen = item.isInRangeOrSmaller(ResponsiveRanges._360_540);
        }

        private toggleFilterPanelDependingOnScreenSize(item: ResponsiveItem) {
            if (item.isInRangeOrSmaller(ResponsiveRanges._1380_1620)) {
                if (this.filterPanel && !this.filterAndGridSplitPanel.isFirstPanelHidden() && !this.filterPanelForcedShown) {
                    this.filterAndGridSplitPanel.hideFirstPanel();
                    this.toggleFilterPanelAction.setVisible(true);
                }
            } else if (item.isInRangeOrBigger(ResponsiveRanges._1620_1920)) {
                if (this.filterPanel && this.filterAndGridSplitPanel.isFirstPanelHidden() && !this.filterPanelForcedHidden) {
                    this.filterAndGridSplitPanel.showFirstPanel();
                    this.toggleFilterPanelAction.setVisible(false);
                }
            }
        }

        private togglePreviewPanelDependingOnScreenSize(item: ResponsiveItem) {
            if (item.isInRangeOrSmaller(ResponsiveRanges._360_540)) {
                if (!this.gridAndItemsSplitPanel.isSecondPanelHidden()) {
                    this.gridAndItemsSplitPanel.hideSecondPanel();
                    this.browseItemPanel.setMobileView(true);
                }
            } else if (item.isInRangeOrBigger(ResponsiveRanges._540_720)) {
                if (this.gridAndItemsSplitPanel.isSecondPanelHidden()) {
                    this.gridAndItemsSplitPanel.showSecondPanel();
                    this.browseItemPanel.setMobileView(false);
                }
            }
        }

    }
