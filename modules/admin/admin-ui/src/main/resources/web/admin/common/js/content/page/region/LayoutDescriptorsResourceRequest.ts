import {LayoutDescriptor} from "./LayoutDescriptor";
import {LayoutDescriptorJson} from "./LayoutDescriptorJson";
import {LayoutDescriptorResourceRequest} from "./LayoutDescriptorResourceRequest";
import {LayoutDescriptorsJson} from "./LayoutDescriptorsJson";

export class LayoutDescriptorsResourceRequest extends LayoutDescriptorResourceRequest<LayoutDescriptorsJson, LayoutDescriptor[]> {

        fromJsonToLayoutDescriptors(json: LayoutDescriptorsJson): LayoutDescriptor[] {

            var array: LayoutDescriptor[] = [];
            json.descriptors.forEach((descriptorJson: LayoutDescriptorJson)=> {
                array.push(this.fromJsonToLayoutDescriptor(descriptorJson));
            });
            return array;
        }


    }
