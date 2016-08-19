import {Property} from "../../../data/Property";
import {Value} from "../../../data/Value";
import {ValueType} from "../../../data/ValueType";
import {ValueTypes} from "../../../data/ValueTypes";
import {BaseInputTypeNotManagingAdd} from "../support/BaseInputTypeNotManagingAdd";
import {ValueTypeLocalDate} from "../../../data/ValueTypeLocalDate";
import {InputTypeViewContext} from "../InputTypeViewContext";
import {Element} from "../../../dom/Element";
import {DatePickerBuilder} from "../../../ui/time/DatePicker";
import {SelectedDateChangedEvent} from "../../../ui/time/SelectedDateChangedEvent";
import {LocalDate} from "../../../util/LocalDate";
import {DatePicker} from "../../../ui/time/DatePicker";
import {InputTypeManager} from "../InputTypeManager";
import {Class} from "../../../Class";

/**
     * Uses [[ValueType]] [[ValueTypeLocalDate]].
     */
    export class Date extends BaseInputTypeNotManagingAdd<Date> {

        constructor(config: InputTypeViewContext) {
            super(config);
        }

        getValueType(): ValueType {
            return ValueTypes.LOCAL_DATE;
        }

        newInitialValue(): Value {
            return super.newInitialValue() || ValueTypes.LOCAL_DATE.newNullValue();
        }

        createInputOccurrenceElement(index: number, property: Property): Element {
            if (!ValueTypes.LOCAL_DATE.equals(property.getType())) {
                property.convertValueType(ValueTypes.LOCAL_DATE);
            }

            var datePickerBuilder = new DatePickerBuilder();

            if (!property.hasNullValue()) {
                var date = property.getLocalDate();
                datePickerBuilder.
                    setSelectedDate(date.toDate()).
                    setYear(date.getYear()).
                    setMonth(date.getMonth());
            }
            var datePicker = datePickerBuilder.build();

            datePicker.onSelectedDateChanged((event: SelectedDateChangedEvent) => {
                var value = new Value(event.getDate() != null ? LocalDate.fromDate(event.getDate()) : null,
                    ValueTypes.LOCAL_DATE);
                this.notifyOccurrenceValueChanged(datePicker, value);
            });

            return datePicker;
        }

        updateInputOccurrenceElement(occurrence: Element, property: Property, unchangedOnly?: boolean) {
            var datePicker = <DatePicker> occurrence;
            if (!unchangedOnly || !datePicker.isDirty()) {
                var date = property.hasNonNullValue() ? property.getLocalDate().toDate() : null;
                datePicker.setSelectedDate(date);
            }
        }

        valueBreaksRequiredContract(value: Value): boolean {
            return value.isNull() || !value.getType().equals(ValueTypes.LOCAL_DATE);
        }

        hasInputElementValidUserInput(inputElement: Element) {
            var datePicker = <DatePicker>inputElement;
            return datePicker.isValid();
        }
    }
    InputTypeManager.register(new Class("Date", Date));

