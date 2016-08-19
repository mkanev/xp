import {Event} from "../event/Event";
import {WizardPanel} from "../app/wizard/WizardPanel";
import {ClassHelper} from "../ClassHelper";
import {UserStore} from "./UserStore";

export class UserStoreNamedEvent extends Event {

        private wizard: WizardPanel<UserStore>;
        private userStore: UserStore;

        constructor(wizard: WizardPanel<UserStore>, userStore: UserStore) {
            super();
            this.wizard = wizard;
            this.userStore = userStore;
        }

        public getWizard(): WizardPanel<UserStore> {
            return this.wizard;
        }

        public getUserStore(): UserStore {
            return this.userStore;
        }

        static on(handler: (event: UserStoreNamedEvent) => void) {
            Event.bind(ClassHelper.getFullName(this), handler);
        }

        static un(handler?: (event: UserStoreNamedEvent) => void) {
            Event.unbind(ClassHelper.getFullName(this), handler);
        }

    }

