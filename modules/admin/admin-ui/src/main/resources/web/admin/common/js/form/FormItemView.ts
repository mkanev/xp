import {PropertyPath} from "../data/PropertyPath";
import {Property} from "../data/Property";
import {Value} from "../data/Value";
import {ValueType} from "../data/ValueType";
import {ValueTypes} from "../data/ValueTypes";
import {PropertyTree} from "../data/PropertyTree";
import {PropertySet} from "../data/PropertySet";
import {DivEl} from "../dom/DivEl";
import {ContentSummary} from "../content/ContentSummary";
import {assertNotNull} from "../util/Assert";
import {FormContext} from "./FormContext";
import {FormItem} from "./FormItem";
import {FormItemSetOccurrenceView} from "./FormItemSetOccurrenceView";
import {Layout} from "./Layout";
import {RecordingValidityChangedEvent} from "./RecordingValidityChangedEvent";
import {ValidationRecording} from "./ValidationRecording";

export interface FormItemViewConfig {

        className: string;

        context: FormContext;

        formItem: FormItem;

        parent: FormItemSetOccurrenceView;

    }

    export class FormItemView extends DivEl {

        private context: FormContext;

        private formItem: FormItem;

        private parent: FormItemSetOccurrenceView;

        private editContentRequestListeners: {(content: ContentSummary): void}[] = [];

        private highlightOnValidityChanged: boolean;

        constructor(config: FormItemViewConfig) {
            super(config.className);
            assertNotNull(config.context, "context cannot be null");
            assertNotNull(config.formItem, "formItem cannot be null");
            this.context = config.context;
            this.formItem = config.formItem;
            this.parent = config.parent;
            this.highlightOnValidityChanged = false;
        }

        public setHighlightOnValidityChange(highlight: boolean) {
            this.highlightOnValidityChanged = highlight;
        }

        broadcastFormSizeChanged() {
            throw new Error("Must be implemented by inheritors");
        }

        layout(): wemQ.Promise<void> {
            throw new Error("Must be implemented by inheritors");
        }

        update(propertyArray: PropertySet, unchangedOnly?: boolean): wemQ.Promise<void> {
            throw new Error("Must be implemented by inheritors");
        }

        getContext(): FormContext {
            return this.context;
        }

        getFormItem(): FormItem {
            return this.formItem;
        }

        getParent(): FormItemSetOccurrenceView {
            return this.parent;
        }

        public displayValidationErrors(value: boolean) {
            throw new Error("Must be implemented by inheritor");
        }

        hasValidUserInput(): boolean {
            throw new Error("Must be implemented by inheritor");
        }

        validate(silent: boolean = true): ValidationRecording {

            // Default method to avoid having to implement method in Layout-s.
            return new ValidationRecording();
        }

        giveFocus(): boolean {
            return false;
        }

        highlightOnValidityChange(): boolean {
            return this.highlightOnValidityChanged;
        }

        onEditContentRequest(listener: (content: ContentSummary) => void) {
            this.editContentRequestListeners.push(listener);
        }

        unEditContentRequest(listener: (content: ContentSummary) => void) {
            this.editContentRequestListeners = this.editContentRequestListeners.filter(function (curr) {
                return curr != listener;
            });
        }

        notifyEditContentRequested(content: ContentSummary) {
            this.editContentRequestListeners.forEach((listener) => {
                listener(content);
            })
        }

        onValidityChanged(listener: (event: RecordingValidityChangedEvent)=>void) {
            //Should be implemented in child classes
        }

        unValidityChanged(listener: (event: RecordingValidityChangedEvent)=>void) {
            //Should be implemented in child classes
        }
    }
