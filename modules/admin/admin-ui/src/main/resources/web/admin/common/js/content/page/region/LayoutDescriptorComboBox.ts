import {RichComboBox} from "../../../ui/selector/combobox/RichComboBox";
import {RichComboBoxBuilder} from "../../../ui/selector/combobox/RichComboBox";
import {ComboBoxConfig} from "../../../ui/selector/combobox/ComboBox";
import {Option} from "../../../ui/selector/Option";
import {SelectedOption} from "../../../ui/selector/combobox/SelectedOption";
import {BaseSelectedOptionView} from "../../../ui/selector/combobox/BaseSelectedOptionView";
import {BaseSelectedOptionsView} from "../../../ui/selector/combobox/BaseSelectedOptionsView";
import {DescriptorKey} from "../DescriptorKey";
import {NamesAndIconViewBuilder} from "../../../app/NamesAndIconView";
import {NamesAndIconViewSize} from "../../../app/NamesAndIconViewSize";
import {AEl} from "../../../dom/AEl";
import {Element} from "../../../dom/Element";
import {LayoutDescriptor} from "./LayoutDescriptor";
import {LayoutDescriptorLoader} from "./LayoutDescriptorLoader";
import {LayoutDescriptorViewer} from "./LayoutDescriptorViewer";

export class LayoutDescriptorComboBox extends RichComboBox<LayoutDescriptor> {

        constructor(loader: LayoutDescriptorLoader) {
            super(new RichComboBoxBuilder<LayoutDescriptor>().setIdentifierMethod("getKey").setOptionDisplayValueViewer(
                new LayoutDescriptorViewer()).setSelectedOptionsView(new LayoutDescriptorSelectedOptionsView()).setLoader(
                loader).setMaximumOccurrences(1).setNextInputFocusWhenMaxReached(false).setNoOptionsText(
                "No layouts available"));
        }

        getDescriptor(descriptorKey: DescriptorKey): LayoutDescriptor {
            var option = this.getOptionByValue(descriptorKey.toString());
            if (option) {
                return option.displayValue;
            }
            return null;
        }

        setDescriptor(descriptor: LayoutDescriptor) {

            this.clearSelection();
            if (descriptor) {
                var optionToSelect: Option<LayoutDescriptor> = this.getOptionByValue(descriptor.getKey().toString());
                if (!optionToSelect) {
                    optionToSelect = {
                        value: descriptor.getKey().toString(),
                        displayValue: descriptor
                    };
                    this.addOption(optionToSelect);
                }
                this.selectOption(optionToSelect);
            }
        }
    }

    export class LayoutDescriptorSelectedOptionsView extends BaseSelectedOptionsView<LayoutDescriptor> {

        createSelectedOption(option: Option<LayoutDescriptor>): SelectedOption<LayoutDescriptor> {
            return new SelectedOption<LayoutDescriptor>(new LayoutDescriptorSelectedOptionView(option), this.count());
        }
    }

    export class LayoutDescriptorSelectedOptionView extends BaseSelectedOptionView<LayoutDescriptor> {

        private descriptor: LayoutDescriptor;

        constructor(option: Option<LayoutDescriptor>) {
            this.descriptor = option.displayValue;
            super(option);
            this.addClass("layout-descriptor-selected-option-view");
        }

        doRender(): wemQ.Promise<boolean> {

            var namesAndIconView = new NamesAndIconViewBuilder().setSize(NamesAndIconViewSize.small).build();
            namesAndIconView.setIconClass("icon-earth icon-medium")
                .setMainName(this.descriptor.getDisplayName())
                .setSubName(this.descriptor.getKey().toString());

            var removeButtonEl = new AEl("remove");
            removeButtonEl.onClicked((event: MouseEvent) => {
                this.notifyRemoveClicked();

                event.stopPropagation();
                event.preventDefault();
                return false;
            });

            this.appendChildren<Element>(removeButtonEl, namesAndIconView);

            return wemQ(true);
        }

    }
