import {RangeFilterJson} from "./RangeFilterJson";
import {BooleanFilterJson} from "./BooleanFilterJson";
import {BooleanFilter} from "./BooleanFilter";
import {RangeFilter} from "./RangeFilter";

export interface FilterTypeWrapperJson {

        RangeFilter?: RangeFilterJson;
        BooleanFilter?: BooleanFilterJson;

    }

