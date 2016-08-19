import {Event} from "../../../../../common/js/event/Event";
import {ContentSummary} from "../../../../../common/js/content/ContentSummary";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

export class SaveSortedContentEvent extends Event {

    private content: ContentSummary;

    constructor(content: ContentSummary) {
        this.content = content;
        super();
    }

    getContent(): ContentSummary {
        return this.content;
    }

    static on(handler: (event: SaveSortedContentEvent) => void, contextWindow: Window = window) {
        Event.bind(ClassHelper.getFullName(this), handler, contextWindow);
    }

    static un(handler?: (event: SaveSortedContentEvent) => void, contextWindow: Window = window) {
        Event.unbind(ClassHelper.getFullName(this), handler, contextWindow);
    }
}
