import {ModalDialog} from "../../ui/dialog/ModalDialog";
import {WizardPanel} from "./WizardPanel";
import {Action} from "../../ui/Action";
import {ModalDialogHeader} from "../../ui/dialog/ModalDialog";
import {H6El} from "../../dom/H6El";
import {Body} from "../../dom/Body";
import {DefaultErrorHandler} from "../../DefaultErrorHandler";

export class SaveBeforeCloseDialog extends ModalDialog {

        private wizardPanel: WizardPanel<any>;

        private yesAction = new Action('Yes', 'y');

        private noAction = new Action('No', 'n');

        constructor(wizardPanel: WizardPanel<any>) {
            super({
                title: new ModalDialogHeader("Close wizard")
            });

            this.wizardPanel = wizardPanel;

            var message = new H6El();
            message.getEl().setInnerHtml("There are unsaved changes, do you want to save them before closing?");
            this.appendChildToContentPanel(message);

            this.yesAction.setMnemonic("y");
            this.yesAction.onExecuted(() => {
                this.doSaveAndClose();
            });
            this.addAction(this.yesAction, true);

            this.noAction.setMnemonic("n");
            this.noAction.onExecuted(() => {
                this.doCloseWithoutSaveCheck();
            });
            this.addAction(this.noAction);

            this.getCancelAction().setMnemonic("c");
        }

        show() {
            Body.get().appendChild(this);
            super.show();
        }

        close() {
            this.remove();
            super.close();
        }

        private doSaveAndClose() {

            this.close();
            this.wizardPanel.saveChanges().
                then(() => this.wizardPanel.close(true)).
                catch((reason: any) => DefaultErrorHandler.handle(reason)).
                done();
        }

        private doCloseWithoutSaveCheck() {

            this.close();
            this.wizardPanel.close();
        }

    }

