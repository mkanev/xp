import {UploadItem} from "../../ui/uploader/UploadItem";

export class UploadFinishedEvent {

        private uploadItem: UploadItem<any>;

        constructor(uploadItem: UploadItem<any>) {
            this.uploadItem = uploadItem;
        }

        getUploadItem(): UploadItem<any> {
            return this.uploadItem;
        }
    }
