import {BaseInputTypeNotManagingAdd} from "../support/BaseInputTypeNotManagingAdd";
import {Property} from "../../../data/Property";
import {Value} from "../../../data/Value";
import {ValueType} from "../../../data/ValueType";
import {ValueTypes} from "../../../data/ValueTypes";
import {InputTypeViewContext} from "../InputTypeViewContext";
import {Element} from "../../../dom/Element";
import {TextInput} from "../../../ui/text/TextInput";
import {ValueChangedEvent} from "../../../ValueChangedEvent";
import {StringHelper} from "../../../util/StringHelper";
import {NumberHelper} from "../../../util/NumberHelper";
import {InputTypeManager} from "../InputTypeManager";
import {Class} from "../../../Class";

export class Double extends BaseInputTypeNotManagingAdd<number> {

        constructor(config: InputTypeViewContext) {
            super(config);
        }

        getValueType(): ValueType {
            return ValueTypes.DOUBLE;
        }

        newInitialValue(): Value {
            return super.newInitialValue() || ValueTypes.DOUBLE.newNullValue();
        }

        createInputOccurrenceElement(index: number, property: Property): Element {
            if (!ValueTypes.DOUBLE.equals(property.getType())) {
                property.convertValueType(ValueTypes.DOUBLE);
            }

            var inputEl = TextInput.middle(undefined, this.getPropertyValue(property));
            inputEl.setName(this.getInput().getName() + "-" + property.getIndex());

            inputEl.onValueChanged((event: ValueChangedEvent) => {
                var isValid = this.isValid(event.getNewValue()),
                    value = isValid ? ValueTypes.DOUBLE.newValue(event.getNewValue()) : this.newInitialValue();

                this.notifyOccurrenceValueChanged(inputEl, value);
                inputEl.updateValidationStatusOnUserInput(isValid);
            });

            return inputEl;
        }

        updateInputOccurrenceElement(occurrence: Element, property: Property, unchangedOnly?: boolean) {
            var input = <TextInput> occurrence;

            if (!unchangedOnly || !input.isDirty()) {
                input.setValue(this.getPropertyValue(property));
            }
        }

        availableSizeChanged() {
        }

        valueBreaksRequiredContract(value: Value): boolean {
            return value.isNull() || !value.getType().equals(ValueTypes.DOUBLE);
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

                if (NumberHelper.isNumber(+value)) {
                    validUserInput = true;
                } else {
                    validUserInput = false;
                }
            }

            return validUserInput;
        }

    }

    InputTypeManager.register(new Class("Double", Double));
