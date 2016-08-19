import {Property} from "../../../data/Property";
import {Value} from "../../../data/Value";
import {ValueType} from "../../../data/ValueType";
import {ValueTypes} from "../../../data/ValueTypes";
import {BaseInputTypeNotManagingAdd} from "../support/BaseInputTypeNotManagingAdd";
import {InputTypeViewContext} from "../InputTypeViewContext";
import {Element} from "../../../dom/Element";
import {TextInput} from "../../../ui/text/TextInput";
import {ValueChangedEvent} from "../../../ValueChangedEvent";
import {StringHelper} from "../../../util/StringHelper";
import {InputTypeName} from "../../InputTypeName";
import {InputTypeManager} from "../InputTypeManager";
import {Class} from "../../../Class";

export class TextLine extends BaseInputTypeNotManagingAdd<string> {

        private regexpStr: string;
        private regexp: RegExp;

        constructor(config: InputTypeViewContext) {
            super(config);
            this.readConfig(config.inputConfig);
        }

        private readConfig(inputConfig: { [element: string]: { [name: string]: string }[]; }): void {
            var regexpConfig = inputConfig['regexp'] && inputConfig['regexp'][0];
            var regexp = regexpConfig && regexpConfig['value'];
            this.regexpStr = regexp || null;
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

            var inputEl = TextInput.middle(undefined, property.getString());
            inputEl.setName(this.getInput().getName() + "-" + index);

            inputEl.onValueChanged((event: ValueChangedEvent) => {
                var isValid = this.isValid(event.getNewValue(), inputEl);
                if (isValid) {
                    var value = ValueTypes.STRING.newValue(event.getNewValue());
                    this.notifyOccurrenceValueChanged(inputEl, value);
                }
                inputEl.updateValidationStatusOnUserInput(isValid);
            });
            return inputEl;
        }


        updateInputOccurrenceElement(occurrence: Element, property: Property, unchangedOnly: boolean) {
            var input = <TextInput> occurrence;

            if (!unchangedOnly || !input.isDirty()) {
                input.setValue(property.getString());
            }
        }

        availableSizeChanged() {
        }

        private newValue(s: string): Value {
            return new Value(s, ValueTypes.STRING);
        }

        valueBreaksRequiredContract(value: Value): boolean {
            return value.isNull() || !value.getType().equals(ValueTypes.STRING) ||
                   StringHelper.isBlank(value.getString());
        }

        hasInputElementValidUserInput(inputElement: Element) {
            var textInput = <TextInput>inputElement;
            return this.isValid(textInput.getValue(), textInput, true);
        }

        private isValid(value: string, textInput: TextInput, silent: boolean = false): boolean {
            var parent = textInput.getParentElement();
            if (!this.regexpStr || StringHelper.isEmpty(value)) {
                parent.removeClass('valid-regexp').removeClass('invalid-regexp');
                return true;
            }
            if (!this.regexp) {
                this.regexp = new RegExp(this.regexpStr);
            }
            var valid = this.regexp.test(value);
            if (!silent) {
                parent.toggleClass('valid-regexp', valid);
                parent.toggleClass('invalid-regexp', !valid);
            }
            return valid;
        }

        static getName(): InputTypeName {
            return new InputTypeName("TextLine", false);
        }

    }

    InputTypeManager.register(new Class(TextLine.getName().getName(), TextLine));
