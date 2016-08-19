import {Panel} from "../../../../../../../../common/js/ui/panel/Panel";
import {NamesView} from "../../../../../../../../common/js/app/NamesView";

export class NoSelectionInspectionPanel extends Panel {

    private header: NamesView;

    constructor() {
        super("inspection-panel");

        this.header = new NamesView().setMainName("No item selected");

        this.appendChild(this.header);
    }
}
