import {Value} from "../../data/Value";

export class InputValueRemovedEvent {

        private arrayIndex: number;

        constructor(arrayIndex: number) {
            this.arrayIndex = arrayIndex;
        }

        getArrayIndex(): number {
            return this.arrayIndex;
        }
    }
