import {Application} from "../../../../../common/js/application/Application";
import {Event} from "../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

export class StopApplicationEvent extends Event {
    private applications: Application[];

    constructor(applications: Application[]) {
        this.applications = applications;
        super();
    }

    getApplications(): Application[] {
        return this.applications;
    }

    static on(handler: (event: StopApplicationEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: StopApplicationEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
