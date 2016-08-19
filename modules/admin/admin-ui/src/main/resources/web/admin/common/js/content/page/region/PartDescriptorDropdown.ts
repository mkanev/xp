import {DescriptorBasedDropdown} from "../DescriptorBasedDropdown";
import {PartDescriptor} from "./PartDescriptor";
import {PartDescriptorLoader} from "./PartDescriptorLoader";
import {PartDescriptorViewer} from "./PartDescriptorViewer";

export class PartDescriptorDropdown extends DescriptorBasedDropdown<PartDescriptor> {

        constructor(name: string, loader: PartDescriptorLoader) {

            super(name, loader, {
                optionDisplayValueViewer: new PartDescriptorViewer(),
                dataIdProperty: "value",
                noOptionsText: "No parts available"
            });

        }
    }
