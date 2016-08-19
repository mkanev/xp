import {Property} from "../../../data/Property";
import {Value} from "../../../data/Value";
import {ValueType} from "../../../data/ValueType";
import {ValueTypes} from "../../../data/ValueTypes";
import {BaseInputTypeNotManagingAdd} from "../support/BaseInputTypeNotManagingAdd";
import {ValueTypeLocalTime} from "../../../data/ValueTypeLocalTime";
import {LocalTime} from "../../../util/LocalTime";
import {InputTypeViewContext} from "../InputTypeViewContext";
import {Element} from "../../../dom/Element";
import {TimePickerBuilder} from "../../../ui/time/TimePicker";
import {TimePicker} from "../../../ui/time/TimePicker";
import {InputTypeManager} from "../InputTypeManager";
import {Class} from "../../../Class";

/**
     * Uses [[ValueType]] [[ValueTypeLocalTime]].
     */
    export class Time extends BaseInputTypeNotManagingAdd<LocalTime> {

        constructor(config: InputTypeViewContext) {
            super(config);
        }

        getValueType(): ValueType {
            return ValueTypes.LOCAL_TIME;
        }

        newInitialValue(): Value {
            return super.newInitialValue() || ValueTypes.LOCAL_TIME.newNullValue();
        }

        createInputOccurrenceElement(index: number, property: Property): Element {
            if (!ValueTypes.LOCAL_TIME.equals(property.getType())) {
                property.convertValueType(ValueTypes.LOCAL_TIME);
            }

            var value = this.getValueFromProperty(property);
            var timePicker = new TimePickerBuilder().setHours(value.hours).setMinutes(value.minutes).build();

            timePicker.onSelectedTimeChanged((hours: number, minutes: number) => {
                var valueStr = hours + ':' + minutes;
                var value = new Value(LocalTime.isValidString(valueStr) ? LocalTime.fromString(valueStr) : null,
                    ValueTypes.LOCAL_TIME);
                this.notifyOccurrenceValueChanged(timePicker, value);
            });

            return timePicker;
        }

        updateInputOccurrenceElement(occurrence: Element, property: Property, unchangedOnly: boolean) {
            var localTime = <TimePicker> occurrence;

            if (!unchangedOnly || !localTime.isDirty() || !localTime.isValid()) {

                var value = this.getValueFromProperty(property);
                localTime.setSelectedTime(value.hours, value.minutes);
            }
        }

        private getValueFromProperty(property: Property): {hours: number; minutes: number} {
            var hours = -1,
                minutes = -1;
            if (property && property.hasNonNullValue()) {
                var localTime: LocalTime = property.getLocalTime();
                if (localTime) {
                    var adjustedTime = localTime.getAdjustedTime();
                    hours = adjustedTime.hour;
                    minutes = adjustedTime.minute;
                }
            }
            return {
                hours: hours,
                minutes: minutes
            }
        }

        availableSizeChanged() {
        }

        valueBreaksRequiredContract(value: Value): boolean {
            return value.isNull() || !value.getType().equals(ValueTypes.LOCAL_TIME);
        }

        hasInputElementValidUserInput(inputElement: Element) {
            var timePicker = <TimePicker> inputElement;
            return timePicker.isValid();
        }

    }
    InputTypeManager.register(new Class("Time", Time));

