import {NamesAndIconViewer} from "../../../ui/NamesAndIconViewer";
import {PartDescriptor} from "./PartDescriptor";

export class PartDescriptorViewer extends NamesAndIconViewer<PartDescriptor> {

        constructor() {
            super();
        }

        resolveDisplayName(object: PartDescriptor): string {
            return object.getDisplayName();
        }

        resolveSubName(object: PartDescriptor, relativePath: boolean = false): string {
            return object.getKey().toString();
        }

        resolveIconClass(object: PartDescriptor): string {
            return "icon-puzzle icon-large";
        }
    }
