import {Option} from "../selector/Option";
import {Principal} from "../../security/Principal";
import {PrincipalLoader} from "../../security/PrincipalLoader";
import {SelectedOption} from "../selector/combobox/SelectedOption";
import {BaseSelectedOptionView} from "../selector/combobox/BaseSelectedOptionView";
import {BaseSelectedOptionsView} from "../selector/combobox/BaseSelectedOptionsView";
import {PrincipalKey} from "../../security/PrincipalKey";
import {RichComboBox} from "../selector/combobox/RichComboBox";
import {RichComboBoxBuilder} from "../selector/combobox/RichComboBox";
import {SelectedOptionView} from "../selector/combobox/SelectedOptionView";
import {AEl} from "../../dom/AEl";
import {PrincipalViewer} from "./PrincipalViewer";

export class PrincipalComboBox extends RichComboBox<Principal> {
        constructor(builder: PrincipalComboBoxBuilder) {
            var richComboBoxBuilder = new RichComboBoxBuilder<Principal>().
            setMaximumOccurrences(builder.maxOccurrences).
            setComboBoxName("principalSelector").
            setIdentifierMethod("getKey").
            setLoader(builder.loader).
            setValue(builder.value).
            setDisplayMissingSelectedOptions(builder.displayMissing).
            setSelectedOptionsView(new PrincipalSelectedOptionsView()).
            setOptionDisplayValueViewer(new PrincipalViewer()).
            setDelayedInputValueChangedHandling(500);

            super(richComboBoxBuilder);
        }

        static create(): PrincipalComboBoxBuilder {
            return new PrincipalComboBoxBuilder();
        }
    }

    export class PrincipalComboBoxBuilder {

        loader: PrincipalLoader = new PrincipalLoader();

        maxOccurrences: number = 0;

        value: string;

        displayMissing: boolean = false;

        setLoader(value: PrincipalLoader): PrincipalComboBoxBuilder {
            this.loader = value;
            return this;
        }

        setMaxOccurences(value: number): PrincipalComboBoxBuilder {
            this.maxOccurrences = value;
            return this;
        }

        setValue(value: string): PrincipalComboBoxBuilder {
            this.value = value;
            return this;
        }

        setDisplayMissing(value: boolean): PrincipalComboBoxBuilder {
            this.displayMissing = value;
            return this;
        }

        build(): PrincipalComboBox {
            return new PrincipalComboBox(this);
        }
    }


    export class PrincipalSelectedOptionView extends PrincipalViewer implements SelectedOptionView<Principal> {

        private option: Option<Principal>;

        constructor(option: Option<Principal>) {
            super();
            this.setOption(option);
            this.setClass("principal-selected-option-view");
            var removeButton = new AEl("icon-close");
            removeButton.onClicked((event: MouseEvent) => {
                this.notifyRemoveClicked(event);
                event.stopPropagation();
                event.preventDefault();
                return false;
            });
            this.appendChild(removeButton);
        }

        setOption(option: Option<Principal>) {
            this.option = option;
            this.setObject(option.displayValue);
        }

        getOption(): Option<Principal> {
            return this.option;
        }

    }

    export class PrincipalSelectedOptionsView extends BaseSelectedOptionsView<Principal> {

        constructor() {
            super("principal-selected-options-view");
        }

        createSelectedOption(option: Option<Principal>, isEmpty?: boolean): SelectedOption<Principal> {
            var optionView = !option.empty ? new PrincipalSelectedOptionView(option) : new RemovedPrincipalSelectedOptionView(option);
            return new SelectedOption<Principal>(optionView, this.count());
        }

        makeEmptyOption(id: string): Option<Principal> {

            let key = PrincipalKey.fromString(id);

            return <Option<Principal>>{
                value: id,
                displayValue: Principal.create().setDisplayName(key.getId()).
                setKey(key).build(),
                empty: true
            };
        }

    }

    export class RemovedPrincipalSelectedOptionView extends PrincipalSelectedOptionView {

        constructor(option: Option<Principal>) {
            super(option);
            this.addClass("removed");
        }

        resolveSubName(object: Principal, relativePath: boolean = false): string {
            return "This user is deleted";
        }
    }

