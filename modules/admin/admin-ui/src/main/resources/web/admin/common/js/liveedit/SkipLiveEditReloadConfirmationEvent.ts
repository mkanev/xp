import {Event} from "../event/Event";
import {ClassHelper} from "../ClassHelper";

export class SkipLiveEditReloadConfirmationEvent extends Event {

        private skip: boolean;

        constructor(skip: boolean) {
            super();
            this.skip = skip;
        }

        isSkip(): boolean {
            return this.skip;
        }

        static on(handler: (event: SkipLiveEditReloadConfirmationEvent) => void, contextWindow: Window = window) {
            Event.bind(ClassHelper.getFullName(this), handler, contextWindow);
        }

        static un(handler?: (event: SkipLiveEditReloadConfirmationEvent) => void, contextWindow: Window = window) {
            Event.unbind(ClassHelper.getFullName(this), handler, contextWindow);
        }
    }
