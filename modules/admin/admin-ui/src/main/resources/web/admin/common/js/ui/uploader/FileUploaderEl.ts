import {Button} from "../button/Button";
import {CloseButton} from "../button/CloseButton";
import {Element} from "../../dom/Element";
import {SelectionItem} from "../../app/browse/SelectionItem";
import {Equitable} from "../../Equitable";
import {UploaderEl} from "./UploaderEl";

export class FileUploaderEl<MODEL extends Equitable> extends UploaderEl<MODEL> {

        protected contentId: string;

        static FILE_NAME_DELIMITER = "/";

        doSetValue(value: string, silent?: boolean): UploaderEl<MODEL> {

            if (UploaderEl.debug) {
                console.log('Setting new uploader value', value, this);
            }
            var result = this.getItems(value);

            this.appendNewItems(result.newItems);
            this.refreshVisibility();

            return this;
        }

         resetValues(value: string) {

            var result = this.getItems(value);

            this.removeAllChildrenExceptGiven(result.existingItems);
            this.appendNewItems(result.newItems);

            this.refreshVisibility();
        }

        setContentId(contentId: string) {
            this.contentId = contentId;
        }

        protected initHandler() {
            if (this.config.disabled) {
                if (UploaderEl.debug) {
                    console.log('Skipping init, because of config.disabled = true', this);
                }
            } else {
                if (UploaderEl.debug) {
                    console.log('Initing uploader', this);
                }
                if (!this.uploader && this.config.url) {
                    this.uploader = this.initUploader();
                }
            }
        }

        private refreshVisibility() {
            if (this.config.showResult) {
                this.setResultVisible();
                this.getDefaultDropzoneContainer().setVisible(false);
                this.getDropzone().setVisible(false);
            } else {
                this.setDefaultDropzoneVisible();
            }
        }

        private getItems(value: string) : {existingItems:Element[], newItems:Element[]} {
            var newItems: Element[] = [],
                existingItems:Element[] = [];

            this.parseValues(value).forEach((parsedValue: string) => {
                if (parsedValue) {

                    var newValues = parsedValue.split(FileUploaderEl.FILE_NAME_DELIMITER);
                    newValues.forEach((curValue) => {

                        var existingItem = this.getExistingItem(curValue);
                        if (!existingItem) {
                            newItems.push(this.createResultItem(curValue));
                        } else {
                            existingItems.push(existingItem);
                        }
                    });
                }
            });

            return {existingItems, newItems};
        }

    }
