import {Option} from "../selector/Option";
import {Locale} from "../../locale/Locale";
import {LocaleLoader} from "../../locale/LocaleLoader";
import {SelectedOption} from "../selector/combobox/SelectedOption";
import {BaseSelectedOptionView} from "../selector/combobox/BaseSelectedOptionView";
import {BaseSelectedOptionsView} from "../selector/combobox/BaseSelectedOptionsView";
import {RichComboBox} from "../selector/combobox/RichComboBox";
import {RichComboBoxBuilder} from "../selector/combobox/RichComboBox";
import {SelectedOptionView} from "../selector/combobox/SelectedOptionView";
import {AEl} from "../../dom/AEl";
import {LocaleViewer} from "./LocaleViewer";

export class LocaleComboBox extends RichComboBox<Locale> {
        constructor(maxOccurrences?: number, value?: string) {
            var localeSelectedOptionsView = new LocaleSelectedOptionsView();
            localeSelectedOptionsView.onOptionDeselected(() => {
                this.clearSelection();
            });
            var builder = new RichComboBoxBuilder<Locale>().
                setMaximumOccurrences(maxOccurrences || 0).
                setComboBoxName("localeSelector").
                setIdentifierMethod("getTag").
                setLoader(new LocaleLoader()).
                setValue(value).
                setSelectedOptionsView(localeSelectedOptionsView).
                setOptionDisplayValueViewer(new LocaleViewer()).
                setDelayedInputValueChangedHandling(500);
            super(builder);
        }

        clearSelection(forceClear: boolean = false) {
            this.getLoader().search("");
            super.clearSelection(forceClear);
        }
    }


    class LocaleSelectedOptionView extends LocaleViewer implements SelectedOptionView<Locale> {

        private option: Option<Locale>;

        constructor(option: Option<Locale>) {
            super();
            this.setOption(option);
            this.setClass("locale-selected-option-view");
            var removeButton = new AEl("icon-close");
            removeButton.onClicked((event: MouseEvent) => {
                this.notifyRemoveClicked(event);
                event.stopPropagation();
                event.preventDefault();
                return false;
            });
            this.appendChild(removeButton);
        }

        setOption(option: Option<Locale>) {
            this.option = option;
            this.setObject(option.displayValue);
        }

        getOption(): Option<Locale> {
            return this.option;
        }

    }

    class LocaleSelectedOptionsView extends BaseSelectedOptionsView<Locale> {

        constructor() {
            super("locale-selected-options-view");
        }

        createSelectedOption(option: Option<Locale>): SelectedOption<Locale> {
            var optionView = new LocaleSelectedOptionView(option);
            return new SelectedOption<Locale>(optionView, this.count());
        }

    }

