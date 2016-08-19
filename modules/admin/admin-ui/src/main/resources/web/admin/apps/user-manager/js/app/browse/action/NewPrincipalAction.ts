import {Action} from "../../../../../../common/js/ui/Action";

import {NewPrincipalEvent} from "../NewPrincipalEvent";
import {UserTreeGridItem} from "../UserTreeGridItem";
import {UserItemsTreeGrid} from "../UserItemsTreeGrid";

export class NewPrincipalAction extends Action {

    constructor(grid: UserItemsTreeGrid) {
        super("New", "mod+alt+n");
        this.setEnabled(false);
        this.onExecuted(() => {
            var principals: UserTreeGridItem[] = grid.getSelectedDataList();
            new NewPrincipalEvent(principals).fire();
        });
    }
}
