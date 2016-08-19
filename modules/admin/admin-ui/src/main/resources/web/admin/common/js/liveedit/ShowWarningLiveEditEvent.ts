import {Event} from "../event/Event";
import {ClassHelper} from "../ClassHelper";

export class ShowWarningLiveEditEvent extends Event {

        private message: string;

        constructor(message: string) {
            this.message = message;
            super();
        }

        getMessage(): string {
            return this.message;
        }

        static on(handler: (event: ShowWarningLiveEditEvent) => void, contextWindow: Window = window) {
            Event.bind(ClassHelper.getFullName(this), handler, contextWindow);
        }

        static un(handler?: (event: ShowWarningLiveEditEvent) => void, contextWindow: Window = window) {
            Event.unbind(ClassHelper.getFullName(this), handler, contextWindow);
        }

    }
