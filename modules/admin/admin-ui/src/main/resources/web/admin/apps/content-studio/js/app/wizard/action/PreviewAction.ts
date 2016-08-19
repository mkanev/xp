import {RenderingMode} from "../../../../../../common/js/rendering/RenderingMode";
import {DefaultErrorHandler} from "../../../../../../common/js/DefaultErrorHandler";

import {BasePreviewAction} from "../../action/BasePreviewAction";
import {ContentWizardPanel} from "../ContentWizardPanel";

export class PreviewAction extends BasePreviewAction {

    constructor(wizard: ContentWizardPanel) {
        super("Preview");
        this.onExecuted(() => {
                if (wizard.hasUnsavedChanges()) {
                    wizard.setRequireValid(true);
                    wizard.saveChanges().then(content => this.openWindow(content)).catch(
                        (reason: any) => DefaultErrorHandler.handle(reason)).done();
                } else {
                    this.openWindow(wizard.getPersistedItem());
                }
            }
        );
    }
}
