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
import {PartDescriptor} from "./PartDescriptor";
import {PartDescriptorLoader} from "./PartDescriptorLoader";
import {PartDescriptorViewer} from "./PartDescriptorViewer";

export class PartDescriptorComboBox extends RichComboBox<PartDescriptor> {

        constructor(loader: PartDescriptorLoader) {
            super(new RichComboBoxBuilder<PartDescriptor>().setIdentifierMethod("getKey").setOptionDisplayValueViewer(
                new PartDescriptorViewer()).setSelectedOptionsView(new PartDescriptorSelectedOptionsView()).setLoader(
                loader).setMaximumOccurrences(1).setNextInputFocusWhenMaxReached(false).setNoOptionsText(
                "No parts available"));
        }

        getDescriptor(descriptorKey: DescriptorKey): PartDescriptor {
            var option = this.getOptionByValue(descriptorKey.toString());
            if (option) {
                return option.displayValue;
            }
            return null;
        }

        setDescriptor(descriptor: PartDescriptor) {

            this.clearSelection();
            if (descriptor) {
                var optionToSelect: Option<PartDescriptor> = this.getOptionByValue(descriptor.getKey().toString());
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

    export class PartDescriptorSelectedOptionsView extends BaseSelectedOptionsView<PartDescriptor> {

        createSelectedOption(option: Option<PartDescriptor>): SelectedOption<PartDescriptor> {
            return new SelectedOption<PartDescriptor>(new PartDescriptorSelectedOptionView(option), this.count());
        }
    }

    export class PartDescriptorSelectedOptionView extends BaseSelectedOptionView<PartDescriptor> {

        private descriptor: PartDescriptor;

        constructor(option: Option<PartDescriptor>) {
            this.descriptor = option.displayValue;
            super(option);
            this.addClass("part-descriptor-selected-option-view");
        }

        doRender(): wemQ.Promise<boolean> {
            
            var namesAndIconView = new NamesAndIconViewBuilder().setSize(NamesAndIconViewSize.small).build();
            namesAndIconView.setIconClass("icon-puzzle icon-medium")
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
