import {DivEl} from "../../../../../../../common/js/dom/DivEl";

import {DetailsPanel} from "../DetailsPanel";

export class MobileDetailsPanelToggleButton extends DivEl {

    private detailsPanel: DetailsPanel;

    public static EXPANDED_CLASS: string = "expanded";

    constructor(detailsPanel: DetailsPanel, slideInCallback?: () => void) {
        super("mobile-details-panel-toggle-button");

        this.detailsPanel = detailsPanel;

        this.onClicked(() => {
            this.toggleClass(MobileDetailsPanelToggleButton.EXPANDED_CLASS);
            if (this.hasClass(MobileDetailsPanelToggleButton.EXPANDED_CLASS)) {
                this.detailsPanel.slideIn();
                if (!!slideInCallback) {
                    slideInCallback();
                }
            } else {
                this.detailsPanel.slideOut();
            }
        });
    }
}
