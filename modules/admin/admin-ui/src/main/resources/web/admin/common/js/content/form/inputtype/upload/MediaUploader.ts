import {Property} from "../../../../data/Property";
import {Value} from "../../../../data/Value";
import {ValueType} from "../../../../data/ValueType";
import {ValueTypes} from "../../../../data/ValueTypes";
import {FileUploadStartedEvent} from "../../../../ui/uploader/FileUploadStartedEvent";
import {BaseInputTypeSingleOccurrence} from "../../../../form/inputtype/support/BaseInputTypeSingleOccurrence";
import {ContentInputTypeViewContext} from "../ContentInputTypeViewContext";
import {MediaUploaderEl} from "../../../../ui/uploader/MediaUploaderEl";
import {DivEl} from "../../../../dom/DivEl";
import {ImgEl} from "../../../../dom/ImgEl";
import {Input} from "../../../../form/Input";
import {FileUploadedEvent} from "../../../../ui/uploader/FileUploadedEvent";
import {Content} from "../../../Content";
import {showFeedback} from "../../../../notify/MessageBus";
import {InputValidationRecording} from "../../../../form/inputtype/InputValidationRecording";
import {ContentImageUrlResolver} from "../../../util/ContentImageUrlResolver";
import {GetContentByIdRequest} from "../../../resource/GetContentByIdRequest";
import {DeleteContentRequest} from "../../../resource/DeleteContentRequest";
import {DeleteContentResult} from "../../../resource/result/DeleteContentResult";
import {showError} from "../../../../notify/MessageBus";
import {StringHelper} from "../../../../util/StringHelper";
import {Button} from "../../../../ui/button/Button";
import {MediaUploaderElOperation} from "../../../../ui/uploader/MediaUploaderEl";
import {InputTypeManager} from "../../../../form/inputtype/InputTypeManager";
import {Class} from "../../../../Class";

