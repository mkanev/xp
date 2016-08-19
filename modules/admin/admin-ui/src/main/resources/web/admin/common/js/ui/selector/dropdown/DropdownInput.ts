import {Option} from "../Option";
import {OptionSelectedEvent} from "../OptionSelectedEvent";
import {OptionFilterInputValueChangedEvent} from "../OptionFilterInputValueChangedEvent";
import {DropdownHandle} from "../../button/DropdownHandle";
import {Viewer} from "../../Viewer";
import {DefaultOptionDisplayValueViewer} from "../DefaultOptionDisplayValueViewer";
import {FormInputEl} from "../../../dom/FormInputEl";
import {ImgEl} from "../../../dom/ImgEl";
import {DropdownExpandedEvent} from "../DropdownExpandedEvent";
import {StyleHelper} from "../../../StyleHelper";
import {ElementRenderedEvent} from "../../../dom/ElementRenderedEvent";
import {StringHelper} from "../../../util/StringHelper";
import {FormEl} from "../../../dom/FormEl";
import {AppHelper} from "../../../util/AppHelper";
import {ValueChangedEvent} from "../../../ValueChangedEvent";
import {DropdownGridRowSelectedEvent} from "../DropdownGridRowSelectedEvent";
import {DropdownListConfig} from "../DropdownList";
import {DropdownList} from "../DropdownList";
import {DropdownOptionFilterInput} from "./DropdownOptionFilterInput";
import {SelectedOptionView} from "./SelectedOptionView";

export interface DropdownConfig<OPTION_DISPLAY_VALUE> {

        iconUrl?: string;

        optionDisplayValueViewer?: Viewer<OPTION_DISPLAY_VALUE>;

        filter?: (item: Option<OPTION_DISPLAY_VALUE>, args: any) => boolean;

        dataIdProperty?: string;

        value?: string;

        disableFilter?: boolean;

        skipExpandOnClick?: boolean;

        inputPlaceholderText?: string;

