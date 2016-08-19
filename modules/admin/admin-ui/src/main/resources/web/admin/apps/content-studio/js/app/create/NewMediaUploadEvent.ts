import {Content} from "../../../../../common/js/content/Content";
import {UploadItem} from "../../../../../common/js/ui/uploader/UploadItem";
import {Event} from "../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

export class NewMediaUploadEvent extends Event {

    private uploadItems: UploadItem<Content>[];

    private parentContent: Content;

    constructor(items: UploadItem<Content>[], parentContent: Content) {
        super();
        this.uploadItems = items;
        this.parentContent = parentContent;
    }

    getUploadItems(): UploadItem<Content>[] {
        return this.uploadItems;
    }

    getParentContent(): Content {
        return this.parentContent;
    }

    static on(handler: (event: NewMediaUploadEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: NewMediaUploadEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
