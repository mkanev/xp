import {FormItemOccurrence} from "../../FormItemOccurrence";
import {InputOccurrences} from "./InputOccurrences";
import {InputOccurrenceView} from "./InputOccurrenceView";

/*
     * Represents an occurrence or value of many. Translates to a Property in the data domain.
     */
    export class InputOccurrence extends FormItemOccurrence<InputOccurrenceView> {

        constructor(inputOccurrences:InputOccurrences, index:number) {
            super(inputOccurrences, index, inputOccurrences.getInput().getOccurrences());
        }
    }
