module api.content.page.part {

    import RichComboBox = api.ui.selector.combobox.RichComboBox;
    import RichComboBoxBuilder = api.ui.selector.combobox.RichComboBoxBuilder;
    import ComboBoxConfig = api.ui.selector.combobox.ComboBoxConfig;
    import Option = api.ui.selector.Option;
    import SelectedOption = api.ui.selector.combobox.SelectedOption;
    import SelectedOptionView = api.ui.selector.combobox.SelectedOptionView;
    import SelectedOptionsView = api.ui.selector.combobox.SelectedOptionsView;
    import DescriptorKey = api.content.page.DescriptorKey;

    export class PartDescriptorComboBox extends RichComboBox<PartDescriptor> {

        constructor(loader: PartDescriptorLoader) {
            super(new RichComboBoxBuilder<PartDescriptor>().
                setIdentifierMethod("getKey").
                setOptionDisplayValueViewer(new PartDescriptorViewer()).
                setSelectedOptionsView(new PartDescriptorSelectedOptionsView()).
                setLoader(loader).
                setMaximumOccurrences(1).
                setNextInputFocusWhenMaxReached(false));
        }

        setDescriptor(key: DescriptorKey) {

            var descriptorToSelect: PartDescriptor;

            this.getValues().forEach((descriptor: PartDescriptor) => {
                if (descriptor.getKey().toString() == key.toString()) {
                    descriptorToSelect = descriptor;
                }
            });
            if (!descriptorToSelect) {
                return;
            }

            var option: Option<PartDescriptor> = {
                value: descriptorToSelect.getKey().toString(),
                displayValue: descriptorToSelect
            };
            this.comboBox.clearSelection();
            this.comboBox.selectOption(option);
        }

        getSelectedOptions(): Option<PartDescriptor>[] {
            return this.comboBox.getSelectedOptions();
        }

    }

    export class PartDescriptorSelectedOptionsView extends SelectedOptionsView<PartDescriptor> {

        createSelectedOption(option: Option<PartDescriptor>, index: number): SelectedOption<PartDescriptor> {
            return new SelectedOption<PartDescriptor>(new PartDescriptorSelectedOptionView(option), option, index);
        }
    }

    export class PartDescriptorSelectedOptionView extends SelectedOptionView<PartDescriptor> {

        private descriptor: PartDescriptor;

        constructor(option: Option<PartDescriptor>) {
            this.descriptor = option.displayValue;
            super(option);
            this.addClass("part-descriptor-selected-option-view");
        }

        layout() {
            var namesAndIconView = new api.app.NamesAndIconViewBuilder().setSize(api.app.NamesAndIconViewSize.small).build();
            namesAndIconView.setIconClass("icon-puzzle icon-medium")
                .setMainName(this.descriptor.getDisplayName())
                .setSubName(this.descriptor.getName().toString());

            var removeButtonEl = new api.dom.AEl("remove");
            removeButtonEl.onClicked((event: MouseEvent) => {
                this.notifySelectedOptionRemoveRequested();

                event.stopPropagation();
                event.preventDefault();
                return false;
            });

            this.appendChild(removeButtonEl);
            this.appendChild(namesAndIconView);
        }

    }
}