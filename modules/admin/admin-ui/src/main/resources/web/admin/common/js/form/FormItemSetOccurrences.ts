import {PropertySet} from "../data/PropertySet";
import {Property} from "../data/Property";
import {PropertyArray} from "../data/PropertyArray";
import {Value} from "../data/Value";
import {ValueType} from "../data/ValueType";
import {ValueTypes} from "../data/ValueTypes";
import {Element} from "../dom/Element";
import {FormContext} from "./FormContext";
import {FormItemOccurrence} from "./FormItemOccurrence";
import {FormItemOccurrencesConfig} from "./FormItemOccurrences";
import {FormItemOccurrences} from "./FormItemOccurrences";
import {FormItemSet} from "./FormItemSet";
import {FormItemSetOccurrence} from "./FormItemSetOccurrence";
import {FormItemSetOccurrenceViewConfig} from "./FormItemSetOccurrenceView";
import {FormItemSetOccurrenceView} from "./FormItemSetOccurrenceView";
import {Occurrences} from "./Occurrences";
import {RemoveButtonClickedEvent} from "./RemoveButtonClickedEvent";

export interface FormItemSetOccurrencesConfig {

        context: FormContext;

        occurrenceViewContainer: Element;

        formItemSet: FormItemSet;

        parent: FormItemSetOccurrenceView;

        propertyArray: PropertyArray;
    }

    /*
     * A kind of a controller, which adds/removes FormItemSetOccurrenceView-s
     */
    export class FormItemSetOccurrences extends FormItemOccurrences<FormItemSetOccurrenceView> {

        private context: FormContext;

        private formItemSet: FormItemSet;

        private parent: FormItemSetOccurrenceView;

        private occurrencesCollapsed: boolean;

        constructor(config: FormItemSetOccurrencesConfig) {
            this.occurrencesCollapsed = false;
            this.context = config.context;
            this.formItemSet = config.formItemSet;
            this.parent = config.parent;

            super(<FormItemOccurrencesConfig>{
                formItem: config.formItemSet,
                propertyArray: config.propertyArray,
                occurrenceViewContainer: config.occurrenceViewContainer,
                allowedOccurrences: config.formItemSet.getOccurrences()
            });
        }

        getFormItemSet(): FormItemSet {
            return this.formItemSet;
        }

        getAllowedOccurrences(): Occurrences {
            return this.formItemSet.getOccurrences();
        }

        protected constructOccurrencesForNoData(): FormItemOccurrence<FormItemSetOccurrenceView>[] {
            var occurrences: FormItemOccurrence<FormItemSetOccurrenceView>[] = [];
            var minimumOccurrences = this.getAllowedOccurrences().getMinimum();

            if (minimumOccurrences > 0) {
                for (var i = 0; i < minimumOccurrences; i++) {
                    occurrences.push(this.createNewOccurrence(this, i));
                }
            } else if (this.context.getShowEmptyFormItemSetOccurrences()) {
                occurrences.push(this.createNewOccurrence(this, 0));
            }

            return occurrences;
        }

        protected constructOccurrencesForData(): FormItemOccurrence<FormItemSetOccurrenceView>[] {
            var occurrences: FormItemOccurrence<FormItemSetOccurrenceView>[] = [];

            this.propertyArray.forEach((property: Property, index: number) => {
                occurrences.push(this.createNewOccurrence(this, index));
            });

            if (occurrences.length < this.formItemSet.getOccurrences().getMinimum()) {
                for (var index: number = occurrences.length; index < this.formItemSet.getOccurrences().getMinimum(); index++) {
                    occurrences.push(this.createNewOccurrence(this, index));
                }
            }
            return occurrences;
        }

        createNewOccurrence(formItemOccurrences: FormItemOccurrences<FormItemSetOccurrenceView>,
                            insertAtIndex: number): FormItemOccurrence<FormItemSetOccurrenceView> {
            return new FormItemSetOccurrence(<FormItemSetOccurrences>formItemOccurrences, insertAtIndex)
        }

        createNewOccurrenceView(occurrence: FormItemSetOccurrence): FormItemSetOccurrenceView {

            var dataSet = this.getSetFromArray(occurrence);

            var newOccurrenceView = new FormItemSetOccurrenceView(<FormItemSetOccurrenceViewConfig>{
                context: this.context,
                formItemSetOccurrence: occurrence,
                formItemSet: this.formItemSet,
                parent: this.parent,
                dataSet: dataSet
            });

            newOccurrenceView.onRemoveButtonClicked((event: RemoveButtonClickedEvent<FormItemSetOccurrenceView>) => {
                this.removeOccurrenceView(event.getView());
            });
            return newOccurrenceView;
        }

        updateOccurrenceView(occurrenceView: FormItemSetOccurrenceView, propertyArray: PropertyArray,
                             unchangedOnly?: boolean): wemQ.Promise<void> {
            this.propertyArray = propertyArray;

            return occurrenceView.update(propertyArray);
        }

        private getSetFromArray(occurrence): PropertySet {
            var dataSet = this.propertyArray.getSet(occurrence.getIndex());
            if (!dataSet) {
                dataSet = this.propertyArray.addSet();
            }
            return dataSet;
        }

        showOccurrences(show: boolean) {
            var views = <FormItemSetOccurrenceView[]>this.getOccurrenceViews();
            this.occurrencesCollapsed = !show;
            views.forEach((formItemSetOccurrenceView: FormItemSetOccurrenceView) => {
                formItemSetOccurrenceView.showContainer(show);
            });
        }

        isCollapsed(): boolean {
            return this.occurrencesCollapsed;
        }

        moveOccurrence(index: number, destinationIndex: number) {
            super.moveOccurrence(index, destinationIndex);
            //this.propertyArray.move(index, destinationIndex);
        }
    }
