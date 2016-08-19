import {Event} from "../event/Event";
import {ClassHelper} from "../ClassHelper";
import {LiveEditModel} from "./LiveEditModel";

export class InitializeLiveEditEvent extends Event {

        private liveEditModel: LiveEditModel;

        constructor(liveEditModel: LiveEditModel) {
            super();
            this.liveEditModel = liveEditModel;
        }

        getLiveEditModel(): LiveEditModel {
            return this.liveEditModel;
        }

        static on(handler: (event: InitializeLiveEditEvent) => void, contextWindow: Window = window) {
            Event.bind(ClassHelper.getFullName(this), handler, contextWindow);
        }

        static un(handler?: (event: InitializeLiveEditEvent) => void, contextWindow: Window = window) {
            Event.unbind(ClassHelper.getFullName(this), handler, contextWindow);
        }
    }
