import {Property} from "../../../../data/Property";
import {Value} from "../../../../data/Value";
import {ValueType} from "../../../../data/ValueType";
import {ValueTypes} from "../../../../data/ValueTypes";
import {Point} from "../../../../ui/image/ImageEditor";
import {Rect} from "../../../../ui/image/ImageEditor";
import {BaseInputTypeSingleOccurrence} from "../../../../form/inputtype/support/BaseInputTypeSingleOccurrence";
import {ImageUploaderEl} from "../../../image/ImageUploaderEl";
import {InputValidationRecording} from "../../../../form/inputtype/InputValidationRecording";
import {ContentInputTypeViewContext} from "../ContentInputTypeViewContext";
import {MediaUploaderElOperation} from "../../../../ui/uploader/MediaUploaderEl";
import {Input} from "../../../../form/Input";
import {FileUploadedEvent} from "../../../../ui/uploader/FileUploadedEvent";
import {Content} from "../../../Content";
import {showFeedback} from "../../../../notify/MessageBus";
import {ImageErrorEvent} from "../../../image/ImageErrorEvent";
import {GetContentByIdRequest} from "../../../resource/GetContentByIdRequest";
import {DefaultErrorHandler} from "../../../../DefaultErrorHandler";
import {PropertyTree} from "../../../../data/PropertyTree";
import {InputValidityChangedEvent} from "../../../../form/inputtype/InputValidityChangedEvent";
import {InputTypeManager} from "../../../../form/inputtype/InputTypeManager";
import {Class} from "../../../../Class";

export class ImageUploader extends BaseInputTypeSingleOccurrence<string> {

        private imageUploader: ImageUploaderEl;
        private previousValidationRecording: InputValidationRecording;

        constructor(config: ContentInputTypeViewContext) {
            super(config);
            this.initUploader(config);
            this.addClass("image-uploader-input");
        }

        private initUploader(config: ContentInputTypeViewContext) {
            this.imageUploader = new ImageUploaderEl({
                params: {
                    content: config.content.getContentId().toString()
                },
                operation: MediaUploaderElOperation.update,
                name: config.input.getName(),
                maximumOccurrences: 1,
                hideDefaultDropZone: true
            });

            this.imageUploader.getUploadButton().hide();
            this.appendChild(this.imageUploader);
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

            this.input = input;

            this.imageUploader.onUploadStarted(() => this.imageUploader.getUploadButton().hide());

            this.imageUploader.onFileUploaded((event: FileUploadedEvent<Content>) => {
                var content = event.getUploadItem().getModel(),
                    value = this.imageUploader.getMediaValue(content);

                this.imageUploader.setOriginalDimensions(content);

                this.saveToProperty(value);
                showFeedback(content.getDisplayName() + ' saved');
            });

            this.imageUploader.onUploadReset(() => {
                this.saveToProperty(this.newInitialValue());
                this.imageUploader.getUploadButton().show();
            });

            this.imageUploader.onUploadFailed(() => {
                this.saveToProperty(this.newInitialValue());
                this.imageUploader.getUploadButton().show();
                this.imageUploader.setProgressVisible(false);
            });

            ImageErrorEvent.on((event: ImageErrorEvent) => {
                if (this.getContext().content.getContentId().equals(event.getContentId())) {
                    this.imageUploader.getUploadButton().show();
                    this.imageUploader.setProgressVisible(false);
                }
            });

            this.imageUploader.onEditModeChanged((edit: boolean, crop: Rect, zoom: Rect, focus: Point) => {
                this.validate(false);

                if (!edit && crop) {
                    this.saveEditDataToProperty(crop, zoom, focus);
                }
            });

            this.imageUploader.onCropAutoPositionedChanged((auto) => {
                if (auto) {
                    this.saveEditDataToProperty({x: 0, y: 0, x2: 1, y2: 1}, {x: 0, y: 0, x2: 1, y2: 1}, null);
                }
            });

            this.imageUploader.onFocusAutoPositionedChanged((auto) => {
                if (auto) {
                    this.saveEditDataToProperty(null, null, {x: 0.5, y: 0.5});
                }
            });

            return property.hasNonNullValue() ? this.updateProperty(property) : wemQ<void>(null);
        }

        protected saveToProperty(value: Value) {
            this.ignorePropertyChange = true;
            var property = this.getProperty();
            switch (property.getType()) {
            case ValueTypes.DATA:
                // update the attachment name, and reset the focal point data
                var set = property.getPropertySet();
                set.setProperty('attachment', 0, value);
                set.removeProperty('focalPoint', 0);
                set.removeProperty('cropPosition', 0);
                set.removeProperty('zoomPosition', 0);

                break;
            case ValueTypes.STRING:
                property.setValue(value);
                break;
            }
            this.validate();
            this.ignorePropertyChange = false;
        }

        updateProperty(property: Property, unchangedOnly?: boolean): Q.Promise<void> {
            if ((!unchangedOnly || !this.imageUploader.isDirty()) && this.getContext().content.getContentId()) {

                return new GetContentByIdRequest(this.getContext().content.getContentId()).
                    sendAndParse().
                    then((content: Content) => {

                        this.imageUploader.setOriginalDimensions(content);
                        this.imageUploader.setValue(content.getId(), false, true);

                        this.configEditorsProperties(content);

                    }).catch((reason: any) => {
                        DefaultErrorHandler.handle(reason);
                    });
            }
            return wemQ<void>(null);
        }

