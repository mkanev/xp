import {PropertyTree} from "../../../../data/PropertyTree";
import {Property} from "../../../../data/Property";
import {PropertyArray} from "../../../../data/PropertyArray";
import {PropertySet} from "../../../../data/PropertySet";
import {FormView} from "../../../../form/FormView";
import {FormValidityChangedEvent} from "../../../../form/FormValidityChangedEvent";
import {Value} from "../../../../data/Value";
import {ValueType} from "../../../../data/ValueType";
import {ValueTypes} from "../../../../data/ValueTypes";
import {InputOccurrences} from "../../../../form/inputtype/support/InputOccurrences";
import {ComboBoxConfig} from "../../../../ui/selector/combobox/ComboBox";
import {ComboBox} from "../../../../ui/selector/combobox/ComboBox";
import {Option} from "../../../../ui/selector/Option";
import {SelectedOption} from "../../../../ui/selector/combobox/SelectedOption";
import {Application} from "../../../../application/Application";
import {ApplicationKey} from "../../../../application/ApplicationKey";
import {SiteConfig} from "../../SiteConfig";
import {LoadedDataEvent} from "../../../../util/loader/event/LoadedDataEvent";
import {SelectedOptionEvent} from "../../../../ui/selector/combobox/SelectedOptionEvent";
import {FocusSwitchEvent} from "../../../../ui/FocusSwitchEvent";
import {BaseInputTypeManagingAdd} from "../../../../form/inputtype/support/BaseInputTypeManagingAdd";
import {InputTypeViewContext} from "../../../../form/inputtype/InputTypeViewContext";
import {ContentFormContext} from "../../../form/ContentFormContext";
import {ContentInputTypeViewContext} from "../../../form/inputtype/ContentInputTypeViewContext";
import {Input} from "../../../../form/Input";
import {InputValidationRecording} from "../../../../form/inputtype/InputValidationRecording";
import {InputTypeManager} from "../../../../form/inputtype/InputTypeManager";
import {Class} from "../../../../Class";
import {SiteConfigProvider} from "./SiteConfigProvider";
import {SiteConfiguratorComboBox} from "./SiteConfiguratorComboBox";
import {SiteConfiguratorSelectedOptionView} from "./SiteConfiguratorSelectedOptionView";

export class SiteConfigurator extends BaseInputTypeManagingAdd<Application> {

        private context: InputTypeViewContext;

        private comboBox: SiteConfiguratorComboBox;

        private siteConfigProvider: SiteConfigProvider;

        private formContext: ContentFormContext;

        constructor(config: ContentInputTypeViewContext) {
            super("site-configurator");
            this.context = config;
            this.formContext = config.formContext;
        }

        getValueType(): ValueType {
            return ValueTypes.DATA;
        }

        newInitialValue(): Value {
            return null;
        }

        layout(input: Input, propertyArray: PropertyArray): wemQ.Promise<void> {

            super.layout(input, propertyArray);

            this.siteConfigProvider = new SiteConfigProvider(propertyArray);
            // ignore changes made to property by siteConfigProvider
            this.siteConfigProvider.onBeforePropertyChanged(() => this.ignorePropertyChange = true);
            this.siteConfigProvider.onAfterPropertyChanged(() => this.ignorePropertyChange = false);

            this.comboBox = this.createComboBox(input, this.siteConfigProvider);

            this.appendChild(this.comboBox);

            this.setLayoutInProgress(false);

            return wemQ<void>(null);
        }


        update(propertyArray: PropertyArray, unchangedOnly?: boolean): Q.Promise<void> {
            return super.update(propertyArray, unchangedOnly).then(() => {
                this.siteConfigProvider.setPropertyArray(propertyArray);

                if (!unchangedOnly || !this.comboBox.isDirty()) {
                    this.comboBox.setValue(this.getValueFromPropertyArray(propertyArray));
                }
                return null;
            });
        }


