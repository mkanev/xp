import {Application} from "../../../../../common/js/application/Application";
import {ModalDialog} from "../../../../../common/js/ui/dialog/ModalDialog";
import {Action} from "../../../../../common/js/ui/Action";
import {ModalDialogHeader} from "../../../../../common/js/ui/dialog/ModalDialog";
import {H6El} from "../../../../../common/js/dom/H6El";
import {Body} from "../../../../../common/js/dom/Body";

import {UninstallApplicationEvent} from "./UninstallApplicationEvent";
export class UninstallApplicationDialog extends ModalDialog {

    private applications: Application[];

    private yesAction = new Action('Yes');

    private noAction = new Action('No');


    constructor(applications: Application[]) {
        super({
            title: new ModalDialogHeader("Uninstall Applications")
        });
        this.applications = applications;
        this.addClass("uninstall-dialog");

        var message = new H6El();
        message.getEl().setInnerHtml("Are you sure you want to uninstall selected application(s)?");
        this.appendChildToContentPanel(message);

        this.yesAction.onExecuted(() => {
            new UninstallApplicationEvent(this.applications).fire();
            this.close();
        });
        this.addAction(this.yesAction);

        this.noAction.onExecuted(() => {
            this.close();
        });
        this.addAction(this.noAction);
    }

    show() {
        Body.get().appendChild(this);
        super.show();
    }

    close() {
        super.close();
        this.remove();
    }
}
