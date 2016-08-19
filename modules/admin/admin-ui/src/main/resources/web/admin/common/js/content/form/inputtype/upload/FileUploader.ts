import {Property} from "../../../../data/Property";
import {PropertyArray} from "../../../../data/PropertyArray";
import {Value} from "../../../../data/Value";
import {ValueType} from "../../../../data/ValueType";
import {ValueTypes} from "../../../../data/ValueTypes";
import {FileUploadStartedEvent} from "../../../../ui/uploader/FileUploadStartedEvent";
import {UploaderEl} from "../../../../ui/uploader/UploaderEl";
import {FileUploaderEl} from "../../../../ui/uploader/FileUploaderEl";
import {BaseInputTypeManagingAdd} from "../../../../form/inputtype/support/BaseInputTypeManagingAdd";
import {ContentInputTypeViewContext} from "../ContentInputTypeViewContext";
import {DivEl} from "../../../../dom/DivEl";
import {Button} from "../../../../ui/button/Button";

export class FileUploader extends BaseInputTypeManagingAdd<string> {

        protected config: ContentInputTypeViewContext;
        protected uploaderEl: FileUploaderEl<any>;
        protected uploaderWrapper: DivEl;

        constructor(config: ContentInputTypeViewContext) {
            super("file-uploader");
            this.config = config;
        }

        getContext(): ContentInputTypeViewContext {
            return this.config;
        }

        getValueType(): ValueType {
            return ValueTypes.STRING;
        }

        newInitialValue(): Value {
            return null;
        }

        update(propertyArray: PropertyArray, unchangedOnly?: boolean): wemQ.Promise<void> {

            var superPromise = super.update(propertyArray, unchangedOnly);
            this.uploaderEl.setContentId(this.getContext().content.getContentId().toString());

                return superPromise.then(() => {
                    this.uploaderEl.resetValues(this.getValueFromPropertyArray(propertyArray));
                    this.validate(false);
                });

        }

        protected setFileNameProperty(fileName: string) {

            var value = new Value(fileName, ValueTypes.STRING);

            if (!this.getPropertyArray().containsValue(value)) {
                this.ignorePropertyChange = true;
                this.getPropertyArray().add(value);
                this.ignorePropertyChange = false;
            }
        }

        protected getValueFromPropertyArray(propertyArray: PropertyArray): string {
            return this.getFileNamesFromProperty(propertyArray).
                join(FileUploaderEl.FILE_NAME_DELIMITER);
        }

        protected getFileNamesFromProperty(propertyArray: PropertyArray): string[] {
            return propertyArray.getProperties().map((property) => {
                if (property.hasNonNullValue()) {
                    return property.getString();
                }
            })
        }

        protected createUploaderWrapper(): DivEl {
            var wrapper = new DivEl("uploader-wrapper");

            var uploadButton = new Button();
            uploadButton.addClass('upload-button');

            uploadButton.onClicked((event: MouseEvent) => {
                this.uploaderEl.showFileSelectionDialog();
            });

            wrapper.appendChild(this.uploaderEl);
            wrapper.appendChild(uploadButton);

            return wrapper;
        }

        protected createUploader(property: Property): UploaderEl<any> {
            throw new Error("must be implemented in inheritors");
        }

        onFocus(listener: (event: FocusEvent) => void) {
            this.uploaderEl.onFocus(listener);
        }

        unFocus(listener: (event: FocusEvent) => void) {
            this.uploaderEl.unFocus(listener);
        }

        onBlur(listener: (event: FocusEvent) => void) {
            this.uploaderEl.onBlur(listener);
        }

        unBlur(listener: (event: FocusEvent) => void) {
            this.uploaderEl.unBlur(listener);
        }
    }
