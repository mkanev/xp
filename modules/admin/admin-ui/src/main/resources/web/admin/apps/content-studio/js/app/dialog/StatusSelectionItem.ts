import {ContentSummaryAndCompareStatus} from "../../../../../common/js/content/ContentSummaryAndCompareStatus";
import {CompareStatus} from "../../../../../common/js/content/CompareStatus";
import {BrowseItem} from "../../../../../common/js/app/browse/BrowseItem";
import {SelectionItem} from "../../../../../common/js/app/browse/SelectionItem";
import {Viewer} from "../../../../../common/js/ui/Viewer";
import {DivEl} from "../../../../../common/js/dom/DivEl";
import {CompareStatusFormatter} from "../../../../../common/js/content/CompareStatus";

export class StatusSelectionItem extends SelectionItem<ContentSummaryAndCompareStatus> {

    constructor(viewer: Viewer<ContentSummaryAndCompareStatus>, item: BrowseItem<ContentSummaryAndCompareStatus>) {
        super(viewer, item);
    }

    doRender(): wemQ.Promise<boolean> {
        return super.doRender().then((rendered) => {

            var statusDiv = this.initStatusDiv(this.item.getModel().getCompareStatus());
            this.appendChild(statusDiv);

            return rendered;
        });
    }

    private initStatusDiv(status: CompareStatus) {
        var statusDiv = new DivEl("status");
        statusDiv.setHtml(CompareStatusFormatter.formatStatus(status));
        var statusClass = "" + CompareStatus[status];
        statusDiv.addClass(statusClass.toLowerCase());
        return statusDiv;
    }
}
