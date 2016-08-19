import {BrowseItem} from "../../../../../common/js/app/browse/BrowseItem";
import {BrowseItemsSelectionPanel} from "../../../../../common/js/app/browse/BrowseItemsSelectionPanel";
import {ContentSummaryAndCompareStatus} from "../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {ContentSummaryAndCompareStatusViewer} from "../../../../../common/js/content/ContentSummaryAndCompareStatusViewer";
import {ContentSummaryViewer} from "../../../../../common/js/content/ContentSummaryViewer";
import {Toolbar} from "../../../../../common/js/ui/toolbar/Toolbar";
import {BrowseItemsChanges} from "../../../../../common/js/app/browse/BrowseItemsChanges";

import {ContentBrowseItem} from "./ContentBrowseItem";
import {ContentTreeGrid} from "./ContentTreeGrid";
import {ShowAllAction} from "./action/ShowAllAction";

export class ContentBrowseItemsSelectionPanel extends BrowseItemsSelectionPanel<ContentSummaryAndCompareStatus> {

    private toolbar: Toolbar;

    constructor(grid: ContentTreeGrid) {
        super();
        this.addClass("content-browse-items-selection-panel");
        this.initToolbar(grid);
    }

    private initToolbar(grid: ContentTreeGrid) {
        this.toolbar = new Toolbar();
        const action = new ShowAllAction(this, grid);
        this.toolbar.addAction(action);
        this.appendChild(this.toolbar);
        this.addClass("no-toolbar");
    }

    showAll() {
        this.toggleClass("no-toolbar", true);
        this.setItemsLimit(Number.MAX_VALUE);
        this.updateDisplayedSelection();
    }

    getDefaultLimit() {
        return 10;
    }

    createItemViewer(item: ContentBrowseItem): ContentSummaryAndCompareStatusViewer {
        var viewer = new ContentSummaryAndCompareStatusViewer();
        viewer.setObject(item.getModel());
        return viewer;
    }

    setItems(items: BrowseItem<ContentSummaryAndCompareStatus>[]): BrowseItemsChanges<ContentSummaryAndCompareStatus> {
        const changes = super.setItems(items);

        const count = this.getItems().length;
        const hideToolbar = count <= this.getItemsLimit();
        this.toggleClass("no-toolbar", hideToolbar);

        return changes;
    }


}
