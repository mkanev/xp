import {BaseLoader} from "../../../util/loader/BaseLoader";
import {LayoutDescriptor} from "./LayoutDescriptor";
import {LayoutDescriptorsJson} from "./LayoutDescriptorsJson";
import {LayoutDescriptorsResourceRequest} from "./LayoutDescriptorsResourceRequest";

export class LayoutDescriptorLoader extends BaseLoader<LayoutDescriptorsJson, LayoutDescriptor> {

        constructor(request: LayoutDescriptorsResourceRequest) {
            super(request);
        }

        filterFn(descriptor:LayoutDescriptor)
        {
            return descriptor.getDisplayName().toString().toLowerCase().indexOf(this.getSearchString().toLowerCase()) != -1;
        }

    }
