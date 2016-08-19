import {Timezone} from "../../util/Timezone";
import {UlEl} from "../../dom/UlEl";
import {AEl} from "../../dom/AEl";
import {SpanEl} from "../../dom/SpanEl";
import {LiEl} from "../../dom/LiEl";
import {Body} from "../../dom/Body";

export class TimePickerPopupBuilder {

        hours: number;

        minutes: number;

        timezone: Timezone;

        // use local timezone if timezone value is not initialized
        useLocalTimezoneIfNotPresent: boolean = false;

        setHours(value: number): TimePickerPopupBuilder {
            this.hours = value;
            return this;
        }

        getHours(): number {
            return this.hours;
        }

        setMinutes(value: number): TimePickerPopupBuilder {
            this.minutes = value;
            return this;
        }

        getMinutes(): number {
            return this.minutes;
        }

        setTimezone(value: Timezone): TimePickerPopupBuilder {
            this.timezone = value;
            return this;
        }

        getTimezone(): Timezone {
            return this.timezone;
        }

        setUseLocalTimezoneIfNotPresent(value: boolean): TimePickerPopupBuilder {
            this.useLocalTimezoneIfNotPresent = value;
            return this;
        }

        isUseLocalTimezoneIfNotPresent(): boolean {
            return this.useLocalTimezoneIfNotPresent;
        }

