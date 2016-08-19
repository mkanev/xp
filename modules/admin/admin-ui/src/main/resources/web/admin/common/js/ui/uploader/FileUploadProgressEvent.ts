import {Equitable} from "../../Equitable";
import {UploadItem} from "./UploadItem";

export class FileUploadProgressEvent<MODEL extends Equitable> {

        private uploadItem: UploadItem<MODEL>;

        constructor(uploadItem: UploadItem<MODEL>) {
            this.uploadItem = uploadItem;
        }

        getUploadItem(): UploadItem<MODEL> {
            return this.uploadItem;
        }

    }
