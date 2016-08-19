import {Property} from "../../../data/Property";
import {PropertyArray} from "../../../data/PropertyArray";
import {Value} from "../../../data/Value";
import {PropertyValueChangedEvent} from "../../../data/PropertyValueChangedEvent";
import {FormItemOccurrenceView} from "../../FormItemOccurrenceView";
import {Element} from "../../../dom/Element";
import {AEl} from "../../../dom/AEl";
import {DivEl} from "../../../dom/DivEl";
import {PropertyPath} from "../../../data/PropertyPath";
import {BaseInputTypeNotManagingAdd} from "./BaseInputTypeNotManagingAdd";
import {InputOccurrence} from "./InputOccurrence";

export class InputOccurrenceView extends FormItemOccurrenceView {

        private inputOccurrence: InputOccurrence;

        private property: Property;

        private inputTypeView: BaseInputTypeNotManagingAdd<any>;

        private inputElement: Element;

        private removeButtonEl: AEl;

        private dragControl: DivEl;

        private requiredContractBroken: boolean;

        private propertyValueChangedHandler: (event: PropertyValueChangedEvent) => void;

        public static debug: boolean = false;

        constructor(inputOccurrence: InputOccurrence, baseInputTypeView: BaseInputTypeNotManagingAdd<any>, property: Property) {
            super("input-occurrence-view", inputOccurrence);

            this.inputTypeView = baseInputTypeView;
            this.inputElement = this.inputTypeView.createInputOccurrenceElement(inputOccurrence.getIndex(), property);

            this.requiredContractBroken = this.inputTypeView.valueBreaksRequiredContract(property != null ? property.getValue() : null);

            var ignorePropertyChange = false;
            this.inputTypeView.onOccurrenceValueChanged((occurrence: Element, value: Value) => {
                // check if this is our occurrence because all views will receive occurrence value changed event
                if (this.inputElement == occurrence) {
                    if (InputOccurrenceView.debug) {
                        console.debug('InputOccurrenceView: onOccurrenceValueChanged ', occurrence, value);
                    }
                    ignorePropertyChange = true;
                    this.property.setValue(value);
                    this.inputTypeView.validate(false);
                    ignorePropertyChange = false;
                }
            });

            this.propertyValueChangedHandler = (event: PropertyValueChangedEvent) => {

                var newStateOfRequiredContractBroken = this.inputTypeView.valueBreaksRequiredContract(event.getNewValue());

                if (this.requiredContractBroken != newStateOfRequiredContractBroken) {
                    this.requiredContractBroken = newStateOfRequiredContractBroken;
                    this.inputTypeView.notifyRequiredContractBroken(newStateOfRequiredContractBroken, inputOccurrence.getIndex());
                }

                if (!ignorePropertyChange) {
                    if (InputOccurrenceView.debug) {
                        console.debug('InputOccurrenceView: propertyValueChanged', property);
                    }
                    this.inputTypeView.updateInputOccurrenceElement(this.inputElement, property, true);
                }
            };

            this.registerProperty(property);

            this.inputOccurrence = inputOccurrence;

            this.dragControl = new DivEl("drag-control");
            this.appendChild(this.dragControl);

            this.removeButtonEl = new AEl("remove-button");
            this.appendChild(this.removeButtonEl);
            this.removeButtonEl.onClicked((event: MouseEvent) => {
                this.notifyRemoveButtonClicked();
                event.stopPropagation();
                event.preventDefault();
                return false;
            });

            var inputWrapper = new DivEl("input-wrapper");
            this.appendChild(inputWrapper);

            inputWrapper.appendChild(this.inputElement);

            this.refresh();
        }

        update(propertyArray: PropertyArray, unchangedOnly?: boolean): wemQ.Promise<void> {
            var property = propertyArray.get(this.inputOccurrence.getIndex());

            this.registerProperty(property);

            this.inputTypeView.updateInputOccurrenceElement(this.inputElement, property, unchangedOnly);

            return wemQ<void>(null);
        }

        private registerProperty(property: Property) {
            if (this.property) {
                if (InputOccurrenceView.debug) {
                    console.debug('InputOccurrenceView.registerProperty: unregister old property', this.property);
                }
                this.property.unPropertyValueChanged(this.propertyValueChangedHandler);
            }
            if (property) {
                if (InputOccurrenceView.debug) {
                    console.debug('InputOccurrenceView.registerProperty: register new property', property);
                }
                property.onPropertyValueChanged(this.propertyValueChangedHandler);
            }
            this.property = property;
        }

        refresh() {

            if (this.inputOccurrence.oneAndOnly()) {
                this.addClass("single-occurrence").removeClass("multiple-occurrence");
            }
            else {
                this.addClass("multiple-occurrence").removeClass("single-occurrence");
            }

            this.removeButtonEl.setVisible(this.inputOccurrence.isRemoveButtonRequiredStrict());
        }

        getDataPath(): PropertyPath {

            return this.property.getPath();
        }

        getIndex(): number {
            return this.inputOccurrence.getIndex();
        }

        getInputElement(): Element {
            return this.inputElement;
        }

        hasValidUserInput(): boolean {
            return this.inputTypeView.hasInputElementValidUserInput(this.inputElement);
        }

        giveFocus(): boolean {
            return this.inputElement.giveFocus();
        }

        onFocus(listener: (event: FocusEvent) => void) {
            this.inputElement.onFocus(listener);
        }

        unFocus(listener: (event: FocusEvent) => void) {
            this.inputElement.unFocus(listener);
        }

        onBlur(listener: (event: FocusEvent) => void) {
            this.inputElement.onBlur(listener);
        }

        unBlur(listener: (event: FocusEvent) => void) {
            this.inputElement.unBlur(listener);
        }
    }
