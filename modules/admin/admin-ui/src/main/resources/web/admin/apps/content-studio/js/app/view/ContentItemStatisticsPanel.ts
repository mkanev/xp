import {Panel} from "../../../../../common/js/ui/panel/Panel";
import {TabMenuItemBuilder} from "../../../../../common/js/ui/tab/TabMenuItem";
import {ItemStatisticsPanel} from "../../../../../common/js/app/view/ItemStatisticsPanel";
import {ContentSummaryAndCompareStatus} from "../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {ViewItem} from "../../../../../common/js/app/view/ViewItem";

import {ContentItemPreviewPanel} from "./ContentItemPreviewPanel";

export class ContentItemStatisticsPanel extends ItemStatisticsPanel<ContentSummaryAndCompareStatus> {

    private previewPanel: ContentItemPreviewPanel;

    constructor() {
        super("content-item-statistics-panel");

        this.previewPanel = new ContentItemPreviewPanel();
        this.previewPanel.setDoOffset(false);
        this.appendChild(this.previewPanel);
    }

    setItem(item: ViewItem<ContentSummaryAndCompareStatus>) {
        if (this.getItem() != item) {
            super.setItem(item);
            this.previewPanel.setItem(item);
        }
    }

}
