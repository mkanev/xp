import {FormItemOccurrence} from "./FormItemOccurrence";
import {FormItemOccurrenceView} from "./FormItemOccurrenceView";

export class OccurrenceRenderedEvent {

        private occurrence: FormItemOccurrence<FormItemOccurrenceView>;

        private occurrenceView: FormItemOccurrenceView;

        constructor(occurrence: FormItemOccurrence<FormItemOccurrenceView>, occurrenceView: FormItemOccurrenceView) {
            this.occurrence = occurrence;
            this.occurrenceView = occurrenceView;
        }

        getOccurrence(): FormItemOccurrence<FormItemOccurrenceView> {
            return this.occurrence;
        }

        getOccurrenceView(): FormItemOccurrenceView {
            return this.occurrenceView;
        }
    }
