import {Property} from "../../../data/Property";
import {Value} from "../../../data/Value";
import {ValueType} from "../../../data/ValueType";
import {ValueTypes} from "../../../data/ValueTypes";
import {BaseInputTypeSingleOccurrence} from "../support/BaseInputTypeSingleOccurrence";
import {LabelPosition} from "../../../ui/Checkbox";
import {Checkbox} from "../../../ui/Checkbox";
import {InputTypeViewContext} from "../InputTypeViewContext";
import {Input} from "../../Input";
import {ValueChangedEvent} from "../../../ValueChangedEvent";
import {InputValidationRecording} from "../InputValidationRecording";
import {InputTypeManager} from "../InputTypeManager";
import {Class} from "../../../Class";

export class Checkbox extends BaseInputTypeSingleOccurrence<boolean> {

        private checkbox: Checkbox;

        public static debug: boolean = false;

        constructor(config: InputTypeViewContext) {
            super(config);
        }

        getValueType(): ValueType {
            return ValueTypes.BOOLEAN;
        }

        newInitialValue(): Value {
            return ValueTypes.BOOLEAN.newBoolean(false);
        }

        layoutProperty(input: Input, property: Property): wemQ.Promise<void> {
            var checked = property.hasNonNullValue() ? property.getBoolean() : false;
            this.checkbox =
                Checkbox.create().setLabelText(input.getLabel()).setChecked(checked).setLabelPosition(LabelPosition.TOP).build();
            this.appendChild(this.checkbox);

            if (!ValueTypes.BOOLEAN.equals(property.getType())) {
                property.convertValueType(ValueTypes.BOOLEAN);
            }

            this.checkbox.onValueChanged((event: ValueChangedEvent) => {
                var newValue = ValueTypes.BOOLEAN.newValue(event.getNewValue());

                this.saveToProperty(newValue);
            });

            return wemQ<void>(null);
        }

        updateProperty(property: Property, unchangedOnly?: boolean): wemQ.Promise<void> {
            if (Checkbox.debug) {
                console.debug('Checkbox.updateProperty' + (unchangedOnly ? ' (unchanged only)' : ''), property);
            }
            if ((!unchangedOnly || !this.checkbox.isDirty()) && property.hasNonNullValue()) {
                this.checkbox.setChecked(property.getBoolean());
            }
            return wemQ<void>(null);
        }

        giveFocus(): boolean {
            return this.checkbox.giveFocus();
        }

        validate(silent: boolean = true): InputValidationRecording {

            return new InputValidationRecording();
        }

        onFocus(listener: (event: FocusEvent) => void) {
            this.checkbox.onFocus(listener);
        }

        unFocus(listener: (event: FocusEvent) => void) {
            this.checkbox.unFocus(listener);
        }

        onBlur(listener: (event: FocusEvent) => void) {
            this.checkbox.onBlur(listener);
        }

        unBlur(listener: (event: FocusEvent) => void) {
            this.checkbox.unBlur(listener);
        }
    }

    InputTypeManager.register(new Class("Checkbox", Checkbox));

