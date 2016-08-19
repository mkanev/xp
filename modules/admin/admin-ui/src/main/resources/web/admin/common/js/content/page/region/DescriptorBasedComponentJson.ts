import {PropertyArrayJson} from "../../../data/PropertyArrayJson";
import {ComponentJson} from "./ComponentJson";

export interface DescriptorBasedComponentJson extends ComponentJson {

        descriptor:string;

        config: PropertyArrayJson[];
    }
