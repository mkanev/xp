import {Action} from "../../ui/Action";
import {CloseAction} from "./CloseAction";
import {SaveAction} from "./SaveAction";
import {WizardPanel} from "./WizardPanel";

export class SaveAndCloseAction extends Action {

        constructor(wizardPanel: WizardPanel<any>) {
            super("SaveAndClose", "mod+enter", true);

            this.onExecuted(() => {

                var deferred = wemQ.defer();

                let saveAction = new SaveAction(wizardPanel);
                saveAction.onAfterExecute(() => {
                    new CloseAction(wizardPanel).execute();
                    deferred.resolve(null);
                });
                saveAction.execute();

                return deferred.promise;
            });
        }
    }
