import {Button} from "../../ui/button/Button";
import {CloseButton} from "../../ui/button/CloseButton";
import {ValueTypes} from "../../data/ValueTypes";
import {Attachment} from "./Attachment";
import {AttachmentJson} from "./AttachmentJson";
import {AttachmentBuilder} from "./Attachment";
import {SelectionItem} from "../../app/browse/SelectionItem";
import {FileUploaderEl} from "../../ui/uploader/FileUploaderEl";
import {UriHelper} from "../../util/UriHelper";
import {Element} from "../../dom/Element";
import {AttachmentItem} from "./AttachmentItem";

export class AttachmentUploaderEl extends FileUploaderEl<Attachment> {

        private attachmentItems: AttachmentItem[];

        private removeCallback: (value:string) => void;

        constructor(config) {

            if (config.url == undefined) {
                config.url = UriHelper.getRestUri("content/createAttachment");
            }
            if (config.attachmentRemoveCallback) {
                this.removeCallback = config.attachmentRemoveCallback;
            }
            if (config.selfIsDropzone == undefined) {
                config.selfIsDropzone = true;
            }

            this.attachmentItems = [];
            super(config);

            this.addClass('attachment-uploader-el');
        }


        createModel(serverResponse: AttachmentJson): Attachment {
            if (serverResponse) {
                return new AttachmentBuilder().
                    fromJson(serverResponse).
                    build();
            }
            else {
                return null;
            }
        }

        getModelValue(item: Attachment): string {
            return item.getName().toString();
        }

        removeAttachmentItem(value: string) {
            this.attachmentItems = this.attachmentItems.filter(
                item => !(item.getValue() == value)
            );
        }

        getExistingItem(value: string) : Element {
            var element = null;
            this.getResultContainer().getChildren().forEach((item) => {
                if((<AttachmentItem>item).getValue() == value) {
                    element = item;
                }
            });
            return element;
        }

        createResultItem(value: string): Element {

            var attachmentItem = new AttachmentItem(this.contentId, value, this.removeCallback);
            this.attachmentItems.push(attachmentItem);

            return attachmentItem;
        }
    }
