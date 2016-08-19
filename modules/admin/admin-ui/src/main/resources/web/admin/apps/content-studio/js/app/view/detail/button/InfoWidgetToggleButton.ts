import {DivEl} from "../../../../../../../common/js/dom/DivEl";

import {DetailsPanel} from "../DetailsPanel";

export class InfoWidgetToggleButton extends DivEl {

    constructor(detailsPanel: DetailsPanel) {
        super("info-widget-toggle-button");

        this.onClicked((event) => {
            this.setActive();
            detailsPanel.activateDefaultWidget();
        });
    }

    setActive() {
        this.addClass("active");
    }

    setInactive() {
        this.removeClass("active");
    }
}