        build(): TimePickerPopup {
            return new TimePickerPopup(this);
        }

    }

    export class TimePickerPopup extends UlEl {

        private nextHour: AEl;
        private hour: SpanEl;
        private prevHour: AEl;
        private nextMinute: AEl;
        private minute: SpanEl;
        private prevMinute: AEl;

        private timezoneOffset: SpanEl;
        private timezoneLocation: SpanEl;

        private selectedHour: number;
        private selectedMinute: number;
        private interval: number;

        private timezone: Timezone;
        private useLocalTimezoneIfNotPresent: boolean = false;

        private timeChangedListeners: {(hours: number, minutes: number) : void}[] = [];

        constructor(builder: TimePickerPopupBuilder) {
            super('time-picker-dialog');

            var hourContainer = new LiEl();
            this.appendChild(hourContainer);

            this.nextHour = new AEl('next');
            this.nextHour.onMouseDown((e: MouseEvent) => {
                this.addHour(+1);
                this.startInterval(this.addHour, 1);
            });
            this.nextHour.onClicked((e: MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                return false;
            });
            Body.get().onMouseUp((e: MouseEvent) => {
                this.stopInterval();
            });
            this.nextHour.appendChild(new SpanEl());
            hourContainer.appendChild(this.nextHour);

            this.hour = new SpanEl();
            hourContainer.appendChild(this.hour);

            this.prevHour = new AEl('prev');
            this.prevHour.onMouseDown((e: MouseEvent) => {
                this.addHour(-1);
                this.startInterval(this.addHour, -1);
            });
            this.prevHour.onClicked((e: MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                return false;
            });
            this.prevHour.appendChild(new SpanEl());
            hourContainer.appendChild(this.prevHour);

            this.appendChild(new LiEl('colon'));

            var minuteContainer = new LiEl();
            this.appendChild(minuteContainer);

            this.nextMinute = new AEl('next');
            this.nextMinute.onMouseDown((e: MouseEvent) => {
                this.addMinute(+1);
                this.startInterval(this.addMinute, 1);
            });
            this.nextMinute.onClicked((e: MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                return false;
            });
            this.nextMinute.appendChild(new SpanEl());
            minuteContainer.appendChild(this.nextMinute);

            this.minute = new SpanEl();
            minuteContainer.appendChild(this.minute);

            this.prevMinute = new AEl('prev');
            this.prevMinute.onMouseDown((e: MouseEvent) => {
                this.addMinute(-1);
                this.startInterval(this.addMinute, -1);
            });
            this.prevMinute.onClicked((e: MouseEvent) => {
                e.stopPropagation();
                e.preventDefault();
                return false;
            });
            this.prevMinute.appendChild(new SpanEl());
            minuteContainer.appendChild(this.prevMinute);

            this.selectedHour = this.isHoursValid(builder.getHours()) ? builder.getHours() : null;
            this.selectedMinute = this.isMinutesValid(builder.getMinutes()) ? builder.getMinutes() : null;

            this.useLocalTimezoneIfNotPresent = builder.useLocalTimezoneIfNotPresent;
            this.timezone = builder.timezone;
            if (!this.timezone && this.useLocalTimezoneIfNotPresent) {
                this.timezone = Timezone.getLocalTimezone();
            }

            if (this.timezone) {
                var timezoneContainer = new LiEl("timezone");

                this.timezoneLocation = new SpanEl("timezone-location").setHtml(this.timezone.getLocation());
                this.timezoneOffset = new SpanEl("timezone-offset").setHtml(this.getUTCString(this.timezone.getOffset()));

                timezoneContainer.appendChild(this.timezoneLocation);
                timezoneContainer.appendChild(this.timezoneOffset);
                this.appendChild(timezoneContainer);
            }

            this.hour.setHtml(this.padNumber(this.selectedHour || 0, 2));
            this.minute.setHtml(this.padNumber(this.selectedMinute || 0, 2));
        }

        getSelectedTime(): {hour: number; minute: number} {
            return this.selectedHour != null && this.selectedMinute != null ? {
                hour: this.selectedHour,
                minute: this.selectedMinute
            } : null;
        }

        onSelectedTimeChanged(listener: (hours: number, minutes: number) => void) {
            this.timeChangedListeners.push(listener);
        }

        unSelectedTimeChanged(listener: (hours: number, minutes: number) => void) {
            this.timeChangedListeners = this.timeChangedListeners.filter((curr) => {
                return curr != listener;
            })
        }

        private startInterval(fn: Function, ...args: any[]) {
            var times = 0;
            var delay = 400;
            var intervalFn = () => {
                fn.apply(this, args);
                if (++times % 5 == 0 && delay > 50) {
                    // speed up after 5 occurrences but not faster than 50ms
                    this.stopInterval();
                    delay /= 2;
                    this.interval = setInterval(intervalFn, delay);
                }
            };
            this.interval = setInterval(intervalFn, delay);
        }

        private stopInterval() {
            clearInterval(this.interval);
        }

        private getUTCString(value: number) {
            if (!value && value != 0) {
                return "";
            }
            var result = "UTC";
            result = value > 0 ? result + "+" : (value == 0 ? result + "-" : result);
            return result + value;
        }


        private addHour(add: number, silent?: boolean) {
            this.selectedHour += add;
            if (this.selectedHour < 0) {
                this.selectedHour += 24;
            } else if (this.selectedHour > 23) {
                this.selectedHour -= 24;
            }
            this.setSelectedTime(this.selectedHour, this.selectedMinute || 0, silent);
        }

        private addMinute(add: number, silent?: boolean) {
            this.selectedMinute += add;
            if (this.selectedMinute < 0) {
                this.selectedMinute += 60;
                this.addHour(-1, true);
            } else if (this.selectedMinute > 59) {
                this.selectedMinute -= 60;
                this.addHour(1, true);
            }
            this.setSelectedTime(this.selectedHour || 0, this.selectedMinute, silent);
        }

        private notifyTimeChanged(hours: number, minutes: number) {
            this.timeChangedListeners.forEach((listener) => {
                listener(hours, minutes);
            });
        }

        setSelectedTime(hours: number, minutes: number, silent?: boolean) {
            if (this.isHoursValid(hours) && this.isMinutesValid(minutes)) {
                this.selectedHour = hours;
                this.selectedMinute = minutes;
            } else {
                this.selectedHour = null;
                this.selectedMinute = null;
            }
            this.hour.setHtml(this.padNumber(this.selectedHour || 0, 2));
            this.minute.setHtml(this.padNumber(this.selectedMinute || 0, 2));

            if (!silent) {
                this.notifyTimeChanged(this.selectedHour, this.selectedMinute);
            }
        }

        public padNumber(value: number, pad: number): string {
            return Array(pad - String(value).length + 1).join('0') + value;
        }


        public isHoursValid(hours: number): boolean {
            return hours >= 0 && hours < 24
        }

        public isMinutesValid(minutes: number): boolean {
            return minutes >= 0 && minutes < 60;
        }
    }

