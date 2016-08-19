import {DescriptorJson} from "../DescriptorJson";
import {RegionsDescriptorJson} from "./RegionsDescriptorJson";

export interface LayoutDescriptorJson extends DescriptorJson {

        regions:RegionsDescriptorJson[];

    }
