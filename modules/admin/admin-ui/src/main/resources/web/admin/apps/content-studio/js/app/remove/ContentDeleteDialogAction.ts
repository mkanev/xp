import {Action} from "../../../../../common/js/ui/Action";

export class ContentDeleteDialogAction extends Action {
    constructor() {
        super("Delete");
        this.setIconClass("delete-action");
    }
}
