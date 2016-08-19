import {Event} from "../../event/Event";
import {ContentId} from "../ContentId";
import {ClassHelper} from "../../ClassHelper";

export class ActiveContentVersionSetEvent extends Event {

        private contentId: ContentId;
        private versionId: string;

        constructor(contentId: ContentId, versionId: string) {
            this.contentId = contentId;
            this.versionId = versionId;
            super();
        }

        getContentId(): ContentId {
            return this.contentId;
        }

        getVersionId(): string {
            return this.versionId;
        }

        static on(handler: (event: ActiveContentVersionSetEvent) => void) {
            Event.bind(ClassHelper.getFullName(this), handler);
        }

        static un(handler?: (event: ActiveContentVersionSetEvent) => void) {
            Event.unbind(ClassHelper.getFullName(this), handler);
        }
    }
