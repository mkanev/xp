import {NamesAndIconViewer} from "../../ui/NamesAndIconViewer";
import {PageDescriptor} from "./PageDescriptor";

export class PageDescriptorViewer extends NamesAndIconViewer<PageDescriptor> {

        constructor() {
            super();
        }

        resolveDisplayName(object: PageDescriptor): string {
            return object.getDisplayName();
        }

        resolveSubName(object: PageDescriptor, relativePath: boolean = false): string {
            return object.getKey().toString();
        }

        resolveIconClass(object: PageDescriptor): string {
            return "icon-file icon-large";
        }
    }

