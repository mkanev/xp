import {Property} from "../../../data/Property";
import {PropertyArray} from "../../../data/PropertyArray";
import {Value} from "../../../data/Value";
import {ValueType} from "../../../data/ValueType";
import {DivEl} from "../../../dom/DivEl";
import {InputTypeView} from "../InputTypeView";
import {InputTypeViewContext} from "../InputTypeViewContext";
import {Input} from "../../Input";
import {InputValidityChangedEvent} from "../InputValidityChangedEvent";
import {Element} from "../../../dom/Element";
import {InputValidationRecording} from "../InputValidationRecording";
import {assertNotNull} from "../../../util/Assert";
import {OccurrenceAddedEvent} from "../../OccurrenceAddedEvent";
import {OccurrenceRenderedEvent} from "../../OccurrenceRenderedEvent";
import {OccurrenceRemovedEvent} from "../../OccurrenceRemovedEvent";
import {InputValueChangedEvent} from "../InputValueChangedEvent";
import {ElementAddedEvent} from "../../../dom/ElementAddedEvent";
import {AdditionalValidationRecord} from "../../AdditionalValidationRecord";
import {ClassHelper} from "../../../ClassHelper";
import {ContentSummary} from "../../../content/ContentSummary";
import {InputOccurrences} from "./InputOccurrences";
import {InputOccurrenceView} from "./InputOccurrenceView";

export class BaseInputTypeNotManagingAdd<RAW_VALUE_TYPE> extends DivEl implements InputTypeView<RAW_VALUE_TYPE> {

        private context: InputTypeViewContext;

        private input: Input;

        private propertyArray: PropertyArray;

        private inputOccurrences: InputOccurrences;

        private inputValidityChangedListeners: {(event: InputValidityChangedEvent) : void}[] = [];

        private inputValueChangedListeners: {(occurrence: Element, value: Value): void}[] = [];

        private previousValidationRecording: InputValidationRecording;

        /**
         * The index of child Data being dragged.
         */
        private draggingIndex: number;

        protected ignorePropertyChange: boolean;

        public static debug: boolean = false;

        constructor(context: InputTypeViewContext, className?: string) {
            super("input-type-view" + ( className ? " " + className : ""));
            assertNotNull(context, "context cannot be null");
            this.context = context;

            wemjq(this.getHTMLElement()).sortable({
                axis: "y",
                containment: 'parent',
                handle: '.drag-control',
                tolerance: 'pointer',
                start: (event: Event, ui: JQueryUI.SortableUIParams) => this.handleDnDStart(event, ui),
                stop: (event: Event, ui: JQueryUI.SortableUIParams) => this.handleDnDStop(event, ui),
                update: (event: Event, ui: JQueryUI.SortableUIParams) => this.handleDnDUpdate(event, ui)
            });
        }

        handleDnDStart(event: Event, ui: JQueryUI.SortableUIParams): void {

            var draggedElement = Element.fromHtmlElement(<HTMLElement>ui.item.context);
            this.draggingIndex = draggedElement.getSiblingIndex();

            ui.placeholder.html("Drop form item set here");
        }

        handleDnDStop(event: Event, ui: JQueryUI.SortableUIParams): void {
            //override in child classes if needed
        }

        handleDnDUpdate(event: Event, ui: JQueryUI.SortableUIParams) {

            if (this.draggingIndex >= 0) {
                var draggedElement = Element.fromHtmlElement(<HTMLElement>ui.item.context);
                var draggedToIndex = draggedElement.getSiblingIndex();
                this.inputOccurrences.moveOccurrence(this.draggingIndex, draggedToIndex);
            }

            this.draggingIndex = -1;
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
            return false;
        }

        onOccurrenceAdded(listener: (event: OccurrenceAddedEvent)=>void) {
            this.inputOccurrences.onOccurrenceAdded(listener);
        }

        onOccurrenceRendered(listener: (event: OccurrenceRenderedEvent) => void) {
            this.inputOccurrences.onOccurrenceRendered(listener);
        }

        onOccurrenceRemoved(listener: (event: OccurrenceRemovedEvent)=>void) {
            this.inputOccurrences.onOccurrenceRemoved(listener);
        }

        unOccurrenceAdded(listener: (event: OccurrenceAddedEvent)=>void) {
            this.inputOccurrences.unOccurrenceAdded(listener);
        }

        unOccurrenceRendered(listener: (event: OccurrenceRenderedEvent) => void) {
            this.inputOccurrences.onOccurrenceRendered(listener);
        }

        unOccurrenceRemoved(listener: (event: OccurrenceRemovedEvent)=>void) {
            this.inputOccurrences.unOccurrenceRemoved(listener);
        }

        onOccurrenceValueChanged(listener: (occurrence: Element, value: Value) => void) {
            this.inputValueChangedListeners.push(listener);
        }

        unOccurrenceValueChanged(listener: (occurrence: Element, value: Value) => void) {
            this.inputValueChangedListeners = this.inputValueChangedListeners.filter((curr) => {
                return curr !== listener;
            })
        }

        protected notifyOccurrenceValueChanged(occurrence: Element, value: Value) {
            this.inputValueChangedListeners.forEach((listener: (occurrence: Element, value: Value)=>void) => {
                listener(occurrence, value);
            });
        }

        onValueChanged(listener: (event: InputValueChangedEvent) => void) {
            throw new Error("User onOccurrenceValueChanged instead");
        }

