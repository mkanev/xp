import {BaseLoader} from "../../../util/loader/BaseLoader";
import {PartDescriptor} from "./PartDescriptor";
import {PartDescriptorsJson} from "./PartDescriptorsJson";
import {PartDescriptorsResourceRequest} from "./PartDescriptorsResourceRequest";

export class PartDescriptorLoader extends BaseLoader<PartDescriptorsJson, PartDescriptor> {

        constructor(request: PartDescriptorsResourceRequest) {
            super(request);
        }

        filterFn(descriptor: PartDescriptor) {
            return descriptor.getDisplayName().toString().toLowerCase().indexOf(this.getSearchString().toLowerCase()) != -1;
        }


    }
