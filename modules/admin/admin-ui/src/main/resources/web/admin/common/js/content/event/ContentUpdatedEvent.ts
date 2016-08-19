import {Event} from "../../event/Event";
import {ContentSummary} from "../ContentSummary";
import {ContentId} from "../ContentId";
import {ClassHelper} from "../../ClassHelper";

export class ContentUpdatedEvent extends Event {

        private contentSummary: ContentSummary;

        constructor(contentSummary: ContentSummary) {
            super();
            this.contentSummary = contentSummary;
        }

        public getContentId(): ContentId {
            return this.contentSummary.getContentId();
        }

        public getContentSummary(): ContentSummary {
            return this.contentSummary;
        }

        static on(handler: (event: ContentUpdatedEvent) => void) {
            Event.bind(ClassHelper.getFullName(this), handler);
        }

        static un(handler?: (event: ContentUpdatedEvent) => void) {
            Event.unbind(ClassHelper.getFullName(this), handler);
        }

    }
