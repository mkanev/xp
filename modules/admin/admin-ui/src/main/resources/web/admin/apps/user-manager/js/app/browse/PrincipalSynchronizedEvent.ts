import {Principal} from "../../../../../common/js/security/Principal";
import {Event} from "../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

export class PrincipalSynchronizedEvent extends Event {

    private principal: Principal;

    constructor(principal: Principal) {
        super();
        this.principal = principal;

    }

    getPrincipal(): Principal {
        return this.principal;
    }

    static on(handler: (event: PrincipalSynchronizedEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: PrincipalSynchronizedEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
