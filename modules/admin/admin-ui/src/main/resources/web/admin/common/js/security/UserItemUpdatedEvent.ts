import {Event} from "../event/Event";
import {ClassHelper} from "../ClassHelper";
import {Principal} from "./Principal";
import {UserStore} from "./UserStore";

export class UserItemUpdatedEvent extends Event {

        private principal: Principal;
        private userStore: UserStore;

        constructor(principal: Principal, userStore: UserStore) {
            super();
            this.principal = principal;
            this.userStore = userStore;
        }

        public getPrincipal(): Principal {
            return this.principal;
        }

        public getUserStore(): UserStore {
            return this.userStore;
        }

        static on(handler: (event: UserItemUpdatedEvent) => void) {
            Event.bind(ClassHelper.getFullName(this), handler);
        }

        static un(handler?: (event: UserItemUpdatedEvent) => void) {
            Event.unbind(ClassHelper.getFullName(this), handler);
        }
    }
