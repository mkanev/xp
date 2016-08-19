import {Event} from "../event/Event";
import {WizardPanel} from "../app/wizard/WizardPanel";
import {ClassHelper} from "../ClassHelper";
import {Principal} from "./Principal";

export class PrincipalNamedEvent extends Event {

        private wizard: WizardPanel<Principal>;
        private principal: Principal;

        constructor(wizard: WizardPanel<Principal>, principal: Principal) {
            super();
            this.wizard = wizard;
            this.principal = principal;
        }

        public getWizard(): WizardPanel<Principal> {
            return this.wizard;
        }

        public getPrincipal(): Principal {
            return this.principal;
        }

        static on(handler: (event: PrincipalNamedEvent) => void) {
            Event.bind(ClassHelper.getFullName(this), handler);
        }

        static un(handler?: (event: PrincipalNamedEvent) => void) {
            Event.unbind(ClassHelper.getFullName(this), handler);
        }

    }

