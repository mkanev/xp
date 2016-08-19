import {ObjectHelper} from "../ObjectHelper";
import {Reference} from "../util/Reference";
import {StringHelper} from "../util/StringHelper";
import {Value} from "./Value";
import {ValueType} from "./ValueType";

export class ValueTypeReference extends ValueType {

        constructor() {
            super("Reference");
        }

        isValid(value: any): boolean {

            if (!(typeof value === 'object')) {
                return false;
            }

            if (!ObjectHelper.iFrameSafeInstanceOf(value, Reference)) {
                return false;
            }
            return true;
        }

        isConvertible(value: string): boolean {
            if (StringHelper.isBlank(value)) {
                return false;
            }
            return true;
        }

        newValue(value: string): Value {
            if (this.isConvertible(value)) {
                return new Value(new Reference(value), this);
            }
            else {
                return this.newNullValue();
            }
        }

        valueToString(value: Value): string {
            if (value.isNotNull()) {
                return value.getReference().toString();
            }
            else {
                return null;
            }
        }

        toJsonValue(value: Value): any {
            return value.isNull() ? null : value.getReference().toString();
        }

        valueEquals(a: Reference, b: Reference): boolean {
            return ObjectHelper.equals(a, b);
        }
    }
