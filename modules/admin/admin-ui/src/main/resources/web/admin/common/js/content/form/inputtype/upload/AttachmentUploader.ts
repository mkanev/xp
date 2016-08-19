import {Property} from "../../../../data/Property";
import {PropertyArray} from "../../../../data/PropertyArray";
import {Value} from "../../../../data/Value";
import {ValueType} from "../../../../data/ValueType";
import {ValueTypes} from "../../../../data/ValueTypes";
import {FileUploadStartedEvent} from "../../../../ui/uploader/FileUploadStartedEvent";
import {Content} from "../../../Content";
import {Attachment} from "../../../attachment/Attachment";
import {UploaderEl} from "../../../../ui/uploader/UploaderEl";
import {FileUploaderEl} from "../../../../ui/uploader/FileUploaderEl";
import {AttachmentUploaderEl} from "../../../attachment/AttachmentUploaderEl";
import {ContentInputTypeViewContext} from "../ContentInputTypeViewContext";
import {Input} from "../../../../form/Input";
import {FileUploadedEvent} from "../../../../ui/uploader/FileUploadedEvent";
import {showFeedback} from "../../../../notify/MessageBus";
import {ContentRequiresSaveEvent} from "../../../event/ContentRequiresSaveEvent";
import {MediaUploaderElOperation} from "../../../../ui/uploader/MediaUploaderEl";
import {InputTypeManager} from "../../../../form/inputtype/InputTypeManager";
import {Class} from "../../../../Class";
import {FileUploader} from "./FileUploader";

export class AttachmentUploader extends FileUploader {

        private attachmentNames: string[] = [];

        constructor(config: ContentInputTypeViewContext) {
            super(config);
            this.addClass("attachment-uploader");
            this.config = config;
        }

        layout(input: Input, propertyArray: PropertyArray): wemQ.Promise<void> {
            if (!ValueTypes.STRING.equals(propertyArray.getType())) {
                propertyArray.convertValues(ValueTypes.STRING);
            }

            return super.layout(input, propertyArray).then(() => {
                this.uploaderEl = this.createUploader();
                this.uploaderWrapper = this.createUploaderWrapper();

                this.update(propertyArray).done();

                this.uploaderEl.onUploadStarted(() => {
                    this.uploaderWrapper.removeClass("empty");
                });

                this.uploaderEl.onFileUploaded((event: FileUploadedEvent<Attachment>) => {

                    var attachment = <Attachment>event.getUploadItem().getModel();

                    this.setFileNameProperty(attachment.getName().toString());
                    this.attachmentNames = this.getFileNamesFromProperty(this.getPropertyArray());

                    showFeedback('\"' + attachment.getName().toString() + '\" uploaded');
                });

                this.uploaderEl.onUploadCompleted(() => {

                    this.validate(false);
                    new ContentRequiresSaveEvent(this.getContext().content.getContentId()).fire();

                });

                this.uploaderEl.onUploadFailed(() => {
                    this.uploaderEl.setProgressVisible(false);
                    this.uploaderWrapper.addClass("empty");
                });

                this.appendChild(this.uploaderWrapper);

                this.setLayoutInProgress(false);
                this.validate(false);

                return wemQ<void>(null);
            });
        }

        protected getNumberOfValids(): number {
            return this.getPropertyArray().getProperties().length;
        }

        protected createUploader(): FileUploaderEl<any> {

            return new AttachmentUploaderEl({
                params: {
                    id: this.getContext().content.getContentId().toString()
                },
                operation: MediaUploaderElOperation.update,
                name: this.getContext().input.getName(),
                showCancel: false,
                allowMultiSelection: this.getInput().getOccurrences().getMaximum() != 1,
                hideDefaultDropZone: !!(<any>(this.config.inputConfig)).hideDropZone,
                deferred: true,
                maximumOccurrences: this.getInput().getOccurrences().getMaximum(),
                attachmentRemoveCallback: this.removeItem.bind(this),
                hasUploadButton: false
            });
        }

        private removeItem(itemName: string) {
            var values = this.getFileNamesFromProperty(this.getPropertyArray());

            var index = values.indexOf(itemName);
            values.splice(index, 1);

            (<AttachmentUploaderEl>this.uploaderEl).removeAttachmentItem(itemName);
            this.getPropertyArray().remove(index);
            this.attachmentNames = this.getFileNamesFromProperty(this.getPropertyArray());

            new ContentRequiresSaveEvent(this.getContext().content.getContentId()).fire();
        }

    }
    InputTypeManager.register(new Class("AttachmentUploader", AttachmentUploader));
