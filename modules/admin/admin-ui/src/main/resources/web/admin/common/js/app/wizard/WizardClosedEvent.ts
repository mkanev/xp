import {WizardPanel} from "./WizardPanel";

export class WizardClosedEvent {

        private wizard: WizardPanel<any>;

        constructor(wizard: WizardPanel<any>) {
            this.wizard = wizard;
        }

        getWizard(): WizardPanel<any> {
            return this.wizard;
        }
    }
