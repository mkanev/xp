import {Option} from "../../../ui/selector/Option";
import {ComboBox} from "../../../ui/selector/combobox/ComboBox";
import {SelectedOptionsView} from "../../../ui/selector/combobox/SelectedOptionsView";
import {Property} from "../../../data/Property";
import {Value} from "../../../data/Value";
import {ValueType} from "../../../data/ValueType";
import {ValueTypes} from "../../../data/ValueTypes";
import {BaseSelectedOptionsView} from "../../../ui/selector/combobox/BaseSelectedOptionsView";
import {BaseInputTypeSingleOccurrence} from "../support/BaseInputTypeSingleOccurrence";
import {RadioGroup} from "../../../ui/RadioGroup";
import {InputValidationRecording} from "../InputValidationRecording";
import {InputTypeViewContext} from "../InputTypeViewContext";
import {Input} from "../../Input";
import {InputValidityChangedEvent} from "../InputValidityChangedEvent";
import {ValueChangedEvent} from "../../../ValueChangedEvent";
import {InputTypeManager} from "../InputTypeManager";
import {Class} from "../../../Class";

export class RadioButton extends BaseInputTypeSingleOccurrence<string> {

        private selector: RadioGroup;
        private previousValidationRecording: InputValidationRecording;
        private radioButtonOptions: {label: string; value: string;}[];

        constructor(config: InputTypeViewContext) {
            super(config, "radio-button");
            this.readConfig(config.inputConfig);
        }

        private readConfig(inputConfig: { [element: string]: { [name: string]: string }[]; }): void {
            var options: {label: string; value: string;}[] = [];

            var optionValues = inputConfig['option'] || [];
            var l = optionValues.length, optionValue;
            for (var i = 0; i < l; i++) {
                optionValue = optionValues[i];
                options.push({label: optionValue['value'], value: optionValue['@value']});
            }
            this.radioButtonOptions = options;
        }

        getValueType(): ValueType {
            return ValueTypes.STRING;
        }

        newInitialValue(): Value {
            return ValueTypes.STRING.newNullValue();
        }

        layoutProperty(input: Input, property: Property): wemQ.Promise<void> {

            this.input = input;

            this.selector = this.createRadioElement(input.getName(), property);

            this.appendChild(this.selector);

            if (!ValueTypes.STRING.equals(property.getType())) {
                property.convertValueType(ValueTypes.STRING);
                if (!this.isValidOption(property.getString())) {
                    property.setValue(ValueTypes.STRING.newNullValue());
                }
            }

            return wemQ<void>(null);
        }

        updateProperty(property: Property, unchangedOnly: boolean): Q.Promise<void> {
            if ((!unchangedOnly || !this.selector.isDirty())) {
                this.selector.setValue(property.hasNonNullValue() ? property.getString() : "");
            }
            return wemQ<any>(null);
        }

        giveFocus(): boolean {
            return this.selector.giveFocus();
        }

        validate(silent: boolean = true): InputValidationRecording {
            var recording = new InputValidationRecording();
            var propertyValue = this.getProperty().getValue();
            if (propertyValue.isNull() && this.input.getOccurrences().getMinimum() > 0) {
                recording.setBreaksMinimumOccurrences(true);
            }
            if (!silent) {
                if (recording.validityChanged(this.previousValidationRecording)) {
                    this.notifyValidityChanged(new InputValidityChangedEvent(recording, this.input.getName()));
                }
            }
            this.previousValidationRecording = recording;
            return recording;
        }

        onFocus(listener: (event: FocusEvent) => void) {
            this.selector.onFocus(listener);
        }

        unFocus(listener: (event: FocusEvent) => void) {
            this.selector.unFocus(listener);
        }

        onBlur(listener: (event: FocusEvent) => void) {
            this.selector.onBlur(listener);
        }

        unBlur(listener: (event: FocusEvent) => void) {
            this.selector.unBlur(listener);
        }

        private createRadioElement(name: string, property: Property): RadioGroup {

            var value = property.hasNonNullValue ? property.getString() : undefined;
            var radioGroup = new RadioGroup(name, value);

            var options = this.radioButtonOptions;
            var l = options.length;
            for (var i = 0; i < l; i++) {
                var option = options[i];
                radioGroup.addOption(option.value, option.label);
            }

            radioGroup.onValueChanged((event: ValueChangedEvent)=> {
                this.saveToProperty(ValueTypes.STRING.newValue(event.getNewValue()));
            });


            return radioGroup;
        }

        private newValue(s: string): Value {
            return new Value(s, ValueTypes.STRING);
        }

        private isValidOption(value: string): boolean {
            var options = this.radioButtonOptions;
            var l = options.length;
            for (let i = 0; i < l; i++) {
                let option = options[i];
                if (option.value === value) {
                    return true;
                }
            }
            return false;
        }
    }

    InputTypeManager.register(new Class("RadioButton", RadioButton));
