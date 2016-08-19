import {Option} from "../../selector/Option";
import {SelectedOption} from "../../selector/combobox/SelectedOption";
import {BaseSelectedOptionView} from "../../selector/combobox/BaseSelectedOptionView";
import {Permission} from "../../../security/acl/Permission";
import {AccessControlEntry} from "../../../security/acl/AccessControlEntry";
import {AccessControlEntryLoader} from "../../../security/acl/AccessControlEntryLoader";
import {SelectedOptionEvent} from "../../selector/combobox/SelectedOptionEvent";
import {RichComboBox} from "../../selector/combobox/RichComboBox";
import {RichComboBoxBuilder} from "../../selector/combobox/RichComboBox";
import {SelectedOptionView} from "../../selector/combobox/SelectedOptionView";
import {SelectedOptionsView} from "../../selector/combobox/SelectedOptionsView";
import {assertNotNull} from "../../../util/Assert";
import {ArrayHelper} from "../../../util/ArrayHelper";
import {AccessControlEntryView} from "./AccessControlEntryView";
import {AccessControlEntryViewer} from "./AccessControlEntryViewer";
import {AccessControlListView} from "./AccessControlListView";

export class AccessControlComboBox extends RichComboBox<AccessControlEntry> {

        private aceSelectedOptionsView: ACESelectedOptionsView;

        constructor() {
            this.aceSelectedOptionsView = new ACESelectedOptionsView();

            var builder = new RichComboBoxBuilder<AccessControlEntry>().
                setMaximumOccurrences(0).
                setComboBoxName("principalSelector").
                setIdentifierMethod("getPrincipalKey").
                setLoader(new AccessControlEntryLoader()).
                setHideComboBoxWhenMaxReached(false).
                setSelectedOptionsView(this.aceSelectedOptionsView).
                setOptionDisplayValueViewer(new AccessControlEntryViewer()).
                setDelayedInputValueChangedHandling(500);
            super(builder);
        }

        setEditable(editable: boolean) {
            this.getSelectedOptions().forEach((option: SelectedOption<AccessControlEntry>) => {
                (<ACESelectedOptionView>option.getOptionView()).setEditable(editable);
            });
        }

        onOptionValueChanged(listener: (item: AccessControlEntry) => void) {
            this.aceSelectedOptionsView.onItemValueChanged(listener);
        }

