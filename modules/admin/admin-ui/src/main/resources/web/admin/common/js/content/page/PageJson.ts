import {RegionJson} from "./region/RegionJson";
import {ComponentJson} from "./region/ComponentJson";
import {PropertyArrayJson} from "../../data/PropertyArrayJson";

export interface PageJson {

        controller:string;

        template:string;

        regions: RegionJson[];

        fragment: ComponentJson;

        config: PropertyArrayJson[];

        customized: boolean;

    }
