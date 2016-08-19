import {BaseInputTypeNotManagingAdd} from "../support/BaseInputTypeNotManagingAdd";
import {Property} from "../../../data/Property";
import {Value} from "../../../data/Value";
import {ValueType} from "../../../data/ValueType";
import {ValueTypes} from "../../../data/ValueTypes";
import {InputTypeViewContext} from "../InputTypeViewContext";
import {Element} from "../../../dom/Element";
import {TextInput} from "../../../ui/text/TextInput";
import {ValueChangedEvent} from "../../../ValueChangedEvent";
import {PropertyValueChangedEvent} from "../../../data/PropertyValueChangedEvent";
import {StringHelper} from "../../../util/StringHelper";
import {NumberHelper} from "../../../util/NumberHelper";
import {InputTypeManager} from "../InputTypeManager";
import {Class} from "../../../Class";

export class Long extends BaseInputTypeNotManagingAdd<number> {

        constructor(config: InputTypeViewContext) {
            super(config);
        }

        getValueType(): ValueType {
            return ValueTypes.LONG;
        }

        newInitialValue(): Value {
            return super.newInitialValue() || ValueTypes.LONG.newNullValue();
        }

        createInputOccurrenceElement(index: number, property: Property): Element {
            if (!ValueTypes.LONG.equals(property.getType())) {
                property.convertValueType(ValueTypes.LONG);
            }

            var inputEl = TextInput.middle(undefined, this.getPropertyValue(property));
            inputEl.setName(this.getInput().getName() + "-" + property.getIndex());

            inputEl.onValueChanged((event: ValueChangedEvent) => {

                var isValid = this.isValid(event.getNewValue()),
                    value = isValid ? ValueTypes.LONG.newValue(event.getNewValue()) : this.newInitialValue();

                this.notifyOccurrenceValueChanged(inputEl, value);
                inputEl.updateValidationStatusOnUserInput(isValid);
            });

            property.onPropertyValueChanged((event: PropertyValueChangedEvent) => {
                this.updateInputOccurrenceElement(inputEl, property, true);
            });

            return inputEl;
        }

        updateInputOccurrenceElement(occurrence: Element, property: Property, unchangedOnly: boolean) {
            var input = <TextInput> occurrence;

            if (!unchangedOnly || !input.isDirty()) {
                input.setValue(this.getPropertyValue(property));
            }
        }

        availableSizeChanged() {
        }

        valueBreaksRequiredContract(value: Value): boolean {
            return value.isNull() || !value.getType().equals(ValueTypes.LONG);
        }

        hasInputElementValidUserInput(inputElement: Element) {
            var value = <TextInput>inputElement;

            return this.isValid(value.getValue());
        }

        private isValid(value: string): boolean {
            var validUserInput = true;

            if (StringHelper.isEmpty(value)) {
                validUserInput = true;
            } else {

                if (NumberHelper.isWholeNumber(+value)) {
                    validUserInput = true;
                } else {
                    validUserInput = false;
                }
            }

            return validUserInput;
        }

    }

    InputTypeManager.register(new Class("Long", Long));