export interface MediaUploaderConfigAllowType {
        name: string;
        extensions: string;
    }

    export class MediaUploader extends BaseInputTypeSingleOccurrence<string> {
        private config: ContentInputTypeViewContext;
        private mediaUploaderEl: MediaUploaderEl;
        private uploaderWrapper: DivEl;
        private svgImage: ImgEl;

        constructor(config: ContentInputTypeViewContext) {
            super(config, "media-uploader");
            this.config = config;
        }

        getContext(): ContentInputTypeViewContext {
            return <ContentInputTypeViewContext>super.getContext();
        }

        getValueType(): ValueType {
            return ValueTypes.STRING;
        }

        newInitialValue(): Value {
            return ValueTypes.STRING.newNullValue();
        }

        layoutProperty(input: Input, property: Property): wemQ.Promise<void> {
            if (!ValueTypes.STRING.equals(property.getType()) && !ValueTypes.DATA.equals(property.getType())) {
                property.convertValueType(ValueTypes.STRING);
            }
            this.mediaUploaderEl = this.createUploader(property);

            this.uploaderWrapper = this.createUploaderWrapper(property);

            this.updateProperty(property).done();

            this.mediaUploaderEl.onUploadStarted(() => {
                this.uploaderWrapper.removeClass("empty");
            });

            this.mediaUploaderEl.onFileUploaded((event: FileUploadedEvent<Content>) => {

                var content = event.getUploadItem().getModel(),
                    value = this.mediaUploaderEl.getMediaValue(content),
                    fileName = value.getString();

                this.mediaUploaderEl.setFileName(fileName);

                switch (property.getType()) {
                case ValueTypes.DATA:
                    property.getPropertySet().setProperty('attachment', 0, value);
                    break;
                case ValueTypes.STRING:
                    property.setValue(ValueTypes.STRING.newValue(fileName));
                    break;
                }

                showFeedback('\"' + fileName + '\" uploaded');

                this.manageSVGImageIfPresent(content);
            });

            this.mediaUploaderEl.onUploadFailed(() => {
                this.mediaUploaderEl.setProgressVisible(false);
                this.uploaderWrapper.addClass("empty");
            });

            this.mediaUploaderEl.onUploadReset(() => {
                this.mediaUploaderEl.setFileName('');

                switch (property.getType()) {
                case ValueTypes.DATA:
                    property.getPropertySet().setProperty('attachment', 0, ValueTypes.STRING.newNullValue());
                    break;
                case ValueTypes.STRING:
                    property.setValue(ValueTypes.STRING.newNullValue());
                    break;
                }
            });

            this.appendChild(this.uploaderWrapper);

            this.createSvgImageWrapperIfNeeded();

            return wemQ<void>(null);
        }

        validate(silent: boolean = true): InputValidationRecording {
            return new InputValidationRecording();
        }

        updateProperty(property: Property, unchangedOnly?: boolean): wemQ.Promise<void> {
            if ((!unchangedOnly || !this.mediaUploaderEl.isDirty()) && this.getContext().content.getContentId()) {

                this.mediaUploaderEl.setValue(this.getContext().content.getContentId().toString());

                if (property.hasNonNullValue()) {
                    this.mediaUploaderEl.setFileName(this.getFileNameFromProperty(property));
                }
            }
            return wemQ<void>(null);
        }

        private manageSVGImageIfPresent(content: Content) {
            if (content.getType().isVectorMedia()) {
                this.addClass("with-svg-image");
                var imgUrl = new ContentImageUrlResolver().setContentId(
                    this.getContext().content.getContentId()).setTimestamp(
                    content.getModifiedTime()).resolve();

                this.svgImage.setSrc(imgUrl);
            } else {
                this.removeClass("with-svg-image");
            }
        }

        private deleteContent(property: Property) {
            var contentId = this.getContext().content.getContentId();

            new GetContentByIdRequest(contentId).sendAndParse().then((content: Content) => {
                var deleteRequest = new DeleteContentRequest();

                deleteRequest.addContentPath(content.getPath());
                deleteRequest.sendAndParse().then((result: DeleteContentResult) => {
                    this.mediaUploaderEl.getResultContainer().removeChildren();
                    this.uploaderWrapper.addClass("empty");
                    property.setValue(this.newInitialValue());

                    showFeedback('\"' + result.getDeleted()[0].getName() + '\" deleted');
                }).catch((reason: any) => {
                    if (reason && reason.message) {
                        showError(reason.message);
                    } else {
                        showError('Content could not be deleted.');
                    }
                }).done();
            });
        }

        private getFileNameFromProperty(property: Property): string {
            if (property.getValue() != null) {
                switch (property.getType()) {
                case ValueTypes.DATA:
                    return property.getPropertySet().getString('attachment');
                case ValueTypes.STRING:
                    return property.getValue().getString();
                }
            }
            return "";
        }

        private getFileExtensionFromFileName(fileName: string): string {
            return fileName.split('.').pop();
        }

        private propertyAlreadyHasAttachment(property: Property): boolean {
            return (property.getValue() != null &&
                    property.getType() == ValueTypes.DATA &&
                    !StringHelper.isEmpty(property.getPropertySet().getString('attachment')));
        }

        private getAllowTypeFromFileName(fileName: string): MediaUploaderConfigAllowType[] {
            return [{name: "Media", extensions: this.getFileExtensionFromFileName(fileName)}];
        }

        private createSvgImageWrapperIfNeeded() {
            if (this.config.formContext.getContentTypeName().isVectorMedia()) {
                this.svgImage = new ImgEl();
                this.addClass("with-svg-image");

                var content = this.config.formContext.getPersistedContent();

                var imgUrl = new ContentImageUrlResolver().setContentId(
                    this.getContext().content.getContentId()).setTimestamp(
                    content.getModifiedTime()).resolve();

                this.svgImage.setSrc(imgUrl);

                this.appendChild(new DivEl("svg-image-wrapper").appendChild(this.svgImage));

                this.svgImage.onLoaded((event: UIEvent) => {
                    this.mediaUploaderEl.setResultVisible(true); // need to call it manually as svg images are uploaded too quickly
                });
            }
        }

        private createUploaderWrapper(property: Property): DivEl {
            var wrapper = new DivEl("uploader-wrapper");

            var uploadButton = new Button();
            uploadButton.addClass('upload-button');

            uploadButton.onClicked((event: MouseEvent) => {
                if (property.hasNullValue()) {
                    return;
                }
                this.mediaUploaderEl.showFileSelectionDialog();
            });

            wrapper.appendChild(this.mediaUploaderEl);
            wrapper.appendChild(uploadButton);

            return wrapper;
        }

        private createUploader(property: Property): MediaUploaderEl {

            var predefinedAllowTypes,
                attachmentFileName = this.getFileNameFromProperty(property);

            if (this.propertyAlreadyHasAttachment(property)) {
                predefinedAllowTypes = this.getAllowTypeFromFileName(attachmentFileName);
            }

            var allowTypesConfig: MediaUploaderConfigAllowType[] = predefinedAllowTypes || (<any>(this.config.inputConfig)).allowTypes ||
                [];
            var allowTypes = allowTypesConfig.map((allowType: MediaUploaderConfigAllowType) => {
                return {title: allowType.name, extensions: allowType.extensions};
            });

            var hideDropZone = (<any>(this.config.inputConfig)).hideDropZone;

            return new MediaUploaderEl({
                params: {
                    content: this.getContext().content.getContentId().toString()
                },
                operation: MediaUploaderElOperation.update,
                allowTypes: allowTypes,
                name: this.getContext().input.getName(),
                maximumOccurrences: 1,
                allowMultiSelection: false,
                hideDefaultDropZone: hideDropZone != null ? hideDropZone : true,
                deferred: true,
                hasUploadButton: false
            });
        }

        onFocus(listener: (event: FocusEvent) => void) {
            this.mediaUploaderEl.onFocus(listener);
        }

        unFocus(listener: (event: FocusEvent) => void) {
            this.mediaUploaderEl.unFocus(listener);
        }

        onBlur(listener: (event: FocusEvent) => void) {
            this.mediaUploaderEl.onBlur(listener);
        }

        unBlur(listener: (event: FocusEvent) => void) {
            this.mediaUploaderEl.unBlur(listener);
        }
    }
    InputTypeManager.register(new Class("MediaUploader", MediaUploader));
