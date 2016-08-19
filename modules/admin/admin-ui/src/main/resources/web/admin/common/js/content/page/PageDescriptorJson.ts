import {RegionsDescriptorJson} from "./region/RegionsDescriptorJson";
import {DescriptorJson} from "./DescriptorJson";

export interface PageDescriptorJson extends DescriptorJson {

        regions:RegionsDescriptorJson[];
    }
