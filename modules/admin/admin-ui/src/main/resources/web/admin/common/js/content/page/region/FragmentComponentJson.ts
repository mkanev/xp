import {PropertyArrayJson} from "../../../data/PropertyArrayJson";
import {ComponentJson} from "./ComponentJson";

export interface FragmentComponentJson extends ComponentJson {

        fragment:string;

        config: PropertyArrayJson[];
    }
