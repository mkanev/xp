import {Property} from "../../../data/Property";
import {Value} from "../../../data/Value";
import {ValueType} from "../../../data/ValueType";
import {ValueTypes} from "../../../data/ValueTypes";
import {BaseInputTypeNotManagingAdd} from "../support/BaseInputTypeNotManagingAdd";
import {ValueChangedEvent} from "../../../ValueChangedEvent";
import {InputTypeViewContext} from "../InputTypeViewContext";
import {Element} from "../../../dom/Element";
import {TextAreaInput} from "../../../ui/text/TextAreaInput";
import {StringHelper} from "../../../util/StringHelper";
import {InputTypeName} from "../../InputTypeName";
import {InputTypeManager} from "../InputTypeManager";
import {Class} from "../../../Class";

export class TextArea extends BaseInputTypeNotManagingAdd<string> {

        constructor(config: InputTypeViewContext) {
            super(config);
        }

        getValueType(): ValueType {
            return ValueTypes.STRING;
        }

        newInitialValue(): Value {
            return super.newInitialValue() || new Value("", ValueTypes.STRING);
        }

        createInputOccurrenceElement(index: number, property: Property): Element {
            if (!ValueTypes.STRING.equals(property.getType())) {
                property.convertValueType(ValueTypes.STRING);
            }

            var value = property.hasNonNullValue() ? property.getString() : undefined;
            var inputEl = new TextAreaInput(this.getInput().getName() + "-" + index, value);

            inputEl.onValueChanged((event: ValueChangedEvent) => {
                var value = ValueTypes.STRING.newValue(event.getNewValue());
                this.notifyOccurrenceValueChanged(inputEl, value);
            });

            return inputEl;
        }

        updateInputOccurrenceElement(occurrence: Element, property: Property, unchangedOnly: boolean) {
            var input = <TextAreaInput> occurrence;

            if (!unchangedOnly || !input.isDirty()) {
                input.setValue(property.getString());
            }
        }

        private newValue(s: string): Value {
            return new Value(s, ValueTypes.STRING);
        }

        valueBreaksRequiredContract(value: Value): boolean {
            return value.isNull() || !value.getType().equals(ValueTypes.STRING) ||
                   StringHelper.isBlank(value.getString());
        }

        hasInputElementValidUserInput(inputElement: Element) {

            // TODO
            return true;
        }

        static getName(): InputTypeName {
            return new InputTypeName("TextArea", false);
        }
    }

    InputTypeManager.register(new Class(TextArea.getName().getName(), TextArea));
