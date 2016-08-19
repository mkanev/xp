import {LocalDateTime} from "../util/LocalDateTime";
import {ObjectHelper} from "../ObjectHelper";
import {StringHelper} from "../util/StringHelper";
import {Value} from "./Value";
import {ValueType} from "./ValueType";

export class ValueTypeLocalDateTime extends ValueType {

        constructor() {
            super("LocalDateTime");
        }

        isValid(value: string): boolean {
            if (ObjectHelper.iFrameSafeInstanceOf(value, LocalDateTime)) {
                return true;
            }

            return LocalDateTime.isValidDateTime(value);
        }

        isConvertible(value: string): boolean {
            if (StringHelper.isBlank(value)) {
                return false;
            }
            // 2010-01-01T10:55:00
            if (value.length != 19) {
                return false;
            }

            return this.isValid(value);
        }

        newValue(value: string): Value {
            if (!value) {
                return this.newNullValue();
            }
            if (!this.isConvertible(value)) {
                return this.newNullValue();
            }
            var date: LocalDateTime = LocalDateTime.fromString(value);
            return new Value(date, this);
        }

        toJsonValue(value: Value): string {
            return value.isNull() ? null : value.getLocalDateTime().toString();
        }

        valueToString(value: Value): string {
            return value.getLocalDateTime().toString();
        }

        valueEquals(a: LocalDateTime, b: LocalDateTime): boolean {
            return ObjectHelper.equals(a, b);
        }
    }
