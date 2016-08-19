import {Property} from "../../../../data/Property";
import {PropertyArray} from "../../../../data/PropertyArray";
import {Value} from "../../../../data/Value";
import {ValueType} from "../../../../data/ValueType";
import {ValueTypes} from "../../../../data/ValueTypes";
import {GetRelationshipTypeByNameRequest} from "../../../../schema/relationshiptype/GetRelationshipTypeByNameRequest";
import {RelationshipTypeName} from "../../../../schema/relationshiptype/RelationshipTypeName";
import {SelectedOptionEvent} from "../../../../ui/selector/combobox/SelectedOptionEvent";
import {FocusSwitchEvent} from "../../../../ui/FocusSwitchEvent";
import {BaseInputTypeManagingAdd} from "../../../../form/inputtype/support/BaseInputTypeManagingAdd";
import {Principal} from "../../../../security/Principal";
import {ContentInputTypeViewContext} from "../ContentInputTypeViewContext";
import {PrincipalType} from "../../../../security/PrincipalType";
import {PrincipalComboBox} from "../../../../ui/security/PrincipalComboBox";
import {Input} from "../../../../form/Input";
import {PrincipalLoader} from "../../../../security/PrincipalLoader";
import {PrincipalSelectedOptionView} from "../../../../ui/security/PrincipalComboBox";
import {SelectedOption} from "../../../../ui/selector/combobox/SelectedOption";
import {Option} from "../../../../ui/selector/Option";
import {InputTypeManager} from "../../../../form/inputtype/InputTypeManager";
import {Class} from "../../../../Class";

export class PrincipalSelector extends BaseInputTypeManagingAdd<Principal> {

        private config: ContentInputTypeViewContext;

        private principalTypes: PrincipalType[];

        private comboBox: PrincipalComboBox;

        constructor(config?: ContentInputTypeViewContext) {
            super("relationship");
            this.addClass("input-type-view");
            this.config = config;
            this.readConfig(config.inputConfig);
        }

        private readConfig(inputConfig: { [element: string]: { [name: string]: string }[]; }): void {
            var principalTypeConfig = inputConfig['principalType'] || [];
            this.principalTypes =
                principalTypeConfig.map((cfg) => cfg['value']).filter((val) => !!val).map(
                    (val: string) => PrincipalType[val]).filter((val) => !!val);
        }

        public getPrincipalComboBox(): PrincipalComboBox {
            return this.comboBox;
        }

        getValueType(): ValueType {
            return ValueTypes.REFERENCE;
        }

        newInitialValue(): Value {
            return null;
        }

        layout(input: Input, propertyArray: PropertyArray): wemQ.Promise<void> {

            super.layout(input, propertyArray);
            this.comboBox = this.createComboBox(input);

            this.appendChild(this.comboBox);

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

        private createComboBox(input: Input): PrincipalComboBox {

            var value = this.getValueFromPropertyArray(this.getPropertyArray());
            var principalLoader = new PrincipalLoader().setAllowedTypes(this.principalTypes);

            var comboBox = PrincipalComboBox.create().setLoader(principalLoader).setMaxOccurences(
                input.getOccurrences().getMaximum()).setValue(value).build();

            comboBox.onOptionDeselected((event: SelectedOptionEvent<Principal>) => {
                this.getPropertyArray().remove(event.getSelectedOption().getIndex());
                this.validate(false);
            });

            comboBox.onOptionSelected((event: SelectedOptionEvent<Principal>) => {
                this.fireFocusSwitchEvent(event);

                const selectedOption = event.getSelectedOption();
                var key = selectedOption.getOption().displayValue.getKey();
                if (!key) {
                    return;
                }
                var selectedOptionView: PrincipalSelectedOptionView = <PrincipalSelectedOptionView>selectedOption.getOptionView();
                this.saveToSet(selectedOptionView.getOption(), selectedOption.getIndex());
                this.validate(false);
            });

            comboBox.onOptionMoved((selectedOption: SelectedOption<Principal>) => {
                var selectedOptionView: PrincipalSelectedOptionView = <PrincipalSelectedOptionView> selectedOption.getOptionView();
                this.saveToSet(selectedOptionView.getOption(), selectedOption.getIndex());
                this.validate(false);
            });

            return comboBox;
        }

        private saveToSet(principalOption: Option<Principal>, index) {
            this.getPropertyArray().set(index, ValueTypes.REFERENCE.newValue(principalOption.value));
        }

        private refreshSortable() {
            wemjq(this.getHTMLElement()).find(".selected-options").sortable("refresh");
        }

        protected getNumberOfValids(): number {
            return this.getPropertyArray().getSize();
        }

        giveFocus(): boolean {
            if (this.comboBox.maximumOccurrencesReached()) {
                return false;
            }
            return this.comboBox.giveFocus();
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

    InputTypeManager.register(new Class("PrincipalSelector", PrincipalSelector));
