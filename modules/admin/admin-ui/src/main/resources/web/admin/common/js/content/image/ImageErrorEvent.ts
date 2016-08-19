import {Content} from "../Content";
import {Event} from "../../event/Event";
import {ClassHelper} from "../../ClassHelper";
import {ContentId} from "../ContentId";

export class ImageErrorEvent extends Event {

        private contentId: ContentId;

        constructor(contentId: ContentId) {
            super();
            this.contentId = contentId;
        }

        getContentId(): ContentId {
            return this.contentId;
        }

        static on(handler: (event: ImageErrorEvent) => void) {
            Event.bind(ClassHelper.getFullName(this), handler);
        }

        static un(handler?: (event: ImageErrorEvent) => void) {
            Event.unbind(ClassHelper.getFullName(this), handler);
        }
    }
