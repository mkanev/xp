import {TermsAggregationQueryJson} from "./TermsAggregationQueryJson";
import {DateRangeAggregationQueryJson} from "./DateRangeAggregationQueryJson";
import {DateRangeAggregationQuery} from "./DateRangeAggregationQuery";
import {TermsAggregationQuery} from "./TermsAggregationQuery";

export interface AggregationQueryTypeWrapperJson {

        TermsAggregationQuery?:TermsAggregationQueryJson;
        DateRangeAggregationQuery?:DateRangeAggregationQueryJson;

    }

