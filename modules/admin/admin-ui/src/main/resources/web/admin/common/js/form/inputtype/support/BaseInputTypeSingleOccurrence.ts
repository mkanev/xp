import {Property} from "../../../data/Property";
import {PropertyArray} from "../../../data/PropertyArray";
import {Value} from "../../../data/Value";
import {ValueType} from "../../../data/ValueType";
import {DivEl} from "../../../dom/DivEl";
import {InputTypeView} from "../InputTypeView";
import {InputTypeViewContext} from "../InputTypeViewContext";
import {Input} from "../../Input";
import {PropertyValueChangedEvent} from "../../../data/PropertyValueChangedEvent";
import {InputValidityChangedEvent} from "../InputValidityChangedEvent";
import {InputValueChangedEvent} from "../InputValueChangedEvent";
import {assertNotNull} from "../../../util/Assert";
import {Element} from "../../../dom/Element";
import {ClassHelper} from "../../../ClassHelper";
import {InputValidationRecording} from "../InputValidationRecording";
import {ContentSummary} from "../../../content/ContentSummary";

export class BaseInputTypeSingleOccurrence<RAW_VALUE_TYPE> extends DivEl implements InputTypeView<RAW_VALUE_TYPE> {

        private context: InputTypeViewContext;

        protected input: Input;

        private property: Property;

        private propertyListener: (event: PropertyValueChangedEvent) => void;

        protected ignorePropertyChange: boolean;

        private inputValidityChangedListeners: {(event: InputValidityChangedEvent) : void}[] = [];

        private inputValueChangedListeners: {(event: InputValueChangedEvent): void}[] = [];

        constructor(ctx: InputTypeViewContext, className?: string) {
            super("input-type-view" + ( className ? " " + className : ""));
            assertNotNull(ctx, "CONTEXT cannot be null");
            this.context = ctx;

            this.propertyListener = (event: PropertyValueChangedEvent) => {
                if (!this.ignorePropertyChange) {
                    this.updateProperty(event.getProperty(), true).done();
                }
            };
        }

        availableSizeChanged() {

        }

        public getContext(): InputTypeViewContext {
            return this.context;
        }

        getElement(): Element {
            return this;
        }

        isManagingAdd(): boolean {
            return true;
        }

        layout(input: Input, propertyArray: PropertyArray): wemQ.Promise<void> {
            var property = propertyArray.get(0);
            this.registerProperty(property);

            this.layoutProperty(input, this.property);
            return wemQ<void>(null);
        }

        layoutProperty(input: Input, property: Property): wemQ.Promise<void> {

            throw new Error("Must be implemented by inheritor: " + ClassHelper.getClassName(this));
        }

        update(propertyArray: PropertyArray, unchangedOnly?: boolean): wemQ.Promise<void> {
            var property = propertyArray.get(0);
            this.registerProperty(property);

            return this.updateProperty(this.property, unchangedOnly);
        }

        updateProperty(property: Property, unchangedOnly?: boolean): wemQ.Promise<void> {
            throw new Error("Must be implemented by inheritor: " + ClassHelper.getClassName(this));
        }

        protected registerProperty(property: Property) {
            if (this.property) {
                this.property.unPropertyValueChanged(this.propertyListener);
            }
            if (property) {
                property.onPropertyValueChanged(this.propertyListener);
            }
            this.property = property;
        }

        protected saveToProperty(value: Value) {
            this.ignorePropertyChange = true;
            this.property.setValue(value);
            this.validate(false);
            this.ignorePropertyChange = false;
        }

        getProperty(): Property {
            return this.property;
        }

        getValueType(): ValueType {
            throw new Error("Must be implemented by inheritor: " + ClassHelper.getClassName(this));
        }

        newInitialValue(): Value {
            throw new Error("Must be implemented by inheritor: " + ClassHelper.getClassName(this));
        }

        /**
         * Override when needed.
         */
        displayValidationErrors(value: boolean) {

        }

        hasValidUserInput(): boolean {
            return true;
        }

        validate(silent: boolean = true): InputValidationRecording {

            throw new Error("Must be implemented by inheritor: " + ClassHelper.getClassName(this));
        }

        protected notifyValidityChanged(event: InputValidityChangedEvent) {
            this.inputValidityChangedListeners.forEach((listener: (event: InputValidityChangedEvent)=>void) => {
                listener(event);
            });
        }

        onValidityChanged(listener: (event: InputValidityChangedEvent)=>void) {
            this.inputValidityChangedListeners.push(listener);
        }

        unValidityChanged(listener: (event: InputValidityChangedEvent)=>void) {
            this.inputValidityChangedListeners.filter((currentListener: (event: InputValidityChangedEvent)=>void) => {
                return listener == currentListener;
            });
        }

        onValueChanged(listener: (event: InputValueChangedEvent) => void) {
            this.inputValueChangedListeners.push(listener);
        }

        unValueChanged(listener: (event: InputValueChangedEvent) => void) {
            this.inputValueChangedListeners = this.inputValueChangedListeners.filter((curr) => {
                return curr !== listener;
            })
        }

        protected notifyValueChanged(event: InputValueChangedEvent) {
            this.inputValueChangedListeners.forEach((listener: (event: InputValueChangedEvent)=>void) => {
                listener(event);
            });
        }

        onFocus(listener: (event: FocusEvent) => void) {
            throw new Error("Must be implemented by inheritor: " + ClassHelper.getClassName(this));
        }

        unFocus(listener: (event: FocusEvent) => void) {
            throw new Error("Must be implemented by inheritor: " + ClassHelper.getClassName(this));
        }

        onBlur(listener: (event: FocusEvent) => void) {
            throw new Error("Must be implemented by inheritor: " + ClassHelper.getClassName(this));
        }

        unBlur(listener: (event: FocusEvent) => void) {
            throw new Error("Must be implemented by inheritor: " + ClassHelper.getClassName(this));
        }

        onEditContentRequest(listener: (content: ContentSummary) => void) {
            // Adapter for InputTypeView method, to be implemented on demand in inheritors
        }

        unEditContentRequest(listener: (content: ContentSummary) => void) {
            // Adapter for InputTypeView method, to be implemented on demand in inheritors
        }
    }