        unValueChanged(listener: (event: InputValueChangedEvent) => void) {
            throw new Error("User onOccurrenceValueChanged instead");
        }

        onValidityChanged(listener: (event: InputValidityChangedEvent)=>void) {
            this.inputValidityChangedListeners.push(listener);
        }

        unValidityChanged(listener: (event: InputValidityChangedEvent)=>void) {
            this.inputValidityChangedListeners.filter((currentListener: (event: InputValidityChangedEvent)=>void) => {
                return listener == currentListener;
            });
        }

        private notifyValidityChanged(event: InputValidityChangedEvent) {
            this.inputValidityChangedListeners.forEach((listener: (event: InputValidityChangedEvent)=>void) => {
                listener(event);
            });
        }

        public maximumOccurrencesReached(): boolean {
            return this.inputOccurrences.maximumOccurrencesReached();
        }

        createAndAddOccurrence() {
            this.inputOccurrences.createAndAddOccurrence();
        }

        layout(input: Input, propertyArray: PropertyArray): wemQ.Promise<void> {

            this.input = input;
            this.propertyArray = propertyArray;
            this.inputOccurrences = InputOccurrences.create().
                setBaseInputTypeView(this).
                setInput(this.input).
                setPropertyArray(propertyArray).
                build();

            this.onAdded((event: ElementAddedEvent) => {
                this.onOccurrenceAdded(() => {
                    wemjq(this.getHTMLElement()).sortable("refresh");
                });
            });

            return this.inputOccurrences.layout().then(() => {
                wemjq(this.getHTMLElement()).sortable("refresh");
            });
        }

        update(propertyArray: PropertyArray, unchangedOnly?: boolean): Q.Promise<void> {
            this.propertyArray = propertyArray;

            return this.inputOccurrences.update(propertyArray, unchangedOnly);
        }

        hasValidUserInput(): boolean {
            return this.inputOccurrences.hasValidUserInput();
        }

        hasInputElementValidUserInput(inputElement: Element): boolean {
            throw new Error("Must be implemented by inheritor");
        }


        onFocus(listener: (event: FocusEvent) => void) {
            this.inputOccurrences.onFocus(listener);
        }

        unFocus(listener: (event: FocusEvent) => void) {
            this.inputOccurrences.unFocus(listener);
        }

        onBlur(listener: (event: FocusEvent) => void) {
            this.inputOccurrences.onBlur(listener);
        }

        unBlur(listener: (event: FocusEvent) => void) {
            this.inputOccurrences.unBlur(listener);
        }

        /**
         * Override when needed.
         */
        displayValidationErrors(value: boolean) {

        }

        validate(silent: boolean = true): InputValidationRecording {

            var recording = this.validateOccurrences();

            if (!this.hasValidUserInput()) {
                recording.setAdditionalValidationRecord(AdditionalValidationRecord.create().
                    setOverwriteDefault(true).
                    setMessage("Incorrect value entered").
                    build());
            }

            if (!silent && recording.validityChanged(this.previousValidationRecording)) {
                this.notifyValidityChanged(new InputValidityChangedEvent(recording, this.input.getName()));
            }

            this.previousValidationRecording = recording;
            return recording;
        }


        private validateOccurrences(): InputValidationRecording {
            var recording = new InputValidationRecording();
            var numberOfValids = 0;
            this.inputOccurrences.getOccurrenceViews().forEach((occurrenceView: InputOccurrenceView) => {

                var valueFromPropertyArray = this.propertyArray.getValue(occurrenceView.getIndex());
                if (valueFromPropertyArray) {
                    var breaksRequiredContract = this.valueBreaksRequiredContract(valueFromPropertyArray);
                    if (!breaksRequiredContract) {
                        numberOfValids++;
                    }
                }
            });

            if (numberOfValids < this.input.getOccurrences().getMinimum()) {
                recording.setBreaksMinimumOccurrences(true);
            }
            if (this.input.getOccurrences().maximumBreached(numberOfValids)) {
                recording.setBreaksMaximumOccurrences(true);
            }

            return recording;
        }

        protected getPropertyValue(property: Property): string {
            return property.hasNonNullValue() ? property.getString() : "";
        }

        notifyRequiredContractBroken(state: boolean, index: number) {

            this.validate(false);
        }

        getInput(): Input {
            return this.input;
        }

        valueBreaksRequiredContract(value: Value): boolean {
            throw new Error("Must be implemented by inheritor: " + ClassHelper.getClassName(this));
        }

        createInputOccurrenceElement(index: number, property: Property): Element {
            throw new Error("Must be implemented by inheritor: " + ClassHelper.getClassName(this));
        }

        updateInputOccurrenceElement(occurrence: Element, property: Property, unchangedOnly?: boolean) {
            throw new Error("Must be implemented by inheritor: " + ClassHelper.getClassName(this));
        }

        getValueType(): ValueType {
            throw new Error("Must be implemented by inheritor: " + ClassHelper.getClassName(this));
        }

        newInitialValue(): Value {
            return this.input ? this.input.getDefaultValue() : null;
        }

        giveFocus(): boolean {
            if (this.inputOccurrences) {
                return this.inputOccurrences.giveFocus();
            }
            return false;
        }

        onEditContentRequest(listener: (content: ContentSummary) => void) {
            // Adapter for InputTypeView method, to be implemented on demand in inheritors
        }

        unEditContentRequest(listener: (content: ContentSummary) => void) {
            // Adapter for InputTypeView method, to be implemented on demand in inheritors
        }
    }
