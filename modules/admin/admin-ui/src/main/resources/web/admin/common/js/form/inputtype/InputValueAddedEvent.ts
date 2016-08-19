import {Value} from "../../data/Value";

export class InputValueAddedEvent {

        private value: Value;

        constructor(value: Value) {
            this.value = value;
        }

        getValue(): Value {
            return this.value;
        }
    }
