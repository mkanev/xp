import {Toolbar} from "../../../../../common/js/ui/toolbar/Toolbar";

import {ContentTreeGridActions} from "./action/ContentTreeGridActions";

export class ContentBrowseToolbar extends Toolbar {

    constructor(actions: ContentTreeGridActions) {
        super();
        this.addClass("content-browse-toolbar")
        this.addActions(actions.getAllActionsNoPublish());
    }
}
