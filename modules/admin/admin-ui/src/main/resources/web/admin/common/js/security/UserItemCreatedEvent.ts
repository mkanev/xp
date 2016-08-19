import {Event} from "../event/Event";
import {ClassHelper} from "../ClassHelper";
import {Principal} from "./Principal";
import {UserStore} from "./UserStore";

export class UserItemCreatedEvent extends Event {

        private principal: Principal;
        private userStore: UserStore;
        private parentOfSameType: boolean;

        constructor(principal: Principal, userStore: UserStore, parentOfSameType?: boolean) {
            super();
            this.principal = principal;
            this.userStore = userStore;
            this.parentOfSameType = parentOfSameType;
        }

        public getPrincipal(): Principal {
            return this.principal;
        }

        public getUserStore(): UserStore {
            return this.userStore;
        }

        public isParentOfSameType(): boolean {
            return this.parentOfSameType;
        }

        static on(handler: (event: UserItemCreatedEvent) => void) {
            Event.bind(ClassHelper.getFullName(this), handler);
        }

        static un(handler?: (event: UserItemCreatedEvent) => void) {
            Event.unbind(ClassHelper.getFullName(this), handler);
        }
    }