        unItemValueChanged(listener: (item: AccessControlEntry) => void) {
            this.aceSelectedOptionsView.unItemValueChanged(listener);
        }
    }

    class ACESelectedOptionView extends AccessControlEntryView implements SelectedOptionView<AccessControlEntry> {

        private option: Option<AccessControlEntry>;

        constructor(option: Option<AccessControlEntry>) {
            var ace = option.displayValue;
            if (ace.getAllowedPermissions().length == 0 && ace.getDeniedPermissions().length == 0) {
                // allow read by default
                ace.allow(Permission.READ);
            }
            super(ace);
            this.option = option;
        }

        setOption(option: Option<AccessControlEntry>) {
            this.option = option;
            this.setAccessControlEntry(option.displayValue);
        }

        getOption(): Option<AccessControlEntry> {
            return this.option;
        }

    }

    class ACESelectedOptionsView extends AccessControlListView implements SelectedOptionsView<AccessControlEntry> {

        private maximumOccurrences: number;
        private list: SelectedOption<AccessControlEntry>[] = [];

        private selectedOptionRemovedListeners: {(removed: SelectedOptionEvent<AccessControlEntry>): void;}[] = [];
        private selectedOptionAddedListeners: {(added: SelectedOptionEvent<AccessControlEntry>): void;}[] = [];

        constructor(className?: string) {
            super(className);
        }

        setMaximumOccurrences(value: number) {
            this.maximumOccurrences = value;
        }

        getMaximumOccurrences(): number {
            return this.maximumOccurrences;
        }

        createSelectedOption(option: Option<AccessControlEntry>): SelectedOption<AccessControlEntry> {
            throw new Error('Not supported, use createItemView instead');
        }

        createItemView(entry: AccessControlEntry): ACESelectedOptionView {

            var option = {
                displayValue: entry,
                value: this.getItemId(entry)
            };
            var itemView = new ACESelectedOptionView(option);
            itemView.onValueChanged((item: AccessControlEntry) => {
                // update our selected options list with new values
                var selectedOption = this.getById(item.getPrincipalKey().toString());
                if (selectedOption) {
                    selectedOption.getOption().displayValue = item;
                }
                this.notifyItemValueChanged(item);
            });
            var selectedOption = new SelectedOption<AccessControlEntry>(itemView, this.list.length);

            itemView.onRemoveClicked(() => this.removeOption(option, false));

            // keep track of selected options for SelectedOptionsView
            this.list.push(selectedOption);
            return itemView;
        }


        addOption(option: Option<AccessControlEntry>, silent: boolean = false, keyCode: number = -1): boolean {
            this.addItem(option.displayValue);

            if (!silent) {
                var selectedOption = this.getByOption(option);
                this.notifySelectedOptionAdded(new SelectedOptionEvent(selectedOption, keyCode));
            }
            return true;
        }

        removeOption(optionToRemove: Option<AccessControlEntry>, silent: boolean = false) {
            assertNotNull(optionToRemove, "optionToRemove cannot be null");

            var selectedOption = this.getByOption(optionToRemove);
            assertNotNull(selectedOption, "Did not find any selected option to remove from option: " + optionToRemove.value);

            this.removeItem(optionToRemove.displayValue);

            this.list = this.list.filter((option: SelectedOption<AccessControlEntry>) => {
                return option.getOption().value != selectedOption.getOption().value;
            });

            // update item indexes to the right of removed item
            if (selectedOption.getIndex() < this.list.length) {
                for (var i: number = selectedOption.getIndex(); i < this.list.length; i++) {
                    this.list[i].setIndex(i);
                }
            }

            if (!silent) {
                this.notifySelectedOptionRemoved(new SelectedOptionEvent(selectedOption));
            }
        }

        count(): number {
            return this.list.length;
        }

        getSelectedOptions(): SelectedOption<AccessControlEntry>[] {
            return this.list;
        }

        getByIndex(index: number): SelectedOption<AccessControlEntry> {
            return this.list[index];
        }

        getByOption(option: Option<AccessControlEntry>): SelectedOption<AccessControlEntry> {
            return this.getById(option.value);
        }

        getById(id: string): SelectedOption<AccessControlEntry> {
            return this.list.filter((selectedOption: SelectedOption<AccessControlEntry>) => {
                return selectedOption.getOption().value == id;
            })[0];
        }

        isSelected(option: Option<AccessControlEntry>): boolean {
            return this.getByOption(option) != null;
        }

        maximumOccurrencesReached(): boolean {
            if (this.maximumOccurrences == 0) {
                return false;
            }
            return this.count() >= this.maximumOccurrences;
        }

        moveOccurrence(formIndex: number, toIndex: number) {
            ArrayHelper.moveElement(formIndex, toIndex, this.list);
            ArrayHelper.moveElement(formIndex, toIndex, this.getChildren());

            this.list.forEach((selectedOption: SelectedOption<AccessControlEntry>, index: number) => selectedOption.setIndex(index));
        }

        private notifySelectedOptionRemoved(removed: SelectedOptionEvent<AccessControlEntry>) {
            this.selectedOptionRemovedListeners.forEach((listener) => {
                listener(removed);
            });
        }

        onOptionDeselected(listener: {(removed: SelectedOptionEvent<AccessControlEntry>): void;}) {
            this.selectedOptionRemovedListeners.push(listener);
        }

        unOptionDeselected(listener: {(removed: SelectedOptionEvent<AccessControlEntry>): void;}) {
            this.selectedOptionRemovedListeners = this.selectedOptionRemovedListeners.filter(function (curr) {
                return curr != listener;
            });
        }

        onOptionSelected(listener: {(added: SelectedOptionEvent<AccessControlEntry>): void;}) {
            this.selectedOptionAddedListeners.push(listener);
        }

        unOptionSelected(listener: {(added: SelectedOptionEvent<AccessControlEntry>): void;}) {
            this.selectedOptionAddedListeners = this.selectedOptionAddedListeners.filter(function (curr) {
                return curr != listener;
            });
        }

        private notifySelectedOptionAdded(added: SelectedOptionEvent<AccessControlEntry>) {
            this.selectedOptionAddedListeners.forEach((listener) => {
                listener(added);
            });
        }

        onOptionMoved(listener: {(moved: SelectedOption<AccessControlEntry>): void;}) {
        }

        unOptionMoved(listener: {(moved: SelectedOption<AccessControlEntry>): void;}) {
        }

    }

