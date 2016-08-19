import {FoldButton} from "../../../../../common/js/ui/toolbar/FoldButton";
import {DivEl} from "../../../../../common/js/dom/DivEl";
import {ActionContainer} from "../../../../../common/js/ui/ActionContainer";
import {Action} from "../../../../../common/js/ui/Action";
import {ActionButton} from "../../../../../common/js/ui/button/ActionButton";

import {MobileContentTreeGridActions} from "./action/MobileContentTreeGridActions";

export class MobileContentBrowseToolbar extends DivEl implements ActionContainer {

    private actions: Action[] = [];

    constructor(actions: MobileContentTreeGridActions) {
        super("toolbar");

        var foldButton = this.initFoldButton();

        this.addActions(actions.getAllActions(), foldButton);

        this.initEditButton(actions.EDIT_CONTENT);
    }

    private initFoldButton(): FoldButton {
        var fold = new FoldButton();
        fold.setLabel('More...');
        this.appendChild(fold);
        return fold;
    }

    private initEditButton(editAction: Action) {
        var editButton = new ActionButton(editAction);
        editButton.addClass("mobile-edit-action");
        this.appendChild(editButton);
    }

    private addActions(actions: Action[], foldButton: FoldButton) {
        this.actions = this.actions.concat(actions);
        actions.forEach((action) => {

            var actionButton = new ActionButton(action);
            var buttonWidth = actionButton.getEl().getWidthWithBorder();
            foldButton.push(actionButton, buttonWidth);
        });
    }

    getActions(): Action[] {
        return this.actions;
    }

}