        private saveEditDataToProperty(crop: Rect, zoom: Rect, focus: Point) {
            var container = this.getPropertyContainer(this.getProperty());

            if (container) {
                if (crop) {
                    container.setDoubleByPath('cropPosition.left', crop.x);
                    container.setDoubleByPath('cropPosition.top', crop.y);
                    container.setDoubleByPath('cropPosition.right', crop.x2);
                    container.setDoubleByPath('cropPosition.bottom', crop.y2);
                    container.setDoubleByPath('cropPosition.zoom', zoom.x2 - zoom.x);
                }

                if (zoom) {
                    container.setDoubleByPath('zoomPosition.left', zoom.x);
                    container.setDoubleByPath('zoomPosition.top', zoom.y);
                    container.setDoubleByPath('zoomPosition.right', zoom.x2);
                    container.setDoubleByPath('zoomPosition.bottom', zoom.y2);
                }

                if (focus) {
                    container.setDoubleByPath('focalPoint.x', focus.x);
                    container.setDoubleByPath('focalPoint.y', focus.y);
                }
            }
        }

        private getPropertyContainer(property: Property) {
            var container;
            switch (property.getType()) {
            case ValueTypes.DATA:
                container = property.getPropertySet();
                break;
            case ValueTypes.STRING:
                // save in new format always no matter what was the format originally
                container = new PropertyTree();
                container.setString('attachment', 0, property.getString());
                var propertyParent = property.getParent();
                var propertyName = property.getName();
                // remove old string property and set the new property set
                propertyParent.removeProperty(propertyName, 0);
                var newProperty = propertyParent.setPropertySet(propertyName, 0, container.getRoot());
                // update local property reference
                this.registerProperty(newProperty);
                break;
            }
            return container;
        }

        private getFocalPoint(content: Content): Point {
            var focalProperty = this.getMediaProperty(content, 'focalPoint');

            if (!focalProperty) {
                return null;
            }

            var focalSet = focalProperty.getPropertySet(),
                x = focalSet.getDouble('x'),
                y = focalSet.getDouble('y');

            if (!x || !y) {
                return null;
            }

            return {
                x: x,
                y: y
            }
        }

        private getRectFromProperty(content: Content, propertyName: string): Rect {
            var property = this.getMediaProperty(content, propertyName);

            if (!property) {
                return null;
            }

            var cropPositionSet = property.getPropertySet(),
                x = cropPositionSet.getDouble('left'),
                y = cropPositionSet.getDouble('top'),
                x2 = cropPositionSet.getDouble('right'),
                y2 = cropPositionSet.getDouble('bottom');

            return {
                x: x,
                y: y,
                x2: x2,
                y2: y2
            };
        }

        private getMediaProperty(content: Content, propertyName: string) {
            var mediaProperty = content.getProperty('media');
            if (!mediaProperty || !ValueTypes.DATA.equals(mediaProperty.getType())) {
                return null;
            }

            var resultProperty = mediaProperty.getPropertySet().getProperty(propertyName);
            if (!resultProperty || !ValueTypes.DATA.equals(resultProperty.getType())) {
                return null;
            }
            return resultProperty;
        }

        private configEditorsProperties(content: Content) {
            var focalPoint = this.getFocalPoint(content);
            if (focalPoint) {
                this.imageUploader.setFocalPoint(focalPoint.x, focalPoint.y);
            }

            var cropPosition = this.getRectFromProperty(content, 'cropPosition');
            if (cropPosition) {
                this.imageUploader.setCrop(cropPosition);
            }

            var zoomPosition = this.getRectFromProperty(content, 'zoomPosition');
            if (zoomPosition) {
                this.imageUploader.setZoom(zoomPosition);
            }
        }

        validate(silent: boolean = true): InputValidationRecording {
            var recording = new InputValidationRecording();
            var propertyValue = this.getProperty().getValue();

            if (this.imageUploader.isFocalPointEditMode() || this.imageUploader.isCropEditMode()) {
                recording.setBreaksMinimumOccurrences(true);
            }
            if (propertyValue.isNull() && this.input.getOccurrences().getMinimum() > 0) {
                recording.setBreaksMinimumOccurrences(true);
            }
            if (!silent) {
                if (recording.validityChanged(this.previousValidationRecording)) {
                    this.notifyValidityChanged(new InputValidityChangedEvent(recording, this.input.getName()));
                }
            }
            this.previousValidationRecording = recording;
            return recording;
        }

        onFocus(listener: (event: FocusEvent) => void) {
            this.imageUploader.onFocus(listener);
        }

        unFocus(listener: (event: FocusEvent) => void) {
            this.imageUploader.unFocus(listener);
        }

        onBlur(listener: (event: FocusEvent) => void) {
            this.imageUploader.onBlur(listener);
        }

        unBlur(listener: (event: FocusEvent) => void) {
            this.imageUploader.unBlur(listener);
        }

    }

    InputTypeManager.register(new Class("ImageUploader", ImageUploader));