        noOptionsText?: string;
    }

    export class DropdownInput<OPTION_DISPLAY_VALUE> extends FormInputEl {

        private icon: ImgEl;

        private typeAhead: boolean = true;

        private dropdownHandle: DropdownHandle;

        private input: DropdownOptionFilterInput;

        private dropdownList: DropdownList<OPTION_DISPLAY_VALUE>;

        private optionDisplayValueViewer: Viewer<OPTION_DISPLAY_VALUE>;

        private selectedOptionView: SelectedOptionView<OPTION_DISPLAY_VALUE>;

        private optionSelectedListeners: {(event: OptionSelectedEvent<OPTION_DISPLAY_VALUE>):void}[] = [];

        private optionFilterInputValueChangedListeners: {(event: OptionFilterInputValueChangedEvent<OPTION_DISPLAY_VALUE>):void}[] = [];

        private expandedListeners: {(event: DropdownExpandedEvent): void}[] = [];

        private noOptionsText: string;

        /**
         * Indicates if DropdownInput currently has focus
         * @type {boolean}
         */
        private active: boolean = false;

        constructor(name: string, config: DropdownConfig<OPTION_DISPLAY_VALUE>) {
            super("div", "dropdown", StyleHelper.COMMON_PREFIX, config.value);
            this.getEl().setAttribute("name", name);

            this.optionDisplayValueViewer = config.optionDisplayValueViewer || new DefaultOptionDisplayValueViewer();

            if (config.iconUrl) {
                this.icon = new ImgEl(config.iconUrl, "input-icon");
                this.appendChild(this.icon);
            }

            if (config.disableFilter) {
                this.typeAhead = false;
            }

            this.noOptionsText = config.noOptionsText;

            this.input = new DropdownOptionFilterInput(config.inputPlaceholderText);
            this.input.setVisible(this.typeAhead);
            this.appendChild(this.input);

            this.selectedOptionView = new SelectedOptionView<OPTION_DISPLAY_VALUE>(this.optionDisplayValueViewer, config.skipExpandOnClick);
            this.selectedOptionView.hide();
            this.appendChild(this.selectedOptionView);

            this.dropdownHandle = new DropdownHandle();
            this.appendChild(this.dropdownHandle);

            var filter = config.filter || this.defaultFilter;

            this.dropdownList = new DropdownList(<DropdownListConfig<OPTION_DISPLAY_VALUE>>{
                maxHeight: 200,
                width: this.input.getEl().getWidth(),
                optionDisplayValueViewer: config.optionDisplayValueViewer,
                filter: filter,
                dataIdProperty: config.dataIdProperty
            });
            if (filter) {
                this.dropdownList.setFilterArgs({searchString: ""});
            }

            this.dropdownList.onRowSelection((event: DropdownGridRowSelectedEvent) => {
                this.selectRow(event.getRow());
            });

            this.appendChild(this.dropdownList.getEmptyDropdown());
            this.appendChild(this.dropdownList.getDropdownGrid().getElement());

            this.selectedOptionView.onOpenDropdown(() => {
                this.showDropdown();
                this.giveFocus();
            });

            this.setupListeners();

            this.onRendered((event: ElementRenderedEvent) => {

                this.doUpdateDropdownTopPositionAndWidth();
            });
        }

        getInput(): DropdownOptionFilterInput {
            return this.input;
        }

        setEmptyDropdownText(label: string) {
            this.dropdownList.setEmptyDropdownText(label);
        }

        reset() {
            this.input.setValue("");
            this.input.show();
            this.selectedOptionView.hide();
            this.selectedOptionView.resetOption();
        }

        private defaultFilter(option: Option<OPTION_DISPLAY_VALUE>, args: any) {

            if (!args.searchString || StringHelper.isEmpty(args.searchString)) {
                return true;
            }

            var lowerCasedSearchString = args.searchString.toLowerCase();
            if (option.value.toLowerCase().indexOf(lowerCasedSearchString) > -1) {
                return true;
            }

            var displayVaueAsString = option.displayValue.toString();
            if (displayVaueAsString.toLowerCase().indexOf(lowerCasedSearchString) > -1) {
                return true;
            }

            var indices = option.indices;
            if (indices && indices.length > 0) {
                for (var i = 0; i < indices.length; i++) {
                    var index = indices[i];
                    if (index) {
                        if (index.toLocaleLowerCase().indexOf(lowerCasedSearchString) > -1) {
                            return true;
                        }
                    }
                }
            }

            return false;
        }

        private doUpdateDropdownTopPositionAndWidth() {
            var inputEl = this.input.getEl();
            this.dropdownList.setTopPx(inputEl.getHeightWithBorder() - inputEl.getBorderBottomWidth());
            this.dropdownList.setWidth(inputEl.getWidthWithBorder());
        }

        giveFocus(): boolean {
            // If input is hidden or disabled, try dropdown handler.
            return this.input.giveFocus() || this.dropdownHandle.giveFocus();
        }

        isDropdownShown(): boolean {
            return this.dropdownList.isDropdownShown();
        }

        showDropdown() {
            if (this.typeAhead) {
                this.input.show();
                this.selectedOptionView.hide();
            }

            this.doUpdateDropdownTopPositionAndWidth();

            var selectedOption = this.getSelectedOption();

            this.dropdownList.showDropdown(!!selectedOption ? [selectedOption] : null, this.isInputEmpty() ? this.noOptionsText : null);

            this.dropdownHandle.down();

            this.dropdownList.renderDropdownGrid();

            this.notifyExpanded();
        }

        hideDropdown() {
            if (this.selectedOptionView.getOption()) {
                this.input.hide();
                this.selectedOptionView.show();
            }
            else if (this.typeAhead) {
                this.input.show();
                this.selectedOptionView.hide();
            }
            this.dropdownHandle.up();
            this.dropdownList.hideDropdown();
        }

        setOptions(options: Option<OPTION_DISPLAY_VALUE>[]) {
            this.dropdownList.setOptions(options, this.isInputEmpty() ? this.noOptionsText : null);
        }

        private isInputEmpty(): boolean {
            return this.input.getValue() === "";
        }

        removeAllOptions() {
            this.dropdownList.removeAllOptions();
        }

        addOption(option: Option<OPTION_DISPLAY_VALUE>) {
            this.dropdownList.addOption(option);
        }

        hasOptions(): boolean {
            return this.dropdownList.hasOptions();
        }

        getOptionCount(): number {
            return this.dropdownList.getOptionCount();
        }

        getOptions(): Option<OPTION_DISPLAY_VALUE>[] {
            return this.dropdownList.getOptions();
        }

        getOptionByValue(value: string): Option<OPTION_DISPLAY_VALUE> {
            return this.dropdownList.getOptionByValue(value);
        }

        getOptionByRow(rowIndex: number): Option<OPTION_DISPLAY_VALUE> {
            return this.dropdownList.getOptionByRow(rowIndex);
        }

        setValue(value: string): DropdownInput<OPTION_DISPLAY_VALUE> {
            var option = this.getOptionByValue(value);
            if (option != null) {
                this.selectOption(option);
            }
            return this;
        }

        selectRow(index: number, silent: boolean = false, keyCode: number = -1) {
            var option = this.getOptionByRow(index);
            if (option != null) {
                this.selectOption(option, silent, keyCode);
                FormEl.moveFocusToNextFocusable(this.input);
            }
        }

        selectOption(option: Option<OPTION_DISPLAY_VALUE>, silent: boolean = false, keyCode: number = -1) {

            this.dropdownList.markSelections([option]);

            this.selectedOptionView.setOption(option);

            if (!silent) {
                this.notifyOptionSelected(option, keyCode);
            }

            this.hideDropdown();
        }

        getSelectedOption(): Option<OPTION_DISPLAY_VALUE> {
            return this.selectedOptionView.getOption();
        }

        getSelectedOptionView(): SelectedOptionView<OPTION_DISPLAY_VALUE> {
            return this.selectedOptionView;
        }

        getValue(): string {
            var selectedOption = this.getSelectedOption();
            if (!selectedOption) {
                return null;
            }
            return selectedOption.value;
        }

        setInputIconUrl(iconUrl: string) {
            if (!this.icon) {
                this.icon = new ImgEl();
                this.icon.addClass("input-icon");
                this.icon.insertBeforeEl(this.input);
            }

            this.icon.getEl().setSrc(iconUrl);
        }

        private setupListeners() {
            AppHelper.focusInOut(this, () => {
                this.hideDropdown();
                this.active = false;
            });

            this.dropdownHandle.onClicked((event: any) => {

                if (this.isDropdownShown()) {
                    this.hideDropdown();
                } else {
                    this.showDropdown();
                }
                this.giveFocus();
            });

            this.input.onValueChanged((event: ValueChangedEvent) => {

                this.notifyOptionFilterInputValueChanged(event.getOldValue(), event.getNewValue());

                this.dropdownList.setFilterArgs({searchString: event.getNewValue()});
                this.showDropdown();

                this.dropdownList.nagivateToFirstRow();

            });

            this.input.onDblClicked((event: MouseEvent) => {

                if (!this.isDropdownShown()) {
                    this.showDropdown();
                }
            });

            this.input.onKeyDown((event: KeyboardEvent) => {

                if (event.which == 9) { // tab
                    this.hideDropdown();
                    return;
                }
                else if (event.which == 16 || event.which == 17 || event.which == 18) {  // shift or ctrl or alt
                    return;
                }

                //this.dropdownList.navigateToFirstRowIfNotActive();

                if (!this.isDropdownShown()) {
                    this.showDropdown();
                    return;
                }

                if (event.which == 38) { // up
                    this.dropdownList.navigateToPreviousRow();
                } else if (event.which == 40) { // down
                    this.dropdownList.navigateToNextRow();
                } else if (event.which == 13) { // enter
                    this.selectRow(this.dropdownList.getActiveRow(), false, 13);
                    this.input.getEl().setValue("");
                    event.preventDefault();
                    event.stopPropagation();
                } else if (event.which == 27) { // esc
                    this.hideDropdown();
                }

                this.input.getHTMLElement().focus();
            });
        }

        onOptionSelected(listener: (event: OptionSelectedEvent<OPTION_DISPLAY_VALUE>)=>void) {
            this.optionSelectedListeners.push(listener);
        }

        unOptionSelected(listener: (event: OptionSelectedEvent<OPTION_DISPLAY_VALUE>)=>void) {
            this.optionSelectedListeners.filter((currentListener: (event: OptionSelectedEvent<OPTION_DISPLAY_VALUE>)=>void) => {
                return listener != currentListener;
            });
        }

        private notifyOptionSelected(item: Option<OPTION_DISPLAY_VALUE>, keyCode: number = -1) {
            var event = new OptionSelectedEvent<OPTION_DISPLAY_VALUE>(item, -1, keyCode);
            this.optionSelectedListeners.forEach((listener: (event: OptionSelectedEvent<OPTION_DISPLAY_VALUE>)=>void) => {
                listener(event);
            });
        }

        onOptionFilterInputValueChanged(listener: (event: OptionFilterInputValueChangedEvent<OPTION_DISPLAY_VALUE>)=>void) {
            this.optionFilterInputValueChangedListeners.push(listener);
        }

        unOptionFilterInputValueChanged(listener: (event: OptionFilterInputValueChangedEvent<OPTION_DISPLAY_VALUE>)=>void) {
            this.optionFilterInputValueChangedListeners.filter((currentListener: (event: OptionFilterInputValueChangedEvent<OPTION_DISPLAY_VALUE>)=>void) => {
                return listener != currentListener;
            })
        }

        private notifyOptionFilterInputValueChanged(oldValue: string, newValue: string) {
            var event = new OptionFilterInputValueChangedEvent<OPTION_DISPLAY_VALUE>(oldValue, newValue,
                this.dropdownList.getDropdownGrid().getElement());
            this.optionFilterInputValueChangedListeners.forEach((listener: (event: OptionFilterInputValueChangedEvent<OPTION_DISPLAY_VALUE>)=>void) => {
                listener(event);
            });
        }

        onExpanded(listener: (event: DropdownExpandedEvent)=>void) {
            this.expandedListeners.push(listener);
        }

        private notifyExpanded() {
            var event = new DropdownExpandedEvent(this.dropdownList.getDropdownGrid().getElement(), true);
            this.expandedListeners.forEach((listener: (event: DropdownExpandedEvent)=>void) => {
                listener(event);
            });
        }
    }
