import {ComponentView} from "../../../../../../../common/js/liveedit/ComponentView";
import {Component} from "../../../../../../../common/js/content/page/region/Component";
import {PageView} from "../../../../../../../common/js/liveedit/PageView";
import {TogglerButton} from "../../../../../../../common/js/ui/button/TogglerButton";
import {ElementHiddenEvent} from "../../../../../../../common/js/dom/ElementHiddenEvent";

import {ContextWindow} from "./ContextWindow";
import {ShowContentFormEvent} from "../../ShowContentFormEvent";
import {ShowSplitEditEvent} from "../../ShowSplitEditEvent";
import {ShowLiveEditEvent} from "../../ShowLiveEditEvent";
import {ContentWizardPanel} from "../../ContentWizardPanel";

export class ContextWindowController {

    private contextWindow: ContextWindow;

    private contextWindowToggler: TogglerButton;

    private componentsViewToggler: TogglerButton;

    private togglerOverriden: boolean = false;

    private contentWizardPanel: ContentWizardPanel;

    constructor(contextWindow: ContextWindow, contentWizardPanel: ContentWizardPanel) {
        this.contextWindow = contextWindow;
        this.contentWizardPanel = contentWizardPanel;
        this.contextWindowToggler = contentWizardPanel.getContextWindowToggler();
        this.componentsViewToggler = contentWizardPanel.getComponentsViewToggler();

        var componentsView = this.contextWindow.getComponentsView();

        this.contextWindowToggler.onClicked((event: MouseEvent) => {
            // set overriden flag when toggle is on by click only
            if (this.contextWindowToggler.isEnabled()) {
                this.togglerOverriden = true;
            }
        });

        this.contextWindowToggler.onActiveChanged((isActive: boolean) => {
            if (isActive) {
                this.contextWindow.slideIn();
            } else {
                this.contextWindow.slideOut();
            }
        });

        this.componentsViewToggler.onActiveChanged((isActive: boolean) => {
            if (!componentsView.getParentElement() && isActive) {
                //append it on click only to be sure that content wizard panel is ready
                var offset = contentWizardPanel.getLivePanel().getEl().getOffsetToParent();
                componentsView.getEl().setOffset(offset);
                contentWizardPanel.appendChild(componentsView);
            }

            componentsView.setVisible(isActive);
        });

        componentsView.onHidden((event: ElementHiddenEvent) => {
            this.componentsViewToggler.setActive(false, true);
        });

        var liveEditShownHandler = () => {
            if (this.contextWindow.isLiveFormShown()) {
                this.contextWindowToggler.setEnabled(true);
                this.componentsViewToggler.setEnabled(true);
            }
        };

        var liveEditHiddenHandler = () => {
            this.contextWindowToggler.setEnabled(false);
            this.componentsViewToggler.setEnabled(false);
        };

        ShowLiveEditEvent.on(liveEditShownHandler);
        ShowSplitEditEvent.on(liveEditShownHandler);
        ShowContentFormEvent.on(liveEditHiddenHandler);
    }
}
