import {Event} from "../../event/Event";
import {ClassHelper} from "../../ClassHelper";

export class OpenEditPermissionsDialogEvent extends Event {
        private content: any;

        constructor(content: any) {
            super();
            this.content = content;
        }

        getContent(): any {
            return this.content;
        }

        static on(handler: (event: OpenEditPermissionsDialogEvent) => void, contextWindow: Window = window) {
            Event.bind(ClassHelper.getFullName(this), handler, contextWindow);
        }

        static un(handler?: (event: OpenEditPermissionsDialogEvent) => void, contextWindow: Window = window) {
            Event.unbind(ClassHelper.getFullName(this), handler, contextWindow);
        }
    }
