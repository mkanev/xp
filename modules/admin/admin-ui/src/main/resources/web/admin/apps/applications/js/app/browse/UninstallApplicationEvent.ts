import {Application} from "../../../../../common/js/application/Application";
import {Event} from "../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

export class UninstallApplicationEvent extends Event {
    private applications: Application[];

    constructor(applications: Application[]) {
        this.applications = applications;
        super();
    }

    getApplications(): Application[] {
        return this.applications;
    }

    static on(handler: (event: UninstallApplicationEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: UninstallApplicationEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
