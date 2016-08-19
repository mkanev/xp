import {Property} from "../../../data/Property";
import {PropertyArray} from "../../../data/PropertyArray";
import {Value} from "../../../data/Value";
import {ValueType} from "../../../data/ValueType";
import {ValueTypes} from "../../../data/ValueTypes";
import {Input} from "../../Input";
import {FormItemOccurrences} from "../../FormItemOccurrences";
import {Occurrences} from "../../Occurrences";
import {FormItemOccurrence} from "../../FormItemOccurrence";
import {RemoveButtonClickedEvent} from "../../RemoveButtonClickedEvent";
import {assertNotNull} from "../../../util/Assert";
import {FormItemOccurrencesConfig} from "../../FormItemOccurrences";
import {FormItemOccurrenceView} from "../../FormItemOccurrenceView";
import {InputTypeView} from "../InputTypeView";
import {BaseInputTypeNotManagingAdd} from "./BaseInputTypeNotManagingAdd";
import {InputOccurrence} from "./InputOccurrence";
import {InputOccurrenceView} from "./InputOccurrenceView";

export class InputOccurrencesBuilder {

        baseInputTypeView: BaseInputTypeNotManagingAdd<any>;

        input: Input;

        propertyArray: PropertyArray;

        setBaseInputTypeView(value: BaseInputTypeNotManagingAdd<any>): InputOccurrencesBuilder {
            this.baseInputTypeView = value;
            return this;
        }

        setInput(value: Input): InputOccurrencesBuilder {
            this.input = value;
            return this;
        }

        setPropertyArray(value: PropertyArray): InputOccurrencesBuilder {
            this.propertyArray = value;
            return this;
        }

        build(): InputOccurrences {
            return new InputOccurrences(this);
        }
    }

    /*
     * A kind of a controller, which add/remove InputOccurrenceView-s to the BaseInputTypeView
     */
    export class InputOccurrences extends FormItemOccurrences<InputOccurrenceView> {

        private baseInputTypeView: BaseInputTypeNotManagingAdd<any>;

        private input: Input;

        constructor(config: InputOccurrencesBuilder) {
            this.baseInputTypeView = config.baseInputTypeView;
            this.input = config.input;

            super(<FormItemOccurrencesConfig>{
                formItem: config.input,
                propertyArray: config.propertyArray,
                occurrenceViewContainer: config.baseInputTypeView,
                allowedOccurrences: config.input.getOccurrences()
            });
        }

        hasValidUserInput(): boolean {
            var result = true;
            this.getOccurrenceViews().forEach((formItemOccurrenceView: FormItemOccurrenceView) => {

                if (!formItemOccurrenceView.hasValidUserInput()) {
                    result = false;
                }
            });
            return result;
        }

        moveOccurrence(fromIndex: number, toIndex: number) {

            super.moveOccurrence(fromIndex, toIndex);
        }

        getInput(): Input {
            return this.input;
        }

        getAllowedOccurrences(): Occurrences {
            return this.input.getOccurrences();
        }

        protected constructOccurrencesForNoData(): FormItemOccurrence<InputOccurrenceView>[] {
            var occurrences: FormItemOccurrence<InputOccurrenceView>[] = [];
            if (this.getAllowedOccurrences().getMinimum() > 0) {

                for (var i = 0; i < this.getAllowedOccurrences().getMinimum(); i++) {
                    occurrences.push(this.createNewOccurrence(this, i));
                }
            } else {
                occurrences.push(this.createNewOccurrence(this, 0));
            }
            return occurrences;
        }

        protected constructOccurrencesForData(): FormItemOccurrence<InputOccurrenceView>[] {
            var occurrences: FormItemOccurrence<InputOccurrenceView>[] = [];

            this.propertyArray.forEach((property: Property, index: number) => {
                occurrences.push(this.createNewOccurrence(this, index));
            });

            if (occurrences.length < this.input.getOccurrences().getMinimum()) {
                for (var index: number = occurrences.length; index < this.input.getOccurrences().getMinimum(); index++) {
                    occurrences.push(this.createNewOccurrence(this, index));
                }
            }
            return occurrences;
        }

        createNewOccurrence(formItemOccurrences: FormItemOccurrences<InputOccurrenceView>,
                            insertAtIndex: number): FormItemOccurrence<InputOccurrenceView> {
            return new InputOccurrence(<InputOccurrences>formItemOccurrences, insertAtIndex);
        }

        createNewOccurrenceView(occurrence: InputOccurrence): InputOccurrenceView {

            var property = this.getPropertyFromArray(occurrence.getIndex());
            var inputOccurrenceView: InputOccurrenceView = new InputOccurrenceView(occurrence, this.baseInputTypeView, property);

            var inputOccurrences: InputOccurrences = this;
            inputOccurrenceView.onRemoveButtonClicked((event: RemoveButtonClickedEvent<InputOccurrenceView>) => {
                inputOccurrences.removeOccurrenceView(event.getView());
            });

            return inputOccurrenceView;
        }

        updateOccurrenceView(occurrenceView: InputOccurrenceView, propertyArray: PropertyArray,
                             unchangedOnly?: boolean): wemQ.Promise<void> {
            this.propertyArray = propertyArray;

            return occurrenceView.update(propertyArray, unchangedOnly);
        }

        private getPropertyFromArray(index: number): Property {
            var property = this.propertyArray.get(index);
            if (!property) {
                var newInitialValue = this.baseInputTypeView.newInitialValue();
                assertNotNull(newInitialValue,
                    "InputTypeView-s extending BaseInputTypeNotManagingAdd must must return a Value from newInitialValue");
                property = this.propertyArray.add(newInitialValue);
            }
            return property;
        }

        giveFocus(): boolean {

            var focusGiven = false;
            var occurrenceViews = this.getOccurrenceViews();
            if (occurrenceViews.length > 0) {
                for (var i = 0; i < occurrenceViews.length; i++) {
                    if (occurrenceViews[i].giveFocus()) {
                        focusGiven = true;
                        break;
                    }
                }
            }
            return focusGiven;
        }

        public static create(): InputOccurrencesBuilder {
            return new InputOccurrencesBuilder();
        }
    }
