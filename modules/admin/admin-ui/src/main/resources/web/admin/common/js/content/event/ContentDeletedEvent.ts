import {Event} from "../../event/Event";
import {ContentPath} from "../ContentPath";
import {ClassHelper} from "../../ClassHelper";
import {ContentId} from "../ContentId";

export class ContentDeletedEvent extends Event {

        private contentDeletedItems: ContentDeletedItem[] = [];

        constructor() {
            super();
        }

        addItem(contentId: ContentId, contentPath: ContentPath, branch: string): ContentDeletedEvent {
            this.contentDeletedItems.push(new ContentDeletedItem(contentId, contentPath, branch, false));
            return this;
        }

        addPendingItem(contentId: ContentId, contentPath: ContentPath): ContentDeletedEvent {
            this.contentDeletedItems.push(new ContentDeletedItem(contentId, contentPath, "master", true));
            return this;
        }

        getDeletedItems(): ContentDeletedItem[] {
            return this.contentDeletedItems;
        }

        isEmpty(): boolean {
            return this.contentDeletedItems.length == 0;
        }

        fire() {
            if (!this.isEmpty()) {
                super.fire();
            }
        }

        static on(handler: (event: ContentDeletedEvent) => void) {
            Event.bind(ClassHelper.getFullName(this), handler);
        }

        static un(handler?: (event: ContentDeletedEvent) => void) {
            Event.unbind(ClassHelper.getFullName(this), handler);
        }
    }

    export class ContentDeletedItem {

        private contentPath: ContentPath;

        private pending: boolean;

        private contentId: ContentId;

        private branch: string;

        constructor(contentId: ContentId, contentPath: ContentPath, branch: string, pending: boolean = false) {
            this.contentPath = contentPath;
            this.pending = pending;
            this.contentId = contentId;
            this.branch = branch;
        }

        public getBranch(): string {
            return this.branch;
        }

        public getContentPath(): ContentPath {
            return this.contentPath;
        }

        public getContentId(): ContentId {
            return this.contentId;
        }

        public isPending(): boolean {
            return this.pending;
        }
    }
