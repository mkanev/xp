import {ContentSummary} from "../../../../../common/js/content/ContentSummary";
import {Event} from "../../../../../common/js/event/Event";
import {ClassHelper} from "../../../../../common/js/ClassHelper";

export class ToggleSearchPanelWithDependenciesEvent extends Event {

    private item: ContentSummary;

    private inbound: boolean;

    constructor(item: ContentSummary, inbound: boolean) {
        super();
        this.item = item;
        this.inbound = inbound;
    }

    getContent(): ContentSummary {
        return this.item;
    }

    isInbound(): boolean {
        return this.inbound;
    }

    static on(handler: (event: ToggleSearchPanelWithDependenciesEvent) => void, contextWindow: Window = window) {
        Event.bind(ClassHelper.getFullName(this), handler, contextWindow);
    }

    static un(handler?: (event: ToggleSearchPanelWithDependenciesEvent) => void, contextWindow: Window = window) {
        Event.unbind(ClassHelper.getFullName(this), handler, contextWindow);
    }
}
