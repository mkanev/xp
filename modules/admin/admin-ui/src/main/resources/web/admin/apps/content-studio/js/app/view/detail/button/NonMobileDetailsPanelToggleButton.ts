import {DivEl} from "../../../../../../../common/js/dom/DivEl";
import {StyleHelper} from "../../../../../../../common/js/StyleHelper";

export class NonMobileDetailsPanelToggleButton extends DivEl {

    constructor() {
        super("button", StyleHelper.COMMON_PREFIX);
        this.addClass("non-mobile-details-panel-toggle-button");

        this.onClicked(() => {
            this.toggleClass("expanded");
        });
    }
}