        private saveToSet(siteConfig: SiteConfig, index) {

            var propertySet = this.getPropertyArray().get(index).getPropertySet();
            if (!propertySet) {
                propertySet = this.getPropertyArray().addSet();
            }

            var config = siteConfig.getConfig();
            var appKey = siteConfig.getApplicationKey();

            propertySet.setStringByPath('applicationKey', appKey.toString());
            propertySet.setPropertySetByPath('config', config);
        }

        protected getValueFromPropertyArray(propertyArray: PropertyArray): string {
            return propertyArray.getProperties().map((property) => {
                if (property.hasNonNullValue()) {
                    var siteConfig = SiteConfig.create().fromData(property.getPropertySet()).build();
                    return siteConfig.getApplicationKey().toString();
                }
            }).join(';');
        }

        private createComboBox(input: Input, siteConfigProvider: SiteConfigProvider): SiteConfiguratorComboBox {

            var value = this.getValueFromPropertyArray(this.getPropertyArray());
            var siteConfigFormsToDisplay = value.split(';');
            var comboBox = new SiteConfiguratorComboBox(input.getOccurrences().getMaximum() || 0, siteConfigProvider, this.formContext,
                value);

            comboBox.onOptionDeselected((event: SelectedOptionEvent<Application>) => {
                this.ignorePropertyChange = true;

                this.getPropertyArray().remove(event.getSelectedOption().getIndex());

                this.ignorePropertyChange = false;
                this.validate(false);
            });

            comboBox.onOptionSelected((event: SelectedOptionEvent<Application>) => {
                this.fireFocusSwitchEvent(event);

                this.ignorePropertyChange = true;

                const selectedOption = event.getSelectedOption();
                var key = selectedOption.getOption().displayValue.getApplicationKey();
                if (!key) {
                    return;
                }
                var selectedOptionView: SiteConfiguratorSelectedOptionView = <SiteConfiguratorSelectedOptionView>selectedOption.getOptionView();
                this.saveToSet(selectedOptionView.getSiteConfig(), selectedOption.getIndex());

                this.ignorePropertyChange = false;
                this.validate(false);
            });

            comboBox.onOptionMoved((selectedOption: SelectedOption<Application>) => {
                this.ignorePropertyChange = true;

                var selectedOptionView: SiteConfiguratorSelectedOptionView = <SiteConfiguratorSelectedOptionView> selectedOption.getOptionView();
                this.saveToSet(selectedOptionView.getSiteConfig(), selectedOption.getIndex());

                this.ignorePropertyChange = false;
                this.validate(false);
            });

            comboBox.onSiteConfigFormDisplayed((applicationKey: ApplicationKey, formView: FormView) => {
                var indexToRemove = siteConfigFormsToDisplay.indexOf(applicationKey.toString());
                if (indexToRemove != -1) {
                    siteConfigFormsToDisplay.splice(indexToRemove, 1);
                }

                formView.onValidityChanged((event: FormValidityChangedEvent) => {
                    this.validate(false);
                });

                this.validate(false);
            });

            return comboBox;
        }

        displayValidationErrors(value: boolean) {
            this.comboBox.getSelectedOptionViews().forEach((view: SiteConfiguratorSelectedOptionView) => {
                view.getFormView().displayValidationErrors(value);
            });
        }

        protected getNumberOfValids(): number {
            return this.comboBox.countSelected();
        }

        validate(silent: boolean = true): InputValidationRecording {
            var recording = new InputValidationRecording();

            this.comboBox.getSelectedOptionViews().forEach((view: SiteConfiguratorSelectedOptionView) => {

                var validationRecording = view.getFormView().validate(true);
                if (!validationRecording.isMinimumOccurrencesValid()) {
                    recording.setBreaksMinimumOccurrences(true);
                }
                if (!validationRecording.isMaximumOccurrencesValid()) {
                    recording.setBreaksMaximumOccurrences(true);
                }
            });

            return super.validate(silent, recording);
        }

        giveFocus(): boolean {
            if (this.comboBox.maximumOccurrencesReached()) {
                return false;
            }
            return this.comboBox.giveFocus();
        }

    }

    InputTypeManager.register(new Class("SiteConfigurator", SiteConfigurator));
