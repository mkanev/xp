import {DivEl} from "../../dom/DivEl";
import {AEl} from "../../dom/AEl";
import {SpanEl} from "../../dom/SpanEl";
import {H2El} from "../../dom/H2El";
import {H5El} from "../../dom/H5El";
import {CalendarBuilder} from "./Calendar";
import {Calendar} from "./Calendar";
import {MonthsOfYear} from "./MonthsOfYear";
import {SelectedDateChangedEvent} from "./SelectedDateChangedEvent";

export class DatePickerPopupBuilder {

        calendar: Calendar;

        setCalendar(value: Calendar): DatePickerPopupBuilder {
            this.calendar = value;
            return this;
        }

        getCalendar(): Calendar {
            return this.calendar;
        }

        build(): DatePickerPopup {
            return new DatePickerPopup(this);
        }

    }

    export class DatePickerPopup extends DivEl {

        private prevYear: AEl;
        private year: SpanEl;
        private nextYear: AEl;
        private prevMonth: AEl;
        private month: SpanEl;
        private nextMonth: AEl;
        private calendar: Calendar;

        constructor(builder: DatePickerPopupBuilder) {
            super('date-picker-dialog');

            var yearContainer = new H2El('year-container');
            this.appendChild(yearContainer);

            this.prevYear = new AEl('prev');
            this.prevYear.onClicked((e: MouseEvent) => {
                this.calendar.previousYear();
                e.stopPropagation();
                e.preventDefault();
                return false;
            });
            yearContainer.appendChild(this.prevYear);

            this.year = new SpanEl();
            yearContainer.appendChild(this.year);

            this.nextYear = new AEl('next');
            this.nextYear.onClicked((e: MouseEvent) => {
                this.calendar.nextYear();
                e.stopPropagation();
                e.preventDefault();
                return false;
            });
            yearContainer.appendChild(this.nextYear);

            var monthContainer = new H5El('month-container');
            this.appendChild(monthContainer);

            this.prevMonth = new AEl('prev');
            this.prevMonth.onClicked((e: MouseEvent) => {
                this.calendar.previousMonth();
                e.stopPropagation();
                e.preventDefault();
                return false;
            });
            monthContainer.appendChild(this.prevMonth);

            this.month = new SpanEl();
            monthContainer.appendChild(this.month);

            this.nextMonth = new AEl('next');
            this.nextMonth.onClicked((e: MouseEvent) => {
                this.calendar.nextMonth();
                e.stopPropagation();
                e.preventDefault();
                return false;
            });
            monthContainer.appendChild(this.nextMonth);

            this.calendar = builder.getCalendar() || new CalendarBuilder().build();

            this.year.setHtml(this.calendar.getYear().toString());
            this.month.setHtml(MonthsOfYear.getByNumberCode(this.calendar.getMonth()).getFullName());

            this.calendar.onShownMonthChanged((month: number, year: number) => {
                this.month.setHtml(MonthsOfYear.getByNumberCode(month).getFullName());
                this.year.setHtml(year.toString());
            });
            this.appendChild(this.calendar);
        }

        getSelectedDate(): Date {
            return this.calendar.getSelectedDate();
        }

        setSelectedDate(date: Date, silent?: boolean) {
            this.calendar.selectDate(date, silent);
        }

        onSelectedDateChanged(listener: (event: SelectedDateChangedEvent) => void) {
            this.calendar.onSelectedDateChanged(listener);
        }

        unSelectedDateChanged(listener: (event: SelectedDateChangedEvent) => void) {
            this.calendar.unSelectedDateChanged(listener);
        }
    }

