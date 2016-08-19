import {Action} from "../../../../../../common/js/ui/Action";
import {ContentSummary} from "../../../../../../common/js/content/ContentSummary";
import {DuplicateContentRequest} from "../../../../../../common/js/content/resource/DuplicateContentRequest";
import {Content} from "../../../../../../common/js/content/Content";
import {showFeedback} from "../../../../../../common/js/notify/MessageBus";

import {ContentTreeGrid} from "../ContentTreeGrid";

export class DuplicateContentAction extends Action {

    constructor(grid: ContentTreeGrid) {
        super("Duplicate");
        this.setEnabled(false);
        this.onExecuted(() => {
            grid.getSelectedDataList().forEach((elem) => {
                this.duplicate(elem.getContentSummary());
            });
        });
    }

    private duplicate(source: ContentSummary) {
        new DuplicateContentRequest(source.getContentId()).sendAndParse().then((content: Content) => {
            // TODO: Replace the returning content with an id
            showFeedback('\"' + source.getDisplayName() + '\" duplicated');
        })
    }
}
