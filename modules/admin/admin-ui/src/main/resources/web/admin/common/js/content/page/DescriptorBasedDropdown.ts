import {DropdownConfig} from "../../ui/selector/dropdown/DropdownInput";
import {Option} from "../../ui/selector/Option";
import {DescriptorKey} from "./DescriptorKey";
import {LoadedDataEvent} from "../../util/loader/event/LoadedDataEvent";
import {RichDropdown} from "../../ui/selector/dropdown/RichDropdown";
import {BaseLoader} from "../../util/loader/BaseLoader";
import {Descriptor} from "./Descriptor";

export class DescriptorBasedDropdown<DESCRIPTOR extends Descriptor> extends RichDropdown<DESCRIPTOR> {

        constructor(name: string, loader: BaseLoader<any, DESCRIPTOR>, dropdownConfig: DropdownConfig<DESCRIPTOR>) {
            super(name, loader, dropdownConfig);
        }

        protected createOption(descriptor: DESCRIPTOR): Option<DESCRIPTOR> {
            var indices: string[] = [];
            indices.push(descriptor.getDisplayName());
            indices.push(descriptor.getName().toString());

            var option = <Option<DESCRIPTOR>>{
                value: descriptor.getKey().toString(),
                displayValue: descriptor,
                indices: indices
            };

            return option;
        }

        setDescriptor(descriptor: Descriptor) {

            if (descriptor) {
                var option = this.getOptionByValue(descriptor.getKey().toString());
                if (option) {
                    this.selectOption(option, true);
                }
            } else {
                this.reset();
            }
        }

        getDescriptor(descriptorKey: DescriptorKey): DESCRIPTOR {
            if (descriptorKey) {
                var option = this.getOptionByValue(descriptorKey.toString());
                if (option) {
                    return option.displayValue;
                }
            }
            return null;
        }
    }
