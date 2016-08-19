import {PropertyArrayJson} from "../../../data/PropertyArrayJson";
import {ComponentJson} from "./ComponentJson";

export interface ImageComponentJson extends ComponentJson {
        
        image:string;

        config: PropertyArrayJson[];
    }
