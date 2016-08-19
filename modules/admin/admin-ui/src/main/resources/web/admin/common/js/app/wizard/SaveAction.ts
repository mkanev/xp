import {Action} from "../../ui/Action";
import {DefaultErrorHandler} from "../../DefaultErrorHandler";
import {WizardPanel} from "./WizardPanel";

export class SaveAction extends Action {

        constructor(wizardPanel: WizardPanel<any>, label: string = "Save") {
            super(label, "mod+s", true);

            this.onExecuted(() => {

                this.setEnabled(false);

                return wizardPanel.saveChanges().
                    catch((reason: any) => DefaultErrorHandler.handle(reason)).
                    finally(() => this.setEnabled(true));
            });
        }
    }
