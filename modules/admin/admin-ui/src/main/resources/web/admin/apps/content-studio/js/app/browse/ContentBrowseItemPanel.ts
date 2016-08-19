import {BrowseItemPanel} from "../../../../../common/js/app/browse/BrowseItemPanel";
import {ContentSummaryAndCompareStatus} from "../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {BrowseItemsChanges} from "../../../../../common/js/app/browse/BrowseItemsChanges";

import {ContentBrowseItem} from "./ContentBrowseItem";
import {ContentBrowseItemsSelectionPanel} from "./ContentBrowseItemsSelectionPanel";
import {ContentItemStatisticsPanel} from "../view/ContentItemStatisticsPanel";
import {ContentTreeGrid} from "./ContentTreeGrid";

export class ContentBrowseItemPanel extends BrowseItemPanel<ContentSummaryAndCompareStatus> {

    private grid: ContentTreeGrid;

    constructor(grid: ContentTreeGrid) {
        this.grid = grid;
        super();
    }

    createItemSelectionPanel(): ContentBrowseItemsSelectionPanel {
        return new ContentBrowseItemsSelectionPanel(this.grid);
    }

    createItemStatisticsPanel(): ContentItemStatisticsPanel {
        return new ContentItemStatisticsPanel();
    }

    setItems(items: ContentBrowseItem[]): BrowseItemsChanges<ContentSummaryAndCompareStatus> {
        return super.setItems(items);
    }

    getItems(): ContentBrowseItem[] {
        return <ContentBrowseItem[]>super.getItems();
    }

}
