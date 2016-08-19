import {AggregationTypeWrapperJson} from "../../aggregation/AggregationTypeWrapperJson";
import {ContentMetadata} from "../ContentMetadata";
import {ContentIdBaseItemJson} from "./ContentIdBaseItemJson";

export interface ContentQueryResultJson<T extends ContentIdBaseItemJson> {

        aggregations:AggregationTypeWrapperJson[];
        contents:T[];
        metadata: ContentMetadata;
    }
