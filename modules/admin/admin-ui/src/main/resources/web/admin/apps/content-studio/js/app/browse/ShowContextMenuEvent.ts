import {Event} from "../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

export class ShowContextMenuEvent extends Event {

    private x: number;

    private y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        super();
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    static on(handler: (event: ShowContextMenuEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: ShowContextMenuEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
