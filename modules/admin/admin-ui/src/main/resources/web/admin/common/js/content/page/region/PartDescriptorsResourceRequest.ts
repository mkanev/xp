import {PartDescriptor} from "./PartDescriptor";
import {PartDescriptorJson} from "./PartDescriptorJson";
import {PartDescriptorResourceRequest} from "./PartDescriptorResourceRequest";
import {PartDescriptorsJson} from "./PartDescriptorsJson";

export class PartDescriptorsResourceRequest extends PartDescriptorResourceRequest<PartDescriptorsJson, PartDescriptor[]> {

        fromJsonToPartDescriptors(json: PartDescriptorsJson): PartDescriptor[] {

            var array: PartDescriptor[] = [];
            json.descriptors.forEach((descriptorJson: PartDescriptorJson)=> {
                array.push(this.fromJsonToPartDescriptor(descriptorJson));
            });
            return array;
        }
    }
