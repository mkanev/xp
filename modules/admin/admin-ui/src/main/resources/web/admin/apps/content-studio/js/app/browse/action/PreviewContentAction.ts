import {Action} from "../../../../../../common/js/ui/Action";
import {RenderingMode} from "../../../../../../common/js/rendering/RenderingMode";
import {ContentSummary} from "../../../../../../common/js/content/ContentSummary";
import {ContentId} from "../../../../../../common/js/content/ContentId";
import {showWarning} from "../../../../../../common/js/notify/MessageBus";

import {PreviewContentHandler} from "./handler/PreviewContentHandler";
import {ContentTreeGrid} from "../ContentTreeGrid";
import {BasePreviewAction} from "../../action/BasePreviewAction";

export class PreviewContentAction extends BasePreviewAction {

    private previewContentHandler: PreviewContentHandler;

    constructor(grid: ContentTreeGrid) {
        super("Preview", "");
        this.setEnabled(false);

        this.previewContentHandler = new PreviewContentHandler();

        this.onExecuted(() => {
            if (!this.previewContentHandler.isBlocked()) {
                var contentSummaries: ContentSummary[] = grid.getSelectedDataList().map(data => data.getContentSummary()).filter(
                    contentSummary => this.previewContentHandler.getRenderableIds().indexOf(contentSummary.getContentId().toString()) >= 0);

                this.openWindows(contentSummaries);
            } else {
                showWarning("Number of selected items exceeds maximum number allowed for preview ("
                                       + PreviewContentHandler.BLOCK_COUNT + "). Please deselect some of the items.");
            }
        });
    }

    getPreviewHandler(): PreviewContentHandler {
        return this.previewContentHandler;
    }
}
