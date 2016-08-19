import {Action} from "../../../../../common/js/ui/Action";
import {Toolbar} from "../../../../../common/js/ui/toolbar/Toolbar";

export interface ContentItemViewToolbarParams {
    editAction: Action;
    deleteAction: Action;
}

export class ContentItemViewToolbar extends Toolbar {

    constructor(params: ContentItemViewToolbarParams) {
        super();
        super.addAction(params.editAction);
        super.addAction(params.deleteAction);
    }
}
