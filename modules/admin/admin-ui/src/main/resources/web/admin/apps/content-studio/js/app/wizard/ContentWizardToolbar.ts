import {CycleButton} from "../../../../../common/js/ui/button/CycleButton";
import {TogglerButton} from "../../../../../common/js/ui/button/TogglerButton";
import {Action} from "../../../../../common/js/ui/Action";
import {Toolbar} from "../../../../../common/js/ui/toolbar/Toolbar";

import {ContentWizardToolbarPublishControls} from "./ContentWizardToolbarPublishControls";

export interface ContentWizardToolbarParams {
    saveAction:Action;
    duplicateAction:Action;
    deleteAction:Action;
    publishAction:Action;
    publishTreeAction:Action;
    unpublishAction:Action;
    previewAction:Action;
    showLiveEditAction:Action;
    showFormAction:Action;
    showSplitEditAction:Action;
}

export class ContentWizardToolbar extends Toolbar {

    private contextWindowToggler: TogglerButton;
    private componentsViewToggler: TogglerButton;
    private cycleViewModeButton: CycleButton;
    private contentWizardToolbarPublishControls: ContentWizardToolbarPublishControls;

    constructor(params: ContentWizardToolbarParams) {
        super("content-wizard-toolbar");
        super.addAction(params.saveAction);
        super.addAction(params.deleteAction);
        super.addAction(params.duplicateAction);
        super.addAction(params.previewAction);
        super.addAction(params.unpublishAction).addClass("unpublish-button");
        super.addGreedySpacer();

        this.cycleViewModeButton = new CycleButton([params.showLiveEditAction, params.showFormAction]);
        this.componentsViewToggler = new TogglerButton("icon-clipboard", "Show Component View");
        this.contextWindowToggler = new TogglerButton("icon-cog", "Show Inspection Panel");

        this.contentWizardToolbarPublishControls = new ContentWizardToolbarPublishControls(
            params.publishAction, params.publishTreeAction, params.unpublishAction
        );

        super.addElement(this.contentWizardToolbarPublishControls);
        super.addElement(this.componentsViewToggler);
        super.addElement(this.contextWindowToggler);
        super.addElement(this.cycleViewModeButton);
    }

    getCycleViewModeButton(): CycleButton {
        return this.cycleViewModeButton;
    }

    getContextWindowToggler(): TogglerButton {
        return this.contextWindowToggler;
    }

    getComponentsViewToggler(): TogglerButton {
        return this.componentsViewToggler;
    }

    getContentWizardToolbarPublishControls() {
        return this.contentWizardToolbarPublishControls;
    }

}
