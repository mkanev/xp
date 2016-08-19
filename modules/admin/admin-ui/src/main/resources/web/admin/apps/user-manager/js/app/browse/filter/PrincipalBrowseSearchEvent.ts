import {Event} from "../../../../../../common/js/event/Event";
import {Principal} from "../../../../../../common/js/security/Principal";
import {ClassHelper} from "../../../../../../common/js/ClassHelper";

export class PrincipalBrowseSearchEvent extends Event {

    private principals: Principal[];

    constructor(principals: Principal[]) {
        super();
        this.principals = principals;
    }

    getPrincipals(): Principal[] {
        return this.principals;
    }

    static on(handler: (event: PrincipalBrowseSearchEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: PrincipalBrowseSearchEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
