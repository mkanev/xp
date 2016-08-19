import {Event} from "../event/Event";
import {ClassHelper} from "../ClassHelper";

export class PageInspectedEvent extends Event {

        constructor() {
            super();
        }

        static on(handler: (event: PageInspectedEvent) => void, contextWindow: Window = window) {
            Event.bind(ClassHelper.getFullName(this), handler, contextWindow);
        }

        static un(handler: (event: PageInspectedEvent) => void, contextWindow: Window = window) {
            Event.unbind(ClassHelper.getFullName(this), handler, contextWindow);
        }
    }
