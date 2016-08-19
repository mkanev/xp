import {Event} from "../../event/Event";
import {ClassHelper} from "../../ClassHelper";

export class TreeGridItemClickedEvent extends Event {

        private repeatedSelection: boolean;

        constructor(repeatedSelection?: boolean) {
            super();
            this.repeatedSelection = repeatedSelection;
        }

        isRepeatedSelection(): boolean {
            return this.repeatedSelection;
        }

        static on(handler: (event: TreeGridItemClickedEvent) => void) {
            Event.bind(ClassHelper.getFullName(this), handler);
        }

        static un(handler?: (event: TreeGridItemClickedEvent) => void) {
            Event.unbind(ClassHelper.getFullName(this), handler);
        }
    }
