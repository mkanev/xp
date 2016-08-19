import {NumberHelper} from "../util/NumberHelper";
import {StringHelper} from "../util/StringHelper";
import {ObjectHelper} from "../ObjectHelper";
import {Value} from "./Value";
import {ValueType} from "./ValueType";

export class ValueTypeDouble extends ValueType {

        constructor() {
            super("Double");
        }

        isValid(value: any): boolean {
            return NumberHelper.isNumber(value);
        }

        isConvertible(value: string): boolean {
            if (StringHelper.isBlank(value)) {
                return false;
            }
            var convertedValue = Number(value);
            return this.isValid(convertedValue);
        }

        newValue(value: string): Value {
            if (!value) {
                return this.newNullValue();
            }

            if (!this.isConvertible(value)) {
                return this.newNullValue();
            }
            return new Value(this.convertFromString(value), this);
        }

        fromJsonValue(jsonValue: number): Value {
            return new Value(jsonValue, this);
        }

        private convertFromString(value: string): number {
            return Number(value);
        }

        valueToString(value: Value): string {
            return (<Number>value.getObject()).toString();
        }

        valueEquals(a: number, b: number): boolean {
            return ObjectHelper.numberEquals(a, b) || (a == null && b == null);
        }
    }
