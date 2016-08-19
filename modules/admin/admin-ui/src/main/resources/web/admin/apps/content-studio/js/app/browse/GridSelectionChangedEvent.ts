import {Event} from "../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

export class GridSelectionChangeEvent extends BaseContentModelEvent {

    static on(handler: (event: GridSelectionChangeEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: GridSelectionChangeEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
