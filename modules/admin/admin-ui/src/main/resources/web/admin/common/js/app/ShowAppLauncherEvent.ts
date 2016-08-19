import {Event} from "../event/Event";
import {ClassHelper} from "../ClassHelper";
import {App} from "./Application";

export class ShowAppLauncherEvent extends Event {

        private application: App;

        private sessionExpired: boolean;

        constructor(application: App, sessionExpired?: boolean) {
            super();
            this.application = application;
            this.sessionExpired = !!sessionExpired;
        }

        getApplication(): App {
            return this.application;
        }

        isSessionExpired(): boolean {
            return this.sessionExpired;
        }

        static on(handler: (event: ShowAppLauncherEvent) => void) {
            Event.bind(ClassHelper.getFullName(this), handler);
        }

    }
