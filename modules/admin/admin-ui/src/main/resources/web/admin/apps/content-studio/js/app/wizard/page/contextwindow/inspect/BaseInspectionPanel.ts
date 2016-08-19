import {RequestError} from "../../../../../../../../common/js/rest/RequestError";
import {Panel} from "../../../../../../../../common/js/ui/panel/Panel";

export class BaseInspectionPanel extends Panel {

    constructor() {
        super("inspection-panel");

        this.onRendered((event) => {
            wemjq(this.getHTMLElement()).slimScroll({
                height: '100%'
            });
        })
    }

    isNotFoundError(reason: any) {
        return reason instanceof RequestError && reason.statusCode === 404;
    }
}
