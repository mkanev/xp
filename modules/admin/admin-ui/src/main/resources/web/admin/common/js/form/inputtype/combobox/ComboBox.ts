import {PropertyArray} from "../../../data/PropertyArray";
import {Property} from "../../../data/Property";
import {Value} from "../../../data/Value";
import {ValueType} from "../../../data/ValueType";
import {ValueTypes} from "../../../data/ValueTypes";
import {SelectedOption} from "../../../ui/selector/combobox/SelectedOption";
import {OptionSelectedEvent} from "../../../ui/selector/OptionSelectedEvent";
import {SelectedOptionEvent} from "../../../ui/selector/combobox/SelectedOptionEvent";
import {FocusSwitchEvent} from "../../../ui/FocusSwitchEvent";
import {BaseInputTypeManagingAdd} from "../support/BaseInputTypeManagingAdd";
import {InputTypeViewContext} from "../InputTypeViewContext";
import {ComboBox} from "../../../ui/selector/combobox/ComboBox";
import {SelectedOptionsView} from "../../../ui/selector/combobox/SelectedOptionsView";
import {Input} from "../../Input";
import {BaseSelectedOptionsView} from "../../../ui/selector/combobox/BaseSelectedOptionsView";
import {Element} from "../../../dom/Element";
import {OptionFilterInputValueChangedEvent} from "../../../ui/selector/OptionFilterInputValueChangedEvent";
import {Option} from "../../../ui/selector/Option";
import {InputTypeManager} from "../InputTypeManager";
import {Class} from "../../../Class";
import {ComboBoxDisplayValueViewer} from "./ComboBoxDisplayValueViewer";
import {ComboBoxOption} from "./ComboBoxOption";

export class ComboBox extends BaseInputTypeManagingAdd<string> {

        private context: InputTypeViewContext;

        private comboBoxOptions: ComboBoxOption[];

        private comboBox: ComboBox<string>;

        private selectedOptionsView: SelectedOptionsView<string>;

        constructor(context: InputTypeViewContext) {
            super("");
            this.context = context;
            this.readConfig(context.inputConfig);
        }

        private readConfig(inputConfig: { [element: string]: { [name: string]: string }[]; }): void {
            var options: ComboBoxOption[] = [];

            var optionValues = inputConfig['option'] || [];
            var l = optionValues.length, optionValue;
            for (var i = 0; i < l; i++) {
                optionValue = optionValues[i];
                options.push({label: optionValue['value'], value: optionValue['@value']});
            }
            this.comboBoxOptions = options;
        }

        getComboBox(): ComboBox<string> {
            return this.comboBox;
        }

        availableSizeChanged() {
            // console.log("ComboBox.availableSizeChanged(" + this.getEl().getWidth() + "x" + this.getEl().getWidth() + ")");
        }

        getValueType(): ValueType {
            return ValueTypes.STRING;
        }

        newInitialValue(): Value {
            return null;
        }

        layout(input: Input, propertyArray: PropertyArray): wemQ.Promise<void> {
            if (!ValueTypes.STRING.equals(propertyArray.getType())) {
                propertyArray.convertValues(ValueTypes.STRING);
            }
            super.layout(input, propertyArray);

            this.selectedOptionsView = new BaseSelectedOptionsView<string>();
            this.comboBox = this.createComboBox(input, propertyArray);

            this.comboBoxOptions.forEach((option: ComboBoxOption) => {
                this.comboBox.addOption({value: option.value, displayValue: option.label})
            });

            this.appendChild(this.comboBox);
            this.appendChild(<Element> this.selectedOptionsView);

            this.setLayoutInProgress(false);

            return wemQ<void>(null);
        }

        update(propertyArray: PropertyArray, unchangedOnly?: boolean): Q.Promise<void> {
            var superPromise = super.update(propertyArray, unchangedOnly);

            if (!unchangedOnly || !this.comboBox.isDirty()) {
                return superPromise.then(() => {
                    this.comboBox.setValue(this.getValueFromPropertyArray(propertyArray));
                });
            } else {
                return superPromise;
            }
        }

        createComboBox(input: Input, propertyArray: PropertyArray): ComboBox<string> {
            var comboBox = new ComboBox<string>(name, {
                filter: this.comboBoxFilter,
                selectedOptionsView: this.selectedOptionsView,
                maximumOccurrences: input.getOccurrences().getMaximum(),
                optionDisplayValueViewer: new ComboBoxDisplayValueViewer(),
                hideComboBoxWhenMaxReached: true,
                value: this.getValueFromPropertyArray(propertyArray)
            });

            comboBox.onOptionFilterInputValueChanged((event: OptionFilterInputValueChangedEvent<string>) => {
                this.comboBox.setFilterArgs({searchString: event.getNewValue()});
            });
            comboBox.onOptionSelected((event: SelectedOptionEvent<string>) => {
                this.ignorePropertyChange = true;

                const option = event.getSelectedOption();
                var value = new Value(option.getOption().value, ValueTypes.STRING);
                if (option.getIndex() >= 0) {
                    this.getPropertyArray().set(option.getIndex(), value);
                } else {
                    this.getPropertyArray().add(value);
                }

                this.ignorePropertyChange = false;
                this.validate(false);

                this.fireFocusSwitchEvent(event);
            });
            comboBox.onOptionDeselected((event: SelectedOptionEvent<string>) => {
                this.ignorePropertyChange = true;

                this.getPropertyArray().remove(event.getSelectedOption().getIndex());

                this.ignorePropertyChange = false;
                this.validate(false);
            });

            return comboBox;
        }

        giveFocus(): boolean {
            if (this.comboBox.maximumOccurrencesReached()) {
                return false;
            }
            return this.comboBox.giveFocus();
        }

        valueBreaksRequiredContract(value: Value): boolean {
            return value.isNull() || !value.getType().equals(ValueTypes.STRING) || !this.isExistingValue(value.getString());
        }

        private isExistingValue(value: string): boolean {
            return this.comboBoxOptions.some((option: ComboBoxOption) => {
                return option.value == value;
            });
        }

        private comboBoxFilter(item: Option<string>, args) {
            return !(args && args.searchString && item.displayValue.toUpperCase().indexOf(args.searchString.toUpperCase()) == -1);
        }

        protected getNumberOfValids(): number {
            return this.getPropertyArray().getSize();
        }


        onFocus(listener: (event: FocusEvent) => void) {
            this.comboBox.onFocus(listener);
        }

        unFocus(listener: (event: FocusEvent) => void) {
            this.comboBox.unFocus(listener);
        }

        onBlur(listener: (event: FocusEvent) => void) {
            this.comboBox.onBlur(listener);
        }

        unBlur(listener: (event: FocusEvent) => void) {
            this.comboBox.unBlur(listener);
        }

    }

    InputTypeManager.register(new Class("ComboBox", ComboBox));
