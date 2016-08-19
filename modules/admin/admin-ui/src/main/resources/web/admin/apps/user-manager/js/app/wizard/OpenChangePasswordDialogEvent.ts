import {Principal} from "../../../../../common/js/security/Principal";
import {Event} from "../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

export class OpenChangePasswordDialogEvent extends Event {

    private principal: Principal;

    constructor(principal: Principal) {
        this.principal = principal;
        super();
    }

    getPrincipal() {
        return this.principal;
    }

    static on(handler: (event: OpenChangePasswordDialogEvent) => void, contextWindow: Window = window) {
        Event.bind(ClassHelper.getFullName(this), handler, contextWindow);
    }

    static un(handler?: (event: OpenChangePasswordDialogEvent) => void, contextWindow: Window = window) {
        Event.unbind(ClassHelper.getFullName(this), handler, contextWindow);
    }
}
