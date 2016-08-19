import {Principal} from "../../../../../common/js/security/Principal";
import {Event} from "../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

export class UpdatePrincipalEvent extends Event {
    private principals: Principal[];

    constructor(principals: Principal[]) {
        this.principals = principals;
        super();
    }

    getPrincipals(): Principal[] {
        return this.principals;
    }

    static on(handler: (event: UpdatePrincipalEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: UpdatePrincipalEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
