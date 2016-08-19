import {Property} from "../../../data/Property";
import {PropertyArray} from "../../../data/PropertyArray";
import {Value} from "../../../data/Value";
import {ValueType} from "../../../data/ValueType";
import {ValueTypes} from "../../../data/ValueTypes";
import {InputTypeViewContext} from "../InputTypeViewContext";
import {Input} from "../../Input";
import {DivEl} from "../../../dom/DivEl";
import {Element} from "../../../dom/Element";
import {TextInput} from "../../../ui/text/TextInput";
import {ValueChangedEvent} from "../../../ValueChangedEvent";
import {StringHelper} from "../../../util/StringHelper";
import {InputTypeManager} from "../InputTypeManager";
import {Class} from "../../../Class";
import {BaseInputTypeNotManagingAdd} from "./BaseInputTypeNotManagingAdd";

export class NoInputTypeFoundView extends BaseInputTypeNotManagingAdd<string> {

        constructor(context: InputTypeViewContext) {
            super(context);
        }

        getValueType(): ValueType {
            return ValueTypes.STRING;
        }

        newInitialValue(): Value {
            return super.newInitialValue() || ValueTypes.STRING.newValue("");
        }

        layout(input: Input, property?: PropertyArray): wemQ.Promise<void> {

            var divEl = new DivEl();
            divEl.getEl().setInnerHtml("Warning: no input type found: " + input.getInputType().toString());

            return super.layout(input, property);
        }

        createInputOccurrenceElement(index: number, property: Property): Element {

            var inputEl = TextInput.middle();
            inputEl.setName(this.getInput().getName());
            if (property != null) {
                inputEl.setValue(property.getString());
            }
            inputEl.onValueChanged((event: ValueChangedEvent) => {
                var value = ValueTypes.STRING.newValue(event.getNewValue());
                this.notifyOccurrenceValueChanged(inputEl, value);
            });

            return inputEl;
        }

        updateInputOccurrenceElement(occurrence: Element, property: Property, unchangedOnly: boolean) {
            var input = <TextInput> occurrence;

            if (!unchangedOnly || !input.isDirty()) {
                input.setValue(property.getString());
            }
        }

        valueBreaksRequiredContract(value: Value): boolean {
            return value.isNull() || !value.getType().equals(ValueTypes.STRING) ||
                   StringHelper.isBlank(value.getString());
        }

        hasInputElementValidUserInput(inputElement: Element) {

            // TODO
            return true;
        }
    }

    InputTypeManager.register(new Class("NoInputTypeFound", NoInputTypeFoundView));
