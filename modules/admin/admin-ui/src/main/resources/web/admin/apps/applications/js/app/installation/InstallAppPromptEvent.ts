import {Application} from "../../../../../common/js/application/Application";
import {Event} from "../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

import {ApplicationTreeGrid} from "../browse/ApplicationTreeGrid";

export class InstallAppPromptEvent extends Event {

    private installedApplications: Application[];

    constructor(installedApplications: Application[]) {
        super();
        this.installedApplications = installedApplications;
    }

    getInstalledApplications(): Application[] {
        return this.installedApplications;
    }

    static on(handler: (event: InstallAppPromptEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: InstallAppPromptEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
