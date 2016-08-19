import {ContentTypeSummary} from "../../../../../common/js/schema/content/ContentTypeSummary";
import {Content} from "../../../../../common/js/content/Content";
import {Event} from "../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

export class NewContentEvent extends Event {

    private contentType: ContentTypeSummary;

    private parentContent: Content;

    constructor(contentType: ContentTypeSummary, parentContent: Content) {
        super();
        this.contentType = contentType;
        this.parentContent = parentContent;
    }

    getContentType(): ContentTypeSummary {
        return this.contentType;
    }

    getParentContent(): Content {
        return this.parentContent;
    }

    static on(handler: (event: NewContentEvent) => void) {
        Event.bind(ClassHelper.getFullName(this), handler);
    }

    static un(handler?: (event: NewContentEvent) => void) {
        Event.unbind(ClassHelper.getFullName(this), handler);
    }
}
