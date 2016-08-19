import {DescriptorBasedDropdown} from "../DescriptorBasedDropdown";
import {LayoutDescriptor} from "./LayoutDescriptor";
import {LayoutDescriptorLoader} from "./LayoutDescriptorLoader";
import {LayoutDescriptorViewer} from "./LayoutDescriptorViewer";

export class LayoutDescriptorDropdown extends DescriptorBasedDropdown<LayoutDescriptor> {

        constructor(name: string, loader: LayoutDescriptorLoader) {

            super(name, loader, {
                optionDisplayValueViewer: new LayoutDescriptorViewer(),
                dataIdProperty: "value",
                noOptionsText: "No layouts available"
            });
        }
    }
