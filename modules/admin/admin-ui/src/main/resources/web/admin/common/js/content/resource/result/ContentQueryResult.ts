import {ContentIdBaseItemJson} from "../../json/ContentIdBaseItemJson";
import {Aggregation} from "../../../aggregation/Aggregation";
import {ContentIdBaseItem} from "../../ContentIdBaseItem";
import {ContentMetadata} from "../../ContentMetadata";

export class ContentQueryResult<C extends ContentIdBaseItem,CJ extends ContentIdBaseItemJson> {

        private contents: C[];
        private aggregations: Aggregation[];
        private contentsAsJson: CJ[];
        private metadata: ContentMetadata;

        constructor(contents: C[], aggreations: Aggregation[], contentsAsJson: CJ[], metadata?: ContentMetadata) {
            this.contents = contents;
            this.aggregations = aggreations;
            this.contentsAsJson = contentsAsJson;
            this.metadata = metadata;
        }

        getContents(): C[] {
            return this.contents;
        }

        getContentsAsJson(): CJ[] {
            return this.contentsAsJson;
        }

        getAggregations(): Aggregation[] {
            return this.aggregations;
        }

        getMetadata(): ContentMetadata {
            return this.metadata;
        }
    }
