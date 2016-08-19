import {Event} from "../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

export class ContentPreviewPathChangedEvent extends Event {

    private previewPath: string;

    constructor(previewPath: string) {
        super();
        this.previewPath = previewPath;
    }

    getPreviewPath() {
        return this.previewPath;
    }

    static on(handler: (event: ContentPreviewPathChangedEvent) => void, contextWindow: Window = window) {
        Event.bind(ClassHelper.getFullName(this), handler, contextWindow);
    }

    static un(handler?: (event: ContentPreviewPathChangedEvent) => void, contextWindow: Window = window) {
        Event.unbind(ClassHelper.getFullName(this), handler, contextWindow);
    }
}
