import {Toolbar} from "../../../../../common/js/ui/toolbar/Toolbar";

import {UserTreeGridActions} from "./UserTreeGridActions";

export class UserBrowseToolbar extends Toolbar {

    constructor(actions: UserTreeGridActions) {
        super();
        this.addClass("user-browse-toolbar")
        this.addActions(actions.getAllActions());
    }
}
