import {UploadItem} from "../ui/uploader/UploadItem";
import {Event} from "../event/Event";
import {ClassHelper} from "../ClassHelper";
import {Application} from "./Application";

export class ApplicationUploadStartedEvent extends Event {

        private uploadItems: UploadItem<Application>[];

        constructor(items: UploadItem<Application>[]) {
            super();
            this.uploadItems = items;
        }

        getUploadItems(): UploadItem<Application>[] {
            return this.uploadItems;
        }

        static on(handler: (event: ApplicationUploadStartedEvent) => void) {
            Event.bind(ClassHelper.getFullName(this), handler);
        }

        static un(handler?: (event: ApplicationUploadStartedEvent) => void) {
            Event.unbind(ClassHelper.getFullName(this), handler);
        }
    }

