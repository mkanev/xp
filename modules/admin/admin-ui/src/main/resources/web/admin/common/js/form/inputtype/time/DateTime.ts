import {Property} from "../../../data/Property";
import {Value} from "../../../data/Value";
import {ValueType} from "../../../data/ValueType";
import {ValueTypes} from "../../../data/ValueTypes";
import {Timezone} from "../../../util/Timezone";
import {DateTimePicker} from "../../../ui/time/DateTimePicker";
import {DateTimePickerBuilder} from "../../../ui/time/DateTimePicker";
import {BaseInputTypeNotManagingAdd} from "../support/BaseInputTypeNotManagingAdd";
import {ValueTypeLocalDateTime} from "../../../data/ValueTypeLocalDateTime";
import {InputTypeViewContext} from "../InputTypeViewContext";
import {Element} from "../../../dom/Element";
import {SelectedDateChangedEvent} from "../../../ui/time/SelectedDateChangedEvent";
import {LocalDateTime} from "../../../util/LocalDateTime";
import {DateTime} from "../../../util/DateTime";
import {InputTypeManager} from "../InputTypeManager";
import {Class} from "../../../Class";
import {Date} from "./Date";

/**
     * Uses [[ValueType]] [[ValueTypeLocalDateTime]].
     */
    export class DateTime extends BaseInputTypeNotManagingAdd<Date> {

        private withTimezone: boolean = false;
        private valueType: ValueType = ValueTypes.LOCAL_DATE_TIME;

        constructor(config: InputTypeViewContext) {
            super(config);
            this.readConfig(config.inputConfig);
        }

        private readConfig(inputConfig: { [element: string]: { [name: string]: string }[]; }): void {
            var timeZoneConfig = inputConfig['timezone'] && inputConfig['timezone'][0];
            var timeZone = timeZoneConfig && timeZoneConfig['value'];

            if (timeZone === "true") {
                this.withTimezone = true;
                this.valueType = ValueTypes.DATE_TIME;
            }
        }

        getValueType(): ValueType {
            return this.valueType;
        }

        newInitialValue(): Value {
            return super.newInitialValue() || this.valueType.newNullValue();
        }

        createInputOccurrenceElement(index: number, property: Property): Element {
            if (this.valueType == ValueTypes.DATE_TIME) {
                return this.createInputAsDateTime(property);
            } else {
                return this.createInputAsLocalDateTime(property);
            }
        }


        updateInputOccurrenceElement(occurrence: Element, property: Property, unchangedOnly: boolean) {
            var dateTimePicker = <DateTimePicker> occurrence;

            if (!unchangedOnly || !dateTimePicker.isDirty()) {

                var date = property.hasNonNullValue()
                    ? this.valueType == ValueTypes.DATE_TIME
                               ? property.getDateTime().toDate()
                               : property.getLocalDateTime().toDate()
                    : null;
                dateTimePicker.setSelectedDateTime(date);
            }
        }

        hasInputElementValidUserInput(inputElement: Element) {
            var dateTimePicker = <DateTimePicker>inputElement;
            return dateTimePicker.isValid();
        }

        availableSizeChanged() {
            // Nothing
        }

        valueBreaksRequiredContract(value: Value): boolean {
            return value.isNull() || !(value.getType().equals(ValueTypes.LOCAL_DATE_TIME) || value.getType().equals(ValueTypes.DATE_TIME));
        }

        private createInputAsLocalDateTime(property: Property) {
            var dateTimeBuilder = new DateTimePickerBuilder();

            if (!ValueTypes.LOCAL_DATE_TIME.equals(property.getType())) {
                property.convertValueType(ValueTypes.LOCAL_DATE_TIME);
            }

            if (property.hasNonNullValue()) {
                var date = property.getLocalDateTime();
                dateTimeBuilder.
                    setYear(date.getYear()).
                    setMonth(date.getMonth()).
                    setSelectedDate(date.toDate()).
                    setHours(date.getHours()).
                    setMinutes(date.getMinutes());
            }

            var dateTimePicker = dateTimeBuilder.build();

            dateTimePicker.onSelectedDateTimeChanged((event: SelectedDateChangedEvent) => {
                var value = new Value(event.getDate() != null ? LocalDateTime.fromDate(event.getDate()) : null,
                    ValueTypes.LOCAL_DATE_TIME);
                this.notifyOccurrenceValueChanged(dateTimePicker, value);
            });

            return dateTimePicker;
        }

        private createInputAsDateTime(property: Property) {
            var dateTimeBuilder = new DateTimePickerBuilder();
            dateTimeBuilder.setUseLocalTimezoneIfNotPresent(true);

            if (!ValueTypes.DATE_TIME.equals(property.getType())) {
                property.convertValueType(ValueTypes.DATE_TIME);
            }

            if (property.hasNonNullValue()) {
                var date: DateTime = property.getDateTime();
                dateTimeBuilder.
                    setYear(date.getYear()).
                    setMonth(date.getMonth()).
                    setSelectedDate(date.toDate()).
                    setHours(date.getHours()).
                    setMinutes(date.getMinutes()).
                    setTimezone(date.getTimezone());
            }

            var dateTimePicker = new DateTimePicker(dateTimeBuilder);
            dateTimePicker.onSelectedDateTimeChanged((event: SelectedDateChangedEvent) => {
                var value = new Value(event.getDate() != null ? DateTime.fromDate(event.getDate()) : null,
                    ValueTypes.DATE_TIME);
                this.notifyOccurrenceValueChanged(dateTimePicker, value);
            });
            return dateTimePicker;
        }
    }
    InputTypeManager.register(new Class("DateTime", DateTime));

